import Types "../types/smsFollowUp";
import Lib "../lib/smsFollowUp";

mixin (state : Types.State) {
  public shared func createSmsFollowUp(
    clientBusinessId : Text,
    verticalProfileId : Text,
    sequenceName : Text,
    sequenceType : Text,
    messageTemplates : Text,
    sendSchedule : Text,
    consentRequired : Bool,
    consentLogId : Text,
    approvalStatus : Text,
    n8nStatus : Text,
    sentCount : Nat,
    replyCount : Nat,
    optOutCount : Nat,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.SmsFollowUp = {
      id;
      clientBusinessId;
      verticalProfileId;
      sequenceName;
      sequenceType;
      messageTemplates;
      sendSchedule;
      consentRequired;
      consentLogId;
      approvalStatus;
      n8nStatus;
      sentCount;
      replyCount;
      optOutCount;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getSmsFollowUp(id : Text) : async { #ok : ?Types.SmsFollowUp; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateSmsFollowUp(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    sequenceName : Text,
    sequenceType : Text,
    messageTemplates : Text,
    sendSchedule : Text,
    consentRequired : Bool,
    consentLogId : Text,
    approvalStatus : Text,
    n8nStatus : Text,
    sentCount : Nat,
    replyCount : Nat,
    optOutCount : Nat,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.SmsFollowUp = {
      id;
      clientBusinessId;
      verticalProfileId;
      sequenceName;
      sequenceType;
      messageTemplates;
      sendSchedule;
      consentRequired;
      consentLogId;
      approvalStatus;
      n8nStatus;
      sentCount;
      replyCount;
      optOutCount;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteSmsFollowUp(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listSmsFollowUpsByClient(clientBusinessId : Text) : async { #ok : [Types.SmsFollowUp]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
