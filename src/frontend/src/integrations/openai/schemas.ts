/**
 * OpenAI API schemas — chat completions.
 *
 * Docs:
 * - https://platform.openai.com/docs/api-reference/chat/create
 * - https://platform.openai.com/docs/api-reference/authentication
 * - https://developers.openai.com/api/docs/guides/rate-limits
 * - https://platform.openai.com/docs/guides/error-codes/api-errors
 */

export interface OpenAIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
  [key: string]: unknown;
}

export interface OpenAIChatCompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  [key: string]: unknown;
}

export interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  finish_reason: string;
  [key: string]: unknown;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  [key: string]: unknown;
}

export interface OpenAIChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
  [key: string]: unknown;
}

export interface OpenAIErrorBody {
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
