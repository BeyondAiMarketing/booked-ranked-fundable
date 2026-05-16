import type { HomepageNicheData } from "@/data/homepageNicheData";
import {
  CheckCircle2,
  MessageSquare,
  Share2,
  Star,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  nicheData: HomepageNicheData;
  /** When true, use generic neutral content — no niche-specific copy */
  isNeutral?: boolean;
}

interface SocialPost {
  content: string;
  platform: "facebook" | "instagram" | "google";
  likes: number;
  comments: number;
  targetLikes: number;
  targetComments: number;
}

// ─── Neutral fallback data ────────────────────────────────────────────────────

const NEUTRAL_REVIEW = {
  reviewerName: "Sarah M.",
  reviewText:
    "Best service I've ever had. They showed up on time, explained everything clearly, and got the job done right. Highly recommend!",
  aiReviewResponse:
    "Thank you so much, Sarah! We truly appreciate you taking the time to share your experience. Delivering reliable, quality service is what we're all about — we look forward to serving you again!",
  socialPostExamples: [
    "Another happy customer! We're committed to 5-star service on every job. Thank you for trusting us. ⭐⭐⭐⭐⭐",
    "What makes a great service experience? On-time arrival, clear communication, and a job done right the first time.",
    "Your reviews mean the world to us — here's why every piece of feedback makes our team better.",
  ] as [string, string, string],
  leadName: "James T.",
  leadPhone: "(555) 400-1234",
  testimonial: {
    quote:
      "BRF automatically responds to every review and turns our 5-star feedback into social posts. We've seen a 40% increase in inbound calls since we started.",
    author: "Maria G.",
    role: "Owner, Local Service Business",
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CYCLE_DURATION = 15000;

const PLATFORM_COLORS = {
  facebook: "text-blue-400",
  instagram: "text-pink-400",
  google: "text-emerald-400",
};

const PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google",
};

function buildSocialPosts(examples: string[]): SocialPost[] {
  const platforms: Array<"facebook" | "instagram" | "google"> = [
    "google",
    "facebook",
    "instagram",
  ];
  return examples.slice(0, 3).map((content, i) => ({
    content,
    platform: platforms[i % 3],
    likes: 0,
    comments: 0,
    targetLikes: 24 + i * 11,
    targetComments: 4 + i * 3,
  }));
}

// ─── Left Panel: Reputation Flow ─────────────────────────────────────────────

function LeftPanel({
  tick,
  reviewerName,
  reviewText,
  aiResponse,
}: {
  tick: number;
  reviewerName: string;
  reviewText: string;
  aiResponse: string;
}) {
  const phase =
    tick < 3
      ? "incoming"
      : tick < 6
        ? "typing"
        : tick < 10
          ? "response"
          : tick < 13
            ? "posted"
            : "social";

  return (
    <div
      className="relative rounded-xl border border-border bg-card p-5 min-h-[340px] flex flex-col gap-3 overflow-hidden"
      aria-label="Reputation automation flow"
      role="img"
    >
      <div className="flex items-center gap-2 mb-1">
        <Star className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Reputation Engine
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      <motion.div
        key="review-card"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: phase !== "social" ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-foreground">
            {reviewerName}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">Google</span>
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">
          {reviewText}
        </p>
      </motion.div>

      {(phase === "typing" ||
        phase === "response" ||
        phase === "posted" ||
        phase === "social") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <MessageSquare className="w-3.5 h-3.5 text-primary" />
          {phase === "typing" ? (
            <span className="flex items-center gap-1">
              AI is drafting a response
              <span className="flex gap-0.5 ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 0.9,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </span>
            </span>
          ) : (
            <span className="text-foreground/70">Response generated</span>
          )}
        </motion.div>
      )}

      {(phase === "response" || phase === "posted" || phase === "social") && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-lg border border-primary/20 bg-primary/5 p-3"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary">AI</span>
            </div>
            <span className="text-xs font-semibold text-foreground">
              BRF AI Response
            </span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">
            {aiResponse}
          </p>
        </motion.div>
      )}

      {(phase === "posted" || phase === "social") && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center gap-2 text-xs font-semibold text-emerald-400"
        >
          <CheckCircle2 className="w-4 h-4" />
          Response posted ✓
        </motion.div>
      )}

      {phase === "social" && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 rounded-lg border border-pink-500/20 bg-pink-500/5 p-2.5 text-xs"
        >
          <Share2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span className="text-pink-300 font-medium">
            Converting to social post…
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ─── Right Panel: Social Content Flow ────────────────────────────────────────

function RightPanel({
  tick,
  examples,
  leadName,
  leadPhone,
}: {
  tick: number;
  examples: [string, string, string];
  leadName: string;
  leadPhone: string;
}) {
  const posts = buildSocialPosts(examples);
  const phase =
    tick < 5 ? "filling" : tick < 10 ? "engaging" : tick < 13 ? "lead" : "crm";

  const animatedLikes = (targetLikes: number) =>
    phase === "engaging" || phase === "lead" || phase === "crm"
      ? targetLikes
      : 0;

  return (
    <div
      className="relative rounded-xl border border-border bg-card p-5 min-h-[340px] flex flex-col gap-3 overflow-hidden"
      aria-label="Social content automation flow"
      role="img"
    >
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Social Content Engine
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Auto
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {posts.map((post, i) => (
          <motion.div
            key={post.platform}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: phase !== "crm" || i < 2 ? 1 : 0.5, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="rounded-lg border border-border bg-background/50 p-2.5"
          >
            <div className="flex items-start gap-2">
              <span
                className={`text-xs font-semibold shrink-0 ${PLATFORM_COLORS[post.platform]}`}
              >
                {PLATFORM_LABELS[post.platform]}
              </span>
              <p className="text-xs text-foreground/70 leading-relaxed line-clamp-2 min-w-0">
                {post.content}
              </p>
            </div>
            {(phase === "engaging" || phase === "lead" || phase === "crm") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground"
              >
                <span>❤️ {animatedLikes(post.targetLikes)}</span>
                <span>💬 {post.targetComments}</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {(phase === "lead" || phase === "crm") && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="rounded-lg border border-emerald-500/25 bg-emerald-500/8 p-3 flex items-center gap-2.5"
        >
          <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-emerald-300">
              New lead from comment!
            </p>
            <p className="text-xs text-muted-foreground">
              {leadName} · {leadPhone}
            </p>
          </div>
        </motion.div>
      )}

      {phase === "crm" && (
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex items-center gap-2 text-xs font-semibold text-primary"
        >
          <CheckCircle2 className="w-4 h-4" />
          CRM entry created automatically ✓
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Stage3ReputationSection({
  nicheData,
  isNeutral = false,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [started, setStarted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (isInView && !started) setStarted(true);
  }, [isInView, started]);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) % CYCLE_DURATION;
      setTick(Math.floor(elapsed / 1000));
    }, 250);
    return () => clearInterval(interval);
  }, [started]);

  // Use neutral or niche-specific data
  const reviewerName = isNeutral
    ? NEUTRAL_REVIEW.reviewerName
    : (nicheData.reviewerName ?? NEUTRAL_REVIEW.reviewerName);
  const reviewText = isNeutral
    ? NEUTRAL_REVIEW.reviewText
    : (nicheData.reviewText ?? NEUTRAL_REVIEW.reviewText);
  const aiReviewResponse = isNeutral
    ? NEUTRAL_REVIEW.aiReviewResponse
    : (nicheData.aiReviewResponse ?? NEUTRAL_REVIEW.aiReviewResponse);
  const socialPostExamples = isNeutral
    ? NEUTRAL_REVIEW.socialPostExamples
    : (nicheData.socialPostExamples ?? NEUTRAL_REVIEW.socialPostExamples);
  const leadName = isNeutral
    ? NEUTRAL_REVIEW.leadName
    : (nicheData.leadName ?? NEUTRAL_REVIEW.leadName);
  const leadPhone = isNeutral
    ? NEUTRAL_REVIEW.leadPhone
    : (nicheData.leadPhone ?? NEUTRAL_REVIEW.leadPhone);

  const testimonial = isNeutral
    ? NEUTRAL_REVIEW.testimonial
    : (nicheData.reputationTestimonial ?? NEUTRAL_REVIEW.testimonial);

  return (
    <section
      ref={sectionRef}
      data-ocid="stage3-reputation.section"
      className="relative py-20 px-4 bg-muted/30"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, var(--purple-accent), transparent)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/8 mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase">
              Stage 3 — Reputation Management
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight max-w-3xl mx-auto">
            5-Star Reviews Generate{" "}
            <span className="text-primary">3.2x More Leads.</span>
            <br className="hidden sm:block" />
            <span className="text-foreground/90">
              {" "}
              Here's How BRF Gets Them For You Automatically.
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-base">
            Every review is responded to. Every response gets repurposed as
            social content. Every comment becomes a lead — on autopilot.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
        >
          <div data-ocid="stage3-reputation.left_panel">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
              ← Review Response Flow
            </p>
            <LeftPanel
              tick={tick}
              reviewerName={reviewerName}
              reviewText={reviewText}
              aiResponse={aiReviewResponse}
            />
          </div>
          <div data-ocid="stage3-reputation.right_panel">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
              Social Content Engine →
            </p>
            <RightPanel
              tick={tick}
              examples={socialPostExamples}
              leadName={leadName}
              leadPhone={leadPhone}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-border" />
          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full border border-border bg-card">
            Both systems run in sync — one review triggers the entire chain
          </span>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-border" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto max-w-2xl rounded-xl border border-primary/20 bg-card p-6"
          data-ocid="stage3-reputation.testimonial_card"
        >
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-foreground/85 italic text-sm leading-relaxed mb-4">
            "{testimonial.quote}"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">
                {testimonial.author[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {testimonial.author}
              </p>
              <p className="text-xs text-muted-foreground">
                {testimonial.role}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
