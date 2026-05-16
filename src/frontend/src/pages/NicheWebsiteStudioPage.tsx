import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Globe,
  Info,
  Link2,
  Lock,
  MessageSquare,
  Share2,
  Trash2,
  Unlock,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import NicheWebsiteRenderer from "../components/NicheWebsiteRenderer";
import ProspectCommentBar, {
  type ProspectComment,
} from "../components/ProspectCommentBar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useApp } from "../context/AppContext";
import {
  type ClientWebsiteConfig,
  NICHE_WEBSITES,
  type NicheWebsite,
  type NicheWebsiteId,
  type PreviewLink,
  createPreviewLink,
  getAllClientWebsiteConfigs,
  getAllPreviewLinks,
  getNicheOptions,
  getWebsiteById,
  normalizeNicheId,
  revokePreviewLink,
  saveClientWebsiteConfig,
} from "../data/nicheWebsiteData";

// ── Extended Preview Link State (expiry + comments + approval) ────────────────

type ExpiryOption = "24h" | "3d" | "7d" | "30d" | "never";

interface LinkMeta {
  expiryOption: ExpiryOption;
  expiresAt: number | null; // unix ms, null = never
  comments: ProspectComment[];
  approved: boolean;
}

const EXPIRY_LABELS: Record<ExpiryOption, string> = {
  "24h": "24 hours",
  "3d": "3 days",
  "7d": "7 days",
  "30d": "30 days",
  never: "No expiry",
};

function calcExpiry(option: ExpiryOption): number | null {
  const now = Date.now();
  if (option === "never") return null;
  const map: Record<string, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "3d": 3 * 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  return now + (map[option] ?? 0);
}

