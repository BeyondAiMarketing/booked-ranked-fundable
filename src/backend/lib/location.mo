import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Types "../types/location";

module {

  public type LocationProfile = Types.LocationProfile;

  public func list(
    store : Map.Map<Text, LocationProfile>,
    tenantId : Text,
  ) : [LocationProfile] {
    Runtime.trap("not implemented");
  };

  public func get(
    store : Map.Map<Text, LocationProfile>,
    id : Text,
  ) : ?LocationProfile {
    Runtime.trap("not implemented");
  };

  public func upsert(
    store : Map.Map<Text, LocationProfile>,
    profile : LocationProfile,
  ) {
    Runtime.trap("not implemented");
  };

  public func delete(
    store : Map.Map<Text, LocationProfile>,
    id : Text,
  ) {
    Runtime.trap("not implemented");
  };

};
