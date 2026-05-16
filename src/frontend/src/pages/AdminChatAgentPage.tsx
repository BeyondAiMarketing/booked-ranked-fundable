// AdminChatAgentPage — Full-width AI Agent Tester page
// Route: /admin-chat-agent
// Tests all 10 niche voice agents with LLM + ElevenLabs TTS

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCredentials } from "../context/CredentialsContext";
import {
  ELEVENLABS_VOICE_IDS,
  getElevenLabsVoiceId,
  isElevenLabsKeyReady,
} from "../hooks/useElevenLabsVoice";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NICHES = [
  { id: "plumbing", label: "Plumbing" },
  { id: "hvac", label: "HVAC" },
  { id: "roofing", label: "Roofing" },
  { id: "restoration", label: "Restoration" },
  { id: "carpet-cleaning", label: "Carpet Cleaning" },
  { id: "med-spa", label: "Med Spa" },
  { id: "real-estate", label: "Real Estate" },
  { id: "mortgage", label: "Mortgage" },
  { id: "chiropractor", label: "Chiropractor" },
  { id: "dental", label: "Dental" },
];

const NICHE_DEFAULTS: Record<string, string> = {
  plumbing: "Oceanside Plumbing",
  hvac: "Summit HVAC Services",
  roofing: "Apex Roofing Co",
  restoration: "Swift Restoration",
  "carpet-cleaning": "Fresh Carpet Pros",
  "med-spa": "Luxe Med Spa",
  "real-estate": "Premier Realty Group",
  mortgage: "TrustPath Mortgage",
  chiropractor: "Align Chiropractic",
  dental: "Bright Smile Dental",
};

const VOICE_LABELS: Record<string, string> = {
  plumbing: "Bella — friendly female",
  hvac: "Elli — energetic female",
  roofing: "Domi — confident female",
  restoration: "Antoni — professional, calm male",
  "carpet-cleaning": "Adam — neutral male",
  "med-spa": "Rachel — warm female",
  "real-estate": "Josh — approachable male",
  mortgage: "Arnold — authoritative male",
  chiropractor: "Daniel — British, reassuring male",
  dental: "Sam — calm, reassuring male",
};

// ── TTS helper ────────────────────────────────────────────────────────────────

