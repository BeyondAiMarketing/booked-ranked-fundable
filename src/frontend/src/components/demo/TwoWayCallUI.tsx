// TwoWayCallUI — Full-screen phone call UI for the two-way voice demo
// Shows a phone call interface with mic permission prompt, ringing, live transcript,
// and a recap card. Works in listen-only mode on iOS / when mic is denied.
// ElevenLabs is PRIMARY for agent TTS — Web Speech is fallback only.
// Retry logic: ElevenLabs failures fall back transparently, never blocking the demo.

import {
  getElevenLabsVoiceId,
  isElevenLabsKeyReady,
} from "@/hooks/useElevenLabsVoice";
import {
  type CallState,
  type TranscriptLine,
  useTwoWayVoiceCall,
} from "@/hooks/useTwoWayVoiceCall";
import { Mic, MicOff, PhoneCall, PhoneOff, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── ElevenLabs speak helper with retry + 8s timeout ─────────────────────────

async function elevenLabsFetch(
  text: string,
  voiceId: string,
  apiKey: string,
  retryCount = 0,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );
    clearTimeout(timeoutId);

    if (res.status === 401) throw new Error("ELEVENLABS_INVALID_KEY");
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : String(err);
    // Never retry on invalid key or timeout — fall through immediately
    if (msg === "ELEVENLABS_INVALID_KEY" || msg.includes("abort")) throw err;
    if (retryCount < 2) {
      await new Promise((r) => setTimeout(r, retryCount === 0 ? 500 : 1000));
      return elevenLabsFetch(text, voiceId, apiKey, retryCount + 1);
    }
    throw err;
  }
}

// ─── Agent name per niche (matches NICHE_SCRIPTS in useTwoWayVoiceCall) ───────

const NICHE_AGENT_NAMES: Record<string, string> = {
  plumber: "Sarah",
  hvac: "Jessica",
  roofing: "Ashley",
  "med-spa": "Sophia",
  "carpet-cleaning": "Amanda",
  restoration: "Lauren",
  "real-estate": "Emily",
  mortgage: "Rachel",
  chiropractor: "Front Desk",
  dental: "Front Desk",
};

function getAgentName(niche: string): string {
  const map: Record<string, string> = {
    plumbing: "plumber",
    plumber: "plumber",
    hvac: "hvac",
    roofing: "roofing",
    "med-spa": "med-spa",
    medspa: "med-spa",
    "carpet-cleaning": "carpet-cleaning",
    carpetcleaning: "carpet-cleaning",
    restoration: "restoration",
    "real-estate": "real-estate",
    realestate: "real-estate",
    mortgage: "mortgage",
    chiropractor: "chiropractor",
    chiro: "chiropractor",
    dental: "dental",
  };
  const key = map[niche.toLowerCase()] ?? "plumber";
  return NICHE_AGENT_NAMES[key] ?? "AI Receptionist";
}

// ─── Waveform animation ───────────────────────────────────────────────────────

