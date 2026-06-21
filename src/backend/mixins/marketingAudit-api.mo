import Time "mo:core/Time";
import Text "mo:core/Text";
import T  "../types/marketingAudit";
import Lib "../lib/marketingAudit";

mixin (state : Lib.State) {

  public shared ({ caller = _ }) func createMarketingAudit(input : T.MarketingAuditInput) : async { #ok : T.MarketingAudit; #err : Text } {
    let id = Lib.generateId(state);
    let now = Time.now();
    let categoryScores = Lib.calculateScores(input);
    let brfScore = Lib.calculateBRFScore(categoryScores);
    let overallScore = brfScore.overallScore;
    let grade = Lib.gradeFromScore(overallScore);

    let audit : T.MarketingAudit = {
      id;
      clientBusinessId = input.clientBusinessId;
      verticalProfileId = input.verticalProfileId;
      website = input.website;
      industry = input.industry;
      serviceArea = input.serviceArea;
      offer = input.offer;
      targetCustomer = input.targetCustomer;
      goals = input.goals;
      knownCompetitors = input.knownCompetitors;
      leadValue = input.leadValue;
      conversionGoal = input.conversionGoal;
      overallScore;
      grade;
      executiveSummary = "";
      categoryScores;
      brfScore;
      quickWins = [];
      strategicRecommendations = [];
      longTermInitiatives = [];
      estimatedRevenueImpact = null;
      recommendedPackage = "";
      proposalReadySummary = "";
      status = #pending;
      createdAt = now;
      updatedAt = now;
    };
    Lib.save(state, audit);
    #ok audit;
  };

  public shared query ({ caller = _ }) func getMarketingAudit(id : Text) : async ?T.MarketingAudit {
    Lib.get(state, id);
  };

  public shared ({ caller = _ }) func updateMarketingAudit(id : Text, update : T.MarketingAuditUpdate) : async ?T.MarketingAudit {
    Lib.update(state, id, update);
  };

  public shared query ({ caller = _ }) func listMarketingAuditsByClient(clientBusinessId : Text) : async [T.MarketingAudit] {
    Lib.listByClient(state, clientBusinessId);
  };

  public shared query ({ caller = _ }) func getLatestMarketingAudit(clientBusinessId : Text) : async ?T.MarketingAudit {
    Lib.getLatestByClient(state, clientBusinessId);
  };

  public shared ({ caller = _ }) func deleteMarketingAudit(id : Text) : async Bool {
    Lib.remove(state, id);
  };

  public shared query ({ caller = _ }) func calculateMarketingAuditScore(input : T.MarketingAuditInput) : async { #ok : { categoryScores : [T.MarketingAuditScore]; brfScore : T.BRFScore; overallScore : Nat; grade : Text }; #err : Text } {
    let categoryScores = Lib.calculateScores(input);
    let brfScore = Lib.calculateBRFScore(categoryScores);
    let overallScore = brfScore.overallScore;
    let grade = Lib.gradeFromScore(overallScore);
    #ok { categoryScores; brfScore; overallScore; grade };
  };

}
