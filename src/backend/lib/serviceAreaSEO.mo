import Array "mo:core/Array";
import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import T    "../types/serviceAreaSEO";

module {

  public type State = {
    pages : Map.Map<Text, T.ServiceAreaPage>;
  };

  public func emptyState() : State = {
    pages = Map.empty();
  };

  // ---- CRUD ----

  public func savePage(state : State, page : T.ServiceAreaPage) : () {
    state.pages.add(page.id, page);
  };

  public func getPage(state : State, id : Text) : ?T.ServiceAreaPage {
    state.pages.get(id);
  };

  public func getPagesByTenant(state : State, tenantId : Text) : [T.ServiceAreaPage] {
    let result = List.empty<T.ServiceAreaPage>();
    for (p in state.pages.values()) {
      if (p.tenantId == tenantId) { result.add(p) };
    };
    result.toArray();
  };

  public func getPagesByClient(state : State, clientBusinessId : Text) : [T.ServiceAreaPage] {
    let result = List.empty<T.ServiceAreaPage>();
    for (p in state.pages.values()) {
      if (p.clientBusinessId == clientBusinessId) { result.add(p) };
    };
    result.toArray();
  };

  public func getPagesByStatus(state : State, tenantId : Text, status : T.ServiceAreaPageStatus) : [T.ServiceAreaPage] {
    let result = List.empty<T.ServiceAreaPage>();
    for (p in state.pages.values()) {
      if (p.tenantId == tenantId and p.status == status) { result.add(p) };
    };
    result.toArray();
  };

  public func updatePage(state : State, id : Text, update : T.ServiceAreaPageUpdate) : Bool {
    switch (state.pages.get(id)) {
      case (?existing) {
        let updated : T.ServiceAreaPage = {
          existing with
          pageTitle        = switch (update.pageTitle)        { case (?v) v; case null existing.pageTitle        };
          targetUrl        = switch (update.targetUrl)        { case (?v) v; case null existing.targetUrl        };
          targetKeyword    = switch (update.targetKeyword)    { case (?v) v; case null existing.targetKeyword    };
          serviceArea      = switch (update.serviceArea)      { case (?v) v; case null existing.serviceArea      };
          targetLocations  = switch (update.targetLocations)  { case (?v) v; case null existing.targetLocations  };
          services         = switch (update.services)         { case (?v) v; case null existing.services         };
          pageContent      = switch (update.pageContent)      { case (?v) v; case null existing.pageContent      };
          metaDescription  = switch (update.metaDescription)  { case (?v) v; case null existing.metaDescription  };
          schemaMarkup     = switch (update.schemaMarkup)     { case (?v) ?v; case null existing.schemaMarkup     };
          internalLinks    = switch (update.internalLinks)    { case (?v) v; case null existing.internalLinks    };
          externalLinks    = switch (update.externalLinks)    { case (?v) v; case null existing.externalLinks    };
          photoAssets      = switch (update.photoAssets)      { case (?v) v; case null existing.photoAssets      };
          status           = switch (update.status)           { case (?v) v; case null existing.status           };
          approvalRequestId= switch (update.approvalRequestId){ case (?v) ?v; case null existing.approvalRequestId};
          publishedUrl     = switch (update.publishedUrl)     { case (?v) ?v; case null existing.publishedUrl     };
          seoScore         = switch (update.seoScore)         { case (?v) ?v; case null existing.seoScore         };
          updatedAt        = Time.now();
        };
        state.pages.add(id, updated);
        true;
      };
      case null false;
    };
  };

  public func removePage(state : State, id : Text) : Bool {
    switch (state.pages.get(id)) {
      case (?_) { state.pages.remove(id); true };
      case null false;
    };
  };

  // ---- OUTLINE GENERATION ----

  public func generateOutline(
    businessName : Text,
    serviceArea : Text,
    targetLocations : [Text],
    services : [Text],
    primaryKeyword : Text,
  ) : T.ServiceAreaOutline {
    let locationPhrase = if (targetLocations.size() > 0) {
      targetLocations[0];
    } else {
      serviceArea;
    };

    let pageTitle = businessName # " — " # primaryKeyword # " in " # locationPhrase;
    let metaDesc = "Professional " # primaryKeyword # " serving " # locationPhrase # ". " # businessName # " delivers quality service. Call today for a free consultation.";

    let baseHeadings = [
      "About " # businessName # " in " # locationPhrase,
      "Our " # primaryKeyword # " Services",
      "Why Choose Us for " # primaryKeyword # " in " # locationPhrase,
      "Service Areas We Cover",
      "Get Your Free " # primaryKeyword # " Quote",
    ];

    let serviceHeadings = services.map(func(s) { s # " Services in " # locationPhrase });

    let allHeadings = baseHeadings.concat(serviceHeadings);

    {
      pageTitle = pageTitle;
      targetKeyword = primaryKeyword;
      serviceArea = serviceArea;
      targetLocations = targetLocations;
      services = services;
      suggestedHeadings = allHeadings;
      metaDescription = metaDesc;
      schemaType = "LocalBusiness";
    };
  };

};
