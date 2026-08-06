import {
  BRF_PROVIDER_ORDER,
  extractJsonValue,
  type BrfProviderId,
} from "../../../src/lib/brfIntelligencePolicy.ts";

export { BRF_PROVIDER_ORDER, extractJsonValue };
export type { BrfProviderId };

export type BrfIntelligenceTask =
  | "audit"
  | "content"
  | "strategy"
  | "orchestration"
  | "lead_scoring"
  | "general";

export type BrfResponseFormat = "text" | "json";

export interface BrfIntelligenceRequest {
  taskType: BrfIntelligenceTask;
  prompt: string;
  context?: Record<string, unknown>;
  systemPrompt?: string;
  responseFormat?: BrfResponseFormat;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  correlationId?: string;
  validateData?: (data: unknown) => unknown;
}

export interface BrfRouteAttempt {
  provider: BrfProviderId;
  model: string;
  status: "skipped" | "failed" | "succeeded";
  latencyMs: number;
  error?: string;
}

export interface BrfIntelligenceResult {
  provider: BrfProviderId;
  model: string;
  content: string;
  data: unknown;
  attempts: BrfRouteAttempt[];
  correlationId: string;
  completedAt: string;
}

export class BrfIntelligenceError extends Error {
  readonly code: "NO_PROVIDER_CONFIGURED" | "ALL_PROVIDERS_FAILED";
  readonly attempts: BrfRouteAttempt[];

  constructor(
    code: "NO_PROVIDER_CONFIGURED" | "ALL_PROVIDERS_FAILED",
    message: string,
    attempts: BrfRouteAttempt[],
  ) {
    super(message);
    this.name = "BrfIntelligenceError";
    this.code = code;
    this.attempts = attempts;
  }
}

interface ProviderOptions {
  temperature: number;
  maxTokens: number;
}

interface ProviderRoute {
  id: BrfProviderId;
  model: string;
  configured: boolean;
  timeoutMs: number;
  call: (
    messages: ChatMessage[],
    timeoutMs: number,
    options: ProviderOptions,
  ) => Promise<string>;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAiCompatibleResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
  output?: unknown;
  result?: unknown;
  error?: { message?: string } | string;
}

interface AnthropicResponse {
  content?: Array<{ type?: string; text?: string }>;
  error?: { message?: string } | string;
}

const DEFAULT_FAST_MODEL = "nvidia/nemotron-3-nano-30b-a3b";
const DEFAULT_REASONING_MODEL = "nvidia/nemotron-3-super-120b-a12b";
const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-chat-v3.1";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929";
const NVIDIA_DEFAULT_BASE_URL = "https://integrate.api.nvidia.com/v1";

function env(name: string): string {
  return Netlify.env.get(name)?.trim() ?? "";
}

function clamp(
  value: number | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value as number));
}

function modelForTask(taskType: BrfIntelligenceTask): string {
  const explicit = env("BRF_NEMOTRON_MODEL") || env("BEYOND_AI_MODEL");
  if (explicit) return explicit;
  if (taskType === "general" || taskType === "lead_scoring") {
    return env("NVIDIA_NEMOTRON_MODEL") || DEFAULT_FAST_MODEL;
  }
  return env("BRF_NEMOTRON_REASONING_MODEL") || DEFAULT_REASONING_MODEL;
}

