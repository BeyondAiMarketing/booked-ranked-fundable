import Types "../types/socialContentCalendarAgent";
import Lib "../lib/socialContentCalendarAgent";

mixin (state : Types.State) {
  public shared func createSocialContentCalendarAgent(
    clientBusinessId : Text,
    verticalProfileId : Text,
    calendarMonth : Text,
    platform : Text,
    pillar : Text,
    format : Text,
    objective : Text,
    topic : Text,
    angle : Text,
    visualDirection : Text,
    cta : Text,
    postDate : Text,
    approvalStatus : Text,
    n8nStatus : Text,
    publishedUrl : Text,
    performanceNotes : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.SocialContentCalendarAgent = {
      id;
      clientBusinessId;
      verticalProfileId;
      calendarMonth;
      platform;
      pillar;
      format;
      objective;
      topic;
      angle;
      visualDirection;
      cta;
      postDate;
      approvalStatus;
      n8nStatus;
      publishedUrl;
      performanceNotes;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getSocialContentCalendarAgent(id : Text) : async { #ok : ?Types.SocialContentCalendarAgent; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateSocialContentCalendarAgent(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    calendarMonth : Text,
    platform : Text,
    pillar : Text,
    format : Text,
    objective : Text,
    topic : Text,
    angle : Text,
    visualDirection : Text,
    cta : Text,
    postDate : Text,
    approvalStatus : Text,
    n8nStatus : Text,
    publishedUrl : Text,
    performanceNotes : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.SocialContentCalendarAgent = {
      id;
      clientBusinessId;
      verticalProfileId;
      calendarMonth;
      platform;
      pillar;
      format;
      objective;
      topic;
      angle;
      visualDirection;
      cta;
      postDate;
      approvalStatus;
      n8nStatus;
      publishedUrl;
      performanceNotes;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteSocialContentCalendarAgent(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listSocialContentCalendarAgentsByClient(clientBusinessId : Text) : async { #ok : [Types.SocialContentCalendarAgent]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
