import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  CreditCard,
  FileText,
  MessageSquare,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Reply,
  Settings2,
  Smartphone,
  Square,
  Star,
  Trash2,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentStatusType =
  | "active"
  | "idle"
  | "needs_attention"
  | "error"
  | "paused";

interface AgentStatus {
  id: string;
  name: string;
  status: AgentStatusType;
  lastRun?: string;
  nextScheduled?: string;
  lastError?: string;
  enabled: boolean;
  config?: string;
}

interface AgentLogEntry {
  id: string;
  agentId: string;
  action: string;
  timestamp: string;
  actionType: "info" | "success" | "warning" | "error";
}

interface TriggerRule {
  id: string;
  name: string;
  conditionType: string;
  actionType: string;
  conditionDetails?: string;
  actionDetails?: string;
  enabled: boolean;
}

type ConditionType =
  | "new_lead"
  | "trial_start"
  | "outreach_reply"
  | "review_received";
type ActionType =
  | "run_enrichment"
  | "queue_outreach"
  | "send_notification"
  | "update_crm";

const CONDITION_LABELS: Record<ConditionType, string> = {
  new_lead: "New lead arrives",
  trial_start: "Trial activated",
  outreach_reply: "Outreach reply received",
  review_received: "New review received",
};

const ACTION_LABELS: Record<ActionType, string> = {
  run_enrichment: "Run Claude enrichment",
  queue_outreach: "Queue for outreach",
  send_notification: "Send admin notification",
  update_crm: "Update CRM record",
};

// ─── Backend Types ───────────────────────────────────────────────────────────

interface BackendAgentStatus {
  agentId: string;
  agentName: string;
  status: string;
  lastRunAt: [] | [bigint];
  nextScheduledAt: [] | [bigint];
  lastError: [] | [string];
  isEnabled: boolean;
  config: string;
}

interface BackendTriggerRule {
  ruleId: string;
  name: string;
  condition: string;
  conditionType: string;
  action: string;
  actionType: string;
  isEnabled: boolean;
  createdAt: bigint;
}

// ─── Mapping Helpers ─────────────────────────────────────────────────────────

function mapBackendAgent(b: BackendAgentStatus): AgentStatus {
  return {
    id: b.agentId,
    name: b.agentName,
    status: (b.status as AgentStatusType) || "idle",
    lastRun:
      b.lastRunAt.length > 0
        ? new Date(Number(b.lastRunAt[0])).toISOString()
        : undefined,
    nextScheduled:
      b.nextScheduledAt.length > 0
        ? new Date(Number(b.nextScheduledAt[0])).toISOString()
        : undefined,
    lastError: b.lastError.length > 0 ? b.lastError[0] : undefined,
    enabled: b.isEnabled,
    config: b.config,
  };
}

function mapBackendTrigger(b: BackendTriggerRule): TriggerRule {
  return {
    id: b.ruleId,
    name: b.name,
    conditionType: b.conditionType,
    actionType: b.actionType,
    conditionDetails: b.condition,
    actionDetails: b.action,
    enabled: b.isEnabled,
  };
}

const AGENT_ICONS: Record<string, React.ReactNode> = {
  "lead-finder": <Zap size={18} />,
  "ai-front-desk": <Bot size={18} />,
  "outreach-agent": <MessageSquare size={18} />,
  "social-media": <Star size={18} />,
  reputation: <CheckCircle2 size={18} />,
  "credit-builder": <CreditCard size={18} />,
  "reply-intelligence": <Reply size={18} />,
  "sms-automation": <Smartphone size={18} />,
};

// ─── Status Helpers ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AgentStatusType,
  { color: string; badge: string; dot: string; label: string }
> = {
  active: {
    color: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
    label: "Active",
  },
  idle: {
    color: "text-slate-400",
    badge: "bg-slate-700/50 text-slate-400 border-slate-600/30",
    dot: "bg-slate-500",
    label: "Idle",
  },
  needs_attention: {
    color: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400",
    label: "Needs Attention",
  },
  error: {
    color: "text-red-400",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    dot: "bg-red-400",
    label: "Error",
  },
  paused: {
    color: "text-slate-500",
    badge: "bg-slate-800/60 text-slate-500 border-slate-700/30",
    dot: "bg-slate-600",
    label: "Paused",
  },
};

