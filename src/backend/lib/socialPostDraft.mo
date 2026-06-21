import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import T    "../types/socialPostDraft";

module {

  public type State = {
    drafts : Map.Map<Text, T.SocialPostDraft>;
  };

  public func emptyState() : State = {
    drafts = Map.empty<Text, T.SocialPostDraft>();
  };

  /// Persist a new post draft.
  public func saveDraft(state : State, draft : T.SocialPostDraft) : () {
    state.drafts.add(draft.id, draft);
  };

  /// Retrieve a draft by id.
  public func getDraft(state : State, id : Text) : ?T.SocialPostDraft {
    state.drafts.get(id);
  };

  /// Get all drafts for a tenant.
  public func getDraftsByTenant(state : State, tenantId : Text) : [T.SocialPostDraft] {
    let result = List.empty<T.SocialPostDraft>();
    for (d in state.drafts.values()) {
      if (d.tenantId == tenantId) { result.add(d) };
    };
    result.toArray();
  };

  /// Get drafts by status for a tenant.
  public func getDraftsByStatus(state : State, tenantId : Text, status : T.DraftStatus) : [T.SocialPostDraft] {
    let result = List.empty<T.SocialPostDraft>();
    for (d in state.drafts.values()) {
      if (d.tenantId == tenantId and d.status == status) { result.add(d) };
    };
    result.toArray();
  };

  /// Get drafts linked to a calendar entry.
  public func getDraftsByEntry(state : State, entryId : Text) : [T.SocialPostDraft] {
    let result = List.empty<T.SocialPostDraft>();
    for (d in state.drafts.values()) {
      switch (d.entryId) {
        case (?eid) { if (eid == entryId) { result.add(d) } };
        case (null) {};
      };
    };
    result.toArray();
  };

  /// Merge a partial update into an existing draft.
  public func updateDraft(state : State, id : Text, update : T.SocialPostDraftUpdate) : Bool {
    switch (state.drafts.get(id)) {
      case (?existing) {
        let updated : T.SocialPostDraft = {
          existing with
          content       = switch (update.content)       { case (?v) v; case null existing.content       };
          hashtags      = switch (update.hashtags)      { case (?v) v; case null existing.hashtags      };
          mediaUrls     = switch (update.mediaUrls)     { case (?v) v; case null existing.mediaUrls     };
          cta           = switch (update.cta)           { case (?v) v; case null existing.cta           };
          ctaUrl        = switch (update.ctaUrl)        { case (?v) v; case null existing.ctaUrl        };
          scheduledAt   = switch (update.scheduledAt)   { case (?v) ?v; case null existing.scheduledAt   };
          status        = switch (update.status)        { case (?v) v; case null existing.status        };
          approvedBy    = switch (update.approvedBy)    { case (?v) ?v; case null existing.approvedBy    };
          approvedAt    = switch (update.approvedAt)    { case (?v) ?v; case null existing.approvedAt    };
          n8nStatus     = switch (update.n8nStatus)     { case (?v) ?v; case null existing.n8nStatus     };
          publishedUrl  = switch (update.publishedUrl)  { case (?v) ?v; case null existing.publishedUrl  };
          updatedAt     = Time.now();
        };
        state.drafts.add(id, updated);
        true;
      };
      case null false;
    };
  };

  /// Remove a draft.
  public func removeDraft(state : State, id : Text) : Bool {
    switch (state.drafts.get(id)) {
      case (?_) { state.drafts.remove(id); true };
      case null false;
    };
  };

};
