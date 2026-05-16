/**
 * CoachTipCard — back-office demo annotation.
 * Bottom-anchored slide-up notification banner.
 * Sits ABOVE the fixed bottom nav bar (h-16, z-50) — BELOW all step content.
 * NEVER overlaps any paragraph text, headline, stat number, or CTA button.
 */

import { motion } from "motion/react";

interface CoachTipCardProps {
  message: string;
  onDismiss: () => void;
}

export default function CoachTipCard({
  message,
  onDismiss,
}: CoachTipCardProps) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 340 }}
      // bottom-16 = 64px = sits exactly above the fixed nav bar (h-16)
      // z-40 = below z-50 nav bar, above step content z-30
      className="fixed bottom-16 left-0 right-0 z-40"
      data-ocid="demo.coach_tip.card"
    >
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{
          background: "oklch(0.12 0.024 292 / 0.97)",
          borderTop: "1.5px solid oklch(0.58 0.22 290 / 45%)",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "none",
          boxShadow: "0 -4px 24px oklch(0.58 0.22 290 / 18%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Pulsing green dot */}
        <span
          className="shrink-0 w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ background: "oklch(0.62 0.18 155)" }}
          aria-hidden="true"
        />
        {/* Message — capped at 2 lines on mobile */}
        <span
          className="text-sm font-semibold leading-snug flex-1 line-clamp-2"
          style={{ color: "oklch(0.92 0.01 280)" }}
        >
          💡 {message}
        </span>
        {/* Desktop direction indicator — subtle only, no floating arrow */}
        <span
          className="hidden md:block shrink-0 text-[11px] font-bold"
          style={{ color: "oklch(0.58 0.22 290)" }}
          aria-hidden="true"
        >
          ▲
        </span>
        {/* Dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
          style={{
            background: "oklch(1 0 0 / 6%)",
            color: "oklch(0.55 0.04 290)",
          }}
          aria-label="Dismiss coach tip"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
