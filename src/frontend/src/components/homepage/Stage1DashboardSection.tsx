/**
 * Stage1DashboardSection
 * Homepage live demo — Act 1: "Every call answered, automatically."
 *
 * 12-second cinematic loop (6 steps × 2s each, step 6 = 1s then restart).
 * IntersectionObserver triggers start; loop pauses when off-screen.
 * Mobile-first — cards stack full-width on small screens.
 *
 * Supports isNeutral=true for generic content when no niche is selected.
 */

import type { HomepageNicheData } from "@/data/homepageNicheData";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AiAnswerBubble,
  AllDoneStep,
  AppointmentCard,
  CrmLeadCard,
  PhoneRingingWidget,
  SmsBubble,
} from "./Stage1AnimationCards";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoopStep = 1 | 2 | 3 | 4 | 5 | 6;

interface Props {
  nicheData: HomepageNicheData;
  businessName?: string;
  /** When true, shows generic neutral content — no niche-specific copy */
  isNeutral?: boolean;
}

const STEP_DURATIONS: Record<LoopStep, number> = {
  1: 2000,
  2: 2000,
  3: 2000,
  4: 2000,
  5: 2000,
  6: 1000,
};

const STEP_LABELS: { s: LoopStep; label: string; icon: string }[] = [
  { s: 1, label: "Call comes in", icon: "📞" },
  { s: 2, label: "AI answers instantly", icon: "🤖" },
  { s: 3, label: "CRM lead created", icon: "👤" },
  { s: 4, label: "Appointment booked", icon: "📅" },
  { s: 5, label: "SMS confirmation fires", icon: "📱" },
  { s: 6, label: "All done automatically", icon: "✅" },
];

// ─── Generic neutral data ─────────────────────────────────────────────────────

const NEUTRAL_DASHBOARD = {
  callerName: "New Customer",
  callerInitials: "NC",
  serviceType: "Service Appointment",
  appointmentTime: "Today, 2:00 PM",
  phoneDisplay: "(555) 000-0000",
};

const NEUTRAL_PAIN_STAT = "40%";
const NEUTRAL_PAIN_LABEL =
  "of local service businesses miss inbound calls on average — that's revenue walking straight to your competitor";
