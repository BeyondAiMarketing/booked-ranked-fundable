import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// ── Priority styles ───────────────────────────────────────────────────────────

const PRIORITY_META: Record<
  "high" | "medium" | "low",
  { label: string; color: string; dot: string }
> = {
  high: {
    label: "High Priority",
    color: "text-red-400",
    dot: "bg-red-500",
  },
  medium: {
    label: "Medium Priority",
    color: "text-amber-400",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low Priority",
    color: "text-slate-400",
    dot: "bg-slate-500",
  },
};

// ── Framework badge colors ────────────────────────────────────────────────────

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

// ── Single Recommendation Row ─────────────────────────────────────────────────

function RecommendationRow({
  suggestion,
  index,
  onApply,
}: {
  suggestion: ProactiveSuggestion;
  index: number;
  onApply: (s: ProactiveSuggestion) => void;
}) {
  const priority = suggestion.priority_level;
  const meta = PRIORITY_META[priority];

  return (
    <div
      className="group flex items-start gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/15 transition-all duration-150"
      data-ocid={`smart_recommendations.item.${index + 1}`}
    >
      {/* Priority dot */}
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
      </div>

      <div className="flex-1 min-w-0">
        {/* Section + issue type */}
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span className="text-xs font-semibold text-white capitalize">
            {suggestion.sectionId.replace(/_/g, " ")}
          </span>
          <Badge
            className={`text-[9px] border px-1.5 py-0 ${frameworkColor(suggestion.frameworkRecommended)}`}
          >
            {suggestion.framework}
          </Badge>
          <span className={`text-[10px] font-medium ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        {/* Issue description */}
        <p className="text-[11px] text-slate-400 leading-relaxed mb-1">
          {suggestion.issueDescription}
        </p>

        {/* Estimated impact */}
        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
          <TrendingUp size={10} />
          <span>{suggestion.estimatedImpact.slice(0, 60)}</span>
        </div>
      </div>

      {/* Apply button */}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 text-[10px] text-indigo-400 hover:text-white hover:bg-indigo-900/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onApply(suggestion)}
        data-ocid={`smart_recommendations.apply_button.${index + 1}`}
      >
        Apply
        <ChevronRight size={10} className="ml-0.5" />
      </Button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface SmartRecommendationsProps {
  config: ClientWebsiteConfig;
  niche: string;
  auditScore?: AuditScore | null;
  onApply: (suggestion: ProactiveSuggestion) => void;
  onViewAll: () => void;
}

export default function SmartRecommendations({
  config,
  niche,
  auditScore = null,
  onApply,
  onViewAll,
}: SmartRecommendationsProps) {
  const settings: WebsiteAgentSettings = useMemo(
    () => loadAgentSettings(config.tenantId),
    [config.tenantId],
  );

  const suggestions = useMemo(
    () => generateProactiveSuggestions(config, auditScore ?? null, settings),
    [config, auditScore, settings],
  );

  // Show top 3, sorted by priority
  const top3 = suggestions.slice(0, 3);

  if (top3.length === 0) return null;

  const niche_cap = niche.charAt(0).toUpperCase() + niche.slice(1);

  return (
    <Card
      className="border-violet-700/30 bg-violet-950/20"
      data-ocid="smart_recommendations.panel"
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold text-violet-300 flex items-center gap-2">
            <Sparkles size={13} className="text-violet-400" />
            Recommended Improvements
          </CardTitle>
          <Badge className="text-[9px] bg-violet-900/40 text-violet-300 border-violet-700/40">
            {niche_cap}
          </Badge>
        </div>
        <p className="text-[10px] text-slate-500 mt-0.5">
          AI-detected high-impact changes ranked by conversion potential
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-3 pt-0 space-y-2">
        {top3.map((s, i) => (
          <RecommendationRow
            key={s.id}
            suggestion={s}
            index={i}
            onApply={onApply}
          />
        ))}

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-[11px] text-slate-400 hover:text-white border border-white/8 hover:border-white/20"
            onClick={onViewAll}
            data-ocid="smart_recommendations.view_all_button"
          >
            <BookOpen size={11} className="mr-1.5" />
            View All Recommendations
            <ArrowRight size={11} className="ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
