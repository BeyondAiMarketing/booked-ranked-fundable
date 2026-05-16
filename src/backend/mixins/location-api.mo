import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import LocationTypes "../types/location";

module {

  public type LocationProfile = LocationTypes.LocationProfile;

  public mixin (
    accessControlState : AccessControl.State,
    locationProfiles   : Map.Map<Text, LocationProfile>,
  ) {

    public shared ({ caller }) func upsertLocationProfile(profile : LocationProfile) : async () {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getLocationProfile(id : Text) : async ?LocationProfile {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getLocationProfilesByTenant(tenantId : Text) : async [LocationProfile] {
      Runtime.trap("not implemented");
    };

    public shared ({ caller }) func deleteLocationProfile(id : Text) : async () {
      Runtime.trap("not implemented");
    };

  };

};
