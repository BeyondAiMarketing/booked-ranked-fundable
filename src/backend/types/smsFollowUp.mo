import Time "mo:core/Time";

module {

  /// An individual SMS step in a follow-up sequence.
  public type SMSStep = {
    stepNumber : Nat;
    body : Text;
    delayHours : Nat;
    sendTime : Text;
  };

  /// The SMS Follow-Up Agent manages text message campaigns.
  public type SMSFollowUpState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    sequenceName : Text;
    campaignType : Text;
    steps : [SMSStep];
    totalRecipients : Nat;
    sentCount : Nat;
    replyCount : Nat;
    optOutCount : Nat;
    consentVerified : Bool;
    approvalStatus : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to create an SMS follow-up sequence.
  public type SMSFollowUpInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    sequenceName : Text;
    campaignType : Text;
    steps : [SMSStep];
  };

  /// Update for SMS follow-up progress.
  public type SMSFollowUpUpdate = {
    sequenceName : ?Text;
    steps : ?[SMSStep];
    totalRecipients : ?Nat;
    sentCount : ?Nat;
    replyCount : ?Nat;
    optOutCount : ?Nat;
    consentVerified : ?Bool;
    approvalStatus : ?Text;
    updatedAt : ?Int;
  };

}
