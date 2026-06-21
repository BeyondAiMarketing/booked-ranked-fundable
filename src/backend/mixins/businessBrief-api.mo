import Time "mo:core/Time";
import Text "mo:core/Text";
import T "../types/businessBrief";
import Lib "../lib/businessBrief";

mixin (state : Lib.State) {

  public shared ({ caller = _ }) func createBusinessBrief(
    clientBusinessId : Text,
    verticalProfileId : Text,
    businessName : Text,
    locationName : Text,
    website : Text,
    primaryKeyword : Text,
    serviceArea : Text,
    targetLocations : [Text],
    services : [Text],
    currentFindings : [Text],
    criticalFindings : [Text],
    importantFindings : [Text],
    monitorFindings : [Text],
    toolsRun : [Text],
    deliverables : [Text],
    nextAction : Text,
    sessionLog : [Text],
    approvalConfig : Text,
    performanceHistory : [T.PerformanceHistoryEntry],
    localSEOHistory : [T.LocalSEOHistoryEntry],
    reviewHistory : [T.ReviewHistoryEntry],
    contentHistory : [T.ContentHistoryEntry],
    fundingHistory : [T.FundingHistoryEntry],
  ) : async { #ok : T.BusinessBrief; #err : Text } {
    let id = "bb-" # Time.now().toText() # "-" # businessName.toLower();
    let brief : T.BusinessBrief = {
      id;
      clientBusinessId;
      verticalProfileId;
      businessName;
      locationName;
      website;
      primaryKeyword;
      serviceArea;
      targetLocations;
      services;
      currentFindings;
      criticalFindings;
      importantFindings;
      monitorFindings;
      toolsRun;
      deliverables;
      nextAction;
      sessionLog;
      approvalConfig;
      performanceHistory;
      localSEOHistory;
      reviewHistory;
      contentHistory;
      fundingHistory;
      lastUpdated = Time.now();
    };
    Lib.save(state, brief);
    #ok brief;
  };

  public shared query ({ caller = _ }) func getBusinessBrief(id : Text) : async { #ok : T.BusinessBrief; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?b) { #ok b };
      case null { #err ("No business brief found for id: " # id) };
    };
  };

  public shared ({ caller = _ }) func updateBusinessBrief(id : Text, update : T.BusinessBriefUpdate) : async { #ok : Text; #err : Text } {
    switch (Lib.update(state, id, update)) {
      case (?_) { #ok "Business brief updated." };
      case null { #err ("No business brief found for id: " # id) };
    };
  };

  public shared query ({ caller = _ }) func listBusinessBriefsByClient(clientBusinessId : Text) : async { #ok : [T.BusinessBrief]; #err : Text } {
    #ok (Lib.listByClientBusiness(state, clientBusinessId));
  };

};
