// ─── Demo Foundation Types ────────────────────────────────────────────────────

export type FrameworkName =
  | "brunson"
  | "deiss"
  | "hormozi"
  | "ogilvy"
  | "halbert"
  | "kennedy";

export interface FrameworkBadge {
  name: FrameworkName;
  label: string;
  color: string; // Tailwind bg class
}

// ─── Niche IDs — legacy keys used across all existing components & data files ──

export type DemoNicheId =
  | "plumber"
  | "med-spa"
  | "hvac"
  | "restoration"
  | "carpet-cleaning"
  | "roofing"
  | "real-estate"
  | "mortgage"
  | "chiropractor"
  | "dental";

/** Alias — same type as DemoNicheId for clarity in new code */
export type DemoNicheIdLegacy = DemoNicheId;

/** New backend niche IDs (backend stable constants) */
export type DemoNicheIdV2 =
  | "plumbing"
  | "medspa"
  | "hvac"
  | "restoration"
  | "carpet"
  | "roofing"
  | "realestate"
  | "mortgage"
  | "chiropractic"
  | "dental";

/** Union of both legacy and V2 niche IDs */
export type AnyNicheId = DemoNicheId | DemoNicheIdV2;

// ─── Step type (0–9) ──────────────────────────────────────────────────────────

/** 0=intake, 1=website, 2=voice, 3=chat, 4=crm, 5=reputation, 6=social, 7=credit, 8=revenue, 9=trial */
export type DemoStepNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// ─── Act type ─────────────────────────────────────────────────────────────────

export type DemoAct = "act1" | "act2" | "act3";

// ─── Session ──────────────────────────────────────────────────────────────────

export interface DemoSession {
  sessionId: string;
  businessName: string;
  niche: DemoNicheId;
  step: number;
  auditScore: number;
  trialActivated: boolean;
}

// ─── Script types ─────────────────────────────────────────────────────────────

export interface NicheScriptLine {
  speaker: "agent" | "customer";
  text: string;
  pauseAfterMs: number;
}

export interface NicheScript {
  nicheId: string;
  voiceName: string;
  elevenLabsVoiceId: string;
  lines: NicheScriptLine[];
}

// ─── Green overlay data ───────────────────────────────────────────────────────

export interface GreenOverlayData {
  headline: string;
  items: string[];
  subtitle?: string;
}

// ─── Legacy shape types (still used by existing step components) ──────────────

export interface DemoStep {
  id: string;
  stepNumber: number; // 1–10
  title: string;
  shortTitle: string;
  painPointStat?: PainPointStat;
  frameworkBadge?: FrameworkBadge;
  isVoiceStep?: boolean;
  isTransitionStep?: boolean;
  coachTip: string;
}

export interface PainPointStat {
  stat: string; // e.g. "67%"
  statLabel: string; // e.g. "of local service calls go unanswered"
  frameworkBadge: FrameworkBadge;
}

export interface DemoProspect {
  firstName: string;
  businessName: string;
  niche: DemoNicheId;
  city: string;
  phone: string;
  email?: string;
}

export type DemoMode = "prospect" | "admin-preview";

export interface AuditReport {
  businessName: string;
  niche: DemoNicheId;
  score: number; // 0–100
  gaps: string[]; // 3 specific gaps
  recommendations: string[];
}

export interface TrialStatus {
  active: boolean;
  daysRemaining: number;
  socialContentLocked: boolean;
}

// ─── Niche-specific data shapes ───────────────────────────────────────────────

export interface CallSummary {
  duration: string;
  request: string;
  actionTaken: string;
}

export interface VoiceAgentScript {
  greeting: string;
  callerQuestion: string;
  agentResponse: string;
  bookingConfirmation: string;
  callerAnswer?: string;
  smsText?: string;
  callSummary?: CallSummary;
  voiceId?: string;
  voiceName?: string;
  callerName?: string;
  appointmentTime?: string;
  serviceName?: string;
}

export interface RevenueLossItem {
  label: string;
  monthlyLoss: string;
}

export interface SocialProofTestimonial {
  quote: string;
  business: string;
  location: string;
  result: string;
}

export interface WebsiteData {
  before: { title: string; bullets: string[] };
  after: { title: string; bullets: string[] };
}
