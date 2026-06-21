import Types "../types/monthlyPerformanceReview";
import Lib "../lib/monthlyPerformanceReview";

mixin (state : Types.State) {
  public shared func createMonthlyPerformanceReview(
    clientBusinessId : Text,
    verticalProfileId : Text,
    reviewMonth : Text,
    contentPerformance : Text,
    campaignPerformance : Text,
    bestPerformers : Text,
    worstPerformers : Text,
    engagementMetrics : Text,
    conversionMetrics : Text,
    strategyChanges : Text,
    nextMonthCalendar : Text,
    recommendations : Text,
    approvalStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Text; #err : Text } {
    let id = Lib.generateId(state);
    let item : Types.MonthlyPerformanceReview = {
      id;
      clientBusinessId;
      verticalProfileId;
      reviewMonth;
      contentPerformance;
      campaignPerformance;
      bestPerformers;
      worstPerformers;
      engagementMetrics;
      conversionMetrics;
      strategyChanges;
      nextMonthCalendar;
      recommendations;
      approvalStatus;
      createdAt;
      updatedAt;
    };
    Lib.save(state, item);
    #ok(id);
  };

  public shared func getMonthlyPerformanceReview(id : Text) : async { #ok : ?Types.MonthlyPerformanceReview; #err : Text } {
    #ok(Lib.get(state, id));
  };

  public shared func updateMonthlyPerformanceReview(
    id : Text,
    clientBusinessId : Text,
    verticalProfileId : Text,
    reviewMonth : Text,
    contentPerformance : Text,
    campaignPerformance : Text,
    bestPerformers : Text,
    worstPerformers : Text,
    engagementMetrics : Text,
    conversionMetrics : Text,
    strategyChanges : Text,
    nextMonthCalendar : Text,
    recommendations : Text,
    approvalStatus : Text,
    createdAt : Nat,
    updatedAt : Nat
  ) : async { #ok : Bool; #err : Text } {
    let item : Types.MonthlyPerformanceReview = {
      id;
      clientBusinessId;
      verticalProfileId;
      reviewMonth;
      contentPerformance;
      campaignPerformance;
      bestPerformers;
      worstPerformers;
      engagementMetrics;
      conversionMetrics;
      strategyChanges;
      nextMonthCalendar;
      recommendations;
      approvalStatus;
      createdAt;
      updatedAt;
    };
    #ok(Lib.update(state, id, item));
  };

  public shared func deleteMonthlyPerformanceReview(id : Text) : async { #ok : Bool; #err : Text } {
    #ok(Lib.delete(state, id));
  };

  public shared func listMonthlyPerformanceReviewsByClient(clientBusinessId : Text) : async { #ok : [Types.MonthlyPerformanceReview]; #err : Text } {
    #ok(Lib.listByClient(state, clientBusinessId));
  };
};
