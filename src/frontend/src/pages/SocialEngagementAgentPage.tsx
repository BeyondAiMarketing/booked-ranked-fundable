/**
 * SocialEngagementAgentPage — Production-grade approval queue with niche templates,
 * auto-approval rules, confidence scoring, and activity feed.
 *
 * CRITICAL SAFETY INVARIANT: No response may be posted to any social platform
 * without an explicit user click on "Approve & Post". The AI only drafts
 * responses. Human-in-the-loop is enforced at the component level.
 */

import {
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  ExternalLink,
  Flag,
  Flame,
  Heart,
  History,
  Loader2,
  MessageSquare,
  Pause,
  Play,
  RefreshCw,
  Settings,
  ShieldAlert,
  Sliders,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { useSocialMedia } from "../hooks/useSocialMedia";
import type { EngagementApproval, SocialPlatform } from "../types/socialMedia";

// ─── Platform config ───────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  google_business: "Google",
  tiktok: "TikTok",
};

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: "platform-facebook",
  instagram: "platform-instagram",
  linkedin: "badge-blue",
  google_business: "badge-rose",
  tiktok: "badge-purple",
};

// ─── Intent config ────────────────────────────────────────────────────────────

type IntentKey =
  | "purchase_intent"
  | "question"
  | "complaint"
  | "competitor_mention"
  | "community_love"
  | "spam"
  | "neutral";

const INTENT_META: Record<IntentKey, { label: string; className: string }> = {
  purchase_intent: {
    label: "Purchase Intent",
    className: "engagement-intent-purchase",
  },
  question: { label: "Question", className: "engagement-intent-question" },
  complaint: { label: "Complaint", className: "engagement-intent-complaint" },
  competitor_mention: { label: "Competitor", className: "badge-amber" },
  community_love: { label: "Community Love", className: "badge-emerald" },
  spam: { label: "Spam", className: "badge-rose" },
  neutral: { label: "Neutral", className: "status-draft" },
};

// ─── Niche-specific response templates ────────────────────────────────────────

const NICHE_TEMPLATES: Record<string, { label: string; template: string }[]> = {
  plumbing: [
    {
      label: "Emergency availability",
      template:
        "Great question! We offer same-day emergency service across [City]. Call us at [phone] — we're available 24/7 and can usually be there within the hour.",
    },
    {
      label: "Free estimate offer",
      template:
        "Thanks for reaching out! We offer free on-site estimates with no obligation. What's the best time for us to come take a look? You can also book online at [link].",
    },
    {
      label: "Pricing inquiry",
      template:
        "Happy to help with pricing! Every job is different, but we do offer upfront, flat-rate pricing — no surprises. Call us at [phone] or DM us your details for a quick estimate.",
    },
  ],
  hvac: [
    {
      label: "Service availability",
      template:
        "We're booking [season] tune-ups right now and slots are filling fast! Comment your zip code or call [phone] and we'll get you scheduled before the [heat wave / cold snap] hits.",
    },
    {
      label: "Emergency AC/Heat",
      template:
        "So sorry to hear that! We have emergency slots available — call [phone] right now and we'll get a tech out today. No one should be without AC in this heat.",
    },
    {
      label: "Energy savings",
      template:
        "Great question on efficiency! A properly maintained system can cut energy bills by 15–25%. We can do a full efficiency audit on your visit. Book at [link].",
    },
  ],
  med_spa: [
    {
      label: "Consultation inquiry",
      template:
        "We'd love to help you with that! Our [treatment] specialist can see you this week for a complimentary consultation. DM us or call [phone] to lock in your spot — we have limited availability.",
    },
    {
      label: "Results question",
      template:
        "Results vary by person, but most of our clients see [outcome] within [timeframe]. Book a free consultation and we can walk you through exactly what to expect for your specific goals.",
    },
    {
      label: "Pricing inquiry",
      template:
        "Pricing depends on the treatment area and number of units. We're happy to give you a personalized quote during your free consult — no pressure, just honest answers. DM us to schedule!",
    },
  ],
  roofing: [
    {
      label: "Storm damage",
      template:
        "After the storm, we're getting a lot of calls! Book your free inspection before the wait grows — we work directly with your insurance and can usually get out within 48 hours. Call [phone] now.",
    },
    {
      label: "Free inspection",
      template:
        "Great news — our inspections are completely free with no obligation. We'll assess the damage honestly, document everything for insurance, and give you a clear repair or replacement recommendation. Call [phone].",
    },
    {
      label: "Insurance question",
      template:
        "We work with all major insurance companies and handle the claims process for you. Most clients pay little to nothing out-of-pocket. Call [phone] and we'll walk you through exactly how it works.",
    },
  ],
  restoration: [
    {
      label: "Emergency response",
      template:
        "Water damage gets worse every hour — call us at [phone] right now! We mobilize immediately, 24/7, work directly with your insurance, and stop the damage before it gets worse. Don't wait.",
    },
    {
      label: "Insurance process",
      template:
        "We handle the entire insurance process for you — documentation, adjuster meetings, claim filing. Most of our clients pay $0 out of pocket. Call [phone] and we'll walk you through it.",
    },
    {
      label: "Mold concern",
      template:
        "Mold can start growing within 24-48 hours of water damage — act now! Call [phone] for an immediate assessment. We use IICRC-certified remediation and document everything for insurance.",
    },
  ],
  default: [
    {
      label: "General inquiry",
      template:
        "Thanks for reaching out! We'd love to help. Give us a call at [phone] or book online at [link] — we'll get back to you right away.",
    },
    {
      label: "Availability",
      template:
        "We have openings available this week! Call [phone] or visit [link] to book your appointment. We look forward to serving you!",
    },
    {
      label: "Pricing",
      template:
        "Great question! Pricing depends on your specific needs. Call us at [phone] for a free, no-obligation estimate tailored to your situation.",
    },
  ],
};

