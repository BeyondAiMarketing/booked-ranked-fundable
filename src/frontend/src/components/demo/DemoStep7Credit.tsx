/**
 * DemoStep7Credit — THE SURPRISE: Business Credit Builder.
 * Dramatic animated reveal. No pain point intro — opens with impact.
 * Credit score 540→720, funding $0→$85K, 4 milestone cards sequentially.
 * Framework badge: Hormozi — "The Unexpected Bonus"
 */

import { FRAMEWORK_BADGES } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import BenefitPill from "./BenefitPill";
import CoachTipCard from "./CoachTipCard";
import FrameworkBadge from "./FrameworkBadge";
import GreenConfirmOverlay from "./GreenConfirmOverlay";

// ── Animated counter hook ─────────────────────────────────────────────────────

function useAnimatedCounter(
  target: number,
  durationMs: number,
  active: boolean,
  startFrom = 0,
): number {
  const [val, setVal] = useState(startFrom);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setVal(startFrom);
      return;
    }
    const start = performance.now();
    const range = target - startFrom;
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const ease = 1 - (1 - progress) ** 3;
      setVal(Math.round(startFrom + range * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, durationMs, active, startFrom]);

  return val;
}

// ── Milestone card ────────────────────────────────────────────────────────────

interface Milestone {
  day: string;
  label: string;
  desc: string;
  score: number;
  funding: number;
  isFinal: boolean;
}

const MILESTONES: Milestone[] = [
  {
    day: "Day 0",
    label: "Business credit profile opened",
    desc: "EIN registered, D-U-N-S number established, credit monitoring live.",
    score: 540,
    funding: 0,
    isFinal: false,
  },
  {
    day: "Day 30",
    label: "First tradeline established — score +40",
    desc: "Vendor accounts reporting. Score climbing. Bank doors opening.",
    score: 580,
    funding: 15000,
    isFinal: false,
  },
  {
    day: "Day 60",
    label: "Bank credit accessed — score +60",
    desc: "Business credit card approved. Revolving credit building momentum.",
    score: 660,
    funding: 45000,
    isFinal: false,
  },
  {
    day: "Day 90",
    label: "Funding unlock: up to $85K available",
    desc: "Strong credit profile unlocks SBA lines, equipment financing, and more.",
    score: 720,
    funding: 85000,
    isFinal: true,
  },
];

