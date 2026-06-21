import Time "mo:core/Time";

module {

  /// The Prospect Audit Agent scores a prospect's digital presence.
  public type ProspectAuditState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    websiteUrl : Text;
    overallScore : Nat;
    bookedScore : Nat;
    rankedScore : Nat;
    fundedScore : Nat;
    findings : [Text];
    criticalGaps : [Text];
    quickWins : [Text];
    recommendations : [Text];
    auditStatus : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to run a prospect audit.
  public type ProspectAuditInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    websiteUrl : Text;
    businessName : Text;
    location : Text;
    industry : Text;
  };

  /// Update for prospect audit results.
  public type ProspectAuditUpdate = {
    overallScore : ?Nat;
    bookedScore : ?Nat;
    rankedScore : ?Nat;
    fundedScore : ?Nat;
    findings : ?[Text];
    criticalGaps : ?[Text];
    quickWins : ?[Text];
    recommendations : ?[Text];
    auditStatus : ?Text;
    updatedAt : ?Int;
  };

}
