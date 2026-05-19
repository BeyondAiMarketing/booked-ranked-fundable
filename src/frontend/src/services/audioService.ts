/**
 * audioService.ts — V129 ROBOTIC VOICE REMOVAL
 *
 * TWO-LAYER AUDIO (SpeechSynthesis permanently removed):
 *   Layer 1: ElevenLabs (best quality, pre-decoded via AudioContext)
 *   Layer 2: OpenAI TTS (fallback, pre-decoded via AudioContext)
 *   Fallback: Transcript-only display — no audio, no robotic voices EVER
 *
 * MOBILE-FIRST GOLDEN RULES:
 *   1. AudioContext must be created AND resumed SYNCHRONOUSLY in the first
 *      user gesture handler (form submit in Step 0). Use unlockAudioContext()
 *      — it runs synchronously, does NOT await anything.
 *   2. playPreloadedAudio() / playPreloadedAudioWithText() are SYNCHRONOUS.
 *      They call AudioBufferSourceNode.start(0) with ZERO async.
 *   3. preloadNicheScripts() runs in the BACKGROUND after unlockAudioContext().
 *      By Step 2, audio is ready in the buffer map.
 *   4. If no premium audio: _audioFallbackMode=true, transcript shown instead.
 *      NEVER call SpeechSynthesis, SpeechSynthesisUtterance, or window.speechSynthesis.
 *
 * USAGE PATTERN:
 *   Step 0 submit: unlockAudioContext() → preloadNicheScripts() (background)
 *   Step 1 mount:  preloadNicheScripts() again (idempotent, belt+suspenders)
 *   Step 2 answer: playPreloadedAudioWithText(0) as FIRST SYNCHRONOUS CALL
 *                  Then startAudioSequence() to chain remaining lines.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NicheVoiceScript {
  niche: string;
  voiceName: string;
  voiceId: string;
  callerName: string;
  callerQuestion: string;
  agentGreeting: string;
  agentResponse: string;
  agentBookingConfirm: string;
  agentFarewell: string;
}

export interface ScriptCredentials {
  elevenLabsKey?: string;
  openaiKey?: string;
}

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------

let _audioCtx: AudioContext | null = null;
let _audioCtxUnlocked = false;

// Map: nicheId -> AudioBuffer[] (one per script line, in order)
// undefined = not loaded yet, null = load failed (transcript-only fallback)
const _preloadedBuffers = new Map<string, Array<AudioBuffer | null>>();

// Track current playing source so we can stop it cleanly
let _currentSource: AudioBufferSourceNode | null = null;

// Legacy HTML audio element (for backwards compat)
const _audioEl: HTMLAudioElement =
  typeof window !== "undefined" ? new Audio() : ({} as HTMLAudioElement);

// Blob cache for legacy path
const _blobCache = new Map<string, string>();

// audioFallbackMode — set when no premium audio buffers are available.
// When true, transcript-only mode is shown. No SpeechSynthesis ever.
let _audioFallbackMode = false;

export function isAudioFallbackMode(): boolean {
  return _audioFallbackMode;
}

export function resetAudioFallbackMode(): void {
  _audioFallbackMode = false;
}

// Backend actor ref
let _backendActor: {
  getCachedAudio: (key: string) => Promise<string | null>;
  setCachedAudio: (key: string, base64Audio: string) => Promise<void>;
} | null = null;

// ---------------------------------------------------------------------------
// Backend actor integration
// ---------------------------------------------------------------------------

export function setBackendActor(actor: typeof _backendActor): void {
  _backendActor = actor;
}

export function getCacheKey(nicheId: string, lineIndex: number): string {
  return `${nicheId}:${lineIndex}`;
}

// ---------------------------------------------------------------------------
// AudioContext — SYNCHRONOUS UNLOCK (iOS Safari fix)
// ---------------------------------------------------------------------------

/**
 * unlockAudioContext — creates AudioContext SYNCHRONOUSLY and calls resume().
 *
 * CRITICAL: Call this as the FIRST STATEMENT in a user gesture handler
 * (button onClick, form onSubmit). This must happen in the same call stack
 * as the user gesture — iOS Safari blocks audio if AudioContext is created
 * or resumed after any async gap.
 *
 * After calling this, you may fire async preloading in the background.
 * When the user later taps Answer, the AudioContext is already unlocked and
 * AudioBufferSourceNode.start(0) fires instantly without any browser block.
 *
 * Unlike initAudioContext() (which is async), this function is fully synchronous.
 */
export function unlockAudioContext(): void {
  if (typeof window === "undefined") return;
  try {
    if (!_audioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext ||
        AudioContext;
      _audioCtx = new AudioCtx();
    }
    // Call resume() synchronously — on iOS, this is what actually unlocks it.
    // The returned Promise is intentionally ignored; the synchronous call is
    // what matters for the autoplay policy unlock.
    void _audioCtx.resume();

    // Play a 1-sample silent buffer to fully unlock webkit AudioContext.
    // This must happen synchronously in the gesture handler.
    const buf = _audioCtx.createBuffer(1, 1, 22050);
    const src = _audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(_audioCtx.destination);
    src.start(0);

    _audioCtxUnlocked = true;
    console.log("[audioService] AudioContext unlocked via user gesture ✓");
  } catch (err) {
    console.warn("[audioService] AudioContext unlock failed:", err);
    // Transcript-only fallback will be used — no robotic voices
  }
}

