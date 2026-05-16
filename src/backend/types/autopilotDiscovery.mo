module {

  /// Configuration controlling the daily autopilot discovery engine.
  public type DiscoveryConfig = {
    /// Whether the scheduled daily job is active.
    enabled        : Bool;
    /// Interval in seconds between discovery runs (default 86400 = 24h).
    intervalSecs   : Nat;
    /// Four cities to search — Claude gets the first two, OpenAI the last two.
    cities         : [Text];
    /// Niche to search (e.g. "plumber", "med-spa", "HVAC"). One per job run.
    niche          : Text;
    /// Max leads to pull per city per model (capped at 50).
    leadsPerCity   : Nat;
    /// Daily cap on new leads created (safety valve).
    dailyCap       : Nat;
  };

  /// Outcome of a single lead returned by an AI model.
  public type DiscoveredLead = {
    businessName : Text;
    phone        : ?Text;
    website      : ?Text;
    email        : ?Text;
    address      : ?Text;
    /// 0–100 composite score
    score        : Nat;
    /// "Hot" | "Warm" | "Cold"
    tier         : Text;
    /// Missing-info flags, e.g. ["no_reviews", "no_website"]
    gapFlags     : [Text];
    /// "claude" | "openai"
    model        : Text;
    city         : Text;
    niche        : Text;
    /// "enrichment-pending" | "enriched" | "enrichment-skipped"
    enrichmentStatus : Text;
  };

  /// A full scheduled discovery job record — one stored per daily tick.
  public type ScheduledDiscoveryJob = {
    id               : Text;
    /// ISO-like timestamp label (canister nanoseconds).
    startedAt        : Int;
    completedAt      : ?Int;
    /// "running" | "completed" | "failed"
    status           : Text;
    config           : DiscoveryConfig;
    claudeLeads      : Nat;
    openaiLeads      : Nat;
    totalBeforeDedup : Nat;
    duplicatesRemoved: Nat;
    totalCreated     : Nat;
    enrichedCount    : Nat;
    enrichPending    : Nat;
    errorMessage     : ?Text;
  };

};
