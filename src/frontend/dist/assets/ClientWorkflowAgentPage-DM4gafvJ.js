import { r as reactExports, j as jsxRuntimeExports, ah as Zap, b8 as Mic, B as Button, aF as ChevronRight, ay as Skeleton, av as Card, aA as CardHeader, aB as CardTitle, aw as CardContent, b9 as Play, aL as Dialog, aM as DialogContent, aN as DialogHeader, aO as DialogTitle, l as LoaderCircle, aC as CircleCheck, am as CircleX, ba as Activity } from "./index-CI0aYo5Z.js";
import { u as useN8nWorkflow } from "./useN8nWorkflow-BY1j6mQp.js";
const STATUS_STYLES = {
  Success: "bg-[oklch(0.62_0.18_155/0.12)] text-[oklch(0.72_0.18_155)] border-[oklch(0.62_0.18_155/0.3)]",
  Running: "bg-[oklch(0.62_0.2_200/0.12)] text-[oklch(0.72_0.2_200)] border-[oklch(0.62_0.2_200/0.3)]",
  Failed: "bg-[oklch(0.6_0.22_25/0.12)] text-[oklch(0.72_0.18_25)] border-[oklch(0.6_0.22_25/0.3)]",
  Timeout: "bg-[oklch(0.72_0.18_75/0.12)] text-[oklch(0.82_0.16_75)] border-[oklch(0.72_0.18_75/0.3)]"
};
function StatusIcon({ status }) {
  if (status === "Success") return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" });
  if (status === "Running") return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" });
  if (status === "Failed") return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3 h-3" });
}
function fmtTs(ts) {
  return new Date(Number(ts)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
const TENANT_ID = "client";
const SEED_WORKFLOWS = [
  {
    id: "wf-1",
    name: "Lead Follow-up Sequence",
    description: "Send a personalized 3-email follow-up sequence to new leads automatically.",
    tags: ["leads", "email", "automation"],
    scope: "AllClients",
    workflowJson: "{}",
    isActive: true,
    createdAt: BigInt(Date.now() - 30 * 864e5),
    createdBy: "admin",
    pushedToAccounts: 12
  },
  {
    id: "wf-2",
    name: "Review Request Campaign",
    description: "Automatically request a Google review 24 hours after a completed job.",
    tags: ["reviews", "sms", "reputation"],
    scope: "AllClients",
    workflowJson: "{}",
    isActive: true,
    createdAt: BigInt(Date.now() - 14 * 864e5),
    createdBy: "admin",
    pushedToAccounts: 8
  },
  {
    id: "wf-3",
    name: "Weekly Content Batch",
    description: "Generate and schedule 5 social posts every Monday morning for your niche.",
    tags: ["social", "content", "scheduler"],
    scope: "ProTier",
    workflowJson: "{}",
    isActive: true,
    createdAt: BigInt(Date.now() - 7 * 864e5),
    createdBy: "admin",
    pushedToAccounts: 4
  }
];
function ClientWorkflowAgentPage() {
  const { getWorkflowDefs, triggerWorkflow, getExecutionLog, isLoading } = useN8nWorkflow();
  const [workflows, setWorkflows] = reactExports.useState(SEED_WORKFLOWS);
  const [executions, setExecutions] = reactExports.useState([]);
  const [loadingData, setLoadingData] = reactExports.useState(true);
  const [triggerTarget, setTriggerTarget] = reactExports.useState(null);
  const [customNote, setCustomNote] = reactExports.useState("");
  const [triggerResult, setTriggerResult] = reactExports.useState(
    null
  );
  const [voicePrompt, setVoicePrompt] = reactExports.useState("");
  reactExports.useEffect(() => {
    Promise.all([getWorkflowDefs(), getExecutionLog(TENANT_ID)]).then(
      ([defs, logs]) => {
        if (defs && defs.length > 0) setWorkflows(defs);
        if (logs) setExecutions(logs.slice(0, 10));
        setLoadingData(false);
      }
    );
  }, []);
  const handleTrigger = reactExports.useCallback(async () => {
    if (!triggerTarget) return;
    const req = {
      workflowId: triggerTarget.id,
      tenantId: TENANT_ID,
      triggeredBy: "client",
      inputVars: customNote ? { note: customNote } : {}
    };
    const result = await triggerWorkflow(req);
    setTriggerResult(result);
    if (result)
      setExecutions((prev) => [
        result,
        ...prev.slice(0, 9)
      ]);
  }, [triggerTarget, triggerWorkflow, customNote]);
  const handleVoiceSubmit = reactExports.useCallback(() => {
    if (!voicePrompt.trim()) return;
    const matched = workflows.find(
      (wf) => voicePrompt.toLowerCase().includes(wf.name.toLowerCase().split(" ")[0])
    );
    if (matched) setTriggerTarget(matched);
    setVoicePrompt("");
  }, [voicePrompt, workflows]);
  const activeCount = workflows.filter((w) => w.isActive).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "workflow-agent.page", className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-5 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-[oklch(0.75_0.2_200)]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground", children: "Your Automation Workflows" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          activeCount,
          " active workflow",
          activeCount !== 1 ? "s" : "",
          " ",
          "available"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-[oklch(0.62_0.2_200/0.06)] border border-[oklch(0.62_0.2_200/0.2)] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-4 h-4 text-[oklch(0.72_0.2_200)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Tell your agent what to do" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              "data-ocid": "workflow-agent.voice_input.textarea",
              rows: 2,
              value: voicePrompt,
              onChange: (e) => setVoicePrompt(e.target.value),
              placeholder: 'e.g. "Trigger the lead follow-up sequence for my new HVAC leads…"',
              className: "flex-1 min-w-0 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.2_200/0.5)]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "workflow-agent.voice_submit.button",
              type: "button",
              size: "sm",
              onClick: handleVoiceSubmit,
              disabled: !voicePrompt.trim(),
              className: "self-end bg-[oklch(0.62_0.2_200)] hover:bg-[oklch(0.55_0.2_200)] text-background shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-3", children: "Available Workflows" }),
        loadingData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "workflow-agent.loading_state",
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
            children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, i))
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: workflows.filter((w) => w.isActive).map((wf, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            "data-ocid": `workflow-agent.workflow.item.${idx + 1}`,
            className: "bg-card border-border hover:border-[oklch(0.62_0.2_200/0.5)] transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-[oklch(0.62_0.2_200/0.12)] border border-[oklch(0.62_0.2_200/0.25)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-[oklch(0.72_0.2_200)]" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-[oklch(0.62_0.18_155/0.12)] text-[oklch(0.72_0.18_155)] border border-[oklch(0.62_0.18_155/0.3)]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.18_155)] animate-pulse" }),
                    "Active"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground mt-2", children: wf.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3 line-clamp-2", children: wf.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: wf.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground",
                    children: tag
                  },
                  tag
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": `workflow-agent.trigger_button.${idx + 1}`,
                    type: "button",
                    size: "sm",
                    className: "w-full text-xs bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] text-[oklch(0.72_0.2_200)] hover:bg-[oklch(0.62_0.2_200/0.25)] transition-colors",
                    onClick: () => {
                      setTriggerTarget(wf);
                      setCustomNote("");
                      setTriggerResult(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-1.5" }),
                      "Trigger"
                    ]
                  }
                )
              ] })
            ]
          },
          wf.id
        )) })
      ] }),
      executions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-3", children: "Recent Executions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: executions.map((exec, idx) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `workflow-agent.execution.item.${idx + 1}`,
              className: "flex items-center gap-3 px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-7 h-7 rounded-lg flex items-center justify-center border ${STATUS_STYLES[exec.status] ?? STATUS_STYLES.Running}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { status: exec.status })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: ((_a = workflows.find((w) => w.id === exec.workflowId)) == null ? void 0 : _a.name) ?? exec.workflowId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: fmtTs(exec.startedAt) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${STATUS_STYLES[exec.status] ?? STATUS_STYLES.Running}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { status: exec.status }),
                      exec.status
                    ]
                  }
                )
              ]
            },
            exec.id
          );
        }) }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!triggerTarget,
        onOpenChange: (open) => {
          if (!open) {
            setTriggerTarget(null);
            setTriggerResult(null);
            setCustomNote("");
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            "data-ocid": "workflow-agent.dialog",
            className: "bg-card border-border max-w-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-[oklch(0.72_0.2_200)]" }),
                triggerTarget == null ? void 0 : triggerTarget.name
              ] }) }),
              !triggerResult ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: triggerTarget == null ? void 0 : triggerTarget.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "workflow-custom-note",
                      className: "text-sm font-medium text-foreground",
                      children: "Optional note"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      id: "workflow-custom-note",
                      "data-ocid": "workflow-agent.custom_note.textarea",
                      rows: 3,
                      value: customNote,
                      onChange: (e) => setCustomNote(e.target.value),
                      placeholder: "Add any context for this workflow run…",
                      className: "w-full rounded-xl bg-background border border-border text-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "workflow-agent.cancel_button",
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => setTriggerTarget(null),
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "workflow-agent.confirm_button",
                      type: "button",
                      size: "sm",
                      disabled: isLoading,
                      onClick: handleTrigger,
                      className: "bg-primary hover:bg-primary/90",
                      children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 mr-1.5 animate-spin" }),
                        "Running…"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5 mr-1.5" }),
                        "Run Workflow"
                      ] })
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `workflow-agent.${triggerResult.status === "Success" ? "success_state" : "error_state"}`,
                    className: `rounded-xl p-4 border ${triggerResult.status === "Success" ? "bg-[oklch(0.62_0.18_155/0.1)] border-[oklch(0.62_0.18_155/0.3)]" : "bg-[oklch(0.6_0.22_25/0.1)] border-[oklch(0.6_0.22_25/0.3)]"}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                        triggerResult.status === "Success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-[oklch(0.72_0.18_155)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-[oklch(0.72_0.18_25)]" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-sm font-semibold ${triggerResult.status === "Success" ? "text-[oklch(0.72_0.18_155)]" : "text-[oklch(0.72_0.18_25)]"}`,
                            children: triggerResult.status === "Success" ? "Workflow executed successfully" : "Workflow failed"
                          }
                        )
                      ] }),
                      triggerResult.outputData && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: triggerResult.outputData }),
                      triggerResult.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: triggerResult.errorMessage })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "workflow-agent.close_button",
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    onClick: () => {
                      setTriggerTarget(null);
                      setTriggerResult(null);
                      setCustomNote("");
                    },
                    children: "Close"
                  }
                ) })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  ClientWorkflowAgentPage as default
};