/**
 * initAudioContext — async version for backwards compat.
 * Prefer unlockAudioContext() for user gesture handlers.
 */
export async function initAudioContext(): Promise<void> {
  unlockAudioContext();
  if (_audioCtx && _audioCtx.state === "suspended") {
    try {
      await _audioCtx.resume();
    } catch {
      // best-effort
    }
  }
}

/** Returns whether AudioContext has been unlocked by a user gesture. */
export function isAudioContextUnlocked(): boolean {
  return _audioCtxUnlocked && !!_audioCtx && _audioCtx.state !== "closed";
}

// ---------------------------------------------------------------------------
// Preloading
// ---------------------------------------------------------------------------

export async function loadCachedNicheAudio(nicheId: string): Promise<boolean> {
  if (!_audioCtx || !_backendActor) return false;
  const script = NICHE_VOICE_SCRIPTS[nicheId] ?? NICHE_VOICE_SCRIPTS.plumber;
  const lines = buildScriptLines(script, "Business");
  const buffers: Array<AudioBuffer | null> = new Array(lines.length).fill(null);
  let allLoaded = true;

  await Promise.allSettled(
    lines.map(async (_, i) => {
      const key = getCacheKey(nicheId, i);
      try {
        const base64 = await _backendActor!.getCachedAudio(key);
        if (!base64) {
          allLoaded = false;
          return;
        }
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let b = 0; b < binary.length; b++) {
          bytes[b] = binary.charCodeAt(b);
        }
        const audioBuf = await _audioCtx!.decodeAudioData(
          bytes.buffer.slice(0),
        );
        buffers[i] = audioBuf;
      } catch (decodeErr) {
        console.error(
          `[audioService] decodeAudioData failed for cache key ${getCacheKey(nicheId, i)}:`,
          decodeErr,
        );
        allLoaded = false;
      }
    }),
  );

  if (buffers.some((b) => b !== null)) {
    _preloadedBuffers.set(nicheId, buffers);
  }
  return allLoaded;
}

async function _saveToBackendCache(
  nicheId: string,
  lineIndex: number,
  arrayBuffer: ArrayBuffer,
): Promise<void> {
  if (!_backendActor) return;
  try {
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i] ?? 0);
    }
    const base64 = btoa(binary);
    await _backendActor.setCachedAudio(getCacheKey(nicheId, lineIndex), base64);
  } catch {
    // fire-and-forget
  }
}

async function _fetchElevenLabsBuffer(
  text: string,
  voiceId: string,
  key: string,
): Promise<AudioBuffer | null> {
  if (!_audioCtx || !key) return null;
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!res.ok) {
      console.warn(
        `[audioService] ElevenLabs API returned ${res.status} — will try OpenAI TTS`,
      );
      return null;
    }
    const arrayBuf = await res.arrayBuffer();
    try {
      return await _audioCtx.decodeAudioData(arrayBuf);
    } catch (decodeErr) {
      console.error(
        "[audioService] ElevenLabs decodeAudioData failed:",
        decodeErr,
      );
      return null;
    }
  } catch (err) {
    console.warn("[audioService] ElevenLabs fetch failed:", err);
    return null;
  }
}

async function _fetchOpenAIBuffer(
  text: string,
  key: string,
): Promise<AudioBuffer | null> {
  if (!_audioCtx || !key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "tts-1", input: text, voice: "nova" }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      console.warn(
        `[audioService] OpenAI TTS returned ${res.status} — will use browser speech`,
      );
      return null;
    }
    const arrayBuf = await res.arrayBuffer();
    try {
      return await _audioCtx.decodeAudioData(arrayBuf);
    } catch (decodeErr) {
      console.error(
        "[audioService] OpenAI TTS decodeAudioData failed:",
        decodeErr,
      );
      return null;
    }
  } catch (err) {
    console.warn("[audioService] OpenAI TTS fetch failed:", err);
    return null;
  }
}

