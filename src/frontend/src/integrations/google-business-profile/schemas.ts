/**
 * Google Business Profile schemas — Pub/Sub push and API responses.
 *
 * Docs:
 * - https://developers.google.com/my-business/content/posts-data
 * - https://developers.google.com/my-business/content/review-data
 * - https://developers.google.com/my-business/content/notification-setup
 *
 * Important: Google Business Profile does not use normal webhooks.
 * It uses Google Cloud Pub/Sub notifications.
 */

export interface GooglePubSubMessage {
  data?: string; // base64-encoded JSON
  messageId: string;
  publishTime?: string;
  attributes?: Record<string, string>;
  [key: string]: unknown;
}

export interface GooglePubSubPush {
  message: GooglePubSubMessage;
  subscription?: string;
  [key: string]: unknown;
}

export interface GoogleReview {
  reviewId?: string;
  reviewer?: { displayName?: string };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  [key: string]: unknown;
}

export interface GoogleLocalPost {
  name?: string;
  languageCode?: string;
  summary?: string;
  callToAction?: {
    actionType?: string;
    url?: string;
  };
  [key: string]: unknown;
}
