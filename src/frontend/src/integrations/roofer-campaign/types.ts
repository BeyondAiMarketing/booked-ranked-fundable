/**
 * Local TypeScript types for the Roofer Cold Outreach Campaign backend types.
 *
 * These mirror the shapes that will be regenerated into `src/backend.d.ts` by
 * `pnpm bindgen` once the backend canister exposes the roofer cold campaign
 * and demo booking methods. They are re-declared here so pages and hooks can
 * import them from a single, stable, domain-specific location
 * (`@/integrations/roofer-campaign/types`) instead of reaching into the
 * generated bindings, and so the variant/enum naming can be reconciled against
 * the regenerated Candid shapes (e.g. `__kind__`-discriminated tagged unions
 * Candid emits for Motoko variants, and `new_` for the reserved `new`
 * keyword).
 *
 * Reconciliation notes (vs. the dispatch contract):
 *  - `RooferCampaignLeadStatus` is a string enum mirroring the Candid enum of
 *    the same name. The `new` variant is emitted as `new_` because `new` is a
 *    reserved word in JS/TS.
 *  - `RooferCampaignStatus` is a string enum (draft / sending / paused /
 *    completed / archived).
 *  - `RooferCampaignStep` carries the editable 7-step sequence content
 *    (subject, body, delayDays, ctaToken). The sequence is editable from the
 *    UI; the backend persists the updated steps.
 *  - `DemoBooking` is the public demo booking record matched to a lead by the
 *    unique CTA token embedded in the campaign step.
 *  - `RooferCampaignListResult` is the paginated list response shape.
 *
 * These will be reconciled with backend.d.ts once bindings regenerate — for
 * now they are defined as the expected shapes so the pages can be built.
 */

/**
 * Lifecycle status of a roofer cold outreach campaign. Mirrors the Candid enum
 * `RooferCampaignStatus`.
 */
export enum RooferCampaignStatus {
  draft = "draft",
  sending = "sending",
  paused = "paused",
  completed = "completed",
  archived = "archived",
}

/**
 * Per-lead status within a roofer cold campaign. Mirrors the Candid enum
 * `RooferCampaignLeadStatus`. The `new` variant is emitted as `new_` because
 * `new` is a reserved word.
 */
export enum RooferCampaignLeadStatus {
  new_ = "new",
  sent = "sent",
  opened = "opened",
  replied = "replied",
  bounced = "bounced",
  booked = "booked",
  unsubscribed = "unsubscribed",
}

/**
 * A single step in the editable 7-step roofer cold outreach sequence.
 * Mirrors the Candid record `RooferCampaignStep`. The `ctaToken` is the
 * unique token embedded in the step's CTA link that matches a lead to a demo
 * booking when the recipient clicks through.
 */
export interface RooferCampaignStep {
  id: string;
  stepNumber: bigint;
  subject: string;
  body: string;
  delayDays: bigint;
  sendTime: string;
  ctaToken: string;
}

/**
 * A lead enrolled in a roofer cold campaign. Mirrors the Candid record
 * `RooferCampaignLead`. `status` is the per-lead status shown inline
 * (sent/opened/replied/bounced/booked). `currentStep` is the index of the
 * next step to send. `lastEventAt` is the timestamp of the most recent status
 * change.
 */
export interface RooferCampaignLead {
  id: string;
  campaignId: string;
  leadId: string;
  businessName: string;
  email: string;
  phone: string;
  niche: string;
  status: RooferCampaignLeadStatus;
  currentStep: bigint;
  enrolledAt: bigint;
  lastEventAt: bigint;
  ctaToken: string;
  replySnippet?: string;
}

/**
 * Aggregate stats for a roofer cold campaign. Mirrors the Candid record
 * `RooferCampaignStats`. Counts are BigInts to match the backend's Nat
 * signature.
 */
export interface RooferCampaignStats {
  campaignId: string;
  totalLeads: bigint;
  sent: bigint;
  opened: bigint;
  replied: bigint;
  bounced: bigint;
  booked: bigint;
  unsubscribed: bigint;
  replyRate: bigint;
  bookRate: bigint;
}

/**
 * A roofer cold outreach campaign. Mirrors the Candid record
 * `RooferColdCampaign`. `sequence` is the editable 7-step sequence. `status`
 * is the campaign lifecycle status. `startedAt` is set when the user clicks
 * "Start sending" (manual send — no automated scheduling).
 */
export interface RooferColdCampaign {
  id: string;
  name: string;
  tenantId: string;
  status: RooferCampaignStatus;
  sequence: RooferCampaignStep[];
  createdAt: bigint;
  updatedAt: bigint;
  startedAt?: bigint;
  pausedAt?: bigint;
  completedAt?: bigint;
  leadCount: bigint;
}

/**
 * A public demo booking matched to a lead by the unique CTA token. Mirrors
 * the Candid record `DemoBooking`. The booking flow is: name + email first,
 * then time slot selection, then confirmation. No login required.
 */
export interface DemoBooking {
  id: string;
  campaignId: string;
  leadId: string;
  ctaToken: string;
  name: string;
  email: string;
  slotIso: string;
  confirmed: boolean;
  createdAt: bigint;
  confirmedAt?: bigint;
}

/**
 * Summary row for the campaign list view. Mirrors the Candid record
 * `RooferCampaignSummary`. Lightweight projection of `RooferColdCampaign` plus
 * the headline stats so the list view does not need to fetch each campaign's
 * full record.
 */
export interface RooferCampaignSummary {
  id: string;
  name: string;
  status: RooferCampaignStatus;
  leadCount: bigint;
  sent: bigint;
  replied: bigint;
  booked: bigint;
  createdAt: bigint;
  startedAt?: bigint;
}

/**
 * Paginated list response for `rooferColdCampaign_list`. Mirrors the Candid
 * record `RooferCampaignListResult`. `total` is the full match count across
 * all pages.
 */
export interface RooferCampaignListResult {
  total: bigint;
  offset: bigint;
  limit: bigint;
  campaigns: RooferCampaignSummary[];
}

/**
 * Input payload for creating a new roofer cold campaign. The backend
 * generates the id, tenantId, timestamps, and the default 7-step sequence if
 * `sequence` is omitted.
 */
export interface CreateRooferCampaignInput {
  name: string;
  sequence?: RooferCampaignStep[];
}

/**
 * Input payload for updating a campaign's editable sequence. The backend
 * validates step numbers and persists the updated steps.
 */
export interface UpdateSequenceInput {
  sequence: RooferCampaignStep[];
}

/**
 * Input payload for enrolling leads into a campaign. `leadIds` are Lead
 * Engine lead IDs; the backend creates the `RooferCampaignLead` records and
 * generates a unique CTA token per lead.
 */
export interface EnrollLeadsInput {
  campaignId: string;
  leadIds: string[];
}

/**
 * Input payload for creating a public demo booking from the /demo/:ctaToken
 * page. The backend matches the CTA token to a lead and campaign.
 */
export interface CreateDemoBookingInput {
  ctaToken: string;
  name: string;
  email: string;
  slotIso: string;
}
