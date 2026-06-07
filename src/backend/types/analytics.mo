import Time "mo:core/Time";

module {
  /// Per-niche conversion funnel counts
  public type NicheConversionData = {
    niche : Text;
    demos_started : Nat;
    trials_activated : Nat;
    paid_customers : Nat;
  };

  /// Per-source lead quality breakdown
  public type SourceQualityData = {
    source : Text;
    total_leads : Nat;
    trials_converted : Nat;
    paid_converted : Nat;
    avg_quality_score : Float;
  };

  /// Snapshot used internally to track trial-to-paid conversion rate per niche
  public type NicheConversionRate = {
    niche : Text;
    rate : Float;
  };
}
