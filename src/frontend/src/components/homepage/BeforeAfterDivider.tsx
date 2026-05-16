/**
 * BeforeAfterDivider — drag-reveal before/after comparison slider.
 * Left panel (Before BRF): clipped to the LEFT of the divider.
 * Right panel (After BRF): clipped to the RIGHT of the divider.
 * Both panels are full-width; clip-path does the revealing — no content bleeds.
 */

import type { HomepageNicheData } from "@/data/homepageNicheData";
import { motion, useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  nicheData: HomepageNicheData;
  /** When true, use universal language — no niche-specific copy */
  isNeutral?: boolean;
}

interface BadgeConfig {
  icon: string;
  label: string;
  value: string;
}

// ─── Badge data (inlined to avoid unused-const lint errors) ──────────────────

const BEFORE_BADGES: BadgeConfig[] = [
  { icon: "📵", label: "Missed Calls", value: "40%+" },
  { icon: "⭐", label: "Avg Rating", value: "2.8 ★" },
  { icon: "💳", label: "Business Credit", value: "No score" },
  { icon: "📅", label: "Lost Bookings", value: "Weekly" },
];

const AFTER_BADGES: BadgeConfig[] = [
  { icon: "📞", label: "Calls Answered", value: "100%" },
  { icon: "⭐", label: "Avg Rating", value: "4.9 ★" },
  { icon: "💳", label: "Business Credit", value: "720+" },
  { icon: "📅", label: "Booked Slots", value: "+$14K/mo" },
];

// ─── Before Panel ─────────────────────────────────────────────────────────────
// Full-width panel anchored to the LEFT. Clipped externally by the slider.

