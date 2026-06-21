import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Circle, Clock } from "lucide-react";

export type WorkflowStatus = "pending" | "running" | "completed" | "failed";

export interface WorkflowAction {
  id: string;
  agentName: string;
  action: string;
  status: WorkflowStatus;
  timestamp: string;
  description?: string;
}

interface WorkflowTimelineProps {
  actions: WorkflowAction[];
  className?: string;
}

const statusConfig: Record<
  WorkflowStatus,
  { icon: React.ReactNode; lineColor: string }
> = {
  pending: {
    icon: <Circle className="h-4 w-4 text-muted-foreground" />,
    lineColor: "bg-muted",
  },
  running: {
    icon: <Clock className="h-4 w-4 text-amber-400 animate-pulse" />,
    lineColor: "bg-amber-500/50",
  },
  completed: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    lineColor: "bg-emerald-500/50",
  },
  failed: {
    icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
    lineColor: "bg-red-500/50",
  },
};

export function WorkflowTimeline({
  actions,
  className,
}: WorkflowTimelineProps) {
  if (actions.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-8 text-muted-foreground text-sm",
          className,
        )}
        data-ocid="workflow.empty_state"
      >
        No workflow actions recorded yet.
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)} data-ocid="workflow.timeline">
      {actions.map((action, index) => {
        const config = statusConfig[action.status];
        const isLast = index === actions.length - 1;

        return (
          <div key={action.id} className="flex gap-4 relative">
            {/* Timeline line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[9px] top-6 w-0.5 h-[calc(100%-16px)]",
                  config.lineColor,
                )}
              />
            )}

            {/* Status icon */}
            <div className="relative z-10 flex-shrink-0 mt-1">
              {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {action.agentName}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {action.timestamp}
                </span>
              </div>
              <p className="text-sm text-foreground/90 font-medium">
                {action.action}
              </p>
              {action.description && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {action.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
