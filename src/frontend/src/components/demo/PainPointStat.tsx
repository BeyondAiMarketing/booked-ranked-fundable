/**
 * PainPointStat — reusable component shown BEFORE each demo feature reveal.
 *
 * Dark card with purple accent border, animated count-up stat, source attribution,
 * and "What BRF does about it" line. 10 niche-specific pain points hardcoded.
 *
 * Two modes:
 *   1. Legacy card mode: pass `stat` prop (used by existing step components)
 *   2. Niche overlay mode: pass `niche` + `onComplete` (full-screen, auto-advances)
 */

import { NICHE_PAIN_POINT_STATS } from "@/data/demoFlowData";
import type {
  DemoNicheId,
  DemoNicheIdLegacy,
  PainPointStat as PainPointStatType,
} from "@/types/demo";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import FrameworkBadge from "./FrameworkBadge";

// ─── Count-up animation hook ──────────────────────────────────────────────────

function useCountUp(
  target: string,
  active: boolean,
  durationMs = 1800,
): string {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const match = target.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplay(target);
      return;
    }
    const end = Number.parseFloat(match[1]);
    const suffix = match[2] ?? "";
    const isDecimal = match[1].includes(".");
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const ease = progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
      const current = end * ease;
      setDisplay(
        isDecimal
          ? `${current.toFixed(1)}${suffix}`
          : `${Math.round(current)}${suffix}`,
      );
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, durationMs]);

  return display;
}

// ─── Source attributions ──────────────────────────────────────────────────────

type AnyNicheKey = DemoNicheId | DemoNicheIdLegacy | string;

const SOURCES: Record<string, string> = {
  plumber: "Service Titan Industry Report, 2023",
  plumbing: "Service Titan Industry Report, 2023",
  "med-spa": "American Med Spa Association, 2023",
  medspa: "American Med Spa Association, 2023",
  hvac: "ACCA Revenue Benchmarking Study, 2023",
  restoration: "IICRC Claims Response Study, 2022",
  "carpet-cleaning": "Floor Care Industry Survey, 2023",
  carpet: "Floor Care Industry Survey, 2023",
  roofing: "National Roofing Contractors Association, 2023",
  "real-estate": "NAR Buyer & Seller Generational Trends Report, 2023",
  realestate: "NAR Buyer & Seller Generational Trends Report, 2023",
  mortgage: "Mortgage Bankers Association Survey, 2023",
  chiropractor: "ACA Patient Retention Study, 2023",
  chiropractic: "ACA Patient Retention Study, 2023",
  dental: "ADA Health Policy Institute, 2023",
};

// ─── BRF response lines ───────────────────────────────────────────────────────

