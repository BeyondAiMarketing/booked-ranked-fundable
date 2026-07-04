import { ad as useActor, r as reactExports, j as jsxRuntimeExports } from "./index-CSMRpKtY.js";
import { u as useBusinessBrief } from "./useBusinessBrief-CbePPmC3.js";
function usePerformanceReview() {
  const { actor } = useActor();
  const [insights, setInsights] = reactExports.useState([]);
  const [reports, setReports] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const listInsights = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listPerformanceInsights();
      setInsights(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  const listReports = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listMonthlyReports();
      setReports(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    listInsights();
    listReports();
  }, [listInsights, listReports]);
  const createInsight = reactExports.useCallback(
    async (data) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createPerformanceInsight(data);
        setInsights((prev) => [result, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const updateInsight = reactExports.useCallback(
    async (id, updates) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updatePerformanceInsight(id, updates);
        setInsights(
          (prev) => prev.map((i) => i.id === id ? result : i)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const createReport = reactExports.useCallback(
    async (data) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createMonthlyReport(data);
        setReports((prev) => [result, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const updateReport = reactExports.useCallback(
    async (id, updates) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateMonthlyReport(id, updates);
        setReports(
          (prev) => prev.map((r) => r.id === id ? result : r)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  return {
    insights,
    reports,
    loading,
    error,
    createInsight,
    updateInsight,
    createReport,
    updateReport,
    listInsights,
    listReports
  };
}
function PerformanceReviewPage() {
  var _a, _b;
  const { insights, reports, createReport } = usePerformanceReview();
  usePerformanceReview();
  const { brief, updateBrief } = useBusinessBrief();
  const [showReportForm, setShowReportForm] = reactExports.useState(false);
  const [newReport, setNewReport] = reactExports.useState({
    period: {
      month: (/* @__PURE__ */ new Date()).getMonth() + 1,
      year: (/* @__PURE__ */ new Date()).getFullYear()
    },
    summary: "",
    insights: [],
    recommendations: [],
    bestPerformers: [],
    nextMonthStrategy: ""
  });
  const metrics = [
    {
      label: "Engagement Rate",
      value: "4.2%",
      benchmark: "3.5%",
      trend: "up"
    },
    { label: "Reach", value: "12.5K", benchmark: "10K", trend: "up" },
    {
      label: "Impressions",
      value: "45K",
      benchmark: "40K",
      trend: "up"
    },
    { label: "Clicks", value: "890", benchmark: "750", trend: "up" },
    {
      label: "Conversions",
      value: "34",
      benchmark: "30",
      trend: "stable"
    }
  ];
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      default:
        return "→";
    }
  };
  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };
  const handleUpdateBrief = async () => {
    if (insights == null ? void 0 : insights.length) {
      await updateBrief({
        performanceHistory: [
          ...(brief == null ? void 0 : brief.performanceHistory) || [],
          `Updated: ${(/* @__PURE__ */ new Date()).toISOString()}`
        ],
        contentHistory: [
          ...(brief == null ? void 0 : brief.contentHistory) || [],
          `Reviewed: ${insights.length} insights`
        ]
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-[hsl(232_40%_22%)] text-white p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-2", children: "Performance Review Agent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-400 mb-6", children: "Review content/campaign performance, update best performers, change next month's strategy" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8", children: metrics.map((metric, _idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-gray-800 rounded-lg p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-400 mb-1", children: metric.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold mb-1", children: metric.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-500", children: [
              "vs ",
              metric.benchmark
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${getTrendColor(metric.trend)}`, children: getTrendIcon(metric.trend) })
          ] })
        ]
      },
      `metric-${metric.label}`
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Best Performers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ((_b = (_a = reports == null ? void 0 : reports[0]) == null ? void 0 : _a.bestPerformers) == null ? void 0 : _b.map((performer, _idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-gray-700 rounded-lg p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: performer.platform }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400", children: performer.value })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-400", children: [
                performer.postType,
                " — ",
                performer.reason
              ] })
            ]
          },
          `performer-${performer.platform}-${performer.postType}`
        ))) || /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500 text-center py-4", children: "No best performers recorded yet" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Monthly Reports" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowReportForm(true),
              className: "px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm",
              children: "Create Report"
            }
          )
        ] }),
        showReportForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-700 rounded-lg p-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              placeholder: "Summary",
              value: newReport.summary,
              onChange: (e) => setNewReport((prev) => ({
                ...prev,
                summary: e.target.value
              })),
              className: "w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 mb-2 h-20"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              placeholder: "Next Month Strategy",
              value: newReport.nextMonthStrategy,
              onChange: (e) => setNewReport((prev) => ({
                ...prev,
                nextMonthStrategy: e.target.value
              })),
              className: "w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 h-20"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => createReport(newReport),
                className: "px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm",
                children: "Save"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowReportForm(false),
                className: "px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm",
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: (reports == null ? void 0 : reports.map((report, _idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-gray-700 rounded-lg p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  report.period.month,
                  "/",
                  report.period.year
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", children: new Date(report.createdAt).toLocaleDateString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300", children: report.summary })
            ]
          },
          `report-${report.period.month}-${report.period.year}-${report.createdAt}`
        ))) || /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500 text-center py-4", children: "No reports yet" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: handleUpdateBrief,
        className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg",
        children: "Update Business Brief with Insights"
      }
    )
  ] }) });
}
export {
  PerformanceReviewPage as default
};
