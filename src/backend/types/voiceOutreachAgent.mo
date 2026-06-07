module {

  /// The parsed action type the agent will take based on interpreting the voice command.
  public type AgentActionKind = {
    #EditSequence;    // Modify an email sequence
    #QueryLeads;      // Query CRM leads
    #FireBulkSend;    // Send emails to a set of leads
    #ModifyStep;      // Modify a single sequence step
    #Unknown;         // Could not parse the command
  };

  /// A single entry in the command history log.
  public type CommandLogEntry = {
    id          : Text;
    userId      : Text;
    sessionId   : Text;
    commandText : Text;
    timestamp   : Int;
    agentAction : AgentActionKind;
    confirmationPreview : Text;
    executedAt  : ?Int;
    executionResult : ?Text;
  };

  /// A pending action waiting for user confirmation before execution.
  public type PendingAction = {
    actionId    : Text;
    userId      : Text;
    sessionId   : Text;
    commandText : Text;
    actionKind  : AgentActionKind;
    preview     : Text;
    createdAt   : Int;
    // JSON-encoded action-specific payload (leadIds, sequenceId, stepIndex, etc.)
    payload     : Text;
  };

  /// Per-user daily bulk send enforcement record.
  public type BulkSendQuota = {
    userId      : Text;
    dailyCount  : Nat;
    dailyLimit  : Nat;
    lastReset   : Int;  // Unix nanoseconds of last midnight reset
  };

  /// Session state for a voice outreach agent session.
  public type AgentSessionState = {
    userId      : Text;
    sessionId   : Text;
    isActive    : Bool;
    startedAt   : Int;
    lastSeenAt  : Int;
  };

  /// Returned from submitAgentCommand — contains a preview and whether
  /// the caller must call executeAgentAction before anything fires.
  public type AgentCommandResult = {
    actionId           : Text;
    preview            : Text;
    requiresConfirmation : Bool;
    error              : ?Text;
  };

};
