import {
  callSupabaseRpc,
  cleanText,
  json,
  normalizeEmail,
  normalizePhone,
  normalizeWebsite,
  requireText,
} from "./_shared/public-conversion.mts";

interface CaptureLeadRequest {
  contactName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  website?: string;
  serviceArea?: string;
  niche?: string;
  source?: string;
  status?: string;
  notes?: Record<string, unknown>;
}

interface CaptureLeadResult {
  ok: boolean;
  outcome: "created" | "duplicate" | "identity_conflict";
  leadId?: string;
  matchedOn?: string[];
  error?: string;
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Content type must be application/json." }, 415);
  }
  if (Number(request.headers.get("content-length") || 0) > 30_000) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as CaptureLeadRequest;
    const contactName = requireText(input.contactName, "Contact name", 160);
    const businessName = requireText(input.businessName, "Business name", 160);
    const email = normalizeEmail(input.email);
    const phone = normalizePhone(input.phone);
    const website = normalizeWebsite(input.website);
    if (!email && !phone && !website) {
      throw new Error("Provide an email, phone number, or website.");
    }

    const result = await callSupabaseRpc<CaptureLeadResult>("capture_public_lead", {
      p_contact_name: contactName,
      p_business_name: businessName,
      p_email: email,
      p_phone: phone,
      p_website: website,
      p_service_area: cleanText(input.serviceArea, 200),
      p_niche: cleanText(input.niche, 80) || "general",
      p_source: cleanText(input.source, 80) || "public_form",
      p_status: cleanText(input.status, 80) || "new_lead",
      p_notes:
        input.notes && typeof input.notes === "object" ? input.notes : {},
    });

    if (!result.ok) {
      return json(result, result.outcome === "identity_conflict" ? 409 : 422);
    }
    return json(result, result.outcome === "created" ? 201 : 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The lead could not be saved.";
    const status = message.includes("configured") ? 502 : 422;
    return json({ ok: false, error: message }, status);
  }
};

export const config = { path: "/api/public-leads" };
