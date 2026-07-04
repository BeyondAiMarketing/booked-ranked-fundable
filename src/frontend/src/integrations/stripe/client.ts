/**
 * Stripe client wrapper — prepares PaymentIntent requests and parses webhooks.
 * The backend performs the actual HTTP outcall to Stripe's API.
 *
 * Feature flag: STRIPE_INTEGRATION_ENABLED (always false by default)
 */

import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type {
  StripePaymentIntentRequest,
  StripePaymentIntentResponse,
  StripeWebhookEvent,
} from "./schemas";

const PLATFORM = "stripe" as const;

/**
 * Build a PaymentIntent creation request for the backend.
 * The backend will POST to https://api.stripe.com/v1/payment_intents
 */
export function buildPaymentIntentRequest(input: StripePaymentIntentRequest): {
  action: "create_payment_intent";
  payload: StripePaymentIntentRequest;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  if (!input.amount || input.amount <= 0) {
    throw new IntegrationError("amount must be a positive integer", PLATFORM);
  }

  if (!input.currency) {
    throw new IntegrationError("currency is required", PLATFORM);
  }

  return {
    action: "create_payment_intent",
    payload: {
      ...input,
      automatic_payment_methods: input.automatic_payment_methods ?? {
        enabled: true,
      },
    },
  };
}

/**
 * Parse a Stripe webhook event.
 * The backend must preserve the raw body for signature verification.
 */
export function parseWebhookEvent(body: unknown): StripeWebhookEvent {
  if (!body || typeof body !== "object") {
    throw new IntegrationError(
      "Invalid Stripe webhook: expected object",
      PLATFORM,
    );
  }

  const b = body as Record<string, unknown>;

  if (
    typeof b.id !== "string" ||
    b.object !== "event" ||
    typeof b.type !== "string"
  ) {
    throw new IntegrationError(
      "Invalid Stripe webhook: missing id, object, or type",
      PLATFORM,
    );
  }

  return body as StripeWebhookEvent;
}

/**
 * Extract the idempotency key from a Stripe webhook event.
 * Uses event.id for idempotency.
 */
export function getWebhookIdempotencyKey(event: StripeWebhookEvent): string {
  return event.id;
}

/**
 * Check if a webhook event type is one we care about.
 */
export function isHandledWebhookType(type: string): boolean {
  const handledTypes = [
    "payment_intent.created",
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "charge.refunded",
  ];
  return handledTypes.includes(type);
}
