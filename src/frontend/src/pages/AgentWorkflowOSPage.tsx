import {
  AlertTriangle,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clipboard,
  ClipboardCheck,
  Clock,
  Cpu,
  Database,
  Download,
  FileText,
  Filter,
  Layers,
  Pencil,
  Play,
  Plus,
  Save,
  Shield,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ArtifactTypeIcon from "../components/ArtifactTypeIcon";
import RunStatusBadge from "../components/RunStatusBadge";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { useAgentWorkflow } from "../hooks/useAgentWorkflow";
import type {
  AgentArtifact,
  AgentRun,
  AgentTemplateRecord,
  AgentThread,
  ApprovalItem,
  ProviderAdapterConfig,
} from "../types/agentWorkflow";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// ─── Artifact copy/download helpers ──────────────────────────────────────────

function ArtifactActions({ artifact }: { artifact: AgentArtifact }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([artifact.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded .txt");
  };

  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(
      {
        id: artifact.id,
        title: artifact.title,
        type: artifact.artifactType,
        status: artifact.status,
        tags: artifact.tags,
        content: artifact.content,
        createdAt: new Date(artifact.createdAt).toISOString(),
      },
      null,
      2,
    );
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded .json");
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleCopy}
        title="Copy content"
        data-ocid={`artifact.${artifact.id}.copy_button`}
        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        {copied ? (
          <ClipboardCheck size={13} className="text-emerald-400" />
        ) : (
          <Clipboard size={13} />
        )}
      </button>
      <button
        type="button"
        onClick={handleDownloadTxt}
        title="Download .txt"
        data-ocid={`artifact.${artifact.id}.download_txt_button`}
        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        <Download size={13} />
      </button>
      <button
        type="button"
        onClick={handleDownloadJson}
        title="Export as JSON"
        data-ocid={`artifact.${artifact.id}.download_json_button`}
        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-[9px] font-mono leading-none px-2 py-1.5"
      >
        JSON
      </button>
    </div>
  );
}

// ─── CRM Snapshot Tab ────────────────────────────────────────────────────────

