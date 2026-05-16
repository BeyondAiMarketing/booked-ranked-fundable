import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type FunnelStage,
  demoEngagementFunnel,
  demoQueueStats,
  demoThrottleConfigs,
} from "@/data/outreachAnalyticsData";
import {
  useAllBounceRecords,
  useOutreachOverview,
  useQueueStats,
  useSetThrottleConfig,
} from "@/hooks/useOutreachAnalytics";
import type {
  OutreachBounceRecord,
  QueuePerformanceStat,
  QueueThrottleConfig,
} from "@/types/newsletter";
import {
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Filter,
  Mail,
  Pause,
  RefreshCw,
  Search,
  Settings2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────

const TENANT_ID = "demo-tenant";
const TABS = ["overview", "campaigns", "leads", "engagement"] as const;
type Tab = (typeof TABS)[number];

const NICHE_COLORS: Record<string, string> = {
  Plumbing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Med Spa": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Roofing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Real Estate": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  HVAC: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Dental: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Technology: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

// ── Demo lead rows ─────────────────────────────────────────────────────────────

interface DemoLead {
  id: string;
  email: string;
  niche: string;
  queue: string;
  bounceStatus: "ok" | "soft" | "hard";
  lastContact: string;
  engagement: "no-open" | "opened" | "clicked" | "replied";
}

const DEMO_LEADS: DemoLead[] = [
  {
    id: "1",
    email: "mike@roofpros.com",
    niche: "Roofing",
    queue: "Roofing Storm Season Push",
    bounceStatus: "ok",
    lastContact: "2025-11-16",
    engagement: "replied",
  },
  {
    id: "2",
    email: "sarah@medspaluxe.com",
    niche: "Med Spa",
    queue: "Med Spa Premium Sequence",
    bounceStatus: "ok",
    lastContact: "2025-11-16",
    engagement: "clicked",
  },
  {
    id: "3",
    email: "info@hvacpro.net",
    niche: "HVAC",
    queue: "HVAC Maintenance Contract Push",
    bounceStatus: "soft",
    lastContact: "2025-11-15",
    engagement: "opened",
  },
  {
    id: "4",
    email: "noreply@dentalcorp.xyz",
    niche: "Dental",
    queue: "Dental New Patient Campaign",
    bounceStatus: "hard",
    lastContact: "2025-11-15",
    engagement: "no-open",
  },
  {
    id: "5",
    email: "james@realtyweb.io",
    niche: "Real Estate",
    queue: "Real Estate SEO Audit Drip",
    bounceStatus: "ok",
    lastContact: "2025-11-14",
    engagement: "opened",
  },
  {
    id: "6",
    email: "contact@techsolutions.co",
    niche: "Technology",
    queue: "Technology Cold Outreach",
    bounceStatus: "soft",
    lastContact: "2025-11-14",
    engagement: "opened",
  },
  {
    id: "7",
    email: "owner@plumbright.com",
    niche: "Plumbing",
    queue: "Plumbing Cold Outreach",
    bounceStatus: "ok",
    lastContact: "2025-11-13",
    engagement: "clicked",
  },
  {
    id: "8",
    email: "admin@badomain.fail",
    niche: "Technology",
    queue: "Technology Cold Outreach",
    bounceStatus: "hard",
    lastContact: "2025-11-13",
    engagement: "no-open",
  },
  {
    id: "9",
    email: "dr.kim@drsmilesdental.com",
    niche: "Dental",
    queue: "Dental New Patient Campaign",
    bounceStatus: "ok",
    lastContact: "2025-11-12",
    engagement: "replied",
  },
  {
    id: "10",
    email: "book@spaelite.com",
    niche: "Med Spa",
    queue: "Med Spa Premium Sequence",
    bounceStatus: "ok",
    lastContact: "2025-11-12",
    engagement: "clicked",
  },
  {
    id: "11",
    email: "builds@constructco.biz",
    niche: "Roofing",
    queue: "Roofing Storm Season Push",
    bounceStatus: "soft",
    lastContact: "2025-11-11",
    engagement: "no-open",
  },
  {
    id: "12",
    email: "lisa@lhrealty.net",
    niche: "Real Estate",
    queue: "Real Estate SEO Audit Drip",
    bounceStatus: "ok",
    lastContact: "2025-11-11",
    engagement: "replied",
  },
];

const REPLY_BREAKDOWN = [
  {
    label: "Positive",
    count: 142,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20 border-emerald-500/30",
  },
  {
    label: "Neutral",
    count: 73,
    color: "text-amber-400",
    bg: "bg-amber-500/20 border-amber-500/30",
  },
  {
    label: "Spam",
    count: 33,
    color: "text-rose-400",
    bg: "bg-rose-500/20 border-rose-500/30",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  warn,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
  warn?: boolean;
}) {
  return (
    <Card className="bg-card border border-border hover:border-primary/40 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div
            className={`p-2 rounded-lg ${warn ? "bg-amber-500/20" : "bg-primary/15"}`}
          >
            <Icon
              className={`w-5 h-5 ${warn ? "text-amber-400" : "text-primary"}`}
            />
          </div>
        </div>
        {warn && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Requires attention</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NicheBadge({ niche }: { niche: string }) {
  const cls =
    NICHE_COLORS[niche] ?? "bg-muted/50 text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}
    >
      {niche}
    </span>
  );
}

function BounceBadge({ type }: { type: "ok" | "soft" | "hard" | string }) {
  if (type === "ok")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        OK
      </span>
    );
  if (type === "soft")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-amber-400">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        Soft
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-rose-400">
      <span className="w-2 h-2 rounded-full bg-rose-400" />
      Hard
    </span>
  );
}

function EngagementBadge({ status }: { status: DemoLead["engagement"] }) {
  const map: Record<DemoLead["engagement"], { label: string; cls: string }> = {
    "no-open": {
      label: "No Open",
      cls: "bg-muted/40 text-muted-foreground border-border",
    },
    opened: {
      label: "Opened",
      cls: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    clicked: {
      label: "Clicked",
      cls: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    replied: {
      label: "Replied",
      cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}
    >
      {label}
    </span>
  );
}

// ── Throttle Config Modal ──────────────────────────────────────────────────────

function ThrottleModal({
  open,
  queueId,
  queueName,
  onClose,
}: {
  open: boolean;
  queueId: string;
  queueName: string;
  onClose: () => void;
}) {
  const initial = demoThrottleConfigs[queueId] ?? {
    dailyCap: 100,
    intervalSeconds: 90,
    staggerEnabled: true,
    backoffMultiplier: 1.5,
  };
  const [cfg, setCfg] = useState<QueueThrottleConfig>(initial);
  const setThrottle = useSetThrottleConfig();

  const totalLeads =
    demoQueueStats.find((q) => q.queueId === queueId)?.totalLeads ?? 500;
  const estDays = cfg.dailyCap > 0 ? Math.ceil(totalLeads / cfg.dailyCap) : "∞";

  const intervalOptions = [
    { label: "5 min", value: 300 },
    { label: "10 min", value: 600 },
    { label: "15 min", value: 900 },
    { label: "30 min", value: 1800 },
    { label: "60 min", value: 3600 },
  ];

  function handleSave() {
    setThrottle.mutate({ queueId, config: cfg });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-[#16162a] border border-white/15 text-foreground max-w-md"
        data-ocid="throttle.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Configure Throttle
          </DialogTitle>
          <p className="text-xs text-muted-foreground truncate">{queueName}</p>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Daily Cap */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Daily Send Cap:{" "}
              <span className="text-foreground font-semibold">
                {cfg.dailyCap}
              </span>
            </Label>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={cfg.dailyCap}
              onChange={(e) =>
                setCfg((p) => ({ ...p, dailyCap: Number(e.target.value) }))
              }
              className="w-full accent-purple-500"
              data-ocid="throttle.daily_cap"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>100</span>
              <span>2,000</span>
            </div>
          </div>

          {/* Send Interval */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Send Interval
            </Label>
            <Select
              value={String(cfg.intervalSeconds)}
              onValueChange={(v) =>
                setCfg((p) => ({ ...p, intervalSeconds: Number(v) }))
              }
            >
              <SelectTrigger
                className="bg-[#0e0e1a] border-white/15 text-sm"
                data-ocid="throttle.interval_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/15">
                {intervalOptions.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stagger Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Stagger sends</p>
              <p className="text-xs text-muted-foreground">
                Randomize send times within window
              </p>
            </div>
            <Switch
              checked={cfg.staggerEnabled}
              onCheckedChange={(v) =>
                setCfg((p) => ({ ...p, staggerEnabled: v }))
              }
              data-ocid="throttle.stagger_toggle"
            />
          </div>

          {/* Estimated duration */}
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm text-primary">
            <strong>{totalLeads.toLocaleString()} leads</strong> at{" "}
            <strong>{cfg.dailyCap}/day</strong> ≈{" "}
            <strong>
              {estDays} {estDays === 1 ? "day" : "days"}
            </strong>{" "}
            to complete
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 border-white/15 hover:bg-white/5"
              onClick={onClose}
              data-ocid="throttle.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleSave}
              data-ocid="throttle.save_button"
            >
              Save Config
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Overview Tab ───────────────────────────────────────────────────────────────

function OverviewTab({ onTabChange }: { onTabChange: (t: Tab) => void }) {
  const { data: overview, isLoading } = useOutreachOverview(TENANT_ID);
  const { data: bounces } = useAllBounceRecords(TENANT_ID);

  const recentActivity = useMemo(
    () => [
      {
        queue: "Technology Cold Outreach",
        time: "2 min ago",
        sent: 12,
        status: "sent",
      },
      {
        queue: "Med Spa Premium Sequence",
        time: "18 min ago",
        sent: 8,
        status: "sent",
      },
      {
        queue: "Roofing Storm Season Push",
        time: "34 min ago",
        sent: 15,
        status: "sent",
      },
      {
        queue: "Dental New Patient Campaign",
        time: "1h ago",
        sent: 6,
        status: "delivered",
      },
      {
        queue: "Real Estate SEO Audit Drip",
        time: "1h 22m ago",
        sent: 11,
        status: "sent",
      },
      {
        queue: "HVAC Maintenance Contract Push",
        time: "2h ago",
        sent: 9,
        status: "bounced",
      },
      {
        queue: "Plumbing Cold Outreach",
        time: "2h 40m ago",
        sent: 14,
        status: "delivered",
      },
      {
        queue: "Technology Cold Outreach",
        time: "3h ago",
        sent: 20,
        status: "sent",
      },
      {
        queue: "Med Spa Premium Sequence",
        time: "4h ago",
        sent: 5,
        status: "opened",
      },
      {
        queue: "Roofing Storm Season Push",
        time: "5h ago",
        sent: 18,
        status: "delivered",
      },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {["total", "queues", "sent", "rate", "bounces"].map((k) => (
          <Skeleton key={k} className="h-24 bg-white/5" />
        ))}
      </div>
    );
  }

  const ov = overview!;

  return (
    <div className="space-y-5" data-ocid="overview.section">
      {/* Hero stats */}
      <div
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
        data-ocid="overview.metrics_grid"
      >
        <StatCard
          label="Total Leads"
          value={ov.totalLeads.toLocaleString()}
          icon={Users}
          sub="In all queues"
        />
        <StatCard
          label="Active Queues"
          value={ov.activeQueues}
          icon={Zap}
          sub="Currently sending"
        />
        <StatCard
          label="Sent This Month"
          value={ov.totalSentThisMonth.toLocaleString()}
          icon={Mail}
          sub="↑ 12% vs last month"
        />
        <StatCard
          label="Avg Response Rate"
          value={`${ov.avgResponseRate}%`}
          icon={TrendingUp}
          sub="Across all queues"
        />
        <StatCard
          label="Pending Bounces"
          value={ov.pendingBounces}
          icon={AlertTriangle}
          sub="Require review"
          warn={ov.pendingBounces > 0}
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2" data-ocid="overview.quick_actions">
        <Button
          variant="outline"
          size="sm"
          className="border-white/15 hover:bg-white/5 gap-2"
          onClick={() => onTabChange("leads")}
          data-ocid="overview.view_bounces_button"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          View Bounces
          {(bounces?.length ?? 0) > 0 && (
            <span className="bg-amber-500/30 text-amber-300 text-xs px-1.5 py-0.5 rounded-full">
              {bounces?.length}
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-white/15 hover:bg-white/5 gap-2"
          onClick={() => onTabChange("campaigns")}
          data-ocid="overview.view_active_queues_button"
        >
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          View Active Queues
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-white/15 hover:bg-white/5 gap-2"
          onClick={() => onTabChange("campaigns")}
          data-ocid="overview.configure_throttle_button"
        >
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          Configure Throttling
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity Feed */}
        <Card
          className="lg:col-span-2 bg-[#16162a] border border-white/10"
          data-ocid="overview.activity_feed"
        >
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              Recent Send Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {recentActivity.map((ev) => (
                <div
                  key={`${ev.queue}-${ev.time}`}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {ev.queue}
                    </p>
                    <p className="text-xs text-muted-foreground">{ev.time}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {ev.sent} sent
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${
                        ev.status === "bounced"
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/25"
                          : ev.status === "opened"
                            ? "bg-purple-500/15 text-purple-300 border-purple-500/25"
                            : ev.status === "delivered"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                              : "bg-blue-500/15 text-blue-300 border-blue-500/25"
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card
          className="bg-[#16162a] border border-white/10"
          data-ocid="overview.system_health"
        >
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CircleCheck className="w-4 h-4 text-emerald-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {[
              {
                label: "SendGrid API",
                status: "green",
                detail: "Connected • 98.2% delivery",
              },
              {
                label: "Email Credentials",
                status: "green",
                detail: "SPF / DKIM verified",
              },
              {
                label: "Bounce Webhook",
                status: "green",
                detail: "Receiving events",
              },
              {
                label: "Queue Worker",
                status: "green",
                detail: "7 queues active",
              },
              {
                label: "Throttle Engine",
                status: "amber",
                detail: "Rate limited on q-007",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span
                  className={`mt-0.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                    item.status === "green"
                      ? "bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60]"
                      : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Campaigns Tab ──────────────────────────────────────────────────────────────

function CampaignsTab() {
  const { data: queues, isLoading } = useQueueStats(TENANT_ID);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [throttleModal, setThrottleModal] = useState<{
    queueId: string;
    name: string;
  } | null>(null);
  const [sortKey, setSortKey] =
    useState<keyof QueuePerformanceStat>("engagementPct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(key: keyof QueuePerformanceStat) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    if (!queues) return [];
    return [...queues].sort((a, b) => {
      const av = a[sortKey] as number;
      const bv = b[sortKey] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [queues, sortKey, sortDir]);

  function SortIcon({ k }: { k: keyof QueuePerformanceStat }) {
    if (sortKey !== k) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-primary" />
    ) : (
      <ChevronDown className="w-3 h-3 text-primary" />
    );
  }

  if (isLoading) return <Skeleton className="h-64 bg-white/5" />;

  return (
    <div className="space-y-4" data-ocid="campaigns.section">
      <div
        className="rounded-xl border border-white/10 overflow-hidden"
        data-ocid="campaigns.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 bg-[#0e0e1e] hover:bg-[#0e0e1e]">
              <TableHead className="text-xs text-muted-foreground font-medium w-8" />
              <TableHead className="text-xs text-muted-foreground font-medium">
                Campaign
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Niche
              </TableHead>
              {(
                [
                  "totalLeads",
                  "sent",
                  "bounced",
                  "responded",
                  "engagementPct",
                ] as const
              ).map((k) => (
                <TableHead
                  key={k}
                  className="text-xs text-muted-foreground font-medium text-right cursor-pointer hover:text-foreground select-none"
                  onClick={() => toggleSort(k)}
                  data-ocid={`campaigns.sort_${k}`}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    {
                      {
                        totalLeads: "Leads",
                        sent: "Sent",
                        bounced: "Bounced",
                        responded: "Replied",
                        engagementPct: "Engage %",
                      }[k]
                    }
                    <SortIcon k={k} />
                  </span>
                </TableHead>
              ))}
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((q, i) => {
              const isExpanded = expandedRow === q.queueId;
              const cfg = demoThrottleConfigs[q.queueId];
              const progress =
                q.totalLeads > 0
                  ? Math.round((q.sent / q.totalLeads) * 100)
                  : 0;
              const intervalLabel = cfg
                ? [300, 600, 900, 1800, 3600].includes(cfg.intervalSeconds)
                  ? ["5 min", "10 min", "15 min", "30 min", "60 min"][
                      [300, 600, 900, 1800, 3600].indexOf(cfg.intervalSeconds)
                    ]
                  : `${cfg.intervalSeconds}s`
                : "—";

              return (
                <>
                  <TableRow
                    key={q.queueId}
                    className="border-white/8 hover:bg-white/[0.03] cursor-pointer"
                    data-ocid={`campaigns.item.${i + 1}`}
                    onClick={() =>
                      setExpandedRow(isExpanded ? null : q.queueId)
                    }
                  >
                    <TableCell className="py-3">
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-sm font-medium text-foreground">
                        {q.name}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <NicheBadge niche={q.niche} />
                    </TableCell>
                    <TableCell className="py-3 text-right text-sm tabular-nums">
                      {q.totalLeads.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3 text-right text-sm tabular-nums">
                      {q.sent.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-3 text-right text-sm tabular-nums text-rose-400">
                      {q.bounced}
                    </TableCell>
                    <TableCell className="py-3 text-right text-sm tabular-nums text-emerald-400">
                      {q.responded}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <span
                        className={`text-sm font-semibold tabular-nums ${q.engagementPct >= 15 ? "text-emerald-400" : q.engagementPct >= 8 ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {q.engagementPct}%
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div
                        role="presentation"
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs hover:bg-white/10"
                          data-ocid={`campaigns.configure_throttle_button.${i + 1}`}
                          onClick={() =>
                            setThrottleModal({
                              queueId: q.queueId,
                              name: q.name,
                            })
                          }
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs hover:bg-white/10"
                          data-ocid={`campaigns.pause_button.${i + 1}`}
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow
                      key={`${q.queueId}-expand`}
                      className="border-white/8 bg-[#0e0e1e]/60"
                    >
                      <TableCell colSpan={9} className="py-4 px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {cfg && (
                            <div className="space-y-1.5">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Throttle Config
                              </p>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Daily Cap
                                  </span>
                                  <span className="font-medium">
                                    {cfg.dailyCap}/day
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Interval
                                  </span>
                                  <span className="font-medium">
                                    {intervalLabel}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Stagger
                                  </span>
                                  <span
                                    className={
                                      cfg.staggerEnabled
                                        ? "text-emerald-400 font-medium"
                                        : "text-muted-foreground"
                                    }
                                  >
                                    {cfg.staggerEnabled
                                      ? "Enabled"
                                      : "Disabled"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="md:col-span-2 space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Send Progress
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold tabular-nums w-10 text-right">
                                {progress}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {q.sent.toLocaleString()} of{" "}
                              {q.totalLeads.toLocaleString()} leads reached
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {throttleModal && (
        <ThrottleModal
          open={!!throttleModal}
          queueId={throttleModal.queueId}
          queueName={throttleModal.name}
          onClose={() => setThrottleModal(null)}
        />
      )}
    </div>
  );
}

// ── Leads Tab ──────────────────────────────────────────────────────────────────

function LeadsTab() {
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [bounceFilter, setBounceFilter] = useState("all");
  const [engageFilter, setEngageFilter] = useState("all");
  const [segPanelOpen, setSegPanelOpen] = useState(false);
  const [segNiche, setSegNiche] = useState("all");
  const [assignQueue, setAssignQueue] = useState("");

  const niches = useMemo(
    () => Array.from(new Set(DEMO_LEADS.map((l) => l.niche))),
    [],
  );

  const filtered = useMemo(
    () =>
      DEMO_LEADS.filter((l) => {
        if (search && !l.email.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (nicheFilter !== "all" && l.niche !== nicheFilter) return false;
        if (bounceFilter !== "all" && l.bounceStatus !== bounceFilter)
          return false;
        if (engageFilter !== "all" && l.engagement !== engageFilter)
          return false;
        return true;
      }),
    [search, nicheFilter, bounceFilter, engageFilter],
  );

  const segCount = useMemo(
    () =>
      DEMO_LEADS.filter((l) => segNiche === "all" || l.niche === segNiche)
        .length,
    [segNiche],
  );

  return (
    <div className="space-y-4" data-ocid="leads.section">
      {/* Filters bar */}
      <div
        className="flex flex-wrap items-center gap-2"
        data-ocid="leads.filters"
      >
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 bg-[#0e0e1a] border-white/15 text-sm"
            data-ocid="leads.search_input"
          />
        </div>

        <Select value={nicheFilter} onValueChange={setNicheFilter}>
          <SelectTrigger
            className="h-8 w-36 bg-[#0e0e1a] border-white/15 text-xs"
            data-ocid="leads.niche_select"
          >
            <SelectValue placeholder="All niches" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/15">
            <SelectItem value="all">All niches</SelectItem>
            {niches.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={bounceFilter} onValueChange={setBounceFilter}>
          <SelectTrigger
            className="h-8 w-36 bg-[#0e0e1a] border-white/15 text-xs"
            data-ocid="leads.bounce_select"
          >
            <SelectValue placeholder="Bounce status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/15">
            <SelectItem value="all">All bounce statuses</SelectItem>
            <SelectItem value="ok">OK</SelectItem>
            <SelectItem value="soft">Soft bounce</SelectItem>
            <SelectItem value="hard">Hard bounce</SelectItem>
          </SelectContent>
        </Select>

        <Select value={engageFilter} onValueChange={setEngageFilter}>
          <SelectTrigger
            className="h-8 w-36 bg-[#0e0e1a] border-white/15 text-xs"
            data-ocid="leads.engagement_select"
          >
            <SelectValue placeholder="Engagement" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-white/15">
            <SelectItem value="all">All engagement</SelectItem>
            <SelectItem value="no-open">No Open</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
            <SelectItem value="clicked">Clicked</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="h-8 border-white/15 hover:bg-white/5 gap-1.5 text-xs"
          onClick={() => setSegPanelOpen((v) => !v)}
          data-ocid="leads.segmentation_toggle"
        >
          <Filter className="w-3 h-3" />
          Segmentation
        </Button>
      </div>

      {/* Segmentation Panel */}
      {segPanelOpen && (
        <Card
          className="bg-[#16162a] border border-purple-500/25"
          data-ocid="leads.segmentation_panel"
        >
          <CardContent className="p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-40">
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Filter by Niche
                </Label>
                <Select value={segNiche} onValueChange={setSegNiche}>
                  <SelectTrigger className="h-8 bg-[#0e0e1a] border-white/15 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/15">
                    <SelectItem value="all">All niches</SelectItem>
                    {niches.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-40">
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  Assign to Queue
                </Label>
                <Select value={assignQueue} onValueChange={setAssignQueue}>
                  <SelectTrigger
                    className="h-8 bg-[#0e0e1a] border-white/15 text-xs"
                    data-ocid="leads.assign_queue_select"
                  >
                    <SelectValue placeholder="Select queue…" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-white/15">
                    {demoQueueStats.map((q) => (
                      <SelectItem key={q.queueId} value={q.queueId}>
                        {q.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  <strong className="text-foreground">{segCount}</strong> leads
                  match
                </span>
                <Button
                  size="sm"
                  className="h-8 bg-primary hover:bg-primary/90 text-xs"
                  disabled={!assignQueue}
                  data-ocid="leads.assign_button"
                >
                  Assign to Queue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leads Table */}
      <div
        className="rounded-xl border border-white/10 overflow-hidden"
        data-ocid="leads.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 bg-[#0e0e1e] hover:bg-[#0e0e1e]">
              <TableHead className="text-xs text-muted-foreground font-medium">
                Email
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Niche
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Queue
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Bounce
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Last Contact
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">
                Engagement
              </TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground text-sm"
                  data-ocid="leads.empty_state"
                >
                  No leads match your filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((lead, i) => (
              <TableRow
                key={lead.id}
                className="border-white/8 hover:bg-white/[0.03]"
                data-ocid={`leads.item.${i + 1}`}
              >
                <TableCell className="py-3 text-sm font-mono text-foreground/90">
                  {lead.email}
                </TableCell>
                <TableCell className="py-3">
                  <NicheBadge niche={lead.niche} />
                </TableCell>
                <TableCell className="py-3 text-xs text-muted-foreground max-w-[160px] truncate">
                  {lead.queue}
                </TableCell>
                <TableCell className="py-3">
                  <BounceBadge type={lead.bounceStatus} />
                </TableCell>
                <TableCell className="py-3 text-xs text-muted-foreground tabular-nums">
                  {lead.lastContact}
                </TableCell>
                <TableCell className="py-3">
                  <EngagementBadge status={lead.engagement} />
                </TableCell>
                <TableCell className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {lead.bounceStatus === "soft" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-amber-400 hover:bg-amber-500/10"
                        data-ocid={`leads.requeue_button.${i + 1}`}
                      >
                        Re-queue
                      </Button>
                    )}
                    {lead.bounceStatus === "hard" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-rose-400 hover:bg-rose-500/10"
                        data-ocid={`leads.delete_button.${i + 1}`}
                      >
                        Remove
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs hover:bg-white/10"
                      data-ocid={`leads.view_details_button.${i + 1}`}
                    >
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {DEMO_LEADS.length} leads
      </p>
    </div>
  );
}

// ── Engagement Tab ─────────────────────────────────────────────────────────────

function EngagementTab() {
  const maxCount = demoEngagementFunnel[0].count;

  return (
    <div className="space-y-5" data-ocid="engagement.section">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Funnel visualization */}
        <Card
          className="lg:col-span-3 bg-[#16162a] border border-white/10"
          data-ocid="engagement.funnel"
        >
          <CardHeader className="pb-3 px-5 pt-5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              {demoEngagementFunnel.map((stage: FunnelStage, i: number) => {
                const barPct = (stage.count / maxCount) * 100;
                const isTop = i === 0;
                return (
                  <div
                    key={stage.stage}
                    className="flex items-center gap-3"
                    data-ocid={`engagement.funnel_stage.${i + 1}`}
                  >
                    <div className="w-28 text-xs text-muted-foreground text-right shrink-0">
                      {stage.stage}
                    </div>
                    <div className="flex-1 h-7 bg-white/5 rounded-md overflow-hidden relative">
                      <div
                        className="h-full rounded-md transition-all duration-700"
                        style={{
                          width: `${barPct}%`,
                          background: isTop
                            ? "linear-gradient(to right, oklch(0.38 0.14 290), oklch(0.48 0.18 290))"
                            : i < 4
                              ? "linear-gradient(to right, oklch(0.52 0.22 290), oklch(0.62 0.18 290))"
                              : "linear-gradient(to right, oklch(0.58 0.22 290), oklch(0.62 0.18 155))",
                        }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/80 tabular-nums">
                        {stage.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-14 text-xs font-semibold text-right tabular-nums text-primary">
                      {stage.pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Reply Breakdown + Top Queues */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            className="bg-[#16162a] border border-white/10"
            data-ocid="engagement.reply_breakdown"
          >
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-semibold">
                Reply Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {REPLY_BREAKDOWN.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between"
                >
                  <span className={`text-sm font-medium ${r.color}`}>
                    {r.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-28 h-2 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${r.color.replace("text-", "bg-").replace("-400", "-500")}`}
                        style={{ width: `${(r.count / 248) * 100}%` }}
                      />
                    </div>
                    <span
                      className={`w-8 text-right text-sm font-bold tabular-nums ${r.color}`}
                    >
                      {r.count}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded border text-xs ${r.bg}`}
                    >
                      {Math.round((r.count / 248) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card
            className="bg-[#16162a] border border-white/10"
            data-ocid="engagement.cost_per_lead"
          >
            <CardContent className="px-4 py-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/15">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Cost per Qualified Lead
                </p>
                <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                  $4.12
                </p>
                <p className="text-xs text-muted-foreground">
                  ↓ 18% vs last month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top performing queues */}
      <Card
        className="bg-[#16162a] border border-white/10"
        data-ocid="engagement.top_queues"
      >
        <CardHeader className="pb-3 px-5 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Top Queues by Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="space-y-3">
            {demoQueueStats
              .slice()
              .sort((a, b) => b.engagementPct - a.engagementPct)
              .slice(0, 5)
              .map((q, i) => (
                <div
                  key={q.queueId}
                  className="flex items-center gap-3"
                  data-ocid={`engagement.top_queue.${i + 1}`}
                >
                  <span className="w-5 text-xs text-muted-foreground tabular-nums text-right">
                    {i + 1}.
                  </span>
                  <span className="flex-1 text-sm font-medium truncate">
                    {q.name}
                  </span>
                  <NicheBadge niche={q.niche} />
                  <div className="w-32 h-2 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-emerald-500"
                      style={{ width: `${(q.engagementPct / 20) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-bold tabular-nums text-primary">
                    {q.engagementPct}%
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Bounce Records Panel (used in Overview > Leads) ───────────────────────────

function BounceRecordRow({
  record,
  index,
}: { record: OutreachBounceRecord; index: number }) {
  const queue = demoQueueStats.find((q) => q.queueId === record.queueId);
  return (
    <div
      className="flex items-start justify-between py-2 border-b border-white/5 last:border-0"
      data-ocid={`bounces.item.${index + 1}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-mono text-foreground/90 truncate">
            {record.leadId}
          </span>
          <BounceBadge type={record.bounceType} />
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {record.reason}
        </p>
      </div>
      <div className="text-right ml-3 shrink-0">
        <p className="text-xs text-muted-foreground">
          {queue?.name ?? record.queueId}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(record.bouncedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function OutreachAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const p = new URLSearchParams(window.location.search).get("tab");
    return (TABS as readonly string[]).includes(p ?? "")
      ? (p as Tab)
      : "overview";
  });

  const { data: bounces } = useAllBounceRecords(TENANT_ID);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", activeTab);
    window.history.replaceState({}, "", url.toString());
  }, [activeTab]);

  const tabLabels: Record<Tab, string> = {
    overview: "Overview",
    campaigns: "Campaigns",
    leads: "Leads",
    engagement: "Engagement",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page header */}
      <div
        className="bg-card border-b border-border px-6 py-4"
        data-ocid="outreach_analytics.page"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Outreach Analytics
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monitor queues, track engagement, and manage deliverability
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(bounces?.length ?? 0) > 0 && (
              <Badge
                variant="outline"
                className="border-amber-500/40 text-amber-400 bg-amber-500/10 gap-1.5 py-1"
                data-ocid="outreach_analytics.bounce_warning"
              >
                <AlertTriangle className="w-3 h-3" />
                {bounces?.length} bounces pending
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 hover:bg-white/5 gap-2"
              data-ocid="outreach_analytics.refresh_button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div
        className="bg-card border-b border-border px-6"
        data-ocid="outreach_analytics.tabs"
      >
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              data-ocid={`outreach_analytics.${tab}_tab`}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-white/20"
              }`}
            >
              {tabLabels[tab]}
              {tab === "leads" &&
                bounces &&
                bounces.filter((b) => b.bounceType === "hard" && !b.requeued)
                  .length > 0 && (
                  <span className="ml-2 bg-rose-500/30 text-rose-300 text-xs px-1.5 py-0.5 rounded-full">
                    {
                      bounces.filter(
                        (b) => b.bounceType === "hard" && !b.requeued,
                      ).length
                    }
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-5">
        {activeTab === "overview" && <OverviewTab onTabChange={setActiveTab} />}
        {activeTab === "campaigns" && <CampaignsTab />}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <LeadsTab />
            <div data-ocid="leads.bounce_records">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Recent Bounce Records
              </h3>
              <Card className="bg-[#16162a] border border-white/10">
                <CardContent className="px-4 py-3">
                  {bounces?.map((b, i) => (
                    <BounceRecordRow key={b.leadId} record={b} index={i} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {activeTab === "engagement" && <EngagementTab />}
      </div>
    </div>
  );
}
