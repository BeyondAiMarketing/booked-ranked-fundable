module {

  public type LocationProfile = {
    id : Text;
    tenantId : Text;
    locationName : Text;
    address : Text;
    city : Text;
    state : Text;
    phoneNumber : Text; // dedicated Twilio number
    timezone : Text;
    status : Text;      // active | pending | inactive
    createdAt : Int;    // nanosecond timestamp
  };

};
