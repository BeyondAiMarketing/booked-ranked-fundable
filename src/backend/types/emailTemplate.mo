module {

  /// Campaign type variant for email templates and sequences.
  public type CampaignType = {
    #leadNurture;
    #coldEmail;
    #oldLeadReactivation;
    #proposalFollowUp;
    #referralPartnerOutreach;
    #reviewRequest;
    #localBusinessOutreach;
    #seasonalPromo;
    #financingOffer;
    #eventWebinar;
    #verticalSpecific;
  };

  /// A single pre-written campaign email template with merge fields and a fallback (old stable-compatible version).
  public type EmailTemplate = {
    id             : Nat;
    day            : Nat;
    subject        : Text;       // May contain {{merge_fields}}
    body           : Text;       // May contain {{merge_fields}}
    fallbackSubject : Text;      // Plain version, no audit-specific fields
    fallbackBody   : Text;       // Plain version, no audit-specific fields
    updatedAt      : Int;
  };

  /// Extended email template with all new fields (not in stable storage).
  public type EmailTemplateExt = {
    id             : Nat;
    day            : Nat;
    subject        : Text;
    body           : Text;
    fallbackSubject : Text;
    fallbackBody   : Text;
    updatedAt      : Int;
    // New fields
    campaignType   : ?CampaignType;
    verticalProfileId : ?Text;
    complianceNotes : ?Text;
    consentRequired : ?Bool;
    unsubscribeFooter : ?Bool;
  };

  /// Admin-editable fields for updating a template.
  public type TemplateUpdate = {
    subject        : Text;
    body           : Text;
    fallbackSubject : Text;
    fallbackBody   : Text;
  };

  /// Per-lead send log entry — records which template version was used.
  public type SendLogEntry = {
    day            : Nat;
    sentAt         : Int;
    templateId     : Nat;
    usedFallback   : Bool;
  };

};
