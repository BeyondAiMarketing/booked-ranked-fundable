import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRagBrain } from "@/hooks/useRagBrain";
import type {
  AgentNodeRun,
  AgentNodeType,
  AutomationConfig,
  AutomationTrigger,
} from "@/types/ragBrain";
import {
  Bot,
  CheckCircle2,
  ClipboardCopy,
  Loader2,
  RefreshCw,
  Settings2,
  Sparkles,
  ToggleRight,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const NODE_META: Record<
  AgentNodeType,
  { label: string; description: string; icon: string; color: string }
> = {
  LeadEnrichment: {
    label: "Lead Enrichment",
    description:
      "Enrich lead data with business info, social profiles, and intent signals.",
    icon: "🎯",
    color: "text-cyan-400",
  },
  ProposalGenerator: {
    label: "Proposal Generator",
    description:
      "Generate a tailored service proposal from lead and niche context.",
    icon: "📝",
    color: "text-violet-400",
  },
  FollowUpWriter: {
    label: "Follow-Up Writer",
    description: "Write conversion-optimized follow-up email sequences.",
    icon: "✉️",
    color: "text-sky-400",
  },
  ReviewResponder: {
    label: "Review Responder",
    description:
      "Draft professional responses to Google, Yelp, and Facebook reviews.",
    icon: "⭐",
    color: "text-amber-400",
  },
  SocialPostCreator: {
    label: "Social Post Creator",
    description:
      "Create niche-specific social media posts ready for scheduling.",
    icon: "📱",
    color: "text-fuchsia-400",
  },
  CallSummarizer: {
    label: "Call Summarizer",
    description:
      "Summarize call transcripts into structured CRM notes with action items.",
    icon: "📞",
    color: "text-emerald-400",
  },
  ObjectionHandler: {
    label: "Objection Handler",
    description:
      "Generate rebuttal scripts for common sales objections by niche.",
    icon: "🛡️",
    color: "text-rose-400",
  },
  ReportNarrator: {
    label: "Report Narrator",
    description: "Write an AI-generated narrative summary from analytics data.",
    icon: "📊",
    color: "text-indigo-400",
  },
};

const AUTOMATION_META: Record<
  AutomationTrigger,
  { label: string; description: string; icon: string }
> = {
  DocumentUploaded: {
    label: "Document Upload → CRM Note",
    description: "Auto-summarize uploaded documents and log them as CRM notes.",
    icon: "📄",
  },
  TrialActivated: {
    label: "Trial Activated → Proposal",
    description:
      "Auto-generate a tailored proposal when a new trial account activates.",
    icon: "🚀",
  },
  CallLogCreated: {
    label: "Call Log → Follow-Up Email",
    description:
      "Auto-write a follow-up email after every call log is recorded.",
    icon: "📬",
  },
};

export default function AdminAgentWorkflowRunnerPage() {
  const {
    runAgentNode,
    getAutomationConfigs,
    saveAutomationConfig,
    isLoading,
  } = useRagBrain();

  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [outputs, setOutputs] = useState<Record<string, AgentNodeRun[]>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [automations, setAutomations] = useState<AutomationConfig[]>([]);

  const loadAutomations = useCallback(async () => {
    const configs = await getAutomationConfigs();
    if (configs) setAutomations(configs);
  }, [getAutomationConfigs]);

  useEffect(() => {
    loadAutomations();
  }, [loadAutomations]);

  const handleRun = async (nodeType: AgentNodeType) => {
    const input = inputs[nodeType] ?? "";
    if (!input.trim()) {
      toast.error("Enter input data before running");
      return;
    }
    setRunning((s) => ({ ...s, [nodeType]: true }));
    const run = await runAgentNode(nodeType, input);
    setRunning((s) => ({ ...s, [nodeType]: false }));
    if (run) {
      setOutputs((prev) => ({
        ...prev,
        [nodeType]: [run, ...(prev[nodeType] ?? [])].slice(0, 5),
      }));
      toast.success(`${NODE_META[nodeType].label} completed`);
    } else {
      toast.error("Agent run failed");
    }
  };

  const handleAutomationToggle = async (config: AutomationConfig) => {
    const updated = { ...config, isEnabled: !config.isEnabled };
    await saveAutomationConfig(updated);
    setAutomations((prev) =>
      prev.map((a) => (a.trigger === config.trigger ? updated : a)),
    );
    toast.success(
      `${AUTOMATION_META[config.trigger].label} ${
        updated.isEnabled ? "enabled" : "disabled"
      }`,
    );
  };

  const handleApprovalToggle = async (config: AutomationConfig) => {
    const updated = { ...config, requiresApproval: !config.requiresApproval };
    await saveAutomationConfig(updated);
    setAutomations((prev) =>
      prev.map((a) => (a.trigger === config.trigger ? updated : a)),
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
            boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)",
          }}
        >
          <Bot className="h-5 w-5 text-[oklch(0.62_0.2_200)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Agent Workflow Runner
          </h1>
          <p className="text-sm text-muted-foreground">
            Run AI agent nodes and manage smart automations
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Agent Nodes Grid */}
        <div className="xl:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Agent Nodes
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.keys(NODE_META) as AgentNodeType[]).map(
              (nodeType, idx) => {
                const meta = NODE_META[nodeType];
                const nodeRuns = outputs[nodeType] ?? [];
                const latestRun = nodeRuns[0];
                return (
                  <Card
                    key={nodeType}
                    className="border border-border/60 bg-card/80 p-4 backdrop-blur-sm"
                    data-ocid={`agent.node.item.${idx + 1}`}
                  >
                    <div className="mb-3 flex items-start gap-2">
                      <span className="text-xl">{meta.icon}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-sm font-semibold ${meta.color}`}>
                          {meta.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {meta.description}
                        </p>
                      </div>
                    </div>

                    <Textarea
                      value={inputs[nodeType] ?? ""}
                      onChange={(e) =>
                        setInputs((s) => ({ ...s, [nodeType]: e.target.value }))
                      }
                      placeholder="Enter input data..."
                      rows={3}
                      className="mb-3 text-xs"
                      data-ocid={`agent.node.input.${idx + 1}`}
                    />

                    <Button
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => handleRun(nodeType)}
                      disabled={running[nodeType] || isLoading}
                      data-ocid={`agent.node.run_button.${idx + 1}`}
                    >
                      {running[nodeType] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Zap className="h-3.5 w-3.5" />
                      )}
                      {running[nodeType] ? "Running..." : "Run Agent"}
                    </Button>

                    {/* Latest output */}
                    {latestRun && (
                      <div className="mt-3 rounded-lg border border-border/40 bg-muted/20 p-3">
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">
                              Last output
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                latestRun.outputData,
                              );
                              toast.success("Copied");
                            }}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Copy output"
                            data-ocid={`agent.node.copy_button.${idx + 1}`}
                          >
                            <ClipboardCopy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <ScrollArea className="h-24">
                          <p className="text-xs text-muted-foreground">
                            {latestRun.outputData}
                          </p>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Recent runs count */}
                    {nodeRuns.length > 1 && (
                      <p className="mt-2 text-right text-xs text-muted-foreground">
                        {nodeRuns.length - 1} earlier run
                        {nodeRuns.length > 2 ? "s" : ""}
                      </p>
                    )}
                  </Card>
                );
              },
            )}
          </div>
        </div>

        {/* Automation Config Panel */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <Settings2 className="h-3.5 w-3.5" /> Smart Automations
          </h2>
          <div className="space-y-3">
            {automations.length === 0 && !isLoading && (
              <div
                className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
                data-ocid="agent.automations_empty_state"
              >
                No automations configured
              </div>
            )}
            {automations.map((auto, i) => {
              const meta = AUTOMATION_META[auto.trigger];
              return (
                <Card
                  key={auto.trigger}
                  className="border border-border/60 bg-card/80 p-4 backdrop-blur-sm"
                  data-ocid={`agent.automation.item.${i + 1}`}
                >
                  <div className="mb-3 flex items-start gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {meta.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ToggleRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Enabled
                        </span>
                      </div>
                      <Switch
                        checked={auto.isEnabled}
                        onCheckedChange={() => handleAutomationToggle(auto)}
                        data-ocid={`agent.automation.enabled_toggle.${i + 1}`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Requires Approval
                        </span>
                      </div>
                      <Switch
                        checked={auto.requiresApproval}
                        onCheckedChange={() => handleApprovalToggle(auto)}
                        data-ocid={`agent.automation.approval_toggle.${i + 1}`}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        auto.isEnabled
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {auto.isEnabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </Card>
              );
            })}

            <Button
              variant="ghost"
              size="sm"
              onClick={loadAutomations}
              className="w-full gap-2"
              data-ocid="agent.automations_refresh_button"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
