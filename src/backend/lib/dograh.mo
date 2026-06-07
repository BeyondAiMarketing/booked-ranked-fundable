import Map  "mo:core/Map";
import List "mo:core/List";
import T    "../types/dograh";

module {

  public type State = {
    config      : Map.Map<Text, T.DograhConfig>;
    agentsCache : Map.Map<Text, T.DograhAgent>;
    roofingTpl  : Map.Map<Text, T.RoofingTemplate>;
    syncMeta    : Map.Map<Text, Int>;
  };

  public func emptyState() : State = {
    config      = Map.empty<Text, T.DograhConfig>();
    agentsCache = Map.empty<Text, T.DograhAgent>();
    roofingTpl  = Map.empty<Text, T.RoofingTemplate>();
    syncMeta    = Map.empty<Text, Int>();
  };

  public func getConfig(state : State) : ?T.DograhConfig {
    state.config.get("main");
  };

  public func setConfig(state : State, cfg : T.DograhConfig) : () {
    state.config.add("main", cfg);
  };

  public func getAgentsCache(state : State) : [T.DograhAgent] {
    let buf = List.empty<T.DograhAgent>();
    for ((_, agent) in state.agentsCache.entries()) {
      buf.add(agent);
    };
    buf.toArray();
  };

  public func setAgentInCache(state : State, agent : T.DograhAgent) : () {
    state.agentsCache.add(agent.id, agent);
  };

  public func getRoofingTemplate(state : State) : ?T.RoofingTemplate {
    state.roofingTpl.get("main");
  };

  public func setRoofingTemplate(state : State, tpl : T.RoofingTemplate) : () {
    state.roofingTpl.add("main", tpl);
  };

  public func getLastSyncTime(state : State) : Int {
    switch (state.syncMeta.get("lastSync")) {
      case (?t) t;
      case null 0;
    };
  };

  public func setLastSyncTime(state : State, t : Int) : () {
    state.syncMeta.add("lastSync", t);
  };

};
