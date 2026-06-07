import { b3 as useActor, r as reactExports, b6 as createActor } from "./index-CI0aYo5Z.js";
function useN8nWorkflow() {
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
  const getWorkflowDefs = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const defs = await actor.getWorkflowDefs();
      return defs;
    });
  }, [actor, withLoading]);
  const saveWorkflowDef = reactExports.useCallback(
    async (def) => {
      if (!actor) return null;
      return withLoading(
        () => actor.saveWorkflowDef(
          crypto.randomUUID(),
          def.name,
          def.description,
          def.tags || [],
          def.scope,
          def.workflowJson
        )
      );
    },
    [actor, withLoading]
  );
  const deleteWorkflowDef = reactExports.useCallback(
    async (id) => {
      if (!actor) return null;
      return withLoading(() => actor.deleteWorkflowDef(id));
    },
    [actor, withLoading]
  );
  const pushToScope = reactExports.useCallback(
    async (workflowId, scopeText) => {
      if (!actor) return null;
      return withLoading(
        () => actor.pushWorkflowToScope(workflowId, scopeText)
      );
    },
    [actor, withLoading]
  );
  const triggerWorkflow = reactExports.useCallback(
    async (req) => {
      if (!actor) return null;
      return withLoading(async () => {
        const exec = await actor.triggerWorkflow(
          req.workflowId,
          req.tenantId || "",
          req.triggeredBy || "user",
          req.customVars || []
        );
        return exec;
      });
    },
    [actor, withLoading]
  );
  const getExecutionLog = reactExports.useCallback(
    async (tenantId) => {
      if (!actor) return null;
      return withLoading(async () => {
        const logs = await actor.getExecutionLog(tenantId ?? "");
        return logs;
      });
    },
    [actor, withLoading]
  );
  const getN8NConfig = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const config = await actor.getN8NConfig();
      return config;
    });
  }, [actor, withLoading]);
  const saveN8NConfig = reactExports.useCallback(
    async (url, key) => {
      if (!actor) return null;
      return withLoading(() => actor.saveN8NConfig(url, key));
    },
    [actor, withLoading]
  );
  const testN8NConnection = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(() => actor.testN8NConnection());
  }, [actor, withLoading]);
  const getWebhookUrl = reactExports.useCallback(async () => {
    if (!actor) return null;
    return withLoading(async () => {
      const url = await actor.getWebhookUrl();
      return url;
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
    getWebhookUrl
  };
}
export {
  useN8nWorkflow as u
};
