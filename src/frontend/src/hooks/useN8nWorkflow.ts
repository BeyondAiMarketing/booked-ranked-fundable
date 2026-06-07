import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = any;
import type {
  N8NConnectionDisplay,
  WorkflowDef,
  WorkflowExecution,
  WorkflowTriggerRequest,
} from "@/types/n8nWorkflow";

// ── useN8nWorkflow ────────────────────────────────────────────────────────────

export function useN8nWorkflow() {
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

  const getWorkflowDefs = useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const defs = await actor.getWorkflowDefs();
      return defs as WorkflowDef[];
    });
  }, [actor, withLoading]);

  const saveWorkflowDef = useCallback(
    async (def: Omit<WorkflowDef, "id" | "createdAt" | "pushedToAccounts">) => {
      if (!actor) return null;
      return withLoading(() =>
        actor.saveWorkflowDef(
          crypto.randomUUID(),
          def.name,
          def.description,
          def.tags || [],
          def.scope,
          def.workflowJson,
        ),
      );
    },
    [actor, withLoading],
  );

  const deleteWorkflowDef = useCallback(
    async (id: string) => {
      if (!actor) return null;
      return withLoading(() => actor.deleteWorkflowDef(id));
    },
    [actor, withLoading],
  );

  const pushToScope = useCallback(
    async (workflowId: string, scopeText: string) => {
      if (!actor) return null;
      return withLoading(() =>
        actor.pushWorkflowToScope(workflowId, scopeText),
      );
    },
    [actor, withLoading],
  );

  const triggerWorkflow = useCallback(
    async (req: WorkflowTriggerRequest) => {
      if (!actor) return null;
      return withLoading(async () => {
        const exec = await actor.triggerWorkflow(
          req.workflowId,
          req.tenantId || "",
          req.triggeredBy || "user",
          req.customVars || [],
        );
        return exec as WorkflowExecution;
      });
    },
    [actor, withLoading],
  );

  const getExecutionLog = useCallback(
    async (tenantId?: string) => {
      if (!actor) return null;
      return withLoading(async () => {
        const logs = await actor.getExecutionLog(tenantId ?? "");
        return logs as WorkflowExecution[];
      });
    },
    [actor, withLoading],
  );

  const getN8NConfig = useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const config = await actor.getN8NConfig();
      return config as N8NConnectionDisplay;
    });
  }, [actor, withLoading]);

  const saveN8NConfig = useCallback(
    async (url: string, key: string) => {
      if (!actor) return null;
      return withLoading(() => actor.saveN8NConfig(url, key));
    },
    [actor, withLoading],
  );

  const testN8NConnection = useCallback(async () => {
    if (!actor) return null;
    return withLoading(() => actor.testN8NConnection());
  }, [actor, withLoading]);

  const getWebhookUrl = useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const url = await actor.getWebhookUrl();
      return url as string;
    });
  }, [actor, withLoading]);

  return {
    isLoading,
    error,
    isReady: !!actor && !isFetching,
    getWorkflowDefs,
    saveWorkflowDef,
    deleteWorkflowDef,
    pushToScope,
    triggerWorkflow,
    getExecutionLog,
    getN8NConfig,
    saveN8NConfig,
    testN8NConnection,
    getWebhookUrl,
  };
}
