module {

  /// Extended industry/niche vertical configuration for a client business.
  public type VerticalProfileExt = {
    id                      : Text;
    tenantId                : Text;
    niche                   : Text;
    category                : Text;
    commonServices            : [Text];
    subNiches               : [Text];
    services                : [Text];
    commonLeadTypes         : [Text];
    targetAudience          : Text;
    positioning             : Text;
    differentiators         : [Text];
    brandVoice              : Text;
    doRules                 : [Text];
    doNotRules              : [Text];
    competitors             : [Text];
    serviceArea             : [Text];
    keywords                : [Text];
    contentPillars          : [Text];
    localSEOKeywordPatterns : [Text];
    commonGBPPostTypes      : [Text];
    commonReviewThemes      : [Text];
    complianceNotes         : Text;
    defaultPipelineLabels   : [Text];
    commonOffers            : [Text];
    commonCampaignTypes     : [Text];
    fundingNeeds            : [Text];
    emailTone               : Text;
    smsTone                 : Text;
    prohibitedClaims        : [Text];
    recommendedDisclaimers  : [Text];
    exampleContentAngles    : [Text];
    exampleEmailTemplates   : [Text];
    exampleSMSFollowUps     : [Text];
    proposalDeliverables    : [Text];
    leadFormFields          : [Text];
    createdAt               : Nat;
    updatedAt               : Nat;
  };

  /// Legacy-compatible vertical profile with 17 fields for stable storage migration.
  public type VerticalProfile = {
    id            : Text;
    tenantId      : Text;
    niche         : Text;
    subNiches     : [Text];
    services      : [Text];
    targetAudience: Text;
    positioning   : Text;
    differentiators : [Text];
    brandVoice    : Text;
    doRules       : Text;
    doNotRules    : Text;
    competitors   : [Text];
    serviceArea   : Text;
    keywords      : [Text];
    contentPillars: [Text];
    createdAt     : Int;
    updatedAt     : Int;
  };

  public type VerticalProfileUpdate = {
    niche                   : ?Text;
    category                : ?Text;
    subNiches               : ?[Text];
    services                : ?[Text];
    commonLeadTypes         : ?[Text];
    targetAudience          : ?Text;
    positioning             : ?Text;
    differentiators         : ?[Text];
    brandVoice              : ?Text;
    doRules                 : ?[Text];
    doNotRules              : ?[Text];
    competitors             : ?[Text];
    serviceArea             : ?[Text];
    keywords                : ?[Text];
    contentPillars          : ?[Text];
    localSEOKeywordPatterns : ?[Text];
    commonGBPPostTypes      : ?[Text];
    commonReviewThemes      : ?[Text];
    complianceNotes         : ?Text;
    defaultPipelineLabels   : ?[Text];
    commonOffers            : ?[Text];
    commonCampaignTypes     : ?[Text];
    fundingNeeds            : ?[Text];
    emailTone               : ?Text;
    smsTone                 : ?Text;
    prohibitedClaims        : ?[Text];
    recommendedDisclaimers  : ?[Text];
    exampleContentAngles    : ?[Text];
    exampleEmailTemplates   : ?[Text];
    exampleSMSFollowUps     : ?[Text];
    proposalDeliverables    : ?[Text];
    leadFormFields          : ?[Text];
  };

};
