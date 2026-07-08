import { by as useApp, c8 as useNavigate, b1 as useActor, c9 as useAgentWorkflow, bf as useCredentials, r as reactExports, ca as workflowEngine, j as jsxRuntimeExports, cb as Crown, as as Badge, ai as Sparkles, B as Button, P as Plus, al as RefreshCw, a_ as Settings, aq as ShieldCheck, U as Users, be as Activity, af as Zap, i as Clock, b8 as MessageSquare, c2 as ClipboardList, e as ChevronUp, f as ChevronDown, g as Textarea, l as LoaderCircle, cc as routeMasterAgentCall, b6 as createActor } from "./index-iniFfpN1.js";
const QUICK_ACTIONS = [
  "Analyze Roofing Campaign",
  "Check Lead Import Status",
  "Review Roofing Automations",
  "Generate Email Sequence",
  "Create Roofing Growth Strategy",
  "Check Integration Health",
  "Find System Issues",
  "Recommend Next Build Step"
];
function StatCard({
  label,
  value,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 bg-white/4 border border-white/8 rounded-xl p-4 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-slate-400 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-white", children: value })
  ] });
}
function useStreamText(target, running) {
  const [displayed, setDisplayed] = reactExports.useState("");
  const idx = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!running) return;
    idx.current = 0;
    setDisplayed("");
  }, [running]);
  reactExports.useEffect(() => {
    if (!running || idx.current >= target.length) return;
    const timer = setInterval(() => {
      idx.current += 1;
      setDisplayed(target.slice(0, idx.current));
      if (idx.current >= target.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [running, target]);
  return displayed;
}
function LoadingDots() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-0.5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce",
      style: { animationDelay: `${i * 150}ms` }
    },
    i
  )) });
}
function ChatMessage({
  msg,
  isStreaming
}) {
  const streamed = useStreamText(
    msg.content,
    isStreaming && msg.role === "Assistant"
  );
  const content = isStreaming && msg.role === "Assistant" ? streamed : msg.content;
  if (msg.role === "System") return null;
  if (msg.role === "User") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "master_agent.message.user",
        className: "max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm leading-relaxed border border-blue-500/40 shadow-lg",
        children: content
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-white", children: "OA" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "master_agent.message.assistant",
        className: "max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur bg-white/6 border border-white/10 text-slate-100 text-sm leading-relaxed shadow-inner",
        children: [
          content,
          isStreaming && streamed.length < msg.content.length && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 inline-block w-0.5 h-3.5 bg-amber-400 animate-pulse" })
        ]
      }
    )
  ] });
}
function parsePlatformStats(ctx) {
  if (!ctx) return {};
  const stats = {};
  const accountsMatch = ctx.match(/(\d+)\s+(?:total\s+)?accounts?/i);
  const leadsMatch = ctx.match(/(\d+)\s+(?:total\s+)?leads?/i);
  const campaignsMatch = ctx.match(/(\d+)\s+campaigns?/i);
  const trialsMatch = ctx.match(/(\d+)\s+(?:active\s+)?trials?/i);
  if (accountsMatch) stats.accounts = accountsMatch[1];
  if (leadsMatch) stats.leads = leadsMatch[1];
  if (campaignsMatch) stats.campaigns = campaignsMatch[1];
  if (trialsMatch) stats.trials = trialsMatch[1];
  return stats;
}
function MasterAgentPage() {
  const { isSuperAdmin } = useApp();
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { executeWorkflowForChat } = useAgentWorkflow();
  const { creds } = useCredentials();
  const [sessionId, setSessionId] = reactExports.useState(null);
  const [sessions, setSessions] = reactExports.useState([]);
  const [showHistory, setShowHistory] = reactExports.useState(false);
  const [activeProvider, setActiveProvider] = reactExports.useState("Owl Alpha");
  const [selectedProvider, setSelectedProvider] = reactExports.useState("auto");
  const [messages, setMessages] = reactExports.useState([]);
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [llmStatus, setLlmStatus] = reactExports.useState("checking");
  const [llmStatusMsg, setLlmStatusMsg] = reactExports.useState("");
  const [lastModelUsed, setLastModelUsed] = reactExports.useState("—");
  const [lastResponseTime, setLastResponseTime] = reactExports.useState("—");
  const [streamingIdx, setStreamingIdx] = reactExports.useState(null);
  const [platformCtx, setPlatformCtx] = reactExports.useState(null);
  const [showWorkflowLogs, setShowWorkflowLogs] = reactExports.useState(false);
  const [workflowLogs, setWorkflowLogs] = reactExports.useState([]);
  const scrollRef = reactExports.useRef(null);
  const textareaRef = reactExports.useRef(null);
  function appendWorkflowLog(request, model, result) {
    setWorkflowLogs((prev) => {
      const entry = {
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
        request: request.slice(0, 60),
        model,
        result: result.slice(0, 120)
      };
      const next = [...prev, entry];
      return next.length > 50 ? next.slice(next.length - 50) : next;
    });
  }
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };
  reactExports.useEffect(() => {
    if (!creds) return;
    workflowEngine.setApiKeys({
      openRouterKey: creds.openRouterApiKey || "",
      openAIKey: creds.openaiKey || "",
      geminiApiKey: creds.geminiApiKey || "",
      nvidiaNimKey: creds.nvidiaApiKey || ""
    });
    if (creds.openRouterApiKey || creds.openaiKey || creds.geminiApiKey || creds.nvidiaApiKey) {
      setLlmStatus("connected");
      setLlmStatusMsg("Master Agent connected successfully.");
    } else {
      setLlmStatus("needs_setup");
      setLlmStatusMsg(
        "API key missing. Go to Integration Health or Model Settings."
      );
    }
  }, [creds]);
  reactExports.useEffect(() => {
    if (!isSuperAdmin) {
      navigate({ to: "/dashboard" });
    }
  }, [isSuperAdmin, navigate]);
  reactExports.useEffect(() => {
    if (!actor || !isSuperAdmin) return;
    startSession();
    loadSessions();
  }, [actor, isSuperAdmin]);
  reactExports.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);
  async function startSession() {
    if (!actor) return;
    try {
      const id = await actor.startMasterAgentSession();
      setSessionId(id);
      setMessages([]);
    } catch {
    }
  }
  async function loadSessions() {
    if (!actor) return;
    try {
      const all = await actor.getMasterAgentSessions();
      setSessions(Array.isArray(all) ? all : []);
      if (Array.isArray(all) && all.length > 0) {
        const latest = all[all.length - 1];
        const sysMsg = latest.messages.find((m) => m.role === "System");
        if (sysMsg) setPlatformCtx(sysMsg.content);
        if (latest.platformContext) setPlatformCtx(latest.platformContext);
      }
    } catch {
    }
  }
  async function handleWorkflowChip(workflowName) {
    const loadingMsg = {
      role: "Assistant",
      content: `__loading__:${workflowName}`
    };
    setMessages((prev) => [
      ...prev,
      { role: "User", content: workflowName },
      loadingMsg
    ]);
    setLoading(true);
    try {
      const result = await executeWorkflowForChat(workflowName);
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findLastIndex(
          (m) => m.content === `__loading__:${workflowName}`
        );
        if (idx !== -1) {
          next[idx] = {
            role: "Assistant",
            content: `**[${workflowName}]** via ${result.provider}

${result.output}`
          };
          setStreamingIdx(idx);
        }
        return next;
      });
      setActiveProvider(result.provider);
      appendWorkflowLog(workflowName, result.provider, result.output ?? "");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      appendWorkflowLog(workflowName, activeProvider, `Error: ${errMsg}`);
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findLastIndex(
          (m) => m.content === `__loading__:${workflowName}`
        );
        if (idx !== -1) {
          next[idx] = {
            role: "Assistant",
            content: `Workflow "${workflowName}" encountered an error. Please try again.`
          };
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  }
  async function sendMessage(text) {
    if (!text.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          role: "Assistant",
          content: "Message cannot be empty."
        }
      ]);
      return;
    }
    if (loading) return;
    if (text.trim().startsWith("/")) {
      const cmd = text.trim().toLowerCase();
      const slashMap = {
        "/leads": "Find roofing leads",
        "/campaign": "Campaign status",
        "/report": "Weekly report",
        "/audit": "Run lead audit",
        "/social": "Content creation"
      };
      const mapped = Object.entries(slashMap).find(([k]) => cmd.startsWith(k));
      if (mapped) {
        setInput("");
        handleWorkflowChip(mapped[1]);
        return;
      }
    }
    let activeSession = sessionId;
    if (!activeSession) {
      if (!actor) return;
      try {
        const newId = await actor.startMasterAgentSession();
        setSessionId(newId);
        activeSession = newId;
      } catch {
        return;
      }
    }
    if (!actor || !activeSession || !text.trim() || loading) return;
    const userMsg = { role: "User", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const startTime = performance.now();
      const response = await actor.sendMasterAgentMessage(
        activeSession,
        { User: null },
        text.trim()
      );
      const elapsed = Math.round(performance.now() - startTime);
      setLastResponseTime(`${elapsed}ms`);
      const assistantMsg = {
        role: "Assistant",
        content: `Response received from ${activeProvider}.

${response}`
      };
      setLastModelUsed(activeProvider);
      setLlmStatus("connected");
      setMessages((prev) => {
        const next = [...prev, assistantMsg];
        setStreamingIdx(next.length - 1);
        return next;
      });
      appendWorkflowLog(
        text.trim(),
        activeProvider,
        response.slice(0, 120)
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      appendWorkflowLog(text.trim(), activeProvider, `Error: ${errMsg}`);
      let fallbackResponse = "";
      try {
        const fb = await routeMasterAgentCall("hello", {
          openRouterKey: (creds == null ? void 0 : creds.openRouterApiKey) || "",
          openAIKey: (creds == null ? void 0 : creds.openaiKey) || "",
          geminiApiKey: (creds == null ? void 0 : creds.geminiApiKey) || "",
          nvidiaNimKey: (creds == null ? void 0 : creds.nvidiaApiKey) || ""
        });
        if (fb && typeof fb === "object" && fb.success && fb.content && fb.content.length > 0) {
          fallbackResponse = fb.content;
          setActiveProvider("Fallback");
          setLlmStatus("fallback");
        }
      } catch {
      }
      if (fallbackResponse) {
        setMessages((prev) => [
          ...prev,
          {
            role: "Assistant",
            content: `Fallback Model Response

${fallbackResponse}`
          }
        ]);
        setLastModelUsed("Fallback");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "Assistant",
            content: "Both primary and fallback models failed."
          }
        ]);
        setLlmStatus("error");
      }
    } finally {
      setLoading(false);
    }
  }
  function handleQuickAction(action) {
    setInput(action);
    setTimeout(() => sendMessage(action), 0);
  }
  async function handleTestConnection() {
    setLlmStatus("checking");
    setLlmStatusMsg("Checking connection…");
    const start = performance.now();
    try {
      const result = await routeMasterAgentCall("hello", {
        openRouterKey: (creds == null ? void 0 : creds.openRouterApiKey) || "",
        openAIKey: (creds == null ? void 0 : creds.openaiKey) || "",
        geminiApiKey: (creds == null ? void 0 : creds.geminiApiKey) || "",
        nvidiaNimKey: (creds == null ? void 0 : creds.nvidiaApiKey) || ""
      });
      const elapsed = Math.round(performance.now() - start);
      if (result && typeof result === "object" && result.success && result.content && result.content.length > 0) {
        setLlmStatus("connected");
        setLlmStatusMsg("Master Agent connected successfully.");
        setLastResponseTime(`${elapsed}ms`);
        setLastModelUsed(activeProvider);
        setMessages((prev) => [
          ...prev,
          {
            role: "Assistant",
            content: `Response received from ${result.provider ?? activeProvider}.

${result.content}`
          }
        ]);
      } else {
        setLlmStatus("error");
        setLlmStatusMsg("Primary LLM is not connected.");
      }
    } catch {
      setLlmStatus("error");
      setLlmStatusMsg("Primary LLM is not connected.");
    }
  }
  function handleNewSession() {
    startSession();
    loadSessions();
  }
  const stats = parsePlatformStats(platformCtx);
  if (!isSuperAdmin) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "h-[calc(100vh-4rem)] flex flex-col bg-slate-950",
      "data-ocid": "master_agent.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 px-6 py-4 border-b border-white/8 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 20, className: "text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-white", children: "Master Agent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 9, className: "mr-1" }),
                  "Powered by Owl Alpha"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `w-2 h-2 rounded-full shadow-sm ${llmStatus === "connected" ? "bg-green-400 shadow-green-400/50" : llmStatus === "checking" ? "bg-yellow-400 shadow-yellow-400/50" : llmStatus === "fallback" ? "bg-purple-400 shadow-purple-400/50" : llmStatus === "needs_setup" ? "bg-orange-400 shadow-orange-400/50" : llmStatus === "demo" ? "bg-blue-400 shadow-blue-400/50" : "bg-red-400 shadow-red-400/50"}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-300 font-medium", children: llmStatus === "connected" ? "Connected" : llmStatus === "checking" ? "Checking" : llmStatus === "fallback" ? "Fallback Active" : llmStatus === "needs_setup" ? "Needs Setup" : llmStatus === "demo" ? "Demo Mode" : "Error" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    "data-ocid": "master_agent.provider_select",
                    value: selectedProvider,
                    onChange: (e) => setSelectedProvider(e.target.value),
                    className: "text-[10px] bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", children: "Auto" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "openrouter", children: "OpenRouter" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "openai", children: "OpenAI" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gemini", children: "Gemini" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "nvidia", children: "NVIDIA" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: "Your BRF command brain for campaigns, clients, workflows, strategy, and system operations." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "master_agent.sessions_count.button",
                onClick: () => setShowHistory((v) => !v),
                className: "text-xs text-slate-400 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10",
                children: [
                  sessions.length,
                  " session",
                  sessions.length !== 1 ? "s" : ""
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                "data-ocid": "master_agent.new_session.button",
                onClick: handleNewSession,
                className: "border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 text-xs gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 13 }),
                  "New Session"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 px-6 py-3 border-b border-white/8 bg-slate-900/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: "Primary Provider" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-200 font-medium", children: (creds == null ? void 0 : creds.openRouterApiKey) ? "OpenRouter Owl Alpha" : (creds == null ? void 0 : creds.openaiKey) ? "OpenAI" : "Needs Setup" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: `text-[10px] px-2 py-0 border ${llmStatus === "connected" ? "bg-green-500/15 text-green-300 border-green-500/30" : llmStatus === "checking" ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" : llmStatus === "fallback" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : llmStatus === "needs_setup" ? "bg-orange-500/15 text-orange-300 border-orange-500/30" : llmStatus === "demo" ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "bg-red-500/15 text-red-300 border-red-500/30"}`,
                    children: llmStatus === "connected" ? "Connected" : llmStatus === "checking" ? "Checking" : llmStatus === "fallback" ? "Fallback Active" : llmStatus === "needs_setup" ? "Needs Setup" : llmStatus === "demo" ? "Demo Mode" : "Error"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: "Fallback Provider" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-200 font-medium", children: (creds == null ? void 0 : creds.openaiKey) ? "OpenAI" : (creds == null ? void 0 : creds.geminiApiKey) ? "Gemini" : (creds == null ? void 0 : creds.nvidiaApiKey) ? "NVIDIA" : "None" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: "Current Active Model" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-200 font-medium", children: activeProvider })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: "Last Model Used" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-200 font-medium", children: lastModelUsed })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: "Last Response Time" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-200 font-medium", children: lastResponseTime })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  "data-ocid": "master_agent.test_connection.button",
                  onClick: handleTestConnection,
                  className: "border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 text-xs gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13 }),
                    "Test Connection"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  "data-ocid": "master_agent.open_model_settings.button",
                  onClick: () => navigate({ to: "/go-live" }),
                  className: "border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 text-xs gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 13 }),
                    "Open Model Settings"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  "data-ocid": "master_agent.go_integration_health.button",
                  onClick: () => navigate({ to: "/admin/integration-health" }),
                  className: "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 text-xs gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 13 }),
                    "Go to Integration Health"
                  ]
                }
              )
            ] })
          ] }),
          llmStatusMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-2", children: llmStatusMsg })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden pointer-events-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 shrink-0 border-r border-white/8 bg-slate-900/60 flex flex-col gap-4 p-4 overflow-y-auto hidden lg:flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3", children: "Platform Snapshot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Accounts",
                    value: stats.accounts ?? "—",
                    icon: Users
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Leads",
                    value: stats.leads ?? "—",
                    icon: Activity
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Campaigns",
                    value: stats.campaigns ?? "—",
                    icon: Zap
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Trials",
                    value: stats.trials ?? "—",
                    icon: Clock
                  }
                )
              ] })
            ] }),
            platformCtx && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2", children: "Recent Activity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/4 border border-white/8 rounded-xl p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-300 leading-relaxed line-clamp-[12]", children: platformCtx }) })
            ] }),
            showHistory && sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2", children: "Session History" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex flex-col gap-1",
                  "data-ocid": "master_agent.session_history.list",
                  children: sessions.slice(-8).reverse().map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "master_agent.session.item",
                      onClick: () => {
                        setSessionId(s.sessionId);
                        setMessages(
                          s.messages.filter((m) => m.role !== "System").map((m) => ({ role: m.role, content: m.content }))
                        );
                        setShowHistory(false);
                      },
                      className: "text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/6 hover:text-amber-300 transition-colors border border-transparent hover:border-white/10 truncate",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          MessageSquare,
                          {
                            size: 11,
                            className: "shrink-0 text-amber-500"
                          }
                        ),
                        "Session",
                        " ",
                        new Date(
                          Number(s.startedAt) / 1e6
                        ).toLocaleTimeString()
                      ] })
                    },
                    s.sessionId
                  ))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden pointer-events-auto relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: scrollRef,
                className: "flex-1 overflow-y-auto px-6 py-4",
                "data-ocid": "master_agent.chat.list",
                children: messages.length === 0 && !loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "h-full flex flex-col items-center justify-center gap-4 text-center",
                    "data-ocid": "master_agent.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { size: 28, className: "text-amber-400" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-semibold text-lg", children: "Talk to Master Agent" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm mt-1 max-w-xs", children: "Ask the Master Agent what to build, fix, analyze, or run next…" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11, className: "text-amber-500" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Session active — powered by Owl Alpha (openrouter/owl-alpha)" })
                      ] })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  messages.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ChatMessage,
                    {
                      msg,
                      isStreaming: streamingIdx === i
                    },
                    `${msg.role}-${i}`
                  )),
                  loading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-3 mb-3",
                      "data-ocid": "master_agent.loading_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-white", children: "OA" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur bg-white/6 border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingDots, {}) })
                      ]
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-6 pt-3 flex gap-2 overflow-x-auto scrollbar-none",
                "data-ocid": "master_agent.workflow_chips",
                children: [
                  [
                    "Run lead audit",
                    "Campaign status",
                    "Find roofing leads",
                    "Weekly report",
                    "Enroll leads"
                  ].map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "master_agent.workflow_chip.button",
                      onClick: () => handleWorkflowChip(chip),
                      disabled: loading,
                      className: "shrink-0 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-300/90 hover:border-emerald-400/60 hover:text-emerald-200 hover:bg-emerald-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium",
                      children: chip
                    },
                    chip
                  )),
                  QUICK_ACTIONS.map((chip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "master_agent.quick_action.button",
                      onClick: () => handleQuickAction(chip),
                      disabled: loading,
                      className: "shrink-0 text-xs px-3 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 text-amber-300/90 hover:border-amber-400/50 hover:text-amber-200 hover:bg-amber-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium",
                      children: chip
                    },
                    chip
                  ))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "master_agent.workflow_logs.toggle",
                  onClick: () => setShowWorkflowLogs((v) => !v),
                  className: "flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition-colors py-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { size: 12 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Workflow Logs" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-slate-500 text-[10px]", children: [
                      "(",
                      workflowLogs.length,
                      ")"
                    ] }),
                    showWorkflowLogs ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 11 })
                  ]
                }
              ),
              showWorkflowLogs && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "master_agent.workflow_logs.panel",
                  className: "mt-1 mb-2 rounded-xl border border-white/10 bg-slate-900/70 overflow-hidden",
                  children: workflowLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 px-4 py-3 text-center", children: "No logs yet — send a message or run a workflow." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-44 overflow-y-auto divide-y divide-white/5", children: workflowLogs.slice().reverse().map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "px-4 py-2 flex flex-col gap-0.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 shrink-0", children: log.timestamp }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-amber-300/80 truncate flex-1", children: log.request }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 shrink-0 bg-white/5 px-1.5 rounded", children: log.model })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-400 truncate pl-0.5", children: log.result })
                      ]
                    },
                    `log-${workflowLogs.length - i}`
                  )) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-white/8 bg-slate-900/40 flex gap-3 items-end pointer-events-auto relative z-20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  ref: textareaRef,
                  "data-ocid": "master_agent.input",
                  value: input,
                  onChange: handleInputChange,
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  },
                  placeholder: "Ask the Master Agent what to build, fix, analyze, or run next…",
                  rows: 1,
                  disabled: false,
                  autoFocus: true,
                  className: "resize-none bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 flex-1 pointer-events-auto z-50 relative min-h-[2.5rem] max-h-[200px] overflow-y-auto"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "master_agent.send.button",
                  onClick: () => sendMessage(input),
                  disabled: loading,
                  className: "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-0 shadow-lg shadow-amber-500/25 transition-all h-[4.5rem] px-5",
                  children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 18, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 18 }),
                    " Send to Master Agent"
                  ] })
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  MasterAgentPage as default
};
