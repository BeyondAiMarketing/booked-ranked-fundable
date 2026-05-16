import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  MessageSquareDot,
  MicOff,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useApp } from "../context/AppContext";
import type { CallLog } from "../types/telephony";

// ─── Local alias for backwards compat ────────────────────────────────────────
type CallLogEntry = CallLog;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type OutcomeFilter = "all" | "completed" | "missed" | "voicemail" | "no_answer";
type DateRange = "7d" | "30d" | "90d";

const OUTCOME_LABELS: Record<CallLogEntry["outcome"], string> = {
  completed: "Completed",
  missed: "Missed",
  voicemail: "Voicemail",
  no_answer: "No Answer",
  busy: "Busy",
};

const OUTCOME_BADGE_CLASSES: Record<CallLogEntry["outcome"], string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  missed: "bg-red-500/15 text-red-400 border-red-500/30",
  voicemail: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  no_answer: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  busy: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  ocid,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  ocid: string;
}) {
  return (
    <div
      className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-start gap-3"
      data-ocid={ocid}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Call Card ────────────────────────────────────────────────────────────────

function CallCard({
  call,
  index,
  smsThreadId,
}: { call: CallLogEntry; index: number; smsThreadId?: string }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const OutcomeIcon =
    call.outcome === "completed"
      ? CheckCircle2
      : call.outcome === "missed"
        ? PhoneMissed
        : call.outcome === "voicemail"
          ? MicOff
          : Phone;

  const outcomeIconColor =
    call.outcome === "completed"
      ? "text-emerald-400"
      : call.outcome === "missed"
        ? "text-red-400"
        : call.outcome === "voicemail"
          ? "text-amber-400"
          : "text-gray-500";

  const DirectionIcon =
    call.direction === "inbound" ? PhoneIncoming : PhoneOutgoing;

  return (
    <div
      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
      data-ocid={`call_log.item.${index + 1}`}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Outcome icon */}
        <div className={`shrink-0 ${outcomeIconColor}`}>
          <OutcomeIcon size={20} />
        </div>

        {/* Caller info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">
              {call.callerName ?? call.callerPhone}
            </span>
            {call.callerName && (
              <span className="text-xs text-gray-500">{call.callerPhone}</span>
            )}
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                call.direction === "inbound"
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-purple-500/10 text-purple-400 border-purple-500/20"
              }`}
            >
              <DirectionIcon size={9} />
              {call.direction === "inbound" ? "Inbound" : "Outbound"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={10} />
              {formatDuration(call.durationSeconds)}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <span className="text-xs text-gray-500">
            {formatTimestamp(call.startedAt)}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${OUTCOME_BADGE_CLASSES[call.outcome]}`}
            data-ocid={`call_log.outcome_badge.${index + 1}`}
          >
            {OUTCOME_LABELS[call.outcome]}
          </span>
          {call.leadCreated && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border bg-indigo-500/15 text-indigo-400 border-indigo-500/30">
              Lead Created
            </span>
          )}
          {call.outcome === "missed" && call.missedSmsSet && smsThreadId && (
            <button
              type="button"
              onClick={() => navigate({ to: "/sms-inbox" })}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25 transition-colors"
              data-ocid={`call_log.view_sms_thread.${index + 1}`}
            >
              <MessageSquareDot size={11} />
              View SMS Thread
            </button>
          )}
          {call.transcript.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded hover:bg-white/8 text-gray-400 hover:text-white transition-colors"
              aria-label={
                expanded ? "Collapse transcript" : "Expand transcript"
              }
              data-ocid={`call_log.expand_button.${index + 1}`}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Expanded transcript */}
      {expanded && call.transcript.length > 0 && (
        <div className="border-t border-gray-700/60 px-4 pb-4 pt-3 space-y-3">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Transcript
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {call.transcript.map((turn, i) => (
              <div
                key={`${call.id}-turn-${i}`}
                className={`flex gap-2.5 ${turn.speaker === "agent" ? "" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-1 rounded-full shrink-0 self-stretch ${
                    turn.speaker === "agent" ? "bg-indigo-500" : "bg-gray-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[10px] font-semibold mb-0.5 ${
                      turn.speaker === "agent"
                        ? "text-indigo-400"
                        : "text-gray-400"
                    }`}
                  >
                    {turn.speaker === "agent" ? "AI Agent" : "Caller"}
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {turn.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-gray-700/40">
            {call.leadCreated && call.leadId && (
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/leads";
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                data-ocid={`call_log.view_lead.${index + 1}`}
              >
                <ExternalLink size={11} />
                View Lead →
              </button>
            )}
            {call.vapiCallId && (
              <span className="text-[10px] text-gray-600 font-mono">
                Vapi: {call.vapiCallId}
              </span>
            )}
            {call.twilioCallSid && (
              <span className="text-[10px] text-gray-600 font-mono">
                Twilio: {call.twilioCallSid}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CallLogPage() {
  const { currentTenantId, isAdminUser, smsThreads, callLogs } = useApp();

  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [search, setSearch] = useState("");
  const [lastSynced] = useState<number>(() => Date.now());

  const lastSyncedText = (() => {
    const diffMs = Date.now() - lastSynced;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    return `${Math.floor(diffMin / 60)}h ago`;
  })();

  // Filter calls: admin sees all, client sees only their tenant
  const allCalls = useMemo(() => {
    const cutoffMs: Record<DateRange, number> = {
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    };
    const cutoff = Date.now() - cutoffMs[dateRange];
    return callLogs.filter((c) => {
      if (!isAdminUser && c.tenantId !== currentTenantId) return false;
      if (new Date(c.startedAt).getTime() < cutoff) return false;
      return true;
    });
  }, [callLogs, isAdminUser, currentTenantId, dateRange]);

  const filtered = useMemo(() => {
    return allCalls.filter((c) => {
      if (outcomeFilter !== "all" && c.outcome !== outcomeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !c.callerPhone.includes(q) &&
          !(c.callerName ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [allCalls, outcomeFilter, search]);

  // Stats
  const totalCalls = allCalls.length;
  const answered = allCalls.filter((c) => c.outcome === "completed").length;
  const answeredRate =
    totalCalls > 0 ? Math.round((answered / totalCalls) * 100) : 0;
  const leadsCreated = allCalls.filter((c) => c.leadCreated).length;
  const convRate =
    answered > 0 ? Math.round((leadsCreated / answered) * 100) : 0;
  const completedWithDuration = allCalls.filter((c) => c.durationSeconds > 0);
  const avgDuration =
    completedWithDuration.length > 0
      ? Math.round(
          completedWithDuration.reduce((sum, c) => sum + c.durationSeconds, 0) /
            completedWithDuration.length,
        )
      : 0;

  return (
    <div className="space-y-6" data-ocid="call_log.page">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-white">Call Log</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Inbound call history, transcripts, and lead conversions from your
            voice agent.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
          <RefreshCw size={11} />
          <span>Last synced: {lastSyncedText}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="call_log.stats.section"
      >
        <StatCard
          label="Total Calls"
          value={totalCalls.toString()}
          sub={`Last ${dateRange === "7d" ? "7" : dateRange === "30d" ? "30" : "90"} days`}
          icon={Phone}
          color="bg-indigo-500/20 text-indigo-400"
          ocid="call_log.total_calls.card"
        />
        <StatCard
          label="Answered"
          value={answered.toString()}
          sub={`${answeredRate}% answer rate`}
          icon={CheckCircle2}
          color="bg-emerald-500/20 text-emerald-400"
          ocid="call_log.answered.card"
        />
        <StatCard
          label="Leads Created"
          value={leadsCreated.toString()}
          sub={`${convRate}% conversion rate`}
          icon={Users}
          color="bg-purple-500/20 text-purple-400"
          ocid="call_log.leads_created.card"
        />
        <StatCard
          label="Avg Duration"
          value={formatDuration(avgDuration)}
          sub="Completed calls only"
          icon={Clock}
          color="bg-blue-500/20 text-blue-400"
          ocid="call_log.avg_duration.card"
        />
      </div>

      {/* Filter Bar */}
      <div
        className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center"
        data-ocid="call_log.filter_bar"
      >
        <div className="relative flex-1 min-w-0 w-full sm:w-auto">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-9 text-sm"
            data-ocid="call_log.search_input"
          />
        </div>
        <Select
          value={outcomeFilter}
          onValueChange={(v) => setOutcomeFilter(v as OutcomeFilter)}
        >
          <SelectTrigger
            className="bg-gray-800 border-gray-700 text-gray-300 h-9 w-full sm:w-44 text-sm"
            data-ocid="call_log.outcome_filter.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Outcomes</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="voicemail">Voicemail</SelectItem>
            <SelectItem value="no_answer">No Answer</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={dateRange}
          onValueChange={(v) => setDateRange(v as DateRange)}
        >
          <SelectTrigger
            className="bg-gray-800 border-gray-700 text-gray-300 h-9 w-full sm:w-40 text-sm"
            data-ocid="call_log.date_range.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Call List */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="call_log.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <Phone size={28} className="text-gray-600" />
          </div>
          <p className="text-base font-semibold text-white mb-1">
            No calls yet
          </p>
          <p className="text-sm text-gray-500 max-w-xs">
            {search || outcomeFilter !== "all"
              ? "No calls match your current filters. Try adjusting the search or outcome."
              : "Once your voice agent starts receiving calls, they will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="call_log.list">
          {filtered.map((call, i) => {
            const smsThread = smsThreads.find(
              (t) =>
                t.tenantId === call.tenantId &&
                t.prospectPhone === call.callerPhone,
            );
            return (
              <CallCard
                key={call.id}
                call={call}
                index={i}
                smsThreadId={smsThread?.id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
