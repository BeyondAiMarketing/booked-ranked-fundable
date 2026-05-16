import { useCredentials } from "@/context/CredentialsContext";
import { useElevenLabsVoice } from "@/hooks/useElevenLabsVoice";
import { speakLines } from "@/hooks/useVoiceAgent";
import {
  CheckCircle2,
  Mic,
  PhoneCall,
  RotateCcw,
  Volume2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import TwoWayCallUI from "./TwoWayCallUI";

// ─── Niche-specific demo scripts ──────────────────────────────────────────────
// Each entry maps niche slug → 3-line simulated conversation (caller → AI → caller)

const NICHE_SCRIPTS: Record<
  string,
  { greeting: string; caller: string; aiQ: string; callerAns: string }
> = {
  plumbing: {
    greeting:
      "Thank you for calling [Business]! This is Sarah with our plumbing team — how can I help you today?",
    caller: "I need a quote for a burst pipe repair",
    aiQ: "Is this an active emergency or can we schedule a visit?",
    callerAns: "It's actively leaking — water everywhere",
  },
  roofing: {
    greeting:
      "Thank you for calling [Business]! This is Ashley with our roofing team — how can I help you today?",
    caller: "I think I have storm damage on my roof",
    aiQ: "Is this from a recent storm — are you looking for an inspection or emergency patch?",
    callerAns: "We had hail last night, need someone ASAP",
  },
  hvac: {
    greeting:
      "Thank you for calling [Business]! This is Jessica with our HVAC specialists — how can I help you today?",
    caller: "My AC stopped working and it's 95 degrees",
    aiQ: "Is your system not cooling at all, or is it blowing warm air?",
    callerAns: "Not cooling at all — totally dead",
  },
  "med-spa": {
    greeting:
      "Thank you for calling [Business]! This is Sophia with our medical spa team — how can I help you today?",
    caller: "I'm interested in a consultation for some treatments",
    aiQ: "Are you looking at a specific treatment, or would you like a complimentary consultation?",
    callerAns: "Botox and maybe filler — whatever you recommend",
  },
  "carpet-cleaning": {
    greeting:
      "Thank you for calling [Business]! This is Amanda with our carpet cleaning team — how can I help you today?",
    caller: "I need my carpets cleaned before a big event",
    aiQ: "How many rooms, and do you have any pet stains or high-traffic areas?",
    callerAns: "4 rooms, two dogs, living room is pretty worn",
  },
  restoration: {
    greeting:
      "Thank you for calling [Business]! This is Lauren — we're available 24/7. How can I help you?",
    caller: "We had a pipe burst and there's water everywhere",
    aiQ: "Is the water still flowing, or has it been shut off — and how many rooms are affected?",
    callerAns: "Shut off now but 3 rooms are soaked",
  },
  "real-estate": {
    greeting:
      "Thank you for calling [Business]! This is Emily with our real estate team — how can I help you today?",
    caller: "I'm thinking about selling my house",
    aiQ: "Are you looking to sell in the next 30–90 days, or still in early planning?",
    callerAns: "30 days — need to move fast",
  },
  mortgage: {
    greeting:
      "Thank you for calling [Business]! This is Rachel with our mortgage team — how can I help you today?",
    caller: "I want to look into buying a home",
    aiQ: "Are you purchasing a new home or refinancing — and have you been pre-approved before?",
    callerAns: "First purchase, never been through the process",
  },
  chiropractor: {
    greeting:
      "Thank you for calling [Business]! This is the front desk — how can I help you today?",
    caller: "I've been having some serious back pain",
    aiQ: "Is this a new issue or something you've dealt with before — and are you currently in pain?",
    callerAns: "New pain — it started two days ago, really bad",
  },
  dental: {
    greeting:
      "Thank you for calling [Business]! This is the front desk — how can I help you today?",
    caller: "I need to schedule an appointment",
    aiQ: "Are you an existing patient, and is this for a routine cleaning or a specific concern?",
    callerAns: "New patient — I have a toothache on the left side",
  },
};

interface DemoScene1VoiceProps {
  businessName: string;
  niche: string;
}

interface ChatLine {
  id: number;
  side: "system" | "ai" | "caller" | "success";
  text: string;
}

// Animated waveform bars shown while audio plays
function Waveform() {
  return (
    <motion.div
      key="waveform"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-[3px] py-1"
      aria-label="Audio playing"
    >
      {(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"] as const).map(
        (id, i) => (
          <motion.div
            key={`waveform-${id}`}
            className="w-[3px] rounded-full"
            style={{ background: "oklch(0.68 0.2 290)" }}
            animate={{
              height: [
                "5px",
                `${12 + Math.abs(Math.sin(i * 0.8)) * 14}px`,
                "5px",
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 0.825,
              delay: i * 0.09,
              ease: "easeInOut",
            }}
          />
        ),
      )}
    </motion.div>
  );
}

export default function DemoScene1Voice({
  businessName,
  niche,
}: DemoScene1VoiceProps) {
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [ringing, setRinging] = useState(true);
  const [connected, setConnected] = useState(false);
  const [speakingLineId, setSpeakingLineId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [showTwoWayCall, setShowTwoWayCall] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const cancelAudioRef = useRef<(() => void) | null>(null);

  // Get credentials from backend via context — no localStorage
  const { creds } = useCredentials();
  const elevenLabsKey = creds?.elevenLabsKey ?? "";
  const vapiIsLive = creds?.vapiIsActive ?? false;

  // Get niche-specific script
  const script = NICHE_SCRIPTS[niche] ?? NICHE_SCRIPTS.plumbing;

  // Greeting text with [Business] token — replaced by ElevenLabs hook before synthesis
  const greetingText = script.greeting;
  const followUpText = script.aiQ;

  // ElevenLabs hooks — one for greeting (turn_1), one for follow-up (turn_3)
  // Pass elevenLabsKey from backend context — no localStorage
  const {
    speak: speakGreeting,
    stop: stopGreeting,
    isPlaying: greetingPlaying,
    isLoading: greetingLoading,
    usingElevenLabs,
  } = useElevenLabsVoice(greetingText, niche, businessName, elevenLabsKey);

  const {
    speak: speakFollowUp,
    stop: stopFollowUp,
    isPlaying: followUpPlaying,
  } = useElevenLabsVoice(followUpText, niche, businessName, elevenLabsKey);

  // Derived ElevenLabs playing/loading state
  const elPlaying = greetingPlaying || followUpPlaying;
  const elLoading = greetingLoading;

  // Track whether auto-play and follow-up have fired for this demo instance
  const autoPlayedRef = useRef(false);
  const followUpPlayedRef = useRef(false);

  // Reset per-run flags when niche or businessName changes
  useEffect(() => {
    autoPlayedRef.current = false;
    followUpPlayedRef.current = false;
    stopGreeting();
    stopFollowUp();
  }, [stopGreeting, stopFollowUp]);

  // Auto-play greeting via ElevenLabs once ringing ends (1s delay for polish)
  useEffect(() => {
    if (ringing || autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const t = setTimeout(speakGreeting, 1000);
    return () => clearTimeout(t);
  }, [ringing, speakGreeting]);

  // After greeting finishes + caller line appears, speak follow-up (turn_3)
  useEffect(() => {
    if (greetingPlaying || followUpPlayedRef.current) return;
    if (!autoPlayedRef.current) return;
    if (lines.length < 3) return; // wait for caller line at index 2
    followUpPlayedRef.current = true;
    const t = setTimeout(speakFollowUp, 400);
    return () => clearTimeout(t);
  }, [greetingPlaying, lines.length, speakFollowUp]);

  // Browser TTS removed — ElevenLabs audio used via audioService instead.
  useEffect(() => {
    setVoicesReady(true);
  }, []);

  // Build the sequence for the current niche — replace [Business] token
  const buildSequence = useCallback((n: string, name: string): ChatLine[] => {
    const s = NICHE_SCRIPTS[n] ?? NICHE_SCRIPTS.plumbing;
    const greeting = s.greeting.replace(/\[Business\]/gi, name);
    return [
      { id: 0, side: "system", text: `📞 Incoming call to ${name}…` },
      { id: 1, side: "ai", text: greeting },
      { id: 2, side: "caller", text: s.caller },
      { id: 3, side: "ai", text: s.aiQ },
      { id: 4, side: "caller", text: s.callerAns },
      {
        id: 5,
        side: "ai",
        text: "Perfect. I've got you booked for tomorrow at 10am. You'll receive a confirmation text shortly.",
      },
      {
        id: 6,
        side: "success",
        text: "✅ Appointment booked. Confirmation sent.",
      },
    ];
  }, []);

  // Animate transcript lines
  useEffect(() => {
    const sequence = buildSequence(niche, businessName);
    setLines([]);
    setRinging(true);
    setConnected(false);
    setSpeakingLineId(null);
    setIsPlaying(false);
    setHasPlayed(false);

    let cancelled = false;
    cancelAudioRef.current?.();
    cancelAudioRef.current = null;

    const delays = [1890, 4410, 8820, 13230, 18270, 23310, 28980];
    const timers: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        if (i === 0) {
          setRinging(false);
          setConnected(true);
        }
        setLines((prev) => {
          const item = sequence[i];
          if (!item) return prev;
          return [...prev, item];
        });
      }, delay);
      timers.push(t);
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      cancelAudioRef.current?.();
    };
  }, [niche, businessName, buildSequence]);

  // Scroll to end on new lines
  const linesLength = lines.length;
  useEffect(() => {
    if (linesLength > 0) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [linesLength]);

  // Play only AI lines in order
  const handlePlayAudio = useCallback(() => {
    if (isPlaying) return;
    const sequence = buildSequence(niche, businessName);
    const aiLines = sequence
      .filter((l) => l.side === "ai")
      .map((l) => ({ id: l.id, text: l.text }));

    setIsPlaying(true);
    setSpeakingLineId(aiLines[0]?.id ?? null);

    cancelAudioRef.current = speakLines({
      lines: aiLines.map((l) => l.text),
      pauseBetweenMs: 350,
      onLineStart: (index) => {
        setSpeakingLineId(aiLines[index]?.id ?? null);
      },
      onLineEnd: () => {
        setSpeakingLineId(null);
      },
      onAllDone: () => {
        setIsPlaying(false);
        setSpeakingLineId(null);
        setHasPlayed(true);
      },
    });
  }, [isPlaying, niche, businessName, buildSequence]);

  const handleStop = useCallback(() => {
    cancelAudioRef.current?.();
    cancelAudioRef.current = null;
    stopGreeting();
    stopFollowUp();
    setIsPlaying(false);
    setSpeakingLineId(null);
  }, [stopGreeting, stopFollowUp]);

  // "Any audio playing" — ElevenLabs only (Web Speech removed)
  const anyPlaying = isPlaying || elPlaying;
  const supported = false;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
      {/* ── Two-Way Call CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full rounded-2xl border overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.06 285), oklch(0.14 0.04 280))",
          borderColor: "oklch(0.58 0.22 290 / 30%)",
        }}
      >
        <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
              }}
            >
              <Mic size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-foreground text-sm">
                  {vapiIsLive
                    ? "Talk to Your Live AI Agent"
                    : "Talk to Your AI Agent Live"}
                </p>
                {vapiIsLive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Zap size={8} />
                    Live Agent Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-snug">
                {vapiIsLive
                  ? "Your live Vapi agent is connected — hear it answer in your business name"
                  : "Use your microphone for a real two-way conversation — hear it answer in your business name"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowTwoWayCall(true)}
            data-ocid="demo.voice_scene.two_way_call_button"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-[1.02] hover:opacity-90"
            style={{
              background: vapiIsLive
                ? "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.46 0.16 160))"
                : "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 310))",
              boxShadow: vapiIsLive
                ? "0 4px 16px oklch(0.52 0.18 155 / 40%)"
                : "0 4px 16px oklch(0.58 0.22 290 / 40%)",
            }}
            aria-label="Start two-way voice call"
          >
            <PhoneCall size={14} />
            {vapiIsLive ? "Talk to Your Live AI Agent" : "Try a Demo Call"}
          </button>
        </div>
      </motion.div>

      {/* ── Play / Replay button ── */}
      <div className="flex flex-col items-center gap-2 w-full">
        <button
          type="button"
          onClick={anyPlaying ? handleStop : handlePlayAudio}
          disabled={
            elLoading || (!supported && !usingElevenLabs) || !voicesReady
          }
          data-ocid="demo.voice_scene.play_button"
          className="flex items-center gap-3 px-7 py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: anyPlaying
              ? "linear-gradient(135deg, oklch(0.50 0.18 25), oklch(0.44 0.2 10))"
              : "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 310))",
            boxShadow: anyPlaying
              ? "0 4px 24px oklch(0.50 0.18 25 / 40%)"
              : "0 4px 24px oklch(0.58 0.22 290 / 50%)",
            minWidth: "240px",
          }}
          aria-label={anyPlaying ? "Stop audio" : "Hear Your AI Agent"}
        >
          {elLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 0.9,
                  ease: "linear",
                }}
                className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
              />
              <span>Loading voice…</span>
            </>
          ) : anyPlaying ? (
            <>
              <AnimatePresence>
                <Waveform />
              </AnimatePresence>
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 size={22} />
              <span>
                {hasPlayed ? "▶ Replay AI Agent" : "▶ Hear Your AI Agent"}
              </span>
            </>
          )}
        </button>

        {/* ElevenLabs badge — shown only when key is active */}
        {usingElevenLabs && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border"
            style={{
              background: "oklch(0.62 0.18 245 / 10%)",
              borderColor: "oklch(0.62 0.18 245 / 30%)",
              color: "oklch(0.72 0.16 245)",
            }}
          >
            🎙 Powered by ElevenLabs
          </motion.span>
        )}

        {hasPlayed && !anyPlaying && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={handlePlayAudio}
            data-ocid="demo.voice_scene.replay_button"
            className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-4 py-1.5 transition-colors"
            style={{
              background: "oklch(0.58 0.22 290 / 15%)",
              border: "1px solid oklch(0.58 0.22 290 / 35%)",
              color: "oklch(0.78 0.18 290)",
            }}
          >
            <RotateCcw size={11} /> Replay
          </motion.button>
        )}

        {!supported && !usingElevenLabs && (
          <p className="text-xs text-muted-foreground">
            Audio playback not supported in this browser — read the transcript
            below.
          </p>
        )}
      </div>

      {/* ── Phone widget ── */}
      <div className="relative flex items-center justify-center">
        {ringing && (
          <>
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-indigo-500/20 animate-ping" />
            <span className="absolute inline-flex h-28 w-28 rounded-full bg-indigo-500/10 animate-ping [animation-delay:0.3s]" />
          </>
        )}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-500 ${
            ringing
              ? "bg-indigo-600 shadow-lg shadow-indigo-900/60"
              : connected
                ? "bg-emerald-600 shadow-lg shadow-emerald-900/60"
                : "bg-emerald-600 shadow-lg shadow-emerald-900/60"
          }`}
        >
          <PhoneCall size={26} className="text-white" />
        </div>

        {/* Connected badge */}
        {connected && !ringing && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-7 text-[10px] font-semibold text-emerald-400 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Connected
          </motion.div>
        )}
      </div>

      {/* ── Chat transcript ── */}
      <div
        className="w-full border rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.12 0.02 285)",
          borderColor: "oklch(0.58 0.22 290 / 20%)",
        }}
      >
        <div
          className="border-b px-4 py-3 flex items-center gap-2"
          style={{ borderColor: "oklch(0.58 0.22 290 / 15%)" }}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">
            Live Call Transcript
          </span>
          {anyPlaying && (
            <span className="ml-auto text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {elPlaying && usingElevenLabs
                ? "ElevenLabs speaking"
                : "Audio playing"}
            </span>
          )}
        </div>
        <div className="p-4 space-y-3 min-h-[220px] max-h-[340px] overflow-y-auto">
          <AnimatePresence>
            {lines.map((line) => {
              const isActiveSpeaking =
                speakingLineId === line.id && line.side === "ai";
              return (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75 }}
                  className={`flex ${
                    line.side === "ai"
                      ? "justify-start"
                      : line.side === "caller"
                        ? "justify-end"
                        : "justify-center"
                  }`}
                >
                  {line.side === "system" && (
                    <span className="text-xs text-muted-foreground/60 italic">
                      {line.text}
                    </span>
                  )}
                  {line.side === "success" && (
                    <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <CheckCircle2 size={12} />
                      {line.text}
                    </div>
                  )}
                  {line.side === "ai" && (
                    <div className="max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                          AI Receptionist
                        </div>
                        {isActiveSpeaking && (
                          <div
                            className="flex items-center gap-0.5"
                            aria-label="Speaking"
                          >
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={`speak-dot-${i}`}
                                className="w-1 rounded-full bg-indigo-400"
                                animate={{ height: ["3px", "8px", "3px"] }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 0.75,
                                  delay: i * 0.12,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div
                        className={`border text-sm px-3.5 py-2 rounded-2xl rounded-tl-sm leading-relaxed transition-all duration-300 ${
                          isActiveSpeaking
                            ? "border-indigo-400/60 text-white shadow-lg"
                            : "text-foreground/90"
                        }`}
                        style={{
                          background: isActiveSpeaking
                            ? "oklch(0.28 0.08 290)"
                            : "oklch(0.20 0.05 285)",
                          borderColor: isActiveSpeaking
                            ? "oklch(0.58 0.22 290 / 60%)"
                            : "oklch(0.58 0.22 290 / 20%)",
                        }}
                      >
                        {line.text}
                      </div>
                    </div>
                  )}
                  {line.side === "caller" && (
                    <div className="max-w-[80%]">
                      <div className="text-[10px] text-muted-foreground/70 mb-1 font-semibold uppercase tracking-wider text-right">
                        Caller
                      </div>
                      <div
                        className="text-sm px-3.5 py-2 rounded-2xl rounded-tr-sm leading-relaxed text-foreground/80"
                        style={{
                          background: "oklch(0.18 0.04 240)",
                          border: "1px solid oklch(0.55 0.2 240 / 20%)",
                        }}
                      >
                        {line.text}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {lines.length < 7 && (
            <div className="flex justify-start">
              <div
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "oklch(0.20 0.05 285)",
                  border: "1px solid oklch(0.58 0.22 290 / 20%)",
                  color: "oklch(0.68 0.18 290)",
                }}
              >
                <span className="animate-pulse">Typing…</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* ── Hint ── */}
      <p className="text-[11px] text-muted-foreground/70 text-center">
        {usingElevenLabs
          ? "Your AI agent is speaking with ElevenLabs — or tap Start the Call for a live two-way conversation."
          : supported
            ? "Press ▶ Hear Your AI Agent above to listen — or Start the Call to have a real two-way conversation."
            : "Read the transcript above to see how your AI receptionist handles every call."}
      </p>

      {/* ── Two-way call modal ── */}
      <AnimatePresence>
        {showTwoWayCall && (
          <TwoWayCallUI
            businessName={businessName}
            niche={niche}
            onClose={() => setShowTwoWayCall(false)}
            elevenLabsKey={elevenLabsKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
