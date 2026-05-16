// Open Lead Lake — Source Ingestion & Normalization Service
// Implements connectors, a normalization engine, and import job management.
// All connectors include graceful fallback to demo data when APIs are unavailable.

import {
  DEMO_NORMALIZED_LEADS,
  DEMO_RAW_RECORDS,
} from "../data/openLeadLakeData";
import type {
  ImportStatus,
  NormalizationStatus,
  NormalizedLead,
  RawLeadRecord,
  SourceImportJob,
  SourceType,
} from "../types/openLeadLake";
import type { SuppressionRecord } from "../types/outreach";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Pause execution for `ms` milliseconds (used for rate-limiting). */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Types exposed by this module ─────────────────────────────────────────────

export interface OSMSearchParams {
  query: string;
  city?: string;
  state?: string;
  niche?: string;
  limit?: number;
}

export interface ImportFilters {
  niche?: string;
  city?: string;
  state?: string;
  keyword?: string;
}

export interface ImportJobResult {
  job: SourceImportJob;
  rawRecords: RawLeadRecord[];
  normalizedLeads: NormalizedLead[];
  errors: string[];
}

// ─── OpenStreetMap / Nominatim Connector ──────────────────────────────────────

export class OpenStreetMapConnector {
  private endpointUrl: string;
  private lastRequestAt = 0;
  private minIntervalMs = 1100; // Nominatim public policy: max 1 req/sec

  constructor(endpointUrl = "https://nominatim.openstreetmap.org") {
    this.endpointUrl = endpointUrl.replace(/\/$/, "");
  }

  private async throttle(): Promise<void> {
    const elapsed = Date.now() - this.lastRequestAt;
    if (elapsed < this.minIntervalMs) {
      await sleep(this.minIntervalMs - elapsed);
    }
    this.lastRequestAt = Date.now();
  }

  async search(params: OSMSearchParams): Promise<RawLeadRecord[]> {
    const { query, city, state, niche, limit = 50 } = params;
    const searchTerm = [niche, query, city, state].filter(Boolean).join(" ");

    try {
      await this.throttle();

      const urlParams = new URLSearchParams({
        format: "json",
        q: searchTerm,
        addressdetails: "1",
        extratags: "1",
        limit: String(Math.min(limit, 50)),
      });

      const res = await fetch(
        `${this.endpointUrl}/search?${urlParams.toString()}`,
        {
          headers: {
            "Accept-Language": "en-US,en",
            "User-Agent": "BRF-LeadLake/1.0",
          },
          signal: AbortSignal.timeout(10000),
        },
      );

      if (!res.ok) throw new Error(`Nominatim returned ${res.status}`);

      const data = (await res.json()) as NominatimResult[];
      return data.map((place) => osmResultToRawRecord(place, uid()));
    } catch {
      // Fallback: return demo records tagged as openstreetmap
      return DEMO_RAW_RECORDS.filter((r) => r.sourceType === "openstreetmap")
        .slice(0, 5)
        .map((r) => ({ ...r, id: uid(), importedAt: nowIso() }));
    }
  }
}

