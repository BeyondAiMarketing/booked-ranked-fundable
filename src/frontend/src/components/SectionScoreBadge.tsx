// ── SectionScoreBadge ────────────────────────────────────────────────────────
// Displays a color-coded score badge for a website section.
// Clicking opens the WebsiteAgentChatPanel pre-loaded with the fix suggestion.

import { TrendingUp } from "lucide-react";
import {
  type SectionType,
  calculateSectionScore,
} from "../lib/sectionScoreEngine";
import type { AuditScore } from "../lib/websiteAgentEngine";

interface SectionScoreBadgeProps {
  sectionType: SectionType;
  sectionLabel: string;
  auditData: AuditScore | null;
  onOpenAgent: (suggestion: string) => void;
}

const TIER_STYLES = {
  green: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    hover: "hover:bg-emerald-500/25",
  },
  yellow: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    text: "text-amber-400",
    dot: "bg-amber-400",
    hover: "hover:bg-amber-500/25",
  },
  red: {
    bg: "bg-red-500/15",
    border: "border-red-500/40",
    text: "text-red-400",
    dot: "bg-red-400",
    hover: "hover:bg-red-500/25",
  },
};

export default function SectionScoreBadge({
  sectionType,
  sectionLabel,
  auditData,
  onOpenAgent,
}: SectionScoreBadgeProps) {
  const { score, label, suggestion, tier } = calculateSectionScore(
    sectionType,
    auditData,
  );
  const styles = TIER_STYLES[tier];

  return (
    <button
      type="button"
      onClick={() => onOpenAgent(suggestion)}
      title={`${sectionLabel}: ${score}/100 — Click for AI fix suggestion`}
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border
        text-[10px] font-semibold cursor-pointer transition-all duration-150
        ${styles.bg} ${styles.border} ${styles.text} ${styles.hover}
      `}
      data-ocid={`section_score_badge.${sectionType}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`}
      />
      <TrendingUp size={9} className="flex-shrink-0 opacity-70" />
      <span className="font-black">{score}</span>
      <span className="opacity-70 hidden sm:inline">— {label}</span>
    </button>
  );
}
