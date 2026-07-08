import Map "mo:core/Map";
import Time "mo:core/Time";

module {

  // ── Provenance ─────────────────────────────────────────────────────────────

  /// Original format of an imported lead row.
  public type LeadSourceFormat = {
    #gosom;
    #omkar;
    #csv;
    #json;
  };

  /// Per-lead provenance record stored on import.
  public type LeadProvenance = {
    sourceTool    : Text;
    importDate    : Int;
    importerName  : Text;
    originalFormat: LeadSourceFormat;
  };

  // ── Rejection ──────────────────────────────────────────────────────────────

  /// Reason code for a rejected import row.
  public type RejectionReason = {
    #missingRequiredField;
    #invalidPhoneFormat;
    #invalidEmailFormat;
  };

  /// A rejected import row with its reason and the original raw input.
  public type RejectedRow = {
    reason   : RejectionReason;
    rowIndex : Nat;
    raw      : RawLeadInput;
  };

  // ── Lead Engine Lead ───────────────────────────────────────────────────────

  /// Raw input row accepted by the Lead Engine importer.
  /// Mirrors the columns needed for phone+email composite-key dedupe and
  /// provenance capture, independent of the legacy CSV importer shape.
  public type RawLeadInput = {
    businessName : Text;
    phone        : Text;
    email        : Text;
    niche        : Text;
    source       : Text;
    locationTags : [Text];
    sourceTags   : [Text];
  };

  /// A fully-imported Lead Engine lead record.
  public type LeadEngineLead = {
    id              : Text;
    tenantId        : Text;
    businessName    : Text;
    phone           : Text;
    email           : Text;
    niche           : Text;
    source          : Text;
    sourceTags      : [Text];
    locationTags    : [Text];
    status          : Text;
    isDuplicate     : Bool;
    provenance      : LeadProvenance;
    createdAt       : Int;
    // ── Step 2: dedupe + enrichment fields ──────────────────────────────────
    dedupeFlags     : [DedupeFlag];
    dedupeResolution : ?DedupeResolution;
    linkedLeadIds   : [Text];
    enrichmentResult : ?EnrichmentResult;
  };

  // ── Step 2: Dedupe ──────────────────────────────────────────────────────────

  /// Fields used to compute a composite dedupe match across imported leads.
  public type DedupeMatchField = {
    #domain;
    #phone;
    #email;
    #website;
    #address;
    #businessName;
  };

  /// A single duplicate flag on a lead, recording the matched field(s) and the
  /// id of the other lead it was flagged against.
  public type DedupeFlag = {
    matchedLeadId   : Text;
    matchedFields   : [DedupeMatchField];
    flaggedAt       : Int;
    importBatchId   : Text;
  };

  /// A group of leads flagged as potential duplicates of one another.
  public type DedupeGroup = {
    id              : Text;
    tenantId        : Text;
    leadIds         : [Text];
    matchedFields   : [DedupeMatchField];
    resolution      : ?DedupeResolution;
    createdAt       : Int;
    resolvedAt      : ?Int;
  };

  /// Resolution applied to a dedupe group / lead pair.
  public type DedupeResolution = {
    #Merged        : { mergedIntoLeadId : Text; mergedAwayLeadId : Text };
    #Ignored;
    #KeptSeparate;
    #Linked;
  };

  /// A persisted dedupe resolution action (audit log entry).
  public type DedupeResolutionLogEntry = {
    id              : Text;
    tenantId        : Text;
    groupId         : Text;
    leadIdA         : Text;
    leadIdB         : Text;
    resolution      : DedupeResolution;
    resolvedAt      : Int;
    resolvedBy      : Text;
  };

  // ── Step 2: Enrichment ─────────────────────────────────────────────────────

  /// A single enrichment field produced by the LLM fallback chain.
  public type EnrichmentField = {
    #inferredNiche      : Text;
    #companySize        : Text;
    #websiteSummary     : Text;
    #suggestedOutreachAngle : Text;
  };

  /// Result of enriching a single lead via the LLM fallback chain.
  public type EnrichmentResult = {
    leadId           : Text;
    fields           : [EnrichmentField];
    provider         : Text;
    failingProvider  : ?Text;
    enrichedAt       : Int;
    success          : Bool;
    errorMessage     : ?Text;
  };

  // ── Step 2: Lead Status ────────────────────────────────────────────────────

  /// Lifecycle status for a Lead Engine lead after dedupe + enrichment.
  public type LeadStatus = {
    #new;
    #flagged;
    #reviewed;
    #enriched;
    #ready;
  };

  // ── Step 2: List Leads Filters ─────────────────────────────────────────────

  /// Filters for the leadEngine_listLeads query.
  public type LeadListFilters = {
    dedupeStatus     : ?{ #flagged; #resolved; #any };
    enrichmentStatus : ?{ #enriched; #notEnriched; #any };
    batchId          : ?Text;
  };

  /// Paginated result for leadEngine_listLeads.
  public type LeadListPage = {
    leads    : [LeadEngineLead];
    total    : Nat;
    offset   : Nat;
    limit    : Nat;
  };

  // ── Import Batch ───────────────────────────────────────────────────────────

  /// Tracks a single Lead Engine import job.
  public type LeadEngineBatch = {
    id           : Text;
    tenantId     : Text;
    importerName : Text;
    sourceTool   : Text;
    totalRows    : Nat;
    imported     : Nat;
    skipped      : Nat;
    flagged      : Nat;
    rejected     : [RejectedRow];
    status       : Text;
    createdAt    : Int;
  };

  /// Result returned from leadEngine_importLeads.
  public type LeadEngineImportResult = {
    batchId       : Text;
    imported      : Nat;
    skipped       : Nat;
    flagged       : Nat;
    rejectedRows  : [RejectedRow];
  };

  // ── Lead Engine State ──────────────────────────────────────────────────────

  /// Stable state bucket for the Lead Engine.
  /// Per-tenant lead and batch maps are keyed by tenantId.
  public type LeadEngineState = {
    var leads             : Map.Map<Text, Map.Map<Text, LeadEngineLead>>;
    var batches           : Map.Map<Text, LeadEngineBatch>;
    // ── Step 2: dedupe + enrichment state ──────────────────────────────────
    var dedupeGroups      : Map.Map<Text, DedupeGroup>;
    var dedupeResolutionLog : Map.Map<Text, DedupeResolutionLogEntry>;
  };

  // ── Empty State constructor ────────────────────────────────────────────────

  public func emptyLeadEngineState() : LeadEngineState = {
    var leads                = Map.empty();
    var batches              = Map.empty();
    var dedupeGroups         = Map.empty();
    var dedupeResolutionLog  = Map.empty();
  };

  // ── Feature Flag ───────────────────────────────────────────────────────────

  /// Feature flag name used to gate all Lead Engine methods.
  public let LEAD_ENGINE_ENABLED_FLAG : Text = "LEAD_ENGINE_ENABLED";

};
