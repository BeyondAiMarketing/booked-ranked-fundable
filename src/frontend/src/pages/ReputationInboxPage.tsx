import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Facebook,
  Globe,
  Link2,
  Loader2,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Settings2,
  Share2,
  ShieldAlert,
  Sparkles,
  Square,
  Star,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CompetitorReviewPanel from "../components/reputation/CompetitorReviewPanel";
import RecoveryWorkflowDrawer from "../components/reputation/RecoveryWorkflowDrawer";
import ReputationAlertsPanel from "../components/reputation/ReputationAlertsPanel";
import ReviewToSocialPipeline from "../components/reputation/ReviewToSocialPipeline";
import { useApp } from "../context/AppContext";
import {
  DEMO_REVIEW_SYNC_RECORDS,
  DEMO_VELOCITY_STATS,
} from "../data/reputationSyncData";
import type {
  ReviewPlatform,
  ReviewSentiment,
  ReviewSyncRecord,
} from "../types/reputationSync";

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_LABELS: Record<ReviewPlatform, string> = {
  google: "Google",
  yelp: "Yelp",
  facebook: "Facebook",
};

const PLATFORM_LETTER: Record<ReviewPlatform, string> = {
  google: "G",
  yelp: "Y",
  facebook: "F",
};

const SENTIMENT_CONFIG: Record<
  ReviewSentiment,
  { label: string; className: string }
> = {
  positive: { label: "Positive", className: "badge-emerald" },
  neutral: { label: "Neutral", className: "badge-blue" },
  negative: { label: "Negative", className: "badge-rose" },
};

type SortKey = "newest" | "oldest" | "lowest" | "unresponded";
type FilterKey = ReviewPlatform | "all" | "unresponded" | "needs_attention";

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Platforms" },
  { key: "google", label: "Google" },
  { key: "yelp", label: "Yelp" },
  { key: "facebook", label: "Facebook" },
  { key: "unresponded", label: "Unresponded" },
  { key: "needs_attention", label: "Needs Attention" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "lowest", label: "Lowest rated first" },
  { key: "unresponded", label: "Unresponded first" },
];

// ── Response variants per niche ───────────────────────────────────────────────

const RESPONSE_VARIANTS: Record<
  string,
  {
    tone: "formal" | "friendly" | "brief";
    label: string;
    framework: string;
    text: string;
  }[]
> = {
  negative: [
    {
      tone: "formal",
      label: "Formal",
      framework: "Kennedy Direct Response",
      text: "We sincerely apologize that your experience didn't reflect the standard we hold ourselves to. Please contact us directly so we can personally review your case and make this right — it's our commitment to every client.",
    },
    {
      tone: "friendly",
      label: "Friendly",
      framework: "Hormozi Value Empathy",
      text: "We're really sorry about this — that's not the experience you deserved. Please reach out directly and ask for the owner. We'll make it right, no questions asked.",
    },
    {
      tone: "brief",
      label: "Brief",
      framework: "Ogilvy Clarity",
      text: "We're sorry about your experience. Please contact us directly — we want to make this right immediately.",
    },
  ],
  positive: [
    {
      tone: "formal",
      label: "Formal",
      framework: "Hopkins Specificity",
      text: "Thank you so much for taking the time to share your experience. Hearing this kind of feedback reaffirms why we do what we do every single day. We look forward to serving you again.",
    },
    {
      tone: "friendly",
      label: "Friendly",
      framework: "Brunson Epiphany Bridge",
      text: "This made our whole team smile — thank you! Reviews like this are why we push ourselves to do great work on every single job. Can't wait to serve you again!",
    },
    {
      tone: "brief",
      label: "Brief",
      framework: "Sugarman Specificity",
      text: "Thank you for the kind words — this means everything to our team. We'll keep earning it!",
    },
  ],
};

// ── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
          }
        />
      ))}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: ReviewPlatform }) {
  return (
    <span className={`review-source-badge review-source-${platform}`}>
      <span className="mr-1 font-bold">{PLATFORM_LETTER[platform]}</span>
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

function starBorderClass(rating: number): string {
  if (rating === 5) return "review-5star";
  if (rating === 4) return "review-4star";
  if (rating === 3) return "review-3star";
  if (rating === 2) return "review-2star";
  return "review-1star";
}

// ── Enhanced Response Drawer ──────────────────────────────────────────────────

function ResponseDrawer({
  review,
  onClose,
  onPublish,
  onOpenRecovery,
}: {
  review: ReviewSyncRecord;
  onClose: () => void;
  onPublish: (id: string, text: string) => void;
  onOpenRecovery: () => void;
}) {
  const isNegative = review.rating <= 2;
  const variants = isNegative
    ? RESPONSE_VARIANTS.negative
    : RESPONSE_VARIANTS.positive;
  const [selectedTone, setSelectedTone] = useState<
    "formal" | "friendly" | "brief"
  >("formal");
  const [draft, setDraft] = useState(
    () =>
      variants.find((v) => v.tone === "formal")?.text ??
      review.aiDraftResponse ??
      "",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [elapsedMins] = useState(47);
  const drawerRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function selectVariant(tone: "formal" | "friendly" | "brief") {
    setSelectedTone(tone);
    const variant = variants.find((v) => v.tone === tone);
    if (variant) setDraft(variant.text);
  }

  function handleRegenerate() {
    setIsGenerating(true);
    setTimeout(() => {
      const randomVariant =
        variants[Math.floor(Math.random() * variants.length)];
      setDraft(randomVariant.text);
      setIsGenerating(false);
    }, 1200);
  }

  function handlePublish() {
    onPublish(review.id, draft);
    toast.success(
      `Response published to ${PLATFORM_LABELS[review.platform]}!`,
      { description: "Your response is now live on the platform." },
    );
    onClose();
  }

  const isPublished = review.responsePublished;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-hidden="true"
      />
      <dialog
        ref={drawerRef}
        open
        aria-label="Respond to review"
        data-ocid="reputation.response_drawer"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg flex flex-col p-0 m-0"
        style={{
          background: "oklch(0.14 0.014 280)",
          borderLeft: "1px solid oklch(1 0 0 / 10%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: "oklch(1 0 0 / 8%)" }}
        >
          <div className="flex items-center gap-3">
            <PlatformBadge platform={review.platform} />
            <span className="text-sm font-semibold text-white">
              Responding to {review.reviewerName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="reputation.close_button"
            aria-label="Close drawer"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scroll body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Original review */}
          <div
            className={`review-item rounded-xl p-4 ${starBorderClass(review.rating)}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-white">
                {review.reviewerName}
              </span>
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {review.comment}
            </p>
          </div>

          {/* Negative review urgency banner */}
          {isNegative && (
            <div
              className="rounded-xl p-3 flex items-start gap-2.5"
              style={{
                background: "oklch(0.62 0.2 15 / 10%)",
                border: "1px solid oklch(0.62 0.2 15 / 25%)",
              }}
            >
              <ShieldAlert
                size={13}
                className="text-rose-400 mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-rose-300">
                  This response will be seen by every future prospect who reads
                  your reviews.
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Best practice: respond within 2 hours.{" "}
                  <span className="text-emerald-400">
                    {elapsedMins}min elapsed.
                  </span>{" "}
                  Or{" "}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRecovery();
                    }}
                    className="text-purple-400 underline hover:no-underline transition-colors"
                  >
                    open the full Recovery Workflow →
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* AI Response area */}
          {isPublished ? (
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "oklch(0.62 0.18 155 / 8%)",
                borderColor: "oklch(0.62 0.18 155 / 30%)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} className="text-emerald-400" />
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.78 0.14 155)" }}
                >
                  Response published
                </span>
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                {review.platformResponse}
              </p>
            </div>
          ) : (
            <>
              {/* Tone variants */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white flex items-center gap-1.5">
                    <Sparkles size={12} className="text-purple-400" />
                    Choose Response Tone
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    data-ocid="reputation.regenerate_button"
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors"
                    style={{
                      background: "oklch(0.58 0.22 290 / 12%)",
                      color: "oklch(0.78 0.16 290)",
                      border: "1px solid oklch(0.58 0.22 290 / 30%)",
                    }}
                  >
                    <RotateCcw
                      size={11}
                      className={isGenerating ? "animate-spin" : ""}
                    />
                    {isGenerating ? "Generating…" : "Regenerate"}
                  </button>
                </div>
                <div className="flex gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.tone}
                      type="button"
                      onClick={() => selectVariant(v.tone)}
                      data-ocid={`reputation.tone.${v.tone}`}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={
                        selectedTone === v.tone
                          ? {
                              background: "oklch(0.58 0.22 290 / 20%)",
                              color: "oklch(0.78 0.16 290)",
                              border: "1px solid oklch(0.58 0.22 290 / 40%)",
                            }
                          : {
                              background: "oklch(0.18 0.016 280)",
                              color: "oklch(0.6 0.01 280)",
                              border: "1px solid oklch(1 0 0 / 8%)",
                            }
                      }
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                {/* Framework badge */}
                <div className="flex items-center gap-1.5">
                  <Sparkles size={10} className="text-purple-400" />
                  <span className="text-[10px] text-muted-foreground">
                    {variants.find((v) => v.tone === selectedTone)?.framework}
                  </span>
                </div>
              </div>

              <div>
                <textarea
                  className="w-full qa-reply-textarea rounded-xl p-3 text-sm resize-none"
                  rows={5}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  data-ocid="reputation.response_textarea"
                  placeholder="Write your response here…"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {draft.length} characters
                </p>
              </div>

              {/* Preview toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPreview ? (
                    <ChevronUp size={13} />
                  ) : (
                    <ChevronDown size={13} />
                  )}
                  {showPreview ? "Hide preview" : "Preview response"}
                </button>
                {showPreview && (
                  <div
                    className="mt-3 rounded-xl p-4"
                    style={{
                      background: "oklch(0.11 0.012 280)",
                      border: "1px solid oklch(1 0 0 / 6%)",
                    }}
                  >
                    <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                      Preview — how it will appear on{" "}
                      {PLATFORM_LABELS[review.platform]}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-semibold text-white">
                        Owner Response:
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed italic">
                        {draft || "No response text yet…"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isPublished && (
          <div
            className="px-5 py-4 border-t flex gap-3 shrink-0"
            style={{ borderColor: "oklch(1 0 0 / 8%)" }}
          >
            <button
              type="button"
              onClick={handlePublish}
              data-ocid="reputation.publish_button"
              disabled={!draft.trim()}
              className="one-click-publish-btn flex-1 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isNegative ? <ShieldAlert size={14} /> : <Zap size={14} />}
              {isNegative
                ? "Approve & Publish"
                : `Publish to ${PLATFORM_LABELS[review.platform]}`}
            </button>
            <button
              type="button"
              onClick={() => {
                toast.info("Draft saved");
                onClose();
              }}
              data-ocid="reputation.save_draft_button"
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              style={{
                background: "oklch(0.18 0.016 280)",
                border: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              Save Draft
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}

// ── Unified Inbox Tab ────────────────────────────────────────────────────────

function UnifiedInboxTab({
  reviews,
  publishedIds,
  onPublish,
  onOpenRecovery,
  onOpenSocialPipeline,
}: {
  reviews: ReviewSyncRecord[];
  publishedIds: Set<string>;
  onPublish: (id: string, text: string) => void;
  onOpenRecovery: (review: ReviewSyncRecord) => void;
  onOpenSocialPipeline: (review: ReviewSyncRecord) => void;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeReview, setActiveReview] = useState<ReviewSyncRecord | null>(
    null,
  );

  const filtered = reviews
    .filter((r) => {
      if (filter === "google" || filter === "yelp" || filter === "facebook") {
        return r.platform === filter;
      }
      if (filter === "unresponded")
        return !r.responsePublished && !publishedIds.has(r.id);
      if (filter === "needs_attention") return r.rating <= 3;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === "newest") return b.createdAt - a.createdAt;
      if (sortKey === "oldest") return a.createdAt - b.createdAt;
      if (sortKey === "lowest") return a.rating - b.rating;
      if (sortKey === "unresponded") {
        const aRes = a.responsePublished || publishedIds.has(a.id);
        const bRes = b.responsePublished || publishedIds.has(b.id);
        return Number(aRes) - Number(bRes);
      }
      return 0;
    });

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBulkRespond() {
    const templateText =
      "Thank you for taking the time to share your feedback! We truly appreciate your business and hope to serve you again soon.";
    for (const id of selectedIds) {
      onPublish(id, templateText);
    }
    toast.success(`Template response published to ${selectedIds.size} reviews`);
    setSelectedIds(new Set());
  }

  return (
    <div className="space-y-4">
      {/* Filter + Sort bar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <fieldset className="flex flex-wrap gap-1" aria-label="Platform filter">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              data-ocid={`reputation.filter.${opt.key}`}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === opt.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </fieldset>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          data-ocid="reputation.sort_select"
          className="text-xs px-3 py-1.5 rounded-lg text-muted-foreground cursor-pointer"
          style={{
            background: "oklch(0.14 0.014 280)",
            border: "1px solid oklch(1 0 0 / 10%)",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-xl"
          style={{
            background: "oklch(0.58 0.22 290 / 12%)",
            border: "1px solid oklch(0.58 0.22 290 / 30%)",
          }}
          data-ocid="reputation.bulk_actions"
        >
          <span
            className="text-xs font-medium"
            style={{ color: "oklch(0.78 0.16 290)" }}
          >
            {selectedIds.size} review{selectedIds.size !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBulkRespond}
              data-ocid="reputation.bulk_respond_button"
              className="one-click-publish-btn text-xs px-3 py-1.5"
            >
              Respond with template
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              data-ocid="reputation.bulk_clear_button"
              className="text-xs px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              style={{ border: "1px solid oklch(1 0 0 / 10%)" }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-3" data-ocid="reputation.list">
        {filtered.length === 0 ? (
          <div
            className="card-dark rounded-xl p-12 text-center"
            data-ocid="reputation.empty_state"
          >
            <Star
              size={40}
              className="mx-auto text-muted-foreground opacity-40 mb-3"
            />
            <p className="text-sm font-semibold text-white">No reviews found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Adjust your filters or sync more reviews.
            </p>
          </div>
        ) : (
          filtered.map((review, idx) => {
            const sentConf = SENTIMENT_CONFIG[review.sentiment];
            const isPublishedReview =
              review.responsePublished || publishedIds.has(review.id);
            const isSelected = selectedIds.has(review.id);
            const isNegative = review.rating <= 2;

            return (
              <div
                key={review.id}
                data-ocid={`reputation.item.${idx + 1}`}
                className={`review-item rounded-xl p-4 ${starBorderClass(review.rating)} ${isSelected ? "ring-1 ring-primary/50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleSelect(review.id)}
                    data-ocid={`reputation.select.${idx + 1}`}
                    aria-label={
                      isSelected ? "Deselect review" : "Select review"
                    }
                    className="mt-0.5 shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Square
                      size={14}
                      className={isSelected ? "fill-primary text-primary" : ""}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-white">
                        {review.reviewerName}
                      </span>
                      <PlatformBadge platform={review.platform} />
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${sentConf.className}`}
                      >
                        {sentConf.label}
                      </span>
                      {isNegative && (
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                          style={{
                            background: "oklch(0.62 0.2 15 / 15%)",
                            color: "oklch(0.78 0.16 15)",
                          }}
                        >
                          Action Required
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed line-clamp-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    {isPublishedReview && review.platformResponse && (
                      <div
                        className="mt-3 rounded-lg p-3"
                        style={{
                          background: "oklch(0.62 0.18 155 / 8%)",
                          border: "1px solid oklch(0.62 0.18 155 / 20%)",
                        }}
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          Your response:
                        </p>
                        <p className="text-xs text-slate-400 italic line-clamp-2">
                          {review.platformResponse}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    {isPublishedReview ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-emerald-400" />
                        <span
                          className="text-xs font-medium"
                          style={{ color: "oklch(0.78 0.14 155)" }}
                        >
                          Responded
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        data-ocid={`reputation.respond_button.${idx + 1}`}
                        onClick={() => setActiveReview(review)}
                        className="one-click-publish-btn flex items-center gap-1.5 text-xs"
                      >
                        <MessageCircle size={12} />
                        Respond
                      </button>
                    )}

                    {/* Recovery workflow for negative reviews */}
                    {isNegative && (
                      <button
                        type="button"
                        data-ocid={`reputation.recovery_button.${idx + 1}`}
                        onClick={() => onOpenRecovery(review)}
                        className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors"
                        style={{
                          background: "oklch(0.62 0.2 15 / 12%)",
                          border: "1px solid oklch(0.62 0.2 15 / 30%)",
                          color: "oklch(0.78 0.16 15)",
                        }}
                      >
                        <ShieldAlert size={11} />
                        Recovery Workflow
                      </button>
                    )}

                    {/* Social pipeline for positive reviews */}
                    {review.rating >= 4 && (
                      <button
                        type="button"
                        data-ocid={`reputation.share_social_button.${idx + 1}`}
                        onClick={() => onOpenSocialPipeline(review)}
                        className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors"
                        style={{
                          background: "oklch(0.58 0.22 290 / 10%)",
                          border: "1px solid oklch(0.58 0.22 290 / 25%)",
                          color: "oklch(0.78 0.16 290)",
                        }}
                      >
                        <Share2 size={11} />
                        Share as Social Proof
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Response drawer */}
      {activeReview && (
        <ResponseDrawer
          review={activeReview}
          onClose={() => setActiveReview(null)}
          onPublish={onPublish}
          onOpenRecovery={() => {
            onOpenRecovery(activeReview);
            setActiveReview(null);
          }}
        />
      )}
    </div>
  );
}

// ── Velocity Dashboard Tab ───────────────────────────────────────────────────

function VelocityDashboardTab({ reviews }: { reviews: ReviewSyncRecord[] }) {
  const velocityStats = DEMO_VELOCITY_STATS.find((v) =>
    reviews.some((r) => r.tenantId === v.tenantId),
  );

  if (!velocityStats) {
    return (
      <div
        className="card-dark rounded-xl p-12 text-center"
        data-ocid="velocity.empty_state"
      >
        <BarChart2
          size={40}
          className="mx-auto opacity-40 text-muted-foreground mb-3"
        />
        <p className="text-sm font-semibold text-white">
          No velocity data available
        </p>
      </div>
    );
  }

  const respondedCount = reviews.filter((r) => r.responsePublished).length;
  const responseRate =
    reviews.length > 0
      ? Math.round((respondedCount / reviews.length) * 100)
      : 0;
  const positivePct =
    reviews.length > 0
      ? Math.round(
          (reviews.filter((r) => r.sentiment === "positive").length /
            reviews.length) *
            100,
        )
      : 0;
  const goalProgress = Math.min(
    100,
    Math.round((velocityStats.reviewsLast30Days / 15) * 100),
  );

  const total =
    velocityStats.sentimentBreakdown.positive +
    velocityStats.sentimentBreakdown.neutral +
    velocityStats.sentimentBreakdown.negative;
  const sentPositivePct =
    total > 0
      ? Math.round((velocityStats.sentimentBreakdown.positive / total) * 100)
      : 0;
  const sentNeutralPct =
    total > 0
      ? Math.round((velocityStats.sentimentBreakdown.neutral / total) * 100)
      : 0;
  const sentNegativePct =
    total > 0
      ? Math.round((velocityStats.sentimentBreakdown.negative / total) * 100)
      : 0;

  const weeklyData = [
    { week: "Wk 1", count: 2 },
    { week: "Wk 2", count: 4 },
    { week: "Wk 3", count: 3 },
    { week: "Wk 4", count: 6 },
    { week: "Wk 5", count: 2 },
    { week: "Wk 6", count: 5 },
    { week: "Wk 7", count: 4 },
    { week: "Wk 8", count: velocityStats.reviewsLast7Days },
  ];
  const maxCount = Math.max(...weeklyData.map((d) => d.count), 1);
  const topReview = [...reviews]
    .filter((r) => r.rating === 5)
    .sort((a, b) => b.createdAt - a.createdAt)[0];
  const googleReviews = reviews.filter((r) => r.platform === "google");
  const yelpReviews = reviews.filter((r) => r.platform === "yelp");
  const fbReviews = reviews.filter((r) => r.platform === "facebook");

  function platformAvg(list: ReviewSyncRecord[]) {
    if (!list.length) return 0;
    return (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1);
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {responseRate < 70 && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{
            background: "oklch(0.72 0.18 75 / 12%)",
            border: "1px solid oklch(0.72 0.18 75 / 30%)",
          }}
          data-ocid="velocity.response_rate_alert"
        >
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-300">
              Response rate below 70%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enable auto-respond in Platform Connections to improve your
              response rate and boost trust signals.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            icon: <Star size={14} className="text-amber-400" />,
            label: "Avg Rating",
            value: velocityStats.avgRating.toFixed(1),
            sub: (
              <span className="flex items-center gap-0.5 text-emerald-400">
                <ArrowUp size={10} />
                0.2
              </span>
            ),
          },
          {
            icon: <Globe size={14} className="text-blue-400" />,
            label: "Total Reviews",
            value: velocityStats.totalReviews,
          },
          {
            icon: <TrendingUp size={14} className="text-purple-400" />,
            label: "This Week",
            value: `+${velocityStats.reviewsLast7Days}`,
          },
          {
            icon: <MessageCircle size={14} className="text-emerald-400" />,
            label: "Response Rate",
            value: `${responseRate}%`,
            sub:
              responseRate >= 70 ? (
                <span className="text-emerald-400 text-[10px]">Good</span>
              ) : (
                <span className="text-amber-400 text-[10px]">Needs work</span>
              ),
          },
          {
            icon: <CheckCircle size={14} className="text-teal-400" />,
            label: "Positive %",
            value: `${positivePct}%`,
          },
          {
            icon: <Target size={14} className="text-rose-400" />,
            label: "Monthly Goal",
            value: `${goalProgress}%`,
            sub: (
              <span className="text-xs text-muted-foreground">
                {velocityStats.reviewsLast30Days}/15
              </span>
            ),
          },
        ].map((stat) => (
          <div key={stat.label} className="card-dark rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              {stat.icon}
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-white leading-none">
              {stat.value}
            </p>
            {stat.sub && <div className="mt-1">{stat.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 card-dark rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-purple-400" />
            <span className="text-sm font-semibold text-white">
              Reviews per Week (8 weeks)
            </span>
          </div>
          <div
            className="flex items-end gap-2 h-36"
            data-ocid="velocity.bar_chart"
          >
            {weeklyData.map((d) => {
              const pct = (d.count / maxCount) * 100;
              return (
                <div
                  key={d.week}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <span className="text-[10px] text-muted-foreground">
                    {d.count}
                  </span>
                  <div
                    className="velocity-graph w-full rounded-t-md overflow-hidden"
                    style={{
                      height: "96px",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <div
                      className="velocity-bar w-full rounded-t-md"
                      style={{ height: `${pct}%`, minHeight: "4px" }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {d.week}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 card-dark rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} className="text-purple-400" />
            <span className="text-sm font-semibold text-white">
              Sentiment Distribution
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(
                  oklch(0.62 0.18 155) 0deg ${sentPositivePct * 3.6}deg,
                  oklch(0.6 0.18 240) ${sentPositivePct * 3.6}deg ${(sentPositivePct + sentNeutralPct) * 3.6}deg,
                  oklch(0.62 0.2 15) ${(sentPositivePct + sentNeutralPct) * 3.6}deg 360deg
                )`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.14 0.014 280)" }}
              >
                <span className="text-sm font-bold text-white">
                  {sentPositivePct}%
                </span>
              </div>
            </div>
            <div className="space-y-1.5 w-full">
              {[
                {
                  label: "Positive",
                  pct: sentPositivePct,
                  color: "oklch(0.62 0.18 155)",
                },
                {
                  label: "Neutral",
                  pct: sentNeutralPct,
                  color: "oklch(0.6 0.18 240)",
                },
                {
                  label: "Negative",
                  pct: sentNegativePct,
                  color: "oklch(0.62 0.2 15)",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-xs text-muted-foreground flex-1">
                    {item.label}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {item.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            platform: "google",
            reviews: googleReviews,
            color: "oklch(0.58 0.22 25)",
          },
          {
            platform: "yelp",
            reviews: yelpReviews,
            color: "oklch(0.72 0.18 75)",
          },
          {
            platform: "facebook",
            reviews: fbReviews,
            color: "oklch(0.6 0.18 240)",
          },
        ].map(({ platform, reviews: pReviews, color }) => {
          const pending = pReviews.filter((r) => !r.responsePublished).length;
          return (
            <div
              key={platform}
              className="card-dark rounded-xl p-4"
              data-ocid={`velocity.platform.${platform}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`review-source-badge review-source-${platform} text-sm`}
                >
                  <span className="font-bold mr-1">
                    {PLATFORM_LETTER[platform as ReviewPlatform]}
                  </span>
                  {PLATFORM_LABELS[platform as ReviewPlatform]}
                </span>
                {pending > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full badge-amber">
                    {pending} pending
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total reviews</span>
                  <span className="font-semibold text-white">
                    {pReviews.length}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg rating</span>
                  <span className="font-semibold text-white">
                    {pReviews.length > 0 ? platformAvg(pReviews) : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Responded</span>
                  <span
                    className={`font-semibold ${pending === 0 ? "text-emerald-400" : "text-amber-400"}`}
                  >
                    {pReviews.length - pending}/{pReviews.length}
                  </span>
                </div>
                <div className="mt-2 velocity-graph h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width:
                        pReviews.length > 0
                          ? `${((pReviews.length - pending) / pReviews.length) * 100}%`
                          : "0%",
                      background: color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {topReview && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "oklch(0.62 0.18 155 / 8%)",
            border: "1px solid oklch(0.62 0.18 155 / 25%)",
          }}
          data-ocid="velocity.top_review"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-white uppercase tracking-wide">
              Top Review This Month
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold text-white">
                  {topReview.reviewerName}
                </span>
                <PlatformBadge platform={topReview.platform} />
                <StarRating rating={topReview.rating} />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {topReview.comment}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Platform Connections Tab ─────────────────────────────────────────────────

function PlatformConnectionsTab() {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [yelpKey, setYelpKey] = useState("");
  const [fbConnected, setFbConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFreq, setSyncFreq] = useState("24h");
  const [autoRequest, setAutoRequest] = useState(false);
  const [requestDelay, setRequestDelay] = useState("1h");
  const [requestPlatform, setRequestPlatform] =
    useState<ReviewPlatform>("google");
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);

  function handleConnect(platform: string) {
    toast.info(`Redirecting to ${platform} OAuth…`, {
      description: "You'll be redirected to authorize the connection.",
    });
    setTimeout(() => {
      if (platform === "Google Business Profile") setGoogleConnected(true);
      if (platform === "Facebook Page") setFbConnected(true);
      toast.success(`${platform} connected!`);
    }, 1500);
  }

  function handleTestConnection(platform: string) {
    setTestingPlatform(platform);
    setTimeout(() => {
      setTestingPlatform(null);
      toast.success(`${platform} connection test passed!`, {
        description: "API is responding normally.",
      });
    }, 1400);
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white">
          Platform Connections
        </h3>
        {[
          {
            id: "google",
            name: "Google Business Profile",
            icon: (
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  background: "oklch(0.58 0.22 25 / 20%)",
                  color: "oklch(0.78 0.16 25)",
                }}
              >
                G
              </span>
            ),
            connected: googleConnected,
            lastSync: googleConnected ? "2 minutes ago" : null,
            onConnect: () => handleConnect("Google Business Profile"),
            onDisconnect: () => setGoogleConnected(false),
          },
          {
            id: "yelp",
            name: "Yelp for Business",
            icon: (
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  background: "oklch(0.72 0.18 75 / 20%)",
                  color: "oklch(0.82 0.14 75)",
                }}
              >
                Y
              </span>
            ),
            connected: yelpKey.length > 0,
            lastSync: yelpKey.length > 0 ? "5 minutes ago" : null,
            isApiKey: true,
          },
          {
            id: "facebook",
            name: "Facebook Page",
            icon: (
              <Facebook size={18} style={{ color: "oklch(0.76 0.14 240)" }} />
            ),
            connected: fbConnected,
            lastSync: fbConnected ? "3 minutes ago" : null,
            onConnect: () => handleConnect("Facebook Page"),
            onDisconnect: () => setFbConnected(false),
          },
        ].map((p) => (
          <div
            key={p.id}
            className="card-dark rounded-xl p-5"
            data-ocid={`platform.${p.id}_card`}
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    {p.lastSync && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Last sync: {p.lastSync}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.connected ? "badge-emerald" : "badge-rose"}`}
                    >
                      {p.connected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                </div>
                {p.isApiKey ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={yelpKey}
                        onChange={(e) => setYelpKey(e.target.value)}
                        placeholder="Enter your Yelp API key"
                        data-ocid="platform.yelp_api_key_input"
                        className="flex-1 qa-reply-textarea rounded-lg px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (yelpKey) toast.success("Yelp API key saved!");
                        }}
                        data-ocid="platform.yelp_save_button"
                        className="one-click-publish-btn text-xs px-3 py-2"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {p.connected ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            toast.info("Manual sync started…");
                            setTimeout(
                              () => toast.success("Sync complete!"),
                              1500,
                            );
                          }}
                          data-ocid={`platform.${p.id}_sync_button`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{
                            background: "oklch(0.18 0.016 280)",
                            border: "1px solid oklch(1 0 0 / 10%)",
                            color: "oklch(0.88 0.01 280)",
                          }}
                        >
                          <RefreshCw size={11} />
                          Sync now
                        </button>
                        <button
                          type="button"
                          onClick={p.onDisconnect}
                          data-ocid={`platform.${p.id}_disconnect_button`}
                          className="text-xs px-3 py-1.5 rounded-lg text-rose-400 transition-colors hover:bg-rose-400/10"
                          style={{
                            border: "1px solid oklch(0.62 0.2 15 / 30%)",
                          }}
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={p.onConnect}
                        data-ocid={`platform.${p.id}_connect_button`}
                        className="flex items-center gap-1.5 one-click-publish-btn text-xs"
                      >
                        <Link2 size={11} />
                        Connect with OAuth
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleTestConnection(p.name)}
                      data-ocid={`platform.${p.id}_test_button`}
                      disabled={testingPlatform === p.name}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                      style={{ border: "1px solid oklch(1 0 0 / 10%)" }}
                    >
                      {testingPlatform === p.name ? (
                        <span className="flex items-center gap-1">
                          <Loader2 size={10} className="animate-spin" />
                          Testing…
                        </span>
                      ) : (
                        "Test Connection"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-dark rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Settings2 size={15} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-white">
            Auto-Sync Settings
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Daily sync</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically pull new reviews on a schedule
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoSync(!autoSync)}
            data-ocid="platform.auto_sync_toggle"
            role="switch"
            aria-checked={autoSync}
            className={`w-10 h-5 rounded-full transition-all relative ${autoSync ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${autoSync ? "left-5" : "left-0.5"}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-white">Sync frequency</p>
          <select
            value={syncFreq}
            onChange={(e) => setSyncFreq(e.target.value)}
            data-ocid="platform.sync_frequency_select"
            className="text-xs px-3 py-1.5 rounded-lg text-foreground cursor-pointer"
            style={{
              background: "oklch(0.18 0.016 280)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            <option value="6h">Every 6 hours</option>
            <option value="12h">Every 12 hours</option>
            <option value="24h">Every 24 hours</option>
          </select>
        </div>
        <div
          className="flex items-center gap-2 text-xs text-muted-foreground rounded-lg px-3 py-2"
          style={{ background: "oklch(0.11 0.012 280)" }}
        >
          <CheckCircle size={12} className="text-emerald-400 shrink-0" />
          Last sync completed 2 minutes ago — all platforms up to date
        </div>
      </div>

      <div className="card-dark rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-white">
            Review Request Automation
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Auto-request on job completion</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send review request when a job is marked complete in CRM
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoRequest(!autoRequest)}
            data-ocid="platform.auto_request_toggle"
            role="switch"
            aria-checked={autoRequest}
            className={`w-10 h-5 rounded-full transition-all relative ${autoRequest ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${autoRequest ? "left-5" : "left-0.5"}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-white">Request delay</p>
          <select
            value={requestDelay}
            onChange={(e) => setRequestDelay(e.target.value)}
            data-ocid="platform.request_delay_select"
            className="text-xs px-3 py-1.5 rounded-lg text-foreground cursor-pointer"
            style={{
              background: "oklch(0.18 0.016 280)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            <option value="immediate">Immediately</option>
            <option value="1h">1 hour after</option>
            <option value="24h">24 hours after</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-white">Preferred platform</p>
          <select
            value={requestPlatform}
            onChange={(e) =>
              setRequestPlatform(e.target.value as ReviewPlatform)
            }
            data-ocid="platform.preferred_platform_select"
            className="text-xs px-3 py-1.5 rounded-lg text-foreground cursor-pointer"
            style={{
              background: "oklch(0.18 0.016 280)",
              border: "1px solid oklch(1 0 0 / 10%)",
            }}
          >
            <option value="google">Google</option>
            <option value="yelp">Yelp</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
        <div
          className="rounded-lg px-3 py-2.5 text-xs"
          style={{
            background: "oklch(0.72 0.18 75 / 10%)",
            border: "1px solid oklch(0.72 0.18 75 / 20%)",
          }}
        >
          <p className="font-medium text-amber-300 mb-1 flex items-center gap-1.5">
            <AlertTriangle size={11} />
            Suppression Note
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Review requests are automatically suppressed for customers who have
            already left a review in the last 90 days, customers who have
            unsubscribed, and any phone numbers on the suppression list.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

type TabKey = "inbox" | "velocity" | "connections";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "inbox", label: "Unified Inbox", icon: <MessageCircle size={14} /> },
  {
    key: "velocity",
    label: "Velocity Dashboard",
    icon: <BarChart2 size={14} />,
  },
  {
    key: "connections",
    label: "Platform Connections",
    icon: <Link2 size={14} />,
  },
];

export default function ReputationInboxPage() {
  const { currentTenantId } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>("inbox");
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());
  const [recoveryReview, setRecoveryReview] = useState<ReviewSyncRecord | null>(
    null,
  );
  const [socialPipelineReview, setSocialPipelineReview] =
    useState<ReviewSyncRecord | null>(null);

  const reviews = DEMO_REVIEW_SYNC_RECORDS.filter(
    (r) => r.tenantId === currentTenantId,
  );

  const velocityStats = DEMO_VELOCITY_STATS.find(
    (v) => v.tenantId === currentTenantId,
  );

  const pendingCount = reviews.filter(
    (r) => !r.responsePublished && !publishedIds.has(r.id),
  ).length;

  const negativeCount = reviews.filter(
    (r) => r.rating <= 2 && !r.responsePublished,
  ).length;

  function handlePublish(id: string, _text: string) {
    setPublishedIds((prev) => new Set(prev).add(id));
  }

  function handleSyncAll() {
    toast.info("Syncing reviews from all platforms…", {
      description: "Google, Yelp, and Facebook will be updated.",
    });
    setTimeout(
      () => toast.success("Sync complete! All reviews up to date."),
      2000,
    );
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Reputation Inbox</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Reputation management, recovery, and social proof — all in one place
          </p>
        </div>
        <div className="flex items-center gap-2">
          {negativeCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full font-bold badge-rose animate-pulse flex items-center gap-1.5">
              <ShieldAlert size={12} />
              {negativeCount} need{negativeCount === 1 ? "s" : ""} recovery
            </span>
          )}
          {pendingCount > 0 && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium badge-amber">
              {pendingCount} pending
            </span>
          )}
          <button
            type="button"
            onClick={handleSyncAll}
            data-ocid="reputation.sync_button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors text-sm"
            style={{ border: "1px solid oklch(1 0 0 / 10%)" }}
          >
            <RefreshCw size={14} />
            Sync All
          </button>
        </div>
      </div>

      {/* Alerts panel */}
      <ReputationAlertsPanel
        tenantId={currentTenantId}
        onOpenRecovery={() => {
          const firstNegative = reviews.find((r) => r.rating <= 2);
          setRecoveryReview(firstNegative ?? reviews[0] ?? null);
        }}
      />

      {/* Competitor panel */}
      <CompetitorReviewPanel tenantId={currentTenantId} />

      {/* Quick stats strip */}
      {velocityStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: <Star size={13} className="text-amber-400" />,
              label: "Avg Rating",
              value: velocityStats.avgRating.toFixed(1),
              trend: <ArrowUp size={10} className="text-emerald-400" />,
            },
            {
              icon: <Globe size={13} className="text-blue-400" />,
              label: "Total Reviews",
              value: velocityStats.totalReviews,
            },
            {
              icon: <TrendingUp size={13} className="text-purple-400" />,
              label: "Last 30 Days",
              value: `+${velocityStats.reviewsLast30Days}`,
            },
            {
              icon: <CheckCircle size={13} className="text-emerald-400" />,
              label: "Response Rate",
              value: `${velocityStats.responseRate}%`,
              trend:
                velocityStats.responseRate >= 70 ? (
                  <ArrowUp size={10} className="text-emerald-400" />
                ) : (
                  <ArrowDown size={10} className="text-rose-400" />
                ),
            },
          ].map((s) => (
            <div key={s.label} className="card-dark rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-1">
                {s.icon}
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                {s.trend}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response progress bar */}
      <div className="card-dark rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">
            Response Progress
          </span>
          <span className="text-xs text-muted-foreground">
            {reviews.length - pendingCount} of {reviews.length} responded
          </span>
        </div>
        <div className="velocity-graph h-2.5 overflow-hidden">
          <div
            className="velocity-bar"
            style={{
              width:
                reviews.length > 0
                  ? `${((reviews.length - pendingCount) / reviews.length) * 100}%`
                  : "0%",
            }}
          />
        </div>
        {pendingCount > 0 && (
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
            <AlertTriangle size={11} />
            {pendingCount} review{pendingCount !== 1 ? "s" : ""} awaiting
            response
          </p>
        )}
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{
          background: "oklch(0.11 0.012 280)",
          border: "1px solid oklch(1 0 0 / 8%)",
        }}
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            data-ocid={`reputation.tab.${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {activeTab === "inbox" && (
          <UnifiedInboxTab
            reviews={reviews}
            publishedIds={publishedIds}
            onPublish={handlePublish}
            onOpenRecovery={(review) => setRecoveryReview(review)}
            onOpenSocialPipeline={(review) => setSocialPipelineReview(review)}
          />
        )}
        {activeTab === "velocity" && <VelocityDashboardTab reviews={reviews} />}
        {activeTab === "connections" && <PlatformConnectionsTab />}
      </div>

      {/* Recovery Workflow Drawer */}
      <RecoveryWorkflowDrawer
        review={recoveryReview}
        tenantId={currentTenantId}
        onClose={() => setRecoveryReview(null)}
      />

      {/* Review-to-Social Pipeline */}
      <ReviewToSocialPipeline
        review={socialPipelineReview}
        tenantId={currentTenantId}
        onClose={() => setSocialPipelineReview(null)}
      />
    </div>
  );
}
