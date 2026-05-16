/**
 * DemoLayout — progress bar sticky at top, full-screen content area below.
 *
 * Progress bar shows 3-act structure:
 *   Act 1: Steps 1–3  (Your Business)
 *   Act 2: Steps 4–8  (Back Office)
 *   Act 3: Step 9     (7-Day Trial)
 *
 * Each act has step dots. Active act highlighted in purple, completed in emerald.
 */

import { useDemoFlow } from "@/hooks/useDemoFlow";

const ACT_CONFIG = [
  { label: "Act 1: Your Business", steps: [1, 2, 3], short: "Business" },
  { label: "Act 2: Back Office", steps: [4, 5, 6, 7, 8], short: "Back Office" },
  { label: "Act 3: 7-Day Trial", steps: [9], short: "Trial" },
] as const;

function getActIndex(step: number): number {
  if (step >= 1 && step <= 3) return 0;
  if (step >= 4 && step <= 8) return 1;
  return 2;
}

interface DemoLayoutProps {
  children: React.ReactNode;
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  const { step } = useDemoFlow();

  const isIntake = step === 0;
  const currentActIdx = getActIndex(step);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0a0a1a 0%, #120a2e 50%, #0d0820 100%)",
      }}
      data-ocid="demo.layout"
    >
      {/* Decorative background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.38 0.14 290 / 25%) 0%, transparent 70%)",
        }}
      />

      {/* ── Sticky progress bar — visible on ALL steps including step 0 intake ────── */}
      <div
        className="relative z-20 shrink-0 flex items-center justify-between px-3 sm:px-4 h-12"
        style={{
          background: "oklch(0.1 0.012 280 / 90%)",
          borderBottom: "1px solid oklch(1 0 0 / 8%)",
          backdropFilter: "blur(10px)",
        }}
        data-ocid="demo.progress_bar"
      >
        {/* BRF logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
              boxShadow: "0 0 10px oklch(0.58 0.22 290 / 40%)",
            }}
          >
            BRF
          </div>
          <span
            className="hidden sm:block text-xs font-semibold"
            style={{ color: "oklch(0.72 0.14 290)" }}
          >
            Booked, Ranked & Fundable
          </span>
        </div>

        {/* Act indicators — always shown; intake shows Getting Started */}
        <div
          className="hidden sm:flex items-center gap-1 flex-1 justify-center"
          aria-label="Demo progress"
        >
          {isIntake ? (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: "oklch(0.58 0.22 290 / 20%)",
                color: "oklch(0.78 0.16 290)",
                border: "1px solid oklch(0.58 0.22 290 / 35%)",
                boxShadow: "0 0 8px oklch(0.58 0.22 290 / 20%)",
              }}
              data-ocid="demo.act_0_label"
            >
              Getting Started
            </div>
          ) : (
            ACT_CONFIG.map((act, i) => {
              const done = i < currentActIdx;
              const active = i === currentActIdx;
              return (
                <div key={act.short} className="flex items-center gap-1">
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-300"
                    style={{
                      background: done
                        ? "oklch(0.62 0.18 155 / 20%)"
                        : active
                          ? "oklch(0.58 0.22 290 / 20%)"
                          : "oklch(1 0 0 / 6%)",
                      color: done
                        ? "oklch(0.72 0.16 155)"
                        : active
                          ? "oklch(0.78 0.16 290)"
                          : "oklch(0.38 0.02 280)",
                      border: active
                        ? "1px solid oklch(0.58 0.22 290 / 35%)"
                        : done
                          ? "1px solid oklch(0.62 0.18 155 / 25%)"
                          : "1px solid transparent",
                      boxShadow: active
                        ? "0 0 8px oklch(0.58 0.22 290 / 20%)"
                        : "none",
                    }}
                    data-ocid={`demo.act_${i + 1}_label`}
                  >
                    {done && <span aria-hidden="true">✓</span>}
                    {act.short}
                  </div>
                  {i < ACT_CONFIG.length - 1 && (
                    <span
                      className="text-[8px]"
                      style={{ color: "oklch(0.3 0.02 280)" }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Mobile: compact progress — always shown */}
        <div
          className="sm:hidden flex items-center gap-2 flex-1 mx-2"
          data-ocid="demo.mobile_progress"
        >
          <span
            className="shrink-0 text-[10px] font-semibold tabular-nums"
            style={{ color: "oklch(0.72 0.14 290)" }}
          >
            {isIntake ? "0/9" : `${step}/9`}
          </span>
          <div
            className="relative flex-1 h-1.5 overflow-hidden rounded-full"
            style={{ background: "oklch(1 0 0 / 10%)" }}
            aria-label={isIntake ? "Getting started" : `Step ${step} of 9`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: isIntake ? "3%" : `${Math.round((step / 9) * 100)}%`,
                background:
                  "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.68 0.18 290))",
                boxShadow: "0 0 6px oklch(0.58 0.22 290 / 50%)",
              }}
            />
          </div>
        </div>

        {/* Step dots */}
        <div
          className="shrink-0 flex items-center gap-[3px]"
          aria-hidden="true"
        >
          {Array.from({ length: 9 }, (_, i) => {
            const n = i + 1;
            const done = n < step;
            const active = !isIntake && n === step;
            return (
              <div
                key={n}
                className="rounded-full transition-all duration-300"
                style={{
                  width: active ? "16px" : "4px",
                  height: "4px",
                  background: done
                    ? "oklch(0.62 0.18 155)"
                    : active
                      ? "oklch(0.58 0.22 290)"
                      : "oklch(1 0 0 / 15%)",
                  boxShadow: active
                    ? "0 0 6px oklch(0.58 0.22 290 / 60%)"
                    : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Main content area ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
