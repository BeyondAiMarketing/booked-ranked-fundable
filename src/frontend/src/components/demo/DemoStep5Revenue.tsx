/**
 * DemoStep5Revenue — Live revenue loss counter (updated to use completeStep)
 * Framework: Hormozi (pain math — make the cost of inaction visceral and undeniable)
 */

import { NICHE_REVENUE_LOSS } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - p) * (1 - p);
      setValue(Math.round(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start]);
  return value;
}

function parseMonthlyLoss(str: string): number {
  const match = str.replace(/[$,]/g, "").match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export default function DemoStep5Revenue() {
  const { businessName, niche, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const nicheKey = (niche || "plumber") as keyof typeof NICHE_REVENUE_LOSS;
  const items = NICHE_REVENUE_LOSS[nicheKey] ?? NICHE_REVENUE_LOSS.plumber;

  const [visibleItems, setVisibleItems] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [started, setStarted] = useState(false);

  const totalMonthly = items.reduce(
    (sum, item) => sum + parseMonthlyLoss(item.monthlyLoss),
    0,
  );
  const totalAnnual = totalMonthly * 12;
  const animatedTotal = useCountUp(totalMonthly, 1200, showTotal);

  useEffect(() => {
    if (!started) return;
    items.forEach((_, i) => {
      setTimeout(() => setVisibleItems(i + 1), (i + 1) * 700);
    });
    setTimeout(() => setShowTotal(true), (items.length + 1) * 700);
    setTimeout(() => completeStep(), (items.length + 1) * 700 + 2500);
  }, [started, items, completeStep]);

  return (
    <div
      className="flex flex-col items-center gap-5 w-full"
      data-ocid="demo.step5.section"
    >
      <div className="text-center shrink-0">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          The Real Cost of Doing Nothing
        </p>
        <h2 className="text-2xl font-black text-white leading-tight">
          Here's What {biz} Is Spending
          <br />
          <span style={{ color: "oklch(0.78 0.2 25)" }}>
            Every Single Month
          </span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: "oklch(0.65 0.02 280)" }}>
          The average business in your niche loses{" "}
          <strong className="text-white">$4,200/month</strong> to these gaps.
        </p>
      </div>

      {!started && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          data-ocid="demo.step5.calculate_button"
          className="px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center gap-2 shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.6 0.22 25), oklch(0.55 0.22 30))",
            boxShadow: "0 8px 20px oklch(0.6 0.22 25 / 40%)",
          }}
        >
          💸 Calculate My Monthly Loss
        </button>
      )}

      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shrink-0"
        style={{
          background: "oklch(0.12 0.014 280)",
          border: "1px solid oklch(1 0 0 / 10%)",
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            borderColor: "oklch(1 0 0 / 8%)",
            background: "oklch(0.14 0.016 285)",
          }}
        >
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wide">
            Monthly Overhead Without BRF
          </span>
          {started && visibleItems < items.length && (
            <span
              className="text-xs font-semibold animate-pulse"
              style={{ color: "oklch(0.72 0.2 25)" }}
            >
              Calculating…
            </span>
          )}
        </div>
        <div>
          <AnimatePresence>
            {items.slice(0, visibleItems).map((item, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable sequential
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 280 }}
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "oklch(1 0 0 / 6%)" }}
                data-ocid={`demo.step5.revenue.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "oklch(0.6 0.22 25)" }}
                  />
                  <span className="text-sm text-white/70">{item.label}</span>
                </div>
                <span
                  className="text-sm font-bold flex-shrink-0"
                  style={{ color: "oklch(0.72 0.2 25)" }}
                >
                  {item.monthlyLoss}/mo
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {showTotal && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="demo.step5.total_state"
              >
                <div
                  className="flex items-center justify-between px-4 py-4"
                  style={{
                    background: "oklch(0.6 0.22 25 / 10%)",
                    borderTop: "2px solid oklch(0.6 0.22 25 / 30%)",
                  }}
                >
                  <span className="text-sm font-bold text-white">
                    Total Monthly Loss
                  </span>
                  <span
                    className="text-xl font-black"
                    style={{ color: "oklch(0.72 0.2 25)" }}
                  >
                    ${animatedTotal.toLocaleString()}+/mo
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="px-4 py-3 text-center"
                  style={{ background: "oklch(0.6 0.22 25 / 6%)" }}
                >
                  <p
                    className="text-sm font-bold"
                    style={{ color: "oklch(0.78 0.2 25)" }}
                  >
                    That's{" "}
                    <span className="text-xl font-black text-white">
                      ${totalAnnual.toLocaleString()}+/year
                    </span>{" "}
                    you could keep.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showTotal && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="max-w-md w-full rounded-2xl px-6 py-4 text-center shrink-0"
            style={{
              background: "oklch(0.62 0.18 155 / 8%)",
              border: "1px solid oklch(0.62 0.18 155 / 25%)",
            }}
          >
            <p
              className="text-sm font-bold"
              style={{ color: "oklch(0.78 0.14 155)" }}
            >
              BRF replaces every item on this list — for one predictable monthly
              fee. And makes you more money.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
