import type {
  BrfIntelligenceRequest,
  BrfIntelligenceTask,
} from "./_shared/brf-intelligence.mts";
import {
  BrfIntelligenceError,
  runBrfIntelligence,
} from "./_shared/brf-intelligence.mts";

interface PublicIntelligenceRequest {
  taskType?: BrfIntelligenceTask;
  prompt?: string;
  context?: Record<string, unknown>;
  responseFormat?: "text" | "json";
  maxTokens?: number;
}

const ALLOWED_TASKS = new Set<BrfIntelligenceTask>([
  "audit",
  "content",
  "strategy",
  "orchestration",
  "lead_scoring",
  "general",
]);

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

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }
  if (!isTrustedRequest(request)) {
    return json({ ok: false, error: "Request is not authorized." }, 403);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 150_000) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as PublicIntelligenceRequest;
    const taskType = input.taskType ?? "general";
    if (!ALLOWED_TASKS.has(taskType)) {
      return json({ ok: false, error: "Unsupported intelligence task." }, 400);
    }
    const prompt =
      typeof input.prompt === "string"
        ? input.prompt.trim().slice(0, 20_000)
        : "";
    if (!prompt) {
      return json({ ok: false, error: "An intelligence prompt is required." }, 400);
    }

    const intelligenceRequest: BrfIntelligenceRequest = {
      taskType,
      prompt,
      context:
        input.context &&
        typeof input.context === "object" &&
        !Array.isArray(input.context)
          ? input.context
          : {},
      responseFormat: input.responseFormat === "json" ? "json" : "text",
      maxTokens: input.maxTokens,
      timeoutMs: 50_000,
    };

    const result = await runBrfIntelligence(intelligenceRequest);
    return json({ ok: true, ...result });
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
            : "Intelligence request failed.",
      },
      422,
    );
  }
}

export const config = {
  path: "/api/brf-intelligence",
};
