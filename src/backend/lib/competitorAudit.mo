import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/competitorAudit";

module {

  public type State = {
    audits : Map.Map<Text, T.CompetitorAudit>;
  };

  public func emptyState() : State = {
    audits = Map.empty<Text, T.CompetitorAudit>();
  };

  public func save(state : State, audit : T.CompetitorAudit) : () {
    state.audits.add(audit.id, audit);
  };

  public func get(state : State, id : Text) : ?T.CompetitorAudit {
    state.audits.get(id);
  };

  public func update(state : State, id : Text, update : T.CompetitorAuditUpdate) : ?T.CompetitorAudit {
    switch (state.audits.get(id)) {
      case null { null };
      case (?existing) {
        let updated : T.CompetitorAudit = {
          existing with
          status          = switch (update.status)          { case (?v) v; case null existing.status          };
          competitors     = switch (update.competitors)     { case (?v) v; case null existing.competitors     };
          marketPosition  = switch (update.marketPosition)  { case (?v) v; case null existing.marketPosition  };
          gapAnalysis     = switch (update.gapAnalysis)     { case (?v) v; case null existing.gapAnalysis     };
          opportunities   = switch (update.opportunities)   { case (?v) v; case null existing.opportunities   };
          threats         = switch (update.threats)         { case (?v) v; case null existing.threats         };
          recommendations = switch (update.recommendations) { case (?v) v; case null existing.recommendations };
          completedAt     = switch (update.completedAt)     { case (?v) ?v; case null existing.completedAt     };
        };
        state.audits.add(id, updated);
        ?updated;
      };
    };
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.CompetitorAudit] {
    let out = Map.empty<Text, T.CompetitorAudit>();
    for ((id, audit) in state.audits.entries()) {
      if (audit.clientBusinessId == clientBusinessId) { out.add(id, audit) };
    };
    let result = Map.empty<T.CompetitorAudit>();
    for ((_, audit) in out.entries()) { result.add(audit) };
    result.toArray();
  };

  public func getLatestByClient(state : State, clientBusinessId : Text) : ?T.CompetitorAudit {
    var latest : ?T.CompetitorAudit = null;
    for ((_, audit) in state.audits.entries()) {
      if (audit.clientBusinessId == clientBusinessId) {
        switch (latest) {
          case null { latest := ?audit };
          case (?l) { if (audit.createdAt > l.createdAt) { latest := ?audit } };
        };
      };
    };
    latest;
  };

  public func remove(state : State, id : Text) : Bool {
    switch (state.audits.get(id)) {
      case (?_) { state.audits.remove(id); true };
      case null false;
    };
  };

}
