import { describe, expect, it } from "vitest";
import {
  buildMailSendRequest,
  buildTemplateMailRequest,
  getEventIdempotencyKey,
  parseEventWebhook,
} from "../../integrations/sendgrid/client";

describe("SendGrid integration", () => {
  describe("parseEventWebhook", () => {
    it("parses a delivered event array", () => {
      const body = [
        {
          email: "customer@example.com",
          timestamp: 1710000000,
          event: "delivered",
          sg_event_id: "event-1",
          sg_message_id: "msg-1",
          category: ["lead-followup"],
          response: "250 OK",
        },
      ];

      const result = parseEventWebhook(body);

      expect(result).toHaveLength(1);
      expect(result[0].event).toBe("delivered");
      expect(result[0].email).toBe("customer@example.com");
      expect(result[0].sg_event_id).toBe("event-1");
    });

    it("parses a bounce event", () => {
      const body = [
        {
          email: "bad@example.com",
          timestamp: 1710000001,
          event: "bounce",
          bounce_classification: "Invalid Address",
          reason: "550 mailbox unavailable",
          status: "5.1.1",
          type: "bounce",
          sg_event_id: "event-2",
          sg_message_id: "msg-2",
        },
      ];

      const result = parseEventWebhook(body);
      expect(result[0].event).toBe("bounce");
      expect(result[0].reason).toBe("550 mailbox unavailable");
    });

    it("parses an open event", () => {
      const body = [
        {
          email: "customer@example.com",
          timestamp: 1710000002,
          event: "open",
          sg_machine_open: false,
          category: ["lead-followup"],
          sg_event_id: "event-3",
          sg_message_id: "msg-3",
          useragent: "Mozilla/5.0",
          ip: "192.0.2.1",
        },
      ];

      const result = parseEventWebhook(body);
      expect(result[0].event).toBe("open");
      expect(result[0].sg_machine_open).toBe(false);
    });

    it("throws when body is not an array", () => {
      expect(() => parseEventWebhook({})).toThrow("Invalid SendGrid webhook");
    });

    it("allows unknown fields via passthrough", () => {
      const body = [
        {
          email: "test@example.com",
          event: "delivered",
          sg_event_id: "evt-1",
          new_future_field: "value",
        },
      ];

      const result = parseEventWebhook(body);
      expect(result[0].new_future_field).toBe("value");
    });
  });

  describe("buildMailSendRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() =>
        buildMailSendRequest({
          personalizations: [{ to: [{ email: "test@example.com" }] }],
          from: { email: "noreply@example.com" },
        }),
      ).toThrow("Integrations are disabled");
    });
  });

  describe("getEventIdempotencyKey", () => {
    it("returns sg_event_id when available", () => {
      const event = {
        event: "delivered",
        sg_event_id: "evt-123",
        sg_message_id: "msg-123",
      };
      expect(getEventIdempotencyKey(event)).toBe("evt-123");
    });

    it("returns undefined when sg_event_id is missing", () => {
      const event = { event: "delivered" };
      expect(getEventIdempotencyKey(event)).toBeUndefined();
    });
  });

  describe("buildTemplateMailRequest", () => {
    it("builds a template mail request correctly", () => {
      const req = buildTemplateMailRequest(
        "customer@example.com",
        "d-template-id",
        { first_name: "David", cta_url: "https://example.com" },
        "noreply@example.com",
        "BRF",
      );

      expect(req.personalizations[0].to[0].email).toBe("customer@example.com");
      expect(req.personalizations[0].dynamic_template_data).toEqual({
        first_name: "David",
        cta_url: "https://example.com",
      });
      expect(req.from.email).toBe("noreply@example.com");
      expect(req.from.name).toBe("BRF");
      expect(req.template_id).toBe("d-template-id");
    });
  });
});
