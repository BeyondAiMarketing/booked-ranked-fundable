import { useEffect, useState } from "react";
import type { LeadAIScore } from "../backend.d";
import { useActor } from "../hooks/useActor";

interface Props {
  leadId: string;
}

function scoreColor(score: number): { ring: string; bg: string; text: string } {
  if (score >= 71)
    return {
      ring: "ring-emerald-500",
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
    };
  if (score >= 41)
    return {
      ring: "ring-amber-500",
      bg: "bg-amber-500/20",
      text: "text-amber-400",
    };
  if (score > 0)
    return {
      ring: "ring-rose-500",
      bg: "bg-rose-500/20",
      text: "text-rose-400",
    };
  return { ring: "ring-slate-600", bg: "bg-slate-800", text: "text-slate-400" };
}

export default function LeadAIBadge({ leadId }: Props) {
  const { actor } = useActor();
  const [scoreData, setScoreData] = useState<LeadAIScore | null>(null);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (!actor || !leadId) return;
    (actor.getLeadScore(leadId) as Promise<[LeadAIScore] | []>)
      .then((res) => {
        if (res && res.length > 0 && res[0] !== undefined) setScoreData(res[0]);
      })
      .catch(() => {});
  }, [actor, leadId]);

  const numeric = scoreData ? Number(scoreData.score) : 0;
  const colors = scoreColor(numeric);
  const label = scoreData ? numeric.toString() : "?";
  const sublabel = scoreData ? "Owl" : "Score";
  const tip = scoreData?.fitReason ?? "No AI score yet";

  return (
    <span
      className="relative inline-flex items-center gap-1 cursor-default"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      data-ocid={`lead-ai-badge-${leadId}`}
    >
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full ring-1 text-[9px] font-bold ${colors.ring} ${colors.bg} ${colors.text}`}
      >
        {label}
      </span>
      <span className="text-[10px] font-medium text-slate-400 leading-none">
        {sublabel}
      </span>
      {showTip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 w-48 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] text-slate-300 shadow-xl pointer-events-none text-center">
          {tip}
        </span>
      )}
    </span>
  );
}
