import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Archive,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  type LucideIcon,
  Mail,
  Send,
  XCircle,
} from "lucide-react";

export type ApprovalStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "scheduled"
  | "sent_to_n8n"
  | "published"
  | "sent"
  | "failed"
  | "archived";

interface ApprovalBadgeProps {
  status: ApprovalStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  ApprovalStatus,
  { label: string; icon: LucideIcon; color: string }
> = {
  draft: {
    label: "Draft",
    icon: FileText,
    color: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  pending_approval: {
    label: "Pending",
    icon: Clock,
    color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  scheduled: {
    label: "Scheduled",
    icon: Calendar,
    color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  sent_to_n8n: {
    label: "Sending",
    icon: Send,
    color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  published: {
    label: "Published",
    icon: Globe,
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  sent: {
    label: "Sent",
    icon: Mail,
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    icon: AlertTriangle,
    color: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    color: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
};

export function ApprovalBadge({
  status,
  className,
  showIcon = true,
}: ApprovalBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium text-xs px-2.5 py-0.5 gap-1.5 transition-smooth",
        config.color,
        className,
      )}
      data-ocid={`approval.badge.${status}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {config.label}
    </Badge>
  );
}
