/// OmniRouter — universal AI dispatch layer types.
///
/// IntentClass and RoutingTarget are Text aliases (not variants) to avoid the
/// moc 1.10.1 stable-signature crash (desugar.ml:1083 List.map2) that
/// triggers when variant-with-payload types appear in public shared function
/// return types. All encoded values are documented inline.
module {

  // ── Routing classification types ─────────────────────────────────────────

  /// Intent classification result (Text alias for stable-signature safety).
  ///
  /// Encoded values:
  ///   "lead_management"   — lead import, enrichment, dedup, pipeline
  ///   "email_outreach"    — email sequences, follow-ups, drip campaigns
  ///   "content_creation"  — social posts, landing pages, proposals
  ///   "review_management" — review responses, reputation management
  ///   "seo_optimization"  — local SEO, GBP, citations, ranking
  ///   "analytics"         — performance reports, monthly reviews
  ///   "funding_readiness" — fundability, loan profile, credit
  ///   "voice_outreach"    — voice agent scripts, cold-call sequences
  ///   "general_assistant" — catch-all for unclassified or complex goals
  public type IntentClass = Text;

  /// Routing target (Text alias for stable-signature safety).
  ///
  /// Encoded values:
  ///   "llm_direct"   — single-pass call through the LLM fallback chain
  ///   "orchestrator" — multi-step goal decomposition via AI Orchestrator
  public type RoutingTarget = Text;

  // ── Core request / response types ────────────────────────────────────────

  /// The routing decision produced for a single OmniRouter request.
  public type RoutingDecision = {
    intentClass : IntentClass;
    target      : RoutingTarget;
    taskType    : Text;     // OpenRouter TaskType key, e.g. "OutreachCopy"
    confidence  : Float;    // 0.0–1.0 classification confidence
    reasoning   : Text;     // human-readable explanation
  };

  /// Request accepted by the OmniRouter entry point.
  public type OmniRequest = {
    goal        : Text;
    tenantId    : Text;
    contextHint : ?Text;   // optional domain hint: "lead" | "email" | "seo" | etc.
    maxBudget   : ?Float;  // optional USD budget cap (informational)
  };

  /// Structured result returned by `omniRoute`.
  public type OmniResult = {
    output          : Text;
    routingDecision : RoutingDecision;
    provider        : ?Text;
    model           : ?Text;
    estimatedCost   : Float;   // USD estimate from the route log
    correlationId   : Text;
    durationNs      : Int;
    success         : Bool;
    errorMessage    : ?Text;
  };

  // ── Observability types ──────────────────────────────────────────────────

  /// Append-only route log entry for OmniRouter observability.
  public type RouteLogEntry = {
    correlationId : Text;
    tenantId      : Text;
    goalSummary   : Text;       // first 120 chars of the goal
    intentClass   : IntentClass;
    target        : RoutingTarget;
    provider      : ?Text;
    model         : ?Text;
    success       : Bool;
    durationNs    : Int;
    timestampNs   : Int;
  };

  /// Metrics snapshot for the OmniRouter dashboard.
  public type OmniRouterMetrics = {
    totalRequests      : Nat;
    successfulRequests : Nat;
    failedRequests     : Nat;
    avgDurationNs      : Int;
    intentBreakdown    : [(Text, Nat)];  // intentClass → request count
    providerBreakdown  : [(Text, Nat)];  // provider name → request count
  };

};
