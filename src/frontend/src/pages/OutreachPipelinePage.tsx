import {
  AlertCircle,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Inbox,
  Loader2,
  Mic,
  MicOff,
  RefreshCw,
  Search,
  Send,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AgentCommandResult, CommandLogEntry } from "../backend";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PipelineLane =
  | "new"
  | "contacted"
  | "replied"
  | "demo_scheduled"
  | "trial"
  | "customer";

export interface PipelineLead {
  id: string;
  businessName: string;
  niche: string;
  source: string;
  email?: string;
  lane: PipelineLane;
  autoTriggerScheduledAt?: number; // ms timestamp
  autoTriggerStatus?: "pending" | "fired" | "cancelled";
  qualityScore?: number;
  createdAt?: number;
}

export interface InboundReply {
  id: string;
  prospectEmail: string;
  subject: string;
  body: string;
  receivedAt: number;
  sentiment: "positive" | "neutral" | "negative";
  claudeSuggestedAction: string;
  painPointsSummary: string;
  actionComplete: boolean;
}

export interface QueuedAction {
  id: string;
  leadId: string;
  businessName: string;
  actionType: string;
  scheduledAt: number;
  status: "pending" | "approved" | "cancelled";
}

// ─── Marketing Framework Labels ──────────────────────────────────────────────

const FRAMEWORK_LABELS: Record<string, { label: string; color: string }> = {
  Brunson: { label: "Hook/Story/Offer", color: "text-violet-400" },
  Hormozi: { label: "Value Equation", color: "text-cyan-400" },
  Kennedy: { label: "Direct Response", color: "text-amber-400" },
  Halbert: { label: "Human Copy", color: "text-emerald-400" },
};

function detectFramework(preview: string): string {
  if (/brunson|hook|story|offer/i.test(preview)) return "Brunson";
  if (/hormozi|value|grand slam/i.test(preview)) return "Hormozi";
  if (/kennedy|direct response|deadline/i.test(preview)) return "Kennedy";
  if (/halbert|human|visceral/i.test(preview)) return "Halbert";
  return "Kennedy"; // default
}

// ─── Voice Outreach Agent Panel ───────────────────────────────────────────────

