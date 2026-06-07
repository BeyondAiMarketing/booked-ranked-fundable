// Open Lead Lake — Demo / seed data
// Realistic records for the admin-side lead sourcing pipeline.

import type {
  LeadEnrichment,
  LeadIngestionStats,
  NormalizedLead,
  RawLeadRecord,
  SourceConnectorConfig,
  SourceImportJob,
} from "../types/openLeadLake";

// ─── Source Connector Configurations ─────────────────────────────────────────

export const DEMO_SOURCE_CONNECTORS: SourceConnectorConfig[] = [];
export const DEMO_IMPORT_JOBS: SourceImportJob[] = [];
export const DEMO_RAW_RECORDS: RawLeadRecord[] = [];
export const DEMO_NORMALIZED_LEADS: NormalizedLead[] = [];
export const DEMO_LEAD_ENRICHMENTS: LeadEnrichment[] = [];

export interface VerificationStats {
  totalChecked: number;
  verified: number;
  invalid: number;
  pending: number;
  unverified: number;
  outreachReady: number;
}

export const VERIFICATION_STATS: VerificationStats = {
  totalChecked: 0,
  verified: 0,
  invalid: 0,
  pending: 0,
  unverified: 0,
  outreachReady: 0,
};

export const DEMO_INGESTION_STATS: LeadIngestionStats = {
  totalImported: 0,
  totalNormalized: 0,
  totalDuplicates: 0,
  totalSuppressed: 0,
  totalPromotedToCRM: 0,
  bySource: {
    openstreetmap: { imported: 0, normalized: 0, duplicates: 0 },
    opencorporates: { imported: 0, normalized: 0, duplicates: 0 },
    gleif: { imported: 0, normalized: 0, duplicates: 0 },
    commoncrawl: { imported: 0, normalized: 0, duplicates: 0 },
    csv: { imported: 0, normalized: 0, duplicates: 0 },
    json: { imported: 0, normalized: 0, duplicates: 0 },
  },
  lastUpdated: "",
};
