function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "GET") return json({ ok: false, error: "Method not allowed." }, 405);

  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return json({ ok: false, service: "roofing-command-center", database: "not_configured" }, 503);
  }

  try {
    const response = await fetch(`${url}/rest/v1/roofing_campaign_leads?select=id&limit=1`, {
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        accept: "application/json",
      },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error("roofing health check failed", { status: response.status, detail: (await response.text()).slice(0, 300) });
      return json({ ok: false, service: "roofing-command-center", database: "unavailable" }, 503);
    }

    return json({ ok: true, service: "roofing-command-center", database: "ready", checkedAt: new Date().toISOString() });
  } catch (error) {
    console.error("roofing health check error", error);
    return json({ ok: false, service: "roofing-command-center", database: "unavailable" }, 503);
  }
};

export const config = { path: "/api/roofing-command-center-health" };
