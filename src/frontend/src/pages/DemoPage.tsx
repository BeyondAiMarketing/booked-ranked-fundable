/**
 * DemoPage — Version 118 ground-up rebuild — 3-Act guided demo.
 *
 * Step map:
 *   0 → DemoStep0Intake (full screen, no shell)
 *   1 → DemoStep1Website (Act 1: Website)
 *   2 → DemoStep2Voice   (Act 1: Voice Agent — centerpiece)
 *   3 → DemoStep3Chat    (Act 1: Chat Widget)
 *   [ActTransition 1→2]
 *   4 → DemoStep4CRM     (Act 2: CRM)
 *   5 → DemoStep5Reputation (Act 2: Reviews)
 *   6 → DemoStep6Social  (Act 2: Social)
 *   7 → DemoStep7Credit  (Act 2: Credit Builder)
 *   8 → DemoStep8Revenue (Act 2: Revenue)
 *   [ActTransition 2→3]
 *   9 → DemoStep9CTA     (Act 3: Trial CTA)
 *
 * Supports ?niche= query param to pre-select niche.
 * Supports ?step= and ?replay= for admin preview.
 */

import ActTransitionCard from "@/components/demo/ActTransitionCard";
import DemoShell from "@/components/demo/DemoShell";
import DemoStep0Intake from "@/components/demo/DemoStep0Intake";
import DemoStep1Website from "@/components/demo/DemoStep1Website";
import DemoStep2Voice from "@/components/demo/DemoStep2Voice";
import DemoStep3Chat from "@/components/demo/DemoStep3Chat";
import DemoStep4CRM from "@/components/demo/DemoStep4CRM";
import DemoStep5Reputation from "@/components/demo/DemoStep5Reputation";
import DemoStep6Social from "@/components/demo/DemoStep6Social";
import DemoStep7Credit from "@/components/demo/DemoStep7Credit";
import DemoStep8Revenue from "@/components/demo/DemoStep8Revenue";
import DemoStep9CTA from "@/components/demo/DemoStep9CTA";
import {
  DemoFlowProvider,
  buildDefaultProspect,
  useDemoFlow,
} from "@/hooks/useDemoFlow";
import type { DemoNicheIdLegacy } from "@/types/demo";
import { useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

// Transition states: between Act 1 (steps 1-3) and Act 2 (steps 4-8),
// and between Act 2 and Act 3 (step 9)
type TransitionState = "none" | "act1-to-2" | "act2-to-3";

// ─── Step content switcher ────────────────────────────────────────────────────

function DemoStepContent({
  transition,
  onTransitionDone,
}: {
  transition: TransitionState;
  onTransitionDone: () => void;
}) {
  const { step, niche } = useDemoFlow();
  const nicheId = (niche || "plumber") as DemoNicheIdLegacy;

  if (transition === "act1-to-2") {
    return (
      <ActTransitionCard
        niche={nicheId}
        actLabel="Act 2 — Your Back Office"
        onDone={onTransitionDone}
      />
    );
  }

  if (transition === "act2-to-3") {
    return (
      <ActTransitionCard
        niche={nicheId}
        actLabel="Act 3 — Your 7-Day Free Trial"
        onDone={onTransitionDone}
      />
    );
  }

  const STEP_MAP: Record<number, React.ReactElement> = {
    1: <DemoStep1Website />,
    2: <DemoStep2Voice />,
    3: <DemoStep3Chat />,
    4: <DemoStep4CRM />,
    5: <DemoStep5Reputation />,
    6: <DemoStep6Social />,
    7: <DemoStep7Credit />,
    8: <DemoStep8Revenue />,
    9: <DemoStep9CTA />,
  };

  return STEP_MAP[step] ?? <DemoStep1Website />;
}

// ─── Step router — inside provider ───────────────────────────────────────────

function DemoStepRouter() {
  const { step, goNext, isStepComplete } = useDemoFlow();
  const [transition, setTransition] = useState<TransitionState>("none");

  const handleNext = useCallback(() => {
    if (!isStepComplete) return;
    // After step 3 → Act 1→2 transition
    if (step === 3) {
      setTransition("act1-to-2");
      return;
    }
    // After step 8 → Act 2→3 transition
    if (step === 8) {
      setTransition("act2-to-3");
      return;
    }
    goNext();
  }, [step, isStepComplete, goNext]);

  const handleTransitionDone = useCallback(() => {
    setTransition("none");
    goNext();
  }, [goNext]);

  if (step === 0) {
    return <DemoStep0Intake />;
  }

  return (
    <DemoShell onNext={handleNext}>
      {/* Content area — padded to account for bottom nav bar (h-16) */}
      <div className="h-full w-full overflow-y-auto px-4 py-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${transition}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="flex flex-col items-center w-full max-w-lg mx-auto"
          >
            <DemoStepContent
              transition={transition}
              onTransitionDone={handleTransitionDone}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </DemoShell>
  );
}

// ─── DemoPage — public entry point ───────────────────────────────────────────

export default function DemoPage() {
  const search = useSearch({ from: "/demo" }) as {
    niche?: string;
    admin?: string;
    step?: string;
    replay?: string;
  };

  const initialStep = (() => {
    if (search.replay) {
      const n = Number.parseInt(search.replay, 10);
      if (n >= 1 && n <= 9) return n;
    }
    if (search.step) {
      const n = Number.parseInt(search.step, 10);
      if (n >= 0 && n <= 9) return n;
    }
    return 0;
  })();

  return (
    <DemoFlowProvider>
      <DemoPageInner
        initialNiche={search.niche as DemoNicheIdLegacy | undefined}
        initialStep={initialStep}
        isAdminPreview={search.admin === "true"}
      />
    </DemoFlowProvider>
  );
}

function DemoPageInner({
  initialNiche,
  initialStep,
  isAdminPreview,
}: {
  initialNiche?: DemoNicheIdLegacy;
  initialStep: number;
  isAdminPreview: boolean;
}) {
  const { startDemo, goToStep } = useDemoFlow();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run once on mount
  useEffect(() => {
    if (isAdminPreview && initialNiche) {
      const d = buildDefaultProspect(initialNiche);
      startDemo({
        businessName: d.businessName,
        niche: d.niche,
        city: d.city,
        phone: d.phone,
      });
    }
    if (initialStep > 0) {
      goToStep(initialStep);
    }
  }, []);

  return <DemoStepRouter />;
}
