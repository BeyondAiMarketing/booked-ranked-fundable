import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Mic,
  Play,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Skeleton } from "../components/ui/skeleton";
import { useN8nWorkflow } from "../hooks/useN8nWorkflow";
import type {
  WorkflowDef,
  WorkflowExecution,
  WorkflowTriggerRequest,
} from "../types/n8nWorkflow";

const STATUS_STYLES: Record<string, string> = {
  Success:
    "bg-[oklch(0.62_0.18_155/0.12)] text-[oklch(0.72_0.18_155)] border-[oklch(0.62_0.18_155/0.3)]",
  Running:
    "bg-[oklch(0.62_0.2_200/0.12)] text-[oklch(0.72_0.2_200)] border-[oklch(0.62_0.2_200/0.3)]",
  Failed:
    "bg-[oklch(0.6_0.22_25/0.12)] text-[oklch(0.72_0.18_25)] border-[oklch(0.6_0.22_25/0.3)]",
  Timeout:
    "bg-[oklch(0.72_0.18_75/0.12)] text-[oklch(0.82_0.16_75)] border-[oklch(0.72_0.18_75/0.3)]",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "Success") return <CheckCircle2 className="w-3 h-3" />;
  if (status === "Running") return <Loader2 className="w-3 h-3 animate-spin" />;
  if (status === "Failed") return <XCircle className="w-3 h-3" />;
  return <Activity className="w-3 h-3" />;
}

