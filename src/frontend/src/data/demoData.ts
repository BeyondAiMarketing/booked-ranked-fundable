export interface Tenant {
  id: string;
  name: string;
  phone: string;
  website: string;
  address: string;
  type: string;
  assignedPhoneNumber?: string;
  phoneNumberType?: "new" | "port" | "forward" | null;
  phoneNumberStatus?: "active" | "pending" | "not_assigned";
  areaCode?: string;
  portingNumber?: string;
  forwardingFromNumber?: string;
}

export const TENANTS: Tenant[] = [];

export const LEADS: Record<string, Lead[]> = {};

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: number;
}

export interface Review {
  id: string;
  tenantId: string;
  author: string;
  rating: number;
  comment: string;
  platform: "Google" | "Yelp" | "Facebook";
  date: string;
}

export const REVIEWS: Record<string, Review[]> = {};

export interface AuditData {
  tenantId: string;
  total: number;
  gmb: number;
  citations: number;
  website: number;
  backlinks: number;
  recommendations: { text: string; priority: "High" | "Medium" | "Low" }[];
}

export const AUDIT_SCORES: Record<string, AuditData> = {};

export interface FundabilityItem {
  id: string;
  tenantId: string;
  category: string;
  item: string;
  completed: boolean;
}

export const FUNDABILITY_SCORES: Record<string, number> = {};

export const FUNDABILITY_ITEMS: Record<string, FundabilityItem[]> = {};

export interface MonthlyDataEntry {
  month: string;
  leads: number;
  reviews: number;
  revenue: number;
  calls: number;
}

export const MONTHLY_DATA: MonthlyDataEntry[] = [];
