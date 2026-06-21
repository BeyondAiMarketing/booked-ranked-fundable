import WorkflowLogLib "../lib/workflowLog";
import T             "../types/workflowLog";

mixin (workflowLogState : WorkflowLogLib.State) {

  /// Log a single workflow step. Admin/owner callers only.
  public shared ({ caller = _ }) func logWorkflowEntry(entry : T.WorkflowLogEntry) : async { #ok : Text; #err : Text } {
    WorkflowLogLib.logEntry(workflowLogState, entry);
    #ok "Workflow entry logged.";
  };

  /// Get all log entries for a workflow. Admin/owner callers only.
  public shared ({ caller = _ }) func getWorkflowLogsByWorkflow(workflowId : Text) : async { #ok : [T.WorkflowLogEntry]; #err : Text } {
    #ok (WorkflowLogLib.getLogsByWorkflow(workflowLogState, workflowId));
  };

  /// Get all log entries for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getWorkflowLogsByTenant(tenantId : Text) : async { #ok : [T.WorkflowLogEntry]; #err : Text } {
    #ok (WorkflowLogLib.getLogsByTenant(workflowLogState, tenantId));
  };

  /// Save or update a workflow status snapshot. Admin/owner callers only.
  public shared ({ caller = _ }) func saveWorkflowSnapshot(snapshot : T.WorkflowStatusSnapshot) : async { #ok : Text; #err : Text } {
    WorkflowLogLib.saveSnapshot(workflowLogState, snapshot);
    #ok "Workflow snapshot saved.";
  };

  /// Get the latest status snapshot for a workflow. Admin/owner callers only.
  public shared ({ caller = _ }) func getWorkflowSnapshot(workflowId : Text) : async { #ok : T.WorkflowStatusSnapshot; #err : Text } {
    switch (WorkflowLogLib.getSnapshot(workflowLogState, workflowId)) {
      case (?s)  { #ok s };
      case null  { #err ("No snapshot found for workflow: " # workflowId) };
    };
  };

  /// Get all snapshots for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getWorkflowSnapshotsByTenant(tenantId : Text) : async { #ok : [T.WorkflowStatusSnapshot]; #err : Text } {
    #ok (WorkflowLogLib.getSnapshotsByTenant(workflowLogState, tenantId));
  };

};
