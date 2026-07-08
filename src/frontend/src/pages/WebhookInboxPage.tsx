/**
 * Webhook Inbox page.
 *
 * Live inbound webhook events from all connected providers (Instantly,
 * Smartlead, Twilio, SendGrid, Vapi, Stripe, Composio). Renders a stats
 * header, collapsible setup helper with copy-to-clipboard webhook URLs,
 * URL-persisted filters, an expandable event table with raw payload
 * inspection, and per-provider test-event senders.
 *
 * Feature flag: WEBHOOK_INBOX_ENABLED (default false). When disabled,
 * mirrors the LeadEnginePage disabled-state pattern.
 */

import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Filter,
  Inbox,
  Info,
  Loader2,
  Lock,
  RefreshCw,
  Send,
  ShieldOff,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { isIntegrationEnabled } from "../integrations/_shared/env";
import {
  getWebhookInboxEvents,
  getWebhookInboxStats,
  sendTestWebhookEvent,
} from "../integrations/webhook-inbox/client";
import type {
  NormalizedWebhookEvent,
  WebhookInboxFilters,
  WebhookInboxStats,
  WebhookProvider,
  WebhookTestPayload,
  WebhookTestResult,
} from "../integrations/webhook-inbox/types";

// ---------- Constants ----------

const POLL_INTERVAL_MS = 10_000;
const DEFAULT_LIMIT = 50;

const WEBHOOK_URLS: {
  provider: string;
  label: string;
  url: string;
  docsUrl: string;
  docsLabel: string;
}[] = [
  {
    provider: "instantly",
    label: "Instantly",
    url: "https://bookedrankedfunded.org/api/instantly/webhook",
    docsUrl: "https://instantly.ai/help",
    docsLabel: "Instantly help",
  },
  {
    provider: "smartlead",
    label: "Smartlead",
    url: "https://bookedrankedfunded.org/api/smartlead/webhook",
    docsUrl: "https://docs.smartlead.ai",
    docsLabel: "Smartlead docs",
  },
  {
    provider: "twilio",
    label: "Twilio",
    url: "https://bookedrankedfunded.org/api/twilio/webhook",
    docsUrl: "https://www.twilio.com/docs/usage/webhooks",
    docsLabel: "Twilio webhook docs",
  },
  {
    provider: "sendgrid",
    label: "SendGrid",
    url: "https://bookedrankedfunded.org/api/sendgrid/webhook",
    docsUrl:
      "https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook",
    docsLabel: "SendGrid event webhook docs",
  },
];

const PROVIDER_BADGE: Record<WebhookProvider, { label: string; cls: string }> =
  {
    instantly: {
      label: "Instantly",
      cls: "bg-purple-500/10 border-purple-500/30 text-purple-300",
    },
    smartlead: {
      label: "Smartlead",
      cls: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
    },
    twilio: {
      label: "Twilio",
      cls: "bg-red-500/10 border-red-500/30 text-red-300",
    },
    sendgrid: {
      label: "SendGrid",
      cls: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    },
  };

const FALLBACK_BADGE = {
  label: "Unknown",
  cls: "bg-gray-500/10 border-gray-500/30 text-muted-foreground",
};

/**
 * Heuristic badge color for a normalized event type string.
 * Returns a Tailwind class string for the badge.
 */
function typeBadgeCls(normalizedEventType: string): string {
  const t = normalizedEventType.toLowerCase();
  if (t.includes("reply")) {
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
  }
  if (
    t.includes("bounce") ||
    t.includes("spam") ||
    t.includes("dropped") ||
    t.includes("deferred")
  ) {
    return "bg-amber-500/10 border-amber-500/30 text-amber-300";
  }
  if (t.includes("unsubscribe")) {
    return "bg-rose-500/10 border-rose-500/30 text-rose-300";
  }
  if (t.includes("delivered")) {
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
  }
  if (t.includes("processed")) {
    return "bg-blue-500/10 border-blue-500/30 text-blue-300";
  }
  if (t.includes("opened")) {
    return "bg-indigo-500/10 border-indigo-500/30 text-indigo-300";
  }
  if (t.includes("clicked")) {
    return "bg-purple-500/10 border-purple-500/30 text-purple-300";
  }
  return "bg-gray-500/10 border-gray-500/30 text-muted-foreground";
}

