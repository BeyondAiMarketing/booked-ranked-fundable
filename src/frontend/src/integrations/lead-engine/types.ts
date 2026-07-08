/**
 * Local TypeScript types for the Lead Engine Step 2 (dedupe + enrichment)
 * backend types.
 *
 * These mirror the shapes regenerated into `src/backend.d.ts` by
 * `pnpm bindgen`. They are re-declared here so pages and hooks can import
 * them from a single, stable, domain-specific location
 * (`@/integrations/lead-engine/types`) instead of reaching into the generated
 * bindings, and so the variant/enum naming can be reconciled against the
 * regenerated Candid shapes (e.g. `new_` for the reserved `new` keyword,
 * `any_` for the reserved `any` keyword, and the `__kind__`-discriminated
 * tagged unions Candid emits for Motoko variants).
 *
 * Reconciliation notes (vs. the dispatch contract):
 *  - `DedupeMatchField` is a string enum in the regenerated bindings, not a
 *    tagged union. We mirror the enum.
 *  - `LeadStatus` is a string enum; the `new` variant is emitted as `new_`
 *    because `new` is a reserved word in JS/TS.
 *  - `LeadListFilters.dedupeStatus` / `enrichmentStatus` use the Candid
 *    variant enums `Variant_any_resolved_flagged` /
 *    `Variant_any_enriched_notEnriched` (with `any_` for the reserved `any`).
 *    We expose them as `DedupeStatusFilter` / `EnrichmentStatusFilter` for
 *    ergonomic imports.
 *  - `EnrichmentField` and `DedupeResolution` are `__kind__`-discriminated
 *    tagged unions (Candid variant encoding).
 *  - `LeadEngineLead.status` is a plain `string` in the backend record (the
 *    backend stores the LeadStatus enum value as text); callers that need the
 *    enum can compare against `LeadStatus`.
 */

/**
 * Field on a lead that matched an existing lead during import, causing a
 * dedupe flag. Mirrors the Candid enum `DedupeMatchField`.
 */
export enum DedupeMatchField {
  domain = "domain",
  businessName = "businessName",
  email = "email",
  website = "website",
  address = "address",
  phone = "phone",
}

/**
 * A single dedupe flag recorded on a lead when it matched an existing lead
 * during import. Mirrors the Candid record `DedupeFlag`.
 */
export interface DedupeFlag {
  matchedFields: DedupeMatchField[];
  matchedLeadId: string;
  flaggedAt: bigint;
  importBatchId: string;
}

/**
 * Resolution decision applied to a dedupe group. Mirrors the Candid variant
 * `DedupeResolution`. `Merged` carries the two lead IDs involved (the survivor
 * and the merged-away lead); the other variants carry no payload.
 */
export type DedupeResolution =
  | { __kind__: "Linked"; Linked: null }
  | {
      __kind__: "Merged";
      Merged: { mergedIntoLeadId: string; mergedAwayLeadId: string };
    }
  | { __kind__: "Ignored"; Ignored: null }
  | { __kind__: "KeptSeparate"; KeptSeparate: null };

/**
 * A group of leads flagged as potential duplicates of each other. Mirrors the
 * Candid record `DedupeGroup`. `resolution` is present once a human has
 * resolved the group; `resolvedAt` is the timestamp of that decision.
 */
export interface DedupeGroup {
  id: string;
  leadIds: string[];
  createdAt: bigint;
  resolution?: DedupeResolution;
  tenantId: string;
  matchedFields: DedupeMatchField[];
  resolvedAt?: bigint;
}

/**
 * A single enrichment field produced by the LLM fallback chain. Mirrors the
 * Candid variant `EnrichmentField`. Each variant carries its own string
 * payload keyed by the variant name.
 */
export type EnrichmentField =
  | { __kind__: "inferredNiche"; inferredNiche: string }
  | { __kind__: "websiteSummary"; websiteSummary: string }
  | { __kind__: "suggestedOutreachAngle"; suggestedOutreachAngle: string }
  | { __kind__: "companySize"; companySize: string };

