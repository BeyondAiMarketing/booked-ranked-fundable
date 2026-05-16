// Outreach Scoring Engine — pure TypeScript, no React
// Computes enriched lead scores from audit data using direct-response and offer-driven logic.
// Frameworks: Hormozi value-gap logic, Dan Kennedy urgency scoring, Claude Hopkins specificity,
// Ryan Deiss segmentation, Eugene Schwartz awareness-stage detection.

import type {
  LeadScore,
  LeadStaging,
  OutreachCopySettings,
  WebsiteAudit,
} from "../types/outreach";

// ─── Exported Types ───────────────────────────────────────────────────────────

export type OfferAngle =
  | "visibility_gap" // invisible online — opportunity to be found
  | "conversion_leak" // traffic exists but nothing converts
  | "trust_deficit" // weak reputation or social proof
  | "missed_revenue" // strong business, untapped digital revenue
  | "competitive_threat"; // competitors are beating them in search/ads/visibility

export type RecommendedCTA =
  | "audit_offer" // free website audit / visibility report
  | "quick_win_demo" // show one specific improvement in 15 min
  | "free_strategy_call" // 20-min strategy conversation
  | "benchmark_report" // how they compare to competitors in their market
  | "no_cost_assessment"; // comprehensive no-cost business assessment

export type ScoreTier = "disqualified" | "low" | "medium" | "high" | "priority";

export interface ScoringRationale {
  offer_angle_reason: string; // why this angle was chosen (plain English)
  cta_reason: string; // why this CTA was chosen
  primary_weakness: string; // the single biggest problem found
  primary_opportunity: string; // the single biggest opportunity
  awareness_stage:
    | "cold"
    | "problem_aware"
    | "solution_aware"
    | "product_aware";
  urgency_drivers: string[]; // specific reasons urgency is high/low
  niche_context: string; // niche-specific context note
}

export interface EnrichedLeadScore extends LeadScore {
  urgency_score: number;
  opportunity_size_score: number;
  website_weakness_score: number;
  conversion_weakness_score: number;
  recommended_offer_angle: OfferAngle;
  recommended_cta: RecommendedCTA;
  score_tier: ScoreTier;
  scoring_rationale: ScoringRationale;
  top_audit_signals: string[];
}

// ─── Internal constants ───────────────────────────────────────────────────────

const HIGH_TICKET_NICHES = new Set(["hvac", "restoration", "roofing"]);
const HIGH_LTV_NICHES = new Set(["med_spa", "med spa"]);
const EMERGENCY_NICHES = new Set(["restoration", "hvac"]);

const NICHE_CONTEXT_NOTES: Record<string, string> = {
  plumbing:
    "Every missed call is a $350–$900 job walking to a competitor. Emergency plumbing search intent converts fast — trust and CTA are the deciding factors.",
  hvac: "HVAC businesses that rank before peak season fill their calendar — those that don't scramble. Summer peak is a 90–120 day window.",
  restoration:
    "Restoration is winner-takes-all — whoever ranks and responds first wins the job. Storm season creates predictable demand spikes.",
  roofing:
    "After a hailstorm, homeowners search within 48 hours. Spring storm season and fall pre-winter inspection are the two biggest windows.",
  med_spa:
    "Med spa clients make decisions based on online presence, reviews, and perceived authority. Credibility IS the product.",
  "med spa":
    "Med spa clients make decisions based on online presence, reviews, and perceived authority. Credibility IS the product.",
  carpet_cleaning:
    "The business with the most reviews and the best local rank gets the call. Review velocity drives revenue directly.",
  "carpet cleaning":
    "The business with the most reviews and the best local rank gets the call. Review velocity drives revenue directly.",
};

// ─── Sub-score calculators ────────────────────────────────────────────────────

function deriveServiceFitScore(lead: LeadStaging, audit: WebsiteAudit): number {
  let score = 70;
  if (audit.serviceFitScore > 70) score += 15;
  if (lead.hasWebsite && audit.websiteResolves) score += 10;
  if (lead.reviewCount > 20) score += 5;
  if (lead.isSuppressed) score -= 20;
  if (!lead.hasWebsite) score -= 15;
  return Math.max(0, Math.min(100, score));
}

function deriveWebsiteWeaknessScore(audit: WebsiteAudit): number {
  let score = 100 - audit.qualityScore;
  if (audit.conversionWeaknesses.length > 3) score += 10;
  if (audit.mobileWeaknesses.length > 2) score += 10;
  return Math.max(0, Math.min(100, score));
}

