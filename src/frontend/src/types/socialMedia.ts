// Social Media Engagement Engine — TypeScript types mirroring Motoko backend

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "google_business"
  | "tiktok"
  | "linkedin";

export type NicheType =
  | "plumbing"
  | "hvac"
  | "restoration"
  | "carpet_cleaning"
  | "roofing"
  | "med_spa"
  | "real_estate"
  | "mortgage"
  | "chiropractor"
  | "dental";

export type ContentCadence = 3 | 7 | 14;

export type PostStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "failed"
  | "paused";

export type FunnelStage = "tofu" | "mofu" | "bofu";

export type MarketingFramework =
  | "ogilvy_storytelling"
  | "hormozi_value_stack"
  | "kennedy_urgency"
  | "halbert_specificity"
  | "cialdini_social_proof"
  | "dan_kennedy_direct"
  | "gary_halbert_attention"
  | "claude_hopkins_reason_why"
  | "jay_abraham_strategy"
  | "russell_brunson_hook_story";

export type CommentIntent =
  | "purchase_intent"
  | "question"
  | "complaint"
  | "competitor_mention"
  | "spam"
  | "community_love"
  | "neutral";

export type AlertType =
  | "competitor_gain"
  | "competitor_loss"
  | "buying_signal"
  | "keyword_mention"
  | "negative_sentiment"
  | "opportunity";

export type CtaType = "booking" | "audit" | "call" | "dm" | "website" | "none";

export type EngagementApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "flagged";

// ─── Core Entities ─────────────────────────────────────────────────────────────

export interface BrandVoiceProfile {
  tenantId: string;
  tone: "professional" | "casual" | "authoritative" | "friendly" | "urgent";
  vocabulary: string[];
  sentenceStyle: "short_punchy" | "narrative" | "conversational" | "formal";
  emojiUsage: "heavy" | "moderate" | "minimal" | "none";
  formality: "high" | "medium" | "low";
  nicheTerminology: string[];
  calibrationPosts: string[];
  lastCalibrated: number;
}

export interface SocialPostEngagement {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  clicks: number;
  saves: number;
  bookingsGenerated: number;
  leadsGenerated: number;
}

export interface SocialPost {
  id: string;
  tenantId: string;
  content: string;
  platforms: SocialPlatform[];
  scheduledAt: number | null;
  publishedAt: number | null;
  status: PostStatus;
  funnelStage: FunnelStage;
  marketingFramework: MarketingFramework;
  engagementMetrics: SocialPostEngagement;
  ctaType: CtaType;
  ctaUrl: string;
  beforeAfterPhoto: string | null;
  niche: string;
  tags: string[];
  createdAt: number;
}

export interface SocialComment {
  id: string;
  tenantId: string;
  postId: string;
  platform: SocialPlatform;
  commentText: string;
  authorName: string;
  authorId: string;
  intent: CommentIntent;
  aiDraftResponse: string;
  responded: boolean;
  respondedAt: number | null;
  leadCreated: boolean;
  createdAt: number;
}

export interface SocialListeningAlert {
  id: string;
  tenantId: string;
  keyword: string;
  platform: SocialPlatform;
  mentionText: string;
  source: string;
  alertType: AlertType;
  suggestedAction: string;
  dismissed: boolean;
  createdAt: number;
}

export interface SocialROIMetrics {
  tenantId: string;
  period: string;
  postsPublished: number;
  totalEngagement: number;
  commentsResponded: number;
  commentsMissed: number;
  leadsFromSocial: number;
  bookingsFromSocial: number;
  estimatedRevenue: number;
  topPerformingPost: string;
  aiNarrative: string;
  generatedAt: number;
}

// ─── New: Scheduled Posts ──────────────────────────────────────────────────────

export interface ScheduledPost {
  id: string;
  tenantId: string;
  content: string;
  platforms: SocialPlatform[];
  scheduledAt: number;
  status: PostStatus;
  niche: NicheType;
  funnelStage: FunnelStage;
  marketingFramework: MarketingFramework;
  ctaType: CtaType;
  ctaUrl: string;
  contentCadence: ContentCadence;
  platformVariants: Partial<Record<SocialPlatform, string>>;
  beforeAfterPhoto: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// ─── New: Engagement Approvals ────────────────────────────────────────────────

export interface EngagementApproval {
  id: string;
  tenantId: string;
  commentId: string;
  commentText: string;
  authorName: string;
  platform: SocialPlatform;
  draftResponse: string;
  refinedResponse: string | null;
  status: EngagementApprovalStatus;
  buyingSignalDetected: boolean;
  buyingSignalConfidence: number;
  suggestedAction: string;
  createdAt: number;
  resolvedAt: number | null;
}

// ─── New: Competitor Intelligence ─────────────────────────────────────────────

export interface CompetitorPost {
  platform: SocialPlatform;
  content: string;
  estimatedEngagement: number;
  postedAt: number;
  format: "image" | "video" | "carousel" | "text" | "reel";
}

export interface CompetitorProfile {
  name: string;
  website: string;
  platforms: SocialPlatform[];
  averageEngagement: number;
  recentPosts: CompetitorPost[];
  rankingPosition: number;
  strengths: string[];
  gaps: string[];
}

export interface CompetitorIntelReport {
  id: string;
  tenantId: string;
  niche: NicheType;
  location: string;
  competitors: CompetitorProfile[];
  topContentFormats: string[];
  contentGapOpportunities: string[];
  keywordOpportunities: string[];
  aiStrategicSummary: string;
  generatedAt: number;
  refreshedAt: number | null;
  citationUrls: string[];
}

// ─── New: Social Leads ────────────────────────────────────────────────────────

export interface SocialLeadSource {
  platform: SocialPlatform;
  postId: string | null;
  commentId: string | null;
  triggerText: string;
}

export interface SocialLead {
  id: string;
  tenantId: string;
  name: string;
  contactInfo: string;
  source: SocialLeadSource;
  buyingSignalText: string;
  confidence: number;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  crmLeadId: string | null;
  linkedToCrm: boolean;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

// ─── New: Demo Funnel Entries ──────────────────────────────────────────────────

export interface DemoFunnelEntry {
  id: string;
  tenantId: string;
  prospectName: string;
  businessName: string;
  email: string;
  phone: string;
  niche: NicheType;
  socialSource: SocialPlatform | "direct" | "email" | "referral";
  demoUrl: string;
  brandKitUrl: string | null;
  trialStartedAt: number | null;
  trialExpiresAt: number | null;
  currentStep:
    | "voice_agent"
    | "website"
    | "crm"
    | "reviews"
    | "credit"
    | "completed";
  stepsCompleted: string[];
  convertedToTrial: boolean;
  convertedToClient: boolean;
  lastActivityAt: number;
  createdAt: number;
}

// ─── New: Content Generation Params ──────────────────────────────────────────

export interface ContentGenerationParams {
  niche: NicheType;
  platforms: SocialPlatform[];
  cadence: ContentCadence;
  brandVoiceProfile: BrandVoiceProfile;
  location?: string;
  focusKeywords?: string[];
  funnelStage?: FunnelStage;
}

export interface GeneratedPostVariant {
  platform: SocialPlatform;
  content: string;
  hashtags: string[];
  ctaText: string;
  estimatedReach: number;
  qualityScore: number;
}

export interface GeneratedContentBatch {
  id: string;
  niche: NicheType;
  cadence: ContentCadence;
  posts: GeneratedPostVariant[];
  trendInsights: string[];
  citationUrls: string[];
  generatedAt: number;
}
