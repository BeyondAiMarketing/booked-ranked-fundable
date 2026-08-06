from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def regex_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one regex match, found {count}")
    return updated


def patch_netlify() -> None:
    path = ROOT / "netlify.toml"
    text = path.read_text()
    old = '''[[redirects]]
  from = "/roofing-ai-growth-playbook"
  to = "/roofing-ai-growth-playbook/index.html"
  status = 200
  force = true

[[redirects]]
  from = "/roofing-ai-growth-playbook/"
  to = "/roofing-ai-growth-playbook/index.html"
  status = 200
  force = true

'''
    new = '''[[redirects]]
  from = "/roofing"
  to = "/index.html"
  status = 200
  force = true

[[redirects]]
  from = "/roofing/*"
  to = "/index.html"
  status = 200
  force = true

[[redirects]]
  from = "/roofing-ai-growth-playbook"
  to = "/index.html"
  status = 200
  force = true

[[redirects]]
  from = "/roofing-ai-growth-playbook/*"
  to = "/index.html"
  status = 200
  force = true

'''
    path.write_text(replace_once(text, old, new, "Netlify public roofing routes"))


def patch_homepage() -> None:
    path = ROOT / "src/frontend/src/pages/HomePage.tsx"
    text = path.read_text()
    text = replace_once(
        text,
        'import PublicNav from "@/components/PublicNav";\n',
        'import PublicNav from "@/components/PublicNav";\nimport RoofingPlaybookAuditOffer from "@/components/RoofingPlaybookAuditOffer";\n',
        "homepage offer import",
    )
    text = replace_once(
        text,
        '''      {/* ── Social proof ticker ── */}
      <HomepageSocialProofTicker activeNiche={activeNiche} />

      {/* ── Stage 1 — Live Dashboard Preview ── */}''',
        '''      {/* ── Social proof ticker ── */}
      <HomepageSocialProofTicker activeNiche={activeNiche} />

      {/* ── Free Roofer Playbook + Audit ── */}
      <RoofingPlaybookAuditOffer source="homepage" />

      {/* ── Stage 1 — Live Dashboard Preview ── */}''',
        "homepage offer placement",
    )
    path.write_text(text)


def patch_roofing_page() -> None:
    path = ROOT / "src/frontend/src/pages/RoofingPage.tsx"
    text = path.read_text()
    text = replace_once(
        text,
        'import { useActor } from "@/hooks/useActor";\n',
        'import RoofingPlaybookAuditOffer from "@/components/RoofingPlaybookAuditOffer";\nimport { useActor } from "@/hooks/useActor";\n',
        "roofing offer import",
    )
    text = replace_once(
        text,
        '''      </section>

      {/* VSL VIDEO */}''',
        '''      </section>

      <RoofingPlaybookAuditOffer source="roofing-landing" />

      {/* VSL VIDEO */}''',
        "roofing offer placement",
    )
    path.write_text(text)


