import T       "../types/lead-engine";
import Map     "mo:core/Map";
import Text    "mo:core/Text";
import Nat     "mo:core/Nat";
import Int     "mo:core/Int";
import Time    "mo:core/Time";
import Char    "mo:core/Char";
import Array   "mo:core/Array";
import Set     "mo:core/Set";
import List    "mo:core/List";

module {

  /// Build the composite dedupe key (phone+email) for a raw lead input.
  /// Both fields are trimmed and lowercased so casing/whitespace differences
  /// do not defeat dedupe.
  public func dedupeKey(phone : Text, email : Text) : Text {
    phone.trim(#char ' ').toLower() # "|" # email.trim(#char ' ').toLower();
  };

  /// Validate a raw lead input row, returning a rejection reason if invalid.
  /// Required fields: businessName, phone, email. Phone must be non-empty
  /// after trimming; email must contain "@".
  public func validateRow(input : T.RawLeadInput) : ?T.RejectionReason {
    if (input.businessName.trim(#char ' ') == "") return ?#missingRequiredField;
    if (input.phone.trim(#char ' ') == "") return ?#missingRequiredField;
    if (input.email.trim(#char ' ') == "") return ?#missingRequiredField;
    if (not input.email.trim(#char ' ').contains(#char '@')) {
      return ?#invalidEmailFormat;
    };
    if (not isValidPhone(input.phone.trim(#char ' '))) {
      return ?#invalidPhoneFormat;
    };
    null;
  };

  /// Minimal phone validation: must contain at least 7 digits.
  func isValidPhone(phone : Text) : Bool {
    var digits = 0;
    for (c in phone.chars()) {
      if (c.isDigit()) digits += 1;
    };
    digits >= 7;
  };

  /// Construct a LeadEngineLead from a raw input + provenance + ids.
  public func toLead(
    input     : T.RawLeadInput,
    leadId    : Text,
    tenantId  : Text,
    isDup     : Bool,
    provenance: T.LeadProvenance,
  ) : T.LeadEngineLead {
    {
      id           = leadId;
      tenantId      = tenantId;
      businessName = input.businessName;
      phone        = input.phone;
      email        = input.email;
      niche        = input.niche;
      source       = input.source;
      sourceTags   = input.sourceTags;
      locationTags = input.locationTags;
      status       = if (isDup) { "flagged" } else { "new" };
      isDuplicate  = isDup;
      provenance   = provenance;
      createdAt    = Time.now();
      // ── Step 2: dedupe + enrichment defaults ──────────────────────────────
      dedupeFlags      = [];
      dedupeResolution = null;
      linkedLeadIds    = [];
      enrichmentResult = null;
    };
  };

  /// Insert (or flag as duplicate) a lead into a tenant's lead map.
  /// Returns true if imported, false if flagged as duplicate (skipped).
  /// Dedupe is on the composite phone+email key.
  public func upsertLead(
    tenantLeads : Map.Map<Text, T.LeadEngineLead>,
    lead        : T.LeadEngineLead,
  ) : Bool {
    let key = dedupeKey(lead.phone, lead.email);
    switch (tenantLeads.get(key)) {
      case (?existing) {
        // Duplicate — flag the new lead and store it under a separate key
        // so the original is preserved. Mark as flagged/skipped.
        let flagged = { lead with isDuplicate = true; status = "flagged" };
        tenantLeads.add(lead.id, flagged);
        false;
      };
      case (null) {
        // Store under both the dedupe key (for lookup) and the lead id.
        tenantLeads.add(key, lead);
        tenantLeads.add(lead.id, lead);
        true;
      };
    };
  };

  /// Retrieve a single lead by tenantId + leadId.
  public func getLead(
    state    : T.LeadEngineState,
    tenantId : Text,
    leadId   : Text,
  ) : ?T.LeadEngineLead {
    switch (state.leads.get(tenantId)) {
      case (?tenantLeads) { tenantLeads.get(leadId) };
      case (null) { null };
    };
  };

  /// Retrieve an import batch by batchId.
  public func getBatch(
    state   : T.LeadEngineState,
    batchId : Text,
  ) : ?T.LeadEngineBatch {
    state.batches.get(batchId);
  };

  /// List all import batches for a tenant, newest-first.
  public func listBatches(
    state    : T.LeadEngineState,
    tenantId : Text,
  ) : [T.LeadEngineBatch] {
    let list = Map.empty<Int, T.LeadEngineBatch>();
    for ((_, batch) in state.batches.entries()) {
      if (batch.tenantId == tenantId) {
        list.add(batch.createdAt, batch);
      };
    };
    // Sort newest-first by createdAt descending.
    let arr = list.values().toArray();
    arr.sort(func(a, b) { Int.compare(b.createdAt, a.createdAt) });
  };

  /// Generate a deterministic batch id from a timestamp.
  public func makeBatchId(now : Int) : Text {
    "le-batch-" # now.toText();
  };

  /// Generate a deterministic lead id from batch id + row index.
  public func makeLeadId(batchId : Text, idx : Nat) : Text {
    batchId # "-row-" # idx.toText();
  };

  // ── Step 2: Dedupe ──────────────────────────────────────────────────────────

  /// Normalize a Text field for dedupe comparison: trim + lowercase.
  /// Empty strings are treated as "no value" and never match.
  func normalizeField(s : Text) : Text {
    s.trim(#char ' ').toLower();
  };

  /// Extract a domain from an email address (lowercased). Returns "" if the
  /// email has no "@" or the local part is empty.
  func domainFromEmail(email : Text) : Text {
    let chars = email.trim(#char ' ').toLower().toArray();
    let len = chars.size();
    var atIdx : ?Nat = null;
    var i = 0;
    label findAt while (i < len) {
      if (chars[i] == '@') { atIdx := ?i; break findAt };
      i += 1;
    };
    switch (atIdx) {
      case null { "" };
      case (?at) {
        if (at + 1 >= len) { "" } else {
          let domLen = len - (at + 1);
          Text.fromIter(Array.tabulate(domLen, func(k) { chars[at + 1 + k] }).vals());
        };
      };
    };
  };

  /// Compare two leads across the composite dedupe key (domain, phone, email,
  /// website, address, business name). Returns the list of fields that match
  /// (non-empty normalized equality). Empty fields never match.
  func matchedFields(a : T.LeadEngineLead, b : T.LeadEngineLead) : [T.DedupeMatchField] {
    let acc = List.empty<T.DedupeMatchField>();
    // Domain — derived from email (no separate website field on RawLeadInput).
    let domA = domainFromEmail(a.email);
    let domB = domainFromEmail(b.email);
    if (domA != "" and domA == domB) { acc.add(#domain) };
    // Phone
    let phoneA = normalizeField(a.phone);
    let phoneB = normalizeField(b.phone);
    if (phoneA != "" and phoneA == phoneB) { acc.add(#phone) };
    // Email
    let emailA = normalizeField(a.email);
    let emailB = normalizeField(b.email);
    if (emailA != "" and emailA == emailB) { acc.add(#email) };
    // Website — same as domain (no separate field); skip if already matched.
    // Address — derived from locationTags joined (no separate address field).
    let addrA = a.locationTags.vals().join("|").toLower();
    let addrB = b.locationTags.vals().join("|").toLower();
    if (addrA != "" and addrA == addrB) { acc.add(#address) };
    // Business name
    let nameA = normalizeField(a.businessName);
    let nameB = normalizeField(b.businessName);
    if (nameA != "" and nameA == nameB) { acc.add(#businessName) };
    acc.toArray();
  };

  /// Detect duplicate leads across an imported batch by matching on the
  /// composite key (domain, phone, email, website, address, business name).
  /// Compares each new lead against all existing leads in the tenant (including
  /// those from prior batches) and against each other. Returns the dedupe
  /// groups created; per-lead flags are persisted on the affected leads.
  public func detectDuplicates(
    state    : T.LeadEngineState,
    tenantId : Text,
    batchId  : Text,
    leadIds  : [Text],
  ) : [T.DedupeGroup] {
    let tenantLeads = switch (state.leads.get(tenantId)) {
      case (?m) { m };
      case null { return []; };
    };
    // Resolve the new leads in this batch.
    let newLeads = List.empty<T.LeadEngineLead>();
    for (id in leadIds.vals()) {
      switch (tenantLeads.get(id)) {
        case (?l) { newLeads.add(l) };
        case null {};
      };
    };
    let newArr = newLeads.toArray();
    if (newArr.size() == 0) return [];

    // Collect all tenant leads (existing + new) for cross-batch comparison.
    let allLeads = List.empty<T.LeadEngineLead>();
    for ((_, lead) in tenantLeads.entries()) {
      // Skip the dedupe-key shadow entries (keys that aren't lead ids).
      // Lead ids are produced by makeLeadId and contain "-row-"; dedupe keys
      // are phone|email and never contain "-row-".
      if (idLooksLikeLeadId(lead.id)) { allLeads.add(lead) };
    };
    let allArr = allLeads.toArray();

    let now = Time.now();
    let groups = List.empty<T.DedupeGroup>();
    // Track which new leads have already been grouped (avoid double-flagging).
    let groupedNewIds = Set.empty<Text>();

    var gi = 0;
    // Pairwise: each new lead vs every other lead (new or existing).
    for (i in newArr.keys()) {
      let newLead = newArr[i];
      if (groupedNewIds.contains(newLead.id)) continue;
      let groupMembers = List.empty<T.LeadEngineLead>();
      let groupFields = List.empty<T.DedupeMatchField>();
      // Compare against all leads (including other new leads).
      for (j in allArr.keys()) {
        let other = allArr[j];
        if (other.id == newLead.id) continue;
        let fields = matchedFields(newLead, other);
        if (fields.size() > 0) {
          // Add other to group if not already present.
          var already = false;
          for (m in groupMembers.toArray().vals()) {
            if (m.id == other.id) { already := true };
          };
          if (not already) { groupMembers.add(other) };
          for (f in fields.vals()) {
            var hasF = false;
            for (gf in groupFields.toArray().vals()) {
              if (dedupeFieldEq(gf, f)) { hasF := true };
            };
            if (not hasF) { groupFields.add(f) };
          };
        };
      };
      let members = groupMembers.toArray();
      if (members.size() > 0) {
        // Build the group: newLead + members.
        let leadIdList = List.empty<Text>();
        leadIdList.add(newLead.id);
        for (m in members.vals()) { leadIdList.add(m.id) };
        let groupId = "dg-" # batchId # "-" # gi.toText();
        gi += 1;
        let group : T.DedupeGroup = {
          id            = groupId;
          tenantId      = tenantId;
          leadIds       = leadIdList.toArray();
          matchedFields = groupFields.toArray();
          resolution    = null;
          createdAt     = now;
          resolvedAt    = null;
        };
        state.dedupeGroups.add(groupId, group);
        // Flag each member lead with a DedupeFlag pointing at the others.
        let flagFields = group.matchedFields;
        for (leadId in group.leadIds.vals()) {
          switch (tenantLeads.get(leadId)) {
            case (?lead) {
              let flags = List.empty<T.DedupeFlag>();
              for (otherId in group.leadIds.vals()) {
                if (otherId != leadId) {
                  flags.add({
                    matchedLeadId   = otherId;
                    matchedFields   = flagFields;
                    flaggedAt       = now;
                    importBatchId   = batchId;
                  });
                };
              };
              let updated = {
                lead with
                isDuplicate    = true;
                status         = "flagged";
                dedupeFlags    = lead.dedupeFlags.concat(flags.toArray());
              };
              tenantLeads.add(leadId, updated);
            };
            case null {};
          };
        };
        groupedNewIds.add(newLead.id);
        for (m in members.vals()) {
          if (idLooksLikeLeadId(m.id) and newArr.size() > 0) {
            // Mark other new leads as grouped too so they don't seed their own group.
            for (n in newArr.vals()) {
              if (n.id == m.id) { groupedNewIds.add(m.id) };
            };
          };
        };
        groups.add(group);
      };
    };
    groups.toArray();
  };

  /// Heuristic: a lead id (from makeLeadId) contains "-row-"; dedupe-key
  /// shadow entries are phone|email and never contain "-row-".
  func idLooksLikeLeadId(id : Text) : Bool {
    id.contains(#text "-row-");
  };

  /// Structural equality for DedupeMatchField variants.
  func dedupeFieldEq(a : T.DedupeMatchField, b : T.DedupeMatchField) : Bool {
    switch (a) {
      case (#domain)      { b == #domain };
      case (#phone)       { b == #phone };
      case (#email)       { b == #email };
      case (#website)     { b == #website };
      case (#address)     { b == #address };
      case (#businessName){ b == #businessName };
    };
  };

  /// Resolve a duplicate group by applying one of the four resolution actions
  /// (merge / ignore / keep separate / link). Persists the resolution and
  /// updates the affected leads. Returns the updated group.
  public func resolveDuplicate(
    state      : T.LeadEngineState,
    tenantId   : Text,
    groupId    : Text,
    resolution : T.DedupeResolution,
    resolvedBy : Text,
  ) : ?T.DedupeGroup {
    let group = switch (state.dedupeGroups.get(groupId)) {
      case (?g) { g };
      case null { return null };
    };
    if (group.tenantId != tenantId) { return null };
    let tenantLeads = switch (state.leads.get(tenantId)) {
      case (?m) { m };
      case null { return null };
    };
    let now = Time.now();
    // Apply the resolution to the affected leads.
    switch (resolution) {
      case (#Merged { mergedIntoLeadId; mergedAwayLeadId }) {
        // Combine two leads into one, preserving the richest field values.
        let into = switch (tenantLeads.get(mergedIntoLeadId)) {
          case (?l) { l };
          case null { return null };
        };
        let away = switch (tenantLeads.get(mergedAwayLeadId)) {
          case (?l) { l };
          case null { return null };
        };
        let merged : T.LeadEngineLead = {
          into with
          businessName = pickRicher(into.businessName, away.businessName);
          phone        = pickRicher(into.phone, away.phone);
          email        = pickRicher(into.email, away.email);
          niche        = pickRicher(into.niche, away.niche);
          source       = pickRicher(into.source, away.source);
          sourceTags   = into.sourceTags.concat(away.sourceTags);
          locationTags = into.locationTags.concat(away.locationTags);
          isDuplicate  = false;
          status       = "reviewed";
          dedupeResolution = ?resolution;
          linkedLeadIds = into.linkedLeadIds;
          enrichmentResult = switch (into.enrichmentResult) {
            case (?e) ?e;
            case null away.enrichmentResult;
          };
          provenance = {
            into.provenance with
            // Record the merged-away lead id in provenance via importerName suffix.
            importerName = into.provenance.importerName # " (merged " # mergedAwayLeadId # ")";
          };
        };
        tenantLeads.add(mergedIntoLeadId, merged);
        // Remove the merged-away lead from the tenant map (both id and dedupe key).
        tenantLeads.remove(mergedAwayLeadId);
        tenantLeads.remove(dedupeKey(away.phone, away.email));
      };
      case (#Ignored) {
        // Dismiss the duplicate flag without changing either lead's data.
        for (leadId in group.leadIds.vals()) {
          switch (tenantLeads.get(leadId)) {
            case (?lead) {
              tenantLeads.add(leadId, {
                lead with
                isDuplicate       = false;
                status            = "reviewed";
                dedupeResolution  = ?resolution;
              });
            };
            case null {};
          };
        };
      };
      case (#KeptSeparate) {
        // Mark the pair as intentionally distinct so they are not re-flagged.
        for (leadId in group.leadIds.vals()) {
          switch (tenantLeads.get(leadId)) {
            case (?lead) {
              tenantLeads.add(leadId, {
                lead with
                dedupeResolution = ?resolution;
                status           = "reviewed";
              });
            };
            case null {};
          };
        };
      };
      case (#Linked) {
        // Record a relationship between the leads without merging.
        let ids = group.leadIds;
        for (i in ids.keys()) {
          let aId = ids[i];
          switch (tenantLeads.get(aId)) {
            case (?lead) {
              let linked = List.empty<Text>();
              for (j in ids.keys()) {
                if (j != i) { linked.add(ids[j]) };
              };
              let existing = List.fromArray(lead.linkedLeadIds);
              for (l in linked.toArray().vals()) {
                if (not existing.contains(l)) { existing.add(l) };
              };
              tenantLeads.add(aId, {
                lead with
                linkedLeadIds    = existing.toArray();
                dedupeResolution = ?resolution;
              });
            };
            case null {};
          };
        };
      };
    };
    // Persist a resolution log entry.
    let logId = "drl-" # groupId # "-" # now.toText();
    let leadIdA = if (group.leadIds.size() > 0) { group.leadIds[0] } else { "" };
    let leadIdB = if (group.leadIds.size() > 1) { group.leadIds[1] } else { "" };
    let logEntry : T.DedupeResolutionLogEntry = {
      id         = logId;
      tenantId   = tenantId;
      groupId    = groupId;
      leadIdA    = leadIdA;
      leadIdB    = leadIdB;
      resolution = resolution;
      resolvedAt = now;
      resolvedBy = resolvedBy;
    };
    state.dedupeResolutionLog.add(logId, logEntry);
    // Update the group with the resolution.
    let updatedGroup : T.DedupeGroup = {
      group with
      resolution = ?resolution;
      resolvedAt = ?now;
    };
    state.dedupeGroups.add(groupId, updatedGroup);
    ?updatedGroup;
  };

  /// Pick the richer of two Text fields: prefer the non-empty one; if both
  /// non-empty, prefer the longer (more detailed) value.
  func pickRicher(a : Text, b : Text) : Text {
    if (a == "") { b }
    else if (b == "") { a }
    else if (b.size() > a.size()) { b }
    else { a };
  };

  /// List all dedupe groups for a tenant, optionally filtered by resolution
  /// status (unresolved-only by default).
  public func getDedupeGroups(
    state          : T.LeadEngineState,
    tenantId       : Text,
    unresolvedOnly : Bool,
  ) : [T.DedupeGroup] {
    let acc = List.empty<T.DedupeGroup>();
    for ((_, g) in state.dedupeGroups.entries()) {
      if (g.tenantId == tenantId) {
        if (not unresolvedOnly or g.resolution == null) {
          acc.add(g);
        };
      };
    };
    let arr = acc.toArray();
    arr.sort(func(a, b) { Int.compare(b.createdAt, a.createdAt) });
  };

  // ── Step 2: Enrichment ──────────────────────────────────────────────────────

  /// Build the enrichment prompt for the LLM fallback chain. Asks the model
  /// to infer niche, company size, website summary, and suggested outreach
  /// angle from the lead's businessName/phone/email/niche/source fields, and
  /// to return the result as JSON with those four fields.
  public func buildEnrichmentPrompt(lead : T.LeadEngineLead) : Text {
    "You are a lead enrichment assistant. Given the following business lead, " #
    "infer the missing fields and return ONLY a JSON object with these keys: " #
    "\"inferredNiche\" (string), \"companySize\" (string), \"websiteSummary\" (string), " #
    "\"suggestedOutreachAngle\" (string). Do not include any other text.\n\n" #
    "Business name: " # lead.businessName # "\n" #
    "Phone: " # lead.phone # "\n" #
    "Email: " # lead.email # "\n" #
    "Niche: " # lead.niche # "\n" #
    "Source: " # lead.source # "\n" #
    "Location tags: " # lead.locationTags.vals().join(", ") # "\n" #
    "Source tags: " # lead.sourceTags.vals().join(", ") # "\n";
  };

  /// Parse a JSON string field by name from an LLM response. Mirrors the
  /// parseJsonField helper in leadAI-api.mo.
  func parseJsonField(json : Text, field : Text) : Text {
    let needle = "\"" # field # "\":\"";
    let nChars = needle.toArray();
    let jChars = json.toArray();
    let nLen = nChars.size();
    let jLen = jChars.size();
    var i = 0;
    label scan while (i + nLen <= jLen) {
      var matched = true;
      var k = 0;
      while (k < nLen) {
        if (jChars[i + k] != nChars[k]) { matched := false };
        k += 1;
      };
      if (matched) {
        var j = i + nLen;
        var val = "";
        label collect while (j < jLen) {
          let c = jChars[j];
          if (c == '\"') break collect;
          val #= Text.fromChar(c);
          j += 1;
        };
        return val;
      };
      i += 1;
    };
    "";
  };

  /// Parse the LLM enrichment response into EnrichmentField variants. Only
  /// non-empty fields are included.
  func parseEnrichmentFields(raw : Text) : [T.EnrichmentField] {
    let acc = List.empty<T.EnrichmentField>();
    let niche = parseJsonField(raw, "inferredNiche");
    if (niche != "") { acc.add(#inferredNiche niche) };
    let size = parseJsonField(raw, "companySize");
    if (size != "") { acc.add(#companySize size) };
    let summary = parseJsonField(raw, "websiteSummary");
    if (summary != "") { acc.add(#websiteSummary summary) };
    let angle = parseJsonField(raw, "suggestedOutreachAngle");
    if (angle != "") { acc.add(#suggestedOutreachAngle angle) };
    acc.toArray();
  };

  /// Enrich a single lead via the existing LLM fallback chain
  /// (Nemotron→OpenRouter→OpenAI→Anthropic→Generic). Fills missing fields
  /// (inferred niche, company size, website summary, suggested outreach angle)
  /// and persists the result on the LeadEngineLead. Reuses the routeLLM
  /// pattern from leadAI-api.mo — no new LLM task types.
  public func enrichLead(
    state           : T.LeadEngineState,
    tenantId        : Text,
    leadId          : Text,
    routeLLM        : Text -> async Text,
  ) : async ?T.EnrichmentResult {
    let tenantLeads = switch (state.leads.get(tenantId)) {
      case null { return null };
      case (?m) { m };
    };
    let lead = switch (tenantLeads.get(leadId)) {
      case null { return null };
      case (?l) { l };
    };
    let prompt = buildEnrichmentPrompt(lead);
    let now = Time.now();
    var raw = "";
    var errorMsg : ?Text = null;
    var failingProvider : ?Text = null;
    try {
      raw := await routeLLM(prompt);
      if (raw == "") {
        errorMsg := ?"No provider in the fallback chain returned a response";
        failingProvider := ?"all";
      };
    } catch (e) {
      errorMsg := ?e.message();
      failingProvider := ?"unknown";
    };
    let success = raw != "";
    let fields = if (success) { parseEnrichmentFields(raw) } else { [] };
    // Determine the provider that produced the result. The route log is held
    // in llmFallbackState (not visible here); we record "fallback-chain" as
    // the provider and the failing provider from the error path.
    let provider = if (success) { "fallback-chain" } else { "" };
    let result : T.EnrichmentResult = {
      leadId          = leadId;
      fields          = fields;
      provider        = provider;
      failingProvider = failingProvider;
      enrichedAt      = now;
      success         = success;
      errorMessage    = errorMsg;
    };
    // Persist the result on the lead and bump status to enriched.
    let updatedStatus = if (success) { "enriched" } else { lead.status };
    tenantLeads.add(leadId, {
      lead with
      enrichmentResult = ?result;
      status           = updatedStatus;
    });
    ?result;
  };

  /// Enrich a batch of leads, iterating over each lead and recording per-lead
  /// enrichment results. Returns the array of enrichment results.
  public func enrichBatch(
    state           : T.LeadEngineState,
    tenantId        : Text,
    leadIds         : [Text],
    routeLLM        : Text -> async Text,
  ) : async [T.EnrichmentResult] {
    let acc = List.empty<T.EnrichmentResult>();
    for (id in leadIds.vals()) {
      switch (await enrichLead(state, tenantId, id, routeLLM)) {
        case (?r) { acc.add(r) };
        case null {};
      };
    };
    acc.toArray();
  };

  // ── Step 2: List + Status ──────────────────────────────────────────────────

  /// Convert a LeadStatus variant to its lowercase Text representation for
  /// comparison against the lead's `status` Text field.
  func leadStatusToText(s : T.LeadStatus) : Text {
    switch (s) {
      case (#new)      "new";
      case (#flagged)  "flagged";
      case (#reviewed) "reviewed";
      case (#enriched) "enriched";
      case (#ready)    "ready";
    };
  };

  /// Query leads for a tenant with filters by dedupe status, enrichment
  /// status, and batch id. Paginated for 100+ leads.
  public func listLeads(
    state    : T.LeadEngineState,
    tenantId : Text,
    filters  : T.LeadListFilters,
    offset   : Nat,
    limit    : Nat,
  ) : T.LeadListPage {
    let tenantLeads = switch (state.leads.get(tenantId)) {
      case (?m) { m };
      case null {
        return { leads = []; total = 0; offset = offset; limit = limit };
      };
    };
    // Resolve the batch filter: if a batchId is provided, derive the set of
    // lead ids that belong to that batch (lead ids are batchId-row-idx).
    let batchLeadIds : ?Set.Set<Text> = switch (filters.batchId) {
      case null { null };
      case (?bid) {
        let ids = Set.empty<Text>();
        let prefix = bid # "-row-";
        for ((key, lead) in tenantLeads.entries()) {
          if (idLooksLikeLeadId(lead.id) and lead.id.contains(#text prefix)) {
            ids.add(lead.id);
          };
        };
        ?ids;
      };
    };
    // Collect matching leads, deduped by id (the tenant map stores each lead
    // under both its dedupe key and its id).
    let seen = Set.empty<Text>();
    let acc = List.empty<T.LeadEngineLead>();
    for ((_, lead) in tenantLeads.entries()) {
      if (not idLooksLikeLeadId(lead.id)) continue;
      if (seen.contains(lead.id)) continue;
      seen.add(lead.id);
      // Apply filters.
      var keep = true;
      // Dedupe status filter.
      switch (filters.dedupeStatus) {
        case null {};
        case (?f) {
          switch (f) {
            case (#flagged)  { if (not lead.isDuplicate) { keep := false } };
            case (#resolved) {
              // Resolved = has a dedupeResolution set.
              if (lead.dedupeResolution == null) { keep := false };
            };
            case (#any) {};
          };
        };
      };
      // Enrichment status filter.
      if (keep) {
        switch (filters.enrichmentStatus) {
          case null {};
          case (?f) {
            switch (f) {
              case (#enriched) {
                switch (lead.enrichmentResult) {
                  case (?r) { if (not r.success) { keep := false } };
                  case null { keep := false };
                };
              };
              case (#notEnriched) {
                switch (lead.enrichmentResult) {
                  case (?r) { if (r.success) { keep := false } };
                  case null {};
                };
              };
              case (#any) {};
            };
          };
        };
      };
      // Batch filter.
      if (keep) {
        switch (batchLeadIds) {
          case null {};
          case (?ids) {
            if (not ids.contains(lead.id)) { keep := false };
          };
        };
      };
      if (keep) { acc.add(lead) };
    };
    let all = acc.toArray();
    // Sort newest-first by createdAt descending.
    let sorted = all.sort(func(a, b) { Int.compare(b.createdAt, a.createdAt) });
    let total = sorted.size();
    // Paginate with offset + limit using Array.tabulate (Array has no take).
    let pageLen = if (offset >= total) {
      0;
    } else {
      let remaining = total - offset;
      if (remaining < limit) { remaining } else { limit };
    };
    let page = if (pageLen == 0) {
      [];
    } else {
      Array.tabulate(pageLen, func(i) { sorted[offset + i] });
    };
    { leads = page; total = total; offset = offset; limit = limit };
  };

  /// Update a lead's lifecycle status (e.g. mark as reviewed / enriched /
  /// ready after dedupe and enrichment).
  public func updateLeadStatus(
    state    : T.LeadEngineState,
    tenantId : Text,
    leadId   : Text,
    status   : T.LeadStatus,
  ) : ?T.LeadEngineLead {
    let tenantLeads = switch (state.leads.get(tenantId)) {
      case null { return null };
      case (?m) { m };
    };
    switch (tenantLeads.get(leadId)) {
      case null { null };
      case (?lead) {
        let updated = { lead with status = leadStatusToText(status) };
        tenantLeads.add(leadId, updated);
        ?updated;
      };
    };
  };

};
