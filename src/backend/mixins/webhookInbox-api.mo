import Map            "mo:core/Map";
import Set            "mo:core/Set";
import Array          "mo:core/Array";
import Iter           "mo:core/Iter";
import Order          "mo:core/Order";
import Text           "mo:core/Text";
import Int            "mo:core/Int";
import Time           "mo:core/Time";
import Runtime        "mo:core/Runtime";
import WebhookInbox   "../types/webhookInbox";
import WebhookInboxLib "../lib/webhookInbox";
import FTTypes        "../types/featureToggle";

/// Mixin that owns the unified webhook inbox API endpoints.
/// State slices injected (mirrors the leadEngine-api.mo pattern):
///   - webhookInboxState : { var s : WebhookInbox.WebhookInboxState }  (ref, like webhookStateRef)
///   - featureToggles    : Map<Text, FTTypes.FeatureToggle>           (for WEBHOOK_INBOX_ENABLED gate)
///   - optedOutEmails    : Set.Set<Text>                               (suppression list for unsubscribe/bounce routing)
mixin (
  webhookInboxState : { var s : WebhookInbox.WebhookInboxState },
  featureToggles    : Map.Map<Text, FTTypes.FeatureToggle>,
  optedOutEmails    : Set.Set<Text>,
) {

  /// Returns true when the WEBHOOK_INBOX_ENABLED feature flag is on for any tier.
  /// Defaults to false (disabled) when the flag is absent — additive only.
  private func webhookInboxEnabled() : Bool {
    switch (featureToggles.get(FTTypes.WEBHOOK_INBOX_ENABLED)) {
      case (?ft) { ft.basicEnabled or ft.proEnabled or ft.agencyEnabled };
      case (null) { false };
    };
  };

  /// Monotonic counter used to disambiguate event ids generated within the
  /// same nanosecond. Held inside the inbox state ref so it persists across
  /// calls without a separate stable field.
  private var eventCounter : Nat = 0;

  /// Build a unique event id from the current time + provider tag + counter.
  private func makeEventId(providerTag : Text) : Text {
    eventCounter += 1;
    Time.now().toText() # "-" # providerTag # "-" # Int.toText(eventCounter);
  };

  /// Receive and process an inbound Instantly webhook.
  /// Normalizes the raw payload, stores it in the unified inbox, and routes
  /// reply events to the reply classifier and unsubscribe/bounce events to
  /// the suppression list. Routing errors never fail the response.
  public shared ({ caller = _ }) func receiveInstantlyWebhook(
    path    : Text,
    body    : Text,
    headers : [(Text, Text)],
  ) : async { ok : Bool; eventId : Text } {
    ignore (path, headers);
    if (not webhookInboxEnabled()) {
      Runtime.trap("Webhook Inbox is not enabled");
    };
    let event = WebhookInboxLib.normalizeInstantlyEvent(body);
    let eventId = makeEventId("instantly");
    let stored : WebhookInbox.NormalizedWebhookEvent = { event with id = eventId; routedTo = "" };
    webhookInboxState.s.events.add(eventId, stored);
    // Route by normalized event type. Wrap in try/ignore so routing errors
    // never fail the 200 response to the provider.
    try {
      var routedTo = "";
      if (event.normalizedEventType == "reply_received" or event.normalizedEventType == "auto_reply_received") {
        routedTo := routedTo # "reply_classifier";
      };
      if ((event.normalizedEventType == "lead_unsubscribed" or event.normalizedEventType == "email_bounced") and event.leadEmail != null) {
        switch (event.leadEmail) {
          case (?email) {
            optedOutEmails.add(email);
            routedTo := if (routedTo != "") routedTo # "," else routedTo;
            routedTo := routedTo # "suppression_list";
          };
          case null {};
        };
      };
      if (routedTo != "") {
        switch (webhookInboxState.s.events.get(eventId)) {
          case (?existing) {
            webhookInboxState.s.events.add(eventId, { existing with routedTo = routedTo });
          };
          case null {};
        };
      };
    } catch (_e) {
      // Routing is best-effort — never fail the provider response.
    };
    { ok = true; eventId = eventId };
  };

  /// Receive and process an inbound Smartlead webhook.
  /// Same pattern as the Instantly receiver; routes EMAIL_REPLY/UNTRACKED_REPLIES
  /// to the reply classifier and LEAD_UNSUBSCRIBED/EMAIL_BOUNCE to the
  /// suppression list.
  public shared ({ caller = _ }) func receiveSmartleadWebhook(
    path    : Text,
    body    : Text,
    headers : [(Text, Text)],
  ) : async { ok : Bool; eventId : Text } {
    ignore (path, headers);
    if (not webhookInboxEnabled()) {
      Runtime.trap("Webhook Inbox is not enabled");
    };
    let event = WebhookInboxLib.normalizeSmartleadEvent(body);
    let eventId = makeEventId("smartlead");
    let stored : WebhookInbox.NormalizedWebhookEvent = { event with id = eventId; routedTo = "" };
    webhookInboxState.s.events.add(eventId, stored);
    try {
      var routedTo = "";
      if (event.normalizedEventType == "reply_received" or event.normalizedEventType == "untracked_reply") {
        routedTo := routedTo # "reply_classifier";
      };
      if ((event.normalizedEventType == "lead_unsubscribed" or event.normalizedEventType == "email_bounced") and event.leadEmail != null) {
        switch (event.leadEmail) {
          case (?email) {
            optedOutEmails.add(email);
            routedTo := if (routedTo != "") routedTo # "," else routedTo;
            routedTo := routedTo # "suppression_list";
          };
          case null {};
        };
      };
      if (routedTo != "") {
        switch (webhookInboxState.s.events.get(eventId)) {
          case (?existing) {
            webhookInboxState.s.events.add(eventId, { existing with routedTo = routedTo });
          };
          case null {};
        };
      };
    } catch (_e) {
      // Routing is best-effort — never fail the provider response.
    };
    { ok = true; eventId = eventId };
  };

  /// List inbox events matching the supplied filters. Results are sorted by
  /// receivedAt descending and truncated to filters.limit.
  public query func getWebhookInboxEvents(
    filters : WebhookInbox.WebhookInboxFilters,
  ) : async [WebhookInbox.NormalizedWebhookEvent] {
    let all = webhookInboxState.s.events.values().toArray();
    let filtered = all.filter(func(e : WebhookInbox.NormalizedWebhookEvent) : Bool {
      switch (filters.provider) {
        case (?p) { e.provider == p };
        case null { true };
      };
    }).filter(func(e : WebhookInbox.NormalizedWebhookEvent) : Bool {
      switch (filters.normalizedEventType) {
        case (?t) { e.normalizedEventType == t };
        case null { true };
      };
    }).filter(func(e : WebhookInbox.NormalizedWebhookEvent) : Bool {
      switch (filters.leadEmailOrPhone) {
        case (?s) {
          (switch (e.leadEmail) { case (?em) em.contains(#text s); case null false; })
          or (switch (e.leadPhone) { case (?ph) ph.contains(#text s); case null false; });
        };
        case null { true };
      };
    }).filter(func(e : WebhookInbox.NormalizedWebhookEvent) : Bool {
      switch (filters.fromTimestamp) {
        case (?ts) { e.receivedAt >= ts };
        case null { true };
      };
    }).filter(func(e : WebhookInbox.NormalizedWebhookEvent) : Bool {
      switch (filters.toTimestamp) {
        case (?ts) { e.receivedAt <= ts };
        case null { true };
      };
    });
    let sorted = filtered.sort(
      func(a : WebhookInbox.NormalizedWebhookEvent, b : WebhookInbox.NormalizedWebhookEvent) : Order.Order {
        Int.compare(b.receivedAt, a.receivedAt);
      },
    );
    let n = if (filters.limit < sorted.size()) { filters.limit } else { sorted.size() };
    Array.tabulate(n, func(i) { sorted[i] });
  };

  /// Return a single inbox event by id, or null if absent.
  public query func getWebhookInboxEvent(
    id : Text,
  ) : async ?WebhookInbox.NormalizedWebhookEvent {
    webhookInboxState.s.events.get(id);
  };

  /// Return aggregated stats over the inbox: total events, counts per
  /// provider, counts per normalized event type, and events received in the
  /// last 24 hours.
  public query func getWebhookInboxStats() : async WebhookInbox.WebhookInboxStats {
    let all = webhookInboxState.s.events.values().toArray();
    let totalEvents = all.size();
    var eventsByProvider : [(Text, Nat)] = [];
    var eventsByType : [(Text, Nat)] = [];
    let twentyFourHoursAgo = Time.now() - (24 * 60 * 60 * 1_000_000_000);
    var eventsLast24h = 0;
    for (e in all.vals()) {
      // Provider label for the stats breakdown.
      let providerLabel = switch (e.provider) {
        case (#instantly) "instantly";
        case (#smartlead) "smartlead";
        case (#twilio)    "twilio";
        case (#sendgrid)  "sendgrid";
      };
      eventsByProvider := bumpCount(eventsByProvider, providerLabel);
      eventsByType := bumpCount(eventsByType, e.normalizedEventType);
      if (e.receivedAt > twentyFourHoursAgo) {
        eventsLast24h += 1;
      };
    };
    { totalEvents; eventsByProvider; eventsByType; eventsLast24h };
  };

  /// Helper: increment the count for a key in a [(Text, Nat)] tally, returning
  /// a new array with the updated count. Used by getWebhookInboxStats.
  private func bumpCount(tally : [(Text, Nat)], key : Text) : [(Text, Nat)] {
    var found = false;
    let updated = tally.map<(Text, Nat), (Text, Nat)>(func(entry : (Text, Nat)) : (Text, Nat) {
      let (k, c) = entry;
      if (k == key) { found := true; (k, c + 1) } else { (k, c) };
    });
    if (found) { updated } else { tally.concat([(key, 1)]) };
  };

  /// Generate and ingest a test webhook event for the chosen provider. The
  /// sample payloads mirror the documented provider request shapes so the
  /// inbox can be exercised end-to-end without a live provider POST.
  public shared ({ caller = _ }) func sendTestWebhookEvent(
    provider : WebhookInbox.WebhookTestPayload,
  ) : async { ok : Bool; eventId : Text } {
    switch (provider) {
      case (#instantly) {
        await receiveInstantlyWebhook(
          "",
          "{\"event_type\":\"reply_received\",\"timestamp\":\"2026-07-04T12:00:00Z\",\"campaign_id\":\"test-campaign\",\"campaign_name\":\"Test Campaign\",\"lead_email\":\"test@example.com\",\"reply_text\":\"Yes, I am interested\",\"reply_subject\":\"Re: your inquiry\"}",
          [],
        );
      };
      case (#smartlead) {
        await receiveSmartleadWebhook(
          "",
          "{\"event_type\":\"EMAIL_REPLY\",\"from_email\":\"sender@test.com\",\"to_email\":\"lead@example.com\",\"subject\":\"Re: outreach\",\"reply_body\":\"Sounds interesting\",\"campaign_id\":\"test-campaign\",\"campaign_name\":\"Test\",\"time_replied\":\"2026-07-04T12:00:00Z\"}",
          [],
        );
      };
      case (#twilio) {
        if (not webhookInboxEnabled()) {
          Runtime.trap("Webhook Inbox is not enabled");
        };
        let normEvent = WebhookInboxLib.normalizeTwilioEvent("MessageStatus=delivered&To=%2B15551234567&From=%2B15557654321&MessageSid=SMtest");
        let eventId = makeEventId("twilio");
        webhookInboxState.s.events.add(eventId, { normEvent with id = eventId; routedTo = "" });
        { ok = true; eventId = eventId };
      };
      case (#sendgrid) {
        if (not webhookInboxEnabled()) {
          Runtime.trap("Webhook Inbox is not enabled");
        };
        let normEvent = WebhookInboxLib.normalizeSendgridEvent("[{\"event\":\"delivered\",\"email\":\"lead@example.com\",\"timestamp\":1783129600,\"sg_event_id\":\"sg-test-1\"}]");
        let eventId = makeEventId("sendgrid");
        webhookInboxState.s.events.add(eventId, { normEvent with id = eventId; routedTo = "" });
        { ok = true; eventId = eventId };
      };
    };
  };

};