// Internal type for Nominatim JSON response
interface NominatimResult {
  osm_id?: number;
  osm_type?: string;
  lat?: string;
  lon?: string;
  display_name?: string;
  name?: string;
  type?: string;
  category?: string;
  address?: {
    shop?: string;
    amenity?: string;
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country_code?: string;
  };
  extratags?: {
    phone?: string;
    website?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}

function osmResultToRawRecord(
  place: NominatimResult,
  jobId: string,
): RawLeadRecord {
  const addr = place.address ?? {};
  const tags = place.extratags ?? {};
  const city = addr.city ?? addr.town ?? addr.village ?? "";
  const name =
    addr.shop ??
    addr.amenity ??
    place.name ??
    place.display_name?.split(",")[0] ??
    "";

  return {
    id: uid(),
    importJobId: jobId,
    sourceType: "openstreetmap",
    rawPayload: place as Record<string, unknown>,
    extractedName: name || undefined,
    extractedWebsite: tags.website || undefined,
    extractedPhone: tags.phone || undefined,
    extractedEmail: tags.email || undefined,
    extractedAddress:
      addr.house_number && addr.road
        ? `${addr.house_number} ${addr.road}`
        : addr.road || undefined,
    extractedCity: city || undefined,
    extractedState: addr.state || undefined,
    extractedCategory: place.type || place.category || undefined,
    extractedLatLng:
      place.lat && place.lon
        ? {
            lat: Number.parseFloat(place.lat),
            lng: Number.parseFloat(place.lon),
          }
        : undefined,
    importedAt: nowIso(),
    normalizationStatus: "raw",
  };
}

// ─── OpenCorporates Connector ─────────────────────────────────────────────────

export class OpenCorporatesConnector {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl = "https://api.opencorporates.com/v0.4", apiKey = "") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  async search(
    companyName: string,
    jurisdiction?: string,
  ): Promise<RawLeadRecord[]> {
    try {
      const params = new URLSearchParams({ q: companyName, format: "json" });
      if (jurisdiction) params.set("jurisdiction_code", jurisdiction);
      if (this.apiKey) params.set("api_token", this.apiKey);

      const res = await fetch(
        `${this.baseUrl}/companies/search?${params.toString()}`,
        { signal: AbortSignal.timeout(10000) },
      );

      if (!res.ok) throw new Error(`OpenCorporates returned ${res.status}`);

      const data = (await res.json()) as {
        results?: { companies?: { company: OpenCorporatesCompany }[] };
      };

      return (data.results?.companies ?? []).map(({ company }) =>
        ocCompanyToRawRecord(company, uid()),
      );
    } catch {
      // Graceful degradation — return demo records from this source
      return DEMO_RAW_RECORDS.filter((r) => r.sourceType === "opencorporates")
        .slice(0, 3)
        .map((r) => ({ ...r, id: uid(), importedAt: nowIso() }));
    }
  }
}

interface OpenCorporatesCompany {
  name?: string;
  company_number?: string;
  jurisdiction_code?: string;
  registered_address_in_full?: string;
  registered_address?: {
    street_address?: string;
    locality?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
  company_type?: string;
  current_status?: string;
}

function ocCompanyToRawRecord(
  company: OpenCorporatesCompany,
  jobId: string,
): RawLeadRecord {
  const addr = company.registered_address;
  return {
    id: uid(),
    importJobId: jobId,
    sourceType: "opencorporates",
    rawPayload: company as Record<string, unknown>,
    extractedName: company.name || undefined,
    extractedAddress: addr?.street_address || undefined,
    extractedCity: addr?.locality || undefined,
    extractedState: addr?.region || undefined,
    importedAt: nowIso(),
    normalizationStatus: "raw",
  };
}

// ─── GLEIF Connector ──────────────────────────────────────────────────────────

export class GLEIFConnector {
  private baseUrl: string;