async function _fetchElevenLabsRaw(
  text: string,
  voiceId: string,
  key: string,
): Promise<ArrayBuffer | null> {
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

async function _fetchOpenAIRaw(
  text: string,
  key: string,
): Promise<ArrayBuffer | null> {
  if (!key) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "tts-1", input: text, voice: "nova" }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * preloadNicheScripts — fetches and pre-decodes all script lines for a niche.
 *
 * PRIORITY CHAIN:
 *   1. Backend canister cache (instant, pre-generated)
 *   2. ElevenLabs API — result saved back to backend cache
 *   3. OpenAI TTS — result saved back to backend cache
 *   4. null → speech synthesis used at playback time (always synchronous)
 *
 * This function is idempotent — calling it multiple times is safe.
 * Call on Step 0 submit (after unlockAudioContext) AND on Step 1 mount.
 * By Step 2, all buffers should be ready in the map.
 */
export async function preloadNicheScripts(
  nicheId: string,
  businessName: string,
  elevenLabsKey?: string,
  openaiKey?: string,
): Promise<void> {
  const script = NICHE_VOICE_SCRIPTS[nicheId] ?? NICHE_VOICE_SCRIPTS.plumber;
  const lines = buildScriptLines(script, businessName);

  // Don't reload if already fully cached for this niche
  if (_preloadedBuffers.has(nicheId)) return;

  // Step 1: Try loading from backend canister cache
  const backendLoadedAll = await loadCachedNicheAudio(nicheId);
  if (backendLoadedAll) {
    console.log(
      `[audioService] Layer 1 (cache): All ${lines.length} lines for "${nicheId}" loaded from backend ✓`,
    );
    return;
  }

  // Step 2 & 3: Generate missing lines via ElevenLabs or OpenAI
  const existingBuffers = _preloadedBuffers.get(nicheId);
  const buffers: Array<AudioBuffer | null> =
    existingBuffers ?? new Array(lines.length).fill(null);

  let elevenLabsCount = 0;
  let openaiCount = 0;

  await Promise.allSettled(
    lines.map(async (line, i) => {
      if (buffers[i] !== null) return;

      // Try ElevenLabs first
      if (elevenLabsKey) {
        const buf = await _fetchElevenLabsBuffer(
          line,
          script.voiceId,
          elevenLabsKey,
        );
        if (buf) {
          buffers[i] = buf;
          elevenLabsCount++;
          if (_backendActor) {
            void _fetchElevenLabsRaw(line, script.voiceId, elevenLabsKey).then(
              (raw) => {
                if (raw) void _saveToBackendCache(nicheId, i, raw);
              },
            );
          }
          return;
        }
      }

      // Try OpenAI TTS
      if (openaiKey) {
        const buf = await _fetchOpenAIBuffer(line, openaiKey);
        if (buf) {
          buffers[i] = buf;
          openaiCount++;
          if (_backendActor) {
            void _fetchOpenAIRaw(line, openaiKey).then((raw) => {
              if (raw) void _saveToBackendCache(nicheId, i, raw);
            });
          }
          return;
        }
      }

      // null = no premium audio; transcript-only fallback at playback
      buffers[i] = null;
    }),
  );

  _preloadedBuffers.set(nicheId, buffers);

  const premiumCount = elevenLabsCount + openaiCount;
  const speechSynthCount = buffers.filter((b) => b === null).length;

  if (elevenLabsCount > 0) {
    console.log(
      `[audioService] Layer 1 (ElevenLabs): ${elevenLabsCount} lines preloaded for "${nicheId}" ✓`,
    );
  }
  if (openaiCount > 0) {
    console.log(
      `[audioService] Layer 2 (OpenAI TTS): ${openaiCount} lines preloaded for "${nicheId}" ✓`,
    );
  }
  if (speechSynthCount > 0) {
    console.warn(
      `[audioService] ${speechSynthCount} lines missing premium audio for "${nicheId}" — transcript-only fallback`,
    );
  }
  if (premiumCount === 0) {
    console.warn(
      `[audioService] No API keys — all lines for "${nicheId}" will use transcript-only fallback`,
    );
  }
}

/**
 * isAudioPreloaded — returns true when preloadNicheScripts has completed for a niche.
 */
export function isAudioPreloaded(nicheId: string): boolean {
  return _preloadedBuffers.has(nicheId);
}

// ---------------------------------------------------------------------------
// Playback — SYNCHRONOUS entry point (call directly in onClick)
// ---------------------------------------------------------------------------

/**
 * playPreloadedAudioWithText — SYNCHRONOUS playback.
 *
 * LAYER 1: AudioBuffer (ElevenLabs or OpenAI pre-decoded) — premium quality.
 * FALLBACK: If no premium audio, sets _audioFallbackMode=true and calls onEnded.
 *           DemoStep2Voice checks isAudioFallbackMode() and shows transcript-only.
 *           NEVER calls SpeechSynthesis or SpeechSynthesisUtterance.
 *
 * This MUST be called as the FIRST STATEMENT in an onClick handler.
 * ZERO async between click event and this call.
 */
export function playPreloadedAudioWithText(
  nicheId: string,
  lineIndex: number,
  _text: string,
  onEnded?: () => void,
): AudioBufferSourceNode | null {
  const buffers = _preloadedBuffers.get(nicheId);
  const buffer = buffers?.[lineIndex];

  // Layer 1: AudioContext buffer playback (ElevenLabs or OpenAI pre-decoded)
  if (buffer && _audioCtx && _audioCtx.state !== "closed") {
    try {
      if (_currentSource) {
        try {
          _currentSource.stop();
        } catch {
          // already stopped
        }
        _currentSource = null;
      }
      // Resume AudioContext if it somehow got suspended again
      if (_audioCtx.state === "suspended") {
        void _audioCtx.resume();
      }
      const source = _audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(_audioCtx.destination);
      if (onEnded) source.onended = onEnded;
      source.start(0);
      _currentSource = source;
      console.log(
        `[audioService] ▶ Premium audio: line ${lineIndex} for "${nicheId}"`,
      );
      return source;
    } catch (err) {
      console.warn(
        `[audioService] Premium playback failed for line ${lineIndex}:`,
        err,
        "→ transcript-only fallback",
      );
    }
  } else if (!buffer) {
    console.warn(
      `[audioService] No premium buffer for "${nicheId}" line ${lineIndex} → transcript-only fallback`,
    );
  }

  // Fallback: no premium audio — transcript-only mode, NO SpeechSynthesis
  _audioFallbackMode = true;
  onEnded?.();
  return null;
}

/**
 * playPreloadedAudio — convenience wrapper for playPreloadedAudioWithText.
 */
export function playPreloadedAudio(
  nicheId: string,
  lineIndex: number,
  onEnded?: () => void,
): AudioBufferSourceNode | null {
  const script = NICHE_VOICE_SCRIPTS[nicheId] ?? NICHE_VOICE_SCRIPTS.plumber;
  // Use a generic fallback business name for the speech synth path only
  // (premium path uses the pre-generated buffer which already has the real name)
  const lines = buildScriptLines(script, nicheId);
  const text = lines[lineIndex] ?? "";
  return playPreloadedAudioWithText(nicheId, lineIndex, text, onEnded);
}

// SpeechSynthesis permanently removed — no robotic voices. Transcript-only fallback used instead.
// DO NOT add any SpeechSynthesisUtterance or window.speechSynthesis references here.

/**
 * startAudioSequence — chains all lines after the first one.
 * If audio fallback mode is active (no premium audio), calls onComplete immediately.
 * NEVER uses SpeechSynthesis.
 */
/**
 * startAudioSequence — chains all lines after the first one.
 * If audio fallback mode is active (no premium audio), calls onComplete immediately.
 * NEVER uses SpeechSynthesis.
 *
 * TERMINATION GUARD: maxRetries=3 consecutive failures forces phase='done'.
 * abortSignal: if set to true by caller (component unmount), stops all callbacks.
 */
export function startAudioSequence(
  nicheId: string,
  lines: string[],
  startFromIndex: number,
  onLineChange: (lineIndex: number) => void,
  onComplete: () => void,
  abortRef?: { current: boolean },
): void {
  // If fallback mode active, complete immediately — no audio to chain
  if (_audioFallbackMode) {
    onComplete();
    return;
  }

  let consecutiveFailures = 0;
  const MAX_CONSECUTIVE_FAILURES = 3;

  const playLine = (index: number) => {
    // Termination: unmounted or past end of lines
    if (abortRef?.current) return;
    if (index >= lines.length) {
      onComplete();
      return;
    }
    // Termination: too many consecutive audio failures
    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      console.warn(
        `[audioService] ${MAX_CONSECUTIVE_FAILURES} consecutive audio failures — forcing call complete`,
      );
      if (!abortRef?.current) onComplete();
      return;
    }

    onLineChange(index);
    const pauseAfter = index === 1 ? 900 : 800;

    const result = playPreloadedAudioWithText(
      nicheId,
      index,
      lines[index] ?? "",
      () => {
        if (abortRef?.current) return;
        // If fallback mode was just activated by this line failing, complete now
        if (_audioFallbackMode) {
          onComplete();
          return;
        }
        consecutiveFailures = 0; // successful line resets failure counter
        setTimeout(() => playLine(index + 1), pauseAfter);
      },
    );

    // null return means this line fell into fallback — count it
    if (result === null) {
      consecutiveFailures++;
      if (_audioFallbackMode) {
        // Fallback mode activated — complete immediately
        if (!abortRef?.current) onComplete();
        return;
      }
      // Skip this line and try next after a short pause
      if (!abortRef?.current) {
        setTimeout(() => playLine(index + 1), 200);
      }
    } else {
      consecutiveFailures = 0;
    }
  };

  playLine(startFromIndex);
}

