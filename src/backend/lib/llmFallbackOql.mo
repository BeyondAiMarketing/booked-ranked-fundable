import OQL   "mo:caffeineai-oql";
import T     "../types/llm-fallback";

/// Builds the OQL entity list for the LLM fallback router's in-memory
/// observability data.
///
/// Exposes one queryable entity (`.controllerOnly()` — private app
/// observability data the Data Intelligence agent answers over, but no end
/// user reads directly, mirroring the controller-only gating on the existing
/// LLM fallback API):
///
///   - `llmFallbackRouteLog` — one row per routed LLM call. The `provider`
///     variant is projected to its tag text so the row stays on the
///     auto-derivation-compatible manual path.
///
/// This module is additive: it reads `llmFallbackState` and declares entities
/// only. It does not mutate state or change any existing public API.
module {

  /// Convert a `ProviderId` variant to its tag text for OQL.
  func providerToText(p : T.ProviderId) : Text {
    switch (p) {
      case (#Nemotron)   "Nemotron";
      case (#OpenRouter) "OpenRouter";
      case (#OpenAI)     "OpenAI";
      case (#Anthropic)  "Anthropic";
      case (#Generic)    "Generic";
    };
  };

  /// Build the OQL entity list for the LLM fallback route log.
  /// Call this from `main.mo` and pass the result to
  /// `include Expose({ entities = ... })`.
  public func entities(
    llmFallbackState : {
      var routeLog : [T.RouteLogEntry];
    },
  ) : [OQL.Decl] {

    let routeLogEntity = OQL.Entity.manual<T.RouteLogEntry>(
      "llmFallbackRouteLog",
      func() = llmFallbackState.routeLog.vals(),
      "LLMFallbackRouteLog",
      "timestampNs",
    )
      .payload("provider",      func(e) = providerToText(e.provider))
      .payload("model",         func(e) = e.model)
      .payload("estimatedCost", func(e) = e.estimatedCost)
      .payload("success",       func(e) = e.success)
      .payload("attempts",      func(e) = e.attempts)
      .payload("timestampNs",   func(e) = e.timestampNs)
      .controllerOnly()
      .build();

    [routeLogEntity];
  };

};
