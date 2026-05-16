/**
 * ActTransitionCard — testimonial card shown between acts.
 * User-controlled: no auto-advance. Shows a large pulsing "Tap to continue" button.
 * onDone() is called only when user taps the button.
 */

import { NICHE_TESTIMONIALS } from "@/data/demoFlowData";
import type { DemoNicheId } from "@/types/demo";
import { motion } from "motion/react";

interface ActTransitionCardProps {
  niche: DemoNicheId;
  actLabel: string;
  onDone: () => void;
}

export default function ActTransitionCard({
  niche,
  actLabel,
  onDone,
}: ActTransitionCardProps) {
  const testimonials = NICHE_TESTIMONIALS[niche] ?? NICHE_TESTIMONIALS.plumber;
  const testimonial = testimonials[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.08 0.01 280) 0%, oklch(0.1 0.016 285) 100%)",
      }}
      data-ocid="demo.act_transition"
    >
      <div
        className="mb-4 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
        style={{
          background: "oklch(0.58 0.22 290 / 15%)",
          border: "1px solid oklch(0.58 0.22 290 / 35%)",
          color: "oklch(0.78 0.16 290)",
        }}
      >
        Coming up: {actLabel}
      </div>

      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: "oklch(0.13 0.016 285)",
          border: "1px solid oklch(0.58 0.22 290 / 25%)",
        }}
      >
        <div className="text-3xl mb-4 text-center">⭐⭐⭐⭐⭐</div>
        <blockquote
          className="text-base font-semibold leading-relaxed mb-4 text-center"
          style={{ color: "oklch(0.88 0.01 280)" }}
        >
          "{testimonial.quote}"
        </blockquote>
        <div className="text-center">
          <div className="text-sm font-bold text-white">
            {testimonial.business}
          </div>
          <div className="text-xs" style={{ color: "oklch(0.55 0.02 280)" }}>
            {testimonial.location}
          </div>
          <div
            className="mt-1.5 text-xs font-bold px-3 py-1 rounded-full inline-block"
            style={{
              background: "oklch(0.55 0.22 155 / 15%)",
              color: "oklch(0.72 0.18 155)",
            }}
          >
            📈 {testimonial.result}
          </div>
        </div>
      </div>

      {/* Large pulsing tap-to-continue button — user controls pacing */}
      <button
        type="button"
        onClick={onDone}
        className="mt-8 flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all animate-pulse hover:animate-none hover:scale-105 active:scale-95"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 295))",
          color: "white",
          boxShadow: "0 8px 28px oklch(0.58 0.22 290 / 45%)",
        }}
        data-ocid="demo.act_transition.continue_button"
      >
        Tap to continue →
      </button>

      <p
        className="mt-3 text-xs text-center"
        style={{ color: "oklch(0.42 0.02 280)" }}
      >
        Take your time — tap when you’re ready
      </p>
    </motion.div>
  );
}
