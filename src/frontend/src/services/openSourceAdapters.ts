// Open Source Service Adapters
// Wraps LiteLLM, Listmonk, SearXNG, and Ollama with consistent interface + fallback logic.
// All adapters return { success: false, fallback: true } when unconfigured or unreachable.
// The platform remains fully operational without any of these services.

import type {
  AIRouteResult,
  EmailPayload,
  EmailRouteResult,
  OpenSourceServiceConfig,
  SearchRouteResult,
  ServiceStatus,
} from "../types/integrations";

// ─── LiteLLM Adapter ──────────────────────────────────────────────────────────

export class LiteLLMAdapter {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey = "") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  async checkStatus(): Promise<ServiceStatus> {
    if (!this.baseUrl) return "unconfigured";
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok ? "connected" : "disconnected";
    } catch {
      return "disconnected";
    }
  }

  async chat(
    messages: { role: string; content: string }[],
    model?: string,
  ): Promise<{ success: boolean; content: string; fallback?: boolean }> {
    if (!this.baseUrl) return { success: false, content: "", fallback: true };
    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ model: model ?? "gpt-4o-mini", messages }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) return { success: false, content: "", fallback: true };
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content ?? "";
      return { success: true, content };
    } catch {
      return { success: false, content: "", fallback: true };
    }
  }
}

// ─── Listmonk Adapter ─────────────────────────────────────────────────────────

export class ListmonkAdapter {
  private baseUrl: string;
  private authHeader: string;

  constructor(baseUrl: string, username: string, password: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.authHeader =
      username && password ? `Basic ${btoa(`${username}:${password}`)}` : "";
  }

  async checkStatus(): Promise<ServiceStatus> {
    if (!this.baseUrl) return "unconfigured";
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok ? "connected" : "disconnected";
    } catch {
      return "disconnected";
    }
  }

  async sendTransactional(
    payload: EmailPayload,
  ): Promise<{ success: boolean; fallback?: boolean; error?: string }> {
    if (!this.baseUrl || !this.authHeader)
      return { success: false, fallback: true };
    try {
      const res = await fetch(`${this.baseUrl}/api/tx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.authHeader,
        },
        body: JSON.stringify({
          subscriber_email: payload.to,
          template_id: payload.templateId ?? 1,
          data: { subject: payload.subject, body: payload.body },
        }),
        signal: AbortSignal.timeout(8000),
      });
      return res.ok ? { success: true } : { success: false, fallback: true };
    } catch {
      return {
        success: false,
        fallback: true,
        error: "Unknown error",
      };
    }
  }
}

// ─── SearXNG Adapter ──────────────────────────────────────────────────────────

export class SearXNGAdapter {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async checkStatus(): Promise<ServiceStatus> {
    if (!this.baseUrl) return "unconfigured";
    try {
      const res = await fetch(
        `${this.baseUrl}/search?q=test&format=json&categories=general`,
        { signal: AbortSignal.timeout(3000) },
      );
      return res.ok ? "connected" : "disconnected";
    } catch {
      return "disconnected";
    }
  }

  async search(
    query: string,
    categories = "general",
    language = "en",
  ): Promise<{
    success: boolean;
    results: { title: string; url: string; snippet: string; source: string }[];
    fallback?: boolean;
  }> {
    if (!this.baseUrl) return { success: false, results: [], fallback: true };
    try {
      const params = new URLSearchParams({
        q: query,
        format: "json",
        categories,
        language,
      });
      const res = await fetch(`${this.baseUrl}/search?${params.toString()}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return { success: false, results: [], fallback: true };
      const data = (await res.json()) as {
        results?: {
          title?: string;
          url?: string;
          content?: string;
          engine?: string;
        }[];
      };
      const results = (data.results ?? []).slice(0, 10).map((r) => ({
        title: r.title ?? "",
        url: r.url ?? "",
        snippet: r.content ?? "",
        source: r.engine ?? "searxng",
      }));
      return { success: true, results };
    } catch {
      return { success: false, results: [], fallback: true };
    }
  }
}

// ─── Ollama Adapter ───────────────────────────────────────────────────────────

export class OllamaAdapter {
  private baseUrl: string;
  private defaultModel: string;

  constructor(baseUrl = "http://localhost:11434", defaultModel = "llama3") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.defaultModel = defaultModel;
  }

  async checkStatus(): Promise<ServiceStatus> {
    if (!this.baseUrl) return "unconfigured";
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok ? "connected" : "disconnected";
    } catch {
      return "disconnected";
    }
  }

  async generate(
    prompt: string,
    model?: string,
  ): Promise<{ success: boolean; content: string; fallback?: boolean }> {
    if (!this.baseUrl) return { success: false, content: "", fallback: true };
    try {
      const res = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model ?? this.defaultModel,
          prompt,
          stream: false,
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) return { success: false, content: "", fallback: true };
      const data = (await res.json()) as { response?: string };
      return { success: true, content: data.response ?? "" };
    } catch {
      return { success: false, content: "", fallback: true };
    }
  }

  async chat(
    messages: { role: string; content: string }[],
    model?: string,
  ): Promise<{ success: boolean; content: string; fallback?: boolean }> {
    if (!this.baseUrl) return { success: false, content: "", fallback: true };
    try {
      const res = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model ?? this.defaultModel,
          messages,
          stream: false,
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) return { success: false, content: "", fallback: true };
      const data = (await res.json()) as {
        message?: { content?: string };
      };
      return { success: true, content: data.message?.content ?? "" };
    } catch {
      return { success: false, content: "", fallback: true };
    }
  }
}

// ─── Research Result Shape ────────────────────────────────────────────────────

/** Shared result shape returned by all research adapters */
export interface ResearchResult {
  summary: string;
  citations: string[];
  recentActivity: string[];
  rankings: string;
  socialInsights: string;
}

/** @deprecated Use ResearchResult — kept for back-compat */
export type PerplexityResult = ResearchResult;

// ─── Claude Research Adapter ──────────────────────────────────────────────────

const RESEARCH_SYSTEM_PROMPT = `You are a business intelligence analyst. Research the given business and return ONLY a valid JSON object (no markdown, no explanation) with these exact fields:
{
  "summary": "2-3 sentence business overview",
  "recentActivity": ["recent event or signal 1", "recent event or signal 2"],
  "rankings": "description of estimated local search position for primary service keywords in their city",
  "socialInsights": "assessment of social media presence across Facebook/Instagram/LinkedIn"
}`;

const RESEARCH_USER_PROMPT = (
  name: string,
  niche: string,
  city: string,
  url: string,
) =>
  `Research this business and provide structured intelligence:
Business Name: ${name}
Niche/Industry: ${niche}
City: ${city}
Website: ${url}

Focus on: (1) estimated Google ranking position for primary service keywords in their city, (2) recent business activity and review/social signals, (3) social media presence assessment, (4) key improvement opportunities. Return only the JSON object.`;

export type ResearchError = {
  error: string;
  errorCode:
    | "key_missing"
    | "auth_failed"
    | "network_error"
    | "parse_error"
    | "timeout";
};

export function isResearchError(
  r: ResearchResult | ResearchError | null,
): r is ResearchError {
  return r !== null && typeof r === "object" && "errorCode" in r;
}

export class ClaudeResearchAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async research(
    name: string,
    niche: string,
    city: string,
    url: string,
  ): Promise<ResearchResult | ResearchError> {
    if (!this.apiKey?.trim())
      return {
        error: "Claude API key not configured",
        errorCode: "key_missing",
      };
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      let res: Response;
      try {
        res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5",
            max_tokens: 800,
            system: RESEARCH_SYSTEM_PROMPT,
            messages: [
              {
                role: "user",
                content: RESEARCH_USER_PROMPT(name, niche, city, url),
              },
            ],
          }),
          signal: ctrl.signal,
        });
      } catch (fetchErr) {
        clearTimeout(timer);
        if (fetchErr instanceof Error && fetchErr.name === "AbortError")
          return { error: "Claude request timed out", errorCode: "timeout" };
        return {
          error: `Claude network error: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`,
          errorCode: "network_error",
        };
      }
      clearTimeout(timer);
      if (res.status === 401 || res.status === 403)
        return {
          error: `Claude auth failed (HTTP ${res.status})`,
          errorCode: "auth_failed",
        };
      if (!res.ok)
        return {
          error: `Claude API error: HTTP ${res.status}`,
          errorCode: "network_error",
        };
      const data = (await res.json()) as {
        content?: Array<{ type: string; text?: string }>;
      };
      const raw = data.content?.find((b) => b.type === "text")?.text ?? "";
      try {
        const parsed = JSON.parse(
          raw.replace(/```json\n?|```/g, "").trim(),
        ) as Partial<ResearchResult>;
        return {
          summary: parsed.summary ?? "",
          citations: [],
          recentActivity: Array.isArray(parsed.recentActivity)
            ? parsed.recentActivity
            : [],
          rankings: parsed.rankings ?? "",
          socialInsights: parsed.socialInsights ?? "",
        };
      } catch {
        if (!raw)
          return {
            error: "Claude returned empty response",
            errorCode: "parse_error",
          };
        return {
          summary: raw.slice(0, 300),
          citations: [],
          recentActivity: [],
          rankings: "",
          socialInsights: "",
        };
      }
    } catch (err) {
      return {
        error: `Claude unexpected error: ${err instanceof Error ? err.message : String(err)}`,
        errorCode: "network_error",
      };
    }
  }
}

