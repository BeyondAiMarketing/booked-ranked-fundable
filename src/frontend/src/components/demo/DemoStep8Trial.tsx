import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle,
  DollarSign,
  Loader2,
  RefreshCw,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useDemoFlow } from "../../hooks/useDemoFlow";

type Phase = "loading" | "success" | "expired";

interface ActivationError {
  message: string;
  retryable: boolean;
}

interface StepDef {
  key: string;
  label: (businessName: string, city: string) => string;
}

const LOADING_STEPS: StepDef[] = [
  { key: "frontdesk", label: (b) => `Configuring AI Front Desk for ${b}...` },
  { key: "crm", label: (b) => `Loading CRM pipeline for ${b}...` },
  {
    key: "followup",
    label: () => "Setting up estimate follow-up sequences...",
  },
  {
    key: "reputation",
    label: (_b, c) => `Activating reputation engine for ${c || "your area"}...`,
  },
  {
    key: "funding",
    label: () => "Building your funding-readiness dashboard...",
  },
  { key: "ready", label: (b) => `${b} command center is ready!` },
];

function resolveSession(sessionData: Record<string, string | undefined>) {
  if (sessionData && (sessionData as any).businessName) return sessionData;
  try {
    const stored = sessionStorage.getItem("demoFlowSession");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.businessName) return parsed;
    }
  } catch {}
  try {
    const brfDemo = sessionStorage.getItem("brfDemo");
    if (brfDemo) {
      const parsed = JSON.parse(brfDemo);
      if (parsed?.businessName) return parsed;
    }
  } catch {}
  return null;
}

/**
 * Classify a thrown error from the actor call so we can surface a specific,
 * user-readable message instead of letting it bubble to ErrorBoundary's
 * generic "Something went wrong" fallback.
 *
 * Returns one of:
 *  - "anonymous"  : the actor was built with the anonymous principal
 *  - "transport"   : network / canister unreachable
 *  - "malformed"   : actor missing the expected method (construction failure)
 *  - "unknown"     : anything else
 */
function classifyActorError(error: unknown): {
  kind: "anonymous" | "transport" | "malformed" | "unknown";
  detail: string;
} {
  const raw =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : String(error ?? "");
  const lower = raw.toLowerCase();

  // Anonymous-principal rejections from the canister typically mention
  // "anonymous", "unauthorized", "auth", or "principal".
  if (
    lower.includes("anonymous") ||
    lower.includes("unauthorized") ||
    lower.includes("not authenticated") ||
    lower.includes("no caller") ||
    lower.includes("principal")
  ) {
    return { kind: "anonymous", detail: raw };
  }

  // Transport / network failures mention connection, timeout, fetch, or
  // replica errors.
  if (
    lower.includes("network") ||
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("fetch") ||
    lower.includes("connection") ||
    lower.includes("replica") ||
    lower.includes("canister") ||
    lower.includes("http") ||
    lower.includes("transport")
  ) {
    return { kind: "transport", detail: raw };
  }

  // Actor construction / missing method — the actor object exists but
  // activateTrial is not a callable function.
  if (
    lower.includes("is not a function") ||
    lower.includes("not a function") ||
    lower.includes("undefined") ||
    lower.includes("cannot read")
  ) {
    return { kind: "malformed", detail: raw };
  }

  return { kind: "unknown", detail: raw };
}

