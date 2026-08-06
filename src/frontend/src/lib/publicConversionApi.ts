export interface PublicLeadResult {
  ok: boolean;
  outcome: "created" | "duplicate" | "identity_conflict";
  leadId?: string;
  matchedOn?: string[];
  error?: string;
}

export interface StrategyCallSlot {
  startsAt: string;
  dateKey: string;
  dateLabel: string;
  dayShort: string;
  dayOfMonth: string;
  timeLabel: string;
  timezone: string;
}

export interface BookingResult {
  ok: boolean;
  outcome: "confirmed" | "slot_conflict" | "invalid" | "invalid_slot";
  bookingId?: string;
  leadId?: string | null;
  startsAt?: string;
  timezone?: string;
  error?: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T | null;
  if (!payload) throw new Error("The server returned an invalid response.");
  return payload;
}

export async function capturePublicLead(input: {
  contactName: string;
  businessName: string;
  email?: string;
  phone?: string;
  website?: string;
  serviceArea?: string;
  niche: string;
  source: string;
  status?: string;
  notes?: Record<string, unknown>;
}): Promise<PublicLeadResult> {
  const response = await fetch("/api/public-leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = await parseResponse<PublicLeadResult>(response);
  if (!response.ok && result.outcome !== "identity_conflict") {
    throw new Error(result.error || "The lead could not be saved.");
  }
  return result;
}

export async function loadStrategyCallAvailability(
  days = 14,
): Promise<StrategyCallSlot[]> {
  const response = await fetch(`/api/strategy-call-availability?days=${days}`);
  const result = await parseResponse<{
    ok: boolean;
    slots?: StrategyCallSlot[];
    error?: string;
  }>(response);
  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Availability could not be loaded.");
  }
  return result.slots || [];
}

export async function bookStrategyCall(input: {
  contactName: string;
  businessName: string;
  email: string;
  phone?: string;
  niche: string;
  startsAt: string;
  source: string;
  notes?: Record<string, unknown>;
}): Promise<BookingResult> {
  const response = await fetch("/api/strategy-call-bookings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = await parseResponse<BookingResult>(response);
  if (!response.ok && result.outcome !== "slot_conflict") {
    throw new Error(result.error || "The booking could not be saved.");
  }
  return result;
}

export function isBookingConflict(result: BookingResult): boolean {
  return !result.ok && result.outcome === "slot_conflict";
}
