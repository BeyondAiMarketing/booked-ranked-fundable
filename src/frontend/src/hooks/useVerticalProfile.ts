import { useCallback, useEffect, useState } from "react";
import type { VerticalProfile } from "../types/socialContent";
import { useActor } from "./useActor";

export function useVerticalProfile() {
  const { actor } = useActor();
  const [profile, setProfile] = useState<VerticalProfile | null>(null);
  const [profiles, setProfiles] = useState<VerticalProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listProfiles = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.listVerticalProfiles();
      setProfiles(result as VerticalProfile[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    listProfiles();
  }, [listProfiles]);

  const createProfile = useCallback(
    async (data: Omit<VerticalProfile, "id" | "createdAt" | "updatedAt">) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.createVerticalProfile(data);
        setProfile(result as VerticalProfile);
        await listProfiles();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listProfiles],
  );

  const updateProfile = useCallback(
    async (id: string, updates: Partial<VerticalProfile>) => {
      if (!actor) return;
      setLoading(true);
      try {
        const result = await actor.updateVerticalProfile(id, updates);
        setProfile(result as VerticalProfile);
        await listProfiles();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listProfiles],
  );

  const deleteProfile = useCallback(
    async (id: string) => {
      if (!actor) return;
      setLoading(true);
      try {
        await actor.deleteVerticalProfile(id);
        setProfile(null);
        await listProfiles();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [actor, listProfiles],
  );

  return {
    profile,
    profiles,
    loading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    listProfiles,
  };
}
