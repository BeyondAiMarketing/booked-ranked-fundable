import Types "../types/prospectAudit";
import Lib "../lib/prospectAudit";

mixin (state : Types.State) {
  public shared func createProspectAudit(
    clientBusinessId : Text,
    verticalProfileId : Text,
    websiteUrl : Text,
    auditScore : Nat,
    auditGrade : Text,
    bookedScore : Nat,
    rankedScore : Nat,
    fundedScore : Nat,
    executiveSummary : Text,
    quickWins : Text,
    strategicRecommendations : Text,
    longTermInitiatives : Text,
    revenueImpact : Text,
    recommendedPackage : Text,
    auditStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.ProspectAudit = {
      id;
      clientBusinessId;
      verticalProfileId;
      websiteUrl;
      auditScore;
      auditGrade;
      bookedScore;
      rankedScore;
      fundedScore;
      executiveSummary;
      quickWins;
      strategicRecommendations;
      longTermInitiatives;
      revenueImpact;
      recommendedPackage;
      auditStatus;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getProspectAudit(id : Text) : async { #ok : ?Types.ProspectAudit; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateProspectAudit(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    websiteUrl : Text,
    auditScore : Nat,
    auditGrade : Text,
    bookedScore : Nat,
    rankedScore : Nat,
    fundedScore : Nat,
    executiveSummary : Text,
    quickWins : Text,
    strategicRecommendations : Text,
    longTermInitiatives : Text,
    revenueImpact : Text,
    recommendedPackage : Text,
    auditStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.ProspectAudit = {
      id;
      clientBusinessId;
      verticalProfileId;
      websiteUrl;
      auditScore;
      auditGrade;
      bookedScore;
      rankedScore;
      fundedScore;
      executiveSummary;
      quickWins;
      strategicRecommendations;
      longTermInitiatives;
      revenueImpact;
      recommendedPackage;
      auditStatus;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteProspectAudit(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listProspectAuditsByClient(clientBusinessId : Text) : async { #ok : [Types.ProspectAudit]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
