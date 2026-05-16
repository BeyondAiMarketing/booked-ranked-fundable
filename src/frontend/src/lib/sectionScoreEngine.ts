// ── Section Score Engine ────────────────────────────────────────────────────
// Calculates a conversion score for each website section type based on
// audit data. Returns a numeric score 0–100, a short label, and a
// pre-formed suggestion string to feed into the AI agent.

import type { AuditScore } from "./websiteAgentEngine";

export type SectionType =
  | "hero"
  | "stats"
  | "services"
  | "testimonials"
  | "trust"
  | "about"
  | "process"
  | "faq"
  | "contact"
  | "cta_banner"
  | "before_after"
  | "certifications";

export interface SectionScore {
  /** 0–100 */
  score: number;
  /** Short diagnostic label, e.g. "Missing urgency signal" */
  label: string;
  /** Full suggestion string — pre-loaded into the agent chat on badge click */
  suggestion: string;
  /** "green" ≥80, "yellow" 60–79, "red" <60 */
  tier: "green" | "yellow" | "red";
}

// ── Per-section scoring weights ──────────────────────────────────────────────

type WeightMap = {
  ctaScore?: number;
  trustScore?: number;
  seoBasics?: number;
  conversionScore?: number;
  mobileScore?: number;
  offerClarity?: number;
};

const SECTION_WEIGHTS: Record<SectionType, WeightMap> = {
  hero: {
    ctaScore: 0.35,
    seoBasics: 0.25,
    conversionScore: 0.25,
    offerClarity: 0.15,
  },
  stats: { trustScore: 0.5, conversionScore: 0.3, seoBasics: 0.2 },
  services: { seoBasics: 0.35, offerClarity: 0.35, conversionScore: 0.3 },
  testimonials: { trustScore: 0.6, conversionScore: 0.25, ctaScore: 0.15 },
  trust: { trustScore: 0.65, ctaScore: 0.2, seoBasics: 0.15 },
  about: { trustScore: 0.4, seoBasics: 0.3, offerClarity: 0.3 },
  process: { conversionScore: 0.4, trustScore: 0.35, offerClarity: 0.25 },
  faq: { seoBasics: 0.4, conversionScore: 0.35, trustScore: 0.25 },
  contact: { ctaScore: 0.45, conversionScore: 0.35, mobileScore: 0.2 },
  cta_banner: { ctaScore: 0.5, conversionScore: 0.3, offerClarity: 0.2 },
  before_after: { trustScore: 0.5, conversionScore: 0.35, ctaScore: 0.15 },
  certifications: { trustScore: 0.6, seoBasics: 0.25, conversionScore: 0.15 },
};

// ── Issue labels and suggestions by section + score tier ─────────────────────

const SECTION_ISSUES: Record<
  SectionType,
  { high: string; mid: string; low: string }
> = {
  hero: {
    high: "Strong hero section",
    mid: "Missing urgency signal",
    low: "Weak headline & CTA — primary conversion blocker",
  },
  stats: {
    high: "Strong social proof numbers",
    mid: "Stats lack specificity",
    low: "No credibility numbers — add real metrics",
  },
  services: {
    high: "Services clearly presented",
    mid: "Service descriptions lack outcome focus",
    low: "Services page missing benefit-driven copy",
  },
  testimonials: {
    high: "Strong social proof",
    mid: "Testimonials lack specificity",
    low: "No named reviews — trust signal critical gap",
  },
  trust: {
    high: "Credibility well established",
    mid: "Trust badges need more specificity",
    low: "Trust signals missing — visitors won't convert without proof",
  },
  about: {
    high: "Compelling brand story",
    mid: "About section too generic",
    low: "About page lacks differentiation and story",
  },
  process: {
    high: "Clear process reduces anxiety",
    mid: "Process steps need more detail",
    low: "Process unclear — visitors fear the unknown",
  },
  faq: {
    high: "FAQs handle objections well",
    mid: "FAQ needs more specific objections",
    low: "FAQ missing — objections go unanswered",
  },
  contact: {
    high: "Contact friction is low",
    mid: "Contact form could be simpler",
    low: "Contact section has too much friction — high drop-off risk",
  },
  cta_banner: {
    high: "Strong mid-page conversion point",
    mid: "CTA banner lacks urgency",
    low: "CTA banner weak — missing urgency or value statement",
  },
  before_after: {
    high: "Powerful visual proof",
    mid: "Before/after needs more real examples",
    low: "No real before/after proof — visitors can't visualize results",
  },
  certifications: {
    high: "Strong credential presentation",
    mid: "Certifications need better visual hierarchy",
    low: "Credentials under-displayed — buyers can't verify trust",
  },
};

