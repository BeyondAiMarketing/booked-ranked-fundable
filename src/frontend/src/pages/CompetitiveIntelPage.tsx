import {
  AlertTriangle,
  Bell,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Megaphone,
  Minus,
  MonitorOff,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useApp } from "../context/AppContext";
import type {
  AlertSeverity,
  AlertType,
  CompetitorAlert,
  CompetitorProfile,
  VelocityTrend,
} from "../types/competitive";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

const NICHE_LABELS: Record<string, string> = {
  all: "All",
  plumber: "Plumber",
  med_spa: "Med Spa",
  hvac: "HVAC",
};

const SEVERITY_CONFIG: Record<
  AlertSeverity,
  { bg: string; text: string; border: string; icon: string }
> = {
  critical: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-500/30",
    icon: "text-red-400",
  },
  high: {
    bg: "bg-rose-500/15",
    text: "text-rose-300",
    border: "border-rose-500/30",
    icon: "text-rose-400",
  },
  medium: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/30",
    icon: "text-amber-400",
  },
  low: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    border: "border-border",
    icon: "text-muted-foreground",
  },
};

const ALERT_TYPE_ICON: Record<AlertType, React.ReactNode> = {
  rating_drop: <TrendingDown size={14} />,
  rating_increase: <TrendingUp size={14} />,
  review_surge: <Zap size={14} />,
  new_gbp_post: <Globe size={14} />,
  ad_detected: <Megaphone size={14} />,
  ad_paused: <MonitorOff size={14} />,
  review_velocity_spike: <TrendingUp size={14} />,
  listing_updated: <Building2 size={14} />,
};

const VELOCITY_CONFIG: Record<
  VelocityTrend,
  { icon: React.ReactNode; label: string; color: string }
