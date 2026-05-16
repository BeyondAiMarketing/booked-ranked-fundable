// CSV Lead Import Utilities
// Parses, classifies, and normalizes imported CSV leads for BRF Open Lead Lake

import type { ExtendedNormalizedLead } from "../types/openLeadLake";

export interface ImportStats {
  total: number;
  byNiche: Record<string, number>;
  withEmail: number;
  flaggedNoEmail: number;
  importBatchId: string;
}

// ─── Email Flag Detection ──────────────────────────────────────────────────────

const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|webp|bmp|ico)(@\d+x)?$/i;
const SENTRY_PATTERN = /sentry\./i;
const PLACEHOLDER_EMAILS = new Set([
  "username@example.com",
  "user@domain.com",
  "your@email.com",
  "email@example.com",
  "you@example.com",
  "name@example.com",
  "mail@company.com",
]);
const PLACEHOLDER_PREFIXES = ["username@", "user@domain", "chosen-sprite"];

export function isPlaceholderEmail(email: string): boolean {
  if (!email || email.trim() === "" || email.toUpperCase() === "N/A")
    return true;
  const lower = email.toLowerCase().trim();
  if (PLACEHOLDER_EMAILS.has(lower)) return true;
  if (IMAGE_EXTENSIONS.test(lower)) return true;
  if (SENTRY_PATTERN.test(lower)) return true;
  for (const prefix of PLACEHOLDER_PREFIXES) {
    if (lower.startsWith(prefix)) return true;
  }
  return false;
}

export function buildEmailFlag(email: string): string | undefined {
  if (!email || email.trim() === "" || email.toUpperCase() === "N/A") {
    return "No email provided";
  }
  const lower = email.toLowerCase().trim();
  if (IMAGE_EXTENSIONS.test(lower)) {
    return "Invalid email: appears to be an image filename";
  }
  if (SENTRY_PATTERN.test(lower)) {
    return "Invalid email: tracking pixel or error address";
  }
  if (PLACEHOLDER_EMAILS.has(lower)) {
    return "Invalid email: placeholder detected";
  }
  for (const prefix of PLACEHOLDER_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return "Invalid email: placeholder detected";
    }
  }
  return undefined;
}

// ─── Niche Detection ──────────────────────────────────────────────────────────

const TECH_KEYWORDS = [
  "software",
  "tech",
  "app",
  "mobile",
  "web",
  "developer",
  "development",
  "digital",
  "it ",
  " it",
  "iot",
  "saas",
  "devops",
  "coding",
  "programm",
  "cloud",
  "data",
  "cyber",
  "ai ",
  "machine",
  "platform",
  "systems",
  "solutions",
  "drupal",
  "wordpress",
  "integration",
  "engineering",
  "network",
];

const REAL_ESTATE_KEYWORDS = [
  "real estate",
  "realty",
  "realtor",
  "properties",
  "property",
  "homes",
  "broker",
  "realtors",
  "listings",
  "sotheby",
  "compass",
  "keller williams",
  "coldwell",
  "berkshire",
  "century 21",
  "redfin",
];

const ROOFING_KEYWORDS = [
  "roof",
  "roofer",
  "roofing",
  "shingle",
  "gutter",
  "tile roof",
];

export function detectNiche(
  businessName: string,
  category?: string,
  aiSuggestedServices?: string,
): string {
  const text =
    `${businessName} ${category ?? ""} ${aiSuggestedServices ?? ""}`.toLowerCase();

  for (const kw of ROOFING_KEYWORDS) {
    if (text.includes(kw)) return "Roofing";
  }
  for (const kw of REAL_ESTATE_KEYWORDS) {
    if (text.includes(kw)) return "Real Estate";
  }
  for (const kw of TECH_KEYWORDS) {
    if (text.includes(kw)) return "Technology";
  }
  return "Other";
}

// ─── UUID-style Batch ID ──────────────────────────────────────────────────────

function generateBatchId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `batch-${ts}-${rand}`;
}

// ─── CSV Row Parser ───────────────────────────────────────────────────────────

interface CSVRow {
  BusinessName?: string;
  "Business Name"?: string;
  "GBP Link"?: string;
  Rating?: string;
  "Total Review"?: string;
  Address?: string;
  Website?: string;
  "Phone Number"?: string;
  Phone?: string;
  Email?: string;
  "E-Mail"?: string;
  "Claim Status"?: string;
  "Optimization Score"?: string;
  "AI Suggested Services"?: string;
  [key: string]: string | undefined;
}

