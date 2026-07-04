# BRF Integration Architecture

## Overview
This directory contains documentation for all 8 external integrations used by Booked Ranked Fundable (BRF).

## Providers
| Provider | Feature Flag | Status | Doc |
|----------|-------------|--------|-----|
| n8n | N8N_INTEGRATION_ENABLED | Disabled | [n8n.md](n8n.md) |
| OpenAI | OPENAI_INTEGRATION_ENABLED | Disabled | [openai.md](openai.md) |
| Twilio | TWILIO_INTEGRATION_ENABLED | Disabled | [twilio.md](twilio.md) |
| SendGrid | SENDGRID_INTEGRATION_ENABLED | Disabled | [sendgrid.md](sendgrid.md) |
| Stripe | STRIPE_INTEGRATION_ENABLED | Disabled | [stripe.md](stripe.md) |
| Google Business Profile | GOOGLE_BUSINESS_PROFILE_INTEGRATION_ENABLED | Disabled | [google-business-profile.md](google-business-profile.md) |
| SerpApi | SERPAPI_INTEGRATION_ENABLED | Disabled | [serpapi.md](serpapi.md) |
| Vapi | VAPI_INTEGRATION_ENABLED | Disabled | [vapi.md](vapi.md) |

## Architecture
Frontend clients (TypeScript) -> Motoko backend (HTTP outcalls) -> External APIs

## Security
- No plaintext API keys stored in frontend
- XOR obfuscation for credentials in backend
- All integrations behind disabled feature flags by default
- Webhook signatures verified before processing
- Idempotency checks for webhook events

## Environment Variables
See each provider doc for specific variables.
