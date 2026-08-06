import {
  BrfIntelligenceError,
  runBrfIntelligence,
} from "./_shared/brf-intelligence.mts";

type SocialPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "google_business"
  | "tiktok";

interface ContentRequest {
  niche?: string;
  platforms?: SocialPlatform[];
  cadence?: number;
  location?: string;
  funnelStage?: "tofu" | "mofu" | "bofu";
  brandVoice?: Record<string, unknown>;
  offer?: string;
  evidence?: Record<string, unknown>;
}

const PLATFORM_LIMITS: Record<SocialPlatform, number> = {
  facebook: 500,
  instagram: 300,
  linkedin: 700,
  google_business: 300,
  tiktok: 150,
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function isTrustedRequest(request: Request): boolean {
  const serviceToken = Netlify.env.get("BRF_INTELLIGENCE_SERVICE_TOKEN")?.trim();
  const authorization = request.headers.get("authorization");
  if (serviceToken && authorization === `Bearer ${serviceToken}`) return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;
  if (origin === new URL(request.url).origin) return true;

  const allowed = (Netlify.env.get("BRF_ALLOWED_ORIGINS") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return allowed.includes(origin);
}

function normalizeSocialBatch(
  data: unknown,
  requestedPlatforms: SocialPlatform[],
): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Provider returned an invalid social content batch.");
  }
  const batch = data as Record<string, unknown>;
  if (!Array.isArray(batch.posts)) {
    throw new Error("Provider content batch is missing posts.");
  }

  const allowed = new Set(requestedPlatforms);
  const posts = batch.posts.flatMap((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const post = value as Record<string, unknown>;
    const platform = String(post.platform || "") as SocialPlatform;
    const content = typeof post.content === "string" ? post.content.trim() : "";
    if (!allowed.has(platform) || !content) return [];

    const score = Number(post.qualityScore);
    return [
      {
        platform,
        content: content.slice(0, PLATFORM_LIMITS[platform]),
        hashtags: Array.isArray(post.hashtags)
          ? post.hashtags
              .filter((tag): tag is string => typeof tag === "string")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .slice(0, 20)
          : [],
        ctaText:
          typeof post.ctaText === "string"
            ? post.ctaText.trim().slice(0, 240)
            : "",
        qualityScore: Number.isFinite(score)
          ? Math.min(100, Math.max(0, Math.round(score)))
          : 0,
      },
    ];
  });

  if (posts.length === 0) {
    throw new Error("Provider returned no valid requested-platform posts.");
  }

  const trendInsights = Array.isArray(batch.trendInsights)
    ? batch.trendInsights
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
        .slice(0, 12)
    : [];
  const citationUrls = Array.isArray(batch.citationUrls)
    ? batch.citationUrls
        .filter((value): value is string => typeof value === "string")
        .filter((value) => /^https:\/\//i.test(value))
        .slice(0, 12)
    : [];

  return { posts, trendInsights, citationUrls };
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }
  if (!isTrustedRequest(request)) {
    return json({ ok: false, error: "Request is not authorized." }, 403);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 75_000) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as ContentRequest;
    const platforms = Array.isArray(input.platforms)
      ? input.platforms.filter(
          (platform): platform is SocialPlatform => platform in PLATFORM_LIMITS,
        )
      : [];
    if (!input.niche?.trim() || platforms.length === 0) {
      return json(
        {
          ok: false,
          error: "A niche and at least one platform are required.",
        },
        400,
      );
    }

    const platformRules = Object.fromEntries(
      platforms.map((platform) => [
        platform,
        { maxCharacters: PLATFORM_LIMITS[platform] },
      ]),
    );
    const result = await runBrfIntelligence({
      taskType: "content",
      prompt: `Create a platform-native social content batch. Return strict JSON with this exact shape:
{
  "posts": [{
    "platform": "facebook"|"instagram"|"linkedin"|"google_business"|"tiktok",
    "content": string,
    "hashtags": string[],
    "ctaText": string,
    "qualityScore": number
  }],
  "trendInsights": string[],
  "citationUrls": string[]
}
Generate only for the requested platforms. Quality scores must evaluate the generated copy; do not fabricate reach or performance. Citation URLs must be empty unless supplied evidence contains real source URLs.`,
      context: {
        niche: input.niche.trim().slice(0, 80),
        platforms,
        cadence: Math.min(14, Math.max(1, Number(input.cadence) || 7)),
        location:
          input.location?.trim().slice(0, 120) || "local service area",
        funnelStage: input.funnelStage || "tofu",
        brandVoice: input.brandVoice || {},
        offer: input.offer?.trim().slice(0, 1000) || "",
        evidence: input.evidence || {},
        platformRules,
      },
      responseFormat: "json",
      validateData: (data) => normalizeSocialBatch(data, platforms),
      maxTokens: 4000,
      timeoutMs: 50_000,
    });

    return json({
      ok: true,
      batch: result.data,
      intelligence: {
        provider: result.provider,
        model: result.model,
        attempts: result.attempts,
        correlationId: result.correlationId,
      },
      generatedAt: result.completedAt,
    });
  } catch (error) {
    if (error instanceof BrfIntelligenceError) {
      return json(
        {
          ok: false,
          error: error.message,
          code: error.code,
          attempts: error.attempts,
        },
        error.code === "NO_PROVIDER_CONFIGURED" ? 503 : 502,
      );
    }
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Content generation failed.",
      },
      422,
    );
  }
};

export const config = {
  path: "/api/social-content-intelligence",
};
