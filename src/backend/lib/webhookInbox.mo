import Text      "mo:core/Text";
import Time      "mo:core/Time";
import Int       "mo:core/Int";
import Char      "mo:core/Char";
import Nat32     "mo:core/Nat32";
import Array     "mo:core/Array";
import WHLib     "../lib/webhooksAndIntegrations";
import WebhookInbox "../types/webhookInbox";

module {

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /// Convert an optional text field to ?Text ("" -> null).
  func optField(v : Text) : ?Text {
    if (v == "") null else ?v;
  };

  /// Parse an ISO-8601 timestamp (e.g. "2026-07-04T12:00:00Z") into Unix
  /// seconds. Returns 0 when the input is empty or cannot be parsed. This is
  /// a naive parser: it splits on 'T', reads the date and time components,
  /// and computes seconds since the Unix epoch using a proleptic Gregorian
  /// calendar. It does NOT handle timezone offsets — the trailing 'Z' is
  /// stripped and the value is treated as UTC.
  func parseIsoToSeconds(iso : Text) : Int {
    if (iso == "") return 0;
    // Strip a trailing 'Z' if present.
    let cleaned = switch (iso.stripEnd(#text "Z")) {
      case (?rest) rest;
      case null iso;
    };
    // Split into date and time on 'T'.
    let parts = cleaned.split(#char 'T');
    let iter = parts;
    let datePart = switch (iter.next()) {
      case (?d) d;
      case null return 0;
    };
    let timePart = switch (iter.next()) {
      case (?t) t;
      case null "00:00:00";
    };
    // Parse date: YYYY-MM-DD
    let dateFields = datePart.split(#char '-');
    let dIter = dateFields;
    let yearText = switch (dIter.next()) { case (?y) y; case null return 0 };
    let monthText = switch (dIter.next()) { case (?m) m; case null return 0 };
    let dayText = switch (dIter.next()) { case (?d) d; case null return 0 };
    let ?year = yearText.toInt() else return 0;
    let ?month = monthText.toInt() else return 0;
    let ?day = dayText.toInt() else return 0;
    // Parse time: HH:MM:SS (seconds optional)
    let timeFields = timePart.split(#char ':');
    let tIter = timeFields;
    let hourText = switch (tIter.next()) { case (?h) h; case null return 0 };
    let minuteText = switch (tIter.next()) { case (?m) m; case null return 0 };
    let secondText = switch (tIter.next()) { case (?s) s; case null "0" };
    // Strip any fractional seconds (e.g. "12.123")
    let secIntPart = switch (secondText.split(#char '.').next()) {
      case (?p) p;
      case null secondText;
    };
    let ?hour = hourText.toInt() else return 0;
    let ?minute = minuteText.toInt() else return 0;
    let ?second = secIntPart.toInt() else return 0;
    // Days since Unix epoch (1970-01-01) using a standard algorithm.
    let y = if (month <= 2) year - 1 else year;
    let era = if (y >= 0) y / 400 else (y - 399) / 400;
    let yoe = y - era * 400;
    let doy = (153 * (if (month > 2) month - 3 else month + 9) + 2) / 5 + day - 1;
    let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    let daysSinceEpoch = era * 146097 + doe - 719468;
    daysSinceEpoch * 86400 + hour * 3600 + minute * 60 + second;
  };

  /// Parse a numeric timestamp string (Unix seconds) into Int. Returns 0 on
  /// failure. Used for SendGrid's integer `timestamp` field.
  func parseNumericSeconds(v : Text) : Int {
    if (v == "") return 0;
    let ?n = v.toInt() else return 0;
    n;
  };

  /// Generate a unique event id from the current time (nanoseconds).
  func genId(prefix : Text) : Text {
    prefix # "-" # Time.now().toText();
  };

  // ---------------------------------------------------------------------------
  // Instantly
  // ---------------------------------------------------------------------------

  /// Normalize a raw Instantly webhook payload into a NormalizedWebhookEvent.
  ///
  /// Instantly webhook request shape:
  ///   - Body: a single JSON object (NOT an array).
  ///   - Required field: `event_type` (lowercase snake_case).
  ///   - Common fields: `lead_email`, `campaign_id`, `campaign_name`,
  ///     `reply_text`, `reply_subject`, `email_subject`, `email_text`,
  ///     `timestamp` (ISO-8601 UTC, e.g. "2026-07-04T12:00:00Z").
  ///   - Headers: Instantly does not sign requests with a verifiable HMAC
  ///     header today; verification is structural-only.
  ///   - Expected response: 200 OK with any body. Non-2xx triggers retries.
  ///   - Debug: inspect raw_payload for the exact JSON, confirm event_type
  ///     maps to a known normalized type, then check routedTo for routing.
  public func normalizeInstantlyEvent(rawPayload : Text) : WebhookInbox.NormalizedWebhookEvent {
    let eventTypeRaw = WHLib.extractJsonField(rawPayload, "event_type");
    let normalizedEventType = mapInstantlyEventType(eventTypeRaw);
    let leadEmail = WHLib.extractJsonField(rawPayload, "lead_email");
    let campaignId = WHLib.extractJsonField(rawPayload, "campaign_id");
    let campaignName = WHLib.extractJsonField(rawPayload, "campaign_name");
    let replyText = WHLib.extractJsonField(rawPayload, "reply_text");
    let replySubject = WHLib.extractJsonField(rawPayload, "reply_subject");
    let emailSubject = WHLib.extractJsonField(rawPayload, "email_subject");
    let emailText = WHLib.extractJsonField(rawPayload, "email_text");
    let timestampRaw = WHLib.extractJsonField(rawPayload, "timestamp");
    let providerTimestamp = parseIsoToSeconds(timestampRaw);
    {
      id                  = genId("instantly");
      provider            = #instantly;
      normalizedEventType;
      externalCampaignId  = optField(campaignId);
      externalLeadId       = optField(campaignName);
      leadEmail            = optField(leadEmail);
      leadPhone            = null;
      internalLeadId       = null;
      replyText            = optField(replyText);
      replySubject         = optField(replySubject);
      rawPayload;
      providerTimestamp;
      receivedAt           = Time.now();
      routedTo             = "";
    };
  };

  /// Map an Instantly `event_type` to the normalized event type string.
  /// Unknown values pass through unchanged so the inbox preserves the raw
  /// provider value for debugging.
  func mapInstantlyEventType(t : Text) : Text {
    switch (t) {
      case "email_sent"            "email_sent";
      case "email_opened"          "email_opened";
      case "reply_received"        "reply_received";
      case "auto_reply_received"   "auto_reply_received";
      case "link_clicked"          "link_clicked";
      case "email_bounced"         "email_bounced";
      case "lead_unsubscribed"      "lead_unsubscribed";
      case "account_error"         "account_error";
      case "campaign_completed"    "campaign_completed";
      case "lead_neutral"          "lead_neutral";
      case "lead_interested"       "lead_interested";
      case "lead_not_interested"   "lead_not_interested";
      case "lead_meeting_booked"   "meeting_booked";
      case "lead_meeting_completed" "meeting_completed";
      case "lead_closed"           "lead_closed";
      case "lead_out_of_office"    "out_of_office";
      case "lead_wrong_person"     "wrong_person";
      case (_) if (t == "") "unknown" else t;
    };
  };

  // ---------------------------------------------------------------------------
  // Smartlead
  // ---------------------------------------------------------------------------

  /// Normalize a raw Smartlead webhook payload into a NormalizedWebhookEvent.
  ///
  /// Smartlead webhook request shape:
  ///   - Body: a single JSON object.
  ///   - Required field: `event_type` (UPPERCASE SNAKE_CASE).
  ///   - Common fields: `to_email` (lead), `from_email`, `campaign_id`,
  ///     `campaign_name`, `reply_body`, `subject`, `time_replied`,
  ///     `time_sent`, `time_opened` (ISO-8601 UTC).
  ///   - Headers: Smartlead does not sign requests with a verifiable HMAC
  ///     header today; verification is structural-only.
  ///   - Expected response: 200 OK. Non-2xx triggers retries.
  ///   - Debug: inspect raw_payload, confirm event_type (uppercase) maps to
  ///     a known normalized type, then check routedTo for routing.
  public func normalizeSmartleadEvent(rawPayload : Text) : WebhookInbox.NormalizedWebhookEvent {
    let eventTypeRaw = WHLib.extractJsonField(rawPayload, "event_type");
    let normalizedEventType = mapSmartleadEventType(eventTypeRaw);
    let toEmail = WHLib.extractJsonField(rawPayload, "to_email");
    let fromEmail = WHLib.extractJsonField(rawPayload, "from_email");
    let campaignId = WHLib.extractJsonField(rawPayload, "campaign_id");
    let campaignName = WHLib.extractJsonField(rawPayload, "campaign_name");
    let replyBody = WHLib.extractJsonField(rawPayload, "reply_body");
    let subject = WHLib.extractJsonField(rawPayload, "subject");
    // Pick the first non-empty timestamp field.
    let tsReplied = WHLib.extractJsonField(rawPayload, "time_replied");
    let tsSent = WHLib.extractJsonField(rawPayload, "time_sent");
    let tsOpened = WHLib.extractJsonField(rawPayload, "time_opened");
    let ts = if (tsReplied != "") tsReplied
      else if (tsSent != "") tsSent
      else tsOpened;
    let providerTimestamp = parseIsoToSeconds(ts);
    {
      id                  = genId("smartlead");
      provider            = #smartlead;
      normalizedEventType;
      externalCampaignId  = optField(campaignId);
      externalLeadId       = optField(fromEmail);
      leadEmail            = optField(toEmail);
      leadPhone            = null;
      internalLeadId       = null;
      replyText            = optField(replyBody);
      replySubject         = optField(subject);
      rawPayload;
      providerTimestamp;
      receivedAt           = Time.now();
      routedTo             = "";
    };
  };

  /// Map a Smartlead `event_type` (UPPERCASE) to the normalized event type.
  func mapSmartleadEventType(t : Text) : Text {
    switch (t) {
      case "EMAIL_SENT"            "email_sent";
      case "FIRST_EMAIL_SENT"      "first_email_sent";
      case "EMAIL_OPEN"            "email_opened";
      case "EMAIL_LINK_CLICK"      "link_clicked";
      case "EMAIL_REPLY"           "reply_received";
      case "EMAIL_BOUNCE"          "email_bounced";
      case "LEAD_UNSUBSCRIBED"     "lead_unsubscribed";
      case "LEAD_CATEGORY_UPDATED" "lead_category_updated";
      case "CAMPAIGN_STATUS_CHANGED" "campaign_status_changed";
      case "UNTRACKED_REPLIES"     "untracked_reply";
      case "MANUAL_STEP_REACHED"   "manual_step_reached";
      case (_) if (t == "") "unknown" else t;
    };
  };

  // ---------------------------------------------------------------------------
  // Twilio
  // ---------------------------------------------------------------------------

  /// Normalize a raw Twilio webhook payload (form-encoded body) into a
  /// NormalizedWebhookEvent.
  ///
  /// Twilio webhook request shape:
  ///   - Body: application/x-www-form-urlencoded (key=value&key=value).
  ///   - Required field: `MessageStatus` (for SMS status callbacks) or
  ///     `CallStatus` (for voice). This normalizer focuses on SMS status.
  ///   - Common fields: `To` (lead phone), `From`, `MessageSid`, `ErrorCode`.
  ///   - Headers: `X-Twilio-Signature` (HMAC-SHA1). Motoko cannot compute
  ///     HMAC-SHA1 natively, so verification is structural-only — the
  ///     existing receiveTwilioWebhook already documents this limitation.
  ///   - Expected response: 200 OK with TwiML XML or empty body.
  ///   - Debug: URL-decode the form body, confirm MessageStatus maps to a
  ///     known normalized type, then check routedTo for routing.
  ///
  /// NOTE: the existing receiveTwilioWebhook in webhooksAndIntegrations-api.mo
  /// already handles Twilio. This normalizer is used when that receiver is
  /// extended to ALSO write a normalized event to the unified inbox.
  public func normalizeTwilioEvent(rawPayload : Text) : WebhookInbox.NormalizedWebhookEvent {
    // Twilio sends form-encoded body. Parse key=value pairs separated by '&'.
    let params = parseFormEncoded(rawPayload);
    let messageStatus = getFormValue(params, "MessageStatus");
    let normalizedEventType = mapTwilioEventType(messageStatus);
    let toPhone = getFormValue(params, "To");
    let fromPhone = getFormValue(params, "From");
    let messageSid = getFormValue(params, "MessageSid");
    let errorCode = getFormValue(params, "ErrorCode");
    {
      id                  = genId("twilio");
      provider            = #twilio;
      normalizedEventType;
      externalCampaignId  = null;
      externalLeadId       = optField(messageSid);
      leadEmail            = null;
      leadPhone            = optField(toPhone);
      internalLeadId       = null;
      replyText            = optField(errorCode);
      replySubject         = optField(fromPhone);
      rawPayload;
      providerTimestamp    = 0;
      receivedAt           = Time.now();
      routedTo             = "";
    };
  };

  /// Map a Twilio `MessageStatus` to the normalized event type.
  func mapTwilioEventType(t : Text) : Text {
    switch (t) {
      case "queued"      "sms_queued";
      case "sent"        "sms_sent";
      case "failed"      "sms_failed";
      case "delivered"   "sms_delivered";
      case "undelivered" "sms_undelivered";
      case "read"        "sms_read";
      case "canceled"    "sms_canceled";
      case (_) if (t == "") "unknown" else t;
    };
  };

  // ---------------------------------------------------------------------------
  // SendGrid
  // ---------------------------------------------------------------------------

  /// Normalize a raw SendGrid webhook payload (JSON ARRAY of events) into a
  /// NormalizedWebhookEvent. Only the FIRST event in the array is normalized;
  /// the existing receiveSendgridEvents handles the full batch.
  ///
  /// SendGrid webhook request shape:
  ///   - Body: a JSON ARRAY of event objects, e.g. [{"event":"delivered",...}].
  ///   - Required field per event: `event` (lowercase).
  ///   - Common fields: `email`, `timestamp` (Unix seconds integer),
  ///     `sg_event_id`, `category`.
  ///   - Headers: SendGrid signs requests with an ECDSA signature in the
  ///     `X-Twilio-Email-Event-Webhook-Signature` / `...-Timestamp` headers.
  ///     Motoko cannot perform ECDSA verification natively, so verification
  ///     is structural-only — the existing receiveSendgridEvents documents
  ///     this limitation.
  ///   - Expected response: 200 OK. Non-2xx triggers retries (up to 24h).
  ///   - Debug: confirm the body starts with '[', extract the first event
  ///     object, confirm `event` maps to a known normalized type, then check
  ///     routedTo for routing.
  ///
  /// NOTE: the existing receiveSendgridEvents already handles SendGrid. This
  /// normalizer is used when that receiver is extended to ALSO write a
  /// normalized event to the unified inbox.
  public func normalizeSendgridEvent(rawPayload : Text) : WebhookInbox.NormalizedWebhookEvent {
    // SendGrid sends a JSON ARRAY of events. Extract the FIRST event object.
    let firstEvent = extractFirstJsonObject(rawPayload);
    let eventRaw = WHLib.extractJsonField(firstEvent, "event");
    let normalizedEventType = mapSendgridEventType(eventRaw);
    let email = WHLib.extractJsonField(firstEvent, "email");
    let timestampRaw = WHLib.extractJsonField(firstEvent, "timestamp");
    let sgEventId = WHLib.extractJsonField(firstEvent, "sg_event_id");
    let category = WHLib.extractJsonField(firstEvent, "category");
    let providerTimestamp = parseNumericSeconds(timestampRaw);
    {
      id                  = genId("sendgrid");
      provider            = #sendgrid;
      normalizedEventType;
      externalCampaignId  = optField(category);
      externalLeadId       = optField(sgEventId);
      leadEmail            = optField(email);
      leadPhone            = null;
      internalLeadId       = null;
      replyText            = null;
      replySubject         = null;
      rawPayload;
      providerTimestamp;
      receivedAt           = Time.now();
      routedTo             = "";
    };
  };

  /// Map a SendGrid `event` to the normalized event type.
  func mapSendgridEventType(t : Text) : Text {
    switch (t) {
      case "processed"        "email_processed";
      case "delivered"        "email_delivered";
      case "bounce"          "email_bounced";
      case "deferred"         "email_deferred";
      case "dropped"          "email_dropped";
      case "open"            "email_opened";
      case "click"           "link_clicked";
      case "spam report"      "spam_report";
      case "unsubscribe"      "unsubscribed";
      case "group_unsubscribe" "group_unsubscribed";
      case "group_resubscribe" "group_resubscribed";
      case (_) if (t == "") "unknown" else t;
    };
  };

  // ---------------------------------------------------------------------------
  // Form-encoded body parser (for Twilio)
  // ---------------------------------------------------------------------------

  /// Parse a form-encoded body ("a=b&c=d") into a list of (key, value) pairs.
  /// Values are URL-decoded for the common cases: '+' -> ' ' and %XX hex.
  func parseFormEncoded(body : Text) : [(Text, Text)] {
    if (body == "") return [];
    var pairs : [(Text, Text)] = [];
    for (pair in body.split(#char '&')) {
      let kv = pair.split(#char '=');
      let kvIter = kv;
      let key = switch (kvIter.next()) { case (?k) k; case null "" };
      let value = switch (kvIter.next()) { case (?v) v; case null "" };
      pairs := pairs.concat([(urlDecode(key), urlDecode(value))]);
    };
    pairs;
  };

  /// Look up a key in a parsed form-encoded pair list.
  func getFormValue(params : [(Text, Text)], key : Text) : Text {
    switch (params.find(func(p) { p.0 == key })) {
      case (?(_, v)) v;
      case null "";
    };
  };

  /// Naive URL decoder: converts '+' to ' ' and %XX hex escapes to bytes.
  /// Handles the common Twilio encoding; does not handle all edge cases.
  /// NOTE: Char.fromNat32 returns a Char directly (not ?Char) — invalid code
  /// points yield a replacement char, so no option unwrap is needed.
  func urlDecode(s : Text) : Text {
    if (s == "") return "";
    var out : Text = "";
    let chars = s.toArray();
    var i = 0;
    let n = chars.size();
    while (i < n) {
      let c = chars[i];
      if (c == '+') {
        out := out # " ";
        i += 1;
      } else if (c == '%' and i + 2 < n) {
        let h1 = hexValue(chars[i + 1]);
        let h2 = hexValue(chars[i + 2]);
        switch (h1, h2) {
          case (?hi, ?lo) {
            let code = hi * 16 + lo;
            // Char.fromNat32 returns Char directly (not ?Char).
            let ch = Char.fromNat32(Nat32.fromNat(code));
            out := out # ch.toText();
            i += 3;
          };
          case (_, _) {
            out := out # "%";
            i += 1;
          };
        };
      } else {
        out := out # c.toText();
        i += 1;
      };
    };
    out;
  };

  /// Convert a hex char to its numeric value (0-15), or null if not hex.
  func hexValue(c : Char) : ?Nat {
    let code = c.toNat32();
    if (code >= 48 and code <= 57) { // '0'..'9'
      ?(Nat32.toNat(code - 48));
    } else if (code >= 65 and code <= 70) { // 'A'..'F'
      ?(Nat32.toNat(code - 55));
    } else if (code >= 97 and code <= 102) { // 'a'..'f'
      ?(Nat32.toNat(code - 87));
    } else {
      null;
    };
  };

  // ---------------------------------------------------------------------------
  // JSON array helper (for SendGrid)
  // ---------------------------------------------------------------------------

  /// Extract the first JSON object from a JSON array body. SendGrid sends a
  /// batch like `[{"event":"delivered",...},{"event":"open",...}]`. This
  /// returns the substring from the first '{' to the matching '}' by scanning
  /// the char array and counting brace depth (increment on '{', decrement on
  /// '}') until depth returns to 0. Handles nested objects correctly. Returns
  /// the whole body if no '{' is found.
  func extractFirstJsonObject(body : Text) : Text {
    let chars = body.toArray();
    let n = chars.size();
    var i = 0;
    // Find the first '{' index.
    var startIdx : Nat = 0;
    var found = false;
    while (i < n and not found) {
      if (chars[i] == '{') {
        startIdx := i;
        found := true;
      };
      i += 1;
    };
    if (not found) return body;
    // Scan forward from startIdx counting brace depth until depth returns to 0.
    var depth = 0;
    var j = startIdx;
    var endIdx : Nat = startIdx;
    var closed = false;
    while (j < n and not closed) {
      let c = chars[j];
      if (c == '{') {
        depth += 1;
      } else if (c == '}') {
        depth -= 1;
        if (depth == 0) {
          endIdx := j;
          closed := true;
        };
      };
      j += 1;
    };
    if (not closed) return body;
    // Rebuild the substring [startIdx, endIdx] inclusive using Array.tabulate.
    Text.fromArray(Array.tabulate(endIdx - startIdx + 1, func(k) { chars[startIdx + k] }));
  };

};