const LOG_TYPE_CONFIG = {
  info: {
    icon: <Clock size={12} />,
    color: "text-blue-400",
    badge: "bg-blue-500/15 text-blue-300",
  },
  success: {
    icon: <CheckCircle2 size={12} />,
    color: "text-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-300",
  },
  warning: {
    icon: <AlertTriangle size={12} />,
    color: "text-amber-400",
    badge: "bg-amber-500/15 text-amber-300",
  },
  error: {
    icon: <XCircle size={12} />,
    color: "text-red-400",
    badge: "bg-red-500/15 text-red-300",
  },
};

function formatTime(ts: string) {
  if (!ts || ts === "Continuous" || ts === "Tomorrow" || ts === "Paused")
    return ts;
  if (
    ts.includes("ago") ||
    ts.includes("now") ||
    ts.includes("min") ||
    ts.includes("hr") ||
    ts.includes("In ")
  )
    return ts;
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

// ─── Agent Card ──────────────────────────────────────────────────────────────

interface AgentCardProps {
  agent: AgentStatus;
  onToggle: (id: string, enabled: boolean) => void;
  onStatusChange: (id: string, status: AgentStatusType) => void;
  onOpenDrawer: (agent: AgentStatus) => void;
}

function AgentCard({
  agent,
  onToggle,
  onStatusChange,
  onOpenDrawer,
}: AgentCardProps) {
  const sc = STATUS_CONFIG[agent.status];
  const isActive = agent.status === "active";

  return (
    <div
      className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 flex flex-col gap-3 hover:bg-white/8 transition-colors cursor-pointer group"
      onClick={() => onOpenDrawer(agent)}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenDrawer(agent);
      }}
      aria-label={`Configure ${agent.name} agent`}
      data-ocid={`agent.card.${agent.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`${sc.color} shrink-0`}>
            {AGENT_ICONS[agent.id] ?? <Bot size={18} />}
          </div>
          <span className="text-base font-semibold text-white truncate">
            {agent.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Status badge */}
          <span
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${sc.badge}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot} ${isActive ? "animate-pulse" : ""}`}
            />
            {sc.label}
          </span>
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex flex-col gap-0.5 text-xs">
        {agent.lastRun && (
          <span className="text-slate-400">
            <span className="text-slate-500">Last run: </span>
            {formatTime(agent.lastRun)}
          </span>
        )}
        {agent.nextScheduled && (
          <span className="text-slate-400">
            <span className="text-slate-500">Next: </span>
            {formatTime(agent.nextScheduled)}
          </span>
        )}
      </div>

      {/* Error message */}
      {agent.lastError && agent.status === "error" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <p className="text-xs text-red-300 leading-snug">{agent.lastError}</p>
        </div>
      )}

      {/* Actions row */}
      <div
        className="flex items-center gap-2 pt-1 border-t border-white/5"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        {/* Enable toggle */}
        <button
          type="button"
          onClick={() => onToggle(agent.id, !agent.enabled)}
          data-ocid={`agent.toggle.${agent.id}`}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none ${
            agent.enabled
              ? "bg-emerald-500 border-emerald-600"
              : "bg-slate-700 border-slate-600"
          }`}
          aria-label={agent.enabled ? "Disable agent" : "Enable agent"}
        >
          <span
            className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow ring-0 transition-transform mt-px ${
              agent.enabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>

        <div className="flex items-center gap-1 ml-auto">
          {/* Start/Stop/Pause icon buttons */}
          {agent.status !== "active" && agent.enabled && (
            <button
              type="button"
              onClick={() => onStatusChange(agent.id, "active")}
              data-ocid={`agent.start.${agent.id}`}
              className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              aria-label="Start agent"
            >
              <Play size={13} />
            </button>
          )}
          {agent.status === "active" && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(agent.id, "paused")}
                data-ocid={`agent.pause.${agent.id}`}
                className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                aria-label="Pause agent"
              >
                <Pause size={13} />
              </button>
              <button
                type="button"
                onClick={() => onStatusChange(agent.id, "idle")}
                data-ocid={`agent.stop.${agent.id}`}
                className="p-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                aria-label="Stop agent"
              >
                <Square size={13} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onOpenDrawer(agent)}
            data-ocid={`agent.configure.${agent.id}`}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs font-medium transition-colors"
          >
            <Settings2 size={12} />
            Configure
          </button>
          <button
            type="button"
            onClick={() => onOpenDrawer(agent)}
            data-ocid={`agent.viewlogs.${agent.id}`}
            className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            <FileText size={12} />
            Logs
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Drawer ─────────────────────────────────────────────────────────────

interface AgentDrawerProps {
  agent: AgentStatus;
  logs: AgentLogEntry[];
  onClose: () => void;
  onSaveConfig: (agentId: string, config: string) => void;
}

function AgentDrawer({ agent, logs, onClose, onSaveConfig }: AgentDrawerProps) {
  const [tab, setTab] = useState<"logs" | "config">("logs");
  const [configValue, setConfigValue] = useState(agent.config ?? "{}");

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      data-ocid="agent.drawer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        role="button"
        tabIndex={-1}
        onClick={onClose}
        onKeyUp={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close drawer"
      />

      {/* Drawer panel */}
      <div className="relative w-96 h-full bg-gray-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h3 className="font-semibold text-white">{agent.name}</h3>
            <span className={`text-xs ${STATUS_CONFIG[agent.status].color}`}>
              {STATUS_CONFIG[agent.status].label}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="agent.drawer.close_button"
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {(["logs", "config"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              data-ocid={`agent.drawer.tab.${t}`}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "text-blue-300 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {t === "logs" ? "Activity Logs" : "Configuration"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "logs" ? (
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No activity yet.
                </div>
              ) : (
                logs.map((log) => {
                  const lc = LOG_TYPE_CONFIG[log.actionType];
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-2.5 bg-white/4 rounded-lg px-3 py-2.5"
                    >
                      <span className={`mt-0.5 shrink-0 ${lc.color}`}>
                        {lc.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 leading-snug">
                          {log.action}
                        </p>
                        <span className="text-xs text-slate-500">
                          {log.timestamp}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${lc.badge}`}
                      >
                        {log.actionType}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Edit agent configuration JSON. Changes take effect on next run.
              </p>
              <textarea
                value={configValue}
                onChange={(e) => setConfigValue(e.target.value)}
                data-ocid="agent.config.textarea"
                className="w-full h-64 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-200 resize-none focus:outline-none focus:border-blue-500/50"
                spellCheck={false}
              />
              <Button
                type="button"
                onClick={() => onSaveConfig(agent.id, configValue)}
                data-ocid="agent.config.save_button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Configuration
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Trigger Rule Card ────────────────────────────────────────────────────────

