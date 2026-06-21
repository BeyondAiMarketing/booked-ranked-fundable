import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat  "mo:core/Nat";
import T    "../types/marketingAudit";

module {

  public type State = {
    audits : Map.Map<Text, T.MarketingAudit>;
    var idCounter : Nat;
  };

  public func emptyState() : State = {
    audits = Map.empty<Text, T.MarketingAudit>();
    var idCounter = 0;
  };

  public func generateId(state : State) : Text {
    state.idCounter += 1;
    "ma-" # state.idCounter.toText() # "-" # Time.now().toText();
  };

  public func save(state : State, audit : T.MarketingAudit) : () {
    state.audits.add(audit.id, audit);
  };

  public func get(state : State, id : Text) : ?T.MarketingAudit {
    state.audits.get(id);
  };

  public func update(state : State, id : Text, upd : T.MarketingAuditUpdate) : ?T.MarketingAudit {
    switch (state.audits.get(id)) {
      case null { null };
      case (?existing) {
        let updated : T.MarketingAudit = {
          existing with
          website = switch (upd.website) { case (?v) v; case null existing.website };
          industry = switch (upd.industry) { case (?v) v; case null existing.industry };
          serviceArea = switch (upd.serviceArea) { case (?v) v; case null existing.serviceArea };
          offer = switch (upd.offer) { case (?v) v; case null existing.offer };
          targetCustomer = switch (upd.targetCustomer) { case (?v) v; case null existing.targetCustomer };
          goals = switch (upd.goals) { case (?v) v; case null existing.goals };
          knownCompetitors = switch (upd.knownCompetitors) { case (?v) v; case null existing.knownCompetitors };
          leadValue = switch (upd.leadValue) { case (?v) v; case null existing.leadValue };
          conversionGoal = switch (upd.conversionGoal) { case (?v) v; case null existing.conversionGoal };
          overallScore = switch (upd.overallScore) { case (?v) v; case null existing.overallScore };
          grade = switch (upd.grade) { case (?v) v; case null existing.grade };
          executiveSummary = switch (upd.executiveSummary) { case (?v) v; case null existing.executiveSummary };
          categoryScores = switch (upd.categoryScores) { case (?v) v; case null existing.categoryScores };
          brfScore = switch (upd.brfScore) { case (?v) v; case null existing.brfScore };
          quickWins = switch (upd.quickWins) { case (?v) v; case null existing.quickWins };
          strategicRecommendations = switch (upd.strategicRecommendations) { case (?v) v; case null existing.strategicRecommendations };
          longTermInitiatives = switch (upd.longTermInitiatives) { case (?v) v; case null existing.longTermInitiatives };
          estimatedRevenueImpact = switch (upd.estimatedRevenueImpact) { case (?v) ?v; case null existing.estimatedRevenueImpact };
          recommendedPackage = switch (upd.recommendedPackage) { case (?v) v; case null existing.recommendedPackage };
          proposalReadySummary = switch (upd.proposalReadySummary) { case (?v) v; case null existing.proposalReadySummary };
          status = switch (upd.status) { case (?v) v; case null existing.status };
          updatedAt = switch (upd.updatedAt) { case (?v) v; case null Time.now() };
        };
        state.audits.add(id, updated);
        ?updated;
      };
    };
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.MarketingAudit] {
    let out = List.empty<T.MarketingAudit>();
    for ((_, audit) in state.audits.entries()) {
      if (audit.clientBusinessId == clientBusinessId) { out.add(audit) };
    };
    out.toArray();
  };

  public func getLatestByClient(state : State, clientBusinessId : Text) : ?T.MarketingAudit {
    var latest : ?T.MarketingAudit = null;
    for ((_, audit) in state.audits.entries()) {
      if (audit.clientBusinessId == clientBusinessId) {
        switch (latest) {
          case null { latest := ?audit };
          case (?l) { if (audit.createdAt > l.createdAt) { latest := ?audit } };
        };
      };
    };
    latest;
  };

  public func remove(state : State, id : Text) : Bool {
    switch (state.audits.get(id)) {
      case (?_) { state.audits.remove(id); true };
      case null { false };
    };
  };

  /// Hybrid scoring: instant rules-based calculation.
  /// Returns category scores and BRF breakdown.
  public func calculateScores(input : T.MarketingAuditInput) : [T.MarketingAuditScore] {
    let baseScores : [T.MarketingAuditScore] = [
      {
        category = #ContentMessaging;
        weight = 25;
        score = calculateContentScore(input);
        findings = [];
      },
      {
        category = #ConversionOptimization;
        weight = 20;
        score = calculateConversionScore(input);
        findings = [];
      },
      {
        category = #SEODiscoverability;
        weight = 20;
        score = calculateSEOScore(input);
        findings = [];
      },
      {
        category = #CompetitivePositioning;
        weight = 15;
        score = calculateCompetitiveScore(input);
        findings = [];
      },
      {
        category = #BrandTrust;
        weight = 10;
        score = calculateBrandScore(input);
        findings = [];
      },
      {
        category = #GrowthStrategy;
        weight = 10;
        score = calculateGrowthScore(input);
        findings = [];
      },
    ];
    baseScores;
  };

  public func calculateBRFScore(categoryScores : [T.MarketingAuditScore]) : T.BRFScore {
    var booked = 0;
    var ranked = 0;
    var funded = 0;
    var overall = 0;

    for (cs in categoryScores.vals()) {
      overall += (cs.score * cs.weight) / 100;
      switch (cs.category) {
        case (#ConversionOptimization or #BrandTrust) {
          booked += (cs.score * cs.weight) / 100;
        };
        case (#ContentMessaging or #SEODiscoverability or #CompetitivePositioning) {
          ranked += (cs.score * cs.weight) / 100;
        };
        case (#GrowthStrategy) {
          funded += (cs.score * cs.weight) / 100;
        };
      };
    };

    {
      bookedScore = Nat.min(booked, 100);
      rankedScore = Nat.min(ranked, 100);
      fundedScore = Nat.min(funded, 100);
      overallScore = Nat.min(overall, 100);
      bookedFindings = [];
      rankedFindings = [];
      fundedFindings = [];
    };
  };

  public func gradeFromScore(score : Nat) : Text {
    if (score >= 90) { "A" }
    else if (score >= 80) { "B" }
    else if (score >= 70) { "C" }
    else if (score >= 60) { "D" }
    else { "F" };
  };

  // ---- Internal scoring helpers (rules-based) ----

  func calculateContentScore(input : T.MarketingAuditInput) : Nat {
    var score = 50;
    if (input.offer != "") { score += 15 };
    if (input.targetCustomer != "") { score += 15 };
    if (input.goals.size() > 0) { score += 10 };
    if (input.website != "") { score += 10 };
    Nat.min(score, 100);
  };

  func calculateConversionScore(input : T.MarketingAuditInput) : Nat {
    var score = 40;
    if (input.leadValue > 0) { score += 20 };
    if (input.conversionGoal != "") { score += 20 };
    if (input.website != "") { score += 10 };
    if (input.serviceArea != "") { score += 10 };
    Nat.min(score, 100);
  };

  func calculateSEOScore(input : T.MarketingAuditInput) : Nat {
    var score = 40;
    if (input.website != "") { score += 20 };
    if (input.industry != "") { score += 15 };
    if (input.serviceArea != "") { score += 15 };
    if (input.knownCompetitors.size() > 0) { score += 10 };
    Nat.min(score, 100);
  };

  func calculateCompetitiveScore(input : T.MarketingAuditInput) : Nat {
    var score = 45;
    if (input.knownCompetitors.size() > 0) { score += 25 };
    if (input.industry != "") { score += 15 };
    if (input.serviceArea != "") { score += 15 };
    Nat.min(score, 100);
  };

  func calculateBrandScore(input : T.MarketingAuditInput) : Nat {
    var score = 50;
    if (input.website != "") { score += 20 };
    if (input.offer != "") { score += 15 };
    if (input.goals.size() > 0) { score += 15 };
    Nat.min(score, 100);
  };

  func calculateGrowthScore(input : T.MarketingAuditInput) : Nat {
    var score = 45;
    if (input.goals.size() > 0) { score += 20 };
    if (input.leadValue > 0) { score += 20 };
    if (input.conversionGoal != "") { score += 15 };
    Nat.min(score, 100);
  };

}
