/**
 * useNicheVoiceAssignments.ts — React hook for managing per-niche ElevenLabs voice assignments.
 *
 * Fetches NicheVoiceAssignment records from the Motoko backend on mount.
 * Provides setAssignment() to persist new voice selections to stable storage.
 *
 * V2 changes:
 *  - setAssignment now returns a success boolean so callers can show confirmation
 *  - setAssignmentError tracks the last error per niche for UI feedback
 *  - optimistic local update so the UI reflects the change immediately
 */

import { useCallback, useEffect, useState } from "react";
import type { NicheVoiceAssignment } from "../types/nicheVoice";
import { useActor } from "./useActor";

interface UseNicheVoiceAssignmentsResult {
  /** All persisted voice assignments (one entry per niche that has been assigned) */
  assignments: NicheVoiceAssignment[];
  loading: boolean;
  /** Last assignment error per niche — cleared on the next successful setAssignment */
  assignmentErrors: Record<string, string | null>;
  /**
   * Persist a new voice assignment for a niche.
   * Optimistic: updates local state immediately, confirms from backend.
   * Returns true on success, false on failure.
   */
  setAssignment: (
    nicheId: string,
    voiceId: string,
    voiceName: string,
  ) => Promise<boolean>;
  /** getAssignedVoiceId — returns the persisted voice ID for the given niche */
  getAssignedVoiceId: (nicheId: string) => string | undefined;
  /** getAssignedVoiceName — returns the human-readable name for the assigned voice */
  getAssignedVoiceName: (nicheId: string) => string | undefined;
}

export function useNicheVoiceAssignments(): UseNicheVoiceAssignmentsResult {
  const { actor, isFetching } = useActor();
  const [assignments, setAssignments] = useState<NicheVoiceAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignmentErrors, setAssignmentErrors] = useState<
    Record<string, string | null>
  >({});

  const fetchAssignments = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getNicheVoiceAssignments();
      setAssignments(Array.isArray(result) ? result : []);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (isFetching || !actor) return;
    void fetchAssignments();
  }, [actor, isFetching, fetchAssignments]);

  const setAssignment = useCallback(
    async (
      nicheId: string,
      voiceId: string,
      voiceName: string,
    ): Promise<boolean> => {
      if (!actor) return false;

      // Optimistic update
      const now = BigInt(Date.now());
      setAssignments((prev) => {
        const filtered = prev.filter((a) => a.nicheId !== nicheId);
        return [...filtered, { nicheId, voiceId, voiceName, assignedAt: now }];
      });
      // Clear any previous error for this niche
      setAssignmentErrors((prev) => ({ ...prev, [nicheId]: null }));

      try {
        await actor.setNicheVoiceAssignment(nicheId, voiceId, voiceName);
        // Re-fetch to confirm backend state matches
        await fetchAssignments();
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Save failed";
        setAssignmentErrors((prev) => ({ ...prev, [nicheId]: msg }));
        // Rollback optimistic update
        await fetchAssignments();
        return false;
      }
    },
    [actor, fetchAssignments],
  );

  const getAssignedVoiceId = useCallback(
    (nicheId: string): string | undefined => {
      return assignments.find((a) => a.nicheId === nicheId)?.voiceId;
    },
    [assignments],
  );

  const getAssignedVoiceName = useCallback(
    (nicheId: string): string | undefined => {
      return assignments.find((a) => a.nicheId === nicheId)?.voiceName;
    },
    [assignments],
  );

  return {
    assignments,
    loading,
    assignmentErrors,
    setAssignment,
    getAssignedVoiceId,
    getAssignedVoiceName,
  };
}