// ---------------------------------------------------------------------------
// Stop / cleanup
// ---------------------------------------------------------------------------

export function stopAllAudio(): void {
  if (_currentSource) {
    try {
      _currentSource.stop();
    } catch {
      // already stopped
    }
    _currentSource = null;
  }
  // SpeechSynthesis intentionally NOT used — no robotic voices
  if (_audioEl.pause) {
    _audioEl.pause();
    _audioEl.src = "";
  }
}

export function stopDemoAudio(): void {
  stopAllAudio();
}

// ---------------------------------------------------------------------------
// Legacy SpeechSynthesis API — STUBS (SpeechSynthesis removed; no robotic voices)
// These stubs exist only for import compatibility. They do nothing meaningful.
// ---------------------------------------------------------------------------

/** @deprecated SpeechSynthesis removed. Transcript-only fallback used instead. */
export function startSpeechSynthesisNow(
  _text: string,
  onEnd?: () => void,
): null {
  onEnd?.();
  return null;
}

/** @deprecated SpeechSynthesis removed. No-op. */
export function speakLine(_text: string, onEnd?: () => void): null {
  onEnd?.();
  return null;
}

/** @deprecated No-op — SpeechSynthesis not used. */
export function cancelSpeechSynthesis(): void {
  // intentionally empty
}

