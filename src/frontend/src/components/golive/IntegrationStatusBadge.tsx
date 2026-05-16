/**
 * IntegrationStatusBadge — live health indicator for each integration card.
 *
 * States:
 *   connected      → green dot + "Connected" + relative time
 *   testing        → yellow spinner + "Testing..."
 *   error          → red dot + "Error — tap to retry" (clickable)
 *   not-configured → gray dot + "Not Set Up"
 *   optional       → gray dot + "Optional"
 */

import { CheckCircle2, Loader2, RefreshCw, Sparkles } from "lucide-react";
import type { IntegrationHealthRecord } from "../../hooks/useIntegrationHealth";

interface IntegrationStatusBadgeProps {
  record: IntegrationHealthRecord;
  onRetry?: () => void;
}

function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);

  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function IntegrationStatusBadge({
  record,
  onRetry,
}: IntegrationStatusBadgeProps) {
  const { status, lastTested, errorMessage } = record;

  if (status === "testing") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30"
        data-ocid="integration.status.testing"
      >
        <Loader2 size={10} className="animate-spin" />
        Testing…
      </span>
    );
  }

  if (status === "connected") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        title={
          lastTested
            ? `Last tested: ${formatRelative(lastTested)}`
            : "Connected"
        }
        data-ocid="integration.status.connected"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        Connected
        {lastTested && (
          <span className="text-emerald-400/60 text-[10px] ml-0.5 hidden sm:inline">
            · {formatRelative(lastTested)}
          </span>
        )}
        <CheckCircle2 size={9} className="ml-0.5 opacity-70" />
      </span>
    );
  }

  if (status === "error") {
    return (
      <button
        type="button"
        onClick={onRetry}
        title={errorMessage ?? "Test failed — click to retry"}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-colors cursor-pointer"
        data-ocid="integration.status.error_retry_button"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
        Error — tap to retry
        <RefreshCw size={9} className="ml-0.5" />
      </button>
    );
  }

  if (status === "optional") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/25"
        data-ocid="integration.status.optional"
      >
        <Sparkles size={9} />
        Optional
      </span>
    );
  }

  // not-configured (default)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700/60 text-slate-400 border border-slate-600/40"
      data-ocid="integration.status.not_configured"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
      Not Set Up
    </span>
  );
}
