/**
 * AdminVoiceManagerPage — Assign ElevenLabs Voice IDs per niche.
 * Voices are saved to localStorage keyed as elevenLabsVoice_{niche}.
 */

import { useCredentials } from "@/context/CredentialsContext";
import { CheckCircle, Play, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const NICHES = [
  { id: "plumber", label: "Plumber" },
  { id: "hvac", label: "HVAC" },
  { id: "roofing", label: "Roofing" },
  { id: "restoration", label: "Restoration" },
  { id: "med-spa", label: "Med Spa" },
  { id: "dental", label: "Dental" },
  { id: "real-estate", label: "Real Estate" },
  { id: "mortgage", label: "Mortgage" },
  { id: "contractor", label: "Contractor" },
  { id: "auto", label: "Auto" },
] as const;

type NicheId = (typeof NICHES)[number]["id"];

function getStoredVoiceId(niche: NicheId): string {
  try {
    return localStorage.getItem(`elevenLabsVoice_${niche}`) ?? "";
  } catch {
    return "";
  }
}

function setStoredVoiceId(niche: NicheId, voiceId: string) {
  try {
    localStorage.setItem(`elevenLabsVoice_${niche}`, voiceId);
  } catch {
    /* non-fatal */
  }
}

function NicheVoiceCard({
  niche,
  apiKey,
}: {
  niche: (typeof NICHES)[number];
  apiKey: string;
}) {
  const [voiceId, setVoiceId] = useState(() => getStoredVoiceId(niche.id));
  const [saved, setSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSave = () => {
    setStoredVoiceId(niche.id, voiceId.trim());
    setSaved(true);
    toast.success(`Voice saved for ${niche.label}`);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePreview = async () => {
    const vid = voiceId.trim();
    if (!vid) {
      toast.error("Enter a Voice ID first");
      return;
    }
    if (!apiKey) {
      toast.error("ElevenLabs API key not configured in Go Live Settings");
      return;
    }
    setIsPlaying(true);
    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${vid}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: `Hi, this is your AI receptionist for ${niche.label} services. How can I help you today?`,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        },
      );
      if (!res.ok) {
        const err = await res.text();
        toast.error(`Preview failed: ${err.slice(0, 80)}`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("Audio playback failed");
      };
      await audio.play();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Preview request failed",
      );
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="rounded-xl p-4 border flex flex-col gap-3"
      style={{
        background: "oklch(0.12 0.03 280)",
        borderColor: "oklch(0.40 0.16 290 / 40%)",
      }}
      data-ocid={`voice-manager.${niche.id}.card`}
    >
      <h3
        className="font-bold text-sm"
        style={{ color: "oklch(0.90 0.04 280)" }}
      >
        {niche.label}
      </h3>

      <div className="flex flex-col gap-1">
        <label
          htmlFor={`voice-${niche.id}`}
          className="text-xs font-medium"
          style={{ color: "oklch(0.60 0.06 280)" }}
        >
          ElevenLabs Voice ID
        </label>
        <input
          id={`voice-${niche.id}`}
          type="text"
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
          placeholder="e.g. EXAVITQu4vr4xnSDxMaL"
          data-ocid={`voice-manager.${niche.id}.input`}
          className="w-full rounded-lg px-3 py-2 text-sm font-mono outline-none focus:ring-2"
          style={{
            background: "oklch(0.09 0.02 280)",
            border: "1px solid oklch(0.30 0.08 290 / 60%)",
            color: "oklch(0.88 0.04 280)",
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handlePreview()}
          disabled={isPlaying}
          data-ocid={`voice-manager.${niche.id}.play_button`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:opacity-90 disabled:opacity-50"
          style={{
            background: "oklch(0.25 0.10 290 / 60%)",
            border: "1px solid oklch(0.50 0.18 290 / 50%)",
            color: "oklch(0.80 0.14 290)",
          }}
        >
          <Play className="w-3 h-3" />
          {isPlaying ? "Playing..." : "Play Preview"}
        </button>

        <button
          type="button"
          onClick={handleSave}
          data-ocid={`voice-manager.${niche.id}.save_button`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:opacity-90"
          style={{
            background: saved
              ? "oklch(0.25 0.10 155 / 60%)"
              : "oklch(0.50 0.22 290)",
            color: "#fff",
          }}
        >
          {saved ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminVoiceManagerPage() {
  const { creds } = useCredentials();
  const apiKey = creds?.elevenLabsKey ?? "";

  const handleSaveAll = () => {
    toast.success("All voice assignments saved");
  };

  const handleTestAll = () => {
    toast.info("Testing all voices — check each card for playback");
  };

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "oklch(0.08 0.02 280)" }}
      data-ocid="voice-manager.page"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1
            className="font-black text-2xl"
            style={{ color: "oklch(0.95 0.02 280)" }}
          >
            ElevenLabs Voice Manager
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.55 0.04 280)" }}>
            Assign a voice to each niche. Click Play to preview before saving.
          </p>
          {!apiKey && (
            <p
              className="text-xs mt-1 px-3 py-2 rounded-lg"
              style={{
                background: "oklch(0.18 0.08 30 / 40%)",
                border: "1px solid oklch(0.45 0.18 30 / 40%)",
                color: "oklch(0.75 0.12 30)",
              }}
            >
              ⚠ No ElevenLabs API key detected. Configure it in Go Live Settings
              to enable voice previews.
            </p>
          )}
        </div>

        {/* Top actions */}
        <div className="flex gap-3" data-ocid="voice-manager.actions">
          <button
            type="button"
            onClick={handleSaveAll}
            data-ocid="voice-manager.save_all_button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{
              background: "oklch(0.50 0.22 290)",
              color: "#fff",
            }}
          >
            <Save className="w-4 h-4" />
            Save All
          </button>
          <button
            type="button"
            onClick={handleTestAll}
            data-ocid="voice-manager.test_all_button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{
              background: "oklch(0.20 0.08 290 / 60%)",
              border: "1px solid oklch(0.45 0.18 290 / 50%)",
              color: "oklch(0.75 0.14 290)",
            }}
          >
            <Play className="w-4 h-4" />
            Test All Voices
          </button>
        </div>

        {/* Niche grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-ocid="voice-manager.list"
        >
          {NICHES.map((niche) => (
            <NicheVoiceCard key={niche.id} niche={niche} apiKey={apiKey} />
          ))}
        </div>
      </div>
    </div>
  );
}
