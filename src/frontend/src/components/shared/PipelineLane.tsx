import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";
import type { ReactNode } from "react";

interface PipelineLaneProps {
  title: string;
  count: number;
  children?: ReactNode;
  onAdd?: () => void;
  className?: string;
  color?: "default" | "blue" | "amber" | "emerald" | "purple";
}

const colorMap = {
  default: "border-border bg-card",
  blue: "border-blue-500/30 bg-blue-950/20",
  amber: "border-amber-500/30 bg-amber-950/20",
  emerald: "border-emerald-500/30 bg-emerald-950/20",
  purple: "border-purple-500/30 bg-purple-950/20",
};

const badgeColorMap = {
  default: "bg-muted text-muted-foreground",
  blue: "bg-blue-500/20 text-blue-300",
  amber: "bg-amber-500/20 text-amber-300",
  emerald: "bg-emerald-500/20 text-emerald-300",
  purple: "bg-purple-500/20 text-purple-300",
};

export function PipelineLane({
  title,
  count,
  children,
  onAdd,
  className,
  color = "default",
}: PipelineLaneProps) {
  return (
    <Card
      className={cn(
        "min-w-[280px] max-w-[320px] flex-shrink-0 border-2 transition-smooth",
        colorMap[color],
        className,
      )}
      data-ocid="pipeline.lane"
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <Badge
            variant="secondary"
            className={cn("text-xs font-medium", badgeColorMap[color])}
            data-ocid="pipeline.count"
          >
            {count}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {onAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-primary/10"
              onClick={onAdd}
              data-ocid="pipeline.add_button"
            >
              <Plus className="h-4 w-4 text-primary" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-primary/10"
            data-ocid="pipeline.more_button"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3 min-h-[120px]">
        {children}
      </CardContent>
    </Card>
  );
}
