import LocalReportingLib "../lib/localReporting";
import T                "../types/localReporting";

mixin (localReportingState : LocalReportingLib.State) {

  /// Create or replace a local report. Admin/owner callers only.
  public shared ({ caller = _ }) func saveLocalReport(report : T.LocalReport) : async { #ok : Text; #err : Text } {
    LocalReportingLib.saveReport(localReportingState, report);
    #ok "Local report saved.";
  };

  /// Retrieve a local report by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getLocalReport(id : Text) : async { #ok : T.LocalReport; #err : Text } {
    switch (LocalReportingLib.getReport(localReportingState, id)) {
      case (?r)  { #ok r };
      case null  { #err ("No local report found for id: " # id) };
    };
  };

  /// Get all local reports for a client business. Admin/owner callers only.
  public shared ({ caller = _ }) func getLocalReportsByClient(clientBusinessId : Text) : async { #ok : [T.LocalReport]; #err : Text } {
    #ok (LocalReportingLib.getReportsByClient(localReportingState, clientBusinessId));
  };

  /// Get local reports by type for a client. Admin/owner callers only.
  public shared ({ caller = _ }) func getLocalReportsByType(clientBusinessId : Text, reportType : T.ReportType) : async { #ok : [T.LocalReport]; #err : Text } {
    #ok (LocalReportingLib.getReportsByType(localReportingState, clientBusinessId, reportType));
  };

  /// Get local reports by status for a client. Admin/owner callers only.
  public shared ({ caller = _ }) func getLocalReportsByStatus(clientBusinessId : Text, status : T.LocalReportStatus) : async { #ok : [T.LocalReport]; #err : Text } {
    #ok (LocalReportingLib.getReportsByStatus(localReportingState, clientBusinessId, status));
  };

  /// Apply a partial update to a local report. Admin/owner callers only.
  public shared ({ caller = _ }) func updateLocalReport(id : Text, update : T.LocalReportUpdate) : async { #ok : Text; #err : Text } {
    if (LocalReportingLib.updateReport(localReportingState, id, update)) {
      #ok "Local report updated.";
    } else {
      #err ("No local report found for id: " # id);
    };
  };

  /// Remove a local report. Admin/owner callers only.
  public shared ({ caller = _ }) func removeLocalReport(id : Text) : async { #ok : Text; #err : Text } {
    if (LocalReportingLib.removeReport(localReportingState, id)) {
      #ok "Local report removed.";
    } else {
      #err ("No local report found for id: " # id);
    };
  };

}
