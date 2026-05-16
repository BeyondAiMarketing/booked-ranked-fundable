import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Types "../types/competitor";

module {

  public type CompetitorProfile = Types.CompetitorProfile;
  public type CompetitorAlert   = Types.CompetitorAlert;

  // ---- CompetitorProfile CRUD ----

  public func listProfiles(
    store : Map.Map<Text, CompetitorProfile>,
    tenantId : Text,
  ) : [CompetitorProfile] {
    Runtime.trap("not implemented");
  };

  public func getProfile(
    store : Map.Map<Text, CompetitorProfile>,
    id : Text,
  ) : ?CompetitorProfile {
    Runtime.trap("not implemented");
  };

  public func upsertProfile(
    store : Map.Map<Text, CompetitorProfile>,
    profile : CompetitorProfile,
  ) {
    Runtime.trap("not implemented");
  };

  public func deleteProfile(
    store : Map.Map<Text, CompetitorProfile>,
    id : Text,
  ) {
    Runtime.trap("not implemented");
  };

  // ---- CompetitorAlert CRUD ----

  public func listAlerts(
    store : Map.Map<Text, CompetitorAlert>,
    tenantId : Text,
  ) : [CompetitorAlert] {
    Runtime.trap("not implemented");
  };

  public func getAlert(
    store : Map.Map<Text, CompetitorAlert>,
    id : Text,
  ) : ?CompetitorAlert {
    Runtime.trap("not implemented");
  };

  public func upsertAlert(
    store : Map.Map<Text, CompetitorAlert>,
    alert : CompetitorAlert,
  ) {
    Runtime.trap("not implemented");
  };

  public func dismissAlert(
    store : Map.Map<Text, CompetitorAlert>,
    id : Text,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func deleteAlert(
    store : Map.Map<Text, CompetitorAlert>,
    id : Text,
  ) {
    Runtime.trap("not implemented");
  };

};
