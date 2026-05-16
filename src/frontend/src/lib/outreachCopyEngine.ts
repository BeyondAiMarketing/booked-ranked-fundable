// Outreach Copy Intelligence Engine — pure TypeScript, no React
// Generates highly personalized, offer-driven outreach sequences from audit data + lead scores.
//
// Frameworks encoded (per spec):
//   Hormozi — value-gap, risk reversal, irresistible offer
//   Ogilvy — headline craft, research-first, speak to one person
//   Suby PASTOR — Problem → Amplify → Story → Transformation → Offer → Response
//   Kennedy — urgency, specific proof, strong CTA, no fluff
//   Deiss Before/After/Bridge — awareness-stage journey targeting
//   Halbert PAS — problem-agitate-solve, story-driven, human connection
//   Hopkins — specificity wins; precise numbers beat vague claims
//   Abraham — strategy of preeminence; trusted advisor not vendor
//   Sugarman — slippery slope; each sentence pulls to the next
//   Schwartz — copy must match the prospect's awareness level

import type {
  LeadStaging,
  OutreachCopySettings,
  WebsiteAudit,
} from "../types/outreach";
import type {
  EnrichedLeadScore,
  OfferAngle,
  RecommendedCTA,
  ScoreTier,
} from "./outreachScoringEngine";

// ─── Exported Interfaces ──────────────────────────────────────────────────────

export interface AdminExplanation {
  why_this_angle: string;
  what_audit_data_drove_it: string[];
  framework_used: string;
  what_to_watch: string;
  predicted_response_rate:
    | "below_average"
    | "average"
    | "above_average"
    | "high";
  personalization_depth_used: string;
}

export interface CopyMetadata {
  offer_angle: OfferAngle;
  cta_used: RecommendedCTA;
  tone_applied: string;
  score_tier: ScoreTier;
  niche: string;
  frameworks_applied: string[];
  generated_at: string;
}

export interface GeneratedOutreachCopy {
  subject_line: string;
  email_initial: string;
  email_followup_1: string;
  email_followup_2: string;
  short_version: string;
  admin_explanation: AdminExplanation;
  metadata: CopyMetadata;
}

// ─── Niche Copy Context ───────────────────────────────────────────────────────

interface NicheCopyContext {
  painPoints: string[];
  outcomes: string[];
  urgencyHook: string;
  trustSignal: string;
  seasonalContext: string;
  avgTicket: string;
  toneModifier: string;
}

