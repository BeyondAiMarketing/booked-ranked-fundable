import Map "mo:core/Map";

module {

  /// Provider that emitted the webhook event. Variants cover the four
  /// providers the unified inbox normalizes today.
  public type WebhookInboxProvider = {
    #instantly;
    #smartlead;
    #twilio;
    #sendgrid;
  };

  /// A single webhook event normalized into a provider-agnostic shape.
  /// All optional fields default to null when the provider payload omits
  /// the corresponding value.
  public type NormalizedWebhookEvent = {
    id                 : Text;            // unique event id (provider id or generated)
    provider           : WebhookInboxProvider;
    normalizedEventType: Text;            // normalized event type string
    externalCampaignId : ?Text;           // optional, from provider payload
    externalLeadId     : ?Text;           // optional
    leadEmail          : ?Text;           // optional
    leadPhone          : ?Text;           // optional
    internalLeadId     : ?Text;           // optional
    replyText          : ?Text;           // optional, for reply events
    replySubject       : ?Text;           // optional
    rawPayload         : Text;            // JSON-encoded original payload for audit/replay
    providerTimestamp  : Int;             // Unix seconds from provider payload, or 0 if absent
    receivedAt         : Int;             // when our system received it (Time.now() nanoseconds)
    routedTo           : Text;            // comma-separated list of subsystems the event was routed to
  };

  /// Stable state holding the unified inbox keyed by event id.
  public type WebhookInboxState = {
    events : Map.Map<Text, NormalizedWebhookEvent>;
  };

  /// Returns an empty WebhookInboxState for initial canister state.
  public func empty() : WebhookInboxState = {
    events = Map.empty();
  };

  /// Query filters for listing inbox events. All option fields default
  /// to null (no filter on that dimension). `limit` defaults to 100.
  public type WebhookInboxFilters = {
    provider          : ?WebhookInboxProvider;
    normalizedEventType: ?Text;
    leadEmailOrPhone  : ?Text;
    fromTimestamp     : ?Int;
    toTimestamp       : ?Int;
    limit             : Nat;
  };

  /// Aggregated stats over the inbox.
  public type WebhookInboxStats = {
    totalEvents      : Nat;
    eventsByProvider : [(Text, Nat)];
    eventsByType     : [(Text, Nat)];
    eventsLast24h    : Nat;
  };

  /// Variant selecting which sample payload the test-event endpoint uses.
  public type WebhookTestPayload = {
    #instantly;
    #smartlead;
    #twilio;
    #sendgrid;
  };

};
