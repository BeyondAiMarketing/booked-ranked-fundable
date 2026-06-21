import Time "mo:core/Time";

module {

  /// Shared status enum for all agent orchestration workflows.
  public type AgentStatus = {
    #idle;
    #running;
    #paused;
    #completed;
    #failed;
    #awaiting_approval;
  };

  /// Shared trigger source for agent invocation.
  public type TriggerSource = {
    #manual;
    #scheduled;
    #webhook;
    #event;
    #recovery;
  };

  /// Shared agent task record for orchestration tracking.
  public type AgentTask = {
    id : Text;
    agentType : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    trigger : TriggerSource;
    status : AgentStatus;
    inputSummary : Text;
    outputSummary : Text;
    approvalRequestId : ?Text;
    workflowLogId : ?Text;
    startedAt : Int;
    completedAt : ?Int;
    errorMessage : ?Text;
  };

  /// Shared agent configuration for CLI orchestrator.
  public type AgentConfig = {
    agentType : Text;
    enabled : Bool;
    autoApproveTier1 : Bool;
    requireApprovalForTier2 : Bool;
    requireApprovalForTier3 : Bool;
    maxRetries : Nat;
    timeoutSeconds : Nat;
  };

  /// Orchestrator command from CLI.
  public type OrchestratorCommand = {
    #startAgent : { agentType : Text; clientBusinessId : Text; verticalProfileId : Text; input : Text };
    #pauseAgent : { taskId : Text };
    #resumeAgent : { taskId : Text };
    #cancelAgent : { taskId : Text };
    #getAgentStatus : { taskId : Text };
    #listActiveAgents : { clientBusinessId : ?Text };
    #configureAgent : { agentType : Text; config : AgentConfig };
  };

  /// Orchestrator response for CLI.
  public type OrchestratorResponse = {
    #ok : { message : Text; taskId : ?Text; status : ?AgentStatus };
    #err : Text;
  };

}
