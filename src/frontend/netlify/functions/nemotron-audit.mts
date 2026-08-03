import { isIP } from "node:net";
import { lookup } from "node:dns/promises";

const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const DEFAULT_MODEL = "nvidia/nemotron-3.5-nano-30b-a3b";
const MAX_HTML_BYTES = 500_000;

interface AuditRequest {
  website?: string;
  businessName?: string;
  niche?: string;
  city?: string;
}

interface PageEvidence {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  contentType: string;
  title: string | null;
  description: string | null;
  h1: string[];
  canonical: string | null;
  hasViewport: boolean;
  hasPhoneLink: boolean;
  hasEmailLink: boolean;
  hasForm: boolean;
  hasSchemaMarkup: boolean;
  hasRobotsMeta: boolean;
  wordCount: number;
  htmlBytes: number;
}

interface NvidiaResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function normalizeUrl(input: string): URL {
  const trimmed = input.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only HTTP and HTTPS websites can be audited.");
  }
  if (url.username || url.password) {
    throw new Error("Website URLs cannot contain credentials.");
  }
  return url;
}

function isPrivateAddress(address: string): boolean {
  if (isIP(address) === 4) {
    const parts = address.split(".").map(Number);
    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      parts[0] === 0
    );
  }

  if (isIP(address) === 6) {
    const normalized = address.toLowerCase();
    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:")
    );
  }

  return true;
}

async function assertPublicHostname(url: URL): Promise<void> {
  const hostname = url.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Local or private network addresses cannot be audited.");
  }

  const records = await lookup(hostname, { all: true, verbatim: true });
  if (records.length === 0 || records.some((record) => isPrivateAddress(record.address))) {
    throw new Error("The website resolves to a private or unavailable address.");
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function firstMatch(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match?.[1] ? stripTags(match[1]) : null;
}

function collectMatches(html: string, pattern: RegExp, limit = 5): string[] {
  const output: string[] = [];
  for (const match of html.matchAll(pattern)) {
    const value = match[1] ? stripTags(match[1]) : "";
    if (value && !output.includes(value)) output.push(value);
    if (output.length >= limit) break;
  }
  return output;
}

async function fetchPageEvidence(url: URL): Promise<PageEvidence> {
  await assertPublicHostname(url);

  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
    headers: {
      "user-agent":
        "BookedRankedFundableAudit/1.0 (+https://booked-ranked-fundable.netlify.app)",
      accept: "text/html,application/xhtml+xml",
    },
  });

  const finalUrl = new URL(response.url);
  await assertPublicHostname(finalUrl);

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) {
    throw new Error("The submitted URL did not return an HTML webpage.");
  }

  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_HTML_BYTES) {
    throw new Error("The webpage is too large for the quick audit.");
  }

  const html = (await response.text()).slice(0, MAX_HTML_BYTES);
  const visibleText = stripTags(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " "),
  );

  return {
    requestedUrl: url.toString(),
    finalUrl: finalUrl.toString(),
    status: response.status,
    contentType,
    title: firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: firstMatch(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    ) ?? firstMatch(
      html,
      /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
    ),
    h1: collectMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi),
    canonical: firstMatch(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
    ),
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasPhoneLink: /href=["']tel:/i.test(html),
    hasEmailLink: /href=["']mailto:/i.test(html),
    hasForm: /<form\b/i.test(html),
    hasSchemaMarkup:
      /application\/ld\+json/i.test(html) || /itemscope|itemtype=/i.test(html),
    hasRobotsMeta: /<meta[^>]+name=["']robots["']/i.test(html),
    wordCount: visibleText ? visibleText.split(/\s+/).length : 0,
    htmlBytes: new TextEncoder().encode(html).length,
  };
}

function extractJsonObject(content: string): unknown {
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error("Nemotron returned an invalid audit response.");
  }
}

async function generateAudit(
  evidence: PageEvidence,
  business: Omit<AuditRequest, "website">,
): Promise<unknown> {
  const apiKey = Netlify.env.get("NVIDIA_API_KEY");
  if (!apiKey) throw new Error("NVIDIA_API_KEY is not configured.");

  const model = Netlify.env.get("NVIDIA_NEMOTRON_MODEL") || DEFAULT_MODEL;
  const prompt = `You are the lead website-audit analyst for Booked Ranked Fundable.
Use ONLY the supplied evidence. Never invent rankings, traffic, review counts, page-speed scores, revenue, or technical findings that were not observed.
Return strict JSON with this exact top-level shape:
{
  "mode": "live",
  "confidence": "high" | "medium" | "low",
  "executiveSummary": string,
  "strengths": [{"title": string, "evidence": string}],
  "issues": [{"severity": "high" | "medium" | "low", "title": string, "evidence": string, "recommendation": string}],
  "quickWins": [string],
  "disclaimer": string
}
The disclaimer must state that this is a rapid homepage audit based on observable page evidence, not a full SEO, accessibility, security, or performance certification.
Business context:
${JSON.stringify(business)}
Observed evidence:
${JSON.stringify(evidence)}`;

  const response = await fetch(NVIDIA_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "Produce factual, evidence-grounded website audits. Output JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 2200,
      stream: false,
    }),
    signal: AbortSignal.timeout(25_000),
  });

  const payload = (await response.json()) as NvidiaResponse;
  if (!response.ok) {
    throw new Error(
      payload.error?.message || `NVIDIA request failed with status ${response.status}.`,
    );
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Nemotron returned no audit content.");
  return extractJsonObject(content);
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed. Use POST." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) return json({ error: "Request is too large." }, 413);

  try {
    const input = (await request.json()) as AuditRequest;
    if (!input.website || typeof input.website !== "string") {
      return json({ error: "A website URL is required." }, 400);
    }

    const url = normalizeUrl(input.website);
    const evidence = await fetchPageEvidence(url);
    const audit = await generateAudit(evidence, {
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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Audit failed.";
    const status =
      message.includes("NVIDIA_API_KEY") || message.includes("NVIDIA request")
        ? 502
        : 422;
    return json({ ok: false, error: message }, status);
  }
};

export const config = {
  path: "/api/nemotron-audit",
};
