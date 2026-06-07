import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { WorkflowDef } from "@/types/n8nWorkflow";
import { Network, Send, Trash2 } from "lucide-react";

interface WorkflowCardProps {
  workflow: WorkflowDef;
  onPush: (id: string) => void;
  onDelete: (id: string) => void;
  isPushing?: boolean;
}

const SCOPE_COLORS: Record<string, string> = {
  AdminOnly: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  AllClients: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  BasicTier: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  ProTier: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  AgencyTier: "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

export function WorkflowCard({
  workflow,
  onPush,
  onDelete,
  isPushing = false,
}: WorkflowCardProps) {
  const scopeColor =
    SCOPE_COLORS[workflow.scope] ||
    "border-border bg-muted/30 text-muted-foreground";

  return (
    <Card className="group relative overflow-hidden border border-border/60 bg-card/80 p-5 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_20px_oklch(0.62_0.2_200_/_15%)]">
      {/* Neural accent top bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[oklch(0.62_0.2_200)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Network className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {workflow.name}
            </h3>
            <span
              className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${scopeColor}`}
            >
              {workflow.scope}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(workflow.id)}
          className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
          aria-label="Delete workflow"
          data-ocid="workflow.delete_button"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
        {workflow.description}
      </p>

      {workflow.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {workflow.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Pushed to {workflow.pushedToAccounts} accounts
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPush(workflow.id)}
          disabled={isPushing}
          className="h-7 gap-1.5 border-primary/30 bg-primary/5 px-3 text-xs hover:bg-primary/20"
          data-ocid="workflow.push_button"
        >
          <Send className="h-3 w-3" />
          {isPushing ? "Pushing..." : "Push"}
        </Button>
      </div>
    </Card>
  );
}
