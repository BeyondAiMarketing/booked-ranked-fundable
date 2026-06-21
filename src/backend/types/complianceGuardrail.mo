import Time "mo:core/Time";

module {

  /// Compliance rule type for the Compliance Guardrail Agent.
  public type ComplianceRuleType = {
    #legal;
    #medical;
    #dental;
    #financial;
    #funding;
    #sms;
    #cold_email;
    #ranking_claim;
    #social;
    #general;
  };

  /// A compliance check result.
  public type ComplianceCheck = {
    ruleType : ComplianceRuleType;
    ruleName : Text;
    passed : Bool;
    severity : Text;
    message : Text;
    suggestedFix : Text;
  };

  /// The Compliance Guardrail Agent enforces compliance rules.
  public type ComplianceGuardrailState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    contentType : Text;
    contentId : Text;
    checks : [ComplianceCheck];
    overallPass : Bool;
    blockingIssues : [Text];
    warnings : [Text];
    approvedWithConditions : Bool;
    conditions : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to run compliance checks.
  public type ComplianceGuardrailInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    contentType : Text;
    contentId : Text;
    contentBody : Text;
    industry : Text;
  };

  /// Update for compliance check results.
  /// Generic aliases for lib/mixin compatibility
  public type Record = ComplianceGuardrailState;
  public type CreateRequest = ComplianceGuardrailInput;
  public type UpdateRequest = ComplianceGuardrailUpdate;

  public type ComplianceGuardrailUpdate = {
    checks : ?[ComplianceCheck];
    overallPass : ?Bool;
    blockingIssues : ?[Text];
    warnings : ?[Text];
    approvedWithConditions : ?Bool;
    conditions : ?[Text];
    updatedAt : ?Int;
  };

}
