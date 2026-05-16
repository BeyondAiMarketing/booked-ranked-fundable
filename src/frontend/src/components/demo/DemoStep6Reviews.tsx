// DemoStep6Reviews — Reputation + lead generation split view
// Framework: Ogilvy (authority/proof — show the evidence, not the claim)

import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface ReviewCard {
  platform: string;
  icon: string;
  stars: number;
  author: string;
  text: string;
  aiReply: string;
  platformColor: string;
}

interface LeadCard {
  name: string;
  source: string;
  score: "Hot" | "Warm" | "Cold";
  scoreNote: string;
  emailReady: boolean;
}

const REVIEWS: ReviewCard[] = [
  {
    platform: "Google",
    icon: "🔍",
    stars: 5,
    author: "Sarah M.",
    text: "Absolutely amazing service! Fast response, professional team, fixed the problem immediately.",
    aiReply:
      "Thank you so much, Sarah! We're thrilled we could help quickly. We look forward to serving you again!",
    platformColor: "oklch(0.72 0.2 45)",
  },
  {
    platform: "Yelp",
    icon: "⭐",
    stars: 4,
    author: "James T.",
    text: "Great experience overall. Would definitely recommend to friends and family in the area.",
    aiReply:
      "Thanks for the kind words, James! We're always working to improve. Hope to see you again soon!",
    platformColor: "oklch(0.62 0.22 25)",
  },
  {
    platform: "Facebook",
    icon: "👍",
    stars: 5,
    author: "Linda R.",
    text: "Best service I've had in years. Showed up on time, explained everything, and priced fairly.",
    aiReply:
      "Linda, we really appreciate this! Being on time and transparent matters to us. Thank you for sharing!",
    platformColor: "oklch(0.6 0.18 240)",
  },
];

const LEADS: LeadCard[] = [
  {
    name: "David Chen",
    source: "Google Maps Click",
    score: "Hot",
    scoreNote: "3 visits, form submitted",
    emailReady: true,
  },
  {
    name: "Maria Santos",
    source: "Social Media DM",
    score: "Warm",
    scoreNote: "Engaged with 2 posts",
    emailReady: true,
  },
  {
    name: "Robert Kim",
    source: "Organic Search",
    score: "Cold",
    scoreNote: "1 page view, no action",
    emailReady: true,
  },
];

const SCORE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Hot: {
    bg: "oklch(0.6 0.22 25 / 15%)",
    text: "oklch(0.78 0.18 25)",
    border: "oklch(0.6 0.22 25 / 30%)",
  },
  Warm: {
    bg: "oklch(0.72 0.2 75 / 15%)",
    text: "oklch(0.82 0.16 75)",
    border: "oklch(0.72 0.2 75 / 30%)",
  },
  Cold: {
    bg: "oklch(0.6 0.18 240 / 15%)",
    text: "oklch(0.76 0.14 240)",
    border: "oklch(0.6 0.18 240 / 30%)",
  },
};

