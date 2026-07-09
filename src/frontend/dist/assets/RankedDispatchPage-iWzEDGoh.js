import { r as reactExports, j as jsxRuntimeExports, a1 as Search, b7 as MapPin, bF as Star, an as Building2, am as Globe, c2 as ClipboardList, T as TrendingUp, bm as Target, C as ChartColumn, aD as ChevronRight, aZ as Link, S as Send, b8 as MessageSquare } from "./index-Dwzp0QDY.js";
const DISPATCH_ROUTES = [
  {
    label: "Audit Local Presence",
    description: "Run a full local SEO audit to find ranking gaps.",
    icon: Search,
    path: "/local-seo-audit",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30"
  },
  {
    label: "Why Not in Map Pack?",
    description: "Diagnose why you're not showing in the local map pack.",
    icon: MapPin,
    path: "/local-seo-audit",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  },
  {
    label: "Get More Reviews",
    description: "Launch review request campaigns and track velocity.",
    icon: Star,
    path: "/review-management",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  {
    label: "Optimize GBP",
    description: "Audit and optimize your Google Business Profile.",
    icon: Building2,
    path: "/gbp-post-drafts",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  {
    label: "Need Landing Pages",
    description: "Plan city and service area landing pages.",
    icon: Globe,
    path: "/landing-pages",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30"
  },
  {
    label: "Fix Citations",
    description: "Run a citation and NAP consistency audit.",
    icon: ClipboardList,
    path: "/local-seo-audit",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30"
  },
  {
    label: "Run Ranking Scan",
    description: "Monitor local keyword rankings weekly.",
    icon: TrendingUp,
    path: "/local-ranking-intelligence",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30"
  },
  {
    label: "Competitor Analysis",
    description: "See what competitors are doing locally.",
    icon: Target,
    path: "/competitive-intel",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  },
  {
    label: "Build Report",
    description: "Generate a monthly local SEO client report.",
    icon: ChartColumn,
    path: "/reports",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  {
    label: "Service Area SEO",
    description: "Optimize for service-area businesses.",
    icon: MapPin,
    path: "/local-seo-audit",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  }
];
const SCHEDULED_TASKS = [
  {
    task: "GBP Post Drafts",
    frequency: "Weekly",
    tier: "Tier 2",
    status: "active"
  },
  {
    task: "Review Response Drafts",
    frequency: "Weekly",
    tier: "Tier 2",
    status: "active"
  },
  {
    task: "Citation Audit",
    frequency: "Quarterly",
    tier: "Tier 1",
    status: "idle"
  },
  {
    task: "Page Content Audit",
    frequency: "Quarterly",
    tier: "Tier 2",
    status: "idle"
  },
  {
    task: "Rankings Monitor",
    frequency: "Weekly",
    tier: "Tier 1",
    status: "active"
  },
  {
    task: "Review Velocity Monitor",
    frequency: "Weekly",
    tier: "Tier 1",
    status: "active"
  },
  {
    task: "GBP Change Monitor",
    frequency: "Daily",
    tier: "Tier 1",
    status: "active"
  },
  {
    task: "AI Visibility Monitor",
    frequency: "Monthly",
    tier: "Tier 1",
    status: "idle"
  }
];
function RankedDispatchPage() {
  const [selectedRoute, setSelectedRoute] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Ranked Dispatch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Route local SEO tasks to the right agent. Load only what you need." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-emerald-400", children: "3 Agents Active" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4", children: DISPATCH_ROUTES.map((route) => {
      const Icon = route.icon;
      const isSelected = selectedRoute === route.label;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `ranked.dispatch.${route.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.button`,
          onClick: () => setSelectedRoute(isSelected ? null : route.label),
          className: `relative p-4 rounded-lg border text-left transition-all duration-200 ${isSelected ? `${route.bgColor} ${route.borderColor} ring-1 ring-offset-0 ring-offset-transparent` : "bg-[oklch(0.14_0.014_280)] border-white/[0.08] hover:border-white/[0.15] hover:bg-[oklch(0.16_0.015_280)]"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-md ${route.bgColor}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18, className: route.color }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronRight,
                {
                  size: 14,
                  className: `transition-transform ${isSelected ? "rotate-90" : ""} text-slate-500`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white mb-1", children: route.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 leading-relaxed", children: route.description }),
            isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-white/[0.08]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: route.path,
                "data-ocid": `ranked.dispatch.${route.label.toLowerCase().replace(/[^a-z0-9]/g, "")}.link`,
                className: "inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-indigo-300 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 12 }),
                  "Open Agent"
                ]
              }
            ) })
          ]
        },
        route.label
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Scheduled Workflows" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: "Managed by n8n timer triggers" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/[0.08] text-xs font-semibold text-slate-400 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-4", children: "Task" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: "Frequency" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: "Tier" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: "Status" })
        ] }),
        SCHEDULED_TASKS.map((task, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `ranked.task.${index + 1}.row`,
            className: "grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-4 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 14, className: "text-slate-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white", children: task.task })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300", children: task.frequency }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex px-2 py-0.5 rounded text-xs font-medium ${task.tier === "Tier 1" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"}`,
                  children: task.tier
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-2 h-2 rounded-full ${task.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300 capitalize", children: task.status })
              ] })
            ]
          },
          task.task
        ))
      ] })
    ] })
  ] });
}
export {
  RankedDispatchPage as default
};
