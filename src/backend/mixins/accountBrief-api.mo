import AccountBriefLib "../lib/accountBrief";
import T               "../types/accountBrief";

mixin (accountBriefState : AccountBriefLib.State) {

  /// Create or replace the account brief. Admin/owner callers only.
  public shared ({ caller = _ }) func saveAccountBrief(brief : T.AccountBrief) : async { #ok : Text; #err : Text } {
    AccountBriefLib.saveBrief(accountBriefState, brief);
    #ok "Account brief saved.";
  };

  /// Retrieve the brief for an account. Admin/owner callers only.
  public shared ({ caller = _ }) func getAccountBrief(accountId : Text) : async { #ok : T.AccountBrief; #err : Text } {
    switch (AccountBriefLib.getBrief(accountBriefState, accountId)) {
      case (?b)  { #ok b };
      case null  { #err ("No brief found for account: " # accountId) };
    };
  };

  /// Apply a partial update to an existing account brief. Admin/owner callers only.
  public shared ({ caller = _ }) func updateAccountBrief(accountId : Text, update : T.AccountBriefUpdate) : async { #ok : Text; #err : Text } {
    if (AccountBriefLib.updateBrief(accountBriefState, accountId, update, "admin")) {
      #ok "Account brief updated.";
    } else {
      #err ("No brief found for account: " # accountId);
    };
  };

};
