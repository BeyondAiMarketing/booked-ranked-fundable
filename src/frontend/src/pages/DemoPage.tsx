import DemoStep0Intake from "@/components/demo/DemoStep0Intake";
import DemoStep1BeforeAfter from "@/components/demo/DemoStep1BeforeAfter";
import DemoStep2Voice from "@/components/demo/DemoStep2Voice";
import DemoStep3Social from "@/components/demo/DemoStep3Social";
import DemoStep4Calendar from "@/components/demo/DemoStep4Calendar";
import DemoStep5OneApp from "@/components/demo/DemoStep5OneApp";
import DemoStep6BackOffice from "@/components/demo/DemoStep6BackOffice";
import DemoStep7Credit from "@/components/demo/DemoStep7Credit";
import DemoStep8Trial from "@/components/demo/DemoStep8Trial";
import { DemoFlowProvider, useDemoFlow } from "@/hooks/useDemoFlow";
import { useEffect, useRef } from "react";

const STEPS = 8;

function ProgressBar({ step }: { step: number }) {
  if (step === 0) return null;
  const pct = Math.round((step / STEPS) * 100);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950">
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs text-gray-400 font-medium">
          Step {step} of {STEPS}
        </span>
        <span className="text-xs text-purple-400 font-semibold">{pct}%</span>
      </div>
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function DemoPageContent() {
  const { currentStep, sessionData, goNext, goPrev } = useDemoFlow();
  const prevStep = useRef(currentStep);

  useEffect(() => {
    if (currentStep !== prevStep.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      prevStep.current = currentStep;
    }
  }, [currentStep]);

  const stepProps = { onNext: goNext, onPrev: goPrev, sessionData };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <ProgressBar step={currentStep} />
      <div
        key={currentStep}
        className="animate-fade-in"
        style={{ paddingTop: currentStep === 0 ? 0 : "3.5rem" }}
      >
        {currentStep === 0 && <DemoStep0Intake onNext={goNext} />}
        {currentStep === 1 && <DemoStep1BeforeAfter {...stepProps} />}
        {currentStep === 2 && <DemoStep2Voice {...stepProps} />}
        {currentStep === 3 && <DemoStep3Social {...stepProps} />}
        {currentStep === 4 && <DemoStep4Calendar {...stepProps} />}
        {currentStep === 5 && <DemoStep5OneApp {...stepProps} />}
        {currentStep === 6 && <DemoStep6BackOffice {...stepProps} />}
        {currentStep === 7 && <DemoStep7Credit {...stepProps} />}
        {currentStep === 8 && <DemoStep8Trial />}
      </div>
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
