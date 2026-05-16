import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Filter,
  Loader2,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Textarea } from "../components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { useSocialMedia } from "../hooks/useSocialMedia";
import type {
  CtaType,
  FunnelStage,
  MarketingFramework,
  NicheType,
  PostStatus,
  ScheduledPost,
  SocialPlatform,
} from "../types/socialMedia";

// ─── Constants ─────────────────────────────────────────────────────────────────

const PLATFORMS: SocialPlatform[] = [
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "google_business",
];

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  google_business: "Google",
};

const PLATFORM_CHAR_LIMITS: Record<SocialPlatform, number> = {
  facebook: 63000,
  instagram: 2200,
  linkedin: 3000,
  tiktok: 2200,
  google_business: 1500,
};

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  facebook: "oklch(0.6 0.18 240)",
  instagram: "oklch(0.72 0.18 20)",
  linkedin: "oklch(0.55 0.18 240)",
  tiktok: "oklch(0.96 0.008 280)",
  google_business: "oklch(0.65 0.2 25)",
};

const PLATFORM_BG: Record<SocialPlatform, string> = {
  facebook: "bg-[oklch(0.6_0.18_240/15%)] text-[oklch(0.76_0.14_240)]",
  instagram: "bg-[oklch(0.72_0.18_20/15%)] text-[oklch(0.82_0.14_20)]",
  linkedin: "bg-[oklch(0.55_0.18_240/15%)] text-[oklch(0.72_0.14_240)]",
  tiktok: "bg-muted/40 text-foreground",
  google_business: "bg-[oklch(0.65_0.2_25/15%)] text-[oklch(0.82_0.14_25)]",
};

const STATUS_STYLES: Record<
  PostStatus,
  { label: string; className: string; borderColor: string }
