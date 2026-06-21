import Time "mo:core/Time";

module {

  /// A content calendar entry for the Social Content Calendar Agent.
  public type CalendarEntry = {
    day : Nat;
    platform : Text;
    pillar : Text;
    format : Text;
    objective : Text;
    topic : Text;
    angle : Text;
    visualDirection : Text;
    cta : Text;
    approvalStatus : Text;
  };

  /// The Social Content Calendar Agent manages 30-day content calendars.
  public type SocialContentCalendarAgentState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    calendarMonth : Text;
    entries : [CalendarEntry];
    brandVoiceApplied : Bool;
    verticalAwarenessChecked : Bool;
    approvalStatus : Text;
    bestPerformersReferenced : [Text];
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to create a content calendar.
  public type SocialContentCalendarAgentInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    calendarMonth : Text;
    brandVoiceId : Text;
  };

  /// Update for content calendar progress.
  public type SocialContentCalendarAgentUpdate = {
    entries : ?[CalendarEntry];
    brandVoiceApplied : ?Bool;
    verticalAwarenessChecked : ?Bool;
    approvalStatus : ?Text;
    bestPerformersReferenced : ?[Text];
    updatedAt : ?Int;
  };

}
