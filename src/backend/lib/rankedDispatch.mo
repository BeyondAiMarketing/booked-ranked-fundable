import Map  "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import T    "../types/rankedDispatch";

module {

  public type State = {
    routes : Map.Map<Text, T.RankedDispatchRoute>;
  };

  public func emptyState() : State = {
    routes = Map.empty();
  };

  public func save(state : State, route : T.RankedDispatchRoute) : () {
    state.routes.add(route.id, route);
  };

  public func get(state : State, id : Text) : ?T.RankedDispatchRoute {
    state.routes.get(id);
  };

  public func update(state : State, id : Text, upd : T.RankedDispatchRouteUpdate) : ?T.RankedDispatchRoute {
    switch (state.routes.get(id)) {
      case (null) { null };
      case (?existing) {
        let updated : T.RankedDispatchRoute = {
          existing with
          requestText = upd.requestText;
          matchedAgent = upd.matchedAgent;
          status = upd.status;
          notes = upd.notes;
          updatedAt = Time.now();
        };
        state.routes.add(id, updated);
        ?updated;
      };
    };
  };

  public func delete(state : State, id : Text) : Bool {
    switch (state.routes.get(id)) {
      case (?_) { state.routes.remove(id); true };
      case null { false };
    };
  };

  public func listByClientBusiness(state : State, clientBusinessId : Text) : [T.RankedDispatchRoute] {
    let out = List.empty<T.RankedDispatchRoute>();
    for ((_, route) in state.routes.entries()) {
      if (route.clientBusinessId == clientBusinessId) { out.add(route) };
    };
    out.toArray();
  };

  public func listByStatus(state : State, status : T.RankedDispatchStatus) : [T.RankedDispatchRoute] {
    let out = List.empty<T.RankedDispatchRoute>();
    for ((_, route) in state.routes.entries()) {
      if (route.status == status) { out.add(route) };
    };
    out.toArray();
  };

  public func listAll(state : State) : [T.RankedDispatchRoute] {
    let out = List.empty<T.RankedDispatchRoute>();
    for ((_, route) in state.routes.entries()) { out.add(route) };
    out.toArray();
  };

  public func matchAgent(requestText : Text) : Text {
    let lower = requestText.toLower();
    if (lower.contains(#text "audit"))           { return "Local SEO Audit Agent" };
    if (lower.contains(#text "map pack"))         { return "GBP Optimization Agent + Competitor Scan" };
    if (lower.contains(#text "reviews"))          { return "Review Management Agent" };
    if (lower.contains(#text "citations"))        { return "Citation/NAP Agent" };
    if (lower.contains(#text "rankings"))         { return "Local Ranking Monitor" };
    if (lower.contains(#text "competitors"))      { return "Competitor Audit Agent" };
    if (lower.contains(#text "multi-location"))   { return "Multi-Location Rollup Agent" };
    if (lower.contains(#text "report"))           { return "Local Reporting Agent" };
    if (lower.contains(#text "service area"))     { return "Service Area SEO Agent" };
    if (lower.contains(#text "proposal"))         { return "Proposal Builder Agent" };
    "Ranked Dispatch Agent";
  };

};
