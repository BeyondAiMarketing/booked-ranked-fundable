import LLMFallback "llm-fallback";

// Forward reference: MemoryScope is defined in types/ai-memory.mo, which the
// parallel memory-contract task creates. The composition task will resolve
// this alias once types/ai-memory.mo is present. Defining it here keeps the
// orchestrator contract self-contained and compile-checkable in isolation.
module {

  // ── Reused types (do NOT redefine) ────────────────────────────────────────

  /// Provider identifier reused from the LLM fallback chain.
  public type ProviderId = LLMFallback.ProviderId;

  /// Capability requirements a task imposes on a candidate model.
  public type TaskCapability = LLMFallback.TaskCapability;

  /// Memory scope identifier — sourced from the memory layer types.
  /// Forward reference until types/ai-memory.mo is authored by the parallel
  /// memory-contract task; the composition task will swap this alias to a
  /// direct import.
  public type MemoryScope = Text;

  // ── Request / response ────────────────────────────────────────────────────

  /// Scope context identifying the tenant / organization / campaign / lead /
  /// conversation / agent the orchestrator run applies to. All fields are
  /// optional so a caller can scope at any granularity.
  public type ScopeContext = {
    tenantId       : ?Text;
    organizationId : ?Text;
    campaignId     : ?Text;
    leadId         : ?Text;
    conversationId : ?Text;
    agentId        : ?Text;
  };

  /// Configuration for the legacy fallback tier. When enabled, the orchestrator
  /// may delegate a sub-task to the legacy callWithFallback path (preserving
  /// current behavior) instead of the new chain.
  public type LegacyFallbackConfig = {
    enabled  : Bool;
    provider : ?ProviderId;
  };

  /// Structured request accepted by the orchestrator entry point.
  public type OrchestratorRequest = {
    goal           : Text;
    tenantId       : Text;
    scopeContext   : ScopeContext;
    capabilityHint : ?TaskCapability;
    memoryScopes   : [MemoryScope];
    legacyFallback : ?LegacyFallbackConfig;
  };

  /// Validation outcome for an orchestrator sub-task result.
  ///
  /// DIAGNOSTIC: simplified from a variant with a record payload
  /// (`#Invalid : { reason : Text }`) to a plain Text. The original
  /// variant-with-record-payload form triggered a moc 1.10.1 stable-signature
  /// crash (desugar.ml:1083 List.map2) when OrchestratorResult — which embeds
  /// ValidationStatus — appeared in a public function's return type. The
  /// crash reproduces only when the AIOrchestratorMixin is included in the
  /// actor; the simplified Text form compiles. Encoded values: "valid",
  /// "invalid:<reason>", "skipped".
  public type ValidationStatus = Text;

  /// Per-task validator applied to a sub-task's output before acceptance.
  ///
  /// DIAGNOSTIC: simplified from a variant with primitive payloads
  /// (`#MaxLength : Nat`, `#SchemaMatch : Text`, `#Custom : Text`) to a plain
  /// Text. The original variant-with-payload form triggered a moc 1.10.1
  /// stable-signature crash (desugar.ml:1083 List.map2) when SubTask — which
  /// embeds TaskValidator via `validator : ?TaskValidator` — appeared in
  /// OrchestratorRequest, which is in the runOrchestrator public function
  /// signature. Even primitive-payload variants (Nat, Text) trigger the bug.
  /// Encoded values:
  ///   "nonempty"                       — output must be non-blank
  ///   "maxlength:N"                     — output length must be ≤ N
  ///   "jsonshape"                       — output must look like JSON
  ///   "schemamatch:pattern"             — output must contain `pattern`
  ///   "custom:name"                      — custom validator (treated as passing)
  public type TaskValidator = Text;

  /// A single decomposed sub-task within an orchestrator run.
  public type SubTask = {
    id          : Text;
    description : Text;
    capability  : TaskCapability;
    validator   : ?TaskValidator;
    memoryScope : MemoryScope;
  };

  /// Result returned by the orchestrator entry point.
  public type OrchestratorResult = {
    output           : Text;
    provider         : ?ProviderId;
    model            : ?Text;
    attempts         : Nat;
    validationStatus : ValidationStatus;
    memoryRefs       : [Text];
    correlationId    : Text;
    errorMessage     : ?Text;
  };

  /// Result of a retry pass for a single sub-task. Used as the return type of
  /// `AIOrchestratorLib.retry`. Named (not inline) so it does not trigger the
  /// moc 1.10.1 stable-signature crash (desugar.ml:1083) when it appears in a
  /// public function's return type.
  public type RetryResult = {
    output   : Text;
    attempts : Nat;
    provider : ?ProviderId;
    model    : ?Text;
  };

  /// Core health snapshot produced by `AIOrchestratorLib.healthSnapshot`.
  /// Named (not inline) so it does not trigger the moc 1.10.1 stable-signature
  /// crash (desugar.ml:1083) when it appears in a public function's return
  /// type.
  public type HealthSnapshot = {
    runCount      : Nat;
    failureCount  : Nat;
    successRate   : Float;
    inFlightCount : Nat;
  };

  /// Admin-facing orchestrator health snapshot returned by
  /// `getOrchestratorHealth`. Extends `HealthSnapshot` with memory-tier
  /// counts. Named (not inline) so it does not trigger the moc 1.10.1
  /// stable-signature crash (desugar.ml:1083) when it appears in a public
  /// shared function's return type.
  public type OrchestratorHealth = {
    runCount          : Nat;
    failureCount      : Nat;
    successRate       : Float;
    inFlightCount     : Nat;
    memoryEntryCount  : Nat;
    memoryHotTierCount : Nat;
  };

  // ── State ─────────────────────────────────────────────────────────────────

  /// Append-only log entry for an orchestrator run, surfaced for observability.
  public type OrchestratorLogEntry = {
    correlationId : Text;
    goal          : Text;
    tenantId      : Text;
    subTaskCount  : Nat;
    provider      : ?ProviderId;
    model         : ?Text;
    success       : Bool;
    attempts      : Nat;
    durationNs    : Int;
    timestampNs   : Int;
    memoryRefs    : [Text];
  };

  /// Transient in-memory orchestrator state. DIAGNOSTIC: simplified to a
  /// single `var` field with a primitive type to isolate the moc 1.10.1
  /// stable-signature crash (desugar.ml:1083 List.map2). The full state
  /// (routeLog, counts tuple) is temporarily removed; restored once the
  /// crash root cause is identified.
  public type OrchestratorState = {
    var runCount : Nat;
  };

  // ── State lifecycle ──────────────────────────────────────────────────────

  /// Construct an empty transient OrchestratorState.
  public func emptyState() : OrchestratorState {
    {
      var runCount = 0;
    };
  };

};
