# Vapi Integration

## Official Docs
- https://docs.vapi.ai/api-reference/assistants/create
- https://docs.vapi.ai/server-url
- https://docs.vapi.ai/server-url/events
- https://docs.vapi.ai/server-url/setting-server-urls
- https://docs.vapi.ai/outbound-campaigns/overview

## Assistant Creation
`POST https://api.vapi.ai/assistant`

### Auth
- `Authorization: Bearer ${VAPI_PRIVATE_KEY}`
- `Content-Type: application/json`

### Create Assistant Request
```json
{
  "name": "Roofing Lead Qualifier",
  "firstMessage": "Hi, this is the roofing assistant. How can I help today?",
  "model": {
    "provider": "openai",
    "model": "gpt-4.1-mini",
    "messages": [
      {
        "role": "system",
        "content": "You qualify roofing leads, collect project details, and route the lead to the correct pipeline."
      }
    ]
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "voice_id_here"
  },
  "server": {
    "url": "https://your-domain.com/webhooks/vapi"
  }
}
```

If current Vapi SDK/API expects `serverUrl` instead of `server.url`, adapt to installed package/API version and document final chosen format.

## Server URL Events
Vapi Server URL event wrapper:
```json
{
  "message": {
    "type": "",
    "call": {},
    "timestamp": "2026-06-21T18:30:00Z"
  }
}
```

### Supported Event Types
- `status-update`
- `transcript`
- `tool-calls`
- `assistant-request`
- `end-of-call-report`
- `hang`
- `conversation-update`
- `speech-update`

Only these event types require meaningful responses:
- `assistant-request`
- `tool-calls`
- `transfer-destination-request`
- `knowledge-base-request`

### Status Update
```json
{
  "message": {
    "type": "status-update",
    "status": "in-progress",
    "call": {
      "id": "call_123"
    },
    "timestamp": "2026-06-21T18:30:00Z"
  }
}
```

### Transcript
```json
{
  "message": {
    "type": "transcript",
    "role": "user",
    "transcriptType": "final",
    "transcript": "I need a roof estimate.",
    "call": {
      "id": "call_123"
    }
  }
}
```

## Tool-Calls Responses
### Tool-Calls Event
```json
{
  "message": {
    "type": "tool-calls",
    "call": {
      "id": "call_123"
    },
    "toolCallList": [
      {
        "id": "tool_call_123",
        "name": "createLead",
        "parameters": {
          "name": "David",
          "phone": "+15551234567",
          "service": "roof inspection"
        }
      }
    ]
  }
}
```

### Tool-Calls Response
```json
{
  "results": [
    {
      "name": "createLead",
      "toolCallId": "tool_call_123",
      "result": "{\"leadId\":\"lead_123\",\"status\":\"created\"}"
    }
  ]
}
```

### Assistant Request Response
```json
{
  "assistantId": "your-saved-assistant-id"
}
```
Or:
```json
{
  "assistant": {
    "firstMessage": "Hi, how can I help today?",
    "model": {
      "provider": "openai",
      "model": "gpt-4.1-mini",
      "messages": [
        {
          "role": "system",
          "content": "You qualify roofing leads."
        }
      ]
    }
  }
}
```

Important: Respond to `assistant-request` within 7.5 seconds end-to-end. Prefer returning a saved `assistantId` quickly.

### End-of-Call Report
```json
{
  "message": {
    "type": "end-of-call-report",
    "endedReason": "customer-ended-call",
    "call": {
      "id": "call_123"
    },
    "artifact": {
      "recordingUrl": "https://example.com/recording.mp3",
      "transcript": "Customer asked for a roof inspection.",
      "messages": []
    }
  }
}
```

## Security
- Vapi supports secured server URLs using Custom Credentials and `credentialId`
- Do not invent a fake signature header
- Use HTTPS
- Optionally require an app-side shared secret header if configured

## Concurrency
- Outbound calling is constrained by org concurrency limits
- Queue calls if concurrency is exceeded

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All Vapi integrations are behind the `VAPI_INTEGRATION_ENABLED` feature flag.
- Support `assistant-request` and `tool-calls` response shapes.
- Store end-of-call reports.
- Do not invent unsupported signature logic.
- Do not log raw PII, tokens, auth headers, secrets, or full message bodies.
