module {

  /// All steps a lead can pass through in the BRF funnel.
  public type FunnelStepType = {
    #EmailSent;
    #EmailOpened;
    #EmailClicked;
    #DemoStarted;
    #DemoStep1;
    #DemoStep2;
    #DemoStep3;
    #DemoStep4;
    #DemoCompleted;
    #TrialActivated;
  };

  /// A single funnel event for a lead.
  public type FunnelEvent = {
    leadId    : Text;
    step      : FunnelStepType;
    timestamp : Int;
    metadata  : ?Text;
  };

  /// The ordered sequence of funnel events for one lead.
  public type FunnelTimeline = {
    leadId : Text;
    events : [FunnelEvent];
  };

};
