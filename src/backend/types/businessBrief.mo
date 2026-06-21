import Time "mo:core/Time";

module {
  public type PerformanceHistoryEntry = Text;  // deferred: stable compat
  public type LocalSEOHistoryEntry = Text;  // deferred: stable compat
  public type ReviewHistoryEntry = Text;  // deferred: stable compat
  public type ContentHistoryEntry = Text;  // deferred: stable compat
  public type FundingHistoryEntry = Text;  // deferred: stable compat

  public type BusinessBrief = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    businessName : Text;
    locationName : Text;
    website : Text;
    primaryKeyword : Text;
    serviceArea : Text;
    targetLocations : [Text];
    services : [Text];
    currentFindings : [Text];
    criticalFindings : [Text];
    importantFindings : [Text];
    monitorFindings : [Text];
    toolsRun : [Text];
    deliverables : [Text];
    nextAction : Text;
    sessionLog : [Text];
    approvalConfig : Text;
    performanceHistory : [PerformanceHistoryEntry];
    localSEOHistory : [LocalSEOHistoryEntry];
    reviewHistory : [ReviewHistoryEntry];
    contentHistory : [ContentHistoryEntry];
    fundingHistory : [FundingHistoryEntry];
    lastUpdated : Int;
  };

  public type BusinessBriefUpdate = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    businessName : Text;
    locationName : Text;
    website : Text;
    primaryKeyword : Text;
    serviceArea : Text;
    targetLocations : [Text];
    services : [Text];
    currentFindings : [Text];
    criticalFindings : [Text];
    importantFindings : [Text];
    monitorFindings : [Text];
    toolsRun : [Text];
    deliverables : [Text];
    nextAction : Text;
    sessionLog : [Text];
    approvalConfig : Text;
    performanceHistory : [PerformanceHistoryEntry];
    localSEOHistory : [LocalSEOHistoryEntry];
    reviewHistory : [ReviewHistoryEntry];
    contentHistory : [ContentHistoryEntry];
    fundingHistory : [FundingHistoryEntry];
  };
}
