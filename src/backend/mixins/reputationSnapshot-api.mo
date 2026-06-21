import T "../types/reputationSnapshot";
import L "../lib/reputationSnapshot";

module {

  public func mixin(state : L.State) : actor {

    public shared ({ caller = _ }) func createReputationSnapshot(snapshot : T.ReputationSnapshot) : async () {
      L.save(state, snapshot);
    };

    public shared ({ caller = _ }) func getReputationSnapshot(id : Text) : async ?T.ReputationSnapshot {
      L.get(state, id);
    };

    public shared ({ caller = _ }) func listReputationSnapshotsByClient(clientBusinessId : Text) : async [T.ReputationSnapshot] {
      L.listByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func getLatestReputationSnapshot(clientBusinessId : Text) : async ?T.ReputationSnapshot {
      L.getLatestByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func deleteReputationSnapshot(id : Text) : async Bool {
      L.remove(state, id);
    };

  };

}
