import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  TrendingDown,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

type AlertSeverity =
  | "critical"
  | "warning"
  | "caution"
  | "positive"
  | "intelligence";

interface ReputationAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: number;
  resolved: boolean;
  actionLabel?: string;
}

// ── Niche alert data ───────────────────────────────────────────────────────────

const NICHE_ALERTS: Record<string, ReputationAlert[]> = {
  "tenant-oceanside": [
    {
      id: "alert-001",
      severity: "warning",
      title: "2-Star Review: Response Required",
      message:
        'Warning: A 2-star review was just posted mentioning "no-show." Respond immediately to prevent ranking impact — unresolved negative reviews cost plumbers an average of 22% in lead flow.',
      timestamp: Date.now() - 47 * 60 * 1000,
      resolved: false,
      actionLabel: "Open Recovery Workflow",
    },
    {
      id: "alert-002",
      severity: "intelligence",
      title: "Competitor Review Surge",
      message:
        "City Best Plumbing gained 8 new 5-star reviews this week. They now have 127 total vs. your 43. At current velocity, they widen the gap every month you don't request reviews.",
      timestamp: Date.now() - 2 * 3600 * 1000,
      resolved: false,
      actionLabel: "Launch Review Request",
    },
    {
      id: "alert-003",
      severity: "positive",
      title: "Milestone: 43 Google Reviews",
      message:
        "You just hit 43 Google reviews at 4.6 stars — above the local average of 4.2. Promote this on social to lock in the authority signal before competitors catch up.",
      timestamp: Date.now() - 24 * 3600 * 1000,
      resolved: false,
      actionLabel: "Share on Social",
    },
  ],
  "tenant-glow": [
    {
      id: "alert-004",
      severity: "critical",
      title: "Critical: Adverse Reaction Review Posted",
      message:
        "A review alleging an adverse reaction was posted on Google. Reply carefully — do NOT acknowledge treatment specifics. HIPAA guidance is shown in the response workflow.",
      timestamp: Date.now() - 28 * 60 * 1000,
      resolved: false,
      actionLabel: "Open Recovery Workflow",
    },
    {
      id: "alert-005",
      severity: "caution",
      title: "Review Velocity Slowing",
      message:
        "No new reviews in 12 days. Med spa bookings peak on weekends — activate post-appointment review requests for Saturday/Sunday clients to maintain velocity.",
      timestamp: Date.now() - 36 * 3600 * 1000,
      resolved: false,
      actionLabel: "Activate Auto-Request",
    },
  ],
  "tenant-arctic": [
    {
      id: "alert-006",
      severity: "intelligence",
      title: "Competitor Surge During Peak Season",
      message:
        "Main competitor (City HVAC Pros) gained 8 new 5-star reviews this week during peak season. Summer is when reviews drive 60%+ of HVAC bookings. Close the gap now.",
      timestamp: Date.now() - 5 * 3600 * 1000,
      resolved: false,
      actionLabel: "Launch Review Blitz",
    },
    {
      id: "alert-007",
      severity: "positive",
      title: "Seasonal Trust Signal: 4.8 Stars",
      message:
        "Your 4.8-star average is in the top 5% for HVAC contractors in your area. Pin this as a social post before the summer heat wave search spike hits.",
      timestamp: Date.now() - 2 * 86400 * 1000,
      resolved: false,
    },
  ],
  "tenant-demo": [
    {
      id: "alert-008",
      severity: "warning",
      title: "Velocity Spike: 4 Reviews in 2 Days",
      message:
        "4 reviews in 2 days — likely from a large job completion. Flag these for insurance documentation. Restoration projects benefit from a review paper trail for claim disputes.",
      timestamp: Date.now() - 3 * 3600 * 1000,
      resolved: false,
      actionLabel: "Open Recovery Workflow",
    },
    {
      id: "alert-009",
      severity: "critical",
      title: "Suspected Fake Negative Review",
      message:
        "A competitor may be leaving fake negative reviews — pattern detected (3 1-star reviews in 48 hours, all new accounts). See the recovery workflow to flag for Google review.",
      timestamp: Date.now() - 90 * 60 * 1000,
      resolved: false,
      actionLabel: "Flag Fake Review",
    },
    {
      id: "alert-010",
      severity: "intelligence",
      title: "Competitor Moving Fast",
      message:
        "TopRoofing LLC gained 12 new reviews after the last hail storm. Storm-season leads go to whoever has more reviews. You need 9 more reviews to match their post-storm positioning.",
      timestamp: Date.now() - 8 * 3600 * 1000,
      resolved: false,
    },
  ],
};

