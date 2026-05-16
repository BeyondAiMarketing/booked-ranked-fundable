// ── Website Agent Engine ────────────────────────────────────────────────────
// Standalone engine for generating proactive suggestions and processing
// agent requests for the Website/Funnel AI Agent. No external API calls —
// fully deterministic, framework-driven copy generation.
//
// Frameworks: Hormozi, Ogilvy, Suby PASTOR, Kennedy, Deiss B/A/B,
//             Halbert PAS, Hopkins, Abraham, Sugarman, Schwartz

import type {
  ClientWebsiteConfig,
  NicheWebsiteSection,
  SectionType,
} from "../data/nicheWebsiteData";
import {
  MASTER_FRAMEWORKS,
  abrahamAdvisorPositioning,
  deissBeforeAfterBridge,
  halbertProblemAgitateSolve,
  hopkinsSpecificProof,
  hormoziValueOpener,
  kennedyFollowUp,
  ogilvySubjectLine,
  pastorEmailStructure,
  schwartzAwarenessAdapter,
  sugarmanSlipperySlopeOpener,
} from "./outreachCopyEngine";

// ── Re-export for downstream consumers ──────────────────────────────────────
export { MASTER_FRAMEWORKS };

// ── Legacy type aliases (kept for backward compat with existing UI) ──────────
export type AgentTone = "urgent" | "professional" | "friendly" | "luxury";
export type OfferFramework =
  | "value_stack"
  | "before_after_bridge"
  | "pastor"
  | "benefit_driven"
  | "credibility_first";
export type CtaStyle =
  | "direct_ask"
  | "curiosity_hook"
  | "social_proof"
  | "urgency_trigger";
export type FrameworkName =
  | "Hormozi"
  | "Kennedy"
  | "Ogilvy"
  | "Halbert"
  | "Schwartz"
  | "Abraham"
  | "Sugarman"
  | "Hopkins"
  | "Deiss"
  | "Suby";

// ── Audit Score ──────────────────────────────────────────────────────────────
export interface AuditScore {
  ctaScore?: number;
  trustScore?: number;
  seoBasics?: number;
  conversionScore?: number;
  mobileScore?: number;
  offerClarity?: number;
  overallScore?: number;
}

// ── Core spec-aligned types ───────────────────────────────────────────────────

export interface WebsiteAgentSettings {
  tone: "urgent" | "professional" | "friendly" | "luxury";
  offerFramework:
    | "value-stack"
    | "before-after-bridge"
    | "pastor"
    | "benefit-driven"
    | "credibility-first"
    // legacy underscore variants
    | "value_stack"
    | "before_after_bridge"
    | "benefit_driven"
    | "credibility_first";
  ctaStyle:
    | "direct-ask"
    | "curiosity-hook"
    | "social-proof"
    | "urgency-trigger"
    // legacy underscore variants
    | "direct_ask"
    | "curiosity_hook"
    | "social_proof"
    | "urgency_trigger";
  suggestionsEnabled: boolean;
  // legacy compat
  clientId?: string;
  auditDrivenSuggestions?: boolean;
}

export interface WebsiteAgentArtifact {
  id: string;
  sessionTimestamp: number;
  sectionId: string;
  sectionType: SectionType;
  tool: string;
  variantId: string;
  previousContent: Record<string, string>;
  appliedContent: Record<string, string>;
  frameworkUsed: string;
  reasoning: string;
}

export interface WebsiteAgentMemory {
  clientId: string;
  sessionHistory?: {
    role: "user" | "agent";
    content: string;
    timestamp: number;
  }[];
  appliedChanges?: WebsiteAgentArtifact[];
  tonePreference?: string;
  frameworkPreference?: string;
  lastEditedSection?: string;
  // legacy compat fields used by existing UI
  tonePreference_compat?: AgentTone;
  appliedChangesCount?: number;
  recentChanges?: { sectionId: string; field: string; timestamp: number }[];
}

export interface WebsiteAgentVariant {
  id: string;
  previewText: string;
  fullContent: Record<string, string>;
  frameworkUsed: string;
  frameworkPrinciple: string;
  reasoningExplanation: string;
  estimatedLift: string;
  // legacy compat fields used by existing UI components (required for backward compat)
  variantNumber: number;
  framework: FrameworkName;
  sectionId: string;
  fieldKey: string;
  content: Record<string, string>;
  reasoning: string;
}

export interface WebsiteAgentTool {
  name: string;
  description: string;
  keywords: string[];
  handler: string;
}

export interface WebsiteAgentRequest {
  clientId: string;
  niche: string;
  message: string;
  targetSectionId?: string;
  currentContent?: Record<string, string>;
  auditScore?: AuditScore | null;
  existingSectionTypes?: SectionType[];
  currentTheme?: object;
  sections?: NicheWebsiteSection[];
}

export interface WebsiteAgentResponse {
  message: string;
  variants?: WebsiteAgentVariant[];
  directEdit?: { sectionId: string; content: Record<string, string> };
  toolUsed: string;
  frameworkCited: string;
  reasoning: string;
  // legacy compat
  responseText?: string;
}

export interface ProactiveSuggestion {
  id: string;
  /** Numeric rank for sorting (lower = higher priority). New spec field. */
  priority: number;
  sectionId: string;
  issueType:
    | "low-cta"
    | "weak-trust"
    | "no-urgency"
    | "missing-section"
    | "weak-headline"
    | "low-social-proof"
    | "cta"
    | "trust"
    | "seo"
    | "conversion"
    | "hero"
    | "general"; // legacy
  issueDescription: string;
  suggestedAction: string;
  estimatedImpact: string;
  frameworkRecommended: string;
  // legacy compat fields required by existing UI
  issue: string;
  action: string;
  framework: FrameworkName;
  priority_level: "high" | "medium" | "low";
}

// ── Legacy AgentMessage (used by existing chat UI) ────────────────────────────
export interface AgentMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  variants?: WebsiteAgentVariant[];
  suggestions?: ProactiveSuggestion[];
  timestamp: number;
  appliedVariantId?: string;
}

// ── Niche Copy Contexts ───────────────────────────────────────────────────────
export const NICHE_COPY_CONTEXTS: Record<string, string> = {
  plumbing:
    "emergency plumbing, local homeowners, trust + availability, 24/7 response, $350–$900 avg ticket",
  hvac: "heating/cooling, seasonal urgency, comfort + reliability, NATE certification, $400–$2,500 avg ticket",
  "med-spa":
    "aesthetic treatments, confidence, premium experience, physician-supervised, $300–$3,000 per visit",
  "med spa":
    "aesthetic treatments, confidence, premium experience, physician-supervised, $300–$3,000 per visit",
  restoration:
    "disaster recovery, insurance, urgency + compassion, IICRC certified, $3,000–$20,000 avg ticket",
  "carpet-cleaning":
    "fresh home, family safety, before/after results, pet + kid safe, $150–$500 avg ticket",
  "carpet cleaning":
    "fresh home, family safety, before/after results, pet + kid safe, $150–$500 avg ticket",
  roofing:
    "storm protection, long-term investment, curb appeal + safety, insurance claims, $8,000–$25,000 avg ticket",
};

function getNicheContext(niche: string): string {
  return (
    NICHE_COPY_CONTEXTS[niche.toLowerCase()] ??
    "local service business, trust + availability, competitive local market"
  );
}

// ── Framework Selection by Tone ───────────────────────────────────────────────
interface ToneFrameworkPair {
  primary: string;
  secondary: string;
  principle: string;
  secondaryPrinciple: string;
}
const TONE_FRAMEWORK_MAP: Record<
  "urgent" | "professional" | "friendly" | "luxury",
  ToneFrameworkPair
> = {
  urgent: {
    primary: "Dan Kennedy",
    secondary: "Gary Halbert",
    principle: "Direct Response Fundamentals — one offer, one CTA, urgency now",
    secondaryPrinciple:
      "Problem-Agitate-Solve — name the pain, intensify it, resolve it",
  },
  professional: {
    primary: "Jay Abraham",
    secondary: "Claude Hopkins",
    principle:
      "Strategy of Preeminence — trusted advisor positioning, not vendor pitch",
    secondaryPrinciple: "Specificity & Precision — specific claims beat vague",
  },
  friendly: {
    primary: "Ryan Deiss",
    secondary: "Joe Sugarman",
    principle:
      "Customer Value Journey — move prospects awareness → engage → convert",
    secondaryPrinciple:
      "Slippery Slope Structure — each sentence pulls to the next",
  },
  luxury: {
    primary: "David Ogilvy",
    secondary: "Eugene Schwartz",
    principle: "Headline Power & Research-First — credibility before claims",
    secondaryPrinciple:
      "Awareness Spectrum — copy adapts to the prospect's awareness level",
  },
};

// ── Urgency Lines ─────────────────────────────────────────────────────────────
const NICHE_URGENCY_LINES: Record<string, string> = {
  plumbing:
    "Every missed call is a $300–$800 job walking to a competitor. People in emergencies don't comparison shop — they call whoever they find first.",
  hvac: "HVAC businesses that rank before peak season fill their books. Those that don't scramble for scraps the entire summer.",
  "med-spa":
    "Pre-summer appointments fill 6–8 weeks out. Clients who can't book immediately will find another provider.",
  "med spa":
    "Pre-summer appointments fill 6–8 weeks out. Clients who can't book immediately will find another provider.",
  restoration:
    "Restoration is winner-takes-all — whoever shows up first wins the job. Every hour of delay is a lost $5,000–$20,000 contract.",
  "carpet-cleaning":
    "Move-in season and post-holiday demand creates brief windows. Businesses that rank during those peaks capture disproportionate revenue.",
  "carpet cleaning":
    "Move-in season and post-holiday demand creates brief windows. Businesses that rank during those peaks capture disproportionate revenue.",
  roofing:
    "After a hailstorm, homeowners search within 48 hours. Whoever shows up in search wins the estimate — and estimates close at 65–80%.",
};
function getUrgencyLine(niche: string): string {
  return (
    NICHE_URGENCY_LINES[niche.toLowerCase()] ??
    "Local search winners capture disproportionate call volume. The gap between #1 and #4 in search results is often 10:1 in clicks."
  );
}

