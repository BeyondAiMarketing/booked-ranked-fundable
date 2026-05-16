import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { WIZARD_STEPS } from "../../types/domainSetup";

interface Props {
  currentStep: number;
  onStepClick: (step: number) => void;
  children: React.ReactNode;
  isSaving?: boolean;
}

export default function DomainWizardShell({
  currentStep,
  onStepClick,
  children,
  isSaving,
}: Props) {
  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="w-full">
      {/* Mobile: horizontal progress dots */}
      <div className="flex sm:hidden items-center gap-1 mb-6 px-1 overflow-x-auto pb-1">
        {WIZARD_STEPS.map((step) => {
          const status = getStepStatus(step.number);
          return (
            <button
              key={step.number}
              type="button"
              data-ocid={`domain.stepper.step.${step.number}`}
              onClick={() => status !== "pending" && onStepClick(step.number)}
              className="flex flex-col items-center gap-1 flex-shrink-0"
              aria-label={`Step ${step.number}: ${step.title}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-smooth
                  ${status === "active" ? "bg-primary text-primary-foreground shadow-[0_0_12px_oklch(0.58_0.22_290/50%)]" : ""}
                  ${status === "completed" ? "bg-emerald-600/30 border border-emerald-500/50 text-emerald-400" : ""}
                  ${status === "pending" ? "bg-muted text-muted-foreground border border-border" : ""}
                `}
              >
                {status === "completed" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  step.number
                )}
              </div>
            </button>
          );
        })}
        {isSaving && (
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 size={12} className="animate-spin" />
            <span>Saving</span>
          </div>
        )}
      </div>

      {/* Desktop: 2-column layout */}
      <div className="hidden sm:grid domain-config-container">
        {/* Left Stepper */}
        <aside className="domain-stepper">
          <div className="mb-4 px-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progress
            </p>
            {isSaving && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Loader2 size={11} className="animate-spin" />
                <span>Auto-saving...</span>
              </div>
            )}
          </div>
          {WIZARD_STEPS.map((step) => {
            const status = getStepStatus(step.number);
            const isClickable = status !== "pending";
            return (
              <button
                key={step.number}
                type="button"
                data-ocid={`domain.stepper.step.${step.number}`}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`step-item w-full text-left ${status} ${!isClickable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                aria-current={status === "active" ? "step" : undefined}
                disabled={!isClickable}
              >
                <div className={`step-number ${status}`}>
                  {status === "completed" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Circle size={12} className="opacity-40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold truncate ${status === "active" ? "text-primary" : status === "completed" ? "text-emerald-400" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {step.description}
                  </p>
                </div>
                {status === "active" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Content */}
        <main className="min-w-0">{children}</main>
      </div>

      {/* Mobile content */}
      <div className="sm:hidden">{children}</div>
    </div>
  );
}
