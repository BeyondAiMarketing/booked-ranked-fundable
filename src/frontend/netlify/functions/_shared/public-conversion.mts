export {
  BUSINESS_TIMEZONE,
  cleanText,
  formatAvailabilitySlot,
  normalizeEmail,
  normalizePhone,
  normalizeWebsite,
  requireText,
  type AvailabilitySlot,
} from "../../../src/lib/publicConversionNormalization.ts";

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
