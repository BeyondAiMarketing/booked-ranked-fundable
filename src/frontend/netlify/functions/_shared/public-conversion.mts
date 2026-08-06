export const BUSINESS_TIMEZONE = "America/Los_Angeles";

export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\u0000/g, "");
  return cleaned ? cleaned.slice(0, max) : null;
}

export function requireText(value: unknown, label: string, max: number): string {
  const cleaned = cleanText(value, max);
  if (!cleaned) throw new Error(`${label} is required.`);
  return cleaned;
}

export function normalizeEmail(value: unknown): string | null {
  const email = cleanText(value, 254)?.toLowerCase() ?? null;
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  return email;
}

export function normalizePhone(value: unknown): string | null {
  const raw = cleanText(value, 40);
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return digits.length === 10 ? `1${digits}` : digits;
}

export function normalizeWebsite(value: unknown): string | null {
  const raw = cleanText(value, 500)?.toLowerCase();
  if (!raw) return null;
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(raw)
    ? raw
    : `https://${raw}`;
  try {
    return new URL(withProtocol).hostname.replace(/^www\./, "") || null;
  } catch {
    throw new Error("Enter a valid website URL.");
  }
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function getSupabaseConfig(): { url: string; serviceKey: string } {
  const url = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    throw new Error("Conversion storage is not configured.");
  }
  return { url, serviceKey };
}

export async function callSupabaseRpc<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { url, serviceKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
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
        : `Supabase RPC failed with status ${response.status}.`;
    throw new Error(message);
  }
  return payload as T;
}

export interface AvailabilitySlot {
  startsAt: string;
  dateKey: string;
  dateLabel: string;
  dayShort: string;
  dayOfMonth: string;
  timeLabel: string;
  timezone: string;
}

export function formatAvailabilitySlot(
  startsAt: string,
  timezone = BUSINESS_TIMEZONE,
): AvailabilitySlot {
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid availability slot.");

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    dateParts.find((item) => item.type === type)?.value ?? "";
  const dateKey = `${part("year")}-${part("month")}-${part("day")}`;

  return {
    startsAt: date.toISOString(),
    dateKey,
    dateLabel: new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      month: "long",
      day: "numeric",
    }).format(date),
    dayShort: new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
    }).format(date),
    dayOfMonth: new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      day: "numeric",
    }).format(date),
    timeLabel: new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
    timezone,
  };
}
