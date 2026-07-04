# SendGrid Integration

## Official Docs
- https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
- https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/event
- https://www.twilio.com/docs/sendgrid/for-developers/tracking-events/getting-started-event-webhook-security-features
- https://www.twilio.com/docs/sendgrid/api-reference/how-to-use-the-sendgrid-v3-api/authentication
- https://www.twilio.com/docs/sendgrid/api-reference/how-to-use-the-sendgrid-v3-api/rate-limits

## Mail Send Endpoint
`POST https://api.sendgrid.com/v3/mail/send`
- EU endpoint if needed: `POST https://api.eu.sendgrid.com/v3/mail/send`

## Auth
- `Authorization: Bearer ${SENDGRID_API_KEY}`
- `Content-Type: application/json`

## Template Request Example
```json
{
  "personalizations": [
    {
      "to": [
        {
          "email": "customer@example.com",
          "name": "Customer"
        }
      ],
      "dynamic_template_data": {
        "first_name": "David",
        "cta_url": "https://your-domain.com/book"
      }
    }
  ],
  "from": {
    "email": "noreply@your-domain.com",
    "name": "BRF"
  },
  "template_id": "d-template-id"
}
```

## Plain Request Example
```json
{
  "personalizations": [
    {
      "to": [
        {
          "email": "customer@example.com"
        }
      ]
    }
  ],
  "from": {
    "email": "noreply@your-domain.com"
  },
  "subject": "Your roofing estimate",
  "content": [
    {
      "type": "text/plain",
      "value": "Thanks for contacting us. Here is the next step."
    }
  ]
}
```

## Event Webhook
SendGrid Event Webhook sends an array of event objects.

### Delivered
```json
[
  {
    "email": "customer@example.com",
    "timestamp": 1710000000,
    "smtp-id": "message-id@example.com",
    "event": "delivered",
    "category": ["lead-followup"],
    "sg_event_id": "event-id",
    "sg_message_id": "message-id",
    "response": "250 OK"
  }
]
```

### Bounce
```json
[
  {
    "email": "customer@example.com",
    "timestamp": 1710000001,
    "smtp-id": "message-id@example.com",
    "event": "bounce",
    "bounce_classification": "Invalid Address",
    "reason": "550 mailbox unavailable",
    "status": "5.1.1",
    "type": "bounce",
    "sg_event_id": "event-id",
    "sg_message_id": "message-id"
  }
]
```

### Open
```json
[
  {
    "email": "customer@example.com",
    "timestamp": 1710000002,
    "event": "open",
    "sg_machine_open": false,
    "category": ["lead-followup"],
    "sg_event_id": "event-id",
    "sg_message_id": "message-id",
    "useragent": "Mozilla/5.0",
    "ip": "192.0.2.1"
  }
]
```

## Signature Verification
- Webhook security headers:
  - `X-Twilio-Email-Event-Webhook-Signature: ${SIGNATURE}`
  - `X-Twilio-Email-Event-Webhook-Timestamp: ${TIMESTAMP}`
- Use raw request body and `SENDGRID_EVENT_WEBHOOK_PUBLIC_KEY` for signed webhook verification

## Rate Limits
- Rate headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- 429 error:
```json
{
  "errors": [
    {
      "field": null,
      "message": "rate limit exceeded"
    }
  ]
}
```

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All SendGrid integrations are behind the `SENDGRID_INTEGRATION_ENABLED` feature flag.
- Preserve raw body for signature verification.
- Store events idempotently by `sg_event_id` when available.
- Success: HTTP 202 Accepted means success. Success body may be empty. Parse JSON on error only.
- Do not log raw PII, tokens, auth headers, secrets, or full message bodies.
