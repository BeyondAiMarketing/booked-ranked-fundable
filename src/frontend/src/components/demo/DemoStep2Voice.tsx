/**
 * DemoStep2Voice — V124 VOICE FALLBACK FIX
 *
 * AUDIO STRATEGY:
 *   onClick: playPreloadedAudioWithText(nicheId, 0, lines[0], onEnded)
 *   SYNCHRONOUS — no async between click and audio start.
 *   Remaining lines chained via startAudioSequence().
 *   FALLBACK: transcript-only display when no premium audio. NO SpeechSynthesis.
 *
 * LAYOUT (CSS Grid, 3 fixed rows, nothing shifts):
 *   Row 1: call-header (auto) — status, caller ID, pain stat before call
 *   Row 2: action-zone (1fr) — Answer button OR call UI, NEVER moves
 *   Row 3: transcript-zone (200px fixed) — scrolls inside, can't push Row 2
 *
 * PHASE FLOW:
 *   ringing → call → done
 *   done → GreenConfirmOverlay → completeStep()
 */

import { FRAMEWORK_BADGES, NICHE_PAIN_POINT_STATS } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import {
  NICHE_VOICE_SCRIPTS,
  buildScriptLines,
  cancelSpeechSynthesis,
  isAudioFallbackMode,
  isAudioPreloaded,
  playPreloadedAudioWithText,
  resetAudioFallbackMode,
  startAudioSequence,
  stopAllAudio,
  unlockAudioContext,
} from "@/services/audioService";
import type { DemoNicheId } from "@/types/demo";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import BookingConfirmationBubble from "./BookingConfirmationBubble";
import FrameworkBadge from "./FrameworkBadge";
import GreenConfirmOverlay from "./GreenConfirmOverlay";

// ─── Ring animation CSS ───────────────────────────────────────────────────────

const RING_CSS = `
@keyframes brf-ring-pulse {
  0%   { transform: scale(0.82); opacity: 0.7; }
  100% { transform: scale(1.7);  opacity: 0; }
}
@keyframes brf-phone-shake {
  0%,100% { transform: rotate(0deg); }
  15%     { transform: rotate(-14deg); }
  30%     { transform: rotate(14deg); }
  45%     { transform: rotate(-9deg); }
  60%     { transform: rotate(9deg); }
}
`;

// ─── Waveform bars ────────────────────────────────────────────────────────────

const BAR_HEIGHTS = [10, 22, 8, 28, 6, 20, 14, 26, 10, 18, 8, 24] as const;

function Waveform({ active }: { active: boolean }) {
  return (
    <div
      className="flex items-end gap-[2px] justify-center"
      aria-hidden="true"
      style={{ height: 36 }}
    >
      {BAR_HEIGHTS.map((h, i) =>
        active ? (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: stable positional bars
            key={i}
            className="rounded-full"
            style={{ width: 3, background: "oklch(0.62 0.18 155)" }}
            animate={{ height: [h * 0.25, h, h * 0.55, h * 0.9, h * 0.25] }}
            transition={{
              duration: 0.6 + i * 0.055,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.045,
            }}
          />
        ) : (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: stable positional bars
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              height: h * 0.25,
              background: "oklch(0.25 0.02 280)",
            }}
          />
        ),
      )}
    </div>
  );
}

// ─── Transcript bubble ────────────────────────────────────────────────────────

interface TLine {
  speaker: "Agent" | "Caller";
  text: string;
}

