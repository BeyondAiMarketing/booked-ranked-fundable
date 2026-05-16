import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Nat8 "mo:core/Nat8";
import T "../types/integrationCredentials";

module {

  // ---------------------------------------------------------------------------
  // XOR obfuscation helpers
  //
  // Prevents plaintext secrets from appearing in stable memory dumps.
  // The salt is injected from the canister so it is unique per deployment and
  // stored only in canister memory, never hard-coded here.
  // ---------------------------------------------------------------------------

  /// Encode `text` by XOR-ing each UTF-8 byte against the cycling salt bytes.
  public func obfuscate(text : Text, salt : Blob) : Text {
    if (text == "") return "";
    let input   : Blob = text.encodeUtf8();
    let saltArr : [Nat8] = salt.toArray();
    let inArr   : [Nat8] = input.toArray();
    let saltLen = saltArr.size();
    if (saltLen == 0) return text;
    let outArr = Array.tabulate(inArr.size(), func(i) {
      let s : Nat8 = saltArr[i % saltLen];
      inArr[i] ^ s
    });
    switch (Blob.fromArray(outArr).decodeUtf8()) {
      case (?t) { t };
      // If XOR'd bytes don't form valid UTF-8, hex-encode instead
      case (null) {
        let hex = outArr.foldLeft("", func(acc : Text, b : Nat8) : Text {
          acc # nibble(Nat.fromNat8(b) / 16) # nibble(Nat.fromNat8(b) % 16)
        });
        "HEX:" # hex
      };
    };
  };

  /// Inverse of `obfuscate` – XOR is its own inverse, so the operation is identical.
  public func deobfuscate(stored : Text, salt : Blob) : Text {
    if (stored == "") return "";
    // Handle the hex-encoded fallback path
    if (stored.startsWith(#text "HEX:")) {
      let hex = switch (stored.stripStart(#text "HEX:")) {
        case (?h) h;
        case (null) { return stored };
      };
      let chars = hex.toArray();
      let len = chars.size();
      if (len % 2 != 0) return stored;
      let byteCount = len / 2;
      let saltArr : [Nat8] = salt.toArray();
      let saltLen = saltArr.size();
      let outArr = Array.tabulate(byteCount, func(i) {
        let hi = fromHexChar(chars[i * 2]);
        let lo = fromHexChar(chars[i * 2 + 1]);
        let b : Nat8 = Nat8.fromNat(hi * 16 + lo);
        if (saltLen == 0) b else b ^ saltArr[i % saltLen]
      });
      switch (Blob.fromArray(outArr).decodeUtf8()) {
        case (?t) { t };
        case (null) { stored };
      };
    } else {
      // Regular path — XOR is self-inverse
      obfuscate(stored, salt);
    };
  };

  // ---------------------------------------------------------------------------
  // Masking helper – returns first 4 chars + "****" for non-empty values,
  // empty string for unconfigured fields.
  // ---------------------------------------------------------------------------

  public func maskField(raw : Text) : Text {
    if (raw == "") return "";
    let chars = raw.toArray();
    let prefixLen = Nat.min(4, chars.size());
    var prefix = "";
    var i = 0;
    while (i < prefixLen) {
      prefix := prefix # Text.fromChar(chars[i]);
      i += 1;
    };
    prefix # "****"
  };

  // ---------------------------------------------------------------------------
  // Apply mask to all fields
  // ---------------------------------------------------------------------------

  public func maskCredentials(c : T.IntegrationCredentials) : T.MaskedCredentials {
    {
      openaiKey           = maskField(c.openaiKey);
      claudeKey           = maskField(c.claudeKey);
      litellmUrl          = maskField(c.litellmUrl);
      litellmKey          = maskField(c.litellmKey);
      ollamaUrl           = maskField(c.ollamaUrl);
      twilioSid           = maskField(c.twilioSid);
      twilioAuth          = maskField(c.twilioAuth);
      twilioNumber        = maskField(c.twilioNumber);
      vapiKey             = maskField(c.vapiKey);
      stripeKey           = maskField(c.stripeKey);
      stripeWebhookSecret = maskField(c.stripeWebhookSecret);
      googleClientId      = maskField(c.googleClientId);
      googleClientSecret  = maskField(c.googleClientSecret);
      yelpApiKey          = maskField(c.yelpApiKey);
      facebookAppId       = maskField(c.facebookAppId);
      facebookAppSecret   = maskField(c.facebookAppSecret);
      emailSmtpHost       = maskField(c.emailSmtpHost);
      emailSmtpPort       = maskField(c.emailSmtpPort);
      emailSmtpUser       = maskField(c.emailSmtpUser);
      emailSmtpPass       = maskField(c.emailSmtpPass);
      hunterApiKey        = maskField(c.hunterApiKey);
      neverBounceKey      = maskField(c.neverBounceKey);
      listmonkUrl         = maskField(c.listmonkUrl);
      listmonkUser        = maskField(c.listmonkUser);
      listmonkPass        = maskField(c.listmonkPass);
      searxngUrl          = maskField(c.searxngUrl);
      elevenLabsKey       = maskField(c.elevenLabsKey);
      elevenLabsVoiceId   = maskField(c.elevenLabsVoiceId);
      perplexityApiKey    = maskField(c.perplexityApiKey);
      autoBrowserUrl      = maskField(c.autoBrowserUrl);
      serpApiKey          = maskField(c.serpApiKey);
      sendgridKey         = maskField(c.sendgridKey);
    }
  };

  // ---------------------------------------------------------------------------
  // Readiness score
  // ---------------------------------------------------------------------------

  public func computeReadiness(c : T.IntegrationCredentials) : T.ReadinessScore {
    // Tier 1 (40 pts): LLM configured AND Twilio configured
    let llmOk = c.openaiKey != "" or c.claudeKey != "" or c.litellmUrl != "";
    let twilioOk = c.twilioSid != "" and c.twilioAuth != "";
    let tier1 : Nat = if (llmOk and twilioOk) 40 else 0;

    // Tier 2 (35 pts): Stripe + Google + email SMTP all present
    let stripeOk = c.stripeKey != "";
    let googleOk = c.googleClientId != "";
    let smtpOk = c.emailSmtpHost != "";
    let tier2 : Nat = if (stripeOk and googleOk and smtpOk) 35 else 0;

    // Tier 3 (25 pts): at least one of Yelp / Facebook / Hunter / NeverBounce / Perplexity / SerpApi
    let enrichOk = c.yelpApiKey != "" or c.facebookAppId != "" or c.hunterApiKey != "" or c.neverBounceKey != "" or c.perplexityApiKey != "" or c.serpApiKey != "";
    let tier3 : Nat = if (enrichOk) 25 else 0;

    // Bonus (+5 pts): auto-browser configured
    let autoBrowserOk = c.autoBrowserUrl != "";
    let bonus : Nat = if (autoBrowserOk) 5 else 0;

    let score = tier1 + tier2 + tier3 + bonus;

    let breakdown : [T.ReadinessBreakdownItem] = [
      { service = "LLM (OpenAI / Claude / LiteLLM)"; status = llmOk;    weight = 20 },
      { service = "Twilio (SMS / Voice)";            status = twilioOk;  weight = 20 },
      { service = "Stripe (Payments)";               status = stripeOk;  weight = 12 },
      { service = "Google (GBP / Calendar)";         status = googleOk;  weight = 12 },
      { service = "Email SMTP";                      status = smtpOk;    weight = 11 },
      { service = "Lead Enrichment (Yelp / FB / Hunter / NeverBounce / Perplexity / SerpApi)"; status = enrichOk; weight = 25 },
      { service = "Auto-Browser Agent";              status = autoBrowserOk; weight = 5 },
    ];

    { score; breakdown; autoBrowserConfigured = autoBrowserOk }
  };

  // ---------------------------------------------------------------------------
  // Mock connection test
  // ---------------------------------------------------------------------------

  public func mockConnectionTest(service : Text, c : T.IntegrationCredentials) : T.ConnectionTestResult {
    let (connected, message) = switch (service) {
      case ("openai")     { if (c.openaiKey != "")    (true,  "OpenAI key is configured")        else (false, "OpenAI key not set")         };
      case ("claude")     { if (c.claudeKey != "")    (true,  "Anthropic key is configured")     else (false, "Anthropic key not set")      };
      case ("litellm")    { if (c.litellmUrl != "")   (true,  "LiteLLM endpoint is configured")  else (false, "LiteLLM URL not set")        };
      case ("ollama")     { if (c.ollamaUrl != "")    (true,  "Ollama endpoint is configured")   else (false, "Ollama URL not set")         };
      case ("twilio")     { if (c.twilioSid != "")    (true,  "Twilio credentials are set")      else (false, "Twilio SID not set")         };
      case ("vapi")       { if (c.vapiKey != "")      (true,  "Vapi.ai key is configured")       else (false, "Vapi key not set")           };
      case ("stripe")     { if (c.stripeKey != "")    (true,  "Stripe key is configured")        else (false, "Stripe key not set")         };
      case ("google")     { if (c.googleClientId != "") (true,"Google credentials are set")      else (false, "Google Client ID not set")   };
      case ("yelp")       { if (c.yelpApiKey != "")   (true,  "Yelp API key is configured")      else (false, "Yelp key not set")           };
      case ("facebook")   { if (c.facebookAppId != "") (true, "Facebook credentials are set")    else (false, "Facebook App ID not set")    };
      case ("smtp")       { if (c.emailSmtpHost != "") (true, "SMTP host is configured")         else (false, "SMTP host not set")          };
      case ("hunter")     { if (c.hunterApiKey != "") (true,  "Hunter.io key is configured")     else (false, "Hunter key not set")         };
      case ("neverbounce"){ if (c.neverBounceKey != "") (true,"NeverBounce key is configured")   else (false, "NeverBounce key not set")    };
      case ("listmonk")   { if (c.listmonkUrl != "")  (true,  "Listmonk URL is configured")      else (false, "Listmonk URL not set")        };
      case ("searxng")    { if (c.searxngUrl != "")   (true,  "SearXNG URL is configured")       else (false, "SearXNG URL not set")         };
      case ("elevenlabs") { if (c.elevenLabsKey != "") (true, "ElevenLabs key is configured")    else (false, "ElevenLabs key not set")       };
      case ("perplexity") { if (c.perplexityApiKey != "") (true, "Perplexity key is configured") else (false, "Perplexity key not set")       };
      case ("auto_browser") { if (c.autoBrowserUrl != "") (true, "Auto-Browser URL is configured") else (false, "Auto-Browser URL not set") };
      case ("serpapi")    { if (c.serpApiKey != "")   (true,  "SerpApi key is configured")       else (false, "SerpApi key not set")         };
      case ("sendgrid")   { if (c.sendgridKey != "")  (true,  "SendGrid key is configured")      else (false, "SendGrid key not set")        };
      case (_)            { (false, "Unknown service: " # service) };
    };
    { connected; message; statusCode = 0; quotaInfo = null }
  };

  // ---------------------------------------------------------------------------
  // Get a single decrypted field by name
  // ---------------------------------------------------------------------------

  public func getField(field : Text, c : T.IntegrationCredentials, salt : Blob) : ?Text {
    let raw : Text = switch (field) {
      case ("openaiKey")           c.openaiKey;
      case ("claudeKey")           c.claudeKey;
      case ("litellmUrl")          c.litellmUrl;
      case ("litellmKey")          c.litellmKey;
      case ("ollamaUrl")           c.ollamaUrl;
      case ("twilioSid")           c.twilioSid;
      case ("twilioAuth")          c.twilioAuth;
      case ("twilioNumber")        c.twilioNumber;
      case ("vapiKey")             c.vapiKey;
      case ("stripeKey")           c.stripeKey;
      case ("stripeWebhookSecret") c.stripeWebhookSecret;
      case ("googleClientId")      c.googleClientId;
      case ("googleClientSecret")  c.googleClientSecret;
      case ("yelpApiKey")          c.yelpApiKey;
      case ("facebookAppId")       c.facebookAppId;
      case ("facebookAppSecret")   c.facebookAppSecret;
      case ("emailSmtpHost")       c.emailSmtpHost;
      case ("emailSmtpPort")       c.emailSmtpPort;
      case ("emailSmtpUser")       c.emailSmtpUser;
      case ("emailSmtpPass")       c.emailSmtpPass;
      case ("hunterApiKey")        c.hunterApiKey;
      case ("neverBounceKey")      c.neverBounceKey;
      case ("listmonkUrl")         c.listmonkUrl;
      case ("listmonkUser")        c.listmonkUser;
      case ("listmonkPass")        c.listmonkPass;
      case ("searxngUrl")          c.searxngUrl;
      case ("elevenLabsKey")       c.elevenLabsKey;
      case ("elevenLabsVoiceId")   c.elevenLabsVoiceId;
      case ("perplexityApiKey")    c.perplexityApiKey;
      case ("autoBrowserUrl")      c.autoBrowserUrl;
      case ("serpApiKey")          c.serpApiKey;
      case ("sendgridKey")         c.sendgridKey;
      case (_)                     { return null };
    };
    ?(deobfuscate(raw, salt))
  };

  // ---------------------------------------------------------------------------
  // Encrypt all fields of an incoming plain-text credential record
  // ---------------------------------------------------------------------------

  public func encryptAll(c : T.IntegrationCredentials, salt : Blob) : T.IntegrationCredentials {
    {
      openaiKey           = obfuscate(c.openaiKey,           salt);
      claudeKey           = obfuscate(c.claudeKey,           salt);
      litellmUrl          = obfuscate(c.litellmUrl,          salt);
      litellmKey          = obfuscate(c.litellmKey,          salt);
      ollamaUrl           = obfuscate(c.ollamaUrl,           salt);
      twilioSid           = obfuscate(c.twilioSid,           salt);
      twilioAuth          = obfuscate(c.twilioAuth,          salt);
      twilioNumber        = obfuscate(c.twilioNumber,        salt);
      vapiKey             = obfuscate(c.vapiKey,             salt);
      stripeKey           = obfuscate(c.stripeKey,           salt);
      stripeWebhookSecret = obfuscate(c.stripeWebhookSecret, salt);
      googleClientId      = obfuscate(c.googleClientId,      salt);
      googleClientSecret  = obfuscate(c.googleClientSecret,  salt);
      yelpApiKey          = obfuscate(c.yelpApiKey,          salt);
      facebookAppId       = obfuscate(c.facebookAppId,       salt);
      facebookAppSecret   = obfuscate(c.facebookAppSecret,   salt);
      emailSmtpHost       = obfuscate(c.emailSmtpHost,       salt);
      emailSmtpPort       = obfuscate(c.emailSmtpPort,       salt);
      emailSmtpUser       = obfuscate(c.emailSmtpUser,       salt);
      emailSmtpPass       = obfuscate(c.emailSmtpPass,       salt);
      hunterApiKey        = obfuscate(c.hunterApiKey,        salt);
      neverBounceKey      = obfuscate(c.neverBounceKey,      salt);
      listmonkUrl         = obfuscate(c.listmonkUrl,         salt);
      listmonkUser        = obfuscate(c.listmonkUser,        salt);
      listmonkPass        = obfuscate(c.listmonkPass,        salt);
      searxngUrl          = obfuscate(c.searxngUrl,          salt);
      elevenLabsKey       = obfuscate(c.elevenLabsKey,       salt);
      elevenLabsVoiceId   = obfuscate(c.elevenLabsVoiceId,   salt);
      perplexityApiKey    = obfuscate(c.perplexityApiKey,    salt);
      autoBrowserUrl      = obfuscate(c.autoBrowserUrl,      salt);
      serpApiKey          = obfuscate(c.serpApiKey,          salt);
      sendgridKey         = obfuscate(c.sendgridKey,         salt);
    }
  };

  // ---------------------------------------------------------------------------
  // Decrypt all fields (used internally when computing readiness or test results)
  // ---------------------------------------------------------------------------

  public func decryptAll(c : T.IntegrationCredentials, salt : Blob) : T.IntegrationCredentials {
    {
      openaiKey           = deobfuscate(c.openaiKey,           salt);
      claudeKey           = deobfuscate(c.claudeKey,           salt);
      litellmUrl          = deobfuscate(c.litellmUrl,          salt);
      litellmKey          = deobfuscate(c.litellmKey,          salt);
      ollamaUrl           = deobfuscate(c.ollamaUrl,           salt);
      twilioSid           = deobfuscate(c.twilioSid,           salt);
      twilioAuth          = deobfuscate(c.twilioAuth,          salt);
      twilioNumber        = deobfuscate(c.twilioNumber,        salt);
      vapiKey             = deobfuscate(c.vapiKey,             salt);
      stripeKey           = deobfuscate(c.stripeKey,           salt);
      stripeWebhookSecret = deobfuscate(c.stripeWebhookSecret, salt);
      googleClientId      = deobfuscate(c.googleClientId,      salt);
      googleClientSecret  = deobfuscate(c.googleClientSecret,  salt);
      yelpApiKey          = deobfuscate(c.yelpApiKey,          salt);
      facebookAppId       = deobfuscate(c.facebookAppId,       salt);
      facebookAppSecret   = deobfuscate(c.facebookAppSecret,   salt);
      emailSmtpHost       = deobfuscate(c.emailSmtpHost,       salt);
      emailSmtpPort       = deobfuscate(c.emailSmtpPort,       salt);
      emailSmtpUser       = deobfuscate(c.emailSmtpUser,       salt);
      emailSmtpPass       = deobfuscate(c.emailSmtpPass,       salt);
      hunterApiKey        = deobfuscate(c.hunterApiKey,        salt);
      neverBounceKey      = deobfuscate(c.neverBounceKey,      salt);
      listmonkUrl         = deobfuscate(c.listmonkUrl,         salt);
      listmonkUser        = deobfuscate(c.listmonkUser,        salt);
      listmonkPass        = deobfuscate(c.listmonkPass,        salt);
      searxngUrl          = deobfuscate(c.searxngUrl,          salt);
      elevenLabsKey       = deobfuscate(c.elevenLabsKey,       salt);
      elevenLabsVoiceId   = deobfuscate(c.elevenLabsVoiceId,   salt);
      perplexityApiKey    = deobfuscate(c.perplexityApiKey,    salt);
      autoBrowserUrl      = deobfuscate(c.autoBrowserUrl,      salt);
      serpApiKey          = deobfuscate(c.serpApiKey,          salt);
      sendgridKey         = deobfuscate(c.sendgridKey,         salt);
    }
  };

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  func nibble(n : Nat) : Text {
    let chars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    if (n < 16) chars[n] else "?"
  };

  func fromHexChar(c : Char) : Nat {
    switch (c) {
      case '0' 0; case '1' 1; case '2' 2; case '3' 3;
      case '4' 4; case '5' 5; case '6' 6; case '7' 7;
      case '8' 8; case '9' 9;
      case 'a' 10; case 'b' 11; case 'c' 12; case 'd' 13; case 'e' 14; case 'f' 15;
      case 'A' 10; case 'B' 11; case 'C' 12; case 'D' 13; case 'E' 14; case 'F' 15;
      case (_) 0;
    }
  };

};
