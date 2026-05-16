module {

  /// Extended lead record that carries the extra fields arriving from a GBP CSV export.
  /// All new fields are optional so existing Lead records are never broken.
  public type ExtendedLead = {
    // ---- Core fields (mirrors the base Lead type) ----
    id              : Text;
    tenantId        : Text;
    name            : Text;
    email           : Text;
    phone           : Text;
    niche           : Text;
    status          : Text;
    source          : Text;
    notes           : Text;
    agentSubscriptions : [Text];
    createdAt       : Int;
    // ---- Extended CSV fields ----
    gbpLink             : ?Text;
    rating              : ?Text;
    totalReviews        : ?Text;
    address             : ?Text;
    website             : ?Text;
    claimStatus         : ?Text;
    optimizationScore   : ?Text;
    localAds            : ?Text;
    paidAds             : ?Text;
    googleRanking       : ?Text;
    threePackRanking    : ?Text;
    aiSuggestedServices : ?Text;
    // ---- Import metadata ----
    emailVerified       : Bool;
    importBatchId       : ?Text;
  };

  /// Input record for a single lead being bulk-imported from a CSV.
  /// Matches the columns present in the user-supplied CSV file.
  public type ExtendedLeadInput = {
    businessName        : Text;
    gbpLink             : ?Text;
    rating              : ?Text;
    totalReviews        : ?Text;
    address             : ?Text;
    website             : ?Text;
    phone               : ?Text;
    email               : ?Text;
    claimStatus         : ?Text;
    optimizationScore   : ?Text;
    localAds            : ?Text;
    paidAds             : ?Text;
    googleRanking       : ?Text;
    threePackRanking    : ?Text;
    aiSuggestedServices : ?Text;
    /// Caller-supplied niche; will be normalised / auto-detected if empty
    niche               : ?Text;
  };

  /// Tracks a single bulk CSV import job.
  public type CsvImportBatch = {
    id               : Text;
    tenantId         : Text;
    fileName         : Text;
    totalLeads       : Nat;
    imported         : Nat;
    skipped          : Nat;
    flaggedNoEmail   : Nat;
    nicheBreakdown   : [(Text, Nat)];
    /// pending | processing | complete | failed
    status           : Text;
    createdAt        : Int;
  };

  /// Result returned from bulkImportLeads.
  public type BulkImportResult = {
    batchId  : Text;
    imported : Nat;
    skipped  : Nat;
    flagged  : Nat;
  };

};