function CrmSnapshotTab() {
  const { currentTenantId, getLeadsByTenant, createThread, getThreadForAgent } =
    useApp();
  const { executeToolRun } = useAgentWorkflow();
  const [running, setRunning] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const leads = getLeadsByTenant(currentTenantId);
  const statusCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    contacted: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    qualified: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    closed: "bg-slate-600/40 text-slate-400 border-slate-600/30",
  };

  const recent = leads.slice(0, 5);

  const handleRunLookup = async () => {
    setRunning(true);
    let thread = getThreadForAgent(currentTenantId, "Sales Agent");
    if (!thread) {
      thread = createThread(
        currentTenantId,
        "Sales Agent",
        "Sales Agent — CRM Lookup",
      );
    }
    const result = await executeToolRun(thread.id, "crm_lookup", {});
    if (result) {
      setLastResult(
        `Lookup complete. Found ${leads.length} leads. Artifact saved to thread history.`,
      );
      toast.success("CRM lookup complete", {
        description: "Lead summary artifact saved.",
      });
    }
    setRunning(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Users size={16} className="text-blue-400" /> CRM Snapshot
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Live lead data for the current tenant — directly from app state.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleRunLookup}
          disabled={running}
          data-ocid="crm.snapshot.run_lookup_button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5"
        >
          {running ? (
            <>
              <Clock size={12} className="animate-spin" /> Running...
            </>
          ) : (
            <>
              <Play size={12} /> Run CRM Lookup
            </>
          )}
        </Button>
      </div>

      {lastResult && (
        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-3">
          <p className="text-xs text-emerald-300">{lastResult}</p>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: leads.length, color: "text-white" },
          {
            label: "New",
            value: statusCounts.new ?? 0,
            color: "text-blue-300",
          },
          {
            label: "Qualified",
            value: statusCounts.qualified ?? 0,
            color: "text-emerald-300",
          },
          {
            label: "Closed",
            value: statusCounts.closed ?? 0,
            color: "text-slate-400",
          },
        ].map(({ label, value, color }) => (
          <Card key={label} className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="p-3">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status breakdown */}
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          By Status
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span
              key={status}
              className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
            >
              {count} {status}
            </span>
          ))}
        </div>
      </div>

      {/* Recent leads */}
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          5 Most Recent Leads
        </p>
        {recent.length === 0 ? (
          <p className="text-xs text-slate-500">No leads yet.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((lead) => (
              <div
                key={lead.id}
                data-ocid={`crm.lead.${lead.id}.row`}
                className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {lead.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {lead.source} ·{" "}
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusColors[lead.status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tool Testing Panel ───────────────────────────────────────────────────────

function ToolTestingPanel() {
  const { toolDefinitions, currentTenantId, createThread, getThreadForAgent } =
    useApp();
  const { executeToolRun } = useAgentWorkflow();
  const [selectedTool, setSelectedTool] = useState<string>(
    toolDefinitions[0]?.name ?? "crm_lookup",
  );
  const [inputJson, setInputJson] = useState("{}");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentTool = toolDefinitions.find((t) => t.name === selectedTool);

  const handleTest = async () => {
    setRunning(true);
    setResult(null);
    setError(null);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(inputJson) as Record<string, unknown>;
    } catch {
      setError("Invalid JSON input");
      setRunning(false);
      return;
    }

    let thread = getThreadForAgent(currentTenantId, "Tool Test");
    if (!thread) {
      thread = createThread(currentTenantId, "Tool Test", "Tool Testing");
    }

    const runResult = await executeToolRun(thread.id, selectedTool, parsed);
    if (runResult) {
      setResult(`Tool executed successfully.\nOutput: ${runResult.output}`);
      toast.success(`${selectedTool} executed`, {
        description: "Results shown below.",
      });
    } else {
      setError("Tool run did not complete (paused for approval or failed).");
    }
    setRunning(false);
  };

  const getSchemaHint = () => {
    if (!currentTool) return "{}";
    const schema = currentTool.schema;
    const example: Record<string, unknown> = {};
    for (const [key, type] of Object.entries(schema)) {
      if (type === "string") example[key] = "";
      else if (type === "number") example[key] = 0;
      else if (type === "array") example[key] = [];
      else if (type === "object") example[key] = {};
    }
    return JSON.stringify(example, null, 2);
  };

  return (
    <div className="mt-8 border-t border-slate-700/50 pt-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Play size={14} className="text-indigo-400" /> Inline Tool Tester
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Run any tool against live app data and see the output immediately.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <Label
              htmlFor="tool-select"
              className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5"
            >
              Select Tool
            </Label>
            <Select
              value={selectedTool}
              onValueChange={(v) => {
                setSelectedTool(v);
                setResult(null);
                setError(null);
                setInputJson("{}");
              }}
            >
              <SelectTrigger
                id="tool-select"
                className="bg-slate-900 border-slate-600 text-slate-200 text-xs h-9"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {toolDefinitions.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.name}
                    className="text-slate-200 text-xs"
                  >
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label
              htmlFor="tool-input-json"
              className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5"
            >
              Input JSON
            </Label>
            <Textarea
              id="tool-input-json"
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              className="bg-slate-900 border-slate-600 text-slate-200 text-xs font-mono min-h-[120px]"
              placeholder={getSchemaHint()}
              data-ocid="tool.tester.input"
            />
          </div>
          <Button
            size="sm"
            onClick={handleTest}
            disabled={running}
            data-ocid="tool.tester.run_button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center justify-center gap-1.5"
          >
            {running ? (
              <>
                <Clock size={12} className="animate-spin" /> Running...
              </>
            ) : (
              <>
                <Play size={12} /> Test Tool
              </>
            )}
          </Button>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
            Output
          </p>
          <div className="bg-slate-900 rounded-lg border border-slate-700 min-h-[200px] p-3">
            {!result && !error && !running && (
              <p className="text-xs text-slate-600 italic">
                Select a tool, set input JSON, and click "Test Tool" to see live
                results.
              </p>
            )}
            {running && (
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-indigo-400 animate-spin" />
                <p className="text-xs text-slate-400">Executing...</p>
              </div>
            )}
            {result && (
              <pre className="text-xs text-emerald-300 whitespace-pre-wrap font-mono leading-relaxed">
                {result}
              </pre>
            )}
            {error && (
              <div className="flex items-start gap-1.5">
                <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const AGENT_TYPE_COLORS: Record<string, string> = {
  "SEO & GEO Agent": "bg-green-500/20 text-green-300 border-green-500/30",
  "Sales Agent": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Support Agent": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Content Agent": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Ops Agent": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Follow-Up Agent": "bg-pink-500/20 text-pink-300 border-pink-500/30",
};

const ROLE_COLORS: Record<string, string> = {
  sales: "bg-blue-500/20 text-blue-300",
  support: "bg-purple-500/20 text-purple-300",
  seo: "bg-green-500/20 text-green-300",
  ops: "bg-orange-500/20 text-orange-300",
  content: "bg-cyan-500/20 text-cyan-300",
  follow_up: "bg-pink-500/20 text-pink-300",
};

const ARTIFACT_TYPE_LABELS: Record<AgentArtifact["artifactType"], string> = {
  proposal: "Proposal",
  estimate: "Estimate",
  content_package: "Content Package",
  lead_summary: "Lead Summary",
  recommendation_set: "Recommendations",
  follow_up_sequence: "Follow-Up Sequence",
  seo_action_plan: "SEO Action Plan",
  support_resolution: "Support Resolution",
};

// ─── Thread Detail Panel ──────────────────────────────────────────────────────

function ThreadDetailPanel({
  thread,
  onClose,
}: { thread: AgentThread; onClose: () => void }) {
  const { getRunsForThread, getArtifactsForThread, agentMemories, tenants } =
    useApp();
  const runs = getRunsForThread(thread.id);
  const artifacts = getArtifactsForThread(thread.id);
  const memory = agentMemories.find((m) => m.threadId === thread.id);
  const tenant = tenants.find((t) => t.id === thread.tenantId);
  const [previewArtifact, setPreviewArtifact] = useState<AgentArtifact | null>(
    null,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end" aria-modal="true">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 w-full h-full border-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl bg-slate-900 border-l border-slate-700 flex flex-col h-full shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${AGENT_TYPE_COLORS[thread.agentType] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
              >
                {thread.agentType}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${thread.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"}`}
              >
                {thread.status}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">{thread.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {tenant?.name ?? thread.tenantId} · Created{" "}
              {timeAgo(thread.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            {/* Memory summary */}
            {memory && (memory.summary || memory.agentNotes) && (
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Thread Memory
                </p>
                <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-lg p-3 space-y-2">
                  {memory.summary && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {memory.summary}
                    </p>
                  )}
                  {memory.agentNotes && (
                    <div className="border-t border-indigo-700/20 pt-2">
                      <p className="text-[10px] font-medium text-indigo-400 mb-1">
                        Agent Notes
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        {memory.agentNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Runs timeline */}
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Runs ({runs.length})
              </p>
              {runs.length === 0 ? (
                <p className="text-xs text-slate-500">No runs yet.</p>
              ) : (
                <div className="space-y-3">
                  {runs.map((run) => (
                    <div
                      key={run.id}
                      className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <RunStatusBadge status={run.status} size="sm" />
                        <span className="text-[10px] text-slate-500">
                          {timeAgo(run.startedAt)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-white mb-1">
                        Prompt
                      </p>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                        {run.inputPrompt}
                      </p>
                      {run.outputText && (
                        <>
                          <p className="text-xs font-medium text-white mb-1">
                            Output
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-3">
                            {run.outputText}
                          </p>
                        </>
                      )}
                      {run.errorMessage && (
                        <div className="flex items-start gap-1.5 mt-1">
                          <XCircle
                            size={11}
                            className="text-red-400 mt-0.5 shrink-0"
                          />
                          <p className="text-xs text-red-400">
                            {run.errorMessage}
                          </p>
                        </div>
                      )}
                      {run.artifactIds.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50">
                          <p className="text-[10px] text-slate-500 mb-1">
                            {run.artifactIds.length} artifact(s) generated
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Artifacts */}
            {artifacts.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Artifacts ({artifacts.length})
                </p>
                <div className="space-y-2">
                  {artifacts.map((art) => (
                    <div
                      key={art.id}
                      className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 flex items-center gap-3"
                    >
                      <ArtifactTypeIcon
                        artifactType={art.artifactType}
                        size={14}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {art.title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {ARTIFACT_TYPE_LABELS[art.artifactType]} ·{" "}
                          {timeAgo(art.createdAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewArtifact(art)}
                        className="text-slate-400 hover:text-white text-xs h-7 px-2"
                      >
                        Preview
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Artifact Preview Modal */}
      {previewArtifact && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          style={{ zIndex: 60 }}
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 bg-black/70 w-full h-full border-0 cursor-default"
            onClick={() => setPreviewArtifact(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <ArtifactTypeIcon
                  artifactType={previewArtifact.artifactType}
                  size={15}
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {previewArtifact.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {ARTIFACT_TYPE_LABELS[previewArtifact.artifactType]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewArtifact(null)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
            <ScrollArea className="flex-1">
              <pre className="p-5 text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {previewArtifact.content}
              </pre>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Approval Queue Tab ───────────────────────────────────────────────────────

function ApprovalQueueTab() {
  const { approvalItems, resolveApproval, agentThreads, tenants } = useApp();
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});
  const [showNotesFor, setShowNotesFor] = useState<string | null>(null);

  const pending = approvalItems.filter((a) => a.status === "pending");
  const resolved = approvalItems
    .filter((a) => a.status !== "pending" && a.status !== "expired")
    .slice(0, 10);

  const getContext = (item: ApprovalItem) => {
    const thread = agentThreads.find((t) => t.id === item.threadId);
    const tenant = tenants.find((t) => t.id === item.tenantId);
    return { thread, tenant };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            Pending Approvals
            {pending.length > 0 && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                {pending.length}
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Review and approve or reject agent actions awaiting human sign-off.
          </p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <CheckCircle size={36} className="text-emerald-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-white">All clear</p>
          <p className="text-xs text-slate-400 mt-1">
            No approvals waiting right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((item) => {
            const { thread, tenant } = getContext(item);
            return (
              <Card
                key={item.id}
                className="bg-slate-800/60 border-amber-500/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${AGENT_TYPE_COLORS[thread?.agentType ?? ""] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
                        >
                          {thread?.agentType ?? item.tenantId}
                        </span>
                        <span className="text-xs text-slate-400">
                          {tenant?.name ?? item.tenantId}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {timeAgo(item.requestedAt)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white mb-1">
                        {item.action}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  </div>

                  {showNotesFor === item.id && (
                    <div className="mb-3">
                      <Textarea
                        placeholder="Add rejection notes (optional)..."
                        value={rejectNotes[item.id] ?? ""}
                        onChange={(e) =>
                          setRejectNotes((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        className="bg-slate-900 border-slate-600 text-slate-200 text-xs min-h-[60px]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      size="sm"
                      onClick={() => {
                        resolveApproval(item.id, true);
                        toast.success("Approved", { description: item.action });
                      }}
                      data-ocid={`approval.${item.id}.approve_button`}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                    >
                      <CheckCircle size={12} className="mr-1" /> Approve
                    </Button>
                    {showNotesFor === item.id ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          resolveApproval(
                            item.id,
                            false,
                            rejectNotes[item.id] ?? "",
                          );
                          setShowNotesFor(null);
                          toast.error("Rejected");
                        }}
                        data-ocid={`approval.${item.id}.reject_confirm_button`}
                        className="text-xs h-8"
                      >
                        Confirm Reject
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNotesFor(item.id)}
                        data-ocid={`approval.${item.id}.reject_button`}
                        className="border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs h-8"
                      >
                        <XCircle size={12} className="mr-1" /> Reject
                      </Button>
                    )}
                    {showNotesFor === item.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowNotesFor(null)}
                        className="text-slate-400 text-xs h-8"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">
            Recently Resolved
          </h3>
          <div className="space-y-2">
            {resolved.map((item) => {
              const { tenant } = getContext(item);
              return (
                <div
                  key={item.id}
                  className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30 flex items-start gap-3"
                >
                  {item.status === "approved" ? (
                    <CheckCircle
                      size={14}
                      className="text-emerald-400 mt-0.5 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={14}
                      className="text-red-400 mt-0.5 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {item.action}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">
                        {tenant?.name ?? item.tenantId}
                      </span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] text-slate-500">
                        {item.status === "approved" ? "Approved" : "Rejected"}
                        {item.resolvedAt ? ` ${timeAgo(item.resolvedAt)}` : ""}
                      </span>
                    </div>
                    {item.approverNotes && (
                      <p className="text-[10px] text-slate-400 mt-1 italic">
                        {item.approverNotes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Template Builder Modal ───────────────────────────────────────────────────

function TemplateFormModal({
  existing,
  onClose,
}: { existing?: AgentTemplateRecord; onClose: () => void }) {
  const { createTemplate, updateTemplate, toolDefinitions } = useApp();
  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState<AgentTemplateRecord["role"]>(
    existing?.role ?? "sales",
  );
  const [systemPrompt, setSystemPrompt] = useState(
    existing?.systemPrompt ?? "",
  );
  const [selectedTools, setSelectedTools] = useState<string[]>(
    existing?.allowedTools ?? [],
  );
  const [memoryMode, setMemoryMode] = useState<
    AgentTemplateRecord["memoryMode"]
  >(existing?.memoryMode ?? "conversation_only");
  const [approvalRequired, setApprovalRequired] = useState(
    existing?.approvalRequired ?? false,
  );

  const toggleTool = (toolName: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName],
    );
  };

  const handleSave = () => {
    if (!name.trim() || !systemPrompt.trim()) {
      toast.error("Name and system prompt are required.");
      return;
    }
    if (existing) {
      updateTemplate(existing.id, {
        name,
        role,
        systemPrompt,
        allowedTools: selectedTools,
        memoryMode,
        approvalRequired,
      });
      toast.success("Template updated");
    } else {
      createTemplate("system", {
        name,
        role,
        systemPrompt,
        allowedTools: selectedTools,
        memoryMode,
        approvalRequired,
        defaultWorkflowSteps: [],
        isDefault: false,
        tenantId: "system",
      });
      toast.success("Template created");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 w-full h-full border-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-white">
            {existing ? "Edit Template" : "Create Template"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">
                Template Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white text-sm"
                placeholder="e.g. Emergency Lead Handler"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as AgentTemplateRecord["role"])}
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {[
                    "sales",
                    "support",
                    "seo",
                    "ops",
                    "content",
                    "follow_up",
                  ].map((r) => (
                    <SelectItem key={r} value={r} className="text-slate-200">
                      {r.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-400 mb-1.5 block">
              System Prompt
            </Label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white text-sm min-h-[100px]"
              placeholder="Define the agent's role, tone, goals, and behavior..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">
                Memory Mode
              </Label>
              <Select
                value={memoryMode}
                onValueChange={(v) =>
                  setMemoryMode(v as AgentTemplateRecord["memoryMode"])
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {[
                    "none",
                    "conversation_only",
                    "with_summary",
                    "with_notes",
                  ].map((m) => (
                    <SelectItem key={m} value={m} className="text-slate-200">
                      {m.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setApprovalRequired((p) => !p)}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border w-full ${approvalRequired ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-slate-800 text-slate-400 border-slate-600"}`}
              >
                {approvalRequired ? (
                  <ToggleRight size={16} />
                ) : (
                  <ToggleLeft size={16} />
                )}
                Requires Approval
              </button>
            </div>
          </div>
          <div>
            <Label className="text-xs text-slate-400 mb-1.5 block">
              Allowed Tools ({selectedTools.length} selected)
            </Label>
            <div className="grid grid-cols-2 gap-1.5">
              {toolDefinitions.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.name)}
                  className={`text-left text-xs px-2 py-1.5 rounded-md border transition-colors ${selectedTools.includes(tool.name) ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500"}`}
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
          >
            <Save size={13} /> {existing ? "Save Changes" : "Create Template"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AgentWorkflowOSPage() {
  const {
    agentThreads,
    agentRunsList,
    agentArtifacts,
    agentTemplates,
    toolDefinitions,
    approvalItems,
    providerAdapters,
    tenants,
    deleteTemplate,
    setActiveAdapter,
  } = useApp();

  const { activateTemplate, getActiveProvider } = useAgentWorkflow();

  const [activeTab, setActiveTab] = useState("threads");
  const [selectedThread, setSelectedThread] = useState<AgentThread | null>(
    null,
  );
  const [threadFilter, setThreadFilter] = useState({
    agentType: "all",
    tenantId: "all",
    status: "all",
  });
  const [artifactSearch, setArtifactSearch] = useState("");
  const [artifactTypeFilter, setArtifactTypeFilter] = useState("all");
  const [previewArtifact, setPreviewArtifact] = useState<AgentArtifact | null>(
    null,
  );
  const [templateModal, setTemplateModal] = useState<{
    open: boolean;
    existing?: AgentTemplateRecord;
  }>({ open: false });
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [adapterValues, setAdapterValues] = useState<
    Record<string, { apiKey: string; baseUrl: string; modelId: string }>
  >({});

  const pendingApprovals = approvalItems.filter((a) => a.status === "pending");
  const activeRuns = agentRunsList.filter((r) => r.status === "running");

  const filteredThreads = agentThreads.filter((t) => {
    if (
      threadFilter.agentType !== "all" &&
      t.agentType !== threadFilter.agentType
    )
      return false;
    if (threadFilter.tenantId !== "all" && t.tenantId !== threadFilter.tenantId)
      return false;
    if (threadFilter.status !== "all" && t.status !== threadFilter.status)
      return false;
    return true;
  });

  const filteredArtifacts = agentArtifacts.filter((a) => {
    if (artifactTypeFilter !== "all" && a.artifactType !== artifactTypeFilter)
      return false;
    if (
      artifactSearch &&
      !a.title.toLowerCase().includes(artifactSearch.toLowerCase())
    )
      return false;
    return true;
  });

  const uniqueAgentTypes = [...new Set(agentThreads.map((t) => t.agentType))];
  const clientTenants = tenants.filter((t) => t.id !== "tenant-demo");

  const handleSaveAdapter = (
    adapterId: string,
    tenantId: string,
    adapterType: ProviderAdapterConfig["adapterType"],
    isEnabled: boolean,
  ) => {
    const vals = adapterValues[adapterId] ?? {};
    setActiveAdapter(
      tenantId,
      adapterType,
      isEnabled,
      vals.apiKey,
      vals.baseUrl,
      vals.modelId,
    );
    toast.success("Adapter settings saved");
  };

  const ADAPTER_DESCRIPTIONS: Record<string, string> = {
    native: "Built-in BRF agent engine. No API key needed. Always available.",
    openai_compatible:
      "Connect to OpenAI GPT-4o or any OpenAI-compatible API endpoint.",
    anthropic_claude: "Connect to Anthropic's Claude models via their API.",
    ollama_local:
      "Use a locally-running Ollama instance for private, on-premise inference.",
    deerflow_bridge: "Bridge adapter for DeerFlow workflow orchestration.",
    abacus_adapter: "Adapter for Abacus.AI cloud-hosted models.",
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={20} className="text-indigo-400" />
            <h1 className="text-xl font-bold text-white">Agent Workflow OS</h1>
          </div>
          <p className="text-sm text-slate-400">
            Monitor, manage, and trace every agent run across all clients.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Threads",
            value: agentThreads.length,
            icon: Database,
            color: "text-blue-400",
          },
          {
            label: "Active Runs",
            value: activeRuns.length,
            icon: Zap,
            color: "text-emerald-400",
            badge: activeRuns.length > 0,
          },
          {
            label: "Pending Approvals",
            value: pendingApprovals.length,
            icon: AlertTriangle,
            color: "text-amber-400",
            badge: pendingApprovals.length > 0,
          },
          {
            label: "Total Artifacts",
            value: agentArtifacts.length,
            icon: FileText,
            color: "text-purple-400",
          },
        ].map(({ label, value, icon: Icon, color, badge }) => (
          <Card key={label} className="bg-slate-800/60 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={color} />
                {badge && value > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-medium">
                    {value}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border border-slate-700 flex-wrap h-auto gap-0.5 p-1">
          {[
            { value: "threads", label: "Threads & Runs" },
            {
              value: "approvals",
              label: "Approval Queue",
              badge: pendingApprovals.length,
            },
            { value: "templates", label: "Agent Templates" },
            { value: "tools", label: "Tool Registry" },
            { value: "crm", label: "CRM Snapshot" },
            { value: "providers", label: "Provider Adapters" },
            { value: "artifacts", label: "Artifacts" },
          ].map(({ value, label, badge }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 flex items-center gap-1.5"
            >
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Threads & Runs Tab */}
        <TabsContent value="threads" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select
              value={threadFilter.agentType}
              onValueChange={(v) =>
                setThreadFilter((p) => ({ ...p, agentType: v }))
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-xs h-8 w-44">
                <Filter size={11} className="mr-1" />
                <SelectValue placeholder="Agent type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-slate-200 text-xs">
                  All Agent Types
                </SelectItem>
                {uniqueAgentTypes.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    className="text-slate-200 text-xs"
                  >
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={threadFilter.tenantId}
              onValueChange={(v) =>
                setThreadFilter((p) => ({ ...p, tenantId: v }))
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-xs h-8 w-44">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-slate-200 text-xs">
                  All Clients
                </SelectItem>
                {clientTenants.map((t) => (
                  <SelectItem
                    key={t.id}
                    value={t.id}
                    className="text-slate-200 text-xs"
                  >
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={threadFilter.status}
              onValueChange={(v) =>
                setThreadFilter((p) => ({ ...p, status: v }))
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-xs h-8 w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-slate-200 text-xs">
                  All Status
                </SelectItem>
                {["active", "paused", "archived"].map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="text-slate-200 text-xs capitalize"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Thread list */}
          <div className="space-y-3">
            {filteredThreads.map((thread) => {
              const tenant = tenants.find((t) => t.id === thread.tenantId);
              const runs = agentRunsList.filter(
                (r) => r.threadId === thread.id,
              );
              const lastRun = runs[0];
              return (
                <Card
                  key={thread.id}
                  className="bg-slate-800/60 border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${AGENT_TYPE_COLORS[thread.agentType] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
                          >
                            {thread.agentType}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${thread.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"}`}
                          >
                            {thread.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white mb-0.5 truncate">
                          {thread.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {tenant?.name ?? thread.tenantId} ·{" "}
                          {thread.messageCount} messages · Updated{" "}
                          {lastRun
                            ? timeAgo(lastRun.startedAt)
                            : timeAgo(thread.updatedAt)}
                        </p>
                        {thread.summary && (
                          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                            {thread.summary}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {lastRun && (
                          <div className="flex flex-col items-end gap-1">
                            <RunStatusBadge status={lastRun.status} size="sm" />
                            {lastRun.status === "paused_for_approval" && (
                              <span className="text-[9px] text-slate-500 bg-slate-700/60 px-1.5 py-0.5 rounded">
                                Via: {getActiveProvider()}
                              </span>
                            )}
                          </div>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedThread(thread)}
                          data-ocid={`thread.${thread.id}.view_button`}
                          className="border-slate-600 text-slate-300 hover:text-white text-xs h-7 px-2.5"
                        >
                          View Thread{" "}
                          <ChevronRight size={11} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredThreads.length === 0 && (
              <div className="text-center py-12 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400">
                  No threads match your filters.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="mt-4">
          <ApprovalQueueTab />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Agent Templates
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Reusable agent configurations by role and use case.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setTemplateModal({ open: true })}
              data-ocid="templates.create_button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 text-xs"
            >
              <Plus size={13} /> Create Template
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agentTemplates.map((tmpl) => (
              <Card
                key={tmpl.id}
                className="bg-slate-800/60 border-slate-700/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${ROLE_COLORS[tmpl.role] ?? "bg-slate-700 text-slate-400"}`}
                        >
                          {tmpl.role.replace("_", " ")}
                        </span>
                        {tmpl.isDefault && (
                          <span className="text-[10px] text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        {tmpl.approvalRequired && (
                          <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full">
                            Approval req.
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {tmpl.name}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setTemplateModal({ open: true, existing: tmpl })
                        }
                        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                        aria-label="Edit"
                      >
                        <Pencil size={12} />
                      </button>
                      {!tmpl.isDefault && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteTemplate(tmpl.id);
                            toast.success("Template deleted");
                          }}
                          className="p-1.5 rounded hover:bg-red-900/30 text-slate-400 hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                    {tmpl.systemPrompt}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Shield size={10} /> Memory:{" "}
                      {tmpl.memoryMode.replace(/_/g, " ")}
                    </span>
                    <span>{tmpl.allowedTools.length} tools</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700/40">
                    <Button
                      size="sm"
                      data-ocid={`template.${tmpl.id}.activate_button`}
                      onClick={() => {
                        activateTemplate(tmpl).then(() => {
                          toast.success(`${tmpl.name} activated`, {
                            description: "Thread created and first run queued.",
                          });
                        });
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 flex items-center gap-1.5"
                    >
                      <Zap size={11} /> Activate Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tool Registry Tab */}
        <TabsContent value="tools" className="mt-4 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              Tool Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Internal tools available to agents, scoped by tenant and
              permission.
            </p>
          </div>
          {(
            ["crm", "content", "notification", "analytics", "pricing"] as const
          ).map((cat) => {
            const catTools = toolDefinitions.filter((t) => t.category === cat);
            if (!catTools.length) return null;
            return (
              <div key={cat}>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={10} /> {cat.toUpperCase()}
                </p>
                <div className="space-y-2">
                  {catTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className="bg-slate-800/60 border-slate-700/50"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                {tool.name}
                              </code>
                              {tool.requiresApproval && (
                                <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded-full">
                                  Needs Approval
                                </span>
                              )}
                              {tool.tenantScoped && (
                                <span className="text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                                  Tenant Scoped
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">
                              {tool.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {tool.permissions.map((p) => (
                                <span
                                  key={p}
                                  className="text-[10px] text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tool.isEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-500"}`}
                            >
                              {tool.isEnabled ? "Enabled" : "Disabled"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTool(
                                  expandedTool === tool.id ? null : tool.id,
                                )
                              }
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                              aria-label="Toggle schema"
                            >
                              {expandedTool === tool.id ? (
                                <ChevronDown size={13} />
                              ) : (
                                <ChevronRight size={13} />
                              )}
                            </button>
                          </div>
                        </div>
                        {expandedTool === tool.id && (
                          <div className="mt-3 pt-3 border-t border-slate-700/50">
                            <p className="text-[10px] text-slate-500 mb-1.5">
                              Schema
                            </p>
                            <pre className="text-[10px] text-slate-300 bg-slate-900 rounded p-2 overflow-auto font-mono">
                              {JSON.stringify(tool.schema, null, 2)}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
          <ToolTestingPanel />
        </TabsContent>

        {/* Provider Adapters Tab */}

        {/* CRM Snapshot Tab */}
        <TabsContent value="crm" className="mt-4">
          <CrmSnapshotTab />
        </TabsContent>

        <TabsContent value="providers" className="mt-4 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              AI Provider Adapters
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure how agents route to AI backends. The platform works
              fully with no external provider enabled.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providerAdapters.map((adapter) => {
              const isNative = adapter.adapterType === "native";
              const vals = adapterValues[adapter.id] ?? {};
              return (
                <Card
                  key={adapter.id}
                  className={`bg-slate-800/60 border-slate-700/50 ${adapter.isEnabled ? "ring-1 ring-indigo-500/30" : ""}`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white capitalize">
                          {adapter.adapterType.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {ADAPTER_DESCRIPTIONS[adapter.adapterType]}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${adapter.isEnabled ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-700 text-slate-400 border border-slate-600"}`}
                      >
                        {adapter.isEnabled ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {!isNative && (
                      <div className="space-y-2">
                        <div>
                          <Label className="text-[10px] text-slate-500 mb-1 block">
                            API Key
                          </Label>
                          <Input
                            type="password"
                            placeholder="sk-..."
                            value={vals.apiKey ?? adapter.apiKey}
                            onChange={(e) =>
                              setAdapterValues((p) => ({
                                ...p,
                                [adapter.id]: {
                                  ...vals,
                                  apiKey: e.target.value,
                                },
                              }))
                            }
                            className="bg-slate-900 border-slate-600 text-white text-xs h-8"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-[10px] text-slate-500 mb-1 block">
                              Base URL
                            </Label>
                            <Input
                              value={vals.baseUrl ?? adapter.baseUrl}
                              onChange={(e) =>
                                setAdapterValues((p) => ({
                                  ...p,
                                  [adapter.id]: {
                                    ...vals,
                                    baseUrl: e.target.value,
                                  },
                                }))
                              }
                              className="bg-slate-900 border-slate-600 text-white text-xs h-8"
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-slate-500 mb-1 block">
                              Model ID
                            </Label>
                            <Input
                              value={vals.modelId ?? adapter.modelId}
                              onChange={(e) =>
                                setAdapterValues((p) => ({
                                  ...p,
                                  [adapter.id]: {
                                    ...vals,
                                    modelId: e.target.value,
                                  },
                                }))
                              }
                              className="bg-slate-900 border-slate-600 text-white text-xs h-8"
                              placeholder="gpt-4o"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      {!isNative && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSaveAdapter(
                              adapter.id,
                              adapter.tenantId,
                              adapter.adapterType,
                              !adapter.isEnabled,
                            )
                          }
                          className={`text-xs h-8 flex-1 ${adapter.isEnabled ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                        >
                          {adapter.isEnabled ? "Disable" : "Enable"}
                        </Button>
                      )}
                      {!isNative && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast.info(
                              "Connection test requires a live API key.",
                            );
                          }}
                          className="text-xs h-8 border-slate-600 text-slate-400 hover:text-white"
                        >
                          Test
                        </Button>
                      )}
                      {isNative && (
                        <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle size={12} /> Always active — no
                          configuration needed
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Artifacts Tab */}
        <TabsContent value="artifacts" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                Generated Artifacts
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                All structured outputs generated by agents across all clients.
              </p>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <Input
                placeholder="Search artifacts..."
                value={artifactSearch}
                onChange={(e) => setArtifactSearch(e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-200 text-xs h-8 w-48"
              />
              <Select
                value={artifactTypeFilter}
                onValueChange={setArtifactTypeFilter}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-300 text-xs h-8 w-44">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all" className="text-slate-200 text-xs">
                    All Types
                  </SelectItem>
                  {Object.entries(ARTIFACT_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem
                      key={k}
                      value={k}
                      className="text-slate-200 text-xs"
                    >
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredArtifacts.map((art) => {
              const tenant = tenants.find((t) => t.id === art.tenantId);
              return (
                <Card
                  key={art.id}
                  className="bg-slate-800/60 border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <ArtifactTypeIcon
                        artifactType={art.artifactType}
                        size={15}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {art.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">
                            {ARTIFACT_TYPE_LABELS[art.artifactType]}
                          </span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${art.status === "final" ? "bg-emerald-500/20 text-emerald-300" : art.status === "archived" ? "bg-slate-700 text-slate-500" : "bg-amber-500/20 text-amber-300"}`}
                          >
                            {art.status}
                          </span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className="text-[10px] text-slate-400">
                            {tenant?.name ?? art.tenantId}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {timeAgo(art.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewArtifact(art)}
                        data-ocid={`artifact.${art.id}.preview_button`}
                        className="border-slate-600 text-slate-300 hover:text-white text-xs h-7 px-2.5 flex-1"
                      >
                        Preview
                      </Button>
                      <ArtifactActions artifact={art} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredArtifacts.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <FileText size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No artifacts found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Thread detail panel */}
      {selectedThread && (
        <ThreadDetailPanel
          thread={selectedThread}
          onClose={() => setSelectedThread(null)}
        />
      )}

      {/* Template create/edit modal */}
      {templateModal.open && (
        <TemplateFormModal
          existing={templateModal.existing}
          onClose={() => setTemplateModal({ open: false })}
        />
      )}

      {/* Artifact preview modal */}
      {previewArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 bg-black/70 w-full h-full border-0 cursor-default"
            onClick={() => setPreviewArtifact(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <ArtifactTypeIcon
                  artifactType={previewArtifact.artifactType}
                  size={15}
                />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {previewArtifact.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {ARTIFACT_TYPE_LABELS[previewArtifact.artifactType]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewArtifact(null)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
            <ScrollArea className="flex-1">
              <pre className="p-5 text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {previewArtifact.content}
              </pre>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
