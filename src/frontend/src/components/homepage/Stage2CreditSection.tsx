import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface FundingTier {
  threshold: number;
  label: string;
  amount: string;
  colorClass: string;
  activeStyle: React.CSSProperties;
  inactiveStyle: React.CSSProperties;
  amountTarget: number;
}

interface Props {
  nicheLabel?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const SCORE_START = 520;
const SCORE_END = 720;
const SCORE_HOLD_AT = 720;
const ANIM_DURATION_MS = 8000;
const HOLD_DURATION_MS = 2000;

const TIERS: FundingTier[] = [
  {
    threshold: 520,
    label: "Secured Cards",
    amount: "$500–$2K available",
    colorClass: "tier-grey",
    activeStyle: {
      background: "rgba(100,116,139,0.25)",
      borderColor: "rgba(100,116,139,0.5)",
      color: "oklch(0.78 0.01 280)",
    },
    inactiveStyle: {
      background: "rgba(30,27,75,0.4)",
      borderColor: "rgba(255,255,255,0.07)",
      color: "oklch(0.42 0.01 280)",
    },
    amountTarget: 2000,
  },
  {
    threshold: 580,
    label: "Vendor Credit",
    amount: "up to $15K",
    colorClass: "tier-emerald",
    activeStyle: {
      background: "oklch(0.62 0.18 155 / 18%)",
      borderColor: "oklch(0.62 0.18 155 / 45%)",
      color: "oklch(0.8 0.14 155)",
    },
    inactiveStyle: {
      background: "rgba(30,27,75,0.4)",
      borderColor: "rgba(255,255,255,0.07)",
      color: "oklch(0.42 0.01 280)",
    },
    amountTarget: 15000,
  },
  {
    threshold: 640,
    label: "Business Lines",
    amount: "up to $50K",
    colorClass: "tier-blue",
    activeStyle: {
      background: "oklch(0.6 0.18 240 / 18%)",
      borderColor: "oklch(0.6 0.18 240 / 45%)",
      color: "oklch(0.78 0.14 240)",
    },
    inactiveStyle: {
      background: "rgba(30,27,75,0.4)",
      borderColor: "rgba(255,255,255,0.07)",
      color: "oklch(0.42 0.01 280)",
    },
    amountTarget: 50000,
  },
  {
    threshold: 710,
    label: "SBA / Term Loans",
    amount: "up to $500K",
    colorClass: "tier-purple",
    activeStyle: {
      background: "oklch(0.58 0.22 290 / 22%)",
      borderColor: "oklch(0.68 0.2 290 / 55%)",
      color: "oklch(0.84 0.18 290)",
      boxShadow: "0 0 18px oklch(0.58 0.22 290 / 35%)",
    },
    inactiveStyle: {
      background: "rgba(30,27,75,0.4)",
      borderColor: "rgba(255,255,255,0.07)",
      color: "oklch(0.42 0.01 280)",
    },
    amountTarget: 500000,
  },
];

const VALUE_STACK = [
  "No personal guarantee required on first $15K",
  "Separate business profile protects personal credit",
  "Fundability score shown to lenders automatically",
  "Start building Day 1 of your 7-day trial",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function formatAmount(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
}

// ── Animated dollar counter per badge ────────────────────────────────────────

function AmountCounter({
  active,
  target,
  staticLabel,
}: {
  active: boolean;
  target: number;
  staticLabel: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    const duration = 800;
    const startVal = 0;
    startRef.current = performance.now();

    function tick(now: number) {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOut(t);
      setDisplay(Math.round(startVal + (target - startVal) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target]);

  if (!active) return <span>{staticLabel}</span>;
  return <span>{formatAmount(display)}</span>;
}

// ── Ring SVG ──────────────────────────────────────────────────────────────────

const RING_R = 80;
const RING_CX = 100;
const RING_CY = 100;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

function ScoreRing({ score }: { score: number }) {
  const progress = (score - SCORE_START) / (SCORE_END - SCORE_START);
  const dashOffset = CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, progress)));

  // Ring color shifts as score climbs
  const ringColor =
    score >= 710
      ? "url(#ringGradientPurple)"
      : score >= 640
        ? "url(#ringGradientBlue)"
        : score >= 580
          ? "url(#ringGradientEmerald)"
          : "url(#ringGradientGrey)";

  return (
    <svg
      role="img"
      aria-label="Business credit score building animation"
      width="200"
      height="200"
      viewBox="0 0 200 200"
      className="block mx-auto"
    >
      <defs>
        <linearGradient
          id="ringGradientGrey"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="oklch(0.62 0.01 280)" />
          <stop offset="100%" stopColor="oklch(0.72 0.01 280)" />
        </linearGradient>
        <linearGradient
          id="ringGradientEmerald"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="oklch(0.55 0.2 155)" />
          <stop offset="100%" stopColor="oklch(0.72 0.16 155)" />
        </linearGradient>
        <linearGradient
          id="ringGradientBlue"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="oklch(0.52 0.2 240)" />
          <stop offset="100%" stopColor="oklch(0.68 0.16 240)" />
        </linearGradient>
        <linearGradient
          id="ringGradientPurple"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="oklch(0.48 0.26 290)" />
          <stop offset="100%" stopColor="oklch(0.72 0.2 290)" />
        </linearGradient>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle
        cx={RING_CX}
        cy={RING_CY}
        r={RING_R}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="12"
      />

      {/* Progress arc */}
      <circle
        cx={RING_CX}
        cy={RING_CY}
        r={RING_R}
        fill="none"
        stroke={ringColor}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${RING_CX} ${RING_CY})`}
        style={{
          transition: "stroke-dashoffset 0.05s linear, stroke 0.4s ease",
        }}
        filter={score >= 710 ? "url(#ringGlow)" : undefined}
      />

      {/* Center score */}
      <text
        x={RING_CX}
        y={RING_CY - 8}
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize="36"
        fontWeight="800"
        fontFamily="Inter, system-ui, sans-serif"
        fill="oklch(0.96 0.008 280)"
        style={{ letterSpacing: "-1px" }}
      >
        {score}
      </text>
      <text
        x={RING_CX}
        y={RING_CY + 14}
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize="11"
        fontWeight="600"
        fontFamily="Inter, system-ui, sans-serif"
        fill="oklch(0.6 0.02 280)"
        style={{ textTransform: "uppercase", letterSpacing: "1px" }}
      >
        CREDIT SCORE
      </text>
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Stage2CreditSection({ nicheLabel }: Props) {
  const [score, setScore] = useState(SCORE_START);
  const [running, setRunning] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const phaseRef = useRef<"animating" | "holding">("animating");
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nichePhrase = nicheLabel
    ? `Most ${nicheLabel} owners don't know they're one fundability score away from $50,000–$250,000 in business credit. BRF builds that score automatically.`
    : "Most local business owners don't know they're one fundability score away from $50,000–$250,000 in business credit. BRF builds that score automatically.";

  // ── Animation loop — stable refs to avoid exhaustive-deps issues ────────

  const stopAnimationRef = useRef<() => void>(() => {
    cancelAnimationFrame(rafRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  });

  const startAnimationRef = useRef<() => void>(() => {
    /* set below */
  });

  // Assign after refs exist so startAnimationRef can recurse via itself
  startAnimationRef.current = () => {
    setScore(SCORE_START);
    phaseRef.current = "animating";
    startTimeRef.current = performance.now();

    function tick(now: number) {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / ANIM_DURATION_MS, 1);
      const eased = easeInOut(t);
      const current = Math.round(
        SCORE_START + (SCORE_HOLD_AT - SCORE_START) * eased,
      );
      setScore(current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setScore(SCORE_HOLD_AT);
        phaseRef.current = "holding";
        holdTimerRef.current = setTimeout(() => {
          startAnimationRef.current();
        }, HOLD_DURATION_MS);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  stopAnimationRef.current = () => {
    cancelAnimationFrame(rafRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
  };

  useEffect(() => {
    if (running) {
      startAnimationRef.current();
    } else {
      stopAnimationRef.current();
      setScore(SCORE_START);
    }
    return () => stopAnimationRef.current();
  }, [running]);

  // ── IntersectionObserver ────────────────────────────────────────────────

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRunning(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      data-ocid="credit_section"
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.085 0.012 280) 0%, oklch(0.1 0.016 285) 50%, oklch(0.085 0.012 280) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.58 0.22 290 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "oklch(0.58 0.22 290 / 12%)",
              border: "1px solid oklch(0.58 0.22 290 / 28%)",
              color: "oklch(0.78 0.16 290)",
            }}
          >
            <span>💳</span> Stage 2 — Business Credit Builder
          </div>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-5 tracking-tight"
            style={{ color: "oklch(0.96 0.008 280)" }}
          >
            Your Business Credit,{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 290) 0%, oklch(0.68 0.2 260) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Building While You Sleep
            </span>
          </h2>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "oklch(0.68 0.015 280)" }}
          >
            {nichePhrase}
          </p>
        </motion.div>

        {/* Ring + Tiers */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-center mb-14">
          {/* Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
            className="flex-shrink-0"
            data-ocid="credit_section.canvas_target"
          >
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto flex items-center justify-center">
              <ScoreRing score={score} />
            </div>
          </motion.div>

          {/* Funding tier badges — 2×2 grid on md+ */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm lg:max-w-md">
            {TIERS.map((tier, i) => {
              const active = score >= tier.threshold;
              return (
                <motion.div
                  key={tier.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  data-ocid={`credit_section.tier.${i + 1}`}
                  className="rounded-xl px-4 py-3 border transition-all duration-500"
                  style={active ? tier.activeStyle : tier.inactiveStyle}
                >
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
                    {tier.label}
                  </div>
                  <div className="text-sm font-semibold">
                    <AmountCounter
                      active={active}
                      target={tier.amountTarget}
                      staticLabel={tier.amount}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hormozi value stack */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl mx-auto mb-10"
        >
          <ul className="space-y-3">
            {VALUE_STACK.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
                className="flex items-start gap-3 text-sm md:text-base"
                style={{ color: "oklch(0.82 0.01 280)" }}
              >
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-xs font-bold"
                  style={{
                    background: "oklch(0.62 0.18 155 / 20%)",
                    border: "1px solid oklch(0.62 0.18 155 / 40%)",
                    color: "oklch(0.78 0.14 155)",
                  }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-center"
        >
          <Link to="/demo">
            <button
              type="button"
              data-ocid="credit_section.primary_button"
              className="premium-cta-primary inline-flex items-center gap-3"
            >
              <span>💳</span>
              Start Building My Business Credit
            </button>
          </Link>
          <p className="mt-3 text-xs" style={{ color: "oklch(0.52 0.01 280)" }}>
            No credit card required · 7-day free trial · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
