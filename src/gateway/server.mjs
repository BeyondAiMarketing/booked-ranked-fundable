import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.GATEWAY_PORT || 8787);
const AUTH_TOKEN = process.env.GATEWAY_AUTH_TOKEN || "";
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 15000);
const RATE_LIMIT_PER_MINUTE = Number(process.env.RATE_LIMIT_PER_MINUTE || 120);
const CIRCUIT_BREAKER_THRESHOLD = Number(
  process.env.CIRCUIT_BREAKER_THRESHOLD || 3,
);
const CIRCUIT_BREAKER_COOLDOWN_MS = Number(
  process.env.CIRCUIT_BREAKER_COOLDOWN_MS || 60000,
);

const PROVIDERS = {
  openrouter: {
    enabled: !!process.env.OPENROUTER_API_KEY,
    baseUrl: (process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1")
      .replace(/\/$/, ""),
    model:
      process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
  },
  nvidia: {
    enabled: !!process.env.NVIDIA_API_KEY,
    baseUrl: (process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1")
      .replace(/\/$/, ""),
    model:
      process.env.NVIDIA_MODEL || "meta/llama-3.1-70b-instruct",
  },
  ollama: {
    enabled: !!process.env.OLLAMA_BASE_URL,
    baseUrl: (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(
      /\/$/,
      "",
    ),
    model: process.env.OLLAMA_MODEL || "llama3",
  },
  searxng: {
    enabled: !!process.env.SEARXNG_BASE_URL,
    baseUrl: (process.env.SEARXNG_BASE_URL || "").replace(/\/$/, ""),
  },
};

const providerState = new Map();
const rateLimitBuckets = new Map();

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Tenant-Id, X-Trace-Id",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(JSON.stringify(body));
}

function log(event, data = {}) {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      event,
      ...data,
    }),
  );
}

function ensureAuth(req) {
  if (!AUTH_TOKEN) return true;
  const authHeader = req.headers.authorization || "";
  return authHeader === "Bearer " + AUTH_TOKEN;
}

function rateLimitKey(req, body) {
  return (
    req.headers["x-tenant-id"] ||
    body?.tenantId ||
    req.socket.remoteAddress ||
    "anonymous"
  );
}

function enforceRateLimit(key) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key) || { count: 0, resetAt: now + 60000 };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + 60000;
  }
  bucket.count += 1;
  rateLimitBuckets.set(key, bucket);
  return bucket.count <= RATE_LIMIT_PER_MINUTE;
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function withTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  return fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

function isCircuitOpen(provider) {
  const state = providerState.get(provider);
  return !!state?.openUntil && Date.now() < state.openUntil;
}

function markProviderSuccess(provider) {
  providerState.set(provider, { failures: 0, openUntil: 0 });
}

function markProviderFailure(provider) {
  const current = providerState.get(provider) || { failures: 0, openUntil: 0 };
  const failures = current.failures + 1;
  providerState.set(provider, {
    failures,
    openUntil:
      failures >= CIRCUIT_BREAKER_THRESHOLD
        ? Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS
        : 0,
  });
}

function normalizeMessages(messages = [], prompt = "", systemPrompt = "") {
  if (Array.isArray(messages) && messages.length > 0) return messages;
  const normalized = [];
  if (systemPrompt) normalized.push({ role: "system", content: systemPrompt });
  if (prompt) normalized.push({ role: "user", content: prompt });
  return normalized;
}

function buildProviderChain(primaryProvider = "auto", fallbackOrder = []) {
  const envPrimary = process.env.PRIMARY_CHAT_PROVIDER || "openrouter";
  const chain = [
    primaryProvider === "auto" ? envPrimary : primaryProvider,
    ...fallbackOrder,
    ...(process.env.CHAT_FALLBACK_CHAIN || "openrouter,nvidia,ollama")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ];
  return [...new Set(chain)].filter((provider) => provider in PROVIDERS);
}

async function callOpenAiCompatible(provider, payload, traceId) {
  const config = PROVIDERS[provider];
  const apiKey =
    provider === "openrouter"
      ? process.env.OPENROUTER_API_KEY
      : process.env.NVIDIA_API_KEY;
  const endpoint = `${config.baseUrl}/chat/completions`;
  const res = await withTimeout(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: payload.model || config.model,
      messages: payload.messages,
      temperature: 0.3,
    }),
  });
  if (!res.ok) {
    throw new Error(`${provider} returned ${res.status}`);
  }
  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content || "",
    model: data.model || payload.model || config.model,
    traceId,
  };
}

