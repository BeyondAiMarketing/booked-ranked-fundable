module {

  /// Platform-level BRF sales voice agent configuration.
  /// Controls both the inbound agent (answers calls to BRF's own number)
  /// and the outbound closing agent (calls prospects after intake/audit).
  public type BrfVoiceAgentConfig = {
    inboundEnabled            : Bool;
    outboundEnabled           : Bool;
    inboundVapiAssistantId    : Text;
    outboundVapiAssistantId   : Text;
    inboundPhoneNumber        : Text;
    brfBrandName              : Text;
    objectionHandlingEnabled  : Bool;
    maxOutboundAttempts       : Nat;   // default 2
    retryDelayMinutes         : Nat;   // default 30
  };

  /// Status of a single outbound call attempt.
  public type BrfCallStatus = {
    #Pending;
    #Calling;
    #Connected;
    #NoAnswer;
    #Failed;
    #SmsFallbackSent;
  };

  /// One outbound call attempt record targeting a brand-kit prospect.
  public type BrfOutboundCallAttempt = {
    id                 : Text;
    prospectSlug       : Text;
    attemptNumber      : Nat;
    triggeredAt        : Int;
    callStatus         : BrfCallStatus;
    vapiCallId         : ?Text;
    smsFallbackSentAt  : ?Int;
    convertedToTrial   : Bool;
  };

  /// Aggregate conversion statistics for the admin dashboard.
  public type BrfCallConversionStats = {
    totalAttempts  : Nat;
    totalConnected : Nat;
    totalConverted : Nat;
    smsFallbackCount : Nat;
    conversionRate : Float;
  };

};
