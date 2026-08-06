import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import {
  BrfIntelligenceError,
  runBrfIntelligence,
} from "./_shared/brf-intelligence.mts";

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

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function normalizeUrl(input: string): URL {
  const trimmed = input.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (!["http:", "https:"].includes(url.protocol)) {
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
  if (
    records.length === 0 ||
    records.some((record) => isPrivateAddress(record.address))
  ) {
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
  return decodeEntities(
    value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
  );
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
        "BookedRankedFundableAudit/2.0 (+https://bookedrankedfunded.org)",
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
    description:
      firstMatch(
        html,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
      ) ??
      firstMatch(
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

function normalizeAudit(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Provider returned an invalid audit object.");
  }
  const audit = data as Record<string, unknown>;
  if (typeof audit.executiveSummary !== "string") {
    throw new Error("Provider audit is missing an executive summary.");
  }
  if (!Array.isArray(audit.strengths) || !Array.isArray(audit.issues)) {
    throw new Error("Provider audit is missing strengths or issues.");
  }
  if (!Array.isArray(audit.quickWins) || typeof audit.disclaimer !== "string") {
    throw new Error("Provider audit is missing quick wins or disclaimer.");
  }
  return {
    ...audit,
    mode: "live",
    confidence: ["high", "medium", "low"].includes(String(audit.confidence))
      ? audit.confidence
      : "low",
  };
}

export default async (request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed. Use POST." }, 405);
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) {
    return json({ error: "Request is too large." }, 413);
  }

  try {
    const input = (await request.json()) as AuditRequest;
    if (!input.website || typeof input.website !== "string") {
      return json({ error: "A website URL is required." }, 400);
    }

    const url = normalizeUrl(input.website);
    const evidence = await fetchPageEvidence(url);
    const result = await runBrfIntelligence({
      taskType: "audit",
      prompt: `Return strict JSON with this exact top-level shape:
{
  "mode": "live",
  "confidence": "high" | "medium" | "low",
  "executiveSummary": string,
  "strengths": [{"title": string, "evidence": string}],
  "issues": [{"severity": "high" | "medium" | "low", "title": string, "evidence": string, "recommendation": string}],
  "quickWins": [string],
  "disclaimer": string
}
The disclaimer must state that this is a rapid homepage audit based on observable page evidence, not a full SEO, accessibility, security, or performance certification.`,
      context: {
        business: {
          businessName: input.businessName?.slice(0, 120),
          niche: input.niche?.slice(0, 80),
          city: input.city?.slice(0, 120),
        },
        evidence,
      },
      responseFormat: "json",
      validateData: normalizeAudit,
      maxTokens: 2600,
      timeoutMs: 50_000,
    });

    return json({
      ok: true,
      mode: "live",
      auditedAt: result.completedAt,
      evidence,
      audit: result.data,
      intelligence: {
        provider: result.provider,
        model: result.model,
        attempts: result.attempts,
        correlationId: result.correlationId,
      },
    });
  } catch (error) {
    if (error instanceof BrfIntelligenceError) {
      return json(
        {
          ok: false,
          error: error.message,
          code: error.code,
          attempts: error.attempts,
        },
        error.code === "NO_PROVIDER_CONFIGURED" ? 503 : 502,
      );
    }
    const message = error instanceof Error ? error.message : "Audit failed.";
    return json({ ok: false, error: message }, 422);
  }
};

export const config = {
  path: "/api/nemotron-audit",
};
