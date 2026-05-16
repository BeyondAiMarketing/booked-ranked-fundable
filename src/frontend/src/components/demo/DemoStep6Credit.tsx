/**
 * DemoStep6Credit — 90-day Business Credit Builder simulation.
 * Framework: Hormozi (Grand Slam Offer — the thing no competitor has)
 *
 * Animated SVG line chart showing credit score (580→750) and funding ($0→$50k)
 * over 90 days. Milestone badges pop in at Day 30, 60, 90.
 */

import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Simple SVG path from data points
function buildPath(points: [number, number][], w: number, h: number): string {
  if (points.length < 2) return "";
  return points
    .map(
      ([x, y], i) =>
        `${i === 0 ? "M" : "L"} ${(x / 100) * w} ${h - (y / 100) * h}`,
    )
    .join(" ");
}

const CREDIT_POINTS: [number, number][] = [
  [0, 0],
  [5, 3],
  [15, 12],
  [30, 28],
  [45, 45],
  [60, 62],
  [75, 76],
  [90, 100],
];
const FUNDING_POINTS: [number, number][] = [
  [0, 0],
  [15, 5],
  [30, 20],
  [45, 42],
  [60, 65],
  [75, 82],
  [90, 100],
];

const MILESTONES = [
  {
    day: 30,
    label: "Business Profile Complete",
    color: "oklch(0.62 0.18 290)",
  },
  { day: 60, label: "Trade Lines Active", color: "oklch(0.62 0.18 240)" },
  { day: 90, label: "Funding Ready! 🎉", color: "oklch(0.62 0.18 155)" },
];

