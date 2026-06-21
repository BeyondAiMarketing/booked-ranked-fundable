import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface ScorecardDisplayProps {
  score: number;
  label: string;
  description?: string;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score < 50) return "bg-red-500";
  if (score <= 75) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getScoreTextColor(score: number): string {
  if (score < 50) return "text-red-400";
  if (score <= 75) return "text-yellow-400";
  return "text-emerald-400";
}

function getTrendIcon(score: number) {
  if (score >= 80) return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (score >= 50) return <Minus className="h-4 w-4 text-yellow-400" />;
  return <TrendingDown className="h-4 w-4 text-red-400" />;
}

export function ScorecardDisplay({
  score,
  label,
  description,
  className,
}: ScorecardDisplayProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const barColor = getScoreColor(clampedScore);
  const textColor = getScoreTextColor(clampedScore);

  return (
    <Card
      className={cn(
        "bg-card border-border overflow-hidden transition-smooth hover:border-primary/30",
        className,
      )}
      data-ocid="scorecard.card"
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            {getTrendIcon(clampedScore)}
            <span className={cn("text-2xl font-bold font-display", textColor)}>
              {clampedScore}
            </span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              barColor,
            )}
            style={{ width: `${clampedScore}%` }}
            data-ocid="scorecard.bar"
          />
        </div>

        {description && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
