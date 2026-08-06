interface LeadRequest {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  consentMarketing?: boolean;
  utm?: Record<string, string>;
}

type EbookStatus = "delivered" | "pending" | "failed";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clean(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\u0000/g, "");
  return normalized ? normalized.slice(0, max) : null;
}

function required(value: unknown, label: string, max: number): string {
  const result = clean(value, max);
  if (!result) throw new Error(`${label} is required.`);
  return result;
}

function buildConfig() {
  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("Lead storage is not configured.");
  return { url, serviceKey };
}

async function sendPlaybookEmail(input: {
  email: string;
  firstName: string;
  businessName: string;
  leadId: string;
}): Promise<EbookStatus> {
  const apiKey = Netlify.env.get("RESEND_API_KEY");
  const from = Netlify.env.get("ROOFING_PLAYBOOK_FROM_EMAIL");
  const pdfUrl = Netlify.env.get("ROOFING_PLAYBOOK_PDF_URL");
  if (!apiKey || !from || !pdfUrl) return "pending";

  const demoUrl = `https://bookedrankedfunded.org/demo?niche=roofing&source=roofing-playbook&lead=${encodeURIComponent(input.leadId)}`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject: `${input.firstName}, your Free Roofing AI Playbook is ready — your audit is next`,
        html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#152033;line-height:1.6"><h1 style="font-size:28px">Your Free Roofer AI Playbook is ready</h1><p>Hi ${input.firstName},</p><p>Thanks for requesting the playbook and personalized website audit for <strong>${input.businessName}</strong>.</p><p><a href="${pdfUrl}" style="display:inline-block;background:#f59e0b;color:#111827;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Download the Free Playbook</a></p><p><strong>Your free roofing website audit is now being prepared.</strong> It will arrive in a separate email after the homepage review is complete.</p><p>While the audit is being prepared, see the ideas working in the roofing growth demo:</p><p><a href="${demoUrl}" style="display:inline-block;background:#172554;color:white;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Launch the Roofing Demo</a></p><p style="font-size:12px;color:#64748b">The audit is a rapid homepage review based on observable evidence. Recommendations do not guarantee rankings, financing, leads, or revenue.</p></div>`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    return response.ok ? "delivered" : "failed";
  } catch {
    return "failed";
  }
}

