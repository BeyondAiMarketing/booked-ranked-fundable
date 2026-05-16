/**
 * DemoStep5Reputation — Review request + 5-star review + AI response.
 * Two-column layout (stacked mobile), typing animations throughout.
 * Framework badge: Ogilvy — "Social Proof"
 */

import { FRAMEWORK_BADGES } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { DemoNicheId } from "@/types/demo";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import BenefitPill from "./BenefitPill";
import CoachTipCard from "./CoachTipCard";
import FrameworkBadge from "./FrameworkBadge";
import GreenConfirmOverlay from "./GreenConfirmOverlay";

// ── Niche data ────────────────────────────────────────────────────────────────

const NICHE_CALLER: Record<
  DemoNicheId,
  { full: string; short: string; initial: string }
> = {
  plumber: { full: "Sarah Mitchell", short: "Sarah M.", initial: "S" },
  "med-spa": { full: "Ashley Carter", short: "Ashley C.", initial: "A" },
  hvac: { full: "Sandra Williams", short: "Sandra W.", initial: "S" },
  restoration: { full: "David Nguyen", short: "David N.", initial: "D" },
  "carpet-cleaning": {
    full: "Jennifer Park",
    short: "Jennifer P.",
    initial: "J",
  },
  roofing: { full: "Robert Martinez", short: "Robert M.", initial: "R" },
  "real-estate": { full: "Lisa Thompson", short: "Lisa T.", initial: "L" },
  mortgage: { full: "Tom Bradley", short: "Tom B.", initial: "T" },
  chiropractor: { full: "Patricia Cole", short: "Patricia C.", initial: "P" },
  dental: { full: "Marcus Johnson", short: "Marcus J.", initial: "M" },
};

const NICHE_REVIEW_TEXT: Record<DemoNicheId, string> = {
  plumber:
    "Incredible service! They showed up in under an hour and fixed our burst pipe. Professional, fast, and fair pricing. Already recommended to three neighbors.",
  "med-spa":
    "I've been to many med spas and this team is on another level. Natural results, zero discomfort, and they truly listen. I won't go anywhere else.",
  hvac: "My AC went out in 95° heat and they had it running same day. The technician explained everything clearly. Best HVAC company I've ever used.",
  restoration:
    "When our basement flooded, these people showed up in 45 minutes at midnight. Thorough, calm, and handled everything including the insurance paperwork.",
  "carpet-cleaning":
    "My carpets look completely new! They removed a stain I've had for two years. Showed up on time, finished fast, and the results were unreal.",
  roofing:
    "From inspection to final repair in 48 hours. Professional crew, zero mess left behind, and they found damage I didn't even know about. Highly recommend.",
  "real-estate":
    "Sold my home in 9 days over asking price. Communication was outstanding throughout. I felt like their only client. Absolutely stellar experience.",
  mortgage:
    "Got a rate I didn't think was possible in this market. The process was surprisingly smooth and they kept me informed every single step.",
  chiropractor:
    "After one visit I felt immediate relief from back pain I've had for years. The team is warm, professional, and truly cares about your outcomes.",
  dental:
    "Broke a tooth on a Friday afternoon — they got me in within two hours. Pain-free, efficient, and the friendliest dental office I've ever visited.",
};

