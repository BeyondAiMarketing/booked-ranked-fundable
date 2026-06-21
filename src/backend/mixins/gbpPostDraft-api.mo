import T "../types/gbpPostDraft";
import L "../lib/gbpPostDraft";

module {

  public func mixin(state : L.State) : actor {

    public shared ({ caller = _ }) func createGBPPostDraft(draft : T.GBPPostDraft) : async () {
      L.save(state, draft);
    };

    public shared ({ caller = _ }) func getGBPPostDraft(id : Text) : async ?T.GBPPostDraft {
      L.get(state, id);
    };

    public shared ({ caller = _ }) func updateGBPPostDraft(id : Text, update : T.GBPPostDraftUpdate) : async ?T.GBPPostDraft {
      L.update(state, id, update);
    };

    public shared ({ caller = _ }) func listGBPPostDraftsByClient(clientBusinessId : Text) : async [T.GBPPostDraft] {
      L.listByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func listGBPPostDraftsByStatus(clientBusinessId : Text, status : T.GBPPostStatus) : async [T.GBPPostDraft] {
      L.listByStatus(state, clientBusinessId, status);
    };

    public shared ({ caller = _ }) func deleteGBPPostDraft(id : Text) : async Bool {
      L.remove(state, id);
    };

  };

}
