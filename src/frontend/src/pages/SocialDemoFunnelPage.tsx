import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  Flame,
  Heart,
  Mail,
  MessageSquare,
  MousePointer,
  Play,
  RefreshCw,
  Settings,
  Share2,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { useSocialMedia } from "../hooks/useSocialMedia";
import type { DemoFunnelEntry } from "../types/socialMedia";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FunnelStageKey =
  | "engaged"
  | "enrolled"
  | "email_sent"
  | "email_opened"
  | "demo_clicked"
  | "trial_activated";

type FilterType = "all" | "active" | "trial" | "converted";

interface FunnelStageConfig {
  key: FunnelStageKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface TriggerConfig {
  platform: string;
  threshold: number;
  sequence: string;
  enabled: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const NICHE_LABELS: Record<string, string> = {
  plumbing: "Plumbing",
  hvac: "HVAC",
  restoration: "Restoration",
  carpet_cleaning: "Carpet Cleaning",
  roofing: "Roofing",
  med_spa: "Med Spa",
  real_estate: "Real Estate",
  mortgage: "Mortgage",
  chiropractor: "Chiropractor",
  dental: "Dental",
};

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google_business: "Google",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  direct: "Direct",
  email: "Email",
  referral: "Referral",
};

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "platform-facebook",
  instagram: "platform-instagram",
  google_business: "platform-google",
  tiktok: "badge-purple",
  linkedin: "badge-blue",
  direct: "badge-amber",
  email: "badge-emerald",
  referral: "badge-rose",
};

const FUNNEL_STAGES: FunnelStageConfig[] = [
  {
    key: "engaged",
    label: "Social Engagement",
    icon: <Heart className="h-4 w-4" />,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/30",
  },
  {
    key: "enrolled",
    label: "Enrolled in Sequence",
    icon: <Mail className="h-4 w-4" />,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/30",
  },
  {
    key: "email_sent",
    label: "Email Sent",
    icon: <Share2 className="h-4 w-4" />,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/30",
  },
  {
    key: "email_opened",
    label: "Email Opened",
    icon: <BarChart3 className="h-4 w-4" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/30",
  },
  {
    key: "demo_clicked",
    label: "Demo Clicked",
    icon: <MousePointer className="h-4 w-4" />,
    color: "text-rose-400",
    bgColor: "bg-rose-400/10 border-rose-400/30",
  },
  {
    key: "trial_activated",
    label: "Trial Activated",
    icon: <Zap className="h-4 w-4" />,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/30",
  },
];

const DEMO_SEQUENCES = [
  "Premium Outreach – 9 Email",
  "Social Retargeting – 5 Email",
  "Trial Nurture – 7 Email",
  "Hot Prospect – 3 Email Fast",
];

// ─── Rich demo entries ─────────────────────────────────────────────────────────

