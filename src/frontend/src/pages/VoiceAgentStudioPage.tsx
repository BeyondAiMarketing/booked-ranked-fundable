import {
  Bot,
  CheckCircle,
  ChevronRight,
  Loader2,
  Mic,
  Play,
  Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";

interface DograhAgent {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft";
  nodeCount: number;
}

interface AgentForm {
  name: string;
  description: string;
  niche: string;
  nlCommand: string;
}

const NICHES = ["Roofing", "HVAC", "Plumbing", "Restoration", "General"];

function parseCommandPreview(command: string): string[] {
  if (!command.trim()) return [];
  return command
    .split(/[.?,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export default function VoiceAgentStudioPage() {
  const { actor } = useActor();
  const { isAdminUser } = useApp();

  const [agents, setAgents] = useState<DograhAgent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create">("list");

  const [form, setForm] = useState<AgentForm>({
    name: "",
    description: "",
    niche: "Roofing",
    nlCommand: "",
  });

  const [isRecording, setIsRecording] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushTarget, setPushTarget] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<{
    message: string;
    agentId?: string;
  } | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Load agents on mount
  useEffect(() => {
    if (!actor) return;
    setLoadingAgents(true);
    actor
      .getDograhAgents()
      .then((res: unknown) => {
        const list = Array.isArray(res) ? (res as DograhAgent[]) : [];
        setAgents(list);
      })
      .catch(() => {
        setAgents([]);
      })
      .finally(() => setLoadingAgents(false));
  }, [actor]);

  // Clear banners after 6s
  useEffect(() => {
    if (!successBanner) return;
    const t = setTimeout(() => setSuccessBanner(null), 6000);
    return () => clearTimeout(t);
  }, [successBanner]);

  useEffect(() => {
    if (!errorBanner) return;
    const t = setTimeout(() => setErrorBanner(null), 6000);
    return () => clearTimeout(t);
  }, [errorBanner]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

  function startRecording() {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setErrorBanner("Speech recognition is not supported in this browser.");
      return;
    }

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onstart = () => setIsRecording(true);
    rec.onend = () => setIsRecording(false);
    rec.onerror = () => {
      setIsRecording(false);
      setErrorBanner("Speech recognition error. Please try again.");
    };
    rec.onresult = (e: any) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      setForm((prev) => ({
        ...prev,
        nlCommand: `${prev.nlCommand} ${transcript}`.trim(),
      }));
    };

    recognitionRef.current = rec;
    rec.start();
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  async function handleBuildAgent() {
    if (!actor) return;
    setIsBuilding(true);
    setErrorBanner(null);
    try {
      const res = await actor.createAgentFromCommand({
        name: form.name,
        description: form.description,
        niche: form.niche,
        nlCommand: form.nlCommand,
      });
      const agentId = (res as { id?: string })?.id ?? "";
      setSuccessBanner({
        message: `Agent built — ${parseCommandPreview(form.nlCommand).length} nodes created`,
        agentId,
      });
      // Refresh list
      const list = await actor.getDograhAgents();
      setAgents(Array.isArray(list) ? (list as DograhAgent[]) : []);
      setMode("list");
      setForm({ name: "", description: "", niche: "Roofing", nlCommand: "" });
    } catch (_e) {
      setErrorBanner("Failed to build agent. Please try again.");
    } finally {
      setIsBuilding(false);
    }
  }

  async function handleUpdateAgent() {
    if (!actor || !selectedAgentId) return;
    setIsBuilding(true);
    setErrorBanner(null);
    try {
      await actor.editAgentFromCommand(selectedAgentId, form.nlCommand);
      setSuccessBanner({
        message: `Agent updated — ${parseCommandPreview(form.nlCommand).length} nodes updated`,
        agentId: selectedAgentId,
      });
      const list = await actor.getDograhAgents();
      setAgents(Array.isArray(list) ? (list as DograhAgent[]) : []);
      setForm((prev) => ({ ...prev, nlCommand: "" }));
    } catch (_e) {
      setErrorBanner("Failed to update agent. Please try again.");
    } finally {
      setIsBuilding(false);
    }
  }

  async function handleDeploy(agentId: string) {
    if (!actor) return;
    setIsDeploying(true);
    try {
      await actor.deployAgent(agentId);
      setSuccessBanner({ message: "Agent deployed successfully!" });
      const list = await actor.getDograhAgents();
      setAgents(Array.isArray(list) ? (list as DograhAgent[]) : []);
    } catch (_e) {
      setErrorBanner("Failed to deploy agent.");
    } finally {
      setIsDeploying(false);
    }
  }

  async function handlePushRoofingTemplate(target: "all" | "agency") {
    if (!actor) return;
    setIsPushing(true);
    setPushTarget(target);
    setErrorBanner(null);
    try {
      await actor.pushRoofingTemplate(target);
      setSuccessBanner({
        message:
          target === "all"
            ? "Roofing template pushed to all accounts."
            : "Roofing template pushed to agency tier.",
      });
    } catch (_e) {
      setErrorBanner("Failed to push roofing template.");
    } finally {
      setIsPushing(false);
      setPushTarget(null);
    }
  }

  const previewItems = parseCommandPreview(form.nlCommand);
  const isCreateMode = mode === "create" || selectedAgentId === null;
  const canBuild =
    (isCreateMode ? form.name.trim() && form.description.trim() : true) &&
    form.nlCommand.trim().length > 0;

  return (
    <div className="min-h-full bg-background p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg">
            <Mic size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Voice Agent Studio
              <Bot size={18} className="text-indigo-400" />
            </h1>
            <p className="text-sm text-slate-400">
              Build and customize voice agents with natural language commands
            </p>
          </div>
        </div>
      </div>

      {/* Banners */}
      {successBanner && (
        <div
          className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 animate-fade-in-down"
          data-ocid="voiceagentstudio.success_banner"
        >
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-emerald-300 font-medium">
              {successBanner.message}
            </p>
          </div>
          {successBanner.agentId && (
            <button
              type="button"
              data-ocid="voiceagentstudio.deploy_now.button"
              onClick={() => handleDeploy(successBanner.agentId!)}
              disabled={isDeploying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isDeploying ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              Deploy Now
            </button>
          )}
        </div>
      )}

      {errorBanner && (
        <div
          className="mb-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 animate-fade-in-down"
          data-ocid="voiceagentstudio.error_banner"
        >
          <span className="text-rose-400 text-sm font-medium">
            {errorBanner}
          </span>
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT PANEL — Agent List */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="card-dark rounded-xl p-4">
            <button
              type="button"
              data-ocid="voiceagentstudio.create_new_agent.button"
              onClick={() => {
                setMode("create");
                setSelectedAgentId(null);
                setForm({
                  name: "",
                  description: "",
                  niche: "Roofing",
                  nlCommand: "",
                });
              }}
              className="w-full mb-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-900/30"
            >
              <Bot size={16} />
              Create New Agent
            </button>

            {loadingAgents ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-indigo-400" />
              </div>
            ) : agents.length === 0 ? (
              <div
                className="text-center py-8 px-4"
                data-ocid="voiceagentstudio.empty_state"
              >
                <Bot size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">
                  No agents yet. Create your first voice agent.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    data-ocid={`voiceagentstudio.agent_card.${agent.id}`}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setMode("list");
                      setForm((prev) => ({
                        ...prev,
                        name: agent.name,
                        description: agent.description,
                        nlCommand: "",
                      }));
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedAgentId === agent.id
                        ? "bg-indigo-600/20 border-indigo-500/40"
                        : "bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/12"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white truncate">
                        {agent.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          agent.status === "active"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mb-1.5">
                      {agent.description}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <ChevronRight size={10} />
                      {agent.nodeCount} nodes
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Command Interface */}
        <div className="flex-1 min-w-0">
          <div className="card-dark rounded-xl p-5 md:p-6">
            {isCreateMode ? (
              <>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Bot size={18} className="text-indigo-400" />
                  Create New Agent
                </h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="agent-name"
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"
                    >
                      Agent Name
                    </label>
                    <input
                      id="agent-name"
                      type="text"
                      data-ocid="voiceagentstudio.agent_name.input"
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. Roofing Lead Qualifier"
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="agent-description"
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"
                    >
                      Description
                    </label>
                    <input
                      id="agent-description"
                      type="text"
                      data-ocid="voiceagentstudio.agent_description.input"
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="What does this agent do?"
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="agent-niche"
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"
                    >
                      Niche
                    </label>
                    <select
                      id="agent-niche"
                      data-ocid="voiceagentstudio.niche.select"
                      value={form.niche}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, niche: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                    >
                      {NICHES.map((n) => (
                        <option key={n} value={n} className="bg-slate-900">
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            ) : selectedAgent ? (
              <>
                <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Bot size={18} className="text-indigo-400" />
                  Edit: {selectedAgent.name}
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  {selectedAgent.description}
                </p>
              </>
            ) : null}

            {/* Command textarea — shown in both modes */}
            <div className="mb-4">
              <label
                htmlFor="nl-command-textarea"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"
              >
                Natural Language Command
              </label>
              <div className="relative">
                <textarea
                  id="nl-command-textarea"
                  data-ocid="voiceagentstudio.nl_command.textarea"
                  value={form.nlCommand}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nlCommand: e.target.value }))
                  }
                  placeholder="Describe what you want your voice agent to do..."
                  rows={5}
                  className="w-full px-3 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none"
                />
                <button
                  type="button"
                  data-ocid="voiceagentstudio.mic.button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`absolute right-3 bottom-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse"
                      : "bg-white/10 text-slate-400 hover:bg-white/15 hover:text-white border border-white/10"
                  }`}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  <Mic size={14} />
                </button>
              </div>
              {isRecording && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Listening...
                </p>
              )}
            </div>

            {/* Preview */}
            {previewItems.length > 0 && (
              <div
                className="mb-5 p-4 rounded-lg bg-white/5 border border-white/10"
                data-ocid="voiceagentstudio.preview.card"
              >
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                  Preview
                </p>
                <p className="text-sm text-white mb-2">
                  This will create {previewItems.length} node
                  {previewItems.length > 1 ? "s" : ""}:
                </p>
                <ul className="space-y-1.5">
                  {previewItems.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-slate-300 flex items-start gap-2"
                    >
                      <ChevronRight
                        size={14}
                        className="text-indigo-400 mt-0.5 shrink-0"
                      />
                      <span className="capitalize">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {isCreateMode ? (
                <button
                  type="button"
                  data-ocid="voiceagentstudio.build_agent.button"
                  onClick={handleBuildAgent}
                  disabled={!canBuild || isBuilding}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 disabled:text-indigo-300/60 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-900/30"
                >
                  {isBuilding ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Build Agent
                </button>
              ) : (
                <button
                  type="button"
                  data-ocid="voiceagentstudio.update_agent.button"
                  onClick={handleUpdateAgent}
                  disabled={!canBuild || isBuilding}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 disabled:text-indigo-300/60 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-900/30"
                >
                  {isBuilding ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Update Agent
                </button>
              )}

              {selectedAgentId && selectedAgent?.status === "draft" && (
                <button
                  type="button"
                  data-ocid="voiceagentstudio.deploy_agent.button"
                  onClick={() => handleDeploy(selectedAgentId)}
                  disabled={isDeploying}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/40 text-white text-sm font-semibold transition-colors"
                >
                  {isDeploying ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} />
                  )}
                  Deploy
                </button>
              )}
            </div>
          </div>

          {/* ADMIN SECTION */}
          {isAdminUser && (
            <div
              className="mt-6 card-dark rounded-xl p-5 md:p-6 border border-amber-500/20"
              data-ocid="voiceagentstudio.admin_section.panel"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Admin
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Roofing Starter Template
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Pre-built lead qualifier: asks for address, job type, timeline,
                insurance, and books inspection.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-ocid="voiceagentstudio.push_all.button"
                  onClick={() => handlePushRoofingTemplate("all")}
                  disabled={isPushing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-amber-600/40 text-white text-sm font-semibold transition-colors"
                >
                  {isPushing && pushTarget === "all" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Push to All Accounts
                </button>
                <button
                  type="button"
                  data-ocid="voiceagentstudio.push_agency.button"
                  onClick={() => handlePushRoofingTemplate("agency")}
                  disabled={isPushing}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold transition-colors"
                >
                  {isPushing && pushTarget === "agency" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Push to Agency Tier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