const SECTION_SUGGESTIONS: Record<SectionType, (score: number) => string> = {
  hero: (s) =>
    s >= 80
      ? "Your hero is performing well. Consider testing a 2nd CTA variant for mobile."
      : s >= 60
        ? "Add an urgency trigger to your hero CTA — e.g. 'Limited slots this week'. Use Dan Kennedy's direct-response formula: one offer, one CTA, one reason to act now."
        : "Rewrite the hero headline with your niche keyword, city, and a specific benefit. Fix the CTA — replace 'Contact Us' with an outcome-based ask. Use Hormozi's value-gap opener to lead with the opportunity, not your name.",
  stats: (s) =>
    s >= 80
      ? "Stats section is strong. Add a source attribution for credibility."
      : s >= 60
        ? "Make your stats more specific — '500+ jobs' beats '500 jobs' because it implies ongoing growth. Add a star rating count."
        : "Add 3–4 specific numbers: jobs completed, years in business, average response time, review count. Claude Hopkins: specific numbers build credibility that vague claims never can.",
  services: (s) =>
    s >= 80
      ? "Services are well presented. Consider adding pricing ranges for transparency."
      : s >= 60
        ? "Lead each service description with the outcome, not the process. 'Leak-free pipes, guaranteed' beats 'We fix leaks'."
        : "Rewrite every service description to lead with the customer benefit, not the task. Add an icon, a price range, and a micro-CTA per service card.",
  testimonials: (s) =>
    s >= 80
      ? "Strong testimonials. Add a Google review count badge for third-party validation."
      : s >= 60
        ? "Name every reviewer and add their city. 'Great service!' from 'John D.' is weak. 'Fixed our emergency leak in 45 minutes' from 'Sarah M., Austin TX' converts."
        : "Add 3 named, specific reviews that each solve a different objection. Include star count, first/last name, and city. Jay Abraham: you must position yourself as the trusted advisor — specific testimonials do this work for you.",
  trust: (s) =>
    s >= 80
      ? "Trust section is performing. Consider adding a money-back guarantee badge."
      : s >= 60
        ? "Add your license number, insurance carrier, and at least one third-party certification badge (BBB, Angi, etc.)."
        : "Your trust section is missing critical credentials. Add: license #, insurance, certifications, BBB/Google rating, years in business. Without these, skeptical visitors won't call.",
  about: (s) =>
    s >= 80
      ? "Compelling about section. Add a founder photo for even more connection."
      : s >= 60
        ? "Add a specific origin story — why you started, who you serve, what makes you different from national chains."
        : "Rewrite the about section using the PAS framework: what problem you saw (bad contractors), what happened (you decided to do it right), and who you serve today. Make it human, not corporate.",
  process: (s) =>
    s >= 80
      ? "Process section removes anxiety well. Consider adding average time per step."
      : s >= 60
        ? "Add an approximate time commitment per step so visitors know exactly what to expect."
        : "Add a clear 3–4 step process with specific timelines. Deiss Before/After/Bridge: current state (nervous about hiring) → bridge (our clear process) → desired state (job done, stress-free).",
  faq: (s) =>
    s >= 80
      ? "FAQ handles objections effectively. Review for updated pricing questions."
      : s >= 60
        ? "Add 2–3 objection-based questions: 'How much does it cost?' 'Are you licensed and insured?' 'What if I'm not satisfied?'"
        : "Add 5–7 specific objections that actually prevent people from calling. Sugarman slippery slope: each FAQ answer should guide the reader to the next easiest section on your page.",
  contact: (s) =>
    s >= 80
      ? "Contact conversion is strong. Test SMS as an alternative contact option."
      : s >= 60
        ? "Reduce form fields to 3 maximum: name, phone, and service needed. Every extra field costs you 10–20% of submissions."
        : "Simplify your contact section drastically. Show the phone number large, above the fold. Add a one-click call button. Kennedy's rule: hot leads need a phone number, not a 7-field form.",
  cta_banner: (s) =>
    s >= 80
      ? "Mid-page CTA is performing. Test a time-limited variant for seasonal urgency."
      : s >= 60
        ? "Add a scarcity or urgency element: 'Only 4 openings this week' or 'Same-day service available now'."
        : "Rebuild your CTA banner with: a benefit headline, a specific urgency trigger, and one action button. Sabri Suby PASTOR: the offer must come with a compelling reason to act today, not someday.",
  before_after: (s) =>
    s >= 80
      ? "Visual proof is compelling. Add a third-party disclaimer for credibility."
      : s >= 60
        ? "Add real job photos with the customer's first name and city for each before/after pair."
        : "Replace placeholder images with real job photos — even phone photos outperform stock. Add a caption with the specific problem solved. Hopkins: specificity in proof beats every claim you can make.",
  certifications: (s) =>
    s >= 80
      ? "Credentials are well displayed. Add expiry dates to show they're current."
      : s >= 60
        ? "Add logo images for your certifications, not just text. Badges with recognizable logos convert better."
        : "List every credential with its issuing organization. BBB, IICRC, NATE, EPA, Angi — each one removes a different objection. Ogilvy: the image is the ad; use real certification badges.",
};

// ── calculateSectionScore ────────────────────────────────────────────────────

export function calculateSectionScore(
  sectionType: SectionType,
  auditData: AuditScore | null,
): SectionScore {
  const weights = SECTION_WEIGHTS[sectionType];
  const audit = auditData ?? {};

  // Default score when no audit data provided — mildly pessimistic to encourage improvement
  const defaults: Record<keyof WeightMap, number> = {
    ctaScore: 65,
    trustScore: 62,
    seoBasics: 68,
    conversionScore: 60,
    mobileScore: 70,
    offerClarity: 58,
  };

  let total = 0;
  let weightSum = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const k = key as keyof WeightMap;
    const raw =
      (audit[k as keyof AuditScore] as number | undefined) ?? defaults[k];
    total += raw * (weight ?? 0);
    weightSum += weight ?? 0;
  }

  const raw = weightSum > 0 ? Math.round(total / weightSum) : 65;
  // Clamp to 0–100
  const score = Math.min(100, Math.max(0, raw));

  const tier: SectionScore["tier"] =
    score >= 80 ? "green" : score >= 60 ? "yellow" : "red";

  const issues = SECTION_ISSUES[sectionType];
  const label =
    score >= 80 ? issues.high : score >= 60 ? issues.mid : issues.low;
  const suggestion = SECTION_SUGGESTIONS[sectionType](score);

  return { score, label, suggestion, tier };
}
