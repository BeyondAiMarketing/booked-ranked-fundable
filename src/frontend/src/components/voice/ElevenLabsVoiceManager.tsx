/**
 * ElevenLabsVoiceManager.tsx — V2
 *
 * New in V2:
 *  - After assigning a voice, show "✓ Bella assigned to Plumbing — generating audio now…" banner
 *  - Per-niche test button that plays the greeting line with that niche's assigned voice
 *  - Voice preview no longer requires assignment first
 *  - ElevenLabs character quota display (used/total)
 *  - Auto-triggers PreGenerationEngine for the niche when a voice is assigned
 *  - Visual confirmation uses an animated success banner per assignment
 */

import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mic,
  Play,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNicheVoiceAssignments } from "../../hooks/useNicheVoiceAssignments";
import { usePreGenerationEngine } from "../../hooks/usePreGenerationEngine";
import { NICHE_VOICE_SCRIPTS } from "../../services/audioService";
import {
  fetchVoices,
  generateAudio,
  previewVoice,
} from "../../services/elevenLabsService";
import type { ElevenLabsVoice } from "../../types/nicheVoice";

// ── Types ──────────────────────────────────────────────────────────────────────

interface QuotaInfo {
  characterCount: number;
  characterLimit: number;
}

// ── Niche definitions ──────────────────────────────────────────────────────────