async function callOllama(payload, traceId) {
  const config = PROVIDERS.ollama;
  const res = await withTimeout(`${config.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: payload.model || config.model,
      messages: payload.messages,
      stream: false,
    }),
  }, REQUEST_TIMEOUT_MS * 2);
  if (!res.ok) {
    throw new Error(`ollama returned ${res.status}`);
  }
  const data = await res.json();
  return {
    content: data.message?.content || "",
    model: payload.model || config.model,
    traceId,
  };
}

async function callWithRetry(provider, payload, traceId) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (provider === "openrouter" || provider === "nvidia") {
        return await callOpenAiCompatible(provider, payload, traceId);
      }
      if (provider === "ollama") {
        return await callOllama(payload, traceId);
      }
      throw new Error(`unsupported provider: ${provider}`);
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
}

async function executeChat(body, traceId) {
  const messages = normalizeMessages(body.messages, body.prompt, body.systemPrompt);
  if (!messages.length) {
    return {
      status: 400,
      body: { error: "messages or prompt is required", traceId },
    };
  }

  const chain = buildProviderChain(body.primaryProvider, body.fallbackOrder);
  const attemptedProviders = [];

  for (const provider of chain) {
    const config = PROVIDERS[provider];
    if (!config?.enabled || isCircuitOpen(provider)) continue;
    attemptedProviders.push(provider);
    try {
      const result = await callWithRetry(
        provider,
        { messages, model: body.model },
        traceId,
      );
      markProviderSuccess(provider);
      return {
        status: 200,
        body: {
          success: true,
          content: result.content,
          provider,
          fallbackUsed: attemptedProviders.length > 1,
          traceId,
          providerChain: attemptedProviders,
          model: result.model,
        },
      };
    } catch (error) {
      markProviderFailure(provider);
      log("provider_failure", {
        traceId,
        provider,
        message: error instanceof Error ? error.message : "unknown error",
      });
    }
  }

  return {
    status: 503,
    body: {
      success: false,
      content: "",
      provider: "gateway",
      fallbackUsed: attemptedProviders.length > 1,
      traceId,
      providerChain: attemptedProviders,
      error: "No configured chat provider succeeded",
    },
  };
}

async function executeSearch(body, traceId) {
  if (!body.query || typeof body.query !== "string") {
    return {
      status: 400,
      body: { error: "query is required", traceId },
    };
  }
  if (!PROVIDERS.searxng.enabled) {
    return {
      status: 503,
      body: {
        success: false,
        results: [],
        provider: "gateway",
        fallbackUsed: false,
        traceId,
        providerChain: [],
        error: "SearXNG is not configured",
      },
    };
  }

  const params = new URLSearchParams({
    q: body.query,
    format: "json",
    categories: body.categories || "general",
    language: body.language || "en",
  });
  const res = await withTimeout(
    `${PROVIDERS.searxng.baseUrl}/search?${params.toString()}`,
    {},
    REQUEST_TIMEOUT_MS,
  );
  if (!res.ok) {
    return {
      status: 503,
      body: {
        success: false,
        results: [],
        provider: "gateway",
        fallbackUsed: false,
        traceId,
        providerChain: ["searxng"],
        error: `searxng returned ${res.status}`,
      },
    };
  }
  const data = await res.json();
  const results = (data.results || []).slice(0, 10).map((item) => ({
    title: item.title || "",
    url: item.url || "",
    snippet: item.content || "",
    source: item.engine || "searxng",
  }));
  return {
    status: 200,
    body: {
      success: true,
      results,
      provider: "searxng",
      fallbackUsed: false,
      traceId,
      providerChain: ["searxng"],
    },
  };
}

async function providerHealth(traceId) {
  const checks = await Promise.all(
    Object.entries(PROVIDERS).map(async ([provider, config]) => {
      if (!config.enabled) {
        return { provider, status: "unconfigured" };
      }
      try {
        if (provider === "searxng") {
          const res = await withTimeout(
            `${config.baseUrl}/search?q=health&format=json`,
            {},
            3000,
          );
          return { provider, status: res.ok ? "connected" : "disconnected" };
        }
        if (provider === "ollama") {
          const res = await withTimeout(`${config.baseUrl}/api/tags`, {}, 3000);
          return { provider, status: res.ok ? "connected" : "disconnected" };
        }
        const res = await withTimeout(`${config.baseUrl}/models`, {
          headers: {
            Authorization:
              "Bearer " +
              (provider === "openrouter"
                ? process.env.OPENROUTER_API_KEY
                : process.env.NVIDIA_API_KEY),
          },
        }, 3000);
        return { provider, status: res.ok ? "connected" : "disconnected" };
      } catch {
        return { provider, status: "disconnected" };
      }
    }),
  );

  return {
    traceId,
    providers: checks,
  };
}

const server = createServer(async (req, res) => {
  const traceId = req.headers["x-trace-id"] || randomUUID();

  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  if (!ensureAuth(req)) {
    json(res, 401, { error: "Unauthorized", traceId });
    return;
  }

  try {
    if (req.method === "GET" && req.url === "/health") {
      json(res, 200, {
        status: "ok",
        traceId,
        providersConfigured: Object.fromEntries(
          Object.entries(PROVIDERS).map(([name, config]) => [name, !!config.enabled]),
        ),
      });
      return;
    }

    if (req.method === "GET" && req.url === "/provider-health") {
      json(res, 200, await providerHealth(traceId));
      return;
    }

    if (req.method !== "POST") {
      json(res, 404, { error: "Not found", traceId });
      return;
    }

    const body = await parseBody(req);
    const bucketKey = rateLimitKey(req, body);
    if (!enforceRateLimit(bucketKey)) {
      json(res, 429, { error: "Rate limit exceeded", traceId });
      return;
    }

    log("request_received", {
      traceId,
      path: req.url,
      tenantId: bucketKey,
    });

    if (req.url === "/chat/completions") {
      const result = await executeChat(body, traceId);
      json(res, result.status, result.body);
      return;
    }

    if (req.url === "/web-search") {
      const result = await executeSearch(body, traceId);
      json(res, result.status, result.body);
      return;
    }

    if (req.url === "/workflows/execute") {
      const result = await executeChat(body, traceId);
      json(res, result.status, result.body);
      return;
    }

    json(res, 404, { error: "Not found", traceId });
  } catch (error) {
    log("request_failed", {
      traceId,
      path: req.url,
      message: error instanceof Error ? error.message : "unknown error",
    });
    json(res, 500, { error: "Internal server error", traceId });
  }
});

server.listen(PORT, () => {
  log("gateway_started", {
    port: PORT,
    providersConfigured: Object.fromEntries(
      Object.entries(PROVIDERS).map(([name, config]) => [name, !!config.enabled]),
    ),
  });
});