def patch_playbook_page() -> None:
    path = ROOT / "src/frontend/src/pages/RoofingPlaybookTripwirePage.tsx"
    text = path.read_text()
    text = replace_once(
        text,
        '  ebookStatus?: "delivered" | "pending" | "failed";\n',
        '  ebookStatus?: "delivered" | "pending" | "failed";\n  auditStatus?: "queued" | "failed";\n',
        "audit response status",
    )
    text = replace_once(
        text,
        '''    eyebrow: "Free roofer AI growth playbook",
    title:
      "The practical roofing growth system for getting booked, ranked, and ready to scale.",
    lead: "See how to capture more opportunities, improve follow-up, strengthen local trust, and build one connected operating system around your roofing company.",''',
        '''    eyebrow: "Free playbook + personalized roofing audit",
    title:
      "Get the Free Roofer AI Growth Playbook and a Personalized Website Audit.",
    lead: "Learn the practical roofing growth system, then receive a rapid audit showing how your own homepage handles messaging, trust, lead capture, and conversion opportunities.",''',
        "default playbook positioning",
    )
    text = replace_once(
        text,
        '''      !form.businessName.trim() ||
      !form.email.includes("@")''',
        '''      !form.businessName.trim() ||
      !form.email.includes("@") ||
      !form.website.trim()''',
        "require website for audit",
    )
    text = replace_once(
        text,
        '        "Enter your first name, roofing company, and a valid email address.",',
        '        "Enter your first name, roofing company, a valid email address, and your website so we can prepare the audit.",',
        "playbook validation message",
    )
    text = replace_once(
        text,
        '        "Please confirm that we may send the playbook and related follow-up.",',
        '        "Please confirm that we may send the playbook, website audit, and related follow-up.",',
        "playbook consent validation",
    )
    text = replace_once(
        text,
        '''                  "Written specifically for roofers",
                  "Practical systems, not AI hype",
                  "Includes a personalized next step",''',
        '''                  "Written specifically for roofers",
                  "Includes a personalized website audit",
                  "Both reports delivered by email",''',
        "hero proof points",
    )
    text = replace_once(
        text,
        '                Get the Free Playbook <ArrowRight size={19} />',
        '                Get the Free Playbook + Audit <ArrowRight size={19} />',
        "hero CTA",
    )
    text = replace_once(
        text,
        '''                Get the playbook and a clear next step for your roofing company.''',
        '''                Get the playbook and a personalized audit of your roofing website.''',
        "included heading",
    )
    text = replace_once(
        text,
        '''                After requesting the guide, you can launch a roofing-specific
                BRF demo that shows how the operating system handles lead
                response, follow-up, reviews, and local growth.''',
        '''                The playbook is delivered first. Then we review your public homepage
                and email a rapid audit covering messaging, mobile basics, trust signals,
                lead capture, and practical conversion opportunities.''',
        "included description",
    )
    text = replace_once(
        text,
        '''                  "Immediate playbook delivery when email delivery is configured",
                  "Campaign-aware recommendations based on the page you visited",
                  "Optional personalized roofing demo after download",
                  "No credit card and no guarantee-based sales claims",''',
        '''                  "Free Roofer AI Growth Playbook delivered by email",
                  "Personalized rapid audit of the website you submit",
                  "Prioritized strengths, issues, and quick wins",
                  "Optional roofing demo after delivery",''',
        "included benefits",
    )
    text = replace_once(
        text,
        '''                    Your playbook is ready.''',
        '''                    Your playbook is ready. Your audit is underway.''',
        "success heading",
    )
    text = replace_once(
        text,
        '''                    {result.ebookStatus === "delivered"
                      ? "We sent the playbook to your inbox. You can also continue into the roofing demo now."
                      : "Your request was saved. Check your inbox for delivery, then continue into the roofing demo."}''',
        '''                    {result.ebookStatus === "delivered"
                      ? "We sent the playbook to your inbox and started your personalized roofing website audit. The audit will arrive in a separate email."
                      : "Your request was saved and your website audit was queued. Watch your inbox for the playbook and a separate audit email."}''',
        "success message",
    )
    text = replace_once(
        text,
        '''                        Send me the Roofer AI Playbook''',
        '''                        Send me the Playbook + Website Audit''',
        "form heading",
    )
    text = replace_once(
        text,
        '''                      Website{" "}
                      <span className="normal-case tracking-normal text-white/30">
                        (optional)
                      </span>''',
        '''                      Roofing website''',
        "website label",
    )
    text = replace_once(
        text,
        '''                    I agree to receive the playbook and related roofing growth
                    follow-up. I can unsubscribe at any time.''',
        '''                    I agree to receive the playbook, personalized website audit,
                    and related roofing growth follow-up. I can unsubscribe at any time.''',
        "consent copy",
    )
    text = replace_once(
        text,
        '''                    {isSubmitting
                      ? "Sending your playbook…"
                      : "Get My Free Playbook"}''',
        '''                    {isSubmitting
                      ? "Starting your playbook and audit…"
                      : "Get My Free Playbook + Audit"}''',
        "form CTA",
    )
    text = replace_once(
        text,
        '''                    Educational material only. Results depend on market,
                    execution, offer, and operating conditions.''',
        '''                    The audit is a rapid homepage review based on observable evidence.
                    It is not a full SEO, accessibility, security, or performance certification.''',
        "form disclaimer",
    )
    path.write_text(text)


