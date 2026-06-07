// ── N8N Workflow Types ────────────────────────────────────────────────────────

export type WorkflowScope =
  | "AdminOnly"
  | "AllClients"
  | "BasicTier"
  | "ProTier"
  | "AgencyTier";

export const ALL_WORKFLOW_SCOPES: WorkflowScope[] = [
  "AdminOnly",
  "AllClients",
  "BasicTier",
  "ProTier",
  "AgencyTier",
];

export type WorkflowExecutionStatus =
  | "Running"
  | "Success"
  | "Failed"
  | "Timeout";

export interface WorkflowDef {
  id: string;
  name: string;
  description: string;
  tags: string[];
  scope: WorkflowScope;
  workflowJson: string;
  isActive: boolean;
  createdAt: bigint;
  createdBy: string;
  pushedToAccounts: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  tenantId: string;
  triggeredBy: string;
  status: WorkflowExecutionStatus;
  inputVars: [string, string][];
  outputData?: string;
  errorMessage?: string;
  startedAt: bigint;
  completedAt?: bigint;
}

export interface WorkflowTriggerRequest {
  workflowId: string;
  tenantId: string;
  triggeredBy: string;
  inputVars: Record<string, string>;
  customVars?: Array<[string, string]>;
}

export interface N8NConnectionDisplay {
  instanceUrl: string;
  isConnected: boolean;
  lastTestedAt?: number;
  activeWorkflowCount: number;
  totalExecutionsToday: number;
}
