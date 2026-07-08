import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import T    "../types/performanceInsight";

module {

  public type State = {
    insights : Map.Map<Text, T.PerformanceInsight>;
    memory   : Map.Map<Text, T.BestPerformerMemory>;
  };

  public func emptyState() : State = {
    insights = Map.empty();
    memory   = Map.empty();
  };

  // ---- INSIGHTS ----

  public func saveInsight(state : State, insight : T.PerformanceInsight) : () {
    state.insights.add(insight.id, insight);
  };

  public func getInsight(state : State, id : Text) : ?T.PerformanceInsight {
    state.insights.get(id);
  };

  public func getInsightsByTenant(state : State, tenantId : Text) : [T.PerformanceInsight] {
    let result = List.empty<T.PerformanceInsight>();
    for (i in state.insights.values()) {
      if (i.tenantId == tenantId) { result.add(i) };
    };
    result.toArray();
  };

  public func getInsightsByReport(state : State, reportId : Text) : [T.PerformanceInsight] {
    let result = List.empty<T.PerformanceInsight>();
    for (i in state.insights.values()) {
      if (i.reportId == reportId) { result.add(i) };
    };
    result.toArray();
  };

  public func getBestPerformers(state : State, tenantId : Text) : [T.PerformanceInsight] {
    let result = List.empty<T.PerformanceInsight>();
    for (i in state.insights.values()) {
      if (i.tenantId == tenantId and i.isBestPerformer) { result.add(i) };
    };
    result.toArray();
  };

  // ---- BEST PERFORMER MEMORY ----

  public func saveMemory(state : State, mem : T.BestPerformerMemory) : () {
    state.memory.add(mem.tenantId, mem);
  };

  public func getMemory(state : State, tenantId : Text) : ?T.BestPerformerMemory {
    state.memory.get(tenantId);
  };

};