// ─── OpenAI Research Adapter ──────────────────────────────────────────────────

export class OpenAIResearchAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async research(
    name: string,
    niche: string,
    city: string,
    url: string,
  ): Promise<ResearchResult | ResearchError> {
    if (!this.apiKey?.trim())
      return {
        error: "OpenAI API key not configured",
        errorCode: "key_missing",
      };
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15000);
      let res: Response;
      try {
        res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 800,
            messages: [
              { role: "system", content: RESEARCH_SYSTEM_PROMPT },
              {
                role: "user",
                content: RESEARCH_USER_PROMPT(name, niche, city, url),
              },
            ],
          }),
          signal: ctrl.signal,
        });
      } catch (fetchErr) {
        clearTimeout(timer);
        if (fetchErr instanceof Error && fetchErr.name === "AbortError")
          return { error: "OpenAI request timed out", errorCode: "timeout" };
        return {
          error: `OpenAI network error: ${fetchErr instanceof Error ? fetchErr.message : String(fetchErr)}`,
          errorCode: "network_error",
        };
      }
      clearTimeout(timer);
      if (res.status === 401 || res.status === 403)
        return {
          error: `OpenAI auth failed (HTTP ${res.status})`,
          errorCode: "auth_failed",
        };
      if (!res.ok)
        return {
          error: `OpenAI API error: HTTP ${res.status}`,
          errorCode: "network_error",
        };
      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = data.choices?.[0]?.message?.content ?? "";
      try {
        const parsed = JSON.parse(
          raw.replace(/```json\n?|```/g, "").trim(),
        ) as Partial<ResearchResult>;
        return {
          summary: parsed.summary ?? "",
          citations: [],
          recentActivity: Array.isArray(parsed.recentActivity)
            ? parsed.recentActivity
            : [],
          rankings: parsed.rankings ?? "",
          socialInsights: parsed.socialInsights ?? "",
        };
      } catch {
        if (!raw)
          return {
            error: "OpenAI returned empty response",
            errorCode: "parse_error",
          };
        return {
          summary: raw.slice(0, 300),
          citations: [],
          recentActivity: [],
          rankings: "",
          socialInsights: "",
        };
      }
    } catch (err) {
      return {
        error: `OpenAI unexpected error: ${err instanceof Error ? err.message : String(err)}`,
        errorCode: "network_error",
      };
    }
  }
}

// ─── Perplexity Adapter ───────────────────────────────────────────────────────

const PERPLEXITY_INVALID_KEY = "__PERPLEXITY_INVALID_KEY__";

export class PerplexityAdapter {
  private apiKey: string;

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  async checkStatus(): Promise<boolean> {
    if (!this.apiKey?.trim()) return false;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 10000);
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 5,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (res.status === 401) throw new Error(PERPLEXITY_INVALID_KEY);
      return res.ok;
    } catch (err) {
      if (err instanceof Error && err.message === PERPLEXITY_INVALID_KEY) {
        return false;
      }
      return false;
    }
  }

  async research(query: string): Promise<PerplexityResult | null> {
    if (!this.apiKey?.trim()) return null;

    let attempt = 0;
    const MAX_RETRIES = 2;
    const DELAYS = [500, 1000];

    while (attempt <= MAX_RETRIES) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 10000);

        const res = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content:
                  "You are a B2B lead research assistant. When given a business query, return a concise JSON object with: summary (2-3 sentence business overview), recentActivity (array of 2-3 recent notable events/news), rankings (string describing local search presence), socialInsights (string describing social media presence). Be specific and factual. Return only valid JSON.",
              },
              { role: "user", content: query },
            ],
          }),
          signal: ctrl.signal,
        });

        clearTimeout(timer);

        // Invalid key — don't retry
        if (res.status === 401) return null;

        if (!res.ok) {
          attempt++;
          if (attempt > MAX_RETRIES) return null;
          await new Promise((r) => setTimeout(r, DELAYS[attempt - 1]));
          continue;
        }

        const data = (await res.json()) as {
          choices?: Array<{
            message?: { content?: string };
          }>;
          citations?: string[];
        };

        const raw = data.choices?.[0]?.message?.content ?? "";
        const citations = (data.citations ?? []).slice(0, 5);

        try {
          const parsed = JSON.parse(
            raw.replace(/```json\n?|```/g, "").trim(),
          ) as Partial<PerplexityResult>;
          return {
            summary: parsed.summary ?? "",
            citations,
            recentActivity: Array.isArray(parsed.recentActivity)
              ? parsed.recentActivity
              : [],
            rankings: parsed.rankings ?? "",
            socialInsights: parsed.socialInsights ?? "",
          };
        } catch {
          // JSON parse failed — return raw content wrapped in result
          return {
            summary: raw.slice(0, 300),
            citations,
            recentActivity: [],
            rankings: "",
            socialInsights: "",
          };
        }
      } catch {
        attempt++;
        if (attempt > MAX_RETRIES) return null;
        await new Promise((r) => setTimeout(r, DELAYS[attempt - 1]));
      }
    }

    return null;
  }
}

/**
 * Build a research router using the full priority chain:
 *   Perplexity (if key) → Claude (if key) → OpenAI (if key) → SearXNG (if URL) → null
 *
 * Perplexity is an optional upgrade — Claude and OpenAI are the primary
 * research engines when Perplexity is not configured.
 */
export function buildResearchRouter(
  perplexityKey?: string,
  searxngUrl?: string,
  claudeKey?: string,
  openaiKey?: string,
):
  | { type: "perplexity"; adapter: PerplexityAdapter }
  | { type: "claude"; adapter: ClaudeResearchAdapter }
  | { type: "openai"; adapter: OpenAIResearchAdapter }
  | { type: "searxng"; adapter: SearXNGAdapter }
  | null {
  if (perplexityKey?.trim()) {
    return {
      type: "perplexity",
      adapter: new PerplexityAdapter({ apiKey: perplexityKey }),
    };
  }
  if (claudeKey?.trim()) {
    return {
      type: "claude",
      adapter: new ClaudeResearchAdapter(claudeKey),
    };
  }
  if (openaiKey?.trim()) {
    return {
      type: "openai",
      adapter: new OpenAIResearchAdapter(openaiKey),
    };
  }
  if (searxngUrl?.trim()) {
    return { type: "searxng", adapter: new SearXNGAdapter(searxngUrl) };
  }
  return null;
}

// ─── Simulated responses (used when services are not connected) ───────────────

const SIMULATED_SEARCH_RESULTS: {
  title: string;
  url: string;
  snippet: string;
  source: string;
}[] = [
  {
    title: "ABC Plumbing & Drain — San Diego, CA",
    url: "https://abcplumbing.example.com",
    snippet:
      "Emergency plumber serving San Diego. Available 24/7. Fast response, honest pricing.",
    source: "simulated",
  },
  {
    title: "Coastal HVAC Solutions — Oceanside, CA",
    url: "https://coastalhvac.example.com",
    snippet:
      "HVAC installation and repair. Licensed and insured. Residential and commercial.",
    source: "simulated",
  },
  {
    title: "ProRestore Damage Services — Vista, CA",
    url: "https://prorestore.example.com",
    snippet:
      "Water and fire damage restoration. IICRC certified. Insurance approved.",
    source: "simulated",
  },
];

// ─── Unified Service Router ───────────────────────────────────────────────────

/**
 * Routes an AI task through the priority chain:
 * Ollama (local/cheap) → LiteLLM (proxy) → graceful degradation
 *
 * For real OpenAI/Claude routing, the existing providerAdapter in workflowEngine
 * handles those calls — this layer sits in front of it.
 */
