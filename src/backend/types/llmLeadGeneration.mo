module {

  /// A single lead produced (and optionally enriched) by the LLM lead generation pipeline.
  public type GeneratedLead = {
    name           : Text;
    ownerFirstName : Text;
    phone          : Text;
    address        : Text;
    website        : Text;
    description    : Text;
    niche          : Text;
    city           : Text;
    source         : Text;  // "claude" | "openai" | "both"
    enriched       : Bool;
    temperature    : Text;  // "hot" | "warm" | "cold"
    score          : Nat;
  };

  /// Aggregate result returned by searchLeadsWithLLM.
  public type LLMLeadSearchResult = {
    leads          : [GeneratedLead];
    claudeCount    : Nat;
    openAICount    : Nat;
    enrichedCount  : Nat;
    serpApiUsed    : Bool;
    // Source breakdown per requirement
    serpApiCount   : Nat;   // leads found via SerpApi.dev first-pass
    tinyFishCount  : Nat;   // leads found via TinyFish Search fallback
    totalFound     : Nat;   // total unique leads before cap
    errors         : [Text];  // all real errors, never hidden
    searchedAt     : Int;
  };

};
