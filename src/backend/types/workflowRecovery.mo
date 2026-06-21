import Time "mo:core/Time";

module {

  /// Recovery status for workflow recovery agent.
  public type RecoveryStatus = {
    #detected;
    #analyzing;
    #recovering;
    #recovered;
    #failed;
    #manual_intervention_required;
  };

  /// The Workflow Recovery Agent detects and recovers failed workflows.
  public type WorkflowRecoveryState = {
    id : Text;
    workflowId : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    failurePoint : Text;
    failureReason : Text;
    recoveryStatus : RecoveryStatus;
    recoveryAttempts : Nat;
    lastRecoveryAt : ?Int;
    recoveredAt : ?Int;
    manualNotes : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to start workflow recovery.
  public type WorkflowRecoveryInput = {
    workflowId : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    failurePoint : Text;
    failureReason : Text;
  };

  /// Update for workflow recovery progress.
  public type WorkflowRecoveryUpdate = {
    recoveryStatus : ?RecoveryStatus;
    recoveryAttempts : ?Nat;
    lastRecoveryAt : ??Int;
    recoveredAt : ??Int;
    manualNotes : ?[Text];
    updatedAt : ?Int;
  };

}
