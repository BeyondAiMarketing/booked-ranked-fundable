import { BookOpen, ChevronRight, Sparkles, TrendingUp, X } from "lucide-react";
import { useMemo } from "react";
import type { ClientWebsiteConfig } from "../data/nicheWebsiteData";
import type {
  AuditScore,
  ProactiveSuggestion,
  WebsiteAgentSettings,
} from "../lib/websiteAgentEngine";
import {
  generateProactiveSuggestions,
  loadAgentSettings,
} from "../lib/websiteAgentEngine";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// ── Framework color helpers ───────────────────────────────────────────────────

const FRAMEWORK_COLORS: Record<string, string> = {
  Kennedy: "bg-red-900/30 text-red-300 border-red-700/30",
  Hormozi: "bg-orange-900/30 text-orange-300 border-orange-700/30",
  Ogilvy: "bg-indigo-900/30 text-indigo-300 border-indigo-700/30",
  Abraham: "bg-teal-900/30 text-teal-300 border-teal-700/30",
  Hopkins: "bg-blue-900/30 text-blue-300 border-blue-700/30",
  Halbert: "bg-yellow-900/30 text-yellow-300 border-yellow-700/30",
  Schwartz: "bg-purple-900/30 text-purple-300 border-purple-700/30",
  Deiss: "bg-cyan-900/30 text-cyan-300 border-cyan-700/30",
  Sugarman: "bg-pink-900/30 text-pink-300 border-pink-700/30",
  Suby: "bg-violet-900/30 text-violet-300 border-violet-700/30",
};

function frameworkColor(framework: string): string {
  for (const [key, cls] of Object.entries(FRAMEWORK_COLORS)) {
    if (framework.includes(key)) return cls;
  }
  return "bg-slate-800 text-slate-300 border-slate-700/30";
}

const PRIORITY_DOT: Record<"high" | "medium" | "low", string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-slate-500",
};
const PRIORITY_LABEL: Record<"high" | "medium" | "low", string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

// ── Full suggestion card ──────────────────────────────────────────────────────

