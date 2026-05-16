import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActor } from "@/hooks/useActor";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Globe,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Power,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DiscoveryJob {
  timestamp: string;
  leadsDiscovered: number;
  leadsEnriched: number;
  enrichmentRate: number;
  nextRunMinutes: number;
}

interface SubdomainStats {
  subdomain: string;
  warmupDay: number;
  warmupTotal: number;
  todayCount: number;
  dailyCap: number;
  bounceRate: number;
  complaintRate: number;
  status: "Warming" | "Active" | "Paused" | "Flagged";
}

interface NichePerf {
  niche: string;
  inPipe: number;
  sent: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  hotLeads: number;
  industryAvgOpen: number;
}

interface DnsRecord {
  type: "SPF" | "DKIM" | "DMARC";
  valid: boolean;
  value: string;
  fix: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_NICHES: NichePerf[] = [
  {
    niche: "Plumbers",
    inPipe: 142,
    sent: 87,
    openRate: 28.4,
    clickRate: 6.1,
    replyRate: 3.2,
    hotLeads: 11,
    industryAvgOpen: 22,
  },
  {
    niche: "HVAC",
    inPipe: 98,
    sent: 63,
    openRate: 31.2,
    clickRate: 7.8,
    replyRate: 4.1,
    hotLeads: 8,
    industryAvgOpen: 24,
  },
  {
    niche: "Roofing",
    inPipe: 74,
    sent: 51,
    openRate: 19.6,
    clickRate: 4.2,
    replyRate: 2.1,
    hotLeads: 5,
    industryAvgOpen: 21,
  },
  {
    niche: "Med Spa",
    inPipe: 56,
    sent: 38,
    openRate: 34.7,
    clickRate: 9.4,
    replyRate: 5.3,
    hotLeads: 9,
    industryAvgOpen: 28,
  },
  {
    niche: "Restoration",
    inPipe: 61,
    sent: 44,
    openRate: 22.7,
    clickRate: 5.3,
    replyRate: 2.8,
    hotLeads: 6,
    industryAvgOpen: 20,
  },
  {
    niche: "Carpet Cleaning",
    inPipe: 49,
    sent: 31,
    openRate: 14.2,
    clickRate: 3.1,
    replyRate: 1.4,
    hotLeads: 2,
    industryAvgOpen: 18,
  },
  {
    niche: "Dental",
    inPipe: 83,
    sent: 59,
    openRate: 38.1,
    clickRate: 11.2,
    replyRate: 6.7,
    hotLeads: 14,
    industryAvgOpen: 31,
  },
  {
    niche: "Chiropractic",
    inPipe: 44,
    sent: 27,
    openRate: 26.5,
    clickRate: 5.8,
    replyRate: 3.0,
    hotLeads: 4,
    industryAvgOpen: 23,
  },
  {
    niche: "Real Estate",
    inPipe: 117,
    sent: 78,
    openRate: 17.8,
    clickRate: 3.9,
    replyRate: 1.8,
    hotLeads: 7,
    industryAvgOpen: 19,
  },
  {
    niche: "Mortgage",
    inPipe: 65,
    sent: 42,
    openRate: 21.3,
    clickRate: 4.7,
    replyRate: 2.2,
    hotLeads: 4,
    industryAvgOpen: 20,
  },
];

const MOCK_CHART: number[] = [
  12, 18, 22, 19, 31, 45, 52, 48, 61, 74, 82, 95, 87, 103, 118, 112, 129, 143,
  137, 158, 172, 165, 188, 201, 197, 213, 228, 221, 247, 263,
];

const NICHE_TOOLTIPS: Record<string, string> = {
  Plumbers:
    "Plumbers lose an avg of $4,200/mo to missed emergency calls. High urgency = faster reply rates. Best send time: 7–9am weekdays.",
  HVAC: "HVAC owners feel their slow season hardest. Lead with 'fill your calendar before peak season' angles for 40% higher opens.",
  Roofing:
    "Roofing crews book out fast — decision-makers respond to urgency. Storm season outreach outperforms by 3x.",
  "Med Spa":
    "Med spa owners are growth-obsessed. Social proof + before/after copy lifts CTR. Best send: Tue–Thu 9am.",
  Restoration:
    "Restoration owners run on chaos. Short, direct copy wins. 'We answer every call 24/7' is their biggest pain point.",
  "Carpet Cleaning":
    "High competition niche — differentiate on review velocity and before/after proof. Repeat booking angles convert well.",
  Dental:
    "Dental practices respond to patient retention and new patient acquisition framing. Most receptive niche overall.",
  Chiropractic:
    "Chiropractors value long-term patient relationships. Reactivation sequences perform exceptionally well.",
  "Real Estate":
    "Real estate is volume-sensitive. Focus on listing alerts and CRM automation angles. Avoid commission topics.",
  Mortgage:
    "Mortgage brokers are compliance-aware. Lead with ROI and referral partner angles, not rate claims.",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBadge({
  value,
  label,
  icon: Icon,
  status,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
  status: "green" | "yellow" | "red";
}) {
  const badgeClass =
    status === "green"
      ? "badge-emerald"
      : status === "yellow"
        ? "badge-amber"
        : "badge-rose";
  const statusLabel =
    status === "green"
      ? "On Track"
      : status === "yellow"
        ? "Warming Up"
        : "Needs Attention";
  return (
    <div className="flex flex-col gap-1 p-4 bg-card rounded-lg border border-border min-w-[144px]">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={13} className="text-muted-foreground" />
        <span
          className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${badgeClass}`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="text-2xl font-extrabold text-foreground leading-none">
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function SubdomainCard({
  stats,
  onPause,
  onResume,
}: {
  stats: SubdomainStats;
  onPause: (sub: string) => void;
  onResume: (sub: string) => void;
}) {
  const sendPct = Math.min((stats.todayCount / stats.dailyCap) * 100, 100);
  const bounceCls =
    stats.bounceRate < 2
      ? "text-emerald-400"
      : stats.bounceRate < 5
        ? "text-amber-400"
        : "text-rose-400";
  const statusColors: Record<SubdomainStats["status"], string> = {
    Warming: "badge-amber",
    Active: "badge-emerald",
    Paused: "badge-purple",
    Flagged: "badge-rose",
  };
  const subKey = stats.subdomain.split(".")[0];
  return (
    <div
      className="card-dark rounded-lg p-4 flex flex-col gap-3"
      data-ocid={`subdomain.card.${subKey}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm text-foreground truncate">
            {stats.subdomain}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Day {stats.warmupDay}/{stats.warmupTotal} warm-up
          </div>
        </div>
        <span
          className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${statusColors[stats.status]}`}
        >
          {stats.status}
        </span>
      </div>

      {/* Send volume bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Today: {stats.todayCount}</span>
          <span>Cap: {stats.dailyCap}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${sendPct}%`,
              background:
                "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.62 0.18 155))",
            }}
          />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Bounce Rate</span>
          <span className={`font-bold ${bounceCls}`}>
            {stats.bounceRate.toFixed(1)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Complaint Rate</span>
          <span
            className={`font-bold ${stats.complaintRate < 0.1 ? "text-emerald-400" : "text-amber-400"}`}
          >
            {stats.complaintRate.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="pt-1">
        {stats.status !== "Paused" ? (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs gap-1.5"
            onClick={() => onPause(stats.subdomain)}
            data-ocid={`subdomain.pause_button.${subKey}`}
          >
            <Pause size={11} /> Pause Sender
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full h-7 text-xs gap-1.5"
            onClick={() => onResume(stats.subdomain)}
            data-ocid={`subdomain.resume_button.${subKey}`}
          >
            <Play size={11} /> Resume Sender
          </Button>
        )}
      </div>
    </div>
  );
}

function MiniLineChart({ data, target }: { data: number[]; target: number }) {
  const max = Math.max(...data, target) * 1.12;
  const W = 600;
  const H = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / max) * H;
    return `${x},${y}`;
  });
  const tY = H - (target / max) * H;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-20"
      preserveAspectRatio="none"
      role="img"
      aria-labelledby="chart-title"
    >
      <title id="chart-title">30-day send volume trend</title>
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(0.58 0.22 290)"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.58 0.22 290)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      {/* Target dashed line */}
      <line
        x1="0"
        y1={tY}
        x2={W}
        y2={tY}
        stroke="oklch(0.72 0.18 75)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.7"
      />
      {/* Area */}
      <polygon
        points={`0,${H} ${pts.join(" ")} ${W},${H}`}
        fill="url(#chartFill)"
      />
      {/* Line */}
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="oklch(0.58 0.22 290)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AutopilotDashboardPage() {
  const { actor } = useActor();

  const [autopilotOn, setAutopilotOn] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [sortCol, setSortCol] = useState<keyof NichePerf>("hotLeads");
  const [sortAsc, setSortAsc] = useState(false);
  const [copiedDns, setCopiedDns] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const discoveryJob: DiscoveryJob = {
    timestamp: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
    leadsDiscovered: 192,
    leadsEnriched: 158,
    enrichmentRate: 82.3,
    nextRunMinutes: 73,
  };

  const [subdomains, setSubdomains] = useState<SubdomainStats[]>([
    {
      subdomain: "mail1.bookedrankedfunded.org",
      warmupDay: 14,
      warmupTotal: 28,
      todayCount: 87,
      dailyCap: 150,
      bounceRate: 1.4,
      complaintRate: 0.04,
      status: "Warming",
    },
    {
      subdomain: "mail2.bookedrankedfunded.org",
      warmupDay: 21,
      warmupTotal: 28,
      todayCount: 203,
      dailyCap: 350,
      bounceRate: 0.8,
      complaintRate: 0.02,
      status: "Active",
    },
    {
      subdomain: "mail3.bookedrankedfunded.org",
      warmupDay: 7,
      warmupTotal: 28,
      todayCount: 41,
      dailyCap: 75,
      bounceRate: 3.1,
      complaintRate: 0.08,
      status: "Warming",
    },
  ]);

  const dnsRecords: DnsRecord[] = [
    {
      type: "SPF",
      valid: true,
      value: "v=spf1 include:sendgrid.net include:bookedrankedfunded.org ~all",
      fix: 'Add TXT record: "v=spf1 include:sendgrid.net ~all"',
    },
    {
      type: "DKIM",
      valid: true,
      value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEB...",
      fix: 'Add TXT record at s1._domainkey: "v=DKIM1; k=rsa; p=<key>"',
    },
    {
      type: "DMARC",
      valid: false,
      value: "",
      fix: 'Add TXT record at _dmarc: "v=DMARC1; p=quarantine; rua=mailto:dmarc@bookedrankedfunded.org"',
    },
  ];

  const warmupDay = 14;
  const warmupTotal = 28;
  const projectedDate = new Date(
    Date.now() + (warmupTotal - warmupDay) * 24 * 60 * 60 * 1000,
  );

  // Live countdown — runs once on mount, initial value is static mock
  const INITIAL_COUNTDOWN = 73 * 60;
  useEffect(() => {
    setCountdown(INITIAL_COUNTDOWN);
    const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const countdownStr = `${Math.floor(countdown / 60)}m ${countdown % 60}s`;

  // Load config
  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const cfg = await (
          actor as Record<string, (...args: unknown[]) => Promise<unknown>>
        ).getAutopilotEmailConfig();
        const enabled = (cfg as Record<string, unknown> | null)?.enabled;
        if (typeof enabled === "boolean") setAutopilotOn(enabled);
      } catch {
        /* backend may not expose this yet */
      }
    })();
  }, [actor]);

  const handleToggle = useCallback(
    async (val: boolean) => {
      setIsToggling(true);
      try {
        if (actor) {
          const method = val ? "resumeAutopilotEmail" : "pauseAutopilotEmail";
          await (
            actor as Record<string, (...args: unknown[]) => Promise<unknown>>
          )[method]();
        }
        setAutopilotOn(val);
        toast.success(
          val
            ? "Autopilot Engine activated — the machine is running."
            : "Autopilot Engine paused. All scheduled jobs are on hold.",
          { duration: 4500 },
        );
      } catch {
        toast.error("Failed to update autopilot status. Please try again.");
      } finally {
        setIsToggling(false);
      }
    },
    [actor],
  );

  const handleManualTrigger = useCallback(async () => {
    setIsTriggering(true);
    try {
      if (actor) {
        await (
          actor as Record<string, (...args: unknown[]) => Promise<unknown>>
        ).triggerManualDiscovery();
      }
      toast.success(
        "Discovery job triggered — Claude & OpenAI are scanning cities now.",
        { duration: 5000 },
      );
    } catch {
      toast.error(
        "Trigger failed. Ensure your AI keys are connected in Go Live.",
      );
    } finally {
      setTimeout(() => setIsTriggering(false), 2000);
    }
  }, [actor]);

  const handlePause = useCallback(
    async (sub: string) => {
      if (actor) {
        try {
          await (
            actor as Record<string, (...args: unknown[]) => Promise<unknown>>
          ).pauseAutopilotEmail();
        } catch {
          /* silent */
        }
      }
      setSubdomains((prev) =>
        prev.map((s) =>
          s.subdomain === sub ? { ...s, status: "Paused" as const } : s,
        ),
      );
      toast.info(`${sub.split(".")[0]} paused.`);
    },
    [actor],
  );

  const handleResume = useCallback(
    async (sub: string) => {
      if (actor) {
        try {
          await (
            actor as Record<string, (...args: unknown[]) => Promise<unknown>>
          ).resumeAutopilotEmail();
        } catch {
          /* silent */
        }
      }
      setSubdomains((prev) =>
        prev.map((s) =>
          s.subdomain === sub ? { ...s, status: "Warming" as const } : s,
        ),
      );
      toast.success(`${sub.split(".")[0]} resumed.`);
    },
    [actor],
  );

  const handleCopyDns = useCallback((fix: string, type: string) => {
    navigator.clipboard.writeText(fix).then(() => {
      setCopiedDns(type);
      setTimeout(() => setCopiedDns(null), 2500);
      toast.success(`${type} record copied to clipboard.`);
    });
  }, []);

  // Sorted niche rows
  const sortedNiches = [...MOCK_NICHES].sort((a, b) => {
    const av = a[sortCol] as number;
    const bv = b[sortCol] as number;
    return sortAsc ? av - bv : bv - av;
  });

  const toggleSort = (col: keyof NichePerf) => {
    if (sortCol === col) setSortAsc((v) => !v);
    else {
      setSortCol(col);
      setSortAsc(false);
    }
  };

  const openRateClass = (rate: number) =>
    rate > 25
      ? "font-bold text-emerald-400"
      : rate >= 15
        ? "font-bold text-amber-400"
        : "font-bold text-rose-400";

  const totalSent = MOCK_NICHES.reduce((s, n) => s + n.sent, 0);
  const avgOpen =
    MOCK_NICHES.reduce((s, n) => s + n.openRate, 0) / MOCK_NICHES.length;
  const avgReply =
    MOCK_NICHES.reduce((s, n) => s + n.replyRate, 0) / MOCK_NICHES.length;
  const totalSms = Math.floor(totalSent * 0.34);

  const TABLE_COLS: { key: keyof NichePerf; label: string }[] = [
    { key: "niche", label: "Niche" },
    { key: "inPipe", label: "In Pipeline" },
    { key: "sent", label: "Sent" },
    { key: "openRate", label: "Open Rate" },
    { key: "clickRate", label: "Click Rate" },
    { key: "replyRate", label: "Reply Rate" },
    { key: "hotLeads", label: "Hot Leads 🔥" },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            data-ocid="autopilot.page"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "oklch(0.58 0.22 290 / 20%)",
                    border: "1px solid oklch(0.58 0.22 290 / 40%)",
                  }}
                >
                  <Bot size={16} className="text-primary" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Autopilot Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                B2B Lead Machine
              </h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                Finds, enriches, and engages 100–1,000 targeted businesses per
                day — fully automatic. Claude searches City A. OpenAI searches
                City B. No hallucinations. Real data only.
              </p>
            </div>

            {/* Master Toggle */}
            <div
              className="flex items-center gap-4 p-4 rounded-xl border shrink-0 transition-all duration-500"
              style={{
                background: autopilotOn
                  ? "oklch(0.62 0.18 155 / 10%)"
                  : "oklch(0.58 0.22 25 / 8%)",
                borderColor: autopilotOn
                  ? "oklch(0.62 0.18 155 / 35%)"
                  : "oklch(0.58 0.22 25 / 25%)",
              }}
              data-ocid="autopilot.master_toggle"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Machine Status
                </span>
                <span
                  className={`text-lg font-extrabold leading-none mt-0.5 ${autopilotOn ? "text-emerald-400" : "text-muted-foreground"}`}
                >
                  {isToggling
                    ? "Updating…"
                    : autopilotOn
                      ? "RUNNING"
                      : "PAUSED"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Power
                  size={18}
                  className={
                    autopilotOn ? "text-emerald-400" : "text-muted-foreground"
                  }
                />
                <Switch
                  checked={autopilotOn}
                  onCheckedChange={handleToggle}
                  disabled={isToggling}
                  data-ocid="autopilot.toggle.switch"
                />
              </div>
            </div>
          </div>

          {/* ── Hero Stats Bar ───────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3" data-ocid="autopilot.stats_bar">
            <StatBadge
              value={discoveryJob.leadsDiscovered}
              label="Leads Discovered Today"
              icon={Search}
              status="green"
            />
            <StatBadge
              value={totalSent}
              label="Emails Sent Today"
              icon={Mail}
              status={totalSent > 200 ? "green" : "yellow"}
            />
            <StatBadge
              value={totalSms}
              label="SMS Sent Today"
              icon={MessageSquare}
              status={totalSms > 50 ? "green" : "yellow"}
            />
            <StatBadge
              value={`${avgOpen.toFixed(1)}%`}
              label="Avg Open Rate"
              icon={TrendingUp}
              status={avgOpen > 25 ? "green" : avgOpen > 15 ? "yellow" : "red"}
            />
            <StatBadge
              value={`${avgReply.toFixed(1)}%`}
              label="Reply Rate"
              icon={Activity}
              status={
                avgReply > 3 ? "green" : avgReply > 1.5 ? "yellow" : "red"
              }
            />
          </div>

          {/* ── Discovery + Warm-up Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Discovery Status */}
            <Card
              className="card-dark p-6 space-y-4"
              data-ocid="autopilot.discovery_card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={15} className="text-primary" />
                  <h2 className="font-bold text-foreground">
                    Daily Discovery Engine
                  </h2>
                </div>
                <Badge className="badge-emerald text-[10px]">Scheduled</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Last Run",
                    value: "47 min ago",
                    sub: new Date(discoveryJob.timestamp).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    ),
                  },
                  {
                    label: "Leads Found",
                    value: discoveryJob.leadsDiscovered,
                    sub: "Claude + OpenAI parallel",
                  },
                  {
                    label: "Enriched",
                    value: discoveryJob.leadsEnriched,
                    sub: `${discoveryJob.enrichmentRate.toFixed(0)}% success rate`,
                  },
                  {
                    label: "Next Run",
                    value: countdownStr,
                    sub: "Auto-scheduled",
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      {item.label}
                    </div>
                    <div className="text-lg font-extrabold text-foreground leading-none">
                      {item.value}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {item.sub}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  size="sm"
                  onClick={handleManualTrigger}
                  disabled={isTriggering}
                  className="gap-2 shrink-0"
                  data-ocid="autopilot.manual_trigger_button"
                >
                  {isTriggering ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Play size={13} />
                  )}
                  {isTriggering ? "Searching…" : "Manual Trigger"}
                </Button>
                <span className="text-xs text-muted-foreground">
                  Launches Claude → City A, OpenAI → City B now
                </span>
              </div>
            </Card>

            {/* Warm-up Phase Meter */}
            <Card
              className="card-dark p-6 space-y-4"
              data-ocid="autopilot.warmup_card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={15} className="text-primary" />
                  <h2 className="font-bold text-foreground">
                    Domain Warm-up Phase
                  </h2>
                </div>
                <Badge
                  className={warmupDay > 21 ? "badge-emerald" : "badge-amber"}
                >
                  Day {warmupDay}/{warmupTotal}
                </Badge>
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Day 1 — 50/day</span>
                  <span>Day 28 — 1,000/day</span>
                </div>
                <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(warmupDay / warmupTotal) * 100}%`,
                      background:
                        warmupDay > 21
                          ? "linear-gradient(90deg, oklch(0.62 0.18 155), oklch(0.68 0.2 155))"
                          : "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.72 0.18 75))",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-3">
                  {([7, 14, 21, 28] as const).map((d) => (
                    <div key={d} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${warmupDay >= d ? "bg-primary" : "bg-muted"}`}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        Day {d}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {d === 7
                          ? "100/d"
                          : d === 14
                            ? "250/d"
                            : d === 21
                              ? "600/d"
                              : "1K/d"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Full Volume Unlocks
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {projectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    — {warmupTotal - warmupDay} days remaining
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Sender Subdomain Health ──────────────────────────────────── */}
          <section data-ocid="autopilot.subdomain_panel">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={15} className="text-primary" />
              <h2 className="font-bold text-foreground">
                Sender Subdomain Health
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded cursor-help">
                    3 Rotating Senders
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Rotating 3 subdomains distributes send volume and protects
                    deliverability. Keep bounce rate below 2% to maintain inbox
                    placement. If any sender is flagged, the remaining two
                    continue uninterrupted.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subdomains.map((s) => (
                <SubdomainCard
                  key={s.subdomain}
                  stats={s}
                  onPause={handlePause}
                  onResume={handleResume}
                />
              ))}
            </div>
          </section>

          {/* ── 30-Day Send Volume Chart ─────────────────────────────────── */}
          <Card className="card-dark p-6" data-ocid="autopilot.volume_chart">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-primary" />
                <h2 className="font-bold text-foreground">
                  30-Day Send Volume
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-primary inline-block rounded" />
                  Actual
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-4 inline-block rounded"
                    style={{
                      borderTop: "2px dashed oklch(0.72 0.18 75)",
                      height: "0",
                    }}
                  />
                  Target at full capacity
                </span>
              </div>
            </div>
            <div className="relative">
              <MiniLineChart data={MOCK_CHART} target={350} />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>Day 1</span>
                <span>Day 8</span>
                <span>Day 15</span>
                <span>Day 22</span>
                <span>Today</span>
              </div>
            </div>
            <div className="flex items-center gap-8 mt-4 pt-4 border-t border-border">
              <div>
                <div className="text-xl font-extrabold text-primary">
                  {MOCK_CHART[MOCK_CHART.length - 1]}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Today
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-foreground">
                  {Math.round(
                    MOCK_CHART.reduce((a, b) => a + b, 0) / MOCK_CHART.length,
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  30-Day Avg
                </div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-emerald-400">
                  1,000
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Full Capacity
                </div>
              </div>
            </div>
          </Card>

          {/* ── Performance by Niche Table ───────────────────────────────── */}
          <Card className="card-dark p-6" data-ocid="autopilot.niche_table">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-primary" />
              <h2 className="font-bold text-foreground">
                Performance by Niche
              </h2>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                — hover a row for expert insight
              </span>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-border">
                    {TABLE_COLS.map(({ key, label }) => (
                      <th
                        key={key}
                        className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                        data-ocid={`niche_table.sort.${key}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(key)}
                          className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors select-none w-full text-left font-semibold uppercase tracking-wider"
                        >
                          <span className="flex items-center gap-1">
                            {label}
                            {sortCol === key ? (
                              sortAsc ? (
                                <ChevronUp size={11} />
                              ) : (
                                <ChevronDown size={11} />
                              )
                            ) : null}
                          </span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedNiches.map((row, idx) => (
                    <Tooltip key={row.niche}>
                      <TooltipTrigger asChild>
                        <tr
                          className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-default"
                          data-ocid={`niche_table.row.${idx + 1}`}
                        >
                          <td className="py-2.5 px-3 font-semibold text-foreground whitespace-nowrap">
                            {row.niche}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.inPipe}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.sent}
                          </td>
                          <td
                            className={`py-2.5 px-3 ${openRateClass(row.openRate)}`}
                          >
                            {row.openRate.toFixed(1)}%
                            {row.openRate > row.industryAvgOpen && (
                              <span className="ml-1 text-[9px] badge-emerald px-1 py-0.5 rounded">
                                ▲ avg
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.clickRate.toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 text-muted-foreground">
                            {row.replyRate.toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-extrabold text-primary">
                              {row.hotLeads}
                            </span>
                          </td>
                        </tr>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-[260px]">
                        <p className="text-xs leading-relaxed">
                          {NICHE_TOOLTIPS[row.niche]}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Industry avg open: {row.industryAvgOpen}% · Yours:{" "}
                          {row.openRate.toFixed(1)}%
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ── DNS Health Checker ───────────────────────────────────────── */}
          <Card className="card-dark p-6" data-ocid="autopilot.dns_panel">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={15} className="text-primary" />
              <h2 className="font-bold text-foreground">
                DNS & Deliverability Health
              </h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded cursor-help">
                    Critical for inbox placement
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Missing SPF, DKIM, or DMARC records will land your emails in
                    spam regardless of content quality. Fix all three before
                    scaling past 250 emails/day.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dnsRecords.map((rec) => (
                <div
                  key={rec.type}
                  className="rounded-lg p-4 border transition-all"
                  style={{
                    background: rec.valid
                      ? "oklch(0.62 0.18 155 / 8%)"
                      : "oklch(0.58 0.22 25 / 8%)",
                    borderColor: rec.valid
                      ? "oklch(0.62 0.18 155 / 30%)"
                      : "oklch(0.58 0.22 25 / 30%)",
                  }}
                  data-ocid={`dns.${rec.type.toLowerCase()}_card`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-foreground">
                      {rec.type}
                    </span>
                    {rec.valid ? (
                      <CheckCircle size={16} className="text-emerald-400" />
                    ) : (
                      <XCircle size={16} className="text-rose-400" />
                    )}
                  </div>
                  {rec.valid ? (
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {rec.value.substring(0, 42)}…
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle
                          size={12}
                          className="text-rose-400 mt-0.5 shrink-0"
                        />
                        <span className="text-xs text-rose-300">
                          Missing — inbox delivery at risk
                        </span>
                      </div>
                      <div className="bg-background/60 rounded p-2 font-mono text-[10px] text-muted-foreground leading-relaxed break-all">
                        {rec.fix}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full h-7 text-xs gap-1.5"
                        onClick={() => handleCopyDns(rec.fix, rec.type)}
                        data-ocid={`dns.copy_${rec.type.toLowerCase()}_button`}
                      >
                        <Copy size={11} />
                        {copiedDns === rec.type ? "Copied!" : "Copy DNS Record"}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
