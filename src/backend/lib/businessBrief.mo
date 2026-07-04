import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import T "../types/businessBrief";
import List "mo:core/List";

module {
  public type State = {
    briefs : Map.Map<Text, T.BusinessBrief>;
  };

  public func emptyState() : State {
    { briefs = Map.empty() };
  };

  public func save(state : State, brief : T.BusinessBrief) : () {
    state.briefs.add(brief.id, brief);
  };

  public func get(state : State, id : Text) : ?T.BusinessBrief {
    state.briefs.get(id);
  };

  public func update(state : State, id : Text, update : T.BusinessBriefUpdate) : ?T.BusinessBrief {
    switch (state.briefs.get(id)) {
      case (null) { null };
      case (?existing) {
        let updated : T.BusinessBrief = {
          existing with
          clientBusinessId = update.clientBusinessId;
          verticalProfileId = update.verticalProfileId;
          businessName = update.businessName;
          locationName = update.locationName;
          website = update.website;
          primaryKeyword = update.primaryKeyword;
          serviceArea = update.serviceArea;
          targetLocations = update.targetLocations;
          services = update.services;
          currentFindings = update.currentFindings;
          criticalFindings = update.criticalFindings;
          importantFindings = update.importantFindings;
          monitorFindings = update.monitorFindings;
          toolsRun = update.toolsRun;
          deliverables = update.deliverables;
          nextAction = update.nextAction;
          sessionLog = update.sessionLog;
          approvalConfig = update.approvalConfig;
          performanceHistory = update.performanceHistory;
          localSEOHistory = update.localSEOHistory;
          reviewHistory = update.reviewHistory;
          contentHistory = update.contentHistory;
          fundingHistory = update.fundingHistory;
          lastUpdated = Time.now();
        };
        state.briefs.add(id, updated);
        ?updated;
      };
    };
  };

  public func listByClientBusiness(state : State, clientBusinessId : Text) : [T.BusinessBrief] {
    let out = List.empty<T.BusinessBrief>();
    for ((id, brief) in state.briefs.entries()) {
      if (brief.clientBusinessId == clientBusinessId) {
        out.add(brief);
      };
    };
    out.toArray();
  };
}
