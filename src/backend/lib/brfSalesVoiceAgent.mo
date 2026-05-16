import T "../types/brfSalesVoiceAgent";
import Time "mo:core/Time";

module {

  /// Generate a time-based unique id with a given prefix.
  public func genId(prefix : Text, counter : Nat) : Text {
    prefix # "-" # Time.now().toText() # "-" # counter.toText()
  };

  /// Default configuration with safe defaults.
  public func defaultConfig() : T.BrfVoiceAgentConfig {
    {
      inboundEnabled           = false;
      outboundEnabled          = false;
      inboundVapiAssistantId   = "";
      outboundVapiAssistantId  = "";
      inboundPhoneNumber       = "";
      brfBrandName             = "BRF";
      objectionHandlingEnabled = true;
      maxOutboundAttempts      = 2;
      retryDelayMinutes        = 30;
    }
  };

  /// Build an initial #Pending call attempt for a prospect.
  public func newCallAttempt(
    id           : Text,
    prospectSlug : Text,
    attemptNumber : Nat,
  ) : T.BrfOutboundCallAttempt {
    {
      id;
      prospectSlug;
      attemptNumber;
      triggeredAt       = Time.now();
      callStatus        = #Pending;
      vapiCallId        = null;
      smsFallbackSentAt = null;
      convertedToTrial  = false;
    }
  };

  /// Compute aggregate conversion stats from an array of attempts.
  public func computeStats(attempts : [T.BrfOutboundCallAttempt]) : T.BrfCallConversionStats {
    var total      : Nat = 0;
    var connected  : Nat = 0;
    var converted  : Nat = 0;
    var smsFallback : Nat = 0;

    for (a in attempts.vals()) {
      total += 1;
      switch (a.callStatus) {
        case (#Connected)       { connected  += 1 };
        case (#SmsFallbackSent) { smsFallback += 1 };
        case (_) {};
      };
      if (a.convertedToTrial) { converted += 1 };
    };

    let rate : Float = if (total == 0) {
      0.0
    } else {
      converted.toFloat() / total.toFloat() * 100.0
    };

    {
      totalAttempts    = total;
      totalConnected   = connected;
      totalConverted   = converted;
      smsFallbackCount = smsFallback;
      conversionRate   = rate;
    }
  };

};
