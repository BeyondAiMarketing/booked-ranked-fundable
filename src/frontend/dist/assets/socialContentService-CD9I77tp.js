import { bq as buildResearchRouter, br as isResearchError, bs as LiteLLMAdapter } from "./index-y2rnL2Fn.js";
const PLATFORM_RULES = {
  facebook: {
    maxChars: 500,
    hashtagCount: 3,
    emojiStyle: "moderate",
    preferredFormat: "story + question hook",
    ctaStyle: "Comment below or click the link"
  },
  instagram: {
    maxChars: 300,
    hashtagCount: 15,
    emojiStyle: "heavy",
    preferredFormat: "visual hook + short copy + hashtags",
    ctaStyle: "Link in bio ⬆️"
  },
  linkedin: {
    maxChars: 700,
    hashtagCount: 5,
    emojiStyle: "minimal",
    preferredFormat: "insight-driven thought leadership",
    ctaStyle: "What's been your experience? Drop a comment."
  },
  google_business: {
    maxChars: 300,
    hashtagCount: 0,
    emojiStyle: "minimal",
    preferredFormat: "local SEO update + offer",
    ctaStyle: "Call us or book online"
  },
  tiktok: {
    maxChars: 150,
    hashtagCount: 8,
    emojiStyle: "heavy",
    preferredFormat: "hook in first 3 words + trend hook",
    ctaStyle: "Follow for more 🔔"
  }
};
const NICHE_INTEL = {
  plumbing: {
    painPoints: [
      "burst pipes",
      "clogged drains",
      "no hot water",
      "hidden leaks costing you monthly"
    ],
    valueProps: [
      "24/7 emergency response",
      "upfront pricing",
      "licensed & insured",
      "same-day service"
    ],
    urgencyTriggers: [
      "winter prep",
      "old water heaters fail in cold weather",
      "small leak = big bill"
    ]
  },
  hvac: {
    painPoints: [
      "AC failing in summer",
      "heating bills through the roof",
      "poor air quality indoors"
    ],
    valueProps: [
      "energy efficiency audits",
      "smart thermostat installation",
      "preventive maintenance plans"
    ],
    urgencyTriggers: [
      "season change",
      "heat advisory",
      "utility rate increases"
    ]
  },
  restoration: {
    painPoints: [
      "water damage spreading",
      "mold growing undetected",
      "insurance claim stress"
    ],
    valueProps: [
      "insurance approved",
      "IICRC certified",
      "24hr emergency response",
      "full documentation"
    ],
    urgencyTriggers: [
      "storm season",
      "mold doubles every 48 hours",
      "insurance deadlines"
    ]
  },
  carpet_cleaning: {
    painPoints: [
      "allergens trapped in carpet",
      "pet odors",
      "stains ruining appearance"
    ],
    valueProps: [
      "truck-mounted deep clean",
      "pet-safe solutions",
      "same-day drying"
    ],
    urgencyTriggers: ["spring cleaning", "holiday prep", "new pet in the home"]
  },
  roofing: {
    painPoints: [
      "missing shingles",
      "roof leaks after rain",
      "storm damage",
      "high utility bills"
    ],
    valueProps: [
      "free storm damage inspection",
      "insurance claim help",
      "lifetime warranty options"
    ],
    urgencyTriggers: [
      "storm season",
      "hail damage",
      "leaks get worse every rain"
    ]
  },
  med_spa: {
    painPoints: [
      "signs of aging",
      "unwanted fat",
      "skin texture",
      "feeling less confident"
    ],
    valueProps: [
      "non-invasive treatments",
      "no downtime",
      "FDA-approved technology",
      "personalized plans"
    ],
    urgencyTriggers: [
      "summer body prep",
      "event coming up",
      "limited slots",
      "seasonal specials"
    ]
  },
  real_estate: {
    painPoints: [
      "missing the right property",
      "overpaying",
      "slow agent response",
      "confusing process"
    ],
    valueProps: [
      "off-market listings",
      "negotiation expertise",
      "neighborhood specialist",
      "seamless process"
    ],
    urgencyTriggers: [
      "interest rate changes",
      "inventory low",
      "spring market heating up"
    ]
  },
  mortgage: {
    painPoints: [
      "denied before",
      "don't know where to start",
      "scared of high rates",
      "confusing paperwork"
    ],
    valueProps: [
      "rate match guarantee",
      "close in 21 days",
      "100+ loan programs",
      "first-time buyer expert"
    ],
    urgencyTriggers: [
      "rates rising",
      "Fed announcement",
      "limited down payment assistance funds"
    ]
  },
  chiropractor: {
    painPoints: [
      "chronic back pain",
      "poor posture from desk work",
      "headaches",
      "car accident recovery"
    ],
    valueProps: [
      "drug-free pain relief",
      "same-day appointments",
      "insurance accepted",
      "holistic approach"
    ],
    urgencyTriggers: [
      "new year new body",
      "back to school posture",
      "sports season starting"
    ]
  },
  dental: {
    painPoints: [
      "tooth pain",
      "embarrassed to smile",
      "avoiding dentist due to anxiety",
      "broken teeth"
    ],
    valueProps: [
      "same-day emergency appointments",
      "anxiety-free sedation options",
      "before/after transformations"
    ],
    urgencyTriggers: [
      "dental insurance year-end benefits",
      "holiday smile prep",
      "new patient specials"
    ]
  }
};
const FUNNEL_PROMPTS = {
  tofu: "educate and create awareness — share a surprising fact or common mistake without selling",
  mofu: "build trust and urgency — share a specific result, case study, or before/after",
  bofu: "drive action now — make a direct offer with a clear next step and booking link"
};
function scoreContentQuality(content, platform) {
  const rules = PLATFORM_RULES[platform];
  let score = 70;
  if (content.length <= rules.maxChars) score += 10;
  if (content.length > rules.maxChars * 1.5) score -= 20;
  if (/\?/.test(content)) score += 5;
  if (/book|call|click|link|comment|dm|message|visit|schedule/i.test(content))
    score += 10;
  if (/\d+/.test(content)) score += 5;
  if (platform === "instagram" && /#\w+/.test(content)) score += 5;
  if (platform === "linkedin" && content.length > 200) score += 5;
  return Math.min(100, score);
}
function formatForPlatform(content, platform) {
  const rules = PLATFORM_RULES[platform];
  let formatted = content.trim();
  if (formatted.length > rules.maxChars) {
    formatted = `${formatted.slice(0, rules.maxChars - 3)}...`;
  }
  if (platform === "instagram") {
    const inlineHashtags = formatted.match(/#\w+/g) ?? [];
    const cleanContent = formatted.replace(/#\w+/g, "").trim();
    if (inlineHashtags.length > 0) {
      formatted = `${cleanContent}

${inlineHashtags.join(" ")}`;
    }
  }
  if (platform === "google_business") {
    formatted = formatted.replace(/#\w+/g, "").trim();
  }
  return formatted;
}
async function iterativeRefine(draft, brandVoice, platform, apiKey, litellmUrl) {
  const initialScore = scoreContentQuality(draft, platform);
  if (initialScore >= 85) {
    return { content: draft, qualityScore: initialScore, refined: false };
  }
  if (!(apiKey == null ? void 0 : apiKey.trim())) {
    return { content: draft, qualityScore: initialScore, refined: false };
  }
  const refinementPrompt = `You are a social media copywriter. Improve this ${platform} post for a ${brandVoice.tone} brand with ${brandVoice.emojiUsage} emoji usage and ${brandVoice.sentenceStyle} sentence style.

Original post:
${draft}

Quality issues to fix:
${initialScore < 80 ? "- Needs stronger CTA" : ""}
${draft.length > PLATFORM_RULES[platform].maxChars ? `- Too long (max ${PLATFORM_RULES[platform].maxChars} chars)` : ""}
${!/\d+/.test(draft) ? "- Add a specific number or stat for credibility" : ""}

Return ONLY the improved post text, nothing else.`;
  try {
    const adapter = new LiteLLMAdapter(
      litellmUrl ?? "https://api.openai.com/v1",
      apiKey
    );
    const result = await adapter.chat(
      [{ role: "user", content: refinementPrompt }],
      "gpt-4o-mini"
    );
    if (result.success && result.content) {
      const refinedScore = scoreContentQuality(result.content, platform);
      if (refinedScore > initialScore) {
        return {
          content: result.content,
          qualityScore: refinedScore,
          refined: true
        };
      }
    }
  } catch {
  }
  return { content: draft, qualityScore: initialScore, refined: false };
}
async function generateNicheContent(params) {
  var _a;
  const {
    niche,
    platforms,
    cadence,
    brandVoiceProfile,
    perplexityKey,
    openAiKey,
    claudeKey,
    litellmUrl,
    searxngUrl,
    location = "your area",
    funnelStage = "tofu"
  } = params;
  const nicheData = NICHE_INTEL[niche];
  const trendInsights = [];
  const citationUrls = [];
  const researchRouter = buildResearchRouter(
    perplexityKey,
    searxngUrl,
    claudeKey,
    openAiKey
  );
  if (researchRouter) {
    try {
      if (researchRouter.type === "perplexity") {
        const result = await researchRouter.adapter.research(
          `Current trends, pain points, and hot topics for ${niche.replace("_", " ")} businesses in ${location}. What are customers asking about and what content is getting engagement?`
        );
        if (result && !isResearchError(result)) {
          if (result.recentActivity.length > 0)
            trendInsights.push(...result.recentActivity);
          citationUrls.push(...result.citations);
        }
      } else if (researchRouter.type === "claude" || researchRouter.type === "openai") {
        const result = await researchRouter.adapter.research(
          `${niche.replace("_", " ")} trends`,
          niche.replace("_", " "),
          location,
          ""
        );
        if (result && !isResearchError(result)) {
          if (result.recentActivity.length > 0)
            trendInsights.push(...result.recentActivity.slice(0, 2));
        }
      } else if (researchRouter.type === "searxng") {
        const result = await researchRouter.adapter.search(
          `${niche.replace("_", " ")} trends social media ${location} 2026`
        );
        if (result.success) {
          trendInsights.push(
            ...result.results.slice(0, 3).map((r) => r.snippet)
          );
        }
      }
    } catch {
    }
  }
  const trendContext = trendInsights.length > 0 ? `
Recent trends and insights:
${trendInsights.join("\n")}` : "";
  const painPoints = nicheData.painPoints.slice(0, 3).join(", ");
  const valueProps = nicheData.valueProps.slice(0, 3).join(", ");
  const urgencyTrigger = nicheData.urgencyTriggers[0];
  const funnelInstruction = FUNNEL_PROMPTS[funnelStage];
  const apiKey = claudeKey ?? openAiKey ?? "";
  const posts = [];
  for (const platform of platforms) {
    const rules = PLATFORM_RULES[platform];
    const prompt = `You are a social media copywriter for a ${niche.replace("_", " ")} business. Write ${cadence === 3 ? "1" : cadence === 7 ? "2" : "3"} ${platform} post(s) that ${funnelInstruction}.

Brand voice: ${brandVoiceProfile.tone}, ${brandVoiceProfile.sentenceStyle} sentences, ${brandVoiceProfile.emojiUsage} emoji usage.
Pain points to address: ${painPoints}
Key value props: ${valueProps}
Urgency angle: ${urgencyTrigger}
Platform format: ${rules.preferredFormat} (max ${rules.maxChars} chars)
CTA style: ${rules.ctaStyle}
${trendContext}

Generate ${cadence === 14 ? "3" : cadence === 7 ? "2" : "1"} unique post(s). Format each as:
POST:
[post content here]
HASHTAGS: [comma-separated, ${rules.hashtagCount} max]
CTA: [single line CTA]

Return ONLY the formatted posts, nothing else.`;
    let generatedText = "";
    if (apiKey.trim()) {
      try {
        const adapter = new LiteLLMAdapter(
          litellmUrl ?? "https://api.openai.com/v1",
          apiKey
        );
        const result = await adapter.chat(
          [{ role: "user", content: prompt }],
          "gpt-4o-mini"
        );
        if (result.success) generatedText = result.content;
      } catch {
      }
    }
    if (!generatedText) {
      const nicheLabel = niche.replace("_", " ");
      const valueFirst = valueProps.split(",")[0].trim();
      const hashtagNiche = niche.replace("_", "");
      const hashtagLocation = location.replace(/\s+/g, "").toLowerCase();
      generatedText = `POST:
Did you know that most ${nicheLabel} problems get worse if ignored? Don't wait until it's an emergency. We specialize in ${valueFirst} — ${urgencyTrigger}. ${rules.ctaStyle}: bookedrankedfunded.org/setup
HASHTAGS: #${hashtagNiche}, #localservice, #${hashtagLocation}
CTA: ${rules.ctaStyle}`;
    }
    const postBlocks = generatedText.split(/(?=POST:)/i).filter((b) => b.trim());
    for (const block of postBlocks) {
      const contentMatch = /POST:\s*([\s\S]*?)(?:HASHTAGS:|CTA:|$)/i.exec(
        block
      );
      const hashtagMatch = /HASHTAGS:\s*([^\n]*)/i.exec(block);
      const ctaMatch = /CTA:\s*([^\n]*)/i.exec(block);
      const rawContent = ((contentMatch == null ? void 0 : contentMatch[1]) ?? block).trim();
      const hashtags = ((hashtagMatch == null ? void 0 : hashtagMatch[1]) ?? "").split(",").map((h) => h.trim().replace(/^#?/, "#")).filter((h) => h.length > 1).slice(0, rules.hashtagCount);
      const ctaText = ((_a = ctaMatch == null ? void 0 : ctaMatch[1]) == null ? void 0 : _a.trim()) ?? rules.ctaStyle;
      const formatted = formatForPlatform(rawContent, platform);
      const { content: refined, qualityScore } = await iterativeRefine(
        formatted,
        brandVoiceProfile,
        platform,
        apiKey,
        litellmUrl
      );
      posts.push({
        platform,
        content: refined,
        hashtags,
        ctaText,
        estimatedReach: Math.floor(Math.random() * 800 + 200),
        // Placeholder — real analytics come from platform APIs
        qualityScore
      });
    }
  }
  return {
    id: `batch-${Date.now()}`,
    niche,
    cadence,
    posts,
    trendInsights,
    citationUrls,
    generatedAt: Date.now()
  };
}
export {
  formatForPlatform as f,
  generateNicheContent as g,
  iterativeRefine as i
};