// ── CTA Variants by Style ─────────────────────────────────────────────────────
type CtaStyleKey =
  | "direct-ask"
  | "curiosity-hook"
  | "social-proof"
  | "urgency-trigger";
const CTA_VARIANTS_NEW: Record<CtaStyleKey, (niche: string) => string[]> = {
  "direct-ask": (n) => [
    `Get Your Free ${n.charAt(0).toUpperCase() + n.slice(1)} Quote Today`,
    "Call Now — We Answer 24/7",
    "Schedule Service — Openings Available This Week",
  ],
  "curiosity-hook": (n) => [
    `See What Most ${n.charAt(0).toUpperCase() + n.slice(1)} Businesses Get Wrong`,
    "Find Out Where You Rank Against Local Competitors",
    "Discover the #1 Thing Costing You Leads This Month",
  ],
  "social-proof": (n) => [
    "Join 500+ Satisfied Customers — Book Now",
    "Trusted by [City] Homeowners Since [Year]",
    `See Why We're [City]'s Highest-Rated ${n.charAt(0).toUpperCase() + n.slice(1)} Company`,
  ],
  "urgency-trigger": (n) => [
    "Limited Availability — Book Your Spot Today",
    "Only 3 Openings Left This Week — Reserve Yours",
    `Don't Wait — ${n.charAt(0).toUpperCase() + n.slice(1)} Demand Is Peaking Right Now`,
  ],
};

// ── Section Conversion Value ──────────────────────────────────────────────────
const HIGH_CONV_SECTIONS: SectionType[] = [
  "testimonials",
  "trust",
  "cta_banner",
  "process",
  "before_after",
];
function getMissingSections(existing: SectionType[]): SectionType[] {
  return HIGH_CONV_SECTIONS.filter((s) => !existing.includes(s));
}

// ── Variant ID Generator ──────────────────────────────────────────────────────
let _vc = 0;
function mkVid(prefix: string): string {
  _vc = (_vc + 1) % 10000;
  return `${prefix}_v${Date.now()}_${_vc}`;
}

// ── Tool 1: Rewrite Section ───────────────────────────────────────────────────
export function rewriteSection(
  sectionId: string,
  _sectionType: SectionType,
  currentContent: Record<string, string>,
  niche: string,
  settings: WebsiteAgentSettings,
  _memory: WebsiteAgentMemory,
): WebsiteAgentVariant[] {
  const urgencyLine = getUrgencyLine(niche);
  const businessName = currentContent.businessName ?? "[Business Name]";
  const city = currentContent.city ?? "[City]";
  const currentHeadline = currentContent.headline ?? "";
  const nicheCap = niche.charAt(0).toUpperCase() + niche.slice(1);

  // V1 — Hormozi + Kennedy
  const v1Opener = hormoziValueOpener(businessName, urgencyLine, niche);
  const v1Content: Record<string, string> = {
    ...currentContent,
    headline: `${businessName} — The ${nicheCap} Experts ${city} Trusts`,
    subheadline:
      "Proven results. Guaranteed work. Available when you need us most.",
    cta1: `Get Your Free ${nicheCap} Quote — No Obligation`,
    reasoning_internal: v1Opener,
  };
  const v1: WebsiteAgentVariant = {
    id: mkVid(`${sectionId}_hormozi_kennedy`),
    previewText: v1Content.headline.slice(0, 80),
    fullContent: v1Content,
    frameworkUsed: "Alex Hormozi + Dan Kennedy",
    frameworkPrinciple:
      "Value Stack (lead with the gap) + Direct Response (one offer, one CTA, urgency now)",
    reasoningExplanation: `Hormozi logic: opens with the gap. Kennedy layer: adds a clear, actionable CTA with urgency. Best for ${niche}: ${urgencyLine.slice(0, 80)}...`,
    estimatedLift:
      "High — value-gap + direct CTA combination drives 25–40% more click-through on hero sections.",
    variantNumber: 1,
    framework: "Hormozi",
    sectionId,
    fieldKey: "headline",
    content: v1Content,
    reasoning: v1Opener,
  };

  // V2 — Deiss + Abraham
  const deissBody = deissBeforeAfterBridge(
    currentHeadline
      ? `Visitors can't immediately understand why ${businessName} is the right choice`
      : "Visitors land and see a generic headline",
    `${businessName} recognized as the obvious, trusted choice for ${niche} in ${city}`,
    "A clear value headline paired with social proof and friction-free CTA",
    `Book Your ${nicheCap} Appointment Today`,
  );
  const abrahamLine = abrahamAdvisorPositioning(businessName, niche);
  const v2Content: Record<string, string> = {
    ...currentContent,
    headline: `[City]'s Most Trusted ${nicheCap} — Honest. Fast. Guaranteed.`,
    subheadline: abrahamLine.slice(0, 120),
    cta1: "Schedule a Consultation",
    reasoning_internal: deissBody,
  };
  const v2: WebsiteAgentVariant = {
    id: mkVid(`${sectionId}_deiss_abraham`),
    previewText: v2Content.headline.slice(0, 80),
    fullContent: v2Content,
    frameworkUsed: "Ryan Deiss + Jay Abraham",
    frameworkPrinciple:
      "Before/After/Bridge (awareness journey) + Strategy of Preeminence (advisor not vendor)",
    reasoningExplanation: `Deiss maps the visitor from frustrated state to confident, booked appointment. Abraham positions ${businessName} as the trusted local authority rather than a commodity option.`,
    estimatedLift:
      "Medium-High — trusted advisor positioning reduces bounce rate and increases time-on-page.",
    variantNumber: 2,
    framework: "Deiss",
    sectionId,
    fieldKey: "headline",
    content: v2Content,
    reasoning: deissBody,
  };

  // V3 — Halbert PAS + Suby PASTOR
  const pasBody = halbertProblemAgitateSolve(
    `Finding a reliable ${niche} company in ${city} shouldn't be this hard`,
    `Most ${niche} businesses either don't show up on time, quote one price and charge another, or leave a mess.`,
    "a team that shows up, communicates clearly, and stands behind every job",
    businessName,
  );
  const pastorCta = pastorEmailStructure(
    `Every homeowner in ${city} deserves a ${niche} company they can actually trust.`,
    urgencyLine,
    `${businessName} has served ${city} with the kind of honesty that earns long-term relationships.`,
    "A simple call is all it takes. Upfront quote, clear explanation, written guarantee.",
    "Call or book online today — openings are available this week.",
    "conversational",
  );
  const v3Content: Record<string, string> = {
    ...currentContent,
    headline: `Finally — A ${nicheCap} Company in ${city} You Can Actually Trust`,
    subheadline: "Upfront pricing. Guaranteed work. No surprises, ever.",
    cta1: "Book Your Appointment",
    cta2: "See Our Reviews",
    reasoning_internal: [pasBody, pastorCta].join("\n"),
  };
  const v3: WebsiteAgentVariant = {
    id: mkVid(`${sectionId}_halbert_pastor`),
    previewText: v3Content.headline.slice(0, 80),
    fullContent: v3Content,
    frameworkUsed: "Gary Halbert + Sabri Suby PASTOR",
    frameworkPrinciple:
      "Problem-Agitate-Solve (name pain, amplify, resolve) + PASTOR (Problem → Amplify → Story → Transformation → Offer → Response)",
    reasoningExplanation: `Halbert PAS resonates with visitors who have been burned before — validates frustration before presenting ${businessName} as the relief. PASTOR structure covers the full emotional journey. Most effective for niches with high consumer skepticism.`,
    estimatedLift:
      "High for skeptical audiences — PAS + PASTOR combination can double conversion rate vs. generic headlines.",
    variantNumber: 3,
    framework: "Suby",
    sectionId,
    fieldKey: "headline",
    content: v3Content,
    reasoning: pasBody,
  };

  void settings; // used at WorkflowEngine level
  return [v1, v2, v3];
}

