// ── Website Analytics Engine ─────────────────────────────────────────────────
// Generates realistic simulated analytics per section for the Conversion
// Analytics Dashboard. Deterministic based on siteId+niche so data is
// consistent across renders.

import type { SectionType } from "../data/nicheWebsiteData";

export interface SectionAnalytics {
  sectionId: string;
  sectionType: SectionType;
  label: string;
  views: number;
  avgTimeOnSection: number; // seconds
  scrollDepth: number; // 0–100 %
  ctaClicks: number;
  ctaClickRate: number; // 0–100 %
  /** 0–100 overall health score for this section */
  score: number;
  /** Alias for score — used by SectionAnalyticsDashboard */
  conversionScore: number;
  /** Trend vs last period: positive = improved */
  trend: number;
  /** The main issue dragging this section's score */
  primaryIssue?: string;
  /** Recommended action to improve this section */
  recommendation?: string;
}

export interface SiteAnalytics {
  siteId: string;
  niche: string;
  totalViews: number;
  /** Alias for totalViews — used by SectionAnalyticsDashboard */
  totalPageViews: number;
  avgSessionDuration: number; // seconds
  bounceRate: number; // %
  overallConversionRate: number; // %
  /** Alias for overallConversionRate — used by SectionAnalyticsDashboard */
  conversionRate: number;
  topSection: string;
  /** Alias for topSection */
  topPerformingSection: string;
  weakestSection: string;
  /** Alias for weakestSection */
  lowestPerformingSection: string;
  sections: SectionAnalytics[];
  periodLabel: string;
  lastUpdated: string;
}

/** Alias type used by SectionAnalyticsDashboard */
export type SiteAnalyticsSummary = SiteAnalytics;

