import Types "../types/workflowRecovery";
import Lib "../lib/workflowRecovery";

mixin (state : Types.State) {
  public shared func createWorkflowRecovery(
    clientBusinessId : Text,
    workflowType : Text,
    workflowStatus : Text,
    lastStepCompleted : Text,
    nextStepRequired : Text,
    failureReason : Text,
    recoveryActions : Text,
    agentResponsible : Text,
    resumedAt : Nat,
    completedAt : Nat,
    recoveryStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.WorkflowRecovery = {
      id;
      clientBusinessId;
      workflowType;
      workflowStatus;
      lastStepCompleted;
      nextStepRequired;
      failureReason;
      recoveryActions;
      agentResponsible;
      resumedAt;
      completedAt;
      recoveryStatus;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getWorkflowRecovery(id : Text) : async { #ok : ?Types.WorkflowRecovery; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateWorkflowRecovery(
    id : Text,
    clientBusinessId : Text,
    workflowType : Text,
    workflowStatus : Text,
    lastStepCompleted : Text,
    nextStepRequired : Text,
    failureReason : Text,
    recoveryActions : Text,
    agentResponsible : Text,
    resumedAt : Nat,
    completedAt : Nat,
    recoveryStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.WorkflowRecovery = {
      id;
      clientBusinessId;
      workflowType;
      workflowStatus;
      lastStepCompleted;
      nextStepRequired;
      failureReason;
      recoveryActions;
      agentResponsible;
      resumedAt;
      completedAt;
      recoveryStatus;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteWorkflowRecovery(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listWorkflowRecoveriesByClient(clientBusinessId : Text) : async { #ok : [Types.WorkflowRecovery]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
