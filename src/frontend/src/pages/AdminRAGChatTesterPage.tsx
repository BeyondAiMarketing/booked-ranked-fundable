import { RAGQueryPanel } from "@/components/RAGQueryPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRagBrain } from "@/hooks/useRagBrain";
import {
  type AIUsageLog,
  ALL_COLLECTIONS,
  type CollectionName,
  type RAGQueryResult,
} from "@/types/ragBrain";
import { FlaskConical, Loader2, RefreshCw, TestTube } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AdminRAGChatTesterPage() {
  const { queryRAG, getUsageLogs, isLoading } = useRagBrain();
  const [selectedCollection, setSelectedCollection] = useState<
    CollectionName | ""
  >("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<RAGQueryResult | null>(null);
  const [usageLogs, setUsageLogs] = useState<AIUsageLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    const logs = await getUsageLogs();
    if (logs) setUsageLogs(logs.slice(0, 20));
    setLoadingLogs(false);
  }, [getUsageLogs]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleQuery = async () => {
    if (!selectedCollection || !question.trim()) return;
    const res = await queryRAG(question, selectedCollection as CollectionName);
    if (res) setResult(res);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.48 0.2 260 / 30%), oklch(0.62 0.2 200 / 20%))",
            boxShadow: "0 0 20px oklch(0.62 0.2 200 / 30%)",
          }}
        >
          <TestTube className="h-5 w-5 text-[oklch(0.62_0.2_200)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            RAG Chat Tester
          </h1>
          <p className="text-sm text-muted-foreground">
            Test knowledge retrieval across your collections
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Query Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            className="border border-border/60 bg-card/80 p-5 backdrop-blur-sm"
            data-ocid="rag-tester.query_panel"
          >
            <div className="mb-4 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-[oklch(0.62_0.2_200)]" />
              <h2 className="font-semibold text-foreground">Query Interface</h2>
            </div>
            <RAGQueryPanel
              result={result}
              isLoading={isLoading}
              selectedCollection={selectedCollection}
              question={question}
              onQuestionChange={setQuestion}
              onCollectionChange={(v) => setSelectedCollection(v)}
              collections={ALL_COLLECTIONS}
              onSubmit={handleQuery}
            />
          </Card>
        </div>

        {/* Usage Logs */}
        <div className="space-y-4">
          <Card
            className="border border-border/60 bg-card/80 p-5 backdrop-blur-sm"
            data-ocid="rag-tester.usage_log_panel"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Usage Log
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadLogs}
                disabled={loadingLogs}
                className="h-7 px-2"
                data-ocid="rag-tester.refresh_logs_button"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            {loadingLogs ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {usageLogs.length === 0 && (
                    <p
                      className="py-6 text-center text-xs text-muted-foreground"
                      data-ocid="rag-tester.logs_empty_state"
                    >
                      No usage logs yet
                    </p>
                  )}
                  {usageLogs.map((log, i) => (
                    <div
                      key={log.id}
                      className="rounded-lg border border-border/40 bg-muted/30 p-3"
                      data-ocid={`rag-tester.log.item.${i + 1}`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-1">
                        <Badge variant="outline" className="text-xs">
                          {log.provider}
                        </Badge>
                        <span
                          className={`text-xs font-medium ${
                            log.success ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {log.success ? "OK" : "ERR"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{log.taskCategory}</span>
                        <span>
                          {log.inputTokens + (log.outputTokens ?? 0)} tok
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
