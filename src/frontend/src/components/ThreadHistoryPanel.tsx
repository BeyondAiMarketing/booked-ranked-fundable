import { Link } from "@tanstack/react-router";
import { Clock, ExternalLink, FileText, History, Play, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import ArtifactTypeIcon from "./ArtifactTypeIcon";
import RunStatusBadge from "./RunStatusBadge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface Props {
  agentType: string;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function ThreadHistoryPanel({ agentType }: Props) {
  const [open, setOpen] = useState(false);
  const {
    currentTenantId,
    getThreadForAgent,
    getRunsForThread,
    getArtifactsForThread,
    startRun,
    completeRun,
    tenants,
  } = useApp();

  const thread = getThreadForAgent(currentTenantId, agentType);
  const runs = thread ? getRunsForThread(thread.id).slice(0, 5) : [];
  const artifacts = thread ? getArtifactsForThread(thread.id).slice(0, 3) : [];
  const tenant = tenants.find((t) => t.id === currentTenantId);

  const handleStartRun = () => {
    const targetThread = thread;
    if (!targetThread) {
      toast.error("No active thread found for this agent.");
      return;
    }
    const run = startRun(
      targetThread.id,
      currentTenantId,
      agentType,
      "Manual run triggered from workspace panel",
    );
    toast.success("Run started", { description: run.id });
    setTimeout(() => {
      completeRun(
        run.id,
        "Demo run completed successfully. No real AI execution in demo mode.",
        [],
      );
      toast.success("Run completed");
    }, 2500);
  };

  return (
    <>
      {/* Toggle button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        data-ocid="thread_history.open_button"
        className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
      >
        <History size={14} />
        Thread History
      </Button>

      {/* Slide-over panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close panel"
            className="absolute inset-0 bg-black/50 w-full h-full border-0 cursor-default"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border-l border-slate-700 flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Thread History
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{agentType}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-5">
                {thread ? (
                  <>
                    {/* Thread summary */}
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Active Thread
                      </p>
                      <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs font-medium text-white mb-1">
                          {thread.title}
                        </p>
                        {thread.summary && (
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                            {thread.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Clock size={10} className="text-slate-500" />
                          <span className="text-[10px] text-slate-500">
                            Updated {timeAgo(thread.updatedAt)}
                          </span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className="text-[10px] text-slate-500">
                            {thread.messageCount} messages
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Last runs */}
                    {runs.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Recent Runs
                        </p>
                        <div className="space-y-2">
                          {runs.map((run) => (
                            <div
                              key={run.id}
                              className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50"
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <RunStatusBadge status={run.status} size="sm" />
                                <span className="text-[10px] text-slate-500 shrink-0">
                                  {timeAgo(run.startedAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 line-clamp-2">
                                {run.inputPrompt}
                              </p>
                              {run.outputText && (
                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                                  {run.outputText}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Artifacts */}
                    {artifacts.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Recent Artifacts
                        </p>
                        <div className="space-y-2">
                          {artifacts.map((art) => (
                            <div
                              key={art.id}
                              className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50 flex items-center gap-2.5"
                            >
                              <ArtifactTypeIcon
                                artifactType={art.artifactType}
                                size={13}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">
                                  {art.title}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  {art.artifactType.replace(/_/g, " ")} ·{" "}
                                  {timeAgo(art.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <FileText
                      size={32}
                      className="text-slate-600 mx-auto mb-3"
                    />
                    <p className="text-sm text-slate-400">No thread found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Start a run to create the first thread for{" "}
                      {tenant?.name ?? "this client"}.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer actions */}
            <div className="p-4 border-t border-slate-700 space-y-2">
              <Button
                size="sm"
                onClick={handleStartRun}
                disabled={!thread}
                data-ocid="thread_history.start_run_button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              >
                <Play size={13} />
                Start New Run
              </Button>
              <Link
                to="/agent-workflow-os"
                className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink size={11} />
                View Full Thread in Workflow OS
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
