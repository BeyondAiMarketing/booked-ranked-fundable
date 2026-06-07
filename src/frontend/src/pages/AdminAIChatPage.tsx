/**
 * AdminAIChatPage — Plain-English admin AI chat interface.
 * Left: chat panel (75%). Right: Go Live Status + Recent Changes (25%).
 */

import { useCredentials } from "@/context/CredentialsContext";
import { CheckCircle, Send, XCircle } from "lucide-react";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  showConfirm?: boolean;
  confirmed?: boolean;
}

interface ChangeEntry {
  timestamp: string;
  description: string;
  status: "Done";
}

const INTEGRATIONS = [
  { id: "elevenLabsKey", label: "ElevenLabs" },
  { id: "openaiKey", label: "OpenAI" },
  { id: "claudeKey", label: "Claude" },
  { id: "vapiKey", label: "Vapi" },
  { id: "serpApiKey", label: "SerpApi" },
] as const;

type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

const LS_INTEGRATIONS: Record<string, string> = {
  twilio: "twilioAccountSid",
  sendgrid: "sendgridApiKey",
};

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I can help you configure your BRF platform in plain English. What would you like to do? For example: Set my ElevenLabs voice for plumbers, Update my trial duration, Configure my Twilio number.",
};

const SUGGESTIONS = [
  "Set a voice assignment",
  "Update trial settings",
  "Check my integrations",
];

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0 mt-0.5"
      style={{
        background: active ? "oklch(0.65 0.20 155)" : "oklch(0.55 0.22 20)",
      }}
    />
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  onConfirm,
}: {
  msg: ChatMessage;
  onConfirm: (id: string) => void;
}) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}
      data-ocid={`ai-chat.message.${msg.id}`}
    >
      <div
        className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={{
          background: isUser ? "oklch(0.50 0.22 290)" : "oklch(0.14 0.04 280)",
          color: isUser ? "#fff" : "oklch(0.88 0.03 280)",
          border: isUser ? "none" : "1px solid oklch(0.28 0.06 280 / 60%)",
        }}
      >
        <p>{msg.text}</p>
        {msg.showConfirm && !msg.confirmed && (
          <button
            type="button"
            onClick={() => onConfirm(msg.id)}
            data-ocid="ai-chat.confirm_button"
            className="mt-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
            style={{
              background: "oklch(0.50 0.22 155)",
              color: "#fff",
            }}
          >
            Confirm
          </button>
        )}
        {msg.confirmed && (
          <p
            className="mt-1.5 text-xs font-semibold"
            style={{ color: "oklch(0.68 0.18 155)" }}
          >
            ✓ Done
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminAIChatPage() {
  const { creds } = useCredentials();
  const { actor } = useActor();

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [changeLog, setChangeLog] = useState<ChangeEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [operatorMode, setOperatorMode] = React.useState(false);
  const [operatorStats, setOperatorStats] = React.useState<Record<
    string,
    unknown
  > | null>(null);
  const [operatorHistory, setOperatorHistory] = React.useState<
    Array<{
      id: string;
      content: string;
      createdAt: bigint;
      role: string;
      commandType?: string;
    }>
  >([]);
  const [operatorInput, setOperatorInput] = React.useState("");
  const [pendingCommandResult, setPendingCommandResult] = React.useState<{
    requires_confirmation: boolean;
    intent: string;
    affected_count: bigint;
    recommended_actions: string[];
    affected_niche: string;
  } | null>(null);
  const [isListening, setIsListening] = React.useState(false);

  // Scroll to bottom on new message
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll-on-message intent
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (!operatorMode || !actor) return;
    (
      actor as Record<string, unknown> & {
        getOperatorStats: () => Promise<Record<string, unknown>>;
        getOperatorChatHistory: () => Promise<
          Array<{
            id: string;
            content: string;
            createdAt: bigint;
            role: string;
            commandType?: string;
          }>
        >;
      }
    )
      .getOperatorStats()
      .then((s) => setOperatorStats(s))
      .catch(() => {});
    (
      actor as Record<string, unknown> & {
        getOperatorStats: () => Promise<Record<string, unknown>>;
        getOperatorChatHistory: () => Promise<
          Array<{
            id: string;
            content: string;
            createdAt: bigint;
            role: string;
            commandType?: string;
          }>
        >;
      }
    )
      .getOperatorChatHistory()
      .then((h) => setOperatorHistory(h))
      .catch(() => {});
  }, [operatorMode, actor]);

  // Build status summary for context
  const statusSummaryItems: Array<{ name: string; connected: boolean }> = [
    ...INTEGRATIONS.map((i) => ({
      name: i.label,
      connected: !!creds?.[i.id as IntegrationId],
    })),
    {
      name: "Twilio",
      connected: !!(
        typeof window !== "undefined" &&
        localStorage.getItem(LS_INTEGRATIONS.twilio)
      ),
    },
    {
      name: "SendGrid",
      connected: !!(
        typeof window !== "undefined" &&
        localStorage.getItem(LS_INTEGRATIONS.sendgrid)
      ),
    },
  ];
  const statusSummary = statusSummaryItems
    .map((i) => `${i.name}: ${i.connected ? "connected" : "not configured"}`)
    .join(", ");

  const allIntegrationStatuses = [
    ...INTEGRATIONS.map((i) => ({
      label: i.label,
      active: !!creds?.[i.id as IntegrationId],
    })),
    {
      label: "Twilio",
      active: !!(
        typeof window !== "undefined" &&
        localStorage.getItem(LS_INTEGRATIONS.twilio)
      ),
    },
    {
      label: "SendGrid",
      active: !!(
        typeof window !== "undefined" &&
        localStorage.getItem(LS_INTEGRATIONS.sendgrid)
      ),
    },
  ];

  const addMessage = (msg: Omit<ChatMessage, "id">) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setMessages((prev) => [...prev, { ...msg, id }]);
    return id;
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? inputText).trim();
    if (!content || isSending) return;
    setInputText("");
    addMessage({ role: "user", text: content });
    setIsSending(true);

    try {
      const res = await fetch("/api/admin-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, context: statusSummary }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { reply?: string; text?: string };
      const reply = data.reply ?? data.text ?? "";
      const showConfirm = /i (will|can) (set|update|configure|change)/i.test(
        reply,
      );

      addMessage({ role: "assistant", text: reply, showConfirm });
    } catch {
      addMessage({
        role: "assistant",
        text: "I am having trouble connecting right now. Please check that your API keys are configured in Go Live Settings.",
      });
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleConfirm = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, confirmed: true } : m)),
    );
    const msg = messages.find((m) => m.id === msgId);
    if (msg) {
      const firstLine = msg.text.split(".")[0] ?? msg.text.slice(0, 60);
      const entry: ChangeEntry = {
        timestamp: new Date().toLocaleTimeString(),
        description: firstLine,
        status: "Done",
      };
      setChangeLog((prev) => [entry, ...prev].slice(0, 5));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.08 0.02 280)" }}
      data-ocid="ai-chat.page"
    >
      {/* Operator Mode Toggle Bar */}
      <div
        className="px-6 py-3 border-b flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"
        style={{
          background: "oklch(0.10 0.03 280)",
          borderColor: "oklch(0.22 0.06 280 / 60%)",
        }}
        data-ocid="ai-chat.operator_mode_bar"
      >
        <button
          type="button"
          onClick={() => setOperatorMode(!operatorMode)}
          data-ocid="ai-chat.operator_mode_toggle"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${operatorMode ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
        >
          {operatorMode ? "Operator Mode ON" : "Switch to Operator Mode"}
        </button>
        {operatorMode && operatorStats && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span>
              Trials This Week:{" "}
              <span className="text-white font-semibold">
                {Number(
                  (operatorStats.trials_this_week as bigint) ?? BigInt(0),
                )}
              </span>
            </span>
            <span>
              Leads Today:{" "}
              <span className="text-white font-semibold">
                {Number((operatorStats.leads_today as bigint) ?? BigInt(0))}
              </span>
            </span>
            <span>
              Outreach Sent:{" "}
              <span className="text-white font-semibold">
                {Number(
                  (operatorStats.outreach_sent_today as bigint) ?? BigInt(0),
                )}
              </span>
            </span>
            {operatorStats.api_health_summary ? (
              <span className="text-emerald-400">
                {String(operatorStats.api_health_summary)}
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Operator Mode Panel */}
      {operatorMode && (
        <div
          className="border-b px-6 py-4 flex flex-col gap-3"
          style={{
            background: "oklch(0.09 0.025 280)",
            borderColor: "oklch(0.22 0.06 280 / 50%)",
          }}
          data-ocid="ai-chat.operator_panel"
        >
          <div className="flex flex-wrap gap-2">
            {[
              "How many trials this week?",
              "Show niche performance",
              "Check API health",
              "Lead quality by source",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setOperatorInput(chip)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: "oklch(0.18 0.08 290 / 60%)",
                  border: "1px solid oklch(0.40 0.14 290 / 50%)",
                  color: "oklch(0.72 0.14 290)",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
          {operatorHistory.length > 0 && (
            <div
              className="flex flex-col gap-2 max-h-48 overflow-y-auto"
              data-ocid="ai-chat.operator_history"
            >
              {operatorHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-purple-900/30 text-purple-100" : "bg-gray-800/50 text-gray-200"}`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          )}
          {pendingCommandResult && (
            <div
              className="rounded-xl border border-purple-500/40 p-3 flex flex-col gap-2"
              style={{ background: "oklch(0.14 0.08 290 / 40%)" }}
              data-ocid="ai-chat.operator_pending_command"
            >
              <p className="text-sm text-white">
                <span className="text-purple-300 font-semibold">Intent:</span>{" "}
                {pendingCommandResult.intent}.
                {Number(pendingCommandResult.affected_count) > 0 && (
                  <span className="text-gray-400 ml-1">
                    Affects {Number(pendingCommandResult.affected_count)}{" "}
                    records.
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="ai-chat.operator_confirm_button"
                  onClick={async () => {
                    if (!actor || !pendingCommandResult) return;
                    const opActor = actor as Record<string, unknown> & {
                      saveOperatorChatMessage: (
                        role: string,
                        content: string,
                        intent: [] | [string],
                      ) => Promise<void>;
                    };
                    await opActor
                      .saveOperatorChatMessage(
                        "user",
                        operatorInput,
                        pendingCommandResult?.intent
                          ? ([pendingCommandResult.intent] as [string])
                          : [],
                      )
                      .catch(() => {});
                    setOperatorHistory((prev) => [
                      ...prev,
                      {
                        id: `msg-${Date.now()}`,
                        content: operatorInput,
                        createdAt: BigInt(Date.now()),
                        role: "user",
                      },
                      {
                        id: `msg-${Date.now()}-r`,
                        content: `Done: ${pendingCommandResult.intent}`,
                        createdAt: BigInt(Date.now()),
                        role: "assistant",
                      },
                    ]);
                    setPendingCommandResult(null);
                    setOperatorInput("");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  data-ocid="ai-chat.operator_cancel_button"
                  onClick={() => setPendingCommandResult(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={operatorInput}
              onChange={(e) => setOperatorInput(e.target.value)}
              placeholder="Type an operator command..."
              data-ocid="ai-chat.operator_input"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{
                background: "oklch(0.12 0.03 280)",
                border: "1px solid oklch(0.28 0.08 290 / 60%)",
                color: "oklch(0.90 0.03 280)",
              }}
            />
            {typeof window !== "undefined" &&
              ("SpeechRecognition" in window ||
                "webkitSpeechRecognition" in window) && (
                <button
                  type="button"
                  data-ocid="ai-chat.operator_mic_button"
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const win = window as any;
                    const Ctor:
                      | (new () => {
                          continuous: boolean;
                          interimResults: boolean;
                          onresult: ((ev: unknown) => void) | null;
                          onerror: (() => void) | null;
                          onend: (() => void) | null;
                          start: () => void;
                        })
                      | undefined =
                      win.SpeechRecognition ?? win.webkitSpeechRecognition;
                    if (!Ctor) return;
                    if (isListening) {
                      setIsListening(false);
                      return;
                    }
                    const rec = new Ctor();
                    rec.continuous = false;
                    rec.interimResults = false;
                    rec.onresult = (ev: unknown) => {
                      const ev2 = ev as {
                        results: Array<Array<{ transcript: string }>>;
                      };
                      setOperatorInput(ev2.results[0]?.[0]?.transcript ?? "");
                      setIsListening(false);
                    };
                    rec.onerror = () => setIsListening(false);
                    rec.onend = () => setIsListening(false);
                    rec.start();
                    setIsListening(true);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${isListening ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                >
                  {isListening ? "Stop" : "Mic"}
                </button>
              )}
            <button
              type="button"
              data-ocid="ai-chat.operator_send_button"
              disabled={!operatorInput.trim()}
              onClick={async () => {
                const text = operatorInput.trim();
                if (!text || !actor) return;
                const opActor = actor as Record<string, unknown> & {
                  executeOperatorCommand: (cmd: string) => Promise<{
                    requires_confirmation: boolean;
                    intent: string;
                    affected_count: bigint;
                    recommended_actions: string[];
                    affected_niche: string;
                  }>;
                  saveOperatorChatMessage: (
                    role: string,
                    content: string,
                    intent: string,
                  ) => Promise<void>;
                };
                const result = await opActor
                  .executeOperatorCommand(text)
                  .catch(() => null);
                if (!result) return;
                if (result.requires_confirmation) {
                  setPendingCommandResult(result);
                } else {
                  await opActor
                    .saveOperatorChatMessage("user", text, result.intent)
                    .catch(() => {});
                  setOperatorHistory((prev) => [
                    ...prev,
                    {
                      id: `msg-${Date.now()}`,
                      content: text,
                      createdAt: BigInt(Date.now()),
                      role: "user",
                    },
                    {
                      id: `msg-${Date.now()}-r`,
                      content: result.intent,
                      createdAt: BigInt(Date.now()),
                      role: "assistant",
                    },
                  ]);
                  setOperatorInput("");
                }
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: "oklch(0.50 0.22 290)", color: "#fff" }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Page header */}
      <div
        className="px-6 py-4 border-b flex items-center gap-3"
        style={{
          background: "oklch(0.10 0.03 280)",
          borderColor: "oklch(0.22 0.06 280 / 60%)",
        }}
      >
        <h1
          className="font-black text-lg"
          style={{ color: "oklch(0.95 0.02 280)" }}
        >
          Admin AI Chat
        </h1>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: "oklch(0.22 0.10 290 / 60%)",
            color: "oklch(0.72 0.14 290)",
          }}
        >
          Configure BRF with plain English
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Chat panel (75%) ─────────────────────────────────────── */}
        <div
          className="flex flex-col flex-1"
          style={{
            background: "oklch(0.09 0.02 280)",
            borderRight: "1px solid oklch(0.20 0.05 280 / 50%)",
          }}
          data-ocid="ai-chat.panel"
        >
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg, idx) => (
              <div key={msg.id}>
                <MessageBubble msg={msg} onConfirm={handleConfirm} />
                {/* Suggestion chips below welcome message */}
                {idx === 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-start pl-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => void handleSend(s)}
                        data-ocid={`ai-chat.suggestion.${s.toLowerCase().replace(/\s+/g, "-")}`}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90"
                        style={{
                          background: "oklch(0.18 0.08 290 / 60%)",
                          border: "1px solid oklch(0.40 0.14 290 / 50%)",
                          color: "oklch(0.72 0.14 290)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div
                className="flex justify-start"
                data-ocid="ai-chat.loading_state"
              >
                <div
                  className="px-4 py-3 rounded-2xl text-sm"
                  style={{
                    background: "oklch(0.14 0.04 280)",
                    border: "1px solid oklch(0.28 0.06 280 / 60%)",
                    color: "oklch(0.55 0.04 280)",
                  }}
                >
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input row */}
          <div
            className="px-4 py-3 flex gap-2 items-center border-t"
            style={{
              background: "oklch(0.10 0.03 280)",
              borderColor: "oklch(0.20 0.05 280 / 50%)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to configure anything..."
              data-ocid="ai-chat.input"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{
                background: "oklch(0.12 0.03 280)",
                border: "1px solid oklch(0.28 0.08 290 / 60%)",
                color: "oklch(0.90 0.03 280)",
              }}
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!inputText.trim() || isSending}
              data-ocid="ai-chat.submit_button"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
              style={{
                background: "oklch(0.50 0.22 290)",
                color: "#fff",
              }}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>

        {/* ── Status panel (25%) ──────────────────────────────────── */}
        <div
          className="w-64 shrink-0 flex flex-col gap-5 px-4 py-5 overflow-y-auto"
          style={{ background: "oklch(0.10 0.03 280)" }}
          data-ocid="ai-chat.status_panel"
        >
          {/* Go Live Status */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.55 0.08 290)" }}
            >
              Go Live Status
            </h2>
            <div className="flex flex-col gap-1.5">
              {allIntegrationStatuses.map((i) => (
                <div
                  key={i.label}
                  className="flex items-start gap-2"
                  data-ocid={`ai-chat.status.${i.label.toLowerCase()}`}
                >
                  <div className="mt-0.5">
                    {i.active ? (
                      <CheckCircle
                        className="w-3.5 h-3.5"
                        style={{ color: "oklch(0.65 0.20 155)" }}
                      />
                    ) : (
                      <XCircle
                        className="w-3.5 h-3.5"
                        style={{ color: "oklch(0.55 0.22 20)" }}
                      />
                    )}
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      color: i.active
                        ? "oklch(0.78 0.10 155)"
                        : "oklch(0.60 0.08 20)",
                    }}
                  >
                    {i.label}
                  </span>
                  <StatusDot active={i.active} />
                </div>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div
            className="h-px w-full"
            style={{ background: "oklch(0.22 0.06 280 / 50%)" }}
          />

          {/* Recent Changes */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.55 0.08 290)" }}
            >
              Recent Changes
            </h2>
            {changeLog.length === 0 ? (
              <p
                className="text-xs"
                style={{ color: "oklch(0.40 0.04 280)" }}
                data-ocid="ai-chat.change_log.empty_state"
              >
                No changes yet. Confirm an assistant action to log it here.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {changeLog.map((entry, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static-length list, indices are deterministic
                    key={i}
                    className="flex flex-col gap-0.5 rounded-lg px-3 py-2"
                    style={{
                      background: "oklch(0.14 0.04 280 / 60%)",
                      border: "1px solid oklch(0.28 0.06 280 / 40%)",
                    }}
                    data-ocid={`ai-chat.change_log.item.${i + 1}`}
                  >
                    <p
                      className="text-xs font-medium leading-snug"
                      style={{ color: "oklch(0.82 0.04 280)" }}
                    >
                      {entry.description}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.45 0.04 280)" }}
                      >
                        {entry.timestamp}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "oklch(0.65 0.18 155)" }}
                      >
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
