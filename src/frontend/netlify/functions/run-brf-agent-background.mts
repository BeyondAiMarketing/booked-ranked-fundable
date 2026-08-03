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

interface NvidiaResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
}

function getConfig(): { supabaseUrl: string; serviceKey: string; apiKey: string; model: string; baseUrl: string } {
  const supabaseUrl = Netlify.env.get("SUPABASE_URL")?.replace(/\/$/, "");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const apiKey = Netlify.env.get("NVIDIA_API_KEY");
  const model = Netlify.env.get("BEYOND_AI_MODEL") || "nvidia/nemotron-3-super-120b-a12b";
  const baseUrl = (Netlify.env.get("NIM_BASE_URL") || "https://integrate.api.nvidia.com/v1").replace(/\/$/, "");
  if (!supabaseUrl || !serviceKey) throw new Error("SUPABASE_NOT_CONFIGURED");
  if (!apiKey) throw new Error("PROVIDER_NOT_CONFIGURED:NVIDIA_API_KEY");
  return { supabaseUrl, serviceKey, apiKey, model, baseUrl };
}

function headers(serviceKey: string): Record<string, string> {
  return {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json",
  };
}

function parseJson(text: string): Record<string, unknown> {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
    }
    throw new Error("MODEL_INVALID_JSON");
  }
}

function systemPrompt(): string {
  return `You are BRF Intelligence, the operating analyst for Booked Ranked Fundable.
Use only supplied business data, live audit evidence, appointment details, and delivery results.
Never invent rankings, traffic, revenue, reviews, licenses, guarantees, completed actions, or performance scores.
Return valid JSON only with this exact structure:
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

async function updateRun(
  config: ReturnType<typeof getConfig>,
  runId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/brf_agent_runs?id=eq.${encodeURIComponent(runId)}`, {
    method: "PATCH",
    headers: { ...headers(config.serviceKey), prefer: "return=minimal" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
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
    if (!runResponse.ok) throw new Error(`RUN_LOOKUP_FAILED:${runResponse.status}`);
    const runs = (await runResponse.json()) as AgentRunRow[];
    const run = runs[0];
    if (!run || !["queued", "waiting_for_provider"].includes(run.status)) return;

    const attempt = run.attempts + 1;
    await updateRun(config, run.id, {
      status: "running",
      attempts: attempt,
      model: config.model,
      provider: "nvidia",
      started_at: new Date().toISOString(),
      error: null,
    });

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        stream: false,
        temperature: 0.2,
        max_tokens: 3500,
        messages: [
          { role: "system", content: systemPrompt() },
          { role: "user", content: JSON.stringify({ task_type: run.task_type, context: run.input }) },
        ],
      }),
      signal: AbortSignal.timeout(90_000),
    });

    const payload = (await response.json()) as NvidiaResponse;
    if (!response.ok) {
      throw new Error(payload.error?.message || `PROVIDER_ERROR:${response.status}`);
    }
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("PROVIDER_EMPTY_RESPONSE");
    const output = parseJson(content);

    await updateRun(config, run.id, {
      status: "complete",
      output,
      finished_at: new Date().toISOString(),
      error: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!runId) return;
    try {
      const config = getConfig();
      const providerMissing = message.startsWith("PROVIDER_NOT_CONFIGURED");
      await updateRun(config, runId, {
        status: providerMissing ? "waiting_for_provider" : "failed",
        error: message.slice(0, 2000),
        finished_at: providerMissing ? null : new Date().toISOString(),
      });
    } catch {
      console.error("BRF agent worker failed", { runId, error: message });
    }
  }
};
