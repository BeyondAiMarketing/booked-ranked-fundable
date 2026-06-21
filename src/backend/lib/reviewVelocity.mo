import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/reviewVelocity";

module {

  public type State = {
    snapshots : Map.Map<Text, T.ReviewVelocity>;
  };

  public func emptyState() : State = {
    snapshots = Map.empty<Text, T.ReviewVelocity>();
  };

  public func save(state : State, snapshot : T.ReviewVelocity) : () {
    state.snapshots.add(snapshot.id, snapshot);
  };

  public func get(state : State, id : Text) : ?T.ReviewVelocity {
    state.snapshots.get(id);
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.ReviewVelocity] {
    let out = Map.empty<Text, T.ReviewVelocity>();
    for ((id, snap) in state.snapshots.entries()) {
      if (snap.clientBusinessId == clientBusinessId) { out.add(id, snap) };
    };
    let result = Map.empty<T.ReviewVelocity>();
    for ((_, snap) in out.entries()) { result.add(snap) };
    result.toArray();
  };

  public func getLatestByClient(state : State, clientBusinessId : Text) : ?T.ReviewVelocity {
    var latest : ?T.ReviewVelocity = null;
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