/** @deprecated Always false — SpeechSynthesis not used. */
export function isSpeechActive(): boolean {
  return false;
}

// ---------------------------------------------------------------------------
// Legacy blob-based preload / play API (kept for backwards compat)
// ---------------------------------------------------------------------------

function _cacheKey(voiceId: string, text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return `${voiceId}_${(hash >>> 0).toString(16)}`;
}

async function _fetchElevenLabsBlob(
  text: string,
  voiceId: string,
  key: string,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": key,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      },
    );
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

async function _fetchOpenAIBlob(
  text: string,
  key: string,
): Promise<string | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "tts-1", input: text, voice: "nova" }),
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function preloadElevenLabsAudio(
  voiceId: string,
  lines: string[],
  apiKey: string,
): Promise<void> {
  for (const line of lines) {
    const key = _cacheKey(voiceId, line);
    if (_blobCache.has(key)) continue;
    const url = await _fetchElevenLabsBlob(line, voiceId, apiKey);
    if (url) _blobCache.set(key, url);
  }
}

export function playElevenLabsLine(
  voiceId: string,
  text: string,
  onEnd?: () => void,
): boolean {
  const key = _cacheKey(voiceId, text);
  const url = _blobCache.get(key);
  if (!url) return false;
  cancelSpeechSynthesis();
  _audioEl.pause();
  _audioEl.src = url;
  _audioEl.onended = () => onEnd?.();
  _audioEl.onerror = () => onEnd?.();
  _audioEl.play().catch(() => onEnd?.());
  return true;
}

export async function preloadOpenAIAudio(
  lines: string[],
  apiKey: string,
): Promise<void> {
  const fallbackVoiceId = "openai-nova";
  for (const line of lines) {
    const key = _cacheKey(fallbackVoiceId, line);
    if (_blobCache.has(key)) continue;
    const url = await _fetchOpenAIBlob(line, apiKey);
    if (url) _blobCache.set(key, url);
  }
}

export function playOpenAILine(text: string, onEnd?: () => void): boolean {
  const fallbackVoiceId = "openai-nova";
  const key = _cacheKey(fallbackVoiceId, text);
  const url = _blobCache.get(key);
  if (!url) return false;
  cancelSpeechSynthesis();
  _audioEl.pause();
  _audioEl.src = url;
  _audioEl.onended = () => onEnd?.();
  _audioEl.onerror = () => onEnd?.();
  _audioEl.play().catch(() => onEnd?.());
  return true;
}

function _simulateWordTiming(
  text: string,
  lineIndex: number,
  onWord?: (word: string, lineIdx: number) => void,
): void {
  if (!onWord) return;
  const words = text.split(/\s+/);
  const msPerWord = 280;
  for (let i = 0; i < words.length; i++) {
    setTimeout(() => onWord(words[i] ?? "", lineIndex), i * msPerWord);
  }
}

export function playScriptLine(
  lineIndex: number,
  lines: string[],
  voiceId: string,
  credentials: ScriptCredentials,
  onWord?: (word: string, lineIdx: number) => void,
  onEnd?: () => void,
): Promise<void> {
  const text = lines[lineIndex];
  if (!text) {
    onEnd?.();
    return Promise.resolve();
  }
  if (credentials.elevenLabsKey) {
    const played = playElevenLabsLine(voiceId, text, onEnd);
    if (played) {
      _simulateWordTiming(text, lineIndex, onWord);
      return Promise.resolve();
    }
  }
  if (credentials.openaiKey) {
    const played = playOpenAILine(text, onEnd);
    if (played) {
      _simulateWordTiming(text, lineIndex, onWord);
      return Promise.resolve();
    }
  }
  // No SpeechSynthesis fallback — transcript-only
  onEnd?.();
  return Promise.resolve();
}

export async function preloadAllAudio(
  lines: string[],
  voiceId: string,
  credentials: ScriptCredentials,
): Promise<void> {
  const tasks: Promise<void>[] = [];
  if (credentials.elevenLabsKey) {
    tasks.push(
      preloadElevenLabsAudio(voiceId, lines, credentials.elevenLabsKey),
    );
  }
  if (credentials.openaiKey) {
    tasks.push(preloadOpenAIAudio(lines, credentials.openaiKey));
  }
  await Promise.allSettled(tasks);
}

