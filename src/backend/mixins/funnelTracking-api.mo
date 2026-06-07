import FunnelLib "../lib/funnelTracking";
import T         "../types/funnelTracking";

mixin (funnelState : FunnelLib.State) {

  /// Log a funnel step for a lead.  step must match a FunnelStepType variant name
  /// (e.g. "EmailSent", "DemoCompleted", "TrialActivated").
  public shared ({ caller = _ }) func logFunnelStep(
    leadId   : Text,
    step     : Text,
    metadata : ?Text,
  ) : async { #ok : (); #err : Text } {
    let stepType : T.FunnelStepType = switch step {
      case "EmailSent"     #EmailSent;
      case "EmailOpened"   #EmailOpened;
      case "EmailClicked"  #EmailClicked;
      case "DemoStarted"   #DemoStarted;
      case "DemoStep1"     #DemoStep1;
      case "DemoStep2"     #DemoStep2;
      case "DemoStep3"     #DemoStep3;
      case "DemoStep4"     #DemoStep4;
      case "DemoCompleted" #DemoCompleted;
      case "TrialActivated" #TrialActivated;
      case _               { return #err ("Unknown step: " # step) };
    };
    FunnelLib.logStep(funnelState, leadId, stepType, metadata);
    #ok ();
  };

  /// Return the full funnel timeline for a lead.
  public query ({ caller = _ }) func getFunnelTimeline(
    leadId : Text,
  ) : async { #ok : T.FunnelTimeline; #err : Text } {
    #ok (FunnelLib.getTimeline(funnelState, leadId));
  };

  /// Return funnel timelines for all leads.
  public query ({ caller = _ }) func getAllFunnelEvents()
    : async { #ok : [(Text, T.FunnelTimeline)]; #err : Text } {
    #ok (FunnelLib.getAllEvents(funnelState));
  };

};
