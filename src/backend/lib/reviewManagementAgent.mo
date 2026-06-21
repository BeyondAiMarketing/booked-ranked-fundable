import Map "mo:core/Map";
import Text "mo:core/Text";
import Types "../types/reviewManagementAgent";

module {
  public type ReviewManagementAgent = Types.ReviewManagementAgent;
  public type State = Types.State;

  public func generateId(state : State) : Text {
    let id = state.nextId;
    state.nextId += 1;
    "rma-" # Nat.toText(id);
  };

  public func save(state : State, item : ReviewManagementAgent) : () {
    state.items.add(item.id, item);
  };

  public func get(state : State, id : Text) : ?ReviewManagementAgent {
    state.items.get(id);
  };

  public func update(state : State, id : Text, item : ReviewManagementAgent) : Bool {
    switch (state.items.get(id)) {
      case (?_) {
        state.items.add(id, item);
        true;
      };
      case null { false };
    };
  };

  public func delete(state : State, id : Text) : Bool {
    switch (state.items.get(id)) {
      case (?_) {
        state.items.remove(id);
        true;
      };
      case null { false };
    };
  };

  public func listByClient(state : State, clientBusinessId : Text) : [ReviewManagementAgent] {
    let results = Map.empty<Text, ReviewManagementAgent>();
    for ((_, item) in state.items.entries()) {
      if (item.clientBusinessId == clientBusinessId) {
        results.add(item.id, item);
      };
    };
    results.values() |> Map.toArray(_);
  };
};