// ── Tool 2: Generate CTA Variants ─────────────────────────────────────────────
export function generateCtaVariants(
  currentCta: string,
  niche: string,
  settings: WebsiteAgentSettings,
): WebsiteAgentVariant[] {
  const normalizedCtaStyle = settings.ctaStyle.replace(
    /_/g,
    "-",
  ) as CtaStyleKey;
  const ctaPhrases = CTA_VARIANTS_NEW[normalizedCtaStyle](niche);
  const k = kennedyFollowUp(
    `Your ${niche} website`,
    `The CTA "${currentCta.slice(0, 40)}" is leaving conversions on the table`,
    [
      "Generic CTAs convert 40–60% worse than specific, benefit-forward calls to action",
    ],
    ctaPhrases[0],
  );
  const sg = sugarmanSlipperySlopeOpener(
    `You're one button away from knowing exactly what your ${niche} site is missing`,
    "how much revenue the current CTA is costing you every month",
  );
  const hp = hopkinsSpecificProof(niche, "[City]", "$350–$2,500");
  const og = ogilvySubjectLine("[Business Name]", "visibility_gap", "[City]");
  return [
    {
      id: mkVid("cta_kennedy"),
      previewText: ctaPhrases[0],
      fullContent: {
        cta: ctaPhrases[0],
        cta1: ctaPhrases[0],
        reasoning_internal: k,
      },
      frameworkUsed: "Dan Kennedy",
      frameworkPrinciple:
        "Direct Response — one clear offer and a reason to act now",
      reasoningExplanation: `Kennedy's rule: a CTA must tell the reader what to do AND why now. "${ctaPhrases[0]}" eliminates ambiguity for ${niche} visitors ready to buy.`,
      estimatedLift:
        "High — benefit-specific CTAs outperform generic 'Contact Us' by 40–80%.",
      variantNumber: 1,
      framework: "Kennedy",
      sectionId: "hero",
      fieldKey: "cta1",
      content: { cta1: ctaPhrases[0] },
      reasoning: k,
    },
    {
      id: mkVid("cta_sugarman"),
      previewText: ctaPhrases[1],
      fullContent: {
        cta: ctaPhrases[1],
        cta1: ctaPhrases[1],
        micro_copy: "Takes 30 seconds. No obligation.",
        reasoning_internal: sg,
      },
      frameworkUsed: "Joe Sugarman",
      frameworkPrinciple:
        "Slippery Slope — create curiosity that pulls the visitor forward, reduce resistance",
      reasoningExplanation: `Sugarman's approach: the CTA creates a curiosity gap the visitor can only close by clicking. "${ctaPhrases[1]}" makes visitors feel they'd miss something valuable if they don't act.`,
      estimatedLift:
        "Medium-High for cold/warm traffic — curiosity CTAs reduce hesitation.",
      variantNumber: 2,
      framework: "Sugarman",
      sectionId: "hero",
      fieldKey: "cta1",
      content: { cta1: ctaPhrases[1] },
      reasoning: sg,
    },
    {
      id: mkVid("cta_hopkins_ogilvy"),
      previewText: ctaPhrases[2],
      fullContent: {
        cta: ctaPhrases[2],
        cta1: ctaPhrases[2],
        social_proof_micro: "Trusted by 500+ [City] homeowners",
        reasoning_internal: [hp, og].join("\n"),
      },
      frameworkUsed: "Claude Hopkins + David Ogilvy",
      frameworkPrinciple:
        "Specificity (precise numbers build credibility) + Headline Power (speak to one person)",
      reasoningExplanation: `Hopkins demands specificity — "500+ customers" outperforms "many customers" every time. Ogilvy adds research-first lens: the CTA speaks directly to a ${niche} prospect's core desire.`,
      estimatedLift:
        "High for high-ticket niches — social proof + specificity reduces the #1 conversion barrier: risk.",
      variantNumber: 3,
      framework: "Hopkins",
      sectionId: "hero",
      fieldKey: "cta1",
      content: { cta1: ctaPhrases[2] },
      reasoning: [hp, og].join("\n"),
    },
  ];
}

// ── Tool 3: Add Section Recommendation ───────────────────────────────────────
export function addSectionRecommendation(
  existingSections: SectionType[],
  niche: string,
  auditScore: AuditScore | null,
  settings: WebsiteAgentSettings,
): WebsiteAgentVariant[] {
  const missing = getMissingSections(existingSections);
  const tf = TONE_FRAMEWORK_MAP[settings.tone];
  const nicheCap = niche.charAt(0).toUpperCase() + niche.slice(1);
  const prioritized: SectionType[] = [];
  if (
    auditScore &&
    (auditScore.trustScore ?? 100) < 60 &&
    missing.includes("testimonials")
  )
    prioritized.push("testimonials");
  if (
    auditScore &&
    (auditScore.ctaScore ?? 100) < 60 &&
    missing.includes("cta_banner")
  )
    prioritized.push("cta_banner");
  if (
    auditScore &&
    (auditScore.trustScore ?? 100) < 60 &&
    missing.includes("trust")
  )
    prioritized.push("trust");
  if (missing.includes("before_after")) prioritized.push("before_after");
  if (missing.includes("process")) prioritized.push("process");
  for (const s of missing) {
    if (!prioritized.includes(s)) prioritized.push(s);
    if (prioritized.length >= 3) break;
  }
  if (prioritized.length === 0)
    prioritized.push("before_after", "certifications", "faq");
  const topThree = prioritized.slice(0, 3);
  const reasonMap: Partial<Record<SectionType, string>> = {
    testimonials: `Trust is the #1 conversion driver for ${niche}. ${tf.primary}: ${tf.principle}. Testimonials address the "why should I trust them?" objection before it arises.`,
    trust: `Trust badges and certifications remove perceived risk. Hopkins specificity: real credentials outperform vague "we're the best" claims by 3–5x.`,
    cta_banner: `A mid-page CTA captures visitors who scrolled but haven't committed. Kennedy: every page needs multiple conversion opportunities.`,
    before_after: `Before/after photos are the single most persuasive trust element for ${niche}. Prospects see the real-world result before they commit.`,
    process:
      "Transparency about how you work reduces anxiety. Deiss B/A/B: current state (nervous) → desired state (confident) → bridge (your clear process).",
    faq: "FAQ sections address objections before they become reasons not to call. Sugarman slippery slope: answer the #3 objection, guide to the next easiest section.",
    certifications: `Credentials remove the "are they qualified?" objection. For ${niche}, certifications are direct trust proxies.`,
  };
  return topThree.map((sectionType, idx) => {
    const sc = buildSampleSectionContent(sectionType, niche);
    const reason =
      reasonMap[sectionType] ??
      `Adding a ${sectionType} section improves page completeness and conversion potential for ${nicheCap}.`;
    return {
      id: mkVid(`add_section_${sectionType}_${idx}`),
      previewText: `Add: ${sectionType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} section`,
      fullContent: sc,
      frameworkUsed: idx === 0 ? `${tf.primary} + ${tf.secondary}` : tf.primary,
      frameworkPrinciple: idx === 0 ? tf.principle : tf.secondaryPrinciple,
      reasoningExplanation: reason,
      estimatedLift:
        idx === 0
          ? "High — audit-flagged gap; directly addresses your lowest scoring area."
          : "Medium — completes standard high-converting page structure.",
      variantNumber: idx + 1,
      framework: "Hopkins",
      sectionId: sectionType,
      fieldKey: "heading",
      content: sc,
      reasoning: reason,
    };
  });
}

function buildSampleSectionContent(
  sectionType: SectionType,
  niche: string,
): Record<string, string> {
  const nicheCap = niche.charAt(0).toUpperCase() + niche.slice(1);
  const base: Partial<Record<SectionType, Record<string, string>>> = {
    testimonials: {
      heading: "What [City] Homeowners Say About [Business Name]",
      subheading: "Real results from real customers — no filters",
    },
    trust: {
      heading: "Why [City] Trusts [Business Name]",
      subheading:
        "Licensed, insured, certified — and backed by 500+ five-star reviews",
    },
    cta_banner: {
      heading: "Ready to Get Started? We Make It Easy.",
      subheading: "Same-week appointments available in [City].",
      cta: "Book Your Appointment Today",
    },
    before_after: {
      heading: "See the [Business Name] Difference",
      subheading: "Real jobs. Real results. No stock photos.",
      disclaimer: "Actual client results in [City].",
    },
    process: {
      heading: "How It Works — Simple, Transparent, Reliable",
      subheading: `No surprises. No stress. Just great ${nicheCap.toLowerCase()} service.`,
    },
    faq: {
      heading: "Frequently Asked Questions",
      subheading: "Everything you need to know before you call",
    },
    hero: {
      headline: `[City]'s Top-Rated ${nicheCap} — Trusted, Fast, Guaranteed`,
      subheadline: "Licensed professionals. Upfront pricing. Available now.",
      cta1: "Get a Free Quote",
      cta2: "Call [Phone]",
    },
    services: {
      heading: `Our ${nicheCap} Services`,
      subheading: "Everything you need — done right the first time",
    },
    stats: { heading: "By the Numbers" },
    about: {
      heading: "About [Business Name]",
      body: `A locally owned ${niche} business proudly serving [City] since [Year].`,
    },
    contact: {
      heading: "Contact [Business Name]",
      phone: "[Phone]",
      hours: "Mon–Fri 8am–6pm | Emergency: 24/7",
    },
    certifications: {
      heading: "Our Credentials & Certifications",
      subheading: "Fully licensed, insured, and certified",
    },
  };
  return base[sectionType] ?? { heading: `${nicheCap} Section` };
}

