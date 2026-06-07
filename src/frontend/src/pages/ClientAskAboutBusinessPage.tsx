import { Bot, Info, Mic, Send, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { useRagBrain } from "../hooks/useRagBrain";
import type { CollectionName, ConversationMessage } from "../types/ragBrain";

const BUSINESS_COLLECTIONS: CollectionName[] = [
  "SalesScripts",
  "FundingPlaybooks",
  "ReviewResponses",
  "ObjectionHandlers",
  "PricingGuides",
];

const QUICK_QUESTIONS = [
  "What's my funding readiness?",
  "How do I respond to negative reviews?",
  "What follow-up should I send to leads?",
  "What pricing strategy fits my niche?",
  "How can I improve my Google rankings?",
];

const SESSION_ID = `ask-about-business-${Date.now()}`;
type ChatMsg = ConversationMessage;

export default function ClientAskAboutBusinessPage() {
  const { queryRAG, getConversationHistory, addMessage, isLoading } =
    useRagBrain();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
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

  const handleSend = useCallback(
    async (question: string = input) => {
      const q = question.trim();
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
      const collection =
        BUSINESS_COLLECTIONS[messages.length % BUSINESS_COLLECTIONS.length];
      const result = await queryRAG(q, collection);
      const assistantContent = result
        ? result.isInsufficient
          ? result.insufficiencyMessage ||
            "I need more context about your business to answer this accurately."
          : result.answer
        : "Connection issue — please try again shortly.";
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
    },
    [input, isLoading, queryRAG, addMessage, messages.length],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      data-ocid="ask-business.page"
      className="min-h-screen bg-background flex flex-col"
    >
      <div className="bg-card border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.55_0.2_270/0.15)] border border-[oklch(0.55_0.2_270/0.3)] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[oklch(0.72_0.18_270)]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Ask About My Business
              </h1>
              <p className="text-xs text-muted-foreground">
                AI recommendations tailored to your business
              </p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[oklch(0.62_0.2_200/0.12)] border border-[oklch(0.62_0.2_200/0.25)] text-[oklch(0.72_0.2_200)]">
                <Zap className="w-3 h-3" />
                Powered by your knowledge base
              </span>
            </div>
          </div>
          {messages.length === 0 && (
            <div
              data-ocid="ask-business.quick_questions"
              className="flex flex-wrap gap-2"
            >
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  data-ocid="ask-business.quick_question.button"
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/40 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div
              data-ocid="ask-business.empty_state"
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-[oklch(0.55_0.2_270/0.12)] border border-[oklch(0.55_0.2_270/0.25)] flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-[oklch(0.7_0.18_270)]" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Your Personal Business Advisor
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Ask about funding, reviews, lead follow-up, or pricing. Tap a
                quick question above to start.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "User" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "Assistant" && (
                <div className="w-8 h-8 rounded-lg bg-[oklch(0.55_0.2_270/0.15)] border border-[oklch(0.55_0.2_270/0.3)] flex items-center justify-center mr-3 mt-1 shrink-0">
                  <Bot className="w-4 h-4 text-[oklch(0.7_0.18_270)]" />
                </div>
              )}
              <div className="max-w-[78%] min-w-0">
                {msg.role === "Assistant" &&
                  msg.content.includes("need more context") && (
                    <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[oklch(0.72_0.18_75/0.12)] border border-[oklch(0.72_0.18_75/0.3)] text-xs text-[oklch(0.82_0.16_75)]">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      Add more documents to improve answers
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
              data-ocid="ask-business.loading_state"
              className="flex justify-start"
            >
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.55_0.2_270/0.15)] border border-[oklch(0.55_0.2_270/0.3)] flex items-center justify-center mr-3 mt-1 shrink-0">
                <Bot className="w-4 h-4 text-[oklch(0.7_0.18_270)] animate-pulse" />
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
              data-ocid="ask-business.input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your business…"
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
                data-ocid="ask-business.submit_button"
                type="button"
                size="sm"
                disabled={!input.trim() || isLoading}
                onClick={() => handleSend()}
                className="w-8 h-8 p-0 rounded-lg bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
