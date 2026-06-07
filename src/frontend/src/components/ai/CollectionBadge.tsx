import type { CollectionName } from "@/types/ragBrain";

// ── Color map ─────────────────────────────────────────────────────────────────

const COLLECTION_COLORS: Record<
  CollectionName,
  { bg: string; text: string; dot: string }
> = {
  SalesScripts: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  FundingPlaybooks: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
  },
  NicheTemplates: {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    dot: "bg-sky-400",
  },
  ClientContracts: {
    bg: "bg-violet-500/15",
    text: "text-violet-300",
    dot: "bg-violet-400",
  },
  CallTranscripts: {
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    dot: "bg-orange-400",
  },
  ReviewResponses: {
    bg: "bg-pink-500/15",
    text: "text-pink-300",
    dot: "bg-pink-400",
  },
  OnboardingGuides: {
    bg: "bg-teal-500/15",
    text: "text-teal-300",
    dot: "bg-teal-400",
  },
  CompetitorIntel: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    dot: "bg-red-400",
  },
  PricingGuides: {
    bg: "bg-lime-500/15",
    text: "text-lime-300",
    dot: "bg-lime-400",
  },
  ObjectionHandlers: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
  CaseStudies: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    dot: "bg-cyan-400",
  },
  EmailSequences: {
    bg: "bg-indigo-500/15",
    text: "text-indigo-300",
    dot: "bg-indigo-400",
  },
  SocialContent: {
    bg: "bg-fuchsia-500/15",
    text: "text-fuchsia-300",
    dot: "bg-fuchsia-400",
  },
  SopLibrary: {
    bg: "bg-slate-500/15",
    text: "text-slate-300",
    dot: "bg-slate-400",
  },
  Custom: {
    bg: "bg-white/10",
    text: "text-foreground/70",
    dot: "bg-foreground/40",
  },
};

function humanize(name: CollectionName): string {
  return name.replace(/([A-Z])/g, " $1").trim();
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CollectionBadgeProps {
  collection: CollectionName;
  showDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function CollectionBadge({
  collection,
  showDot = true,
  size = "sm",
  className = "",
}: CollectionBadgeProps) {
  const colors = COLLECTION_COLORS[collection] ?? COLLECTION_COLORS.Custom;
  const sizeClasses =
    size === "md"
      ? "px-2.5 py-1 text-xs rounded-lg"
      : "px-2 py-0.5 text-[11px] rounded-md";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border border-transparent
        ${colors.bg} ${colors.text} ${sizeClasses} ${className}`}
      data-ocid={`collection_badge.${collection.toLowerCase()}`}
      title={humanize(collection)}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
      )}
      {humanize(collection)}
    </span>
  );
}
