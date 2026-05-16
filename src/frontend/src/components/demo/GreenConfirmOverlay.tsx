/**
 * GreenConfirmOverlay — full-screen green success overlay (V128 UPGRADE).
 *
 * - Fixed, 100vw × 100vh emerald gradient background
 * - Animated SVG checkmark draws itself
 * - Staggered confirmation items with icons: calendar, SMS, CRM
 * - Slides up from bottom (translateY 100% → 0, 400ms spring)
 * - Auto-dismisses after autoDismissMs (default 4000ms)
 * - Rich contextual details: time, date, business name, caller name
 */

import type { GreenOverlayData } from "@/types/demo";
import { motion } from "motion/react";
import { useEffect } from "react";

// ─── Animated SVG Checkmark ───────────────────────────────────────────────────

function AnimatedCheckmark() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-20 mb-4"
      aria-hidden="true"
    >
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.675, ease: "easeOut" }}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
      <motion.path
        d="M24 40 L36 52 L56 28"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.525, ease: "easeOut", delay: 0.525 }}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
    </svg>
  );
}

// ─── Rich Confirmation Item ───────────────────────────────────────────────────

interface RichItem {
  icon: string;
  label: string;
  detail: string;
}

function ConfirmItem({ item, index }: { item: RichItem; index: number }) {
  return (
    <motion.div
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.675 + index * 0.18, type: "spring", damping: 22 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ background: "oklch(0 0 0 / 22%)" }}
    >
      <span
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg"
        style={{ background: "oklch(0.62 0.18 155 / 35%)" }}
        aria-hidden="true"
      >
        {item.icon}
      </span>
      <div className="flex flex-col min-w-0 text-left">
        <span className="text-sm font-black text-white leading-tight truncate">
          ✓ {item.label}
        </span>
        <span
          className="text-xs font-medium mt-0.5 truncate"
          style={{ color: "oklch(0.88 0.1 155)" }}
        >
          {item.detail}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GreenConfirmOverlayNewProps {
  data: GreenOverlayData;
  onDismiss: () => void;
  autoDismissMs?: number;
  dataOcid?: string;
}

interface GreenConfirmOverlayLegacyProps {
  headline: string;
  subline?: string;
  items?: Array<{ icon: string; label: string; value: string }>;
  closingLine?: string;
  autoDismissMs?: number;
  onDone: () => void;
  dataOcid?: string;
}

type GreenConfirmOverlayProps =
  | GreenConfirmOverlayNewProps
  | GreenConfirmOverlayLegacyProps;

function isNewProps(
  p: GreenConfirmOverlayProps,
): p is GreenConfirmOverlayNewProps {
  return "data" in p && "onDismiss" in p;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

function getBookingTime(): string {
  const now = new Date();
  now.setHours(now.getHours() + 2); // "2 hours from now"
  return now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GreenConfirmOverlay(props: GreenConfirmOverlayProps) {
  const autoDismissMs = props.autoDismissMs ?? 8000;
  const onDone = isNewProps(props) ? props.onDismiss : props.onDone;
  const dataOcid = props.dataOcid ?? "demo.green_overlay";

  const headline = isNewProps(props) ? props.data.headline : props.headline;
  const subtitle = isNewProps(props)
    ? props.data.subtitle
    : (props as GreenConfirmOverlayLegacyProps).subline;

  // Build rich items with icons and details
  const richItems: RichItem[] = isNewProps(props)
    ? props.data.items.map((_, i) => {
        if (i === 0)
          return {
            icon: "📅",
            label: "Appointment Booked",
            detail: `${getTomorrow()} at ${getBookingTime()}`,
          };
        if (i === 1)
          return {
            icon: "💬",
            label: "SMS Sent to Caller",
            detail: "Confirmation + arrival time delivered",
          };
        return {
          icon: "👤",
          label: "CRM Lead Created",
          detail: "Tagged Hot · Follow-up queued",
        };
      })
    : ((props as GreenConfirmOverlayLegacyProps).items ?? []).map((it) => ({
        icon: it.icon,
        label: it.label,
        detail: it.value,
      }));

  const closingLine = isNewProps(props)
    ? undefined
    : (props as GreenConfirmOverlayLegacyProps).closingLine;

  useEffect(() => {
    const t = setTimeout(onDone, autoDismissMs);
    return () => clearTimeout(t);
  }, [onDone, autoDismissMs]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: 0.63, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 py-8"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.36 0.18 155) 0%, oklch(0.30 0.2 145) 50%, oklch(0.26 0.15 155) 100%)",
      }}
      data-ocid={dataOcid}
      aria-live="polite"
      aria-label={headline}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 25%, oklch(0.65 0.2 155 / 35%) 0%, transparent 65%)",
        }}
      />

      {/* Particle dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: decorative only
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 6 + (i % 3) * 4,
            height: 6 + (i % 3) * 4,
            background: `oklch(0.78 0.16 155 / ${0.3 + (i % 4) * 0.1})`,
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 5) * 14}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 0.8, 0.4],
            y: [0, -(20 + i * 8)],
          }}
          transition={{ delay: i * 0.12, duration: 1.8, ease: "easeOut" }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Animated checkmark */}
        <AnimatedCheckmark />

        {/* Headline */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.375, duration: 0.6 }}
          className="text-3xl sm:text-4xl font-black text-white mb-1 leading-tight"
        >
          {headline}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.48 }}
            className="text-sm font-semibold mb-4 leading-snug max-w-xs"
            style={{ color: "oklch(0.90 0.08 155)" }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Rich confirmation items */}
        {richItems.length > 0 && (
          <div className="flex flex-col gap-2 w-full mb-5">
            {richItems.map((item, i) => (
              <ConfirmItem key={item.label} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Closing line */}
        {closingLine && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 + richItems.length * 0.18 }}
            className="text-sm font-semibold italic text-center max-w-xs mb-4"
            style={{ color: "oklch(0.85 0.08 155)" }}
          >
            "{closingLine}"
          </motion.p>
        )}

        {/* "That happened while you were watching" line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 + richItems.length * 0.18 }}
          className="text-xs font-medium mb-5 text-center max-w-xs"
          style={{ color: "oklch(0.78 0.12 155)" }}
        >
          All of this happened automatically — while you were watching.
        </motion.p>

        {/* Auto-dismiss progress bar */}
        <motion.div
          className="w-full max-w-xs h-0.5 overflow-hidden rounded-full"
          style={{ background: "oklch(1 0 0 / 20%)" }}
          aria-hidden="true"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "oklch(1 0 0 / 65%)" }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: autoDismissMs / 1000, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
