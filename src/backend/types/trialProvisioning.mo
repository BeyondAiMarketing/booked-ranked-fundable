module {

  public type TrialStatus = { #Active; #Expired; #Converted };

  /// A provisioned 7-day trial account record.
  public type TrialAccount = {
    id           : Text;
    leadId       : Text;
    email        : Text;
    businessName : Text;
    niche        : Text;
    city         : Text;
    phone        : ?Text;
    website      : ?Text;
    provisionedAt : Int;
    expiresAt    : Int;
    status       : TrialStatus;
  };

  /// Input for provisioning a new trial account.
  public type TrialProvisionRequest = {
    leadId       : Text;
    email        : Text;
    businessName : Text;
    niche        : Text;
    city         : Text;
    phone        : ?Text;
    website      : ?Text;
  };

};
