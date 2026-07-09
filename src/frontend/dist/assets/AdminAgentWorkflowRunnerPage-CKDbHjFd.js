import { r as reactExports, j as jsxRuntimeExports, aW as Bot, ai as Sparkles, at as Card, g as Textarea, B as Button, l as LoaderCircle, af as Zap, aA as CircleCheck, aX as ClipboardCopy, aQ as ue, aS as ScrollArea, ax as Settings2, aY as ToggleRight, aN as Switch, as as Badge, al as RefreshCw } from "./index-Dwzp0QDY.js";
import { u as useRagBrain } from "./useRagBrain-DdpIUOMg.js";
const NODE_META = {
  LeadEnrichment: {
    label: "Lead Enrichment",
    description: "Enrich lead data with business info, social profiles, and intent signals.",
    icon: "🎯",
    color: "text-cyan-400"
  },
  ProposalGenerator: {
    label: "Proposal Generator",
    description: "Generate a tailored service proposal from lead and niche context.",
    icon: "📝",
    color: "text-violet-400"
  },
  FollowUpWriter: {
    label: "Follow-Up Writer",
    description: "Write conversion-optimized follow-up email sequences.",
    icon: "✉️",
    color: "text-sky-400"
  },
  ReviewResponder: {
    label: "Review Responder",
    description: "Draft professional responses to Google, Yelp, and Facebook reviews.",
    icon: "⭐",
    color: "text-amber-400"
  },
  SocialPostCreator: {
    label: "Social Post Creator",
    description: "Create niche-specific social media posts ready for scheduling.",
    icon: "📱",
    color: "text-fuchsia-400"
  },
  CallSummarizer: {
    label: "Call Summarizer",
    description: "Summarize call transcripts into structured CRM notes with action items.",
    icon: "📞",
    color: "text-emerald-400"
  },
  ObjectionHandler: {
    label: "Objection Handler",
    description: "Generate rebuttal scripts for common sales objections by niche.",
    icon: "🛡️",
    color: "text-rose-400"
  },
  ReportNarrator: {
    label: "Report Narrator",
    description: "Write an AI-generated narrative summary from analytics data.",
    icon: "📊",
    color: "text-indigo-400"
  }
};
const AUTOMATION_META = {
  DocumentUploaded: {
    label: "Document Upload → CRM Note",
    description: "Auto-summarize uploaded documents and log them as CRM notes.",
    icon: "📄"
  },
  TrialActivated: {
    label: "Trial Activated → Proposal",
    description: "Auto-generate a tailored proposal when a new trial account activates.",
    icon: "🚀"
  },
  CallLogCreated: {
    label: "Call Log → Follow-Up Email",
    description: "Auto-write a follow-up email after every call log is recorded.",
    icon: "📬"
  }
};
function AdminAgentWorkflowRunnerPage() {
  const {
    runAgentNode,
    getAutomationConfigs,
    saveAutomationConfig,
    isLoading
  } = useRagBrain();
  const [inputs, setInputs] = reactExports.useState({});
  const [outputs, setOutputs] = reactExports.useState({});
  const [running, setRunning] = reactExports.useState({});
  const [automations, setAutomations] = reactExports.useState([]);
  const loadAutomations = reactExports.useCallback(async () => {
    const configs = await getAutomationConfigs();
    if (configs) setAutomations(configs);
  }, [getAutomationConfigs]);
  reactExports.useEffect(() => {
    loadAutomations();
  }, [loadAutomations]);
  const handleRun = async (nodeType) => {
    const input = inputs[nodeType] ?? "";
    if (!input.trim()) {
      ue.error("Enter input data before running");
      return;
    }
    setRunning((s) => ({ ...s, [nodeType]: true }));
    const run = await runAgentNode(nodeType, input);
    setRunning((s) => ({ ...s, [nodeType]: false }));
    if (run) {
      setOutputs((prev) => ({
        ...prev,
        [nodeType]: [run, ...prev[nodeType] ?? []].slice(0, 5)
      }));
      ue.success(`${NODE_META[nodeType].label} completed`);
    } else {
      ue.error("Agent run failed");
    }
  };
  const handleAutomationToggle = async (config) => {
    const updated = { ...config, isEnabled: !config.isEnabled };
    await saveAutomationConfig(updated);
    setAutomations(
      (prev) => prev.map((a) => a.trigger === config.trigger ? updated : a)
    );
    ue.success(
      `${AUTOMATION_META[config.trigger].label} ${updated.isEnabled ? "enabled" : "disabled"}`
    );
  };
  const handleApprovalToggle = async (config) => {
    const updated = { ...config, requiresApproval: !config.requiresApproval };
    await saveAutomationConfig(updated);
    setAutomations(
      (prev) => prev.map((a) => a.trigger === config.trigger ? updated : a)
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex h-10 w-10 items-center justify-center rounded-xl",
          style: {
            background: "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
            boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5 text-[oklch(0.62_0.2_200)]" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Agent Workflow Runner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Run AI agent nodes and manage smart automations" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
          " Agent Nodes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: Object.keys(NODE_META).map(
          (nodeType, idx) => {
            const meta = NODE_META[nodeType];
            const nodeRuns = outputs[nodeType] ?? [];
            const latestRun = nodeRuns[0];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border border-border/60 bg-card/80 p-4 backdrop-blur-sm",
                "data-ocid": `agent.node.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: meta.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `text-sm font-semibold ${meta.color}`, children: meta.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: meta.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      value: inputs[nodeType] ?? "",
                      onChange: (e) => setInputs((s) => ({ ...s, [nodeType]: e.target.value })),
                      placeholder: "Enter input data...",
                      rows: 3,
                      className: "mb-3 text-xs",
                      "data-ocid": `agent.node.input.${idx + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "w-full gap-2",
                      onClick: () => handleRun(nodeType),
                      disabled: running[nodeType] || isLoading,
                      "data-ocid": `agent.node.run_button.${idx + 1}`,
                      children: [
                        running[nodeType] ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
                        running[nodeType] ? "Running..." : "Run Agent"
                      ]
                    }
                  ),
                  latestRun && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg border border-border/40 bg-muted/20 p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-400" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-emerald-400", children: "Last output" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            navigator.clipboard.writeText(
                              latestRun.outputData
                            );
                            ue.success("Copied");
                          },
                          className: "text-muted-foreground hover:text-foreground",
                          "aria-label": "Copy output",
                          "data-ocid": `agent.node.copy_button.${idx + 1}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: latestRun.outputData }) })
                  ] }),
                  nodeRuns.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-right text-xs text-muted-foreground", children: [
                    nodeRuns.length - 1,
                    " earlier run",
                    nodeRuns.length > 2 ? "s" : ""
                  ] })
                ]
              },
              nodeType
            );
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3.5 w-3.5" }),
          " Smart Automations"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          automations.length === 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
              "data-ocid": "agent.automations_empty_state",
              children: "No automations configured"
            }
          ),
          automations.map((auto, i) => {
            const meta = AUTOMATION_META[auto.trigger];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "border border-border/60 bg-card/80 p-4 backdrop-blur-sm",
                "data-ocid": `agent.automation.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: meta.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: meta.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: meta.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Enabled" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          checked: auto.isEnabled,
                          onCheckedChange: () => handleAutomationToggle(auto),
                          "data-ocid": `agent.automation.enabled_toggle.${i + 1}`
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Requires Approval" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Switch,
                        {
                          checked: auto.requiresApproval,
                          onCheckedChange: () => handleApprovalToggle(auto),
                          "data-ocid": `agent.automation.approval_toggle.${i + 1}`
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs ${auto.isEnabled ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-border text-muted-foreground"}`,
                      children: auto.isEnabled ? "Active" : "Inactive"
                    }
                  ) })
                ]
              },
              auto.trigger
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: loadAutomations,
              className: "w-full gap-2",
              "data-ocid": "agent.automations_refresh_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                " Refresh"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminAgentWorkflowRunnerPage as default
};
