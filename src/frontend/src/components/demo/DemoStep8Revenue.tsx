/**
 * DemoStep8Revenue — "Every Month Without BRF Costs You:"
 * 5 line items cascade in with live count-up amounts.
 * Total in red. "This ends today." — emerald CTA.
 * Framework badge: Kennedy — "Fear of Loss"
 */

import { FRAMEWORK_BADGES, NICHE_REVENUE_LOSS } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { DemoNicheId } from "@/types/demo";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import BenefitPill from "./BenefitPill";
import CoachTipCard from "./CoachTipCard";
import FrameworkBadge from "./FrameworkBadge";
import GreenConfirmOverlay from "./GreenConfirmOverlay";

// ── Niche-specific loss data ───────────────────────────────────────────────────

interface LossLine {
  label: string;
  amount: number;
}

const NICHE_LEAK: Record<DemoNicheId, LossLine[]> = {
  plumber: [
    { label: "Missed calls not answered", amount: 3200 },
    { label: "5-star reviews not requested", amount: 900 },
    { label: "Social posts not published", amount: 800 },
    { label: "Business credit not built", amount: 2100 },
    { label: "Leads not followed up", amount: 1400 },
  ],
  "med-spa": [
    { label: "After-hours inquiries lost", amount: 4100 },
    { label: "No-shows without SMS reminders", amount: 1800 },
    { label: "Social content not created", amount: 1500 },
    { label: "Reviews never requested", amount: 800 },
    { label: "Business credit not built", amount: 2200 },
  ],
  hvac: [
    { label: "After-hours missed calls", amount: 3500 },
    { label: "Off-season revenue not captured", amount: 2200 },
    { label: "Social campaigns not running", amount: 1000 },
    { label: "Reviews never requested", amount: 750 },
    { label: "Business credit not built", amount: 1900 },
  ],
  restoration: [
    { label: "Emergency calls not answered", amount: 5200 },
    { label: "Insurance claims underdocumented", amount: 1800 },
    { label: "Social presence not built", amount: 900 },
    { label: "Reviews never requested", amount: 700 },
    { label: "Business credit not built", amount: 2100 },
  ],
  "carpet-cleaning": [
    { label: "Rebooking follow-ups not sent", amount: 1800 },
    { label: "Reviews not automated", amount: 600 },
    { label: "Social content not created", amount: 800 },
    { label: "Referrals not captured", amount: 1200 },
    { label: "Business credit not built", amount: 1600 },
  ],
  roofing: [
    { label: "Storm leads not captured in time", amount: 4200 },
    { label: "Estimates never followed up", amount: 2100 },
    { label: "Social presence not built", amount: 900 },
    { label: "Reviews never requested", amount: 750 },
    { label: "Business credit not built", amount: 2000 },
  ],
  "real-estate": [
    { label: "Buyer inquiries responded to late", amount: 4800 },
    { label: "Seller leads not nurtured", amount: 2500 },
    { label: "Social content not posted", amount: 1400 },
    { label: "Reviews never requested", amount: 700 },
    { label: "Business credit not built", amount: 2100 },
  ],
  mortgage: [
    { label: "After-hours leads not captured", amount: 3800 },
    { label: "Realtor referrals not nurtured", amount: 1600 },
    { label: "Social content not created", amount: 1000 },
    { label: "Reviews never requested", amount: 600 },
    { label: "Business credit not built", amount: 1900 },
  ],
  chiropractor: [
    { label: "New patient calls missed", amount: 2800 },
    { label: "Patients not reactivated", amount: 1600 },
    { label: "Social content not posted", amount: 800 },
    { label: "Reviews never requested", amount: 600 },
    { label: "Business credit not built", amount: 1800 },
  ],
  dental: [
    { label: "Emergency calls missed", amount: 3400 },
    { label: "Recall patients not contacted", amount: 1800 },
    { label: "Social content not created", amount: 800 },
    { label: "Reviews never requested", amount: 700 },
    { label: "Business credit not built", amount: 1900 },
  ],
};

// ── Animated counter hook ─────────────────────────────────────────────────────

function useAnimatedCounter(
  target: number,
  durationMs: number,
  active: boolean,
): number {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const ease = 1 - (1 - progress) ** 3;
      setVal(Math.round(target * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, durationMs, active]);

  return val;
}

// ── Loss line item ────────────────────────────────────────────────────────────

function LossItem({
  item,
  active,
  index,
}: { item: LossLine; active: boolean; index: number }) {
  const val = useAnimatedCounter(item.amount, 1200, active);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: active ? 1 : 0.15, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
      className="flex items-center justify-between gap-3 py-3"
      style={{ borderBottom: "1px solid oklch(1 0 0 / 6%)" }}
      data-ocid={`demo.step8.loss_item.${index + 1}`}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
          style={{
            background: active
              ? "oklch(0.55 0.22 25 / 20%)"
              : "oklch(0.3 0.02 280 / 30%)",
          }}
          aria-hidden="true"
        >
          {active ? "↓" : "·"}
        </span>
        <span
          className="text-sm font-semibold truncate"
          style={{
            color: active ? "oklch(0.82 0.02 280)" : "oklch(0.45 0.02 280)",
          }}
        >
          {item.label}
        </span>
      </div>
      <span
        className="text-sm font-black tabular-nums shrink-0"
        style={{
          color: active ? "oklch(0.72 0.22 25)" : "oklch(0.4 0.02 280)",
        }}
      >
        {active ? `-$${val.toLocaleString()}/mo` : "—"}
      </span>
    </motion.div>
  );
}

// ── Total counter ─────────────────────────────────────────────────────────────

