import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

export interface BusinessBrief {
  id: string;
  clientBusinessId: string;
  verticalProfileId: string;
  businessName: string;
  locationName: string;
  website: string;
  primaryKeyword: string;
  serviceArea: string;
  targetLocations: string[];
  services: string[];
  currentFindings: string[];
  criticalFindings: string[];
  importantFindings: string[];
  monitorFindings: string[];
  toolsRun: string[];
  deliverables: string[];
  nextAction: string;
  sessionLog: string[];
  approvalConfig: string;
  performanceHistory: string[];
  localSEOHistory: string[];
  reviewHistory: string[];
  contentHistory: string[];
  fundingHistory: string[];
  lastUpdated: number;
  targetAudience: string;
  positioning: string;
  differentiators: string[];
  brandVoice: string;
  doRules: string[];
  dontRules: string[];
}

export function useBusinessBrief() {
  const { actor } = useActor();
  const [brief, setBrief] = useState<BusinessBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrief = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getAccountBrief();
      setBrief(result as BusinessBrief);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);

  const updateBrief = useCallback(
    async (updates: Partial<BusinessBrief>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateAccountBrief(updates);
        setBrief(result as BusinessBrief);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const addSessionLog = useCallback(
    async (entry: string) => {
      if (!actor || !brief) return;
      setLoading(true);
      try {
        const updatedLog = [...(brief.sessionLog || []), entry];
        const result = await actor.updateAccountBrief({
          sessionLog: updatedLog,
        });
        setBrief(result as BusinessBrief);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, brief],
  );

  const updateBrandVoice = useCallback(
    async (brandVoice: string, doRules: string[], dontRules: string[]) => {
      if (!actor || !brief) return;
      setLoading(true);
      try {
        const result = await actor.updateAccountBrief({
          brandVoice,
          doRules,
          dontRules,
        });
        setBrief(result as BusinessBrief);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, brief],
  );

  return {
    brief,
    loading,
    error,
    updateBrief,
    addSessionLog,
    updateBrandVoice,
  };
}
