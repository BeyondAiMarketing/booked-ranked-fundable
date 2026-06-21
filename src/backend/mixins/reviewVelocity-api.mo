import T "../types/reviewVelocity";
import L "../lib/reviewVelocity";

module {

  public func mixin(state : L.State) : actor {

    public shared ({ caller = _ }) func createReviewVelocity(snapshot : T.ReviewVelocity) : async () {
      L.save(state, snapshot);
    };

    public shared ({ caller = _ }) func getReviewVelocity(id : Text) : async ?T.ReviewVelocity {
      L.get(state, id);
    };

    public shared ({ caller = _ }) func listReviewVelocityByClient(clientBusinessId : Text) : async [T.ReviewVelocity] {
      L.listByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func getLatestReviewVelocity(clientBusinessId : Text) : async ?T.ReviewVelocity {
      L.getLatestByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func deleteReviewVelocity(id : Text) : async Bool {
      L.remove(state, id);
    };

  };

}
