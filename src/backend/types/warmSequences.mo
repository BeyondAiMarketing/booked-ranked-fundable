module {

  public type WarmTouch = {
    touchNumber : Nat;
    delayHours : Nat;
    subject : Text;
    bodyTemplate : Text;
    ctaType : Text;
    bookingLinkIncluded : Bool;
  };

  public type WarmSequence = {
    id : Text;
    niche : Text;
    name : Text;
    touches : [WarmTouch];
    triggerEvents : [Text];
  };

  public type AuditSnapshot = {
    seoScore : Nat;
    reputationScore : Nat;
    websiteScore : Nat;
    overallScore : Nat;
  };

  public type WarmLeadHandoff = {
    leadId : Text;
    niche : Text;
    coldSequenceId : Text;
    warmSequenceId : Text;
    handoffTrigger : Text;
    handoffTimestamp : Int;
    auditScores : ?AuditSnapshot;
    demoVisited : Bool;
  };

  public type PipelineStage = {
    #LeadSourced;
    #Contacted;
    #AuditStarted;
    #AuditCompleted;
    #WarmSequenceActive;
    #DemoVisited;
    #CallBooked;
  };

  public type OutreachEvent = {
    id : Text;
    leadId : Text;
    niche : Text;
    eventType : Text;
    sequenceId : Text;
    touchNumber : Nat;
    timestamp : Int;
    utmSource : Text;
    utmMedium : Text;
    utmCampaign : Text;
    metadata : [(Text, Text)];
  };

  public type PipelineFunnelStats = {
    niche : Text;
    leadsSourced : Nat;
    contacted : Nat;
    auditStarted : Nat;
    auditCompleted : Nat;
    warmSequenceActive : Nat;
    demoVisited : Nat;
    callBooked : Nat;
  };

  public type VerificationStatus = {
    #Unverified;
    #Verified;
    #Invalid;
    #Pending;
  };

  public type LeadEnrichment = {
    leadId : Text;
    emailVerificationStatus : VerificationStatus;
    phoneVerificationStatus : VerificationStatus;
    emailVerifiedAt : ?Int;
    phoneVerifiedAt : ?Int;
    canReceiveOutreach : Bool;
  };

};
