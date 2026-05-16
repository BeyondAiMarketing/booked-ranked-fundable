/**
 * DemoStep7Social — 7-post social media carousel for the trial week.
 * Framework: Deiss (value journey — show them what's coming in their trial)
 *
 * Shows niche-specific posts across platforms. Prev/Next navigation.
 * Completes after user views 3+ cards or 10 seconds.
 */

import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Platform = "Instagram" | "Facebook" | "LinkedIn" | "TikTok";

interface SocialPost {
  platform: Platform;
  emoji: string;
  copy: string;
  hashtags: string;
  type: string;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  Instagram: "oklch(0.65 0.22 340)",
  Facebook: "oklch(0.55 0.22 240)",
  LinkedIn: "oklch(0.52 0.2 220)",
  TikTok: "oklch(0.65 0.18 0)",
};

const PLATFORM_ICONS: Record<Platform, string> = {
  Instagram: "📸",
  Facebook: "📘",
  LinkedIn: "💼",
  TikTok: "🎵",
};

const NICHE_POSTS: Record<string, SocialPost[]> = {
  plumber: [
    {
      platform: "Instagram",
      emoji: "🔧",
      type: "Before/After",
      copy: "From flooded to fixed in under 2 hours! Our AI receptionist booked this emergency same-day while the homeowner was at work. No voicemail. No waiting. Just fast, professional service.",
      hashtags: "#plumbing #emergency #Dallas #homerepair",
    },
    {
      platform: "Facebook",
      emoji: "⭐",
      type: "Review Request",
      copy: "Happy with your service? It means the world to us — and helps your neighbors find trusted help when they need it most. Leave us a quick review and we'll thank you personally!",
      hashtags: "#5stars #plumber #localservice",
    },
    {
      platform: "LinkedIn",
      emoji: "📊",
      type: "Business Insight",
      copy: "Did you know 67% of plumbing calls go unanswered? At our shop, we answer every single one — 24/7, 365. That's the power of an AI front desk. Never miss a job again.",
      hashtags: "#plumbing #business #AI #ServiceIndustry",
    },
    {
      platform: "Instagram",
      emoji: "💧",
      type: "Tip of the Week",
      copy: "💧 Pro tip: Know where your main water shut-off valve is BEFORE there's a leak. 30 seconds of preparation can save you thousands. Tag a friend who needs to hear this!",
      hashtags: "#plumbingtips #homeowner #waterDamage",
    },
    {
      platform: "TikTok",
      emoji: "🎬",
      type: "Quick Fix Video",
      copy: "Watch: How we cleared a full drain blockage in 8 minutes flat. The homeowner thought they needed a full pipe replacement. They didn't. 💪 Comment your worst plumbing horror story below!",
      hashtags: "#plumbing #DIY #learnontiktok",
    },
    {
      platform: "Facebook",
      emoji: "📅",
      type: "Seasonal Promo",
      copy: "⚠️ Winter prep checklist: Insulate your pipes before the first freeze. Book a pre-winter inspection now and get 20% off. Spots are limited — book online or reply to this post!",
      hashtags: "#winterplumbing #Dallas #homecare",
    },
    {
      platform: "Instagram",
      emoji: "🏆",
      type: "Social Proof",
      copy: "300+ 5-star reviews and counting. Every one of them earned the same way — by showing up fast, doing the job right, and treating your home like our own. Thank you, Dallas!",
      hashtags: "#reviews #plumber #trusted #local",
    },
  ],
  "med-spa": [
    {
      platform: "Instagram",
      emoji: "✨",
      type: "Before/After",
      copy: "Natural, beautiful results that look like you — just refreshed. Our aesthetic team creates personalized treatment plans so no two looks are alike. DM us to book your complimentary consultation!",
      hashtags: "#botox #medspa #naturalbeauty #aesthetics",
    },
    {
      platform: "Facebook",
      emoji: "🌸",
      type: "Promotion",
      copy: "This week only: Complimentary skin analysis with every new patient consultation. Let our licensed aestheticians build a personalized plan that fits your goals and your budget.",
      hashtags: "#medspa #skincare #beauty #localbeauty",
    },
    {
      platform: "LinkedIn",
      emoji: "💡",
      type: "Industry Insight",
      copy: "The med spa industry grew 14% last year. The clinics winning? They respond in under 60 seconds. Our AI handles every inquiry, every after-hours message — so we never miss a lead.",
      hashtags: "#medspa #aesthetics #businessgrowth #AI",
    },
    {
      platform: "Instagram",
      emoji: "💆",
      type: "Education",
      copy: "Botox vs. Filler: What's the difference? Botox relaxes muscles to smooth lines. Filler adds volume and structure. Most of our clients benefit from both — strategically placed. Want to know what's right for you? Book a free consult ⬇️",
      hashtags: "#botox #fillers #medspa #skincare",
    },
    {
      platform: "TikTok",
      emoji: "🎬",
      type: "Day in the Life",
      copy: "A day at our med spa: 8am consultations, 10am treatments, 12pm lunch & learns, 2pm glow-ups, 5pm last appointments. We make luxury accessible. Come see what we're about! 💅",
      hashtags: "#medspa #aestheticnurse #dayinthelife",
    },
    {
      platform: "Facebook",
      emoji: "📅",
      type: "Event",
      copy: "Join us for our monthly Beauty Night — exclusive pricing, wine & cheese, live demos, and our team available for personalized consultations. RSVP in the comments below!",
      hashtags: "#beautyevent #medspa #skincare #Miami",
    },
    {
      platform: "Instagram",
      emoji: "⭐",
      type: "Testimonial",
      copy: '"I was nervous about Botox at first. Now I can\'t imagine not doing it. The team here is so professional and kind — I always feel completely comfortable." — Ashley C., patient since 2022',
      hashtags: "#medspa #testimonial #results #trust",
    },
  ],
  default: [
    {
      platform: "Instagram",
      emoji: "🏆",
      type: "Social Proof",
      copy: "We're proud of every job we complete and every customer we serve. Your trust is the foundation of everything we do. Thank you for choosing us!",
      hashtags: "#localservice #trusted #5stars #community",
    },
    {
      platform: "Facebook",
      emoji: "📅",
      type: "Appointment",
      copy: "Booking is now easier than ever — our AI assistant is available 24/7 to schedule appointments, answer questions, and get you taken care of fast. Book online or call us today!",
      hashtags: "#booking #localservice #convenient",
    },
    {
      platform: "LinkedIn",
      emoji: "📊",
      type: "Business Update",
      copy: "Proud to announce we've served over 500 satisfied customers this year. Our commitment to quality service and rapid response times has been the key to our growth. Thank you, community!",
      hashtags: "#business #growth #community #service",
    },
    {
      platform: "Instagram",
      emoji: "💡",
      type: "Tip",
      copy: "Pro tip from our team: Regular maintenance saves you thousands in emergency repairs. We offer seasonal checkups that catch problems before they become expensive. Ask us about our maintenance plans!",
      hashtags: "#maintenance #proTip #homecare",
    },
    {
      platform: "TikTok",
      emoji: "🎬",
      type: "Behind the Scenes",
      copy: "Take a look inside our team's daily routine — the training, the prep, the tools we use to deliver consistent, high-quality results every single time. Comment your questions below!",
      hashtags: "#behindthescenes #localservice #quality",
    },
    {
      platform: "Facebook",
      emoji: "⭐",
      type: "Review",
      copy: "5 stars mean everything to us. When you take the time to leave a review, it helps your neighbors find a trusted service provider when they need one. Thank you for your support!",
      hashtags: "#reviews #5stars #localservice",
    },
    {
      platform: "Instagram",
      emoji: "🎁",
      type: "Offer",
      copy: "First-time customers get 15% off their initial service. We want to earn your trust — and we're confident in our work. Book today and experience the difference! ⬇️",
      hashtags: "#offer #firsttime #discount #local",
    },
  ],
};

