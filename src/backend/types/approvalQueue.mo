module {

  /// Approval status for queue items.
  public type ApprovalStatus = {
    #pending;
    #approved;
    #rejected;
    #expired;
  };

  /// Tier of approval required before external action.
  public type ApprovalTier = {
    #social_publish;
    #gbp_publish;
    #content_publish;
    #email_send;
    #sms_send;
    #voice_call;
    #funding_claim;
    #legal;
    #medical;
    #financial;
    // #review_reply;  // deferred: stable compat
    // #citation_fix;  // deferred: stable compat
    // #local_content;  // deferred: stable compat
    // #service_area_page;  // deferred: stable compat
  };

  /// A single approval queue item.
  public type ApprovalItem = {
    id            : Text;
    tenantId      : Text;
    runId         : Text;
    threadId      : Text;
    action        : Text;
    reason        : Text;
    tier          : ApprovalTier;
    status        : ApprovalStatus;
    requestedAt   : Int;
    resolvedAt    : ?Int;
    approverNotes : ?Text;
    requestedBy   : Text;
  };

  /// Flat-record version for external sync.
  public type ApprovalItemRecord = {
    id            : Text;
    runId         : Text;
    threadId      : Text;
    tenantId      : Text;
    agentId       : Text;
    title         : Text;
    description   : Text;
    actionType    : Text;
    tier          : Text;
    requestedAt   : Int;
    resolvedAt    : ?Int;
    status        : Text;
    resolvedBy    : ?Text;
    resolutionNote : ?Text;
    priority      : Text;
  };

  /// Partial update for resolving an approval item.
  public type ApprovalResolution = {
    status : ApprovalStatus;
    notes  : ?Text;
  };

};
