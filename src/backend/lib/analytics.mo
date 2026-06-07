import List "mo:core/List";
import Map "mo:core/Map";
import Float "mo:core/Float";
import AnalyticsTypes "../types/analytics";

module {
  /// Aggregate per-niche conversion funnel data from the lead list
  public func computeNicheConversionFunnels(
    leads : List.List<{ niche : Text; status : Text }>
  ) : [AnalyticsTypes.NicheConversionData] {
    let accumulator = Map.empty<Text, { var demos : Nat; var trials : Nat; var paid : Nat }>();
    for (lead in leads.values()) {
      let entry = switch (accumulator.get(lead.niche)) {
        case (?e) { e };
        case (null) {
          let e = { var demos : Nat = 0; var trials : Nat = 0; var paid : Nat = 0 };
          accumulator.add(lead.niche, e);
          e
        };
      };
      switch (lead.status) {
        case "demo_started" { entry.demos += 1 };
        case "trial"        { entry.trials += 1 };
        case "paid"         { entry.paid += 1 };
        case (_)            {};
      };
    };
    let result = List.empty<AnalyticsTypes.NicheConversionData>();
    for ((niche, e) in accumulator.entries()) {
      result.add({
        niche;
        demos_started    = e.demos;
        trials_activated = e.trials;
        paid_customers   = e.paid;
      });
    };
    result.toArray()
  };

  /// Find the niche with the highest trial-to-paid conversion rate
  public func computeTopPerformingNiche(
    funnels : [AnalyticsTypes.NicheConversionData]
  ) : ?AnalyticsTypes.NicheConversionData {
    var best : ?AnalyticsTypes.NicheConversionData = null;
    var bestRate : Float = -1.0;
    for (f in funnels.values()) {
      if (f.trials_activated > 0) {
        let rate = f.paid_customers.toFloat() / f.trials_activated.toFloat();
        if (rate > bestRate) {
          bestRate := rate;
          best := ?f;
        };
      };
    };
    best
  };

  /// Aggregate per-source quality data from the lead list
  public func computeLeadQualityBySource(
    leads : List.List<{ source : Text; status : Text; qualityScore : ?Nat }>
  ) : [AnalyticsTypes.SourceQualityData] {
    let accum = Map.empty<Text, {
      var total : Nat;
      var trials : Nat;
      var paid : Nat;
      var scoreSum : Nat;
      var scoreCount : Nat;
    }>();
    for (lead in leads.values()) {
      let e = switch (accum.get(lead.source)) {
        case (?e) { e };
        case (null) {
          let e = { var total : Nat = 0; var trials : Nat = 0; var paid : Nat = 0; var scoreSum : Nat = 0; var scoreCount : Nat = 0 };
          accum.add(lead.source, e);
          e
        };
      };
      e.total += 1;
      switch (lead.status) {
        case "trial" { e.trials += 1 };
        case "paid"  { e.trials += 1; e.paid += 1 };
        case (_) {};
      };
      switch (lead.qualityScore) {
        case (?s) { e.scoreSum += s; e.scoreCount += 1 };
        case (null) {};
      };
    };
    let result = List.empty<AnalyticsTypes.SourceQualityData>();
    for ((source, e) in accum.entries()) {
      let avgScore : Float = if (e.scoreCount > 0) {
        e.scoreSum.toFloat() / e.scoreCount.toFloat()
      } else { 0.0 };
      result.add({
        source;
        total_leads      = e.total;
        trials_converted = e.trials;
        paid_converted   = e.paid;
        avg_quality_score = avgScore;
      });
    };
    result.toArray()
  };
}