> = {
  accelerating: {
    icon: <TrendingUp size={12} />,
    label: "Rising",
    color: "text-emerald-400",
  },
  steady: {
    icon: <Minus size={12} />,
    label: "Stable",
    color: "text-amber-400",
  },
  slowing: {
    icon: <TrendingDown size={12} />,
    label: "Slowing",
    color: "text-amber-400",
  },
  declining: {
    icon: <TrendingDown size={12} />,
    label: "Declining",
    color: "text-rose-400",
  },
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "red" | "emerald" | "amber" | "purple";
}) {
  const colorMap = {
    red: "text-red-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    purple: "text-primary",
  };
  const valueColor = accent ? colorMap[accent] : "text-foreground";
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          {label}
        </p>
        {sub && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Competitor Card ────────────────────────────────────────────────────────────

function CompetitorCard({
  competitor,
  index,
  onRemove,
}: {
  competitor: CompetitorProfile;
  index: number;
  onRemove: (id: string) => void;
}) {
  const [threshold, setThreshold] = useState(String(competitor.alertThreshold));
  const vel = VELOCITY_CONFIG[competitor.reviewVelocityTrend];

  return (
    <Card
      data-ocid={`competitive_intel.competitor.item.${index}`}
      className="bg-card border-border hover:border-primary/30 transition-colors"
    >
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-sm truncate">
                {competitor.competitorName}
              </h3>
              {competitor.isTracked && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              )}
            </div>
            <a
              href={`https://${competitor.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary/70 hover:text-primary flex items-center gap-0.5 mt-0.5 transition-colors"
            >
              {competitor.website}
              <ExternalLink size={10} />
            </a>
          </div>
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              data-ocid={`competitive_intel.competitor.edit_button.${index}`}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label={`Edit ${competitor.competitorName}`}
            >
              <Pencil size={12} />
            </button>
            <button
              type="button"
              data-ocid={`competitive_intel.competitor.delete_button.${index}`}
              onClick={() => onRemove(competitor.id)}
              onKeyDown={(e) => e.key === "Enter" && onRemove(competitor.id)}
              className="p-1.5 rounded text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              aria-label={`Remove ${competitor.competitorName}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-foreground">
              {competitor.googleRating.toFixed(1)}
            </span>
            {competitor.ratingChangePrevious !== 0 && (
              <span
                className={`text-[10px] font-medium ${competitor.ratingChangePrevious > 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {competitor.ratingChangePrevious > 0 ? "+" : ""}
                {competitor.ratingChangePrevious.toFixed(1)} wk
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {competitor.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          {/* Velocity */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/50 ${vel.color}`}
          >
            {vel.icon}
            {vel.label}
          </span>

          {/* Ad presence */}
          {competitor.adPresenceDetected ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/20">
              <Megaphone size={9} />
              Active Ads
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground border border-border">
              <MonitorOff size={9} />
              No Ads
            </span>
          )}

          {/* Niche */}
          <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {competitor.niche.replace("_", " ")}
          </span>
        </div>

        {/* GBP updated */}
        <p className="text-[10px] text-muted-foreground">
          GBP updated:{" "}
          <span className="text-foreground/70">
            {competitor.gbpLastUpdated}
          </span>
          {" · "}
          <span className="text-foreground/70">{competitor.city}</span>
        </p>

        {/* Alert threshold */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/50">
          <Label
            htmlFor={`threshold-${competitor.id}`}
            className="text-[10px] text-muted-foreground whitespace-nowrap"
          >
            Alert below
          </Label>
          <Input
            id={`threshold-${competitor.id}`}
            data-ocid={`competitive_intel.competitor.threshold.${index}`}
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="h-6 text-xs w-20 px-2 bg-muted/30 border-border"
          />
          <Star size={9} className="text-amber-400 fill-amber-400 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Alert Row ─────────────────────────────────────────────────────────────────

function AlertRow({
  alert,
  index,
  onDismiss,
}: {
  alert: CompetitorAlert;
  index: number;
  onDismiss: (id: string) => void;
}) {
  const sev = SEVERITY_CONFIG[alert.severity];
  const typeIcon = ALERT_TYPE_ICON[alert.alertType];

  if (alert.dismissed) return null;

  return (
    <div
      data-ocid={`competitive_intel.alert.item.${index}`}
      className={`flex items-start gap-3 p-3 rounded-lg border ${sev.bg} ${sev.border} transition-all`}
    >
      <span className={`mt-0.5 shrink-0 ${sev.icon}`}>{typeIcon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold ${sev.text}`}>
            {alert.competitorName}
          </span>
          <Badge
            variant="outline"
            className={`text-[9px] px-1.5 py-0 h-4 capitalize ${sev.text} border-current`}
          >
            {alert.severity}
          </Badge>
          <span className="text-[9px] text-muted-foreground capitalize bg-muted/40 px-1.5 py-0.5 rounded">
            {alert.alertType.replace(/_/g, " ")}
          </span>
        </div>
        <p className={`text-xs mt-1 leading-relaxed ${sev.text} opacity-90`}>
          {alert.message}
        </p>
        <p className="text-[10px] mt-1 text-muted-foreground/60">
          {relativeTime(alert.triggeredAt)}
        </p>
      </div>
      <button
        type="button"
        data-ocid={`competitive_intel.alert.dismiss.${index}`}
        onClick={() => onDismiss(alert.id)}
        onKeyDown={(e) => e.key === "Enter" && onDismiss(alert.id)}
        className="shrink-0 p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss alert"
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ─── Add Competitor Modal ───────────────────────────────────────────────────────

interface AddCompetitorFormData {
  competitorName: string;
  website: string;
  alertThreshold: string;
  niche: string;
  city: string;
}

function AddCompetitorModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: AddCompetitorFormData) => void;
}) {
  const [form, setForm] = useState<AddCompetitorFormData>({
    competitorName: "",
    website: "",
    alertThreshold: "4.0",
    niche: "plumber",
    city: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.competitorName.trim() || !form.website.trim()) return;
    onAdd(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="competitive_intel.add_competitor.dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
      />
      <Card className="relative w-full max-w-md bg-card border-border shadow-2xl z-10">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShieldAlert size={16} className="text-primary" />
              Add Competitor
            </CardTitle>
            <button
              type="button"
              data-ocid="competitive_intel.add_competitor.close_button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-name" className="text-xs font-medium">
                Competitor Name
              </Label>
              <Input
                id="add-name"
                data-ocid="competitive_intel.add_competitor.name_input"
                placeholder="e.g. FastFlow Plumbing"
                value={form.competitorName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, competitorName: e.target.value }))
                }
                className="bg-muted/30 border-border text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="add-website" className="text-xs font-medium">
                Website URL
              </Label>
              <Input
                id="add-website"
                data-ocid="competitive_intel.add_competitor.website_input"
                placeholder="e.g. fastflowplumbing.com"
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
                className="bg-muted/30 border-border text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="add-city" className="text-xs font-medium">
                  City
                </Label>
                <Input
                  id="add-city"
                  data-ocid="competitive_intel.add_competitor.city_input"
                  placeholder="e.g. San Diego"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                  className="bg-muted/30 border-border text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-niche" className="text-xs font-medium">
                  Niche
                </Label>
                <select
                  id="add-niche"
                  data-ocid="competitive_intel.add_competitor.niche_select"
                  value={form.niche}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, niche: e.target.value }))
                  }
                  className="w-full h-9 rounded-md bg-muted/30 border border-border text-sm text-foreground px-2 focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="plumber">Plumber</option>
                  <option value="med_spa">Med Spa</option>
                  <option value="hvac">HVAC</option>
                  <option value="restoration">Restoration</option>
                  <option value="carpet_cleaning">Carpet Cleaning</option>
                  <option value="roofing">Roofing</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="add-threshold" className="text-xs font-medium">
                Alert Threshold (rating drop below)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="add-threshold"
                  data-ocid="competitive_intel.add_competitor.threshold_input"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={form.alertThreshold}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, alertThreshold: e.target.value }))
                  }
                  className="bg-muted/30 border-border text-sm w-24"
                />
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-muted-foreground">
                  Alert when rating drops below this value
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                type="submit"
                data-ocid="competitive_intel.add_competitor.submit_button"
                className="flex-1"
              >
                <Plus size={14} className="mr-1.5" />
                Add Competitor
              </Button>
              <Button
                type="button"
                variant="outline"
                data-ocid="competitive_intel.add_competitor.cancel_button"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CompetitiveIntelPage() {
  const { competitorProfiles, competitorAlerts } = useApp();

  const [localProfiles, setLocalProfiles] =
    useState<CompetitorProfile[]>(competitorProfiles);
  const [localAlerts, setLocalAlerts] =
    useState<CompetitorAlert[]>(competitorAlerts);
  const [nicheFilter, setNicheFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortField, setSortField] = useState<"rating" | "reviews" | "velocity">(
    "rating",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const dismissAlert = (id: string) => {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, dismissed: true } : a)),
    );
  };

  const removeCompetitor = (id: string) => {
    setLocalProfiles((prev) => prev.filter((c) => c.id !== id));
  };

  const addCompetitor = (data: AddCompetitorFormData) => {
    const newProfile: CompetitorProfile = {
      id: `comp-${Date.now()}`,
      tenantId: "tenant-oceanside",
      competitorName: data.competitorName,
      website: data.website,
      niche: data.niche,
      city: data.city || "Unknown",
      googleRating: 4.0,
      ratingChangePrevious: 0,
      reviewCount: 0,
      reviewVelocityTrend: "steady",
      weeklyReviewCount: 0,
      gbpLastUpdated: "Just added",
      adPresenceDetected: false,
      lastAuditedAt: Date.now(),
      alertThreshold: Number.parseFloat(data.alertThreshold) || 4.0,
      isTracked: true,
    };
    setLocalProfiles((prev) => [newProfile, ...prev]);
    setShowAddModal(false);
  };

  const toggleSort = (col: typeof sortField) => {
    if (sortField === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortField(col);
      setSortDir("desc");
    }
  };

  const activeAlerts = localAlerts.filter((a) => !a.dismissed);

  const filteredProfiles = localProfiles
    .filter((c) => nicheFilter === "all" || c.niche === nicheFilter)
    .sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      if (sortField === "rating")
        return dir * (a.googleRating - b.googleRating);
      if (sortField === "reviews") return dir * (a.reviewCount - b.reviewCount);
      return dir * (a.weeklyReviewCount - b.weeklyReviewCount);
    });

  const avgRating =
    localProfiles.length > 0
      ? localProfiles.reduce((s, c) => s + c.googleRating, 0) /
        localProfiles.length
      : 0;

  const myRatingVsAvg = 4.8 - avgRating; // Simulated "your" rating = 4.8

  const SortIcon = ({ col }: { col: typeof sortField }) =>
    sortField !== col ? null : sortDir === "desc" ? (
      <ChevronDown size={11} />
    ) : (
      <ChevronUp size={11} />
    );

  return (
    <div className="space-y-6" data-ocid="competitive_intel.page">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Competitive Intelligence
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor competitor ratings, reviews, ads, and GBP activity in real
            time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            data-ocid="competitive_intel.refresh.button"
            className="gap-2 text-xs"
          >
            <RefreshCw size={13} />
            Refresh
          </Button>
          <Button
            size="sm"
            data-ocid="competitive_intel.add_competitor.open_modal_button"
            onClick={() => setShowAddModal(true)}
            className="gap-2 text-xs"
          >
            <Plus size={13} />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* ── Overview Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Competitors Tracked"
          value={localProfiles.filter((c) => c.isTracked).length}
          sub={`${localProfiles.length} total monitored`}
        />
        <StatCard
          label="Active Alerts"
          value={activeAlerts.length}
          sub={`${activeAlerts.filter((a) => a.severity === "critical" || a.severity === "high").length} high priority`}
          accent={activeAlerts.length > 0 ? "red" : undefined}
        />
        <StatCard
          label="Avg Competitor Rating"
          value={avgRating.toFixed(1)}
          sub="across all tracked"
          accent="amber"
        />
        <StatCard
          label="Your Rating vs Avg"
          value={`${myRatingVsAvg >= 0 ? "+" : ""}${myRatingVsAvg.toFixed(1)}`}
          sub="your rating: 4.8 ★"
          accent={myRatingVsAvg >= 0 ? "emerald" : "red"}
        />
      </div>

      {/* ── Niche Filter Tabs ── */}
      <div
        className="flex items-center gap-1 border-b border-border pb-2"
        data-ocid="competitive_intel.niche_filter.tab"
      >
        {Object.entries(NICHE_LABELS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            data-ocid={`competitive_intel.filter.${key}`}
            onClick={() => setNicheFilter(key)}
            onKeyDown={(e) => e.key === "Enter" && setNicheFilter(key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              nicheFilter === key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {label}
            {key !== "all" && (
              <span className="ml-1.5 opacity-60">
                ({localProfiles.filter((c) => c.niche === key).length})
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {filteredProfiles.length} competitor
          {filteredProfiles.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Competitor Cards Grid ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sort controls */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Sort by:</span>
            {(
              [
                ["rating", "Rating"],
                ["reviews", "Reviews"],
                ["velocity", "Velocity"],
              ] as const
            ).map(([col, lbl]) => (
              <button
                key={col}
                type="button"
                data-ocid={`competitive_intel.sort.${col}`}
                onClick={() => toggleSort(col)}
                onKeyDown={(e) => e.key === "Enter" && toggleSort(col)}
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded transition-colors ${
                  sortField === col
                    ? "bg-primary/20 text-primary font-medium"
                    : "hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {lbl}
                <SortIcon col={col} />
              </button>
            ))}
          </div>

          {/* Cards */}
          {filteredProfiles.length === 0 ? (
            <div
              data-ocid="competitive_intel.competitors.empty_state"
              className="text-center py-12 border border-dashed border-border rounded-xl"
            >
              <Building2
                size={32}
                className="mx-auto mb-3 text-muted-foreground/40"
              />
              <p className="text-sm font-medium text-foreground">
                No competitors tracked yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add a competitor to start monitoring their ratings and activity
              </p>
              <Button
                size="sm"
                className="mt-4 gap-2"
                onClick={() => setShowAddModal(true)}
                data-ocid="competitive_intel.competitors.empty_state.add_button"
              >
                <Plus size={13} />
                Add Your First Competitor
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredProfiles.map((c, i) => (
                <CompetitorCard
                  key={c.id}
                  competitor={c}
                  index={i + 1}
                  onRemove={removeCompetitor}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-4">
          {/* Active Alerts Panel */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Bell size={14} className="text-amber-400" />
                  Active Alerts
                  {activeAlerts.length > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {activeAlerts.length}
                    </span>
                  )}
                </CardTitle>
                {activeAlerts.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setLocalAlerts((prev) =>
                        prev.map((a) => ({ ...a, dismissed: true })),
                      )
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setLocalAlerts((prev) =>
                        prev.map((a) => ({ ...a, dismissed: true })),
                      )
                    }
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline"
                    data-ocid="competitive_intel.alerts.dismiss_all"
                  >
                    Dismiss all
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2 pt-3 max-h-[420px] overflow-y-auto">
              {activeAlerts.length === 0 ? (
                <div
                  data-ocid="competitive_intel.alerts.empty_state"
                  className="text-center py-8"
                >
                  <Bell
                    size={24}
                    className="mx-auto mb-2 text-muted-foreground/30"
                  />
                  <p className="text-xs text-muted-foreground font-medium">
                    No active alerts
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    You'll be notified when competitors make significant moves
                  </p>
                </div>
              ) : (
                localAlerts.map((alert, i) => (
                  <AlertRow
                    key={alert.id}
                    alert={alert}
                    index={i + 1}
                    onDismiss={dismissAlert}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Market Summary */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 size={14} className="text-indigo-400" />
                Market Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {[
                {
                  label: "Running ads",
                  value: `${filteredProfiles.filter((c) => c.adPresenceDetected).length} / ${filteredProfiles.length}`,
                  icon: <Megaphone size={12} className="text-rose-400" />,
                  accent: filteredProfiles.some((c) => c.adPresenceDetected),
                },
                {
                  label: "GBP active this week",
                  value: `${filteredProfiles.filter((c) => c.gbpLastUpdated.includes("day") || c.gbpLastUpdated === "Yesterday").length} / ${filteredProfiles.length}`,
                  icon: <Globe size={12} className="text-primary" />,
                  accent: false,
                },
                {
                  label: "Accelerating velocity",
                  value: `${filteredProfiles.filter((c) => c.reviewVelocityTrend === "accelerating").length} competitor${filteredProfiles.filter((c) => c.reviewVelocityTrend === "accelerating").length !== 1 ? "s" : ""}`,
                  icon: <TrendingUp size={12} className="text-emerald-400" />,
                  accent: false,
                },
                {
                  label: "Declining velocity",
                  value: `${filteredProfiles.filter((c) => c.reviewVelocityTrend === "declining").length} competitor${filteredProfiles.filter((c) => c.reviewVelocityTrend === "declining").length !== 1 ? "s" : ""}`,
                  icon: <TrendingDown size={12} className="text-rose-400" />,
                  accent: false,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-semibold ${item.accent ? "text-rose-400" : "text-foreground"}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Add Competitor Modal ── */}
      {showAddModal && (
        <AddCompetitorModal
          onClose={() => setShowAddModal(false)}
          onAdd={addCompetitor}
        />
      )}
    </div>
  );
}
