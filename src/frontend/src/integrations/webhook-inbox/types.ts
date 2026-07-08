/**
 * Local type declarations for the Webhook Inbox integration.
 *
 * These mirror the REAL backend Candid shapes for the webhook inbox
 * methods exposed by the canister (see backend.d.ts). They live here
 * (not in @/backend) so the client compiles even before `pnpm bindgen`
 * regenerates backend.d.ts with the new method signatures.
 *
 * Once bindgen runs, callers may switch to importing the generated types
 * from @/backend, but these local types remain the source of truth for the
 * client facade's public surface.
 *
 * Signature verification is structural-only (Motoko lacks HMAC/ECDSA).
 */

/**
 * The normalized provider that sourced a webhook event.
 * Mirrors the backend WebhookProvider variant.
 */
export type WebhookProvider = "instantly" | "smartlead" | "twilio" | "sendgrid";

/**
 * The provider whose test payload should be injected by sendTestWebhookEvent.
 * Mirrors the backend WebhookTestPayload variant.
 */
export type WebhookTestPayload =
  | "instantly"
  | "smartlead"
  | "twilio"
  | "sendgrid";

/**
 * A single normalized webhook event stored in the inbox.
 *
 * The backend normalizes raw provider payloads into this shape before
 * persisting to WebhookState. The frontend reads this shape only — it
 * never sees the raw provider JSON directly.
 *
 * Timestamps are bigint nanoseconds (IC convention). Convert to ms with
 * `new Date(Number(ts) / 1_000_000)` for JS Date usage.
 */
export interface NormalizedWebhookEvent {
  /** Stable unique id (backend-generated). */
  id: string;
  /** Source provider. */
  provider: WebhookProvider;
  /** Normalized event type (e.g. reply_received, bounce, delivered). */
  normalizedEventType: string;
  /** External campaign id (may be empty). */
  externalCampaignId?: string;
  /** External lead id (may be empty). */
  externalLeadId?: string;
  /** Lead email (may be empty). */
  leadEmail?: string;
  /** Lead phone (may be empty). */
  leadPhone?: string;
  /** Internal lead id once matched (may be empty). */
  internalLeadId?: string;
  /** Reply body text (may be empty). */
  replyText?: string;
  /** Reply subject line (may be empty). */
  replySubject?: string;
  /** Raw provider payload as a JSON string (for inspection). */
  rawPayload: string;
  /** Provider-reported timestamp (nanoseconds). */
  providerTimestamp: bigint;
  /** When the backend received the event (nanoseconds). */
  receivedAt: bigint;
  /** Human-readable note about where the event was routed (empty if not). */
  routedTo: string;
}

/**
 * Filters accepted by getWebhookInboxEvents. `limit` is required.
 * Empty/undefined filters return the newest events across all providers.
 *
 * Timestamps are bigint nanoseconds (IC convention).
 */
export interface WebhookInboxFilters {
  /** Filter by source provider. */
  provider?: WebhookProvider;
  /** Filter by normalized event type. */
  normalizedEventType?: string;
  /** Substring match against lead email or phone. */
  leadEmailOrPhone?: string;
  /** Filter events received at or after this nanosecond timestamp. */
  fromTimestamp?: bigint;
  /** Filter events received at or before this nanosecond timestamp. */
  toTimestamp?: bigint;
  /** Max number of events to return (newest first). Required. */
  limit: bigint;
}

/**
 * Aggregate stats over the webhook inbox, used for the dashboard header.
 *
 * `eventsByProvider` and `eventsByType` are [string, bigint][] pairs
 * (provider name / event type → count).
 */
export interface WebhookInboxStats {
  /** Total events currently stored. */
  totalEvents: bigint;
  /** Breakdown by provider as [provider, count] pairs. */
  eventsByProvider: Array<[string, bigint]>;
  /** Breakdown by normalized event type as [type, count] pairs. */
  eventsByType: Array<[string, bigint]>;
  /** Events received in the last 24h. */
  eventsLast24h: bigint;
}

/**
 * Result of sending a test webhook event into the inbox.
 * The backend returns `{ ok: boolean, eventId: string }` (no error field).
 */
export interface WebhookTestResult {
  /** Whether the test event was accepted and stored. */
  ok: boolean;
  /** The id of the stored event (empty string when ok is false). */
  eventId: string;
}
