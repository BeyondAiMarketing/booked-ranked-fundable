import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CollectionName, RAGQueryResult } from "@/types/ragBrain";
import { ALL_COLLECTIONS } from "@/types/ragBrain";
import { AlertTriangle, Brain, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Thinking Indicator ────────────────────────────────────────────────────────

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[oklch(var(--ai-cyan))] opacity-70"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <span className="text-xs text-foreground/50 italic">
        Neural network thinking…
      </span>
    </div>
  );
}

// ── Citation Chip ─────────────────────────────────────────────────────────────

function CitationChip({ citation }: { citation: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
        bg-[oklch(var(--ai-indigo-deep)/0.3)] border border-[oklch(var(--ai-cyan)/0.3)]
        text-[oklch(var(--ai-cyan))] font-mono"
    >
      {citation}
    </span>
  );
}

// ── Answer Block ──────────────────────────────────────────────────────────────

function AnswerBlock({ result }: { result: RAGQueryResult }) {
  if (result.isInsufficient) {
    return (
      <div
        className="flex gap-3 p-4 rounded-xl
          bg-amber-500/10 border border-amber-500/30"
        data-ocid="rag_query.insufficient_state"
      >
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-300 mb-1">
            Insufficient Context
          </p>
          <p className="text-sm text-amber-200/80">
            {result.insufficiencyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="p-4 rounded-xl bg-white/5 border border-white/10"
        data-ocid="rag_query.answer"
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-[oklch(var(--ai-cyan))]" />
          <span className="text-xs font-semibold text-[oklch(var(--ai-cyan))] uppercase tracking-wide">
            AI Response
          </span>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {result.answer}
        </p>
      </div>

      {result.citations.length > 0 && (
        <div>
          <p className="text-xs text-foreground/40 mb-1.5">Sources</p>
          <div className="flex flex-wrap gap-1.5">
            {result.citations.map((c) => (
              <CitationChip key={c} citation={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── RAGQueryPanel ─────────────────────────────────────────────────────────────

interface RAGQueryPanelProps {
  onQuery: (
    question: string,
    collection: CollectionName,
  ) => Promise<RAGQueryResult | null>;
  isLoading?: boolean;
  defaultCollection?: CollectionName;
  placeholder?: string;
  className?: string;
}

export function RAGQueryPanel({
  onQuery,
  isLoading = false,
  defaultCollection = "SalesScripts",
  placeholder = "Ask the knowledge base anything…",
  className = "",
}: RAGQueryPanelProps) {
  const [question, setQuestion] = useState("");
  const [collection, setCollection] =
    useState<CollectionName>(defaultCollection);
  const [result, setResult] = useState<RAGQueryResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  async function handleSubmit() {
    if (!question.trim() || isLoading) return;
    const res = await onQuery(question.trim(), collection);
    if (res) setResult(res);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-2xl
        bg-white/5 border border-white/10 backdrop-blur-sm ${className}`}
      data-ocid="rag_query.panel"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[oklch(var(--ai-cyan))]" />
        <span className="text-sm font-semibold text-foreground/80">
          Ask the Knowledge Base
        </span>
      </div>

      {/* Collection selector */}
      <Select
        value={collection}
        onValueChange={(v) => setCollection(v as CollectionName)}
      >
        <SelectTrigger
          className="bg-white/5 border-white/10 text-foreground/80 text-sm h-9"
          data-ocid="rag_query.collection_select"
        >
          <SelectValue placeholder="Select collection" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {ALL_COLLECTIONS.map((col) => (
            <SelectItem key={col} value={col} className="text-sm">
              {col.replace(/([A-Z])/g, " $1").trim()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Input */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="resize-none bg-white/5 border-white/10 text-foreground placeholder:text-foreground/30
            focus:border-[oklch(var(--ai-cyan)/0.6)] focus:ring-0 pr-12 text-sm"
          disabled={isLoading}
          data-ocid="rag_query.input"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute bottom-2 right-2 w-8 h-8 text-[oklch(var(--ai-cyan))]
            hover:bg-[oklch(var(--ai-cyan)/0.15)] disabled:opacity-30"
          onClick={handleSubmit}
          disabled={!question.trim() || isLoading}
          aria-label="Send query"
          data-ocid="rag_query.submit_button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-foreground/30">⌘ Enter to submit</p>

      {/* Results */}
      {isLoading && <ThinkingIndicator />}
      {!isLoading && result && <AnswerBlock result={result} />}
    </div>
  );
}