export function parseCSVRow(
  row: CSVRow,
  index: number,
  batchId: string,
): ExtendedNormalizedLead {
  const businessName = (
    row.BusinessName ??
    row["Business Name"] ??
    "Unknown Business"
  ).trim();
  const rawEmail = (row.Email ?? row["E-Mail"] ?? "").trim();
  const rawPhone = (row.Phone ?? row["Phone Number"] ?? "").trim();
  const rawWebsite = (row.Website ?? "").trim();
  const rawAddress = (row.Address ?? "").trim();
  const rawRating = Number.parseFloat(row.Rating ?? "0") || 0;
  const rawReviews = Number.parseInt(row["Total Review"] ?? "0", 10) || 0;
  const claimStatus = (row["Claim Status"] ?? "").toLowerCase() as
    | "claimed"
    | "unclaimed";
  const optimizationScore = row["Optimization Score"] ?? undefined;
  const aiSuggestedServices = row["AI Suggested Services"] ?? undefined;
  const gbpLink = row["GBP Link"] ?? undefined;

  // Parse city/state from address
  const addrParts = rawAddress.split(",").map((s) => s.trim());
  const city = addrParts[1] ?? addrParts[0] ?? "";
  const stateZip = addrParts[2] ?? "";
  const state = stateZip.trim().split(" ")[0] ?? "CA";

  const emailFlagged = isPlaceholderEmail(rawEmail);
  const emailFlag = buildEmailFlag(rawEmail);
  const cleanEmail = emailFlagged ? undefined : rawEmail;

  const niche = detectNiche(businessName, undefined, aiSuggestedServices);
  const hasWebsite = rawWebsite !== "" && rawWebsite.toUpperCase() !== "N/A";

  const confidenceScore =
    rawReviews > 50
      ? 85
      : rawReviews > 10
        ? 72
        : rawReviews > 0
          ? 60
          : hasWebsite
            ? 45
            : 30;

  return {
    // NormalizedLead base fields
    id: `csv-lead-${batchId}-${index + 1}`,
    rawRecordIds: [],
    sourceTypes: ["csv"],
    primarySource: "csv",
    businessName,
    normalizedName: businessName
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim(),
    website: hasWebsite ? rawWebsite : undefined,
    domain: hasWebsite
      ? rawWebsite.replace(/^https?:\/\//, "").split("/")[0]
      : undefined,
    phone: rawPhone !== "" ? rawPhone : undefined,
    email: cleanEmail,
    address: addrParts[0] ?? undefined,
    city,
    state,
    country: "US",
    category: niche,
    tags: [niche.toLowerCase().replace(/ /g, "-")],
    sourceConfidence:
      confidenceScore >= 75 ? "high" : confidenceScore >= 50 ? "medium" : "low",
    confidenceScore,
    isDuplicate: false,
    isSuppressed: false,
    isPromotedToCRM: false,
    normalizedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    reviewCount: rawReviews,
    rating: rawRating,
    canReceiveOutreach: !emailFlagged && rawPhone !== "",

    // Extended fields
    gbpLink,
    claimStatus:
      claimStatus === "claimed" || claimStatus === "unclaimed"
        ? claimStatus
        : undefined,
    optimizationScore,
    aiSuggestedServices,
    emailVerified: !emailFlagged && cleanEmail !== undefined,
    emailFlag,
    importBatchId: batchId,
    niche,
  };
}

// ─── Process Full CSV Text ────────────────────────────────────────────────────

export function processCSVImport(csvText: string): {
  leads: ExtendedNormalizedLead[];
  stats: ImportStats;
} {
  const batchId = generateBatchId();
  const lines = csvText.trim().split("\n");
  if (lines.length < 2)
    return {
      leads: [],
      stats: {
        total: 0,
        byNiche: {},
        withEmail: 0,
        flaggedNoEmail: 0,
        importBatchId: batchId,
      },
    };

  const headers = lines[0].split("\t").map((h) => h.trim());
  const leads: ExtendedNormalizedLead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split("\t");
    const row: CSVRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim() ?? "";
    });
    if (!row["Business Name"]) continue;
    leads.push(parseCSVRow(row, i - 1, batchId));
  }

  const byNiche: Record<string, number> = {};
  let withEmail = 0;
  let flaggedNoEmail = 0;

  for (const lead of leads) {
    byNiche[lead.niche] = (byNiche[lead.niche] ?? 0) + 1;
    if (lead.emailVerified) withEmail++;
    if (lead.emailFlag) flaggedNoEmail++;
  }

  return {
    leads,
    stats: {
      total: leads.length,
      byNiche,
      withEmail,
      flaggedNoEmail,
      importBatchId: batchId,
    },
  };
}
