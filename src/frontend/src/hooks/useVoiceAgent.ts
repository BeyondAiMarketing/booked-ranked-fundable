// useVoiceAgent — shared hook for Web Speech API with best-voice selection
// Works natively in browser with no credentials required.
// Picks highest-quality available voice: Google/Microsoft network voices first,
// then Samantha (Mac), then any en-US, then any English.

import { useCallback, useEffect, useRef, useState } from "react";

// ─── ElevenLabs helpers (re-exported from useVoiceAgent for convenience) ───────
// Avoids circular imports — useElevenLabsVoice imports from here, so we keep
// these helpers as standalone functions rather than importing back.

/** Map of niche slug → ElevenLabs voice ID. */
export const ELEVENLABS_VOICE_ID_MAP: Record<string, string> = {
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

/**
 * Returns the ElevenLabs voice ID for a given niche slug.
 * Falls back to Rachel (21m00Tcm4TlvDq8ikWAM) for unknown niches.
 */
export function getElevenLabsVoiceId(niche: string): string {
  return ELEVENLABS_VOICE_ID_MAP[niche.toLowerCase()] ?? "21m00Tcm4TlvDq8ikWAM";
}

/**
 * Returns true if an ElevenLabs API key is present.
 * @deprecated Use useCredentials() from CredentialsContext instead of relying on localStorage.
 * This function always returns false now — components must pass the key via props/context.
 */
export function isElevenLabsConfigured(): boolean {
  return false;
}

// ─── Niche greeting texts ─────────────────────────────────────────────────────

const NICHE_GREETINGS: Record<string, (businessName: string) => string> = {
  plumber: (n) =>
    `Hello, thanks for calling ${n}! This is your AI receptionist. Are you calling about an emergency repair or a scheduled service?`,
  roofing: (n) =>
    `Hi, thanks for calling ${n}! I'm your AI receptionist. Are you calling about storm damage, a repair, or a new roof estimate?`,
  hvac: (n) =>
    `Hello, you've reached ${n}! This is your AI front desk. Are you having heating or cooling issues, or would you like to schedule maintenance?`,
  "med-spa": (n) =>
    `Hello, welcome to ${n}! This is your AI coordinator. Are you interested in booking a consultation or learning about our services?`,
  "carpet-cleaning": (n) =>
    `Hi, thank you for calling ${n}! I'm your AI assistant. Are you looking to schedule a cleaning or get a free quote?`,
  restoration: (n) =>
    `Hello, this is ${n}! This is your 24/7 AI emergency line. Are you dealing with water damage, fire damage, or mold?`,
  "real-estate": (n) =>
    `Hello, thanks for reaching out to ${n}! This is your AI client coordinator. Are you looking to buy, sell, or just exploring the market?`,
  mortgage: (n) =>
    `Hi, you've reached ${n}! This is your AI loan specialist assistant. Are you looking to purchase a home or refinance an existing loan?`,
  chiropractor: (n) =>
    `Hello, welcome to ${n}! This is your AI receptionist. Are you an existing patient or would you like to schedule a new patient consultation?`,
  dental: (n) =>
    `Hi, thank you for calling ${n}! This is your AI front desk. Are you an existing patient, or would you like to schedule a new patient appointment?`,
};

export function getNicheGreeting(niche: string, businessName: string): string {
  const fn = NICHE_GREETINGS[niche];
  if (fn) return fn(businessName);
  // fallback generic
  return `Hello, you've reached ${businessName}. How can I help you today?`;
}

// ─── Best voice selection ─────────────────────────────────────────────────────

export function pickBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const enVoices = voices.filter((v) => v.lang.startsWith("en"));

  // Priority 1: non-local (network) Google UK English Female
  const googleUK = enVoices.find(
    (v) => !v.localService && v.name.includes("Google UK English Female"),
  );
  if (googleUK) return googleUK;

  // Priority 2: non-local Google US English
  const googleUS = enVoices.find(
    (v) =>
      !v.localService &&
      v.lang === "en-US" &&
      v.name.includes("Google US English"),
  );
  if (googleUS) return googleUS;

  // Priority 3: any non-local Google/Microsoft en-US voice
  const networkPremium = enVoices.find(
    (v) =>
      !v.localService &&
      v.lang === "en-US" &&
      (v.name.includes("Google") || v.name.includes("Microsoft")),
  );
  if (networkPremium) return networkPremium;

  // Priority 4: any non-local en-US voice
  const networkEnUS = enVoices.find(
    (v) => !v.localService && v.lang === "en-US",
  );
  if (networkEnUS) return networkEnUS;

  // Priority 5: Samantha (macOS high quality)
  const samantha = enVoices.find((v) => v.name.includes("Samantha"));
  if (samantha) return samantha;

  // Priority 6: any en-US voice
  const anyEnUS = enVoices.find((v) => v.lang === "en-US");
  if (anyEnUS) return anyEnUS;

  // Priority 7: any English voice
  return enVoices[0] ?? null;
}

