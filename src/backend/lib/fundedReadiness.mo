import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import T "../types/fundedReadiness";

module {
  public type State = {
    records : Map.Map<Text, T.Record>;
    var nextId : Nat;
  };

  public func emptyState() : State {
    {
      records = Map.empty<Text, T.Record>();
      var nextId = 0;
    }
  };

  public func generateId(state : State) : Text {
    let id = state.nextId;
    state.nextId += 1;
    "fr-" # Nat.toText(id)
  };

  public func save(state : State, record : T.Record) : () {
    state.records.add(record.id, record);
  };

  public func get(state : State, id : Text) : ?T.Record {
    state.records.get(id)
  };

  public func update(state : State, id : Text, record : T.Record) : Bool {
    switch (state.records.get(id)) {
      case (?_) { state.records.add(id, record); true };
      case null { false };
    }
  };

  public func delete(state : State, id : Text) : Bool {
    switch (state.records.get(id)) {
      case (?_) { state.records.remove(id); true };
      case null { false };
    }
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.Record] {
    let results = Map.empty<Text, T.Record>();
    for ((key, value) in state.records.entries()) {
      if (value.clientBusinessId == clientBusinessId) {
        results.add(key, value);
      };
    };
    results.entries()
      .map<(Text, T.Record), T.Record>(func((_, v)) { v })
      .toArray()
  };
}
