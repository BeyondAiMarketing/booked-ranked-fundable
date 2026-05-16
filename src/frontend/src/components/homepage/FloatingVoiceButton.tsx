/**
 * FloatingVoiceButton — fixed bottom-right voice demo trigger.
 * Supports isNeutral=true when no niche is selected.
 * When neutral, shows a generic AI greeting and prompts user to pick a niche.
 * Audio pre-loads on mount; plays SYNCHRONOUSLY on Answer tap.
 */

import GreenConfirmOverlay from "@/components/demo/GreenConfirmOverlay";
import type { HomepageNicheData } from "@/data/homepageNicheData";
import {
  NICHE_VOICE_SCRIPTS,
  buildScriptLines,
  initAudioContext,
  playPreloadedAudioWithText,
  preloadNicheScripts,
  startAudioSequence,
  stopAllAudio,
} from "@/services/audioService";
import { Phone, PhoneCall, PhoneOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  nicheData: HomepageNicheData;
  /** When true, use generic neutral voice greeting — no plumber fallback */
  isNeutral?: boolean;
}

type CallState = "idle" | "ringing" | "active" | "ended";

interface TranscriptLine {
  role: "agent" | "caller";
  text: string;
}

// ─── Neutral script (used when no niche is selected) ─────────────────────────

const NEUTRAL_VOICE_SCRIPT = {
  niche: "neutral",
  voiceName: "Aria",
  voiceId: "9BWtsMINqrJLrRacOk9x",
  callerName: "Alex Reynolds",
  callerQuestion:
    "Hi, I found you online and I'd like to schedule an appointment as soon as possible.",
  agentGreeting:
    "Thank you for calling {{businessName}}, this is your AI front desk. I'd be happy to get you scheduled right away — what service can I help you with today?",
  agentResponse:
    "I'm checking our availability now. We have openings as early as tomorrow morning. Can I get your name and the best number to confirm?",
  agentBookingConfirm:
    "Perfect! Your appointment is confirmed. You'll receive a text confirmation shortly, and we'll send you a reminder the evening before.",
  agentFarewell:
    "Is there anything else I can help you with? Great — we look forward to seeing you!",
};