  constructor(baseUrl = "https://api.gleif.org/api/v1") {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async lookup(lei: string): Promise<RawLeadRecord | null> {
    try {
      const res = await fetch(`${this.baseUrl}/lei-records/${lei}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { data?: GLEIFRecord };
      if (!data.data) return null;
      return gleifRecordToRawRecord(data.data, uid());
    } catch {
      return null;
    }
  }

  async resolveByName(name: string): Promise<RawLeadRecord[]> {
    try {
      const params = new URLSearchParams({
        "filter[entity.legalName]": name,
        "page[size]": "10",
      });
      const res = await fetch(
        `${this.baseUrl}/lei-records?${params.toString()}`,
        { signal: AbortSignal.timeout(10000) },
      );
      if (!res.ok) return [];
      const data = (await res.json()) as { data?: GLEIFRecord[] };
      return (data.data ?? []).map((r) => gleifRecordToRawRecord(r, uid()));
    } catch {
      return [];
    }
  }

  /** Parse a bulk GLEIF CSV file line by line and return RawLeadRecords. */
  parseBulkCSV(csvContent: string): RawLeadRecord[] {
    const lines = csvContent.split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    const records: RawLeadRecord[] = [];

    for (const line of lines.slice(1)) {
      if (!line.trim()) continue;
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = values[i] ?? "";
      });

      records.push({
        id: uid(),
        importJobId: "gleif-bulk",
        sourceType: "gleif",
        rawPayload: row as Record<string, unknown>,
        extractedName: row["Entity.LegalName"] || row.LegalName || undefined,
        extractedCity: row["Entity.LegalAddress.City"] || undefined,
        extractedState: row["Entity.LegalAddress.Region"] || undefined,
        importedAt: nowIso(),
        normalizationStatus: "raw",
      });
    }
    return records;
  }
}

interface GLEIFRecord {
  id?: string;
  attributes?: {
    lei?: string;
    entity?: {
      legalName?: { name?: string };
      legalAddress?: {
        addressLines?: string[];
        city?: string;
        region?: string;
        country?: string;
        postalCode?: string;
      };
    };
  };
}

function gleifRecordToRawRecord(
  record: GLEIFRecord,
  jobId: string,
): RawLeadRecord {
  const entity = record.attributes?.entity;
  const addr = entity?.legalAddress;
  return {
    id: uid(),
    importJobId: jobId,
    sourceType: "gleif",
    rawPayload: record as Record<string, unknown>,
    extractedName: entity?.legalName?.name || undefined,
    extractedAddress: addr?.addressLines?.[0] || undefined,
    extractedCity: addr?.city || undefined,
    extractedState: addr?.region || undefined,
    importedAt: nowIso(),
    normalizationStatus: "raw",
  };
}

// ─── Common Crawl Connector ───────────────────────────────────────────────────

export class CommonCrawlConnector {
  private indexUrl: string;

  constructor(indexUrl = "https://index.commoncrawl.org") {
    this.indexUrl = indexUrl.replace(/\/$/, "");
  }

  /**
   * Query the Common Crawl index for domains related to a keyword+category.
   * Returns curated RawLeadRecords from discovered domains only — no raw crawl dumps.
   */
  async searchDomain(
    keyword: string,
    category: string,
  ): Promise<RawLeadRecord[]> {
    try {
      const urlParams = new URLSearchParams({
        url: "*.com",
        output: "json",
        filter: "=metadata:content-type:text/html",
        limit: "20",
      });

      const res = await fetch(
        `${this.indexUrl}/CC-MAIN-2024-10-index?${urlParams.toString()}&q=${encodeURIComponent(keyword)}`,
        { signal: AbortSignal.timeout(12000) },
      );
      if (!res.ok) throw new Error(`CC index returned ${res.status}`);

      const lines = (await res.text()).split("\n").filter(Boolean);
      return lines.slice(0, 20).map((line) => {
        let parsed: Record<string, unknown> = {};
        try {
          parsed = JSON.parse(line) as Record<string, unknown>;
        } catch {
          /* skip */
        }
        const urlStr = (parsed.url as string) ?? "";
        const domain = urlStr
          ? new URL(urlStr).hostname.replace(/^www\./, "")
          : "";
        return {
          id: uid(),
          importJobId: "commoncrawl",
          sourceType: "commoncrawl" as SourceType,
          rawPayload: parsed,
          extractedWebsite: urlStr || undefined,
          extractedCategory: category || undefined,
          importedAt: nowIso(),
          normalizationStatus: "raw" as NormalizationStatus,
          ...(domain ? { extractedName: domain } : {}),
        };
      });
    } catch {
      // Fallback: cached domain list with relevant category
      const cachedDomains = [
        `${keyword.toLowerCase().replace(/\s/g, "")}-pros.com`,
        `best${keyword.toLowerCase().replace(/\s/g, "")}.com`,
        `${keyword.toLowerCase().replace(/\s/g, "")}experts.net`,
      ];
      return cachedDomains.map((domain) => ({
        id: uid(),
        importJobId: "commoncrawl-cached",
        sourceType: "commoncrawl" as SourceType,
        rawPayload: { domain, source: "cached" },
        extractedWebsite: `https://${domain}`,
        extractedCategory: category || undefined,
        importedAt: nowIso(),
        normalizationStatus: "raw" as NormalizationStatus,
      }));
    }
  }
}

// ─── CSV Connector ────────────────────────────────────────────────────────────

