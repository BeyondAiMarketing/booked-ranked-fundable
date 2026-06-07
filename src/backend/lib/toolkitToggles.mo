import List "mo:core/List";
import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/toolkitToggles";

module {

  public type State = {
    // Key: "<tierId>|<toolkitName>"
    toggleMap : Map.Map<Text, T.ToolkitToggle>;
  };

  public func emptyState() : State = {
    toggleMap = Map.empty<Text, T.ToolkitToggle>();
  };

  func makeKey(tierId : Text, toolkitName : Text) : Text {
    tierId # "|" # toolkitName;
  };

  /// Persist or replace a single toggle entry.
  public func setToggle(state : State, toggle : T.ToolkitToggle) : () {
    state.toggleMap.add(makeKey(toggle.tierId, toggle.toolkitName), toggle);
  };

  /// Look up a toggle by tier and toolkit name.
  public func getToggle(state : State, tierId : Text, toolkitName : Text) : ?T.ToolkitToggle {
    state.toggleMap.get(makeKey(tierId, toolkitName));
  };

  /// Return all toggles for a given tier.
  public func getTogglesByTier(state : State, tierId : Text) : [T.ToolkitToggle] {
    let results = List.empty<T.ToolkitToggle>();
    for ((_, toggle) in state.toggleMap.entries()) {
      if (toggle.tierId == tierId) { results.add(toggle) };
    };
    results.toArray();
  };

  /// Return every toggle stored across all tiers.
  public func getAllToggles(state : State) : [T.ToolkitToggle] {
    let results = List.empty<T.ToolkitToggle>();
    for ((_, toggle) in state.toggleMap.entries()) {
      results.add(toggle);
    };
    results.toArray();
  };

  /// Apply a single enabled/disabled state to multiple toolkits in one tier.
  /// Returns the number of toggles written.
  public func bulkApply(state : State, req : T.BulkToggleRequest) : Nat {
    var count = 0;
    for (name in req.toolkitNames.vals()) {
      let toggle : T.ToolkitToggle = {
        tierId      = req.tierId;
        toolkitName = name;
        enabled     = req.enabled;
        appliedAt   = Time.now();
      };
      state.toggleMap.add(makeKey(req.tierId, name), toggle);
      count += 1;
    };
    count;
  };

};
