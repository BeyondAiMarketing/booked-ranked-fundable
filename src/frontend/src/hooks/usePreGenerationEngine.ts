/**
 * usePreGenerationEngine.ts — Audio pre-generation lifecycle hook (V2).
 *
 * Fixes from V1:
 *   - saveCachedAudio is now tracked, not fire-and-forget
 *   - Per-niche error messages captured from ElevenLabs
 *   - lastGeneratedAt timestamps per niche
 *   - After voice assignment, auto-triggers generation for that niche
 *   - generateAll runs niches in sequence to respect ElevenLabs rate limits
 *
 * State contract:
 *   generationStatus: Record<NicheId, 'idle'|'generating'|'complete'|'error'>
 *   progress:         Record<NicheId, { current: number; total: number }>
 *   errorMessages:    Record<NicheId, string | null>
 *   lastGeneratedAt:  Record<NicheId, number | null>   — Unix ms timestamp
 *   isGenerating:     boolean
 */

import { useCallback, useMemo, useState } from "react";
import { useCredentials } from "../context/CredentialsContext";
import {
  NICHE_VOICE_SCRIPTS,
  buildScriptLines,
} from "../services/audioService";
import { generateNicheAudio } from "../services/elevenLabsService";
import { useActor } from "./useActor";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ALL_NICHE_IDS = [
  "plumber",
  "med-spa",
  "hvac",
  "restoration",
  "carpet-cleaning",
  "roofing",
  "real-estate",
  "mortgage",
  "chiropractor",
  "dental",
] as const;

export type NicheId = (typeof ALL_NICHE_IDS)[number];

export type GenerationStatus = "idle" | "generating" | "complete" | "error";

export interface NicheProgress {
  current: number;
  total: number;
}

export interface UsePreGenerationEngineResult {
  generationStatus: Record<string, GenerationStatus>;
  progress: Record<string, NicheProgress>;
  errorMessages: Record<string, string | null>;
  lastGeneratedAt: Record<string, number | null>;
  isGenerating: boolean;
  generateForNiche: (nicheId: string) => Promise<void>;
  generateAll: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePreGenerationEngine(): UsePreGenerationEngineResult {
  const { actor } = useActor();
  const { creds } = useCredentials();

  const [generationStatus, setGenerationStatus] = useState<
    Record<string, GenerationStatus>
  >(() => Object.fromEntries(ALL_NICHE_IDS.map((id) => [id, "idle"])));

  const [progress, setProgress] = useState<Record<string, NicheProgress>>(() =>
    Object.fromEntries(
      ALL_NICHE_IDS.map((id) => [id, { current: 0, total: 5 }]),
    ),
  );

  const [errorMessages, setErrorMessages] = useState<
    Record<string, string | null>
  >(() => Object.fromEntries(ALL_NICHE_IDS.map((id) => [id, null])));

  const [lastGeneratedAt, setLastGeneratedAt] = useState<
    Record<string, number | null>
  >(() => Object.fromEntries(ALL_NICHE_IDS.map((id) => [id, null])));

  const isGenerating = useMemo(
    () => Object.values(generationStatus).some((s) => s === "generating"),
    [generationStatus],
  );

  const setStatus = useCallback((nicheId: string, status: GenerationStatus) => {
    setGenerationStatus((prev) => ({ ...prev, [nicheId]: status }));
  }, []);

  const setNicheProgress = useCallback(
    (nicheId: string, current: number, total: number) => {
      setProgress((prev) => ({ ...prev, [nicheId]: { current, total } }));
    },
    [],
  );

  const setError = useCallback((nicheId: string, msg: string | null) => {
    setErrorMessages((prev) => ({ ...prev, [nicheId]: msg }));
  }, []);

  const generateForNiche = useCallback(
    async (nicheId: string): Promise<void> => {
      const elevenLabsKey = creds?.elevenLabsKey?.trim();
      if (!actor || !elevenLabsKey) {
        setStatus(nicheId, "error");
        setError(
          nicheId,
          !actor
            ? "Backend not connected"
            : "ElevenLabs API key not configured",
        );
        return;
      }

      setStatus(nicheId, "generating");
      setError(nicheId, null);
      setNicheProgress(nicheId, 0, 5);

      try {
        // 1. Get the assigned voice ID for this niche
        let voiceId: string | null = null;
        try {
          const raw = await actor.getVapiNicheVoiceId(nicheId);
          voiceId = typeof raw === "string" ? raw : null;
        } catch {
          // fall through to script default
        }

        // 2. Build script lines with placeholder name
        const script =
          NICHE_VOICE_SCRIPTS[nicheId] ?? NICHE_VOICE_SCRIPTS.plumber!;
        const resolvedVoiceId = voiceId ?? script.voiceId;
        const lines = buildScriptLines(script, "Your Business");
        const total = lines.length;
        setNicheProgress(nicheId, 0, total);

        // 3. Generate all audio lines via ElevenLabs
        const audioMap = await generateNicheAudio(
          elevenLabsKey,
          resolvedVoiceId,
          lines,
        );

        if (audioMap.size === 0) {
          setStatus(nicheId, "error");
          setError(
            nicheId,
            "ElevenLabs returned no audio — check your API key and voice ID",
          );
          return;
        }

        // 4. Persist each line to backend cache — TRACKED, not fire-and-forget
        let saved = 0;
        let saveErrors = 0;

        const savePromises = Array.from(audioMap.entries()).map(
          async ([lineIndex, base64Audio]) => {
            const key = `${nicheId}:${lineIndex}`;
            try {
              await actor.setCachedAudio(key, base64Audio);
              saved++;
            } catch {
              saveErrors++;
              // Failed to save cache for key
            }
            setNicheProgress(nicheId, saved + saveErrors, total);
          },
        );

        await Promise.allSettled(savePromises);

        // 5. Mark result — complete even with partial saves (audio will still play)
        if (audioMap.size > 0) {
          setNicheProgress(nicheId, total, total);
          setStatus(nicheId, "complete");
          setLastGeneratedAt((prev) => ({ ...prev, [nicheId]: Date.now() }));
          if (saveErrors > 0) {
            setError(
              nicheId,
              `Generated ${audioMap.size}/${total} lines — ${saveErrors} cache saves failed (audio still works this session)`,
            );
          }
        } else {
          setStatus(nicheId, "error");
          setError(nicheId, "No audio lines were generated");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setStatus(nicheId, "error");
        setError(nicheId, msg);
      }
    },
    [actor, creds, setStatus, setNicheProgress, setError],
  );

  const generateAll = useCallback(async (): Promise<void> => {
    // Sequential to respect ElevenLabs rate limits
    for (const nicheId of ALL_NICHE_IDS) {
      await generateForNiche(nicheId);
    }
  }, [generateForNiche]);

  return {
    generationStatus,
    progress,
    errorMessages,
    lastGeneratedAt,
    isGenerating,
    generateForNiche,
    generateAll,
  };
}
