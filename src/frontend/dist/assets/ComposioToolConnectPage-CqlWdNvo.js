import { c as createLucideIcon, ad as useActor, r as reactExports, m as Mail, bl as Calendar, c3 as CreditCard, c4 as Camera, b8 as MessageSquare, ao as Phone, F as FileText, U as Users, am as Globe, af as Zap, C as ChartColumn, an as Building2, aQ as ue, j as jsxRuntimeExports, c5 as Plug, ae as Shield, B as Button, al as RefreshCw, aA as CircleCheck, d as TriangleAlert, as as Badge, ak as CircleX, aa as ExternalLink } from "./index-Dwzp0QDY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" }]
];
const Bookmark = createLucideIcon("bookmark", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2", key: "wrbu53" }],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i"
    }
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }]
];
const Truck = createLucideIcon("truck", __iconNode);
const TOOLS = [
  {
    id: "gmail",
    name: "Gmail",
    category: "Communication",
    description: "Read, draft, and send emails autonomously via your AI agent.",
    icon: Mail,
    color: "border-red-500/30 bg-red-500/10",
    dotColor: "bg-red-400",
    connected: false,
    scope: "personal",
    actions: ["Read inbox", "Draft replies", "Send emails", "Flag priority"]
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Scheduling",
    description: "Book appointments, check availability, and send reminders.",
    icon: Calendar,
    color: "border-blue-500/30 bg-blue-500/10",
    dotColor: "bg-blue-400",
    connected: false,
    scope: "personal",
    actions: [
      "Book meetings",
      "Check availability",
      "Send reminders",
      "Block time"
    ]
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description: "Send invoices, track payments, and trigger follow-ups on unpaid bills.",
    icon: CreditCard,
    color: "border-violet-500/30 bg-violet-500/10",
    dotColor: "bg-violet-400",
    connected: false,
    scope: "team",
    actions: [
      "Send invoices",
      "Track payments",
      "Trigger follow-ups",
      "Create subscriptions"
    ]
  },
  {
    id: "companycam",
    name: "CompanyCam",
    category: "Field Operations",
    description: "Pull job site photos into estimates and proposals automatically.",
    icon: Camera,
    color: "border-amber-500/30 bg-amber-500/10",
    dotColor: "bg-amber-400",
    connected: false,
    scope: "team",
    actions: [
      "Pull photos",
      "Auto-tag projects",
      "Link to estimates",
      "Share galleries"
    ]
  },
  {
    id: "twilio",
    name: "Twilio SMS",
    category: "Communication",
    description: "Send and receive SMS messages, auto-respond to inbound texts.",
    icon: MessageSquare,
    color: "border-emerald-500/30 bg-emerald-500/10",
    dotColor: "bg-emerald-400",
    connected: false,
    scope: "team",
    actions: ["Send SMS", "Auto-respond", "Two-way chat", "Schedule texts"]
  },
  {
    id: "vapi",
    name: "Vapi.ai",
    category: "Voice",
    description: "Deploy and manage AI voice agents for inbound and outbound calls.",
    icon: Phone,
    color: "border-sky-500/30 bg-sky-500/10",
    dotColor: "bg-sky-400",
    connected: false,
    scope: "team",
    actions: [
      "Deploy agents",
      "Manage calls",
      "Log transcripts",
      "Book appointments"
    ]
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    category: "Accounting",
    description: "Sync invoices, track expenses, and flag outstanding balances.",
    icon: FileText,
    color: "border-green-500/30 bg-green-500/10",
    dotColor: "bg-green-400",
    connected: false,
    scope: "team",
    actions: [
      "Sync invoices",
      "Track expenses",
      "Flag balances",
      "Generate reports"
    ]
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "E-Commerce",
    description: "Track orders, manage inventory, and trigger fulfillment workflows.",
    icon: ShoppingCart,
    color: "border-teal-500/30 bg-teal-500/10",
    dotColor: "bg-teal-400",
    connected: false,
    scope: "team",
    actions: [
      "Track orders",
      "Manage inventory",
      "Trigger workflows",
      "Customer alerts"
    ]
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "Two-way sync leads, opportunities, and account data with BRF.",
    icon: Users,
    color: "border-indigo-500/30 bg-indigo-500/10",
    dotColor: "bg-indigo-400",
    connected: false,
    scope: "team",
    actions: [
      "Sync leads",
      "Update opportunities",
      "Log activities",
      "Map fields"
    ]
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Push BRF leads into HubSpot sequences and track engagement.",
    icon: Globe,
    color: "border-orange-500/30 bg-orange-500/10",
    dotColor: "bg-orange-400",
    connected: false,
    scope: "team",
    actions: [
      "Push leads",
      "Track engagement",
      "Sync sequences",
      "Score leads"
    ]
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Send alerts, daily digests, and priority notifications to your team.",
    icon: Zap,
    color: "border-purple-500/30 bg-purple-500/10",
    dotColor: "bg-purple-400",
    connected: false,
    scope: "team",
    actions: [
      "Send alerts",
      "Daily digests",
      "Priority pings",
      "Channel posts"
    ]
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    description: "Log meeting notes, create project pages, and sync task lists.",
    icon: Bookmark,
    color: "border-gray-500/30 bg-gray-500/10",
    dotColor: "bg-gray-400",
    connected: false,
    scope: "personal",
    actions: ["Log notes", "Create pages", "Sync tasks", "Link databases"]
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    category: "Analytics",
    description: "Pull traffic data, conversion rates, and campaign performance.",
    icon: ChartColumn,
    color: "border-yellow-500/30 bg-yellow-500/10",
    dotColor: "bg-yellow-400",
    connected: false,
    scope: "team",
    actions: [
      "Pull traffic",
      "Track conversions",
      "Campaign reports",
      "Audience insights"
    ]
  },
  {
    id: "shipstation",
    name: "ShipStation",
    category: "Logistics",
    description: "Sync shipping labels, track deliveries, and alert customers.",
    icon: Truck,
    color: "border-cyan-500/30 bg-cyan-500/10",
    dotColor: "bg-cyan-400",
    connected: false,
    scope: "team",
    actions: ["Sync labels", "Track deliveries", "Customer alerts", "Returns"]
  },
  {
    id: "buildium",
    name: "Buildium",
    category: "Property Management",
    description: "Sync tenant data, maintenance requests, and lease renewals.",
    icon: Building2,
    color: "border-rose-500/30 bg-rose-500/10",
    dotColor: "bg-rose-400",
    connected: false,
    scope: "team",
    actions: [
      "Sync tenants",
      "Maintenance requests",
      "Lease renewals",
      "Rent tracking"
    ]
  }
];
const CATEGORIES = Array.from(new Set(TOOLS.map((t) => t.category)));
function ComposioToolConnectPage() {
  useActor();
  const [tools, setTools] = reactExports.useState(TOOLS);
  const [filter, setFilter] = reactExports.useState("All");
  const [search, setSearch] = reactExports.useState("");
  const [connectingId, setConnectingId] = reactExports.useState(null);
  const [healthStatus, setHealthStatus] = reactExports.useState("checking");
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setHealthStatus("healthy");
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  const filteredTools = tools.filter((t) => {
    const matchesFilter = filter === "All" || t.category === filter;
    const matchesSearch = search.trim() === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  const connectedCount = tools.filter((t) => t.connected).length;
  const handleConnect = reactExports.useCallback(async (toolId) => {
    var _a;
    setConnectingId(toolId);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setTools(
        (prev) => prev.map(
          (t) => t.id === toolId ? {
            ...t,
            connected: true,
            connectedAs: t.id === "gmail" ? "admin@yourbusiness.com" : t.id === "google-calendar" ? "admin@yourbusiness.com" : t.id === "stripe" ? "acct_1ABC123" : t.id === "twilio" ? "+1-555-0199" : `${t.name} Account`,
            lastSync: "Just now"
          } : t
        )
      );
      ue.success(
        `${(_a = TOOLS.find((t) => t.id === toolId)) == null ? void 0 : _a.name} connected successfully`
      );
    } catch {
      ue.error("Connection failed. Please try again.");
    } finally {
      setConnectingId(null);
    }
  }, []);
  const handleDisconnect = reactExports.useCallback((toolId) => {
    var _a;
    setTools(
      (prev) => prev.map(
        (t) => t.id === toolId ? {
          ...t,
          connected: false,
          connectedAs: void 0,
          lastSync: void 0
        } : t
      )
    );
    ue.success(`${(_a = TOOLS.find((t) => t.id === toolId)) == null ? void 0 : _a.name} disconnected`);
  }, []);
  const handleSyncAll = reactExports.useCallback(() => {
    const connected = tools.filter((t) => t.connected);
    if (connected.length === 0) {
      ue.info("No tools connected yet.");
      return;
    }
    setTools(
      (prev) => prev.map((t) => t.connected ? { ...t, lastSync: "Just now" } : t)
    );
    ue.success(
      `Synced ${connected.length} connected tool${connected.length > 1 ? "s" : ""}`
    );
  }, [tools]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { className: "w-5 h-5 text-indigo-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-white", children: "Connected Tools" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Link external apps via Composio — your AI agent works inside the tools you already use." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Shield,
            {
              size: 14,
              className: healthStatus === "healthy" ? "text-emerald-400" : healthStatus === "error" ? "text-red-400" : "text-amber-400"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-300", children: healthStatus === "checking" ? "Checking MCP health..." : healthStatus === "healthy" ? "MCP Router Healthy" : "MCP Router Error" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "border-border text-muted-foreground gap-1.5",
            onClick: handleSyncAll,
            "data-ocid": "composio.sync_all_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13 }),
              " Sync All"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", children: [
      { label: "Total Tools", value: tools.length, icon: Plug },
      {
        label: "Connected",
        value: connectedCount,
        icon: CircleCheck,
        color: "text-emerald-400"
      },
      { label: "Categories", value: CATEGORIES.length, icon: Zap },
      {
        label: "Pending",
        value: tools.length - connectedCount,
        icon: TriangleAlert,
        color: "text-amber-400"
      }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-slate-900/60 border border-white/10 rounded-xl p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { size: 14, className: stat.color ?? "text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: stat.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-white", children: stat.value })
        ]
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 bg-slate-900/60 border border-white/10 rounded-xl p-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { className: "w-5 h-5 text-purple-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: "Primary MCP Layer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: "Composio is the default routing layer for all AI agent tool calls." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: "Default toolkit: Gmail, Google Calendar, Stripe, CompanyCam" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Search tools...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "flex-1 bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
          "data-ocid": "composio.search_input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["All", ...CATEGORIES].map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setFilter(cat),
          className: `px-3 py-1.5 text-xs rounded-lg border transition-colors ${filter === cat ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300" : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:border-white/20"}`,
          "data-ocid": `composio.filter.${cat.toLowerCase().replace(/\s+/g, "_")}`,
          children: cat
        },
        cat
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredTools.map((tool) => {
      const Icon = tool.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `border rounded-xl p-5 transition-all hover:shadow-lg ${tool.connected ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-900/60 border-white/10 hover:border-white/20"}`,
          "data-ocid": `composio.tool.${tool.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-9 h-9 rounded-lg flex items-center justify-center ${tool.color}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Icon,
                      {
                        size: 18,
                        className: tool.connected ? "text-emerald-400" : "text-slate-300"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white", children: tool.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-400", children: tool.category })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-2 h-2 rounded-full ${tool.connected ? "bg-emerald-400" : "bg-slate-600"}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mb-3 leading-relaxed", children: tool.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mb-3", children: tool.actions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: "text-[9px] border border-white/10 bg-white/5 text-slate-300",
                children: action
              },
              action
            )) }),
            tool.connected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-emerald-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 11 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Connected as ",
                  tool.connectedAs
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-500", children: [
                  "Synced ",
                  tool.lastSync
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-6 px-2 text-[10px] border-white/10 text-slate-300 hover:text-white",
                      onClick: () => {
                        setTools(
                          (prev) => prev.map(
                            (t) => t.id === tool.id ? { ...t, lastSync: "Just now" } : t
                          )
                        );
                        ue.success(`${tool.name} synced`);
                      },
                      "data-ocid": `composio.tool.${tool.id}.sync_button`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 10, className: "mr-1" }),
                        " Sync"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-6 px-2 text-[10px] border-red-500/30 text-red-400 hover:bg-red-500/10",
                      onClick: () => handleDisconnect(tool.id),
                      "data-ocid": `composio.tool.${tool.id}.disconnect_button`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 10, className: "mr-1" }),
                        " Disconnect"
                      ]
                    }
                  )
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "w-full h-8 text-xs bg-indigo-500 hover:bg-indigo-600 text-white gap-1.5",
                onClick: () => handleConnect(tool.id),
                disabled: connectingId === tool.id,
                "data-ocid": `composio.tool.${tool.id}.connect_button`,
                children: [
                  connectingId === tool.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 12 }),
                  connectingId === tool.id ? "Connecting..." : "Connect"
                ]
              }
            )
          ]
        },
        tool.id
      );
    }) }),
    filteredTools.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-16 text-slate-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { size: 32, className: "mx-auto mb-3 opacity-30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No tools match your search." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setSearch("");
            setFilter("All");
          },
          className: "text-xs text-indigo-400 hover:text-indigo-300 mt-2 underline",
          children: "Clear filters"
        }
      )
    ] })
  ] });
}
export {
  ComposioToolConnectPage as default
};
