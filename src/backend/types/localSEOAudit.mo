module {

  /// Severity level for audit findings.
  public type AuditSeverity = {
    #critical;
    #important;
    #monitor;
    #good;
  };

  /// A single finding in a local SEO audit.
  public type LocalSEOFinding = {
    category        : Text;
    severity        : AuditSeverity;
    description     : Text;
    recommendation  : Text;
    impactScore     : Nat;
  };

  /// Status of a local SEO audit.
  public type LocalSEOAuditStatus = {
    #pending;
    #in_progress;
    #completed;
    #failed;
  };

  /// A comprehensive local SEO audit for a client business.
  public type LocalSEOAudit = {
    id              : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    status          : LocalSEOAuditStatus;
    overallScore    : Nat;
    gbpScore        : Nat;
    citationScore   : Nat;
    reviewScore     : Nat;
    websiteScore    : Nat;
    competitorScore : Nat;
    findings        : [LocalSEOFinding];
    criticalCount   : Nat;
    importantCount  : Nat;
    monitorCount    : Nat;
    goodCount       : Nat;
    topQuickWins    : [Text];
    strategicRecommendations : [Text];
    completedAt     : ?Int;
    createdAt       : Int;
  };

  /// Partial update for a local SEO audit.
  public type LocalSEOAuditUpdate = {
    status          : ?LocalSEOAuditStatus;
    overallScore    : ?Nat;
    gbpScore        : ?Nat;
    citationScore   : ?Nat;
    reviewScore     : ?Nat;
    websiteScore    : ?Nat;
    competitorScore : ?Nat;
    findings        : ?[LocalSEOFinding];
    criticalCount   : ?Nat;
    importantCount  : ?Nat;
    monitorCount    : ?Nat;
    goodCount       : ?Nat;
    topQuickWins    : ?[Text];
    strategicRecommendations : ?[Text];
    completedAt     : ?Int;
  };

}
