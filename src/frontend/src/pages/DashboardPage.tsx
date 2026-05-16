import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart2,
  Bot,
  Building2,
  CheckCircle2,
  Crown,
  DollarSign,
  FileText,
  Heart,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import AIChatWidget from "../components/AIChatWidget";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useApp } from "../context/AppContext";
import { AGENT_PRODUCTS } from "../data/agentData";
import {
  AUDIT_SCORES,
  FUNDABILITY_SCORES,
  LEADS,
  REVIEWS,
} from "../data/demoData";
import {
  getHealthColor,
  getHealthStatus,
  getStatusLabel,
} from "../types/healthScore";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contacted: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  qualified: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  closed: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  won: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  lost: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function DashboardPage() {
  const {
    currentTenantId,
    currentUser,
    auditOverrides,
    fundabilityOverrides,
    tenants,
    isDemoMode,
    demoInfo,
    setWeeklyReportOpen,
    setAiPanelOpen,
    agentSubscriptions,
    isAdminUser,
    isSuperAdmin,
    getClientReports,
    getAllClientHealthScores,
    getClientHealthScore,
  } = useApp();

  const [greetingDismissed, setGreetingDismissed] = useState(false);

  const leads = LEADS[currentTenantId] ?? [];
  const reviews = REVIEWS[currentTenantId] ?? [];
  const latestReport = getClientReports(currentTenantId)[0] ?? null;
  const auditScore =
    auditOverrides[currentTenantId] ??
    AUDIT_SCORES[currentTenantId]?.total ??
    0;
  const fundScore =
    fundabilityOverrides[currentTenantId] ??
    FUNDABILITY_SCORES[currentTenantId] ??
    0;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const openLeads = leads.filter(
    (l) => l.status === "new" || l.status === "contacted",
  ).length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const reviewsThisMonth = reviews.length;

  const activeAgentSubs = agentSubscriptions.filter(
    (s) => s.tenantId === currentTenantId && s.status === "active",
  );

  // Admin portfolio KPIs
  const allLeadsCount = Object.values(LEADS).flat().length;
  const allReviewsCount = Object.values(REVIEWS).flat().length;
  const activeAgentCount = agentSubscriptions.filter(
    (s) => s.status === "active",
  ).length;

  const KPI_CARDS = isAdminUser
    ? [
        {
          title: "Total Leads",
          value: allLeadsCount,
          icon: Users,
          color: "border-blue-500",
          sub: "Across all clients",
        },
        {
          title: "Reviews",
          value: allReviewsCount,
          icon: Star,
          color: "border-amber-400",
          sub: "Total managed reviews",
        },
        {
          title: "Active Clients",
          value: tenants.length,
          icon: Building2,
          color: "border-indigo-500",
          sub: "Managed businesses",
        },
        {
          title: "Active Agents",
          value: activeAgentCount,
          icon: Bot,
          color: "border-purple-500",
          sub: "Agent subscriptions",
        },
      ]
    : [
        {
          title: "Total Leads",
          value: leads.length,
          icon: Users,
          color: "border-blue-500",
          sub: `${newLeads} new this week`,
        },
        {
          title: "Avg Rating",
          value: avgRating,
          icon: Star,
          color: "border-amber-400",
          sub: `${reviews.length} total reviews`,
        },
        {
          title: "SEO Score",
          value: `${auditScore}/100`,
          icon: Search,
          color: "border-emerald-500",
          sub: auditScore >= 70 ? "Good standing" : "Needs improvement",
        },
        {
          title: "Fundability",
          value: `${fundScore}/100`,
          icon: TrendingUp,
          color: "border-purple-500",
          sub:
            fundScore >= 70
              ? "Bankable"
              : fundScore >= 40
                ? "Builder"
                : "Starter",
        },
      ];

  const recentLeads = leads.slice(0, 5);
  const recentReviews = reviews.slice(0, 3);

  const buildGreeting = () => {
    const greeting = getGreeting();
    if (isDemoMode && demoInfo) {
      return {
        title: `${greeting}, ${demoInfo.firstName}.`,
        message: `Here's a live simulation of ${demoInfo.businessName}'s dashboard. You have ${leads.length} simulated leads in your pipeline — ${newLeads} new this week. SEO score: ${auditScore}/100. Fundability: ${fundScore}/100. Explore each section below to see how the platform works for your ${demoInfo.niche} business in ${demoInfo.city}.`,
        isDemo: true,
      };
    }
    if (currentUser && !currentUser.isAdminUser) {
      return {
        title: `${greeting}, ${currentUser.name}.`,
        message: `You have ${openLeads} open leads and ${newLeads} new ones this week. Your review average is ${avgRating}★ and your SEO score is ${auditScore}/100.${activeAgentSubs.length > 0 ? ` Your ${activeAgentSubs.length} active agent${activeAgentSubs.length > 1 ? "s are" : " is"} working in the background.` : ""}`,
        isDemo: false,
      };
    }
    return null;
  };

  const greetingData = buildGreeting();

  // ── Super Admin / Platform Owner View ──────────────────────────────────────
  if (isSuperAdmin) {
    const allLeads = Object.values(LEADS).flat();
    const allReviews = Object.values(REVIEWS).flat();
    const totalActiveAgents = agentSubscriptions.filter(
      (s) => s.status === "active",
    ).length;
    const allHealthScores = getAllClientHealthScores();
    const healthyCount = allHealthScores.filter(
      (s) => getHealthStatus(s.overallScore) === "healthy",
    ).length;
    const warningCount = allHealthScores.filter(
      (s) => getHealthStatus(s.overallScore) === "warning",
    ).length;
    const atRiskCount = allHealthScores.filter(
      (s) => getHealthStatus(s.overallScore) === "at-risk",
    ).length;

    const PLATFORM_KPIs = [
      {
        title: "Total Tenants",
        value: tenants.length,
        icon: Building2,
        color: "border-indigo-500",
        sub: "Active client accounts",
      },
      {
        title: "Total Leads",
        value: allLeads.length,
        icon: Users,
        color: "border-blue-500",
        sub: "Across all tenants",
      },
      {
        title: "Total Reviews",
        value: allReviews.length,
        icon: Star,
        color: "border-amber-400",
        sub: "Managed on platform",
      },
      {
        title: "Active Agents",
        value: totalActiveAgents,
        icon: Bot,
        color: "border-purple-500",
        sub: "Agent subscriptions",
      },
    ];

    const PLATFORM_ACTIONS = [
      {
        label: "Manage Tenants",
        href: "/admin",
        icon: Building2,
        color: "bg-indigo-600 hover:bg-indigo-700",
      },
      {
        label: "Go Live Setup",
        href: "/go-live",
        icon: Zap,
        color: "bg-emerald-600 hover:bg-emerald-700",
      },
      {
        label: "White Label Hub",
        href: "/white-label-hub",
        icon: Shield,
        color: "bg-violet-600 hover:bg-violet-700",
      },
      {
        label: "Open Lead Lake",
        href: "/open-lead-lake",
        icon: Search,
        color: "bg-blue-600 hover:bg-blue-700",
      },
      {
        label: "Agent Workflow OS",
        href: "/agent-workflow-os",
        icon: Bot,
        color: "bg-purple-600 hover:bg-purple-700",
      },
      {
        label: "Platform Settings",
        href: "/settings",
        icon: Settings,
        color: "bg-slate-600 hover:bg-slate-700",
      },
    ];

    return (
      <div className="space-y-6">
        {/* Platform Owner Header */}
        <div className="relative rounded-xl p-6 border bg-gradient-to-r from-amber-950/40 to-slate-900/60 border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Crown size={22} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-1">
                Welcome back, Platform Owner.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                You have full control of all tenants, clients, platform
                settings, and integrations. This is your master view —{" "}
                {tenants.length} active client accounts, {allLeads.length} total
                leads, and {totalActiveAgents} active agent subscriptions across
                the platform.
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Link to="/admin">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full font-medium transition-colors"
                  >
                    <Building2 size={11} /> Manage All Tenants
                  </button>
                </Link>
                <Link to="/go-live">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full font-medium transition-colors"
                  >
                    <Zap size={11} /> Go Live Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Platform KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_KPIs.map(({ title, value, icon: Icon, color, sub }) => (
            <Card
              key={title}
              className={`border-t-4 ${color} bg-card shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  {title}
                  <Icon size={15} className="text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue & Platform Health Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Platform Revenue Estimate */}
          <Card className="bg-card shadow-sm border border-emerald-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <DollarSign size={15} className="text-emerald-400" /> Platform
                Revenue (Est.)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-sm text-slate-300">
                  Monthly Recurring
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  ${(tenants.length * 188).toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-sm text-slate-300">Annual Run Rate</span>
                <span className="text-sm font-bold text-white">
                  ${(tenants.length * 188 * 12).toLocaleString()}/yr
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-300">Avg. per Client</span>
                <span className="text-sm font-bold text-slate-300">
                  $188/mo
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Client Health Overview */}
          <Card className="bg-card shadow-sm border border-rose-500/20">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Heart size={15} className="text-rose-400" /> Client Health
                Overview
              </CardTitle>
              <Link to="/health-dashboard">
                <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  Full View <ArrowRight size={11} />
                </span>
              </Link>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-lg font-bold text-white">
                    {healthyCount}
                  </span>
                  <span className="text-xs text-slate-400">Healthy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-lg font-bold text-white">
                    {warningCount}
                  </span>
                  <span className="text-xs text-slate-400">
                    Needs Attention
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-lg font-bold text-white">
                    {atRiskCount}
                  </span>
                  <span className="text-xs text-slate-400">At Risk</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                {healthyCount} of {allHealthScores.length} clients in good
                standing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Quick Actions */}
        <Card className="bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap size={15} className="text-amber-400" /> Platform Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORM_ACTIONS.map(({ label, href, icon: Icon, color }) => (
                <Link key={href} to={href}>
                  <Button
                    size="sm"
                    className={`w-full ${color} text-white justify-start gap-2`}
                    data-ocid={`superadmin.action.${label.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    <Icon size={13} /> {label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tenants */}
        <Card className="bg-card shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 size={15} className="text-indigo-400" /> Recent Tenants
            </CardTitle>
            <Link to="/admin">
              <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                Manage All <ArrowRight size={11} />
              </span>
            </Link>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {tenants.slice(0, 6).map((tenant, idx) => (
                <div
                  key={tenant.id}
                  data-ocid={`superadmin.tenant.item.${idx + 1}`}
                  className="flex items-center gap-3 py-2 border-b border-slate-800 last:border-0"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
                    {tenant.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {tenant.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {tenant.type} · {tenant.address}
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] border flex-shrink-0">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  // ── End Super Admin View ────────────────────────────────────────────────────

  // Upcoming tasks based on data
  const upcomingTasks = [
    openLeads > 0 && {
      label: `Follow up on ${openLeads} open lead${openLeads > 1 ? "s" : ""}`,
      href: "/leads",
      priority: "high",
    },
    reviews.some((r) => r.rating <= 3) && {
      label: "Respond to low-rated reviews",
      href: "/reviews",
      priority: "high",
    },
    auditScore < 70 && {
      label: "Run SEO audit — score needs improvement",
      href: "/audit",
      priority: "medium",
    },
    activeAgentSubs.length === 0 && {
      label: "Explore Agent Services for managed growth",
      href: "/agent-services",
      priority: "low",
    },
  ].filter(Boolean) as { label: string; href: string; priority: string }[];

  return (
    <>
      <div className="space-y-6">
        {/* AI Greeting */}
        {greetingData && !greetingDismissed && (
          <div
            className={`relative rounded-xl p-5 border ${
              greetingData.isDemo
                ? "bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border-purple-500/30"
                : "bg-gradient-to-r from-indigo-900/30 to-slate-800/30 border-indigo-500/20"
            }`}
          >
            <button
              type="button"
              onClick={() => setGreetingDismissed(true)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Dismiss greeting"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h3 className="font-semibold text-base mb-1 text-white">
                  {greetingData.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  {greetingData.message}
                </p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {greetingData.isDemo ? (
                    <Link to="/pricing">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-full font-medium transition-colors"
                      >
                        Activate for My Business <ArrowRight size={11} />
                      </button>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAiPanelOpen(true)}
                      className="inline-flex items-center gap-1 text-xs bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 px-3 py-1.5 rounded-full font-medium transition-colors"
                    >
                      <Bot size={11} /> Ask AI Manager
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isAdminUser
                ? "Agency Overview"
                : isDemoMode && demoInfo
                  ? demoInfo.businessName
                  : "Dashboard"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isAdminUser
                ? "Your full client portfolio at a glance"
                : isDemoMode
                  ? `${demoInfo?.niche} business simulation · ${demoInfo?.city}`
                  : `Here's what's happening with your business — ${getTodayName()}`}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setWeeklyReportOpen(true)}
              data-ocid="dashboard.weekly_report.button"
              className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <BarChart2 size={14} className="mr-1.5" /> Weekly Report
            </Button>
            <Button
              size="sm"
              onClick={() => setAiPanelOpen(true)}
              data-ocid="dashboard.ai_manager.button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Sparkles size={14} className="mr-1.5" /> AI Manager
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CARDS.map(({ title, value, icon: Icon, color, sub }) => (
            <Card
              key={title}
              className={`border-t-4 ${color} bg-card shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                  {title}
                  <Icon size={15} className="text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Health Overview — admin only */}
        {isAdminUser &&
          (() => {
            const allScores = getAllClientHealthScores();
            const healthyCount = allScores.filter(
              (s) => getHealthStatus(s.overallScore) === "healthy",
            ).length;
            const warningCount = allScores.filter(
              (s) => getHealthStatus(s.overallScore) === "warning",
            ).length;
            const atRiskCount = allScores.filter(
              (s) => getHealthStatus(s.overallScore) === "at-risk",
            ).length;
            return (
              <Card
                className="bg-card shadow-sm border border-rose-500/20"
                data-ocid="dashboard.health_overview.card"
              >
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Heart size={15} className="text-rose-400" /> Client Health
                    Overview
                  </CardTitle>
                  <Link to="/health-dashboard">
                    <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      View Dashboard <ArrowRight size={11} />
                    </span>
                  </Link>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-white font-semibold">
                        {healthyCount}
                      </span>
                      <span className="text-xs text-gray-400">Healthy</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm text-white font-semibold">
                        {warningCount}
                      </span>
                      <span className="text-xs text-gray-400">
                        Needs Attention
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm text-white font-semibold">
                        {atRiskCount}
                      </span>
                      <span className="text-xs text-gray-400">At Risk</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

        {/* Client Health Score (client dashboard view) */}
        {!isAdminUser &&
          (() => {
            const myScore = getClientHealthScore(currentTenantId);
            if (!myScore) return null;
            return (
              <Card
                className="bg-card shadow-sm"
                data-ocid="dashboard.my_health.card"
              >
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <Heart size={15} className="text-rose-400" /> My Health
                    Score
                  </CardTitle>
                  <Link to="/health-dashboard">
                    <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      Full Breakdown <ArrowRight size={11} />
                    </span>
                  </Link>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p
                        className={`text-3xl font-bold ${getHealthColor(myScore.overallScore)}`}
                      >
                        {myScore.overallScore}
                      </p>
                      <p className="text-[10px] text-gray-500">/100</p>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${getHealthColor(myScore.overallScore)}`}
                      >
                        {getStatusLabel(myScore.overallScore)}
                      </p>
                      {myScore.recommendations.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {myScore.recommendations[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

        {/* Quick Status Bar */}
        <div className="flex flex-wrap gap-2">
          <Link to="/analytics">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-500/20 hover:border-emerald-500/40 transition-colors cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Shield size={11} />
              Online · 99.7% uptime · SSL valid
            </span>
          </Link>
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-500/20">
            <Star size={11} />
            Reviews this month: {reviewsThisMonth}
          </span>
          {!isAdminUser && (
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-500/20">
              <Users size={11} />
              Open leads: {openLeads}
            </span>
          )}
          {activeAgentSubs.length > 0 && (
            <Link to="/agent-services">
              <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer">
                <Bot size={11} />
                {activeAgentSubs.length} agent
                {activeAgentSubs.length > 1 ? "s" : ""} active
              </span>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <Link to="/leads">
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              data-ocid="dashboard.add_lead.button"
            >
              <Plus size={14} className="mr-1" /> Add Lead
            </Button>
          </Link>
          <Link to="/reviews">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white"
              data-ocid="dashboard.request_review.button"
            >
              <MessageSquare size={14} className="mr-1" /> Request Review
            </Button>
          </Link>
          <Link to="/audit">
            <Button
              size="sm"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:text-white"
              data-ocid="dashboard.run_audit.button"
            >
              <Search size={14} className="mr-1" /> Run Audit
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads Table */}
          <Card className="bg-card shadow-sm" data-ocid="dashboard.leads.table">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Users size={15} className="text-indigo-400" /> Recent Leads
              </CardTitle>
              <Link to="/leads">
                <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  View all <ArrowRight size={11} />
                </span>
              </Link>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {recentLeads.length === 0 ? (
                <div
                  className="py-6 text-center"
                  data-ocid="dashboard.leads.empty"
                >
                  <Users size={28} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No leads yet</p>
                  <Link to="/leads">
                    <Button
                      size="sm"
                      className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Plus size={13} className="mr-1" /> Add First Lead
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      data-ocid={`dashboard.lead.row.${lead.id}`}
                      className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0"
                    >
                      <div className="w-7 h-7 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0">
                        {lead.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {lead.name}
                        </p>
                        <p className="text-xs text-gray-500">{lead.source}</p>
                      </div>
                      <Badge
                        className={`text-[10px] border capitalize ${STATUS_COLORS[lead.status] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
                      >
                        {lead.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card
            className="bg-card shadow-sm"
            data-ocid="dashboard.reviews.list"
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Star size={15} className="text-amber-400" /> Recent Reviews
              </CardTitle>
              <Link to="/reviews">
                <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  View all <ArrowRight size={11} />
                </span>
              </Link>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {recentReviews.length === 0 ? (
                <div
                  className="py-6 text-center"
                  data-ocid="dashboard.reviews.empty"
                >
                  <Star size={28} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReviews.map((review) => (
                    <div
                      key={`${review.author}-${review.platform}`}
                      className="py-2.5 border-b border-gray-800 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">
                          {review.author}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={11}
                              className={
                                star <= review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-600"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {review.comment}
                      </p>
                      <span className="text-[10px] text-gray-500 mt-1 inline-block">
                        {review.platform}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <Card className="bg-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity size={15} className="text-purple-400" /> Upcoming
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <Link key={task.label} to={task.href}>
                    <div
                      data-ocid={`dashboard.task.${task.priority}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-indigo-500/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-amber-400" : "bg-blue-400"}`}
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {task.label}
                        </span>
                      </div>
                      <ArrowRight
                        size={13}
                        className="text-gray-500 group-hover:text-indigo-400 transition-colors"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Agents Summary */}
        {activeAgentSubs.length > 0 && (
          <Card className="bg-card shadow-sm border border-purple-500/20">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Bot size={15} className="text-purple-400" /> Active Agent
                Services
              </CardTitle>
              <Link to="/agent-services">
                <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                  Manage <ArrowRight size={11} />
                </span>
              </Link>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeAgentSubs.slice(0, 4).map((sub) => {
                  const product = AGENT_PRODUCTS.find(
                    (p) => p.id === sub.productId,
                  );
                  return (
                    <div
                      key={sub.id}
                      className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                        <Bot size={14} className="text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {product?.name ?? sub.productId}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {sub.currentWork}
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] border flex-shrink-0">
                        Active
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Latest Report Card */}
        <Card
          className="bg-card shadow-sm border border-indigo-500/20"
          data-ocid="dashboard.latest_report.card"
        >
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart2 size={15} className="text-indigo-400" /> Latest Report
            </CardTitle>
            <Link to="/client-reports">
              <span className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                All Reports <ArrowRight size={11} />
              </span>
            </Link>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {latestReport ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      latestReport.overallScore >= 75
                        ? "border-emerald-500/40 text-emerald-400"
                        : latestReport.overallScore >= 50
                          ? "border-amber-500/40 text-amber-400"
                          : "border-red-500/40 text-red-400"
                    }`}
                  >
                    {latestReport.overallScore}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {latestReport.periodLabel}
                    </p>
                    <p className="text-xs text-gray-400">
                      {latestReport.reportType === "weekly"
                        ? "Weekly"
                        : "Monthly"}{" "}
                      ·{" "}
                      {new Date(latestReport.generatedAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {latestReport.topWins.slice(0, 2).map((win) => (
                    <p
                      key={win.slice(0, 30)}
                      className="text-xs text-gray-400 flex items-start gap-1.5"
                    >
                      <CheckCircle2
                        size={10}
                        className="text-emerald-400 mt-0.5 flex-shrink-0"
                      />
                      <span className="line-clamp-1">{win}</span>
                    </p>
                  ))}
                </div>
                <Link
                  to="/client-reports"
                  data-ocid="dashboard.view_full_report.link"
                >
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-full mt-1"
                  >
                    <FileText size={13} className="mr-1.5" /> View Full Report
                  </Button>
                </Link>
              </div>
            ) : (
              <div
                className="py-4 text-center"
                data-ocid="dashboard.latest_report.empty_state"
              >
                <FileText size={24} className="text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-3">No reports yet</p>
                <Link
                  to="/client-reports"
                  data-ocid="dashboard.generate_first_report.link"
                >
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Sparkles size={13} className="mr-1.5" /> Generate First
                    Report
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* AI Chat Widget — floats over all content */}
      {(() => {
        const t = tenants.find((x) => x.id === currentTenantId);
        if (!t) return null;
        return (
          <AIChatWidget
            businessName={t.name}
            niche={t.type || "plumbing"}
            city={t.address || ""}
            phone={t.phone}
          />
        );
      })()}
    </>
  );
}
