import { createContext, useContext, useState } from "react";

export interface SessionData {
  firstName: string;
  businessName: string;
  city: string;
  niche: string;
  phone: string;
  email: string;
  website: string;
  sessionId: string | null;
  lastName?: string;
  state?: string;
  monthlyRevenue?: string;
  biggestProblem?: string;
  crewCount?: string;
}

export const clearDemoSession = () =>
  sessionStorage.removeItem("demoFlowSession");

interface DemoFlowState {
  currentStep: number;
  sessionData: SessionData;
  goNext: () => void;
  goPrev: () => void;
  setSessionData: (data: SessionData) => void;
}

const DemoFlowContext = createContext<DemoFlowState | null>(null);

export function useDemoFlow(): DemoFlowState {
  const ctx = useContext(DemoFlowContext);
  if (!ctx) throw new Error("useDemoFlow must be used inside DemoFlowProvider");
  return ctx;
}

export function DemoFlowProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionData, setSessionData] = useState<SessionData>(() => {
    try {
      const stored = sessionStorage.getItem("demoFlowSession");
      if (stored) {
        const parsed = JSON.parse(stored) as SessionData;
        if (parsed?.businessName) return parsed;
      }
    } catch {}
    return {
      firstName: "",
      businessName: "",
      city: "",
      niche: "",
      phone: "",
      email: "",
      website: "",
      sessionId: null,
    };
  });

  const handleSetSessionData = (data: SessionData) => {
    sessionStorage.setItem("demoFlowSession", JSON.stringify(data));
    setSessionData(data);
  };

  const goNext = () => setCurrentStep((s) => s + 1);
  const goPrev = () => setCurrentStep((s) => Math.max(0, s - 1));

  return (
    <DemoFlowContext.Provider
      value={{
        currentStep,
        sessionData,
        goNext,
        goPrev,
        setSessionData: handleSetSessionData,
      }}
    >
      {children}
    </DemoFlowContext.Provider>
  );
}
