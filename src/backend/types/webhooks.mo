import Debug "mo:core/Debug";

module {

  /// A single webhook event received from an external provider.
  public type WebhookEvent = {
    provider   : Text;               // e.g. "twilio", "vapi", "stripe", "sendgrid"
    eventType  : Text;               // provider-specific event name
    receivedAt : Int;                // Time.now() nanoseconds
    payload    : Text;               // raw JSON body (stored as Text)
    status     : { #ok; #failed };   // processing result
    errorMsg   : ?Text;              // error description if #failed
  };

  /// Aggregated log of webhook events and failure stats.
  public type WebhookLog = {
    events           : [WebhookEvent];
    failedCountLast24h : Nat;
  };

  // ────────────────────────────────────────────────
  // Twilio payload types
  // ────────────────────────────────────────────────

  public type TwilioVoicePayload = {
    callSid    : Text;
    from       : Text;
    to         : Text;
    callStatus : Text;
  };

  public type TwilioSmsPayload = {
    messageSid : Text;
    from       : Text;
    to         : Text;
    body       : Text;
  };

  public type TwilioSmsStatusPayload = {
    messageSid    : Text;
    messageStatus : Text;
  };

  public type TwilioCallStatusPayload = {
    callSid    : Text;
    callStatus : Text;
    duration   : ?Text;
    from       : Text;
    to         : Text;
  };

  public type TwilioRecordingPayload = {
    recordingSid    : Text;
    recordingUrl    : Text;
    callSid         : Text;
    recordingStatus : Text;
  };

  // ────────────────────────────────────────────────
  // Vapi payload types
  // ────────────────────────────────────────────────

  public type VapiMessageType = {
    #assistantRequest;
    #toolCalls;
    #statusUpdate;
    #endOfCallReport;
    #transcript;
    #hang;
  };

  public type VapiEndOfCallReport = {
    callId       : Text;
    duration     : ?Float;
    cost         : ?Float;
    endedReason  : Text;
    transcript   : Text;
    recordingUrl : ?Text;
  };

  // ────────────────────────────────────────────────
  // Stripe payload types
  // ────────────────────────────────────────────────

  public type StripeEventType = {
    #paymentIntentSucceeded;
    #invoicePaid;
    #invoicePaymentFailed;
    #subscriptionCreated;
    #subscriptionUpdated;
    #subscriptionDeleted;
  };

  public type StripeWebhookPayload = {
    eventType  : Text;
    objectId   : Text;
    customerId : ?Text;
    amount     : ?Nat;
    currency   : ?Text;
  };

  // ────────────────────────────────────────────────
  // SendGrid payload types
  // ────────────────────────────────────────────────

  public type SendgridEventType = {
    #delivered;
    #opened;
    #clicked;
    #bounced;
    #spamReport;
    #unsubscribed;
  };

  public type SendgridEvent = {
    email       : Text;
    timestamp   : Int;
    eventType   : Text;
    sgMessageId : Text;
  };

  // ────────────────────────────────────────────────
  // Integration health types
  // ────────────────────────────────────────────────

  /// Result of a single live integration ping test.
  public type IntegrationTestResult = {
    provider  : Text;
    connected : Bool;
    message   : Text;
    latencyMs : ?Nat;
    testedAt  : Int;
  };

  /// Aggregated health summary for all integrations.
  public type IntegrationHealthSummary = {
    critical            : [IntegrationTestResult];   // NVIDIA, OpenRouter — highest priority
    secondary           : [IntegrationTestResult];   // remaining providers
    failedWebhookCounts : [(Text, Nat)];             // (provider, failedCount)
  };

};