const BRF_RESPONSE: Record<string, string> = {
  plumber:
    "BRF's AI front desk answers every call 24/7, books the job, and sends SMS confirmation automatically.",
  plumbing:
    "BRF's AI front desk answers every call 24/7, books the job, and sends SMS confirmation automatically.",
  "med-spa":
    "BRF builds your 5-star reputation automatically and keeps your booking calendar full year-round.",
  medspa:
    "BRF builds your 5-star reputation automatically and keeps your booking calendar full year-round.",
  hvac: "BRF captures every missed call, auto-books the service, and fills revenue gaps from no-shows.",
  restoration:
    "BRF's AI responds to every emergency call in seconds, dispatches crews, and documents for insurance.",
  "carpet-cleaning":
    "BRF automates review requests and referral follow-ups so clients rebook every season.",
  carpet:
    "BRF automates review requests and referral follow-ups so clients rebook every season.",
  roofing:
    "BRF pre-qualifies storm leads via SMS, books inspections, and sequences insurance claim follow-ups.",
  "real-estate":
    "BRF's AI qualifies and nurtures leads 24/7 so you only spend time on buyers who are ready to move.",
  realestate:
    "BRF's AI qualifies and nurtures leads 24/7 so you only spend time on buyers who are ready to move.",
  mortgage:
    "BRF's AI pre-qualifies borrowers instantly and keeps your pipeline full with zero manual follow-up.",
  chiropractor:
    "BRF automates reactivation campaigns and recall reminders, recovering lost patient revenue.",
  chiropractic:
    "BRF automates reactivation campaigns and recall reminders, recovering lost patient revenue.",
  dental:
    "BRF books emergency slots instantly, sends recall reminders, and fills cancellations automatically.",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface LegacyProps {
  stat: PainPointStatType;
  niche?: never;
  onComplete?: () => void;
  delay?: never;
}

interface NicheProps {
  niche: AnyNicheKey;
  stat?: never;
  onComplete: () => void;
  /** Auto-advance delay in ms. Default 3000. */
  delay?: number;
}

type PainPointStatProps = LegacyProps | NicheProps;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PainPointStat(props: PainPointStatProps) {
  const isNicheMode = props.niche !== undefined;

  // Resolve stat: try niche key directly, then fallback to plumber
  const nicheKey = isNicheMode ? (props.niche as string) : "";
  const rawStat =
    NICHE_PAIN_POINT_STATS[nicheKey as keyof typeof NICHE_PAIN_POINT_STATS] ??
    NICHE_PAIN_POINT_STATS.plumber;
  const stat: PainPointStatType = isNicheMode
    ? rawStat
    : (props.stat as PainPointStatType);

  const delay = isNicheMode ? (props.delay ?? 3000) : 0;
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Math.ceil(delay / 1000));
  const callbackFiredRef = useRef(false);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const displayed = useCountUp(stat.stat, active);
  const source = isNicheMode ? SOURCES[nicheKey] : undefined;
  const brfResponse = isNicheMode ? BRF_RESPONSE[nicheKey] : undefined;

  // Fade in + start count-up
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 50);
    const t2 = setTimeout(() => setActive(true), 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Legacy mode: fire onComplete after 2.2s
  useEffect(() => {
    if (!isNicheMode && props.onComplete) {
      const t = setTimeout(() => props.onComplete!(), 2200);
      return () => clearTimeout(t);
    }
  }, [isNicheMode, props.onComplete]);

  // Niche mode: countdown timer
  useEffect(() => {
    if (!isNicheMode || delay === 0) return;
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isNicheMode, delay]);

  // Fire onComplete when countdown hits 0
  useEffect(() => {
    if (!isNicheMode) return;
    if (timeLeft === 0 && !callbackFiredRef.current) {
      callbackFiredRef.current = true;
      (props as NicheProps).onComplete?.();
    }
  }, [timeLeft, isNicheMode, props]);

  const handleContinue = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (!callbackFiredRef.current) {
      callbackFiredRef.current = true;
      if (isNicheMode) (props as NicheProps).onComplete?.();
    }
  };

  // ── Legacy layout (card) ────────────────────────────────────────────────────
  if (!isNicheMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        data-ocid="demo.pain_point_stat"
        className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.12 0.014 280)",
          border: "1px solid oklch(0.58 0.22 290 / 30%)",
          boxShadow:
            "0 0 40px oklch(0.58 0.22 290 / 20%), 0 0 0 1px oklch(0.58 0.22 290 / 10%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 30%, oklch(0.58 0.22 290 / 12%) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 px-8 py-10 text-center">
          <motion.div
            className="font-black leading-none mb-4"
            style={{
              fontSize: "clamp(4rem, 15vw, 7rem)",
              background:
                "linear-gradient(135deg, oklch(0.88 0.18 290) 0%, oklch(0.76 0.2 260) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            aria-live="polite"
            aria-label={`${stat.stat} — ${stat.statLabel}`}
          >
            {displayed}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-base sm:text-lg font-semibold leading-snug mx-auto max-w-sm"
            style={{ color: "oklch(0.85 0.02 280)" }}
          >
            {stat.statLabel}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-5 flex justify-center"
          >
            <FrameworkBadge badge={stat.frameworkBadge} size="sm" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ── Niche mode: full-screen overlay ────────────────────────────────────────
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.08 0.01 280) 0%, oklch(0.1 0.016 285) 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
      data-ocid="demo.pain_point_stat"
    >
      {/* Framework badge */}
      <div
        className="mb-6 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
        style={{
          background: "oklch(0.58 0.22 290 / 15%)",
          border: "1px solid oklch(0.58 0.22 290 / 35%)",
          color: "oklch(0.78 0.16 290)",
        }}
      >
        {stat.frameworkBadge.label}
      </div>

      {/* Main stat */}
      <div
        className="mb-4 text-center font-black tracking-tight"
        style={{
          fontSize: "clamp(4.5rem, 18vw, 8rem)",
          background:
            "linear-gradient(135deg, oklch(0.88 0.18 290) 0%, oklch(0.78 0.2 260) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
        }}
        aria-live="polite"
        aria-label={`Statistic: ${stat.stat}`}
      >
        {displayed}
      </div>

      {/* Label */}
      <p
        className="mb-3 max-w-lg text-center text-xl font-semibold leading-snug sm:text-2xl"
        style={{ color: "oklch(0.92 0.01 280)" }}
      >
        {stat.statLabel}
      </p>

      {/* BRF response */}
      {brfResponse && (
        <p
          className="mb-4 max-w-md text-center text-sm font-medium leading-relaxed px-4 py-3 rounded-xl"
          style={{
            color: "oklch(0.72 0.14 155)",
            background: "oklch(0.62 0.18 155 / 10%)",
            border: "1px solid oklch(0.62 0.18 155 / 20%)",
          }}
        >
          ✓ {brfResponse}
        </p>
      )}

      {/* Source */}
      {source && (
        <p
          className="mb-6 text-center text-xs"
          style={{ color: "oklch(0.45 0.02 280)" }}
        >
          Source: {source}
        </p>
      )}

      {/* Progress bar */}
      <div
        className="mb-6 w-full max-w-xs overflow-hidden rounded-full"
        style={{ height: "3px", background: "oklch(1 0 0 / 10%)" }}
        aria-label={`Auto-advancing in ${timeLeft} seconds`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${((delay / 1000 - timeLeft) / (delay / 1000)) * 100}%`,
            background:
              "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.68 0.18 290))",
            transition: "width 1s linear",
          }}
        />
      </div>

      {/* Continue button */}
      <button
        type="button"
        onClick={handleContinue}
        className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "oklch(0.58 0.22 290 / 15%)",
          border: "1px solid oklch(0.58 0.22 290 / 35%)",
          color: "oklch(0.82 0.16 290)",
        }}
        data-ocid="demo.pain_point_continue_button"
      >
        Continue ({timeLeft}s)
      </button>
    </div>
  );
}
