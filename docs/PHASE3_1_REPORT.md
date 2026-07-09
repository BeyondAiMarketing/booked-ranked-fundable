# Phase 3 Sub-Phase 1 Report: AI Orchestrator + Memory Layers

Build Version: build-2026-07-09T03:10:00Z
Date: 2026-07-09
Status: Draft deployed — partial functionality, existing features preserved

## 1. Architecture Summary
Phase 3 Sub-Phase 1 introduces the AI Operating System foundation: a centralized AI Orchestrator and 8-level memory layer that sit above the existing LLM fallback chain.

What was built:
- AI Orchestrator Core (lib/ai-orchestrator.mo): Full workflow implementation — Goal intake, Planner, Task Decomposition, Model/Capability Selection, Execution, Validation, Retry, Memory Storage, Notification. The orchestrator wraps (does not replace) the existing LLMFallbackLib.route via callback-based delegation.
- 8-Level Memory Layer (lib/ai-memory.mo, types/ai-memory.mo): Type definitions for all 8 memory scopes (Global, Platform, Tenant, Organization, Campaign, Lead, Conversation, Agent) with hot/durable tier routing. Hot tiers (Conversation, Agent, Lead) designed for in-memory Map storage; durable tiers (Global, Platform, Tenant, Organization, Campaign) designed for StableJsonStore with namespaced keys.
- Call-Site Adapter (lib/ai-orchestrator-adapter.mo): Thin adapter module with CallSiteId variants for all 14 existing AI call sites, scope/capability mapping per call site, and adapt/adaptMigrated/adaptLegacy functions.
- OQL Entity (lib/aiOrchestratorOql.mo): OQL entity definition for orchestrator run observability (currently returns empty — disabled during crash debugging).
- Public API: 14 new public methods added directly to the main actor.

Architecture decisions:
- No mixin for orchestrator: moc 1.10.1 has a stable-signature crash (desugar.ml:1083) triggered by non-stabilizable types in mixin parameters becoming stable actor fields. Workaround: define public functions directly on the actor instead of via mixin includes.
- Type simplifications: ValidationStatus, TaskValidator, MemoryScope, MemoryTier simplified to Text aliases in public function signatures. MemoryMode kept as original variant type.

## 2. Files Changed
New files: types/ai-orchestrator.mo, lib/ai-orchestrator.mo, types/ai-memory.mo, lib/ai-memory.mo, mixins/ai-memory-api.mo, lib/ai-orchestrator-adapter.mo, lib/aiOrchestratorOql.mo, mixins/ai-orchestrator-api.mo, docs/PHASE3_1_REPORT.md
Modified files: main.mo (imports, state, 14 public methods, getBuildVersion, Expose block), types/llm-fallback.mo (ProviderKeys type), lib/llm-fallback.mo (ProviderKeys alias), src/frontend/src/backend.d.ts (regenerated)

## 3. Changes Made
Succeeded: Backend compiles (mops check --fix + mops build pass), Frontend compiles (pnpm typecheck + pnpm build pass), Bindings regenerate (pnpm bindgen), Existing 14 AI call sites preserved, LLM fallback chain intact, Orchestrator lib fully implemented (plan/validate/retry/orchestrate/healthSnapshot), Adapter module implemented, Type definitions complete, Build version updated.
Partially succeeded: Orchestrator public entry point uses Debug.todo() (lib logic exists but unreachable), Memory layer is placeholder (writeMemory increments counter, readMemory returns null).
Did not succeed: Call-site wrapping not wired (adapter implemented but not invoked), OQL entity returns empty, Phase 2 integration not wired, Tenant isolation not enforced on memory functions.

## 4. Performance Improvements
- Centralized AI gateway architecture enables future optimization of model selection, cost-aware routing, and batch processing.
- Callback-based delegation reduces coupling and enables future swapping of execution engines.
- Text-encoded types in public signatures reduce Candid serialization overhead.
No runtime performance improvements measured (orchestrator not yet wired to production paths).

## 5. Security Improvements
- Architecture for centralized access control with hooks for rate limiting, audit trails, and tenant isolation.
- No secrets in orchestrator — uses callbacks to access encrypted secrets via existing SecretManager/IntegrationCredentials path.
Security debt: Tenant isolation not enforced on memory public functions (caller = _, no hasAccessToTenant checks). Must fix before memory is functional. Currently non-exploitable (no data stored). Orchestrator audit callback not wired.

## 6. Technical Debt Removed
- Scattered AI call architecture replaced with centralized orchestrator architecture (call sites not yet migrated — architecture in place, migration deferred).
- Stateless AI calls addressed with 8-level memory layer architecture (storage implementation currently placeholder).

## 7. Risks Remaining
1. moc 1.10.1 stable-signature crash — compiler bug triggered by non-stabilizable types in mixin parameters. Workaround is fragile.
2. Memory layer non-functional — storage implementation is placeholder.
3. Orchestrator not wired — runOrchestrator traps at runtime (Debug.todo).
4. Tenant isolation gap — memory public functions lack hasAccessToTenant checks.
5. Dead code — disabled mixin files (ai-orchestrator-api.mo, ai-memory-api.mo) should be cleaned up.
6. Adapter not wired — 14 call sites continue using original paths.

## 8. Next Steps
Immediate (before memory is functional): Restore memory storage implementation, add tenant isolation checks, wire runOrchestrator to AIOrchestratorLib.orchestrate with callbacks.
Short-term (sub-phase 1 completion): Wire adapter to call sites, restore OQL entity, wire Phase 2 integration, clean up dead code.
Medium-term (sub-phase 2): Background job system, cross-tenant intelligence aggregation.

Direct assessment:
- Succeeded: Backend compiles, frontend compiles, bindings regenerate, existing features preserved, orchestrator lib implemented, adapter module implemented, type definitions complete.
- Failed: Orchestrator not wired to public entry point, memory layer non-functional, call-site wrapping not done, OQL entity disabled, Phase 2 integration not wired, tenant isolation not enforced.
- Root cause: moc 1.10.1 compiler crash consumed significant debugging time. Crash caused by non-stabilizable types in mixin parameters. Workaround required restructuring that simplified several components to placeholders.