const NEUTRAL_ACCENT_HUE = 290;
const NEUTRAL_TESTIMONIAL = {
  quote:
    "Since BRF, I never miss a call. My calendar is always full. The AI handles everything while I'm on the job.",
  owner: "Local Business Owner",
  business: "Service Business",
  result: "+$14K/mo in recaptured revenue",
  icon: "🏆",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Stage1DashboardSection({
  nicheData,
  businessName = "Your Business",
  isNeutral = false,
}: Props) {
  const [step, setStep] = useState<LoopStep>(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setStep((prev) => (prev === 6 ? 1 : ((prev + 1) as LoopStep)));
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    timerRef.current = setTimeout(advance, STEP_DURATIONS[step]);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step, isVisible, advance]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Use neutral or niche-specific data
  const dashboardSample = isNeutral
    ? NEUTRAL_DASHBOARD
    : nicheData.dashboardSample;
  const painPointStat = isNeutral ? NEUTRAL_PAIN_STAT : nicheData.painPointStat;
  const painPointLabel = isNeutral
    ? NEUTRAL_PAIN_LABEL
    : nicheData.painPointLabel;
  const accentHue = isNeutral ? NEUTRAL_ACCENT_HUE : nicheData.accentHue;

  const testimonialQuote = isNeutral
    ? NEUTRAL_TESTIMONIAL.quote
    : nicheData.testimonialQuote;
  const testimonialOwner = isNeutral
    ? NEUTRAL_TESTIMONIAL.owner
    : nicheData.testimonialOwner;
  const testimonialBusiness = isNeutral
    ? NEUTRAL_TESTIMONIAL.business
    : nicheData.testimonialBusiness;
  const testimonialResult = isNeutral
    ? NEUTRAL_TESTIMONIAL.result
    : nicheData.testimonialResult;
  const nicheIcon = isNeutral ? NEUTRAL_TESTIMONIAL.icon : nicheData.icon;

  return (
    <section
      ref={sectionRef}
      id="stage1"
      aria-label="AI receptionist live demo"
      data-ocid="homepage.stage1.section"
      className="w-full py-16 sm:py-24 px-4"
      style={{ background: "oklch(0.10 0.012 280)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{
              background: `oklch(0.22 0.06 ${accentHue} / 0.5)`,
              border: `1px solid oklch(0.58 0.22 ${accentHue} / 30%)`,
              color: `oklch(0.72 0.18 ${accentHue})`,
            }}
          >
            <span aria-hidden="true">🤖</span> Stage 1 — AI Front Desk
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight mb-4"
          >
            What if every call was answered —{" "}
            <span style={{ color: `oklch(0.72 0.18 ${accentHue})` }}>
              automatically?
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 rounded-2xl mx-auto"
            style={{
              background: "oklch(0.14 0.016 280 / 0.8)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
            data-ocid="homepage.stage1.pain_stat"
          >
            <span
              className="text-4xl sm:text-5xl font-black tabular-nums"
              style={{ color: `oklch(0.72 0.22 ${accentHue})` }}
            >
              {painPointStat}
            </span>
            <span className="text-sm text-muted-foreground max-w-xs text-center sm:text-left">
              {painPointLabel}
            </span>
          </motion.div>
        </div>

        {/* Animation stage + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: cinematic loop */}
          <div
            className="space-y-3 min-h-[340px]"
            aria-live="polite"
            aria-label="Live demo animation"
            data-ocid="homepage.stage1.animation_panel"
          >
            <AnimatePresence>
              {step >= 1 && (
                <PhoneRingingWidget
                  callerName={dashboardSample.callerName}
                  callerInitials={dashboardSample.callerInitials}
                  phone={dashboardSample.phoneDisplay}
                  accentHue={accentHue}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 2 && step < 6 && (
                <AiAnswerBubble
                  businessName={businessName}
                  accentHue={accentHue}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 3 && step < 6 && (
                <CrmLeadCard
                  callerName={dashboardSample.callerName}
                  serviceType={dashboardSample.serviceType}
                  accentHue={accentHue}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 4 && step < 6 && (
                <AppointmentCard
                  callerName={dashboardSample.callerName}
                  serviceType={dashboardSample.serviceType}
                  appointmentTime={dashboardSample.appointmentTime}
                  accentHue={accentHue}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 5 && step < 6 && (
                <SmsBubble
                  businessName={businessName}
                  callerName={dashboardSample.callerName}
                  appointmentTime={dashboardSample.appointmentTime}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>{step === 6 && <AllDoneStep />}</AnimatePresence>
          </div>

          {/* Right: progress tracker */}
          <div className="flex flex-col gap-6">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.14 0.016 280 / 0.8)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
              data-ocid="homepage.stage1.progress_panel"
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                Live Demo — {isVisible ? "Running" : "Paused"}
              </p>
              <div className="space-y-3">
                {STEP_LABELS.map(({ s, label, icon }) => (
                  <div key={s} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition-all duration-300"
                      style={{
                        background:
                          step >= s
                            ? `oklch(0.38 0.16 ${accentHue} / 50%)`
                            : "oklch(0.18 0.012 280)",
                        border: `1px solid ${step >= s ? `oklch(0.58 0.22 ${accentHue} / 60%)` : "oklch(1 0 0 / 8%)"}`,
                      }}
                    >
                      <span aria-hidden="true">{step >= s ? icon : s}</span>
                    </div>
                    <span
                      className="text-sm font-semibold transition-colors duration-300"
                      style={{
                        color:
                          step >= s
                            ? "oklch(0.88 0.01 280)"
                            : "oklch(0.45 0.01 280)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="mt-5 h-1 rounded-full overflow-hidden"
                style={{ background: "oklch(1 0 0 / 6%)" }}
                aria-hidden="true"
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, oklch(0.58 0.22 ${accentHue}), oklch(0.62 0.18 155))`,
                  }}
                  animate={{ width: `${((step - 1) / 5) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <p
              className="text-sm font-semibold text-center italic px-4"
              style={{ color: "oklch(0.55 0.02 280)" }}
            >
              "That call was handled, transcribed, logged, and followed up —
              while you were doing something else."
            </p>
          </div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-14 rounded-2xl p-6"
          style={{
            background: "oklch(0.13 0.018 280 / 0.85)",
            border: `1px solid oklch(0.58 0.22 ${accentHue} / 18%)`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 0 40px oklch(0.58 0.22 ${accentHue} / 8%)`,
          }}
          data-ocid="homepage.stage1.testimonial_card"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
              style={{ background: `oklch(0.28 0.1 ${accentHue} / 0.5)` }}
              aria-hidden="true"
            >
              {nicheIcon}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-base sm:text-lg font-semibold leading-relaxed mb-3"
                style={{ color: "oklch(0.88 0.01 280)" }}
              >
                "{testimonialQuote}"
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-sm font-bold text-foreground">
                  {testimonialOwner}
                </span>
                <span className="hidden sm:inline text-muted-foreground">
                  ·
                </span>
                <span className="text-sm text-muted-foreground">
                  {testimonialBusiness}
                </span>
                <span className="hidden sm:inline text-muted-foreground">
                  ·
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `oklch(0.32 0.14 ${accentHue} / 25%)`,
                    color: `oklch(0.72 0.18 ${accentHue})`,
                  }}
                >
                  {testimonialResult}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
