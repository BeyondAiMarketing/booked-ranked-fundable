module {

  /// A pending email item in the autopilot bulk-send queue.
  public type ApeQueueItem = {
    id          : Text;
    leadId      : Text;
    toEmail     : Text;
    toName      : Text;
    subject     : Text;
    htmlBody    : Text;
    fromDomain  : Text;
    scheduledAt : Int;
    status      : { #pending; #sent; #failed; #skipped };
    attempts    : Nat;
    sentAt      : ?Int;
    errorMsg    : ?Text;
  };

  /// A scheduled background job that discovers leads across multiple cities.
  public type ScheduledDiscoveryJob = {
    id              : Text;
    status          : { #pending; #running; #completed; #failed };
    scheduledAt     : Int;
    completedAt     : ?Int;
    leadsDiscovered : Nat;
    leadsEnriched   : Nat;
    citiesSearched  : [Text];
    errorMessage    : ?Text;
  };

  /// Result of enriching a single lead with verified contact data.
  public type LeadEnrichmentResult = {
    leadId             : Text;
    email              : ?Text;
    phone              : ?Text;
    ownerName          : ?Text;
    verificationStatus : { #verified; #unverifiable; #bounced };
    enrichedAt         : Int;
  };

  /// A bulk email send job — tracks delivery lifecycle for a batch.
  public type BulkSendJob = {
    id              : Text;
    scheduledAt     : Int;
    totalEmails     : Nat;
    sentCount       : Nat;
    deliveredCount  : Nat;
    openCount       : Nat;
    clickCount      : Nat;
    bounceCount     : Nat;
    status          : { #queued; #running; #paused; #completed; #failed };
    senderSubdomain : Text;
    dailyCap        : Nat;
  };

  /// Tracks per-subdomain sending health for deliverability protection.
  public type SenderSubdomainRecord = {
    subdomain       : Text;
    sentToday       : Nat;
    bounceRate      : Float;
    complaintRate   : Float;
    warmupDay       : Nat;
    maxDailyVolume  : Nat;
    status          : { #warming; #active; #paused; #flagged };
  };

  /// A rule that controls when an automated SMS is sent to a lead.
  public type SmsAutopilotRule = {
    id              : Text;
    triggerType     : { #twoOpens; #noOpenFortyEightHours; #manualTrigger };
    delayMinutes    : Nat;
    messageTemplate : Text;
    isActive        : Bool;
    sentCount       : Nat;
  };

  /// A scheduled SMS send task for a specific lead under a specific rule.
  public type SmsAutopilotJob = {
    id              : Text;
    leadId          : Text;
    ruleId          : Text;
    scheduledAt     : Int;
    status          : { #queued; #sent; #failed; #cancelled };
    messageText     : Text;
    twilioMessageSid : ?Text;
  };

  /// An inbound email reply from a lead, classified by AI.
  public type EmailReplyRecord = {
    id             : Text;
    leadId         : Text;
    replyBody      : Text;
    receivedAt     : Int;
    classification : { #interested; #notInterested; #wrongPerson; #referral; #unclassified };
    draftFollowUp  : ?Text;
    reviewStatus   : { #pending; #approved; #rejected; #sent };
    reviewedAt     : ?Int;
  };

  /// Global autopilot configuration controlling send volume and compliance mode.
  public type AutopilotConfig = {
    isEnabled          : Bool;
    dailyEmailCap      : Nat;
    dailySmsCap        : Nat;
    discoveryEnabled   : Bool;
    enrichmentEnabled  : Bool;
    warmupPhase        : Bool;
    currentWarmupDay   : Nat;
    targetDailyVolume  : Nat;
    complianceMode     : { #canSpam; #gdpr; #both };
  };

  /// A deliverability signal event (bounce, complaint, unsubscribe, open, click).
  public type DeliverabilityEvent = {
    id              : Text;
    eventType       : { #bounce; #complaint; #unsubscribe; #open; #click };
    leadId          : Text;
    email           : Text;
    occurredAt      : Int;
    senderSubdomain : Text;
  };

  /// A flattened inbox item for the admin reply-review UI.
  public type ReplyInboxItem = {
    id            : Text;
    leadId        : Text;
    leadName      : Text;
    leadNiche     : Text;
    replyBody     : Text;
    classification : Text;
    draftResponse : Text;
    receivedAt    : Int;
    status        : Text;
  };

};
