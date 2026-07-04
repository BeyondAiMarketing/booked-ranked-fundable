/**
 * n8n internal workflow compatibility schema.
 * n8n does not provide one universal official JSON schema for every node.
 * This is a flexible internal schema only.
 *
 * Docs:
 * - https://n8n.io/workflows/
 * - https://docs.n8n.io/workflows/export-import/
 * - https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
 * - https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
 */

export interface N8nWorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  credentials?: Record<string, { id: string; name: string }>;
  [key: string]: unknown;
}

export interface N8nWorkflowConnection {
  node: string;
  type: string;
  index: number;
}

export interface N8nWorkflowConnections {
  [sourceNodeName: string]: {
    main?: N8nWorkflowConnection[][];
    [key: string]: unknown;
  };
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nWorkflowNode[];
  connections: N8nWorkflowConnections;
  settings?: Record<string, unknown>;
  staticData?: Record<string, unknown>;
  pinData?: Record<string, unknown>;
  active: boolean;
  [key: string]: unknown;
}

export interface N8nWebhookPayload {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  query?: Record<string, string>;
  [key: string]: unknown;
}
