import Array    "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime   "mo:core/Runtime";
import Time      "mo:core/Time";
import Nat       "mo:core/Nat";
import Int       "mo:core/Int";
import Text      "mo:core/Text";
import Map       "mo:core/Map";

import AccessControl      "mo:caffeineai-authorization/access-control";
import Outcall            "mo:caffeineai-http-outcalls/outcall";

import OrchestratorTypes  "../types/ai-orchestrator";
import AIOrchestratorLib  "../lib/ai-orchestrator";
import LLMFallbackTypes   "../types/llm-fallback";
import LLMFallbackLib     "../lib/llm-fallback";
import ORT                "../types/openRouter";
import ICTypes            "../types/integrationCredentials";
import ICLib              "../lib/integrationCredentials";
import SecretManager      "../lib/secretManager";
import AIMemoryTypes      "../types/ai-memory";
import AIMemoryLib        "../lib/ai-memory";
import AIMemoryMixin      "../mixins/ai-memory-api";
import AdminAuditLib      "../lib/auditLog";
import AdminAuditTypes    "../types/auditLog";
import RateLimiter        "../lib/rateLimiter";
import Observability      "../lib/observability";
import SJS                "../lib/StableJsonStore";

/// Public API surface for the AI orchestrator.
///
/// The orchestrator sits ABOVE the existing LLM fallback chain: it decomposes
/// a goal into sub-tasks, selects capabilities, executes each sub-task via the
/// existing `routeLLMCall` (delegated through `LLMFallbackLib.route`), validates
/// outputs, retries on validation failure, stores memory via the memory layer,
/// emits an audit-trail entry, and returns a structured result with a
/// correlation id for end-to-end tracing.
///
/// This mixin WRAPS the existing LLM fallback chain — it does NOT replace it.
/// The 14 existing AI call sites continue unchanged; the orchestrator is a new
/// entry point available alongside them.
///
/// Phase 2 integration:
///   - Encrypted secrets: `resolveKeysCallback` reads `integrationCreds.get("platform")`,
///     decrypts with `credSalt`, and calls `LLMFallbackLib.resolveKeys`. The
///     orchestrator never handles raw secrets.
///   - Rate limiting: `rateLimitCallback` delegates to `RateLimiter.checkRateLimit`
///     with the per-tenant orchestrator budget.
///   - Audit trails: `auditCallback` delegates to `AdminAuditLib.appendAdminAudit`
///     with `adminAuditStore` and `adminAuditNonce`.
///   - Observability: the orchestrator's route log is exposed via the OQL entity
///     in `lib/aiOrchestratorOql.mo`, merged into the existing `Expose({...})` block.
///
/// The AIMemoryMixin is included here so the memory API surface (writeMemory,
/// readMemory, listMemory, deleteMemory, buildMemoryContext, buildMemoryContextText,
/// memoryEntryCount, memoryHotTierCount, memoryDurableTierCount) is available
/// alongside the orchestrator's own memory methods without duplication.
mixin (
  orchestratorState   : OrchestratorTypes.OrchestratorState,
  aiMemoryState       : AIMemoryTypes.MemoryState,
  llmFallbackState    : LLMFallbackLib.State,
  integrationCreds    : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt            : Blob,
  accessControlState  : AccessControl.AccessControlState,
  adminAuditStore     : SJS.State,
  adminAuditNonce     : { var n : Nat },
  rateLimiterState    : RateLimiter.State,
  transform           : LLMFallbackLib.Transform,
  stableStore          : SJS.State,
  secretState          : ?SecretManager.State,
) {

  // ── Type re-exports for the Candid interface ────────────────────────────────
  //
  // MemoryScope, MemoryEntry, MemoryFilter, and MemoryContextBlock are
  // intentionally NOT re-declared here: the included AIMemoryMixin (see
  // below) already re-exports them for the Candid interface. Re-declaring
  // them in the same block triggers M0051 duplicate-definition errors.
  public type OrchestratorResult = OrchestratorTypes.OrchestratorResult;
  public type OrchestratorHealth = OrchestratorTypes.OrchestratorHealth;
  public type ScopeContext       = OrchestratorTypes.ScopeContext;
  public type TaskCapability     = LLMFallbackTypes.TaskCapability;

  // ── Memory scope bridge ─────────────────────────────────────────────────────
  //
  // Both OrchestratorTypes.MemoryScope and AIMemoryTypes.MemoryScope are now
  // Text aliases (the variant form was simplified to work around a moc 1.10.1
  // stable-signature crash). No bridging is needed — text scope tags pass
  // through directly to the memory layer.

  // ── Auth helpers ────────────────────────────────────────────────────────────

  /// Trap when the caller is not an admin. Phase 1 simplified auth treats any
  /// logged-in principal as admin for admin-only endpoints.
  func orch_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  // ── Memory mixin include ────────────────────────────────────────────────────
  //
  // AIMemoryMixin is NOT included here. Including it inside this mixin with
  // inline function closures as the `assertAdmin` / `assertTenantAccess`
  // parameters caused the moc 1.10.1 stable-signature crash
  // (desugar.ml:1083 in Lowering__Desugar.stabilize): those closures are
  // non-shared local function types, which are NOT stabilizable. When moc
  // builds the actor's stable signature it traverses every mixin parameter
  // (including nested-include arguments) and traps on the non-shared
  // function types.
  //
  // AIMemoryMixin is instead included directly in main.mo, where the
  // closures are passed at the actor level (shared function references and
  // actor-level closures are handled correctly by the stabilizer). The
  // orchestrator accesses memory through AIMemoryLib directly (the lib
  // functions are stateless module functions, not mixin parameters).
  //
  // The `aiMemoryState`, `stableStore`, `accessControlState` parameters
  // remain on this mixin so the orchestrator's own helpers (scopeIdFor,
  // routeLLMCallInternal) can read them; only the nested include is removed.

  // ── Orchestrator entry point ────────────────────────────────────────────────

  /// Run the orchestrator for a goal. Builds an OrchestratorRequest, calls
  /// AIOrchestratorLib.orchestrate with callbacks that delegate to the existing
  /// Phase 2 systems (LLM fallback chain, encrypted credentials, rate limiter,
  /// audit trail, observability correlation ids, and the memory layer).
  ///
  /// The 14 existing AI call sites are NOT modified — this is a new entry
  /// point available alongside them.
  public shared ({ caller }) func runOrchestrator(
    goal         : Text,
    scopeContext : ScopeContext,
    capability   : ?TaskCapability,
  ) : async Text {
    // BISECT: temporarily returning Text to isolate the moc 1.10.1
    // stable-signature crash. Original return type was OrchestratorResult.
    ignore (caller, goal, scopeContext, capability);
    "bisect";
  };

  // ── Orchestrator memory accessors ────────────────────────────────────────────
  //
  // getOrchestratorMemory temporarily disabled for bisect
  // writeOrchestratorMemory temporarily disabled for bisect
  // listOrchestratorMemory temporarily disabled for bisect

  // ── Orchestrator health (admin-only) ─────────────────────────────────────────

  // getOrchestratorHealth temporarily disabled for bisect

  // ── Private helpers ─────────────────────────────────────────────────────────

  /// Convert [LLMFallbackTypes.LLMMessage] → [ORT.OpenRouterMessage].
  /// Both types share the { role; content } shape; this is a structural map.
  func Array_mapLLMToOR(messages : [LLMFallbackTypes.LLMMessage]) : [ORT.OpenRouterMessage] {
    // Avoid importing Array by using a foldLeft-free tabulate (the messages
    // array is small and bounded by the orchestrator's plan()).
    let n = messages.size();
    Array.tabulate(n, func(i) {
      let m = messages[i];
      { role = m.role; content = m.content };
    });
  };

  /// Derive the scopeId for a memory scope from the orchestrator's
  /// ScopeContext. For "global" and "platform" the scopeId is empty; for the
  // tenant-scoped tiers it carries the relevant id from the context.
  func scopeIdFor(scope : AIMemoryTypes.MemoryScope, ctx : ScopeContext) : Text {
    if (scope == "global") {
      "";
    } else if (scope == "platform") {
      "";
    } else if (scope == "tenant") {
      switch (ctx.tenantId) { case (?t) t; case null "" };
    } else if (scope == "org") {
      switch (ctx.organizationId) { case (?t) t; case null "" };
    } else if (scope == "campaign") {
      switch (ctx.campaignId) { case (?t) t; case null "" };
    } else if (scope == "lead") {
      switch (ctx.leadId) { case (?t) t; case null "" };
    } else if (scope == "conversation") {
      switch (ctx.conversationId) { case (?t) t; case null "" };
    } else if (scope == "agent") {
      switch (ctx.agentId) { case (?t) t; case null "" };
    } else {
      // Unknown scope — fall back to empty scopeId.
      "";
    };
  };

  // ── Internal routeLLMCall delegate ───────────────────────────────────────────
  //
  // Mirrors the public routeLLMCall in mixins/llm-fallback-api.mo so the
  // orchestrator can route through the existing LLM fallback chain without a
  // self-call (which is not available from a mixin). This keeps the
  // orchestrator's routeLLMCallback self-contained while delegating to the
  // same LLMFallbackLib.route path the public endpoint uses.

  /// Resolve keys from the platform credentials store and route through the
  /// LLM fallback chain. Mirrors the public routeLLMCall in
  /// mixins/llm-fallback-api.mo.
  func routeLLMCallInternal(
    task       : ORT.TaskType,
    messages   : [ORT.OpenRouterMessage],
    capability : LLMFallbackTypes.TaskCapability,
  ) : async Text {
    let creds : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (null) ICLib.emptyCredentials();
      case (?enc) ICLib.decryptAllWithSecret(enc, credSalt, secretState);
    };
    let keys = LLMFallbackLib.resolveKeys(creds);

    let flags : LLMFallbackLib.FeatureFlags = {
      leadEngineEnabled = true;
      twilioEnabled      = true;
      sendgridEnabled    = true;
    };

    await LLMFallbackLib.route(
      llmFallbackState,
      task,
      messages,
      keys,
      flags,
      capability,
      transform,
      orch_llmFbLegacyFallback(task, messages, keys),
    );
  };

  /// Build the legacy fallback closure that mirrors the existing
  /// callWithFallback behavior: OpenRouter adapter → Gemini direct call.
  /// This is the Generic tier of the chain. Mirrors the private helper in
  /// mixins/llm-fallback-api.mo.
  func orch_llmFbLegacyFallback(
    task     : ORT.TaskType,
    messages : [ORT.OpenRouterMessage],
    keys     : LLMFallbackLib.ProviderKeys,
  ) : (ORT.TaskType, [ORT.OpenRouterMessage]) -> async Text {
    func(_t : ORT.TaskType, msgs : [ORT.OpenRouterMessage]) : async Text {
      let llmMessages = Array_mapORToLLM(msgs);
      // 1. Try OpenRouter adapter directly.
      if (keys.openRouterKey != "") {
        let r = await LLMFallbackLib.callOpenRouter(
          keys.openRouterKey, "openai/gpt-4o-mini", llmMessages, transform,
        );
        if (r != "") return r;
      };
      // 2. Try Gemini direct (API key in URL query param).
      if (keys.geminiKey != "") {
        let r = await orch_callGeminiDirect(keys.geminiKey, msgs);
        if (r != "") return r;
      };
      "";
    };
  };

  /// Convert [ORT.OpenRouterMessage] → [LLMFallbackTypes.LLMMessage].
  func Array_mapORToLLM(messages : [ORT.OpenRouterMessage]) : [LLMFallbackTypes.LLMMessage] {
    let n = messages.size();
    Array.tabulate(n, func(i) {
      let m = messages[i];
      { role = m.role; content = m.content };
    });
  };

  /// Direct Gemini call mirroring the existing callGemini in openRouter.mo.
  /// Gemini uses API key as URL query param, not Authorization header.
  func orch_callGeminiDirect(
    geminiKey : Text,
    messages  : [ORT.OpenRouterMessage],
  ) : async Text {
    var combinedPrompt = "";
    for (m in messages.vals()) {
      if (combinedPrompt == "") {
        combinedPrompt := m.content;
      } else {
        combinedPrompt := combinedPrompt # "\n" # m.content;
      };
    };
    let bodyJson = "{\"contents\":[{\"parts\":[{\"text\":\"" # orch_escapeJson(combinedPrompt) # "\"}]}]," #
                   "\"generationConfig\":{\"maxOutputTokens\":2000}}";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # geminiKey;
    try {
      let resp = await Outcall.httpPostRequest(
        url,
        [{ name = "Content-Type"; value = "application/json" }],
        bodyJson,
        transform,
      );
      orch_extractGeminiContent(resp);
    } catch (_) { "" };
  };

  /// Extract `candidates[0].content.parts[0].text` from a Gemini JSON response.
  func orch_extractGeminiContent(raw : Text) : Text {
    let marker      = "\"text\":\"";
    let markerChars = marker.toArray();
    let rawChars    = raw.toArray();
    let mLen        = markerChars.size();
    let rLen        = rawChars.size();

    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= rLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < mLen) {
        if (rawChars[i + j] != markerChars[j]) {
          matched := false;
          break matchLoop;
        };
        j += 1;
      };
      if (matched) {
        startIdx := ?(i + mLen);
        break findMarker;
      };
      i += 1;
    };

    switch startIdx {
      case null "";
      case (?afterMarker) {
        var end     = afterMarker;
        var escaped = false;
        label scan while (end < rLen) {
          let c = rawChars[end];
          if (escaped) {
            escaped := false;
          } else if (c == '\\') {
            escaped := true;
          } else if (c == '\u{22}') {
            break scan;
          };
          end += 1;
        };
        let len : Nat = end - afterMarker;
        Text.fromIter(Array.tabulate(len, func(k) { rawChars[afterMarker + k] }).vals());
      };
    };
  };

  /// Escape a Text value for safe inclusion in a JSON string literal.
  func orch_escapeJson(s : Text) : Text {
    var out = "";
    for (c in s.chars()) {
      if (c == '\u{22}') {
        out #= "\\\"";
      } else if (c == '\\') {
        out #= "\\\\";
      } else if (c == '\n') {
        out #= "\\n";
      } else if (c == '\r') {
        out #= "\\r";
      } else if (c == '\t') {
        out #= "\\t";
      } else {
        out #= Text.fromChar(c);
      };
    };
    out;
  };

};
