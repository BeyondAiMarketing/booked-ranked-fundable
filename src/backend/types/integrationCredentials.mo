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
    serpApiKey         : Text;
    sendgridKey        : Text;
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
    serpApiKey         : Text;
    sendgridKey        : Text;
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
    connected  : Bool;
    message    : Text;
    statusCode : Nat;
    quotaInfo  : ?Text;
  };

};
