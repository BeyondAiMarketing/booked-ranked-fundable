import { useCallback, useEffect, useState } from "react";
import type { MonthlyReport, PerformanceInsight } from "../types/socialContent";
import { useActor } from "./useActor";

export function usePerformanceReview() {
  const { actor } = useActor();
  const [insights, setInsights] = useState<PerformanceInsight[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listInsights = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listPerformanceInsights();
      setInsights(result as PerformanceInsight[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  const listReports = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listMonthlyReports();
      setReports(result as MonthlyReport[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    listInsights();
    listReports();
  }, [listInsights, listReports]);

  const createInsight = useCallback(
    async (data: Omit<PerformanceInsight, "id" | "createdAt">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createPerformanceInsight(data);
        setInsights((prev) => [result as PerformanceInsight, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const updateInsight = useCallback(
    async (id: string, updates: Partial<PerformanceInsight>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updatePerformanceInsight(id, updates);
        setInsights((prev) =>
          prev.map((i) => (i.id === id ? (result as PerformanceInsight) : i)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const createReport = useCallback(
    async (data: Omit<MonthlyReport, "id" | "createdAt" | "updatedAt">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createMonthlyReport(data);
        setReports((prev) => [result as MonthlyReport, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const updateReport = useCallback(
    async (id: string, updates: Partial<MonthlyReport>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateMonthlyReport(id, updates);
        setReports((prev) =>
          prev.map((r) => (r.id === id ? (result as MonthlyReport) : r)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  return {
    insights,
    reports,
    loading,
    error,
    createInsight,
    updateInsight,
    createReport,
    updateReport,
    listInsights,
    listReports,
  };
}
