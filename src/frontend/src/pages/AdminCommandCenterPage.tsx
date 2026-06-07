import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ChevronRight,
  Crosshair,
  Kanban,
  PlayCircle,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { useActor } from "../hooks/useActor";

// ─── Types ──────────────────────────────────────────────────────────────────

interface HealthMetrics {
  leadsToday: number;
  demosRunning: number;
  trialsActive: number;
  outreachSent: number;
  apiStatus: boolean;
}

interface ActivityFeedItem {
  id: string;
  timestamp: number;
  eventType: string;
  title: string;
  description: string;
  entityId?: string;
  entityType?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function entityPath(entityType?: string): string {
  switch (entityType) {
    case "lead":
      return "/leads";
    case "trial":
      return "/admin/trials";
    case "outreach":
      return "/outreach-agent";
    case "review":
      return "/reviews";
    case "booking":
      return "/appointments";
    default:
      return "/dashboard";
  }
}

function eventColor(eventType: string): string {
  if (eventType.includes("lead") || eventType.includes("booking"))
    return "emerald";
  if (eventType.includes("trial")) return "blue";
  if (eventType.includes("reply")) return "amber";
  if (eventType.includes("alert") || eventType.includes("error")) return "red";
  return "purple";
}

const EVENT_COLOR_MAP: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function EventIcon({ eventType, color }: { eventType: string; color: string }) {
  const cls = `w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${EVENT_COLOR_MAP[color]}`;
  if (eventType.includes("lead"))
    return (
      <div className={cls}>
        <Users size={14} />
      </div>
    );
  if (eventType.includes("trial"))
    return (
      <div className={cls}>
        <Sparkles size={14} />
      </div>
    );
  if (eventType.includes("reply"))
    return (
      <div className={cls}>
        <Send size={14} />
      </div>
    );
  if (eventType.includes("review"))
    return (
      <div className={cls}>
        <Star size={14} />
      </div>
    );
  if (eventType.includes("booking"))
    return (
      <div className={cls}>
        <Activity size={14} />
      </div>
    );
  return (
    <div className={cls}>
      <AlertCircle size={14} />
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentClass: string;
  loading?: boolean;
}

function MetricCard({
  label,
  value,
  icon,
  accentClass,
  loading,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 flex flex-col gap-3 border border-white/10">
        <Skeleton className="h-4 w-16 bg-white/10" />
        <Skeleton className="h-9 w-20 bg-white/10" />
        <Skeleton className="h-3 w-24 bg-white/10" />
      </div>
    );
  }
  return (
    <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col gap-2 group hover:border-white/20 transition-all duration-200">
      <div className="flex items-start justify-between">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
          {label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClass}`}
        >
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-white leading-none">{value}</div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminCommandCenterPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();

  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [activity, setActivity] = useState<ActivityFeedItem[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [topNiche, setTopNiche] = useState<{
    niche: string;
    trials_activated: bigint;
    paid_customers: bigint;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!actor) return;
    try {
      const [m, rawActivity] = await Promise.all([
        actor.getHealthMetrics() as Promise<{
          leadsToday: bigint;
          demosRunning: bigint;
          trialsActive: bigint;
          outreachSent: bigint;
          apiStatus: boolean;
        }>,
        actor.getRecentActivity(BigInt(20)) as Promise<
          Array<{
            id: string;
            timestamp: bigint;
            eventType: string;
            title: string;
            description: string;
            entityId: [] | [string];
            entityType: [] | [string];
          }>
        >,
      ]);
      setMetrics({
        leadsToday: Number(m.leadsToday),
        demosRunning: Number(m.demosRunning),
        trialsActive: Number(m.trialsActive),
        outreachSent: Number(m.outreachSent),
        apiStatus: m.apiStatus,
      });
      const mappedActivity: ActivityFeedItem[] = rawActivity.map((item) => ({
        id: item.id,
        timestamp: Number(item.timestamp),
        eventType: item.eventType,
        title: item.title,
        description: item.description,
        entityId: item.entityId.length > 0 ? item.entityId[0] : undefined,
        entityType: item.entityType.length > 0 ? item.entityType[0] : undefined,
      }));
      setActivity(mappedActivity);
      setLastUpdated(new Date());
      try {
        const topNicheRaw = await (
          actor as Record<string, unknown> & {
            getTopPerformingNiche: () => Promise<
              Array<{
                niche: string;
                trials_activated: bigint;
                paid_customers: bigint;
              }>
            >;
          }
        ).getTopPerformingNiche();
        setTopNiche(topNicheRaw?.[0] ?? null);
      } catch {
        /* noop */
      }
    } catch {
      setActivity([]);
    } finally {
      setMetricsLoading(false);
      setActivityLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (!actor || isFetching) return;
    fetchData();
    intervalRef.current = setInterval(fetchData, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, isFetching, fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const displayMetrics: HealthMetrics = metrics ?? {
    leadsToday: 0,
    demosRunning: 0,
    trialsActive: 0,
    outreachSent: 0,
    apiStatus: true,
  };

  return (
    <div
      data-ocid="admin-command-center.page"
      className="min-h-screen bg-gradient-to-br from-[oklch(0.06_0.01_280)] via-[oklch(0.08_0.008_280)] to-[oklch(0.05_0.012_275)] px-4 py-6 md:px-8"
    >
      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in"
        style={{ animationDelay: "0ms" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Command Center
            </h1>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Real-time overview of your BRF operation
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {relativeTime(lastUpdated.getTime())}
            </span>
          )}
          <button
            type="button"
            data-ocid="admin-command-center.refresh_button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/8 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/12 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ── HEALTH SCORECARD ────────────────────────────────────────── */}
      <section
        className="mb-8 animate-fade-in"
        style={{ animationDelay: "60ms" }}
        data-ocid="admin-command-center.health_scorecard"
      >
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Health Scorecard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <MetricCard
            label="Leads Today"
            value={displayMetrics.leadsToday}
            icon={<Crosshair size={15} className="text-purple-300" />}
            accentClass="bg-purple-500/20 text-purple-400"
            loading={metricsLoading}
          />
          <MetricCard
            label="Demos Running"
            value={displayMetrics.demosRunning}
            icon={<PlayCircle size={15} className="text-blue-300" />}
            accentClass="bg-blue-500/20 text-blue-400"
            loading={metricsLoading}
          />
          <MetricCard
            label="Trials Active"
            value={displayMetrics.trialsActive}
            icon={<Sparkles size={15} className="text-amber-300" />}
            accentClass="bg-amber-500/20 text-amber-400"
            loading={metricsLoading}
          />
          <MetricCard
            label="Outreach Sent"
            value={displayMetrics.outreachSent}
            icon={<Send size={15} className="text-emerald-300" />}
            accentClass="bg-emerald-500/20 text-emerald-400"
            loading={metricsLoading}
          />
          {metricsLoading ? (
            <div className="glass-card rounded-xl p-5 flex flex-col gap-3 border border-white/10">
              <Skeleton className="h-4 w-16 bg-white/10" />
              <Skeleton className="h-9 w-20 bg-white/10" />
            </div>
          ) : (
            <div className="glass-card rounded-xl p-5 border border-white/10 flex flex-col gap-2 hover:border-white/20 transition-all duration-200">
              <div className="flex items-start justify-between">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  API Status
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    displayMetrics.apiStatus
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  <Wifi size={15} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${displayMetrics.apiStatus ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <span
                  className={`text-sm font-semibold ${
                    displayMetrics.apiStatus
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {displayMetrics.apiStatus
                    ? "All Systems Go"
                    : "Check Integrations"}
                </span>
              </div>
            </div>
          )}
          <div
            className="glass-card rounded-xl p-5 border border-white/10 flex flex-col gap-2 hover:border-white/20 transition-all duration-200"
            data-ocid="admin-command-center.top_niche_card"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Top Niche
              </span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500/20 text-amber-400">
                <Sparkles size={15} />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-400 capitalize leading-tight truncate">
              {topNiche ? topNiche.niche : "—"}
            </div>
            <div className="text-xs text-gray-500">
              {topNiche && Number(topNiche.trials_activated) > 0
                ? `${(
                    (Number(topNiche.paid_customers) /
                      Number(topNiche.trials_activated)) *
                      100
                  ).toFixed(1)}% close rate`
                : "No data yet"}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK-ACTION BAR ────────────────────────────────────────── */}
      <section
        className="mb-8 animate-fade-in"
        style={{ animationDelay: "120ms" }}
        data-ocid="admin-command-center.quick_actions"
      >
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            type="button"
            data-ocid="admin-command-center.find_leads_button"
            onClick={() => navigate({ to: "/open-lead-lake" })}
            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-semibold text-sm shadow-lg hover:scale-105 hover:shadow-purple-500/25 hover:shadow-xl transition-all duration-200 border border-purple-500/30"
          >
            <Crosshair size={16} />
            Find Leads
          </button>
          <button
            type="button"
            data-ocid="admin-command-center.run_outreach_button"
            onClick={() => navigate({ to: "/outreach-agent" })}
            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-semibold text-sm shadow-lg hover:scale-105 hover:shadow-emerald-500/25 hover:shadow-xl transition-all duration-200 border border-emerald-500/30"
          >
            <Zap size={16} />
            Run Outreach
          </button>
          <button
            type="button"
            data-ocid="admin-command-center.check_reviews_button"
            onClick={() => navigate({ to: "/reviews" })}
            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 text-white font-semibold text-sm shadow-lg hover:scale-105 hover:shadow-amber-500/25 hover:shadow-xl transition-all duration-200 border border-amber-500/30"
          >
            <Star size={16} />
            Check Reviews
          </button>
          <button
            type="button"
            data-ocid="admin-command-center.view_pipeline_button"
            onClick={() => navigate({ to: "/crm-pipeline" })}
            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-700 text-white font-semibold text-sm shadow-lg hover:scale-105 hover:shadow-blue-500/25 hover:shadow-xl transition-all duration-200 border border-blue-500/30"
          >
            <Kanban size={16} />
            View Pipeline
          </button>
          <button
            type="button"
            data-ocid="admin-command-center.niche_analytics_button"
            onClick={() => navigate({ to: "/admin/niche-analytics" })}
            className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 text-white font-semibold text-sm shadow-lg hover:scale-105 hover:shadow-rose-500/25 hover:shadow-xl transition-all duration-200 border border-rose-500/30"
          >
            <Activity size={16} />
            Niche Analytics
          </button>
        </div>
      </section>

