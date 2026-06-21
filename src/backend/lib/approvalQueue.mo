import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import T    "../types/approvalQueue";

module {

  public type State = {
    items   : Map.Map<Text, T.ApprovalItem>;
    records : List.List<T.ApprovalItemRecord>;
  };

  public func emptyState() : State = {
    items   = Map.empty<Text, T.ApprovalItem>();
    records = List.empty<T.ApprovalItemRecord>();
  };

  /// Create a new approval item.
  public func createItem(state : State, item : T.ApprovalItem) : () {
    state.items.add(item.id, item);
  };

  /// Retrieve an approval item by id.
  public func getItem(state : State, id : Text) : ?T.ApprovalItem {
    state.items.get(id);
  };

  /// Get all pending approvals for a tenant.
  public func getPendingByTenant(state : State, tenantId : Text) : [T.ApprovalItem] {
    let result = List.empty<T.ApprovalItem>();
    for (item in state.items.values()) {
      if (item.tenantId == tenantId and item.status == #pending) { result.add(item) };
    };
    result.toArray();
  };

  /// Get all approvals for a tenant.
  public func getByTenant(state : State, tenantId : Text) : [T.ApprovalItem] {
    let result = List.empty<T.ApprovalItem>();
    for (item in state.items.values()) {
      if (item.tenantId == tenantId) { result.add(item) };
    };
    result.toArray();
  };

  /// Get approvals by run id.
  public func getByRun(state : State, runId : Text) : [T.ApprovalItem] {
    let result = List.empty<T.ApprovalItem>();
    for (item in state.items.values()) {
      if (item.runId == runId) { result.add(item) };
    };
    result.toArray();
  };

  /// Resolve an approval item (approve or reject).
  public func resolveItem(state : State, id : Text, resolution : T.ApprovalResolution, _resolvedBy : Text) : Bool {
    switch (state.items.get(id)) {
      case (?item) {
        state.items.add(id, {
          item with
          status = resolution.status;
          resolvedAt = ?Time.now();
          approverNotes = resolution.notes;
        });
        true;
      };
      case null false;
    };
  };

  // ---- FLAT RECORDS ----

  public func addRecord(state : State, record : T.ApprovalItemRecord) : () {
    state.records.add(record);
  };

  public func resolveRecord(state : State, id : Text, status : Text, resolvedBy : Text, note : Text) : Bool {
    let now = Time.now();
    var found = false;
    state.records.mapInPlace(func(r : T.ApprovalItemRecord) : T.ApprovalItemRecord {
      if (r.id == id) {
        found := true;
        { r with status; resolvedBy = ?resolvedBy; resolutionNote = ?note; resolvedAt = ?now }
      } else { r }
    });
    found;
  };

  public func getPendingRecords(state : State, tenantId : Text) : [T.ApprovalItemRecord] {
    state.records.filter(func(r : T.ApprovalItemRecord) : Bool {
      r.tenantId == tenantId and r.status == "pending"
    }).toArray();
  };

  public func getRecordsByTenant(state : State, tenantId : Text) : [T.ApprovalItemRecord] {
    state.records.filter(func(r : T.ApprovalItemRecord) : Bool {
      r.tenantId == tenantId
    }).toArray();
  };

};
