/**
 * Google Business Profile client shells — reviews and local posts.
 * The backend performs OAuth 2.0 and API calls.
 *
 * Feature flag: GOOGLE_BUSINESS_PROFILE_INTEGRATION_ENABLED (always false by default)
 */

import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type {
  GoogleLocalPost,
  GooglePubSubPush,
  GoogleReview,
} from "./schemas";

const PLATFORM = "google_business_profile" as const;

/**
 * Parse a Google Cloud Pub/Sub push payload.
 * The message.data field is base64-encoded JSON.
 */
export function parsePubSubPush(body: unknown): GooglePubSubPush {
  if (!body || typeof body !== "object") {
    throw new IntegrationError(
      "Invalid Pub/Sub push: expected object",
      PLATFORM,
    );
  }

  const b = body as Record<string, unknown>;

  if (!b.message || typeof b.message !== "object") {
    throw new IntegrationError(
      "Invalid Pub/Sub push: missing message",
      PLATFORM,
    );
  }

  return body as GooglePubSubPush;
}

/**
 * Decode the base64 data from a Pub/Sub message.
 */
export function decodePubSubData(push: GooglePubSubPush): unknown {
  const data = push.message.data;
  if (!data) return null;

  try {
    const decoded = atob(data);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Extract the provider event ID from a Pub/Sub push.
 * Uses message.messageId for idempotency.
 */
export function getPubSubEventId(push: GooglePubSubPush): string {
  return push.message.messageId;
}

/**
 * Build a review reply request for the backend.
 * The backend will PUT to:
 * https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply
 */
export function buildReviewReplyRequest(
  accountId: string,
  locationId: string,
  reviewId: string,
  comment: string,
): {
  action: "reply_to_review";
  accountId: string;
  locationId: string;
  reviewId: string;
  comment: string;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  return {
    action: "reply_to_review",
    accountId,
    locationId,
    reviewId,
    comment,
  };
}

/**
 * Build a local post creation request for the backend.
 * The backend will POST to:
 * https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/localPosts
 */
export function buildLocalPostRequest(
  accountId: string,
  locationId: string,
  post: GoogleLocalPost,
): {
  action: "create_local_post";
  accountId: string;
  locationId: string;
  post: GoogleLocalPost;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  return {
    action: "create_local_post",
    accountId,
    locationId,
    post,
  };
}

/**
 * Build a reviews list request for the backend.
 */
export function buildListReviewsRequest(
  accountId: string,
  locationId: string,
): { action: "list_reviews"; accountId: string; locationId: string } {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  return {
    action: "list_reviews",
    accountId,
    locationId,
  };
}
