import {
  Activity,
  AlertTriangle,
  BellOff,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  AlertType,
  SocialListeningAlert,
  SocialPlatform,
} from "../../types/socialMedia";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

// ── Alert type config ─────────────────────────────────────────────────────────

const ALERT_CONFIG: Record<
  AlertType,
  {
    label: string;
    cls: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  buying_signal: {
    label: "Buying Signal",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: Zap,
  },
  competitor_gain: {
    label: "Competitor Gain",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: TrendingUp,
  },
  competitor_loss: {
    label: "Competitor Loss",
    cls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    icon: TrendingDown,
  },
  negative_sentiment: {
    label: "Negative Mention",
    cls: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    icon: AlertTriangle,
  },
  keyword_mention: {
    label: "Keyword Mention",
    cls: "bg-primary/15 text-primary border-primary/30",
    icon: Search,
  },
  opportunity: {
    label: "Opportunity",
    cls: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    icon: Activity,
  },
};

// ── Platform icon ─────────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "facebook")
    return <Facebook size={12} className="text-blue-400 shrink-0" />;
  if (platform === "instagram")
    return <Instagram size={12} className="text-amber-400 shrink-0" />;
  if (platform === "google_business")
    return <Globe size={12} className="text-rose-400 shrink-0" />;
  return <Globe size={12} className="text-muted-foreground shrink-0" />;
}

function platformLabel(p: SocialPlatform) {
  const map: Record<SocialPlatform, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    google_business: "Google",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
  };
  return map[p] ?? p;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  if (h >= 1) return `${h}h ago`;
  const m = Math.floor(diff / 60000);
  if (m >= 1) return `${m}m ago`;
  return "Just now";
}

// ── Alert card ────────────────────────────────────────────────────────────────

interface AlertCardProps {
  alert: SocialListeningAlert;
  onDismiss: (id: string) => void;
  onAct: (id: string) => void;
  dismissing: boolean;
}

function AlertCard({ alert, onDismiss, onAct, dismissing }: AlertCardProps) {
  const cfg = ALERT_CONFIG[alert.alertType];
  const AlertIcon = cfg.icon;

  return (
    <div
      data-ocid={`listening.alert.item.${alert.id}`}
      className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-border/70 transition-colors"
    >
      {/* Top row: alert type + platform + time */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.cls}`}
            data-ocid={`listening.alert_badge.${alert.id}`}
          >
            <AlertIcon size={9} />
            {cfg.label}
          </span>
          <div className="flex items-center gap-1">
            <PlatformIcon platform={alert.platform} />
            <span className="text-[10px] text-muted-foreground">
              {platformLabel(alert.platform)}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {timeAgo(alert.createdAt)}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[9px] shrink-0 border-border text-muted-foreground"
        >
          {alert.source}
        </Badge>
      </div>

      {/* Keyword triggered */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">Keyword:</span>
        <span
          className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20"
          data-ocid={`listening.keyword_tag.${alert.id}`}
        >
          {alert.keyword}
        </span>
      </div>

      {/* Mention preview */}
      <blockquote className="border-l-2 border-border pl-3">
        <p className="text-xs text-foreground/80 italic leading-relaxed">
          "{alert.mentionText}"
        </p>
      </blockquote>

      {/* Suggested action */}
      <div className="bg-muted/30 border border-border/60 rounded-lg p-2.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Suggested Action
        </p>
        <p className="text-xs text-foreground/90 leading-relaxed">
          {alert.suggestedAction}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          data-ocid={`listening.act_button.${alert.id}`}
          onClick={() => onAct(alert.id)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7"
        >
          <ExternalLink size={11} className="mr-1" />
          Act on This
        </Button>
        <Button
          size="sm"
          variant="outline"
          data-ocid={`listening.dismiss_button.${alert.id}`}
          onClick={() => onDismiss(alert.id)}
          disabled={dismissing}
          className="text-xs h-7 text-muted-foreground"
        >
          <BellOff size={11} className="mr-1" />
          Dismiss
        </Button>
      </div>
    </div>
  );
}

// ── Default tracked keywords per niche ───────────────────────────────────────

const DEFAULT_KEYWORDS = [
  "plumber near me",
  "HVAC emergency",
  "med spa recommendation",
  "competitor mention",
  "carpet cleaning deal",
  "roofing estimate",
];

// ── Main panel ────────────────────────────────────────────────────────────────

interface SocialListeningPanelProps {
  tenantId: string;
  allAlerts: SocialListeningAlert[];
  onDismiss: (alertId: string) => void;
}

export function SocialListeningPanel({
  tenantId,
  allAlerts,
  onDismiss,
}: SocialListeningPanelProps) {
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>(DEFAULT_KEYWORDS);

  const activeAlerts = allAlerts.filter(
    (a) => a.tenantId === tenantId && !a.dismissed,
  );

  const criticalAlerts = activeAlerts.filter(
    (a) => a.alertType === "buying_signal" || a.alertType === "competitor_gain",
  );

  const handleDismiss = (id: string) => {
    setDismissingId(id);
    setTimeout(() => {
      onDismiss(id);
      setDismissingId(null);
      toast.success("Alert dismissed");
    }, 600);
  };

  const handleAct = (id: string) => {
    toast.success("Alert flagged for action — check your campaign queue");
    void id;
  };

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;
    if (keywords.includes(trimmed)) {
      toast.error("Keyword already tracked");
      return;
    }
    setKeywords((prev) => [...prev, trimmed]);
    setNewKeyword("");
    toast.success(`Now tracking "${trimmed}"`);
  };

  return (
    <div className="space-y-4" data-ocid="listening.panel">
      {/* Keyword monitor strip */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Search size={14} className="text-primary" />
            Tracked Keywords
          </p>
          <Badge
            variant="secondary"
            className="text-[10px] bg-primary/10 text-primary border-primary/20"
          >
            {keywords.length} active
          </Badge>
        </div>

        {/* Keywords grid */}
        <div
          className="flex flex-wrap gap-2"
          data-ocid="listening.keywords.strip"
        >
          {keywords.map((kw, i) => (
            <button
              type="button"
              key={kw}
              data-ocid={`listening.keyword_tag.item.${i + 1}`}
              onClick={() => {
                setKeywords((prev) => prev.filter((k) => k !== kw));
                toast.info(`Removed keyword "${kw}"`);
              }}
              className="group text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              title="Click to remove"
            >
              {kw}
              <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </span>
            </button>
          ))}
        </div>

        {/* Add keyword */}
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
            placeholder="Add a keyword to monitor..."
            className="h-8 text-xs flex-1"
            data-ocid="listening.add_keyword.input"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddKeyword}
            data-ocid="listening.add_keyword.button"
            className="text-xs h-8 shrink-0"
          >
            <Plus size={12} className="mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">
            {activeAlerts.length}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Active Alerts
          </p>
        </div>
        <div className="bg-card border border-emerald-500/20 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-emerald-400">
            {activeAlerts.filter((a) => a.alertType === "buying_signal").length}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Buying Signals
          </p>
        </div>
        <div className="bg-card border border-amber-500/20 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-amber-400">
            {criticalAlerts.length}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Critical</p>
        </div>
      </div>

      {/* Alert feed */}
      {activeAlerts.length === 0 ? (
        <Card
          className="bg-card border-border"
          data-ocid="listening.alerts.empty_state"
        >
          <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
            <Activity size={32} className="text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">
              No active alerts
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              New alerts will appear here as your keywords are mentioned across
              social platforms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={handleDismiss}
              onAct={handleAct}
              dismissing={dismissingId === alert.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
