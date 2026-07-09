import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import ICTypes "../types/integrationCredentials";
import ICLib "../lib/integrationCredentials";
import FTTypes "../types/featureToggle";
import LiveSendLib "../lib/liveSend";
import T "../types/liveSend";
import SecretManager "../lib/secretManager";

/// Live Send API
///
/// Exposes two public methods that perform real outbound sends through the
/// already-integrated Twilio and SendGrid providers:
///
///   sendLiveSms(tenantId, to, body)
///   sendLiveEmail(tenantId, to, from, subject, body)
///
/// Both methods:
///   • Are gated by per-tier feature flags (TWILIO_INTEGRATION_ENABLED /
///     SENDGRID_INTEGRATION_ENABLED) and return a structured not-enabled
///     result when the flag is off.
///   • Read stored, XOR-obfuscated credentials from integrationCreds and
///     deobfuscate via ICLib before the HTTP outcall — secrets never leave
///     the backend and are never returned to the frontend.
///   • Use the existing Outcall.httpPostRequest helper with the shared
///     transform query function, mirroring the autopilotSms-api.mo /
///     autopilotEmail-api.mo live-send patterns.
///   • Return a LiveSendResult { ok; messageId; error } with the provider
///     message id on success or a sanitized error message on failure.
mixin (
  accessControlState : AccessControl.AccessControlState,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
  featureToggles    : Map.Map<Text, FTTypes.FeatureToggle>,
  transform          : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  secretState        : ?SecretManager.State,
) {

  /// Send a live SMS via Twilio.
  ///
  /// Reads stored Twilio credentials (twilioSid, twilioAuth, twilioNumber)
  /// from integrationCreds for the given tenant (normalized to "platform"
  /// when empty), deobfuscates via ICLib, and POSTs to the Twilio Messages
  /// API with Basic auth and a form-urlencoded body (To, From=twilioNumber,
  /// Body) following the autopilotSms-api.mo sms_sendViaTwilio pattern.
  ///
  /// Gated by the TWILIO_INTEGRATION_ENABLED feature flag; returns a
  /// not-enabled LiveSendResult when the flag is off.
  ///
  /// Returns { ok; messageId; error } with the Twilio Message SID on
  /// success or a sanitized error message on failure. Never leaks raw
  /// secrets in error text.
  public shared ({ caller }) func sendLiveSms(
    tenantId : Text,
    to       : Text,
    body     : Text,
  ) : async T.LiveSendResult {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    // Feature flag gate — default disabled (additive only)
    let twilioEnabled : Bool = switch (featureToggles.get(FTTypes.TWILIO_INTEGRATION_ENABLED)) {
      case (?ft) { ft.basicEnabled or ft.proEnabled or ft.agencyEnabled };
      case (null) { false };
    };
    if (not twilioEnabled) { return LiveSendLib.notEnabledResult("Twilio") };
    // Normalize tenant to "platform" when empty (matches existing live-send pattern)
    let tenant = if (tenantId == "") "platform" else tenantId;
    // Read + deobfuscate stored credentials (secrets never leave the backend)
    let credsOpt = switch (integrationCreds.get(tenant)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAllWithSecret(enc, credSalt, secretState) };
    };
    let resolved = switch (credsOpt) {
      case (null) { null };
      case (?c)   { LiveSendLib.resolveTwilio(c) };
    };
    let (sid, auth, fromNumber) = switch (resolved) {
      case (null) { return LiveSendLib.missingCredsResult("Twilio") };
      case (?triple) { triple };
    };
    // Build Twilio Messages API request (Basic auth + form-urlencoded body)
    let url     = LiveSendLib.twilioUrl(sid);
    let authHdr = LiveSendLib.twilioBasicAuthHeader(sid, auth);
    let formBody = LiveSendLib.twilioFormBody(fromNumber, to, body);
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = authHdr },
      { name = "Content-Type";  value = "application/x-www-form-urlencoded" },
    ];
    // Perform the HTTP outcall; sanitize any error before returning
    try {
      let resp = await Outcall.httpPostRequest(url, headers, formBody, transform);
      switch (LiveSendLib.parseTwilioMessageSid(resp)) {
        case (?sid) { LiveSendLib.successResult(sid) };
        case (null) { LiveSendLib.providerErrorResult("Twilio", resp) };
      };
    } catch (e) {
      LiveSendLib.httpFailedResult("Twilio")
    };
  };

  /// Send a live transactional email via SendGrid.
  ///
  /// Reads the stored SendGrid API key (sendgridKey) from
  /// integrationCreds for the given tenant (normalized to "platform" when
  /// empty), deobfuscates via ICLib, and POSTs to the SendGrid v3 mail/send
  /// endpoint with Bearer auth and a JSON body
  /// { personalizations: [{ to: [{ email }] }], from: { email }, subject,
  ///   content: [{ type: "text/plain", value: body }] }
  /// following the autopilotEmail-api.mo pattern.
  ///
  /// Gated by the SENDGRID_INTEGRATION_ENABLED feature flag; returns a
  /// not-enabled LiveSendResult when the flag is off.
  ///
  /// Returns { ok; messageId; error } with the SendGrid message id on
  /// success or a sanitized error message on failure. Never leaks raw
  /// secrets in error text.
  public shared ({ caller }) func sendLiveEmail(
    tenantId : Text,
    to       : Text,
    from     : Text,
    subject  : Text,
    body     : Text,
  ) : async T.LiveSendResult {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admins only");
    };
    // Feature flag gate — default disabled (additive only)
    let sendgridEnabled : Bool = switch (featureToggles.get(FTTypes.SENDGRID_INTEGRATION_ENABLED)) {
      case (?ft) { ft.basicEnabled or ft.proEnabled or ft.agencyEnabled };
      case (null) { false };
    };
    if (not sendgridEnabled) { return LiveSendLib.notEnabledResult("SendGrid") };
    // Normalize tenant to "platform" when empty (matches existing live-send pattern)
    let tenant = if (tenantId == "") "platform" else tenantId;
    // Read + deobfuscate stored credentials (secrets never leave the backend)
    let credsOpt = switch (integrationCreds.get(tenant)) {
      case (null) { null };
      case (?enc) { ?ICLib.decryptAllWithSecret(enc, credSalt, secretState) };
    };
    let apiKey = switch (credsOpt) {
      case (null) { null };
      case (?c)   { LiveSendLib.resolveSendgrid(c) };
    };
    let key = switch (apiKey) {
      case (null) { return LiveSendLib.missingCredsResult("SendGrid") };
      case (?k)  { k };
    };
    // Build SendGrid v3 mail/send request (Bearer auth + JSON body)
    let url      = "https://api.sendgrid.com/v3/mail/send";
    let bearer   = LiveSendLib.sendgridBearerHeader(key);
    let jsonBody = LiveSendLib.sendgridJsonBody(to, from, subject, body);
    let headers : [Outcall.Header] = [
      { name = "Authorization"; value = bearer },
      { name = "Content-Type";  value = "application/json" },
    ];
    // Perform the HTTP outcall; sanitize any error before returning
    try {
      let resp = await Outcall.httpPostRequest(url, headers, jsonBody, transform);
      switch (LiveSendLib.parseSendgridMessageId(resp)) {
        case (?id) { LiveSendLib.successResult(id) };
        case (null) {
          // SendGrid 202 success body is typically empty — treat as success
          // with no message id rather than a provider error.
          if (resp == "" or resp == "{}") {
            LiveSendLib.successResult("")
          } else {
            LiveSendLib.providerErrorResult("SendGrid", resp)
          };
        };
      };
    } catch (e) {
      LiveSendLib.httpFailedResult("SendGrid")
    };
  };

};