function QuotaBar({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const color =
    pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-cyan-500";
  return (
    <div
      className="rounded-xl bg-white/5 border border-white/10 px-4 py-3"
      data-ocid="agent.quota_panel"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 font-medium">Daily Quota</span>
        <span
          className={`text-xs font-mono font-bold ${
            pct >= 90
              ? "text-rose-400"
              : pct >= 70
                ? "text-amber-400"
                : "text-cyan-400"
          }`}
        >
          {used}/{limit}
        </span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1.5">
        {limit - used} sends remaining today
      </p>
    </div>
  );
}

function ConfirmationCard({
  result,
  onConfirm,
  onCancel,
  confirming,
  quotaError,
}: {
  result: AgentCommandResult;
  onConfirm: () => void;
  onCancel: () => void;
  confirming: boolean;
  quotaError: string | null;
}) {
  const framework = detectFramework(result.preview);
  const fw = FRAMEWORK_LABELS[framework];
  return (
    <div
      className="confirmation-preview-card space-y-3"
      data-ocid="agent.confirmation_card"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Confirmation Preview
        </span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 border border-white/10 ${
            fw.color
          }`}
        >
          {fw.label} Framework
        </span>
      </div>
      <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-line">
        {result.preview}
      </p>
      {quotaError && (
        <div
          className="flex items-start gap-2 bg-rose-900/30 border border-rose-700/40 rounded-lg px-3 py-2"
          data-ocid="agent.quota_error_state"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-rose-300 text-sm">{quotaError}</p>
        </div>
      )}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming || !!quotaError}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl bg-cyan-600/25 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-300 transition-all disabled:opacity-50"
          data-ocid="agent.confirm_button"
        >
          {confirming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Confirm &amp; Execute
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={confirming}
          className="flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
          data-ocid="agent.cancel_button"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </div>
  );
}

function CommandHistoryPanel({ entries }: { entries: CommandLogEntry[] }) {
  const actionColors: Record<string, string> = {
    EditSequence: "text-indigo-400",
    ModifyStep: "text-violet-400",
    FireBulkSend: "text-cyan-400",
    QueryLeads: "text-emerald-400",
    Unknown: "text-slate-400",
  };

  return (
    <div
      className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
      data-ocid="agent.command_history_panel"
    >
      <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-semibold text-slate-200">
          Command History
        </span>
        <span className="ml-auto text-xs text-slate-500">Last 10</span>
      </div>
      {entries.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-10"
          data-ocid="agent.history_empty_state"
        >
          <Bot className="w-8 h-8 text-slate-600 mb-2" />
          <p className="text-slate-500 text-sm">No commands yet</p>
          <p className="text-slate-600 text-xs mt-1">
            Your agent history will appear here
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {entries.map((entry, idx) => {
            const actionKey =
              typeof entry.agentAction === "object"
                ? Object.keys(entry.agentAction)[0]
                : String(entry.agentAction);
            const colorCls = actionColors[actionKey] ?? "text-slate-400";
            const ts = Number(entry.timestamp) / 1_000_000;
            const date = new Date(ts);
            const timeStr = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const executed = entry.executedAt !== undefined;
            return (
              <div
                key={entry.id}
                className="px-4 py-3 hover:bg-white/3 transition-colors"
                data-ocid={`agent.history.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-slate-200 text-sm leading-snug min-w-0 flex-1 truncate">
                    {entry.commandText}
                  </p>
                  <span
                    className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${
                      executed
                        ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/30"
                        : "bg-rose-900/40 text-rose-300 border-rose-700/30"
                    }`}
                    data-ocid={`agent.history.status.${idx + 1}`}
                  >
                    {executed ? "Executed" : "Cancelled"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`text-xs font-medium ${colorCls}`}>
                    {actionKey}
                  </span>
                  <span className="text-xs text-slate-600">{timeStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VoiceAgentPanel({
  actor,
}: { actor: ReturnType<typeof useActor>["actor"] }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pendingResult, setPendingResult] = useState<AgentCommandResult | null>(
    null,
  );
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [quota, setQuota] = useState<{
    dailyCount: number;
    dailyLimit: number;
    remaining: number;
  } | null>(null);
  const [history, setHistory] = useState<CommandLogEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const recognitionRef = useRef<unknown>(null);
  const sessionId = useRef<string>(`session-${Date.now()}`);

  const SRClass =
    typeof window !== "undefined"
      ? ((
          window as unknown as {
            SpeechRecognition?: new () => unknown;
            webkitSpeechRecognition?: new () => unknown;
          }
        ).SpeechRecognition ??
        (
          window as unknown as {
            SpeechRecognition?: new () => unknown;
            webkitSpeechRecognition?: new () => unknown;
          }
        ).webkitSpeechRecognition)
      : undefined;
  const speechAvailable = !!SRClass;

  const fetchQuota = useCallback(async () => {
    if (!actor) return;
    try {
      const q = await actor.getAgentQuota();
      setQuota({
        dailyCount: Number(q.dailyCount),
        dailyLimit: Number(q.dailyLimit),
        remaining: Number(q.remaining),
      });
    } catch (_) {
      setQuota({ dailyCount: 0, dailyLimit: 500, remaining: 500 });
    }
  }, [actor]);

  const fetchHistory = useCallback(async () => {
    if (!actor) return;
    setHistoryLoading(true);
    try {
      const raw = await actor.getCommandHistory(BigInt(0), BigInt(10));
      setHistory(Array.isArray(raw) ? raw : []);
    } catch (_) {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchQuota();
    fetchHistory();
  }, [fetchQuota, fetchHistory]);

  function startListening() {
    if (!SRClass || listening) return;
    const recognition = new SRClass() as {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult:
        | ((event: { results: SpeechRecognitionResultList }) => void)
        | null;
      onerror: ((event: Event) => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: {
      results: SpeechRecognitionResultList;
    }) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript;
      setTranscript(text);
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setTranscript("");
  }

  function stopListening() {
    (recognitionRef.current as { stop: () => void } | null)?.stop();
    setListening(false);
  }

  function toggleVoice() {
    if (listening) stopListening();
    else startListening();
  }

  async function handleSubmit() {
    const command = speechAvailable ? transcript.trim() : textInput.trim();
    if (!command || !actor) return;
    setSubmitting(true);
    setQuotaError(null);
    setPendingResult(null);
    try {
      const result = await actor.submitAgentCommand(command, sessionId.current);
      if (result.error) {
        toast.error(result.error);
      } else {
        setPendingResult(result);
      }
    } catch {
      toast.error("Failed to process command. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm() {
    if (!pendingResult?.actionId || !actor) return;
    setConfirming(true);
    setQuotaError(null);
    try {
      const res = await actor.executeAgentAction(pendingResult.actionId);
      if (res.ok) {
        toast.success("Action executed! CRM log updated.", { duration: 5000 });
        setPendingResult(null);
        setTranscript("");
        setTextInput("");
        await Promise.all([fetchQuota(), fetchHistory()]);
      } else {
        const errMsg = res.error ?? "Action failed";
        if (/quota|limit|exceeded/i.test(errMsg)) {
          setQuotaError(`Daily limit reached: ${errMsg}`);
        } else {
          toast.error(errMsg);
        }
      }
    } catch {
      toast.error("Execution failed. Please try again.");
    } finally {
      setConfirming(false);
    }
  }

  function handleCancel() {
    setPendingResult(null);
    setQuotaError(null);
    setTranscript("");
    setTextInput("");
  }

  const activeCommand = speechAvailable ? transcript.trim() : textInput.trim();

  return (
    <div className="space-y-5" data-ocid="agent.panel">
      {/* Header card */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Voice Outreach Agent
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Powered by Brunson · Hormozi · Kennedy · Halbert frameworks
              </p>
            </div>
            {listening && (
              <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-cyan-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Listening
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Mic button area */}
          {speechAvailable ? (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={toggleVoice}
                className={`voice-mic-button${listening ? " listening" : ""}`}
                aria-label={listening ? "Stop listening" : "Start listening"}
                data-ocid="agent.mic_button"
              >
                {listening ? (
                  <MicOff className="w-7 h-7" />
                ) : (
                  <Mic className="w-7 h-7" />
                )}
              </button>
              <p className="text-xs text-slate-500">
                {listening
                  ? "Tap to stop — then submit your command"
                  : "Tap to speak a command"}
              </p>
            </div>
          ) : (
            <div
              className="flex items-start gap-2 bg-amber-900/20 border border-amber-700/30 rounded-xl px-3 py-2.5"
              data-ocid="agent.speech_unavailable_state"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-300 text-xs">
                Voice input unavailable in this browser. Use the text field
                below.
              </p>
            </div>
          )}

          {/* Transcript or text fallback */}
          {speechAvailable ? (
            transcript && (
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">Heard</p>
                <p className="text-slate-100 text-sm leading-relaxed">
                  {transcript}
                </p>
              </div>
            )
          ) : (
            <div>
              <label
                className="text-xs text-slate-400 mb-1.5 block"
                htmlFor="agent-text-input"
              >
                Type your command
              </label>
              <textarea
                id="agent-text-input"
                rows={3}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g. Send 50 follow-up emails to HVAC leads who haven't replied in 7 days"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 resize-none"
                data-ocid="agent.text_input"
              />
            </div>
          )}

          {/* Submit button */}
          {activeCommand && !pendingResult && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 border border-cyan-500/35 text-cyan-300 transition-all disabled:opacity-50"
              data-ocid="agent.submit_button"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing command…
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Submit Command
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation preview */}
      {pendingResult && (
        <ConfirmationCard
          result={pendingResult}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirming={confirming}
          quotaError={quotaError}
        />
      )}

      {/* Quota indicator */}
      {quota && <QuotaBar used={quota.dailyCount} limit={quota.dailyLimit} />}

      {/* Command history */}
      {historyLoading ? (
        <div
          className="flex items-center justify-center py-10"
          data-ocid="agent.history_loading_state"
        >
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
        </div>
      ) : (
        <CommandHistoryPanel entries={history} />
      )}
    </div>
  );
}

// ─── Lane Config ─────────────────────────────────────────────────────────────

const LANES: {
  id: PipelineLane;
  label: string;
  color: string;
  accent: string;
}[] = [
  {
    id: "new",
    label: "New",
    color: "border-blue-500/40",
    accent: "text-blue-400",
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "border-indigo-500/40",
    accent: "text-indigo-400",
  },
  {
    id: "replied",
    label: "Replied",
    color: "border-violet-500/40",
    accent: "text-violet-400",
  },
  {
    id: "demo_scheduled",
    label: "Demo Scheduled",
    color: "border-amber-500/40",
    accent: "text-amber-400",
  },
  {
    id: "trial",
    label: "Trial",
    color: "border-emerald-500/40",
    accent: "text-emerald-400",
  },
  {
    id: "customer",
    label: "Customer",
    color: "border-green-500/40",
    accent: "text-green-400",
  },
];

const LANE_HEADER_BG: Record<PipelineLane, string> = {
  new: "bg-blue-500/10",
  contacted: "bg-indigo-500/10",
  replied: "bg-violet-500/10",
  demo_scheduled: "bg-amber-500/10",
  trial: "bg-emerald-500/10",
  customer: "bg-green-500/10",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useCountdown(targetMs: number | undefined): string | null {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!targetMs) {
      setRemaining(null);
      return;
    }
    const tick = () => setRemaining(Math.max(0, targetMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (remaining === null) return null;
  if (remaining === 0) return "Fired";
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function NicheBadge({ niche }: { niche: string }) {
  const colorMap: Record<string, string> = {
    Roofing: "bg-amber-900/50 text-amber-300 border-amber-700/40",
    Plumbing: "bg-blue-900/50 text-blue-300 border-blue-700/40",
    HVAC: "bg-cyan-900/50 text-cyan-300 border-cyan-700/40",
    Restoration: "bg-orange-900/50 text-orange-300 border-orange-700/40",
    "Med Spa": "bg-pink-900/50 text-pink-300 border-pink-700/40",
    Dental: "bg-purple-900/50 text-purple-300 border-purple-700/40",
    "Real Estate": "bg-emerald-900/50 text-emerald-300 border-emerald-700/40",
    Mortgage: "bg-teal-900/50 text-teal-300 border-teal-700/40",
    Landscaping: "bg-green-900/50 text-green-300 border-green-700/40",
  };
  const cls =
    colorMap[niche] ?? "bg-slate-700/60 text-slate-300 border-slate-600/40";
  return (
    <span
      className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium border ${cls}`}
    >
      {niche}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const cls =
    source === "SerpApi.dev"
      ? "bg-indigo-900/50 text-indigo-300 border-indigo-700/40"
      : source === "OpenAI"
        ? "bg-green-900/50 text-green-300 border-green-700/40"
        : source === "TinyFish"
          ? "bg-violet-900/50 text-violet-300 border-violet-700/40"
          : source === "CSV"
            ? "bg-slate-700/60 text-slate-300 border-slate-600/40"
            : "bg-slate-800/60 text-slate-400 border-slate-700/40";
  return (
    <span
      className={`inline-flex text-xs px-1.5 py-0.5 rounded font-medium border ${cls}`}
    >
      {source}
    </span>
  );
}

function SentimentBadge({
  sentiment,
}: { sentiment: InboundReply["sentiment"] }) {
  const map = {
    positive: "bg-emerald-900/60 text-emerald-300 border-emerald-700/40",
    neutral: "bg-amber-900/60 text-amber-300 border-amber-700/40",
    negative: "bg-rose-900/60 text-rose-300 border-rose-700/40",
  };
  return (
    <span
      className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium border ${map[sentiment]}`}
    >
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
}

// ─── CountdownBadge (self-ticking) ───────────────────────────────────────────

function CountdownBadge({
  scheduledAt,
  status,
}: {
  scheduledAt?: number;
  status?: "pending" | "fired" | "cancelled";
}) {
  const countdown = useCountdown(
    status === "pending" ? scheduledAt : undefined,
  );
  if (!scheduledAt || status === "cancelled") return null;
  if (status === "fired" || countdown === "Fired") {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">
        <Zap className="w-3 h-3" /> Fired
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/40 font-mono">
      <Clock className="w-3 h-3" /> {countdown}
    </span>
  );
}

// ─── Lead Card ───────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  pendingActionCount,
  onApprove,
  onCancel,
  onDragStart,
}: {
  lead: PipelineLead;
  pendingActionCount: number;
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const [approving, setApproving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleApprove() {
    setApproving(true);
    await onApprove(lead.id);
    setApproving(false);
  }

  async function handleCancel() {
    setCancelling(true);
    await onCancel(lead.id);
    setCancelling(false);
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all duration-200 select-none"
      data-ocid={`pipeline.lead.card.${lead.id}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-slate-100 text-sm font-semibold leading-tight min-w-0 truncate">
          {lead.businessName}
        </p>
        {lead.qualityScore !== undefined && (
          <span
            className={`text-xs font-mono font-bold shrink-0 ${
              lead.qualityScore >= 75
                ? "text-emerald-400"
                : lead.qualityScore >= 50
                  ? "text-amber-400"
                  : "text-rose-400"
            }`}
          >
            {lead.qualityScore}
          </span>
        )}
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        <NicheBadge niche={lead.niche} />
        <SourceBadge source={lead.source} />
        <CountdownBadge
          scheduledAt={lead.autoTriggerScheduledAt}
          status={lead.autoTriggerStatus}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleApprove}
          disabled={approving}
          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-600/30 text-emerald-300 transition-colors disabled:opacity-60"
          data-ocid={`pipeline.approve_button.${lead.id}`}
        >
          {approving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-3 h-3" />
              Approve
              {pendingActionCount > 0 && (
                <span className="ml-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {pendingActionCount}
                </span>
              )}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={cancelling}
          className="flex-1 flex items-center justify-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 border border-rose-600/30 text-rose-300 transition-colors disabled:opacity-60"
          data-ocid={`pipeline.cancel_button.${lead.id}`}
        >
          {cancelling ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <X className="w-3 h-3" /> Cancel
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Lane Column ─────────────────────────────────────────────────────────────

function LaneColumn({
  lane,
  leads,
  pendingActions,
  onApprove,
  onCancel,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  lane: (typeof LANES)[number];
  leads: PipelineLead[];
  pendingActions: Record<string, number>;
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, laneId: PipelineLane) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex flex-col min-w-[220px] flex-1 rounded-xl border ${
        dragOver ? "border-white/30 bg-white/8" : `${lane.color} bg-white/5`
      } transition-all duration-150`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
        onDragOver(e);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        setDragOver(false);
        onDrop(e, lane.id);
      }}
      data-ocid={`pipeline.lane.${lane.id}`}
    >
      {/* Lane header */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl ${LANE_HEADER_BG[lane.id]}`}
      >
        <span className={`text-sm font-semibold ${lane.accent}`}>
          {lane.label}
        </span>
        <span className="text-xs bg-white/10 text-slate-400 font-mono rounded-full px-2 py-0.5">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 p-2 flex-1 min-h-[120px]">
        {leads.length === 0 ? (
          <p className="text-slate-600 text-xs text-center mt-6">No leads</p>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              pendingActionCount={pendingActions[lead.id] ?? 0}
              onApprove={onApprove}
              onCancel={onCancel}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Reply Inbox ──────────────────────────────────────────────────────────────

function ReplyInboxRow({
  reply,
  onApplySuggestion,
  onMarkComplete,
}: {
  reply: InboundReply;
  onApplySuggestion: (id: string) => void;
  onMarkComplete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const [completing, setCompleting] = useState(false);

  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all ${
        reply.actionComplete ? "opacity-60" : ""
      }`}
      data-ocid={`reply-inbox.item.${reply.id}`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
        data-ocid={`reply-inbox.toggle.${reply.id}`}
      >
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-100 text-sm font-semibold truncate">
              {reply.prospectEmail}
            </span>
            <SentimentBadge sentiment={reply.sentiment} />
            {reply.actionComplete && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Done
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate">
            {reply.subject}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5">
          {/* Reply body */}
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1">Reply</p>
            <p className="text-sm text-slate-300 bg-white/5 rounded-lg px-3 py-2 leading-relaxed">
              {reply.body}
            </p>
          </div>

          {/* Claude analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-lg px-3 py-2">
              <p className="text-xs text-indigo-400 mb-1 font-medium">
                Claude Suggested Action
              </p>
              <p className="text-sm text-slate-200">
                {reply.claudeSuggestedAction}
              </p>
            </div>
            <div className="bg-violet-900/20 border border-violet-700/30 rounded-lg px-3 py-2">
              <p className="text-xs text-violet-400 mb-1 font-medium">
                Pain Points
              </p>
              <p className="text-sm text-slate-200">
                {reply.painPointsSummary}
              </p>
            </div>
          </div>

          {/* Actions */}
          {!reply.actionComplete && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={applying}
                onClick={async () => {
                  setApplying(true);
                  await onApplySuggestion(reply.id);
                  setApplying(false);
                }}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-600/25 hover:bg-indigo-600/50 border border-indigo-600/40 text-indigo-300 transition-colors disabled:opacity-60"
                data-ocid={`reply-inbox.apply_suggestion.${reply.id}`}
              >
                {applying ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Zap className="w-3 h-3" />
                )}
                Apply Suggestion
              </button>
              <button
                type="button"
                disabled={completing}
                onClick={async () => {
                  setCompleting(true);
                  await onMarkComplete(reply.id);
                  setCompleting(false);
                }}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600/25 hover:bg-emerald-600/50 border border-emerald-600/40 text-emerald-300 transition-colors disabled:opacity-60"
                data-ocid={`reply-inbox.mark_complete.${reply.id}`}
              >
                {completing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                Mark Complete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OutreachPipelinePage() {
  const { actor } = useActor();

  // ── State ──────────────────────────────────────────────────────────────────
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [replies, setReplies] = useState<InboundReply[]>([]);
  const [pendingActions, setPendingActions] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pipeline" | "inbox" | "agent">(
    "pipeline",
  );
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const dragLeadId = useRef<string | null>(null);

  // ── Normalizers (backend returns bigint timestamps) ────────────────────────
  const normalizeLead = useCallback(
    (raw: Record<string, unknown>): PipelineLead => {
      return {
        id: String(raw.id ?? ""),
        businessName: String(
          raw.businessName ?? raw.business_name ?? "Unknown",
        ),
        niche: String(raw.niche ?? "General"),
        source: String(raw.source ?? "Manual"),
        email: raw.email ? String(raw.email) : undefined,
        lane: (raw.lane as PipelineLane) ?? "new",
        autoTriggerScheduledAt: raw.autoTriggerScheduledAt
          ? Number(raw.autoTriggerScheduledAt) / 1_000_000 // nanoseconds → ms
          : undefined,
        autoTriggerStatus:
          (raw.autoTriggerStatus as PipelineLead["autoTriggerStatus"]) ??
          undefined,
        qualityScore:
          raw.qualityScore !== undefined ? Number(raw.qualityScore) : undefined,
        createdAt: raw.createdAt
          ? Number(raw.createdAt) / 1_000_000
          : undefined,
      };
    },
    [],
  );

  const normalizeReply = useCallback(
    (raw: Record<string, unknown>): InboundReply => {
      const sentiment = String(
        raw.sentiment ?? "neutral",
      ) as InboundReply["sentiment"];
      return {
        id: String(raw.id ?? ""),
        prospectEmail: String(raw.prospectEmail ?? raw.leadEmail ?? ""),
        subject: String(raw.subject ?? "(no subject)"),
        body: String(raw.body ?? raw.replyBody ?? ""),
        receivedAt: raw.receivedAt
          ? Number(raw.receivedAt) / 1_000_000
          : Date.now(),
        sentiment: ["positive", "neutral", "negative"].includes(sentiment)
          ? sentiment
          : "neutral",
        claudeSuggestedAction: String(
          raw.claudeSuggestedAction ??
            raw.suggestedAction ??
            "Follow up with this prospect.",
        ),
        painPointsSummary: String(
          raw.painPointsSummary ?? raw.painPoints ?? "Not analyzed yet.",
        ),
        actionComplete: Boolean(raw.actionComplete),
      };
    },
    [],
  );

  // ── Data Fetching ──────────────────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    if (!actor) return;
    try {
      const raw = await actor.getPipelineLeads();
      setLeads(Array.isArray(raw) ? raw.map(normalizeLead) : []);
    } catch {
      // getPipelineLeads failed silently
    }
  }, [actor, normalizeLead]);

  const fetchPendingActions = useCallback(async () => {
    if (!actor) return;
    try {
      const raw = await actor.getPendingQueuedActions();
      if (Array.isArray(raw)) {
        const counts: Record<string, number> = {};
        for (const item of raw as Record<string, unknown>[]) {
          const lid = String(item.leadId ?? "");
          if (lid) counts[lid] = (counts[lid] ?? 0) + 1;
        }
        setPendingActions(counts);
      }
    } catch {
      // getPendingQueuedActions failed silently
    }
  }, [actor]);

  const fetchReplies = useCallback(async () => {
    if (!actor) return;
    setReplyLoading(true);
    try {
      const raw = await actor.getInboundReplies(null);
      setReplies(Array.isArray(raw) ? raw.map(normalizeReply) : []);
    } catch {
      // getInboundReplies failed silently
    } finally {
      setReplyLoading(false);
    }
  }, [actor, normalizeReply]);

  // Initial load
  useEffect(() => {
    if (!actor) return;
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchLeads(), fetchPendingActions()]);
      setLoading(false);
    };
    load();
  }, [actor, fetchLeads, fetchPendingActions]);

  // Load replies when tab switches to inbox
  useEffect(() => {
    if (activeTab === "inbox") fetchReplies();
  }, [activeTab, fetchReplies]);

  // 30-second refresh interval
  useEffect(() => {
    const id = setInterval(async () => {
      await Promise.all([fetchLeads(), fetchPendingActions()]);
    }, 30_000);
    return () => clearInterval(id);
  }, [fetchLeads, fetchPendingActions]);

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  function handleDragStart(e: React.DragEvent, leadId: string) {
    dragLeadId.current = leadId;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  async function handleDrop(e: React.DragEvent, targetLane: PipelineLane) {
    e.preventDefault();
    const leadId = dragLeadId.current;
    dragLeadId.current = null;
    if (!leadId || !actor) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.lane === targetLane) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, lane: targetLane } : l)),
    );

    try {
      await actor.movePipelineLead(leadId, targetLane);
      toast.success(
        `Moved to ${LANES.find((la) => la.id === targetLane)?.label}`,
      );
    } catch (_err) {
      // Revert on failure
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, lane: lead.lane } : l)),
      );
      toast.error("Failed to move lead — please try again");
    }
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  async function handleApprove(leadId: string) {
    if (!actor) return;
    try {
      await actor.approveQueuedAction(leadId);
      setPendingActions((prev) => {
        const updated = { ...prev };
        if ((updated[leadId] ?? 0) > 1) updated[leadId] -= 1;
        else delete updated[leadId];
        return updated;
      });
      toast.success("Action approved");
    } catch (_err) {
      toast.error("Failed to approve action");
    }
  }

  async function handleCancel(leadId: string) {
    if (!actor) return;
    try {
      await actor.cancelQueuedAction(leadId);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, autoTriggerStatus: "cancelled" } : l,
        ),
      );
      toast.success("Auto-trigger cancelled");
    } catch (_err) {
      toast.error("Failed to cancel action");
    }
  }

  async function handleApplySuggestion(replyId: string) {
    if (!actor) return;
    try {
      await actor.markReplyActionComplete(replyId);
      setReplies((prev) =>
        prev.map((r) =>
          r.id === replyId ? { ...r, actionComplete: true } : r,
        ),
      );
      toast.success("Suggestion applied & marked complete");
    } catch (_err) {
      toast.error("Failed to apply suggestion");
    }
  }

  async function handleMarkComplete(replyId: string) {
    if (!actor) return;
    try {
      await actor.markReplyActionComplete(replyId);
      setReplies((prev) =>
        prev.map((r) =>
          r.id === replyId ? { ...r, actionComplete: true } : r,
        ),
      );
      toast.success("Marked as complete");
    } catch (_err) {
      toast.error("Failed to mark complete");
    }
  }

  async function handleManualRefresh() {
    setRefreshing(true);
    await Promise.all([fetchLeads(), fetchPendingActions()]);
    setRefreshing(false);
    toast.success("Pipeline refreshed");
  }

  // ── Filtered Leads ─────────────────────────────────────────────────────────
  const filteredLeads = search.trim()
    ? leads.filter(
        (l) =>
          l.businessName.toLowerCase().includes(search.toLowerCase()) ||
          l.niche.toLowerCase().includes(search.toLowerCase()),
      )
    : leads;

  const leadsByLane = LANES.reduce(
    (acc, lane) => {
      acc[lane.id] = filteredLeads.filter((l) => l.lane === lane.id);
      return acc;
    },
    {} as Record<PipelineLane, PipelineLead[]>,
  );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalLeads = leads.length;
  const pendingCount = Object.values(pendingActions).reduce((a, b) => a + b, 0);
  const inboxUnread = replies.filter((r) => !r.actionComplete).length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-slate-100">
      {/* Page header */}
      <div className="border-b border-white/10 bg-white/3 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              Real-Time Outreach Pipeline
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Drag leads between stages · Auto-triggers fire outreach
              automatically
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors disabled:opacity-60"
              data-ocid="pipeline.refresh_button"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Leads", value: totalLeads, color: "text-blue-400" },
            {
              label: "Pending Actions",
              value: pendingCount,
              color: "text-amber-400",
            },
            {
              label: "Reply Inbox",
              value: inboxUnread,
              color: "text-violet-400",
            },
            {
              label: "Customers",
              value: leadsByLane.customer?.length ?? 0,
              color: "text-emerald-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            >
              <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher + search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                activeTab === "pipeline"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              data-ocid="pipeline.tab"
            >
              <Send className="w-4 h-4" /> Pipeline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("inbox")}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors relative ${
                activeTab === "inbox"
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              data-ocid="reply-inbox.tab"
            >
              <Inbox className="w-4 h-4" /> Reply Inbox
              {inboxUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {inboxUnread > 9 ? "9+" : inboxUnread}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("agent")}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                activeTab === "agent"
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              data-ocid="agent.tab"
            >
              <Bot className="w-4 h-4" /> AI Agent
            </button>
          </div>

          {activeTab === "pipeline" && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or niche…"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                data-ocid="pipeline.search_input"
              />
            </div>
          )}
        </div>

        {/* Pipeline board */}
        {activeTab === "pipeline" && (
          <div>
            {loading ? (
              <div
                className="flex items-center justify-center py-20"
                data-ocid="pipeline.loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <span className="ml-3 text-slate-400">Loading pipeline…</span>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-4">
                {LANES.map((lane) => (
                  <LaneColumn
                    key={lane.id}
                    lane={lane}
                    leads={leadsByLane[lane.id] ?? []}
                    pendingActions={pendingActions}
                    onApprove={handleApprove}
                    onCancel={handleCancel}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Voice Agent Panel */}
        {activeTab === "agent" && (
          <div className="max-w-2xl mx-auto">
            <VoiceAgentPanel actor={actor} />
          </div>
        )}

        {/* Reply inbox */}
        {activeTab === "inbox" && (
          <div className="space-y-3">
            {replyLoading ? (
              <div
                className="flex items-center justify-center py-16"
                data-ocid="reply-inbox.loading_state"
              >
                <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
                <span className="ml-3 text-slate-400">Loading replies…</span>
              </div>
            ) : replies.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-xl"
                data-ocid="reply-inbox.empty_state"
              >
                <Inbox className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-400 font-medium">No replies yet</p>
                <p className="text-slate-600 text-sm mt-1">
                  Inbound prospect replies will appear here once your outreach
                  is active.
                </p>
              </div>
            ) : (
              replies.map((reply) => (
                <ReplyInboxRow
                  key={reply.id}
                  reply={reply}
                  onApplySuggestion={handleApplySuggestion}
                  onMarkComplete={handleMarkComplete}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
