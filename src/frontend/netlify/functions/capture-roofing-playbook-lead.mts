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

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
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

function config() {
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
}): Promise<"delivered" | "pending" | "failed"> {
  const apiKey = Netlify.env.get("RESEND_API_KEY");
  const from = Netlify.env.get("ROOFING_PLAYBOOK_FROM_EMAIL");
  const pdfUrl = Netlify.env.get("ROOFING_PLAYBOOK_PDF_URL");
  if (!apiKey || !from || !pdfUrl) return "pending";

  const demoUrl = `https://booked-ranked-fundable.netlify.app/demo?niche=roofing&source=roofing-playbook&lead=${encodeURIComponent(input.leadId)}`;
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
        subject: `${input.firstName}, your Free Roofing AI Growth Playbook is ready`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#152033;line-height:1.6">
            <h1 style="font-size:28px">Your Roofing AI Growth Playbook is ready</h1>
            <p>Hi ${input.firstName},</p>
            <p>Thanks for requesting the playbook for <strong>${input.businessName}</strong>.</p>
            <p><a href="${pdfUrl}" style="display:inline-block;background:#f59e0b;color:#111827;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Download the Free Playbook</a></p>
            <p>Then see the ideas working in a 90-second roofing growth demo:</p>
            <p><a href="${demoUrl}" style="display:inline-block;background:#172554;color:white;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Watch the 90-Second Demo</a></p>
            <p style="font-size:12px;color:#64748b">Recommendations and examples are educational and do not guarantee rankings, financing, leads, or revenue.</p>
          </div>
        `,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    return response.ok ? "delivered" : "failed";
  } catch {
    return "failed";
  }
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);
  if (Number(request.headers.get("content-length") || 0) > 30_000) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as LeadRequest;
    const firstName = required(input.firstName, "First name", 100);
    const businessName = required(input.businessName, "Business name", 160);
    const email = required(input.email, "Email", 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
    if (input.consentMarketing !== true) throw new Error("Consent is required to send the playbook and related follow-up.");

    const row = {
      first_name: firstName,
      last_name: clean(input.lastName, 100),
      business_name: businessName,
      email,
      phone: clean(input.phone, 40),
      website: clean(input.website, 500),
      city: clean(input.city, 160),
      source: "roofing-ai-growth-playbook",
      campaign: "roofing-ai-growth-playbook",
      consent_marketing: true,
      ebook_status: "pending",
      metadata: {
        utm: input.utm && typeof input.utm === "object" ? input.utm : {},
        userAgent: clean(request.headers.get("user-agent"), 500),
      },
    };

    const { url, serviceKey } = config();
    const response = await fetch(`${url}/rest/v1/roofing_playbook_leads`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
        prefer: "return=representation",
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(15_000),
    });
    const payload = (await response.json()) as Array<{ id?: string }> | { message?: string };
    if (!response.ok || !Array.isArray(payload) || !payload[0]?.id) {
      const message = !Array.isArray(payload) ? payload.message : undefined;
      throw new Error(message || "The lead could not be saved.");
    }

    const leadId = payload[0].id;
    const ebookStatus = await sendPlaybookEmail({ email, firstName, businessName, leadId });
    if (ebookStatus !== "pending") {
      await fetch(`${url}/rest/v1/roofing_playbook_leads?id=eq.${encodeURIComponent(leadId)}`, {
        method: "PATCH",
        headers: {
          apikey: serviceKey,
          authorization: `Bearer ${serviceKey}`,
          "content-type": "application/json",
          prefer: "return=minimal",
        },
        body: JSON.stringify({ ebook_status: ebookStatus }),
      });
    }

    const demoUrl = `/demo?niche=roofing&source=roofing-playbook&lead=${encodeURIComponent(leadId)}`;
    return json({
      ok: true,
      leadId,
      ebookStatus,
      demoUrl,
      pdfUrl: Netlify.env.get("ROOFING_PLAYBOOK_PDF_URL") || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We could not process your request.";
    return json({ ok: false, error: message }, 422);
  }
};

export const config = { path: "/api/capture-roofing-playbook-lead" };
