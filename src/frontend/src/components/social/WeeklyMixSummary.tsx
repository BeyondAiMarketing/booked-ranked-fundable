import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { FunnelStage, SocialPost } from "../../types/socialMedia";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface WeeklyMixSummaryProps {
  posts: SocialPost[];
  onQuickAddBofu: () => void;
}

const STAGE_CONFIG: Record<
  FunnelStage,
  {
    label: string;
    description: string;
    color: string;
    textColor: string;
    ringColor: string;
    target: number;
  }
> = {
  tofu: {
    label: "TOFU",
    description: "Awareness",
    color: "oklch(0.58 0.22 290 / 20%)",
    textColor: "text-primary",
    ringColor: "ring-primary/40",
    target: 3,
  },
  mofu: {
    label: "MOFU",
    description: "Trust",
    color: "oklch(0.62 0.18 180 / 20%)",
    textColor: "text-cyan-400",
    ringColor: "ring-cyan-400/40",
    target: 3,
  },
  bofu: {
    label: "BOFU",
    description: "Conversion",
    color: "oklch(0.62 0.18 155 / 20%)",
    textColor: "text-emerald-400",
    ringColor: "ring-emerald-400/40",
    target: 3,
  },
};

export function WeeklyMixSummary({
  posts,
  onQuickAddBofu,
}: WeeklyMixSummaryProps) {
  const counts: Record<FunnelStage, number> = {
    tofu: posts.filter((p) => p.funnelStage === "tofu").length,
    mofu: posts.filter((p) => p.funnelStage === "mofu").length,
    bofu: posts.filter((p) => p.funnelStage === "bofu").length,
  };

  const total = counts.tofu + counts.mofu + counts.bofu;
  const hasImbalance = total > 0 && (counts.bofu === 0 || counts.tofu === 0);
  const dominantStage =
    total > 0
      ? (Object.entries(counts).sort(
          ([, a], [, b]) => b - a,
        )[0][0] as FunnelStage)
      : null;
  const isHeavy =
    dominantStage !== null && total >= 4 && counts[dominantStage] / total > 0.6;

  return (
    <div className="space-y-3" data-ocid="social.calendar.weekly_mix.panel">
      {/* Stage mix cards */}
      <div className="grid grid-cols-3 gap-3">
        {(["tofu", "mofu", "bofu"] as FunnelStage[]).map((stage) => {
          const cfg = STAGE_CONFIG[stage];
          const count = counts[stage];
          const target = cfg.target;
          const pct = Math.min(100, (count / target) * 100);
          return (
            <Card
              key={stage}
              className="bg-card border-border overflow-hidden"
              data-ocid={`social.calendar.stage.${stage}.card`}
            >
              <CardContent className="pt-3 pb-3 px-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${cfg.textColor}`}
                    >
                      {cfg.label}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {cfg.description}
                    </p>
                  </div>
                  <span className={`text-2xl font-bold ${cfg.textColor}`}>
                    {count}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{target}
                    </span>
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cfg.color.replace("/ 20%", "/ 80%"),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Balance indicator */}
      {total > 0 && (
        <div
          className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
            hasImbalance || isHeavy
              ? "bg-amber-500/8 border-amber-500/25"
              : "bg-emerald-500/8 border-emerald-500/25"
          }`}
          data-ocid="social.calendar.balance.indicator"
        >
          {hasImbalance || isHeavy ? (
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          )}
          <p className="text-xs text-muted-foreground flex-1">
            {hasImbalance || isHeavy ? (
              <>
                <span className="font-semibold text-amber-400">
                  Mix imbalance detected.{" "}
                </span>
                {counts.bofu === 0
                  ? "No conversion posts this week — add a BOFU post to drive bookings."
                  : counts.tofu === 0
                    ? "No awareness posts this week — add a TOFU post to grow your audience."
                    : `This week is heavy on ${STAGE_CONFIG[dominantStage!].label} content — balance with other stages.`}
              </>
            ) : (
              <span className="text-emerald-400 font-semibold">
                Great mix! TOFU, MOFU &amp; BOFU are all covered this week.
              </span>
            )}
          </p>
          {hasImbalance && counts.bofu === 0 && (
            <Button
              size="sm"
              data-ocid="social.calendar.quick_add_bofu.button"
              onClick={onQuickAddBofu}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-7 px-3"
            >
              <Sparkles size={11} className="mr-1" /> Add BOFU Post
            </Button>
          )}
        </div>
      )}

      {/* Zero-posts state */}
      {total === 0 && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 border border-amber-500/25 bg-amber-500/8"
          data-ocid="social.calendar.empty_mix.empty_state"
        >
          <TrendingUp size={16} className="text-amber-400 shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-amber-400">
              No posts scheduled this week.{" "}
            </span>
            A balanced week needs awareness (TOFU), trust (MOFU), and conversion
            (BOFU) posts.
          </p>
        </div>
      )}
    </div>
  );
}
