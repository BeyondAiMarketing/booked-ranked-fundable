import { CalendarCheck, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ReviewSyncRecord } from "../../types/reputationSync";
import type { SocialPost } from "../../types/socialMedia";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// ── Types ────────────────────────────────────────────────────────────────────

interface ReputationToSocialModalProps {
  review: ReviewSyncRecord;
  tenantId: string;
  onClose: () => void;
  onConfirm: (
    post: Omit<
      SocialPost,
      "id" | "createdAt" | "engagementMetrics" | "publishedAt"
    >,
  ) => void;
}

const PLATFORM_OPTIONS = [
  { key: "facebook", label: "Facebook", colorClass: "text-blue-400" },
  { key: "instagram", label: "Instagram", colorClass: "text-amber-400" },
  {
    key: "google_business",
    label: "Google Business",
    colorClass: "text-rose-400",
  },
] as const;

type PlatformKey = (typeof PLATFORM_OPTIONS)[number]["key"];

// ── Hormozi value-stack formatter ─────────────────────────────────────────────

function buildHormoziPost(review: ReviewSyncRecord): string {
  const reviewer = review.reviewerName ?? "A recent client";
  const anonymized = review.rating >= 5 ? reviewer : "A recent client";
  const stars = "⭐".repeat(Math.min(review.rating, 5));

  return `${stars} What a ${review.rating === 5 ? "win" : "result"}!

"${review.comment}"
— ${anonymized}

Here's what they actually received:
✅ Expert service delivered on time
✅ Transparent pricing — no surprises  
✅ Backed by our satisfaction guarantee
✅ A team that treats your property like their own

This is the standard we hold on every job. Not a one-off — this is what we do, every day.

Ready for results like these? Click the link in our bio or DM us to get started.

#ClientWin #5StarReview #LocalBusiness #Verified`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReputationToSocialModal({
  review,
  tenantId,
  onClose,
  onConfirm,
}: ReputationToSocialModalProps) {
  const [draft, setDraft] = useState(() => buildHormoziPost(review));
  const [generating, setGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformKey>>(
    new Set(["facebook", "instagram"]),
  );

  function togglePlatform(key: PlatformKey) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleRegenerate() {
    setGenerating(true);
    setTimeout(() => {
      const variants = [
        buildHormoziPost(review),
        `The kind of review that makes everything worth it 🙌\n\n"${review.comment}"\n\n— ${review.reviewerName ?? "A happy client"} ${"⭐".repeat(review.rating)}\n\nThis is why we do what we do. Every call answered. Every job done right. Every client treated like family.\n\nIf you're looking for this kind of service — we'd love to help you next.\n\n#ClientLove #ServiceExcellence #TrustedLocally`,
        `Real results from a real client:\n\n"${review.comment}"\n\nThis is what we deliver — not promises, but proof.\n\n${"⭐".repeat(review.rating)} from ${review.reviewerName ?? "a satisfied client"}\n\nReady for your own results? Book a call today.\n\n#RealResults #LocalExperts #ProvenService`,
      ];
      const current = variants.indexOf(draft);
      setDraft(variants[(current + 1) % variants.length]);
      setGenerating(false);
    }, 1200);
  }

  function handleConfirm() {
    if (selectedPlatforms.size === 0) {
      toast.error("Select at least one platform");
      return;
    }
    onConfirm({
      tenantId,
      content: draft,
      platforms: [...selectedPlatforms],
      scheduledAt: null,
      status: "draft",
      funnelStage: "mofu",
      marketingFramework: "hormozi_value_stack",
      ctaType: "booking",
      ctaUrl: "",
      beforeAfterPhoto: null,
      niche: "general",
      tags: ["review", "social-proof", "client-win"],
    });
    toast.success("Review post added to content calendar as MOFU draft");
    onClose();
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
      />

      {/* Modal */}
      <dialog
        open
        aria-label="Share review as social proof post"
        data-ocid="reputation.share_social.dialog"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none bg-transparent border-none"
      >
        <div
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Share as Social Proof Post
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-ocid="reputation.share_social.close_button"
              aria-label="Close"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Original review excerpt */}
            <div className="bg-muted/30 border border-border rounded-xl p-3 space-y-1">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                Source review — {review.rating}★ {review.reviewerName}
              </p>
              <p className="text-xs text-foreground/80 line-clamp-2 italic">
                "{review.comment}"
              </p>
            </div>

            {/* Platform toggles */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Publish to
              </p>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    data-ocid={`reputation.share_social.${p.key}.toggle`}
                    onClick={() => togglePlatform(p.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedPlatforms.has(p.key)
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Post editor */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Sparkles size={11} className="text-primary" />
                  AI-Drafted Post — Hormozi Value Stack
                </p>
                <button
                  type="button"
                  data-ocid="reputation.share_social.regenerate.button"
                  onClick={handleRegenerate}
                  disabled={generating}
                  className="text-[11px] px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    "Regenerate"
                  )}
                </button>
              </div>
              <Textarea
                data-ocid="reputation.share_social.post.textarea"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="text-xs min-h-[160px] bg-background"
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {draft.length} characters · MOFU draft
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 px-5 py-4 border-t border-border">
            <Button
              variant="outline"
              data-ocid="reputation.share_social.cancel_button"
              onClick={onClose}
              size="sm"
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              data-ocid="reputation.share_social.confirm_button"
              onClick={handleConfirm}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs ml-auto"
            >
              <CalendarCheck size={12} className="mr-1.5" />
              Add to Calendar as Draft
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
