/**
 * DemoStep8Audit — Personalized Audit Report with email capture.
 * Framework: Brunson (value first, then offer — give the audit, then invite to trial)
 *
 * Shows business score (72-85), top 3 gaps, email capture.
 * Completes on email submit OR after 30s (non-blocking).
 */

import { Input } from "@/components/ui/input";
import { NICHE_AUDIT_GAPS } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Deterministic score based on niche — 72–85 range
const NICHE_SCORES: Record<string, number> = {
  plumber: 74,
  "med-spa": 78,
  hvac: 72,
  restoration: 76,
  "carpet-cleaning": 73,
  roofing: 75,
  "real-estate": 82,
  mortgage: 80,
  chiropractor: 77,
  dental: 83,
};

const NICHE_EMOJIS: Record<string, string> = {
  plumber: "🔧",
  "med-spa": "✨",
  hvac: "❄️",
  restoration: "💧",
  "carpet-cleaning": "🧹",
  roofing: "🏠",
  "real-estate": "🏡",
  mortgage: "🏦",
  chiropractor: "⚕️",
  dental: "🦷",
};

export default function DemoStep8Audit() {
  const { businessName, niche, city, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const nicheKey = niche || "plumber";
  const score = NICHE_SCORES[nicheKey] ?? 75;
  const gaps = (
    NICHE_AUDIT_GAPS[nicheKey as keyof typeof NICHE_AUDIT_GAPS] ??
    NICHE_AUDIT_GAPS.plumber
  ).slice(0, 3);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedRef = useRef(false);

  const doComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    completeStep();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: doComplete is stable via ref
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    timerRef.current = setTimeout(doComplete, 30000);
    return () => {
      clearTimeout(t1);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(doComplete, 1500);
  };

  const scoreColor =
    score >= 80
      ? "oklch(0.62 0.18 155)"
      : score >= 75
        ? "oklch(0.72 0.18 75)"
        : "oklch(0.72 0.2 25)";
  const scoreLabel = score >= 80 ? "Good" : score >= 75 ? "Fair" : "Needs Work";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-5 w-full"
      data-ocid="demo.step8.section"
    >
      {/* Header */}
      <div className="text-center shrink-0">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Your Personalized Audit
        </p>
        <h2 className="text-xl font-black text-white">
          Here's Where {biz} Stands Today
        </h2>
        {city && (
          <p className="text-sm mt-1" style={{ color: "oklch(0.65 0.02 280)" }}>
            {city} Market Analysis
          </p>
        )}
      </div>

      {/* Score card */}
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shrink-0"
        style={{
          background: "oklch(0.12 0.014 280)",
          border: "1px solid oklch(0.58 0.22 290 / 25%)",
        }}
        data-ocid="demo.step8.score_card"
      >
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="text-3xl shrink-0">
            {NICHE_EMOJIS[nicheKey] ?? "🏢"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-white text-sm truncate">{biz}</div>
            <div
              className="text-xs capitalize mt-0.5"
              style={{ color: "oklch(0.58 0.22 290)" }}
            >
              {nicheKey.replace("-", " ")} · Overall Score
            </div>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-3xl font-black tabular-nums"
              style={{ color: scoreColor }}
            >
              {score}
            </div>
            <div
              className="text-[10px] font-bold"
              style={{ color: scoreColor }}
            >
              {scoreLabel}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="px-5 pb-4">
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "oklch(1 0 0 / 10%)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${scoreColor}, oklch(0.58 0.22 290))`,
              }}
            />
          </div>
          <div
            className="flex justify-between text-[10px] mt-1"
            style={{ color: "oklch(0.45 0.02 280)" }}
          >
            <span>0</span>
            <span>Industry Average: 68</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Top 3 gaps */}
      <div className="w-full max-w-sm space-y-2 shrink-0">
        <p
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: "oklch(0.55 0.02 280)" }}
        >
          Top 3 Growth Opportunities
        </p>
        {gaps.map((gap, i) => (
          <motion.div
            key={gap}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}
            className="rounded-xl px-4 py-3 flex gap-3"
            style={{
              background: "oklch(0.6 0.22 25 / 8%)",
              border: "1px solid oklch(0.6 0.22 25 / 20%)",
            }}
            data-ocid={`demo.step8.gap.item.${i + 1}`}
          >
            <span
              className="text-sm shrink-0 mt-0.5"
              style={{ color: "oklch(0.72 0.2 25)" }}
            >
              ⚠
            </span>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "oklch(0.82 0.01 280)" }}
            >
              {gap}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Email capture */}
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-2xl p-4 shrink-0"
            style={{
              background: "oklch(0.14 0.016 285)",
              border: "1px solid oklch(0.58 0.22 290 / 25%)",
            }}
            data-ocid="demo.step8.email_form"
          >
            <p className="text-sm font-bold text-white mb-1">
              Get this report + your full audit
            </p>
            <p
              className="text-xs mb-3"
              style={{ color: "oklch(0.6 0.02 280)" }}
            >
              We'll email your full {nicheKey.replace("-", " ")} audit with
              specific improvement steps.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-purple-500 text-sm"
                data-ocid="demo.step8.email.input"
              />
              <button
                type="submit"
                data-ocid="demo.step8.email.submit_button"
                className="px-4 py-2 rounded-lg font-bold text-sm text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
                }}
              >
                Send
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl p-4 text-center shrink-0"
            style={{
              background: "oklch(0.62 0.18 155 / 12%)",
              border: "1px solid oklch(0.62 0.18 155 / 30%)",
            }}
            data-ocid="demo.step8.email.success_state"
          >
            <p className="text-lg mb-1">📬</p>
            <p
              className="text-sm font-bold"
              style={{ color: "oklch(0.78 0.14 155)" }}
            >
              Report on its way!
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.6 0.02 280)" }}
            >
              Check {email} in a few minutes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
