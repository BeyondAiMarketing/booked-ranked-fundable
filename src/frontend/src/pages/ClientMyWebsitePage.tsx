import {
  BarChart2,
  BookOpen,
  Eye,
  EyeOff,
  Globe,
  History,
  Info,
  Save,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BrandKitColorPanel as BrandKitPanel } from "../components/BrandKitPanel";
import DeviceFrame, {
  DeviceToggleBar,
  type DeviceType,
} from "../components/DeviceFrame";
import NicheContentLibrary from "../components/NicheContentLibrary";
import NicheWebsiteRenderer from "../components/NicheWebsiteRenderer";
import RegenerateSectionModal from "../components/RegenerateSectionModal";
import SectionAnalyticsDashboard from "../components/SectionAnalyticsDashboard";
import SectionScoreBadge from "../components/SectionScoreBadge";
import SmartRecommendations from "../components/SmartRecommendations";
import SmartRecommendationsDrawer from "../components/SmartRecommendationsDrawer";
import VersionHistoryPanel from "../components/VersionHistoryPanel";
import WebsiteAgentChatPanel from "../components/WebsiteAgentChatPanel";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useApp } from "../context/AppContext";
import {
  type ClientWebsiteConfig,
  NICHE_WEBSITES,
  type NicheId,
  type NicheWebsite,
  type NicheWebsitePage,
  getAllSections,
  getClientWebsiteConfig,
  getNicheAISuggestions,
  getNicheOptions,
  getWebsiteById,
  getWebsitesByNiche,
  normalizeNicheId,
  saveClientWebsiteConfig,
} from "../data/nicheWebsiteData";
import type { SectionType } from "../lib/sectionScoreEngine";
import type { AuditScore } from "../lib/websiteAgentEngine";
import { generateSectionAnalytics } from "../lib/websiteAnalyticsEngine";
import { createSnapshot } from "../lib/websiteVersionHistory";

// ── No Website State ───────────────────────────────────────────────────────────