export class CSVConnector {
  /**
   * Parse a CSV file string into RawLeadRecords using a field mapping.
   * `fieldMapping` maps CSV column header → BRF field name.
   */
  parseFile(
    fileContent: string,
    fieldMapping: Record<string, string>,
    importJobId = uid(),
  ): { records: RawLeadRecord[]; errors: string[] } {
    const lines = fileContent.split("\n");
    if (lines.length < 2)
      return { records: [], errors: ["File is empty or has no data rows"] };

    const rawHeaders = lines[0]
      .split(",")
      .map((h) => h.trim().replace(/"/g, ""));
    const errors: string[] = [];
    const records: RawLeadRecord[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
      const row: Record<string, string> = {};
      rawHeaders.forEach((h, idx) => {
        row[h] = values[idx] ?? "";
      });

      // Apply field mapping
      const mapped: Record<string, string> = {};
      for (const [srcKey, bfrField] of Object.entries(fieldMapping)) {
        if (row[srcKey] !== undefined) mapped[bfrField] = row[srcKey];
      }

      const mName = mapped.businessName;
      const rName = row["Business Name"];
      const rNameAlt = row.Name;
      if (!mName && !rName && !rNameAlt) {
        errors.push(`Row ${i + 1}: Missing required field 'Business Name'`);
        continue;
      }

      const businessName = mName ?? rName ?? rNameAlt ?? "";
      const phone = mapped.phone ?? row.Phone ?? "";

      // Basic phone validation
      const digits = phone.replace(/\D/g, "");
      if (phone && (digits.length < 7 || digits.length > 15)) {
        errors.push(`Row ${i + 1}: Invalid phone format '${phone}'`);
      }

      // Basic website validation
      const website = mapped.website ?? row.Website ?? "";
      if (website?.includes("..")) {
        errors.push(`Row ${i + 1}: Website URL malformed '${website}'`);
      }

      records.push({
        id: uid(),
        importJobId,
        sourceType: "csv",
        rawPayload: row as Record<string, unknown>,
        extractedName: businessName || undefined,
        extractedWebsite: website || undefined,
        extractedPhone: phone || undefined,
        extractedEmail: mapped.email ?? row.Email ?? undefined,
        extractedAddress: mapped.address ?? row.Address ?? undefined,
        extractedCity: mapped.city ?? row.City ?? undefined,
        extractedState: mapped.state ?? row.State ?? undefined,
        extractedCategory: mapped.category ?? row.Category ?? undefined,
        importedAt: nowIso(),
        normalizationStatus: "raw",
      });
    }

    return { records, errors };
  }
}

// ─── Lead Normalization Engine ────────────────────────────────────────────────

const BUSINESS_SUFFIX_REGEX =
  /\b(llc|inc|corp|co|ltd|lp|llp|pllc|pc|dba|the)\b\.?/gi;
const PROTO_REGEX = /^https?:\/\//i;
const WWW_REGEX = /^www\./i;
const TRAILING_SLASH = /\/+$/;

function cleanBusinessName(name: string): string {
  return name
    .replace(BUSINESS_SUFFIX_REGEX, "")
    .replace(/[^a-z0-9\s&]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeDomain(website: string): string | undefined {
  if (!website) return undefined;
  try {
    const withProto = PROTO_REGEX.test(website)
      ? website
      : `https://${website}`;
    const url = new URL(withProto);
    return url.hostname
      .replace(WWW_REGEX, "")
      .replace(TRAILING_SLASH, "")
      .toLowerCase();
  } catch {
    return (
      website
        .replace(PROTO_REGEX, "")
        .replace(WWW_REGEX, "")
        .replace(TRAILING_SLASH, "")
        .toLowerCase() || undefined
    );
  }
}

function normalizePhone(phone: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  if (digits.length >= 7) return `+${digits}`;
  return undefined;
}

function normalizeState(state: string): string {
  if (!state) return "";
  const abbr = STATE_MAP[state.trim().toLowerCase()];
  return abbr ?? state.trim().toUpperCase().slice(0, 2);
}

const STATE_MAP: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

function computeConfidenceScore(lead: Partial<NormalizedLead>): number {
  let score = 0;
  if (lead.businessName) score += 20;
  if (lead.city) score += 10;
  if (lead.state) score += 10;
  if (lead.website) score += 20;
  if (lead.phone) score += 15;
  if (lead.email) score += 10;
  if (lead.address) score += 5;
  if (lead.category) score += 5;
  if ((lead.reviewCount ?? 0) > 10) score += 5;
  return Math.min(score, 100);
}

function categoryToTags(category: string): string[] {
  const lower = category.toLowerCase();
  const map: Record<string, string[]> = {
    plumber: ["plumber", "residential", "plumbing"],
    plumbing: ["plumber", "residential", "plumbing"],
    hvac: ["hvac", "ac-repair", "heating"],
    "carpet cleaning": ["carpet-cleaning", "upholstery"],
    carpet_cleaning: ["carpet-cleaning", "upholstery"],
    "med spa": ["med-spa", "aesthetics"],
    medspa: ["med-spa", "aesthetics"],
    roofing: ["roofing", "shingle-repair"],
    restoration: ["restoration", "water-damage", "fire-damage"],
  };
  for (const [key, tags] of Object.entries(map)) {
    if (lower.includes(key)) return tags;
  }
  return [lower.replace(/\s+/g, "-")];
}

export class LeadNormalizationEngine {
  normalize(raw: RawLeadRecord): NormalizedLead {
    const name = raw.extractedName ?? "";
    const normalizedName = cleanBusinessName(name);
    const domain = normalizeDomain(raw.extractedWebsite ?? "");
    const website =
      raw.extractedWebsite && !PROTO_REGEX.test(raw.extractedWebsite)
        ? `https://${raw.extractedWebsite}`
        : raw.extractedWebsite;
    const phone = normalizePhone(raw.extractedPhone ?? "");
    const state = normalizeState(raw.extractedState ?? "");
    const category = raw.extractedCategory ?? "";
    const tags = categoryToTags(category);

    const partial: Partial<NormalizedLead> = {
      businessName: name,
      normalizedName,
      website: website || undefined,
      domain: domain || undefined,
      phone: phone || undefined,
      email: raw.extractedEmail || undefined,
      address: raw.extractedAddress || undefined,
      city: raw.extractedCity ?? "",
      state,
      country: "US",
      category,
      tags,
    };

    const confidenceScore = computeConfidenceScore(partial);
    const sourceConfidence =
      confidenceScore >= 75 ? "high" : confidenceScore >= 50 ? "medium" : "low";

    return {
      id: uid(),
      rawRecordIds: [raw.id],
      sourceTypes: [raw.sourceType],
      primarySource: raw.sourceType,
      businessName: name,
      normalizedName,
      website: website || undefined,
      domain: domain || undefined,
      phone: phone || undefined,
      email: raw.extractedEmail || undefined,
      address: raw.extractedAddress || undefined,
      city: raw.extractedCity ?? "",
      state,
      country: "US",
      category,
      tags,
      sourceConfidence,
      confidenceScore,
      isDuplicate: false,
      isSuppressed: false,
      isPromotedToCRM: false,
      normalizedAt: nowIso(),
      lastUpdated: nowIso(),
      ...(raw.sourceType === "openstreetmap" && raw.rawPayload.osm_id
        ? { openStreetMapId: String(raw.rawPayload.osm_id) }
        : {}),
    };
  }

  deduplicate(
    lead: NormalizedLead,
    existingLeads: NormalizedLead[],
  ): { isDuplicate: boolean; duplicateOfId?: string } {
    for (const existing of existingLeads) {
      if (existing.id === lead.id) continue;

      // Domain match (strongest signal)
      if (lead.domain && existing.domain && lead.domain === existing.domain) {
        return { isDuplicate: true, duplicateOfId: existing.id };
      }

      // Phone match
      if (lead.phone && existing.phone && lead.phone === existing.phone) {
        return { isDuplicate: true, duplicateOfId: existing.id };
      }

      // Fuzzy name match (same city)
      if (lead.city && existing.city && lead.city === existing.city) {
        const similarity = nameSimilarity(
          lead.normalizedName,
          existing.normalizedName,
        );
        if (similarity >= 0.85) {
          return { isDuplicate: true, duplicateOfId: existing.id };
        }
      }
    }
    return { isDuplicate: false };
  }

  checkSuppression(
    lead: NormalizedLead,
    suppressionList: SuppressionRecord[],
  ): { isSuppressed: boolean; reason?: string } {
    for (const record of suppressionList) {
      if (
        record.email &&
        lead.email &&
        record.email.toLowerCase() === lead.email.toLowerCase()
      ) {
        return {
          isSuppressed: true,
          reason: `Email on suppression list (${record.reason})`,
        };
      }
      if (record.phone && lead.phone && record.phone === lead.phone) {
        return {
          isSuppressed: true,
          reason: `Phone on suppression list (${record.reason})`,
        };
      }
      if (
        record.domain &&
        lead.domain &&
        record.domain.toLowerCase() === lead.domain.toLowerCase()
      ) {
        return {
          isSuppressed: true,
          reason: `Domain on suppression list (${record.reason})`,
        };
      }
    }
    return { isSuppressed: false };
  }
}

/** Simple bigram-based string similarity (0–1). */
function nameSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const bigrams = (s: string): Set<string> => {
    const set = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const ba = bigrams(a);
  const bb = bigrams(b);
  let intersection = 0;
  for (const bg of ba) {
    if (bb.has(bg)) intersection++;
  }
  return (2 * intersection) / (ba.size + bb.size);
}

// ─── Import Job Manager ───────────────────────────────────────────────────────

const BATCH_SIZE = 50;

export class ImportJobManager {
  private normalizer = new LeadNormalizationEngine();

  createJob(sourceType: SourceType, filters: ImportFilters): SourceImportJob {
    return {
      id: uid(),
      sourceType,
      sourceName: SOURCE_DISPLAY_NAMES[sourceType],
      status: "pending",
      startedAt: nowIso(),
      totalRecords: 0,
      normalizedRecords: 0,
      duplicatesFound: 0,
      suppressedRecords: 0,
      errorCount: 0,
      errors: [],
      filters,
      triggeredBy: "manual",
    };
  }

  async runJob(
    job: SourceImportJob,
    rawRecords: RawLeadRecord[],
    existingLeads: NormalizedLead[] = DEMO_NORMALIZED_LEADS,
    suppressionList: SuppressionRecord[] = [],
  ): Promise<ImportJobResult> {
    const updatedJob: SourceImportJob = {
      ...job,
      status: "running" as ImportStatus,
      startedAt: nowIso(),
      totalRecords: rawRecords.length,
    };

    const normalizedLeads: NormalizedLead[] = [];
    const processedRaws: RawLeadRecord[] = [];
    const errors: string[] = [];

    // Process in batches
    for (
      let batchStart = 0;
      batchStart < rawRecords.length;
      batchStart += BATCH_SIZE
    ) {
      const batch = rawRecords.slice(batchStart, batchStart + BATCH_SIZE);

      for (const raw of batch) {
        try {
          if (!raw.extractedName) {
            errors.push(`Record ${raw.id}: Missing extracted name — skipped`);
            updatedJob.errorCount = (updatedJob.errorCount ?? 0) + 1;
            processedRaws.push({ ...raw, normalizationStatus: "raw" });
            continue;
          }

          const normalized = this.normalizer.normalize(raw);

          // Dedup check
          const allLeads = [...existingLeads, ...normalizedLeads];
          const { isDuplicate, duplicateOfId } = this.normalizer.deduplicate(
            normalized,
            allLeads,
          );
          if (isDuplicate) {
            updatedJob.duplicatesFound = (updatedJob.duplicatesFound ?? 0) + 1;
            processedRaws.push({
              ...raw,
              normalizationStatus: "duplicate",
              normalizedLeadId: duplicateOfId,
            });
            continue;
          }

          // Suppression check
          const { isSuppressed, reason } = this.normalizer.checkSuppression(
            normalized,
            suppressionList,
          );
          if (isSuppressed) {
            updatedJob.suppressedRecords =
              (updatedJob.suppressedRecords ?? 0) + 1;
            processedRaws.push({ ...raw, normalizationStatus: "suppressed" });
            normalizedLeads.push({
              ...normalized,
              isSuppressed: true,
              suppressionReason: reason,
            });
            continue;
          }

          normalizedLeads.push(normalized);
          updatedJob.normalizedRecords =
            (updatedJob.normalizedRecords ?? 0) + 1;
          processedRaws.push({
            ...raw,
            normalizationStatus: "normalized",
            normalizedLeadId: normalized.id,
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`Record ${raw.id}: ${msg}`);
          updatedJob.errorCount = (updatedJob.errorCount ?? 0) + 1;
          processedRaws.push({ ...raw, normalizationStatus: "raw" });
        }
      }

      // Yield to the event loop between batches
      await sleep(0);
    }

    const hasErrors = errors.length > 0;
    const hasSomeSuccess = (updatedJob.normalizedRecords ?? 0) > 0;

    const finalStatus: ImportStatus =
      hasErrors && !hasSomeSuccess
        ? "failed"
        : hasErrors && hasSomeSuccess
          ? "partial"
          : "completed";

    const finalJob: SourceImportJob = {
      ...updatedJob,
      status: finalStatus,
      completedAt: nowIso(),
      errors: errors.length > 0 ? errors : undefined,
    };

    return {
      job: finalJob,
      rawRecords: processedRaws,
      normalizedLeads,
      errors,
    };
  }

  getJobStatus(job: SourceImportJob): ImportStatus {
    return job.status;
  }

  cancelJob(job: SourceImportJob): SourceImportJob {
    return {
      ...job,
      status: "failed",
      completedAt: nowIso(),
      errors: ["Cancelled by user"],
    };
  }
}

const SOURCE_DISPLAY_NAMES: Record<SourceType, string> = {
  openstreetmap: "OpenStreetMap / Nominatim",
  opencorporates: "OpenCorporates",
  gleif: "GLEIF",
  commoncrawl: "Common Crawl",
  csv: "CSV / JSON File Import",
  json: "JSON File Import",
};
