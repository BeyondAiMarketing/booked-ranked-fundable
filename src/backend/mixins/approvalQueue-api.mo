import ApprovalQueueLib "../lib/approvalQueue";
import T                  "../types/approvalQueue";

mixin (approvalQueueState : ApprovalQueueLib.State) {

  /// Create a new approval item. Admin/owner callers only.
  public shared ({ caller = _ }) func createApprovalItem(item : T.ApprovalItem) : async { #ok : Text; #err : Text } {
    ApprovalQueueLib.createItem(approvalQueueState, item);
    #ok "Approval item created.";
  };

  /// Retrieve an approval item by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getApprovalItem(id : Text) : async { #ok : T.ApprovalItem; #err : Text } {
    switch (ApprovalQueueLib.getItem(approvalQueueState, id)) {
      case (?i)  { #ok i };
      case null  { #err ("No approval item found for id: " # id) };
    };
  };

  /// Get all pending approvals for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getPendingApprovalsByTenant(tenantId : Text) : async { #ok : [T.ApprovalItem]; #err : Text } {
    #ok (ApprovalQueueLib.getPendingByTenant(approvalQueueState, tenantId));
  };

  /// Get all approvals for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getApprovalsByTenant(tenantId : Text) : async { #ok : [T.ApprovalItem]; #err : Text } {
    #ok (ApprovalQueueLib.getByTenant(approvalQueueState, tenantId));
  };

  /// Get approvals by run id. Admin/owner callers only.
  public shared ({ caller = _ }) func getApprovalsByRun(runId : Text) : async { #ok : [T.ApprovalItem]; #err : Text } {
    #ok (ApprovalQueueLib.getByRun(approvalQueueState, runId));
  };

  /// Resolve an approval item (approve or reject). Admin/owner callers only.
  public shared ({ caller = _ }) func resolveApprovalItem(id : Text, resolution : T.ApprovalResolution, resolvedBy : Text) : async { #ok : Text; #err : Text } {
    if (ApprovalQueueLib.resolveItem(approvalQueueState, id, resolution, resolvedBy)) {
      #ok "Approval item resolved.";
    } else {
      #err ("No approval item found for id: " # id);
    };
  };

  /// Add a flat approval record. Admin/owner callers only.
  public shared ({ caller = _ }) func addApprovalRecord(record : T.ApprovalItemRecord) : async { #ok : Text; #err : Text } {
    ApprovalQueueLib.addRecord(approvalQueueState, record);
    #ok "Approval record added.";
  };

  /// Resolve a flat approval record. Admin/owner callers only.
  public shared ({ caller = _ }) func resolveApprovalRecord(id : Text, status : Text, resolvedBy : Text, note : Text) : async { #ok : Text; #err : Text } {
    if (ApprovalQueueLib.resolveRecord(approvalQueueState, id, status, resolvedBy, note)) {
      #ok "Approval record resolved.";
    } else {
      #err ("No approval record found for id: " # id);
    };
  };

  /// Get pending flat records for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getPendingApprovalRecords(tenantId : Text) : async { #ok : [T.ApprovalItemRecord]; #err : Text } {
    #ok (ApprovalQueueLib.getPendingRecords(approvalQueueState, tenantId));
  };

  /// Get all flat records for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getApprovalRecordsByTenant(tenantId : Text) : async { #ok : [T.ApprovalItemRecord]; #err : Text } {
    #ok (ApprovalQueueLib.getRecordsByTenant(approvalQueueState, tenantId));
  };

};
