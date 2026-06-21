module {

  /// Status of a workflow step or overall workflow.
  public type WorkflowStatus = {
    #pending;
    #in_progress;
    #paused_for_approval;
    #approved;
    #rejected;
    #completed;
    #failed;
    #cancelled;
  };

  /// A single entry in the workflow audit log.
  public type WorkflowLogEntry = {
    id          : Text;
    tenantId    : Text;
    workflowId  : Text;
    stepIndex   : Nat;
    agentType   : Text;
    action      : Text;
    status      : WorkflowStatus;
    inputRef    : ?Text;
    outputRef   : ?Text;
    notes       : Text;
    createdAt   : Int;
  };

  /// High-level workflow status snapshot for recovery/resume.
  public type WorkflowStatusSnapshot = {
    workflowId     : Text;
    tenantId       : Text;
    currentStep    : Nat;
    totalSteps     : Nat;
    status         : WorkflowStatus;
    lastAgentType  : Text;
    lastAction     : Text;
    lastUpdatedAt  : Int;
  };

};
