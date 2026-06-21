module {

  /// Status of a monthly performance report.
  public type ReportStatus = {
    #draft;
    #pending_review;
    #approved;
    #sent;
    #archived;
  };

  /// A monthly performance review report.
  public type MonthlyReport = {
    id              : Text;
    tenantId        : Text;
    month           : Text;
    year            : Nat;
    period          : Text;
    status          : ReportStatus;
    summary         : Text;
    keyFindings     : [Text];
    recommendations : [Text];
    nextMonthStrategy : Text;
    insightIds      : [Text];
    createdAt       : Int;
    updatedAt       : Int;
    sentAt          : ?Int;
  };

  /// Partial update for a monthly report.
  public type MonthlyReportUpdate = {
    summary         : ?Text;
    keyFindings     : ?[Text];
    recommendations : ?[Text];
    nextMonthStrategy : ?Text;
    status          : ?ReportStatus;
    sentAt          : ?Int;
  };

};
