import { ad as useActor, r as reactExports, j as jsxRuntimeExports, U as Users, a1 as Search, aq as ShieldCheck, aa as ExternalLink, aQ as ue } from "./index-CSMRpKtY.js";
const TIER_COLORS = {
  Basic: "bg-slate-800/60 text-slate-300 border-slate-600/30",
  Pro: "bg-blue-900/50 text-blue-300 border-blue-500/30",
  Agency: "bg-violet-900/50 text-violet-300 border-violet-500/30"
};
function TierBadge({ tier }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `px-2 py-0.5 rounded-full text-xs font-medium border ${TIER_COLORS[tier]}`,
      children: tier
    }
  );
}
function ActivityDot({ activity }) {
  const isRecent = activity.includes("minute") || activity.includes("hour");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `w-1.5 h-1.5 rounded-full shrink-0 ${isRecent ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: activity })
  ] });
}
function AIToggle({
  enabled,
  onChange,
  clientId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onChange(clientId, !enabled),
      className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${enabled ? "bg-violet-500" : "bg-white/10"}`,
      role: "switch",
      "aria-checked": enabled,
      "data-ocid": `client_ai_manager.ai_toggle.${clientId}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-4" : "translate-x-1"}`
        }
      )
    }
  );
}
function SummaryBar({ clients }) {
  const enabled = clients.filter((c) => c.aiEnabled).length;
  const totalCalls = clients.reduce((s, c) => s + c.aiCallsThisMonth, 0);
  const totalDocs = clients.reduce((s, c) => s + c.knowledgeDocs, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
    {
      label: "Total Clients",
      value: clients.length,
      color: "text-foreground"
    },
    {
      label: "AI Enabled",
      value: enabled,
      color: "text-violet-300"
    },
    {
      label: "Total AI Calls (mo)",
      value: totalCalls.toLocaleString(),
      color: "text-cyan-300"
    },
    {
      label: "Total Knowledge Docs",
      value: totalDocs,
      color: "text-emerald-300"
    }
  ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-white/10 bg-card p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 font-medium", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold mt-0.5 ${color}`, children: value })
      ]
    },
    label
  )) });
}
function AdminClientAIManagerPage() {
  const { actor, isFetching } = useActor();
  const [clients, setClients] = reactExports.useState(SAMPLE_CLIENTS);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [tierFilter, setTierFilter] = reactExports.useState("all");
  const [activityFilter, setActivityFilter] = reactExports.useState("all");
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    actor.getAIUsageLogs("admin").then(() => {
      setClients(SAMPLE_CLIENTS);
    }).catch(() => setClients(SAMPLE_CLIENTS)).finally(() => setLoading(false));
  }, [actor, isFetching]);
  const filtered = reactExports.useMemo(() => {
    return clients.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (tierFilter !== "all" && c.tier !== tierFilter) return false;
      if (activityFilter === "active" && !c.aiEnabled) return false;
      if (activityFilter === "inactive" && c.aiEnabled) return false;
      return true;
    });
  }, [clients, search, tierFilter, activityFilter]);
  function toggleAI(id, value) {
    var _a;
    setClients(
      (prev) => prev.map((c) => c.id === id ? { ...c, aiEnabled: value } : c)
    );
    ue.success(
      `AI ${value ? "enabled" : "disabled"} for ${(_a = clients.find((c) => c.id === id)) == null ? void 0 : _a.name}`
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background p-6 space-y-6",
      "data-ocid": "client_ai_manager.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 20, className: "text-violet-400" }),
            "Client AI Manager"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage AI access and monitor usage across all client accounts." })
        ] }),
        !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryBar, { clients }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-xl border border-white/10 bg-card p-4",
            "data-ocid": "client_ai_manager.filters.section",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-start md:items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Search,
                  {
                    size: 13,
                    className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search by client name…",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    className: "w-full rounded-lg bg-white/5 border border-white/10 text-sm text-foreground pl-8 pr-3 py-1.5 focus:outline-none focus:border-violet-500/50",
                    "data-ocid": "client_ai_manager.search_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: tierFilter,
                  onChange: (e) => setTierFilter(e.target.value),
                  className: "rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50",
                  "data-ocid": "client_ai_manager.tier.select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Tiers" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Basic", children: "Basic" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pro", children: "Pro" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Agency", children: "Agency" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: activityFilter,
                  onChange: (e) => setActivityFilter(e.target.value),
                  className: "rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50",
                  "data-ocid": "client_ai_manager.activity.select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Accounts" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "active", children: "AI Enabled" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "inactive", children: "AI Disabled" })
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-white/10 bg-card overflow-hidden",
            "data-ocid": "client_ai_manager.table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-white/8 bg-white/3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Client" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Plan" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-semibold text-slate-400 px-4 py-3", children: "AI Calls (mo)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-semibold text-slate-400 px-4 py-3", children: "Docs" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Last Activity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center text-xs font-semibold text-slate-400 px-4 py-3", children: "AI Access" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Docs" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? [1, 2, 3, 4, 5, 6].map((rowNum) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "tr",
                  {
                    className: "border-b border-white/5 animate-pulse",
                    "data-ocid": `client_ai_manager.loading_state.${rowNum}`,
                    children: [1, 2, 3, 4, 5, 6, 7].map((cellNum) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-4 py-3",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-white/8 rounded w-20" })
                      },
                      `skeleton-cell-${rowNum}-${cellNum}`
                    ))
                  },
                  `skeleton-row-${rowNum}`
                )) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    colSpan: 7,
                    className: "text-center py-12 text-slate-500",
                    "data-ocid": "client_ai_manager.empty_state",
                    children: "No clients match the current filters."
                  }
                ) }) : filtered.map((client, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-white/5 hover:bg-white/3 transition-colors",
                    "data-ocid": `client_ai_manager.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-violet-300", children: client.name[0] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: client.name })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: client.tier }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm text-slate-300", children: client.aiCallsThisMonth.toLocaleString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-sm text-slate-300", children: client.knowledgeDocs }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityDot, { activity: client.lastAIActivity }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AIToggle,
                        {
                          enabled: client.aiEnabled,
                          onChange: toggleAI,
                          clientId: client.id
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "a",
                        {
                          href: "/admin/knowledge-base",
                          className: "flex items-center gap-1 text-xs text-slate-400 hover:text-violet-400 transition-colors",
                          "data-ocid": `client_ai_manager.view_docs.${i + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12 }),
                            "View",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 10 })
                          ]
                        }
                      ) })
                    ]
                  },
                  client.id
                )) })
              ] }) }),
              !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 border-t border-white/8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
                "Showing ",
                filtered.length,
                " of ",
                clients.length,
                " clients"
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
const SAMPLE_CLIENTS = [
  {
    id: "c1",
    name: "Atlas Roofing",
    tier: "Agency",
    aiCallsThisMonth: 1842,
    knowledgeDocs: 23,
    lastAIActivity: "12 minutes ago",
    aiEnabled: true
  },
  {
    id: "c2",
    name: "ClearView HVAC",
    tier: "Pro",
    aiCallsThisMonth: 630,
    knowledgeDocs: 11,
    lastAIActivity: "2 hours ago",
    aiEnabled: true
  },
  {
    id: "c3",
    name: "Summit Med Spa",
    tier: "Pro",
    aiCallsThisMonth: 415,
    knowledgeDocs: 8,
    lastAIActivity: "1 day ago",
    aiEnabled: true
  },
  {
    id: "c4",
    name: "Apex Restoration",
    tier: "Agency",
    aiCallsThisMonth: 2100,
    knowledgeDocs: 31,
    lastAIActivity: "5 minutes ago",
    aiEnabled: true
  },
  {
    id: "c5",
    name: "Riverside Dental",
    tier: "Basic",
    aiCallsThisMonth: 88,
    knowledgeDocs: 4,
    lastAIActivity: "3 days ago",
    aiEnabled: false
  },
  {
    id: "c6",
    name: "GoldKey Real Estate",
    tier: "Pro",
    aiCallsThisMonth: 720,
    knowledgeDocs: 16,
    lastAIActivity: "4 hours ago",
    aiEnabled: true
  },
  {
    id: "c7",
    name: "PrimeClean Carpets",
    tier: "Basic",
    aiCallsThisMonth: 52,
    knowledgeDocs: 2,
    lastAIActivity: "1 week ago",
    aiEnabled: false
  },
  {
    id: "c8",
    name: "Meridian Mortgage",
    tier: "Pro",
    aiCallsThisMonth: 540,
    knowledgeDocs: 9,
    lastAIActivity: "6 hours ago",
    aiEnabled: true
  }
];
export {
  AdminClientAIManagerPage as default
};
