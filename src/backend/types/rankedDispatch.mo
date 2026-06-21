import Time "mo:core/Time";

module {

  public type RankedDispatchRoute = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    requestText : Text;
    matchedAgent : Text;
    status : RankedDispatchStatus;
    createdAt : Int;
    updatedAt : Int;
    notes : [Text];
  };

  public type RankedDispatchStatus = {
    #pending;
    #routed;
    #completed;
    #failed;
  };

  public type RankedDispatchRouteUpdate = {
    requestText : Text;
    matchedAgent : Text;
    status : RankedDispatchStatus;
    notes : [Text];
  };

};
