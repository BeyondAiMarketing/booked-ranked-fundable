module {

  /// Tracks a client's domain configuration wizard progress.
  public type PropagationStatus = {
    percentage : Nat;
    isLive     : Bool;
    checkedAt  : Int;
  };

  public type DomainSetupState = {
    clientId            : Text;
    domain              : Text;
    registrar           : ?Text;   // "godaddy" | "namecheap" | "cloudflare" | "other"
    aRecord             : Text;
    cname               : Text;
    propagationStatus   : PropagationStatus;
    siteImportStatus    : Text;    // "pending" | "importing" | "done" | "failed"
    importedPageCount   : Nat;
    currentStep         : Nat;     // 1-7
    createdAt           : Int;
    updatedAt           : Int;
  };

  /// Personalized audit report generated at the end of the live demo.
  public type DemoAuditReport = {
    prospectEmail   : Text;
    businessName    : Text;
    niche           : Text;
    score           : Nat;        // 0-100
    gaps            : [Text];
    recommendations : [Text];
    createdAt       : Int;
  };

};
