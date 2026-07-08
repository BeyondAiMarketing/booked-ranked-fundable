/**
 * useActor — wires the Caffeine core-infrastructure hook to the generated
 * backend bindings so every page that calls `useActor()` gets a live,
 * authenticated actor connected to the deployed canister.
 *
 * The hook returns `{ actor: null, isFetching: true }` while the identity is
 * loading, and `{ actor: <Backend>, isFetching: false }` once ready.  Pages
 * that guard with `if (!actor) return;` continue to work without change.
 *
 * AUTH STALL DETECTION: If isFetching has been true for >30 seconds with no
 * actor appearing, `authStalled` is set to true so pages can show a re-auth
 * prompt instead of an infinite spinner.
 *
 * BACKEND UNREACHABLE DETECTION: When the Caffeine runtime cannot resolve a
 * valid canister ID (missing/stale/'undefined' env, stopped canister, malformed
 * ID), `createActorWithConfig` throws. React Query swallows that error into
 * `actorQuery.error` and `useCaffeineActor` only returns `{ actor, isFetching }`
 * — never the error. Without this hook's intervention, `isAnonymous` would then
 * evaluate to true (no identity + not fetching), making a backend-unreachable
 * failure indistinguishable from a logged-out user. Pages would then either
 * silently render nothing or proceed against a stopped canister and hit IC0508.
 *
 * To prevent that, this hook wraps `createActor` in a validator that throws a
 * typed `BackendUnreachableError` early when the resolved canister ID is
 * 'undefined', empty, or malformed (IC canister ID format check). The thrown
 * error is captured via a synchronous side-channel (a ref the wrapper writes to
 * before React Query can swallow it) and surfaced to callers as `backendError`
 * and `isBackendUnreachable`. When `isBackendUnreachable` is true, `isAnonymous`
 * is forced to false so callers cannot mistake a backend outage for a
 * logged-out session — pages should branch on `isBackendUnreachable` first and
 * render a clear "backend not reachable" message instead of a login prompt.
 *
 * PERSISTENCE: The canister ID is resolved dynamically by the Caffeine runtime
 * via `loadConfig()` (fetches `/env.json`, falls back to
 * `process.env.CANISTER_ID_BACKEND` injected at deploy time). This hook does
 * NOT hardcode any canister ID — the dynamic resolution is the persistent,
 * redeploy-safe path. The validator only rejects clearly-invalid values
 * ('undefined', empty, malformed) so it never overrides a legitimate
 * deploy-injected ID.
 */

import {
  useActor as useCaffeineActor,
  useInternetIdentity,
} from "@caffeineai/core-infrastructure";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActorCompat = Record<string, (...args: any[]) => Promise<any>>;

const AUTH_STALL_MS = 30_000;

/**
 * Typed error raised when the backend canister cannot be reached because the
 * resolved canister ID is missing, stale, 'undefined', or malformed. Pages can
 * branch on `instanceof BackendUnreachableError` (or on the hook's
 * `isBackendUnreachable` flag) to render a clear outage message.
 */
export class BackendUnreachableError extends Error {
  readonly reason:
    | "missing_canister_id"
    | "undefined_canister_id"
    | "malformed_canister_id";
  readonly resolvedCanisterId: unknown;

  constructor(
    reason: BackendUnreachableError["reason"],
    resolvedCanisterId: unknown,
    message?: string,
  ) {
    const detail =
      message ??
      (reason === "missing_canister_id"
        ? "Backend canister ID is missing. The deploy may not have injected CANISTER_ID_BACKEND and /env.json is unavailable."
        : reason === "undefined_canister_id"
          ? "Backend canister ID resolved to the literal string 'undefined'. The deploy-injected env is stale or absent."
          : "Backend canister ID is malformed (not a valid IC canister identifier). The deploy may have injected an invalid value.");
    super(`Backend unreachable: ${detail}`);
    this.name = "BackendUnreachableError";
    this.reason = reason;
    this.resolvedCanisterId = resolvedCanisterId;
  }
}

/**
 * Validates a resolved canister ID against the IC canister identifier format.
 *
 * IC canister IDs are textual encodings of a CRC32-prefixed principal:
 *   - 5–20 groups of 5 base32 (a–z2–7) chars, separated by '-'.
 *   - The reserved anonymous principal is the literal `aaaaa-aa`.
 *   - Total length (excluding dashes) is 27 chars for a standard canister.
 *
 * We deliberately reject the literal string 'undefined' (the symptom of a
 * missing `process.env.CANISTER_ID_BACKEND`), empty strings, whitespace-only
 * strings, and anything that does not match the base32-grouped pattern. We do
 * NOT validate the CRC32 checksum here — that is the replica's job — we only
 * catch the failure early enough to avoid proceeding against a stopped canister
 * and hitting IC0508.
 *
 * Returns the typed reason for the failure, or `null` if the ID is valid.
 */
function validateCanisterId(
  id: unknown,
): BackendUnreachableError["reason"] | null {
  if (id === undefined || id === null) return "missing_canister_id";
  if (typeof id !== "string") return "malformed_canister_id";
  const trimmed = id.trim();
  if (trimmed.length === 0) return "missing_canister_id";
  if (trimmed === "undefined" || trimmed === "null")
    return "undefined_canister_id";
  // IC canister ID: groups of 5 base32 chars (a-z2-7) joined by '-'.
  // Anonymous principal 'aaaaa-aa' is the only short form (5 + 2 chars).
  // Standard canister IDs are 27 base32 chars in groups of 5 (5*5 + 2 = 27).
  const icCanisterPattern = /^[a-z2-7]{5}(?:-[a-z2-7]{5})*-[a-z2-7]{1,5}$/;
  if (!icCanisterPattern.test(trimmed)) return "malformed_canister_id";
  return null;
}

