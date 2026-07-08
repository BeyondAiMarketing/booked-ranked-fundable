import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import T    "../types/localReporting";

module {

  public type State = {
    reports : Map.Map<Text, T.LocalReport>;
  };

  public func emptyState() : State = {
    reports = Map.empty();
  };

  /// Persist a local report.
  public func saveReport(state : State, report : T.LocalReport) : () {
    state.reports.add(report.id, report);
  };

  /// Retrieve a report by id.
  public func getReport(state : State, id : Text) : ?T.LocalReport {
    state.reports.get(id);
  };

  /// Get all reports for a client business.
  public func getReportsByClient(state : State, clientBusinessId : Text) : [T.LocalReport] {
    let result = List.empty<T.LocalReport>();
    for (r in state.reports.values()) {
      if (r.clientBusinessId == clientBusinessId) { result.add(r) };
    };
    result.toArray();
  };

  /// Get reports by type for a client.
  public func getReportsByType(state : State, clientBusinessId : Text, reportType : T.ReportType) : [T.LocalReport] {
    let result = List.empty<T.LocalReport>();
    for (r in state.reports.values()) {
      if (r.clientBusinessId == clientBusinessId and r.reportType == reportType) { result.add(r) };
    };
    result.toArray();
  };

  /// Get reports by status for a client.
  public func getReportsByStatus(state : State, clientBusinessId : Text, status : T.LocalReportStatus) : [T.LocalReport] {
    let result = List.empty<T.LocalReport>();
    for (r in state.reports.values()) {
      if (r.clientBusinessId == clientBusinessId and r.status == status) { result.add(r) };
    };
    result.toArray();
  };

  /// Merge a partial update into an existing report.
  public func updateReport(state : State, id : Text, update : T.LocalReportUpdate) : Bool {
    switch (state.reports.get(id)) {
      case (?existing) {
        let updated : T.LocalReport = {
          existing with
          status       = switch (update.status)       { case (?v) v; case null existing.status       };
          overallScore = switch (update.overallScore) { case (?v) v; case null existing.overallScore };
          sections     = switch (update.sections)     { case (?v) v; case null existing.sections     };
          summary      = switch (update.summary)      { case (?v) v; case null existing.summary      };
          sentAt       = switch (update.sentAt)       { case (?v) ?v; case null existing.sentAt       };
          updatedAt    = Time.now();
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

}
