import {
  BrfIntelligenceError,
  runBrfIntelligence,
} from "./_shared/brf-intelligence.mts";

interface AgentDispatchRequest {
  agentRunId?: string;
  clientSessionId?: string;
}

interface AgentRunRow {
  id: string;
  demo_session_id: string | null;
  client_session_id: string | null;
  task_type: string;
  status: string;
  input: Record<string, unknown>;
  attempts: number;
  max_attempts: number;
}

function getConfig(): { supabaseUrl: string; serviceKey: string } {
  const supabaseUrl = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) throw new Error("SUPABASE_NOT_CONFIGURED");
  return { supabaseUrl, serviceKey };
}

function headers(serviceKey: string): Record<string, string> {
  return {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json",
  };
}

function systemPrompt(): string {
  return `Return valid JSON only with this exact structure:
{
  "executive_summary": string,
  "business_snapshot": {"strengths": string[], "risks": string[], "opportunities": string[]},
  "priority_actions": [{"priority": 1|2|3|4|5, "title": string, "reason": string, "next_step": string, "expected_business_effect": string}],
  "lead_follow_up": {"owner_summary": string, "recommended_message": string, "recommended_timing": string},
  "automation_plan": [{"trigger": string, "action": string, "human_approval_required": boolean}],
  "missing_inputs": string[],
  "confidence": "high"|"medium"|"low",
  "disclaimer": string
}
The disclaimer must say recommendations are based on available demo and homepage evidence and are not guaranteed outcomes.`;
}

function normalizeAgentOutput(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Provider returned an invalid agent result.");
  }
  const output = data as Record<string, unknown>;
  if (typeof output.executive_summary !== "string") {
    throw new Error("Provider result is missing an executive summary.");
  }
  if (!Array.isArray(output.priority_actions)) {
    throw new Error("Provider result is missing priority actions.");
  }
  if (!Array.isArray(output.missing_inputs)) {
    throw new Error("Provider result is missing the missing-inputs list.");
  }
  return output;
}

async function updateRun(
  config: ReturnType<typeof getConfig>,
  runId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const response = await fetch(
    `${config.supabaseUrl}/rest/v1/brf_agent_runs?id=eq.${encodeURIComponent(runId)}`,
    {
      method: "PATCH",
      headers: { ...headers(config.serviceKey), prefer: "return=minimal" },
      body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    },
  );
  if (!response.ok) throw new Error(`RUN_UPDATE_FAILED:${response.status}`);
}

export default async (request: Request): Promise<void> => {
  let runId = "";
  try {
    const input = (await request.json()) as AgentDispatchRequest;
    runId = String(input.agentRunId || "").trim();
    const clientSessionId = String(input.clientSessionId || "").trim();
    if (!runId || !clientSessionId) return;

    const config = getConfig();
    const runResponse = await fetch(
      `${config.supabaseUrl}/rest/v1/brf_agent_runs?id=eq.${encodeURIComponent(runId)}&client_session_id=eq.${encodeURIComponent(clientSessionId)}&select=id,demo_session_id,client_session_id,task_type,status,input,attempts,max_attempts`,
      { headers: headers(config.serviceKey) },
    );
    if (!runResponse.ok) {
      throw new Error(`RUN_LOOKUP_FAILED:${runResponse.status}`);
    }
    const runs = (await runResponse.json()) as AgentRunRow[];
    const run = runs[0];
    if (!run || !["queued", "waiting_for_provider"].includes(run.status)) return;

    const attempt = run.attempts + 1;
    await updateRun(config, run.id, {
      status: "running",
      attempts: attempt,
      started_at: new Date().toISOString(),
      error: null,
    });

    const result = await runBrfIntelligence({
      taskType: "orchestration",
      prompt: `Analyze this BRF agent task and produce the required operating intelligence.\nTask type: ${run.task_type}`,
      context: run.input,
      systemPrompt: systemPrompt(),
      responseFormat: "json",
      validateData: normalizeAgentOutput,
      maxTokens: 3500,
      timeoutMs: 90_000,
      correlationId: run.id,
    });

    const output =
      result.data && typeof result.data === "object" && !Array.isArray(result.data)
        ? {
            ...(result.data as Record<string, unknown>),
            _intelligence: {
              provider: result.provider,
              model: result.model,
              attempts: result.attempts,
              correlation_id: result.correlationId,
            },
          }
        : {
            result: result.data,
            _intelligence: {
              provider: result.provider,
              model: result.model,
              attempts: result.attempts,
              correlation_id: result.correlationId,
            },
          };

    await updateRun(config, run.id, {
      status: "complete",
      output,
      provider: result.provider,
      model: result.model,
      finished_at: result.completedAt,
      error: null,
    });
  } catch (error) {
    if (!runId) return;
    const message = error instanceof Error ? error.message : String(error);
    try {
      const config = getConfig();
      const noProvider =
        error instanceof BrfIntelligenceError &&
        error.code === "NO_PROVIDER_CONFIGURED";
      await updateRun(config, runId, {
        status: noProvider ? "waiting_for_provider" : "failed",
        error: message.slice(0, 2000),
        finished_at: noProvider ? null : new Date().toISOString(),
      });
    } catch {
      console.error("BRF agent worker failed", { runId, error: message });
    }
  }
};
