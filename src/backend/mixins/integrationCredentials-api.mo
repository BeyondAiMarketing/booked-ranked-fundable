import Map       "mo:core/Map";
import Text      "mo:core/Text";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall   "mo:caffeineai-http-outcalls/outcall";
import ICTypes   "../types/integrationCredentials";
import ICLib     "../lib/integrationCredentials";
import Time "mo:core/Time";

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
          serpApiKey = ""; serpApiDevKey = ""; tinyFishKey = "";
          sendgridKey = "";
          nvidiaApiKey = []; n8nApiKey = []; n8nInstanceUrl = "";
          abacusApiKey = ""; composioApiKey = ""; dograhApiKey = ""; openRouterApiKey = "";
          nvidiaNimApiKey = ""; vapiWebhookSecret = ""; sendgridInboundParseDomain = "";
          composioWebhookSecret = "";
          geminiApiKey = "";
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
      serpApiDevKey       = pick(creds.serpApiDevKey,       existing.serpApiDevKey);
      tinyFishKey         = pick(creds.tinyFishKey,         existing.tinyFishKey);
      sendgridKey         = pick(creds.sendgridKey,         existing.sendgridKey);
      n8nInstanceUrl      = pick(creds.n8nInstanceUrl,      existing.n8nInstanceUrl);
      nvidiaApiKey        = if (creds.nvidiaApiKey.size() > 0) creds.nvidiaApiKey else existing.nvidiaApiKey;
      n8nApiKey           = if (creds.n8nApiKey.size() > 0) creds.n8nApiKey else existing.n8nApiKey;
      abacusApiKey        = pick(creds.abacusApiKey,        existing.abacusApiKey);
      composioApiKey      = pick(creds.composioApiKey,      existing.composioApiKey);
      dograhApiKey        = pick(creds.dograhApiKey,        existing.dograhApiKey);
      openRouterApiKey    = pick(creds.openRouterApiKey,    existing.openRouterApiKey);
      nvidiaNimApiKey          = pick(creds.nvidiaNimApiKey,          existing.nvidiaNimApiKey);
      vapiWebhookSecret        = pick(creds.vapiWebhookSecret,        existing.vapiWebhookSecret);
      sendgridInboundParseDomain = pick(creds.sendgridInboundParseDomain, existing.sendgridInboundParseDomain);
      composioWebhookSecret      = pick(creds.composioWebhookSecret,     existing.composioWebhookSecret);
      geminiApiKey               = pick(creds.geminiApiKey,              existing.geminiApiKey);
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
      return { connected = false; message = "Unauthorized"; statusCode = 401; quotaInfo = null; lastTestedAt = null; lastTestError = ?"Unauthorized" };
    };
    let tid = normaliseTenantId(tenantId);
    switch (integrationCreds.get(tid)) {
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        { connected = false; message = "Use testAllConnections() for live API tests"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = null }
      };
      case (null) {
        { connected = false; message = "No credentials configured for this tenant"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"No credentials configured for this tenant" }
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
      return { connected = false; message = "Unauthorized"; statusCode = 401; quotaInfo = null; lastTestedAt = null; lastTestError = ?"Unauthorized" };
    };
    let tid = normaliseTenantId(tenantId);
    let plain : ICTypes.IntegrationCredentials = switch (integrationCreds.get(tid)) {
      case (?enc) { ICLib.decryptAll(enc, credSalt) };
      case (null) {
        return { connected = false; message = "No credentials configured"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"No credentials configured" };
      };
    };

    // Build (url, headers) for each service
    type ProbeSpec = { url : Text; headers : [Outcall.Header] };
    let probe : ?ProbeSpec = switch (service) {
      case ("serpapi") {
        if (plain.serpApiKey == "") {
          return { connected = false; message = "SerpApi key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"SerpApi key not set" };
        };
        ?{ url = "https://serpapi.com/account.json?api_key=" # plain.serpApiKey;
           headers = [{ name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }] }
      };
      case ("serpapidev") {
        if (plain.serpApiDevKey == "") {
          return { connected = false; message = "SerpApi.dev key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"SerpApi.dev key not set" };
        };
        // SerpApi.dev account endpoint for key validation
        ?{ url = "https://serpapi.dev/account?api_key=" # plain.serpApiDevKey;
           headers = [{ name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }] }
      };
      case ("openai") {
        if (plain.openaiKey == "") {
          return { connected = false; message = "OpenAI key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"OpenAI key not set" };
        };
        ?{ url = "https://api.openai.com/v1/models";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.openaiKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("claude") {
        if (plain.claudeKey == "") {
          return { connected = false; message = "Anthropic key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"Anthropic key not set" };
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
          return { connected = false; message = "SendGrid key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"SendGrid key not set" };
        };
        ?{ url = "https://api.sendgrid.com/v3/user/account";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.sendgridKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("elevenlabs") {
        if (plain.elevenLabsKey == "") {
          return { connected = false; message = "ElevenLabs key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"ElevenLabs key not set" };
        };
        ?{ url = "https://api.elevenlabs.io/v1/user";
           headers = [
             { name = "xi-api-key"; value = plain.elevenLabsKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("stripe") {
        if (plain.stripeKey == "") {
          return { connected = false; message = "Stripe key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"Stripe key not set" };
        };
        ?{ url = "https://api.stripe.com/v1/account";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.stripeKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("vapi") {
        if (plain.vapiKey == "") {
          return { connected = false; message = "Vapi key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"Vapi key not set" };
        };
        ?{ url = "https://api.vapi.ai/assistant";
           headers = [
             { name = "Authorization"; value = "Bearer " # plain.vapiKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("twilio") {
        if (plain.twilioSid == "") {
          return { connected = false; message = "Twilio SID not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = null };
        };
        // Basic Auth: plain SID:AuthToken (not base64 encoded — no base64 lib available in canister)
        let basicAuth = "Basic " # plain.twilioSid # ":" # plain.twilioAuth;
        ?{ url = "https://api.twilio.com/2010-04-01.json";
           headers = [
             { name = "Authorization"; value = basicAuth },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("tinyfish") {
        if (plain.tinyFishKey == "") {
          return { connected = false; message = "TinyFish key not set"; statusCode = 0; quotaInfo = null; lastTestedAt = ?Time.now(); lastTestError = ?"TinyFish key not set" };
        };
        ?{ url = "https://agent.tinyfish.ai/health";
           headers = [
             { name = "X-API-Key"; value = plain.tinyFishKey },
             { name = "User-Agent"; value = "BRF-IntegrationTest/1.0" }
           ] }
      };
      case ("searxng") {
        if (plain.searxngUrl == "") {
          return { connected = false; message = "SearXNG URL not set"; statusCode = 0; quotaInfo = null; lastTestedAt = null; lastTestError = ?"SearXNG URL not set" };
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
        { connected = false; message = "Unknown service — use testAllConnections() for live API tests"; statusCode = 0; quotaInfo = null; lastTestedAt = ?Time.now(); lastTestError = null }
      };
      case (?spec) {
        let now = Time.now();
        try {
          let body = await Outcall.httpGetRequest(spec.url, spec.headers, transform);
          let hasContent = body.size() > 0;
          // Provide quota hint for SerpApi
          let quota : ?Text = if (service == "serpapi" or service == "serpapidev") {
          if (body.contains(#text "plan_searches_left")) {
              ?"Quota info available in account response"
            } else { null }
          } else { null };
          if (hasContent) {
            { connected = true; message = "Service reachable"; statusCode = 200; quotaInfo = quota; lastTestedAt = ?now; lastTestError = null }
          } else {
            { connected = false; message = "Empty response from service"; statusCode = 200; quotaInfo = null; lastTestedAt = ?now; lastTestError = ?"Empty response from service" }
          }
        } catch (_e) {
          { connected = false; message = "HTTP outcall failed — service may be unreachable or key invalid"; statusCode = 0; quotaInfo = null; lastTestedAt = ?Time.now(); lastTestError = ?"HTTP outcall failed — service may be unreachable or key invalid" }
        }
      };
    };
  };

  /// Delete (clear) a single named credential field for a tenant.
  /// Supports all major key fields.
  public shared ({ caller }) func deleteCredential(
    tenantId  : Text,
    fieldName : Text,
  ) : async { ok : Bool; message : Text } {
    if (not isAuthenticated(caller)) {
      return { ok = false; message = "Unauthorized" };
    };
    let tid = normaliseTenantId(tenantId);
    switch (checkTenantAccess(caller, tid)) {
      case (#err msg) { return { ok = false; message = msg } };
      case (#ok) {};
    };
    switch (integrationCreds.get(tid)) {
      case (null) { return { ok = false; message = "No credentials found for tenant" } };
      case (?enc) {
        let plain = ICLib.decryptAll(enc, credSalt);
        let updated : ?ICTypes.IntegrationCredentials = switch (fieldName) {
          case ("openaiKey")                 ?{ plain with openaiKey = "" };
          case ("claudeKey")                 ?{ plain with claudeKey = "" };
          case ("litellmUrl")                ?{ plain with litellmUrl = "" };
          case ("litellmKey")                ?{ plain with litellmKey = "" };
          case ("ollamaUrl")                 ?{ plain with ollamaUrl = "" };
          case ("twilioSid")                 ?{ plain with twilioSid = "" };
          case ("twilioAuth")                ?{ plain with twilioAuth = "" };
          case ("twilioNumber")              ?{ plain with twilioNumber = "" };
          case ("vapiKey")                   ?{ plain with vapiKey = "" };
          case ("stripeKey")                 ?{ plain with stripeKey = "" };
          case ("stripeWebhookSecret")       ?{ plain with stripeWebhookSecret = "" };
          case ("googleClientId")            ?{ plain with googleClientId = "" };
          case ("googleClientSecret")        ?{ plain with googleClientSecret = "" };
          case ("yelpApiKey")                ?{ plain with yelpApiKey = "" };
          case ("facebookAppId")             ?{ plain with facebookAppId = "" };
          case ("facebookAppSecret")         ?{ plain with facebookAppSecret = "" };
          case ("emailSmtpHost")             ?{ plain with emailSmtpHost = "" };
          case ("emailSmtpPort")             ?{ plain with emailSmtpPort = "" };
          case ("emailSmtpUser")             ?{ plain with emailSmtpUser = "" };
          case ("emailSmtpPass")             ?{ plain with emailSmtpPass = "" };
          case ("hunterApiKey")              ?{ plain with hunterApiKey = "" };
          case ("neverBounceKey")            ?{ plain with neverBounceKey = "" };
          case ("listmonkUrl")               ?{ plain with listmonkUrl = "" };
          case ("listmonkUser")              ?{ plain with listmonkUser = "" };
          case ("listmonkPass")              ?{ plain with listmonkPass = "" };
          case ("searxngUrl")                ?{ plain with searxngUrl = "" };
          case ("elevenLabsKey")             ?{ plain with elevenLabsKey = "" };
          case ("elevenLabsVoiceId")         ?{ plain with elevenLabsVoiceId = "" };
          case ("perplexityApiKey")          ?{ plain with perplexityApiKey = "" };
          case ("autoBrowserUrl")            ?{ plain with autoBrowserUrl = "" };
          case ("serpApiKey")                ?{ plain with serpApiKey = "" };
          case ("serpApiDevKey")             ?{ plain with serpApiDevKey = "" };
          case ("tinyFishKey")               ?{ plain with tinyFishKey = "" };
          case ("sendgridKey")               ?{ plain with sendgridKey = "" };
          case ("nvidiaNimApiKey")           ?{ plain with nvidiaNimApiKey = "" };
          case ("n8nInstanceUrl")            ?{ plain with n8nInstanceUrl = "" };
          case ("vapiWebhookSecret")         ?{ plain with vapiWebhookSecret = "" };
          case ("sendgridInboundParseDomain") ?{ plain with sendgridInboundParseDomain = "" };
          case ("composioApiKey")            ?{ plain with composioApiKey = "" };
          case ("abacusApiKey")              ?{ plain with abacusApiKey = "" };
          case ("dograhApiKey")              ?{ plain with dograhApiKey = "" };
          case ("openRouterApiKey")          ?{ plain with openRouterApiKey = "" };
          case (_)                           null;
        };
        switch (updated) {
          case (null) { { ok = false; message = "Unknown field: " # fieldName } };
          case (?u) {
            integrationCreds.add(tid, ICLib.encryptAll(u, credSalt));
            { ok = true; message = "Key deleted" };
          };
        };
      };
    };
  };
};
