import Time "mo:core/Time";
import T "../types/campaignBuilder";
import Lib "../lib/campaignBuilder";

mixin (state : Lib.State) {
  public shared ({ caller }) func createCampaignBuilderRecord(record : T.CreateRequest) : async { #ok : T.Record; #err : Text } {
    let id = Lib.generateId(state);
    let now = Time.now();
    let newRecord : T.Record = {
      id = id;
      clientBusinessId = record.clientBusinessId;
      verticalProfileId = record.verticalProfileId;
      campaignType = record.campaignType;
      status = record.status;
      data = record.data;
      createdAt = now;
      updatedAt = now;
    };
    Lib.save(state, newRecord);
    #ok(newRecord)
  };

  public shared query func getCampaignBuilderRecord(id : Text) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?record) { #ok(record) };
      case null { #err("Record not found") };
    }
  };

  public shared ({ caller }) func updateCampaignBuilderRecord(id : Text, record : T.UpdateRequest) : async { #ok : T.Record; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?existing) {
        let now = Time.now();
        let updated : T.Record = {
          existing with
          campaignType = record.campaignType;
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

  public shared ({ caller }) func deleteCampaignBuilderRecord(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.delete(state, id)) {
      #ok("Deleted successfully")
    } else {
      #err("Record not found")
    }
  };

  public shared query func listCampaignBuilderRecordsByClient(clientBusinessId : Text) : async { #ok : [T.Record]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId))
  };
}
