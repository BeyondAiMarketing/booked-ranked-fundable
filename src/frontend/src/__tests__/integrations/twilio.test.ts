import { describe, expect, it } from "vitest";
import {
  buildSendSmsRequest,
  getSmsIdempotencyKey,
  parseIncomingSms,
} from "../../integrations/twilio/client";

describe("Twilio integration", () => {
  describe("parseIncomingSms", () => {
    it("parses a valid incoming SMS webhook payload", () => {
      const formData = {
        MessageSid: "SM123",
        SmsSid: "SM123",
        From: "+15551234567",
        To: "+15557654321",
        Body: "I need a roof estimate",
        NumMedia: "0",
        MessageStatus: "received",
        NumSegments: "1",
      };

      const result = parseIncomingSms(formData);

      expect(result.MessageSid).toBe("SM123");
      expect(result.From).toBe("+15551234567");
      expect(result.To).toBe("+15557654321");
      expect(result.Body).toBe("I need a roof estimate");
      expect(result.NumMedia).toBe("0");
    });

    it("throws when From is missing", () => {
      const formData = {
        To: "+15557654321",
        Body: "test",
      };

      expect(() => parseIncomingSms(formData)).toThrow(
        "Invalid Twilio webhook",
      );
    });

    it("throws when To is missing", () => {
      const formData = {
        From: "+15551234567",
        Body: "test",
      };

      expect(() => parseIncomingSms(formData)).toThrow(
        "Invalid Twilio webhook",
      );
    });

    it("allows unknown fields via passthrough", () => {
      const formData = {
        MessageSid: "SM123",
        From: "+15551234567",
        To: "+15557654321",
        Body: "test",
        SomeNewField: "unexpected",
      };

      const result = parseIncomingSms(formData);
      expect(result.SomeNewField).toBe("unexpected");
    });
  });

  describe("buildSendSmsRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() =>
        buildSendSmsRequest({ to: "+15551234567", body: "Hello" }),
      ).toThrow("Integrations are disabled");
    });
  });

  describe("getSmsIdempotencyKey", () => {
    it("returns MessageSid when available", () => {
      const sms = parseIncomingSms({
        MessageSid: "SMabc",
        SmsMessageSid: "SMdef",
        From: "+1",
        To: "+2",
      });
      expect(getSmsIdempotencyKey(sms)).toBe("SMabc");
    });

    it("falls back to SmsMessageSid", () => {
      const sms = parseIncomingSms({
        SmsMessageSid: "SMdef",
        From: "+1",
        To: "+2",
      });
      expect(getSmsIdempotencyKey(sms)).toBe("SMdef");
    });

    it("returns undefined when no sid is present", () => {
      const sms = parseIncomingSms({
        From: "+1",
        To: "+2",
      });
      expect(getSmsIdempotencyKey(sms)).toBeUndefined();
    });
  });
});
