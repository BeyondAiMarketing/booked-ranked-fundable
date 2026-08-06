interface RoofingAuditJob {
  leadId?: string;
  campaignLeadId?: string | null;
  firstName?: string;
  businessName?: string;
  email?: string;
  website?: string;
  city?: string | null;
}

interface AuditIssue {
  severity?: string;
  title?: string;
  evidence?: string;
  recommendation?: string;
}

interface AuditStrength {
  title?: string;
  evidence?: string;
}

interface AuditReport {
  executiveSummary?: string;
  strengths?: AuditStrength[];
  issues?: AuditIssue[];
  quickWins?: string[];
  disclaimer?: string;
}

interface AuditResponse {
  ok?: boolean;
  error?: string;
  evidence?: Record<string, unknown>;
  audit?: AuditReport;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fallbackAudit(website: string, reason: string): AuditReport {
  return {
    executiveSummary: `We could not complete the automated homepage review for ${website}. The first priority is confirming that the public website is reachable to homeowners and search engines, then reviewing the core conversion elements below.`,
    strengths: [],
    issues: [
      {
        severity: "high",
        title: "Public homepage could not be verified",
        evidence: reason,
        recommendation:
          "Confirm the website address, SSL certificate, DNS, and public homepage availability. Then rerun the audit from a normal browser connection.",
      },
    ],
    quickWins: [
      "Place one clear roofing inspection call to action above the fold.",
      "Make the primary phone number clickable on mobile devices.",
      "Show service area, roofing specialties, licensing or insurance details, and authentic proof near the main call to action.",
      "Use a short estimate or inspection form that asks only for the information needed to respond quickly.",
    ],
    disclaimer:
      "This fallback review is based on the website being unavailable to the automated audit and is not a full SEO, accessibility, security, or performance certification.",
  };
}

function renderList(items: string[], emptyText: string): string {
  if (items.length === 0) {
    return `<p style="margin:0;color:#64748b">${escapeHtml(emptyText)}</p>`;
  }
  return `<ul style="margin:10px 0 0;padding-left:20px;color:#334155">${items
    .map((item) => `<li style="margin:0 0 9px">${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function renderAuditEmail(input: {
  firstName: string;
  businessName: string;
  website: string;
  report: AuditReport;
  pdfUrl: string | null;
  demoUrl: string;
}): string {
  const strengths = (input.report.strengths || [])
    .slice(0, 6)
    .map(
      (item) =>
        `<li style="margin:0 0 12px"><strong>${escapeHtml(item.title || "Observed strength")}</strong><br><span style="color:#64748b">${escapeHtml(item.evidence || "")}</span></li>`,
    );
  const issues = (input.report.issues || [])
    .slice(0, 8)
    .map(
      (item) =>
        `<li style="margin:0 0 16px"><strong>${escapeHtml((item.severity || "priority").toUpperCase())}: ${escapeHtml(item.title || "Opportunity")}</strong><br><span style="color:#64748b">Observed: ${escapeHtml(item.evidence || "Not specified")}</span><br><span>Recommended next step: ${escapeHtml(item.recommendation || "Review and improve this area.")}</span></li>`,
    );
  const quickWins = (input.report.quickWins || []).slice(0, 8);

  return `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#0f172a;line-height:1.65">
    <div style="background:linear-gradient(135deg,#071426,#12365d);padding:30px;border-radius:18px 18px 0 0;color:white">
      <div style="font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#fcd34d">Booked Ranked Fundable</div>
      <h1 style="font-size:30px;line-height:1.15;margin:12px 0 8px">Your Free Roofing Website Audit</h1>
      <p style="margin:0;color:#cbd5e1">Prepared for ${escapeHtml(input.businessName)} · ${escapeHtml(input.website)}</p>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:0;padding:30px;border-radius:0 0 18px 18px">
      <p>Hi ${escapeHtml(input.firstName)},</p>
      <p>${escapeHtml(input.report.executiveSummary || "Here is your rapid roofing homepage audit.")}</p>

      <h2 style="font-size:20px;margin:28px 0 8px">What is working</h2>
      ${strengths.length ? `<ul style="padding-left:20px">${strengths.join("")}</ul>` : `<p style="color:#64748b">The rapid scan did not identify a verified strength to highlight yet.</p>`}

      <h2 style="font-size:20px;margin:28px 0 8px">Priority opportunities</h2>
      ${issues.length ? `<ol style="padding-left:22px">${issues.join("")}</ol>` : `<p style="color:#64748b">No high-confidence issues were detected in the rapid scan.</p>`}

      <h2 style="font-size:20px;margin:28px 0 8px">Quick wins</h2>
      ${renderList(quickWins, "No additional quick wins were generated.")}

      <div style="margin-top:30px;padding:20px;border-radius:14px;background:#f8fafc;border:1px solid #e2e8f0">
        <strong>Next step</strong>
        <p style="margin:8px 0 16px;color:#475569">See how BRF connects lead response, estimate follow-up, review requests, and pipeline visibility for a roofing company.</p>
        <a href="${escapeHtml(input.demoUrl)}" style="display:inline-block;background:#172554;color:white;text-decoration:none;padding:13px 19px;border-radius:10px;font-weight:700">Launch the Roofing Demo</a>
        ${input.pdfUrl ? `<a href="${escapeHtml(input.pdfUrl)}" style="display:inline-block;margin-left:8px;background:#f59e0b;color:#111827;text-decoration:none;padding:13px 19px;border-radius:10px;font-weight:700">Download the Playbook</a>` : ""}
      </div>

      <p style="font-size:12px;color:#64748b;margin-top:26px">${escapeHtml(input.report.disclaimer || "This is a rapid homepage audit based on observable evidence, not a full SEO, accessibility, security, or performance certification. Results and recommendations do not guarantee rankings, leads, financing, or revenue.")}</p>
    </div>
  </div>`;
}

async function recordCampaignEvent(input: {
  campaignLeadId: string;
  eventType: "audit_emailed" | "audit_email_failed";
  detail: string;
}): Promise<void> {
  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return;

  await fetch(
    `${url}/rest/v1/roofing_campaign_events?on_conflict=idempotency_key`,
    {
      method: "POST",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
        prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        lead_id: input.campaignLeadId,
        event_type: input.eventType,
        event_label:
          input.eventType === "audit_emailed"
            ? "Website audit emailed"
            : "Website audit email failed",
        event_detail: input.detail,
        event_data: {},
        idempotency_key: `${input.campaignLeadId}:${input.eventType}`,
      }),
      signal: AbortSignal.timeout(15_000),
    },
  );
}

export default async (request: Request): Promise<void> => {
  let campaignLeadId = "";
  try {
    const input = (await request.json()) as RoofingAuditJob;
    const leadId = clean(input.leadId, 120);
    campaignLeadId = clean(input.campaignLeadId, 120);
    const firstName = clean(input.firstName, 100);
    const businessName = clean(input.businessName, 160);
    const email = clean(input.email, 254).toLowerCase();
    const website = clean(input.website, 500);
    const city = clean(input.city, 160);
    if (!leadId || !firstName || !businessName || !email || !website) {
      throw new Error(
        "The roofing audit job is missing required lead details.",
      );
    }

    const origin = new URL(request.url).origin;
    let report: AuditReport;
    try {
      const auditResponse = await fetch(`${origin}/api/nemotron-audit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ website, businessName, niche: "roofing", city }),
        signal: AbortSignal.timeout(45_000),
      });
      const payload = (await auditResponse.json()) as AuditResponse;
      report =
        auditResponse.ok && payload.ok && payload.audit
          ? payload.audit
          : fallbackAudit(
              website,
              payload.error ||
                `Audit request returned ${auditResponse.status}.`,
            );
    } catch (error) {
      report = fallbackAudit(
        website,
        error instanceof Error
          ? error.message
          : "The automated website review could not be completed.",
      );
    }

    const apiKey = Netlify.env.get("RESEND_API_KEY");
    const from = Netlify.env.get("ROOFING_PLAYBOOK_FROM_EMAIL");
    if (!apiKey || !from)
      throw new Error("Roofing audit email delivery is not configured.");

    const pdfUrl = Netlify.env.get("ROOFING_PLAYBOOK_PDF_URL") || null;
    const demoUrl = `https://bookedrankedfunded.org/demo?niche=roofing&source=roofing-audit&lead=${encodeURIComponent(leadId)}`;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `${firstName}, your free roofing website audit is ready`,
        html: renderAuditEmail({
          firstName,
          businessName,
          website,
          report,
          pdfUrl,
          demoUrl,
        }),
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok)
      throw new Error(
        `Resend rejected the audit email with status ${response.status}.`,
      );

    if (campaignLeadId) {
      await recordCampaignEvent({
        campaignLeadId,
        eventType: "audit_emailed",
        detail:
          "The personalized roofing website audit was delivered by email.",
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("roofing audit background delivery failed", {
      campaignLeadId,
      error: message,
    });
    if (campaignLeadId) {
      try {
        await recordCampaignEvent({
          campaignLeadId,
          eventType: "audit_email_failed",
          detail: message.slice(0, 800),
        });
      } catch {
        // The original delivery error is already logged.
      }
    }
  }
};
