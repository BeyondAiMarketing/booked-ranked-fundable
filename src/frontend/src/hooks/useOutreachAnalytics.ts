// Outreach Analytics hooks — React Query wrappers with demo-data fallback

import {
  demoBounceRecords,
  demoOutreachOverview,
  demoQueueStats,
  demoThrottleConfigs,
} from "@/data/outreachAnalyticsData";
import type {
  OutreachBounceRecord,
  OutreachOverview,
  QueuePerformanceStat,
  QueueThrottleConfig,
} from "@/types/newsletter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Overview ──────────────────────────────────────────────────────────────────

export function useOutreachOverview(_tenantId: string) {
  return useQuery<OutreachOverview>({
    queryKey: ["outreach-overview", _tenantId],
    queryFn: async () => {
      // When actor: actor.getOutreachOverview(_tenantId)
      return demoOutreachOverview;
    },
    staleTime: 60_000,
  });
}

// ── Queue performance stats ───────────────────────────────────────────────────

export function useQueueStats(_tenantId: string) {
  return useQuery<QueuePerformanceStat[]>({
    queryKey: ["outreach-queue-stats", _tenantId],
    queryFn: async () => {
      // When actor: actor.getQueuePerformanceStats(_tenantId)
      return demoQueueStats;
    },
    staleTime: 30_000,
  });
}

// ── Bounce records per queue ──────────────────────────────────────────────────

export function useBounceRecords(queueId: string) {
  return useQuery<OutreachBounceRecord[]>({
    queryKey: ["outreach-bounces", queueId],
    queryFn: async () => {
      if (!queueId) return [];
      // When actor: actor.getBounceRecords(queueId)
      return demoBounceRecords.filter((b) => b.queueId === queueId);
    },
    enabled: !!queueId,
    staleTime: 30_000,
  });
}

// ── All bounce records (admin overview) ───────────────────────────────────────

export function useAllBounceRecords(_tenantId: string) {
  return useQuery<OutreachBounceRecord[]>({
    queryKey: ["outreach-bounces-all", _tenantId],
    queryFn: async () => {
      // When actor: actor.getAllBounceRecords(_tenantId)
      return demoBounceRecords;
    },
    staleTime: 30_000,
  });
}

// ── Throttle config ───────────────────────────────────────────────────────────

export function useThrottleConfig(queueId: string) {
  return useQuery<QueueThrottleConfig>({
    queryKey: ["outreach-throttle", queueId],
    queryFn: async () => {
      if (!queueId) {
        return {
          dailyCap: 100,
          intervalSeconds: 90,
          staggerEnabled: true,
          backoffMultiplier: 1.5,
        };
      }
      // When actor: actor.getThrottleConfig(queueId)
      return (
        demoThrottleConfigs[queueId] ?? {
          dailyCap: 100,
          intervalSeconds: 90,
          staggerEnabled: true,
          backoffMultiplier: 1.5,
        }
      );
    },
    enabled: !!queueId,
  });
}

export function useSetThrottleConfig() {
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { queueId: string; config: QueueThrottleConfig }
  >({
    mutationFn: async ({ queueId, config }) => {
      // When actor: actor.setThrottleConfig(queueId, config)
      // Optimistically update demo store
      demoThrottleConfigs[queueId] = config;
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["outreach-throttle", vars.queueId],
      });
      void qc.invalidateQueries({ queryKey: ["outreach-queue-stats"] });
    },
  });
}

// ── Pause / resume queue ──────────────────────────────────────────────────────

export function usePauseQueue() {
  const qc = useQueryClient();
  return useMutation<void, Error, { queueId: string; tenantId: string }>({
    mutationFn: async (_vars) => {
      await new Promise((r) => setTimeout(r, 300));
      // actor?.pauseOutreachQueue(queueId)
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["outreach-queue-stats", vars.tenantId],
      });
    },
  });
}

export function useResumeQueue() {
  const qc = useQueryClient();
  return useMutation<void, Error, { queueId: string; tenantId: string }>({
    mutationFn: async (_vars) => {
      await new Promise((r) => setTimeout(r, 300));
      // actor?.resumeOutreachQueue(queueId)
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["outreach-queue-stats", vars.tenantId],
      });
    },
  });
}