const NICHE_PAIN: Record<DemoNicheId, { stat: string; label: string }> = {
  plumber: {
    stat: "88%",
    label:
      "of consumers trust online reviews as much as personal recommendations",
  },
  "med-spa": {
    stat: "4.7★",
    label:
      "is the average rating prospects require before booking a med spa appointment",
  },
  hvac: {
    stat: "3x",
    label:
      "more calls come in to HVAC companies with 50+ Google reviews vs. those with fewer than 10",
  },
  restoration: {
    stat: "92%",
    label:
      "of homeowners check reviews before calling a restoration company after a disaster",
  },
  "carpet-cleaning": {
    stat: "74%",
    label:
      "of carpet cleaning customers say reviews were the #1 reason they called",
  },
  roofing: {
    stat: "62%",
    label:
      "of homeowners dismiss roofing companies with less than 4 stars — automatically",
  },
  "real-estate": {
    stat: "76%",
    label: "of buyers research an agent's reviews before making first contact",
  },
  mortgage: {
    stat: "68%",
    label:
      "of borrowers choose their lender based on online reviews over rate comparison",
  },
  chiropractor: {
    stat: "85%",
    label:
      "of new chiropractic patients say reviews were the deciding factor in choosing a provider",
  },
  dental: {
    stat: "$2,400",
    label:
      "in lifetime value is lost every time a new dental patient chooses a competitor based on better reviews",
  },
};

const NICHE_AI_RESPONSE: Record<DemoNicheId, string> = {
  plumber: `Thank you so much for the 5-star review, Sarah! We're thrilled we could be there quickly and get your home back to normal. Our team takes emergency calls seriously, and it means the world to hear this feedback. We look forward to being your go-to plumber!`,
  "med-spa": `We're absolutely delighted to hear about your experience, Ashley! Our goal is always natural, beautiful results with your comfort first. Your kind words inspire our entire team. We can't wait to see you at your next appointment!`,
  hvac: "Thank you, Sandra! We know how miserable a broken AC can be, especially in peak summer. Our team is proud to provide same-day emergency service. Your comfort and safety always come first \u2014 thank you for trusting us!",
  restoration:
    "David, we're so glad we could help during such a stressful time. Our team trains for exactly these moments \u2014 to be a calm presence when everything feels chaotic. We hope your home is fully restored and you never need us again, but we'll always be here if you do.",
  "carpet-cleaning":
    "Jennifer, thank you! Removing those set-in stains is exactly why we love what we do. Seeing the look on a client's face when their carpets look brand new \u2014 that never gets old. We appreciate your trust and look forward to seeing you again!",
  roofing:
    "Robert, we really appreciate this review! Our team works hard to be thorough and respectful of your property. Catching hidden damage is what separates a good inspection from a great one. Thank you for trusting Summit with your home!",
  "real-estate":
    "Lisa, congratulations on your sale and thank you for this incredible review! It was truly a pleasure representing you. Achieving above asking price in this market takes preparation and strategy \u2014 and you were a fantastic partner throughout. Wishing you all the best in your next chapter!",
  mortgage: `Tom, that means everything to us! Finding great rates in this environment takes persistence and deep lender relationships. Our team works hard so you don't have to stress. We're honored you trusted us with such an important financial decision.`,
  chiropractor: `Patricia, hearing that your back pain is already improving after your first visit is the reason we do this work! Your health journey matters to our entire team. We're committed to your long-term wellness — thank you so much for sharing your experience!`,
  dental: `Marcus, we're so glad we could see you quickly and get you out of pain! Dental emergencies are stressful enough — you shouldn't have to wait days for care. Thank you for the kind words. We look forward to keeping your smile healthy for years to come!`,
};

// ── Typing animation hook ─────────────────────────────────────────────────────

