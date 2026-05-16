import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Globe,
  Lightbulb,
  Minus,
  RefreshCw,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect } from "react";
import type { TenantEntry } from "../context/AppContext";
import { useApp } from "../context/AppContext";
import type {
  ClientHealthScore,
  HealthScoreComponent,
} from "../types/healthScore";
import {
  getHealthArcColor,
  getHealthBgColor,
  getHealthColor,
  getStatusLabel,
} from "../types/healthScore";
import { Button } from "./ui/button";

interface Props {
  score: ClientHealthScore;
  tenant: TenantEntry;
  onClose: () => void;
}

const FACTOR_ICONS: Record<HealthScoreComponent["factor"], React.ReactNode> = {
  leads: <Users size={15} className="text-blue-400" />,
  reputation: <Star size={15} className="text-amber-400" />,
  agents: <Bot size={15} className="text-purple-400" />,
  website: <Globe size={15} className="text-emerald-400" />,
};

const FACTOR_LINKS: Record<HealthScoreComponent["factor"], string> = {
  leads: "/leads",
  reputation: "/reviews",
  agents: "/agent-services",
  website: "/audit",
};

function MiniRing({ score }: { score: number }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg
      width="60"
      height="60"
      className="-rotate-90 shrink-0"
      role="img"
      aria-label={`Score: ${score} out of 100`}
    >
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="5"
      />
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke={getHealthArcColor(score)}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function ProgressBar({
  score,
  status,
}: { score: number; status: HealthScoreComponent["status"] }) {
  const colors = {
    good: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
  };
  return (
    <div className="h-1.5 rounded-full bg-white/8 overflow-hidden flex-1">
      <div
        className={`h-full rounded-full ${colors[status]} transition-all duration-700`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HealthScoreDetailPanel({
  score,
  tenant,
  onClose,
}: Props) {
  const { refreshHealthScore } = useApp();
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const statusBadgeColors = {
    good: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    critical: "bg-red-500/20 text-red-300 border border-red-500/30",
  };

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close panel"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm border-0 cursor-default w-full h-full"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        data-ocid="health-dashboard.detail_panel"
        className="fixed right-0 top-0 h-full w-full sm:w-[560px] z-50 flex flex-col bg-gray-900 border-l border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <MiniRing score={score.overallScore} />
              <span
                className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getHealthColor(score.overallScore)}`}
                style={{ transform: "rotate(90deg)" }}
              >
                {score.overallScore}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white text-base leading-tight">
                {tenant.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-medium ${getHealthColor(score.overallScore)}`}
                >
                  {getStatusLabel(score.overallScore)}
                </span>
                {score.trend === "improving" ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400">
                    <TrendingUp size={10} /> Improving
                  </span>
                ) : score.trend === "declining" ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-red-400">
                    <TrendingDown size={10} /> Declining
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400">
                    <Minus size={10} /> Stable
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            data-ocid="health-dashboard.detail_panel.close_button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Score Breakdown */}
          <section>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-indigo-500" />
              Score Breakdown
            </h3>
            <div className="space-y-3">
              {score.components.map((comp) => (
                <div
                  key={comp.factor}
                  className="rounded-xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {FACTOR_ICONS[comp.factor]}
                      <span className="text-sm font-medium text-white">
                        {comp.displayLabel}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {comp.weight}% weight
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {comp.rawScore}/100
                      </span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${statusBadgeColors[comp.status]}`}
                      >
                        {comp.status}
                      </span>
                    </div>
                  </div>
                  <ProgressBar score={comp.rawScore} status={comp.status} />
                </div>
              ))}
            </div>
          </section>

          {/* AI Recommendations */}
          <section>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-amber-500" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {score.recommendations.map((rec, i) => {
                const lowestFactor =
                  [...score.components].sort((a, b) => a.rawScore - b.rawScore)[
                    i % score.components.length
                  ]?.factor ?? "leads";
                const linkTo = FACTOR_LINKS[lowestFactor] ?? "/dashboard";
                return (
                  <div
                    key={rec}
                    className="rounded-xl border-l-4 border-indigo-500 border border-white/8 bg-white/[0.03] p-4 flex items-start gap-3"
                  >
                    <Lightbulb
                      size={15}
                      className="text-amber-400 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {rec}
                      </p>
                      <button
                        type="button"
                        data-ocid={`health-dashboard.rec_action.${i + 1}`}
                        className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                        onClick={() => navigate({ to: linkTo as never })}
                      >
                        Take Action <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Benchmarks */}
          <section>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-purple-500" />
              Score Benchmarks
            </h3>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm text-gray-400">
              Average for{" "}
              <span className="text-white font-medium">{tenant.type}</span>{" "}
              clients: <span className="text-amber-400 font-semibold">68</span>
              {score.overallScore > 68 ? (
                <span className="ml-2 text-emerald-400 text-xs">
                  ↑ {score.overallScore - 68} pts above average
                </span>
              ) : score.overallScore < 68 ? (
                <span className="ml-2 text-red-400 text-xs">
                  ↓ {68 - score.overallScore} pts below average
                </span>
              ) : (
                <span className="ml-2 text-gray-400 text-xs">≈ at average</span>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-500">
            Last updated: {timeAgo(score.lastUpdated)}
          </span>
          <Button
            data-ocid="health-dashboard.refresh_score.button"
            size="sm"
            onClick={() => refreshHealthScore(score.tenantId)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <RefreshCw size={13} className="mr-1.5" />
            Refresh Score
          </Button>
        </div>
      </div>
    </>
  );
}
