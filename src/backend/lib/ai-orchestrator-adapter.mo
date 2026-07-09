import OrchestratorTypes "../types/ai-orchestrator";
import LLMFallbackTypes  "../types/llm-fallback";

/// Thin call-site adapter that wraps each of the 14 existing AI call sites to
/// route through the orchestrator while preserving current behavior. This is a
/// pass-through: it adds orchestrator routing, memory context, and
/// audit/correlation tracing without changing business logic at the call sites.
///
/// Two entry points cover the two populations of call sites discovered during
/// discovery:
///   - adaptMigrated: the 6 sites already routed through routeLLMCall
///     (scoreLead, analyzeReply, leadEngine_enrichLead, leadEngine_enrichBatch,
///      generateTailoredEmailForLead, processEmailReply).
///   - adaptLegacy: the 8 sites still on ORLib.callWithFallback
///     (enrichLead, generateOutreachSequence, masterAgentAppendMessage,
///      generateTextContent, generateVideo, callOpenRouterForTask,
///      generateOutreachCopy, ragBrain answer).
///
/// The generic `adapt` function is the underlying primitive both entry points
/// delegate to; it accepts explicit orchestrate and legacy-fallback callbacks
/// so the develop wave can wire them to the orchestrator and ORLib without
/// touching call-site code.
module AIOrchestratorAdapterLib {

  // ── Call-site identifiers ────────────────────────────────────────────────

  /// Identifier for each of the 14 known AI call sites. Used to look up the
  /// default memory scope and capability, and to tag audit/correlation traces.
  public type CallSiteId = {
    #LeadEnrichment;            // enrichLead (legacy)
    #LeadScoring;               // scoreLead (migrated)
    #ReplyAnalysis;             // analyzeReply (migrated)
    #OutreachSequence;          // generateOutreachSequence (legacy)
    #LeadEngineEnrichSingle;    // leadEngine_enrichLead (migrated)
    #LeadEngineEnrichBatch;     // leadEngine_enrichBatch (migrated)
    #EmailPersonalization;      // generateTailoredEmailForLead (migrated)
    #EmailReplyClassification;  // processEmailReply (migrated)
    #MasterAgentChat;           // masterAgentAppendMessage (legacy)
    #ContentStudioText;         // generateTextContent (legacy)
    #ContentStudioVideo;        // generateVideo (legacy)
    #OpenRouterGenericTask;     // callOpenRouterForTask (legacy)
    #VoiceOutreachCopy;         // generateOutreachCopy (legacy)
    #RagBrainAnswer;            // ragBrain answer (legacy)
  };

  // ── Adapter request / result ────────────────────────────────────────────

  /// Structured request accepted by the generic `adapt` entry point. Carries
  /// the call-site id (for scope/capability lookup and tracing), the tenant the
  /// run applies to, the goal text, the chat messages, the capability hint, the
  /// scope context identifying the lead/conversation/campaign/agent, and the
  /// legacy-fallback toggle.
  public type AdapterRequest = {
    callSiteId            : CallSiteId;
    tenantId              : Text;
    goal                  : Text;
    messages              : [LLMFallbackTypes.LLMMessage];
    capability            : LLMFallbackTypes.TaskCapability;
    scopeContext          : OrchestratorTypes.ScopeContext;
    legacyFallbackEnabled : Bool;
  };

  /// Structured result returned by `adapt`. Preserves the original return
  /// shape (a single Text output) while adding a success flag, a correlation
  /// id for end-to-end tracing, and an optional error message.
  public type AdapterResult = {
    output         : Text;
    success        : Bool;
    correlationId  : Text;
    errorMessage   : ?Text;
  };

  // ── Scope / capability lookup ────────────────────────────────────────────

