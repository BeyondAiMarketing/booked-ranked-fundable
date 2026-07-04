import { c as createLucideIcon, j as jsxRuntimeExports, at as Card, q as Trash2, as as Badge, B as Button, S as Send, r as reactExports, aA as CircleCheck, ak as CircleX, aZ as Link, aR as Upload, a_ as Settings, P as Plus, al as RefreshCw, am as Globe, ac as Layers, aQ as ue, aF as Funnel, Y as Select, Z as SelectTrigger, _ as SelectValue, $ as SelectContent, a0 as SelectItem, a$ as Webhook, aX as ClipboardCopy, b0 as ChevronLeft, aD as ChevronRight, aS as ScrollArea, aJ as Dialog, aK as DialogContent, aL as DialogHeader, aM as DialogTitle, I as Input, l as LoaderCircle } from "./index-CSMRpKtY.js";
import { N as N8N_TEMPLATE_METADATA, T as TemplateCard } from "./n8nTemplateMetadata-BM_hlAfT.js";
import { u as useN8nWorkflow } from "./useN8nWorkflow-BEOJJMCS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
];
const Network = createLucideIcon("network", __iconNode);
const SCOPE_COLORS = {
  AdminOnly: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  AllClients: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  BasicTier: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  ProTier: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  AgencyTier: "border-amber-500/30 bg-amber-500/10 text-amber-300"
};
function WorkflowCard({
  workflow,
  onPush,
  onDelete,
  isPushing = false
}) {
  const scopeColor = SCOPE_COLORS[workflow.scope] || "border-border bg-muted/30 text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group relative overflow-hidden border border-border/60 bg-card/80 p-5 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_20px_oklch(0.62_0.2_200_/_15%)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.62_0.2_200)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "truncate text-sm font-semibold text-foreground", children: workflow.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${scopeColor}`,
              children: workflow.scope
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onDelete(workflow.id),
          className: "shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100",
          "aria-label": "Delete workflow",
          "data-ocid": "workflow.delete_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 line-clamp-2 text-xs text-muted-foreground", children: workflow.description }),
    workflow.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex flex-wrap gap-1", children: workflow.tags.slice(0, 4).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: tag }, tag)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        "Pushed to ",
        workflow.pushedToAccounts,
        " accounts"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: () => onPush(workflow.id),
          disabled: isPushing,
          className: "h-7 gap-1.5 border-primary/30 bg-primary/5 px-3 text-xs hover:bg-primary/20",
          "data-ocid": "workflow.push_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" }),
            isPushing ? "Pushing..." : "Push"
          ]
        }
      )
    ] })
  ] });
}
const ALL_WORKFLOW_SCOPES = [
  "AdminOnly",
  "AllClients",
  "BasicTier",
  "ProTier",
  "AgencyTier"
];
const SCOPE_LABELS = {
  All: "All Scopes",
  AdminOnly: "Admin Only",
  AllClients: "Platform-Wide",
  BasicTier: "Basic Tier",
  ProTier: "Pro Tier",
  AgencyTier: "Agency Tier"
};
const SCOPE_BADGE = {
  AdminOnly: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  AllClients: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  BasicTier: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  ProTier: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  AgencyTier: "border-amber-500/30 bg-amber-500/10 text-amber-300"
};
const PAGE_SIZE = 20;
function AdminWorkflowLibraryPage() {
  const {
    getWorkflowDefs,
    saveWorkflowDef,
    deleteWorkflowDef,
    pushToScope,
    getExecutionLog,
    getN8NConfig,
    saveN8NConfig,
    testN8NConnection,
    getWebhookUrl,
    isLoading
  } = useN8nWorkflow();
  const [workflows, setWorkflows] = reactExports.useState([]);
  const [executions, setExecutions] = reactExports.useState([]);
  const [n8nConfig, setN8nConfig] = reactExports.useState(null);
  const [webhookUrl, setWebhookUrl] = reactExports.useState("");
  const [scopeFilter, setScopeFilter] = reactExports.useState("All");
  const [pushingId, setPushingId] = reactExports.useState(null);
  const [execPage, setExecPage] = reactExports.useState(1);
  const [webhookModal, setWebhookModal] = reactExports.useState({ open: false, wfName: "", url: "" });
  const [pushConfirm, setPushConfirm] = reactExports.useState({
    open: false,
    workflowId: "",
    workflowName: "",
    scope: null,
    scopeTarget: null
  });
  const [showImport, setShowImport] = reactExports.useState(false);
  const [importJson, setImportJson] = reactExports.useState("");
  const [importName, setImportName] = reactExports.useState("");
  const [importDesc, setImportDesc] = reactExports.useState("");
  const [importTags, setImportTags] = reactExports.useState("");
  const [importScope, setImportScope] = reactExports.useState("AllClients");
  const [importing, setImporting] = reactExports.useState(false);
  const [showN8NConfig, setShowN8NConfig] = reactExports.useState(false);
  const [configUrl, setConfigUrl] = reactExports.useState("");
  const [configKey, setConfigKey] = reactExports.useState("");
  const [savingConfig, setSavingConfig] = reactExports.useState(false);
  const [testingConn, setTestingConn] = reactExports.useState(false);
  const [_importingTemplateId, setImportingTemplateId] = reactExports.useState(null);
  const loadAll = reactExports.useCallback(async () => {
    const [defs, execs, cfg, hook] = await Promise.all([
      getWorkflowDefs(),
      getExecutionLog(),
      getN8NConfig(),
      getWebhookUrl()
    ]);
    if (defs) setWorkflows(defs);
    if (execs) setExecutions(execs);
    if (cfg) setN8nConfig(cfg);
    if (hook) setWebhookUrl(hook);
  }, [getWorkflowDefs, getExecutionLog, getN8NConfig, getWebhookUrl]);
  reactExports.useEffect(() => {
    loadAll();
  }, [loadAll]);
  const handleImport = async () => {
    if (!importName.trim() || !importJson.trim()) {
      ue.error("Name and workflow JSON are required");
      return;
    }
    try {
      JSON.parse(importJson);
    } catch {
      ue.error("Invalid JSON — check your workflow export");
      return;
    }
    setImporting(true);
    const tags = importTags.split(",").map((t) => t.trim()).filter(Boolean);
    await saveWorkflowDef({
      name: importName,
      description: importDesc,
      tags,
      scope: importScope,
      workflowJson: importJson,
      isActive: true,
      createdBy: "admin"
    });
    setImporting(false);
    ue.success("Workflow imported");
    setShowImport(false);
    setImportJson("");
    setImportName("");
    setImportDesc("");
    setImportTags("");
    loadAll();
  };
  const openPushConfirm = (wf, target) => {
    setPushConfirm({
      open: true,
      workflowId: wf.id,
      workflowName: wf.name,
      scope: wf.scope,
      scopeTarget: target
    });
  };
  const executePush = async () => {
    const { workflowId, scopeTarget } = pushConfirm;
    const scopeText = scopeTarget ?? "AllClients";
    setPushConfirm((p) => ({ ...p, open: false }));
    setPushingId(workflowId);
    await pushToScope(workflowId, scopeText);
    setPushingId(null);
    ue.success("Workflow pushed successfully");
    loadAll();
  };
  const handleDelete = async (id) => {
    await deleteWorkflowDef(id);
    ue.success("Workflow deleted");
    loadAll();
  };
  const handleSaveN8NConfig = async () => {
    if (!configUrl.trim()) {
      ue.error("Instance URL required");
      return;
    }
    setSavingConfig(true);
    await saveN8NConfig(configUrl, configKey);
    setSavingConfig(false);
    ue.success("N8N config saved");
    setShowN8NConfig(false);
    loadAll();
  };
  const handleTestConn = async () => {
    setTestingConn(true);
    const ok = await testN8NConnection();
    setTestingConn(false);
    if (ok) ue.success("N8N connection verified");
    else ue.error("Connection failed — check URL and API key");
    loadAll();
  };
  const handleUseTemplate = async (templateId) => {
    const template = N8N_TEMPLATE_METADATA.find((t) => t.id === templateId);
    if (!template) return;
    setImportingTemplateId(templateId);
    try {
      const res = await fetch(`/n8n-templates/${template.fileName}`);
      if (!res.ok) throw new Error("Failed to fetch template");
      const workflowJson = await res.text();
      JSON.parse(workflowJson);
      await saveWorkflowDef({
        name: template.name,
        description: template.description,
        tags: template.tags,
        scope: "AllClients",
        workflowJson,
        isActive: true,
        createdBy: "admin"
      });
      ue.success(`Template '${template.name}' imported successfully`);
      loadAll();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Import failed";
      ue.error(msg);
    } finally {
      setImportingTemplateId(null);
    }
  };
  const filteredWorkflows = scopeFilter === "All" ? workflows : workflows.filter((w) => w.scope === scopeFilter);
  const totalExecPages = Math.max(1, Math.ceil(executions.length / PAGE_SIZE));
  const pagedExecs = executions.slice(
    (execPage - 1) * PAGE_SIZE,
    execPage * PAGE_SIZE
  );
  const statusBadge = (n8nConfig == null ? void 0 : n8nConfig.isConnected) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
    " Connected"
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      className: "border-rose-500/30 bg-rose-500/10 text-rose-300",
      variant: "outline",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "mr-1 h-3 w-3" }),
        " Disconnected"
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex h-10 w-10 items-center justify-center rounded-xl",
            style: {
              background: "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
              boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "h-5 w-5 text-[oklch(0.62_0.2_200)]" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "N8N Workflow Library" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Platform-level workflows — push selectively or deploy to all accounts" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        statusBadge,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/admin/n8n-migration",
            "data-ocid": "workflow-library.migration_link",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
              " Batch Import"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setShowN8NConfig(true),
            className: "gap-1.5",
            "data-ocid": "workflow-library.n8n_config_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5" }),
              " N8N Config"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setShowImport(true),
            className: "gap-1.5",
            "data-ocid": "workflow-library.import_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Import Workflow"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: loadAll,
            disabled: isLoading,
            "data-ocid": "workflow-library.refresh_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[oklch(0.62_0.2_200_/_25%)] p-4",
        style: {
          background: "linear-gradient(135deg, oklch(0.62 0.2 200 / 8%), oklch(0.16 0.014 280))"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 shrink-0 text-[oklch(0.62_0.2_200)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex-1 text-sm text-muted-foreground", children: [
            "All workflows are",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "platform-owned" }),
            ". Use ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: '"Push to All"' }),
            " ",
            "to deploy platform-wide, or",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: '"Push to Scope"' }),
            " ",
            "to target a specific tier or agency."
          ] }),
          n8nConfig && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-4 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: n8nConfig.activeWorkflowCount }),
              " ",
              "active"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: n8nConfig.totalExecutionsToday }),
              " ",
              "runs today"
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[oklch(0.62_0.2_200)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Built-in BRF Workflow Templates" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-sm text-muted-foreground", children: "Import pre-built workflows for common BRF operations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: N8N_TEMPLATE_METADATA.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TemplateCard,
        {
          template,
          onUseTemplate: handleUseTemplate,
          onPreview: () => {
            ue.info(`Preview for "${template.name}" — coming soon`);
          }
        },
        template.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 border-t border-border/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground" }),
      ["All", ...ALL_WORKFLOW_SCOPES].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setScopeFilter(s),
          className: `rounded-full border px-3 py-1 text-xs transition-colors ${scopeFilter === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`,
          "data-ocid": `workflow-library.scope_filter.${s.toLowerCase()}_tab`,
          children: SCOPE_LABELS[s]
        },
        s
      ))
    ] }),
    filteredWorkflows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-16 text-center",
        "data-ocid": "workflow-library.workflows_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-muted-foreground", children: "No workflows yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground/60", children: "Import a single workflow or use Batch Import for bulk JSON upload" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "gap-2",
                onClick: () => setShowImport(true),
                "data-ocid": "workflow-library.empty_import_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  " Import Workflow"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/n8n-migration", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
              " Batch Import"
            ] }) })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filteredWorkflows.map((wf, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col gap-2",
        "data-ocid": `workflow-library.workflow.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            WorkflowCard,
            {
              workflow: wf,
              onPush: (id) => {
                const found = workflows.find((w) => w.id === id);
                if (found) openPushConfirm(found, found.scope);
              },
              onDelete: handleDelete,
              isPushing: pushingId === wf.id
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 px-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "h-7 flex-1 gap-1.5 bg-emerald-600/80 text-xs hover:bg-emerald-600",
                onClick: () => openPushConfirm(wf, "AllPlatform"),
                disabled: pushingId === wf.id,
                "data-ocid": `workflow-library.push_all_button.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" }),
                  " Push to All"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                onValueChange: (v) => openPushConfirm(wf, v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-7 w-36 text-xs",
                      "data-ocid": `workflow-library.push_scope_select.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Push to Scope" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_WORKFLOW_SCOPES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, className: "text-xs", children: SCOPE_LABELS[s] }, s)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-card/60 hover:bg-muted",
                "aria-label": "Show webhook URL",
                title: "Copy webhook URL",
                onClick: () => {
                  const wfWebhookUrl = `${webhookUrl}?workflowId=${wf.id}`;
                  setWebhookModal({
                    open: true,
                    wfName: wf.name,
                    url: wfWebhookUrl
                  });
                },
                "data-ocid": `workflow-library.webhook_button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Webhook, { className: "h-3.5 w-3.5 text-muted-foreground" })
              }
            )
          ] })
        ]
      },
      wf.id
    )) }),
    webhookUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-6 border border-border/60 bg-card/80 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Webhook, { className: "h-4 w-4 text-[oklch(0.62_0.2_200)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Platform Webhook Receiver URL" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 text-sm text-muted-foreground", children: [
        "Paste this base URL into your N8N workflow’s Webhook trigger node. Append",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "mx-1 rounded bg-muted/40 px-1 text-xs", children: "?workflowId=<id>" }),
        "to route results to a specific workflow."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate font-mono text-sm text-foreground", children: webhookUrl }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              navigator.clipboard.writeText(webhookUrl);
              ue.success("Copied");
            },
            className: "shrink-0 text-muted-foreground hover:text-foreground",
            "aria-label": "Copy webhook URL",
            "data-ocid": "workflow-library.webhook_url_copy_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
          " Execution Log",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "normal-case text-muted-foreground/60", children: [
            "(",
            executions.length,
            " total)"
          ] })
        ] }),
        totalExecPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              disabled: execPage === 1,
              onClick: () => setExecPage((p) => p - 1),
              className: "rounded p-1 hover:bg-muted disabled:opacity-40",
              "aria-label": "Previous page",
              "data-ocid": "workflow-library.execlog_pagination_prev",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            execPage,
            " / ",
            totalExecPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              disabled: execPage === totalExecPages,
              onClick: () => setExecPage((p) => p + 1),
              className: "rounded p-1 hover:bg-muted disabled:opacity-40",
              "aria-label": "Next page",
              "data-ocid": "workflow-library.execlog_pagination_next",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      executions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm text-muted-foreground",
          "data-ocid": "workflow-library.executions_empty_state",
          children: "No executions recorded yet"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-xl border border-border/60 bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-72", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 border-b border-border/60 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
          "Account",
          "Workflow",
          "Trigger",
          "Status",
          "Output",
          "Time"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: pagedExecs.map((ex, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "hover:bg-muted/20",
            "data-ocid": `workflow-library.execution.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-xs text-muted-foreground", children: [
                ex.tenantId.slice(0, 14),
                "…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 font-mono text-xs text-foreground", children: [
                ex.workflowId.slice(0, 8),
                "…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground", children: ex.triggeredBy }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${ex.status === "Success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : ex.status === "Failed" ? "border-rose-500/30 bg-rose-500/10 text-rose-400" : "border-amber-500/30 bg-amber-500/10 text-amber-400"}`,
                  children: ex.status
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-xs truncate px-4 py-2.5 text-xs text-muted-foreground", children: ex.outputData ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-muted-foreground", children: new Date(
                Number(ex.startedAt) / 1e6
              ).toLocaleString() })
            ]
          },
          ex.id
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: pushConfirm.open,
        onOpenChange: (o) => setPushConfirm((p) => ({ ...p, open: o })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md border-border/60 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Confirm Push" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "You are about to push",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mx-1 font-semibold text-foreground", children: [
                "“",
                pushConfirm.workflowName,
                "”"
              ] }),
              "to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: pushConfirm.scopeTarget === "AllPlatform" ? "all platform accounts" : SCOPE_LABELS[pushConfirm.scopeTarget] ?? pushConfirm.scopeTarget }),
              "."
            ] }),
            pushConfirm.scope && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Workflow scope:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${SCOPE_BADGE[pushConfirm.scope]}`,
                  children: SCOPE_LABELS[pushConfirm.scope]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Affected accounts will receive the workflow immediately." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: () => setPushConfirm((p) => ({ ...p, open: false })),
                "data-ocid": "push-confirm.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: executePush,
                className: "bg-emerald-600 hover:bg-emerald-700",
                "data-ocid": "push-confirm.confirm_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
                  " Confirm Push"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: webhookModal.open,
        onOpenChange: (o) => setWebhookModal((m) => ({ ...m, open: o })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg border-border/60 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
            "Webhook URL — ",
            webhookModal.wfName
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Paste this URL into your N8N Webhook trigger node to push results back into BRF for this workflow." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 break-all font-mono text-xs text-foreground", children: webhookModal.url }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  navigator.clipboard.writeText(webhookModal.url);
                  ue.success("Copied");
                },
                className: "shrink-0 text-muted-foreground hover:text-foreground",
                "aria-label": "Copy URL",
                "data-ocid": "webhook-modal.copy_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: () => setWebhookModal((m) => ({ ...m, open: false })),
              "data-ocid": "webhook-modal.close_button",
              children: "Close"
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showImport, onOpenChange: setShowImport, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl border-border/60 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Import N8N Workflow" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Paste your exported N8N workflow JSON" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "import-workflow-name",
                className: "mb-1 block text-xs font-medium text-muted-foreground",
                children: "Name *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "import-workflow-name",
                value: importName,
                onChange: (e) => setImportName(e.target.value),
                placeholder: "Workflow name",
                "data-ocid": "import.name_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "import-workflow-scope",
                className: "mb-1 block text-xs font-medium text-muted-foreground",
                children: "Platform Scope *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: importScope,
                onValueChange: (v) => setImportScope(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "import-workflow-scope",
                      "data-ocid": "import.scope_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_WORKFLOW_SCOPES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: SCOPE_LABELS[s] }, s)) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "import-workflow-desc",
              className: "mb-1 block text-xs font-medium text-muted-foreground",
              children: "Description"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-workflow-desc",
              value: importDesc,
              onChange: (e) => setImportDesc(e.target.value),
              placeholder: "What does this workflow do?",
              "data-ocid": "import.desc_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "import-workflow-tags",
              className: "mb-1 block text-xs font-medium text-muted-foreground",
              children: "Tags (comma separated)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "import-workflow-tags",
              value: importTags,
              onChange: (e) => setImportTags(e.target.value),
              placeholder: "email, lead, roofing",
              "data-ocid": "import.tags_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "import-workflow-json",
              className: "mb-1 block text-xs font-medium text-muted-foreground",
              children: "Workflow JSON *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "import-workflow-json",
              value: importJson,
              onChange: (e) => setImportJson(e.target.value),
              placeholder: "Paste your N8N workflow JSON here...",
              rows: 8,
              className: "w-full rounded-lg border border-border bg-card/50 p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
              "data-ocid": "import.json_textarea"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            onClick: () => setShowImport(false),
            disabled: importing,
            "data-ocid": "import.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleImport,
            disabled: importing,
            "data-ocid": "import.submit_button",
            children: [
              importing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Import"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showN8NConfig, onOpenChange: setShowN8NConfig, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg border-border/60 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "N8N Connection Settings" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "n8n-cfg-url",
              className: "mb-1 block text-xs font-medium text-muted-foreground",
              children: "Instance URL *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "n8n-cfg-url",
              value: configUrl,
              onChange: (e) => setConfigUrl(e.target.value),
              placeholder: "https://your-n8n-instance.com",
              "data-ocid": "n8n-config.url_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "n8n-cfg-key",
              className: "mb-1 block text-xs font-medium text-muted-foreground",
              children: "API Key"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "n8n-cfg-key",
              type: "password",
              value: configKey,
              onChange: (e) => setConfigKey(e.target.value),
              placeholder: "n8n API key",
              "data-ocid": "n8n-config.key_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleTestConn,
            disabled: testingConn,
            "data-ocid": "n8n-config.test_button",
            children: [
              testingConn ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
              "Test Connection"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            onClick: () => setShowN8NConfig(false),
            "data-ocid": "n8n-config.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSaveN8NConfig,
            disabled: savingConfig,
            "data-ocid": "n8n-config.save_button",
            children: [
              savingConfig ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-2 h-4 w-4" }),
              "Save"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AdminWorkflowLibraryPage as default
};