const NICHE_COPY_CONTEXT: Record<string, NicheCopyContext> = {
  plumbing: {
    painPoints: [
      "missed emergency calls",
      "losing jobs to Google competitors",
      "no online booking",
      "weak review presence",
    ],
    outcomes: [
      "booked while you sleep",
      "capture emergency calls 24/7",
      "rank above competitors for leak calls",
    ],
    urgencyHook:
      "Every missed call in plumbing is a $300–$800 job walking to a competitor",
    trustSignal:
      "homeowners trust reviews before they call — even in an emergency",
    seasonalContext:
      "Winter pipe bursts and summer A/C crossover create predictable demand spikes",
    avgTicket: "$350–$900",
    toneModifier:
      "practical, direct, no-nonsense — these are working business owners",
  },
  hvac: {
    painPoints: [
      "seasonal feast-or-famine",
      "low review count during off-season",
      "losing bids to visible competitors",
      "no pre-season demand capture",
    ],
    outcomes: [
      "fill your calendar before peak season hits",
      "rank #1 for AC repair before summer",
      "capture maintenance contract leads year-round",
    ],
    urgencyHook:
      "HVAC businesses that rank before June fill their books — those that don't scramble for scraps",
    trustSignal:
      "customers choose HVAC companies based on reviews and search rank — not word of mouth alone",
    seasonalContext:
      "Peak season is 90–120 days — visibility 60 days before makes or breaks the year",
    avgTicket: "$400–$2,500+",
    toneModifier:
      "business-owner to business-owner — appeal to the seasonality pressure they already feel",
  },
  restoration: {
    painPoints: [
      "emergency calls going to competitors who rank higher",
      "no 24/7 capture system",
      "slow response reputation",
      "losing insurance referrals",
    ],
    outcomes: [
      "be the first call when a pipe bursts at 2am",
      "capture storm damage leads the moment they search",
      "24/7 AI response so no job gets missed",
    ],
    urgencyHook:
      "Restoration is winner-takes-all — whoever ranks and responds first gets the job",
    trustSignal:
      "after a disaster, homeowners don't shop around — they call the business they find and trust first",
    seasonalContext:
      "Storm season, freeze events, and flood cycles create predictable demand spikes",
    avgTicket: "$3,000–$20,000+",
    toneModifier:
      "urgency-driven but not alarmist — speak to the opportunity cost of being slow to respond",
  },
  roofing: {
    painPoints: [
      "storm chasers stealing leads",
      "no online presence during peak periods",
      "weak review count vs national competitors",
      "losing insurance claim referrals",
    ],
    outcomes: [
      "capture storm damage leads the moment they search",
      "rank above storm chaser companies locally",
      "generate consistent review velocity from every job",
    ],
    urgencyHook:
      "After a hailstorm, homeowners search within 48 hours — whoever shows up wins the estimate",
    trustSignal:
      "roofing is a high-trust, high-ticket decision — reviews and local rank are the deciding factors",
    seasonalContext:
      "Spring storm season and fall pre-winter inspections are the two biggest windows",
    avgTicket: "$8,000–$25,000+",
    toneModifier:
      "direct and businesslike — these owners are often skeptical of marketing; lead with specifics",
  },
  med_spa: {
    painPoints: [
      "hard to differentiate from competitor spas",
      "low online booking conversion",
      "high-value clients going to better-positioned competitors",
      "weak AI/GEO visibility",
    ],
    outcomes: [
      "attract your ideal premium client, not bargain hunters",
      "fill your booking calendar with high-value appointments",
      "position as the authority in your city",
    ],
    urgencyHook:
      "Med spa clients make decisions based on online presence, reviews, and perceived authority — not just price",
    trustSignal:
      "in aesthetics, credibility IS the product — your online presence must match the premium experience you deliver",
    seasonalContext:
      "Pre-summer body contouring, holiday gifting season, and wedding season are three major booking spikes",
    avgTicket: "$300–$3,000+ per visit",
    toneModifier:
      "premium, tasteful, aspirational — speak to business growth and client quality, not hustle",
  },
  "med spa": {
    painPoints: [
      "hard to differentiate from competitor spas",
      "low online booking conversion",
      "high-value clients going to better-positioned competitors",
      "weak AI/GEO visibility",
    ],
    outcomes: [
      "attract your ideal premium client, not bargain hunters",
      "fill your booking calendar with high-value appointments",
      "position as the authority in your city",
    ],
    urgencyHook:
      "Med spa clients make decisions based on online presence, reviews, and perceived authority — not just price",
    trustSignal:
      "in aesthetics, credibility IS the product — your online presence must match the premium experience you deliver",
    seasonalContext:
      "Pre-summer body contouring, holiday gifting season, and wedding season are three major booking spikes",
    avgTicket: "$300–$3,000+ per visit",
    toneModifier:
      "premium, tasteful, aspirational — speak to business growth and client quality, not hustle",
  },
  carpet_cleaning: {
    painPoints: [
      "high competition from franchise chains",
      "price-shopping customers",
      "no repeat booking system",
      "low average review count",
    ],
    outcomes: [
      "capture local jobs before national chains",
      "convert one-time customers into repeat accounts",
      "build a 5-star review reputation that commands higher prices",
    ],
    urgencyHook:
      "In carpet cleaning, the business with the most reviews and the best rank gets the call — period",
    trustSignal:
      "customers choose carpet cleaners based almost entirely on reviews and Google rank",
    seasonalContext:
      "Post-holiday, spring cleaning, and move-in/move-out seasons drive demand",
    avgTicket: "$150–$500",
    toneModifier:
      "straightforward and value-focused — these owners respond to clear ROI, not strategy talk",
  },
  "carpet cleaning": {
    painPoints: [
      "high competition from franchise chains",
      "price-shopping customers",
      "no repeat booking system",
      "low average review count",
    ],
    outcomes: [
      "capture local jobs before national chains",
      "convert one-time customers into repeat accounts",
      "build a 5-star review reputation that commands higher prices",
    ],
    urgencyHook:
      "In carpet cleaning, the business with the most reviews and the best rank gets the call — period",
    trustSignal:
      "customers choose carpet cleaners based almost entirely on reviews and Google rank",
    seasonalContext:
      "Post-holiday, spring cleaning, and move-in/move-out seasons drive demand",
    avgTicket: "$150–$500",
    toneModifier:
      "straightforward and value-focused — these owners respond to clear ROI, not strategy talk",
  },
};

function getNicheContext(niche: string): NicheCopyContext {
  return (
    NICHE_COPY_CONTEXT[niche.toLowerCase()] ?? {
      painPoints: [
        "limited online visibility",
        "missed inbound leads",
        "weak conversion path",
      ],
      outcomes: [
        "capture more inbound leads",
        "convert website visitors into calls",
        "improve local search ranking",
      ],
      urgencyHook:
        "Every week without a clear digital presence is revenue going to competitors",
      trustSignal:
        "customers research online before they call — even for service businesses",
      seasonalContext:
        "Local service businesses have peak seasons where digital visibility is critical",
      avgTicket: "varies by job",
      toneModifier: "direct and professional — speak to business outcomes",
    }
  );
}

// ─── CTA Phrase Library ───────────────────────────────────────────────────────

const CTA_PHRASES: Record<
  RecommendedCTA,
  Record<"soft" | "medium" | "direct", string>
