// useElevenLabsVoice — TTS hook using ElevenLabs API with Web Speech fallback
// API key is passed in via parameter (fetched from backend via CredentialsContext).
// Falls back gracefully to browser SpeechSynthesis when no key is available.
// Retry logic: 2 retries with exponential backoff (500ms, 1000ms), then fallback.
// Audio cache: blobs keyed by "niche::resolvedText" to avoid redundant API calls.
//
// Usage:
//   const { speak, stop, isPlaying, isLoading, usingElevenLabs } = useElevenLabsVoice(text, niche, businessName, apiKey)
//   - Replaces "[Business]" / "[BusinessName]" tokens with businessName before speaking
//   - Caches audio blobs per text to avoid re-fetching on re-render

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Voice ID mapping per niche ───────────────────────────────────────────────
// These IDs are authoritative. Do NOT use default voices — each niche has a
// distinct personality matched to the agent name and communication style.

export const ELEVENLABS_VOICE_IDS: Record<string, string> = {
  plumber: "EXAVITQu4vr4xnSDxMaL", // Bella — friendly female
  "med-spa": "cjVigY5qzO86Huf0OWal", // Sophia — warm female
  hvac: "MF3mGyEYCl7XYWbV9V6O", // Elli — energetic female
  restoration: "21m00Tcm4TlvDq8ikWAM", // Rachel — calm female
  "carpet-cleaning": "AZnzlk1XvdvUeBnXmlld", // Domi — confident female
  roofing: "XB0fDUnXU5powFXDhCwa", // Charlotte — warm female
  "real-estate": "pNInz6obpgDQGcFmaJgB", // Adam — neutral male
  mortgage: "oWAxZDx7w5VEj9dCyTzz", // Grace — professional female
  chiropractor: "LcfcDJNUP1GQjkzn1xUU", // Emily — reassuring female
  dental: "pFZP5JQG7iQjIQuC4Bku", // Lily — calm female
};

// Voice personality descriptions for display (used in VoiceAgentPreviewPage)
export const ELEVENLABS_VOICE_META: Record<
  string,
  { voiceName: string; personality: string; agentName: string }
> = {
  plumber: {
    voiceName: "Bella",
    personality: "Friendly, warm female voice",
    agentName: "Sarah",
  },
  roofing: {
    voiceName: "Charlotte",
    personality: "Confident, professional female voice",
    agentName: "Ashley",
  },
  hvac: {
    voiceName: "Elli",
    personality: "Energetic, helpful female voice",
    agentName: "Jessica",
  },
  "med-spa": {
    voiceName: "Sophia",
    personality: "Warm, soothing female voice",
    agentName: "Sophia",
  },
  "carpet-cleaning": {
    voiceName: "Domi",
    personality: "Warm, friendly female voice",
    agentName: "Amanda",
  },
  restoration: {
    voiceName: "Rachel",
    personality: "Calm, professional female voice",
    agentName: "Lauren",
  },
  "real-estate": {
    voiceName: "Adam",
    personality: "Approachable, knowledgeable male voice",
    agentName: "Emily",
  },
  mortgage: {
    voiceName: "Grace",
    personality: "Professional, trustworthy female voice",
    agentName: "Rachel",
  },
  chiropractor: {
    voiceName: "Emily",
    personality: "Reassuring, gentle female voice",
    agentName: "Front Desk",
  },
  dental: {
    voiceName: "Lily",
    personality: "Calm, reassuring female voice",
    agentName: "Front Desk",
  },
};

/** Returns the ElevenLabs voice ID for a given niche slug. */
export function getElevenLabsVoiceId(niche: string): string {
  return (
    ELEVENLABS_VOICE_IDS[niche.toLowerCase()] ?? "21m00Tcm4TlvDq8ikWAM" // Rachel as default
  );
}

/**
 * Returns true if the given API key string is a non-empty ElevenLabs key.
 * Use the CredentialsContext to get the key from the backend.
 */
export function isElevenLabsKeyReady(
  apiKey: string | undefined | null,
): boolean {
  return !!apiKey?.trim();
}

/**
 * Legacy check — reads from sessionStorage (set by CredentialsContext on load).
 * @deprecated Use useCredentials() from CredentialsContext instead.
 */
export function isElevenLabsConfigured(): boolean {
  if (typeof window === "undefined") return false;
  const sessionKey = sessionStorage.getItem("brf_el_ready");
  if (sessionKey !== null) return sessionKey === "1";
  return false;
}

// ─── Token replacement ────────────────────────────────────────────────────────

