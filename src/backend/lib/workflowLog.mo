import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import T    "../types/workflowLog";

module {

  public type State = {
    logs     : Map.Map<Text, T.WorkflowLogEntry>;
    snapshots : Map.Map<Text, T.WorkflowStatusSnapshot>;
  };

  public func emptyState() : State = {
    logs      = Map.empty();
    snapshots = Map.empty();
  };

  /// Log a single workflow step.
  public func logEntry(state : State, entry : T.WorkflowLogEntry) : () {
    state.logs.add(entry.id, entry);
  };

  /// Get all log entries for a workflow.
  public func getLogsByWorkflow(state : State, workflowId : Text) : [T.WorkflowLogEntry] {
    let result = List.empty<T.WorkflowLogEntry>();
    for (entry in state.logs.values()) {
      if (entry.workflowId == workflowId) { result.add(entry) };
    };
    result.toArray();
  };

  /// Get all log entries for a tenant.
  public func getLogsByTenant(state : State, tenantId : Text) : [T.WorkflowLogEntry] {
    let result = List.empty<T.WorkflowLogEntry>();
    for (entry in state.logs.values()) {
      if (entry.tenantId == tenantId) { result.add(entry) };
    };
    result.toArray();
  };

  /// Save or update a workflow status snapshot.
  public func saveSnapshot(state : State, snapshot : T.WorkflowStatusSnapshot) : () {
    state.snapshots.add(snapshot.workflowId, snapshot);
  };

  /// Get the latest status snapshot for a workflow.
  public func getSnapshot(state : State, workflowId : Text) : ?T.WorkflowStatusSnapshot {
    state.snapshots.get(workflowId);
  };

  /// Get all snapshots for a tenant.
  public func getSnapshotsByTenant(state : State, tenantId : Text) : [T.WorkflowStatusSnapshot] {
    let result = List.empty<T.WorkflowStatusSnapshot>();
    for (snap in state.snapshots.values()) {
      if (snap.tenantId == tenantId) { result.add(snap) };
    };
    result.toArray();
  };

};
