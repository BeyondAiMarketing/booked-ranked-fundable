/**
 * Webhook Inbox client wrapper — calls the backend webhook inbox canister methods.
 *
 * The backend normalizes raw provider payloads into NormalizedWebhookEvent
 * records, persists them to WebhookState, and exposes query + test endpoints.
 * This wrapper is a thin typed facade over the actor methods so pages and
 * hooks can call `getWebhookInboxEvents(actor, ...)` without repeating the
 * argument plumbing.
 *
 * Feature flag: WEBHOOK_INBOX_ENABLED (always false by default)
 *
 * Signature verification is structural-only (Motoko lacks HMAC/ECDSA).
 */

import type { ActorCompat } from "../../hooks/useActor";
import type {
  NormalizedWebhookEvent,
  WebhookInboxFilters,
  WebhookInboxStats,
  WebhookTestPayload,
  WebhookTestResult,
} from "./types";

/**
 * List normalized webhook events from the inbox, optionally filtered.
 * Returns newest events first when no `fromTimestamp`/`toTimestamp` filter
 * is supplied. `limit` is required on the filters object.
 */
export async function getWebhookInboxEvents(
  actor: ActorCompat,
  filters: WebhookInboxFilters,
): Promise<NormalizedWebhookEvent[]> {
  return actor.getWebhookInboxEvents(filters);
}

/**
 * Fetch a single normalized webhook event by id.
 * The backend returns an optional array; this returns null when empty.
 */
export async function getWebhookInboxEvent(
  actor: ActorCompat,
  id: string,
): Promise<NormalizedWebhookEvent | null> {
  const result = await actor.getWebhookInboxEvent(id);
  return result && result.length > 0 ? result[0] : null;
}

/**
 * Aggregate stats over the inbox (totals, last 24h, breakdowns).
 */
export async function getWebhookInboxStats(
  actor: ActorCompat,
): Promise<WebhookInboxStats> {
  return actor.getWebhookInboxStats();
}

/**
 * Inject a synthetic test webhook event into the inbox for a given provider.
 * Used by admin tooling to validate the inbox pipeline end-to-end.
 */
export async function sendTestWebhookEvent(
  actor: ActorCompat,
  provider: WebhookTestPayload,
): Promise<WebhookTestResult> {
  return actor.sendTestWebhookEvent(provider);
}

/**
 * Replay / inject an Instantly webhook payload into the public receiver.
 * Mirrors the backend `receiveInstantlyWebhook` public shared func that
 * providers POST to at /api/instantly/webhook.
 */
export async function receiveInstantlyWebhook(
  actor: ActorCompat,
  path: string,
  body: string,
  headers: [string, string][],
): Promise<WebhookTestResult> {
  return actor.receiveInstantlyWebhook(path, body, headers);
}

/**
 * Replay / inject a Smartlead webhook payload into the public receiver.
 * Mirrors the backend `receiveSmartleadWebhook` public shared func that
 * providers POST to at /api/smartlead/webhook.
 */
export async function receiveSmartleadWebhook(
  actor: ActorCompat,
  path: string,
  body: string,
  headers: [string, string][],
): Promise<WebhookTestResult> {
  return actor.receiveSmartleadWebhook(path, body, headers);
}