// ─── Waveform Bars ────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [40, 70, 55, 85, 60, 45, 75, 50, 65, 40];
const BAR_KEYS = BAR_HEIGHTS.map((_, barIdx) => `waveform-bar-${barIdx}`);

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1 h-10" aria-hidden="true">
      {BAR_HEIGHTS.map((h, barIdx) => (
        <motion.div
          key={BAR_KEYS[barIdx]}
          className="w-1 rounded-full"
          style={{ background: "var(--purple-accent)" }}
          animate={
            active
              ? { scaleY: [1, h / 50, 1], opacity: [0.6, 1, 0.6] }
              : { scaleY: 0.2, opacity: 0.3 }
          }
          transition={
            active
              ? {
                  duration: 0.6 + barIdx * 0.07,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
          initial={false}
        />
      ))}
    </div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────

const DOT_KEYS = ["dot-0", "dot-1", "dot-2"];

// ─── Neutral prompt overlay (when no niche is selected) ──────────────────────

function NeutralNichePrompt({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        background: "oklch(0.08 0.02 280 / 95%)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="homepage.voice_neutral_prompt"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Close"
        data-ocid="homepage.voice_neutral_prompt.close_button"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      <motion.div
        className="w-full max-w-sm rounded-2xl border border-border p-6 flex flex-col items-center gap-5 text-center"
        style={{ background: "oklch(0.14 0.015 280)" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: "var(--purple-accent)" }}
        >
          🤖
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground mb-2">
            Pick Your Industry First
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select your niche from the bar above and your AI agent will greet
            callers with your exact industry's script — plumbing emergencies,
            med spa bookings, HVAC service calls, and more.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center text-sm">
          {["🔧 Plumber", "✨ Med Spa", "❄️ HVAC", "🏗️ Roofing", "🦷 Dental"].map(
            (label) => (
              <span
                key={label}
                className="px-3 py-1.5 rounded-full border border-border text-muted-foreground"
                style={{ background: "oklch(0.18 0.012 280)" }}
              >
                {label}
              </span>
            ),
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Scroll up → Select your niche → Tap the phone button again to hear
          your AI
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-xl font-bold text-white text-sm"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.2 270))",
          }}
          data-ocid="homepage.voice_neutral_prompt.pick_niche_button"
        >
          Pick My Niche ↑
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Call Modal ───────────────────────────────────────────────────────────────

interface CallModalProps {
  nicheData: HomepageNicheData;
  isNeutral: boolean;
  onClose: () => void;
}

function CallModal({ nicheData, isNeutral, onClose }: CallModalProps) {
  const [callState, setCallState] = useState<CallState>("ringing");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // When neutral: use the neutral script. Otherwise, look up niche script —
  // NEVER fall back to plumber. If no script found for niche, use neutral.
  const nicheId = nicheData.id;
  const script = isNeutral
    ? NEUTRAL_VOICE_SCRIPT
    : (NICHE_VOICE_SCRIPTS[nicheId] ?? NEUTRAL_VOICE_SCRIPT);

  const businessName = isNeutral
    ? "Your Business"
    : `Your ${nicheData.label} Business`;

  const callerName = isNeutral
    ? NEUTRAL_VOICE_SCRIPT.callerName
    : script.callerName;
  const callerInitials = isNeutral
    ? "AR"
    : nicheData.dashboardSample.callerInitials;
  const phoneDisplay = isNeutral
    ? "(555) 000-0000"
    : nicheData.dashboardSample.phoneDisplay;

  useEffect(() => {
    void initAudioContext();
  }, []);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  });

  function handleAnswer() {
    const lines = buildScriptLines(script, businessName);
    setCallState("active");
    setCurrentLine(0);

    const lineRoles: Array<"agent" | "caller"> = [
      "agent",
      "caller",
      "agent",
      "agent",
      "agent",
    ];

    const addLine = (idx: number) => {
      const role = lineRoles[idx] ?? "agent";
      setTranscript((prev) => [...prev, { role, text: lines[idx] ?? "" }]);
    };

    addLine(0);

    // Use niche ID for audio lookup; neutral uses "neutral" key
    const audioNicheId = isNeutral ? "neutral" : nicheId;

    playPreloadedAudioWithText(audioNicheId, 0, lines[0] ?? "", () => {
      startAudioSequence(
        audioNicheId,
        lines,
        1,
        (idx) => {
          setCurrentLine(idx);
          addLine(idx);
        },
        () => {
          setCallState("ended");
          setTimeout(() => setShowConfirm(true), 600);
        },
      );
    });
  }

  function handleHangup() {
    stopAllAudio();
    setCallState("ended");
    onClose();
  }

  if (showConfirm) {
    return (
      <GreenConfirmOverlay
        headline="Appointment Booked!"
        subline={`${businessName} confirmed via AI`}
        items={[
          {
            icon: "📅",
            label: "Date",
            value: `${callerName} – ${nicheData.dashboardSample.appointmentTime}`,
          },
          {
            icon: "📱",
            label: "SMS Sent",
            value: "Confirmation texted automatically",
          },
          {
            icon: "🗂️",
            label: "CRM Entry",
            value: "Lead record created in pipeline",
          },
        ]}
        closingLine="That call was handled, transcribed, logged, and followed up — while you were doing something else."
        autoDismissMs={4000}
        onDone={onClose}
        dataOcid="homepage.voice_confirm_overlay"
      />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style={{
        background: "oklch(0.08 0.02 280 / 95%)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="homepage.voice_modal"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Close voice demo"
        data-ocid="homepage.voice_modal.close_button"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <motion.div
          className="w-full rounded-2xl border border-border p-6 flex flex-col items-center gap-4"
          style={{ background: "oklch(0.14 0.015 280)" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="w-full flex justify-between items-center text-xs text-muted-foreground"
            aria-hidden="true"
          >
            <span>▌▌▌ BRF Demo</span>
            <span>12:00</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mb-1"
              style={{ background: "var(--purple-accent)", color: "#fff" }}
              aria-hidden="true"
            >
              {callerInitials}
            </div>
            <p className="text-foreground font-bold text-lg leading-tight">
              {callerName}
            </p>
            <p className="text-muted-foreground text-sm">{phoneDisplay}</p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--purple-light)" }}
            >
              {callState === "ringing"
                ? "Incoming call…"
                : callState === "active"
                  ? "Connected"
                  : "Call ended"}
            </p>
          </div>

          <div className="h-10 flex items-center justify-center">
            <WaveformBars active={callState === "active"} />
          </div>

          <div
            className="w-full grid grid-cols-2 gap-3"
            style={{ minHeight: 56 }}
          >
            {callState === "ringing" && (
              <motion.button
                type="button"
                className="col-span-2 h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-base text-white"
                style={{ background: "oklch(0.48 0.22 155)" }}
                onClick={handleAnswer}
                whileTap={{ scale: 0.97 }}
                data-ocid="homepage.voice_answer_button"
                aria-label="Answer call"
              >
                <PhoneCall className="w-5 h-5" />
                Answer
              </motion.button>
            )}
            {callState === "active" && (
              <motion.button
                type="button"
                className="col-span-2 h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-base text-white"
                style={{ background: "oklch(0.48 0.22 25)" }}
                onClick={handleHangup}
                whileTap={{ scale: 0.97 }}
                data-ocid="homepage.voice_hangup_button"
                aria-label="End call"
              >
                <PhoneOff className="w-5 h-5" />
                End Call
              </motion.button>
            )}
            {callState === "ended" && (
              <div className="col-span-2 h-14 flex items-center justify-center text-muted-foreground text-sm font-semibold">
                Call complete — booking confirmed
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="w-full rounded-2xl border border-border overflow-hidden"
          style={{ background: "oklch(0.12 0.013 280)", maxHeight: 200 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Live Transcript
          </div>
          <div
            ref={transcriptRef}
            className="p-3 flex flex-col gap-2 overflow-y-auto text-sm"
            style={{ maxHeight: 150 }}
            aria-live="polite"
            aria-label="Call transcript"
          >
            {transcript.length === 0 && (
              <p className="text-muted-foreground text-xs text-center py-2">
                Tap Answer to begin
              </p>
            )}
            {transcript.map((line, lineIdx) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: transcript lines are append-only
                key={lineIdx}
                className={`flex gap-2 ${line.role === "caller" ? "flex-row-reverse" : ""}`}
                initial={{ x: line.role === "caller" ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{
                    background:
                      line.role === "agent"
                        ? "var(--purple-accent)"
                        : "oklch(0.28 0.02 280)",
                    color: "#fff",
                  }}
                  aria-hidden="true"
                >
                  {line.role === "agent" ? "AI" : "C"}
                </span>
                <span
                  className="rounded-xl px-3 py-1.5 text-xs leading-snug text-foreground max-w-[75%]"
                  style={{
                    background:
                      line.role === "agent"
                        ? "oklch(0.2 0.03 290)"
                        : "oklch(0.18 0.01 280)",
                  }}
                >
                  {line.text}
                </span>
              </motion.div>
            ))}
            {callState === "active" && currentLine < 5 && (
              <div className="flex gap-1 pl-8 py-1" aria-hidden="true">
                {DOT_KEYS.map((dotKey, d) => (
                  <motion.span
                    key={dotKey}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--purple-accent)" }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.9,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: d * 0.2,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FloatingVoiceButton({
  nicheData,
  isNeutral = false,
}: Props) {
  const [open, setOpen] = useState(false);

  // Only preload when a real niche is selected — don't default to plumber
  useEffect(() => {
    if (isNeutral) return;
    void preloadNicheScripts(nicheData.id, `Your ${nicheData.label} Business`);
  }, [nicheData.id, nicheData.label, isNeutral]);

  function handleOpen() {
    void initAudioContext();
    setOpen(true);
  }

  const buttonLabel = isNeutral
    ? "Hear Your AI Answer Right Now"
    : `Hear Your ${nicheData.label} AI Answer`;

  return (
    <>
      <motion.button
        type="button"
        className="fixed bottom-6 right-4 z-40 flex items-center gap-2.5 rounded-full shadow-lg border border-primary/30 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.48 0.22 290), oklch(0.38 0.18 270))",
          boxShadow:
            "0 0 24px oklch(0.58 0.22 290 / 50%), 0 4px 16px oklch(0 0 0 / 40%)",
          padding: "0.75rem 1.25rem",
        }}
        onClick={handleOpen}
        whileHover={{
          scale: 1.04,
          boxShadow:
            "0 0 36px oklch(0.58 0.22 290 / 70%), 0 6px 20px oklch(0 0 0 / 50%)",
        }}
        whileTap={{ scale: 0.97 }}
        aria-label="Hear your AI answer right now"
        data-ocid="homepage.floating_voice_button"
        animate={{ y: [0, -4, 0] }}
        transition={{
          y: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      >
        <Phone className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:block text-sm whitespace-nowrap">
          {buttonLabel}
        </span>
      </motion.button>

      <AnimatePresence>
        {open &&
          (isNeutral ? (
            <NeutralNichePrompt onClose={() => setOpen(false)} />
          ) : (
            <CallModal
              nicheData={nicheData}
              isNeutral={false}
              onClose={() => setOpen(false)}
            />
          ))}
      </AnimatePresence>
    </>
  );
}
