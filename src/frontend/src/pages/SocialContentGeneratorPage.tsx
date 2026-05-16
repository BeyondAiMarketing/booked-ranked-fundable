/**
 * SocialContentGeneratorPage — AI-powered platform-native content generation.
 *
 * RDT architectural principles:
 * - Adaptive routing: simple UI state resolves immediately; generation goes
 *   through multi-step Perplexity → Claude pipeline with iterative refinement.
 * - Modular expert design: PostCard, BulkActionsBar, ProgressStepper are
 *   isolated components — no shared state bleed.
 * - Context awareness: adapts behavior based on brand voice presence; shows
 *   setup prompt when brand voice DNA is missing.
 * - Progressive enhancement: works without API keys (fallback templates),
 *   better with Perplexity + Claude/OpenAI wired in.
 */

import {
  BarChart2,
  Calendar,
  Check,
  ChevronRight,
  Edit3,
  Flame,
  Info,
  Lightbulb,
  Link,
  RefreshCw,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useCredentials } from "../context/CredentialsContext";
import { useSocialMedia } from "../hooks/useSocialMedia";
import {
  generateNicheContent,
  iterativeRefine,
} from "../services/socialContentService";
import type {
  ContentCadence,
  FunnelStage,
  GeneratedContentBatch,
  GeneratedPostVariant,
  NicheType,
  SocialPlatform,
} from "../types/socialMedia";

// ─── Platform optimal posting times ──────────────────────────────────────────

const PLATFORM_OPTIMAL_HOURS: Record<SocialPlatform, number[]> = {
  facebook: [9, 13, 15],
  instagram: [11, 14, 17],
  linkedin: [8, 12, 17],
  google_business: [10, 14],
  tiktok: [7, 19, 21],
};

function getSuggestedPostTime(
  platform: SocialPlatform,
  offsetDays: number,
): number {
  const hours = PLATFORM_OPTIMAL_HOURS[platform];
  const hour = hours[offsetDays % hours.length];
  const d = new Date();
  d.setDate(d.getDate() + offsetDays + 1);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
}

// ─── Static data ──────────────────────────────────────────────────────────────

const NICHES: { value: NicheType; label: string; emoji: string }[] = [
  { value: "plumbing", label: "Plumbing", emoji: "🔧" },
  { value: "hvac", label: "HVAC", emoji: "❄️" },
  { value: "restoration", label: "Restoration", emoji: "🏚️" },
  { value: "carpet_cleaning", label: "Carpet Cleaning", emoji: "🧹" },
  { value: "roofing", label: "Roofing", emoji: "🏠" },
  { value: "med_spa", label: "Med Spa", emoji: "💆" },
  { value: "real_estate", label: "Real Estate", emoji: "🏡" },
  { value: "mortgage", label: "Mortgage", emoji: "🏦" },
  { value: "chiropractor", label: "Chiropractor", emoji: "🦴" },
  { value: "dental", label: "Dental", emoji: "🦷" },
];

const PLATFORMS: {
  value: SocialPlatform;
  label: string;
  colorClass: string;
  hoverBorder: string;
}[] = [
  {
    value: "facebook",
    label: "Facebook",
    colorClass: "platform-facebook",
    hoverBorder: "hover:border-blue-500/50",
  },
  {
    value: "instagram",
    label: "Instagram",
    colorClass: "platform-instagram",
    hoverBorder: "hover:border-pink-500/50",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    colorClass: "badge-blue",
    hoverBorder: "hover:border-blue-400/50",
  },
  {
    value: "tiktok",
    label: "TikTok",
    colorClass: "badge-rose",
    hoverBorder: "hover:border-rose-500/50",
  },
  {
    value: "google_business",
    label: "Google Business",
    colorClass: "platform-google",
    hoverBorder: "hover:border-orange-500/50",
  },
];

const FUNNEL_STAGE_META: Record<
  FunnelStage,
  { label: string; colorClass: string; desc: string }
