interface AgentRequest {
  task?: string;
  context?: Record<string, unknown>;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function getConfig(): { baseUrl: string; token: string; path: string } {
  const baseUrl = Netlify.env.get("NEMO_AGENT_BASE_URL")?.replace(/\/$/, "");
  const token = Netlify.env.get("NEMO_AGENT_SERVICE_TOKEN");
  const path = Netlify.env.get("NEMO_AGENT_CHAT_PATH") || "/v1/chat/completions";
  if (!baseUrl || !token) {
    throw new Error("The NeMo Agent Toolkit service is not configured.");
  }
  return { baseUrl, token, path: path.startsWith("/") ? path : `/${path}` };
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 100_000) return json({ ok: false, error: "Request is too large." }, 413);

  try {
    const input = (await request.json()) as AgentRequest;
    const task = typeof input.task === "string" ? input.task.trim().slice(0, 4000) : "";
    if (!task) return json({ ok: false, error: "An agent task is required." }, 400);

    const { baseUrl, token, path } = getConfig();
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "brf-agent",
        messages: [
          {
            role: "user",
            content: `${task}\n\nStructured BRF context:\n${JSON.stringify(input.context || {})}`,
          },
        ],
        stream: false,
      }),
      signal: AbortSignal.timeout(45_000),
    });

    const payload = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      const error = payload.error;
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message || "")
          : "";
      throw new Error(message || `Agent service returned status ${response.status}.`);
    }

    return json({ ok: true, result: payload, completedAt: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The agent workflow failed.";
    return json({ ok: false, error: message }, message.includes("not configured") ? 503 : 502);
  }
};

export const config = {
  path: "/api/agent-orchestrate",
};
