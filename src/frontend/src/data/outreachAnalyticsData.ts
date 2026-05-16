// Demo / mock data for the Outreach Analytics module

import type {
  OutreachBounceRecord,
  OutreachOverview,
  QueuePerformanceStat,
  QueueThrottleConfig,
} from "@/types/newsletter";

// ── Overview metrics ──────────────────────────────────────────────────────────

export const demoOutreachOverview: OutreachOverview = {
  totalLeads: 2847,
  activeQueues: 7,
  totalSentThisMonth: 1432,
  avgResponseRate: 8.4,
  pendingBounces: 23,
};

// ── Queue performance ─────────────────────────────────────────────────────────

export const demoQueueStats: QueuePerformanceStat[] = [
  {
    queueId: "q-001",
    name: "Plumbing Cold Outreach",
    niche: "Plumbing",
    totalLeads: 384,
    sent: 322,
    bounced: 18,
    responded: 29,
    engagementPct: 9.0,
  },
  {
    queueId: "q-002",
    name: "Med Spa Premium Sequence",
    niche: "Med Spa",
    totalLeads: 218,
    sent: 197,
    bounced: 6,
    responded: 34,
    engagementPct: 17.3,
  },
  {
    queueId: "q-003",
    name: "Roofing Storm Season Push",
    niche: "Roofing",
    totalLeads: 562,
    sent: 491,
    bounced: 31,
    responded: 38,
    engagementPct: 7.7,
  },
  {
    queueId: "q-004",
    name: "Real Estate SEO Audit Drip",
    niche: "Real Estate",
    totalLeads: 307,
    sent: 274,
    bounced: 12,
    responded: 41,
    engagementPct: 15.0,
  },
  {
    queueId: "q-005",
    name: "HVAC Maintenance Contract Push",
    niche: "HVAC",
    totalLeads: 441,
    sent: 388,
    bounced: 22,
    responded: 28,
    engagementPct: 7.2,
  },
  {
    queueId: "q-006",
    name: "Dental New Patient Campaign",
    niche: "Dental",
    totalLeads: 195,
    sent: 172,
    bounced: 7,
    responded: 31,
    engagementPct: 18.0,
  },
  {
    queueId: "q-007",
    name: "Technology Cold Outreach",
    niche: "Technology",
    totalLeads: 740,
    sent: 587,
    bounced: 44,
    responded: 47,
    engagementPct: 8.0,
  },
];

// ── Bounce records ────────────────────────────────────────────────────────────

export const demoBounceRecords: OutreachBounceRecord[] = [
  {
    leadId: "lead-0182",
    queueId: "q-001",
    bounceType: "hard",
    bouncedAt: "2025-11-14T11:42:00Z",
    reason: "550 5.1.1 The email account does not exist",
    requeued: false,
  },
  {
    leadId: "lead-0349",
    queueId: "q-003",
    bounceType: "soft",
    bouncedAt: "2025-11-15T08:17:00Z",
    reason: "452 4.2.2 Mailbox full",
    requeued: true,
  },
  {
    leadId: "lead-0521",
    queueId: "q-005",
    bounceType: "hard",
    bouncedAt: "2025-11-15T09:55:00Z",
    reason: "550 Domain does not exist",
    requeued: false,
  },
  {
    leadId: "lead-0677",
    queueId: "q-007",
    bounceType: "complaint",
    bouncedAt: "2025-11-15T13:28:00Z",
    reason: "FBL complaint via Yahoo",
    requeued: false,
  },
  {
    leadId: "lead-0801",
    queueId: "q-004",
    bounceType: "soft",
    bouncedAt: "2025-11-16T07:05:00Z",
    reason: "421 Service temporarily unavailable",
    requeued: true,
  },
  {
    leadId: "lead-0913",
    queueId: "q-002",
    bounceType: "hard",
    bouncedAt: "2025-11-16T10:14:00Z",
    reason: "550 5.4.1 Recipient address rejected: Access denied",
    requeued: false,
  },
];

// ── Throttle configs per queue ────────────────────────────────────────────────

export const demoThrottleConfigs: Record<string, QueueThrottleConfig> = {
  "q-001": {
    dailyCap: 150,
    intervalSeconds: 90,
    staggerEnabled: true,
    backoffMultiplier: 1.5,
  },
  "q-002": {
    dailyCap: 80,
    intervalSeconds: 120,
    staggerEnabled: true,
    backoffMultiplier: 1.2,
  },
  "q-003": {
    dailyCap: 200,
    intervalSeconds: 60,
    staggerEnabled: true,
    backoffMultiplier: 1.8,
  },
  "q-004": {
    dailyCap: 100,
    intervalSeconds: 90,
    staggerEnabled: false,
    backoffMultiplier: 1.0,
  },
  "q-005": {
    dailyCap: 175,
    intervalSeconds: 75,
    staggerEnabled: true,
    backoffMultiplier: 1.5,
  },
  "q-006": {
    dailyCap: 60,
    intervalSeconds: 180,
    staggerEnabled: true,
    backoffMultiplier: 1.2,
  },
  "q-007": {
    dailyCap: 300,
    intervalSeconds: 45,
    staggerEnabled: true,
    backoffMultiplier: 2.0,
  },
};

// ── Engagement funnel data ────────────────────────────────────────────────────

export interface FunnelStage {
  stage: string;
  count: number;
  pct: number;
  color: string;
}

export const demoEngagementFunnel: FunnelStage[] = [
  {
    stage: "Total Leads",
    count: 2847,
    pct: 100,
    color: "oklch(0.62 0.02 280)",
  },
  {
    stage: "Queued for Send",
    count: 2431,
    pct: 85.4,
    color: "oklch(0.6 0.18 240)",
  },
  { stage: "Sent", count: 2231, pct: 78.4, color: "oklch(0.58 0.22 290)" },
  { stage: "Delivered", count: 2089, pct: 73.4, color: "oklch(0.55 0.22 290)" },
  { stage: "Opened", count: 764, pct: 26.8, color: "oklch(0.72 0.18 75)" },
  { stage: "Clicked", count: 312, pct: 11.0, color: "oklch(0.62 0.18 180)" },
  { stage: "Responded", count: 248, pct: 8.7, color: "oklch(0.62 0.18 155)" },
];
