import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  /** Data attribute for test targeting */
  "data-ocid"?: string;
}

/**
 * Reusable empty-state placeholder for pages and panels that have no data yet.
 * Renders a centered icon, title, optional description, and up to two CTAs.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
  "data-ocid": ocid,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
      data-ocid={ocid}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10">
        <Icon className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
      </div>

      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              size="sm"
              className="bg-violet-600 hover:bg-violet-500 text-white"
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              size="sm"
              variant="outline"
              className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