> = {
  audit_offer: {
    soft: "If you'd like, I can put together a quick visibility snapshot for {businessName} — no cost, no commitment.",
    medium:
      "I'd be glad to run a complimentary audit for {businessName} and share what I find. Takes about 20 minutes on my end.",
    direct:
      "I've already started pulling together a visibility audit for {businessName}. Want me to send it over?",
  },
  quick_win_demo: {
    soft: "If you have 15 minutes sometime this week, I can walk you through one specific improvement that could change how {businessName} shows up in search.",
    medium:
      "I can show you one thing — specific to your site — that most {niche} businesses in {city} are missing. 15 minutes, nothing to buy.",
    direct:
      "Are you open to a 15-minute screen share this week? I'll show you one specific fix that typically moves the needle fast for {niche} businesses.",
  },
  free_strategy_call: {
    soft: "If any of this resonates, I'd be glad to have a 20-minute conversation — no pitch, just a look at what's working and what isn't.",
    medium:
      "I'd welcome a 20-minute strategy call to walk through what I'm seeing and whether it's worth pursuing. Your call completely.",
    direct:
      "Can we get 20 minutes on the calendar? I'll come prepared with specific data on where {businessName} stands vs. competitors in {city}.",
  },
  benchmark_report: {
    soft: "I can put together a quick benchmark showing how {businessName} compares to other {niche} businesses in {city}. Happy to share it if useful.",
    medium:
      "I'll build a local benchmark for {businessName} — shows exactly where you're ahead and where competitors are outranking you. No cost.",
    direct:
      "I'll put together a {city} {niche} benchmark for {businessName} this week. It'll show you where the gaps are. Interested in seeing it?",
  },
  no_cost_assessment: {
    soft: "I'd be glad to do a no-cost assessment for {businessName} if you're curious — covers visibility, conversion, and local search. No obligation.",
    medium:
      "I can do a full no-cost assessment for {businessName} — covers your site, your local visibility, and how you compare to competitors. Straightforward and useful.",
    direct:
      "Let me run a no-cost assessment for {businessName}. It covers visibility, conversion, and competitive position. I'll have results back to you within 48 hours.",
  },
};

function buildCTA(
  cta: RecommendedCTA,
  aggressiveness: number,
  businessName: string,
  city: string,
  niche: string,
): string {
  const intensity: "soft" | "medium" | "direct" =
    aggressiveness <= 2 ? "soft" : aggressiveness <= 3 ? "medium" : "direct";
  return CTA_PHRASES[cta][intensity]
    .replace(/{businessName}/g, businessName)
    .replace(/{city}/g, city)
    .replace(/{niche}/g, niche);
}

// ─── Framework Helper Functions (per spec) ────────────────────────────────────

// Hormozi: Lead with the gap. Make value obvious. Reduce risk. Stack the value.
export function hormoziValueOpener(
  businessName: string,
  primaryWeakness: string,
  niche: string,
): string {
  return `Quick observation about ${businessName} — ${primaryWeakness.toLowerCase()}. For a ${niche} business, that gap typically represents missed inbound leads every week.`;
}

// Ogilvy: Headline power. Research first. Speak to one person. Credibility before claims.
export function ogilvySubjectLine(
  businessName: string,
  offerAngle: OfferAngle,
  location: string,
): string {
  const SUBJECT_TEMPLATES: Record<OfferAngle, string> = {
    visibility_gap: `${businessName}'s Google presence — quick observation`,
    conversion_leak: `One thing I noticed on ${businessName}'s site`,
    trust_deficit: `${businessName} — review comparison in ${location}`,
    missed_revenue: `${businessName} — ${location} visibility gap`,
    competitive_threat: `Local search rankings in ${location} — something worth knowing`,
  };
  return SUBJECT_TEMPLATES[offerAngle];
}

// PASTOR (Sabri Suby): Problem → Amplify → Story → Transformation → Offer → Response
export function pastorEmailStructure(
  problem: string,
  amplify: string,
  transformation: string,
  offer: string,
  cta: string,
  tone: OutreachCopySettings["tone"],
): string {
  const sep = tone === "direct" ? "\n" : "\n\n";
  return [problem, amplify, transformation, offer, cta]
    .filter(Boolean)
    .join(sep);
}

// Kennedy: USP + urgency + specific proof + strong CTA + no fluff
export function kennedyFollowUp(
  businessName: string,
  primaryOpportunity: string,
  urgencyDrivers: string[],
  cta: string,
): string {
  const urgencyLine =
    urgencyDrivers[0] ??
    "The window for easy gains in local search is narrowing as competitors invest.";
  return [
    `I sent a note to ${businessName} last week — didn't want to let it go without one more reach out.`,
    `Here's what I know: ${primaryOpportunity}`,
    `${urgencyLine}.`,
    cta,
    "If the timing isn't right, no issue — just let me know and I'll close the loop.",
  ].join("\n\n");
}

// Deiss: Before/After/Bridge. Awareness stage targeting. Sequence logic.
export function deissBeforeAfterBridge(
  currentState: string,
  desiredState: string,
  bridge: string,
  cta: string,
): string {
  return [
    `Right now: ${currentState}`,
    `What's possible: ${desiredState}`,
    `The bridge: ${bridge}`,
    cta,
  ].join("\n\n");
}

// Halbert: Problem-Agitate-Solve. Story-driven. Human connection.
export function halbertProblemAgitateSolve(
  problem: string,
  agitation: string,
  solution: string,
  businessName: string,
): string {
  return [
    problem,
    agitation,
    `Here's what changes for ${businessName} when that gets fixed: ${solution}`,
  ].join("\n\n");
}

// Hopkins: Specificity wins. Precise numbers beat vague claims.
export function hopkinsSpecificProof(
  niche: string,
  location: string,
  avgTicket: string,
): string {
  return `Most ${niche} businesses in the ${location} area that improve their local search position and review count see measurable increases in inbound call volume — often within 60–90 days. Average job value in this category: ${avgTicket}.`;
}

// Abraham: Strategy of preeminence. Position as trusted advisor. Multiply revenue per client.
export function abrahamAdvisorPositioning(
  businessName: string,
  niche: string,
): string {
  return `I'm not reaching out to pitch a service — I'm reaching out because I was looking at ${niche} businesses in your area and noticed something specific about ${businessName} that's worth flagging, whether we ever work together or not.`;
}