function taskSystemPrompt(taskType: BrfIntelligenceTask): string {
  const common = `You are BRF Intelligence, called Nemo, the primary reasoning brain for Booked Ranked Fundable.
Use only supplied context and tool evidence. Separate observations, inferences, recommendations, and completed actions.
Never invent rankings, traffic, revenue, reviews, credentials, licenses, delivery status, platform publication, funding approval, or completed work.
State uncertainty and missing inputs. Do not claim that an external action occurred unless the supplied context proves it.`;

  const taskPrompts: Record<BrfIntelligenceTask, string> = {
    audit:
      "Perform a rigorous evidence-grounded audit. Prioritize material conversion, local visibility, trust, accessibility, and technical issues. Do not manufacture measurements.",
    content:
      "Create platform-native marketing content grounded in the supplied business, offer, audience, brand voice, funnel stage, and evidence. Avoid fabricated statistics, guarantees, or customer outcomes.",
    strategy:
      "Produce a prioritized business strategy with explicit reasoning, dependencies, risks, measurable next actions, and human approval gates.",
    orchestration:
      "Act as the mission controller. Decompose the request, synthesize supplied evidence, and return an executable plan. Tools and writes require explicit permission and truthful status reporting.",
    lead_scoring:
      "Score and explain lead intent only from supplied behavior and attributes. Do not invent contact details or claim outreach occurred.",
    general:
      "Answer the requested business-logic task accurately and concisely from the supplied context.",
  };

  return `${common}\n${taskPrompts[taskType]}`;
}

function stringifyContext(context: Record<string, unknown> | undefined): string {
  if (!context || Object.keys(context).length === 0) return "{}";
  const serialized = JSON.stringify(context);
  return serialized.length <= 120_000
    ? serialized
    : `${serialized.slice(0, 120_000)}\n[context truncated]`;
}

function extractContent(payload: OpenAiCompatibleResponse): string {
  const choice = payload.choices?.[0]?.message?.content;
  if (typeof choice === "string" && choice.trim()) return choice.trim();
  if (typeof payload.output === "string" && payload.output.trim()) {
    return payload.output.trim();
  }
  if (typeof payload.result === "string" && payload.result.trim()) {
    return payload.result.trim();
  }
  if (payload.output && typeof payload.output === "object") {
    return JSON.stringify(payload.output);
  }
  if (payload.result && typeof payload.result === "object") {
    return JSON.stringify(payload.result);
  }
  throw new Error("Provider returned no usable content.");
}

function errorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const error = (payload as { error?: unknown }).error;
  if (typeof error === "string" && error.trim()) return error.slice(0, 500);
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message || fallback).slice(
      0,
      500,
    );
  }
  return fallback;
}

async function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<{ response: Response; payload: unknown }> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  let payload: unknown = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { output: text };
  }
  return { response, payload };
}

function openAiCompatibleRoute(config: {
  id: Exclude<BrfProviderId, "nemo-agent" | "anthropic">;
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
  extraHeaders?: Record<string, string>;
  allowKeylessGateway?: boolean;
}): ProviderRoute {
  const normalizedBase = config.baseUrl.replace(/\/$/, "");
  const configured = Boolean(
    normalizedBase && (config.apiKey || config.allowKeylessGateway),
  );

  return {
    id: config.id,
    model: config.model,
    configured,
    timeoutMs: config.timeoutMs,
    async call(messages, timeoutMs, options) {
      const { response, payload } = await fetchJson(
        `${normalizedBase}/chat/completions`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(config.apiKey
              ? { authorization: `Bearer ${config.apiKey}` }
              : {}),
            ...config.extraHeaders,
          },
          body: JSON.stringify({
            model: config.model,
            messages,
            stream: false,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
          }),
        },
        timeoutMs,
      );
      if (!response.ok) {
        throw new Error(
          errorMessage(payload, `${config.id} returned ${response.status}.`),
        );
      }
      return extractContent(payload as OpenAiCompatibleResponse);
    },
  };
}

