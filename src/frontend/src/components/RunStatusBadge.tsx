import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  OctagonX,
  PauseCircle,
  XCircle,
} from "lucide-react";
import type { AgentRun } from "../types/agentWorkflow";
import { Badge } from "./ui/badge";

interface Props {
  status: AgentRun["status"];
  size?: "sm" | "md" | "lg";
}

const CONFIG: Record<
  AgentRun["status"],
  { label: string; className: string; Icon: React.ElementType; pulse?: boolean }
> = {
  queued: {
    label: "Queued",
    className: "bg-slate-700 text-slate-300 border-slate-600",
    Icon: Clock,
  },
  running: {
    label: "Running",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    Icon: Loader2,
    pulse: true,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    Icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/20 text-red-300 border-red-500/40",
    Icon: XCircle,
  },
  paused_for_approval: {
    label: "Needs Approval",
    className: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    Icon: PauseCircle,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-600/20 text-slate-400 border-slate-600/40",
    Icon: OctagonX,
  },
};

const SIZE_MAP = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
  lg: "text-sm px-2.5 py-1",
};
const ICON_SIZE = { sm: 10, md: 12, lg: 14 };

export default function RunStatusBadge({ status, size = "md" }: Props) {
  const cfg = CONFIG[status];
  const { Icon } = cfg;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${cfg.className} ${SIZE_MAP[size]}`}
    >
      <Icon
        size={ICON_SIZE[size]}
        className={cfg.pulse ? "animate-spin" : ""}
      />
      {cfg.label}
    </span>
  );
}
