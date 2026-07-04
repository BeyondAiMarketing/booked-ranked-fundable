# SerpApi Integration

## Official Docs
- https://serpapi.com/search-api
- https://serpapi.com/api-status-and-error-codes
- https://serpapi.com/manage-api-key

## Search Endpoint
`GET https://serpapi.com/search.json`

## Auth
Query param: `api_key=${SERPAPI_API_KEY}`

## Example Request
```
GET https://serpapi.com/search.json?engine=google&q=roofing+contractor+near+me&location=Los+Angeles,California,United+States&hl=en&gl=us&num=10&api_key=${SERPAPI_API_KEY}
```

## Parameters
- `engine`
- `q`
- `location`
- `google_domain`
- `hl`
- `gl`
- `num`
- `start`
- `api_key`

## Response Format
```json
{
  "search_metadata": {
    "id": "search_id",
    "status": "Success",
    "json_endpoint": "https://serpapi.com/searches/search_id.json",
    "created_at": "2026-06-21 18:30:00 UTC",
    "processed_at": "2026-06-21 18:30:01 UTC"
  },
  "search_parameters": {
    "engine": "google",
    "q": "roofing contractor near me",
    "location": "Los Angeles,California,United States",
    "hl": "en",
    "gl": "us"
  },
  "local_results": [
    {
      "position": 1,
      "title": "Example Roofing Company",
      "rating": 4.8,
      "reviews": 120,
      "phone": "+1 555-555-5555",
      "website": "https://example.com"
    }
  ],
  "organic_results": [
    {
      "position": 1,
      "title": "Example Roofing Contractor",
      "link": "https://example.com",
      "snippet": "Roof repair and replacement services."
    }
  ]
}
```

## Error Format
```json
{
  "error": "Invalid API key. Your API key should be here: https://serpapi.com/manage-api-key"
}
```

Search status may be `Processing`, `Queued`, `Success`, or `Error`. No webhook support needed.

## Rate Limits
- 429 can mean hourly throughput exceeded or account searches exhausted
- Quota depends on plan

## Implementation Notes
- This is an Internet Computer (IC) platform app. The Motoko backend makes HTTP outcalls to external APIs. Webhooks are received via IC HTTP handlers.
- All SerpApi integrations are behind the `SERPAPI_INTEGRATION_ENABLED` feature flag.
- Normalize top-level error.
- Capture `search_metadata.status`.
- Do not log raw PII, tokens, auth headers, secrets, or full message bodies.
