import Time "mo:core/Time";
import T "../types/complianceGuardrail";
import Lib "../lib/complianceGuardrail";

mixin (state : Lib.State) {
  public shared ({ caller }) func createComplianceGuardrailRecord(record : T.CreateRequest) : async { #ok : T.Record; #err : Text } {
    let id = Lib.generateId(state);
    let now = Time.now();
    let newRecord : T.Record = {
      id = id;
      clientBusinessId = record.clientBusinessId;
      verticalProfileId = record.verticalProfileId;
      ruleType = record.ruleType;
      severity = record.severity;
      status = record.status;
      data = record.data;
      createdAt = now;
      updatedAt = now;
    };
    Lib.save(state, newRecord);
    #ok(newRecord)
  };

  public shared query func getComplianceGuardrailRecord(id : Text) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?record) { #ok(record) };
      case null { #err("Record not found") };
    }
  };

  public shared ({ caller }) func updateComplianceGuardrailRecord(id : Text, record : T.UpdateRequest) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?existing) {
        let now = Time.now();
        let updated : T.Record = {
          existing with
          ruleType = record.ruleType;
          severity = record.severity;
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

  public shared ({ caller }) func deleteComplianceGuardrailRecord(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.delete(state, id)) {
      #ok("Deleted successfully")
    } else {
      #err("Record not found")
    }
  };

  public shared query func listComplianceGuardrailRecordsByClient(clientBusinessId : Text) : async { #ok : [T.Record]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId))
  };
}
