import Time "mo:core/Time";
import T "../types/approvalRouter";
import Lib "../lib/approvalRouter";

mixin (state : Lib.State) {
  public shared ({ caller }) func createApprovalRouterRecord(record : T.CreateRequest) : async { #ok : T.Record; #err : Text } {
    let id = Lib.generateId(state);
    let now = Time.now();
    let newRecord : T.Record = {
      id = id;
      clientBusinessId = record.clientBusinessId;
      verticalProfileId = record.verticalProfileId;
      approvalTier = record.approvalTier;
      status = record.status;
      data = record.data;
      createdAt = now;
      updatedAt = now;
    };
    Lib.save(state, newRecord);
    #ok(newRecord)
  };

  public shared query func getApprovalRouterRecord(id : Text) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?record) { #ok(record) };
      case null { #err("Record not found") };
    }
  };

  public shared ({ caller }) func updateApprovalRouterRecord(id : Text, record : T.UpdateRequest) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?existing) {
        let now = Time.now();
        let updated : T.Record = {
          existing with
          approvalTier = record.approvalTier;
          status = record.status;
          data = record.data;
          updatedAt = now;
        };
        if (Lib.update(state, id, updated)) {
          #ok(updated)
        } else {
          #err("Update failed")
        }
      };
      case null { #err("Record not found") };
    }
  };

  public shared ({ caller }) func deleteApprovalRouterRecord(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.delete(state, id)) {
      #ok("Deleted successfully")
    } else {
      #err("Record not found")
    }
  };

  public shared query func listApprovalRouterRecordsByClient(clientBusinessId : Text) : async { #ok : [T.Record]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId))
  };
}
