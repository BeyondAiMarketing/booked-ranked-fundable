# OmniRouter Implementation

## Summary

OmniRouter is a universal AI dispatch layer added to the Booked Ranked Fundable (BRF)
platform. It sits above the existing LLM fallback chain and AI Orchestrator, providing
intelligent intent classification, optimal routing, BRF-branded prompting, and full
observability for any incoming AI task.

---

## What Was Done

### 1. Backend — Motoko (ICP canister)

#### New files

**`src/backend/types/omniRouter.mo`**
Pure data types for the OmniRouter:
- `IntentClass = Text` — Text alias (not variant) to avoid moc 1.10.1 stable-signature crash.
  Encoded values: `lead_management`, `email_outreach`, `content_creation`, `review_management`,
  `seo_optimization`, `analytics`, `funding_readiness`, `voice_outreach`, `general_assistant`.
- `RoutingTarget = Text` — `llm_direct` | `orchestrator`.
- `RoutingDecision` — intent, target, taskType, confidence, reasoning.
- `OmniRequest` — goal, tenantId, contextHint, maxBudget.
- `OmniResult` — structured response with routing metadata, provider, model, cost, timing.
- `RouteLogEntry` — append-only log entry for observability.
- `OmniRouterMetrics` — dashboard snapshot (totals, success rate, intent breakdown,
  provider breakdown).

**`src/backend/lib/omniRouter.mo`**
Core routing logic:
- `State` — in-memory ring log, counters, intent/provider breakdown arrays.
- `emptyState()` — initializes empty transient state.
- `classifyIntent(goal, contextHint)` — keyword-based classification across 8 intent domains.
  Zero LLM tokens consumed. Returns `(IntentClass, confidence: Float)`.
- `selectTarget(intent, goal)` — detects multi-step goals via sequencing keywords ("then",
  "and then", "followed by", goal length > 300 chars) and routes them to the orchestrator;
  single-step goals go llm_direct.
- `intentToTaskType(intent)` — maps intent → OpenRouter TaskType key for the cost-aware
  model selector (e.g. `email_outreach` → `OutreachCopy`, `review_management` → `ReviewResponse`).
- `buildMessages(goal, intent)` — builds (system, user) message pair with a BRF-branded
  system prompt tailored to the classified intent.
- `recordRequest(state, entry, success, duration)` — appends to route log ring (capped at 200),
  increments intent/provider counters.
- `getMetrics(state)` — returns `OmniRouterMetrics` snapshot.
- `recentLog(state, limit)` — returns last N route log entries.
- `resetMetrics(state)` — clears all metrics and log.

**`src/backend/mixins/omniRouter-api.mo`**
Public API mixin (4 endpoints):
- `omniRoute(request)` → `OmniResult` — main entry point. Classify → select target →
  map task type → resolve keys → build messages → execute via `LLMFb.route` (same
  provider chain as `routeLLMCall`) → log → return structured result.
- `getOmniRouterMetrics()` → `OmniRouterMetrics` — metrics snapshot for dashboard.
- `getOmniRoutingHistory(limit)` → `[RouteLogEntry]` — recent routing decisions.
- `resetOmniRouterMetrics()` — admin reset of all metrics.

Mixin parameters are all stabilizable types (no function closures): `omniRouterState`,
`llmFallbackState`, `integrationCreds`, `credSalt`, `transform`, `secretState`. This
avoids the moc 1.10.1 stable-signature crash (desugar.ml:1083).

#### Modified files

**`src/backend/main.mo`**

*OmniRouter wiring (new):*
```
import OmniRouterLib   "lib/omniRouter";
import OmniRouterMixin "mixins/omniRouter-api";
import OpenRouterTypes "types/openRouter";

let omniRouterState = OmniRouterLib.emptyState();
include OmniRouterMixin(omniRouterState, llmFallbackState, integrationCreds, credSalt, transform, ?secretState);
```
Inserted immediately after `include LLMFallbackMixin(...)`.

*`runOrchestrator` fully wired (previously a placeholder stub):*
Replaced the `"Orchestrator not yet wired — placeholder result"` stub with a complete
implementation that calls `AIOrchestratorLib.orchestrate` with all required callbacks:
- `routeLLMCb` — calls `LLMFallbackLib.route` for each sub-task.
- `resolveKeysCb` — reads encrypted credentials and resolves provider keys.
- `memReadCb` — reads memory context from `AIMemoryLib.buildContextText`.
- `memWriteCb` — writes sub-task outputs to `AIMemoryLib.writeMemory`.
- `auditCb` — appends an `AdminAuditEntry` with `#other("orchestrator")` action type.
- `rateLimitCb` — delegates to `RateLimiter.checkRateLimit` (100 req/min per tenant).
- `corrIdCb` — generates `"orch-{tenantId}-{timestamp}"` correlation IDs.

All callbacks are local async closures inside the `public shared` function body — NOT
mixin parameters — so they do not trigger the moc 1.10.1 stable-signature crash.

---

### 2. Frontend — React / TypeScript

#### New files

**`src/frontend/src/hooks/useOmniRouter.ts`**
React hook exposing:
- `submitGoal(goal, tenantId, contextHint?, maxBudget?)` — calls `actor.omniRoute`, maps
  Candid optional types (`[] | [T]`) to `T | null`, returns typed `OmniResult`.
- `fetchMetrics()` — calls `actor.getOmniRouterMetrics`, stores in state.
- `fetchHistory(limit)` — calls `actor.getOmniRoutingHistory`, maps entries.
- `resetMetrics()` — calls `actor.resetOmniRouterMetrics`.
- State: `result`, `isSubmitting`, `metrics`, `history`, `metricsLoading`,
  `historyLoading`, `error`.

