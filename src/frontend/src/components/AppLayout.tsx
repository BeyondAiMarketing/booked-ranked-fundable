import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart2,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Box,
  Brain,
  BrainCircuit,
  Briefcase,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Cpu,
  CreditCard,
  Crown,
  Database,
  DatabaseZap,
  DollarSign,
  Eye,
  FileText,
  FileUp,
  FlaskConical,
  GitBranch,
  GitMerge,
  GitPullRequestArrow,
  Globe,
  Hammer,
  Heart,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageSquare,
  MessageSquareDot,
  Mic,
  Palette,
  Phone,
  PhoneCall,
  Plug,
  Rocket,
  ScanLine,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Table,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Wand2,
  Workflow,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Notification } from "../context/AppContext";
import AiBusinessManagerPanel from "./AiBusinessManagerPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";

const NAV_GROUPS = [
  {
    label: "OVERVIEW",
    items: [{ label: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "GROWTH ENGINES",
    items: [
      { label: "Leads", path: "/leads", icon: Users },
      { label: "CRM Pipeline", path: "/crm-pipeline", icon: Table },
      { label: "Booked Center", path: "/booked-center", icon: Briefcase },
      { label: "Ranked Center", path: "/ranked-center", icon: Globe },
      { label: "Funded Center", path: "/funded-center", icon: TrendingUp },
      { label: "Approval Queue", path: "/approval-queue", icon: Shield },
      { label: "Workflow Logs", path: "/workflow-logs", icon: Activity },
      { label: "Reviews", path: "/reviews", icon: Star },
      { label: "Reputation Inbox", path: "/reputation-inbox", icon: Inbox },
      { label: "SEO Audit", path: "/audit", icon: Search },
      { label: "Fundability", path: "/fundability", icon: TrendingUp },
      { label: "Estimates", path: "/estimates", icon: DollarSign },
      { label: "Appointments", path: "/appointments", icon: Calendar },
      { label: "Landing Pages", path: "/landing-pages", icon: LayoutTemplate },
      { label: "My Website", path: "/my-website", icon: Globe },
      { label: "Chat Widget", path: "/chat-widget", icon: MessageSquare },
      { label: "Voice Agent", path: "/voice-agent", icon: Phone },
      { label: "Voice Agent Studio", path: "/voice-agent-studio", icon: Mic },
      {
        label: "Content Studio",
        path: "/content-creation-studio",
        icon: Wand2,
      },
      { label: "Call Log", path: "/call-log", icon: PhoneCall },
      { label: "SMS Inbox", path: "/sms-inbox", icon: MessageSquareDot },
      { label: "Review Requests", path: "/review-requests", icon: Send },
      { label: "Campaigns", path: "/campaigns", icon: Megaphone },
      { label: "Scraper Tool", path: "/scraper-tool", icon: ScanLine },
      {
        label: "Local Rankings",
        path: "/local-ranking-intelligence",
        icon: MapPin,
      },
    ],
  },
  {
    label: "AGENT SERVICES",
    items: [
      { label: "My Agents", path: "/agent-services", icon: Bot },
      { label: "SEO & GEO Workspace", path: "/seo-geo-agent", icon: Search },
      { label: "Paid Ads Workspace", path: "/paid-ads-agent", icon: Megaphone },
      { label: "Website Workspace", path: "/website-agent", icon: Globe },
      { label: "Billing Portal", path: "/billing", icon: CreditCard },
    ],
  },
  {
    label: "AGENTS",
    items: [
      {
        label: "Content Orchestrator",
        path: "/content-orchestrator",
        icon: Workflow,
      },
      { label: "Brand Onboarding", path: "/brand-onboarding", icon: UserCheck },
      {
        label: "Content Calendar",
        path: "/social-content-calendar",
        icon: Calendar,
      },
      { label: "Platform Content", path: "/platform-content", icon: Share2 },
      {
        label: "Performance Review",
        path: "/performance-review",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "LOCAL SEO",
    items: [
      { label: "Ranked Dispatch", path: "/ranked-dispatch", icon: Workflow },
      { label: "Local SEO Audit", path: "/local-seo-audit", icon: Search },
      { label: "Review Management", path: "/review-management", icon: Star },
      { label: "GBP Post Drafts", path: "/gbp-post-drafts", icon: FileText },
    ],
  },
  {
    label: "LISTINGS & SOCIAL",
    items: [
      { label: "Listings", path: "/listings", icon: MapPin },
      { label: "GBP Manager", path: "/gbp-management", icon: Building2 },
      { label: "Social Media", path: "/social-media", icon: Share2 },
      { label: "Multi-Location", path: "/multi-location", icon: Globe },
      {
        label: "Content Generator",
        path: "/social-content-generator",
        icon: Sparkles,
      },
      { label: "Social Scheduler", path: "/social-scheduler", icon: Calendar },
      {
        label: "Engagement Agent",
        path: "/social-engagement-agent",
        icon: MessageSquare,
      },
      { label: "Social Proof", path: "/social-proof-pipeline", icon: Star },
      {
        label: "Competitor Intel",
        path: "/competitor-intelligence",
        icon: Brain,
      },
      { label: "Lead Capture", path: "/social-lead-capture", icon: Users },
      { label: "Demo Funnel", path: "/social-demo-funnel", icon: Target },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { label: "Client Reports", path: "/client-reports", icon: FileText },
      { label: "Reports", path: "/reports", icon: BarChart2 },
      { label: "Analytics", path: "/analytics", icon: Activity },
      { label: "Social ROI", path: "/social-roi", icon: TrendingUp },
      { label: "Competitive Intel", path: "/competitive-intel", icon: Eye },
      { label: "Lead Attribution", path: "/lead-attribution", icon: GitMerge },
      { label: "AI Audit Center", path: "/ai-audit-center", icon: BarChart3 },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Settings", path: "/settings", icon: Settings },
      { label: "Connected Tools", path: "/tools/connect", icon: Plug },
      { label: "Go Live", path: "/go-live", icon: Rocket },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/leads": "Leads & CRM",
  "/reviews": "Reviews & Reputation",
  "/audit": "SEO Audit",
  "/fundability": "Fundability Score",
  "/reports": "Reports",
  "/client-reports": "Client Reports",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/admin": "Admin Panel",
  "/admin-command-center": "Command Center",
  "/admin-agents": "Agent Services — Admin",
  "/agent-services": "Agent Services",
  "/billing": "Billing & Subscriptions",
  "/seo-geo-agent": "SEO & GEO Agent Workspace",
  "/paid-ads-agent": "Paid Ads Agent Workspace",
  "/website-agent": "Website Agent Workspace",
  "/chat-widget": "Chat Widget",
  "/voice-agent": "Voice Agent",
  "/call-log": "Call Log",
  "/sms-inbox": "SMS Inbox",
  "/review-requests": "Review Requests",
  "/listings": "Listings Monitor",
  "/gbp-management": "GBP Manager",
  "/social-media": "Social Media",
  "/social-roi": "Social ROI Dashboard",
  "/campaigns": "Campaigns",
  "/drip-campaigns": "CRM Drip Sender",
  "/white-label-hub": "White-Label Hub",
  "/agent-workflow-os": "Agent Workflow OS",
  "/outreach-agent": "Outreach Intelligence Agent",
  "/open-lead-lake": "Open Lead Lake",
  "/scraper-tool": "Web Scraper Tool",
  "/csv-lead-import": "Lead Import & Campaign Assignment",
  "/ai-lead-intelligence": "AI Lead Intelligence",
  "/agent-orchestration": "Agent Orchestration",
  "/landing-pages": "Landing Page Builder",
  "/website-studio": "Niche Website Studio",
  "/my-website": "My Website",
  "/health-dashboard": "Client Health Dashboard",
  "/estimates": "Estimates & Invoices",
  "/appointments": "Appointments & Booking",
  "/reputation-inbox": "Reputation Inbox",
  "/competitive-intel": "Competitive Intelligence",
  "/multi-location": "Multi-Location",
  "/social-content-generator": "AI Content Generator",
  "/social-scheduler": "Multi-Platform Scheduler",
  "/social-engagement-agent": "Auto-Engagement Agent",
  "/social-proof-pipeline": "Social Proof Pipeline",
  "/competitor-intelligence": "Competitor Intelligence",
  "/social-lead-capture": "Lead Capture from Social",
  "/social-demo-funnel": "Social-to-Demo Funnel",
  "/lead-attribution": "Lead Attribution",
  "/autopilot-dashboard": "Autopilot Pipeline",
  "/admin/brf-voice-agent": "BRF Sales Voice Agent",
  "/admin/voice-preview": "Voice Agent Preview",
  "/admin/ai-providers": "AI Providers",
  "/admin/knowledge-collections": "Knowledge Collections",
  "/admin/rag-tester": "RAG Chat Tester",
  "/admin/agent-workflows": "Agent Workflow Runner",
  "/admin/workflow-library": "N8N Workflow Library",
  "/admin/n8n-integration-docs": "N8N Integration Docs",
  "/admin/ai-usage-logs": "AI Usage Logs",
  "/admin/vector-index": "Vector Index Status",
  "/admin/client-ai-manager": "Client AI Manager",
  "/ask-ai": "Ask AI",
  "/ask-about-business": "Ask About My Business",
  "/ai-reports": "AI Reports",
  "/ai-recommendations": "AI Recommendations",
  "/my-documents": "My Documents",
  "/workflow-agent": "Workflow Agent",
  "/go-live": "Go Live — Platform Activation",
  "/scanner-3d": "3D Property & Site Scanner",
  "/crm-pipeline": "CRM Pipeline",
  "/booked-center": "Booked Center",
  "/ranked-center": "Ranked Center",
  "/funded-center": "Funded Center",
  "/approval-queue": "Approval Queue",
  "/workflow-logs": "Workflow Logs",
  "/admin/mcp-toolkit": "MCP Toolkit",
  "/admin/account-brief": "Account Brief",
  "/tools/connect": "Connected Tools",
  "/admin/roofing-automations": "Roofing Automations",
  "/admin/roofing-campaign": "Roofing Campaign Manager",
  "/local-ranking-intelligence": "Local Ranking Intelligence",
  "/voice-agent-studio": "Voice Agent Studio",
  "/content-orchestrator": "Content Orchestrator",
  "/brand-onboarding": "Brand Onboarding",
  "/social-content-calendar": "Social Content Calendar",
  "/platform-content": "Platform Content",
  "/performance-review": "Performance Review",
};

const TYPE_ICONS: Record<Notification["type"], ReactNode> = {
  lead: <Users size={14} className="text-blue-400" />,
  review: <Star size={14} className="text-amber-400" />,
  audit: <Search size={14} className="text-emerald-400" />,
  uptime: <Activity size={14} className="text-purple-400" />,
  general: <Bell size={14} className="text-slate-400" />,
  sms_reply: <MessageSquareDot size={14} className="text-indigo-400" />,
};

// Paths that should collapse the sidebar for a full-width editor experience
const EDITOR_PATHS = new Set([
  "/my-website",
  "/landing-pages",
  "/website-agent",
  "/funnel-builder",
  "/page-builder",
]);

export default function AppLayout({ children }: { children: ReactNode }) {
  const {
    currentTenantId,
    setCurrentTenantId,
    isAdmin,
    isAdminUser,
    currentUser,
    logout,
    tenants,
    notifications,
    markAllRead,
    markRead,
    setAiPanelOpen,
    isDemoMode,
    demoInfo,
    approvalItems,
    getUnreadCountByTenant,
    getAllClientHealthScores,
    isScanner3dEnabled,
    getTenantById,
  } = useApp();

  const SCANNER_NICHES_SET = new Set([
    "Real Estate",
    "Roofing",
    "Restoration",
    "real-estate",
    "roofing",
    "restoration",
  ]);
  const currentTenantData = getTenantById(currentTenantId);
  const show3dScanner =
    isScanner3dEnabled(currentTenantId) &&
    SCANNER_NICHES_SET.has(currentTenantData?.type ?? "");
  const pendingApprovalCount = approvalItems.filter(
    (a) => a.status === "pending",
  ).length;
  const smsUnreadCount = getUnreadCountByTenant(currentTenantId);
  const atRiskCount = isAdminUser
    ? getAllClientHealthScores().filter((s) => s.overallScore < 50).length
    : 0;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const currentTenant = tenants.find((t) => t.id === currentTenantId);
  const displayName =
    isDemoMode && demoInfo ? demoInfo.businessName : currentTenant?.name;
  const pageTitle = PAGE_TITLES[pathname] ?? "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false);
  const [sidebarManuallyExpanded, setSidebarManuallyExpanded] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const mainScrollRef = useRef<HTMLElement>(null);

  // Derive whether the current path is an editor/builder page
  const isEditorPath = EDITOR_PATHS.has(pathname);
  // Sidebar is collapsed when on an editor path and user hasn't manually expanded it
  const sidebarCollapsed = isEditorPath && !sidebarManuallyExpanded;

  // biome-ignore lint/correctness/useExhaustiveDependencies: close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
    setSidebarManuallyExpanded(false);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-white/8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center font-bold text-sm text-white shadow-lg">
              BRF
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight truncate max-w-[110px] text-white">
                {isDemoMode && demoInfo
                  ? demoInfo.businessName
                  : "Booked Ranked"}
              </div>
              <div className="text-xs leading-tight">
                {isDemoMode ? (
                  <span className="text-amber-400">Demo Mode</span>
                ) : (
                  <span className="text-indigo-400">Fundable</span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSidebar}
            className="md:hidden p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {isAdminUser && (
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">
              ADMIN
            </p>
            <Link
              to="/admin/master-agent"
              data-ocid="nav.masteragent.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/master-agent"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Crown size={16} />
              Master Agent
            </Link>
            <Link
              to="/admin-command-center"
              data-ocid="nav.commandcenter.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin-command-center"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <LayoutDashboard size={16} />
              Command Center
            </Link>
            <Link
              to="/admin/integration-health"
              data-ocid="nav.integrationhealth.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/integration-health"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Activity size={16} />
              Integration Health
            </Link>
            <Link
              to="/admin"
              data-ocid="nav.admin.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <ShieldCheck size={16} />
              Admin Panel
            </Link>
            <Link
              to="/admin-agents"
              data-ocid="nav.adminagents.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin-agents"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Bot size={16} />
              Agent Services
            </Link>
            <Link
              to="/white-label-hub"
              data-ocid="nav.whitelabel.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/white-label-hub"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Palette size={16} />
              White-Label Hub
            </Link>
            <Link
              to="/agent-workflow-os"
              data-ocid="nav.agentworkflowos.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/agent-workflow-os"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Cpu size={16} />
              <span className="flex-1">Agent Workflow OS</span>
              {pendingApprovalCount > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {pendingApprovalCount}
                </span>
              )}
            </Link>
            <Link
              to="/admin/feature-toggles"
              data-ocid="nav.featuretoggles.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/feature-toggles"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Sliders size={16} />
              Feature Toggles
            </Link>
            <Link
              to="/outreach-agent"
              data-ocid="nav.outreachagent.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/outreach-agent"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Target size={16} />
              Outreach Agent
            </Link>
            <Link
              to="/open-lead-lake"
              data-ocid="nav.openleadlake.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/open-lead-lake"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Database size={16} />
              Open Lead Lake
            </Link>
            <Link
              to="/csv-lead-import"
              data-ocid="nav.csvleadimport.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/csv-lead-import"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <FileUp size={16} />
              Lead Import
            </Link>
            <Link
              to="/website-studio"
              data-ocid="nav.websitestudio.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/website-studio"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Globe size={16} />
              Website Studio
            </Link>
            <Link
              to="/campaigns"
              data-ocid="nav.coldemailhub.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/campaigns"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Mail size={16} />
              Cold Email Hub
            </Link>
            <Link
              to="/drip-campaigns"
              data-ocid="nav.dripcampaigns.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/drip-campaigns"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Send size={16} />
              CRM Drip Sender
            </Link>
            <Link
              to="/admin/roofing-automations"
              data-ocid="nav.roofingautomations.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/roofing-automations"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Hammer size={16} />
              Roofing Automations
            </Link>
            <Link
              to="/admin/roofing-campaign"
              data-ocid="nav.roofingcampaign.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/roofing-campaign"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Mail size={16} />
              Roofing Campaign
            </Link>
            <Link
              to="/health-dashboard"
              data-ocid="nav.healthdashboard.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/health-dashboard"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Heart size={16} />
              <span className="flex-1">Health Dashboard</span>
              {atRiskCount > 0 && (
                <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {atRiskCount}
                </span>
              )}
            </Link>
            <Link
              to="/autopilot-dashboard"
              data-ocid="nav.autopilotdashboard.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/autopilot-dashboard"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <GitBranch size={16} />
              <span className="flex-1">Autopilot Pipeline</span>
            </Link>
            <Link
              to="/admin/brf-voice-agent"
              data-ocid="nav.brfvoiceagent.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/brf-voice-agent"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Sparkles size={16} />
              <span className="flex-1">BRF Voice Agent</span>
            </Link>
            <Link
              to="/ai-lead-intelligence"
              data-ocid="nav.aileadintelligence.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/ai-lead-intelligence"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Brain size={16} />
              <span className="flex-1">AI Lead Intelligence</span>
            </Link>
            <Link
              to="/agent-orchestration"
              data-ocid="nav.agentorchestration.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/agent-orchestration"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Cpu size={16} />
              <span className="flex-1">Agent Orchestration</span>
            </Link>

            <Link
              to="/admin/mcp-toolkit"
              data-ocid="nav.mcptoolkit.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/mcp-toolkit"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Wrench size={16} />
              MCP Toolkit
            </Link>
            <Link
              to="/admin/account-brief"
              data-ocid="nav.accountbrief.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/account-brief"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <ClipboardList size={16} />
              Account Brief
            </Link>

            {/* ─── AI BRAIN ─────────────────────────────────── */}
            <p className="text-[10px] font-semibold text-violet-500/80 uppercase tracking-wider px-2 mt-3 mb-1">
              AI BRAIN
            </p>
            <Link
              to="/admin/ai-providers"
              data-ocid="nav.aiproviders.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/ai-providers"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <BrainCircuit size={16} />
              <span className="flex-1">AI Providers</span>
            </Link>
            <Link
              to="/admin/knowledge-collections"
              data-ocid="nav.knowledgecollections.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/knowledge-collections"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Database size={16} />
              <span className="flex-1">Knowledge Collections</span>
            </Link>
            <Link
              to="/admin/rag-tester"
              data-ocid="nav.ragtester.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/rag-tester"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <FlaskConical size={16} />
              <span className="flex-1">RAG Tester</span>
            </Link>
            <Link
              to="/admin/agent-workflows"
              data-ocid="nav.agentworkflows.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/agent-workflows"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <GitPullRequestArrow size={16} />
              <span className="flex-1">Agent Workflows</span>
            </Link>
            <Link
              to="/admin/workflow-library"
              data-ocid="nav.workflowlibrary.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/workflow-library"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Workflow size={16} />
              <span className="flex-1">Workflow Library</span>
            </Link>
            <Link
              to="/admin/n8n-integration-docs"
              data-ocid="nav.n8nintegrationdocs.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/n8n-integration-docs"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <BookOpen size={16} />
              <span className="flex-1">Integration Docs</span>
            </Link>
            <Link
              to="/admin/ai-usage-logs"
              data-ocid="nav.aiusagelogs.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/ai-usage-logs"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <BarChart2 size={16} />
              <span className="flex-1">AI Usage</span>
            </Link>
            <Link
              to="/admin/vector-index"
              data-ocid="nav.vectorindex.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/vector-index"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <DatabaseZap size={16} />
              <span className="flex-1">Vector Index</span>
            </Link>
            <Link
              to="/admin/client-ai-manager"
              data-ocid="nav.clientaimanager.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/admin/client-ai-manager"
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              }`}
            >
              <Users size={16} />
              <span className="flex-1">Client AI Manager</span>
            </Link>
          </div>
        )}

        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">
              {group.label}
            </p>
            {group.items.map(({ label, path, icon: Icon }) => {
              const active = pathname === path;
              const isSmsInbox = path === "/sms-inbox";
              return (
                <Link
                  key={path}
                  to={path}
                  data-ocid={`nav.${label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                    active
                      ? "bg-indigo-600/80 text-white border border-indigo-500/40"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={16}
                    className={active ? "text-indigo-300" : "text-slate-500"}
                  />
                  <span className="flex-1">{label}</span>
                  {isSmsInbox && smsUnreadCount > 0 && (
                    <span className="w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                      {smsUnreadCount > 9 ? "9+" : smsUnreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* 3D Scanner — only visible for supported niches when enabled */}
        {show3dScanner && (
          <div className="mb-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-1">
              3D SCANNER
            </p>
            <Link
              to="/scanner-3d"
              data-ocid="nav.scanner3d.link"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm mb-0.5 transition-colors ${
                pathname === "/scanner-3d"
                  ? "bg-indigo-600/80 text-white border border-indigo-500/40"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Box
                size={16}
                className={
                  pathname === "/scanner-3d"
                    ? "text-indigo-300"
                    : "text-slate-500"
                }
              />
              <span className="flex-1">3D Property Scanner</span>
              <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Link>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-white/8 space-y-2">
        <button
          type="button"
          data-ocid="nav.ai.button"
          onClick={() => setAiPanelOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-indigo-900/60 hover:bg-indigo-700/80 text-indigo-300 hover:text-white transition-colors border border-indigo-700/40"
        >
          <Sparkles size={15} className="text-indigo-400" />
          <span className="text-xs font-medium">AI Business Manager</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {isDemoMode && demoInfo ? demoInfo.firstName : currentUser?.name}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {isDemoMode
                ? "Demo User"
                : currentUser?.isAdminUser
                  ? "Super Admin"
                  : currentUser?.role}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="nav.logout.button"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Demo Mode Banner */}
      {isDemoMode && !demoBannerDismissed && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 flex items-center justify-between flex-shrink-0 z-[999]">
          <div className="flex items-center gap-2 text-sm">
            <Rocket size={14} className="text-purple-200 shrink-0" />
            <span className="font-medium">Demo Mode</span>
            <span className="text-purple-200 hidden sm:inline">
              — You're exploring a live simulation for{" "}
              <strong className="text-white">{demoInfo?.businessName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="text-xs bg-white text-purple-700 font-semibold px-3 py-1 rounded-full hover:bg-purple-50 transition-colors whitespace-nowrap"
            >
              Activate for My Business
            </Link>
            <button
              type="button"
              onClick={() => setDemoBannerDismissed(true)}
              className="text-purple-200 hover:text-white"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar — hidden when in editor mode (auto-collapsed) */}
        <aside
          className={`hidden md:flex flex-shrink-0 sidebar-dark flex-col border-r border-white/8 transition-all duration-300 overflow-hidden ${
            sidebarCollapsed ? "w-0 border-r-0" : "w-56"
          }`}
        >
          {!sidebarCollapsed && <SidebarContent />}
        </aside>

        {/* Editor mode: expand sidebar toggle button */}
        {sidebarCollapsed && (
          <button
            type="button"
            title="Expand sidebar"
            data-ocid="nav.expand_sidebar.button"
            onClick={() => setSidebarManuallyExpanded(true)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-5 h-12 rounded-r-lg bg-card/90 border border-white/10 border-l-0 hover:bg-card text-muted-foreground hover:text-foreground transition-colors shadow-md"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[999] flex">
            <button
              type="button"
              aria-label="Close sidebar"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full h-full cursor-default border-0"
              onClick={closeSidebar}
            />
            <aside className="relative z-10 w-64 flex-shrink-0 sidebar-dark flex flex-col h-full shadow-2xl border-r border-white/8">
              <SidebarContent />
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="header-dark px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-ocid="nav.menu.button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-white/10 text-slate-300"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-base font-semibold text-white">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && !isDemoMode ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    data-ocid="nav.tenant.select"
                    className="flex items-center gap-1.5 text-sm bg-white/8 px-3 py-1.5 rounded-md hover:bg-white/12 transition-colors text-slate-200 border border-white/10"
                  >
                    <span className="font-medium max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-slate-900 border-white/10"
                  >
                    {tenants
                      .filter((t) => t.id !== "tenant-demo")
                      .map((t) => (
                        <DropdownMenuItem
                          key={t.id}
                          onClick={() => setCurrentTenantId(t.id)}
                          className="text-slate-200 hover:text-white focus:text-white"
                        >
                          {t.name}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-sm text-slate-300 font-medium max-w-[140px] truncate hidden sm:block">
                  {displayName}
                </span>
              )}

              {/* Notification Bell */}
              {/* ── Top-Right Quick Navigation Dropdown ── */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  data-ocid="nav.quicknav.toggle"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 transition-all duration-200 text-slate-200 hover:text-white min-h-[36px]"
                  aria-label="Navigation menu"
                >
                  {/* Role badge dot */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isDemoMode
                        ? "bg-amber-400"
                        : currentUser?.isAdminUser
                          ? "bg-purple-400"
                          : currentUser?.role === "agency"
                            ? "bg-violet-400"
                            : "bg-indigo-400"
                    }`}
                  />
                  <span className="text-xs font-semibold hidden sm:block">
                    {isDemoMode
                      ? "Demo"
                      : currentUser?.isAdminUser
                        ? "Admin"
                        : currentUser?.role === "agency"
                          ? "Agency"
                          : "Client"}
                  </span>
                  <LayoutGrid size={14} className="text-slate-400" />
                  <ChevronDown size={12} className="text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-64 p-0 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  data-ocid="nav.quicknav.dropdown_menu"
                >
                  {/* User identity row */}
                  <div className="px-4 py-3 border-b border-white/8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shrink-0">
                      <User size={14} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {isDemoMode && demoInfo
                          ? demoInfo.firstName
                          : currentUser?.name}
                      </p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {isDemoMode
                          ? "Demo Mode"
                          : currentUser?.isAdminUser
                            ? "Super Admin"
                            : currentUser?.role}
                      </p>
                    </div>
                  </div>

                  {/* Quick Nav group */}
                  <div className="px-3 pt-2.5 pb-0.5">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                      Quick Nav
                    </p>
                  </div>
                  {[
                    {
                      label: "Dashboard",
                      href: "/dashboard",
                      Icon: LayoutDashboard,
                    },
                    { label: "CRM & Leads", href: "/leads", Icon: Users },
                    {
                      label: "Lead Lake",
                      href: "/open-lead-lake",
                      Icon: Database,
                    },
                    {
                      label: "AI Lead Intelligence",
                      href: "/ai-lead-intelligence",
                      Icon: Brain,
                    },
                    { label: "Campaigns", href: "/campaigns", Icon: Megaphone },
                    {
                      label: "Social Media",
                      href: "/social-media",
                      Icon: Share2,
                    },
                    {
                      label: "Reputation",
                      href: "/reputation-inbox",
                      Icon: Star,
                    },
                    { label: "Analytics", href: "/analytics", Icon: BarChart3 },
                    {
                      label: "Go Live Dashboard",
                      href: "/go-live",
                      Icon: Rocket,
                    },
                  ].map(({ label, href, Icon }) => (
                    <Link
                      key={href}
                      to={href as any}
                      data-ocid={`nav.quicknav.${label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-colors group"
                    >
                      <Icon
                        size={13}
                        className="text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white">
                        {label}
                      </span>
                    </Link>
                  ))}

                  {/* Admin Tools — only for admin users */}
                  {isAdminUser && (
                    <>
                      <div className="border-t border-white/8 px-3 pt-2.5 pb-0.5 mt-1">
                        <p className="text-[10px] font-semibold text-amber-500/80 uppercase tracking-widest">
                          Admin Tools
                        </p>
                      </div>
                      {[
                        {
                          label: "Admin Panel",
                          href: "/admin",
                          Icon: ShieldCheck,
                        },
                        {
                          label: "Autopilot Pipeline",
                          href: "/autopilot-dashboard",
                          Icon: GitBranch,
                        },
                        {
                          label: "Agent Workflow OS",
                          href: "/agent-workflow-os",
                          Icon: Cpu,
                        },
                        {
                          label: "White-Label Hub",
                          href: "/white-label-hub",
                          Icon: Palette,
                        },
                      ].map(({ label, href, Icon }) => (
                        <Link
                          key={href}
                          to={href as any}
                          data-ocid={`nav.quicknav.admin.${label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-amber-500/5 transition-colors group"
                        >
                          <Icon
                            size={13}
                            className="text-amber-600 group-hover:text-amber-400 transition-colors shrink-0"
                          />
                          <span className="text-sm text-slate-300 group-hover:text-amber-300">
                            {label}
                          </span>
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Account group */}
                  <div className="border-t border-white/8 px-3 pt-2.5 pb-0.5 mt-1">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                      Account
                    </p>
                  </div>
                  {[
                    { label: "Settings", href: "/settings", Icon: Settings },
                    { label: "Billing", href: "/billing", Icon: CreditCard },
                  ].map(({ label, href, Icon }) => (
                    <Link
                      key={href}
                      to={href as any}
                      data-ocid={`nav.quicknav.account.${label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 transition-colors group"
                    >
                      <Icon
                        size={13}
                        className="text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-white">
                        {label}
                      </span>
                    </Link>
                  ))}

                  {/* Logout */}
                  <div className="border-t border-white/8 mt-1 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      data-ocid="nav.quicknav.logout.button"
                      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors group text-left"
                    >
                      <LogOut
                        size={13}
                        className="text-slate-500 group-hover:text-red-400 transition-colors shrink-0"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-red-400">
                        Log Out
                      </span>
                    </button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    data-ocid="notifications.bell"
                    className="relative p-2 rounded-md hover:bg-white/8 text-slate-300 hover:text-white transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0 bg-slate-900 border-white/10"
                  data-ocid="notifications.popover"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        data-ocid="notifications.mark_all_read"
                        onClick={markAllRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <ScrollArea className="max-h-80">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-400">
                        No notifications
                      </div>
                    ) : (
                      <div>
                        {notifications.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => markRead(n.id)}
                            className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                          >
                            <div className="mt-0.5 shrink-0">
                              {TYPE_ICONS[n.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-semibold text-white">
                                  {n.title}
                                </p>
                                {!n.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 truncate">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {n.time}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <main
            ref={mainScrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 bg-background"
          >
            {children}
          </main>

          {/* Caffeine attribution — subtle, always visible for logged-in users */}
          <footer className="flex-shrink-0 flex items-center justify-center py-1.5 px-4 border-t border-white/5 bg-background">
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
            >
              Powered by Caffeine AI — caffeine.ai
            </a>
          </footer>
        </div>
      </div>

      {/* AI Business Manager Panel */}
      <AiBusinessManagerPanel />
    </div>
  );
}
