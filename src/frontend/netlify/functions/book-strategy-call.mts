import {
  BUSINESS_TIMEZONE,
  callSupabaseRpc,
  cleanText,
  json,
  normalizeEmail,
  normalizePhone,
  requireText,
} from "./_shared/public-conversion.mts";

interface BookStrategyCallRequest {
  contactName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  niche?: string;
  startsAt?: string;
  source?: string;
  notes?: Record<string, unknown>;
}

interface BookingResult {
  ok: boolean;
  outcome: "confirmed" | "slot_conflict" | "invalid" | "invalid_slot";
  bookingId?: string;
  leadId?: string | null;
  startsAt?: string;
  timezone?: string;
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
    const input = (await request.json()) as BookStrategyCallRequest;
    const contactName = requireText(input.contactName, "Contact name", 160);
    const businessName = requireText(input.businessName, "Business name", 160);
    const email = normalizeEmail(input.email);
    const niche = requireText(input.niche, "Business type", 80);
    const startsAt = requireText(input.startsAt, "Start time", 80);
    if (!email) throw new Error("Email is required.");
    if (Number.isNaN(new Date(startsAt).getTime())) throw new Error("Choose a valid time slot.");

    const result = await callSupabaseRpc<BookingResult>("book_strategy_call", {
      p_contact_name: contactName,
      p_business_name: businessName,
      p_email: email,
      p_phone: normalizePhone(input.phone),
      p_niche: niche,
      p_starts_at: new Date(startsAt).toISOString(),
      p_timezone: BUSINESS_TIMEZONE,
      p_source: cleanText(input.source, 80) || "book_demo_modal",
      p_notes:
        input.notes && typeof input.notes === "object" ? input.notes : {},
    });

    if (!result.ok) {
      const status = result.outcome === "slot_conflict" ? 409 : 422;
      return json(result, status);
    }
    return json(result, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The booking could not be saved.";
    const status = message.includes("configured") ? 502 : 422;
    return json({ ok: false, error: message }, status);
  }
};

export const config = { path: "/api/strategy-call-bookings" };