function isLinkExpired(meta: LinkMeta): boolean {
  if (meta.expiresAt === null) return false;
  return Date.now() > meta.expiresAt;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeDefaultConfig(
  tenantId: string,
  websiteId: NicheWebsiteId,
): ClientWebsiteConfig {
  return {
    tenantId,
    websiteId,
    isPublished: false,
    editingLocked: false,
    publishedUrl: `https://${tenantId.replace(/[^a-z0-9]/gi, "")}.mybrf.site`,
    customizations: {
      sectionOverrides: {},
      hiddenSections: [],
    },
    lastUpdated: new Date().toISOString(),
  };
}

function getPreviewUrl(linkId: string): string {
  return `${window.location.origin}/preview/${linkId}`;
}

// ── Thumbnail Preview ──────────────────────────────────────────────────────────

function WebsiteThumbnail({
  website,
  className = "",
}: {
  website: NicheWebsite;
  className?: string;
}) {
  const t = website.theme;
  return (
    <div
      className={`rounded-lg overflow-hidden border ${className}`}
      style={{ borderColor: `${t.primaryColor}40`, background: t.bgColor }}
    >
      <div
        className="h-12 flex items-center justify-center relative overflow-hidden"
        style={{ background: t.bgColor }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})`,
          }}
        />
        <div className="relative z-10 text-center px-2">
          <div
            className="text-[7px] font-black truncate"
            style={{ color: t.textColor, maxWidth: 120 }}
          >
            {website.name}
          </div>
        </div>
      </div>
      <div className="p-1.5 space-y-1">
        <div
          className="h-1.5 rounded-full opacity-60"
          style={{ background: t.primaryColor, width: "70%" }}
        />
        <div
          className="h-1 rounded-full opacity-30"
          style={{ background: t.textColor, width: "90%" }}
        />
        <div
          className="h-1 rounded-full opacity-30"
          style={{ background: t.textColor, width: "60%" }}
        />
        <div className="grid grid-cols-3 gap-0.5 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-4 rounded opacity-20"
              style={{ background: t.primaryColor }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-0.5 p-1.5 pt-0">
        {website.colorSwatches.map((c) => (
          <div
            key={c}
            className="w-3 h-3 rounded-full border border-white/20"
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Website Catalog Card ───────────────────────────────────────────────────────

function WebsiteCatalogCard({
  website,
  onPreview,
  onAssign,
  onSharePreview,
  tenantOptions,
}: {
  website: NicheWebsite;
  onPreview: (w: NicheWebsite) => void;
  onAssign: (websiteId: NicheWebsiteId, tenantId: string) => void;
  onSharePreview: (websiteId: NicheWebsiteId) => void;
  tenantOptions: { id: string; name: string }[];
}) {
  const [showAssign, setShowAssign] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState("");

  const handleAssign = () => {
    if (!selectedTenant) return;
    onAssign(website.id, selectedTenant);
    setShowAssign(false);
    setSelectedTenant("");
  };

  return (
    <Card
      className="border-white/8 bg-card/60 hover:bg-card/80 transition-all duration-200 hover:border-white/15"
      data-ocid={`website_catalog.card.${website.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <WebsiteThumbnail website={website} className="w-20 h-16 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background: `${website.theme.primaryColor}25`,
                  color: website.theme.primaryColor,
                }}
              >
                {website.nicheId.replace("-", " ")}
              </span>
              {website.pages && website.pages.length > 0 && (
                <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-full font-medium">
                  {website.pages.length} pages
                </span>
              )}
            </div>
            <CardTitle className="text-sm font-bold mt-1 text-foreground">
              {website.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {website.tagline}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {website.description}
        </p>
        <div className="flex gap-1 flex-wrap">
          {website.colorSwatches.map((c) => (
            <div
              key={c}
              className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
              title={c}
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onPreview(website)}
            data-ocid={`website_catalog.preview_button.${website.id}`}
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs px-2"
            onClick={() => onSharePreview(website.id)}
            title="Share preview link"
            data-ocid={`website_catalog.share_preview_button.${website.id}`}
          >
            <Share2 size={13} />
          </Button>
          <div className="relative flex-1">
            <Button
              variant="default"
              size="sm"
              className="w-full text-xs"
              onClick={() => setShowAssign(!showAssign)}
              data-ocid={`website_catalog.assign_button.${website.id}`}
            >
              Assign to... <ChevronDown size={12} className="ml-1" />
            </Button>
            {showAssign && (
              <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-popover border border-white/15 rounded-lg shadow-2xl p-2">
                <select
                  className="w-full text-xs bg-background border border-white/10 rounded px-2 py-1.5 text-foreground mb-2"
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  data-ocid={`website_catalog.tenant_select.${website.id}`}
                >
                  <option value="">Select client...</option>
                  {tenantOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={!selectedTenant}
                    onClick={handleAssign}
                    data-ocid={`website_catalog.confirm_assign_button.${website.id}`}
                  >
                    Assign
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setShowAssign(false)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Client Row Card ────────────────────────────────────────────────────────────

function ClientSiteCard({
  tenantId,
  tenantName,
  tenantType,
  config,
  onAssignClick,
  onPreviewClick,
  onToggleLock,
  onTogglePublish,
}: {
  tenantId: string;
  tenantName: string;
  tenantType: string;
  config: ClientWebsiteConfig | null;
  onAssignClick: (tenantId: string) => void;
  onPreviewClick: (websiteId: NicheWebsiteId) => void;
  onToggleLock: (tenantId: string, locked: boolean) => void;
  onTogglePublish: (tenantId: string, published: boolean) => void;
}) {
  const assignedWebsite = config ? getWebsiteById(config.websiteId) : null;

  return (
    <Card
      className="border-white/8 bg-card/60 hover:bg-card/80 transition-all"
      data-ocid={`client_sites.card.${tenantId}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {assignedWebsite ? (
            <WebsiteThumbnail
              website={assignedWebsite}
              className="w-16 h-12 shrink-0"
            />
          ) : (
            <div className="w-16 h-12 rounded-lg border border-dashed border-white/20 flex items-center justify-center shrink-0 bg-muted/20">
              <Building2 size={16} className="text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground truncate">
                {tenantName}
              </span>
              <Badge variant="outline" className="text-[10px] capitalize">
                {tenantType}
              </Badge>
            </div>
            {assignedWebsite ? (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {assignedWebsite.name} —{" "}
                {assignedWebsite.nicheId.replace("-", " ")}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground/60 mt-0.5 italic">
                No site assigned
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {config ? (
                <>
                  <Badge
                    variant={config.isPublished ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {config.isPublished ? "🌐 Published" : "Draft"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] cursor-pointer hover:bg-accent"
                    onClick={() =>
                      onToggleLock(tenantId, !config.editingLocked)
                    }
                    data-ocid={`client_sites.lock_toggle.${tenantId}`}
                  >
                    {config.editingLocked ? (
                      <>
                        <Lock size={9} className="mr-1" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock size={9} className="mr-1" />
                        Editable
                      </>
                    )}
                  </Badge>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => onAssignClick(tenantId)}
            data-ocid={`client_sites.assign_site_button.${tenantId}`}
          >
            {config ? "Change Site" : "Assign Site"}
          </Button>
          {assignedWebsite && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => onPreviewClick(config!.websiteId)}
              data-ocid={`client_sites.preview_button.${tenantId}`}
            >
              Preview
            </Button>
          )}
          {config && (
            <Button
              variant={config.isPublished ? "destructive" : "default"}
              size="sm"
              className="text-xs"
              onClick={() => onTogglePublish(tenantId, !config.isPublished)}
              data-ocid={`client_sites.publish_button.${tenantId}`}
            >
              {config.isPublished ? "Unpublish" : "Publish"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Preview Links Panel ────────────────────────────────────────────────────────

function PreviewLinksPanel({
  links,
  linkMetas,
  onRevoke,
}: {
  links: PreviewLink[];
  linkMetas: Record<string, LinkMeta>;
  onRevoke: (id: string) => void;
}) {
  const active = links.filter((l) => l.isActive);

  if (active.length === 0) {
    return (
      <div
        className="text-center py-12 text-muted-foreground text-sm"
        data-ocid="website_studio.preview_links.empty_state"
      >
        <Share2 size={24} className="mx-auto mb-3 opacity-30" />
        No active preview links yet. Click "Share Preview" on any website card
        to generate one.
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="website_studio.preview_links.list">
      {active.map((link, i) => {
        const url = getPreviewUrl(link.id);
        const website = getWebsiteById(link.nicheWebsiteId);
        const meta = linkMetas[link.id];
        const expired = meta ? isLinkExpired(meta) : false;
        const commentCount = meta?.comments.length ?? 0;
        const approved = meta?.approved ?? false;

        return (
          <Card
            key={link.id}
            className={`border-white/8 bg-card/60 ${expired ? "opacity-60" : ""}`}
            data-ocid={`website_studio.preview_links.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {website && (
                  <WebsiteThumbnail
                    website={website}
                    className="w-14 h-10 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {link.niche.replace("-", " ")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      — {link.styleName}
                    </span>
                    {link.label && (
                      <Badge variant="outline" className="text-[10px]">
                        {link.label}
                      </Badge>
                    )}
                    {/* Expiry badge */}
                    {meta && (
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          expired
                            ? "text-red-400 border-red-700/40 bg-red-900/20"
                            : "text-emerald-400 border-emerald-700/40 bg-emerald-900/10"
                        }`}
                      >
                        <Calendar size={8} className="mr-1" />
                        {expired
                          ? "Expired"
                          : meta.expiresAt === null
                            ? "No expiry"
                            : `Expires ${new Date(meta.expiresAt).toLocaleDateString()}`}
                      </Badge>
                    )}
                    {/* Approval badge */}
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        approved
                          ? "text-emerald-400 border-emerald-700/40 bg-emerald-900/10"
                          : "text-slate-400 border-slate-700/40"
                      }`}
                    >
                      {approved ? (
                        <>
                          <CheckCircle2 size={8} className="mr-1" />
                          Approved
                        </>
                      ) : (
                        "Pending"
                      )}
                    </Badge>
                    {/* Comment count badge */}
                    {commentCount > 0 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-indigo-300 border-indigo-700/40 bg-indigo-900/10"
                      >
                        <MessageSquare size={8} className="mr-1" />
                        {commentCount} comment{commentCount !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-[10px] text-primary truncate bg-primary/5 border border-primary/10 rounded px-2 py-0.5 flex-1 min-w-0">
                      {url}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-[10px] px-2 flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        toast.success("Link copied to clipboard");
                      }}
                      data-ocid={`website_studio.preview_links.copy_button.${i + 1}`}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                  </p>

                  {/* Comments list */}
                  {commentCount > 0 && meta && (
                    <div className="mt-2 space-y-1.5">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Prospect Comments
                      </p>
                      {meta.comments.map((c) => (
                        <div
                          key={c.id}
                          className="bg-white/4 border border-white/8 rounded-lg p-2"
                        >
                          <p className="text-xs text-white">{c.text}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">
                            {new Date(c.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 flex-shrink-0"
                  onClick={() => onRevoke(link.id)}
                  title="Revoke link"
                  data-ocid={`website_studio.preview_links.revoke_button.${i + 1}`}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function NicheWebsiteStudioPage() {
  const { tenants, isDemoMode, demoInfo, currentTenantId } = useApp();
  const currentTenant = tenants.find((t) => t.id === currentTenantId);

  // Determine if current user has a locked niche (demo or client)
  // Super Admin sees all; demo/client users are locked to their niche
  const lockedNicheId = (() => {
    const raw = isDemoMode
      ? (demoInfo?.niche ?? null)
      : (currentTenant?.type ?? null);
    if (!raw) return null;
    try {
      return normalizeNicheId(raw);
    } catch {
      return null;
    }
  })();

  const [configs, setConfigs] = useState<Record<string, ClientWebsiteConfig>>(
    () => getAllClientWebsiteConfigs(),
  );
  const [previewLinks, setPreviewLinks] = useState<PreviewLink[]>(() =>
    getAllPreviewLinks(),
  );
  // Extended per-link metadata (expiry, comments, approval)
  const [linkMetas, setLinkMetas] = useState<Record<string, LinkMeta>>({});

  // Active tab: catalog | clients | preview-links
  const [activeTab, setActiveTab] = useState<
    "catalog" | "clients" | "preview-links"
  >("clients");

  // For assignment dialog
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignTenantId, setAssignTenantId] = useState<string | null>(null);
  const [assignWebsiteId, setAssignWebsiteId] = useState<NicheWebsiteId | null>(
    null,
  );

  // For preview dialog
  const [previewWebsite, setPreviewWebsite] = useState<NicheWebsite | null>(
    null,
  );
  const [previewPage, setPreviewPage] = useState("home");

  // Share with expiry dialog
  const [shareDialogWebsiteId, setShareDialogWebsiteId] =
    useState<NicheWebsiteId | null>(null);
  const [shareExpiryOption, setShareExpiryOption] =
    useState<ExpiryOption>("7d");

  // Catalog filter — auto-set to locked niche on mount; Super Admin defaults to 'all'
  const [catalogFilter, setCatalogFilter] = useState<string>(
    () => lockedNicheId ?? "all",
  );

  // Sync catalogFilter when lockedNicheId changes (e.g. after demo login)
  useEffect(() => {
    if (lockedNicheId) {
      setCatalogFilter(lockedNicheId);
    }
  }, [lockedNicheId]);

  const nicheOptions = getNicheOptions();
  const nicheLabel = lockedNicheId
    ? (nicheOptions.find((n) => n.id === lockedNicheId)?.label ?? lockedNicheId)
    : null;

  const stats = useMemo(() => {
    const assigned = Object.keys(configs).length;
    const published = Object.values(configs).filter(
      (c) => c.isPublished,
    ).length;
    const activeLinks = previewLinks.filter((l) => l.isActive).length;
    return { total: tenants.length, assigned, published, activeLinks };
  }, [configs, tenants, previewLinks]);

  const refreshConfigs = () => setConfigs(getAllClientWebsiteConfigs());
  const refreshLinks = () => setPreviewLinks(getAllPreviewLinks());

  const handleAssign = (websiteId: NicheWebsiteId, tenantId: string) => {
    const existing = configs[tenantId];
    const newConfig = existing
      ? { ...existing, websiteId, lastUpdated: new Date().toISOString() }
      : makeDefaultConfig(tenantId, websiteId);
    saveClientWebsiteConfig(newConfig);
    refreshConfigs();
    const tenant = tenants.find((t) => t.id === tenantId);
    const website = getWebsiteById(websiteId);
    toast.success(`Assigned "${website?.name}" to ${tenant?.name ?? tenantId}`);
  };

  const handleToggleLock = (tenantId: string, locked: boolean) => {
    const cfg = configs[tenantId];
    if (!cfg) return;
    saveClientWebsiteConfig({
      ...cfg,
      editingLocked: locked,
      lastUpdated: new Date().toISOString(),
    });
    refreshConfigs();
    toast.success(
      locked ? "Editing locked for client" : "Editing unlocked for client",
    );
  };

  const handleTogglePublish = (tenantId: string, published: boolean) => {
    const cfg = configs[tenantId];
    if (!cfg) return;
    saveClientWebsiteConfig({
      ...cfg,
      isPublished: published,
      lastUpdated: new Date().toISOString(),
    });
    refreshConfigs();
    toast.success(published ? "Site published!" : "Site unpublished");
  };

  const handleSharePreview = (websiteId: NicheWebsiteId) => {
    // Open the expiry dialog instead of immediately creating
    setShareDialogWebsiteId(websiteId);
    setShareExpiryOption("7d");
  };

  const handleConfirmShare = () => {
    if (!shareDialogWebsiteId) return;
    const link = createPreviewLink(shareDialogWebsiteId);
    const meta: LinkMeta = {
      expiryOption: shareExpiryOption,
      expiresAt: calcExpiry(shareExpiryOption),
      comments: [],
      approved: false,
    };
    setLinkMetas((prev) => ({ ...prev, [link.id]: meta }));
    const url = getPreviewUrl(link.id);
    navigator.clipboard.writeText(url).catch(() => {});
    refreshLinks();
    setShareDialogWebsiteId(null);
    toast.success("Preview link copied to clipboard!", {
      description: `Expires: ${EXPIRY_LABELS[shareExpiryOption]}  ·  ${url}`,
      duration: 5000,
    });
  };

  const handleAddComment = (linkId: string, comment: ProspectComment) => {
    setLinkMetas((prev) => ({
      ...prev,
      [linkId]: {
        ...(prev[linkId] ?? {
          expiryOption: "never" as ExpiryOption,
          expiresAt: null,
          comments: [],
          approved: false,
        }),
        comments: [...(prev[linkId]?.comments ?? []), comment],
      },
    }));
    toast.success("Comment received from prospect");
  };

  const handleApproveLink = (linkId: string) => {
    setLinkMetas((prev) => ({
      ...prev,
      [linkId]: {
        ...(prev[linkId] ?? {
          expiryOption: "never" as ExpiryOption,
          expiresAt: null,
          comments: [],
          approved: false,
        }),
        approved: true,
      },
    }));
    toast.success("Design approved by prospect!");
  };

  const handleRevokeLink = (id: string) => {
    revokePreviewLink(id);
    refreshLinks();
    toast.success("Preview link revoked");
  };

  const openAssignFromClient = (tenantId: string) => {
    setAssignTenantId(tenantId);
    setAssignWebsiteId(configs[tenantId]?.websiteId ?? null);
    setAssignDialogOpen(true);
  };

  const openAssignFromCatalog = (
    websiteId: NicheWebsiteId,
    tenantId: string,
  ) => {
    handleAssign(websiteId, tenantId);
  };

  const confirmAssignment = () => {
    if (!assignTenantId || !assignWebsiteId) return;
    handleAssign(assignWebsiteId, assignTenantId);
    setAssignDialogOpen(false);
    setAssignTenantId(null);
    setAssignWebsiteId(null);
  };

  const filteredWebsites =
    catalogFilter === "all"
      ? NICHE_WEBSITES
      : NICHE_WEBSITES.filter((w) => w.nicheId === catalogFilter);

  const tenantOptions = tenants.map((t) => ({ id: t.id, name: t.name }));

  return (
    <div className="p-4 md:p-6 space-y-6" data-ocid="website_studio.page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg">
            <Globe size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">
              Niche Website Studio
            </h1>
            <p className="text-sm text-muted-foreground">
              Assign beautiful multi-page websites to your clients · Share
              preview links with prospects
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        data-ocid="website_studio.stats"
      >
        {[
          {
            label: "Total Clients",
            value: stats.total,
            icon: <Users size={16} />,
          },
          {
            label: "Sites Assigned",
            value: stats.assigned,
            icon: <Building2 size={16} />,
          },
          {
            label: "Sites Published",
            value: stats.published,
            icon: <Globe size={16} />,
          },
          {
            label: "Active Preview Links",
            value: stats.activeLinks,
            icon: <Link2 size={16} />,
          },
        ].map((s) => (
          <Card key={s.label} className="border-white/8 bg-card/60">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                {s.icon}
              </div>
              <div>
                <div className="text-xl font-black text-foreground">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Nav */}
      <div
        className="flex gap-1 border-b border-white/8 pb-0"
        data-ocid="website_studio.tabs"
      >
        {(
          [
            { id: "clients", label: "Client Sites" },
            { id: "catalog", label: "Website Catalog" },
            { id: "preview-links", label: "Preview Links" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-foreground bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`website_studio.tab.${tab.id}`}
          >
            {tab.label}
            {tab.id === "preview-links" && stats.activeLinks > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] rounded-full bg-primary text-primary-foreground font-bold">
                {stats.activeLinks}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── CLIENT SITES TAB ── */}
      {activeTab === "clients" && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          data-ocid="website_studio.client_list"
        >
          {tenants.length === 0 ? (
            <div
              className="col-span-full text-center py-12 text-muted-foreground text-sm"
              data-ocid="website_studio.empty_state"
            >
              No clients yet. Add clients from the Admin panel.
            </div>
          ) : (
            tenants.map((tenant) => (
              <ClientSiteCard
                key={tenant.id}
                tenantId={tenant.id}
                tenantName={tenant.name}
                tenantType={tenant.type}
                config={configs[tenant.id] ?? null}
                onAssignClick={openAssignFromClient}
                onPreviewClick={(wsId) => {
                  const ws = getWebsiteById(wsId);
                  if (ws) {
                    setPreviewWebsite(ws);
                    setPreviewPage("home");
                  }
                }}
                onToggleLock={handleToggleLock}
                onTogglePublish={handleTogglePublish}
              />
            ))
          )}
        </div>
      )}

      {/* ── CATALOG TAB ── */}
      {activeTab === "catalog" && (
        <div className="space-y-4" data-ocid="website_studio.catalog">
          {/* Niche context banner when locked */}
          {lockedNicheId && nicheLabel && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/8"
              data-ocid="website_studio.niche_context_banner"
            >
              <Info size={14} className="text-primary shrink-0" />
              <p className="text-xs text-foreground/80">
                <span className="font-semibold text-primary">
                  {nicheLabel} Studio
                </span>{" "}
                — Showing only {nicheLabel} website designs. Templates, content,
                and AI suggestions are tailored for your niche.
              </p>
              <Badge
                variant="outline"
                className="ml-auto text-[10px] shrink-0 text-primary border-primary/40"
              >
                Niche Locked
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              {filteredWebsites.length} design
              {filteredWebsites.length !== 1 ? "s" : ""}
              {lockedNicheId && nicheLabel ? ` for ${nicheLabel}` : ""}
            </p>
            {/* Only show filter when NOT niche-locked (Super Admin) */}
            {!lockedNicheId && (
              <div className="flex gap-1 flex-wrap">
                <button
                  type="button"
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    catalogFilter === "all"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-white/15 text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setCatalogFilter("all")}
                  data-ocid="website_studio.catalog_filter.all"
                >
                  All
                </button>
                {nicheOptions.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      catalogFilter === n.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-white/15 text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setCatalogFilter(n.id)}
                    data-ocid={`website_studio.catalog_filter.${n.id}`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredWebsites.map((w) => (
              <WebsiteCatalogCard
                key={w.id}
                website={w}
                onPreview={(ws) => {
                  setPreviewWebsite(ws);
                  setPreviewPage("home");
                }}
                onAssign={openAssignFromCatalog}
                onSharePreview={handleSharePreview}
                tenantOptions={tenantOptions}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── PREVIEW LINKS TAB ── */}
      {activeTab === "preview-links" && (
        <div data-ocid="website_studio.preview_links">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Link2 size={16} className="text-muted-foreground" />
              Active Preview Links
            </h2>
            <p className="text-xs text-muted-foreground">
              Share these links with prospects — no login required to view
            </p>
          </div>
          <PreviewLinksPanel
            links={previewLinks}
            linkMetas={linkMetas}
            onRevoke={handleRevokeLink}
          />
        </div>
      )}

      {/* Assignment Dialog (from client card) */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent
          className="max-w-4xl w-full p-0 overflow-hidden border-white/10 bg-card"
          data-ocid="website_studio.assign_dialog"
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/8">
            <DialogTitle className="text-lg font-bold">
              Assign Website to{" "}
              {tenants.find((t) => t.id === assignTenantId)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-[560px]">
            {/* Preview panel */}
            <div className="border-r border-white/8 overflow-hidden bg-muted/20">
              {assignWebsiteId && getWebsiteById(assignWebsiteId) ? (
                <div className="h-full overflow-y-auto">
                  <div
                    style={{
                      transform: "scale(0.42)",
                      transformOrigin: "top left",
                      width: "238%",
                      pointerEvents: "none",
                    }}
                  >
                    <NicheWebsiteRenderer
                      website={getWebsiteById(assignWebsiteId)!}
                      previewMode="thumbnail"
                      showPageNav={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                  <Globe size={32} className="opacity-30" />
                  <p>Select a design to preview</p>
                </div>
              )}
            </div>

            {/* Selector panel */}
            <div className="p-5 overflow-y-auto space-y-4">
              <p className="text-xs text-muted-foreground">
                Choose a website design to assign to this client:
              </p>
              <div className="space-y-2">
                {NICHE_WEBSITES.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      assignWebsiteId === w.id
                        ? "border-primary/60 bg-primary/10"
                        : "border-white/8 hover:border-white/20 bg-background/50 hover:bg-background/80"
                    }`}
                    onClick={() => setAssignWebsiteId(w.id)}
                    data-ocid={`website_studio.website_option.${w.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 shrink-0">
                        {w.colorSwatches.map((c) => (
                          <div
                            key={c}
                            className="w-3 h-3 rounded-full"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">
                          {w.name}
                          {w.pages && w.pages.length > 0 && (
                            <span className="ml-1.5 text-[10px] text-violet-400">
                              {w.pages.length}pg
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground capitalize truncate">
                          {w.nicheId.replace("-", " ")} · {w.tagline}
                        </div>
                      </div>
                      {assignWebsiteId === w.id && (
                        <div className="ml-auto w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3.5"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  disabled={!assignWebsiteId}
                  onClick={confirmAssignment}
                  data-ocid="website_studio.assign_dialog.confirm_button"
                >
                  Assign Website
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setAssignDialogOpen(false)}
                  data-ocid="website_studio.assign_dialog.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Preview Dialog */}
      <Dialog
        open={!!previewWebsite}
        onOpenChange={(o) => {
          if (!o) {
            setPreviewWebsite(null);
            setPreviewPage("home");
          }
        }}
      >
        <DialogContent
          className="max-w-5xl w-full p-0 overflow-hidden border-white/10 bg-card max-h-[90vh]"
          data-ocid="website_studio.preview_dialog"
        >
          <DialogHeader className="px-6 pt-4 pb-3 border-b border-white/8 flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold">
              {previewWebsite?.name} —{" "}
              {previewWebsite?.nicheId.replace("-", " ")}
            </DialogTitle>
            {previewWebsite && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs gap-1.5 ml-4"
                onClick={() => handleSharePreview(previewWebsite.id)}
                data-ocid="website_studio.preview_dialog.share_button"
              >
                <Share2 size={12} /> Share Preview
              </Button>
            )}
          </DialogHeader>
          <div className="overflow-y-auto max-h-[80vh]">
            {previewWebsite && (
              <div
                style={{
                  transform: "scale(0.65)",
                  transformOrigin: "top center",
                  width: "154%",
                  marginLeft: "-27%",
                  pointerEvents: "none",
                }}
              >
                <NicheWebsiteRenderer
                  website={previewWebsite}
                  previewMode="thumbnail"
                  currentPage={previewPage}
                  showPageNav={false}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Share with Expiry Dialog */}
      <Dialog
        open={!!shareDialogWebsiteId}
        onOpenChange={(o) => {
          if (!o) setShareDialogWebsiteId(null);
        }}
      >
        <DialogContent
          className="max-w-sm bg-card border-white/10"
          data-ocid="website_studio.share_expiry_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Share2 size={16} className="text-primary" />
              Share Preview Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground">
              Choose how long this preview link should stay active. The prospect
              will see the website and can leave comments or approve the design.
            </p>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">
                Link Expiry
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["24h", "3d", "7d", "30d", "never"] as ExpiryOption[]).map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`text-xs px-3 py-2 rounded-lg border transition-all font-medium ${
                        shareExpiryOption === opt
                          ? "bg-primary/20 border-primary/60 text-primary"
                          : "bg-background border-white/10 text-muted-foreground hover:border-white/25"
                      }`}
                      onClick={() => setShareExpiryOption(opt)}
                      data-ocid={`website_studio.share_expiry.${opt}`}
                    >
                      <Calendar size={11} className="inline mr-1.5" />
                      {EXPIRY_LABELS[opt]}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1"
                onClick={handleConfirmShare}
                data-ocid="website_studio.share_expiry.confirm_button"
              >
                <Share2 size={13} className="mr-1.5" />
                Copy Link
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShareDialogWebsiteId(null)}
                data-ocid="website_studio.share_expiry.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ProspectCommentBar — demo in preview links tab for first active link */}
      {activeTab === "preview-links" &&
        previewLinks.filter((l) => l.isActive).length > 0 && (
          <ProspectCommentBar
            linkId={previewLinks.filter((l) => l.isActive)[0].id}
            onComment={handleAddComment}
            onApprove={handleApproveLink}
            isApproved={
              linkMetas[previewLinks.filter((l) => l.isActive)[0].id]
                ?.approved ?? false
            }
          />
        )}
    </div>
  );
}
