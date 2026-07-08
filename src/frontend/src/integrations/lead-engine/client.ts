/**
 * Lead Engine client wrapper — calls the backend Lead Engine canister methods.
 *
 * The backend performs all import parsing, dedupe-flagging, enrichment, and
 * persistence. This wrapper is a thin typed facade over the actor methods so
 * pages and hooks can call `leadEngine_importLeads(actor, ...)` without
 * repeating the argument plumbing.
 *
 * Step 1 (importer) methods: leadEngine_importLeads, leadEngine_getImportBatch,
 * leadEngine_listBatches, leadEngine_getLead.
 *
 * Step 2 (dedupe + enrichment) methods: leadEngine_listLeads,
 * leadEngine_getDedupeGroups, leadEngine_resolveDuplicate,
 * leadEngine_enrichLead, leadEngine_enrichBatch, leadEngine_updateLeadStatus.
 *
 * Feature flag: LEAD_ENGINE_ENABLED (always false by default)
 */

import type {
  LeadEngineBatch,
  LeadEngineImportResult,
  RawLeadInput,
} from "@/backend";
import type { ActorCompat } from "../../hooks/useActor";
import type {
  DedupeGroup,
  DedupeResolution,
  EnrichmentResult,
  LeadEngineLead,
  LeadListFilters,
  LeadListPage,
  LeadStatus,
} from "./types";

/**
 * Import a batch of raw leads into the Lead Engine.
 * Returns the import result including accepted/rejected counts and batch id.
 */
export async function leadEngine_importLeads(
  actor: ActorCompat,
  tenantId: string,
  importerName: string,
  sourceTool: string,
  batch: RawLeadInput[],
): Promise<LeadEngineImportResult> {
  return actor.leadEngine_importLeads(
    tenantId,
    importerName,
    sourceTool,
    batch,
  );
}

/**
 * Fetch a single import batch by id (accepted leads, rejected rows, summary).
 */
export async function leadEngine_getImportBatch(
  actor: ActorCompat,
  tenantId: string,
  batchId: string,
): Promise<LeadEngineBatch> {
  return actor.leadEngine_getImportBatch(tenantId, batchId);
}

/**
 * List all import batches for a tenant (newest first).
 */
export async function leadEngine_listBatches(
  actor: ActorCompat,
  tenantId: string,
): Promise<LeadEngineBatch[]> {
  return actor.leadEngine_listBatches(tenantId);
}

/**
 * Fetch a single lead by id (full record including provenance).
 */
export async function leadEngine_getLead(
  actor: ActorCompat,
  tenantId: string,
  leadId: string,
): Promise<LeadEngineLead> {
  return actor.leadEngine_getLead(tenantId, leadId);
}

// ---------------------------------------------------------------------------
// Step 2 — dedupe + enrichment facades
// ---------------------------------------------------------------------------

/**
 * List leads for a tenant with optional dedupe/enrichment/batch filters and
 * pagination. The backend returns a page of leads plus the total count so
 * pages can render pagination controls. `offset` and `limit` are forwarded as
 * BigInts to match the backend's Nat signature.
 */
export async function leadEngine_listLeads(
  actor: ActorCompat,
  tenantId: string,
  filters: LeadListFilters,
  offset: number,
  limit: number,
): Promise<LeadListPage> {
  return actor.leadEngine_listLeads(
    tenantId,
    filters,
    BigInt(offset),
    BigInt(limit),
  );
}

/**
 * Fetch dedupe groups for a tenant. When `unresolvedOnly` is true the backend
 * only returns groups that still need a human resolution decision; otherwise
 * it returns the full history including resolved groups.
 */
export async function leadEngine_getDedupeGroups(
  actor: ActorCompat,
  tenantId: string,
  unresolvedOnly: boolean,
): Promise<DedupeGroup[]> {
  return actor.leadEngine_getDedupeGroups(tenantId, unresolvedOnly);
}

/**
 * Resolve a dedupe group by applying a resolution decision (Merged, Ignored,
 * KeptSeparate, or Linked). Returns the updated group, or null if the group
 * no longer exists.
 */
export async function leadEngine_resolveDuplicate(
  actor: ActorCompat,
  tenantId: string,
  groupId: string,
  resolution: DedupeResolution,
): Promise<DedupeGroup | null> {
  return actor.leadEngine_resolveDuplicate(tenantId, groupId, resolution);
}

/**
 * Enrich a single lead using the LLM fallback chain. Returns the enrichment
 * result, or null if the lead does not exist.
 */
export async function leadEngine_enrichLead(
  actor: ActorCompat,
  tenantId: string,
  leadId: string,
): Promise<EnrichmentResult | null> {
  return actor.leadEngine_enrichLead(tenantId, leadId);
}

/**
 * Enrich a batch of leads in one call. The backend iterates the supplied
 * lead IDs through the LLM fallback chain and returns one EnrichmentResult
 * per lead (including failures, which carry `success: false` and an
 * `errorMessage`).
 */
export async function leadEngine_enrichBatch(
  actor: ActorCompat,
  tenantId: string,
  leadIds: string[],
): Promise<EnrichmentResult[]> {
  return actor.leadEngine_enrichBatch(tenantId, leadIds);
}

/**
 * Update a lead's status (new, flagged, reviewed, enriched, ready). Returns
 * the updated lead, or null if the lead does not exist.
 */
export async function leadEngine_updateLeadStatus(
  actor: ActorCompat,
  tenantId: string,
  leadId: string,
  status: LeadStatus,
): Promise<LeadEngineLead | null> {
  return actor.leadEngine_updateLeadStatus(tenantId, leadId, status);
}
