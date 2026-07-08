import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import ICTypes "../types/integrationCredentials";
import ICLib "../lib/integrationCredentials";
import T "../types/liveSend";

module {

  // ── Constants ───────────────────────────────────────────────────────────────

  let TWILIO_BASE : Text = "https://api.twilio.com/2010-04-01/Accounts/";
  let SENDGRID_URL : Text = "https://api.sendgrid.com/v3/mail/send";

  let B64_CHARS : Text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // ── URL / body builders ──────────────────────────────────────────────────────

  /// Build the Twilio Messages API URL for a given Account SID.
  public func twilioUrl(accountSid : Text) : Text {
    TWILIO_BASE # accountSid # "/Messages.json"
  };

  /// Build the form-urlencoded body for a Twilio Messages API request.
  /// Encodes From, To, and Body fields following the autopilotSms-api.mo
  /// sms_sendViaTwilio pattern (URL-encoding reserved characters).
  public func twilioFormBody(from : Text, to : Text, body : Text) : Text {
    "From=" # urlEncode(from)
      # "&To=" # urlEncode(to)
      # "&Body=" # urlEncode(body)
  };

  /// Build the Basic auth header value for a Twilio request:
  /// "Basic " # base64Encode(sid # ":" # auth).
  public func twilioBasicAuthHeader(sid : Text, auth : Text) : Text {
    "Basic " # base64Encode(sid # ":" # auth)
  };

  /// Build the JSON body for a SendGrid v3 mail/send request following the
  /// autopilotEmail-api.mo pattern:
  /// { personalizations: [{ to: [{ email }] }], from: { email }, subject,
  ///   content: [{ type: "text/plain", value: body }] }
  public func sendgridJsonBody(to : Text, from : Text, subject : Text, body : Text) : Text {
    "{\"personalizations\":[{\"to\":[{\"email\":" # jsonStr(to)
      # "}]}],\"from\":{\"email\":" # jsonStr(from)
      # "},\"subject\":" # jsonStr(subject)
      # ",\"content\":[{\"type\":\"text/plain\",\"value\":" # jsonStr(body)
      # "}]}"
  };

  /// Build the Bearer auth header value for a SendGrid request:
  /// "Bearer " # apiKey.
  public func sendgridBearerHeader(apiKey : Text) : Text {
    "Bearer " # apiKey
  };

  // ── Response parsers ────────────────────────────────────────────────────────

  /// Extract the Twilio Message SID from a Twilio Messages API JSON response.
  /// Returns null when the field is absent (failure / API error).
  public func parseTwilioMessageSid(responseJson : Text) : ?Text {
    naiveField(responseJson, "sid")
  };

  /// Extract the SendGrid message id from a SendGrid v3 mail/send response.
  /// SendGrid returns it in the `X-Message-Id` response header; the Outcall
  /// response body may be empty on success. Returns null when absent.
  public func parseSendgridMessageId(responseJson : Text) : ?Text {
    // SendGrid's 202 response body is typically empty; the message id lives
    // in the X-Message-Id header which the Outcall helper does not surface.
    // Try a couple of common body-embedded fields as a fallback.
    switch (naiveField(responseJson, "message_id")) {
      case (?v) ?v;
      case null {
        switch (naiveField(responseJson, "id")) {
          case (?v) ?v;
          case null {
            // Empty body on success — no message id available
            if (responseJson == "" or responseJson == "{}") null
            else naiveField(responseJson, "X-Message-Id")
          }
        }
      }
    }
  };

  // ── Error sanitization ──────────────────────────────────────────────────────

  /// Sanitize an error message so it never leaks raw secret material.
  /// Returns a generic, safe error string when the input appears to contain
  /// a credential; otherwise returns the input trimmed.
  public func sanitizeError(message : Text) : Text {
    let trimmed = message.trim(#char ' ');
    // Heuristic: if the message contains a long base64-ish or hex-ish token
    // (32+ chars) it may be a leaked key/SID — replace with a generic notice.
    if (looksLikeSecret(trimmed)) {
      "Provider request failed (sanitized)"
    } else if (trimmed == "") {
      "Provider request failed"
    } else {
      trimmed
    }
  };

  // ── Credential resolvers ────────────────────────────────────────────────────

  /// Resolve the Twilio credentials (sid, auth, fromNumber) from a decrypted
  /// IntegrationCredentials record. The mixin layer is responsible for
  /// deobfuscating the stored record via ICLib.decryptAll before calling this
  /// helper — secrets never leave the backend. Returns null when any of the
  /// three Twilio fields are empty.
  public func resolveTwilio(
    creds : ICTypes.IntegrationCredentials,
  ) : ?(Text, Text, Text) {
    if (creds.twilioSid == "" or creds.twilioAuth == "" or creds.twilioNumber == "") null
    else ?(creds.twilioSid, creds.twilioAuth, creds.twilioNumber)
  };

  /// Resolve the SendGrid API key from a decrypted IntegrationCredentials
  /// record. The mixin layer deobfuscates the stored record via
  /// ICLib.decryptAll before calling this helper. Returns null when the
  /// sendgridKey field is empty.
  public func resolveSendgrid(
    creds : ICTypes.IntegrationCredentials,
  ) : ?Text {
    if (creds.sendgridKey == "") null else ?creds.sendgridKey
  };

  // ── LiveSendResult constructors ────────────────────────────────────────────

  /// Construct a LiveSendResult for the "feature flag disabled" case.
  public func notEnabledResult(service : Text) : T.LiveSendResult {
    {
      ok        = false;
      messageId = null;
      error     = ?(service # " integration is disabled");
    }
  };

  /// Construct a LiveSendResult for the "missing credentials" case.
  public func missingCredsResult(service : Text) : T.LiveSendResult {
    {
      ok        = false;
      messageId = null;
      error     = ?(service # " credentials are not configured");
    }
  };

  /// Construct a LiveSendResult for the "HTTP outcall failed" case.
  public func httpFailedResult(service : Text) : T.LiveSendResult {
    {
      ok        = false;
      messageId = null;
      error     = ?(service # " HTTP request failed");
    }
  };

  /// Construct a LiveSendResult for the "provider API returned an error" case.
  public func providerErrorResult(service : Text, error : Text) : T.LiveSendResult {
    {
      ok        = false;
      messageId = null;
      error     = ?(service # " error: " # sanitizeError(error));
    }
  };

  /// Construct a LiveSendResult for the success case.
  public func successResult(messageId : Text) : T.LiveSendResult {
    {
      ok        = true;
      messageId = ?messageId;
      error     = null;
    }
  };

  // ── Private helpers ─────────────────────────────────────────────────────────

  /// Placeholder salt — never used because the mixin passes already-decrypted
  /// credentials. ICLib.deobfuscate is a no-op on plaintext that isn't in the
  /// HEX: fallback form, so this is safe.
  let credSaltPlaceholder : Blob = "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00";

  /// URL-encode a form field value following the autopilotSms-api.mo
  /// sms_escape pattern: encode &, +, =, and replace spaces with +.
  func urlEncode(s : Text) : Text {
    s.replace(#char '&', "%26")
     .replace(#char '+', "%2B")
     .replace(#char '=', "%3D")
     .replace(#char ' ', "+")
  };

  /// Escape a Text value for inclusion in a JSON string literal.
  func jsonStr(s : Text) : Text {
    let esc = s.replace(#char '\\', "\\\\")
               .replace(#text "\"", "\\" # "\"")
               .replace(#char '\n', "\\n")
               .replace(#char '\r', "\\r");
    "\"" # esc # "\""
  };

  /// Minimal Base64 encoder for ASCII strings (used for Twilio Basic auth).
  func base64Encode(input : Text) : Text {
    let bytes = input.encodeUtf8().toArray();
    let n = bytes.size();
    var out : Text = "";
    var i : Nat = 0;
    let charArr = B64_CHARS.toArray();
    while (i < n) {
      let b0 : Nat = bytes[i].toNat();
      let b1 : Nat = if (i + 1 < n) bytes[i + 1].toNat() else 0;
      let b2 : Nat = if (i + 2 < n) bytes[i + 2].toNat() else 0;
      let idx0 = b0 / 4;
      let idx1 = (b0 % 4) * 16 + b1 / 16;
      let idx2 = (b1 % 16) * 4 + b2 / 64;
      let idx3 = b2 % 64;
      out #= Text.fromChar(charArr[idx0]);
      out #= Text.fromChar(charArr[idx1]);
      out #= if (i + 1 < n) Text.fromChar(charArr[idx2]) else "=";
      out #= if (i + 2 < n) Text.fromChar(charArr[idx3]) else "=";
      i += 3;
    };
    out
  };

  /// Naive JSON string-field extractor (mirrors autopilotSms-api.mo
  /// sms_naiveField). Returns the first string value found for `field`.
  func naiveField(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\"";
    let segs = json.split(#text needle);
    var afterKey = false;
    var result : ?Text = null;
    for (seg in segs) {
      if (afterKey and result == null) {
        let rest = seg.trimStart(#text " ")
                      .trimStart(#text ":")
                      .trimStart(#text " ");
        if (rest.startsWith(#text "\"")) {
          let inner = switch (rest.stripStart(#text "\"")) {
            case (?s) s;
            case (null) rest;
          };
          switch (inner.split(#text "\"").next()) {
            case (?v) { result := ?v };
            case (null) {};
          };
        };
      };
      afterKey := true;
    };
    result
  };

  /// Heuristic: does this text look like it might contain a leaked secret?
  /// True when it contains a 32+ char run of base64/hex characters.
  func looksLikeSecret(s : Text) : Bool {
    let chars = s.toArray();
    let len = chars.size();
    if (len < 32) return false;
    var run : Nat = 0;
    var maxRun : Nat = 0;
    for (c in chars.values()) {
      if (isBase64Char(c)) {
        run += 1;
        if (run > maxRun) { maxRun := run };
      } else {
        run := 0;
      };
    };
    maxRun >= 32
  };

  func isBase64Char(c : Char) : Bool {
    let n = charToNat(c);
    (n >= 48 and n <= 57)   // 0-9
      or (n >= 65 and n <= 90)  // A-Z
      or (n >= 97 and n <= 122) // a-z
      or n == 43 // +
      or n == 47 // /
      or n == 61 // =
  };

  func charToNat(c : Char) : Nat {
    switch (c) {
      case '0' 0; case '1' 1; case '2' 2; case '3' 3; case '4' 4;
      case '5' 5; case '6' 6; case '7' 7; case '8' 8; case '9' 9;
      case 'A' 65; case 'B' 66; case 'C' 67; case 'D' 68; case 'E' 69;
      case 'F' 70; case 'G' 71; case 'H' 72; case 'I' 73; case 'J' 74;
      case 'K' 75; case 'L' 76; case 'M' 77; case 'N' 78; case 'O' 79;
      case 'P' 80; case 'Q' 81; case 'R' 82; case 'S' 83; case 'T' 84;
      case 'U' 85; case 'V' 86; case 'W' 87; case 'X' 88; case 'Y' 89;
      case 'Z' 90;
      case 'a' 97; case 'b' 98; case 'c' 99; case 'd' 100; case 'e' 101;
      case 'f' 102; case 'g' 103; case 'h' 104; case 'i' 105; case 'j' 106;
      case 'k' 107; case 'l' 108; case 'm' 109; case 'n' 110; case 'o' 111;
      case 'p' 112; case 'q' 113; case 'r' 114; case 's' 115; case 't' 116;
      case 'u' 117; case 'v' 118; case 'w' 119; case 'x' 120; case 'y' 121;
      case 'z' 122;
      case '+' 43; case '/' 47; case '=' 61;
      case (_) 0;
    }
  };

};
