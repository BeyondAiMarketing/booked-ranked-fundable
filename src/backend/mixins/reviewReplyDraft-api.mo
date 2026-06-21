import T "../types/reviewReplyDraft";
import L "../lib/reviewReplyDraft";

module {

  public func mixin(state : L.State) : actor {

    public shared ({ caller = _ }) func createReviewReplyDraft(draft : T.ReviewReplyDraft) : async () {
      L.save(state, draft);
    };

    public shared ({ caller = _ }) func getReviewReplyDraft(id : Text) : async ?T.ReviewReplyDraft {
      L.get(state, id);
    };

    public shared ({ caller = _ }) func updateReviewReplyDraft(id : Text, update : T.ReviewReplyDraftUpdate) : async ?T.ReviewReplyDraft {
      L.update(state, id, update);
    };

    public shared ({ caller = _ }) func listReviewReplyDraftsByClient(clientBusinessId : Text) : async [T.ReviewReplyDraft] {
      L.listByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func listReviewReplyDraftsByStatus(clientBusinessId : Text, status : T.ReviewReplyStatus) : async [T.ReviewReplyDraft] {
      L.listByStatus(state, clientBusinessId, status);
    };

    public shared ({ caller = _ }) func deleteReviewReplyDraft(id : Text) : async Bool {
      L.remove(state, id);
    };

  };

}
