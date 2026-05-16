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
 */

import {
  useActor as useCaffeineActor,
  useInternetIdentity,
} from "@caffeineai/core-infrastructure";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActorCompat = Record<string, (...args: any[]) => Promise<any>>;

const AUTH_STALL_MS = 30_000;

interface UseActorResult {
  actor: ActorCompat | null;
  isFetching: boolean;
  /** True if the actor has been loading for >30 s without resolving — treat as session stall */
  authStalled: boolean;
  /** The identity is present but actor is null (anonymous principal — login required) */
  isAnonymous: boolean;
}

export function useActor(): UseActorResult {
  // createActor matches the createActorFunction<T> signature expected by
  // useCaffeineActor — it receives (canisterId, uploadFile, downloadFile, options)
  // from createActorWithConfig inside the Caffeine runtime.
  const { actor, isFetching } = useCaffeineActor(createActor);
  const { identity, isInitializing } = useInternetIdentity();

  const [authStalled, setAuthStalled] = useState(false);
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start a stall timer when fetching begins; clear it when actor resolves or
  // fetching stops. If the timer fires, mark as stalled.
  useEffect(() => {
    if (isFetching && !actor) {
      // Kick off stall detection
      stallTimerRef.current = setTimeout(() => {
        setAuthStalled(true);
      }, AUTH_STALL_MS);
    } else {
      // Actor arrived or fetching stopped — clear any pending stall timer
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
  }, [isFetching, actor]);

  // isAnonymous: identity is initializing is done AND there is no identity —
  // meaning the user is not authenticated (anonymous principal).
  const isAnonymous = !isInitializing && !identity && !isFetching;

  return {
    actor: actor as ActorCompat | null,
    isFetching,
    authStalled,
    isAnonymous,
  };
}
