import Types "../types/rankedLocalSEO";
import Lib "../lib/rankedLocalSEO";

mixin (state : Types.State) {
  public shared func createRankedLocalSEO(
    clientBusinessId : Text,
    verticalProfileId : Text,
    auditType : Text,
    overallScore : Nat,
    gbpScore : Nat,
    citationScore : Nat,
    reviewScore : Nat,
    onPageScore : Nat,
    competitorScore : Nat,
    auditFindings : Text,
    criticalIssues : Text,
    importantIssues : Text,
    monitorIssues : Text,
    nextActions : Text,
    auditStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.RankedLocalSEO = {
      id;
      clientBusinessId;
      verticalProfileId;
      auditType;
      overallScore;
      gbpScore;
      citationScore;
      reviewScore;
      onPageScore;
      competitorScore;
      auditFindings;
      criticalIssues;
      importantIssues;
      monitorIssues;
      nextActions;
      auditStatus;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getRankedLocalSEO(id : Text) : async { #ok : ?Types.RankedLocalSEO; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateRankedLocalSEO(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    auditType : Text,
    overallScore : Nat,
    gbpScore : Nat,
    citationScore : Nat,
    reviewScore : Nat,
    onPageScore : Nat,
    competitorScore : Nat,
    auditFindings : Text,
    criticalIssues : Text,
    importantIssues : Text,
    monitorIssues : Text,
    nextActions : Text,
    auditStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.RankedLocalSEO = {
      id;
      clientBusinessId;
      verticalProfileId;
      auditType;
      overallScore;
      gbpScore;
      citationScore;
      reviewScore;
      onPageScore;
      competitorScore;
      auditFindings;
      criticalIssues;
      importantIssues;
      monitorIssues;
      nextActions;
      auditStatus;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteRankedLocalSEO(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listRankedLocalSEOsByClient(clientBusinessId : Text) : async { #ok : [Types.RankedLocalSEO]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
