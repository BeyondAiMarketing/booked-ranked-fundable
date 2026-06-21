import { af as useActor, r as reactExports, j as jsxRuntimeExports } from "./index-CHgLG-xR.js";
import { u as useBusinessBrief } from "./useBusinessBrief-BvQ3gqxz.js";
import { u as useVerticalProfile } from "./useVerticalProfile-RDHUgXRz.js";
function useWorkflowLog() {
  const { actor } = useActor();
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const createLog = reactExports.useCallback(
    async (data) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createWorkflowLog(data);
        setLogs((prev) => [result, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const updateLog = reactExports.useCallback(
    async (id, updates) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateWorkflowLog(id, updates);
        setLogs(
          (prev) => prev.map((l) => l.id === id ? result : l)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const listByWorkflow = reactExports.useCallback(
    async (workflowId) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.listWorkflowLogsByWorkflow(workflowId);
        setLogs(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const listByAgent = reactExports.useCallback(
    async (agentId) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.listWorkflowLogsByAgent(agentId);
        setLogs(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  reactExports.useEffect(() => {
    if (!actor) return;
    setLoading(true);
    actor.listWorkflowLogsByWorkflow("all").then((result) => setLogs(result)).catch(
      (err) => setError(err instanceof Error ? err.message : "Unknown error")
    ).finally(() => setLoading(false));
  }, [actor]);
  return {
    logs,
    loading,
    error,
    createLog,
    updateLog,
    listByWorkflow,
    listByAgent
  };
}
function useApprovalRequest() {
  const { actor } = useActor();
  const [pending, setPending] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const listPending = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listPendingApprovals();
      setPending(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  const listHistory = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listApprovalHistory();
      setHistory(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    listPending();
    listHistory();
  }, [listPending, listHistory]);
  const createRequest = reactExports.useCallback(
    async (data) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createApprovalItem(data);
        setPending((prev) => [result, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const resolveRequest = reactExports.useCallback(
    async (id, status, notes) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.resolveApprovalItem(id, status, notes);
        const resolved = result;
        setPending((prev) => prev.filter((r) => r.id !== id));
        setHistory((prev) => [resolved, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  return {
    pending,
    history,
    loading,
    error,
    createRequest,
    resolveRequest,
    listPending,
    listHistory
  };
}
function ContentOrchestratorPage() {
  var _a, _b;
  const { brief } = useBusinessBrief();
  const { profile } = useVerticalProfile();
  const { logs } = useWorkflowLog();
  const { createRequest } = useApprovalRequest();
  const [selectedWorkflow, setSelectedWorkflow] = reactExports.useState(null);
  const [handoffVerified, setHandoffVerified] = reactExports.useState({});
  const workflows = [
    {
      id: "brand-onboarding",
      name: "Brand Onboarding",
      status: (brief == null ? void 0 : brief.brandVoice) ? "completed" : "pending",
      requires: [],
      produces: ["brandVoice", "targetAudience", "services"]
    },
    {
      id: "content-calendar",
      name: "Content Calendar",
      status: (brief == null ? void 0 : brief.brandVoice) && profile ? "pending" : "blocked",
      requires: ["brand-onboarding"],
      produces: ["calendarEntries"]
    },
    {
      id: "platform-content",
      name: "Platform Content",
      status: (brief == null ? void 0 : brief.brandVoice) && profile ? "pending" : "blocked",
      requires: ["brand-onboarding", "content-calendar"],
      produces: ["postDrafts"]
    },
    {
      id: "performance-review",
      name: "Performance Review",
      status: (brief == null ? void 0 : brief.brandVoice) ? "pending" : "blocked",
      requires: ["platform-content"],
      produces: ["insights", "nextMonthStrategy"]
    }
  ];
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "running":
        return "bg-blue-500";
      case "failed":
        return "bg-rose-500";
      case "paused":
        return "bg-gray-500";
      case "blocked":
        return "bg-amber-500";
      default:
        return "bg-yellow-500";
    }
  };
  const isWorkflowAvailable = (wf) => {
    if (wf.requires.length === 0) return true;
    return wf.requires.every((reqId) => {
      const reqWf = workflows.find((w) => w.id === reqId);
      return (reqWf == null ? void 0 : reqWf.status) === "completed" || handoffVerified[reqId];
    });
  };
  const handleVerifyHandoff = (workflowId) => {
    setHandoffVerified((prev) => ({ ...prev, [workflowId]: true }));
  };
  const handlePushToApproval = async () => {
    if (selectedWorkflow) {
      await createRequest({
        workflowId: selectedWorkflow,
        agentId: "content-orchestrator",
        itemType: "workflow",
        itemId: selectedWorkflow,
        status: "pending",
        requestedBy: "admin"
      });
    }
  };
  const hasContext = (brief == null ? void 0 : brief.brandVoice) && profile;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "h1",
      {
        className: "text-3xl font-bold mb-2",
        "data-ocid": "content_orchestrator.page",
        children: "Content Orchestrator Agent"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Check context, route workflow, prevent out-of-order work, resume mid-workflow, push drafts to approval" }),
    !hasContext && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-amber-950/30 border border-amber-500/40 rounded-lg p-4 mb-6",
        "data-ocid": "content_orchestrator.missing_context",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amber-200 font-semibold", children: "Missing Context" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amber-300/80 text-sm", children: "Complete brand onboarding first before creating content calendars. Do not create calendar without brand context." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Context Check" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Brand Voice" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: (brief == null ? void 0 : brief.brandVoice) ? "text-emerald-400" : "text-rose-400",
                children: (brief == null ? void 0 : brief.brandVoice) ? "Configured" : "Missing"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Target Audience" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: ((_a = brief == null ? void 0 : brief.targetAudience) == null ? void 0 : _a.length) ? "text-emerald-400" : "text-rose-400",
                children: ((_b = brief == null ? void 0 : brief.targetAudience) == null ? void 0 : _b.length) ? `${brief.targetAudience.length} segments` : "Missing"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Niche" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: (profile == null ? void 0 : profile.niche) ? "text-emerald-400" : "text-rose-400",
                children: (profile == null ? void 0 : profile.niche) || "Missing"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Vertical Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: (profile == null ? void 0 : profile.name) ? "text-emerald-400" : "text-rose-400",
                children: (profile == null ? void 0 : profile.name) || "Missing"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Workflow Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: workflows.map((wf) => {
          const available = isWorkflowAvailable(wf);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: !available,
              className: `flex items-center justify-between p-3 bg-muted/40 rounded-lg w-full text-left ${selectedWorkflow === wf.id ? "ring-1 ring-primary" : ""} ${!available ? "opacity-60" : ""}`,
              onClick: () => setSelectedWorkflow(wf.id),
              "data-ocid": `content_orchestrator.workflow.${wf.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-3 h-3 rounded-full ${getStatusColor(wf.status)}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: !available ? "text-muted-foreground" : "",
                      children: wf.name
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  !available && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-400", children: "Blocked" }),
                  wf.status === "completed" && !handoffVerified[wf.id] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleVerifyHandoff(wf.id);
                      },
                      className: "text-xs px-2 py-1 bg-primary/20 text-primary rounded",
                      "data-ocid": `content_orchestrator.verify_handoff.${wf.id}`,
                      children: "Verify Handoff"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground capitalize", children: wf.status })
                ] })
              ]
            },
            wf.id
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Workflow Log" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handlePushToApproval,
            disabled: !selectedWorkflow,
            className: "px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted rounded-lg transition-colors",
            "data-ocid": "content_orchestrator.push_approval_button",
            children: "Push to Approval"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-muted-foreground border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Agent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Step" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3", children: "Time" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          logs == null ? void 0 : logs.slice(0, 10).map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: log.agentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: log.stepName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `px-2 py-1 rounded text-xs ${getStatusColor(log.status)} bg-opacity-20`,
                children: log.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-muted-foreground", children: new Date(log.timestamp).toLocaleString() })
          ] }, log.id)),
          (!logs || logs.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              colSpan: 4,
              className: "py-4 text-muted-foreground text-center",
              children: "No workflow logs yet"
            }
          ) })
        ] })
      ] }) })
    ] })
  ] }) });
}
export {
  ContentOrchestratorPage as default
};