function BeforePanel({
  nicheData,
  isNeutral,
}: { nicheData: HomepageNicheData; isNeutral: boolean }) {
  const painText = isNeutral
    ? "Missed calls, weak reviews, no system — revenue leaking every day."
    : `"${nicheData.painPointStat} of ${nicheData.label.toLowerCase()} calls never get answered."`;

  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      aria-hidden={false}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.09 0.005 240) 0%, oklch(0.12 0.008 260) 100%)",
          filter: "saturate(0.4)",
        }}
      />

      {/* Content — left-anchored, vertically centered */}
      <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8 py-6">
        {/* Label pinned top-left inside this panel */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold text-white/60 bg-black/50 rounded-full px-2.5 py-1 uppercase tracking-wider">
            Before
          </span>
        </div>

        <div className="mt-6">
          <div className="text-3xl mb-2" aria-hidden="true">
            📵
          </div>
          <h3 className="text-base sm:text-lg font-black text-white/80 leading-tight mb-1">
            Before BRF
          </h3>
          <p className="text-xs text-white/40 mb-4 max-w-[220px] leading-snug">
            {painText}
          </p>

          <div className="grid grid-cols-2 gap-2 max-w-[240px]">
            {BEFORE_BADGES.map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2.5 border"
                style={{
                  background: "oklch(0.13 0.005 240)",
                  borderColor: "oklch(1 0 0 / 8%)",
                }}
              >
                <span className="text-base" aria-hidden="true">
                  {b.icon}
                </span>
                <span className="text-[10px] text-white/40 leading-none text-center">
                  {b.label}
                </span>
                <span className="text-xs font-bold text-white/60">
                  {b.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── After Panel ──────────────────────────────────────────────────────────────
// Full-width panel anchored to the RIGHT. Clipped externally by the slider.

function AfterPanel({
  nicheData,
  isNeutral,
}: { nicheData: HomepageNicheData; isNeutral: boolean }) {
  const resultText = isNeutral
    ? "Booked solid, 5-star, funded, and automated"
    : nicheData.testimonialResult;
  const resultAuthor = isNeutral
    ? "Local Business Owner"
    : `${nicheData.testimonialOwner}, ${nicheData.testimonialBusiness}`;

  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      aria-hidden={false}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, oklch(0.16 0.04 ${nicheData.accentHue}) 0%, oklch(0.12 0.03 280) 60%, oklch(0.18 0.06 155) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 75% 40%, oklch(0.58 0.22 290 / 15%) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content — right-anchored, vertically centered */}
      <div className="relative z-10 h-full flex flex-col justify-center items-end px-5 sm:px-8 py-6">
        {/* Label pinned top-right inside this panel */}
        <div className="absolute top-3 right-3">
          <span
            className="text-xs font-bold text-white rounded-full px-2.5 py-1 uppercase tracking-wider"
            style={{ background: "var(--purple-accent)" }}
          >
            After
          </span>
        </div>

        <div className="mt-6 flex flex-col items-end">
          <div className="text-3xl mb-2" aria-hidden="true">
            🚀
          </div>
          <h3 className="text-base sm:text-lg font-black text-white leading-tight mb-1 text-right">
            After BRF
          </h3>

          <div className="grid grid-cols-2 gap-2 max-w-[240px] mb-3">
            {AFTER_BADGES.map((b) => (
              <div
                key={b.label}
                className="flex flex-col items-center gap-0.5 rounded-xl p-2.5 border"
                style={{
                  background: "oklch(0.2 0.04 290 / 60%)",
                  borderColor: "oklch(0.58 0.22 290 / 30%)",
                }}
              >
                <span className="text-base" aria-hidden="true">
                  {b.icon}
                </span>
                <span className="text-[10px] text-white/60 leading-none text-center">
                  {b.label}
                </span>
                <span className="text-xs font-bold text-white">{b.value}</span>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl px-3 py-2 text-xs font-semibold text-white max-w-[220px] leading-snug text-right border"
            style={{
              background: "oklch(0.62 0.18 155 / 20%)",
              borderColor: "oklch(0.62 0.18 155 / 40%)",
            }}
          >
            "{resultText}"
            <br />
            <span className="font-normal opacity-70">— {resultAuthor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BeforeAfterDivider({
  nicheData,
  isNeutral = false,
}: Props) {
  const [dividerPct, setDividerPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Kill the hint pulse after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowPulse(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // On mobile, animate a sweep hint when the section enters view
  useEffect(() => {
    if (!isInView) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) return;

    let frame: number;
    let start: number | null = null;
    const duration = 1800;
    const from = 50;
    const to = 25;

    const animate = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      setDividerPct(from + (to - from) * ease);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setDividerPct(50); // snap back to center after hint
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  const getPct = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    return Math.max(
      5,
      Math.min(95, ((clientX - rect.left) / rect.width) * 100),
    );
  }, []);

  // ── Mouse drag ──────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setDividerPct(getPct(e.clientX));
    },
    [isDragging, getPct],
  );

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  // ── Touch drag ──────────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      setDividerPct(getPct(e.touches[0].clientX));
    },
    [isDragging, getPct],
  );

  const onTouchEnd = useCallback(() => setIsDragging(false), []);

  return (
    <section
      className="w-full py-16 px-4 overflow-hidden"
      style={{ background: "oklch(0.1 0.012 280)" }}
      aria-label="Before and after BRF comparison"
      data-ocid="homepage.before_after_section"
    >
      {/* ── Section header ── */}
      <motion.div
        className="text-center mb-8 max-w-2xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: "var(--purple-light)" }}
        >
          Drag to reveal
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
          Your Business. Two Very Different Futures.
        </h2>
        <p className="text-muted-foreground mt-3 text-base">
          Every day without BRF is revenue walking out the door. Drag the line
          to see the difference.
        </p>
      </motion.div>

      {/* ── Slider container ── */}
      <motion.div
        ref={containerRef}
        className="relative mx-auto rounded-2xl border border-border overflow-hidden"
        style={{
          maxWidth: 640,
          height: 420,
          userSelect: "none",
          cursor: isDragging ? "grabbing" : "ew-resize",
          touchAction: "none",
        }}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        data-ocid="homepage.before_after_divider"
      >
        {/* ── BEFORE panel — clipped to the LEFT of the divider ── */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - dividerPct}% 0 0)`,
            willChange: "clip-path",
          }}
        >
          <BeforePanel nicheData={nicheData} isNeutral={isNeutral} />
        </div>

        {/* ── AFTER panel — clipped to the RIGHT of the divider ── */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 0 0 ${dividerPct}%)`,
            willChange: "clip-path",
          }}
        >
          <AfterPanel nicheData={nicheData} isNeutral={isNeutral} />
        </div>

        {/* ── Divider line ── */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{
            left: `${dividerPct}%`,
            width: 2,
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 8px rgba(139,92,246,0.6)",
          }}
          aria-hidden="true"
        />

        {/* ── Drag handle ── */}
        <div
          className="absolute top-1/2 z-30 -translate-y-1/2"
          style={{
            left: `${dividerPct}%`,
            transform: "translate(-50%, -50%)",
            width: 48,
            height: 48,
          }}
        >
          <motion.button
            type="button"
            className="w-full h-full rounded-full border-2 border-white/80 flex items-center justify-center shadow-lg"
            style={{
              background: "oklch(0.58 0.22 290)",
              boxShadow: showPulse
                ? "0 0 0 0 oklch(0.58 0.22 290 / 60%)"
                : "0 0 20px oklch(0.58 0.22 290 / 50%)",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            animate={
              showPulse
                ? {
                    boxShadow: [
                      "0 0 0 0px oklch(0.58 0.22 290 / 70%)",
                      "0 0 0 10px oklch(0.58 0.22 290 / 0%)",
                      "0 0 0 0px oklch(0.58 0.22 290 / 70%)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 1, repeat: 2, ease: "easeOut" }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-label="Drag to compare before and after"
            role="slider"
            aria-valuenow={Math.round(dividerPct)}
            aria-valuemin={5}
            aria-valuemax={95}
            data-ocid="homepage.before_after.drag_handle"
          >
            <span
              className="text-white font-black select-none"
              style={{ fontSize: 16, letterSpacing: -1 }}
              aria-hidden="true"
            >
              ◀▶
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Hint caption ── */}
      <motion.p
        className="text-center text-xs text-muted-foreground mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        ← Drag the handle to reveal your future →
      </motion.p>
    </section>
  );
}
