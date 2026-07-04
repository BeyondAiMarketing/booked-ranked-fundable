import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/accountBrief";

module {

  public type State = {
    briefs : Map.Map<Text, T.AccountBrief>;
  };

  public func emptyState() : State = {
    briefs = Map.empty();
  };

  /// Persist or replace the brief for an account.
  public func saveBrief(state : State, brief : T.AccountBrief) : () {
    state.briefs.add(brief.accountId, brief);
  };

  /// Retrieve the brief for an account, or null if none has been set.
  public func getBrief(state : State, accountId : Text) : ?T.AccountBrief {
    state.briefs.get(accountId);
  };

  /// Merge a partial update into the stored brief.
  /// Returns true if the brief was found and updated, false if not found.
  /// Merge a partial update into the stored brief.
  /// Returns true if the brief was found and updated, false if not found.
  public func updateBrief(state : State, accountId : Text, update : T.AccountBriefUpdate, updatedBy : Text) : Bool {
    switch (state.briefs.get(accountId)) {
      case (?existing) {
        let updated : T.AccountBrief = {
          existing with
          respondTo          = switch (update.respondTo)          { case (?v) v; case null existing.respondTo          };
          ignoreList         = switch (update.ignoreList)         { case (?v) v; case null existing.ignoreList         };
          priorityContacts   = switch (update.priorityContacts)   { case (?v) v; case null existing.priorityContacts   };
          tone               = switch (update.tone)               { case (?v) v; case null existing.tone               };
          offerSummary       = switch (update.offerSummary)       { case (?v) v; case null existing.offerSummary       };
          doNotRespondList   = switch (update.doNotRespondList)   { case (?v) v; case null existing.doNotRespondList   };
          flagKeywords       = switch (update.flagKeywords)       { case (?v) v; case null existing.flagKeywords       };
          targetAudience     = switch (update.targetAudience)     { case (?v) v; case null existing.targetAudience     };
          services           = switch (update.services)           { case (?v) v; case null existing.services           };
          positioning        = switch (update.positioning)        { case (?v) v; case null existing.positioning        };
          differentiators    = switch (update.differentiators)    { case (?v) v; case null existing.differentiators    };
          brandVoice         = switch (update.brandVoice)         { case (?v) v; case null existing.brandVoice         };
          doRules            = switch (update.doRules)            { case (?v) v; case null existing.doRules            };
          dontRules          = switch (update.dontRules)          { case (?v) v; case null existing.dontRules          };
          sessionLog         = switch (update.sessionLog)         { case (?v) v; case null existing.sessionLog         };
          performanceHistory = switch (update.performanceHistory) { case (?v) v; case null existing.performanceHistory };
          contentHistory     = switch (update.contentHistory)     { case (?v) v; case null existing.contentHistory     };
          updatedAt          = Time.now();
          updatedBy          = updatedBy;
        };
        state.briefs.add(accountId, updated);
        true;
      };
      case null false;
    };
  };

};
