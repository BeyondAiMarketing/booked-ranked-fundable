module {

  /// A CRM drip queue — holds a list of contacts to email one-by-one
  /// with a configurable interval and daily cap.
  public type DripQueue = {
    id                  : Text;
    tenantId            : Text;
    name                : Text;
    campaignTemplateId  : Text;
    campaignTemplateName : Text;
    niche               : Text;
    contactEmails       : [Text];
    contactNames        : [Text];
    /// Seconds between each send (e.g. 70 = 1 min 10 sec)
    sendIntervalSeconds : Nat;
    /// Maximum emails to send within a single UTC calendar day
    dailySendCap        : Nat;
    /// queued | running | paused | cancelled | completed
    status              : Text;
    /// Index of the next contact to send to
    currentIndex        : Nat;
    sentCount           : Nat;
    failedCount         : Nat;
    dailySentCount      : Nat;
    /// Canister time (nanoseconds) when dailySentCount was last reset
    dailyResetAt        : Int;
    createdAt           : Int;
    updatedAt           : Int;
    pausedAt            : ?Int;
    completedAt         : ?Int;
    cancelledAt         : ?Int;
  };

  /// Per-email send attempt record for a drip queue.
  public type DripQueueEmailLog = {
    id             : Text;
    queueId        : Text;
    tenantId       : Text;
    recipientEmail : Text;
    recipientName  : Text;
    sentAt         : ?Int;
    /// queued | sent | failed
    status         : Text;
    errorMessage   : ?Text;
    retryCount     : Nat;
  };

  /// Per-lead bounce tracking record for a drip queue.
  public type DripLeadBounceRecord = {
    leadId     : Text;
    queueId    : Text;
    bounceType : { #soft; #hard };
    bouncedAt  : Int;
    reason     : ?Text;
    requeued   : Bool;
  };

  /// Throttle / pacing configuration for a drip queue.
  public type DripQueueThrottleConfig = {
    dailyCap          : Nat;
    intervalSeconds   : Nat;
    staggerEnabled    : Bool;
    backoffMultiplier : Float;
  };

};
