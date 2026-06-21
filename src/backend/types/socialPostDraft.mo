module {

  /// Social media platforms supported for post drafts.
  public type DraftPlatform = {
    #facebook;
    #instagram;
    #linkedin;
    #x;
    #threads;
    #tiktok;
    #google_business;
  };

  /// Status of a social post draft in the approval pipeline.
  public type DraftStatus = {
    #draft;
    #pending_approval;
    #approved;
    #rejected;
    #scheduled;
    #published;
    #failed;
  };

  /// A social post draft awaiting approval before scheduling/publishing.
  public type SocialPostDraft = {
    id            : Text;
    tenantId      : Text;
    calendarId    : ?Text;
    entryId       : ?Text;
    platform      : DraftPlatform;
    content       : Text;
    hashtags      : [Text];
    mediaUrls     : [Text];
    cta           : Text;
    ctaUrl        : Text;
    scheduledAt   : ?Int;
    status        : DraftStatus;
    approvedBy    : ?Text;
    approvedAt    : ?Int;
    n8nStatus     : ?Text;
    publishedUrl  : ?Text;
    createdAt     : Int;
    updatedAt     : Int;
  };

  /// Partial update for a post draft.
  public type SocialPostDraftUpdate = {
    content       : ?Text;
    hashtags      : ?[Text];
    mediaUrls     : ?[Text];
    cta           : ?Text;
    ctaUrl        : ?Text;
    scheduledAt   : ?Int;
    status        : ?DraftStatus;
    approvedBy    : ?Text;
    approvedAt    : ?Int;
    n8nStatus     : ?Text;
    publishedUrl  : ?Text;
  };

};
