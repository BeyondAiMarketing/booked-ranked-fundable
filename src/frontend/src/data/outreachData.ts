// Outreach Intelligence Agent — Demo data

import type {
  DeliverabilityMetrics,
  LeadScore,
  LeadStaging,
  OutreachCopySettings,
  OutreachDraft,
  OutreachEvent,
  OutreachSequenceEnrollment,
  SuppressionRecord,
  WebsiteAudit,
} from "../types/outreach";

// ─────────────────────────────────────────────
// Lead Staging — 12 records
// ─────────────────────────────────────────────
export const DEMO_LEAD_STAGING: LeadStaging[] = [];
export const DEMO_WEBSITE_AUDITS: WebsiteAudit[] = [];

// ─────────────────────────────────────────────
// Lead Scores — 8 records
// ─────────────────────────────────────────────
export const DEMO_LEAD_SCORES: LeadScore[] = [];

// ─────────────────────────────────────────────
// Outreach Drafts — 4 records with realistic personalized copy
// ─────────────────────────────────────────────
export const DEMO_OUTREACH_DRAFTS: OutreachDraft[] = [];

// ─────────────────────────────────────────────
// Sequence Enrollments — 6 records
// ─────────────────────────────────────────────
export const DEMO_SEQUENCE_ENROLLMENTS: OutreachSequenceEnrollment[] = [];

// ─────────────────────────────────────────────
// Outreach Events — 20 records
// ─────────────────────────────────────────────
export const DEMO_OUTREACH_EVENTS: OutreachEvent[] = [];

// ─────────────────────────────────────────────
// Suppression Records — 5 records
// ─────────────────────────────────────────────
export const DEMO_SUPPRESSION_RECORDS: SuppressionRecord[] = [];

// ─────────────────────────────────────────────
// Deliverability Metrics — current month
// ─────────────────────────────────────────────
export const DEMO_DELIVERABILITY_METRICS: DeliverabilityMetrics = {
  tenantId: "",
  period: "",
  totalQueued: 0,
  totalSent: 0,
  totalDelivered: 0,
  totalOpened: 0,
  totalClicked: 0,
  totalReplied: 0,
  totalBounced: 0,
  totalUnsubscribed: 0,
  totalComplaints: 0,
  totalSuppressed: 0,
  totalSequencesCompleted: 0,
  deliveryRate: 0,
  openRate: 0,
  clickRate: 0,
  replyRate: 0,
  bounceRate: 0,
  updatedAt: "",
};

// ─────────────────────────────────────────────
// Copy Settings — default configuration
// ─────────────────────────────────────────────
export const DEMO_COPY_SETTINGS: OutreachCopySettings = {
  tenantId: "",
  tone: "professional",
  brandVoice: "",
  outreachStyle: "audit_based",
  ctaStyle: "soft",
  aggressivenessLevel: 0,
  personalizationDepth: "high",
  sequenceLength: 0,
  offerFramework: "audit_first",
  signatureBlock: "",
  nichePositioning: {},
  updatedAt: "",
};
