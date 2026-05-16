/**
 * DemoStep1Website — FULL REWRITE
 *
 * Website Before/After reveal — Act 1, Step 1.
 *
 * CRITICAL: Audio preload starts here via useEffect on mount.
 *
 * Flow:
 *   1. Pain point stat shown first (niche-specific, auto-advances at 2800ms)
 *   2. Animated before/after flip (CSS perspective transform, 800ms)
 *   3. "After" shows BRF-built niche website with their business name
 *   4. CTA advances to step 2
 *
 * Framework badge: Brunson "Epiphany Bridge"
 */

import { useCredentials } from "@/context/CredentialsContext";
import { FRAMEWORK_BADGES, NICHE_WEBSITE_DATA } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import {
  NICHE_VOICE_SCRIPTS,
  buildScriptLines,
  preloadAllAudio,
  preloadNicheScripts,
  unlockAudioContext,
} from "@/services/audioService";
import type { DemoNicheId } from "@/types/demo";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import FrameworkBadge from "./FrameworkBadge";
import PainPointStat from "./PainPointStat";

// ─── Niche colors for "after" site ───────────────────────────────────────────

const NICHE_AFTER_COLORS: Record<string, { accent: string; headline: string }> =
  {
    plumber: {
      accent: "oklch(0.55 0.18 220)",
      headline: "24/7 AI-Powered Plumbing",
    },
    "med-spa": {
      accent: "oklch(0.62 0.2 340)",
      headline: "Luxury Med Spa Experience",
    },
    hvac: {
      accent: "oklch(0.58 0.18 210)",
      headline: "Emergency HVAC — Same Day",
    },
    restoration: {
      accent: "oklch(0.58 0.18 220)",
      headline: "24/7 Emergency Restoration",
    },
    "carpet-cleaning": {
      accent: "oklch(0.6 0.16 80)",
      headline: "Professional Deep Clean Pros",
    },
    roofing: {
      accent: "oklch(0.58 0.14 60)",
      headline: "Trusted Roofing Experts",
    },
    "real-estate": {
      accent: "oklch(0.6 0.18 150)",
      headline: "Your Premier Realty Partner",
    },
    mortgage: {
      accent: "oklch(0.58 0.2 290)",
      headline: "Expert Mortgage Advisors",
    },
    chiropractor: {
      accent: "oklch(0.6 0.18 180)",
      headline: "Expert Chiropractic Care",
    },
    dental: {
      accent: "oklch(0.62 0.2 15)",
      headline: "Modern Family Dental Practice",
    },
  };

// ─── Mock browser window ─────────────────────────────────────────────────────

