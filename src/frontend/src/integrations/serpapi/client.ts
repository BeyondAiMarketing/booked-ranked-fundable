/**
 * SerpApi client wrapper — prepares search requests for the backend.
 * The backend performs the actual HTTP outcall to serpapi.com.
 *
 * Feature flag: SERPAPI_INTEGRATION_ENABLED (always false by default)
 */

import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type { SerpApiResponse } from "./schemas";

const PLATFORM = "serpapi" as const;

export interface SerpApiSearchInput {
  engine?: string;
  q: string;
  location?: string;
  googleDomain?: string;
  hl?: string;
  gl?: string;
  num?: number;
  start?: number;
}

/**
 * Build a search request payload for the backend.
 * The backend will GET https://serpapi.com/search.json
 */
export function buildSearchRequest(input: SerpApiSearchInput): {
  action: "search";
  payload: SerpApiSearchInput;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  if (!input.q || typeof input.q !== "string") {
    throw new IntegrationError("q (query) is required", PLATFORM);
  }

  return {
    action: "search",
    payload: {
      engine: input.engine ?? "google",
      q: input.q,
      location: input.location,
      googleDomain: input.googleDomain,
      hl: input.hl ?? "en",
      gl: input.gl ?? "us",
      num: input.num ?? 10,
      start: input.start,
    },
  };
}

/**
 * Parse a SerpApi search response.
 */
export function parseSearchResponse(data: unknown): SerpApiResponse {
  if (!data || typeof data !== "object") {
    throw new IntegrationError(
      "Invalid SerpApi response: expected object",
      PLATFORM,
    );
  }

  const d = data as Record<string, unknown>;

  // SerpApi returns an error field on failure
  if (typeof d.error === "string") {
    throw new IntegrationError(d.error, PLATFORM, undefined, "serpapi_error");
  }

  return data as SerpApiResponse;
}

/**
 * Check if a SerpApi response indicates success.
 */
export function isSearchSuccessful(response: SerpApiResponse): boolean {
  return response.search_metadata?.status === "Success";
}
