module {

  /// Sentiment classification for review replies.
  public type ReviewSentiment = {
    #positive;
    #neutral;
    #negative;
    #critical;
  };

  /// Status of a review reply draft in the approval pipeline.
  public type ReviewReplyStatus = {
    #draft;
    #pending_approval;
    #approved;
    #rejected;
    #sent;
    #failed;
    #archived;
  };

  /// A review reply draft awaiting approval before sending.
  public type ReviewReplyDraft = {
    id              : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    reviewId        : Text;
    reviewerName    : Text;
    originalRating  : Nat;
    originalText    : Text;
    sentiment       : ReviewSentiment;
    replyText       : Text;
    includesServiceMention : Bool;
    includesLocationMention : Bool;
    isEscalated     : Bool;
    approvalStatus  : ReviewReplyStatus;
    n8nStatus       : ?Text;
    sentAt          : ?Int;
    createdAt       : Int;
    updatedAt       : Int;
  };

  /// Partial update for a review reply draft.
  public type ReviewReplyDraftUpdate = {
    replyText       : ?Text;
    includesServiceMention : ?Bool;
    includesLocationMention : ?Bool;
    isEscalated     : ?Bool;
    approvalStatus  : ?ReviewReplyStatus;
    n8nStatus       : ?Text;
    sentAt          : ?Int;
  };

}