// ---------------------------------------------------------------------------
// Legacy AudioConfig API
// ---------------------------------------------------------------------------

export interface AudioConfig {
  text: string;
  voiceId: string;
  elevenLabsKey?: string;
  openaiKey?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export async function preloadDemoAudio(config: AudioConfig): Promise<void> {
  const key = _cacheKey(config.voiceId, config.text);
  if (_blobCache.has(key)) return;
  if (config.elevenLabsKey) {
    const url = await _fetchElevenLabsBlob(
      config.text,
      config.voiceId,
      config.elevenLabsKey,
    );
    if (url) {
      _blobCache.set(key, url);
      return;
    }
  }
  if (config.openaiKey) {
    const url = await _fetchOpenAIBlob(config.text, config.openaiKey);
    if (url) _blobCache.set(key, url);
  }
}

export async function playPremiumAudio(config: AudioConfig): Promise<boolean> {
  const key = _cacheKey(config.voiceId, config.text);
  const tryPlayUrl = (blobUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      cancelSpeechSynthesis();
      _audioEl.pause();
      _audioEl.src = blobUrl;
      _audioEl.onended = () => {
        config.onEnd?.();
        resolve(true);
      };
      _audioEl.onerror = () => resolve(false);
      const p = _audioEl.play();
      if (p !== undefined) {
        p.then(() => config.onStart?.()).catch(() => resolve(false));
      } else {
        config.onStart?.();
      }
    });
  };
  const cached = _blobCache.get(key);
  if (cached) return tryPlayUrl(cached);
  if (config.elevenLabsKey) {
    const url = await _fetchElevenLabsBlob(
      config.text,
      config.voiceId,
      config.elevenLabsKey,
    );
    if (url) {
      _blobCache.set(key, url);
      return tryPlayUrl(url);
    }
  }
  if (config.openaiKey) {
    const url = await _fetchOpenAIBlob(config.text, config.openaiKey);
    if (url) {
      _blobCache.set(key, url);
      return tryPlayUrl(url);
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Niche Voice Scripts — hardcoded stable constants
// ---------------------------------------------------------------------------

export const NICHE_VOICE_SCRIPTS: Record<string, NicheVoiceScript> = {
  plumber: {
    niche: "plumber",
    voiceName: "Bella",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    callerName: "Mike Thompson",
    callerQuestion:
      "Hi, I have a burst pipe in my kitchen, water is everywhere, I need someone out today",
    agentGreeting:
      "Thank you for calling {{businessName}}, this is your AI front desk. I understand you have a burst pipe — that's an emergency and we'll get you taken care of right away.",
    agentResponse:
      "I'm pulling up our emergency schedule right now. We have a certified plumber who can be at your location within two hours. Can I confirm your address?",
    agentBookingConfirm:
      "Perfect. I've booked your emergency visit at {{businessName}} for today. You'll receive a text confirmation in just a moment, and our plumber will call you thirty minutes before arrival.",
    agentFarewell:
      "Is there anything else I can help you with? Great — help is on the way!",
  },
  plumbing: {
    niche: "plumbing",
    voiceName: "Bella",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    callerName: "Mike Thompson",
    callerQuestion:
      "Hi, I have a burst pipe in my kitchen, water is everywhere, I need someone out today",
    agentGreeting:
      "Thank you for calling {{businessName}}, this is your AI front desk. I understand you have a burst pipe — that's an emergency and we'll get you taken care of right away.",
    agentResponse:
      "I'm pulling up our emergency schedule right now. We have a certified plumber who can be at your location within two hours. Can I confirm your address?",
    agentBookingConfirm:
      "Perfect. I've booked your emergency visit at {{businessName}} for today. You'll receive a text confirmation in just a moment, and our plumber will call you thirty minutes before arrival.",
    agentFarewell:
      "Is there anything else I can help you with? Great — help is on the way!",
  },
  "med-spa": {
    niche: "med-spa",
    voiceName: "Sophia",
    voiceId: "cjVigY5qzO86Huf0OWal",
    callerName: "Ashley Carter",
    callerQuestion:
      "Hi, I'm interested in booking a Botox consultation, I've never done it before",
    agentGreeting:
      "Welcome to {{businessName}}! We'd love to help you with your first Botox consultation — you've made a wonderful choice.",
    agentResponse:
      "Our consultations are completely complimentary and pressure-free. One of our licensed aestheticians will walk you through everything. I have availability this Thursday at two PM or Friday morning — which works better for you?",
    agentBookingConfirm:
      "Done! I've booked your complimentary Botox consultation at {{businessName}} for Thursday at two PM. You'll receive a text with everything you need to know.",
    agentFarewell: "{{businessName}} looks forward to welcoming you Thursday!",
  },
  medspa: {
    niche: "medspa",
    voiceName: "Sophia",
    voiceId: "cjVigY5qzO86Huf0OWal",
    callerName: "Ashley Carter",
    callerQuestion:
      "Hi, I'm interested in booking a Botox consultation, I've never done it before",
    agentGreeting:
      "Welcome to {{businessName}}! We'd love to help you with your first Botox consultation — you've made a wonderful choice.",
    agentResponse:
      "Our consultations are completely complimentary and pressure-free. I have availability this Thursday at two PM — which works for you?",
    agentBookingConfirm:
      "Done! I've booked your complimentary consultation at {{businessName}} for Thursday. You'll receive a text with all the details.",
    agentFarewell: "{{businessName}} looks forward to welcoming you Thursday!",
  },
  hvac: {
    niche: "hvac",
    voiceName: "Elli",
    voiceId: "MF3mGyEYCl7XYWbV9V6O",
    callerName: "Sandra Williams",
    callerQuestion:
      "My AC stopped working last night and it's already ninety-five degrees in my house",
    agentGreeting:
      "Hi, you've reached {{businessName}}. Ninety-five degrees is no joke — let's get you sorted. I have a same-day repair slot open this afternoon. Shall I lock that in for you?",
    agentResponse:
      "You're all set. Our technician can be there between one and three PM today.",
    agentBookingConfirm:
      "Sending you a text confirmation now with the tech's name and photo. {{businessName}} will have you cool again before dinner.",
    agentFarewell: "Stay cool — help is on the way!",
  },
  restoration: {
    niche: "restoration",
    voiceName: "Rachel",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    callerName: "David Nguyen",
    callerQuestion:
      "Our basement flooded last night, there's about three inches of water down there",
    agentGreeting:
      "You've reached {{businessName}}. Water damage needs fast action — I can have an assessment crew at your property within two hours. What's the address?",
    agentResponse:
      "Got it. {{businessName}}'s certified restoration team is on their way. We'll document everything for your insurance claim too.",
    agentBookingConfirm:
      "That's what {{businessName}} is here for. Our team will call you when they're fifteen minutes out. You're in good hands.",
    agentFarewell: "Help is on the way — hang tight!",
  },
  "carpet-cleaning": {
    niche: "carpet-cleaning",
    voiceName: "Domi",
    voiceId: "AZnzlk1XvdvUeBnXmlld",
    callerName: "Jennifer Park",
    callerQuestion:
      "I'm moving out on Saturday and need end-of-lease carpet cleaning. Is that possible?",
    agentGreeting:
      "Hi, you've reached {{businessName}}! End-of-lease cleaning is our specialty — you've called the right place.",
    agentResponse:
      "For three bedrooms plus living and hallways, I can book you in for Friday if that works before your Saturday move?",
    agentBookingConfirm:
      "Locked in! {{businessName}} will be there Friday morning. You'll get a text with arrival time and our bond-back guarantee details.",
    agentFarewell:
      "Good luck with the move — {{businessName}} has you covered!",
  },
  carpet: {
    niche: "carpet",
    voiceName: "Domi",
    voiceId: "AZnzlk1XvdvUeBnXmlld",
    callerName: "Jennifer Park",
    callerQuestion:
      "I'm moving out on Saturday and need end-of-lease carpet cleaning. Is that possible?",
    agentGreeting:
      "Hi, you've reached {{businessName}}! End-of-lease cleaning is our specialty — you've called the right place.",
    agentResponse:
      "I can book you in for Friday. Does that work before your Saturday move?",
    agentBookingConfirm:
      "Locked in! {{businessName}} will be there Friday morning. You'll get a text with all the details.",
    agentFarewell:
      "Good luck with the move — {{businessName}} has you covered!",
  },
  roofing: {
    niche: "roofing",
    voiceName: "Charlotte",
    voiceId: "XB0fDUnXU5powFXDhCwa",
    callerName: "Robert Martinez",
    callerQuestion:
      "We had a big storm last night and I think there's damage to my roof",
    agentGreeting:
      "Hi, this is {{businessName}}'s AI front desk. Storm damage needs to be assessed quickly before more rain hits. I can get a certified inspector out to you tomorrow morning — does nine AM work?",
    agentResponse:
      "Perfect. {{businessName}} inspector confirmed for tomorrow at nine AM.",
    agentBookingConfirm:
      "The inspection is completely free, and we'll document everything for your insurance claim. {{businessName}} will take care of you from inspection through repair.",
    agentFarewell: "We'll see you tomorrow at nine — take care!",
  },
  "real-estate": {
    niche: "real-estate",
    voiceName: "Adam",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    callerName: "Lisa Thompson",
    callerQuestion:
      "Hi, I saw your listing on Maple Street online and I'd love to schedule a showing",
    agentGreeting:
      "Great choice! This is {{businessName}}'s scheduling line. I have showings available tomorrow at eleven AM or three PM. Which works for you?",
    agentResponse:
      "You're booked for a private showing at {{businessName}} tomorrow at eleven AM.",
    agentBookingConfirm:
      "I'll send your confirmation and the address details now. {{businessName}} looks forward to seeing you tomorrow!",
    agentFarewell: "Looking forward to meeting you!",
  },
  realestate: {
    niche: "realestate",
    voiceName: "Adam",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    callerName: "Lisa Thompson",
    callerQuestion:
      "Hi, I saw your listing on Maple Street online and I'd love to schedule a showing",
    agentGreeting:
      "Great choice! This is {{businessName}}'s scheduling line. I have showings available tomorrow at eleven AM or three PM. Which works for you?",
    agentResponse:
      "You're booked for a private showing at {{businessName}} tomorrow at eleven AM.",
    agentBookingConfirm:
      "Sending your confirmation now. {{businessName}} looks forward to seeing you tomorrow!",
    agentFarewell: "Looking forward to meeting you!",
  },
  mortgage: {
    niche: "mortgage",
    voiceName: "Grace",
    voiceId: "oWAxZDx7w5VEj9dCyTzz",
    callerName: "Tom Bradley",
    callerQuestion:
      "Hi, I'm a first-time homebuyer and I'm not sure where to start with getting a mortgage",
    agentGreeting:
      "Welcome to {{businessName}}! First-time buyers are our specialty — there's no such thing as a silly question here.",
    agentResponse:
      "I can book you a free thirty-minute consultation with one of our advisors. Any day this week work?",
    agentBookingConfirm:
      "Wednesday afternoon it is! Your free consultation with {{businessName}} is confirmed. We'll review your situation and walk you through every option available to you.",
    agentFarewell:
      "{{businessName}} will find you the right path forward — see you Wednesday!",
  },
  chiropractor: {
    niche: "chiropractor",
    voiceName: "Emily",
    voiceId: "LcfcDJNUP1GQjkzn1xUU",
    callerName: "Patricia Cole",
    callerQuestion:
      "I've had really bad lower back pain for the past week, it's affecting my sleep",
    agentGreeting:
      "Hi, you've reached {{businessName}}. Lower back pain is one of the most common things we treat — and you've called the right place.",
    agentResponse:
      "I can get you in for an initial assessment tomorrow morning. How does ten AM sound?",
    agentBookingConfirm:
      "You're booked for your chiropractic assessment at {{businessName}} tomorrow at ten AM. We'll take X-rays, assess the root cause, and build a treatment plan just for you.",
    agentFarewell:
      "You made the right call. {{businessName}} will have you feeling better soon!",
  },
  chiropractic: {
    niche: "chiropractic",
    voiceName: "Emily",
    voiceId: "LcfcDJNUP1GQjkzn1xUU",
    callerName: "Patricia Cole",
    callerQuestion:
      "I've had really bad lower back pain for the past week, it's affecting my sleep",
    agentGreeting:
      "Hi, you've reached {{businessName}}. Lower back pain is one of the most common things we treat — and you've called the right place.",
    agentResponse:
      "I can get you in for an initial assessment tomorrow morning. How does ten AM sound?",
    agentBookingConfirm:
      "You're booked for your chiropractic assessment at {{businessName}} tomorrow at ten AM.",
    agentFarewell:
      "You made the right call. {{businessName}} will have you feeling better soon!",
  },
  dental: {
    niche: "dental",
    voiceName: "Lily",
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    callerName: "Marcus Johnson",
    callerQuestion:
      "I have a really bad toothache and I'm worried it might be serious",
    agentGreeting:
      "Hi, you've reached {{businessName}}. Tooth pain shouldn't wait — we keep emergency slots open every day for exactly this situation.",
    agentResponse: "I can get you in today at two PM. Does that work?",
    agentBookingConfirm:
      "You're booked for an emergency appointment at {{businessName}} today at two PM. We'll identify the issue and get you out of pain as quickly as possible.",
    agentFarewell:
      "You're in good hands with {{businessName}}. See you at two PM — hang in there!",
  },
};

/**
 * Build individual script lines with business name injected.
 * Order: [agentGreeting, callerQuestion, agentResponse, agentBookingConfirm, agentFarewell]
 */
export function buildScriptLines(
  script: NicheVoiceScript,
  businessName: string,
): string[] {
  const biz = businessName || "our office";
  const inject = (text: string) => text.replace(/\{\{businessName\}\}/g, biz);
  return [
    inject(script.agentGreeting),
    script.callerQuestion,
    inject(script.agentResponse),
    inject(script.agentBookingConfirm),
    inject(script.agentFarewell),
  ];
}

/**
 * Build the full spoken script for a niche (single string).
 */
export function buildFullScript(
  script: NicheVoiceScript,
  businessName: string,
): string {
  const biz = businessName || "our office";
  return [
    script.agentGreeting,
    script.agentResponse,
    script.agentBookingConfirm,
    script.agentFarewell,
  ]
    .join(" ")
    .replace(/\{\{businessName\}\}/g, biz);
}

/**
 * Inject business name into any script text.
 */
export function injectBusinessName(text: string, biz: string): string {
  return text
    .replace(/\{\{businessName\}\}/g, biz)
    .replace(/\[BusinessName\]/gi, biz)
    .replace(/\[businessName\]/g, biz);
}
