import T "../types/competitorAudit";
import L "../lib/competitorAudit";

module {

  public func mixin(state : L.State) : actor {

    public shared ({ caller = _ }) func createCompetitorAudit(audit : T.CompetitorAudit) : async () {
      L.save(state, audit);
    };

    public shared ({ caller = _ }) func getCompetitorAudit(id : Text) : async ?T.CompetitorAudit {
      L.get(state, id);
    };

    public shared ({ caller = _ }) func updateCompetitorAudit(id : Text, update : T.CompetitorAuditUpdate) : async ?T.CompetitorAudit {
      L.update(state, id, update);
    };

    public shared ({ caller = _ }) func listCompetitorAuditsByClient(clientBusinessId : Text) : async [T.CompetitorAudit] {
      L.listByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func getLatestCompetitorAudit(clientBusinessId : Text) : async ?T.CompetitorAudit {
      L.getLatestByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func deleteCompetitorAudit(id : Text) : async Bool {
      L.remove(state, id);
    };

  };

}