export async function routeAICall(
  prompt: string,
  taskType: "simple" | "complex",
  config: OpenSourceServiceConfig,
): Promise<AIRouteResult> {
  // 1. Ollama first (free, local) — for simple tasks
  if (taskType === "simple" && config.ollama.enabled && config.ollama.baseUrl) {
    const ollama = new OllamaAdapter(
      config.ollama.baseUrl,
      config.ollama.defaultModel,
    );
    const result = await ollama.generate(prompt);
    if (result.success && result.content) {
      return {
        success: true,
        content: result.content,
        provider: "ollama",
        fallbackUsed: false,
      };
    }
  }

  // 2. LiteLLM proxy (routes to any provider via single key)
  if (config.litellm.enabled && config.litellm.baseUrl) {
    const litellm = new LiteLLMAdapter(
      config.litellm.baseUrl,
      config.litellm.apiKey,
    );
    const model =
      taskType === "simple"
        ? config.litellm.primaryModel
        : config.litellm.fallbackModel;
    const result = await litellm.chat(
      [{ role: "user", content: prompt }],
      model,
    );
    if (result.success && result.content) {
      return {
        success: true,
        content: result.content,
        provider: "litellm",
        fallbackUsed:
          taskType === "simple" &&
          config.ollama.enabled &&
          !!config.ollama.baseUrl,
      };
    }
  }

  // 3. Graceful degradation — never crash, always return something useful
  return {
    success: false,
    content:
      "AI service temporarily unavailable. Please configure an AI provider in the Integrations Hub or try again shortly.",
    provider: "degraded",
    fallbackUsed: true,
  };
}

/**
 * Routes email sends through the priority chain:
 * Listmonk (self-hosted) → Caffeine native email
 */
export async function routeEmailSend(
  email: EmailPayload,
  config: OpenSourceServiceConfig,
): Promise<EmailRouteResult> {
  // 1. Listmonk (self-hosted)
  if (
    config.listmonk.enabled &&
    config.listmonk.baseUrl &&
    config.listmonk.username
  ) {
    const listmonk = new ListmonkAdapter(
      config.listmonk.baseUrl,
      config.listmonk.username,
      config.listmonk.password,
    );
    const result = await listmonk.sendTransactional(email);
    if (result.success) {
      return {
        success: true,
        provider: "listmonk",
        fallbackUsed: false,
        warmEmailEnabled: false,
        warmEmailProvider: "caffeine_native",
      };
    }
  }

  // 2. Caffeine native (always available — platform default)
  return {
    success: true,
    provider: "caffeine_native",
    fallbackUsed: true,
    warmEmailEnabled: true,
    warmEmailProvider: "caffeine_native",
  };
}

/**
 * Routes search queries through the priority chain:
 * SearXNG (self-hosted) → Google Places API (existing key) → cached/simulated results
 */
export async function routeSearch(
  query: string,
  config: OpenSourceServiceConfig,
): Promise<SearchRouteResult> {
  // 1. SearXNG (self-hosted, free)
  if (config.searxng.enabled && config.searxng.baseUrl) {
    const searxng = new SearXNGAdapter(config.searxng.baseUrl);
    const result = await searxng.search(query);
    if (result.success && result.results.length > 0) {
      return {
        success: true,
        results: result.results,
        provider: "searxng",
        fallbackUsed: false,
      };
    }
  }

  // 2. Google Places (if configured in existing integrations) — would be wired
  //    to the googleKeys.placesKey from SettingsPage. For now returns cached.
  //    In production: call https://maps.googleapis.com/maps/api/place/textsearch/json

  // 3. Cached / simulated results — clearly labeled as simulated
  return {
    success: true,
    results: SIMULATED_SEARCH_RESULTS.map((r) => ({
      ...r,
      source: "cached",
      snippet: `[Simulated] ${r.snippet}`,
    })),
    provider: "cached",
    fallbackUsed: true,
  };
}

// ─── Fallback Lead Generator ──────────────────────────────────────────────────

/** Niche-to-business-type map for realistic demo name generation */
const NICHE_BUSINESS_TYPES: Record<string, string[]> = {
  plumbing: [
    "Pro Plumbing",
    "Plumbing Co",
    "Plumbing & Drain",
    "Plumbing Services",
    "Rooter & Plumbing",
    "Plumbing Experts",
    "Plumbing Solutions",
    "Plumbing Group",
    "Plumbing Plus",
    "Drain Masters",
  ],
  "med spa": [
    "Med Spa",
    "Aesthetics",
    "Skin Studio",
    "Wellness Spa",
    "Beauty & Wellness",
    "Laser & Aesthetics",
    "Medical Aesthetics",
    "Skin Clinic",
    "Beauty Institute",
    "Glow Studio",
  ],
  hvac: [
    "HVAC Solutions",
    "Heating & Cooling",
    "Air Comfort",
    "Climate Control",
    "HVAC Experts",
    "Air Services",
    "Comfort Systems",
    "HVAC Group",
    "Air & Heat",
    "Cooling Pros",
  ],
  restoration: [
    "Restoration Services",
    "Damage Restoration",
    "Disaster Recovery",
    "Water & Fire Restore",
    "Restoration Experts",
    "Pro Restoration",
    "Restore & Repair",
    "Emergency Restore",
    "Restoration Group",
    "Total Restoration",
  ],
  "carpet cleaning": [
    "Carpet Cleaning",
    "Floor Care",
    "Clean Carpets",
    "Carpet Pros",
    "Steam Clean",
    "Carpet & Upholstery",
    "Deep Clean Services",
    "Carpet Masters",
    "Cleaning Solutions",
    "Pro Clean",
  ],
  roofing: [
    "Roofing Co",
    "Roofing Solutions",
    "Roof Pros",
    "Roofing Experts",
    "Top Roofing",
    "Premier Roofing",
    "Roofing Group",
    "Roof Masters",
    "Quality Roofing",
    "Reliable Roofing",
  ],
  "real estate": [
    "Realty",
    "Real Estate Group",
    "Properties",
    "Homes & Realty",
    "Real Estate Co",
    "Property Group",
    "Real Estate Partners",
    "Premier Realty",
    "Homes",
    "Real Estate Solutions",
  ],
  mortgage: [
    "Mortgage Group",
    "Home Loans",
    "Mortgage Solutions",
    "Lending Co",
    "Mortgage Partners",
    "Home Finance",
    "Mortgage Experts",
    "Lending Group",
    "Mortgage Center",
    "Home Lending",
  ],
  chiropractic: [
    "Chiropractic Center",
    "Chiropractic Care",
    "Spine & Wellness",
    "Chiropractic Clinic",
    "Back & Spine Center",
    "Chiropractic Health",
    "Wellness Chiropractic",
    "Spinal Care",
    "Chiropractic Group",
    "Active Chiropractic",
  ],
  dental: [
    "Dental Care",
    "Family Dentistry",
    "Dental Group",
    "Smile Dental",
    "Dental Center",
    "Dental Studio",
    "Premier Dental",
    "Dental Wellness",
    "Smile Studio",
    "Dental Associates",
  ],
};

/** Street name fragments for address generation */
const STREET_NAMES = [
  "Main St",
  "Oak Ave",
  "Elm St",
  "Park Blvd",
  "Commerce Dr",
  "Industrial Pkwy",
  "Business Center Dr",
  "Market St",
  "Maple Ave",
  "Cedar Ln",
  "Highland Rd",
  "Valley Dr",
  "Summit Ave",
  "River Rd",
  "Lakewood Blvd",
  "Center St",
  "Heritage Pkwy",
  "Westside Dr",
  "Eastgate Blvd",
  "Northpark Ave",
];

/** Approximate GPS coordinates for common US cities */
const CITY_GPS: Record<string, { lat: number; lng: number }> = {
  "dallas, tx": { lat: 32.7767, lng: -96.797 },
  "houston, tx": { lat: 29.7604, lng: -95.3698 },
  "austin, tx": { lat: 30.2672, lng: -97.7431 },
  "san antonio, tx": { lat: 29.4241, lng: -98.4936 },
  "phoenix, az": { lat: 33.4484, lng: -112.074 },
  "los angeles, ca": { lat: 34.0522, lng: -118.2437 },
  "chicago, il": { lat: 41.8781, lng: -87.6298 },
  "miami, fl": { lat: 25.7617, lng: -80.1918 },
  "atlanta, ga": { lat: 33.749, lng: -84.388 },
  "denver, co": { lat: 39.7392, lng: -104.9903 },
  "seattle, wa": { lat: 47.6062, lng: -122.3321 },
  "new york, ny": { lat: 40.7128, lng: -74.006 },
  "boston, ma": { lat: 42.3601, lng: -71.0589 },
  "nashville, tn": { lat: 36.1627, lng: -86.7816 },
  "charlotte, nc": { lat: 35.2271, lng: -80.8431 },
  "las vegas, nv": { lat: 36.1699, lng: -115.1398 },
  "portland, or": { lat: 45.5231, lng: -122.6765 },
  "minneapolis, mn": { lat: 44.9778, lng: -93.265 },
  "orlando, fl": { lat: 28.5383, lng: -81.3792 },
  "san diego, ca": { lat: 32.7157, lng: -117.1611 },
};