function nemoAgentRoute(): ProviderRoute {
  const baseUrl = env("NEMO_AGENT_BASE_URL").replace(/\/$/, "");
  const token = env("NEMO_AGENT_SERVICE_TOKEN");
  const pathValue = env("NEMO_AGENT_CHAT_PATH") || "/v1/chat/completions";
  const path = pathValue.startsWith("/") ? pathValue : `/${pathValue}`;

  return {
    id: "nemo-agent",
    model: "brf-agent",
    configured: Boolean(baseUrl && token),
    timeoutMs: 20_000,
    async call(messages, timeoutMs, options) {
      const { response, payload } = await fetchJson(
        `${baseUrl}${path}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "brf-agent",
            messages,
            stream: false,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
          }),
        },
        timeoutMs,
      );
      if (!response.ok) {
        throw new Error(
          errorMessage(
            payload,
            `NeMo Agent service returned ${response.status}.`,
          ),
        );
      }
      return extractContent(payload as OpenAiCompatibleResponse);
    },
  };
}

function anthropicRoute(): ProviderRoute {
  const baseUrl = (
    env("ANTHROPIC_BASE_URL") || "https://api.anthropic.com"
  ).replace(/\/$/, "");
  const apiKey = env("ANTHROPIC_API_KEY");
  const model =
    env("BRF_ANTHROPIC_FALLBACK_MODEL") || DEFAULT_ANTHROPIC_MODEL;
  const gatewayConfigured = Boolean(env("ANTHROPIC_BASE_URL"));

  return {
    id: "anthropic",
    model,
    configured: Boolean(apiKey || gatewayConfigured),
    timeoutMs: 12_000,
    async call(messages, timeoutMs, options) {
      const system = messages
        .filter((message) => message.role === "system")
        .map((message) => message.content)
        .join("\n");
      const userMessages = messages.filter(
        (message) => message.role !== "system",
      );
      const { response, payload } = await fetchJson(
        `${baseUrl}/v1/messages`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "anthropic-version": "2023-06-01",
            ...(apiKey ? { "x-api-key": apiKey } : {}),
          },
          body: JSON.stringify({
            model,
            system,
            messages: userMessages,
            max_tokens: options.maxTokens,
            temperature: options.temperature,
          }),
        },
        timeoutMs,
      );
      if (!response.ok) {
        throw new Error(
          errorMessage(payload, `Anthropic returned ${response.status}.`),
        );
      }
      const body = payload as AnthropicResponse;
      const content = (body.content ?? [])
        .filter((part) => part.type === "text")
        .map((part) => part.text ?? "")
        .join("")
        .trim();
      if (!content) throw new Error("Anthropic returned no usable content.");
      return content;
    },
  };
}

function routesFor(taskType: BrfIntelligenceTask): ProviderRoute[] {
  const nvidiaModel = modelForTask(taskType);
  const nvidiaBaseUrl = (
    env("NIM_BASE_URL") || NVIDIA_DEFAULT_BASE_URL
  ).replace(/\/$/, "");
  const openAiBaseUrl = (
    env("OPENAI_BASE_URL") || "https://api.openai.com/v1"
  ).replace(/\/$/, "");

  const routes: Record<BrfProviderId, ProviderRoute> = {
    "nemo-agent": nemoAgentRoute(),
    "nvidia-nim": openAiCompatibleRoute({
      id: "nvidia-nim",
      baseUrl: nvidiaBaseUrl,
      apiKey: env("NVIDIA_API_KEY"),
      model: nvidiaModel,
      timeoutMs: 20_000,
    }),
    "nvidia-nim-fast": openAiCompatibleRoute({
      id: "nvidia-nim-fast",
      baseUrl: nvidiaBaseUrl,
      apiKey:
        nvidiaModel === (env("NVIDIA_NEMOTRON_MODEL") || DEFAULT_FAST_MODEL)
          ? ""
          : env("NVIDIA_API_KEY"),
      model: env("NVIDIA_NEMOTRON_MODEL") || DEFAULT_FAST_MODEL,
      timeoutMs: 16_000,
    }),
    openrouter: openAiCompatibleRoute({
      id: "openrouter",
      baseUrl:
        env("OPENROUTER_BASE_URL") || "https://openrouter.ai/api/v1",
      apiKey: env("OPENROUTER_API_KEY"),
      model:
        env("BRF_OPENROUTER_FALLBACK_MODEL") || DEFAULT_OPENROUTER_MODEL,
      timeoutMs: 12_000,
      extraHeaders: {
        "http-referer": "https://bookedrankedfunded.org",
        "x-title": "Booked Ranked Fundable Intelligence",
      },
    }),
    openai: openAiCompatibleRoute({
      id: "openai",
      baseUrl: openAiBaseUrl,
      apiKey: env("OPENAI_API_KEY"),
      model: env("BRF_OPENAI_FALLBACK_MODEL") || DEFAULT_OPENAI_MODEL,
      timeoutMs: 12_000,
      allowKeylessGateway: Boolean(env("OPENAI_BASE_URL")),
    }),
    anthropic: anthropicRoute(),
  };

  return BRF_PROVIDER_ORDER.map((provider) => routes[provider]);
}

function sanitizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .slice(0, 500);
}

export async function runBrfIntelligence(
  request: BrfIntelligenceRequest,
): Promise<BrfIntelligenceResult> {
  const prompt = request.prompt.trim();
  if (!prompt) throw new Error("An intelligence prompt is required.");

  const responseFormat = request.responseFormat ?? "text";
  const options: ProviderOptions = {
    temperature: clamp(request.temperature, 0, 1, 0.2),
    maxTokens: Math.round(clamp(request.maxTokens, 128, 6000, 3000)),
  };
  const totalTimeoutMs = Math.round(
    clamp(request.timeoutMs, 5_000, 120_000, 50_000),
  );
  const correlationId =
    request.correlationId?.trim().slice(0, 120) || crypto.randomUUID();
  const start = Date.now();
  const attempts: BrfRouteAttempt[] = [];

  const systemPrompt = [
    taskSystemPrompt(request.taskType),
    request.systemPrompt?.trim(),
    responseFormat === "json"
      ? "Return valid JSON only, with no markdown fences or surrounding explanation."
      : "Return the requested result without claiming unsupported actions.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${prompt}\n\nStructured BRF context:\n${stringifyContext(request.context)}`,
    },
  ];

  for (const route of routesFor(request.taskType)) {
    if (!route.configured) {
      attempts.push({
        provider: route.id,
        model: route.model,
        status: "skipped",
        latencyMs: 0,
        error: "Provider is not configured.",
      });
      continue;
    }

    const remaining = totalTimeoutMs - (Date.now() - start);
    if (remaining < 1_000) break;
    const timeoutMs = Math.max(1_000, Math.min(route.timeoutMs, remaining));
    const routeStart = Date.now();

    try {
      const content = await route.call(messages, timeoutMs, options);
      const parsed =
        responseFormat === "json" ? extractJsonValue(content) : content;
      const data = request.validateData
        ? request.validateData(parsed)
        : parsed;
      attempts.push({
        provider: route.id,
        model: route.model,
        status: "succeeded",
        latencyMs: Date.now() - routeStart,
      });
      console.info(
        "brf_intelligence_route",
        JSON.stringify({
          correlationId,
          taskType: request.taskType,
          provider: route.id,
          model: route.model,
          attempts,
        }),
      );
      return {
        provider: route.id,
        model: route.model,
        content,
        data,
        attempts,
        correlationId,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      attempts.push({
        provider: route.id,
        model: route.model,
        status: "failed",
        latencyMs: Date.now() - routeStart,
        error: sanitizeError(error),
      });
    }
  }

  const configuredCount = attempts.filter(
    (attempt) => attempt.status !== "skipped",
  ).length;
  if (configuredCount === 0) {
    throw new BrfIntelligenceError(
      "NO_PROVIDER_CONFIGURED",
      "No BRF intelligence provider is configured.",
      attempts,
    );
  }

  console.error(
    "brf_intelligence_route_failed",
    JSON.stringify({ correlationId, taskType: request.taskType, attempts }),
  );

  throw new BrfIntelligenceError(
    "ALL_PROVIDERS_FAILED",
    "All configured BRF intelligence providers failed.",
    attempts,
  );
}
