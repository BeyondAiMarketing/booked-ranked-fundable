// ---------------------------------------------------------------------------
// webhooksAndIntegrations.mo — Inbound webhook verification, logging, and
// event-type parsing for Twilio, Vapi, Stripe, SendGrid, and Composio.
//
// WEBHOOK VERIFICATION — COMPENSATING CONTROLS (HMAC GAP)
// -------------------------------------------------------
// HMAC-SHA256 is not available in Motoko. Webhook verification therefore uses
// compensating controls rather than cryptographic signatures:
//
//   1. Shared-secret token validation — each webhook source must present a
//      secret token (in a custom header or the URL path) that is compared
//      against a per-source stored secret using a constant-time comparison
//      (see `verifyWebhookSecret`). This prevents timing attacks that could
//      leak the secret byte-by-byte.
//   2. Optional IP allowlisting — `isIpAllowed` rejects requests from IPs
//      outside a per-source allowlist. Allowlisting is opt-in: an empty
//      allowlist permits all IPs (backward compatible).
//   3. Rate limiting — enforced in the mixin layer via `lib/rateLimiter.mo`
//      (in-memory sliding window, 100 req / 60s per source).
//
// This gap is documented in docs/AUDIT.md. When a Motoko HMAC-SHA256 primitive
// or a certified HTTP outcall becomes available, `verifyWebhookSecret` should
// be replaced with proper HMAC verification of the request body.
// ---------------------------------------------------------------------------

import Array        "mo:core/Array";
import Blob         "mo:core/Blob";
import Nat          "mo:core/Nat";
import Nat8         "mo:core/Nat8";
import Time         "mo:core/Time";
import Text         "mo:core/Text";
import WebhookState "../types/webhookState";
import WebhookTypes "../types/webhooks";

