import {
  AlertTriangle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit3,
  Eye,
  FlipHorizontal,
  GitMerge,
  Globe,
  GripVertical,
  LayoutTemplate,
  PlusCircle,
  Save,
  Settings,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FunnelFlowBuilder, {
  type FunnelStep,
} from "../components/FunnelFlowBuilder";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import {
  DEMO_LANDING_PAGES,
  type FormField,
  type LandingPage,
  type LandingPageSection,
  NICHE_TEMPLATES,
  type NicheTemplate,
  type SectionType,
} from "../data/landingPageData";
import {
  type NicheId,
  getNicheOptions,
  normalizeNicheId,
} from "../data/nicheWebsiteData";

// ── helpers ───────────────────────────────────────────────────────────────────

function mkId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function mkPageId() {
  return `page-${Date.now()}`;
}
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  features: "Features",
  testimonials: "Testimonials",
  form: "Capture Form",
  cta: "Call-to-Action",
  pricing: "Pricing",
  faq: "FAQ",
};

const SECTION_COLORS: Record<SectionType, string> = {
  hero: "bg-indigo-900/40 border-indigo-700/40",
  features: "bg-emerald-900/30 border-emerald-700/40",
  testimonials: "bg-purple-900/30 border-purple-700/40",
  form: "bg-blue-900/40 border-blue-700/40",
  cta: "bg-amber-900/30 border-amber-700/40",
  pricing: "bg-cyan-900/30 border-cyan-700/40",
  faq: "bg-slate-900/60 border-slate-700/40",
};

const AVAILABLE_SECTIONS: SectionType[] = [
  "hero",
  "features",
  "testimonials",
  "form",
  "cta",
  "pricing",
  "faq",
];

// ── sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900/80 border border-white/8 rounded-lg p-4">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Template Gallery ──────────────────────────────────────────────────────────

