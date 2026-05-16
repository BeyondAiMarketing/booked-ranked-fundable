module {

  /// Status of a newsletter subscriber.
  public type SubscriberStatus = {
    #active;
    #unsubscribed;
    #bounced;
    #complained;
  };

  /// A newsletter subscriber, scoped by tenantId.
  public type NewsletterSubscriber = {
    id             : Text;
    tenantId       : Text;
    email          : Text;
    phone          : ?Text;
    businessName   : ?Text;
    tags           : [Text];
    status         : SubscriberStatus;
    customFields   : [(Text, Text)];
    subscribedAt   : Int;
    unsubscribedAt : ?Int;
  };

  /// Status of a newsletter campaign.
  public type CampaignStatus = {
    #draft;
    #scheduled;
    #sending;
    #sent;
    #paused;
  };

  /// Aggregate stats for a newsletter campaign send.
  public type NewsletterCampaignStats = {
    sentCount        : Nat;
    openCount        : Nat;
    clickCount       : Nat;
    bounceCount      : Nat;
    unsubscribeCount : Nat;
    complaintCount   : Nat;
  };

  /// A newsletter campaign, scoped by tenantId.
  public type NewsletterCampaign = {
    id            : Text;
    tenantId      : Text;
    name          : Text;
    subject       : Text;
    htmlBody      : Text;
    plainTextBody : ?Text;
    fromName      : ?Text;
    fromEmail     : ?Text;
    scheduledAt   : ?Int;
    sentAt        : ?Int;
    status        : CampaignStatus;
    tags          : [Text];
    stats         : NewsletterCampaignStats;
  };

  /// Status of a single newsletter send-log entry.
  public type SendLogStatus = {
    #queued;
    #sent;
    #delivered;
    #opened;
    #clicked;
    #bounced;
    #unsubscribed;
    #failed;
  };

  /// Per-recipient send log entry for a campaign.
  public type NewsletterSendLog = {
    id           : Text;
    campaignId   : Text;
    subscriberId : Text;
    email        : Text;
    status       : SendLogStatus;
    errorMessage : ?Text;
    sentAt       : ?Int;
    openedAt     : ?Int;
  };

  /// Bounce classification.
  public type BounceType = {
    #soft;
    #hard;
    #complaint;
  };

  /// Result returned after a bulk subscriber import.
  public type SubscriberImportResult = {
    imported : Nat;
    skipped  : Nat;
    errors   : [Text];
  };

};
