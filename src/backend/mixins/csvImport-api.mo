import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CSVTypes "../types/csvImport";

/// Mixin that owns all CSV bulk-import API endpoints.
/// State slices injected:
///   - accessControlState : AccessControl.State
///   - extendedLeads      : Map<TenantId, Map<LeadId, ExtendedLead>>
///   - csvImportBatches   : Map<BatchId, CsvImportBatch>
mixin (
  accessControlState : AccessControl.AccessControlState,
  extendedLeads      : Map.Map<Text, Map.Map<Text, CSVTypes.ExtendedLead>>,
  csvImportBatches   : Map.Map<Text, CSVTypes.CsvImportBatch>,
) {

  // ---- Internal helpers ----

  /// Returns true if the email value looks like a placeholder / non-email.
  func isPlaceholderEmail(raw : ?Text) : Bool {
    switch (raw) {
      case (null) { true };
      case (?e) {
        if (e.size() == 0)       { return true };
        let lo = e.toLower();
        if (lo == "n/a")         { return true };
        if (lo.contains(#text "@2x.png"))    { return true };
        if (lo.contains(#text "sentry.wixp"))     { return true };
        if (lo.contains(#text "@example.com"))    { return true };
        if (lo.contains(#text "username@"))       { return true };
        if (lo.contains(#text "your@email"))      { return true };
        if (lo.contains(#text "user@domain"))     { return true };
        if (lo.contains(#text "chosen-sprite"))   { return true };
        if (lo.contains(#text ".png"))            { return true };
        if (lo.contains(#text ".jpg"))            { return true };
        false;
      };
    };
  };

  /// Infer a niche from the AI-suggested-services field or default to "Technology".
  func resolveNiche(input : CSVTypes.ExtendedLeadInput) : Text {
    switch (input.niche) {
      case (?n) {
        let trimmed = n.toLower();
        if (trimmed.size() > 0) { trimmed } else { "Technology" };
      };
      case (null) { "Technology" };
    };
  };

  func makeBatchId(now : Int) : Text {
    "batch-" # now.toText();
  };

  func makeLeadId(batchId : Text, idx : Nat) : Text {
    batchId # "-" # idx.toText();
  };

  // ---- Public API ----

  /// Bulk-import leads parsed from a CSV into the extended leads store.
  /// Returns a summary with batchId, imported count, skipped count, and
  /// flagged-no-email count.
  public shared ({ caller }) func bulkImportLeads(
    tenantId : Text,
    leads    : [CSVTypes.ExtendedLeadInput],
  ) : async CSVTypes.BulkImportResult {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };

    let now      = Time.now();
    let batchId  = makeBatchId(now);

    var imported : Nat = 0;
    var skipped  : Nat = 0;
    var flagged  : Nat = 0;

    // Per-niche counters stored as a mutable Map during processing
    let nicheCounter = Map.empty<Text, Nat>();

    let tenantLeads = switch (extendedLeads.get(tenantId)) {
      case (?existing) { existing };
      case (null)      { Map.empty<Text, CSVTypes.ExtendedLead>() };
    };

    var idx : Nat = 0;
    for (input in leads.values()) {
      let emailRaw    = input.email;
      let isPlaceholder = isPlaceholderEmail(emailRaw);
      let emailVerified = not isPlaceholder;

      if (isPlaceholder) { flagged += 1 };

      // Skip entirely if business name is empty (degenerate row)
      if (input.businessName.size() == 0) {
        skipped += 1;
      } else {
        let leadId = makeLeadId(batchId, idx);
        let niche  = resolveNiche(input);

        let lead : CSVTypes.ExtendedLead = {
          id                  = leadId;
          tenantId;
          name                = input.businessName;
          email               = switch (emailRaw) { case (?e) e; case null "" };
          phone               = switch (input.phone) { case (?p) p; case null "" };
          niche;
          status              = "new";
          source              = "csv_import";
          notes               = "";
          agentSubscriptions  = [];
          createdAt           = now;
          gbpLink             = input.gbpLink;
          rating              = input.rating;
          totalReviews        = input.totalReviews;
          address             = input.address;
          website             = input.website;
          claimStatus         = input.claimStatus;
          optimizationScore   = input.optimizationScore;
          localAds            = input.localAds;
          paidAds             = input.paidAds;
          googleRanking       = input.googleRanking;
          threePackRanking    = input.threePackRanking;
          aiSuggestedServices = input.aiSuggestedServices;
          emailVerified;
          importBatchId       = ?batchId;
        };

        tenantLeads.add(leadId, lead);
        imported += 1;

        // Increment niche counter
        let prev = switch (nicheCounter.get(niche)) {
          case (?n) n;
          case null 0;
        };
        nicheCounter.add(niche, prev + 1);
      };

      idx += 1;
    };

    // Persist extended leads for tenant
    extendedLeads.add(tenantId, tenantLeads);

    // Build niche breakdown array
    let breakdown = nicheCounter.toArray();

    // Persist batch record
    let batch : CSVTypes.CsvImportBatch = {
      id             = batchId;
      tenantId;
      fileName       = "";           // Caller can update via upsertCsvImportBatch if needed
      totalLeads     = leads.size();
      imported;
      skipped;
      flaggedNoEmail = flagged;
      nicheBreakdown = breakdown;
      status         = "complete";
      createdAt      = now;
    };
    csvImportBatches.add(batchId, batch);

    { batchId; imported; skipped; flagged };
  };

  /// Return all CSV import batches for a tenant, newest-first.
  public query ({ caller }) func getCsvImportBatches(
    tenantId : Text,
  ) : async [CSVTypes.CsvImportBatch] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    let list = List.empty<CSVTypes.CsvImportBatch>();
    for (batch in csvImportBatches.values()) {
      if (batch.tenantId == tenantId) { list.add(batch) };
    };
    // Sort by createdAt descending (newer first)
    list.sortInPlace(func(a, b) = if (a.createdAt > b.createdAt) #less else if (a.createdAt < b.createdAt) #greater else #equal);
    list.toArray();
  };

  /// Return all extended leads that belong to a specific import batch.
  public query ({ caller }) func getLeadsByBatch(
    batchId : Text,
  ) : async [CSVTypes.ExtendedLead] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    // Find which tenantId owns this batch
    let batchOpt = csvImportBatches.get(batchId);
    let tenantId = switch (batchOpt) {
      case (?b) { b.tenantId };
      case (null) { Runtime.trap("Batch not found") };
    };
    let results = List.empty<CSVTypes.ExtendedLead>();
    switch (extendedLeads.get(tenantId)) {
      case (?tenantLeads) {
        for (lead in tenantLeads.values()) {
          switch (lead.importBatchId) {
            case (?bid) { if (bid == batchId) { results.add(lead) } };
            case null   {};
          };
        };
      };
      case null {};
    };
    results.toArray();
  };

  /// Return all extended leads for a tenant.
  public query ({ caller }) func getExtendedLeadsByTenant(
    tenantId : Text,
  ) : async [CSVTypes.ExtendedLead] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    switch (extendedLeads.get(tenantId)) {
      case (?tenantLeads) {
        let list = List.empty<CSVTypes.ExtendedLead>();
        for (lead in tenantLeads.values()) { list.add(lead) };
        list.toArray();
      };
      case null { [] };
    };
  };

  /// Upsert a single CsvImportBatch (e.g. to backfill fileName after upload).
  public shared ({ caller }) func upsertCsvImportBatch(
    batch : CSVTypes.CsvImportBatch,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Users only");
    };
    csvImportBatches.add(batch.id, batch);
  };

};
