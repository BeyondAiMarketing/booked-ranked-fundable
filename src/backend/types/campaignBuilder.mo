import Time "mo:core/Time";

module {

  /// Campaign type for the Campaign Builder Agent.
  public type CampaignType = {
    #lead_nurture;
    #cold_email;
    #old_lead_reactivation;
    #proposal_follow_up;
    #referral_partner_outreach;
    #review_request;
    #local_business_outreach;
    #seasonal_promo;
    #financing_offer;
    #event_webinar;
    #vertical_specific;
  };

  /// The Campaign Builder Agent creates and manages outreach campaigns.
  public type CampaignBuilderState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    campaignType : CampaignType;
    campaignName : Text;
    targetAudience : Text;
    messageDraft : Text;
    subjectLine : Text;
    ctaText : Text;
    sequenceSteps : [Text];
    approvalStatus : Text;
    sendCount : Nat;
    openCount : Nat;
    replyCount : Nat;
    unsubscribeCount : Nat;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to create a campaign.
  public type CampaignBuilderInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    campaignType : CampaignType;
    campaignName : Text;
    targetAudience : Text;
  };

  /// Update for campaign progress.
  /// Generic aliases for lib/mixin compatibility
  public type Record = CampaignBuilderState;
  public type CreateRequest = CampaignBuilderInput;
  public type UpdateRequest = CampaignBuilderUpdate;

  public type CampaignBuilderUpdate = {
    campaignName : ?Text;
    targetAudience : ?Text;
    messageDraft : ?Text;
    subjectLine : ?Text;
    ctaText : ?Text;
    sequenceSteps : ?[Text];
    approvalStatus : ?Text;
    sendCount : ?Nat;
    openCount : ?Nat;
    replyCount : ?Nat;
    unsubscribeCount : ?Nat;
    updatedAt : ?Int;
  };

}
