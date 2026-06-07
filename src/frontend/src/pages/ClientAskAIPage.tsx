import { Bot, ChevronDown, Info, Mic, Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { useRagBrain } from "../hooks/useRagBrain";
import type { CollectionName, ConversationMessage } from "../types/ragBrain";
import { ALL_COLLECTIONS } from "../types/ragBrain";

const COLLECTION_LABELS: Record<CollectionName, string> = {
  SalesScripts: "Sales Scripts",
  FundingPlaybooks: "Funding Playbooks",
  NicheTemplates: "Niche Templates",
  ClientContracts: "Client Contracts",
  CallTranscripts: "Call Transcripts",
  ReviewResponses: "Review Responses",
  OnboardingGuides: "Onboarding Guides",
  CompetitorIntel: "Competitor Intelligence",
  PricingGuides: "Pricing Guides",
  ObjectionHandlers: "Objection Handlers",
  CaseStudies: "Case Studies",
  EmailSequences: "Email Sequences",
  SocialContent: "Social Content",
  SopLibrary: "SOP Library",
  Custom: "Custom",
};

const SESSION_ID = `client-ask-ai-${Date.now()}`;
type ChatMsg = ConversationMessage;

export default function ClientAskAIPage() {
  const { queryRAG, getConversationHistory, addMessage, isLoading } =
    useRagBrain();
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionName>("SalesScripts");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional load-on-mount
  useEffect(() => {
    getConversationHistory(SESSION_ID).then((msgs) => {
      if (msgs && msgs.length > 0) setMessages(msgs);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll-on-messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || isLoading) return;
    setInput("");
    const userMsg: ChatMsg = {
      id: `u-${Date.now()}`,
      role: "User",
      content: q,
      citations: [],
      tenantId: "client",
      sessionId: SESSION_ID,
      timestamp: BigInt(Date.now()),
    };
    setMessages((prev) => [...prev, userMsg]);
    await addMessage(SESSION_ID, "User", q);
    const result = await queryRAG(q, selectedCollection);
    const assistantContent = result
      ? result.isInsufficient
        ? result.insufficiencyMessage || "Not enough info in this collection."
        : result.answer
      : "Connection issue — please try again.";
    const aiMsg: ChatMsg = {
      id: `a-${Date.now()}`,
      role: "Assistant",
      content: assistantContent,
      citations: result?.citations ?? [],
      tenantId: "client",
      sessionId: SESSION_ID,
      timestamp: BigInt(Date.now()),
    };
    setMessages((prev) => [...prev, aiMsg]);
    await addMessage(SESSION_ID, "Assistant", assistantContent);
  }, [input, isLoading, queryRAG, selectedCollection, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      data-ocid="ask-ai.page"
      className="min-h-screen bg-background flex flex-col"
    >
      <div className="bg-card border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[oklch(0.75_0.2_200)]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Ask AI</h1>
              <p className="text-xs text-muted-foreground">
                Query your knowledge base
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              data-ocid="ask-ai.collection.select"
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:bg-accent transition-colors"
            >
              <span className="text-xs font-medium text-primary">
                {COLLECTION_LABELS[selectedCollection]}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {showPicker && (
              <div
                data-ocid="ask-ai.collection.dropdown_menu"
                className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-popover border border-border shadow-xl z-50 py-1 max-h-72 overflow-y-auto"
              >
                {ALL_COLLECTIONS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      setSelectedCollection(col);
                      setShowPicker(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${
                      col === selectedCollection
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {COLLECTION_LABELS[col]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div data-ocid="ask-ai.empty_state" className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-[oklch(0.62_0.2_200/0.12)] border border-[oklch(0.62_0.2_200/0.25)] flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-[oklch(0.72_0.2_200)]" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                What would you like to know?
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Ask anything about your selected knowledge collection. The AI
                will find relevant answers and cite its sources.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "User" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "Assistant" && (
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center mr-3 mt-1 shrink-0">
                  <Sparkles className="w-4 h-4 text-[oklch(0.75_0.2_200)]" />
                </div>
              )}
              <div className="max-w-[78%] min-w-0">
                {msg.role === "Assistant" &&
                  msg.content.includes("Not enough info") && (
                    <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[oklch(0.72_0.18_75/0.12)] border border-[oklch(0.72_0.18_75/0.3)] text-xs text-[oklch(0.82_0.16_75)]">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      Not enough info in this collection
                    </div>
                  )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "User"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {msg.citations.map((cit, i) => (
                      <span
                        key={cit || i}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-[oklch(0.55_0.2_270/0.15)] text-[oklch(0.7_0.18_270)] border-[oklch(0.55_0.2_270/0.3)]"
                      >
                        {cit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div
              data-ocid="ask-ai.loading_state"
              className="flex justify-start"
            >
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.62_0.2_200/0.15)] border border-[oklch(0.62_0.2_200/0.3)] flex items-center justify-center mr-3 mt-1 shrink-0">
                <Sparkles className="w-4 h-4 text-[oklch(0.75_0.2_200)] animate-pulse" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="bg-card border-t border-border px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 bg-background border border-border rounded-2xl px-4 py-3 focus-within:border-primary transition-colors">
            <textarea
              data-ocid="ask-ai.input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${COLLECTION_LABELS[selectedCollection]}…`}
              className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground resize-none outline-none min-w-0 max-h-32"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label="Voice input"
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>
              <Button
                data-ocid="ask-ai.submit_button"
                type="button"
                size="sm"
                disabled={!input.trim() || isLoading}
                onClick={handleSend}
                className="w-8 h-8 p-0 rounded-lg bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Querying:{" "}
            <span className="text-primary font-medium">
              {COLLECTION_LABELS[selectedCollection]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