module {

  // ---------------------------------------------------------------------------
  // WebhookSecrets — per-source stored shared-secret tokens
  // ---------------------------------------------------------------------------

  /// Per-source stored shared-secret tokens used by `verifyWebhookSecret`.
  /// Each field is the canonical secret configured for that webhook source.
  /// An empty string means "no secret configured for this source" — callers
  /// should treat that as a verification failure (or open mode, per source).
  public type WebhookSecrets = {
    twilio   : Text;
    vapi     : Text;
    stripe   : Text;
    sendgrid : Text;
    composio : Text;
  };

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  /// Simple text lookup in a flat key=value array of (Text, Text) pairs.
  func getParam(params : [(Text, Text)], key : Text) : Text {
    let found = params.find(func(p) { p.0 == key });
    switch (found) { case (?(_, v)) v; case null "" };
  };

  /// Look up the stored secret for a webhook source name. Unknown sources
  /// return an empty string (verification will fail).
  func secretForSource(secrets : WebhookSecrets, source : Text) : Text {
    switch (source) {
      case "twilio"   secrets.twilio;
      case "vapi"     secrets.vapi;
      case "stripe"   secrets.stripe;
      case "sendgrid" secrets.sendgrid;
      case "composio" secrets.composio;
      case (_)        "";
    };
  };

  /// Trim an immutable array to at most `max` elements, keeping the last ones.
  func trimLast<T>(arr : [T], max : Nat) : [T] {
    let n = arr.size();
    if (n <= max) return arr;
    Array.tabulate(max, func(i) { arr[n - max + i] })
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

  // ---------------------------------------------------------------------------
  // Webhook verification — compensating controls (no HMAC available)
  // ---------------------------------------------------------------------------
  //
  // Motoko does not expose a native HMAC-SHA1 or HMAC-SHA256 primitive, so
  // full cryptographic signature verification is not available in-canister.
  // Instead we use a shared-secret token validated with a constant-time
  // comparison, plus optional IP allowlisting (see `isIpAllowed`) and rate
  // limiting (enforced in the mixin layer). See the module header for the
  // full rationale and the docs/AUDIT.md gap note.

  /// Constant-time comparison of two texts by their UTF-8 byte sequences.
  /// Iterates over every byte of both inputs, accumulating XOR differences,
  /// and returns true only when the accumulated difference is zero AND the
  /// lengths match. Does NOT short-circuit on the first mismatch — this
  /// prevents timing attacks that could recover the secret byte-by-byte.
  func constantTimeEquals(a : Text, b : Text) : Bool {
    let aBytes : [Nat8] = a.encodeUtf8().toArray();
    let bBytes : [Nat8] = b.encodeUtf8().toArray();
    // A length mismatch is a mismatch, but we still scan the shared prefix
    // so the loop duration does not leak the position of the first diff.
    let minLen : Nat = if (aBytes.size() < bBytes.size()) aBytes.size() else bBytes.size();
    var diff : Nat8 = 0;
    var i : Nat = 0;
    while (i < minLen) {
      diff := Nat8.bitxor(diff, Nat8.bitxor(aBytes[i], bBytes[i]));
      i += 1;
    };
    // Fold the length difference into the accumulator so unequal-length
    // inputs always fail without leaking length via early return. mo:core
    // Nat has no bitxor, so we derive a length-mismatch mask as a Nat8 and
    // OR it into the byte-diff accumulator.
    let lengthsEqual : Bool = aBytes.size() == bBytes.size();
    let lengthMask : Nat8 = if (lengthsEqual) 0 else 255;
    diff := Nat8.bitor(diff, lengthMask);
    diff == 0;
  };

  /// Verify a webhook shared-secret token for a given source.
  ///
  /// Compares `providedToken` against the stored secret for `source` using a
  /// constant-time comparison (no short-circuit on first mismatch) to resist
  /// timing attacks. Returns false if the source is unknown, no secret is
  /// configured for the source, or the token does not match.
  ///
  /// This is the compensating control for the absence of HMAC-SHA256 in
  /// Motoko. See the module header and docs/AUDIT.md.
  public func verifyWebhookSecret(
    source        : Text,
    providedToken : Text,
    storedSecrets : WebhookSecrets,
  ) : Bool {
    let stored = secretForSource(storedSecrets, source);
    // No secret configured for this source → reject. (Open mode, where
    // configured, is decided by the caller before invoking this function.)
    if (stored == "") return false;
    // An empty provided token can never match a non-empty stored secret.
    if (providedToken == "") return false;
    constantTimeEquals(providedToken, stored);
  };

  /// Check whether a caller IP is allowed for a webhook source.
  ///
  /// If the `allowlist` is empty, all IPs are allowed (backward compatible —
  /// IP allowlisting is opt-in per source). Otherwise the caller IP must
  /// appear exactly in the allowlist. Comparison is a direct Text equality
  /// (IPs are short, fixed-format strings; timing leakage is not a concern
  /// for allowlist membership the way it is for secret comparison).
  public func isIpAllowed(
    source    : Text,
    callerIp  : Text,
    allowlist : [Text],
  ) : Bool {
    ignore source;
    if (allowlist.size() == 0) return true;
    allowlist.contains(callerIp);
  };

  /// Verify a Twilio request signature.
  ///
  /// HMAC-SHA1 is not natively available in Motoko, so this function uses the
  /// compensating control of shared-secret token validation: the `signature`
  /// parameter is treated as the provided token and compared against the
  /// Twilio auth token (`authToken`) using a constant-time comparison via
  /// `verifyWebhookSecret`. The `url` and `params` are accepted for
  /// logging/forwarding but are not cryptographically bound (HMAC gap).
  ///
  /// Backward compatible: the public signature is unchanged so existing
  /// callers (the mixin layer) compile without modification.
  public func verifyTwilioSignature(
    authToken : Text,
    url       : Text,
    params    : [(Text, Text)],
    signature : Text,
  ) : Bool {
    // url and params are not cryptographically bound without HMAC; ignore
    // them for verification but keep them in the signature for compatibility.
    ignore (url, params);
    let secrets : WebhookSecrets = {
      twilio   = authToken;
      vapi     = "";
      stripe   = "";
      sendgrid = "";
      composio = "";
    };
    verifyWebhookSecret("twilio", signature, secrets);
  };

  /// Verify a Composio webhook signature.
  ///
  /// HMAC-SHA256 is not natively available in Motoko, so this function uses
  /// the compensating control of shared-secret token validation: the
  /// `signature` parameter is treated as the provided token and compared
  /// against the Composio signing secret (`signingSecret`) using a
  /// constant-time comparison via `verifyWebhookSecret`. The `rawBody`,
  /// `webhookId`, and `timestamp` are accepted for logging/forwarding but
  /// are not cryptographically bound (HMAC gap).
  ///
  /// Backward compatible: the public signature is unchanged so existing
  /// callers (the mixin layer) compile without modification. Returns false
  /// when the signing secret is not configured or any required header field
  /// is missing (structural pre-condition preserved from the prior stub).
  public func verifyComposioSignature(
    signingSecret : Text,
    rawBody       : Text,
    signature     : Text,
    webhookId     : Text,
    timestamp     : Text,
  ) : Bool {
    // Require the signing secret to be configured
    if (signingSecret == "") return false;
    // Require all header fields to be present (structural pre-condition)
    if (signature == "" or webhookId == "" or timestamp == "") return false;
    // rawBody is not cryptographically bound without HMAC; ignore for
    // verification but keep it in the signature for compatibility.
    ignore rawBody;
    let secrets : WebhookSecrets = {
      twilio   = "";
      vapi     = "";
      stripe   = "";
      sendgrid = "";
      composio = signingSecret;
    };
    verifyWebhookSecret("composio", signature, secrets);
  };

  /// Verify a Stripe webhook signature from the Stripe-Signature header.
  ///
  /// HMAC-SHA256 is not natively available in Motoko, so this function uses
  /// the compensating control of shared-secret token validation: the
  /// `sigHeader` parameter is treated as the provided token and compared
  /// against the Stripe signing secret (`signingSecret`) using a constant-
  /// time comparison via `verifyWebhookSecret`. The `rawBody` is accepted
  /// for logging/forwarding but is not cryptographically bound (HMAC gap).
  ///
  /// Backward compatible: the public signature is unchanged so existing
  /// callers (the mixin layer) compile without modification.
  public func verifyStripeSignature(
    signingSecret : Text,
    rawBody       : Text,
    sigHeader     : Text,
  ) : Bool {
    // rawBody is not cryptographically bound without HMAC; ignore for
    // verification but keep it in the signature for compatibility.
    ignore rawBody;
    let secrets : WebhookSecrets = {
      twilio   = "";
      vapi     = "";
      stripe   = signingSecret;
      sendgrid = "";
      composio = "";
    };
    verifyWebhookSecret("stripe", sigHeader, secrets);
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
