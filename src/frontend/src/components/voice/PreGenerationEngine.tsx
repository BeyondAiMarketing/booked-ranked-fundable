/**
 * PreGenerationEngine.tsx — V2: Per-niche error tracking, timestamps, Regenerate button.
 *
 * Props:
 *   triggerNicheId  — when set, immediately starts generation for that niche.
 *   showGenerateAll — whether to show the "Generate All" button (default: true)
 */

import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useCredentials } from "../../context/CredentialsContext";
import {
  ALL_NICHE_IDS,
  type NicheId,
  usePreGenerationEngine,
} from "../../hooks/usePreGenerationEngine";
import { Button } from "../ui/button";

// ---------------------------------------------------------------------------
// Niche display names
// ---------------------------------------------------------------------------

const NICHE_LABELS: Record<NicheId, string> = {
  plumber: "Plumbing",
  "med-spa": "Med Spa",
  hvac: "HVAC",
  restoration: "Restoration",
  "carpet-cleaning": "Carpet Cleaning",
  roofing: "Roofing",
  "real-estate": "Real Estate",
  mortgage: "Mortgage",
  chiropractor: "Chiropractic",
  dental: "Dental",
};

// ---------------------------------------------------------------------------
// Helper: format relative timestamp
// ---------------------------------------------------------------------------

function formatRelativeTime(ms: number | null): string {
  if (ms === null) return "";
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PreGenerationEngineProps {
  triggerNicheId?: string;
  showGenerateAll?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PreGenerationEngine({
  triggerNicheId,
  showGenerateAll = true,
  className = "",
}: PreGenerationEngineProps) {
  const { creds } = useCredentials();
  const {
    generationStatus,
    progress,
    errorMessages,
    lastGeneratedAt,
    isGenerating,
    generateForNiche,
    generateAll,
  } = usePreGenerationEngine();

  const hasElevenLabs = !!creds?.elevenLabsKey?.trim();

  // Trigger generation for a specific niche when triggerNicheId changes
  const prevTriggerRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      triggerNicheId &&
      triggerNicheId !== prevTriggerRef.current &&
      hasElevenLabs
    ) {
      prevTriggerRef.current = triggerNicheId;
      void generateForNiche(triggerNicheId);
    }
  }, [triggerNicheId, hasElevenLabs, generateForNiche]);

  const completeCount = ALL_NICHE_IDS.filter(
    (id) => generationStatus[id] === "complete",
  ).length;

  return (
    <div
      className={`pre-generation-container rounded-xl border border-border bg-card p-5 ${className}`}
      data-ocid="pre-generation-engine.panel"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Voice Pre-Generation
            {completeCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <CheckCircle2 className="h-3 w-3" />
                {completeCount}/{ALL_NICHE_IDS.length} ready
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {hasElevenLabs
              ? "Generate & cache ElevenLabs audio for instant demo playback"
              : "Connect your ElevenLabs key in Go Live to enable audio generation"}
          </p>
        </div>

        {showGenerateAll && hasElevenLabs && (
          <Button
            variant="outline"
            size="sm"
            disabled={isGenerating}
            onClick={() => void generateAll()}
            data-ocid="pre-generation-engine.generate-all-button"
            className="shrink-0 gap-1.5"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {isGenerating ? "Generating…" : "Generate All Niches"}
          </Button>
        )}
      </div>

      {/* Niche rows */}
      <div className="space-y-2">
        {ALL_NICHE_IDS.map((nicheId) => {
          const status = generationStatus[nicheId] ?? "idle";
          const prog = progress[nicheId] ?? { current: 0, total: 5 };
          const pct =
            prog.total > 0 ? Math.round((prog.current / prog.total) * 100) : 0;
          const errMsg = errorMessages[nicheId];
          const generatedAt = lastGeneratedAt[nicheId];

          return (
            <div key={nicheId} className="space-y-1">
              <div
                className="generation-item flex items-center gap-3"
                data-ocid={`pre-generation-engine.niche-row.${nicheId}`}
              >
                {/* Label — fixed 120px */}
                <span className="w-[120px] shrink-0 truncate text-xs font-medium text-foreground/80">
                  {NICHE_LABELS[nicheId] ?? nicheId}
                </span>

                {/* Progress bar */}
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="generation-progress-fill absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Timestamp */}
                {status === "complete" && generatedAt !== null && (
                  <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-muted-foreground/60 tabular-nums whitespace-nowrap">
                    <Clock className="h-2.5 w-2.5" />
                    {formatRelativeTime(generatedAt)}
                  </span>
                )}

                {/* Status icon */}
                <div className="w-5 shrink-0">
                  {status === "generating" && (
                    <Loader2 className="generation-status-icon loading h-4 w-4 text-primary animate-spin" />
                  )}
                  {status === "complete" && (
                    <CheckCircle2 className="generation-status-icon complete h-4 w-4 text-emerald-400" />
                  )}
                  {status === "error" && (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  {status === "idle" && (
                    <Circle className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </div>

                {/* Per-niche generate / regenerate button */}
                {(status === "idle" || status === "error") && hasElevenLabs && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                    disabled={isGenerating}
                    onClick={() => void generateForNiche(nicheId)}
                    data-ocid={`pre-generation-engine.generate-niche-button.${nicheId}`}
                  >
                    {status === "error" ? (
                      <>
                        <RefreshCw className="h-3 w-3" /> Retry
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                )}

                {/* Regenerate button when complete */}
                {status === "complete" && hasElevenLabs && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground/50 hover:text-muted-foreground gap-1"
                    disabled={isGenerating}
                    onClick={() => void generateForNiche(nicheId)}
                    data-ocid={`pre-generation-engine.regenerate-niche-button.${nicheId}`}
                    title="Regenerate audio for this niche"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Inline error message */}
              {status === "error" && errMsg && (
                <div
                  className="flex items-start gap-1.5 px-1 py-1 rounded text-[10px] text-destructive/80 bg-destructive/5 border border-destructive/15"
                  data-ocid={`pre-generation-engine.error-message.${nicheId}`}
                >
                  <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                  <span className="leading-tight">{errMsg}</span>
                </div>
              )}

              {/* Partial-save warning */}
              {status === "complete" && errMsg && (
                <p className="text-[10px] text-yellow-500/70 px-1">
                  ⚠ {errMsg}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* No ElevenLabs key state */}
      {!hasElevenLabs && (
        <div
          className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-3 text-center"
          data-ocid="pre-generation-engine.no-key-state"
        >
          <p className="text-xs text-muted-foreground">
            Add your ElevenLabs API key in{" "}
            <a
              href="/go-live"
              className="font-medium text-primary hover:underline"
            >
              Go Live
            </a>{" "}
            to generate premium voices.
          </p>
        </div>
      )}
    </div>
  );
}
