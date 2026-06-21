import SocialPostDraftLib "../lib/socialPostDraft";
import T                  "../types/socialPostDraft";

mixin (socialPostDraftState : SocialPostDraftLib.State) {

  /// Create or replace a social post draft. Admin/owner callers only.
  public shared ({ caller = _ }) func saveSocialPostDraft(draft : T.SocialPostDraft) : async { #ok : Text; #err : Text } {
    SocialPostDraftLib.saveDraft(socialPostDraftState, draft);
    #ok "Social post draft saved.";
  };

  /// Retrieve a draft by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getSocialPostDraft(id : Text) : async { #ok : T.SocialPostDraft; #err : Text } {
    switch (SocialPostDraftLib.getDraft(socialPostDraftState, id)) {
      case (?d)  { #ok d };
      case null  { #err ("No social post draft found for id: " # id) };
    };
  };

  /// Get all drafts for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getSocialPostDraftsByTenant(tenantId : Text) : async { #ok : [T.SocialPostDraft]; #err : Text } {
    #ok (SocialPostDraftLib.getDraftsByTenant(socialPostDraftState, tenantId));
  };

  /// Get drafts by status for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getSocialPostDraftsByStatus(tenantId : Text, status : T.DraftStatus) : async { #ok : [T.SocialPostDraft]; #err : Text } {
    #ok (SocialPostDraftLib.getDraftsByStatus(socialPostDraftState, tenantId, status));
  };

  /// Get drafts linked to a calendar entry. Admin/owner callers only.
  public shared ({ caller = _ }) func getSocialPostDraftsByEntry(entryId : Text) : async { #ok : [T.SocialPostDraft]; #err : Text } {
    #ok (SocialPostDraftLib.getDraftsByEntry(socialPostDraftState, entryId));
  };

  /// Apply a partial update to a draft. Admin/owner callers only.
  public shared ({ caller = _ }) func updateSocialPostDraft(id : Text, update : T.SocialPostDraftUpdate) : async { #ok : Text; #err : Text } {
    if (SocialPostDraftLib.updateDraft(socialPostDraftState, id, update)) {
      #ok "Social post draft updated.";
    } else {
      #err ("No social post draft found for id: " # id);
    };
  };

  /// Remove a draft. Admin/owner callers only.
  public shared ({ caller = _ }) func removeSocialPostDraft(id : Text) : async { #ok : Text; #err : Text } {
    if (SocialPostDraftLib.removeDraft(socialPostDraftState, id)) {
      #ok "Social post draft removed.";
    } else {
      #err ("No social post draft found for id: " # id);
    };
  };

};
