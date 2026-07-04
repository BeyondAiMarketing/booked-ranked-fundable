import { describe, expect, it } from "vitest";
import {
  buildWebhookPayload,
  prepareWorkflowImport,
  validateWorkflowJson,
} from "../../integrations/n8n/client";
import type { N8nWorkflow } from "../../integrations/n8n/schemas";

describe("n8n integration", () => {
  describe("validateWorkflowJson", () => {
    it("validates a correct workflow", () => {
      const workflow: N8nWorkflow = {
        name: "Lead Capture",
        nodes: [
          {
            id: "node-1",
            name: "Webhook",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [100, 200],
            parameters: {},
          },
        ],
        connections: {},
        active: false,
      };

      const result = validateWorkflowJson(workflow);
      expect(result.name).toBe("Lead Capture");
    });

    it("throws when workflow is not an object", () => {
      expect(() => validateWorkflowJson("string")).toThrow("Invalid workflow");
    });

    it("throws when name is missing", () => {
      expect(() =>
        validateWorkflowJson({ nodes: [], connections: {} }),
      ).toThrow("name is required");
    });

    it("throws when nodes is not an array", () => {
      expect(() =>
        validateWorkflowJson({ name: "Test", nodes: "bad", connections: {} }),
      ).toThrow("nodes must be an array");
    });

    it("throws when connections is not an object", () => {
      expect(() =>
        validateWorkflowJson({ name: "Test", nodes: [], connections: "bad" }),
      ).toThrow("connections must be an object");
    });
  });

  describe("prepareWorkflowImport", () => {
    it("throws when integrations are disabled", () => {
      const workflow: N8nWorkflow = {
        name: "Test",
        nodes: [],
        connections: {},
        active: false,
      };

      expect(() => prepareWorkflowImport({ workflowJson: workflow })).toThrow(
        "Integrations are disabled",
      );
    });
  });

  describe("buildWebhookPayload", () => {
    it("builds a default POST payload", () => {
      const payload = buildWebhookPayload({ leadId: "123" });

      expect(payload.method).toBe("POST");
      expect(payload.headers?.["Content-Type"]).toBe("application/json");
      expect(payload.body).toEqual({ leadId: "123" });
    });

    it("builds a custom GET payload", () => {
      const payload = buildWebhookPayload(null, {
        method: "GET",
        query: { action: "sync" },
      });

      expect(payload.method).toBe("GET");
      expect(payload.query).toEqual({ action: "sync" });
    });
  });
});
