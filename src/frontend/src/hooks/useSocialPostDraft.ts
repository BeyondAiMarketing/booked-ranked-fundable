import { useCallback, useEffect, useState } from "react";
import type { Platform, SocialPostDraft } from "../types/socialContent";
import { useActor } from "./useActor";

export function useSocialPostDraft() {
  const { actor } = useActor();
  const [drafts, setDrafts] = useState<SocialPostDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listDrafts = useCallback(
    async (platform?: Platform) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.listSocialPostDrafts();
        const all = result as SocialPostDraft[];
        setDrafts(platform ? all.filter((d) => d.platform === platform) : all);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  useEffect(() => {
    listDrafts();
  }, [listDrafts]);

  const createDraft = useCallback(
    async (data: Omit<SocialPostDraft, "id" | "createdAt" | "updatedAt">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createSocialPostDraft(data);
        setDrafts((prev) => [result as SocialPostDraft, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const updateDraft = useCallback(
    async (id: string, updates: Partial<SocialPostDraft>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateSocialPostDraft(id, updates);
        setDrafts((prev) =>
          prev.map((d) => (d.id === id ? (result as SocialPostDraft) : d)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const deleteDraft = useCallback(
    async (id: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        await actor.deleteSocialPostDraft(id);
        setDrafts((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const submitForApproval = useCallback(
    async (id: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.submitDraftForApproval(id);
        setDrafts((prev) =>
          prev.map((d) => (d.id === id ? (result as SocialPostDraft) : d)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor],
  );

  const updateApprovalStatus = useCallback(
    async (id: string, status: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateDraftApprovalStatus(id, status);
        setDrafts((prev) =>
          prev.map((d) => (d.id === id ? (result as SocialPostDraft) : d)),
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
    drafts,
    loading,
    error,
    createDraft,
    updateDraft,
    deleteDraft,
    submitForApproval,
    updateApprovalStatus,
    listDrafts,
  };
}