// Sugarman: Slippery slope. Each sentence pulls to the next. Curiosity builds.
export function sugarmanSlipperySlopeOpener(
  observation: string,
  implication: string,
): string {
  return `${observation}. And once you see ${implication}, it's hard to look at your local competition the same way.`;
}

// Schwartz: Copy must match the awareness level of the prospect.
export function schwartzAwarenessAdapter(
  baseEmail: string,
  awarenessStage: string,
): string {
  if (awarenessStage === "cold") {
    return baseEmail.replace(
      /I can help|we can fix|our service|our platform/gi,
      "there's a specific approach that",
    );
  }
  return baseEmail;
}

// ─── Tone Adapter ─────────────────────────────────────────────────────────────

export function applyTone(
  emailBody: string,
  tone: OutreachCopySettings["tone"],
  aggressiveness: number,
): string {
  let result = emailBody;

  if (tone === "direct") {
    result = result.replace(
      /I wanted to reach out and|I was hoping to|I thought I'd/gi,
      "I'm reaching out because",
    );
    result = result.replace(
      /would you be open to perhaps|might you be interested in/gi,
      "are you open to",
    );
  }
  if (tone === "conversational") {
    result = result.replace(/I am /g, "I'm ");
    result = result.replace(/you are /g, "you're ");
    result = result.replace(/it is /g, "it's ");
    result = result.replace(/do not /g, "don't ");
    result = result.replace(/will not /g, "won't ");
  }
  if (tone === "consultative" && !result.includes("?")) {
    result += "\n\nWould it make sense to take a look at this together?";
  }

  if (aggressiveness <= 2) {
    result += "\n\nNo pressure at all — only if the timing is right for you.";
  } else if (aggressiveness >= 4) {
    result = result.replace(
      /Let me know if you're interested\.|Let me know if this would be useful\./gi,
      "I'll follow up in a few days if I don't hear back — happy to share the findings either way.",
    );
  }

  return result;
}

// ─── Short Version Builder ────────────────────────────────────────────────────

function buildShortVersion(
  lead: LeadStaging,
  score: EnrichedLeadScore,
): string {
  const { businessName, city, niche } = lead;
  const topSignal =
    score.top_audit_signals[0] ?? "a visibility gap worth flagging";

  const templates: Record<OfferAngle, string> = {
    visibility_gap: `Quick question — does ${businessName} have a system for capturing leads when customers search for ${niche} in ${city}? I noticed something worth flagging when I looked at your local presence.`,
    conversion_leak: `Saw ${businessName} come up in a ${city} ${niche} search. One thing stood out — ${topSignal.toLowerCase()}. Happy to share if useful.`,
    trust_deficit: `Quick note — ${businessName} has ${lead.reviewCount} reviews. Most top-ranked ${niche} businesses in ${city} have significantly more. Worth a conversation about the gap?`,
    missed_revenue: `Looking at ${niche} businesses in ${city} — ${businessName} stands out as having real potential that the current digital presence isn't capturing. Happy to show you what I mean.`,
    competitive_threat: `Something worth knowing about the ${niche} search landscape in ${city} right now. ${businessName} has a window to act before competitors widen the gap.`,
  };

  const raw = templates[score.recommended_offer_angle];
  return raw.length > 280 ? `${raw.slice(0, 277)}...` : raw;
}

// ─── Angle-Specific Email Generators ─────────────────────────────────────────

type EmailSet = Pick<
  GeneratedOutreachCopy,
  "subject_line" | "email_initial" | "email_followup_1" | "email_followup_2"
>;

function generateVisibilityGapCopy(
  lead: LeadStaging,
  _audit: WebsiteAudit,
  score: EnrichedLeadScore,
  settings: OutreachCopySettings,
): EmailSet {
  const { businessName, city, niche } = lead;
  const nicheCtx = getNicheContext(niche);
  const ctaText = buildCTA(
    score.recommended_cta,
    settings.aggressivenessLevel,
    businessName,
    city,
    niche,
  );
  const primaryWeakness = score.scoring_rationale.primary_weakness;

  const subjectLine = ogilvySubjectLine(businessName, "visibility_gap", city);

  const initialEmail = schwartzAwarenessAdapter(
    applyTone(
      [
        `I was researching ${niche} businesses in ${city} and ${businessName} caught my attention.`,
        hormoziValueOpener(businessName, primaryWeakness, niche),
        hopkinsSpecificProof(niche, city, nicheCtx.avgTicket),
        deissBeforeAfterBridge(
          `${businessName} is difficult to find when customers search for ${niche} services in ${city}`,
          `${businessName} showing up where potential customers can find it — and call`,
          "Closing the specific gaps in online presence that are costing you discoverability right now",
          ctaText,
        ),
        settings.signatureBlock,
      ]
        .filter(Boolean)
        .join("\n\n"),
      settings.tone,
      settings.aggressivenessLevel,
    ),
    score.scoring_rationale.awareness_stage,
  );

  const fu1CTA = buildCTA(
    score.recommended_cta,
    Math.max(1, settings.aggressivenessLevel - 1),
    businessName,
    city,
    niche,
  );
  const followup1 = applyTone(
    [
      `Following up on my last note about ${businessName}'s visibility in ${city}.`,
      `${nicheCtx.urgencyHook}.`,
      nicheCtx.trustSignal,
      fu1CTA,
      settings.signatureBlock,
    ]
      .filter(Boolean)
      .join("\n\n"),
    settings.tone,
    Math.max(1, settings.aggressivenessLevel - 1),
  );

  const followup2 = applyTone(
    [
      kennedyFollowUp(
        businessName,
        score.scoring_rationale.primary_opportunity,
        score.scoring_rationale.urgency_drivers,
        buildCTA(
          score.recommended_cta,
          settings.aggressivenessLevel,
          businessName,
          city,
          niche,
        ),
      ),
      settings.signatureBlock,
    ]
      .filter(Boolean)
      .join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel,
  );

  return {
    subject_line: subjectLine,
    email_initial: initialEmail,
    email_followup_1: `Subject: Quick follow-up — ${businessName}\n\n${followup1}`,
    email_followup_2: `Subject: Last note — ${businessName}\n\n${followup2}`,
  };
}

