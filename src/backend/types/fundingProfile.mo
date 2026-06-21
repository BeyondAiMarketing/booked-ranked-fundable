module FundingProfileTypes {
  public type FundingProfile = {
    id : Text;
    clientBusinessId : Text;
    legalBusinessName : Text;
    ein : ?Text;
    entityType : ?Text;
    yearsInBusiness : ?Nat;
    monthlyRevenue : ?Nat;
    bankStatementsAvailable : Bool;
    creditScoreRange : ?Text;
    businessBankAccount : Bool;
    businessAddress : ?Text;
    website : ?Text;
    emailDomain : ?Text;
    dunsStatus : ?Text;
    experianBusinessStatus : ?Text;
    equifaxBusinessStatus : ?Text;
    tradeLines : ?Nat;
    existingDebt : ?Nat;
    equipmentNeeds : ?Text;
    marketingCapitalNeed : ?Nat;
    taxReturnsAvailable : Bool;
    documentsUploaded : [Text];
    industrySpecificFundingNeeds : ?Text;
    readinessScore : ?Nat;
    status : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type FundingDocument = {
    id : Text;
    profileId : Text;
    documentType : Text;
    documentName : Text;
    documentUrl : ?Text;
    status : Text;
    uploadedAt : Int;
  };

  public type FundingReadinessSnapshot = {
    id : Text;
    profileId : Text;
    snapshotDate : Int;
    overallScore : Nat;
    creditScore : Nat;
    revenueScore : Nat;
    documentationScore : Nat;
    businessAgeScore : Nat;
    recommendations : [Text];
  };

  public type CreateFundingProfileRequest = {
    clientBusinessId : Text;
    legalBusinessName : Text;
    ein : ?Text;
    entityType : ?Text;
    yearsInBusiness : ?Nat;
    monthlyRevenue : ?Nat;
    bankStatementsAvailable : Bool;
    creditScoreRange : ?Text;
    businessBankAccount : Bool;
    businessAddress : ?Text;
    website : ?Text;
    emailDomain : ?Text;
    dunsStatus : ?Text;
    experianBusinessStatus : ?Text;
    equifaxBusinessStatus : ?Text;
    tradeLines : ?Nat;
    existingDebt : ?Nat;
    equipmentNeeds : ?Text;
    marketingCapitalNeed : ?Nat;
    taxReturnsAvailable : Bool;
    industrySpecificFundingNeeds : ?Text;
  };

  public type UpdateFundingProfileRequest = {
    legalBusinessName : ?Text;
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
    equipmentNeeds : ?Text;
    marketingCapitalNeed : ?Nat;
    taxReturnsAvailable : ?Bool;
    industrySpecificFundingNeeds : ?Text;
  };

  public type FundingProfileResult = {
    #ok : FundingProfile;
    #err : Text;
  };

  public type FundingProfileListResult = {
    #ok : [FundingProfile];
    #err : Text;
  };

  public type FundingDocumentResult = {
    #ok : FundingDocument;
    #err : Text;
  };

  public type FundingReadinessSnapshotResult = {
    #ok : FundingReadinessSnapshot;
    #err : Text;
  };
}
