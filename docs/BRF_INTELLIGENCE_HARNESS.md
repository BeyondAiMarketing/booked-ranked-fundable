# BRF Intelligence Harness

## Decision

Booked Ranked Fundable uses NVIDIA NeMo Agent Toolkit as its preferred orchestration harness and Nemotron through NVIDIA NIM as its primary reasoning engine. Other providers are fallbacks, not peers.

## Route order

```text
Application task
  -> private NeMo Agent Toolkit service
  -> direct NVIDIA NIM / Nemotron
  -> OpenRouter
  -> OpenAI / Netlify AI Gateway
  -> Anthropic / Netlify AI Gateway
```

A route is skipped when it is not configured. A failed route records its provider, model, latency, and sanitized error before the next route is attempted. JSON tasks must parse and pass task-specific validation before a provider is considered successful.

## Responsibilities

### NeMo Agent Toolkit

- Orchestrates multi-step reasoning and future tool use
- Maintains the BRF system prompt and execution discipline
- Becomes the first route after its private service is deployed
- Starts read-only; write tools require explicit registration and approval policy

### Nemotron / NVIDIA NIM

- Provides the immediately available primary inference route
- Handles audits, business strategy, background agent runs, and social-content logic
- Uses the reasoning model for complex work and the fast model for lighter classification

### Supabase

- Stores durable agent runs, outputs, booking/lead data, and future intelligence audit history
- Is not required for every synchronous inference request
- Never stores provider keys in browser-readable records

### Netlify Functions

- Keep provider credentials server-side
- Enforce request-size and origin/service-token controls
- Normalize prompts and context
- Validate provider output
- Return truthful provider/model/attempt metadata

## Current endpoints

- `POST /api/brf-intelligence` - protected general intelligence gateway
- `POST /api/agent-orchestrate` - protected orchestration endpoint
- `POST /api/nemotron-audit` - public evidence-grounded homepage audit
- `POST /api/social-content-intelligence` - protected social-content generation
- `run-brf-agent-background` - durable Supabase-backed background execution

## Safety invariants

- Never claim a publish, message, booking, funding result, ranking, or completed action without evidence.
- Never treat malformed JSON or an invalid task shape as a successful provider response.
- Never send provider credentials to the browser.
- Never let fallback providers run before NeMo and Nemotron.
- Never add write tools without idempotency, authorization, audit logging, and human-approval rules.

## Remaining rollout

1. Deploy `services/nemo-agent` to a private container host.
2. Configure `NEMO_AGENT_BASE_URL` and `NEMO_AGENT_SERVICE_TOKEN` in Netlify Functions scope.
3. Migrate the existing social-content generator UI to `social-content-intelligence`.
4. Move other browser-side LLM calls behind `brf-intelligence` or purpose-specific endpoints.
5. Add task tools incrementally for audits, CRM, social publishing, alerts, and appointments.
