import Types "../types/verticalProfileRouter";
import Lib "../lib/verticalProfileRouter";

mixin (state : Types.State) {
  public shared func createVerticalProfileRouter(
    clientBusinessId : Text,
    verticalProfileId : Text,
    routeType : Text,
    routeTarget : Text,
    routeStatus : Text,
    routePriority : Nat,
    routeConfig : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.VerticalProfileRouter = {
      id;
      clientBusinessId;
      verticalProfileId;
      routeType;
      routeTarget;
      routeStatus;
      routePriority;
      routeConfig;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getVerticalProfileRouter(id : Text) : async { #ok : ?Types.VerticalProfileRouter; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateVerticalProfileRouter(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    routeType : Text,
    routeTarget : Text,
    routeStatus : Text,
    routePriority : Nat,
    routeConfig : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.VerticalProfileRouter = {
      id;
      clientBusinessId;
      verticalProfileId;
      routeType;
      routeTarget;
      routeStatus;
      routePriority;
      routeConfig;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteVerticalProfileRouter(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listVerticalProfileRoutersByClient(clientBusinessId : Text) : async { #ok : [Types.VerticalProfileRouter]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
