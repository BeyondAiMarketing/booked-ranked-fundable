import { describe, expect, it } from "vitest";
import {
  buildSearchRequest,
  isSearchSuccessful,
  parseSearchResponse,
} from "../../integrations/serpapi/client";

describe("SerpApi integration", () => {
  describe("buildSearchRequest", () => {
    it("throws when integrations are disabled", () => {
      expect(() => buildSearchRequest({ q: "roofing contractor" })).toThrow(
        "Integrations are disabled",
      );
    });
  });

  describe("parseSearchResponse", () => {
    it("parses a successful search response", () => {
      const data = {
        search_metadata: {
          id: "search_123",
          status: "Success",
          created_at: "2026-06-21 18:30:00 UTC",
        },
        search_parameters: {
          engine: "google",
          q: "roofing contractor near me",
        },
        organic_results: [
          {
            position: 1,
            title: "Example Roofing",
            link: "https://example.com",
          },
        ],
        local_results: [
          { position: 1, title: "Local Roofer", rating: 4.8, reviews: 120 },
        ],
      };

      const result = parseSearchResponse(data);

      expect(result.search_metadata?.status).toBe("Success");
      expect(result.organic_results).toHaveLength(1);
      expect(result.local_results).toHaveLength(1);
    });

    it("throws on error response", () => {
      const data = {
        error:
          "Invalid API key. Your API key should be here: https://serpapi.com/manage-api-key",
      };

      expect(() => parseSearchResponse(data)).toThrow("Invalid API key");
    });

    it("throws when body is not an object", () => {
      expect(() => parseSearchResponse("string")).toThrow(
        "Invalid SerpApi response",
      );
    });

    it("allows unknown fields via passthrough", () => {
      const data = {
        search_metadata: { status: "Success" },
        new_future_field: "value",
        unknown_section: [{ id: 1 }],
      };

      const result = parseSearchResponse(data);
      expect(result.new_future_field).toBe("value");
      expect(result.unknown_section).toEqual([{ id: 1 }]);
    });
  });

  describe("isSearchSuccessful", () => {
    it("returns true for Success status", () => {
      const response = { search_metadata: { status: "Success" } };
      expect(isSearchSuccessful(response)).toBe(true);
    });

    it("returns false for non-Success status", () => {
      const response = { search_metadata: { status: "Processing" } };
      expect(isSearchSuccessful(response)).toBe(false);
    });

    it("returns false when search_metadata is missing", () => {
      const response = {};
      expect(isSearchSuccessful(response)).toBe(false);
    });
  });
});