function useTypewriter(text: string, active: boolean, speed = 18): string {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);
  return displayed;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DemoStep5Reputation() {
  const { businessName, city, niche, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const cityLabel = city || "your area";
  const nicheKey = (niche || "plumber") as DemoNicheId;

  const caller = NICHE_CALLER[nicheKey] ?? NICHE_CALLER.plumber;
  const reviewText = NICHE_REVIEW_TEXT[nicheKey] ?? NICHE_REVIEW_TEXT.plumber;
  const pain = NICHE_PAIN[nicheKey] ?? NICHE_PAIN.plumber;
  const aiResponseText =
    NICHE_AI_RESPONSE[nicheKey] ?? NICHE_AI_RESPONSE.plumber;

  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [smsTyping, setSmsTyping] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [aiResponseTyping, setAiResponseTyping] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [coachDismissed, setCoachDismissed] = useState(false);

  const smsText = `Hi ${caller.short}! Thank you for choosing ${biz}. We hope your experience was amazing! Could you take 30 seconds to leave us a Google review? It means everything. 🙏 g.page/review/${biz.toLowerCase().replace(/\s+/g, "-")}`;
  const typedSms = useTypewriter(smsText, smsTyping, 12);
  const typedAiResponse = useTypewriter(aiResponseText, aiResponseTyping, 15);

  useEffect(() => {
    const t0 = setTimeout(() => {
      setStage(1);
      setSmsTyping(true);
    }, 300);
    const t1 = setTimeout(() => {
      setStage(2);
      setReviewVisible(true);
    }, 3200);
    const t2 = setTimeout(() => {
      setStage(3);
      setAiResponseTyping(true);
    }, 5000);
    const t3 = setTimeout(
      () => {
        setShowNextBtn(true);
        completeStep();
      },
      5000 + aiResponseText.length * 15 + 800,
    );
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [aiResponseText.length, completeStep]);

  const handleOverlayDone = useCallback(() => {
    setShowOverlay(false);
    completeStep();
  }, [completeStep]);

  return (
    <>
      <div
        className="w-full max-w-lg mx-auto flex flex-col gap-5 relative"
        data-ocid="demo.step5.section"
      >
        {/* Benefit pill — desktop only, never overlaps mobile text */}
        <BenefitPill benefit="More 5-star reviews on autopilot — without lifting a finger." />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p
            className="text-[10px] font-black uppercase tracking-[0.18em] mb-1.5"
            style={{ color: "oklch(0.58 0.22 290)" }}
          >
            Act 2 · Step 5 — Reputation
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Reviews on{" "}
            <span style={{ color: "oklch(0.72 0.18 155)" }}>Auto-Pilot</span>
          </h2>
        </motion.div>

        {/* Pain point */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl px-5 py-4 text-center"
          style={{
            background: "oklch(0.1 0.014 280)",
            border: "1px solid oklch(0.65 0.2 80 / 25%)",
          }}
        >
          <span
            className="block text-4xl font-black mb-1"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.85 0.18 80), oklch(0.72 0.22 60))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {pain.stat}
          </span>
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.75 0.02 280)" }}
          >
            {pain.label}
          </p>
        </motion.div>

        {/* Two-column grid (stacked on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Left — SMS review request */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: stage >= 1 ? 1 : 0, x: stage >= 1 ? 0 : -16 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.11 0.014 280)",
              border: "1px solid oklch(0.58 0.22 290 / 30%)",
            }}
            data-ocid="demo.step5.sms_card"
          >
            <div
              className="px-3 py-2 flex items-center gap-2"
              style={{
                background: "oklch(0.14 0.014 280)",
                borderBottom: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: "oklch(0.6 0.02 280)" }}
              >
                📱 SMS — Auto-sent
              </span>
              <span
                className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "oklch(0.55 0.22 155 / 15%)",
                  color: "oklch(0.72 0.16 155)",
                }}
              >
                ✓ Sent
              </span>
            </div>
            <div className="p-3">
              <div
                className="rounded-xl px-3 py-2.5 text-xs leading-relaxed min-h-[80px]"
                style={{
                  background: "oklch(0.17 0.016 285)",
                  color: "oklch(0.82 0.01 280)",
                }}
              >
                {typedSms}
                {smsTyping && typedSms.length < smsText.length && (
                  <span className="animate-pulse inline-block w-0.5 h-3 bg-current align-middle ml-0.5" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Right — 5-star review arrives */}
          <AnimatePresence>
            {reviewVisible && (
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 18, stiffness: 260 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "oklch(0.11 0.014 280)",
                  border: "1px solid oklch(0.65 0.2 80 / 40%)",
                  boxShadow: "0 0 24px oklch(0.65 0.2 80 / 18%)",
                }}
                data-ocid="demo.step5.review_card"
              >
                <div
                  className="px-3 py-2 flex items-center gap-2"
                  style={{
                    background: "oklch(0.14 0.014 280)",
                    borderBottom: "1px solid oklch(1 0 0 / 8%)",
                  }}
                >
                  <span className="text-xs font-black text-white">G</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "oklch(0.6 0.02 280)" }}
                  >
                    Google Review
                  </span>
                  <span
                    className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                    style={{
                      background: "oklch(0.65 0.2 80 / 15%)",
                      color: "oklch(0.78 0.18 80)",
                    }}
                  >
                    ● New
                  </span>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{
                        background: "oklch(0.58 0.22 290 / 30%)",
                        color: "oklch(0.78 0.16 290)",
                      }}
                    >
                      {caller.initial}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {caller.full}
                      </div>
                      <div className="text-yellow-400 text-xs">⭐⭐⭐⭐⭐</div>
                    </div>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.78 0.01 280)" }}
                  >
                    {reviewText.slice(0, 100)}...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI-drafted response */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              key="ai-response"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.11 0.014 280)",
                border: "1px solid oklch(0.58 0.22 290 / 30%)",
              }}
              data-ocid="demo.step5.ai_response_card"
            >
              <div
                className="px-4 py-2 flex items-center gap-2"
                style={{
                  background: "oklch(0.14 0.014 280)",
                  borderBottom: "1px solid oklch(1 0 0 / 8%)",
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.6 0.02 280)" }}
                >
                  🤖 AI Response — Drafted automatically
                </span>
              </div>
              <div className="p-4">
                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: "oklch(0.78 0.01 280)" }}
                >
                  "{typedAiResponse}
                  {aiResponseTyping &&
                    typedAiResponse.length < aiResponseText.length && (
                      <span className="animate-pulse inline-block w-0.5 h-3.5 bg-current align-middle ml-0.5" />
                    )}
                  "
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Framework badge */}
        <div className="flex justify-center">
          <FrameworkBadge
            badge={{
              ...FRAMEWORK_BADGES.ogilvy,
              label: "Ogilvy: Social Proof",
            }}
            size="sm"
          />
        </div>

        {/* Next button */}
        <AnimatePresence>
          {showNextBtn && (
            <motion.div
              key="step5-ready"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                className="text-center text-xs font-semibold mb-3"
                style={{ color: "oklch(0.55 0.14 290)" }}
              >
                Ready! Tap Next to continue →
              </p>
              <button
                type="button"
                onClick={() => setShowOverlay(true)}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 290))",
                  color: "white",
                  boxShadow: "0 4px 20px oklch(0.58 0.22 290 / 35%)",
                }}
                data-ocid="demo.step5.next_button"
              >
                Next: Your Social Media →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coach tip */}
      <AnimatePresence>
        {!coachDismissed && (
          <CoachTipCard
            message={`This is where all your Google reviews for ${biz} live. Your AI asks happy customers to leave a review — and drafts replies automatically in ${cityLabel}.`}
            onDismiss={() => setCoachDismissed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOverlay && (
          <GreenConfirmOverlay
            headline="Reputation on Auto-Pilot"
            subline="Review Requested & Response Drafted"
            items={[
              {
                icon: "📱",
                label: "SMS",
                value: "Review request sent automatically",
              },
              {
                icon: "⭐",
                label: "Review",
                value: "5-star Google review received",
              },
              {
                icon: "🤖",
                label: "Response",
                value: "AI response drafted instantly",
              },
              { icon: "🏢", label: "Business", value: biz },
            ]}
            closingLine="88% of consumers trust reviews as much as personal recommendations."
            onDone={handleOverlayDone}
            dataOcid="demo.step5.reputation_overlay"
          />
        )}
      </AnimatePresence>
    </>
  );
}
