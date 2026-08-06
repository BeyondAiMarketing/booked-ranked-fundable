/**
 * Social content intelligence boundary.
 *
 * All model-backed generation and refinement is routed through the server-side
 * BRF intelligence harness. The browser never selects a provider or sends a
 * provider credential. The harness prefers NeMo Agent Toolkit, then direct
 * Nemotron through NVIDIA NIM, then configured server-side fallbacks.
 */

import type {
  BrandVoiceProfile,
  ContentCadence,
  FunnelStage,
  GeneratedContentBatch,
  GeneratedPostVariant,
  NicheType,
  SocialPlatform,
} from "../types/socialMedia";
import {
  generateSocialContentWithNemo,
  runBrfIntelligence,
} from "./brfIntelligenceClient";

const PLATFORM_RULES: Record<
  SocialPlatform,
  {
    maxChars: number;
    hashtagCount: number;
    ctaStyle: string;
  }
> = {
  facebook: {
    maxChars: 500,
    hashtagCount: 3,
    ctaStyle: "Comment below or book online",
  },
  instagram: {
    maxChars: 300,
    hashtagCount: 15,
    ctaStyle: "Use the link in bio",
  },
  linkedin: {
    maxChars: 700,
    hashtagCount: 5,
    ctaStyle: "Share your experience in the comments",
  },
  google_business: {
    maxChars: 300,
    hashtagCount: 0,
    ctaStyle: "Call or book online",
  },
  tiktok: {
    maxChars: 150,
    hashtagCount: 8,
    ctaStyle: "Follow for more local service tips",
  },
};

const NICHE_INTEL: Record<
  NicheType,
  {
    label: string;
    painPoint: string;
    valueProp: string;
    urgency: string;
  }
> = {
  plumbing: {
    label: "plumbing",
    painPoint: "small leaks and drain problems become expensive emergencies",
    valueProp: "fast local service with clear next steps",
    urgency: "water damage grows quickly",
  },
  hvac: {
    label: "HVAC",
    painPoint: "comfort and energy problems get worse during peak weather",
    valueProp: "reliable diagnostics and preventive service",
    urgency: "seasonal appointment capacity fills quickly",
  },
  restoration: {
    label: "restoration",
    painPoint: "water, fire, and mold damage compound over time",
    valueProp: "documented emergency response and recovery coordination",
    urgency: "early mitigation reduces additional damage",
  },
  carpet_cleaning: {
    label: "carpet cleaning",
    painPoint: "stains, odors, and allergens build up below the surface",
    valueProp: "professional deep cleaning for a fresher home",
    urgency: "event and seasonal schedules fill quickly",
  },
  roofing: {
    label: "roofing",
    painPoint: "minor roof damage can become a leak after the next storm",
    valueProp: "clear inspections and documented repair options",
    urgency: "storm damage should be assessed promptly",
  },
  med_spa: {
    label: "med spa",
    painPoint: "clients want clear, natural-looking treatment options",
    valueProp: "personalized consultations and evidence-based treatment plans",
    urgency: "appointment availability is limited",
  },
  real_estate: {
    label: "real estate",
    painPoint: "buyers and sellers lose leverage without timely local guidance",
    valueProp: "local market expertise and responsive representation",
    urgency: "inventory and financing conditions change quickly",
  },
  mortgage: {
    label: "mortgage",
    painPoint: "borrowers struggle to compare programs and requirements",
    valueProp: "clear guidance across available loan pathways",
    urgency: "rates and program availability can change",
  },
  chiropractor: {
    label: "chiropractic",
    painPoint: "persistent discomfort can disrupt work and daily activity",
    valueProp: "individualized assessment and conservative care options",
    urgency: "earlier assessment can clarify the next step",
  },
  dental: {
    label: "dental",
    painPoint: "delayed dental care can turn a manageable concern into an emergency",
    valueProp: "clear treatment options and patient-centered care",
    urgency: "pain or damage should be evaluated promptly",
  },
};

const FUNNEL_DIRECTION: Record<FunnelStage, string> = {
  tofu: "educate and create awareness without making a hard sell",
  mofu: "build trust with a concrete process, proof point, or useful comparison",
  bofu: "make a direct, truthful offer with a clear booking next step",
};