> = {
  tofu: {
    label: "TOFU",
    colorClass: "badge-blue",
    desc: "Top of Funnel — Awareness",
  },
  mofu: {
    label: "MOFU",
    colorClass: "badge-amber",
    desc: "Middle of Funnel — Consideration",
  },
  bofu: {
    label: "BOFU",
    colorClass: "badge-emerald",
    desc: "Bottom of Funnel — Decision",
  },
};

// ─── Generation steps ─────────────────────────────────────────────────────────

type GenerationStep = 0 | 1 | 2 | 3 | 4;

const GENERATION_STEPS = [
  { label: "Fetching trending topics", icon: TrendingUp },
  { label: "Researching niche intel", icon: Zap },
  { label: "Generating platform-native drafts", icon: Edit3 },
  { label: "Refining quality", icon: Sparkles },
  { label: "Complete", icon: Check },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressStepper({ step }: { step: GenerationStep }) {
  return (
    <div
      data-ocid="social_content_generator.loading_state"
      className="content-generator-panel space-y-3"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
        Generating your content…
      </p>
      {GENERATION_STEPS.slice(0, 4).map((s, i) => {
        const Icon = s.icon;
        const isDone = i < step;
        const isActive = i === step;
        return (
          <div
            key={s.label}
            className={`flex items-center gap-3 text-sm transition-smooth ${
              isDone
                ? "text-foreground"
                : isActive
                  ? "text-primary"
                  : "text-muted-foreground/40"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-smooth ${
                isDone
                  ? "border-emerald-500/50 bg-emerald-500/15"
                  : isActive
                    ? "border-primary/50 bg-primary/15 animate-pulse-glow"
                    : "border-border bg-transparent"
              }`}
            >
              {isDone ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground/30"}`}
                />
              )}
            </div>
            <span className={isActive ? "font-medium" : ""}>{s.label}</span>
            {isActive && (
              <RefreshCw className="h-3 w-3 animate-spin text-primary ml-auto" />
            )}
          </div>
        );
      })}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="pb-2 pt-3 px-3">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface PostCardProps {
  post: GeneratedPostVariant;
  index: number;
  isSelected: boolean;
  isApproved: boolean;
  isDiscarded: boolean;
  onToggleSelect: () => void;
  onEdit: () => void;
  onApprove: () => void;
  onDiscard: () => void;
}

function PostCard({
  post,
  index,
  isSelected,
  isApproved,
  isDiscarded,
  onToggleSelect,
  onEdit,
  onApprove,
  onDiscard,
}: PostCardProps) {
  const platformMeta = PLATFORMS.find((p) => p.value === post.platform);
  const funnelStage: FunnelStage =
    post.qualityScore >= 85
      ? "bofu"
      : post.qualityScore >= 70
        ? "mofu"
        : "tofu";
  const funnelMeta = FUNNEL_STAGE_META[funnelStage];

  const scoreColor =
    post.qualityScore >= 85
      ? "text-emerald-400"
      : post.qualityScore >= 70
        ? "text-amber-400"
        : "text-rose-400";

  if (isDiscarded) {
    return (
      <div
        data-ocid={`content_generator.post.${index + 1}`}
        className="social-post-card rounded-lg p-3 flex items-center justify-between opacity-40"
      >
        <span className="text-sm text-muted-foreground line-through">
          Post discarded
        </span>
        <button
          type="button"
          onClick={onDiscard}
          className="text-xs text-primary hover:underline"
          data-ocid={`content_generator.restore_button.${index + 1}`}
        >
          Restore
        </button>
      </div>
    );
  }

  return (
    <div
      data-ocid={`content_generator.post.${index + 1}`}
      className={`social-post-card rounded-lg transition-smooth ${
        isApproved ? "social-post-published" : "social-post-draft"
      } ${isSelected ? "ring-2 ring-primary/60" : ""}`}
    >
      {/* Card header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <button
          type="button"
          onClick={onToggleSelect}
          data-ocid={`content_generator.select_checkbox.${index + 1}`}
          aria-label={isSelected ? "Deselect post" : "Select post"}
          className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-smooth ${
            isSelected
              ? "bg-primary border-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`social-platform-badge ${platformMeta?.colorClass ?? ""}`}
            >
              {post.platform.replace("_", " ")}
            </span>
            <span
              className={`social-platform-badge ${funnelMeta.colorClass}`}
              title={funnelMeta.desc}
            >
              {funnelMeta.label}
            </span>
            {isApproved && (
              <span className="social-platform-badge badge-emerald">
                ✓ Approved
              </span>
            )}
          </div>
        </div>

        <div className={`text-sm font-bold tabular-nums ${scoreColor}`}>
          {post.qualityScore}
          <span className="text-xs font-normal text-muted-foreground">
            /100
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap line-clamp-5">
          {post.content}
        </p>
        {post.hashtags.length > 0 && (
          <p className="text-xs text-primary/70 mt-2 leading-relaxed">
            {post.hashtags.join(" ")}
          </p>
        )}
        {post.ctaText && (
          <p className="text-xs text-muted-foreground italic mt-1.5">
            {post.ctaText}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="draft-action-buttons px-4 pb-4">
        <button
          type="button"
          onClick={onEdit}
          data-ocid={`content_generator.edit_button.${index + 1}`}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-smooth"
        >
          <Edit3 className="h-3 w-3" />
          Edit
        </button>
        <button
          type="button"
          onClick={onApprove}
          data-ocid={`content_generator.approve_button.${index + 1}`}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-smooth ${
            isApproved
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "draft-approve-btn"
          }`}
        >
          {isApproved ? (
            <>
              <Check className="h-3 w-3" /> Scheduled
            </>
          ) : (
            <>
              <Calendar className="h-3 w-3" /> Approve & Schedule
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onDiscard}
          data-ocid={`content_generator.discard_button.${index + 1}`}
          className="flex items-center justify-center px-3 py-2 rounded-md text-xs font-semibold draft-discard-btn"
          aria-label="Discard post"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

interface BulkActionsBarProps {
  selectedCount: number;
  onApproveAll: () => void;
  onScheduleAll: () => void;
  onDiscardSelected: () => void;
  onClearSelection: () => void;
}

function BulkActionsBar({
  selectedCount,
  onApproveAll,
  onScheduleAll,
  onDiscardSelected,
  onClearSelection,
}: BulkActionsBarProps) {
  return (
    <div
      data-ocid="content_generator.bulk_actions_bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-primary/30 shadow-2xl glow-purple-sm">
        <span className="text-sm font-medium text-foreground">
          <span className="text-primary font-bold">{selectedCount}</span>{" "}
          selected
        </span>
        <div className="h-4 w-px bg-border" />
        <Button
          size="sm"
          variant="ghost"
          onClick={onApproveAll}
          data-ocid="content_generator.bulk_approve_button"
          className="text-xs gap-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        >
          <Check className="h-3.5 w-3.5" />
          Approve All
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onScheduleAll}
          data-ocid="content_generator.bulk_schedule_button"
          className="text-xs gap-1.5 text-primary hover:text-primary/80 hover:bg-primary/10"
        >
          <Calendar className="h-3.5 w-3.5" />
          Schedule All
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDiscardSelected}
          data-ocid="content_generator.bulk_discard_button"
          className="text-xs gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Discard
        </Button>
        <button
          type="button"
          onClick={onClearSelection}
          data-ocid="content_generator.bulk_clear_button"
          aria-label="Clear selection"
          className="ml-1 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SocialContentGeneratorPage() {
  const { creds } = useCredentials();
  const { getBrandVoiceProfile, createScheduledPost } = useSocialMedia();

  // Controls
  const [niche, setNiche] = useState<NicheType>("plumbing");
  const [cadence, setCadence] = useState<ContentCadence>(7);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    "facebook",
    "instagram",
  ]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<GenerationStep>(0);
  const [batch, setBatch] = useState<GeneratedContentBatch | null>(null);

  // Post interaction state
  const [selectedPostIndices, setSelectedPostIndices] = useState<Set<number>>(
    new Set(),
  );
  const [approvedIndices, setApprovedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [discardedIndices, setDiscardedIndices] = useState<Set<number>>(
    new Set(),
  );

  // Edit modal
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const brandVoice = getBrandVoiceProfile("tenant-1");
  const hasBrandVoice = !!brandVoice;

  const defaultBrandVoice = brandVoice ?? {
    tenantId: "tenant-1",
    tone: "professional" as const,
    vocabulary: [],
    sentenceStyle: "short_punchy" as const,
    emojiUsage: "moderate" as const,
    formality: "medium" as const,
    nicheTerminology: [],
    calibrationPosts: [],
    lastCalibrated: Date.now(),
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  // Simulate step-by-step progress
  const runWithProgress =
    useCallback(async (): Promise<GeneratedContentBatch> => {
      setGenerationStep(0);
      await new Promise((r) => setTimeout(r, 700));
      setGenerationStep(1);
      await new Promise((r) => setTimeout(r, 700));
      setGenerationStep(2);

      const result = await generateNicheContent({
        niche,
        platforms: selectedPlatforms,
        cadence,
        brandVoiceProfile: defaultBrandVoice,
        perplexityKey: creds?.perplexityApiKey,
        openAiKey: creds?.openaiKey,
        claudeKey: creds?.claudeKey,
        litellmUrl: creds?.litellmUrl,
        searxngUrl: creds?.searxngUrl,
      });

      setGenerationStep(3);
      await new Promise((r) => setTimeout(r, 500));
      setGenerationStep(4);
      return result;
    }, [niche, selectedPlatforms, cadence, defaultBrandVoice, creds]);

  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    setIsGenerating(true);
    setSelectedPostIndices(new Set());
    setApprovedIndices(new Set());
    setDiscardedIndices(new Set());
    setBatch(null);

    try {
      const result = await runWithProgress();
      setBatch(result);
      toast.success(`Generated ${result.posts.length} posts ready to review`);
    } catch {
      toast.error("Generation failed — check your API keys in Go Live");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = useCallback(
    async (index: number) => {
      if (!batch) return;
      const post = batch.posts[index];
      const scheduledAt = getSuggestedPostTime(
        post.platform,
        approvedIndices.size,
      );

      try {
        await createScheduledPost({
          tenantId: "tenant-1",
          content: post.content,
          platforms: [post.platform],
          scheduledAt,
          status: "scheduled",
          niche,
          funnelStage:
            post.qualityScore >= 85
              ? "bofu"
              : post.qualityScore >= 70
                ? "mofu"
                : "tofu",
          marketingFramework: "hormozi_value_stack",
          ctaType: "booking",
          ctaUrl: "https://bookedrankedfunded.org/setup",
          contentCadence: cadence,
          platformVariants: {},
          beforeAfterPhoto: null,
          tags: [niche],
        });
        setApprovedIndices((prev) => new Set(prev).add(index));
        toast.success(
          `Scheduled for ${new Date(scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric" })}`,
        );
      } catch {
        toast.error("Failed to schedule post");
      }
    },
    [batch, niche, cadence, createScheduledPost, approvedIndices.size],
  );

  const handleDiscard = useCallback((index: number) => {
    setDiscardedIndices((prev) => {
      const next = new Set(prev);
      // toggle restore
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setSelectedPostIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);

  const handleToggleSelect = useCallback((index: number) => {
    setSelectedPostIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const handleOpenEdit = (index: number) => {
    if (!batch) return;
    setEditingIndex(index);
    setEditContent(batch.posts[index].content);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !batch) return;
    const post = batch.posts[editingIndex];
    const apiKey = creds?.claudeKey ?? creds?.openaiKey ?? "";
    const { content: refined, qualityScore } = await iterativeRefine(
      editContent,
      defaultBrandVoice,
      post.platform,
      apiKey,
      creds?.litellmUrl,
    );
    const updatedPosts = [...batch.posts];
    updatedPosts[editingIndex] = { ...post, content: refined, qualityScore };
    setBatch({ ...batch, posts: updatedPosts });
    setEditingIndex(null);
    toast.success("Post updated and re-scored");
  };

  // Bulk actions — only on visible (non-discarded) posts
  const activePosts =
    batch?.posts.filter((_, i) => !discardedIndices.has(i)) ?? [];
  const activeIndices = batch
    ? batch.posts.map((_, i) => i).filter((i) => !discardedIndices.has(i))
    : [];

  const handleBulkApprove = async () => {
    for (const i of selectedPostIndices) {
      if (!approvedIndices.has(i) && !discardedIndices.has(i)) {
        await handleApprove(i);
      }
    }
    setSelectedPostIndices(new Set());
  };

  const handleBulkSchedule = async () => {
    await handleBulkApprove();
  };

  const handleBulkDiscard = () => {
    const next = new Set(discardedIndices);
    for (const i of selectedPostIndices) next.add(i);
    setDiscardedIndices(next);
    setSelectedPostIndices(new Set());
    toast.success(`Discarded ${selectedPostIndices.size} posts`);
  };

  const selectedCount = selectedPostIndices.size;
  const approvedCount = approvedIndices.size;

  // ─── Performance mock data ─────────────────────────────────────────────────

  const PERFORMANCE_DATA = {
    niche,
    benchmarkLabel:
      niche === "plumbing" ? "plumbing businesses" : `${niche} businesses`,
    performancePct: 34,
    topContentType: "before/after",
    topContentPct: 312,
    tipContentPct: 89,
    insight:
      niche === "plumbing"
        ? "Your before/after posts get 3.5x more engagement than tip posts. Generate more before/afters for maximum reach."
        : niche === "hvac"
          ? "Seasonal urgency posts (heat wave, cold snap) get 2.8x more engagement than general HVAC tips. Lead with urgency."
          : niche === "med_spa"
            ? "Transformation result posts (before/after, testimonials) get 4.1x more engagement than general beauty tips. Show results first."
            : "Review highlight posts perform 2.6x above average for your niche. Keep amplifying 5-star reviews.",
  };

  const PUBLISHED_POSTS_MOCK = [
    {
      id: "pp1",
      content: "AC down during a heat wave? We have emergency slots TODAY.",
      platform: "facebook",
      reach: 1240,
      likes: 87,
      comments: 34,
      shares: 12,
      leads: 3,
      type: "Urgent / Seasonal",
    },
    {
      id: "pp2",
      content:
        "Before: corroded pipes leaking inside the wall. After: brand new copper line, zero leaks.",
      platform: "instagram",
      reach: 2810,
      likes: 312,
      comments: 67,
      shares: 45,
      leads: 8,
      type: "Before/After",
    },
    {
      id: "pp3",
      content:
        "Jennifer M. called us with a burst pipe at 8 PM. Our team arrived in 90 minutes.",
      platform: "facebook",
      reach: 890,
      likes: 64,
      comments: 21,
      shares: 8,
      leads: 2,
      type: "Review Highlight",
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      data-ocid="social_content_generator.page"
      className="min-h-screen bg-background"
    >
      {/* Page header */}
      <div className="header-dark sticky top-0 z-30 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold gradient-text-purple font-display truncate">
              AI Content Generator
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
              AI research + Claude/OpenAI → platform-native posts, auto-refined
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {approvedCount > 0 && (
              <Badge className="badge-emerald gap-1.5 text-xs">
                <Check className="h-3 w-3" />
                {approvedCount} scheduled
              </Badge>
            )}
            <Badge className="badge-purple gap-1.5 text-xs">
              <Sparkles className="h-3 w-3" />
              RDT
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">
        {/* Page-level tabs: Generator | Performance Intelligence */}
        <Tabs
          defaultValue="generator"
          data-ocid="social_content_generator.page_tabs"
        >
          <TabsList className="bg-muted/50 border border-border/40">
            <TabsTrigger
              value="generator"
              data-ocid="social_content_generator.generator_tab"
              className="text-xs gap-1.5 data-[state=active]:bg-card"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              data-ocid="social_content_generator.performance_tab"
              className="text-xs gap-1.5 data-[state=active]:bg-card"
            >
              <BarChart2 className="h-3.5 w-3.5" />
              Performance Intelligence
            </TabsTrigger>
          </TabsList>

          {/* ── Generator tab ────────────────────────────────────────── */}
          <TabsContent value="generator" className="mt-4">
            {/* Brand voice notice */}
            {!hasBrandVoice && (
              <div
                data-ocid="social_content_generator.empty_state"
                className="trending-topic-card flex items-start gap-3"
              >
                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Brand Voice DNA not calibrated yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Content will use defaults. For best results, set up your
                    Brand Voice DNA first.
                  </p>
                </div>
                <a
                  href="/social-media"
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth flex-shrink-0"
                  data-ocid="social_content_generator.brand_voice_link"
                >
                  Set up <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Generation controls */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  Generation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Niche + cadence row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Niche
                    </p>
                    <Select
                      value={niche}
                      onValueChange={(v) => setNiche(v as NicheType)}
                    >
                      <SelectTrigger
                        data-ocid="social_content_generator.niche_select"
                        className="bg-muted/50"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NICHES.map((n) => (
                          <SelectItem key={n.value} value={n.value}>
                            <span className="mr-2">{n.emoji}</span>
                            {n.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Posts per week
                    </p>
                    <Select
                      value={String(cadence)}
                      onValueChange={(v) =>
                        setCadence(Number(v) as ContentCadence)
                      }
                    >
                      <SelectTrigger
                        data-ocid="social_content_generator.cadence_select"
                        className="bg-muted/50"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 posts/week — light</SelectItem>
                        <SelectItem value="7">
                          7 posts/week — standard
                        </SelectItem>
                        <SelectItem value="14">
                          14 posts/week — aggressive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Platform multi-select */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Platforms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const active = selectedPlatforms.includes(p.value);
                      return (
                        <button
                          type="button"
                          key={p.value}
                          onClick={() => togglePlatform(p.value)}
                          data-ocid={`social_content_generator.platform_toggle.${p.value}`}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth min-h-[36px] ${
                            active
                              ? "bg-primary text-primary-foreground border-primary glow-purple-sm"
                              : `bg-muted/40 text-muted-foreground border-border ${p.hoverBorder}`
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate button */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || selectedPlatforms.length === 0}
                    className="gap-2 font-semibold"
                    data-ocid="social_content_generator.generate_button"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{" "}
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Generate Week of
                        Content
                      </>
                    )}
                  </Button>
                  {batch && !isGenerating && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerate}
                      data-ocid="social_content_generator.regenerate_button"
                      className="gap-1.5 text-muted-foreground"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress animation */}
            {isGenerating && <ProgressStepper step={generationStep} />}

            {/* Results */}
            {batch && !isGenerating && (
              <div className="space-y-5 animate-fade-in">
                {/* Results header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-semibold text-foreground">
                      {activePosts.length} posts generated
                    </h2>
                    {batch.trendInsights.length > 0 && (
                      <Badge className="badge-blue gap-1 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        {batch.trendInsights.length} trend insights
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {activeIndices.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const allSelected = activeIndices.every((i) =>
                            selectedPostIndices.has(i),
                          );
                          if (allSelected) {
                            setSelectedPostIndices(new Set());
                          } else {
                            setSelectedPostIndices(new Set(activeIndices));
                          }
                        }}
                        data-ocid="social_content_generator.select_all_toggle"
                        className="text-xs text-primary hover:text-primary/80 transition-smooth"
                      >
                        {activeIndices.every((i) => selectedPostIndices.has(i))
                          ? "Deselect all"
                          : "Select all"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Trend insights panel */}
                {batch.trendInsights.length > 0 && (
                  <div className="content-generator-panel space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                      AI research insights used
                    </p>
                    {batch.trendInsights.slice(0, 3).map((insight) => (
                      <div
                        key={insight.slice(0, 50)}
                        className="trending-topic-card flex gap-2 items-start"
                      >
                        <span className="text-primary mt-0.5 flex-shrink-0">
                          →
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {insight}
                        </p>
                      </div>
                    ))}
                    {batch.citationUrls.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <Link className="h-3 w-3 text-muted-foreground/50" />
                        <span className="text-xs text-muted-foreground/50">
                          {batch.citationUrls.length} source
                          {batch.citationUrls.length !== 1 ? "s" : ""} cited
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Post grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {batch.posts.map((post, i) => (
                    <PostCard
                      key={`${post.platform}-${i}`}
                      post={post}
                      index={i}
                      isSelected={selectedPostIndices.has(i)}
                      isApproved={approvedIndices.has(i)}
                      isDiscarded={discardedIndices.has(i)}
                      onToggleSelect={() => handleToggleSelect(i)}
                      onEdit={() => handleOpenEdit(i)}
                      onApprove={() => handleApprove(i)}
                      onDiscard={() => handleDiscard(i)}
                    />
                  ))}
                </div>

                {/* Bottom CTA row */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="outline"
                    asChild
                    data-ocid="social_content_generator.go_to_scheduler_button"
                    className="gap-2"
                  >
                    <a href="/social-scheduler">
                      <Calendar className="h-4 w-4" />
                      View Schedule
                    </a>
                  </Button>
                  {approvedCount > 0 && (
                    <p className="text-sm text-muted-foreground self-center">
                      <span className="text-emerald-400 font-semibold">
                        {approvedCount}
                      </span>{" "}
                      post{approvedCount !== 1 ? "s" : ""} queued for publishing
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!batch && !isGenerating && (
              <div
                data-ocid="social_content_generator.initial_empty_state"
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center glow-purple-sm">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to generate a week of content
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Select your niche, platforms, and cadence above — then hit
                  Generate. AI will research live trends and write
                  platform-native posts in seconds.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ── Performance Intelligence tab ─────────────────────────── */}
          <TabsContent value="performance" className="mt-4 space-y-5">
            {/* Niche benchmark */}
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: "oklch(0.58 0.22 290 / 8%)",
                border: "1px solid oklch(0.58 0.22 290 / 20%)",
              }}
              data-ocid="social_content_generator.benchmark_panel"
            >
              <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Your posts perform{" "}
                  <span className="text-emerald-400">
                    +{PERFORMANCE_DATA.performancePct}%
                  </span>{" "}
                  above average for {PERFORMANCE_DATA.benchmarkLabel}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {PERFORMANCE_DATA.insight}
                </p>
              </div>
            </div>

            {/* Content type performance */}
            <Card
              className="bg-card border-border"
              data-ocid="social_content_generator.content_type_perf"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Content Type Performance
                  <Badge className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20">
                    {niche}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    type: "Before/After",
                    engagement: PERFORMANCE_DATA.topContentPct,
                    color: "bg-emerald-500/70",
                    badge: "🔥 Top performer",
                  },
                  {
                    type: "Review Highlight",
                    engagement: 198,
                    color: "bg-primary/70",
                    badge: "",
                  },
                  {
                    type: "Urgent / Seasonal",
                    engagement: 156,
                    color: "bg-amber-500/70",
                    badge: "",
                  },
                  {
                    type: "Educational Tip",
                    engagement: PERFORMANCE_DATA.tipContentPct,
                    color: "bg-muted/60",
                    badge: "",
                  },
                  {
                    type: "Behind the Scenes",
                    engagement: 72,
                    color: "bg-muted/40",
                    badge: "",
                  },
                ].map(({ type, engagement, color, badge }) => (
                  <div
                    key={type}
                    data-ocid={`social_content_generator.content_type.${type.toLowerCase().replace(/[\s/]+/g, "_")}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-foreground">{type}</span>
                        {badge && (
                          <span className="text-[10px] text-amber-400">
                            {badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {engagement} avg eng.
                      </span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{
                          width: `${Math.round((engagement / 350) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Published post tracking */}
            <Card
              className="bg-card border-border"
              data-ocid="social_content_generator.published_tracking"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Published Post Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {PUBLISHED_POSTS_MOCK.map((post, i) => (
                  <div
                    key={post.id}
                    data-ocid={`social_content_generator.published_post.${i + 1}`}
                    className="rounded-xl bg-muted/20 border border-border p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-foreground line-clamp-2 flex-1">
                        {post.content}
                      </p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] shrink-0"
                      >
                        {post.type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: "Reach", value: post.reach.toLocaleString() },
                        { label: "Likes", value: post.likes },
                        { label: "Comments", value: post.comments },
                        { label: "Shares", value: post.shares },
                        {
                          label: "Leads",
                          value: post.leads,
                          highlight: post.leads > 0,
                        },
                      ].map(({ label, value, highlight }) => (
                        <div key={label} className="text-center">
                          <p
                            className={`text-sm font-bold ${highlight ? "text-amber-400" : "text-foreground"}`}
                          >
                            {value}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI content suggestions */}
            <Card
              className="bg-card border-border"
              data-ocid="social_content_generator.ai_suggestions"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  AI Content Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    title: "Generate more before/afters",
                    body: `Your before/after posts get ${Math.round(PERFORMANCE_DATA.topContentPct / PERFORMANCE_DATA.tipContentPct)}x more engagement than tips. Create 3 this week.`,
                    hot: true,
                  },
                  {
                    title: "Add a review highlight this week",
                    body: "You haven't posted a review highlight in 6 days. These consistently drive leads for your niche.",
                    hot: false,
                  },
                  {
                    title: "Seasonal urgency post",
                    body: "Urgency-framed posts (limited slots, end of season) get 2.8x more engagement for service businesses.",
                    hot: false,
                  },
                ].map(({ title, body, hot }) => (
                  <div
                    key={title}
                    className={`rounded-xl p-3 border flex items-start gap-3 ${hot ? "bg-amber-500/5 border-amber-500/20" : "bg-muted/20 border-border"}`}
                    data-ocid={`social_content_generator.suggestion.${title.toLowerCase().replace(/\s+/g, "_").slice(0, 30)}`}
                  >
                    {hot ? (
                      <Flame className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">
                        {title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        {body}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs shrink-0 border-primary/30 text-primary hover:bg-primary/10"
                      data-ocid={`social_content_generator.suggestion_action.${title.toLowerCase().replace(/\s+/g, "_").slice(0, 20)}`}
                      onClick={() =>
                        toast.info(
                          "Switching to generator with this template pre-filled",
                        )
                      }
                    >
                      Generate
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {selectedCount > 0 && (
        <BulkActionsBar
          selectedCount={selectedCount}
          onApproveAll={handleBulkApprove}
          onScheduleAll={handleBulkSchedule}
          onDiscardSelected={handleBulkDiscard}
          onClearSelection={() => setSelectedPostIndices(new Set())}
        />
      )}

      {/* Edit modal */}
      <Dialog
        open={editingIndex !== null}
        onOpenChange={(open) => !open && setEditingIndex(null)}
      >
        <DialogContent
          data-ocid="content_generator.edit_dialog"
          className="bg-card border-border max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={7}
              className="bg-muted/50 border-border text-foreground resize-none focus:border-primary"
              data-ocid="content_generator.edit_textarea"
              placeholder="Edit your post content…"
            />
            <p className="text-xs text-muted-foreground">
              Saving will re-score your post with AI quality analysis.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setEditingIndex(null)}
              data-ocid="content_generator.edit_cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              data-ocid="content_generator.edit_save_button"
              className="gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Save & Re-score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
