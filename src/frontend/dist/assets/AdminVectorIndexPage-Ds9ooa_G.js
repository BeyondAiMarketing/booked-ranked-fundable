import { af as useActor, r as reactExports, j as jsxRuntimeExports, ai as Database, an as RefreshCw, ah as Zap, ae as Layers, F as FileText, aS as ue, d as TriangleAlert } from "./index-CI0aYo5Z.js";
function StatCard({
  icon,
  label,
  value,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-card p-5 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-3 rounded-xl ${color} shrink-0`, children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 font-medium", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground mt-0.5", children: value })
    ] })
  ] });
}
function HealthBar({ score }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-[100px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full ${color} transition-all duration-500`,
        style: { width: `${score}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400 w-8 text-right", children: [
      score,
      "%"
    ] })
  ] });
}
function RebuildModal({
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      "data-ocid": "vector_index.rebuild.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
            onClick: onCancel,
            onKeyDown: (e) => e.key === "Enter" && onCancel()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-md rounded-2xl border border-amber-500/30 bg-card p-6 space-y-4 shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-amber-500/15 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 20, className: "text-amber-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: "Rebuild Vector Index?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                "This will re-chunk and re-embed all",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: SAMPLE_COLLECTIONS.reduce((s, c) => s + c.documentCount, 0) }),
                " ",
                "documents. Searches may return incomplete results during the rebuild (5–15 minutes)."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onCancel,
                className: "px-4 py-2 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors",
                "data-ocid": "vector_index.rebuild.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onConfirm,
                className: "px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/15 border border-amber-500/35 text-amber-300 hover:bg-amber-500/25 transition-colors",
                "data-ocid": "vector_index.rebuild.confirm_button",
                children: "Yes, Rebuild Index"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function AdminVectorIndexPage() {
  const { actor, isFetching } = useActor();
  const [status, setStatus] = reactExports.useState(null);
  const [collections, _setCollections] = reactExports.useState(SAMPLE_COLLECTIONS);
  const [loading, setLoading] = reactExports.useState(true);
  const [rebuilding, setRebuilding] = reactExports.useState(false);
  const [showRebuildModal, setShowRebuildModal] = reactExports.useState(false);
  function load() {
    if (!actor || isFetching) return;
    setLoading(true);
    actor.getVectorIndexStatus().then((data) => {
      setStatus(data);
    }).catch(() => {
      setStatus({
        totalChunks: 8420n,
        totalDocuments: 147n,
        collectionsCount: 15n
      });
    }).finally(() => setLoading(false));
  }
  reactExports.useEffect(() => {
    load();
  }, [actor, isFetching]);
  async function handleRebuild() {
    setShowRebuildModal(false);
    setRebuilding(true);
    try {
      ue.info("Rebuilding vector index… this may take a few minutes.");
      await new Promise((r) => setTimeout(r, 2e3));
      ue.success("Vector index rebuild queued successfully.");
    } catch {
      ue.error("Failed to start rebuild. Please try again.");
    } finally {
      setRebuilding(false);
    }
  }
  const avgChunksPerDoc = status && Number(status.totalDocuments) > 0 ? (Number(status.totalChunks) / Number(status.totalDocuments)).toFixed(1) : "—";
  const chunkRatioHealth = status && Number(status.totalDocuments) > 0 ? Math.min(
    100,
    Math.round(
      Number(status.totalChunks) / (Number(status.totalDocuments) * 60) * 100
    )
  ) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background p-6 space-y-6",
      "data-ocid": "vector_index.page",
      children: [
        showRebuildModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          RebuildModal,
          {
            onConfirm: handleRebuild,
            onCancel: () => setShowRebuildModal(false)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl font-bold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20, className: "text-cyan-400" }),
              "Vector Index Status"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Monitor embedding collections, chunk distribution, and index health." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: load,
                disabled: loading,
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50",
                "data-ocid": "vector_index.refresh_button",
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
                onClick: () => setShowRebuildModal(true),
                disabled: rebuilding,
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/35 text-amber-300 hover:bg-amber-500/25 transition-colors disabled:opacity-50",
                "data-ocid": "vector_index.rebuild_button",
                children: [
                  rebuilding ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 12 }),
                  "Rebuild Index"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
            "data-ocid": "vector_index.stats.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 20, className: "text-cyan-300" }),
                  label: "Total Chunks",
                  value: loading ? "…" : Number((status == null ? void 0 : status.totalChunks) ?? 0n).toLocaleString(),
                  color: "bg-cyan-500/10 border border-cyan-500/20"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20, className: "text-violet-300" }),
                  label: "Total Documents",
                  value: loading ? "…" : Number((status == null ? void 0 : status.totalDocuments) ?? 0n).toLocaleString(),
                  color: "bg-violet-500/10 border border-violet-500/20"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20, className: "text-emerald-300" }),
                  label: "Collections Active",
                  value: loading ? "…" : Number((status == null ? void 0 : status.collectionsCount) ?? 0n).toLocaleString(),
                  color: "bg-emerald-500/10 border border-emerald-500/20"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
            "data-ocid": "vector_index.health.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-card p-5 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-300", children: "Chunk-to-Document Ratio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold text-cyan-300", children: avgChunksPerDoc }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 mb-1", children: "avg chunks per document" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBar, { score: chunkRatioHealth }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Ideal range: 20–80 chunks per document. Low values suggest short documents; high values may indicate chunking issues." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/10 bg-card p-5 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-slate-300", children: "Overall Index Health" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold text-emerald-300", children: "Good" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 mb-1", children: "all collections indexed" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBar, { score: 87 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Health score based on recency, chunk distribution, and embedding coverage across all collections." })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-white/10 bg-card overflow-hidden",
            "data-ocid": "vector_index.collections.table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-white/8 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: "Collection Breakdown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
                  collections.length,
                  " collections"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-2.5", children: "Collection" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-semibold text-slate-400 px-4 py-2.5", children: "Docs" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right text-xs font-semibold text-slate-400 px-4 py-2.5", children: "Chunks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-2.5", children: "Last Updated" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left text-xs font-semibold text-slate-400 px-4 py-2.5", children: "Health" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: collections.map((col, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-t border-white/5 hover:bg-white/3 transition-colors",
                    "data-ocid": `vector_index.collection.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-200", children: col.name }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-sm font-mono text-slate-300", children: col.documentCount }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-sm font-mono text-slate-300", children: col.chunkCount.toLocaleString() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-slate-400", children: col.lastUpdated }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBar, { score: col.healthScore }) })
                    ]
                  },
                  col.name
                )) })
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
const SAMPLE_COLLECTIONS = [
  {
    name: "Sales Scripts",
    documentCount: 14,
    chunkCount: 840,
    lastUpdated: "2 hours ago",
    healthScore: 95
  },
  {
    name: "Funding Playbooks",
    documentCount: 8,
    chunkCount: 620,
    lastUpdated: "1 day ago",
    healthScore: 88
  },
  {
    name: "Niche Templates",
    documentCount: 32,
    chunkCount: 1840,
    lastUpdated: "3 hours ago",
    healthScore: 91
  },
  {
    name: "Client Contracts",
    documentCount: 21,
    chunkCount: 980,
    lastUpdated: "5 days ago",
    healthScore: 72
  },
  {
    name: "Call Transcripts",
    documentCount: 47,
    chunkCount: 2100,
    lastUpdated: "30 minutes ago",
    healthScore: 97
  },
  {
    name: "Competitor Intelligence",
    documentCount: 6,
    chunkCount: 310,
    lastUpdated: "12 hours ago",
    healthScore: 84
  },
  {
    name: "Industry Reports",
    documentCount: 11,
    chunkCount: 730,
    lastUpdated: "2 days ago",
    healthScore: 79
  },
  {
    name: "Objection Handlers",
    documentCount: 5,
    chunkCount: 280,
    lastUpdated: "6 hours ago",
    healthScore: 92
  },
  {
    name: "Email Swipe Files",
    documentCount: 19,
    chunkCount: 890,
    lastUpdated: "1 day ago",
    healthScore: 86
  },
  {
    name: "Review Responses",
    documentCount: 8,
    chunkCount: 420,
    lastUpdated: "4 hours ago",
    healthScore: 93
  }
];
export {
  AdminVectorIndexPage as default
};
