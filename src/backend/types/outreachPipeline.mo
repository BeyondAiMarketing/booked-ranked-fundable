module {
  public type PipelineActivityEntry = {
    timestamp : Int;
    action : Text;
    details : Text;
  };

  public type PipelineLead = {
    id : Text;
    tenantId : Text;
    leadId : Text;
    businessName : Text;
    ownerEmail : Text;
    niche : Text;
    source : Text;
    laneStatus : Text; // new | contacted | replied | demo_scheduled | trial | customer
    laneMoveTimestamp : Int;
    autoTriggerScheduledAt : ?Int;
    autoTriggerFiredAt : ?Int;
    autoTriggerCancelled : Bool;
    activityLog : [PipelineActivityEntry];
  };

  public type InboundReply = {
    id : Text;
    leadId : Text;
    prospectEmail : Text;
    subjectLine : Text;
    bodyText : Text;
    receivedAt : Int;
    claudeSentiment : Text; // positive | neutral | negative
    claudeSuggestedAction : Text;
    claudePainPoints : Text;
    actionStatus : Text; // pending | completed
  };

  public type TrialActivityEvent = {
    id : Text;
    trialId : Text;
    eventType : Text; // login | crm_usage | social_usage
    occurredAt : Int;
    pointsAwarded : Nat;
  };

  public type OutreachQueuedAction = {
    id : Text;
    leadId : Text;
    actionType : Text; // email
    scheduledAt : Int;
    autoFireAt : Int;
    status : Text; // pending | approved | cancelled | fired
    emailSubject : ?Text;
    emailBody : ?Text;
  };

  public type FunnelRecord = {
    leadId : Text;
    campaignId : Text;
    emailSentAt : ?Int;
    openedAt : ?Int;
    clickedAt : ?Int;
    demoStartedAt : ?Int;
    demoCompletedAt : ?Int;
    trialProvisionedAt : ?Int;
    funnelStep : Text;
    niche : Text;
    enrolledAt : Int;
  };
}
