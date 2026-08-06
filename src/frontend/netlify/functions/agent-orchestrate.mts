import {
  BrfIntelligenceError,
  runBrfIntelligence,
} from "./_shared/brf-intelligence.mts";

interface AgentRequest {
  task?: string;
  context?: Record<string, unknown>;
  responseFormat?: "text" | "json";
}

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

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }
  if (!isTrustedRequest(request)) {
    return json({ ok: false, error: "Request is not authorized." }, 403);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 100_000) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as AgentRequest;
    const task =
      typeof input.task === "string" ? input.task.trim().slice(0, 8_000) : "";
    if (!task) {
      return json({ ok: false, error: "An agent task is required." }, 400);
    }

    const result = await runBrfIntelligence({
      taskType: "orchestration",
      prompt: task,
      context:
        input.context &&
        typeof input.context === "object" &&
        !Array.isArray(input.context)
          ? input.context
          : {},
      responseFormat: input.responseFormat === "text" ? "text" : "json",
      timeoutMs: 50_000,
      maxTokens: 3500,
    });

    return json({
      ok: true,
      result: result.data,
      intelligence: {
        provider: result.provider,
        model: result.model,
        attempts: result.attempts,
        correlationId: result.correlationId,
      },
      completedAt: result.completedAt,
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
    const message =
      error instanceof Error ? error.message : "The agent workflow failed.";
    return json({ ok: false, error: message }, 422);
  }
};

export const config = {
  path: "/api/agent-orchestrate",
};
