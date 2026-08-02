import DemoStep0Intake from "@/components/demo/DemoStep0Intake";
import DemoStep1BeforeAfter from "@/components/demo/DemoStep1BeforeAfter";
import DemoStep2Voice from "@/components/demo/DemoStep2Voice";
import DemoStep3Social from "@/components/demo/DemoStep3Social";
import DemoStep4Calendar from "@/components/demo/DemoStep4Calendar";
import DemoStep5OneApp from "@/components/demo/DemoStep5OneApp";
import DemoStep6BackOffice from "@/components/demo/DemoStep6BackOffice";
import DemoStep7Credit from "@/components/demo/DemoStep7Credit";
import DemoStep8Launch from "@/components/demo/DemoStep8Launch";
import { DemoFlowProvider, useDemoFlow } from "@/hooks/useDemoFlow";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";

const STEPS = 8;
const STEP_LABELS = [
  "Personalize",
  "Before & After",
  "AI Voice Agent",
  "Social Engine",
  "Booking System",
  "One App",
  "Back Office",
  "Fundability",
  "Launch",
];

function ProgressBar({
  step,
  onRestart,
}: {
  step: number;
  onRestart: () => void;
}) {
  if (step === 0) return null;
  const pct = Math.round((step / STEPS) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-purple-300">
              Step {step} of {STEPS}
            </span>
            <span className="hidden text-xs text-gray-500 sm:inline">•</span>
            <span className="truncate text-xs font-medium text-gray-300">
              {STEP_LABELS[step]}
            </span>
          </div>
          <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">
            About {Math.max(1, STEPS - step + 1)} minutes remaining
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 text-[11px] text-emerald-300 md:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            No credit card
          </div>
          <span className="text-xs font-bold text-purple-400">{pct}%</span>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-gray-400 transition hover:border-white/20 hover:text-white"
            aria-label="Restart demo"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function DemoPageContent() {
  const { currentStep, sessionData, goNext, goPrev, restart } = useDemoFlow();
  const prevStep = useRef(currentStep);

  useEffect(() => {
    document.title = `${STEP_LABELS[currentStep]} | Booked Ranked Fundable Demo`;
    if (currentStep !== prevStep.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      prevStep.current = currentStep;
    }
  }, [currentStep]);

  const stepProps = { onNext: goNext, onPrev: goPrev, sessionData };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <ProgressBar step={currentStep} onRestart={restart} />
      <main
        key={currentStep}
        className="animate-fade-in"
        style={{ paddingTop: currentStep === 0 ? 0 : "4.75rem" }}
      >
        {currentStep === 0 && <DemoStep0Intake onNext={goNext} />}
        {currentStep === 1 && <DemoStep1BeforeAfter {...stepProps} />}
        {currentStep === 2 && <DemoStep2Voice {...stepProps} />}
        {currentStep === 3 && <DemoStep3Social {...stepProps} />}
        {currentStep === 4 && <DemoStep4Calendar {...stepProps} />}
        {currentStep === 5 && <DemoStep5OneApp {...stepProps} />}
        {currentStep === 6 && <DemoStep6BackOffice {...stepProps} />}
        {currentStep === 7 && <DemoStep7Credit {...stepProps} />}
        {currentStep === 8 && <DemoStep8Launch />}
      </main>
    </div>
  );
}

export default function DemoPage() {
  return (
    <DemoFlowProvider>
      <DemoPageContent />
    </DemoFlowProvider>
  );
}