function TBubble({ line }: { line: TLine }) {
  const isAgent = line.speaker === "Agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 320 }}
      className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[90%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed"
        style={
          isAgent
            ? { background: "oklch(0.52 0.22 290)", color: "white" }
            : {
                background: "oklch(0.16 0.012 280)",
                color: "oklch(0.82 0.01 280)",
              }
        }
      >
        <span className="block text-[9px] font-bold mb-0.5 opacity-60">
          {isAgent ? "🤖 AI Agent" : "📞 Caller"}
        </span>
        {line.text}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type CallPhase = "ringing" | "call" | "done";

export default function DemoStep2Voice() {
  const { businessName, niche, completeStep } = useDemoFlow();

  const biz = businessName || "Your Business";
  const nicheKey = (niche || "plumber") as string;
  const script = NICHE_VOICE_SCRIPTS[nicheKey] ?? NICHE_VOICE_SCRIPTS.plumber;

  // Build lines with business name injected
  const lines = buildScriptLines(script, biz);

  const [phase, setPhase] = useState<CallPhase>("ringing");
  const [transcript, setTranscript] = useState<TLine[]>([]);
  const [waveActive, setWaveActive] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showBookingBubble, setShowBookingBubble] = useState(false);
  const [bubbleShown, setBubbleShown] = useState(false);
  const [audioReady, setAudioReady] = useState(() =>
    isAudioPreloaded(nicheKey),
  );
  // Transcript-only fallback mode — no premium audio, no robotic voices
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const abortRef = useRef(false);
  const audioFailureCountRef = useRef(0);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  // Guard: each line index can only play once
  const playedLinesRef = useRef<Set<number>>(new Set());
  // Guard: retry count per line index
  const retryCountRef = useRef<Map<number, number>>(new Map());
  // Guard: onComplete fires only once
  const hasCompletedRef = useRef(false);

  // Niche pain stat for display before call
  const painStat =
    NICHE_PAIN_POINT_STATS[nicheKey as DemoNicheId] ??
    NICHE_PAIN_POINT_STATS.plumber;

  // Cleanup on unmount
  useEffect(() => {
    // Reset audio fallback mode for this step
    resetAudioFallbackMode();
    return () => {
      abortRef.current = true;
      stopAllAudio();
    };
  }, []);

  // Poll for audio preload readiness
  useEffect(() => {
    if (audioReady) return;
    const interval = setInterval(() => {
      if (isAudioPreloaded(nicheKey)) {
        setAudioReady(true);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [nicheKey, audioReady]);

  // Auto-scroll transcript
  // biome-ignore lint/correctness/useExhaustiveDependencies: transcript.length triggers scroll
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript.length]);

  // Safety unlock after 35s — never block the user indefinitely
  useEffect(() => {
    const t = setTimeout(() => {
      if (!abortRef.current) completeStep();
    }, 35000);
    return () => clearTimeout(t);
  }, [completeStep]);

  const addLine = useCallback(
    (idx: number) => {
      const SPEAKERS: ReadonlyArray<TLine["speaker"]> = [
        "Agent",
        "Caller",
        "Agent",
        "Agent",
        "Agent",
      ];
      if (!abortRef.current && idx < lines.length) {
        setTranscript((p) => [
          ...p,
          { speaker: SPEAKERS[idx] ?? "Agent", text: lines[idx] ?? "" },
        ]);
      }
    },
    [lines],
  );

  /**
   * runTranscript — drives transcript display in parallel with audio.
   * Uses realistic delays so text appears in sync with speech.
   */
  const runTranscript = useCallback(async () => {
    if (abortRef.current) return;

    // Line 0: agent greeting
    await new Promise((r) => setTimeout(r, 500));
    if (abortRef.current) return;
    addLine(0);

    // Line 1: caller question
    const d0 = Math.min(lines[0].length * 50, 3600);
    await new Promise((r) => setTimeout(r, d0));
    if (abortRef.current) return;
    addLine(1);

    // Line 2: agent response
    const d1 = Math.min(lines[1].length * 40, 2600);
    await new Promise((r) => setTimeout(r, d1));
    if (abortRef.current) return;
    addLine(2);

    // Line 3: booking confirm
    const d2 = Math.min(lines[2].length * 52, 3800);
    await new Promise((r) => setTimeout(r, d2));
    if (abortRef.current) return;
    addLine(3);

    // Line 4: farewell
    const d3 = Math.min(lines[3].length * 48, 3600);
    await new Promise((r) => setTimeout(r, d3));
    if (abortRef.current) return;
    addLine(4);

    // End call — 800ms pause then overlay
    const d4 = Math.min(lines[4].length * 44, 2400);
    await new Promise((r) => setTimeout(r, d4 + 800));
    if (!abortRef.current) {
      setWaveActive(false);
      setPhase("done");
      setShowOverlay(true);
    }
  }, [lines, addLine]);

  /**
   * handleAnswer — THE CRITICAL FUNCTION.
   *
   * ══════════════════════════════════════════════════════════════════════
   * RULE 1: unlockAudioContext() SYNCHRONOUSLY as the VERY FIRST CALL.
   *         This is the third-chance AudioContext unlock (Step 0 and Step 1
   *         already did it, but belt-and-suspenders for iOS Safari).
   * RULE 2: playPreloadedAudioWithText() SYNCHRONOUSLY as the SECOND CALL.
   *         No async, no await, no setTimeout before it.
   *         iOS Safari blocks audio unless play() starts synchronously.
   * ══════════════════════════════════════════════════════════════════════
   */
  const handleAnswer = useCallback(() => {
    // SYNCHRONOUS: Unlock AudioContext
    unlockAudioContext();
    // Reset failure counter for this call
    audioFailureCountRef.current = 0;

    // SYNCHRONOUS: Start premium audio or enter transcript-only fallback (no SpeechSynthesis)
    const firstResult = playPreloadedAudioWithText(
      nicheKey,
      0,
      lines[0] ?? "",
      () => {
        if (abortRef.current) return;
        if (isAudioFallbackMode()) {
          // Fallback activated on line 0 — jump straight to transcript-only done
          setWaveActive(false);
          setPhase("done");
          setShowOverlay(true);
          return;
        }
        startAudioSequence(
          nicheKey,
          lines,
          1,
          (lineIdx) => {
            // Only allow each line to be tracked once
            if (playedLinesRef.current.has(lineIdx)) return;
            playedLinesRef.current.add(lineIdx);
            const retries = retryCountRef.current.get(lineIdx) ?? 0;
            if (retries >= 3) return; // Skip permanently failed lines
            /* transcript driven by runTranscript */
          },
          () => {
            // onComplete fires only once
            if (hasCompletedRef.current || abortRef.current) return;
            hasCompletedRef.current = true;
            setWaveActive(false);
            setPhase("done");
            setShowOverlay(true);
          },
          abortRef,
        );
        // Reset the component-level failure counter once sequence is handed off
        audioFailureCountRef.current = 0;
      },
    );

    // Line 0 itself failed immediately (null return) — increment guard and check threshold
    if (firstResult === null) {
      audioFailureCountRef.current++;
      const retries = retryCountRef.current.get(0) ?? 0;
      retryCountRef.current.set(0, retries + 1);
      if (audioFailureCountRef.current >= 3 || isAudioFallbackMode()) {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          setPhase("done");
          setShowOverlay(true);
        }
        return;
      }
    } else {
      playedLinesRef.current.add(0);
    }

    setPhase("call");
    // Detect fallback mode after a tick (no waveform if no audio)
    setTimeout(() => {
      const fallback = isAudioFallbackMode();
      setIsFallbackMode(fallback);
      setWaveActive(!fallback);
    }, 50);

    void runTranscript();
  }, [nicheKey, lines, runTranscript]);

  const handleEndCall = useCallback(() => {
    stopAllAudio();
    setWaveActive(false);
    setPhase("done");
    setShowOverlay(true);
  }, []);

  const handleOverlayDone = useCallback(() => {
    cancelSpeechSynthesis();
    setShowOverlay(false);
    // Show booking bubble after overlay dismisses
    setShowBookingBubble(true);
    setBubbleShown(true);
    // Enable Next button after bubble has been visible for 2s so user can read it
    setTimeout(() => {
      if (!abortRef.current) {
        // Reset played/retry tracking for a clean state if demo is replayed
        playedLinesRef.current.clear();
        retryCountRef.current.clear();
        completeStep();
      }
    }, 2000);
  }, [completeStep]);

  return (
    <>
      <style>{RING_CSS}</style>

      <div
        className="w-full max-w-sm mx-auto flex flex-col gap-3"
        data-ocid="demo.step2.section"
      >
        {/* Step header */}
        <div className="text-center shrink-0">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-0.5"
            style={{ color: "oklch(0.58 0.22 290)" }}
          >
            Act 1 · Step 2 — The Centerpiece
          </p>
          <h2 className="text-xl font-black text-white leading-tight">
            Your AI Receptionist
            <br />
            Answers Every Call
          </h2>
          <p className="text-xs mt-1" style={{ color: "oklch(0.52 0.02 280)" }}>
            {phase === "ringing"
              ? `Tap Answer — hear ${script.voiceName} say "${biz}" out loud`
              : phase === "call"
                ? isFallbackMode
                  ? "AI handling the call — follow the transcript below"
                  : "AI handling the call — booking in progress…"
                : "✓ Call handled automatically"}
          </p>
          {/* Transcript-only notice when premium audio unavailable */}
          {phase === "call" && isFallbackMode && (
            <p
              className="text-[10px] mt-1.5 px-3 py-1 rounded-full inline-block"
              style={{
                background: "oklch(0.52 0.14 50 / 12%)",
                color: "oklch(0.75 0.12 50)",
                border: "1px solid oklch(0.52 0.14 50 / 28%)",
              }}
            >
              Audio unavailable — follow along below
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PHONE FRAME — CSS Grid with 3 FIXED rows
            ═══════════════════════════════════════════════════════════════ */}
        {phase !== "done" && (
          <div
            className="w-full rounded-3xl overflow-hidden shrink-0"
            style={{
              background: "oklch(0.085 0.012 282)",
              border:
                phase === "call"
                  ? "2px solid oklch(0.58 0.22 290 / 55%)"
                  : "2px solid oklch(0.62 0.18 155 / 45%)",
              boxShadow:
                phase === "call"
                  ? "0 0 50px oklch(0.58 0.22 290 / 25%)"
                  : "0 0 50px oklch(0.62 0.18 155 / 20%)",
              // 4-row grid:
              //   Row 1: header info (auto)
              //   Row 2: action-zone — FIXED 120px — button NEVER moves
              //   Row 3: loading-hint — FIXED 32px — below button, never pushes up
              //   Row 4: transcript — FIXED 200px
              display: "grid",
              gridTemplateRows: "auto 120px 32px 200px",
              minHeight: 420,
            }}
            data-ocid={
              phase === "ringing"
                ? "demo.step2.ringing_state"
                : "demo.step2.call_state"
            }
          >
            {/* ── ROW 1: Call header ──────────────────────────────────────── */}
            <div
              style={{
                background: "oklch(0.08 0.01 280)",
                borderBottom: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              {/* Status bar */}
              <div
                className="px-4 py-1.5 flex items-center justify-between text-[10px]"
                style={{ color: "oklch(0.5 0.02 280)" }}
              >
                <span className="font-semibold tabular-nums">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className="text-[9px] font-semibold truncate mx-2 max-w-[120px]"
                  style={{ color: "oklch(0.55 0.06 290)" }}
                >
                  {biz}
                </span>
                <span
                  className="flex items-center gap-1 font-semibold"
                  style={{
                    fontSize: 9,
                    color:
                      phase === "call"
                        ? "oklch(0.58 0.22 290)"
                        : "oklch(0.62 0.18 155)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
                    style={{
                      background:
                        phase === "call"
                          ? "oklch(0.58 0.22 290)"
                          : "oklch(0.62 0.18 155)",
                    }}
                  />
                  {phase === "call" ? "Live" : "Active"}
                </span>
              </div>

              {/* Caller ID */}
              {phase === "ringing" ? (
                <div className="flex flex-col items-center gap-3 px-4 py-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase animate-pulse"
                    style={{
                      background: "oklch(0.62 0.18 155 / 16%)",
                      color: "oklch(0.75 0.14 155)",
                      border: "1px solid oklch(0.62 0.18 155 / 35%)",
                    }}
                  >
                    Incoming Call
                  </span>

                  {/* Ring animation rings */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{ width: 80, height: 80 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="absolute rounded-full border-2"
                        style={{
                          width: 80 + i * 28,
                          height: 80 + i * 28,
                          borderColor: "oklch(0.62 0.18 155 / 28%)",
                          animation: `brf-ring-pulse 2s ease-out ${i * 0.42}s infinite`,
                        }}
                      />
                    ))}
                    <div
                      className="relative z-10 flex items-center justify-center rounded-full text-2xl"
                      style={{
                        width: 62,
                        height: 62,
                        background:
                          "linear-gradient(135deg, oklch(0.62 0.18 155), oklch(0.52 0.16 160))",
                        boxShadow: "0 0 24px oklch(0.62 0.18 155 / 45%)",
                        animation: "brf-phone-shake 2.2s ease-in-out infinite",
                      }}
                    >
                      📞
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-base font-black text-white">
                      {script.callerName}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "oklch(0.52 0.02 280)" }}
                    >
                      Local Caller · {biz}
                    </p>
                  </div>

                  {/* Pain stat — only before call */}
                  <div
                    className="w-full text-center px-3 py-2 rounded-xl"
                    style={{
                      background: "oklch(0.55 0.18 25 / 10%)",
                      border: "1px solid oklch(0.55 0.18 25 / 22%)",
                    }}
                  >
                    <span
                      className="text-lg font-black"
                      style={{ color: "oklch(0.82 0.18 25)" }}
                    >
                      {painStat.stat}
                    </span>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "oklch(0.62 0.02 280)" }}
                    >
                      {painStat.statLabel}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: "oklch(0.62 0.18 155)" }}
                    />
                    <span className="text-xs font-semibold text-white/70">
                      Connected — {biz}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{
                      background: "oklch(0.58 0.22 290 / 18%)",
                      color: "oklch(0.78 0.16 290)",
                    }}
                  >
                    {script.voiceName} · AI
                  </span>
                </div>
              )}

              {/* Waveform — only during call */}
              {phase === "call" && (
                <div
                  className="flex justify-center items-center py-2"
                  style={{
                    borderTop: "1px solid oklch(1 0 0 / 6%)",
                    height: 48,
                  }}
                >
                  <Waveform active={waveActive} />
                </div>
              )}
            </div>

            {/* ── ROW 2: ACTION ZONE — FIXED 120px ──────────────────────────
                The Answer button lives in this row. Nothing can push it.
                No loading indicators here — they are in Row 3 below. */}
            <div
              className="flex items-center justify-center"
              style={{ background: "oklch(0.09 0.01 280)" }}
            >
              {phase === "ringing" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-8">
                    {/* Decorative decline (non-interactive) */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl select-none opacity-60"
                      style={{
                        background: "oklch(0.52 0.18 25 / 20%)",
                        border: "2px solid oklch(0.52 0.18 25 / 35%)",
                      }}
                      aria-hidden="true"
                    >
                      🔴
                    </div>

                    {/* ─── THE ANSWER BUTTON ──────────────────────────────────────
                        SYNCHRONOUS: unlockAudioContext() + playPreloadedAudioWithText(0)
                        are the FIRST TWO CALLS in handleAnswer — no async gap.
                        Button position is FIXED by the 120px grid row — nothing moves it. ─── */}
                    <button
                      type="button"
                      onClick={handleAnswer}
                      data-ocid="demo.step2.answer_button"
                      aria-label={`Answer the incoming call — ${script.voiceName} will speak using "${biz}"`}
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white shrink-0 transition-transform hover:scale-110 active:scale-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.62 0.18 155), oklch(0.52 0.16 162))",
                        boxShadow:
                          "0 4px 24px oklch(0.62 0.18 155 / 50%), 0 0 0 5px oklch(0.62 0.18 155 / 18%)",
                      }}
                    >
                      📞
                    </button>
                  </div>

                  <p
                    className="text-[10px] text-center"
                    style={{ color: "oklch(0.48 0.02 280)" }}
                  >
                    Tap to answer
                  </p>
                </div>
              ) : phase === "call" ? (
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleEndCall}
                    data-ocid="demo.step2.end_call_button"
                    aria-label="End the call"
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg text-white shrink-0 transition-transform hover:scale-105 active:scale-95"
                    style={{
                      background: "oklch(0.52 0.18 25 / 25%)",
                      border: "2px solid oklch(0.52 0.18 25 / 42%)",
                    }}
                  >
                    📵
                  </button>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: "oklch(0.62 0.18 155)" }}
                  >
                    AI handling call…
                  </span>
                </div>
              ) : (
                <span
                  className="text-sm font-bold"
                  style={{ color: "oklch(0.72 0.16 155)" }}
                >
                  ✓ Call complete
                </span>
              )}
            </div>

            {/* ── ROW 3: LOADING HINT — FIXED 32px ─────────────────────────────
                This row is BELOW the button. It can show/hide freely without
                ever affecting the button position in Row 2. */}
            <div
              className="flex items-center justify-center"
              style={{
                background: "oklch(0.09 0.01 280)",
                borderTop: "1px solid oklch(1 0 0 / 5%)",
              }}
            >
              {phase === "ringing" && !audioReady && (
                <p
                  className="text-[10px] font-semibold animate-pulse"
                  style={{ color: "oklch(0.58 0.22 290 / 60%)" }}
                >
                  ⏳ Preparing premium audio…
                </p>
              )}
              {phase === "ringing" && audioReady && (
                <p
                  className="text-[10px] font-semibold"
                  style={{ color: "oklch(0.55 0.18 155 / 70%)" }}
                >
                  🔊 Audio ready
                </p>
              )}
            </div>

            {/* ── ROW 4: TRANSCRIPT ZONE — 200px FIXED HEIGHT ───────────────
                This row CANNOT overflow its 200px allocation.
                Content scrolls INSIDE this box only. Rows 2 and 3 are unaffected. */}
            <div
              className="overflow-y-auto p-3 space-y-2 flex flex-col"
              style={{
                background: "oklch(0.1 0.012 280)",
                borderTop: "1px solid oklch(1 0 0 / 8%)",
              }}
              aria-label="Call transcript"
              aria-live="polite"
            >
              {phase === "ringing" ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className="text-2xl">🎤</div>
                  <p
                    className="text-[11px] text-center leading-relaxed max-w-[200px]"
                    style={{ color: "oklch(0.5 0.02 280)" }}
                  >
                    Tap Answer — live transcript appears here
                  </p>
                  <div
                    className="text-[10px] px-3 py-1.5 rounded-full font-semibold"
                    style={{
                      background: "oklch(0.58 0.22 290 / 12%)",
                      color: "oklch(0.65 0.14 290)",
                      border: "1px solid oklch(0.58 0.22 290 / 22%)",
                    }}
                  >
                    🔊 Audio fires instantly on tap
                  </div>
                </div>
              ) : (
                <>
                  {transcript.length === 0 && (
                    <div className="flex items-center justify-center py-3 gap-1.5">
                      {[0, 1, 2].map((d) => (
                        <div
                          key={d}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            background: "oklch(0.58 0.22 290 / 0.6)",
                            animationDelay: `${d * 0.18}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {transcript.map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: sequential order
                    <TBubble key={i} line={line} />
                  ))}
                  <div ref={transcriptEndRef} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Framework badge */}
        <div className="flex justify-center">
          <FrameworkBadge badge={FRAMEWORK_BADGES.deiss} size="sm" />
        </div>
      </div>

      {/* Full-screen green confirmation overlay */}
      <AnimatePresence>
        {showOverlay && (
          <GreenConfirmOverlay
            data={{
              headline: "Call Handled & Booked!",
              items: [
                "Appointment confirmed automatically",
                "SMS sent to caller immediately",
                "Lead saved to CRM",
              ],
              subtitle:
                "That call was handled, transcribed, logged, and followed up — while you were doing something else.",
            }}
            onDismiss={handleOverlayDone}
            dataOcid="demo.step2.booking_overlay"
          />
        )}
      </AnimatePresence>

      {/* SMS-style booking confirmation bubble */}
      <BookingConfirmationBubble
        businessName={biz}
        callerName={script.callerName}
        appointmentTime="Today · 2:30 PM"
        serviceName={
          script.niche
            ? `${script.niche.charAt(0).toUpperCase()}${script.niche.slice(1).replace(/-/g, " ")} Appointment`
            : "Service Appointment"
        }
        visible={showBookingBubble && !showOverlay}
        onDismiss={() => setShowBookingBubble(false)}
      />

      {/* "Ready to continue" hint — shown after bubble appears */}
      <AnimatePresence>
        {bubbleShown && !showOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="fixed bottom-[72px] left-0 right-0 flex justify-center pointer-events-none z-30"
          >
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "oklch(0.58 0.22 290 / 15%)",
                border: "1px solid oklch(0.58 0.22 290 / 30%)",
                color: "oklch(0.72 0.14 290)",
              }}
            >
              Ready! Tap Next to continue →
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
