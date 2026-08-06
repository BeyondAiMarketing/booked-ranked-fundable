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

  return {
    startsAt: date.toISOString(),
    dateKey: `${part("year")}-${part("month")}-${part("day")}`,
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