export default function DemoStep8Trial() {
  const navigate = useNavigate();
  const { sessionData } = useDemoFlow();
  const { loginDemo } = useApp();
  const { actor, isFetching, isAnonymous, identity } = useActor();

  const session = resolveSession(sessionData as any);

  const firstName = session?.firstName || "there";
  const businessName = session?.businessName || "Your Business";
  const city = session?.city || "";
  const niche = session?.niche || "Roofing";
  const email = session?.email || "";

  const [phase, setPhase] = useState<Phase>(session ? "loading" : "expired");
  const [completedSteps, setCompletedSteps] = useState(0);
  const [activationError, setActivationError] =
    useState<ActivationError | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  // Stable refs so the interval callback always sees latest values without
  // triggering effect re-runs.
  const loginCalledRef = useRef(false);
  const loginDemoRef = useRef(loginDemo);
  const sessionRef = useRef({ firstName, businessName, niche, city });
  useEffect(() => {
    loginDemoRef.current = loginDemo;
  }, [loginDemo]);
  useEffect(() => {
    sessionRef.current = { firstName, businessName, niche, city };
  }, [firstName, businessName, niche, city]);

  useEffect(() => {
    if (phase !== "loading") return;
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setCompletedSteps(step);

      if (step === 3 && !loginCalledRef.current) {
        loginCalledRef.current = true;
        try {
          loginDemoRef.current(sessionRef.current);
        } catch (_e) {
          // non-fatal — continue loading animation
        }
      }

      if (step >= LOADING_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("success"), 600);
      }
    }, 650);

    return () => clearInterval(interval);
  }, [phase]);

  // Session expired fallback
  if (phase === "expired") {
    return (
      <div
        className="min-h-screen bg-gray-950 flex items-center justify-center p-6"
        data-ocid="demo.activation.expired_state"
      >
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Session Expired
          </h2>
          <p className="text-gray-400 mb-6">
            It looks like your demo session timed out. Let's start fresh — your
            roofing demo is ready when you are.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/roofing" })}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            data-ocid="demo.activation.back_to_roofing.button"
          >
            Back to Roofing Demo
          </button>
        </div>
      </div>
    );
  }

  // Loading phase
  if (phase === "loading") {
    return (
      <div
        className="min-h-screen bg-gray-950 flex items-center justify-center p-6"
        data-ocid="demo.activation.loading_state"
      >
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-blue-300 text-sm font-medium">
                Building Your Command Center
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Assembling <span className="text-blue-400">{businessName}</span>
            </h2>
            <p className="text-gray-400">
              Your AI-powered roofing operating system is being configured...
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            {LOADING_STEPS.map((step, index) => {
              const isComplete = completedSteps > index;
              const isActive = completedSteps === index;
              const label = step.label(businessName, city);
              return (
                <div
                  key={step.key}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isComplete || isActive ? "opacity-100" : "opacity-25"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isComplete
                        ? "bg-green-500"
                        : isActive
                          ? "bg-blue-500 animate-pulse"
                          : "bg-white/10"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : isActive ? (
                      <Loader2 className="w-3 h-3 text-white animate-spin" />
                    ) : (
                      <div className="w-2 h-2 bg-white/30 rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isComplete
                        ? "text-green-400"
                        : isActive
                          ? "text-blue-300"
                          : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-gray-500 text-xs mt-4">
            No credit card required &bull; 7-day full access &bull; Cancel
            anytime
          </p>
        </div>
      </div>
    );
  }

  // Success phase
  return (
    <div
      className="min-h-screen bg-gray-950 flex items-center justify-center p-6"
      data-ocid="demo.activation.success_state"
    >
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, <span className="text-blue-400">{firstName}!</span>
          </h2>
          <p className="text-xl text-gray-300">
            Your <strong className="text-white">{businessName}</strong> command
            center is live.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Business
              </p>
              <p className="text-white font-medium">{businessName}</p>
            </div>
          </div>
          {city && (
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Market
                </p>
                <p className="text-white font-medium">{city}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Industry
              </p>
              <p className="text-white font-medium capitalize">{niche}</p>
            </div>
          </div>
          {email && (
            <div className="pt-3 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Access details sent to{" "}
                <span className="text-blue-400">{email}</span>
              </p>
            </div>
          )}
        </div>

        {/* What's pre-loaded */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { Icon: Users, label: "AI Front Desk", color: "blue" },
            { Icon: TrendingUp, label: "CRM Pipeline", color: "green" },
            { Icon: Star, label: "Reputation Engine", color: "yellow" },
            { Icon: DollarSign, label: "Funding Dashboard", color: "purple" },
          ].map(({ Icon, label, color }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-${color}-500/20`}
              >
                <Icon className={`w-4 h-4 text-${color}-400`} />
              </div>
              <span className="text-sm text-gray-300">{label}</span>
            </div>
          ))}
        </div>

        {/* Activation error / status surface */}
        {activationError && (
          <div
            data-ocid="demo.activation.error_state"
            className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center"
            role="alert"
          >
            <p className="text-sm font-medium text-red-300">
              {activationError.message}
            </p>
            {activationError.retryable && (
              <button
                type="button"
                onClick={() => setActivationError(null)}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-200 hover:text-red-100 transition-colors"
                data-ocid="demo.activation.dismiss_error.button"
              >
                <RefreshCw className="w-3 h-3" />
                Dismiss and try again
              </button>
            )}
          </div>
        )}

        {/* Primary CTA — hardened activateTrial handler.
         *
         * The backend activateTrial returns a Candid variant:
         *   { #ok : { trialAccountId; loginUrl; emailWarning } } |
         *   { #err : Text }
         * which serializes to { __kind: "ok", ok: {...} } | { __kind: "err", err: "..." }.
         *
         * A rejected promise only happens on transport/canister errors OR when
         * the actor was built with the anonymous principal (loginDemo is a
         * frontend-only state setter and does NOT establish an Internet Identity
         * principal, so the actor can be non-null yet anonymous). A backend #err
         * resolves the promise and MUST be inspected here, otherwise the UI
         * silently navigates to a dashboard for a trial that was never
         * provisioned (the v213 "Something went wrong" bug).
         *
         * This handler catches ALL failure modes and surfaces a specific,
         * user-readable message so nothing bubbles to ErrorBoundary's generic
         * "Something went wrong" fallback:
         *   1. null/undefined actor
         *   2. anonymous principal (identity null OR isAnonymous true) — even
         *      when actor is non-null
         *   3. actor still fetching / constructing
         *   4. missing sessionId
         *   5. empty email (pre-flight + backend EMPTY_EMAIL)
         *   6. transport / network rejection
         *   7. actor construction failure (activateTrial not callable)
         *   8. backend #err variant (EMPTY_EMAIL, TRIAL_NOT_FOUND, etc.)
         *   9. unexpected payload shape
         */}
        <button
          type="button"
          disabled={isActivating}
          onClick={async () => {
            setActivationError(null);
            setIsActivating(true);

            const fail = (err: ActivationError) => {
              setActivationError(err);
              setIsActivating(false);
            };

            // Guard 1: actor not ready (still connecting to the canister).
            if (!actor) {
              if (isAnonymous || !identity) {
                fail({
                  message:
                    "Please sign in to activate your trial, then try again.",
                  retryable: true,
                });
              } else if (isFetching) {
                fail({
                  message:
                    "Connecting to server... please wait a moment and try again.",
                  retryable: true,
                });
              } else {
                fail({
                  message:
                    "We couldn't reach the server. Please refresh the page and try again.",
                  retryable: true,
                });
              }
              return;
            }

            // Guard 2: actor exists but identity is anonymous. loginDemo is a
            // frontend-only state setter and does NOT establish an Internet
            // Identity principal, so the actor can be non-null yet built with
            // the anonymous principal. Per useActor docs, gate on `!!identity`
            // (authoritative) with `isAnonymous` as a fallback — the actor
            // returned by the Caffeine runtime can lag behind identity state.
            if (!identity || isAnonymous) {
              fail({
                message:
                  "Please sign in to activate your trial, then try again.",
                retryable: true,
              });
              return;
            }

            // Guard 3: actor still fetching — identity may be resolving.
            if (isFetching) {
              fail({
                message:
                  "Connecting to server... please wait a moment and try again.",
                retryable: true,
              });
              return;
            }

            // Guard 4: no session id — the initial demo session was never
            // created (e.g. canister was stopped during intake).
            if (!session?.sessionId) {
              fail({
                message:
                  "Your session expired. Please restart the demo to activate your trial.",
                retryable: false,
              });
              return;
            }

            // Guard 5: pre-flight the email — the backend activateTrial
            // rejects empty emails with #err("EMPTY_EMAIL"). Catch it here so
            // the user gets an actionable message instead of a silent failure.
            const trialEmail = session?.email || "";
            if (!trialEmail.trim()) {
              fail({
                message:
                  "An email address is required to activate your trial. Please restart the demo and provide a valid email.",
                retryable: false,
              });
              return;
            }

            // Guard 6: actor construction failure — the actor object exists
            // but activateTrial is not a callable function (partial
            // construction / binding mismatch). This is distinct from a
            // transport error and surfaces a specific message.
            if (typeof actor.activateTrial !== "function") {
              console.error(
                "Trial activation failed: actor.activateTrial is not callable",
              );
              fail({
                message:
                  "Trial activation is unavailable right now. Please refresh the page and try again, or contact support if the problem persists.",
                retryable: true,
              });
              return;
            }

            type ActivateTrialResult =
              | {
                  __kind: "ok";
                  ok: {
                    trialAccountId: string;
                    loginUrl: string;
                    emailWarning?: string;
                  };
                }
              | {
                  __kind: "err";
                  err: string;
                };

            let result: ActivateTrialResult;
            try {
              result = (await actor.activateTrial(
                session.sessionId,
                session?.firstName || "",
                session?.businessName || "",
                session?.city || "",
                session?.niche || "Roofing",
                session?.phone || "",
                trialEmail,
                session?.website || "",
              )) as ActivateTrialResult;
            } catch (error) {
              // Guard 7: transport / network / anonymous-principal rejection.
              // Classify the error so we surface a specific message rather
              // than letting it bubble to ErrorBoundary's generic fallback.
              console.error("Trial activation call rejected:", error);
              const classified = classifyActorError(error);
              let message: string;
              switch (classified.kind) {
                case "anonymous":
                  message =
                    "Please sign in to activate your trial, then try again.";
                  break;
                case "transport":
                  message =
                    "Could not reach the server. Please check your connection and try again.";
                  break;
                case "malformed":
                  message =
                    "Trial activation is unavailable right now. Please refresh the page and try again, or contact support if the problem persists.";
                  break;
                default:
                  message = `Trial activation failed: ${classified.detail || "unknown error"}. Please try again or contact support.`;
              }
              fail({ message, retryable: true });
              return;
            }

            // Guard 8: backend returned an error variant — surface it, do NOT
            // navigate. The actual error text (e.g. EMPTY_EMAIL,
            // TRIAL_NOT_FOUND) is shown to the user.
            if (result?.__kind === "err") {
              console.error(
                "Trial activation rejected by backend:",
                result.err,
              );
              const errText = result.err || "UNKNOWN_ERROR";
              const message =
                errText === "EMPTY_EMAIL"
                  ? "An email address is required to activate your trial. Please restart the demo and provide a valid email."
                  : errText === "TRIAL_NOT_FOUND"
                    ? "Your trial could not be found. Please restart the demo to begin a new trial."
                    : `Trial activation failed: ${errText}. Please try again or contact support.`;
              fail({ message, retryable: true });
              return;
            }

            // Guard 9: unexpected payload shape — treat as failure rather than
            // navigating to an unprovisioned dashboard.
            if (!result || result.__kind !== "ok" || !result.ok) {
              console.error(
                "Trial activation returned unexpected payload:",
                result,
              );
              fail({
                message:
                  "Trial activation returned an unexpected response. Please try again or contact support.",
                retryable: true,
              });
              return;
            }

            // Success — persist trial session and navigate to dashboard.
            const trialSession = {
              isDemoTrial: true,
              firstName: session?.firstName || "",
              lastName: session?.lastName || "",
              businessName: session?.businessName || "",
              email: trialEmail,
              phone: session?.phone || "",
              website: session?.website || "",
              city: session?.city || "",
              niche: session?.niche || "Roofing",
              trialAccountId: result.ok.trialAccountId,
              loginUrl: result.ok.loginUrl,
              activatedAt: Date.now(),
            };
            sessionStorage.setItem(
              "brfTrialSession",
              JSON.stringify(trialSession),
            );
            setIsActivating(false);
            navigate({ to: "/dashboard" });
          }}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-white text-lg font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] flex items-center justify-center gap-2"
          data-ocid="demo.enter_back_office.button"
        >
          {isActivating && <Loader2 className="w-5 h-5 animate-spin" />}
          {isActivating ? "Activating your trial..." : "Enter My Back Office →"}
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          7-day full access &bull; No credit card &bull; Cancel anytime
        </p>
      </div>
    </div>
  );
}

export { DemoStep8Trial };
