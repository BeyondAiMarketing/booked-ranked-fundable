import { describe, expect, it } from "vitest";
import {
  buildAssistantRequestResponse,
  buildCreateAssistantRequest,
  buildToolCallsResponse,
  getCallId,
  isResponseRequired,
  parseServerEvent,
} from "../../integrations/vapi/client";

describe("Vapi integration", () => {
  describe("parseServerEvent", () => {
    it("parses a status-update event", () => {
      const body = {
        message: {
          type: "status-update",
          status: "in-progress",
          call: { id: "call_123" },
          timestamp: "2026-06-21T18:30:00Z",
        },
      };

      const result = parseServerEvent(body);

      expect(result.message.type).toBe("status-update");
      expect(result.message.call?.id).toBe("call_123");
    });

    it("parses a transcript event", () => {
      const body = {
        message: {
          type: "transcript",
          role: "user",
          transcriptType: "final",
          transcript: "I need a roof estimate.",
          call: { id: "call_123" },
        },
      };

      const result = parseServerEvent(body);
      expect(result.message.transcript).toBe("I need a roof estimate.");
    });

    it("parses a tool-calls event", () => {
      const body = {
        message: {
          type: "tool-calls",
          call: { id: "call_123" },
          toolCallList: [
            {
              id: "tool_call_123",
              name: "createLead",
              parameters: {
                name: "David",
                phone: "+15551234567",
                service: "roof inspection",
              },
            },
          ],
        },
      };

      const result = parseServerEvent(body);
      expect(result.message.toolCallList).toHaveLength(1);
      expect(result.message.toolCallList?.[0].name).toBe("createLead");
    });

    it("parses an end-of-call-report event", () => {
      const body = {
        message: {
          type: "end-of-call-report",
          endedReason: "customer-ended-call",
          call: { id: "call_123" },
          artifact: {
            recordingUrl: "https://example.com/recording.mp3",
            transcript: "Customer asked for a roof inspection.",
            messages: [],
          },
        },
      };

      const result = parseServerEvent(body);
      expect(result.message.endedReason).toBe("customer-ended-call");
      expect(result.message.artifact?.recordingUrl).toBe(
        "https://example.com/recording.mp3",
      );
    });

    it("throws when body is not an object", () => {
      expect(() => parseServerEvent("string")).toThrow("Invalid Vapi event");
    });

    it("throws when message is missing", () => {
      expect(() => parseServerEvent({})).toThrow("Invalid Vapi event");
    });

    it("throws when message.type is missing", () => {
      expect(() => parseServerEvent({ message: {} })).toThrow(
        "Invalid Vapi event",
      );
    });

    it("allows unknown fields via passthrough", () => {
      const body = {
        message: {
          type: "status-update",
          call: { id: "call_123" },
          new_future_field: "value",
        },
        extra_top_level: "data",
      };

      const result = parseServerEvent(body);
      expect(result.message.new_future_field).toBe("value");
      expect(result.extra_top_level).toBe("data");
    });
  });

  describe("buildAssistantRequestResponse", () => {
    it("returns assistantId for fast response", () => {
      const result = buildAssistantRequestResponse("assistant-123");
      expect(result.assistantId).toBe("assistant-123");
    });
  });

  describe("buildToolCallsResponse", () => {
    it("returns results array", () => {
      const results = [
        {
          name: "createLead",
          toolCallId: "tc-1",
          result: '{"leadId":"lead_123"}',
        },
      ];
      const response = buildToolCallsResponse(results);
      expect(response.results).toHaveLength(1);
      expect(response.results[0].toolCallId).toBe("tc-1");
    });
  });

  describe("buildCreateAssistantRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() =>
        buildCreateAssistantRequest("Roofing Bot", "Hi!", "You qualify leads."),
      ).toThrow("Integrations are disabled");
    });
  });

  describe("isResponseRequired", () => {
    it("returns true for assistant-request", () => {
      expect(isResponseRequired("assistant-request")).toBe(true);
    });

    it("returns true for tool-calls", () => {
      expect(isResponseRequired("tool-calls")).toBe(true);
    });

    it("returns false for status-update", () => {
      expect(isResponseRequired("status-update")).toBe(false);
    });

    it("returns false for transcript", () => {
      expect(isResponseRequired("transcript")).toBe(false);
    });
  });

  describe("getCallId", () => {
    it("returns call id from event", () => {
      const event = {
        message: {
          type: "status-update",
          call: { id: "call_123" },
        },
      };
      expect(getCallId(event)).toBe("call_123");
    });

    it("returns undefined when call is missing", () => {
      const event = { message: { type: "status-update" } };
      expect(getCallId(event)).toBeUndefined();
    });
  });
});
