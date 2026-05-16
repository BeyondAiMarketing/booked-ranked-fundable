/**
 * TestimonialCard — between-step social proof overlay.
 *
 * Behaviour:
 * - Dark card with purple border, centered on screen.
 * - Large quote, business name + niche below, 5 star rating.
 * - Shows for 4 seconds then calls onComplete.
 * - Prospect can tap "Next" to skip.
 * - Cycles through niche-specific testimonials.
 */

import { NICHE_TESTIMONIALS } from "@/data/demoFlowData";
import type { DemoNicheId } from "@/types/demo";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TestimonialCardProps {
  niche: DemoNicheId;
  /** Which testimonial index to show (0-based). Defaults to 0. */
  index?: number;
  onComplete: () => void;
  /** Delay in ms before auto-advancing. Default 4000. */
  delay?: number;
}

export default function TestimonialCard({
  niche,
  index = 0,
  onComplete,
  delay = 4000,
}: TestimonialCardProps) {
  const testimonials = NICHE_TESTIMONIALS[niche] ?? [];
  const testimonial = testimonials[index % testimonials.length];
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(delay / 1000);
  const callbackFiredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fade in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Fire onComplete when countdown reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !callbackFiredRef.current) {
      callbackFiredRef.current = true;
      onComplete();
    }
  }, [timeLeft, onComplete]);

  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!callbackFiredRef.current) {
      callbackFiredRef.current = true;
      onComplete();
    }
  };

  if (!testimonial) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-4 py-8"
      style={{
        background: "oklch(0 0 0 / 60%)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
      data-ocid="demo.testimonial_card"
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.14 0.016 280) 0%, oklch(0.12 0.014 285) 100%)",
          border: "2px solid oklch(0.58 0.22 290 / 30%)",
          boxShadow:
            "0 24px 64px oklch(0 0 0 / 50%), 0 0 32px oklch(0.58 0.22 290 / 15%)",
        }}
      >
        {/* Stars */}
        <div className="mb-4 flex gap-1" aria-label="5 out of 5 stars">
          {["s1", "s2", "s3", "s4", "s5"].map((id) => (
            <Star
              key={id}
              className="h-5 w-5 fill-current"
              style={{ color: "oklch(0.82 0.18 75)" }}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote
          className="mb-6 text-lg font-semibold leading-relaxed"
          style={{ color: "oklch(0.93 0.008 280)" }}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Business info */}
        <div className="mb-2 flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: "oklch(0.58 0.22 290 / 20%)",
              border: "1px solid oklch(0.58 0.22 290 / 35%)",
              color: "oklch(0.82 0.16 290)",
            }}
            aria-hidden="true"
          >
            {testimonial.business.charAt(0)}
          </div>
          <div>
            <div
              className="text-sm font-bold"
              style={{ color: "oklch(0.92 0.008 280)" }}
            >
              {testimonial.business}
            </div>
            <div className="text-xs" style={{ color: "oklch(0.55 0.02 280)" }}>
              {testimonial.location}
            </div>
          </div>
        </div>

        {/* Result badge */}
        <div
          className="mb-6 inline-block rounded-lg px-3 py-1.5 text-xs font-bold"
          style={{
            background: "oklch(0.62 0.18 155 / 15%)",
            border: "1px solid oklch(0.62 0.18 155 / 30%)",
            color: "oklch(0.78 0.14 155)",
          }}
        >
          ✓ {testimonial.result}
        </div>

        {/* Skip button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200"
            style={{
              background: "oklch(0.58 0.22 290 / 20%)",
              border: "1px solid oklch(0.58 0.22 290 / 35%)",
              color: "oklch(0.82 0.16 290)",
            }}
            data-ocid="demo.testimonial_skip_button"
          >
            Continue ({timeLeft}s)
          </button>
        </div>
      </div>
    </div>
  );
}