function generateConversionLeakCopy(
  lead: LeadStaging,
  audit: WebsiteAudit,
  score: EnrichedLeadScore,
  settings: OutreachCopySettings,
): EmailSet {
  const { businessName, city, niche } = lead;
  const nicheCtx = getNicheContext(niche);
  const ctaText = buildCTA(
    score.recommended_cta,
    settings.aggressivenessLevel,
    businessName,
    city,
    niche,
  );
  const topSignal =
    score.top_audit_signals[0] ?? "visitors have no clear path to contact you";

  const subjectLine = ogilvySubjectLine(businessName, "conversion_leak", city);

  const slippery = sugarmanSlipperySlopeOpener(
    `When I looked at ${businessName}'s site, one thing immediately stood out: ${topSignal.toLowerCase()}`,
    `how many people search for ${niche} in ${city} and leave without making contact`,
  );

  const initialEmail = schwartzAwarenessAdapter(
    applyTone(
      [
        slippery,
        hormoziValueOpener(businessName, topSignal, niche),
        audit.conversionWeaknesses.length > 1
          ? `There are ${audit.conversionWeaknesses.length} specific conversion gaps on the site I can point to — not guesses, just observations.`
          : "",
        ctaText,
        settings.signatureBlock,
      ]
        .filter(Boolean)
        .join("\n\n"),
      settings.tone,
      settings.aggressivenessLevel,
    ),
    score.scoring_rationale.awareness_stage,
  );

  const pasBody = halbertProblemAgitateSolve(
    `${businessName} is getting some traffic but the site isn't converting visitors into calls or bookings.`,
    `For a ${niche} business averaging ${nicheCtx.avgTicket} per job, even two or three missed leads per week adds up to meaningful lost revenue every month.`,
    "a clear CTA, contact path, and trust signals in place — visitors who are ready to book can actually reach you",
    businessName,
  );
  const fu1CTA = buildCTA(
    score.recommended_cta,
    Math.max(1, settings.aggressivenessLevel - 1),
    businessName,
    city,
    niche,
  );
  const followup1 = applyTone(
    [pasBody, fu1CTA, settings.signatureBlock].filter(Boolean).join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel - 1,
  );

  const followup2 = applyTone(
    [
      abrahamAdvisorPositioning(businessName, niche),
      `What I'd recommend for ${businessName}, regardless of anything else: fix the contact path first. It's the fastest conversion lever and doesn't require a full site overhaul.`,
      buildCTA(
        score.recommended_cta,
        settings.aggressivenessLevel,
        businessName,
        city,
        niche,
      ),
      settings.signatureBlock,
    ]
      .filter(Boolean)
      .join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel,
  );

  return {
    subject_line: subjectLine,
    email_initial: initialEmail,
    email_followup_1: `Subject: Quick follow-up — ${businessName}\n\n${followup1}`,
    email_followup_2: `Subject: Last note — ${businessName}\n\n${followup2}`,
  };
}

function generateTrustDeficitCopy(
  lead: LeadStaging,
  _audit: WebsiteAudit,
  score: EnrichedLeadScore,
  settings: OutreachCopySettings,
): EmailSet {
  const { businessName, city, niche } = lead;
  const nicheCtx = getNicheContext(niche);
  const ctaText = buildCTA(
    score.recommended_cta,
    settings.aggressivenessLevel,
    businessName,
    city,
    niche,
  );

  const subjectLine = ogilvySubjectLine(businessName, "trust_deficit", city);

  const initialEmail = applyTone(
    schwartzAwarenessAdapter(
      [
        abrahamAdvisorPositioning(businessName, niche),
        `${businessName} currently has ${lead.reviewCount} reviews. In the ${city} ${niche} market, businesses ranking in the top 3 positions on Google typically have significantly more — and ${nicheCtx.trustSignal}.`,
        `That gap isn't just about appearances. It's directly affecting how many calls ${businessName} gets vs. competitors with more social proof.`,
        ctaText,
        settings.signatureBlock,
      ]
        .filter(Boolean)
        .join("\n\n"),
      score.scoring_rationale.awareness_stage,
    ),
    settings.tone,
    settings.aggressivenessLevel,
  );

  const deissTrans = deissBeforeAfterBridge(
    `${businessName} at ${lead.reviewCount} reviews, competing against better-reviewed ${niche} businesses in ${city}`,
    `${businessName} with a consistent review stream that positions you as the obvious choice in ${city}`,
    "A systematic post-job review request process that most service businesses overlook",
    buildCTA(
      score.recommended_cta,
      Math.max(1, settings.aggressivenessLevel - 1),
      businessName,
      city,
      niche,
    ),
  );
  const followup1 = applyTone(
    [
      hopkinsSpecificProof(niche, city, nicheCtx.avgTicket),
      deissTrans,
      settings.signatureBlock,
    ]
      .filter(Boolean)
      .join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel - 1,
  );

  const pastorBody = pastorEmailStructure(
    `${businessName} has a real opportunity to improve its market position in ${city} — the review gap vs. top competitors is fixable.`,
    `${nicheCtx.urgencyHook}.`,
    `Other ${niche} businesses in similar markets have closed this gap in 60–90 days with the right process in place.`,
    "A straightforward review velocity system is the single highest-ROI move available right now.",
    buildCTA(
      score.recommended_cta,
      settings.aggressivenessLevel,
      businessName,
      city,
      niche,
    ),
    settings.tone,
  );
  const followup2 = applyTone(
    [pastorBody, settings.signatureBlock].filter(Boolean).join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel,
  );

  return {
    subject_line: subjectLine,
    email_initial: initialEmail,
    email_followup_1: `Subject: Quick follow-up — ${businessName}\n\n${followup1}`,
    email_followup_2: `Subject: Last note — ${businessName}\n\n${followup2}`,
  };
}