async function supabaseWrite(
  path: string,
  method: "POST" | "PATCH",
  body: unknown,
  prefer = "return=representation",
) {
  const { url, serviceKey } = buildConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
      prefer,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : `Supabase request failed: ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

async function upsertCampaignLead(input: {
  playbookLeadId: string;
  firstName: string;
  lastName: string | null;
  businessName: string;
  email: string;
  phone: string | null;
  website: string | null;
  city: string | null;
  ebookStatus: EbookStatus;
}) {
  const campaignRow = {
    playbook_lead_id: input.playbookLeadId,
    company_name: input.businessName,
    contact_name: [input.firstName, input.lastName].filter(Boolean).join(" "),
    email: input.email,
    phone: input.phone,
    website: input.website,
    city: input.city,
    source: "roofing_playbook",
    campaign_key: "roofing_ai_growth_playbook",
    stage: input.ebookStatus === "delivered" ? "playbook_sent" : "new",
    next_action:
      input.ebookStatus === "delivered"
        ? "Watch roofing demo"
        : "Configure playbook delivery",
    assigned_agent: "Nemotron Roofing Agent",
    metadata: { ebookStatus: input.ebookStatus },
  };

  const payload = (await supabaseWrite(
    "roofing_campaign_leads?on_conflict=campaign_key,email",
    "POST",
    campaignRow,
    "resolution=merge-duplicates,return=representation",
  )) as Array<{ id: string }>;

  const campaignLeadId = payload?.[0]?.id;
  if (!campaignLeadId) throw new Error("Campaign lead could not be created.");

  const eventType =
    input.ebookStatus === "delivered" ? "playbook_sent" : "playbook_requested";
  const events = [
    {
      lead_id: campaignLeadId,
      event_type: "lead_created",
      event_label: "Lead created",
      event_detail: "Captured from the Roofing AI Growth Playbook funnel.",
      event_data: { playbookLeadId: input.playbookLeadId },
      idempotency_key: `${campaignLeadId}:lead_created`,
    },
    {
      lead_id: campaignLeadId,
      event_type: eventType,
      event_label:
        input.ebookStatus === "delivered"
          ? "Playbook sent"
          : "Playbook requested",
      event_detail:
        input.ebookStatus === "delivered"
          ? "The Roofing AI Growth Playbook was delivered by email."
          : "The lead requested the playbook; delivery is pending provider configuration.",
      event_data: { ebookStatus: input.ebookStatus },
      idempotency_key: `${campaignLeadId}:${eventType}`,
    },
  ];

  await supabaseWrite(
    "roofing_campaign_events?on_conflict=idempotency_key",
    "POST",
    events,
    "resolution=ignore-duplicates,return=minimal",
  );

  return campaignLeadId;
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST")
    return json({ ok: false, error: "Method not allowed." }, 405);
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("application/json")
  ) {
    return json(
      { ok: false, error: "Content type must be application/json." },
      415,
    );
  }
  if (Number(request.headers.get("content-length") || 0) > 30_000) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as LeadRequest;
    const firstName = required(input.firstName, "First name", 100);
    const businessName = required(input.businessName, "Business name", 160);
    const email = required(input.email, "Email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Enter a valid email address.");
    if (input.consentMarketing !== true)
      throw new Error(
        "Consent is required to send the playbook and related follow-up.",
      );

    const lastName = clean(input.lastName, 100);
    const phone = clean(input.phone, 40);
    const website = required(input.website, "Website", 500);
    const city = clean(input.city, 160);
    const utm =
      input.utm && typeof input.utm === "object"
        ? Object.fromEntries(
            Object.entries(input.utm)
              .slice(0, 20)
              .map(([key, value]) => [
                key.slice(0, 80),
                String(value).slice(0, 300),
              ]),
          )
        : {};

    const payload = (await supabaseWrite("roofing_playbook_leads", "POST", {
      first_name: firstName,
      last_name: lastName,
      business_name: businessName,
      email,
      phone,
      website,
      city,
      source: "roofing-ai-growth-playbook",
      campaign: "roofing-ai-growth-playbook",
      consent_marketing: true,
      ebook_status: "pending",
      metadata: {
        utm,
        userAgent: clean(request.headers.get("user-agent"), 500),
      },
    })) as Array<{ id?: string }>;

    if (!Array.isArray(payload) || !payload[0]?.id)
      throw new Error("The lead could not be saved.");
    const leadId = payload[0].id;
    const ebookStatus = await sendPlaybookEmail({
      email,
      firstName,
      businessName,
      leadId,
    });

    if (ebookStatus !== "pending") {
      await supabaseWrite(
        `roofing_playbook_leads?id=eq.${encodeURIComponent(leadId)}`,
        "PATCH",
        { ebook_status: ebookStatus },
        "return=minimal",
      );
    }

    let campaignLeadId: string | null = null;
    let enrollmentWarning: string | null = null;
    try {
      campaignLeadId = await upsertCampaignLead({
        playbookLeadId: leadId,
        firstName,
        lastName,
        businessName,
        email,
        phone,
        website,
        city,
        ebookStatus,
      });
    } catch (error) {
      enrollmentWarning =
        error instanceof Error
          ? error.message
          : "Campaign enrollment is pending.";
      console.error("roofing campaign enrollment failed", {
        leadId,
        error: enrollmentWarning,
      });
    }

    let auditStatus: "queued" | "failed" = "failed";
    try {
      const origin = new URL(request.url).origin;
      const auditDispatch = await fetch(
        `${origin}/.netlify/functions/send-roofing-audit-background`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            leadId,
            campaignLeadId,
            firstName,
            businessName,
            email,
            website,
            city,
          }),
          signal: AbortSignal.timeout(5_000),
        },
      );
      auditStatus = auditDispatch.ok ? "queued" : "failed";
      if (!auditDispatch.ok) {
        console.error("roofing audit dispatch returned a non-success status", {
          leadId,
          status: auditDispatch.status,
        });
      }
    } catch (error) {
      console.error("roofing audit dispatch could not be started", {
        leadId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const demoUrl = `/demo?niche=roofing&source=roofing-playbook&lead=${encodeURIComponent(leadId)}${campaignLeadId ? `&campaignLead=${encodeURIComponent(campaignLeadId)}` : ""}`;
    return json({
      ok: true,
      leadId,
      campaignLeadId,
      ebookStatus,
      auditStatus,
      demoUrl,
      pdfUrl: Netlify.env.get("ROOFING_PLAYBOOK_PDF_URL") || null,
      warning: enrollmentWarning,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We could not process your request.";
    return json({ ok: false, error: message }, 422);
  }
};

export const config = { path: "/api/capture-roofing-playbook-lead" };
