import { r as reactExports, j as jsxRuntimeExports, c6 as Hammer, af as Zap, U as Users, i as Clock, bF as Star, aA as CircleCheck, c7 as DollarSign, d as TriangleAlert, aE as Pause, bd as Play, bq as PenLine, al as RefreshCw, ae as Shield } from "./index-CSMRpKtY.js";
const AUTOMATION_WORKFLOWS = [
  {
    id: "missed-call-recovery",
    name: "Missed Call Recovery",
    pillar: "booked",
    description: "Automatically follow up with missed callers via SMS and email to recover lost leads.",
    trigger: "Missed call or manually marked missed call",
    actions: [
      "Send SMS follow-up",
      "Send email follow-up",
      "Create CRM task",
      "Notify admin",
      "Move lead to Needs Follow-Up"
    ],
    status: "needs_setup",
    setupRequirements: ["Twilio SMS", "Email provider"]
  },
  {
    id: "speed-to-lead",
    name: "New Roofing Lead Speed-to-Lead",
    pillar: "booked",
    description: "Instantly engage new roofing leads with welcome messages and follow-up tasks.",
    trigger: "New lead created",
    actions: [
      "Send welcome message",
      "Create estimate follow-up task",
      "Assign lead owner",
      "Optionally add to Roofing Outreach Campaign"
    ],
    status: "needs_setup",
    setupRequirements: ["Twilio SMS", "Email provider", "CRM"]
  },
  {
    id: "estimate-follow-up",
    name: "Estimate Request Follow-Up",
    pillar: "booked",
    description: "Remind leads who requested estimates and move them through your pipeline.",
    trigger: "Lead status = Estimate Requested",
    actions: [
      "Send reminder",
      "Create call task",
      "Move lead to estimate follow-up stage"
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"]
  },
  {
    id: "storm-damage-follow-up",
    name: "Storm Damage Lead Follow-Up",
    pillar: "booked",
    description: "Fast-track urgent storm damage leads with priority responses and admin alerts.",
    trigger: "Lead tag includes storm damage, leak, urgent repair, insurance claim, roof replacement",
    actions: [
      "Send urgent response",
      "Create high-priority task",
      "Notify admin/master agent"
    ],
    status: "needs_setup",
    setupRequirements: ["Twilio SMS", "Email provider", "CRM"]
  },
  {
    id: "old-lead-reactivation",
    name: "Old Lead Reactivation",
    pillar: "booked",
    description: "Re-engage cold leads after 14, 30, or 60 days of inactivity.",
    trigger: "Lead inactive for 14, 30, or 60 days",
    actions: [
      "Send reactivation email",
      "Create follow-up task",
      "Add to nurture sequence"
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"]
  },
  {
    id: "review-request-after-job",
    name: "Review Request After Job",
    pillar: "ranked",
    description: "Automatically request reviews from satisfied customers after job completion.",
    trigger: "Job/lead status changed to Completed",
    actions: [
      "Send review request",
      "Create review follow-up task",
      "Track review request status"
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "SMS provider", "CRM"]
  },
  {
    id: "no-review-follow-up",
    name: "No Review Follow-Up",
    pillar: "ranked",
    description: "Send gentle reminders to customers who haven't left a review yet.",
    trigger: "Review request sent but no review after 3–7 days",
    actions: ["Send reminder", "Update review request status"],
    status: "needs_setup",
    setupRequirements: ["Email provider", "SMS provider"]
  },
  {
    id: "google-ranking-audit-reminder",
    name: "Google Ranking Audit Reminder",
    pillar: "ranked",
    description: "Schedule regular Google ranking audits and notify admins of action items.",
    trigger: "Every 30 days or manual trigger",
    actions: [
      "Create audit task",
      "Add ranking snapshot placeholder",
      "Notify admin"
    ],
    status: "needs_setup",
    setupRequirements: ["SerpApi or search provider", "CRM"]
  },
  {
    id: "low-review-count-alert",
    name: "Low Review Count Alert",
    pillar: "ranked",
    description: "Alert admins when a client's review count drops below target thresholds.",
    trigger: "Review count below target threshold",
    actions: [
      "Create review growth task",
      "Recommend review campaign activation"
    ],
    status: "needs_setup",
    setupRequirements: ["CRM", "Review monitoring"]
  },
  {
    id: "local-seo-content-prompt",
    name: "Local SEO Content Prompt",
    pillar: "ranked",
    description: "Generate roofing content ideas and keyword suggestions for local SEO.",
    trigger: "Manual or monthly",
    actions: [
      "Generate roofing content ideas",
      "Create content task",
      "Suggest city/service keywords"
    ],
    status: "needs_setup",
    setupRequirements: ["LLM provider"]
  },
  {
    id: "funding-readiness-checklist",
    name: "Funding Readiness Checklist Starter",
    pillar: "fundable",
    description: "Kick off the funding readiness process for new roofing clients.",
    trigger: "New roofing client created",
    actions: [
      "Create funding profile",
      "Add checklist items",
      "Notify admin/client"
    ],
    status: "needs_setup",
    setupRequirements: ["CRM"]
  },
  {
    id: "business-credit-foundation",
    name: "Business Credit Foundation Reminder",
    pillar: "fundable",
    description: "Remind clients to complete business credit foundation steps.",
    trigger: "Funding checklist incomplete",
    actions: ["Create task", "Send reminder", "Mark missing items"],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"]
  },
  {
    id: "document-collection",
    name: "Document Collection Automation",
    pillar: "fundable",
    description: "Automate the collection of funding documents from interested clients.",
    trigger: "Client marked interested in funding",
    actions: [
      "Create document checklist",
      "Request missing docs",
      "Track status"
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"]
  },
  {
    id: "vendor-tradeline-reminder",
    name: "Vendor Tradeline Reminder",
    pillar: "fundable",
    description: "Remind clients to set up vendor tradelines for business credit building.",
    trigger: "Business credit checklist incomplete",
    actions: [
      "Create tradeline task",
      "Add vendor checklist placeholder",
      "Notify admin"
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"]
  },
  {
    id: "fundability-score-update",
    name: "Fundability Score Update",
    pillar: "fundable",
    description: "Update the client's fundability score as they complete checklist items.",
    trigger: "Checklist item completed",
    actions: ["Update score", "Show progress", "Recommend next step"],
    status: "needs_setup",
    setupRequirements: ["CRM"]
  }
];
const PILLAR_LABELS = {
  booked: "Booked",
  ranked: "Ranked",
  fundable: "Fundable"
};
const PILLAR_COLORS = {
  booked: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ranked: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  fundable: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
};
const STATUS_COLORS = {
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  paused: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  needs_setup: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30"
};
const STATUS_LABELS = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  needs_setup: "Needs Setup",
  error: "Error"
};
const TABS = [
  { key: "booked", label: "Booked Automations" },
  { key: "ranked", label: "Ranked Automations" },
  { key: "fundable", label: "Fundable Automations" },
  { key: "all", label: "All Workflows" }
];
const METRIC_CARDS = [
  { label: "Active Automations", value: 0, icon: Zap },
  { label: "Leads Touched Today", value: 0, icon: Users },
  { label: "Follow-Ups Pending", value: 0, icon: Clock },
  { label: "Reviews Requested", value: 0, icon: Star },
  { label: "Estimates Booked", value: 0, icon: CircleCheck },
  { label: "Funding Tasks Triggered", value: 0, icon: DollarSign }
];
function RoofingAutomationsPage() {
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [statusMap, setStatusMap] = reactExports.useState(() => {
    const map = {};
    for (const w of AUTOMATION_WORKFLOWS) {
      map[w.id] = w.status;
    }
    return map;
  });
  const filtered = activeTab === "all" ? AUTOMATION_WORKFLOWS : AUTOMATION_WORKFLOWS.filter((w) => w.pillar === activeTab);
  const toggleStatus = (id) => {
    setStatusMap((prev) => {
      const current = prev[id] ?? "needs_setup";
      const next = current === "active" ? "paused" : current === "paused" ? "active" : "active";
      return { ...prev, [id]: next };
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hammer, { className: "w-5 h-5 text-indigo-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-white", children: "Roofing Automations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Prebuilt AI-powered workflows for roofing lead capture, follow-up, reviews, ranking, and funding readiness." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 mt-6", children: METRIC_CARDS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl bg-slate-900/60 border border-white/10 p-4 flex flex-col items-center text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: "w-5 h-5 text-indigo-400 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-white", children: m.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 mt-1", children: m.label })
        ]
      },
      m.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `roofing.automation.tab.${tab.key}`,
        onClick: () => setActiveTab(tab.key),
        className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-indigo-600 text-white" : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"}`,
        children: tab.label
      },
      tab.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: filtered.map((workflow) => {
      const status = statusMap[workflow.id] ?? workflow.status;
      const isActive = status === "active";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-xl bg-slate-900/60 border border-white/10 p-5",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-medium text-white", children: workflow.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-medium px-2 py-0.5 rounded-full border ${PILLAR_COLORS[workflow.pillar]}`,
                    children: PILLAR_LABELS[workflow.pillar]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`,
                    children: STATUS_LABELS[status]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mb-3", children: workflow.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1", children: "Trigger" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-400", children: workflow.trigger })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1", children: "Actions" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc list-inside text-sm text-slate-400 space-y-0.5", children: workflow.actions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: action }, action)) })
              ] }),
              status === "needs_setup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-orange-400 mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-orange-300", children: "Needs Integration Setup" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-orange-300/80 mt-1", children: [
                    "Requires: ",
                    workflow.setupRequirements.join(", ")
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-row md:flex-col gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `roofing.automation.activate.${workflow.id}`,
                  onClick: () => toggleStatus(workflow.id),
                  className: `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"}`,
                  children: isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3.5 h-3.5" }),
                    " Pause"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5" }),
                    " Activate"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `roofing.automation.edit.${workflow.id}`,
                  className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "w-3.5 h-3.5" }),
                    " Edit"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `roofing.automation.test.${workflow.id}`,
                  className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                    " Test"
                  ]
                }
              )
            ] })
          ] })
        },
        workflow.id
      );
    }) }),
    activeTab === "fundable" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-xl bg-slate-900/60 border border-white/10 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-emerald-400 mt-0.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white mb-1", children: "Funding Disclaimer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "BRF helps organize business credibility, documentation, and fundability readiness. Funding is not guaranteed. Approval depends on lender requirements, revenue, credit profile, documentation, underwriting, and business history." })
      ] })
    ] }) })
  ] });
}
export {
  RoofingAutomationsPage as default
};
