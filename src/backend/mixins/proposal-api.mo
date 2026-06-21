import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat  "mo:core/Nat";
import T    "../types/proposal";
import Lib  "../lib/proposal";

mixin (state : Lib.State) {

  /// Create a new proposal from scratch.
  public shared ({ caller = _ }) func createProposal(
    clientBusinessId  : Text,
    verticalProfileId : Text,
    title             : Text,
    executiveSummary  : Text,
    situationAnalysis : Text,
    strategyApproach  : Text,
    scopeOfWork       : Text,
    timeline          : Text,
    assumptions       : Text,
    clientResponsibilities : Text,
    nextSteps         : Text,
  ) : async { #ok : T.Proposal; #err : Text } {
    let now = Time.now();
    let id = "prop-" # now.toText() # "-" # clientBusinessId;
    let proposal : T.Proposal = {
      id;
      clientBusinessId;
      verticalProfileId;
      auditId = null;
      title;
      status = #draft;
      executiveSummary;
      situationAnalysis;
      strategyApproach;
      scopeOfWork;
      sections = [];
      investmentTiers = [];
      timeline;
      assumptions;
      clientResponsibilities;
      nextSteps;
      roiProjection = null;
      createdAt = now;
      updatedAt = now;
      sentAt = null;
    };
    Lib.save(state, proposal);
    #ok proposal;
  };

  /// Retrieve a proposal by id.
  public shared query ({ caller = _ }) func getProposal(id : Text) : async { #ok : T.Proposal; #err : Text } {
    switch (Lib.get(state, id)) {
      case (?p) { #ok p };
      case null { #err ("No proposal found for id: " # id) };
    };
  };

  /// Apply a partial update to a proposal.
  public shared ({ caller = _ }) func updateProposal(id : Text, update : T.ProposalUpdate) : async { #ok : Text; #err : Text } {
    if (Lib.update(state, id, update)) {
      #ok "Proposal updated.";
    } else {
      #err ("No proposal found for id: " # id);
    };
  };

  /// Delete a proposal.
  public shared ({ caller = _ }) func deleteProposal(id : Text) : async { #ok : Text; #err : Text } {
    if (Lib.delete(state, id)) {
      #ok "Proposal deleted.";
    } else {
      #err ("No proposal found for id: " # id);
    };
  };

  /// List all proposals for a client business.
  public shared query ({ caller = _ }) func listProposalsByClient(clientBusinessId : Text) : async { #ok : [T.Proposal]; #err : Text } {
    #ok (Lib.listByClient(state, clientBusinessId));
  };

  /// List proposals by status for a client.
  public shared query ({ caller = _ }) func listProposalsByStatus(clientBusinessId : Text, status : T.ProposalStatus) : async { #ok : [T.Proposal]; #err : Text } {
    #ok (Lib.listByStatus(state, clientBusinessId, status));
  };

  /// Generate a draft proposal from an audit reference.
  public shared ({ caller = _ }) func generateProposalFromAudit(
    clientBusinessId  : Text,
    verticalProfileId : Text,
    auditId           : Text,
    auditScore        : Nat,
    auditFindings     : [Text],
    auditRecommendations : [Text],
  ) : async { #ok : T.Proposal; #err : Text } {
    let proposal = Lib.generateFromAudit(state, clientBusinessId, verticalProfileId, auditId, auditScore, auditFindings, auditRecommendations);
    #ok proposal;
  };

}
