module {

  /// Provider identifiers in the fallback chain.
  /// Order: Nemotron → OpenRouter → OpenAI → Anthropic → generic fallback.
  public type ProviderId = {
    #Nemotron;
    #OpenRouter;
    #OpenAI;
    #Anthropic;
    #Generic;
  };

  /// Adapter type for the request/response shape normalization.
  public type AdapterKind = {
    #openai_compatible; // Nemotron, OpenRouter, OpenAI
    #anthropic;         // Anthropic Claude
    #generic;           // legacy callWithFallback / callWithClaudeFallback
  };

  /// A single message in a chat completion request (common contract).
  public type LLMMessage = {
    role    : Text; // "system" | "user" | "assistant"
    content : Text;
  };

  /// Capability requirements a task imposes on a candidate model.
  /// Used by cost-aware routing to filter before price comparison.
  public type TaskCapability = {
    maxTokens     : Nat;     // minimum max_tokens the model must support
    temperature   : Float;   // desired temperature (clamped 0.0–1.0 for Anthropic)
    modelFamily   : ?Text;   // required model family substring (e.g. "claude"), null = any
  };

  /// Static price entry per (provider, model) — input and output token cost
  /// in USD per million tokens. No live pricing fetch.
  /// Includes capability metadata (maxTokens, temperature range) used by
  /// cost-aware routing to filter candidates before price comparison.
  public type PriceEntry = {
    provider         : ProviderId;
    model            : Text;
    inputPerMillion  : Float;  // USD per 1M input tokens
    outputPerMillion : Float;  // USD per 1M output tokens
    maxTokens        : Nat;    // max output tokens the model supports
    minTemperature   : Float;  // inclusive lower bound of supported range
    maxTemperature   : Float;  // inclusive upper bound of supported range
  };

  /// Per-provider health state held in-memory only (resets on redeploy).
  public type ProviderHealth = {
    var consecutiveFailures : Nat;
    var skipUntilNs         : Int; // Time.now() + skip window; 0 = not skipped
  };

  /// Snapshot of a provider's health surfaced to the UI (shared/serializable).
  public type ProviderHealthSnapshot = {
    provider            : ProviderId;
    consecutiveFailures : Nat;
    isSkipped           : Bool;
    skipUntilNs         : Int;
  };

  /// Result of a single routed LLM call, logged for observability.
  public type RouteLogEntry = {
    provider       : ProviderId;
    model          : Text;
    estimatedCost  : Float; // USD
    success        : Bool;
    attempts       : Nat;
    timestampNs    : Int;
  };

  /// Structured result returned by testNemotronPrompt: sends a fixed test
  /// prompt through the live LLM fallback router and reports which provider
  /// ultimately answered, the model used, and the response text (or error).
  public type NemotronTestResult = {
    responseText  : Text;   // the LLM response text, or empty on failure
    success       : Bool;   // true if a non-empty response was returned
    provider      : Text;   // provider that answered (read from latest route log)
    model         : Text;   // model name used by the answering provider
    timestampNs   : Nat;    // nanosecond timestamp of the result
    errorMessage   : ?Text; // present when the call failed or no provider answered
  };

  /// Configuration for retry behavior within a single provider attempt.
  public type RetryConfig = {
    maxRetries       : Nat;   // max 3 per provider before falling through
    baseDelayMs      : Nat;   // exponential backoff base
    maxDelayMs       : Nat;   // backoff cap
    timeoutMs        : Nat;   // per-attempt timeout, distinct from retry count
  };

  /// Default retry configuration (3 retries, exponential backoff with jitter).
  public let defaultRetryConfig : RetryConfig = {
    maxRetries  = 3;
    baseDelayMs = 500;
    maxDelayMs  = 8_000;
    timeoutMs   = 30_000;
  };

  /// Skip window: 5 minutes in nanoseconds.
  public let skipWindowNs : Int = 300_000_000_000;

  /// Consecutive-failure threshold that triggers a 5-minute skip.
  public let skipFailureThreshold : Nat = 3;

  /// Static price table per provider and model.
  /// Maintained in backend config — no live pricing fetch.
  /// maxTokens/minTemperature/maxTemperature describe each model's capability
  /// envelope so cost-aware routing can filter before price comparison.
  public let priceTable : [PriceEntry] = [
    // Nemotron (NVIDIA NIM) — OpenAI-compatible
    { provider = #Nemotron; model = "nvidia/llama-3.1-nemotron-70b-instruct";
      inputPerMillion = 0.0; outputPerMillion = 0.0;
      maxTokens = 4096; minTemperature = 0.0; maxTemperature = 2.0 },
    // OpenRouter — anthropic/claude-haiku-4.5
    { provider = #OpenRouter; model = "anthropic/claude-haiku-4.5";
      inputPerMillion = 0.001; outputPerMillion = 0.005;
      maxTokens = 8192; minTemperature = 0.0; maxTemperature = 1.0 },
    // OpenRouter — openai/gpt-4o-mini
    { provider = #OpenRouter; model = "openai/gpt-4o-mini";
      inputPerMillion = 0.00015; outputPerMillion = 0.0006;
      maxTokens = 16384; minTemperature = 0.0; maxTemperature = 2.0 },
    // OpenAI — gpt-4o-mini
    { provider = #OpenAI; model = "gpt-4o-mini";
      inputPerMillion = 0.00015; outputPerMillion = 0.0006;
      maxTokens = 16384; minTemperature = 0.0; maxTemperature = 2.0 },
    // OpenAI — gpt-4o
    { provider = #OpenAI; model = "gpt-4o";
      inputPerMillion = 0.005; outputPerMillion = 0.015;
      maxTokens = 16384; minTemperature = 0.0; maxTemperature = 2.0 },
    // Anthropic — claude-haiku-4-5
    { provider = #Anthropic; model = "claude-haiku-4-5";
      inputPerMillion = 0.001; outputPerMillion = 0.005;
      maxTokens = 8192; minTemperature = 0.0; maxTemperature = 1.0 },
    // Anthropic — claude-sonnet-4-6
    { provider = #Anthropic; model = "claude-sonnet-4-6";
      inputPerMillion = 0.003; outputPerMillion = 0.015;
      maxTokens = 8192; minTemperature = 0.0; maxTemperature = 1.0 },
  ];

};
