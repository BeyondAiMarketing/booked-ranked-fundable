module {

  /// GBP post types supported for drafts.
  public type GBPPostType = {
    #update;
    #offer;
    #event;
    #service_highlight;
    #seasonal;
    #customer_story;
    #educational_tip;
    #community_trust;
    #faq_answer;
    #review_highlight;
  };

  /// Status of a GBP post draft in the approval pipeline.
  public type GBPPostStatus = {
    #draft;
    #pending_approval;
    #approved;
    #rejected;
    #scheduled;
    #published;
    #failed;
    #archived;
  };

  /// A Google Business Profile post draft awaiting approval before publishing.
  public type GBPPostDraft = {
    id              : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    postType        : GBPPostType;
    title           : Text;
    hook            : Text;
    body            : Text;
    cta             : Text;
    ctaUrl          : Text;
    serviceKeyword  : Text;
    locationKeyword : Text;
    photoAsset      : ?Text;
    startDate       : ?Int;
    endDate         : ?Int;
    approvalStatus  : GBPPostStatus;
    n8nStatus       : ?Text;
    publishedUrl    : ?Text;
    createdAt       : Int;
    updatedAt       : Int;
  };

  /// Partial update for a GBP post draft.
  public type GBPPostDraftUpdate = {
    postType        : ?GBPPostType;
    title           : ?Text;
    hook            : ?Text;
    body            : ?Text;
    cta             : ?Text;
    ctaUrl          : ?Text;
    serviceKeyword  : ?Text;
    locationKeyword : ?Text;
    photoAsset      : ?Text;
    startDate       : ?Int;
    endDate         : ?Int;
    approvalStatus  : ?GBPPostStatus;
    n8nStatus       : ?Text;
    publishedUrl    : ?Text;
  };

}
