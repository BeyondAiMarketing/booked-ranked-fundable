import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import T    "../types/citationNAP";

module {

  public type State = {
    citations : Map.Map<Text, T.Citation>;
  };

  public func emptyState() : State = {
    citations = Map.empty<Text, T.Citation>();
  };

  public func save(state : State, citation : T.Citation) : () {
    state.citations.add(citation.id, citation);
  };

  public func get(state : State, id : Text) : ?T.Citation {
    state.citations.get(id);
  };

  public func update(state : State, id : Text, update : T.CitationUpdate) : ?T.Citation {
    switch (state.citations.get(id)) {
      case null { null };
      case (?existing) {
        let updated : T.Citation = {
          existing with
          sourceName      = switch (update.sourceName)      { case (?v) v; case null existing.sourceName      };
          sourceUrl       = switch (update.sourceUrl)       { case (?v) v; case null existing.sourceUrl       };
          businessName    = switch (update.businessName)    { case (?v) v; case null existing.businessName    };
          address         = switch (update.address)         { case (?v) v; case null existing.address         };
          city            = switch (update.city)            { case (?v) v; case null existing.city            };
          state           = switch (update.state)           { case (?v) v; case null existing.state           };
          zipCode         = switch (update.zipCode)       { case (?v) v; case null existing.zipCode         };
          phone           = switch (update.phone)           { case (?v) v; case null existing.phone           };
          website         = switch (update.website)         { case (?v) v; case null existing.website         };
          status          = switch (update.status)          { case (?v) v; case null existing.status          };
          inconsistencyNotes = switch (update.inconsistencyNotes) { case (?v) v; case null existing.inconsistencyNotes };
          lastAuditedAt   = switch (update.lastAuditedAt)   { case (?v) ?v; case null existing.lastAuditedAt   };
        };
        state.citations.add(id, updated);
        ?updated;
      };
    };
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.Citation] {
    let out = Map.empty<Text, T.Citation>();
    for ((id, citation) in state.citations.entries()) {
      if (citation.clientBusinessId == clientBusinessId) { out.add(id, citation) };
    };
    let result = List.empty<T.Citation>();
    for ((_, citation) in out.entries()) { result.add(citation) };
    result.toArray();
  };

  public func remove(state : State, id : Text) : Bool {
    switch (state.citations.get(id)) {
      case (?_) { state.citations.remove(id); true };
      case null false;
    };
  };

  /// Audit NAP consistency across all citations for a client.
  /// Compares each citation against the most common (canonical) NAP values.
  public func auditNAPConsistency(state : State, clientBusinessId : Text) : T.NAPAuditResult {
    let clientCitations = listByClient(state, clientBusinessId);
    let totalCitations = clientCitations.size();

    // Build frequency maps for each field to determine canonical NAP
    let nameFreq  = Map.empty<Text, Nat>();
    let addrFreq  = Map.empty<Text, Nat>();
    let cityFreq  = Map.empty<Text, Nat>();
    let stateFreq = Map.empty<Text, Nat>();
    let zipFreq   = Map.empty<Text, Nat>();
    let phoneFreq = Map.empty<Text, Nat>();
    let webFreq   = Map.empty<Text, Nat>();

    for (citation in clientCitations.vals()) {
      let _ = nameFreq.get(citation.businessName);
      let _ = addrFreq.get(citation.address);
      let _ = cityFreq.get(citation.city);
      let _ = stateFreq.get(citation.state);
      let _ = zipFreq.get(citation.zipCode);
      let _ = phoneFreq.get(citation.phone);
      let _ = webFreq.get(citation.website);
    };

    // Helper to find most frequent value
    func mostFrequent(freqMap : Map.Map<Text, Nat>) : Text {
      var bestVal = "";
      var bestCount = 0;
      for ((val, count) in freqMap.entries()) {
        if (count > bestCount) {
          bestCount := count;
          bestVal := val;
        };
      };
      bestVal;
    };

    let canonicalName  = mostFrequent(nameFreq);
    let canonicalAddr  = mostFrequent(addrFreq);
    let canonicalCity  = mostFrequent(cityFreq);
    let canonicalState = mostFrequent(stateFreq);
    let canonicalZip   = mostFrequent(zipFreq);
    let canonicalPhone = mostFrequent(phoneFreq);
    let canonicalWeb   = mostFrequent(webFreq);

    var consistentCount = 0;
    var inconsistentCount = 0;
    let pendingCount = 0;
    let mismatchedFields = Map.empty<Text, [Text]>();

    for (citation in clientCitations.vals()) {
      let notes = List.empty<Text>();
      if (citation.businessName != canonicalName)  { notes.add("businessName") };
      if (citation.address != canonicalAddr)         { notes.add("address") };
      if (citation.city != canonicalCity)            { notes.add("city") };
      if (citation.state != canonicalState)        { notes.add("state") };
      if (citation.zipCode != canonicalZip)        { notes.add("zipCode") };
      if (citation.phone != canonicalPhone)        { notes.add("phone") };
      if (citation.website != canonicalWeb)        { notes.add("website") };

      let status = if (notes.size() == 0) {
        consistentCount += 1;
        #consistent;
      } else {
        inconsistentCount += 1;
        #inconsistent;
      };

      // Update citation with audit results
      let updated : T.Citation = {
        citation with
        status = status;
        inconsistencyNotes = notes.toArray();
        lastAuditedAt = ?Time.now();
      };
      state.citations.add(citation.id, updated);

      if (notes.size() > 0) {
        mismatchedFields.add(citation.id, notes.toArray());
      };
    };

    {
      clientBusinessId = clientBusinessId;
      totalCitations = totalCitations;
      consistentCount = consistentCount;
      inconsistentCount = inconsistentCount;
      pendingCount = pendingCount;
      canonicalNAP = {
        businessName = canonicalName;
        address = canonicalAddr;
        city = canonicalCity;
        state = canonicalState;
        zipCode = canonicalZip;
        phone = canonicalPhone;
        website = canonicalWeb;
      };
      mismatchedFields = mismatchedFields.toArray();
      auditTimestamp = Time.now();
    };
  };

}
