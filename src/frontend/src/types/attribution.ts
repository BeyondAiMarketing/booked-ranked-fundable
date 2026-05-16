export type AttributionChannel =
  | "cold_email"
  | "voice_agent"
  | "demo"
  | "audit"
  | "organic"
  | "referral"
  | "social"
  | "paid_ads"
  | "sms"
  | "direct";

export type AttributionModel =
  | "first_touch"
  | "last_touch"
  | "linear"
  | "time_decay"
  | "position_based";

export interface AttributionTouch {
  channel: AttributionChannel;
  source: string;
  timestamp: number;
  campaignId: string;
  utmParams: string;
  pageUrl?: string;
  interactionType?:
    | "click"
    | "form_submit"
    | "call"
    | "demo_visit"
    | "audit_complete";
}

export interface LeadAttributionRecord {
  id: string;
  tenantId: string;
  leadId: string;
  leadName: string;
  channels: AttributionTouch[];
  bookingId: string;
  closedDealValue: number;
  finalConversionChannel: AttributionChannel;
  attributionModel: AttributionModel;
  daysToConvert: number;
  touchCount: number;
  createdAt: number;
}

export interface AttributionChannelStats {
  channel: AttributionChannel;
  label: string;
  touchCount: number;
  firstTouchLeads: number;
  lastTouchLeads: number;
  linearValue: number;
  conversionRate: number;
  avgDaysToConvert: number;
  color: string;
}

export interface AttributionSummary {
  totalLeads: number;
  totalRevenue: number;
  avgTouchesPerConversion: number;
  avgDaysToConvert: number;
  topChannel: AttributionChannel;
  channelStats: AttributionChannelStats[];
  modelBreakdown: Record<AttributionModel, number>;
}

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
  value: number;
  conversionRate: number;
  dropOffRate: number;
  avgDaysInStage: number;
  color: string;
}