def patch_capture_function() -> None:
    path = ROOT / "src/frontend/netlify/functions/capture-roofing-playbook-lead.mts"
    text = path.read_text()
    text = replace_once(
        text,
        '        subject: `${input.firstName}, your Free Roofing AI Growth Playbook is ready`,',
        '        subject: `${input.firstName}, your Free Roofing AI Playbook is ready — your audit is next`,',
        "playbook email subject",
    )
    text = replace_once(
        text,
        '''        html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#152033;line-height:1.6"><h1 style="font-size:28px">Your Roofing AI Growth Playbook is ready</h1><p>Hi ${input.firstName},</p><p>Thanks for requesting the playbook for <strong>${input.businessName}</strong>.</p><p><a href="${pdfUrl}" style="display:inline-block;background:#f59e0b;color:#111827;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Download the Free Playbook</a></p><p>Then see the ideas working in a 90-second roofing growth demo:</p><p><a href="${demoUrl}" style="display:inline-block;background:#172554;color:white;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Watch the 90-Second Demo</a></p><p style="font-size:12px;color:#64748b">Recommendations and examples are educational and do not guarantee rankings, financing, leads, or revenue.</p></div>`,''',
        '''        html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#152033;line-height:1.6"><h1 style="font-size:28px">Your Free Roofer AI Playbook is ready</h1><p>Hi ${input.firstName},</p><p>Thanks for requesting the playbook and personalized website audit for <strong>${input.businessName}</strong>.</p><p><a href="${pdfUrl}" style="display:inline-block;background:#f59e0b;color:#111827;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Download the Free Playbook</a></p><p><strong>Your free roofing website audit is now being prepared.</strong> It will arrive in a separate email after the homepage review is complete.</p><p>While the audit is being prepared, see the ideas working in the roofing growth demo:</p><p><a href="${demoUrl}" style="display:inline-block;background:#172554;color:white;text-decoration:none;padding:14px 22px;border-radius:10px;font-weight:700">Launch the Roofing Demo</a></p><p style="font-size:12px;color:#64748b">The audit is a rapid homepage review based on observable evidence. Recommendations do not guarantee rankings, financing, leads, or revenue.</p></div>`,''',
        "playbook email body",
    )
    text = replace_once(
        text,
        '    const website = clean(input.website, 500);',
        '    const website = required(input.website, "Website", 500);',
        "required website",
    )
    insertion = '''
    let auditStatus: "queued" | "failed" = "failed";
    try {
      const origin = new URL(request.url).origin;
      const auditDispatch = await fetch(`${origin}/.netlify/functions/send-roofing-audit-background`, {
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
      });
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

'''
    text = replace_once(
        text,
        '    const demoUrl = `/demo?niche=roofing&source=roofing-playbook&lead=${encodeURIComponent(leadId)}${campaignLeadId ? `&campaignLead=${encodeURIComponent(campaignLeadId)}` : ""}`;\n',
        insertion + '    const demoUrl = `/demo?niche=roofing&source=roofing-playbook&lead=${encodeURIComponent(leadId)}${campaignLeadId ? `&campaignLead=${encodeURIComponent(campaignLeadId)}` : ""}`;\n',
        "audit background dispatch",
    )
    text = replace_once(
        text,
        '''      ebookStatus,
      demoUrl,''',
        '''      ebookStatus,
      auditStatus,
      demoUrl,''',
        "audit response payload",
    )
    path.write_text(text)


