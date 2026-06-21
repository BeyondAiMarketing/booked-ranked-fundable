import Time "mo:core/Time";

module {

  /// The Funded Readiness Agent tracks funding and business credit readiness.
  public type FundedReadinessState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    legalBusinessName : Text;
    ein : Text;
    entityType : Text;
    yearsInBusiness : Nat;
    monthlyRevenue : Nat;
    bankStatementsAvailable : Bool;
    creditScoreRange : Text;
    businessBankAccount : Bool;
    businessAddress : Text;
    website : Text;
    emailDomain : Text;
    dunsStatus : Text;
    experianBusinessStatus : Text;
    equifaxBusinessStatus : Text;
    tradeLines : Nat;
    existingDebt : Nat;
    equipmentNeeds : [Text];
    marketingCapitalNeed : Nat;
    taxReturnsAvailable : Bool;
    documentsUploaded : [Text];
    industrySpecificFundingNeeds : [Text];
    overallReadinessScore : Nat;
    credibilityScore : Nat;
    revenueReadinessScore : Nat;
    documentScore : Nat;
    actionPlan : [Text];
    approvalStatus : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to initialize funding readiness tracking.
  public type FundedReadinessInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    legalBusinessName : Text;
    entityType : Text;
    yearsInBusiness : Nat;
    monthlyRevenue : Nat;
  };

  /// Update for funding readiness progress.
  /// Generic aliases for lib/mixin compatibility
  public type Record = FundedReadinessState;
  public type CreateRequest = FundedReadinessInput;
  public type UpdateRequest = FundedReadinessUpdate;

  public type FundedReadinessUpdate = {
    ein : ?Text;
    entityType : ?Text;
    yearsInBusiness : ?Nat;
    monthlyRevenue : ?Nat;
    bankStatementsAvailable : ?Bool;
    creditScoreRange : ?Text;
    businessBankAccount : ?Bool;
    businessAddress : ?Text;
    website : ?Text;
    emailDomain : ?Text;
    dunsStatus : ?Text;
    experianBusinessStatus : ?Text;
    equifaxBusinessStatus : ?Text;
    tradeLines : ?Nat;
    existingDebt : ?Nat;
    equipmentNeeds : ?[Text];
    marketingCapitalNeed : ?Nat;
    taxReturnsAvailable : ?Bool;
    documentsUploaded : ?[Text];
    industrySpecificFundingNeeds : ?[Text];
    overallReadinessScore : ?Nat;
    credibilityScore : ?Nat;
    revenueReadinessScore : ?Nat;
    documentScore : ?Nat;
    actionPlan : ?[Text];
    approvalStatus : ?Text;
    updatedAt : ?Int;
  };

}
