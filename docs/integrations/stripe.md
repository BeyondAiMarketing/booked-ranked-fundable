# Stripe Integration

## Official Docs
- https://docs.stripe.com/api/payment_intents/create
- https://docs.stripe.com/webhooks
- https://docs.stripe.com/webhooks/signature
- https://docs.stripe.com/rate-limits

## PaymentIntent Endpoint
`POST https://api.stripe.com/v1/payment_intents`

## Auth
- `Authorization: Bearer ${STRIPE_SECRET_KEY}`
- `Content-Type: application/x-www-form-urlencoded`

## Request Example
```
amount=5000&currency=usd&automatic_payment_methods[enabled]=true&metadata[lead_id]=lead_123&metadata[source]=brf
```

## Response Example
```json
{
  "id": "pi_3Example",
  "object": "payment_intent",
  "amount": 5000,
  "currency": "usd",
  "status": "requires_payment_method",
  "client_secret": "pi_3Example_secret_abc",
  "automatic_payment_methods": {
    "enabled": true
  },
  "metadata": {
    "lead_id": "lead_123",
    "source": "brf"
  }
}
```

## Webhook Events
Webhook signature header: `Stripe-Signature: ${STRIPE_SIGNATURE}`

Verification requires raw request body, `Stripe-Signature` header, and `STRIPE_WEBHOOK_SECRET`. Never verify with parsed JSON.

### Webhook Event Example
```json
{
  "id": "evt_123",
  "object": "event",
  "api_version": "2024-06-20",
  "created": 1710000000,
  "livemode": false,
  "pending_webhooks": 1,
  "request": {
    "id": "req_123",
    "idempotency_key": "key_123"
  },
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123",
      "object": "payment_intent",
      "amount": 5000,
      "currency": "usd",
      "status": "succeeded",
      "metadata": {
        "lead_id": "lead_123"
      }
    }
  }
}
```

### Important Events
- `payment_intent.created`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `charge.refunded`

## Raw Body Rule
Preserve raw body for Stripe signature verification. Never verify with parsed JSON.

## Rate Limits
- 429 Too Many Requests
- Capture `Stripe-Rate-Limited-Reason`
- Common values: `global-rate`, `endpoint-rate`, `global-concurrency`, `endpoint-concurrency`, `resource-specific`
- Use exponential backoff

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All Stripe integrations are behind the `STRIPE_INTEGRATION_ENABLED` feature flag.
- Use `event.id` for idempotency.
- Add Stripe client wrapper for PaymentIntents.
- Add webhook signature wrapper using official SDK if available.
- Do not log raw PII, tokens, auth headers, secrets, or full message bodies.
