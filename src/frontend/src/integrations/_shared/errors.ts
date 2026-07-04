/**
 * Error normalization helpers for integration clients.
 * Converts provider-specific errors into IntegrationError.
 */

import { isRetryableStatus } from "./retry";
import { IntegrationError, type IntegrationPlatform } from "./types";

export interface NormalizedError {
  message: string;
  code?: string;
  statusCode?: number;
  retryable: boolean;
  details?: unknown;
}

export function normalizeError(
  error: unknown,
  platform: IntegrationPlatform,
): IntegrationError {
  if (error instanceof IntegrationError) {
    return error;
  }

  if (error instanceof Error) {
    return new IntegrationError(
      error.message,
      platform,
      undefined,
      undefined,
      true,
      error,
    );
  }

  const msg =
    typeof error === "string" ? error : "An unknown integration error occurred";

  return new IntegrationError(msg, platform, undefined, undefined, true, error);
}

export function normalizeHttpError(
  response: Response,
  platform: IntegrationPlatform,
  body?: unknown,
): IntegrationError {
  const statusCode = response.status;
  const retryable = isRetryableStatus(statusCode);

  let message = `HTTP ${statusCode}`;
  let code: string | undefined;

  if (body && typeof body === "object") {
    const errBody = body as Record<string, unknown>;
    if (typeof errBody.error === "string") {
      message = errBody.error;
    } else if (
      errBody.error &&
      typeof errBody.error === "object" &&
      "message" in (errBody.error as Record<string, unknown>)
    ) {
      message = String((errBody.error as Record<string, unknown>).message);
      if ("code" in (errBody.error as Record<string, unknown>)) {
        code = String((errBody.error as Record<string, unknown>).code);
      }
    }
  }

  return new IntegrationError(
    message,
    platform,
    statusCode,
    code,
    retryable,
    body,
  );
}

export function extractRateLimitHeaders(headers: Headers): {
  limit?: string;
  remaining?: string;
  reset?: string;
  limitTokens?: string;
  remainingTokens?: string;
  resetTokens?: string;
} {
  return {
    limit: headers.get("x-ratelimit-limit-requests") ?? undefined,
    remaining: headers.get("x-ratelimit-remaining-requests") ?? undefined,
    reset: headers.get("x-ratelimit-reset-requests") ?? undefined,
    limitTokens: headers.get("x-ratelimit-limit-tokens") ?? undefined,
    remainingTokens: headers.get("x-ratelimit-remaining-tokens") ?? undefined,
    resetTokens: headers.get("x-ratelimit-reset-tokens") ?? undefined,
  };
}
