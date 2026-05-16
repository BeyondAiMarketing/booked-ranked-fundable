import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BarChart2,
  CheckCircle,
  Circle,
  Clock,
  DollarSign,
  FileText,
  Megaphone,
  MousePointer,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ThreadHistoryPanel from "../components/ThreadHistoryPanel";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import {
  AGENT_PRODUCTS,
  DEMO_AGENT_DELIVERABLES,
  DEMO_AGENT_REQUESTS,
  DEMO_AGENT_TASKS,
} from "../data/agentData";
import {
  DEMO_ADS_OPPORTUNITIES,
  DEMO_AD_COPY_VARIANTS,
  DEMO_AUDIENCE_SEGMENTS,
  DEMO_PAID_ADS_ALERTS,
  DEMO_PAID_ADS_CAMPAIGNS,
  DEMO_PAID_ADS_PERFORMANCE_HISTORY,
  DEMO_PAID_ADS_SCORECARD,
} from "../data/paidAdsData";

// ---- Score helpers ----
function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-rose-500";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 60) return "bg-amber-500/10 border-amber-500/20";
  return "bg-rose-500/10 border-rose-500/20";
}

// ---- Badge components ----
function SeverityBadge({ severity }: { severity: string }) {
  const variants: Record<string, string> = {
    critical: "bg-red-500/15 text-red-400 border-red-500/20",
    high: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    low: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };
  const labels: Record<string, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
        variants[severity] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {labels[severity] ?? severity}
    </span>
  );
}

function AlertStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    open: "bg-red-500/15 text-red-400 border-red-500/20",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    resolved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const labels: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function AlertCategoryBadge({ category }: { category: string }) {
  const variants: Record<string, string> = {
    budget: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    performance: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    audience: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    copy: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    "landing-page": "bg-rose-500/15 text-rose-400 border-rose-500/20",
    bidding: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  };
  const labels: Record<string, string> = {
    budget: "Budget",
    performance: "Performance",
    audience: "Audience",
    copy: "Ad Copy",
    "landing-page": "Landing Page",
    bidding: "Bidding",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        variants[category] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {labels[category] ?? category}
    </span>
  );
}

function TaskStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    waiting: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    waiting: "Waiting",
    complete: "Complete",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function CampaignStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    paused: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    draft: "bg-slate-500/15 text-slate-400 border-slate-600",
    ended: "bg-slate-600/15 text-slate-500 border-slate-700",
    winner: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  };
  const labels: Record<string, string> = {
    active: "Active",
    paused: "Paused",
    draft: "Draft",
    ended: "Ended",
    winner: "Winner",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        styles[status] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function ImpactBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    high: "bg-red-500/15 text-red-400 border-red-500/20",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    low: "bg-slate-500/15 text-slate-400 border-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        styles[level] ?? "bg-slate-700 text-slate-300 border-slate-600"
      }`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)} Impact
    </span>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  const colors: Record<string, string> = {
    google: "text-blue-400",
    facebook: "text-indigo-400",
    instagram: "text-pink-400",
    bing: "text-cyan-400",
  };
  return (
    <span
      className={`text-xs font-bold uppercase ${
        colors[channel] ?? "text-slate-400"
      }`}
    >
      {channel}
    </span>
  );
}

function ScoreBar({
  score,
  label,
  note,
}: { score: number; label: string; note: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-slate-300 text-sm">{label}</span>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getScoreBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-slate-500 text-xs">{note}</p>
    </div>
  );
}

// ---- Main Page ----
export default function PaidAdsAgentPage() {
  const { currentTenantId, agentSubscriptions, submitAgentRequest } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [alertSeverityFilter, setAlertSeverityFilter] = useState("all");
  const [alertCategoryFilter, setAlertCategoryFilter] = useState("all");
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    dueDatePreference: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Resolve tenant
  const resolvedTenantId = DEMO_PAID_ADS_SCORECARD.find(
    (s) => s.tenantId === currentTenantId,
  )
    ? currentTenantId
    : "tenant-plumbing";

  const scorecard = DEMO_PAID_ADS_SCORECARD.find(
    (s) => s.tenantId === resolvedTenantId,
  );
  const alerts = DEMO_PAID_ADS_ALERTS.filter(
    (a) => a.tenantId === resolvedTenantId,
  );
  const performanceHistory = DEMO_PAID_ADS_PERFORMANCE_HISTORY.filter(
    (p) => p.tenantId === resolvedTenantId,
  ).sort((a, b) => b.month.localeCompare(a.month));

  const myTasks = DEMO_AGENT_TASKS.filter(
    (t) =>
      t.tenantId === resolvedTenantId &&
      (t.productId === "agent-ads" || t.productId === "agent-bundle"),
  );
  const deliverables = DEMO_AGENT_DELIVERABLES.filter(
    (d) =>
      d.tenantId === resolvedTenantId &&
      (d.productId === "agent-ads" || d.productId === "agent-bundle"),
  );
  const myRequests = DEMO_AGENT_REQUESTS.filter(
    (r) => r.tenantId === resolvedTenantId && r.productId === "agent-ads",
  );

  // Active subscription check
  const subscription = agentSubscriptions.find(
    (s) =>
      s.tenantId === currentTenantId &&
      (s.productId === "agent-ads" || s.productId === "agent-bundle") &&
      s.status === "active",
  );
  const isActive = !!subscription;

  const _product = AGENT_PRODUCTS.find((p) => p.id === "agent-ads");

  // Derived data
  const activeTasks = myTasks.filter(
    (t) => t.status === "in_progress" || t.status === "pending",
  );
  const thisMonthDeliverables = deliverables.filter(
    (d) => d.month === "2026-04",
  );
  const openAlerts = alerts.filter(
    (a) => a.status === "open" || a.status === "in_progress",
  );

  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const top3Alerts = [...openAlerts]
    .sort(
      (a, b) =>
        (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9),
    )
    .slice(0, 3);

  const filteredAlerts = alerts.filter((a) => {
    const sev =
      alertSeverityFilter === "all" || a.severity === alertSeverityFilter;
    const cat =
      alertCategoryFilter === "all" || a.category === alertCategoryFilter;
    return sev && cat;
  });

  function handleSubmitRequest() {
    if (!requestForm.title.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      submitAgentRequest({
        tenantId: currentTenantId,
        productId: "agent-ads",
        title: requestForm.title,
        description: requestForm.description,
        priority: requestForm.priority,
        dueDatePreference: requestForm.dueDatePreference,
      });
      setRequestForm({
        title: "",
        description: "",
        priority: "medium",
        dueDatePreference: "",
      });
      setSubmitting(false);
      toast.success("Request submitted to your Paid Ads Agent");
    }, 600);
  }

  const tabItems = [
    { value: "dashboard", label: "Dashboard" },
    { value: "scorecard", label: "Scorecard" },
    { value: "campaigns", label: "Campaigns" },
    { value: "ad-copy", label: "Ad Copy" },
    { value: "audiences", label: "Audiences" },
    { value: "opportunities", label: "Opportunities" },
    {
      value: "alerts",
      label: `Alerts (${openAlerts.length})`,
    },
    { value: "performance", label: "Performance" },
    { value: "requests", label: "Requests" },
    { value: "deliverables", label: "Deliverables" },
  ];

  if (!isActive) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
            <Megaphone size={28} className="text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Paid Ads Agent</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Launch and improve ads without the usual guesswork. Get managed
            campaign strategy, ad copy generation, audience targeting, and
            optimization — all handled for you.
          </p>
          <div className="space-y-3 text-left bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
            {[
              "Campaign strategy & ad copy generation",
              "Audience targeting and refinement",
              "Budget optimization and ROAS tracking",
              "Landing page alignment recommendations",
              "Monthly performance reporting",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle size={14} className="text-purple-400 shrink-0" />
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Link to="/agent-services">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              data-ocid="paid-ads.view_agent_store_button"
            >
              View Agent Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-16">
      {/* Page Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Megaphone size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-white text-xl font-bold">Paid Ads Agent</h1>
                {isActive ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20"
                    data-ocid="paid-ads.status"
                  >
                    <CheckCircle size={10} /> Active
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400 text-xs font-medium border border-slate-500/20"
                    data-ocid="paid-ads.status"
                  >
                    <Circle size={10} /> Inactive
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm">
                Launch and improve ads without the usual guesswork — campaigns,
                copy, audiences, and reporting.
              </p>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
              data-ocid="paid-ads.submit_request_button"
              onClick={() => setActiveTab("requests")}
            >
              Submit Request
            </Button>
            <ThreadHistoryPanel agentType="Paid Ads Agent" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Scrollable tab bar */}
          <div className="overflow-x-auto pb-0.5">
            <TabsList className="bg-slate-800 border border-slate-700 h-auto p-1 flex gap-1 min-w-max">
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-slate-400 data-[state=active]:bg-slate-700 data-[state=active]:text-white px-3 py-1.5 text-sm whitespace-nowrap"
                  data-ocid={`paid-ads.${tab.value}.tab`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ======== DASHBOARD ======== */}
          <TabsContent value="dashboard" className="space-y-6 pt-4">
            {/* Score summary cards */}
            {scorecard && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Account Health",
                    score: scorecard.accountHealthScore,
                    prev: scorecard.previousAccountHealthScore,
                  },
                  {
                    label: "ROAS Efficiency",
                    score: scorecard.roasEfficiencyScore,
                    prev: scorecard.previousRoasEfficiencyScore,
                  },
                  {
                    label: "Audience Quality",
                    score: scorecard.audienceQualityScore,
                    prev: scorecard.previousAudienceQualityScore,
                  },
                  {
                    label: "Budget Utilization",
                    score: scorecard.budgetUtilizationScore,
                    prev: scorecard.previousBudgetUtilizationScore,
                  },
                ].map(({ label, score, prev }) => {
                  const delta = prev !== undefined ? score - prev : null;
                  return (
                    <Card
                      key={label}
                      className={`bg-slate-800 border ${getScoreBg(score)}`}
                      data-ocid="paid-ads.dashboard.card"
                    >
                      <CardContent className="pt-4 pb-4">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                          {label}
                        </p>
                        <div className="flex items-end gap-2">
                          <span
                            className={`text-3xl font-black ${getScoreColor(score)}`}
                          >
                            {score}
                          </span>
                          <span className="text-slate-500 text-sm mb-0.5">
                            /100
                          </span>
                          {delta !== null && (
                            <span
                              className={`flex items-center gap-0.5 text-xs font-medium mb-0.5 ${
                                delta >= 0
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {delta >= 0 ? (
                                <ArrowUp size={12} />
                              ) : (
                                <ArrowDown size={12} />
                              )}
                              {Math.abs(delta)}
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full rounded-full ${getScoreBarColor(score)}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Currently being worked on */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                      <Zap size={14} className="text-purple-400" /> Currently
                      Being Worked On
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {activeTasks.length === 0 ? (
                      <p className="text-slate-400 text-sm">
                        No active tasks right now.
                      </p>
                    ) : (
                      activeTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg"
                        >
                          <TaskStatusBadge status={task.status} />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200 text-sm font-medium">
                              {task.title}
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {task.assignee} · Due {task.dueDate}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    {subscription && (
                      <div className="bg-slate-900 rounded-lg p-3 mt-1">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                          Next Deliverable
                        </p>
                        <p className="text-slate-200 text-sm">
                          {subscription.nextDeliverable}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top 3 Alerts */}
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                      <AlertCircle size={14} className="text-rose-400" /> Top
                      Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {top3Alerts.length === 0 ? (
                      <p className="text-slate-400 text-sm">
                        No open alerts. Account looks healthy.
                      </p>
                    ) : (
                      top3Alerts.map((alert, idx) => (
                        <div
                          key={alert.id}
                          className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg"
                          data-ocid={`paid-ads.alerts.item.${idx + 1}`}
                        >
                          <div className="shrink-0 w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <SeverityBadge severity={alert.severity} />
                              <p className="text-slate-200 text-sm font-medium">
                                {alert.title}
                              </p>
                            </div>
                            <p className="text-slate-400 text-xs">
                              {alert.area}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* This month's progress */}
              <Card className="bg-slate-800 border border-slate-700 h-fit">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                    <TrendingUp size={14} className="text-purple-400" /> This
                    Month's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {thisMonthDeliverables.length === 0 ? (
                    <>
                      <p className="text-slate-400 text-sm">
                        No deliverables this month yet.
                      </p>
                      <div className="mt-2 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                        <p className="text-purple-400 text-xs">
                          April deliverables in progress. Next report due April
                          30.
                        </p>
                      </div>
                    </>
                  ) : (
                    thisMonthDeliverables.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-start gap-2 p-2 bg-slate-900 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                          <CheckCircle size={12} />
                        </div>
                        <div>
                          <p className="text-slate-200 text-xs font-medium">
                            {d.title}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {new Date(d.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ======== SCORECARD ======== */}
          <TabsContent value="scorecard" className="space-y-6 pt-4">
            {scorecard &&
              [
                {
                  title: "Account Health Score",
                  score: scorecard.accountHealthScore,
                  prev: scorecard.previousAccountHealthScore,
                  factors: scorecard.accountHealthFactors,
                  accent: "purple",
                },
                {
                  title: "ROAS Efficiency Score",
                  score: scorecard.roasEfficiencyScore,
                  prev: scorecard.previousRoasEfficiencyScore,
                  factors: scorecard.roasEfficiencyFactors,
                  accent: "emerald",
                },
                {
                  title: "Audience Quality Score",
                  score: scorecard.audienceQualityScore,
                  prev: scorecard.previousAudienceQualityScore,
                  factors: scorecard.audienceQualityFactors,
                  accent: "blue",
                },
                {
                  title: "Budget Utilization Score",
                  score: scorecard.budgetUtilizationScore,
                  prev: scorecard.previousBudgetUtilizationScore,
                  factors: scorecard.budgetUtilizationFactors,
                  accent: "amber",
                },
              ].map(({ title, score, prev, factors, accent }) => {
                const delta = prev !== undefined ? score - prev : null;
                const accentClasses: Record<
                  string,
                  { text: string; bar: string; bg: string }
                > = {
                  purple: {
                    text: "text-purple-400",
                    bar: "bg-purple-500",
                    bg: "bg-purple-500/10 border-purple-500/20",
                  },
                  emerald: {
                    text: "text-emerald-400",
                    bar: "bg-emerald-500",
                    bg: "bg-emerald-500/10 border-emerald-500/20",
                  },
                  blue: {
                    text: "text-blue-400",
                    bar: "bg-blue-500",
                    bg: "bg-blue-500/10 border-blue-500/20",
                  },
                  amber: {
                    text: "text-amber-400",
                    bar: "bg-amber-500",
                    bg: "bg-amber-500/10 border-amber-500/20",
                  },
                };
                const ac = accentClasses[accent] ?? accentClasses.purple;
                return (
                  <Card
                    key={title}
                    className={`bg-slate-800 border ${ac.bg}`}
                    data-ocid="paid-ads.scorecard.card"
                  >
                    <CardContent className="pt-5 pb-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg">
                            {title}
                          </h3>
                          {delta !== null && (
                            <span
                              className={`flex items-center gap-1 text-xs font-medium mt-0.5 ${
                                delta >= 0
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {delta >= 0 ? (
                                <ArrowUp size={12} />
                              ) : (
                                <ArrowDown size={12} />
                              )}
                              {Math.abs(delta)} pts this month
                            </span>
                          )}
                        </div>
                        <div className="text-center">
                          <span
                            className={`text-5xl font-black ${getScoreColor(score)}`}
                          >
                            {score}
                          </span>
                          <span className="text-slate-500 text-lg">/100</span>
                        </div>
                      </div>
                      {/* Main progress bar */}
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-5">
                        <div
                          className={`h-full rounded-full ${ac.bar}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      {/* Subfactors */}
                      <div className="space-y-4">
                        {factors.map((f) => (
                          <ScoreBar
                            key={f.name}
                            score={f.score}
                            label={f.name}
                            note={f.note}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            <p className="text-slate-500 text-xs text-center pb-4">
              Scores update after each campaign optimization and monthly review.
            </p>
          </TabsContent>

          {/* ======== CAMPAIGNS ======== */}
          <TabsContent value="campaigns" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                {
                  DEMO_PAID_ADS_CAMPAIGNS.filter((c) => c.status === "active")
                    .length
                }{" "}
                active · {DEMO_PAID_ADS_CAMPAIGNS.length} total
              </p>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                onClick={() =>
                  toast.info("Submit a request to launch a new campaign")
                }
              >
                <Plus size={14} className="mr-1" /> New Campaign Request
              </Button>
            </div>
            <div className="space-y-3">
              {DEMO_PAID_ADS_CAMPAIGNS.map((camp) => (
                <Card key={camp.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-white text-sm font-semibold">
                            {camp.name}
                          </h3>
                          <CampaignStatusBadge status={camp.status} />
                          <ChannelBadge channel={camp.channel} />
                        </div>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {camp.objective} · Started {camp.startDate}
                          {camp.endDate ? ` → ${camp.endDate}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {camp.status === "active" ? (
                          <button
                            type="button"
                            onClick={() => toast.info("Pause request sent")}
                            className="text-slate-400 hover:text-amber-400 transition-colors"
                            title="Pause campaign"
                          >
                            <Pause size={14} />
                          </button>
                        ) : camp.status === "paused" ? (
                          <button
                            type="button"
                            onClick={() => toast.info("Resume request sent")}
                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Resume campaign"
                          >
                            <Play size={14} />
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {camp.status !== "paused" && camp.impressions > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          {
                            label: "Spend",
                            value: `$${camp.spend.toLocaleString()}`,
                            sub: `/ $${camp.budget.toLocaleString()} budget`,
                          },
                          {
                            label: "Impressions",
                            value: camp.impressions.toLocaleString(),
                            sub: "",
                          },
                          {
                            label: "Clicks",
                            value: camp.clicks.toLocaleString(),
                            sub: `${camp.ctr}% CTR`,
                          },
                          {
                            label: "Conversions",
                            value: camp.conversions.toString(),
                            sub: `$${camp.cpc.toFixed(2)} CPC · ${camp.roas}x ROAS`,
                          },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="bg-slate-900 rounded-lg p-2.5"
                          >
                            <p className="text-slate-500 text-[10px] uppercase tracking-wider">
                              {stat.label}
                            </p>
                            <p className="text-white text-base font-bold mt-0.5">
                              {stat.value}
                            </p>
                            {stat.sub && (
                              <p className="text-slate-400 text-[10px] mt-0.5">
                                {stat.sub}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {camp.status !== "paused" && camp.budget > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Budget used</span>
                          <span>
                            {Math.round((camp.spend / camp.budget) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={Math.round((camp.spend / camp.budget) * 100)}
                          className="h-1.5 bg-slate-700"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {camp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-[10px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ======== AD COPY ======== */}
          <TabsContent value="ad-copy" className="space-y-4 pt-4">
            <p className="text-slate-400 text-sm">
              Active ad copy variants across your campaigns. Review A/B test
              results and approve winners.
            </p>
            <div className="space-y-3">
              {DEMO_AD_COPY_VARIANTS.map((v) => {
                const camp = DEMO_PAID_ADS_CAMPAIGNS.find(
                  (c) => c.id === v.campaignId,
                );
                return (
                  <Card
                    key={v.id}
                    className={`bg-slate-800 border-slate-700 ${
                      v.status === "winner"
                        ? "border-l-4 border-l-purple-500"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <CampaignStatusBadge status={v.status} />
                            {v.isControl && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
                                Control
                              </span>
                            )}
                            {camp && (
                              <span className="text-[10px] text-slate-500 truncate">
                                {camp.name.split(" ").slice(0, 3).join(" ")}
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-semibold text-sm">
                            {v.headline}
                          </h3>
                          <p className="text-slate-300 text-sm mt-1">
                            {v.description}
                          </p>
                          <p className="text-purple-400 text-xs mt-1 font-medium">
                            CTA: {v.cta}
                          </p>
                        </div>
                      </div>
                      {v.impressions > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                          {[
                            {
                              label: "Impressions",
                              value: v.impressions.toLocaleString(),
                            },
                            {
                              label: "Clicks",
                              value: v.clicks.toLocaleString(),
                            },
                            { label: "CTR", value: `${v.ctr}%` },
                            {
                              label: "Conversions",
                              value: v.conversions.toString(),
                            },
                          ].map((s) => (
                            <div
                              key={s.label}
                              className="bg-slate-900 rounded p-2"
                            >
                              <p className="text-slate-500 text-[10px] uppercase">
                                {s.label}
                              </p>
                              <p className="text-white text-sm font-bold">
                                {s.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {v.notes && (
                        <p className="text-slate-400 text-xs italic mt-1">
                          {v.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card className="bg-slate-800/50 border-slate-700 border-dashed">
              <CardContent className="p-4 text-center">
                <p className="text-slate-400 text-sm mb-2">
                  Need new ad copy? Submit a copy request to your agent.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 text-xs"
                  onClick={() =>
                    toast.info(
                      "Head to the Requests tab to submit an ad copy brief",
                    )
                  }
                >
                  Request New Copy
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======== AUDIENCES ======== */}
          <TabsContent value="audiences" className="space-y-4 pt-4">
            <p className="text-slate-400 text-sm">
              Audience segments active across your campaigns. Targeting quality
              directly affects cost and conversions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_AUDIENCE_SEGMENTS.map((aud) => {
                const perfColor =
                  aud.performance === "high"
                    ? "text-emerald-400"
                    : aud.performance === "medium"
                      ? "text-amber-400"
                      : "text-slate-400";
                const perfBg =
                  aud.performance === "high"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : aud.performance === "medium"
                      ? "bg-amber-500/10 border-amber-500/20"
                      : "bg-slate-700 border-slate-600";
                return (
                  <Card key={aud.id} className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Users size={14} className="text-purple-400" />
                            <h3 className="text-white text-sm font-semibold">
                              {aud.name}
                            </h3>
                          </div>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {aud.type} · {aud.size}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${perfBg} ${perfColor}`}
                        >
                          {aud.performance.charAt(0).toUpperCase() +
                            aud.performance.slice(1)}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">
                        {aud.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {aud.campaigns.map((cId) => {
                          const c = DEMO_PAID_ADS_CAMPAIGNS.find(
                            (cp) => cp.id === cId,
                          );
                          return c ? (
                            <span
                              key={cId}
                              className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-[10px]"
                            >
                              {c.name.split(" ").slice(0, 3).join(" ")}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* ======== OPPORTUNITIES ======== */}
          <TabsContent value="opportunities" className="space-y-4 pt-4">
            <p className="text-slate-400 text-sm">
              Improvements your agent has identified to increase performance,
              reduce waste, and capture more leads.
            </p>
            <div className="space-y-3">
              {DEMO_ADS_OPPORTUNITIES.map((opp, idx) => (
                <Card
                  key={opp.id}
                  className="bg-slate-800 border-slate-700"
                  data-ocid={`paid-ads.opportunities.item.${idx + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <ImpactBadge level={opp.impact} />
                          <span className="text-xs text-slate-500 capitalize">
                            {opp.effort} effort · {opp.type}
                          </span>
                        </div>
                        <h3 className="text-white text-sm font-semibold">
                          {opp.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          {opp.description}
                        </p>
                        <div className="mt-2 p-2 bg-slate-900 rounded">
                          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                            Recommended action
                          </p>
                          <p className="text-slate-300 text-sm">
                            {opp.recommendation}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 text-xs shrink-0"
                        data-ocid={`paid-ads.opportunities.${idx + 1}.button`}
                        onClick={() => {
                          setRequestForm((prev) => ({
                            ...prev,
                            title: opp.title,
                            description: opp.recommendation,
                          }));
                          setActiveTab("requests");
                          toast.success("Opportunity copied to Requests tab");
                        }}
                      >
                        Create Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ======== ALERTS ======== */}
          <TabsContent value="alerts" className="space-y-4 pt-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-slate-500 text-xs mb-1.5 uppercase tracking-wider">
                  Severity
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["all", "critical", "high", "medium", "low"].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setAlertSeverityFilter(f)}
                      data-ocid={`paid-ads.alerts.severity.${f}.toggle`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                        alertSeverityFilter === f
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1.5 uppercase tracking-wider">
                  Category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "all",
                    "budget",
                    "performance",
                    "audience",
                    "copy",
                    "landing-page",
                    "bidding",
                  ].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setAlertCategoryFilter(f)}
                      data-ocid={`paid-ads.alerts.category.${f}.toggle`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                        alertCategoryFilter === f
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {f === "landing-page"
                        ? "Landing Page"
                        : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredAlerts.length === 0 ? (
              <div
                className="py-12 text-center text-slate-400"
                data-ocid="paid-ads.alerts.empty_state"
              >
                No alerts match the current filters.
              </div>
            ) : (
              filteredAlerts.map((alert, idx) => (
                <Card
                  key={alert.id}
                  className="bg-slate-800 border border-slate-700"
                  data-ocid={`paid-ads.alerts.item.${idx + 1}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <SeverityBadge severity={alert.severity} />
                      <AlertCategoryBadge category={alert.category} />
                      <AlertStatusBadge status={alert.status} />
                      {alert.owner && (
                        <span className="text-xs text-slate-500">
                          · {alert.owner}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white text-sm font-semibold mb-1">
                      {alert.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                      {alert.description}
                    </p>
                    <p className="text-slate-500 text-xs mb-3">
                      📍 {alert.area}
                    </p>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                        Suggested Fix
                      </p>
                      <p className="text-slate-300 text-sm">
                        {alert.suggestedFix}
                      </p>
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 text-xs"
                        onClick={() => {
                          setRequestForm((prev) => ({
                            ...prev,
                            title: `Fix: ${alert.title}`,
                            description: alert.suggestedFix,
                            priority:
                              alert.severity === "critical" ||
                              alert.severity === "high"
                                ? "high"
                                : "medium",
                          }));
                          setActiveTab("requests");
                          toast.success("Alert added to Requests tab");
                        }}
                      >
                        Create Fix Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ======== PERFORMANCE ======== */}
          <TabsContent value="performance" className="space-y-4 pt-4">
            <p className="text-slate-400 text-sm">
              Monthly performance history for your Paid Ads account. All data
              reflects your managed campaigns.
            </p>
            {performanceHistory.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-8 text-center">
                  <BarChart2
                    size={32}
                    className="text-slate-600 mx-auto mb-3"
                  />
                  <p className="text-slate-400 text-sm">
                    No performance history yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {performanceHistory.map((month, idx) => {
                  const prev = performanceHistory[idx + 1];
                  const healthDelta = prev
                    ? month.accountHealthScore - prev.accountHealthScore
                    : null;
                  const roasDelta = prev
                    ? month.roasEfficiencyScore - prev.roasEfficiencyScore
                    : null;
                  const monthLabel = new Date(
                    `${month.month}-01`,
                  ).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  });
                  return (
                    <Card
                      key={month.month}
                      className="bg-slate-800 border-slate-700"
                      data-ocid={`paid-ads.performance.item.${idx + 1}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                          <h3 className="text-white font-semibold">
                            {monthLabel}
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-slate-500 text-[10px] uppercase tracking-wider">
                                Account Health
                              </p>
                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-lg font-bold ${getScoreColor(month.accountHealthScore)}`}
                                >
                                  {month.accountHealthScore}
                                </span>
                                {healthDelta !== null && (
                                  <span
                                    className={`flex items-center text-xs ${
                                      healthDelta >= 0
                                        ? "text-emerald-400"
                                        : "text-rose-400"
                                    }`}
                                  >
                                    {healthDelta >= 0 ? (
                                      <ArrowUp size={10} />
                                    ) : (
                                      <ArrowDown size={10} />
                                    )}
                                    {Math.abs(healthDelta)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-slate-500 text-[10px] uppercase tracking-wider">
                                ROAS Score
                              </p>
                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-lg font-bold ${getScoreColor(month.roasEfficiencyScore)}`}
                                >
                                  {month.roasEfficiencyScore}
                                </span>
                                {roasDelta !== null && (
                                  <span
                                    className={`flex items-center text-xs ${
                                      roasDelta >= 0
                                        ? "text-emerald-400"
                                        : "text-rose-400"
                                    }`}
                                  >
                                    {roasDelta >= 0 ? (
                                      <ArrowUp size={10} />
                                    ) : (
                                      <ArrowDown size={10} />
                                    )}
                                    {Math.abs(roasDelta)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            {
                              label: "Spend",
                              value: `$${month.spend.toLocaleString()}`,
                              icon: (
                                <DollarSign
                                  size={12}
                                  className="text-purple-400"
                                />
                              ),
                            },
                            {
                              label: "Clicks",
                              value: month.clicks.toLocaleString(),
                              icon: (
                                <MousePointer
                                  size={12}
                                  className="text-blue-400"
                                />
                              ),
                            },
                            {
                              label: "Conversions",
                              value: month.conversions.toString(),
                              icon: (
                                <Target
                                  size={12}
                                  className="text-emerald-400"
                                />
                              ),
                            },
                            {
                              label: "ROAS",
                              value: `${month.roas}x`,
                              icon: (
                                <TrendingUp
                                  size={12}
                                  className="text-amber-400"
                                />
                              ),
                            },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className="bg-slate-900 rounded-lg p-2.5"
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {stat.icon}
                                <p className="text-slate-500 text-[10px] uppercase tracking-wider">
                                  {stat.label}
                                </p>
                              </div>
                              <p className="text-white text-base font-bold">
                                {stat.value}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                          <span>
                            {month.impressions.toLocaleString()} impressions
                          </span>
                          <span>{month.ctr}% CTR</span>
                          <span>${month.avgCpc.toFixed(2)} avg CPC</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ======== REQUESTS ======== */}
          <TabsContent value="requests" className="space-y-4 pt-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Plus size={14} className="text-purple-400" /> Submit a
                  Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-slate-400 text-xs mb-1 block">
                    Request Title *
                  </Label>
                  <Input
                    placeholder="e.g., Launch Mother's Day promo campaign"
                    value={requestForm.title}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="bg-slate-900 border-slate-600 text-slate-200"
                    data-ocid="paid-ads.requests.input"
                  />
                </div>
                <div>
                  <Label className="text-slate-400 text-xs mb-1 block">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Describe the campaign, target audience, budget, or goal..."
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="bg-slate-900 border-slate-600 text-slate-200 resize-none"
                    rows={3}
                    data-ocid="paid-ads.requests.textarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">
                      Priority
                    </Label>
                    <Select
                      value={requestForm.priority}
                      onValueChange={(v) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          priority: v as "high" | "medium" | "low",
                        }))
                      }
                    >
                      <SelectTrigger
                        className="bg-slate-900 border-slate-600 text-slate-200"
                        data-ocid="paid-ads.requests.priority.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs mb-1 block">
                      Preferred deadline
                    </Label>
                    <Input
                      type="date"
                      value={requestForm.dueDatePreference}
                      onChange={(e) =>
                        setRequestForm((prev) => ({
                          ...prev,
                          dueDatePreference: e.target.value,
                        }))
                      }
                      className="bg-slate-900 border-slate-600 text-slate-200"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!requestForm.title.trim() || submitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white w-full"
                  data-ocid="paid-ads.requests.submit_button"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={14} className="mr-2 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Past requests */}
            {myRequests.length > 0 && (
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  Past Requests
                </p>
                <div className="space-y-2">
                  {myRequests.map((req) => (
                    <Card
                      key={req.id}
                      className="bg-slate-800 border-slate-700"
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-white text-sm font-medium">
                              {req.title}
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5">
                              {req.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quick suggestions */}
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Quick Requests
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Launch a seasonal promotion campaign",
                  "Create retargeting audience from website visitors",
                  "Write new ad copy variants",
                  "Optimize budget allocation across campaigns",
                  "Build a dedicated campaign landing page",
                  "Add review/testimonial ad assets",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      setRequestForm((prev) => ({ ...prev, title: suggestion }))
                    }
                    className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ======== DELIVERABLES ======== */}
          <TabsContent value="deliverables" className="space-y-4 pt-4">
            {deliverables.length === 0 ? (
              <Card
                className="bg-slate-800 border-slate-700"
                data-ocid="paid-ads.deliverables.empty_state"
              >
                <CardContent className="p-8 text-center">
                  <FileText size={32} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    Deliverables will appear here as your agent completes
                    monthly work.
                  </p>
                </CardContent>
              </Card>
            ) : (
              Object.entries(
                deliverables.reduce(
                  (acc, d) => {
                    if (!acc[d.month]) acc[d.month] = [];
                    acc[d.month].push(d);
                    return acc;
                  },
                  {} as Record<string, typeof deliverables>,
                ),
              )
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([month, items]) => (
                  <div key={month}>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                      {new Date(`${month}-01`).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="space-y-2">
                      {items.map((d) => (
                        <Card
                          key={d.id}
                          className="bg-slate-800 border-slate-700"
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <CheckCircle
                                size={14}
                                className="text-emerald-400 mt-0.5 shrink-0"
                              />
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {d.title}
                                </p>
                                <p className="text-slate-400 text-xs mt-0.5">
                                  {d.description}
                                </p>
                                <p className="text-slate-500 text-[10px] mt-1">
                                  Completed{" "}
                                  {new Date(d.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
