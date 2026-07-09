import { ad as useActor, r as reactExports } from "./index-Dwzp0QDY.js";
function useBusinessBrief() {
  const { actor } = useActor();
  const [brief, setBrief] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const fetchBrief = reactExports.useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getAccountBrief();
      setBrief(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    fetchBrief();
  }, [fetchBrief]);
  const updateBrief = reactExports.useCallback(
    async (updates) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateAccountBrief(updates);
        setBrief(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );
  const addSessionLog = reactExports.useCallback(
    async (entry) => {
      if (!actor || !brief) return;
      setLoading(true);
      try {
        const updatedLog = [...brief.sessionLog || [], entry];
        const result = await actor.updateAccountBrief({
          sessionLog: updatedLog
        });
        setBrief(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, brief]
  );
  const updateBrandVoice = reactExports.useCallback(
    async (brandVoice, doRules, dontRules) => {
      if (!actor || !brief) return;
      setLoading(true);
      try {
        const result = await actor.updateAccountBrief({
          brandVoice,
          doRules,
          dontRules
        });
        setBrief(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, brief]
  );
  return {
    brief,
    loading,
    error,
    updateBrief,
    addSessionLog,
    updateBrandVoice
  };
}
export {
  useBusinessBrief as u
};
