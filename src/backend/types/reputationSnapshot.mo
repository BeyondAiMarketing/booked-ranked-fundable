module {

  /// A reputation snapshot capturing overall review health.
  public type ReputationSnapshot = {
    id              : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    totalReviews    : Nat;
    averageRating   : Float;
    fiveStarCount   : Nat;
    fourStarCount   : Nat;
    threeStarCount  : Nat;
    twoStarCount    : Nat;
    oneStarCount    : Nat;
    responseRate    : Float;
    avgResponseTime : Int;
    reviewVelocity  : Nat;
    sentimentScore  : Nat;
    competitorComparison : ?Text;
    criticalFlags   : [Text];
    recommendations : [Text];
    createdAt       : Int;
  };

}