// ── Deterministic pseudo-random ───────────────────────────────────────────────
function seededRand(seed: number, min: number, max: number): number {
  const s = Math.sin(seed * 9301 + 49297) * 233280;
  const r = s - Math.floor(s);
  return Math.round(min + r * (max - min));
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ── Section metadata ──────────────────────────────────────────────────────────
const SECTION_LABELS: Partial<Record<SectionType, string>> = {
  hero: "Hero / Above Fold",
  stats: "Stats Bar",
  services: "Services",
  testimonials: "Testimonials",
  trust: "Trust Signals",
  about: "About Us",
  process: "How It Works",
  faq: "FAQ",
  contact: "Contact",
  cta_banner: "CTA Banner",
  before_after: "Before & After",
  certifications: "Certifications",
};

const SECTION_BASELINE_SCORES: Partial<Record<SectionType, number>> = {
  hero: 72,
  stats: 65,
  services: 70,
  testimonials: 78,
  trust: 68,
  about: 55,
  process: 62,
  faq: 58,
  contact: 74,
  cta_banner: 60,
  before_after: 82,
  certifications: 64,
};

const SECTION_ISSUES: Partial<Record<SectionType, string>> = {
  hero: "CTA button is below average click-through for this niche",
  stats: "Low engagement — visitors scroll past quickly",
  services:
    "Service descriptions lack specificity — visitors don't see clear value",
  testimonials: "No photos or names reduce credibility vs. industry benchmarks",
  trust: "Trust badges are below the fold on mobile",
  about: "Lowest scroll depth on page — needs a stronger hook in first 2 lines",
  process: "Step descriptions are too generic — doesn't reduce booking anxiety",
  faq: "Questions answered are too basic — missing top 3 real objections",
  contact: "Form completion rate is below average — too many required fields",
  cta_banner:
    "Headline lacks urgency trigger — visitors read and continue scrolling",
  before_after:
    "Only 2 examples shown — adding 2 more increases engagement 40%",
  certifications: "Certification logos are too small on mobile to build trust",
};

const SECTION_RECOMMENDATIONS: Partial<Record<SectionType, string>> = {
  hero: 'Rewrite CTA using Kennedy direct-response formula: "Get [Specific Benefit] Today — [Urgency Signal]"',
  stats:
    "Make stats bigger and add a brief label explaining why each number matters",
  services:
    "Add price anchors or time estimates to each service — specificity drives conversions",
  testimonials:
    "Add photo placeholders, star ratings, and city tags to each testimonial",
  trust:
    "Move top 3 trust badges above the fold on mobile — below 600px they lose impact",
  about:
    "Open with a 1-sentence hook about how many customers you've served in [City]",
  process:
    "Rewrite each step to eliminate anxiety — focus on what the visitor doesn't have to do",
  faq: "Add 3 objection-based FAQs: pricing, timing, and what happens if unsatisfied",
  contact: "Reduce form to 3 fields maximum — name, phone, and service type",
  cta_banner:
    "Add a time or scarcity element: 'Limited slots this week' or 'Available now'",
  before_after:
    "Add a 3rd or 4th example — more social proof reduces skepticism for new visitors",
  certifications:
    "Increase badge size and add 1-line description below each — make credentials scannable",
};

// ── Niche multipliers (some sections perform better for specific niches) ───────
const NICHE_SECTION_BOOST: Record<
  string,
  Partial<Record<SectionType, number>>
> = {
  plumbing: { hero: 8, cta_banner: 12, trust: 5 },
  hvac: { stats: 10, certifications: 8, process: 6 },
  "med-spa": { before_after: 15, testimonials: 10, hero: 5 },
  med_spa: { before_after: 15, testimonials: 10, hero: 5 },
  restoration: { cta_banner: 15, hero: 10, process: 8 },
  "carpet-cleaning": { before_after: 12, services: 8, testimonials: 6 },
  carpet_cleaning: { before_after: 12, services: 8, testimonials: 6 },
  roofing: { cta_banner: 14, before_after: 10, trust: 6 },
};

// ── Core generator ────────────────────────────────────────────────────────────
export function generateSectionAnalytics(
  siteId: string,
  niche: string,
): SiteAnalytics {
  const base = hashStr(`${siteId}-${niche}`);
  const nicheNorm = niche.toLowerCase().replace(/[\s-]/g, "_");
  const nicheBoosts = NICHE_SECTION_BOOST[nicheNorm] ?? {};

  // Representative set of sections for this niche
  const sectionTypes: SectionType[] = [
    "hero",
    "services",
    "testimonials",
    "trust",
    "process",
    "cta_banner",
    "about",
    "faq",
    "contact",
    "before_after",
    "certifications",
    "stats",
  ];

  const totalViews = seededRand(base, 1800, 6500);

  const sections: SectionAnalytics[] = sectionTypes.map((type, idx) => {
    const seed = base + idx * 17 + type.length;
    const baseScore = SECTION_BASELINE_SCORES[type] ?? 60;
    const boost = nicheBoosts[type] ?? 0;
    const score = Math.min(98, baseScore + boost + seededRand(seed, -8, 12));

    // Views: hero sees most, deeper sections progressively less
    const viewFraction = Math.max(
      0.25,
      1 - idx * 0.065 + seededRand(seed + 1, -5, 5) / 100,
    );
    const views = Math.round(totalViews * viewFraction);

    // Time on section (seconds): engaging sections hold longer
    const baseTime =
      type === "testimonials"
        ? 28
        : type === "faq"
          ? 35
          : type === "before_after"
            ? 30
            : type === "hero"
              ? 18
              : 15;
    const avgTimeOnSection = baseTime + seededRand(seed + 2, -4, 12);

    // Scroll depth: hero is near 100%, about/contact are lower
    const baseDepth =
      type === "hero"
        ? 92
        : type === "stats"
          ? 88
          : type === "services"
            ? 78
            : type === "contact"
              ? 65
              : type === "about"
                ? 55
                : 72;
    const scrollDepth = Math.min(
      99,
      Math.max(30, baseDepth + seededRand(seed + 3, -10, 10)),
    );

    // CTA clicks
    const hasCta = ["hero", "cta_banner", "services", "contact"].includes(type);
    const ctaClicks = hasCta
      ? seededRand(seed + 4, 8, Math.round(views * 0.12))
      : seededRand(seed + 4, 0, 4);
    const ctaClickRate = views > 0 ? Math.round((ctaClicks / views) * 100) : 0;

    const trend = seededRand(seed + 5, -8, 18);

    return {
      sectionId: type,
      sectionType: type,
      label: SECTION_LABELS[type] ?? type,
      views,
      avgTimeOnSection,
      scrollDepth,
      ctaClicks,
      ctaClickRate,
      score,
      conversionScore: score,
      trend,
      primaryIssue: score < 72 ? SECTION_ISSUES[type] : undefined,
      recommendation: score < 80 ? SECTION_RECOMMENDATIONS[type] : undefined,
    };
  });

  const sorted = [...sections].sort((a, b) => a.score - b.score);
  const weakestSection = sorted[0]?.label ?? "Hero";
  const topSection = sorted[sorted.length - 1]?.label ?? "Testimonials";

  const overallConversionRate =
    Math.round(
      (sections.reduce((sum, s) => sum + s.ctaClickRate, 0) / sections.length) *
        10,
    ) / 10;

  const avgSessionDuration = seededRand(base + 99, 85, 240);
  const bounceRate = seededRand(base + 77, 32, 68);

  return {
    siteId,
    niche,
    totalViews,
    totalPageViews: totalViews,
    avgSessionDuration,
    bounceRate,
    overallConversionRate,
    conversionRate: overallConversionRate,
    topSection,
    topPerformingSection: topSection,
    weakestSection,
    lowestPerformingSection: weakestSection,
    sections,
    periodLabel: "Last 30 days",
    lastUpdated: new Date(
      Date.now() - seededRand(base, 60000, 3600000),
    ).toISOString(),
  };
}

/** Returns the bottom N sections by score */
export function getWeakestSections(
  analytics: SiteAnalytics,
  count = 3,
): SectionAnalytics[] {
  return [...analytics.sections]
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

/** Returns the top N sections by score */
export function getTopSections(
  analytics: SiteAnalytics,
  count = 3,
): SectionAnalytics[] {
  return [...analytics.sections]
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

/** Returns the lowest-scoring section */
export function getLowestScoringSection(
  analytics: SiteAnalytics,
): SectionAnalytics | undefined {
  return [...analytics.sections].sort((a, b) => a.score - b.score)[0];
}

/** Format seconds into a human-readable string */
export function formatSeconds(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

/** Returns a color hex string based on score 0–100 */
export function scoreColor(score: number): string {
  if (score >= 80) return "#34d399"; // green
  if (score >= 60) return "#fbbf24"; // amber
  return "#f87171"; // red
}

/** Returns a color based on trend direction */
export function trendColor(trend: number): string {
  if (trend > 0) return "#34d399";
  if (trend < 0) return "#f87171";
  return "#94a3b8";
}

/** Returns a trend icon character */
export function trendIcon(trend: number): string {
  if (trend > 0) return "▲";
  if (trend < 0) return "▼";
  return "→";
}
