export type LocationStatus = "active" | "pending" | "inactive" | "suspended";

export interface LocationPhoneConfig {
  twilioNumber: string;
  twilioSid: string;
  missedCallSmsEnabled: boolean;
  voiceAgentEnabled: boolean;
  routingPriority: number;
  forwardingNumber?: string;
}

export interface LocationProfile {
  id: string;
  tenantId: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phoneNumber: string;
  timezone: string;
  status: LocationStatus;
  isPrimary: boolean;
  phoneConfig: LocationPhoneConfig;
  googlePlaceId?: string;
  managerName?: string;
  managerEmail?: string;
  createdAt: number;
}

export interface LocationStats {
  locationId: string;
  callVolume: number;
  missedCalls: number;
  reviewCount: number;
  avgRating: number;
  leadCount: number;
  conversionRate: number;
  monthlyRevenue: number;
}