/**
 * The result of enriching a lead via the LLM fallback chain. Mirrors the
 * Candid record `EnrichmentResult`. `success` is false when every provider in
 * the chain failed; in that case `errorMessage` and `failingProvider` describe
 * the last failure.
 */
export interface EnrichmentResult {
  provider: string;
  errorMessage?: string;
  fields: EnrichmentField[];
  leadId: string;
  success: boolean;
  enrichedAt: bigint;
  failingProvider?: string;
}

/**
 * Lifecycle status of a Lead Engine lead. Mirrors the Candid enum `LeadStatus`.
 * The `new` variant is emitted as `new_` because `new` is a reserved word.
 */
export enum LeadStatus {
  new_ = "new",
  enriched = "enriched",
  reviewed = "reviewed",
  flagged = "flagged",
  ready = "ready",
}

/**
 * Filter on dedupe status for `leadEngine_listLeads`. Mirrors the Candid
 * variant enum `Variant_any_resolved_flagged` (`any_` for the reserved
 * `any`).
 */
export enum DedupeStatusFilter {
  any_ = "any",
  resolved = "resolved",
  flagged = "flagged",
}

/**
 * Filter on enrichment status for `leadEngine_listLeads`. Mirrors the Candid
 * variant enum `Variant_any_enriched_notEnriched` (`any_` for the reserved
 * `any`).
 */
export enum EnrichmentStatusFilter {
  any_ = "any",
  enriched = "enriched",
  notEnriched = "notEnriched",
}

/**
 * Filters accepted by `leadEngine_listLeads`. All fields optional; omitting a
 * filter means "any". Mirrors the Candid record `LeadListFilters`.
 */
export interface LeadListFilters {
  dedupeStatus?: DedupeStatusFilter;
  enrichmentStatus?: EnrichmentStatusFilter;
  batchId?: string;
}

/**
 * A page of leads returned by `leadEngine_listLeads`. Mirrors the Candid
 * record `LeadListPage`. `total` is the full match count across all pages.
 */
export interface LeadListPage {
  total: bigint;
  offset: bigint;
  leads: LeadEngineLead[];
  limit: bigint;
}

/**
 * A Lead Engine lead record. Mirrors the Candid record `LeadEngineLead`.
 * `status` is stored as a plain string by the backend (a `LeadStatus` enum
 * value rendered as text). `dedupeFlags` is populated when the lead matched
 * existing leads on import; `dedupeResolution` is set once a human resolves
 * the group. `enrichmentResult` is set after a successful (or attempted)
 * enrichment via the LLM fallback chain.
 */
export interface LeadEngineLead {
  id: string;
  provenance: LeadProvenance;
  status: string;
  source: string;
  createdAt: bigint;
  businessName: string;
  email: string;
  enrichmentResult?: EnrichmentResult;
  tenantId: string;
  sourceTags: string[];
  isDuplicate: boolean;
  dedupeResolution?: DedupeResolution;
  linkedLeadIds: string[];
  niche: string;
  phone: string;
  locationTags: string[];
  dedupeFlags: DedupeFlag[];
}

/**
 * Provenance of an imported lead — which importer produced it, from which
 * source tool, in which original format, and when. Re-exported here so pages
 * that consume `LeadEngineLead` do not need a second import from `@/backend`
 * just for the provenance sub-record.
 */
export interface LeadProvenance {
  originalFormat: LeadSourceFormat;
  importDate: bigint;
  sourceTool: string;
  importerName: string;
}

/**
 * Original file format of an imported lead. Mirrors the Candid enum
 * `LeadSourceFormat`. Re-exported here for `LeadProvenance`.
 */
export enum LeadSourceFormat {
  csv = "csv",
  omkar = "omkar",
  json = "json",
  gosom = "gosom",
}
