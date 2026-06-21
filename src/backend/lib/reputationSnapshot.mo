import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/reputationSnapshot";

module {

  public type State = {
    snapshots : Map.Map<Text, T.ReputationSnapshot>;
  };

  public func emptyState() : State = {
    snapshots = Map.empty<Text, T.ReputationSnapshot>();
  };

  public func save(state : State, snapshot : T.ReputationSnapshot) : () {
    state.snapshots.add(snapshot.id, snapshot);
  };

  public func get(state : State, id : Text) : ?T.ReputationSnapshot {
    state.snapshots.get(id);
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.ReputationSnapshot] {
    let out = Map.empty<Text, T.ReputationSnapshot>();
    for ((id, snap) in state.snapshots.entries()) {
      if (snap.clientBusinessId == clientBusinessId) { out.add(id, snap) };
    };
    let result = Map.empty<T.ReputationSnapshot>();
    for ((_, snap) in out.entries()) { result.add(snap) };
    result.toArray();
  };

  public func getLatestByClient(state : State, clientBusinessId : Text) : ?T.ReputationSnapshot {
    var latest : ?T.ReputationSnapshot = null;
    for ((_, snap) in state.snapshots.entries()) {
      if (snap.clientBusinessId == clientBusinessId) {
        switch (latest) {
          case null { latest := ?snap };
          case (?l) { if (snap.createdAt > l.createdAt) { latest := ?snap } };
        };
      };
    };
    latest;
  };

  public func remove(state : State, id : Text) : Bool {
    switch (state.snapshots.get(id)) {
      case (?_) { state.snapshots.remove(id); true };
      case null false;
    };
  };

}