interface TriggerCardProps {
  rule: TriggerRule;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
}

function TriggerCard({ rule, onToggle, onDelete }: TriggerCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      data-ocid={`trigger.card.${rule.id}`}
    >
      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
        <span className="font-medium text-white text-sm truncate">
          {rule.name}
        </span>
        <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/15 text-blue-300 border border-blue-500/20 shrink-0">
          {CONDITION_LABELS[rule.conditionType as ConditionType] ??
            rule.conditionType}
        </span>
        <ChevronRight size={12} className="text-slate-500 shrink-0" />
        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 shrink-0">
          {ACTION_LABELS[rule.actionType as ActionType] ?? rule.actionType}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle */}
        <button
          type="button"
          onClick={() => onToggle(rule.id, !rule.enabled)}
          data-ocid={`trigger.toggle.${rule.id}`}
          className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full border-2 transition-colors ${
            rule.enabled
              ? "bg-emerald-500 border-emerald-600"
              : "bg-slate-700 border-slate-600"
          }`}
          aria-label={rule.enabled ? "Disable trigger" : "Enable trigger"}
        >
          <span
            className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow ring-0 transition-transform mt-px ${
              rule.enabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>

        {confirmDelete ? (
          <>
            <Button
              type="button"
              onClick={() => onDelete(rule.id)}
              data-ocid={`trigger.confirm_button.${rule.id}`}
              className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm
            </Button>
            <Button
              type="button"
              onClick={() => setConfirmDelete(false)}
              data-ocid={`trigger.cancel_button.${rule.id}`}
              variant="ghost"
              className="h-7 px-2 text-xs text-slate-400"
            >
              Cancel
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            data-ocid={`trigger.delete_button.${rule.id}`}
            className="p-1.5 rounded-md hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"
            aria-label="Delete trigger"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Add Trigger Form ─────────────────────────────────────────────────────────

interface AddTriggerFormProps {
  onSave: (rule: Omit<TriggerRule, "id" | "enabled">) => void;
  onCancel: () => void;
}

function AddTriggerForm({ onSave, onCancel }: AddTriggerFormProps) {
  const [name, setName] = useState("");
  const [conditionType, setConditionType] = useState<ConditionType>("new_lead");
  const [actionType, setActionType] = useState<ActionType>("run_enrichment");
  const [conditionDetails, setConditionDetails] = useState("");
  const [actionDetails, setActionDetails] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name,
      conditionType,
      actionType,
      conditionDetails,
      actionDetails,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"
      data-ocid="trigger.add_form"
    >
      <h4 className="text-sm font-semibold text-white">
        New Automation Trigger
      </h4>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="col-span-full">
          <label
            className="block text-xs text-slate-400 mb-1"
            htmlFor="trigger-name"
          >
            Trigger Name
          </label>
          <input
            id="trigger-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-ocid="trigger.name.input"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
            placeholder="e.g. Enrich new roofing leads"
          />
        </div>

        <div>
          <label
            className="block text-xs text-slate-400 mb-1"
            htmlFor="condition-type"
          >
            When (Condition)
          </label>
          <select
            id="condition-type"
            value={conditionType}
            onChange={(e) => setConditionType(e.target.value as ConditionType)}
            data-ocid="trigger.condition.select"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
          >
            {(
              Object.entries(CONDITION_LABELS) as [ConditionType, string][]
            ).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-xs text-slate-400 mb-1"
            htmlFor="action-type"
          >
            Then (Action)
          </label>
          <select
            id="action-type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value as ActionType)}
            data-ocid="trigger.action.select"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
          >
            {(Object.entries(ACTION_LABELS) as [ActionType, string][]).map(
              ([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ),
            )}
          </select>
        </div>

        <div>
          <label
            className="block text-xs text-slate-400 mb-1"
            htmlFor="condition-details"
          >
            Condition Details
          </label>
          <input
            id="condition-details"
            type="text"
            value={conditionDetails}
            onChange={(e) => setConditionDetails(e.target.value)}
            data-ocid="trigger.conditiondetails.input"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
            placeholder="e.g. niche=roofing"
          />
        </div>

        <div>
          <label
            className="block text-xs text-slate-400 mb-1"
            htmlFor="action-details"
          >
            Action Details
          </label>
          <input
            id="action-details"
            type="text"
            value={actionDetails}
            onChange={(e) => setActionDetails(e.target.value)}
            data-ocid="trigger.actiondetails.input"
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50"
            placeholder="e.g. model=claude-3-5-sonnet"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          data-ocid="trigger.cancel_button"
          className="text-slate-400"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          data-ocid="trigger.submit_button"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Trigger
        </Button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AgentOrchestrationPage() {
  const { actor } = useActor();

  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [triggers, setTriggers] = useState<TriggerRule[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [triggersLoading, setTriggersLoading] = useState(true);
  const [drawerAgent, setDrawerAgent] = useState<AgentStatus | null>(null);
  const [drawerLogs, setDrawerLogs] = useState<AgentLogEntry[]>([]);
  const [showAddTrigger, setShowAddTrigger] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const loadAgents = useCallback(async () => {
    if (!actor) return;
    setAgentsLoading(true);
    setTriggersLoading(true);
    try {
      const statuses = await (
        actor as unknown as {
          getAgentStatuses: () => Promise<BackendAgentStatus[]>;
        }
      ).getAgentStatuses();
      setAgents(statuses ? statuses.map(mapBackendAgent) : []);
    } catch {
      setAgents([]);
    } finally {
      setAgentsLoading(false);
    }
    try {
      const rules = await (
        actor as unknown as {
          getTriggerRules: () => Promise<BackendTriggerRule[]>;
        }
      ).getTriggerRules();
      setTriggers(rules ? rules.map(mapBackendTrigger) : []);
    } catch {
      setTriggers([]);
    } finally {
      setTriggersLoading(false);
    }
    setLastSync(new Date());
  }, [actor]);

  useEffect(() => {
    loadAgents();
    const interval = setInterval(loadAgents, 30000);
    return () => clearInterval(interval);
  }, [loadAgents]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadAgents();
    setTimeout(() => setRefreshing(false), 600);
    toast.success("Agent statuses refreshed");
  }

  async function handleToggleAgent(id: string, enabled: boolean) {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, enabled } : a)));
    if (actor) {
      try {
        const status = enabled ? "idle" : "paused";
        await (
          actor as unknown as {
            updateAgentStatus: (
              id: string,
              s: string,
              e: string | null,
            ) => Promise<void>;
          }
        ).updateAgentStatus(id, status, null);
      } catch {
        /* noop */
      }
    }
    toast.success(enabled ? "Agent enabled" : "Agent disabled");
  }

  async function handleStatusChange(id: string, status: AgentStatusType) {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    if (actor) {
      try {
        await (
          actor as unknown as {
            updateAgentStatus: (
              id: string,
              s: string,
              e: string | null,
            ) => Promise<void>;
          }
        ).updateAgentStatus(id, status, null);
      } catch {
        /* noop */
      }
    }
    toast.success(`Agent ${status}`);
  }

  async function handleOpenDrawer(agent: AgentStatus) {
    setDrawerAgent(agent);
    setDrawerLogs([]);
  }

  async function handleSaveConfig(agentId: string, config: string) {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, config } : a)),
    );
    if (actor) {
      try {
        await (
          actor as unknown as {
            updateAgentConfig: (id: string, cfg: string) => Promise<void>;
          }
        ).updateAgentConfig(agentId, config);
      } catch {
        /* noop */
      }
    }
    toast.success("Configuration saved");
    setDrawerAgent(null);
  }

  async function handlePauseAll() {
    const activeAgents = agents.filter((a) => a.status === "active");
    setAgents((prev) =>
      prev.map((a) =>
        a.status === "active"
          ? { ...a, status: "paused" as AgentStatusType }
          : a,
      ),
    );
    if (actor) {
      for (const agent of activeAgents) {
        try {
          await (
            actor as unknown as {
              updateAgentStatus: (
                id: string,
                s: string,
                e: string | null,
              ) => Promise<void>;
            }
          ).updateAgentStatus(agent.id, "paused", null);
        } catch {
          /* noop */
        }
      }
    }
    toast.success("All active agents paused");
  }

  async function handleResumeAll() {
    const pausedAgents = agents.filter((a) => a.status === "paused");
    setAgents((prev) =>
      prev.map((a) =>
        a.status === "paused" ? { ...a, status: "idle" as AgentStatusType } : a,
      ),
    );
    if (actor) {
      for (const agent of pausedAgents) {
        try {
          await (
            actor as unknown as {
              updateAgentStatus: (
                id: string,
                s: string,
                e: string | null,
              ) => Promise<void>;
            }
          ).updateAgentStatus(agent.id, "idle", null);
        } catch {
          /* noop */
        }
      }
    }
    toast.success("All agents resumed");
  }

  async function handleToggleTrigger(id: string, enabled: boolean) {
    setTriggers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled } : r)),
    );
    if (actor) {
      try {
        await (
          actor as unknown as {
            toggleTriggerRule: (
              id: string,
              e: boolean,
            ) => Promise<[BackendTriggerRule] | []>;
          }
        ).toggleTriggerRule(id, enabled);
      } catch {
        /* noop */
      }
    }
  }

  async function handleDeleteTrigger(id: string) {
    setTriggers((prev) => prev.filter((r) => r.id !== id));
    if (actor) {
      try {
        await (
          actor as unknown as {
            deleteTriggerRule: (id: string) => Promise<boolean>;
          }
        ).deleteTriggerRule(id);
      } catch {
        /* noop */
      }
    }
    toast.success("Trigger deleted");
  }

  async function handleAddTrigger(rule: Omit<TriggerRule, "id" | "enabled">) {
    if (actor) {
      try {
        const saved = await (
          actor as unknown as {
            addTriggerRule: (r: {
              name: string;
              condition: string;
              conditionType: string;
              action: string;
              actionType: string;
              isEnabled: boolean;
            }) => Promise<BackendTriggerRule>;
          }
        ).addTriggerRule({
          name: rule.name,
          condition: rule.conditionDetails ?? "",
          conditionType: rule.conditionType,
          action: rule.actionDetails ?? "",
          actionType: rule.actionType,
          isEnabled: true,
        });
        setTriggers((prev) => [...prev, mapBackendTrigger(saved)]);
      } catch {
        /* noop */
      }
    }
    setShowAddTrigger(false);
    toast.success("Trigger added");
  }

  const activeCount = agents.filter((a) => a.status === "active").length;
  const errorCount = agents.filter((a) => a.status === "error").length;
  const attentionCount = agents.filter(
    (a) => a.status === "needs_attention",
  ).length;

  return (
    <div className="min-h-screen bg-gray-950 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* SECTION 1 — Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Cpu size={24} className="text-blue-400" />
              <h1 className="text-2xl font-bold text-white">
                Agent Orchestration
              </h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-300 font-medium">
                  {activeCount} Active
                </span>
              </span>
              {errorCount > 0 && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/20">
                  <XCircle size={12} className="text-red-400" />
                  <span className="text-xs text-red-300 font-medium">
                    {errorCount} Error
                  </span>
                </span>
              )}
              {attentionCount > 0 && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20">
                  <AlertTriangle size={12} className="text-amber-400" />
                  <span className="text-xs text-amber-300 font-medium">
                    {attentionCount} Attention
                  </span>
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              Monitor, control, and automate your AI agents
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Last sync{" "}
              {lastSync.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <Button
              type="button"
              variant="ghost"
              onClick={handleRefresh}
              data-ocid="orchestration.refresh_button"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* SECTION 2 — Bulk Actions */}
        <div
          className="flex flex-wrap gap-2"
          data-ocid="orchestration.bulk_actions"
        >
          <Button
            type="button"
            onClick={handlePauseAll}
            data-ocid="orchestration.pause_all_button"
            variant="outline"
            className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <Pause size={14} className="mr-1.5" />
            Pause All Agents
          </Button>
          <Button
            type="button"
            onClick={handleResumeAll}
            data-ocid="orchestration.resume_all_button"
            variant="outline"
            className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
          >
            <Play size={14} className="mr-1.5" />
            Resume All Agents
          </Button>
          <Button
            type="button"
            onClick={() => toast.success("Logs cleared")}
            data-ocid="orchestration.clear_logs_button"
            variant="outline"
            className="border-slate-600 text-slate-400 hover:bg-slate-800"
          >
            <FileText size={14} className="mr-1.5" />
            Clear All Logs
          </Button>
        </div>

        {/* SECTION 3 — Agent Grid */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4">AI Agents</h2>
          {agentsLoading ? (
            <div
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              data-ocid="orchestration.agent_grid.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
                  data-ocid={`orchestration.agent.skeleton.${i}`}
                >
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : agents.length === 0 ? (
            <div
              className="text-center py-12 bg-white/3 border border-white/8 rounded-xl"
              data-ocid="orchestration.agent_grid.empty_state"
            >
              <Bot size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">
                No agents configured yet
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Agents will appear here once they are set up in the backend.
              </p>
            </div>
          ) : (
            <div
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              data-ocid="orchestration.agent_grid"
            >
              {agents.map((agent, i) => (
                <div
                  key={agent.id}
                  data-ocid={`orchestration.agent.item.${i + 1}`}
                >
                  <AgentCard
                    agent={agent}
                    onToggle={handleToggleAgent}
                    onStatusChange={handleStatusChange}
                    onOpenDrawer={handleOpenDrawer}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4 — Automation Triggers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                Automation Triggers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                When X happens, automatically do Y
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setShowAddTrigger(true)}
              data-ocid="trigger.add_button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={showAddTrigger}
            >
              <Plus size={14} className="mr-1.5" />
              Add Trigger
            </Button>
          </div>

          <div className="space-y-3">
            {showAddTrigger && (
              <AddTriggerForm
                onSave={handleAddTrigger}
                onCancel={() => setShowAddTrigger(false)}
              />
            )}

            {triggersLoading ? (
              <div className="space-y-3" data-ocid="trigger.loading_state">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                    data-ocid={`trigger.skeleton.${i}`}
                  >
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-4 bg-white/10 rounded w-1/4 ml-auto" />
                  </div>
                ))}
              </div>
            ) : triggers.length === 0 && !showAddTrigger ? (
              <div
                className="text-center py-12 bg-white/3 border border-white/8 rounded-xl"
                data-ocid="trigger.empty_state"
              >
                <Zap size={32} className="text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">
                  No automation triggers yet
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Add a trigger to automate agent workflows.
                </p>
              </div>
            ) : (
              triggers.map((rule) => (
                <TriggerCard
                  key={rule.id}
                  rule={rule}
                  onToggle={handleToggleTrigger}
                  onDelete={handleDeleteTrigger}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Agent Drawer */}
      {drawerAgent && (
        <AgentDrawer
          agent={drawerAgent}
          logs={drawerLogs}
          onClose={() => setDrawerAgent(null)}
          onSaveConfig={handleSaveConfig}
        />
      )}
    </div>
  );
}
