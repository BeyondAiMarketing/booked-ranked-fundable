import {
  Award,
  Calendar,
  CheckCircle2,
  Layers,
  Loader2,
  Send,
  Share2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ReviewSyncRecord } from "../../types/reputationSync";

// ── Platform configs ───────────────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    color: "oklch(0.72 0.22 345)",
    bg: "oklch(0.72 0.22 345 / 12%)",
    border: "oklch(0.72 0.22 345 / 30%)",
    format: "Short quote card — 3 lines max. Hook first, then quote, then CTA.",
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "oklch(0.6 0.18 240)",
    bg: "oklch(0.6 0.18 240 / 12%)",
    border: "oklch(0.6 0.18 240 / 30%)",
    format: "Full story format with context, quote, and strong CTA.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "oklch(0.58 0.16 220)",
    bg: "oklch(0.58 0.16 220 / 12%)",
    border: "oklch(0.58 0.16 220 / 30%)",
    format: "Professional testimonial post with business context and value.",
  },
  {
    id: "google",
    label: "Google Business",
    color: "oklch(0.62 0.18 155)",
    bg: "oklch(0.62 0.18 155 / 12%)",
    border: "oklch(0.62 0.18 155 / 30%)",
    format: "Highlight the 5-star for SEO. Short, specific, and local.",
  },
];

// ── Generate niche post content ────────────────────────────────────────────────

function generatePostContent(
  platform: string,
  review: ReviewSyncRecord,
  niche: string,
): string {
  const name = review.reviewerName;
  const quote =
    review.comment.slice(0, 120) + (review.comment.length > 120 ? "…" : "");

  const nicheHashtags: Record<string, string> = {
    plumbing: "#Plumber #PlumbingServices #LocalPlumber #HomeRepair",
    "med-spa": "#MedSpa #Aesthetics #SkinCare #MedicalAesthetics",
    hvac: "#HVAC #AirConditioning #HeatingCooling #LocalHVAC",
    restoration: "#WaterDamage #Restoration #PropertyRepair #EmergencyServices",
    roofing: "#Roofing #RoofRepair #LocalRoofer #Contractor",
    "carpet-cleaning": "#CarpetCleaning #CleanHome #FloorCare #LocalCleaning",
    "real-estate": "#RealEstate #HomeForSale #Realtor #LocalRealEstate",
    mortgage: "#Mortgage #HomeLoan #MortgageBroker #HomeOwner",
    chiropractic: "#Chiropractic #BackPain #ChiropracticCare #LocalChiro",
    dental: "#Dentist #DentalCare #SmileMore #LocalDentist",
  };

  const tags = nicheHashtags[niche] ?? "#LocalBusiness #5StarReview";

  if (platform === "instagram") {
    return `⭐⭐⭐⭐⭐ Another 5-star win.\n\n"${quote}"\n— ${name}\n\nThis is what we show up to do every single day. DM us or tap the link in bio.\n\n${tags} #ClientWin #SocialProof`;
  }
  if (platform === "facebook") {
    return `We just received this incredible review from ${name} and we had to share it:\n\n"${review.comment}"\n\nThis is exactly why we do what we do — real results for real people in this community. If you're ready for the same experience, click below to get started.\n\n${tags}`;
  }
  if (platform === "linkedin") {
    return `Client Success Story:\n\n${name} recently shared their experience working with us:\n\n"${quote}"\n\nThis kind of feedback drives everything we do. We're committed to delivering measurable results for every client — and this is proof it's working.\n\nIf you know someone who could benefit from what we do, send them our way.\n\n${tags}`;
  }
  if (platform === "google") {
    return `🌟 5-Star Review — ${name}: "${quote}"\n\nThank you to all our amazing clients who take the time to share their experiences. We're proud to serve this community.\n\n${tags}`;
  }
  return quote;
}

// ── Social Proof Leaderboard ───────────────────────────────────────────────────

const DEMO_LEADERBOARD = [
  { reviewer: "Marcus Webb", platform: "google", engagements: 847, leads: 12 },
  {
    reviewer: "Sofia Delgado",
    platform: "facebook",
    engagements: 634,
    leads: 8,
  },
  {
    reviewer: "Amanda Torres",
    platform: "instagram",
    engagements: 1203,
    leads: 19,
  },
  { reviewer: "Jordan Kim", platform: "google", engagements: 412, leads: 5 },
  { reviewer: "Rachel Chen", platform: "linkedin", engagements: 289, leads: 7 },
];

