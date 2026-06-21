import Time "mo:core/Time";

module {

  /// A performance metric for the Monthly Performance Review Agent.
  public type PerformanceMetric = {
    metricName : Text;
    value : Nat;
    previousValue : Nat;
    changePercent : Int;
    trend : Text;
  };

  /// The Monthly Performance Review Agent reviews and strategizes monthly.
  public type MonthlyPerformanceReviewState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    reviewMonth : Text;
    metrics : [PerformanceMetric];
    topPerformers : [Text];
    underPerformers : [Text];
    contentInsights : [Text];
    strategyChanges : [Text];
    nextMonthRecommendations : [Text];
    approvalStatus : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to create a monthly performance review.
  public type MonthlyPerformanceReviewInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    reviewMonth : Text;
    metrics : [PerformanceMetric];
  };

  /// Update for monthly performance review.
  public type MonthlyPerformanceReviewUpdate = {
    metrics : ?[PerformanceMetric];
    topPerformers : ?[Text];
    underPerformers : ?[Text];
    contentInsights : ?[Text];
    strategyChanges : ?[Text];
    nextMonthRecommendations : ?[Text];
    approvalStatus : ?Text;
    updatedAt : ?Int;
  };

}
