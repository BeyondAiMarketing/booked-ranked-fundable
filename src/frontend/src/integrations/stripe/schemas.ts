/**
 * Stripe schemas — PaymentIntent and webhook events.
 *
 * Docs:
 * - https://docs.stripe.com/api/payment_intents/create
 * - https://docs.stripe.com/webhooks
 * - https://docs.stripe.com/webhooks/signature
 * - https://docs.stripe.com/rate-limits
 */

export interface StripePaymentIntentRequest {
  amount: number;
  currency: string;
  automatic_payment_methods?: { enabled: boolean };
  metadata?: Record<string, string>;
  [key: string]: unknown;
}

export interface StripePaymentIntentResponse {
  id: string;
  object: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
  metadata?: Record<string, string>;
  [key: string]: unknown;
}

export interface StripeWebhookEvent {
  id: string;
  object: "event";
  type: string;
  created?: number;
  livemode?: boolean;
  data: {
    object: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
