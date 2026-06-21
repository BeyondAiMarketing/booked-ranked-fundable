module OutreachTypes {
  public type Campaign = {
    id : Text;
    clientBusinessId : Text;
    campaignName : Text;
    campaignType : Text;
    status : Text;
    targetAudience : ?Text;
    verticalProfileId : ?Text;
    goal : ?Text;
    startDate : ?Int;
    endDate : ?Int;
    budget : ?Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  public type Sequence = {
    id : Text;
    campaignId : Text;
    sequenceName : Text;
    sequenceType : Text;
    status : Text;
    steps : [SequenceStep];
    verticalProfileId : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type SequenceStep = {
    stepNumber : Nat;
    stepType : Text;
    content : Text;
    delayHours : Nat;
    subject : ?Text;
    templateId : ?Text;
  };

  public type EmailTemplate = {
    id : Text;
    templateName : Text;
    templateType : Text;
    subject : Text;
    body : Text;
    verticalProfileId : ?Text;
    variables : [Text];
    complianceChecked : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type SMSTemplate = {
    id : Text;
    templateName : Text;
    templateType : Text;
    body : Text;
    verticalProfileId : ?Text;
    variables : [Text];
    complianceChecked : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type OutreachTask = {
    id : Text;
    campaignId : Text;
    taskType : Text;
    status : Text;
    recipientEmail : ?Text;
    recipientPhone : ?Text;
    scheduledAt : ?Int;
    sentAt : ?Int;
    content : Text;
    subject : ?Text;
    approvalRequestId : ?Text;
    verticalProfileId : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type CreateCampaignRequest = {
    clientBusinessId : Text;
    campaignName : Text;
    campaignType : Text;
    targetAudience : ?Text;
    verticalProfileId : ?Text;
    goal : ?Text;
    startDate : ?Int;
    endDate : ?Int;
    budget : ?Nat;
  };

  public type UpdateCampaignRequest = {
    campaignName : ?Text;
    campaignType : ?Text;
    status : ?Text;
    targetAudience : ?Text;
    goal : ?Text;
    startDate : ?Int;
    endDate : ?Int;
    budget : ?Nat;
  };

  public type CreateSequenceRequest = {
    campaignId : Text;
    sequenceName : Text;
    sequenceType : Text;
    steps : [SequenceStep];
    verticalProfileId : ?Text;
  };

  public type UpdateSequenceRequest = {
    sequenceName : ?Text;
    sequenceType : ?Text;
    status : ?Text;
    steps : ?[SequenceStep];
  };

  public type CreateEmailTemplateRequest = {
    templateName : Text;
    templateType : Text;
    subject : Text;
    body : Text;
    verticalProfileId : ?Text;
    variables : [Text];
  };

  public type CreateSMSTemplateRequest = {
    templateName : Text;
    templateType : Text;
    body : Text;
    verticalProfileId : ?Text;
    variables : [Text];
  };

  public type CreateOutreachTaskRequest = {
    campaignId : Text;
    taskType : Text;
    recipientEmail : ?Text;
    recipientPhone : ?Text;
    scheduledAt : ?Int;
    content : Text;
    subject : ?Text;
    verticalProfileId : ?Text;
  };

  public type CampaignResult = {
    #ok : Campaign;
    #err : Text;
  };

  public type CampaignListResult = {
    #ok : [Campaign];
    #err : Text;
  };

  public type SequenceResult = {
    #ok : Sequence;
    #err : Text;
  };

  public type SequenceListResult = {
    #ok : [Sequence];
    #err : Text;
  };

  public type EmailTemplateResult = {
    #ok : EmailTemplate;
    #err : Text;
  };

  public type EmailTemplateListResult = {
    #ok : [EmailTemplate];
    #err : Text;
  };

  public type SMSTemplateResult = {
    #ok : SMSTemplate;
    #err : Text;
  };

  public type SMSTemplateListResult = {
    #ok : [SMSTemplate];
    #err : Text;
  };

  public type OutreachTaskResult = {
    #ok : OutreachTask;
    #err : Text;
  };

  public type OutreachTaskListResult = {
    #ok : [OutreachTask];
    #err : Text;
  };
}
