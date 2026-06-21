import { useActor } from "@/hooks/useActor";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Flame,
  Info,
  Loader2,
  RefreshCw,
  Send,
  Snowflake,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Trial Account Management types ─────────────────────────────────────────
interface TrialAccount {
  trialAccountId: string;
  sessionId: string;
  firstName: string;
  businessName: string;
  city: string;
  niche: string;
  phone: string;
  email: string;
  website: string;
  activatedAt: bigint;
  featureFlags: FeatureFlags;
  status: string;
  daysRemaining: bigint;
  lastLoginAt: bigint | null;
  activityScore: bigint;
  day5ReminderSent: boolean;
  convertedAt: bigint | null;
}

type SortKey = "daysRemaining" | "lastLogin" | "activityScore" | "activatedAt";
type ScoreTier = "All" | "Cold" | "Warm" | "Hot";
type StatusFilter = "all" | "active" | "expired";

// ─── Feature Flags ───────────────────────────────────────────────────────────
interface FeatureFlags {
  crm: boolean;
  social: boolean;
  analytics: boolean;
  reputation: boolean;
  voiceAgent: boolean;
  creditBuilder: boolean;
}

const featureLabels: Record<keyof FeatureFlags, string> = {
  crm: "CRM",
  social: "Social Media",
  analytics: "Analytics",
  reputation: "Reputation",
  voiceAgent: "Voice Agent",
  creditBuilder: "Credit Builder",
};

