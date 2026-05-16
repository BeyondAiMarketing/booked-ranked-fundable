// Open Source Service Integration types
// These extend the existing integration hub with optional self-hosted service adapters

export type ServiceStatus =
  | "connected"
  | "disconnected"
  | "unconfigured"
  | "testing";

export interface OpenSourceServiceConfig {
  litellm: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    primaryModel: string;
    fallbackModel: string;
    status: ServiceStatus;
  };
  listmonk: {
    enabled: boolean;
    baseUrl: string;
    username: string;
    password: string;
    status: ServiceStatus;
  };
  searxng: {
    enabled: boolean;
    baseUrl: string;
    status: ServiceStatus;
  };
  ollama: {
    enabled: boolean;
    baseUrl: string;
    defaultModel: string;
    status: ServiceStatus;
  };
}

export interface AIRouteResult {
  success: boolean;
  content: string;
  provider: "ollama" | "litellm" | "openai" | "claude" | "degraded";
  fallbackUsed: boolean;
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  templateId?: string;
}

export interface EmailRouteResult {
  success: boolean;
  provider: "custom" | "listmonk" | "caffeine_native";
  fallbackUsed: boolean;
  messageId?: string;
  error?: string;
  warmEmailEnabled: boolean;
  warmEmailProvider: "caffeine_native";
}

/**
 * routeEmail — determines the correct sending provider for a given sequence type.
 * - cold sequences → custom SMTP / Listmonk (NEVER Caffeine native)
 * - warm/transactional sequences → Caffeine native (post opt-in recipients only)
 */
export function routeEmail(
  sequenceType: "cold" | "warm" | "transactional",
  listmonkEnabled: boolean,
): EmailRouteResult {
  if (sequenceType === "cold") {
    return {
      success: true,
      provider: listmonkEnabled ? "listmonk" : "custom",
      fallbackUsed: false,
      warmEmailEnabled: false,
      warmEmailProvider: "caffeine_native",
    };
  }
  // warm and transactional always go through Caffeine native
  return {
    success: true,
    provider: "caffeine_native",
    fallbackUsed: false,
    warmEmailEnabled: true,
    warmEmailProvider: "caffeine_native",
  };
}

export interface SearchRouteResult {
  success: boolean;
  results: { title: string; url: string; snippet: string; source: string }[];
  provider: "searxng" | "google_places" | "cached";
  fallbackUsed: boolean;
}

export const defaultOpenSourceConfig: OpenSourceServiceConfig = {
  litellm: {
    enabled: false,
    baseUrl: "",
    apiKey: "",
    primaryModel: "ollama/llama3",
    fallbackModel: "gpt-4o-mini",
    status: "unconfigured",
  },
  listmonk: {
    enabled: false,
    baseUrl: "",
    username: "",
    password: "",
    status: "unconfigured",
  },
  searxng: {
    enabled: false,
    baseUrl: "",
    status: "unconfigured",
  },
  ollama: {
    enabled: false,
    baseUrl: "http://localhost:11434",
    defaultModel: "llama3",
    status: "unconfigured",
  },
};