function applyTokens(text: string, businessName: string): string {
  return text
    .replace(/\[Business\]/gi, businessName)
    .replace(/\[BusinessName\]/gi, businessName);
}

// ─── ElevenLabs TTS fetch with retry ─────────────────────────────────────────

async function fetchElevenLabsAudio(
  text: string,
  voiceId: string,
  apiKey: string,
  retryCount = 0,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      },
    );

    clearTimeout(timeoutId);

    if (res.status === 401) {
      // Invalid key — signal this specially so callers can surface it
      throw new Error("ELEVENLABS_INVALID_KEY");
    }

    if (!res.ok) {
      throw new Error(`ElevenLabs API error: ${res.status}`);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    clearTimeout(timeoutId);

    // Don't retry on invalid key or timeout
    const errMsg = err instanceof Error ? err.message : String(err);
    const isAbort = errMsg.includes("abort") || errMsg.includes("timeout");
    if (errMsg === "ELEVENLABS_INVALID_KEY" || isAbort) {
      throw err;
    }

    // Retry up to 2 times with exponential backoff
    if (retryCount < 2) {
      const delay = retryCount === 0 ? 500 : 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchElevenLabsAudio(text, voiceId, apiKey, retryCount + 1);
    }

    throw err;
  }
}

// ─── Web Speech fallback helper (plain function, not a hook) ──────────────────

// speakWithWebSpeech REMOVED — no robotic TTS fallback, transcript-only mode used instead.
// Stub retained only to avoid import errors in files that may reference it.
// speakWithWebSpeech removed — no robotic TTS, transcript-only mode used instead.

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseElevenLabsVoiceResult {
  speak: () => void;
  stop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  /** true when ElevenLabs key is present and will be used (alias for isUsingElevenLabs) */
  usingElevenLabs: boolean;
  /** true when ElevenLabs key is present and will be used */
  isUsingElevenLabs: boolean;
}

/**
 * Primary hook for demo voice synthesis.
 * @param text         Raw text with optional "[Business]" / "[BusinessName]" token
 * @param niche        Niche slug (e.g. "plumbing", "hvac")
 * @param businessName Replaces "[Business]" token before synthesis
 * @param apiKey       ElevenLabs API key from CredentialsContext (optional — falls back to Web Speech)
 */
export function useElevenLabsVoice(
  text: string,
  niche: string,
  businessName: string,
  apiKey?: string,
): UseElevenLabsVoiceResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cache resolved object URLs keyed by "niche::resolvedText"
  const audioCacheRef = useRef<Record<string, string>>({});
  // Currently playing HTML audio element
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const resolvedText = applyTokens(text, businessName);
  const isUsingElevenLabs = isElevenLabsKeyReady(apiKey);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioElRef.current?.pause();
      audioElRef.current = null;
      // SpeechSynthesis intentionally NOT cancelled — never used
    };
  }, []);

  const stop = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
      audioElRef.current = null;
    }
    // SpeechSynthesis intentionally NOT used — never cancel it here
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const speak = useCallback(() => {
    if (isPlaying || isLoading) return;

    if (isUsingElevenLabs && apiKey) {
      // ── ElevenLabs path ──────────────────────────────────────────────────
      const voiceId = getElevenLabsVoiceId(niche);
      const cacheKey = `${niche}::${resolvedText}`;

      const playFromUrl = (url: string) => {
        const audio = new Audio(url);
        audioElRef.current = audio;

        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          audioElRef.current = null;
        };
        // On error: no audio, no robotic fallback — just mark not playing
        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          audioElRef.current = null;
          // Audio playback failed — transcript-only mode
        };

        audio.play().catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
          // audio.play() rejected — transcript-only mode
        });
      };

      // Serve from cache if available
      const cached = audioCacheRef.current[cacheKey];
      if (cached) {
        playFromUrl(cached);
        return;
      }

      // Fetch fresh audio from ElevenLabs
      setIsLoading(true);
      fetchElevenLabsAudio(resolvedText, voiceId, apiKey)
        .then((url) => {
          audioCacheRef.current[cacheKey] = url;
          setIsLoading(false);
          playFromUrl(url);
        })
        .catch((err) => {
          setIsLoading(false);
          const _msg = err instanceof Error ? err.message : String(err);
          // ElevenLabs fetch failed — transcript-only mode
          // (invalid key or other error)
          // NO speakWithWebSpeech fallback — transcript only
        });
    }
    // No ElevenLabs key: transcript-only mode, no robotic TTS
  }, [isPlaying, isLoading, isUsingElevenLabs, apiKey, niche, resolvedText]);

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
    usingElevenLabs: isUsingElevenLabs,
    isUsingElevenLabs,
  };
}
