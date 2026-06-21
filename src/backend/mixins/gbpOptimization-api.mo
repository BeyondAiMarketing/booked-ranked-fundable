import Types "../types/gbpOptimization";
import Lib "../lib/gbpOptimization";

mixin (state : Types.State) {
  public shared func createGbpOptimization(
    clientBusinessId : Text,
    verticalProfileId : Text,
    optimizationType : Text,
    businessName : Text,
    address : Text,
    phone : Text,
    website : Text,
    categories : Text,
    description : Text,
    photos : Text,
    attributes : Text,
    serviceAreas : Text,
    hours : Text,
    optimizationScore : Nat,
    checklistStatus : Text,
    nextActions : Text,
    approvalStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.GbpOptimization = {
      id;
      clientBusinessId;
      verticalProfileId;
      optimizationType;
      businessName;
      address;
      phone;
      website;
      categories;
      description;
      photos;
      attributes;
      serviceAreas;
      hours;
      optimizationScore;
      checklistStatus;
      nextActions;
      approvalStatus;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getGbpOptimization(id : Text) : async { #ok : ?Types.GbpOptimization; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateGbpOptimization(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    optimizationType : Text,
    businessName : Text,
    address : Text,
    phone : Text,
    website : Text,
    categories : Text,
    description : Text,
    photos : Text,
    attributes : Text,
    serviceAreas : Text,
    hours : Text,
    optimizationScore : Nat,
    checklistStatus : Text,
    nextActions : Text,
    approvalStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.GbpOptimization = {
      id;
      clientBusinessId;
      verticalProfileId;
      optimizationType;
      businessName;
      address;
      phone;
      website;
      categories;
      description;
      photos;
      attributes;
      serviceAreas;
      hours;
      optimizationScore;
      checklistStatus;
      nextActions;
      approvalStatus;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteGbpOptimization(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listGbpOptimizationsByClient(clientBusinessId : Text) : async { #ok : [Types.GbpOptimization]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
