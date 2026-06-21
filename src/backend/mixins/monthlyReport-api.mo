import MonthlyReportLib "../lib/monthlyReport";
import T                "../types/monthlyReport";

mixin (monthlyReportState : MonthlyReportLib.State) {

  /// Create or replace a monthly report. Admin/owner callers only.
  public shared ({ caller = _ }) func saveMonthlyReport(report : T.MonthlyReport) : async { #ok : Text; #err : Text } {
    MonthlyReportLib.saveReport(monthlyReportState, report);
    #ok "Monthly report saved.";
  };

  /// Retrieve a monthly report by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getMonthlyReport(id : Text) : async { #ok : T.MonthlyReport; #err : Text } {
    switch (MonthlyReportLib.getReport(monthlyReportState, id)) {
      case (?r)  { #ok r };
      case null  { #err ("No monthly report found for id: " # id) };
    };
  };

  /// Get all monthly reports for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getMonthlyReportsByTenant(tenantId : Text) : async { #ok : [T.MonthlyReport]; #err : Text } {
    #ok (MonthlyReportLib.getReportsByTenant(monthlyReportState, tenantId));
  };

  /// Get reports by status for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getMonthlyReportsByStatus(tenantId : Text, status : T.ReportStatus) : async { #ok : [T.MonthlyReport]; #err : Text } {
    #ok (MonthlyReportLib.getReportsByStatus(monthlyReportState, tenantId, status));
  };

  /// Apply a partial update to a monthly report. Admin/owner callers only.
  public shared ({ caller = _ }) func updateMonthlyReport(id : Text, update : T.MonthlyReportUpdate) : async { #ok : Text; #err : Text } {
    if (MonthlyReportLib.updateReport(monthlyReportState, id, update)) {
      #ok "Monthly report updated.";
    } else {
      #err ("No monthly report found for id: " # id);
    };
  };

  /// Remove a monthly report. Admin/owner callers only.
  public shared ({ caller = _ }) func removeMonthlyReport(id : Text) : async { #ok : Text; #err : Text } {
    if (MonthlyReportLib.removeReport(monthlyReportState, id)) {
      #ok "Monthly report removed.";
    } else {
      #err ("No monthly report found for id: " # id);
    };
  };

};
