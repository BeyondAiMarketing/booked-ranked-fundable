import {
  ArrowDown,
  ArrowUpDown,
  Award,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Filter,
  Mail,
  Megaphone,
  Mic,
  MousePointer,
  Search,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useApp } from "../context/AppContext";
import {
  DEMO_CHANNEL_STATS,
  DEMO_FUNNEL_STAGES,
} from "../data/attributionData";
import type {
  AttributionChannel,
  AttributionModel,
  LeadAttributionRecord,
} from "../types/attribution";

// ─── Channel Config ────────────────────────────────────────────────────────────
type ChannelCfg = {
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  icon: React.ElementType;
};

const CHANNEL_CFG: Record<AttributionChannel, ChannelCfg> = {
  cold_email: {
    label: "Cold Email",
    color: "#6366f1",
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
    text: "text-purple-300",
    icon: Mail,
  },
  voice_agent: {
    label: "Voice Agent",
    color: "#10b981",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    text: "text-emerald-300",
    icon: Mic,
  },
  demo: {
    label: "Demo",
    color: "#06b6d4",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    text: "text-cyan-300",
    icon: MousePointer,
  },
  audit: {
    label: "Free Audit",
    color: "#f59e0b",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    text: "text-amber-300",
    icon: Search,
  },
  organic: {
    label: "Organic",
    color: "#f59e0b",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    text: "text-amber-300",
    icon: TrendingUp,
  },
  referral: {
    label: "Referral",
    color: "#f43f5e",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    text: "text-rose-300",
    icon: Users,
  },
  social: {
    label: "Social",
    color: "#8b5cf6",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    text: "text-violet-300",
    icon: Star,
  },
  paid_ads: {
    label: "Paid Ads",
    color: "#3b82f6",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    text: "text-blue-300",
    icon: Megaphone,
  },
  sms: {
    label: "SMS",
    color: "#06b6d4",
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/30",
    text: "text-cyan-300",
    icon: Zap,
  },
  direct: {
    label: "Direct",
    color: "#64748b",
    bg: "bg-slate-500/15",
    border: "border-slate-500/30",
    text: "text-slate-300",
    icon: Target,
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function ChannelBadge({ channel }: { channel: AttributionChannel }) {
  const cfg = CHANNEL_CFG[channel] ?? CHANNEL_CFG.direct;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${cfg.bg} ${cfg.border} ${cfg.text} whitespace-nowrap`}
    >
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

function PathBadges({ channels }: { channels: AttributionChannel[] }) {
  const counts: Partial<Record<AttributionChannel, number>> = {};
  return (
    <div className="flex flex-wrap items-center gap-1">
      {channels.map((ch, i) => {
        counts[ch] = (counts[ch] ?? 0) + 1;
        const uid = `${ch}-${counts[ch]}`;
        return (
          <span key={uid} className="flex items-center gap-1">
            <ChannelBadge channel={ch} />
            {i < channels.length - 1 && (
              <span className="text-muted-foreground text-[10px]">→</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ─── Section 1 — Model Selector ────────────────────────────────────────────────
const MODELS: { id: AttributionModel; label: string; desc: string }[] = [
  {
    id: "first_touch",
    label: "First Touch",
    desc: "100% credit to the first channel that touched the lead",
  },
  {
    id: "last_touch",
    label: "Last Touch",
    desc: "100% credit to the final channel before conversion",
  },
  {
    id: "linear",
    label: "Linear",
    desc: "Equal credit distributed across all touchpoints",
  },
  {
    id: "time_decay",
    label: "Time Decay",
    desc: "Recent touchpoints receive proportionally more credit",
  },
];

const DATE_RANGES = [
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
  { id: "custom", label: "All" },
] as const;
type DateRange = (typeof DATE_RANGES)[number]["id"];

// ─── Section 2 — Overview Stats ────────────────────────────────────────────────
function OverviewStats({
  records,
  model,
}: {
  records: LeadAttributionRecord[];
  model: AttributionModel;
}) {
  const totalRevenue = records.reduce((s, r) => s + r.closedDealValue, 0);
  const avgTouches =
    records.length > 0
      ? (
          records.reduce((s, r) => s + r.touchCount, 0) / records.length
        ).toFixed(1)
      : "0";
  const bookedCount = records.filter((r) => r.bookingId).length;
  const convRate =
    records.length > 0
      ? ((bookedCount / records.length) * 100).toFixed(0)
      : "0";

  const relevantKey =
    model === "first_touch"
      ? "firstTouchLeads"
      : model === "last_touch"
        ? "lastTouchLeads"
        : "touchCount";

  const statsCopy = [...DEMO_CHANNEL_STATS];
  const sorted = statsCopy.sort(
    (a, b) => (b[relevantKey] as number) - (a[relevantKey] as number),
  );
  const bestStat = sorted[0];
  const totalUnits = DEMO_CHANNEL_STATS.reduce(
    (s, c) => s + (c[relevantKey] as number),
    0,
  );
  const bestPct =
    bestStat && totalUnits > 0
      ? (((bestStat[relevantKey] as number) / totalUnits) * 100).toFixed(0)
      : "0";

  const cards = [
    {
      label: "Total Leads Tracked",
      value: String(records.length),
      sub: "across all channels",
      icon: Users,
      color: "text-purple-400",
      ring: "bg-purple-500/10 ring-1 ring-purple-500/20",
    },
    {
      label: "Total Revenue Attributed",
      value: `$${totalRevenue.toLocaleString()}`,
      sub: "closed deal value",
      icon: DollarSign,
      color: "text-emerald-400",
      ring: "bg-emerald-500/10 ring-1 ring-emerald-500/20",
    },
    {
      label: "Avg Touches to Convert",
      value: avgTouches,
      sub: "touchpoints per lead",
      icon: Target,
      color: "text-cyan-400",
      ring: "bg-cyan-500/10 ring-1 ring-cyan-500/20",
    },
    {
      label: "Best Channel",
      value: CHANNEL_CFG[bestStat?.channel]?.label ?? "—",
      sub: `${bestPct}% of attribution`,
      icon: Award,
      color: "text-amber-400",
      ring: "bg-amber-500/10 ring-1 ring-amber-500/20",
    },
    {
      label: "Conversion Rate",
      value: `${convRate}%`,
      sub: "leads → booked calls",
      icon: TrendingUp,
      color: "text-rose-400",
      ring: "bg-rose-500/10 ring-1 ring-rose-500/20",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-5 gap-3"
      data-ocid="attribution.overview_stats"
    >
      {cards.map(({ label, value, sub, icon: Icon, color, ring }) => (
        <Card key={label} className="bg-card border-border">
          <CardContent className="p-4">
            <div
              className={`w-8 h-8 rounded-lg ${ring} flex items-center justify-center mb-3`}
            >
              <Icon size={15} className={color} />
            </div>
            <p className="text-[11px] text-muted-foreground mb-1 leading-tight">
              {label}
            </p>
            <p className="text-xl font-bold text-foreground leading-none">
              {value}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Section 3 — Channel Performance ──────────────────────────────────────────
function ChannelPerformance({ model }: { model: AttributionModel }) {
  const leadKey =
    model === "first_touch"
      ? "firstTouchLeads"
      : model === "last_touch"
        ? "lastTouchLeads"
        : "touchCount";

  const maxLeads = Math.max(
    ...DEMO_CHANNEL_STATS.map((s) => s[leadKey] as number),
  );
  const best = [...DEMO_CHANNEL_STATS].sort(
    (a, b) => b.conversionRate - a.conversionRate,
  )[0];
  const sorted = [...DEMO_CHANNEL_STATS].sort(
    (a, b) => (b[leadKey] as number) - (a[leadKey] as number),
  );

  return (
    <Card
      className="bg-card border-border"
      data-ocid="attribution.channel_performance"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="text-indigo-400">▌▌▌</span>
          Channel Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {sorted.map((stat) => {
          const cfg = CHANNEL_CFG[stat.channel];
          const Icon = cfg?.icon ?? Target;
          const isBest = stat.channel === best.channel;
          const leads = stat[leadKey] as number;
          const barW = maxLeads > 0 ? (leads / maxLeads) * 100 : 0;
          return (
            <div key={stat.channel}>
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${cfg?.color}22` }}
                >
                  <Icon size={13} style={{ color: cfg?.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-foreground">
                      {stat.label}
                    </span>
                    {isBest && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                        Best
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barW}%`,
                        backgroundColor: cfg?.color,
                        minWidth: leads > 0 ? "6px" : "0",
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 text-right ml-1">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {leads}
                    </p>
                    <p className="text-[9px] text-muted-foreground">leads</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      ${(stat.linearValue / 1000).toFixed(1)}k
                    </p>
                    <p className="text-[9px] text-muted-foreground">rev</p>
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: cfg?.color }}
                    >
                      {(stat.conversionRate * 100).toFixed(0)}%
                    </p>
                    <p className="text-[9px] text-muted-foreground">conv</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Section 4 — Funnel ────────────────────────────────────────────────────────
function FunnelVisualization() {
  const maxCount = DEMO_FUNNEL_STAGES[0]?.count ?? 1;
  const lastStage = DEMO_FUNNEL_STAGES[DEMO_FUNNEL_STAGES.length - 1];
  const endRate =
    maxCount > 0
      ? (((lastStage?.count ?? 0) / maxCount) * 100).toFixed(1)
      : "0";

  return (
    <Card className="bg-card border-border" data-ocid="attribution.funnel">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ArrowDown size={14} className="text-purple-400" />
          Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {DEMO_FUNNEL_STAGES.map((stage, i) => {
            const w = Math.round((stage.count / maxCount) * 100);
            const dropLabel =
              i > 0 ? `↓ ${(stage.dropOffRate * 100).toFixed(0)}% drop` : null;
            return (
              <div key={stage.id}>
                {dropLabel && (
                  <p className="text-[9px] text-muted-foreground text-center py-0.5">
                    {dropLabel}
                  </p>
                )}
                <div
                  className="mx-auto rounded-lg px-3 py-2.5 flex items-center justify-between transition-all duration-300"
                  style={{
                    width: `${Math.max(w, 35)}%`,
                    backgroundColor: `${stage.color}18`,
                    border: `1px solid ${stage.color}35`,
                  }}
                  data-ocid={`attribution.funnel.item.${i + 1}`}
                >
                  <span className="text-[11px] font-medium text-foreground truncate">
                    {stage.label}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: stage.color }}
                    >
                      {stage.count.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {(stage.conversionRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-base font-bold text-foreground">
              {DEMO_FUNNEL_STAGES[0]?.count ?? 0}
            </p>
            <p className="text-[9px] text-muted-foreground">Sourced</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-emerald-400">
              {lastStage?.count ?? 0}
            </p>
            <p className="text-[9px] text-muted-foreground">Closed</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-purple-400">{endRate}%</p>
            <p className="text-[9px] text-muted-foreground">End-to-End</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section 5 — Attribution Paths ────────────────────────────────────────────
type PathSort = "frequency" | "deal_value";

interface PathEntry {
  channels: AttributionChannel[];
  count: number;
  avgDealValue: number;
  convRate: number;
}

function AttributionPaths({ records }: { records: LeadAttributionRecord[] }) {
  const [sortBy, setSortBy] = useState<PathSort>("frequency");

  const paths = useMemo<PathEntry[]>(() => {
    const map = new Map<
      string,
      { channels: AttributionChannel[]; count: number; totalValue: number }
    >();
    for (const rec of records) {
      const key = rec.channels.map((c) => c.channel).join("→");
      const ex = map.get(key);
      if (ex) {
        ex.count += 1;
        ex.totalValue += rec.closedDealValue;
      } else {
        map.set(key, {
          channels: rec.channels.map((c) => c.channel),
          count: 1,
          totalValue: rec.closedDealValue,
        });
      }
    }
    return Array.from(map.values())
      .map((p) => ({
        channels: p.channels,
        count: p.count,
        avgDealValue: p.count > 0 ? p.totalValue / p.count : 0,
        convRate: records.length > 0 ? p.count / records.length : 0,
      }))
      .sort((a, b) =>
        sortBy === "frequency"
          ? b.count - a.count
          : b.avgDealValue - a.avgDealValue,
      )
      .slice(0, 10);
  }, [records, sortBy]);

  return (
    <Card className="bg-card border-border" data-ocid="attribution.path_table">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Top Conversion Paths
          </CardTitle>
          <div className="flex gap-1">
            {(["frequency", "deal_value"] as PathSort[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSortBy(s)}
                onKeyDown={(e) => e.key === "Enter" && setSortBy(s)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                  sortBy === s
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-transparent text-muted-foreground border-border hover:border-purple-500/50"
                }`}
                data-ocid={`attribution.path_sort.${s}`}
              >
                {s === "frequency" ? "Frequency" : "Deal Value"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {paths.map((path, i) => (
          <div
            key={`${path.channels.join("-")}-${i}`}
            className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/30 border border-border hover:border-purple-500/30 transition-colors"
            data-ocid={`attribution.path.item.${i + 1}`}
          >
            <div className="flex-1 min-w-0">
              <PathBadges channels={path.channels} />
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-right">
              <div>
                <p className="text-xs font-bold text-foreground">
                  {path.count}×
                </p>
                <p className="text-[9px] text-muted-foreground">freq</p>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400">
                  $
                  {path.avgDealValue.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-[9px] text-muted-foreground">avg</p>
              </div>
              <div>
                <p className="text-xs font-bold text-purple-400">
                  {(path.convRate * 100).toFixed(0)}%
                </p>
                <p className="text-[9px] text-muted-foreground">conv</p>
              </div>
            </div>
          </div>
        ))}
        {paths.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No path data for selected range.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Section 6 — Individual Records ───────────────────────────────────────────
const PER_PAGE = 10;

function LeadRecordsTable({
  records,
  channelFilter,
}: {
  records: LeadAttributionRecord[];
  channelFilter: AttributionChannel | "all";
}) {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      channelFilter === "all"
        ? records
        : records.filter((r) =>
            r.channels.some((c) => c.channel === channelFilter),
          ),
    [records, channelFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageRecords = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <Card
      className="bg-card border-border"
      data-ocid="attribution.lead_records"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Individual Lead Attribution Records
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Lead", "Channels", "Final Channel", "Deal", "Days", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className={`text-[11px] text-muted-foreground font-medium px-4 py-2.5 ${h === "Lead" || h === "Channels" || h === "Final Channel" ? "text-left" : "text-right"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {pageRecords.map((rec, i) => {
                const isExpanded = expandedId === rec.id;
                const globalIdx = (page - 1) * PER_PAGE + i + 1;
                const uniqueChannels = Array.from(
                  new Set(rec.channels.map((c) => c.channel)),
                );
                return (
                  <>
                    <tr
                      key={rec.id}
                      className="border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(rec.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && toggleExpand(rec.id)
                      }
                      tabIndex={0}
                      data-ocid={`attribution.lead_record.item.${globalIdx}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground text-xs">
                          {rec.leadName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {uniqueChannels.map((ch) => (
                            <ChannelBadge key={ch} channel={ch} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ChannelBadge channel={rec.finalConversionChannel} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-emerald-400 font-semibold text-xs">
                          ${rec.closedDealValue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-muted-foreground text-xs">
                          {rec.daysToConvert}d
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isExpanded ? (
                          <ChevronUp
                            size={13}
                            className="text-muted-foreground ml-auto"
                          />
                        ) : (
                          <ChevronDown
                            size={13}
                            className="text-muted-foreground ml-auto"
                          />
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${rec.id}-expand`} className="bg-muted/10">
                        <td colSpan={6} className="px-6 py-3">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-semibold">
                            Touch Timeline
                          </p>
                          <div className="space-y-2.5">
                            {rec.channels.map((touch) => {
                              const cfg =
                                CHANNEL_CFG[touch.channel] ??
                                CHANNEL_CFG.direct;
                              const Icon = cfg.icon;
                              const d = new Date(touch.timestamp);
                              const dateStr = d.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              });
                              const timeStr = d.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              return (
                                <div
                                  key={`${touch.channel}-${touch.timestamp}`}
                                  className="flex items-start gap-3 pl-3 border-l-2"
                                  style={{ borderColor: cfg.color }}
                                >
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{
                                      backgroundColor: `${cfg.color}22`,
                                    }}
                                  >
                                    <Icon
                                      size={10}
                                      style={{ color: cfg.color }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-medium text-foreground">
                                        {touch.source}
                                      </span>
                                      <ChannelBadge channel={touch.channel} />
                                      {touch.interactionType && (
                                        <span className="text-[10px] text-muted-foreground italic">
                                          {touch.interactionType.replace(
                                            "_",
                                            " ",
                                          )}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      {dateStr} · {timeStr}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {pageRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                    data-ocid="attribution.lead_records.empty_state"
                  >
                    No records match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-card rounded-b-lg">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              data-ocid="attribution.pagination_prev"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              data-ocid="attribution.pagination_next"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Section 7 — Campaign ROI ──────────────────────────────────────────────────
const CAMPAIGNS = [
  {
    name: "Plumber Cold Sequence",
    niche: "Plumber",
    leads: 42,
    booked: 9,
    revenue: 28800,
    cost: 6400,
    roi: 350,
  },
  {
    name: "Med Spa Cold Sequence",
    niche: "Med Spa",
    leads: 38,
    booked: 11,
    revenue: 39600,
    cost: 7200,
    roi: 450,
  },
  {
    name: "Free Audit Tripwire — Homepage",
    niche: "All",
    leads: 87,
    booked: 14,
    revenue: 33600,
    cost: 2800,
    roi: 1100,
  },
  {
    name: "Google Ads — Emergency Plumber",
    niche: "Plumber",
    leads: 19,
    booked: 4,
    revenue: 14200,
    cost: 8100,
    roi: 75,
  },
  {
    name: "Facebook Organic — HVAC",
    niche: "HVAC",
    leads: 12,
    booked: 2,
    revenue: 5600,
    cost: 1800,
    roi: 211,
  },
];

function CampaignROI() {
  return (
    <Card
      className="bg-card border-border"
      data-ocid="attribution.campaign_roi"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <DollarSign size={14} className="text-emerald-400" />
          Campaign ROI Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Campaign", "Niche", "Leads", "Booked", "Revenue", "ROI"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`text-[11px] text-muted-foreground font-medium px-4 py-2.5 ${
                        h === "Campaign" || h === "Niche"
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((row, i) => {
                const roiColor =
                  row.roi > 200
                    ? "text-emerald-400"
                    : row.roi >= 100
                      ? "text-amber-400"
                      : "text-rose-400";
                const roiBg =
                  row.roi > 200
                    ? "bg-emerald-500/10 border-emerald-500/25"
                    : row.roi >= 100
                      ? "bg-amber-500/10 border-amber-500/25"
                      : "bg-rose-500/10 border-rose-500/25";
                return (
                  <tr
                    key={row.name}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`attribution.campaign_roi.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-foreground">
                        {row.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px]">
                        {row.niche}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-foreground">
                      {row.leads}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-foreground">
                      {row.booked}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-emerald-400">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded border ${roiBg} ${roiColor}`}
                      >
                        {row.roi}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
const CHANNEL_FILTER_OPTIONS: {
  value: AttributionChannel | "all";
  label: string;
}[] = [
  { value: "all", label: "All Channels" },
  { value: "cold_email", label: "Cold Email" },
  { value: "voice_agent", label: "Voice Agent" },
  { value: "demo", label: "Demo" },
  { value: "audit", label: "Free Audit" },
  { value: "organic", label: "Organic" },
  { value: "referral", label: "Referral" },
  { value: "paid_ads", label: "Paid Ads" },
];

export default function LeadAttributionPage() {
  const { leadAttributionRecords } = useApp();
  const [model, setModel] = useState<AttributionModel>("linear");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [channelFilter, setChannelFilter] = useState<
    AttributionChannel | "all"
  >("all");

  const filteredRecords = useMemo(() => {
    const now = Date.now();
    const rangeMs: Record<DateRange, number> = {
      "7d": 7 * 86400000,
      "30d": 30 * 86400000,
      "90d": 90 * 86400000,
      custom: 3650 * 86400000,
    };
    return leadAttributionRecords.filter(
      (r) => r.createdAt >= now - rangeMs[dateRange],
    );
  }, [leadAttributionRecords, dateRange]);

  return (
    <div className="space-y-6" data-ocid="attribution.page">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Lead Attribution</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Track every touchpoint from first contact to closed deal across all
          channels.
        </p>
      </div>

      {/* Section 1 — Model Selector & Date Range */}
      <Card
        className="bg-card border-border"
        data-ocid="attribution.model_selector"
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  title={m.desc}
                  onClick={() => setModel(m.id)}
                  onKeyDown={(e) => e.key === "Enter" && setModel(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    model === m.id
                      ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20"
                      : "bg-transparent text-muted-foreground border-border hover:border-purple-500/50 hover:text-foreground"
                  }`}
                  data-ocid={`attribution.model.${m.id}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div
              className="flex gap-0.5 bg-muted/40 rounded-lg p-1"
              data-ocid="attribution.date_range"
            >
              {DATE_RANGES.map((dr) => (
                <button
                  key={dr.id}
                  type="button"
                  onClick={() => setDateRange(dr.id)}
                  onKeyDown={(e) => e.key === "Enter" && setDateRange(dr.id)}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    dateRange === dr.id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`attribution.date_range.${dr.id}`}
                >
                  {dr.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border">
            <span className="text-purple-400 font-medium">
              {MODELS.find((m) => m.id === model)?.label}:
            </span>{" "}
            {MODELS.find((m) => m.id === model)?.desc}. All metrics reflect this
            model.
          </p>
        </CardContent>
      </Card>

      {/* Section 2 — Overview Stats */}
      <OverviewStats records={filteredRecords} model={model} />

      {/* Section 3 + 4 — Channel Performance + Funnel */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <ChannelPerformance model={model} />
        </div>
        <div className="xl:col-span-2">
          <FunnelVisualization />
        </div>
      </div>

      {/* Section 5 — Conversion Paths */}
      <AttributionPaths records={filteredRecords} />

      {/* Section 6 — Individual Records */}
      <div className="space-y-3">
        <div
          className="flex items-center gap-2 flex-wrap"
          data-ocid="attribution.channel_filter"
        >
          <Filter size={12} className="text-muted-foreground flex-shrink-0" />
          {CHANNEL_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setChannelFilter(opt.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && setChannelFilter(opt.value)
              }
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                channelFilter === opt.value
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-transparent text-muted-foreground border-border hover:border-purple-500/50"
              }`}
              data-ocid={`attribution.filter.${opt.value}`}
            >
              {opt.label}
            </button>
          ))}
          <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
            <ArrowUpDown size={10} />
            Expand rows for full touch timeline
          </span>
        </div>
        <LeadRecordsTable
          records={filteredRecords}
          channelFilter={channelFilter}
        />
      </div>

      {/* Section 7 — Campaign ROI */}
      <CampaignROI />
    </div>
  );
}
