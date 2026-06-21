import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/gbpPostDraft";

module {

  public type State = {
    drafts : Map.Map<Text, T.GBPPostDraft>;
  };

  public func emptyState() : State = {
    drafts = Map.empty<Text, T.GBPPostDraft>();
  };

  public func save(state : State, draft : T.GBPPostDraft) : () {
    state.drafts.add(draft.id, draft);
  };

  public func get(state : State, id : Text) : ?T.GBPPostDraft {
    state.drafts.get(id);
  };

  public func update(state : State, id : Text, update : T.GBPPostDraftUpdate) : ?T.GBPPostDraft {
    switch (state.drafts.get(id)) {
      case null { null };
      case (?existing) {
        let updated : T.GBPPostDraft = {
          existing with
          postType        = switch (update.postType)        { case (?v) v; case null existing.postType        };
          title           = switch (update.title)           { case (?v) v; case null existing.title           };
          hook            = switch (update.hook)            { case (?v) v; case null existing.hook            };
          body            = switch (update.body)            { case (?v) v; case null existing.body            };
          cta             = switch (update.cta)             { case (?v) v; case null existing.cta             };
          ctaUrl          = switch (update.ctaUrl)          { case (?v) v; case null existing.ctaUrl          };
          serviceKeyword  = switch (update.serviceKeyword)  { case (?v) v; case null existing.serviceKeyword  };
          locationKeyword = switch (update.locationKeyword) { case (?v) v; case null existing.locationKeyword };
          photoAsset      = switch (update.photoAsset)      { case (?v) ?v; case null existing.photoAsset      };
          startDate       = switch (update.startDate)       { case (?v) ?v; case null existing.startDate       };
          endDate         = switch (update.endDate)         { case (?v) ?v; case null existing.endDate         };
          approvalStatus  = switch (update.approvalStatus)  { case (?v) v; case null existing.approvalStatus  };
          n8nStatus       = switch (update.n8nStatus)       { case (?v) ?v; case null existing.n8nStatus       };
          publishedUrl    = switch (update.publishedUrl)    { case (?v) ?v; case null existing.publishedUrl    };
          updatedAt       = Time.now();
        };
        state.drafts.add(id, updated);
        ?updated;
      };
    };
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.GBPPostDraft] {
    let out = Map.empty<Text, T.GBPPostDraft>();
    for ((id, draft) in state.drafts.entries()) {
      if (draft.clientBusinessId == clientBusinessId) { out.add(id, draft) };
    };
    let result = Map.empty<T.GBPPostDraft>();
    for ((_, draft) in out.entries()) { result.add(draft) };
    result.toArray();
  };

  public func listByStatus(state : State, clientBusinessId : Text, status : T.GBPPostStatus) : [T.GBPPostDraft] {
    let out = Map.empty<Text, T.GBPPostDraft>();
    for ((id, draft) in state.drafts.entries()) {
      if (draft.clientBusinessId == clientBusinessId and draft.approvalStatus == status) {
        out.add(id, draft);
      };
    };
    let result = Map.empty<T.GBPPostDraft>();
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
