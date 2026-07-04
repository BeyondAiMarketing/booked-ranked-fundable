# n8n Integration

## Official Docs
- https://n8n.io/workflows/
- https://docs.n8n.io/workflows/templates/
- https://docs.n8n.io/workflows/export-import/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- https://docs.n8n.io/api/api-reference/

## Internal Workflow Schema
n8n supports JSON workflow export/import, but does not provide one universal official JSON schema for every node. Build an internal flexible compatibility schema only.

```json
{
  "name": "string",
  "nodes": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "typeVersion": "number",
      "position": ["number", "number"],
      "parameters": {},
      "credentials": {
        "credentialTypeName": {
          "id": "string",
          "name": "string"
        }
      }
    }
  ],
  "connections": {
    "Source Node Name": {
      "main": [
        [
          {
            "node": "Target Node Name",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {},
  "staticData": {},
  "pinData": {},
  "active": false
}
```

## Webhook Node Facts
- Methods: DELETE, GET, HEAD, PATCH, POST, PUT
- Default payload limit: 16MB
- Self-hosted limit env: N8N_PAYLOAD_SIZE_MAX
- Test and production webhook URLs are separate
- Response modes can be immediate, after workflow finishes, or through Respond to Webhook node

## HTTP Request Node Facts
- Used for REST API calls
- Supports URL, method, headers, query, body, JSON, form, auth, and credentials
- Never export credential secrets. Only reference credential IDs/names

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All n8n integrations are behind the `N8N_INTEGRATION_ENABLED` feature flag.
- Do not store plaintext API keys or OAuth tokens.
- Use idempotency for webhook events.
- Return fast 2xx responses after safe acceptance.