function MilestoneCard({
  milestone,
  visible,
  animating,
}: {
  milestone: Milestone;
  visible: boolean;
  animating: boolean;
}) {
  const scoreVal = useAnimatedCounter(
    milestone.score,
    1200,
    animating,
    milestone.day === "Day 0" ? 500 : milestone.score - 60,
  );
  const fundingVal = useAnimatedCounter(milestone.funding, 1400, animating, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 14,
        scale: visible ? 1 : 0.96,
      }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: milestone.isFinal
          ? "oklch(0.32 0.14 155 / 25%)"
          : "oklch(0.13 0.016 285)",
        border: milestone.isFinal
          ? "1px solid oklch(0.58 0.22 155 / 55%)"
          : "1px solid oklch(0.58 0.22 290 / 28%)",
        boxShadow: milestone.isFinal
          ? "0 0 28px oklch(0.55 0.22 155 / 28%), inset 0 0 40px oklch(0.55 0.22 155 / 8%)"
          : "none",
      }}
      data-ocid={`demo.step7.milestone.${milestone.day.replace(" ", "").toLowerCase()}`}
    >
      {/* Glow on final */}
      {milestone.isFinal && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.58 0.22 155 / 20%) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        {/* Day label */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              background: milestone.isFinal
                ? "oklch(0.55 0.22 155 / 25%)"
                : "oklch(0.58 0.22 290 / 18%)",
              color: milestone.isFinal
                ? "oklch(0.78 0.2 155)"
                : "oklch(0.78 0.16 290)",
            }}
          >
            {milestone.day}
          </span>
          {milestone.isFinal && (
            <span className="text-base animate-bounce">🎉</span>
          )}
        </div>

        {/* Label */}
        <p
          className="text-sm font-bold mb-1 leading-tight"
          style={{ color: milestone.isFinal ? "oklch(0.9 0.06 155)" : "white" }}
        >
          {milestone.label}
        </p>
        <p
          className="text-[11px] leading-relaxed mb-3"
          style={{ color: "oklch(0.58 0.02 280)" }}
        >
          {milestone.desc}
        </p>

        {/* Score + Funding */}
        <div className="flex items-end justify-between">
          <div>
            <div
              className="text-2xl font-black tabular-nums"
              style={{
                color: milestone.isFinal ? "oklch(0.85 0.18 155)" : "white",
              }}
            >
              {animating ? scoreVal : milestone.score}
            </div>
            <div
              className="text-[10px] font-semibold"
              style={{ color: "oklch(0.48 0.02 280)" }}
            >
              Business Credit Score
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-xl font-black tabular-nums"
              style={{
                color: milestone.isFinal
                  ? "oklch(0.82 0.2 155)"
                  : milestone.funding > 0
                    ? "oklch(0.78 0.16 290)"
                    : "oklch(0.45 0.02 280)",
              }}
            >
              {milestone.funding === 0
                ? "$0"
                : `$${(animating ? fundingVal : milestone.funding).toLocaleString()}`}
            </div>
            <div
              className="text-[10px] font-semibold"
              style={{ color: "oklch(0.48 0.02 280)" }}
            >
              Funding Access
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DemoStep7Credit() {
  const { businessName, city, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const cityLabel = city || "your area";

  const [visibleMilestone, setVisibleMilestone] = useState(-1);
  const [animatingMilestone, setAnimatingMilestone] = useState(-1);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [coachDismissed, setCoachDismissed] = useState(false);

  const handleOverlayDone = useCallback(() => {
    setShowOverlay(false);
    completeStep();
  }, [completeStep]);

  useEffect(() => {
    const t0 = setTimeout(() => setHeadlineVisible(true), 200);
    const t1 = setTimeout(() => setSubVisible(true), 800);

    // Milestones appear staggered
    const milestoneTimers = MILESTONES.map((_, i) =>
      setTimeout(
        () => {
          setVisibleMilestone(i);
          setAnimatingMilestone(i);
        },
        1400 + i * 1200,
      ),
    );

    const lastMilestoneAt = 1400 + (MILESTONES.length - 1) * 1200 + 1500;
    const tNext = setTimeout(() => {
      setShowNextBtn(true);
      completeStep();
    }, lastMilestoneAt);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      milestoneTimers.forEach(clearTimeout);
      clearTimeout(tNext);
    };
  }, [completeStep]);

  return (
    <>
      <div
        className="w-full max-w-lg mx-auto flex flex-col gap-5 relative"
        data-ocid="demo.step7.section"
      >
        {/* Benefit pill — desktop only, never overlaps mobile text */}
        <BenefitPill
          benefit={`Get ${biz} approved for the funding you deserve in ${cityLabel}.`}
        />

        {/* Dramatic headline — NO pain point stat */}
        <div className="text-center">
          <p
            className="text-[10px] font-black uppercase tracking-[0.18em] mb-2"
            style={{ color: "oklch(0.58 0.22 290)" }}
          >
            Act 2 · The Surprise
          </p>

          <AnimatePresence>
            {headlineVisible && (
              <motion.h2
                key="headline"
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 16, stiffness: 220 }}
                className="text-3xl sm:text-4xl font-black leading-tight mb-3"
                style={{
                  background:
                    "linear-gradient(135deg, white 0%, oklch(0.88 0.18 290) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Nobody Told You
                <br />
                About This Part.
              </motion.h2>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {subVisible && (
              <motion.p
                key="sub"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm sm:text-base font-semibold leading-relaxed max-w-sm mx-auto"
                style={{ color: "oklch(0.72 0.02 280)" }}
              >
                While most platforms just book appointments,{" "}
                <span style={{ color: "oklch(0.78 0.18 155)" }}>
                  BRF builds your business credit simultaneously.
                </span>
              </motion.p>
            )}
          </AnimatePresence>

          {/* No-competitor badge */}
          <AnimatePresence>
            {subVisible && (
              <motion.div
                key="badge"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-xs font-black"
                style={{
                  background: "oklch(0.62 0.22 40 / 15%)",
                  border: "1px solid oklch(0.62 0.22 40 / 35%)",
                  color: "oklch(0.85 0.2 40)",
                }}
              >
                🏆 No other platform builds your business credit. Only BRF.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Milestone cards */}
        <div className="grid grid-cols-1 gap-3">
          {MILESTONES.map((milestone, i) => (
            <MilestoneCard
              key={milestone.day}
              milestone={milestone}
              visible={i <= visibleMilestone}
              animating={i === animatingMilestone}
            />
          ))}
        </div>

        {/* Framework badge */}
        <div className="flex justify-center">
          <FrameworkBadge
            badge={{
              ...FRAMEWORK_BADGES.hormozi,
              label: "Hormozi: The Unexpected Bonus",
            }}
            size="sm"
          />
        </div>

        {/* Next button */}
        <AnimatePresence>
          {showNextBtn && (
            <motion.div
              key="step7-ready"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                className="text-center text-xs font-semibold mb-3"
                style={{ color: "oklch(0.55 0.14 155)" }}
              >
                Ready! Tap Next to continue →
              </p>
              <button
                type="button"
                onClick={() => setShowOverlay(true)}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 155), oklch(0.48 0.22 145))",
                  color: "white",
                  boxShadow: "0 4px 20px oklch(0.55 0.22 155 / 40%)",
                }}
                data-ocid="demo.step7.next_button"
              >
                Next: See What You’re Losing →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coach tip */}
      <AnimatePresence>
        {!coachDismissed && (
          <CoachTipCard
            message={`This tracks your business credit score for ${biz} and shows you exactly what to do next to qualify for better financing and bigger jobs in ${cityLabel}.`}
            onDismiss={() => setCoachDismissed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOverlay && (
          <GreenConfirmOverlay
            headline="Credit Building Activated"
            subline="From 540 to 720 — $85K Unlocked in 90 Days"
            items={[
              {
                icon: "📋",
                label: "Day 0",
                value: "Score 540 — Credit profile opened",
              },
              {
                icon: "📈",
                label: "Day 30",
                value: "Score 580 — First tradeline: +$15K",
              },
              {
                icon: "🏦",
                label: "Day 60",
                value: "Score 660 — Bank credit: +$45K",
              },
              {
                icon: "🎉",
                label: "Day 90",
                value: "Score 720 — Funding unlocked: $85K",
              },
            ]}
            closingLine="80% of small businesses are denied funding due to weak business credit. BRF fixes that."
            onDone={handleOverlayDone}
            dataOcid="demo.step7.credit_overlay"
          />
        )}
      </AnimatePresence>
    </>
  );
}
