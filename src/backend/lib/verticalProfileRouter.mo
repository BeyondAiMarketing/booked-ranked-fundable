import Map "mo:core/Map";
import Text "mo:core/Text";
import Types "../types/verticalProfileRouter";

module {
  public type VerticalProfileRouter = Types.VerticalProfileRouter;
  public type State = Types.State;

  public func generateId(state : State) : Text {
    let id = state.nextId;
    state.nextId += 1;
    "vpr-" # Nat.toText(id);
  };

  public func save(state : State, item : VerticalProfileRouter) : () {
    state.items.add(item.id, item);
  };

  public func get(state : State, id : Text) : ?VerticalProfileRouter {
    state.items.get(id);
  };

  public func update(state : State, id : Text, item : VerticalProfileRouter) : Bool {
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

  public func listByClient(state : State, clientBusinessId : Text) : [VerticalProfileRouter] {
    let results = Map.empty<Text, VerticalProfileRouter>();
    for ((_, item) in state.items.entries()) {
      if (item.clientBusinessId == clientBusinessId) {
        results.add(item.id, item);
      };
    };
    results.values() |> Map.toArray(_);
  };
};
