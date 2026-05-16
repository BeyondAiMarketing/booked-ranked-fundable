/**
 * DemoStep4CRM — "Here's What Just Happened Behind the Scenes"
 * Animated CRM lead card with CSS-based typewriter animation (no React re-renders).
 * Framework badge: Hormozi — "The Value Stack"
 * Coach tip + ArrowCallout + BenefitPill added for back-office guidance.
 */

import { FRAMEWORK_BADGES } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { DemoNicheId } from "@/types/demo";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import BenefitPill from "./BenefitPill";
import CoachTipCard from "./CoachTipCard";
import FrameworkBadge from "./FrameworkBadge";
import GreenConfirmOverlay from "./GreenConfirmOverlay";

// ── Niche-specific data ────────────────────────────────────────────────────────────────

const NICHE_CALLER: Record<DemoNicheId, string> = {
  plumber: "Mike Thompson",
  "med-spa": "Ashley Carter",
  hvac: "Sandra Williams",
  restoration: "David Nguyen",
  "carpet-cleaning": "Jennifer Park",
  roofing: "Robert Martinez",
  "real-estate": "Lisa Thompson",
  mortgage: "Tom Bradley",
  chiropractor: "Patricia Cole",
  dental: "Marcus Johnson",
};

const NICHE_SERVICE: Record<DemoNicheId, string> = {
  plumber: "Emergency Pipe Repair",
  "med-spa": "Botox Consultation",
  hvac: "AC Emergency Repair",
  restoration: "Water Damage Response",
  "carpet-cleaning": "Deep Steam Cleaning",
  roofing: "Free Storm Inspection",
  "real-estate": "Property Showing Request",
  mortgage: "Rate Lock Consultation",
  chiropractor: "New Patient Evaluation",
  dental: "Emergency Dental Exam",
};

const NICHE_PAIN: Record<DemoNicheId, { stat: string; label: string }> = {
  plumber: {
    stat: "67%",
    label: "of follow-up calls never happen — leads go cold in 24 hours",
  },
  "med-spa": {
    stat: "52%",
    label:
      "of new inquiries are never followed up — they book with a competitor",
  },
  hvac: {
    stat: "71%",
    label: "of leads that don't hear back in 1 hour choose another company",
  },
  restoration: {
    stat: "8 min",
    label:
      "is how long homeowners wait before calling your competitor after a disaster",
  },
  "carpet-cleaning": {
    stat: "74%",
    label:
      "of customers rebook with whoever follows up first — not whoever did the best job",
  },
  roofing: {
    stat: "3 of 4",
    label:
      "roofing estimates are lost because no one followed up within 48 hours",
  },
  "real-estate": {
    stat: "78%",
    label:
      "of buyers choose the first agent to respond — no follow-up means no deal",
  },
  mortgage: {
    stat: "67%",
    label:
      "of mortgage leads come after 5pm — most brokers miss their entire pipeline",
  },
  chiropractor: {
    stat: "40%",
    label:
      "of new patients never rebook because no one followed up within 48 hours",
  },
  dental: {
    stat: "$2,400",
    label:
      "in lifetime value is lost every time a new patient call goes unanswered",
  },
};

const APPT_TIMES: Record<DemoNicheId, string> = {
  plumber: "Today · 2:30 PM",
  "med-spa": "Thursday · 11:00 AM",
  hvac: "Today · 4:15 PM",
  restoration: "Today · ASAP",
  "carpet-cleaning": "Friday · 9:00 AM",
  roofing: "Saturday · 10:00 AM",
  "real-estate": "Tomorrow · 1:00 PM",
  mortgage: "Wednesday · 3:00 PM",
  chiropractor: "Monday · 10:30 AM",
  dental: "Today · 3:45 PM",
};

// ── CSS typewriter animation (no React state per-character — no re-renders) ──

const TYPEWRITER_CSS = `
@keyframes brf-typewriter {
  from { max-width: 0; }
  to   { max-width: 100%; }
}
.brf-typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  max-width: 100%;
  animation: brf-typewriter var(--brf-dur, 1.2s) steps(var(--brf-steps, 20), end) var(--brf-delay, 0s) both;
}
`;

// ── Animated field row (CSS-based, no per-char re-renders) ───────────────

