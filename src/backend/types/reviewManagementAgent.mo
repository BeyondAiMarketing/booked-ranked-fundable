import Time "mo:core/Time";

module {

  /// The Review Management Agent handles review requests and reply drafting.
  public type ReviewManagementAgentState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    totalReviews : Nat;
    averageRating : Nat;
    responseRate : Nat;
    reviewVelocity : Nat;
    pendingReplies : [Text];
    draftedReplies : [Text];
    sentRequests : [Text];
    requestTemplates : [Text];
    replyTemplates : [Text];
    sentimentTrend : Text;
    competitorComparison : ?Text;
    lastReviewAt : ?Int;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to initialize review management.
  public type ReviewManagementAgentInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    gbpUrl : Text;
    industry : Text;
  };

  /// Update for review management progress.
  public type ReviewManagementAgentUpdate = {
    totalReviews : ?Nat;
    averageRating : ?Nat;
    responseRate : ?Nat;
    reviewVelocity : ?Nat;
    pendingReplies : ?[Text];
    draftedReplies : ?[Text];
    sentRequests : ?[Text];
    requestTemplates : ?[Text];
    replyTemplates : ?[Text];
    sentimentTrend : ?Text;
    competitorComparison : ??Text;
    lastReviewAt : ??Int;
    updatedAt : ?Int;
  };

}