def patch_nemotron_audit() -> None:
    path = ROOT / "src/frontend/netlify/functions/nemotron-audit.mts"
    text = path.read_text()
    fallback = '''
function buildFallbackAudit(
  evidence: PageEvidence,
  business: Omit<AuditRequest, "website">,
  reason: string,
): unknown {
  const strengths: Array<{ title: string; evidence: string }> = [];
  const issues: Array<{
    severity: "high" | "medium" | "low";
    title: string;
    evidence: string;
    recommendation: string;
  }> = [];
  const quickWins: string[] = [];

  if (evidence.title) {
    strengths.push({ title: "Homepage title detected", evidence: evidence.title });
  } else {
    issues.push({
      severity: "medium",
      title: "Homepage title was not detected",
      evidence: "The rapid scan did not find a standard HTML title element.",
      recommendation: "Add a concise title that includes the roofing company name and primary market.",
    });
  }

  if (evidence.hasViewport) {
    strengths.push({ title: "Mobile viewport is configured", evidence: "A viewport meta tag was detected." });
  } else {
    issues.push({
      severity: "high",
      title: "Mobile viewport was not detected",
      evidence: "The homepage did not expose a standard viewport meta tag.",
      recommendation: "Add a responsive viewport tag and verify the lead experience on common phone sizes.",
    });
  }

  if (evidence.hasPhoneLink) {
    strengths.push({ title: "Clickable phone link detected", evidence: "The homepage contains a telephone link for mobile visitors." });
  } else {
    issues.push({
      severity: "medium",
      title: "Clickable phone link was not detected",
      evidence: "The rapid scan did not find a tel: link.",
      recommendation: "Make the primary roofing phone number clickable in the header and near the main call to action.",
    });
  }

  if (evidence.hasForm) {
    strengths.push({ title: "Lead form detected", evidence: "The homepage contains an HTML form." });
  } else {
    issues.push({
      severity: "high",
      title: "Homepage lead form was not detected",
      evidence: "The rapid scan did not find an HTML form on the homepage.",
      recommendation: "Add a short inspection or estimate form with only the fields needed for a fast response.",
    });
  }

  if (evidence.hasSchemaMarkup) {
    strengths.push({ title: "Structured data signal detected", evidence: "Schema or item metadata was detected in the homepage markup." });
  } else {
    quickWins.push("Add valid LocalBusiness or RoofingContractor structured data that matches visible business information.");
  }

  if (!evidence.description) {
    quickWins.push("Write a clear meta description describing the roofing service, market, and primary action.");
  }
  if (evidence.h1.length === 0) {
    quickWins.push("Use one clear homepage heading that states the roofing outcome and service area.");
  }
  quickWins.push("Place licensing, insurance, service area, authentic reviews, and completed-project proof near the main call to action.");
  quickWins.push("Make the first conversion step simple: call, request an inspection, or request an estimate.");

  return {
    mode: "fallback",
    confidence: "medium",
    executiveSummary: `This rapid audit for ${business.businessName || "the roofing company"} is based on observable homepage evidence. The advanced narrative analysis was unavailable, so the report uses deterministic conversion and technical checks instead.`,
    strengths,
    issues,
    quickWins,
    disclaimer: `This is a rapid homepage audit based on observable page evidence, not a full SEO, accessibility, security, or performance certification. Advanced analysis fallback reason: ${reason.slice(0, 240)}`,
  };
}
'''
    text = replace_once(
        text,
        '  return extractJsonObject(content);\n}\n\nexport default async',
        '  return extractJsonObject(content);\n}\n' + fallback + '\nexport default async',
        "fallback audit helper",
    )
    old = '''    const audit = await generateAudit(evidence, {
      businessName: input.businessName?.slice(0, 120),
      niche: input.niche?.slice(0, 80),
      city: input.city?.slice(0, 120),
    });

    return json({
      ok: true,
      mode: "live",
      auditedAt: new Date().toISOString(),
      evidence,
      audit,
    });'''
    new = '''    const business = {
      businessName: input.businessName?.slice(0, 120),
      niche: input.niche?.slice(0, 80),
      city: input.city?.slice(0, 120),
    };

    let audit: unknown;
    let mode = "live";
    try {
      audit = await generateAudit(evidence, business);
    } catch (providerError) {
      mode = "fallback";
      const reason = providerError instanceof Error ? providerError.message : "Advanced audit analysis was unavailable.";
      console.error("Nemotron audit used deterministic fallback", { website: url.toString(), reason });
      audit = buildFallbackAudit(evidence, business, reason);
    }

    return json({
      ok: true,
      mode,
      auditedAt: new Date().toISOString(),
      evidence,
      audit,
    });'''
    text = replace_once(text, old, new, "provider fallback flow")
    path.write_text(text)


def cleanup() -> None:
    for relative in [
        "src/frontend/public/roofing-ai-growth-playbook/index.html",
        ".github/scripts/apply_roofing_playbook_audit_fix.py",
        ".github/workflows/apply-roofing-playbook-audit-fix.yml",
    ]:
        target = ROOT / relative
        if target.exists():
            target.unlink()


if __name__ == "__main__":
    patch_netlify()
    patch_homepage()
    patch_roofing_page()
    patch_playbook_page()
    patch_capture_function()
    patch_nemotron_audit()
    cleanup()
