// Outreach Intelligence Agent — TypeScript type definitions

export type LeadStagingStatus =
  | "discovered"
  | "pending_audit"
  | "audited"
  | "scored"
  | "qualified"
  | "disqualified"
  | "pending_crm"
  | "in_crm"
  | "suppressed";

export interface LeadStaging {
  id: string;
  tenantId: string;
  businessName: string;
  businessType: string;
  niche: string;
  city: string;
  state: string;
  region: string;
  phone: string;
  email: string;
  website: string;
  hasWebsite: boolean;
  reviewCount: number;
  avgRating: number;
  serviceFitTags: string[];
  discoverySource: string;
  discoveryKeyword: string;
  status: LeadStagingStatus;
  isDuplicate: boolean;
  isSuppressed: boolean;
  suppressionReason: string;
  auditId: string;
  scoreId: string;
  draftId: string;
  crmLeadId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteAudit {
  id: string;
  leadStagingId: string;
  tenantId: string;
  websiteUrl: string;
  auditedAt: string;
  // Presence checks
  websiteExists: boolean;
  websiteResolves: boolean;
  homepageAccessible: boolean;
  contactPagePresent: boolean;
  phoneVisible: boolean;
  emailVisible: boolean;
  formVisible: boolean;
  ctaPresent: boolean;
  offerClear: boolean;
  trustElementsPresent: boolean;
  titleMetaPresent: boolean;
  // Weakness flags
  conversionWeaknessFound: boolean;
  mobileWeaknessFound: boolean;
  conversionWeaknesses: string[];
  mobileWeaknesses: string[];
  // Audit notes
  auditNotes: string;
  rawFindings: Record<string, unknown>;
  // Scores (0-100)
  qualityScore: number;
  conversionOpportunityScore: number;
  serviceFitScore: number;
  status: "pending" | "running" | "completed" | "failed";
}

export interface LeadScore {
  id: string;
  leadStagingId: string;
  tenantId: string;
  websiteStatus: number;
  websiteQualityScore: number;
  ctaStrengthScore: number;
  trustSignalScore: number;
  seoBasicsScore: number;
  conversionOpportunityScore: number;
  serviceFitScore: number;
  outreachPriorityScore: number;
  auditSummary: string;
  recommendedOfferType: string;
  qualificationStatus:
    | "unscored"
    | "disqualified"
    | "low"
    | "medium"
    | "high"
    | "priority";
  scoredAt: string;
  // Extended scoring intelligence fields (optional — added by scoring engine)
  urgency_score?: number;
  opportunity_size_score?: number;
  website_weakness_score?: number;
  conversion_weakness_score?: number;
  recommended_offer_angle?: string;
  recommended_cta?: string;
  score_tier?: string;
  top_audit_signals?: string[];
  scoring_rationale?: {
    offer_angle_reason: string;
    cta_reason: string;
    primary_weakness: string;
    primary_opportunity: string;
    awareness_stage: string;
    urgency_drivers: string[];
    niche_context: string;
  };
}

export interface OutreachDraft {
  id: string;
  leadStagingId: string;
  tenantId: string;
  businessName: string;
  businessType: string;
  location: string;
  // Generated copy
  subjectLine: string;
  firstEmail: string;
  followUpEmail1: string;
  followUpEmail2: string;
  shortVersion: string;
  adminSummaryNote: string;
  callScript: string;
  // Copy settings used
  tone: string;
  brandVoice: string;
  ctaStyle: string;
  aggressivenessLevel: number;
  personalizationDepth: string;
  offerFramework: string;
  // Status
  status: "draft" | "approved" | "rejected" | "sent";
  approvedBy: string;
  approvedAt: string;
  generatedAt: string;
  updatedAt: string;
  // Extended copy intelligence fields (optional — added by copy engine)
  admin_explanation?: {
    why_this_angle: string;
    what_audit_data_drove_it: string[];
    framework_used: string;
    what_to_watch: string;
    predicted_response_rate: string;
    personalization_depth_used: string;
  };
  copy_metadata?: {
    offer_angle: string;
    cta_used: string;
    tone_applied: string;
    score_tier: string;
    niche: string;
    frameworks_applied: string[];
    generated_at: string;
  };
}

export type SequenceStepStatus =
  | "pending"
  | "queued"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "replied"
  | "bounced"
  | "skipped"
  | "failed";

export type SequenceStatus =
  | "active"
  | "paused"
  | "completed"
  | "stopped"
  | "pending_approval";

export type OutreachEventType =
  | "queued"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "replied"
  | "bounced"
  | "unsubscribed"
  | "complained"
  | "suppressed"
  | "sequence_completed"
  | "awaiting_review"
  | "approved"
  | "rejected"
  | "crm_pushed";

export interface OutreachSequenceEnrollment {
  id: string;
  leadStagingId: string;
  crmLeadId: string;
  tenantId: string;
  sequenceId: string;
  sequenceName: string;
  status: SequenceStatus;
  currentStepIndex: number;
  totalSteps: number;
  startedAt: string;
  pausedAt: string;
  completedAt: string;
  stoppedAt: string;
  stopReason: string;
  nextStepAt: string;
  stepStatuses: Record<number, SequenceStepStatus>;
  throttleDelayHours: number;
  approvalRequired: boolean;
  approvalStatus: string;
}

export interface OutreachEvent {
  id: string;
  enrollmentId: string;
  leadStagingId: string;
  tenantId: string;
  eventType: OutreachEventType;
  stepIndex: number;
  stepName: string;
  emailSubject: string;
  recipientEmail: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
  source: string;
}

export interface SuppressionRecord {
  id: string;
  tenantId: string;
  email: string;
  phone: string;
  domain: string;
  businessName: string;
  reason:
    | "bounce"
    | "unsubscribe"
    | "complaint"
    | "manual"
    | "duplicate"
    | "low_score";
  addedAt: string;
  addedBy: string;
  notes: string;
  permanent: boolean;
}

export interface DeliverabilityMetrics {
  tenantId: string;
  period: string;
  totalQueued: number;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalReplied: number;
  totalBounced: number;
  totalUnsubscribed: number;
  totalComplaints: number;
  totalSuppressed: number;
  totalSequencesCompleted: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
  updatedAt: string;
}

export interface OutreachCopySettings {
  tenantId: string;
  tone: "professional" | "conversational" | "direct" | "consultative";
  brandVoice: string;
  outreachStyle: "cold" | "warm" | "referral_style" | "audit_based";
  ctaStyle: "soft" | "direct" | "urgent";
  aggressivenessLevel: number;
  personalizationDepth: "low" | "medium" | "high";
  sequenceLength: number;
  offerFramework: string;
  signatureBlock: string;
  nichePositioning: Record<string, string>;
  updatedAt: string;
}
