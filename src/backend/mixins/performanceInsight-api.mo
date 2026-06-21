import PerformanceInsightLib "../lib/performanceInsight";
import T                     "../types/performanceInsight";

mixin (performanceInsightState : PerformanceInsightLib.State) {

  /// Create or replace a performance insight. Admin/owner callers only.
  public shared ({ caller = _ }) func savePerformanceInsight(insight : T.PerformanceInsight) : async { #ok : Text; #err : Text } {
    PerformanceInsightLib.saveInsight(performanceInsightState, insight);
    #ok "Performance insight saved.";
  };

  /// Retrieve a performance insight by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getPerformanceInsight(id : Text) : async { #ok : T.PerformanceInsight; #err : Text } {
    switch (PerformanceInsightLib.getInsight(performanceInsightState, id)) {
      case (?i)  { #ok i };
      case null  { #err ("No performance insight found for id: " # id) };
    };
  };

  /// Get all insights for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getPerformanceInsightsByTenant(tenantId : Text) : async { #ok : [T.PerformanceInsight]; #err : Text } {
    #ok (PerformanceInsightLib.getInsightsByTenant(performanceInsightState, tenantId));
  };

  /// Get insights linked to a report. Admin/owner callers only.
  public shared ({ caller = _ }) func getPerformanceInsightsByReport(reportId : Text) : async { #ok : [T.PerformanceInsight]; #err : Text } {
    #ok (PerformanceInsightLib.getInsightsByReport(performanceInsightState, reportId));
  };

  /// Get best-performing insights for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getBestPerformers(tenantId : Text) : async { #ok : [T.PerformanceInsight]; #err : Text } {
    #ok (PerformanceInsightLib.getBestPerformers(performanceInsightState, tenantId));
  };

  /// Save or update best-performer memory. Admin/owner callers only.
  public shared ({ caller = _ }) func saveBestPerformerMemory(mem : T.BestPerformerMemory) : async { #ok : Text; #err : Text } {
    PerformanceInsightLib.saveMemory(performanceInsightState, mem);
    #ok "Best performer memory saved.";
  };

  /// Get best-performer memory for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getBestPerformerMemory(tenantId : Text) : async { #ok : T.BestPerformerMemory; #err : Text } {
    switch (PerformanceInsightLib.getMemory(performanceInsightState, tenantId)) {
      case (?m)  { #ok m };
      case null  { #err ("No best performer memory found for tenant: " # tenantId) };
    };
  };

};
