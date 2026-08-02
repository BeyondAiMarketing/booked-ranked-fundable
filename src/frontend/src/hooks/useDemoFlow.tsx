import { createContext, useContext, useEffect, useState } from "react";

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

const MAX_STEP = 8;

export const clearDemoSession = () => {
  sessionStorage.removeItem("demoFlowSession");
  sessionStorage.removeItem("demoFlowStep");
};

interface DemoFlowState {
  currentStep: number;
  sessionData: SessionData;
  goNext: () => void;
  goPrev: () => void;
  restart: () => void;
  setSessionData: (data: SessionData) => void;
}

const DemoFlowContext = createContext<DemoFlowState | null>(null);

export function useDemoFlow(): DemoFlowState {
  const ctx = useContext(DemoFlowContext);
  if (!ctx) throw new Error("useDemoFlow must be used inside DemoFlowProvider");
  return ctx;
}

export function DemoFlowProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const stored = Number(sessionStorage.getItem("demoFlowStep") ?? 0);
      return Number.isFinite(stored) ? Math.min(MAX_STEP, Math.max(0, stored)) : 0;
    } catch {
      return 0;
    }
  });

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

  useEffect(() => {
    sessionStorage.setItem("demoFlowStep", String(currentStep));
  }, [currentStep]);

  const handleSetSessionData = (data: SessionData) => {
    sessionStorage.setItem("demoFlowSession", JSON.stringify(data));
    setSessionData(data);
  };

  const goNext = () => setCurrentStep((step) => Math.min(MAX_STEP, step + 1));
  const goPrev = () => setCurrentStep((step) => Math.max(0, step - 1));
  const restart = () => {
    clearDemoSession();
    setCurrentStep(0);
    setSessionData({
      firstName: "",
      businessName: "",
      city: "",
      niche: "",
      phone: "",
      email: "",
      website: "",
      sessionId: null,
    });
  };

  return (
    <DemoFlowContext.Provider
      value={{
        currentStep,
        sessionData,
        goNext,
        goPrev,
        restart,
        setSessionData: handleSetSessionData,
      }}
    >
      {children}
    </DemoFlowContext.Provider>
  );
}
