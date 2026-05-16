import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import Runtime "mo:core/Runtime";
import AttributionTypes "../types/attribution";

module {

  public type AttributionTouch      = AttributionTypes.AttributionTouch;
  public type LeadAttributionRecord = AttributionTypes.LeadAttributionRecord;

  public mixin (
    accessControlState     : AccessControl.State,
    leadAttributionRecords : Map.Map<Text, LeadAttributionRecord>,
  ) {

    public shared ({ caller }) func upsertLeadAttribution(record : LeadAttributionRecord) : async () {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getLeadAttributionsByTenant(tenantId : Text) : async [LeadAttributionRecord] {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getLeadAttributionsByLead(tenantId : Text, leadId : Text) : async [LeadAttributionRecord] {
      Runtime.trap("not implemented");
    };

    public query ({ caller }) func getLeadAttribution(id : Text) : async ?LeadAttributionRecord {
      Runtime.trap("not implemented");
    };

    public shared ({ caller }) func addAttributionTouch(id : Text, touch : AttributionTouch) : async Bool {
      Runtime.trap("not implemented");
    };

    public shared ({ caller }) func deleteLeadAttribution(id : Text) : async () {
      Runtime.trap("not implemented");
    };

  };

};
