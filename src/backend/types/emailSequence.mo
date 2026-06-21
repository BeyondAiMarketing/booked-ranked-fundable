import Time "mo:core/Time";

module {

  /// An individual email step in a sequence.
  public type EmailStep = {
    stepNumber : Nat;
    subject : Text;
    body : Text;
    delayDays : Nat;
    sendTime : Text;
    personalizationTokens : [Text];
  };

  /// The Email Sequence Agent manages multi-step email campaigns.
  public type EmailSequenceState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    sequenceName : Text;
    campaignType : Text;
    steps : [EmailStep];
    totalRecipients : Nat;
    sentCount : Nat;
    openCount : Nat;
    clickCount : Nat;
    replyCount : Nat;
    unsubscribeCount : Nat;
    bounceCount : Nat;
    approvalStatus : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to create an email sequence.
  public type EmailSequenceInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    sequenceName : Text;
    campaignType : Text;
    steps : [EmailStep];
  };

  /// Update for email sequence progress.
  public type EmailSequenceUpdate = {
    sequenceName : ?Text;
    steps : ?[EmailStep];
    totalRecipients : ?Nat;
    sentCount : ?Nat;
    openCount : ?Nat;
    clickCount : ?Nat;
    replyCount : ?Nat;
    unsubscribeCount : ?Nat;
    bounceCount : ?Nat;
    approvalStatus : ?Text;
    updatedAt : ?Int;
  };

}
