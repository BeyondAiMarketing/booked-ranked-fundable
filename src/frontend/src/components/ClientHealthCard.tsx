import { ArrowRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { TenantEntry } from "../context/AppContext";
import type { ClientHealthScore } from "../types/healthScore";
import {
  getHealthArcColor,
  getHealthBgColor,
  getHealthColor,
  getStatusLabel,
} from "../types/healthScore";

interface Props {
  score: ClientHealthScore;
  tenant: TenantEntry;
  index: number;
  onViewDetails: () => void;
}

function ScoreRing({ value }: { value: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = getHealthArcColor(value);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width="100"
        height="100"
        className="-rotate-90"
        role="img"
        aria-label={`Health score ${value} out of 100`}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${getHealthColor(value)}`}>
          {value}
        </span>
        <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider">
          /100
        </span>
      </div>
    </div>
  );
}

function TrendBadge({ trend }: { trend: ClientHealthScore["trend"] }) {
  if (trend === "improving") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
        <TrendingUp size={9} /> Improving
      </span>
    );
  }
  if (trend === "declining") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-red-500/15 text-red-400 border border-red-500/25 px-2 py-0.5 rounded-full">
        <TrendingDown size={9} /> Declining
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-500/15 text-gray-400 border border-gray-500/25 px-2 py-0.5 rounded-full">
      <Minus size={9} /> Stable
    </span>
  );
}

function SubScorePill({ label, value }: { label: string; value: number }) {
  return (
    <span
      className={`inline-flex flex-col items-center text-[9px] font-semibold px-2 py-1 rounded-lg border ${getHealthBgColor(value)}`}
    >
      <span className="text-[11px] font-bold">{value}</span>
      <span className="opacity-80">{label}</span>
    </span>
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

export default function ClientHealthCard({
  score,
  tenant,
  index,
  onViewDetails,
}: Props) {
  return (
    <div
      data-ocid={`health-dashboard.client_card.${index}`}
      className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4 hover:border-white/20 transition-colors"
    >
      {/* Top: tenant name + niche */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-white text-sm leading-tight truncate">
            {tenant.name}
          </p>
          <span className="inline-block mt-1 text-[10px] bg-indigo-600/20 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded-full font-medium">
            {tenant.type}
          </span>
        </div>
        <TrendBadge trend={score.trend} />
      </div>

      {/* Center: Score Ring */}
      <div className="flex flex-col items-center gap-1">
        <ScoreRing value={score.overallScore} />
        <span
          className={`text-xs font-semibold ${getHealthColor(score.overallScore)}`}
        >
          {getStatusLabel(score.overallScore)}
        </span>
      </div>

      {/* Sub-scores row */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <SubScorePill label="Leads" value={score.leadsScore} />
        <SubScorePill label="Rep." value={score.reputationScore} />
        <SubScorePill label="Agents" value={score.agentScore} />
        <SubScorePill label="Web" value={score.websiteScore} />
      </div>

      {/* Top recommendation */}
      {score.recommendations.length > 0 && (
        <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
          {score.recommendations[0]}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/8">
        <span className="text-[10px] text-gray-500">
          Updated {timeAgo(score.lastUpdated)}
        </span>
        <button
          type="button"
          data-ocid={`health-dashboard.view_details.${index}`}
          onClick={onViewDetails}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          View Details <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}
