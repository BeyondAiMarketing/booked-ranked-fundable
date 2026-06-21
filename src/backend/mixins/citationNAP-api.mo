import T "../types/citationNAP";
import L "../lib/citationNAP";

mixin (state : L.State) {

  public shared ({ caller = _ }) func createCitation(citation : T.Citation) : async () {
    L.save(state, citation);
  };

  public shared ({ caller = _ }) func getCitation(id : Text) : async ?T.Citation {
    L.get(state, id);
  };

  public shared ({ caller = _ }) func updateCitation(id : Text, update : T.CitationUpdate) : async ?T.Citation {
    L.update(state, id, update);
  };

  public shared ({ caller = _ }) func listCitationsByClient(clientBusinessId : Text) : async [T.Citation] {
    L.listByClient(state, clientBusinessId);
  };

  public shared ({ caller = _ }) func deleteCitation(id : Text) : async Bool {
    L.remove(state, id);
  };

  public shared ({ caller = _ }) func auditNAPConsistency(clientBusinessId : Text) : async T.NAPAuditResult {
    L.auditNAPConsistency(state, clientBusinessId);
  };

}
