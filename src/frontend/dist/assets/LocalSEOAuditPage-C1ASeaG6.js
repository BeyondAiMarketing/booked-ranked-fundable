import { r as reactExports, j as jsxRuntimeExports, a1 as Search, an as Building2, b7 as MapPin, bF as Star, am as Globe, T as TrendingUp, e as ChevronUp, f as ChevronDown, aA as CircleCheck, ak as CircleX, C as ChartColumn } from "./index-iniFfpN1.js";
const AUDIT_CATEGORIES = [
  {
    name: "Google Business Profile",
    score: 72,
    icon: Building2,
    items: [
      { label: "Business name optimized", status: "pass" },
      { label: "Primary category set", status: "pass" },
      {
        label: "Service attributes filled",
        status: "warning",
        note: "3 of 8 missing"
      },
      { label: "Photos uploaded (10+)", status: "fail", note: "Only 4 photos" },
      { label: "Q&A section active", status: "warning", note: "2 unanswered" }
    ]
  },
  {
    name: "Local SEO",
    score: 58,
    icon: MapPin,
    items: [
      {
        label: "NAP consistency",
        status: "warning",
        note: "Minor mismatch on Yelp"
      },
      { label: "Local citations (20+)", status: "fail", note: "Only 8 found" },
      { label: "City pages live", status: "fail", note: "0 city pages" },
      { label: "Schema markup", status: "pass" },
      { label: "Local backlinks", status: "warning", note: "3 weak links" }
    ]
  },
  {
    name: "Reviews & Reputation",
    score: 81,
    icon: Star,
    items: [
      { label: "Total reviews (20+)", status: "pass", note: "34 reviews" },
      { label: "Average rating 4.5+", status: "pass", note: "4.7 stars" },
      { label: "Response rate >80%", status: "pass", note: "92%" },
      { label: "Review velocity", status: "warning", note: "Slowing down" },
      { label: "Negative reply protocol", status: "pass" }
    ]
  },
  {
    name: "Website & Content",
    score: 45,
    icon: Globe,
    items: [
      { label: "Location page present", status: "fail", note: "Missing" },
      {
        label: "Service keywords in H1",
        status: "warning",
        note: "Weak match"
      },
      { label: "Mobile speed <3s", status: "fail", note: "5.2s" },
      { label: "Local content strategy", status: "fail", note: "No blog" },
      { label: "Internal linking", status: "warning", note: "Sparse" }
    ]
  },
  {
    name: "Competitive Position",
    score: 63,
    icon: TrendingUp,
    items: [
      { label: "Map pack presence", status: "warning", note: "Position 4-6" },
      {
        label: "Competitor review gap",
        status: "pass",
        note: "Ahead of 2 rivals"
      },
      { label: "Citation gap", status: "fail", note: "Behind top 3" },
      {
        label: "Content freshness",
        status: "warning",
        note: "Older than rivals"
      }
    ]
  }
];
const OVERALL_SCORE = Math.round(
  AUDIT_CATEGORIES.reduce((sum, cat) => sum + cat.score, 0) / AUDIT_CATEGORIES.length
);
function getScoreColor(score) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
}
function getScoreBg(score) {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
  if (score >= 60) return "bg-amber-500/10 border-amber-500/30";
  return "bg-rose-500/10 border-rose-500/30";
}
function getScoreRing(score) {
  if (score >= 80) return "oklch(0.62 0.18 155)";
  if (score >= 60) return "oklch(0.72 0.18 75)";
  return "oklch(0.58 0.22 25)";
}
function LocalSEOAuditPage() {
  const [expandedCategories, setExpandedCategories] = reactExports.useState([
    "Google Business Profile"
  ]);
  const toggleCategory = (name) => {
    setExpandedCategories(
      (prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };
  const scorePercentage = OVERALL_SCORE / 100 * 360;
  const ringColor = getScoreRing(OVERALL_SCORE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Local SEO Audit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Full local presence audit with actionable fixes." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "localseo.audit.run_button",
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-medium transition-colors border border-indigo-500/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 16 }),
            "Run New Audit"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-32 h-32 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            className: "w-full h-full -rotate-90",
            viewBox: "0 0 100 100",
            "aria-label": `Local SEO audit overall score: ${OVERALL_SCORE} out of 100`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: `Local SEO Audit Score: ${OVERALL_SCORE}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: "50",
                  cy: "50",
                  r: "42",
                  fill: "none",
                  stroke: "oklch(1 0 0 / 10%)",
                  strokeWidth: "8"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: "50",
                  cy: "50",
                  r: "42",
                  fill: "none",
                  stroke: ringColor,
                  strokeWidth: "8",
                  strokeLinecap: "round",
                  strokeDasharray: `${scorePercentage / 360 * 264} 264`,
                  className: "transition-all duration-1000"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-2xl font-bold ${getScoreColor(OVERALL_SCORE)}`,
              children: OVERALL_SCORE
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase tracking-wider", children: "Score" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 w-full", children: AUDIT_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `p-3 rounded-lg border ${getScoreBg(cat.score)}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Icon,
                {
                  size: 16,
                  className: `mb-2 ${getScoreColor(cat.score)}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `text-lg font-bold ${getScoreColor(cat.score)}`,
                  children: cat.score
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 leading-tight", children: cat.name })
            ]
          },
          cat.name
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Audit Details" }),
      AUDIT_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isExpanded = expandedCategories.includes(category.name);
        const passCount = category.items.filter(
          (i) => i.status === "pass"
        ).length;
        const failCount = category.items.filter(
          (i) => i.status === "fail"
        ).length;
        const warningCount = category.items.filter(
          (i) => i.status === "warning"
        ).length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `localseo.category.${category.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.toggle`,
                  onClick: () => toggleCategory(category.name),
                  className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `p-1.5 rounded-md ${getScoreBg(category.score)}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16, className: getScoreColor(category.score) })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-left", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: category.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `text-xs font-bold ${getScoreColor(category.score)}`,
                            children: category.score
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-400", children: [
                          passCount,
                          " pass"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-amber-400", children: [
                          warningCount,
                          " warning"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-rose-400", children: [
                          failCount,
                          " fail"
                        ] })
                      ] })
                    ] }),
                    isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16, className: "text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: "text-slate-400" })
                  ]
                }
              ),
              isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/[0.06] px-4 py-3 space-y-2", children: category.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `localseo.item.${idx + 1}.row`,
                  className: "flex items-start gap-3 py-2",
                  children: [
                    item.status === "pass" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheck,
                      {
                        size: 16,
                        className: "text-emerald-400 mt-0.5 shrink-0"
                      }
                    ),
                    item.status === "fail" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleX,
                      {
                        size: 16,
                        className: "text-rose-400 mt-0.5 shrink-0"
                      }
                    ),
                    item.status === "warning" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ChartColumn,
                      {
                        size: 16,
                        className: "text-amber-400 mt-0.5 shrink-0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white", children: item.label }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${item.status === "pass" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : item.status === "fail" ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"}`,
                            children: item.status
                          }
                        )
                      ] }),
                      item.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: item.note })
                    ] })
                  ]
                },
                item.label
              )) })
            ]
          },
          category.name
        );
      })
    ] })
  ] });
}
export {
  LocalSEOAuditPage as default
};
