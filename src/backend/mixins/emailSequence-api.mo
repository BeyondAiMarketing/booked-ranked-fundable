import Types "../types/emailSequence";
import Lib "../lib/emailSequence";

mixin (state : Types.State) {
  public shared func createEmailSequence(
    clientBusinessId : Text,
    verticalProfileId : Text,
    sequenceName : Text,
    sequenceType : Text,
    campaignType : Text,
    steps : Text,
    subjectLines : Text,
    bodyTemplates : Text,
    sendSchedule : Text,
    unsubscribeLink : Text,
    consentRequired : Bool,
    approvalStatus : Text,
    n8nStatus : Text,
    sentCount : Nat,
    replyCount : Nat,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.EmailSequence = {
      id;
      clientBusinessId;
      verticalProfileId;
      sequenceName;
      sequenceType;
      campaignType;
      steps;
      subjectLines;
      bodyTemplates;
      sendSchedule;
      unsubscribeLink;
      consentRequired;
      approvalStatus;
      n8nStatus;
      sentCount;
      replyCount;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getEmailSequence(id : Text) : async { #ok : ?Types.EmailSequence; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateEmailSequence(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    sequenceName : Text,
    sequenceType : Text,
    campaignType : Text,
    steps : Text,
    subjectLines : Text,
    bodyTemplates : Text,
    sendSchedule : Text,
    unsubscribeLink : Text,
    consentRequired : Bool,
    approvalStatus : Text,
    n8nStatus : Text,
    sentCount : Nat,
    replyCount : Nat,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.EmailSequence = {
      id;
      clientBusinessId;
      verticalProfileId;
      sequenceName;
      sequenceType;
      campaignType;
      steps;
      subjectLines;
      bodyTemplates;
      sendSchedule;
      unsubscribeLink;
      consentRequired;
      approvalStatus;
      n8nStatus;
      sentCount;
      replyCount;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteEmailSequence(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listEmailSequencesByClient(clientBusinessId : Text) : async { #ok : [Types.EmailSequence]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
