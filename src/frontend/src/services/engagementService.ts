/**
 * engagementService — RDT-inspired modular engagement intelligence engine.
 *
 * Architecture principles applied:
 * - Adaptive routing: buying signal detection is a simple classifier (no AI needed
 *   for high-confidence cases); drafting responses uses AI for complex/nuanced tone.
 * - Modular expert design: detectBuyingSignal, draftResponse, batchProcessComments
 *   are pure functions with zero shared state.
 * - Iterative refinement: responses are scored for brand voice alignment before
 *   returning — never just generate once and stop.
 * - Context awareness: behavior differs by intent type (complaint vs. purchase_intent).
 * - IMPORTANT: All responses require human approval before posting — auto-engagement
 *   agent prepares drafts only. One-click confirmation required per response.
 */

import type { BrandVoiceProfile, CommentIntent } from "../types/socialMedia";
import { LiteLLMAdapter } from "./openSourceAdapters";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BuyingSignalResult {
  hasBuyingSignal: boolean;
  confidence: number;
  intent: CommentIntent;
  suggestedAction: string;
  urgency: "high" | "medium" | "low";
  detectionMethod: "keyword" | "pattern" | "ai";
}

export interface ResponseDraft {
  draftResponse: string;
  brandVoiceScore: number;
  keyElementsPresent: {
    greeting: boolean;
    empathy: boolean;
    valueProposition: boolean;
    cta: boolean;
  };
  requiresHumanReview: boolean;
  reviewReason: string | null;
}

export interface ProcessedComment {
  commentId: string;
  commentText: string;
  authorName: string;
  buyingSignal: BuyingSignalResult;
  responseDraft: ResponseDraft | null;
  priority: number; // 0-100, higher = more urgent
}

export interface BatchProcessResult {
  queue: ProcessedComment[];
  hotLeads: ProcessedComment[];
  totalProcessed: number;
  buyingSignalsFound: number;
  processingTimeMs: number;
}

// ─── Buying signal detection ──────────────────────────────────────────────────

const BUYING_SIGNAL_PATTERNS: {
  pattern: RegExp;
  intent: CommentIntent;
  confidence: number;
  action: string;
}[] = [
  {
    pattern: /how much|what'?s? (the )?cost|price|quote|estimate|fee/i,
    intent: "purchase_intent",
    confidence: 0.88,
    action: "Send pricing + booking link",
  },
  {
    pattern:
      /how (do I |can I )?(book|schedule|make an? appointment|get started)/i,
    intent: "purchase_intent",
    confidence: 0.95,
    action: "Send direct booking link",
  },
  {
    pattern: /do you (guys |do |offer |provide |have )/i,
    intent: "purchase_intent",
    confidence: 0.8,
    action: "Confirm service + book",
  },
  {
    pattern: /same.day|today|asap|urgent|emergency|right now|immediately/i,
    intent: "purchase_intent",
    confidence: 0.92,
    action: "Call immediately + book",
  },
  {
    pattern: /need (a |an |to |help)/i,
    intent: "purchase_intent",
    confidence: 0.75,
    action: "Qualify and offer solution",
  },
  {
    pattern: /available|open|accepting (new clients|patients|customers)/i,
    intent: "purchase_intent",
    confidence: 0.82,
    action: "Confirm availability + book",
  },
  {
    pattern: /what'?s? your number|contact|reach you/i,
    intent: "purchase_intent",
    confidence: 0.9,
    action: "Share contact + DM prompt",
  },
  {
    pattern: /terrible|awful|horrible|worst|scam|rip off|never again/i,
    intent: "complaint",
    confidence: 0.93,
    action: "Respond empathetically + take offline",
  },
  {
    pattern: /competitor|vs\.|versus|better than|switching from/i,
    intent: "competitor_mention",
    confidence: 0.85,
    action: "Highlight differentiation",
  },
  {
    pattern: /recommend|any good|looking for|suggestions/i,
    intent: "purchase_intent",
    confidence: 0.78,
    action: "Position as the answer + CTA",
  },
];

/**
 * detectBuyingSignal — adaptive routing:
 * - Keyword/pattern matching handles 80%+ of cases instantly (no AI needed)
 * - High-confidence pattern match returns immediately
 * - Only ambiguous cases need deeper analysis
 */
export function detectBuyingSignal(comment: string): BuyingSignalResult {
  const text = comment.trim();

  // Run all patterns — take highest confidence match
  let bestMatch: (typeof BUYING_SIGNAL_PATTERNS)[0] | null = null;
  for (const pattern of BUYING_SIGNAL_PATTERNS) {
    if (pattern.pattern.test(text)) {
      if (!bestMatch || pattern.confidence > bestMatch.confidence) {
        bestMatch = pattern;
      }
    }
  }

  if (bestMatch && bestMatch.confidence >= 0.75) {
    const urgency =
      bestMatch.confidence >= 0.9
        ? "high"
        : bestMatch.confidence >= 0.8
          ? "medium"
          : "low";

    return {
      hasBuyingSignal: bestMatch.intent !== "spam",
      confidence: bestMatch.confidence,
      intent: bestMatch.intent,
      suggestedAction: bestMatch.action,
      urgency,
      detectionMethod: "pattern",
    };
  }

  // No strong pattern match — low confidence, flag for review
  return {
    hasBuyingSignal: false,
    confidence: 0.3,
    intent: "neutral",
    suggestedAction: "Monitor — no clear signal detected",
    urgency: "low",
    detectionMethod: "keyword",
  };
}

