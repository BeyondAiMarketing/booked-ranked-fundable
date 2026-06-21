import Array        "mo:core/Array";
import Int          "mo:core/Int";
import Time         "mo:core/Time";
import Text         "mo:core/Text";
import WebhookState "../types/webhookState";
import WebhookTypes "../types/webhooks";

module {

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /// Simple text lookup in a flat key=value array of (Text, Text) pairs.
  func getParam(params : [(Text, Text)], key : Text) : Text {
    let found = params.find(func(p) { p.0 == key });
    switch (found) { case (?(_, v)) v; case null "" };
  };

  /// Trim an immutable array to at most `max` elements, keeping the last ones.
  func trimLast<T>(arr : [T], max : Nat) : [T] {
    let n = arr.size();
    if (n <= max) return arr;
    Array.tabulate<T>(max, func(i) { arr[n - max + i] })
  };

  /// Update the failedCounts association list for a provider, incrementing by 1.
  func incrementFailed(counts : [(Text, Nat)], provider : Text) : [(Text, Nat)] {
    var found = false;
    let updated = counts.map(func(pair) {
      if (pair.0 == provider) {
        found := true;
        (pair.0, pair.1 + 1)
      } else { pair }
    });
    if (found) updated
    else updated.concat([(provider, 1)])
  };

  /// Parse a decimal timestamp string and return null when invalid.
  func parseTimestamp(ts : Text) : ?Nat {
    if (ts == "") return null;
    ts.toNat()
  };

  /// Validate a unix timestamp (seconds) against a max age window.
  func isTimestampFresh(timestamp : Nat, maxAgeSeconds : Nat) : Bool {
    let nowNs = Int.abs(Time.now());
    let nowSeconds = nowNs / 1_000_000_000;
    if (timestamp > nowSeconds) return false;
    nowSeconds - timestamp <= maxAgeSeconds
  };

  /// Read a key from a comma-separated signature header such as t=...,v1=...
  func parseHeaderField(header : Text, key : Text) : Text {
    let prefix = key # "=";
    switch (header.split(#text ",").find(func(part) {
      part.trimStart(#text " ").startsWith(#text prefix)
    })) {
      case null "";
      case (?part) {
        let trimmed = part.trimStart(#text " ");
        switch (trimmed.stripStart(#text prefix)) {
          case (?value) value.trimStart(#text " ");
          case null "";
        }
      };
    }
  };

  // ---------------------------------------------------------------------------
  // Signature verification
  // NOTE: Motoko does not expose a native HMAC-SHA1 or HMAC-SHA256 primitive.
  // Full cryptographic verification is not available in-canister. Both functions
  // below accept the request and log a warning. The platform still processes the
  // webhook so no traffic is silently dropped. Replace with a Motoko crypto
  // library when one becomes available in `mo:core`.
  // ---------------------------------------------------------------------------

  /// Verify a Twilio request signature.
  /// WARNING: HMAC-SHA1 is not natively available in Motoko — signature is
  /// accepted unconditionally. Full cryptographic verification should be added
  /// when a Motoko HMAC library is available.
  public func verifyTwilioSignature(
    authToken : Text,
    url       : Text,
    params    : [(Text, Text)],
    signature : Text,
  ) : Bool {
    // Fail closed on missing prerequisites even though HMAC is unavailable.
    if (authToken == "" or signature == "" or url == "") return false;
    if (params.size() == 0) return false;
    // HMAC validation is still pending Motoko crypto support.
    true
  };

  /// Verify a Composio webhook signature.
  /// Checks that signingSecret is non-empty and all required headers are present.
  /// WARNING: HMAC-SHA256 is not natively available in Motoko — full cryptographic
  /// verification is pending mo:core HMAC support. The function returns true when
  /// all inputs are non-empty (structural check only), and false when any required
  /// field is missing or the signing secret has not been configured.
  public func verifyComposioSignature(
    signingSecret : Text,
    rawBody       : Text,
    signature     : Text,
    webhookId     : Text,
    timestamp     : Text,
  ) : Bool {
    // Require the signing secret to be configured
    if (signingSecret == "") return false;
    // Require all header fields to be present
    if (signature == "" or webhookId == "" or timestamp == "") return false;
    if (rawBody == "") return false;
    let ts = parseTimestamp(timestamp);
    switch (ts) {
      case (?parsed) {
        // 5-minute tolerance to reduce replay risk.
        if (not isTimestampFresh(parsed, 300)) return false;
      };
      case null return false;
    };
    // TODO: Replace with HMAC-SHA256(signingSecret, webhookId # "." # timestamp # "." # rawBody)
    // once a Motoko HMAC library becomes available in mo:core.
    true
  };

  /// Verify a Stripe webhook signature from the Stripe-Signature header.
  /// WARNING: HMAC-SHA256 is not natively available in Motoko — signature is
  /// accepted unconditionally. Full cryptographic verification should be added
  /// when a Motoko HMAC library is available.
  public func verifyStripeSignature(
    signingSecret : Text,
    rawBody       : Text,
    sigHeader     : Text,
  ) : Bool {
    if (signingSecret == "" or rawBody == "" or sigHeader == "") return false;
    let timestamp = parseHeaderField(sigHeader, "t");
    let v1 = parseHeaderField(sigHeader, "v1");
    if (timestamp == "" or v1 == "") return false;
    let ts = parseTimestamp(timestamp);
    switch (ts) {
      case (?parsed) {
        // Stripe recommends a 5-minute tolerance for replay protection.
        if (not isTimestampFresh(parsed, 300)) return false;
      };
      case null return false;
    };
    true
  };

  // ---------------------------------------------------------------------------
  // Event logging
  // ---------------------------------------------------------------------------

  /// Append a webhook event to the appropriate provider log and update
  /// failure counters. Returns the updated WebhookState.
  /// Trims each provider log to the last 100 events to prevent unbounded growth.
  public func logWebhookEvent(
    state     : WebhookState.WebhookState,
    provider  : Text,
    eventType : Text,
    payload   : Text,
    status    : { #ok; #failed },
    errorMsg  : ?Text,
  ) : WebhookState.WebhookState {
    let event : { provider : Text; eventType : Text; receivedAt : Int; payload : Text; status : { #ok; #failed }; errorMsg : ?Text } = {
      provider;
      eventType;
      receivedAt = Time.now();
      payload;
      status;
      errorMsg;
    };
    let isFailed : Bool = switch (status) { case (#failed) true; case (#ok) false };
    let newFailedCounts = if (isFailed) incrementFailed(state.failedCounts, provider)
                         else state.failedCounts;
    switch (provider) {
      case ("twilio") {
        let logs = trimLast(state.twilioWebhookLogs.concat([event]), 100);
        { state with twilioWebhookLogs = logs; failedCounts = newFailedCounts }
      };
      case ("vapi") {
        let logs = trimLast(state.vapiWebhookLogs.concat([event]), 100);
        { state with vapiWebhookLogs = logs; failedCounts = newFailedCounts }
      };
      case ("stripe") {
        let logs = trimLast(state.stripeWebhookLogs.concat([event]), 100);
        { state with stripeWebhookLogs = logs; failedCounts = newFailedCounts }
      };
      case ("composio") {
        let logs = trimLast(state.composioWebhookLogs.concat([event]), 100);
        { state with composioWebhookLogs = logs; failedCounts = newFailedCounts }
      };
      case (_) {
        // sendgrid and any other provider go here
        let logs = trimLast(state.sendgridWebhookLogs.concat([event]), 100);
        { state with sendgridWebhookLogs = logs; failedCounts = newFailedCounts }
      };
    };
  };

  /// Return the current failed-event count for a given provider.
  public func getFailedCount(
    state    : WebhookState.WebhookState,
    provider : Text,
  ) : Nat {
    let found = state.failedCounts.find(func(p) { p.0 == provider });
    switch (found) { case (?(_, n)) n; case null 0 };
  };

  // ---------------------------------------------------------------------------
  // Event-type parsers
  // ---------------------------------------------------------------------------

  /// Parse a Vapi message-type string into its variant, or null if unknown.
  public func parseVapiMessageType(typeStr : Text) : ?WebhookTypes.VapiMessageType {
    switch (typeStr) {
      case ("assistant-request")  ?#assistantRequest;
      case ("tool-calls")         ?#toolCalls;
      case ("status-update")      ?#statusUpdate;
      case ("end-of-call-report") ?#endOfCallReport;
      case ("transcript")         ?#transcript;
      case ("hang")               ?#hang;
      case (_)                    null;
    };
  };

  /// Parse a Stripe event-type string into its variant, or null if unknown.
  public func parseStripeEventType(typeStr : Text) : ?WebhookTypes.StripeEventType {
    switch (typeStr) {
      case ("payment_intent.succeeded") ?#paymentIntentSucceeded;
      case ("invoice.paid")             ?#invoicePaid;
      case ("invoice.payment_failed")   ?#invoicePaymentFailed;
      case ("customer.subscription.created") ?#subscriptionCreated;
      case ("customer.subscription.updated") ?#subscriptionUpdated;
      case ("customer.subscription.deleted") ?#subscriptionDeleted;
      case (_) null;
    };
  };

  /// Parse a SendGrid event-type string into its variant, or null if unknown.
  public func parseSendgridEventType(typeStr : Text) : ?WebhookTypes.SendgridEventType {
    switch (typeStr) {
      case ("delivered")    ?#delivered;
      case ("open")         ?#opened;
      case ("click")        ?#clicked;
      case ("bounce")       ?#bounced;
      case ("spamreport")   ?#spamReport;
      case ("unsubscribe")  ?#unsubscribed;
      case (_)              null;
    };
  };

  // ---------------------------------------------------------------------------
  // Utility: extract a value from a JSON-like text (very simple, no full parser)
  // ---------------------------------------------------------------------------

  /// Extract the value for `"key":"value"` or `"key": "value"` from a JSON text.
  /// Returns empty string when not found. Used for minimal JSON field extraction.
  public func extractJsonField(json : Text, key : Text) : Text {
    let needle = "\"" # key # "\"";
    switch (json.split(#text needle).find(func(_) { true })) {
      case null "";
      case (?_) {
        // Find the key, then extract the value after the colon
        let parts = json.split(#text (needle # ":"));
        // Skip first part (before the key)
        let iter = parts;
        let _ = iter.next(); // consume first
        switch (iter.next()) {
          case null "";
          case (?afterColon) {
            // Trim whitespace and extract quoted or unquoted value
            let trimmed = afterColon.trimStart(#text " ");
            if (trimmed.startsWith(#text "\"")) {
              // Quoted string: find closing quote
              switch (trimmed.stripStart(#text "\"")) {
                case null "";
                case (?rest) {
                  switch (rest.split(#text "\"").next()) {
                    case null rest;
                    case (?v) v;
                  };
                };
              };
            } else {
              // Unquoted: take until comma, space, brace, bracket
              let stoppers = [",", "}", "]", " ", "\n"];
              var result = trimmed;
              for (stop in stoppers.vals()) {
                result := switch (result.split(#text stop).next()) {
                  case null result;
                  case (?v) v;
                };
              };
              result
            };
          };
        };
      };
    };
  };

  /// Get a parameter value from a flat (Text, Text) array by key (exported for use in mixin).
  public func getParamValue(params : [(Text, Text)], key : Text) : Text {
    getParam(params, key)
  };

};
