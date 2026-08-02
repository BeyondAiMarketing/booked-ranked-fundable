import { useCallback, useEffect, useState } from "react";
import type { WorkflowLogEntry, WorkflowStatus } from "../backend";
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
        const entry: WorkflowLogEntry = {
          id: crypto.randomUUID(),
          workflowId: data.workflowId,
          tenantId: data.agentId,
          agentType: data.agentName,
          action: data.action,
          status: data.status as WorkflowStatus,
          notes: data.details,
          stepIndex: BigInt(0),
          createdAt: BigInt(Date.now()),
        };
        const result = await actor.logWorkflowEntry(entry);
        if ("ok" in result) {
          setLogs((prev) => [{ ...data, id: entry.id, createdAt: data.timestamp } as WorkflowLog, ...prev]);
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

  const updateLog = useCallback(
    async (id: string, updates: Partial<WorkflowLog>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const entry: WorkflowLogEntry = {
          id,
          workflowId: updates.workflowId ?? "",
          tenantId: updates.agentId ?? "",
          agentType: updates.agentName ?? "",
          action: updates.action ?? "",
          status: (updates.status ?? "pending") as WorkflowStatus,
          notes: updates.details ?? "",
          stepIndex: BigInt(0),
          createdAt: BigInt(Date.now()),
        };
        const result = await actor.logWorkflowEntry(entry);
        if ("ok" in result) {
          setLogs((prev) =>
            prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
          );
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
    async (tenantId: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.getWorkflowLogsByTenant(tenantId);
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
