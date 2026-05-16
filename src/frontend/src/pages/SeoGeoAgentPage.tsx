import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Layout,
  Lightbulb,
  MapPin,
  Megaphone,
  Pencil,
  Play,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
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
import { AUDIT_SCORES } from "../data/demoData";
import {
  DEMO_GBP_TASKS,
  DEMO_GEO_VISIBILITY,
  DEMO_NAP_CONSISTENCY,
  DEMO_SEO_GEO_CONTENT,
  DEMO_SEO_GEO_ISSUES,
  DEMO_SEO_GEO_OPPORTUNITIES,
  DEMO_SEO_GEO_SCORECARDS,
} from "../data/seoGeoData";

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
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${variants[severity] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
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
    wont_fix: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };
  const labels: Record<string, string> = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    wont_fix: "Won't Fix",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function OpportunityStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    available: "bg-slate-500/15 text-slate-300 border-slate-500/20",
    requested: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const labels: Record<string, string> = {
    available: "Available",
    requested: "Requested",
    in_progress: "In Progress",
    completed: "Completed",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function ImpactBadge({ impact }: { impact: string }) {
  const variants: Record<string, string> = {
    high: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    low: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[impact] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
    >
      {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
    </span>
  );
}

function EffortBadge({ effort }: { effort: string }) {
  const variants: Record<string, string> = {
    high: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    low: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[effort] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
    >
      {effort.charAt(0).toUpperCase() + effort.slice(1)} Effort
    </span>
  );
}

function ContentStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    draft: "bg-slate-500/15 text-slate-300 border-slate-500/20",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    published: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };
  const labels: Record<string, string> = {
    draft: "Draft",
    approved: "Approved",
    published: "Published",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function ContentTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    "title-meta": "Title/Meta",
    "hero-copy": "Hero Copy",
    "service-page": "Service Page",
    faq: "FAQ Block",
    "gbp-description": "GBP Description",
    cta: "CTA",
    "local-page": "Local Page",
    "geo-brief": "GEO Brief",
  };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-purple-500/15 text-purple-300 border-purple-500/20">
      {labels[type] ?? type}
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
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
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
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variants[status] ?? "bg-slate-700 text-slate-300 border-slate-600"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function DeliverableIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    content: <Pencil size={14} />,
    report: <FileText size={14} />,
    optimization: <Zap size={14} />,
    campaign: <Megaphone size={14} />,
    page: <Layout size={14} />,
    audit: <Search size={14} />,
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

export default function SeoGeoAgentPage() {
  const {
    currentTenantId,
    agentSubscriptions,
    submitAgentRequest,
    listingConfigs,
  } = useApp();

  // Derive live audit data for Technical Health tab
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
  const [oppFilter, setOppFilter] = useState("all");
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [requestedOpps, setRequestedOpps] = useState<Set<string>>(new Set());

  // Request form state
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
  const resolvedTenantId = DEMO_SEO_GEO_SCORECARDS.find(
    (s) => s.tenantId === currentTenantId,
  )
    ? currentTenantId
    : "tenant-plumbing";

  const scorecard = DEMO_SEO_GEO_SCORECARDS.find(
    (s) => s.tenantId === resolvedTenantId,
  );
  const issues = DEMO_SEO_GEO_ISSUES.filter(
    (i) => i.tenantId === resolvedTenantId,
  );
  const opportunities = DEMO_SEO_GEO_OPPORTUNITIES.filter(
    (o) => o.tenantId === resolvedTenantId,
  );
  const gbpTasks = DEMO_GBP_TASKS.filter(
    (t) => t.tenantId === resolvedTenantId,
  );
  const napData = DEMO_NAP_CONSISTENCY[resolvedTenantId] ?? [];
  const tenantListings = listingConfigs[currentTenantId];
  const enhancedNapData = napData.map((item) => {
    let isConfigured = false;
    if (
      item.platform === "Google Business Profile" &&
      tenantListings?.googleUrl
    )
      isConfigured = true;
    if (item.platform === "Yelp" && tenantListings?.yelpUrl)
      isConfigured = true;
    if (item.platform === "Facebook" && tenantListings?.facebookUrl)
      isConfigured = true;
    if (item.platform === "Bing Places" && tenantListings?.bingUrl)
      isConfigured = true;
    return { ...item, isConfigured };
  });
  const content = DEMO_SEO_GEO_CONTENT.filter(
    (c) => c.tenantId === resolvedTenantId,
  );
  const geoVisibility =
    DEMO_GEO_VISIBILITY.find(
      (v) => v.tenantId === resolvedTenantId && v.month === "2026-04",
    ) ?? DEMO_GEO_VISIBILITY.find((v) => v.tenantId === resolvedTenantId);
  const prevGeoVisibility = DEMO_GEO_VISIBILITY.find(
    (v) => v.tenantId === resolvedTenantId && v.month === "2026-03",
  );

  const myTasks = DEMO_AGENT_TASKS.filter(
    (t) =>
      t.tenantId === resolvedTenantId &&
      (t.productId === "agent-seo" || t.productId === "agent-bundle"),
  );
  const deliverables = DEMO_AGENT_DELIVERABLES.filter(
    (d) =>
      d.tenantId === resolvedTenantId &&
      (d.productId === "agent-seo" || d.productId === "agent-bundle"),
  );
  const myRequests = DEMO_AGENT_REQUESTS.filter(
    (r) => r.tenantId === resolvedTenantId && r.productId === "agent-seo",
  );

  // Active subscription check
  const seoSubscription = agentSubscriptions.find(
    (s) =>
      s.tenantId === currentTenantId &&
      (s.productId === "agent-seo" || s.productId === "agent-bundle") &&
      s.status === "active",
  );
  const isActive = !!seoSubscription;

  // Active tasks
  const activeTasks = myTasks.filter(
    (t) => t.status === "in_progress" || t.status === "pending",
  );

  // Top 3 open issues sorted by severity
  const severityOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const top3Issues = issues
    .filter((i) => i.status === "open")
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
  const filteredIssues = issues.filter((i) => {
    const sev = issueFilter === "all" || i.severity === issueFilter;
    const cat =
      issueCategoryFilter === "all" || i.category === issueCategoryFilter;
    return sev && cat;
  });

  // Filtered opportunities
  const allRequestedOpps = new Set([
    ...requestedOpps,
    ...opportunities.filter((o) => o.status === "requested").map((o) => o.id),
  ]);
  const filteredOpportunities = opportunities.filter((o) => {
    if (oppFilter === "all") return true;
    if (oppFilter === "high") return o.impact === "high";
    return o.category === oppFilter;
  });

  // Grouped deliverables by month
  const deliverablesByMonth: Record<string, typeof deliverables> = {};
  for (const d of deliverables) {
    if (!deliverablesByMonth[d.month]) deliverablesByMonth[d.month] = [];
    deliverablesByMonth[d.month].push(d);
  }
  const sortedMonths = Object.keys(deliverablesByMonth).sort((a, b) =>
    b.localeCompare(a),
  );

  // GBP completeness calc
  const gbpComplete = gbpTasks.filter((t) => t.status === "complete").length;
  const gbpTotal = gbpTasks.length;
  const gbpCompleteness =
    gbpTotal > 0 ? Math.round((gbpComplete / gbpTotal) * 100) : 0;

  function handleRequestOpp(oppId: string) {
    setRequestedOpps((prev) => new Set([...prev, oppId]));
    toast.success("Request submitted — added to your fulfillment queue.");
  }

  function handleSubmitRequest() {
    if (!requestForm.title.trim()) {
      toast.error("Please provide a request title.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      submitAgentRequest({
        tenantId: currentTenantId,
        productId: "agent-seo",
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

  if (!scorecard) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 text-center text-slate-400">
        No SEO & GEO data found for this account.
      </div>
    );
  }

  const tabItems = [
    { value: "dashboard", label: "Dashboard" },
    { value: "scorecard", label: "Scorecard" },
    {
      value: "issues",
      label: `Issues (${issues.filter((i) => i.status === "open").length})`,
    },
    { value: "opportunities", label: "Opportunities" },
    { value: "content", label: "Content" },
    { value: "gbp", label: "GBP / Listings" },
    { value: "technical", label: "Technical" },
    { value: "geo", label: "GEO Visibility" },
    { value: "requests", label: "Requests" },
    { value: "deliverables", label: "Deliverables" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-16">
      {/* Page Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Search size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-white text-xl font-bold">
                  SEO &amp; GEO Agent
                </h1>
                {isActive ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20"
                    data-ocid="seo-geo.status"
                  >
                    <CheckCircle size={10} /> Active
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400 text-xs font-medium border border-slate-500/20"
                    data-ocid="seo-geo.status"
                  >
                    <Circle size={10} /> Inactive
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm">
                Strengthen how your business is discovered across Google and
                AI-powered search experiences.
              </p>
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
              data-ocid="seo-geo.submit_request_button"
              onClick={() => setActiveTab("requests")}
            >
              Submit Request
            </Button>
            <ThreadHistoryPanel agentType="SEO & GEO Agent" />
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
                  data-ocid={`seo-geo.${tab.value}.tab`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* ======== DASHBOARD ======== */}
          <TabsContent value="dashboard" className="space-y-6 pt-4">
            {/* Score summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "SEO Score",
                  score: scorecard.seoScore,
                  prev: scorecard.previousSeoScore,
                },
                {
                  label: "GEO Score",
                  score: scorecard.geoScore,
                  prev: scorecard.previousGeoScore,
                },
                {
                  label: "Local Visibility",
                  score: scorecard.localVisibilityScore,
                  prev: scorecard.previousLocalScore,
                },
                {
                  label: "Conversion Readiness",
                  score: scorecard.conversionReadinessScore,
                  prev: scorecard.previousConversionScore,
                },
              ].map(({ label, score, prev }) => {
                const delta = prev !== undefined ? score - prev : null;
                return (
                  <Card
                    key={label}
                    className={`bg-slate-800 border ${getScoreBg(score)}`}
                    data-ocid="seo-geo.dashboard.card"
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
                            className={`flex items-center gap-0.5 text-xs font-medium mb-0.5 ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Currently being worked on */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-slate-800 border border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                      <Zap size={14} className="text-emerald-400" /> Currently
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

                {/* Top 3 priorities */}
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
                          data-ocid={`seo-geo.priorities.item.${idx + 1}`}
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
                    <TrendingUp size={14} className="text-emerald-400" /> This
                    Month's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {thisMonthDeliverables.length === 0 ? (
                    <p className="text-slate-400 text-sm">
                      No deliverables this month yet.
                    </p>
                  ) : (
                    thisMonthDeliverables.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-start gap-2 p-2 bg-slate-900 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
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
                  {thisMonthDeliverables.length === 0 && (
                    <div className="mt-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <p className="text-emerald-400 text-xs">
                        April deliverables in progress. Next report due April
                        30.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ======== SCORECARD ======== */}
          <TabsContent value="scorecard" className="space-y-6 pt-4">
            {[
              {
                title: "SEO Score",
                score: scorecard.seoScore,
                prev: scorecard.previousSeoScore,
                factors: scorecard.seoFactors,
                accent: "emerald",
              },
              {
                title: "GEO Score",
                score: scorecard.geoScore,
                prev: scorecard.previousGeoScore,
                factors: scorecard.geoFactors,
                accent: "purple",
              },
              {
                title: "Local Visibility Score",
                score: scorecard.localVisibilityScore,
                prev: scorecard.previousLocalScore,
                factors: scorecard.localFactors,
                accent: "blue",
              },
              {
                title: "Conversion Readiness Score",
                score: scorecard.conversionReadinessScore,
                prev: scorecard.previousConversionScore,
                factors: scorecard.conversionFactors,
                accent: "amber",
              },
            ].map(({ title, score, prev, factors, accent }) => {
              const delta = prev !== undefined ? score - prev : null;
              const accentClasses: Record<
                string,
                { text: string; bar: string; bg: string }
              > = {
                emerald: {
                  text: "text-emerald-400",
                  bar: "bg-emerald-500",
                  bg: "bg-emerald-500/10 border-emerald-500/20",
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
                amber: {
                  text: "text-amber-400",
                  bar: "bg-amber-500",
                  bg: "bg-amber-500/10 border-amber-500/20",
                },
              };
              const ac = accentClasses[accent];
              return (
                <Card
                  key={title}
                  className={`bg-slate-800 border ${ac.bg}`}
                  data-ocid="seo-geo.scorecard.card"
                >
                  <CardContent className="pt-5 pb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">
                          {title}
                        </h3>
                        {delta !== null && (
                          <span
                            className={`flex items-center gap-1 text-xs font-medium mt-0.5 ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}
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
              Scores update after each audit run and task completion.
            </p>
          </TabsContent>

          {/* ======== ISSUES ======== */}
          <TabsContent value="issues" className="space-y-4 pt-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
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
                      data-ocid={`seo-geo.issues.${f}.toggle`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        issueFilter === f
                          ? "bg-emerald-600 text-white"
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
                    "technical",
                    "content",
                    "gbp",
                    "citations",
                    "conversion",
                    "geo",
                  ].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setIssueCategoryFilter(f)}
                      data-ocid={`seo-geo.issues.category.${f}.toggle`}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                        issueCategoryFilter === f
                          ? "bg-purple-600 text-white"
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
                data-ocid="seo-geo.issues.empty_state"
              >
                No issues match the current filters.
              </div>
            ) : (
              filteredIssues.map((issue, idx) => (
                <Card
                  key={issue.id}
                  className="bg-slate-800 border border-slate-700"
                  data-ocid={`seo-geo.issues.item.${idx + 1}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <SeverityBadge severity={issue.severity} />
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-slate-700/50 text-slate-300 border-slate-600 capitalize">
                        {issue.category}
                      </span>
                      <IssueStatusBadge status={issue.status} />
                    </div>
                    <h3 className="text-white font-semibold mb-1">
                      {issue.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-1">
                      📍 {issue.area}
                    </p>
                    <p className="text-slate-300 text-sm mb-3">{issue.why}</p>
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

          {/* ======== OPPORTUNITIES ======== */}
          <TabsContent value="opportunities" className="space-y-4 pt-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "all",
                "high",
                "content",
                "local-page",
                "faq",
                "schema",
                "gbp",
                "geo",
                "ai-visibility",
              ].map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setOppFilter(f)}
                  data-ocid={`seo-geo.opps.${f}.toggle`}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                    oppFilter === f
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {f === "ai-visibility"
                    ? "AI Visibility"
                    : f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>

            {filteredOpportunities.length === 0 ? (
              <div
                className="py-12 text-center text-slate-400"
                data-ocid="seo-geo.opps.empty_state"
              >
                No opportunities match the current filters.
              </div>
            ) : (
              filteredOpportunities.map((opp, idx) => {
                const currentStatus = allRequestedOpps.has(opp.id)
                  ? "requested"
                  : opp.status;
                return (
                  <Card
                    key={opp.id}
                    className="bg-slate-800 border border-slate-700"
                    data-ocid={`seo-geo.opps.item.${idx + 1}`}
                  >
                    <CardContent className="pt-5 pb-5">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <ImpactBadge impact={opp.impact} />
                            <EffortBadge effort={opp.effort} />
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-slate-700/50 text-slate-300 border-slate-600 capitalize">
                              {opp.category.replace("-", " ")}
                            </span>
                            <OpportunityStatusBadge status={currentStatus} />
                          </div>
                          <h3 className="text-white font-semibold mb-1">
                            {opp.title}
                          </h3>
                          <p className="text-slate-300 text-sm mb-3">
                            {opp.reason}
                          </p>
                          <div className="bg-slate-900 rounded-lg p-3">
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                              Recommended Action
                            </p>
                            <p className="text-slate-300 text-sm">
                              {opp.recommendedAction}
                            </p>
                          </div>
                        </div>
                        {currentStatus === "available" && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                            data-ocid={`seo-geo.opps.request_button.${idx + 1}`}
                            onClick={() => handleRequestOpp(opp.id)}
                          >
                            Request This
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* ======== CONTENT ======== */}
          <TabsContent value="content" className="space-y-6 pt-4">
            {/* Content items */}
            {content.length === 0 ? (
              <div
                className="py-12 text-center text-slate-400"
                data-ocid="seo-geo.content.empty_state"
              >
                No content items yet.
              </div>
            ) : (
              content.map((item, idx) => (
                <Card
                  key={item.id}
                  className="bg-slate-800 border border-slate-700"
                  data-ocid={`seo-geo.content.item.${idx + 1}`}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <ContentTypeBadge type={item.type} />
                      <ContentStatusBadge status={item.status} />
                      {item.pageUrl && (
                        <span className="text-slate-500 text-xs">
                          {item.pageUrl}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold mb-2">
                      {item.title}
                    </h3>
                    <div className="bg-slate-900 rounded-lg p-3 mb-3">
                      <p className="text-slate-300 text-sm whitespace-pre-line">
                        {expandedContent === item.id
                          ? item.content
                          : item.content.slice(0, 150) +
                            (item.content.length > 150 ? "..." : "")}
                      </p>
                      {item.content.length > 150 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedContent(
                              expandedContent === item.id ? null : item.id,
                            )
                          }
                          data-ocid={`seo-geo.content.expand_button.${idx + 1}`}
                          className="text-emerald-400 text-xs mt-1 flex items-center gap-1 hover:text-emerald-300"
                        >
                          {expandedContent === item.id ? (
                            <>
                              <ChevronUp size={12} /> Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown size={12} /> Show more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        data-ocid={`seo-geo.content.edit_button.${idx + 1}`}
                        onClick={() =>
                          toast.success("Content opened for editing.")
                        }
                      >
                        Edit
                      </Button>
                      {item.status === "draft" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          data-ocid={`seo-geo.content.approve_button.${idx + 1}`}
                          onClick={() => toast.success("Content approved!")}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* Generate new content */}
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-400" /> Generate
                  New Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Generate FAQ Block",
                    "Write Title & Meta",
                    "Create GBP Description",
                    "Build GEO Brief",
                  ].map((label) => (
                    <Button
                      key={label}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-ocid="seo-geo.content.generate_button"
                      onClick={() =>
                        toast.success("Content brief queued for generation.")
                      }
                    >
                      <Sparkles size={12} className="mr-1.5" /> {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======== GBP / LISTINGS ======== */}
          <TabsContent value="gbp" className="space-y-6 pt-4">
            {/* GBP Completeness */}
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Globe size={14} className="text-emerald-400" /> GBP
                  Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <span
                    className={`text-4xl font-black ${getScoreColor(gbpCompleteness)}`}
                  >
                    {gbpCompleteness}%
                  </span>
                  <div className="flex-1">
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getScoreBarColor(gbpCompleteness)}`}
                        style={{ width: `${gbpCompleteness}%` }}
                      />
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      {gbpComplete} of {gbpTotal} tasks complete
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GBP Tasks */}
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold">
                  Top Action Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {gbpTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${task.status === "complete" ? "opacity-50" : "bg-slate-900"}`}
                    data-ocid={`seo-geo.gbp.item.${idx + 1}`}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        task.status === "complete"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {task.status === "complete" ? (
                        <CheckCircle size={12} />
                      ) : (
                        <Circle size={12} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${task.status === "complete" ? "text-slate-400 line-through" : "text-slate-200"}`}
                      >
                        {task.title}
                      </p>
                    </div>
                    <ImpactBadge impact={task.impact} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* NAP Consistency */}
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <MapPin size={14} className="text-blue-400" /> NAP Consistency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table
                    className="w-full text-sm"
                    data-ocid="seo-geo.nap.table"
                  >
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-slate-400 font-semibold text-left py-2 pr-4">
                          Platform
                        </th>
                        <th className="text-slate-400 font-semibold text-center py-2 px-3">
                          Name
                        </th>
                        <th className="text-slate-400 font-semibold text-center py-2 px-3">
                          Address
                        </th>
                        <th className="text-slate-400 font-semibold text-center py-2 px-3">
                          Phone
                        </th>
                        <th className="text-slate-400 font-semibold text-center py-2 pl-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {enhancedNapData.map((entry) => {
                        const allMatch =
                          entry.nameMatch &&
                          entry.addressMatch &&
                          entry.phoneMatch;
                        return (
                          <tr
                            key={entry.platform}
                            className={allMatch ? "" : "bg-red-500/5"}
                          >
                            <td className="py-2.5 pr-4 text-slate-200 font-medium">
                              <span className="flex items-center gap-2">
                                {entry.platform}
                                {entry.isConfigured && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                    Connected
                                  </span>
                                )}
                              </span>
                            </td>
                            <td
                              className={`py-2.5 px-3 text-center font-bold ${entry.nameMatch ? "text-emerald-400" : "text-rose-400"}`}
                            >
                              {entry.nameMatch ? "✓" : "✗"}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-center font-bold ${entry.addressMatch ? "text-emerald-400" : "text-rose-400"}`}
                            >
                              {entry.addressMatch ? "✓" : "✗"}
                            </td>
                            <td
                              className={`py-2.5 px-3 text-center font-bold ${entry.phoneMatch ? "text-emerald-400" : "text-rose-400"}`}
                            >
                              {entry.phoneMatch ? "✓" : "✗"}
                            </td>
                            <td className="py-2.5 pl-3 text-center">
                              {allMatch ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                                  <CheckCircle size={12} /> Match
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-rose-400">
                                  <AlertCircle size={12} /> Fix Needed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
                  data-ocid="seo-geo.technical.card"
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
                          className={`text-sm font-bold ${pass ? "text-emerald-400" : "text-rose-400"}`}
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
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-slate-500 text-xs">
                    Last audit:{" "}
                    {new Date(scorecard.generatedAt).toLocaleDateString()}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    data-ocid="seo-geo.technical.run_audit_button"
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
            <div className="space-y-3">
              {issues
                .filter((i) => i.category === "technical")
                .map((issue, idx) => (
                  <Card
                    key={issue.id}
                    className="bg-slate-800 border border-slate-700"
                    data-ocid={`seo-geo.technical.issue.${idx + 1}`}
                  >
                    <CardContent className="pt-4 pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <SeverityBadge severity={issue.severity} />
                        <IssueStatusBadge status={issue.status} />
                      </div>
                      <p className="text-white font-semibold">{issue.title}</p>
                      <p className="text-slate-400 text-sm mt-1">{issue.why}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* ======== GEO VISIBILITY ======== */}
          <TabsContent value="geo" className="space-y-6 pt-4">
            {geoVisibility && (
              <>
                {/* AI Visibility Score */}
                <Card className="bg-slate-800 border border-purple-500/20">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                          AI Visibility Score
                        </p>
                        <div className="flex items-end gap-2">
                          <span
                            className={`text-5xl font-black ${getScoreColor(geoVisibility.aiVisibilityScore)}`}
                          >
                            {geoVisibility.aiVisibilityScore}
                          </span>
                          <span className="text-slate-500 text-lg mb-0.5">
                            /100
                          </span>
                          {prevGeoVisibility && (
                            <span
                              className={`flex items-center gap-0.5 text-sm font-medium mb-1 ${
                                geoVisibility.aiVisibilityScore >=
                                prevGeoVisibility.aiVisibilityScore
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {geoVisibility.aiVisibilityScore >=
                              prevGeoVisibility.aiVisibilityScore ? (
                                <ArrowUp size={14} />
                              ) : (
                                <ArrowDown size={14} />
                              )}
                              {Math.abs(
                                geoVisibility.aiVisibilityScore -
                                  prevGeoVisibility.aiVisibilityScore,
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="sm:w-64">
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getScoreBarColor(geoVisibility.aiVisibilityScore)}`}
                            style={{
                              width: `${geoVisibility.aiVisibilityScore}%`,
                            }}
                          />
                        </div>
                        <p className="text-slate-400 text-xs mt-2">
                          {geoVisibility.notes}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sub-metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: "FAQ Opportunities",
                      value: geoVisibility.faqOpportunities,
                      unit: " found",
                      isCount: true,
                    },
                    {
                      label: "Entity Clarity",
                      value: geoVisibility.entityClarity,
                      unit: "/100",
                      isCount: false,
                    },
                    {
                      label: "Citation Consistency",
                      value: geoVisibility.citationConsistency,
                      unit: "/100",
                      isCount: false,
                    },
                    {
                      label: "Answer Readiness",
                      value: geoVisibility.answerReadiness,
                      unit: "/100",
                      isCount: false,
                    },
                  ].map(({ label, value, unit, isCount }) => (
                    <Card
                      key={label}
                      className="bg-slate-800 border border-slate-700"
                    >
                      <CardContent className="pt-4 pb-4">
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                          {label}
                        </p>
                        <div className="flex items-baseline gap-0.5">
                          <span
                            className={`text-2xl font-black ${isCount ? "text-purple-400" : getScoreColor(value as number)}`}
                          >
                            {value}
                          </span>
                          <span className="text-slate-500 text-sm">{unit}</span>
                        </div>
                        {!isCount && (
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
                            <div
                              className={`h-full rounded-full ${getScoreBarColor(value as number)}`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* What GEO means */}
            <Card className="bg-slate-800 border border-purple-500/20">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                    <Info size={16} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      What is GEO?
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Generative Engine Optimization (GEO) measures how visible
                      your business is to AI-powered search tools like ChatGPT,
                      Gemini, and Google AI Overviews. Businesses with
                      structured FAQ content, clear entity signals, and
                      consistent citations appear more frequently in
                      AI-generated answers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top GEO Opportunities */}
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Lightbulb size={14} className="text-purple-400" /> Top GEO
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {opportunities
                  .filter(
                    (o) =>
                      o.category === "geo" ||
                      o.category === "faq" ||
                      o.category === "ai-visibility",
                  )
                  .slice(0, 3)
                  .map((opp, idx) => (
                    <div
                      key={opp.id}
                      className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg"
                      data-ocid={`seo-geo.geo.opp.${idx + 1}`}
                    >
                      <ImpactBadge impact={opp.impact} />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-200 text-sm font-medium">
                          {opp.title}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {opp.recommendedAction}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-purple-400 hover:text-purple-300 shrink-0"
                        onClick={() => setActiveTab("opportunities")}
                      >
                        <ExternalLink size={12} />
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Recommended content formats */}
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold">
                  Recommended Content Formats for GEO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "FAQ Blocks",
                      icon: "?",
                      desc: "Direct Q&A for AI extraction",
                    },
                    {
                      label: "How-To Guides",
                      icon: "📖",
                      desc: "Step-by-step structured content",
                    },
                    {
                      label: "Local Entity Content",
                      icon: "📍",
                      desc: "Location-specific relevance",
                    },
                    {
                      label: "Schema Markup",
                      icon: "</>",
                      desc: "Structured data for AI systems",
                    },
                  ].map(({ label, icon, desc }) => (
                    <div key={label} className="p-3 bg-slate-900 rounded-lg">
                      <p className="text-lg mb-1">{icon}</p>
                      <p className="text-slate-200 text-sm font-semibold">
                        {label}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ======== REQUESTS ======== */}
          <TabsContent value="requests" className="space-y-6 pt-4">
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Pencil size={14} className="text-emerald-400" /> Submit a
                  Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300 text-sm mb-1 block">
                    Request Title *
                  </Label>
                  <Input
                    placeholder="e.g. Optimize my Google Business Profile for spring season"
                    className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                    value={requestForm.title}
                    onChange={(e) =>
                      setRequestForm((p) => ({ ...p, title: e.target.value }))
                    }
                    data-ocid="seo-geo.requests.input"
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
                    data-ocid="seo-geo.requests.textarea"
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
                        data-ocid="seo-geo.requests.priority.select"
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
                      data-ocid="seo-geo.requests.date.input"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300 text-sm mb-1 block">
                      Page URL (optional)
                    </Label>
                    <Input
                      placeholder="https://..."
                      className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-500"
                      value={requestForm.pageUrl}
                      onChange={(e) =>
                        setRequestForm((p) => ({
                          ...p,
                          pageUrl: e.target.value,
                        }))
                      }
                      data-ocid="seo-geo.requests.url.input"
                    />
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-slate-500 text-xs mb-3">
                    Common requests: update homepage headline · optimize Google
                    Business Profile · create service area content · improve
                    local ranking pages · generate FAQ content · build seasonal
                    content
                  </p>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleSubmitRequest}
                    disabled={submitting}
                    data-ocid="seo-geo.requests.submit_button"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                      data-ocid={`seo-geo.requests.item.${idx + 1}`}
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
                data-ocid="seo-geo.deliverables.empty_state"
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
                        data-ocid={`seo-geo.deliverables.item.${idx + 1}`}
                      >
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
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
