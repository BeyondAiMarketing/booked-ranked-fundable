// DemoStep10CTA — THE FINALE: One action, one direction, all three frameworks
// Framework: Brunson (hook) + Deiss (value journey) + Hormozi (irresistible offer)

import { DEMO_STEPS } from "@/data/demoFlowData";
import { FRAMEWORK_BADGES } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import FrameworkBadge from "./FrameworkBadge";

function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  return {
    display: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    expired: secondsLeft === 0,
  };
}

export default function DemoStep10CTA() {
  const { demoProspect, setStepComplete, replayStep } = useDemoFlow();
  const firstName = demoProspect?.firstName ?? "there";
  const businessName = demoProspect?.businessName ?? "Your Business";

  // Complete immediately — finale has no gate
  useEffect(() => {
    setStepComplete(true);
  }, [setStepComplete]);

  // 23h 47m 12s countdown from page load
  const { display: countdownDisplay, expired } = useCountdown(
    23 * 3600 + 47 * 60 + 12,
  );

  const trialUrl = demoProspect
    ? `https://bookedrankedfunded.org/brand-kit?niche=${demoProspect.niche}&biz=${encodeURIComponent(businessName)}&city=${encodeURIComponent(demoProspect.city)}`
    : "https://bookedrankedfunded.org/brand-kit";

  const replaySteps = DEMO_STEPS.filter(
    (s) => s.stepNumber >= 2 && s.stepNumber <= 9,
  );

  return (
    <div
      className="relative flex flex-col items-center gap-8 text-center overflow-hidden py-4"
      data-ocid="demo.step10.section"
    >
      {/* Purple radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, oklch(0.58 0.22 290 / 18%) 0%, transparent 70%)",
        }}
      />

      {/* Done badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="relative"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: "oklch(0.62 0.18 155 / 15%)",
            color: "oklch(0.78 0.14 155)",
            border: "1px solid oklch(0.62 0.18 155 / 30%)",
          }}
        >
          🎉 Demo Complete — You've seen everything
        </div>
      </motion.div>

      {/* Main headline */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative space-y-3 max-w-lg"
      >
        <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
          {firstName}, you've seen what BRF does.
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 290), oklch(0.72 0.18 180))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Now experience it yourself.
          </span>
        </h2>
        <p
          className="text-base font-semibold"
          style={{ color: "oklch(0.65 0.02 280)" }}
        >
          7 days. Your real business. Real AI. Real results.
        </p>
      </motion.div>

      {/* Countdown timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold"
        style={{
          background: expired
            ? "oklch(0.6 0.22 25 / 12%)"
            : "oklch(0.6 0.22 25 / 12%)",
          border: "1px solid oklch(0.6 0.22 25 / 30%)",
          color: "oklch(0.78 0.18 25)",
        }}
        data-ocid="demo.step10.countdown"
      >
        <span>⏰</span>
        <span>
          {expired ? (
            "Demo kit expired — start fresh"
          ) : (
            <>
              Your demo kit expires in{" "}
              <strong className="tabular-nums">{countdownDisplay}</strong>
            </>
          )}
        </span>
      </motion.div>

      {/* Primary CTA — full width on mobile, 360px on desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.25,
          type: "spring",
          damping: 16,
          stiffness: 280,
        }}
        className="relative w-full max-w-sm sm:max-w-none sm:w-auto"
      >
        <a
          href={trialUrl}
          data-ocid="demo.step10.start_trial.button"
          className="relative flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-lg text-white w-full sm:w-auto sm:min-w-80 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
            boxShadow:
              "0 12px 40px oklch(0.58 0.22 290 / 55%), 0 0 0 1px oklch(0.58 0.22 290 / 30%)",
            textDecoration: "none",
          }}
        >
          {/* Shimmer effect */}
          <span
            className="absolute inset-0 rounded-2xl overflow-hidden"
            aria-hidden="true"
          >
            <motion.span
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, oklch(1 0 0 / 15%) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </span>
          <span className="relative z-10">Start My Free 7-Day Trial</span>
          <span className="relative z-10 text-xl">→</span>
        </a>

        <p className="mt-2 text-xs" style={{ color: "oklch(0.5 0.02 280)" }}>
          No credit card · Trial starts on your first real action
        </p>
      </motion.div>

      {/* Three micro-proof lines */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col items-center gap-2"
      >
        {[
          "No credit card required",
          "Full AI front desk active in 5 minutes",
          "Your social media running by day 1",
        ].map((proof) => (
          <div
            key={proof}
            className="flex items-center gap-2 text-sm font-semibold"
            style={{ color: "oklch(0.75 0.02 280)" }}
          >
            <span style={{ color: "oklch(0.62 0.18 155)" }}>✓</span>
            {proof}
          </div>
        ))}
      </motion.div>

      {/* "Built on proven frameworks" badge row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-xs" style={{ color: "oklch(0.45 0.02 280)" }}>
          Built on proven frameworks
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <FrameworkBadge badge={FRAMEWORK_BADGES.brunson} size="sm" />
          <FrameworkBadge badge={FRAMEWORK_BADGES.deiss} size="sm" />
          <FrameworkBadge badge={FRAMEWORK_BADGES.hormozi} size="sm" />
        </div>
      </motion.div>

      {/* What's included */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md text-left space-y-2 px-2"
      >
        <p
          className="text-xs font-bold uppercase tracking-wider text-center mb-3"
          style={{ color: "oklch(0.5 0.02 280)" }}
        >
          Everything included in your 7-day trial
        </p>
        {[
          "AI voice receptionist — 24/7 call handling with your business name",
          "Pre-built niche website — live, mobile-ready, and already written",
          "CRM with auto lead capture from all channels",
          "Automated review requests after every completed job",
          "Business credit builder — 90-day fundability simulation",
          "Social media content automation — full first week, 4 platforms",
        ].map((f) => (
          <div key={f} className="flex items-start gap-2 text-sm">
            <span
              className="flex-shrink-0 mt-0.5"
              style={{ color: "oklch(0.62 0.18 155)" }}
            >
              ✓
            </span>
            <span style={{ color: "oklch(0.72 0.02 280)" }}>{f}</span>
          </div>
        ))}
      </motion.div>

      {/* Replay steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-3"
        data-ocid="demo.step10.replay_section"
      >
        <p className="text-xs" style={{ color: "oklch(0.5 0.02 280)" }}>
          Want to revisit a step?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {replaySteps.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => replayStep(s.stepNumber)}
              data-ocid={`demo.step10.replay.${s.id}`}
              className="text-xs px-3 py-1.5 rounded-full border transition-all hover:bg-white/5"
              style={{
                borderColor: "oklch(0.58 0.22 290 / 30%)",
                color: "oklch(0.68 0.14 290)",
              }}
            >
              {s.shortTitle}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
