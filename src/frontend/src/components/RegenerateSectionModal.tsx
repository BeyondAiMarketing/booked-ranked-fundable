// ── RegenerateSectionModal ────────────────────────────────────────────────────
// Shows 3 AI-generated copy variants side-by-side for a specific section.
// Each card shows conversion score, framework name, preview text, and an apply button.

import { Brain, Check, RefreshCw, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { SectionType } from "../data/nicheWebsiteData";
import type {
  AuditScore,
  FrameworkName,
  WebsiteAgentVariant,
} from "../lib/websiteAgentEngine";
import { processAgentRequest } from "../lib/websiteAgentEngine";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// ── Framework colors ──────────────────────────────────────────────────────────
const FRAMEWORK_COLORS: Record<
  FrameworkName,
  { bg: string; text: string; border: string }
> = {
  Hormozi: {
    bg: "bg-violet-500/15",
    text: "text-violet-300",
    border: "border-violet-500/30",
  },
  Kennedy: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-500/30",
  },
  Ogilvy: {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  Halbert: {
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    border: "border-orange-500/30",
  },
  Schwartz: {
    bg: "bg-teal-500/15",
    text: "text-teal-300",
    border: "border-teal-500/30",
  },
  Abraham: {
    bg: "bg-green-500/15",
    text: "text-green-300",
    border: "border-green-500/30",
  },
  Sugarman: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-300",
    border: "border-yellow-500/30",
  },
  Hopkins: {
    bg: "bg-pink-500/15",
    text: "text-pink-300",
    border: "border-pink-500/30",
  },
  Deiss: {
    bg: "bg-indigo-500/15",
    text: "text-indigo-300",
    border: "border-indigo-500/30",
  },
  Suby: {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    border: "border-purple-500/30",
  },
};

// ── Extract conversion score from estimatedLift ───────────────────────────────
function extractScore(variant: WebsiteAgentVariant): number {
  const match = variant.estimatedLift?.match(/(\d+)/);
  if (match) {
    const n = Number.parseInt(match[1], 10);
    return Math.min(99, Math.max(60, 65 + n));
  }
  return [82, 89, 91][variant.variantNumber - 1] ?? 85;
}

// ── Score bar visual ──────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color = score >= 88 ? "#22c55e" : score >= 78 ? "#f59e0b" : "#94a3b8";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