// ── Tool 4: Update Color Scheme Recommendation ────────────────────────────────
export function updateColorSchemeRecommendation(
  currentNiche: string,
  _currentTheme: object,
  auditScore: AuditScore | null,
): WebsiteAgentVariant[] {
  type P = {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    rationale: string;
  };
  const palettes: Record<string, P[]> = {
    plumbing: [
      {
        name: "Emergency Trust",
        primary: "#1e40af",
        secondary: "#dc2626",
        accent: "#facc15",
        bg: "#0f172a",
        rationale:
          "Blue = reliability. Red = urgency for 24/7 calls. High contrast on dark bg maximizes readability in emergency states.",
      },
      {
        name: "Local Authority",
        primary: "#0369a1",
        secondary: "#0891b2",
        accent: "#f97316",
        bg: "#f8fafc",
        rationale:
          "Clean, professional palette that reads as established and trustworthy without the fear-response of emergency red.",
      },
      {
        name: "Warm Community",
        primary: "#1d4ed8",
        secondary: "#2563eb",
        accent: "#f59e0b",
        bg: "#eff6ff",
        rationale:
          "Lighter, friendly variant — positions as the neighborhood plumber rather than emergency operator.",
      },
    ],
    hvac: [
      {
        name: "Cool Comfort",
        primary: "#0ea5e9",
        secondary: "#0284c7",
        accent: "#22d3ee",
        bg: "#f0f9ff",
        rationale:
          "Blue and cyan tones evoke air, coolness, and comfort — aligns with the core emotional benefit of HVAC.",
      },
      {
        name: "Seasonal Authority",
        primary: "#1d4ed8",
        secondary: "#0f172a",
        accent: "#06b6d4",
        bg: "#f8fafc",
        rationale:
          "Technical authority palette — projects expertise and precision for commercial/technical positioning.",
      },
      {
        name: "Warm & Efficient",
        primary: "#ea580c",
        secondary: "#0ea5e9",
        accent: "#f97316",
        bg: "#fff7ed",
        rationale:
          "Warm tones reference heating season — ideal for winter-focused positioning.",
      },
    ],
    "med-spa": [
      {
        name: "Luxury Dark",
        primary: "#c084fc",
        secondary: "#1e1b2e",
        accent: "#f0abfc",
        bg: "#0d0b1a",
        rationale:
          "Dark luxury palette projects premium positioning. Purple/violet hues are aspirational and associated with prestige treatments.",
      },
      {
        name: "Clean Clinical",
        primary: "#0284c7",
        secondary: "#f0f9ff",
        accent: "#7c3aed",
        bg: "#ffffff",
        rationale:
          "Bright, medical-grade white communicates cleanliness, safety, and evidence-based care.",
      },
      {
        name: "Rose Gold Premium",
        primary: "#be185d",
        secondary: "#fdf2f8",
        accent: "#f59e0b",
        bg: "#fff1f2",
        rationale:
          "Rose/blush tones project femininity and premium beauty — strong for female-skewed clientele.",
      },
    ],
    restoration: [
      {
        name: "Crisis Response",
        primary: "#ea580c",
        secondary: "#1e293b",
        accent: "#facc15",
        bg: "#0f1b2e",
        rationale:
          "Orange urgency on dark background projects 24/7 readiness and immediate action.",
      },
      {
        name: "Recovery Care",
        primary: "#0369a1",
        secondary: "#e0f2fe",
        accent: "#7c3aed",
        bg: "#f8fafc",
        rationale:
          "Calming blue for empathetic, process-focused positioning — projects care and control after disaster.",
      },
      {
        name: "Insurance Authority",
        primary: "#1e40af",
        secondary: "#dbeafe",
        accent: "#0ea5e9",
        bg: "#f0f9ff",
        rationale:
          "Professional insurance-adjuster-aligned palette — projects the systematic, authoritative approach.",
      },
    ],
    "carpet-cleaning": [
      {
        name: "Fresh & Clean",
        primary: "#059669",
        secondary: "#d1fae5",
        accent: "#f59e0b",
        bg: "#f0fdf4",
        rationale:
          "Green = fresh, natural, safe for kids and pets. Warm accent suggests approachability for family-oriented positioning.",
      },
      {
        name: "Commercial Pro",
        primary: "#1e40af",
        secondary: "#eff6ff",
        accent: "#0ea5e9",
        bg: "#f8fafc",
        rationale:
          "Professional blue for commercial B2B positioning — projects scale and reliability.",
      },
      {
        name: "Before & After Impact",
        primary: "#7c3aed",
        secondary: "#f3f0ff",
        accent: "#f97316",
        bg: "#fafafa",
        rationale:
          "Purple + contrast orange creates high visual impact for before/after showcasing.",
      },
    ],
    roofing: [
      {
        name: "Storm Protection",
        primary: "#1e3a5f",
        secondary: "#64748b",
        accent: "#f59e0b",
        bg: "#0f172a",
        rationale:
          "Navy/slate projects strength, durability, and storm-readiness. Gold accent suggests quality investment.",
      },
      {
        name: "Premium Install",
        primary: "#1e40af",
        secondary: "#dbeafe",
        accent: "#dc2626",
        bg: "#f8fafc",
        rationale:
          "Clean professional blue with red urgency — insurance claim and referral-based positioning.",
      },
      {
        name: "Local Craftsman",
        primary: "#92400e",
        secondary: "#fef3c7",
        accent: "#78350f",
        bg: "#fffbeb",
        rationale:
          "Warm earthy palette evokes craftsmanship and long-term investment.",
      },
    ],
  };
  const np = palettes[currentNiche.toLowerCase()] ?? palettes.plumbing;
  const auditNote =
    auditScore && (auditScore.trustScore ?? 100) < 60
      ? " Your trust score is below 60 — a more authoritative palette directly impacts perceived credibility."
      : auditScore && (auditScore.ctaScore ?? 100) < 60
        ? " Your CTA score is below 60 — a higher-contrast accent color will improve CTA visibility."
        : "";
  return np.slice(0, 3).map((p, idx) => ({
    id: mkVid(`color_${p.name.replace(/\s+/g, "_").toLowerCase()}_${idx}`),
    previewText: `${p.name} — Primary: ${p.primary}, Accent: ${p.accent}`,
    fullContent: {
      primaryColor: p.primary,
      secondaryColor: p.secondary,
      accentColor: p.accent,
      bgColor: p.bg,
      paletteName: p.name,
    },
    frameworkUsed: idx === 0 ? "David Ogilvy" : "Claude Hopkins",
    frameworkPrinciple:
      idx === 0
        ? "Research-first — color psychology for your specific niche and buyer type"
        : "Specificity — precise color choices tied to measurable conversion outcomes",
    reasoningExplanation: p.rationale + auditNote,
    estimatedLift:
      idx === 0
        ? "High — primary palette optimized for your niche's emotional triggers."
        : "Medium — alternative positioning for different audience segments.",
    variantNumber: idx + 1,
    framework: "Ogilvy" as FrameworkName,
    sectionId: "theme",
    fieldKey: "primaryColor",
    content: { primaryColor: p.primary },
    reasoning: p.rationale,
  }));
}

// ── Tool 5: Reorder Sections Recommendation ───────────────────────────────────
export function reorderSectionsRecommendation(
  sections: NicheWebsiteSection[],
  niche: string,
  auditScore: AuditScore | null,
): WebsiteAgentVariant[] {
  const ids = sections.filter((s) => s.visible).map((s) => s.type);
  const coldOrder: SectionType[] = [
    "hero",
    "stats",
    "trust",
    "services",
    "testimonials",
    "before_after",
    "process",
    "faq",
    "cta_banner",
    "contact",
    "about",
    "certifications",
  ];
  const warmOrder: SectionType[] = [
    "hero",
    "services",
    "testimonials",
    "stats",
    "before_after",
    "trust",
    "process",
    "certifications",
    "faq",
    "cta_banner",
    "contact",
    "about",
  ];
  const hotOrder: SectionType[] = [
    "hero",
    "cta_banner",
    "services",
    "testimonials",
    "trust",
    "stats",
    "process",
    "faq",
    "before_after",
    "certifications",
    "about",
    "contact",
  ];
  function reorderBy(
    current: SectionType[],
    template: SectionType[],
  ): SectionType[] {
    return [
      ...template.filter((t) => current.includes(t)),
      ...current.filter((t) => !template.includes(t)),
    ];
  }
  const coldR = reorderBy(ids, coldOrder);
  const warmR = reorderBy(ids, warmOrder);
  const hotR = reorderBy(ids, hotOrder);
  const auditNote =
    auditScore && (auditScore.trustScore ?? 100) < 60
      ? " Low trust score — cold traffic order (trust-building first) is recommended."
      : auditScore && (auditScore.conversionScore ?? 0) > 70
        ? " Strong conversion path — warm/hot ordering to reduce friction is a good next step."
        : "";
  return [
    {
      id: mkVid("reorder_cold"),
      previewText: `Cold Traffic Order: ${coldR.slice(0, 4).join(" → ")}...`,
      fullContent: {
        sectionOrder: coldR.join(","),
        trafficType: "cold",
        description:
          "Problem-first order — best for traffic that doesn't know you yet (SEO, cold ads)",
      },
      frameworkUsed: "Eugene Schwartz",
      frameworkPrinciple:
        "Awareness Spectrum — cold audience needs trust-building before any offer",
      reasoningExplanation: `Schwartz's awareness framework: cold traffic has the problem but doesn't yet know your solution. Lead with trust signals before presenting your offer.${auditNote}`,
      estimatedLift:
        "High for cold SEO/ad traffic — trust-first reduces bounce rate by 20–35%.",
      variantNumber: 1,
      framework: "Schwartz",
      sectionId: "layout",
      fieldKey: "sectionOrder",
      content: { sectionOrder: coldR.join(",") },
      reasoning: `Cold traffic trust-first order for ${niche}`,
    },
    {
      id: mkVid("reorder_warm"),
      previewText: `Warm Traffic Order: ${warmR.slice(0, 4).join(" → ")}...`,
      fullContent: {
        sectionOrder: warmR.join(","),
        trafficType: "warm",
        description:
          "Solution-first order — for retargeting, referrals, and review-site traffic",
      },
      frameworkUsed: "Ryan Deiss",
      frameworkPrinciple:
        "Customer Value Journey — warm traffic is in 'evaluate' stage, needs proof not education",
      reasoningExplanation:
        "Deiss CVJ: warm visitors already understand the problem. They need proof you're the right choice. Lead with services and testimonials to accelerate the comparison stage.",
      estimatedLift:
        "High for referral + retargeting traffic — reduces time-to-decision by 40–60%.",
      variantNumber: 2,
      framework: "Deiss",
      sectionId: "layout",
      fieldKey: "sectionOrder",
      content: { sectionOrder: warmR.join(",") },
      reasoning: `Warm traffic solution-first order for ${niche}`,
    },
    {
      id: mkVid("reorder_hot"),
      previewText: `Hot Traffic Order: ${hotR.slice(0, 4).join(" → ")}...`,
      fullContent: {
        sectionOrder: hotR.join(","),
        trafficType: "hot",
        description:
          "CTA-first order — for emergency searches and high-intent traffic ready to book",
      },
      frameworkUsed: "Dan Kennedy",
      frameworkPrinciple:
        "Direct Response — hot leads need a clear action path immediately",
      reasoningExplanation: `Kennedy's rule: when someone searches "emergency ${niche} near me" at 2am, they need a phone number and CTA above the fold. CTA-first order for ${niche} hot traffic can increase emergency call conversion by 50–80%.`,
      estimatedLift:
        "Very High for emergency/high-intent traffic — CTA visibility directly determines conversion rate.",
      variantNumber: 3,
      framework: "Kennedy",
      sectionId: "layout",
      fieldKey: "sectionOrder",
      content: { sectionOrder: hotR.join(",") },
      reasoning: `Hot traffic CTA-first order for ${niche}`,
    },
  ];
}

