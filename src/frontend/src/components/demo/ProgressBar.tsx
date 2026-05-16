/**
 * ProgressBar — top strip of the demo shell.
 *
 * Step 0 (intake): BRF logo + tagline only, no progress.
 * Steps 1–9: Act-aware progress bar with act labels and step dots.
 *
 * Acts:
 *   Act 1: Steps 1–3 (Front-End Services)
 *   Act 2: Steps 4–8 (Back Office)
 *   Act 3: Step 9  (Trial CTA)
 */

import { useDemoFlow } from "@/hooks/useDemoFlow";

const ACTS = [
  { label: "Front-End", steps: [1, 2, 3] },
  { label: "Back Office", steps: [4, 5, 6, 7, 8] },
  { label: "Your Trial", steps: [9] },
];

function getActIndex(step: number): number {
  if (step <= 3) return 0;
  if (step <= 8) return 1;
  return 2;
}

export default function ProgressBar() {
  const { step, totalSteps, businessName, city } = useDemoFlow();

  const isIntake = step === 0;
  const currentActIdx = getActIndex(step);
  const fillPct = isIntake ? 0 : Math.round((step / totalSteps) * 100);
  const demoLabel =
    businessName && city
      ? `Demo for ${businessName} in ${city}`
      : businessName
        ? `Demo for ${businessName}`
        : null;

  return (
    <div
      className="flex h-full w-full items-center justify-between px-3 gap-2"
      style={{
        background: "oklch(0.1 0.012 280 / 85%)",
        borderBottom: "1px solid oklch(1 0 0 / 8%)",
        backdropFilter: "blur(8px)",
      }}
      data-ocid="demo.progress_bar"
    >
      {/* Logo */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
            boxShadow: "0 0 10px oklch(0.58 0.22 290 / 40%)",
          }}
        >
          BRF
        </div>
        <span
          className="hidden text-xs font-semibold sm:block"
          style={{ color: "oklch(0.78 0.16 290)" }}
        >
          Booked, Ranked & Fundable
        </span>
      </div>

      {isIntake ? (
        <span
          className="text-xs font-medium"
          style={{ color: "oklch(0.62 0.02 280)" }}
        >
          Personalize your demo
        </span>
      ) : (
        <>
          {/* Demo label — business name + city on non-intake steps */}
          {demoLabel && (
            <span
              className="hidden sm:block text-[10px] font-semibold truncate max-w-[130px]"
              style={{ color: "oklch(0.52 0.06 290)" }}
              title={demoLabel}
            >
              {demoLabel}
            </span>
          )}
          {/* Act indicators — shown on sm+ screens */}
          <div
            className="hidden sm:flex items-center gap-1 flex-1 justify-center"
            aria-hidden="true"
          >
            {ACTS.map((act, i) => {
              const done = i < currentActIdx;
              const active = i === currentActIdx;
              return (
                <div key={act.label} className="flex items-center gap-1">
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
                        : "1px solid transparent",
                    }}
                  >
                    {done && <span>✓</span>}
                    {act.label}
                  </div>
                  {i < ACTS.length - 1 && (
                    <span
                      className="text-[8px]"
                      style={{ color: "oklch(0.3 0.02 280)" }}
                    >
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Compact progress bar — visible on mobile */}
          <div
            className="sm:hidden flex flex-1 items-center gap-2 mx-2"
            data-ocid="demo.step_counter"
          >
            <span
              className="shrink-0 text-xs font-semibold tabular-nums"
              style={{ color: "oklch(0.78 0.16 290)" }}
            >
              {step}/{totalSteps}
            </span>
            <div
              className="relative h-1.5 flex-1 overflow-hidden rounded-full"
              style={{ background: "oklch(1 0 0 / 10%)" }}
              aria-label={`Demo step ${step} of ${totalSteps}`}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${fillPct}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.68 0.18 290))",
                  transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 0 6px oklch(0.58 0.22 290 / 50%)",
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Step dots — right side */}
      {!isIntake && (
        <div className="shrink-0 flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: totalSteps }, (_, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div
                key={n}
                className="rounded-full transition-all duration-300"
                style={{
                  width: active ? "18px" : "5px",
                  height: "5px",
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
      )}
    </div>
  );
}
