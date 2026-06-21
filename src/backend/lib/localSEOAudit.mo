import Map  "mo:core/Map";
import Time "mo:core/Time";
import T    "../types/localSEOAudit";

module {

  public type State = {
    audits : Map.Map<Text, T.LocalSEOAudit>;
  };

  public func emptyState() : State = {
    audits = Map.empty<Text, T.LocalSEOAudit>();
  };

  public func save(state : State, audit : T.LocalSEOAudit) : () {
    state.audits.add(audit.id, audit);
  };

  public func get(state : State, id : Text) : ?T.LocalSEOAudit {
    state.audits.get(id);
  };

  public func update(state : State, id : Text, update : T.LocalSEOAuditUpdate) : ?T.LocalSEOAudit {
    switch (state.audits.get(id)) {
      case null { null };
      case (?existing) {
        let updated : T.LocalSEOAudit = {
          existing with
          status          = switch (update.status)          { case (?v) v; case null existing.status          };
          overallScore    = switch (update.overallScore)    { case (?v) v; case null existing.overallScore    };
          gbpScore        = switch (update.gbpScore)        { case (?v) v; case null existing.gbpScore        };
          citationScore   = switch (update.citationScore)   { case (?v) v; case null existing.citationScore   };
          reviewScore     = switch (update.reviewScore)     { case (?v) v; case null existing.reviewScore     };
          websiteScore    = switch (update.websiteScore)    { case (?v) v; case null existing.websiteScore    };
          competitorScore = switch (update.competitorScore) { case (?v) v; case null existing.competitorScore };
          findings        = switch (update.findings)        { case (?v) v; case null existing.findings        };
          criticalCount   = switch (update.criticalCount)   { case (?v) v; case null existing.criticalCount   };
          importantCount  = switch (update.importantCount)  { case (?v) v; case null existing.importantCount  };
          monitorCount    = switch (update.monitorCount)    { case (?v) v; case null existing.monitorCount    };
          goodCount       = switch (update.goodCount)       { case (?v) v; case null existing.goodCount       };
          topQuickWins    = switch (update.topQuickWins)    { case (?v) v; case null existing.topQuickWins    };
          strategicRecommendations = switch (update.strategicRecommendations) { case (?v) v; case null existing.strategicRecommendations };
          completedAt     = switch (update.completedAt)     { case (?v) ?v; case null existing.completedAt     };
        };
        state.audits.add(id, updated);
        ?updated;
      };
    };
  };

  public func listByClient(state : State, clientBusinessId : Text) : [T.LocalSEOAudit] {
    let out = Map.empty<Text, T.LocalSEOAudit>();
    for ((id, audit) in state.audits.entries()) {
      if (audit.clientBusinessId == clientBusinessId) { out.add(id, audit) };
    };
    let result = Map.empty<T.LocalSEOAudit>();
    for ((_, audit) in out.entries()) { result.add(audit) };
    result.toArray();
  };

  public func getLatestByClient(state : State, clientBusinessId : Text) : ?T.LocalSEOAudit {
    var latest : ?T.LocalSEOAudit = null;
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