function TemplateGallery({
  onSelect,
  lockedNicheId,
}: {
  onSelect: (tpl: NicheTemplate) => void;
  lockedNicheId: NicheId | null;
}) {
  const nicheOptions = getNicheOptions();
  const [filterNiche, setFilterNiche] = useState<string>(
    lockedNicheId ?? "all",
  );

  const visibleTemplates = lockedNicheId
    ? NICHE_TEMPLATES.filter((t) => t.niche === lockedNicheId)
    : filterNiche === "all"
      ? NICHE_TEMPLATES
      : NICHE_TEMPLATES.filter((t) => t.niche === filterNiche);

  const nicheLabel = lockedNicheId
    ? (nicheOptions.find((n) => n.id === lockedNicheId)?.label ?? lockedNicheId)
    : null;

  return (
    <div>
      {/* Niche context banner — only when locked */}
      {lockedNicheId && nicheLabel && (
        <div
          className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-indigo-500/30 bg-indigo-900/20"
          data-ocid="template_gallery.niche_context_banner"
        >
          <span className="text-indigo-300 text-xs font-semibold">
            {nicheLabel} Studio
          </span>
          <span className="text-slate-400 text-xs">
            — Templates, content, and AI suggestions are tailored for{" "}
            {nicheLabel.toLowerCase()} businesses.
          </span>
          <Badge className="ml-auto bg-indigo-900/60 text-indigo-300 border-indigo-700/50 text-[10px]">
            Niche Locked
          </Badge>
        </div>
      )}

      <h2 className="text-lg font-semibold text-white mb-1">
        {lockedNicheId && nicheLabel
          ? `${nicheLabel} Templates`
          : "Industry-Specific Templates"}
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Start from a pre-built template — every section is fully editable.
      </p>

      {/* Niche filter — only shown when NOT locked */}
      {!lockedNicheId && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          <button
            type="button"
            onClick={() => setFilterNiche("all")}
            data-ocid="template_gallery.filter.all"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filterNiche === "all"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-white/15 text-slate-400 hover:text-white"
            }`}
          >
            All
          </button>
          {nicheOptions.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setFilterNiche(n.id)}
              data-ocid={`template_gallery.filter.${n.id}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filterNiche === n.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-white/15 text-slate-400 hover:text-white"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTemplates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            data-ocid={`template.${tpl.niche}.card`}
            onClick={() => onSelect(tpl)}
            className="text-left group relative rounded-xl border border-white/10 bg-gray-900/60 hover:border-indigo-500/60 hover:bg-indigo-900/20 transition-all duration-200 overflow-hidden"
          >
            <div
              className="h-24 flex items-center justify-center text-4xl"
              style={{
                background: `linear-gradient(135deg, ${tpl.colorFrom}, ${tpl.colorTo})`,
                opacity: 0.85,
              }}
            >
              {tpl.emoji}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-white text-sm">
                  {tpl.label}
                </h3>
                <Badge className="bg-indigo-900/60 text-indigo-300 border-indigo-700/50 text-[10px]">
                  Template
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{tpl.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {tpl.sections
                  .filter((s) => s.enabled)
                  .slice(0, 4)
                  .map((s) => (
                    <span
                      key={s.id}
                      className="text-[10px] bg-white/8 text-slate-400 px-1.5 py-0.5 rounded"
                    >
                      {SECTION_LABELS[s.type]}
                    </span>
                  ))}
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl border-2 border-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>
        ))}
        {visibleTemplates.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500 text-sm">
            No templates found for this niche yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section Row (Canvas) ──────────────────────────────────────────────────────

function SectionRow({
  section,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onToggle,
  onRemove,
  onEdit,
}: {
  section: LandingPageSection;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggle: () => void;
  onRemove: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      data-ocid={`canvas.section.${index + 1}`}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${SECTION_COLORS[section.type]} ${section.enabled ? "" : "opacity-50"}`}
    >
      <GripVertical size={16} className="text-slate-600 shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white">
          {SECTION_LABELS[section.type]}
        </span>
      </div>
      <Switch
        data-ocid={`canvas.section.toggle.${index + 1}`}
        checked={section.enabled}
        onCheckedChange={onToggle}
        className="scale-75"
      />
      <button
        type="button"
        data-ocid={`canvas.section.edit.${index + 1}`}
        onClick={onEdit}
        className="p-1.5 rounded hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors"
        title="Edit section"
      >
        <Edit3 size={14} />
      </button>
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-20 transition-colors"
        title="Move up"
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-20 transition-colors"
        title="Move down"
      >
        <ChevronDown size={14} />
      </button>
      <button
        type="button"
        data-ocid={`canvas.section.delete.${index + 1}`}
        onClick={onRemove}
        className="p-1.5 rounded hover:bg-red-900/40 text-slate-500 hover:text-red-400 transition-colors"
        title="Remove section"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

// ── Section Content Editor ────────────────────────────────────────────────────

function SectionEditor({
  section,
  onSave,
  onClose,
}: {
  section: LandingPageSection;
  onSave: (updated: LandingPageSection) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<LandingPageSection>(
    JSON.parse(JSON.stringify(section)) as LandingPageSection,
  );

  const data = draft.data as unknown as Record<string, unknown>;

  function setField(key: string, val: unknown) {
    setDraft((prev) => ({
      ...prev,
      data: {
        ...(prev.data as unknown as Record<string, unknown>),
        [key]: val,
      } as unknown as LandingPageSection["data"],
    }));
  }

  function renderHeroEditor() {
    const d = data as { headline: string; subtext: string; ctaText: string };
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-slate-300 text-xs mb-1.5 block">
            Headline
          </Label>
          <Input
            data-ocid="section_editor.hero.headline"
            value={d.headline}
            onChange={(e) => setField("headline", e.target.value)}
            className="bg-gray-800 border-white/10 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-xs mb-1.5 block">Subtext</Label>
          <Textarea
            data-ocid="section_editor.hero.subtext"
            value={d.subtext}
            onChange={(e) => setField("subtext", e.target.value)}
            className="bg-gray-800 border-white/10 text-white min-h-[80px]"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-xs mb-1.5 block">
            CTA Button Text
          </Label>
          <Input
            data-ocid="section_editor.hero.cta"
            value={d.ctaText}
            onChange={(e) => setField("ctaText", e.target.value)}
            className="bg-gray-800 border-white/10 text-white"
          />
        </div>
      </div>
    );
  }

  function renderCtaEditor() {
    const d = data as {
      headline: string;
      subtext: string;
      ctaText: string;
      ctaSecondaryText?: string;
    };
    return (
      <div className="space-y-4">
        {(["headline", "subtext", "ctaText", "ctaSecondaryText"] as const).map(
          (key) => (
            <div key={key}>
              <Label className="text-slate-300 text-xs mb-1.5 block capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </Label>
              <Input
                data-ocid={`section_editor.cta.${key}`}
                value={(d[key] ?? "") as string}
                onChange={(e) => setField(key, e.target.value)}
                className="bg-gray-800 border-white/10 text-white"
              />
            </div>
          ),
        )}
      </div>
    );
  }

  function renderFormEditor() {
    const d = data as {
      headline: string;
      subtext: string;
      ctaText: string;
      fields: FormField[];
    };
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-slate-300 text-xs mb-1.5 block">
            Section Headline
          </Label>
          <Input
            data-ocid="section_editor.form.headline"
            value={d.headline}
            onChange={(e) => setField("headline", e.target.value)}
            className="bg-gray-800 border-white/10 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-xs mb-1.5 block">Subtext</Label>
          <Input
            data-ocid="section_editor.form.subtext"
            value={d.subtext}
            onChange={(e) => setField("subtext", e.target.value)}
            className="bg-gray-800 border-white/10 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-xs mb-1.5 block">
            Submit Button Text
          </Label>
          <Input
            data-ocid="section_editor.form.cta"
            value={d.ctaText}
            onChange={(e) => setField("ctaText", e.target.value)}
            className="bg-gray-800 border-white/10 text-white"
          />
        </div>
        <div>
          <Label className="text-slate-300 text-xs mb-2 block">
            Form Fields
          </Label>
          <div className="space-y-2">
            {d.fields.map((field, i) => (
              <div
                key={field.id}
                className="flex items-center gap-3 bg-gray-800/60 rounded-lg px-3 py-2 border border-white/8"
              >
                <Switch
                  data-ocid={`section_editor.form.field.${i + 1}.toggle`}
                  checked={field.enabled}
                  onCheckedChange={(v) => {
                    const next = d.fields.map((f, fi) =>
                      fi === i ? { ...f, enabled: v } : f,
                    );
                    setField("fields", next);
                  }}
                  className="scale-75"
                />
                <span className="text-sm text-white flex-1">{field.label}</span>
                {field.required && (
                  <Badge className="bg-red-900/40 text-red-400 border-red-700/40 text-[10px]">
                    Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderGenericEditor() {
    const d = data as { headline?: string; items?: unknown[] };
    return (
      <div className="space-y-4">
        {d.headline !== undefined && (
          <div>
            <Label className="text-slate-300 text-xs mb-1.5 block">
              Section Headline
            </Label>
            <Input
              data-ocid="section_editor.generic.headline"
              value={d.headline}
              onChange={(e) => setField("headline", e.target.value)}
              className="bg-gray-800 border-white/10 text-white"
            />
          </div>
        )}
        {d.items && (
          <p className="text-xs text-slate-500 bg-slate-900/60 border border-white/8 rounded p-3">
            {(d.items as unknown[]).length} items configured. Deep item editing
            available in the Pro editor.
          </p>
        )}
      </div>
    );
  }

  function renderEditor() {
    switch (section.type) {
      case "hero":
        return renderHeroEditor();
      case "cta":
        return renderCtaEditor();
      case "form":
        return renderFormEditor();
      default:
        return renderGenericEditor();
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="bg-gray-900 border-white/10 text-white max-w-lg"
        data-ocid="section_editor.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Edit3 size={16} className="text-indigo-400" />
            Edit {SECTION_LABELS[section.type]} Section
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {renderEditor()}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-white/8">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="section_editor.cancel_button"
            className="border-white/10 text-slate-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            data-ocid="section_editor.save_button"
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Save size={14} className="mr-1.5" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Page Analytics Card ───────────────────────────────────────────────────────

function PageAnalyticsView({ page }: { page: LandingPage }) {
  const a = page.analytics;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Views"
          value={a.views.toLocaleString()}
          color="text-indigo-300"
        />
        <StatCard
          label="Form Submissions"
          value={a.submissions.toLocaleString()}
          color="text-emerald-300"
        />
        <StatCard
          label="Conversion Rate"
          value={`${a.conversionRate.toFixed(1)}%`}
          color="text-amber-300"
        />
        <StatCard
          label="Status"
          value={page.status === "published" ? "Live" : "Draft"}
          color={
            page.status === "published" ? "text-emerald-400" : "text-slate-400"
          }
        />
      </div>

      {(a.variantAViews !== undefined || a.variantBViews !== undefined) && (
        <div className="bg-gray-900/60 border border-white/8 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FlipHorizontal size={15} className="text-indigo-400" />
            A/B Test Comparison
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                {
                  label: "Variant A",
                  views: a.variantAViews ?? 0,
                  subs: a.variantASubmissions ?? 0,
                  color: "text-indigo-300",
                  bg: "bg-indigo-900/40",
                },
                {
                  label: "Variant B",
                  views: a.variantBViews ?? 0,
                  subs: a.variantBSubmissions ?? 0,
                  color: "text-purple-300",
                  bg: "bg-purple-900/40",
                },
              ] as const
            ).map((v) => {
              const cr =
                v.views > 0 ? ((v.subs / v.views) * 100).toFixed(1) : "—";
              return (
                <div
                  key={v.label}
                  className={`${v.bg} border border-white/8 rounded-lg p-4`}
                >
                  <p className={`font-semibold text-sm mb-3 ${v.color}`}>
                    {v.label}
                  </p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Views</span>
                      <span>{v.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Submissions</span>
                      <span>{v.subs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Conv. Rate</span>
                      <span className="font-semibold">{cr}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {a.variantBViews === 0 && (
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
              <AlertTriangle size={12} />
              Variant B has no traffic yet — share its URL to start the test.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page Builder Canvas ───────────────────────────────────────────────────────

function PageBuilderCanvas({
  page,
  onSave,
  onBack,
}: {
  page: LandingPage;
  onSave: (updated: LandingPage) => void;
  onBack: () => void;
}) {
  const [draft, setDraft] = useState<LandingPage>(
    JSON.parse(JSON.stringify(page)) as LandingPage,
  );
  const [editingSection, setEditingSection] =
    useState<LandingPageSection | null>(null);
  const [activeTab, setActiveTab] = useState("canvas");
  const [showAddSection, setShowAddSection] = useState(false);

  const sections = draft.sections;

  function updateSections(updated: LandingPageSection[]) {
    setDraft((p) => ({ ...p, sections: updated }));
  }

  function moveSection(index: number, dir: -1 | 1) {
    const next = [...sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateSections(next);
  }

  function toggleSection(index: number) {
    updateSections(
      sections.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s)),
    );
  }

  function removeSection(index: number) {
    updateSections(sections.filter((_, i) => i !== index));
  }

  function addSection(type: SectionType) {
    const tpl = NICHE_TEMPLATES.find((t) => t.niche === draft.niche);
    const found = tpl?.sections.find((s) => s.type === type);
    if (!found) return;
    const newSec: LandingPageSection = {
      ...(JSON.parse(JSON.stringify(found)) as LandingPageSection),
      id: mkId(),
      enabled: true,
    };
    updateSections([...sections, newSec]);
    setShowAddSection(false);
    toast.success(`${SECTION_LABELS[type]} section added`);
  }

  function saveSection(updated: LandingPageSection) {
    updateSections(sections.map((s) => (s.id === updated.id ? updated : s)));
    toast.success("Section updated");
  }

  function handleSave() {
    onSave({ ...draft, updatedAt: Date.now() });
    toast.success("Landing page saved");
  }

  function togglePublish() {
    const next: LandingPage = {
      ...draft,
      status: draft.status === "published" ? "draft" : "published",
      updatedAt: Date.now(),
    };
    setDraft(next);
    onSave(next);
    toast.success(
      next.status === "published" ? "Page published!" : "Page set to draft",
    );
  }

  const existingTypes = new Set(sections.map((s) => s.type));
  const addableTypes = AVAILABLE_SECTIONS.filter((t) => !existingTypes.has(t));

  return (
    <div className="space-y-4">
      {/* Builder header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900/80 border border-white/8 rounded-xl px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            data-ocid="builder.back_button"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Pages
          </button>
          <span className="text-slate-600">/</span>
          <div>
            <p className="text-sm font-semibold text-white">{draft.title}</p>
            <p className="text-xs text-slate-500">/p/{draft.slug}</p>
          </div>
          <Badge
            className={
              draft.status === "published"
                ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
                : "bg-slate-800 text-slate-400 border-slate-700/40"
            }
          >
            {draft.status === "published" ? "Published" : "Draft"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            data-ocid="builder.save_button"
            onClick={handleSave}
            className="border-white/10 text-slate-300 hover:text-white"
          >
            <Save size={13} className="mr-1.5" />
            Save
          </Button>
          <Button
            size="sm"
            data-ocid="builder.publish_button"
            onClick={togglePublish}
            className={
              draft.status === "published"
                ? "bg-slate-700 hover:bg-slate-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }
          >
            <Globe size={13} className="mr-1.5" />
            {draft.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-900 border border-white/10 mb-4">
          <TabsTrigger
            value="canvas"
            data-ocid="builder.tab.canvas"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
          >
            <LayoutTemplate size={14} className="mr-1.5" />
            Canvas
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            data-ocid="builder.tab.settings"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
          >
            <Settings size={14} className="mr-1.5" />
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            data-ocid="builder.tab.analytics"
            className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
          >
            <BarChart2 size={14} className="mr-1.5" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Canvas tab */}
        <TabsContent value="canvas">
          <Card className="bg-gray-900/60 border-white/8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">
                  Page Sections ({sections.length})
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="builder.add_section_button"
                  onClick={() => setShowAddSection(!showAddSection)}
                  className="border-indigo-700/40 text-indigo-300 hover:text-white hover:bg-indigo-900/40"
                >
                  <PlusCircle size={13} className="mr-1.5" />
                  Add Section
                </Button>
              </div>
              {showAddSection && addableTypes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 p-3 bg-indigo-950/40 border border-indigo-700/30 rounded-lg">
                  {addableTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      data-ocid={`builder.add_section.${t}`}
                      onClick={() => addSection(t)}
                      className="text-xs bg-indigo-900/50 hover:bg-indigo-700/60 text-indigo-300 hover:text-white px-3 py-1.5 rounded-md border border-indigo-700/40 transition-colors"
                    >
                      + {SECTION_LABELS[t]}
                    </button>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sections.map((sec, i) => (
                  <SectionRow
                    key={sec.id}
                    section={sec}
                    index={i}
                    total={sections.length}
                    onMoveUp={() => moveSection(i, -1)}
                    onMoveDown={() => moveSection(i, 1)}
                    onToggle={() => toggleSection(i)}
                    onRemove={() => removeSection(i)}
                    onEdit={() => setEditingSection(sec)}
                  />
                ))}
                {sections.length === 0 && (
                  <div
                    data-ocid="builder.canvas.empty_state"
                    className="text-center py-10 text-slate-500 text-sm"
                  >
                    No sections yet. Add one above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings">
          <Card className="bg-gray-900/60 border-white/8">
            <CardContent className="pt-5 space-y-5">
              <div>
                <Label className="text-slate-300 text-xs mb-1.5 block">
                  Page Title
                </Label>
                <Input
                  data-ocid="builder.settings.title"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, title: e.target.value }))
                  }
                  className="bg-gray-800 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-xs mb-1.5 block">
                  URL Slug
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm">/p/</span>
                  <Input
                    data-ocid="builder.settings.slug"
                    value={draft.slug}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        slug: slugify(e.target.value),
                      }))
                    }
                    className="bg-gray-800 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSave}
                  data-ocid="builder.settings.save_button"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics tab */}
        <TabsContent value="analytics">
          <PageAnalyticsView page={draft} />
        </TabsContent>
      </Tabs>

      {editingSection && (
        <SectionEditor
          section={editingSection}
          onSave={saveSection}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}

// ── Page List ─────────────────────────────────────────────────────────────────

function PageList({
  pages,
  onOpen,
  onCreate,
  onClone,
  onDelete,
  onCreateVariantB,
}: {
  pages: LandingPage[];
  onOpen: (page: LandingPage) => void;
  onCreate: () => void;
  onClone: (page: LandingPage) => void;
  onDelete: (id: string) => void;
  onCreateVariantB: (page: LandingPage) => void;
}) {
  const totalViews = pages.reduce((s, p) => s + p.analytics.views, 0);
  const _totalSubs = pages.reduce((s, p) => s + p.analytics.submissions, 0);
  const avgCr =
    pages.length > 0
      ? (
          pages.reduce((s, p) => s + p.analytics.conversionRate, 0) /
          pages.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Pages"
          value={String(pages.length)}
          color="text-white"
        />
        <StatCard
          label="Published"
          value={String(pages.filter((p) => p.status === "published").length)}
          color="text-emerald-400"
        />
        <StatCard
          label="Total Views"
          value={totalViews.toLocaleString()}
          color="text-indigo-300"
        />
        <StatCard
          label="Avg. Conv. Rate"
          value={`${avgCr}%`}
          color="text-amber-300"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          Your Landing Pages
        </h2>
        <Button
          data-ocid="pages.create_button"
          onClick={onCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
          size="sm"
        >
          <PlusCircle size={14} className="mr-1.5" />
          New Page
        </Button>
      </div>

      {pages.length === 0 ? (
        <div
          data-ocid="pages.empty_state"
          className="text-center py-16 bg-gray-900/60 border border-white/8 rounded-xl"
        >
          <LayoutTemplate size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-medium mb-1">
            No landing pages yet
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Create a page from a niche template or start blank.
          </p>
          <Button
            data-ocid="pages.empty_state.create_button"
            onClick={onCreate}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Create My First Page
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page, i) => (
            <div
              key={page.id}
              data-ocid={`pages.item.${i + 1}`}
              className="bg-gray-900/60 border border-white/8 rounded-xl px-5 py-4 flex flex-wrap items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <button
                    type="button"
                    data-ocid={`pages.item.${i + 1}.open_button`}
                    onClick={() => onOpen(page)}
                    className="text-sm font-semibold text-white hover:text-indigo-300 transition-colors truncate"
                  >
                    {page.title}
                  </button>
                  <Badge
                    className={
                      page.status === "published"
                        ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
                        : "bg-slate-800 text-slate-400 border-slate-700/40"
                    }
                  >
                    {page.status === "published" ? "Live" : "Draft"}
                  </Badge>
                  {page.variantOf && (
                    <Badge className="bg-purple-900/40 text-purple-300 border-purple-700/40 text-[10px]">
                      Variant B
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500">/p/{page.slug}</p>
              </div>

              <div className="flex items-center gap-5 text-xs text-slate-400">
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    {page.analytics.views.toLocaleString()}
                  </p>
                  <p>Views</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    {page.analytics.submissions}
                  </p>
                  <p>Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-amber-300">
                    {page.analytics.conversionRate.toFixed(1)}%
                  </p>
                  <p>Conv.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`pages.item.${i + 1}.edit_button`}
                  onClick={() => onOpen(page)}
                  className="border-white/10 text-slate-300 hover:text-white h-8 px-2.5"
                >
                  <Edit3 size={12} className="mr-1" />
                  Edit
                </Button>
                {!page.variantOf && (
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`pages.item.${i + 1}.ab_button`}
                    onClick={() => onCreateVariantB(page)}
                    className="border-purple-700/40 text-purple-300 hover:text-white hover:bg-purple-900/30 h-8 px-2.5"
                  >
                    <FlipHorizontal size={12} className="mr-1" />
                    A/B
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`pages.item.${i + 1}.clone_button`}
                  onClick={() => onClone(page)}
                  className="border-white/10 text-slate-300 hover:text-white h-8 px-2.5"
                >
                  <Copy size={12} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`pages.item.${i + 1}.delete_button`}
                  onClick={() => onDelete(page.id)}
                  className="border-red-800/40 text-red-400 hover:bg-red-900/30 h-8 px-2"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Create Page Dialog ────────────────────────────────────────────────────────

function CreatePageDialog({
  onClose,
  onCreate,
  tenantId,
  lockedNicheId,
}: {
  onClose: () => void;
  onCreate: (page: LandingPage) => void;
  tenantId: string;
  lockedNicheId: NicheId | null;
}) {
  // If niche is locked, skip the template picker and auto-select first matching template
  const autoTemplate = lockedNicheId
    ? (NICHE_TEMPLATES.find((t) => t.niche === lockedNicheId) ?? null)
    : null;

  const [step, setStep] = useState<"template" | "details">(
    autoTemplate ? "details" : "template",
  );
  const [selectedTpl, setSelectedTpl] = useState<NicheTemplate | null>(
    autoTemplate,
  );
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    setSlug(slugify(val));
  }

  function handleCreate() {
    if (!selectedTpl || !title.trim()) return;
    const page: LandingPage = {
      id: mkPageId(),
      tenantId,
      title,
      slug: slug || slugify(title),
      niche: selectedTpl.niche,
      status: "draft",
      variant: "A",
      sections: selectedTpl.sections.map((s) => ({
        ...(JSON.parse(JSON.stringify(s)) as LandingPageSection),
        id: mkId(),
      })),
      analytics: {
        views: 0,
        submissions: 0,
        conversionRate: 0,
        variantAViews: 0,
        variantBViews: 0,
        variantASubmissions: 0,
        variantBSubmissions: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onCreate(page);
    onClose();
    toast.success("Landing page created!");
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="bg-gray-900 border-white/10 text-white max-w-3xl max-h-[85vh] overflow-y-auto"
        data-ocid="create_page.dialog"
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">
              {step === "template" ? "Choose a Template" : "Page Details"}
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              data-ocid="create_page.close_button"
              className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </DialogHeader>

        {step === "template" && (
          <TemplateGallery
            lockedNicheId={lockedNicheId}
            onSelect={(tpl) => {
              setSelectedTpl(tpl);
              setStep("details");
            }}
          />
        )}

        {step === "details" && selectedTpl && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 bg-indigo-950/40 border border-indigo-700/30 rounded-lg p-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{
                  background: `linear-gradient(135deg, ${selectedTpl.colorFrom}, ${selectedTpl.colorTo})`,
                }}
              >
                {selectedTpl.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {selectedTpl.label} Template
                </p>
                <p className="text-xs text-slate-400">
                  {selectedTpl.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !lockedNicheId && setStep("template")}
                className={`ml-auto text-xs text-indigo-400 hover:text-indigo-300 ${lockedNicheId ? "opacity-0 pointer-events-none" : ""}`}
              >
                Change
              </button>
            </div>
            <div>
              <Label className="text-slate-300 text-xs mb-1.5 block">
                Page Title *
              </Label>
              <Input
                data-ocid="create_page.title_input"
                placeholder={`e.g. ${selectedTpl.label} — Spring Promo`}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="bg-gray-800 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300 text-xs mb-1.5 block">
                URL Slug
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">/p/</span>
                <Input
                  data-ocid="create_page.slug_input"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="bg-gray-800 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-white/8">
              <Button
                variant="outline"
                onClick={() => !lockedNicheId && setStep("template")}
                data-ocid="create_page.back_button"
                disabled={!!lockedNicheId}
                className="border-white/10 text-slate-300"
              >
                Back
              </Button>
              <Button
                disabled={!title.trim()}
                onClick={handleCreate}
                data-ocid="create_page.confirm_button"
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Create Page
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LandingPageBuilderPage() {
  const { currentTenantId, addLead, isDemoMode, demoInfo, tenants } = useApp();
  const currentTenant = tenants.find((t) => t.id === currentTenantId);

  // Derive the locked niche ID — demo uses demoInfo.niche, client uses tenant.type
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

  const [pages, setPages] = useState<LandingPage[]>(() => {
    try {
      const raw = localStorage.getItem("brf_landing_pages");
      if (raw) return JSON.parse(raw) as LandingPage[];
    } catch {}
    return DEMO_LANDING_PAGES.filter(
      (p) =>
        p.tenantId === currentTenantId ||
        currentTenantId === "tenant-oceanside",
    );
  });
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [funnelPageTitle, setFunnelPageTitle] = useState<string | null>(null);

  function persist(updated: LandingPage[]) {
    setPages(updated);
    localStorage.setItem("brf_landing_pages", JSON.stringify(updated));
  }

  function handleSavePage(updated: LandingPage) {
    persist(pages.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPage(updated);
  }

  function handleCreatePage(page: LandingPage) {
    persist([page, ...pages]);
    setEditingPage(page);
  }

  function handleClone(page: LandingPage) {
    const cloned: LandingPage = {
      ...(JSON.parse(JSON.stringify(page)) as LandingPage),
      id: mkPageId(),
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      status: "draft",
      analytics: { views: 0, submissions: 0, conversionRate: 0 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    persist([cloned, ...pages]);
    toast.success("Page cloned");
  }

  function handleDelete(id: string) {
    persist(pages.filter((p) => p.id !== id));
    toast.success("Page deleted");
  }

  function handleCreateVariantB(page: LandingPage) {
    const varB: LandingPage = {
      ...(JSON.parse(JSON.stringify(page)) as LandingPage),
      id: mkPageId(),
      title: `${page.title} — Variant B`,
      slug: `${page.slug}-b`,
      status: "draft",
      variant: "B",
      variantOf: page.id,
      analytics: {
        views: 0,
        submissions: 0,
        conversionRate: 0,
        variantAViews: page.analytics.views,
        variantBViews: 0,
        variantASubmissions: page.analytics.submissions,
        variantBSubmissions: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    persist([varB, ...pages]);
    toast.success("Variant B created — customize it to start your A/B test.");
  }

  // Simulate form submission from a published landing page
  function handleFormSubmission(page: LandingPage) {
    addLead(page.tenantId, {
      name: "Web Visitor",
      phone: "",
      email: "",
      source: `Landing Page: ${page.title}`,
      status: "new",
      tenantId: page.tenantId,
    });
    // Update page analytics
    const updated: LandingPage = {
      ...page,
      analytics: {
        ...page.analytics,
        submissions: page.analytics.submissions + 1,
        views: page.analytics.views + 1,
        conversionRate: Number.parseFloat(
          (
            ((page.analytics.submissions + 1) / (page.analytics.views + 1)) *
            100
          ).toFixed(1),
        ),
      },
    };
    handleSavePage(updated);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutTemplate size={20} className="text-indigo-400" />
            <h1 className="text-xl font-bold text-white">
              Landing Page Builder
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Build, customize, and publish high-converting landing pages
            {lockedNicheId
              ? ` for ${getNicheOptions().find((n) => n.id === lockedNicheId)?.label ?? lockedNicheId}`
              : " for any niche"}{" "}
            — with A/B testing and lead capture built in.
          </p>
        </div>
        {!editingPage && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              data-ocid="landing_pages.overview.analytics_button"
              className="border-white/10 text-slate-300 hover:text-white"
            >
              <TrendingUp size={13} className="mr-1.5" />
              All Analytics
            </Button>
            <Button
              size="sm"
              data-ocid="landing_pages.overview.create_button"
              onClick={() => setShowCreate(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <PlusCircle size={13} className="mr-1.5" />
              New Page
            </Button>
          </div>
        )}
      </div>

      {/* Main content — list or builder */}
      {editingPage ? (
        <PageBuilderCanvas
          page={editingPage}
          onSave={handleSavePage}
          onBack={() => setEditingPage(null)}
        />
      ) : (
        <Tabs defaultValue="pages">
          <TabsList className="bg-gray-900 border border-white/10 mb-4">
            <TabsTrigger
              value="pages"
              data-ocid="landing_pages.tab.pages"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
            >
              <LayoutTemplate size={14} className="mr-1.5" />
              Pages
            </TabsTrigger>
            <TabsTrigger
              value="funnel"
              data-ocid="landing_pages.tab.funnel"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
            >
              <GitMerge size={14} className="mr-1.5" />
              Funnel Flow
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              data-ocid="landing_pages.tab.templates"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
            >
              <Eye size={14} className="mr-1.5" />
              Templates
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              data-ocid="landing_pages.tab.analytics"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
            >
              <TrendingUp size={14} className="mr-1.5" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages">
            <PageList
              pages={pages}
              onOpen={setEditingPage}
              onCreate={() => setShowCreate(true)}
              onClone={handleClone}
              onDelete={handleDelete}
              onCreateVariantB={handleCreateVariantB}
            />
          </TabsContent>

          <TabsContent value="funnel">
            <FunnelFlowBuilder
              pageTitle={funnelPageTitle ?? pages[0]?.title ?? "My Funnel"}
              niche={pages[0]?.niche}
              onStepOpen={(step: FunnelStep) => {
                // Map funnel step to the first matching page, or open create dialog
                const matched = pages.find(
                  (p) =>
                    p.title.toLowerCase().includes(step.title.toLowerCase()) ||
                    step.type === "landing",
                );
                if (matched) {
                  setEditingPage(matched);
                } else {
                  setFunnelPageTitle(step.title);
                  setShowCreate(true);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateGallery
              lockedNicheId={lockedNicheId}
              onSelect={(_tpl) => {
                setShowCreate(true);
              }}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page, i) => (
                <Card
                  key={page.id}
                  data-ocid={`analytics.page.${i + 1}`}
                  className="bg-gray-900/60 border-white/8"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-white truncate">
                        {page.title}
                      </CardTitle>
                      <Badge
                        className={
                          page.status === "published"
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
                            : "bg-slate-800 text-slate-400 border-slate-700/40"
                        }
                      >
                        {page.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">/p/{page.slug}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-300">
                          {page.analytics.views.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-slate-500">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-300">
                          {page.analytics.submissions}
                        </p>
                        <p className="text-[11px] text-slate-500">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-amber-300">
                          {page.analytics.conversionRate.toFixed(1)}%
                        </p>
                        <p className="text-[11px] text-slate-500">Conv.</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        data-ocid={`analytics.page.${i + 1}.simulate_button`}
                        onClick={() => handleFormSubmission(page)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                      >
                        + Simulate form submission
                      </button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPage(page)}
                        className="border-white/10 text-slate-400 hover:text-white h-7 px-2.5 text-xs"
                      >
                        <Edit3 size={11} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {pages.length === 0 && (
                <div
                  data-ocid="analytics.empty_state"
                  className="col-span-2 text-center py-12 text-slate-500"
                >
                  No pages to analyze yet.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {showCreate && (
        <CreatePageDialog
          tenantId={currentTenantId}
          lockedNicheId={lockedNicheId}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreatePage}
        />
      )}
    </div>
  );
}
