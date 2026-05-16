import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  Globe,
  Layout,
  Lightbulb,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
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
import { AUDIT_SCORES } from "../data/demoData";
import {
  DEMO_CONTENT_BRIEFS,
  DEMO_CRO_OPPORTUNITIES,
  DEMO_PAGE_UPDATES,
  DEMO_WEBSITE_ISSUES,
  DEMO_WEBSITE_PERFORMANCE_HISTORY,
  DEMO_WEBSITE_SCORECARD,
} from "../data/websiteAgentData";

// ---- Helpers ----

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

function IssueStatusBadge({ status }: { status: string }) {
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

function CategoryBadge({ category }: { category: string }) {
  const variants: Record<string, string> = {
    conversion: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    content: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    technical: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    trust: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    mobile: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    speed: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  };
  const labels: Record<string, string> = {
    conversion: "Conversion",
    content: "Content",
    technical: "Technical",
    trust: "Trust",
    mobile: "Mobile",
    speed: "Speed",
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

function RequestStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    submitted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    in_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    in_progress: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const labels: Record<string, string> = {
    submitted: "Submitted",
    in_review: "In Review",
    in_progress: "In Progress",
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

function PageUpdateStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-slate-500/15 text-slate-400 border-slate-600",
    in_review: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    waiting_client: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  };
  const labels: Record<string, string> = {
    pending: "Pending",
    in_review: "In Review",
    in_progress: "In Progress",
    complete: "Complete",
    waiting_client: "Waiting on You",
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

function ImpactLevelBadge({ level }: { level: string }) {
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

function DeliverableIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    content: <Pencil size={14} />,
    report: <FileText size={14} />,
    optimization: <Zap size={14} />,
    page: <Layout size={14} />,
    audit: <Search size={14} />,
    trust: <Shield size={14} />,
  };
  return <>{icons[type] ?? <FileText size={14} />}</>;
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

// ---- Main Page Component ----

export default function WebsiteAgentPage() {
  const { currentTenantId, agentSubscriptions, submitAgentRequest } = useApp();

  // Derive live audit scores for Technical tab
  const liveWebsiteScore = AUDIT_SCORES[currentTenantId]?.website ?? 70;
  const liveMobileScore =
    liveWebsiteScore >= 80
      ? 85
      : liveWebsiteScore >= 70
        ? 72
        : liveWebsiteScore >= 60
          ? 60
          : 48;
  const liveDesktopScore = Math.min(100, liveMobileScore + 16);
  const liveLCPPass = liveWebsiteScore >= 70;
  const liveLCPValue =
    liveWebsiteScore >= 80 ? "2.1s" : liveWebsiteScore >= 70 ? "2.4s" : "3.4s";

  const [activeTab, setActiveTab] = useState("dashboard");
  const [issueFilter, setIssueFilter] = useState("all");
  const [issueCategoryFilter, setIssueCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    dueDatePreference: "",
    pageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Resolve tenant — fallback to plumbing demo data
  const resolvedTenantId = DEMO_WEBSITE_SCORECARD.find(
    (s) => s.tenantId === currentTenantId,
  )
    ? currentTenantId
    : "tenant-plumbing";

  const scorecard = DEMO_WEBSITE_SCORECARD.find(
    (s) => s.tenantId === resolvedTenantId,
  );
  const allIssues = DEMO_WEBSITE_ISSUES.filter(
    (i) => i.tenantId === resolvedTenantId,
  );
  const performanceHistory = DEMO_WEBSITE_PERFORMANCE_HISTORY.filter(
    (p) => p.tenantId === resolvedTenantId,
  ).sort((a, b) => b.month.localeCompare(a.month));

  const myTasks = DEMO_AGENT_TASKS.filter(
    (t) => t.tenantId === resolvedTenantId && t.productId === "agent-website",
  );
  const deliverables = DEMO_AGENT_DELIVERABLES.filter(
    (d) => d.tenantId === resolvedTenantId && d.productId === "agent-website",
  );
  const myRequests = DEMO_AGENT_REQUESTS.filter(
    (r) => r.tenantId === resolvedTenantId && r.productId === "agent-website",
  );

  // Active subscription check
  const websiteSubscription = agentSubscriptions.find(
    (s) =>
      s.tenantId === currentTenantId &&
      s.productId === "agent-website" &&
      s.status === "active",
  );
  const isActive = !!websiteSubscription;

  // Active tasks
  const activeTasks = myTasks.filter(
    (t) => t.status === "in_progress" || t.status === "pending",
  );

  // Severity order
  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const openIssues = allIssues.filter((i) => i.status === "open");
  const top3Issues = openIssues
    .sort(
      (a, b) =>
        (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9),
    )
    .slice(0, 3);

  // This month's deliverables
  const thisMonthDeliverables = deliverables.filter(
    (d) => d.month === "2026-04",
  );

  // Filtered issues
  const filteredIssues = allIssues.filter((i) => {
    const sev = issueFilter === "all" || i.severity === issueFilter;
    const cat =
      issueCategoryFilter === "all" || i.category === issueCategoryFilter;
    return sev && cat;
  });

  // Filtered page updates
  const filteredUpdates =
    statusFilter === "all"
      ? DEMO_PAGE_UPDATES
      : DEMO_PAGE_UPDATES.filter((u) => u.status === statusFilter);

  // Grouped deliverables by month
  const deliverablesByMonth: Record<string, typeof deliverables> = {};
  for (const d of deliverables) {
    if (!deliverablesByMonth[d.month]) deliverablesByMonth[d.month] = [];
    deliverablesByMonth[d.month].push(d);
  }
  const sortedMonths = Object.keys(deliverablesByMonth).sort((a, b) =>
    b.localeCompare(a),
  );

  function handleSubmitRequest() {
    if (!requestForm.title.trim()) {
      toast.error("Please provide a request title.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      submitAgentRequest({
        tenantId: currentTenantId,
        productId: "agent-website",
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
        pageUrl: "",
      });
      setSubmitting(false);
      toast.success("Request submitted — our team will be in touch shortly.");
    }, 600);
  }

  // Tab items with open issue count
  const tabItems = [
    { value: "dashboard", label: "Dashboard" },
    { value: "scorecard", label: "Scorecard" },
    { value: "pages", label: "Page Queue" },
    { value: "cro", label: "CRO" },
    { value: "content", label: "Content" },
    {
      value: "issues",
      label: `Issues (${openIssues.length})`,
    },
    { value: "technical", label: "Technical" },
    { value: "performance", label: "Performance" },
    { value: "requests", label: "Requests" },
    { value: "deliverables", label: "Deliverables" },
  ];

  if (!isActive) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <Globe size={28} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Website Agent</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Keep your site updated, conversion-focused, and growth-ready.
            Activate the Website Agent to access your full managed site
            workspace — page queue, CRO opportunities, content briefs, and
            monthly performance tracking.
          </p>
          <Link to="/agent-services">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-ocid="website-agent.view_store.button"
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <Globe size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-white text-xl font-bold">Website Agent</h1>
                {isActive ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20"
                    data-ocid="website-agent.status"
                  >
                    <CheckCircle size={10} /> Active
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400 text-xs font-medium border border-slate-500/20"
                    data-ocid="website-agent.status"
                  >
                    <Circle size={10} /> Inactive
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm">
                Keep your site updated, conversion-focused, and growth-ready.
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
              data-ocid="website-agent.submit_request_button"
              onClick={() => setActiveTab("requests")}
            >
              Submit Request
            </Button>
            <ThreadHistoryPanel agentType="Website Agent" />
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
                  data-ocid={`website-agent.${tab.value}.tab`}
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
                    label: "Conversion Readiness",
                    score: scorecard.conversionReadinessScore,
                    prev: scorecard.previousConversionReadinessScore,
                  },
                  {
                    label: "Content Quality",
                    score: scorecard.contentQualityScore,
                    prev: scorecard.previousContentQualityScore,
                  },
                  {
                    label: "Technical Health",
                    score: scorecard.technicalHealthScore,
                    prev: scorecard.previousTechnicalHealthScore,
                  },
                  {
                    label: "Trust & Authority",
                    score: scorecard.trustAuthorityScore,
                    prev: scorecard.previousTrustAuthorityScore,
                  },
                ].map(({ label, score, prev }) => {
                  const delta = prev !== undefined ? score - prev : null;
                  return (
                    <Card
                      key={label}
                      className={`bg-slate-800 border ${getScoreBg(score)}`}
                      data-ocid="website-agent.dashboard.card"
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
              {/* Currently being worked on + top issues */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                      <Zap size={14} className="text-blue-400" /> Currently
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
                  </CardContent>
                </Card>

                {/* Top 3 issues */}
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                      <AlertCircle size={14} className="text-rose-400" /> Top 3
                      Priorities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {top3Issues.length === 0 ? (
                      <p className="text-slate-400 text-sm">No open issues.</p>
                    ) : (
                      top3Issues.map((issue, idx) => (
                        <div
                          key={issue.id}
                          className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg"
                          data-ocid={`website-agent.priorities.item.${idx + 1}`}
                        >
                          <div className="shrink-0 w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <SeverityBadge severity={issue.severity} />
                              <p className="text-slate-200 text-sm font-medium">
                                {issue.title}
                              </p>
                            </div>
                            <p className="text-slate-400 text-xs">
                              {issue.area}
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
                    <TrendingUp size={14} className="text-blue-400" /> This
                    Month's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {thisMonthDeliverables.length === 0 ? (
                    <>
                      <p className="text-slate-400 text-sm">
                        No deliverables this month yet.
                      </p>
                      <div className="mt-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-400 text-xs">
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
                        <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                          <DeliverableIcon type={d.type} />
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
            {scorecard
              ? [
                  {
                    title: "Conversion Readiness",
                    score: scorecard.conversionReadinessScore,
                    prev: scorecard.previousConversionReadinessScore,
                    factors: scorecard.conversionReadinessFactors,
                    accent: "amber",
                  },
                  {
                    title: "Content Quality",
                    score: scorecard.contentQualityScore,
                    prev: scorecard.previousContentQualityScore,
                    factors: scorecard.contentQualityFactors,
                    accent: "purple",
                  },
                  {
                    title: "Technical Health",
                    score: scorecard.technicalHealthScore,
                    prev: scorecard.previousTechnicalHealthScore,
                    factors: scorecard.technicalHealthFactors,
                    accent: "blue",
                  },
                  {
                    title: "Trust & Authority",
                    score: scorecard.trustAuthorityScore,
                    prev: scorecard.previousTrustAuthorityScore,
                    factors: scorecard.trustAuthorityFactors,
                    accent: "rose",
                  },
                ].map(({ title, score, prev, factors, accent }) => {
                  const delta = prev !== undefined ? score - prev : null;
                  const accentClasses: Record<
                    string,
                    { text: string; bar: string; bg: string }
                  > = {
                    amber: {
                      text: "text-amber-400",
                      bar: "bg-amber-500",
                      bg: "bg-amber-500/10 border-amber-500/20",
                    },
                    purple: {
                      text: "text-purple-400",
                      bar: "bg-purple-500",
                      bg: "bg-purple-500/10 border-purple-500/20",
                    },
                    blue: {
                      text: "text-blue-400",
                      bar: "bg-blue-500",
                      bg: "bg-blue-500/10 border-blue-500/20",
                    },
                    rose: {
                      text: "text-rose-400",
                      bar: "bg-rose-500",
                      bg: "bg-rose-500/10 border-rose-500/20",
                    },
                  };
                  const ac = accentClasses[accent];
                  return (
                    <Card
                      key={title}
                      className={`bg-slate-800 border ${ac.bg}`}
                      data-ocid="website-agent.scorecard.card"
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
                })
              : null}
            <p className="text-slate-500 text-xs text-center pb-4">
              Scores update after each audit run and task completion.
            </p>
          </TabsContent>

          {/* ======== PAGE QUEUE ======== */}
          <TabsContent value="pages" className="space-y-4 pt-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-slate-400 text-sm">
                {
                  DEMO_PAGE_UPDATES.filter((u) => u.status !== "complete")
                    .length
                }{" "}
                active updates ·{" "}
                {
                  DEMO_PAGE_UPDATES.filter((u) => u.status === "complete")
                    .length
                }{" "}
                completed
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  "all",
                  "in_progress",
                  "pending",
                  "in_review",
                  "waiting_client",
                  "complete",
                ].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setStatusFilter(f)}
                    data-ocid={`website-agent.pages.${f}.toggle`}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      statusFilter === f
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400"
                    }`}
                  >
                    {f === "all"
                      ? "All"
                      : f
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredUpdates.map((update, idx) => (
                <Card
                  key={update.id}
                  className={`bg-slate-800 border-slate-700 ${
                    update.status === "waiting_client"
                      ? "border-l-4 border-l-orange-500"
                      : update.status === "in_progress"
                        ? "border-l-4 border-l-blue-500"
                        : ""
                  }`}
                  data-ocid={`website-agent.pages.item.${idx + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <PageUpdateStatusBadge status={update.status} />
                          <span className="text-[10px] text-slate-500 capitalize">
                            {update.updateType.replace("-", " ")}
                          </span>
                          {update.requestedBy === "client" && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                              Your Request
                            </span>
                          )}
                          {update.priority === "high" && (
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </div>
                        <h3 className="text-white text-sm font-semibold">
                          {update.pageTitle}
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {update.pageUrl}
                        </p>
                        <p className="text-slate-300 text-sm mt-1.5">
                          {update.description}
                        </p>
                        {update.notes && (
                          <p className="text-slate-400 text-xs mt-1 italic">
                            {update.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>Due: {update.dueDate}</span>
                          {update.completedAt && (
                            <span className="text-emerald-400">
                              Completed:{" "}
                              {new Date(
                                update.completedAt,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ======== CRO ======== */}
          <TabsContent value="cro" className="space-y-4 pt-4">
            <p className="text-slate-400 text-sm">
              Conversion rate optimization opportunities identified by your
              Website Agent. Each fix has a measurable impact on leads and
              revenue.
            </p>
            <div className="space-y-3">
              {DEMO_CRO_OPPORTUNITIES.map((opp, idx) => (
                <Card
                  key={opp.id}
                  className={`bg-slate-800 border-slate-700 ${
                    opp.status === "in_progress" || opp.status === "in_review"
                      ? "border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  data-ocid={`website-agent.cro.item.${idx + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <ImpactLevelBadge level={opp.impact} />
                          <PageUpdateStatusBadge status={opp.status} />
                          <span className="text-xs text-slate-500 capitalize">
                            {opp.effort} effort
                          </span>
                        </div>
                        <h3 className="text-white text-sm font-semibold">
                          {opp.title}
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {opp.pageTitle} · {opp.pageUrl}
                        </p>
                        <p className="text-slate-400 text-sm mt-1.5">
                          {opp.description}
                        </p>
                        <div className="mt-2 p-2 bg-slate-900 rounded">
                          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                            Estimated lift
                          </p>
                          <p className="text-emerald-400 text-sm font-medium">
                            {opp.estimatedLift}
                          </p>
                        </div>
                        <div className="mt-2 p-2 bg-slate-900 rounded">
                          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                            Recommendation
                          </p>
                          <p className="text-slate-300 text-sm">
                            {opp.recommendation}
                          </p>
                        </div>
                      </div>
                      {opp.status === "open" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 shrink-0"
                          data-ocid={`website-agent.cro.request_button.${idx + 1}`}
                          onClick={() => {
                            setRequestForm((p) => ({
                              ...p,
                              title: opp.title,
                              pageUrl: opp.pageUrl,
                            }));
                            setActiveTab("requests");
                            toast.success(
                              "Request pre-filled from opportunity.",
                            );
                          }}
                        >
                          Create Request
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ======== CONTENT ======== */}
          <TabsContent value="content" className="space-y-4 pt-4">
            <p className="text-slate-400 text-sm">
              Content briefs your agent has created or is working on. Each brief
              maps to a specific page or topic.
            </p>
            <div className="space-y-3">
              {DEMO_CONTENT_BRIEFS.map((brief, idx) => (
                <Card
                  key={brief.id}
                  className="bg-slate-800 border-slate-700"
                  data-ocid={`website-agent.content.item.${idx + 1}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <PageUpdateStatusBadge status={brief.status} />
                          <span className="text-[10px] px-2 py-0.5 bg-slate-700 text-slate-400 rounded capitalize">
                            {brief.pageType.replace("-", " ")}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {brief.wordCount} words
                          </span>
                        </div>
                        <h3 className="text-white text-sm font-semibold">
                          {brief.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Target keyword:{" "}
                          <span className="text-blue-400">
                            {brief.targetKeyword}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-2">
                        Outline
                      </p>
                      <ul className="space-y-1">
                        {brief.outline.map((item, i) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs text-slate-300"
                          >
                            <span className="text-slate-600 shrink-0">
                              {i + 1}.
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {brief.notes && (
                      <p className="text-slate-400 text-xs mt-2 italic">
                        {brief.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ======== ISSUES ======== */}
          <TabsContent value="issues" className="space-y-4 pt-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">
                  Severity
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["all", "critical", "high", "medium", "low"].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setIssueFilter(f)}
                      data-ocid={`website-agent.issues.${f}.toggle`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        issueFilter === f
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider">
                  Category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "all",
                    "conversion",
                    "content",
                    "technical",
                    "trust",
                    "mobile",
                    "speed",
                  ].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setIssueCategoryFilter(f)}
                      data-ocid={`website-agent.issues.category.${f}.toggle`}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                        issueCategoryFilter === f
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredIssues.length === 0 ? (
              <div
                className="py-12 text-center text-slate-400"
                data-ocid="website-agent.issues.empty_state"
              >
                No issues match the current filters.
              </div>
            ) : (
              filteredIssues.map((issue, idx) => (
                <Card
                  key={issue.id}
                  className="bg-slate-800 border border-slate-700"
                  data-ocid={`website-agent.issues.item.${idx + 1}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <SeverityBadge severity={issue.severity} />
                      <CategoryBadge category={issue.category} />
                      <IssueStatusBadge status={issue.status} />
                    </div>
                    <h3 className="text-white font-semibold mb-1">
                      {issue.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-1">
                      📍 {issue.area}
                    </p>
                    {issue.pageUrl && (
                      <p className="text-slate-500 text-xs mb-2">
                        {issue.pageUrl}
                      </p>
                    )}
                    <p className="text-slate-300 text-sm mb-3">
                      {issue.description}
                    </p>
                    <div className="bg-slate-900 rounded-lg p-3 mb-3">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        Suggested Fix
                      </p>
                      <p className="text-slate-300 text-sm">
                        {issue.suggestedFix}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {issue.owner && (
                        <span>
                          Owner:{" "}
                          <span className="text-slate-300">{issue.owner}</span>
                        </span>
                      )}
                      {issue.dueDate && (
                        <span>
                          Due:{" "}
                          <span className="text-slate-300">
                            {issue.dueDate}
                          </span>
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ======== TECHNICAL HEALTH ======== */}
          <TabsContent value="technical" className="space-y-5 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Page Speed (Mobile)",
                  value: String(liveMobileScore),
                  unit: "/100",
                  color: getScoreColor(liveMobileScore),
                },
                {
                  label: "Page Speed (Desktop)",
                  value: String(liveDesktopScore),
                  unit: "/100",
                  color: getScoreColor(liveDesktopScore),
                },
                {
                  label: "Uptime (30d)",
                  value: "99.8",
                  unit: "%",
                  color: "text-emerald-400",
                },
                {
                  label: "SSL Status",
                  value: "Active",
                  unit: "",
                  color: "text-emerald-400",
                },
              ].map(({ label, value, unit, color }) => (
                <Card
                  key={label}
                  className="bg-slate-800 border border-slate-700"
                  data-ocid="website-agent.technical.card"
                >
                  <CardContent className="pt-4 pb-4">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    <div className="flex items-baseline gap-0.5">
                      <span className={`text-2xl font-black ${color}`}>
                        {value}
                      </span>
                      <span className="text-slate-500 text-sm">{unit}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold">
                  Core Web Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "LCP (Largest Contentful Paint)",
                      value: liveLCPValue,
                      target: "< 2.5s",
                      pass: liveLCPPass,
                    },
                    {
                      name: "FID (First Input Delay)",
                      value: "18ms",
                      target: "< 100ms",
                      pass: true,
                    },
                    {
                      name: "CLS (Cumulative Layout Shift)",
                      value: "0.08",
                      target: "< 0.1",
                      pass: true,
                    },
                    {
                      name: "DNS Response Time",
                      value: "42ms",
                      target: "< 100ms",
                      pass: true,
                    },
                  ].map(({ name, value, target, pass }) => (
                    <div
                      key={name}
                      className="flex items-center justify-between p-3 bg-slate-900 rounded-lg"
                    >
                      <div>
                        <p className="text-slate-200 text-sm font-medium">
                          {name}
                        </p>
                        <p className="text-slate-500 text-xs">
                          Target: {target}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            pass ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {value}
                        </span>
                        {pass ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            <CheckCircle size={10} /> Pass
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                            <AlertCircle size={10} /> Fail
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    data-ocid="website-agent.technical.run_audit_button"
                    onClick={() =>
                      toast.success(
                        "Audit queued — results typically ready within 15 minutes.",
                      )
                    }
                  >
                    <RefreshCw size={12} className="mr-1.5" /> Run New Audit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Technical issues */}
            {allIssues.filter(
              (i) => i.category === "technical" || i.category === "speed",
            ).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  Technical Issues
                </h3>
                {allIssues
                  .filter(
                    (i) => i.category === "technical" || i.category === "speed",
                  )
                  .map((issue, idx) => (
                    <Card
                      key={issue.id}
                      className="bg-slate-800 border border-slate-700"
                      data-ocid={`website-agent.technical.issue.${idx + 1}`}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <SeverityBadge severity={issue.severity} />
                          <IssueStatusBadge status={issue.status} />
                        </div>
                        <p className="text-white font-semibold">
                          {issue.title}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          {issue.description}
                        </p>
                        <div className="bg-slate-900 rounded-lg p-3 mt-2">
                          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                            Fix
                          </p>
                          <p className="text-slate-300 text-sm">
                            {issue.suggestedFix}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* ======== PERFORMANCE ======== */}
          <TabsContent value="performance" className="space-y-6 pt-4">
            <p className="text-slate-400 text-sm">
              Monthly performance history showing score improvements, pages
              optimized, and top wins each month.
            </p>

            {performanceHistory.length === 0 ? (
              <div
                className="py-12 text-center text-slate-400"
                data-ocid="website-agent.performance.empty_state"
              >
                No performance history yet.
              </div>
            ) : (
              performanceHistory.map((month, idx) => (
                <Card
                  key={month.month}
                  className={`bg-slate-800 border border-slate-700 ${
                    idx === 0 ? "border-blue-500/30" : ""
                  }`}
                  data-ocid={`website-agent.performance.item.${idx + 1}`}
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-white font-bold text-base">
                          {new Date(`${month.month}-01`).toLocaleDateString(
                            "en-US",
                            { month: "long", year: "numeric" },
                          )}
                        </h3>
                        <p
                          className={`text-sm font-medium mt-0.5 ${
                            month.estimatedConversionLift.startsWith("+")
                              ? "text-emerald-400"
                              : "text-slate-400"
                          }`}
                        >
                          {month.estimatedConversionLift}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-blue-400 text-xl font-black">
                            {month.pagesOptimized}
                          </p>
                          <p className="text-slate-500 text-xs">Pages</p>
                        </div>
                        <div className="text-center">
                          <p className="text-emerald-400 text-xl font-black">
                            {month.updatesCompleted}
                          </p>
                          <p className="text-slate-500 text-xs">Updates</p>
                        </div>
                      </div>
                    </div>

                    {/* 4 score metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[
                        {
                          label: "Conversion",
                          score: month.conversionReadinessScore,
                        },
                        {
                          label: "Content",
                          score: month.contentQualityScore,
                        },
                        {
                          label: "Technical",
                          score: month.technicalHealthScore,
                        },
                        {
                          label: "Trust",
                          score: month.trustAuthorityScore,
                        },
                      ].map(({ label, score }) => (
                        <div
                          key={label}
                          className="bg-slate-900 rounded-lg p-3 text-center"
                        >
                          <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                            {label}
                          </p>
                          <span
                            className={`text-xl font-black ${getScoreColor(score)}`}
                          >
                            {score}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Top wins */}
                    <div>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                        Top Wins
                      </p>
                      <div className="space-y-1.5">
                        {month.topWins.map((win) => (
                          <div key={win} className="flex items-start gap-2">
                            <CheckCircle
                              size={12}
                              className="text-emerald-400 mt-0.5 shrink-0"
                            />
                            <p className="text-slate-300 text-sm">{win}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* AI recommendations */}
            <Card className="bg-slate-800 border-blue-500/30 border border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-400" />
                  AI Business Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Your Conversion Readiness improved 7 points this month — contact form simplification is working.",
                  "3 trust signals are still missing. Adding team bios and review integrations could push Trust & Authority above 70.",
                  "Mobile click-to-call is your highest-impact next fix. Resolving it could drive 15-25% more inbound calls.",
                ].map((rec) => (
                  <div
                    key={rec.slice(0, 30)}
                    className="flex items-start gap-2"
                  >
                    <ChevronRight
                      size={14}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <p className="text-slate-300 text-sm">{rec}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======== REQUESTS ======== */}
          <TabsContent value="requests" className="space-y-6 pt-4">
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Pencil size={14} className="text-blue-400" /> Submit a
                  Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm mb-1 block">
                    Request Title *
                  </Label>
                  <Input
                    placeholder="e.g. Rewrite homepage hero section for better conversion"
                    className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                    value={requestForm.title}
                    onChange={(e) =>
                      setRequestForm((p) => ({ ...p, title: e.target.value }))
                    }
                    data-ocid="website-agent.requests.input"
                  />
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-1 block">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Describe what you need and any relevant context..."
                    className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500 min-h-24"
                    value={requestForm.description}
                    onChange={(e) =>
                      setRequestForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    data-ocid="website-agent.requests.textarea"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300 text-sm mb-1 block">
                      Priority
                    </Label>
                    <Select
                      value={requestForm.priority}
                      onValueChange={(v) =>
                        setRequestForm((p) => ({
                          ...p,
                          priority: v as "high" | "medium" | "low",
                        }))
                      }
                    >
                      <SelectTrigger
                        className="bg-slate-700 border-slate-600 text-slate-200"
                        data-ocid="website-agent.requests.priority.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="high" className="text-slate-200">
                          High
                        </SelectItem>
                        <SelectItem value="medium" className="text-slate-200">
                          Medium
                        </SelectItem>
                        <SelectItem value="low" className="text-slate-200">
                          Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm mb-1 block">
                      Preferred Due Date
                    </Label>
                    <Input
                      type="date"
                      className="bg-slate-700 border-slate-600 text-slate-200"
                      value={requestForm.dueDatePreference}
                      onChange={(e) =>
                        setRequestForm((p) => ({
                          ...p,
                          dueDatePreference: e.target.value,
                        }))
                      }
                      data-ocid="website-agent.requests.date.input"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm mb-1 block">
                      Page URL (optional)
                    </Label>
                    <Input
                      placeholder="/services/emergency"
                      className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                      value={requestForm.pageUrl}
                      onChange={(e) =>
                        setRequestForm((p) => ({
                          ...p,
                          pageUrl: e.target.value,
                        }))
                      }
                      data-ocid="website-agent.requests.url.input"
                    />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-slate-500 text-xs mb-3">
                    Common requests: rewrite homepage hero · build new service
                    page · simplify contact form · add social proof · improve
                    mobile CTA · create FAQ section · add trust badges
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSubmitRequest}
                    disabled={submitting}
                    data-ocid="website-agent.requests.submit_button"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick suggestions */}
            <div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                Quick Requests
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Rewrite homepage hero section",
                  "Build new service area landing page",
                  "Simplify contact form",
                  "Add social proof to service pages",
                  "Improve mobile click-to-call experience",
                  "Create FAQ section",
                  "Update pricing page copy",
                  "Add trust badges and license numbers",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRequestForm((p) => ({ ...p, title: s }))}
                    className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing requests */}
            {myRequests.length > 0 && (
              <Card className="bg-slate-800 border border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm font-semibold">
                    Your Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myRequests.map((req, idx) => (
                    <div
                      key={req.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-slate-900 rounded-lg"
                      data-ocid={`website-agent.requests.item.${idx + 1}`}
                    >
                      <div className="flex-1">
                        <p className="text-slate-200 text-sm font-medium">
                          {req.title}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Submitted{" "}
                          {new Date(req.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <RequestStatusBadge status={req.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ======== DELIVERABLES ======== */}
          <TabsContent value="deliverables" className="space-y-6 pt-4">
            {sortedMonths.length === 0 ? (
              <div
                className="py-12 text-center text-slate-400"
                data-ocid="website-agent.deliverables.empty_state"
              >
                No deliverables yet.
              </div>
            ) : (
              sortedMonths.map((month) => (
                <div key={month}>
                  <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                    {new Date(`${month}-01`).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="space-y-2">
                    {deliverablesByMonth[month].map((d, idx) => (
                      <Card
                        key={d.id}
                        className="bg-slate-800 border border-slate-700"
                        data-ocid={`website-agent.deliverables.item.${idx + 1}`}
                      >
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                              <DeliverableIcon type={d.type} />
                            </div>
                            <div className="flex-1">
                              <p className="text-slate-200 text-sm font-semibold">
                                {d.title}
                              </p>
                              <p className="text-slate-400 text-sm mt-0.5">
                                {d.description}
                              </p>
                              <p className="text-slate-500 text-xs mt-1">
                                {new Date(d.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-slate-700/50 text-slate-300 border-slate-600 capitalize">
                              {d.type}
                            </span>
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
