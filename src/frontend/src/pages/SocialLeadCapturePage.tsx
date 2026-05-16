import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Link2,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import { useSocialMedia } from "../hooks/useSocialMedia";
import type { SocialLead, SocialPlatform } from "../types/socialMedia";

// ─── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  google_business: "Google",
};

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  instagram: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  linkedin: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  tiktok: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  google_business: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const SIGNAL_TYPE_CONFIG = {
  comment: {
    icon: MessageCircle,
    label: "Comment",
    color: "text-blue-400",
    points: 1,
  },
  dm: { icon: MessageSquare, label: "DM", color: "text-purple-400", points: 3 },
  form_fill: {
    icon: Zap,
    label: "Form Fill",
    color: "text-amber-400",
    points: 4,
  },
  reply: {
    icon: ArrowRight,
    label: "Reply Chain",
    color: "text-emerald-400",
    points: 2,
  },
} as const;

type SignalType = keyof typeof SIGNAL_TYPE_CONFIG;

// Derive signal type from source data
function inferSignalType(lead: SocialLead): SignalType {
  const t = lead.source.triggerText?.toLowerCase() ?? "";
  if (t.includes("dm") || t.includes("message")) return "dm";
  if (t.includes("form") || t.includes("fill") || t.includes("inquiry"))
    return "form_fill";
  if (lead.source.commentId && lead.source.postId) return "comment";
  return "comment";
}

