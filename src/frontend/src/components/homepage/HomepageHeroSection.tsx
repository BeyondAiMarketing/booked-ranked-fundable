import { getNicheData } from "@/data/homepageNicheData";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Neutral content when no niche is selected ────────────────────────────────

const NEUTRAL_REVENUE_LOSS = 18500;

const NEUTRAL_PAIN_POINTS = [
  "The average local service business misses 40% of inbound calls",
  "78% of customers hire the first business that responds to them",
  "Local businesses lose $12,000–$18,500/month to unanswered calls and zero follow-up",
];

// ── AI answering call state machine ─────────────────────────────────────────
type CallState = "ringing" | "answered" | "booking" | "booked" | "confirmed";

const CALL_CYCLE_MS = 18000;
const STATE_DELAYS: Record<CallState, number> = {
  ringing: 0,
  answered: 2800,
  booking: 6000,
  booked: 10500,
  confirmed: 14000,
};

function useCallStateMachine(): CallState {
  const [state, setState] = useState<CallState>("ringing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const transitions: [CallState, number][] = [
      ["ringing", 0],
      ["answered", STATE_DELAYS.answered],
      ["booking", STATE_DELAYS.booking],
      ["booked", STATE_DELAYS.booked],
      ["confirmed", STATE_DELAYS.confirmed],
    ];

    let active = true;

    function runCycle() {
      if (!active) return;
      setState("ringing");
      for (const [nextState, delay] of transitions.slice(1)) {
        timerRef.current = setTimeout(() => {
          if (active) setState(nextState);
        }, delay);
      }
      timerRef.current = setTimeout(() => {
        if (active) runCycle();
      }, CALL_CYCLE_MS);
    }

    runCycle();
    return () => {
      active = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return state;
}

// ── Revenue loss counter ─────────────────────────────────────────────────────
function RevenueLossCounter({ target }: { target: number }) {
  const [displayed, setDisplayed] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 2800;

  useEffect(() => {
    setDisplayed(0);
    startRef.current = null;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    function tick(timestamp: number) {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / DURATION, 1);
      const ease = 1 - (1 - progress) ** 3;
      setDisplayed(Math.round(ease * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target]);

  return <span className="tabular-nums">${displayed.toLocaleString()}</span>;
}

// ── AI Answering Phone UI ────────────────────────────────────────────────────
interface AiAnswerDemoProps {
  callerName: string;
  callerInitials: string;
  serviceType: string;
  appointmentTime: string;
  displayName: string;
}

function AiAnswerDemo({
  callerName,
  callerInitials,
  serviceType,
  appointmentTime,
  displayName,
}: AiAnswerDemoProps) {
  const callState = useCallStateMachine();

  const aiGreeting = `Thank you for calling ${displayName}! This is your AI front desk. I can help you schedule your appointment right now — what service do you need today?`;
  const bookingMsg = `Perfect! I have an opening ${appointmentTime}. Shall I book that for you? I'll send a confirmation by text and email right away.`;
  const confirmMsg = `You're all set! Your appointment is confirmed for ${appointmentTime}. We'll send a reminder the night before. Is there anything else I can help you with?`;

  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      aria-hidden="true"
    >
      {/* Animated glow ring when call is active */}
      {(callState === "answered" || callState === "booking") && (
        <>
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
            style={{
              boxShadow: "0 0 0 0 rgba(16,185,129,0.5)",
              animation: "answerPulse 1.4s ease-out infinite",
            }}
          />
          <style>{`
            @keyframes answerPulse {
              0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.45); }
              70% { box-shadow: 0 0 0 22px rgba(16,185,129,0); }
              100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
            }
            @keyframes ringPulse {
              0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.5); }
              70% { box-shadow: 0 0 0 20px rgba(139,92,246,0); }
              100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
            }
            @keyframes pulse {
              0%,100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
          `}</style>
        </>
      )}

      {/* Ringing ring */}
      {callState === "ringing" && (
        <>
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
            style={{ animation: "ringPulse 1.2s ease-out infinite" }}
          />
          <style>{`
            @keyframes ringPulse {
              0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.5); }
              70% { box-shadow: 0 0 0 20px rgba(139,92,246,0); }
              100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
            }
            @keyframes pulse {
              0%,100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
          `}</style>
        </>
      )}

      {/* Phone frame */}
      <div
        className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/40"
        style={{ background: "rgba(12, 10, 30, 0.95)" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-xs text-white/60 font-medium">9:41</span>
          <div className="w-20 h-5 bg-black rounded-full mx-auto -mt-1" />
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4].map((b) => (
              <div
                key={b}
                className="bg-white/60 rounded-sm"
                style={{ width: 3, height: 3 + b * 2 }}
              />
            ))}
            <div className="w-5 h-2.5 border border-white/40 rounded-sm ml-1">
              <div className="w-3 h-full bg-white/80 rounded-sm" />
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 pt-2 min-h-[360px]">
          <AnimatePresence mode="wait">
            {/* Step 1 — Ringing */}
            {callState === "ringing" && (
              <motion.div
                key="ringing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center pt-6 pb-2"
              >
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl mb-3 shadow-lg"
                  style={{
                    animation: "pulse 1s cubic-bezier(0.4,0,0.6,1) infinite",
                  }}
                >
                  {callerInitials}
                </div>
                <p className="text-white font-semibold text-lg">{callerName}</p>
                <p className="text-slate-400 text-sm mb-1">+1 (555) 482-9031</p>
                <p className="text-green-400 text-sm font-medium mb-8 animate-pulse">
                  Incoming call…
                </p>

                {/* AI intercepting indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
                  style={{
                    background: "rgba(139,92,246,0.18)",
                    border: "1px solid rgba(139,92,246,0.4)",
                    color: "#c4b5fd",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  AI Front Desk intercepting…
                </motion.div>

                <div className="flex gap-8">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-2xl">📵</span>
                    </div>
                    <span className="text-xs text-slate-400">Decline</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center animate-pulse">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <span className="text-xs text-green-400 font-semibold">
                      AI Answers
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 — AI answered, greeting */}
            {callState === "answered" && (
              <motion.div
                key="answered"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pt-3 flex flex-col gap-3"
              >
                {/* Call status bar */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 font-semibold">
                      Connected
                    </span>
                  </div>
                  <span className="text-slate-500">0:03</span>
                </div>

                {/* Waveform */}
                <div className="flex items-center justify-center gap-0.5 h-8 mb-1">
                  {[30, 55, 75, 90, 65, 80, 50, 70, 40, 60, 85, 45].map(
                    (h, i) => (
                      <motion.div
                        // biome-ignore lint/suspicious/noArrayIndexKey: static array
                        key={i}
                        className="w-1 rounded-full bg-green-400"
                        animate={{ scaleY: [0.3, h / 50, 0.3] }}
                        transition={{
                          duration: 0.5 + i * 0.04,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        style={{ height: 24, transformOrigin: "center" }}
                      />
                    ),
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                    AI
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 flex-1"
                    style={{
                      background: "rgba(99,102,241,0.22)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }}
                  >
                    <p className="text-sm text-white leading-relaxed">
                      {aiGreeting}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-green-400 font-semibold text-center mt-1">
                  ✓ AI answered in under 1 second
                </p>
              </motion.div>
            )}

            {/* Step 3 — Booking */}
            {callState === "booking" && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pt-3 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 font-semibold">
                      Booking appointment…
                    </span>
                  </div>
                  <span className="text-slate-500">0:38</span>
                </div>

                {/* Caller message */}
                <div className="flex justify-end">
                  <div
                    className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]"
                    style={{
                      background: "rgba(16,185,129,0.18)",
                      border: "1px solid rgba(16,185,129,0.28)",
                    }}
                  >
                    <p className="text-sm text-white">
                      Yes, I need {serviceType.toLowerCase()} — as soon as
                      possible.
                    </p>
                  </div>
                </div>

                {/* AI booking response */}
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                    AI
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 flex-1"
                    style={{
                      background: "rgba(99,102,241,0.22)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }}
                  >
                    <p className="text-sm text-white leading-relaxed">
                      {bookingMsg}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-purple-300">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    ⚙️
                  </motion.span>
                  Checking calendar availability…
                </div>
              </motion.div>
            )}

            {/* Step 4 — Booked */}
            {callState === "booked" && (
              <motion.div
                key="booked"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pt-3 flex flex-col gap-3"
              >
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                    AI
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-sm px-4 py-3 flex-1"
                    style={{
                      background: "rgba(99,102,241,0.22)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }}
                  >
                    <p className="text-sm text-white leading-relaxed">
                      {confirmMsg}
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full rounded-2xl px-5 py-4 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(5,150,105,0.12) 100%)",
                    border: "1px solid rgba(16,185,129,0.4)",
                  }}
                >
                  <div className="text-3xl mb-1">✅</div>
                  <p className="text-green-400 font-bold text-sm mb-0.5">
                    Appointment Confirmed!
                  </p>
                  <p className="text-white text-xs font-semibold">
                    {serviceType}
                  </p>
                  <p className="text-slate-300 text-xs mt-0.5">
                    {callerName} · {appointmentTime}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Step 5 — Full confirmation cascade */}
            {callState === "confirmed" && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pt-4 flex flex-col items-center gap-3"
              >
                <div
                  className="w-full rounded-2xl px-5 py-4 text-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.15) 100%)",
                    border: "1px solid rgba(16,185,129,0.4)",
                  }}
                >
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-green-400 font-bold text-base mb-1">
                    Booked & Confirmed!
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {serviceType}
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    {callerName} · {appointmentTime}
                  </p>
                </div>

                <div className="flex gap-3 w-full text-xs">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 rounded-xl px-3 py-2.5 text-center"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.25)",
                    }}
                  >
                    <p className="text-indigo-300 font-semibold">📱 SMS</p>
                    <p className="text-slate-400 mt-0.5">Sent ✓</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex-1 rounded-xl px-3 py-2.5 text-center"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.25)",
                    }}
                  >
                    <p className="text-green-400 font-semibold">📅 CRM</p>
                    <p className="text-slate-400 mt-0.5">Lead saved ✓</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex-1 rounded-xl px-3 py-2.5 text-center"
                    style={{
                      background: "rgba(234,179,8,0.1)",
                      border: "1px solid rgba(234,179,8,0.25)",
                    }}
                  >
                    <p className="text-yellow-400 font-semibold">📧 Email</p>
                    <p className="text-slate-400 mt-0.5">Sent ✓</p>
                  </motion.div>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  Handled while you were on the job — automatically
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Main hero component ──────────────────────────────────────────────────────
interface HomepageHeroSectionProps {
  activeNiche: string | null;
  businessName?: string;
  onCtaClick?: () => void;
}

export function HomepageHeroSection({
  activeNiche,
  businessName = "",
  onCtaClick,
}: HomepageHeroSectionProps) {
  const nicheData = getNicheData(activeNiche);
  const isNeutral = !nicheData;

  // Neutral: $18,500. Niche-specific when selected.
  const revenueLossTarget = nicheData?.revenueLoss ?? NEUTRAL_REVENUE_LOSS;

  // CTA label
  const ctaLabel = isNeutral
    ? "See Your AI Agent Answer Right Now — Pick Your Industry"
    : `See Your ${nicheData.label} AI Agent In Action`;

  // Eyebrow badge — neutral or niche-specific
  const eyebrowText = isNeutral
    ? "Every Local Service Business Has the Same Problem"
    : `${nicheData.label} Pain Point: ${nicheData.painPointNumber ?? nicheData.painPointStat}`;

  // Phone demo props — neutral or niche-specific
  const callerName = nicheData?.dashboardSample.callerName ?? "Alex Reynolds";
  const callerInitials = nicheData?.dashboardSample.callerInitials ?? "AR";
  const serviceType =
    nicheData?.dashboardSample.serviceType ?? "Service Appointment";
  const appointmentTime =
    nicheData?.dashboardSample.appointmentTime ?? "Today, 2–4 PM";
  const displayName =
    businessName ||
    (nicheData ? `${nicheData.label} Business` : "Your Business");

  return (
    <section
      id="hero"
      data-ocid="homepage.hero.section"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(88,28,135,0.35) 0%, transparent 70%), linear-gradient(180deg, #020617 0%, #0c0a1e 50%, #020617 100%)",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left — headline & CTAs ── */}
          <div>
            {/* Kennedy framework eyebrow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNiche ?? "neutral"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5 text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  {eyebrowText}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Main headline — AI-first, Kennedy framework */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`headline-${activeNiche ?? "neutral"}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35 }}
                className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-white mb-5"
              >
                {isNeutral ? (
                  <>
                    Your AI Front Desk Is Open{" "}
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%)",
                      }}
                    >
                      24/7.
                    </span>{" "}
                    Every Call Answered. Every Lead Closed.
                  </>
                ) : (
                  <>
                    Every Unanswered Call Is a Job{" "}
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%)",
                      }}
                    >
                      Working for Your Competitor
                    </span>
                  </>
                )}
              </motion.h1>
            </AnimatePresence>

            {/* Pain point sub-headline */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`pain-${activeNiche ?? "neutral"}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35 }}
                className="text-base md:text-lg text-slate-300 mb-4 leading-relaxed max-w-lg"
              >
                {isNeutral ? (
                  <>
                    <span className="text-white font-semibold">
                      While your competitors send callers to voicemail,
                    </span>{" "}
                    your AI agent answers, qualifies, books the appointment, and
                    fires the confirmation — automatically. While you're on the
                    job.
                  </>
                ) : (
                  <>
                    <span className="text-white font-semibold">
                      {nicheData.painPointLabel}
                    </span>{" "}
                    BRF stops the bleed — permanently.
                  </>
                )}
              </motion.p>
            </AnimatePresence>

            {/* Neutral pain point stats */}
            {isNeutral && (
              <motion.ul
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="flex flex-col gap-1.5 mb-6 max-w-lg"
              >
                {NEUTRAL_PAIN_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-slate-400"
                  >
                    <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
                    {point}
                  </li>
                ))}
              </motion.ul>
            )}

            {/* Revenue counter */}
            <div
              className="flex items-center gap-3 rounded-xl px-5 py-4 mb-8 max-w-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <div className="text-3xl shrink-0">📉</div>
              <div>
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-0.5">
                  {isNeutral
                    ? "Average monthly revenue leak"
                    : "Your monthly revenue leak"}
                </p>
                <p className="text-2xl font-black text-white">
                  <RevenueLossCounter target={revenueLossTarget} />
                  <span className="text-lg text-red-400 font-bold">/mo</span>
                </p>
              </div>
            </div>

            {/* CTAs — fixed layout, nothing moves */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <button
                type="button"
                data-ocid="homepage.hero.primary_button"
                onClick={onCtaClick}
                className="inline-flex items-center gap-2.5 rounded-xl px-7 py-4 text-base font-bold text-white transition-all duration-200 shadow-xl shadow-purple-900/60 hover:shadow-purple-800/70 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                }}
              >
                <span>⚡</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ctaLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {ctaLabel}
                  </motion.span>
                </AnimatePresence>
                <span>→</span>
              </button>

              <a
                href="#stage1"
                data-ocid="homepage.hero.secondary_button"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-4 text-base font-semibold text-slate-300 border border-white/15 hover:border-white/30 hover:text-white transition-colors duration-200"
              >
                Watch It Live ↓
              </a>
            </div>

            {/* Trust trio */}
            <div className="flex flex-wrap gap-4 mt-6">
              {[
                "🔒 No credit card required",
                "⚡ 7-day free trial",
                "✅ All 10 niches built",
              ].map((t) => (
                <span key={t} className="text-xs text-slate-500">
                  {t}
                </span>
              ))}
            </div>

            {/* Niche selector prompt when neutral */}
            {isNeutral && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                style={{
                  background: "rgba(139,92,246,0.12)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#c4b5fd",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Select your business type above to see your personalized numbers
                →
              </motion.div>
            )}
          </div>

          {/* ── Right — AI answering animation ── */}
          <div className="flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`phone-${activeNiche ?? "neutral"}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <AiAnswerDemo
                  callerName={callerName}
                  callerInitials={callerInitials}
                  serviceType={serviceType}
                  appointmentTime={appointmentTime}
                  displayName={displayName}
                />
              </motion.div>
            </AnimatePresence>

            <p className="text-xs text-slate-500 text-center max-w-xs">
              {isNeutral
                ? "Watch your AI front desk answer, qualify, book, and confirm — while you're on the job."
                : `This is your ${nicheData.label.toLowerCase()} AI agent in action — answering every call, booking every appointment, automatically.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
