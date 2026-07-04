import { describe, expect, it } from "vitest";
import {
  buildChatCompletionRequest,
  extractAssistantText,
  parseChatCompletionResponse,
} from "../../integrations/openai/client";
import { normalizeOpenAIError } from "../../integrations/openai/errors";

describe("OpenAI integration", () => {
  describe("buildChatCompletionRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() =>
        buildChatCompletionRequest({
          messages: [{ role: "user", content: "Hello" }],
        }),
      ).toThrow("Integrations are disabled");
    });
  });

  describe("parseChatCompletionResponse", () => {
    it("parses a valid chat completion response", () => {
      const data = {
        id: "chatcmpl_abc123",
        object: "chat.completion",
        created: 1710000000,
        model: "gpt-4.1-mini",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant" as const,
              content:
                "Hi, this is a quick follow-up about your roofing project.",
            },
            finish_reason: "stop" as const,
          },
        ],
        usage: {
          prompt_tokens: 42,
          completion_tokens: 23,
          total_tokens: 65,
        },
      };

      const result = parseChatCompletionResponse(data);

      expect(result.id).toBe("chatcmpl_abc123");
      expect(result.choices).toHaveLength(1);
      expect(result.choices[0].message.content).toContain("roofing");
    });

    it("throws when body is not an object", () => {
      expect(() => parseChatCompletionResponse("string")).toThrow(
        "Invalid OpenAI response",
      );
    });

    it("throws when id or choices are missing", () => {
      expect(() => parseChatCompletionResponse({})).toThrow(
        "Invalid OpenAI response",
      );
    });
  });

  describe("extractAssistantText", () => {
    it("extracts text from a valid response", () => {
      const response = {
        id: "1",
        object: "chat.completion",
        created: 1,
        model: "gpt-4",
        choices: [
          {
            index: 0,
            message: { role: "assistant" as const, content: "Hello!" },
            finish_reason: "stop" as const,
          },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      };

      expect(extractAssistantText(response)).toBe("Hello!");
    });

    it("returns empty string when no choices exist", () => {
      const response = {
        id: "1",
        object: "chat.completion",
        created: 1,
        model: "gpt-4",
        choices: [],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      };

      expect(extractAssistantText(response)).toBe("");
    });
  });

  describe("normalizeOpenAIError", () => {
    it("normalizes a rate limit error", () => {
      const body = {
        error: {
          message: "Rate limit reached for requests.",
          type: "rate_limit_error",
          param: null,
          code: "rate_limit_exceeded",
        },
      };

      const err = normalizeOpenAIError(429, body);

      expect(err.message).toBe("Rate limit reached for requests.");
      expect(err.code).toBe("rate_limit_exceeded");
      expect(err.statusCode).toBe(429);
      expect(err.retryable).toBe(true);
    });

    it("normalizes a generic HTTP error", () => {
      const err = normalizeOpenAIError(500, {});

      expect(err.message).toBe("OpenAI HTTP 500");
      expect(err.statusCode).toBe(500);
      expect(err.retryable).toBe(true);
    });

    it("marks 400 errors as non-retryable", () => {
      const err = normalizeOpenAIError(400, {});
      expect(err.retryable).toBe(false);
    });
  });
});
