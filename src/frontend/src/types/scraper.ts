// Web Scraper Tool — TypeScript type definitions
// Maps 1:1 to backend Motoko contracts in the webScraper module

export type SelectorType = "css" | "xpath";
export type ScrapeMode = "static" | "dynamic" | "stealth";
export type OutputFormat = "text" | "html" | "both";
export type ScrapeErrorKind =
  | "timeout"
  | "robotsBlocked"
  | "invalidUrl"
  | "invalidSelector"
  | "networkError"
  | "dynamicContent"
  | "tooManyRequests";
export type ScrapeStatus = "pending" | "success" | "failed";

export interface ScrapeItem {
  text: string | null;
  html: string | null;
  href: string | null;
  src: string | null;
  attributes: [string, string][];
}

export interface ScrapedLead {
  businessName: string | null;
  email: string | null;
  phone: string | null;
  sourceUrl: string;
  extractedAt: bigint;
}

export interface ScrapeRequest {
  url: string;
  selector: string;
  selectorType: SelectorType;
  outputFormat: OutputFormat;
  limit: number;
  waitSelectorMs: number;
}

export interface ScrapeResult {
  ok: boolean;
  requestUrl: string;
  finalUrl: string;
  httpStatus: number | null;
  items: ScrapeItem[];
  leads: ScrapedLead[];
  isDynamic: boolean;
  error: ScrapeErrorKind | null;
  errorMessage: string | null;
  durationMs: number;
  scrapedAt: bigint;
}

export interface ScrapeRecord {
  id: number;
  tenantId: string;
  request: ScrapeRequest;
  result: ScrapeResult;
  robotsChecked: boolean;
  robotsAllowed: boolean;
  createdAt: bigint;
}

export interface BatchScrapeRequest {
  urls: string[];
  selector: string;
  selectorType: SelectorType;
  outputFormat: OutputFormat;
  limitPerUrl: number;
}

export interface BatchScrapeUrlResult {
  ok: boolean;
  url: string;
  result: ScrapeResult | null;
  error: string | null;
}

export interface BatchScrapeResult {
  ok: boolean;
  count: number;
  results: BatchScrapeUrlResult[];
}

export interface RobotsCheckResult {
  url: string;
  allowed: boolean;
  checkedAt: bigint;
  note: string | null;
}

export interface LeadExtractionResult {
  leads: ScrapedLead[];
  count: number;
}

// ─── UI-only helpers ──────────────────────────────────────────────────────────

export interface ScrapePreset {
  id: string;
  name: string;
  description: string;
  url: string;
  selector: string;
  selectorType: SelectorType;
  outputFormat: OutputFormat;
  limit: number;
  category: "leads" | "content" | "ecommerce" | "research" | "custom";
}

export interface ScrapeHistoryEntry extends ScrapeRecord {
  statusLabel: ScrapeStatus;
}