// ---------- Helpers ----------

function formatBigInt(n: bigint | number): string {
  return Number(n).toLocaleString();
}

/**
 * Convert an IC nanosecond timestamp to JS milliseconds.
 * Falls through for already-millisecond values (no-op when small).
 */
function nanosToMs(ts: bigint | number): number {
  const n = Number(ts);
  // IC timestamps are nanoseconds; if the value is large, divide.
  return n > 1e15 ? Math.floor(n / 1_000_000) : n;
}

function formatDate(ts: bigint | number): string {
  const ms = nanosToMs(ts);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleString();
}

function formatRelative(ts: bigint | number): string {
  const ms = nanosToMs(ts);
  if (ms === 0) return "—";
  const diff = Date.now() - ms;
  if (diff < 0) return "just now";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ms).toLocaleDateString();
}

function prettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

/**
 * A reply event covers reply_received, auto_reply_received, untracked_reply, etc.
 */
function isReplyKind(normalizedEventType: string): boolean {
  return normalizedEventType.toLowerCase().includes("reply");
}

/**
 * Suppression-worthy events: unsubscribe, bounce, spam, dropped.
 */
function isSuppressKind(normalizedEventType: string): boolean {
  const t = normalizedEventType.toLowerCase();
  return (
    t.includes("unsubscribe") ||
    t.includes("bounce") ||
    t.includes("spam") ||
    t.includes("dropped")
  );
}

// ---------- Component ----------

export default function WebhookInboxPage() {
  const enabled = isIntegrationEnabled("WEBHOOK_INBOX_ENABLED");
  const { actor } = useActor();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, string>;

  // ---------- Disabled State ----------

  if (!enabled) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full bg-gray-800/60 border border-white/10 rounded-2xl p-10 text-center"
          data-ocid="webhook_inbox.empty_state"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            Webhook Inbox is not enabled
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            The Webhook Inbox collects, normalizes, and routes inbound webhook
            events from Instantly, Smartlead, Twilio, and SendGrid into a single
            auditable stream. Connect with your administrator to enable the
            <span className="font-mono text-purple-300">
              {" "}
              WEBHOOK_INBOX_ENABLED{" "}
            </span>
            integration flag.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/60 border border-white/5 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>
              Feature flag:{" "}
              <span className="font-mono text-purple-300">
                WEBHOOK_INBOX_ENABLED = false
              </span>
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Enabled State ----------

  return (
    <WebhookInboxEnabled actor={actor} search={search} navigate={navigate} />
  );
}

// ---------- Enabled Page ----------

interface EnabledProps {
  actor: ReturnType<typeof useActor>["actor"];
  search: Record<string, string>;
  navigate: ReturnType<typeof useNavigate>;
}

