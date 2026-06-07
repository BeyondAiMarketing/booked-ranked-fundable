import { Badge } from "@/components/ui/badge";
import type { ProviderConfig } from "@/types/ragBrain";
import { Brain, CheckCircle2, Clock, XCircle } from "lucide-react";

interface AIProviderStatusBadgeProps {
  config: ProviderConfig;
  size?: "sm" | "md";
}

export function AIProviderStatusBadge({
  config,
  size = "md",
}: AIProviderStatusBadgeProps) {
  const status = config.lastPingStatus;

  const icon =
    status === "ok" ? (
      <CheckCircle2 className="h-3.5 w-3.5" />
    ) : status === "error" ? (
      <XCircle className="h-3.5 w-3.5" />
    ) : (
      <Clock className="h-3.5 w-3.5" />
    );

  const colorClass =
    status === "ok"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : status === "error"
        ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
        : "border-amber-500/30 bg-amber-500/10 text-amber-400";

  const label =
    status === "ok" ? "Active" : status === "error" ? "Error" : "Untested";

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 font-mono ${
        size === "sm" ? "text-xs" : "text-sm"
      } ${colorClass}`}
    >
      {!config.isActive && (
        <Brain className="h-3 w-3 text-muted-foreground opacity-50" />
      )}
      {config.isActive && icon}
      {label}
    </Badge>
  );
}
