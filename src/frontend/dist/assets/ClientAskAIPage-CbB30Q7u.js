import { r as reactExports, j as jsxRuntimeExports, ai as Sparkles, f as ChevronDown, aW as Bot, bb as Info, bc as Mic, B as Button, S as Send } from "./index-iniFfpN1.js";
import { u as useRagBrain } from "./useRagBrain-BhqiHqwE.js";
import { A as ALL_COLLECTIONS } from "./ragBrain-DAXH8__s.js";
const COLLECTION_LABELS = {
  SalesScripts: "Sales Scripts",
  FundingPlaybooks: "Funding Playbooks",
  NicheTemplates: "Niche Templates",
  ClientContracts: "Client Contracts",
  CallTranscripts: "Call Transcripts",
  ReviewResponses: "Review Responses",
  OnboardingGuides: "Onboarding Guides",
  CompetitorIntel: "Competitor Intelligence",
  PricingGuides: "Pricing Guides",
  ObjectionHandlers: "Objection Handlers",
  CaseStudies: "Case Studies",
  EmailSequences: "Email Sequences",
  SocialContent: "Social Content",
  SopLibrary: "SOP Library",
  Custom: "Custom"
};
const SESSION_ID = `client-ask-ai-${Date.now()}`;
function ClientAskAIPage() {
  const { queryRAG, getConversationHistory, addMessage, isLoading } = useRagBrain();
  const [selectedCollection, setSelectedCollection] = reactExports.useState("SalesScripts");
  const [input, setInput] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([]);
  const [showPicker, setShowPicker] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    getConversationHistory(SESSION_ID).then((msgs) => {
      if (msgs && msgs.length > 0) setMessages(msgs);
    });
  }, []);
  reactExports.useEffect(() => {
    var _a;
    (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = reactExports.useCallback(async () => {
    const q = input.trim();
    if (!q || isLoading) return;
    setInput("");
    const userMsg = {
      id: `u-${Date.now()}`,
      role: "User",
      content: q,
      citations: [],
      tenantId: "client",
      sessionId: SESSION_ID,
      timestamp: BigInt(Date.now())
    };
    setMessages((prev) => [...prev, userMsg]);
    await addMessage(SESSION_ID, "User", q);
    const result = await queryRAG(q, selectedCollection);
    const assistantContent = result ? result.isInsufficient ? result.insufficiencyMessage || "Not enough info in this collection." : result.answer : "Connection issue — please try again.";
    const aiMsg = {
      id: `a-${Date.now()}`,
      role: "Assistant",
      content: assistantContent,
      citations: (result == null ? void 0 : result.citations) ?? [],
      tenantId: "client",
      sessionId: SESSION_ID,
      timestamp: BigInt(Date.now())
    };
    setMessages((prev) => [...prev, aiMsg]);
    await addMessage(SESSION_ID, "Assistant", assistantContent);
  }, [input, isLoading, queryRAG, selectedCollection, addMessage]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "ask-ai.page",
      className: "min-h-screen bg-background flex flex-col",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border px-4 py-4 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-[oklch(0.75_0.2_200)]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold text-foreground", children: "Ask AI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Query your knowledge base" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-ocid": "ask-ai.collection.select",
                type: "button",
                onClick: () => setShowPicker((v) => !v),
                className: "flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:bg-accent transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-primary", children: COLLECTION_LABELS[selectedCollection] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
                ]
              }
            ),
            showPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "ask-ai.collection.dropdown_menu",
                className: "absolute right-0 top-full mt-2 w-52 rounded-xl bg-popover border border-border shadow-xl z-50 py-1 max-h-72 overflow-y-auto",
                children: ALL_COLLECTIONS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setSelectedCollection(col);
                      setShowPicker(false);
                    },
                    className: `w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${col === selectedCollection ? "text-primary font-medium" : "text-foreground"}`,
                    children: COLLECTION_LABELS[col]
                  },
                  col
                ))
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-6 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-4", children: [
          messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "ask-ai.empty_state", className: "text-center py-20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-[oklch(0.62_0.2_200/0.12)] border border-[oklch(0.62_0.2_200/0.25)] flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-8 h-8 text-[oklch(0.72_0.2_200)]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "What would you like to know?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm mx-auto", children: "Ask anything about your selected knowledge collection. The AI will find relevant answers and cite its sources." })
          ] }),
          messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex ${msg.role === "User" ? "justify-end" : "justify-start"}`,
              children: [
                msg.role === "Assistant" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center mr-3 mt-1 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-[oklch(0.75_0.2_200)]" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[78%] min-w-0", children: [
                  msg.role === "Assistant" && msg.content.includes("Not enough info") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[oklch(0.72_0.18_75/0.12)] border border-[oklch(0.72_0.18_75/0.3)] text-xs text-[oklch(0.82_0.16_75)]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 shrink-0" }),
                    "Not enough info in this collection"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "User" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"}`,
                      children: msg.content
                    }
                  ),
                  msg.citations && msg.citations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex flex-wrap gap-1", children: msg.citations.map((cit, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-[oklch(0.55_0.2_270/0.15)] text-[oklch(0.7_0.18_270)] border-[oklch(0.55_0.2_270/0.3)]",
                      children: cit
                    },
                    cit || i
                  )) })
                ] })
              ]
            },
            msg.id
          )),
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "ask-ai.loading_state",
              className: "flex justify-start",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center mr-3 mt-1 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-[oklch(0.75_0.2_200)] animate-pulse" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce",
                    style: { animationDelay: `${i * 0.15}s` }
                  },
                  i
                )) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-t border-border px-4 py-4 md:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3 bg-background border border-border rounded-2xl px-4 py-3 focus-within:border-primary transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                "data-ocid": "ask-ai.input",
                rows: 1,
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: handleKeyDown,
                placeholder: `Ask about ${COLLECTION_LABELS[selectedCollection]}…`,
                className: "flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground resize-none outline-none min-w-0 max-h-32"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Voice input",
                  className: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "ask-ai.submit_button",
                  type: "button",
                  size: "sm",
                  disabled: !input.trim() || isLoading,
                  onClick: handleSend,
                  className: "w-8 h-8 p-0 rounded-lg bg-primary hover:bg-primary/90",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 text-center", children: [
            "Querying:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: COLLECTION_LABELS[selectedCollection] })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  ClientAskAIPage as default
};