interface UseActorResult {
  actor: ActorCompat | null;
  isFetching: boolean;
  /** True if the actor has been loading for >30 s without resolving — treat as session stall */
  authStalled: boolean;
  /** The identity is present but actor is null (anonymous principal — login required) */
  isAnonymous: boolean;
  /**
   * The authenticated Internet Identity principal, or null while the II session
   * is not active / still initializing. Pages that issue authenticated backend
   * writes (e.g. saveIntegrationCredentials, Lead Engine Step 1 importer, live
   * SMS/email send paths) MUST gate on `!!identity` rather than `!isAnonymous` —
   * the actor returned by the Caffeine runtime can lag behind identity state,
   * so `isAnonymous` may already be false while the actor is still the
   * anonymous one built before identity loaded. Gating on `identity` guarantees
   * the actor has been (re)built with the real principal.
   */
  identity: unknown;
  /**
   * True when the backend canister cannot be reached because the resolved
   * canister ID is missing, stale, 'undefined', or malformed. Pages MUST branch
   * on this BEFORE checking `isAnonymous`/`actor` and render a clear
   * "backend not reachable" message instead of a login prompt or empty view.
   * When true, `isAnonymous` is forced to false so a backend outage is never
   * mistaken for a logged-out session.
   */
  isBackendUnreachable: boolean;
  /** The typed error when `isBackendUnreachable` is true, otherwise null. */
  backendError: BackendUnreachableError | null;
}

export function useActor(): UseActorResult {
  // Side-channel for capturing the typed error that the Caffeine runtime
  // otherwise swallows into React Query's actorQuery.error. The wrapped
  // createActor writes here synchronously before the runtime can absorb the
  // throw, so the hook can surface it to callers on the next render.
  const backendErrorRef = useRef<BackendUnreachableError | null>(null);
  const [backendError, setBackendError] =
    useState<BackendUnreachableError | null>(null);

  // Wrap createActor so that when the runtime resolves a bad canister ID we
  // throw a typed BackendUnreachableError early — before any network call
  // against a stopped canister. The error is captured in the ref so it is not
  // lost when React Query swallows it. We do NOT hardcode the canister ID; the
  // runtime still resolves it dynamically via loadConfig() → /env.json →
  // process.env.CANISTER_ID_BACKEND. The wrapper only rejects clearly-invalid
  // values so a legitimate deploy-injected ID passes through untouched.
  const wrappedCreateActor = useRef(
    (...args: Parameters<typeof createActor>) => {
      // The Caffeine runtime calls createActor(canisterId, uploadFile,
      // downloadFile, options). The canister ID is the first argument. It may
      // be undefined if loadConfig() failed to resolve one.
      const resolvedId = args[0];
      const reason = validateCanisterId(resolvedId);
      if (reason !== null) {
        const err = new BackendUnreachableError(reason, resolvedId);
        backendErrorRef.current = err;
        throw err;
      }
      // Clear any previously captured error now that we have a valid ID.
      backendErrorRef.current = null;
      return createActor(...args);
    },
  ).current;

  const { actor, isFetching } = useCaffeineActor(wrappedCreateActor);
  const { identity, isInitializing } = useInternetIdentity();

  const [authStalled, setAuthStalled] = useState(false);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Surface the side-channel error to React state so callers can read it.
  // The wrapped createActor writes to backendErrorRef synchronously during the
  // actor-creation attempt; we mirror it into state on every render so the UI
  // updates. We also clear the error when an actor successfully resolves.
  useEffect(() => {
    if (actor) {
      // Actor resolved — clear any stale backend error.
      backendErrorRef.current = null;
      if (backendError !== null) setBackendError(null);
      return;
    }
    if (backendErrorRef.current && backendErrorRef.current !== backendError) {
      setBackendError(backendErrorRef.current);
    }
  }, [actor, backendError]);

  // Start a stall timer when fetching begins; clear it when actor resolves or
  // fetching stops. If the timer fires, mark as stalled. Skip stall detection
  // when we already have a definitive backend-unreachable error — the user
  // should see the outage message, not a stall spinner.
  useEffect(() => {
    if (backendError) {
      if (stallTimerRef.current !== null) {
        clearTimeout(stallTimerRef.current);
        stallTimerRef.current = null;
      }
      setAuthStalled(false);
      return;
    }
    if (isFetching && !actor) {
      stallTimerRef.current = setTimeout(() => {
        setAuthStalled(true);
      }, AUTH_STALL_MS);
    } else {
      if (stallTimerRef.current !== null) {
        clearTimeout(stallTimerRef.current);
        stallTimerRef.current = null;
      }
      setAuthStalled(false);
    }
    return () => {
      if (stallTimerRef.current !== null) {
        clearTimeout(stallTimerRef.current);
      }
    };
  }, [isFetching, actor, backendError]);

  const isBackendUnreachable = backendError !== null;

  // isAnonymous: identity initialization is done AND there is no identity AND
  // we are not still fetching AND the backend is reachable — meaning the user
  // is genuinely not authenticated (anonymous principal). When the backend is
  // unreachable we force isAnonymous to false so a backend outage is never
  // mistaken for a logged-out session; pages must branch on
  // `isBackendUnreachable` first.
  const isAnonymous =
    !isBackendUnreachable && !isInitializing && !identity && !isFetching;

  return {
    actor: actor as ActorCompat | null,
    isFetching,
    authStalled,
    isAnonymous,
    identity,
    isBackendUnreachable,
    backendError,
  };
}