const RICH_DEMO_ENTRIES: DemoFunnelEntry[] = [
  {
    id: "df-1",
    tenantId: "tenant-1",
    prospectName: "Carlos Mendez",
    businessName: "Mendez Plumbing & Drain",
    email: "carlos@mendezplumbing.com",
    phone: "619-555-0142",
    niche: "plumbing",
    socialSource: "facebook",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/mendez-plumbing",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/mendez-plumbing",
    trialStartedAt: Date.now() - 86400000,
    trialExpiresAt: Date.now() + 6 * 86400000,
    currentStep: "website",
    stepsCompleted: ["voice_agent"],
    convertedToTrial: true,
    convertedToClient: false,
    lastActivityAt: Date.now() - 3600000,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "df-2",
    tenantId: "tenant-1",
    prospectName: "Angela Kim",
    businessName: "Radiant Glow Med Spa",
    email: "angela@radiantglowspa.com",
    phone: "858-555-0318",
    niche: "med_spa",
    socialSource: "instagram",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/radiant-glow-med-spa",
    brandKitUrl:
      "https://bookedrankedfunded.org/brand-kit/radiant-glow-med-spa",
    trialStartedAt: Date.now() - 3 * 86400000,
    trialExpiresAt: Date.now() + 4 * 86400000,
    currentStep: "reviews",
    stepsCompleted: ["voice_agent", "website", "crm"],
    convertedToTrial: true,
    convertedToClient: false,
    lastActivityAt: Date.now() - 7200000,
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: "df-3",
    tenantId: "tenant-1",
    prospectName: "Mike Torres",
    businessName: "Torres Roofing & Gutters",
    email: "mike@torresroofing.com",
    phone: "760-555-0874",
    niche: "roofing",
    socialSource: "facebook",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/torres-roofing",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/torres-roofing",
    trialStartedAt: null,
    trialExpiresAt: null,
    currentStep: "voice_agent",
    stepsCompleted: [],
    convertedToTrial: false,
    convertedToClient: false,
    lastActivityAt: Date.now() - 2 * 86400000,
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: "df-4",
    tenantId: "tenant-1",
    prospectName: "Lisa Nguyen",
    businessName: "Fresh Start Carpet Care",
    email: "lisa@freshstartcarpet.com",
    phone: "619-555-0551",
    niche: "carpet_cleaning",
    socialSource: "google_business",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/fresh-start-carpet",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/fresh-start-carpet",
    trialStartedAt: Date.now() - 14 * 86400000,
    trialExpiresAt: Date.now() - 7 * 86400000,
    currentStep: "completed",
    stepsCompleted: ["voice_agent", "website", "crm", "reviews", "credit"],
    convertedToTrial: true,
    convertedToClient: true,
    lastActivityAt: Date.now() - 86400000,
    createdAt: Date.now() - 14 * 86400000,
  },
  {
    id: "df-5",
    tenantId: "tenant-1",
    prospectName: "James Okafor",
    businessName: "Arctic Air HVAC Solutions",
    email: "james@arcticairhvac.com",
    phone: "619-555-0229",
    niche: "hvac",
    socialSource: "linkedin",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/arctic-air-hvac",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/arctic-air-hvac",
    trialStartedAt: Date.now() - 5 * 86400000,
    trialExpiresAt: Date.now() + 2 * 86400000,
    currentStep: "crm",
    stepsCompleted: ["voice_agent", "website"],
    convertedToTrial: true,
    convertedToClient: false,
    lastActivityAt: Date.now() - 18000000,
    createdAt: Date.now() - 5 * 86400000,
  },
  {
    id: "df-6",
    tenantId: "tenant-1",
    prospectName: "Patricia Ross",
    businessName: "Ross Family Dental",
    email: "patricia@rossdental.com",
    phone: "858-555-0447",
    niche: "dental",
    socialSource: "instagram",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/ross-family-dental",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/ross-family-dental",
    trialStartedAt: null,
    trialExpiresAt: null,
    currentStep: "voice_agent",
    stepsCompleted: [],
    convertedToTrial: false,
    convertedToClient: false,
    lastActivityAt: Date.now() - 4 * 86400000,
    createdAt: Date.now() - 4 * 86400000,
  },
];

// ─── Engagement history per entry (simulated) ──────────────────────────────────

const ENGAGEMENT_HISTORY: Record<
  string,
  Array<{
    type: string;
    label: string;
    detail: string;
    ts: number;
    icon: React.ReactNode;
    color: string;
  }>