function getPosts(niche: string): SocialPost[] {
  return NICHE_POSTS[niche] ?? NICHE_POSTS.default;
}

export default function DemoStep7Social() {
  const { niche, completeStep } = useDemoFlow();
  const posts = getPosts(niche || "plumber");

  const [current, setCurrent] = useState(0);
  const [viewed, setViewed] = useState(new Set([0]));
  const completedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markComplete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    completeStep();
  };

  // Auto-complete after 10s
  // biome-ignore lint/correctness/useExhaustiveDependencies: markComplete is stable via ref
  useEffect(() => {
    timerRef.current = setTimeout(markComplete, 10000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Complete when 3+ cards viewed
  // biome-ignore lint/correctness/useExhaustiveDependencies: markComplete is stable via ref
  useEffect(() => {
    if (viewed.size >= 3) markComplete();
  }, [viewed.size]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (n: number) => {
    const next = Math.max(0, Math.min(posts.length - 1, n));
    setCurrent(next);
    setViewed((v) => {
      const s = new Set(v);
      s.add(next);
      return s;
    });
  };

  const post = posts[current];
  const platformColor = PLATFORM_COLORS[post.platform];

  return (
    <div
      className="flex flex-col items-center gap-5 w-full"
      data-ocid="demo.step7.section"
    >
      {/* Header */}
      <div className="text-center shrink-0">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Your Social Media — Auto-Scheduled
        </p>
        <h2 className="text-xl font-black text-white">
          Your First Week of Content
        </h2>
        <p className="text-sm mt-1" style={{ color: "oklch(0.65 0.02 280)" }}>
          7 posts across 4 platforms — generated and scheduled on Day 1 of your
          trial
        </p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm relative shrink-0"
        style={{ minHeight: 220 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.12 0.014 280)",
              border: `1px solid ${platformColor} / 30%`,
            }}
            data-ocid={`demo.step7.post.item.${current + 1}`}
          >
            {/* Platform header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{
                background: "oklch(0.15 0.016 285)",
                borderBottom: `1px solid ${platformColor} / 20%`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{PLATFORM_ICONS[post.platform]}</span>
                <div>
                  <div className="text-xs font-bold text-white">
                    {post.platform}
                  </div>
                  <div className="text-[10px]" style={{ color: platformColor }}>
                    {post.type}
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: "oklch(0.62 0.18 155 / 15%)",
                  color: "oklch(0.78 0.14 155)",
                  border: "1px solid oklch(0.62 0.18 155 / 25%)",
                }}
              >
                ✓ Scheduled
              </div>
            </div>

            {/* Post content */}
            <div className="p-4">
              <p className="text-sm text-white/85 leading-relaxed">
                {post.emoji} {post.copy}
              </p>
              <p
                className="text-xs mt-3"
                style={{ color: "oklch(0.55 0.08 280)" }}
              >
                {post.hashtags}
              </p>
            </div>

            {/* Post footer */}
            <div
              className="px-4 py-2.5 border-t flex items-center gap-3"
              style={{
                borderColor: "oklch(1 0 0 / 8%)",
                background: "oklch(0.1 0.012 280)",
              }}
            >
              {["👍 Like", "💬 Comment", "↗️ Share"].map((a) => (
                <span
                  key={a}
                  className="text-[10px] font-semibold"
                  style={{ color: "oklch(0.5 0.02 280)" }}
                >
                  {a}
                </span>
              ))}
              <span
                className="ml-auto text-[10px]"
                style={{ color: "oklch(0.45 0.02 280)" }}
              >
                Post {current + 1} of {posts.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          data-ocid="demo.step7.prev_button"
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
          style={{
            background: "oklch(1 0 0 / 6%)",
            border: "1px solid oklch(1 0 0 / 12%)",
          }}
          aria-label="Previous post"
        >
          ←
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {posts.map((_, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: stable array
              key={i}
              type="button"
              onClick={() => goTo(i)}
              data-ocid={`demo.step7.dot.${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: viewed.has(i)
                  ? "oklch(0.62 0.18 155)"
                  : i === current
                    ? "oklch(0.58 0.22 290)"
                    : "oklch(1 0 0 / 15%)",
              }}
              aria-label={`Go to post ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current === posts.length - 1}
          data-ocid="demo.step7.next_button"
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
          style={{
            background: "oklch(1 0 0 / 6%)",
            border: "1px solid oklch(1 0 0 / 12%)",
          }}
          aria-label="Next post"
        >
          →
        </button>
      </div>

      {/* Progress note */}
      <motion.div
        className="text-center text-xs shrink-0"
        style={{ color: "oklch(0.5 0.02 280)" }}
        data-ocid="demo.step7.progress_state"
      >
        {viewed.size < 3 ? (
          `View ${3 - viewed.size} more post${3 - viewed.size !== 1 ? "s" : ""} to continue`
        ) : (
          <span style={{ color: "oklch(0.78 0.14 155)" }}>
            ✓ First week of content — ready to publish
          </span>
        )}
      </motion.div>
    </div>
  );
}
