import {
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ClientWebsiteConfig } from "../data/nicheWebsiteData";
import type {
  AgentMessage,
  AuditScore,
  FrameworkName,
  ProactiveSuggestion,
  WebsiteAgentVariant,
} from "../lib/websiteAgentEngine";
import {
  generateProactiveSuggestions,
  processAgentRequest,
  updateMemoryWithChange,
} from "../lib/websiteAgentEngine";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// ── Framework badge colors ───────────────────────────────────────────────────

const FRAMEWORK_COLORS: Record<FrameworkName, string> = {
  Hormozi: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Kennedy: "bg-red-500/20 text-red-300 border-red-500/30",
  Ogilvy: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Halbert: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Schwartz: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Abraham: "bg-green-500/20 text-green-300 border-green-500/30",
  Sugarman: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Hopkins: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Deiss: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Suby: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

// ── Variant Card ─────────────────────────────────────────────────────────────

function VariantCard({
  variant,
  onApply,
  isApplied,
}: {
  variant: WebsiteAgentVariant;
  onApply: (v: WebsiteAgentVariant) => void;
  isApplied: boolean;
}) {
  return (
    <div
      className={`flex-shrink-0 w-64 rounded-xl border p-3 space-y-2 transition-all ${
        isApplied
          ? "border-violet-500/50 bg-violet-500/10"
          : "border-white/10 bg-white/5 hover:border-white/20"
      }`}
      data-ocid={`website_agent.variant_card.${variant.variantNumber}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Option {variant.variantNumber}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${FRAMEWORK_COLORS[variant.framework]}`}
        >
          {variant.framework}
        </span>
      </div>
      <p className="text-xs text-foreground/90 line-clamp-3 leading-relaxed">
        &ldquo;{variant.previewText}&rdquo;
      </p>
      <p className="text-[10px] text-muted-foreground leading-tight">
        {variant.reasoning}
      </p>
      <Button
        size="sm"
        variant={isApplied ? "default" : "outline"}
        className="w-full h-7 text-xs"
        onClick={() => onApply(variant)}
        data-ocid={`website_agent.apply_variant_button.${variant.variantNumber}`}
      >
        {isApplied ? (
          <>
            <Check size={11} className="mr-1" /> Applied
          </>
        ) : (
          "Apply This"
        )}
      </Button>
    </div>
  );
}

// ── Proactive Suggestion Card ────────────────────────────────────────────────

function SuggestionCard({
  suggestion,
  onApply,
  onDismiss,
}: {
  suggestion: ProactiveSuggestion;
  onApply: (s: ProactiveSuggestion) => void;
  onDismiss: (id: string) => void;
}) {
  const priorityColor =
    suggestion.priority_level === "high"
      ? "border-red-500/30 bg-red-500/5"
      : suggestion.priority_level === "medium"
        ? "border-amber-500/30 bg-amber-500/5"
        : "border-blue-500/30 bg-blue-500/5";

  return (
    <div
      className={`rounded-xl border p-3 space-y-2 ${priorityColor}`}
      data-ocid={`website_agent.suggestion_card.${suggestion.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Zap
            size={12}
            className={
              suggestion.priority_level === "high"
                ? "text-red-400"
                : "text-amber-400"
            }
          />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {suggestion.priority_level === "high"
              ? "High Impact"
              : "Suggestion"}
          </span>
        </div>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${FRAMEWORK_COLORS[suggestion.framework]}`}
        >
          {suggestion.framework}
        </span>
      </div>
      <p className="text-xs text-foreground/90 leading-relaxed">
        {suggestion.issue}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        💡 {suggestion.action}
      </p>
      <p className="text-[10px] text-green-400">
        📈 {suggestion.estimatedImpact}
      </p>
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={() => onApply(suggestion)}
          data-ocid="website_agent.suggestion_apply_button"
        >
          Apply Suggestion
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => onDismiss(suggestion.id)}
          data-ocid="website_agent.suggestion_dismiss_button"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

// ── Chat Message ─────────────────────────────────────────────────────────────

function ChatMessage({
  message,
  onApplyVariant,
  appliedVariantId,
  onUndo,
  showUndo,
}: {
  message: AgentMessage;
  onApplyVariant: (v: WebsiteAgentVariant) => void;
  appliedVariantId?: string;
  onUndo: () => void;
  showUndo: boolean;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -280, behavior: "smooth" });
  };
  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 280, behavior: "smooth" });
  };

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-violet-600/80 text-white px-3 py-2 text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Agent bubble */}
      <div className="flex gap-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mt-0.5">
          <Brain size={12} className="text-white" />
        </div>
        <div className="flex-1 rounded-2xl rounded-tl-sm border border-violet-500/20 bg-card/80 px-3 py-2 text-sm text-foreground/90 leading-relaxed min-w-0">
          {message.content}
          {appliedVariantId && showUndo && (
            <button
              type="button"
              onClick={onUndo}
              className="ml-2 inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 transition-colors"
              data-ocid="website_agent.undo_button"
            >
              <RotateCcw size={10} /> Undo
            </button>
          )}
        </div>
      </div>

      {/* Variant carousel */}
      {message.variants && message.variants.length > 0 && (
        <div className="pl-8 relative">
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {message.variants.map((v) => (
              <VariantCard
                key={v.id}
                variant={v}
                onApply={onApplyVariant}
                isApplied={appliedVariantId === v.id}
              />
            ))}
          </div>
          {message.variants.length > 1 && (
            <div className="flex gap-1 mt-2 justify-end">
              <button
                type="button"
                onClick={scrollLeft}
                className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                data-ocid="website_agent.carousel_prev"
              >
                <ChevronLeft size={12} className="text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                data-ocid="website_agent.carousel_next"
              >
                <ChevronRight size={12} className="text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  websiteConfig: ClientWebsiteConfig;
  niche: string;
  auditScore: AuditScore | null;
  onApplyChange: (sectionId: string, content: Record<string, string>) => void;
  /** Multi-page: which page is currently being edited */
  currentPage?: string;
  /** Pre-load this message as the first user message when the panel opens (from score badge click) */
  initialMessage?: string;
}

// ── Main Panel ────────────────────────────────────────────────────────────────

export default function WebsiteAgentChatPanel({
  isOpen,
  onClose,
  clientId,
  websiteConfig,
  niche,
  auditScore,
  onApplyChange,
  currentPage: _currentPage = "home",
  initialMessage,
}: Props) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedVariants, setAppliedVariants] = useState<
    Record<string, { sectionId: string; prevContent: Record<string, string> }>
  >({});
  const [undoTimers, setUndoTimers] = useState<Record<string, boolean>>({});
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>(
    [],
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Reset initialized state when panel closes so next open gets fresh messages
  useEffect(() => {
    if (!isOpen) {
      initializedRef.current = false;
    }
  }, [isOpen]);

  // Generate proactive suggestions once when panel first opens
  // If initialMessage is provided (from badge click), pre-load it as first user message
  useEffect(() => {
    if (!isOpen || initializedRef.current) return;
    initializedRef.current = true;

    if (initialMessage) {
      // Pre-load the badge suggestion as the first user turn + trigger agent response
      const userMsg: AgentMessage = {
        id: `msg-badge-${Date.now()}`,
        role: "user",
        content: initialMessage,
        timestamp: Date.now(),
      };
      setMessages([userMsg]);
      return;
    }

    const suggestions = generateProactiveSuggestions(
      websiteConfig,
      auditScore,
      niche,
    ).filter((s) => !dismissedSuggestions.includes(s.id));
    if (suggestions.length > 0) {
      setMessages([
        {
          id: `msg-greeting-${Date.now()}`,
          role: "agent",
          content:
            "👋 Hey! I've analyzed your website and found a few high-impact improvements. I've built each suggestion using proven direct-response frameworks. Apply any of these or just ask me anything.",
          suggestions,
          timestamp: Date.now(),
        },
      ]);
    } else {
      setMessages([
        {
          id: `msg-greeting-${Date.now()}`,
          role: "agent",
          content:
            "👋 Hey! Your website is looking solid. Ask me to improve any section — headlines, CTAs, trust signals, services copy — and I'll generate 3 framework-based options for you to choose from.",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [
    isOpen,
    initialMessage,
    websiteConfig,
    auditScore,
    niche,
    dismissedSuggestions,
  ]);

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    const userMsg: AgentMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const result = processAgentRequest(
        userMsg.content,
        websiteConfig,
        auditScore,
        niche,
        clientId,
      );
      const agentMsg: AgentMessage = {
        id: `msg-agent-${Date.now()}`,
        role: "agent",
        content: result.responseText ?? result.message,
        variants: result.variants,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsLoading(false);
    }, 900);
  };

  const handleApplyVariant = (
    variant: WebsiteAgentVariant,
    messageId: string,
  ) => {
    // Store previous content for undo
    const prevContent =
      websiteConfig.customizations.sectionOverrides[variant.sectionId] ?? {};
    setAppliedVariants((prev) => ({
      ...prev,
      [messageId]: { sectionId: variant.sectionId, prevContent },
    }));

    onApplyChange(variant.sectionId, variant.content);
    updateMemoryWithChange(clientId, variant.sectionId, variant.fieldKey);

    // Update message to show applied state
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, appliedVariantId: variant.id } : m,
      ),
    );

    // Add confirmation message
    const confirmMsg: AgentMessage = {
      id: `msg-confirm-${Date.now()}`,
      role: "agent",
      content: `✅ Applied! The ${variant.framework} framework copy is now live in your preview. You have 10 seconds to undo if you'd like to try a different option.`,
      timestamp: Date.now(),
      appliedVariantId: variant.id,
    };
    setMessages((prev) => [...prev, confirmMsg]);

    // Show undo for 10 seconds
    setUndoTimers((prev) => ({ ...prev, [confirmMsg.id]: true }));
    setTimeout(() => {
      setUndoTimers((prev) => ({ ...prev, [confirmMsg.id]: false }));
    }, 10000);
  };

  const handleUndo = (messageId: string) => {
    const record = appliedVariants[messageId];
    if (!record) return;
    onApplyChange(record.sectionId, record.prevContent);
    setUndoTimers((prev) => ({ ...prev, [messageId]: false }));
    const undoMsg: AgentMessage = {
      id: `msg-undo-${Date.now()}`,
      role: "agent",
      content:
        "↩️ Change undone. Your original copy is restored. Pick another option or ask me something else.",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, undoMsg]);
  };

  const handleApplySuggestion = (suggestion: ProactiveSuggestion) => {
    const userMsg: AgentMessage = {
      id: `msg-user-sugg-${Date.now()}`,
      role: "user",
      content: suggestion.action,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    setTimeout(() => {
      const result = processAgentRequest(
        suggestion.action,
        websiteConfig,
        auditScore,
        niche,
        clientId,
      );
      const agentMsg: AgentMessage = {
        id: `msg-agent-sugg-${Date.now()}`,
        role: "agent",
        content: result.responseText ?? result.message,
        variants: result.variants,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsLoading(false);
    }, 900);
  };

  const handleDismissSuggestion = (id: string) => {
    setDismissedSuggestions((prev) => [...prev, id]);
    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        suggestions: m.suggestions?.filter((s) => s.id !== id),
      })),
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close agent panel"
      />

      {/* Panel */}
      <div
        className="fixed bottom-0 right-0 z-50 flex flex-col bg-card border-t lg:border-t-0 lg:border-l border-white/10 shadow-2xl
          w-full h-[65vh] lg:w-[380px] lg:h-[calc(100vh-64px)] lg:top-16 lg:bottom-auto"
        data-ocid="website_agent.panel"
      >
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-violet-900/40 to-indigo-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground leading-none">
                Website Agent
              </p>
              <p className="text-[10px] text-violet-400 leading-none mt-0.5">
                Powered by 10 marketing frameworks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            data-ocid="website_agent.close_button"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        {/* Framework pills */}
        <div
          className="flex-shrink-0 px-3 py-2 flex gap-1.5 overflow-x-auto border-b border-white/5"
          style={{ scrollbarWidth: "none" }}
        >
          {(
            [
              "Hormozi",
              "Kennedy",
              "Ogilvy",
              "Halbert",
              "Schwartz",
            ] as FrameworkName[]
          ).map((f) => (
            <Badge
              key={f}
              variant="outline"
              className={`text-[9px] flex-shrink-0 border ${FRAMEWORK_COLORS[f]}`}
            >
              {f}
            </Badge>
          ))}
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-3 py-4 space-y-4 min-h-0"
          data-ocid="website_agent.messages_list"
        >
          {messages.map((message) => {
            if (
              message.role === "agent" &&
              message.suggestions &&
              message.suggestions.length > 0
            ) {
              return (
                <div key={message.id} className="space-y-3">
                  <ChatMessage
                    message={{ ...message, suggestions: undefined }}
                    onApplyVariant={(v) => handleApplyVariant(v, message.id)}
                    appliedVariantId={message.appliedVariantId}
                    onUndo={() => handleUndo(message.id)}
                    showUndo={undoTimers[message.id] ?? false}
                  />
                  {message.suggestions.map((s) => (
                    <SuggestionCard
                      key={s.id}
                      suggestion={s}
                      onApply={handleApplySuggestion}
                      onDismiss={handleDismissSuggestion}
                    />
                  ))}
                </div>
              );
            }
            return (
              <ChatMessage
                key={message.id}
                message={message}
                onApplyVariant={(v) => handleApplyVariant(v, message.id)}
                appliedVariantId={message.appliedVariantId}
                onUndo={() => handleUndo(message.id)}
                showUndo={undoTimers[message.id] ?? false}
              />
            );
          })}

          {isLoading && (
            <div className="flex gap-2" data-ocid="website_agent.loading_state">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
                <Brain size={12} className="text-white" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl border border-violet-500/20 bg-card/80 px-3 py-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-3 border-t border-white/10 bg-card/60">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="e.g. Make the headline more urgent…"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                disabled={isLoading}
                data-ocid="website_agent.chat_input"
              />
            </div>
            <Button
              size="sm"
              className="h-9 w-9 p-0 flex-shrink-0 bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600"
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              data-ocid="website_agent.send_button"
            >
              <Send size={14} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {["Improve the headline", "Stronger CTA", "Add trust signals"].map(
              (q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setInputValue(q)}
                  className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground hover:border-violet-500/30 hover:text-violet-400 transition-colors"
                  data-ocid="website_agent.quick_action_button"
                >
                  {q}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Export for use in ClientMyWebsitePage
export { generateProactiveSuggestions };
export type { AuditScore };
