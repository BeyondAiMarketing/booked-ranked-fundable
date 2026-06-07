import Map  "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import T    "../types/funnelTracking";

module {

  public type State = {
    funnelEvents : Map.Map<Text, List.List<T.FunnelEvent>>;
  };

  public func emptyState() : State = {
    funnelEvents = Map.empty<Text, List.List<T.FunnelEvent>>();
  };

  /// Append a funnel step event for a lead.
  public func logStep(state : State, leadId : Text, step : T.FunnelStepType, metadata : ?Text) : () {
    let existing = switch (state.funnelEvents.get(leadId)) {
      case (?lst) lst;
      case null   List.empty<T.FunnelEvent>();
    };
    existing.add({
      leadId;
      step;
      timestamp = Time.now();
      metadata;
    });
    state.funnelEvents.add(leadId, existing);
  };

  /// Return the full ordered timeline for a lead.
  public func getTimeline(state : State, leadId : Text) : T.FunnelTimeline {
    let events : [T.FunnelEvent] = switch (state.funnelEvents.get(leadId)) {
      case (?lst) lst.toArray();
      case null   [];
    };
    { leadId; events };
  };

  /// Return every timeline across all leads.
  public func getAllEvents(state : State) : [(Text, T.FunnelTimeline)] {
    let result = List.empty<(Text, T.FunnelTimeline)>();
    for ((leadId, lst) in state.funnelEvents.entries()) {
      result.add((leadId, { leadId; events = lst.toArray() }));
    };
    result.toArray();
  };

};
