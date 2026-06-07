import { r as reactExports, j as jsxRuntimeExports, F as FileText, av as Card, aA as CardHeader, n as ChartNoAxesColumn, aC as CircleCheck, ak as Sparkles, aB as CardTitle, aw as CardContent, B as Button, an as RefreshCw, aL as Dialog, aM as DialogContent, aN as DialogHeader, aO as DialogTitle, al as Download, i as Clock } from "./index-CI0aYo5Z.js";
import { u as useRagBrain } from "./useRagBrain-D-q8xqhh.js";
const INITIAL_REPORTS = [
  {
    id: "weekly-summary",
    title: "Weekly Summary",
    description: "Performance highlights, lead activity, and review sentiment from the last 7 days.",
    nodeType: "ReportNarrator",
    lastGenerated: "May 19, 2026",
    status: "Ready",
    content: "This week your business received 12 new leads, 3 booked appointments, and 4 new Google reviews averaging 4.8 stars. Lead response time improved by 18% compared to last week. Your top lead source remains Google My Business at 64%. Recommend prioritizing follow-up with the 6 untouched leads in your CRM before Friday."
  },
  {
    id: "monthly-performance",
    title: "Monthly Performance",
    description: "Full monthly analytics: revenue, conversion rates, and growth trends.",
    nodeType: "ReportNarrator",
    lastGenerated: "May 1, 2026",
    status: "Ready",
    content: "April performance summary: 47 total leads, 19 converted to estimates, 11 closed jobs with estimated revenue of $28,400. Conversion rate of 23% is up from 18% in March. Review velocity increased: 14 new reviews vs. 9 in March. Recommendation: increase review request frequency — you close at higher rates when you have more recent reviews."
  },
  {
    id: "funding-readiness",
    title: "Funding Readiness",
    description: "Current fundability score, open action items, and next milestone checklist.",
    nodeType: "ReportNarrator",
    lastGenerated: "May 15, 2026",
    status: "Ready",
    content: "Funding readiness score: 72/100. Your business is on track for Tier 2 vendor credit. Completed: EIN registration, business bank account, Net-30 vendor accounts (2 of 3). Pending: DUNS number verification, 3-month bank statement history. Next milestone: apply for your third Net-30 account within 30 days."
  },
  {
    id: "lead-quality",
    title: "Lead Quality Analysis",
    description: "AI scoring of your leads by intent, fit, and estimated deal value.",
    nodeType: "LeadEnrichment",
    lastGenerated: "May 20, 2026",
    status: "Pending"
  }
];
const STATUS_ICONS = {
  Ready: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
  Generating: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 animate-spin" }),
  Pending: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" })
};
const STATUS_STYLES = {
  Ready: "bg-[oklch(0.62_0.18_155/0.15)] text-[oklch(0.72_0.18_155)] border-[oklch(0.62_0.18_155/0.3)]",
  Generating: "bg-[oklch(0.62_0.2_200/0.15)] text-[oklch(0.72_0.2_200)] border-[oklch(0.62_0.2_200/0.3)]",
  Pending: "bg-[oklch(0.72_0.18_75/0.15)] text-[oklch(0.82_0.16_75)] border-[oklch(0.72_0.18_75/0.3)]"
};
function ClientAIReportsPage() {
  const { runAgentNode, isLoading } = useRagBrain();
  const [reports, setReports] = reactExports.useState(INITIAL_REPORTS);
  const [viewing, setViewing] = reactExports.useState(null);
  const handleGenerate = reactExports.useCallback(
    async (reportId, nodeType) => {
      setReports(
        (prev) => prev.map(
          (r) => r.id === reportId ? { ...r, status: "Generating" } : r
        )
      );
      const result = await runAgentNode(nodeType, JSON.stringify({ reportId }));
      setReports(
        (prev) => prev.map(
          (r) => r.id === reportId ? {
            ...r,
            status: "Ready",
            lastGenerated: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }),
            content: (result == null ? void 0 : result.outputData) ?? r.content ?? "Report generated successfully."
          } : r
        )
      );
    },
    [runAgentNode]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "ai-reports.page", className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-5 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-[oklch(0.58_0.22_290/0.15)] border border-[oklch(0.58_0.22_290/0.3)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5 text-[oklch(0.72_0.18_290)]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground", children: "AI Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Automated intelligence reports for your business" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
        reports.filter((r) => r.status === "Ready").length,
        " ready"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4", children: reports.map((report, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Card,
      {
        "data-ocid": `ai-reports.item.${idx + 1}`,
        className: "bg-card border-border hover:border-primary/30 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-9 h-9 rounded-lg bg-[oklch(0.58_0.22_290/0.12)] border border-[oklch(0.58_0.22_290/0.25)] flex items-center justify-center text-[oklch(0.72_0.18_290)]", children: [
                report.id === "weekly-summary" && /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-5 h-5" }),
                report.id === "monthly-performance" && /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-5 h-5" }),
                report.id === "funding-readiness" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5" }),
                report.id === "lead-quality" && /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: report.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Last generated: ",
                  report.lastGenerated
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${STATUS_STYLES[report.status]}`,
                children: [
                  STATUS_ICONS[report.status],
                  report.status
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 line-clamp-2", children: report.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              report.status === "Ready" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `ai-reports.view_button.${idx + 1}`,
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "flex-1 text-xs",
                  onClick: () => setViewing(report),
                  children: "View Report"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `ai-reports.generate_button.${idx + 1}`,
                  type: "button",
                  size: "sm",
                  variant: report.status === "Ready" ? "ghost" : "default",
                  className: "flex-1 text-xs",
                  disabled: isLoading || report.status === "Generating",
                  onClick: () => handleGenerate(report.id, report.nodeType),
                  children: report.status === "Generating" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1.5 animate-spin" }),
                    "Generating…"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 mr-1.5" }),
                    "Generate Now"
                  ] })
                }
              )
            ] })
          ] })
        ]
      },
      report.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!viewing,
        onOpenChange: (open) => !open && setViewing(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            "data-ocid": "ai-reports.dialog",
            className: "bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-primary" }),
                viewing == null ? void 0 : viewing.title
              ] }) }),
              viewing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[viewing.status]}`,
                      children: [
                        STATUS_ICONS[viewing.status],
                        viewing.status
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    "Generated: ",
                    viewing.lastGenerated
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-muted/40 border border-border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap", children: viewing.content ?? "Report content will appear here once generated." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "ai-reports.close_button",
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => setViewing(null),
                      children: "Close"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      className: "bg-primary hover:bg-primary/90",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5 mr-1.5" }),
                        "Download"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  ClientAIReportsPage as default
};
