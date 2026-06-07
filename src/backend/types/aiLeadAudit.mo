module {

  /// A single AI-powered lead audit job, tracking website scan and scoring pipeline.
  public type LeadAuditJob = {
    id             : Text;
    tenantId       : Text;
    businessName   : Text;
    websiteUrl     : Text;
    niche          : Text;
    city           : ?Text;
    phone          : ?Text;
    email          : ?Text;
    /// pending | running | completed | failed
    status         : Text;
    /// fetching_website | scanning_social | analyzing_content | scoring | generating_insights | done
    stageProgress  : Text;
    createdAt      : Int;
    completedAt    : ?Int;
    errorMessage   : ?Text;
  };

  /// The full scored output of a completed lead audit.
  public type LeadAuditResult = {
    jobId                : Text;
    tenantId             : Text;
    businessName         : Text;
    websiteUrl           : Text;
    niche                : Text;
    websiteScore         : Nat;
    socialScore          : Nat;
    seoScore             : Nat;
    engagementScore      : Nat;
    growthScore          : Nat;
    totalScore           : Nat;
    /// Hot | Warm | Cold
    category             : Text;
    companySnapshot      : Text;
    socialMetrics        : Text;
    seoMetrics           : Text;
    aiInsights           : Text;
    foundingYear         : ?Text;
    socialLinkedin       : ?Text;
    socialFacebook       : ?Text;
    socialInstagram      : ?Text;
    firstTouchEmailSubject : Text;
    firstTouchEmailBody    : Text;
    /// 3-5 personalised pain-point angles for outreach copy
    painPointAngles        : [Text];
    /// high | medium | low
    outreachPriority       : Text;
    /// Alias for totalScore exposed on the public API
    overallScore           : Nat;
    kitPageSlug            : ?Text;
    pushedToCrm            : Bool;
    pushedAt               : ?Int;
    assignedCampaignId     : ?Text;
    interactionType        : ?Text;
    trialActivatedAt       : ?Int;
  };

  /// A batch job that groups many individual lead audit jobs together.
  public type BatchAuditJob = {
    id              : Text;
    tenantId        : Text;
    totalLeads      : Nat;
    processedLeads  : Nat;
    completedLeads  : Nat;
    failedLeads     : Nat;
    /// pending | running | completed
    status          : Text;
    createdAt       : Int;
    completedAt     : ?Int;
  };

  /// A dual-model parallel lead search job (Claude searches cityA, OpenAI searches cityB).
  public type DualModelSearchJob = {
    id                : Text;
    tenantId          : Text;
    niche             : Text;
    /// Claude is assigned to search this city
    cityA             : Text;
    /// OpenAI is assigned to search this city
    cityB             : Text;
    status            : { #pending; #running; #completed; #failed };
    claudeLeadsFound  : Nat;
    openaiLeadsFound  : Nat;
    totalLeadsStaged  : Nat;
    duplicatesRemoved : Nat;
    errorMessage      : ?Text;
    createdAt         : Int;
    completedAt       : ?Int;
  };

  /// Partial update record for DualModelSearchJob — all fields optional.
  public type DualModelSearchJobUpdate = {
    status            : ?{ #pending; #running; #completed; #failed };
    claudeLeadsFound  : ?Nat;
    openaiLeadsFound  : ?Nat;
    totalLeadsStaged  : ?Nat;
    duplicatesRemoved : ?Nat;
    errorMessage      : ?Text;
    completedAt       : ?Int;
  };

  /// A single lead record produced by a bulk/dual-model search operation.
  public type BulkLeadInput = {
    businessName    : Text;
    websiteUrl      : ?Text;
    city            : Text;
    state           : ?Text;
    phone           : ?Text;
    email           : ?Text;
    niche           : Text;
    reviewCount     : ?Nat;
    avgRating       : ?Float;
    /// e.g. "claude" | "openai" | "searxng"
    researchSource  : Text;
  };

};