function FieldRow({
  label,
  value,
  active,
  delay,
  highlight,
}: {
  label: string;
  value: string;
  active: boolean;
  delay: number;
  highlight?: boolean;
}) {
  const durationMs = Math.min(value.length * 38, 2000);
  const steps = Math.max(value.length, 1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: active ? 1 : 0.2, x: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className="flex items-start justify-between gap-3 py-2"
      style={{ borderBottom: "1px solid oklch(1 0 0 / 5%)" }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest shrink-0 w-28"
        style={{ color: "oklch(0.45 0.02 280)" }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold text-right flex-1 min-w-0 break-words"
        style={{
          color: highlight ? "oklch(0.82 0.18 40)" : "oklch(0.9 0.01 280)",
          fontFamily: "monospace",
        }}
      >
        {active && (
          <span
            className="brf-typewriter"
            style={
              {
                "--brf-dur": `${durationMs}ms`,
                "--brf-steps": steps,
                "--brf-delay": `${delay}ms`,
              } as React.CSSProperties
            }
          >
            {value}
          </span>
        )}
      </span>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DemoStep4CRM() {
  const { businessName, city, niche, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const locationLabel = city ? ` in ${city}` : "";
  const nicheKey = (niche || "plumber") as DemoNicheId;

  const caller = NICHE_CALLER[nicheKey] ?? "Mike Thompson";
  const service = NICHE_SERVICE[nicheKey] ?? "Service Appointment";
  const pain = NICHE_PAIN[nicheKey] ?? NICHE_PAIN.plumber;
  const apptTime = APPT_TIMES[nicheKey] ?? "Today · ASAP";
  const initials = caller
    .split(" ")
    .map((n) => n[0])
    .join("");

  const [cardActive, setCardActive] = useState(false);
  const [showSmsBadge, setShowSmsBadge] = useState(false);
  const [showCalBadge, setShowCalBadge] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [coachDismissed, setCoachDismissed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCardActive(true), 400);
    const t2 = setTimeout(() => setShowSmsBadge(true), 3200);
    const t3 = setTimeout(() => setShowCalBadge(true), 3800);
    const t4 = setTimeout(() => {
      setShowNextBtn(true);
      completeStep();
    }, 4600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [completeStep]);

  const handleNext = useCallback(() => {
    setShowOverlay(true);
  }, []);

  const handleOverlayDone = useCallback(() => {
    setShowOverlay(false);
    completeStep();
  }, [completeStep]);

  return (
    <>
      <style>{TYPEWRITER_CSS}</style>
      <div
        className="w-full max-w-lg mx-auto flex flex-col gap-5 relative"
        data-ocid="demo.step4.section"
      >
        {/* Benefit pill — desktop only, never overlaps mobile text */}
        <BenefitPill benefit="Never lose a lead again — every call captured automatically." />

        {/* Act label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p
            className="text-[10px] font-black uppercase tracking-[0.18em] mb-1.5"
            style={{ color: "oklch(0.58 0.22 290)" }}
          >
            Act 2 — Back Office Reveal
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Here’s What Just Happened
            <br />
            <span style={{ color: "oklch(0.72 0.18 155)" }}>
              {`Behind the Scenes${locationLabel}`}
            </span>
          </h2>
        </motion.div>

        {/* Pain point stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl px-5 py-4 text-center"
          style={{
            background: "oklch(0.1 0.014 280)",
            border: "1px solid oklch(0.55 0.18 25 / 30%)",
          }}
        >
          <span
            className="block text-4xl font-black tabular-nums mb-1"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.18 25), oklch(0.68 0.22 25))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {pain.stat}
          </span>
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.75 0.02 280)" }}
          >
            {pain.label}
          </p>
        </motion.div>

        {/* CRM Lead Card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 260,
            delay: 0.3,
          }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.11 0.016 285)",
            border: "1px solid oklch(0.58 0.22 290 / 40%)",
            boxShadow:
              "0 0 40px oklch(0.58 0.22 290 / 20%), 0 0 0 1px oklch(0.58 0.22 290 / 10%)",
          }}
          data-ocid="demo.step4.lead_card"
        >
          <div
            className="px-4 py-3 flex items-center justify-between gap-3"
            style={{
              background: "oklch(0.14 0.018 285)",
              borderBottom: "1px solid oklch(1 0 0 / 8%)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.45 0.22 290))",
                }}
              >
                {initials}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{caller}</div>
                <div
                  className="text-[10px]"
                  style={{ color: "oklch(0.5 0.02 280)" }}
                >
                  ***-***-1234 · Just now
                </div>
              </div>
            </div>
            <span
              className="text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 animate-pulse"
              style={{
                background: "oklch(0.62 0.22 40 / 20%)",
                color: "oklch(0.85 0.2 40)",
                border: "1px solid oklch(0.62 0.22 40 / 45%)",
              }}
              data-ocid="demo.step4.hot_badge"
            >
              🔥 HOT PROSPECT
            </span>
          </div>

          <div className="px-4 pt-2 pb-1">
            <FieldRow
              label="Lead Name"
              value={caller}
              active={cardActive}
              delay={0}
            />
            <FieldRow
              label="Service"
              value={service}
              active={cardActive}
              delay={500}
            />
            <FieldRow
              label="Appointment"
              value={apptTime}
              active={cardActive}
              delay={1000}
            />
            <FieldRow
              label="Business"
              value={biz}
              active={cardActive}
              delay={1500}
            />
            <FieldRow
              label="Source"
              value="AI Voice Agent"
              active={cardActive}
              delay={2000}
            />
            <FieldRow
              label="Status"
              value="HOT PROSPECT — 92/100"
              active={cardActive}
              delay={2500}
              highlight
            />
          </div>

          <div
            className="px-4 py-3 flex flex-wrap gap-2"
            style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}
          >
            <AnimatePresence>
              {showSmsBadge && (
                <motion.span
                  key="sms"
                  initial={{ opacity: 0, scale: 0.8, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 18, stiffness: 300 }}
                  className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "oklch(0.55 0.22 155 / 18%)",
                    color: "oklch(0.72 0.18 155)",
                    border: "1px solid oklch(0.55 0.22 155 / 35%)",
                  }}
                  data-ocid="demo.step4.sms_badge"
                >
                  📱 SMS Sent ✓
                </motion.span>
              )}
              {showCalBadge && (
                <motion.span
                  key="cal"
                  initial={{ opacity: 0, scale: 0.8, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", damping: 18, stiffness: 300 }}
                  className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: "oklch(0.6 0.18 240 / 18%)",
                    color: "oklch(0.76 0.14 240)",
                    border: "1px solid oklch(0.6 0.18 240 / 35%)",
                  }}
                  data-ocid="demo.step4.calendar_badge"
                >
                  📅 Calendar Updated ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Pipeline counter */}
        <AnimatePresence>
          {showCalBadge && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 rounded-xl px-4 py-3"
              style={{
                background: "oklch(0.58 0.22 290 / 10%)",
                border: "1px solid oklch(0.58 0.22 290 / 25%)",
              }}
            >
              <span
                className="text-2xl font-black"
                style={{ color: "oklch(0.88 0.18 290)" }}
              >
                +1
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "oklch(0.72 0.1 290)" }}
              >
                New Lead Added to Pipeline
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Framework badge */}
        <div className="flex justify-center">
          <FrameworkBadge
            badge={{
              ...FRAMEWORK_BADGES.hormozi,
              label: "Hormozi: The Value Stack",
            }}
            size="sm"
          />
        </div>

        {/* Next button with ready hint */}
        <AnimatePresence>
          {showNextBtn && (
            <motion.div
              key="step4-ready"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                className="text-center text-xs font-semibold mb-3"
                style={{ color: "oklch(0.55 0.14 290)" }}
              >
                Ready! Tap Next to continue →
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 290))",
                  color: "white",
                  boxShadow: "0 4px 20px oklch(0.58 0.22 290 / 35%)",
                }}
                data-ocid="demo.step4.next_button"
              >
                Next: Your Reputation →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coach tip */}
      <AnimatePresence>
        {!coachDismissed && (
          <CoachTipCard
            message={`This is your CRM — every lead that calls or books ${biz} goes right here. See their name, their need, follow up with one tap.`}
            onDismiss={() => setCoachDismissed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOverlay && (
          <GreenConfirmOverlay
            headline="Lead Captured"
            subline="CRM Record Created in Real Time"
            items={[
              { icon: "👤", label: "Caller", value: caller },
              { icon: "🔧", label: "Service", value: service },
              { icon: "📅", label: "Booked", value: apptTime },
              { icon: "🔥", label: "Status", value: "Hot Prospect — 92/100" },
              {
                icon: "✅",
                label: "Auto",
                value: "SMS sent + Calendar updated",
              },
            ]}
            closingLine="Every call captured, scored, and routed — automatically."
            onDone={handleOverlayDone}
            dataOcid="demo.step4.crm_overlay"
          />
        )}
      </AnimatePresence>
    </>
  );
}
