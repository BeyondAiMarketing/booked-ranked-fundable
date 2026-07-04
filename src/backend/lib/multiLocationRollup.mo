import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import T    "../types/multiLocationRollup";

module {

  public type State = {
    reports : Map.Map<Text, T.MultiLocationReport>;
  };

  public func emptyState() : State = {
    reports = Map.empty();
  };

  /// Persist a multi-location rollup report.
  public func saveReport(state : State, report : T.MultiLocationReport) : () {
    state.reports.add(report.id, report);
  };

  /// Retrieve a report by id.
  public func getReport(state : State, id : Text) : ?T.MultiLocationReport {
    state.reports.get(id);
  };

  /// Get all reports for a client business.
  public func getReportsByClient(state : State, clientBusinessId : Text) : [T.MultiLocationReport] {
    let result = List.empty<T.MultiLocationReport>();
    for (r in state.reports.values()) {
      if (r.clientBusinessId == clientBusinessId) { result.add(r) };
    };
    result.toArray();
  };

  /// Get the most recent report for a client business.
  public func getLatestReport(state : State, clientBusinessId : Text) : ?T.MultiLocationReport {
    let clientReports = getReportsByClient(state, clientBusinessId);
    if (clientReports.size() == 0) {
      return null;
    };
    var latest : T.MultiLocationReport = clientReports[0];
    for (r in clientReports.vals()) {
      if (r.createdAt > latest.createdAt) { latest := r };
    };
    ?latest;
  };

  /// Merge a partial update into an existing report.
  public func updateReport(state : State, id : Text, update : T.MultiLocationReportUpdate) : Bool {
    switch (state.reports.get(id)) {
      case (?existing) {
        let updated : T.MultiLocationReport = {
          existing with
          brandName     = switch (update.brandName)     { case (?v) v; case null existing.brandName     };
          locationCount = switch (update.locationCount) { case (?v) v; case null existing.locationCount };
          locations     = switch (update.locations)     { case (?v) v; case null existing.locations     };
          overallScore  = switch (update.overallScore)  { case (?v) v; case null existing.overallScore  };
          rankingTrend  = switch (update.rankingTrend)  { case (?v) v; case null existing.rankingTrend  };
          reviewTrend   = switch (update.reviewTrend)   { case (?v) v; case null existing.reviewTrend   };
          citationTrend = switch (update.citationTrend) { case (?v) v; case null existing.citationTrend };
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

  /// Compute an overall score from location summaries (simple average of location scores).
  public func computeOverallScore(locations : [T.LocationSummary]) : Nat {
    if (locations.size() == 0) { return 0 };
    var total : Nat = 0;
    for (loc in locations.vals()) { total += loc.score };
    total / locations.size();
  };

  /// Compute trend direction by comparing two values.
  public func computeTrend(current : Nat, previous : Nat) : T.TrendDirection {
    if (current > previous) { #up } else if (current < previous) { #down } else { #flat };
  };

}
