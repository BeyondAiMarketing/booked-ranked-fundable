# Builder.io Integration Plan — BRF Platform

**Document type:** Implementation plan (documentation-only deliverable)
**Status:** Draft — pending user approval before any implementation begins
**Date:** 2026-07-09
**Scope:** Connect Builder.io as a visual content creation layer to the existing BRF (Business Revenue Framework) platform. BRF remains the source of truth; Builder.io is an additive, feature-flagged, rollback-ready integration.

> **Approval gate:** No implementation code (no Motoko modules, no React components, no service files) is to be written until the user reviews and approves this plan. The next round, after approval, begins Phase A implementation.

---

## Table of Contents

1. [Item 1 — Current BRF Architecture Impact](#item-1--current-brf-architecture-impact)
2. [Item 2 — Required Files / Modules](#item-2--required-files--modules)
3. [Item 3 — API Integration Points](#item-3--api-integration-points)
4. [Item 4 — Data Flow](#item-4--data-flow)
5. [Item 5 — Migration Steps](#item-5--migration-steps)
6. [Item 6 — Testing Requirements](#item-6--testing-requirements)
7. [Security & Multi-Tenancy Plan](#security--multi-tenancy-plan)
8. [MCP Usage Plan](#mcp-usage-plan)
9. [Rollout Summary & Approval Checklist](#rollout-summary--approval-checklist)

---

## Item 1 — Current BRF Architecture Impact

### 1.1 Integration Boundary (Non-Negotiable)

BRF remains the **source of truth** for all business logic, data, AI orchestration, tenant isolation, and audit. Builder.io is a **connected content and visual creation layer only**. Specifically:

- **BRF owns:** tenant identity, business data, AI analysis, lead engine, webhook inbox, encrypted secrets, audit trails, pricing, deploy-verification gate.
- **Builder.io owns:** visual editing surface, content blocks JSON storage, publish/unpublish lifecycle, scheduled content, the visual editor UX.
- **Builder.io does NOT own:** any BRF business record, any tenant credential, any AI decision, any lead/funnel state. Builder.io content references BRF data by ID only; BRF never cedes authority over a business record to Builder.io.

The 11 approved BRF components (see §2.3) are the **only** components Builder.io may render. No Builder built-in components (Image, Button, Columns, etc.) are registered or permitted in BRF pages. The AI orchestrator may select **only** from this approved set.

### 1.2 Existing BRF Systems That Must Remain Intact

The integration must not regress any of the following systems. Each is listed with its current location and the invariants the Builder.io work must preserve.

| # | System | Location | Invariant to preserve |
|---|--------|----------|----------------------|
| 1 | Lead Engine Steps 1-4 | `src/backend/main.mo` + lead mixins | Lead capture → enrichment → scoring → routing pipeline unchanged |
| 2 | LLM fallback chain | `lib/llm-fallback.mo` (route to OpenAI/Anthropic/Ollama/LiteLLM) | Provider routing, retry, fallback order untouched |
| 3 | Webhook inbox | `lib/webhookInbox.mo` (627 lines, unified normalized event store) | Existing per-source receivers (Twilio, Instantly, Smartlead) keep working; Builder webhook is a new source, not a replacement |
| 4 | Outbound webhook delivery | `lib/webhooksAndIntegrations.mo` | Shared-secret verification + IP allowlist + rate limiting pattern reused for Builder inbound |
| 5 | Roofer cold email campaign | cold email mixins in `main.mo` | Campaign flows unchanged |
| 6 | Caffeine email relay | `lib/email.mo` + EmailMixin | Transactional email path untouched |
| 7 | 4-tier pricing | pricing mixins | Pricing tiers and gating unchanged |
| 8 | Deploy-verification gate | `deploy-production.sh`, `project.json` | `mops check`, `pnpm typecheck`, `pnpm build`, `pnpm fix` must all pass before draft deploy |
| 9 | Simplified auth | `lib/accessControl.mo` (isAdmin/hasPermission) | Auth model unchanged; Builder paths reuse same checks |
| 10 | Centralized AI prompts | `lib/ai-orchestrator.mo` (545 lines) | Prompt registry and orchestration workflow reused for Builder content generation |
| 11 | Repository layer w/ tenant isolation | repository mixins, per-tenant Map nesting | `hasAccessToTenant(caller, tenantId)` checked before every Builder outcall |
| 12 | Plugin architecture scaffold | plugin mixins | Scaffold not extended or broken by Builder work |
| 13 | Encrypted secrets w/ rotation | `lib/secretManager.mo` + `lib/integrationCredentials.mo` | Builder keys stored via same `obfuscateWithSecret`/`deobfuscateWithSecret` path; rotation endpoint reused |
| 14 | Rate limiting | `lib/rateLimiter.mo` | Builder outcalls pass through same rate limiter |
| 15 | Audit trails | `lib/auditLog.mo` (append-only, StableJsonStore, OQL-exposed) | Every Builder operation logged; `redactSecrets()` applied to all payloads |
| 16 | Observability / health endpoint | `lib/observability.mo` | Health endpoint reports Builder flag status; no new health surface |
| 17 | AI Orchestrator + 8-level memory | `lib/ai-orchestrator.mo`, `lib/ai-memory.mo` | Orchestrator workflow reused to generate Builder content; memory layer stores Builder content artifacts |

### 1.3 Existing Website/Funnel Files — Pattern Extraction (NOT Code Migration)

This is a **functionality migration, not a code migration**. The following files are analyzed to extract patterns (section schemas, copywriting frameworks, component shapes) that inform the 11 approved Builder components and the AI content generation. **No code from these files is ported.** The files continue to exist and function unchanged behind the feature flag.

| File | Patterns to extract | Used for |
|------|--------------------|----------| 
| `src/frontend/src/data/nicheWebsiteData.ts` | 10 niches; 12 `SectionType` variants: `hero`, `services`, `stats`, `testimonials`, `trust`, `about`, `process`, `faq`, `contact`, `cta_banner`, `before_after`, `certifications`; `NicheWebsiteSection.content` shape (`Record<string, string \| string[] \| Record<string,string>[]>`) | Defines the field schemas for the 11 approved Builder components (Hero, Services, CTA, Lead Form, Booking, Reviews, FAQ, Financing, SEO, Before/After, Contact) |
| `src/frontend/src/data/landingPageData.ts` | 7 `SectionType`: `hero`, `features`, `testimonials`, `form`, `cta`, `pricing`, `faq`; 5 `NicheTemplate`s; `FormField` shape (`name/phone/email/service/address/message`) | Lead Form component inputs; pricing/financing component fields |
| `src/frontend/src/lib/websiteAgentEngine.ts` | 10 `FrameworkName`: Hormozi, Kennedy, Ogilvy, Halbert, Schwartz, Abraham, Sugarman, Hopkins, Deiss, Suby; 5 `OfferFramework`: value_stack, before_after_bridge, pastor, benefit_driven, credibility_first; 4 `CtaStyle`: direct_ask, curiosity_hook, social_proof, urgency_trigger; 6 AI tools (deterministic, no external API) | AI orchestrator content generation: framework selection → copy variants → Builder block JSON |
| `src/frontend/src/lib/websiteAnalyticsEngine.ts` | Simulated analytics shape | Post-publish performance hooks (read-only, no migration) |
| `src/frontend/src/lib/websiteVersionHistory.ts` | localStorage 20-version cap pattern | Informs Builder draft/publish versioning (Builder handles its own versioning; BRF audit log records versions) |
| `src/frontend/src/components/NicheWebsiteRenderer.tsx` (1167 lines) | 12 section components, `EditableText`, `PageNav`, token replacement | Component prop shapes for the 11 approved Builder components; visual structure reference |
| `src/frontend/src/components/FunnelFlowBuilder.tsx` (507 lines) | 4 `FunnelStepType`: `landing`, `thank-you`, `upsell`, `booking-confirmation`; `crmTrigger` mapping | Booking + Lead Form component CRM trigger wiring |
| `src/backend/lib/funnelTracking.mo` | Funnel conversion tracking | Webhook → funnel tracking integration on publish |
| `src/frontend/src/pages/LandingPageBuilderPage.tsx` (1522+ lines) | localStorage persistence (`brf_landing_pages`), builder UX patterns | Builder editor launcher UX reference (not ported) |

### 1.4 Feature Flag & Rollback Strategy

**Flag:** `BUILDER_IO_ENABLED` (added to the existing feature-toggle system in `lib/toolkitToggles.mo` / feature-toggle mixin).

- **Default:** `disabled` (false). All Builder.io code paths short-circuit when disabled.
- **Granularity:** Per-tenant override capable (the existing feature-toggle system supports per-tenant flags). A tenant must have the flag enabled AND have valid stored credentials before any Builder outcall fires.
- **Rollback procedure:** Set `BUILDER_IO_ENABLED = false` (globally or per-tenant). Effects:
  - All Builder.io backend service methods return early with a "feature disabled" result — no http-outcalls fire.
  - Frontend `builderEditorLauncher` and `builderCredentialsForm` render a disabled state; `builderRenderer` falls back to the existing `NicheWebsiteRenderer` / `LandingPageBuilderPage` rendering.
  - Existing website/funnel pages continue to work unchanged (they are not gated by this flag).
  - No data loss: Builder content already created remains in Builder.io's store; BRF audit log retains all records.
- **Backward compatibility:** No existing route is removed. No existing public backend method signature changes (Builder methods are additive). No existing frontend page is deleted. The `pnpm bindgen` regeneration adds new methods without removing old ones.

### 1.5 HTTP-Outcall Pattern Conformance

The BRF backend has **76 http-outcall call sites** all using `mo:caffeineai-http-outcalls/Outcall` (`httpGetRequest`/`httpPostRequest`) with a **single shared `transform` query func** defined in `main.mo` (line ~1450):

```motoko
import Outcall "mo:caffeineai-http-outcalls/outcall";
// ...
public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
  Outcall.transform(input);
};
```

Every mixin that performs http-outcalls receives `transform` as a parameter (e.g., `include LLMFallbackMixin(llmFallbackState, integrationCreds, credSalt, transform)`).

**All new Builder.io outcalls conform to this exact pattern:**

- `builderClient.mo`, `builderContentService.mo`, `builderSpaceService.mo` are written as **mixin modules** (or, if the moc 1.10.1 stable-signature crash is triggered, as lib modules invoked from `main.mo` with `transform` passed in — same workaround documented in `docs/PHASE3_1_REPORT.md` for the AI orchestrator).
- Each Builder outcall uses `Outcall.httpGetRequest` or `Outcall.httpPostRequest` with the shared `transform` func.
- All Builder outcalls are gated by `BUILDER_IO_ENABLED` AND per-tenant credential presence.
- All Builder outcalls pass through `rateLimiter.mo`.
- All Builder outcall responses are sanitized before logging (secrets redacted via `auditLog.redactSecrets()`).

**No new mops dependency is added for http-outcalls** — `caffeineai-http-outcalls 0.1.2` is reused. The only new dependency is the frontend `@builder.io/react/lite` package (see §2.5).

---

## Item 2 — Required Files / Modules

### 2.1 Backend Motoko Modules

All new backend modules live under `src/backend/lib/` and follow the existing mixin-or-direct-in-main pattern. Given the moc 1.10.1 stable-signature crash risk (documented in `docs/PHASE3_1_REPORT.md`), the implementer will decide per-module whether to use a mixin or define public functions directly in `main.mo`. The plan specifies both the module file and its responsibility.

| Module file | Responsibility | Reuses |
|-------------|---------------|--------|
| `src/backend/lib/builderClient.mo` | Low-level Builder.io API auth + http-outcall wrapper. Provides `builderGet` / `builderPost` / `builderPut` / `builderPatch` helpers that inject `Authorization: Bearer <PRIVATE_KEY>` (resolved per-tenant via `integrationCredentials.deobfuscateWithSecret`), set `Content-Type: application/json`, and route through `Outcall` + shared `transform`. Handles Builder API error responses and rate-limit headers. | `caffeineai-http-outcalls/Outcall`, `integrationCredentials.mo`, `secretManager.mo`, `rateLimiter.mo` |
| `src/backend/lib/builderContentService.mo` | Create / update / publish content via the Builder.io Write API. Methods: `createContent(tenantId, modelName, blocksJson)`, `updateContent(tenantId, contentId, blocksJson, mode)` where mode ∈ {`put` (full replace), `patch` (partial, `triggerWebhooks=false`), `publish`, `unpublish`}. Returns content ID + version. | `builderClient.mo`, `auditLog.mo`, `accessControl.mo` (hasAccessToTenant) |
| `src/backend/lib/builderSpaceService.mo` | Tenant → Builder Space mapping. Stores `TenantId → SpaceId` in the repository layer (per-tenant Map nesting). Methods: `getOrCreateSpace(tenantId)`, `mapSpace(tenantId, spaceId)`, `duplicateSpace(fromTenantId, toTenantId)` (Admin API space duplication). Programmatic space creation uses the Admin API. | `builderClient.mo` (Admin API), `auditLog.mo`, repository layer |
| `src/backend/lib/builderWebhookHandler.mo` | Inbound webhook receiver for Builder.io events. Extends the existing hardened http handler pattern from `webhooksAndIntegrations.mo`: shared-secret verification (constant-time compare), optional IP allowlist (Builder.io's documented webhook source IPs), rate limiting. Normalizes the Builder webhook payload into the existing `webhookInbox.mo` unified event store as a new `builder` source. | `webhooksAndIntegrations.mo`, `webhookInbox.mo`, `rateLimiter.mo`, `auditLog.mo` |
| `src/backend/lib/builderComponentRegistry.mo` | Approved component definitions. A static registry of the 11 approved BRF components, each with: `name`, `builderModelName`, `inputs` (array of `{name, type, defaultValue, friendlyName, description}`), `brfSectionType` (maps to the `nicheWebsiteData.ts` SectionType). This is the single source of truth for what the AI orchestrator may select and what the frontend registers. | None (pure data module) |
| `src/backend/lib/builderAuditAdapter.mo` | Audit log integration. Wraps `auditLog.mo` to emit a `BuilderAction` audit variant for every Builder operation (create/update/publish/unpublish/webhook-received/space-created/credential-rotated). Each entry: `tenantId`, `action`, `timestamp`, `redactedPayload` (secrets stripped via `redactSecrets()`), `builderContentId?`, `builderSpaceId?`. | `auditLog.mo` |

**Public API surface added to `main.mo`** (additive, no existing method changed):
- `builderGetContent(tenantId, contentId)` — query
- `builderCreateContent(tenantId, modelName, blocksJson)` — update
- `builderUpdateContent(tenantId, contentId, blocksJson, mode)` — update
- `builderPublishContent(tenantId, contentId)` — update
- `builderGetOrCreateSpace(tenantId)` — update
- `builderSetCredentials(tenantId, publicKey, privateKey)` — update (stores encrypted)
- `builderGetCredentialsStatus(tenantId)` — query (returns boolean presence, never the keys)
- `builderReceiveWebhook(payload, signature)` — update (the inbound webhook endpoint)

All gated by `BUILDER_IO_ENABLED` and `hasAccessToTenant`.

### 2.2 Frontend React Modules

All new frontend modules live under `src/frontend/src/`. They use `@builder.io/react/lite` (components-only — no Builder built-in components, no Builder SDK rendering of arbitrary content).

| Module file | Responsibility |
|-------------|---------------|
| `src/frontend/src/integrations/builder/builderComponentRegistration.ts` | Calls `Builder.registerComponent(...)` from `@builder.io/react/lite` for each of the 11 approved components. Each registration specifies `name`, `inputs` (matching `builderComponentRegistry.mo` definitions and the existing `nicheWebsiteData.ts` section schemas), and `defaultChildren`/`defaults`. This module runs once at app init when `BUILDER_IO_ENABLED` is on. |
| `src/frontend/src/integrations/builder/builderRenderer.tsx` | Wraps `<BuilderComponent>` from `@builder.io/react/lite`. Loads content by `contentId` using the tenant's **Public** API key (client-safe). Falls back to `NicheWebsiteRenderer` when the flag is off or content is missing. Exposes a `BuilderRenderer({ tenantId, contentId })` component. |
| `src/frontend/src/integrations/builder/builderCredentialsForm.tsx` | Per-tenant runtime API key entry UI. Two fields: Public Key, Private Key. On submit, calls `builderSetCredentials(tenantId, publicKey, privateKey)` backend method. The Private Key is sent to the backend over the existing authenticated channel and never stored client-side. Shows `builderGetCredentialsStatus` (presence only). **Note:** This is the credentials form UI only — it is in scope. The broader "tenant credentials form UI implementation" for arbitrary providers is excluded by `doNotBuild`. |
| `src/frontend/src/integrations/builder/builderEditorLauncher.tsx` | Visual editing entry point. A button/link that, when `BUILDER_IO_ENABLED` is on and the tenant has credentials, opens the Builder.io visual editor for a given `contentId` (deep-link with the tenant's Public API key). When the flag is off, this component renders nothing. |

**Routes:** No new top-level routes are added in this plan. The Builder editor launcher and credentials form are surfaced as sections within existing pages (e.g., a "Visual Editor" tab on `/website-studio` and a "Builder.io" panel on the existing settings page). The existing routes `/landing-pages`, `/website-studio`, `/website-agent`, `/website-agent-settings`, `/preview/$previewId`, `/my-website` remain unchanged.

### 2.3 The 11 Approved BRF Components

These are the **only** components registered with Builder.io and the **only** components the AI orchestrator may select. Each maps to an existing `nicheWebsiteData.ts` SectionType (or a composite of section types) so the AI content generation can reuse existing schemas.

| # | Component name | Builder model name | Maps to BRF SectionType(s) | Key Builder inputs (name: type → default) |
|---|----------------|--------------------|----------------------------|--------------------------------------------|
| 1 | Hero | `brf-hero` | `hero` | `headline: text → ""`, `subheadline: text → ""`, `ctaLabel: text → "Get a Free Quote"`, `ctaHref: text → "#lead-form"`, `backgroundImage: text → ""`, `niche: text → "roofing"` |
| 2 | Services | `brf-services` | `services` | `title: text → "Our Services"`, `services: list → [{name: text, description: text, icon: text}]`, `columns: number → 3` |
| 3 | CTA | `brf-cta` | `cta_banner` | `headline: text`, `buttonLabel: text → "Call Now"`, `buttonHref: text → "tel:"`, `urgency: text → ""` |
| 4 | Lead Form | `brf-lead-form` | `contact` + `landingPageData.form` | `title: text → "Get Your Free Estimate"`, `fields: list → [{type: text(name/phone/email/service/address/message), label: text, placeholder: text, required: boolean}]`, `submitLabel: text → "Send"`, `crmTrigger: text → "new_lead"` |
| 5 | Booking | `brf-booking` | `FunnelFlowBuilder.booking-confirmation` | `title: text → "Book Your Appointment"`, `calendarLabel: text`, `confirmationMessage: text`, `crmTrigger: text → "booking_confirmed"` |
| 6 | Reviews | `brf-reviews` | `testimonials` | `title: text → "What Our Customers Say"`, `reviews: list → [{author: text, rating: number, body: text, source: text}]`, `maxDisplay: number → 6` |
| 7 | FAQ | `brf-faq` | `faq` | `title: text → "Frequently Asked Questions"`, `items: list → [{question: text, answer: text}]` |
| 8 | Financing | `brf-financing` | `landingPageData.pricing` | `title: text → "Flexible Financing Options"`, `plans: list → [{name: text, price: text, period: text, features: list, ctaLabel: text}]`, `highlightedPlan: number → 1` |
| 9 | SEO | `brf-seo` | (meta, not a visible section) | `title: text`, `description: text`, `keywords: list`, `ogImage: text`, `canonicalUrl: text` |
| 10 | Before/After | `brf-before-after` | `before_after` | `title: text → "See the Difference"`, `items: list → [{beforeImage: text, afterImage: text, caption: text}]` |
| 11 | Contact | `brf-contact` | `contact` | `title: text → "Contact Us"`, `phone: text`, `email: text`, `address: text`, `hours: text`, `mapEmbedUrl: text` |

Each input's `defaultValue` and shape is derived from the corresponding section's `content` field in `nicheWebsiteData.ts` / `landingPageData.ts`. The `builderComponentRegistry.mo` backend module and the `builderComponentRegistration.ts` frontend module must define **identical** input sets so the AI orchestrator and the visual editor agree on schema.

### 2.4 Credential Storage Reuse

Builder.io credentials (Public + Private API keys) reuse the existing Phase 2 encrypted-secret infrastructure. **No hardcoded keys.**

- **Storage path:** `builderSetCredentials(tenantId, publicKey, privateKey)` → `integrationCredentials.obfuscateWithSecret(privateKey, credSalt, secretManagerState)` → stored in the tenant's `IntegrationCredentials` record (two new fields: `builderPublicKey: Text` (stored as-is, it is public) and `builderPrivateKey: Text` (stored encrypted, ciphertext format `v1:<secretId>:<hex>`)). The Public key is non-secret and stored plaintext; the Private key (`bpk`-prefixed) is always encrypted at rest.
- **Retrieval path:** Before any Builder outcall, `builderClient.mo` calls `integrationCredentials.deobfuscateWithSecret(builderPrivateKey, credSalt, secretManagerState)` to resolve the Private key in-memory for the duration of the outcall. The decrypted key is never persisted, never logged, never returned to the frontend.
- **Rotation:** The existing `rotateSecret` endpoint (in `secretManager.mo`) rotates the underlying managed secret; all encrypted Builder keys are re-encrypted under the new secret automatically (the `v1:<id>:<hex>` format embeds the secret ID, so old ciphertext remains decryptable until retired). A dedicated `builderRotateCredentials(tenantId)` method re-stores a new key pair.
- **Frontend visibility:** `builderGetCredentialsStatus(tenantId)` returns only `{ public: boolean, private: boolean }` — never the keys themselves. The frontend `builderCredentialsForm` shows presence and lets the tenant overwrite; it never displays a stored Private key.

### 2.5 Dependency Additions

**Frontend (`src/frontend/package.json`):**
- Add `@builder.io/react/lite` (components-only build; smaller bundle; no Builder SDK rendering of arbitrary content). Installed via `pnpm add @builder.io/react/lite` (protected file — use `pnpm`, not manual edit).

**Backend (`mops.toml`):**
- **No new mops dependencies.** The Builder.io outcalls reuse the existing `caffeineai-http-outcalls 0.1.2`. No new mops package is needed.

**No other dependency changes.** The integration uses the existing React 19, TanStack Router/Query, Radix UI, and Tailwind 3.4 stack already in `src/frontend/package.json`.

---

## Item 3 — API Integration Points

### 3.1 Builder.io Write API (content creation / update / publish)

- **Base URL:** `https://builder.io/api/v1/write/MODEL`
- **Auth:** `Authorization: Bearer <PRIVATE_KEY>` (the `bpk`-prefixed Private key, resolved per-tenant from encrypted storage).
- **Methods:**
  - `POST /api/v1/write/MODEL` — create new content. Body: `{ blocks: [...], data: {...}, name: "...", published: false }`. Returns the new content ID + version.
  - `PUT /api/v1/write/MODEL/{id}` — full replace. Replaces the entire content body.
  - `PATCH /api/v1/write/MODEL/{id}` — partial update. Body includes only changed fields. Use `triggerWebhooks=false` in the body when the update should NOT fire webhooks (e.g., AI-generated draft updates that the tenant hasn't reviewed).
  - Publish/unpublish are state transitions on the content object (set `published: true` / `published: false`).
- **BRF service mapping:** `builderContentService.mo` → Write API. All calls go through `builderClient.mo` for auth + http-outcall.
- **Outcall conformance:** Uses `Outcall.httpPostRequest` / `Outcall.httpPutRequest` / `Outcall.httpPatchRequest` (or the equivalent POST-with-method-override per the Outcall module's API) with the shared `transform` func. Gated by `BUILDER_IO_ENABLED` + tenant credentials + `hasAccessToTenant`.

### 3.2 Builder.io Content API (read — published content)

- **Base URL:** `https://cdn.builder.io/api/v3/content/MODEL?apiKey=<PUBLIC_KEY>`
- **Auth:** API key passed as `apiKey` query param (the Public key — client-safe).
- **Method:** `GET`.
- **Use:** The frontend `builderRenderer.tsx` uses this via `@builder.io/react/lite`'s `<BuilderComponent>` (which fetches content by `contentId` + Public API key). The backend does NOT call the Content API for published reads — the frontend fetches directly from Builder's CDN. The backend only uses the Write API and Admin API.
- **Outcall conformance:** Frontend fetch (browser-side) — not a backend http-outcall. The backend's `builderGetContent` query method is for draft/preview reads via the Write API, not the public CDN.

### 3.3 Builder.io Admin API (GraphQL — space + model + webhook management)

- **Base URL:** `https://cdn.builder.io/api/v2/admin`
- **Auth:** Private Key (`bpk` prefix) as `Authorization: Bearer <PRIVATE_KEY>`.
- **Operations (GraphQL):**
  - Space creation: create a new Space for a tenant.
  - Space duplication: duplicate an existing template Space (for industry-specific templates — though template expansion is out of scope per `doNotBuild`, the duplication primitive is in scope for tenant onboarding).
  - Model management: ensure the 11 `brf-*` models exist in the tenant's Space (created on first space provisioning).
  - Webhook registration: register the BRF webhook URL + shared secret for the tenant's Space so Builder.io posts events on publish/unpublish/archive/delete/scheduledStart/scheduledEnd.
- **BRF service mapping:** `builderSpaceService.mo` → Admin API. All calls through `builderClient.mo`.
- **Outcall conformance:** `Outcall.httpPostRequest` (GraphQL is POST) with shared `transform`. Gated by flag + credentials + tenant access.

### 3.4 Builder.io Webhook Contract (inbound to BRF)

Builder.io posts webhooks to a BRF URL on content lifecycle events.

- **Trigger events:** `publish`, `unpublish`, `archive`, `delete`, `scheduledStart`, `scheduledEnd`.
- **Payload shape:**
  ```json
  {
    "newValue": { ... },          // new content state; null on delete
    "previousValue": { ... },     // prior state; null on first publish
    "modelName": "brf-hero",
    "operation": "publish",
    "id": "<contentId>"
  }
  ```
  - `newValue === null` → deletion.
  - `previousValue === null` → first publish.
- **BRF receiver:** `builderWebhookHandler.mo` exposes `builderReceiveWebhook(payload, signature)` on `main.mo`. Verification:
  1. **Shared-secret:** Builder.io signs the payload with a per-tenant shared secret (configured during webhook registration via the Admin API). `builderWebhookHandler` does a constant-time compare of the signature header against a recomputed HMAC. **Note:** Motoko lacks HMAC-SHA256 (documented limitation in `webhooksAndIntegrations.mo`); the existing pattern uses a shared-secret token + IP allowlist + rate limiting as the verification stack. The Builder webhook uses the same stack — the shared secret is sent in a header and compared constant-time; the request must originate from Builder.io's documented webhook source IPs; rate-limited per source.
  2. **IP allowlist:** Optional, configurable per tenant (Builder.io's webhook egress IPs).
  3. **Rate limiting:** `rateLimiter.mo` caps per-source webhook throughput.
- **Normalization:** The verified payload is normalized into the existing `webhookInbox.mo` unified event store as a new `builder` source (alongside `twilio`, `instantly`, `smartlead`). This lets the existing webhook inbox UI and OQL queries see Builder events without a new surface.
- **Audit:** `builderAuditAdapter.mo` logs every received webhook (redacted).

### 3.5 Service → Endpoint Map

| BRF service | Builder.io endpoint | Direction |
|-------------|---------------------|-----------|
| `builderClient.mo` | All endpoints (auth wrapper) | Outbound |
| `builderContentService.mo` | Write API (`/api/v1/write/MODEL`) | Outbound |
| `builderSpaceService.mo` | Admin API (`/api/v2/admin`, GraphQL) | Outbound |
| `builderWebhookHandler.mo` | Webhook receiver (BRF URL) | Inbound |
| Frontend `builderRenderer.tsx` (`<BuilderComponent>`) | Content API (`/api/v3/content/MODEL`) | Outbound (browser) |

### 3.6 Outcall Conformance Summary

All Builder.io outcalls (Write API, Admin API) reuse:
- `mo:caffeineai-http-outcalls/Outcall` (`httpGetRequest` / `httpPostRequest`).
- The single shared `transform` query func in `main.mo` (line ~1450).
- The same mixin-or-direct-in-main pattern as the 76 existing call sites.
- The same feature-flag gating (`BUILDER_IO_ENABLED`).
- The same rate limiter (`rateLimiter.mo`).
- The same audit logging (`auditLog.mo` via `builderAuditAdapter.mo`).

No new http-outcall mechanism is introduced.

---

## Item 4 — Data Flow

### 4.1 End-to-End AI-to-Builder Workflow

```
Business data (tenant onboarding)
   │
   ▼
AI analysis (existing AI Orchestrator: lib/ai-orchestrator.mo)
   │  uses 10 copywriting frameworks (websiteAgentEngine.ts)
   │  + 5 offer frameworks + 4 CTA styles
   ▼
Website/funnel blueprint (section list + per-section copy)
   │  section types drawn from the 12 nicheWebsiteData SectionTypes
   │  + 7 landingPageData SectionTypes + 4 FunnelStepTypes
   ▼
Component selection (from the 11 approved components only)
   │  builderComponentRegistry.mo is the allowed-set source of truth
   ▼
Structured Builder content (blocks JSON)
   │  each block = one approved component with its inputs populated
   ▼
Builder Write API creation (builderContentService.mo → POST /api/v1/write/MODEL)
   │  draft (published: false), triggerWebhooks=false on AI drafts
   ▼
Editable customer website (tenant opens Builder visual editor via builderEditorLauncher)
   │  tenant reviews/edits the AI-generated draft
   ▼
Publish (tenant clicks publish in Builder, OR builderPublishContent backend method)
   │  published: true → webhook fires
   ▼
Content API serves published version (frontend builderRenderer.tsx via <BuilderComponent>)
   │  BRF webhook handler updates local state + audit trail
```

### 4.2 Tenant Credential Flow

```
Tenant enters Public + Private API keys in builderCredentialsForm (frontend)
   │  Private key never leaves the browser except over the authenticated BRF channel
   ▼
builderSetCredentials(tenantId, publicKey, privateKey) (backend, update method)
   │  hasAccessToTenant(caller, tenantId) checked first
   ▼
integrationCredentials.obfuscateWithSecret(privateKey, credSalt, secretManagerState)
   │  SecretManager.encrypt → ciphertext "v1:<secretId>:<hex>"
   ▼
Stored in tenant's IntegrationCredentials record
   │  builderPublicKey: Text (plaintext, public)
   │  builderPrivateKey: Text (encrypted)
   ▼
Per-request retrieval (on any Builder outcall):
   │  builderClient.mo → integrationCredentials.deobfuscateWithSecret(...)
   │  decrypted key lives in-memory for the outcall duration only
   │  never logged (auditLog.redactSecrets strips it)
   │  never returned to frontend
```

### 4.3 Tenant Isolation Flow

```
Any Builder operation requested for tenantId
   │
   ▼
hasAccessToTenant(caller, tenantId) check (accessControl.mo)
   │  if fail → return error, log audit "access_denied", no outcall
   ▼
builderSpaceService resolves TenantId → SpaceId (repository layer, per-tenant Map)
   │  every content operation scoped to that Space
   ▼
builderClient.mo injects the tenant's Private key + scopes the call to the tenant's Space
   │
   ▼
Cross-tenant access prevented: a caller authorized for tenant A cannot read/write
tenant B's Builder content because (a) hasAccessToTenant fails for B, and (b) the
Space ID resolved is A's Space, not B's.
```

### 4.4 Visual Editing Flow

```
BRF frontend loads builderRenderer.tsx with tenantId + contentId
   │  BUILDER_IO_ENABLED on + tenant has credentials
   ▼
<BuilderComponent> fetches content via Content API (tenant Public key, browser-side)
   │  renders the 11 approved components only (registered via builderComponentRegistration.ts)
   ▼
Tenant clicks "Edit in Builder" (builderEditorLauncher)
   │  deep-links to Builder.io visual editor for that contentId
   ▼
Tenant edits in Builder visual editor → saves → Builder stores the change
   │  (Builder.io is the content store for the visual layer)
   ▼
Builder.io fires webhook (publish/unpublish) → BRF builderWebhookHandler
   │  verified via shared-secret + IP allowlist + rate limit
   ▼
BRF audit log records the change (builderAuditAdapter → auditLog.mo, redacted)
   │  webhookInbox stores the normalized event
```

### 4.5 Publishing Flow

```
Draft content created via Write API (published: false, triggerWebhooks=false)
   │  AI-generated or tenant-created draft
   ▼
Tenant reviews in Builder visual editor
   │  may edit blocks, reorder, change copy
   ▼
Publish action (in Builder editor OR via builderPublishContent backend method)
   │  published: true
   ▼
Builder.io fires publish webhook → BRF builderWebhookHandler
   │  newValue = published content, previousValue = prior (null if first publish)
   ▼
BRF updates local state (webhookInbox event) + audit trail (builderAuditAdapter)
   │  funnelTracking.mo may record the publish as a funnel event
   ▼
Content API serves the published version to all visitors
   │  frontend builderRenderer.tsx renders via <BuilderComponent>
```

---

## Item 5 — Migration Steps

### 5.1 Functionality Migration, Not Code Migration

This is explicitly a **functionality migration**. No old website builder code is ported. The existing files (`nicheWebsiteData.ts`, `landingPageData.ts`, `websiteAgentEngine.ts`, `NicheWebsiteRenderer.tsx`, `FunnelFlowBuilder.tsx`, `LandingPageBuilderPage.tsx`) continue to exist and function unchanged. The Builder.io integration extracts **patterns** (schemas, frameworks, component shapes) and re-expresses them as Builder component registrations + AI content generation targets.

### 5.2 Pattern Extractions

| Source file | Patterns extracted | Re-expressed as |
|-------------|-------------------|-----------------|
| `nicheWebsiteData.ts` | 12 SectionType variants + per-section `content` shapes | 11 approved Builder component input schemas (in `builderComponentRegistry.mo` + `builderComponentRegistration.ts`) |
| `landingPageData.ts` | 7 SectionType + 5 NicheTemplates + `FormField` (name/phone/email/service/address/message) | Lead Form + Financing component inputs; template selection hints for AI |
| `FunnelFlowBuilder.tsx` | 4 FunnelStepType (landing/thank-you/upsell/booking-confirmation) + `crmTrigger` mapping | Booking + Lead Form `crmTrigger` input values |
| `websiteAgentEngine.ts` | 10 FrameworkName + 5 OfferFramework + 4 CtaStyle + 6 AI tools (deterministic) | AI orchestrator content generation: framework → copy → Builder block JSON |
| `NicheWebsiteRenderer.tsx` | 12 section component prop shapes + visual structure | Visual reference for the 11 approved Builder components (prop shapes, layout) |
| `funnelTracking.mo` | Funnel conversion tracking | Webhook → funnel event on publish |

### 5.3 Phased Rollout

**Phase A — Backend services + credential storage + feature flag**
- Add `BUILDER_IO_ENABLED` to the feature-toggle system (default disabled).
- Implement `builderClient.mo`, `builderContentService.mo`, `builderSpaceService.mo`, `builderComponentRegistry.mo`, `builderAuditAdapter.mo`.
- Add `builderSetCredentials`, `builderGetCredentialsStatus`, `builderGetContent`, `builderCreateContent`, `builderUpdateContent`, `builderPublishContent`, `builderGetOrCreateSpace` to `main.mo` (gated, tenant-isolated).
- Reuse `integrationCredentials.obfuscateWithSecret`/`deobfuscateWithSecret` for key storage.
- `mops check --fix` + `mops build` pass; `pnpm bindgen` regenerates bindings.
- **Exit criteria:** Backend compiles, all Builder methods return "feature disabled" when flag off, no existing method changed.

**Phase B — Frontend component registration + renderer**
- `pnpm add @builder.io/react/lite`.
- Implement `builderComponentRegistration.ts` (11 components), `builderRenderer.tsx`, `builderCredentialsForm.tsx`, `builderEditorLauncher.tsx`.
- Surface the credentials form + editor launcher within existing pages (no new routes).
- `pnpm typecheck` + `pnpm build` + `pnpm fix` pass.
- **Exit criteria:** Frontend compiles, components register when flag on, renderer falls back to `NicheWebsiteRenderer` when flag off.

**Phase C — AI orchestrator wiring to generate Builder content**
- Wire the existing `ai-orchestrator.mo` (currently `runOrchestrator` is a placeholder per `docs/PHASE3_1_REPORT.md`) to produce Builder block JSON from a website/funnel blueprint, selecting only from the 11 approved components in `builderComponentRegistry.mo`.
- Use the 10 copywriting frameworks + 5 offer frameworks + 4 CTA styles from `websiteAgentEngine.ts` to generate per-component copy.
- Output: draft content via `builderCreateContent` (published: false, triggerWebhooks=false).
- **Exit criteria:** AI generates a valid Builder content draft for a tenant business; draft visible in Builder editor.

**Phase D — Webhook handling + publishing**
- Implement `builderWebhookHandler.mo` (shared-secret + IP allowlist + rate limit, normalized into `webhookInbox.mo`).
- Register the BRF webhook URL + shared secret via the Admin API during space provisioning.
- Wire publish/unpublish webhooks to `funnelTracking.mo` + `auditLog.mo`.
- **Exit criteria:** A publish in Builder fires the webhook, BRF records the audit entry, funnel tracking updates.

**Phase E — Tenant onboarding + space provisioning**
- Wire `builderGetOrCreateSpace` into tenant onboarding (Admin API space creation + model seeding for the 11 `brf-*` models + webhook registration).
- Surface the credentials form in the tenant settings flow.
- **Exit criteria:** A new tenant can enter keys, get a Space, and see a generated draft in the Builder editor.

### 5.4 Backward Compatibility

- Existing website/funnel pages (`/landing-pages`, `/website-studio`, `/website-agent`, `/website-agent-settings`, `/preview/$previewId`, `/my-website`) continue to work unchanged.
- Builder.io is **additive** behind `BUILDER_IO_ENABLED` (default disabled).
- No existing route is removed.
- No existing public backend method signature changes (Builder methods are additive).
- `pnpm bindgen` adds new methods without removing old ones.
- The frontend `builderRenderer` falls back to `NicheWebsiteRenderer` when the flag is off.

### 5.5 Rollback Procedure

1. Set `BUILDER_IO_ENABLED = false` (globally or per-tenant).
2. All Builder.io backend methods return early ("feature disabled") — no http-outcalls fire.
3. Frontend `builderEditorLauncher` and `builderCredentialsForm` render disabled state; `builderRenderer` falls back to `NicheWebsiteRenderer`.
4. Existing website/funnel pages unaffected (not gated by this flag).
5. No data loss: Builder content remains in Builder.io's store; BRF audit log retains all records; webhook registrations remain (they simply stop firing because BRF returns "feature disabled" and Builder.io will retry then give up).

---

## Item 6 — Testing Requirements

### 6.1 Unit Tests — Backend Modules

| Module | Unit tests |
|--------|-----------|
| `builderClient.mo` | Auth header injection (Bearer + Private key); error response handling; rate-limit header parsing; flag-disabled short-circuit; missing-credentials short-circuit |
| `builderContentService.mo` | `createContent` produces correct Write API body; `updateContent` mode=put replaces fully; mode=patch sends partial + `triggerWebhooks=false`; `publishContent` sets published:true; tenant isolation (cross-tenant denied) |
| `builderSpaceService.mo` | `getOrCreateSpace` returns existing Space ID on second call; `mapSpace` stores mapping; `duplicateSpace` calls Admin API with correct GraphQL; cross-tenant mapping denied |
| `builderWebhookHandler.mo` | Shared-secret verification (valid/invalid/missing signature); IP allowlist (allowed/blocked); rate limit (under/over); payload normalization into `webhookInbox`; `newValue=null` → delete; `previousValue=null` → first publish |
| `builderComponentRegistry.mo` | All 11 components present; each has `name`, `builderModelName`, `inputs`, `brfSectionType`; input shapes match `nicheWebsiteData.ts` schemas |
| `builderAuditAdapter.mo` | Every operation emits an audit entry; `redactSecrets` strips Private keys; entries include tenantId, action, timestamp, redactedPayload |

### 6.2 Integration Tests — HTTP-Outcall Mocking

| Flow | Mock | Assert |
|------|------|--------|
| Write API create | Mock `Outcall.httpPostRequest` → 200 + content ID | `builderCreateContent` returns ID; audit entry logged |
| Write API update (put) | Mock `Outcall.httpPutRequest` → 200 | Full replace body sent; `triggerWebhooks` not in put body |
| Write API update (patch) | Mock `Outcall.httpPostRequest` (patch) → 200 | Partial body + `triggerWebhooks=false` sent |
| Content API read (frontend) | Mock Builder CDN → published content | `builderRenderer` renders blocks |
| Admin API space creation | Mock `Outcall.httpPostRequest` → GraphQL response | `builderGetOrCreateSpace` returns Space ID; models seeded; webhook registered |
| Webhook payload handling | POST to `builderReceiveWebhook` with valid signature | 200; `webhookInbox` event stored; audit logged |

### 6.3 Tenant Isolation Tests

- Cross-tenant content access: caller authorized for tenant A calls `builderGetContent(B, contentId)` → denied; audit "access_denied" logged; no outcall.
- Cross-tenant space access: caller for tenant A calls `builderGetOrCreateSpace(B)` → denied.
- Credential encryption/decryption round-trip: `builderSetCredentials` → `builderGetCredentialsStatus` (presence only) → internal `deobfuscateWithSecret` recovers the original Private key; ciphertext format `v1:<id>:<hex>`.
- Audit log entries: every Builder operation (create/update/publish/webhook/space/credential-rotate) produces an audit entry with the correct tenantId.

### 6.4 Frontend Tests

- `builderComponentRegistration.ts`: registers exactly 11 components; each registration's `inputs` match `builderComponentRegistry.mo` definitions; `name` matches the `brf-*` model names.
- `builderRenderer.tsx`: renders `<BuilderComponent>` with tenant Public key + contentId when flag on; falls back to `NicheWebsiteRenderer` when flag off or content missing.
- `builderCredentialsForm.tsx`: two fields (Public, Private); submit calls `builderSetCredentials`; Private key field masked; status display reflects `builderGetCredentialsStatus`.
- `builderEditorLauncher.tsx`: renders launch button when flag on + credentials present; renders nothing when flag off.

### 6.5 No-Regression Tests

With `BUILDER_IO_ENABLED = false`, all existing flows must pass unchanged:
- Lead Engine Steps 1-4 (capture → enrichment → scoring → routing).
- LLM fallback chain (OpenAI/Anthropic/Ollama/LiteLLM routing).
- Webhook inbox (Twilio/Instantly/Smartlead receivers).
- Outbound webhook delivery.
- Roofer cold email campaign.
- Caffeine email relay.
- 4-tier pricing.
- Simplified auth (isAdmin/hasPermission).
- AI orchestrator (existing 14 call sites, even though `runOrchestrator` is placeholder).
- All existing routes render.

### 6.6 Deploy-Verification Gate

Before any draft deploy, all of the following must pass (per `AGENTS.md` verified commands):
- `mops check --fix` (backend typecheck, from project root `app/`)
- `mops build` (backend build)
- `pnpm bindgen` (regenerate frontend bindings)
- `pnpm typecheck` (from `src/frontend/`)
- `pnpm fix` (frontend lint)
- `pnpm build` (frontend build)

No draft deploy proceeds if any of these fail.

---

## Security & Multi-Tenancy Plan

### API Key Security

- **Private keys (`bpk` prefix) never exposed client-side.** The frontend `builderCredentialsForm` sends the Private key to the backend over the authenticated BRF channel; the backend encrypts it immediately via `integrationCredentials.obfuscateWithSecret` and never returns it. `builderGetCredentialsStatus` returns only boolean presence.
- **Encrypted at rest** via `SecretManager` (managed 32-byte random secret, base64→XOR→hex, ciphertext `v1:<secretId>:<hex>`, StableJsonStore-persisted). The Public key is non-secret and stored plaintext.
- **Rotation** via the existing `rotateSecret` endpoint (rotates the underlying managed secret; all encrypted Builder keys re-encrypt under the new secret). A dedicated `builderRotateCredentials(tenantId)` re-stores a new key pair.
- **Redacted in all audit logs.** `builderAuditAdapter.mo` calls `auditLog.redactSecrets()` on every payload before logging. No Private key ever appears in an audit entry, an OQL query result, or an observability log.

### Tenant Isolation Enforcement

- **Every Builder outcall preceded by `hasAccessToTenant(caller, tenantId)`** (from `accessControl.mo`). A caller must be admin OR have access to the tenant. Failure returns an error, logs an "access_denied" audit entry, and fires no outcall.
- **Space ID scoped per tenant.** `builderSpaceService.mo` stores `TenantId → SpaceId` in the repository layer (per-tenant Map nesting). All content operations resolve the tenant's Space before calling the Write API; a caller cannot target another tenant's Space.
- **Cross-customer content access prevented at the service layer.** Even if a caller obtained another tenant's content ID, `builderGetContent` / `builderUpdateContent` resolve the Space from the caller's authorized tenant, not from the content ID, so cross-tenant reads/writes fail.

### Audit Logging

- **Every Builder.io operation logged** via `builderAuditAdapter.mo` → `auditLog.mo` (append-only, StableJsonStore-persisted, OQL-exposed, no update/delete).
- **Entry shape:** `tenantId`, `action` (a new `BuilderAction` variant: create/update/publish/unpublish/webhook-received/space-created/credential-set/credential-rotated), `timestamp`, `redactedPayload` (secrets stripped), `builderContentId?`, `builderSpaceId?`.
- **Audit key format** follows the existing `admin-audit:<tenantId>:<timestamp>:<nonce>` convention.

### Webhook Security

- **Shared-secret verification** (constant-time compare) — the same pattern as `webhooksAndIntegrations.mo`. The per-tenant shared secret is configured during webhook registration via the Admin API and stored encrypted alongside the Builder credentials.
- **IP allowlist** — optional, configurable per tenant (Builder.io's documented webhook source IPs). Requests from non-allowlisted IPs are rejected.
- **Rate limiting** — `rateLimiter.mo` caps per-source webhook throughput (same module used by all existing webhook receivers).
- **HMAC-SHA256 unavailable in Motoko** (documented limitation) — the verification stack is shared-secret + IP allowlist + rate limiting, matching the existing webhook pattern. This is an accepted, documented constraint, not a gap introduced by this integration.

---

## MCP Usage Plan

### Builder MCP Usage Scope

The Builder.io MCP (Model Context Protocol) server is used **only** for AI-assisted development workflows:

- **Design-system awareness:** querying Builder.io's component/model definitions during development to ensure the 11 approved components conform to Builder's expected input shapes.
- **Component discovery:** exploring Builder's API surface (Write API, Content API, Admin API) during implementation to confirm endpoint contracts.
- **Developer workflows:** scaffolding Builder component registrations, validating block JSON structure, and generating test content during development.

### MCP Is NOT the Production Integration Layer

**Explicitly:** MCP is a development-time tool. The production integration uses **direct Builder.io REST/Write/Admin APIs via the existing `caffeineai-http-outcalls` Outcall module** (backend) and `@builder.io/react/lite`'s `<BuilderComponent>` (frontend). No production code path depends on MCP. MCP is not deployed, not feature-flagged, not tenant-facing, and not part of the runtime data flow described in §4.

---

## Rollout Summary & Approval Checklist

### Phases at a Glance

| Phase | Scope | Exit criteria |
|-------|-------|---------------|
| A | Backend services + credential storage + feature flag | Backend compiles; Builder methods return "feature disabled" when flag off; no existing method changed |
| B | Frontend component registration + renderer | Frontend compiles; 11 components register; renderer falls back when flag off |
| C | AI orchestrator wiring to generate Builder content | AI generates a valid Builder draft for a tenant business |
| D | Webhook handling + publishing | Publish fires webhook; BRF records audit + funnel tracking |
| E | Tenant onboarding + space provisioning | New tenant enters keys, gets a Space, sees a generated draft |

### Approval Checklist (for the user)

Before approving this plan and authorizing Phase A implementation, confirm:

- [ ] The integration boundary is correct: BRF remains source of truth; Builder.io is a connected content/visual layer only.
- [ ] The 11 approved components are the correct set (Hero, Services, CTA, Lead Form, Booking, Reviews, FAQ, Financing, SEO, Before/After, Contact) and no Builder built-in components are permitted.
- [ ] The feature flag `BUILDER_IO_ENABLED` (default disabled) and the rollback procedure are acceptable.
- [ ] The credential storage reuse (SecretManager + integrationCredentials, no hardcoded keys) is acceptable.
- [ ] The webhook verification stack (shared-secret + IP allowlist + rate limiting, no HMAC-SHA256) is acceptable given the documented Motoko limitation.
- [ ] The phased rollout (A → B → C → D → E) and backward-compatibility guarantees are acceptable.
- [ ] The `doNotBuild` exclusions are respected (no Builder.io service implementation code, no React component registration code, no AI orchestrator Builder wiring code, no programmatic space creation per tenant, no A/B testing of builder pages, no Builder webhook handler implementation, no Builder publishing workflow implementation, no tenant credentials form UI implementation, no visual editing launcher implementation, no industry-specific template expansion — **all of these are deferred to the implementation round after this plan is approved**; this document is the plan only).

> **Next step:** On user approval, the next round begins Phase A (backend services + credential storage + feature flag). No implementation code is written in this round.

---

*End of plan. This document is the sole deliverable for this round.*
