// Open Lead Lake — TypeScript type definitions
// Native admin-side lead sourcing and ingestion pipeline for BRF

export type SourceType =
  | "openstreetmap"
  | "opencorporates"
  | "gleif"
  | "commoncrawl"
  | "csv"
  | "json";

export type ImportStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "partial";

export type NormalizationStatus =
  | "raw"
  | "normalized"
  | "duplicate"
  | "suppressed"
  | "promoted";

export type LeadSourceConfidence = "high" | "medium" | "low";

export interface SourceConnectorConfig {
  id: string;
  sourceType: SourceType;
  name: string;
  description: string;
  enabled: boolean;
  endpointUrl?: string;
  apiKey?: string;
  fileFormat?: "csv" | "json";
  fieldMapping?: Record<string, string>;
  filters?: {
    niches?: string[];
    cities?: string[];
    states?: string[];
    keywords?: string[];
    requireWebsite?: boolean;
    minReviewCount?: number;
  };
  lastSync?: string;
  recordsIngested?: number;
  status: "active" | "inactive" | "error";
  setupGuide?: string;
}

export interface SourceImportJob {
  id: string;
  sourceType: SourceType;
  sourceName: string;
  status: ImportStatus;
  startedAt: string;
  completedAt?: string;
  totalRecords: number;
  normalizedRecords: number;
  duplicatesFound: number;
  suppressedRecords: number;
  errorCount: number;
  errors?: string[];
  filters?: {
    niche?: string;
    city?: string;
    state?: string;
    keyword?: string;
  };
  triggeredBy: "manual" | "scheduled";
  notes?: string;
}

export interface RawLeadRecord {
  id: string;
  importJobId: string;
  sourceType: SourceType;
  rawPayload: Record<string, unknown>;
  extractedName?: string;
  extractedWebsite?: string;
  extractedPhone?: string;
  extractedEmail?: string;
  extractedAddress?: string;
  extractedCity?: string;
  extractedState?: string;
  extractedCategory?: string;
  extractedLatLng?: { lat: number; lng: number };
  importedAt: string;
  normalizationStatus: NormalizationStatus;
  normalizedLeadId?: string;
}

export type VerificationStatus =
  | "unverified"
  | "verified"
  | "invalid"
  | "pending";

export interface LeadEnrichment {
  leadId: string;
  emailVerificationStatus: VerificationStatus;
  phoneVerificationStatus: VerificationStatus;
  emailVerifiedAt?: number;
  phoneVerifiedAt?: number;
  canReceiveOutreach: boolean;
}

export interface NormalizedLead {
  id: string;
  rawRecordIds: string[];
  sourceTypes: SourceType[];
  primarySource: SourceType;
  businessName: string;
  normalizedName: string;
  website?: string;
  domain?: string;
  phone?: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  category: string;
  tags: string[];
  sourceConfidence: LeadSourceConfidence;
  confidenceScore: number; // 0–100
  isDuplicate: boolean;
  duplicateOfId?: string;
  isSuppressed: boolean;
  suppressionReason?: string;
  isPromotedToCRM: boolean;
  promotedAt?: string;
  normalizedAt: string;
  lastUpdated: string;
  reviewCount?: number;
  rating?: number;
  openStreetMapId?: string;
  openCorporatesId?: string;
  gleifLei?: string;
  commonCrawlDomain?: string;
  enrichment?: LeadEnrichment;
  canReceiveOutreach?: boolean; // defaults to true if not enriched
}

// ─── Extended Normalized Lead (CSV Import) ────────────────────────────────────

export interface ExtendedNormalizedLead extends NormalizedLead {
  gbpLink?: string;
  claimStatus?: "claimed" | "unclaimed";
  optimizationScore?: string;
  aiSuggestedServices?: string;
  emailVerified: boolean;
  emailFlag?: string; // e.g. 'No email provided' | 'Invalid email: image filename' | etc.
  importBatchId?: string;
  niche: string; // auto-categorized: 'Technology' | 'Real Estate' | 'Roofing' | 'General'
}

export interface LeadIngestionStats {
  totalImported: number;
  totalNormalized: number;
  totalDuplicates: number;
  totalSuppressed: number;
  totalPromotedToCRM: number;
  bySource: Record<
    SourceType,
    { imported: number; normalized: number; duplicates: number }
  >;
  lastUpdated: string;
}
