module {

  /// Report type for local SEO / ranked reporting.
  public type ReportType = {
    #weekly;
    #monthly;
    #quarterly;
    #prospect_audit;
    #competitor_monitor;
  };

  /// A single section within a local report.
  public type ReportSection = {
    title           : Text;
    score           : Nat;
    findings        : [Text];
    recommendations : [Text];
  };

  /// Status of a local report.
  public type LocalReportStatus = {
    #draft;
    #pending_review;
    #approved;
    #sent;
    #archived;
  };

  /// A comprehensive local SEO / ranked report for a client business.
  public type LocalReport = {
    id                : Text;
    clientBusinessId  : Text;
    verticalProfileId : Text;
    reportType        : ReportType;
    period            : Text;
    status            : LocalReportStatus;
    overallScore      : Nat;
    sections          : [ReportSection];
    summary           : Text;
    createdAt         : Int;
    updatedAt         : Int;
    sentAt            : ?Int;
  };

  /// Partial update for a local report.
  public type LocalReportUpdate = {
    status       : ?LocalReportStatus;
    overallScore : ?Nat;
    sections     : ?[ReportSection];
    summary      : ?Text;
    sentAt       : ?Int;
  };

}
