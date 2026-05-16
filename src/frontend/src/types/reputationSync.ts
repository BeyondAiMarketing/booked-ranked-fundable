export type ReviewPlatform = "google" | "yelp" | "facebook";

export type ReviewSentiment = "positive" | "neutral" | "negative";

export type ReviewRequestStatus =
  | "pending"
  | "sent"
  | "opened"
  | "clicked"
  | "completed"
  | "failed"
  | "unsubscribed";

export interface ReviewSyncRecord {
  id: string;
  tenantId: string;
  platform: ReviewPlatform;
  platformReviewId: string;
  rating: number;
  reviewerName: string;
  reviewerAvatar?: string;
  comment: string;
  sentiment: ReviewSentiment;
  sentimentScore: number;
  respondedAt?: number;
  platformResponse?: string;
  aiDraftResponse?: string;
  responsePublished: boolean;
  lastSyncAt: number;
  createdAt: number;
}

export type ReviewRequestTriggerType =
  | "job_complete"
  | "invoice_paid"
  | "manual"
  | "follow_up_sequence";

export interface ReviewRequestTrigger {
  id: string;
  tenantId: string;
  triggerType: ReviewRequestTriggerType;
  bookingId?: string;
  estimateId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  platform: ReviewPlatform;
  status: ReviewRequestStatus;
  sentAt?: number;
  openedAt?: number;
  clickedAt?: number;
  completedAt?: number;
  createdAt: number;
}

export interface ReviewVelocityStats {
  tenantId: string;
  platform: ReviewPlatform;
  totalReviews: number;
  avgRating: number;
  reviewsLast7Days: number;
  reviewsLast30Days: number;
  responseRate: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  ratingDistribution: Record<number, number>;
  monthlyData: { month: string; count: number; avgRating: number }[];
}
