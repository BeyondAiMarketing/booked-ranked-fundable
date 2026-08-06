import {
  BUSINESS_TIMEZONE,
  callSupabaseRpc,
  formatAvailabilitySlot,
  json,
} from "./_shared/public-conversion.mts";

interface RpcSlot {
  starts_at: string;
  timezone: string;
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "GET") {
    return json({ ok: false, error: "Method not allowed. Use GET." }, 405);
  }

  try {
    const url = new URL(request.url);
    const requestedDays = Number(url.searchParams.get("days") || 14);
    const days = Number.isFinite(requestedDays)
      ? Math.min(30, Math.max(1, Math.trunc(requestedDays)))
      : 14;

    const rows = await callSupabaseRpc<RpcSlot[]>(
      "get_strategy_call_availability",
      {
        p_start_date: formatAvailabilitySlot(
          new Date().toISOString(),
          BUSINESS_TIMEZONE,
        ).dateKey,
        p_business_days: days,
        p_timezone: BUSINESS_TIMEZONE,
      },
    );

    const slots = rows.map((row) =>
      formatAvailabilitySlot(row.starts_at, row.timezone || BUSINESS_TIMEZONE),
    );
    return json({ ok: true, timezone: BUSINESS_TIMEZONE, slots });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Availability could not be loaded.";
    return json({ ok: false, error: message }, message.includes("configured") ? 502 : 500);
  }
};

export const config = { path: "/api/strategy-call-availability" };
