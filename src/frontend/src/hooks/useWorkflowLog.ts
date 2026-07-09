import { useCallback, useEffect, useState } from "react";
import type { WorkflowLog } from "../types/socialContent";
import { useActor } from "./useActor";

export function useWorkflowLog() {
  const { actor } = useActor();
  const [logs, setLogs] = useState<WorkflowLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLog = useCallback(
    async (data: Omit<WorkflowLog, "id" | "createdAt">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createWorkflowLog(data);
        setLogs((prev) => [result as WorkflowLog, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const updateLog = useCallback(
    async (id: string, updates: Partial<WorkflowLog>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateWorkflowLog(id, updates);
        setLogs((prev) =>
          prev.map((l) => (l.id === id ? (result as WorkflowLog) : l)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const listByWorkflow = useCallback(
    async (workflowId: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.getWorkflowLogsByWorkflow(workflowId);
        if ("ok" in result) {
          setLogs(result.ok as WorkflowLog[]);
        } else {
          setError(result.err);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const listByAgent = useCallback(
    async (agentId: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.listWorkflowLogsByAgent(agentId);
        setLogs(result as WorkflowLog[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    actor
      .getWorkflowLogsByWorkflow("all")
      .then((result) => {
        if ("ok" in result) {
          setLogs(result.ok as WorkflowLog[]);
        } else {
          setError(result.err);
        }
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Unknown error"),
      )
      .finally(() => setLoading(false));
  }, [actor]);

  return {
    logs,
    loading,
    error,
    createLog,
    updateLog,
    listByWorkflow,
    listByAgent,
  };
}
