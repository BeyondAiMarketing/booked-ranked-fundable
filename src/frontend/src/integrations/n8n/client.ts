/**
 * n8n client wrapper — prepares workflow import/export data for the backend.
 * All live calls go through the Motoko backend via HTTP outcalls.
 *
 * Feature flag: N8N_INTEGRATION_ENABLED (always false by default)
 */

import { areIntegrationsEnabled } from "../_shared/env";
import { IntegrationError } from "../_shared/types";
import type { N8nWebhookPayload, N8nWorkflow } from "./schemas";

const PLATFORM = "n8n" as const;

export interface ImportWorkflowInput {
  workflowJson: N8nWorkflow;
  overwriteExisting?: boolean;
}

export interface ExportWorkflowInput {
  workflowId: string;
}

/**
 * Validate a workflow JSON before sending to backend.
 * Returns the workflow if valid, throws IntegrationError if not.
 */
export function validateWorkflowJson(workflow: unknown): N8nWorkflow {
  if (!workflow || typeof workflow !== "object") {
    throw new IntegrationError("Invalid workflow: must be an object", PLATFORM);
  }

  const w = workflow as Record<string, unknown>;

  if (typeof w.name !== "string" || w.name.trim().length === 0) {
    throw new IntegrationError("Invalid workflow: name is required", PLATFORM);
  }

  if (!Array.isArray(w.nodes)) {
    throw new IntegrationError(
      "Invalid workflow: nodes must be an array",
      PLATFORM,
    );
  }

  if (!w.connections || typeof w.connections !== "object") {
    throw new IntegrationError(
      "Invalid workflow: connections must be an object",
      PLATFORM,
    );
  }

  return workflow as N8nWorkflow;
}

/**
 * Prepare a workflow for import via backend.
 * Does not execute the import — returns the payload for the actor method.
 */
export function prepareWorkflowImport(input: ImportWorkflowInput): {
  action: "import";
  payload: N8nWorkflow;
  overwrite: boolean;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  const validated = validateWorkflowJson(input.workflowJson);

  return {
    action: "import",
    payload: validated,
    overwrite: input.overwriteExisting ?? false,
  };
}

/**
 * Prepare a workflow export request for backend.
 */
export function prepareWorkflowExport(input: ExportWorkflowInput): {
  action: "export";
  workflowId: string;
} {
  if (!areIntegrationsEnabled()) {
    throw new IntegrationError("Integrations are disabled", PLATFORM);
  }

  if (!input.workflowId || typeof input.workflowId !== "string") {
    throw new IntegrationError("workflowId is required", PLATFORM);
  }

  return {
    action: "export",
    workflowId: input.workflowId,
  };
}

/**
 * Build a webhook payload for an n8n Webhook node.
 * The backend will POST this to the n8n webhook URL.
 */
export function buildWebhookPayload(
  data: unknown,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    query?: Record<string, string>;
  },
): N8nWebhookPayload {
  return {
    method: options?.method ?? "POST",
    headers: options?.headers ?? { "Content-Type": "application/json" },
    body: data,
    query: options?.query ?? {},
  };
}
