export type AlertSeverity = "critical" | "high" | "medium" | "low";

export type AlertType =
  | "rating_drop"
  | "rating_increase"
  | "review_surge"
  | "new_gbp_post"
  | "ad_detected"
  | "ad_paused"
  | "review_velocity_spike"
  | "listing_updated";

export type VelocityTrend = "accelerating" | "steady" | "slowing" | "declining";

export interface CompetitorProfile {
  id: string;
  tenantId: string;
  competitorName: string;
  website: string;
  googleRating: number;
  ratingChangePrevious: number;
  reviewCount: number;
  reviewVelocityTrend: VelocityTrend;
  gbpLastUpdated: string;
  adPresenceDetected: boolean;
  lastAuditedAt: number;
  alertThreshold: number;
  niche: string;
  city: string;
  phoneNumber?: string;
  weeklyReviewCount: number;
  isTracked: boolean;
}

export interface CompetitorAlert {
  id: string;
  tenantId: string;
  competitorId: string;
  competitorName: string;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  triggeredAt: number;
  dismissed: boolean;
}

export interface CompetitorStats {
  totalTracked: number;
  avgRating: number;
  topRated: string;
  fastestGrowing: string;
  activeAlerts: number;
  criticalAlerts: number;
}
