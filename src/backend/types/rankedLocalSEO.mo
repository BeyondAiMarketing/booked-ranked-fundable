import Time "mo:core/Time";

module {

  /// The Ranked Local SEO Agent manages local SEO strategy and execution.
  public type RankedLocalSEOState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    overallLocalScore : Nat;
    gbpScore : Nat;
    citationScore : Nat;
    reviewScore : Nat;
    contentScore : Nat;
    competitorScore : Nat;
    keywordRankings : [(Text, Nat)];
    activeTasks : [Text];
    completedTasks : [Text];
    nextAuditDue : Int;
    lastAuditAt : ?Int;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to initialize local SEO management.
  public type RankedLocalSEOInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    website : Text;
    primaryKeyword : Text;
    serviceArea : [Text];
  };

  /// Update for local SEO progress.
  public type RankedLocalSEOUpdate = {
    overallLocalScore : ?Nat;
    gbpScore : ?Nat;
    citationScore : ?Nat;
    reviewScore : ?Nat;
    contentScore : ?Nat;
    competitorScore : ?Nat;
    keywordRankings : ?[(Text, Nat)];
    activeTasks : ?[Text];
    completedTasks : ?[Text];
    nextAuditDue : ?Int;
    lastAuditAt : ??Int;
    updatedAt : ?Int;
  };

}
