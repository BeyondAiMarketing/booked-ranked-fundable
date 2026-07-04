# Google Business Profile Integration

## Official Docs
- https://developers.google.com/my-business/content/posts-data
- https://developers.google.com/my-business/content/review-data
- https://developers.google.com/my-business/content/implement-oauth
- https://developers.google.com/my-business/content/notification-setup
- https://developers.google.com/my-business/content/limits

## OAuth 2.0
- Header: `Authorization: Bearer ${GOOGLE_ACCESS_TOKEN}`
- `Content-Type: application/json`
- Required scope: `https://www.googleapis.com/auth/business.manage`
- Deprecated backward-compatible scope: `https://www.googleapis.com/auth/plus.business.manage`

## Reviews Endpoints
- List reviews:
  - `GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews`
- Get review:
  - `GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}`
- Reply:
  - `PUT https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply`
  - Request body:
    ```json
    {
      "comment": "Thank you for your feedback. We appreciate your business."
    }
    ```

## Local Posts Endpoint
- Create local post:
  - `POST https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/localPosts`
  - Request body:
    ```json
    {
      "languageCode": "en-US",
      "summary": "Free roof inspection this week.",
      "callToAction": {
        "actionType": "BOOK",
        "url": "https://your-domain.com/book"
      }
    }
    ```

## Pub/Sub Notifications
Google Business Profile does not use normal webhooks. It uses Google Cloud Pub/Sub.

### Notification Setup
1. Create Google Cloud Pub/Sub topic
2. Grant publisher permission to `mybusiness-api-pubsub@system.gserviceaccount.com`
3. Create push or pull subscription
4. Call:
   - `PATCH https://mybusinessnotifications.googleapis.com/v1/accounts/{accountId}/notificationSetting?updateMask=pubsubTopic`
   - Request body:
     ```json
     {
       "pubsubTopic": "projects/your-project/topics/your-topic"
     }
     ```

### Pub/Sub Push Payload
```json
{
  "message": {
    "data": "base64-encoded-json",
    "messageId": "1234567890",
    "publishTime": "2026-06-21T18:30:00Z",
    "attributes": {
      "eventType": "NEW_REVIEW"
    }
  },
  "subscription": "projects/your-project/subscriptions/gbp-review-subscription"
}
```

### Handler Notes
- Verify Pub/Sub authenticity or app-side verification token if configured
- Base64 decode `message.data`
- Parse decoded JSON tolerantly
- Use `message.messageId` as provider event ID
- Do not assume notification includes full review. Fetch changed entity after receiving notification

## Rate Limits
- Quota errors may return 429 or RESOURCE_EXHAUSTED
- Many GBP APIs are around 300 QPM
- Pace requests and back off

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All Google Business Profile integrations are behind the `GOOGLE_BUSINESS_PROFILE_INTEGRATION_ENABLED` feature flag.
- Do not store OAuth tokens unless encrypted secret storage exists.
- Use Pub/Sub, not fake webhooks.
- Do not log raw PII, tokens, auth headers, secrets, or full message bodies.
