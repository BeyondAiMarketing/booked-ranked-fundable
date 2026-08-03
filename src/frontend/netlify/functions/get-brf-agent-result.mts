function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function getConfig(): { url: string; serviceKey: string } {
  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("Supabase server credentials are not configured.");
  return { url, serviceKey };
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }

  try {
    const body = (await request.json()) as { clientSessionId?: string };
    const clientSessionId = String(body.clientSessionId || "").trim().slice(0, 120);
    if (!clientSessionId) return json({ ok: false, error: "Client session ID is required." }, 400);

    const { url, serviceKey } = getConfig();
    const response = await fetch(
      `${url}/rest/v1/brf_agent_runs?client_session_id=eq.${encodeURIComponent(clientSessionId)}&task_type=eq.business_action_plan&select=id,status,output,error,model,provider,attempts,created_at,started_at,finished_at&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          authorization: `Bearer ${serviceKey}`,
        },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) throw new Error(`Supabase lookup failed with status ${response.status}.`);
    const runs = (await response.json()) as Array<Record<string, unknown>>;
    const run = runs[0] || null;

    return json({ ok: true, run });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The agent result could not be loaded.";
    return json({ ok: false, error: message }, message.includes("credentials") ? 502 : 422);
  }
};

export const config = {
  path: "/api/get-brf-agent-result",
};
