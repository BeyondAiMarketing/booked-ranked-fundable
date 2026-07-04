# OpenAI Integration

## Official Docs
- https://platform.openai.com/docs/api-reference/chat/create
- https://platform.openai.com/docs/api-reference/authentication
- https://developers.openai.com/api/docs/guides/rate-limits
- https://platform.openai.com/docs/guides/error-codes/api-errors

## Auth
Headers:
- `Authorization: Bearer ${OPENAI_API_KEY}`
- `Content-Type: application/json`
- Optional: `OpenAI-Organization: ${OPENAI_ORG_ID}`
- Optional: `OpenAI-Project: ${OPENAI_PROJECT_ID}`

## Endpoint
`POST https://api.openai.com/v1/chat/completions`

## Request Example
```json
{
  "model": "gpt-4.1-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are the LLM router for BRF."
    },
    {
      "role": "user",
      "content": "Write a 2-sentence roofing lead follow-up SMS."
    }
  ],
  "temperature": 0.3
}
```

## Response Example
```json
{
  "id": "chatcmpl_abc123",
  "object": "chat.completion",
  "created": 1710000000,
  "model": "gpt-4.1-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hi, this is a quick follow-up about your roofing project. Are you still looking for an estimate this week?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 42,
    "completion_tokens": 23,
    "total_tokens": 65
  }
}
```

## Rate Limit Headers
- `x-ratelimit-limit-requests`
- `x-ratelimit-limit-tokens`
- `x-ratelimit-remaining-requests`
- `x-ratelimit-remaining-tokens`
- `x-ratelimit-reset-requests`
- `x-ratelimit-reset-tokens`

## Error Codes
```json
{
  "error": {
    "message": "Rate limit reached for requests.",
    "type": "rate_limit_error",
    "param": null,
    "code": "rate_limit_exceeded"
  }
}
```

## Retry Strategy
- Retry 429 and 5xx only
- Do not retry 400, 401, 403 by default
- Use exponential backoff with jitter

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All OpenAI integrations are behind the `OPENAI_INTEGRATION_ENABLED` feature flag.
- Never expose `OPENAI_API_KEY` to the frontend.
- Normalize errors into `IntegrationError`.
- Capture rate headers for monitoring.
