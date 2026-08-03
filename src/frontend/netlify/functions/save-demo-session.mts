interface SaveDemoSessionRequest {
  clientSessionId?: string;
  firstName?: string;
  businessName?: string;
  niche?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  auditStatus?: "pending" | "live" | "unreachable" | "no_website" | "sample";
  auditResult?: unknown;
  appointment?: unknown;
  smsStatus?: "not_requested" | "preview" | "sent" | "failed";
  smsProvider?: string | null;
  smsMessageId?: string | null;
  source?: string;
  metadata?: Record<string, unknown>;
  completedAt?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function requireText(value: unknown, label: string, max: number): string {
  const cleaned = cleanText(value, max);
  if (!cleaned) throw new Error(`${label} is required.`);
  return cleaned;
}

function getSupabaseConfig(): { url: string; serviceKey: string } {
  const url = Netlify.env.get("SUPABASE_URL");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    throw new Error("Supabase server credentials are not configured.");
  }
  return { url: url.replace(/\/$/, ""), serviceKey };
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 200_000) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as SaveDemoSessionRequest;
    const clientSessionId = requireText(input.clientSessionId, "Client session ID", 120);
    const businessName = requireText(input.businessName, "Business name", 160);
    const niche = requireText(input.niche, "Niche", 100);
    const source = cleanText(input.source, 80) || "brf-demo";
    if (source !== "brf-demo") throw new Error("Invalid demo source.");

    const allowedAudit = new Set(["pending", "live", "unreachable", "no_website", "sample"]);
    const auditStatus = allowedAudit.has(String(input.auditStatus))
      ? input.auditStatus
      : "sample";

    const allowedSms = new Set(["not_requested", "preview", "sent", "failed"]);
    const smsStatus = allowedSms.has(String(input.smsStatus))
      ? input.smsStatus
      : "not_requested";

    const row = {
      client_session_id: clientSessionId,
      first_name: cleanText(input.firstName, 100),
      business_name: businessName,
      niche,
      city: cleanText(input.city, 160),
      phone: cleanText(input.phone, 40),
      email: cleanText(input.email, 254),
      website: cleanText(input.website, 500),
      audit_status: auditStatus,
      audit_result: input.auditResult ?? {},
      appointment: input.appointment ?? {},
      sms_status: smsStatus,
      sms_provider: cleanText(input.smsProvider, 40),
      sms_message_id: cleanText(input.smsMessageId, 160),
      source,
      metadata: input.metadata && typeof input.metadata === "object" ? input.metadata : {},
      completed_at: input.completedAt || new Date().toISOString(),
    };

    const { url, serviceKey } = getSupabaseConfig();
    const response = await fetch(
      `${url}/rest/v1/demo_sessions?on_conflict=client_session_id`,
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          authorization: `Bearer ${serviceKey}`,
          "content-type": "application/json",
          prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify(row),
        signal: AbortSignal.timeout(15_000),
      },
    );

    const payload = (await response.json()) as Array<{ id?: string }> | { message?: string };
    if (!response.ok) {
      const message = !Array.isArray(payload) ? payload.message : undefined;
      throw new Error(message || `Supabase rejected the demo session with status ${response.status}.`);
    }

    const saved = Array.isArray(payload) ? payload[0] : null;
    return json({
      ok: true,
      id: saved?.id || null,
      clientSessionId,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The demo session could not be saved.";
    const status = message.includes("credentials") ? 502 : 422;
    return json({ ok: false, error: message }, status);
  }
};

export const config = {
  path: "/api/save-demo-session",
};
