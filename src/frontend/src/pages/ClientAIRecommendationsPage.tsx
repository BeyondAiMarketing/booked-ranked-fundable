import {
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useRagBrain } from "../hooks/useRagBrain";
import type { AgentNodeRun } from "../types/ragBrain";

type RecCategory =
  | "Lead Follow-up"
  | "Review Response"
  | "Funding Action"
  | "Social Post Idea";
type RecStatus = "active" | "applied" | "dismissed";

interface Recommendation {
  id: string;
  category: RecCategory;
  text: string;
  actionLabel: string;
  status: RecStatus;
}

const CAT_STYLES: Record<
  RecCategory,
  { color: string; bg: string; border: string; dot: string }
> = {
  "Lead Follow-up": {
    color: "text-[oklch(0.72_0.18_290)]",
    bg: "bg-[oklch(0.58_0.22_290/0.12)]",
    border: "border-[oklch(0.58_0.22_290/0.3)]",
    dot: "bg-[oklch(0.58_0.22_290)]",
  },
  "Review Response": {
    color: "text-[oklch(0.72_0.18_155)]",
    bg: "bg-[oklch(0.62_0.18_155/0.12)]",
    border: "border-[oklch(0.62_0.18_155/0.3)]",
    dot: "bg-[oklch(0.62_0.18_155)]",
  },
  "Funding Action": {
    color: "text-[oklch(0.82_0.16_75)]",
    bg: "bg-[oklch(0.72_0.18_75/0.12)]",
    border: "border-[oklch(0.72_0.18_75/0.3)]",
    dot: "bg-[oklch(0.72_0.18_75)]",
  },
  "Social Post Idea": {
    color: "text-[oklch(0.72_0.2_200)]",
    bg: "bg-[oklch(0.62_0.2_200/0.12)]",
    border: "border-[oklch(0.62_0.2_200/0.3)]",
    dot: "bg-[oklch(0.62_0.2_200)]",
  },
};

const INITIAL_RECS: Recommendation[] = [
  {
    id: "r1",
    category: "Lead Follow-up",
    text: "You have 3 leads that haven't been contacted in 5+ days. Send a personalized follow-up now — businesses that follow up within 5 days close 2x more deals.",
    actionLabel: "View Leads",
    status: "active",
  },
  {
    id: "r2",
    category: "Review Response",
    text: "A 3-star review posted yesterday mentions slow response time. Respond with empathy and a resolution offer within 24 hours to protect your rating.",
    actionLabel: "Respond Now",
    status: "active",
  },
  {
    id: "r3",
    category: "Funding Action",
    text: "You're 2 Net-30 trade lines away from Tier 2 business credit. Apply to Uline and Grainger this week while your accounts are in good standing.",
    actionLabel: "Start Action",
    status: "active",
  },
  {
    id: "r4",
    category: "Social Post Idea",
    text: "Post a before-and-after job photo this week — visual proof generates 3x more organic reach than text-only posts for service businesses.",
    actionLabel: "Create Post",
    status: "active",
  },
];

export default function ClientAIRecommendationsPage() {
  const { runAgentNode, isLoading } = useRagBrain();
  const [recs, setRecs] = useState<Recommendation[]>(INITIAL_RECS);

  const handleApply = useCallback((id: string) => {
    setRecs((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "applied" as RecStatus } : r,
      ),
    );
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setRecs((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "dismissed" as RecStatus } : r,
      ),
    );
  }, []);

  const handleRefresh = useCallback(async () => {
    const nodes = [
      "ObjectionHandler",
      "SocialPostCreator",
      "ProposalGenerator",
    ] as const;
    const results = await Promise.all(
      nodes.map((n) => runAgentNode(n, JSON.stringify({ context: "client" }))),
    );
    const cats: RecCategory[] = [
      "Lead Follow-up",
      "Funding Action",
      "Social Post Idea",
    ];
    const newRecs: Recommendation[] = results
      .map((res, i) => {
        const run = res as AgentNodeRun | null;
        if (!run?.outputData) return null;
        return {
          id: `fresh-${Date.now()}-${i}`,
          category: cats[i] ?? "Lead Follow-up",
          text: run.outputData,
          actionLabel: "Take Action",
          status: "active" as RecStatus,
        };
      })
      .filter((r): r is Recommendation => r !== null);
    if (newRecs.length > 0) setRecs(newRecs);
  }, [runAgentNode]);

  const activeRecs = recs.filter((r) => r.status === "active");
  const doneRecs = recs.filter((r) => r.status !== "active");

  return (
    <div
      data-ocid="ai-recommendations.page"
      className="min-h-screen bg-background"
    >
      <div className="bg-card border-b border-border px-4 py-5 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[oklch(0.72_0.2_200)]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                AI Recommendations
              </h1>
              <p className="text-xs text-muted-foreground">
                {activeRecs.length} active suggestion
                {activeRecs.length !== 1 ? "s" : ""} for today
              </p>
            </div>
          </div>
          <Button
            data-ocid="ai-recommendations.refresh_button"
            type="button"
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={handleRefresh}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Generating…" : "Fresh Recommendations"}
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {activeRecs.length === 0 && (
            <div
              data-ocid="ai-recommendations.empty_state"
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-[oklch(0.62_0.18_155/0.12)] border border-[oklch(0.62_0.18_155/0.25)] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[oklch(0.72_0.18_155)]" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                All caught up!
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                No active recommendations. Generate fresh ones to get your next
                set of actions.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Generate Recommendations
              </Button>
            </div>
          )}

          {activeRecs.map((rec, idx) => {
            const cfg = CAT_STYLES[rec.category];
            return (
              <Card
                key={rec.id}
                data-ocid={`ai-recommendations.item.${idx + 1}`}
                className="bg-card border-border hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                        >
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {rec.text}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          data-ocid={`ai-recommendations.apply_button.${idx + 1}`}
                          type="button"
                          size="sm"
                          className="text-xs bg-primary hover:bg-primary/90 h-7 px-3"
                          onClick={() => handleApply(rec.id)}
                        >
                          <ChevronRight className="w-3 h-3 mr-1" />
                          {rec.actionLabel}
                        </Button>
                        <Button
                          data-ocid={`ai-recommendations.dismiss_button.${idx + 1}`}
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-xs text-muted-foreground h-7 px-3 hover:text-destructive"
                          onClick={() => handleDismiss(rec.id)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {doneRecs.length > 0 && (
            <div className="pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Completed
              </p>
              <div className="space-y-2">
                {doneRecs.map((rec, idx) => (
                  <div
                    key={rec.id}
                    data-ocid={`ai-recommendations.done_item.${idx + 1}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border opacity-60"
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${rec.status === "applied" ? "bg-[oklch(0.62_0.18_155)]" : "bg-muted-foreground"}`}
                    />
                    <span className="text-sm text-muted-foreground flex-1 min-w-0 truncate">
                      {rec.text}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        rec.status === "applied"
                          ? "bg-[oklch(0.62_0.18_155/0.12)] text-[oklch(0.72_0.18_155)] border-[oklch(0.62_0.18_155/0.3)]"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {rec.status === "applied" ? "Applied" : "Dismissed"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
