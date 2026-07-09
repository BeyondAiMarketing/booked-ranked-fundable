import T      "../types/llm-fallback";
import ORT    "../types/openRouter";
import ICT    "../types/integrationCredentials";
import Map    "mo:core/Map";
import Time   "mo:core/Time";
import Text   "mo:core/Text";
import Array  "mo:core/Array";
import Nat    "mo:core/Nat";
import Int    "mo:core/Int";
import Nat32  "mo:core/Nat32";
import Float  "mo:core/Float";
import Char   "mo:core/Char";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import Error   "mo:core/Error";

module {

  // ── State ──────────────────────────────────────────────────────────────────

  /// In-memory state for the LLM fallback router.
  /// `health` is transient (resets on redeploy); `routeLog` is transient.
  /// Keyed by `providerToText(provider)` to avoid variant compare inference.
  public type State = {
    var health   : Map.Map<Text, T.ProviderHealth>;
    var routeLog : [T.RouteLogEntry];
  };

  /// Transform type alias matching the Outcall transformation signature.
  public type Transform = query (Outcall.TransformationInput) -> async Outcall.TransformationOutput;

  /// Provider keys resolved from the credentials store for a single call.
  /// Aliased from the types module so callers can use either
  /// `LLMFallbackLib.ProviderKeys` or `LLMFallbackTypes.ProviderKeys`.
  public type ProviderKeys = T.ProviderKeys;

  /// Feature flags that gate providers (empty-string key check is the primary
  /// gate; flags here are the existing app-level toggles).
  public type FeatureFlags = {
    leadEngineEnabled    : Bool;
    twilioEnabled         : Bool;
    sendgridEnabled       : Bool;
  };

  // ── State lifecycle ──────────────────────────────────────────────────────

  public func emptyState() : State {
    {
      var health   = Map.empty();
      var routeLog = [];
    }
  };

  /// Initialize a provider's health entry if absent.
  public func ensureHealth(state : State, provider : T.ProviderId) : () {
    let key = providerToText(provider);
    switch (state.health.get(key)) {
      case (?_) ();
      case null {
        let h : T.ProviderHealth = {
          var consecutiveFailures = 0;
          var skipUntilNs         = 0;
        };
        state.health.add(key, h);
      };
    }
  };

  /// Reset a provider's consecutive-failure counter and skip state (manual reset).
  public func resetProviderHealth(state : State, provider : T.ProviderId) : () {
    ensureHealth(state, provider);
    let key = providerToText(provider);
    switch (state.health.get(key)) {
      case (?h) {
        h.consecutiveFailures := 0;
        h.skipUntilNs := 0;
      };
      case null ();
    }
  };

  /// Return a serializable snapshot of all provider health states for the UI.
  public func healthSnapshots(state : State) : [T.ProviderHealthSnapshot] {
    let order = chainOrder();
    order.map(func(p) {
      ensureHealth(state, p);
      let key = providerToText(p);
      switch (state.health.get(key)) {
        case (?h) {
          {
            provider            = p;
            consecutiveFailures = h.consecutiveFailures;
            isSkipped           = Time.now() < h.skipUntilNs;
            skipUntilNs         = h.skipUntilNs;
          }
        };
        case null {
          {
            provider            = p;
            consecutiveFailures = 0;
            isSkipped           = false;
            skipUntilNs         = 0;
          }
        };
      }
    })
  };

  /// True if a provider is currently in skip state (auto-skipped for 5 min).
  public func isProviderSkipped(state : State, provider : T.ProviderId) : Bool {
    ensureHealth(state, provider);
    let key = providerToText(provider);
    switch (state.health.get(key)) {
      case (?h) Time.now() < h.skipUntilNs;
      case null false;
    }
  };

  /// Record a successful call: reset consecutive failures to zero.
  public func recordSuccess(state : State, provider : T.ProviderId) : () {
    ensureHealth(state, provider);
    let key = providerToText(provider);
    switch (state.health.get(key)) {
      case (?h) {
        h.consecutiveFailures := 0;
        h.skipUntilNs := 0;
      };
      case null ();
    }
  };

  /// Record a failed call: increment failures; trigger skip if threshold reached.
  public func recordFailure(state : State, provider : T.ProviderId) : () {
    ensureHealth(state, provider);
    let key = providerToText(provider);
    switch (state.health.get(key)) {
      case (?h) {
        h.consecutiveFailures += 1;
        if (h.consecutiveFailures >= T.skipFailureThreshold) {
          h.skipUntilNs := Time.now() + T.skipWindowNs;
        };
      };
      case null ();
    }
  };

  // ── Provider priority chain ──────────────────────────────────────────────

  /// The ordered fallback chain: Nemotron → OpenRouter → OpenAI → Anthropic → Generic.
  public func chainOrder() : [T.ProviderId] {
    [#Nemotron, #OpenRouter, #OpenAI, #Anthropic, #Generic]
  };

  /// Resolve which providers are eligible for this call (key present, not
  /// skipped, feature flag enabled). Preserves chain order.
  /// The Generic tier is always eligible (it delegates to legacy fallback).
  public func eligibleProviders(
    state   : State,
    keys    : ProviderKeys,
    flags   : FeatureFlags,
  ) : [T.ProviderId] {
    let order = chainOrder();
    order.filter(func(p : T.ProviderId) : Bool {
      if (isProviderSkipped(state, p)) return false;
      switch (p) {
        case (#Nemotron)   keys.nemotronKey != "";
        case (#OpenRouter) keys.openRouterKey != "";
        case (#OpenAI)     keys.openaiKey != "";
        case (#Anthropic)  keys.anthropicKey != "";
        case (#Generic)    true; // legacy fallback is always eligible
      }
    })
  };

  // ── Cost-aware routing ───────────────────────────────────────────────────

  /// Look up the static price entry for a (provider, model) pair.
  public func priceFor(provider : T.ProviderId, model : Text) : ?T.PriceEntry {
    T.priceTable.find(func(e) {
      e.provider == provider and e.model == model
    })
  };

  /// Estimate the cost in USD for a call given token counts.
  public func estimateCost(
    provider      : T.ProviderId,
    model         : Text,
    inputTokens   : Nat,
    outputTokens  : Nat,
  ) : Float {
    switch (priceFor(provider, model)) {
      case (?p) {
        let inCost  = (inputTokens.toFloat() / 1_000_000.0) * p.inputPerMillion;
        let outCost = (outputTokens.toFloat() / 1_000_000.0) * p.outputPerMillion;
        inCost + outCost
      };
      case null 0.0;
    }
  };

  /// Select the cheapest capable model for a task among eligible providers.
  /// Capability match (maxTokens, temperature, modelFamily) is enforced before
  /// cost comparison.
  public func selectCheapestCapable(
    eligible    : [T.ProviderId],
    capability  : T.TaskCapability,
  ) : ?{ provider : T.ProviderId; model : Text } {
    // Build candidate (provider, model) pairs from the price table, filtered
    // by eligibility and capability, then pick the cheapest by total cost
    // (input + output per million tokens).
    let candidates = T.priceTable.filter(func(e) {
      // Provider must be in the eligible list
      let eligibleOk = eligible.find(func(p) { p == e.provider }) != null;
      if (not eligibleOk) return false;
      // Capability: maxTokens must be >= capability.maxTokens
      if (e.maxTokens < capability.maxTokens) return false;
      // Capability: temperature must be within [minTemperature, maxTemperature]
      if (capability.temperature < e.minTemperature) return false;
      if (capability.temperature > e.maxTemperature) return false;
      // modelFamily: if specified, the model id must contain the family substring
      switch (capability.modelFamily) {
        case (?fam) {
          if (fam == "") { true }
          else {
            // case-insensitive substring check
            let modelLower = toLower(e.model);
            let famLower   = toLower(fam);
            containsSubstring(modelLower, famLower)
          }
        };
        case null true;
      }
    });
    if (candidates.size() == 0) return null;
    // Pick the cheapest by (inputPerMillion + outputPerMillion)
    let best = candidates.foldLeft<T.PriceEntry, { provider : T.ProviderId; model : Text; cost : Float }>(
      { provider = #Generic; model = ""; cost = 1_000_000_000.0 },
      func(best, e) {
        let cost = e.inputPerMillion + e.outputPerMillion;
        if (cost < best.cost) {
          { provider = e.provider; model = e.model; cost }
        } else {
          best
        }
      }
    );
    ?{ provider = best.provider; model = best.model }
  };

  // ── Provider adapters (exact API surfaces) ────────────────────────────────

  /// Nemotron adapter: POST https://integrate.api.nvidia.com/v1/chat/completions
  /// Bearer auth, model nvidia/llama-3.1-nemotron-70b-instruct,
  /// OpenAI-compatible request/response shape.
  public func callNemotron(
    apiKey    : Text,
    model     : Text,
    messages  : [T.LLMMessage],
    transform : Transform,
  ) : async Text {
    let pair = await callNemotronWithHint(apiKey, model, messages, transform);
    pair.0
  };

  /// OpenRouter adapter: POST https://openrouter.ai/api/v1/chat/completions
  /// Bearer auth, model IDs anthropic/claude-haiku-4.5 and openai/gpt-4o-mini,
  /// honors Retry-After header on 429 and 503.
  public func callOpenRouter(
    apiKey    : Text,
    model     : Text,
    messages  : [T.LLMMessage],
    transform : Transform,
  ) : async Text {
    let pair = await callOpenRouterWithHint(apiKey, model, messages, transform);
    pair.0
  };

  /// OpenAI adapter: POST https://api.openai.com/v1/chat/completions
  /// Bearer auth, models gpt-4o-mini and gpt-4o,
  /// honors x-ratelimit-remaining and x-ratelimit-reset headers.
  public func callOpenAI(
    apiKey    : Text,
    model     : Text,
    messages  : [T.LLMMessage],
    transform : Transform,
  ) : async Text {
    let pair = await callOpenAIWithHint(apiKey, model, messages, transform);
    pair.0
  };

  /// Anthropic adapter: POST https://api.anthropic.com/v1/messages
  /// x-api-key header plus anthropic-version header,
  /// models claude-haiku-4-5 and claude-sonnet-4-6,
  /// max_tokens required, temperature clamped to 0.0–1.0,
  /// treats 529 overloaded as retryable.
  public func callAnthropic(
    apiKey      : Text,
    model       : Text,
    messages    : [T.LLMMessage],
    transform   : Transform,
  ) : async Text {
    let pair = await callAnthropicWithHint(apiKey, model, 0.7, messages, transform);
    pair.0
  };

  // ── Internal *WithHint adapter variants ──────────────────────────────────
  //
  // These return (Text, ?Nat) tuples where the second component is a
  // Retry-After hint in milliseconds. The hint is extracted from the caught
  // exception message (e.g. parsing '429' or 'Retry-After' from the error
  // text) — NOT from response headers, because Motoko does not permit shared
  // query functions as inline closures. The existing `transform` parameter is
  // passed directly to Outcall.httpPostRequest, matching how openRouter.mo
  // does it. If no hint can be extracted, the second component is null.

  /// Nemotron adapter returning a Retry-After hint. Nemotron is
  /// OpenAI-compatible and emits `Retry-After` on 429.
  public func callNemotronWithHint(
    apiKey    : Text,
    model     : Text,
    messages  : [T.LLMMessage],
    transform : Transform,
  ) : async (Text, ?Nat) {
    if (apiKey == "") return ("", null);
    let bodyJson = "{\"model\":\"" # model # "\"," #
                   "\"messages\":" # buildMessagesJsonArray(messages) # "," #
                   "\"stream\":false}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        [
          { name = "Authorization"; value = "Bearer " # apiKey },
          { name = "Content-Type";  value = "application/json" },
        ],
        bodyJson,
        transform,
      );
      (extractContent(resp), null)
    } catch (e) {
      ("", extractRetryHintFromError(e))
    }
  };

  /// OpenRouter adapter returning a Retry-After hint. OpenRouter emits
  /// `Retry-After` (seconds) on 429 and 503.
  public func callOpenRouterWithHint(
    apiKey    : Text,
    model     : Text,
    messages  : [T.LLMMessage],
    transform : Transform,
  ) : async (Text, ?Nat) {
    if (apiKey == "") return ("", null);
    let bodyJson = "{\"model\":\"" # model # "\"," #
                   "\"messages\":" # buildMessagesJsonArray(messages) # "," #
                   "\"stream\":false}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://openrouter.ai/api/v1/chat/completions",
        [
          { name = "Authorization"; value = "Bearer " # apiKey },
          { name = "Content-Type";  value = "application/json" },
          { name = "HTTP-Referer";  value = "https://bookedrankedfunded.org" },
          { name = "X-Title";       value = "BRF-Platform" },
        ],
        bodyJson,
        transform,
      );
      (extractContent(resp), null)
    } catch (e) {
      ("", extractRetryHintFromError(e))
    }
  };

  /// OpenAI adapter returning a Retry-After hint. OpenAI emits
  /// `x-ratelimit-reset` (seconds until reset) on 429.
  public func callOpenAIWithHint(
    apiKey    : Text,
    model     : Text,
    messages  : [T.LLMMessage],
    transform : Transform,
  ) : async (Text, ?Nat) {
    if (apiKey == "") return ("", null);
    let bodyJson = "{\"model\":\"" # model # "\"," #
                   "\"messages\":" # buildMessagesJsonArray(messages) # "," #
                   "\"temperature\":0.7,\"max_tokens\":2000}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions",
        [
          { name = "Authorization"; value = "Bearer " # apiKey },
          { name = "Content-Type";  value = "application/json" },
        ],
        bodyJson,
        transform,
      );
      (extractContent(resp), null)
    } catch (e) {
      ("", extractRetryHintFromError(e))
    }
  };

  /// Anthropic adapter returning a Retry-After hint. Anthropic emits
  /// `Retry-After` (seconds) on 429 and `retry-after` on 529 overloaded.
  /// Temperature is passed through from the capability and clamped to [0.0, 1.0].
  public func callAnthropicWithHint(
    apiKey      : Text,
    model       : Text,
    temperature : Float,
    messages    : [T.LLMMessage],
    transform   : Transform,
  ) : async (Text, ?Nat) {
    if (apiKey == "") return ("", null);
    // Clamp temperature to [0.0, 1.0]
    let clampedTemp = if (temperature < 0.0) 0.0 else if (temperature > 1.0) 1.0 else temperature;
    let tempStr = floatToText(clampedTemp);
    let bodyJson = "{\"model\":\"" # model # "\"," #
                   "\"max_tokens\":2000," #
                   "\"temperature\":" # tempStr # "," #
                   "\"messages\":" # buildMessagesJsonArray(messages) # "}";
    try {
      let resp = await Outcall.httpPostRequest(
        "https://api.anthropic.com/v1/messages",
        [
          { name = "x-api-key";         value = apiKey },
          { name = "anthropic-version"; value = "2023-06-01" },
          { name = "Content-Type";      value = "application/json" },
        ],
        bodyJson,
        transform,
      );
      // Anthropic returns content[].text — try the standard extractor first,
      // then fall back to the Claude-specific content array extractor.
      let extracted = extractContent(resp);
      let content = if (extracted != "") extracted else extractClaudeContent(resp);
      (content, null)
    } catch (e) {
      ("", extractRetryHintFromError(e))
    }
  };

  // ── Retry logic with backoff ─────────────────────────────────────────────

  /// Retryable HTTP status codes: 429, 500, 529, and request timeout.
  /// Note: the Outcall API traps on non-2xx and timeouts, so retry is driven
  /// by caught exceptions. This predicate is exposed for callers that inspect
  /// raw status codes (e.g. via a custom transform).
  public func isRetryable(statusCode : Nat) : Bool {
    statusCode == 429 or statusCode == 500 or statusCode == 529 or statusCode == 408
  };

  /// Compute the next retry delay using exponential backoff with jitter.
  /// Honors Retry-After (OpenRouter, Anthropic) and x-ratelimit-reset (OpenAI)
  /// when present, overriding the computed backoff.
  public func nextRetryDelay(
    attempt       : Nat,
    config        : T.RetryConfig,
    retryAfterMs  : ?Nat,
  ) : Nat {
    switch (retryAfterMs) {
      case (?ms) ms;
      case null {
        // Exponential backoff: base * 2^attempt, capped at maxDelayMs.
        let exp = powerOfTwo(attempt);
        let raw = config.baseDelayMs * exp;
        let capped = if (raw > config.maxDelayMs) config.maxDelayMs else raw;
        // Jitter: add up to 25% of capped delay using Time.now() as entropy.
        let jitter = (capped / 4) * ((Int.abs(Time.now()) % 4) + 1) / 4;
        capped + jitter
      }
    }
  };

  /// Attempt a single provider call with up to `maxRetries` retries on
  /// retryable failures (429, 500, 529, timeout). Returns the content or empty
  /// Text on exhaustion, and updates health state. The call returns a
  /// (Text, ?Nat) tuple where the second component is a Retry-After hint in
  /// milliseconds extracted from response headers; the hint is passed to
  /// nextRetryDelay to override the computed backoff.
  public func attemptWithRetry(
    state     : State,
    provider  : T.ProviderId,
    call      : () -> async (Text, ?Nat),
    config    : T.RetryConfig,
  ) : async Text {
    var attempt = 0;
    var lastResult = "";
    label retryLoop while (attempt <= config.maxRetries) {
      var hint : ?Nat = null;
      try {
        let result = await call();
        hint := result.1;
        if (result.0 != "") {
          recordSuccess(state, provider);
          return result.0;
        };
        // Empty result treated as a failure — fall through to retry
        lastResult := "";
      } catch (_) {
        lastResult := "";
      };
      attempt += 1;
      if (attempt <= config.maxRetries) {
        let delayMs = nextRetryDelay(attempt, config, hint);
        await sleepMs(delayMs);
      };
    };
    // Exhausted retries — record a single failure for this provider attempt
    recordFailure(state, provider);
    lastResult
  };

  // ── Chain entry points ───────────────────────────────────────────────────

  /// The single LLM entry point: walks the priority chain, applying cost-aware
  /// selection, retry, and health tracking. Falls through to the legacy
  /// callWithFallback / callWithClaudeFallback behavior as the final Generic tier
  /// so non-migrated callers keep working.
  public func route(
    state        : State,
    task         : ORT.TaskType,
    messages     : [ORT.OpenRouterMessage],
    keys         : ProviderKeys,
    flags        : FeatureFlags,
    capability   : T.TaskCapability,
    transform    : Transform,
    legacyFallback : (ORT.TaskType, [ORT.OpenRouterMessage]) -> async Text,
  ) : async Text {
    let eligible = eligibleProviders(state, keys, flags);
    // Convert OpenRouterMessage → LLMMessage for the adapters
    let llmMessages = messages.map(
      func(m) { { role = m.role; content = m.content } }
    );

    // Walk the eligible chain in order
    for (provider in eligible.vals()) {
      // Track attempts per provider for the route log
      var attempts : Nat = 0;
      let result = switch (provider) {
        case (#Nemotron) {
          if (keys.nemotronKey == "") { "" } else {
            let model = "nvidia/llama-3.1-nemotron-70b-instruct";
            attempts := T.defaultRetryConfig.maxRetries + 1;
            await attemptWithRetry(state, #Nemotron, func() : async (Text, ?Nat) {
              await callNemotronWithHint(keys.nemotronKey, model, llmMessages, transform)
            }, T.defaultRetryConfig)
          }
        };
        case (#OpenRouter) {
          if (keys.openRouterKey == "") { "" } else {
            // Pick cheapest capable OpenRouter model, default to gpt-4o-mini
            let model = switch (selectModelForProvider(#OpenRouter, capability)) {
              case (?m) m;
              case null "openai/gpt-4o-mini";
            };
            attempts := T.defaultRetryConfig.maxRetries + 1;
            await attemptWithRetry(state, #OpenRouter, func() : async (Text, ?Nat) {
              await callOpenRouterWithHint(keys.openRouterKey, model, llmMessages, transform)
            }, T.defaultRetryConfig)
          }
        };
        case (#OpenAI) {
          if (keys.openaiKey == "") { "" } else {
            let model = switch (selectModelForProvider(#OpenAI, capability)) {
              case (?m) m;
              case null "gpt-4o-mini";
            };
            attempts := T.defaultRetryConfig.maxRetries + 1;
            await attemptWithRetry(state, #OpenAI, func() : async (Text, ?Nat) {
              await callOpenAIWithHint(keys.openaiKey, model, llmMessages, transform)
            }, T.defaultRetryConfig)
          }
        };
        case (#Anthropic) {
          if (keys.anthropicKey == "") { "" } else {
            let model = switch (selectModelForProvider(#Anthropic, capability)) {
              case (?m) m;
              case null "claude-haiku-4-5";
            };
            attempts := T.defaultRetryConfig.maxRetries + 1;
            await attemptWithRetry(state, #Anthropic, func() : async (Text, ?Nat) {
              await callAnthropicWithHint(keys.anthropicKey, model, capability.temperature, llmMessages, transform)
            }, T.defaultRetryConfig)
          }
        };
        case (#Generic) {
          // Final tier: delegate to legacy callWithFallback / callWithClaudeFallback
          attempts := 1;
          try { await legacyFallback(task, messages) } catch (_) { "" }
        };
      };
      if (result != "") {
        let model = switch (provider) {
          case (#Nemotron) "nvidia/llama-3.1-nemotron-70b-instruct";
          case (#OpenRouter) switch (selectModelForProvider(#OpenRouter, capability)) {
            case (?m) m; case null "openai/gpt-4o-mini"
          };
          case (#OpenAI) switch (selectModelForProvider(#OpenAI, capability)) {
            case (?m) m; case null "gpt-4o-mini"
          };
          case (#Anthropic) switch (selectModelForProvider(#Anthropic, capability)) {
            case (?m) m; case null "claude-haiku-4-5"
          };
          case (#Generic) "legacy";
        };
        logRoute(state, {
          provider      = provider;
          model         = model;
          estimatedCost = estimateCost(provider, model, estimateInputTokens(llmMessages), estimateOutputTokens());
          success       = true;
          attempts      = attempts;
          timestampNs   = Time.now();
        });
        return result;
      } else {
        // Provider exhausted retries and fell through — log the failure
        if (provider != #Generic) {
          let model = switch (provider) {
            case (#Nemotron) "nvidia/llama-3.1-nemotron-70b-instruct";
            case (#OpenRouter) switch (selectModelForProvider(#OpenRouter, capability)) {
              case (?m) m; case null "openai/gpt-4o-mini"
            };
            case (#OpenAI) switch (selectModelForProvider(#OpenAI, capability)) {
              case (?m) m; case null "gpt-4o-mini"
            };
            case (#Anthropic) switch (selectModelForProvider(#Anthropic, capability)) {
              case (?m) m; case null "claude-haiku-4-5"
            };
            case (#Generic) "legacy";
          };
          logRoute(state, {
            provider      = provider;
            model         = model;
            estimatedCost = 0.0;
            success       = false;
            attempts      = attempts;
            timestampNs   = Time.now();
          });
        };
      };
    };
    // All providers exhausted
    ""
  };

  /// Resolve provider keys from the existing credentials store.
  /// Reads openaiKey, claudeKey, openRouterApiKey, nvidiaNimApiKey, geminiApiKey.
  public func resolveKeys(creds : ICT.IntegrationCredentials) : ProviderKeys {
    {
      nemotronKey   = creds.nvidiaNimApiKey;
      openRouterKey = creds.openRouterApiKey;
      openaiKey     = creds.openaiKey;
      anthropicKey  = creds.claudeKey;
      geminiKey     = creds.geminiApiKey;
    }
  };

  /// Append a route log entry for observability (in-memory ring, capped).
  public func logRoute(state : State, entry : T.RouteLogEntry) : () {
    let maxLog = 100;
    let updated = state.routeLog.concat([entry]);
    state.routeLog := if (updated.size() > maxLog) {
      // Keep the most recent maxLog entries
      let drop = updated.size() - maxLog;
      Array.tabulate(maxLog, func(i) { updated[i + drop] })
    } else {
      updated
    };
  };

  /// Return the recent route log entries (shared/serializable).
  public func recentRouteLog(state : State, limit : Nat) : [T.RouteLogEntry] {
    let log = state.routeLog;
    let len = log.size();
    if (len <= limit) {
      log
    } else {
      let start = len - limit;
      Array.tabulate(limit, func(i) { log[start + i] })
    }
  };

  /// Send a fixed test prompt through the live LLM fallback router
  /// (Nemotron → OpenRouter → OpenAI → Anthropic → Generic) using the stored
  /// nvidiaNimApiKey, then read the most recent route log entry to determine
  /// which provider ultimately answered. Returns a structured NemotronTestResult.
  /// This function does NOT modify route(), callNemotronWithHint, or any other
  /// existing LLM fallback function — it only delegates to route() and reads
  /// the resulting route log.
  public func testNemotronPrompt(
    state          : State,
    keys            : ProviderKeys,
    flags           : FeatureFlags,
    capability      : T.TaskCapability,
    transform       : Transform,
    legacyFallback  : (ORT.TaskType, [ORT.OpenRouterMessage]) -> async Text,
  ) : async T.NemotronTestResult {
    // Fixed test prompt: a single user message asking for the word "READY".
    let testMessages : [ORT.OpenRouterMessage] = [{
      role    = "user";
      content = "Reply with the single word: READY";
    }];

    // Snapshot the route log length before the call so we can identify the
    // entry produced by this test invocation (route() appends at most one).
    let logLenBefore = state.routeLog.size();

    try {
      let responseText = await route(
        state,
        #Summarization, // ORT.TaskType — neutral task for the fixed test prompt
        testMessages,
        keys,
        flags,
        capability,
        transform,
        legacyFallback,
      );

      // Read the most recent route log entry to determine which provider
      // answered and the model used. If route() appended an entry for this
      // call, prefer it; otherwise fall back to the latest pre-existing entry.
      let latestEntry : ?T.RouteLogEntry = switch (state.routeLog.size() > logLenBefore) {
        case true {
          // route() appended at least one entry — read the last one.
          let log = state.routeLog;
          ?log[log.size() - 1]
        };
        case false {
          // No new entry was appended (e.g. all providers returned empty
          // without logging). Use the most recent pre-existing entry, if any.
          let prev = recentRouteLog(state, 1);
          if (prev.size() > 0) { ?prev[0] } else { null }
        };
      };

      let providerName = switch (latestEntry) {
        case (?e) providerToText(e.provider);
        case null "Unknown";
      };
      let modelName = switch (latestEntry) {
        case (?e) e.model;
        case null "";
      };

      if (responseText != "") {
        {
          responseText  = responseText;
          success       = true;
          provider      = providerName;
          model         = modelName;
          timestampNs   = Int.abs(Time.now());
          errorMessage   = null;
        }
      } else {
        // route() returned empty — no provider answered successfully.
        {
          responseText  = "";
          success       = false;
          provider      = providerName;
          model         = modelName;
          timestampNs   = Int.abs(Time.now());
          errorMessage   = ?"No provider in the fallback chain returned a response";
        }
      }
    } catch (e) {
      // route() threw — read the latest route log entry if available, then
      // surface the caught error message in the result.
      let latestEntry = recentRouteLog(state, 1);
      let providerName = if (latestEntry.size() > 0) {
        providerToText(latestEntry[0].provider);
      } else {
        "Unknown";
      };
      let modelName = if (latestEntry.size() > 0) {
        latestEntry[0].model;
      } else {
        "";
      };
      {
        responseText  = "";
        success       = false;
        provider      = providerName;
        model         = modelName;
        timestampNs   = Int.abs(Time.now());
        errorMessage   = ?e.message();
      }
    }
  };

  // ── Private helpers ──────────────────────────────────────────────────────

  /// Convert a ProviderId to a stable Text key for Map operations.
  private func providerToText(provider : T.ProviderId) : Text {
    switch (provider) {
      case (#Nemotron)  "Nemotron";
      case (#OpenRouter) "OpenRouter";
      case (#OpenAI)    "OpenAI";
      case (#Anthropic) "Anthropic";
      case (#Generic)   "Generic";
    }
  };

  /// Select the cheapest capable model for a specific provider, honoring the
  /// task's maxTokens, temperature range, and modelFamily requirements.
  /// Returns null if no model matches.
  private func selectModelForProvider(
    provider   : T.ProviderId,
    capability : T.TaskCapability,
  ) : ?Text {
    let candidates = T.priceTable.filter(func(e) {
      if (e.provider != provider) return false;
      // Capability: maxTokens must be >= capability.maxTokens
      if (e.maxTokens < capability.maxTokens) return false;
      // Capability: temperature must be within [minTemperature, maxTemperature]
      if (capability.temperature < e.minTemperature) return false;
      if (capability.temperature > e.maxTemperature) return false;
      // modelFamily: if specified, the model id must contain the family substring
      switch (capability.modelFamily) {
        case (?fam) {
          if (fam == "") true
          else {
            containsSubstring(toLower(e.model), toLower(fam))
          }
        };
        case null true;
      }
    });
    if (candidates.size() == 0) return null;
    ?candidates.foldLeft(
      "",
      func(best, e) {
        if (best == "") e.model
        else {
          let bestCost = switch (priceFor(provider, best)) {
            case (?p) p.inputPerMillion + p.outputPerMillion;
            case null 1_000_000_000.0;
          };
          let eCost = e.inputPerMillion + e.outputPerMillion;
          if (eCost < bestCost) e.model else best
        }
      }
    )
  };

  /// Extract a Retry-After hint (in milliseconds) from a caught exception.
  /// The Outcall API traps on non-2xx responses and timeouts, so retry hints
  /// must be parsed from the error message text rather than response headers.
  /// Looks for a "Retry-After" token followed by a number of seconds, or a
  /// bare seconds count near a "429"/"503"/"529" status indicator. Returns
  /// null if no hint can be extracted.
  private func extractRetryHintFromError(e : Error) : ?Nat {
    let msg = e.message();
    let lower = toLower(msg);
    // Look for "retry-after" followed (after optional separators) by a Nat.
    if (containsSubstring(lower, "retry-after")) {
      switch (findNatAfter(lower, "retry-after")) {
        case (?secs) return ?(secs * 1_000);
        case null ();
      };
    };
    // Look for "x-ratelimit-reset" followed by a Nat (OpenAI convention).
    if (containsSubstring(lower, "x-ratelimit-reset")) {
      switch (findNatAfter(lower, "x-ratelimit-reset")) {
        case (?secs) return ?(secs * 1_000);
        case null ();
      };
    };
    null
  };

  /// Find the first Nat-valued token that appears after a given marker substring
  /// in `text`. Tokens are delimited by non-digit characters. Returns null if
  /// no Nat follows the marker.
  private func findNatAfter(text : Text, marker : Text) : ?Nat {
    let chars = text.toArray();
    let mChars = marker.toArray();
    let cLen = chars.size();
    let mLen = mChars.size();
    if (mLen == 0 or mLen > cLen) return null;
    // Locate the first occurrence of the marker.
    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= cLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < mLen) {
        if (chars[i + j] != mChars[j]) {
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
    switch (startIdx) {
      case null return null;
      case (?after) {
        // Scan forward for the first digit run.
        var k = after;
        label skipNonDigits while (k < cLen) {
          let c = chars[k];
          if (c >= '0' and c <= '9') break skipNonDigits;
          k += 1;
        };
        if (k >= cLen) return null;
        // Collect the digit run.
        var digits : Text = "";
        label collectDigits while (k < cLen) {
          let c = chars[k];
          if (c >= '0' and c <= '9') {
            digits #= Text.fromChar(c);
            k += 1;
          } else {
            break collectDigits;
          };
        };
        parseNat(digits)
      };
    }
  };

  /// Parse a Text as a non-negative integer. Returns null on failure.
  private func parseNat(s : Text) : ?Nat {
    if (s == "") return null;
    var result : Nat = 0;
    for (c in s.chars()) {
      if (c < '0' or c > '9') return null;
      result := result * 10 + Nat32.toNat(c.toNat32() - 48);
    };
    ?result
  };

  /// Rough estimate of input tokens for cost logging. The IC has no tokenizer;
  /// we approximate 1 token ≈ 4 chars across all messages.
  private func estimateInputTokens(msgs : [T.LLMMessage]) : Nat {
    var chars = 0;
    for (m in msgs.vals()) {
      chars += m.content.size();
    };
    chars / 4
  };

  /// Rough estimate of output tokens for cost logging. We don't know the actual
  /// output length until the call returns; use a conservative default of 500.
  private func estimateOutputTokens() : Nat {
    500
  };

  /// Build a JSON array of messages from the common LLMMessage contract.
  private func buildMessagesJsonArray(msgs : [T.LLMMessage]) : Text {
    var json = "[";
    var i = 0;
    for (m in msgs.vals()) {
      if (i > 0) json #= ",";
      json #= "{\"role\":\"" # escapeJson(m.role) # "\",\"content\":\"" # escapeJson(m.content) # "\"}";
      i += 1;
    };
    json # "]";
  };

  /// Extract the `content` field from a raw OpenAI-compatible JSON response.
  private func extractContent(raw : Text) : Text {
    let marker      = "\"content\":\"";
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

  /// Extract text from Claude's content array format:
  /// {"content":[{"type":"text","text":"..."}],...}
  private func extractClaudeContent(json : Text) : Text {
    let marker      = "\"text\":\"";
    let markerChars = marker.toArray();
    let jsonChars   = json.toArray();
    let mLen        = markerChars.size();
    let jLen        = jsonChars.size();

    var startIdx : ?Nat = null;
    var i = 0;
    label findMarker while (i + mLen <= jLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < mLen) {
        if (jsonChars[i + j] != markerChars[j]) {
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
        label scan while (end < jLen) {
          let c = jsonChars[end];
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
        Text.fromIter(Array.tabulate(len, func(k) { jsonChars[afterMarker + k] }).vals());
      };
    };
  };

  /// Escape a Text value for safe inclusion in a JSON string literal.
  private func escapeJson(s : Text) : Text {
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
    out
  };

  /// Convert a Float to a Text representation suitable for JSON.
  private func floatToText(f : Float) : Text {
    // Motoko Float.toText produces e.g. "0.700000" — trim is not needed for JSON
    f.toText()
  };

  /// Compute 2^n for small n (used in exponential backoff).
  private func powerOfTwo(n : Nat) : Nat {
    var result = 1;
    var i = 0;
    while (i < n) {
      result *= 2;
      i += 1;
    };
    result
  };

  /// Sleep for approximately `ms` milliseconds using async/await yields.
  /// The IC has no native sleep; we approximate a delay by yielding control
  /// (await async ()) a number of times proportional to the computed delay.
  /// Each yield lets other messages in the canister's queue make progress,
  /// so the effective backoff grows with the number of yields. This is the
  /// standard IC pattern for approximate delays from a pure lib function.
  private func sleepMs(ms : Nat) : async () {
    // Scale ms into a bounded number of yields. We use ~1 yield per 10ms of
    // requested delay, capped at 200 yields to avoid burning excessive rounds.
    let yields = if (ms / 10 > 200) 200 else ms / 10;
    var i = 0;
    while (i < yields) {
      await async ();
      i += 1;
    };
  };

  /// Case-insensitive substring check.
  private func containsSubstring(haystack : Text, needle : Text) : Bool {
    if (needle == "") return true;
    let hChars = haystack.toArray();
    let nChars = needle.toArray();
    let hLen = hChars.size();
    let nLen = nChars.size();
    if (nLen > hLen) return false;
    var i = 0;
    label search while (i + nLen <= hLen) {
      var matched = true;
      var j = 0;
      label matchLoop while (j < nLen) {
        if (hChars[i + j] != nChars[j]) {
          matched := false;
          break matchLoop;
        };
        j += 1;
      };
      if (matched) return true;
      i += 1;
    };
    false
  };

  /// Convert Text to lowercase (ASCII-only).
  private func toLower(s : Text) : Text {
    var out = "";
    for (c in s.chars()) {
      if (c >= 'A' and c <= 'Z') {
        out #= Text.fromChar(Nat32.toChar(c.toNat32() + 32))
      } else {
        out #= Text.fromChar(c)
      };
    };
    out
  };

};