function MicWave({ active, color }: { active: boolean; color: string }) {
  if (!active) return null;
  return (
    <div
      className="flex items-center gap-[2px]"
      aria-label="Speaking animation"
    >
      {([0, 1, 2, 3, 4] as const).map((i) => (
        <motion.div
          key={`wave-${i}`}
          className="w-[2px] rounded-full"
          style={{ background: color }}
          animate={{
            height: ["4px", `${8 + Math.abs(Math.sin(i * 1.2)) * 12}px`, "4px"],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 0.5,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Timer display ────────────────────────────────────────────────────────────

function CallTimer({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <span className="font-mono text-xs tabular-nums">
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

// ─── Transcript line ──────────────────────────────────────────────────────────

function TLine({
  line,
  isLast,
  agentName,
}: {
  line: TranscriptLine;
  isLast: boolean;
  agentName: string;
}) {
  const isAgent = line.speaker === "agent";
  return (
    <motion.div
      key={line.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex gap-2 ${isAgent ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isAgent
            ? "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))"
            : "linear-gradient(135deg, oklch(0.55 0.2 240), oklch(0.48 0.18 220))",
        }}
      >
        {isAgent ? (
          <Volume2 size={12} className="text-white" />
        ) : (
          <Mic size={12} className="text-white" />
        )}
      </div>

      <div
        className={`max-w-[78%] flex flex-col gap-1 ${isAgent ? "" : "items-end"}`}
      >
        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          {isAgent ? agentName : "You"}
        </span>
        <div
          className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
            isAgent ? "rounded-tl-sm" : "rounded-tr-sm"
          }`}
          style={{
            background: isAgent
              ? "oklch(0.22 0.06 285)"
              : "oklch(0.24 0.05 240)",
            color: "var(--foreground)",
            outline: isLast
              ? `1px solid ${isAgent ? "oklch(0.58 0.22 290 / 40%)" : "oklch(0.55 0.2 240 / 40%)"}`
              : "none",
          }}
        >
          {line.text}
        </div>
      </div>
    </motion.div>
  );
}

// ─── State-specific overlays ──────────────────────────────────────────────────

interface MicPermissionPromptProps {
  onStart: () => void;
  onListenOnly: () => void;
  businessName: string;
}

function MicPermissionPrompt({
  onStart,
  onListenOnly,
  businessName,
}: MicPermissionPromptProps) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-4 px-2">
      {/* Phone icon with pulse */}
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px oklch(0.62 0.18 155 / 0%)",
              "0 0 28px oklch(0.62 0.18 155 / 40%)",
              "0 0 0px oklch(0.62 0.18 155 / 0%)",
            ],
          }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.18 155 / 20%), oklch(0.62 0.18 155 / 10%))",
            border: "2px solid oklch(0.62 0.18 155 / 40%)",
          }}
        >
          <PhoneCall size={32} className="text-emerald-400" />
        </motion.div>
      </div>

      <div className="space-y-2 max-w-xs">
        <h3 className="font-bold text-foreground text-base leading-snug">
          Talk to Your AI Agent at {businessName}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Allow microphone access to have a real two-way conversation — hear
          your agent speak and respond with your own voice.
        </p>
        <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
          🔒 Your voice stays in your browser — nothing is recorded or sent
          anywhere
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        data-ocid="two_way_call.start_button"
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.18 155), oklch(0.55 0.18 165))",
          boxShadow: "0 4px 20px oklch(0.62 0.18 155 / 40%)",
        }}
      >
        <Mic size={16} />
        Start the Call
      </button>

      <button
        type="button"
        onClick={onListenOnly}
        data-ocid="two_way_call.listen_only_button"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Prefer to just listen?{" "}
        <span className="text-primary underline underline-offset-2">
          Watch without mic →
        </span>
      </button>
    </div>
  );
}

function RequestingMicView() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.2,
          ease: "linear",
        }}
        className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent"
      />
      <p className="text-sm text-muted-foreground">
        Requesting microphone access…
      </p>
    </div>
  );
}

function RingingView({ businessName }: { businessName: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <div className="relative">
        {([0, 1, 2] as const).map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid oklch(0.58 0.22 290 / 30%)" }}
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.8,
              delay: i * 0.6,
            }}
          />
        ))}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.2 }}
          className="w-20 h-20 rounded-full flex items-center justify-center relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290 / 25%), oklch(0.5 0.2 270 / 20%))",
            border: "2px solid oklch(0.58 0.22 290 / 50%)",
          }}
        >
          <PhoneCall size={32} className="text-primary" />
        </motion.div>
      </div>
      <div className="text-center space-y-1">
        <p className="font-bold text-foreground text-sm">{businessName}</p>
        <p className="text-xs text-muted-foreground">AI Receptionist</p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          className="text-xs text-primary font-semibold"
        >
          Connecting…
        </motion.p>
      </div>
    </div>
  );
}

function RecapCard({
  businessName,
  onEnd,
}: { businessName: string; onEnd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", damping: 18 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "oklch(0.22 0.06 285)",
        borderColor: "oklch(0.58 0.22 290 / 30%)",
      }}
    >
      <div
        className="px-5 py-4 border-b"
        style={{ borderColor: "oklch(0.58 0.22 290 / 20%)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "oklch(0.62 0.18 155 / 25%)" }}
          >
            <span className="text-emerald-400 text-sm">✓</span>
          </div>
          <span className="font-bold text-foreground text-sm">
            Call Complete — Lead Captured
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your AI just{" "}
          <strong className="text-foreground">qualified this lead</strong>,
          captured their name, service need, and best callback time — and sent
          them a confirmation text. All automatically, without you lifting a
          finger.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Service Needed", value: "✓ Captured" },
            { label: "Contact Info", value: "✓ Saved" },
            { label: "Appointment", value: "✓ Scheduled" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border p-2.5 text-center"
              style={{
                background: "oklch(0.18 0.04 285)",
                borderColor: "oklch(0.58 0.22 290 / 20%)",
              }}
            >
              <p className="text-[10px] text-muted-foreground mb-0.5">
                {item.label}
              </p>
              <p className="text-xs font-bold text-emerald-400">{item.value}</p>
            </div>
          ))}
        </div>
        <div
          className="rounded-xl border p-3 text-xs text-muted-foreground"
          style={{
            background: "oklch(0.15 0.03 285)",
            borderColor: "oklch(0.58 0.22 290 / 15%)",
          }}
        >
          This call cost <strong className="text-foreground">$0</strong> in
          staff time and happened at{" "}
          <strong className="text-foreground">2am automatically</strong> — it
          replaces a <strong className="text-foreground">$2,800/mo</strong>{" "}
          receptionist.
        </div>
        <p
          className="text-[10px] text-center font-semibold"
          style={{ color: "oklch(0.78 0.14 290)" }}
        >
          This is what {businessName} does for every single caller, 24/7.
        </p>
        <button
          type="button"
          onClick={onEnd}
          data-ocid="two_way_call.end_demo_button"
          className="w-full rounded-xl py-2.5 text-xs font-bold border transition-colors hover:bg-muted/30"
          style={{
            borderColor: "oklch(0.58 0.22 290 / 30%)",
            color: "oklch(0.78 0.14 290)",
          }}
        >
          ← Back to Brand Kit
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface TwoWayCallUIProps {
  businessName: string;
  niche: string;
  onClose?: () => void;
  /** If true, renders inline (no overlay). Default = overlay modal */
  inline?: boolean;
  /** ElevenLabs API key from backend — no localStorage */
  elevenLabsKey?: string;
}

export default function TwoWayCallUI({
  businessName,
  niche,
  onClose,
  inline = false,
  elevenLabsKey = "",
}: TwoWayCallUIProps) {
  // ── ElevenLabs audio cache & active-audio ref ───────────────────────────
  const elAudioRef = useRef<HTMLAudioElement | null>(null);
  const elCacheRef = useRef<Record<string, string>>({});
  // Store niche in ref so speakOverride stays stable
  const nicheRef = useRef(niche);
  nicheRef.current = niche;

  const agentName = getAgentName(niche);

  // speakOverride: replaces useTwoWayVoiceCall's Web Speech with ElevenLabs when key is present
  // Falls back to Web Speech automatically on any error — never blocks the demo.
  const speakOverrideFn = useCallback(
    (text: string, onDone: () => void) => {
      const apiKey = elevenLabsKey;
      const voiceId = getElevenLabsVoiceId(nicheRef.current);
      const cacheKey = `${nicheRef.current}::${text}`;

      // Browser TTS removed — show transcript only when ElevenLabs is unavailable
      const webSpeechFallback = () => {
        // Display the agent text as transcript; ElevenLabs is the only audio path
        // Audio unavailable — transcript only
        onDone();
      };

      const playUrl = (url: string) => {
        elAudioRef.current?.pause();
        const audio = new Audio(url);
        elAudioRef.current = audio;
        audio.onended = () => {
          elAudioRef.current = null;
          onDone();
        };
        audio.onerror = () => {
          elAudioRef.current = null;
          webSpeechFallback();
        };
        audio.play().catch(() => {
          elAudioRef.current = null;
          webSpeechFallback();
        });
      };

      const cached = elCacheRef.current[cacheKey];
      if (cached) {
        playUrl(cached);
        return;
      }

      elevenLabsFetch(text, voiceId, apiKey)
        .then((url) => {
          elCacheRef.current[cacheKey] = url;
          playUrl(url);
        })
        .catch((err) => {
          const _msg = err instanceof Error ? err.message : String(err);
          // ElevenLabs key invalid or other error — using fallback
          webSpeechFallback();
        });
    },
    [elevenLabsKey], // stable when key doesn't change
  );

  // Only pass the override when ElevenLabs is actually configured
  const speakOverride = isElevenLabsKeyReady(elevenLabsKey)
    ? speakOverrideFn
    : undefined;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      elAudioRef.current?.pause();
      elAudioRef.current = null;
    };
  }, []);

  const {
    callState,
    transcript,
    interimText,
    currentSpeaker,
    startCall,
    startListenOnly,
    endCall,
    speechRecognitionSupported,
    callTimer,
  } = useTwoWayVoiceCall({ businessName, niche, speakOverride });

  const [dismissed, setDismissed] = useState(false);

  const transcriptLenRef = useRef(0);
  const prevInterimRef = useRef("");
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const shouldScroll =
    transcript.length !== transcriptLenRef.current ||
    interimText !== prevInterimRef.current;
  if (shouldScroll) {
    transcriptLenRef.current = transcript.length;
    prevInterimRef.current = interimText;
  }
  useEffect(() => {
    if (shouldScroll) {
      transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  const handleEnd = () => {
    endCall();
    setDismissed(true);
    onClose?.();
  };

  const isActive =
    callState === "active" ||
    callState === "agent-speaking" ||
    callState === "user-speaking";

  // ── Status label ──────────────────────────────────────────────────────────
  let statusLabel = "";
  let statusColor = "text-muted-foreground";
  if (callState === "agent-speaking") {
    statusLabel = `${agentName} Speaking…`;
    statusColor = "text-primary";
  } else if (callState === "user-speaking") {
    statusLabel = "Listening…";
    statusColor = "text-blue-400";
  } else if (callState === "active") {
    statusLabel = speechRecognitionSupported ? "Speak now" : "Playing…";
    statusColor = "text-emerald-400";
  }

  const phoneFrame = (
    <div
      className="relative flex flex-col w-full"
      style={{ maxWidth: "400px" }}
      data-ocid="two_way_call.dialog"
    >
      {/* ── Phone chrome ──────────────────────────────────────────────────── */}
      <div
        className="rounded-3xl overflow-hidden border shadow-2xl flex flex-col"
        style={{
          background: "oklch(0.1 0.014 280)",
          borderColor: "oklch(0.58 0.22 290 / 30%)",
          boxShadow:
            "0 24px 60px oklch(0.1 0.014 280 / 80%), 0 0 0 1px oklch(0.58 0.22 290 / 10%)",
          minHeight: inline ? "auto" : "520px",
        }}
      >
        {/* ── Status bar ────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 pt-4 pb-3"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.14 0.04 285) 0%, oklch(0.1 0.014 280) 100%)",
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <motion.div
              animate={
                isActive
                  ? {
                      boxShadow: [
                        "0 0 0px oklch(0.62 0.18 155 / 0%)",
                        "0 0 8px oklch(0.62 0.18 155 / 60%)",
                        "0 0 0px oklch(0.62 0.18 155 / 0%)",
                      ],
                    }
                  : {}
              }
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: isActive
                  ? "oklch(0.62 0.18 155)"
                  : callState === "ended"
                    ? "oklch(0.58 0.22 25)"
                    : "oklch(0.5 0.02 280)",
              }}
            />
            <span className="font-bold text-foreground text-xs truncate">
              {businessName}
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              {agentName}
            </span>
            {isActive && (
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                LIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* ElevenLabs badge when active */}
            {speakOverride && isActive && (
              <span
                className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border hidden sm:inline-flex items-center gap-0.5"
                style={{
                  background: "oklch(0.62 0.18 245 / 10%)",
                  borderColor: "oklch(0.62 0.18 245 / 30%)",
                  color: "oklch(0.72 0.16 245)",
                }}
              >
                🎙 ElevenLabs
              </span>
            )}
            {isActive && (
              <span className="text-muted-foreground text-xs">
                <CallTimer seconds={callTimer} />
              </span>
            )}
            {onClose && callState !== "idle" && (
              <button
                type="button"
                onClick={handleEnd}
                aria-label="End call"
                data-ocid="two_way_call.close_button"
                className="rounded-full p-1 hover:bg-muted/30 transition-colors"
              >
                <PhoneOff size={14} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* ── Main content area ─────────────────────────────────────────── */}
        <div className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {callState === "idle" && !dismissed && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MicPermissionPrompt
                  onStart={startCall}
                  onListenOnly={startListenOnly}
                  businessName={businessName}
                />
              </motion.div>
            )}

            {callState === "requesting-mic" && (
              <motion.div
                key="requesting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RequestingMicView />
              </motion.div>
            )}

            {callState === "ringing" && (
              <motion.div
                key="ringing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <RingingView businessName={businessName} />
              </motion.div>
            )}

            {isActive && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col flex-1 gap-3"
              >
                {/* Speaker indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {currentSpeaker === "agent" && (
                      <>
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ background: "oklch(0.58 0.22 290)" }}
                        />
                        <span className="text-[10px] font-semibold text-primary">
                          {agentName} Speaking
                        </span>
                        <MicWave active color="oklch(0.58 0.22 290)" />
                      </>
                    )}
                    {currentSpeaker === "caller" && (
                      <>
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ background: "oklch(0.55 0.2 240)" }}
                        />
                        <span className="text-[10px] font-semibold text-blue-400">
                          Listening
                        </span>
                        <MicWave active color="oklch(0.55 0.2 240)" />
                      </>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Transcript */}
                <div
                  className="flex-1 overflow-y-auto space-y-3 pr-1"
                  style={{ maxHeight: "300px", minHeight: "180px" }}
                  data-ocid="two_way_call.transcript"
                >
                  {transcript.map((line, idx) => (
                    <TLine
                      key={line.id}
                      line={line}
                      isLast={idx === transcript.length - 1}
                      agentName={agentName}
                    />
                  ))}

                  {/* Interim text while user is speaking */}
                  {interimText && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 flex-row-reverse"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.2 240), oklch(0.48 0.18 220))",
                        }}
                      >
                        <Mic size={12} className="text-white" />
                      </div>
                      <div className="max-w-[78%] flex flex-col items-end gap-1">
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                          You
                        </span>
                        <div
                          className="px-3 py-2 rounded-2xl rounded-tr-sm text-xs leading-relaxed opacity-60 italic"
                          style={{
                            background: "oklch(0.24 0.05 240)",
                            color: "var(--foreground)",
                          }}
                        >
                          {interimText}…
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Typing indicator when agent is about to speak */}
                  {callState === "active" &&
                    transcript.length > 0 &&
                    currentSpeaker === null && (
                      <div className="flex gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
                          }}
                        >
                          <Volume2 size={12} className="text-white" />
                        </div>
                        <div
                          className="flex gap-1 px-3 py-2.5 rounded-2xl rounded-tl-sm items-center"
                          style={{ background: "oklch(0.22 0.06 285)" }}
                        >
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={`dot-${i}`}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "oklch(0.58 0.22 290)" }}
                              animate={{
                                opacity: [0.3, 1, 0.3],
                                y: [0, -3, 0],
                              }}
                              transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 0.7,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  <div ref={transcriptEndRef} />
                </div>

                {/* Mic hint or mic-denied message */}
                {callState === "user-speaking" && (
                  <div className="flex items-center justify-center gap-2 py-2">
                    {speechRecognitionSupported ? (
                      <>
                        <Mic size={12} className="text-blue-400" />
                        <span className="text-[10px] text-blue-400 font-semibold">
                          Speak now — your agent is listening
                        </span>
                      </>
                    ) : (
                      <>
                        <MicOff size={12} className="text-amber-400" />
                        <span className="text-[10px] text-amber-400">
                          Microphone not available. You can still listen to the
                          demo.
                        </span>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {callState === "ended" && !dismissed && (
              <motion.div
                key="ended"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <RecapCard businessName={businessName} onEnd={handleEnd} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── End call button ───────────────────────────────────────────── */}
        {isActive && (
          <div className="flex items-center justify-center pb-5 pt-1">
            <button
              type="button"
              onClick={handleEnd}
              data-ocid="two_way_call.end_call_button"
              aria-label="End call"
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 25), oklch(0.5 0.22 10))",
                boxShadow: "0 4px 20px oklch(0.58 0.22 25 / 40%)",
              }}
            >
              <PhoneOff size={22} className="text-white" />
            </button>
          </div>
        )}

        {/* ── No mic fallback notice ────────────────────────────────────── */}
        {isActive && !speechRecognitionSupported && (
          <div className="pb-4 px-4">
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2"
              style={{
                background: "oklch(0.58 0.22 75 / 8%)",
                borderColor: "oklch(0.58 0.22 75 / 25%)",
              }}
            >
              <MicOff size={12} className="text-amber-400 flex-shrink-0" />
              <p className="text-[10px] text-amber-400/80">
                Microphone not available — playing demo automatically. You can
                still listen to the full conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (inline) return phoneFrame;

  // Overlay modal variant
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={() => {
          if (callState === "idle" || callState === "ended") handleEnd();
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ duration: 0.3, type: "spring", damping: 20 }}
        className="relative z-10 w-full"
        style={{ maxWidth: "400px" }}
      >
        {phoneFrame}
      </motion.div>
    </div>
  );
}
