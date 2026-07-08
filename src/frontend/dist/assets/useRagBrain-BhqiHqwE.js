import { b1 as useActor, r as reactExports, b6 as createActor } from "./index-iniFfpN1.js";
function useRagBrain() {
  const { actor: _actor, isFetching } = useActor(createActor);
  const actor = _actor;
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const withLoading = reactExports.useCallback(
    async (fn) => {
      setIsLoading(true);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Operation failed";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  const uploadDocument = reactExports.useCallback(
    async (collectionName, title, content, sourceType) => {
      if (!actor) return null;
      return withLoading(
        () => actor.uploadDocument(collectionName, title, content, sourceType, "")
      );
    },
    [actor, withLoading]
  );
  const queryRAG = reactExports.useCallback(
    async (question, collectionName) => {
      if (!actor) return null;
      return withLoading(async () => {
        const result = await actor.queryRAG(question, collectionName, "");
        return result;
      });
    },
    [actor, withLoading]
  );
  const getDocuments = reactExports.useCallback(
    async (collectionName) => {
      if (!actor) return null;
      return withLoading(async () => {
        const docs = await actor.getKnowledgeDocuments(collectionName, "");
        return docs;
      });
    },
    [actor, withLoading]
  );
  const getVectorStatus = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const status = await actor.getVectorIndexStatus();
      return status;
    });
  }, [actor, withLoading]);
  const getUsageLogs = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const logs = await actor.getAIUsageLogs("");
      return logs;
    });
  }, [actor, withLoading]);
  const getProviderConfigs = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const configs = await actor.getProviderConfigs();
      return configs;
    });
  }, [actor, withLoading]);
  const saveProviderConfig = reactExports.useCallback(async (_config) => {
    setIsLoading(false);
    return;
  }, []);
  const pingProvider = reactExports.useCallback(async (_providerType) => {
    setIsLoading(false);
    return false;
  }, []);
  const getConversationHistory = reactExports.useCallback(
    async (sessionId) => {
      if (!actor) return null;
      return withLoading(async () => {
        const msgs = await actor.getConversationHistory("", sessionId);
        return msgs;
      });
    },
    [actor, withLoading]
  );
  const addMessage = reactExports.useCallback(
    async (sessionId, role, content) => {
      if (!actor) return null;
      return withLoading(
        () => actor.addConversationMessage("", sessionId, role, content)
      );
    },
    [actor, withLoading]
  );
  const getAutomationConfigs = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const configs = await actor.getAutomationConfigs("");
      return configs;
    });
  }, [actor, withLoading]);
  const saveAutomationConfig = reactExports.useCallback(
    async (config) => {
      if (!actor) return null;
      return withLoading(
        () => actor.saveAutomationConfig(
          config.trigger,
          config.isEnabled,
          config.requiresApproval,
          ""
        )
      );
    },
    [actor, withLoading]
  );
  const runAgentNode = reactExports.useCallback(
    async (nodeType, inputData) => {
      if (!actor) return null;
      return withLoading(async () => {
        const run = await actor.runAgentNode(nodeType, inputData, "");
        return run;
      });
    },
    [actor, withLoading]
  );
  return {
    isLoading,
    error,
    isReady: !!actor && !isFetching,
    uploadDocument,
    queryRAG,
    getDocuments,
    getVectorStatus,
    getUsageLogs,
    getProviderConfigs,
    saveProviderConfig,
    pingProvider,
    getConversationHistory,
    addMessage,
    getAutomationConfigs,
    saveAutomationConfig,
    runAgentNode
  };
}
export {
  useRagBrain as u
};
