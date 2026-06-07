module {

  /// All credential fields stored as XOR-obfuscated Text values.
  /// An empty string "" means the field has not been configured.
  public type IntegrationCredentials = {
    // LLM providers
    openaiKey          : Text;
    claudeKey          : Text;
    litellmUrl         : Text;
    litellmKey         : Text;
    ollamaUrl          : Text;
    // Communication
    twilioSid          : Text;
    twilioAuth         : Text;
    twilioNumber       : Text;
    vapiKey            : Text;
    // Payments
    stripeKey          : Text;
    stripeWebhookSecret : Text;
    // Google
    googleClientId     : Text;
    googleClientSecret : Text;
    // Social / review platforms
    yelpApiKey         : Text;
    facebookAppId      : Text;
    facebookAppSecret  : Text;
    // Email SMTP
    emailSmtpHost      : Text;
    emailSmtpPort      : Text;
    emailSmtpUser      : Text;
    emailSmtpPass      : Text;
    // Lead enrichment
    hunterApiKey       : Text;
    neverBounceKey     : Text;
    // Open-source services
    listmonkUrl        : Text;
    listmonkUser       : Text;
    listmonkPass       : Text;
    searxngUrl         : Text;
    // Voice synthesis
    elevenLabsKey      : Text;
    elevenLabsVoiceId  : Text;
    // AI search / research
    perplexityApiKey   : Text;
    // Auto-browser agent base URL (e.g. https://auto-browser.bookedrankedfunded.org)
    autoBrowserUrl     : Text;
    // Lead finding
    serpApiKey         : Text; // legacy serpapi.com
    serpApiDevKey      : Text; // serpapi.dev free-tier (2 500 searches/mo)
    tinyFishKey        : Text; // TinyFish agent/search API key
    sendgridKey        : Text;
    nvidiaApiKey       : [Nat8];
    n8nApiKey          : [Nat8];
    n8nInstanceUrl     : Text;
    abacusApiKey       : Text;
    composioApiKey     : Text;
    dograhApiKey       : Text;
    openRouterApiKey   : Text;
    // NVIDIA NIM (Text form; legacy nvidiaApiKey is [Nat8] raw bytes)
    nvidiaNimApiKey    : Text;
    // Google Gemini
    geminiApiKey       : Text;
    // Webhook secrets / inbound parse
    vapiWebhookSecret  : Text;
    sendgridInboundParseDomain : Text;
    composioWebhookSecret : Text;
  };

  public type MaskedCredentials = {
    openaiKey          : Text;
    claudeKey          : Text;
    litellmUrl         : Text;
    litellmKey         : Text;
    ollamaUrl          : Text;
    twilioSid          : Text;
    twilioAuth         : Text;
    twilioNumber       : Text;
    vapiKey            : Text;
    stripeKey          : Text;
    stripeWebhookSecret : Text;
    googleClientId     : Text;
    googleClientSecret : Text;
    yelpApiKey         : Text;
    facebookAppId      : Text;
    facebookAppSecret  : Text;
    emailSmtpHost      : Text;
    emailSmtpPort      : Text;
    emailSmtpUser      : Text;
    emailSmtpPass      : Text;
    hunterApiKey       : Text;
    neverBounceKey     : Text;
    listmonkUrl        : Text;
    listmonkUser       : Text;
    listmonkPass       : Text;
    searxngUrl         : Text;
    elevenLabsKey      : Text;
    elevenLabsVoiceId  : Text;
    perplexityApiKey   : Text;
    autoBrowserUrl     : Text;
    serpApiKey         : Text; // legacy serpapi.com
    serpApiDevKey      : Text; // serpapi.dev free-tier (2 500 searches/mo)
    tinyFishKey        : Text; // TinyFish agent/search API key
    sendgridKey        : Text;
    nvidiaApiKey       : Text;
    n8nInstanceUrl     : Text;
    abacusApiKey       : Text;
    composioApiKey     : Text;
    dograhApiKey       : Text;
    openRouterApiKey   : Text;
    nvidiaNimApiKey    : Text;
    geminiApiKey       : Text;
    vapiWebhookSecret  : Text;
    sendgridInboundParseDomain : Text;
    composioWebhookSecret : Text;
  };

  public type ReadinessBreakdownItem = {
    service : Text;
    status  : Bool;
    weight  : Nat;
  };

  public type ReadinessScore = {
    score                : Nat;
    breakdown            : [ReadinessBreakdownItem];
    autoBrowserConfigured : Bool;
  };

  public type ConnectionTestResult = {
    connected     : Bool;
    message       : Text;
    statusCode    : Nat;
    quotaInfo     : ?Text;
    lastTestedAt  : ?Int;
    lastTestError : ?Text;
  };

  /// A single API health ping snapshot for one service.
  /// status is one of: "healthy" | "yellow" | "red"
  public type ApiPingRecord = {
    serviceId    : Text;
    status       : Text;
    lastPingTime : Int;
    latencyMs    : Nat;
    errorMessage : ?Text;
  };

  /// Ordered history of the last 10 pings for a service.
  public type PingHistory = [ApiPingRecord];

};

