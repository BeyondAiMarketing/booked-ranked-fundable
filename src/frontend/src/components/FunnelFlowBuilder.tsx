import {
  ArrowDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GitMerge,
  PlusCircle,
  Settings2,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// ── Types ──────────────────────────────────────────────────────────────────────

export type FunnelStepType =
  | "landing"
  | "thank-you"
  | "upsell"
  | "booking-confirmation";

export interface FunnelStep {
  id: string;
  type: FunnelStepType;
  title: string;
  sections: string[];
  crmTrigger: string;
  conversionRate: number;
}

interface FunnelFlowBuilderProps {
  pageTitle: string;
  niche?: string;
  onStepOpen: (step: FunnelStep) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STEP_META: Record<
  FunnelStepType,
  {
    label: string;
    color: string;
    bg: string;
    icon: string;
    description: string;
  }
> = {
  landing: {
    label: "Landing Page",
    color: "text-indigo-300",
    bg: "bg-indigo-900/30 border-indigo-700/40",
    icon: "🎯",
    description: "Primary entry point — capture attention and drive the CTA",
  },
  "thank-you": {
    label: "Thank You Page",
    color: "text-emerald-300",
    bg: "bg-emerald-900/30 border-emerald-700/40",
    icon: "✅",
    description:
      "Post-conversion confirmation — reduce anxiety and set expectations",
  },
  upsell: {
    label: "Upsell",
    color: "text-amber-300",
    bg: "bg-amber-900/30 border-amber-700/40",
    icon: "⚡",
    description: "One-time offer — capture additional revenue from buyers",
  },
  "booking-confirmation": {
    label: "Booking Confirmation",
    color: "text-violet-300",
    bg: "bg-violet-900/30 border-violet-700/40",
    icon: "📅",
    description:
      "Appointment confirmed — reduce no-shows with reminders and next steps",
  },
};

const CRM_TRIGGERS: Record<FunnelStepType, string> = {
  landing: "On form submit → create CRM lead",
  "thank-you": "On page view → update lead status to 'converted'",
  upsell: "On upsell accept → tag lead as 'upsell' + trigger premium sequence",
  "booking-confirmation":
    "On booking confirm → schedule appointment + fire reminder sequence",
};

const DEFAULT_SECTIONS: Record<FunnelStepType, string[]> = {
  landing: ["Hero", "Features", "Social Proof", "CTA"],
  "thank-you": ["Confirmation", "Next Steps", "Social Proof", "Secondary CTA"],
  upsell: ["Offer Headline", "Value Stack", "Urgency", "Accept/Decline"],
  "booking-confirmation": [
    "Confirmation Banner",
    "Appointment Details",
    "Prep Instructions",
    "Referral Ask",
  ],
};

// ── Helper ────────────────────────────────────────────────────────────────────

function mkStepId() {
  return `step-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

function buildDefaultFunnel(pageTitle: string): FunnelStep[] {
  return [
    {
      id: mkStepId(),
      type: "landing",
      title: pageTitle,
      sections: DEFAULT_SECTIONS.landing,
      crmTrigger: CRM_TRIGGERS.landing,
      conversionRate: 28.4,
    },
    {
      id: mkStepId(),
      type: "thank-you",
      title: "Thank You — Your Request is Confirmed",
      sections: DEFAULT_SECTIONS["thank-you"],
      crmTrigger: CRM_TRIGGERS["thank-you"],
      conversionRate: 81.2,
    },
  ];
}

const ADDABLE_STEP_TYPES: FunnelStepType[] = ["upsell", "booking-confirmation"];

// ── Step Card ─────────────────────────────────────────────────────────────────

function FunnelStepCard({
  step,
  index,
  total,
  onOpen,
  onDelete,
  onMove,
  onEditTrigger,
}: {
  step: FunnelStep;
  index: number;
  total: number;
  onOpen: (s: FunnelStep) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onEditTrigger: (id: string, trigger: string) => void;
}) {
  const meta = STEP_META[step.type];
  const [editingTrigger, setEditingTrigger] = useState(false);
  const [triggerDraft, setTriggerDraft] = useState(step.crmTrigger);

  return (
    <div
      data-ocid={`funnel_flow.step.${index + 1}`}
      className={`rounded-xl border p-4 ${meta.bg} transition-all duration-200 hover:border-white/20`}
    >
      <div className="flex items-start gap-3">
        {/* Step number + emoji */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base">
            {meta.icon}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold">
            #{index + 1}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <button
              type="button"
              className={`text-sm font-semibold ${meta.color} hover:text-white transition-colors truncate`}
              onClick={() => onOpen(step)}
              data-ocid={`funnel_flow.step.${index + 1}.edit_button`}
            >
              {step.title}
            </button>
            <Badge
              className={`text-[9px] border px-1.5 py-0.5 ${meta.bg} ${meta.color}`}
            >
              {meta.label}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mb-2">{meta.description}</p>

          {/* Sections row */}
          <div className="flex flex-wrap gap-1 mb-2">
            {step.sections.map((s) => (
              <span
                key={s}
                className="text-[10px] bg-white/6 text-slate-400 px-1.5 py-0.5 rounded border border-white/8"
              >
                {s}
              </span>
            ))}
          </div>

          {/* CRM Trigger */}
          <div className="flex items-start gap-1.5">
            <Zap size={11} className="text-amber-400 mt-0.5 shrink-0" />
            {editingTrigger ? (
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  className="flex-1 text-xs bg-gray-800 border border-white/10 rounded px-2 py-1 text-white"
                  value={triggerDraft}
                  onChange={(e) => setTriggerDraft(e.target.value)}
                  data-ocid={`funnel_flow.step.${index + 1}.trigger_input`}
                />
                <button
                  type="button"
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                  onClick={() => {
                    onEditTrigger(step.id, triggerDraft);
                    setEditingTrigger(false);
                    toast.success("CRM trigger updated");
                  }}
                  data-ocid={`funnel_flow.step.${index + 1}.trigger_save_button`}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-[10px] text-slate-400"
                  onClick={() => {
                    setTriggerDraft(step.crmTrigger);
                    setEditingTrigger(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="text-xs text-amber-400/80 hover:text-amber-300 text-left transition-colors"
                onClick={() => setEditingTrigger(true)}
                data-ocid={`funnel_flow.step.${index + 1}.trigger_edit_button`}
                title="Click to edit CRM trigger"
              >
                {step.crmTrigger}
              </button>
            )}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Conv rate */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg px-2 py-1">
            <TrendingUp size={11} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">
              {step.conversionRate.toFixed(1)}%
            </span>
          </div>
          {/* Move up/down */}
          <div className="flex gap-0.5">
            <button
              type="button"
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-20 transition-colors"
              title="Move up"
            >
              <ChevronUp size={13} />
            </button>
            <button
              type="button"
              onClick={() => onMove(index, 1)}
              disabled={index === total - 1}
              className="p-1 rounded hover:bg-white/10 text-slate-400 disabled:opacity-20 transition-colors"
              title="Move down"
            >
              <ChevronDown size={13} />
            </button>
          </div>
          {/* Delete (not for landing) */}
          {step.type !== "landing" && (
            <button
              type="button"
              onClick={() => onDelete(step.id)}
              className="p-1 rounded hover:bg-red-900/40 text-slate-500 hover:text-red-400 transition-colors"
              title="Remove step"
              data-ocid={`funnel_flow.step.${index + 1}.delete_button`}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Arrow Connector ───────────────────────────────────────────────────────────

function StepConnector({ trigger }: { trigger: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-4 bg-white/15" />
      <div className="flex items-center gap-2 bg-gray-900/80 border border-white/8 rounded-full px-3 py-1">
        <ArrowDown size={11} className="text-indigo-400" />
        <span className="text-[10px] text-slate-500">{trigger}</span>
      </div>
      <div className="w-px h-4 bg-white/15" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function FunnelFlowBuilder({
  pageTitle,
  onStepOpen,
}: FunnelFlowBuilderProps) {
  const [steps, setSteps] = useState<FunnelStep[]>(() =>
    buildDefaultFunnel(pageTitle),
  );
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Derived summary stats
  const totalSteps = steps.length;
  const avgConv =
    steps.length > 0
      ? steps.reduce((s, step) => s + step.conversionRate, 0) / steps.length
      : 0;
  const existingTypes = new Set(steps.map((s) => s.type));
  const addableTypes = ADDABLE_STEP_TYPES.filter((t) => !existingTypes.has(t));

  function handleMove(index: number, dir: -1 | 1) {
    const next = [...steps];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSteps(next);
  }

  function handleDelete(id: string) {
    setSteps((prev) => prev.filter((s) => s.id !== id));
    toast.success("Funnel step removed");
  }

  function handleEditTrigger(id: string, trigger: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, crmTrigger: trigger } : s)),
    );
  }

  function handleAddStep(type: FunnelStepType) {
    const meta = STEP_META[type];
    const newStep: FunnelStep = {
      id: mkStepId(),
      type,
      title: meta.label,
      sections: DEFAULT_SECTIONS[type],
      crmTrigger: CRM_TRIGGERS[type],
      conversionRate: type === "upsell" ? 12.3 : 67.8,
    };
    setSteps((prev) => [...prev, newStep]);
    setShowAddMenu(false);
    toast.success(`${meta.label} step added to funnel`);
  }

  // Build connector labels between steps
  function getConnectorLabel(fromType: FunnelStepType): string {
    if (fromType === "landing") return "On form submit";
    if (fromType === "thank-you") return "Shown after conversion";
    if (fromType === "upsell") return "On upsell accept";
    return "On booking confirm";
  }

  return (
    <div className="space-y-4" data-ocid="funnel_flow.builder">
      {/* Header */}
      <Card className="bg-gray-900/60 border-white/8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <GitMerge size={16} className="text-indigo-400" />
              <CardTitle className="text-sm text-white">Funnel Flow</CardTitle>
              <Badge className="bg-indigo-900/40 text-indigo-300 border-indigo-700/40 text-[10px]">
                {totalSteps} step{totalSteps !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Avg conv.</span>
                <span className="text-emerald-300 font-semibold">
                  {avgConv.toFixed(1)}%
                </span>
              </div>
              <div className="relative">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  disabled={addableTypes.length === 0}
                  className="border-indigo-700/40 text-indigo-300 hover:text-white hover:bg-indigo-900/40 h-7 text-xs"
                  data-ocid="funnel_flow.add_step_button"
                >
                  <PlusCircle size={12} className="mr-1" />
                  Add Step
                </Button>
                {showAddMenu && addableTypes.length > 0 && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-2 min-w-[200px]">
                    {addableTypes.map((type) => {
                      const meta = STEP_META[type];
                      return (
                        <button
                          key={type}
                          type="button"
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/8 text-left transition-colors"
                          onClick={() => handleAddStep(type)}
                          data-ocid={`funnel_flow.add_step.${type}`}
                        >
                          <span className="text-base">{meta.icon}</span>
                          <div>
                            <p
                              className={`text-xs font-semibold ${meta.color}`}
                            >
                              {meta.label}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {meta.description.slice(0, 40)}…
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-slate-400 hover:text-white"
                data-ocid="funnel_flow.settings_button"
              >
                <Settings2 size={12} className="mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-slate-500 mb-4">
            Each step is an independently editable page. CRM triggers fire
            automatically when visitors move through the funnel.
          </p>

          {/* Visual funnel pipeline */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.id}>
                <FunnelStepCard
                  step={step}
                  index={i}
                  total={steps.length}
                  onOpen={onStepOpen}
                  onDelete={handleDelete}
                  onMove={handleMove}
                  onEditTrigger={handleEditTrigger}
                />
                {i < steps.length - 1 && (
                  <StepConnector trigger={getConnectorLabel(step.type)} />
                )}
              </div>
            ))}
          </div>

          {/* Funnel summary stats */}
          {steps.length > 1 && (
            <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-white/8">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{totalSteps}</p>
                <p className="text-[11px] text-slate-500">Funnel Steps</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-300">
                  {steps[0].conversionRate.toFixed(1)}%
                </p>
                <p className="text-[11px] text-slate-500">Entry Conv. Rate</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-300">
                  {(
                    steps.reduce((p, s) => p * (s.conversionRate / 100), 1) *
                    100
                  ).toFixed(1)}
                  %
                </p>
                <p className="text-[11px] text-slate-500">Full-Funnel Rate</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
