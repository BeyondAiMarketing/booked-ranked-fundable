import Time "mo:core/Time";

module {

  /// The GBP Post Agent manages Google Business Profile post creation.
  public type GBPPostAgentState = {
    id : Text;
    clientBusinessId : Text;
    verticalProfileId : Text;
    postDraftId : Text;
    postType : Text;
    title : Text;
    hook : Text;
    body : Text;
    cta : Text;
    ctaUrl : Text;
    serviceKeyword : Text;
    locationKeyword : Text;
    photoAsset : ?Text;
    scheduledDate : ?Int;
    approvalStatus : Text;
    n8nStatus : Text;
    publishedUrl : ?Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Input to create a GBP post draft.
  public type GBPPostAgentInput = {
    clientBusinessId : Text;
    verticalProfileId : Text;
    postType : Text;
    serviceKeyword : Text;
    locationKeyword : Text;
    offerDetails : Text;
  };

  /// Update for GBP post draft.
  public type GBPPostAgentUpdate = {
    title : ?Text;
    hook : ?Text;
    body : ?Text;
    cta : ?Text;
    ctaUrl : ?Text;
    photoAsset : ??Text;
    scheduledDate : ??Int;
    approvalStatus : ?Text;
    n8nStatus : ?Text;
    publishedUrl : ??Text;
    updatedAt : ?Int;
  };

}