// ── Single Variant Card ───────────────────────────────────────────────────────
function VariantCard({
  variant,
  index,
  isApplied,
  onApply,
}: {
  variant: WebsiteAgentVariant;
  index: number;
  isApplied: boolean;
  onApply: (v: WebsiteAgentVariant) => void;
}) {
  const fw = variant.framework as FrameworkName;
  const colors = FRAMEWORK_COLORS[fw] ?? FRAMEWORK_COLORS.Hormozi;
  const score = extractScore(variant);

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border p-5 transition-all duration-200 ${
        isApplied
          ? "border-violet-500/60 bg-violet-500/10 ring-1 ring-violet-500/30"
          : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
      }`}
      data-ocid={`regenerate_modal.variant_card.${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
            <span className="text-[10px] font-black text-violet-300">
              {index + 1}
            </span>
          </div>
          <span className="text-xs font-semibold text-foreground/70 uppercase tracking-widest">
            Variant {index + 1}
          </span>
        </div>
        {isApplied && (
          <Badge className="text-[10px] bg-violet-500/20 text-violet-300 border-violet-500/30">
            <Check size={10} className="mr-1" /> Applied
          </Badge>
        )}
      </div>

      {/* Framework badge */}
      <div className="mb-3">
        <span
          className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border font-semibold ${colors.bg} ${colors.text} ${colors.border}`}
        >
          <Brain size={9} />
          {variant.frameworkUsed}
        </span>
      </div>

      {/* Preview text */}
      <div className="flex-1 mb-3">
        <p className="text-sm font-semibold text-foreground leading-snug mb-2">
          &ldquo;{variant.previewText}&rdquo;
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
          {variant.frameworkPrinciple}
        </p>
      </div>

      {/* Reasoning */}
      <div className="mb-4 p-2.5 rounded-lg bg-white/5 border border-white/8">
        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-4">
          {variant.reasoningExplanation}
        </p>
      </div>

      {/* Conversion score */}
      <div className="mb-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Conversion Fit
          </span>
          <span className="text-[10px] text-muted-foreground">
            {variant.estimatedLift?.slice(0, 45) ?? "High conversion potential"}
          </span>
        </div>
        <ScoreBar score={score} />
      </div>

      {/* Apply button */}
      <Button
        size="sm"
        variant={isApplied ? "outline" : "default"}
        className="w-full text-xs"
        onClick={() => onApply(variant)}
        data-ocid={`regenerate_modal.apply_button.${index + 1}`}
      >
        {isApplied ? (
          <>
            <Check size={12} className="mr-1.5" /> Applied
          </>
        ) : (
          <>
            <Zap size={12} className="mr-1.5" /> Apply This Variant
          </>
        )}
      </Button>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface RegenerateSectionModalProps {
  isOpen: boolean;
  sectionId: string;
  sectionType: SectionType;
  currentContent: Record<string, string>;
  niche: string;
  clientId: string;
  auditScore?: AuditScore | null;
  onApply: (sectionId: string, content: Record<string, string>) => void;
  onClose: () => void;
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function RegenerateSectionModal({
  isOpen,
  sectionId,
  sectionType,
  currentContent,
  niche,
  clientId,
  auditScore,
  onApply,
  onClose,
}: RegenerateSectionModalProps) {
  const [variants, setVariants] = useState<WebsiteAgentVariant[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedVariantId, setAppliedVariantId] = useState<string | null>(null);

  // Generate variants when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setAppliedVariantId(null);
    setIsGenerating(true);

    // Brief delay for UX effect
    const timer = setTimeout(() => {
      const response = processAgentRequest(
        `regenerate ${sectionType} section`,
        {
          tenantId: clientId,
          websiteId: "",
          isPublished: false,
          editingLocked: false,
          customizations: { sectionOverrides: {}, hiddenSections: [] },
          lastUpdated: "",
        },
        auditScore ?? null,
        niche,
        clientId,
      );
      setVariants(response.variants ?? []);
      setIsGenerating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isOpen, sectionType, niche, clientId, auditScore]);

  const handleApply = (variant: WebsiteAgentVariant) => {
    setAppliedVariantId(variant.id);
    onApply(sectionId, variant.fullContent ?? variant.content);
  };

  const handleRegenerate = () => {
    setAppliedVariantId(null);
    setIsGenerating(true);
    setTimeout(() => {
      const response = processAgentRequest(
        `regenerate ${sectionType} fresh variants`,
        {
          tenantId: clientId,
          websiteId: "",
          isPublished: false,
          editingLocked: false,
          customizations: { sectionOverrides: {}, hiddenSections: [] },
          lastUpdated: "",
        },
        auditScore ?? null,
        niche,
        clientId,
      );
      setVariants(response.variants ?? []);
      setIsGenerating(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="regenerate_modal.dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-card shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/8 bg-card/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Regenerate Section
              </h2>
              <p className="text-xs text-muted-foreground capitalize">
                {sectionType.replace(/_/g, " ")} — 3 framework-driven variants
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="text-xs"
              data-ocid="regenerate_modal.regenerate_button"
            >
              <RefreshCw
                size={12}
                className={`mr-1.5 ${isGenerating ? "animate-spin" : ""}`}
              />
              Regenerate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground"
              data-ocid="regenerate_modal.close_button"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isGenerating ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl border border-white/8 bg-white/4 animate-pulse"
                  data-ocid={`regenerate_modal.loading_state.${i}`}
                />
              ))}
            </div>
          ) : variants.length === 0 ? (
            <div
              className="text-center py-12"
              data-ocid="regenerate_modal.error_state"
            >
              <p className="text-muted-foreground text-sm">
                No variants generated. Try regenerating.
              </p>
              <Button
                onClick={handleRegenerate}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <RefreshCw size={12} className="mr-1.5" /> Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Info bar */}
              <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-violet-500/8 border border-violet-500/15">
                <Brain size={14} className="text-violet-400 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Each variant is generated by a different direct response
                  framework. Choose the one that best fits your positioning, or
                  regenerate for fresh options.
                </p>
              </div>

              {/* Variant cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variants.map((variant, idx) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    index={idx}
                    isApplied={appliedVariantId === variant.id}
                    onApply={handleApply}
                  />
                ))}
              </div>

              {/* Current content reference */}
              {(currentContent.headline || currentContent.heading) && (
                <div className="mt-5 p-3 rounded-xl border border-white/8 bg-white/3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    Current Content
                  </p>
                  <p className="text-xs text-foreground/60 italic">
                    &ldquo;{currentContent.headline ?? currentContent.heading}
                    &rdquo;
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between px-6 py-3 border-t border-white/8 bg-card/95 backdrop-blur-sm">
          <p className="text-[10px] text-muted-foreground">
            {appliedVariantId
              ? "✅ Variant applied — close to see the update on your page"
              : "Pick a variant to apply it live to your website"}
          </p>
          <Button
            variant={appliedVariantId ? "default" : "outline"}
            size="sm"
            onClick={onClose}
            className="text-xs"
            data-ocid="regenerate_modal.cancel_button"
          >
            {appliedVariantId ? "Done" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
