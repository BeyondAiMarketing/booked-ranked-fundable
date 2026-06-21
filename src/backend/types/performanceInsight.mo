module {

  /// A single performance insight entry derived from content/campaign review.
  public type PerformanceInsight = {
    id              : Text;
    tenantId        : Text;
    reportId        : Text;
    metricName      : Text;
    metricValue     : Text;
    platform        : Text;
    period          : Text;
    insight         : Text;
    recommendation  : Text;
    isBestPerformer : Bool;
    createdAt       : Int;
  };

  /// Aggregated best-performer memory for a tenant.
  public type BestPerformerMemory = {
    tenantId        : Text;
    topPosts        : [Text];
    topPlatforms    : [Text];
    topPillars      : [Text];
    topFormats      : [Text];
    topCtAs         : [Text];
    avgEngagement   : Nat;
    avgReach        : Nat;
    avgClicks       : Nat;
    lastUpdatedAt   : Int;
  };

};
