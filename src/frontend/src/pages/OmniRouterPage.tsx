import {
  Activity,
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { useOmniRouter } from "../hooks/useOmniRouter";

// ── Helpers ──────────────────────────────────────────────────────────────────

function intentLabel(cls: string): string {
  const map: Record<string, string> = {
    lead_management: "Lead Management",
    email_outreach: "Email Outreach",
    content_creation: "Content Creation",
    review_management: "Review Management",
    seo_optimization: "SEO Optimization",
    analytics: "Analytics",
    funding_readiness: "Funding Readiness",
    voice_outreach: "Voice Outreach",
    general_assistant: "General Assistant",
  };
  return map[cls] ?? cls;
}

function intentColor(cls: string): string {
  const map: Record<string, string> = {
    lead_management: "bg-blue-100 text-blue-800",
    email_outreach: "bg-purple-100 text-purple-800",
    content_creation: "bg-pink-100 text-pink-800",
    review_management: "bg-amber-100 text-amber-800",
    seo_optimization: "bg-green-100 text-green-800",
    analytics: "bg-sky-100 text-sky-800",
    funding_readiness: "bg-emerald-100 text-emerald-800",
    voice_outreach: "bg-orange-100 text-orange-800",
    general_assistant: "bg-gray-100 text-gray-800",
  };
  return map[cls] ?? "bg-gray-100 text-gray-800";
}

function targetLabel(target: string): string {
  return target === "llm_direct" ? "Direct LLM" : "Orchestrator";
}

function targetColor(target: string): string {
  return target === "llm_direct"
    ? "bg-teal-100 text-teal-800"
    : "bg-violet-100 text-violet-800";
}

function msFromNs(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return ms < 1000 ? `${ms.toFixed(0)}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function timeAgo(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const CONTEXT_HINTS = [
  { value: "", label: "Auto-detect" },
  { value: "lead", label: "Lead Management" },
  { value: "email", label: "Email Outreach" },
  { value: "content", label: "Content Creation" },
  { value: "review", label: "Review Management" },
  { value: "seo", label: "SEO / Ranking" },
  { value: "analytics", label: "Analytics / Reports" },
  { value: "funding", label: "Funding Readiness" },
  { value: "voice", label: "Voice Outreach" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function OmniRouterPage() {
  const { currentTenantId } = useApp();
  const {
    result,
    isSubmitting,
    metrics,
    history,
    metricsLoading,
    historyLoading,
    error,
    submitGoal,
    fetchMetrics,
    fetchHistory,
    resetMetrics,
  } = useOmniRouter();

  const [goal, setGoal] = useState("");
  const [contextHint, setContextHint] = useState("");

  // Load metrics and history on mount.
  useEffect(() => {
    fetchMetrics();
    fetchHistory(15);
  }, [fetchMetrics, fetchHistory]);

  const handleSubmit = async () => {
    if (!goal.trim()) {
      toast.error("Please enter a goal");
      return;
    }
    const tenantId = currentTenantId ?? "default";
    const res = await submitGoal(
      goal.trim(),
      tenantId,
      contextHint || undefined,
    );
    if (res) {
      if (res.success) {
        toast.success("OmniRouter completed");
      } else {
        toast.error(res.errorMessage ?? "OmniRouter returned no output");
      }
      // Refresh metrics + history after each call.
      fetchMetrics();
      fetchHistory(15);
    } else if (error) {
      toast.error(error);
    }
  };

  const handleReset = async () => {
    await resetMetrics();
    toast.success("Metrics reset");
  };

  const successRate =
    metrics && Number(metrics.totalRequests) > 0
      ? (
          (Number(metrics.successfulRequests) / Number(metrics.totalRequests)) *
          100
        ).toFixed(1)
      : null;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Sparkles className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OmniRouter</h1>
            <p className="text-sm text-gray-500">
              Universal AI dispatch — classify, route, and execute any BRF goal
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Metrics
        </Button>
      </div>

      {/* Goal input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-violet-500" />
            Submit a Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="goal-input">Goal</Label>
            <Textarea
              id="goal-input"
              placeholder="e.g. Write a follow-up email sequence for new leads in the real estate niche, then create a Google Business Profile post announcing a free home valuation offer."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="space-y-1.5 w-56">
              <Label>Context hint (optional)</Label>
              <Select value={contextHint} onValueChange={setContextHint}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect intent" />
                </SelectTrigger>
                <SelectContent>
                  {CONTEXT_HINTS.map((h) => (
                    <SelectItem key={h.value} value={h.value}>
                      {h.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !goal.trim()}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isSubmitting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Routing…" : "Route & Execute"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card
          className={
            result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              Result
              <span className="ml-auto text-xs text-gray-400 font-normal">
                {msFromNs(result.durationNs)} · {result.correlationId}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Routing decision */}
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge className={intentColor(result.routingDecision.intentClass)}>
                {intentLabel(result.routingDecision.intentClass)}
              </Badge>
              <Badge className={targetColor(result.routingDecision.target)}>
                {targetLabel(result.routingDecision.target)}
              </Badge>
              {result.provider && (
                <Badge variant="outline">{result.provider}</Badge>
              )}
              {result.model && (
                <Badge variant="outline" className="max-w-[200px] truncate">
                  {result.model}
                </Badge>
              )}
              <Badge variant="outline">
                {(result.routingDecision.confidence * 100).toFixed(0)}% confidence
              </Badge>
              {result.estimatedCost > 0 && (
                <Badge variant="outline">
                  ~${result.estimatedCost.toFixed(4)}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 italic">
              {result.routingDecision.reasoning}
            </p>
            {result.errorMessage ? (
              <div className="flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {result.errorMessage}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-white rounded-md p-3 border border-gray-100 max-h-80 overflow-y-auto">
                {result.output}
              </pre>
            )}
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Requests",
            value: metrics ? Number(metrics.totalRequests).toLocaleString() : "—",
            icon: <Activity className="h-4 w-4 text-gray-500" />,
          },
          {
            label: "Success Rate",
            value: successRate ? `${successRate}%` : "—",
            icon: <TrendingUp className="h-4 w-4 text-green-500" />,
          },
          {
            label: "Avg Latency",
            value: metrics
              ? msFromNs(metrics.avgDurationNs)
              : "—",
            icon: <Clock className="h-4 w-4 text-blue-500" />,
          },
          {
            label: "Failed",
            value: metrics ? Number(metrics.failedRequests).toLocaleString() : "—",
            icon: <XCircle className="h-4 w-4 text-red-500" />,
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{stat.label}</span>
                {stat.icon}
              </div>
              <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Intent & Provider breakdown */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-500" />
                Intent Breakdown
                {metricsLoading && (
                  <RefreshCw className="h-3 w-3 ml-auto animate-spin text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.intentBreakdown.length === 0 ? (
                <p className="text-xs text-gray-400">No data yet</p>
              ) : (
                <ul className="space-y-2">
                  {metrics.intentBreakdown
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .map(([cls, cnt]) => (
                      <li key={cls} className="flex items-center gap-2 text-sm">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${intentColor(cls)}`}
                        >
                          {intentLabel(cls)}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-violet-400 h-1.5 rounded-full"
                            style={{
                              width: `${
                                (Number(cnt) /
                                  Math.max(
                                    1,
                                    Number(metrics.totalRequests),
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-6 text-right">
                          {Number(cnt)}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                Provider Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics.providerBreakdown.length === 0 ? (
                <p className="text-xs text-gray-400">No data yet</p>
              ) : (
                <ul className="space-y-2">
                  {metrics.providerBreakdown
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .map(([prov, cnt]) => (
                      <li key={prov} className="flex items-center gap-2 text-sm">
                        <span className="w-24 text-xs font-medium text-gray-700 truncate">
                          {prov}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-blue-400 h-1.5 rounded-full"
                            style={{
                              width: `${
                                (Number(cnt) /
                                  Math.max(
                                    1,
                                    Number(metrics.totalRequests),
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-6 text-right">
                          {Number(cnt)}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Routing history */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Routing History
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 px-2"
              onClick={() => fetchHistory(15)}
              disabled={historyLoading}
            >
              <RefreshCw
                className={`h-3 w-3 ${historyLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">No routing history yet</p>
          ) : (
            <div className="space-y-2">
              {[...history].reverse().map((entry) => (
                <div
                  key={entry.correlationId}
                  className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="mt-0.5">
                    {entry.success ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 truncate">
                      {entry.goalSummary}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge
                        className={`text-[10px] py-0 px-1 ${intentColor(entry.intentClass)}`}
                      >
                        {intentLabel(entry.intentClass)}
                      </Badge>
                      <Badge
                        className={`text-[10px] py-0 px-1 ${targetColor(entry.target)}`}
                      >
                        {targetLabel(entry.target)}
                      </Badge>
                      {entry.provider && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1"
                        >
                          {entry.provider}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-gray-400">
                      {msFromNs(entry.durationNs)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {timeAgo(entry.timestampNs)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
