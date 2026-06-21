import MultiLocationRollupLib "../lib/multiLocationRollup";
import T                      "../types/multiLocationRollup";

mixin (multiLocationRollupState : MultiLocationRollupLib.State) {

  /// Create or replace a multi-location rollup report.
  public shared ({ caller = _ }) func createMultiLocationReport(report : T.MultiLocationReport) : async { #ok : Text; #err : Text } {
    MultiLocationRollupLib.saveReport(multiLocationRollupState, report);
    #ok "Multi-location report saved.";
  };

  /// Retrieve a multi-location report by id.
  public shared ({ caller = _ }) func getMultiLocationReport(id : Text) : async { #ok : T.MultiLocationReport; #err : Text } {
    switch (MultiLocationRollupLib.getReport(multiLocationRollupState, id)) {
      case (?r)  { #ok r };
      case null  { #err ("No multi-location report found for id: " # id) };
    };
  };

  /// Get all multi-location reports for a client business.
  public shared ({ caller = _ }) func getMultiLocationReportsByClient(clientBusinessId : Text) : async { #ok : [T.MultiLocationReport]; #err : Text } {
    #ok (MultiLocationRollupLib.getReportsByClient(multiLocationRollupState, clientBusinessId));
  };

  /// Get the most recent multi-location report for a client business.
  public shared ({ caller = _ }) func getLatestMultiLocationReport(clientBusinessId : Text) : async { #ok : ?T.MultiLocationReport; #err : Text } {
    #ok (MultiLocationRollupLib.getLatestReport(multiLocationRollupState, clientBusinessId));
  };

  /// Apply a partial update to a multi-location report.
  public shared ({ caller = _ }) func updateMultiLocationReport(id : Text, update : T.MultiLocationReportUpdate) : async { #ok : Text; #err : Text } {
    if (MultiLocationRollupLib.updateReport(multiLocationRollupState, id, update)) {
      #ok "Multi-location report updated.";
    } else {
      #err ("No multi-location report found for id: " # id);
    };
  };

  /// Remove a multi-location report.
  public shared ({ caller = _ }) func removeMultiLocationReport(id : Text) : async { #ok : Text; #err : Text } {
    if (MultiLocationRollupLib.removeReport(multiLocationRollupState, id)) {
      #ok "Multi-location report removed.";
    } else {
      #err ("No multi-location report found for id: " # id);
    };
  };

}
