import Map "mo:core/Map";
import List "mo:core/List";
import AnalyticsTypes "../types/analytics";
import AnalyticsLib "../lib/analytics";

mixin (
  leads : Map.Map<Text, Map.Map<Text, { id : Text; tenantId : Text; name : Text; email : Text; phone : Text; niche : Text; status : Text; source : Text; notes : Text; agentSubscriptions : [Text]; createdAt : Int }>>
) {
  /// Flatten leads map and compute per-niche conversion funnel data
  public query func getNicheConversionFunnels() : async [AnalyticsTypes.NicheConversionData] {
    let flat = List.empty<{ niche : Text; status : Text }>();
    for (tenantLeads in leads.values()) {
      for (lead in tenantLeads.values()) {
        flat.add({ niche = lead.niche; status = lead.status });
      };
    };
    AnalyticsLib.computeNicheConversionFunnels(flat)
  };

  /// Returns the niche with the highest trial-to-paid conversion rate
  public query func getTopPerformingNiche() : async ?AnalyticsTypes.NicheConversionData {
    let flat = List.empty<{ niche : Text; status : Text }>();
    for (tenantLeads in leads.values()) {
      for (lead in tenantLeads.values()) {
        flat.add({ niche = lead.niche; status = lead.status });
      };
    };
    let funnels = AnalyticsLib.computeNicheConversionFunnels(flat);
    AnalyticsLib.computeTopPerformingNiche(funnels)
  };

  /// Flatten leads map and compute per-source quality data
  public query func getLeadQualityBySource() : async [AnalyticsTypes.SourceQualityData] {
    let flat = List.empty<{ source : Text; status : Text; qualityScore : ?Nat }>();
    for (tenantLeads in leads.values()) {
      for (lead in tenantLeads.values()) {
        flat.add({ source = lead.source; status = lead.status; qualityScore = null });
      };
    };
    AnalyticsLib.computeLeadQualityBySource(flat)
  };
}
