import { WorkflowCard } from "@/components/WorkflowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useN8nWorkflow } from "@/hooks/useN8nWorkflow";
import {
  ALL_WORKFLOW_SCOPES,
  type N8NConnectionDisplay,
  type WorkflowDef,
  type WorkflowExecution,
  type WorkflowScope,
} from "@/types/n8nWorkflow";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Filter,
  Globe,
  Loader2,
  Network,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Upload,
  Webhook,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const SCOPE_LABELS: Record<WorkflowScope | "All", string> = {
  All: "All Scopes",
  AdminOnly: "Admin Only",
  AllClients: "Platform-Wide",
  BasicTier: "Basic Tier",
  ProTier: "Pro Tier",
  AgencyTier: "Agency Tier",
};

const SCOPE_BADGE: Record<WorkflowScope, string> = {
  AdminOnly: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  AllClients: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  BasicTier: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  ProTier: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  AgencyTier: "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

const PAGE_SIZE = 20;

export default function AdminWorkflowLibraryPage() {
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
    isLoading,
  } = useN8nWorkflow();

  const [workflows, setWorkflows] = useState<WorkflowDef[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [n8nConfig, setN8nConfig] = useState<N8NConnectionDisplay | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [scopeFilter, setScopeFilter] = useState<WorkflowScope | "All">("All");
  const [pushingId, setPushingId] = useState<string | null>(null);
  const [execPage, setExecPage] = useState(1);

  // Per-workflow webhook modal
  const [webhookModal, setWebhookModal] = useState<{
    open: boolean;
    wfName: string;
    url: string;
  }>({ open: false, wfName: "", url: "" });

  // Push confirmation modal
  const [pushConfirm, setPushConfirm] = useState<{
    open: boolean;
    workflowId: string;
    workflowName: string;
    scope: WorkflowScope | null;
    scopeTarget: WorkflowScope | "AllPlatform" | null;
  }>({
    open: false,
    workflowId: "",
    workflowName: "",
    scope: null,
    scopeTarget: null,
  });

  // Import modal state
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importName, setImportName] = useState("");
  const [importDesc, setImportDesc] = useState("");
  const [importTags, setImportTags] = useState("");
  const [importScope, setImportScope] = useState<WorkflowScope>("AllClients");
  const [importing, setImporting] = useState(false);

  // N8N Config modal
  const [showN8NConfig, setShowN8NConfig] = useState(false);
  const [configUrl, setConfigUrl] = useState("");
  const [configKey, setConfigKey] = useState("");
  const [savingConfig, setSavingConfig] = useState(false);
  const [testingConn, setTestingConn] = useState(false);

  const loadAll = useCallback(async () => {
    const [defs, execs, cfg, hook] = await Promise.all([
      getWorkflowDefs(),
      getExecutionLog(),
      getN8NConfig(),
      getWebhookUrl(),
    ]);
    if (defs) setWorkflows(defs);
    if (execs) setExecutions(execs);
    if (cfg) setN8nConfig(cfg);
    if (hook) setWebhookUrl(hook);
  }, [getWorkflowDefs, getExecutionLog, getN8NConfig, getWebhookUrl]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleImport = async () => {
    if (!importName.trim() || !importJson.trim()) {
      toast.error("Name and workflow JSON are required");
      return;
    }
    try {
      JSON.parse(importJson);
    } catch {
      toast.error("Invalid JSON — check your workflow export");
      return;
    }
    setImporting(true);
    const tags = importTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    await saveWorkflowDef({
      name: importName,
      description: importDesc,
      tags,
      scope: importScope,
      workflowJson: importJson,
      isActive: true,
      createdBy: "admin",
    });
    setImporting(false);
    toast.success("Workflow imported");
    setShowImport(false);
    setImportJson("");
    setImportName("");
    setImportDesc("");
    setImportTags("");
    loadAll();
  };

  const openPushConfirm = (
    wf: WorkflowDef,
    target: WorkflowScope | "AllPlatform",
  ) => {
    setPushConfirm({
      open: true,
      workflowId: wf.id,
      workflowName: wf.name,
      scope: wf.scope,
      scopeTarget: target,
    });
  };

  const executePush = async () => {
    const { workflowId, scopeTarget } = pushConfirm;
    const scopeText = scopeTarget ?? "AllClients";
    setPushConfirm((p) => ({ ...p, open: false }));
    setPushingId(workflowId);
    await pushToScope(workflowId, scopeText);
    setPushingId(null);
    toast.success("Workflow pushed successfully");
    loadAll();
  };

  const handleDelete = async (id: string) => {
    await deleteWorkflowDef(id);
    toast.success("Workflow deleted");
    loadAll();
  };

  const handleSaveN8NConfig = async () => {
    if (!configUrl.trim()) {
      toast.error("Instance URL required");
      return;
    }
    setSavingConfig(true);
    await saveN8NConfig(configUrl, configKey);
    setSavingConfig(false);
    toast.success("N8N config saved");
    setShowN8NConfig(false);
    loadAll();
  };

  const handleTestConn = async () => {
    setTestingConn(true);
    const ok = await testN8NConnection();
    setTestingConn(false);
    if (ok) toast.success("N8N connection verified");
    else toast.error("Connection failed — check URL and API key");
    loadAll();
  };

  const filteredWorkflows =
    scopeFilter === "All"
      ? workflows
      : workflows.filter((w) => w.scope === scopeFilter);

  const totalExecPages = Math.max(1, Math.ceil(executions.length / PAGE_SIZE));
  const pagedExecs = executions.slice(
    (execPage - 1) * PAGE_SIZE,
    execPage * PAGE_SIZE,
  );

  const statusBadge = n8nConfig?.isConnected ? (
    <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
      <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
    </Badge>
  ) : (
    <Badge
      className="border-rose-500/30 bg-rose-500/10 text-rose-300"
      variant="outline"
    >
      <XCircle className="mr-1 h-3 w-3" /> Disconnected
    </Badge>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
              boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)",
            }}
          >
            <Network className="h-5 w-5 text-[oklch(0.62_0.2_200)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              N8N Workflow Library
            </h1>
            <p className="text-sm text-muted-foreground">
              Platform-level workflows — push selectively or deploy to all
              accounts
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {statusBadge}
          <Link
            to="/admin/n8n-migration"
            data-ocid="workflow-library.migration_link"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Batch Import
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowN8NConfig(true)}
            className="gap-1.5"
            data-ocid="workflow-library.n8n_config_button"
          >
            <Settings className="h-3.5 w-3.5" /> N8N Config
          </Button>
          <Button
            size="sm"
            onClick={() => setShowImport(true)}
            className="gap-1.5"
            data-ocid="workflow-library.import_button"
          >
            <Plus className="h-3.5 w-3.5" /> Import Workflow
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadAll}
            disabled={isLoading}
            data-ocid="workflow-library.refresh_button"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Platform scope info banner */}
      <div
        className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[oklch(0.62_0.2_200_/_25%)] p-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.2 200 / 8%), oklch(0.16 0.014 280))",
        }}
      >
        <Globe className="h-4 w-4 shrink-0 text-[oklch(0.62_0.2_200)]" />
        <p className="flex-1 text-sm text-muted-foreground">
          All workflows are{" "}
          <span className="font-medium text-foreground">platform-owned</span>.
          Use <span className="font-medium text-foreground">"Push to All"</span>{" "}
          to deploy platform-wide, or{" "}
          <span className="font-medium text-foreground">"Push to Scope"</span>{" "}
          to target a specific tier or agency.
        </p>
        {n8nConfig && (
          <div className="flex shrink-0 items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {n8nConfig.activeWorkflowCount}
              </span>{" "}
              active
            </span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {n8nConfig.totalExecutionsToday}
              </span>{" "}
              runs today
            </span>
          </div>
        )}
      </div>

      {/* Scope filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {(["All", ...ALL_WORKFLOW_SCOPES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setScopeFilter(s as WorkflowScope | "All")}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              scopeFilter === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-border/80"
            }`}
            data-ocid={`workflow-library.scope_filter.${s.toLowerCase()}_tab`}
          >
            {SCOPE_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Workflow Grid */}
      {filteredWorkflows.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-16 text-center"
          data-ocid="workflow-library.workflows_empty_state"
        >
          <Network className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">No workflows yet</p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Import a single workflow or use Batch Import for bulk JSON upload
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              className="gap-2"
              onClick={() => setShowImport(true)}
              data-ocid="workflow-library.empty_import_button"
            >
              <Plus className="h-4 w-4" /> Import Workflow
            </Button>
            <Link to="/admin/n8n-migration">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" /> Batch Import
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkflows.map((wf, i) => (
            <div
              key={wf.id}
              className="flex flex-col gap-2"
              data-ocid={`workflow-library.workflow.item.${i + 1}`}
            >
              <WorkflowCard
                workflow={wf}
                onPush={(id) => {
                  const found = workflows.find((w) => w.id === id);
                  if (found) openPushConfirm(found, found.scope);
                }}
                onDelete={handleDelete}
                isPushing={pushingId === wf.id}
              />
              {/* Per-workflow push controls */}
              <div className="flex gap-2 px-1">
                <Button
                  size="sm"
                  className="h-7 flex-1 gap-1.5 bg-emerald-600/80 text-xs hover:bg-emerald-600"
                  onClick={() => openPushConfirm(wf, "AllPlatform")}
                  disabled={pushingId === wf.id}
                  data-ocid={`workflow-library.push_all_button.${i + 1}`}
                >
                  <Send className="h-3 w-3" /> Push to All
                </Button>
                <Select
                  onValueChange={(v) => openPushConfirm(wf, v as WorkflowScope)}
                >
                  <SelectTrigger
                    className="h-7 w-36 text-xs"
                    data-ocid={`workflow-library.push_scope_select.${i + 1}`}
                  >
                    <SelectValue placeholder="Push to Scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_WORKFLOW_SCOPES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {SCOPE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-card/60 hover:bg-muted"
                  aria-label="Show webhook URL"
                  title="Copy webhook URL"
                  onClick={() => {
                    const wfWebhookUrl = `${webhookUrl}?workflowId=${wf.id}`;
                    setWebhookModal({
                      open: true,
                      wfName: wf.name,
                      url: wfWebhookUrl,
                    });
                  }}
                  data-ocid={`workflow-library.webhook_button.${i + 1}`}
                >
                  <Webhook className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Webhook URL card */}
      {webhookUrl && (
        <Card className="mt-6 border border-border/60 bg-card/80 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Webhook className="h-4 w-4 text-[oklch(0.62_0.2_200)]" />
            <h2 className="font-semibold text-foreground">
              Platform Webhook Receiver URL
            </h2>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Paste this base URL into your N8N workflow’s Webhook trigger node.
            Append
            <code className="mx-1 rounded bg-muted/40 px-1 text-xs">
              ?workflowId=&lt;id&gt;
            </code>
            to route results to a specific workflow.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
            <code className="flex-1 truncate font-mono text-sm text-foreground">
              {webhookUrl}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                toast.success("Copied");
              }}
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Copy webhook URL"
              data-ocid="workflow-library.webhook_url_copy_button"
            >
              <ClipboardCopy className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}

      {/* Execution Log */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Execution Log
            <span className="normal-case text-muted-foreground/60">
              ({executions.length} total)
            </span>
          </h2>
          {totalExecPages > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                disabled={execPage === 1}
                onClick={() => setExecPage((p) => p - 1)}
                className="rounded p-1 hover:bg-muted disabled:opacity-40"
                aria-label="Previous page"
                data-ocid="workflow-library.execlog_pagination_prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                {execPage} / {totalExecPages}
              </span>
              <button
                type="button"
                disabled={execPage === totalExecPages}
                onClick={() => setExecPage((p) => p + 1)}
                className="rounded p-1 hover:bg-muted disabled:opacity-40"
                aria-label="Next page"
                data-ocid="workflow-library.execlog_pagination_next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {executions.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="workflow-library.executions_empty_state"
          >
            No executions recorded yet
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card/80">
            <ScrollArea className="h-72">
              <table className="w-full text-sm">
                <thead className="sticky top-0 border-b border-border/60 bg-card">
                  <tr>
                    {[
                      "Account",
                      "Workflow",
                      "Trigger",
                      "Status",
                      "Output",
                      "Time",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {pagedExecs.map((ex, i) => (
                    <tr
                      key={ex.id}
                      className="hover:bg-muted/20"
                      data-ocid={`workflow-library.execution.item.${i + 1}`}
                    >
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {ex.tenantId.slice(0, 14)}&hellip;
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                        {ex.workflowId.slice(0, 8)}&hellip;
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {ex.triggeredBy}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            ex.status === "Success"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : ex.status === "Failed"
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {ex.status}
                        </Badge>
                      </td>
                      <td className="max-w-xs truncate px-4 py-2.5 text-xs text-muted-foreground">
                        {ex.outputData ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">
                        {new Date(
                          Number(ex.startedAt) / 1_000_000,
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* ─── Push Confirmation Modal ─── */}
      <Dialog
        open={pushConfirm.open}
        onOpenChange={(o) => setPushConfirm((p) => ({ ...p, open: o }))}
      >
        <DialogContent className="max-w-md border-border/60 bg-card">
          <DialogHeader>
            <DialogTitle>Confirm Push</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              You are about to push{" "}
              <span className="mx-1 font-semibold text-foreground">
                “{pushConfirm.workflowName}”
              </span>
              to{" "}
              <span className="font-semibold text-foreground">
                {pushConfirm.scopeTarget === "AllPlatform"
                  ? "all platform accounts"
                  : (SCOPE_LABELS[pushConfirm.scopeTarget as WorkflowScope] ??
                    pushConfirm.scopeTarget)}
              </span>
              .
            </p>
            {pushConfirm.scope && (
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-3">
                <span className="text-xs text-muted-foreground">
                  Workflow scope:
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
                    SCOPE_BADGE[pushConfirm.scope]
                  }`}
                >
                  {SCOPE_LABELS[pushConfirm.scope]}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Affected accounts will receive the workflow immediately.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setPushConfirm((p) => ({ ...p, open: false }))}
              data-ocid="push-confirm.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={executePush}
              className="bg-emerald-600 hover:bg-emerald-700"
              data-ocid="push-confirm.confirm_button"
            >
              <Send className="mr-2 h-4 w-4" /> Confirm Push
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Per-workflow Webhook URL Modal ─── */}
      <Dialog
        open={webhookModal.open}
        onOpenChange={(o) => setWebhookModal((m) => ({ ...m, open: o }))}
      >
        <DialogContent className="max-w-lg border-border/60 bg-card">
          <DialogHeader>
            <DialogTitle>Webhook URL — {webhookModal.wfName}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Paste this URL into your N8N Webhook trigger node to push results
            back into BRF for this workflow.
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
            <code className="flex-1 break-all font-mono text-xs text-foreground">
              {webhookModal.url}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(webhookModal.url);
                toast.success("Copied");
              }}
              className="shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Copy URL"
              data-ocid="webhook-modal.copy_button"
            >
              <ClipboardCopy className="h-4 w-4" />
            </button>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setWebhookModal((m) => ({ ...m, open: false }))}
              data-ocid="webhook-modal.close_button"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Import Workflow Modal ─── */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-2xl border-border/60 bg-card">
          <DialogHeader>
            <DialogTitle>Import N8N Workflow</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Paste your exported N8N workflow JSON
          </p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="import-workflow-name"
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  Name *
                </label>
                <Input
                  id="import-workflow-name"
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  placeholder="Workflow name"
                  data-ocid="import.name_input"
                />
              </div>
              <div>
                <label
                  htmlFor="import-workflow-scope"
                  className="mb-1 block text-xs font-medium text-muted-foreground"
                >
                  Platform Scope *
                </label>
                <Select
                  value={importScope}
                  onValueChange={(v) => setImportScope(v as WorkflowScope)}
                >
                  <SelectTrigger
                    id="import-workflow-scope"
                    data-ocid="import.scope_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_WORKFLOW_SCOPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {SCOPE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label
                htmlFor="import-workflow-desc"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Description
              </label>
              <Input
                id="import-workflow-desc"
                value={importDesc}
                onChange={(e) => setImportDesc(e.target.value)}
                placeholder="What does this workflow do?"
                data-ocid="import.desc_input"
              />
            </div>
            <div>
              <label
                htmlFor="import-workflow-tags"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Tags (comma separated)
              </label>
              <Input
                id="import-workflow-tags"
                value={importTags}
                onChange={(e) => setImportTags(e.target.value)}
                placeholder="email, lead, roofing"
                data-ocid="import.tags_input"
              />
            </div>
            <div>
              <label
                htmlFor="import-workflow-json"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Workflow JSON *
              </label>
              <textarea
                id="import-workflow-json"
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste your N8N workflow JSON here..."
                rows={8}
                className="w-full rounded-lg border border-border bg-card/50 p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                data-ocid="import.json_textarea"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowImport(false)}
              disabled={importing}
              data-ocid="import.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={importing}
              data-ocid="import.submit_button"
            >
              {importing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Import
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── N8N Config Modal ─── */}
      <Dialog open={showN8NConfig} onOpenChange={setShowN8NConfig}>
        <DialogContent className="max-w-lg border-border/60 bg-card">
          <DialogHeader>
            <DialogTitle>N8N Connection Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="n8n-cfg-url"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                Instance URL *
              </label>
              <Input
                id="n8n-cfg-url"
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
                placeholder="https://your-n8n-instance.com"
                data-ocid="n8n-config.url_input"
              />
            </div>
            <div>
              <label
                htmlFor="n8n-cfg-key"
                className="mb-1 block text-xs font-medium text-muted-foreground"
              >
                API Key
              </label>
              <Input
                id="n8n-cfg-key"
                type="password"
                value={configKey}
                onChange={(e) => setConfigKey(e.target.value)}
                placeholder="n8n API key"
                data-ocid="n8n-config.key_input"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConn}
              disabled={testingConn}
              data-ocid="n8n-config.test_button"
            >
              {testingConn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Test Connection
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowN8NConfig(false)}
              data-ocid="n8n-config.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveN8NConfig}
              disabled={savingConfig}
              data-ocid="n8n-config.save_button"
            >
              {savingConfig ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Settings className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
