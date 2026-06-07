import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkflowDef, WorkflowExecutionStatus } from "@/types/n8nWorkflow";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Play,
  Share2,
  Tag,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// ── Scope badge styling ───────────────────────────────────────────────────────

const SCOPE_STYLES: Record<WorkflowDef["scope"], { bg: string; text: string }> =
  {
    AdminOnly: { bg: "bg-rose-500/20", text: "text-rose-300" },
    AllClients: { bg: "bg-emerald-500/20", text: "text-emerald-300" },
    BasicTier: { bg: "bg-sky-500/20", text: "text-sky-300" },
    ProTier: { bg: "bg-violet-500/20", text: "text-violet-300" },
    AgencyTier: { bg: "bg-amber-500/20", text: "text-amber-300" },
  };

// ── Execution status icon ─────────────────────────────────────────────────────

function ExecStatusIcon({
  status,
}: { status: WorkflowExecutionStatus | undefined }) {
  if (!status) return null;
  if (status === "Success")
    return (
      <CheckCircle2
        className="w-4 h-4 text-emerald-400"
        aria-label="Last run: success"
      />
    );
  if (status === "Failed" || status === "Timeout")
    return (
      <XCircle
        className="w-4 h-4 text-rose-400"
        aria-label="Last run: failed"
      />
    );
  return (
    <Loader2
      className="w-4 h-4 text-amber-400 animate-spin"
      aria-label="Running"
    />
  );
}

function formatDate(ts: bigint): string {
  const d = new Date(Number(ts) / 1_000_000);
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

// ── WorkflowCard ──────────────────────────────────────────────────────────────

interface WorkflowCardProps {
  workflow: WorkflowDef;
  lastExecutionStatus?: WorkflowExecutionStatus;
  onTrigger?: (id: string) => void;
  onPush?: (id: string) => void;
  isTriggerLoading?: boolean;
  isPushLoading?: boolean;
  className?: string;
}

export function WorkflowCard({
  workflow,
  lastExecutionStatus,
  onTrigger,
  onPush,
  isTriggerLoading = false,
  isPushLoading = false,
  className = "",
}: WorkflowCardProps) {
  // Reserved for expand/collapse detail panel in a future enhancement
  const [_expanded] = useState(false);
  void _expanded;
  const scopeStyle = SCOPE_STYLES[workflow.scope];

  return (
    <div
      className={`group relative flex flex-col gap-3 p-4 rounded-2xl
        bg-white/5 border border-white/10 backdrop-blur-sm
        hover:bg-white/8 hover:border-white/20 transition-all duration-200 ${className}`}
      data-ocid={`workflow_card.${workflow.id}`}
    >
      {/* Top row: name + scope + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ExecStatusIcon status={lastExecutionStatus} />
          <h3 className="text-sm font-semibold text-foreground truncate">
            {workflow.name}
          </h3>
          {!workflow.isActive && (
            <Badge
              variant="outline"
              className="text-[10px] border-white/20 text-foreground/40 shrink-0"
            >
              Inactive
            </Badge>
          )}
        </div>
        <span
          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold
            ${scopeStyle.bg} ${scopeStyle.text}`}
        >
          {workflow.scope}
        </span>
      </div>

      {/* Description */}
      {workflow.description && (
        <p className="text-xs text-foreground/60 line-clamp-2">
          {workflow.description}
        </p>
      )}

      {/* Tags */}
      {workflow.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {workflow.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md
                bg-white/5 border border-white/10 text-[10px] text-foreground/50"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 text-[11px] text-foreground/40">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(workflow.createdAt)}
        </span>
        {workflow.pushedToAccounts > 0 && (
          <span className="flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            {workflow.pushedToAccounts} account
            {workflow.pushedToAccounts !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {onTrigger && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="flex-1 h-8 text-xs gap-1.5 bg-[oklch(var(--ai-cyan)/0.1)]
              border border-[oklch(var(--ai-cyan)/0.3)] text-[oklch(var(--ai-cyan))]
              hover:bg-[oklch(var(--ai-cyan)/0.2)] disabled:opacity-40"
            onClick={() => onTrigger(workflow.id)}
            disabled={isTriggerLoading || !workflow.isActive}
            data-ocid={`workflow_card.${workflow.id}.trigger_button`}
          >
            {isTriggerLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            Run
          </Button>
        )}
        {onPush && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="flex-1 h-8 text-xs gap-1.5
              bg-[oklch(var(--ai-indigo-deep)/0.15)]
              border border-[oklch(var(--ai-indigo-deep)/0.4)] text-violet-300
              hover:bg-[oklch(var(--ai-indigo-deep)/0.25)] disabled:opacity-40"
            onClick={() => onPush(workflow.id)}
            disabled={isPushLoading}
            data-ocid={`workflow_card.${workflow.id}.push_button`}
          >
            {isPushLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Share2 className="w-3 h-3" />
            )}
            Push
          </Button>
        )}
      </div>
    </div>
  );
}
