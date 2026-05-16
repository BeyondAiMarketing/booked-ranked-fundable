// DemoStep8Social — Social media content calendar + trial lock concept
// Framework: Brunson (hook — show the tangible deliverable upfront)

import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { DemoNicheId } from "@/types/demo";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const PLATFORM_ICONS: { name: string; icon: string; color: string }[] = [
  { name: "Facebook", icon: "📘", color: "oklch(0.6 0.18 240)" },
  { name: "Instagram", icon: "📸", color: "oklch(0.7 0.2 330)" },
  { name: "LinkedIn", icon: "💼", color: "oklch(0.6 0.18 220)" },
  { name: "Google", icon: "🔍", color: "oklch(0.72 0.2 45)" },
];

const NICHE_POST_TOPICS: Record<DemoNicheId, string[]> = {
  plumber: [
    "Emergency tips",
    "Before/after",
    "5★ review",
    "Pro tip",
    "Seasonal",
    "FAQ",
    "Team intro",
    "Promo deal",
    "How-to",
    "Testimonial",
    "Behind the scenes",
    "Expert insight",
    "Customer story",
    "Service spotlight",
    "Industry stat",
  ],
  "med-spa": [
    "Skin care tip",
    "Treatment reveal",
    "Client glow-up",
    "Expert advice",
    "Product pick",
    "FAQ answer",
    "Testimonial",
    "Behind the scenes",
    "Before/after",
    "Seasonal offer",
    "Staff intro",
    "Procedure info",
    "Self-care tip",
    "Industry trend",
    "Promotion",
  ],
  hvac: [
    "Energy tip",
    "Seasonal alert",
    "Customer win",
    "Maintenance tip",
    "5★ review",
    "Emergency guide",
    "Product feature",
    "Team photo",
    "Before/after",
    "FAQ",
    "Storm prep",
    "Cost savings",
    "Pro advice",
    "Promo deal",
    "Testimonial",
  ],
  restoration: [
    "Emergency guide",
    "Before/after",
    "Insurance tip",
    "5★ review",
    "Team intro",
    "Storm alert",
    "Process video",
    "FAQ",
    "Testimonial",
    "Safety tip",
    "Local news",
    "Service highlight",
    "Expert insight",
    "Promo",
    "Customer story",
  ],
  "carpet-cleaning": [
    "Before/after",
    "Stain tip",
    "5★ review",
    "Pet-friendly promo",
    "FAQ",
    "How-to",
    "Seasonal deal",
    "Testimonial",
    "Behind the scenes",
    "Product pick",
    "Team intro",
    "DIY tip",
    "Expert advice",
    "Customer win",
    "Promo",
  ],
  roofing: [
    "Storm prep",
    "Before/after",
    "5★ review",
    "Insurance tip",
    "Warranty info",
    "Team photo",
    "FAQ",
    "Testimonial",
    "Safety tip",
    "Local weather",
    "Service highlight",
    "Seasonal promo",
    "Expert insight",
    "Customer story",
    "DIY don't",
  ],
  "real-estate": [
    "Market update",
    "Listing spotlight",
    "Buyer tip",
    "5★ review",
    "Neighborhood guide",
    "Investment insight",
    "Client win",
    "FAQ",
    "Behind scenes",
    "Staging tip",
    "Local stat",
    "Seller tip",
    "Testimonial",
    "New listing",
    "Closing story",
  ],
  mortgage: [
    "Rate update",
    "Buyer tip",
    "FAQ",
    "5★ review",
    "First-time buyer guide",
    "Refinance tip",
    "Expert insight",
    "Market news",
    "Testimonial",
    "Process breakdown",
    "Client win",
    "Credit tip",
    "Local update",
    "Promo rate",
    "Referral story",
  ],
  chiropractor: [
    "Posture tip",
    "Patient win",
    "FAQ",
    "5★ review",
    "Pain relief tip",
    "Behind scenes",
    "Team intro",
    "Exercise guide",
    "Testimonial",
    "Ergonomics tip",
    "Seasonal health",
    "Condition spotlight",
    "Insurance guide",
    "Before/after",
    "Expert advice",
  ],
  dental: [
    "Oral care tip",
    "Patient smile",
    "FAQ",
    "5★ review",
    "Fear relief",
    "Treatment spotlight",
    "Team intro",
    "Insurance tip",
    "Before/after",
    "Whitening guide",
    "Expert advice",
    "Behind scenes",
    "Child care tip",
    "Testimonial",
    "Seasonal promo",
  ],
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function DemoStep8Social() {
  const { demoProspect, setStepComplete } = useDemoFlow();
  const niche = demoProspect?.niche ?? "plumber";
  const topics = NICHE_POST_TOPICS[niche as DemoNicheId];

  const [filledCells, setFilledCells] = useState(0);
  const [showLock, setShowLock] = useState(false);
  const totalCells = 21; // 7 days × 3 rows

  useEffect(() => {
    let i = 0;
    const interval = setInterval(
      () => {
        i++;
        setFilledCells(i);
        if (i >= totalCells) {
          clearInterval(interval);
          setTimeout(() => {
            setShowLock(true);
            setStepComplete(true);
          }, 400);
        }
      },
      totalCells > 0 ? 2000 / totalCells : 100,
    );
    return () => clearInterval(interval);
  }, [setStepComplete]);

  return (
    <div
      className="flex flex-col items-center gap-6"
      data-ocid="demo.step8.section"
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Social Media Automation
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Your Social Media —{" "}
          <span style={{ color: "oklch(0.78 0.16 290)" }}>Running Itself</span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: "oklch(0.65 0.02 280)" }}>
          BRF clients average{" "}
          <strong className="text-white">4.2x more engagement</strong> within 30
          days.
        </p>
      </div>

      {/* Trial lock concept */}
      <div
        className="w-full max-w-lg rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{
          background: "oklch(0.58 0.22 290 / 8%)",
          border: "1px solid oklch(0.58 0.22 290 / 25%)",
        }}
      >
        <span className="text-xl flex-shrink-0 mt-0.5">📅</span>
        <div>
          <p className="text-sm font-bold text-white">
            During your 7-day trial, BRF generates and publishes your entire
            first week of social content — automatically.
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(0.65 0.02 280)" }}>
            Platform-native format for Facebook, Instagram, LinkedIn, and Google
            Business Profile.
          </p>
        </div>
      </div>

      {/* Platform badges */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {PLATFORM_ICONS.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              background: `${p.color}/10%`,
              borderColor: `${p.color}/25%`,
              color: p.color,
            }}
          >
            <span>{p.icon}</span>
            {p.name}
          </div>
        ))}
      </div>

      {/* 7-day content calendar */}
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.12 0.014 280)",
          border: "1px solid oklch(1 0 0 / 10%)",
        }}
        data-ocid="demo.step8.calendar"
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{
            borderColor: "oklch(1 0 0 / 8%)",
            background: "oklch(0.14 0.016 285)",
          }}
        >
          <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
            7-Day Content Calendar — Auto-Generated
          </span>
          <span
            className="text-xs font-semibold animate-pulse"
            style={{ color: "oklch(0.62 0.18 155)" }}
          >
            ● Filling in…
          </span>
        </div>

        <div className="p-3">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[9px] font-bold uppercase"
                style={{ color: "oklch(0.5 0.02 280)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* 3 rows × 7 days */}
          {[0, 1, 2].map((row) => (
            <div key={row} className="grid grid-cols-7 gap-1 mb-1">
              {DAYS.map((day, col) => {
                const cellIndex = row * 7 + col;
                const isFilled = cellIndex < filledCells;
                const topic = topics[cellIndex] ?? "Post";
                return (
                  <AnimatePresence key={`${row}-${day}`}>
                    {isFilled ? (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          damping: 16,
                          stiffness: 300,
                        }}
                        className="rounded-lg px-1.5 py-2 text-center"
                        style={{
                          background: "oklch(0.58 0.22 290 / 15%)",
                          border: "1px solid oklch(0.58 0.22 290 / 25%)",
                          minHeight: 40,
                        }}
                      >
                        <p
                          className="text-[9px] leading-tight font-semibold"
                          style={{ color: "oklch(0.75 0.14 290)" }}
                        >
                          {topic}
                        </p>
                        <div className="flex justify-center gap-0.5 mt-1">
                          {PLATFORM_ICONS.slice(0, 2).map((p) => (
                            <span key={p.name} className="text-[8px]">
                              {p.icon}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <div
                        className="rounded-lg"
                        style={{
                          background: "oklch(0.1 0.01 280)",
                          border: "1px dashed oklch(1 0 0 / 8%)",
                          minHeight: 40,
                        }}
                      />
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          ))}
        </div>

        {/* Day 8 lock */}
        <AnimatePresence>
          {showLock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-3 flex items-center gap-3 border-t"
              style={{
                borderColor: "oklch(0.6 0.22 25 / 25%)",
                background: "oklch(0.6 0.22 25 / 8%)",
              }}
              data-ocid="demo.step8.trial_lock"
            >
              <span className="text-lg">🔒</span>
              <div>
                <p
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.78 0.18 25)" }}
                >
                  Day 8 — Content creation locks after your trial
                </p>
                <p
                  className="text-[10px]"
                  style={{ color: "oklch(0.6 0.02 280)" }}
                >
                  Your existing content stays live · New generation requires
                  subscription
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
