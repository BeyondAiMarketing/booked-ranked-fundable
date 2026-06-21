module ComplianceTypes {
  public type ComplianceRule = {
    id : Text;
    ruleName : Text;
    ruleType : Text;
    verticalProfileId : ?Text;
    description : Text;
    prohibitedClaims : [Text];
    requiredDisclaimers : [Text];
    approvalRequired : Bool;
    approvalTier : Text;
    riskLevel : Text;
    autoFlagTriggers : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  public type ConsentLog = {
    id : Text;
    contactId : Text;
    consentType : Text;
    channel : Text;
    granted : Bool;
    grantedAt : Int;
    revokedAt : ?Int;
    source : Text;
    ipAddress : ?Text;
    notes : ?Text;
  };

  public type UnsubscribeRecord = {
    id : Text;
    email : ?Text;
    phone : ?Text;
    channel : Text;
    unsubscribedAt : Int;
    source : Text;
    reason : ?Text;
  };

  public type ComplianceCheckResult = {
    passed : Bool;
    ruleId : Text;
    ruleName : Text;
    severity : Text;
    message : Text;
    suggestedFix : ?Text;
  };

  public type CreateComplianceRuleRequest = {
    ruleName : Text;
    ruleType : Text;
    verticalProfileId : ?Text;
    description : Text;
    prohibitedClaims : [Text];
    requiredDisclaimers : [Text];
    approvalRequired : Bool;
    approvalTier : Text;
    riskLevel : Text;
    autoFlagTriggers : [Text];
  };

  public type UpdateComplianceRuleRequest = {
    ruleName : ?Text;
    ruleType : ?Text;
    verticalProfileId : ?Text;
    description : ?Text;
    prohibitedClaims : ?[Text];
    requiredDisclaimers : ?[Text];
    approvalRequired : ?Bool;
    approvalTier : ?Text;
    riskLevel : ?Text;
    autoFlagTriggers : ?[Text];
  };

  public type ComplianceRuleResult = {
    #ok : ComplianceRule;
    #err : Text;
  };

  public type ComplianceRuleListResult = {
    #ok : [ComplianceRule];
    #err : Text;
  };

  public type ConsentLogResult = {
    #ok : ConsentLog;
    #err : Text;
  };

  public type UnsubscribeResult = {
    #ok : UnsubscribeRecord;
    #err : Text;
  };

  public type ComplianceCheckResults = {
    #ok : [ComplianceCheckResult];
    #err : Text;
  };
}