const defaultFlags: FeatureFlags = {
  crm: true,
  social: true,
  analytics: true,
  reputation: true,
  voiceAgent: true,
  creditBuilder: true,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatNs(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function formatLastLogin(ns: bigint | null): string {
  if (ns === null) return "Never logged in";
  return formatNs(ns);
}

function scoreTier(score: number): {
  label: string;
  color: string;
  icon: React.ReactNode;
} {
  if (score <= 30)
    return {
      label: "Cold",
      color: "bg-rose-900/50 text-rose-300 border-rose-700/40",
      icon: <Snowflake className="w-3 h-3" />,
    };
  if (score <= 60)
    return {
      label: "Warm",
      color: "bg-amber-900/50 text-amber-300 border-amber-700/40",
      icon: <TrendingUp className="w-3 h-3" />,
    };
  return {
    label: "Hot",
    color: "bg-red-900/50 text-red-300 border-red-700/40",
    icon: <Flame className="w-3 h-3" />,
  };
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

// ─── Conversion Modal ────────────────────────────────────────────────────────
function ConversionModal({
  trial,
  onClose,
  onSend,
}: {
  trial: TrialAccount;
  onClose: () => void;
  onSend: (id: string) => Promise<void>;
}) {
  const { actor } = useActor();
  const [body, setBody] = useState("Loading conversion message…");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .generateConversionPush(trial.trialAccountId)
      .then((text: string) => setBody(text))
      .catch(() =>
        setBody(
          "Follow up with this trial prospect about upgrading to a paid plan.",
        ),
      )
      .finally(() => setLoading(false));
  }, [actor, trial.trialAccountId]);

  async function handleSend() {
    setSending(true);
    await onSend(trial.trialAccountId);
    setSending(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      data-ocid="trials.conversion_modal"
    >
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-400" />
            Push Conversion — {trial.businessName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            data-ocid="trials.close_button"
          >
            ✕
          </button>
        </div>
        {loading ? (
          <div
            className="flex items-center gap-3 py-8 justify-center"
            data-ocid="trials.loading_state"
          >
            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-slate-400 text-sm">
              Generating conversion message…
            </span>
          </div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 resize-none focus:outline-none focus:border-blue-500/50 mb-4"
            data-ocid="trials.conversion_textarea"
          />
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            data-ocid="trials.cancel_button"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            data-ocid="trials.confirm_button"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sending ? "Sending…" : "Send Reminder"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────
function TrialRow({
  trial,
  selected,
  onSelect,
  onPushConversion,
  index,
}: {
  trial: TrialAccount;
  selected: boolean;
  onSelect: (id: string) => void;
  onPushConversion: (trial: TrialAccount) => void;
  index: number;
}) {
  const [flagsOpen, setFlagsOpen] = useState(false);
  const score = Number(trial.activityScore);
  const tier = scoreTier(score);
  const days = Number(trial.daysRemaining);
  const showReminderPending =
    !trial.day5ReminderSent && trial.status === "active";

  return (
    <>
      <tr
        className="border-b border-white/5 hover:bg-white/3 transition-colors"
        data-ocid={`trials.item.${index + 1}`}
      >
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(trial.trialAccountId)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-blue-600"
            data-ocid={`trials.checkbox.${index + 1}`}
          />
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-100 leading-tight">
              {trial.businessName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {trial.firstName} · {trial.city}
            </p>
          </div>
        </td>
        <td className="px-4 py-3">
          <NicheBadge niche={trial.niche} />
        </td>
        <td className="px-4 py-3">
          <p className="text-sm text-slate-300 max-w-[160px] truncate">
            {trial.email}
          </p>
        </td>
        <td className="px-4 py-3 text-sm text-slate-400">
          {formatNs(trial.activatedAt)}
        </td>
        <td className="px-4 py-3">
          <span
            className={`text-sm font-bold ${
              days <= 1
                ? "text-red-400"
                : days <= 3
                  ? "text-amber-400"
                  : "text-slate-300"
            }`}
          >
            {days}d
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-slate-400">
          {formatLastLogin(trial.lastLoginAt)}
        </td>
        <td className="px-4 py-3">
          <div className="relative group inline-flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${tier.color}`}
              data-ocid={`trials.score_badge.${index + 1}`}
            >
              {tier.icon}
              {score}
            </span>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 hidden group-hover:block w-52 bg-gray-800 border border-white/10 rounded-lg p-2.5 text-xs text-slate-300 shadow-xl">
              <p className="font-semibold text-white mb-1.5 flex items-center gap-1">
                <Info className="w-3 h-3" /> Score Breakdown
              </p>
              <p>
                Login <span className="text-blue-400">+5 pts</span>
              </p>
              <p>
                CRM view <span className="text-blue-400">+2 pts</span>
              </p>
              <p>
                Social scheduler <span className="text-blue-400">+3 pts</span>
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          {trial.day5ReminderSent ? (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/40">
              <CheckCircle2 className="w-3 h-3" /> Reminder Sent
            </span>
          ) : showReminderPending ? (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-900/50 text-orange-300 border border-orange-700/40 animate-pulse">
              <AlertTriangle className="w-3 h-3" /> Reminder Pending
            </span>
          ) : (
            <span className="text-xs text-slate-600">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPushConversion(trial)}
              className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/30 text-blue-300 transition-colors whitespace-nowrap"
              data-ocid={`trials.push_conversion_button.${index + 1}`}
            >
              <Zap className="w-3 h-3" /> Push
            </button>
            <button
              type="button"
              onClick={() => setFlagsOpen((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 transition-colors"
              data-ocid={`trials.toggle_flags_button.${index + 1}`}
            >
              {flagsOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
        </td>
      </tr>
      {flagsOpen && (
        <tr className="border-b border-white/5 bg-white/2">
          <td colSpan={10} className="px-6 py-3">
            <FeatureFlagSubPanel trialId={trial.trialAccountId} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Feature Flag Sub-Panel (inline, per row) ─────────────────────────────────
function FeatureFlagSubPanel({ trialId }: { trialId: string }) {
  const { actor } = useActor();
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const loadFlags = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getTrialFeatureFlags(trialId);
      setFlags(result ? (result as FeatureFlags) : defaultFlags);
    } catch {
      setSaveStatus("Error loading flags");
    } finally {
      setLoading(false);
    }
  }, [actor, trialId]);

  useEffect(() => {
    loadFlags();
  }, [loadFlags]);

  const toggle = (key: keyof FeatureFlags) => {
    if (!flags) return;
    setFlags({ ...flags, [key]: !flags[key] });
  };

  const saveFlags = async () => {
    if (!actor || !flags) return;
    setLoading(true);
    setSaveStatus(null);
    try {
      const result = (await actor.updateTrialFeatureFlags(trialId, flags)) as {
        __kind__: string;
        err?: string;
      };
      setSaveStatus(
        result.__kind__ === "ok" ? "Saved!" : `Error: ${result.err}`,
      );
    } catch {
      setSaveStatus("Error saving");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !flags)
    return (
      <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
        <Loader2 className="w-3 h-3 animate-spin" /> Loading flags…
      </div>
    );

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-xs text-slate-500 uppercase tracking-widest">
        Feature Flags
      </span>
      {flags &&
        (Object.keys(featureLabels) as (keyof FeatureFlags)[]).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggle(key)}
              data-ocid={`admin.toggle.${key}.${trialId}`}
              className={`relative w-10 h-5 rounded-full transition-colors ${flags[key] ? "bg-purple-600" : "bg-gray-700"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${flags[key] ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
            <span className="text-xs text-slate-400">{featureLabels[key]}</span>
          </div>
        ))}
      <button
        type="button"
        onClick={saveFlags}
        disabled={loading}
        className="ml-auto text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
        data-ocid={`admin.save_button.${trialId}`}
      >
        {loading ? "Saving…" : "Save"}
      </button>
      {saveStatus && (
        <span
          className={`text-xs ${saveStatus.startsWith("Error") ? "text-red-400" : "text-emerald-400"}`}
        >
          {saveStatus}
        </span>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export const AdminTrialsPage: React.FC = () => {
  const { actor } = useActor();

  // ── Trial Management State ──────────────────────────────────────────────
  const [trials, setTrials] = useState<TrialAccount[]>([]);
  const [trialsLoading, setTrialsLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("daysRemaining");
  const [sortAsc, setSortAsc] = useState(true);
  const [nicheFilter, setNicheFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState<ScoreTier>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [conversionTrial, setConversionTrial] = useState<TrialAccount | null>(
    null,
  );
  const [bulkLoading, setBulkLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Feature Flag State (legacy section) ────────────────────────────────
  const [trialId, setTrialId] = useState("");
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [legacyOpen, setLegacyOpen] = useState(false);

  // ── Data Fetching ───────────────────────────────────────────────────────
  const fetchTrials = useCallback(async () => {
    if (!actor) return;
    try {
      const raw = (await actor.getTrialAccountsWithActivity()) as unknown[];
      setTrials(
        Array.isArray(raw)
          ? raw.map((t) => {
              const r = t as Record<string, unknown>;
              return {
                trialAccountId: String(r.trialAccountId ?? r.id ?? ""),
                sessionId: String(r.sessionId ?? ""),
                firstName: String(r.firstName ?? ""),
                businessName: String(
                  r.businessName ?? r.business_name ?? "Unknown",
                ),
                city: String(r.city ?? ""),
                niche: String(r.niche ?? "General"),
                phone: String(r.phone ?? ""),
                email: String(r.email ?? ""),
                website: String(r.website ?? ""),
                activatedAt: BigInt(
                  String(r.activatedAt ?? r.activated_at ?? "0"),
                ),
                featureFlags: (r.featureFlags as FeatureFlags) ?? defaultFlags,
                status: String(r.status ?? "active"),
                daysRemaining: BigInt(
                  String(r.daysRemaining ?? r.days_remaining ?? "7"),
                ),
                lastLoginAt:
                  r.lastLoginAt != null ? BigInt(String(r.lastLoginAt)) : null,
                activityScore: BigInt(String(r.activityScore ?? "0")),
                day5ReminderSent: Boolean(
                  r.day5ReminderSent ?? r.day5_reminder_sent ?? false,
                ),
                convertedAt:
                  r.convertedAt != null ? BigInt(String(r.convertedAt)) : null,
              } as TrialAccount;
            })
          : [],
      );
    } catch {
      // getTrialAccountsWithActivity failed silently
    } finally {
      setTrialsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchTrials();
    intervalRef.current = setInterval(fetchTrials, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchTrials]);

  // ── Sort + Filter ───────────────────────────────────────────────────────
  const allNiches = ["All", ...Array.from(new Set(trials.map((t) => t.niche)))];

  const filtered = trials
    .filter((t) => nicheFilter === "All" || t.niche === nicheFilter)
    .filter((t) => {
      if (tierFilter === "All") return true;
      const s = Number(t.activityScore);
      if (tierFilter === "Cold") return s <= 30;
      if (tierFilter === "Warm") return s > 30 && s <= 60;
      return s > 60;
    })
    .filter((t) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active")
        return t.status === "active" || Number(t.daysRemaining) > 0;
      return t.status !== "active" || Number(t.daysRemaining) <= 0;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "daysRemaining")
        cmp = Number(a.daysRemaining) - Number(b.daysRemaining);
      else if (sortKey === "lastLogin") {
        const aL = a.lastLoginAt ? Number(a.lastLoginAt) : 0;
        const bL = b.lastLoginAt ? Number(b.lastLoginAt) : 0;
        cmp = aL - bL;
      } else if (sortKey === "activityScore")
        cmp = Number(a.activityScore) - Number(b.activityScore);
      else if (sortKey === "activatedAt")
        cmp = Number(a.activatedAt) - Number(b.activatedAt);
      return sortAsc ? cmp : -cmp;
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  // ── Selection ───────────────────────────────────────────────────────────
  const allSelected =
    filtered.length > 0 &&
    filtered.every((t) => selected.has(t.trialAccountId));
  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function toggleSelectAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map((t) => t.trialAccountId)));
  }

  // ── Send Day5 Reminder ──────────────────────────────────────────────────
  async function sendReminder(trialAccountId: string) {
    if (!actor) return;
    try {
      await actor.sendDay5Reminder(trialAccountId);
      toast.success("Reminder sent!");
      setTrials((prev) =>
        prev.map((t) =>
          t.trialAccountId === trialAccountId
            ? { ...t, day5ReminderSent: true }
            : t,
        ),
      );
    } catch {
      toast.error("Failed to send reminder");
    }
  }

  // ── Bulk Push ───────────────────────────────────────────────────────────
  async function bulkPush() {
    if (!actor || selected.size === 0) return;
    setBulkLoading(true);
    let ok = 0;
    for (const id of selected) {
      try {
        await actor.generateConversionPush(id);
        await actor.sendDay5Reminder(id);
        ok++;
      } catch {
        /* continue */
      }
    }
    toast.success(`Pushed ${ok} / ${selected.size} trials`);
    setBulkLoading(false);
    setSelected(new Set());
    fetchTrials();
  }

  // ── Stats ───────────────────────────────────────────────────────────────
  const activeCount = trials.filter(
    (t) => t.status === "active" || Number(t.daysRemaining) > 0,
  ).length;
  const hotCount = trials.filter((t) => Number(t.activityScore) > 60).length;
  const pendingReminders = trials.filter(
    (t) => Number(t.daysRemaining) <= 2 && !t.day5ReminderSent,
  ).length;

  // ── Legacy Feature Flags ────────────────────────────────────────────────
  const loadFlags = async () => {
    if (!actor || !trialId.trim()) return;
    setLoading(true);
    try {
      const result = await actor.getTrialFeatureFlags(trialId.trim());
      setFlags(result ? (result as FeatureFlags) : defaultFlags);
    } catch (err) {
      setSaveStatus(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const saveFlags = async () => {
    if (!actor || !flags || !trialId.trim()) return;
    setLoading(true);
    setSaveStatus(null);
    try {
      const result = (await actor.updateTrialFeatureFlags(
        trialId.trim(),
        flags,
      )) as { __kind__: string; err?: string };
      setSaveStatus(
        result.__kind__ === "ok"
          ? "Saved successfully!"
          : `Error: ${result.err}`,
      );
    } catch (err) {
      setSaveStatus(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: keyof FeatureFlags) => {
    if (!flags) return;
    setFlags({ ...flags, [key]: !flags[key] });
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Conversion Modal */}
      {conversionTrial && (
        <ConversionModal
          trial={conversionTrial}
          onClose={() => setConversionTrial(null)}
          onSend={sendReminder}
        />
      )}

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              Trial Account Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Monitor, convert, and manage active 7-day trials
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTrialsLoading(true);
              fetchTrials();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm font-medium transition-colors"
            data-ocid="trials.refresh_button"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Active Trials",
              value: activeCount,
              color: "text-blue-400",
              icon: <Clock className="w-4 h-4" />,
            },
            {
              label: "Hot Prospects",
              value: hotCount,
              color: "text-red-400",
              icon: <Flame className="w-4 h-4" />,
            },
            {
              label: "Total Trials",
              value: trials.length,
              color: "text-slate-300",
              icon: <Users className="w-4 h-4" />,
            },
            {
              label: "Reminders Due",
              value: pendingReminders,
              color: "text-amber-400",
              icon: <AlertTriangle className="w-4 h-4" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                {s.icon}
                {s.label}
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Bulk Action */}
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {/* Niche */}
          <select
            value={nicheFilter}
            onChange={(e) => setNicheFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
            data-ocid="trials.niche_filter"
          >
            {allNiches.map((n) => (
              <option key={n} value={n} className="bg-gray-900">
                {n}
              </option>
            ))}
          </select>
          {/* Score Tier */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as ScoreTier)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
            data-ocid="trials.tier_filter"
          >
            {(["All", "Cold", "Warm", "Hot"] as ScoreTier[]).map((t) => (
              <option key={t} value={t} className="bg-gray-900">
                {t}
              </option>
            ))}
          </select>
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50"
            data-ocid="trials.status_filter"
          >
            <option value="all" className="bg-gray-900">
              All Status
            </option>
            <option value="active" className="bg-gray-900">
              Active
            </option>
            <option value="expired" className="bg-gray-900">
              Expired
            </option>
          </select>
          {/* Bulk Push */}
          {selected.size > 0 && (
            <button
              type="button"
              onClick={bulkPush}
              disabled={bulkLoading}
              className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors disabled:opacity-60"
              data-ocid="trials.bulk_push_button"
            >
              {bulkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Push Conversion ({selected.size})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {trialsLoading ? (
            <div
              className="flex items-center justify-center py-20"
              data-ocid="trials.loading_state"
            >
              <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
              <span className="ml-3 text-slate-400">Loading trials…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20"
              data-ocid="trials.empty_state"
            >
              <Users className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-slate-400 font-medium">No trials found</p>
              <p className="text-slate-600 text-sm mt-1">
                Adjust filters or wait for new trial activations
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/3">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-white/20 bg-white/5"
                        data-ocid="trials.select_all"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Niche
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        type="button"
                        onClick={() => toggleSort("activatedAt")}
                        className="flex items-center gap-1 text-xs text-slate-400 font-semibold uppercase tracking-wider hover:text-white transition-colors"
                        data-ocid="trials.sort_activated"
                      >
                        Activated{" "}
                        {sortKey === "activatedAt" ? (sortAsc ? "↑" : "↓") : ""}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        type="button"
                        onClick={() => toggleSort("daysRemaining")}
                        className="flex items-center gap-1 text-xs text-slate-400 font-semibold uppercase tracking-wider hover:text-white transition-colors"
                        data-ocid="trials.sort_days"
                      >
                        Days Left{" "}
                        {sortKey === "daysRemaining"
                          ? sortAsc
                            ? "↑"
                            : "↓"
                          : ""}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        type="button"
                        onClick={() => toggleSort("lastLogin")}
                        className="flex items-center gap-1 text-xs text-slate-400 font-semibold uppercase tracking-wider hover:text-white transition-colors"
                        data-ocid="trials.sort_login"
                      >
                        Last Login{" "}
                        {sortKey === "lastLogin" ? (sortAsc ? "↑" : "↓") : ""}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <button
                        type="button"
                        onClick={() => toggleSort("activityScore")}
                        className="flex items-center gap-1 text-xs text-slate-400 font-semibold uppercase tracking-wider hover:text-white transition-colors"
                        data-ocid="trials.sort_score"
                      >
                        Score{" "}
                        {sortKey === "activityScore"
                          ? sortAsc
                            ? "↑"
                            : "↓"
                          : ""}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Reminder
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((trial, i) => (
                    <TrialRow
                      key={trial.trialAccountId}
                      trial={trial}
                      selected={selected.has(trial.trialAccountId)}
                      onSelect={toggleSelect}
                      onPushConversion={setConversionTrial}
                      index={i}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Legacy Feature Flags — Collapsible */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setLegacyOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
            data-ocid="trials.legacy_flags_toggle"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-300">
                Feature Flag Override
              </span>
              <span className="text-xs text-slate-500">
                Manage per-trial feature access by ID
              </span>
            </div>
            {legacyOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {legacyOpen && (
            <div className="border-t border-white/10 p-5">
              <div className="flex gap-3 mb-5">
                <input
                  type="text"
                  value={trialId}
                  onChange={(e) => setTrialId(e.target.value)}
                  placeholder="Trial Account ID"
                  data-ocid="admin.trial_input"
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={loadFlags}
                  disabled={loading || !trialId.trim()}
                  data-ocid="admin.load_button"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 rounded-lg font-medium text-sm transition-colors"
                >
                  Load
                </button>
              </div>

              {flags && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 max-w-md">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                    Feature Toggles
                  </p>
                  <div className="space-y-3">
                    {(Object.keys(featureLabels) as (keyof FeatureFlags)[]).map(
                      (key) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-300">
                            {featureLabels[key]}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggle(key)}
                            data-ocid={`admin.toggle.${key}`}
                            className={`relative w-12 h-6 rounded-full transition-colors ${flags[key] ? "bg-purple-600" : "bg-gray-700"}`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${flags[key] ? "translate-x-6" : "translate-x-1"}`}
                            />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={saveFlags}
                    disabled={loading}
                    data-ocid="admin.save_button"
                    className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-xl hover:from-purple-500 hover:to-purple-700 transition-all disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  {saveStatus && (
                    <p
                      className={`mt-3 text-sm text-center ${saveStatus.startsWith("Error") ? "text-red-400" : "text-green-400"}`}
                    >
                      {saveStatus}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTrialsPage;