function TotalCounter({ total, active }: { total: number; active: boolean }) {
  const val = useAnimatedCounter(total, 1800, active);
  return (
    <motion.span
      className="font-black tabular-nums"
      style={{
        fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
        color: "oklch(0.72 0.22 25)",
        textShadow: active ? "0 0 20px oklch(0.62 0.22 25 / 40%)" : "none",
      }}
    >
      -${(active ? val : 0).toLocaleString()}/mo
    </motion.span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DemoStep8Revenue() {
  const { businessName, city, niche, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const cityLabel = city || "your area";
  const nicheKey = (niche || "plumber") as DemoNicheId;
  const items = NICHE_LEAK[nicheKey] ?? NICHE_LEAK.plumber;
  const total = items.reduce((s, i) => s + i.amount, 0);

  const [activeItems, setActiveItems] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [showDramatic, setShowDramatic] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [coachDismissed, setCoachDismissed] = useState(false);

  const handleOverlayDone = useCallback(() => {
    setShowOverlay(false);
    completeStep();
  }, [completeStep]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    items.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveItems(i + 1), i * 500 + 300));
    });
    const allAt = items.length * 500 + 300;
    timers.push(setTimeout(() => setShowTotal(true), allAt + 400));
    timers.push(setTimeout(() => setShowDramatic(true), allAt + 2000));
    timers.push(
      setTimeout(() => {
        setShowNextBtn(true);
        completeStep();
      }, allAt + 2800),
    );
    return () => timers.forEach(clearTimeout);
  }, [items, completeStep]);

  // Prevent unused import warning
  void NICHE_REVENUE_LOSS;

  return (
    <>
      <div
        className="w-full max-w-lg mx-auto flex flex-col gap-5 relative"
        data-ocid="demo.step8.section"
      >
        {/* Benefit pill — desktop only, never overlaps mobile text */}
        <BenefitPill
          benefit={`Stop the bleeding in ${cityLabel} — start recovering revenue today.`}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p
            className="text-[10px] font-black uppercase tracking-[0.18em] mb-1.5"
            style={{ color: "oklch(0.58 0.22 290)" }}
          >
            Act 2 · Step 8 — Revenue Reality
          </p>
          <h2
            className="text-2xl sm:text-3xl font-black leading-tight"
            style={{ color: "white" }}
          >
            Every Month Without BRF
            <br />
            <span style={{ color: "oklch(0.72 0.22 25)" }}>Costs You:</span>
          </h2>
        </motion.div>

        {/* Loss card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.11 0.016 285)",
            border: "1px solid oklch(0.55 0.18 25 / 30%)",
            boxShadow: "0 0 40px oklch(0.55 0.18 25 / 12%)",
          }}
          data-ocid="demo.step8.loss_card"
        >
          <div className="px-5 pt-4 pb-2">
            {items.map((item, i) => (
              <LossItem
                key={item.label}
                item={item}
                active={i < activeItems}
                index={i}
              />
            ))}
          </div>

          {/* Total */}
          <div
            className="px-5 py-4"
            style={{
              borderTop: "1px solid oklch(0.55 0.18 25 / 20%)",
              background: "oklch(0.09 0.016 285)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-black text-white">
                Total Lost Per Month
              </span>
              <AnimatePresence mode="wait">
                {showTotal ? (
                  <motion.div
                    key="total"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <TotalCounter total={total} active={showTotal} />
                  </motion.div>
                ) : (
                  <motion.span
                    key="dash"
                    className="text-2xl font-black"
                    style={{ color: "oklch(0.4 0.02 280)" }}
                  >
                    —
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* "This ends today." */}
        <AnimatePresence>
          {showDramatic && (
            <motion.div
              key="dramatic"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="text-center py-2"
            >
              <p
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: "white" }}
              >
                This ends today.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Framework badge */}
        <div className="flex justify-center">
          <FrameworkBadge
            badge={{
              ...FRAMEWORK_BADGES.kennedy,
              label: "Kennedy: Fear of Loss",
            }}
            size="sm"
          />
        </div>

        {/* CTA Button */}
        <AnimatePresence>
          {showNextBtn && (
            <motion.div
              key="step8-ready"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 250 }}
            >
              <p
                className="text-center text-xs font-semibold mb-3"
                style={{ color: "oklch(0.55 0.14 155)" }}
              >
                Ready! Tap to start your free trial →
              </p>
              <button
                type="button"
                onClick={() => setShowOverlay(true)}
                className="w-full py-5 rounded-2xl font-black text-lg tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.22 155), oklch(0.45 0.22 145))",
                  color: "white",
                  boxShadow: "0 8px 32px oklch(0.55 0.22 155 / 45%)",
                }}
                data-ocid="demo.step8.trial_button"
              >
                Start Your Free 7-Day Trial →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coach tip */}
      <AnimatePresence>
        {!coachDismissed && (
          <CoachTipCard
            message={`This is the real cost of ${biz}'s current setup in ${cityLabel} — every missed call, every slow follow-up, every bad review. BRF stops all of it.`}
            onDismiss={() => setCoachDismissed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOverlay && (
          <GreenConfirmOverlay
            headline="BRF Recovers All of This"
            subline={`$${total.toLocaleString()}/month recovered — starting day one`}
            items={items.slice(0, 4).map((item) => ({
              icon: "✅",
              label: item.label,
              value: `+$${item.amount.toLocaleString()}/mo recovered`,
            }))}
            closingLine="The average local business loses $8,400/month from these gaps. BRF closes every one."
            onDone={handleOverlayDone}
            dataOcid="demo.step8.revenue_overlay"
          />
        )}
      </AnimatePresence>
    </>
  );
}
