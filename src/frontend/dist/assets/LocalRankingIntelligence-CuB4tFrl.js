import { j as jsxRuntimeExports, ad as useActor, a as useQueryClient, r as reactExports, u as useQuery, b as useMutation, b7 as MapPin, al as RefreshCw, T as TrendingUp } from "./index-Dwzp0QDY.js";
const DIRECTION_ORDER = ["NW", "N", "NE", "W", "Center", "E", "SW", "S", "SE"];
function getRankColor(rankPosition, searched) {
  if (!searched) return "bg-slate-700/50 border-slate-600/40 text-slate-400";
  if (rankPosition <= 3n)
    return "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
  if (rankPosition <= 10n)
    return "bg-amber-500/20 border-amber-500/50 text-amber-300";
  return "bg-red-500/20 border-red-500/50 text-red-300";
}
function getRankLabel(rankPosition, searched) {
  if (!searched) return "—";
  if (rankPosition === 0n) return "Not Found";
  return `#${rankPosition}`;
}
const RankingHeatMap = ({
  gridPoints,
  showCompetitors
}) => {
  const pointMap = new Map(gridPoints.map((p) => [p.direction, p]));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 w-full max-w-xs mx-auto", children: DIRECTION_ORDER.map((dir) => {
    const point = pointMap.get(dir);
    const isCenter = dir === "Center";
    const colorClass = point ? getRankColor(point.rankPosition, point.searched) : "bg-slate-700/50 border-slate-600/40 text-slate-500";
    const rankLabel = point ? getRankLabel(point.rankPosition, point.searched) : "—";
    const competitor = (point == null ? void 0 : point.competitorAtTop) ?? "";
    const tooltipText = (point == null ? void 0 : point.searched) ? `Rank ${rankLabel} here${competitor ? `. Top: ${competitor}` : ""}` : dir;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        title: tooltipText,
        className: `${colorClass} border rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-default p-2 ${isCenter ? "min-h-[80px] ring-2 ring-blue-400/60 bg-blue-500/10" : "min-h-[62px]"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: dir }),
          isCenter && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: "\\uD83C\\uDFE0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `font-bold leading-none ${isCenter ? "text-sm" : "text-xs"}`,
              children: rankLabel
            }
          ),
          showCompetitors && competitor && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-center leading-tight mt-0.5 text-slate-400 max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap",
              style: { fontSize: 9 },
              children: competitor
            }
          )
        ]
      },
      dir
    );
  }) });
};
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function countCells(gridPoints) {
  let green = 0;
  let yellow = 0;
  let red = 0;
  for (const p of gridPoints) {
    if (!p.searched) continue;
    if (p.rankPosition <= 3n) green++;
    else if (p.rankPosition <= 10n) yellow++;
    else red++;
  }
  return { green, yellow, red };
}
function LocalRankingIntelligence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [showCompetitors, setShowCompetitors] = reactExports.useState(false);
  const [leadEmail] = reactExports.useState("demo@roofinglead.com");
  const auditQuery = useQuery({
    queryKey: ["gridAudit", leadEmail],
    queryFn: () => actor.getGridAudit(leadEmail),
    enabled: !!actor
  });
  const historyQuery = useQuery({
    queryKey: ["gridHistory", leadEmail],
    queryFn: () => actor.getGridHistory(leadEmail),
    enabled: !!actor
  });
  const rescanMutation = useMutation({
    mutationFn: () => actor.triggerGridAudit(leadEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gridAudit", leadEmail] });
      queryClient.invalidateQueries({ queryKey: ["gridHistory", leadEmail] });
    }
  });
  const auditResult = auditQuery.data ?? null;
  const historyList = historyQuery.data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Local Ranking Intelligence" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 mt-1", children: "See exactly where you rank on Google Maps — not just at your front door." })
    ] }),
    auditQuery.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "ranking.loading_state",
        className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-8 text-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-700 rounded w-48 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-700 rounded w-32 mx-auto" })
        ] })
      }
    ),
    !auditQuery.isLoading && !auditResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "ranking.empty_state",
        className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-10 flex flex-col items-center gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-10 h-10 text-blue-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Run your first ranking audit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-center max-w-sm", children: "Find out exactly where customers can find you on Google Maps — and where you're invisible." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "data-ocid": "ranking.run_audit_button",
              type: "button",
              onClick: () => rescanMutation.mutate(),
              disabled: rescanMutation.isPending,
              className: "px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60",
              children: rescanMutation.isPending ? "Running Audit..." : "Run Audit"
            }
          )
        ]
      }
    ),
    auditResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm rounded-xl p-5 flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-blue-300 mb-0.5", children: "Your Coverage Zone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium", children: auditResult.coverageZoneSummary })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 text-sm", children: [
          "Last scanned:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: formatDate(auditResult.scannedAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            "data-ocid": "ranking.rescan_button",
            type: "button",
            onClick: () => rescanMutation.mutate(),
            disabled: rescanMutation.isPending,
            title: "Uses 9 SerpApi credits",
            className: "flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-sm text-slate-200 rounded-lg transition-colors disabled:opacity-60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `w-4 h-4 ${rescanMutation.isPending ? "animate-spin" : ""}`
                }
              ),
              rescanMutation.isPending ? "Scanning..." : "Rescan Now"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold text-white", children: [
            "Ranking Grid — ",
            auditResult.city
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "competitors-toggle",
              className: "flex items-center gap-2 text-sm text-slate-400 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Show Competitors" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    id: "competitors-toggle",
                    "data-ocid": "ranking.competitors_toggle",
                    type: "button",
                    "aria-label": showCompetitors ? "Hide competitors" : "Show competitors",
                    "aria-pressed": showCompetitors,
                    className: `relative w-9 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${showCompetitors ? "bg-blue-600" : "bg-slate-600"}`,
                    onClick: () => setShowCompetitors((v) => !v),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${showCompetitors ? "translate-x-4" : "translate-x-0.5"}`
                      }
                    )
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RankingHeatMap,
          {
            gridPoints: auditResult.gridPoints,
            showCompetitors
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-4 text-xs text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded bg-emerald-500/40 inline-block" }),
            " ",
            "Top 3"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded bg-amber-500/40 inline-block" }),
            " ",
            "4\\u201310"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded bg-red-500/40 inline-block" }),
            " ",
            "Not visible"
          ] })
        ] })
      ] }),
      historyList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold text-white mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-blue-400" }),
          "Ranking History"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: historyList.slice(0, 4).map((snap) => {
          const counts = countCells(snap.result.gridPoints);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 text-sm", children: formatDate(snap.snapshotAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400", children: [
                    counts.green,
                    " top 3"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-400", children: [
                    counts.yellow,
                    " mid"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400", children: [
                    counts.red,
                    " invisible"
                  ] })
                ] })
              ]
            },
            String(snap.snapshotAt)
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-xl p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white mb-1", children: "Want to dominate all 9 zones?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mb-4", children: "Get a free strategy call and we'll show you exactly how to expand your coverage area." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            "data-ocid": "ranking.strategy_call_link",
            href: "/demo",
            className: "inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors",
            children: "Book a Free Strategy Call"
          }
        )
      ] })
    ] })
  ] });
}
export {
  LocalRankingIntelligence as default
};
