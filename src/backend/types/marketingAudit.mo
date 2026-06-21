import Time "mo:core/Time";

module {

  /// Audit category for marketing scoring.
  public type AuditCategory = {
    #ContentMessaging;
    #ConversionOptimization;
    #SEODiscoverability;
    #CompetitivePositioning;
    #BrandTrust;
    #GrowthStrategy;
  };

  /// A single category score with findings.
  public type MarketingAuditScore = {
    category : AuditCategory;
    weight : Nat;
    score : Nat;
    findings : [Text];
  };

  /// BRF breakdown scores.
  public type BRFScore = {
    bookedScore : Nat;
    rankedScore : Nat;
    fundedScore : Nat;
    overallScore : Nat;
    bookedFindings : [Text];
    rankedFindings : [Text];
    fundedFindings : [Text];
  };

  /// Status of a marketing audit.
  public type MarketingAuditStatus = {
    #pending;
    #in_progress;
    #completed;
    #failed;
  };

  /// A comprehensive marketing audit for a client business.
  public type MarketingAudit = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    website : Text;
    industry : Text;
    serviceArea : Text;
    offer : Text;
    targetCustomer : Text;
    goals : [Text];
    knownCompetitors : [Text];
    leadValue : Nat;
    conversionGoal : Text;
    overallScore : Nat;
    grade : Text;
    executiveSummary : Text;
    categoryScores : [MarketingAuditScore];
    brfScore : BRFScore;
    quickWins : [Text];
    strategicRecommendations : [Text];
    longTermInitiatives : [Text];
    estimatedRevenueImpact : ?Text;
    recommendedPackage : Text;
    proposalReadySummary : Text;
    status : MarketingAuditStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Partial update for a marketing audit.
  public type MarketingAuditUpdate = {
    website : ?Text;
    industry : ?Text;
    serviceArea : ?Text;
    offer : ?Text;
    targetCustomer : ?Text;
    goals : ?[Text];
    knownCompetitors : ?[Text];
    leadValue : ?Nat;
    conversionGoal : ?Text;
    overallScore : ?Nat;
    grade : ?Text;
    executiveSummary : ?Text;
    categoryScores : ?[MarketingAuditScore];
    brfScore : ?BRFScore;
    quickWins : ?[Text];
    strategicRecommendations : ?[Text];
    longTermInitiatives : ?[Text];
    estimatedRevenueImpact : ?Text;
    recommendedPackage : ?Text;
    proposalReadySummary : ?Text;
    status : ?MarketingAuditStatus;
    updatedAt : ?Int;
  };

  /// Input for creating a new marketing audit.
  public type MarketingAuditInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    website : Text;
    industry : Text;
    serviceArea : Text;
    offer : Text;
    targetCustomer : Text;
    goals : [Text];
    knownCompetitors : [Text];
    leadValue : Nat;
    conversionGoal : Text;
  };

}
