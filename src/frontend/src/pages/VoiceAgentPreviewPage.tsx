// VoiceAgentPreviewPage — Admin-only page to preview all 10 niche voice agents
// Accessible at /admin/voice-preview (App Owner and Super Admin only)
// Each niche card: agent name, voice personality, Play button, optional business name override
// ElevenLabs is PRIMARY — Web Speech is fallback only.

import { VoiceAgentConfigPanel } from "@/components/voice/VoiceAgentConfigPanel";
import { useCredentials } from "@/context/CredentialsContext";
import {
  ELEVENLABS_VOICE_IDS,
  ELEVENLABS_VOICE_META,
  getElevenLabsVoiceId,
  isElevenLabsKeyReady,
} from "@/hooks/useElevenLabsVoice";
import { pickBestVoice, waitForVoices } from "@/hooks/useVoiceAgent";
import {
  AlertCircle,
  Mic,
  Play,
  Settings,
  Square,
  Volume2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Niche config ─────────────────────────────────────────────────────────────

interface NicheConfig {
  slug: string;
  label: string;
  greeting: string;
}

const NICHES: NicheConfig[] = [
  {
    slug: "plumbing",
    label: "Plumbing",
    greeting:
      "Thank you for calling [Business]! This is Sarah with our plumbing team — how can I help you today?",
  },
  {
    slug: "hvac",
    label: "HVAC",
    greeting:
      "Thank you for calling [Business]! This is Jessica with our HVAC specialists — how can I help you today?",
  },
  {
    slug: "roofing",
    label: "Roofing",
    greeting:
      "Thank you for calling [Business]! This is Ashley with our roofing team — how can I help you today?",
  },
  {
    slug: "med-spa",
    label: "Med Spa",
    greeting:
      "Thank you for calling [Business]! This is Sophia with our medical spa team — how can I help you today?",
  },
  {
    slug: "carpet-cleaning",
    label: "Carpet Cleaning",
    greeting:
      "Thank you for calling [Business]! This is Amanda with our carpet cleaning team — how can I help you today?",
  },
  {
    slug: "restoration",
    label: "Restoration",
    greeting:
      "Thank you for calling [Business]! This is Lauren — we're available 24/7. How can I help you?",
  },
  {
    slug: "real-estate",
    label: "Real Estate",
    greeting:
      "Thank you for calling [Business]! This is Emily with our real estate team — how can I help you today?",
  },
  {
    slug: "mortgage",
    label: "Mortgage",
    greeting:
      "Thank you for calling [Business]! This is Rachel with our mortgage team — how can I help you today?",
  },
  {
    slug: "chiropractor",
    label: "Chiropractic",
    greeting:
      "Thank you for calling [Business]! This is the front desk — how can I help you today?",
  },
  {
    slug: "dental",
    label: "Dental",
    greeting:
      "Thank you for calling [Business]! This is the front desk — how can I help you today?",
  },
];

// ─── ElevenLabs fetch helper ──────────────────────────────────────────────────

async function fetchElevenLabsAudio(
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
    if (msg === "ELEVENLABS_INVALID_KEY" || msg.includes("abort")) throw err;
    if (retryCount < 2) {
      await new Promise((r) => setTimeout(r, retryCount === 0 ? 500 : 1000));
      return fetchElevenLabsAudio(text, voiceId, apiKey, retryCount + 1);
    }
    throw err;
  }
}

// ─── Single niche agent card ──────────────────────────────────────────────────

interface AgentCardProps {
  config: NicheConfig;
  apiKey: string;
  isElevenLabsActive: boolean;
  globalAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  currentlyPlayingSlug: string | null;
  onPlayStart: (slug: string) => void;
  onPlayEnd: () => void;
}