const SEVERITY_CONFIG: Record<
  AlertSeverity,
  {
    icon: React.ReactNode;
    label: string;
    bgColor: string;
    borderColor: string;
    labelColor: string;
    pulse: string;
  }
> = {
  critical: {
    icon: <Zap size={14} />,
    label: "CRITICAL",
    bgColor: "oklch(0.62 0.2 15 / 12%)",
    borderColor: "oklch(0.62 0.2 15 / 40%)",
    labelColor: "oklch(0.78 0.16 15)",
    pulse: "bg-rose-500",
  },
  warning: {
    icon: <AlertTriangle size={14} />,
    label: "WARNING",
    bgColor: "oklch(0.72 0.18 55 / 12%)",
    borderColor: "oklch(0.72 0.18 55 / 40%)",
    labelColor: "oklch(0.82 0.16 55)",
    pulse: "bg-amber-500",
  },
  caution: {
    icon: <TrendingDown size={14} />,
    label: "CAUTION",
    bgColor: "oklch(0.78 0.14 75 / 10%)",
    borderColor: "oklch(0.78 0.14 75 / 30%)",
    labelColor: "oklch(0.88 0.12 75)",
    pulse: "bg-yellow-500",
  },
  positive: {
    icon: <Trophy size={14} />,
    label: "MILESTONE",
    bgColor: "oklch(0.62 0.18 155 / 10%)",
    borderColor: "oklch(0.62 0.18 155 / 30%)",
    labelColor: "oklch(0.78 0.14 155)",
    pulse: "bg-emerald-500",
  },
  intelligence: {
    icon: <Eye size={14} />,
    label: "INTELLIGENCE",
    bgColor: "oklch(0.58 0.22 290 / 10%)",
    borderColor: "oklch(0.58 0.22 290 / 30%)",
    labelColor: "oklch(0.78 0.16 290)",
    pulse: "bg-purple-500",
  },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Alert Settings Panel ───────────────────────────────────────────────────────

function AlertSettingsPanel({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState({
    oneLowStar: true,
    velocityDrop: true,
    competitorSurge: true,
    milestone: true,
    velocityThreshold: "3",
    competitorThreshold: "5",
  });

  function toggle(key: keyof typeof settings) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div
      className="rounded-xl p-4 space-y-3 animate-fade-in"
      style={{
        background: "oklch(0.12 0.014 280)",
        border: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-white">Alert Settings</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      </div>
      {[
        { key: "oneLowStar" as const, label: "New 1–2 star review received" },
        {
          key: "velocityDrop" as const,
          label: `Review velocity drops below ${settings.velocityThreshold}/week`,
        },
        {
          key: "competitorSurge" as const,
          label: `Competitor gains >${settings.competitorThreshold} reviews in 7 days`,
        },
        {
          key: "milestone" as const,
          label: "Review milestone reached (25, 50, 100, 250)",
        },
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{item.label}</span>
          <button
            type="button"
            onClick={() => toggle(item.key)}
            role="switch"
            aria-checked={settings[item.key] as boolean}
            data-ocid={`alerts.setting.${item.key}`}
            className={`w-9 h-5 rounded-full transition-all relative shrink-0 ${settings[item.key] ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings[item.key] ? "left-4" : "left-0.5"}`}
            />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          toast.success("Alert settings saved");
          onClose();
        }}
        data-ocid="alerts.save_settings_button"
        className="w-full text-xs py-2 rounded-lg font-medium transition-colors"
        style={{
          background: "oklch(0.58 0.22 290 / 20%)",
          color: "oklch(0.78 0.16 290)",
          border: "1px solid oklch(0.58 0.22 290 / 30%)",
        }}
      >
        Save Settings
      </button>
    </div>
  );
}

// ── Main Alerts Panel ──────────────────────────────────────────────────────────

interface ReputationAlertsPanelProps {
  tenantId: string;
  onOpenRecovery: () => void;
}

export default function ReputationAlertsPanel({
  tenantId,
  onOpenRecovery,
}: ReputationAlertsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(false);

  const allAlerts = NICHE_ALERTS[tenantId] ?? NICHE_ALERTS["tenant-demo"];
  const activeAlerts = allAlerts.filter((a) => !resolvedIds.has(a.id));
  const resolvedAlerts = allAlerts.filter((a) => resolvedIds.has(a.id));

  const criticalCount = activeAlerts.filter(
    (a) => a.severity === "critical" || a.severity === "warning",
  ).length;

  function resolve(id: string) {
    setResolvedIds((prev) => new Set(prev).add(id));
    toast.success("Alert resolved and logged");
  }

  function handleAction(alert: ReputationAlert) {
    if (
      alert.actionLabel?.includes("Recovery") ||
      alert.actionLabel?.includes("Flag Fake")
    ) {
      onOpenRecovery();
    } else if (
      alert.actionLabel?.includes("Review Request") ||
      alert.actionLabel?.includes("Launch")
    ) {
      toast.success("Review request campaign launched!", {
        description: "Sending to last 10 satisfied clients.",
      });
    } else if (alert.actionLabel?.includes("Social")) {
      toast.success("Review milestone queued for social post!");
    } else if (alert.actionLabel?.includes("Auto-Request")) {
      toast.success("Auto-request activated for weekends!");
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "oklch(0.13 0.016 280)",
        border: "1px solid oklch(1 0 0 / 10%)",
      }}
      data-ocid="alerts.panel"
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
        data-ocid="alerts.toggle"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-3">
          <Bell
            size={15}
            className={criticalCount > 0 ? "text-rose-400" : "text-purple-400"}
          />
          <span className="text-sm font-semibold text-white">
            Reputation Alerts
          </span>
          {criticalCount > 0 && (
            <span
              className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-bold"
              style={{
                background: "oklch(0.62 0.2 15 / 20%)",
                color: "oklch(0.78 0.16 15)",
                border: "1px solid oklch(0.62 0.2 15 / 40%)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {criticalCount} require action
            </span>
          )}
          {criticalCount === 0 && activeAlerts.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.58 0.22 290 / 15%)",
                color: "oklch(0.78 0.16 290)",
              }}
            >
              {activeAlerts.length} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            data-ocid="alerts.settings_button"
            aria-label="Alert settings"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <BellOff size={13} />
          </button>
          {collapsed ? (
            <ChevronDown size={15} className="text-muted-foreground" />
          ) : (
            <ChevronUp size={15} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-3">
          {showSettings && (
            <AlertSettingsPanel onClose={() => setShowSettings(false)} />
          )}

          {activeAlerts.length === 0 ? (
            <div
              className="flex items-center gap-2 py-3 text-sm"
              style={{ color: "oklch(0.78 0.14 155)" }}
            >
              <CheckCircle2 size={15} />
              <span>
                All clear — no active alerts. Your reputation is healthy.
              </span>
            </div>
          ) : (
            activeAlerts.map((alert) => {
              const cfg = SEVERITY_CONFIG[alert.severity];
              return (
                <div
                  key={alert.id}
                  data-ocid={`alerts.item.${alert.id}`}
                  className="rounded-xl p-3.5"
                  style={{
                    background: cfg.bgColor,
                    border: `1px solid ${cfg.borderColor}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${cfg.pulse} animate-pulse`}
                      />
                      <span style={{ color: cfg.labelColor }}>{cfg.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-xs font-bold uppercase tracking-wide"
                          style={{ color: cfg.labelColor }}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {timeAgo(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white mb-0.5">
                        {alert.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>
                      {alert.actionLabel && (
                        <button
                          type="button"
                          onClick={() => handleAction(alert)}
                          data-ocid={`alerts.action.${alert.id}`}
                          className="mt-2 text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                          style={{
                            background: cfg.bgColor,
                            color: cfg.labelColor,
                            border: `1px solid ${cfg.borderColor}`,
                          }}
                        >
                          {alert.actionLabel} →
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => resolve(alert.id)}
                      data-ocid={`alerts.resolve.${alert.id}`}
                      aria-label="Mark as resolved"
                      className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors mt-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {resolvedAlerts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              data-ocid="alerts.history_toggle"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Info size={12} />
              {showHistory ? "Hide" : "Show"} resolved ({resolvedAlerts.length})
            </button>
          )}

          {showHistory && resolvedAlerts.length > 0 && (
            <div className="space-y-2" data-ocid="alerts.history">
              {resolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl p-3 opacity-50"
                  style={{
                    background: "oklch(0.12 0.012 280)",
                    border: "1px solid oklch(1 0 0 / 6%)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={12}
                      className="text-emerald-400 shrink-0"
                    />
                    <span className="text-xs text-muted-foreground flex-1 line-clamp-1">
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(alert.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
