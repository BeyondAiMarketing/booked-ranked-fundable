module {

  // -----------------------------------------------------------------------
  // Observability & Health Endpoint — types
  //
  // This module is STATELESS: it defines the shapes that the observability
  // lib formats and that callers (main.mo / mixins) populate from existing
  // state. No new persistent metric store is introduced.
  // -----------------------------------------------------------------------

  /// Health status of a single integration provider, surfaced to operators.
  public type ProviderHealth = {
    provider     : Text;   // provider identifier (e.g. "Nemotron", "twilio")
    healthy      : Bool;   // true if the provider is currently considered up
    lastChecked  : Int;    // nanosecond timestamp of the last health check
    details      : ?Text;  // optional human-readable detail / error message
  };

  /// Aggregate health snapshot for the whole canister.
  /// `status` is computed from `providers`:
  ///   - "healthy"  if every provider is up
  ///   - "degraded" if at least one but not all providers are down
  ///   - "down"     if every provider is down (or there are none and the
  ///                 canister considers itself down — callers decide)
  public type HealthStatus = {
    buildVersion : Text;
    uptimeMs     : Int;            // milliseconds since canister start
    timestamp    : Int;            // nanosecond timestamp of this snapshot
    providers    : [ProviderHealth];
    status       : Text;           // "healthy" | "degraded" | "down"
  };

  /// Pre-computed metrics snapshot. The observability module does NOT own
  /// these counts — callers pass them in, having read them from existing
  /// state (leads store, webhook inbox, email send logs, rate limiter,
  /// LLM fallback route log). The module only formats the aggregate.
  public type MetricsSnapshot = {
    leadsByTenant           : [(Text, Nat)];  // (tenantId, lead count)
    webhookReceiptsBySource : [(Text, Nat)];  // (source, received-event count)
    emailSends              : Nat;             // total outbound emails sent
    rateLimitRejections     : Nat;            // total rate-limit denials
    llmFallbackOutcomes     : [(Text, Nat)];  // (provider, success count)
    timestamp               : Int;            // nanosecond timestamp of this snapshot
  };

};