export default function DemoStep6Credit() {
  const { completeStep } = useDemoFlow();
  const [progress, setProgress] = useState(0); // 0-100 = 0-90 days
  const [milestonesShown, setMilestonesShown] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number>(0);
  const started = useRef(false);

  const chartW = 280;
  const chartH = 100;

  // Current values based on progress
  const creditScore = Math.round(580 + (170 * progress) / 100);
  const funding = Math.round((50000 * progress) / 100);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const durationMs = 4000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - (1 - p) ** 2;
      const pct = Math.round(eased * 100);
      setProgress(pct);

      // Milestone reveals
      const day = Math.round((pct / 100) * 90);
      for (const m of MILESTONES) {
        if (day >= m.day) {
          setMilestonesShown((prev) =>
            prev.includes(m.day) ? prev : [...prev, m.day],
          );
        }
      }

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(completeStep, 800);
      }
    };

    const t = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 400);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, [completeStep]);

  // Build partial paths up to progress
  function partialPath(pts: [number, number][], pct: number) {
    const filtered = pts.filter(([x]) => x <= pct);
    // Add interpolated last point
    const last = pts.findIndex(([x]) => x > pct);
    if (last > 0 && last < pts.length) {
      const [x0, y0] = pts[last - 1];
      const [x1, y1] = pts[last];
      const t = (pct - x0) / (x1 - x0);
      filtered.push([pct, y0 + t * (y1 - y0)]);
    }
    return buildPath(filtered, chartW, chartH);
  }

  const creditPath = partialPath(CREDIT_POINTS, progress);
  const fundingPath = partialPath(FUNDING_POINTS, progress);

  return (
    <div
      className="flex flex-col items-center gap-5 w-full"
      data-ocid="demo.step6.section"
    >
      {/* Header */}
      <div className="text-center shrink-0">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "oklch(0.72 0.18 75)" }}
        >
          The Feature No Competitor Offers
        </p>
        <h2 className="text-xl font-black text-white leading-tight">
          90 Days on BRF Changes Everything
        </h2>
        <p className="text-sm mt-1" style={{ color: "oklch(0.65 0.02 280)" }}>
          Business credit builder + fundability simulation
        </p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm shrink-0">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "oklch(0.14 0.016 285)",
            border: "1px solid oklch(0.58 0.22 290 / 30%)",
          }}
        >
          <div
            className="text-2xl font-black"
            style={{ color: "oklch(0.78 0.18 290)" }}
          >
            {creditScore}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.65 0.02 280)" }}
          >
            Credit Score
          </div>
          <div
            className="text-[10px] mt-1"
            style={{ color: "oklch(0.55 0.05 290)" }}
          >
            580 → 750
          </div>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: "oklch(0.14 0.016 285)",
            border: "1px solid oklch(0.62 0.18 155 / 30%)",
          }}
        >
          <div
            className="text-2xl font-black"
            style={{ color: "oklch(0.78 0.14 155)" }}
          >
            ${(funding / 1000).toFixed(0)}k
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.65 0.02 280)" }}
          >
            Funding Available
          </div>
          <div
            className="text-[10px] mt-1"
            style={{ color: "oklch(0.55 0.05 155)" }}
          >
            $0 → $50,000
          </div>
        </div>
      </div>

      {/* SVG chart */}
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shrink-0"
        style={{
          background: "oklch(0.12 0.014 280)",
          border: "1px solid oklch(1 0 0 / 10%)",
        }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: "oklch(1 0 0 / 8%)" }}
        >
          <span className="text-xs font-semibold text-white/60">
            90-Day Fundability Growth
          </span>
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: "oklch(0.72 0.18 75)" }}
          >
            Day {Math.round((progress / 100) * 90)}
          </span>
        </div>
        <div className="p-4">
          <svg
            width={chartW}
            height={chartH + 10}
            viewBox={`0 0 ${chartW} ${chartH + 10}`}
            className="w-full"
            aria-label="90-day credit and funding growth chart"
            role="img"
          >
            {/* Grid lines */}
            {[25, 50, 75].map((y) => (
              <line
                key={y}
                x1={0}
                y1={chartH - (y / 100) * chartH}
                x2={chartW}
                y2={chartH - (y / 100) * chartH}
                stroke="oklch(1 0 0 / 8%)"
                strokeDasharray="4 4"
              />
            ))}
            {/* Credit score line */}
            {creditPath && (
              <path
                d={creditPath}
                fill="none"
                stroke="oklch(0.68 0.22 290)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {/* Funding line */}
            {fundingPath && (
              <path
                d={fundingPath}
                fill="none"
                stroke="oklch(0.62 0.18 155)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {/* End dots */}
            {progress > 0 && creditPath && (
              <circle
                cx={(progress / 100) * chartW}
                cy={
                  chartH -
                  ((CREDIT_POINTS.find(([x]) => x >= progress)?.[1] ?? 0) /
                    100) *
                    chartH
                }
                r={4}
                fill="oklch(0.68 0.22 290)"
              />
            )}
          </svg>
          {/* Legend */}
          <div className="flex gap-4 mt-1">
            {[
              { color: "oklch(0.68 0.22 290)", label: "Credit Score" },
              { color: "oklch(0.62 0.18 155)", label: "Funding" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-0.5 rounded-full"
                  style={{ background: color }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: "oklch(0.55 0.02 280)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone badges */}
      <div className="flex flex-col gap-2 w-full max-w-sm shrink-0">
        {MILESTONES.map((m) => (
          <AnimatePresence key={m.day}>
            {milestonesShown.includes(m.day) && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 280 }}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                style={{
                  background: "oklch(0.14 0.016 285)",
                  border: `1px solid ${m.color} / 30%`,
                }}
                data-ocid={`demo.step6.milestone.day${m.day}`}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${m.color} / 20%`, color: m.color }}
                >
                  {m.day}
                </div>
                <span className="text-sm font-semibold text-white/85">
                  {m.label}
                </span>
                <span className="ml-auto text-lg">✓</span>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center rounded-2xl px-6 py-4 w-full max-w-sm shrink-0"
            style={{
              background: "oklch(0.62 0.18 155 / 12%)",
              border: "1px solid oklch(0.62 0.18 155 / 30%)",
            }}
          >
            <p
              className="text-base font-black"
              style={{ color: "oklch(0.78 0.14 155)" }}
            >
              $50,000 in business funding unlocked.
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.65 0.02 280)" }}
            >
              No competitor offers this. BRF builds your fundability
              automatically.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
