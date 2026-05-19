import { r as reactExports, at as useAllBounceRecords, j as jsxRuntimeExports, au as Badge, d as TriangleAlert, B as Button, an as RefreshCw, av as Card, aw as CardContent, ax as useOutreachOverview, ay as Skeleton, U as Users, ah as Zap, m as Mail, T as TrendingUp, C as ChartColumn, az as Settings2, aA as CardHeader, aB as CardTitle, aC as CircleCheck, aD as useQueueStats, a4 as Table, a5 as TableHeader, a6 as TableRow, a7 as TableHead, a8 as TableBody, aE as demoThrottleConfigs, a9 as TableCell, aF as ChevronRight, aG as Pause, a3 as Search, I as Input, _ as Select, $ as SelectTrigger, a0 as SelectValue, a1 as SelectContent, a2 as SelectItem, aH as Funnel, L as Label, aI as demoQueueStats, aJ as demoEngagementFunnel, f as ChevronDown, e as ChevronUp, aK as useSetThrottleConfig, aL as Dialog, aM as DialogContent, aN as DialogHeader, aO as DialogTitle, aP as Switch } from "./index-C3jwZdmd.js";
const TENANT_ID = "demo-tenant";
const TABS = ["overview", "campaigns", "leads", "engagement"];
const NICHE_COLORS = {
  Plumbing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Med Spa": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Roofing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Real Estate": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  HVAC: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Dental: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Technology: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
};
const DEMO_LEADS = [
  {
    id: "1",
    email: "mike@roofpros.com",
    niche: "Roofing",
    queue: "Roofing Storm Season Push",
    bounceStatus: "ok",
    lastContact: "2025-11-16",
    engagement: "replied"
  },
  {
    id: "2",
    email: "sarah@medspaluxe.com",
    niche: "Med Spa",
    queue: "Med Spa Premium Sequence",
    bounceStatus: "ok",
    lastContact: "2025-11-16",
    engagement: "clicked"
  },
  {
    id: "3",
    email: "info@hvacpro.net",
    niche: "HVAC",
    queue: "HVAC Maintenance Contract Push",
    bounceStatus: "soft",
    lastContact: "2025-11-15",
    engagement: "opened"
  },
  {
    id: "4",
    email: "noreply@dentalcorp.xyz",
    niche: "Dental",
    queue: "Dental New Patient Campaign",
    bounceStatus: "hard",
    lastContact: "2025-11-15",
    engagement: "no-open"
  },
  {
    id: "5",
    email: "james@realtyweb.io",
    niche: "Real Estate",
    queue: "Real Estate SEO Audit Drip",
    bounceStatus: "ok",
    lastContact: "2025-11-14",
    engagement: "opened"
  },
  {
    id: "6",
    email: "contact@techsolutions.co",
    niche: "Technology",
    queue: "Technology Cold Outreach",
    bounceStatus: "soft",
    lastContact: "2025-11-14",
    engagement: "opened"
  },
  {
    id: "7",
    email: "owner@plumbright.com",
    niche: "Plumbing",
    queue: "Plumbing Cold Outreach",
    bounceStatus: "ok",
    lastContact: "2025-11-13",
    engagement: "clicked"
  },
  {
    id: "8",
    email: "admin@badomain.fail",
    niche: "Technology",
    queue: "Technology Cold Outreach",
    bounceStatus: "hard",
    lastContact: "2025-11-13",
    engagement: "no-open"
  },
  {
    id: "9",
    email: "dr.kim@drsmilesdental.com",
    niche: "Dental",
    queue: "Dental New Patient Campaign",
    bounceStatus: "ok",
    lastContact: "2025-11-12",
    engagement: "replied"
  },
  {
    id: "10",
    email: "book@spaelite.com",
    niche: "Med Spa",
    queue: "Med Spa Premium Sequence",
    bounceStatus: "ok",
    lastContact: "2025-11-12",
    engagement: "clicked"
  },
  {
    id: "11",
    email: "builds@constructco.biz",
    niche: "Roofing",
    queue: "Roofing Storm Season Push",
    bounceStatus: "soft",
    lastContact: "2025-11-11",
    engagement: "no-open"
  },
  {
    id: "12",
    email: "lisa@lhrealty.net",
    niche: "Real Estate",
    queue: "Real Estate SEO Audit Drip",
    bounceStatus: "ok",
    lastContact: "2025-11-11",
    engagement: "replied"
  }
];
const REPLY_BREAKDOWN = [
  {
    label: "Positive",
    count: 142,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-500/30"
  },
  {
    label: "Neutral",
    count: 73,
    color: "text-amber-400",
    bg: "bg-amber-500/20 border-amber-500/30"
  },
  {
    label: "Spam",
    count: 33,
    color: "text-rose-400",
    bg: "bg-rose-500/20 border-rose-500/30"
  }
];
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  warn
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border border-border hover:border-primary/40 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground tabular-nums", children: value }),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: sub })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `p-2 rounded-lg ${warn ? "bg-amber-500/20" : "bg-primary/15"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Icon,
            {
              className: `w-5 h-5 ${warn ? "text-amber-400" : "text-primary"}`
            }
          )
        }
      )
    ] }),
    warn && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1.5 text-xs text-amber-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Requires attention" })
    ] })
  ] }) });
}
function NicheBadge({ niche }) {
  const cls = NICHE_COLORS[niche] ?? "bg-muted/50 text-muted-foreground border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`,
      children: niche
    }
  );
}
function BounceBadge({ type }) {
  if (type === "ok")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-emerald-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400" }),
      "OK"
    ] });
  if (type === "soft")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-amber-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400" }),
      "Soft"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-rose-400", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-rose-400" }),
    "Hard"
  ] });
}
function EngagementBadge({ status }) {
  const map = {
    "no-open": {
      label: "No Open",
      cls: "bg-muted/40 text-muted-foreground border-border"
    },
    opened: {
      label: "Opened",
      cls: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    },
    clicked: {
      label: "Clicked",
      cls: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    },
    replied: {
      label: "Replied",
      cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    }
  };
  const { label, cls } = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`,
      children: label
    }
  );
}
function ThrottleModal({
  open,
  queueId,
  queueName,
  onClose
}) {
  var _a;
  const initial = demoThrottleConfigs[queueId] ?? {
    dailyCap: 100,
    intervalSeconds: 90,
    staggerEnabled: true,
    backoffMultiplier: 1.5
  };
  const [cfg, setCfg] = reactExports.useState(initial);
  const setThrottle = useSetThrottleConfig();
  const totalLeads = ((_a = demoQueueStats.find((q) => q.queueId === queueId)) == null ? void 0 : _a.totalLeads) ?? 500;
  const estDays = cfg.dailyCap > 0 ? Math.ceil(totalLeads / cfg.dailyCap) : "∞";
  const intervalOptions = [
    { label: "5 min", value: 300 },
    { label: "10 min", value: 600 },
    { label: "15 min", value: 900 },
    { label: "30 min", value: 1800 },
    { label: "60 min", value: 3600 }
  ];
  function handleSave() {
    setThrottle.mutate({ queueId, config: cfg });
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-[#16162a] border border-white/15 text-foreground max-w-md",
      "data-ocid": "throttle.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-semibold", children: "Configure Throttle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: queueName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground mb-2 block", children: [
              "Daily Send Cap:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: cfg.dailyCap })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 100,
                max: 2e3,
                step: 50,
                value: cfg.dailyCap,
                onChange: (e) => setCfg((p) => ({ ...p, dailyCap: Number(e.target.value) })),
                className: "w-full accent-purple-500",
                "data-ocid": "throttle.daily_cap"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "2,000" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Send Interval" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(cfg.intervalSeconds),
                onValueChange: (v) => setCfg((p) => ({ ...p, intervalSeconds: Number(v) })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "bg-[#0e0e1a] border-white/15 text-sm",
                      "data-ocid": "throttle.interval_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-[#1a1a2e] border-white/15", children: intervalOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(opt.value), children: opt.label }, opt.value)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Stagger sends" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Randomize send times within window" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: cfg.staggerEnabled,
                onCheckedChange: (v) => setCfg((p) => ({ ...p, staggerEnabled: v })),
                "data-ocid": "throttle.stagger_toggle"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              totalLeads.toLocaleString(),
              " leads"
            ] }),
            " at",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              cfg.dailyCap,
              "/day"
            ] }),
            " ≈",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              estDays,
              " ",
              estDays === 1 ? "day" : "days"
            ] }),
            " ",
            "to complete"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "flex-1 border-white/15 hover:bg-white/5",
                onClick: onClose,
                "data-ocid": "throttle.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1 bg-primary hover:bg-primary/90",
                onClick: handleSave,
                "data-ocid": "throttle.save_button",
                children: "Save Config"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function OverviewTab({ onTabChange }) {
  const { data: overview, isLoading } = useOutreachOverview(TENANT_ID);
  const { data: bounces } = useAllBounceRecords(TENANT_ID);
  const recentActivity = reactExports.useMemo(
    () => [
      {
        queue: "Technology Cold Outreach",
        time: "2 min ago",
        sent: 12,
        status: "sent"
      },
      {
        queue: "Med Spa Premium Sequence",
        time: "18 min ago",
        sent: 8,
        status: "sent"
      },
      {
        queue: "Roofing Storm Season Push",
        time: "34 min ago",
        sent: 15,
        status: "sent"
      },
      {
        queue: "Dental New Patient Campaign",
        time: "1h ago",
        sent: 6,
        status: "delivered"
      },
      {
        queue: "Real Estate SEO Audit Drip",
        time: "1h 22m ago",
        sent: 11,
        status: "sent"
      },
      {
        queue: "HVAC Maintenance Contract Push",
        time: "2h ago",
        sent: 9,
        status: "bounced"
      },
      {
        queue: "Plumbing Cold Outreach",
        time: "2h 40m ago",
        sent: 14,
        status: "delivered"
      },
      {
        queue: "Technology Cold Outreach",
        time: "3h ago",
        sent: 20,
        status: "sent"
      },
      {
        queue: "Med Spa Premium Sequence",
        time: "4h ago",
        sent: 5,
        status: "opened"
      },
      {
        queue: "Roofing Storm Season Push",
        time: "5h ago",
        sent: 18,
        status: "delivered"
      }
    ],
    []
  );
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3", children: ["total", "queues", "sent", "rate", "bounces"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 bg-white/5" }, k)) });
  }
  const ov = overview;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "overview.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-5 gap-3",
        "data-ocid": "overview.metrics_grid",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Total Leads",
              value: ov.totalLeads.toLocaleString(),
              icon: Users,
              sub: "In all queues"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Active Queues",
              value: ov.activeQueues,
              icon: Zap,
              sub: "Currently sending"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Sent This Month",
              value: ov.totalSentThisMonth.toLocaleString(),
              icon: Mail,
              sub: "↑ 12% vs last month"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Avg Response Rate",
              value: `${ov.avgResponseRate}%`,
              icon: TrendingUp,
              sub: "Across all queues"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Pending Bounces",
              value: ov.pendingBounces,
              icon: TriangleAlert,
              sub: "Require review",
              warn: ov.pendingBounces > 0
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", "data-ocid": "overview.quick_actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "border-white/15 hover:bg-white/5 gap-2",
          onClick: () => onTabChange("leads"),
          "data-ocid": "overview.view_bounces_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 text-amber-400" }),
            "View Bounces",
            ((bounces == null ? void 0 : bounces.length) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-500/30 text-amber-300 text-xs px-1.5 py-0.5 rounded-full", children: bounces == null ? void 0 : bounces.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "border-white/15 hover:bg-white/5 gap-2",
          onClick: () => onTabChange("campaigns"),
          "data-ocid": "overview.view_active_queues_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-3.5 h-3.5 text-primary" }),
            "View Active Queues"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "border-white/15 hover:bg-white/5 gap-2",
          onClick: () => onTabChange("campaigns"),
          "data-ocid": "overview.configure_throttle_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-3.5 h-3.5 text-muted-foreground" }),
            "Configure Throttling"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "lg:col-span-2 bg-[#16162a] border border-white/10",
          "data-ocid": "overview.activity_feed",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-primary" }),
              "Recent Send Activity"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentActivity.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between py-2 border-b border-white/5 last:border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: ev.queue }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: ev.time })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
                      ev.sent,
                      " sent"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs px-2 py-0.5 rounded border ${ev.status === "bounced" ? "bg-rose-500/15 text-rose-400 border-rose-500/25" : ev.status === "opened" ? "bg-purple-500/15 text-purple-300 border-purple-500/25" : ev.status === "delivered" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" : "bg-blue-500/15 text-blue-300 border-blue-500/25"}`,
                        children: ev.status
                      }
                    )
                  ] })
                ]
              },
              `${ev.queue}-${ev.time}`
            )) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "bg-[#16162a] border border-white/10",
          "data-ocid": "overview.system_health",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-400" }),
              "System Health"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4 space-y-3", children: [
              {
                label: "SendGrid API",
                status: "green",
                detail: "Connected • 98.2% delivery"
              },
              {
                label: "Email Credentials",
                status: "green",
                detail: "SPF / DKIM verified"
              },
              {
                label: "Bounce Webhook",
                status: "green",
                detail: "Receiving events"
              },
              {
                label: "Queue Worker",
                status: "green",
                detail: "7 queues active"
              },
              {
                label: "Throttle Engine",
                status: "amber",
                detail: "Rate limited on q-007"
              }
            ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start justify-between gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: item.detail })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${item.status === "green" ? "bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60]" : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"}`
                    }
                  )
                ]
              },
              item.label
            )) })
          ]
        }
      )
    ] })
  ] });
}
function CampaignsTab() {
  const { data: queues, isLoading } = useQueueStats(TENANT_ID);
  const [expandedRow, setExpandedRow] = reactExports.useState(null);
  const [throttleModal, setThrottleModal] = reactExports.useState(null);
  const [sortKey, setSortKey] = reactExports.useState("engagementPct");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }
  const sorted = reactExports.useMemo(() => {
    if (!queues) return [];
    return [...queues].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [queues, sortKey, sortDir]);
  function SortIcon({ k }) {
    if (sortKey !== k) return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 opacity-30" });
    return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3 h-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3 text-primary" });
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 bg-white/5" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "campaigns.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-white/10 overflow-hidden",
        "data-ocid": "campaigns.table",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/10 bg-[#0e0e1e] hover:bg-[#0e0e1e]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium w-8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Campaign" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Niche" }),
            [
              "totalLeads",
              "sent",
              "bounced",
              "responded",
              "engagementPct"
            ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableHead,
              {
                className: "text-xs text-muted-foreground font-medium text-right cursor-pointer hover:text-foreground select-none",
                onClick: () => toggleSort(k),
                "data-ocid": `campaigns.sort_${k}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 justify-end", children: [
                  {
                    totalLeads: "Leads",
                    sent: "Sent",
                    bounced: "Bounced",
                    responded: "Replied",
                    engagementPct: "Engage %"
                  }[k],
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { k })
                ] })
              },
              k
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: sorted.map((q, i) => {
            const isExpanded = expandedRow === q.queueId;
            const cfg = demoThrottleConfigs[q.queueId];
            const progress = q.totalLeads > 0 ? Math.round(q.sent / q.totalLeads * 100) : 0;
            const intervalLabel = cfg ? [300, 600, 900, 1800, 3600].includes(cfg.intervalSeconds) ? ["5 min", "10 min", "15 min", "30 min", "60 min"][[300, 600, 900, 1800, 3600].indexOf(cfg.intervalSeconds)] : `${cfg.intervalSeconds}s` : "—";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  className: "border-white/8 hover:bg-white/[0.03] cursor-pointer",
                  "data-ocid": `campaigns.item.${i + 1}`,
                  onClick: () => setExpandedRow(isExpanded ? null : q.queueId),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChevronRight,
                      {
                        className: `w-3.5 h-3.5 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: q.name }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NicheBadge, { niche: q.niche }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-right text-sm tabular-nums", children: q.totalLeads.toLocaleString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-right text-sm tabular-nums", children: q.sent.toLocaleString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-right text-sm tabular-nums text-rose-400", children: q.bounced }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-right text-sm tabular-nums text-emerald-400", children: q.responded }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: `text-sm font-semibold tabular-nums ${q.engagementPct >= 15 ? "text-emerald-400" : q.engagementPct >= 8 ? "text-primary" : "text-muted-foreground"}`,
                        children: [
                          q.engagementPct,
                          "%"
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        role: "presentation",
                        className: "flex items-center justify-end gap-1",
                        onClick: (e) => e.stopPropagation(),
                        onKeyDown: (e) => e.stopPropagation(),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              variant: "ghost",
                              size: "sm",
                              className: "h-7 px-2 text-xs hover:bg-white/10",
                              "data-ocid": `campaigns.configure_throttle_button.${i + 1}`,
                              onClick: () => setThrottleModal({
                                queueId: q.queueId,
                                name: q.name
                              }),
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-3.5 h-3.5" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              variant: "ghost",
                              size: "sm",
                              className: "h-7 px-2 text-xs hover:bg-white/10",
                              "data-ocid": `campaigns.pause_button.${i + 1}`,
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ]
                      }
                    ) })
                  ]
                },
                q.queueId
              ),
              isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableRow,
                {
                  className: "border-white/8 bg-[#0e0e1e]/60",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                    cfg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Throttle Config" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Daily Cap" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                            cfg.dailyCap,
                            "/day"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Interval" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: intervalLabel })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Stagger" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: cfg.staggerEnabled ? "text-emerald-400 font-medium" : "text-muted-foreground",
                              children: cfg.staggerEnabled ? "Enabled" : "Disabled"
                            }
                          )
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Send Progress" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all",
                            style: { width: `${progress}%` }
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold tabular-nums w-10 text-right", children: [
                          progress,
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        q.sent.toLocaleString(),
                        " of",
                        " ",
                        q.totalLeads.toLocaleString(),
                        " leads reached"
                      ] })
                    ] })
                  ] }) })
                },
                `${q.queueId}-expand`
              )
            ] });
          }) })
        ] })
      }
    ),
    throttleModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ThrottleModal,
      {
        open: !!throttleModal,
        queueId: throttleModal.queueId,
        queueName: throttleModal.name,
        onClose: () => setThrottleModal(null)
      }
    )
  ] });
}
function LeadsTab() {
  const [search, setSearch] = reactExports.useState("");
  const [nicheFilter, setNicheFilter] = reactExports.useState("all");
  const [bounceFilter, setBounceFilter] = reactExports.useState("all");
  const [engageFilter, setEngageFilter] = reactExports.useState("all");
  const [segPanelOpen, setSegPanelOpen] = reactExports.useState(false);
  const [segNiche, setSegNiche] = reactExports.useState("all");
  const [assignQueue, setAssignQueue] = reactExports.useState("");
  const niches = reactExports.useMemo(
    () => Array.from(new Set(DEMO_LEADS.map((l) => l.niche))),
    []
  );
  const filtered = reactExports.useMemo(
    () => DEMO_LEADS.filter((l) => {
      if (search && !l.email.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (nicheFilter !== "all" && l.niche !== nicheFilter) return false;
      if (bounceFilter !== "all" && l.bounceStatus !== bounceFilter)
        return false;
      if (engageFilter !== "all" && l.engagement !== engageFilter)
        return false;
      return true;
    }),
    [search, nicheFilter, bounceFilter, engageFilter]
  );
  const segCount = reactExports.useMemo(
    () => DEMO_LEADS.filter((l) => segNiche === "all" || l.niche === segNiche).length,
    [segNiche]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "leads.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-wrap items-center gap-2",
        "data-ocid": "leads.filters",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Search by email…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "pl-8 h-8 bg-[#0e0e1a] border-white/15 text-sm",
                "data-ocid": "leads.search_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: nicheFilter, onValueChange: setNicheFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 w-36 bg-[#0e0e1a] border-white/15 text-xs",
                "data-ocid": "leads.niche_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All niches" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-[#1a1a2e] border-white/15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All niches" }),
              niches.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: n, children: n }, n))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: bounceFilter, onValueChange: setBounceFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 w-36 bg-[#0e0e1a] border-white/15 text-xs",
                "data-ocid": "leads.bounce_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Bounce status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-[#1a1a2e] border-white/15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All bounce statuses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ok", children: "OK" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "soft", children: "Soft bounce" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hard", children: "Hard bounce" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: engageFilter, onValueChange: setEngageFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 w-36 bg-[#0e0e1a] border-white/15 text-xs",
                "data-ocid": "leads.engagement_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Engagement" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-[#1a1a2e] border-white/15", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All engagement" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no-open", children: "No Open" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "opened", children: "Opened" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "clicked", children: "Clicked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "replied", children: "Replied" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "h-8 border-white/15 hover:bg-white/5 gap-1.5 text-xs",
              onClick: () => setSegPanelOpen((v) => !v),
              "data-ocid": "leads.segmentation_toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3 h-3" }),
                "Segmentation"
              ]
            }
          )
        ]
      }
    ),
    segPanelOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "bg-[#16162a] border border-purple-500/25",
        "data-ocid": "leads.segmentation_panel",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Filter by Niche" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: segNiche, onValueChange: setSegNiche, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 bg-[#0e0e1a] border-white/15 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-[#1a1a2e] border-white/15", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All niches" }),
                niches.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: n, children: n }, n))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Assign to Queue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: assignQueue, onValueChange: setAssignQueue, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 bg-[#0e0e1a] border-white/15 text-xs",
                  "data-ocid": "leads.assign_queue_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select queue…" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-[#1a1a2e] border-white/15", children: demoQueueStats.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: q.queueId, children: q.name }, q.queueId)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: segCount }),
              " leads match"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "h-8 bg-primary hover:bg-primary/90 text-xs",
                disabled: !assignQueue,
                "data-ocid": "leads.assign_button",
                children: "Assign to Queue"
              }
            )
          ] })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-white/10 overflow-hidden",
        "data-ocid": "leads.table",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/10 bg-[#0e0e1e] hover:bg-[#0e0e1e]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Niche" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Queue" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Bounce" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Last Contact" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium", children: "Engagement" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-medium text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
            filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TableCell,
              {
                colSpan: 7,
                className: "py-12 text-center text-muted-foreground text-sm",
                "data-ocid": "leads.empty_state",
                children: "No leads match your filters."
              }
            ) }),
            filtered.map((lead, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TableRow,
              {
                className: "border-white/8 hover:bg-white/[0.03]",
                "data-ocid": `leads.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-sm font-mono text-foreground/90", children: lead.email }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NicheBadge, { niche: lead.niche }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-xs text-muted-foreground max-w-[160px] truncate", children: lead.queue }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BounceBadge, { type: lead.bounceStatus }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-xs text-muted-foreground tabular-nums", children: lead.lastContact }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EngagementBadge, { status: lead.engagement }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                    lead.bounceStatus === "soft" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 px-2 text-xs text-amber-400 hover:bg-amber-500/10",
                        "data-ocid": `leads.requeue_button.${i + 1}`,
                        children: "Re-queue"
                      }
                    ),
                    lead.bounceStatus === "hard" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 px-2 text-xs text-rose-400 hover:bg-rose-500/10",
                        "data-ocid": `leads.delete_button.${i + 1}`,
                        children: "Remove"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        className: "h-7 px-2 text-xs hover:bg-white/10",
                        "data-ocid": `leads.view_details_button.${i + 1}`,
                        children: "Details"
                      }
                    )
                  ] }) })
                ]
              },
              lead.id
            ))
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Showing ",
      filtered.length,
      " of ",
      DEMO_LEADS.length,
      " leads"
    ] })
  ] });
}
function EngagementTab() {
  const maxCount = demoEngagementFunnel[0].count;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "engagement.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "lg:col-span-3 bg-[#16162a] border border-white/10",
          "data-ocid": "engagement.funnel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 px-5 pt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-primary" }),
              "Conversion Funnel"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: demoEngagementFunnel.map((stage, i) => {
              const barPct = stage.count / maxCount * 100;
              const isTop = i === 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3",
                  "data-ocid": `engagement.funnel_stage.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 text-xs text-muted-foreground text-right shrink-0", children: stage.stage }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 h-7 bg-white/5 rounded-md overflow-hidden relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full rounded-md transition-all duration-700",
                          style: {
                            width: `${barPct}%`,
                            background: isTop ? "linear-gradient(to right, oklch(0.38 0.14 290), oklch(0.48 0.18 290))" : i < 4 ? "linear-gradient(to right, oklch(0.52 0.22 290), oklch(0.62 0.18 290))" : "linear-gradient(to right, oklch(0.58 0.22 290), oklch(0.62 0.18 155))"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/80 tabular-nums", children: stage.count.toLocaleString() })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-14 text-xs font-semibold text-right tabular-nums text-primary", children: [
                      stage.pct,
                      "%"
                    ] })
                  ]
                },
                stage.stage
              );
            }) }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "bg-[#16162a] border border-white/10",
            "data-ocid": "engagement.reply_breakdown",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 px-4 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Reply Breakdown" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4 space-y-3", children: REPLY_BREAKDOWN.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-medium ${r.color}`, children: r.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-28 h-2 bg-white/8 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `h-full rounded-full ${r.color.replace("text-", "bg-").replace("-400", "-500")}`,
                          style: { width: `${r.count / 248 * 100}%` }
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `w-8 text-right text-sm font-bold tabular-nums ${r.color}`,
                          children: r.count
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: `px-2 py-0.5 rounded border text-xs ${r.bg}`,
                          children: [
                            Math.round(r.count / 248 * 100),
                            "%"
                          ]
                        }
                      )
                    ] })
                  ]
                },
                r.label
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "bg-[#16162a] border border-white/10",
            "data-ocid": "engagement.cost_per_lead",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 py-4 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-emerald-500/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-emerald-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Cost per Qualified Lead" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-emerald-400 tabular-nums", children: "$4.12" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "↓ 18% vs last month" })
              ] })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        className: "bg-[#16162a] border border-white/10",
        "data-ocid": "engagement.top_queues",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 px-5 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-amber-400" }),
            "Top Queues by Engagement"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: demoQueueStats.slice().sort((a, b) => b.engagementPct - a.engagementPct).slice(0, 5).map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3",
              "data-ocid": `engagement.top_queue.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-5 text-xs text-muted-foreground tabular-nums text-right", children: [
                  i + 1,
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium truncate", children: q.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(NicheBadge, { niche: q.niche }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-2 bg-white/8 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full rounded-full bg-gradient-to-r from-purple-600 to-emerald-500",
                    style: { width: `${q.engagementPct / 20 * 100}%` }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-12 text-right text-sm font-bold tabular-nums text-primary", children: [
                  q.engagementPct,
                  "%"
                ] })
              ]
            },
            q.queueId
          )) }) })
        ]
      }
    )
  ] });
}
function BounceRecordRow({
  record,
  index
}) {
  const queue = demoQueueStats.find((q) => q.queueId === record.queueId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start justify-between py-2 border-b border-white/5 last:border-0",
      "data-ocid": `bounces.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-mono text-foreground/90 truncate", children: record.leadId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BounceBadge, { type: record.bounceType })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: record.reason })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right ml-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (queue == null ? void 0 : queue.name) ?? record.queueId }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(record.bouncedAt).toLocaleDateString() })
        ] })
      ]
    }
  );
}
function OutreachAnalyticsPage() {
  const [activeTab, setActiveTab] = reactExports.useState(() => {
    const p = new URLSearchParams(window.location.search).get("tab");
    return TABS.includes(p ?? "") ? p : "overview";
  });
  const { data: bounces } = useAllBounceRecords(TENANT_ID);
  reactExports.useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", activeTab);
    window.history.replaceState({}, "", url.toString());
  }, [activeTab]);
  const tabLabels = {
    overview: "Overview",
    campaigns: "Campaigns",
    leads: "Leads",
    engagement: "Engagement"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border-b border-border px-6 py-4",
        "data-ocid": "outreach_analytics.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Outreach Analytics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Monitor queues, track engagement, and manage deliverability" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            ((bounces == null ? void 0 : bounces.length) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "border-amber-500/40 text-amber-400 bg-amber-500/10 gap-1.5 py-1",
                "data-ocid": "outreach_analytics.bounce_warning",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
                  bounces == null ? void 0 : bounces.length,
                  " bounces pending"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "border-white/15 hover:bg-white/5 gap-2",
                "data-ocid": "outreach_analytics.refresh_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                  "Refresh"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "bg-card border-b border-border px-6",
        "data-ocid": "outreach_analytics.tabs",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveTab(tab),
            "data-ocid": `outreach_analytics.${tab}_tab`,
            className: `px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-white/20"}`,
            children: [
              tabLabels[tab],
              tab === "leads" && bounces && bounces.filter((b) => b.bounceType === "hard" && !b.requeued).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 bg-rose-500/30 text-rose-300 text-xs px-1.5 py-0.5 rounded-full", children: bounces.filter(
                (b) => b.bounceType === "hard" && !b.requeued
              ).length })
            ]
          },
          tab
        )) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
      activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { onTabChange: setActiveTab }),
      activeTab === "campaigns" && /* @__PURE__ */ jsxRuntimeExports.jsx(CampaignsTab, {}),
      activeTab === "leads" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LeadsTab, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "leads.bounce_records", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-amber-400" }),
            "Recent Bounce Records"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-[#16162a] border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 py-3", children: bounces == null ? void 0 : bounces.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BounceRecordRow, { record: b, index: i }, b.leadId)) }) })
        ] })
      ] }),
      activeTab === "engagement" && /* @__PURE__ */ jsxRuntimeExports.jsx(EngagementTab, {})
    ] })
  ] });
}
export {
  OutreachAnalyticsPage as default
};
