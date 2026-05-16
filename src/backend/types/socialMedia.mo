module {

  // ---- BRAND VOICE DNA ----

  public type BrandVoiceTone = {
    #casual;
    #professional;
    #friendly;
    #authoritative;
  };

  public type EmojiUsage = {
    #none_;
    #low;
    #moderate;
    #high;
  };

  /// Per-tenant brand voice calibration profile.
  /// Trained from the client's own posts, reviews, and niche terminology.
  public type BrandVoiceProfile = {
    tenantId         : Text;
    tone             : BrandVoiceTone;
    vocabulary       : [Text];
    sentenceStyle    : Text;
    emojiUsage       : EmojiUsage;
    formality        : Text;
    nicheTerminology : [Text];
    calibrationPosts : [Text];
    lastCalibrated   : Int;
  };

  // ---- SOCIAL POST ----

  public type SocialPlatform = {
    #facebook;
    #instagram;
    #google_business;
    #tiktok;
    #linkedin;
  };

  public type PostStatus = {
    #draft;
    #scheduled;
    #published;
    #failed;
  };

  public type FunnelStage = {
    #tofu;
    #mofu;
    #bofu;
  };

  public type MarketingFramework = {
    #ogilvy;
    #hormozi;
    #kennedy;
    #halbert;
    #cialdini;
    #sugarman;
    #schwartz;
    #bly;
    #carlton;
    #caples;
  };

  public type PostEngagementMetrics = {
    likes    : Nat;
    comments : Nat;
    shares   : Nat;
    reach    : Nat;
    clicks   : Nat;
  };

  public type SocialPost = {
    id                 : Text;
    tenantId           : Text;
    content            : Text;
    platforms          : [SocialPlatform];
    scheduledAt        : ?Int;
    publishedAt        : ?Int;
    status             : PostStatus;
    funnelStage        : FunnelStage;
    marketingFramework : MarketingFramework;
    engagementMetrics  : PostEngagementMetrics;
    ctaType            : Text;
    ctaUrl             : Text;
    beforeAfterPhoto   : ?Text;
    niche              : Text;
    tags               : [Text];
    createdAt          : Int;
  };

  // ---- SOCIAL COMMENT ----

  public type CommentIntent = {
    #purchase_intent;
    #question;
    #complaint;
    #competitor_mention;
    #spam;
    #community_love;
  };

  public type SocialComment = {
    id              : Text;
    tenantId        : Text;
    postId          : Text;
    platform        : SocialPlatform;
    commentText     : Text;
    authorName      : Text;
    authorId        : Text;
    intent          : CommentIntent;
    aiDraftResponse : Text;
    responded       : Bool;
    respondedAt     : ?Int;
    leadCreated     : Bool;
    createdAt       : Int;
  };

  // ---- SOCIAL LISTENING ALERT ----

  public type AlertType = {
    #competitor_move;
    #buying_signal;
    #negative_mention;
    #local_trend;
  };

  public type SocialListeningAlert = {
    id              : Text;
    tenantId        : Text;
    keyword         : Text;
    platform        : SocialPlatform;
    mentionText     : Text;
    source          : Text;
    alertType       : AlertType;
    suggestedAction : Text;
    dismissed       : Bool;
    createdAt       : Int;
  };

  // ---- SOCIAL ROI METRICS ----

  public type SocialROIMetrics = {
    tenantId          : Text;
    period            : Text;
    postsPublished    : Nat;
    totalEngagement   : Nat;
    commentsResponded : Nat;
    commentsMissed    : Nat;
    leadsFromSocial   : Nat;
    bookingsFromSocial: Nat;
    estimatedRevenue  : Nat;
    topPerformingPost : Text;
    aiNarrative       : Text;
    generatedAt       : Int;
  };

  // ---- SCHEDULED POSTS ----

  public type ScheduledPostStatus = {
    #pending;
    #published;
    #failed;
    #cancelled;
  };

  /// Per-platform formatting hints stored alongside a scheduled post.
  public type PlatformFormatting = {
    hashtags     : [Text];
    mediaUrl     : ?Text;
    altText      : ?Text;
    firstComment : ?Text;
  };

  /// A post queued for multi-platform publication at a specific time.
  public type ScheduledPost = {
    id                 : Text;
    tenantId           : Text;
    platform           : SocialPlatform;
    content            : Text;
    scheduledAt        : Int;
    status             : ScheduledPostStatus;
    platformFormatting : PlatformFormatting;
    createdAt          : Int;
    updatedAt          : Int;
  };

  // ---- ENGAGEMENT APPROVALS ----

  public type EngagementApprovalStatus = {
    #pending;
    #approved;
    #rejected;
  };

  /// One-click human approval gate before any AI reply is published.
  public type EngagementApproval = {
    id             : Text;
    tenantId       : Text;
    commentId      : Text;
    draftResponse  : Text;
    approvalStatus : EngagementApprovalStatus;
    flagged        : Bool;
    flagReason     : ?Text;
    createdAt      : Int;
    resolvedAt     : ?Int;
  };

  // ---- COMPETITOR INTELLIGENCE ----

  public type CompetitorEntry = {
    name          : Text;
    platform      : SocialPlatform;
    profileUrl    : Text;
    followersEst  : ?Nat;
    avgEngagement : ?Nat;
  };

  /// Weekly AI-generated competitor analysis for a niche.
  public type CompetitorIntelReport = {
    id            : Text;
    tenantId      : Text;
    niche         : Text;
    competitors   : [CompetitorEntry];
    weeklyDigest  : Text;
    opportunities : [Text];
    generatedAt   : Int;
  };

  // ---- SOCIAL LEADS ----

  public type SocialEngagementType = {
    #comment;
    #dm;
    #mention;
    #reaction;
    #form_fill;
  };

  /// A prospect captured from social media activity, ready for CRM linkage.
  public type SocialLead = {
    id             : Text;
    tenantId       : Text;
    platform       : SocialPlatform;
    sourcePostId   : Text;
    contactInfo    : Text;
    engagementType : SocialEngagementType;
    crmLeadId      : ?Text;
    createdAt      : Int;
  };

  // ---- DEMO FUNNEL ENTRIES ----

  public type EmailSequenceStatus = {
    #not_started;
    #active;
    #paused;
    #completed;
  };

  /// Tracks a prospect's journey through the social-to-demo funnel.
  public type DemoFunnelEntry = {
    id                  : Text;
    tenantId            : Text;
    prospectId          : Text;
    engagementCount     : Nat;
    emailSequenceStatus : EmailSequenceStatus;
    trialActivated      : Bool;
    trialActivatedAt    : ?Int;
    lastEngagedAt       : Int;
    createdAt           : Int;
  };

};

