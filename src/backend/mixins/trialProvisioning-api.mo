import TrialLib  "../lib/trialProvisioning";
import FunnelLib "../lib/funnelTracking";
import T         "../types/trialProvisioning";

mixin (
  trialState  : TrialLib.State,
  funnelState : FunnelLib.State,
) {

  /// Provision a new 7-day trial account for a lead that completed the demo.
  public shared ({ caller = _ }) func provisionTrialAccount(
    req : T.TrialProvisionRequest,
  ) : async { #ok : T.TrialAccount; #err : Text } {
    TrialLib.provisionTrial(trialState, funnelState, req);
  };

  /// Look up a trial account by its ID.
  public query ({ caller = _ }) func getTrialAccount(
    id : Text,
  ) : async { #ok : T.TrialAccount; #err : Text } {
    switch (TrialLib.getTrial(trialState, id)) {
      case (?acct) #ok acct;
      case null    #err "Trial not found.";
    };
  };

  /// Return all trial accounts.
  public query ({ caller = _ }) func getAllTrialAccounts()
    : async { #ok : [T.TrialAccount]; #err : Text } {
    #ok (TrialLib.getAllTrials(trialState));
  };

  /// Look up a trial account by the lead ID it was provisioned for.
  public query ({ caller = _ }) func getTrialByLeadId(
    leadId : Text,
  ) : async { #ok : T.TrialAccount; #err : Text } {
    switch (TrialLib.getTrialByLead(trialState, leadId)) {
      case (?acct) #ok acct;
      case null    #err "No trial found for this lead.";
    };
  };

};
