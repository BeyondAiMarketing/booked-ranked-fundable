/**
 * DemoStep6Social — "Your Week of Content — Already Written"
 * 7 post cards staggered fade-in, platform icons, niche-specific copy.
 * Framework badge: Brunson — "Value First"
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

// ── Platform config ───────────────────────────────────────────────────────────

const PLATFORMS = [
  { name: "Facebook", icon: "📘", color: "oklch(0.6 0.18 240)" },
  { name: "Instagram", icon: "📸", color: "oklch(0.65 0.22 340)" },
  { name: "LinkedIn", icon: "💼", color: "oklch(0.6 0.18 240)" },
  { name: "Instagram", icon: "📸", color: "oklch(0.65 0.22 340)" },
  { name: "Facebook", icon: "📘", color: "oklch(0.6 0.18 240)" },
  { name: "LinkedIn", icon: "💼", color: "oklch(0.6 0.18 240)" },
  { name: "Instagram", icon: "📸", color: "oklch(0.65 0.22 340)" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── Niche post content ────────────────────────────────────────────────────────

function buildPosts(biz: string, niche: DemoNicheId): string[] {
  const content: Record<DemoNicheId, string[]> = {
    plumber: [
      `💧 FACT: 30% of home water waste comes from hidden leaks you can't see. ${biz} offers free leak checks — book yours this week before it costs you thousands.`,
      `Before our client called us, they'd had "a small drip" for 6 months. The repair bill? $8,400. ${biz} caught it early. Don't wait. ⚡`,
      `🔧 Why ${biz}? Because we answer at 2am when your pipes burst — not "during business hours." 24/7 emergency response. Save our number now.`,
      `⭐ New 5-star review: "Showed up in under an hour, fixed everything, and the pricing was completely fair. These guys are the real deal." — Mike T.`,
      `Most plumbing emergencies get worse every hour you wait. ${biz} offers same-day dispatch. Call before a small problem becomes a $5,000 disaster. 🏠`,
      `💡 Pro tip from ${biz}: Know where your main water shutoff valve is BEFORE you need it. We'll show you for free on your next visit.`,
      `The average home loses 10,000 gallons of water per year to leaks. ${biz} stops the leak AND the loss. Schedule your free audit today.`,
    ],
    "med-spa": [
      `✨ The most-asked question at ${biz}: "How did you get results so natural?" Simple — we listen before we treat. Book your consultation.`,
      `Before & After: Our client wanted to "look refreshed, not done." That's exactly what she got. ${biz} specializes in results that make people ask what your skincare secret is.`,
      `💉 Botox myth: "It'll make me look frozen." Truth: Done right, it makes you look like you slept 8 hours. ${biz} — natural results, always.`,
      `⭐ "I've never felt so heard at a medical spa. The team at ${biz} actually cares about your face, not just your wallet." — Ashley C.`,
      `📅 4 slots left for this month's membership pricing at ${biz}. Once they're gone, the rate goes up. Don't wait — DM us now.`,
      `Treating fine lines isn't vanity — it's maintenance. ${biz} clients call it an investment in confidence. Your first visit includes a complimentary skin analysis.`,
      `🎁 Refer a friend to ${biz} and you both receive 20% off your next treatment. Real results, real rewards.`,
    ],
    hvac: [
      `🌡️ Fact: HVAC systems that aren't serviced annually use 25% more energy. ${biz} tune-ups pay for themselves — often in the first month.`,
      `Before: A family of four with $380/month electric bills. After one ${biz} service call: $210/month. Same house. Huge difference.`,
      `⚡ Your AC is working overtime right now. If it breaks in 95° heat, most companies have a 3-day wait. ${biz} offers same-day emergency service — save our number.`,
      `⭐ "Called at 9pm on a Sunday. They were there by 10:30pm, had it running by midnight, and the price was completely fair." — Sandra W.`,
      `Pre-season tune-up vs. emergency repair: $89 vs. $1,800+. ${biz} is booking fall maintenance now — slots fill up fast. Call today.`,
      `💡 Most HVAC emergencies are preventable. ${biz} offers a free 12-point system check with any service call. Don't wait for a breakdown.`,
      `The best time to service your system is before it fails. The second best time is right now. ${biz} — same-day availability this week. 📞`,
    ],
    restoration: [
      `🚨 Water damage gets exponentially worse every hour it sits. ${biz} guarantees a response team on-site within 60 minutes, 24/7/365.`,
      `Before: A homeowner with 3 inches of water in their basement at 2am. After calling ${biz}: mitigated, documented, and insurance approved in 72 hours.`,
      `Most insurance claims are underpaid because the damage isn't properly documented. ${biz} handles the entire claims process — you focus on your family.`,
      `⭐ "They showed up at midnight, stayed until 4am, and handled EVERYTHING including talking to our insurance agent. I can't thank ${biz} enough." — David N.`,
      `🔥 Fire, flood, or mold — ${biz} restores more than buildings. We restore peace of mind. Free emergency assessment, 24/7.`,
      `Did you know? Mold can begin growing within 24-48 hours of water damage. ${biz} dries, treats, and documents everything — protecting your home and your claim.`,
      `When disaster strikes, you need one number to call. Save ${biz} in your phone now — before you ever need us. 📱`,
    ],
    "carpet-cleaning": [
      `🏆 The stain your last cleaner "couldn't get out"? ${biz} has a 94% first-time removal rate on set-in stains. Book this week.`,
      `Before: 3-year-old red wine stain on white carpet. After: Gone. The family still doesn't believe it. ${biz} — we do the "impossible" regularly.`,
      `💡 Carpets hold up to 4x their weight in dirt before you can see it. Professional cleaning isn't cosmetic — it's hygiene. ${biz} serves your area this week.`,
      `⭐ "My carpets look brand new. I was going to replace them — now I don't have to. ${biz} saved me $4,000." — Jennifer P.`,
      `Most carpet warranties require professional cleaning every 12-18 months. ${biz} provides the certified documentation you need — and results that speak for themselves.`,
      `🌱 ${biz} uses green-certified cleaning solutions that are safe for kids, pets, and the planet — without sacrificing results.`,
      `Same-day service slots are available this week. ${biz} comes to you — no prep work needed. Book in 60 seconds online. 📞`,
    ],
    roofing: [
      `🏠 Most homeowners don't know they have storm damage until they file a claim and get denied. ${biz} offers free inspections that find what insurance adjusters miss.`,
      `Before: A homeowner denied an insurance claim. After ${biz} re-inspection with photo documentation: $24,000 claim approved. Free service. Real results.`,
      `⚡ That last storm that came through your area? Hail damage isn't always visible from the ground. ${biz} — free drone inspection, no obligation.`,
      `⭐ "They found damage I had no idea existed, handled the entire insurance process, and my new roof was installed in one day." — Robert M.`,
      `Storm season doesn't stop. Neither does ${biz}. 24/7 emergency tarping and same-week inspections available. Protect your home now.`,
      `💡 Roofs don't fail suddenly — they deteriorate over time. Annual inspections catch $500 problems before they become $15,000 replacements. ${biz} makes it free.`,
      `Your roof is the only thing between your family and the weather. Treat it like it matters — free inspection from ${biz} this week. 🏆`,
    ],
    "real-estate": [
      `🏡 78% of buyers choose the first agent who responds. ${biz} uses AI to respond to every inquiry in under 60 seconds — 24/7. That's the edge that wins deals.`,
      `Listed at $485K. Sold at $512K in 6 days. ${biz} — strategic pricing, aggressive marketing, and a network of qualified buyers already looking in your area.`,
      `💡 The most expensive mistake sellers make: pricing too high and sitting on market. ${biz} uses live market data to price your home to sell — not to sit.`,
      `⭐ "Sold above asking in a tough market. The communication was outstanding — I always knew exactly what was happening." — Lisa T.`,
      `Thinking of selling in the next 12 months? Start NOW. Pre-listing prep is the difference between average and top-dollar. Free market analysis from ${biz}.`,
      `Buyers: Inventory is still tight. Pre-approved, prepared buyers win. ${biz} has 3 off-market listings that match what you're looking for. Let's talk.`,
      `📊 Market update: Average days on market in our area just dropped to 11. ${biz} — the right agent at exactly the right time. Free consultation this week.`,
    ],
    mortgage: [
      `📉 Most people think they can't afford a home right now. ${biz} has helped 47 families close this quarter using programs they didn't know existed. Free consultation.`,
      `Before: A buyer rejected by two lenders with a 642 credit score. After 60 days with ${biz}'s credit optimization: 698 score, approved, $312/month lower payment.`,
      `💡 Your interest rate isn't just about credit score. ${biz} accesses 40+ lenders to find the best combination of rate, term, and fees for your specific situation.`,
      `⭐ "I was certain we couldn't buy in this market. ${biz} found a program we'd never heard of — and we closed in 28 days." — Tom B.`,
      `Rate headlines are averages. Your rate is personal. ${biz} — free rate analysis based on your actual profile, not a national average. Takes 10 minutes.`,
      `FHA, VA, USDA, Conventional, Jumbo — the right loan isn't the lowest rate, it's the lowest TRUE cost. ${biz} runs the full comparison every time.`,
      `📞 Pre-approval in 24 hours. Close in 21 days. ${biz} — because in today's market, speed is the difference between your dream home and someone else's.`,
    ],
    chiropractor: [
      `🦴 Did you know? Most lower back pain isn't caused by what you think. ${biz} does a complimentary 15-minute assessment to find the real source. Book this week.`,
      `Before: A patient on 3 prescription pain medications after 2 years of suffering. After 8 visits with ${biz}: medication-free, playing with his kids again.`,
      `💡 Most headaches aren't from stress — they originate from cervical spine tension. ${biz} has helped 200+ patients eliminate chronic headaches without medication.`,
      `⭐ "I've had back pain for 6 years. After my first adjustment at ${biz}, I felt relief I hadn't felt in years. I wish I'd come sooner." — Patricia C.`,
      `Your spine controls everything. When it's aligned, your whole body functions better. ${biz} — new patient evaluation includes full digital x-ray analysis. Limited slots this week.`,
      `🌱 Chiropractic isn't just for back pain. ${biz} patients report improvements in sleep, energy, digestion, and immune function. Your body is more connected than you think.`,
      `Pain-free isn't a luxury — it's your baseline. ${biz} — first visit includes complete evaluation, digital x-rays, and your personalized care plan. Book now. 📱`,
    ],
    dental: [
      `😁 Most dental emergencies happen on weekends. ${biz} has same-day emergency slots Monday-Saturday and after-hours coverage. Save our number now.`,
      `Before: A patient who hadn't seen a dentist in 7 years — terrified. After one gentle visit with ${biz}: already scheduled for a full treatment plan. Zero anxiety.`,
      `💡 Dental infections don't resolve on their own — they escalate. ${biz} treats same-day to prevent a $400 problem from becoming a $4,000 emergency.`,
      `⭐ "Broke a tooth on Friday. ${biz} got me in within 2 hours, fixed it completely, and I was at my daughter's soccer game by 5pm." — Marcus J.`,
      `Most patients at ${biz} had "dental anxiety" before their first visit. Our approach: explain everything, never rush, and earn your trust one visit at a time. 🙏`,
      `🦷 Your oral health affects your heart health, your diabetes, your pregnancy outcomes. ${biz} — comprehensive care that looks beyond your teeth.`,
      `New patient special at ${biz}: Complete exam + digital x-rays + cleaning for $97. We accept most insurance. We also offer payment plans. No reason to wait. Book today.`,
    ],
  };

  return content[niche] ?? content.plumber;
}

const NICHE_PAIN: Record<DemoNicheId, { stat: string; label: string }> = {
  plumber: {
    stat: "3x",
    label:
      "more inbound leads for local businesses that post consistently on social media",
  },
  "med-spa": {
    stat: "68%",
    label:
      "of med spa clients say Instagram was where they first discovered the practice",
  },
  hvac: {
    stat: "4.2x",
    label:
      "more service calls for HVAC companies with active social media vs. those without",
  },
  restoration: {
    stat: "71%",
    label:
      "of homeowners who needed restoration found the company through social or search",
  },
  "carpet-cleaning": {
    stat: "58%",
    label:
      "of carpet cleaning bookings come from clients who saw before/after content on social",
  },
  roofing: {
    stat: "47%",
    label:
      "of storm damage leads come through social media posts in the 48 hours after a storm",
  },
  "real-estate": {
    stat: "85%",
    label:
      "of buyers say they found their agent through social media or an online recommendation",
  },
  mortgage: {
    stat: "62%",
    label:
      "of mortgage borrowers under 45 found their broker through social media or online search",
  },
  chiropractor: {
    stat: "73%",
    label:
      "of chiropractic patients say before/after social content influenced their decision to book",
  },
  dental: {
    stat: "66%",
    label:
      "of new dental patients under 50 say they found their dentist through social media",
  },
};

// ── Post card component ───────────────────────────────────────────────────────

function PostCard({
  index,
  platform,
  post,
  visible,
}: {
  index: number;
  platform: (typeof PLATFORMS)[0];
  post: string;
  visible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 10,
        scale: visible ? 1 : 0.97,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-xl overflow-hidden"
      style={{
        background: "oklch(0.11 0.015 285)",
        border: `1px solid ${platform.color.replace(")", " / 22%)")}`,
      }}
      data-ocid={`demo.step6.post.item.${index + 1}`}
    >
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{
          background: "oklch(0.14 0.014 285)",
          borderBottom: "1px solid oklch(1 0 0 / 6%)",
        }}
      >
        <span className="text-base">{platform.icon}</span>
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: platform.color }}
        >
          {platform.name}
        </span>
        <span
          className="ml-auto text-[9px]"
          style={{ color: "oklch(0.45 0.02 280)" }}
        >
          {DAYS[index]}
        </span>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{
            background: "oklch(0.55 0.22 155 / 15%)",
            color: "oklch(0.72 0.16 155)",
          }}
        >
          ✓ Scheduled
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p
          className="text-[11px] leading-relaxed line-clamp-3"
          style={{ color: "oklch(0.75 0.01 280)" }}
        >
          {post}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DemoStep6Social() {
  const { businessName, city, niche, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const cityLabel = city || "your area";
  const nicheKey = (niche || "plumber") as DemoNicheId;
  const posts = buildPosts(biz, nicheKey);
  const pain = NICHE_PAIN[nicheKey] ?? NICHE_PAIN.plumber;

  const [visibleCount, setVisibleCount] = useState(0);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [coachDismissed, setCoachDismissed] = useState(false);

  const handleOverlayDone = useCallback(() => {
    setShowOverlay(false);
    completeStep();
  }, [completeStep]);

  useEffect(() => {
    if (visibleCount >= posts.length) {
      const t = setTimeout(() => {
        setShowNextBtn(true);
        completeStep();
      }, 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 600);
    return () => clearTimeout(t);
  }, [visibleCount, posts.length, completeStep]);

  return (
    <>
      <div
        className="w-full max-w-lg mx-auto flex flex-col gap-4 relative"
        data-ocid="demo.step6.section"
      >
        {/* Benefit pill — desktop only, never overlaps mobile text */}
        <BenefitPill
          benefit={`Stay visible in ${cityLabel} online — without lifting a finger.`}
        />

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
            Act 2 · Step 6 — Social Media
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Your Week of Content —<br />
            <span style={{ color: "oklch(0.72 0.18 155)" }}>
              Already Written
            </span>
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
            border: "1px solid oklch(0.65 0.18 200 / 25%)",
          }}
        >
          <span
            className="block text-4xl font-black mb-1"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.82 0.16 200), oklch(0.7 0.2 180))",
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

        {/* Posts grid */}
        <div className="grid grid-cols-1 gap-2">
          {posts.map((post, i) => (
            <PostCard
              key={DAYS[i]}
              index={i}
              platform={PLATFORMS[i]}
              post={post}
              visible={i < visibleCount}
            />
          ))}
        </div>

        {/* Framework badge */}
        <div className="flex justify-center">
          <FrameworkBadge
            badge={{
              ...FRAMEWORK_BADGES.brunson,
              label: "Brunson: Value First",
            }}
            size="sm"
          />
        </div>

        {/* Next button */}
        <AnimatePresence>
          {showNextBtn && (
            <motion.div
              key="step6-ready"
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
                data-ocid="demo.step6.next_button"
              >
                Next: The Surprise →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Coach tip */}
      <AnimatePresence>
        {!coachDismissed && (
          <CoachTipCard
            message={`Your AI writes and schedules posts for ${biz} on Facebook and Instagram — you never have to think about social media again in ${cityLabel}.`}
            onDismiss={() => setCoachDismissed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOverlay && (
          <GreenConfirmOverlay
            headline="Social Media Ready"
            subline="7 Posts Scheduled Across 3 Platforms"
            items={[
              { icon: "📘", label: "Facebook", value: "3 posts scheduled" },
              { icon: "📸", label: "Instagram", value: "3 posts scheduled" },
              { icon: "💼", label: "LinkedIn", value: "2 posts scheduled" },
              {
                icon: "🤖",
                label: "AI Generated",
                value: "All posts written in your brand voice",
              },
            ]}
            closingLine="Consistent social presence generates 3x more inbound leads."
            onDone={handleOverlayDone}
            dataOcid="demo.step6.social_overlay"
          />
        )}
      </AnimatePresence>
    </>
  );
}
