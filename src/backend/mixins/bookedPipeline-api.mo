import Time "mo:core/Time";
import T "../types/bookedPipeline";
import Lib "../lib/bookedPipeline";

mixin (state : Lib.State) {
  public shared ({ caller }) func createBookedPipelineRecord(record : T.CreateRequest) : async { #ok : T.Record; #err : Text } {
    let id = Lib.generateId(state);
    let now = Time.now();
    let newRecord : T.Record = {
      id = id;
      clientBusinessId = record.clientBusinessId;
      verticalProfileId = record.verticalProfileId;
      stage = record.stage;
      data = record.data;
      createdAt = now;
      updatedAt = now;
    };
    Lib.save(state, newRecord);
    #ok(newRecord)
  };

  public shared query func getBookedPipelineRecord(id : Text) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?record) { #ok(record) };
      case null { #err("Record not found") };
    }
  };

  public shared ({ caller }) func updateBookedPipelineRecord(id : Text, record : T.UpdateRequest) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?existing) {
        let now = Time.now();
        let updated : T.Record = {
          existing with
          stage = record.stage;
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

  public shared ({ caller }) func deleteBookedPipelineRecord(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.delete(state, id)) {
      #ok("Deleted successfully")
    } else {
      #err("Record not found")
    }
  };

  public shared query func listBookedPipelineRecordsByClient(clientBusinessId : Text) : async { #ok : [T.Record]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId))
  };
}
