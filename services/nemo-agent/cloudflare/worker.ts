import { Container, getContainer } from "@cloudflare/containers";
import { env as workerEnv } from "cloudflare:workers";

declare global {
  interface Env {
    BRF_NEMO_CONTAINER: DurableObjectNamespace<BrfNemoContainer>;
    NVIDIA_API_KEY: string;
    NEMO_AGENT_SERVICE_TOKEN: string;
    BRF_NEMOTRON_REASONING_MODEL?: string;
  }
}

const MAX_REQUEST_BYTES = 150_000;
const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b";

export class BrfNemoContainer extends Container {
  defaultPort = 8000;
  requiredPorts = [8000];
  sleepAfter = "30m";
  enableInternet = true;
  envVars = {
    NVIDIA_API_KEY: workerEnv.NVIDIA_API_KEY,
    BRF_NEMOTRON_REASONING_MODEL:
      workerEnv.BRF_NEMOTRON_REASONING_MODEL || DEFAULT_MODEL,
    PORT: "8000",
  };

  override onStart(): void {
    console.info("brf_nemo_container_started");
  }

  override onError(error: string): void {
    console.error("brf_nemo_container_error", error);
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function constantTimeEqual(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < maxLength; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function isAuthorized(request: Request, serviceToken: string): boolean {
  if (!serviceToken || serviceToken.length < 32) return false;
  const authorization = request.headers.get("authorization") || "";
  return constantTimeEqual(authorization, `Bearer ${serviceToken}`);
}

function requestLength(request: Request): number {
  return Number(request.headers.get("content-length") || 0);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!isAuthorized(request, env.NEMO_AGENT_SERVICE_TOKEN)) {
      return json({ ok: false, error: "Unauthorized." }, 401);
    }

    if (url.pathname === "/healthz" && request.method === "GET") {
      return json({ ok: true, service: "brf-nemo-gateway" });
    }

    if (url.pathname !== "/v1/chat/completions" || request.method !== "POST") {
      return json({ ok: false, error: "Route not found." }, 404);
    }

    if (requestLength(request) > MAX_REQUEST_BYTES) {
      return json({ ok: false, error: "Request is too large." }, 413);
    }

    const headers = new Headers(request.headers);
    headers.delete("authorization");
    headers.delete("cf-connecting-ip");
    headers.delete("x-forwarded-for");
    headers.set("x-brf-correlation-id", crypto.randomUUID());

    const forwarded = new Request(request, { headers });
    const container = getContainer(env.BRF_NEMO_CONTAINER, "primary");

    try {
      return await container.fetch(forwarded);
    } catch (error) {
      console.error(
        "brf_nemo_gateway_error",
        error instanceof Error ? error.message : String(error),
      );
      return json({ ok: false, error: "NeMo container is unavailable." }, 503);
    }
  },
} satisfies ExportedHandler<Env>;
