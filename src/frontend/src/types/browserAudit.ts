// Browser Audit Types — Phase 1 Live Visual Verification
// Mirrors the Motoko backend BrowserAuditResult type.

export interface BrowserAuditGap {
  severity: "critical" | "high" | "medium" | "low";
  area: "website" | "gbp" | "social";
  description: string;
}

export interface BrowserAuditTrailEntry {
  action: string;
  timestamp: number;
  actor: string;
  notes?: string;
}

export interface BrowserAuditResult {
  jobId: string;
  tenantId: string;
  businessName: string;
  auditedAt: number;

  // Website scan
  websiteStatus: "scanned" | "unreachable" | "pending";
  websiteScore: number; // 0–20
  websiteGaps: string[];
  websiteScreenshotUrl: string;

  // Google Business Profile
  gbpStatus: "found" | "not_found" | "pending";
  gbpScore: number; // 0–25
  gbpGaps: string[];
  gbpScreenshotUrl: string;

  // Social presence
  socialStatus: "active" | "inactive" | "not_found" | "pending";
  socialScore: number; // 0–15
  socialGaps: string[];
  socialScreenshotUrl: string;

  // Aggregate
  totalBrowserScore: number; // 0–60
  gaps: BrowserAuditGap[];

  // Admin approval
  adminApproved: boolean;
  approvedAt?: number;
  approvedBy?: string;

  auditTrail: BrowserAuditTrailEntry[];
}

export type BrowserAuditState =
  | "idle"
  | "triggering"
  | "scanning"
  | "awaiting_approval"
  | "approved"
  | "rejected"
  | "error";

export type BrowserScanSubstage =
  | "visiting_website"
  | "checking_gbp"
  | "scanning_social"
  | "complete";
