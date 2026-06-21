import Time "mo:core/Time";

module {

  public type ServiceAreaPageStatus = {
    #planned;
    #draft;
    #pending_approval;
    #approved;
    #published;
    #archived;
  };

  public type ServiceAreaPage = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    tenantId : Text;
    pageTitle : Text;
    targetUrl : Text;
    targetKeyword : Text;
    serviceArea : Text;
    targetLocations : [Text];
    services : [Text];
    pageContent : Text;
    metaDescription : Text;
    schemaMarkup : ?Text;
    internalLinks : [Text];
    externalLinks : [Text];
    photoAssets : [Text];
    status : ServiceAreaPageStatus;
    approvalRequestId : ?Text;
    publishedUrl : ?Text;
    seoScore : ?Nat;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type ServiceAreaPageUpdate = {
    pageTitle : ?Text;
    targetUrl : ?Text;
    targetKeyword : ?Text;
    serviceArea : ?Text;
    targetLocations : ?[Text];
    services : ?[Text];
    pageContent : ?Text;
    metaDescription : ?Text;
    schemaMarkup : ?Text;
    internalLinks : ?[Text];
    externalLinks : ?[Text];
    photoAssets : ?[Text];
    status : ?ServiceAreaPageStatus;
    approvalRequestId : ?Text;
    publishedUrl : ?Text;
    seoScore : ?Nat;
  };

  public type ServiceAreaOutline = {
    pageTitle : Text;
    targetKeyword : Text;
    serviceArea : Text;
    targetLocations : [Text];
    services : [Text];
    suggestedHeadings : [Text];
    metaDescription : Text;
    schemaType : Text;
  };

};
