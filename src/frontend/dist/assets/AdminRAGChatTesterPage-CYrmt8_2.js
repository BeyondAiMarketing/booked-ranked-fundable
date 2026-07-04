import { c as createLucideIcon, j as jsxRuntimeExports, B as Button, l as LoaderCircle, d as TriangleAlert, aA as CircleCheck, aU as BookOpen, aS as ScrollArea, as as Badge, r as reactExports, at as Card, aV as FlaskConical, al as RefreshCw } from "./index-CSMRpKtY.js";
import { u as useRagBrain } from "./useRagBrain-C5N1Kkvl.js";
import { A as ALL_COLLECTIONS } from "./ragBrain-DAXH8__s.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2", key: "125lnx" }],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }],
  ["path", { d: "M14.5 16h-5", key: "1ox875" }]
];
const TestTube = createLucideIcon("test-tube", __iconNode);
function RAGQueryPanel({
  result,
  isLoading,
  selectedCollection,
  question,
  onQuestionChange,
  onCollectionChange,
  collections,
  onSubmit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: selectedCollection,
          onChange: (e) => onCollectionChange(e.target.value),
          className: "rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-48",
          "data-ocid": "rag.collection_select",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select collection" }),
            collections.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c.replace(/([A-Z])/g, " $1").trim() }, c))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: question,
          onChange: (e) => onQuestionChange(e.target.value),
          placeholder: "Ask a question about your knowledge base...",
          className: "flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
          onKeyDown: (e) => e.key === "Enter" && onSubmit(),
          "data-ocid": "rag.question_input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: onSubmit,
          disabled: isLoading || !question.trim() || !selectedCollection,
          className: "shrink-0",
          "data-ocid": "rag.submit_button",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Query"
        }
      )
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      result.isInsufficient ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-amber-300", children: "Insufficient Context" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-amber-400/80", children: result.insufficiencyMessage || "Not enough relevant documents found. Upload more content to this collection." })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-emerald-300", children: "Answer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-foreground", children: result.answer })
      ] }),
      result.chunks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: [
            "Retrieved Chunks (",
            result.chunks.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: result.chunks.map((chunk, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border/50 bg-muted/30 p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                  "Chunk #",
                  i + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "idx ",
                  String(chunk.chunkIndex)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-3 text-xs text-muted-foreground", children: chunk.content })
            ]
          },
          chunk.id
        )) }) })
      ] }),
      result.citations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Sources:" }),
        result.citations.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "border-primary/30 bg-primary/10 text-xs text-primary",
            children: c
          },
          c
        ))
      ] })
    ] })
  ] });
}
function AdminRAGChatTesterPage() {
  const { queryRAG, getUsageLogs, isLoading } = useRagBrain();
  const [selectedCollection, setSelectedCollection] = reactExports.useState("");
  const [question, setQuestion] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const [usageLogs, setUsageLogs] = reactExports.useState([]);
  const [loadingLogs, setLoadingLogs] = reactExports.useState(false);
  const loadLogs = reactExports.useCallback(async () => {
    setLoadingLogs(true);
    const logs = await getUsageLogs();
    if (logs) setUsageLogs(logs.slice(0, 20));
    setLoadingLogs(false);
  }, [getUsageLogs]);
  reactExports.useEffect(() => {
    loadLogs();
  }, [loadLogs]);
  const handleQuery = async () => {
    if (!selectedCollection || !question.trim()) return;
    const res = await queryRAG(question, selectedCollection);
    if (res) setResult(res);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex h-10 w-10 items-center justify-center rounded-xl",
          style: {
            background: "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
            boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(TestTube, { className: "h-5 w-5 text-[oklch(0.62_0.2_200)]" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "RAG Chat Tester" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Test knowledge retrieval across your collections" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border border-border/60 bg-card/80 p-5 backdrop-blur-sm",
          "data-ocid": "rag-tester.query_panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-4 w-4 text-[oklch(0.62_0.2_200)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Query Interface" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RAGQueryPanel,
              {
                result,
                isLoading,
                selectedCollection,
                question,
                onQuestionChange: setQuestion,
                onCollectionChange: (v) => setSelectedCollection(v),
                collections: ALL_COLLECTIONS,
                onSubmit: handleQuery
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "border border-border/60 bg-card/80 p-5 backdrop-blur-sm",
          "data-ocid": "rag-tester.usage_log_panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Usage Log" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: loadLogs,
                  disabled: loadingLogs,
                  className: "h-7 px-2",
                  "data-ocid": "rag-tester.refresh_logs_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" })
                }
              )
            ] }),
            loadingLogs ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-96", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              usageLogs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "py-6 text-center text-xs text-muted-foreground",
                  "data-ocid": "rag-tester.logs_empty_state",
                  children: "No usage logs yet"
                }
              ),
              usageLogs.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg border border-border/40 bg-muted/30 p-3",
                  "data-ocid": `rag-tester.log.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: log.provider }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-xs font-medium ${log.success ? "text-emerald-400" : "text-rose-400"}`,
                          children: log.success ? "OK" : "ERR"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: log.taskCategory }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        log.inputTokens + (log.outputTokens ?? 0),
                        " tok"
                      ] })
                    ] })
                  ]
                },
                log.id
              ))
            ] }) })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  AdminRAGChatTesterPage as default
};
