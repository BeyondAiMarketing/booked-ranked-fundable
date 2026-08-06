# BRF NeMo Agent Toolkit Service

This directory contains the containerized NVIDIA NeMo Agent Toolkit runtime for Booked Ranked Fundable. It is deliberately separate from the Netlify frontend and functions because Netlify does not host a continuously running Python service.

## Role in the intelligence harness

The server-side BRF router uses this order:

1. Private NeMo Agent Toolkit service (`nemo-agent`)
2. Direct NVIDIA NIM / Nemotron (`nvidia-nim`)
3. OpenRouter
4. OpenAI or Netlify AI Gateway
5. Anthropic or Netlify AI Gateway

The NeMo service is the preferred orchestration harness. Direct Nemotron is the immediate primary route whenever the private service is not deployed or reachable. Fallback providers are never called before those two NVIDIA paths.

## Python service environment

- `NVIDIA_API_KEY` - NVIDIA hosted NIM inference key
- `BRF_NEMOTRON_REASONING_MODEL` - optional; defaults to `nvidia/nemotron-3-super-120b-a12b`
- `PORT` - service port, normally injected by the hosting platform

The service should be private or protected by an ingress/reverse proxy. That ingress must enforce the same bearer token configured in Netlify as `NEMO_AGENT_SERVICE_TOKEN`.

## Netlify Functions environment

- `NEMO_AGENT_BASE_URL` - private HTTPS URL of this service
- `NEMO_AGENT_SERVICE_TOKEN` - private bearer token enforced by the service ingress
- `NEMO_AGENT_CHAT_PATH` - optional; defaults to `/v1/chat/completions`
- `NVIDIA_API_KEY` - direct Nemotron fallback and current production route
- `BRF_NEMOTRON_REASONING_MODEL` - optional reasoning-model override
- `NVIDIA_NEMOTRON_MODEL` - optional fast-model override
- `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` - optional later fallbacks
- `BRF_INTELLIGENCE_SERVICE_TOKEN` - optional server-to-server access to protected BRF endpoints
- `BRF_ALLOWED_ORIGINS` - optional comma-separated non-site origins

## Local run

```bash
cd services/nemo-agent
uv venv --python 3.13
source .venv/bin/activate
uv pip install .
export NVIDIA_API_KEY=nvapi-example
nat serve --config_file=configs/brf_agent.yml
```

## Container run

```bash
docker build -t brf-nemo-agent .
docker run --rm -p 8000:8000 \
  -e NVIDIA_API_KEY \
  -e BRF_NEMOTRON_REASONING_MODEL \
  -e PORT=8000 \
  brf-nemo-agent
```

## Current safety boundary

The initial NeMo workflow is read-only and has no action tools. It can reason over supplied audit, appointment, content, lead, and demo-session context. Supabase writes, publishing actions, owner alerts, Vapi calls, and CRM changes must be registered one at a time with explicit permissions, idempotency, human approval rules, and audit logging.