      {/* ── ACTIVITY FEED ───────────────────────────────────────────── */}
      <section
        className="animate-fade-in"
        style={{ animationDelay: "180ms" }}
        data-ocid="admin-command-center.activity_feed"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">
              Recent Activity
            </h2>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Auto-refreshes every 30s
          </span>
        </div>

        {activityLoading ? (
          <div
            className="space-y-3"
            data-ocid="admin-command-center.loading_state"
          >
            {(["a", "b", "c"] as const).map((skeletonId) => (
              <div
                key={`skeleton-activity-${skeletonId}`}
                className="glass-card rounded-xl p-4 border border-white/10 flex items-center gap-3"
              >
                <Skeleton className="w-8 h-8 rounded-lg bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-48 bg-white/10" />
                  <Skeleton className="h-3 w-64 bg-white/10" />
                </div>
                <Skeleton className="h-3 w-14 bg-white/10" />
              </div>
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div
            data-ocid="admin-command-center.empty_state"
            className="glass-card rounded-xl border border-white/10 p-12 text-center"
          >
            <Activity size={36} className="mx-auto mb-3 text-gray-600" />
            <p className="text-white font-medium mb-1">
              No recent activity yet
            </p>
            <p className="text-sm text-gray-500">
              Your feed will populate as leads, trials, and outreach events come
              in.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {activity.map((item, idx) => {
              const color = eventColor(item.eventType);
              return (
                <button
                  key={item.id}
                  type="button"
                  data-ocid={`admin-command-center.activity.item.${idx + 1}`}
                  onClick={() =>
                    navigate({ to: entityPath(item.entityType) as any })
                  }
                  className="w-full glass-card rounded-xl border border-white/10 p-4 flex items-center gap-3 text-left hover:border-white/20 hover:bg-white/5 transition-all duration-200 group"
                >
                  <EventIcon eventType={item.eventType} color={color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-500">
                      {relativeTime(Number(item.timestamp))}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-gray-600 group-hover:text-gray-400 transition-colors"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
