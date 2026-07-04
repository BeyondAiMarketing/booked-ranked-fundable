import Map        "mo:core/Map";
import List       "mo:core/List";
import Time       "mo:core/Time";
import T          "../types/trialProvisioning";
import FunnelLib  "../lib/funnelTracking";

module {

  // 7 days in nanoseconds
  let sevenDaysNs : Int = 604_800_000_000_000;

  public type State = {
    trialAccounts : Map.Map<Text, T.TrialAccount>;
    /// leadId → trialId  (fast lookup by lead)
    leadIndex     : Map.Map<Text, Text>;
    /// simple counter for unique IDs
    counter       : { var value : Nat };
  };

  public func emptyState() : State = {
    trialAccounts = Map.empty();
    leadIndex     = Map.empty();
    counter       = { var value = 0 };
  };

  /// Provision a new trial account from a request.
  /// Logs a TrialActivated funnel event automatically.
  public func provisionTrial(
    state       : State,
    funnelState : FunnelLib.State,
    req         : T.TrialProvisionRequest,
  ) : { #ok : T.TrialAccount; #err : Text } {
    // Guard: already has a trial
    if (state.leadIndex.get(req.leadId) != null) {
      return #err "A trial account already exists for this lead.";
    };
    state.counter.value += 1;
    let id      = "trial-" # req.leadId # "-" # state.counter.value.toText();
    let now     = Time.now();
    let account : T.TrialAccount = {
      id;
      leadId       = req.leadId;
      email        = req.email;
      businessName = req.businessName;
      niche        = req.niche;
      city         = req.city;
      phone        = req.phone;
      website      = req.website;
      provisionedAt = now;
      expiresAt    = now + sevenDaysNs;
      status       = #Active;
    };
    state.trialAccounts.add(id, account);
    state.leadIndex.add(req.leadId, id);
    FunnelLib.logStep(funnelState, req.leadId, #TrialActivated, ?id);
    #ok account;
  };

  public func getTrial(state : State, id : Text) : ?T.TrialAccount {
    state.trialAccounts.get(id);
  };

  public func getTrialByLead(state : State, leadId : Text) : ?T.TrialAccount {
    switch (state.leadIndex.get(leadId)) {
      case (?id) state.trialAccounts.get(id);
      case null  null;
    };
  };

  public func getAllTrials(state : State) : [T.TrialAccount] {
    let result = List.empty<T.TrialAccount>();
    for ((_, acct) in state.trialAccounts.entries()) {
      result.add(acct);
    };
    result.toArray();
  };

  public func expireTrial(state : State, id : Text) : { #ok : (); #err : Text } {
    switch (state.trialAccounts.get(id)) {
      case null { #err "Trial not found." };
      case (?acct) {
        state.trialAccounts.add(id, { acct with status = #Expired });
        #ok ();
      };
    };
  };

};