function SocialProofLeaderboard() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "oklch(0.58 0.22 290 / 8%)",
          borderBottom: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <Award size={13} className="text-purple-400" />
        <span className="text-xs font-semibold text-white">
          Social Proof Leaderboard
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          Top reviews by engagement
        </span>
      </div>
      <div data-ocid="social_pipeline.leaderboard">
        {DEMO_LEADERBOARD.map((entry, i) => (
          <div
            key={entry.reviewer}
            data-ocid={`social_pipeline.leaderboard.item.${i + 1}`}
            className="flex items-center gap-3 px-4 py-2.5"
            style={{
              borderBottom:
                i < DEMO_LEADERBOARD.length - 1
                  ? "1px solid oklch(1 0 0 / 5%)"
                  : undefined,
              background: i === 0 ? "oklch(0.72 0.18 55 / 5%)" : "transparent",
            }}
          >
            <span
              className={`text-xs font-bold w-5 ${i === 0 ? "text-amber-400" : "text-muted-foreground"}`}
            >
              #{i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {entry.reviewer}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize">
                {entry.platform}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-white">
                {entry.engagements.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400">
                {entry.leads} leads
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Auto-flow toggle ───────────────────────────────────────────────────────────

function AutoFlowToggle() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div
      className="rounded-xl p-3.5 flex items-center justify-between"
      style={{
        background: "oklch(0.16 0.014 280)",
        border: "1px solid oklch(1 0 0 / 8%)",
      }}
    >
      <div>
        <p className="text-xs font-semibold text-white">
          Auto-Generate Social Posts for Every 5-Star Review
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          New 5-star reviews automatically generate all 4 platform posts. Admin
          approval required before publishing.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          setEnabled(!enabled);
          toast.success(
            enabled
              ? "Auto-flow paused"
              : "Auto-flow enabled — 5-star reviews will generate social posts automatically!",
          );
        }}
        role="switch"
        aria-checked={enabled}
        data-ocid="social_pipeline.auto_flow_toggle"
        className={`w-10 h-5 rounded-full transition-all relative shrink-0 ml-3 ${enabled ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${enabled ? "left-5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

// ── Post Preview Card ──────────────────────────────────────────────────────────

function PostPreviewCard({
  platform,
  review,
  niche,
  scheduled,
  onSchedule,
}: {
  platform: (typeof SOCIAL_PLATFORMS)[0];
  review: ReviewSyncRecord;
  niche: string;
  scheduled: boolean;
  onSchedule: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [content, setContent] = useState("");

  function generate() {
    setGenerating(true);
    setTimeout(() => {
      setContent(generatePostContent(platform.id, review, niche));
      setGenerating(false);
      setGenerated(true);
    }, 800);
  }

  return (
    <div
      className="rounded-xl p-3.5 space-y-2.5"
      style={{
        background: platform.bg,
        border: `1px solid ${platform.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: platform.color }}>
            {platform.label}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {platform.format}
          </span>
        </div>
        {scheduled && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
            style={{
              background: "oklch(0.62 0.18 155 / 15%)",
              color: "oklch(0.78 0.14 155)",
            }}
          >
            Scheduled ✓
          </span>
        )}
      </div>

      {generated && content ? (
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            data-ocid={`social_pipeline.post_editor.${platform.id}`}
            className="w-full text-xs p-2 rounded-lg resize-none leading-relaxed"
            style={{
              background: "oklch(0.12 0.012 280)",
              border: "1px solid oklch(1 0 0 / 8%)",
              color: "oklch(0.9 0.01 280)",
            }}
          />
          <div className="flex items-center gap-1.5 mt-1">
            <Sparkles size={10} className="text-purple-400" />
            <span className="text-[10px] text-muted-foreground">
              Hopkins "Reason Why" — social proof + specific result
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={generate}
          data-ocid={`social_pipeline.generate.${platform.id}`}
          disabled={generating}
          className="w-full text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          style={{
            background: "oklch(0.12 0.012 280)",
            border: "1px solid oklch(1 0 0 / 8%)",
            color: "oklch(0.76 0.12 290)",
          }}
        >
          {generating ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Sparkles size={11} />
          )}
          {generating ? "Generating…" : "Generate Post"}
        </button>
      )}

      {generated && !scheduled && (
        <button
          type="button"
          onClick={onSchedule}
          data-ocid={`social_pipeline.schedule.${platform.id}`}
          className="w-full text-xs py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-colors"
          style={{
            background: platform.bg,
            color: platform.color,
            border: `1px solid ${platform.border}`,
          }}
        >
          <Calendar size={11} />
          Schedule to {platform.label}
        </button>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface ReviewToSocialPipelineProps {
  review: ReviewSyncRecord | null;
  tenantId: string;
  onClose: () => void;
}

function getNiche(tenantId: string): string {
  const map: Record<string, string> = {
    "tenant-oceanside": "plumbing",
    "tenant-glow": "med-spa",
    "tenant-arctic": "hvac",
    "tenant-demo": "roofing",
  };
  return map[tenantId] ?? "roofing";
}

export default function ReviewToSocialPipeline({
  review,
  tenantId,
  onClose,
}: ReviewToSocialPipelineProps) {
  const [scheduledPlatforms, setScheduledPlatforms] = useState<Set<string>>(
    new Set(),
  );
  const [schedulingAll, setSchedulingAll] = useState(false);
  const [allScheduled, setAllScheduled] = useState(false);
  const niche = getNiche(tenantId);

  if (!review) return null;

  function scheduleOne(platformId: string) {
    setScheduledPlatforms((prev) => new Set(prev).add(platformId));
    toast.success(`Scheduled to ${platformId}!`, {
      description: "Added to your social calendar with staggered dates.",
    });
  }

  function scheduleAll() {
    setSchedulingAll(true);
    setTimeout(() => {
      setScheduledPlatforms(new Set(SOCIAL_PLATFORMS.map((p) => p.id)));
      setSchedulingAll(false);
      setAllScheduled(true);
      toast.success("Scheduled to all 4 platforms!", {
        description: "Posts staggered over the next 4 days for maximum reach.",
      });
    }, 1400);
  }

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
        open
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl flex flex-col overflow-hidden p-0 m-0"
        style={{
          background: "oklch(0.13 0.016 280)",
          borderLeft: "1px solid oklch(1 0 0 / 10%)",
        }}
        data-ocid="social_pipeline.dialog"
        aria-label="Review to Social Pipeline"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <div className="flex items-center gap-3">
            <Share2 size={15} className="text-purple-400" />
            <div>
              <p className="text-sm font-bold text-white">
                Turn Review Into Social Proof
              </p>
              <p className="text-xs text-muted-foreground">
                {review.reviewerName} • {review.rating}★ • {review.platform}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-ocid="social_pipeline.close_button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Sugarman hook */}
          <div
            className="rounded-xl p-3.5"
            style={{
              background: "oklch(0.72 0.18 55 / 8%)",
              border: "1px solid oklch(0.72 0.18 55 / 20%)",
            }}
          >
            <p className="text-xs text-amber-200 leading-relaxed italic">
              "That 5-star review from {review.reviewerName} is worth more as
              social proof than any ad you'll run this week. People don't
              believe what you say about yourself — they believe what{" "}
              {review.reviewerName} says."
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              — Sugarman Slippery Slope principle applied to social sharing
            </p>
          </div>

          {/* Original review */}
          <div
            className="rounded-xl p-3.5"
            style={{
              background: "oklch(0.62 0.18 155 / 8%)",
              border: "1px solid oklch(0.62 0.18 155 / 20%)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-xs font-semibold text-white">
                Source Review
              </span>
            </div>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              "{review.comment}"
            </p>
            <p className="text-xs text-white font-medium mt-2">
              — {review.reviewerName}
            </p>
          </div>

          {/* Schedule all */}
          <button
            type="button"
            onClick={scheduleAll}
            data-ocid="social_pipeline.schedule_all_button"
            disabled={schedulingAll || allScheduled}
            className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            style={{
              background: "oklch(0.58 0.22 290 / 20%)",
              color: "oklch(0.78 0.16 290)",
              border: "1px solid oklch(0.58 0.22 290 / 30%)",
            }}
          >
            {schedulingAll ? (
              <Loader2 size={15} className="animate-spin" />
            ) : allScheduled ? (
              <CheckCircle2 size={15} />
            ) : (
              <Layers size={15} />
            )}
            {schedulingAll
              ? "Scheduling all platforms…"
              : allScheduled
                ? "All 4 Platforms Scheduled ✓"
                : "Schedule All 4 Platforms"}
          </button>

          {/* Platform cards */}
          <div className="space-y-3" data-ocid="social_pipeline.platforms">
            {SOCIAL_PLATFORMS.map((platform) => (
              <PostPreviewCard
                key={platform.id}
                platform={platform}
                review={review}
                niche={niche}
                scheduled={scheduledPlatforms.has(platform.id)}
                onSchedule={() => scheduleOne(platform.id)}
              />
            ))}
          </div>

          {/* Leaderboard */}
          <SocialProofLeaderboard />

          {/* Auto-flow */}
          <AutoFlowToggle />

          {scheduledPlatforms.size > 0 && (
            <div
              className="rounded-xl p-3.5 flex items-center gap-3"
              style={{
                background: "oklch(0.62 0.18 155 / 10%)",
                border: "1px solid oklch(0.62 0.18 155 / 25%)",
              }}
            >
              <Send size={13} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">
                  {scheduledPlatforms.size} platform
                  {scheduledPlatforms.size > 1 ? "s" : ""} queued
                </p>
                <p className="text-xs text-muted-foreground">
                  Posts staggered across the next 4 days for maximum organic
                  reach.
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className="px-5 py-3 shrink-0"
          style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <button
            type="button"
            onClick={onClose}
            data-ocid="social_pipeline.done_button"
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            style={{
              background: "oklch(0.16 0.014 280)",
              color: "oklch(0.88 0.01 280)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
          >
            Done
          </button>
        </div>
      </dialog>
    </>
  );
}