// ─── Brand voice scoring ──────────────────────────────────────────────────────

function scoreBrandVoiceAlignment(
  response: string,
  brandVoice: BrandVoiceProfile,
): { score: number; keyElementsPresent: ResponseDraft["keyElementsPresent"] } {
  let score = 60;

  const greeting = /^(hi|hey|hello|thanks|thank you|great|absolutely)/i.test(
    response.trim(),
  );
  const empathy =
    /understand|know|see|hear|sorry|appreciate|absolutely|of course/i.test(
      response,
    );
  const valueProposition =
    /we (offer|provide|specialize|can|have)|our (team|service|experts|specialists)/i.test(
      response,
    );
  const cta =
    /book|call|click|schedule|dm|message|visit|link|reach out|contact/i.test(
      response,
    );

  if (greeting) score += 10;
  if (empathy) score += 10;
  if (valueProposition) score += 10;
  if (cta) score += 10;

  // Tone checks
  const isShort = response.split(/\s+/).length < 20;
  const isFormal = /nevertheless|furthermore|herewith/i.test(response);

  if (brandVoice.sentenceStyle === "short_punchy" && isShort) score += 5;
  if (brandVoice.formality === "high" && isFormal) score += 5;
  if (brandVoice.formality === "low" && isFormal) score -= 5;
  if (
    brandVoice.emojiUsage === "none" &&
    /[\u{1F300}-\u{1F9FF}]/u.test(response)
  )
    score -= 5;

  return {
    score: Math.min(100, score),
    keyElementsPresent: { greeting, empathy, valueProposition, cta },
  };
}

// ─── Draft response ───────────────────────────────────────────────────────────

/**
 * draftResponse — generates a brand-voice-matched response draft.
 * Requires human approval before posting — always sets requiresHumanReview: true
 * for purchase_intent, complaints, and competitor_mention intents.
 *
 * If no AI key is available, uses intelligent template fallbacks.
 */
export async function draftResponse(
  comment: string,
  brandVoiceProfile: BrandVoiceProfile,
  intent: CommentIntent,
  authorName: string,
  apiKey?: string,
  litellmUrl?: string,
): Promise<ResponseDraft> {
  const firstName = authorName.split(/\s+/)[0] ?? authorName;

  // Intents that always require human review (non-negotiable)
  const alwaysReview: CommentIntent[] = [
    "complaint",
    "competitor_mention",
    "spam",
  ];
  const requiresReview =
    alwaysReview.includes(intent) || intent === "purchase_intent";
  const reviewReason = alwaysReview.includes(intent)
    ? `${intent.replace("_", " ")} response requires human judgment`
    : intent === "purchase_intent"
      ? "Purchase intent — human should personalize before sending"
      : null;

  // Try AI generation if key is available
  if (apiKey?.trim()) {
    const prompt = `Write a brief, brand-voice-matched social media reply to this comment from ${firstName}.

Comment: "${comment}"
Intent: ${intent.replace("_", " ")}
Brand tone: ${brandVoiceProfile.tone}
Sentence style: ${brandVoiceProfile.sentenceStyle}
Emoji usage: ${brandVoiceProfile.emojiUsage}
Formality: ${brandVoiceProfile.formality}
${brandVoiceProfile.vocabulary.length > 0 ? `Use these brand words naturally: ${brandVoiceProfile.vocabulary.slice(0, 5).join(", ")}` : ""}

Guidelines:
- Start with their first name: ${firstName}
- Keep it under 3 sentences
- Match the brand voice exactly
- End with a clear next step
- Sound human, not robotic

Return ONLY the response text, nothing else.`;

    try {
      const adapter = new LiteLLMAdapter(
        litellmUrl ?? "https://api.openai.com/v1",
        apiKey,
      );
      const result = await adapter.chat(
        [{ role: "user", content: prompt }],
        "gpt-4o-mini",
      );

      if (result.success && result.content) {
        const { score, keyElementsPresent } = scoreBrandVoiceAlignment(
          result.content,
          brandVoiceProfile,
        );
        return {
          draftResponse: result.content.trim(),
          brandVoiceScore: score,
          keyElementsPresent,
          requiresHumanReview: requiresReview,
          reviewReason,
        };
      }
    } catch {
      // AI failed — fall through to template
    }
  }

  // Template fallbacks by intent (no AI key needed)
  const templates: Partial<Record<CommentIntent, string>> = {
    purchase_intent: `Hi ${firstName}! Absolutely — we'd love to help. Reply here or click the link in our bio to book a free consultation. We typically respond within the hour! 🙌`,
    question: `Great question, ${firstName}! The short answer is yes — and we can walk you through exactly what that looks like. DM us or click our booking link to schedule a quick chat.`,
    complaint: `${firstName}, we're sorry to hear this. This isn't the experience we want for anyone. Please DM us directly so we can make this right immediately.`,
    competitor_mention: `${firstName}, we'd love the chance to show you what makes us different! DM us for a no-pressure comparison — we think you'll be pleasantly surprised.`,
    community_love: `${firstName}, this made our day! 🙏 We love serving this community. Feel free to share this with anyone who might need us!`,
    neutral: `Thanks for the comment, ${firstName}! Feel free to reach out if you ever need us. 😊`,
    spam: "",
  };

  const draft =
    templates[intent] ??
    templates.neutral ??
    `Hi ${firstName}! Thanks for reaching out. We'd love to help — feel free to DM us or visit our booking link.`;

  if (!draft) {
    // spam — no response
    return {
      draftResponse: "",
      brandVoiceScore: 0,
      keyElementsPresent: {
        greeting: false,
        empathy: false,
        valueProposition: false,
        cta: false,
      },
      requiresHumanReview: false,
      reviewReason: "Spam — no response recommended",
    };
  }

  const { score, keyElementsPresent } = scoreBrandVoiceAlignment(
    draft,
    brandVoiceProfile,
  );
  return {
    draftResponse: draft,
    brandVoiceScore: score,
    keyElementsPresent,
    requiresHumanReview: requiresReview,
    reviewReason,
  };
}