export function formatForPlatform(
  content: string,
  platform: SocialPlatform,
): string {
  const rules = PLATFORM_RULES[platform];
  let formatted = content.trim();

  if (platform === "instagram") {
    const hashtags = formatted.match(/#\w+/g) ?? [];
    const body = formatted.replace(/#\w+/g, "").trim();
    formatted = hashtags.length > 0 ? `${body}\n\n${hashtags.join(" ")}` : body;
  }

  if (platform === "google_business") {
    formatted = formatted.replace(/#\w+/g, "").trim();
  }

  if (formatted.length > rules.maxChars) {
    formatted = `${formatted.slice(0, Math.max(0, rules.maxChars - 3)).trimEnd()}...`;
  }

  return formatted;
}

function scoreContentQuality(
  content: string,
  platform: SocialPlatform,
): number {
  const rules = PLATFORM_RULES[platform];
  let score = 55;
  const length = content.trim().length;

  if (length >= 40 && length <= rules.maxChars) score += 15;
  if (/book|call|click|comment|message|schedule|visit|learn/i.test(content)) {
    score += 10;
  }
  if (/\?|\bhow\b|\bwhy\b|\bbefore\b|\bafter\b/i.test(content)) score += 8;
  if (/\d+/.test(content)) score += 5;
  if (platform === "instagram" && /#\w+/.test(content)) score += 5;
  if (platform === "google_business" && !/#\w+/.test(content)) score += 5;

  return Math.min(100, Math.max(0, score));
}

export async function iterativeRefine(
  draft: string,
  brandVoice: BrandVoiceProfile,
  platform: SocialPlatform,
  _apiKey = "",
  _litellmUrl?: string,
): Promise<{ content: string; qualityScore: number; refined: boolean }> {
  const formattedDraft = formatForPlatform(draft, platform);
  const initialScore = scoreContentQuality(formattedDraft, platform);
  if (initialScore >= 85) {
    return {
      content: formattedDraft,
      qualityScore: initialScore,
      refined: false,
    };
  }

  try {
    const result = await runBrfIntelligence<string>({
      taskType: "content",
      prompt: `Improve the supplied ${platform} social post. Return only the revised post text. Keep it truthful, platform-native, within ${PLATFORM_RULES[platform].maxChars} characters, and include a clear but non-deceptive next step.`,
      context: {
        draft: formattedDraft,
        platform,
        brandVoice,
        platformRules: PLATFORM_RULES[platform],
      },
      responseFormat: "text",
      maxTokens: 900,
    });
    const candidate = formatForPlatform(
      typeof result.content === "string"
        ? result.content
        : typeof result.data === "string"
          ? result.data
          : "",
      platform,
    );
    const refinedScore = scoreContentQuality(candidate, platform);
    if (candidate && refinedScore > initialScore) {
      return {
        content: candidate,
        qualityScore: refinedScore,
        refined: true,
      };
    }
  } catch {
    // The original draft remains available when the complete server-side
    // provider chain is unavailable.
  }

  return {
    content: formattedDraft,
    qualityScore: initialScore,
    refined: false,
  };
}

function deterministicFallbackPosts(params: {
  niche: NicheType;
  platforms: SocialPlatform[];
  cadence: ContentCadence;
  location: string;
  funnelStage: FunnelStage;
}): GeneratedPostVariant[] {
  const intel = NICHE_INTEL[params.niche];
  const postsPerPlatform = params.cadence === 14 ? 3 : params.cadence === 7 ? 2 : 1;
  const locationTag = params.location
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
  const nicheTag = params.niche.replace(/_/g, "");
  const output: GeneratedPostVariant[] = [];

  for (const platform of params.platforms) {
    const rules = PLATFORM_RULES[platform];
    for (let index = 0; index < postsPerPlatform; index += 1) {
      const angles = [
        `A common ${intel.label} mistake: waiting until ${intel.painPoint}.`,
        `${intel.valueProp}. That starts with understanding the problem before choosing a solution.`,
        `${intel.urgency}. A timely professional assessment can clarify what actually needs attention.`,
      ];
      const body = `${angles[index % angles.length]} ${FUNNEL_DIRECTION[params.funnelStage]}. ${rules.ctaStyle}.`;
      const hashtags =
        rules.hashtagCount > 0
          ? [`#${nicheTag}`, "#localbusiness", ...(locationTag ? [`#${locationTag}`] : [])].slice(
              0,
              rules.hashtagCount,
            )
          : [];
      const combined = formatForPlatform(
        `${body}${hashtags.length > 0 ? `\n\n${hashtags.join(" ")}` : ""}`,
        platform,
      );
      output.push({
        platform,
        content: combined,
        hashtags,
        ctaText: rules.ctaStyle,
        estimatedReach: 0,
        qualityScore: scoreContentQuality(combined, platform),
      });
    }
  }

  return output;
}

export async function generateNicheContent(params: {
  niche: NicheType;
  platforms: SocialPlatform[];
  cadence: ContentCadence;
  brandVoiceProfile: BrandVoiceProfile;
  perplexityKey?: string;
  openAiKey?: string;
  claudeKey?: string;
  litellmUrl?: string;
  searxngUrl?: string;
  location?: string;
  funnelStage?: FunnelStage;
}): Promise<GeneratedContentBatch> {
  const location = params.location?.trim() || "your local service area";
  const funnelStage = params.funnelStage ?? "tofu";

  try {
    const generated = await generateSocialContentWithNemo({
      niche: params.niche,
      platforms: params.platforms,
      cadence: params.cadence,
      location,
      funnelStage,
      brandVoice: params.brandVoiceProfile as unknown as Record<string, unknown>,
    });

    return {
      id: `batch-${Date.now()}`,
      niche: params.niche,
      cadence: params.cadence,
      posts: generated.batch.posts.map((post) => ({
        platform: post.platform,
        content: formatForPlatform(post.content, post.platform),
        hashtags: post.hashtags,
        ctaText: post.ctaText,
        estimatedReach: 0,
        qualityScore: post.qualityScore,
      })),
      trendInsights: generated.batch.trendInsights,
      citationUrls: generated.batch.citationUrls,
      generatedAt: Date.now(),
    };
  } catch {
    return {
      id: `fallback-batch-${Date.now()}`,
      niche: params.niche,
      cadence: params.cadence,
      posts: deterministicFallbackPosts({
        niche: params.niche,
        platforms: params.platforms,
        cadence: params.cadence,
        location,
        funnelStage,
      }),
      trendInsights: [],
      citationUrls: [],
      generatedAt: Date.now(),
    };
  }
}
