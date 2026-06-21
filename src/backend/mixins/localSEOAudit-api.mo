import T "../types/localSEOAudit";
import L "../lib/localSEOAudit";

module {

  public func mixin(state : L.State) : actor {

    public shared ({ caller = _ }) func createLocalSEOAudit(audit : T.LocalSEOAudit) : async () {
      L.save(state, audit);
    };

    public shared ({ caller = _ }) func getLocalSEOAudit(id : Text) : async ?T.LocalSEOAudit {
      L.get(state, id);
    };

    public shared ({ caller = _ }) func updateLocalSEOAudit(id : Text, update : T.LocalSEOAuditUpdate) : async ?T.LocalSEOAudit {
      L.update(state, id, update);
    };

    public shared ({ caller = _ }) func listLocalSEOAUDitsByClient(clientBusinessId : Text) : async [T.LocalSEOAudit] {
      L.listByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func getLatestLocalSEOAudit(clientBusinessId : Text) : async ?T.LocalSEOAudit {
      L.getLatestByClient(state, clientBusinessId);
    };

    public shared ({ caller = _ }) func deleteLocalSEOAudit(id : Text) : async Bool {
      L.remove(state, id);
    };

  };

}