function generateMissedRevenueCopy(
  lead: LeadStaging,
  _audit: WebsiteAudit,
  score: EnrichedLeadScore,
  settings: OutreachCopySettings,
): EmailSet {
  const { businessName, city, niche } = lead;
  const nicheCtx = getNicheContext(niche);
  const ctaText = buildCTA(
    score.recommended_cta,
    settings.aggressivenessLevel,
    businessName,
    city,
    niche,
  );

  const subjectLine = ogilvySubjectLine(businessName, "missed_revenue", city);

  const initialEmail = applyTone(
    [
      `${businessName} is doing well — ${lead.reviewCount} reviews, an established presence, and a service customers trust.`,
      `What caught my attention: the digital reach isn't matching the business quality. ${score.scoring_rationale.primary_opportunity}`,
      hopkinsSpecificProof(niche, city, nicheCtx.avgTicket),
      ctaText,
      settings.signatureBlock,
    ]
      .filter(Boolean)
      .join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel,
  );

  const followup1 = applyTone(
    [
      abrahamAdvisorPositioning(businessName, niche),
      `The specific growth levers I can see for ${businessName}: better local search positioning, a stronger conversion path for visitors already landing on the site, and a structured review velocity process.`,
      buildCTA(
        score.recommended_cta,
        Math.max(1, settings.aggressivenessLevel - 1),
        businessName,
        city,
        niche,
      ),
      settings.signatureBlock,
    ]
      .filter(Boolean)
      .join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel - 1,
  );

  const followup2 = applyTone(
    [
      kennedyFollowUp(
        businessName,
        score.scoring_rationale.primary_opportunity,
        score.scoring_rationale.urgency_drivers,
        buildCTA(
          score.recommended_cta,
          settings.aggressivenessLevel,
          businessName,
          city,
          niche,
        ),
      ),
      settings.signatureBlock,
    ]
      .filter(Boolean)
      .join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel,
  );

  return {
    subject_line: subjectLine,
    email_initial: initialEmail,
    email_followup_1: `Subject: Quick follow-up — ${businessName}\n\n${followup1}`,
    email_followup_2: `Subject: Last note — ${businessName}\n\n${followup2}`,
  };
}

function generateCompetitiveThreatCopy(
  lead: LeadStaging,
  _audit: WebsiteAudit,
  score: EnrichedLeadScore,
  settings: OutreachCopySettings,
): EmailSet {
  const { businessName, city, niche } = lead;
  const nicheCtx = getNicheContext(niche);
  const ctaText = buildCTA(
    score.recommended_cta,
    settings.aggressivenessLevel,
    businessName,
    city,
    niche,
  );

  const subjectLine = ogilvySubjectLine(
    businessName,
    "competitive_threat",
    city,
  );

  const bridgeLine = sugarmanSlipperySlopeOpener(
    `I was looking at ${niche} search rankings in ${city} and ${businessName} caught my attention`,
    "what it takes to hold — and grow — market position in this category right now",
  );

  const initialEmail = schwartzAwarenessAdapter(
    applyTone(
      [
        bridgeLine,
        `${nicheCtx.urgencyHook}.`,
        `${nicheCtx.seasonalContext}.`,
        score.scoring_rationale.primary_weakness
          ? `One specific thing I noticed about ${businessName}'s current position: ${score.scoring_rationale.primary_weakness.toLowerCase()}.`
          : "",
        ctaText,
        settings.signatureBlock,
      ]
        .filter(Boolean)
        .join("\n\n"),
      settings.tone,
      settings.aggressivenessLevel,
    ),
    score.scoring_rationale.awareness_stage,
  );

  const deissBody = deissBeforeAfterBridge(
    `${businessName} competing for calls without full visibility in ${city} local search`,
    `${businessName} capturing the high-intent ${niche} searches that competitors are currently winning`,
    "Closing the specific gaps in search presence and trust signals that determine call volume",
    buildCTA(
      score.recommended_cta,
      Math.max(1, settings.aggressivenessLevel - 1),
      businessName,
      city,
      niche,
    ),
  );
  const followup1 = applyTone(
    [deissBody, settings.signatureBlock].filter(Boolean).join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel - 1,
  );

  const fu2Body = kennedyFollowUp(
    businessName,
    score.scoring_rationale.primary_opportunity,
    [...score.scoring_rationale.urgency_drivers, nicheCtx.seasonalContext],
    buildCTA(
      score.recommended_cta,
      settings.aggressivenessLevel,
      businessName,
      city,
      niche,
    ),
  );
  const followup2 = applyTone(
    [fu2Body, settings.signatureBlock].filter(Boolean).join("\n\n"),
    settings.tone,
    settings.aggressivenessLevel,
  );

  return {
    subject_line: subjectLine,
    email_initial: initialEmail,
    email_followup_1: `Subject: Quick follow-up — ${businessName}\n\n${followup1}`,
    email_followup_2: `Subject: Last note — ${businessName}\n\n${followup2}`,
  };
}

