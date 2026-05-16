/**
 * nicheVoice.ts — Shared types for the ElevenLabs voice assignment & demo audio system.
 * These types mirror the Motoko backend definitions in types/nicheVoice.mo.
 * Frontend-only fields (e.g. preview_url) are optional extras not stored on-chain.
 */

// ---------------------------------------------------------------------------
// Backend-mirrored types
// ---------------------------------------------------------------------------

/**
 * NicheVoiceAssignment — persisted in Motoko stable storage per niche.
 * Matches: { nicheId: Text; voiceId: Text; voiceName: Text; assignedAt: Int }
 */
export interface NicheVoiceAssignment {
  nicheId: string;
  voiceId: string;
  voiceName: string;
  /** Nanoseconds epoch (bigint from backend, stored as number here for convenience) */
  assignedAt: bigint;
}

/**
 * AudioCacheEntry — represents a cached base64 audio blob stored in the backend.
 * Key format: "nicheId:lineIndex"  (e.g. "plumber:0", "hvac:2")
 */
export interface AudioCacheEntry {
  key: string;
  base64Audio: string;
  cachedAt: bigint;
}

// ---------------------------------------------------------------------------
// ElevenLabs API types
// ---------------------------------------------------------------------------

/**
 * ElevenLabsVoice — shape returned by GET /v1/voices
 * Only the fields we use; ElevenLabs returns more.
 */
export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  /** Optional label map, e.g. { accent: "american", gender: "female" } */
  labels?: Record<string, string>;
  /** URL to a short preview mp3 clip hosted by ElevenLabs */
  preview_url?: string;
}

// ---------------------------------------------------------------------------
// Script types
// ---------------------------------------------------------------------------

/**
 * NicheScriptLine — a single line of a demo voice call script.
 * speaker "agent" = the AI front desk voice (spoken via ElevenLabs).
 * speaker "caller" = the simulated customer (shown visually, not spoken).
 */
export interface NicheScriptLine {
  speaker: "agent" | "caller";
  text: string;
  /** Zero-based position within the script */
  lineIndex: number;
}

/**
 * NicheScript — the full script for one niche demo call.
 * Backed by stable Motoko storage; editable by admin and regenerable.
 */
export interface NicheScript {
  nicheId: string;
  voiceId: string;
  voiceName: string;
  lines: NicheScriptLine[];
}
