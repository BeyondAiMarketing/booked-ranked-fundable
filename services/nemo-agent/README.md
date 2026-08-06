# BRF NeMo Agent Toolkit Service

This directory contains the protected NVIDIA NeMo Agent Toolkit runtime for Booked Ranked Fundable.

Netlify remains the BRF application host and intelligence gateway. Netlify Functions do not run arbitrary, continuously available Docker images, so the existing Python service is deployed as a Cloudflare Container behind a token-authenticated Worker. The browser never contacts the Worker or container directly.

## Role in the intelligence harness

The server-side BRF router uses this order:

1. Private NeMo Agent Toolkit service (`nemo-agent`)
2. Direct NVIDIA NIM / Nemotron reasoning model (`nvidia-nim`)
3. Direct NVIDIA NIM / Nemotron fast model (`nvidia-nim-fast`)
4. OpenRouter
5. OpenAI or Netlify AI Gateway
6. Anthropic or Netlify AI Gateway

The NeMo service is the preferred orchestration harness. Direct Nemotron remains available when the container is sleeping, unavailable, or not configured.

## Protected runtime architecture

```text
BRF browser
    -> BRF Netlify Function
        Authorization: Bearer <NEMO_AGENT_SERVICE_TOKEN>
        -> Cloudflare Worker ingress
            -> one Cloudflare Container instance
                -> NVIDIA NIM / Nemotron
```

The Worker:

- accepts only authenticated requests;
- exposes only `POST /v1/chat/completions` and authenticated `GET /healthz`;
- enforces a request-size limit;
- strips the gateway bearer token before forwarding the request;
- injects `NVIDIA_API_KEY` into the container at startup;
- keeps one named container instance and lets it sleep after inactivity;
- records Worker and container errors through Cloudflare observability.

The initial NeMo workflow remains read-only and has no action tools.

## Local Python run

```bash
cd services/nemo-agent
uv venv --python 3.13
source .venv/bin/activate
uv pip install .
export NVIDIA_API_KEY=nvapi-example
nat serve --config_file=configs/brf_agent.yml
```

## Local Docker run

```bash
docker build -t brf-nemo-agent .
docker run --rm -p 8000:8000 \
  -e NVIDIA_API_KEY \
  -e BRF_NEMOTRON_REASONING_MODEL \
  -e PORT=8000 \
  brf-nemo-agent
```

## Cloudflare Container deployment

Cloudflare Containers requires a Workers Paid account and a running Docker-compatible CLI for image builds.

```bash
cd services/nemo-agent
npm install
npx wrangler whoami
```

Add the two Worker secrets. Use the same service token later in Netlify.

```bash
npx wrangler secret put NVIDIA_API_KEY
npx wrangler secret put NEMO_AGENT_SERVICE_TOKEN
```

Validate the Worker and deployment manifest:

```bash
npm run check
npm run validate
```

Deploy the Worker and container image:

```bash
npm run deploy
```

Wrangler returns a Worker HTTPS URL. Confirm the protected gateway:

```bash
curl -i \
  -H "Authorization: Bearer $NEMO_AGENT_SERVICE_TOKEN" \
  https://<worker-url>/healthz
```

Run an end-to-end chat test:

```bash
curl -sS \
  -H "Authorization: Bearer $NEMO_AGENT_SERVICE_TOKEN" \
  -H "Content-Type: application/json" \
  https://<worker-url>/v1/chat/completions \
  -d '{
    "model": "brf-agent",
    "messages": [{"role": "user", "content": "Return only: connected"}],
    "stream": false
  }'
```

## Connect the protected runtime to Netlify

Set these in the BRF Netlify project with **Functions** scope and **production** context:

- `NEMO_AGENT_BASE_URL=https://<worker-url>`
- `NEMO_AGENT_SERVICE_TOKEN=<the same Worker secret>`
- `NEMO_AGENT_CHAT_PATH=/v1/chat/completions`

The existing Netlify intelligence router automatically promotes the NeMo service to the first route after those variables are configured and a production deployment is published.

Other relevant Netlify variables:

- `NVIDIA_API_KEY` - direct Nemotron fallback
- `BRF_NEMOTRON_REASONING_MODEL` - optional reasoning-model override
- `NVIDIA_NEMOTRON_MODEL` - optional fast-model override
- `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` - optional later fallbacks
- `BRF_INTELLIGENCE_SERVICE_TOKEN` - optional server-to-server access to protected BRF endpoints
- `BRF_ALLOWED_ORIGINS` - optional comma-separated non-site origins

## Operational notes

- The first request after the container has slept may have cold-start latency.
- `max_instances` is intentionally set to one for the first production rollout.
- The container is constrained to North American regions and uses a `standard-1` instance.
- Increase instance count only after measuring concurrency and memory usage.
- Supabase writes, publishing actions, owner alerts, Vapi calls, and CRM changes must be registered one at a time with explicit permissions, idempotency, human approval rules, and audit logging.