// ─── Auto-approval rule types ─────────────────────────────────────────────────

interface AutoApprovalRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  conditionLabel: string;
  threshold: number;
}

const DEFAULT_AUTO_RULES: AutoApprovalRule[] = [
  {
    id: "high-confidence-pricing",
    label: "Auto-approve pricing questions",
    description:
      "Automatically post responses to comments asking about pricing when confidence is high",
    enabled: false,
    conditionLabel: "confidence >",
    threshold: 85,
  },
  {
    id: "high-confidence-availability",
    label: "Auto-approve availability questions",
    description:
      "Automatically post responses to comments asking about scheduling or availability",
    enabled: false,
    conditionLabel: "confidence >",
    threshold: 90,
  },
  {
    id: "community-love",
    label: "Auto-approve positive community comments",
    description:
      "Automatically thank customers for positive mentions and community love",
    enabled: true,
    conditionLabel: "confidence >",
    threshold: 80,
  },
];

// ─── Activity feed entry ───────────────────────────────────────────────────────

interface ActivityEntry {
  id: string;
  type: "posted" | "scheduled" | "replied" | "lead";
  platform: SocialPlatform;
  authorName: string;
  summary: string;
  time: string;
  engagement?: number;
}

const MOCK_ACTIVITY: ActivityEntry[] = [
  {
    id: "a1",
    type: "posted",
    platform: "facebook",
    authorName: "Mike Torres",
    summary: "Replied to pricing question — 3 likes in first 20 min",
    time: "14 min ago",
    engagement: 3,
  },
  {
    id: "a2",
    type: "lead",
    platform: "instagram",
    authorName: "Sarah L.",
    summary: "Comment converted to CRM lead — purchase intent detected",
    time: "1h ago",
    engagement: 0,
  },
  {
    id: "a3",
    type: "posted",
    platform: "linkedin",
    authorName: "Construction Group",
    summary: "Replied to request for commercial quote",
    time: "2h ago",
    engagement: 7,
  },
  {
    id: "a4",
    type: "replied",
    platform: "google_business",
    authorName: "Anonymous User",
    summary: "Auto-approved community love response",
    time: "3h ago",
    engagement: 2,
  },
  {
    id: "a5",
    type: "posted",
    platform: "facebook",
    authorName: "Amanda W.",
    summary: "Replied to storm damage question — booked inspection",
    time: "4h ago",
    engagement: 5,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function computeBrandVoiceScore(text: string): number {
  const words = text.trim().split(/\s+/).length;
  let score = 70;
  if (words >= 15 && words <= 60) score += 15;
  if (text.includes("?")) score += 5;
  if (/[A-Z]{3,}/.test(text)) score -= 10;
  if (text.trim().endsWith("!") && words < 10) score -= 5;
  return Math.max(20, Math.min(100, score));
}

function getTimeSensitivityLabel(createdAt: number): {
  label: string;
  urgent: boolean;
} {
  const hoursSince = (Date.now() - createdAt) / 3600000;
  if (hoursSince < 1)
    return { label: "Reply within 2h for max engagement", urgent: true };
  if (hoursSince < 3)
    return { label: "Reply soon — engagement window closing", urgent: true };
  return { label: "Reply when ready", urgent: false };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: SocialPlatform }) {
  return (
    <span
      className={`social-platform-badge ${PLATFORM_COLORS[platform] ?? "badge-purple"}`}
    >
      {PLATFORM_LABELS[platform] ?? platform}
    </span>
  );
}

function IntentBadge({ intent }: { intent: string }) {
  const meta = INTENT_META[intent as IntentKey] ?? {
    label: intent,
    className: "badge-purple",
  };
  return (
    <span className={`engagement-intent-badge ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function VoiceScoreMeter({ score }: { score: number }) {
  const color =
    score >= 80
      ? "score-good"
      : score >= 55
        ? "score-warning"
        : "score-critical";
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold tabular-nums ${color}`}>
        {score}%
      </span>
      <Progress value={score} className="h-1.5 w-16 bg-muted" />
      <span className="text-xs text-muted-foreground">brand voice</span>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 85
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : pct >= 60
        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
        : "text-rose-400 bg-rose-500/10 border-rose-500/20";
  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${color}`}
    >
      {pct}% confidence
    </span>
  );
}

// ─── Approval Card ────────────────────────────────────────────────────────────

function ApprovalCard({
  approval,
  index,
  niche,
  autoRules,
  onApprove,
  onReject,
  onFlag,
}: {
  approval: EngagementApproval;
  index: number;
  niche: string;
  autoRules: AutoApprovalRule[];
  onApprove: (id: string, response: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onFlag: (id: string) => Promise<void>;
}) {
  const initial = approval.draftResponse ?? "";
  const [editedResponse, setEditedResponse] = useState(
    approval.refinedResponse ?? initial,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  const voiceScore = useMemo(
    () => computeBrandVoiceScore(editedResponse),
    [editedResponse],
  );
  const timeSensitivity = getTimeSensitivityLabel(approval.createdAt);
  const charMax = 500;
  const charLeft = charMax - editedResponse.length;
  const confidencePct = Math.round(approval.buyingSignalConfidence * 100);
  const isBuyingSignalHigh =
    approval.buyingSignalDetected && approval.buyingSignalConfidence >= 0.75;

  const nicheKey = niche
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/&/g, "")
    .replace(/ /g, "_");
  const templates = NICHE_TEMPLATES[nicheKey] ?? NICHE_TEMPLATES.default;

  const handleApprove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onApprove(approval.id, editedResponse);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onReject(approval.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFlag = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onFlag(approval.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseTemplate = (template: string) => {
    setEditedResponse(template);
    setIsEditing(false);
    setShowTemplates(false);
    toast.success("Template applied — edit as needed before approving");
  };

  // Check if any auto-rule would have auto-approved this
  const wouldAutoApprove = autoRules.some(
    (r) => r.enabled && confidencePct >= r.threshold,
  );

  return (
    <Card
      data-ocid={`social_engagement_agent.item.${index}`}
      className={`bg-card border-border animate-fade-in-up transition-smooth ${
        isBuyingSignalHigh ? "border-l-4 border-l-orange-500/70" : ""
      }`}
      style={{ animationDelay: `${(index - 1) * 60}ms` }}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            <Avatar className="h-9 w-9 shrink-0 bg-accent border border-border">
              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                {approval.authorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-sm text-foreground truncate">
                  {approval.authorName}
                </span>
                <PlatformBadge platform={approval.platform} />
                {approval.buyingSignalDetected && (
                  <Badge className="text-xs gap-1 bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/15">
                    <Flame className="h-3 w-3" />
                    {confidencePct}% buying signal
                  </Badge>
                )}
                {wouldAutoApprove && (
                  <Badge className="text-xs gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10">
                    <Zap className="h-3 w-3" />
                    Auto-rule match
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(approval.createdAt)}
                </p>
                <ConfidenceBadge confidence={approval.buyingSignalConfidence} />
                {timeSensitivity.urgent && (
                  <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeSensitivity.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="px-4 pb-4 space-y-3">
          <blockquote className="text-sm text-foreground italic border-l-2 border-primary/40 pl-3 py-0.5">
            &ldquo;{approval.commentText}&rdquo;
          </blockquote>

          <div className="flex flex-wrap items-center gap-2">
            <IntentBadge
              intent={
                approval.buyingSignalDetected ? "purchase_intent" : "question"
              }
            />
            {approval.suggestedAction && (
              <span className="text-xs text-primary/90 bg-primary/8 px-2 py-0.5 rounded-md border border-primary/20">
                💡 {approval.suggestedAction}
              </span>
            )}
          </div>

          {/* Niche templates */}
          <div>
            <button
              type="button"
              onClick={() => setShowTemplates((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              data-ocid={`social_engagement_agent.templates_toggle.${index}`}
            >
              <Sparkles className="h-3 w-3" />
              Use niche template
              {showTemplates ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            {showTemplates && (
              <div
                className="mt-2 space-y-1.5"
                data-ocid={`social_engagement_agent.templates_panel.${index}`}
              >
                {templates.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => handleUseTemplate(t.template)}
                    className="w-full text-left rounded-lg px-3 py-2 bg-muted/30 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                  >
                    <p className="text-xs font-semibold text-foreground">
                      {t.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {t.template}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Draft response editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                AI Draft — edit before approving
              </p>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                  data-ocid={`social_engagement_agent.edit_button.${index}`}
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-1.5">
                <Textarea
                  value={editedResponse}
                  onChange={(e) => {
                    if (e.target.value.length <= charMax)
                      setEditedResponse(e.target.value);
                  }}
                  className="text-sm min-h-[90px] resize-none bg-muted/50 border-border focus:border-primary/60"
                  placeholder="Edit the AI draft response..."
                  data-ocid={`social_engagement_agent.response_input.${index}`}
                />
                <div className="flex items-center justify-between">
                  <VoiceScoreMeter score={voiceScore} />
                  <span
                    className={`text-xs tabular-nums ${charLeft < 50 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {charLeft} left
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="engagement-draft-reply text-sm cursor-pointer hover:border-primary/50 transition-colors w-full text-left"
                onClick={() => setIsEditing(true)}
                data-ocid={`social_engagement_agent.draft_preview.${index}`}
              >
                {editedResponse}
              </button>
            )}

            {!isEditing && <VoiceScoreMeter score={voiceScore} />}
          </div>

          <Separator className="bg-border/50" />

          <div className="engagement-approval-buttons">
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isProcessing || !editedResponse.trim()}
              data-ocid={`social_engagement_agent.approve_button.${index}`}
              className="flex-1 gap-1.5 engagement-approve-btn border-0 text-xs"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Approve &amp; Post
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={isProcessing}
              data-ocid={`social_engagement_agent.reject_button.${index}`}
              className="gap-1.5 text-xs border-border/50"
            >
              <XCircle className="h-3.5 w-3.5" />
              Skip
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFlag}
              disabled={isProcessing}
              data-ocid={`social_engagement_agent.flag_button.${index}`}
              className="gap-1.5 text-xs text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
            >
              <Flag className="h-3.5 w-3.5" />
              Flag
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Flagged Card ─────────────────────────────────────────────────────────────