function AgentCard({
  config,
  apiKey,
  isElevenLabsActive,
  globalAudioRef,
  currentlyPlayingSlug,
  onPlayStart,
  onPlayEnd,
}: AgentCardProps) {
  const meta = ELEVENLABS_VOICE_META[config.slug];
  const voiceId = ELEVENLABS_VOICE_IDS[config.slug] ?? "";
  const [customName, setCustomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioCacheRef = useRef<Record<string, string>>({});

  const isPlaying = currentlyPlayingSlug === config.slug;

  const getResolvedText = useCallback(
    (name: string) => {
      const biz = name.trim() || "Your Business";
      return config.greeting.replace(/\[Business\]/gi, biz);
    },
    [config.greeting],
  );

  const stopCurrent = useCallback(() => {
    globalAudioRef.current?.pause();
    globalAudioRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    onPlayEnd();
  }, [globalAudioRef, onPlayEnd]);

  const playWebSpeech = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        onPlayEnd();
        return;
      }
      window.speechSynthesis.cancel();
      waitForVoices().then(() => {
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.88;
        utt.pitch = 1.05;
        const v = pickBestVoice();
        if (v) utt.voice = v;
        utt.onend = onPlayEnd;
        utt.onerror = onPlayEnd;
        setTimeout(() => window.speechSynthesis.speak(utt), 300);
      });
    },
    [onPlayEnd],
  );

  const handlePlay = useCallback(async () => {
    // Stop any currently playing audio first
    if (isPlaying) {
      stopCurrent();
      return;
    }
    stopCurrent();

    const text = getResolvedText(customName);
    const cacheKey = `${config.slug}::${text}`;
    setError(null);

    onPlayStart(config.slug);

    if (!isElevenLabsActive) {
      // Fallback: Web Speech
      playWebSpeech(text);
      return;
    }

    // Check cache first
    const cached = audioCacheRef.current[cacheKey];
    if (cached) {
      const audio = new Audio(cached);
      globalAudioRef.current = audio;
      audio.onended = () => {
        globalAudioRef.current = null;
        onPlayEnd();
      };
      audio.onerror = () => {
        globalAudioRef.current = null;
        onPlayEnd();
      };
      audio.play().catch(() => {
        globalAudioRef.current = null;
        playWebSpeech(text);
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = await fetchElevenLabsAudio(text, voiceId, apiKey);
      audioCacheRef.current[cacheKey] = url;
      setIsLoading(false);

      const audio = new Audio(url);
      globalAudioRef.current = audio;
      audio.onended = () => {
        globalAudioRef.current = null;
        onPlayEnd();
      };
      audio.onerror = () => {
        globalAudioRef.current = null;
        playWebSpeech(text);
      };
      audio.play().catch(() => {
        globalAudioRef.current = null;
        playWebSpeech(text);
      });
    } catch (_err) {
      setIsLoading(false);
      playWebSpeech(text);
    }
  }, [
    isPlaying,
    stopCurrent,
    getResolvedText,
    customName,
    config.slug,
    onPlayStart,
    isElevenLabsActive,
    playWebSpeech,
    voiceId,
    apiKey,
    globalAudioRef,
    onPlayEnd,
  ]);

  const statusBadge = isElevenLabsActive ? (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
      style={{
        background: "oklch(0.62 0.18 155 / 10%)",
        borderColor: "oklch(0.62 0.18 155 / 30%)",
        color: "oklch(0.72 0.18 155)",
      }}
    >
      <Zap size={8} />
      Live
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
      style={{
        background: "oklch(0.58 0.22 75 / 10%)",
        borderColor: "oklch(0.58 0.22 75 / 30%)",
        color: "oklch(0.72 0.18 75)",
      }}
    >
      Fallback
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border overflow-hidden flex flex-col"
      style={{
        background: isPlaying
          ? "linear-gradient(135deg, oklch(0.20 0.07 285), oklch(0.16 0.05 280))"
          : "oklch(0.14 0.03 285)",
        borderColor: isPlaying
          ? "oklch(0.58 0.22 290 / 50%)"
          : "oklch(0.58 0.22 290 / 15%)",
        boxShadow: isPlaying ? "0 0 24px oklch(0.58 0.22 290 / 15%)" : "none",
        transition: "all 0.3s ease",
      }}
      data-ocid={`voice_preview.${config.slug}.card`}
    >
      {/* Card header */}
      <div className="p-4 flex items-start gap-3">
        {/* Voice avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))"
              : "oklch(0.20 0.05 285)",
            border: `1px solid oklch(0.58 0.22 290 / ${isPlaying ? "50%" : "20%"})`,
          }}
        >
          {isPlaying ? (
            <motion.div
              className="flex items-center gap-[2px]"
              aria-label="Playing"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`bar-${i}`}
                  className="w-[2px] rounded-full bg-white"
                  animate={{ height: ["3px", "10px", "3px"] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.45,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <Volume2 size={16} className="text-muted-foreground" />
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground text-sm">
              {config.label}
            </span>
            {statusBadge}
          </div>
          {meta && (
            <>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground/80">Agent:</span>{" "}
                {meta.agentName} &middot;{" "}
                <span className="font-semibold text-foreground/80">Voice:</span>{" "}
                {meta.voiceName}
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5 italic">
                {meta.personality}
              </p>
            </>
          )}
          {isElevenLabsActive && (
            <p className="text-[9px] text-muted-foreground/50 mt-1 font-mono truncate">
              ID: {voiceId}
            </p>
          )}
        </div>
      </div>

      {/* Custom name input */}
      <div className="px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Custom business name (optional)"
            data-ocid={`voice_preview.${config.slug}.name_input`}
            className="w-full text-xs rounded-lg px-3 py-2 pr-8 bg-background/30 border border-border/40 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <Mic
            size={11}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40"
          />
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div
              className="flex items-center gap-1.5 text-[10px] rounded-lg px-2.5 py-1.5 border"
              style={{
                background: "oklch(0.58 0.22 25 / 8%)",
                borderColor: "oklch(0.58 0.22 25 / 30%)",
                color: "oklch(0.72 0.18 25)",
              }}
            >
              <AlertCircle size={10} />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play button */}
      <div className="px-4 pb-4 mt-auto">
        <button
          type="button"
          onClick={handlePlay}
          disabled={isLoading}
          data-ocid={`voice_preview.${config.slug}.play_button`}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, oklch(0.58 0.22 25), oklch(0.5 0.22 10))"
              : "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
            boxShadow: isPlaying
              ? "0 3px 12px oklch(0.58 0.22 25 / 30%)"
              : "0 3px 12px oklch(0.58 0.22 290 / 30%)",
          }}
          aria-label={isPlaying ? "Stop agent" : `Play ${config.label} agent`}
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 0.9,
                  ease: "linear",
                }}
                className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent"
              />
              Generating…
            </>
          ) : isPlaying ? (
            <>
              <Square size={12} />
              Stop
            </>
          ) : (
            <>
              <Play size={12} />
              Play Greeting
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type VoiceCenterTab = "preview" | "configure";

export default function VoiceAgentPreviewPage() {
  const { creds, isLoading: credsLoading } = useCredentials();
  const elevenLabsKey = creds?.elevenLabsKey ?? "";
  const isElevenLabsActive = isElevenLabsKeyReady(elevenLabsKey);

  const [activeTab, setActiveTab] = useState<VoiceCenterTab>("preview");
  const [currentlyPlayingSlug, setCurrentlyPlayingSlug] = useState<
    string | null
  >(null);
  const globalAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayStart = useCallback((slug: string) => {
    setCurrentlyPlayingSlug(slug);
  }, []);

  const handlePlayEnd = useCallback(() => {
    setCurrentlyPlayingSlug(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      globalAudioRef.current?.pause();
      globalAudioRef.current = null;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* ── Header ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
            }}
          >
            <Volume2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">
              Voice Agent Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Preview, configure, and manage all 10 niche AI voice agents
            </p>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            background: isElevenLabsActive
              ? "oklch(0.62 0.18 155 / 5%)"
              : "oklch(0.58 0.22 75 / 5%)",
            borderColor: isElevenLabsActive
              ? "oklch(0.62 0.18 155 / 20%)"
              : "oklch(0.58 0.22 75 / 20%)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: isElevenLabsActive
                  ? "oklch(0.62 0.18 155)"
                  : "oklch(0.62 0.14 75)",
              }}
            />
            <span className="text-xs font-semibold text-foreground">
              ElevenLabs:{" "}
              {credsLoading
                ? "Checking…"
                : isElevenLabsActive
                  ? "Connected — Premium voices active"
                  : "Not connected — using Web Speech fallback"}
            </span>
          </div>
          {!isElevenLabsActive && !credsLoading && (
            <a
              href="/go-live"
              className="text-[10px] font-semibold underline underline-offset-2"
              style={{ color: "oklch(0.68 0.18 290)" }}
            >
              Connect in Go Live →
            </a>
          )}
          {isElevenLabsActive && (
            <span className="text-[10px] text-muted-foreground ml-auto">
              🎙 Each niche uses a distinct voice personality
            </span>
          )}
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <div
        className="flex gap-1 rounded-xl p-1"
        style={{ background: "oklch(0.15 0.03 285)" }}
        role="tablist"
        data-ocid="voice_center.tab_group"
      >
        {[
          { id: "preview" as const, label: "Preview Agents", IconEl: Play },
          { id: "configure" as const, label: "Edit Scripts", IconEl: Settings },
        ].map(({ id, label, IconEl }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            data-ocid={`voice_center.${id}_tab`}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all"
            style={
              activeTab === id
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
                    color: "white",
                    boxShadow: "0 2px 8px oklch(0.58 0.22 290 / 35%)",
                  }
                : {
                    background: "transparent",
                    color: "oklch(0.60 0.06 285)",
                  }
            }
          >
            <IconEl size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab panels ── */}
      <AnimatePresence mode="wait">
        {activeTab === "preview" ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Instructions */}
            <div
              className="rounded-xl border px-4 py-3 text-xs text-muted-foreground leading-relaxed"
              style={{
                background: "oklch(0.14 0.03 285)",
                borderColor: "oklch(0.58 0.22 290 / 15%)",
              }}
            >
              <strong className="text-foreground">How to use:</strong> Click{" "}
              <strong className="text-foreground">Play Greeting</strong> on any
              card to hear the niche agent speak. Enter a custom business name
              to hear it spoken in context. Only one agent plays at a time —
              clicking a second card stops the first.
              {isElevenLabsActive &&
                " First play fetches audio from ElevenLabs; subsequent plays use cache."}
            </div>

            {/* Agent grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              data-ocid="voice_preview.agent_grid"
            >
              {NICHES.map((config, i) => (
                <motion.div
                  key={config.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <AgentCard
                    config={config}
                    apiKey={elevenLabsKey}
                    isElevenLabsActive={isElevenLabsActive}
                    globalAudioRef={globalAudioRef}
                    currentlyPlayingSlug={currentlyPlayingSlug}
                    onPlayStart={handlePlayStart}
                    onPlayEnd={handlePlayEnd}
                  />
                </motion.div>
              ))}
            </div>

            <p className="text-[11px] text-center text-muted-foreground/60">
              These are the same voices used in all prospect demos and two-way
              call simulations. Vapi handles live inbound calls; ElevenLabs
              handles all demo and simulated playback.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="configure"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <VoiceAgentConfigPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
