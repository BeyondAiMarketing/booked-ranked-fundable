import { useCallback, useState } from "react";
import { useActor } from "./useActor";

// ── TypeScript types mirroring the Motoko Candid interface ───────────────────

export interface RoutingDecision {
  intentClass: string;
  target: string;
  taskType: string;
  confidence: number;
  reasoning: string;
}

export interface OmniResult {
  output: string;
  routingDecision: RoutingDecision;
  provider: string | null;
  model: string | null;
  estimatedCost: number;
  correlationId: string;
  durationNs: bigint;
  success: boolean;
  errorMessage: string | null;
}

export interface OmniRouterMetrics {
  totalRequests: bigint;
  successfulRequests: bigint;
  failedRequests: bigint;
  avgDurationNs: bigint;
  intentBreakdown: Array<[string, bigint]>;
  providerBreakdown: Array<[string, bigint]>;
}

export interface OmniRouteLogEntry {
  correlationId: string;
  tenantId: string;
  goalSummary: string;
  intentClass: string;
  target: string;
  provider: string | null;
  model: string | null;
  success: boolean;
  durationNs: bigint;
  timestampNs: bigint;
}

// ── Helpers for Candid optional types ───────────────────────────────────────

function fromCandidOpt<T>(opt: [] | [T]): T | null {
  return opt.length > 0 ? (opt[0] ?? null) : null;
}

function toCandidOpt<T>(val: T | undefined | null): [] | [T] {
  return val != null ? [val] : [];
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useOmniRouter() {
  const { actor } = useActor();

  const [result, setResult] = useState<OmniResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metrics, setMetrics] = useState<OmniRouterMetrics | null>(null);
  const [history, setHistory] = useState<OmniRouteLogEntry[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Submit a goal to omniRoute.
  const submitGoal = useCallback(
    async (
      goal: string,
      tenantId: string,
      contextHint?: string,
      maxBudget?: number,
    ): Promise<OmniResult | null> => {
      if (!actor) return null;
      setIsSubmitting(true);
      setError(null);
      try {
        const raw = await (actor as any).omniRoute({
          goal,
          tenantId,
          contextHint: toCandidOpt(contextHint),
          maxBudget: toCandidOpt(maxBudget),
        });
        const mapped: OmniResult = {
          output: raw.output,
          routingDecision: {
            intentClass: raw.routingDecision.intentClass,
            target: raw.routingDecision.target,
            taskType: raw.routingDecision.taskType,
            confidence: raw.routingDecision.confidence,
            reasoning: raw.routingDecision.reasoning,
          },
          provider: fromCandidOpt(raw.provider),
          model: fromCandidOpt(raw.model),
          estimatedCost: raw.estimatedCost,
          correlationId: raw.correlationId,
          durationNs: raw.durationNs,
          success: raw.success,
          errorMessage: fromCandidOpt(raw.errorMessage),
        };
        setResult(mapped);
        return mapped;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [actor],
  );

  // Fetch metrics from the backend.
  const fetchMetrics = useCallback(async () => {
    if (!actor) return;
    setMetricsLoading(true);
    try {
      const raw = await (actor as any).getOmniRouterMetrics();
      setMetrics({
        totalRequests: raw.totalRequests,
        successfulRequests: raw.successfulRequests,
        failedRequests: raw.failedRequests,
        avgDurationNs: raw.avgDurationNs,
        intentBreakdown: raw.intentBreakdown,
        providerBreakdown: raw.providerBreakdown,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setMetricsLoading(false);
    }
  }, [actor]);

  // Fetch routing history.
  const fetchHistory = useCallback(
    async (limit = 20) => {
      if (!actor) return;
      setHistoryLoading(true);
      try {
        const raw: any[] = await (actor as any).getOmniRoutingHistory(BigInt(limit));
        setHistory(
          raw.map((e) => ({
            correlationId: e.correlationId,
            tenantId: e.tenantId,
            goalSummary: e.goalSummary,
            intentClass: e.intentClass,
            target: e.target,
            provider: fromCandidOpt(e.provider),
            model: fromCandidOpt(e.model),
            success: e.success,
            durationNs: e.durationNs,
            timestampNs: e.timestampNs,
          })),
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        setHistoryLoading(false);
      }
    },
    [actor],
  );

  // Admin: reset metrics.
  const resetMetrics = useCallback(async () => {
    if (!actor) return;
    try {
      await (actor as any).resetOmniRouterMetrics();
      setMetrics(null);
      setHistory([]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  }, [actor]);

  return {
    result,
    isSubmitting,
    metrics,
    history,
    metricsLoading,
    historyLoading,
    error,
    submitGoal,
    fetchMetrics,
    fetchHistory,
    resetMetrics,
  };
}