function fmtTs(ts: bigint) {
  return new Date(Number(ts)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const TENANT_ID = "client";

const SEED_WORKFLOWS: WorkflowDef[] = [
  {
    id: "wf-1",
    name: "Lead Follow-up Sequence",
    description:
      "Send a personalized 3-email follow-up sequence to new leads automatically.",
    tags: ["leads", "email", "automation"],
    scope: "AllClients",
    workflowJson: "{}",
    isActive: true,
    createdAt: BigInt(Date.now() - 30 * 86400000),
    createdBy: "admin",
    pushedToAccounts: 12,
  },
  {
    id: "wf-2",
    name: "Review Request Campaign",
    description:
      "Automatically request a Google review 24 hours after a completed job.",
    tags: ["reviews", "sms", "reputation"],
    scope: "AllClients",
    workflowJson: "{}",
    isActive: true,
    createdAt: BigInt(Date.now() - 14 * 86400000),
    createdBy: "admin",
    pushedToAccounts: 8,
  },
  {
    id: "wf-3",
    name: "Weekly Content Batch",
    description:
      "Generate and schedule 5 social posts every Monday morning for your niche.",
    tags: ["social", "content", "scheduler"],
    scope: "ProTier",
    workflowJson: "{}",
    isActive: true,
    createdAt: BigInt(Date.now() - 7 * 86400000),
    createdBy: "admin",
    pushedToAccounts: 4,
  },
];

export default function ClientWorkflowAgentPage() {
  const { getWorkflowDefs, triggerWorkflow, getExecutionLog, isLoading } =
    useN8nWorkflow();
  const [workflows, setWorkflows] = useState<WorkflowDef[]>(SEED_WORKFLOWS);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [triggerTarget, setTriggerTarget] = useState<WorkflowDef | null>(null);
  const [customNote, setCustomNote] = useState("");
  const [triggerResult, setTriggerResult] = useState<WorkflowExecution | null>(
    null,
  );
  const [voicePrompt, setVoicePrompt] = useState("");

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional load-on-mount
  useEffect(() => {
    Promise.all([getWorkflowDefs(), getExecutionLog(TENANT_ID)]).then(
      ([defs, logs]) => {
        if (defs && defs.length > 0) setWorkflows(defs);
        if (logs) setExecutions(logs.slice(0, 10));
        setLoadingData(false);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrigger = useCallback(async () => {
    if (!triggerTarget) return;
    const req: WorkflowTriggerRequest = {
      workflowId: triggerTarget.id,
      tenantId: TENANT_ID,
      triggeredBy: "client",
      inputVars: customNote ? { note: customNote } : {},
    };
    const result = await triggerWorkflow(req);
    setTriggerResult(result as WorkflowExecution | null);
    if (result)
      setExecutions((prev) => [
        result as WorkflowExecution,
        ...prev.slice(0, 9),
      ]);
  }, [triggerTarget, triggerWorkflow, customNote]);

  const handleVoiceSubmit = useCallback(() => {
    if (!voicePrompt.trim()) return;
    const matched = workflows.find((wf) =>
      voicePrompt.toLowerCase().includes(wf.name.toLowerCase().split(" ")[0]),
    );
    if (matched) setTriggerTarget(matched);
    setVoicePrompt("");
  }, [voicePrompt, workflows]);

  const activeCount = workflows.filter((w) => w.isActive).length;

  return (
    <div data-ocid="workflow-agent.page" className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-5 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[oklch(0.75_0.2_200)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Your Automation Workflows
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeCount} active workflow{activeCount !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 md:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Voice agent prompt */}
          <div className="rounded-2xl bg-[oklch(0.62_0.2_200/0.06)] border border-[oklch(0.62_0.2_200/0.2)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Mic className="w-4 h-4 text-[oklch(0.72_0.2_200)]" />
              <span className="text-sm font-medium text-foreground">
                Tell your agent what to do
              </span>
            </div>
            <div className="flex gap-2">
              <textarea
                data-ocid="workflow-agent.voice_input.textarea"
                rows={2}
                value={voicePrompt}
                onChange={(e) => setVoicePrompt(e.target.value)}
                placeholder='e.g. "Trigger the lead follow-up sequence for my new HVAC leads…"'
                className="flex-1 min-w-0 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.2_200/0.5)]"
              />
              <Button
                data-ocid="workflow-agent.voice_submit.button"
                type="button"
                size="sm"
                onClick={handleVoiceSubmit}
                disabled={!voicePrompt.trim()}
                className="self-end bg-[oklch(0.62_0.2_200)] hover:bg-[oklch(0.55_0.2_200)] text-background shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Workflow grid */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Available Workflows
            </h2>
            {loadingData ? (
              <div
                data-ocid="workflow-agent.loading_state"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows
                  .filter((w) => w.isActive)
                  .map((wf, idx) => (
                    <Card
                      key={wf.id}
                      data-ocid={`workflow-agent.workflow.item.${idx + 1}`}
                      className="bg-card border-border hover:border-[oklch(0.62_0.2_200/0.5)] transition-colors"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[oklch(0.62_0.2_200/0.12)] border border-[oklch(0.62_0.2_200/0.25)] flex items-center justify-center">
                            <Zap className="w-4 h-4 text-[oklch(0.72_0.2_200)]" />
                          </div>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-[oklch(0.62_0.18_155/0.12)] text-[oklch(0.72_0.18_155)] border border-[oklch(0.62_0.18_155/0.3)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.18_155)] animate-pulse" />
                            Active
                          </span>
                        </div>
                        <CardTitle className="text-sm font-semibold text-foreground mt-2">
                          {wf.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {wf.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {wf.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Button
                          data-ocid={`workflow-agent.trigger_button.${idx + 1}`}
                          type="button"
                          size="sm"
                          className="w-full text-xs bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] text-[oklch(0.72_0.2_200)] hover:bg-[oklch(0.62_0.2_200/0.25)] transition-colors"
                          onClick={() => {
                            setTriggerTarget(wf);
                            setCustomNote("");
                            setTriggerResult(null);
                          }}
                        >
                          <Play className="w-3 h-3 mr-1.5" />
                          Trigger
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>

          {/* Execution history */}
          {executions.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Recent Executions
              </h2>
              <Card className="bg-card border-border">
                <div className="divide-y divide-border">
                  {executions.map((exec, idx) => (
                    <div
                      key={exec.id}
                      data-ocid={`workflow-agent.execution.item.${idx + 1}`}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border ${STATUS_STYLES[exec.status] ?? STATUS_STYLES.Running}`}
                      >
                        <StatusIcon status={exec.status} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {workflows.find((w) => w.id === exec.workflowId)
                            ?.name ?? exec.workflowId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fmtTs(exec.startedAt)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${STATUS_STYLES[exec.status] ?? STATUS_STYLES.Running}`}
                      >
                        <StatusIcon status={exec.status} />
                        {exec.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Trigger modal */}
      <Dialog
        open={!!triggerTarget}
        onOpenChange={(open) => {
          if (!open) {
            setTriggerTarget(null);
            setTriggerResult(null);
            setCustomNote("");
          }
        }}
      >
        <DialogContent
          data-ocid="workflow-agent.dialog"
          className="bg-card border-border max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Zap className="w-4 h-4 text-[oklch(0.72_0.2_200)]" />
              {triggerTarget?.name}
            </DialogTitle>
          </DialogHeader>

          {!triggerResult ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {triggerTarget?.description}
              </p>
              <div className="space-y-1.5">
                <label
                  htmlFor="workflow-custom-note"
                  className="text-sm font-medium text-foreground"
                >
                  Optional note
                </label>
                <textarea
                  id="workflow-custom-note"
                  data-ocid="workflow-agent.custom_note.textarea"
                  rows={3}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Add any context for this workflow run…"
                  className="w-full rounded-xl bg-background border border-border text-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  data-ocid="workflow-agent.cancel_button"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTriggerTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="workflow-agent.confirm_button"
                  type="button"
                  size="sm"
                  disabled={isLoading}
                  onClick={handleTrigger}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Running…
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      Run Workflow
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                data-ocid={`workflow-agent.${triggerResult.status === "Success" ? "success_state" : "error_state"}`}
                className={`rounded-xl p-4 border ${
                  triggerResult.status === "Success"
                    ? "bg-[oklch(0.62_0.18_155/0.1)] border-[oklch(0.62_0.18_155/0.3)]"
                    : "bg-[oklch(0.6_0.22_25/0.1)] border-[oklch(0.6_0.22_25/0.3)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {triggerResult.status === "Success" ? (
                    <CheckCircle2 className="w-4 h-4 text-[oklch(0.72_0.18_155)]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[oklch(0.72_0.18_25)]" />
                  )}
                  <span
                    className={`text-sm font-semibold ${triggerResult.status === "Success" ? "text-[oklch(0.72_0.18_155)]" : "text-[oklch(0.72_0.18_25)]"}`}
                  >
                    {triggerResult.status === "Success"
                      ? "Workflow executed successfully"
                      : "Workflow failed"}
                  </span>
                </div>
                {triggerResult.outputData && (
                  <p className="text-xs text-muted-foreground">
                    {triggerResult.outputData}
                  </p>
                )}
                {triggerResult.errorMessage && (
                  <p className="text-xs text-destructive">
                    {triggerResult.errorMessage}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  data-ocid="workflow-agent.close_button"
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setTriggerTarget(null);
                    setTriggerResult(null);
                    setCustomNote("");
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
