import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Crown,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { useCredentials } from "../context/CredentialsContext";
import { useAgentWorkflow } from "../hooks/useAgentWorkflow";
import { routeMasterAgentCall } from "../services/openSourceAdapters";
import { workflowEngine } from "../services/workflowEngine";

// ─── Types ────────────────────────────────────────────────────────────────────
type MessageRole = "User" | "Assistant" | "System";
interface AgentMessage {
  role: MessageRole;
  content: string;
  timestamp: bigint;
}
interface MasterAgentSession {
  sessionId: string;
  messages: AgentMessage[];
  startedAt: bigint;
  lastActiveAt: bigint;
  platformContext: string | null;
}

// ─── Quick Action chips ────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  "Analyze Roofing Campaign",
  "Check Lead Import Status",
  "Review Roofing Automations",
  "Generate Email Sequence",
  "Create Roofing Growth Strategy",
  "Check Integration Health",
  "Find System Issues",
  "Recommend Next Build Step",
];

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-1 bg-white/4 border border-white/8 rounded-xl p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

// ─── Streaming hook ───────────────────────────────────────────────────────────
function useStreamText(target: string, running: boolean) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    if (!running) return;
    idx.current = 0;
    setDisplayed("");
  }, [running]);
  useEffect(() => {
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

// ─── Loading dots ─────────────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

// ─── ChatMessage ──────────────────────────────────────────────────────────────
function ChatMessage({
  msg,
  isStreaming,
}: {
  msg: { role: MessageRole; content: string };
  isStreaming: boolean;
}) {
  const streamed = useStreamText(
    msg.content,
    isStreaming && msg.role === "Assistant",
  );
  const content =
    isStreaming && msg.role === "Assistant" ? streamed : msg.content;

  if (msg.role === "System") return null;

  if (msg.role === "User") {
    return (
      <div className="flex justify-end mb-3">
        <div
          data-ocid="master_agent.message.user"
          className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm leading-relaxed border border-blue-500/40 shadow-lg"
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-3">
      <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
        <span className="text-[10px] font-bold text-white">OA</span>
      </div>
      <div
        data-ocid="master_agent.message.assistant"
        className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur bg-white/6 border border-white/10 text-slate-100 text-sm leading-relaxed shadow-inner"
      >
        {content}
        {isStreaming && streamed.length < msg.content.length && (
          <span className="ml-1 inline-block w-0.5 h-3.5 bg-amber-400 animate-pulse" />
        )}
      </div>
    </div>
  );
}

// ─── Parse platform context into stats ───────────────────────────────────────
function parsePlatformStats(ctx: string | null): Record<string, string> {
  if (!ctx) return {};
  const stats: Record<string, string> = {};
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MasterAgentPage() {
  const { isSuperAdmin } = useApp();
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { executeWorkflowForChat } = useAgentWorkflow();
  const { creds } = useCredentials();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<MasterAgentSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>("Owl Alpha");
  const [selectedProvider, setSelectedProvider] = useState<string>("auto");
  const [messages, setMessages] = useState<
    { role: MessageRole; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [llmStatus, setLlmStatus] = useState<
    | "connected"
    | "disconnected"
    | "checking"
    | "needs_setup"
    | "fallback"
    | "demo"
    | "error"
  >("checking");
  const [llmStatusMsg, setLlmStatusMsg] = useState("");
  const [lastModelUsed, setLastModelUsed] = useState<string>("—");
  const [lastResponseTime, setLastResponseTime] = useState<string>("—");
  const [streamingIdx, setStreamingIdx] = useState<number | null>(null);
  const [platformCtx, setPlatformCtx] = useState<string | null>(null);
  const [showWorkflowLogs, setShowWorkflowLogs] = useState(false);
  const [workflowLogs, setWorkflowLogs] = useState<
    { timestamp: string; request: string; model: string; result: string }[]
  >([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function appendWorkflowLog(request: string, model: string, result: string) {
    setWorkflowLogs((prev) => {
      const entry = {
        timestamp: new Date().toLocaleTimeString(),
        request: request.slice(0, 60),
        model,
        result: result.slice(0, 120),
      };
      const next = [...prev, entry];
      return next.length > 50 ? next.slice(next.length - 50) : next;
    });
  }

  // Auto-resize textarea as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  };

  // Inject API keys into workflowEngine singleton whenever credentials load
  useEffect(() => {
    if (!creds) return;
    workflowEngine.setApiKeys({
      openRouterKey: creds.openRouterApiKey || "",
      openAIKey: creds.openaiKey || "",
      geminiApiKey: creds.geminiApiKey || "",
      nvidiaNimKey: creds.nvidiaApiKey || "",
    });
    // Determine LLM status
    if (
      creds.openRouterApiKey ||
      creds.openaiKey ||
      creds.geminiApiKey ||
      creds.nvidiaApiKey
    ) {
      setLlmStatus("connected");
      setLlmStatusMsg("Master Agent connected successfully.");
    } else {
      setLlmStatus("needs_setup");
      setLlmStatusMsg(
        "API key missing. Go to Integration Health or Model Settings.",
      );
    }
  }, [creds]);

  // Guard — non-super-admin redirect
  useEffect(() => {
    if (!isSuperAdmin) {
      navigate({ to: "/dashboard" });
    }
  }, [isSuperAdmin, navigate]);

  // Start session on mount
  useEffect(() => {
    if (!actor || !isSuperAdmin) return;
    startSession();
    loadSessions();
  }, [actor, isSuperAdmin]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  async function startSession() {
    if (!actor) return;
    try {
      const id = await (actor as any).startMasterAgentSession();
      setSessionId(id);
      setMessages([]);
    } catch {
      // swallow
    }
  }

  async function loadSessions() {
    if (!actor) return;
    try {
      const all = await (actor as any).getMasterAgentSessions();
      setSessions(Array.isArray(all) ? all : []);
      // extract platformContext from most recent session if present
      if (Array.isArray(all) && all.length > 0) {
        const latest = all[all.length - 1] as MasterAgentSession;
        const sysMsg = latest.messages.find((m) => m.role === "System");
        if (sysMsg) setPlatformCtx(sysMsg.content);
        if (latest.platformContext) setPlatformCtx(latest.platformContext);
      }
    } catch {
      // swallow
    }
  }

  async function handleWorkflowChip(workflowName: string) {
    const loadingMsg = {
      role: "Assistant" as MessageRole,
      content: `__loading__:${workflowName}`,
    };
    setMessages((prev) => [
      ...prev,
      { role: "User" as MessageRole, content: workflowName },
      loadingMsg,
    ]);
    setLoading(true);
    try {
      const result = await executeWorkflowForChat(workflowName);
      setMessages((prev) => {
        const next = [...prev];
        const idx = next.findLastIndex(
          (m) => m.content === `__loading__:${workflowName}`,
        );
        if (idx !== -1) {
          next[idx] = {
            role: "Assistant" as MessageRole,
            content: `**[${workflowName}]** via ${result.provider}\n\n${result.output}`,
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
          (m) => m.content === `__loading__:${workflowName}`,
        );
        if (idx !== -1) {
          next[idx] = {
            role: "Assistant" as MessageRole,
            content: `Workflow "${workflowName}" encountered an error. Please try again.`,
          };
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          role: "Assistant" as MessageRole,
          content: "Message cannot be empty.",
        },
      ]);
      return;
    }
    if (loading) return;
    // Slash command detection
    if (text.trim().startsWith("/")) {
      const cmd = text.trim().toLowerCase();
      const slashMap: Record<string, string> = {
        "/leads": "Find roofing leads",
        "/campaign": "Campaign status",
        "/report": "Weekly report",
        "/audit": "Run lead audit",
        "/social": "Content creation",
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
        const newId = await (actor as any).startMasterAgentSession();
        setSessionId(newId);
        activeSession = newId;
      } catch {
        return;
      }
    }
    if (!actor || !activeSession || !text.trim() || loading) return;
    const userMsg = { role: "User" as MessageRole, content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const startTime = performance.now();
      const response = await (actor as any).sendMasterAgentMessage(
        activeSession,
        { User: null },
        text.trim(),
      );
      const elapsed = Math.round(performance.now() - startTime);
      setLastResponseTime(`${elapsed}ms`);
      const assistantMsg = {
        role: "Assistant" as MessageRole,
        content: `Response received from ${activeProvider}.\n\n${response as string}`,
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
        (response as string).slice(0, 120),
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      appendWorkflowLog(text.trim(), activeProvider, `Error: ${errMsg}`);
      // Fallback attempt
      let fallbackResponse = "";
      try {
        const fb = await routeMasterAgentCall("hello", {
          openRouterKey: creds?.openRouterApiKey || "",
          openAIKey: creds?.openaiKey || "",
          geminiApiKey: creds?.geminiApiKey || "",
          nvidiaNimKey: creds?.nvidiaApiKey || "",
        });
        if (
          fb &&
          typeof fb === "object" &&
          fb.success &&
          fb.content &&
          fb.content.length > 0
        ) {
          fallbackResponse = fb.content;
          setActiveProvider("Fallback");
          setLlmStatus("fallback");
        }
      } catch {
        // fallback also failed
      }
      if (fallbackResponse) {
        setMessages((prev) => [
          ...prev,
          {
            role: "Assistant" as MessageRole,
            content: `Fallback Model Response\n\n${fallbackResponse}`,
          },
        ]);
        setLastModelUsed("Fallback");
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "Assistant" as MessageRole,
            content: "Both primary and fallback models failed.",
          },
        ]);
        setLlmStatus("error");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAction(action: string) {
    setInput(action);
    // small timeout so setInput renders before sendMessage reads it
    setTimeout(() => sendMessage(action), 0);
  }

  async function handleTestConnection() {
    setLlmStatus("checking");
    setLlmStatusMsg("Checking connection…");
    const start = performance.now();
    try {
      const result = await routeMasterAgentCall("hello", {
        openRouterKey: creds?.openRouterApiKey || "",
        openAIKey: creds?.openaiKey || "",
        geminiApiKey: creds?.geminiApiKey || "",
        nvidiaNimKey: creds?.nvidiaApiKey || "",
      });
      const elapsed = Math.round(performance.now() - start);
      if (
        result &&
        typeof result === "object" &&
        result.success &&
        result.content &&
        result.content.length > 0
      ) {
        setLlmStatus("connected");
        setLlmStatusMsg("Master Agent connected successfully.");
        setLastResponseTime(`${elapsed}ms`);
        setLastModelUsed(activeProvider);
        setMessages((prev) => [
          ...prev,
          {
            role: "Assistant" as MessageRole,
            content: `Response received from ${result.provider ?? activeProvider}.\n\n${result.content}`,
          },
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

  return (
    <div
      className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950"
      data-ocid="master_agent.page"
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-b border-white/8 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">Master Agent</h1>
              <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0">
                <Sparkles size={9} className="mr-1" />
                Powered by Owl Alpha
              </Badge>
              {/* Provider status badge */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                <span
                  className={`w-2 h-2 rounded-full shadow-sm ${llmStatus === "connected" ? "bg-green-400 shadow-green-400/50" : llmStatus === "checking" ? "bg-yellow-400 shadow-yellow-400/50" : llmStatus === "fallback" ? "bg-purple-400 shadow-purple-400/50" : llmStatus === "needs_setup" ? "bg-orange-400 shadow-orange-400/50" : llmStatus === "demo" ? "bg-blue-400 shadow-blue-400/50" : "bg-red-400 shadow-red-400/50"}`}
                />
                <span className="text-[10px] text-slate-300 font-medium">
                  {llmStatus === "connected"
                    ? "Connected"
                    : llmStatus === "checking"
                      ? "Checking"
                      : llmStatus === "fallback"
                        ? "Fallback Active"
                        : llmStatus === "needs_setup"
                          ? "Needs Setup"
                          : llmStatus === "demo"
                            ? "Demo Mode"
                            : "Error"}
                </span>
              </div>
              {/* Provider selector */}
              <select
                data-ocid="master_agent.provider_select"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                <option value="auto">Auto</option>
                <option value="openrouter">OpenRouter</option>
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
                <option value="nvidia">NVIDIA</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Your BRF command brain for campaigns, clients, workflows,
              strategy, and system operations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-ocid="master_agent.sessions_count.button"
            onClick={() => setShowHistory((v) => !v)}
            className="text-xs text-slate-400 hover:text-amber-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-ocid="master_agent.new_session.button"
            onClick={handleNewSession}
            className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 text-xs gap-1"
          >
            <Plus size={13} />
            New Session
          </Button>
        </div>
      </div>

      {/* ── LLM Status Card ──────────────────────────────────── */}
      <div className="shrink-0 px-6 py-3 border-b border-white/8 bg-slate-900/60">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Primary Provider
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {creds?.openRouterApiKey
                  ? "OpenRouter Owl Alpha"
                  : creds?.openaiKey
                    ? "OpenAI"
                    : "Needs Setup"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Status
              </span>
              <Badge
                className={`text-[10px] px-2 py-0 border ${llmStatus === "connected" ? "bg-green-500/15 text-green-300 border-green-500/30" : llmStatus === "checking" ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" : llmStatus === "fallback" ? "bg-purple-500/15 text-purple-300 border-purple-500/30" : llmStatus === "needs_setup" ? "bg-orange-500/15 text-orange-300 border-orange-500/30" : llmStatus === "demo" ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "bg-red-500/15 text-red-300 border-red-500/30"}`}
              >
                {llmStatus === "connected"
                  ? "Connected"
                  : llmStatus === "checking"
                    ? "Checking"
                    : llmStatus === "fallback"
                      ? "Fallback Active"
                      : llmStatus === "needs_setup"
                        ? "Needs Setup"
                        : llmStatus === "demo"
                          ? "Demo Mode"
                          : "Error"}
              </Badge>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Fallback Provider
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {creds?.openaiKey
                  ? "OpenAI"
                  : creds?.geminiApiKey
                    ? "Gemini"
                    : creds?.nvidiaApiKey
                      ? "NVIDIA"
                      : "None"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Current Active Model
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {activeProvider}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Last Model Used
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {lastModelUsed}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                Last Response Time
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {lastResponseTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-ocid="master_agent.test_connection.button"
              onClick={handleTestConnection}
              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 text-xs gap-1"
            >
              <RefreshCw size={13} />
              Test Connection
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-ocid="master_agent.open_model_settings.button"
              onClick={() => navigate({ to: "/go-live" })}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200 text-xs gap-1"
            >
              <Settings size={13} />
              Open Model Settings
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-ocid="master_agent.go_integration_health.button"
              onClick={() => navigate({ to: "/admin/integration-health" })}
              className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 text-xs gap-1"
            >
              <ShieldCheck size={13} />
              Go to Integration Health
            </Button>
          </div>
        </div>
        {llmStatusMsg && (
          <p className="text-[11px] text-slate-400 mt-2">{llmStatusMsg}</p>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden pointer-events-auto">
        {/* ── Left: Platform Snapshot ────────────────────────── */}
        <aside className="w-64 shrink-0 border-r border-white/8 bg-slate-900/60 flex flex-col gap-4 p-4 overflow-y-auto hidden lg:flex">
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Platform Snapshot
            </p>
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                label="Accounts"
                value={stats.accounts ?? "—"}
                icon={Users}
              />
              <StatCard
                label="Leads"
                value={stats.leads ?? "—"}
                icon={Activity}
              />
              <StatCard
                label="Campaigns"
                value={stats.campaigns ?? "—"}
                icon={Zap}
              />
              <StatCard
                label="Trials"
                value={stats.trials ?? "—"}
                icon={Clock}
              />
            </div>
          </div>

          {platformCtx && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Recent Activity
              </p>
              <div className="bg-white/4 border border-white/8 rounded-xl p-3">
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-[12]">
                  {platformCtx}
                </p>
              </div>
            </div>
          )}

          {showHistory && sessions.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Session History
              </p>
              <div
                className="flex flex-col gap-1"
                data-ocid="master_agent.session_history.list"
              >
                {sessions
                  .slice(-8)
                  .reverse()
                  .map((s) => (
                    <button
                      key={s.sessionId}
                      type="button"
                      data-ocid="master_agent.session.item"
                      onClick={() => {
                        setSessionId(s.sessionId);
                        setMessages(
                          s.messages
                            .filter((m) => m.role !== "System")
                            .map((m) => ({ role: m.role, content: m.content })),
                        );
                        setShowHistory(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/6 hover:text-amber-300 transition-colors border border-transparent hover:border-white/10 truncate"
                    >
                      <span className="flex items-center gap-1.5">
                        <MessageSquare
                          size={11}
                          className="shrink-0 text-amber-500"
                        />
                        Session{" "}
                        {new Date(
                          Number(s.startedAt) / 1_000_000,
                        ).toLocaleTimeString()}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </aside>

        {/* ── Right: Chat ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden pointer-events-auto relative z-10">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-4"
            data-ocid="master_agent.chat.list"
          >
            {messages.length === 0 && !loading ? (
              <div
                className="h-full flex flex-col items-center justify-center gap-4 text-center"
                data-ocid="master_agent.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center">
                  <Crown size={28} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    Talk to Master Agent
                  </p>
                  <p className="text-slate-400 text-sm mt-1 max-w-xs">
                    Ask the Master Agent what to build, fix, analyze, or run
                    next…
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <RefreshCw size={11} className="text-amber-500" />
                  <span>
                    Session active — powered by Owl Alpha (openrouter/owl-alpha)
                  </span>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={`${msg.role}-${i}`}
                    msg={msg}
                    isStreaming={streamingIdx === i}
                  />
                ))}
                {loading && (
                  <div
                    className="flex items-start gap-3 mb-3"
                    data-ocid="master_agent.loading_state"
                  >
                    <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">
                        OA
                      </span>
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur bg-white/6 border border-white/10">
                      <LoadingDots />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Workflow chips */}
          <div
            className="px-6 pt-3 flex gap-2 overflow-x-auto scrollbar-none"
            data-ocid="master_agent.workflow_chips"
          >
            {[
              "Run lead audit",
              "Campaign status",
              "Find roofing leads",
              "Weekly report",
              "Enroll leads",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                data-ocid="master_agent.workflow_chip.button"
                onClick={() => handleWorkflowChip(chip)}
                disabled={loading}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-300/90 hover:border-emerald-400/60 hover:text-emerald-200 hover:bg-emerald-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                {chip}
              </button>
            ))}
            {QUICK_ACTIONS.map((chip) => (
              <button
                key={chip}
                type="button"
                data-ocid="master_agent.quick_action.button"
                onClick={() => handleQuickAction(chip)}
                disabled={loading}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-amber-500/25 bg-amber-500/8 text-amber-300/90 hover:border-amber-400/50 hover:text-amber-200 hover:bg-amber-500/15 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Workflow Logs toggle */}
          <div className="px-6 pt-2">
            <button
              type="button"
              data-ocid="master_agent.workflow_logs.toggle"
              onClick={() => setShowWorkflowLogs((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-300 transition-colors py-1"
            >
              <ClipboardList size={12} />
              <span>Workflow Logs</span>
              <span className="ml-1 text-slate-500 text-[10px]">
                ({workflowLogs.length})
              </span>
              {showWorkflowLogs ? (
                <ChevronUp size={11} />
              ) : (
                <ChevronDown size={11} />
              )}
            </button>
            {showWorkflowLogs && (
              <div
                data-ocid="master_agent.workflow_logs.panel"
                className="mt-1 mb-2 rounded-xl border border-white/10 bg-slate-900/70 overflow-hidden"
              >
                {workflowLogs.length === 0 ? (
                  <p className="text-[11px] text-slate-500 px-4 py-3 text-center">
                    No logs yet — send a message or run a workflow.
                  </p>
                ) : (
                  <div className="max-h-44 overflow-y-auto divide-y divide-white/5">
                    {workflowLogs
                      .slice()
                      .reverse()
                      .map((log, i) => (
                        <div
                          key={`log-${workflowLogs.length - i}`}
                          className="px-4 py-2 flex flex-col gap-0.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 shrink-0">
                              {log.timestamp}
                            </span>
                            <span className="text-[10px] font-medium text-amber-300/80 truncate flex-1">
                              {log.request}
                            </span>
                            <span className="text-[10px] text-slate-500 shrink-0 bg-white/5 px-1.5 rounded">
                              {log.model}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate pl-0.5">
                            {log.result}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="px-6 py-4 border-t border-white/8 bg-slate-900/40 flex gap-3 items-end pointer-events-auto relative z-20">
            <Textarea
              ref={textareaRef}
              data-ocid="master_agent.input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask the Master Agent what to build, fix, analyze, or run next…"
              rows={1}
              disabled={false}
              autoFocus
              className="resize-none bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20 flex-1 pointer-events-auto z-50 relative min-h-[2.5rem] max-h-[200px] overflow-y-auto"
            />
            <Button
              type="button"
              data-ocid="master_agent.send.button"
              onClick={() => sendMessage(input)}
              disabled={loading}
              className="bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-0 shadow-lg shadow-amber-500/25 transition-all h-[4.5rem] px-5"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span className="flex items-center gap-1.5">
                  <Zap size={18} /> Send to Master Agent
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
