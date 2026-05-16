/**
 * elevenLabsService.ts — ElevenLabs API integration.
 *
 * All public functions:
 *  - catch every error gracefully and return empty/void — never throw, never degrade UX.
 *  - never block the calling component on failure.
 *
 * Layered approach:
 *  1. ElevenLabs API (primary) — best quality
 *  2. Returns null/empty on any failure — callers handle fallback (OpenAI TTS / browser voice)
 */

import type { ElevenLabsVoice } from "../types/nicheVoice";

const BASE_URL = "https://api.elevenlabs.io/v1";
const DEFAULT_MODEL = "eleven_turbo_v2";
const DEFAULT_VOICE_SETTINGS = { stability: 0.5, similarity_boost: 0.75 };
const REQUEST_TIMEOUT_MS = 12_000;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function makeHeaders(apiKey: string): HeadersInit {
  return {
    "xi-api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "audio/mpeg",
  };
}

function makeSignal(): AbortSignal {
  return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
}

/** Encode ArrayBuffer as base64 string. */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary);
}

/** Decode base64 string to ArrayBuffer. */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * fetchVoices — list all voices available in this ElevenLabs account.
 * Returns empty array on any failure.
 */
export async function fetchVoices(apiKey: string): Promise<ElevenLabsVoice[]> {
  if (!apiKey?.trim()) return [];
  try {
    const res = await fetch(`${BASE_URL}/voices`, {
      method: "GET",
      headers: { "xi-api-key": apiKey, Accept: "application/json" },
      signal: makeSignal(),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { voices?: ElevenLabsVoice[] };
    return Array.isArray(data.voices) ? data.voices : [];
  } catch {
    return [];
  }
}

/**
 * generateAudio — convert text to audio using a specific voice.
 * Returns ArrayBuffer on success, null on any failure.
 */
export async function generateAudio(
  apiKey: string,
  voiceId: string,
  text: string,
): Promise<ArrayBuffer | null> {
  if (!apiKey?.trim() || !voiceId?.trim() || !text?.trim()) return null;
  try {
    const res = await fetch(
      `${BASE_URL}/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: "POST",
        headers: makeHeaders(apiKey),
        body: JSON.stringify({
          text,
          model_id: DEFAULT_MODEL,
          voice_settings: DEFAULT_VOICE_SETTINGS,
        }),
        signal: makeSignal(),
      },
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * previewVoice — generates "Hello, thank you for calling." with the given voice
 * and plays it immediately. No-op on any failure.
 */
export async function previewVoice(
  apiKey: string,
  voiceId: string,
): Promise<void> {
  const buffer = await generateAudio(
    apiKey,
    voiceId,
    "Hello, thank you for calling.",
  );
  if (!buffer) return;
  try {
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => URL.revokeObjectURL(url);
    audio.onerror = () => URL.revokeObjectURL(url);
    await audio.play();
  } catch {
    // no-op — UX continues without preview
  }
}

/**
 * generateNicheAudio — generate audio for multiple lines and return a map of
 * lineIndex -> base64 audio string.
 *
 * Lines that fail are simply omitted from the returned map (callers fall back
 * to OpenAI TTS or browser speech for missing entries).
 *
 * @param apiKey      ElevenLabs API key
 * @param voiceId     Voice ID to use for all lines
 * @param lines       Array of text strings (line order = lineIndex)
 * @returns           Map from lineIndex to base64 audio blob data
 */
export async function generateNicheAudio(
  apiKey: string,
  voiceId: string,
  lines: string[],
): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  if (!apiKey?.trim() || !voiceId?.trim() || lines.length === 0) return result;

  // Run all in parallel — each is independent
  await Promise.allSettled(
    lines.map(async (text, index) => {
      if (!text?.trim()) return;
      const buffer = await generateAudio(apiKey, voiceId, text);
      if (buffer) {
        result.set(index, arrayBufferToBase64(buffer));
      }
    }),
  );

  return result;
}
