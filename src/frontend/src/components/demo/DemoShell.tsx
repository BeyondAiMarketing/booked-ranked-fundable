/**
 * DemoShell — wraps DemoLayout + GreenConfirmOverlay.
 *
 * - Full-screen layout with sticky progress bar at top
 * - GreenConfirmOverlay rendered from context (showGreenOverlay/hideGreenOverlay)
 * - Bottom nav bar with Next button (step > 0 only)
 * - No back button — forward-only progression
 */

import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence } from "motion/react";
import DemoLayout from "./DemoLayout";
import DemoNavBar from "./DemoNavBar";
import GreenConfirmOverlay from "./GreenConfirmOverlay";

interface DemoShellProps {
  children: React.ReactNode;
  /** Called when Next is tapped — allows DemoPage to inject transitions */
  onNext?: () => void;
}

export default function DemoShell({ children, onNext }: DemoShellProps) {
  const { step, greenOverlay, hideGreenOverlay } = useDemoFlow();

  return (
    <DemoLayout>
      {/* Step content — pb-36 ensures content clears the fixed nav bar + coach tip banner */}
      <div
        className="h-full w-full overflow-y-auto pb-36"
        data-ocid={`demo.step.${step}`}
      >
        {children}
      </div>

      {/* Bottom nav bar — fixed, always on top, never covered by content */}
      {step > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 h-16 shrink-0"
          style={{
            background: "oklch(0.1 0.012 280 / 85%)",
            borderTop: "1px solid oklch(1 0 0 / 8%)",
            backdropFilter: "blur(8px)",
          }}
        >
          <DemoNavBar onNext={onNext} />
        </div>
      )}

      {/* Full-screen green overlay from context */}
      <AnimatePresence>
        {greenOverlay && (
          <GreenConfirmOverlay
            data={greenOverlay}
            onDismiss={hideGreenOverlay}
            dataOcid="demo.green_overlay"
          />
        )}
      </AnimatePresence>
    </DemoLayout>
  );
}
