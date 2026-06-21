import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Building2,
  ChevronRight,
  ClipboardList,
  Globe,
  MapPin,
  MessageSquare,
  Search,
  Send,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const DISPATCH_ROUTES = [
  {
    label: "Audit Local Presence",
    description: "Run a full local SEO audit to find ranking gaps.",
    icon: Search,
    path: "/local-seo-audit",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    label: "Why Not in Map Pack?",
    description: "Diagnose why you're not showing in the local map pack.",
    icon: MapPin,
    path: "/local-seo-audit",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    label: "Get More Reviews",
    description: "Launch review request campaigns and track velocity.",
    icon: Star,
    path: "/review-management",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    label: "Optimize GBP",
    description: "Audit and optimize your Google Business Profile.",
    icon: Building2,
    path: "/gbp-post-drafts",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    label: "Need Landing Pages",
    description: "Plan city and service area landing pages.",
    icon: Globe,
    path: "/landing-pages",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
  },
  {
    label: "Fix Citations",
    description: "Run a citation and NAP consistency audit.",
    icon: ClipboardList,
    path: "/local-seo-audit",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  {
    label: "Run Ranking Scan",
    description: "Monitor local keyword rankings weekly.",
    icon: TrendingUp,
    path: "/local-ranking-intelligence",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    label: "Competitor Analysis",
    description: "See what competitors are doing locally.",
    icon: Target,
    path: "/competitive-intel",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    label: "Build Report",
    description: "Generate a monthly local SEO client report.",
    icon: BarChart3,
    path: "/reports",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    label: "Service Area SEO",
    description: "Optimize for service-area businesses.",
    icon: MapPin,
    path: "/local-seo-audit",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
];

const SCHEDULED_TASKS = [
  {
    task: "GBP Post Drafts",
    frequency: "Weekly",
    tier: "Tier 2",
    status: "active",
  },
  {
    task: "Review Response Drafts",
    frequency: "Weekly",
    tier: "Tier 2",
    status: "active",
  },
  {
    task: "Citation Audit",
    frequency: "Quarterly",
    tier: "Tier 1",
    status: "idle",
  },
  {
    task: "Page Content Audit",
    frequency: "Quarterly",
    tier: "Tier 2",
    status: "idle",
  },
  {
    task: "Rankings Monitor",
    frequency: "Weekly",
    tier: "Tier 1",
    status: "active",
  },
  {
    task: "Review Velocity Monitor",
    frequency: "Weekly",
    tier: "Tier 1",
    status: "active",
  },
  {
    task: "GBP Change Monitor",
    frequency: "Daily",
    tier: "Tier 1",
    status: "active",
  },
  {
    task: "AI Visibility Monitor",
    frequency: "Monthly",
    tier: "Tier 1",
    status: "idle",
  },
];

export default function RankedDispatchPage() {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Ranked Dispatch</h1>
          <p className="text-sm text-slate-400 mt-1">
            Route local SEO tasks to the right agent. Load only what you need.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">
              3 Agents Active
            </span>
          </div>
        </div>
      </div>

      {/* Dispatch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {DISPATCH_ROUTES.map((route) => {
          const Icon = route.icon;
          const isSelected = selectedRoute === route.label;
          return (
            <button
              key={route.label}
              type="button"
              data-ocid={`ranked.dispatch.${route.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.button`}
              onClick={() => setSelectedRoute(isSelected ? null : route.label)}
              className={`relative p-4 rounded-lg border text-left transition-all duration-200 ${
                isSelected
                  ? `${route.bgColor} ${route.borderColor} ring-1 ring-offset-0 ring-offset-transparent`
                  : "bg-[oklch(0.14_0.014_280)] border-white/[0.08] hover:border-white/[0.15] hover:bg-[oklch(0.16_0.015_280)]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-md ${route.bgColor}`}>
                  <Icon size={18} className={route.color} />
                </div>
                <ChevronRight
                  size={14}
                  className={`transition-transform ${isSelected ? "rotate-90" : ""} text-slate-500`}
                />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {route.label}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {route.description}
              </p>
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-white/[0.08]">
                  <Link
                    to={route.path}
                    data-ocid={`ranked.dispatch.${route.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-indigo-300 transition-colors"
                  >
                    <Send size={12} />
                    Open Agent
                  </Link>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Scheduled Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Scheduled Workflows
          </h2>
          <span className="text-xs text-slate-500">
            Managed by n8n timer triggers
          </span>
        </div>
        <div className="bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/[0.08] text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Task</div>
            <div className="col-span-3">Frequency</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-3">Status</div>
          </div>
          {SCHEDULED_TASKS.map((task, index) => (
            <div
              key={task.task}
              data-ocid={`ranked.task.${index + 1}.row`}
              className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors"
            >
              <div className="col-span-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-slate-500" />
                <span className="text-sm text-white">{task.task}</span>
              </div>
              <div className="col-span-3">
                <span className="text-sm text-slate-300">{task.frequency}</span>
              </div>
              <div className="col-span-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    task.tier === "Tier 1"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {task.tier}
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    task.status === "active"
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-slate-500"
                  }`}
                />
                <span className="text-sm text-slate-300 capitalize">
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
