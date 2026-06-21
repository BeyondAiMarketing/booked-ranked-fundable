module {

  /// Status of a citation/NAP listing.
  public type CitationStatus = {
    #pending_audit;
    #consistent;
    #inconsistent;
    #fixed;
    #needs_approval;
  };

  /// A single citation or NAP (Name, Address, Phone) listing.
  public type Citation = {
    id              : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    sourceName      : Text;     // e.g. "Yelp", "Google", "BBB", "YellowPages"
    sourceUrl       : Text;
    businessName    : Text;
    address         : Text;
    city            : Text;
    state           : Text;
    zipCode         : Text;
    phone           : Text;
    website         : Text;
    status          : CitationStatus;
    inconsistencyNotes : [Text]; // list of fields that mismatch vs. canonical NAP
    lastAuditedAt   : ?Int;
    createdAt       : Int;
  };

  /// Partial update for a citation.
  public type CitationUpdate = {
    sourceName      : ?Text;
    sourceUrl       : ?Text;
    businessName    : ?Text;
    address         : ?Text;
    city            : ?Text;
    state           : ?Text;
    zipCode         : ?Text;
    phone           : ?Text;
    website         : ?Text;
    status          : ?CitationStatus;
    inconsistencyNotes : ?[Text];
    lastAuditedAt   : ?Int;
  };

  /// Result of a NAP consistency audit.
  public type NAPAuditResult = {
    clientBusinessId : Text;
    totalCitations   : Nat;
    consistentCount  : Nat;
    inconsistentCount : Nat;
    pendingCount     : Nat;
    canonicalNAP       : {
      businessName : Text;
      address      : Text;
      city         : Text;
      state        : Text;
      zipCode      : Text;
      phone        : Text;
      website      : Text;
    };
    mismatchedFields : [(Text, [Text])]; // (citationId, [fieldNames])
    auditTimestamp   : Int;
  };

}
