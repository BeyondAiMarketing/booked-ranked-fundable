import ServiceAreaSEOLib "../lib/serviceAreaSEO";
import T                  "../types/serviceAreaSEO";

mixin (serviceAreaSEOState : ServiceAreaSEOLib.State) {

  /// Create or replace a service area page. Admin/owner callers only.
  public shared ({ caller = _ }) func saveServiceAreaPage(page : T.ServiceAreaPage) : async { #ok : Text; #err : Text } {
    ServiceAreaSEOLib.savePage(serviceAreaSEOState, page);
    #ok "Service area page saved.";
  };

  /// Retrieve a service area page by id. Admin/owner callers only.
  public shared ({ caller = _ }) func getServiceAreaPage(id : Text) : async { #ok : T.ServiceAreaPage; #err : Text } {
    switch (ServiceAreaSEOLib.getPage(serviceAreaSEOState, id)) {
      case (?p)  { #ok p };
      case null  { #err ("No service area page found for id: " # id) };
    };
  };

  /// Get all service area pages for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getServiceAreaPagesByTenant(tenantId : Text) : async { #ok : [T.ServiceAreaPage]; #err : Text } {
    #ok (ServiceAreaSEOLib.getPagesByTenant(serviceAreaSEOState, tenantId));
  };

  /// Get all service area pages for a client business. Admin/owner callers only.
  public shared ({ caller = _ }) func getServiceAreaPagesByClient(clientBusinessId : Text) : async { #ok : [T.ServiceAreaPage]; #err : Text } {
    #ok (ServiceAreaSEOLib.getPagesByClient(serviceAreaSEOState, clientBusinessId));
  };

  /// Get service area pages by status for a tenant. Admin/owner callers only.
  public shared ({ caller = _ }) func getServiceAreaPagesByStatus(tenantId : Text, status : T.ServiceAreaPageStatus) : async { #ok : [T.ServiceAreaPage]; #err : Text } {
    #ok (ServiceAreaSEOLib.getPagesByStatus(serviceAreaSEOState, tenantId, status));
  };

  /// Apply a partial update to a service area page. Admin/owner callers only.
  public shared ({ caller = _ }) func updateServiceAreaPage(id : Text, update : T.ServiceAreaPageUpdate) : async { #ok : Text; #err : Text } {
    if (ServiceAreaSEOLib.updatePage(serviceAreaSEOState, id, update)) {
      #ok "Service area page updated.";
    } else {
      #err ("No service area page found for id: " # id);
    };
  };

  /// Remove a service area page. Admin/owner callers only.
  public shared ({ caller = _ }) func removeServiceAreaPage(id : Text) : async { #ok : Text; #err : Text } {
    if (ServiceAreaSEOLib.removePage(serviceAreaSEOState, id)) {
      #ok "Service area page removed.";
    } else {
      #err ("No service area page found for id: " # id);
    };
  };

  /// Generate a service area page outline from business context. Admin/owner callers only.
  public shared ({ caller = _ }) func generateServiceAreaOutline(
    businessName : Text,
    serviceArea : Text,
    targetLocations : [Text],
    services : [Text],
    primaryKeyword : Text,
  ) : async { #ok : T.ServiceAreaOutline; #err : Text } {
    #ok (ServiceAreaSEOLib.generateOutline(businessName, serviceArea, targetLocations, services, primaryKeyword));
  };

};
