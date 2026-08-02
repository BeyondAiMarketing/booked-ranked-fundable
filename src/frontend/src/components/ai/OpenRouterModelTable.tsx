import { useApp } from "@/context/AppContext";
import { useActor } from "@/hooks/useActor";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Constants ─────────────────────────────────────────────────────────────────

const TASKS = [
  { id: "email_generation", label: "Email Generation" },
  { id: "proposal_writing", label: "Proposal Writing" },
  { id: "review_responses", label: "Review Responses" },
  { id: "rag_answers", label: "RAG Answers" },
  { id: "summarization", label: "Summarization" },
  { id: "outreach_copy", label: "Outreach Copy" },
  { id: "followup_drafts", label: "Follow-Up Drafts" },
  { id: "morning_digest", label: "Morning Digest" },
];

const MODELS = [
  { id: "openrouter/owl-alpha", label: "OmniRouter (Owl Alpha)" },
  { id: "openai/gpt-4o", label: "GPT-4o" },
  { id: "anthropic/claude-sonnet-4-5", label: "Claude Sonnet" },
  { id: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
  { id: "moonshotai/kimi-k2", label: "Kimi 2" },
  { id: "meta-llama/llama-4-maverick", label: "Llama 4" },
  { id: "mistralai/mistral-large", label: "Mistral Large" },
  { id: "deepseek/deepseek-chat", label: "DeepSeek Chat" },
];

const DEFAULT_MODEL = "openrouter/owl-alpha";

// ── Component ─────────────────────────────────────────────────────────────────

export function OpenRouterModelTable() {
  const { isSuperAdmin } = useApp();
  const { actor } = useActor();

  // Map of taskId -> modelId (current saved state)
  const [overrides, setOverrides] = useState<Record<string, string>>(() =>
    Object.fromEntries(TASKS.map((t) => [t.id, DEFAULT_MODEL])),
  );
  // Track local changes separately to know which rows changed
  const [localOverrides, setLocalOverrides] = useState<Record<string, string>>(
    () => Object.fromEntries(TASKS.map((t) => [t.id, DEFAULT_MODEL])),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!actor || loadedRef.current) return;
    loadedRef.current = true;

    (async () => {
      try {
        const result = await (actor as any)?.getOpenRouterTaskOverrides?.();
        if (result && Array.isArray(result)) {
          const map: Record<string, string> = Object.fromEntries(
            TASKS.map((t) => [t.id, DEFAULT_MODEL]),
          );
          for (const [task, model] of result as [string, string][]) {
            if (task && model) map[task] = model;
          }
          setOverrides(map);
          setLocalOverrides({ ...map });
        }
      } catch {
        // non-fatal, defaults remain
      } finally {
        setIsLoading(false);
      }
    })();
  }, [actor]);

  async function handleSaveAll() {
    const changed = TASKS.filter(
      (t) => localOverrides[t.id] !== overrides[t.id],
    );
    if (changed.length === 0) {
      toast.info("No changes to save.");
      return;
    }
    setIsSaving(true);
    try {
      for (const t of changed) {
        await (actor as any)?.setOpenRouterTaskModel?.(
          t.id,
          localOverrides[t.id],
        );
      }
      setOverrides({ ...localOverrides });
      toast.success(`Saved overrides for ${changed.length} task(s).`);
    } catch {
      toast.error("Failed to save model overrides.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isSuperAdmin) return null;

  return (
    <div
      className="bg-slate-800/60 rounded-xl border border-emerald-500/25 p-6 mt-4 space-y-4"
      data-ocid="golive.openrouter.model_table"
    >
      <div>
        <h3 className="text-sm font-bold text-white">
          Model Per Task Override
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Select which OpenRouter model handles each AI task. Defaults to Owl
          Alpha.
        </p>
      </div>

      {isLoading ? (
        <p className="text-xs text-slate-500 animate-pulse">
          Loading current overrides…
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/60">
                <th className="text-left text-xs font-semibold text-slate-300 uppercase tracking-wider pb-2 pr-4">
                  Task
                </th>
                <th className="text-left text-xs font-semibold text-slate-300 uppercase tracking-wider pb-2">
                  Model
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {TASKS.map((task) => {
                const isChanged =
                  localOverrides[task.id] !== overrides[task.id];
                return (
                  <tr
                    key={task.id}
                    className="transition-colors hover:bg-white/5"
                    data-ocid={`golive.openrouter.task_row.${task.id}`}
                  >
                    <td className="py-2.5 pr-4">
                      <span
                        className={`text-sm ${
                          isChanged
                            ? "text-emerald-300 font-medium"
                            : "text-slate-300"
                        }`}
                      >
                        {task.label}
                        {isChanged && (
                          <span className="ml-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">
                            ·changed
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-2">
                      <select
                        value={localOverrides[task.id] ?? DEFAULT_MODEL}
                        onChange={(e) =>
                          setLocalOverrides((prev) => ({
                            ...prev,
                            [task.id]: e.target.value,
                          }))
                        }
                        className="bg-slate-700 border border-slate-600 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 min-w-[200px]"
                        data-ocid={`golive.openrouter.model_select.${task.id}`}
                      >
                        {MODELS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label} — {m.id}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">
          Unsaved changes are highlighted in{" "}
          <span className="text-emerald-400">green</span>.
        </p>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving || isLoading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition-colors"
          data-ocid="golive.openrouter.save_overrides_button"
        >
          {isSaving ? "Saving…" : "Save All Overrides"}
        </button>
      </div>
    </div>
  );
}
