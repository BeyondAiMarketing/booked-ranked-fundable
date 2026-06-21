import ScheduledWorkflowLib "../lib/scheduledWorkflow";
import T                      "../types/scheduledWorkflow";
import Time                   "mo:core/Time";
import Text                   "mo:core/Text";

mixin (scheduledWorkflowState : ScheduledWorkflowLib.State) {

  var workflowIdCounter : Nat = 0;

  /// Generate a unique workflow id.
  func nextWorkflowId() : Text {
    workflowIdCounter += 1;
    "sw-" # Nat.toText(workflowIdCounter) # "-" # Int.toText(Time.now());
  };

  /// Create a new scheduled workflow.
  public shared ({ caller = _ }) func createWorkflow(input : T.CreateInput) : async { #ok : T.ScheduledWorkflow; #err : Text } {
    if (not ScheduledWorkflowLib.isValidFrequency(input.frequency)) {
      return #err ("Invalid frequency: " # input.frequency # ". Valid: daily, weekly, bi_weekly, monthly, quarterly, on_demand");
    };
    let id = nextWorkflowId();
    let workflow = ScheduledWorkflowLib.create(scheduledWorkflowState, input, id);
    #ok workflow;
  };

  /// Get a workflow by id.
  public shared ({ caller = _ }) func getWorkflow(id : Text) : async { #ok : T.ScheduledWorkflow; #err : Text } {
    switch (ScheduledWorkflowLib.getById(scheduledWorkflowState, id)) {
      case (?w) { #ok w };
      case null { #err ("Workflow not found: " # id) };
    };
  };

  /// Get all workflows for a client business.
  public shared ({ caller = _ }) func getWorkflowsByClient(clientBusinessId : Text) : async { #ok : [T.ScheduledWorkflow]; #err : Text } {
    #ok (ScheduledWorkflowLib.getByClient(scheduledWorkflowState, clientBusinessId));
  };

  /// Get all workflows for a vertical profile.
  public shared ({ caller = _ }) func getWorkflowsByVertical(verticalProfileId : Text) : async { #ok : [T.ScheduledWorkflow]; #err : Text } {
    #ok (ScheduledWorkflowLib.getByVertical(scheduledWorkflowState, verticalProfileId));
  };

  /// Update an existing workflow.
  public shared ({ caller = _ }) func updateWorkflow(input : T.UpdateInput) : async { #ok : T.ScheduledWorkflow; #err : Text } {
    switch (input.frequency) {
      case (?freq) {
        if (not ScheduledWorkflowLib.isValidFrequency(freq)) {
          return #err ("Invalid frequency: " # freq # ". Valid: daily, weekly, bi_weekly, monthly, quarterly, on_demand");
        };
      };
      case null {};
    };
    switch (ScheduledWorkflowLib.update(scheduledWorkflowState, input)) {
      case (?w) { #ok w };
      case null { #err ("Workflow not found: " # input.id) };
    };
  };

  /// Toggle workflow active/inactive.
  public shared ({ caller = _ }) func toggleWorkflow(id : Text) : async { #ok : T.ScheduledWorkflow; #err : Text } {
    switch (ScheduledWorkflowLib.toggle(scheduledWorkflowState, id)) {
      case (?w) { #ok w };
      case null { #err ("Workflow not found: " # id) };
    };
  };

  /// Get all workflows that are due to run.
  public shared ({ caller = _ }) func getDueWorkflows() : async { #ok : [T.ScheduledWorkflow]; #err : Text } {
    #ok (ScheduledWorkflowLib.getDueWorkflows(scheduledWorkflowState));
  };

  /// Mark a workflow as executed and recalculate next run.
  public shared ({ caller = _ }) func markWorkflowRun(id : Text) : async { #ok : T.ScheduledWorkflow; #err : Text } {
    switch (ScheduledWorkflowLib.markRun(scheduledWorkflowState, id)) {
      case (?w) { #ok w };
      case null { #err ("Workflow not found: " # id) };
    };
  };

  /// Delete a workflow.
  public shared ({ caller = _ }) func deleteWorkflow(id : Text) : async { #ok : Text; #err : Text } {
    if (ScheduledWorkflowLib.delete(scheduledWorkflowState, id)) {
      #ok "Workflow deleted.";
    } else {
      #err ("Workflow not found: " # id);
    };
  };

  /// Get all active workflows.
  public shared ({ caller = _ }) func getActiveWorkflows() : async { #ok : [T.ScheduledWorkflow]; #err : Text } {
    #ok (ScheduledWorkflowLib.getActive(scheduledWorkflowState));
  };

}
