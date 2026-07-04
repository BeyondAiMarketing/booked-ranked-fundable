/**
 * SerpApi schemas — search response.
 *
 * Docs:
 * - https://serpapi.com/search-api
 * - https://serpapi.com/api-status-and-error-codes
 * - https://serpapi.com/manage-api-key
 */

export interface SerpApiSearchMetadata {
  id?: string;
  status?: string;
  json_endpoint?: string;
  created_at?: string;
  processed_at?: string;
  [key: string]: unknown;
}

export interface SerpApiResponse {
  search_metadata?: SerpApiSearchMetadata;
  search_parameters?: Record<string, unknown>;
  organic_results?: Record<string, unknown>[];
  local_results?: Record<string, unknown>[];
  error?: string;
  [key: string]: unknown;
}
