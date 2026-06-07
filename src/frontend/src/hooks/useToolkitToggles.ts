import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = any;
import type { ToolkitToggle } from "@/backend";

export interface ToolkitToggleState {
  toolkitName: string;
  tierId: string;
  enabled: boolean;
}

export function useToolkitToggles() {
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

  const getToolkitToggleState = useCallback(
    async (tierId: string): Promise<ToolkitToggleState[]> => {
      if (!actor) return [];
      const result = await withLoading(async () => {
        const res = await actor.getToolkitToggles(tierId);
        if (res && Array.isArray(res.ok)) {
          return res.ok.map((t: ToolkitToggle) => ({
            toolkitName: t.toolkitName,
            tierId: t.tierId,
            enabled: t.enabled,
          }));
        }
        return [];
      });
      return result ?? [];
    },
    [actor, withLoading],
  );

  const saveToolkitToggle = useCallback(
    async (toolkitName: string, tierId: string, enabled: boolean) => {
      if (!actor) return null;
      return withLoading(async () => {
        const toggle: ToolkitToggle = {
          toolkitName,
          tierId,
          enabled,
          appliedAt: BigInt(Date.now()) * BigInt(1_000_000),
        };
        const res = await actor.setToolkitToggle(toggle);
        return res;
      });
    },
    [actor, withLoading],
  );

  const bulkToggleToolkits = useCallback(
    async (toolkitNames: string[], tierId: string, enabled: boolean) => {
      if (!actor) return null;
      return withLoading(async () => {
        const req = {
          toolkitNames,
          tierId,
          enabled,
        };
        const res = await actor.bulkApplyToggleToTier(req);
        return res;
      });
    },
    [actor, withLoading],
  );

  return {
    isLoading,
    error,
    isReady: !!actor && !isFetching,
    getToolkitToggleState,
    saveToolkitToggle,
    bulkToggleToolkits,
  };
}