// ─── Admin Explanation Builder ────────────────────────────────────────────────

const ANGLE_FRAMEWORK_MAP: Record<OfferAngle, string[]> = {
  visibility_gap: ["Ogilvy", "Hopkins", "Deiss B/A/B", "Kennedy"],
  conversion_leak: ["Sugarman", "Hormozi", "Halbert PAS", "Abraham"],
  trust_deficit: ["Abraham", "Ogilvy", "Hopkins", "Suby PASTOR"],
  missed_revenue: ["Hormozi", "Abraham", "Kennedy"],
  competitive_threat: ["Schwartz", "Sugarman", "Deiss", "Kennedy"],
};

function buildAdminExplanation(
  lead: LeadStaging,
  score: EnrichedLeadScore,
  frameworks: string[],
): AdminExplanation {
  const { recommended_offer_angle, score_tier, top_audit_signals } = score;

  const ANGLE_EXPLANATIONS: Record<OfferAngle, string> = {
    visibility_gap:
      "This business scores low on search discoverability. The angle leads with the visibility gap because that's the most immediate, specific problem the audit found.",
    conversion_leak:
      "The site exists but the audit found broken conversion paths. The angle leads with the specific finding to demonstrate you did your homework, not a generic pitch.",
    trust_deficit:
      "Review count is below what's competitive in this market. The angle leads with a specific comparison because it's concrete and immediately understood by the owner.",
    missed_revenue:
      "This business has real equity but isn't capturing the digital revenue their quality deserves. The angle leads with the gap, not the problem — more motivating for an established owner.",
    competitive_threat:
      "Competitive environment creates external pressure. The angle leads with what's happening externally rather than what's broken internally — more galvanizing for skeptical owners.",
  };

  const CTA_EXPLANATIONS: Record<RecommendedCTA, string> = {
    audit_offer: `Score tier (${score_tier}) suggests a softer entry point. The audit offer reduces the perceived cost of saying yes.`,
    quick_win_demo:
      "High priority score warrants a direct offer. A 15-minute demo of one specific improvement is specific enough to feel credible and short enough to feel low-risk.",
    free_strategy_call:
      "Top-tier lead with high aggressiveness setting. A direct calendar ask is appropriate — the score justifies the directness.",
    benchmark_report:
      "High score with missed revenue angle. A competitive benchmark is immediately relevant and positions you as someone who did research.",
    no_cost_assessment:
      "Lower-tier lead where value needs to be established first. The assessment framing provides something concrete to respond to.",
  };

  const predictedResponseRate =
    (): AdminExplanation["predicted_response_rate"] => {
      if (score_tier === "priority" && top_audit_signals.length >= 3)
        return "high";
      if (score_tier === "high" && top_audit_signals.length >= 2)
        return "above_average";
      if (score_tier === "medium") return "average";
      return "below_average";
    };

  return {
    why_this_angle: `${ANGLE_EXPLANATIONS[recommended_offer_angle]} ${CTA_EXPLANATIONS[score.recommended_cta]}`,
    what_audit_data_drove_it: top_audit_signals.slice(0, 3),
    framework_used: ANGLE_FRAMEWORK_MAP[recommended_offer_angle].join(" · "),
    what_to_watch:
      "Look for replies that reference the specific observation — that signals genuine interest. A 'who are you?' reply still means they read it. No reply to email 2 likely means email timing or contact info is wrong, not that the message failed.",
    predicted_response_rate: predictedResponseRate(),
    personalization_depth_used: `Business name, city, niche, review count (${lead.reviewCount}), ${top_audit_signals.length} specific audit findings. Frameworks: ${frameworks.join(", ")}.`,
  };
}

// ─── Master Framework Registry (exported for UI reference) ───────────────────

