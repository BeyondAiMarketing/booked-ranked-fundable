import { Link } from "@tanstack/react-router";
import { Box, Heart, Info, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HealthScoreDetailPanel from "../components/HealthScoreDetailPanel";
import {
  PhoneNumberManager,
  PhoneStatusBadge,
} from "../components/PhoneNumberManager";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { type TenantEntry, useApp } from "../context/AppContext";
import { LEADS, REVIEWS } from "../data/demoData";
import { useActor } from "../hooks/useActor";
import {
  getHealthArcColor,
  getHealthColor,
  getStatusLabel,
} from "../types/healthScore";
import type { ClientHealthScore } from "../types/healthScore";

const CAMPAIGN_IDS = [
  "plumb-missed-call",
  "plumb-estimate-recovery",
  "plumb-review-referral",
  "spa-consult-nurture",
  "spa-noshow-recovery",
  "spa-rebook-membership",
];

const SCANNER_NICHES = new Set([
  "Real Estate",
  "Roofing",
  "Restoration",
  "real-estate",
  "roofing",
  "restoration",
]);

export default function AdminPage() {
  const {
    tenants,
    addTenant,
    deleteTenant,
    setAuditOverride,
    setFundabilityOverride,
    auditOverrides,
    fundabilityOverrides,
    socialMediaEnabled,
    setSocialMediaEnabledForTenant,
    scanner3dEnabled,
    setScanner3dEnabledForTenant,
    campaignToggles,
    setCampaignToggle,
    getClientHealthScore,
  } = useApp();
  const { actor } = useActor();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    type: "",
    website: "",
    phone: "",
    address: "",
  });
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [auditScore, setAuditScore] = useState("");
  const [fundScore, setFundScore] = useState("");
  const [healthDetailScore, setHealthDetailScore] =
    useState<ClientHealthScore | null>(null);

  // 3D Scanner Toggle Log — real backend data
  interface ToggleLogEntry {
    tenantId: string;
    action: string;
    enabled: boolean;
    ts: bigint;
  }
  const [toggleLog, setToggleLog] = useState<ToggleLogEntry[]>([]);
  const [toggleLogLoading, setToggleLogLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    let cancelled = false;
    setToggleLogLoading(true);
    actor
      .getScanner3dToggleLog()
      .then((entries) => {
        if (cancelled) return;
        setToggleLog(
          entries.map(([tenantId, action, enabled, ts]) => ({
            tenantId,
            action,
            enabled,
            ts,
          })),
        );
      })
      .catch(() => {
        /* ignore — fallback to empty */
      })
      .finally(() => {
        if (!cancelled) setToggleLogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [actor]);

  const totalLeads = Object.values(LEADS).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );
  const totalReviews = Object.values(REVIEWS).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const handleAddTenant = () => {
    if (!newTenant.name.trim()) {
      toast.error("Business name is required");
      return;
    }
    const tenant: TenantEntry = {
      id: `tenant-${Date.now()}`,
      name: newTenant.name,
      type: newTenant.type || "General",
      website: newTenant.website,
      phone: newTenant.phone,
      address: newTenant.address,
    };
    addTenant(tenant);
    setNewTenant({ name: "", type: "", website: "", phone: "", address: "" });
    setShowAddForm(false);
    toast.success(`"${tenant.name}" added successfully`);
  };

  const handleDeleteTenant = (id: string, name: string) => {
    deleteTenant(id);
    toast.success(`"${name}" removed`);
  };

  const handleSaveOverride = () => {
    if (!selectedTenantId) {
      toast.error("Please select a tenant");
      return;
    }
    const aScore = Number(auditScore);
    const fScore = Number(fundScore);
    if (auditScore !== "" && (aScore < 0 || aScore > 100)) {
      toast.error("Audit score must be 0-100");
      return;
    }
    if (fundScore !== "" && (fScore < 0 || fScore > 100)) {
      toast.error("Fundability score must be 0-100");
      return;
    }
    if (auditScore !== "") setAuditOverride(selectedTenantId, aScore);
    if (fundScore !== "") setFundabilityOverride(selectedTenantId, fScore);
    toast.success("Score overrides saved");
  };

  const selectedTenantName = tenants.find(
    (t) => t.id === selectedTenantId,
  )?.name;

  return (
    <div className="space-y-8">
      {/* Quick Links Row */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/domain-setup"
          data-ocid="admin.domain_setup.link"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/15 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/25 transition-smooth"
        >
          🌐 Domain Setup Agent
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          data-ocid="admin.stats.card"
          className="bg-gradient-to-br from-indigo-600 to-indigo-700 border-0 text-white"
        >
          <CardContent className="pt-6 pb-4">
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              Total Tenants
            </p>
            <p className="text-4xl font-bold mt-1">{tenants.length}</p>
          </CardContent>
        </Card>
        <Card
          data-ocid="admin.stats.card"
          className="bg-gradient-to-br from-emerald-600 to-emerald-700 border-0 text-white"
        >
          <CardContent className="pt-6 pb-4">
            <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              Total Leads
            </p>
            <p className="text-4xl font-bold mt-1">{totalLeads}</p>
          </CardContent>
        </Card>
        <Card
          data-ocid="admin.stats.card"
          className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 text-white"
        >
          <CardContent className="pt-6 pb-4">
            <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">
              Total Reviews
            </p>
            <p className="text-4xl font-bold mt-1">{totalReviews}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Management */}
      <Card data-ocid="admin.tenants.card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Tenant Management
            </CardTitle>
            <p className="text-xs text-slate-200 mt-0.5">
              Manage clients and provision dedicated phone numbers per account.
            </p>
          </div>
          <Button
            data-ocid="admin.tenant.open_modal_button"
            size="sm"
            onClick={() => setShowAddForm((v) => !v)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus size={14} className="mr-1" />
            {showAddForm ? "Cancel" : "Add Tenant"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <div
              data-ocid="admin.tenant.modal"
              className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3"
            >
              <p className="text-sm font-semibold text-slate-700">
                New Business Tenant
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-600">
                    Business Name *
                  </Label>
                  <Input
                    data-ocid="admin.tenant.input"
                    value={newTenant.name}
                    onChange={(e) =>
                      setNewTenant((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Sunrise Landscaping"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600">
                    Business Type
                  </Label>
                  <Input
                    data-ocid="admin.tenant.input"
                    value={newTenant.type}
                    onChange={(e) =>
                      setNewTenant((p) => ({ ...p, type: e.target.value }))
                    }
                    placeholder="e.g. Landscaping"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600">Website</Label>
                  <Input
                    data-ocid="admin.tenant.input"
                    value={newTenant.website}
                    onChange={(e) =>
                      setNewTenant((p) => ({ ...p, website: e.target.value }))
                    }
                    placeholder="example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600">Phone</Label>
                  <Input
                    data-ocid="admin.tenant.input"
                    value={newTenant.phone}
                    onChange={(e) =>
                      setNewTenant((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="(555) 000-0000"
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-slate-600">Address</Label>
                  <Input
                    data-ocid="admin.tenant.input"
                    value={newTenant.address}
                    onChange={(e) =>
                      setNewTenant((p) => ({ ...p, address: e.target.value }))
                    }
                    placeholder="123 Main St, City, CA 90000"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                data-ocid="admin.tenant.submit_button"
                onClick={handleAddTenant}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                size="sm"
              >
                Save Tenant
              </Button>
            </div>
          )}

          {/* Tenant Cards with Phone Management */}
          <div className="space-y-2" data-ocid="admin.tenants.table">
            {tenants.map((tenant, i) => {
              const healthScore = getClientHealthScore(tenant.id);
              return (
                <div
                  key={tenant.id}
                  data-ocid={`admin.tenants.item.${i + 1}`}
                  className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  {/* Tenant row header */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Business info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-white truncate">
                          {tenant.name}
                        </span>
                        <span className="text-xs text-slate-200 shrink-0">
                          {tenant.type}
                        </span>
                        {/* Phone status badge inline */}
                        <PhoneStatusBadge tenant={tenant} />
                      </div>
                      {tenant.website && (
                        <p className="text-xs text-slate-600 mt-0.5 truncate">
                          {tenant.website}
                        </p>
                      )}
                    </div>

                    {/* Health Score Badge */}
                    {healthScore && (
                      <button
                        type="button"
                        data-ocid={`admin.tenant.health.${i + 1}`}
                        onClick={() => setHealthDetailScore(healthScore)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors shrink-0"
                        title={`Health: ${getStatusLabel(healthScore.overallScore)}`}
                      >
                        <Heart size={12} className="text-rose-400" />
                        <span
                          className={`text-xs font-bold ${getHealthColor(healthScore.overallScore)}`}
                        >
                          {healthScore.overallScore}
                        </span>
                        <svg
                          width="20"
                          height="20"
                          className="-rotate-90 shrink-0"
                          role="img"
                          aria-label={`Score ${healthScore.overallScore}`}
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="2.5"
                          />
                          <circle
                            cx="10"
                            cy="10"
                            r="8"
                            fill="none"
                            stroke={getHealthArcColor(healthScore.overallScore)}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 8}
                            strokeDashoffset={
                              2 *
                              Math.PI *
                              8 *
                              (1 - healthScore.overallScore / 100)
                            }
                          />
                        </svg>
                      </button>
                    )}

                    {/* Controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-200 hidden sm:inline">
                          Social
                        </span>
                        <Switch
                          data-ocid={`admin.tenant.social.switch.${i + 1}`}
                          checked={socialMediaEnabled[tenant.id] ?? false}
                          onCheckedChange={(v) => {
                            setSocialMediaEnabledForTenant(tenant.id, v);
                            toast.success(
                              v
                                ? `Social Media enabled for ${tenant.name}`
                                : `Social Media disabled for ${tenant.name}`,
                            );
                          }}
                        />
                      </div>
                      <Button
                        data-ocid={`admin.tenant.delete_button.${i + 1}`}
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleDeleteTenant(tenant.id, tenant.name)
                        }
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>

                  {/* Phone Number Manager (collapsible) */}
                  <PhoneNumberManager tenant={tenant} index={i + 1} />
                </div>
              );
            })}

            {tenants.length === 0 && (
              <div
                data-ocid="admin.tenants.empty_state"
                className="text-center text-slate-200 py-10 rounded-xl border border-white/5 bg-white/[0.02]"
              >
                No tenants yet. Add one above.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Score Override Panel */}
      <Card data-ocid="admin.overrides.card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Score Override Panel
          </CardTitle>
          <p className="text-sm text-slate-200">
            Override audit and fundability scores for any tenant.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-slate-600 mb-1 block">
              Select Tenant
            </Label>
            <Select
              value={selectedTenantId}
              onValueChange={setSelectedTenantId}
            >
              <SelectTrigger
                data-ocid="admin.overrides.select"
                className="max-w-sm"
              >
                <SelectValue placeholder="Choose a tenant..." />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTenantId && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
              <p className="text-sm font-medium text-slate-700">
                Overrides for{" "}
                <span className="text-indigo-600">{selectedTenantName}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">
                    Audit Score (0–100)
                    {auditOverrides[selectedTenantId] !== undefined && (
                      <span className="ml-2 text-indigo-600 font-semibold">
                        Current: {auditOverrides[selectedTenantId]}
                      </span>
                    )}
                  </Label>
                  <Input
                    data-ocid="admin.overrides.input"
                    type="number"
                    min={0}
                    max={100}
                    value={auditScore}
                    onChange={(e) => setAuditScore(e.target.value)}
                    placeholder="e.g. 85"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">
                    Fundability Score (0–100)
                    {fundabilityOverrides[selectedTenantId] !== undefined && (
                      <span className="ml-2 text-indigo-600 font-semibold">
                        Current: {fundabilityOverrides[selectedTenantId]}
                      </span>
                    )}
                  </Label>
                  <Input
                    data-ocid="admin.overrides.input"
                    type="number"
                    min={0}
                    max={100}
                    value={fundScore}
                    onChange={(e) => setFundScore(e.target.value)}
                    placeholder="e.g. 78"
                  />
                </div>
              </div>
              <Button
                data-ocid="admin.overrides.save_button"
                onClick={handleSaveOverride}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                size="sm"
              >
                Save Overrides
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Access Control */}
      <Card data-ocid="admin.modules.card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Module Access Control
          </CardTitle>
          <p className="text-sm text-slate-200">
            Enable or disable optional modules per tenant.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Social Media</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Chat Widget</TableHead>
                <TableHead>Voice Agent</TableHead>
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-default">
                          3D Scanner
                          <Info size={12} className="text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        3D Scanner — enabled for Real Estate, Roofing, and
                        Restoration accounts only. Has no effect on other
                        niches.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant, i) => {
                const nicheSupported = SCANNER_NICHES.has(tenant.type);
                return (
                  <TableRow
                    key={tenant.id}
                    data-ocid={`admin.modules.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {tenant.name}
                    </TableCell>
                    <TableCell>
                      <Switch
                        data-ocid={`admin.modules.social.switch.${i + 1}`}
                        checked={socialMediaEnabled[tenant.id] ?? false}
                        onCheckedChange={(v) => {
                          setSocialMediaEnabledForTenant(tenant.id, v);
                          toast.success(
                            v
                              ? `Social Media enabled for ${tenant.name}`
                              : `Social Media disabled for ${tenant.name}`,
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        data-ocid={`admin.modules.campaigns.switch.${i + 1}`}
                        checked={(() => {
                          const t = campaignToggles[tenant.id];
                          if (!t) return true;
                          return Object.values(t).some(Boolean);
                        })()}
                        onCheckedChange={(v) => {
                          for (const cid of CAMPAIGN_IDS)
                            setCampaignToggle(tenant.id, cid, v);
                          toast.success(
                            v
                              ? `Campaigns enabled for ${tenant.name}`
                              : `Campaigns disabled for ${tenant.name}`,
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Switch
                                disabled
                                checked={false}
                                data-ocid={`admin.modules.chat.switch.${i + 1}`}
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Switch
                                disabled
                                checked={false}
                                data-ocid={`admin.modules.voice.switch.${i + 1}`}
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {nicheSupported ? (
                        <Switch
                          data-ocid={`admin.modules.scanner3d.switch.${i + 1}`}
                          checked={scanner3dEnabled[tenant.id] ?? false}
                          onCheckedChange={(v) => {
                            setScanner3dEnabledForTenant(tenant.id, v);
                            toast.success(
                              v
                                ? `3D Scanner enabled for ${tenant.name}`
                                : `3D Scanner disabled for ${tenant.name}`,
                            );
                          }}
                        />
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                data-ocid={`admin.modules.scanner3d.na.${i + 1}`}
                                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground border border-white/10 rounded-full px-2 py-0.5"
                              >
                                <Box size={9} />
                                N/A
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                3D Scanner is only available for Real Estate,
                                Roofing, and Restoration niches.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3D Scanner Toggle Log */}
      <Card data-ocid="admin.scanner3d_log.card">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Box size={15} className="text-primary" />
            3D Scanner Toggle Log
          </CardTitle>
          <p className="text-sm text-slate-200">
            Recent activation changes for the 3D Scanner module across all
            accounts.
          </p>
        </CardHeader>
        <CardContent>
          {toggleLogLoading ? (
            <div
              data-ocid="admin.scanner3d_log.loading_state"
              className="flex items-center gap-2 text-sm text-muted-foreground py-4"
            >
              <Loader2 size={14} className="animate-spin" />
              Loading toggle history…
            </div>
          ) : toggleLog.length === 0 ? (
            <div
              data-ocid="admin.scanner3d_log.empty_state"
              className="text-sm text-muted-foreground py-4 text-center"
            >
              No toggle history yet.
            </div>
          ) : (
            <div className="space-y-2">
              {toggleLog.map((entry, i) => (
                <div
                  key={`${entry.tenantId}-${String(entry.ts)}`}
                  data-ocid={`admin.scanner3d_log.item.${i + 1}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-sm"
                >
                  <Box
                    size={13}
                    className={
                      entry.enabled ? "text-emerald-400" : "text-slate-400"
                    }
                  />
                  <span className="text-foreground font-medium flex-1 truncate">
                    {entry.tenantId}
                  </span>
                  <span
                    className={`text-xs font-semibold ${entry.enabled ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {entry.enabled ? "enabled" : "disabled"}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {entry.action}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(Number(entry.ts) / 1_000_000).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Score Detail Panel */}
      {healthDetailScore &&
        (() => {
          const t = tenants.find((x) => x.id === healthDetailScore.tenantId);
          return t ? (
            <HealthScoreDetailPanel
              score={healthDetailScore}
              tenant={t}
              onClose={() => setHealthDetailScore(null)}
            />
          ) : null;
        })()}
    </div>
  );
}
