module {

  /// Per-account AI behaviour rules — set once and carried into every agent action.
  public type AccountBrief = {
    accountId        : Text;
    respondTo        : [Text];
    ignoreList       : [Text];
    priorityContacts : [Text];
    tone             : Text;
    offerSummary     : Text;
    doNotRespondList : [Text];
    flagKeywords     : [Text];
    updatedAt        : Int;
    updatedBy        : Text;
    targetAudience   : [Text];
    services         : [Text];
    positioning      : Text;
    differentiators  : [Text];
    brandVoice       : Text;
    doRules          : [Text];
    dontRules        : [Text];
    sessionLog       : [Text];
    performanceHistory : [Text];
    contentHistory   : [Text];
  };

  /// Partial update record — only provided fields are merged into the stored brief.
  public type AccountBriefUpdate = {
    respondTo        : ?[Text];
    ignoreList       : ?[Text];
    priorityContacts : ?[Text];
    tone             : ?Text;
    offerSummary     : ?Text;
    doNotRespondList : ?[Text];
    flagKeywords     : ?[Text];
    targetAudience   : ?[Text];
    services         : ?[Text];
    positioning      : ?Text;
    differentiators  : ?[Text];
    brandVoice       : ?Text;
    doRules          : ?[Text];
    dontRules        : ?[Text];
    sessionLog       : ?[Text];
    performanceHistory : ?[Text];
    contentHistory   : ?[Text];
  };

};
