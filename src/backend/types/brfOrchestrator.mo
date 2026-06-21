import Time "mo:core/Time";
import AO "agentOrchestrator";

module {

  /// The BRF Orchestrator Agent coordinates all other agents and routes work.
  public type BRFOrchestratorState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    activeAgents : [Text];
    pendingTasks : [AO.AgentTask];
    completedTasks : [AO.AgentTask];
    failedTasks : [AO.AgentTask];
    currentWorkflow : ?Text;
    lastAction : Text;
    lastActionAt : Int;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to initialize the BRF Orchestrator for a client.
  public type BRFOrchestratorInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    initialWorkflow : ?Text;
  };

  /// Update for the BRF Orchestrator state.
  /// Generic aliases for lib/mixin compatibility
  public type Record = BRFOrchestratorState;
  public type CreateRequest = BRFOrchestratorInput;
  public type UpdateRequest = BRFOrchestratorUpdate;

  public type BRFOrchestratorUpdate = {
    activeAgents : ?[Text];
    pendingTasks : ?[AO.AgentTask];
    completedTasks : ?[AO.AgentTask];
    failedTasks : ?[AO.AgentTask];
    currentWorkflow : ??Text;
    lastAction : ?Text;
    updatedAt : ?Int;
  };

}