/** Simple deterministic hash of a string → integer */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Seeded pseudo-random number in [0,1) based on a seed integer + index */
function seededRand(seed: number, idx: number): number {
  const x = Math.sin(seed * 9301 + idx * 49297 + 233) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate deterministic fallback leads seeded by niche + city.
 * Same inputs always produce the same leads — no random variance between renders.
 * Each lead has all required fields and is marked dataSource: "simulated".
 */
export function generateFallbackLeads(
  niche: string,
  city: string,
  count = 10,
): ScoredLead[] {
  const nicheKey = niche.toLowerCase();
  const cityKey = city.toLowerCase();
  const seed = hashStr(`${nicheKey}:${cityKey}`);

  // City prefix for business names (e.g. "Dallas" from "Dallas, TX")
  const cityPrefix = city.split(",")[0].trim();

  // Determine state abbreviation
  const { state } = parseState(city);

  // GPS base for the city (fall back to generic US center if unknown)
  const gpsBase = CITY_GPS[cityKey] ?? { lat: 39.5, lng: -98.35 };

  // Niche business type suffixes
  const suffixes =
    NICHE_BUSINESS_TYPES[nicheKey] ?? NICHE_BUSINESS_TYPES.plumbing ?? [];
  // Build pool of name prefixes seeded deterministically
  const prefixes = [
    cityPrefix,
    `${cityPrefix} Pro`,
    "Lone Star",
    "Premier",
    "Elite",
    "Top",
    "Quality",
    "Expert",
    "Best",
    "Trusted",
    "Local",
    "Fast",
  ];

  const leads: ScoredLead[] = [];

  for (let i = 0; i < count; i++) {
    const r = (idx: number) => seededRand(seed, i * 100 + idx);

    const prefixIdx = Math.floor(r(0) * prefixes.length);
    const suffixIdx = Math.floor(r(1) * suffixes.length);
    const businessName = `${prefixes[prefixIdx]} ${suffixes[suffixIdx]}`;

    const streetNum = 100 + Math.floor(r(2) * 9900);
    const streetIdx = Math.floor(r(3) * STREET_NAMES.length);
    const address = `${streetNum} ${STREET_NAMES[streetIdx]}, ${cityPrefix}, ${state || "TX"}`;

    const areaCode = 500 + Math.floor(r(4) * 500);
    const mid = 100 + Math.floor(r(5) * 900);
    const last = 1000 + Math.floor(r(6) * 9000);
    const phone = `(${areaCode}) ${mid}-${last}`;

    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const website = `www.${slug}.com`;

    const avgRating = 3.5 + r(7) * 1.4; // 3.5–4.9
    const reviewCount = Math.floor(5 + r(8) * 195); // 5–200
    const isOpen = r(9) > 0.35; // ~65% open

    const gpsLat = gpsBase.lat + (r(10) - 0.5) * 0.1;
    const gpsLng = gpsBase.lng + (r(11) - 0.5) * 0.1;

    // Compute score deterministically (same rule-based formula as scoreLeadsWithModel fallback)
    const reviewCountScore = Math.min(
      90,
      reviewCount < 10
        ? 20
        : reviewCount < 50
          ? 50
          : reviewCount < 100
            ? 70
            : 90,
    );
    const reviewRatingScore =
      avgRating < 3.5 ? 20 : avgRating < 4.0 ? 50 : avgRating < 4.5 ? 75 : 90;
    const websiteQuality = 70;
    const scores = {
      websiteQuality,
      reviewCountScore,
      reviewRatingScore,
      socialPresence: 40,
      gbpCompleteness: 70,
      bookingCapability: 30,
    };
    const overallScore = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / 6,
    );
    // Clamp to 50–85 range as specified
    const clampedScore = Math.max(50, Math.min(85, overallScore));
    const tier: ScoredLead["tier"] = clampedScore >= 70 ? "Hot" : "Warm";

    leads.push({
      businessName,
      website,
      phone,
      city: cityPrefix,
      state: state || "TX",
      reviewCount,
      avgRating: Math.round(avgRating * 10) / 10,
      sourceUrl: `https://${website}`,
      rawSnippet: `${niche} business in ${cityPrefix}. ${reviewCount} reviews, ${avgRating.toFixed(1)} stars.`,
      openNow: isOpen,
      address,
      gpsLat: Math.round(gpsLat * 10000) / 10000,
      gpsLng: Math.round(gpsLng * 10000) / 10000,
      dataSource: "simulated" as const,
      overallScore: clampedScore,
      tier,
      scores,
      researchSource: "claude" as const,
      validationFlags: [],
    });
  }

  return leads;
}

// ─── Lead Discovery Types ─────────────────────────────────────────────────────

/** A real business listing sourced from SerpApi or SearXNG — never fake */
export interface RealBusinessListing {
  businessName: string;
  website: string;
  phone: string;
  city: string;
  state: string;
  reviewCount: number;
  avgRating: number;
  sourceUrl: string;
  rawSnippet: string;
  // Extended SerpApi fields — optional for backward compat with SearXNG listings
  openNow?: boolean | null;
  address?: string;
  gpsLat?: number;
  gpsLng?: number;
  dataSource?: "serpapi" | "searxng" | "simulated";
}

/** Per-dimension scores + tier classification produced by an AI model */
export interface ScoredLead extends RealBusinessListing {
  overallScore: number;
  tier: "Hot" | "Warm" | "Cold";
  scores: {
    websiteQuality: number;
    reviewCountScore: number;
    reviewRatingScore: number;
    socialPresence: number;
    gbpCompleteness: number;
    bookingCapability: number;
  };
  researchSource: "claude" | "openai";
  validationFlags: string[];
}

/** Result from the dual-model parallel city search */
export interface DualModelSearchResult {
  claudeLeads: ScoredLead[];
  openaiLeads: ScoredLead[];
  mergedLeads: ScoredLead[];
  duplicatesRemoved: number;
  cityA: string;
  cityB: string;
  niche: string;
  /** True when real data sources were unavailable and fallback demo leads were generated */
  usingFallback: boolean;
  /** Error details when real data sources failed — undefined means success */
  sourceErrors?: {
    cityA?: { serpApi: string; searxng: string };
    cityB?: { serpApi: string; searxng: string };
  };
}

// ─── Anti-Hallucination Lead Discovery Prompt ─────────────────────────────────

/**
 * Build a structured, anti-hallucination scoring prompt.
 * The model receives ONLY the real data passed as context — it never invents.
 */
export function buildLeadDiscoveryPrompt(
  niche: string,
  city: string,
  model: "claude" | "openai",
): string {
  const modelNote =
    model === "claude"
      ? "You are Claude, acting as a business scoring analyst."
      : "You are acting as a business scoring analyst.";

  return `${modelNote}

CRITICAL RULES — MUST FOLLOW:
1. Analyze ONLY the business data provided below. Do NOT invent, assume, or extrapolate any information not present in the source data.
2. If a field is missing or unclear, mark it as the string "unknown" — never estimate it.
3. Return ONLY a valid JSON array. No markdown, no explanation, no prose.
4. Every businessName in your output MUST exactly match a businessName from the input data. Hallucinated names will be rejected.
5. overallScore MUST be an integer between 0 and 100.
6. tier MUST be derived strictly: Hot = overallScore >= 70, Warm = overallScore 40–69, Cold = overallScore < 40.
7. validationFlags MUST list any data quality issues found (e.g. "no_phone", "no_website", "no_reviews", "low_rating").

SCORING DIMENSIONS (each 0–100, based only on available data):
- website_quality: Does the business have a working website URL? (yes=70+, no=0, partial=30-50)
- review_count_score: Based on reviewCount field (0 reviews=0, 1-9=20, 10-49=50, 50-99=70, 100+=90)
- review_rating_score: Based on avgRating field (0 or unknown=0, <3.5=20, 3.5-3.9=50, 4.0-4.4=75, 4.5+=90)
- social_presence: Cannot be verified from listing data alone — score 40 as neutral default
- gbp_completeness: Inferred from listing richness (has name+phone+website+reviews=80, partial=40, minimal=10)
- booking_capability: Cannot be verified from listing data alone — score 30 as conservative default

CONTEXT: Niche = ${niche}, City = ${city}

OUTPUT FORMAT — return this exact JSON array shape:
[
  {
    "businessName": "exact name from input",
    "city": "${city}",
    "phone": "from input or unknown",
    "website": "from input or unknown",
    "reviewCount": number or "unknown",
    "avgRating": number or "unknown",
    "scores": {
      "websiteQuality": 0-100,
      "reviewCountScore": 0-100,
      "reviewRatingScore": 0-100,
      "socialPresence": 0-100,
      "gbpCompleteness": 0-100,
      "bookingCapability": 0-100
    },
    "overallScore": 0-100,
    "tier": "Hot" | "Warm" | "Cold",
    "researchSource": "${model}",
    "validationFlags": ["flag1", "flag2"]
  }
]

BUSINESS DATA TO SCORE:
`;
}

// ─── SerpApi Google Maps Connector ───────────────────────────────────────────

/** Shape of a single local result from SerpApi Google Maps endpoint */
interface SerpApiLocalResult {
  title?: string;
  phone?: string;
  website?: string;
  address?: string;
  rating?: number;
  reviews?: number;
  open_now?: boolean;
  gps_coordinates?: { latitude?: number; longitude?: number };
  place_id?: string;
}

