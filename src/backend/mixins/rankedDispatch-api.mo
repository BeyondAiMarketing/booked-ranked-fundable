import Time "mo:core/Time";
import Text "mo:core/Text";
import T  "../types/rankedDispatch";
import Lib "../lib/rankedDispatch";

mixin (state : Lib.State) {

  public shared ({ caller = _ }) func createRankedDispatchRoute(
    clientBusinessId : Text,
    verticalProfileId : Text,
    requestText : Text,
  ) : async { #ok : T.RankedDispatchRoute; #err : Text } {
    let id = "rd-" # Time.now().toText() # "-" # clientBusinessId;
    let now = Time.now();
    let matchedAgent = Lib.matchAgent(requestText);
    let route : T.RankedDispatchRoute = {
      id;
      clientBusinessId;
      verticalProfileId;
      requestText;
      matchedAgent;
      status = #pending;
      createdAt = now;
      updatedAt = now;
      notes = [];
    };
    Lib.save(state, route);
    #ok route;
  };

  public shared query ({ caller = _ }) func getRankedDispatchRoute(id : Text) : async { #ok : T.RankedDispatchRoute; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?r) { #ok r };
      case null { #err ("No ranked dispatch route found for id: " # id) };
    };
  };

  public shared ({ caller = _ }) func updateRankedDispatchRoute(id : Text, upd : T.RankedDispatchRouteUpdate) : async { #ok : Text; #err : Text } {
    switch (Lib.update(state, id, upd)) {
      case (?_) { #ok "Ranked dispatch route updated." };
      case null { #err ("No ranked dispatch route found for id: " # id) };
    };
  };

  public shared ({ caller = _ }) func deleteRankedDispatchRoute(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.delete(state, id)) {
      #ok "Ranked dispatch route deleted.";
    } else {
      #err ("No ranked dispatch route found for id: " # id);
    };
  };

  public shared query ({ caller = _ }) func listRankedDispatchRoutesByClient(clientBusinessId : Text) : async { #ok : [T.RankedDispatchRoute]; #err : Text } {
    #ok (Lib.listByClientBusiness(state, clientBusinessId));
  };

  public shared query ({ caller = _ }) func listRankedDispatchRoutesByStatus(status : T.RankedDispatchStatus) : async { #ok : [T.RankedDispatchRoute]; #err : Text } {
    #ok (Lib.listByStatus(state, status));
  };

  public shared query ({ caller = _ }) func listAllRankedDispatchRoutes() : async { #ok : [T.RankedDispatchRoute]; #err : Text } {
    #ok (Lib.listAll(state));
  };

  public shared query ({ caller = _ }) func matchRankedAgent(requestText : Text) : async { #ok : Text; #err : Text } {
    #ok (Lib.matchAgent(requestText));
  };

};
