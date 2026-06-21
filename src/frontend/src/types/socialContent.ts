export type ApprovalStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "needs_revision";

export type Platform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "x"
  | "threads"
  | "tiktok"
  | "googleBusinessProfile";

export type PostType =
  | "update"
  | "offer"
  | "event"
  | "serviceHighlight"
  | "seasonal"
  | "customerStory"
  | "educational"
  | "community"
  | "faq"
  | "reviewHighlight";

export interface ContentCalendar {
  id: string;
  clientBusinessId: string;
  verticalProfileId: string;
  month: string;
  year: number;
  entries: CalendarEntry[];
  status: ApprovalStatus;
  createdAt: number;
  updatedAt: number;
}

export interface CalendarEntry {
  id: string;
  day: number;
  platform: Platform;
  pillar: string;
  format: string;
  objective: string;
  topic: string;
  angle: string;
  visualDirection: string;
  cta: string;
  scheduledDate: string;
  approvalStatus: ApprovalStatus;
  postDraftId?: string;
}

export interface SocialPostDraft {
  id: string;
  clientBusinessId: string;
  verticalProfileId: string;
  platform: Platform;
  postType: PostType;
  title: string;
  hook: string;
  body: string;
  cta: string;
  ctaUrl?: string;
  serviceKeyword?: string;
  locationKeyword?: string;
  photoAsset?: string;
  hashtags?: string[];
  startDate?: string;
  endDate?: string;
  approvalStatus: ApprovalStatus;
  n8nStatus?: string;
  publishedUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PerformanceInsight {
  id: string;
  clientBusinessId: string;
  verticalProfileId: string;
  metric: string;
  value: number;
  benchmark: number;
  period: string;
  notes: string;
  createdAt: number;
}

export interface MonthlyReport {
  id: string;
  clientBusinessId: string;
  verticalProfileId: string;
  month: string;
  year: number;
  period: { month: number; year: number };
  summary: string;
  insights: string[];
  recommendations: string[];
  bestPerformers: {
    platform: string;
    value: string;
    postType: string;
    reason: string;
  }[];
  nextMonthStrategy: string;
  status: ApprovalStatus;
  createdAt: number;
  updatedAt: number;
}

export interface VerticalProfile {
  id: string;
  name: string;
  niche: string;
  industry: string;
  services: string[];
  targetAudience: string;
  positioning: string;
  differentiators: string[];
  brandVoice: string;
  doRules: string[];
  dontRules: string[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkflowLog {
  id: string;
  workflowId: string;
  agentId: string;
  agentName: string;
  stepName: string;
  action: string;
  status: string;
  details: string;
  timestamp: number;
  createdAt: number;
}