async function elevenLabsSpeak(
  text: string,
  niche: string,
  apiKey: string,
): Promise<string | null> {
  if (!apiKey) return null;
  const voiceId = getElevenLabsVoiceId(niche);
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
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

function webSpeechFallback(text: string): void {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.88;
  utt.pitch = 1.05;
  window.speechSynthesis.speak(utt);
}

async function callLLM(
  messages: LLMMessage[],
  businessName: string,
  niche: string,
  city: string,
  openaiKey: string,
  litellmUrl: string,
): Promise<string> {
  const sysPrompt = `You are a helpful, friendly AI front desk assistant for ${businessName}, a ${niche} business in ${city}. Keep responses under 150 words. Always offer to help with scheduling, questions about services, or general assistance. End responses with a gentle CTA related to the business.`;

  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: sysPrompt }, ...messages],
    max_tokens: 200,
  };

  if (litellmUrl) {
    try {
      const res = await fetch(`${litellmUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices: { message: { content: string } }[];
        };
        return data.choices[0]?.message?.content ?? "";
      }
    } catch {
      /* fall through */
    }
  }

  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices: { message: { content: string } }[];
        };
        return data.choices[0]?.message?.content ?? "";
      }
    } catch {
      /* fall through */
    }
  }

  return `I can help with general questions about ${businessName}! For scheduling or immediate assistance, please give us a call. We'd love to help you today.`;
}

// ── SpeechRecognition types ───────────────────────────────────────────────────

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

type SpeechRecognitionApiCtor = new () => SpeechRecognitionInstance;

// ── Waveform animation ────────────────────────────────────────────────────────

const WAVEFORM_BARS: { h: number; delay: number }[] = [
  { h: 1, delay: 0 },
  { h: 2, delay: 0.1 },
  { h: 3, delay: 0.2 },
  { h: 2, delay: 0.3 },
  { h: 1, delay: 0.4 },
];

function Waveform() {
  return (
    <span className="inline-flex items-end gap-0.5 h-3 ml-1">
      {WAVEFORM_BARS.map((bar) => (
        <span
          key={bar.delay}
          className="bg-purple-400 rounded-sm w-0.5 animate-pulse"
          style={{ height: `${bar.h * 4}px`, animationDelay: `${bar.delay}s` }}
        />
      ))}
    </span>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconPlay() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconMic({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5v3M8 21.5h8" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminChatAgentPage() {
  const [selectedNiche, setSelectedNiche] = useState("plumbing");
  const [businessName, setBusinessName] = useState("Oceanside Plumbing");
  const [city, setCity] = useState("Miami, FL");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);

  // Get credentials from backend via context — no localStorage
  const { creds } = useCredentials();
  const elevenLabsKey = creds?.elevenLabsKey ?? "";
  const litellmUrl = creds?.litellmUrl ?? "";
  const openaiKey = creds?.openaiKey ?? "";
  const elevenLabsReady = isElevenLabsKeyReady(elevenLabsKey);

  // Default business name when niche changes
  useEffect(() => {
    setBusinessName(NICHE_DEFAULTS[selectedNiche] ?? "My Business");
  }, [selectedNiche]);

  // Auto-scroll — called imperatively when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const speakText = useCallback(
    async (text: string) => {
      setIsPlaying(true);
      const url = await elevenLabsSpeak(text, selectedNiche, elevenLabsKey);
      if (url) {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
        };
        audio.onerror = () => {
          setIsPlaying(false);
          webSpeechFallback(text);
        };
        audio.play().catch(() => {
          setIsPlaying(false);
          webSpeechFallback(text);
        });
      } else {
        webSpeechFallback(text);
        setTimeout(() => setIsPlaying(false), Math.max(2000, text.length * 60));
      }
    },
    [selectedNiche, elevenLabsKey],
  );

  const sendMessage = useCallback(
    async (text: string, currentMessages: ChatMessage[]) => {
      if (!text.trim() || isLoading) return;
      setInput("");
      setIsLoading(true);

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const history: LLMMessage[] = currentMessages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      history.push({ role: "user", content: text.trim() });

      const reply = await callLLM(
        history,
        businessName,
        selectedNiche,
        city,
        openaiKey,
        litellmUrl,
      );
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
      speakText(reply);
      scrollToBottom();
    },
    [
      isLoading,
      businessName,
      selectedNiche,
      city,
      openaiKey,
      litellmUrl,
      speakText,
      scrollToBottom,
    ],
  );

  const startConversation = () => {
    setMessages([]);
    const greeting = `Hello! Thank you for calling ${businessName}. This is your AI assistant. How can I help you today?`;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: greeting,
      timestamp: Date.now(),
    };
    setMessages([msg]);
    speakText(greeting);
  };

  const previewVoice = async () => {
    setPreviewLoading(true);
    const preview = `Hello! I'm the AI assistant voice for ${selectedNiche.replace(/-/g, " ")} businesses.`;
    await speakText(preview);
    setPreviewLoading(false);
  };

  const toggleMic = useCallback(() => {
    if (isRecording) {
      recogRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const win = window as Window & {
      SpeechRecognition?: SpeechRecognitionApiCtor;
      webkitSpeechRecognition?: SpeechRecognitionApiCtor;
    };
    const SpeechRecognitionAPI =
      win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const recog = new SpeechRecognitionAPI();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";
    recogRef.current = recog;

    let finalTimer: ReturnType<typeof setTimeout>;
    let lastFinal = "";
    let capturedMessages: ChatMessage[] = [];

    recog.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInput(final || interim);
      if (final) {
        lastFinal = final;
        clearTimeout(finalTimer);
        finalTimer = setTimeout(() => {
          recog.stop();
          setIsRecording(false);
          setInput("");
          setMessages((prev) => {
            capturedMessages = prev;
            return prev;
          });
          sendMessage(lastFinal, capturedMessages);
        }, 500);
      }
    };

    recog.onerror = (e) => {
      setIsRecording(false);
      if (e.error === "not-allowed") toast.error("Microphone access denied");
    };
    recog.onend = () => setIsRecording(false);
    recog.start();
    setIsRecording(true);
  }, [isRecording, sendMessage]);

  const selectedVoiceId =
    ELEVENLABS_VOICE_IDS[selectedNiche] ?? "21m00Tcm4TlvDq8ikWAM";

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-white/8 bg-card px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-400"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              AI Agent Tester
            </h1>
            <p className="text-xs text-slate-400">
              Test your voice agent before going live with clients
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {elevenLabsReady ? (
              <span
                data-ocid="admin-chat-agent.elevenlabs_status"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  aria-hidden="true"
                />
                Voice AI Ready
              </span>
            ) : (
              <span
                data-ocid="admin-chat-agent.elevenlabs_status"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-amber-400"
                  aria-hidden="true"
                />
                ElevenLabs not configured
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Agent Config */}
        <div className="w-72 shrink-0 border-r border-white/8 bg-card/40 overflow-y-auto p-5 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Agent Config
            </h3>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="admin-chat-niche"
                  className="block text-xs text-slate-400 mb-1.5"
                >
                  Niche
                </label>
                <select
                  id="admin-chat-niche"
                  data-ocid="admin-chat-agent.niche_select"
                  value={selectedNiche}
                  onChange={(e) => {
                    setSelectedNiche(e.target.value);
                    setMessages([]);
                  }}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                >
                  {NICHES.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="admin-chat-business"
                  className="block text-xs text-slate-400 mb-1.5"
                >
                  Business Name
                </label>
                <input
                  id="admin-chat-business"
                  data-ocid="admin-chat-agent.business_name_input"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-chat-city"
                  className="block text-xs text-slate-400 mb-1.5"
                >
                  City / Location
                </label>
                <input
                  id="admin-chat-city"
                  data-ocid="admin-chat-agent.city_input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Voice Info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Voice
            </h3>
            <div className="rounded-xl bg-purple-500/8 border border-purple-500/20 p-3 space-y-2">
              <div>
                <p className="text-xs font-semibold text-purple-300">
                  {VOICE_LABELS[selectedNiche] ?? "Rachel — warm female"}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 break-all">
                  {selectedVoiceId}
                </p>
              </div>
              <button
                type="button"
                data-ocid="admin-chat-agent.preview_voice_button"
                onClick={previewVoice}
                disabled={previewLoading || isPlaying}
                className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
              >
                {previewLoading || isPlaying ? (
                  <>
                    <Waveform />
                    Playing…
                  </>
                ) : (
                  <>
                    <IconPlay />
                    Preview Voice
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <button
            type="button"
            data-ocid="admin-chat-agent.start_conversation_button"
            onClick={startConversation}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            Start New Conversation
          </button>

          {!elevenLabsReady && (
            <div
              data-ocid="admin-chat-agent.elevenlabs_warning"
              className="rounded-lg bg-amber-500/8 border border-amber-500/20 p-3"
            >
              <p className="text-xs text-amber-400 leading-relaxed">
                <strong>ElevenLabs not configured.</strong> Add your API key in
                the{" "}
                <a href="/go-live" className="underline">
                  Go Live Dashboard
                </a>{" "}
                to enable real AI voices.
              </p>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Messages */}
          <div
            ref={listRef}
            data-ocid="admin-chat-agent.chat_list"
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {messages.length === 0 ? (
              <div
                data-ocid="admin-chat-agent.empty_state"
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-purple-600/15 border border-purple-500/25 flex items-center justify-center mb-4">
                  <IconMic size={24} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Ready to Test
                </h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Configure your agent settings on the left, then click{" "}
                  <strong>"Start New Conversation"</strong> to hear your AI
                  voice agent respond.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  data-ocid={`admin-chat-agent.message.${idx + 1}`}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-purple-600/70 text-white rounded-br-sm"
                        : "bg-white/8 text-slate-200 border border-white/8 rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <p className="text-[10px] text-purple-400 font-semibold mb-1 uppercase tracking-wider">
                        {businessName} AI Agent
                        {isPlaying && <Waveform />}
                      </p>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div
                className="flex justify-start"
                data-ocid="admin-chat-agent.loading_state"
              >
                <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1" aria-label="Agent is typing">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={`dot-${i}`}
                        className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/8 p-4 bg-card/30 shrink-0">
            <div className="flex items-center gap-3 max-w-3xl mx-auto">
              <label htmlFor="admin-chat-agent-input" className="sr-only">
                Test message
              </label>
              <input
                id="admin-chat-agent-input"
                type="text"
                data-ocid="admin-chat-agent.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    setMessages((prev) => {
                      sendMessage(input, prev);
                      return prev;
                    });
                  }
                }}
                placeholder={
                  isRecording ? "Listening…" : "Type a test message or use mic…"
                }
                className={`flex-1 bg-black/30 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/60 transition-colors ${
                  isRecording
                    ? "border-rose-500/60 bg-rose-500/5"
                    : "border-white/10 focus:border-purple-500/40"
                }`}
              />
              <button
                type="button"
                data-ocid="admin-chat-agent.mic_button"
                onClick={toggleMic}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  isRecording
                    ? "bg-rose-500/20 border border-rose-500/50 text-rose-400 animate-pulse"
                    : "bg-white/6 border border-white/10 text-slate-400 hover:bg-white/12 hover:text-white"
                }`}
                aria-label={
                  isRecording ? "Stop recording" : "Start voice input"
                }
              >
                <IconMic size={16} />
              </button>
              <button
                type="button"
                data-ocid="admin-chat-agent.send_button"
                onClick={() =>
                  setMessages((prev) => {
                    sendMessage(input, prev);
                    return prev;
                  })
                }
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-600/80 hover:bg-purple-600 text-white transition-colors disabled:opacity-40 shrink-0"
                aria-label="Send message"
              >
                <IconSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
