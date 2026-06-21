import Types "../types/gbpPostAgent";
import Lib "../lib/gbpPostAgent";

mixin (state : Types.State) {
  public shared func createGbpPostAgent(
    clientBusinessId : Text,
    verticalProfileId : Text,
    postType : Text,
    title : Text,
    hook : Text,
    body : Text,
    cta : Text,
    ctaUrl : Text,
    serviceKeyword : Text,
    locationKeyword : Text,
    photoAsset : Text,
    startDate : Text,
    endDate : Text,
    approvalStatus : Text,
    n8nStatus : Text,
    publishedUrl : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.GbpPostAgent = {
      id;
      clientBusinessId;
      verticalProfileId;
      postType;
      title;
      hook;
      body;
      cta;
      ctaUrl;
      serviceKeyword;
      locationKeyword;
      photoAsset;
      startDate;
      endDate;
      approvalStatus;
      n8nStatus;
      publishedUrl;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getGbpPostAgent(id : Text) : async { #ok : ?Types.GbpPostAgent; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateGbpPostAgent(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    postType : Text,
    title : Text,
    hook : Text,
    body : Text,
    cta : Text,
    ctaUrl : Text,
    serviceKeyword : Text,
    locationKeyword : Text,
    photoAsset : Text,
    startDate : Text,
    endDate : Text,
    approvalStatus : Text,
    n8nStatus : Text,
    publishedUrl : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.GbpPostAgent = {
      id;
      clientBusinessId;
      verticalProfileId;
      postType;
      title;
      hook;
      body;
      cta;
      ctaUrl;
      serviceKeyword;
      locationKeyword;
      photoAsset;
      startDate;
      endDate;
      approvalStatus;
      n8nStatus;
      publishedUrl;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteGbpPostAgent(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listGbpPostAgentsByClient(clientBusinessId : Text) : async { #ok : [Types.GbpPostAgent]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
