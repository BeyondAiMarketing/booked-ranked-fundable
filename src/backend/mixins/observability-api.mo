import Map      "mo:core/Map";
import List     "mo:core/List";
import Nat      "mo:core/Nat";
import Int      "mo:core/Int";
import Text     "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime  "mo:core/Runtime";

import AccessControl "mo:caffeineai-authorization/access-control";

import Obs          "../lib/observability";
import ObsTypes     "../types/observability";
import LLMFallback  "../lib/llm-fallback";
import LLMTypes     "../types/llm-fallback";
import ICTypes      "../types/integrationCredentials";
import EmailTypes   "../types/email";
import WebhookInboxTypes "../types/webhookInbox";

/// Observability & Health Endpoint — Public API
///
/// Exposes two query endpoints over the canister's public surface:
///
///   - `getHealthStatus()` — PUBLIC (no auth). Returns an aggregate health
///     snapshot suitable for uptime checks and load-balancer probes. It
///     surfaces the build version, canister uptime, and per-provider health
///     derived from the integration health ping state and the LLM fallback
///     health snapshots. No sensitive data is exposed — only provider names,
///     healthy flags, last-checked timestamps, and optional detail strings.
///
///   - `getMetrics()` — ADMIN-ONLY. Returns a metrics snapshot aggregating
///     counts from existing state: leads by tenant, webhook receipts by
///     source, total email sends, rate-limit rejections, and LLM fallback
///     outcomes. The counts are computed on demand from the live state
///     passed in via the include block — this mixin owns NO state of its
///     own, keeping new persistent state to zero per the project's
///     deploy-risk preference.
///
/// State is injected via the mixin parameters (same pattern as the other
/// mixins in this project). `main.mo` is responsible for wiring the state
/// slices and the `getBuildVersion` / `canisterStartTime` bindings; this
/// file does NOT touch `main.mo`.
mixin (
  /// Authorization state for the admin check on `getMetrics()`.
  accessControlState : AccessControl.AccessControlState,

  /// Closure returning the current build version string. In `main.mo` pass
  /// `func() : Text { getBuildVersion() }` (or the literal the actor returns)
  /// so the mixin can read it without a self-call.
  getBuildVersion : () -> Text,

  /// Canister start time in nanoseconds since the Unix epoch (a `Time.now()`
  /// snapshot captured at init). Transient — resets on redeploy, which is
  /// the desired behavior for uptime accounting.
  canisterStartTime : Int,

  /// Integration health ping state: serviceId -> history of ApiPingRecord.
  /// The most recent record per service is surfaced as a ProviderHealth
  /// entry. Source: `apiPingState` in `main.mo`.
  apiPingState : Map.Map<Text, List.List<ICTypes.ApiPingRecord>>,

  /// LLM fallback router state. Its `healthSnapshots` feed ProviderHealth
  /// entries for each LLM provider, and its `routeLog` feeds the
  /// `llmFallbackOutcomes` metric (success counts per provider).
  /// Source: `llmFallbackState` in `main.mo`.
  llmFallbackState : LLMFallback.State,

  /// Leads by tenant: closure yielding `(tenantId, leadCount)` pairs. Used to
  /// compute the `leadsByTenant` metric. Source: a closure over `leads` in
  /// `main.mo`. The Lead type itself is not needed here — only the per-tenant
  /// map size matters, so main.mo computes the pairs and passes them in,
  /// avoiding an invariant `Map.Map<Text, Map.Map<Text, Any>>` parameter that
  /// the private `Lead` type cannot satisfy.
  leadsByTenant : () -> [(Text, Nat)],

  /// Unified webhook inbox state. Each NormalizedWebhookEvent carries a
  /// `provider` variant; we count events grouped by the provider's text
  /// label to produce `webhookReceiptsBySource`. Source: `webhookInboxState`
  /// in `main.mo`.
  webhookInboxState : { var s : WebhookInboxTypes.WebhookInboxState },

  /// Email send log. The total number of records is surfaced as
  /// `emailSends`. Source: `emailLogs` in `main.mo`.
  emailLogs : List.List<EmailTypes.EmailLogRecord>,

  /// In-memory rate-limit rejection counter. A simple mutable Nat record
  /// shared by reference so increments by the rate limiter propagate here.
  /// Transient — resets on redeploy (per the project's "no new stable
  /// state" preference). Source: a `{ var n : Nat }` record in `main.mo`.
  rateLimitRejections : { var n : Nat },
) {

  // ── Auth helper ──────────────────────────────────────────────────────────

  func obs_assertAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
  };

  // ── Provider health aggregation ──────────────────────────────────────────

  /// Build the [ProviderHealth] list from the integration health ping state
  /// and the LLM fallback health snapshots.
  ///
  /// Integration providers (twilio, sendgrid, etc.) come from `apiPingState`:
  /// the most recent ping per service determines `healthy` (status == "healthy"
  /// → true), `lastChecked` (lastPingTime), and `details` (errorMessage).
  ///
  /// LLM providers (Nemotron, OpenRouter, OpenAI, Anthropic, Generic) come
  /// from `llmFallbackState` via `LLMFallback.healthSnapshots`: a provider is
  /// healthy when it is neither skipped nor in a consecutive-failure state.
  func buildProviderHealth() : [ObsTypes.ProviderHealth] {
    let result = List.empty<ObsTypes.ProviderHealth>();

    // ── Integration health pings ──
    for ((serviceId, history) in apiPingState.entries()) {
      switch (history.last()) {
        case (?latest) {
          result.add({
            provider    = serviceId;
            healthy     = latest.status == "healthy";
            lastChecked = latest.lastPingTime;
            details     = latest.errorMessage;
          });
        };
        case null {};
      };
    };

    // ── LLM fallback health snapshots ──
    let snapshots = LLMFallback.healthSnapshots(llmFallbackState);
    for (snap in snapshots.vals()) {
      let providerName = llmProviderToText(snap.provider);
      // A provider is healthy when not skipped and not in a failure spiral.
      let healthy = (not snap.isSkipped) and (snap.consecutiveFailures == 0);
      let details : ?Text = if (snap.isSkipped) {
        ?("skipped until " # snap.skipUntilNs.toText())
      } else if (snap.consecutiveFailures > 0) {
        ?(snap.consecutiveFailures.toText() # " consecutive failures");
      } else {
        null;
      };
      result.add({
        provider    = providerName;
        healthy     = healthy;
        lastChecked = snap.skipUntilNs; // best-available timestamp proxy
        details     = details;
      });
    };

    result.toArray()
  };

  /// Map an LLM ProviderId variant to its stable Text label. Mirrors the
  /// private `providerToText` in `lib/llm-fallback.mo` so this mixin does
  /// not depend on a private helper.
  func llmProviderToText(provider : LLMTypes.ProviderId) : Text {
    switch (provider) {
      case (#Nemotron)  "Nemotron";
      case (#OpenRouter) "OpenRouter";
      case (#OpenAI)    "OpenAI";
      case (#Anthropic) "Anthropic";
      case (#Generic)   "Generic";
    }
  };

  // ── Metrics aggregation ──────────────────────────────────────────────────

  /// Compute `(tenantId, leadCount)` pairs from the leads store via the
  /// injected closure (main.mo iterates `leads` and returns the pairs, since
  /// the private `Lead` type cannot be typed as `Any` through an invariant
  /// `Map.Map` parameter).
  func computeLeadsByTenant() : [(Text, Nat)] {
    leadsByTenant()
  };

  /// Compute `(source, count)` pairs from the webhook inbox, grouping events
  /// by their provider variant's text label.
  func computeWebhookReceiptsBySource() : [(Text, Nat)] {
    let counts = Map.empty<Text, Nat>();
    for ((_, event) in webhookInboxState.s.events.entries()) {
      let sourceLabel = webhookProviderToText(event.provider);
      switch (counts.get(sourceLabel)) {
        case (?n) { counts.add(sourceLabel, n + 1) };
        case (null) { counts.add(sourceLabel, 1) };
      };
    };
    let result = List.empty<(Text, Nat)>();
    for ((sourceLabel, n) in counts.entries()) {
      result.add((sourceLabel, n));
    };
    result.toArray()
  };

  /// Map a WebhookInboxProvider variant to its stable text label.
  func webhookProviderToText(provider : WebhookInboxTypes.WebhookInboxProvider) : Text {
    switch (provider) {
      case (#instantly)  "instantly";
      case (#smartlead)  "smartlead";
      case (#twilio)     "twilio";
      case (#sendgrid)   "sendgrid";
    }
  };

  /// Total email send count = number of EmailLogRecord entries.
  func computeEmailSends() : Nat {
    emailLogs.size()
  };

  /// Compute `(provider, successCount)` pairs from the LLM fallback route
  /// log. Only entries with `success = true` are counted.
  func computeLlmFallbackOutcomes() : [(Text, Nat)] {
    let counts = Map.empty<Text, Nat>();
    // recentRouteLog returns the most recent entries; request the full cap
    // (100) so the count reflects the in-memory ring buffer.
    let log = LLMFallback.recentRouteLog(llmFallbackState, 100);
    for (entry in log.vals()) {
      if (entry.success) {
        let sourceLabel = llmProviderToText(entry.provider);
        switch (counts.get(sourceLabel)) {
          case (?n) { counts.add(sourceLabel, n + 1) };
          case (null) { counts.add(sourceLabel, 1) };
        };
      };
    };
    let result = List.empty<(Text, Nat)>();
    for ((sourceLabel, n) in counts.entries()) {
      result.add((sourceLabel, n));
    };
    result.toArray()
  };

  // ── Public query endpoints ───────────────────────────────────────────────

  /// PUBLIC health endpoint — no auth required.
  ///
  /// Returns an aggregate health snapshot for the canister: build version,
  /// uptime in milliseconds, current timestamp, per-provider health list,
  /// and an aggregate status ("healthy" | "degraded" | "down"). Safe to
  /// expose to uptime monitors and load balancers.
  public query func getHealthStatus() : async ObsTypes.HealthStatus {
    Obs.getHealthStatus(
      getBuildVersion(),
      canisterStartTime,
      buildProviderHealth(),
    )
  };

  /// ADMIN-ONLY metrics endpoint.
  ///
  /// Returns a metrics snapshot aggregating counts from existing state:
  /// leads by tenant, webhook receipts by source, total email sends,
  /// rate-limit rejections, and LLM fallback success outcomes. The caller
  /// must be an admin (checked via `AccessControl.isAdmin`).
  public query ({ caller }) func getMetrics() : async ObsTypes.MetricsSnapshot {
    obs_assertAdmin(caller);
    Obs.getMetricsSnapshot(
      computeLeadsByTenant(),
      computeWebhookReceiptsBySource(),
      computeEmailSends(),
      rateLimitRejections.n,
      computeLlmFallbackOutcomes(),
    )
  };

};