// ── Tool 6: Image Recommendation ─────────────────────────────────────────────
export function generateImageRecommendation(
  sectionId: string,
  sectionType: SectionType,
  niche: string,
): WebsiteAgentVariant[] {
  const guideMap: Record<string, Partial<Record<SectionType, string[]>>> = {
    plumbing: {
      hero: [
        "Technician in uniform arriving at front door — daylight, professional, clean truck visible",
        "Close-up of hands fixing pipe leak with tools — action shot, before/after implication",
        "Split image: burst pipe disaster vs. clean repaired pipe",
      ],
      testimonials: [
        "Photo of homeowner at front door smiling — real, authentic-feeling",
        "Screenshot-style review cards from Google with star ratings visible",
        "Before/after of job site with homeowner visible",
      ],
    },
    hvac: {
      hero: [
        "Technician on ladder servicing outdoor AC unit — summer context, branded uniform",
        "Family comfortable at home in front of AC vent — lifestyle, comfort",
        "NATE certified badge prominently displayed alongside technician photo",
      ],
      services: [
        "Before/after ductwork: dirty vs. cleaned — dramatic visual difference",
        "Modern smart thermostat installation — technology + efficiency",
        "Technician testing airflow with digital tool — precision, diagnostic authority",
      ],
    },
    "med-spa": {
      hero: [
        "Confident, glowing client post-treatment — natural look, not clinical",
        "Close-up of provider hands administering precision injection — clinical authority",
        "Luxury spa room: clean lines, mood lighting, premium aesthetic",
      ],
      before_after: [
        "Side-by-side before/after of actual client treatment — authentic, properly consented",
        "Progression photos (3-stage) showing gradual improvement",
        "Close-up detail shots of specific treatment areas before and after",
      ],
    },
    restoration: {
      hero: [
        "Crew in branded work gear at damaged property — urgency, readiness, professionalism",
        "Before: flooded basement / After: clean, dry, restored — most powerful single image",
        "Truck with equipment arriving quickly — 24/7 urgency implied",
      ],
    },
    "carpet-cleaning": {
      hero: [
        "Half-cleaned carpet showing dramatic before/after from single cleaning pass",
        "Happy family with clean carpet, kid and pet visible — lifestyle, safe home",
        "Close-up of steam cleaning wand on carpet — the process made visible",
      ],
      before_after: [
        "Room-wide before/after carpet cleaning — shows full transformation scale",
        "Close-up stain removal before/after — specific, dramatic, proof-based",
        "Pet stain treatment sequence — 3-step photo: stain, treatment, clean",
      ],
    },
    roofing: {
      hero: [
        "Finished premium roof installation — curb appeal story, investment payoff visible",
        "Storm damage close-up next to finished repair — urgency + problem/solution",
        "Crew working on roof — scale, professionalism, safety equipment visible",
      ],
    },
  };
  const guides = guideMap[niche.toLowerCase()] ?? guideMap.plumbing ?? {};
  const sectionGuides = guides[sectionType] ?? [
    `Professional action photo of ${niche} work in progress — authentic, not stock photography`,
    `Before/after visual showing real job result in ${niche} — high contrast, genuine transformation`,
    "Team photo in branded uniforms — builds trust and humanizes the business",
  ];
  const fps = [
    {
      framework: "Hopkins" as FrameworkName,
      principle: "Specificity — real photos outperform stock every single time",
    },
    {
      framework: "Halbert" as FrameworkName,
      principle:
        "PAS visual — show the problem, the transformation, the outcome",
    },
    {
      framework: "Ogilvy" as FrameworkName,
      principle:
        "Research-first — the image is the ad; make it do specific work",
    },
  ];
  return sectionGuides.slice(0, 3).map((guide, idx) => {
    const fp = fps[idx];
    return {
      id: mkVid(`image_${sectionType}_${idx}`),
      previewText: guide.slice(0, 80) + (guide.length > 80 ? "..." : ""),
      fullContent: {
        imageDescription: guide,
        sectionId,
        sectionType,
        niche,
        imageStrategy:
          idx === 0 ? "primary" : idx === 1 ? "before_after" : "team_trust",
      },
      frameworkUsed: fp.framework,
      frameworkPrinciple: fp.principle,
      reasoningExplanation: `${fp.framework}: ${fp.principle}. For ${niche}, this image strategy works because it ${idx === 0 ? "shows the real outcome the visitor wants — they're buying the result, not the service" : idx === 1 ? "creates a problem/solution visual story that converts better than descriptive text alone" : "builds human trust — customers invite you into their home; seeing your team first reduces anxiety"}.`,
      estimatedLift:
        idx === 0
          ? "High — authentic action photos for service businesses outperform stock by 45–80% in engagement."
          : "Medium-High — visual proof reduces the single biggest objection in your niche.",
      variantNumber: idx + 1,
      framework: fp.framework,
      sectionId,
      fieldKey: "imageUrl",
      content: { imageDescription: guide },
      reasoning: fp.principle,
    };
  });
}

// ── Proactive Suggestion Generator ───────────────────────────────────────────
export function generateProactiveSuggestions(
  config: ClientWebsiteConfig,
  auditScore: AuditScore | null,
  settingsOrNiche: WebsiteAgentSettings | string,
): ProactiveSuggestion[] {
  // Handle legacy signature: generateProactiveSuggestions(config, auditScore, niche: string)
  const isLegacy = typeof settingsOrNiche === "string";
  const niche = isLegacy ? (settingsOrNiche as string) : "service";
  const settings = isLegacy ? null : (settingsOrNiche as WebsiteAgentSettings);
  const suggestions: ProactiveSuggestion[] = [];
  const hidden = config.customizations.hiddenSections ?? [];
  const overrides = config.customizations.sectionOverrides ?? {};
  const cta = auditScore?.ctaScore ?? 70;
  const trust = auditScore?.trustScore ?? 70;
  const seo = auditScore?.seoBasics ?? 70;
  const conversion = auditScore?.conversionScore ?? 70;
  const offerClarity = auditScore?.offerClarity ?? 70;

  if (cta < 65) {
    suggestions.push({
      id: `sugg-cta-${Date.now()}`,
      priority: 1,
      sectionId: "hero",
      issueType: "low-cta",
      issueDescription: `Your CTA score is ${cta}/100. Visitors are not being given a clear enough next step.`,
      suggestedAction:
        "Rewrite your hero CTA using the Kennedy direct-response formula — one clear offer, one specific benefit, one immediate ask. Avoid 'Contact Us' and 'Learn More.'",
      estimatedImpact:
        "25–45% improvement in click-through rate on the primary CTA.",
      frameworkRecommended: "Dan Kennedy — Direct Response Fundamentals",
      issue: `CTA score is ${cta}/100`,
      action: "Rewrite hero CTA with Kennedy formula",
      framework: "Kennedy",
      priority_level: "high",
    });
  }
  if (trust < 65) {
    suggestions.push({
      id: `sugg-trust-${Date.now() + 1}`,
      priority: 2,
      sectionId: "trust",
      issueType: "weak-trust",
      issueDescription: `Trust score is ${trust}/100. Visitors are not seeing enough proof that you're the safe, credible choice.`,
      suggestedAction:
        "Add a testimonials section with 3 specific, named reviews. Include review count, star rating, and at least one credential badge.",
      estimatedImpact:
        "Trust signals reduce bounce rate by 20–35% and increase form submission rate by 30–50%.",
      frameworkRecommended: "Jay Abraham — Strategy of Preeminence",
      issue: `Trust score is ${trust}/100`,
      action: "Add testimonials + trust badges",
      framework: "Abraham",
      priority_level: "high",
    });
  }
  if (seo < 65) {
    suggestions.push({
      id: `sugg-seo-${Date.now() + 2}`,
      priority: 3,
      sectionId: "hero",
      issueType: "weak-headline",
      issueDescription: `SEO basics score is ${seo}/100. Your headline isn't signaling relevance to search engines or communicating urgency to visitors.`,
      suggestedAction:
        "Rewrite the hero headline to include: niche keyword, city, and a specific benefit or urgency signal.",
      estimatedImpact:
        "Specific headlines with location + niche signal improve both search relevance and on-page conversion.",
      frameworkRecommended: "David Ogilvy — Headline Power & Research-First",
      issue: `SEO basics score is ${seo}/100`,
      action: "Add niche keyword + city to headline",
      framework: "Ogilvy",
      priority_level: "medium",
    });
  }
  if (
    !auditScore &&
    !hidden.includes("testimonials") &&
    !overrides.testimonials
  ) {
    suggestions.push({
      id: `sugg-testimonials-${Date.now() + 3}`,
      priority: 4,
      sectionId: "testimonials",
      issueType: "low-social-proof",
      issueDescription:
        "No active testimonials section detected. Social proof is the #1 trust driver for local service businesses.",
      suggestedAction:
        "Add a testimonials section with 3 named, specific customer reviews including the problem solved.",
      estimatedImpact:
        "Adding specific testimonials increases contact form submissions by 34% on average.",
      frameworkRecommended: "Claude Hopkins — Specificity & Precision",
      issue: "No testimonials section",
      action: "Add testimonials section",
      framework: "Hopkins",
      priority_level: "medium",
    });
  }
  if (offerClarity < 60) {
    suggestions.push({
      id: `sugg-urgency-${Date.now() + 4}`,
      priority: settings?.tone === "urgent" ? 2 : 5,
      sectionId: "cta_banner",
      issueType: "no-urgency",
      issueDescription: `Offer clarity score is ${offerClarity}/100. Visitors cannot quickly understand what you offer or why they should act now.`,
      suggestedAction:
        "Add a mid-page CTA banner with a time-or-scarcity element. Examples: 'Limited appointments this week' or 'Book today — we're available now.'",
      estimatedImpact:
        "Mid-page CTAs with urgency signals capture 20–40% of visitors who scrolled past the hero but hadn't converted.",
      frameworkRecommended: "Sabri Suby — PASTOR Framework",
      issue: `Offer clarity score is ${offerClarity}/100`,
      action: "Add mid-page CTA banner with urgency",
      framework: "Suby",
      priority_level: "medium",
    });
  }
  if (conversion < 60) {
    suggestions.push({
      id: `sugg-conv-${Date.now() + 5}`,
      priority: 6,
      sectionId: "process",
      issueType: "conversion",
      issueDescription: `Conversion score is ${conversion}/100 — the page flow doesn't move visitors from interest to action.`,
      suggestedAction:
        "Add a process section showing exactly how to get started — reduce the perceived steps to one click.",
      estimatedImpact:
        "Clear process sections reduce decision friction and improve conversion rates.",
      frameworkRecommended: "Ryan Deiss — Before/After/Bridge",
      issue: `Conversion score is ${conversion}/100`,
      action: "Add process section",
      framework: "Deiss",
      priority_level: "medium",
    });
  }
  if (suggestions.length < 3) {
    suggestions.push({
      id: `sugg-gen-${Date.now() + 6}`,
      priority: 10,
      sectionId: "hero",
      issueType: "general",
      issueDescription: `Your ${niche} website could better showcase social proof above the fold.`,
      suggestedAction:
        "Move at least one real review excerpt or star-rating badge into the hero section.",
      estimatedImpact:
        "Above-the-fold social proof can increase trust and reduce bounce rates.",
      frameworkRecommended: "Jay Abraham — Strategy of Preeminence",
      issue: `${niche} website needs social proof above the fold`,
      action: "Move review excerpt into hero",
      framework: "Abraham",
      priority_level: "low",
    });
  }
  return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

// ── Request Router ────────────────────────────────────────────────────────────
export function requestRouter(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes("headline") || msg.includes("title") || msg.includes("hero"))
    return "rewrite_section:hero";
  if (
    msg.includes("cta") ||
    msg.includes("button") ||
    msg.includes("call to action") ||
    msg.includes("call-to-action")
  )
    return "generate_cta";
  if (
    msg.includes("add") ||
    msg.includes("missing") ||
    msg.includes("include") ||
    msg.includes("need a section") ||
    msg.includes("testimonial") ||
    msg.includes("trust section") ||
    msg.includes("review section")
  )
    return "add_section";
  if (
    msg.includes("color") ||
    msg.includes("theme") ||
    msg.includes("palette") ||
    msg.includes("design") ||
    msg.includes("look")
  )
    return "update_color_scheme";
  if (
    msg.includes("order") ||
    msg.includes("move") ||
    msg.includes("rearrange") ||
    msg.includes("structure") ||
    msg.includes("layout")
  )
    return "reorder_sections";
  if (
    msg.includes("image") ||
    msg.includes("photo") ||
    msg.includes("picture") ||
    msg.includes("visual") ||
    msg.includes("banner")
  )
    return "swap_image";
  if (msg.includes("service") || msg.includes("offering"))
    return "rewrite_section:services";
  if (msg.includes("about") || msg.includes("story"))
    return "rewrite_section:about";
  if (msg.includes("testimonial") || msg.includes("review"))
    return "rewrite_section:testimonials";
  if (msg.includes("faq") || msg.includes("question"))
    return "rewrite_section:faq";
  return "rewrite_section:hero";
}

