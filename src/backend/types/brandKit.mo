module {

  /// Trial lifecycle status for a brand kit prospect.
  public type TrialStatus = {
    #NotStarted;
    #Active;
    #Expired;
    #Converted;
  };

  /// A prospect who submitted the instant brand kit intake form.
  /// Keyed by kitPageSlug in the stable map.
  public type BrandKitProspect = {
    id                 : Text;
    businessName       : Text;
    niche              : Text;   // plumber | med-spa | hvac | restoration | carpet-cleaning | roofing
    city               : Text;
    phone              : Text;
    website            : ?Text;
    firstName          : Text;
    createdAt          : Int;
    kitPageSlug        : Text;   // unique URL slug, e.g. "elite-plumbing-dallas-a3f2"
    trialStatus        : TrialStatus;
    trialStartedAt     : ?Int;
    trialDay           : Nat;    // 0 = not started, 1-7 = active day, 8 = expired
    trialExpiresAt     : ?Int;
    activationAction   : ?Text;  // which action triggered trial start
    vapiAssistantId    : ?Text;
    auditScore         : ?Nat;
    outreachKitSentAt  : ?Int;
    outreachKitOpenedAt: ?Int;
    utmSource          : ?Text;
    utmCampaign        : ?Text;
    convertedAt        : ?Int;
    lastActivityAt     : ?Int;
    featuresUsed       : [Text]; // which features the prospect has explored
  };

  /// An outreach job targeting a specific business with a branding kit.
  public type BrandKitOutreachJob = {
    id                 : Text;
    niche              : Text;
    targetBusinessName : Text;
    targetEmail        : Text;
    targetCity         : Text;
    kitSlug            : Text;
    status             : Text;   // pending | sent | opened | clicked | converted
    sentAt             : ?Int;
    openedAt           : ?Int;
    clickedAt          : ?Int;
    utmParams          : Text;
  };

};
