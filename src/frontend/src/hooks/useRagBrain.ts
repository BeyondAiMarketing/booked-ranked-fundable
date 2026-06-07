import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = any;
import type {
  AIUsageLog,
  AgentNodeRun,
  AgentNodeType,
  AutomationConfig,
  AutomationTrigger,
  CollectionName,
  ConversationMessage,
  KnowledgeDocument,
  ProviderConfig,
  ProviderType,
  RAGQueryResult,
  VectorIndexStatus,
} from "@/types/ragBrain";

// ── useRagBrain ───────────────────────────────────────────────────────────────

export function useRagBrain() {
  const { actor: _actor, isFetching } = useActor(createActor);
  const actor = _actor as AnyActor;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
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
    [],
  );

  const uploadDocument = useCallback(
    async (
      collectionName: CollectionName,
      title: string,
      content: string,
      sourceType: string,
    ) => {
      if (!actor) return null;
      return withLoading(() =>
        actor.uploadDocument(collectionName, title, content, sourceType, ""),
      );
    },
    [actor, withLoading],
  );

  const queryRAG = useCallback(
    async (question: string, collectionName: CollectionName) => {
      if (!actor) return null;
      return withLoading(async () => {
        const result = await actor.queryRAG(question, collectionName, "");
        return result as RAGQueryResult;
      });
    },
    [actor, withLoading],
  );

  const getDocuments = useCallback(
    async (collectionName: CollectionName) => {
      if (!actor) return null;
      return withLoading(async () => {
        const docs = await actor.getKnowledgeDocuments(collectionName, "");
        return docs as KnowledgeDocument[];
      });
    },
    [actor, withLoading],
  );

  const getVectorStatus = useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const status = await actor.getVectorIndexStatus();
      return status as VectorIndexStatus;
    });
  }, [actor, withLoading]);

  const getUsageLogs = useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const logs = await actor.getAIUsageLogs("");
      return logs as AIUsageLog[];
    });
  }, [actor, withLoading]);

  const getProviderConfigs = useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const configs = await actor.getProviderConfigs();
      return configs as ProviderConfig[];
    });
  }, [actor, withLoading]);

  const saveProviderConfig = useCallback(async (_config: ProviderConfig) => {
    setIsLoading(false);
    return;
  }, []);

  const pingProvider = useCallback(async (_providerType: ProviderType) => {
    setIsLoading(false);
    return false;
  }, []);

  const getConversationHistory = useCallback(
    async (sessionId: string) => {
      if (!actor) return null;
      return withLoading(async () => {
        const msgs = await actor.getConversationHistory("", sessionId);
        return msgs as ConversationMessage[];
      });
    },
    [actor, withLoading],
  );

  const addMessage = useCallback(
    async (sessionId: string, role: "User" | "Assistant", content: string) => {
      if (!actor) return null;
      return withLoading(() =>
        actor.addConversationMessage("", sessionId, role, content),
      );
    },
    [actor, withLoading],
  );

  const getAutomationConfigs = useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const configs = await actor.getAutomationConfigs("");
      return configs as AutomationConfig[];
    });
  }, [actor, withLoading]);

  const saveAutomationConfig = useCallback(
    async (config: AutomationConfig) => {
      if (!actor) return null;
      return withLoading(() =>
        actor.saveAutomationConfig(
          config.trigger,
          config.isEnabled,
          config.requiresApproval,
          "",
        ),
      );
    },
    [actor, withLoading],
  );

  const runAgentNode = useCallback(
    async (nodeType: AgentNodeType, inputData: string) => {
      if (!actor) return null;
      return withLoading(async () => {
        const run = await actor.runAgentNode(nodeType, inputData, "");
        return run as AgentNodeRun;
      });
    },
    [actor, withLoading],
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
    runAgentNode,
  };
}
