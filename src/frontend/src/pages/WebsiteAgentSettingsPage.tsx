import {
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  RotateCcw,
  Save,
  Settings,
  Sparkles,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useApp } from "../context/AppContext";
import type {
  AgentTone,
  CtaStyle,
  OfferFramework,
} from "../lib/websiteAgentEngine";
import {
  clearMemory,
  loadAgentSettings,
  loadMemory,
  saveAgentSettings,
} from "../lib/websiteAgentEngine";

// ── Selector Option ───────────────────────────────────────────────────────────

function OptionButton({
  label,
  description,
  selected,
  onClick,
  ocid,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  ocid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all text-sm ${
        selected
          ? "border-violet-500/60 bg-violet-500/10 text-foreground"
          : "border-white/10 bg-white/3 text-muted-foreground hover:border-white/20 hover:text-foreground"
      }`}
    >
      <span className="font-semibold block">{label}</span>
      <span className="text-[11px] opacity-70">{description}</span>
    </button>
  );
}

// ── Client Settings Card ──────────────────────────────────────────────────────

function ClientSettingsCard({
  clientId,
  clientName,
  niche,
}: { clientId: string; clientName: string; niche: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState(() => loadAgentSettings(clientId));
  const [memory, setMemory] = useState(() => loadMemory(clientId));
  const [confirmClear, setConfirmClear] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveAgentSettings(settings);
    setHasChanges(false);
    toast.success(`Settings saved for ${clientName}`);
  };

  const handleClearMemory = () => {
    clearMemory(clientId);
    setMemory({
      clientId,
      sessionHistory: [],
      appliedChanges: [],
      lastEditedSection: "",
      tonePreference: "professional",
      appliedChangesCount: 0,
      recentChanges: [],
    });
    setConfirmClear(false);
    toast.success(`Memory cleared for ${clientName}`);
  };

  const toneOptions: {
    value: AgentTone;
    label: string;
    description: string;
  }[] = [
    {
      value: "urgent",
      label: "Urgent",
      description: "Creates pressure and calls for immediate action",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Credibility-first, trust-building approach",
    },
    {
      value: "friendly",
      label: "Friendly",
      description: "Conversational and approachable tone",
    },
    {
      value: "luxury",
      label: "Luxury",
      description: "Premium, aspirational, exclusive positioning",
    },
  ];

  const frameworkOptions: {
    value: OfferFramework;
    label: string;
    description: string;
  }[] = [
    {
      value: "value_stack",
      label: "Value Stack",
      description:
        "Hormozi — Stack value, eliminate risk, make offer irresistible",
    },
    {
      value: "before_after_bridge",
      label: "Before/After/Bridge",
      description: "Deiss — Show the transformation from problem to result",
    },
    {
      value: "pastor",
      label: "PASTOR",
      description:
        "Suby — Problem, Amplify, Story, Transformation, Offer, Response",
    },
    {
      value: "benefit_driven",
      label: "Benefit-Driven",
      description: "Ogilvy — Specific, research-backed benefit statements",
    },
    {
      value: "credibility_first",
      label: "Credibility-First",
      description: "Hopkins — Lead with proof, specifics, and trust signals",
    },
  ];

  const ctaOptions: { value: CtaStyle; label: string; description: string }[] =
    [
      {
        value: "direct_ask",
        label: "Direct Ask",
        description: 'e.g. "Get Your Free Quote Today"',
      },
      {
        value: "curiosity_hook",
        label: "Curiosity Hook",
        description: 'e.g. "Find Out What Others Won\'t Tell You"',
      },
      {
        value: "social_proof",
        label: "Social Proof",
        description: 'e.g. "Join 1,200+ Happy Homeowners"',
      },
      {
        value: "urgency_trigger",
        label: "Urgency Trigger",
        description: 'e.g. "Only 3 Slots Left This Week"',
      },
    ];

  return (
    <>
      <Card
        className="border-white/10 bg-card/60"
        data-ocid={`website_agent_settings.client_card.${clientId}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-700/30 border border-violet-500/20 flex items-center justify-center">
                <User size={16} className="text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  {clientName}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground capitalize">
                  {niche.replace("-", " ")} — Website Agent
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(memory.appliedChangesCount ?? 0) > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] text-violet-400 border-violet-500/30"
                >
                  {memory.appliedChangesCount} changes applied
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
                data-ocid={`website_agent_settings.expand_button.${clientId}`}
              >
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 space-y-6">
            {/* Tone Selector */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">
                Tone
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {toneOptions.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    label={opt.label}
                    description={opt.description}
                    selected={settings.tone === opt.value}
                    onClick={() => update("tone", opt.value)}
                    ocid={`website_agent_settings.tone_${opt.value}.${clientId}`}
                  />
                ))}
              </div>
            </div>

            {/* Offer Framework */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">
                Offer Framework
              </Label>
              <div className="space-y-2">
                {frameworkOptions.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    label={opt.label}
                    description={opt.description}
                    selected={settings.offerFramework === opt.value}
                    onClick={() => update("offerFramework", opt.value)}
                    ocid={`website_agent_settings.framework_${opt.value}.${clientId}`}
                  />
                ))}
              </div>
            </div>

            {/* CTA Style */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">
                CTA Style
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {ctaOptions.map((opt) => (
                  <OptionButton
                    key={opt.value}
                    label={opt.label}
                    description={opt.description}
                    selected={settings.ctaStyle === opt.value}
                    onClick={() => update("ctaStyle", opt.value)}
                    ocid={`website_agent_settings.cta_${opt.value}.${clientId}`}
                  />
                ))}
              </div>
            </div>

            {/* Audit-Driven Suggestions Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-white/8">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Audit-Driven Suggestions
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Surface recommendations based on the client's audit scores
                </p>
              </div>
              <Switch
                checked={settings.auditDrivenSuggestions}
                onCheckedChange={(v) => update("auditDrivenSuggestions", v)}
                data-ocid={`website_agent_settings.audit_suggestions_toggle.${clientId}`}
              />
            </div>

            {/* Memory Viewer */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain size={14} className="text-violet-400" />
                  <span className="text-xs font-semibold text-foreground">
                    Agent Memory
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => setConfirmClear(true)}
                  data-ocid={`website_agent_settings.clear_memory_button.${clientId}`}
                >
                  <Trash2 size={12} className="mr-1" /> Clear
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-0.5">Last Edited</p>
                  <p className="text-foreground font-medium capitalize">
                    {memory.lastEditedSection || "None yet"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">Tone Learned</p>
                  <p className="text-foreground font-medium capitalize">
                    {memory.tonePreference}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-0.5">
                    Changes Applied
                  </p>
                  <p className="text-foreground font-bold">
                    {memory.appliedChangesCount}
                  </p>
                </div>
              </div>

              {(memory.recentChanges ?? []).length > 0 && (
                <div>
                  <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock size={10} /> Recent Changes
                  </p>
                  <div className="space-y-1">
                    {(memory.recentChanges ?? []).map((change, i) => (
                      <div
                        key={`${change.sectionId}-${change.timestamp}`}
                        className="flex items-center justify-between text-[11px]"
                        data-ocid={`website_agent_settings.memory_change.${i + 1}`}
                      >
                        <span className="text-foreground/80 capitalize">
                          {change.sectionId} → {change.field}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(change.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(memory.recentChanges ?? []).length === 0 && (
                <p className="text-[11px] text-muted-foreground italic">
                  No changes applied yet. Memory builds as the client uses the
                  agent.
                </p>
              )}
            </div>

            {/* Save Button */}
            <Button
              className="w-full"
              variant={hasChanges ? "default" : "outline"}
              disabled={!hasChanges}
              onClick={handleSave}
              data-ocid={`website_agent_settings.save_button.${clientId}`}
            >
              <Save size={14} className="mr-1.5" />
              {hasChanges ? "Save Settings" : "No Changes"}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Confirm Clear Dialog */}
      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent data-ocid="website_agent_settings.clear_memory_dialog">
          <DialogHeader>
            <DialogTitle>Clear Agent Memory?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will reset all learned preferences and change history for{" "}
            <strong>{clientName}</strong>. The agent will start fresh with
            default settings.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmClear(false)}
              data-ocid="website_agent_settings.clear_memory_cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearMemory}
              data-ocid="website_agent_settings.clear_memory_confirm_button"
            >
              Clear Memory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function WebsiteAgentSettingsPage() {
  const { tenants } = useApp();
  const [search, setSearch] = useState("");

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="p-4 md:p-6 space-y-6"
      data-ocid="website_agent_settings.page"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">
            Website Agent Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure tone, frameworks, CTAs, and memory per client
          </p>
        </div>
      </div>

      {/* Framework banner */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-900/20 to-indigo-900/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-violet-400" />
          <span className="text-sm font-bold text-foreground">
            10 Marketing Frameworks Active
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Hormozi",
            "Kennedy",
            "Ogilvy",
            "Halbert",
            "Schwartz",
            "Abraham",
            "Sugarman",
            "Hopkins",
            "Deiss",
            "Suby",
          ].map((f) => (
            <Badge
              key={f}
              variant="outline"
              className="text-[10px] text-violet-300 border-violet-500/30 bg-violet-500/5"
            >
              {f}
            </Badge>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Each agent response draws from these proven direct-response frameworks
          to generate copy that converts. Settings below let you tune how the
          agent behaves per client.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: <User size={16} />,
            label: "Active Clients",
            value: tenants.length,
          },
          { icon: <Zap size={16} />, label: "Frameworks", value: 10 },
          {
            icon: <RotateCcw size={16} />,
            label: "Copy Variants/Request",
            value: 3,
          },
        ].map(({ icon, label, value }) => (
          <Card key={label} className="border-white/10 bg-card/40">
            <CardContent className="pt-4 pb-4 text-center space-y-1">
              <div className="flex justify-center text-violet-400">{icon}</div>
              <p className="text-2xl font-black text-foreground">{value}</p>
              <p className="text-[11px] text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Settings
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search clients…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
          data-ocid="website_agent_settings.search_input"
        />
      </div>

      {/* Client list */}
      <div className="space-y-3" data-ocid="website_agent_settings.client_list">
        {filteredTenants.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="website_agent_settings.empty_state"
          >
            <Brain size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No clients match your search.</p>
          </div>
        ) : (
          filteredTenants.map((tenant, i) => (
            <div
              key={tenant.id}
              data-ocid={`website_agent_settings.client_item.${i + 1}`}
            >
              <ClientSettingsCard
                clientId={tenant.id}
                clientName={tenant.name}
                niche={tenant.type}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
