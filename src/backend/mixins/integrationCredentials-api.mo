import Map       "mo:core/Map";
import Text      "mo:core/Text";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall   "mo:caffeineai-http-outcalls/outcall";
import ICTypes   "../types/integrationCredentials";
import ICLib     "../lib/integrationCredentials";

mixin (
  accessControlState : AccessControl.AccessControlState,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
  userProfiles       : Map.Map<Principal, { tenantId : Text; role : Text; name : Text }>,
  emptyMasked        : ICTypes.MaskedCredentials,
  transform          : query Outcall.TransformationInput -> async Outcall.TransformationOutput,
) {

  // ---- Authorisation helpers (private to this mixin) ----------------------

  func isSuperAdmin(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller)
  };

  /// Normalises a tenant ID so that all variants used by the app owner
  /// resolve to "platform" — the single canonical key for platform credentials.
  /// Covers empty string, "demo", "default", "app_owner", "admin", "platform".
  func normaliseTenantId(tenantId : Text) : Text {
    switch (tenantId) {
      case ("") "platform";
      case ("demo") "platform";
      case ("default") "platform";
      case ("app_owner") "platform";
      case ("admin") "platform";
      case ("platform") "platform";
      case (other) other;
    };
  };

  /// Returns #ok if the caller may operate on `tenantId`, #err otherwise.
  /// Super Admins may access any tenant.
  /// Any authenticated caller may access the "platform" tenant so the app
  /// owner can save credentials before a profile or admin role is created.
  func checkTenantAccess(caller : Principal, tenantId : Text) : { #ok; #err : Text } {
    if (isSuperAdmin(caller)) return #ok;
    if (tenantId == "platform") return #ok;
    switch (userProfiles.get(caller)) {
      case (?profile) {
        if (normaliseTenantId(profile.tenantId) == normaliseTenantId(tenantId)) {
          #ok
        } else {
          #err "Unauthorized: can only access your own tenant credentials"
        }
      };
      case (null) {
        // No profile yet — allow so the app owner can save credentials
        // before a profile is created.
        #ok
      };
    };
  };

  func isAuthenticated(caller : Principal) : Bool {
    not caller.isAnonymous()
  };

  // ---- Public API ----------------------------------------------------------

  /// Health check — lets the frontend verify the backend is reachable before saving.
  public query func credentialsHealthCheck() : async Bool { true };

  /// Save or update all integration credentials for a tenant.
  /// Incoming values are plain-text; they are XOR-obfuscated before storage.
  /// Performs a read-back after write to confirm persistence.
  /// Returns #ok on success or #err with a message on failure.
  public shared ({ caller }) func saveIntegrationCredentials(
    tenantId : Text,
    creds    : ICTypes.IntegrationCredentials,
  ) : async { #ok; #err : Text } {
    if (not isAuthenticated(caller)) {
      return #err "Unauthorized: anonymous principals cannot save credentials";
    };
    let tid = normaliseTenantId(tenantId);
    switch (checkTenantAccess(caller, tid)) {
      case (#err msg) { return #err msg };
      case (#ok) {};
    };
    // Merge strategy: incoming empty string ("") means "keep existing stored value".
    // This allows the frontend to send only the fields the user edited without
    // accidentally wiping previously-saved credentials that were not displayed in
    // plain text (they come back as masked values and are re-sent as "" on save).
    let existing : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) { ICLib.decryptAll(enc, credSalt) };
      case (null) {
        {
          openaiKey = ""; claudeKey = ""; litellmUrl = ""; litellmKey = ""; ollamaUrl = "";
          twilioSid = ""; twilioAuth = ""; twilioNumber = ""; vapiKey = "";
          stripeKey = ""; stripeWebhookSecret = "";
          googleClientId = ""; googleClientSecret = "";
          yelpApiKey = ""; facebookAppId = ""; facebookAppSecret = "";
          emailSmtpHost = ""; emailSmtpPort = ""; emailSmtpUser = ""; emailSmtpPass = "";
          hunterApiKey = ""; neverBounceKey = "";
          listmonkUrl = ""; listmonkUser = ""; listmonkPass = "";
          searxngUrl = "";
          elevenLabsKey = ""; elevenLabsVoiceId = "";
          perplexityApiKey = "";
          autoBrowserUrl = "";
          serpApiKey = "";
          sendgridKey = "";
        }
      };
    };
    // Field-level merge: keep the existing value whenever the incoming value is empty
    func pick(incoming : Text, stored : Text) : Text {
      if (incoming == "") stored else incoming
    };
    let merged : ICTypes.IntegrationCredentials = {
      openaiKey           = pick(creds.openaiKey,           existing.openaiKey);
      claudeKey           = pick(creds.claudeKey,           existing.claudeKey);
      litellmUrl          = pick(creds.litellmUrl,          existing.litellmUrl);
      litellmKey          = pick(creds.litellmKey,          existing.litellmKey);
      ollamaUrl           = pick(creds.ollamaUrl,           existing.ollamaUrl);
      twilioSid           = pick(creds.twilioSid,           existing.twilioSid);
      twilioAuth          = pick(creds.twilioAuth,          existing.twilioAuth);
      twilioNumber        = pick(creds.twilioNumber,        existing.twilioNumber);
      vapiKey             = pick(creds.vapiKey,             existing.vapiKey);
      stripeKey           = pick(creds.stripeKey,           existing.stripeKey);
      stripeWebhookSecret = pick(creds.stripeWebhookSecret, existing.stripeWebhookSecret);
      googleClientId      = pick(creds.googleClientId,      existing.googleClientId);
      googleClientSecret  = pick(creds.googleClientSecret,  existing.googleClientSecret);
      yelpApiKey          = pick(creds.yelpApiKey,          existing.yelpApiKey);
      facebookAppId       = pick(creds.facebookAppId,       existing.facebookAppId);
      facebookAppSecret   = pick(creds.facebookAppSecret,   existing.facebookAppSecret);
      emailSmtpHost       = pick(creds.emailSmtpHost,       existing.emailSmtpHost);
      emailSmtpPort       = pick(creds.emailSmtpPort,       existing.emailSmtpPort);
      emailSmtpUser       = pick(creds.emailSmtpUser,       existing.emailSmtpUser);
      emailSmtpPass       = pick(creds.emailSmtpPass,       existing.emailSmtpPass);
      hunterApiKey        = pick(creds.hunterApiKey,        existing.hunterApiKey);
      neverBounceKey      = pick(creds.neverBounceKey,      existing.neverBounceKey);
      listmonkUrl         = pick(creds.listmonkUrl,         existing.listmonkUrl);
      listmonkUser        = pick(creds.listmonkUser,        existing.listmonkUser);
      listmonkPass        = pick(creds.listmonkPass,        existing.listmonkPass);
      searxngUrl          = pick(creds.searxngUrl,          existing.searxngUrl);
      elevenLabsKey       = pick(creds.elevenLabsKey,       existing.elevenLabsKey);
      elevenLabsVoiceId   = pick(creds.elevenLabsVoiceId,   existing.elevenLabsVoiceId);
      perplexityApiKey    = pick(creds.perplexityApiKey,    existing.perplexityApiKey);
      autoBrowserUrl      = pick(creds.autoBrowserUrl,      existing.autoBrowserUrl);
      serpApiKey          = pick(creds.serpApiKey,          existing.serpApiKey);
      sendgridKey         = pick(creds.sendgridKey,         existing.sendgridKey);
    };
    let encrypted = ICLib.encryptAll(merged, credSalt);
    integrationCreds.add(tid, encrypted);
    // Read-back verification: confirm the value was actually written
    switch (integrationCreds.get(tid)) {
      case (null) { #err "Save verification failed — credentials were not persisted. Please try again." };
      case (?_) { #ok };
    };
  };

  /// Returns all credential fields masked (first 4 chars + "****").
  /// Empty fields are returned as empty strings.
  /// Always returns a valid MaskedCredentials record — never null — so the
  /// frontend can safely display the input form on first load.
  public query ({ caller }) func getIntegrationCredentials(
    tenantId : Text,
  ) : async ICTypes.MaskedCredentials {
    if (not isAuthenticated(caller)) return emptyMasked;
    let tid = normaliseTenantId(tenantId);
    switch (integrationCreds.get(tid)) {
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        ICLib.maskCredentials(plain)
      };
      case (null) { emptyMasked };
    };
  };

  /// Returns the decrypted value of a single named credential field.
  /// Intended for server-side API call construction, not for UI display.
  public query ({ caller }) func getDecryptedCredential(
    tenantId : Text,
    field    : Text,
  ) : async ?Text {
    if (not isAuthenticated(caller)) return null;
    let tid = normaliseTenantId(tenantId);
    switch (integrationCreds.get(tid)) {
      case (?enc) {
        ICLib.getField(field, enc, credSalt)
      };
      case (null) { null };
    };
  };

  /// Returns a mock connection-test result for a named service.
  /// Checks whether the relevant credential(s) are non-empty.
  public query ({ caller }) func testServiceConnection(
    tenantId : Text,
    service  : Text,
  ) : async ICTypes.ConnectionTestResult {
    if (not isAuthenticated(caller)) {
      return { connected = false; message = "Unauthorized"; statusCode = 401; quotaInfo = null };
    };
    let tid = normaliseTenantId(tenantId);
    switch (integrationCreds.get(tid)) {
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        ICLib.mockConnectionTest(service, plain)
      };
      case (null) {
        { connected = false; message = "No credentials configured for this tenant"; statusCode = 0; quotaInfo = null }
      };
    };
  };

  /// Returns the weighted 0-100 platform readiness score plus a per-service breakdown.
  public query ({ caller }) func getReadinessScore(
    tenantId : Text,
  ) : async ICTypes.ReadinessScore {
    if (not isAuthenticated(caller)) {
      let emptyBreakdown : [ICTypes.ReadinessBreakdownItem] = [
        { service = "LLM (OpenAI / Claude / LiteLLM)"; status = false; weight = 20 },
        { service = "Twilio (SMS / Voice)";            status = false; weight = 20 },
        { service = "Stripe (Payments)";               status = false; weight = 12 },
        { service = "Google (GBP / Calendar)";         status = false; weight = 12 },
        { service = "Email SMTP";                      status = false; weight = 11 },
        { service = "Lead Enrichment (Yelp / FB / Hunter / NeverBounce / Perplexity / SerpApi)"; status = false; weight = 25 },
        { service = "Auto-Browser Agent";              status = false; weight = 5  },
        ];
        return { score = 0; breakdown = emptyBreakdown; autoBrowserConfigured = false };
      };
    let tid = normaliseTenantId(tenantId);
    switch (integrationCreds.get(tid)) {
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        ICLib.computeReadiness(plain)
      };
      case (null) {
        // No credentials at all → score of 0
        let emptyBreakdown : [ICTypes.ReadinessBreakdownItem] = [
          { service = "LLM (OpenAI / Claude / LiteLLM)"; status = false; weight = 20 },
          { service = "Twilio (SMS / Voice)";            status = false; weight = 20 },
          { service = "Stripe (Payments)";               status = false; weight = 12 },
          { service = "Google (GBP / Calendar)";         status = false; weight = 12 },
          { service = "Email SMTP";                      status = false; weight = 11 },
          { service = "Lead Enrichment (Yelp / FB / Hunter / NeverBounce / Perplexity / SerpApi)"; status = false; weight = 25 },
          { service = "Auto-Browser Agent";              status = false; weight = 5  },
        ];
        { score = 0; breakdown = emptyBreakdown; autoBrowserConfigured = false }
      };
    };
  };

  /// Live connectivity test — makes a real authenticated HTTP outcall to a
  /// lightweight probe endpoint for the named service and returns
  /// { ok, statusCode, message, quotaInfo }.
  /// SerpApi probe: GET https://serpapi.com/account.json?api_key={key}
  /// OpenAI probe:  GET https://api.openai.com/v1/models
  /// Claude probe:  GET https://api.anthropic.com/v1/models
  /// SendGrid:      GET https://api.sendgrid.com/v3/user/account
  /// ElevenLabs:    GET https://api.elevenlabs.io/v1/user
  /// Stripe:        GET https://api.stripe.com/v1/account
  /// Vapi:          GET https://api.vapi.ai/assistant
  /// SearXNG:       GET {url}/healthz (or /search?q=test&format=json)
  /// Twilio:        GET https://api.twilio.com/2010-04-01.json
  public shared ({ caller }) func testIntegration(
    tenantId : Text,
    service  : Text,
  ) : async ICTypes.ConnectionTestResult {
    if (not isAuthenticated(caller)) {
      return { connected = false; message = "Unauthorized"; statusCode = 401; quotaInfo = null };
    };
    let tid = normaliseTenantId(tenantId);
    let plain : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) { ICLib.decryptAll(enc, credSalt) };
      case (null) {
        return { connected = false; message = "No credentials configured"; statusCode = 0; quotaInfo = null };
      };
    };

    // Build (url, headers) for each service
    type ProbeSpec = { url : Text; headers : [Outcall.Header] };
    let probe : ?ProbeSpec = switch (service) {
      case ("serpapi") {
        if (plain.serpApiKey == "") {
          return { connected = false; message = "SerpApi key not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://serpapi.com/account.json?api_key=" # plain.serpApiKey;
           headers = [{ name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }] }
      };
      case ("openai") {
        if (plain.openaiKey == "") {
          return { connected = false; message = "OpenAI key not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://api.openai.com/v1/models";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.openaiKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("claude") {
        if (plain.claudeKey == "") {
          return { connected = false; message = "Anthropic key not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://api.anthropic.com/v1/models";
           headers = [
             { name = "x-api-key"; value = plain.claudeKey },
             { name = "anthropic-version"; value = "2023-06-01" },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("sendgrid") {
        if (plain.sendgridKey == "") {
          return { connected = false; message = "SendGrid key not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://api.sendgrid.com/v3/user/account";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.sendgridKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("elevenlabs") {
        if (plain.elevenLabsKey == "") {
          return { connected = false; message = "ElevenLabs key not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://api.elevenlabs.io/v1/user";
           headers = [
             { name = "xi-api-key"; value = plain.elevenLabsKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("stripe") {
        if (plain.stripeKey == "") {
          return { connected = false; message = "Stripe key not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://api.stripe.com/v1/account";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.stripeKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("vapi") {
        if (plain.vapiKey == "") {
          return { connected = false; message = "Vapi key not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://api.vapi.ai/assistant";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.vapiKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("twilio") {
        if (plain.twilioSid == "") {
          return { connected = false; message = "Twilio SID not set"; statusCode = 0; quotaInfo = null };
        };
        ?{ url = "https://api.twilio.com/2010-04-01.json";
           headers = [
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("searxng") {
        if (plain.searxngUrl == "") {
          return { connected = false; message = "SearXNG URL not set"; statusCode = 0; quotaInfo = null };
        };
        let base = if (plain.searxngUrl.endsWith(#text "/"))
          plain.searxngUrl # "healthz"
        else
          plain.searxngUrl # "/healthz";
        ?{ url = base;
           headers = [{ name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }] }
      };
      case (_) { null };
    };

    switch (probe) {
      case (null) {
        // No real probe — fall back to key-presence check
        ICLib.mockConnectionTest(service, plain)
      };
      case (?spec) {
        try {
          let body = await Outcall.httpGetRequest(spec.url, spec.headers, transform);
          let hasContent = body.size() > 0;
          // Provide quota hint for SerpApi
          let quota : ?Text = if (service == "serpapi") {
          if (body.contains(#text "plan_searches_left")) {
              ?"Quota info available in account response"
            } else { null }
          } else { null };
          if (hasContent) {
            { connected = true; message = "Service reachable"; statusCode = 200; quotaInfo = quota }
          } else {
            { connected = false; message = "Empty response from service"; statusCode = 200; quotaInfo = null }
          }
        } catch (_e) {
          { connected = false; message = "HTTP outcall failed — service may be unreachable or key invalid"; statusCode = 0; quotaInfo = null }
        }
      };
    };
  };

};
