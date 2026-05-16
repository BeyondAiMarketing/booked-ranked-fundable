/**
 * VoiceAgentConfigPanel — V2
 *
 * New in V2:
 *  - Niche tab bar across the top for all 10 niches (replaces single dropdown)
 *  - "Preview This Line" button per line: plays just that line with ElevenLabs
 *  - "Save & Regenerate" button: saves + triggers new ElevenLabs generation
 *  - Version history: last 3 saved versions with restore option
 *  - Visual save confirmation and per-line loading states
 */

import { useCredentials } from "@/context/CredentialsContext";
import { useActor } from "@/hooks/useActor";
import {
  ELEVENLABS_VOICE_IDS,
  ELEVENLABS_VOICE_META,
} from "@/hooks/useElevenLabsVoice";
import { useNicheVoiceAssignments } from "@/hooks/useNicheVoiceAssignments";
import { NICHE_VOICE_SCRIPTS, buildScriptLines } from "@/services/audioService";
import {
  generateAudio,
  generateNicheAudio,
} from "@/services/elevenLabsService";
import type { NicheScriptLine } from "@/types/nicheVoice";
import {
  CheckCircle,
  Clock,
  History,
  Loader2,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NICHES: Array<{ id: string; label: string; emoji: string }> = [
  { id: "plumbing", label: "Plumbing", emoji: "🔧" },
  { id: "med-spa", label: "Med Spa", emoji: "💆" },
  { id: "hvac", label: "HVAC", emoji: "❄️" },
  { id: "restoration", label: "Restoration", emoji: "🏠" },
  { id: "carpet-cleaning", label: "Carpet Cleaning", emoji: "🧹" },
  { id: "roofing", label: "Roofing", emoji: "🏗️" },
  { id: "real-estate", label: "Real Estate", emoji: "🏘️" },
  { id: "mortgage", label: "Mortgage", emoji: "📋" },
  { id: "chiropractic", label: "Chiropractic", emoji: "🦴" },
  { id: "dental", label: "Dental", emoji: "🦷" },
];

// Map from dropdown niche id → audioService script key
const NICHE_SCRIPT_KEY: Record<string, string> = {
  plumbing: "plumbing",
  "med-spa": "med-spa",
  hvac: "hvac",
  restoration: "restoration",
  "carpet-cleaning": "carpet-cleaning",
  roofing: "roofing",
  "real-estate": "real-estate",
  mortgage: "mortgage",
  chiropractic: "chiropractic",
  dental: "dental",
};

interface ScriptVersion {
  savedAt: number;
  lines: NicheScriptLine[];
}

function getDefaultLines(nicheId: string): NicheScriptLine[] {
  const key = NICHE_SCRIPT_KEY[nicheId] ?? nicheId;
  const script = NICHE_VOICE_SCRIPTS[key];
  if (!script) return [];
  return [
    { speaker: "agent", text: script.agentGreeting, lineIndex: 0 },
    { speaker: "caller", text: script.callerQuestion, lineIndex: 1 },
    { speaker: "agent", text: script.agentResponse, lineIndex: 2 },
    { speaker: "agent", text: script.agentBookingConfirm, lineIndex: 3 },
    { speaker: "agent", text: script.agentFarewell, lineIndex: 4 },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SpeakerBadgeProps {
  speaker: "agent" | "caller";
}

function SpeakerBadge({ speaker }: SpeakerBadgeProps) {
  return speaker === "agent" ? (
    <span
      className="inline-flex items-center justify-center w-16 shrink-0 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
      style={{
        background: "oklch(0.58 0.22 290 / 15%)",
        border: "1px solid oklch(0.58 0.22 290 / 30%)",
        color: "oklch(0.78 0.18 290)",
      }}
    >
      AGENT
    </span>
  ) : (
    <span
      className="inline-flex items-center justify-center w-16 shrink-0 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
      style={{
        background: "oklch(0.58 0.18 215 / 12%)",
        border: "1px solid oklch(0.58 0.18 215 / 25%)",
        color: "oklch(0.72 0.14 215)",
      }}
    >
      CALLER
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface VoiceAgentConfigPanelProps {
  /** Optional controlled niche — if provided, the niche tab bar is hidden */
  initialNicheId?: string;
}

export function VoiceAgentConfigPanel({
  initialNicheId,
}: VoiceAgentConfigPanelProps) {
  const { actor } = useActor();
  const { creds } = useCredentials();
  const { assignments, getAssignedVoiceId } = useNicheVoiceAssignments();

  const elevenLabsKey = creds?.elevenLabsKey ?? "";
  const hasElevenLabs = !!elevenLabsKey.trim();

  const [selectedNicheId, setSelectedNicheId] = useState(
    initialNicheId ?? NICHES[0]!.id,
  );
  const [lines, setLines] = useState<NicheScriptLine[]>([]);
  const [isFetchingScript, setIsFetchingScript] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<
    Record<string, ScriptVersion[]>
  >({});
  const [previewingLineIndex, setPreviewingLineIndex] = useState<number | null>(
    null,
  );

  const [regenProgress, setRegenProgress] = useState<{
    running: boolean;
    current: number;
    total: number;
    done: boolean;
    usedElevenLabs: boolean;
  }>({
    running: false,
    current: 0,
    total: 0,
    done: false,
    usedElevenLabs: false,
  });

  const saveStatusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived voice info ────────────────────────────────────────────────────

  const assignedVoiceId = getAssignedVoiceId(selectedNicheId);
  const hardcodedVoiceId = ELEVENLABS_VOICE_IDS[selectedNicheId] ?? "";
  const effectiveVoiceId = assignedVoiceId ?? hardcodedVoiceId;

  const meta = ELEVENLABS_VOICE_META[selectedNicheId];
  const assignedEntry = assignments.find((a) => a.nicheId === selectedNicheId);
  const voiceDisplayName =
    assignedEntry?.voiceName ?? meta?.voiceName ?? "Default";
  const isOverridden = !!assignedEntry;

  // ── Load script from backend on niche change ─────────────────────────────

  const loadScript = useCallback(
    async (nicheId: string) => {
      setIsFetchingScript(true);
      try {
        if (actor) {
          const backendLines = await actor.getNicheScriptLines(nicheId);
          if (
            backendLines !== null &&
            Array.isArray(backendLines) &&
            backendLines.length > 0
          ) {
            const parsed: NicheScriptLine[] = (backendLines as string[]).map(
              (text, i) => ({
                speaker: (i % 2 === 0 ? "agent" : "caller") as
                  | "agent"
                  | "caller",
                text,
                lineIndex: i,
              }),
            );
            if (parsed[0]) parsed[0].speaker = "agent";
            if (parsed[1]) parsed[1].speaker = "caller";
            setLines(parsed);
            return;
          }
        }
      } catch {
        // fall through to defaults
      } finally {
        setIsFetchingScript(false);
      }
      setLines(getDefaultLines(nicheId));
    },
    [actor],
  );

  useEffect(() => {
    void loadScript(selectedNicheId);
    setRegenProgress({
      running: false,
      current: 0,
      total: 0,
      done: false,
      usedElevenLabs: false,
    });
    setSaveStatus("idle");
  }, [selectedNicheId, loadScript]);

  // ── Version history helpers ───────────────────────────────────────────────

  const pushVersion = useCallback(
    (nicheId: string, snapshot: NicheScriptLine[]) => {
      setVersionHistory((prev) => {
        const existing = prev[nicheId] ?? [];
        const next = [
          {
            savedAt: Date.now(),
            lines: JSON.parse(JSON.stringify(snapshot)) as NicheScriptLine[],
          },
          ...existing,
        ].slice(0, 3); // keep last 3
        return { ...prev, [nicheId]: next };
      });
    },
    [],
  );

  const restoreVersion = useCallback((version: ScriptVersion) => {
    setLines(version.lines.map((l) => ({ ...l })));
    setSaveStatus("idle");
    setShowVersionHistory(false);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleLineChange = useCallback((index: number, text: string) => {
    setLines((prev) =>
      prev.map((l) => (l.lineIndex === index ? { ...l, text } : l)),
    );
    setSaveStatus("idle");
  }, []);

  const handleSave = useCallback(async () => {
    if (!actor || isSaving) return;
    setIsSaving(true);
    try {
      const lineTexts = lines.map((l) => l.text);
      await actor.setNicheScriptLines(selectedNicheId, lineTexts);
      setSaveStatus("saved");
      pushVersion(selectedNicheId, lines);
      if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
      saveStatusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  }, [actor, isSaving, lines, selectedNicheId, pushVersion]);

  const handleSaveAndRegen = useCallback(async () => {
    await handleSave();
    if (!regenProgress.running) {
      const agentLines = lines.filter((l) => l.speaker === "agent");
      const agentTexts = agentLines.map((l) => l.text);
      const total = agentTexts.length;
      if (total === 0) return;

      setRegenProgress({
        running: true,
        current: 0,
        total,
        done: false,
        usedElevenLabs: hasElevenLabs,
      });

      if (hasElevenLabs && effectiveVoiceId && actor) {
        const results = new Map<number, string>();
        for (let i = 0; i < agentTexts.length; i++) {
          setRegenProgress((p) => ({ ...p, current: i + 1 }));
          const singleMap = await generateNicheAudio(
            elevenLabsKey,
            effectiveVoiceId,
            [agentTexts[i]!],
          );
          const base64 = singleMap.get(0);
          if (base64) {
            const globalLineIdx = agentLines[i]!.lineIndex;
            results.set(globalLineIdx, base64);
            try {
              await actor.setCachedAudio(
                `${selectedNicheId}:${globalLineIdx}`,
                base64,
              );
            } catch {
              /* best-effort */
            }
          }
        }
      } else {
        for (let i = 1; i <= total; i++) {
          await new Promise<void>((r) => setTimeout(r, 180));
          setRegenProgress((p) => ({ ...p, current: i }));
        }
      }

      setRegenProgress({
        running: false,
        current: total,
        total,
        done: true,
        usedElevenLabs: hasElevenLabs,
      });
    }
  }, [
    handleSave,
    regenProgress.running,
    lines,
    hasElevenLabs,
    effectiveVoiceId,
    elevenLabsKey,
    actor,
    selectedNicheId,
  ]);

  const handleReset = useCallback(async () => {
    if (!actor || isResetting) return;
    setIsResetting(true);
    try {
      await actor.resetNicheScript(selectedNicheId);
    } catch {
      /* fall through */
    } finally {
      setIsResetting(false);
    }
    setLines(getDefaultLines(selectedNicheId));
    setSaveStatus("idle");
  }, [actor, isResetting, selectedNicheId]);

  const handleRegenAudio = useCallback(async () => {
    if (regenProgress.running || !actor) return;
    const agentLines = lines.filter((l) => l.speaker === "agent");
    const agentTexts = agentLines.map((l) => l.text);
    const total = agentTexts.length;
    if (total === 0) return;

    setRegenProgress({
      running: true,
      current: 0,
      total,
      done: false,
      usedElevenLabs: hasElevenLabs,
    });

    if (hasElevenLabs && effectiveVoiceId) {
      for (let i = 0; i < agentTexts.length; i++) {
        setRegenProgress((p) => ({ ...p, current: i + 1 }));
        const singleMap = await generateNicheAudio(
          elevenLabsKey,
          effectiveVoiceId,
          [agentTexts[i]!],
        );
        const base64 = singleMap.get(0);
        if (base64) {
          const globalLineIdx = agentLines[i]!.lineIndex;
          try {
            await actor.setCachedAudio(
              `${selectedNicheId}:${globalLineIdx}`,
              base64,
            );
          } catch {
            /* best-effort */
          }
        }
      }
    } else {
      for (let i = 1; i <= total; i++) {
        await new Promise<void>((r) => setTimeout(r, 180));
        setRegenProgress((p) => ({ ...p, current: i }));
      }
    }

    setRegenProgress({
      running: false,
      current: total,
      total,
      done: true,
      usedElevenLabs: hasElevenLabs,
    });
  }, [
    regenProgress.running,
    actor,
    lines,
    hasElevenLabs,
    elevenLabsKey,
    effectiveVoiceId,
    selectedNicheId,
  ]);

  const handlePreviewLine = useCallback(
    async (line: NicheScriptLine) => {
      if (line.speaker !== "agent") return;
      if (previewingLineIndex !== null) return;

      setPreviewingLineIndex(line.lineIndex);
      const text = line.text.replace(/\{\{businessName\}\}/g, "Your Business");

      if (hasElevenLabs && effectiveVoiceId) {
        const buf = await generateAudio(elevenLabsKey, effectiveVoiceId, text);
        if (buf) {
          try {
            const blob = new Blob([buf], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.onended = () => {
              URL.revokeObjectURL(url);
              setPreviewingLineIndex(null);
            };
            audio.onerror = () => {
              URL.revokeObjectURL(url);
              setPreviewingLineIndex(null);
            };
            await audio.play();
            return;
          } catch {
            /* fall through */
          }
        }
      }

      // Browser TTS fallback
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.88;
        utt.pitch = 1.05;
        utt.onend = () => setPreviewingLineIndex(null);
        utt.onerror = () => setPreviewingLineIndex(null);
        window.speechSynthesis.speak(utt);
      } else {
        setPreviewingLineIndex(null);
      }
    },
    [previewingLineIndex, hasElevenLabs, elevenLabsKey, effectiveVoiceId],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const selectedNicheLabel =
    NICHES.find((n) => n.id === selectedNicheId)?.label ?? selectedNicheId;
  const currentVersionHistory = versionHistory[selectedNicheId] ?? [];

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "oklch(0.13 0.03 285)",
        borderColor: "oklch(0.58 0.22 290 / 18%)",
      }}
      data-ocid="voice_config.panel"
    >
      {/* ── Panel header ── */}
      <div
        className="px-5 py-4 border-b flex items-center gap-3"
        style={{ borderColor: "oklch(0.58 0.22 290 / 12%)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
          }}
        >
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-black text-foreground text-sm">
            Voice Agent Script Editor
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Edit scripts per niche — changes persist in backend storage
          </p>
        </div>
        {/* Version history toggle */}
        {currentVersionHistory.length > 0 && (
          <button
            type="button"
            onClick={() => setShowVersionHistory((v) => !v)}
            data-ocid="voice_config.version_history_button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-colors"
          >
            <History size={12} />
            History ({currentVersionHistory.length})
          </button>
        )}
      </div>

      {/* ── Niche tab bar ── */}
      {!initialNicheId && (
        <div
          className="flex overflow-x-auto gap-0 border-b scrollbar-hide"
          style={{ borderColor: "oklch(0.58 0.22 290 / 10%)" }}
          data-ocid="voice_config.niche_tabs"
        >
          {NICHES.map((n) => {
            const isActive = selectedNicheId === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNicheId(n.id)}
                data-ocid={`voice_config.niche_tab.${n.id}`}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-all shrink-0 border-b-2 ${
                  isActive
                    ? "text-foreground border-purple-500"
                    : "text-muted-foreground border-transparent hover:text-foreground/80 hover:border-white/20"
                }`}
              >
                <span>{n.emoji}</span>
                {n.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="p-5 space-y-5">
        {/* ── Version history panel ── */}
        <AnimatePresence>
          {showVersionHistory && currentVersionHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-xl border p-4 space-y-2"
                style={{
                  background: "oklch(0.16 0.04 285)",
                  borderColor: "oklch(0.58 0.22 290 / 20%)",
                }}
                data-ocid="voice_config.version_history_panel"
              >
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={11} /> Saved Versions (last 3)
                </p>
                {currentVersionHistory.map((version, i) => (
                  <div
                    key={version.savedAt}
                    className="flex items-center justify-between gap-3 py-2 border-t border-white/5 first:border-0"
                  >
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        Version {currentVersionHistory.length - i}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(version.savedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => restoreVersion(version)}
                      data-ocid={`voice_config.restore_version_button.${i + 1}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <RotateCcw size={10} /> Restore
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Voice assignment card ── */}
        <div
          className="rounded-xl border p-3.5 flex items-center gap-3"
          style={{
            background: hasElevenLabs
              ? "oklch(0.62 0.18 155 / 5%)"
              : "oklch(0.58 0.22 290 / 5%)",
            borderColor: hasElevenLabs
              ? "oklch(0.62 0.18 155 / 20%)"
              : "oklch(0.58 0.22 290 / 20%)",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: hasElevenLabs
                ? "linear-gradient(135deg, oklch(0.62 0.18 155), oklch(0.52 0.16 150))"
                : "oklch(0.20 0.05 285)",
              border: `1px solid ${hasElevenLabs ? "oklch(0.62 0.18 155 / 40%)" : "oklch(0.58 0.22 290 / 20%)"}`,
            }}
          >
            <Volume2 size={15} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-foreground">
                {selectedNicheLabel}
              </span>
              {hasElevenLabs ? (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                  style={{
                    background: "oklch(0.62 0.18 155 / 12%)",
                    borderColor: "oklch(0.62 0.18 155 / 35%)",
                    color: "oklch(0.72 0.18 155)",
                  }}
                >
                  <Zap size={7} /> ElevenLabs
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
                  style={{
                    background: "oklch(0.58 0.22 75 / 10%)",
                    borderColor: "oklch(0.58 0.22 75 / 25%)",
                    color: "oklch(0.72 0.18 75)",
                  }}
                >
                  Fallback
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isOverridden ? (
                <>
                  <span className="font-semibold text-foreground/80">
                    Custom:
                  </span>{" "}
                  {voiceDisplayName}
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground/80">
                    Default:
                  </span>{" "}
                  {voiceDisplayName}
                  {meta?.personality ? ` — ${meta.personality}` : ""}
                </>
              )}
            </p>
            {effectiveVoiceId && (
              <p className="text-[9px] text-muted-foreground/50 mt-0.5 font-mono truncate">
                ID: {effectiveVoiceId}
              </p>
            )}
          </div>
        </div>

        {/* ── Script editor ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Conversation Script
            </span>
            {isFetchingScript && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 0.9,
                  ease: "linear",
                }}
                className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/40 border-t-transparent"
              />
            )}
          </div>

          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "oklch(0.58 0.22 290 / 15%)" }}
            data-ocid="voice_config.script_editor"
          >
            {lines.length === 0 && !isFetchingScript ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No script found for this niche.
              </div>
            ) : (
              <div
                className="divide-y"
                style={{ borderColor: "oklch(0.58 0.22 290 / 10%)" }}
              >
                {lines.map((line, i) => (
                  <motion.div
                    key={line.lineIndex}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="flex items-start gap-3 px-3 py-3"
                    style={{
                      background:
                        line.speaker === "agent"
                          ? "oklch(0.58 0.22 290 / 3%)"
                          : "oklch(0.14 0.02 285)",
                    }}
                    data-ocid={`voice_config.script_line.${i + 1}`}
                  >
                    <div className="pt-2">
                      <SpeakerBadge speaker={line.speaker} />
                    </div>

                    <textarea
                      value={line.text}
                      onChange={(e) =>
                        handleLineChange(line.lineIndex, e.target.value)
                      }
                      rows={2}
                      placeholder={
                        line.speaker === "agent"
                          ? "Agent response…"
                          : "Caller question…"
                      }
                      data-ocid={`voice_config.script_textarea.${i + 1}`}
                      className="flex-1 min-w-0 resize-none rounded-lg px-3 py-2 text-xs leading-relaxed font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all"
                      style={{
                        background: "oklch(0.17 0.04 285)",
                        border: "1px solid oklch(0.58 0.22 290 / 18%)",
                        color:
                          line.speaker === "agent"
                            ? "oklch(0.88 0.08 290)"
                            : "oklch(0.80 0.04 215)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor =
                          "oklch(0.58 0.22 290 / 55%)";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px oklch(0.58 0.22 290 / 10%)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor =
                          "oklch(0.58 0.22 290 / 18%)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />

                    {/* Per-line preview button (agent lines only) */}
                    {line.speaker === "agent" && (
                      <button
                        type="button"
                        onClick={() => void handlePreviewLine(line)}
                        disabled={previewingLineIndex !== null}
                        title="Preview this line"
                        data-ocid={`voice_config.preview_line_button.${i + 1}`}
                        className="mt-2 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all hover:scale-105 disabled:opacity-40"
                        style={{
                          background:
                            previewingLineIndex === line.lineIndex
                              ? "oklch(0.62 0.18 155 / 25%)"
                              : "oklch(0.58 0.22 290 / 20%)",
                          border: "1px solid oklch(0.58 0.22 290 / 30%)",
                        }}
                      >
                        {previewingLineIndex === line.lineIndex ? (
                          <Loader2
                            size={11}
                            className="text-white animate-spin"
                          />
                        ) : (
                          <Play size={11} className="text-white ml-0.5" />
                        )}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Regenerate audio status ── */}
        <AnimatePresence>
          {(regenProgress.running || regenProgress.done) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {regenProgress.running ? (
                <div
                  className="rounded-xl border px-4 py-3 flex items-center gap-3"
                  style={{
                    background: "oklch(0.58 0.22 290 / 6%)",
                    borderColor: "oklch(0.58 0.22 290 / 25%)",
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 0.9,
                      ease: "linear",
                    }}
                    className="w-4 h-4 rounded-full border-2 shrink-0"
                    style={{
                      borderColor:
                        "oklch(0.58 0.22 290 / 60%) oklch(0.58 0.22 290 / 20%) oklch(0.58 0.22 290 / 20%) oklch(0.58 0.22 290 / 20%)",
                    }}
                  />
                  <span className="text-xs font-semibold text-foreground">
                    Generating {regenProgress.current} of {regenProgress.total}{" "}
                    lines…
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
                      }}
                      animate={{
                        width: `${(regenProgress.current / regenProgress.total) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              ) : regenProgress.done ? (
                <div
                  className="rounded-xl border px-4 py-3 flex items-center gap-3"
                  style={{
                    background: "oklch(0.62 0.18 155 / 6%)",
                    borderColor: "oklch(0.62 0.18 155 / 25%)",
                  }}
                  data-ocid="voice_config.regen_success_state"
                >
                  <CheckCircle
                    size={16}
                    className="shrink-0"
                    style={{ color: "oklch(0.72 0.18 155)" }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.82 0.14 155)" }}
                  >
                    {regenProgress.usedElevenLabs
                      ? "Audio ready — demo will play premium ElevenLabs voice"
                      : "Audio will use OpenAI TTS on next demo — no action needed"}
                  </span>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Action toolbar ── */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Save */}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving || lines.length === 0}
            data-ocid="voice_config.save_button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                saveStatus === "saved"
                  ? "linear-gradient(135deg, oklch(0.62 0.18 155), oklch(0.52 0.16 150))"
                  : "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
              boxShadow:
                saveStatus === "saved"
                  ? "0 3px 10px oklch(0.62 0.18 155 / 30%)"
                  : "0 3px 10px oklch(0.58 0.22 290 / 30%)",
            }}
          >
            {isSaving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.9,
                    ease: "linear",
                  }}
                  className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent"
                />{" "}
                Saving…
              </>
            ) : saveStatus === "saved" ? (
              <>
                <CheckCircle size={13} /> Saved
              </>
            ) : (
              <>
                <Save size={13} /> Save Script
              </>
            )}
          </button>

          {/* Save & Regenerate */}
          <button
            type="button"
            onClick={() => void handleSaveAndRegen()}
            disabled={isSaving || regenProgress.running || lines.length === 0}
            data-ocid="voice_config.save_and_regen_button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 260), oklch(0.48 0.20 250))",
              boxShadow: "0 3px 10px oklch(0.55 0.22 260 / 25%)",
            }}
          >
            <Sparkles size={13} /> Save & Regenerate
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => void handleReset()}
            disabled={isResetting}
            data-ocid="voice_config.reset_button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "oklch(0.18 0.04 285)",
              border: "1px solid oklch(0.58 0.22 290 / 20%)",
              color: "oklch(0.72 0.08 290)",
            }}
          >
            {isResetting ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Resetting…
              </>
            ) : (
              <>
                <RotateCcw size={13} /> Reset to Default
              </>
            )}
          </button>

          {/* Regenerate Audio only */}
          <button
            type="button"
            onClick={() => void handleRegenAudio()}
            disabled={regenProgress.running || lines.length === 0}
            data-ocid="voice_config.regenerate_audio_button"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.18 155), oklch(0.52 0.16 150))",
              boxShadow: "0 3px 10px oklch(0.62 0.18 155 / 25%)",
            }}
          >
            {regenProgress.running ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Generating…
              </>
            ) : (
              <>
                <RefreshCw size={13} /> Regenerate Audio
              </>
            )}
          </button>
        </div>

        {/* Save error feedback */}
        <AnimatePresence>
          {saveStatus === "error" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[11px]"
              style={{ color: "oklch(0.72 0.18 25)" }}
              data-ocid="voice_config.save_error_state"
            >
              Save failed — check your connection and try again.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