> = {
  draft: {
    label: "Draft",
    className: "status-draft",
    borderColor: "oklch(0.2 0.018 280)",
  },
  scheduled: {
    label: "Scheduled",
    className: "status-pending",
    borderColor: "oklch(0.72 0.18 75)",
  },
  published: {
    label: "Published",
    className: "status-paid",
    borderColor: "oklch(0.62 0.18 155)",
  },
  failed: {
    label: "Failed",
    className: "badge-rose",
    borderColor: "oklch(0.62 0.2 15)",
  },
  paused: {
    label: "Paused",
    className: "status-draft",
    borderColor: "oklch(0.2 0.018 280)",
  },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateHeader(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function toDatetimeLocal(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PostStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${s.className}`}
    >
      {s.label}
    </span>
  );
}

function PlatformChip({ platform }: { platform: SocialPlatform }) {
  return (
    <span className={`social-platform-badge ${PLATFORM_BG[platform]}`}>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function CalendarPostCard({
  post,
  onClick,
}: {
  post: ScheduledPost;
  onClick: () => void;
}) {
  const borderColor = STATUS_STYLES[post.status].borderColor;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onClick}
            className="w-full text-left p-1.5 rounded border border-border/60 bg-background hover:bg-accent/30 transition-smooth group cursor-pointer"
            style={{ borderLeft: `3px solid ${borderColor}` }}
          >
            <div className="flex items-center gap-1 mb-0.5 flex-wrap">
              {post.platforms.slice(0, 2).map((p) => (
                <span
                  key={p}
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: PLATFORM_COLORS[p] }}
                />
              ))}
              {post.platforms.length > 2 && (
                <span className="text-[9px] text-muted-foreground">
                  +{post.platforms.length - 2}
                </span>
              )}
            </div>
            <p className="text-[11px] text-foreground line-clamp-2 leading-tight">
              {post.content}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {formatTime(post.scheduledAt)}
            </p>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="max-w-xs bg-popover border border-border p-3"
        >
          <p className="text-xs text-foreground mb-2">{post.content}</p>
          <div className="flex flex-wrap gap-1">
            {post.platforms.map((p) => (
              <PlatformChip key={p} platform={p} />
            ))}
            <StatusBadge status={post.status} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function QueueItem({
  post,
  index,
  onEdit,
  onDelete,
}: {
  post: ScheduledPost;
  index: number;
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
}) {
  const borderColor = STATUS_STYLES[post.status].borderColor;
  return (
    <div
      data-ocid={`social_scheduler.item.${index + 1}`}
      className="social-post-card rounded-lg p-3 mb-2"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <StatusBadge status={post.status} />
            {post.platforms.slice(0, 2).map((p) => (
              <PlatformChip key={p} platform={p} />
            ))}
          </div>
          <p className="text-xs text-foreground line-clamp-2 mb-1">
            {post.content}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {new Date(post.scheduledAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            · {formatTime(post.scheduledAt)}
          </div>
        </div>
        <div className="flex gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(post)}
            data-ocid={`social_scheduler.edit_button.${index + 1}`}
            className="p-1.5 rounded hover:bg-accent/40 transition-smooth text-muted-foreground hover:text-foreground"
            aria-label="Edit post"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            data-ocid={`social_scheduler.delete_button.${index + 1}`}
            className="p-1.5 rounded hover:bg-destructive/20 transition-smooth text-muted-foreground hover:text-destructive"
            aria-label="Delete post"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post Form (shared by New + Edit modal) ────────────────────────────────────

interface PostFormState {
  content: string;
  platforms: SocialPlatform[];
  scheduledAt: string;
  status: PostStatus;
  niche: NicheType;
  funnelStage: FunnelStage;
  marketingFramework: MarketingFramework;
  ctaType: CtaType;
  ctaUrl: string;
  tags: string;
}

const DEFAULT_FORM: PostFormState = {
  content: "",
  platforms: ["facebook"],
  scheduledAt: toDatetimeLocal(Date.now() + 3600000),
  status: "scheduled",
  niche: "plumbing",
  funnelStage: "tofu",
  marketingFramework: "hormozi_value_stack",
  ctaType: "booking",
  ctaUrl: "https://bookedrankedfunded.org/setup",
  tags: "",
};

function PostFormModal({
  open,
  onClose,
  onSave,
  initial,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: PostFormState, asDraft: boolean) => void;
  initial?: PostFormState;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<PostFormState>(initial ?? DEFAULT_FORM);
  const [activePlatformPreview, setActivePlatformPreview] =
    useState<SocialPlatform>("facebook");

  // Sync when initial changes (edit mode)
  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const charLimit = PLATFORM_CHAR_LIMITS[activePlatformPreview];
  const charCount = form.content.length;
  const charOver = charCount > charLimit;

  function togglePlatform(p: SocialPlatform) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="social_scheduler.dialog"
        className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {initial ? "Edit Post" : "New Post"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Platform selector */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Platforms
            </Label>
            <div
              className="flex flex-wrap gap-2"
              data-ocid="social_scheduler.platform_select"
            >
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-smooth ${
                    form.platforms.includes(p)
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "bg-muted/30 border-border text-muted-foreground hover:border-border/80"
                  }`}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Platform preview tabs */}
          {form.platforms.length > 0 && (
            <div className="flex gap-1 border-b border-border pb-2">
              {form.platforms.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePlatformPreview(p)}
                  className={`text-xs px-2 py-1 rounded-t transition-smooth ${
                    activePlatformPreview === p
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          )}

          {/* Content textarea */}
          <div>
            <Label
              htmlFor="post-content"
              className="text-xs text-muted-foreground mb-2 block"
            >
              Content for {PLATFORM_LABELS[activePlatformPreview]}
            </Label>
            <Textarea
              id="post-content"
              data-ocid="social_scheduler.textarea"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder={`Write your ${PLATFORM_LABELS[activePlatformPreview]} post here...`}
              className="bg-background border-input min-h-[120px] resize-none text-sm"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">
                Limit: {charLimit.toLocaleString()} chars
              </span>
              <span
                className={`text-[10px] font-mono ${
                  charOver
                    ? "text-destructive"
                    : charCount > charLimit * 0.9
                      ? "text-[oklch(0.72_0.18_75)]"
                      : "text-muted-foreground"
                }`}
              >
                {charCount.toLocaleString()} / {charLimit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Schedule datetime */}
          <div>
            <Label
              htmlFor="post-datetime"
              className="text-xs text-muted-foreground mb-2 block"
            >
              Schedule Date & Time
            </Label>
            <input
              id="post-datetime"
              type="datetime-local"
              data-ocid="social_scheduler.schedule_input"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm((f) => ({ ...f, scheduledAt: e.target.value }))
              }
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Niche + Funnel Stage row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Niche
              </Label>
              <Select
                value={form.niche}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, niche: v as NicheType }))
                }
              >
                <SelectTrigger
                  data-ocid="social_scheduler.niche_select"
                  className="bg-background border-input text-sm h-9"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {(
                    [
                      "plumbing",
                      "hvac",
                      "restoration",
                      "carpet_cleaning",
                      "roofing",
                      "med_spa",
                      "real_estate",
                      "mortgage",
                      "chiropractor",
                      "dental",
                    ] as NicheType[]
                  ).map((n) => (
                    <SelectItem
                      key={n}
                      value={n}
                      className="text-sm capitalize"
                    >
                      {n.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Funnel Stage
              </Label>
              <Select
                value={form.funnelStage}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, funnelStage: v as FunnelStage }))
                }
              >
                <SelectTrigger
                  data-ocid="social_scheduler.funnel_select"
                  className="bg-background border-input text-sm h-9"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="tofu">TOFU — Awareness</SelectItem>
                  <SelectItem value="mofu">MOFU — Consideration</SelectItem>
                  <SelectItem value="bofu">BOFU — Decision</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CTA URL */}
          <div>
            <Label
              htmlFor="post-cta"
              className="text-xs text-muted-foreground mb-2 block"
            >
              CTA URL
            </Label>
            <input
              id="post-cta"
              type="url"
              data-ocid="social_scheduler.cta_input"
              value={form.ctaUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaUrl: e.target.value }))
              }
              placeholder="https://bookedrankedfunded.org/setup"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Tags */}
          <div>
            <Label
              htmlFor="post-tags"
              className="text-xs text-muted-foreground mb-2 block"
            >
              Tags (comma-separated)
            </Label>
            <input
              id="post-tags"
              type="text"
              data-ocid="social_scheduler.tags_input"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="plumbing, water-heater, maintenance"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          <Button
            variant="ghost"
            onClick={onClose}
            data-ocid="social_scheduler.cancel_button"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => onSave(form, true)}
            data-ocid="social_scheduler.save_draft_button"
            disabled={
              isSaving || !form.content.trim() || form.platforms.length === 0
            }
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => onSave(form, false)}
            data-ocid="social_scheduler.submit_button"
            disabled={
              isSaving ||
              !form.content.trim() ||
              form.platforms.length === 0 ||
              charOver
            }
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {initial ? "Save Changes" : "Schedule Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SocialSchedulerPage() {
  const {
    scheduledPosts,
    getScheduledPosts,
    createScheduledPost,
    updateScheduledPost,
    isLoadingScheduled,
  } = useSocialMedia();

  const [view, setView] = useState<"week" | "list">("week");
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [activePlatforms, setActivePlatforms] = useState<Set<SocialPlatform>>(
    new Set(PLATFORMS),
  );
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<ScheduledPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkPublishing, setIsBulkPublishing] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only call
  useEffect(() => {
    void getScheduledPosts("tenant-1");
  }, []);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  // Filter posts by active platforms and current week
  const filteredPosts = useMemo(() => {
    return scheduledPosts.filter((p) =>
      p.platforms.some((pl) => activePlatforms.has(pl)),
    );
  }, [scheduledPosts, activePlatforms]);

  // Posts grouped by day + platform for calendar
  const calendarMap = useMemo(() => {
    const map = new Map<string, Map<SocialPlatform, ScheduledPost[]>>();
    for (const day of weekDays) {
      const dayKey = day.toDateString();
      const byPlatform = new Map<SocialPlatform, ScheduledPost[]>();
      for (const pl of PLATFORMS) byPlatform.set(pl, []);
      for (const post of filteredPosts) {
        const postDay = new Date(post.scheduledAt);
        if (isSameDay(postDay, day)) {
          for (const pl of post.platforms) {
            if (activePlatforms.has(pl)) {
              const arr = byPlatform.get(pl) ?? [];
              arr.push(post);
              byPlatform.set(pl, arr);
            }
          }
        }
      }
      map.set(dayKey, byPlatform);
    }
    return map;
  }, [filteredPosts, weekDays, activePlatforms]);

  // Upcoming queue (chronological, not paused/published)
  const upcomingQueue = useMemo(
    () =>
      filteredPosts
        .filter((p) => p.status === "scheduled" || p.status === "draft")
        .sort((a, b) => a.scheduledAt - b.scheduledAt),
    [filteredPosts],
  );

  // All posts for mobile list view, grouped by date
  const listGroups = useMemo(() => {
    const sorted = [...filteredPosts].sort(
      (a, b) => a.scheduledAt - b.scheduledAt,
    );
    const groups: { dateLabel: string; posts: ScheduledPost[] }[] = [];
    for (const post of sorted) {
      const label = formatDateHeader(new Date(post.scheduledAt));
      const existing = groups.find((g) => g.dateLabel === label);
      if (existing) existing.posts.push(post);
      else groups.push({ dateLabel: label, posts: [post] });
    }
    return groups;
  }, [filteredPosts]);

  function togglePlatformFilter(p: SocialPlatform) {
    setActivePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(p);
      } else {
        next.add(p);
      }
      return next;
    });
  }

  async function handleSavePost(form: PostFormState, asDraft: boolean) {
    if (!form.content.trim() || form.platforms.length === 0) return;
    setIsSaving(true);
    try {
      const scheduledAtMs = new Date(form.scheduledAt).getTime();
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (editPost) {
        await updateScheduledPost(editPost.id, {
          content: form.content,
          platforms: form.platforms,
          scheduledAt: scheduledAtMs,
          status: asDraft ? "draft" : "scheduled",
          niche: form.niche,
          funnelStage: form.funnelStage,
          marketingFramework: form.marketingFramework,
          ctaType: form.ctaType,
          ctaUrl: form.ctaUrl,
          tags,
        });
        toast.success("Post updated");
        setEditPost(null);
      } else {
        await createScheduledPost({
          tenantId: "tenant-1",
          content: form.content,
          platforms: form.platforms,
          scheduledAt: scheduledAtMs,
          status: asDraft ? "draft" : "scheduled",
          niche: form.niche,
          funnelStage: form.funnelStage,
          marketingFramework: form.marketingFramework,
          ctaType: form.ctaType,
          ctaUrl: form.ctaUrl,
          contentCadence: 7,
          platformVariants: {},
          beforeAfterPhoto: null,
          tags,
        });
        toast.success(asDraft ? "Saved as draft" : "Post scheduled");
        setNewModalOpen(false);
      }
    } catch {
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await updateScheduledPost(id, { status: "paused" });
    toast.success("Post removed from queue");
  }

  async function handleBulkPublish() {
    const approved = filteredPosts.filter((p) => p.status === "scheduled");
    if (approved.length === 0) {
      toast("No scheduled posts to publish");
      return;
    }
    setIsBulkPublishing(true);
    try {
      await Promise.all(
        approved.map((p) => updateScheduledPost(p.id, { status: "published" })),
      );
      toast.success(`${approved.length} posts marked as published`);
    } catch {
      toast.error("Bulk publish failed");
    } finally {
      setIsBulkPublishing(false);
    }
  }

  function openEditModal(post: ScheduledPost) {
    setEditPost(post);
  }

  const editFormInitial: PostFormState | undefined = editPost
    ? {
        content: editPost.content,
        platforms: editPost.platforms,
        scheduledAt: toDatetimeLocal(editPost.scheduledAt),
        status: editPost.status,
        niche: editPost.niche,
        funnelStage: editPost.funnelStage,
        marketingFramework: editPost.marketingFramework,
        ctaType: editPost.ctaType,
        ctaUrl: editPost.ctaUrl,
        tags: editPost.tags.join(", "),
      }
    : undefined;

  const scheduledCount = filteredPosts.filter(
    (p) => p.status === "scheduled",
  ).length;
  const publishedCount = filteredPosts.filter(
    (p) => p.status === "published",
  ).length;
  const draftCount = filteredPosts.filter((p) => p.status === "draft").length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <TooltipProvider>
      <div
        data-ocid="social_scheduler.page"
        className="flex flex-col h-full min-h-0"
      >
        {/* ── Page Header ─────────────────────────────────────────────────── */}
        <div className="scheduler-panel border-b border-border rounded-none px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              Social Scheduler
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Schedule &amp; manage posts across all platforms
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setView("week")}
                data-ocid="social_scheduler.week_tab"
                className={`px-3 py-1.5 text-xs font-medium transition-smooth flex items-center gap-1.5 ${
                  view === "week"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Week</span>
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                data-ocid="social_scheduler.list_tab"
                className={`px-3 py-1.5 text-xs font-medium transition-smooth flex items-center gap-1.5 border-l border-border ${
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {/* Bulk publish */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkPublish}
              disabled={isBulkPublishing || scheduledCount === 0}
              data-ocid="social_scheduler.bulk_publish_button"
              className="scheduler-bulk-publish border-0 text-xs h-8"
            >
              {isBulkPublishing ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 mr-1.5" />
              )}
              Publish All ({scheduledCount})
            </Button>

            {/* New Post */}
            <Button
              size="sm"
              onClick={() => setNewModalOpen(true)}
              data-ocid="social_scheduler.new_post_button"
              className="h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Post
            </Button>
          </div>
        </div>

        {/* ── Platform Filter Chips ────────────────────────────────────────── */}
        <div className="px-4 py-2 flex items-center gap-2 border-b border-border bg-card/50 flex-wrap">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Platforms:
          </span>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatformFilter(p)}
              data-ocid={`social_scheduler.platform_filter.${p}`}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-smooth ${
                activePlatforms.has(p)
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-muted/20 border-border/60 text-muted-foreground opacity-50 hover:opacity-70"
              }`}
            >
              {PLATFORM_LABELS[p]}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="badge-amber rounded px-1.5 py-0.5">
              {scheduledCount} scheduled
            </span>
            <span className="badge-emerald rounded px-1.5 py-0.5">
              {publishedCount} published
            </span>
            <span className="status-draft rounded px-1.5 py-0.5">
              {draftCount} drafts
            </span>
          </div>
        </div>

        {/* ── Main content area ────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Calendar or List */}
          <div className="flex-1 overflow-hidden flex flex-col min-w-0">
            {isLoadingScheduled && (
              <div
                data-ocid="social_scheduler.loading_state"
                className="p-6 space-y-3"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            )}

            {/* ── Week View ─────────────────────────────────────────────── */}
            {!isLoadingScheduled && view === "week" && (
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Week navigation */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
                  <button
                    type="button"
                    onClick={() => {
                      const prev = new Date(weekStart);
                      prev.setDate(prev.getDate() - 7);
                      setWeekStart(prev);
                    }}
                    data-ocid="social_scheduler.week_prev"
                    className="p-1.5 rounded hover:bg-accent/30 transition-smooth text-muted-foreground hover:text-foreground"
                    aria-label="Previous week"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-foreground">
                    {weekDays[0].toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    –{" "}
                    {weekDays[6].toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = new Date(weekStart);
                      next.setDate(next.getDate() + 7);
                      setWeekStart(next);
                    }}
                    data-ocid="social_scheduler.week_next"
                    className="p-1.5 rounded hover:bg-accent/30 transition-smooth text-muted-foreground hover:text-foreground"
                    aria-label="Next week"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Calendar grid — hidden on mobile, shown from md+ */}
                <div className="hidden md:flex flex-1 overflow-hidden">
                  <ScrollArea className="flex-1">
                    <div className="min-w-[700px]">
                      {/* Day headers */}
                      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-card/20">
                        <div className="p-2 text-[10px] font-semibold text-muted-foreground uppercase">
                          Platform
                        </div>
                        {weekDays.map((day, i) => {
                          const isToday = isSameDay(day, new Date());
                          return (
                            <div
                              key={day.toDateString()}
                              className="p-2 text-center border-l border-border/40"
                            >
                              <p
                                className={`text-[10px] font-semibold uppercase ${isToday ? "text-primary" : "text-muted-foreground"}`}
                              >
                                {DAYS[i]}
                              </p>
                              <p
                                className={`text-base font-bold ${isToday ? "text-primary" : "text-foreground"}`}
                              >
                                {day.getDate()}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Platform rows */}
                      {PLATFORMS.filter((p) => activePlatforms.has(p)).map(
                        (platform) => (
                          <div
                            key={platform}
                            className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border/30"
                          >
                            {/* Platform label */}
                            <div
                              className="p-2 flex items-center"
                              style={{
                                borderLeft: `3px solid ${PLATFORM_COLORS[platform]}`,
                              }}
                            >
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {PLATFORM_LABELS[platform]}
                              </span>
                            </div>

                            {/* Day cells */}
                            {weekDays.map((day) => {
                              const dayPosts =
                                calendarMap
                                  .get(day.toDateString())
                                  ?.get(platform) ?? [];
                              const isToday = isSameDay(day, new Date());
                              return (
                                <div
                                  key={day.toDateString()}
                                  className={`p-1.5 border-l border-border/30 min-h-[70px] ${
                                    isToday
                                      ? "bg-primary/5"
                                      : "bg-background/20"
                                  }`}
                                >
                                  {dayPosts.map((post) => (
                                    <CalendarPostCard
                                      key={`${post.id}-${platform}`}
                                      post={post}
                                      onClick={() => openEditModal(post)}
                                    />
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        ),
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Mobile: collapse to list on small screens */}
                <div className="md:hidden flex-1 overflow-auto">
                  {listGroups.length === 0 ? (
                    <div
                      data-ocid="social_scheduler.empty_state"
                      className="flex flex-col items-center justify-center py-16 px-4 text-center"
                    >
                      <Calendar className="h-12 w-12 text-muted-foreground/30 mb-3" />
                      <p className="text-sm font-semibold text-foreground">
                        No posts this week
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Create your first post to fill the calendar
                      </p>
                      <Button
                        size="sm"
                        className="mt-4"
                        onClick={() => setNewModalOpen(true)}
                        data-ocid="social_scheduler.empty_new_post_button"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        New Post
                      </Button>
                    </div>
                  ) : (
                    <div className="px-4 py-3 space-y-4">
                      {listGroups.map((group) => (
                        <div key={group.dateLabel}>
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {group.dateLabel}
                          </p>
                          {group.posts.map((post, i) => (
                            <QueueItem
                              key={post.id}
                              post={post}
                              index={i}
                              onEdit={openEditModal}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── List View ─────────────────────────────────────────────── */}
            {!isLoadingScheduled && view === "list" && (
              <ScrollArea className="flex-1">
                {listGroups.length === 0 ? (
                  <div
                    data-ocid="social_scheduler.empty_state"
                    className="flex flex-col items-center justify-center py-20 text-center px-4"
                  >
                    <Calendar className="h-14 w-14 text-muted-foreground/25 mb-4" />
                    <p className="text-base font-semibold text-foreground mb-1">
                      No posts scheduled
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Schedule posts to see them here — or generate content
                      first.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setNewModalOpen(true)}
                        data-ocid="social_scheduler.empty_new_post_button"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        New Post
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/social-content-generator">Generate Content</a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-4 space-y-6">
                    {listGroups.map((group) => (
                      <div key={group.dateLabel}>
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {group.dateLabel}
                          </p>
                          <div className="flex-1 h-px bg-border/40" />
                          <Badge variant="secondary" className="text-[10px]">
                            {group.posts.length}
                          </Badge>
                        </div>
                        {group.posts.map((post, i) => (
                          <QueueItem
                            key={post.id}
                            post={post}
                            index={i}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}
          </div>

          {/* ── Right Sidebar: Upcoming Queue ──────────────────────────── */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-l border-border bg-card/30 flex-shrink-0">
            <div className="px-3 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Upcoming Queue
                </span>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {upcomingQueue.length}
              </Badge>
            </div>

            <ScrollArea className="flex-1 px-2 py-2">
              {isLoadingScheduled && (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )}

              {!isLoadingScheduled && upcomingQueue.length === 0 && (
                <div
                  data-ocid="social_scheduler.queue_empty_state"
                  className="flex flex-col items-center justify-center py-10 text-center px-2"
                >
                  <Calendar className="h-8 w-8 text-muted-foreground/25 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No upcoming posts
                  </p>
                </div>
              )}

              {!isLoadingScheduled &&
                upcomingQueue.map((post, i) => (
                  <QueueItem
                    key={post.id}
                    post={post}
                    index={i}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
            </ScrollArea>

            {/* Quick action */}
            <div className="p-2 border-t border-border">
              <button
                type="button"
                onClick={() => setNewModalOpen(true)}
                data-ocid="social_scheduler.sidebar_new_post_button"
                className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-smooth bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
              >
                <Plus className="h-3.5 w-3.5" />
                Schedule New Post
              </button>
            </div>
          </aside>
        </div>

        {/* ── New Post Modal ──────────────────────────────────────────────── */}
        <PostFormModal
          open={newModalOpen}
          onClose={() => setNewModalOpen(false)}
          onSave={handleSavePost}
          isSaving={isSaving}
        />

        {/* ── Edit Post Modal ─────────────────────────────────────────────── */}
        <PostFormModal
          open={!!editPost}
          onClose={() => setEditPost(null)}
          onSave={handleSavePost}
          initial={editFormInitial}
          isSaving={isSaving}
        />

        {/* Mobile: floating new post button */}
        <button
          type="button"
          onClick={() => setNewModalOpen(true)}
          data-ocid="social_scheduler.fab_button"
          className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg glow-purple-sm bg-primary text-primary-foreground z-50 transition-smooth hover:scale-105 active:scale-95"
          aria-label="New post"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </TooltipProvider>
  );
}