function getEngagementDepth(type: SignalType): number {
  return SIGNAL_TYPE_CONFIG[type].points;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getConfidenceConfig(c: number) {
  if (c >= 0.9)
    return {
      label: "🔥 Hot",
      className: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    };
  if (c >= 0.75)
    return {
      label: "🌡 Warm",
      className: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    };
  return {
    label: "❄ Cool",
    className: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  };
}

function getStatusConfig(status: SocialLead["status"]) {
  const map = {
    new: {
      label: "New",
      className: "bg-primary/20 text-primary border-primary/40",
    },
    contacted: {
      label: "Contacted",
      className: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    qualified: {
      label: "Qualified",
      className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    converted: {
      label: "Converted",
      className: "bg-green-500/20 text-green-300 border-green-500/30",
    },
    lost: {
      label: "Lost",
      className: "bg-muted text-muted-foreground border-border",
    },
  };
  return map[status] ?? map.new;
}

// ─── Rich demo data for a populated, realistic feed ──────────────────────────

const RICH_DEMO_SIGNALS: SocialLead[] = [
  {
    id: "sl-demo-1",
    tenantId: "tenant-1",
    name: "James Robertson",
    contactInfo: "james.robertson@gmail.com",
    source: {
      platform: "facebook",
      postId: "sp-1",
      commentId: "c-101",
      triggerText: "How much to replace water heater",
    },
    buyingSignalText:
      "How much does it usually cost to replace a water heater? Mine is 12 years old and acting up.",
    confidence: 0.94,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Expressed cost intent, water heater 12 years old",
    createdAt: Date.now() - 900000,
    updatedAt: Date.now() - 900000,
  },
  {
    id: "sl-demo-2",
    tenantId: "tenant-1",
    name: "Maria Chen",
    contactInfo: "maria.chen@yahoo.com",
    source: {
      platform: "instagram",
      postId: "sp-2",
      commentId: "c-102",
      triggerText: "Same-day service availability",
    },
    buyingSignalText:
      "Do you guys do same-day service? My kitchen drain is completely backed up right now 😩",
    confidence: 0.91,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Emergency drain issue, high urgency",
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  },
  {
    id: "sl-demo-3",
    tenantId: "tenant-1",
    name: "David Park",
    contactInfo: "d.park@protonmail.com",
    source: {
      platform: "facebook",
      postId: "sp-3",
      commentId: null,
      triggerText: "form inquiry — free estimate",
    },
    buyingSignalText:
      "Submitted free estimate form. Needs full bathroom remodel plumbing — 3BR home in San Diego.",
    confidence: 0.97,
    status: "contacted",
    crmLeadId: "crm-lead-004",
    linkedToCrm: true,
    notes: "High-value bathroom remodel job",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1200000,
  },
  {
    id: "sl-demo-4",
    tenantId: "tenant-1",
    name: "Keisha Williams",
    contactInfo: "kwilliams@outlook.com",
    source: {
      platform: "google_business",
      postId: null,
      commentId: "c-104",
      triggerText: "price comparison question",
    },
    buyingSignalText:
      "How do your prices compare? Got one quote already but it seemed high. Looking for a second opinion.",
    confidence: 0.82,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Price shopping, warm lead",
    createdAt: Date.now() - 5400000,
    updatedAt: Date.now() - 5400000,
  },
  {
    id: "sl-demo-5",
    tenantId: "tenant-1",
    name: "Tom Nguyen",
    contactInfo: "tom.n@icloud.com",
    source: {
      platform: "linkedin",
      postId: "sp-5",
      commentId: "c-105",
      triggerText: "dm — looking for contractor referral",
    },
    buyingSignalText:
      "Hey, I saw your post — do you work in the Chula Vista area? I manage 4 rental properties and need a reliable plumber on call.",
    confidence: 0.88,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Property manager, high-LTV recurring potential",
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
  {
    id: "sl-demo-6",
    tenantId: "tenant-1",
    name: "Sandra Ortega",
    contactInfo: "s.ortega@email.com",
    source: {
      platform: "facebook",
      postId: "sp-1",
      commentId: "c-106",
      triggerText: "leak emergency",
    },
    buyingSignalText:
      "We have water coming through the ceiling from upstairs bathroom. How fast can you get here?",
    confidence: 0.99,
    status: "qualified",
    crmLeadId: "crm-lead-007",
    linkedToCrm: true,
    notes: "Emergency leak — fast close required",
    createdAt: Date.now() - 9000000,
    updatedAt: Date.now() - 8000000,
  },
  {
    id: "sl-demo-7",
    tenantId: "tenant-1",
    name: "Brian Kastner",
    contactInfo: "bkastner@gmail.com",
    source: {
      platform: "instagram",
      postId: "sp-7",
      commentId: "c-107",
      triggerText: "follow-up on comment reply",
    },
    buyingSignalText:
      "Thanks for responding! I replied to your earlier comment. Can we set up a time this week?",
    confidence: 0.79,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Engaged twice — warm via reply chain",
    createdAt: Date.now() - 12600000,
    updatedAt: Date.now() - 12600000,
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-2xl font-bold font-display ${accent}`}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            {sub && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
            )}
          </div>
          <div className="p-2 rounded-lg bg-card border border-border">
            <Icon className={`h-4 w-4 ${accent}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DepthIndicator({ depth }: { depth: number }) {
  const config = [
    { threshold: 1, label: "1pt", title: "Comment" },
    { threshold: 2, label: "2pt", title: "Reply chain" },
    { threshold: 3, label: "3pt", title: "DM" },
    { threshold: 4, label: "4pt", title: "Form fill" },
  ];
  return (
    <div
      className="flex items-center gap-1"
      title={`Engagement depth: ${config[depth - 1]?.title ?? "unknown"}`}
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`h-1.5 w-4 rounded-full transition-colors ${
            i <= depth ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        {config[depth - 1]?.label}
      </span>
    </div>
  );
}

function PlatformBadge({ platform }: { platform: SocialPlatform }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${PLATFORM_COLORS[platform]}`}
    >
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function SignalCard({
  lead,
  index,
  isHot,
  onAddToCRM,
  onDismiss,
}: {
  lead: SocialLead;
  index: number;
  isHot: boolean;
  onAddToCRM: (lead: SocialLead) => void;
  onDismiss: (id: string) => void;
}) {
  const conf = getConfidenceConfig(lead.confidence);
  const status = getStatusConfig(lead.status);
  const signalType = inferSignalType(lead);
  const SignalIcon = SIGNAL_TYPE_CONFIG[signalType].icon;
  const depth = getEngagementDepth(signalType);
  const attribution = `${PLATFORM_LABELS[lead.source.platform]}_Post_${lead.source.postId ?? "direct"}`;
  const pct = Math.round(lead.confidence * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, delay: index * 0.05 }}
      data-ocid={`social_lead_capture.item.${index + 1}`}
      className={`relative rounded-xl border p-4 transition-colors ${
        isHot
          ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10"
          : "border-border bg-card hover:bg-muted/10"
      }`}
    >
      {isHot && (
        <div className="absolute top-3 right-3">
          <Flame className="h-4 w-4 text-emerald-400 animate-pulse" />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
          {(lead.name || "?")[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap pr-6">
            <span className="font-semibold text-sm text-foreground">
              {lead.name || "Anonymous"}
            </span>
            <PlatformBadge platform={lead.source.platform} />
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${conf.className}`}
            >
              {conf.label} · {pct}%
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${status.className}`}
            >
              {status.label}
            </span>
            <span className="ml-auto text-xs text-muted-foreground shrink-0">
              {timeAgo(lead.createdAt)}
            </span>
          </div>

          {/* Signal type row */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SignalIcon
              className={`h-3.5 w-3.5 ${SIGNAL_TYPE_CONFIG[signalType].color}`}
            />
            <span className={SIGNAL_TYPE_CONFIG[signalType].color}>
              {SIGNAL_TYPE_CONFIG[signalType].label}
            </span>
            <span className="opacity-40">·</span>
            <DepthIndicator depth={depth} />
          </div>

          {/* Message */}
          <blockquote className="text-sm text-foreground/80 italic border-l-2 border-primary/30 pl-3 leading-relaxed">
            "{lead.buyingSignalText}"
          </blockquote>

          {/* Attribution tag + contact */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded font-mono">
              <Activity className="h-3 w-3" />
              {attribution}
            </span>
            {lead.contactInfo && (
              <span className="text-xs text-muted-foreground">
                {lead.contactInfo}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {!lead.linkedToCrm ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onAddToCRM(lead)}
                  data-ocid={`social_lead_capture.add_crm_button.${index + 1}`}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Link2 className="h-3 w-3" />
                  Add to CRM
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss(lead.id)}
                  data-ocid={`social_lead_capture.dismiss_button.${index + 1}`}
                  className="gap-1.5 h-7 text-xs text-muted-foreground"
                >
                  <XCircle className="h-3 w-3" />
                  Dismiss
                </Button>
              </>
            ) : (
              <Badge
                variant="secondary"
                className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                In CRM
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CRM Slide-out Panel ──────────────────────────────────────────────────────

interface CRMPanelProps {
  lead: SocialLead | null;
  onClose: () => void;
  onConfirm: (lead: SocialLead, name: string, notes: string) => Promise<void>;
}

function CRMSlidePanel({ lead, onClose, onConfirm }: CRMPanelProps) {
  const [name, setName] = useState(lead?.name ?? "");
  const [notes, setNotes] = useState(lead?.buyingSignalText ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (lead) {
      setName(lead.name ?? "");
      setNotes(lead.buyingSignalText ?? "");
    }
  }, [lead]);

  const handleSubmit = async () => {
    if (!lead) return;
    setBusy(true);
    try {
      await onConfirm(lead, name, notes);
    } finally {
      setBusy(false);
    }
  };

  if (!lead) return null;

  const signalType = inferSignalType(lead);
  const attribution = `${PLATFORM_LABELS[lead.source.platform]}_Post_${lead.source.postId ?? "direct"}`;
  const nicheGuess = lead.notes.toLowerCase().includes("bath")
    ? "Plumbing / Bathroom"
    : lead.notes.toLowerCase().includes("drain")
      ? "Plumbing / Drain"
      : lead.notes.toLowerCase().includes("rental")
        ? "Property Management"
        : "Plumbing";

  return (
    <AnimatePresence>
      {lead && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            data-ocid="social_lead_capture.dialog"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            data-ocid="social_lead_capture.modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-card">
              <div>
                <h2 className="font-semibold text-foreground">
                  Create CRM Lead
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Pre-filled from social signal
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                data-ocid="social_lead_capture.close_button"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Signal summary */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1.5">
                <p className="text-xs font-medium text-primary uppercase tracking-wide">
                  Detected signal
                </p>
                <p className="text-sm text-foreground italic">
                  "{lead.buyingSignalText}"
                </p>
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <PlatformBadge platform={lead.source.platform} />
                  <span className="text-xs text-muted-foreground">
                    {SIGNAL_TYPE_CONFIG[signalType].label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(lead.confidence * 100)}% confidence
                  </span>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="crm-name" className="text-xs">
                    Contact Name
                  </Label>
                  <Input
                    id="crm-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    data-ocid="social_lead_capture.crm_name_input"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="crm-contact" className="text-xs">
                    Contact Info
                  </Label>
                  <Input
                    id="crm-contact"
                    defaultValue={lead.contactInfo}
                    readOnly
                    className="bg-muted/40 text-muted-foreground"
                    data-ocid="social_lead_capture.crm_contact_input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="crm-source" className="text-xs">
                    Source Attribution
                  </Label>
                  <Input
                    id="crm-source"
                    value={attribution}
                    readOnly
                    className="bg-muted/40 text-muted-foreground font-mono text-xs"
                    data-ocid="social_lead_capture.crm_source_input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="crm-niche" className="text-xs">
                    Niche (auto-detected)
                  </Label>
                  <Input
                    id="crm-niche"
                    value={nicheGuess}
                    readOnly
                    className="bg-muted/40 text-muted-foreground"
                    data-ocid="social_lead_capture.crm_niche_input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="crm-notes" className="text-xs">
                    Notes
                  </Label>
                  <Textarea
                    id="crm-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="bg-background resize-none"
                    data-ocid="social_lead_capture.crm_notes_textarea"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border bg-card flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-ocid="social_lead_capture.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={busy || !name.trim()}
                className="flex-1 gap-2"
                data-ocid="social_lead_capture.confirm_button"
              >
                {busy ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Link2 className="h-3.5 w-3.5" />
                )}
                Create Lead
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Lead Table ───────────────────────────────────────────────────────────────

function LeadsTable({
  leads,
  onAddToCRM,
}: {
  leads: SocialLead[];
  onAddToCRM: (lead: SocialLead) => void;
}) {
  const [sortField, setSortField] = useState<"createdAt" | "confidence">(
    "createdAt",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [leads, sortField, sortDir]);

  const toggleSort = (field: "createdAt" | "confidence") => {
    if (sortField === field) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: "createdAt" | "confidence" }) => {
    if (sortField !== field)
      return <ChevronDown className="h-3 w-3 text-muted-foreground/40" />;
    return sortDir === "desc" ? (
      <ChevronDown className="h-3 w-3 text-primary" />
    ) : (
      <ChevronUp className="h-3 w-3 text-primary" />
    );
  };

  if (leads.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      {/* Desktop table */}
      <table className="hidden md:table w-full text-sm">
        <thead className="bg-muted/30 border-b border-border">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
              Contact
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
              Source
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
              Signal type
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer select-none"
                onClick={() => toggleSort("confidence")}
              >
                Confidence <SortIcon field="confidence" />
              </button>
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer select-none"
                onClick={() => toggleSort("createdAt")}
              >
                Date <SortIcon field="createdAt" />
              </button>
            </th>
            <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((lead, i) => {
            const conf = getConfidenceConfig(lead.confidence);
            const status = getStatusConfig(lead.status);
            const sigType = inferSignalType(lead);
            const SigIcon = SIGNAL_TYPE_CONFIG[sigType].icon;
            return (
              <tr
                key={lead.id}
                data-ocid={`social_lead_capture.table.item.${i + 1}`}
                className="border-b border-border/50 hover:bg-muted/10 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">
                    {lead.name || "Anonymous"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lead.contactInfo}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PlatformBadge platform={lead.source.platform} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${SIGNAL_TYPE_CONFIG[sigType].color}`}
                  >
                    <SigIcon className="h-3.5 w-3.5" />
                    {SIGNAL_TYPE_CONFIG[sigType].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${conf.className}`}
                  >
                    {Math.round(lead.confidence * 100)}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${status.className}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {!lead.linkedToCrm ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToCRM(lead)}
                      data-ocid={`social_lead_capture.table_crm_button.${i + 1}`}
                      className="h-7 text-xs gap-1"
                    >
                      <Link2 className="h-3 w-3" />
                      CRM
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      In CRM
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {sorted.map((lead, i) => {
          const conf = getConfidenceConfig(lead.confidence);
          const status = getStatusConfig(lead.status);
          return (
            <div
              key={lead.id}
              data-ocid={`social_lead_capture.table.item.${i + 1}`}
              className="p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-foreground">
                  {lead.name || "Anonymous"}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${conf.className}`}
                >
                  {Math.round(lead.confidence * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <PlatformBadge platform={lead.source.platform} />
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {lead.contactInfo}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(lead.createdAt).toLocaleDateString()}
              </p>
              {!lead.linkedToCrm && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAddToCRM(lead)}
                  data-ocid={`social_lead_capture.table_crm_button_mobile.${i + 1}`}
                  className="w-full h-8 gap-1.5 text-xs mt-1"
                >
                  <Link2 className="h-3 w-3" />
                  Add to CRM
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Platform filter chips ─────────────────────────────────────────────────────

const PLATFORMS: Array<{ value: SocialPlatform | "all"; label: string }> = [
  { value: "all", label: "All Platforms" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "google_business", label: "Google" },
  { value: "tiktok", label: "TikTok" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SocialLeadCapturePage() {
  const {
    socialLeads: backendLeads,
    getSocialLeads,
    createSocialLead,
    linkSocialLeadToCRM,
    isLoadingLeads,
  } = useSocialMedia();

  // Merge backend leads with rich demo data
  const [leads, setLeads] = useState<SocialLead[]>(() => {
    const ids = new Set(backendLeads.map((l) => l.id));
    return [
      ...backendLeads,
      ...RICH_DEMO_SIGNALS.filter((d) => !ids.has(d.id)),
    ];
  });

  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | "all">(
    "all",
  );
  const [signalFilter, setSignalFilter] = useState<"all" | "hot" | "new">(
    "all",
  );
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [crmTarget, setCrmTarget] = useState<SocialLead | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only call
  useEffect(() => {
    void getSocialLeads("tenant-1");
  }, []);

  // Keep leads in sync when backend leads change
  useEffect(() => {
    const ids = new Set(backendLeads.map((l) => l.id));
    setLeads((prev) => {
      const demoOnly = RICH_DEMO_SIGNALS.filter((d) => !ids.has(d.id));
      const backendMap = new Map(backendLeads.map((l) => [l.id, l]));
      return [
        ...backendLeads,
        ...prev
          .filter((p) => !backendMap.has(p.id))
          .filter((p) => demoOnly.some((d) => d.id === p.id) || !ids.has(p.id)),
      ];
    });
  }, [backendLeads]);

  // ─── Derived data ──────────────────────────────────────────────────────────
  const visible = useMemo(
    () =>
      leads
        .filter((l) => !dismissed.has(l.id))
        .filter(
          (l) =>
            platformFilter === "all" || l.source.platform === platformFilter,
        )
        .filter((l) => {
          if (signalFilter === "hot") return l.confidence >= 0.9;
          if (signalFilter === "new") return l.status === "new";
          return true;
        }),
    [leads, dismissed, platformFilter, signalFilter],
  );

  const hotSignals = visible.filter((l) => l.confidence >= 0.9);
  const regularSignals = visible.filter((l) => l.confidence < 0.9);

  const stats = useMemo(() => {
    const today = Date.now() - 86400000;
    const todayLeads = leads.filter(
      (l) => l.createdAt >= today && !dismissed.has(l.id),
    );
    const allConf = leads.filter((l) => !dismissed.has(l.id));
    const avgConf =
      allConf.length > 0
        ? allConf.reduce((s, l) => s + l.confidence, 0) / allConf.length
        : 0;
    return {
      signalsToday: todayLeads.length,
      hotToday: todayLeads.filter((l) => l.confidence >= 0.9).length,
      converted: leads.filter((l) => l.linkedToCrm).length,
      avgConf: Math.round(avgConf * 100),
    };
  }, [leads, dismissed]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    toast.info("Signal dismissed");
  };

  const handleAddToCRMClick = (lead: SocialLead) => {
    setCrmTarget(lead);
  };

  const handleConfirmCRM = async (
    lead: SocialLead,
    name: string,
    notes: string,
  ) => {
    // Create the lead via hook then link to CRM
    const newLead = await createSocialLead({
      ...lead,
      name,
      notes,
      tenantId: "tenant-1",
      linkedToCrm: false,
      crmLeadId: null,
      status: "new",
    });
    await linkSocialLeadToCRM(newLead.id);
    // Also mark the original signal as linked
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, linkedToCrm: true } : l)),
    );
    setCrmTarget(null);
    toast.success(`${name} added to CRM`, {
      description: `Source: ${PLATFORM_LABELS[lead.source.platform]}`,
    });
  };

  return (
    <>
      <div
        data-ocid="social_lead_capture.page"
        className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto"
      >
        {/* ─── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                Lead Capture from Social
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/30">
                <Sparkles className="h-3 w-3" />
                {visible.length} signals
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              AI-detected buying signals from comments, DMs &amp; form fills —
              push to CRM instantly
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void getSocialLeads("tenant-1")}
            data-ocid="social_lead_capture.refresh_button"
            className="gap-1.5 shrink-0"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoadingLeads ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* ─── Stats bar ──────────────────────────────────────────────── */}
        <div
          data-ocid="social_lead_capture.stats_panel"
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <StatCard
            label="Signals today"
            value={stats.signalsToday}
            icon={Activity}
            accent="text-primary"
          />
          <StatCard
            label="Hot prospects today"
            value={stats.hotToday}
            icon={Flame}
            accent="text-rose-400"
          />
          <StatCard
            label="Converted to leads"
            value={stats.converted}
            icon={TrendingUp}
            accent="text-emerald-400"
          />
          <StatCard
            label="Avg buy signal conf."
            value={`${stats.avgConf}%`}
            icon={BarChart3}
            accent="text-amber-400"
          />
        </div>

        {/* ─── Platform + signal filters ──────────────────────────────── */}
        <div
          data-ocid="social_lead_capture.filters_panel"
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Platform chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() =>
                  setPlatformFilter(p.value as SocialPlatform | "all")
                }
                data-ocid={`social_lead_capture.platform_filter.${p.value}`}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  platformFilter === p.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Signal-type quick filters */}
          <div className="flex items-center gap-1.5 sm:ml-auto">
            {(["all", "hot", "new"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSignalFilter(f)}
                data-ocid={`social_lead_capture.signal_filter.${f}`}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  signalFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"
                }`}
              >
                {f === "hot" ? "🔥 Hot" : f === "new" ? "New" : "All"}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Loading skeleton ────────────────────────────────────────── */}
        {isLoadingLeads && (
          <div
            data-ocid="social_lead_capture.loading_state"
            className="space-y-3"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* ─── Hot Signals section ─────────────────────────────────────── */}
        {!isLoadingLeads && hotSignals.length > 0 && (
          <section data-ocid="social_lead_capture.hot_signals_section">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-foreground">
                Hot Signals
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  90%+ buying confidence
                </span>
              </h2>
              <Badge
                variant="outline"
                className="ml-auto text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              >
                {hotSignals.length}
              </Badge>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {hotSignals.map((lead, i) => (
                  <SignalCard
                    key={lead.id}
                    lead={lead}
                    index={i}
                    isHot
                    onAddToCRM={handleAddToCRMClick}
                    onDismiss={handleDismiss}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* ─── Signal feed section ─────────────────────────────────────── */}
        {!isLoadingLeads && (
          <section data-ocid="social_lead_capture.feed_section">
            {hotSignals.length > 0 && regularSignals.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  All Signals
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    under 90% confidence
                  </span>
                </h2>
                <Badge variant="outline" className="ml-auto text-xs">
                  {regularSignals.length}
                </Badge>
              </div>
            )}

            {visible.length === 0 ? (
              <div
                data-ocid="social_lead_capture.empty_state"
                className="text-center py-14 rounded-xl border border-dashed border-border bg-muted/10"
              >
                <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="font-semibold text-foreground">
                  No signals in this queue
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Buying signals are auto-detected from social comments, DMs,
                  and form fills as they happen.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-1.5"
                  onClick={() => {
                    setPlatformFilter("all");
                    setSignalFilter("all");
                    setDismissed(new Set());
                  }}
                  data-ocid="social_lead_capture.reset_filters_button"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {(hotSignals.length > 0 ? regularSignals : visible).map(
                    (lead, i) => (
                      <SignalCard
                        key={lead.id}
                        lead={lead}
                        index={i}
                        isHot={false}
                        onAddToCRM={handleAddToCRMClick}
                        onDismiss={handleDismiss}
                      />
                    ),
                  )}
                </AnimatePresence>
              </div>
            )}
          </section>
        )}

        {/* ─── Lead dashboard table ─────────────────────────────────────── */}
        {!isLoadingLeads &&
          leads.filter((l) => !dismissed.has(l.id)).length > 0 && (
            <section data-ocid="social_lead_capture.leads_table_section">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      Captured Lead Dashboard
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {leads.filter((l) => !dismissed.has(l.id)).length} total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <LeadsTable
                    leads={leads.filter((l) => !dismissed.has(l.id))}
                    onAddToCRM={handleAddToCRMClick}
                  />
                </CardContent>
              </Card>
            </section>
          )}
      </div>

      {/* ─── CRM slide-out panel ─────────────────────────────────────────── */}
      <CRMSlidePanel
        lead={crmTarget}
        onClose={() => setCrmTarget(null)}
        onConfirm={handleConfirmCRM}
      />
    </>
  );
}
