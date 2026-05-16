// Newsletter & Outreach Analytics — TypeScript type definitions

// ── Enums & status types ───────────────────────────────────────────────────────

export type SubscriberStatus =
  | "active"
  | "unsubscribed"
  | "bounced"
  | "complained";

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "paused";

export type SendLogStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "unsubscribed"
  | "failed";

export type BounceType = "soft" | "hard" | "complaint";

// ── Newsletter core types ──────────────────────────────────────────────────────

export interface NewsletterSubscriber {
  id: string;
  tenantId: string;
  email: string;
  phone?: string;
  businessName?: string;
  tags: string[];
  status: SubscriberStatus;
  customFields: Record<string, string>;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface NewsletterCampaignStats {
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  unsubscribeCount: number;
  complaintCount: number;
}

export interface NewsletterCampaign {
  id: string;
  tenantId: string;
  name: string;
  subject: string;
  htmlBody: string;
  plainTextBody?: string;
  fromName?: string;
  fromEmail?: string;
  scheduledAt?: string;
  sentAt?: string;
  status: CampaignStatus;
  tags: string[];
  stats: NewsletterCampaignStats;
}

export interface NewsletterSendLog {
  id: string;
  campaignId: string;
  subscriberId: string;
  email: string;
  status: SendLogStatus;
  errorMessage?: string;
  sentAt?: string;
  openedAt?: string;
}

export interface SubscriberImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export interface NewsletterAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  totalCampaigns: number;
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgBounceRate: number;
  recentCampaigns: NewsletterCampaign[];
}

// ── Outreach analytics types ───────────────────────────────────────────────────

export interface OutreachBounceRecord {
  leadId: string;
  queueId: string;
  bounceType: BounceType;
  bouncedAt: string;
  reason?: string;
  requeued: boolean;
}

export interface QueueThrottleConfig {
  dailyCap: number;
  intervalSeconds: number;
  staggerEnabled: boolean;
  backoffMultiplier: number;
}

export interface OutreachOverview {
  totalLeads: number;
  activeQueues: number;
  totalSentThisMonth: number;
  avgResponseRate: number;
  pendingBounces: number;
}

export interface QueuePerformanceStat {
  queueId: string;
  name: string;
  niche: string;
  totalLeads: number;
  sent: number;
  bounced: number;
  responded: number;
  engagementPct: number;
}