function NoWebsiteState({ demoNicheId }: { demoNicheId?: string }) {
  const nicheOptions = getNicheOptions();
  // For demo/niche-locked users: show only variants for their niche (never all)
  const normalizedNiche = demoNicheId
    ? normalizeNicheId(demoNicheId)
    : undefined;
  const displayWebsites = normalizedNiche
    ? getWebsitesByNiche(normalizedNiche)
    : NICHE_WEBSITES.slice(0, 8);
  const nicheLabel = normalizedNiche
    ? (nicheOptions.find((n) => n.id === normalizedNiche)?.label ??
      normalizedNiche)
    : null;

  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      data-ocid="my_website.empty_state"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-700/30 border border-violet-500/20 flex items-center justify-center mb-4">
        <Globe size={28} className="text-violet-400" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        No website assigned yet
      </h2>
      {nicheLabel && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/8 mb-4 text-sm">
          <Info size={14} className="text-primary" />
          <span className="text-foreground/80">
            Your account is set up for{" "}
            <strong className="text-primary">{nicheLabel}</strong> — only{" "}
            {nicheLabel} designs are shown below.
          </span>
        </div>
      )}
      <p className="text-muted-foreground text-sm mb-8 max-w-sm">
        Contact your account manager to get started. We'll assign you a
        beautiful, niche-specific website that's ready to customize.
      </p>
      {displayWebsites.length > 0 && (
        <div className="text-left w-full max-w-3xl">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 text-center">
            {nicheLabel
              ? `${nicheLabel} designs available for your account`
              : "Available designs"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {displayWebsites.map((w) => (
              <div
                key={w.id}
                className="rounded-xl overflow-hidden border border-white/8 group"
                style={{ background: w.theme.bgColor }}
              >
                <div
                  className="h-14 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${w.theme.primaryColor}80, ${w.theme.accentColor}40)`,
                  }}
                >
                  <span
                    className="text-[9px] font-black uppercase tracking-wider text-center px-1"
                    style={{ color: w.theme.textColor }}
                  >
                    {w.name}
                  </span>
                </div>
                <div className="p-2 flex gap-1 justify-center">
                  {w.colorSwatches.map((c) => (
                    <div
                      key={c}
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="px-2 pb-2 text-center">
                  <span className="text-[9px] capitalize text-muted-foreground">
                    {w.nicheId.replace("-", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page Selector ─────────────────────────────────────────────────────────────

function PageSelector({
  pages,
  currentPage,
  onPageChange,
  theme,
}: {
  pages: NicheWebsitePage[];
  currentPage: string;
  onPageChange: (pageId: string) => void;
  theme: NicheWebsite["theme"];
}) {
  return (
    <div
      className="flex gap-1 p-1 rounded-lg"
      style={{ background: `${theme.primaryColor}12` }}
      data-ocid="my_website.page_selector"
    >
      {pages.map((page) => {
        const isActive = page.id === currentPage;
        return (
          <button
            key={page.id}
            type="button"
            className="flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              background: isActive ? theme.primaryColor : "transparent",
              color: isActive ? "#fff" : `${theme.primaryColor}cc`,
            }}
            onClick={() => onPageChange(page.id)}
            data-ocid={`my_website.page_tab.${page.id}`}
          >
            {page.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Section Visibility Toggle ──────────────────────────────────────────────────

function SectionToggles({
  website,
  currentPage,
  hiddenSections,
  onChange,
  auditData,
  onOpenAgent,
}: {
  website: NicheWebsite;
  currentPage: string;
  hiddenSections: string[];
  onChange: (sectionId: string, hidden: boolean) => void;
  auditData: AuditScore | null;
  onOpenAgent: (suggestion: string) => void;
}) {
  // For multi-page: show sections of current page; fallback to all sections
  const isMultiPage = !!(website.pages && website.pages.length > 0);
  const sections = isMultiPage
    ? (website.pages?.find((p) => p.id === currentPage)?.sections ??
      getAllSections(website))
    : getAllSections(website);

  return (
    <div className="space-y-2">
      {sections.map((section) => {
        const isHidden = hiddenSections.includes(section.id);
        return (
          <div key={section.id} className="space-y-1">
            <div className="flex items-center justify-between py-1">
              <span
                className="text-xs capitalize text-foreground/80 truncate"
                style={{ opacity: isHidden ? 0.4 : 1 }}
              >
                {section.type.replace("_", " ")}
              </span>
              <Switch
                checked={!isHidden}
                onCheckedChange={(checked) => onChange(section.id, !checked)}
                data-ocid={`my_website.section_toggle.${section.id}`}
              />
            </div>
            {!isHidden && (
              <SectionScoreBadge
                sectionType={section.type as SectionType}
                sectionLabel={section.type.replace("_", " ")}
                auditData={auditData}
                onOpenAgent={onOpenAgent}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Color Picker ───────────────────────────────────────────────────────────────

function ColorPicker({
  label,
  value,
  onChange,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  ocid: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-full border border-white/20"
          style={{ background: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
          data-ocid={ocid}
        />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ClientMyWebsitePage() {
  const { currentTenantId, tenants, isDemoMode, demoInfo } = useApp();
  const currentTenant = tenants.find((t) => t.id === currentTenantId);

  // Derive the locked niche for this user
  const lockedNicheId: NicheId | null = (() => {
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

  const nicheOptions = getNicheOptions();
  const nicheLabel = lockedNicheId
    ? (nicheOptions.find((n) => n.id === lockedNicheId)?.label ?? lockedNicheId)
    : null;

  const [config, setConfig] = useState<ClientWebsiteConfig | null>(() =>
    getClientWebsiteConfig(currentTenantId),
  );
  const [website, setWebsite] = useState<NicheWebsite | null>(() =>
    config ? (getWebsiteById(config.websiteId) ?? null) : null,
  );
  const [previewDevice, setPreviewDevice] = useState<DeviceType>("desktop");
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [agentInitialMessage, setAgentInitialMessage] = useState<
    string | undefined
  >();
  const [recommendationsDrawerOpen, setRecommendationsDrawerOpen] =
    useState(false);
  const [versionPanelOpen, setVersionPanelOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<
    "sections" | "brand" | "colors" | "analytics"
  >("sections");
  const [contentLibraryOpen, setContentLibraryOpen] = useState(false);
  const [regenerateModal, setRegenerateModal] = useState<{
    sectionId: string;
    currentContent: Record<string, string>;
  } | null>(null);

  const isMultiPage = !!(website?.pages && website.pages.length > 0);

  // Refresh when tenant or demoInfo changes — critical so that after loginDemo() fires
  // the correct niche website is loaded immediately without needing a full page reload.
  // We use demoInfo?.niche as the dep so it only re-runs when the actual niche changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: demoInfo.niche triggers niche-specific refresh
  useEffect(() => {
    const c = getClientWebsiteConfig(currentTenantId);
    setConfig(c);
    setWebsite(c ? (getWebsiteById(c.websiteId) ?? null) : null);
    setHasChanges(false);
    setCurrentPage("home");
  }, [currentTenantId, demoInfo?.niche]);

  const updateConfig = (
    updater: (prev: ClientWebsiteConfig) => ClientWebsiteConfig,
  ) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      setHasChanges(true);
      return next;
    });
  };

  const handleSectionUpdate = (
    sectionId: string,
    content: Record<string, string>,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        sectionOverrides: {
          ...prev.customizations.sectionOverrides,
          [sectionId]: {
            ...(prev.customizations.sectionOverrides[sectionId] ?? {}),
            ...content,
          },
        },
      },
    }));
  };

  const handleVisibilityToggle = (sectionId: string, hidden: boolean) => {
    updateConfig((prev) => {
      const current = prev.customizations.hiddenSections;
      const next = hidden
        ? [...current, sectionId]
        : current.filter((id) => id !== sectionId);
      return {
        ...prev,
        customizations: { ...prev.customizations, hiddenSections: next },
      };
    });
  };

  const handleColorChange = (
    key: "primaryColor" | "secondaryColor" | "accentColor",
    value: string,
  ) => {
    updateConfig((prev) => ({
      ...prev,
      customizations: { ...prev.customizations, [key]: value },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      updateConfig((prev) => ({
        ...prev,
        customizations: { ...prev.customizations, logoUrl: url },
      }));
      toast.success("Logo uploaded");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!config) return;
    const updated = { ...config, lastUpdated: new Date().toISOString() };
    saveClientWebsiteConfig(updated);
    createSnapshot(currentTenantId, updated);
    setHasChanges(false);
    toast.success("Changes saved successfully");
  };

  const handleApplyBrandKit = (kit: {
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
  }) => {
    updateConfig((prev) => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        primaryColor: kit.primaryColor,
        accentColor: kit.accentColor,
        ...(kit.logoUrl !== undefined ? { logoUrl: kit.logoUrl } : {}),
      },
    }));
  };

  const handleRestoreVersion = (restored: ClientWebsiteConfig) => {
    setConfig(restored);
    setHasChanges(true);
    toast.success("Version restored — click Save to apply");
  };

  const handleOpenAgentWithSuggestion = (suggestion: string) => {
    setAgentInitialMessage(suggestion);
    setAgentPanelOpen(true);
  };

  const handlePublish = () => {
    if (!config) return;
    const updated = {
      ...config,
      isPublished: !config.isPublished,
      lastUpdated: new Date().toISOString(),
    };
    saveClientWebsiteConfig(updated);
    setConfig(updated);
    setHasChanges(false);
    toast.success(
      updated.isPublished
        ? "🌐 Your website is now live!"
        : "Website unpublished",
    );
  };

  const effectiveTheme = website
    ? {
        ...website.theme,
        primaryColor:
          config?.customizations.primaryColor ?? website.theme.primaryColor,
        secondaryColor:
          config?.customizations.secondaryColor ?? website.theme.secondaryColor,
        accentColor:
          config?.customizations.accentColor ?? website.theme.accentColor,
      }
    : null;

  if (!config || !website) {
    return (
      <div className="p-4 md:p-6" data-ocid="my_website.page">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg">
            <Globe size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground">My Website</h1>
            <p className="text-sm text-muted-foreground">
              Your niche-specific business website
            </p>
          </div>
        </div>
        <NoWebsiteState
          demoNicheId={
            isDemoMode ? (demoInfo?.niche ?? currentTenant?.type) : undefined
          }
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-[calc(100vh-64px)] overflow-hidden"
      data-ocid="my_website.page"
    >
      {/* LEFT SIDEBAR */}
      <aside className="w-56 xl:w-64 flex-shrink-0 border-r border-white/8 flex flex-col bg-card/40 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-md"
              style={{
                background: `linear-gradient(135deg, ${effectiveTheme?.primaryColor}, ${effectiveTheme?.accentColor})`,
              }}
            />
            <span className="text-sm font-bold text-foreground truncate">
              {website.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {website.nicheId.replace("-", " ")}
            {isMultiPage && (
              <span className="ml-1.5 text-violet-400">
                · {website.pages?.length} pages
              </span>
            )}
          </p>
          {config.isPublished && (
            <Badge className="mt-2 text-[10px]" variant="default">
              🌐 Published
            </Badge>
          )}
        </div>

        {/* Page Selector (multi-page only) */}
        {isMultiPage && website.pages && effectiveTheme && (
          <div className="p-3 border-b border-white/8">
            <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
              Page
            </Label>
            <PageSelector
              pages={website.pages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              theme={effectiveTheme}
            />
          </div>
        )}

        {/* Preview device toggle */}
        <div className="p-3 border-b border-white/8">
          <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
            Preview
          </Label>
          <DeviceToggleBar
            active={previewDevice}
            onChange={setPreviewDevice}
            onFullScreen={() => setFullScreenOpen(true)}
          />
        </div>

        {/* Sidebar tab nav — only when editing is unlocked */}
        {!config.editingLocked && (
          <div className="p-2 border-b border-white/8">
            <div className="flex gap-0.5 p-0.5 rounded-lg bg-white/5">
              {[
                { id: "sections" as const, label: "Sections" },
                { id: "brand" as const, label: "Brand" },
                { id: "colors" as const, label: "Colors" },
                { id: "analytics" as const, label: "Stats" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-semibold transition-colors ${
                    sidebarTab === id
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setSidebarTab(id)}
                  data-ocid={`my_website.sidebar_tab.${id}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTIONS TAB */}
        {!config.editingLocked && sidebarTab === "sections" && (
          <div className="p-3 flex-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block flex items-center gap-1">
              <Eye size={11} /> Sections
              {isMultiPage && (
                <span className="ml-1 text-[9px] text-muted-foreground/60 normal-case font-normal capitalize">
                  (
                  {website.pages?.find((p) => p.id === currentPage)?.label ??
                    "home"}{" "}
                  page)
                </span>
              )}
            </Label>
            <SectionToggles
              website={website}
              currentPage={currentPage}
              hiddenSections={config.customizations.hiddenSections}
              onChange={handleVisibilityToggle}
              auditData={null}
              onOpenAgent={handleOpenAgentWithSuggestion}
            />
          </div>
        )}

        {/* BRAND KIT TAB */}
        {!config.editingLocked && sidebarTab === "brand" && (
          <div className="p-3 flex-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">
              Brand Kit
            </Label>
            <BrandKitPanel
              tenantId={currentTenantId}
              config={config}
              websitePrimaryColor={website.theme.primaryColor}
              websiteAccentColor={website.theme.accentColor}
              onApply={handleApplyBrandKit}
            />
          </div>
        )}

        {/* COLORS TAB */}
        {!config.editingLocked && sidebarTab === "colors" && (
          <div className="p-3 flex-1 space-y-3">
            <Label className="text-xs text-muted-foreground uppercase tracking-widest block">
              Brand Colors
            </Label>
            <ColorPicker
              label="Primary"
              value={
                config.customizations.primaryColor ?? website.theme.primaryColor
              }
              onChange={(v) => handleColorChange("primaryColor", v)}
              ocid="my_website.color_primary"
            />
            <ColorPicker
              label="Secondary"
              value={
                config.customizations.secondaryColor ??
                website.theme.secondaryColor
              }
              onChange={(v) => handleColorChange("secondaryColor", v)}
              ocid="my_website.color_secondary"
            />
            <ColorPicker
              label="Accent"
              value={
                config.customizations.accentColor ?? website.theme.accentColor
              }
              onChange={(v) => handleColorChange("accentColor", v)}
              ocid="my_website.color_accent"
            />
            <div className="pt-2 border-t border-white/8">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
                Logo
              </Label>
              {config.customizations.logoUrl && (
                <div className="mb-2 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center h-10">
                  <img
                    src={config.customizations.logoUrl}
                    alt="Business logo"
                    className="h-8 object-contain"
                  />
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => logoInputRef.current?.click()}
                data-ocid="my_website.logo_upload_button"
              >
                <Upload size={12} className="mr-1.5" />
                {config.customizations.logoUrl ? "Change Logo" : "Upload Logo"}
              </Button>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {!config.editingLocked && sidebarTab === "analytics" && (
          <div className="p-3 flex-1 overflow-y-auto">
            <SectionAnalyticsDashboard
              analytics={generateSectionAnalytics(
                config.websiteId,
                website.nicheId,
              )}
              onOpenAgentForSection={(_sId, sLabel) => {
                handleOpenAgentWithSuggestion(
                  `My ${sLabel} section needs improvement. Can you help me fix it?`,
                );
              }}
            />
          </div>
        )}

        {/* Content Library Button — shown in sections tab */}
        {!config.editingLocked && sidebarTab === "sections" && (
          <div className="px-3 pb-2 space-y-2">
            <button
              type="button"
              className="w-full flex items-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/8 p-2.5 text-xs font-semibold text-violet-300 hover:bg-violet-500/15 transition-colors"
              onClick={() => setContentLibraryOpen(true)}
              data-ocid="my_website.content_library_button"
            >
              <BookOpen size={13} />
              Browse Content Library
            </button>
            {/* Proactive AI suggestions — one per niche */}
            {lockedNicheId &&
              getNicheAISuggestions(lockedNicheId).map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  data-ocid={`my_website.sidebar_ai_suggestion.${i + 1}`}
                  onClick={() => handleOpenAgentWithSuggestion(s.applyAction)}
                  className="w-full flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-left hover:bg-amber-500/10 transition-colors"
                >
                  <Zap
                    size={11}
                    className={`mt-0.5 shrink-0 ${
                      s.impact === "high" || s.impact === "medium"
                        ? "text-amber-400"
                        : "text-violet-400"
                    }`}
                  />
                  <p className="text-[10px] text-foreground/70 leading-tight">
                    {s.suggestion}
                  </p>
                </button>
              ))}
          </div>
        )}

        {config.editingLocked && (
          <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-2">
            <EyeOff size={20} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Editing is locked by your account manager.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="p-3 border-t border-white/8 space-y-2">
          {!config.editingLocked && (
            <Button
              className="w-full text-sm"
              variant={hasChanges ? "default" : "outline"}
              onClick={handleSave}
              disabled={!hasChanges}
              data-ocid="my_website.save_button"
            >
              <Save size={14} className="mr-1.5" />
              {hasChanges ? "Save Changes" : "No Changes"}
            </Button>
          )}
          <Button
            className="w-full text-sm"
            variant={config.isPublished ? "destructive" : "default"}
            onClick={handlePublish}
            data-ocid="my_website.publish_button"
          >
            <Globe size={14} className="mr-1.5" />
            {config.isPublished ? "Unpublish" : "Publish Site"}
          </Button>
          {config.isPublished && config.publishedUrl && (
            <a
              href={config.publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[10px] text-primary hover:underline truncate"
              data-ocid="my_website.published_url_link"
            >
              {config.publishedUrl}
            </a>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => setVersionPanelOpen(true)}
            data-ocid="my_website.version_history_button"
          >
            <History size={12} className="mr-1.5" />
            Version History
          </Button>
        </div>

        {/* Smart Recommendations (bottom of sidebar) */}
        {!config.editingLocked && (
          <div className="p-3 border-t border-violet-700/20">
            <SmartRecommendations
              config={config}
              niche={website.nicheId}
              auditScore={null}
              onApply={(suggestion) => {
                setAgentPanelOpen(true);
                toast.info(
                  `Opening AI agent with: ${suggestion.suggestedAction.slice(0, 50)}…`,
                );
              }}
              onViewAll={() => setRecommendationsDrawerOpen(true)}
            />
          </div>
        )}
      </aside>

      {/* MAIN: Website Preview / Editor */}
      <main
        className="flex-1 overflow-y-auto bg-background/50"
        data-ocid="my_website.editor"
      >
        {/* Niche context banner */}
        {lockedNicheId && nicheLabel && (
          <div
            className="flex items-center gap-2 px-4 py-2 border-b border-primary/20 bg-primary/5"
            data-ocid="my_website.niche_context_banner"
          >
            <Info size={13} className="text-primary shrink-0" />
            <span className="text-xs text-foreground/70">
              <span className="font-semibold text-primary">
                {nicheLabel} Studio
              </span>
              {" — "}Your templates, content, and AI suggestions are tailored
              for {nicheLabel.toLowerCase()} businesses.
            </span>
          </div>
        )}

        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-white/8 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <DeviceToggleBar
              active={previewDevice}
              onChange={setPreviewDevice}
              onFullScreen={() => setFullScreenOpen(true)}
            />
            {isMultiPage && (
              <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full capitalize">
                {website.pages?.find((p) => p.id === currentPage)?.label ??
                  currentPage}
              </span>
            )}
            {!config.editingLocked && (
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full hidden md:inline">
                ✏️ Click text to edit
              </span>
            )}
          </div>
          {hasChanges && (
            <Badge
              variant="outline"
              className="text-[10px] text-amber-400 border-amber-500/30 bg-amber-500/10"
            >
              Unsaved changes
            </Badge>
          )}
        </div>

        {/* Website render — wrapped in DeviceFrame */}
        <div
          className={`py-6 px-4 transition-all duration-300 ${
            previewDevice === "desktop" ? "px-2" : ""
          }`}
          data-ocid="my_website.canvas_target"
        >
          <DeviceFrame
            device={previewDevice}
            showFullScreen={fullScreenOpen}
            onFullScreenClose={() => setFullScreenOpen(false)}
          >
            <NicheWebsiteRenderer
              website={website}
              config={config}
              tenantData={{
                name: currentTenant?.name,
                phone: currentTenant?.phone,
                address: currentTenant?.address,
              }}
              isEditable={!config.editingLocked}
              onSectionUpdate={handleSectionUpdate}
              onVisibilityToggle={handleVisibilityToggle}
              previewMode={
                previewDevice === "tablet" ? "desktop" : previewDevice
              }
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              showPageNav={isMultiPage}
            />
          </DeviceFrame>
        </div>
      </main>

      {/* Floating Ask Agent button + Proactive Suggestions */}
      {!agentPanelOpen && lockedNicheId && (
        <div className="fixed bottom-20 right-6 z-30 max-w-xs space-y-2">
          {getNicheAISuggestions(lockedNicheId)
            .slice(0, 2)
            .map((s, i) => (
              <button
                key={s.id}
                type="button"
                data-ocid={`my_website.ai_suggestion.${i + 1}`}
                onClick={() => {
                  setAgentInitialMessage(s.applyAction);
                  setAgentPanelOpen(true);
                }}
                className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl shadow-lg border border-violet-500/30 bg-card/95 backdrop-blur-sm hover:bg-card/100 hover:border-violet-400/50 transition-all text-left group"
              >
                <Zap
                  size={13}
                  className={`mt-0.5 shrink-0 ${
                    s.impact === "high" ? "text-amber-400" : "text-violet-400"
                  }`}
                />
                <p className="text-[11px] text-foreground/80 leading-snug group-hover:text-foreground transition-colors">
                  {s.suggestion}
                </p>
                <span className="text-[9px] font-semibold text-violet-400 shrink-0 mt-0.5">
                  Apply →
                </span>
              </button>
            ))}
        </div>
      )}

      {/* Floating Ask Agent button */}
      <button
        type="button"
        onClick={() => {
          setAgentInitialMessage(undefined);
          setAgentPanelOpen((v) => !v);
        }}
        className={`fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl font-semibold text-sm transition-all
          bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 text-white
          ${agentPanelOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        data-ocid="my_website.ask_agent_button"
      >
        <Sparkles size={16} />
        Ask Agent
        {lockedNicheId && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-background" />
        )}
      </button>

      {/* Website Agent Chat Panel */}
      <WebsiteAgentChatPanel
        isOpen={agentPanelOpen}
        onClose={() => {
          setAgentPanelOpen(false);
          setAgentInitialMessage(undefined);
        }}
        clientId={currentTenantId}
        websiteConfig={config}
        niche={website.nicheId}
        auditScore={null}
        onApplyChange={handleSectionUpdate}
        currentPage={currentPage}
        initialMessage={agentInitialMessage}
      />

      {/* Version History Drawer */}
      <VersionHistoryPanel
        isOpen={versionPanelOpen}
        onClose={() => setVersionPanelOpen(false)}
        tenantId={currentTenantId}
        currentConfig={config}
        onRestore={handleRestoreVersion}
      />

      {/* Smart Recommendations Drawer */}
      <SmartRecommendationsDrawer
        isOpen={recommendationsDrawerOpen}
        onClose={() => setRecommendationsDrawerOpen(false)}
        config={config}
        niche={website.nicheId}
        auditScore={null}
        onApply={(suggestion) => {
          setRecommendationsDrawerOpen(false);
          setAgentPanelOpen(true);
          toast.info(
            `Opening AI agent with suggestion for ${suggestion.sectionId.replace(/_/g, " ")}`,
          );
        }}
      />

      {/* Niche Content Library Drawer */}
      <NicheContentLibrary
        isOpen={contentLibraryOpen}
        onClose={() => setContentLibraryOpen(false)}
        niche={website.nicheId}
        onInsertContent={(sectionId, content) => {
          handleSectionUpdate(sectionId, content);
          toast.success("Content inserted");
        }}
      />

      {/* Regenerate Section Modal */}
      {regenerateModal && (
        <RegenerateSectionModal
          isOpen={!!regenerateModal}
          sectionId={regenerateModal.sectionId}
          sectionType={regenerateModal.sectionId as SectionType}
          currentContent={regenerateModal.currentContent}
          niche={website.nicheId}
          clientId={currentTenantId}
          auditScore={null}
          onApply={(sId, content) => {
            handleSectionUpdate(sId, content);
            toast.success("Variant applied");
          }}
          onClose={() => setRegenerateModal(null)}
        />
      )}

      {/* Canvas Regenerate FAB — shown when a section is hovered */}
      {!config.editingLocked && (
        <div
          className="fixed bottom-24 right-6 z-20 flex flex-col items-end gap-2 pointer-events-none"
          data-ocid="my_website.regenerate_fab"
        >
          <button
            type="button"
            className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border border-white/15 bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground/80 hover:text-foreground hover:bg-card transition-all"
            onClick={() =>
              setRegenerateModal({
                sectionId: "hero",
                currentContent:
                  config.customizations.sectionOverrides.hero ?? {},
              })
            }
            data-ocid="my_website.regenerate_hero_button"
          >
            <BarChart2 size={12} className="text-violet-400" />
            Regenerate Hero
          </button>
        </div>
      )}
    </div>
  );
}