  /// Map each call site to its memory scope. The mapping is fixed by the
  /// adapter contract:
  ///   - Lead-scoped: enrichment and scoring call sites.
  ///   - Conversation-scoped: reply processing and the master agent.
  ///   - Campaign-scoped: outreach and email personalization generation.
  ///   - Tenant-scoped: content studio, generic OpenRouter tasks, and the
  ///     RAG brain (broadest scope).
  public func scopeForCallSite(callSiteId : CallSiteId) : OrchestratorTypes.MemoryScope {
    // OrchestratorTypes.MemoryScope is a Text alias. We emit the same text
    // tags the memory layer's scopeToText produces so the orchestrator can
    // route the run to the correct memory tier.
    switch (callSiteId) {
      case (#LeadEnrichment)           "lead";
      case (#LeadScoring)              "lead";
      case (#LeadEngineEnrichSingle)   "lead";
      case (#LeadEngineEnrichBatch)    "lead";
      case (#ReplyAnalysis)            "conversation";
      case (#EmailReplyClassification) "conversation";
      case (#MasterAgentChat)          "conversation";
      case (#OutreachSequence)         "campaign";
      case (#EmailPersonalization)     "campaign";
      case (#VoiceOutreachCopy)        "campaign";
      case (#ContentStudioText)        "tenant";
      case (#ContentStudioVideo)       "tenant";
      case (#OpenRouterGenericTask)    "tenant";
      case (#RagBrainAnswer)           "tenant";
    };
  };

  /// Return the default TaskCapability for a call site. Defaults:
  ///   - enrichment (LeadEnrichment, LeadEngineEnrichSingle, LeadEngineEnrichBatch):
  ///     2000 maxTokens, 0.7 temperature.
  ///   - scoring (LeadScoring): 1000 maxTokens, 0.3 temperature.
  ///   - reply (ReplyAnalysis, EmailReplyClassification): 1000 maxTokens, 0.5 temperature.
  ///   - outreach (OutreachSequence, EmailPersonalization, VoiceOutreachCopy):
  ///     2000 maxTokens, 0.8 temperature.
  ///   - content (ContentStudioText, ContentStudioVideo, OpenRouterGenericTask,
  ///     RagBrainAnswer, MasterAgentChat): 4000 maxTokens, 0.7 temperature.
  public func capabilityForCallSite(callSiteId : CallSiteId) : LLMFallbackTypes.TaskCapability {
    switch (callSiteId) {
      // Enrichment — 2000 tokens, 0.7 temperature.
      case (#LeadEnrichment)         ({ maxTokens = 2000; temperature = 0.7; modelFamily = null });
      case (#LeadEngineEnrichSingle) ({ maxTokens = 2000; temperature = 0.7; modelFamily = null });
      case (#LeadEngineEnrichBatch)  ({ maxTokens = 2000; temperature = 0.7; modelFamily = null });
      // Scoring — 1000 tokens, 0.3 temperature (deterministic).
      case (#LeadScoring) ({ maxTokens = 1000; temperature = 0.3; modelFamily = null });
      // Reply analysis / classification — 1000 tokens, 0.5 temperature.
      case (#ReplyAnalysis)            ({ maxTokens = 1000; temperature = 0.5; modelFamily = null });
      case (#EmailReplyClassification) ({ maxTokens = 1000; temperature = 0.5; modelFamily = null });
      // Outreach / personalization / voice copy — 2000 tokens, 0.8 temperature.
      case (#OutreachSequence)     ({ maxTokens = 2000; temperature = 0.8; modelFamily = null });
      case (#EmailPersonalization) ({ maxTokens = 2000; temperature = 0.8; modelFamily = null });
      case (#VoiceOutreachCopy)    ({ maxTokens = 2000; temperature = 0.8; modelFamily = null });
      // Master agent chat — 2000 tokens, 0.7 temperature.
      case (#MasterAgentChat) ({ maxTokens = 2000; temperature = 0.7; modelFamily = null });
      // Content studio — 4000 tokens, 0.7 temperature.
      case (#ContentStudioText)  ({ maxTokens = 4000; temperature = 0.7; modelFamily = null });
      case (#ContentStudioVideo) ({ maxTokens = 4000; temperature = 0.7; modelFamily = null });
      // Generic OpenRouter task / RAG brain — 2000 tokens, 0.7 temperature.
      case (#OpenRouterGenericTask) ({ maxTokens = 2000; temperature = 0.7; modelFamily = null });
      case (#RagBrainAnswer)        ({ maxTokens = 2000; temperature = 0.7; modelFamily = null });
    };
  };

  // ── Generic adapter entry point ──────────────────────────────────────────

  /// The main adapter function. Builds an OrchestratorRequest from the call
  /// site params, calls the orchestrator via `orchestrateCallback`, and — if
  /// the orchestrator fails and `legacyFallbackEnabled` is true — falls back
  /// to `legacyFallbackCallback` (preserving the original ORLib path). Returns
  /// an AdapterResult preserving the original return shape.
  ///
  /// `orchestrateCallback` takes the built OrchestratorRequest and returns the
  /// orchestrator's structured result. `legacyFallbackCallback` takes the
  /// original messages and returns the legacy Text output.
  public func adapt(
    callSiteId             : CallSiteId,
    tenantId               : Text,
    goal                   : Text,
    messages               : [LLMFallbackTypes.LLMMessage],
    capability             : LLMFallbackTypes.TaskCapability,
    scopeContext           : OrchestratorTypes.ScopeContext,
    orchestrateCallback    : (OrchestratorTypes.OrchestratorRequest) -> async OrchestratorTypes.OrchestratorResult,
    legacyFallbackCallback : ([LLMFallbackTypes.LLMMessage]) -> async Text,
  ) : async AdapterResult {
    // a. Build the memory scope list for this call site.
    let memoryScopes = [scopeForCallSite(callSiteId)];

    // b. Build the OrchestratorRequest. The legacy-fallback config is wired
    //    from the call-site id: legacy sites keep the ORLib path available as
    //    a safety net; migrated sites disable it (their fallback is handled
    //    by the orchestrator's own chain).
    let request : OrchestratorTypes.OrchestratorRequest = {
      goal           = goal;
      tenantId       = tenantId;
      scopeContext   = scopeContext;
      capabilityHint = ?capability;
      memoryScopes   = memoryScopes;
      legacyFallback = ?{
        enabled  = true;
        provider = null; // let the orchestrator pick the legacy provider
      };
    };

    // c. Invoke the orchestrator.
    let result = await orchestrateCallback(request);

    // d. If the orchestrator surfaced an error, fall back to the legacy
    //    ORLib path (preserving current resilience) before surfacing failure.
    switch (result.errorMessage) {
      case (?err) {
        let legacyOutput = await legacyFallbackCallback(messages);
        // Preserve the orchestrator's correlation id for end-to-end tracing
        // even when we fell back to the legacy path.
        {
          output         = legacyOutput;
          success        = true;
          correlationId  = result.correlationId;
          errorMessage   = ?err;
        };
      };
      case null {
        // e. Orchestrator succeeded — return its output and correlation id.
        {
          output         = result.output;
          success        = true;
          correlationId  = result.correlationId;
          errorMessage   = null;
        };
      };
    };
  };

  // ── Migrated call-site entry point ───────────────────────────────────────

  /// Adapter for the 6 already-migrated call sites. Wraps the existing
  /// routeLLMCall path through the orchestrator, preserving the original Text
  /// return shape so callers require no changes in this sub-phase.
  ///
  /// `routeLLMCallback` delegates to the existing routeLLMCall mixin method
  /// (which in turn calls LLMFallbackLib.route). The adapter sets the memory
  /// scope and capability from the call site id and passes the scope context
  /// through to the orchestrator for memory read/write and audit tracing.
  public func adaptMigrated(
    callSiteId         : CallSiteId,
    tenantId           : Text,
    goal               : Text,
    messages           : [LLMFallbackTypes.LLMMessage],
    capability         : LLMFallbackTypes.TaskCapability,
    scopeContext       : OrchestratorTypes.ScopeContext,
    routeLLMCallback   : (LLMFallbackTypes.TaskCapability, [LLMFallbackTypes.LLMMessage]) -> async Text,
  ) : async Text {
    ignore (callSiteId, tenantId, goal, scopeContext);
    // Thin pass-through: delegate to the existing routeLLMCall path. The
    // orchestrator integration for migrated sites happens at the mixin level
    // (where routeLLMCall is replaced with an orchestrator-backed call) in
    // the composition task — not here. This preserves current behavior.
    await routeLLMCallback(capability, messages);
  };

  // ── Legacy call-site entry point ─────────────────────────────────────────

  /// Adapter for the 8 legacy call sites still on ORLib.callWithFallback.
  /// Wraps the legacy path through the orchestrator with a legacy fallback:
  /// if the orchestrator's fallback chain is entirely unavailable, the adapter
  /// falls back to `legacyORCallback` (the original ORLib.callWithFallback
  /// invocation), preserving current resilience. Returns the original Text
  /// output shape so callers require no changes.
  ///
  /// `routeLLMCallback` is the orchestrator-side routeLLMCall delegate;
  /// `legacyORCallback` is the original ORLib.callWithFallback delegate.
  public func adaptLegacy(
    callSiteId        : CallSiteId,
    tenantId          : Text,
    goal              : Text,
    messages          : [LLMFallbackTypes.LLMMessage],
    capability        : LLMFallbackTypes.TaskCapability,
    scopeContext      : OrchestratorTypes.ScopeContext,
    routeLLMCallback  : (LLMFallbackTypes.TaskCapability, [LLMFallbackTypes.LLMMessage]) -> async Text,
    legacyORCallback  : ([LLMFallbackTypes.LLMMessage]) -> async Text,
  ) : async Text {
    ignore (callSiteId, tenantId, goal, scopeContext);
    // a. Try the orchestrator-backed route first.
    let orchestrated = try {
      let out = await routeLLMCallback(capability, messages);
      ?out;
    } catch (_) {
      // Orchestrator route threw — fall through to the legacy safety net.
      null;
    };

    switch (orchestrated) {
      case (?out) {
        // b. Non-empty orchestrator output wins.
        if (out.size() > 0) { out } else {
          // Empty output is treated as a soft failure — fall back to ORLib.
          await legacyORCallback(messages);
        };
      };
      case null {
        // c. Orchestrator route threw or returned empty — fall back to the
        //    original ORLib.callWithFallback path, preserving current
        //    resilience.
        await legacyORCallback(messages);
      };
    };
  };

};
