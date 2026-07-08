import Map   "mo:core/Map";
import Set   "mo:core/Set";
import List  "mo:core/List";
import Text  "mo:core/Text";
import OQL   "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import T     "../types/lead-engine";

/// Builds the OQL entity list for the Lead Engine's persisted collections.
///
/// Exposes two queryable entities (both `.controllerOnly()` — private app
/// data the Data Intelligence agent answers over, but no end user reads
/// directly, mirroring the `#user` permission gating on the Lead Engine API):
///
///   - `leadEngineLead`  — one row per imported lead (flattened across all
///     tenants). The nested `provenance` record is flattened into columns;
///     `sourceTags` / `locationTags` arrays are joined into Text.
///   - `leadEngineBatch` — one row per import batch. The `rejected` array is
///     exposed as a count.
///
/// This module is additive: it reads `leadEngineState` and declares entities
/// only. It does not mutate state or change any existing public API.
module {

  /// Join a `[Text]` into a single comma-separated Text. Empty array → "".
  func joinTags(tags : [Text]) : Text {
    tags.vals().join(", ");
  };

  /// Convert a `LeadSourceFormat` variant to its tag text for OQL.
  func formatToText(f : T.LeadSourceFormat) : Text {
    switch (f) {
      case (#gosom) "gosom";
      case (#omkar) "omkar";
      case (#csv)   "csv";
      case (#json)  "json";
    };
  };

  /// Flatten the nested per-tenant lead map into a deduplicated array of
  /// `LeadEngineLead` values. The inner map stores each non-flagged lead under
  /// both its dedupe key and its id (see `LeadEngineLib.upsertLead`), so we
  /// dedupe by `id` to avoid duplicate OQL rows.
  func flattenLeads(
    leads : Map.Map<Text, Map.Map<Text, T.LeadEngineLead>>,
  ) : [T.LeadEngineLead] {
    let seen = Set.empty<Text>();
    let acc  = List.empty<T.LeadEngineLead>();
    for ((_, tenantLeads) in leads.entries()) {
      for ((_, lead) in tenantLeads.entries()) {
        if (not seen.contains(lead.id)) {
          seen.add(lead.id);
          acc.add(lead);
        };
      };
    };
    acc.toArray();
  };

  /// Build the OQL entity list for the Lead Engine collections.
  /// Call this from `main.mo` and pass the result to `include Expose({ entities = ... })`.
  public func entities(
    leadEngineState : T.LeadEngineState,
  ) : [OQL.Decl] {

    let leadEntity = OQL.Entity.manual<T.LeadEngineLead>(
      "leadEngineLead",
      func() = flattenLeads(leadEngineState.leads).vals(),
      "LeadEngineLead",
      "id",
    )
      .payload("id",           func(l) = l.id)
      .payload("tenantId",      func(l) = l.tenantId)
      .payload("businessName",  func(l) = l.businessName)
      .payload("phone",         func(l) = l.phone)
      .payload("email",         func(l) = l.email)
      .payload("niche",         func(l) = l.niche)
      .payload("source",        func(l) = l.source)
      .payload("sourceTags",    func(l) = joinTags(l.sourceTags))
      .payload("locationTags",  func(l) = joinTags(l.locationTags))
      .payload("status",        func(l) = l.status)
      .payload("isDuplicate",   func(l) = l.isDuplicate)
      // Flatten provenance fields as top-level columns.
      .payload("provenanceSourceTool",     func(l) = l.provenance.sourceTool)
      .payload("provenanceImporterName",   func(l) = l.provenance.importerName)
      .payload("provenanceOriginalFormat", func(l) = formatToText(l.provenance.originalFormat))
      .payload("provenanceImportDate",     func(l) = l.provenance.importDate)
      .payload("createdAt",    func(l) = l.createdAt)
      .controllerOnly()
      .build();

    let batchEntity = OQL.Entity.manual<T.LeadEngineBatch>(
      "leadEngineBatch",
      func() = leadEngineState.batches.values(),
      "LeadEngineBatch",
      "id",
    )
      .payload("id",           func(b) = b.id)
      .payload("tenantId",      func(b) = b.tenantId)
      .payload("importerName", func(b) = b.importerName)
      .payload("sourceTool",    func(b) = b.sourceTool)
      .payload("totalRows",     func(b) = b.totalRows)
      .payload("imported",      func(b) = b.imported)
      .payload("skipped",       func(b) = b.skipped)
      .payload("flagged",       func(b) = b.flagged)
      .payload("rejectedCount", func(b) = b.rejected.size())
      .payload("status",        func(b) = b.status)
      .payload("createdAt",     func(b) = b.createdAt)
      .controllerOnly()
      .build();

    [leadEntity, batchEntity];
  };

};
