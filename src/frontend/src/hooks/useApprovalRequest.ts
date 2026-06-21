import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  agentId: string;
  itemType: string;
  itemId: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  requestedAt: number;
  resolvedBy?: string;
  resolvedAt?: number;
  notes?: string;
}

export function useApprovalRequest() {
  const { actor } = useActor();
  const [pending, setPending] = useState<ApprovalRequest[]>([]);
  const [history, setHistory] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listPending = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listPendingApprovals();
      setPending(result as ApprovalRequest[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  const listHistory = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listApprovalHistory();
      setHistory(result as ApprovalRequest[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    listPending();
    listHistory();
  }, [listPending, listHistory]);

  const createRequest = useCallback(
    async (data: Omit<ApprovalRequest, "id" | "requestedAt">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createApprovalItem(data);
        setPending((prev) => [result as ApprovalRequest, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const resolveRequest = useCallback(
    async (id: string, status: "approved" | "rejected", notes?: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.resolveApprovalItem(id, status, notes);
        const resolved = result as ApprovalRequest;
        setPending((prev) => prev.filter((r) => r.id !== id));
        setHistory((prev) => [resolved, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  return {
    pending,
    history,
    loading,
    error,
    createRequest,
    resolveRequest,
    listPending,
    listHistory,
  };
}
