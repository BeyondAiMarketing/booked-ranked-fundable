/**
 * Roofer Cold Campaign client wrapper — calls the backend canister methods for
 * the roofer cold outreach campaign and public demo booking flows.
 *
 * The backend performs all campaign creation, sequence editing, lead
 * enrollment, send processing, stats aggregation, reply capture, and demo
 * booking persistence. This wrapper is a thin typed facade over the actor
 * methods so pages and hooks can call
 * `rooferColdCampaign_create(actor, ...)` without repeating the argument
 * plumbing.
 *
 * Campaign methods: rooferColdCampaign_create, _list, _get, _updateSequence,
 * _enrollLeads, _getLeads, _startSending, _pauseSending, _getStats,
 * _getReplies, _exportLeadsCsv, _processDueSends.
 *
 * Demo booking methods: demoBooking_getByCtaToken, demoBooking_create,
 * demoBooking_listByCampaign.
 *
 * NOTE: These methods will be available on the actor once backend bindings
 * regenerate from the canister that exposes them. Until then, the actor is
 * cast to `any` to avoid type errors against the current generated bindings
 * (which do not yet include these methods). TODO: tighten the cast to the
 * real generated actor type after `pnpm bindgen` regenerates backend.d.ts
 * with the roofer cold campaign + demo booking methods.
 */

import type { ActorCompat } from "../../hooks/useActor";
import type {
  CreateDemoBookingInput,
  CreateRooferCampaignInput,
  DemoBooking,
  EnrollLeadsInput,
  RooferCampaignLead,
  RooferCampaignListResult,
  RooferCampaignStats,
  RooferCampaignSummary,
  RooferColdCampaign,
  UpdateSequenceInput,
} from "./types";

/**
 * Cast helper: the current generated actor type does not yet include the
 * roofer cold campaign / demo booking methods. We cast through `any` once
 * here so every facade function shares a single, easily-greppable cast site
 * that can be tightened after bindgen regenerates the bindings.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RooferCampaignActor = ActorCompat & Record<string, any>;

/**
 * Create a new roofer cold outreach campaign. The backend generates the id,
 * tenantId, timestamps, and the default 7-step sequence if `sequence` is
 * omitted from the input.
 */
export async function rooferColdCampaign_create(
  actor: ActorCompat,
  input: CreateRooferCampaignInput,
): Promise<RooferColdCampaign> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen regenerates backend.d.ts with the
  // rooferColdCampaign_create method signature.
  return a.rooferColdCampaign_create(input);
}

/**
 * List roofer cold campaigns for a tenant with pagination. Returns a summary
 * row per campaign (no sequence body) so the list view stays light.
 */
export async function rooferColdCampaign_list(
  actor: ActorCompat,
  tenantId: string,
  offset: number,
  limit: number,
): Promise<RooferCampaignListResult> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_list(tenantId, BigInt(offset), BigInt(limit));
}

/**
 * Fetch a single roofer cold campaign by id, including the full editable
 * sequence.
 */
export async function rooferColdCampaign_get(
  actor: ActorCompat,
  campaignId: string,
): Promise<RooferColdCampaign | null> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_get(campaignId);
}

/**
 * Update a campaign's editable 7-step sequence. The backend validates step
 * numbers and persists the updated steps.
 */
export async function rooferColdCampaign_updateSequence(
  actor: ActorCompat,
  input: UpdateSequenceInput,
): Promise<RooferColdCampaign | null> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_updateSequence(input);
}

/**
 * Enroll leads into a campaign. The backend creates the
 * `RooferCampaignLead` records and generates a unique CTA token per lead.
 */
export async function rooferColdCampaign_enrollLeads(
  actor: ActorCompat,
  input: EnrollLeadsInput,
): Promise<RooferCampaignLead[]> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_enrollLeads(input);
}

/**
 * Get all leads enrolled in a campaign, with their per-lead status shown
 * inline (sent/opened/replied/bounced/booked).
 */
export async function rooferColdCampaign_getLeads(
  actor: ActorCompat,
  campaignId: string,
): Promise<RooferCampaignLead[]> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_getLeads(campaignId);
}

/**
 * Start sending the campaign. Manual trigger only — the user controls when
 * emails go out. No automated scheduling.
 */
export async function rooferColdCampaign_startSending(
  actor: ActorCompat,
  campaignId: string,
): Promise<RooferColdCampaign | null> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_startSending(campaignId);
}

/**
 * Pause sending for a campaign. Already-sent emails remain sent; pending
 * steps are held until the user resumes.
 */
export async function rooferColdCampaign_pauseSending(
  actor: ActorCompat,
  campaignId: string,
): Promise<RooferColdCampaign | null> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_pauseSending(campaignId);
}

/**
 * Get aggregate stats for a campaign (sent, opened, replied, bounced, booked,
 * reply rate, book rate).
 */
export async function rooferColdCampaign_getStats(
  actor: ActorCompat,
  campaignId: string,
): Promise<RooferCampaignStats | null> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_getStats(campaignId);
}

/**
 * Get replies received for a campaign. Returns the lead records with
 * `replySnippet` populated for leads that have replied.
 */
export async function rooferColdCampaign_getReplies(
  actor: ActorCompat,
  campaignId: string,
): Promise<RooferCampaignLead[]> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_getReplies(campaignId);
}

/**
 * Export a campaign's leads as CSV. Returns the CSV string for the frontend
 * to trigger a download.
 */
export async function rooferColdCampaign_exportLeadsCsv(
  actor: ActorCompat,
  campaignId: string,
): Promise<string> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_exportLeadsCsv(campaignId);
}

/**
 * Process due sends for a campaign. Called by the cron/heartbeat to advance
 * leads to their next sequence step when the delay has elapsed. Exposed here
 * for an admin "process now" affordance.
 */
export async function rooferColdCampaign_processDueSends(
  actor: ActorCompat,
  campaignId: string,
): Promise<bigint> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.rooferColdCampaign_processDueSends(campaignId);
}

// ---------------------------------------------------------------------------
// Demo booking facades (public, no auth)
// ---------------------------------------------------------------------------

/**
 * Fetch a demo booking context by the unique CTA token embedded in the
 * campaign step's CTA link. Used by the public /demo/:ctaToken page to look
 * up the lead + campaign before showing the booking form. Returns null if the
 * token is unknown or already used.
 */
export async function demoBooking_getByCtaToken(
  actor: ActorCompat,
  ctaToken: string,
): Promise<DemoBooking | null> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.demoBooking_getByCtaToken(ctaToken);
}

/**
 * Create a public demo booking from the /demo/:ctaToken page. The backend
 * matches the CTA token to a lead and campaign. No login required.
 */
export async function demoBooking_create(
  actor: ActorCompat,
  input: CreateDemoBookingInput,
): Promise<DemoBooking> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.demoBooking_create(input);
}

/**
 * List demo bookings for a campaign (admin view). Used by the campaign
 * detail's Replies/Booked tab to show booked demos.
 */
export async function demoBooking_listByCampaign(
  actor: ActorCompat,
  campaignId: string,
): Promise<DemoBooking[]> {
  const a = actor as RooferCampaignActor;
  // TODO: tighten cast after bindgen.
  return a.demoBooking_listByCampaign(campaignId);
}

/**
 * Convenience re-export of the summary type so callers can import the facade
 * and its return type from one place.
 */
export type { RooferCampaignSummary };