function MockBrowser({
  mode,
  niche,
  biz,
}: {
  mode: "before" | "after";
  niche: string;
  biz: string;
}) {
  const nicheKey = niche as DemoNicheId;
  const websiteData =
    NICHE_WEBSITE_DATA[nicheKey] ?? NICHE_WEBSITE_DATA.plumber;
  const afterColors = NICHE_AFTER_COLORS[niche] ?? NICHE_AFTER_COLORS.plumber;

  const isAfter = mode === "after";
  const title = isAfter
    ? websiteData.after.title.replace("[businessName]", biz)
    : websiteData.before.title;
  const bullets = isAfter
    ? websiteData.after.bullets
    : websiteData.before.bullets;

  const url = isAfter
    ? `bookedrankedfunded.org/${niche}/${biz.toLowerCase().replace(/\s+/g, "-")}`
    : "oldwebsite.com/home.html";

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        border: isAfter
          ? `2px solid ${afterColors.accent} / 50%`
          : "2px solid oklch(0.52 0.18 25 / 30%)",
        boxShadow: isAfter ? `0 0 40px ${afterColors.accent} / 18%` : "none",
      }}
    >
      {/* Browser chrome */}
      <div
        className="px-3 py-2 flex items-center gap-2"
        style={{
          background: isAfter ? "oklch(0.1 0.02 290)" : "oklch(0.14 0.005 280)",
        }}
      >
        <div className="flex gap-1.5 shrink-0">
          {["#e74c3c", "#f39c12", "#2ecc71"].map((c) => (
            <div
              key={c}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>
        <div
          className="flex-1 rounded-md px-3 py-1 text-[11px] font-mono truncate"
          style={{
            background: "oklch(0.08 0.008 280)",
            color: isAfter ? "oklch(0.62 0.12 155)" : "oklch(0.45 0.02 280)",
          }}
        >
          {isAfter ? "🔒 " : ""}
          {url}
        </div>
      </div>

      {/* Hero section */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background: isAfter
            ? "linear-gradient(145deg, oklch(0.09 0.02 292), oklch(0.12 0.03 288))"
            : "oklch(0.16 0.005 280)",
        }}
      >
        {/* "After" hero has the business name big */}
        {isAfter ? (
          <div className="mb-4">
            <div
              className="text-[11px] font-bold uppercase tracking-widest mb-1"
              style={{ color: "oklch(0.62 0.14 155)" }}
            >
              ● AI-Powered · 24/7 Available
            </div>
            <h3
              className="font-black text-xl leading-tight mb-1"
              style={{
                background: `linear-gradient(135deg, white 0%, ${afterColors.accent} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {biz}
            </h3>
            <p className="text-xs" style={{ color: "oklch(0.58 0.02 280)" }}>
              {afterColors.headline}
            </p>
          </div>
        ) : (
          <h3
            className="font-bold text-base mb-3"
            style={{ color: "oklch(0.6 0.02 280)" }}
          >
            {title}
          </h3>
        )}

        {/* Bullets */}
        <ul className="space-y-1.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-xs">
              <span
                style={{
                  color: isAfter
                    ? "oklch(0.62 0.18 155)"
                    : "oklch(0.52 0.18 25)",
                  marginTop: 1,
                }}
              >
                {isAfter ? "✓" : "✗"}
              </span>
              <span
                style={{
                  color: isAfter
                    ? "oklch(0.8 0.01 280)"
                    : "oklch(0.5 0.02 280)",
                }}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>

        {/* After: CTA + reviews strip */}
        {isAfter && (
          <div className="mt-4 space-y-2">
            <div
              className="w-full py-2 rounded-xl text-center text-xs font-black text-white"
              style={{
                background: `linear-gradient(135deg, ${afterColors.accent}, oklch(0.48 0.18 160))`,
              }}
            >
              Book Online — Available 24/7
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "oklch(0.62 0.18 155 / 10%)" }}
            >
              <span className="text-xs">⭐⭐⭐⭐⭐</span>
              <span
                className="text-[11px]"
                style={{ color: "oklch(0.72 0.12 155)" }}
              >
                94 Google reviews · 4.9 stars
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DemoStep1Website() {
  const { businessName, niche, completeStep } = useDemoFlow();
  const { creds } = useCredentials();
  const biz = businessName || "Your Business";
  const nicheKey = (niche || "plumber") as string;

  const [showStat, setShowStat] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  // CRITICAL: Audio preload starts on mount here as a belt-and-suspenders backup.
  // Primary preload happens on Step 0 submit (after user gesture unlocks AudioContext).
  // This useEffect handles the case where a user refreshes directly to step 1.
  useEffect(() => {
    const script = NICHE_VOICE_SCRIPTS[nicheKey] ?? NICHE_VOICE_SCRIPTS.plumber;
    const lines = buildScriptLines(script, biz);
    // AudioContext-based preload (primary path — only works if already unlocked)
    void preloadNicheScripts(
      nicheKey,
      biz,
      creds?.elevenLabsKey ?? "",
      creds?.openaiKey ?? "",
    );
    // Legacy blob cache preload (fallback)
    void preloadAllAudio(lines, script.voiceId, {
      elevenLabsKey: creds?.elevenLabsKey ?? "",
      openaiKey: creds?.openaiKey ?? "",
    });
  }, [nicheKey, biz, creds]);

  // NOTE: Do NOT auto-call completeStep() here.
  // The user must click the "Next" button so we get a user gesture for AudioContext.
  // That button click also calls unlockAudioContext() as a second-chance unlock.

  // Auto-flip to "after" after pain stat clears
  useEffect(() => {
    if (!showStat) {
      const t = setTimeout(() => setIsFlipped(true), 600);
      return () => clearTimeout(t);
    }
  }, [showStat]);

  if (showStat) {
    return (
      <PainPointStat
        niche={(niche as DemoNicheId) || "plumber"}
        onComplete={() => setShowStat(false)}
        delay={2800}
      />
    );
  }

  return (
    <div
      className="w-full max-w-lg mx-auto flex flex-col gap-4"
      data-ocid="demo.step1.section"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-1"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Act 1 · Step 1 — Your Front-End Services
        </p>
        <h2 className="text-2xl font-black text-white leading-tight">
          Your Website — Already Built
        </h2>
        <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.02 280)" }}>
          BRF built it for{" "}
          <span className="text-white font-semibold">{biz}</span> — complete
          with AI booking & review automation
        </p>
      </motion.div>

      {/* Before/After toggle tabs */}
      <div
        className="flex gap-2"
        role="tablist"
        aria-label="Website comparison"
      >
        <button
          type="button"
          role="tab"
          aria-selected={!isFlipped}
          data-ocid="demo.step1.before_tab"
          onClick={() => setIsFlipped(false)}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all"
          style={
            !isFlipped
              ? {
                  background: "oklch(0.52 0.18 25 / 18%)",
                  borderColor: "oklch(0.52 0.18 25 / 45%)",
                  color: "oklch(0.78 0.12 25)",
                }
              : {
                  background: "oklch(1 0 0 / 5%)",
                  borderColor: "oklch(1 0 0 / 10%)",
                  color: "oklch(0.5 0.02 280)",
                }
          }
        >
          ✗ Before BRF
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isFlipped}
          data-ocid="demo.step1.after_tab"
          onClick={() => setIsFlipped(true)}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all"
          style={
            isFlipped
              ? {
                  background: "oklch(0.55 0.22 155 / 18%)",
                  borderColor: "oklch(0.55 0.22 155 / 45%)",
                  color: "oklch(0.78 0.18 155)",
                }
              : {
                  background: "oklch(1 0 0 / 5%)",
                  borderColor: "oklch(1 0 0 / 10%)",
                  color: "oklch(0.5 0.02 280)",
                }
          }
        >
          ✓ After BRF
        </button>
      </div>

      {/* Flip container */}
      <div
        style={{ perspective: "1200px" }}
        className="w-full"
        data-ocid={
          isFlipped ? "demo.step1.after_site" : "demo.step1.before_site"
        }
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 0 : 180 }}
          initial={{ rotateY: 180 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            minHeight: 280,
          }}
        >
          {/* Front = After */}
          <div style={{ backfaceVisibility: "hidden" }}>
            <MockBrowser mode="after" niche={nicheKey} biz={biz} />
          </div>
          {/* Back = Before */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute",
              inset: 0,
            }}
          >
            <MockBrowser mode="before" niche={nicheKey} biz={biz} />
          </div>
        </motion.div>
      </div>

      {/* "After" confirmation strip */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold"
          style={{
            background: "oklch(0.55 0.22 155 / 12%)",
            border: "1px solid oklch(0.55 0.22 155 / 32%)",
            color: "oklch(0.72 0.16 155)",
          }}
        >
          ✅ Your website is live and converting 24/7
        </motion.div>
      )}

      {/* Framework badge */}
      <div className="flex justify-center">
        <FrameworkBadge badge={FRAMEWORK_BADGES.brunson} size="sm" />
      </div>

      {/* CTA to advance */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        data-ocid="demo.step1.next_button"
        onClick={() => {
          // Second-chance AudioContext unlock — ensures iOS Safari is unlocked
          // even if Step 0 submit didn't fully complete the unlock.
          unlockAudioContext();
          completeStep();
        }}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.50 0.24 300))",
          boxShadow: "0 8px 28px oklch(0.58 0.22 290 / 35%)",
        }}
      >
        Your AI is ready to answer your calls →
      </motion.button>
    </div>
  );
}