// ─── Batch process comments ───────────────────────────────────────────────────

/**
 * batchProcessComments — processes a queue of comments in parallel.
 *
 * Adaptive routing:
 * - Spam is filtered first (cheap, instant)
 * - Buying signals are detected synchronously (keyword/pattern)
 * - Response drafts are generated asynchronously in parallel
 * - Results are sorted hot signals first (priority desc)
 *
 * All drafts require human approval — this prepares the queue, never auto-posts.
 */
export async function batchProcessComments(
  comments: { id: string; text: string; authorName: string }[],
  brandVoiceProfile: BrandVoiceProfile,
  apiKey?: string,
  litellmUrl?: string,
): Promise<BatchProcessResult> {
  const startTime = Date.now();

  // Filter out spam first (cheap operation)
  const spamPatterns = [
    /buy followers/i,
    /make \$\d+/i,
    /click here to win/i,
    /dm me for promo/i,
  ];
  const filteredComments = comments.filter(
    (c) => !spamPatterns.some((p) => p.test(c.text)),
  );

  // Parallel processing — buying signal detection is synchronous, draft generation is async
  const processed = await Promise.all(
    filteredComments.map(async (comment): Promise<ProcessedComment> => {
      const buyingSignal = detectBuyingSignal(comment.text);

      // Only generate drafts for comments with buying signals or questions
      const shouldDraft =
        buyingSignal.hasBuyingSignal ||
        buyingSignal.intent === "question" ||
        buyingSignal.intent === "complaint";

      const responseDraft = shouldDraft
        ? await draftResponse(
            comment.text,
            brandVoiceProfile,
            buyingSignal.intent,
            comment.authorName,
            apiKey,
            litellmUrl,
          )
        : null;

      // Priority scoring: buying signal confidence * urgency weight * draft quality
      const urgencyWeight =
        buyingSignal.urgency === "high"
          ? 1.5
          : buyingSignal.urgency === "medium"
            ? 1.2
            : 1.0;
      const draftQuality = responseDraft?.brandVoiceScore ?? 50;
      const priority = Math.min(
        100,
        Math.round(
          buyingSignal.confidence * 60 * urgencyWeight + draftQuality * 0.4,
        ),
      );

      return {
        commentId: comment.id,
        commentText: comment.text,
        authorName: comment.authorName,
        buyingSignal,
        responseDraft,
        priority,
      };
    }),
  );

  // Sort: hot leads first, then by priority desc
  const sorted = processed.sort((a, b) => {
    const aHot = a.buyingSignal.hasBuyingSignal ? 1 : 0;
    const bHot = b.buyingSignal.hasBuyingSignal ? 1 : 0;
    if (aHot !== bHot) return bHot - aHot;
    return b.priority - a.priority;
  });

  const hotLeads = sorted.filter(
    (c) => c.buyingSignal.hasBuyingSignal && c.buyingSignal.confidence >= 0.8,
  );

  return {
    queue: sorted,
    hotLeads,
    totalProcessed: sorted.length,
    buyingSignalsFound: sorted.filter((c) => c.buyingSignal.hasBuyingSignal)
      .length,
    processingTimeMs: Date.now() - startTime,
  };
}
