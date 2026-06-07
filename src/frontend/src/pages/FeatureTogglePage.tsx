import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Lock,
  RefreshCw,
  Settings2,
  Sliders,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface FeatureToggle {
  featureName: string;
  basicEnabled: boolean;
  proEnabled: boolean;
  agencyEnabled: boolean;
  lastModifiedTime: bigint;
  lastModifiedBy: string;
}

interface FeatureToggleLog {
  id: string;
  featureName: string;
  tier: string;
  previousValue: boolean;
  newValue: boolean;
  modifiedBy: string;
  modifiedAt: bigint;
}

const FEATURES = [
  {
    name: "Lead Finder",
    desc: "AI-powered lead discovery and enrichment from multiple sources",
  },
  {
    name: "Front Desk AI",
    desc: "Automated inbound call handling and SMS follow-up",
  },
  {
    name: "Outreach Pipeline",
    desc: "Visual drag-and-drop outreach sequence management",
  },
  {
    name: "CRM",
    desc: "Full customer relationship management with pipeline tracking",
  },
  {
    name: "Social Engine",
    desc: "Multi-platform social media scheduling and engagement",
  },
  {
    name: "Reputation Manager",
    desc: "Review monitoring, requests, and automated responses",
  },
  {
    name: "Credit Builder",
    desc: "Business fundability scoring and credit building roadmap",
  },
  { name: "Campaigns", desc: "Email and SMS drip campaign automation" },
  {
    name: "Analytics",
    desc: "Advanced attribution, revenue tracking, and conversion funnels",
  },
  {
    name: "Booking",
    desc: "AI appointment booking with calendar sync and SMS reminders",
  },
  {
    name: "Website Studio",
    desc: "Niche website builder with AI-generated copy and SEO",
  },
  {
    name: "Autopilot",
    desc: "Autonomous outreach and lead nurturing on scheduled cadences",
  },
  {
    name: "Reports",
    desc: "AI-generated branded weekly and monthly client reports",
  },
  {
    name: "AI Chat",
    desc: "Admin and client-facing AI assistant with RAG knowledge base",
  },
];

type Tier = "Basic" | "Pro" | "Agency";
type TierKey = "basicEnabled" | "proEnabled" | "agencyEnabled";

const TIER_MAP: Record<Tier, TierKey> = {
  Basic: "basicEnabled",
  Pro: "proEnabled",
  Agency: "agencyEnabled",
};

function fmtTime(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleString();
}

