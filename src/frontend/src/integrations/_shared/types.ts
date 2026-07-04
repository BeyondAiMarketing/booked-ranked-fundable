/**
 * Shared integration types for all 8 provider clients.
 * No secrets. No hardcoded credentials.
 */

export type IntegrationPlatform =
  | "n8n"
  | "openai"
  | "twilio"
  | "sendgrid"
  | "stripe"
  | "google_business_profile"
  | "serpapi"
  | "vapi";

export type IntegrationStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "pending"
  | "disabled";

export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly platform: IntegrationPlatform,
    public readonly statusCode?: number,
    public readonly code?: string,
    public readonly retryable: boolean = false,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "IntegrationError";
  }
}

export interface RateLimitInfo {
  limit?: string;
  remaining?: string;
  reset?: string;
  limitTokens?: string;
  remainingTokens?: string;
  resetTokens?: string;
}

export interface IntegrationApiLog {
  platform: IntegrationPlatform;
  operation: string;
  statusCode?: number;
  providerRequestId?: string;
  rateLimit?: RateLimitInfo;
  retryCount: number;
  errorCode?: string;
  errorMessage?: string;
  createdAt: Date;
}
