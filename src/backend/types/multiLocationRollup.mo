module {

  /// Summary of a single location within a multi-location rollup report.
  public type LocationSummary = {
    locationId      : Text;
    locationName    : Text;
    city            : Text;
    score           : Nat;
    reviewCount     : Nat;
    avgRating       : Float;
    rankingPosition : Nat;
  };

  /// Trend direction for score metrics over time.
  public type TrendDirection = {
    #up;
    #down;
    #flat;
  };

  /// A multi-location rollup report aggregating performance across all brand locations.
  public type MultiLocationReport = {
    id              : Text;
    clientBusinessId : Text;
    brandName       : Text;
    locationCount   : Nat;
    locations       : [LocationSummary];
    overallScore    : Nat;
    rankingTrend    : TrendDirection;
    reviewTrend     : TrendDirection;
    citationTrend   : TrendDirection;
    createdAt       : Int;
  };

  /// Partial update for a multi-location rollup report.
  public type MultiLocationReportUpdate = {
    brandName       : ?Text;
    locationCount   : ?Nat;
    locations       : ?[LocationSummary];
    overallScore    : ?Nat;
    rankingTrend    : ?TrendDirection;
    reviewTrend     : ?TrendDirection;
    citationTrend   : ?TrendDirection;
  };

}
