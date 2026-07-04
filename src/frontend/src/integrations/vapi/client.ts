/**
 * Vapi client wrapper — assistant creation and Server URL event handling.
 * The backend performs the actual HTTP outcalls to Vapi's API.
 *
 * Feature flag: VAPI_INTEGRATION_ENABLED (always false by default)
 */

import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type {
  VapiAssistantRequest,
  VapiServerEvent,
  VapiToolCallResult,
  VapiToolCallsResponse,
} from "./schemas";

const PLATFORM = "vapi" as const;

/**
 * Parse a Vapi Server URL event.
 */
export function parseServerEvent(body: unknown): VapiServerEvent {
  if (!body || typeof body !== "object") {
    throw new IntegrationError("Invalid Vapi event: expected object", PLATFORM);
  }

  const b = body as Record<string, unknown>;

  if (!b.message || typeof b.message !== "object") {
    throw new IntegrationError("Invalid Vapi event: missing message", PLATFORM);
  }

  const msg = b.message as Record<string, unknown>;

  if (typeof msg.type !== "string") {
    throw new IntegrationError(
      "Invalid Vapi event: missing message.type",
      PLATFORM,
    );
  }

  return body as VapiServerEvent;
}

/**
 * Build an assistant-request response.
 * Must respond within 7.5 seconds end-to-end.
 * Prefer returning a saved assistantId for speed.
 */
export function buildAssistantRequestResponse(
  assistantId: string,
): VapiAssistantRequest {
  return { assistantId };
}

/**
 * Build a full assistant object response (slower than assistantId).
 */
export function buildAssistantObjectResponse(
  assistant: VapiAssistantRequest["assistant"],
): VapiAssistantRequest {
  return { assistant };
}

/**
 * Build a tool-calls response.
 */
export function buildToolCallsResponse(
  results: VapiToolCallResult[],
): VapiToolCallsResponse {
  return { results };
}

/**
 * Build an assistant creation request for the backend.
 * The backend will POST to https://api.vapi.ai/assistant
 */
export function buildCreateAssistantRequest(
  name: string,
  firstMessage: string,
  systemPrompt: string,
  modelProvider?: string,
  modelName?: string,
  voiceProvider?: string,
  voiceId?: string,
  serverUrl?: string,
): { action: "create_assistant"; payload: Record<string, unknown> } {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  return {
    action: "create_assistant",
    payload: {
      name,
      firstMessage,
      model: {
        provider: modelProvider ?? "openai",
        model: modelName ?? "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
        ],
      },
      voice: {
        provider: voiceProvider ?? "11labs",
        voiceId: voiceId ?? "default",
      },
      server: serverUrl ? { url: serverUrl } : undefined,
    },
  };
}

/**
 * Check if a Vapi event type requires a meaningful response.
 */
export function isResponseRequired(eventType: string): boolean {
  const responseTypes = [
    "assistant-request",
    "tool-calls",
    "transfer-destination-request",
    "knowledge-base-request",
  ];
  return responseTypes.includes(eventType);
}

/**
 * Extract the call ID from a Vapi event.
 */
export function getCallId(event: VapiServerEvent): string | undefined {
  return event.message.call?.id;
}
