import type { CollectionName } from "@/types/ragBrain";

const COLLECTION_COLORS: Record<CollectionName, string> = {
  SalesScripts: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  FundingPlaybooks: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  NicheTemplates: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  ClientContracts: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  CallTranscripts: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  ReviewResponses: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  OnboardingGuides: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  CompetitorIntel: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  PricingGuides: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  ObjectionHandlers: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  CaseStudies: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  EmailSequences: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  SocialContent: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
  SopLibrary: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  Custom: "bg-muted text-muted-foreground border-border",
};

interface CollectionBadgeProps {
  name: CollectionName;
  className?: string;
}

export function CollectionBadge({
  name,
  className = "",
}: CollectionBadgeProps) {
  const colors = COLLECTION_COLORS[name];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        colors
      } ${className}`}
    >
      {name.replace(/([A-Z])/g, " $1").trim()}
    </span>
  );
}
