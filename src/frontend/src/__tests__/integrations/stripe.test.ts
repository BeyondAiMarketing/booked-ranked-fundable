import { describe, expect, it } from "vitest";
import {
  buildPaymentIntentRequest,
  getWebhookIdempotencyKey,
  isHandledWebhookType,
  parseWebhookEvent,
} from "../../integrations/stripe/client";

describe("Stripe integration", () => {
  describe("parseWebhookEvent", () => {
    it("parses a valid payment_intent.succeeded event", () => {
      const body = {
        id: "evt_123",
        object: "event",
        type: "payment_intent.succeeded",
        created: 1710000000,
        livemode: false,
        data: {
          object: {
            id: "pi_123",
            amount: 5000,
            currency: "usd",
            status: "succeeded",
            metadata: { lead_id: "lead_123" },
          },
        },
      };

      const result = parseWebhookEvent(body);

      expect(result.id).toBe("evt_123");
      expect(result.type).toBe("payment_intent.succeeded");
      expect(result.data.object.id).toBe("pi_123");
    });

    it("throws when body is not an object", () => {
      expect(() => parseWebhookEvent("string")).toThrow(
        "Invalid Stripe webhook",
      );
    });

    it("throws when id is missing", () => {
      expect(() =>
        parseWebhookEvent({ object: "event", type: "test" }),
      ).toThrow("Invalid Stripe webhook");
    });

    it("allows unknown fields via passthrough", () => {
      const body = {
        id: "evt_123",
        object: "event",
        type: "payment_intent.succeeded",
        new_future_field: "value",
        data: {
          object: { id: "pi_123" },
          extra: "data",
        },
      };

      const result = parseWebhookEvent(body);
      expect(result.new_future_field).toBe("value");
      expect(result.data.extra).toBe("data");
    });
  });

  describe("buildPaymentIntentRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() =>
        buildPaymentIntentRequest({ amount: 5000, currency: "usd" }),
      ).toThrow("Integrations are disabled");
    });
  });

  describe("getWebhookIdempotencyKey", () => {
    it("returns event.id", () => {
      const event = {
        id: "evt_123",
        object: "event" as const,
        type: "test",
        data: { object: {} },
      };
      expect(getWebhookIdempotencyKey(event)).toBe("evt_123");
    });
  });

  describe("isHandledWebhookType", () => {
    it("returns true for handled types", () => {
      expect(isHandledWebhookType("payment_intent.succeeded")).toBe(true);
      expect(isHandledWebhookType("payment_intent.payment_failed")).toBe(true);
      expect(isHandledWebhookType("charge.refunded")).toBe(true);
    });

    it("returns false for unhandled types", () => {
      expect(isHandledWebhookType("invoice.payment_succeeded")).toBe(false);
      expect(isHandledWebhookType("customer.created")).toBe(false);
    });
  });
});