> = {
  "df-1": [
    {
      type: "social",
      label: "Liked post on Facebook",
      detail: '"40% of water heaters fail in winter..." — liked + shared',
      ts: Date.now() - 4 * 86400000,
      icon: <ThumbsUp className="h-3.5 w-3.5" />,
      color: "text-blue-400",
    },
    {
      type: "social",
      label: "Commented on Facebook post",
      detail: '"How much does a replacement cost? Mine is 12 years old"',
      ts: Date.now() - 3.5 * 86400000,
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      color: "text-blue-400",
    },
    {
      type: "email",
      label: "Email #1 sent",
      detail: "Subject: We ran your audit, Carlos — here's what we found",
      ts: Date.now() - 3 * 86400000,
      icon: <Mail className="h-3.5 w-3.5" />,
      color: "text-amber-400",
    },
    {
      type: "email",
      label: "Email #1 opened",
      detail: "Opened 3x — high engagement signal",
      ts: Date.now() - 2.5 * 86400000,
      icon: <BarChart3 className="h-3.5 w-3.5" />,
      color: "text-emerald-400",
    },
    {
      type: "demo",
      label: "Clicked demo link",
      detail: "Visited bookedrankedfunded.org/brand-kit/mendez-plumbing",
      ts: Date.now() - 2 * 86400000,
      icon: <MousePointer className="h-3.5 w-3.5" />,
      color: "text-rose-400",
    },
    {
      type: "trial",
      label: "Trial activated",
      detail: "Started 7-day free trial — step: Voice Agent",
      ts: Date.now() - 86400000,
      icon: <Zap className="h-3.5 w-3.5" />,
      color: "text-primary",
    },
    {
      type: "trial",
      label: "Completed Voice Agent step",
      detail: "Tested AI agent with business name — played 2 full demos",
      ts: Date.now() - 3600000,
      icon: <Play className="h-3.5 w-3.5" />,
      color: "text-primary",
    },
  ],
  "df-4": [
    {
      type: "social",
      label: "Google Business review engagement",
      detail: "Left comment asking about carpet cleaning packages",
      ts: Date.now() - 20 * 86400000,
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      color: "text-blue-400",
    },
    {
      type: "email",
      label: "Email #1 sent",
      detail: "Subject: Lisa — your carpet cleaning brand kit is ready",
      ts: Date.now() - 18 * 86400000,
      icon: <Mail className="h-3.5 w-3.5" />,
      color: "text-amber-400",
    },
    {
      type: "email",
      label: "Email #3 opened + link clicked",
      detail: "Before/after screenshot email — clicked demo link twice",
      ts: Date.now() - 16 * 86400000,
      icon: <MousePointer className="h-3.5 w-3.5" />,
      color: "text-rose-400",
    },
    {
      type: "trial",
      label: "Trial activated — all 5 steps completed",
      detail: "Completed full guided demo in one session",
      ts: Date.now() - 14 * 86400000,
      icon: <Zap className="h-3.5 w-3.5" />,
      color: "text-primary",
    },
    {
      type: "converted",
      label: "Converted to paying client",
      detail: "Signed up for Starter plan — monthly subscription activated",
      ts: Date.now() - 86400000,
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      color: "text-emerald-400",
    },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function getDaysLeft(expiresAt: number | null): number | null {
  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 86400000));
}

function getFunnelStageForEntry(entry: DemoFunnelEntry): FunnelStageKey {
  if (entry.convertedToClient) return "trial_activated";
  if (entry.convertedToTrial) {
    if (entry.stepsCompleted.length >= 3) return "demo_clicked";
    if (entry.stepsCompleted.length >= 1) return "email_opened";
    return "enrolled";
  }
  return "engaged";
}

function getEmailOnLabel(entry: DemoFunnelEntry): string {
  if (entry.convertedToClient) return "Converted ✓";
  if (!entry.convertedToTrial) return "Email #1 pending";
  const steps = entry.stepsCompleted.length;
  if (steps === 0) return "Email #1 opened";
  if (steps === 1) return "Email #3 — demo link";
  if (steps === 2) return "Email #5 — trial push";
  return "Email #7 — last chance";
}

// ─── Funnel diagram ─────────────────────────────────────────────────────────────

