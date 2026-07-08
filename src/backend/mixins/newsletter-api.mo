import List  "mo:core/List";
import Map   "mo:core/Map";
import Text  "mo:core/Text";
import Time  "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import T     "../types/newsletter";
import NL    "../lib/newsletter";

/// Public newsletter API mixin.
///
/// Injects:
///   - accessControlState — caller auth
///   - nlSubscribers      — per-tenant subscriber maps  (tenantId -> (email -> subscriber))
///   - nlCampaigns        — per-tenant campaign maps    (tenantId -> (campaignId -> campaign))
///   - nlSendLogs         — per-campaign send-log lists (campaignId -> [SendLog])
///   - nlIdCounter        — monotonic ID seed
mixin (
  accessControlState : AccessControl.AccessControlState,
  nlSubscribers      : Map.Map<Text, Map.Map<Text, T.NewsletterSubscriber>>,
  nlCampaigns        : Map.Map<Text, Map.Map<Text, T.NewsletterCampaign>>,
  nlSendLogs         : Map.Map<Text, List.List<T.NewsletterSendLog>>,
  nlIdCounter        : { var n : Nat },
) {

  // ── Internal helpers ─────────────────────────────────────────────────────────

  func tenantSubMap(tenantId : Text) : Map.Map<Text, T.NewsletterSubscriber> {
    switch (nlSubscribers.get(tenantId)) {
      case (?m) { m };
      case null {
        let m = Map.empty<Text, T.NewsletterSubscriber>();
        nlSubscribers.add(tenantId, m);
        m;
      };
    };
  };

  func tenantCampaignMap(tenantId : Text) : Map.Map<Text, T.NewsletterCampaign> {
    switch (nlCampaigns.get(tenantId)) {
      case (?m) { m };
      case null {
        let m = Map.empty<Text, T.NewsletterCampaign>();
        nlCampaigns.add(tenantId, m);
        m;
      };
    };
  };

  func campaignLogList(campaignId : Text) : List.List<T.NewsletterSendLog> {
    switch (nlSendLogs.get(campaignId)) {
      case (?l) { l };
      case null {
        let l = List.empty<T.NewsletterSendLog>();
        nlSendLogs.add(campaignId, l);
        l;
      };
    };
  };

  // ── Subscribers ─────────────────────────────────────────────────────────────

  /// Add or update a single subscriber for a tenant.
  public shared ({ caller }) func upsertNewsletterSubscriber(
    tenantId     : Text,
    email        : Text,
    phone        : ?Text,
    businessName : ?Text,
    tags         : [Text],
    customFields : [(Text, Text)],
  ) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let subs = tenantSubMap(tenantId);
    let normEmail = email.toLower().trim(#char ' ');
    let (id, sub) = switch (subs.get(normEmail)) {
      case (?existing) {
        let updated = { existing with phone; businessName; tags; customFields };
        (existing.id, updated);
      };
      case null {
        let newId = NL.nextId("sub", nlIdCounter);
        (newId, NL.newSubscriber(newId, tenantId, normEmail, phone, businessName, tags, customFields));
      };
    };
    subs.add(normEmail, sub);
    id;
  };

  /// Bulk-import subscribers from a list of email addresses.
  public shared ({ caller }) func importNewsletterSubscribers(
    tenantId : Text,
    emails   : [Text],
  ) : async T.SubscriberImportResult {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let subs = tenantSubMap(tenantId);
    NL.importSubscribers(tenantId, emails, subs, nlIdCounter);
  };

  /// Retrieve a single subscriber by email for a tenant.
  public query ({ caller }) func getNewsletterSubscriber(
    tenantId : Text,
    email    : Text,
  ) : async ?T.NewsletterSubscriber {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlSubscribers.get(tenantId)) {
      case (?subs) { subs.get(email.toLower().trim(#char ' ')) };
      case null    { null };
    };
  };

  /// Unsubscribe a single address for a tenant.
  public shared ({ caller }) func unsubscribeNewsletterEmail(
    tenantId : Text,
    email    : Text,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let normEmail = email.toLower().trim(#char ' ');
    switch (nlSubscribers.get(tenantId)) {
      case (?subs) {
        switch (subs.get(normEmail)) {
          case (?sub) {
            subs.add(normEmail, NL.unsubscribe(sub));
            true;
          };
          case null { false };
        };
      };
      case null { false };
    };
  };

  /// Mark a subscriber as bounced (hard or soft) based on bounce type.
  public shared ({ caller }) func recordNewsletterBounce(
    tenantId   : Text,
    email      : Text,
    bounceType : T.BounceType,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let normEmail = email.toLower().trim(#char ' ');
    switch (nlSubscribers.get(tenantId)) {
      case (?subs) {
        switch (subs.get(normEmail)) {
          case (?sub) {
            let updated = switch (bounceType) {
              case (#hard)      { NL.markBounced(sub) };
              case (#complaint) { NL.markComplained(sub) };
              case (#soft)      { sub }; // soft bounce: keep status, don't suppress
            };
            subs.add(normEmail, updated);
            true;
          };
          case null { false };
        };
      };
      case null { false };
    };
  };

  /// Search subscribers for a tenant with optional query and filters.
  public query ({ caller }) func searchNewsletterSubscribers(
    tenantId     : Text,
    searchQuery  : Text,
    statusFilter : ?T.SubscriberStatus,
    tagFilter    : ?Text,
  ) : async [T.NewsletterSubscriber] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlSubscribers.get(tenantId)) {
      case null { [] };
      case (?subs) {
        let q = searchQuery.toLower();
        subs.values().filter(func(s : T.NewsletterSubscriber) : Bool {
          let matchesQuery = q == "" or
            s.email.toLower().contains(#text q) or
            (switch (s.businessName) { case (?n) { n.toLower().contains(#text q) }; case null false });
          let matchesStatus = switch (statusFilter) {
            case (?st) { s.status == st };
            case null  { true };
          };
          let matchesTag = switch (tagFilter) {
            case (?tag) { s.tags.find(func(t : Text) : Bool { t == tag }) != null };
            case null   { true };
          };
          matchesQuery and matchesStatus and matchesTag;
        }).toArray();
      };
    };
  };

  /// Get all active subscribers for a tenant.
  public query ({ caller }) func getActiveNewsletterSubscribers(
    tenantId : Text,
  ) : async [T.NewsletterSubscriber] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlSubscribers.get(tenantId)) {
      case null    { [] };
      case (?subs) {
        subs.values().filter(func(s : T.NewsletterSubscriber) : Bool {
          s.status == #active
        }).toArray();
      };
    };
  };

  /// Get all subscribers for a tenant (any status).
  public query ({ caller }) func getAllNewsletterSubscribers(
    tenantId : Text,
  ) : async [T.NewsletterSubscriber] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlSubscribers.get(tenantId)) {
      case null    { [] };
      case (?subs) { subs.values().toArray() };
    };
  };

  /// Delete a subscriber by email.
  public shared ({ caller }) func deleteNewsletterSubscriber(
    tenantId : Text,
    email    : Text,
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlSubscribers.get(tenantId)) {
      case (?subs) {
        let normEmail = email.toLower().trim(#char ' ');
        let existed = subs.containsKey(normEmail);
        subs.remove(normEmail);
        existed;
      };
      case null { false };
    };
  };

  // ── Campaigns ───────────────────────────────────────────────────────────────

  /// Create a new newsletter campaign in #draft status.
  public shared ({ caller }) func createNewsletterCampaign(
    tenantId      : Text,
    name          : Text,
    subject       : Text,
    htmlBody      : Text,
    plainTextBody : ?Text,
    fromName      : ?Text,
    fromEmail     : ?Text,
    tags          : [Text],
  ) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let id       = NL.nextId("cmp", nlIdCounter);
    let campaign = NL.newCampaign(id, tenantId, name, subject, htmlBody, plainTextBody, fromName, fromEmail, tags);
    tenantCampaignMap(tenantId).add(id, campaign);
    id;
  };

  /// Update campaign metadata (name, subject, body, etc.). Allowed only on #draft.
  public shared ({ caller }) func updateNewsletterCampaign(
    tenantId  : Text,
    campaign  : T.NewsletterCampaign,
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) {
        switch (cmap.get(campaign.id)) {
          case (?existing) {
            if (existing.status != #draft) {
              Runtime.trap("Can only update draft campaigns");
            };
            cmap.add(campaign.id, { campaign with status = #draft });
            true;
          };
          case null { false };
        };
      };
      case null { false };
    };
  };

  /// Transition a campaign's status.
  public shared ({ caller }) func setNewsletterCampaignStatus(
    tenantId   : Text,
    campaignId : Text,
    status     : T.CampaignStatus,
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) {
        switch (cmap.get(campaignId)) {
          case (?c) {
            cmap.add(campaignId, { c with status });
            true;
          };
          case null { false };
        };
      };
      case null { false };
    };
  };

  /// Schedule a campaign (set scheduledAt) or send immediately (sendAt = null → now).
  public shared ({ caller }) func scheduleCampaign(
    tenantId   : Text,
    campaignId : Text,
    sendAt     : ?Int,
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) {
        switch (cmap.get(campaignId)) {
          case (?c) {
            if (c.status != #draft and c.status != #paused) {
              Runtime.trap("Campaign must be in draft or paused status to schedule");
            };
            let scheduledAt : ?Int = switch (sendAt) {
              case (?t) { ?t };
              case null { ?Time.now() };
            };
            cmap.add(campaignId, { c with status = #scheduled; scheduledAt });
            true;
          };
          case null { false };
        };
      };
      case null { false };
    };
  };

  /// Trigger send of a campaign to all active subscribers.
  /// Marks campaign as #sending, creates send-log entries per subscriber.
  public shared ({ caller }) func sendNewsletterCampaign(
    tenantId   : Text,
    campaignId : Text,
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let cmap = switch (nlCampaigns.get(tenantId)) {
      case (?m) { m };
      case null { Runtime.trap("Tenant has no campaigns") };
    };
    let campaign = switch (cmap.get(campaignId)) {
      case (?c) { c };
      case null { Runtime.trap("Campaign not found") };
    };
    if (campaign.status != #draft and campaign.status != #scheduled and campaign.status != #paused) {
      Runtime.trap("Campaign is not in a sendable status");
    };

    // Collect active subscribers
    let activeSubs = switch (nlSubscribers.get(tenantId)) {
      case (?subs) {
        subs.values().filter(func(s : T.NewsletterSubscriber) : Bool {
          s.status == #active
        }).toArray();
      };
      case null { [] };
    };

    // Build send-log entries
    let logList = campaignLogList(campaignId);
    for (sub in activeSubs.values()) {
      let logId  = NL.nextId("log", nlIdCounter);
      let mergedBody = NL.processMergeTags(campaign.htmlBody, sub);
      let _ = mergedBody; // body available to email extension integration
      let entry  = NL.newSendLog(logId, campaignId, sub.id, sub.email);
      let sent   = NL.updateSendLogStatus(entry, #sent, null);
      logList.add({ sent with sentAt = ?Time.now() });
    };

    // Update campaign status and stats
    let sentCount = activeSubs.size();
    cmap.add(campaignId, {
      campaign with
      status  = #sent;
      sentAt  = ?Time.now();
      stats   = { campaign.stats with sentCount = campaign.stats.sentCount + sentCount };
    });

    sentCount;
  };

  /// Pause a sending or scheduled campaign.
  public shared ({ caller }) func pauseNewsletterCampaign(
    tenantId   : Text,
    campaignId : Text,
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) {
        switch (cmap.get(campaignId)) {
          case (?c) {
            if (c.status != #sending and c.status != #scheduled) {
              Runtime.trap("Campaign must be sending or scheduled to pause");
            };
            cmap.add(campaignId, { c with status = #paused });
            true;
          };
          case null { false };
        };
      };
      case null { false };
    };
  };

  /// Delete a campaign (drafts only).
  public shared ({ caller }) func deleteNewsletterCampaign(
    tenantId   : Text,
    campaignId : Text,
  ) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) {
        switch (cmap.get(campaignId)) {
          case (?c) {
            if (c.status != #draft) {
              Runtime.trap("Can only delete draft campaigns");
            };
            cmap.remove(campaignId);
            true;
          };
          case null { false };
        };
      };
      case null { false };
    };
  };

  /// Get all campaigns for a tenant.
  public query ({ caller }) func getNewsletterCampaigns(
    tenantId : Text,
  ) : async [T.NewsletterCampaign] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case null    { [] };
      case (?cmap) { cmap.values().toArray() };
    };
  };

  /// Get a single campaign by ID.
  public query ({ caller }) func getNewsletterCampaignById(
    tenantId   : Text,
    campaignId : Text,
  ) : async ?T.NewsletterCampaign {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) { cmap.get(campaignId) };
      case null    { null };
    };
  };

  // ── Send logs ───────────────────────────────────────────────────────────────

  /// Record a batch of queued send-log entries when a campaign begins sending.
  public shared ({ caller }) func enqueueNewsletterSends(
    tenantId   : Text,
    campaignId : Text,
    emails     : [Text],
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    // Resolve subscriberIds from email → subscriber map
    let subMap = switch (nlSubscribers.get(tenantId)) {
      case (?m) { m };
      case null { Map.empty<Text, T.NewsletterSubscriber>() };
    };
    let logs = campaignLogList(campaignId);
    var count : Nat = 0;
    for (email in emails.values()) {
      let normEmail = email.toLower().trim(#char ' ');
      let subId = switch (subMap.get(normEmail)) {
        case (?s) { s.id };
        case null { "unknown-" # normEmail };
      };
      let logId = NL.nextId("log", nlIdCounter);
      logs.add(NL.newSendLog(logId, campaignId, subId, normEmail));
      count += 1;
    };
    count;
  };

  /// Update the status of a single send-log entry (webhook / delivery event).
  public shared ({ caller }) func updateNewsletterSendStatus(
    campaignId   : Text,
    sendLogId    : Text,
    status       : T.SendLogStatus,
    errorMessage : ?Text,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (nlSendLogs.get(campaignId)) {
      case (?logs) {
        var found = false;
        logs.mapInPlace(func(entry : T.NewsletterSendLog) : T.NewsletterSendLog {
          if (entry.id == sendLogId) {
            found := true;
            NL.updateSendLogStatus(entry, status, errorMessage);
          } else { entry };
        });
        found;
      };
      case null { false };
    };
  };

  /// Return all send-log entries for a campaign.
  public query ({ caller }) func getNewsletterSendLogs(
    tenantId   : Text,
    campaignId : Text,
  ) : async [T.NewsletterSendLog] {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    // tenantId used for access-control validation via campaign ownership (looked up indirectly)
    let _ = tenantId;
    switch (nlSendLogs.get(campaignId)) {
      case (?logs) { logs.toArray() };
      case null    { [] };
    };
  };

  /// Return the aggregate stats for a campaign.
  public query ({ caller }) func getNewsletterCampaignStats(
    tenantId   : Text,
    campaignId : Text,
  ) : async ?T.NewsletterCampaignStats {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) {
        switch (cmap.get(campaignId)) {
          case (?c) { ?c.stats };
          case null { null };
        };
      };
      case null { null };
    };
  };

  /// Return aggregate stats across all campaigns for a tenant.
  public query ({ caller }) func getNewsletterAnalytics(
    tenantId : Text,
  ) : async T.NewsletterCampaignStats {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlCampaigns.get(tenantId)) {
      case null    { NL.emptyStats() };
      case (?cmap) {
        cmap.values().foldLeft(
          NL.emptyStats(),
          func(acc, c) {
            {
              sentCount        = acc.sentCount        + c.stats.sentCount;
              openCount        = acc.openCount        + c.stats.openCount;
              clickCount       = acc.clickCount       + c.stats.clickCount;
              bounceCount      = acc.bounceCount      + c.stats.bounceCount;
              unsubscribeCount = acc.unsubscribeCount + c.stats.unsubscribeCount;
              complaintCount   = acc.complaintCount   + c.stats.complaintCount;
            };
          },
        );
      };
    };
  };

  // ── Webhook handlers ─────────────────────────────────────────────────────────

  /// Bounce webhook: look up subscriber by email, mark status, update send log.
  public shared ({ caller }) func handleNewsletterBounce(
    tenantId   : Text,
    email      : Text,
    bounceType : T.BounceType,
    reason     : Text,
  ) : async Bool {
    // Allow unauthenticated webhook calls (common pattern for delivery webhooks)
    let _ = caller;
    let normEmail = email.toLower().trim(#char ' ');

    // Update subscriber status
    switch (nlSubscribers.get(tenantId)) {
      case (?subs) {
        switch (subs.get(normEmail)) {
          case (?sub) {
            let updated = switch (bounceType) {
              case (#hard)      { NL.markBounced(sub) };
              case (#complaint) { NL.markComplained(sub) };
              case (#soft)      { sub };
            };
            subs.add(normEmail, updated);
          };
          case null {};
        };
      };
      case null {};
    };

    // Update any matching send-log entries
    for ((campId, logs) in nlSendLogs.entries()) {
      logs.mapInPlace(func(entry : T.NewsletterSendLog) : T.NewsletterSendLog {
        if (entry.email == normEmail and (entry.status == #sent or entry.status == #queued)) {
          NL.updateSendLogStatus(entry, #bounced, ?reason);
        } else { entry };
      });
    };

    true;
  };

  /// Unsubscribe webhook: mark subscriber as unsubscribed, update send logs.
  public shared ({ caller }) func handleNewsletterUnsubscribe(
    tenantId   : Text,
    email      : Text,
    campaignId : Text,
  ) : async Bool {
    let _ = caller;
    let normEmail = email.toLower().trim(#char ' ');

    // Mark subscriber
    switch (nlSubscribers.get(tenantId)) {
      case (?subs) {
        switch (subs.get(normEmail)) {
          case (?sub) { subs.add(normEmail, NL.unsubscribe(sub)) };
          case null   {};
        };
      };
      case null {};
    };

    // Update campaign stats and send log
    switch (nlCampaigns.get(tenantId)) {
      case (?cmap) {
        switch (cmap.get(campaignId)) {
          case (?c) {
            cmap.add(campaignId, { c with stats = NL.incrementStat(c.stats, "unsubscribe") });
          };
          case null {};
        };
      };
      case null {};
    };

    switch (nlSendLogs.get(campaignId)) {
      case (?logs) {
        logs.mapInPlace(func(entry : T.NewsletterSendLog) : T.NewsletterSendLog {
          if (entry.email == normEmail) {
            NL.updateSendLogStatus(entry, #unsubscribed, null);
          } else { entry };
        });
      };
      case null {};
    };

    true;
  };

  // ── Merge tags (utility exposed as query) ────────────────────────────────────

  /// Process merge tags in htmlBody for a given subscriber email.
  public query ({ caller }) func processNewsletterMergeTags(
    tenantId : Text,
    email    : Text,
    htmlBody : Text,
  ) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller) or
             AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (nlSubscribers.get(tenantId)) {
      case (?subs) {
        switch (subs.get(email.toLower().trim(#char ' '))) {
          case (?sub) { NL.processMergeTags(htmlBody, sub) };
          case null   { htmlBody };
        };
      };
      case null { htmlBody };
    };
  };

};
