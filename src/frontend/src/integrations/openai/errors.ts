/**
 * OpenAI error normalizer.
 * Converts OpenAI error responses into IntegrationError.
 */

import { isRetryableStatus } from "../_shared/retry";
import { IntegrationError } from "../_shared/types";
import type { OpenAIErrorBody } from "./schemas";

const PLATFORM = "openai" as const;

export function normalizeOpenAIError(
  statusCode: number,
  body: unknown,
): IntegrationError {
  const retryable = isRetryableStatus(statusCode);

  if (body && typeof body === "object") {
    const errBody = body as OpenAIErrorBody;
    if (errBody.error && typeof errBody.error === "object") {
      const msg = errBody.error.message ?? "OpenAI API error";
      const code = errBody.error.code ?? `http_${statusCode}`;
      return new IntegrationError(
        msg,
        PLATFORM,
        statusCode,
        code,
        retryable,
        body,
      );
    }
  }

  return new IntegrationError(
    `OpenAI HTTP ${statusCode}`,
    PLATFORM,
    statusCode,
    `http_${statusCode}`,
    retryable,
    body,
  );
}

export function normalizeOpenAIRateLimit(headers: Record<string, string>): {
  retryAfter?: number;
  message: string;
} {
  const retryAfter = headers["retry-after"];
  return {
    retryAfter: retryAfter ? Number.parseInt(retryAfter, 10) : undefined,
    message: "OpenAI rate limit reached",
  };
}
