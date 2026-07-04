import List  "mo:core/List";
import Map   "mo:core/Map";
import Time  "mo:core/Time";
import Text  "mo:core/Text";
import T     "../types/newsletter";

/// Domain logic for the newsletter module.
/// All functions are pure / stateless — state is injected by the mixin.
module {

  // ── Subscriber helpers ──────────────────────────────────────────────────────

  /// Create a fresh subscriber record.
  public func newSubscriber(
    id           : Text,
    tenantId     : Text,
    email        : Text,
    phone        : ?Text,
    businessName : ?Text,
    tags         : [Text],
    customFields : [(Text, Text)],
  ) : T.NewsletterSubscriber {
    {
      id;
      tenantId;
      email;
      phone;
      businessName;
      tags;
      status         = #active;
      customFields;
      subscribedAt   = Time.now();
      unsubscribedAt = null;
    };
  };

  /// Return a copy of the subscriber with status set to #unsubscribed.
  public func unsubscribe(sub : T.NewsletterSubscriber) : T.NewsletterSubscriber {
    { sub with status = #unsubscribed; unsubscribedAt = ?Time.now() };
  };

  /// Return a copy of the subscriber with status set to #bounced.
  public func markBounced(sub : T.NewsletterSubscriber) : T.NewsletterSubscriber {
    { sub with status = #bounced };
  };

  /// Return a copy of the subscriber with status set to #complained.
  public func markComplained(sub : T.NewsletterSubscriber) : T.NewsletterSubscriber {
    { sub with status = #complained };
  };

  /// Filter a list of subscribers to only active ones.
  public func activeSubscribers(
    subs : List.List<T.NewsletterSubscriber>,
  ) : [T.NewsletterSubscriber] {
    subs.filter(func(s) { s.status == #active }).toArray();
  };

  /// Simple email format check — must contain '@' and '.' after '@'.
  func isValidEmail(email : Text) : Bool {
    switch (email.split(#char '@').next()) {
      case null false;
      case (?_) {
        let parts = email.split(#char '@');
        var count = 0;
        var domain = "";
        for (p in parts) { count += 1; domain := p };
        count == 2 and domain.contains(#char '.');
      };
    };
  };

  /// Bulk-import subscribers from a raw list of email strings.
  /// Skips duplicates (already in the tenantSubs map) and validates format.
  public func importSubscribers(
    tenantId   : Text,
    emails     : [Text],
    tenantSubs : Map.Map<Text, T.NewsletterSubscriber>,
    idSeed     : { var n : Nat },
  ) : T.SubscriberImportResult {
    var imported : Nat = 0;
    var skipped  : Nat = 0;
    let errors   = List.empty<Text>();

    for (raw in emails.values()) {
      let email = raw.toLower().trim(#char ' ');
      if (not isValidEmail(email)) {
        skipped += 1;
        errors.add("Invalid email: " # email);
      } else if (tenantSubs.containsKey(email)) {
        skipped += 1;
      } else {
        let id = nextId("sub", idSeed);
        let sub = newSubscriber(id, tenantId, email, null, null, [], []);
        tenantSubs.add(email, sub);
        imported += 1;
      };
    };

    { imported; skipped; errors = errors.toArray() };
  };

  // ── Campaign helpers ────────────────────────────────────────────────────────

  /// Create a new campaign in #draft status.
  public func newCampaign(
    id            : Text,
    tenantId      : Text,
    name          : Text,
    subject       : Text,
    htmlBody      : Text,
    plainTextBody : ?Text,
    fromName      : ?Text,
    fromEmail     : ?Text,
    tags          : [Text],
  ) : T.NewsletterCampaign {
    {
      id;
      tenantId;
      name;
      subject;
      htmlBody;
      plainTextBody;
      fromName;
      fromEmail;
      scheduledAt = null;
      sentAt      = null;
      status      = #draft;
      tags;
      stats       = emptyStats();
    };
  };

  /// Return a zero-valued stats record.
  public func emptyStats() : T.NewsletterCampaignStats {
    {
      sentCount        = 0;
      openCount        = 0;
      clickCount       = 0;
      bounceCount      = 0;
      unsubscribeCount = 0;
      complaintCount   = 0;
    };
  };

  /// Increment one stat field by name; returns updated stats.
  public func incrementStat(
    stats : T.NewsletterCampaignStats,
    field : Text,
  ) : T.NewsletterCampaignStats {
    switch (field) {
      case "sent"        { { stats with sentCount        = stats.sentCount        + 1 } };
      case "open"        { { stats with openCount        = stats.openCount        + 1 } };
      case "click"       { { stats with clickCount       = stats.clickCount       + 1 } };
      case "bounce"      { { stats with bounceCount      = stats.bounceCount      + 1 } };
      case "unsubscribe" { { stats with unsubscribeCount = stats.unsubscribeCount + 1 } };
      case "complaint"   { { stats with complaintCount   = stats.complaintCount   + 1 } };
      case _             { stats };
    };
  };

  // ── Send-log helpers ────────────────────────────────────────────────────────

  /// Build a new send-log entry in #queued status.
  public func newSendLog(
    id           : Text,
    campaignId   : Text,
    subscriberId : Text,
    email        : Text,
  ) : T.NewsletterSendLog {
    {
      id;
      campaignId;
      subscriberId;
      email;
      status       = #queued;
      errorMessage = null;
      sentAt       = null;
      openedAt     = null;
    };
  };

  /// Return a copy of the log entry with an updated status.
  public func updateSendLogStatus(
    entry  : T.NewsletterSendLog,
    status : T.SendLogStatus,
    error  : ?Text,
  ) : T.NewsletterSendLog {
    let sentAt : ?Int = switch (status) {
      case (#sent)      { ?Time.now() };
      case (#delivered) { ?Time.now() };
      case (_)                   { entry.sentAt };
    };
    let openedAt : ?Int = switch (status) {
      case (#opened) { ?Time.now() };
      case (_)       { entry.openedAt };
    };
    { entry with status; errorMessage = error; sentAt; openedAt };
  };

  // ── ID generation ───────────────────────────────────────────────────────────

  /// Generate the next newsletter-scoped ID string.
  public func nextId(prefix : Text, counter : { var n : Nat }) : Text {
    counter.n += 1;
    prefix # "-" # counter.n.toText() # "-" # Time.now().toText();
  };

  // ── Merge-tag processing ────────────────────────────────────────────────────

  /// Replace {{tag}} placeholders in htmlBody with subscriber field values.
  /// Supports: email, businessName, phone, firstName, lastName, and any custom field key.
  public func processMergeTags(
    htmlBody   : Text,
    subscriber : T.NewsletterSubscriber,
  ) : Text {
    // Helper to extract first/last name from email local-part
    let emailLocal = switch (subscriber.email.split(#char '@').next()) {
      case (?local) { local };
      case null     { subscriber.email };
    };
    let nameParts = emailLocal.split(#char '.').toArray();
    let firstName = if (nameParts.size() > 0) { nameParts[0] } else { emailLocal };
    let lastName  = if (nameParts.size() > 1) { nameParts[1] } else { "" };

    var body = htmlBody;

    // Core fields
    body := body.replace(#text "{{email}}",        subscriber.email);
    body := body.replace(#text "{{businessName}}", switch (subscriber.businessName) { case (?v) v; case null "" });
    body := body.replace(#text "{{phone}}",        switch (subscriber.phone)        { case (?v) v; case null "" });
    body := body.replace(#text "{{firstName}}",    firstName);
    body := body.replace(#text "{{lastName}}",     lastName);

    // Custom fields — e.g. {{city}}, {{niche}}
    for ((key, value) in subscriber.customFields.values()) {
      body := body.replace(#text ("{{" # key # "}}"), value);
    };

    body;
  };

};
