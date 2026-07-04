# Twilio Integration

## Official Docs
- https://www.twilio.com/docs/messaging/guides/webhook-request
- https://www.twilio.com/docs/messaging/api/message-resource
- https://www.twilio.com/docs/usage/security#validating-requests
- https://www.twilio.com/docs/usage/requests-to-twilio
- https://www.twilio.com/docs/usage/rest-api-best-practices

## Send SMS Endpoint
`POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json`

## Auth
- `Authorization: Basic base64("${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}")`
- `Content-Type: application/x-www-form-urlencoded`
- Production alternative:
  - `Authorization: Basic base64("${TWILIO_API_KEY_SID}:${TWILIO_API_KEY_SECRET}")`

## Send Body Example
```
To=+15551234567&From=+15557654321&Body=Thanks for contacting us. Do you want to schedule your roofing estimate?&StatusCallback=https://your-domain.com/webhooks/twilio/status
```
Or using Messaging Service:
```
To=+15551234567&MessagingServiceSid=${TWILIO_MESSAGING_SERVICE_SID}&Body=Thanks for contacting us. Do you want to schedule your roofing estimate?
```

## Incoming SMS Webhook
Content-Type: `application/x-www-form-urlencoded`

Example payload:
```json
{
  "MessageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "SmsSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "SmsMessageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "AccountSid": "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "MessagingServiceSid": "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "From": "+15551234567",
  "To": "+15557654321",
  "Body": "I need a roof estimate",
  "NumMedia": "0",
  "MediaUrl0": "https://api.twilio.com/...",
  "MediaContentType0": "image/jpeg",
  "MessageStatus": "received",
  "NumSegments": "1"
}
```

## Signature Verification
- Signature header: `X-Twilio-Signature: ${TWILIO_SIGNATURE}`
- Use official Twilio SDK for validation if available
- Otherwise use Twilio HMAC-SHA1 validation with Auth Token, exact request URL, and all form params
- Twilio may add webhook fields without notice. Do not reject unknown fields

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All Twilio integrations are behind the `TWILIO_INTEGRATION_ENABLED` feature flag.
- Store webhook events idempotently by `MessageSid` or `SmsMessageSid` when available.
- Capture `Twilio-Concurrent-Requests`, `Twilio-Request-Duration`, `Twilio-Request-Id` when present.
- Use exponential backoff on 429.
- Do not log raw PII, tokens, auth headers, secrets, or full message bodies.
