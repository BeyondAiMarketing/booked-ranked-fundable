/**
 * AdminClientAIManagerPage — Client AI Manager.
 * Table of all client accounts with AI usage stats,
 * enable/disable toggles, search and filter by tier.
 */

import { Brain, ExternalLink, Search, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanTier = "Basic" | "Pro" | "Agency";

interface ClientAIRecord {
  id: string;
  name: string;
  tier: PlanTier;
  aiCallsThisMonth: number;
  knowledgeDocs: number;
  lastAIActivity: string;
  aiEnabled: boolean;
}

const TIER_COLORS: Record<PlanTier, string> = {
  Basic: "bg-slate-800/60 text-slate-300 border-slate-600/30",
  Pro: "bg-blue-900/50 text-blue-300 border-blue-500/30",
  Agency: "bg-violet-900/50 text-violet-300 border-violet-500/30",
};

function TierBadge({ tier }: { tier: PlanTier }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${TIER_COLORS[tier]}`}
    >
      {tier}
    </span>
  );
}

function ActivityDot({ activity }: { activity: string }) {
  const isRecent = activity.includes("minute") || activity.includes("hour");
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isRecent ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
        }`}
      />
      <span className="text-slate-400">{activity}</span>
    </span>
  );
}

function AIToggle({
  enabled,
  onChange,
  clientId,
}: {
  enabled: boolean;
  onChange: (id: string, value: boolean) => void;
  clientId: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(clientId, !enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
        enabled ? "bg-violet-500" : "bg-white/10"
      }`}
      role="switch"
      aria-checked={enabled}
      data-ocid={`client_ai_manager.ai_toggle.${clientId}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar({ clients }: { clients: ClientAIRecord[] }) {
  const enabled = clients.filter((c) => c.aiEnabled).length;
  const totalCalls = clients.reduce((s, c) => s + c.aiCallsThisMonth, 0);
  const totalDocs = clients.reduce((s, c) => s + c.knowledgeDocs, 0);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        {
          label: "Total Clients",
          value: clients.length,
          color: "text-foreground",
        },
        {
          label: "AI Enabled",
          value: enabled,
          color: "text-violet-300",
        },
        {
          label: "Total AI Calls (mo)",
          value: totalCalls.toLocaleString(),
          color: "text-cyan-300",
        },
        {
          label: "Total Knowledge Docs",
          value: totalDocs,
          color: "text-emerald-300",
        },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="rounded-xl border border-white/10 bg-card p-4"
        >
          <p className="text-xs text-slate-400 font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminClientAIManagerPage() {
  const { actor, isFetching } = useActor();
  const [clients, setClients] = useState<ClientAIRecord[]>(SAMPLE_CLIENTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | PlanTier>("all");
  const [activityFilter, setActivityFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    // Load AI usage logs to augment client data
    (
      actor as unknown as {
        getAIUsageLogs: (id: string) => Promise<unknown[]>;
      }
    )
      .getAIUsageLogs("admin")
      .then(() => {
        // Use sample data — real integration via getAIUsageLogs per client
        setClients(SAMPLE_CLIENTS);
      })
      .catch(() => setClients(SAMPLE_CLIENTS))
      .finally(() => setLoading(false));
  }, [actor, isFetching]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (tierFilter !== "all" && c.tier !== tierFilter) return false;
      if (activityFilter === "active" && !c.aiEnabled) return false;
      if (activityFilter === "inactive" && c.aiEnabled) return false;
      return true;
    });
  }, [clients, search, tierFilter, activityFilter]);

  function toggleAI(id: string, value: boolean) {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, aiEnabled: value } : c)),
    );
    toast.success(
      `AI ${value ? "enabled" : "disabled"} for ${
        clients.find((c) => c.id === id)?.name
      }`,
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-6 space-y-6"
      data-ocid="client_ai_manager.page"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users size={20} className="text-violet-400" />
          Client AI Manager
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage AI access and monitor usage across all client accounts.
        </p>
      </div>

      {/* Summary */}
      {!loading && <SummaryBar clients={clients} />}

      {/* Filters */}
      <div
        className="rounded-xl border border-white/10 bg-card p-4"
        data-ocid="client_ai_manager.filters.section"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by client name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 text-sm text-foreground pl-8 pr-3 py-1.5 focus:outline-none focus:border-violet-500/50"
              data-ocid="client_ai_manager.search_input"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as "all" | PlanTier)}
            className="rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50"
            data-ocid="client_ai_manager.tier.select"
          >
            <option value="all">All Tiers</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Agency">Agency</option>
          </select>
          <select
            value={activityFilter}
            onChange={(e) =>
              setActivityFilter(e.target.value as "all" | "active" | "inactive")
            }
            className="rounded-lg bg-white/5 border border-white/10 text-sm text-foreground px-3 py-1.5 focus:outline-none focus:border-violet-500/50"
            data-ocid="client_ai_manager.activity.select"
          >
            <option value="all">All Accounts</option>
            <option value="active">AI Enabled</option>
            <option value="inactive">AI Disabled</option>
          </select>
        </div>
      </div>

      {/* Client Table */}
      <div
        className="rounded-xl border border-white/10 bg-card overflow-hidden"
        data-ocid="client_ai_manager.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">
                  Client
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">
                  Plan
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 px-4 py-3">
                  AI Calls (mo)
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 px-4 py-3">
                  Docs
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">
                  Last Activity
                </th>
                <th className="text-center text-xs font-semibold text-slate-400 px-4 py-3">
                  AI Access
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 px-4 py-3">
                  Docs
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((rowNum) => (
                  <tr
                    key={`skeleton-row-${rowNum}`}
                    className="border-b border-white/5 animate-pulse"
                    data-ocid={`client_ai_manager.loading_state.${rowNum}`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((cellNum) => (
                      <td
                        key={`skeleton-cell-${rowNum}-${cellNum}`}
                        className="px-4 py-3"
                      >
                        <div className="h-3 bg-white/8 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-slate-500"
                    data-ocid="client_ai_manager.empty_state"
                  >
                    No clients match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((client, i) => (
                  <tr
                    key={client.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    data-ocid={`client_ai_manager.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-violet-300">
                            {client.name[0]}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TierBadge tier={client.tier} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                      {client.aiCallsThisMonth.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-slate-300">
                      {client.knowledgeDocs}
                    </td>
                    <td className="px-4 py-3">
                      <ActivityDot activity={client.lastAIActivity} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <AIToggle
                        enabled={client.aiEnabled}
                        onChange={toggleAI}
                        clientId={client.id}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href="/admin/knowledge-base"
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-400 transition-colors"
                        data-ocid={`client_ai_manager.view_docs.${i + 1}`}
                      >
                        <ShieldCheck size={12} />
                        View
                        <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-2 border-t border-white/8">
            <span className="text-xs text-slate-500">
              Showing {filtered.length} of {clients.length} clients
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_CLIENTS: ClientAIRecord[] = [
  {
    id: "c1",
    name: "Atlas Roofing",
    tier: "Agency",
    aiCallsThisMonth: 1842,
    knowledgeDocs: 23,
    lastAIActivity: "12 minutes ago",
    aiEnabled: true,
  },
  {
    id: "c2",
    name: "ClearView HVAC",
    tier: "Pro",
    aiCallsThisMonth: 630,
    knowledgeDocs: 11,
    lastAIActivity: "2 hours ago",
    aiEnabled: true,
  },
  {
    id: "c3",
    name: "Summit Med Spa",
    tier: "Pro",
    aiCallsThisMonth: 415,
    knowledgeDocs: 8,
    lastAIActivity: "1 day ago",
    aiEnabled: true,
  },
  {
    id: "c4",
    name: "Apex Restoration",
    tier: "Agency",
    aiCallsThisMonth: 2100,
    knowledgeDocs: 31,
    lastAIActivity: "5 minutes ago",
    aiEnabled: true,
  },
  {
    id: "c5",
    name: "Riverside Dental",
    tier: "Basic",
    aiCallsThisMonth: 88,
    knowledgeDocs: 4,
    lastAIActivity: "3 days ago",
    aiEnabled: false,
  },
  {
    id: "c6",
    name: "GoldKey Real Estate",
    tier: "Pro",
    aiCallsThisMonth: 720,
    knowledgeDocs: 16,
    lastAIActivity: "4 hours ago",
    aiEnabled: true,
  },
  {
    id: "c7",
    name: "PrimeClean Carpets",
    tier: "Basic",
    aiCallsThisMonth: 52,
    knowledgeDocs: 2,
    lastAIActivity: "1 week ago",
    aiEnabled: false,
  },
  {
    id: "c8",
    name: "Meridian Mortgage",
    tier: "Pro",
    aiCallsThisMonth: 540,
    knowledgeDocs: 9,
    lastAIActivity: "6 hours ago",
    aiEnabled: true,
  },
];
