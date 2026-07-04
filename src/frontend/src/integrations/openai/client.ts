/**
 * OpenAI client wrapper — prepares chat completion requests for the backend.
 * The backend performs the actual HTTP outcall to api.openai.com.
 *
 * Feature flag: OPENAI_INTEGRATION_ENABLED (always false by default)
 */

import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "./schemas";

const PLATFORM = "openai" as const;

export interface ChatCompletionInput {
  model?: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Build a chat completion request payload for the backend.
 * The backend will call POST https://api.openai.com/v1/chat/completions
 * with the Authorization: Bearer header.
 */
export function buildChatCompletionRequest(
  input: ChatCompletionInput,
): OpenAIChatCompletionRequest {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  const messages = input.systemPrompt
    ? [
        { role: "system" as const, content: input.systemPrompt },
        ...input.messages,
      ]
    : input.messages;

  return {
    model: input.model ?? "gpt-4.1-mini",
    messages: messages.map((m) => ({
      role: m.role as "system" | "user" | "assistant",
      content: m.content,
    })),
    temperature: input.temperature ?? 0.3,
    max_tokens: input.maxTokens,
  };
}

/**
 * Parse a chat completion response from the backend.
 */
export function parseChatCompletionResponse(
  data: unknown,
): OpenAIChatCompletionResponse {
  if (!data || typeof data !== "object") {
    throw new IntegrationError(
      "Invalid OpenAI response: expected object",
      PLATFORM,
    );
  }

  const d = data as Record<string, unknown>;

  if (typeof d.id !== "string" || !Array.isArray(d.choices)) {
    throw new IntegrationError(
      "Invalid OpenAI response: missing id or choices",
      PLATFORM,
    );
  }

  return data as OpenAIChatCompletionResponse;
}

/**
 * Extract the assistant's text from a chat completion response.
 */
export function extractAssistantText(
  response: OpenAIChatCompletionResponse,
): string {
  const choice = response.choices[0];
  if (!choice || !choice.message) return "";
  return choice.message.content ?? "";
}