export const MASTER_FRAMEWORKS = [
  {
    key: "hormozi",
    name: "Alex Hormozi",
    principle: "Value Stack & Grand Slam Offer",
    description:
      "Stack value so the offer feels irresistible relative to price. Make the risk asymmetric in the prospect's favor.",
  },
  {
    key: "ryan_deiss",
    name: "Ryan Deiss",
    principle: "Customer Value Journey / Before-After-Bridge",
    description:
      "Move prospects through Awareness → Engage → Subscribe → Convert. Each email serves one stage of the journey.",
  },
  {
    key: "dan_kennedy",
    name: "Dan Kennedy",
    principle: "Direct Response Fundamentals",
    description:
      "Every message must have one offer, one CTA, and a reason to act now. No generic, no vague.",
  },
  {
    key: "ogilvy",
    name: "David Ogilvy",
    principle: "Headline Power & Research-First",
    description:
      "The headline is the ad for the email. Specificity sells. Credibility before claims.",
  },
  {
    key: "halbert",
    name: "Gary Halbert",
    principle: "Problem-Agitate-Solve",
    description:
      "Name the problem, intensify the pain of having it, then position your solution as the relief.",
  },
  {
    key: "schwartz",
    name: "Eugene Schwartz",
    principle: "Awareness Spectrum Copy",
    description:
      "Write to the prospect's current awareness level. Cold leads need education; warm leads need a decision trigger.",
  },
  {
    key: "jay_abraham",
    name: "Jay Abraham",
    principle: "Strategy of Preeminence",
    description:
      "Position yourself as the trusted advisor who serves the client's best interest — not a vendor making a pitch.",
  },
  {
    key: "sugarman",
    name: "Joe Sugarman",
    principle: "Slippery Slope Structure",
    description:
      "Each sentence exists to pull the reader into the next. Open with curiosity, build momentum, guide to the CTA.",
  },
  {
    key: "hopkins",
    name: "Claude Hopkins",
    principle: "Specificity & Precision",
    description:
      "Specific claims outperform vague claims. Numbers and specifics build credibility.",
  },
  {
    key: "sabri_suby",
    name: "Sabri Suby",
    principle: "PASTOR Framework",
    description:
      "Problem → Amplify → Story → Transformation → Offer → Response. Complete journey from pain to conversion.",
  },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * generateWarmEmailSubject — produces personalized subject lines for warm follow-up sequences.
 *
 * Touch 1 (Hopkins/Hormozi): Specific numbers + value gap — makes the result feel real and immediate.
 * Touch 2 (Kennedy): Urgency + direct — forces a decision, respects their time.
 * Touch 3 (Halbert/Sugarman): Human, curious hook — slippery slope that pulls the reader in.
 *
 * @param niche          Business niche (plumbing, hvac, medspa, etc.)
 * @param touchIndex     1-based touch number in the warm sequence (1–3)
 * @param prospectName   First name or business name of the prospect
 * @param topAuditFinding The top specific finding from their audit (e.g. "no mobile booking path")
 */
export function generateWarmEmailSubject(
  niche: string,
  touchIndex: 1 | 2 | 3,
  prospectName: string,
  topAuditFinding: string,
): string {
  const nicheCtx = getNicheContext(niche);
  const nicheLabel =
    niche.toLowerCase() === "medspa"
      ? "med spa"
      : niche.toLowerCase() === "carpet-cleaning"
        ? "carpet cleaning"
        : niche.toLowerCase();

  if (touchIndex === 1) {
    // Hopkins + Hormozi: Specificity + value gap
    const finding = topAuditFinding
      ? topAuditFinding.toLowerCase()
      : "a conversion gap on your website";
    return `${prospectName} — your audit found ${finding} (here's what it's costing you)`;
  }

  if (touchIndex === 2) {
    // Kennedy: Urgency + direct, USP focus
    const urgencySnippet =
      nicheCtx.urgencyHook.split(" — ")[0] ??
      `Every week matters in ${nicheLabel}`;
    return `${prospectName}: ${urgencySnippet.toLowerCase()} — ready to fix it?`;
  }

  // Touch 3 — Halbert + Sugarman: Curiosity-driven, slippery slope opener
  return `One thing most ${nicheLabel} owners don't realize about their audit results`;
}

export function generateOutreachCopy(
  lead: LeadStaging,
  audit: WebsiteAudit,
  score: EnrichedLeadScore,
  settings: OutreachCopySettings,
): GeneratedOutreachCopy {
  const angle = score.recommended_offer_angle;

  let emailCopy: EmailSet;
  switch (angle) {
    case "conversion_leak":
      emailCopy = generateConversionLeakCopy(lead, audit, score, settings);
      break;
    case "trust_deficit":
      emailCopy = generateTrustDeficitCopy(lead, audit, score, settings);
      break;
    case "missed_revenue":
      emailCopy = generateMissedRevenueCopy(lead, audit, score, settings);
      break;
    case "competitive_threat":
      emailCopy = generateCompetitiveThreatCopy(lead, audit, score, settings);
      break;
    default:
      emailCopy = generateVisibilityGapCopy(lead, audit, score, settings);
      break;
  }

  const frameworksApplied = ANGLE_FRAMEWORK_MAP[angle];
  const shortVersion = buildShortVersion(lead, score);
  const adminExplanation = buildAdminExplanation(
    lead,
    score,
    frameworksApplied,
  );

  return {
    subject_line: emailCopy.subject_line,
    email_initial: emailCopy.email_initial,
    email_followup_1: emailCopy.email_followup_1,
    email_followup_2: emailCopy.email_followup_2,
    short_version: shortVersion,
    admin_explanation: adminExplanation,
    metadata: {
      offer_angle: angle,
      cta_used: score.recommended_cta,
      tone_applied: settings.tone,
      score_tier: score.score_tier,
      niche: lead.niche,
      frameworks_applied: frameworksApplied,
      generated_at: new Date().toISOString(),
    },
  };
}
