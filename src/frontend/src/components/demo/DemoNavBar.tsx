/**
 * DemoNavBar — fixed bottom navigation bar for demo steps.
 *
 * Rules:
 * - Height exactly 64px, always at the bottom of DemoShell.
 * - Back button (left) — always visible after step 1.
 * - Next button (right) — DISABLED and greyed until isStepComplete = true.
 * - Next button turns solid purple when enabled.
 * - On the final step (9), Next shows "Finish" and may trigger a different action.
 * - transitionLock prevents double-click and shows spinner feedback.
 */

import { useDemoFlow } from "@/hooks/useDemoFlow";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface DemoNavBarProps {
  /** Override for next action — used for act transition injection */
  onNext?: () => void;
}

export default function DemoNavBar({ onNext }: DemoNavBarProps) {
  const { step, totalSteps, isStepComplete, canGoBack, goNext, goBack } =
    useDemoFlow();

  // transitionLock — prevents double-click during step transition
  const [transitioning, setTransitioning] = useState(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFinalStep = step === totalSteps;
  const baseNext = onNext ?? goNext;

  const handleNext = useCallback(() => {
    if (transitioning || !isStepComplete) return;
    setTransitioning(true);
    baseNext();
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => setTransitioning(false), 350);
  }, [transitioning, isStepComplete, baseNext]);

  return (
    <div
      className="flex h-full w-full items-center justify-between px-4"
      style={{
        background: "oklch(0.08 0.01 280 / 90%)",
        borderTop: "1px solid oklch(1 0 0 / 8%)",
        backdropFilter: "blur(12px)",
      }}
      data-ocid="demo.nav_bar"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={goBack}
        disabled={!canGoBack}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
        style={
          canGoBack
            ? {
                background: "oklch(1 0 0 / 6%)",
                border: "1px solid oklch(1 0 0 / 10%)",
                color: "oklch(0.75 0.01 280)",
              }
            : {
                background: "transparent",
                border: "1px solid transparent",
                color: "oklch(0.35 0.01 280)",
                cursor: "not-allowed",
              }
        }
        aria-label="Go to previous step"
        data-ocid="demo.back_button"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Step indicator */}
      <div
        className="text-xs font-medium tabular-nums"
        style={{ color: "oklch(0.45 0.02 280)" }}
        aria-hidden="true"
      >
        {step} / {totalSteps}
      </div>

      {/* Next / Finish button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!isStepComplete || transitioning}
        className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold transition-all duration-200"
        style={
          isStepComplete && !transitioning
            ? {
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
                border: "none",
                color: "oklch(0.98 0.005 280)",
                boxShadow: "0 4px 16px oklch(0.58 0.22 290 / 45%)",
                cursor: "pointer",
              }
            : {
                background: "oklch(1 0 0 / 5%)",
                border: "1px solid oklch(1 0 0 / 8%)",
                color: "oklch(0.38 0.02 280)",
                cursor: "not-allowed",
              }
        }
        aria-label={isFinalStep ? "Finish demo" : "Go to next step"}
        aria-disabled={!isStepComplete || transitioning}
        data-ocid="demo.next_button"
      >
        {transitioning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>{isFinalStep ? "Finish" : "Next"}</span>
            {isFinalStep ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
