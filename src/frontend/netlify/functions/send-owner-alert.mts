const MAX_MESSAGE_LENGTH = 1200;
const COOLDOWN_MS = 10 * 60 * 1000;
const recentSends = new Map<string, number>();

interface OwnerAlertRequest {
  phone?: string;
  message?: string;
  consent?: boolean;
  businessName?: string;
  source?: string;
}

interface DeliveryResult {
  provider: "twilio" | "telnyx" | "preview";
  status: "sent" | "preview";
  messageId?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function normalizePhone(input: string): string {
  const trimmed = input.trim();
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) return trimmed;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  throw new Error("Enter a valid mobile number, including country code when outside the US or Canada.");
}

function sanitizeMessage(input: string): string {
  const clean = input.replace(/\u0000/g, "").trim();
  if (!clean) throw new Error("A message is required.");
  if (clean.length > MAX_MESSAGE_LENGTH) {
    throw new Error("The owner alert is too long.");
  }
  return clean;
}

function enforceCooldown(phone: string): void {
  const now = Date.now();
  const previous = recentSends.get(phone);
  if (previous && now - previous < COOLDOWN_MS) {
    const seconds = Math.ceil((COOLDOWN_MS - (now - previous)) / 1000);
    throw new Error(`A demo text was already requested for this number. Try again in ${seconds} seconds.`);
  }
  recentSends.set(phone, now);

  if (recentSends.size > 500) {
    for (const [key, timestamp] of recentSends) {
      if (now - timestamp > COOLDOWN_MS) recentSends.delete(key);
    }
  }
}

function configuredProvider(): "twilio" | "telnyx" | "preview" {
  const preferred = (Netlify.env.get("DEMO_SMS_PROVIDER") || "").toLowerCase();
  if (preferred === "twilio" || preferred === "telnyx") return preferred;

  if (
    Netlify.env.get("TWILIO_ACCOUNT_SID") &&
    Netlify.env.get("TWILIO_AUTH_TOKEN") &&
    Netlify.env.get("TWILIO_FROM_NUMBER")
  ) {
    return "twilio";
  }

  if (Netlify.env.get("TELNYX_API_KEY") && Netlify.env.get("TELNYX_FROM_NUMBER")) {
    return "telnyx";
  }

  return "preview";
}

async function sendWithTwilio(phone: string, message: string): Promise<DeliveryResult> {
  const accountSid = Netlify.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Netlify.env.get("TWILIO_AUTH_TOKEN");
  const from = Netlify.env.get("TWILIO_FROM_NUMBER");
  if (!accountSid || !authToken || !from) {
    throw new Error("Twilio is selected but its server credentials are incomplete.");
  }

  const body = new URLSearchParams({ To: phone, From: from, Body: message });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
    {
      method: "POST",
      headers: {
        authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(15_000),
    },
  );

  const payload = (await response.json()) as { sid?: string; message?: string };
  if (!response.ok || !payload.sid) {
    throw new Error(payload.message || `Twilio rejected the message with status ${response.status}.`);
  }

  return { provider: "twilio", status: "sent", messageId: payload.sid };
}

async function sendWithTelnyx(phone: string, message: string): Promise<DeliveryResult> {
  const apiKey = Netlify.env.get("TELNYX_API_KEY");
  const from = Netlify.env.get("TELNYX_FROM_NUMBER");
  if (!apiKey || !from) {
    throw new Error("Telnyx is selected but its server credentials are incomplete.");
  }

  const response = await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from, to: phone, text: message }),
    signal: AbortSignal.timeout(15_000),
  });

  const payload = (await response.json()) as {
    data?: { id?: string };
    errors?: Array<{ detail?: string }>;
  };
  const messageId = payload.data?.id;
  if (!response.ok || !messageId) {
    throw new Error(
      payload.errors?.[0]?.detail || `Telnyx rejected the message with status ${response.status}.`,
    );
  }

  return { provider: "telnyx", status: "sent", messageId };
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed. Use POST." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) return json({ ok: false, error: "Request is too large." }, 413);

  try {
    const input = (await request.json()) as OwnerAlertRequest;
    if (input.consent !== true) {
      return json({ ok: false, error: "SMS consent is required." }, 400);
    }
    if (input.source !== "brf-demo") {
      return json({ ok: false, error: "Invalid message source." }, 400);
    }

    const phone = normalizePhone(String(input.phone || ""));
    const message = sanitizeMessage(String(input.message || ""));
    enforceCooldown(phone);

    const provider = configuredProvider();
    const delivery =
      provider === "twilio"
        ? await sendWithTwilio(phone, message)
        : provider === "telnyx"
          ? await sendWithTelnyx(phone, message)
          : ({ provider: "preview", status: "preview" } satisfies DeliveryResult);

    console.log("BRF owner alert", {
      provider: delivery.provider,
      status: delivery.status,
      messageId: delivery.messageId || null,
      businessName: String(input.businessName || "").slice(0, 120),
      phoneLast4: phone.slice(-4),
    });

    return json({
      ok: true,
      ...delivery,
      deliveredAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The owner alert could not be sent.";
    const status = message.includes("already requested") ? 429 : 422;
    return json({ ok: false, error: message }, status);
  }
};

export const config = {
  path: "/api/send-owner-alert",
};
