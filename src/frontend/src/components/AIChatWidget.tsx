// AIChatWidget — Floating AI chat + voice widget
// - Floating 64px purple gradient button (bottom-right)
// - Slide-in panel with full LLM chat + ElevenLabs TTS
// - Speech-to-text mic input (Web Speech API)
// - Session persistence for messages

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCredentials } from "../context/CredentialsContext";
import {
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

interface AIChatWidgetProps {
  businessName: string;
  niche: string;
  city: string;
  phone?: string;
}

// ── ElevenLabs TTS helper ─────────────────────────────────────────────────────

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

// ── LLM chat helper ───────────────────────────────────────────────────────────

interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
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

// ── SpeechRecognition types (not always in TypeScript lib) ───────────────────

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

const SESSION_KEY = "brf_chat_messages";

// ── Icons (inline SVG for clarity) ───────────────────────────────────────────

function IconChat() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
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

function IconClose({ size = 14 }: { size?: number }) {
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconSend({ size = 14 }: { size?: number }) {
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
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function IconMicSmall({ size = 14 }: { size?: number }) {
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

function IconUser() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AIChatWidget({
  businessName,
  niche,
  city,
}: AIChatWidgetProps) {
  // Get credentials from backend via context — no localStorage
  const { creds } = useCredentials();
  const elevenLabsKey = creds?.elevenLabsKey ?? "";
  const litellmUrl = creds?.litellmUrl ?? "";
  const openaiKey = creds?.openaiKey ?? "";
  const elevenLabsReady = isElevenLabsKeyReady(elevenLabsKey);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as ChatMessage[];
    } catch {
      /* ignore */
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [micSupported] = useState(
    () =>
      !!(
        typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
      ),
  );

  const listRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greeted = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;

  // Persist messages
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll on open state change
  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, scrollToBottom]);

  // On first open, send greeting
  useEffect(() => {
    if (!open || greeted.current) return;
    greeted.current = true;
    const greeting = `Hi! I'm the AI assistant for ${businessName}. How can I help you today?`;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: greeting,
      timestamp: Date.now(),
    };
    setMessages([msg]);
    scrollToBottom();
    speakMessageRef.current?.(msg.id, greeting);
  }, [open, businessName, scrollToBottom]);

  // Count unread when panel closed
  useEffect(() => {
    if (!open) return;
    setUnread(0);
  }, [open]);

  // Store speakMessage in a ref so the greeting effect can call it without dep issue
  const speakMessageRef = useRef<
    ((id: string, text: string) => Promise<void>) | undefined
  >(undefined);

  const speakMessage = useCallback(
    async (id: string, text: string) => {
      setPlayingId(id);
      const url = await elevenLabsSpeak(text, niche, elevenLabsKey);
      if (url) {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          setPlayingId(null);
          audioRef.current = null;
        };
        audio.onerror = () => {
          setPlayingId(null);
          webSpeechFallback(text);
        };
        audio.play().catch(() => {
          setPlayingId(null);
          webSpeechFallback(text);
        });
      } else {
        webSpeechFallback(text);
        setTimeout(() => setPlayingId(null), Math.max(2000, text.length * 60));
      }
    },
    [niche, elevenLabsKey],
  );

  speakMessageRef.current = speakMessage;

  const replayMessage = useCallback(
    (msg: ChatMessage) => {
      audioRef.current?.pause();
      audioRef.current = null;
      window.speechSynthesis?.cancel();
      speakMessage(msg.id, msg.content);
    },
    [speakMessage],
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
      const updatedMessages = [...currentMessages, userMsg];
      setMessages(updatedMessages);

      const history: LLMMessage[] = currentMessages.slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      history.push({ role: "user", content: text.trim() });

      const reply = await callLLM(
        history,
        businessName,
        niche,
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
      speakMessage(assistantMsg.id, reply);

      if (!openRef.current) setUnread((n) => n + 1);
    },
    [isLoading, businessName, niche, city, openaiKey, litellmUrl, speakMessage],
  );

  const toggleMic = useCallback(() => {
    if (isRecording) {
      recogRef.current?.stop();
      setIsRecording(false);
      return;
    }

    type SpeechRecognitionApiCtor = new () => SpeechRecognitionInstance;
    const win = window as Window & {
      SpeechRecognition?: SpeechRecognitionApiCtor;
      webkitSpeechRecognition?: SpeechRecognitionApiCtor;
    };
    const SpeechRecognitionAPI =
      win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recog = new SpeechRecognitionAPI();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = "en-US";
    recogRef.current = recog;

    let finalTimer: ReturnType<typeof setTimeout>;
    let lastFinal = "";
    let capturedMessages: ChatMessage[] = [];
    setMessages((prev) => {
      capturedMessages = prev;
      return prev;
    });

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
      recogRef.current = null;
      if (e.error === "not-allowed") {
        toast.error("Microphone access denied — using text chat");
      }
    };

    recog.onend = () => {
      setIsRecording(false);
      recogRef.current = null;
    };

    recog.start();
    setIsRecording(true);
  }, [isRecording, sendMessage]);

  const handleClose = () => {
    setOpen(false);
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
    recogRef.current?.stop();
    setIsRecording(false);
    setUnread(0);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        data-ocid="chat-widget.open_modal_button"
        onClick={() => {
          setOpen(true);
          setUnread(0);
        }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border border-purple-500/40"
        aria-label="Open AI chat assistant"
      >
        {open ? <IconChat /> : <IconMic />}
        {unread > 0 && !open && (
          <span
            data-ocid="chat-widget.unread_badge"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center border-2 border-background"
            aria-label={`${unread} unread messages`}
          >
            {unread}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <dialog
          open
          data-ocid="chat-widget.dialog"
          className="fixed bottom-24 right-4 z-50 w-[400px] max-w-[calc(100vw-2rem)] max-h-[70vh] flex flex-col rounded-2xl shadow-2xl bg-gray-900 border border-purple-800/60 overflow-hidden m-0 p-0"
          aria-label="AI chat assistant"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border-b border-purple-800/40 shrink-0">
            <div className="w-9 h-9 rounded-full bg-purple-700/60 border border-purple-500/40 flex items-center justify-center shrink-0">
              <IconUser />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {businessName}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">AI Assistant</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                  {niche.replace(/-/g, " ")}
                </span>
                {elevenLabsReady && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/15 text-sky-400 border border-sky-500/30">
                    Voice AI
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              data-ocid="chat-widget.close_button"
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <IconClose />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            data-ocid="chat-widget.list"
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ minHeight: "200px" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                data-ocid={`chat-widget.message.${idx + 1}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" ? (
                  <button
                    type="button"
                    className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed text-left bg-white/8 text-slate-200 border border-white/8 rounded-bl-sm hover:opacity-80 transition-opacity"
                    onClick={() => replayMessage(msg)}
                    aria-label="Replay agent message"
                    onKeyDown={(e) => e.key === "Enter" && replayMessage(msg)}
                  >
                    {msg.content}
                    {playingId === msg.id && <Waveform />}
                  </button>
                ) : (
                  <div className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed bg-purple-600/70 text-white rounded-br-sm">
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div
                className="flex justify-start"
                data-ocid="chat-widget.loading_state"
              >
                <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <span className="flex gap-1" aria-label="Agent is typing">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={`dot-${i}`}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-purple-800/30 p-3 bg-black/20 shrink-0">
            <div className="flex items-center gap-2">
              <label htmlFor="chat-widget-input" className="sr-only">
                Message
              </label>
              <input
                ref={inputRef}
                id="chat-widget-input"
                type="text"
                data-ocid="chat-widget.input"
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
                placeholder={isRecording ? "Listening…" : "Type a message…"}
                className={`flex-1 bg-white/6 border rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/60 transition-colors ${
                  isRecording
                    ? "border-rose-500/60 bg-rose-500/5"
                    : "border-white/10 focus:border-purple-500/40"
                }`}
              />
              {micSupported && (
                <button
                  type="button"
                  data-ocid="chat-widget.mic_button"
                  onClick={toggleMic}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    isRecording
                      ? "bg-rose-500/20 border border-rose-500/50 text-rose-400 animate-pulse"
                      : "bg-white/6 border border-white/10 text-slate-400 hover:bg-white/12 hover:text-white"
                  }`}
                  aria-label={
                    isRecording ? "Stop recording" : "Start voice input"
                  }
                >
                  <IconMicSmall />
                </button>
              )}
              <button
                type="button"
                data-ocid="chat-widget.send_button"
                onClick={() =>
                  setMessages((prev) => {
                    sendMessage(input, prev);
                    return prev;
                  })
                }
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-600/80 hover:bg-purple-600 text-white transition-colors disabled:opacity-40 shrink-0"
                aria-label="Send message"
              >
                <IconSend />
              </button>
            </div>
            {!micSupported && (
              <p className="text-[10px] text-slate-600 mt-1.5 text-center">
                Voice input not supported in this browser
              </p>
            )}
          </div>
        </dialog>
      )}
    </>
  );
}
