import { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";
import type { ToolExecutionContext } from "../services/workflowEngine";
import {
  type WorkflowExecutionContext,
  type WorkflowStep,
  workflowEngine,
} from "../services/workflowEngine";
import type { AgentTemplateRecord } from "../types/agentWorkflow";

export interface RunProgress {
  runId: string;
  currentStep: number;
  totalSteps: number;
  status: "idle" | "running" | "paused_for_approval" | "completed" | "failed";
  lastOutput: string;
  artifacts: string[];
  error?: string;
}

export function useAgentWorkflow() {
  const {
    currentTenantId,
    agentMemories,
    providerAdapters,
    openSourceConfig,
    createThread,
    startRun,
    completeRun,
    failRun,
    pauseRunForApproval,
    createArtifact,
    setNotifications,
    // CRM tool layer
    getLeadsByTenant,
    addLead,
    updateLeadStatus,
    getAuditDataForTenant,
    getActiveAgentsForTenant,
    getTenantById,
  } = useApp();

  const [runProgress, setRunProgress] = useState<Record<string, RunProgress>>(
    {},
  );

  // Get the active provider adapter label
  const getActiveProvider = useCallback((): string => {
    if (
      openSourceConfig.gateway.enabled &&
      openSourceConfig.gateway.baseUrl &&
      openSourceConfig.gateway.featureFlags.workflowExecution
    ) {
      return "AI Gateway";
    }
    if (!providerAdapters || providerAdapters.length === 0) return "native";
    const active = providerAdapters.find((p) => p.isEnabled);
    if (!active || active.adapterType === "native") return "Native";
    const labels: Record<string, string> = {
      openai_compatible: "OpenAI",
      anthropic_claude: "Claude",
      ollama_local: "Ollama",
      deerflow_bridge: "DeerFlow",
      abacus_adapter: "Abacus",
    };
    return labels[active.adapterType] ?? active.adapterType;
  }, [openSourceConfig, providerAdapters]);

  // Get memory context string for a thread
  const getMemoryContext = useCallback(
    (threadId: string): string => {
      if (!agentMemories) return "";
      const threadMemory = agentMemories.find((m) => m.threadId === threadId);
      if (!threadMemory) return "";
      const memories = threadMemory.conversationHistory
        .slice(-5)
        .map((entry) => ({
          content: entry.content,
          memoryType:
            entry.role === "assistant" ? "agent_response" : "user_input",
          importance: entry.role === "assistant" ? 8 : 5,
        }));
      if (threadMemory.summary) {
        memories.unshift({
          content: threadMemory.summary,
          memoryType: "thread_summary",
          importance: 10,
        });
      }
      return workflowEngine.buildMemoryContext(memories);
    },
    [agentMemories],
  );

  // Build the tool context that wires tools to live app data
  const buildToolContext = useCallback(
    (runId: string, threadId: string): ToolExecutionContext => ({
      tenantId: currentTenantId,
      getLeadsByTenant,
      addLead,
      updateLeadStatus,
      getAuditDataForTenant,
      getActiveAgentsForTenant,
      getTenantById,
      triggerNotification: (notification) => {
        setNotifications((prev) => [
          {
            ...notification,
            id: `notif-tool-${Date.now()}`,
            time: "Just now",
            read: false,
          },
          ...prev,
        ]);
      },
      createArtifact,
      currentRunId: runId,
      currentThreadId: threadId,
    }),
    [
      currentTenantId,
      getLeadsByTenant,
      addLead,
      updateLeadStatus,
      getAuditDataForTenant,
      getActiveAgentsForTenant,
      getTenantById,
      setNotifications,
      createArtifact,
    ],
  );

  // Execute a full multi-step workflow run
  const executeRun = useCallback(
    async (
      threadId: string,
      agentId: string,
      agentRole: string,
      input: string,
      systemPrompt: string,
      steps: WorkflowStep[],
      requireApproval: boolean,
      allowedTools: string[],
    ): Promise<
      { runId: string; output: string; artifacts: string[] } | undefined
    > => {
      // Create the run record in AppContext
      const run = startRun(
        threadId,
        currentTenantId,
        agentId,
        input,
        requireApproval,
      );
      const runId = run.id;

      // Build live tool context now that runId is known
      const toolContext = buildToolContext(runId, threadId);

      const activeAdapterType =
        providerAdapters?.find((p) => p.isEnabled)?.adapterType ?? "native";

      const context: WorkflowExecutionContext = {
        threadId,
        runId,
        tenantId: currentTenantId,
        agentId,
        agentRole,
        providerAdapter: activeAdapterType,
        systemPrompt,
        memoryContext: getMemoryContext(threadId),
        steps,
        currentStepIndex: 0,
        maxRetries: 2,
        requireApproval,
        allowedTools,
        toolContext,
        openSourceConfig,
      };

      setRunProgress((prev) => ({
        ...prev,
        [runId]: {
          runId,
          currentStep: 0,
          totalSteps: steps.length,
          status: "running",
          lastOutput: "",
          artifacts: [],
        },
      }));

      let finalOutput = "";
      const artifacts: string[] = [];
      let finalMetadata: Record<string, string> = {};

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        context.currentStepIndex = i;

        setRunProgress((prev) => ({
          ...prev,
          [runId]: { ...prev[runId], currentStep: i, status: "running" },
        }));

        const result = await workflowEngine.executeStep(
          step,
          context,
          (status, output) => {
            setRunProgress((prev) => ({
              ...prev,
              [runId]: {
                ...prev[runId],
                status: status as RunProgress["status"],
                lastOutput: output,
              },
            }));
          },
        );

        if (result.status === "paused_for_approval") {
          pauseRunForApproval(runId, `Step "${step.title}" requires approval`);

          // Fire admin notification via setNotifications
          setNotifications((prev) => [
            {
              id: `notif-approval-${Date.now()}`,
              type: "general" as const,
              title: "Agent Action Requires Approval",
              message: `Agent run is paused at step "${step.title}" and needs your review.`,
              time: "Just now",
              read: false,
            },
            ...prev,
          ]);

          setRunProgress((prev) => ({
            ...prev,
            [runId]: {
              ...prev[runId],
              status: "paused_for_approval",
              lastOutput: "Awaiting approval from admin",
            },
          }));

          return undefined;
        }

        if (result.status === "failed") {
          failRun(runId, result.error ?? "Step failed");
          setRunProgress((prev) => ({
            ...prev,
            [runId]: {
              ...prev[runId],
              status: "failed",
              error: result.error,
              lastOutput: result.error ?? "Execution failed",
            },
          }));
          return undefined;
        }

        finalOutput = result.output;
        if (result.metadata) {
          finalMetadata = { ...finalMetadata, ...result.metadata };
        }

        if (result.artifactId) {
          artifacts.push(result.artifactId);
          createArtifact(
            runId,
            threadId,
            currentTenantId,
            (step.artifactType as "content_package") ?? "content_package",
            `${agentRole} output — ${step.title}`,
            result.output,
          );
        }
      }

      // Run completed
      completeRun(runId, finalOutput, artifacts, finalMetadata);

      setRunProgress((prev) => ({
        ...prev,
        [runId]: {
          ...prev[runId],
          status: "completed",
          lastOutput: finalOutput,
          artifacts,
          currentStep: steps.length,
        },
      }));

      return { runId, output: finalOutput, artifacts };
    },
    [
      currentTenantId,
      openSourceConfig,
      providerAdapters,
      getMemoryContext,
      buildToolContext,
      startRun,
      completeRun,
      failRun,
      pauseRunForApproval,
      createArtifact,
      setNotifications,
    ],
  );

  // Quick single-step run — used by AI Business Manager
  const executeQuickRun = useCallback(
    async (
      threadId: string,
      agentId: string,
      agentRole: string,
      input: string,
      systemPrompt: string,
    ) => {
      const singleStep: WorkflowStep = {
        id: "step_0",
        title: "Process Request",
        type: "prompt",
        input,
        onFailure: "retry",
        maxRetries: 2,
      };

      return executeRun(
        threadId,
        agentId,
        agentRole,
        input,
        systemPrompt,
        [singleStep],
        false,
        [],
      );
    },
    [executeRun],
  );

  // Quick tool run — used by AI Business Manager quick prompts
  const executeToolRun = useCallback(
    async (
      threadId: string,
      toolName: string,
      toolInput: Record<string, unknown>,
    ) => {
      const toolStep: WorkflowStep = {
        id: "step_0",
        title: `Run ${toolName}`,
        type: "tool_call",
        toolName,
        input: JSON.stringify(toolInput),
        onFailure: "retry",
        maxRetries: 1,
      };

      return executeRun(
        threadId,
        toolName,
        "ops",
        `Tool: ${toolName}`,
        "",
        [toolStep],
        false,
        [toolName],
      );
    },
    [executeRun],
  );

  // Activate a template — creates a thread and queues the first run
  const activateTemplate = useCallback(
    async (template: AgentTemplateRecord) => {
      const thread = createThread(
        currentTenantId,
        template.name,
        `${template.name} — ${new Date().toLocaleDateString()}`,
      );

      const steps = workflowEngine.buildWorkflowFromTemplate({
        role: template.role,
        systemPrompt: template.systemPrompt,
        requireApproval: template.approvalRequired,
        defaultWorkflowSteps: template.defaultWorkflowSteps,
      });

      await executeRun(
        thread.id,
        template.id,
        template.role,
        `Initialize ${template.name} agent`,
        template.systemPrompt,
        steps,
        template.approvalRequired,
        template.allowedTools,
      );

      return thread.id;
    },
    [currentTenantId, createThread, executeRun],
  );

  return {
    executeRun,
    executeQuickRun,
    executeToolRun,
    activateTemplate,
    runProgress,
    getActiveProvider,
    getMemoryContext,
  };
}
