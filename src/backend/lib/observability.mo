import T    "../types/observability";
import Time "mo:core/Time";
import Int  "mo:core/Int";
import Nat  "mo:core/Nat";
import Text "mo:core/Text";

/// Stateless observability aggregator.
///
/// This module owns NO state. It formats and aggregates data that callers
/// (main.mo and existing mixins) pass in — build version, canister start
/// time, provider health, and pre-computed metric counts. The actual state
/// lives in main.mo and the existing mixins; this keeps new state minimal
/// per the project's deploy-risk preference.
module {

  // ── Health status ───────────────────────────────────────────────────────

  /// Compute the aggregate canister health from the build version, the
  /// canister start time, and the per-provider health list.
  ///
  /// `uptimeMs` is derived from `canisterStartTime` (nanoseconds since the
  /// Unix epoch, as returned by `Time.now()` at canister init). The
  /// aggregate `status` follows the rule:
  ///   - "healthy"  if every provider reports `healthy = true`
  ///   - "degraded" if at least one but not all providers are down
  ///   - "down"     if every provider is down
  /// When the provider list is empty, the canister is treated as "healthy"
  /// (no integration is known to be failing).
  public func getHealthStatus(
    buildVersion      : Text,
    canisterStartTime : Int,
    providerHealth    : [T.ProviderHealth],
  ) : T.HealthStatus {
    let now : Int = Time.now();
    let uptimeNs : Int = now - canisterStartTime;
    let uptimeMs : Int = uptimeNs / 1_000_000;

    let total : Nat = providerHealth.size();
    var downCount : Nat = 0;
    for (p in providerHealth.vals()) {
      if (not p.healthy) { downCount += 1 };
    };

    let status : Text = if (total == 0) {
      "healthy"
    } else if (downCount == 0) {
      "healthy"
    } else if (downCount == total) {
      "down"
    } else {
      "degraded"
    };

    {
      buildVersion;
      uptimeMs;
      timestamp  = now;
      providers  = providerHealth;
      status;
    };
  };

  // ── Metrics snapshot ────────────────────────────────────────────────────

  /// Format a metrics snapshot from pre-computed counts. The module does
  /// NOT compute these counts itself — callers read them from existing
  /// state (leads store, webhook inbox, email send logs, rate limiter,
  /// LLM fallback route log) and pass them in. This keeps the observability
  /// module stateless and avoids duplicating any existing state.
  public func getMetricsSnapshot(
    leadsByTenant           : [(Text, Nat)],
    webhookReceiptsBySource  : [(Text, Nat)],
    emailSends               : Nat,
    rateLimitRejections      : Nat,
    llmFallbackOutcomes      : [(Text, Nat)],
  ) : T.MetricsSnapshot {
    {
      leadsByTenant;
      webhookReceiptsBySource;
      emailSends;
      rateLimitRejections;
      llmFallbackOutcomes;
      timestamp = Time.now();
    };
  };

  // ── Correlation id ──────────────────────────────────────────────────────

  /// Generate a unique-ish correlation identifier for tracing error
  /// responses without exposing internals. Combines the current nanosecond
  /// timestamp with a pseudo-random nonce derived from `Time.now()` entropy.
  /// The result is safe to surface to callers in error messages.
  public func generateCorrelationId() : Text {
    let now : Int = Time.now();
    // Pseudo-random nonce: low bits of the timestamp provide entropy that
    // varies between consecutive calls within the same millisecond window.
    let nonce : Nat = Int.abs(now) % 1_000_000;
    "corr-" # now.toText() # "-" # nonce.toText();
  };

};