Uses `(actor as any).omniRoute(...)` pattern (same as `useWorkflowLog.ts`) since bindings
are regenerated by `pnpm bindgen` at deploy time.

**`src/frontend/src/pages/OmniRouterPage.tsx`**
OmniRouter dashboard page (`/omni-router`):
- **Goal input** — `Textarea` + context hint `Select` (auto-detect or 8 explicit domains)
  + "Route & Execute" button.
- **Result card** — routing decision badges (intent, target, provider, model, confidence,
  estimated cost), routing reasoning, output text or error message.
- **Metrics row** — 4 stat cards: Total Requests, Success Rate, Avg Latency, Failed.
- **Intent breakdown** — bar chart showing request counts per intent class.
- **Provider breakdown** — bar chart showing request counts per LLM provider.
- **Routing history** — last 15 decisions with goal summary, badges, duration, time-ago.
- Admin "Reset Metrics" button.

#### Modified files

**`src/frontend/src/App.tsx`**
- Added `import OmniRouterPage` (alongside `AgentOrchestrationPage`).
- Added `omniRouterRoute = createRoute({ path: "/omni-router", ... })` (admin-protected).
- Registered `omniRouterRoute` in the `routeTree` array.

**`src/frontend/src/components/AppLayout.tsx`**
- Added `"/omni-router": "OmniRouter"` to the page title map.
- Added OmniRouter nav link (violet colour scheme, `Sparkles` icon) immediately below the
  "Agent Orchestration" link in the admin sidebar.

---

## Architecture Diagram

```
User / Frontend
      │
      ▼
┌─────────────────────────────────────────────────────────────┐
│  OmniRouter  (NEW)                                          │
│  • classifyIntent — keyword-based, zero LLM tokens         │
│  • selectTarget   — llm_direct | orchestrator              │
│  • buildMessages  — BRF-branded system prompt              │
│  • recordRequest  — metrics + route log ring               │
└──────────────┬──────────────────────────────────────────────┘
               │  llm_direct          orchestrator
               ▼                           ▼
┌──────────────────────────┐  ┌───────────────────────────────┐
│  LLM Fallback Chain      │  │  AI Orchestrator  (WIRED)     │
│  Nemotron → OpenRouter   │  │  plan → sub-tasks → retry     │
│  → OpenAI → Anthropic    │  │  → memory → audit → result    │
│  → Generic (OR + Gemini) │  └──────────────┬────────────────┘
└──────────────────────────┘                 │
               ▲                             │
               └─────────────────────────────┘
                  (both paths use LLM fallback chain)
```

## Layer Responsibilities

| Layer | Responsibility |
|---|---|
| **OmniRouter** | Intent classification, routing decision, BRF system prompts, metrics |
| **AI Orchestrator** | Multi-step goal decomposition, sub-task retry, memory, audit |
| **LLM Fallback Chain** | Provider selection (cost-aware), health tracking, retry, route log |
| **BRF Tools** | Lead Engine, Email, SEO, Voice, CRM — unchanged |

## Provider Chain (unchanged)

```
Nemotron (NVIDIA NIM) → OpenRouter → OpenAI → Anthropic → Generic (OpenRouter gpt-4o-mini + Gemini)
```

Cost-aware selection, health-based skipping, exponential backoff retry — all inherited from
the existing `lib/llm-fallback.mo`.

---

## How to Use

### Frontend

Navigate to **OmniRouter** in the admin sidebar (below "Agent Orchestration").

1. Enter a goal in natural language.
2. Optionally select a context hint to override auto-detection.
3. Click "Route & Execute".
4. View the routing decision, output, and metrics.

### Backend API

```typescript
// Route a goal through OmniRouter
const result = await actor.omniRoute({
  goal: "Write a follow-up email for leads who attended the home valuation webinar",
  tenantId: "my-tenant",
  contextHint: ["email"],  // Candid optional
  maxBudget: [],           // Candid optional
});

// Get metrics
const metrics = await actor.getOmniRouterMetrics();

// Get recent routing history
const history = await actor.getOmniRoutingHistory(20n);

// Admin reset
await actor.resetOmniRouterMetrics();
```

---

## Key Design Decisions

1. **Text aliases for variant types** — `IntentClass` and `RoutingTarget` are `Text` aliases
   (not Motoko variants) to avoid the moc 1.10.1 desugar crash when they appear in public
   shared function signatures. This follows the same pattern used for `ValidationStatus` and
   `TaskValidator` in `types/ai-orchestrator.mo`.

2. **No replacement of existing entry points** — `routeLLMCall`, `testNemotronPrompt`, and all
   14 existing LLM call sites are unchanged. OmniRouter is a new entry point alongside them.

3. **Callbacks as local closures in main.mo** — The `runOrchestrator` callbacks are defined as
   local `async` closures inside the public function body, NOT as mixin parameters. This avoids
   the moc 1.10.1 stable-signature crash that occurs when non-stabilizable function types appear
   as mixin parameters (which become stable actor fields).

4. **Zero-token intent classification** — Intent classification is keyword-based (no LLM call).
   This keeps routing overhead near zero and makes the dispatch layer deterministic.

5. **Mixin parameters are stabilizable** — `OmniRouterMixin` parameters are: state records,
   Maps, Blob, and a `shared query` function reference. All are stabilizable by `--default-persistent-actors`.
