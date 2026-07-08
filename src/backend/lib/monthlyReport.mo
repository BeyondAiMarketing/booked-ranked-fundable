import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import T    "../types/monthlyReport";

module {

  public type State = {
    reports : Map.Map<Text, T.MonthlyReport>;
  };

  public func emptyState() : State = {
    reports = Map.empty();
  };

  /// Persist a monthly report.
  public func saveReport(state : State, report : T.MonthlyReport) : () {
    state.reports.add(report.id, report);
  };

  /// Retrieve a report by id.
  public func getReport(state : State, id : Text) : ?T.MonthlyReport {
    state.reports.get(id);
  };

  /// Get all reports for a tenant.
  public func getReportsByTenant(state : State, tenantId : Text) : [T.MonthlyReport] {
    let result = List.empty<T.MonthlyReport>();
    for (r in state.reports.values()) {
      if (r.tenantId == tenantId) { result.add(r) };
    };
    result.toArray();
  };

  /// Get reports by status for a tenant.
  public func getReportsByStatus(state : State, tenantId : Text, status : T.ReportStatus) : [T.MonthlyReport] {
    let result = List.empty<T.MonthlyReport>();
    for (r in state.reports.values()) {
      if (r.tenantId == tenantId and r.status == status) { result.add(r) };
    };
    result.toArray();
  };

  /// Merge a partial update into an existing report.
  public func updateReport(state : State, id : Text, update : T.MonthlyReportUpdate) : Bool {
    switch (state.reports.get(id)) {
      case (?existing) {
        let updated : T.MonthlyReport = {
          existing with
          summary         = switch (update.summary)         { case (?v) v; case null existing.summary         };
          keyFindings     = switch (update.keyFindings)     { case (?v) v; case null existing.keyFindings     };
          recommendations = switch (update.recommendations) { case (?v) v; case null existing.recommendations };
          nextMonthStrategy = switch (update.nextMonthStrategy) { case (?v) v; case null existing.nextMonthStrategy };
          status          = switch (update.status)          { case (?v) v; case null existing.status          };
          sentAt          = switch (update.sentAt)          { case (?v) ?v; case null existing.sentAt          };
          updatedAt       = Time.now();
        };
        state.reports.add(id, updated);
        true;
      };
      case null false;
    };
  };

  /// Remove a report.
  public func removeReport(state : State, id : Text) : Bool {
    switch (state.reports.get(id)) {
      case (?_) { state.reports.remove(id); true };
      case null false;
    };
  };

};
