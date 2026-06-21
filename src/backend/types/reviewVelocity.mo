module {

  /// A review velocity snapshot tracking review acquisition rate.
  public type ReviewVelocity = {
    id              : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    periodStart     : Int;
    periodEnd       : Int;
    totalReviews    : Nat;
    newReviews      : Nat;
    averageRating   : Float;
    responseRate    : Float;
    responseTimeAvg : Int;
    competitorAvg   : ?Float;
    velocityScore   : Nat;
    trendDirection  : TrendDirection;
    createdAt       : Int;
  };

  /// Trend direction for review velocity.
  public type TrendDirection = {
    #rising;
    #stable;
    #declining;
    #critical;
  };

}
