// Agent Workflow OS — TypeScript types

export interface AgentThread {
  id: string;
  tenantId: string;
  agentType: string;
  title: string;
  status: "active" | "archived" | "paused";
  messageCount: number;
  summary: string;
  agentNotes: string;
  createdAt: number;
  updatedAt: number;
}

export interface AgentRun {
  id: string;
  threadId: string;
  tenantId: string;
  agentType: string;
  status:
    | "queued"
    | "running"
    | "completed"
    | "failed"
    | "paused_for_approval"
    | "cancelled";
  inputPrompt: string;
  outputText: string;
  errorMessage: string;
  artifactIds: string[];
  workflowStepIndex: number;
  approvalRequired: boolean;
  approvalStatus: "pending" | "approved" | "rejected" | null;
  startedAt: number;
  endedAt: number | null;
  metadata: Record<string, string>;
}

export interface AgentArtifact {
  id: string;
  runId: string;
  threadId: string;
  tenantId: string;
  artifactType:
    | "proposal"
    | "estimate"
    | "content_package"
    | "lead_summary"
    | "recommendation_set"
    | "follow_up_sequence"
    | "seo_action_plan"
    | "support_resolution";
  title: string;
  content: string;
  tags: string[];
  status: "draft" | "final" | "archived";
  createdAt: number;
  updatedAt: number;
}

export interface AgentTemplateRecord {
  id: string;
  tenantId: string;
  name: string;
  role: "sales" | "support" | "seo" | "ops" | "content" | "follow_up";
  systemPrompt: string;
  allowedTools: string[];
  memoryMode: "none" | "conversation_only" | "with_summary" | "with_notes";
  approvalRequired: boolean;
  defaultWorkflowSteps: string[];
  isDefault: boolean;
  createdAt: number;
}

export interface AgentMemoryEntry {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AgentMemory {
  threadId: string;
  tenantId: string;
  conversationHistory: AgentMemoryEntry[];
  summary: string;
  agentNotes: string;
  lastUpdated: number;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: "crm" | "content" | "notification" | "analytics" | "pricing";
  schema: Record<string, string>;
  permissions: string[];
  requiresApproval: boolean;
  tenantScoped: boolean;
  isEnabled: boolean;
}

export interface ApprovalItem {
  id: string;
  runId: string;
  threadId: string;
  tenantId: string;
  action: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "expired";
  requestedAt: number;
  resolvedAt: number | null;
  approverNotes: string;
}

export interface ProviderAdapterConfig {
  id: string;
  tenantId: string;
  adapterType:
    | "native"
    | "openai_compatible"
    | "anthropic_claude"
    | "ollama_local"
    | "deerflow_bridge"
    | "abacus_adapter";
  isEnabled: boolean;
  apiKey: string;
  baseUrl: string;
  modelId: string;
  priority: number;
  createdAt: number;
}
