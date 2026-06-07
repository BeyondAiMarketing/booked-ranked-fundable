import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle,
  DollarSign,
  Loader2,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext";
import { useDemoFlow } from "../../hooks/useDemoFlow";

type Phase = "loading" | "success" | "expired";

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

export default function DemoStep8Trial() {
  const navigate = useNavigate();
  const { sessionData } = useDemoFlow();
  const { loginDemo } = useApp();
  const { actor } = useActor();

  const session = resolveSession(sessionData as any);

  const firstName = session?.firstName || "there";
  const businessName = session?.businessName || "Your Business";
  const city = session?.city || "";
  const niche = session?.niche || "Roofing";
  const email = session?.email || "";

  const [phase, setPhase] = useState<Phase>(session ? "loading" : "expired");
  const [completedSteps, setCompletedSteps] = useState(0);

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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
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

        {/* Primary CTA */}
        <button
          type="button"
          onClick={async () => {
            try {
              if (actor && session?.sessionId) {
                await actor.activateTrial(
                  session.sessionId,
                  session?.firstName || "",
                  session?.businessName || "",
                  session?.city || "",
                  session?.niche || "Roofing",
                  session?.phone || "",
                  session?.email || "",
                  session?.website || "",
                );
              }
            } catch (error) {
              console.error("Trial activation error:", error);
            }
            const trialSession = {
              isDemoTrial: true,
              firstName: session?.firstName || "",
              lastName: session?.lastName || "",
              businessName: session?.businessName || "",
              email: session?.email || "",
              phone: session?.phone || "",
              website: session?.website || "",
              city: session?.city || "",
              niche: session?.niche || "Roofing",
              activatedAt: Date.now(),
            };
            sessionStorage.setItem(
              "brfTrialSession",
              JSON.stringify(trialSession),
            );
            navigate({ to: "/dashboard" });
          }}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-lg font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01]"
          data-ocid="demo.enter_back_office.button"
        >
          Enter My Back Office →
        </button>

        <p className="text-center text-gray-500 text-xs mt-4">
          7-day full access &bull; No credit card &bull; Cancel anytime
        </p>
      </div>
    </div>
  );
}

export { DemoStep8Trial };
