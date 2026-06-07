import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CollectionName, RAGQueryResult } from "@/types/ragBrain";
import { AlertTriangle, BookOpen, CheckCircle2, Loader2 } from "lucide-react";

interface RAGQueryPanelProps {
  result: RAGQueryResult | null;
  isLoading: boolean;
  selectedCollection: CollectionName | "";
  question: string;
  onQuestionChange: (v: string) => void;
  onCollectionChange: (v: CollectionName) => void;
  collections: CollectionName[];
  onSubmit: () => void;
}

export function RAGQueryPanel({
  result,
  isLoading,
  selectedCollection,
  question,
  onQuestionChange,
  onCollectionChange,
  collections,
  onSubmit,
}: RAGQueryPanelProps) {
  return (
    <div className="space-y-4">
      {/* Input row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedCollection}
          onChange={(e) => onCollectionChange(e.target.value as CollectionName)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-48"
          data-ocid="rag.collection_select"
        >
          <option value="">Select collection</option>
          {collections.map((c) => (
            <option key={c} value={c}>
              {c.replace(/([A-Z])/g, " $1").trim()}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="Ask a question about your knowledge base..."
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          data-ocid="rag.question_input"
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading || !question.trim() || !selectedCollection}
          className="shrink-0"
          data-ocid="rag.submit_button"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Query"}
        </Button>
      </div>

      {/* Result area */}
      {result && (
        <div className="space-y-3">
          {result.isInsufficient ? (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-300">
                  Insufficient Context
                </p>
                <p className="mt-1 text-sm text-amber-400/80">
                  {result.insufficiencyMessage ||
                    "Not enough relevant documents found. Upload more content to this collection."}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                  Answer
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {result.answer}
              </p>
            </div>
          )}

          {result.chunks.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Retrieved Chunks ({result.chunks.length})
                </span>
              </div>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {result.chunks.map((chunk, i) => (
                    <div
                      key={chunk.id}
                      className="rounded-lg border border-border/50 bg-muted/30 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Chunk #{i + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          idx {String(chunk.chunkIndex)}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-xs text-muted-foreground">
                        {chunk.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {result.citations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Sources:</span>
              {result.citations.map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="border-primary/30 bg-primary/10 text-xs text-primary"
                >
                  {c}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