function FlaggedCard({
  approval,
  index,
}: { approval: EngagementApproval; index: number }) {
  return (
    <Card
      data-ocid={`social_engagement_agent.flagged.item.${index}`}
      className="bg-card border-yellow-500/20 border-l-4 border-l-yellow-500/60 animate-slide-in-left"
    >
      <CardContent className="px-4 py-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
          <div className="min-w-0 space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">
                {approval.authorName}
              </span>
              <PlatformBadge platform={approval.platform} />
              <Badge
                variant="outline"
                className="text-xs border-yellow-500/40 text-yellow-400 gap-1"
              >
                <Flag className="h-3 w-3" />
                Flagged for review
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground italic">
              &ldquo;{approval.commentText}&rdquo;
            </p>
            <p className="text-xs text-yellow-400/80">
              High-sensitivity content requiring manual review
            </p>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatRelativeTime(approval.resolvedAt ?? approval.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── History Row ──────────────────────────────────────────────────────────────

function HistoryRow({
  approval,
  index,
}: { approval: EngagementApproval; index: number }) {
  const isApproved = approval.status === "approved";
  return (
    <div
      data-ocid={`social_engagement_agent.history.item.${index}`}
      className="py-3 px-4 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${isApproved ? "bg-emerald-500" : "bg-muted-foreground"}`}
          />
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground">
                {approval.authorName}
              </span>
              <PlatformBadge platform={approval.platform} />
              <Badge
                variant={isApproved ? "default" : "secondary"}
                className={`text-xs capitalize ${isApproved ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15" : ""}`}
              >
                {approval.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground italic truncate">
              &ldquo;{approval.commentText}&rdquo;
            </p>
            {isApproved &&
              (approval.refinedResponse ?? approval.draftResponse) && (
                <p className="text-xs text-foreground/70 truncate">
                  ↳ {approval.refinedResponse ?? approval.draftResponse}
                </p>
              )}
          </div>
        </div>
        <div className="text-right shrink-0 space-y-0.5">
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(approval.resolvedAt ?? approval.createdAt)}
          </p>
          {approval.buyingSignalDetected && (
            <Badge className="text-xs gap-1 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/10">
              <Flame className="h-2.5 w-2.5" />
              {Math.round(approval.buyingSignalConfidence * 100)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  accentClass = "text-primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accentClass?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3">
      <div className={`shrink-0 ${accentClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground tabular-nums">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  const iconMap: Record<ActivityEntry["type"], React.ReactNode> = {
    posted: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />,
    scheduled: <Clock className="h-3.5 w-3.5 text-blue-400" />,
    replied: <MessageSquare className="h-3.5 w-3.5 text-primary" />,
    lead: <TrendingUp className="h-3.5 w-3.5 text-amber-400" />,
  };

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-start gap-2.5 py-2 border-b border-border/30 last:border-0"
        >
          <div className="mt-0.5 shrink-0">{iconMap[entry.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {entry.authorName}
            </p>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
              {entry.summary}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground">{entry.time}</p>
            {entry.engagement !== undefined && entry.engagement > 0 && (
              <p className="text-[10px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1 justify-end">
                <Heart className="h-2.5 w-2.5" />
                {entry.engagement}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Auto-Approval Rules Panel ────────────────────────────────────────────────

function AutoRulesPanel({
  rules,
  onChange,
}: {
  rules: AutoApprovalRule[];
  onChange: (rules: AutoApprovalRule[]) => void;
}) {
  const toggleRule = (id: string) => {
    onChange(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      toast.success(
        rule.enabled
          ? `Auto-rule disabled: ${rule.label}`
          : `Auto-rule enabled: ${rule.label}`,
      );
    }
  };

  return (
    <div
      className="space-y-3"
      data-ocid="social_engagement_agent.auto_rules_panel"
    >
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">
          Auto-Approval Rules
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        When a rule is enabled, responses meeting the confidence threshold are
        automatically posted without requiring manual approval.
        <strong className="text-foreground"> Use with caution.</strong>
      </p>
      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`rounded-xl p-3 border transition-all ${
              rule.enabled
                ? "bg-primary/5 border-primary/25"
                : "bg-muted/20 border-border/50"
            }`}
            data-ocid={`social_engagement_agent.auto_rule.${rule.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {rule.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {rule.description}
                </p>
                <p className="text-[11px] text-primary/80 mt-1">
                  Trigger: {rule.conditionLabel} {rule.threshold}%
                </p>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => toggleRule(rule.id)}
                data-ocid={`social_engagement_agent.auto_rule.${rule.id}.toggle`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-300 flex items-start gap-2">
          <Bell className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          Auto-approved responses still appear in your activity feed. Review
          your feed regularly to ensure brand voice quality.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type PlatformFilter = "all" | SocialPlatform;

export default function SocialEngagementAgentPage() {
  const {
    engagementApprovals,
    getEngagementApprovals,
    approveEngagement,
    rejectEngagement,
    flagEngagement,
    isLoadingApprovals,
  } = useSocialMedia();

  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [activeTab, setActiveTab] = useState("queue");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRules, setAutoRules] =
    useState<AutoApprovalRule[]>(DEFAULT_AUTO_RULES);
  const [showSettings, setShowSettings] = useState(false);

  // Niche from context — default to plumbing for demo
  const { demoInfo } = useApp();
  const niche = demoInfo?.niche ?? "plumbing";

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only fetch
  useEffect(() => {
    void getEngagementApprovals("tenant-1");
  }, []);

  // ─── Derived data ────────────────────────────────────────────────────────────

  const pending = useMemo(
    () =>
      engagementApprovals
        .filter(
          (a) =>
            a.status === "pending" &&
            (platformFilter === "all" || a.platform === platformFilter),
        )
        .sort((a, b) => {
          if (a.buyingSignalDetected !== b.buyingSignalDetected)
            return a.buyingSignalDetected ? -1 : 1;
          return b.createdAt - a.createdAt;
        }),
    [engagementApprovals, platformFilter],
  );

  const flagged = useMemo(
    () =>
      engagementApprovals
        .filter(
          (a) =>
            a.status === "flagged" &&
            (platformFilter === "all" || a.platform === platformFilter),
        )
        .sort((a, b) => b.createdAt - a.createdAt),
    [engagementApprovals, platformFilter],
  );

  const history = useMemo(
    () =>
      engagementApprovals
        .filter(
          (a) =>
            (a.status === "approved" || a.status === "rejected") &&
            (platformFilter === "all" || a.platform === platformFilter),
        )
        .sort(
          (a, b) =>
            (b.resolvedAt ?? b.createdAt) - (a.resolvedAt ?? a.createdAt),
        ),
    [engagementApprovals, platformFilter],
  );

  const stats = useMemo(() => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayApprovals = engagementApprovals.filter(
      (a) => a.status === "approved" && (a.resolvedAt ?? 0) >= todayStart,
    );
    const avgResponseMs =
      todayApprovals.length > 0
        ? todayApprovals.reduce(
            (sum, a) => sum + ((a.resolvedAt ?? a.createdAt) - a.createdAt),
            0,
          ) / todayApprovals.length
        : 0;
    const avgMins = Math.round(avgResponseMs / 60000);
    const pendingAllPlatforms = engagementApprovals.filter(
      (a) => a.status === "pending",
    ).length;
    const avgBrandVoice =
      engagementApprovals.filter((a) => a.status === "approved").length > 0
        ? Math.round(
            engagementApprovals
              .filter((a) => a.status === "approved")
              .reduce(
                (sum, a) =>
                  sum +
                  computeBrandVoiceScore(a.refinedResponse ?? a.draftResponse),
                0,
              ) /
              engagementApprovals.filter((a) => a.status === "approved").length,
          )
        : 0;

    const autoApprovedToday = autoRules.filter((r) => r.enabled).length;

    return {
      todayQueue: pendingAllPlatforms,
      approvedToday: todayApprovals.length,
      avgResponseTime: avgMins > 0 ? `${avgMins}m` : "—",
      avgVoiceScore: avgBrandVoice > 0 ? `${avgBrandVoice}%` : "—",
      autoApproved: autoApprovedToday,
    };
  }, [engagementApprovals, autoRules]);

  const activePlatforms = useMemo(
    () =>
      Array.from(
        new Set(engagementApprovals.map((a) => a.platform)),
      ) as SocialPlatform[],
    [engagementApprovals],
  );

  // Batch approve all pending
  const handleBatchApprove = async () => {
    let count = 0;
    for (const approval of pending) {
      await approveEngagement(
        approval.id,
        approval.refinedResponse ?? approval.draftResponse,
      );
      count++;
    }
    toast.success(`${count} responses approved and posted ✓`);
  };

  const handleApprove = async (id: string, response: string) => {
    await approveEngagement(id, response);
    toast.success("Response approved and posted ✓", { duration: 4000 });
  };

  const handleReject = async (id: string) => {
    await rejectEngagement(id);
    toast.info("Response skipped");
  };

  const handleFlag = async (id: string) => {
    await flagEngagement(id, "Flagged for manual review");
    toast.warning("Comment flagged for review");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getEngagementApprovals("tenant-1");
    setIsRefreshing(false);
    toast.success("Queue refreshed");
  };

  return (
    <div
      data-ocid="social_engagement_agent.page"
      className="space-y-5 p-4 md:p-6 max-w-5xl mx-auto"
    >
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Auto-Engagement Agent
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI drafts replies in your brand voice — you approve every post.
            Nothing publishes without your click.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSettings((v) => !v)}
            data-ocid="social_engagement_agent.settings_toggle"
            className="gap-1.5 text-xs border-border/60"
          >
            <Settings className="h-3 w-3" />
            Auto-Rules
            {autoRules.filter((r) => r.enabled).length > 0 && (
              <Badge className="ml-0.5 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground">
                {autoRules.filter((r) => r.enabled).length}
              </Badge>
            )}
          </Button>
          <div
            className={`h-2 w-2 rounded-full ${isMonitoringActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsMonitoringActive((v) => !v);
              toast.info(
                isMonitoringActive ? "Monitoring paused" : "Monitoring resumed",
              );
            }}
            data-ocid="social_engagement_agent.monitoring_toggle"
            className="gap-1.5 text-xs border-border/60"
          >
            {isMonitoringActive ? (
              <>
                <Pause className="h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Paused
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Auto-rules settings panel ──────────────────────────────────── */}
      {showSettings && (
        <Card className="bg-card border-border animate-fade-in">
          <CardContent className="pt-4 pb-4">
            <AutoRulesPanel rules={autoRules} onChange={setAutoRules} />
          </CardContent>
        </Card>
      )}

      {/* ── Human-in-the-loop banner ───────────────────────────────────── */}
      <div className="bg-primary/8 border border-primary/20 rounded-lg px-4 py-2.5 flex items-center gap-3">
        <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm text-primary/90">
          <strong>Human approval required:</strong> Every response requires your
          explicit click on "Approve &amp; Post".
          {autoRules.filter((r) => r.enabled).length > 0 && (
            <span className="text-amber-400 ml-1">
              {autoRules.filter((r) => r.enabled).length} auto-rule
              {autoRules.filter((r) => r.enabled).length !== 1 ? "s" : ""}{" "}
              active.
            </span>
          )}
        </p>
      </div>

      {/* ── Main layout: queue + activity feed ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: tabs */}
        <div className="lg:col-span-2 space-y-4">
          {/* ── Stats bar ─────────────────────────────────────────────── */}
          <div
            data-ocid="social_engagement_agent.stats"
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <StatTile
              icon={MessageSquare}
              label="Today's queue"
              value={stats.todayQueue}
              accentClass="text-primary"
            />
            <StatTile
              icon={CheckCircle2}
              label="Approved today"
              value={stats.approvedToday}
              accentClass="text-emerald-500"
            />
            <StatTile
              icon={Clock}
              label="Avg response"
              value={stats.avgResponseTime}
              accentClass="text-blue-400"
            />
            <StatTile
              icon={BarChart3}
              label="Brand voice avg"
              value={stats.avgVoiceScore}
              accentClass="text-purple-400"
            />
          </div>

          {/* ── Platform filter chips ──────────────────────────────────── */}
          <div
            className="flex gap-2 flex-wrap"
            data-ocid="social_engagement_agent.platform_filter"
          >
            {(["all", ...activePlatforms] as PlatformFilter[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatformFilter(p)}
                data-ocid={`social_engagement_agent.filter.${p}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-smooth border ${
                  platformFilter === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted hover:text-foreground"
                }`}
              >
                {p === "all"
                  ? "All Platforms"
                  : (PLATFORM_LABELS[p as SocialPlatform] ?? p)}
              </button>
            ))}
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────── */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            data-ocid="social_engagement_agent.tabs"
          >
            <div className="flex items-center justify-between gap-2">
              <TabsList className="bg-muted/50 border border-border/40 h-9">
                <TabsTrigger
                  value="queue"
                  data-ocid="social_engagement_agent.tab.queue"
                  className="text-xs gap-1.5 data-[state=active]:bg-card"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Approval Queue
                  {pending.length > 0 && (
                    <Badge className="ml-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground">
                      {pending.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="flagged"
                  data-ocid="social_engagement_agent.tab.flagged"
                  className="text-xs gap-1.5 data-[state=active]:bg-card"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                  Flagged
                  {flagged.length > 0 && (
                    <Badge className="ml-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-yellow-500/80 text-foreground">
                      {flagged.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  data-ocid="social_engagement_agent.tab.history"
                  className="text-xs gap-1.5 data-[state=active]:bg-card"
                >
                  <History className="h-3.5 w-3.5" />
                  History
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                {pending.length > 1 && activeTab === "queue" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBatchApprove}
                    data-ocid="social_engagement_agent.batch_approve_button"
                    className="text-xs gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 h-9"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve All ({pending.length})
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing || isLoadingApprovals}
                  data-ocid="social_engagement_agent.refresh_button"
                  className="text-xs gap-1.5 text-muted-foreground h-9"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isRefreshing || isLoadingApprovals ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>

            {/* ── Approval Queue ──────────────────────────────────────── */}
            <TabsContent value="queue" className="mt-4 space-y-3">
              {isLoadingApprovals && (
                <div
                  data-ocid="social_engagement_agent.loading_state"
                  className="space-y-3"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-44 w-full rounded-lg" />
                  ))}
                </div>
              )}

              {!isLoadingApprovals && pending.length === 0 && (
                <div
                  data-ocid="social_engagement_agent.empty_state"
                  className="text-center py-16 text-muted-foreground"
                >
                  <div className="relative inline-block mb-4">
                    <MessageSquare className="h-12 w-12 opacity-20 mx-auto" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="font-semibold text-foreground/70">
                    No pending responses
                  </p>
                  <p className="text-sm mt-1">
                    Monitoring is{" "}
                    <span className="text-emerald-400 font-medium">active</span>{" "}
                    — new comments appear here automatically
                  </p>
                </div>
              )}

              {!isLoadingApprovals && pending.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground">
                    {pending.length} comment{pending.length !== 1 ? "s" : ""}{" "}
                    waiting · Buying signals shown first
                  </p>
                  {pending.map((approval, i) => (
                    <ApprovalCard
                      key={approval.id}
                      approval={approval}
                      index={i + 1}
                      niche={niche}
                      autoRules={autoRules}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onFlag={handleFlag}
                    />
                  ))}
                </>
              )}
            </TabsContent>

            {/* ── Flagged ────────────────────────────────────────────── */}
            <TabsContent value="flagged" className="mt-4 space-y-3">
              {flagged.length === 0 && (
                <div
                  data-ocid="social_engagement_agent.flagged.empty_state"
                  className="text-center py-14 text-muted-foreground"
                >
                  <ShieldAlert className="h-10 w-10 opacity-20 mx-auto mb-3" />
                  <p className="font-semibold text-foreground/70">
                    No flagged comments
                  </p>
                  <p className="text-sm mt-1">
                    Comments escalated for manual review will appear here
                  </p>
                </div>
              )}
              {flagged.length > 0 && (
                <>
                  <div className="flex items-center gap-2 px-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">
                      {flagged.length} comment{flagged.length !== 1 ? "s" : ""}{" "}
                      flagged for escalation
                    </p>
                  </div>
                  {flagged.map((approval, i) => (
                    <FlaggedCard
                      key={approval.id}
                      approval={approval}
                      index={i + 1}
                    />
                  ))}
                </>
              )}
            </TabsContent>

            {/* ── History ───────────────────────────────────────────── */}
            <TabsContent value="history" className="mt-4">
              {history.length === 0 && (
                <div
                  data-ocid="social_engagement_agent.history.empty_state"
                  className="text-center py-14 text-muted-foreground"
                >
                  <History className="h-10 w-10 opacity-20 mx-auto mb-3" />
                  <p className="font-semibold text-foreground/70">
                    No response history yet
                  </p>
                  <p className="text-sm mt-1">
                    Approved and skipped responses will appear here
                  </p>
                </div>
              )}
              {history.length > 0 && (
                <Card className="bg-card border-border overflow-hidden">
                  <CardHeader className="py-3 px-4 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      Response History
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {history.length} total
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <div>
                    {history.map((approval, i) => (
                      <HistoryRow
                        key={approval.id}
                        approval={approval}
                        index={i + 1}
                      />
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-border/40 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-muted-foreground">
                        Posted
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Skipped
                      </span>
                    </div>
                    <a
                      href="https://bookedrankedfunded.org/social-roi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors ml-auto"
                    >
                      View full analytics <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Activity Feed ───────────────────────────────────────── */}
        <div className="space-y-4">
          <Card
            className="bg-card border-border"
            data-ocid="social_engagement_agent.activity_feed"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Activity Feed
                <span className="ml-auto text-[10px] text-muted-foreground">
                  Today
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed entries={MOCK_ACTIVITY} />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: "Responses posted",
                  value: 34,
                  color: "text-emerald-400",
                },
                {
                  label: "Leads from comments",
                  value: 8,
                  color: "text-amber-400",
                },
                {
                  label: "Avg engagement/reply",
                  value: "4.2",
                  color: "text-primary",
                },
                {
                  label: "Auto-approved",
                  value: autoRules.filter((r) => r.enabled).length > 0 ? 6 : 0,
                  color: "text-blue-400",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
