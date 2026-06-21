module {

  /// A competitor's local SEO metric snapshot.
  public type CompetitorMetric = {
    name            : Text;
    website         : Text;
    gbpRating       : Float;
    reviewCount     : Nat;
    gbpPostFrequency : Nat;
    citationCount   : Nat;
    websiteSpeed    : ?Nat;
    keywordOverlap  : [Text];
    strengths       : [Text];
    weaknesses      : [Text];
  };

  /// Status of a competitor audit.
  public type CompetitorAuditStatus = {
    #pending;
    #in_progress;
    #completed;
    #failed;
  };

  /// A comprehensive competitor audit for a client business.
  public type CompetitorAudit = {
    id              : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    status          : CompetitorAuditStatus;
    targetLocation  : Text;
    primaryKeyword  : Text;
    competitors     : [CompetitorMetric];
    marketPosition  : Nat;
    gapAnalysis     : [Text];
    opportunities   : [Text];
    threats         : [Text];
    recommendations : [Text];
    completedAt     : ?Int;
    createdAt       : Int;
  };

  /// Partial update for a competitor audit.
  public type CompetitorAuditUpdate = {
    status          : ?CompetitorAuditStatus;
    competitors     : ?[CompetitorMetric];
    marketPosition  : ?Nat;
    gapAnalysis     : ?[Text];
    opportunities   : ?[Text];
    threats         : ?[Text];
    recommendations : ?[Text];
    completedAt     : ?Int;
  };

}