/** Shape of the SerpApi Google Maps response */
interface SerpApiResponse {
  local_results?: SerpApiLocalResult[];
  error?: string;
}

// ─── Discriminated result types for surfacing errors ────────────────────────

export type SerpApiResult =
  | { success: true; data: RealBusinessListing[] }
  | {
      success: false;
      error: string;
      errorCode:
        | "key_missing"
        | "quota_exceeded"
        | "network_error"
        | "no_results"
        | "timeout";
    };

export type ListingsResult =
  | {
      success: true;
      data: RealBusinessListing[];
      source: "serpapi" | "searxng";
    }
  | { success: false; serpApiError: string; searxngError: string };

/** Check if a lead is simulated (demo) data */
export function isSimulatedLead(lead: { dataSource?: string }): boolean {
  return lead.dataSource === "simulated";
}

/**
 * Fetch real local business listings from SerpApi Google Maps endpoint.
 * Returns a discriminated result — never null, always surfaces the real error.
 */
export async function fetchListingsFromSerpApi(
  niche: string,
  city: string,
  apiKey: string,
  limit = 20,
): Promise<SerpApiResult> {
  if (!apiKey?.trim()) {
    return {
      success: false,
      error:
        "SerpApi key is not configured. Add your key in Go Live → Lead Discovery.",
      errorCode: "key_missing",
    };
  }

  const { city: cityName, state } = parseState(city);
  const query = encodeURIComponent(`${niche} in ${city}`);
  const url = `https://serpapi.com/search.json?engine=google_maps&q=${query}&api_key=${apiKey}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });

    // Parse error body regardless of status code — SerpApi returns JSON errors
    let data: SerpApiResponse;
    try {
      data = (await res.json()) as SerpApiResponse;
    } catch {
      return {
        success: false,
        error: `SerpApi returned HTTP ${res.status} with non-JSON body`,
        errorCode: "network_error",
      };
    }

    // SerpApi API-level errors (invalid key, quota exceeded, etc.)
    if (data.error) {
      const errLower = data.error.toLowerCase();
      if (
        errLower.includes("invalid") ||
        errLower.includes("unauthorized") ||
        errLower.includes("api_key")
      ) {
        return {
          success: false,
          error: `SerpApi key invalid: ${data.error}`,
          errorCode: "network_error",
        };
      }
      if (
        errLower.includes("quota") ||
        errLower.includes("limit") ||
        errLower.includes("exceeded")
      ) {
        return {
          success: false,
          error: `SerpApi quota exceeded: ${data.error}. Upgrade your plan or wait for reset.`,
          errorCode: "quota_exceeded",
        };
      }
      return {
        success: false,
        error: `SerpApi error: ${data.error}`,
        errorCode: "network_error",
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: `SerpApi HTTP ${res.status} — check your API key and account status.`,
        errorCode: "network_error",
      };
    }

    if (!data.local_results || data.local_results.length === 0) {
      return {
        success: false,
        error: `SerpApi returned no local business results for "${niche} in ${city}". Try a different city or niche.`,
        errorCode: "no_results",
      };
    }

    // Deduplicate by phone + name before returning
    const seenPhones = new Set<string>();
    const seenNames = new Set<string>();
    const listings: RealBusinessListing[] = [];

    for (const r of data.local_results) {
      if (listings.length >= limit) break;

      const name = (r.title ?? "").trim();
      if (!name) continue;

      const phone = (r.phone ?? "").replace(/\s+/g, " ").trim();
      const normPhone = phone.replace(/\D/g, "").slice(-10);
      const normName = name.toLowerCase();

      if (normPhone && seenPhones.has(normPhone)) continue;
      if (seenNames.has(normName)) continue;

      if (normPhone) seenPhones.add(normPhone);
      seenNames.add(normName);

      const lat = r.gps_coordinates?.latitude;
      const lng = r.gps_coordinates?.longitude;

      listings.push({
        businessName: name,
        website: r.website ?? "",
        phone,
        city: cityName,
        state,
        reviewCount: r.reviews ?? 0,
        avgRating: r.rating ?? 0,
        sourceUrl: r.website ?? "",
        rawSnippet: [r.address, r.phone]
          .filter(Boolean)
          .join(" · ")
          .slice(0, 300),
        openNow: r.open_now ?? null,
        address: r.address ?? "",
        gpsLat: lat,
        gpsLng: lng,
        dataSource: "serpapi",
      });
    }

    if (listings.length === 0) {
      return {
        success: false,
        error: `SerpApi returned results but none had valid business names for "${niche} in ${city}".`,
        errorCode: "no_results",
      };
    }
    return { success: true, data: listings };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error:
          "SerpApi request timed out after 12 seconds. Check your network connection.",
        errorCode: "timeout",
      };
    }
    return {
      success: false,
      error: `SerpApi network error: ${err instanceof Error ? err.message : String(err)}`,
      errorCode: "network_error",
    };
  }
}

// ─── Real Business Listings from SearXNG ─────────────────────────────────────

/** Extract a phone number from a text snippet using common US formats */
function extractPhone(text: string): string {
  const match = text.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0].replace(/\s+/g, " ").trim() : "";
}

/** Extract a clean domain string from a URL */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return url.toLowerCase();
  }
}

/** Parse a state abbreviation or name from a city string like "Dallas, TX" */
function parseState(cityInput: string): { city: string; state: string } {
  const parts = cityInput.split(",").map((s) => s.trim());
  if (parts.length >= 2) return { city: parts[0], state: parts[1] };
  return { city: cityInput, state: "" };
}

/**
 * Fetch real business listings for a given niche + city.
 * Priority chain: SerpApi → SearXNG. Never falls back to mock data automatically.
 * Returns a discriminated result with specific error details from each source.
 */
export async function fetchRealBusinessListings(
  niche: string,
  city: string,
  searxngUrl: string,
  limit = 50,
  serpApiKey?: string,
): Promise<ListingsResult> {
  let serpApiErrorMsg = "SerpApi key not configured";

  // 1. Try SerpApi first (structured, high-quality Google Maps data)
  if (serpApiKey?.trim()) {
    const serpResult = await fetchListingsFromSerpApi(
      niche,
      city,
      serpApiKey,
      limit,
    );
    if (serpResult.success) {
      return { success: true, data: serpResult.data, source: "serpapi" };
    }
    serpApiErrorMsg = serpResult.error;
  }

  // 2. Try SearXNG
  if (searxngUrl?.trim()) {
    const { city: cityName, state } = parseState(city);
    const query = `${niche} businesses in ${city} site:google.com/maps OR yelp.com OR yellowpages.com`;
    const params = new URLSearchParams({
      q: query,
      format: "json",
      categories: "general",
      language: "en",
    });

    try {
      const res = await fetch(
        `${searxngUrl.replace(/\/$/, "")}/search?${params.toString()}`,
        { signal: AbortSignal.timeout(12000) },
      );

      if (!res.ok) {
        return {
          success: false,
          serpApiError: serpApiErrorMsg,
          searxngError: `SearXNG HTTP ${res.status} — check your SearXNG URL in Go Live settings.`,
        };
      }

      const data = (await res.json()) as {
        results?: {
          title?: string;
          url?: string;
          content?: string;
          engine?: string;
        }[];
      };
      const raw = data.results ?? [];
      const seen = new Set<string>();
      const listings: RealBusinessListing[] = [];

      for (const r of raw) {
        if (listings.length >= limit) break;
        const title = (r.title ?? "").trim();
        const url = (r.url ?? "").trim();
        const snippet = (r.content ?? "").trim();
        if (!title || !url) continue;
        const domain = extractDomain(url);
        if (seen.has(domain)) continue;
        seen.add(domain);
        const reviewMatch = snippet.match(/(\d+)\s*(reviews?|ratings?)/i);
        const ratingMatch = snippet.match(
          /(\d+\.?\d*)\s*(out of 5|stars?|\/5)/i,
        );
        const reviewCount = reviewMatch
          ? Number.parseInt(reviewMatch[1], 10)
          : 0;
        const avgRating = ratingMatch ? Number.parseFloat(ratingMatch[1]) : 0;
        listings.push({
          businessName: title.split("—")[0].split("-")[0].trim(),
          website: url,
          phone: extractPhone(snippet),
          city: cityName,
          state,
          reviewCount,
          avgRating,
          sourceUrl: url,
          rawSnippet: snippet.slice(0, 300),
          dataSource: "searxng",
        });
      }

      if (listings.length > 0) {
        return { success: true, data: listings, source: "searxng" };
      }
      return {
        success: false,
        serpApiError: serpApiErrorMsg,
        searxngError: `SearXNG returned no results for "${niche} in ${city}"`,
      };
    } catch (err) {
      const searxngErr =
        err instanceof Error && err.name === "AbortError"
          ? "SearXNG request timed out after 12 seconds."
          : `SearXNG network error: ${err instanceof Error ? err.message : String(err)}`;
      return {
        success: false,
        serpApiError: serpApiErrorMsg,
        searxngError: searxngErr,
      };
    }
  }

  return {
    success: false,
    serpApiError: serpApiErrorMsg,
    searxngError:
      "SearXNG URL not configured. Add your SearXNG URL in Go Live → Lead Discovery.",
  };
}

// ─── Score Leads With a Specific Model ───────────────────────────────────────

/** Call Claude haiku with a scoring prompt + real listings as context */
async function callClaudeScoring(
  prompt: string,
  listingsJson: string,
  apiKey: string,
): Promise<
  | { success: true; text: string }
  | { success: false; error: string; statusCode?: number }
> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 4096,
        system:
          "You are a precise business data analyst. Return only valid JSON arrays — no markdown, no explanation.",
        messages: [{ role: "user", content: prompt + listingsJson }],
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      let errDetail = `HTTP ${res.status}`;
      try {
        const errBody = (await res.json()) as { error?: { message?: string } };
        if (errBody.error?.message) errDetail = errBody.error.message;
      } catch {
        /* ignore parse error */
      }
      return {
        success: false,
        error: `Claude API error: ${errDetail}`,
        statusCode: res.status,
      };
    }
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = data.content?.find((b) => b.type === "text")?.text;
    if (!text)
      return { success: false, error: "Claude returned empty response" };
    return { success: true, text };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: "Claude request timed out after 30 seconds",
      };
    }
    return {
      success: false,
      error: `Claude network error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/** Call GPT-4o-mini with a scoring prompt + real listings as context */
async function callOpenAIScoring(
  prompt: string,
  listingsJson: string,
  apiKey: string,
): Promise<
  | { success: true; text: string }
  | { success: false; error: string; statusCode?: number }
> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 4096,
        messages: [
          {
            role: "system",
            content:
              "You are a precise business data analyst. Return only valid JSON arrays — no markdown, no explanation.",
          },
          { role: "user", content: prompt + listingsJson },
        ],
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      let errDetail = `HTTP ${res.status}`;
      try {
        const errBody = (await res.json()) as { error?: { message?: string } };
        if (errBody.error?.message) errDetail = errBody.error.message;
      } catch {
        /* ignore parse error */
      }
      return {
        success: false,
        error: `OpenAI API error: ${errDetail}`,
        statusCode: res.status,
      };
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text)
      return { success: false, error: "OpenAI returned empty response" };
    return { success: true, text };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: "OpenAI request timed out after 30 seconds",
      };
    }
    return {
      success: false,
      error: `OpenAI network error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/** Parse and validate model JSON output — filters hallucinated business names */
function parseAndValidateScoredLeads(
  raw: string,
  originalListings: RealBusinessListing[],
  model: "claude" | "openai",
): ScoredLead[] {
  let parsed: unknown;
  try {
    const cleaned = raw.replace(/```json\n?|```/g, "").trim();
    // Handle both top-level array and wrapped { leads: [...] }
    const obj = JSON.parse(cleaned) as unknown;
    parsed = Array.isArray(obj)
      ? obj
      : ((obj as Record<string, unknown>).leads ?? obj);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const originalNames = new Set(
    originalListings.map((l) => l.businessName.toLowerCase()),
  );

  return (parsed as Record<string, unknown>[])
    .filter((item) => {
      if (typeof item !== "object" || item === null) return false;
      const name = String(item.businessName ?? "").toLowerCase();
      // Hallucination guard — name must match an original listing
      return originalNames.has(name);
    })
    .map((item) => {
      const listing = originalListings.find(
        (l) =>
          l.businessName.toLowerCase() ===
          String(item.businessName ?? "").toLowerCase(),
      )!;

      const rawScores = (item.scores ?? {}) as Record<string, unknown>;
      const clampScore = (v: unknown): number => {
        const n =
          typeof v === "number" ? v : Number.parseInt(String(v ?? 0), 10);
        return Math.max(0, Math.min(100, Number.isNaN(n) ? 0 : n));
      };

      const scores = {
        websiteQuality: clampScore(rawScores.websiteQuality),
        reviewCountScore: clampScore(rawScores.reviewCountScore),
        reviewRatingScore: clampScore(rawScores.reviewRatingScore),
        socialPresence: clampScore(rawScores.socialPresence),
        gbpCompleteness: clampScore(rawScores.gbpCompleteness),
        bookingCapability: clampScore(rawScores.bookingCapability),
      };

      const overallScore = clampScore(item.overallScore);
      const tier: ScoredLead["tier"] =
        overallScore >= 70 ? "Hot" : overallScore >= 40 ? "Warm" : "Cold";

      const validationFlags: string[] = Array.isArray(item.validationFlags)
        ? (item.validationFlags as string[]).filter(
            (f) => typeof f === "string",
          )
        : [];

      return {
        ...listing,
        overallScore,
        tier,
        scores,
        researchSource: model,
        validationFlags,
      } satisfies ScoredLead;
    });
}

/**
 * Score real business listings using a specific AI model.
 * Passes real listing data as context — model never generates names.
 * Falls back gracefully: assigns score=50/Warm if model call fails.
 */
export async function scoreLeadsWithModel(
  listings: RealBusinessListing[],
  niche: string,
  city: string,
  model: "claude" | "openai",
  claudeKey?: string,
  openaiKey?: string,
): Promise<ScoredLead[]> {
  if (listings.length === 0) return [];

  const prompt = buildLeadDiscoveryPrompt(niche, city, model);
  const listingsJson = JSON.stringify(
    listings.map((l) => ({
      businessName: l.businessName,
      website: l.website || "unknown",
      phone: l.phone || "unknown",
      reviewCount: l.reviewCount || "unknown",
      avgRating: l.avgRating || "unknown",
      rawSnippet: l.rawSnippet,
    })),
    null,
    2,
  );

  let rawResponse: string | null = null;

  if (model === "claude" && claudeKey?.trim()) {
    const result = await callClaudeScoring(prompt, listingsJson, claudeKey);
    if (result.success) rawResponse = result.text;
    else console.warn(`Claude scoring failed: ${result.error}`);
  } else if (model === "openai" && openaiKey?.trim()) {
    const result = await callOpenAIScoring(prompt, listingsJson, openaiKey);
    if (result.success) rawResponse = result.text;
    else console.warn(`OpenAI scoring failed: ${result.error}`);
  }

  // Adaptive routing: if primary model failed, try the other
  if (!rawResponse) {
    if (model === "claude" && openaiKey?.trim()) {
      const result = await callOpenAIScoring(prompt, listingsJson, openaiKey);
      if (result.success) rawResponse = result.text;
      else console.warn(`OpenAI fallback scoring failed: ${result.error}`);
    } else if (model === "openai" && claudeKey?.trim()) {
      const result = await callClaudeScoring(prompt, listingsJson, claudeKey);
      if (result.success) rawResponse = result.text;
      else console.warn(`Claude fallback scoring failed: ${result.error}`);
    }
  }

  if (rawResponse) {
    const scored = parseAndValidateScoredLeads(rawResponse, listings, model);
    if (scored.length > 0) return scored;
  }

  // Final fallback: rule-based scoring from raw listing data — never empty
  return listings.map((l): ScoredLead => {
    const reviewCountScore = Math.min(
      90,
      l.reviewCount === 0
        ? 0
        : l.reviewCount < 10
          ? 20
          : l.reviewCount < 50
            ? 50
            : l.reviewCount < 100
              ? 70
              : 90,
    );
    const reviewRatingScore =
      l.avgRating === 0
        ? 0
        : l.avgRating < 3.5
          ? 20
          : l.avgRating < 4.0
            ? 50
            : l.avgRating < 4.5
              ? 75
              : 90;
    const websiteQuality = l.website && l.website !== "unknown" ? 70 : 0;
    const scores = {
      websiteQuality,
      reviewCountScore,
      reviewRatingScore,
      socialPresence: 40,
      gbpCompleteness:
        l.phone && l.website ? 70 : l.phone || l.website ? 40 : 10,
      bookingCapability: 30,
    };
    const overallScore = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / 6,
    );
    const tier: ScoredLead["tier"] =
      overallScore >= 70 ? "Hot" : overallScore >= 40 ? "Warm" : "Cold";
    const validationFlags: string[] = [];
    if (!l.phone) validationFlags.push("no_phone");
    if (!l.website || l.website === "unknown")
      validationFlags.push("no_website");
    if (l.reviewCount === 0) validationFlags.push("no_reviews");
    return {
      ...l,
      overallScore,
      tier,
      scores,
      researchSource: model,
      validationFlags,
    };
  });
}

// ─── Dual-Model Parallel City Lead Search ────────────────────────────────────

/**
 * Run a parallel dual-model lead search across two cities.
 * Claude handles cityA, OpenAI handles cityB — simultaneously.
 * Results are merged, deduplicated, and sorted by score descending.
 * Adaptive routing: if one model fails, the other covers both cities.
 */
export async function runDualModelLeadSearch(params: {
  niche: string;
  cityA: string;
  cityB: string;
  claudeKey?: string;
  openaiKey?: string;
  searxngUrl?: string;
  serpApiKey?: string;
  onProgress?: (stage: string, progress: number) => void;
  onError?: (error: {
    cityA?: { serpApi: string; searxng: string };
    cityB?: { serpApi: string; searxng: string };
  }) => void;
}): Promise<DualModelSearchResult> {
  const {
    niche,
    cityA,
    cityB,
    claudeKey,
    openaiKey,
    searxngUrl,
    serpApiKey,
    onProgress,
    onError,
  } = params;

  onProgress?.("Fetching real business listings from both cities...", 10);

  // Step 1: Fetch real listings for both cities in parallel — NO silent fallbacks
  let listingsA: RealBusinessListing[] = [];
  let listingsB: RealBusinessListing[] = [];
  const usingFallback = false;
  const sourceErrors: {
    cityA?: { serpApi: string; searxng: string };
    cityB?: { serpApi: string; searxng: string };
  } = {};

  const [resA, resB] = await Promise.all([
    fetchRealBusinessListings(niche, cityA, searxngUrl ?? "", 50, serpApiKey),
    fetchRealBusinessListings(niche, cityB, searxngUrl ?? "", 50, serpApiKey),
  ]);

  if (resA.success) {
    listingsA = resA.data;
  } else {
    sourceErrors.cityA = {
      serpApi: resA.serpApiError,
      searxng: resA.searxngError,
    };
    console.warn(
      `Lead search failed for city A (${cityA}):`,
      resA.serpApiError,
      "|",
      resA.searxngError,
    );
  }

  if (resB.success) {
    listingsB = resB.data;
  } else {
    sourceErrors.cityB = {
      serpApi: resB.serpApiError,
      searxng: resB.searxngError,
    };
    console.warn(
      `Lead search failed for city B (${cityB}):`,
      resB.serpApiError,
      "|",
      resB.searxngError,
    );
  }

  // If BOTH cities failed to return real data, surface the error immediately
  if (
    listingsA.length === 0 &&
    listingsB.length === 0 &&
    (sourceErrors.cityA || sourceErrors.cityB)
  ) {
    onError?.(sourceErrors);
    return {
      claudeLeads: [],
      openaiLeads: [],
      mergedLeads: [],
      duplicatesRemoved: 0,
      cityA,
      cityB,
      niche,
      usingFallback: false,
      sourceErrors,
    };
  }

  onProgress?.("Scoring leads with AI models in parallel...", 40);

  // Step 2: Score in parallel — Claude takes cityA, OpenAI takes cityB
  const [claudeResult, openaiResult] = await Promise.allSettled([
    scoreLeadsWithModel(
      listingsA,
      niche,
      cityA,
      "claude",
      claudeKey,
      openaiKey,
    ),
    scoreLeadsWithModel(
      listingsB,
      niche,
      cityB,
      "openai",
      claudeKey,
      openaiKey,
    ),
  ]);

  const claudeLeads: ScoredLead[] =
    claudeResult.status === "fulfilled" ? claudeResult.value : [];
  const openaiLeads: ScoredLead[] =
    openaiResult.status === "fulfilled" ? openaiResult.value : [];

  onProgress?.("Merging and deduplicating results...", 70);

  // Step 3: Merge + deduplicate by phone OR domain match
  const combined = [...claudeLeads, ...openaiLeads];
  const seenPhones = new Set<string>();
  const seenDomains = new Set<string>();
  const mergedLeads: ScoredLead[] = [];
  let duplicatesRemoved = 0;

  for (const lead of combined) {
    const phone = (lead.phone ?? "").replace(/\D/g, "");
    const domain = extractDomain(lead.website ?? "");

    const phoneKey = phone.length >= 10 ? phone.slice(-10) : "";
    const domainKey = domain && domain !== "unknown" ? domain : "";

    const isDuplicate =
      (phoneKey && seenPhones.has(phoneKey)) ||
      (domainKey && seenDomains.has(domainKey));

    if (isDuplicate) {
      duplicatesRemoved++;
      continue;
    }

    if (phoneKey) seenPhones.add(phoneKey);
    if (domainKey) seenDomains.add(domainKey);
    mergedLeads.push(lead);
  }

  // Step 4: Sort by overall score descending
  mergedLeads.sort((a, b) => b.overallScore - a.overallScore);

  onProgress?.("Lead search complete.", 100);

  return {
    claudeLeads,
    openaiLeads,
    mergedLeads,
    duplicatesRemoved,
    cityA,
    cityB,
    niche,
    usingFallback,
    sourceErrors:
      Object.keys(sourceErrors).length > 0 ? sourceErrors : undefined,
  };
}

// ─── Live Integration Health Check ───────────────────────────────────────────

export interface IntegrationHealthResult {
  service: string;
  status: "connected" | "failed" | "not_configured";
  message: string;
  testedAt: Date;
}

/** Test SerpApi key validity by making a minimal search call */
export async function testSerpApiConnection(
  apiKey: string,
): Promise<IntegrationHealthResult> {
  if (!apiKey?.trim()) {
    return {
      service: "SerpApi",
      status: "not_configured",
      message: "API key not configured",
      testedAt: new Date(),
    };
  }
  const result = await fetchListingsFromSerpApi(
    "plumber",
    "Dallas, TX",
    apiKey,
    1,
  );
  if (result.success) {
    return {
      service: "SerpApi",
      status: "connected",
      message: `Connected — returned ${result.data.length} result(s)`,
      testedAt: new Date(),
    };
  }
  return {
    service: "SerpApi",
    status: "failed",
    message: result.error,
    testedAt: new Date(),
  };
}

export async function testSerpApiDevConnection(
  apiKey: string,
): Promise<IntegrationHealthResult> {
  if (!apiKey?.trim()) {
    return {
      service: "SerpApi.dev",
      status: "not_configured",
      message: "API key not configured",
      testedAt: new Date(),
    };
  }
  try {
    const response = await fetch(
      `https://serpapi.dev/account?api_key=${encodeURIComponent(apiKey)}`,
    );
    if (response.ok) {
      let quotaRemaining: number | undefined;
      try {
        const data = (await response.json()) as Record<string, unknown>;
        if (data?.searches_per_month_used !== undefined) {
          quotaRemaining = Math.max(
            0,
            2500 - ((data.searches_per_month_used as number) || 0),
          );
        }
      } catch {}
      const quotaMsg =
        quotaRemaining !== undefined
          ? ` — ${quotaRemaining} searches remaining`
          : "";
      return {
        service: "SerpApi.dev",
        status: "connected",
        message: `Connected — SerpApi.dev active${quotaMsg}`,
        testedAt: new Date(),
      };
    }
    if (response.status === 401 || response.status === 403) {
      return {
        service: "SerpApi.dev",
        status: "failed",
        message: "Invalid API key",
        testedAt: new Date(),
      };
    }
    if (response.status === 429) {
      return {
        service: "SerpApi.dev",
        status: "failed",
        message: "Quota exceeded (2,500 searches used)",
        testedAt: new Date(),
      };
    }
    return {
      service: "SerpApi.dev",
      status: "failed",
      message: `Connection failed (HTTP ${response.status})`,
      testedAt: new Date(),
    };
  } catch {
    return {
      service: "SerpApi.dev",
      status: "failed",
      message: "Connection failed — check your network",
      testedAt: new Date(),
    };
  }
}

