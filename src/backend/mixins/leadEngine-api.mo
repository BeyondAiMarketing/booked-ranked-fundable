import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall       "mo:caffeineai-http-outcalls/outcall";
import LeadEngineLib "../lib/leadEngine";
import T             "../types/lead-engine";
import FTTypes       "../types/featureToggle";
import ICTypes       "../types/integrationCredentials";
import ICLib         "../lib/integrationCredentials";
import LLMFallbackLib "../lib/llm-fallback";
import ORLib         "../lib/openRouter";
import ORTypes       "../types/openRouter";
import LLMFT         "../types/llm-fallback";
import Map           "mo:core/Map";
import List          "mo:core/List";
import Text           "mo:core/Text";
import Time          "mo:core/Time";
import Runtime       "mo:core/Runtime";

/// Mixin that owns all Lead Engine importer API endpoints.
/// State slices injected (mirrors the leadAI-api.mo pattern):
///   - accessControlState : AccessControl.AccessControlState
///   - leadEngineState    : T.LeadEngineState
///   - featureToggles     : Map<Text, FTTypes.FeatureToggle>  (for LEAD_ENGINE_ENABLED gate)
///   - transform           : HTTP outcall transform reference
///   - integrationCreds    : Map<Text, ICTypes.IntegrationCredentials>
///   - credSalt            : Blob
///   - llmFallbackState    : LLMFallbackLib.State (for enrichment via routeLLM)
///   - openRouterState     : ORLib.State (Generic-tier fallback for routeLLM)
mixin (
  accessControlState : AccessControl.AccessControlState,
  leadEngineState    : T.LeadEngineState,
  featureToggles     : Map.Map<Text, FTTypes.FeatureToggle>,
  transform          : shared query Outcall.TransformationInput -> async Outcall.TransformationOutput,
  integrationCreds   : Map.Map<Text, ICTypes.IntegrationCredentials>,
  credSalt           : Blob,
  llmFallbackState   : LLMFallbackLib.State,
  openRouterState    : ORLib.State,
) {

  /// Returns true when the LEAD_ENGINE_ENABLED feature flag is on for any tier.
  /// Defaults to false (disabled) when the flag is absent — additive only.
  private func leadEngineEnabled() : Bool {
    switch (featureToggles.get(T.LEAD_ENGINE_ENABLED_FLAG)) {
      case (?ft) { ft.basicEnabled or ft.proEnabled or ft.agencyEnabled };
      case (null) { false };
    };
  };

  /// Bulk-import leads into the Lead Engine store.
  /// Accepts an array of RawLeadInput rows and returns a LeadEngineImportResult
  /// with batchId, imported/skipped/flagged counts, and rejected rows with reasons.
  public shared ({ caller }) func leadEngine_importLeads(
    tenantId     : Text,
    importerName : Text,
    sourceTool   : Text,
    batch        : [T.RawLeadInput],
  ) : async T.LeadEngineImportResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    let now = Time.now();
    let batchId = LeadEngineLib.makeBatchId(now);
    let provenance : T.LeadProvenance = {
      sourceTool     = sourceTool;
      importDate     = now;
      importerName   = importerName;
      originalFormat = #csv;
    };
    // Ensure the tenant has a lead map.
    let tenantLeads = switch (leadEngineState.leads.get(tenantId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Text, T.LeadEngineLead>() };
    };
    var imported = 0;
    var skipped  = 0;
    var flagged  = 0;
    let rejected = List.empty<T.RejectedRow>();
    let importedLeadIds = List.empty<Text>();
    var idx = 0;
    for (row in batch.values()) {
      switch (LeadEngineLib.validateRow(row)) {
        case (?reason) {
          rejected.add({ reason; rowIndex = idx; raw = row });
        };
        case (null) {
          let leadId = LeadEngineLib.makeLeadId(batchId, idx);
          let isDup = tenantLeads.get(LeadEngineLib.dedupeKey(row.phone, row.email)) != null;
          let lead = LeadEngineLib.toLead(row, leadId, tenantId, isDup, provenance);
          let wasImported = LeadEngineLib.upsertLead(tenantLeads, lead);
          if (wasImported) {
            imported += 1;
            importedLeadIds.add(leadId);
          } else {
            skipped  += 1;
            flagged  += 1;
          };
        };
      };
      idx += 1;
    };
    leadEngineState.leads.add(tenantId, tenantLeads);
    // Run cross-field dedupe (domain, phone, email, website, address, business
    // name) over the freshly imported leads to populate DedupeGroup records
    // and per-lead dedupeFlags. Only leads that were actually imported (not
    // rejected by the Step 1 phone+email composite-key upsert) are considered.
    let importedLeadIdsArr = importedLeadIds.toArray();
    if (importedLeadIdsArr.size() > 0) {
      let dedupeGroups = LeadEngineLib.detectDuplicates(
        leadEngineState,
        tenantId,
        batchId,
        importedLeadIdsArr,
      );
      flagged += dedupeGroups.size();
    };
    let rejectedArr = rejected.toArray();
    let batchRecord : T.LeadEngineBatch = {
      id           = batchId;
      tenantId     = tenantId;
      importerName = importerName;
      sourceTool   = sourceTool;
      totalRows     = batch.size();
      imported      = imported;
      skipped       = skipped;
      flagged       = flagged;
      rejected      = rejectedArr;
      status        = "completed";
      createdAt     = now;
    };
    leadEngineState.batches.add(batchId, batchRecord);
    {
      batchId      = batchId;
      imported     = imported;
      skipped      = skipped;
      flagged      = flagged;
      rejectedRows = rejectedArr;
    };
  };

  /// Return a single import batch by id.
  public query ({ caller }) func leadEngine_getImportBatch(
    tenantId : Text,
    batchId  : Text,
  ) : async ?T.LeadEngineBatch {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    switch (leadEngineState.batches.get(batchId)) {
      case (?batch) {
        if (batch.tenantId == tenantId) { ?batch } else { null };
      };
      case (null) { null };
    };
  };

  /// Return all import batches for a tenant, newest-first.
  public query ({ caller }) func leadEngine_listBatches(
    tenantId : Text,
  ) : async [T.LeadEngineBatch] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    LeadEngineLib.listBatches(leadEngineState, tenantId);
  };

  /// Return a single lead by tenantId + leadId.
  public query ({ caller }) func leadEngine_getLead(
    tenantId : Text,
    leadId   : Text,
  ) : async ?T.LeadEngineLead {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    LeadEngineLib.getLead(leadEngineState, tenantId, leadId);
  };

  // ── Step 2: Dedupe + Enrichment + List + Status ─────────────────────────────

  /// Route an LLM call through the unified fallback chain for Lead Engine
  /// enrichment. Mirrors the routeLLM pattern in leadAI-api.mo — no new LLM
  /// task types. Uses #OutreachCopy as the task type (same as leadAI enrich).
  private func routeLLMEnrichment(prompt : Text) : async Text {
    let messages : [ORTypes.OpenRouterMessage] = [
      { role = "user"; content = prompt }
    ];
    let creds : ICTypes.IntegrationCredentials = switch (integrationCreds.get("platform")) {
      case (null) ICLib.emptyCredentials();
      case (?enc) ICLib.decryptAll(enc, credSalt);
    };
    let keys = LLMFallbackLib.resolveKeys(creds);
    let flags : LLMFallbackLib.FeatureFlags = {
      leadEngineEnabled = true;
      twilioEnabled      = true;
      sendgridEnabled    = true;
    };
    let defaultCapability : LLMFT.TaskCapability = {
      maxTokens   = 2000;
      temperature = 0.7;
      modelFamily = null;
    };
    await LLMFallbackLib.route(
      llmFallbackState,
      #OutreachCopy,
      messages,
      keys,
      flags,
      defaultCapability,
      transform,
      func(_t : ORTypes.TaskType, msgs : [ORTypes.OpenRouterMessage]) : async Text {
        await ORLib.callWithFallback(
          openRouterState,
          #OutreachCopy,
          msgs,
          transform,
          keys.openaiKey,
          keys.geminiKey,
        )
      },
    )
  };

  /// List leads for a tenant with filters by dedupe status, enrichment status,
  /// and batch id. Paginated for 100+ leads.
  public query ({ caller }) func leadEngine_listLeads(
    tenantId : Text,
    filters  : T.LeadListFilters,
    offset   : Nat,
    limit    : Nat,
  ) : async T.LeadListPage {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    LeadEngineLib.listLeads(leadEngineState, tenantId, filters, offset, limit);
  };

  /// Return all dedupe groups for a tenant (unresolved-only by default).
  public query ({ caller }) func leadEngine_getDedupeGroups(
    tenantId       : Text,
    unresolvedOnly : Bool,
  ) : async [T.DedupeGroup] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    LeadEngineLib.getDedupeGroups(leadEngineState, tenantId, unresolvedOnly);
  };

  /// Resolve a duplicate group by applying one of the four resolution actions
  /// (merge / ignore / keep separate / link). Persists the resolution and
  /// updates the affected leads immediately.
  public shared ({ caller }) func leadEngine_resolveDuplicate(
    tenantId   : Text,
    groupId    : Text,
    resolution : T.DedupeResolution,
  ) : async ?T.DedupeGroup {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    LeadEngineLib.resolveDuplicate(leadEngineState, tenantId, groupId, resolution, caller.toText());
  };

  /// Enrich a single lead via the existing LLM fallback chain. Fills missing
  /// fields (inferred niche, company size, website summary, suggested outreach
  /// angle) and persists the result on the LeadEngineLead.
  public shared ({ caller }) func leadEngine_enrichLead(
    tenantId : Text,
    leadId   : Text,
  ) : async ?T.EnrichmentResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    await LeadEngineLib.enrichLead(leadEngineState, tenantId, leadId, routeLLMEnrichment);
  };

  /// Enrich a batch of leads, iterating over each lead and recording per-lead
  /// enrichment results. Returns the array of enrichment results.
  public shared ({ caller }) func leadEngine_enrichBatch(
    tenantId : Text,
    leadIds  : [Text],
  ) : async [T.EnrichmentResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    await LeadEngineLib.enrichBatch(leadEngineState, tenantId, leadIds, routeLLMEnrichment);
  };

  /// Update a lead's lifecycle status (e.g. mark as reviewed / enriched /
  /// ready after dedupe and enrichment).
  public shared ({ caller }) func leadEngine_updateLeadStatus(
    tenantId : Text,
    leadId   : Text,
    status   : T.LeadStatus,
  ) : async ?T.LeadEngineLead {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    if (not leadEngineEnabled()) {
      Runtime.trap("Lead Engine is not enabled");
    };
    LeadEngineLib.updateLeadStatus(leadEngineState, tenantId, leadId, status);
  };

};
