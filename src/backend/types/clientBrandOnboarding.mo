import Time "mo:core/Time";

module {

  /// The Client Brand Onboarding Agent captures brand voice and business context.
  public type ClientBrandOnboardingState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    onboardingStep : Text;
    confirmedFacts : [Text];
    assumptions : [Text];
    missingQuestions : [Text];
    targetAudience : Text;
    services : [Text];
    positioning : Text;
    differentiators : [Text];
    brandVoice : Text;
    doRules : [Text];
    doNotRules : [Text];
    brandVoiceCaptured : Bool;
    businessBriefCreated : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to start brand onboarding.
  public type ClientBrandOnboardingInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    businessName : Text;
    website : Text;
    industry : Text;
    knownServices : [Text];
  };

  /// Update for brand onboarding progress.
  public type ClientBrandOnboardingUpdate = {
    onboardingStep : ?Text;
    confirmedFacts : ?[Text];
    assumptions : ?[Text];
    missingQuestions : ?[Text];
    targetAudience : ?Text;
    services : ?[Text];
    positioning : ?Text;
    differentiators : ?[Text];
    brandVoice : ?Text;
    doRules : ?[Text];
    doNotRules : ?[Text];
    brandVoiceCaptured : ?Bool;
    businessBriefCreated : ?Bool;
    updatedAt : ?Int;
  };

}