export async function testTinyFishConnection(
  tinyFishKey: string,
): Promise<IntegrationHealthResult> {
  if (!tinyFishKey?.trim()) {
    return {
      service: "TinyFish",
      status: "not_configured",
      message: "API key not configured",
      testedAt: new Date(),
    };
  }
  try {
    const response = await fetch(
      `https://agent.tinyfish.ai/health?api_key=${encodeURIComponent(tinyFishKey)}`,
    );
    if (response.ok)
      return {
        service: "TinyFish",
        status: "connected",
        message: "Connected",
        testedAt: new Date(),
      };
    if (response.status === 401 || response.status === 403)
      return {
        service: "TinyFish",
        status: "failed",
        message: "Invalid API key",
        testedAt: new Date(),
      };
    return {
      service: "TinyFish",
      status: "failed",
      message: `Connection failed (HTTP ${response.status})`,
      testedAt: new Date(),
    };
  } catch {
    return {
      service: "TinyFish",
      status: "failed",
      message: "Connection failed — check your network",
      testedAt: new Date(),
    };
  }
}

export async function searchWithSerpApiDev(
  query: string,
  apiKey: string,
  options?: { engine?: string; location?: string; num?: number },
): Promise<unknown> {
  const params = new URLSearchParams({
    api_key: apiKey,
    q: query,
    engine: options?.engine ?? "google",
    ...(options?.location ? { location: options.location } : {}),
    ...(options?.num ? { num: String(options.num) } : {}),
  });
  const response = await fetch(
    `https://serpapi.dev/search?${params.toString()}`,
  );
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `SerpApi.dev search failed (HTTP ${response.status}): ${errText}`,
    );
  }
  return response.json();
}

