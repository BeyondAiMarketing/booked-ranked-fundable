import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DomainSetupState,
  ImportedContent,
  Registrar,
  SiteImportStatus,
} from "../types/domainSetup";
import { useActor } from "./useActor";

const DEFAULT_STATE: DomainSetupState = {
  clientId: "admin-owner",
  domain: "",
  registrar: null,
  currentStep: 1,
  dnsAdded: false,
  propagationPercentage: 0,
  propagationComplete: false,
  siteImportStatus: "pending",
  importedContent: null,
  isActive: false,
};

export function useDomainSetup() {
  const { actor, isFetching } = useActor();
  const [state, setState] = useState<DomainSetupState>(DEFAULT_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [propagationInterval, setPropagationInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const propagationRef = useRef(state.propagationPercentage);
  propagationRef.current = state.propagationPercentage;

  // Load persisted state on mount
  useEffect(() => {
    if (!actor || isFetching) return;
    const load = async () => {
      try {
        const result = await (
          actor as unknown as {
            getDomainSetupState: (
              id: string,
            ) => Promise<{ ok?: DomainSetupState | null; err?: string }>;
          }
        ).getDomainSetupState("admin-owner");
        if ("ok" in result && result.ok) {
          setState(result.ok as DomainSetupState);
        }
      } catch {
        // Backend not available — use defaults
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [actor, isFetching]);

  const persist = useCallback(
    async (next: DomainSetupState) => {
      if (!actor) return;
      setIsSaving(true);
      try {
        await (
          actor as unknown as {
            saveDomainSetupState: (
              id: string,
              s: DomainSetupState,
            ) => Promise<{ ok?: null; err?: string }>;
          }
        ).saveDomainSetupState("admin-owner", next);
      } catch {
        // Persist failure is non-blocking — state is still live in memory
      } finally {
        setIsSaving(false);
      }
    },
    [actor],
  );

  const update = useCallback(
    (partial: Partial<DomainSetupState>) => {
      setState((prev) => {
        const next = { ...prev, ...partial };
        persist(next);
        return next;
      });
    },
    [persist],
  );

  // ── Step-specific actions ──────────────────────────────────────────────────

  const setDomain = useCallback(
    (domain: string) => {
      const cleaned = domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .trim();
      update({ domain: cleaned });
    },
    [update],
  );

  const confirmRegistrar = useCallback(
    (registrar: Registrar) => {
      update({ registrar, currentStep: 3 });
    },
    [update],
  );

  const advanceToStep = useCallback(
    (step: number) => {
      update({ currentStep: step });
    },
    [update],
  );

  const markDnsAdded = useCallback(() => {
    update({ dnsAdded: true, currentStep: 5 });
  }, [update]);

  // Propagation polling — simulated (can't do real DNS from browser)
  const startPropagationCheck = useCallback(() => {
    if (propagationInterval) clearInterval(propagationInterval);
    const interval = setInterval(() => {
      const current = propagationRef.current;
      if (current >= 100) {
        clearInterval(interval);
        setState((prev) => {
          const next = {
            ...prev,
            propagationPercentage: 100,
            propagationComplete: true,
          };
          persist(next);
          return next;
        });
        setPropagationInterval(null);
      } else {
        const increment = Math.floor(Math.random() * 8) + 3; // 3-10 per tick
        const next_pct = Math.min(current + increment, 100);
        setState((prev) => {
          const next = { ...prev, propagationPercentage: next_pct };
          if (next_pct >= 100) {
            persist({ ...next, propagationComplete: true });
            return { ...next, propagationComplete: true };
          }
          persist(next);
          return next;
        });
      }
    }, 8000);
    setPropagationInterval(interval);
  }, [propagationInterval, persist]);

  const checkPropagationOnce = useCallback(() => {
    // Show a simulated check — after 40s total with no activity, report 0%
    update({ propagationPercentage: 0 });
    startPropagationCheck();
  }, [update, startPropagationCheck]);

  const continueAnyway = useCallback(() => {
    if (propagationInterval) clearInterval(propagationInterval);
    update({ propagationComplete: true, currentStep: 6 });
  }, [propagationInterval, update]);

  const startSiteImport = useCallback(() => {
    update({ siteImportStatus: "scanning" });
    setTimeout(() => {
      const imported: ImportedContent = {
        businessName: state.domain
          .split(".")[0]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        services: [
          "Service & Repair",
          "Emergency Response",
          "Maintenance Plans",
          "Free Estimates",
        ],
        contactInfo: `info@${state.domain}`,
        colorScheme: "#1a1a2e, #16213e, #0f3460",
      };
      setState((prev) => {
        const next = {
          ...prev,
          siteImportStatus: "done" as SiteImportStatus,
          importedContent: imported,
        };
        persist(next);
        return next;
      });
    }, 3500);
  }, [state.domain, update, persist]);

  const skipSiteImport = useCallback(() => {
    update({ siteImportStatus: "skipped", currentStep: 7 });
  }, [update]);

  const activateDomain = useCallback(() => {
    update({ isActive: true });
  }, [update]);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    persist(DEFAULT_STATE);
  }, [persist]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (propagationInterval) clearInterval(propagationInterval);
    };
  }, [propagationInterval]);

  return {
    state,
    isSaving,
    isLoading,
    setDomain,
    confirmRegistrar,
    advanceToStep,
    markDnsAdded,
    checkPropagationOnce,
    continueAnyway,
    startSiteImport,
    skipSiteImport,
    activateDomain,
    reset,
    update,
  };
}