function FunnelDiagram({ entries }: { entries: DemoFunnelEntry[] }) {
  const stageCounts: Record<FunnelStageKey, number> = {
    engaged: entries.length,
    enrolled: entries.filter(
      (e) => e.convertedToTrial || e.stepsCompleted.length > 0,
    ).length,
    email_sent: entries.filter(
      (e) => e.convertedToTrial || e.stepsCompleted.length > 0,
    ).length,
    email_opened: entries.filter((e) => e.stepsCompleted.length >= 1).length,
    demo_clicked: entries.filter((e) => e.stepsCompleted.length >= 2).length,
    trial_activated: entries.filter((e) => e.convertedToTrial).length,
  };

  return (
    <Card
      className="bg-card border-border"
      data-ocid="social_demo_funnel.funnel_diagram"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Pipeline Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop: horizontal, Mobile: vertical */}
        <div className="flex flex-col md:flex-row items-stretch md:items-end gap-2 md:gap-1">
          {FUNNEL_STAGES.map((stage, i) => {
            const count = stageCounts[stage.key];
            const total = stageCounts.engaged || 1;
            const pct = Math.round((count / total) * 100);
            const nextCount =
              i < FUNNEL_STAGES.length - 1
                ? stageCounts[FUNNEL_STAGES[i + 1].key]
                : count;
            const convRate =
              count > 0 ? Math.round((nextCount / count) * 100) : 0;
            const barH = Math.max(20, Math.round((count / total) * 100));

            return (
              <div
                key={stage.key}
                className="flex flex-col md:flex-row items-center flex-1"
              >
                {/* Stage block */}
                <div className="flex flex-col items-center w-full md:flex-1">
                  {/* Bar (desktop: height-based, mobile: width-based) */}
                  <div className="hidden md:flex flex-col items-center w-full">
                    <div className="text-xs font-bold text-foreground mb-1">
                      {count}
                    </div>
                    <div
                      className={`w-full rounded-t-md border ${stage.bgColor} transition-all`}
                      style={{ height: `${barH}px`, minHeight: "20px" }}
                    />
                    <div
                      className={`mt-2 p-1.5 rounded border ${stage.bgColor} flex items-center justify-center`}
                    >
                      <span className={stage.color}>{stage.icon}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-1 leading-tight max-w-[80px]">
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-primary font-semibold mt-0.5">
                      {pct}%
                    </p>
                  </div>

                  {/* Mobile horizontal layout */}
                  <div
                    className={`md:hidden flex items-center gap-3 w-full p-2 rounded border ${stage.bgColor}`}
                  >
                    <span className={stage.color}>{stage.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {stage.label}
                      </p>
                      <div className="h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">
                        {count}
                      </p>
                      <p className="text-[10px] text-primary">{pct}%</p>
                    </div>
                  </div>
                </div>

                {/* Connector arrow */}
                {i < FUNNEL_STAGES.length - 1 && (
                  <div className="hidden md:flex flex-col items-center mx-1 shrink-0">
                    <div className="text-[9px] text-emerald-400 font-bold mb-1">
                      {convRate}%
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                  </div>
                )}
                {i < FUNNEL_STAGES.length - 1 && (
                  <div className="md:hidden flex items-center gap-1 py-0.5 pl-2">
                    <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {convRate}% conversion
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Trigger configuration panel ───────────────────────────────────────────────

function TriggerConfigPanel({ onClose }: { onClose: () => void }) {
  const [configs, setConfigs] = useState<TriggerConfig[]>([
    {
      platform: "facebook",
      threshold: 3,
      sequence: DEMO_SEQUENCES[0],
      enabled: true,
    },
    {
      platform: "instagram",
      threshold: 3,
      sequence: DEMO_SEQUENCES[1],
      enabled: true,
    },
    {
      platform: "linkedin",
      threshold: 2,
      sequence: DEMO_SEQUENCES[0],
      enabled: false,
    },
    {
      platform: "google_business",
      threshold: 1,
      sequence: DEMO_SEQUENCES[0],
      enabled: false,
    },
  ]);

  const update = (
    i: number,
    key: keyof TriggerConfig,
    val: TriggerConfig[keyof TriggerConfig],
  ) => {
    setConfigs((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)),
    );
  };

  return (
    <div
      data-ocid="social_demo_funnel.trigger_config.panel"
      className="border border-border rounded-lg bg-card overflow-hidden animate-fade-in-down"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Auto-Enroll Trigger Configuration
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-ocid="social_demo_funnel.trigger_config.close_button"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close trigger configuration"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-muted-foreground">
          When a prospect reaches the interaction threshold on a platform, they
          are automatically enrolled in the selected email sequence.
        </p>

        <div className="space-y-2">
          {configs.map((cfg, i) => (
            <div
              key={cfg.platform}
              data-ocid={`social_demo_funnel.trigger_config.item.${i + 1}`}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border transition-smooth ${
                cfg.enabled
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-2 min-w-[140px]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={cfg.enabled}
                  onClick={() => update(i, "enabled", !cfg.enabled)}
                  data-ocid={`social_demo_funnel.trigger_config.toggle.${i + 1}`}
                  className={`relative w-9 h-5 rounded-full transition-colors ${cfg.enabled ? "bg-primary" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${
                      cfg.enabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-medium social-platform-badge ${PLATFORM_COLORS[cfg.platform] ?? "badge-purple"}`}
                >
                  {PLATFORM_LABELS[cfg.platform]}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Threshold:
                </span>
                <Select
                  value={String(cfg.threshold)}
                  onValueChange={(v) => update(i, "threshold", Number(v))}
                >
                  <SelectTrigger
                    className="h-7 w-20 text-xs"
                    data-ocid={`social_demo_funnel.trigger_config.threshold.${i + 1}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} interaction{n > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Sequence:
                </span>
                <Select
                  value={cfg.sequence}
                  onValueChange={(v) => update(i, "sequence", v)}
                >
                  <SelectTrigger
                    className="h-7 text-xs flex-1 min-w-0"
                    data-ocid={`social_demo_funnel.trigger_config.sequence.${i + 1}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_SEQUENCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1"
            data-ocid="social_demo_funnel.trigger_config.save_button"
            onClick={onClose}
          >
            Save Trigger Config
          </Button>
          <Button
            size="sm"
            variant="outline"
            data-ocid="social_demo_funnel.trigger_config.cancel_button"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Sequence performance side panel ───────────────────────────────────────────

function SequencePerformancePanel() {
  const stats = [
    { label: "Open Rate", value: "52%", trend: "+8%", color: "text-amber-400" },
    {
      label: "Click-Through Rate",
      value: "31%",
      trend: "+12%",
      color: "text-emerald-400",
    },
    {
      label: "Demo Conversion",
      value: "18%",
      trend: "+5%",
      color: "text-primary",
    },
    {
      label: "Trial Activated",
      value: "9%",
      trend: "+3%",
      color: "text-rose-400",
    },
  ];

  const emailStats = [
    { name: "Email #1 — Audit Reveal", opens: 68, clicks: 42 },
    { name: "Email #2 — Before/After", opens: 61, clicks: 38 },
    { name: "Email #3 — Pain Amplifier", opens: 54, clicks: 29 },
    { name: "Email #5 — Voice Agent", opens: 48, clicks: 35 },
    { name: "Email #7 — Last Chance", opens: 38, clicks: 22 },
  ];

  return (
    <Card
      className="bg-card border-border"
      data-ocid="social_demo_funnel.sequence_perf.panel"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Retargeting Sequence Performance
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Premium Outreach – 9 Email
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-muted/30 rounded-lg p-2.5 border border-border"
            >
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">
                {s.trend} vs prev
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Per-email breakdown */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            Per-Email Breakdown
          </p>
          <div className="space-y-2">
            {emailStats.map((e) => (
              <div key={e.name} className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span className="truncate pr-2">{e.name}</span>
                  <span className="shrink-0">
                    {e.opens}% opens / {e.clicks}% clicks
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${e.opens}%`,
                      background:
                        "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.62 0.18 155))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Prospect timeline slide-out ────────────────────────────────────────────────

function ProspectTimeline({
  entry,
  onClose,
  onRemove,
}: {
  entry: DemoFunnelEntry;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const history = ENGAGEMENT_HISTORY[entry.id] ?? [];
  const daysLeft = getDaysLeft(entry.trialExpiresAt);
  const triggerPost =
    entry.socialSource !== "direct" &&
    entry.socialSource !== "email" &&
    entry.socialSource !== "referral"
      ? {
          platform: PLATFORM_LABELS[entry.socialSource] ?? entry.socialSource,
          content: `"40% of ${NICHE_LABELS[entry.niche] ?? entry.niche} businesses are missing leads from voicemail — here's the fix" — liked + commented by ${entry.prospectName}`,
          url: `https://bookedrankedfunded.org/social/${entry.socialSource}/${entry.id}`,
        }
      : null;

  return (
    <div
      data-ocid="social_demo_funnel.prospect_timeline.sheet"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-left"
      style={{ animation: "slideInRight 0.25s ease-out both" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border bg-muted/30 shrink-0">
        <div className="min-w-0 pr-2">
          <p className="font-semibold text-foreground truncate">
            {entry.prospectName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {entry.businessName}
          </p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            <span
              className={`social-platform-badge text-[10px] ${PLATFORM_COLORS[entry.socialSource] ?? "badge-purple"}`}
            >
              {PLATFORM_LABELS[entry.socialSource] ?? entry.socialSource}
            </span>
            <span className="social-platform-badge text-[10px] badge-purple">
              {NICHE_LABELS[entry.niche]}
            </span>
            {entry.convertedToClient && (
              <span className="badge-emerald social-platform-badge text-[10px]">
                Client ✓
              </span>
            )}
            {entry.convertedToTrial &&
              !entry.convertedToClient &&
              daysLeft !== null && (
                <span className="badge-amber social-platform-badge text-[10px]">
                  {daysLeft}d left
                </span>
              )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-ocid="social_demo_funnel.prospect_timeline.close_button"
          aria-label="Close timeline"
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Demo link */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Demo Link
            </p>
            <a
              href={entry.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline break-all"
              data-ocid="social_demo_funnel.prospect_timeline.demo_link"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              {entry.demoUrl}
            </a>
          </div>

          {/* Attribution chain */}
          {triggerPost && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Attribution — Initial Trigger Post
              </p>
              <div className="bg-muted/30 border border-primary/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`social-platform-badge text-[9px] ${PLATFORM_COLORS[entry.socialSource] ?? "badge-purple"}`}
                  >
                    {triggerPost.platform}
                  </span>
                  <Flame className="h-3 w-3 text-rose-400" />
                  <span className="text-[10px] text-rose-400 font-semibold">
                    Triggered enrollment
                  </span>
                </div>
                <p className="text-xs text-foreground italic line-clamp-3">
                  {triggerPost.content}
                </p>
                <a
                  href={triggerPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View post
                </a>
              </div>
            </div>
          )}

          {/* Engagement timeline */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Full Engagement History
            </p>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No activity recorded yet.
              </p>
            ) : (
              <div className="relative pl-4">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <div key={`${h.type}-${i}`} className="relative">
                      <div
                        className={`absolute -left-2.5 top-1 w-2 h-2 rounded-full border border-background bg-current ${h.color}`}
                      />
                      <div className="bg-muted/20 rounded-lg p-2.5 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={h.color}>{h.icon}</span>
                          <span className="text-xs font-medium text-foreground">
                            {h.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground pl-5">
                          {h.detail}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 pl-5">
                          {timeAgo(h.ts)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email sequence progress */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Email Sequence Progress
            </p>
            <div className="space-y-1.5">
              {[
                "Audit Reveal",
                "Before/After Screenshot",
                "Pain Amplifier",
                "Social Proof + Rankings",
                "Voice Agent Reveal",
                "Free Trial Push",
                "Last Chance",
              ].map((label, i) => {
                const sent = i < entry.stepsCompleted.length + 2;
                const opened = i < entry.stepsCompleted.length + 1;
                const clicked = i < entry.stepsCompleted.length;
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 p-2 rounded border text-xs transition-smooth ${
                      clicked
                        ? "border-primary/30 bg-primary/5 text-foreground"
                        : sent
                          ? "border-amber-400/20 bg-amber-400/5 text-foreground"
                          : "border-border bg-transparent text-muted-foreground"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-muted text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <span className="flex-1 min-w-0 truncate">
                      Email #{i + 1} — {label}
                    </span>
                    {clicked && (
                      <span className="text-primary text-[10px] font-semibold shrink-0">
                        Clicked ✓
                      </span>
                    )}
                    {!clicked && opened && (
                      <span className="text-amber-400 text-[10px] font-semibold shrink-0">
                        Opened
                      </span>
                    )}
                    {!opened && sent && (
                      <span className="text-muted-foreground text-[10px] shrink-0">
                        Sent
                      </span>
                    )}
                    {!sent && (
                      <span className="text-muted-foreground/50 text-[10px] shrink-0">
                        Pending
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer actions */}
      <div className="p-4 border-t border-border bg-muted/10 shrink-0">
        <Button
          variant="destructive"
          size="sm"
          className="w-full gap-2"
          data-ocid="social_demo_funnel.prospect_timeline.delete_button"
          onClick={() => {
            onRemove(entry.id);
            onClose();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove from Funnel
        </Button>
      </div>
    </div>
  );
}

// ─── Prospect row ───────────────────────────────────────────────────────────────

function ProspectRow({
  entry,
  index,
  onViewTimeline,
}: {
  entry: DemoFunnelEntry;
  index: number;
  onViewTimeline: (entry: DemoFunnelEntry) => void;
}) {
  const daysLeft = getDaysLeft(entry.trialExpiresAt);
  const currentStage = getFunnelStageForEntry(entry);
  const stageConfig = FUNNEL_STAGES.find((s) => s.key === currentStage);

  return (
    <tr
      className="border-b border-border hover:bg-muted/20 transition-smooth"
      data-ocid={`social_demo_funnel.prospect_table.item.${index + 1}`}
    >
      {/* Name + business */}
      <td className="px-3 py-3 min-w-[160px]">
        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
          {entry.prospectName}
        </p>
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
          {entry.businessName}
        </p>
      </td>

      {/* Platform */}
      <td className="px-3 py-3 hidden sm:table-cell">
        <span
          className={`social-platform-badge text-[10px] ${PLATFORM_COLORS[entry.socialSource] ?? "badge-purple"}`}
        >
          {PLATFORM_LABELS[entry.socialSource] ?? entry.socialSource}
        </span>
      </td>

      {/* Engagement */}
      <td className="px-3 py-3 hidden md:table-cell text-center">
        <span className="text-sm font-semibold text-foreground">
          {entry.stepsCompleted.length + 3}
        </span>
        <p className="text-[10px] text-muted-foreground">interactions</p>
      </td>

      {/* Stage */}
      <td className="px-3 py-3">
        {stageConfig ? (
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${stageConfig.bgColor} ${stageConfig.color}`}
          >
            {stageConfig.icon}
            <span className="hidden lg:inline">{stageConfig.label}</span>
          </div>
        ) : null}
      </td>

      {/* Email on */}
      <td className="px-3 py-3 hidden lg:table-cell">
        <span className="text-xs text-muted-foreground">
          {getEmailOnLabel(entry)}
        </span>
      </td>

      {/* Last activity */}
      <td className="px-3 py-3 hidden md:table-cell">
        <span className="text-xs text-muted-foreground">
          {timeAgo(entry.lastActivityAt)}
        </span>
      </td>

      {/* Demo link */}
      <td className="px-3 py-3 hidden lg:table-cell">
        <a
          href={entry.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1 max-w-[180px] truncate"
          data-ocid={`social_demo_funnel.prospect_table.demo_link.${index + 1}`}
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          <span className="truncate">bookedrankedfunded.org/…</span>
        </a>
      </td>

      {/* Trial status */}
      <td className="px-3 py-3 hidden sm:table-cell">
        {entry.convertedToClient ? (
          <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/25">
            Client
          </Badge>
        ) : entry.convertedToTrial && daysLeft !== null ? (
          <Badge
            variant="secondary"
            className={`text-[10px] ${daysLeft <= 2 ? "text-rose-400" : "text-amber-400"}`}
          >
            <Clock className="h-2.5 w-2.5 mr-1" />
            {daysLeft}d left
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-[10px] text-muted-foreground"
          >
            Not started
          </Badge>
        )}
      </td>

      {/* Actions */}
      <td className="px-3 py-3">
        <button
          type="button"
          onClick={() => onViewTimeline(entry)}
          data-ocid={`social_demo_funnel.prospect_table.view_button.${index + 1}`}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"
          aria-label={`View timeline for ${entry.prospectName}`}
        >
          Timeline <ChevronRight className="h-3 w-3" />
        </button>
      </td>
    </tr>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function SocialDemoFunnelPage() {
  const { getDemoFunnelEntries, isLoadingFunnel, updateDemoFunnelEntry } =
    useSocialMedia();

  const [entries, setEntries] = useState<DemoFunnelEntry[]>(RICH_DEMO_ENTRIES);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showTriggerConfig, setShowTriggerConfig] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DemoFunnelEntry | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only call
  useEffect(() => {
    void getDemoFunnelEntries("tenant-1");
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getDemoFunnelEntries("tenant-1");
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleRemove = (id: string) => {
    void updateDemoFunnelEntry(id, { convertedToClient: false });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = entries.filter((e) => {
    if (filter === "active") return e.convertedToTrial && !e.convertedToClient;
    if (filter === "trial") return !e.convertedToTrial;
    if (filter === "converted") return e.convertedToClient;
    return true;
  });

  const totalCount = entries.length;
  const trialCount = entries.filter(
    (e) => e.convertedToTrial && !e.convertedToClient,
  ).length;
  const convertedCount = entries.filter((e) => e.convertedToClient).length;
  const pendingCount = entries.filter((e) => !e.convertedToTrial).length;

  const filterOptions: Array<{
    value: FilterType;
    label: string;
    count: number;
  }> = [
    { value: "all", label: "All Prospects", count: totalCount },
    { value: "active", label: "Active Trials", count: trialCount },
    { value: "trial", label: "Not Started", count: pendingCount },
    { value: "converted", label: "Converted", count: convertedCount },
  ];

  return (
    <div
      data-ocid="social_demo_funnel.page"
      className="min-h-full space-y-5 p-4 md:p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-foreground flex items-center gap-2.5">
            <TrendingUp className="h-6 w-6 text-primary shrink-0" />
            Social-to-Demo Funnel
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="text-primary font-semibold">
              {totalCount} prospects
            </span>{" "}
            active across all social platforms
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowTriggerConfig((v) => !v)}
            data-ocid="social_demo_funnel.configure_triggers_button"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Configure Triggers</span>
            <span className="sm:hidden">Triggers</span>
            {showTriggerConfig ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
            data-ocid="social_demo_funnel.refresh_button"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Trigger config panel (collapsible) */}
      {showTriggerConfig && (
        <TriggerConfigPanel onClose={() => setShowTriggerConfig(false)} />
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Total Prospects",
            value: totalCount,
            icon: <Users className="h-4 w-4" />,
            color: "text-foreground",
          },
          {
            label: "Active Trials",
            value: trialCount,
            icon: <Clock className="h-4 w-4" />,
            color: "text-amber-400",
          },
          {
            label: "Not Started",
            value: pendingCount,
            icon: <Mail className="h-4 w-4" />,
            color: "text-blue-400",
          },
          {
            label: "Converted",
            value: convertedCount,
            icon: <TrendingUp className="h-4 w-4" />,
            color: "text-emerald-400",
          },
        ].map(({ label, value, icon, color }, i) => (
          <Card
            key={label}
            className="bg-card border-border"
            data-ocid={`social_demo_funnel.stat.${i + 1}`}
          >
            <CardContent className="pt-3 pb-3 flex items-center gap-3">
              <span className={color}>{icon}</span>
              <div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel diagram */}
      <FunnelDiagram entries={entries} />

      {/* Main content: table + side panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        {/* Left: enrolled prospects table */}
        <div className="space-y-3">
          {/* Filters */}
          <div
            className="flex items-center gap-2 flex-wrap"
            data-ocid="social_demo_funnel.filter_tabs"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {filterOptions.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                data-ocid={`social_demo_funnel.filter.${opt.value}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-smooth ${
                  filter === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {opt.label}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                    filter === opt.value
                      ? "bg-primary-foreground/20"
                      : "bg-background"
                  }`}
                >
                  {opt.count}
                </span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoadingFunnel && (
            <div
              data-ocid="social_demo_funnel.loading_state"
              className="space-y-2"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoadingFunnel && filtered.length === 0 && (
            <div
              data-ocid="social_demo_funnel.empty_state"
              className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg"
            >
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-sm">
                No prospects match this filter
              </p>
              <p className="text-xs mt-1">
                Try "All Prospects" or add prospects from the{" "}
                <a
                  href="/social-lead-capture"
                  className="text-primary hover:underline"
                >
                  Social Lead Capture
                </a>{" "}
                page.
              </p>
            </div>
          )}

          {/* Table */}
          {!isLoadingFunnel && filtered.length > 0 && (
            <Card className="bg-card border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Prospect
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                        Source
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell text-center">
                        Engaged
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Stage
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                        Email
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                        Activity
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                        Demo Link
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                        Trial
                      </th>
                      <th className="px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry, i) => (
                      <ProspectRow
                        key={entry.id}
                        entry={entry}
                        index={i}
                        onViewTimeline={setSelectedEntry}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Right: sequence performance */}
        <div className="hidden xl:block">
          <SequencePerformancePanel />
        </div>
      </div>

      {/* Mobile: sequence performance below */}
      <div className="xl:hidden">
        <SequencePerformancePanel />
      </div>

      {/* Prospect timeline slide-out */}
      {selectedEntry && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 cursor-default"
            onClick={() => setSelectedEntry(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSelectedEntry(null);
            }}
            aria-label="Close timeline"
          />
          <ProspectTimeline
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onRemove={handleRemove}
          />
        </>
      )}
    </div>
  );
}