export default function DemoStep6Reviews() {
  const { setStepComplete } = useDemoFlow();
  const [visibleReviews, setVisibleReviews] = useState(0);
  const [visibleLeads, setVisibleLeads] = useState(0);
  const [expandedReply, setExpandedReply] = useState<number | null>(null);

  useEffect(() => {
    REVIEWS.forEach((_, i) => {
      setTimeout(() => setVisibleReviews(i + 1), (i + 1) * 400);
    });
    LEADS.forEach((_, i) => {
      setTimeout(() => setVisibleLeads(i + 1), (i + 1) * 400 + 200);
    });
    // Complete after all cards appear (1.6s stagger total)
    const total = Math.max(REVIEWS.length, LEADS.length) * 400 + 600;
    const t = setTimeout(() => setStepComplete(true), total);
    return () => clearTimeout(t);
  }, [setStepComplete]);

  return (
    <div
      className="flex flex-col items-center gap-6"
      data-ocid="demo.step6.section"
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Reputation + Lead Generation
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Both Running on Auto-Pilot
        </h2>
        <p className="mt-2 text-sm" style={{ color: "oklch(0.65 0.02 280)" }}>
          Businesses with 4.5+ stars earn{" "}
          <strong className="text-white">31% more revenue</strong> than
          competitors.
        </p>
      </div>

      {/* Split view */}
      <div className="w-full max-w-3xl grid sm:grid-cols-2 gap-4">
        {/* LEFT — Reviews */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.12 0.014 280)",
            border: "1px solid oklch(1 0 0 / 10%)",
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{
              borderColor: "oklch(1 0 0 / 8%)",
              background: "oklch(0.14 0.016 285)",
            }}
          >
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              Unified Review Inbox
            </span>
            <span
              className="text-xs font-semibold animate-pulse"
              style={{ color: "oklch(0.62 0.18 155)" }}
            >
              ● Live
            </span>
          </div>

          <div className="p-3 space-y-3">
            <AnimatePresence>
              {REVIEWS.slice(0, visibleReviews).map((review, i) => (
                <motion.div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable order
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="rounded-xl p-3 space-y-2"
                  style={{
                    background: "oklch(0.15 0.014 285)",
                    border: "1px solid oklch(1 0 0 / 6%)",
                  }}
                  data-ocid={`demo.step6.review.item.${i + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{review.icon}</span>
                      <span className="text-xs font-semibold text-white/70">
                        {review.platform}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.stars }).map((_, s) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: decorative stars
                        <span key={s} className="text-amber-400 text-xs">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: "oklch(0.72 0.02 280)" }}
                  >
                    "{review.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px]"
                      style={{ color: "oklch(0.5 0.02 280)" }}
                    >
                      — {review.author}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReply(expandedReply === i ? null : i)
                      }
                      data-ocid={`demo.step6.view_reply.${i + 1}`}
                      className="text-[10px] font-semibold"
                      style={{ color: "oklch(0.68 0.18 290)" }}
                    >
                      {expandedReply === i ? "Hide reply" : "AI Reply ↓"}
                    </button>
                  </div>
                  <AnimatePresence>
                    {expandedReply === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="rounded-lg p-2 mt-1 text-[10px] leading-relaxed"
                          style={{
                            background: "oklch(0.58 0.22 290 / 12%)",
                            color: "oklch(0.78 0.16 290)",
                            border: "1px solid oklch(0.58 0.22 290 / 20%)",
                          }}
                        >
                          <span className="font-bold block mb-0.5">
                            🤖 AI Draft Response:
                          </span>
                          {review.aiReply}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — Leads */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.12 0.014 280)",
            border: "1px solid oklch(1 0 0 / 10%)",
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{
              borderColor: "oklch(1 0 0 / 8%)",
              background: "oklch(0.14 0.016 285)",
            }}
          >
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
              AI Scored Leads
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "oklch(0.78 0.2 75)" }}
            >
              Auto-generated
            </span>
          </div>

          <div className="p-3 space-y-3">
            <AnimatePresence>
              {LEADS.slice(0, visibleLeads).map((lead, i) => {
                const scoreStyle = SCORE_STYLES[lead.score];
                return (
                  <motion.div
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable order
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="rounded-xl p-3 space-y-2"
                    style={{
                      background: "oklch(0.15 0.014 285)",
                      border: "1px solid oklch(1 0 0 / 6%)",
                    }}
                    data-ocid={`demo.step6.lead.item.${i + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {lead.name}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          background: scoreStyle.bg,
                          color: scoreStyle.text,
                          borderColor: scoreStyle.border,
                        }}
                      >
                        {lead.score === "Hot"
                          ? "🔥"
                          : lead.score === "Warm"
                            ? "⚡"
                            : "❄️"}{" "}
                        {lead.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded"
                        style={{
                          background: "oklch(0.2 0.016 280)",
                          color: "oklch(0.6 0.02 280)",
                        }}
                      >
                        {lead.source}
                      </span>
                    </div>
                    <p
                      className="text-[10px]"
                      style={{ color: "oklch(0.55 0.02 280)" }}
                    >
                      {lead.scoreNote}
                    </p>
                    {lead.emailReady && (
                      <div
                        className="flex items-center gap-1.5 text-[10px] font-semibold"
                        style={{ color: "oklch(0.62 0.18 155)" }}
                      >
                        <span>✓</span>
                        <span>AI Personalized Email Ready</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