function FullSuggestionCard({
  suggestion,
  index,
  onApply,
}: {
  suggestion: ProactiveSuggestion;
  index: number;
  onApply: (s: ProactiveSuggestion) => void;
}) {
  return (
    <div
      className="bg-gray-900/60 border border-white/8 rounded-xl p-4 hover:border-violet-700/40 transition-all"
      data-ocid={`smart_recommendations_drawer.item.${index + 1}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`w-2 h-2 rounded-full mt-1 shrink-0 ${PRIORITY_DOT[suggestion.priority_level]}`}
          />
          <span className="text-sm font-semibold text-white capitalize">
            {suggestion.sectionId.replace(/_/g, " ")}
          </span>
          <Badge
            className={`text-[9px] border px-1.5 py-0.5 ${frameworkColor(suggestion.frameworkRecommended)}`}
          >
            {suggestion.framework}
          </Badge>
          <Badge className="text-[9px] bg-white/5 text-slate-400 border-white/10">
            {PRIORITY_LABEL[suggestion.priority_level]} priority
          </Badge>
        </div>
        <Button
          size="sm"
          className="bg-violet-700 hover:bg-violet-600 text-white text-xs h-7 px-3 shrink-0"
          onClick={() => onApply(suggestion)}
          data-ocid={`smart_recommendations_drawer.apply_button.${index + 1}`}
        >
          Apply
          <ChevronRight size={11} className="ml-1" />
        </Button>
      </div>

      {/* Issue */}
      <p className="text-xs text-slate-300 mb-1.5">
        {suggestion.issueDescription}
      </p>

      {/* Suggested action */}
      <div className="bg-white/3 border border-white/8 rounded-lg p-2.5 mb-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
          Suggested Action
        </p>
        <p className="text-xs text-white">{suggestion.suggestedAction}</p>
      </div>

      {/* Estimated impact */}
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
        <TrendingUp size={11} />
        <span>{suggestion.estimatedImpact}</span>
      </div>

      {/* Framework detail */}
      <div className="mt-2 flex items-center gap-1.5">
        <BookOpen size={10} className="text-slate-500 shrink-0" />
        <span className="text-[10px] text-slate-500">
          Framework:{" "}
          <span className="text-slate-400">
            {suggestion.frameworkRecommended}
          </span>
        </span>
      </div>
    </div>
  );
}

// ── Drawer component ──────────────────────────────────────────────────────────

interface SmartRecommendationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClientWebsiteConfig;
  niche: string;
  auditScore?: AuditScore | null;
  onApply: (suggestion: ProactiveSuggestion) => void;
}

export default function SmartRecommendationsDrawer({
  isOpen,
  onClose,
  config,
  niche,
  auditScore = null,
  onApply,
}: SmartRecommendationsDrawerProps) {
  const settings: WebsiteAgentSettings = useMemo(
    () => loadAgentSettings(config.tenantId),
    [config.tenantId],
  );

  // Generate all suggestions (not just top 3)
  const allSuggestions: ProactiveSuggestion[] = useMemo(() => {
    // Generate with all low-score scenarios to get more suggestions
    const base = generateProactiveSuggestions(
      config,
      auditScore ?? null,
      settings,
    );
    // Pad if needed with general suggestions for all issue types
    const padded = [...base];
    if (padded.length < 5) {
      const lowAudit: AuditScore = {
        ctaScore: 50,
        trustScore: 50,
        seoBasics: 50,
        conversionScore: 50,
        offerClarity: 50,
      };
      const extra = generateProactiveSuggestions(config, lowAudit, settings);
      for (const s of extra) {
        if (!padded.some((p) => p.issueType === s.issueType)) {
          padded.push(s);
        }
        if (padded.length >= 6) break;
      }
    }
    return padded.sort((a, b) => a.priority - b.priority);
  }, [config, auditScore, settings]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      data-ocid="smart_recommendations_drawer.dialog"
    >
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close drawer"
      />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-lg h-full flex flex-col bg-gray-950 border-l border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-gray-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-900/60 border border-violet-700/40 flex items-center justify-center">
              <Sparkles size={15} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                All Recommendations
              </h2>
              <p className="text-[10px] text-slate-500 capitalize">
                {niche} · {allSuggestions.length} suggestions · sorted by
                priority
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            data-ocid="smart_recommendations_drawer.close_button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Score summary bar */}
        {auditScore && (
          <div className="px-5 py-3 border-b border-white/8 flex items-center gap-4 bg-gray-900/40">
            {[
              {
                label: "CTA",
                val: auditScore.ctaScore ?? 70,
                color: "text-red-400",
              },
              {
                label: "Trust",
                val: auditScore.trustScore ?? 70,
                color: "text-amber-400",
              },
              {
                label: "SEO",
                val: auditScore.seoBasics ?? 70,
                color: "text-blue-400",
              },
              {
                label: "Conv",
                val: auditScore.conversionScore ?? 70,
                color: "text-emerald-400",
              },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-sm font-bold ${s.color}`}>{s.val}</p>
                <p className="text-[9px] text-slate-500">{s.label}</p>
              </div>
            ))}
            <p className="text-[10px] text-slate-500 ml-auto">
              Scores drive recommendation priority
            </p>
          </div>
        )}

        {/* Suggestion list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {allSuggestions.length === 0 ? (
            <div
              className="text-center py-12 text-slate-500 text-sm"
              data-ocid="smart_recommendations_drawer.empty_state"
            >
              <Sparkles
                size={28}
                className="mx-auto mb-3 text-slate-600 opacity-50"
              />
              <p>No recommendations at this time.</p>
              <p className="text-xs mt-1 text-slate-600">
                Your website is well-optimized!
              </p>
            </div>
          ) : (
            allSuggestions.map((s, i) => (
              <FullSuggestionCard
                key={s.id}
                suggestion={s}
                index={i}
                onApply={(suggestion) => {
                  onApply(suggestion);
                  onClose();
                }}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/8 bg-gray-900/60">
          <p className="text-[10px] text-slate-500 text-center">
            Recommendations powered by 10 direct response frameworks · Hormozi ·
            Kennedy · Ogilvy · Halbert · Schwartz · Abraham · Sugarman · Hopkins
            · Deiss · Suby
          </p>
        </div>
      </div>
    </div>
  );
}