const NICHES: { id: string; label: string; emoji: string }[] = [
  { id: "plumber", label: "Plumbing", emoji: "🔧" },
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

// ── Fetch ElevenLabs quota ─────────────────────────────────────────────────────

async function fetchQuota(apiKey: string): Promise<QuotaInfo | null> {
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
      headers: { "xi-api-key": apiKey },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      character_count?: number;
      character_limit?: number;
    };
    if (
      typeof data.character_count === "number" &&
      typeof data.character_limit === "number"
    ) {
      return {
        characterCount: data.character_count,
        characterLimit: data.character_limit,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// ── Voice card ─────────────────────────────────────────────────────────────────

interface VoiceCardProps {
  voice: ElevenLabsVoice;
  isSelected: boolean;
  assignedNiches: string[];
  apiKey: string;
  onSelect: (voice: ElevenLabsVoice) => void;
}

function VoiceCard({
  voice,
  isSelected,
  assignedNiches,
  apiKey,
  onSelect,
}: VoiceCardProps) {
  const [previewing, setPreviewing] = useState(false);

  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewing) return;
    setPreviewing(true);
    await previewVoice(apiKey, voice.voice_id);
    setPreviewing(false);
  };

  const personality =
    voice.labels?.use_case ?? voice.labels?.accent ?? voice.labels?.gender;
  const shortId = `${voice.voice_id.slice(0, 10)}…`;

  return (
    <button
      type="button"
      data-ocid={`voice_manager.voice_card.${voice.voice_id.slice(0, 8)}`}
      onClick={() => onSelect(voice)}
      className={`group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-left w-full ${
        isSelected
          ? "border-purple-500/60 bg-purple-500/12 ring-1 ring-purple-500/40 shadow-lg shadow-purple-900/20"
          : "border-white/8 bg-white/3 hover:border-purple-500/30 hover:bg-purple-500/5"
      }`}
    >
      <div
        className={`relative w-[72px] h-[72px] rounded-xl flex items-center justify-center shrink-0 transition-all ${
          isSelected
            ? "bg-gradient-to-br from-purple-600/40 to-indigo-600/40 border border-purple-500/50"
            : "bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-white/8 group-hover:border-purple-500/30"
        }`}
      >
        <Mic
          size={28}
          className={
            isSelected
              ? "text-purple-300"
              : "text-slate-400 group-hover:text-purple-400"
          }
        />
        {isSelected && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center border-2 border-card">
            <CheckCircle2 size={11} className="text-white" />
          </div>
        )}
      </div>

      <div className="text-center space-y-1 w-full min-w-0">
        <p
          className={`text-sm font-semibold truncate ${isSelected ? "text-purple-200" : "text-foreground"}`}
        >
          {voice.name}
        </p>
        <p className="text-xs text-slate-600 font-mono truncate">{shortId}</p>
        {personality && (
          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white/5 text-slate-400 border border-white/8 truncate max-w-full">
            {personality}
          </span>
        )}
        {assignedNiches.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {assignedNiches.map((n) => {
              const niche = NICHES.find((nn) => nn.id === n);
              return (
                <span
                  key={n}
                  className="inline-block px-1.5 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                >
                  {niche?.emoji ?? ""} {niche?.label ?? n}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        data-ocid={`voice_manager.preview_button.${voice.voice_id.slice(0, 8)}`}
        onClick={handlePreview}
        disabled={previewing}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center ${
          isSelected
            ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30"
            : "bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-white/20"
        } disabled:opacity-60`}
      >
        {previewing ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Play size={11} />
        )}
        {previewing ? "Playing…" : "Play Preview"}
      </button>
    </button>
  );
}

// ── Niche assignment row ───────────────────────────────────────────────────────

interface NicheAssignRowProps {
  nicheId: string;
  nicheLabel: string;
  nicheEmoji: string;
  voices: ElevenLabsVoice[];
  assignedVoiceId: string | undefined;
  assignmentError: string | null;
  onAssign: (voiceId: string, voiceName: string) => void;
  onTestVoice: (nicheId: string) => void;
  assigning: boolean;
  testing: boolean;
  justAssigned: boolean;
  assignedVoiceName: string | undefined;
}

function NicheAssignRow({
  nicheId,
  nicheLabel,
  nicheEmoji,
  voices,
  assignedVoiceId,
  assignmentError,
  onAssign,
  onTestVoice,
  assigning,
  testing,
  justAssigned,
  assignedVoiceName,
}: NicheAssignRowProps) {
  const assignedVoice = voices.find((v) => v.voice_id === assignedVoiceId);

  return (
    <div className="border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3 py-2.5">
        <span className="text-base shrink-0 w-7 text-center">{nicheEmoji}</span>
        <span className="text-sm text-foreground font-medium min-w-0 flex-1 truncate">
          {nicheLabel}
        </span>

        {/* Test voice button */}
        {assignedVoiceId && (
          <button
            type="button"
            data-ocid={`voice_manager.test_voice_button.${nicheId}`}
            onClick={() => onTestVoice(nicheId)}
            disabled={testing}
            title={`Test ${assignedVoiceName ?? "assigned"} voice for ${nicheLabel}`}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 border border-white/8 hover:border-purple-500/30 transition-all shrink-0 disabled:opacity-50"
          >
            {testing ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Zap size={10} />
            )}
            Test
          </button>
        )}

        <div className="relative shrink-0">
          <select
            data-ocid={`voice_manager.niche_select.${nicheId}`}
            value={assignedVoiceId ?? ""}
            onChange={(e) => {
              const v = voices.find((vv) => vv.voice_id === e.target.value);
              if (v) onAssign(v.voice_id, v.name);
            }}
            disabled={assigning || voices.length === 0}
            className="appearance-none bg-black/40 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/40 disabled:opacity-50 min-w-[160px] cursor-pointer hover:border-white/20 transition-colors"
            aria-label={`Select voice for ${nicheLabel}`}
          >
            <option value="">— Choose voice —</option>
            {voices.map((v) => (
              <option key={v.voice_id} value={v.voice_id}>
                {v.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
        </div>

        {assigning && (
          <Loader2
            size={14}
            className="text-purple-400 animate-spin shrink-0"
          />
        )}
        {!assigning && assignedVoice && !justAssigned && (
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
        )}
        {!assigning && !assignedVoice && !assignmentError && (
          <div className="w-3.5 h-3.5 rounded-full border border-white/15 shrink-0" />
        )}
      </div>

      {/* Assignment confirmation banner */}
      {justAssigned && assignedVoiceName && (
        <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/12 border border-emerald-500/25 text-xs text-emerald-400">
          <CheckCircle2 size={12} />
          <span>
            <span className="font-semibold">{assignedVoiceName}</span> assigned
            to {nicheLabel} — generating audio now…
          </span>
          <Loader2 size={10} className="animate-spin ml-auto" />
        </div>
      )}

      {/* Assignment error */}
      {assignmentError && (
        <p className="mb-2 text-[10px] text-destructive/80 px-1">
          ⚠ {assignmentError}
        </p>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface ElevenLabsVoiceManagerProps {
  apiKey: string;
}

export function ElevenLabsVoiceManager({
  apiKey,
}: ElevenLabsVoiceManagerProps) {
  const isConnected = !!apiKey?.trim();

  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [assigningNiche, setAssigningNiche] = useState<string | null>(null);
  const [testingNiche, setTestingNiche] = useState<string | null>(null);
  const [justAssignedNiche, setJustAssignedNiche] = useState<string | null>(
    null,
  );
  const [quota, setQuota] = useState<QuotaInfo | null>(null);

  const {
    assignments,
    loading: assignmentsLoading,
    assignmentErrors,
    setAssignment,
    getAssignedVoiceId,
    getAssignedVoiceName,
  } = useNicheVoiceAssignments();

  const { generateForNiche } = usePreGenerationEngine();

  // Load voices + quota when apiKey becomes available
  useEffect(() => {
    if (!isConnected) {
      setVoices([]);
      setQuota(null);
      return;
    }
    setLoading(true);
    void Promise.all([
      fetchVoices(apiKey).then((list) => setVoices(list)),
      fetchQuota(apiKey).then((q) => setQuota(q)),
    ]).finally(() => setLoading(false));
  }, [apiKey, isConnected]);

  // Map each voice_id → list of niche IDs it is assigned to
  const voiceNicheMap = useCallback(
    (voiceId: string): string[] =>
      assignments.filter((a) => a.voiceId === voiceId).map((a) => a.nicheId),
    [assignments],
  );

  const handleAssign = useCallback(
    async (nicheId: string, voiceId: string, voiceName: string) => {
      setAssigningNiche(nicheId);
      const success = await setAssignment(nicheId, voiceId, voiceName);
      setAssigningNiche(null);

      if (success) {
        // Show confirmation banner
        setJustAssignedNiche(nicheId);
        // Auto-trigger pre-generation
        void generateForNiche(nicheId).then(() => {
          setJustAssignedNiche((prev) => (prev === nicheId ? null : prev));
        });
        // Clear banner after 5 seconds max
        setTimeout(() => {
          setJustAssignedNiche((prev) => (prev === nicheId ? null : prev));
        }, 5000);
      }
    },
    [setAssignment, generateForNiche],
  );

  const handleTestVoice = useCallback(
    async (nicheId: string) => {
      if (testingNiche) return;
      const assignedVoiceId = getAssignedVoiceId(nicheId);
      if (!assignedVoiceId || !apiKey) return;

      setTestingNiche(nicheId);

      // Get the niche greeting script
      const script =
        NICHE_VOICE_SCRIPTS[nicheId] ?? NICHE_VOICE_SCRIPTS.plumber;
      const greetingText = script
        ? script.agentGreeting.replace(/\{\{businessName\}\}/g, "Your Business")
        : "Hello, thank you for calling.";

      // Generate a preview using the assigned voice
      const buf = await generateAudio(
        apiKey,
        assignedVoiceId,
        greetingText.slice(0, 120),
      );
      if (buf) {
        try {
          const blob = new Blob([buf], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.onended = () => {
            URL.revokeObjectURL(url);
            setTestingNiche(null);
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            setTestingNiche(null);
          };
          await audio.play();
          return;
        } catch {
          // fall through
        }
      }
      setTestingNiche(null);
    },
    [testingNiche, getAssignedVoiceId, apiKey],
  );

  // ── Disconnected state ─────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div
        className="rounded-xl border border-white/8 bg-white/2 p-6 flex flex-col items-center gap-3 text-center"
        data-ocid="voice_manager.disconnected_state"
      >
        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
          <Volume2 size={24} className="text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-400">
            Voice Manager Locked
          </p>
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
            Connect your ElevenLabs API key in the section above to unlock Voice
            Manager and assign premium voices to each demo niche.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading || assignmentsLoading) {
    return (
      <div
        className="rounded-xl border border-white/8 bg-white/2 p-6 flex items-center gap-3"
        data-ocid="voice_manager.loading_state"
      >
        <Loader2 size={16} className="text-purple-400 animate-spin shrink-0" />
        <p className="text-sm text-slate-400">
          Fetching voices from your ElevenLabs account…
        </p>
      </div>
    );
  }

  const selectedVoice = voices.find((v) => v.voice_id === selectedVoiceId);
  const assignedCount = NICHES.filter((n) => !!getAssignedVoiceId(n.id)).length;
  const quotaPct = quota
    ? Math.round((quota.characterCount / quota.characterLimit) * 100)
    : null;

  return (
    <div
      className="rounded-xl border border-sky-500/20 bg-sky-500/5 overflow-hidden"
      data-ocid="voice_manager.panel"
    >
      {/* Panel header */}
      <div className="flex items-center gap-3 p-5 border-b border-white/6 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-sky-600/30 border border-purple-500/30 flex items-center justify-center shrink-0">
          <Mic size={18} className="text-purple-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-foreground">
              ElevenLabs Voice Manager
            </h3>
            {voices.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/25">
                <Sparkles size={9} />
                {voices.length} voice{voices.length !== 1 ? "s" : ""} available
              </span>
            )}
            {assignedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <CheckCircle2 size={9} />
                {assignedCount}/{NICHES.length} niches assigned
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign a voice to each demo niche — voices are fetched live from
            your ElevenLabs account
          </p>
        </div>

        {/* Quota pill */}
        {quota !== null && quotaPct !== null && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-black/20"
            data-ocid="voice_manager.quota_display"
          >
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-sky-500 transition-all"
                style={{ width: `${Math.min(quotaPct, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 whitespace-nowrap">
              {quota.characterCount.toLocaleString()} /{" "}
              {quota.characterLimit.toLocaleString()} chars
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-6">
        {/* Voice grid */}
        {voices.length > 0 ? (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Available Voices — click to select, then assign to a niche below
            </h4>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              data-ocid="voice_manager.voice_grid"
            >
              {voices.map((voice) => (
                <VoiceCard
                  key={voice.voice_id}
                  voice={voice}
                  isSelected={selectedVoiceId === voice.voice_id}
                  assignedNiches={voiceNicheMap(voice.voice_id)}
                  apiKey={apiKey}
                  onSelect={(v) =>
                    setSelectedVoiceId((prev) =>
                      prev === v.voice_id ? null : v.voice_id,
                    )
                  }
                />
              ))}
            </div>
            {selectedVoice && (
              <p className="text-xs text-purple-300 mt-3 flex items-center gap-1.5">
                <CheckCircle2 size={11} />
                <span className="font-semibold">{selectedVoice.name}</span>{" "}
                selected — assign it to a niche using the dropdown below
              </p>
            )}
          </div>
        ) : (
          <div
            className="rounded-lg bg-white/3 border border-white/8 p-5 text-center"
            data-ocid="voice_manager.empty_state"
          >
            <Mic size={22} className="text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              No voices found in your ElevenLabs account
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Sign in to elevenlabs.io and add voices, then refresh.
            </p>
          </div>
        )}

        {/* Niche assignments */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Niche Voice Assignments
          </h4>
          <div
            className="rounded-xl border border-white/8 bg-black/20 px-4 py-1"
            data-ocid="voice_manager.niche_list"
          >
            {NICHES.map((niche) => (
              <NicheAssignRow
                key={niche.id}
                nicheId={niche.id}
                nicheLabel={niche.label}
                nicheEmoji={niche.emoji}
                voices={voices}
                assignedVoiceId={getAssignedVoiceId(niche.id)}
                assignedVoiceName={getAssignedVoiceName(niche.id)}
                assignmentError={assignmentErrors[niche.id] ?? null}
                onAssign={(voiceId, voiceName) =>
                  void handleAssign(niche.id, voiceId, voiceName)
                }
                onTestVoice={handleTestVoice}
                assigning={assigningNiche === niche.id}
                testing={testingNiche === niche.id}
                justAssigned={justAssignedNiche === niche.id}
              />
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Assignments save to backend storage and auto-generate audio. Use the
            Test button to hear the assigned voice say the niche greeting.
          </p>
        </div>

        {/* Quick-assign helper when a voice is selected */}
        {selectedVoice && (
          <div className="rounded-xl border border-purple-500/25 bg-purple-500/8 p-4">
            <p className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
              <Mic size={12} />
              Quick-assign{" "}
              <span className="text-purple-200">{selectedVoice.name}</span> to
              all unassigned niches
            </p>
            <button
              type="button"
              data-ocid="voice_manager.quick_assign_button"
              onClick={async () => {
                const unassigned = NICHES.filter(
                  (n) => !getAssignedVoiceId(n.id),
                );
                for (const n of unassigned) {
                  await handleAssign(
                    n.id,
                    selectedVoice.voice_id,
                    selectedVoice.name,
                  );
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600/80 hover:bg-purple-600 text-white transition-colors border border-purple-500/40"
            >
              <Sparkles size={11} />
              Assign to all unassigned niches
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
