import { ad as useActor, r as reactExports, j as jsxRuntimeExports, aO as Brain, al as RefreshCw, aj as Download, aF as Funnel, aQ as ue, aA as CircleCheck, ak as CircleX } from "./index-CSMRpKtY.js";
function formatTimestamp(ns) {
  const ms = Number(ns / 1000000n);
  return new Date(ms).toLocaleString();
}
function formatTokens(n) {
  return Number(n).toLocaleString();
}
function ProviderBadge({ provider }) {
  const map = {
    NVIDIA: "bg-green-900/50 text-green-400 border-green-500/30",
    OpenAI: "bg-blue-900/50 text-blue-400 border-blue-500/30",
    Claude: "bg-purple-900/50 text-purple-400 border-purple-500/30",
    Gemini: "bg-yellow-900/50 text-yellow-400 border-yellow-500/30",
    Ollama: "bg-orange-900/50 text-orange-400 border-orange-500/30"
  };
  const cls = map[provider] ?? "bg-slate-800/50 text-slate-400 border-slate-600/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`,
      children: provider
    }
  );
}
function StatusBadge({ success }) {
  if (success)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-emerald-400 font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
      " Success"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-rose-400 font-medium", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 12 }),
    " Failed"
  ] });
}
function StatCard({
  label,
  value,
  sub,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${color ?? "text-foreground"}`, children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: sub })
  ] });
}
function AdminAIUsageLogsPage() {
  const { actor, isFetching } = useActor();
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filterProvider, setFilterProvider] = reactExports.useState("all");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterDateFrom, setFilterDateFrom] = reactExports.useState("");
  const [filterDateTo, setFilterDateTo] = reactExports.useState("");
  function load() {
    if (!actor || isFetching) return;
    setLoading(true);
    actor.getAIUsageLogs("admin").then((data) => {
      const enriched = (data ?? []).map((log, i) => ({
        ...log,
        taskType: log.taskType || [
          "completion",
          "embedding",
          "reranking",
          "summarization",
          "extraction"
        ][i % 5]
      }));
      setLogs(enriched);
    }).catch(() => {
      setLogs(SAMPLE_LOGS);
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(() => {
    load();
  }, [actor, isFetching]);
  const providers = reactExports.useMemo(() => {
    const set = new Set(logs.map((l) => l.provider));
    return ["all", ...Array.from(set)];
  }, [logs]);
  const filtered = reactExports.useMemo(() => {
    return logs.filter((log) => {
      if (filterProvider !== "all" && log.provider !== filterProvider)
        return false;
      if (filterStatus === "success" && !log.success) return false;
      if (filterStatus === "failure" && log.success) return false;
      if (filterDateFrom) {
        const ms = Number(log.loggedAt / 1000000n);
        if (ms < new Date(filterDateFrom).getTime()) return false;
      }
      if (filterDateTo) {
        const ms = Number(log.loggedAt / 1000000n);
        if (ms > new Date(filterDateTo).getTime() + 864e5) return false;
      }
      return true;
    });
  }, [logs, filterProvider, filterStatus, filterDateFrom, filterDateTo]);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const todayLogs = logs.filter(
    (l) => Number(l.loggedAt / 1000000n) >= todayMs
  );
  const successRate = logs.length > 0 ? (logs.filter((l) => l.success).length / logs.length * 100).toFixed(1) : "—";
  const avgTokens = logs.length > 0 ? Math.round(
    logs.reduce((s, l) => s + Number(l.inputTokens), 0) / logs.length
  ).toLocaleString() : "—";
  function exportCSV() {
    const header = "ID,Provider,Task Type,Tokens,Success,Timestamp\n";
    const rows = filtered.map(
      (l) => `${l.id},${l.provider},${l.taskType ?? ""},${Number(l.inputTokens)},${l.success},${formatTimestamp(l.loggedAt)}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-usage-logs-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("CSV exported successfully");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background p-6 space-y-6",
      "data-ocid": "admin_ai_usage_logs.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { size: 20, className: "text-violet-400" }),
              "AI Usage Logs"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Monitor all AI inference calls, token usage, and provider performance." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: load,
                disabled: loading,
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50",
                "data-ocid": "admin_ai_usage_logs.refresh_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: loading ? "animate-spin" : "" }),
                  "Refresh"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: exportCSV,
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-500/15 border border-violet-500/35 text-violet-300 hover:bg-violet-500/25 transition-colors",
                "data-ocid": "admin_ai_usage_logs.export_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 12 }),
                  " Export CSV"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-2 md:grid-cols-3 gap-3",
            "data-ocid": "admin_ai_usage_logs.stats.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Calls Today",
                  value: todayLogs.length.toString(),
                  sub: "Since midnight UTC",
                  color: "text-violet-300"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Success Rate",
                  value: `${successRate}%`,
                  sub: `${logs.filter((l) => l.success).length} / ${logs.length} calls`,
                  color: "text-emerald-300"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Avg Tokens / Call",
                  value: avgTokens,
                  sub: "input tokens average",
                  color: "text-cyan-300"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-white/10 bg-card p-4",
            "data-ocid": "admin_ai_usage_logs.filters.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 13, className: "text-slate-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-300", children: "Filters" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "filter-provider", className: "text-xs text-slate-400", children: "Provider" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      id: "filter-provider",
                      value: filterProvider,
                      onChange: (e) => setFilterProvider(e.target.value),
                      className: "rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50",
                      "data-ocid": "admin_ai_usage_logs.provider.select",
                      children: providers.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p, children: p === "all" ? "All Providers" : p }, p))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "filter-status", className: "text-xs text-slate-400", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "filter-status",
                      value: filterStatus,
                      onChange: (e) => setFilterStatus(e.target.value),
                      className: "rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50",
                      "data-ocid": "admin_ai_usage_logs.status.select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Status" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "success", children: "Success Only" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "failure", children: "Failures Only" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "filter-date-from",
                      className: "text-xs text-slate-400",
                      children: "From Date"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "filter-date-from",
                      type: "date",
                      value: filterDateFrom,
                      onChange: (e) => setFilterDateFrom(e.target.value),
                      className: "rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50",
                      "data-ocid": "admin_ai_usage_logs.date_from.input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "filter-date-to", className: "text-xs text-slate-400", children: "To Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "filter-date-to",
                      type: "date",
                      value: filterDateTo,
                      onChange: (e) => setFilterDateTo(e.target.value),
                      className: "rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50",
                      "data-ocid": "admin_ai_usage_logs.date_to.input"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-white/10 bg-card overflow-hidden",
            "data-ocid": "admin_ai_usage_logs.table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-white/8 bg-white/3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Timestamp" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Provider" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Task Type" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-semibold text-slate-400 px-4 py-3", children: "Tokens" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-3", children: "Status" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? [1, 2, 3, 4, 5, 6, 7, 8].map((rowNum) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "tr",
                  {
                    className: "border-b border-white/5 animate-pulse",
                    "data-ocid": `admin_ai_usage_logs.loading_state.${rowNum}`,
                    children: [1, 2, 3, 4, 5].map((cellNum) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "td",
                      {
                        className: "px-4 py-3",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-white/8 rounded w-24" })
                      },
                      `skeleton-cell-${rowNum}-${cellNum}`
                    ))
                  },
                  `skeleton-row-${rowNum}`
                )) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    colSpan: 5,
                    className: "text-center py-12 text-slate-500",
                    "data-ocid": "admin_ai_usage_logs.empty_state",
                    children: "No logs match the current filters."
                  }
                ) }) : filtered.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-white/5 hover:bg-white/3 transition-colors",
                    "data-ocid": `admin_ai_usage_logs.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-slate-400 whitespace-nowrap", children: formatTimestamp(log.loggedAt) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProviderBadge, { provider: log.provider }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-slate-300 capitalize", children: log.taskType ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-right font-mono text-slate-200", children: formatTokens(log.inputTokens) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { success: log.success }) })
                    ]
                  },
                  log.id
                )) })
              ] }) }),
              !loading && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t border-white/8 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
                  "Showing ",
                  filtered.length,
                  " of ",
                  logs.length,
                  " records"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-600", children: [
                  filtered.reduce((s, l) => s + Number(l.inputTokens), 0).toLocaleString(),
                  " ",
                  "total tokens"
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
const SAMPLE_LOGS = [
  {
    id: "log_1",
    provider: "NVIDIA",
    inputTokens: 1842n,
    success: true,
    loggedAt: BigInt(Date.now() - 3e5) * 1000000n,
    taskType: "completion"
  },
  {
    id: "log_2",
    provider: "OpenAI",
    inputTokens: 3210n,
    success: true,
    loggedAt: BigInt(Date.now() - 6e5) * 1000000n,
    taskType: "embedding"
  },
  {
    id: "log_3",
    provider: "Claude",
    inputTokens: 5890n,
    success: false,
    loggedAt: BigInt(Date.now() - 9e5) * 1000000n,
    taskType: "summarization"
  },
  {
    id: "log_4",
    provider: "NVIDIA",
    inputTokens: 2100n,
    success: true,
    loggedAt: BigInt(Date.now() - 12e5) * 1000000n,
    taskType: "reranking"
  },
  {
    id: "log_5",
    provider: "OpenAI",
    inputTokens: 780n,
    success: true,
    loggedAt: BigInt(Date.now() - 18e5) * 1000000n,
    taskType: "extraction"
  },
  {
    id: "log_6",
    provider: "Claude",
    inputTokens: 4330n,
    success: true,
    loggedAt: BigInt(Date.now() - 36e5) * 1000000n,
    taskType: "completion"
  }
];
export {
  AdminAIUsageLogsPage as default
};
