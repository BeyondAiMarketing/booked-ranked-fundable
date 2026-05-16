import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Types "../types/attribution";

module {

  public type AttributionTouch        = Types.AttributionTouch;
  public type LeadAttributionRecord   = Types.LeadAttributionRecord;

  public func list(
    store : Map.Map<Text, LeadAttributionRecord>,
    tenantId : Text,
  ) : [LeadAttributionRecord] {
    Runtime.trap("not implemented");
  };

  public func getByLead(
    store : Map.Map<Text, LeadAttributionRecord>,
    tenantId : Text,
    leadId : Text,
  ) : [LeadAttributionRecord] {
    Runtime.trap("not implemented");
  };

  public func get(
    store : Map.Map<Text, LeadAttributionRecord>,
    id : Text,
  ) : ?LeadAttributionRecord {
    Runtime.trap("not implemented");
  };

  public func upsert(
    store : Map.Map<Text, LeadAttributionRecord>,
    record : LeadAttributionRecord,
  ) {
    Runtime.trap("not implemented");
  };

  public func addTouch(
    store : Map.Map<Text, LeadAttributionRecord>,
    id : Text,
    touch : AttributionTouch,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func delete(
    store : Map.Map<Text, LeadAttributionRecord>,
    id : Text,
  ) {
    Runtime.trap("not implemented");
  };

};
