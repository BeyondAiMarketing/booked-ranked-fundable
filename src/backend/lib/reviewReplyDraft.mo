import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/reviewReplyDraft";

module {

  public type State = {
    drafts : Map.Map<Text, T.ReviewReplyDraft>;
  };

  public func emptyState() : State = {
    drafts = Map.empty<Text, T.ReviewReplyDraft>();
  };

  public func save(state : State, draft : T.ReviewReplyDraft) : () {
    state.drafts.add(draft.id, draft);
  };

  public func get(state : State, id : Text) : ?T.ReviewReplyDraft {
    state.drafts.get(id);
  };

  public func update(state : State, id : Text, update : T.ReviewReplyDraftUpdate) : ?T.ReviewReplyDraft {
    switch (state.drafts.get(id)) {
      case null { null };
      case (?existing) {
        let updated : T.ReviewReplyDraft = {
          existing with
          replyText       = switch (update.replyText)       { case (?v) v; case null existing.replyText       };
          includesServiceMention = switch (update.includesServiceMention) { case (?v) v; case null existing.includesServiceMention };
          includesLocationMention = switch (update.includesLocationMention) { case (?v) v; case null existing.includesLocationMention };
          isEscalated     = switch (update.isEscalated)     { case (?v) v; case null existing.isEscalated     };
          approvalStatus  = switch (update.approvalStatus)  { case (?v) v; case null existing.approvalStatus  };
          n8nStatus       = switch (update.n8nStatus)       { case (?v) ?v; case null existing.n8nStatus       };
          sentAt          = switch (update.sentAt)          { case (?v) ?v; case null existing.sentAt          };
          updatedAt       = Time.now();
        };
        state.drafts.add(id, updated);
        ?updated;
      };
    };
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.ReviewReplyDraft] {
    let out = Map.empty<Text, T.ReviewReplyDraft>();
    for ((id, draft) in state.drafts.entries()) {
      if (draft.clientBusinessId == clientBusinessId) { out.add(id, draft) };
    };
    let result = Map.empty<T.ReviewReplyDraft>();
    for ((_, draft) in out.entries()) { result.add(draft) };
    result.toArray();
  };

  public func listByStatus(state : State, clientBusinessId : Text, status : T.ReviewReplyStatus) : [T.ReviewReplyDraft] {
    let out = Map.empty<Text, T.ReviewReplyDraft>();
    for ((id, draft) in state.drafts.entries()) {
      if (draft.clientBusinessId == clientBusinessId and draft.approvalStatus == status) {
        out.add(id, draft);
      };
    };
    let result = Map.empty<T.ReviewReplyDraft>();
    for ((_, draft) in out.entries()) { result.add(draft) };
    result.toArray();
  };

  public func remove(state : State, id : Text) : Bool {
    switch (state.drafts.get(id)) {
      case (?_) { state.drafts.remove(id); true };
      case null false;
    };
  };

}
