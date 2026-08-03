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

function config() {
  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("Supabase is not configured.");
  return { url, serviceKey };
}

function isAuthorized(request: Request): boolean {
  const expected = Netlify.env.get("ROOFING_COMMAND_CENTER_TOKEN");
  if (!expected) return true;
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7).trim() : "";
  return token.length > 0 && token === expected;
}

async function supabaseGet<T>(path: string): Promise<T> {
  const { url, serviceKey } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      accept: "application/json",
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    console.error("roofing command center Supabase read failed", { status: response.status, detail });
    throw new Error(`Supabase request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "GET") return json({ ok: false, error: "Method not allowed." }, 405);
  if (!isAuthorized(request)) return json({ ok: false, error: "Unauthorized." }, 401);

  try {
    const [leads, events, audits, drafts] = await Promise.all([
      supabaseGet<any[]>("roofing_campaign_leads?select=*&order=created_at.desc&limit=200"),
      supabaseGet<any[]>("roofing_campaign_events?select=*&order=occurred_at.desc&limit=1000"),
      supabaseGet<any[]>("roofing_campaign_audits?select=*&order=created_at.desc&limit=500"),
      supabaseGet<any[]>("roofing_campaign_email_drafts?select=*&order=created_at.desc&limit=500"),
    ]);

    const eventsByLead = new Map<string, any[]>();
    for (const event of events) {
      const list = eventsByLead.get(event.lead_id) ?? [];
      list.push(event);
      eventsByLead.set(event.lead_id, list);
    }

    const latestAuditByLead = new Map<string, any>();
    for (const audit of audits) {
      if (!latestAuditByLead.has(audit.lead_id)) latestAuditByLead.set(audit.lead_id, audit);
    }

    const latestDraftByLead = new Map<string, any>();
    for (const draft of drafts) {
      if (!latestDraftByLead.has(draft.lead_id)) latestDraftByLead.set(draft.lead_id, draft);
    }

    const enriched = leads.map((lead) => ({
      ...lead,
      timeline: eventsByLead.get(lead.id) ?? [],
      audit: latestAuditByLead.get(lead.id) ?? null,
      emailDraft: latestDraftByLead.get(lead.id) ?? null,
    }));

    const counts = leads.reduce<Record<string, number>>((acc, lead) => {
      const stage = typeof lead.stage === "string" ? lead.stage : "unknown";
      acc[stage] = (acc[stage] ?? 0) + 1;
      return acc;
    }, {});

    return json({
      ok: true,
      generatedAt: new Date().toISOString(),
      leads: enriched,
      metrics: {
        totalLeads: leads.length,
        playbooksSent: counts.playbook_sent ?? 0,
        demosWatched: counts.demo_watched ?? 0,
        auditsReady: counts.audit_ready ?? 0,
        emailDrafts: drafts.filter((draft) => draft.status === "pending_approval").length,
        appointments: counts.appointment ?? 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load campaign data.";
    return json({ ok: false, error: message }, 500);
  }
};

export const config = { path: "/api/get-roofing-campaign-command-center" };