/** Test SearXNG endpoint reachability */
export async function testSearxngConnection(
  url: string,
): Promise<IntegrationHealthResult> {
  if (!url?.trim()) {
    return {
      service: "SearXNG",
      status: "not_configured",
      message: "URL not configured",
      testedAt: new Date(),
    };
  }
  try {
    const res = await fetch(
      `${url.replace(/\/$/, "")}/search?q=test&format=json`,
      { signal: AbortSignal.timeout(6000) },
    );
    if (res.ok) {
      return {
        service: "SearXNG",
        status: "connected",
        message: "Connected — endpoint reachable",
        testedAt: new Date(),
      };
    }
    return {
      service: "SearXNG",
      status: "failed",
      message: `HTTP ${res.status} — check your SearXNG URL`,
      testedAt: new Date(),
    };
  } catch (err) {
    return {
      service: "SearXNG",
      status: "failed",
      message: `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
      testedAt: new Date(),
    };
  }
}

/** Test Claude API key by making a minimal messages call */
export async function testClaudeConnection(
  apiKey: string,
): Promise<IntegrationHealthResult> {
  if (!apiKey?.trim()) {
    return {
      service: "Claude",
      status: "not_configured",
      message: "API key not configured",
      testedAt: new Date(),
    };
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 5,
        messages: [{ role: "user", content: "hi" }],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok)
      return {
        service: "Claude",
        status: "connected",
        message: "Connected — API key valid",
        testedAt: new Date(),
      };
    if (res.status === 401)
      return {
        service: "Claude",
        status: "failed",
        message: "API key invalid (401 Unauthorized)",
        testedAt: new Date(),
      };
    if (res.status === 429)
      return {
        service: "Claude",
        status: "connected",
        message: "API key valid — rate limited (429)",
        testedAt: new Date(),
      };
    return {
      service: "Claude",
      status: "failed",
      message: `HTTP ${res.status}`,
      testedAt: new Date(),
    };
  } catch (err) {
    return {
      service: "Claude",
      status: "failed",
      message: `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
      testedAt: new Date(),
    };
  }
}