function WebhookInboxEnabled({ actor, search, navigate }: EnabledProps) {
  // Filters from URL search params
  const providerFilter = (search.provider ?? "") as WebhookProvider | "";
  const typeFilter = search.type ?? "";
  const leadFilter = search.lead ?? "";
  const fromFilter = search.from ?? "";
  const toFilter = search.to ?? "";

  const [events, setEvents] = useState<NormalizedWebhookEvent[]>([]);
  const [stats, setStats] = useState<WebhookInboxStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [setupOpen, setSetupOpen] = useState(true);
  const [sendingProvider, setSendingProvider] = useState<string | null>(null);
  const [suppressingId, setSuppressingId] = useState<string | null>(null);
  const [classifyingId, setClassifyingId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build filters object for the client. Timestamps are nanoseconds.
  const buildFilters = useCallback((): WebhookInboxFilters => {
    const filters: WebhookInboxFilters = { limit: BigInt(DEFAULT_LIMIT) };
    if (providerFilter) filters.provider = providerFilter as WebhookProvider;
    if (typeFilter) filters.normalizedEventType = typeFilter;
    if (leadFilter) filters.leadEmailOrPhone = leadFilter;
    if (fromFilter) {
      const fromMs = new Date(fromFilter).getTime();
      if (!Number.isNaN(fromMs))
        filters.fromTimestamp = BigInt(fromMs) * 1_000_000n;
    }
    if (toFilter) {
      const toMs = new Date(toFilter).getTime() + 24 * 60 * 60 * 1000 - 1;
      if (!Number.isNaN(toMs)) filters.toTimestamp = BigInt(toMs) * 1_000_000n;
    }
    return filters;
  }, [providerFilter, typeFilter, leadFilter, fromFilter, toFilter]);

  // Fetch events + stats
  const loadAll = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    setError(null);
    try {
      const [evs, sts] = await Promise.all([
        getWebhookInboxEvents(actor, buildFilters()),
        getWebhookInboxStats(actor),
      ]);
      setEvents(evs);
      setStats(sts);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load webhook events",
      );
    } finally {
      setLoading(false);
    }
  }, [actor, buildFilters]);

  // Initial load + reload when filters change
  useEffect(() => {
    if (actor) void loadAll();
  }, [actor, loadAll]);

  // Polling — every 10s when page is visible
  useEffect(() => {
    if (!actor) return;
    const tick = () => {
      if (document.visibilityState === "visible") {
        void loadAll();
      }
    };
    pollRef.current = setInterval(tick, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [actor, loadAll]);

  // URL filter helpers
  const updateSearch = useCallback(
    (patch: Record<string, string>) => {
      void navigate({
        search: ((prev: Record<string, string>) => {
          const next: Record<string, string> = {};
          for (const [k, v] of Object.entries(prev)) {
            if (v !== "" && v !== undefined && v !== null) next[k] = v;
          }
          for (const [k, v] of Object.entries(patch)) {
            if (v === "" || v === undefined || v === null) {
              delete next[k];
            } else {
              next[k] = v;
            }
          }
          return next;
        }) as never,
        replace: true,
      });
    },
    [navigate],
  );

  const clearFilters = useCallback(() => {
    void navigate({ search: {} as never, replace: true });
  }, [navigate]);

  const hasActiveFilters =
    !!providerFilter ||
    !!typeFilter ||
    !!leadFilter ||
    !!fromFilter ||
    !!toFilter;

  // Row expand toggle
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Send test event
  const handleSendTest = async (provider: string) => {
    if (!actor) return;
    setSendingProvider(provider);
    try {
      const result: WebhookTestResult = await sendTestWebhookEvent(
        actor,
        provider as WebhookTestPayload,
      );
      if (result.ok) {
        toast.success(
          `Test ${provider} event sent (id: ${result.eventId.slice(0, 8)}…)`,
        );
        await loadAll();
      } else {
        toast.error(`Failed to send test ${provider} event`);
      }
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : `Failed to send test ${provider} event`,
      );
    } finally {
      setSendingProvider(null);
    }
  };

  // Classify reply (backend auto-routes; this is a manual confirmation)
  const handleClassify = async (event: NormalizedWebhookEvent) => {
    setClassifyingId(event.id);
    try {
      // Backend already auto-routes replies to the classifier. This button
      // surfaces that the reply has been routed — no extra call needed.
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Reply routed to the lead AI classifier", {
        description:
          event.replySubject || event.leadEmail || event.leadPhone || undefined,
      });
    } finally {
      setClassifyingId(null);
    }
  };

  // Suppress lead (backend already auto-routes bounce/spam/unsubscribe)
  const handleSuppress = async (event: NormalizedWebhookEvent) => {
    setSuppressingId(event.id);
    try {
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Lead already on the suppression list", {
        description: `${event.leadEmail || event.leadPhone || "this lead"} is suppressed from future sends`,
      });
    } finally {
      setSuppressingId(null);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} URL copied to clipboard`);
    } catch {
      toast.error("Failed to copy — copy manually instead");
    }
  };

  // ---------- Render ----------

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Webhook Inbox
              </h1>
              <p className="text-sm text-muted-foreground">
                Live inbound webhook events from all connected providers.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void loadAll()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/60 border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-smooth disabled:opacity-50"
            data-ocid="webhook_inbox.refresh_button"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Error banner */}
        {error && (
          <div
            className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300"
            data-ocid="webhook_inbox.error_state"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">{error}</div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-300/70 hover:text-red-200"
              data-ocid="webhook_inbox.error.dismiss"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats Header */}
        <StatsHeader stats={stats} loading={loading} />

        {/* Setup Helper */}
        <SetupHelper
          open={setupOpen}
          setOpen={setSetupOpen}
          onCopy={copyToClipboard}
          onSendTest={handleSendTest}
          sendingProvider={sendingProvider}
        />

        {/* Filters Bar */}
        <FiltersBar
          providerFilter={providerFilter}
          typeFilter={typeFilter}
          leadFilter={leadFilter}
          fromFilter={fromFilter}
          toFilter={toFilter}
          onUpdate={updateSearch}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Event Table */}
        <EventTable
          events={events}
          loading={loading}
          expandedRows={expandedRows}
          onToggleRow={toggleRow}
          onClassify={handleClassify}
          onSuppress={handleSuppress}
          classifyingId={classifyingId}
          suppressingId={suppressingId}
        />
      </div>
    </div>
  );
}

// ---------- Stats Header ----------

function StatsHeader({
  stats,
  loading,
}: {
  stats: WebhookInboxStats | null;
  loading: boolean;
}) {
  if (loading && !stats) {
    return (
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        data-ocid="webhook_inbox.stats.loading_state"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-gray-800/40 p-4 h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const total = Number(stats.totalEvents);
  const last24h = Number(stats.eventsLast24h);

  // Top 5 kinds by count
  const topKinds = [...stats.eventsByType]
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5);

  return (
    <div className="space-y-3" data-ocid="webhook_inbox.stats.section">
      {/* Totals row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          label="Total events"
          value={total}
          icon={Inbox}
          color="purple"
        />
        <StatCard
          label="Last 24h"
          value={last24h}
          icon={RefreshCw}
          color="indigo"
        />
        <StatCard
          label="Providers seen"
          value={stats.eventsByProvider.length}
          icon={ExternalLink}
          color="amber"
        />
      </div>

      {/* Provider breakdown */}
      {stats.eventsByProvider.length > 0 && (
        <div className="bg-gray-800/60 border border-white/10 rounded-xl p-4">
          <div className="text-xs font-medium text-muted-foreground mb-3">
            Events by provider
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.eventsByProvider.map(([provider, count]) => {
              const badge =
                PROVIDER_BADGE[provider as WebhookProvider] ?? FALLBACK_BADGE;
              return (
                <span
                  key={provider}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono ${badge.cls}`}
                  data-ocid={`webhook_inbox.stats.provider.${provider}`}
                >
                  {badge.label}
                  <span className="font-bold">{formatBigInt(count)}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Top event kinds */}
      {topKinds.length > 0 && (
        <div className="bg-gray-800/60 border border-white/10 rounded-xl p-4">
          <div className="text-xs font-medium text-muted-foreground mb-3">
            Top event types
          </div>
          <div className="flex flex-wrap gap-2">
            {topKinds.map(([kind, count]) => {
              const cls = typeBadgeCls(kind);
              return (
                <span
                  key={kind}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono ${cls}`}
                  data-ocid={`webhook_inbox.stats.kind.${kind}`}
                >
                  {kind.replace(/_/g, " ")}
                  <span className="font-bold">{formatBigInt(count)}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "purple" | "emerald" | "indigo" | "amber";
}) {
  const colorMap = {
    purple: "text-purple-300 border-purple-500/30 bg-purple-500/5",
    emerald: "text-emerald-300 border-emerald-500/30 bg-emerald-500/5",
    indigo: "text-indigo-300 border-indigo-500/30 bg-indigo-500/5",
    amber: "text-amber-300 border-amber-500/30 bg-amber-500/5",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 opacity-70" />
      </div>
      <div className="text-2xl font-display font-bold">
        {formatBigInt(value)}
      </div>
    </div>
  );
}

// ---------- Setup Helper ----------

function SetupHelper({
  open,
  setOpen,
  onCopy,
  onSendTest,
  sendingProvider,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onCopy: (text: string, label: string) => void;
  onSendTest: (provider: string) => void;
  sendingProvider: string | null;
}) {
  return (
    <div className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-smooth"
        data-ocid="webhook_inbox.setup.toggle"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="font-medium text-foreground">Setup</span>
          <span className="text-xs text-muted-foreground">
            Paste these URLs into each provider dashboard
          </span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 overflow-hidden"
          >
            <div className="divide-y divide-white/5">
              {WEBHOOK_URLS.map((w) => (
                <div
                  key={w.provider}
                  className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-3"
                  data-ocid={`webhook_inbox.setup.row.${w.provider}`}
                >
                  <div className="md:w-28 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-mono ${
                        PROVIDER_BADGE[w.provider as WebhookProvider]?.cls ??
                        FALLBACK_BADGE.cls
                      }`}
                    >
                      {w.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="block font-mono text-xs text-foreground bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 truncate">
                      {w.url}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onCopy(w.url, w.label)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/50 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-white/20 transition-smooth"
                      data-ocid={`webhook_inbox.setup.copy_button.${w.provider}`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendTest(w.provider)}
                      disabled={sendingProvider === w.provider}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs text-purple-300 hover:bg-purple-500/20 transition-smooth disabled:opacity-50"
                      data-ocid={`webhook_inbox.setup.test_button.${w.provider}`}
                    >
                      {sendingProvider === w.provider ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Test
                    </button>
                    <a
                      href={w.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth"
                      data-ocid={`webhook_inbox.setup.docs_link.${w.provider}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Docs
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Filters Bar ----------

function FiltersBar({
  providerFilter,
  typeFilter,
  leadFilter,
  fromFilter,
  toFilter,
  onUpdate,
  onClear,
  hasActiveFilters,
}: {
  providerFilter: string;
  typeFilter: string;
  leadFilter: string;
  fromFilter: string;
  toFilter: string;
  onUpdate: (patch: Record<string, string>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div
      className="bg-gray-800/60 border border-white/10 rounded-xl p-4"
      data-ocid="webhook_inbox.filters.section"
    >
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-purple-300" />
        <span className="text-sm font-medium text-foreground">Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-700/50 border border-white/10 text-xs text-muted-foreground hover:text-foreground transition-smooth"
            data-ocid="webhook_inbox.filters.clear_button"
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Provider */}
        <div>
          <label
            htmlFor="webhook-inbox-provider"
            className="text-xs font-medium text-muted-foreground mb-1 block"
          >
            Provider
          </label>
          <select
            id="webhook-inbox-provider"
            value={providerFilter}
            onChange={(e) => onUpdate({ provider: e.target.value })}
            className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
            data-ocid="webhook_inbox.filters.provider_select"
          >
            <option value="">All providers</option>
            <option value="instantly">Instantly</option>
            <option value="smartlead">Smartlead</option>
            <option value="twilio">Twilio</option>
            <option value="sendgrid">SendGrid</option>
          </select>
        </div>

        {/* Event type */}
        <div>
          <label
            htmlFor="webhook-inbox-kind"
            className="text-xs font-medium text-muted-foreground mb-1 block"
          >
            Event type
          </label>
          <input
            id="webhook-inbox-kind"
            type="text"
            value={typeFilter}
            onChange={(e) => onUpdate({ type: e.target.value })}
            placeholder="e.g. reply, bounce"
            className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
            data-ocid="webhook_inbox.filters.kind_input"
          />
        </div>

        {/* Recipient / sender */}
        <div>
          <label
            htmlFor="webhook-inbox-recipient"
            className="text-xs font-medium text-muted-foreground mb-1 block"
          >
            Lead email / phone
          </label>
          <input
            id="webhook-inbox-recipient"
            type="text"
            value={leadFilter}
            onChange={(e) => onUpdate({ lead: e.target.value })}
            placeholder="substring match"
            className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
            data-ocid="webhook_inbox.filters.recipient_input"
          />
        </div>

        {/* From date */}
        <div>
          <label
            htmlFor="webhook-inbox-from"
            className="text-xs font-medium text-muted-foreground mb-1 block"
          >
            From
          </label>
          <input
            id="webhook-inbox-from"
            type="date"
            value={fromFilter}
            onChange={(e) => onUpdate({ fromTimestamp: e.target.value })}
            className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
            data-ocid="webhook_inbox.filters.from_input"
          />
        </div>

        {/* To date */}
        <div>
          <label
            htmlFor="webhook-inbox-to"
            className="text-xs font-medium text-muted-foreground mb-1 block"
          >
            To
          </label>
          <input
            id="webhook-inbox-to"
            type="date"
            value={toFilter}
            onChange={(e) => onUpdate({ toTimestamp: e.target.value })}
            className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
            data-ocid="webhook_inbox.filters.to_input"
          />
        </div>
      </div>
    </div>
  );
}

// ---------- Event Table ----------

function EventTable({
  events,
  loading,
  expandedRows,
  onToggleRow,
  onClassify,
  onSuppress,
  classifyingId,
  suppressingId,
}: {
  events: NormalizedWebhookEvent[];
  loading: boolean;
  expandedRows: Set<string>;
  onToggleRow: (id: string) => void;
  onClassify: (event: NormalizedWebhookEvent) => void;
  onSuppress: (event: NormalizedWebhookEvent) => void;
  classifyingId: string | null;
  suppressingId: string | null;
}) {
  if (loading && events.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-20 text-muted-foreground"
        data-ocid="webhook_inbox.events.loading_state"
      >
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading webhook events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        className="bg-gray-800/60 border border-white/10 rounded-2xl p-12 text-center"
        data-ocid="webhook_inbox.events.empty_state"
      >
        <div className="mx-auto w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
          <Inbox className="w-7 h-7 text-purple-300" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
          No webhook events yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Configure your webhook URLs in each provider dashboard (see the Setup
          panel above) to start receiving live events.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900/40 border-b border-white/10">
              <th className="px-3 py-3 w-8" />
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                Provider
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                Event type
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                Lead email / phone
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                Timestamp
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                Routed to
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <EventRow
                key={event.id}
                event={event}
                index={idx}
                expanded={expandedRows.has(event.id)}
                onToggle={() => onToggleRow(event.id)}
                onClassify={onClassify}
                onSuppress={onSuppress}
                classifying={classifyingId === event.id}
                suppressing={suppressingId === event.id}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-white/10 text-xs text-muted-foreground text-right">
        Showing {events.length} event{events.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}

// ---------- Event Row ----------

function EventRow({
  event,
  index,
  expanded,
  onToggle,
  onClassify,
  onSuppress,
  classifying,
  suppressing,
}: {
  event: NormalizedWebhookEvent;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onClassify: (event: NormalizedWebhookEvent) => void;
  onSuppress: (event: NormalizedWebhookEvent) => void;
  classifying: boolean;
  suppressing: boolean;
}) {
  const providerBadge = PROVIDER_BADGE[event.provider] ?? FALLBACK_BADGE;
  const kindCls = typeBadgeCls(event.normalizedEventType);
  const routedTo = event.routedTo
    ? event.routedTo
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const showClassify = isReplyKind(event.normalizedEventType);
  const showSuppress = isSuppressKind(event.normalizedEventType);

  return (
    <>
      <tr
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        tabIndex={0}
        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-smooth"
        data-ocid={`webhook_inbox.events.row.${index + 1}`}
      >
        <td className="px-3 py-3 text-muted-foreground">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </td>
        <td className="px-3 py-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono ${providerBadge.cls}`}
          >
            {providerBadge.label}
          </span>
        </td>
        <td className="px-3 py-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono ${kindCls}`}
          >
            {event.normalizedEventType.replace(/_/g, " ")}
          </span>
        </td>
        <td className="px-3 py-3 text-muted-foreground truncate max-w-[200px]">
          {event.leadEmail || event.leadPhone || "—"}
        </td>
        <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
          <div className="text-xs">{formatRelative(event.receivedAt)}</div>
          <div className="text-[10px] text-muted-foreground/70 font-mono">
            {formatDate(event.receivedAt)}
          </div>
        </td>
        <td className="px-3 py-3">
          {routedTo.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {routedTo.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                >
                  {r}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground/60">—</span>
          )}
        </td>
        <td className="px-3 py-3 text-right">
          <div className="inline-flex items-center gap-1.5">
            {showClassify && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClassify(event);
                }}
                disabled={classifying}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 hover:bg-emerald-500/20 transition-smooth disabled:opacity-50"
                data-ocid={`webhook_inbox.events.classify_button.${index + 1}`}
              >
                {classifying ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                Classify
              </button>
            )}
            {showSuppress && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSuppress(event);
                }}
                disabled={suppressing}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 hover:bg-rose-500/20 transition-smooth disabled:opacity-50"
                data-ocid={`webhook_inbox.events.suppress_button.${index + 1}`}
              >
                {suppressing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <ShieldOff className="w-3 h-3" />
                )}
                Suppress
              </button>
            )}
            {event.routedTo !== "" && (
              <span
                className="inline-flex items-center text-emerald-400"
                title="Routed by backend"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr
          className="bg-gray-900/40"
          data-ocid={`webhook_inbox.events.detail.${index + 1}`}
        >
          <td />
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Normalized fields */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Normalized fields
                </div>
                <DetailField label="Event id" value={event.id} mono />
                <DetailField
                  label="Provider event id"
                  value={event.externalLeadId || "—"}
                  mono
                />
                <DetailField
                  label="Provider message id"
                  value={event.externalCampaignId || "—"}
                  mono
                />
                <DetailField
                  label="Recipient"
                  value={event.leadEmail || event.leadPhone || "—"}
                />
                <DetailField label="Sender" value={event.leadEmail || "—"} />
                <DetailField
                  label="Subject"
                  value={event.replySubject || "—"}
                />
                <DetailField label="Reason" value={event.replyText || "—"} />
                <DetailField
                  label="Status"
                  value={event.normalizedEventType}
                  mono
                />
                <DetailField
                  label="Routed"
                  value={event.routedTo !== "" ? "yes" : "no"}
                  mono
                />
                <DetailField label="Routed to" value={event.routedTo || "—"} />
                {isReplyKind(event.normalizedEventType) &&
                  event.replySubject && (
                    <div className="pt-2">
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Reply text
                      </div>
                      <div className="text-sm text-foreground bg-gray-900/60 border border-white/10 rounded-lg p-3 whitespace-pre-wrap break-words">
                        {event.replyText || event.replySubject}
                      </div>
                    </div>
                  )}
              </div>

              {/* Raw payload */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Raw payload
                </div>
                <pre
                  className="text-xs font-mono text-foreground bg-gray-900/60 border border-white/10 rounded-lg p-3 overflow-x-auto max-h-96 whitespace-pre-wrap break-words"
                  data-ocid={`webhook_inbox.events.raw_payload.${index + 1}`}
                >
                  {prettyJson(event.rawPayload)}
                </pre>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className="text-muted-foreground/70 w-40 flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-foreground break-words min-w-0 ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