function deriveConversionWeaknessScore(audit: WebsiteAudit): number {
  let score = audit.conversionOpportunityScore;
  if (!audit.contactPagePresent) score += 10;
  if (!audit.ctaPresent) score += 15;
  if (!audit.phoneVisible && !audit.emailVisible) score += 10;
  return Math.max(0, Math.min(100, score));
}

function deriveTrustSignalScore(
  lead: LeadStaging,
  audit: WebsiteAudit,
): number {
  if (!audit.trustElementsPresent) return 20;
  if (lead.reviewCount > 50)
    return Math.min(100, 55 + Math.round(lead.reviewCount / 10));
  if (lead.reviewCount > 20) return 50;
  if (lead.reviewCount > 10) return 40;
  return 25;
}

function deriveSeoBasicsScore(audit: WebsiteAudit): number {
  if (!audit.websiteExists || !audit.websiteResolves) return 10;
  if (!audit.titleMetaPresent) return 25;
  if (audit.homepageAccessible && audit.offerClear) return 65;
  return 45;
}

function deriveUrgencyScore(
  lead: LeadStaging,
  websiteWeaknessScore: number,
  conversionWeaknessScore: number,
  trustSignalScore: number,
  seoBasicsScore: number,
): number {
  let score = 50;
  if (websiteWeaknessScore > 70) score += 20;
  if (conversionWeaknessScore > 75) score += 15;
  if (trustSignalScore < 30) score += 10;
  if (EMERGENCY_NICHES.has(lead.niche.toLowerCase())) score += 10;
  if (seoBasicsScore < 40) score += 5;
  if (lead.avgRating >= 4.5 && lead.reviewCount > 50) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function deriveOpportunitySizeScore(
  lead: LeadStaging,
  audit: WebsiteAudit,
  serviceFitScore: number,
): number {
  let score = 60;
  if (lead.reviewCount > 50) score += 20;
  if (audit.qualityScore > 60 && audit.conversionOpportunityScore > 70)
    score += 15;
  const niche = lead.niche.toLowerCase();
  if (HIGH_TICKET_NICHES.has(niche)) score += 10;
  if (HIGH_LTV_NICHES.has(niche)) score += 10;
  if (serviceFitScore > 80) score += 5;
  if (lead.reviewCount < 5) score -= 15;
  if (audit.qualityScore < 20) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function deriveOutreachPriorityScore(
  serviceFitScore: number,
  opportunitySizeScore: number,
  urgencyScore: number,
  websiteWeaknessScore: number,
  conversionWeaknessScore: number,
  trustSignalScore: number,
): number {
  const raw =
    serviceFitScore * 0.2 +
    opportunitySizeScore * 0.25 +
    urgencyScore * 0.2 +
    websiteWeaknessScore * 0.15 +
    conversionWeaknessScore * 0.15 +
    trustSignalScore * 0.05;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

// ─── Tier and qualification ───────────────────────────────────────────────────

function assignScoreTier(
  priorityScore: number,
  isSuppressed: boolean,
): ScoreTier {
  if (isSuppressed || priorityScore < 40) return "disqualified";
  if (priorityScore >= 85) return "priority";
  if (priorityScore >= 70) return "high";
  if (priorityScore >= 55) return "medium";
  return "low";
}

function tierToQualificationStatus(
  tier: ScoreTier,
): LeadScore["qualificationStatus"] {
  const map: Record<ScoreTier, LeadScore["qualificationStatus"]> = {
    priority: "priority",
    high: "high",
    medium: "medium",
    low: "low",
    disqualified: "disqualified",
  };
  return map[tier];
}

// ─── Offer angle decision tree ────────────────────────────────────────────────

function selectOfferAngle(
  websiteWeaknessScore: number,
  conversionWeaknessScore: number,
  trustSignalScore: number,
  opportunitySizeScore: number,
  seoBasicsScore: number,
  urgencyScore: number,
  serviceFitScore: number,
  niche: string,
): OfferAngle {
  if (websiteWeaknessScore > 75 && conversionWeaknessScore > 70)
    return "conversion_leak";
  if (trustSignalScore < 35 && opportunitySizeScore > 55)
    return "trust_deficit";
  if (seoBasicsScore < 45 && urgencyScore > 60) return "visibility_gap";
  if (
    serviceFitScore > 80 &&
    opportunitySizeScore > 75 &&
    websiteWeaknessScore < 40
  )
    return "missed_revenue";
  if (
    urgencyScore > 70 &&
    ["hvac", "restoration", "roofing"].includes(niche.toLowerCase())
  )
    return "competitive_threat";
  return "visibility_gap";
}

// ─── CTA decision tree ────────────────────────────────────────────────────────

function selectRecommendedCTA(
  tier: ScoreTier,
  offerAngle: OfferAngle,
  aggressiveness: number,
): RecommendedCTA {
  if (tier === "priority" && aggressiveness >= 4) return "free_strategy_call";
  if (tier === "priority" && aggressiveness < 4) return "quick_win_demo";
  if (tier === "high" && offerAngle === "conversion_leak")
    return "quick_win_demo";
  if (tier === "high" && offerAngle === "missed_revenue")
    return "benchmark_report";
  if (tier === "medium") return "audit_offer";
  if (tier === "low") return "no_cost_assessment";
  return "audit_offer";
}

// ─── Top audit signals ────────────────────────────────────────────────────────

function extractTopAuditSignals(
  audit: WebsiteAudit,
  trustSignalScore: number,
  seoBasicsScore: number,
): string[] {
  const signals: string[] = [];
  if (!audit.websiteExists || !audit.websiteResolves) {
    signals.push("No website found — 0% digital discoverability");
  }
  if (!audit.ctaPresent) {
    signals.push("No visible call-to-action — visitors have nowhere to go");
  }
  if (!audit.contactPagePresent) {
    signals.push("No contact page — eliminating a key conversion path");
  }
  if (!audit.phoneVisible && !audit.emailVisible) {
    signals.push("No phone or email visible — contact friction is high");
  }
  if (audit.mobileWeaknesses.length > 0) {
    signals.push(audit.mobileWeaknesses[0]);
  }
  if (audit.conversionWeaknesses.length > 0) {
    signals.push(audit.conversionWeaknesses[0]);
  }
  if (trustSignalScore < 30) {
    signals.push("Review count below market average for their niche");
  }
  if (seoBasicsScore < 40) {
    signals.push("Title tags and meta descriptions are missing or weak");
  }
  return signals.slice(0, 5);
}

// ─── Awareness stage ──────────────────────────────────────────────────────────

function detectAwarenessStage(
  audit: WebsiteAudit,
  priorityScore: number,
): ScoringRationale["awareness_stage"] {
  if (!audit.websiteExists || !audit.websiteResolves) return "cold";
  if (priorityScore < 55) return "problem_aware";
  if (priorityScore < 75) return "solution_aware";
  return "product_aware";
}

// ─── Rationale builder ────────────────────────────────────────────────────────

function buildScoringRationale(
  lead: LeadStaging,
  offerAngle: OfferAngle,
  recommendedCTA: RecommendedCTA,
  scoreTier: ScoreTier,
  urgencyScore: number,
  opportunitySizeScore: number,
  topAuditSignals: string[],
  audit: WebsiteAudit,
  trustSignalScore: number,
  priorityScore: number,
): ScoringRationale {
  const niche = lead.niche.toLowerCase();
  const nicheCtx =
    NICHE_CONTEXT_NOTES[niche] ??
    `Local ${lead.businessType} businesses benefit significantly from improved digital presence and conversion optimization.`;

  const ANGLE_REASONS: Record<OfferAngle, string> = {
    visibility_gap: `${lead.businessName} has weak digital discoverability — their search presence leaves significant inbound traffic on the table.`,
    conversion_leak:
      "The site exists but conversion paths are broken — visitors arrive and leave without ever contacting the business.",
    trust_deficit:
      "Review count and trust signals are below the threshold needed to convert high-intent searchers in this market.",
    missed_revenue: `${lead.businessName} has a solid foundation but is under-leveraging digital channels relative to their market opportunity.`,
    competitive_threat:
      "Competitors in this niche and area are outranking and out-converting this business in a time-sensitive window.",
  };

  const CTA_REASONS: Record<RecommendedCTA, string> = {
    audit_offer: `Score tier is ${scoreTier} — a no-cost audit reduces friction and gives the prospect a reason to engage without a high-pressure ask.`,
    quick_win_demo:
      "Priority score justifies a direct demonstration — showing one specific improvement is more compelling than describing it.",
    free_strategy_call:
      "High priority score and aggressiveness setting warrant a direct calendar ask — this prospect is worth a real conversation now.",
    benchmark_report:
      "A benchmark against local competitors will be immediately relevant and prove value before any commitment is required.",
    no_cost_assessment:
      "Lower score tier calls for a softer entry point — a full no-cost assessment reduces risk and opens the door without pressure.",
  };

  const urgencyDrivers: string[] = [];
  if (urgencyScore > 70)
    urgencyDrivers.push(
      "High urgency score — multiple compounding weaknesses detected",
    );
  if (EMERGENCY_NICHES.has(niche))
    urgencyDrivers.push(
      `${niche} is a time-sensitive category — visibility directly determines call volume`,
    );
  if (!audit.ctaPresent)
    urgencyDrivers.push(
      "Every day without a clear CTA is a missed conversion opportunity",
    );
  if (trustSignalScore < 30)
    urgencyDrivers.push(
      "Low trust signals mean high-intent visitors are bouncing to competitors",
    );
  if (urgencyDrivers.length === 0)
    urgencyDrivers.push("Moderate urgency — opportunity is real but not acute");

  const primaryWeakness =
    topAuditSignals[0] ??
    (audit.qualityScore < 30
      ? "Website quality is critically low — significant improvement opportunity"
      : "Website has notable gaps in conversion readiness and user experience");

  const primaryOpportunity =
    opportunitySizeScore >= 80
      ? `${lead.businessName} has strong market position — even a 10–15% visibility improvement could add meaningful monthly revenue.`
      : opportunitySizeScore >= 60
        ? "Fixing the most visible conversion gaps could unlock inbound leads currently going to competitors."
        : "Foundational digital improvements would open up organic search and local visibility for the first time.";

  return {
    offer_angle_reason: ANGLE_REASONS[offerAngle],
    cta_reason: CTA_REASONS[recommendedCTA],
    primary_weakness: primaryWeakness,
    primary_opportunity: primaryOpportunity,
    awareness_stage: detectAwarenessStage(audit, priorityScore),
    urgency_drivers: urgencyDrivers,
    niche_context: nicheCtx,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function computeLeadScores(
  lead: LeadStaging,
  audit: WebsiteAudit,
  settings: OutreachCopySettings,
): EnrichedLeadScore {
  const aggressiveness = settings.aggressivenessLevel ?? 3;

  // Derive all sub-scores from audit data
  const serviceFitScore = deriveServiceFitScore(lead, audit);
  const websiteWeaknessScore = deriveWebsiteWeaknessScore(audit);
  const conversionWeaknessScore = deriveConversionWeaknessScore(audit);
  const trustSignalScore = deriveTrustSignalScore(lead, audit);
  const seoBasicsScore = deriveSeoBasicsScore(audit);
  const urgencyScore = deriveUrgencyScore(
    lead,
    websiteWeaknessScore,
    conversionWeaknessScore,
    trustSignalScore,
    seoBasicsScore,
  );
  const opportunitySizeScore = deriveOpportunitySizeScore(
    lead,
    audit,
    serviceFitScore,
  );
  const outreachPriorityScore = deriveOutreachPriorityScore(
    serviceFitScore,
    opportunitySizeScore,
    urgencyScore,
    websiteWeaknessScore,
    conversionWeaknessScore,
    trustSignalScore,
  );

  const scoreTier = assignScoreTier(outreachPriorityScore, lead.isSuppressed);
  const qualificationStatus = tierToQualificationStatus(scoreTier);
  const offerAngle = selectOfferAngle(
    websiteWeaknessScore,
    conversionWeaknessScore,
    trustSignalScore,
    opportunitySizeScore,
    seoBasicsScore,
    urgencyScore,
    serviceFitScore,
    lead.niche,
  );
  const recommendedCTA = selectRecommendedCTA(
    scoreTier,
    offerAngle,
    aggressiveness,
  );
  const topAuditSignals = extractTopAuditSignals(
    audit,
    trustSignalScore,
    seoBasicsScore,
  );
  const scoringRationale = buildScoringRationale(
    lead,
    offerAngle,
    recommendedCTA,
    scoreTier,
    urgencyScore,
    opportunitySizeScore,
    topAuditSignals,
    audit,
    trustSignalScore,
    outreachPriorityScore,
  );

  return {
    // ── LeadScore base fields ──
    id: `score_${lead.id}_${Date.now()}`,
    leadStagingId: lead.id,
    tenantId: lead.tenantId,
    websiteStatus: audit.websiteExists && audit.websiteResolves ? 1 : 0,
    websiteQualityScore: audit.qualityScore,
    ctaStrengthScore: audit.ctaPresent ? 65 : 20,
    trustSignalScore,
    seoBasicsScore,
    conversionOpportunityScore: audit.conversionOpportunityScore,
    serviceFitScore,
    outreachPriorityScore,
    auditSummary:
      topAuditSignals[0] ?? "Audit complete — see detailed signals.",
    recommendedOfferType: offerAngle,
    qualificationStatus,
    scoredAt: new Date().toISOString(),
    // ── EnrichedLeadScore extended fields ──
    urgency_score: urgencyScore,
    opportunity_size_score: opportunitySizeScore,
    website_weakness_score: websiteWeaknessScore,
    conversion_weakness_score: conversionWeaknessScore,
    recommended_offer_angle: offerAngle,
    recommended_cta: recommendedCTA,
    score_tier: scoreTier,
    top_audit_signals: topAuditSignals,
    scoring_rationale: scoringRationale,
  };
}