// ── Process Agent Request (new spec-aligned signature) ────────────────────────
export function processAgentRequest(
  requestOrMessage: WebsiteAgentRequest | string,
  memoryOrConfig: WebsiteAgentMemory | ClientWebsiteConfig,
  settingsOrAudit: WebsiteAgentSettings | AuditScore | null,
  nicheArg?: string,
  clientIdArg?: string,
): WebsiteAgentResponse {
  // Detect legacy call: processAgentRequest(userMessage, config, auditScore, niche, clientId)
  if (typeof requestOrMessage === "string") {
    const userMessage = requestOrMessage;
    const config = memoryOrConfig as ClientWebsiteConfig;
    const auditScore = settingsOrAudit as AuditScore | null;
    const niche = nicheArg ?? "plumbing";
    const clientId = clientIdArg ?? "default";
    const settings = loadAgentSettings(clientId);
    const memory = loadMemory(clientId);
    const msg = userMessage.toLowerCase();
    const isHeadline =
      msg.includes("headline") || msg.includes("hero") || msg.includes("title");
    const isCta =
      msg.includes("cta") ||
      msg.includes("call to action") ||
      msg.includes("button") ||
      msg.includes("click");
    const isTrust =
      msg.includes("trust") ||
      msg.includes("review") ||
      msg.includes("testimonial") ||
      msg.includes("badge");
    const isUrgent =
      msg.includes("urgent") ||
      msg.includes("emergency") ||
      msg.includes("faster");
    const isServices = msg.includes("service") || msg.includes("offering");
    const frameworks: FrameworkName[] = [
      "Hormozi",
      "Kennedy",
      "Ogilvy",
      "Halbert",
      "Schwartz",
      "Abraham",
      "Sugarman",
      "Hopkins",
      "Deiss",
      "Suby",
    ];
    let selectedFrameworks: FrameworkName[];
    if (isHeadline && isUrgent)
      selectedFrameworks = ["Kennedy", "Halbert", "Suby"];
    else if (isHeadline) selectedFrameworks = ["Hormozi", "Ogilvy", "Hopkins"];
    else if (isCta) selectedFrameworks = ["Hormozi", "Deiss", "Schwartz"];
    else if (isTrust) selectedFrameworks = ["Hopkins", "Abraham", "Ogilvy"];
    else if (isServices) selectedFrameworks = ["Kennedy", "Sugarman", "Suby"];
    else {
      const offset = (memory.appliedChangesCount ?? 0) % 7;
      selectedFrameworks = [
        frameworks[offset % 10],
        frameworks[(offset + 3) % 10],
        frameworks[(offset + 6) % 10],
      ];
    }
    const targetSectionId =
      isHeadline || isCta ? "hero" : isServices ? "services" : "hero";
    const targetField = isCta ? "cta1" : "headline";
    const heroOverrides = config.customizations.sectionOverrides.hero ?? {};
    const currentHeadline =
      (heroOverrides.headline as string) ?? "Your Business Headline";
    const variants: WebsiteAgentVariant[] = selectedFrameworks.map(
      (framework, idx) => {
        if (isCta) {
          const cv = getFrameworkCtaVariant(
            framework,
            settings.ctaStyle as CtaStyle,
            niche,
          );
          return {
            id: `variant-${Date.now()}-${idx}`,
            variantNumber: idx + 1,
            framework,
            sectionId: targetSectionId,
            fieldKey: "cta1",
            content: { cta1: cv.cta },
            previewText: cv.cta.slice(0, 100),
            reasoning: cv.reasoning,
            fullContent: { cta1: cv.cta },
            frameworkUsed: framework,
            frameworkPrinciple: cv.reasoning,
            reasoningExplanation: cv.reasoning,
            estimatedLift: "High",
          };
        }
        const hv = getFrameworkHeadlineVariant(
          framework,
          niche,
          currentHeadline,
          settings.tone,
        );
        return {
          id: `variant-${Date.now()}-${idx}`,
          variantNumber: idx + 1,
          framework,
          sectionId: targetSectionId,
          fieldKey: targetField,
          content: { [targetField]: hv.headline },
          previewText: hv.headline.slice(0, 100),
          reasoning: hv.reasoning,
          fullContent: { [targetField]: hv.headline },
          frameworkUsed: framework,
          frameworkPrinciple: hv.reasoning,
          reasoningExplanation: hv.reasoning,
          estimatedLift: "High",
        };
      },
    );
    let responseText = `Here are 3 versions for your ${isHeadline ? "headline" : isCta ? "call-to-action" : "copy"}, each built on a different proven framework. `;
    if (auditScore) {
      const weakArea =
        (auditScore.ctaScore ?? 70) < 65
          ? "CTA strength"
          : (auditScore.trustScore ?? 70) < 65
            ? "trust signals"
            : null;
      if (weakArea)
        responseText += `Based on your audit data, your ${weakArea} has room to improve — these variations directly address that. `;
    }
    if ((memory.appliedChangesCount ?? 0) > 0)
      responseText += `I've noted your preference from previous edits and tuned these toward a ${settings.tone} tone. `;
    responseText +=
      "Pick the one that resonates — I'll apply it instantly to your live preview.";
    return {
      message: responseText,
      responseText,
      variants,
      toolUsed: "legacy",
      frameworkCited: selectedFrameworks.join("+"),
      reasoning: responseText,
    };
  }

  // New spec-aligned call: processAgentRequest(request, memory, settings)
  const request = requestOrMessage as WebsiteAgentRequest;
  const memory = memoryOrConfig as WebsiteAgentMemory;
  const settings = settingsOrAudit as WebsiteAgentSettings;
  const routeResult = requestRouter(request.message);
  const [tool, toolParam] = routeResult.split(":");
  const tf = TONE_FRAMEWORK_MAP[settings.tone];
  const niche = request.niche;
  let variants: WebsiteAgentVariant[] = [];
  let responseMessage = "";
  let frameworkCited = tf.primary;
  let reasoning = tf.principle;

  switch (tool) {
    case "rewrite_section": {
      const targetSection = toolParam ?? request.targetSectionId ?? "hero";
      variants = rewriteSection(
        targetSection,
        targetSection as SectionType,
        request.currentContent ?? {},
        niche,
        settings,
        memory,
      );
      responseMessage = `I've generated 3 rewrite variants for your ${targetSection} section using ${tf.primary} and ${tf.secondary} frameworks. Each takes a different angle — pick the one that feels most authentic, or ask me to blend elements.`;
      frameworkCited = `${tf.primary} + ${tf.secondary}`;
      reasoning = `${tf.principle}. Variant selection driven by your '${settings.tone}' tone and '${settings.offerFramework}' offer framework setting.`;
      break;
    }
    case "generate_cta": {
      const currentCta =
        request.currentContent?.cta1 ??
        request.currentContent?.cta ??
        "Contact Us";
      variants = generateCtaVariants(currentCta, niche, settings);
      responseMessage = `Here are 3 CTA variants optimized for ${niche} conversion. Variant 1 uses Kennedy's direct-ask formula, Variant 2 uses Sugarman's curiosity-hook, and Variant 3 combines Hopkins specificity with Ogilvy social proof.`;
      frameworkCited = "Kennedy + Sugarman + Hopkins + Ogilvy";
      reasoning =
        "CTA selection driven by ctaStyle setting and niche-specific conversion patterns.";
      break;
    }
    case "add_section": {
      const existingTypes =
        request.existingSectionTypes ??
        request.sections?.map((s) => s.type) ??
        (["hero", "services", "contact"] as SectionType[]);
      variants = addSectionRecommendation(
        existingTypes,
        niche,
        request.auditScore ?? null,
        settings,
      );
      responseMessage =
        "Based on your current sections and audit data, here are the 3 highest-impact sections to add. Each is ranked by conversion potential and backed by a specific framework rationale.";
      frameworkCited = tf.primary;
      reasoning =
        "Section recommendations prioritized by audit score gaps and conversion value.";
      break;
    }
    case "update_color_scheme": {
      variants = updateColorSchemeRecommendation(
        niche,
        request.currentTheme ?? {},
        request.auditScore ?? null,
      );
      responseMessage = `Here are 3 color palette options optimized for ${niche}. Each is built around the psychological triggers that drive conversion in your market.`;
      frameworkCited = "David Ogilvy + Claude Hopkins";
      reasoning =
        "Color selection tied to niche-specific emotional triggers and buyer psychology.";
      break;
    }
    case "reorder_sections": {
      variants = reorderSectionsRecommendation(
        request.sections ?? [],
        niche,
        request.auditScore ?? null,
      );
      responseMessage =
        "Here are 3 section orderings optimized for different traffic temperatures. Cold traffic needs trust-building first. Warm traffic needs proof-first. Hot/emergency traffic needs the CTA immediately.";
      frameworkCited = "Eugene Schwartz + Ryan Deiss + Dan Kennedy";
      reasoning =
        "Section order based on prospect awareness level — Schwartz's awareness spectrum applied to page architecture.";
      break;
    }
    case "swap_image": {
      const targetSectionId = request.targetSectionId ?? "hero";
      variants = generateImageRecommendation(
        targetSectionId,
        (request.currentContent?.sectionType as SectionType) ?? "hero",
        niche,
      );
      responseMessage = `Here are 3 image strategies for your ${targetSectionId} section. Authentic action photos and before/after visuals consistently outperform stock photography by 45–80% in engagement.`;
      frameworkCited = "Claude Hopkins + Gary Halbert + David Ogilvy";
      reasoning =
        "Image strategy based on visual proof principles — real images of real work build trust that stock photos cannot.";
      break;
    }
    default: {
      const suggs = generateProactiveSuggestions(
        {
          tenantId: request.clientId,
          websiteId: "",
          isPublished: false,
          editingLocked: false,
          customizations: { sectionOverrides: {}, hiddenSections: [] },
          lastUpdated: new Date().toISOString(),
        },
        request.auditScore ?? null,
        settings,
      );
      if (suggs.length > 0) {
        const top = suggs[0];
        responseMessage = `Here's my top recommendation: ${top.suggestedAction} — ${top.estimatedImpact} (Framework: ${top.frameworkRecommended})`;
      } else {
        responseMessage =
          "I can help you rewrite any section, generate CTA variants, recommend sections to add, optimize your color palette, or suggest the best section order for your traffic type. What would you like to work on?";
      }
    }
  }

  return {
    message: responseMessage,
    variants: variants.length > 0 ? variants : undefined,
    toolUsed: tool,
    frameworkCited,
    reasoning,
    responseText: responseMessage,
  };
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const MK = (id: string) => `website_agent_memory_${id}`;
const MK_LEGACY = (id: string) => `brf_website_agent_memory_${id}`;
const SK = (id: string) => `website_agent_settings_${id}`;
const SK_LEGACY = (id: string) => `brf_website_agent_settings_${id}`;

export function loadMemory(clientId: string): WebsiteAgentMemory {
  try {
    const raw =
      localStorage.getItem(MK(clientId)) ??
      localStorage.getItem(MK_LEGACY(clientId));
    if (raw) {
      const p = JSON.parse(raw) as Partial<WebsiteAgentMemory> & {
        lastEditedSection?: string;
        tonePreference?: string;
        appliedChangesCount?: number;
        recentChanges?: {
          sectionId: string;
          field: string;
          timestamp: number;
        }[];
      };
      return {
        clientId,
        sessionHistory: p.sessionHistory ?? [],
        appliedChanges: p.appliedChanges ?? [],
        tonePreference: p.tonePreference,
        frameworkPreference: p.frameworkPreference,
        lastEditedSection: p.lastEditedSection,
        appliedChangesCount: p.appliedChangesCount ?? 0,
        recentChanges: p.recentChanges ?? [],
      };
    }
  } catch {
    /* ignore */
  }
  return {
    clientId,
    sessionHistory: [],
    appliedChanges: [],
    appliedChangesCount: 0,
    recentChanges: [],
  };
}

export function saveMemory(memory: WebsiteAgentMemory): void {
  try {
    localStorage.setItem(MK(memory.clientId), JSON.stringify(memory));
  } catch {
    /* ignore */
  }
}

// updateMemoryWithChange supports both new signature (memory, artifact) and legacy (clientId, sectionId, field)
export function updateMemoryWithChange(
  memOrClientId: WebsiteAgentMemory | string,
  artifactOrSectionId: WebsiteAgentArtifact | string,
  fieldArg?: string,
): WebsiteAgentMemory {
  if (typeof memOrClientId === "string") {
    const clientId = memOrClientId;
    const sectionId =
      typeof artifactOrSectionId === "string" ? artifactOrSectionId : "";
    const field = fieldArg ?? "";
    const mem = loadMemory(clientId);
    const updated: WebsiteAgentMemory = {
      ...mem,
      lastEditedSection: sectionId,
      appliedChangesCount: (mem.appliedChangesCount ?? 0) + 1,
      recentChanges: [
        { sectionId, field, timestamp: Date.now() },
        ...(mem.recentChanges ?? []).slice(0, 4),
      ],
    };
    saveMemory(updated);
    return updated;
  }
  const memory = memOrClientId as WebsiteAgentMemory;
  const artifact = artifactOrSectionId as WebsiteAgentArtifact;
  const updated: WebsiteAgentMemory = {
    ...memory,
    appliedChanges: [artifact, ...(memory.appliedChanges ?? [])].slice(0, 50),
    lastEditedSection: artifact.sectionId,
    appliedChangesCount: (memory.appliedChangesCount ?? 0) + 1,
    recentChanges: [
      {
        sectionId: artifact.sectionId,
        field: artifact.tool,
        timestamp: Date.now(),
      },
      ...(memory.recentChanges ?? []).slice(0, 4),
    ],
  };
  saveMemory(updated);
  return updated;
}

export function clearMemory(clientId: string): void {
  try {
    localStorage.removeItem(MK(clientId));
    localStorage.removeItem(MK_LEGACY(clientId));
  } catch {
    /* ignore */
  }
}

const DEFAULT_SETTINGS: WebsiteAgentSettings = {
  tone: "professional",
  offerFramework: "credibility-first",
  ctaStyle: "direct-ask",
  suggestionsEnabled: true,
};

export function loadAgentSettings(clientId: string): WebsiteAgentSettings {
  try {
    const raw =
      localStorage.getItem(SK(clientId)) ??
      localStorage.getItem(SK_LEGACY(clientId));
    if (raw) {
      const p = JSON.parse(raw) as Record<string, unknown>;
      const tone = ((p.tone as string) ??
        DEFAULT_SETTINGS.tone) as WebsiteAgentSettings["tone"];
      const ctaStyle = (
        (p.ctaStyle as string) ?? DEFAULT_SETTINGS.ctaStyle
      ).replace(/_/g, "-") as WebsiteAgentSettings["ctaStyle"];
      const offerFramework = (
        (p.offerFramework as string) ?? DEFAULT_SETTINGS.offerFramework
      ).replace(/_/g, "-") as WebsiteAgentSettings["offerFramework"];
      const suggestionsEnabled =
        (p.suggestionsEnabled as boolean) ??
        (p.auditDrivenSuggestions as boolean) ??
        true;
      return {
        tone,
        ctaStyle,
        offerFramework,
        suggestionsEnabled,
        clientId: clientId,
        auditDrivenSuggestions: suggestionsEnabled,
      };
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS, clientId, auditDrivenSuggestions: true };
}

// saveAgentSettings supports both new signature (clientId, settings) and legacy (settings with clientId field)
export function saveAgentSettings(
  clientIdOrSettings: string | WebsiteAgentSettings,
  settings?: WebsiteAgentSettings,
): void {
  let clientId: string;
  let s: WebsiteAgentSettings;
  if (typeof clientIdOrSettings === "string") {
    clientId = clientIdOrSettings;
    s = settings!;
  } else {
    clientId = clientIdOrSettings.clientId ?? "default";
    s = clientIdOrSettings;
  }
  try {
    localStorage.setItem(SK(clientId), JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

// ── Framework copy generators (legacy helpers used by existing UI) ─────────────
const nicheMap: Record<string, string> = {
  plumbing: "plumbing emergencies",
  hvac: "HVAC comfort",
  "med-spa": "aesthetic treatments",
  restoration: "property restoration",
  "carpet-cleaning": "carpet cleaning",
  roofing: "roofing solutions",
};

function getFrameworkHeadlineVariant(
  framework: FrameworkName,
  niche: string,
  currentHeadline: string,
  tone: AgentTone,
): { headline: string; reasoning: string } {
  const up =
    tone === "urgent"
      ? "Right Now: "
      : tone === "luxury"
        ? "Exclusively: "
        : "";
  const np = nicheMap[niche] ?? "our services";
  const nc = niche.charAt(0).toUpperCase() + niche.slice(1);
  const vmap: Record<FrameworkName, { headline: string; reasoning: string }> = {
    Hormozi: {
      headline: `${up}Get ${np.replace(/s$/, "")} That Actually Delivers — Guaranteed or It's Free`,
      reasoning:
        "Hormozi Value Stack: leads with a grand slam offer, stacks value, eliminates risk with a guarantee.",
    },
    Kennedy: {
      headline: `${up}The [City] ${nc} Company That Gives You a Straight Answer and a Fair Price`,
      reasoning:
        "Dan Kennedy USP: direct, specific, addresses the core objection (price transparency) immediately.",
    },
    Ogilvy: {
      headline: `How [Business Name] Serves [City] Homeowners Better Than Any Other ${nc} Company`,
      reasoning:
        "Ogilvy research-first: speaks to one person, makes a specific comparative promise.",
    },
    Halbert: {
      headline: `${currentHeadline.split("—")[0].trim()} — And If We Don't Deliver, You Pay Nothing`,
      reasoning:
        "Halbert Problem-Agitate-Solve: takes the existing headline and amplifies it with a risk-reversal.",
    },
    Schwartz: {
      headline: `${up}For [City] Homeowners Who Are Tired of ${np} Companies That Don't Show Up`,
      reasoning:
        "Schwartz awareness-stage copy: speaks directly to a frustrated, aware prospect.",
    },
    Abraham: {
      headline: `Your Trusted ${nc} Authority in [City] — The Only Call You Need to Make`,
      reasoning:
        "Jay Abraham Strategy of Preeminence: positions the business as the obvious expert authority.",
    },
    Sugarman: {
      headline: `The Moment You Call [Phone], Your ${np} Problem Is Already Being Solved`,
      reasoning:
        "Sugarman slippery slope: pulls the reader forward with a vivid, forward-moving image.",
    },
    Hopkins: {
      headline:
        "[City] Homeowners Report: [Business Name] Arrives Within 60 Minutes, 94% of the Time",
      reasoning:
        "Claude Hopkins specificity: a specific, believable claim outperforms vague ones every time.",
    },
    Deiss: {
      headline: `Before Your Next ${np} Crisis — Here's What [City]'s Top-Rated Company Can Do for You`,
      reasoning:
        "Ryan Deiss Before/After/Bridge: sets up the before state, bridges to the after.",
    },
    Suby: {
      headline: `If You're Dealing With ${np} Issues in [City], This Is the Most Important Page You'll Read Today`,
      reasoning:
        "PASTOR framework: opens by calling out the exact problem the visitor is experiencing.",
    },
  };
  return vmap[framework];
}

function getFrameworkCtaVariant(
  framework: FrameworkName,
  ctaStyle: CtaStyle,
  _niche: string,
): { cta: string; reasoning: string } {
  const ctaMap: Record<
    CtaStyle,
    Record<FrameworkName, { cta: string; reasoning: string }>
  > = {
    direct_ask: {
      Hormozi: {
        cta: "Claim Your Free Assessment — No Strings",
        reasoning: "Value-first direct ask.",
      },
      Kennedy: {
        cta: "Call Now for a Straight Answer",
        reasoning: "Direct, no-fluff action.",
      },
      Ogilvy: {
        cta: "Get Your Free Quote Today",
        reasoning: "Low-friction clear ask.",
      },
      Halbert: {
        cta: "Fix the Problem Today — Call Us",
        reasoning: "Problem-solution direct.",
      },
      Schwartz: {
        cta: "Talk to a Real Expert Now",
        reasoning: "Awareness-aware CTA.",
      },
      Abraham: {
        cta: "Get Expert Advice — Free",
        reasoning: "Preeminence positioning.",
      },
      Sugarman: {
        cta: "Start Here — One Click Away",
        reasoning: "Slippery slope entry.",
      },
      Hopkins: {
        cta: "Book in 60 Seconds",
        reasoning: "Specific, believable ease.",
      },
      Deiss: { cta: "See What's Possible", reasoning: "Before/after bridge." },
      Suby: {
        cta: "Yes — I Need This Now",
        reasoning: "PASTOR response trigger.",
      },
    },
    curiosity_hook: {
      Hormozi: {
        cta: "See What $0 Down Looks Like for You",
        reasoning: "Curiosity + offer.",
      },
      Kennedy: {
        cta: "Find Out What Others Won't Tell You",
        reasoning: "USP curiosity.",
      },
      Ogilvy: {
        cta: "Read What 400 Clients Said",
        reasoning: "Research-driven hook.",
      },
      Halbert: {
        cta: "What Would Happen If You Called Right Now?",
        reasoning: "Imaginative hook.",
      },
      Schwartz: {
        cta: "Discover Why [City] Switched to Us",
        reasoning: "Social curiosity.",
      },
      Abraham: {
        cta: "See How Experts Do It Differently",
        reasoning: "Authority curiosity.",
      },
      Sugarman: {
        cta: "Here's the Part Most People Miss",
        reasoning: "Forward pull.",
      },
      Hopkins: {
        cta: "See the Numbers Behind Our Results",
        reasoning: "Specific proof hook.",
      },
      Deiss: { cta: "See the Before & After", reasoning: "Bridge hook." },
      Suby: {
        cta: "Here's What Changes When You Call",
        reasoning: "PASTOR transformation.",
      },
    },
    social_proof: {
      Hormozi: {
        cta: "Join 1,200+ Happy Homeowners",
        reasoning: "Social proof + scale.",
      },
      Kennedy: {
        cta: "See Why 800+ Clients Chose Us",
        reasoning: "Proof-driven USP.",
      },
      Ogilvy: {
        cta: "Read Our 500 Five-Star Reviews",
        reasoning: "Research verification.",
      },
      Halbert: {
        cta: "See Real Results from Real Clients",
        reasoning: "Agitate/solve proof.",
      },
      Schwartz: {
        cta: "Why [City] Trusts Us — Read Their Stories",
        reasoning: "Community trust.",
      },
      Abraham: {
        cta: "See Why Clients Refer Their Friends",
        reasoning: "Preeminence proof.",
      },
      Sugarman: {
        cta: "Read What Happened After One Call",
        reasoning: "Narrative proof.",
      },
      Hopkins: {
        cta: "4.9 Stars — 600+ Verified Reviews",
        reasoning: "Specific credibility.",
      },
      Deiss: {
        cta: "See the Transformation Others Made",
        reasoning: "After state proof.",
      },
      Suby: {
        cta: "Read Stories from People Just Like You",
        reasoning: "Empathy proof.",
      },
    },
    urgency_trigger: {
      Hormozi: {
        cta: "Claim Your Slot — Only 3 Left This Week",
        reasoning: "Scarcity + offer.",
      },
      Kennedy: {
        cta: "Call Before 5pm — Same-Day Available",
        reasoning: "Time-bound USP.",
      },
      Ogilvy: {
        cta: "Book Now — This Week's Slots Filling Fast",
        reasoning: "Research scarcity.",
      },
      Halbert: {
        cta: "Don't Wait — Every Hour Costs More",
        reasoning: "Cost of delay.",
      },
      Schwartz: {
        cta: "Act Now — Your Problem Won't Fix Itself",
        reasoning: "Awareness urgency.",
      },
      Abraham: {
        cta: "Limited Availability — Reserve Your Spot",
        reasoning: "Authority scarcity.",
      },
      Sugarman: {
        cta: "The Sooner You Call, the Easier the Fix",
        reasoning: "Pull-forward urgency.",
      },
      Hopkins: {
        cta: "Book Today — 94% of Calls Same Day",
        reasoning: "Specific urgency proof.",
      },
      Deiss: {
        cta: "Your Before State Ends When You Click Here",
        reasoning: "Bridge urgency.",
      },
      Suby: {
        cta: "Respond Now — This Offer Expires Soon",
        reasoning: "PASTOR response.",
      },
    },
  };
  // Normalize hyphen-style ctaStyle to underscore for lookup
  const key = ctaStyle.replace(/-/g, "_") as CtaStyle;
  return (ctaMap[key] ?? ctaMap.direct_ask)[framework];
}

// ── Tool Registry ─────────────────────────────────────────────────────────────
export const WEBSITE_AGENT_TOOLS: WebsiteAgentTool[] = [
  {
    name: "rewrite_section",
    description:
      "Rewrites any website section using 3 framework-driven variants (Hormozi+Kennedy, Deiss+Abraham, Halbert+PASTOR)",
    keywords: ["rewrite", "headline", "hero", "section", "title", "copy"],
    handler: "rewriteSection",
  },
  {
    name: "generate_cta",
    description:
      "Generates 3 CTA variants using Kennedy direct-ask, Sugarman curiosity-hook, and Hopkins+Ogilvy social-proof styles",
    keywords: ["cta", "button", "call to action", "click", "book", "schedule"],
    handler: "generateCtaVariants",
  },
  {
    name: "add_section",
    description:
      "Recommends the 3 highest-impact sections to add based on audit gaps and conversion value",
    keywords: ["add", "missing", "include", "need", "section"],
    handler: "addSectionRecommendation",
  },
  {
    name: "update_color_scheme",
    description:
      "Recommends 3 niche-optimized color palettes with conversion rationale",
    keywords: ["color", "theme", "palette", "design", "look"],
    handler: "updateColorSchemeRecommendation",
  },
  {
    name: "reorder_sections",
    description:
      "Recommends 3 section orderings optimized for cold, warm, and hot traffic based on Schwartz awareness spectrum",
    keywords: ["order", "move", "rearrange", "structure", "layout"],
    handler: "reorderSectionsRecommendation",
  },
  {
    name: "swap_image",
    description:
      "Recommends 3 image strategies with authentic photo briefs based on Hopkins specificity and Halbert PAS visual principles",
    keywords: ["image", "photo", "picture", "visual", "banner", "swap"],
    handler: "generateImageRecommendation",
  },
];

// ── Unused import suppression ─────────────────────────────────────────────────
void (schwartzAwarenessAdapter as unknown);
void (getNicheContext as unknown);