export default function FeatureTogglePage() {
  const { actor } = useActor();
  const [toggles, setToggles] = useState<FeatureToggle[]>([]);
  const [logs, setLogs] = useState<FeatureToggleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsOpen, setLogsOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Bulk apply
  const [bulkTier, setBulkTier] = useState<Tier>("Basic");
  const [bulkAction, setBulkAction] = useState<"Enable All" | "Disable All">(
    "Enable All",
  );
  const [bulkApplying, setBulkApplying] = useState(false);

  // Preview mode
  const [previewMode, setPreviewMode] = useState(false);
  const [previewTier, setPreviewTier] = useState<Tier>("Basic");

  const fetchData = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const [rawToggles, rawLogs] = await Promise.all([
        actor.getFeatureToggles(),
        actor.getFeatureToggleLogs(),
      ]);

      // Merge fetched toggles with our known feature list so all 14 always show
      const byName = new Map<string, FeatureToggle>();
      for (const t of rawToggles as FeatureToggle[]) {
        byName.set(t.featureName, t);
      }

      const merged = FEATURES.map(
        (f) =>
          byName.get(f.name) ?? {
            featureName: f.name,
            basicEnabled: false,
            proEnabled: false,
            agencyEnabled: false,
            lastModifiedTime: 0n,
            lastModifiedBy: "",
          },
      );

      setToggles(merged);
      setLogs((rawLogs as FeatureToggleLog[]).slice(0, 20));
    } catch {
      toast.error("Failed to load feature toggles");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor) fetchData();
  }, [fetchData, actor]);

  const handleToggle = async (
    featureName: string,
    tier: Tier,
    newValue: boolean,
  ) => {
    if (!actor) return;
    const tierKey = TIER_MAP[tier];
    // Optimistic update
    setToggles((prev) =>
      prev.map((t) =>
        t.featureName === featureName ? { ...t, [tierKey]: newValue } : t,
      ),
    );
    try {
      await actor.setFeatureToggle(featureName, tier, newValue, "admin");
      toast.success(
        `${featureName} ${tier}: ${newValue ? "Enabled" : "Disabled"}`,
      );
      fetchData();
    } catch {
      // Rollback
      setToggles((prev) =>
        prev.map((t) =>
          t.featureName === featureName ? { ...t, [tierKey]: !newValue } : t,
        ),
      );
      toast.error(`Failed to update ${featureName}`);
    }
  };

  const handleBulkApply = async () => {
    if (!actor) return;
    setBulkApplying(true);
    const isEnable = bulkAction === "Enable All";
    const updates: [string, boolean][] = FEATURES.map((f) => [
      f.name,
      isEnable,
    ]);
    try {
      await actor.bulkSetFeatureToggles(bulkTier, updates, "admin");
      toast.success(
        `All features ${isEnable ? "enabled" : "disabled"} for ${bulkTier} tier`,
      );
      fetchData();
    } catch {
      toast.error("Bulk update failed");
    } finally {
      setBulkApplying(false);
    }
  };

  const handleReset = async () => {
    if (!actor) return;
    setResetting(true);
    try {
      await actor.resetToDefaults();
      toast.success("Feature toggles reset to defaults");
      fetchData();
    } catch {
      toast.error("Reset failed");
    } finally {
      setResetting(false);
      setResetModalOpen(false);
    }
  };

  const getToggleVal = (t: FeatureToggle, tier: Tier) => t[TIER_MAP[tier]];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center">
            <Sliders size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Feature Toggles
            </h1>
            <p className="text-sm text-muted-foreground">
              Control feature access by client tier
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchData}
            data-ocid="feature-toggles.refresh_button"
            className="border-white/10 bg-white/5 hover:bg-white/10"
          >
            <RefreshCw size={14} className="mr-1.5" />
            Refresh
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setResetModalOpen(true)}
            data-ocid="feature-toggles.reset_button"
          >
            <Settings2 size={14} className="mr-1.5" />
            Reset Defaults
          </Button>
        </div>
      </div>

      {/* Bulk Apply Bar */}
      <div className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm font-semibold text-foreground whitespace-nowrap">
            Bulk Apply
          </p>
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <Select
              value={bulkTier}
              onValueChange={(v) => setBulkTier(v as Tier)}
            >
              <SelectTrigger
                className="w-32 bg-white/5 border-white/10"
                data-ocid="feature-toggles.bulk_tier_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Agency">Agency</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={bulkAction}
              onValueChange={(v) => setBulkAction(v as typeof bulkAction)}
            >
              <SelectTrigger
                className="w-36 bg-white/5 border-white/10"
                data-ocid="feature-toggles.bulk_action_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Enable All">Enable All</SelectItem>
                <SelectItem value="Disable All">Disable All</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              onClick={handleBulkApply}
              disabled={bulkApplying}
              data-ocid="feature-toggles.bulk_apply_button"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {bulkApplying ? "Applying…" : "Apply to All"}
            </Button>
          </div>

          {/* Preview Mode */}
          <div className="flex items-center gap-2 ml-auto">
            <Eye size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Preview</span>
            <Switch
              checked={previewMode}
              onCheckedChange={setPreviewMode}
              data-ocid="feature-toggles.preview_toggle"
            />
            {previewMode && (
              <Select
                value={previewTier}
                onValueChange={(v) => setPreviewTier(v as Tier)}
              >
                <SelectTrigger
                  className="w-28 bg-white/5 border-white/10 h-7 text-xs"
                  data-ocid="feature-toggles.preview_tier_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.name}
              className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm p-4 animate-pulse h-40"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const toggle = toggles.find((t) => t.featureName === f.name) ?? {
              featureName: f.name,
              basicEnabled: false,
              proEnabled: false,
              agencyEnabled: false,
              lastModifiedTime: 0n,
              lastModifiedBy: "",
            };

            const isLockedInPreview =
              previewMode && !getToggleVal(toggle, previewTier);

            return (
              <div
                key={f.name}
                className="relative rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm p-4 flex flex-col gap-3 transition-all duration-200 hover:border-indigo-500/30"
                data-ocid={`feature-toggles.item.${i + 1}`}
              >
                {/* Lock overlay for preview mode */}
                {isLockedInPreview && (
                  <div className="absolute inset-0 rounded-xl bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
                    <Lock size={18} className="text-muted-foreground" />
                    <p className="text-xs text-muted-foreground text-center px-2">
                      Not available on {previewTier} plan
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {f.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {f.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/8">
                  {(["Basic", "Pro", "Agency"] as Tier[]).map((tier) => {
                    const val = getToggleVal(toggle, tier);
                    return (
                      <div
                        key={tier}
                        className="flex flex-col items-center gap-1 flex-1"
                      >
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                          {tier}
                        </span>
                        <Switch
                          checked={val}
                          onCheckedChange={(v) => handleToggle(f.name, tier, v)}
                          data-ocid={`feature-toggles.${f.name.toLowerCase().replace(/\s+/g, "-")}.${tier.toLowerCase()}_toggle`}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Audit Log */}
      <div className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm overflow-hidden">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
          onClick={() => setLogsOpen((v) => !v)}
          data-ocid="feature-toggles.audit_log_toggle"
        >
          <span>Audit Log</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-white/10 text-xs">
              {logs.length} entries
            </Badge>
            {logsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {logsOpen && (
          <ScrollArea className="max-h-72">
            <div className="px-4 pb-4">
              {logs.length === 0 ? (
                <p
                  className="text-sm text-muted-foreground text-center py-6"
                  data-ocid="feature-toggles.audit_log.empty_state"
                >
                  No audit log entries yet
                </p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["Time", "Feature", "Tier", "Change", "By"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-3 text-muted-foreground font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, idx) => (
                      <tr
                        key={log.id}
                        className="border-b border-white/5 hover:bg-white/5"
                        data-ocid={`feature-toggles.audit_log.item.${idx + 1}`}
                      >
                        <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">
                          {fmtTime(log.modifiedAt)}
                        </td>
                        <td className="py-2 pr-3 font-medium text-foreground">
                          {log.featureName}
                        </td>
                        <td className="py-2 pr-3">
                          <Badge
                            variant="outline"
                            className="border-white/10 text-[10px] py-0"
                          >
                            {log.tier}
                          </Badge>
                        </td>
                        <td className="py-2 pr-3">
                          <span
                            className={
                              log.newValue ? "text-green-400" : "text-red-400"
                            }
                          >
                            {log.previousValue ? "ON" : "OFF"} →{" "}
                            {log.newValue ? "ON" : "OFF"}
                          </span>
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {log.modifiedBy || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent
          className="bg-card/90 backdrop-blur-xl border-white/10"
          data-ocid="feature-toggles.reset_dialog"
        >
          <DialogHeader>
            <DialogTitle>Reset to Defaults?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will reset all feature toggles across all tiers to their
            default values. This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetModalOpen(false)}
              data-ocid="feature-toggles.reset_dialog.cancel_button"
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleReset}
              disabled={resetting}
              data-ocid="feature-toggles.reset_dialog.confirm_button"
            >
              {resetting ? "Resetting…" : "Yes, Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