// ─── Wait for voices to be ready ─────────────────────────────────────────────
// Returns a promise that resolves once getVoices() has entries.
// Resolves immediately if voices are already loaded (Firefox / Safari).

export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        window.speechSynthesis.removeEventListener("voiceschanged", handler);
        resolve(v);
      }
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Safety fallback — resolve after 2s even if voices never fire
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    }, 2000);
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseVoiceAgentOptions {
  text: string;
  autoPlayDelayMs?: number;
}

export interface UseVoiceAgentResult {
  isSpeaking: boolean;
  hasSpoken: boolean;
  supported: boolean;
  speak: () => void;
  cancel: () => void;
}

export function useVoiceAgent({
  text,
  autoPlayDelayMs,
}: UseVoiceAgentOptions): UseVoiceAgentResult {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [supported] = useState(() => "speechSynthesis" in window);
  const autoPlayedRef = useRef(false);
  // Track voices loaded
  const [voicesReady, setVoicesReady] = useState(false);

  // Load voices — they load async in Chrome
  useEffect(() => {
    if (!supported) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setVoicesReady(true);
      return;
    }
    const handler = () => setVoicesReady(true);
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
    };
  }, [supported]);

  const speak = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 1.0;

    const voice = pickBestVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setHasSpoken(true);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setHasSpoken(true);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  // Auto-play once when voices are ready (if delay specified)
  useEffect(() => {
    if (
      autoPlayDelayMs === undefined ||
      !supported ||
      !voicesReady ||
      autoPlayedRef.current
    )
      return;
    autoPlayedRef.current = true;
    const t = setTimeout(speak, autoPlayDelayMs);
    return () => {
      clearTimeout(t);
      window.speechSynthesis.cancel();
    };
  }, [autoPlayDelayMs, supported, voicesReady, speak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { isSpeaking, hasSpoken, supported, speak, cancel };
}

// ─── Multi-utterance sequential speaker ──────────────────────────────────────
// Used in ServicesDemoPage to speak AI lines one by one

export interface MultiSpeakOptions {
  lines: string[];
  pauseBetweenMs?: number;
  onLineStart?: (index: number) => void;
  onLineEnd?: (index: number) => void;
  onAllDone?: () => void;
}

export function speakLines({
  lines,
  pauseBetweenMs = 300,
  onLineStart,
  onLineEnd,
  onAllDone,
}: MultiSpeakOptions): () => void {
  if (!("speechSynthesis" in window) || lines.length === 0) {
    onAllDone?.();
    return () => {};
  }

  window.speechSynthesis.cancel();
  let cancelled = false;

  function doSpeak(voice: SpeechSynthesisVoice | null) {
    function speakNext(index: number) {
      if (cancelled || index >= lines.length) {
        if (!cancelled) onAllDone?.();
        return;
      }

      const line = lines[index];
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        if (!cancelled) onLineStart?.(index);
      };
      utterance.onend = () => {
        if (cancelled) return;
        onLineEnd?.(index);
        // Pause then speak next
        setTimeout(() => speakNext(index + 1), pauseBetweenMs);
      };
      utterance.onerror = () => {
        if (cancelled) return;
        onLineEnd?.(index);
        setTimeout(() => speakNext(index + 1), pauseBetweenMs);
      };

      window.speechSynthesis.speak(utterance);
    }

    speakNext(0);
  }

  // Wait for voices before starting — critical fix for Chrome
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    doSpeak(pickBestVoice());
  } else {
    // Voices not yet loaded — wait then speak
    const handler = () => {
      if (cancelled) return;
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      doSpeak(pickBestVoice());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // Timeout fallback — speak without preferred voice after 2s
    setTimeout(() => {
      if (cancelled) return;
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      doSpeak(null);
    }, 2000);
  }

  return () => {
    cancelled = true;
    window.speechSynthesis.cancel();
  };
}
