import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import CompetitorTypes "../types/competitor";

module {

  public type CompetitorProfile = CompetitorTypes.CompetitorProfile;
  public type CompetitorAlert   = CompetitorTypes.CompetitorAlert;

  // Injected state slices + access control state type aliases expected by the mixin consumer.
  // The actor wires these in main.mo via `include CompetitorApiMixin(...)`.

  public mixin (
    accessControlState : AccessControl.State,
    competitorProfiles  : Map.Map<Text, CompetitorProfile>,
    competitorAlerts    : Map.Map<Text, CompetitorAlert>,
  ) {

    // ---- CompetitorProfile ----

    public shared ({ caller }) func upsertCompetitorProfile(profile : CompetitorProfile) : async () {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getCompetitorProfile(id : Text) : async ?CompetitorProfile {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getCompetitorProfilesByTenant(tenantId : Text) : async [CompetitorProfile] {
      Runtime.trap("not implemented");
    };

    public shared ({ caller }) func deleteCompetitorProfile(id : Text) : async () {
      Runtime.trap("not implemented");
    };

    // ---- CompetitorAlert ----

    public shared ({ caller }) func upsertCompetitorAlert(alert : CompetitorAlert) : async () {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getCompetitorAlertsByTenant(tenantId : Text) : async [CompetitorAlert] {
      Runtime.trap("not implemented");
    };

    public shared ({ caller }) func dismissCompetitorAlert(id : Text) : async Bool {
      Runtime.trap("not implemented");
    };

    public shared ({ caller }) func deleteCompetitorAlert(id : Text) : async () {
      Runtime.trap("not implemented");
    };

  };

};
