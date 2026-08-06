export type BrfIntelligenceTask =
  | "audit"
  | "content"
  | "strategy"
  | "orchestration"
  | "lead_scoring"
  | "general";

export interface BrfIntelligenceResponse<T = unknown> {
  ok: boolean;
  provider?: string;
  model?: string;
  data?: T;
  content?: string;
  attempts?: Array<{
    provider: string;
    model: string;
    status: "skipped" | "failed" | "succeeded";
    latencyMs: number;
    error?: string;
  }>;
  correlationId?: string;
  completedAt?: string;
  error?: string;
  code?: string;
}

export async function runBrfIntelligence<T = unknown>(input: {
  taskType: BrfIntelligenceTask;
  prompt: string;
  context?: Record<string, unknown>;
  responseFormat?: "text" | "json";
  maxTokens?: number;
}): Promise<BrfIntelligenceResponse<T>> {
  const response = await fetch("/api/brf-intelligence", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as BrfIntelligenceResponse<T>;
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "BRF intelligence request failed.");
  }
  return payload;
}

export interface NemoSocialContentPost {
  platform:
    | "facebook"
    | "instagram"
    | "linkedin"
    | "google_business"
    | "tiktok";
  content: string;
  hashtags: string[];
  ctaText: string;
  qualityScore: number;
}

export interface NemoSocialContentBatch {
  posts: NemoSocialContentPost[];
  trendInsights: string[];
  citationUrls: string[];
}

export async function generateSocialContentWithNemo(input: {
  niche: string;
  platforms: NemoSocialContentPost["platform"][];
  cadence: number;
  location?: string;
  funnelStage?: "tofu" | "mofu" | "bofu";
  brandVoice?: Record<string, unknown>;
  offer?: string;
  evidence?: Record<string, unknown>;
}): Promise<{ batch: NemoSocialContentBatch; provider: string; model: string }> {
  const response = await fetch("/api/social-content-intelligence", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as {
    ok?: boolean;
    batch?: NemoSocialContentBatch;
    intelligence?: { provider?: string; model?: string };
    error?: string;
  };
  if (!response.ok || !payload.ok || !payload.batch) {
    throw new Error(payload.error || "Nemo social content generation failed.");
  }
  return {
    batch: payload.batch,
    provider: payload.intelligence?.provider || "unknown",
    model: payload.intelligence?.model || "unknown",
  };
}
