# BRF NeMo Agent Toolkit Service

This directory contains the Python runtime for NVIDIA NeMo Agent Toolkit. It is intentionally separate from the Netlify frontend and Node functions.

## Environment variables

Set these on the Python service:

- `NVIDIA_API_KEY` — NVIDIA hosted inference key
- `BRF_AGENT_SERVICE_TOKEN` — private bearer token required by the service ingress or reverse proxy
- `PORT` — hosting platform port, normally injected automatically

Set these in the BRF Netlify project, Functions scope only:

- `NEMO_AGENT_BASE_URL` — deployed HTTPS URL of this service
- `NEMO_AGENT_SERVICE_TOKEN` — same private bearer token
- `NEMO_AGENT_CHAT_PATH` — optional; defaults to `/v1/chat/completions`

## Local run

```bash
cd services/nemo-agent
uv venv --python 3.13
source .venv/bin/activate
uv pip install .
export NVIDIA_API_KEY=nvapi-...
nat serve --config_file=configs/brf_agent.yml
```

The NeMo Agent Toolkit server exposes Swagger documentation while running. Verify the chat endpoint shown by the deployed Toolkit version and set `NEMO_AGENT_CHAT_PATH` when it differs from the default.

## Container run

```bash
docker build -t brf-nemo-agent .
docker run --rm -p 8000:8000 -e NVIDIA_API_KEY -e PORT=8000 brf-nemo-agent
```

## BRF call path

The browser never calls this Python service directly. BRF calls:

```text
POST /api/agent-orchestrate
```

The Netlify function then calls the private NeMo Agent Toolkit service. This keeps the service URL, bearer token, and NVIDIA credentials off the client.

## First production workflow

The initial workflow is deliberately read-only. It can reason over supplied audit, appointment, SMS, and demo-session context, but it has no action tools yet. Tool registration for Supabase writes, owner alerts, and Vapi actions should be added one at a time with explicit permissions and audit logging.