/** Test OpenAI API key */
export async function testOpenAIConnection(
  apiKey: string,
): Promise<IntegrationHealthResult> {
  if (!apiKey?.trim()) {
    return {
      service: "OpenAI",
      status: "not_configured",
      message: "API key not configured",
      testedAt: new Date(),
    };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok)
      return {
        service: "OpenAI",
        status: "connected",
        message: "Connected — API key valid",
        testedAt: new Date(),
      };
    if (res.status === 401)
      return {
        service: "OpenAI",
        status: "failed",
        message: "API key invalid (401 Unauthorized)",
        testedAt: new Date(),
      };
    if (res.status === 429)
      return {
        service: "OpenAI",
        status: "connected",
        message: "API key valid — rate limited (429)",
        testedAt: new Date(),
      };
    return {
      service: "OpenAI",
      status: "failed",
      message: `HTTP ${res.status}`,
      testedAt: new Date(),
    };
  } catch (err) {
    return {
      service: "OpenAI",
      status: "failed",
      message: `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
      testedAt: new Date(),
    };
  }
}

/** Test ElevenLabs API key */
export async function testElevenLabsConnection(
  apiKey: string,
): Promise<IntegrationHealthResult> {
  if (!apiKey?.trim()) {
    return {
      service: "ElevenLabs",
      status: "not_configured",
      message: "API key not configured",
      testedAt: new Date(),
    };
  }
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": apiKey },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok)
      return {
        service: "ElevenLabs",
        status: "connected",
        message: "Connected — account verified",
        testedAt: new Date(),
      };
    if (res.status === 401)
      return {
        service: "ElevenLabs",
        status: "failed",
        message: "API key invalid (401 Unauthorized)",
        testedAt: new Date(),
      };
    return {
      service: "ElevenLabs",
      status: "failed",
      message: `HTTP ${res.status}`,
      testedAt: new Date(),
    };
  } catch (err) {
    return {
      service: "ElevenLabs",
      status: "failed",
      message: `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
      testedAt: new Date(),
    };
  }
}

/**
 * Test a specific service and return its status.
 * Used by the Settings page Test Connection buttons.
 */
export async function testServiceConnection(
  service: "litellm" | "listmonk" | "searxng" | "ollama",
  config: OpenSourceServiceConfig,
): Promise<ServiceStatus> {
  switch (service) {
    case "litellm": {
      if (!config.litellm.baseUrl) return "unconfigured";
      const adapter = new LiteLLMAdapter(
        config.litellm.baseUrl,
        config.litellm.apiKey,
      );
      return adapter.checkStatus();
    }
    case "listmonk": {
      if (!config.listmonk.baseUrl) return "unconfigured";
      const adapter = new ListmonkAdapter(
        config.listmonk.baseUrl,
        config.listmonk.username,
        config.listmonk.password,
      );
      return adapter.checkStatus();
    }
    case "searxng": {
      if (!config.searxng.baseUrl) return "unconfigured";
      const adapter = new SearXNGAdapter(config.searxng.baseUrl);
      return adapter.checkStatus();
    }
    case "ollama": {
      if (!config.ollama.baseUrl) return "unconfigured";
      const adapter = new OllamaAdapter(
        config.ollama.baseUrl,
        config.ollama.defaultModel,
      );
      return adapter.checkStatus();
    }
  }
}

/**
 * Routes AI calls for the Master Agent through the priority fallback chain:
 * 1. OmniRouter (OpenRouter) → 2. OpenAI (gpt-4o) → 3. Google Gemini (free tier) → 4. NVIDIA NIM
 * Each provider is attempted with a 15-second timeout; on failure the next is tried silently.
 */
export async function routeMasterAgentCall(
  prompt: string,
  keys: {
    openRouterKey?: string;
    openAIKey?: string;
    geminiApiKey?: string;
    nvidiaNimKey?: string;
  },
): Promise<{
  success: boolean;
  content: string;
  provider: string;
  fallbackUsed: boolean;
}> {
  const messages = [{ role: "user" as const, content: prompt }];
  let attemptIndex = 0;

  // Helper: create a 15-second AbortController signal
  function makeSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 15000);
    return controller.signal;
  }

  // 1. OmniRouter (OpenRouter)
  if (keys.openRouterKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keys.openRouterKey}`,
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages,
          stream: false,
        }),
        signal: makeSignal(),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices: { message: { content: string } }[];
        };
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return {
            success: true,
            content,
            provider: "OmniRouter (OpenRouter)",
            fallbackUsed: attemptIndex > 0,
          };
        }
      }
    } catch {
      // timeout or network error — try next
    }
    attemptIndex++;
  }

  // 2. OpenAI — gpt-4o
  if (keys.openAIKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keys.openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages,
          stream: false,
        }),
        signal: makeSignal(),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices: { message: { content: string } }[];
        };
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return {
            success: true,
            content,
            provider: "OpenAI (GPT-4o)",
            fallbackUsed: attemptIndex > 0,
          };
        }
      }
    } catch {
      // timeout or network error — try next
    }
    attemptIndex++;
  }

  // 3. Google Gemini — free tier (key optional)
  {
    const geminiKey = keys.geminiApiKey ?? "";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent${geminiKey ? `?key=${encodeURIComponent(geminiKey)}` : ""}`;
    try {
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
        signal: makeSignal(),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          candidates: { content: { parts: { text: string }[] } }[];
        };
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          return {
            success: true,
            content,
            provider: "Google Gemini (Flash)",
            fallbackUsed: attemptIndex > 0,
          };
        }
      }
    } catch {
      // timeout or network error — try next
    }
    attemptIndex++;
  }

  // 4. NVIDIA NIM — llama-3.1-8b-instruct
  if (keys.nvidiaNimKey) {
    try {
      const res = await fetch(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keys.nvidiaNimKey}`,
          },
          body: JSON.stringify({
            model: "meta/llama-3.1-8b-instruct",
            messages,
            stream: false,
          }),
          signal: makeSignal(),
        },
      );
      if (res.ok) {
        const data = (await res.json()) as {
          choices: { message: { content: string } }[];
        };
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          return {
            success: true,
            content,
            provider: "NVIDIA NIM (Llama 3.1)",
            fallbackUsed: attemptIndex > 0,
          };
        }
      }
    } catch {
      // timeout or network error
    }
  }

  // All providers failed
  return {
    success: false,
    content:
      "All AI providers unavailable. Please check your API key configuration.",
    provider: "none",
    fallbackUsed: false,
  };
}
