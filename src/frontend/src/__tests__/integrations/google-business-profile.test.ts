import { describe, expect, it } from "vitest";
import {
  buildLocalPostRequest,
  buildReviewReplyRequest,
  decodePubSubData,
  getPubSubEventId,
  parsePubSubPush,
} from "../../integrations/google-business-profile/client";

describe("Google Business Profile integration", () => {
  describe("parsePubSubPush", () => {
    it("parses a valid Pub/Sub push payload", () => {
      const body = {
        message: {
          data: btoa(JSON.stringify({ eventType: "NEW_REVIEW" })),
          messageId: "1234567890",
          publishTime: "2026-06-21T18:30:00Z",
          attributes: { eventType: "NEW_REVIEW" },
        },
        subscription:
          "projects/your-project/subscriptions/gbp-review-subscription",
      };

      const result = parsePubSubPush(body);

      expect(result.message.messageId).toBe("1234567890");
      expect(result.subscription).toContain("gbp-review-subscription");
    });

    it("throws when body is not an object", () => {
      expect(() => parsePubSubPush("string")).toThrow("Invalid Pub/Sub push");
    });

    it("throws when message is missing", () => {
      expect(() => parsePubSubPush({})).toThrow("Invalid Pub/Sub push");
    });

    it("allows unknown fields via passthrough", () => {
      const body = {
        message: {
          messageId: "123",
          new_future_field: "value",
        },
        subscription: "sub-1",
        extra_top_level: "data",
      };

      const result = parsePubSubPush(body);
      expect(result.message.new_future_field).toBe("value");
      expect(result.extra_top_level).toBe("data");
    });
  });

  describe("decodePubSubData", () => {
    it("decodes base64 JSON data", () => {
      const push = {
        message: {
          data: btoa(
            JSON.stringify({ eventType: "NEW_REVIEW", reviewId: "r1" }),
          ),
          messageId: "123",
        },
      };

      const decoded = decodePubSubData(push);
      expect(decoded).toEqual({ eventType: "NEW_REVIEW", reviewId: "r1" });
    });

    it("returns null when data is missing", () => {
      const push = { message: { messageId: "123" } };
      expect(decodePubSubData(push)).toBeNull();
    });

    it("returns null when data is invalid base64", () => {
      const push = {
        message: { data: "not-valid-base64!!!", messageId: "123" },
      };
      expect(decodePubSubData(push)).toBeNull();
    });
  });

  describe("getPubSubEventId", () => {
    it("returns message.messageId", () => {
      const push = {
        message: { messageId: "msg-123" },
      };
      expect(getPubSubEventId(push)).toBe("msg-123");
    });
  });

  describe("buildReviewReplyRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() =>
        buildReviewReplyRequest("acc-1", "loc-1", "rev-1", "Thanks!"),
      ).toThrow("Integrations are disabled");
    });
  });

  describe("buildLocalPostRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() =>
        buildLocalPostRequest("acc-1", "loc-1", { summary: "Free inspection" }),
      ).toThrow("Integrations are disabled");
    });
  });
});
