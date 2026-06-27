import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AGENT_PRODUCTS,
  type AgentServiceRequest,
  type AgentSubscription,
  type AgentTask,
  DEMO_AGENT_REQUESTS,
  DEMO_AGENT_SUBSCRIPTIONS,
  DEMO_AGENT_TASKS,
} from "../data/agentData";
import {
  DEMO_APPROVAL_ITEMS,
  DEMO_ARTIFACTS,
  DEMO_MEMORIES,
  DEMO_PROVIDER_ADAPTERS,
  DEMO_RUNS,
  DEMO_TEMPLATES,
  DEMO_THREADS,
  DEMO_TOOLS,
} from "../data/agentWorkflowData";
import { DEMO_BOOKINGS } from "../data/appointmentsData";
import { DEMO_ATTRIBUTION_RECORDS } from "../data/attributionData";
import {
  DEMO_COMPETITORS,
  DEMO_COMPETITOR_ALERTS,
} from "../data/competitiveData";
import { AUDIT_SCORES, LEADS, type Lead, TENANTS } from "../data/demoData";
import { DEMO_HEALTH_SCORES } from "../data/healthScoreData";
import { DEMO_LOCATIONS } from "../data/locationData";
import {
  type ClientWebsiteConfig,
  getFirstWebsiteForNiche,
  normalizeNicheId,
  saveClientWebsiteConfig,
} from "../data/nicheWebsiteData";
import { DEMO_ESTIMATES, DEMO_PAYMENT_RECORDS } from "../data/paymentsData";
import {
  DEMO_REPORTS,
  DEMO_REPORT_SCHEDULES,
  generateDemoReport,
} from "../data/reportingData";
import {
  DEMO_REVIEW_REQUEST_TRIGGERS,
  DEMO_REVIEW_SYNC_RECORDS,
} from "../data/reputationSyncData";
import { DEMO_SMS_MESSAGES, DEMO_SMS_THREADS } from "../data/smsData";
import {
  DEMO_BRAND_VOICE_PROFILES,
  DEMO_SOCIAL_COMMENTS,
  DEMO_SOCIAL_LISTENING_ALERTS,
  DEMO_SOCIAL_POSTS,
  DEMO_SOCIAL_ROI_METRICS,
} from "../data/socialMediaData";
import {
  DEFAULT_MISSED_CALL_SMS_CONFIG,
  DEFAULT_VOICE_AGENT_CONFIG,
  DEMO_CALL_LOGS,
} from "../data/telephonyData";
import type {
  AgentArtifact,
  AgentMemory,
  AgentRun,
  AgentTemplateRecord,
  AgentThread,
  ApprovalItem,
  ProviderAdapterConfig,
  ToolDefinition,
} from "../types/agentWorkflow";
import type { Booking } from "../types/appointments";
import type { LeadAttributionRecord } from "../types/attribution";
import type { CompetitorAlert, CompetitorProfile } from "../types/competitive";
import type { ClientHealthScore } from "../types/healthScore";
import {
  type OpenSourceServiceConfig,
  defaultOpenSourceConfig,
} from "../types/integrations";
import type { LocationProfile } from "../types/location";
import type { Estimate, PaymentRecord } from "../types/payments";
import type { ClientReport, ReportSchedule } from "../types/reporting";
import type {
  ReviewRequestTrigger,
  ReviewSyncRecord,
} from "../types/reputationSync";
import type { SMSMessage, SMSThread } from "../types/sms";
import type {
  BrandVoiceProfile,
  CommentIntent,
  SocialComment,
  SocialListeningAlert,
  SocialPost,
  SocialROIMetrics,
} from "../types/socialMedia";
import type {
  CallLog,
  InboundVoiceAgentConfig,
  MissedCallSmsConfig,
} from "../types/telephony";
import { calculateHealthScore } from "../utils/healthScoreCalculator";

interface AppUser {
  name: string;
  role: "superAdmin" | "agency" | "client";
  isAdminUser: boolean;
}

export interface TenantEntry {
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

export interface Notification {
  id: string;
  type: "lead" | "review" | "audit" | "uptime" | "general" | "sms_reply";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface AgencyEmailSettings {
  useCustomProvider: boolean;
  sendingDomain: string;
  fromName: string;
  provider:
    | "sendgrid"
    | "mailgun"
    | "postmark"
    | "resend"
    | "amazon_ses"
    | "smtp"
    | "";
  credentials: Record<string, string>;
  isVerified: boolean;
  lastTested?: string;
}

export interface WhiteLabelSettings {
  agencyName: string;
  tagline: string;
  heroHeadline: string;
  logoDataUrl: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeHeadline: string;
  welcomeMessage: string;
  customDomain: string;
  emailSenderName: string;
  emailSenderAddress: string;
  agencyEmailSettings: AgencyEmailSettings;
}

const DEFAULT_WHITE_LABEL: WhiteLabelSettings = {
  agencyName: "Your Agency Name",
  tagline: "AI-Powered Growth for Local Businesses",
  heroHeadline: "The Platform That Books, Ranks & Funds Your Clients",
  logoDataUrl: "",
  primaryColor: "#7c3aed",
  secondaryColor: "#4f46e5",
  welcomeHeadline: "Welcome to Your Growth Platform",
  welcomeMessage:
    "Everything you need to book more jobs, rank higher, and build business credit — in one place.",
  customDomain: "",
  emailSenderName: "",
  emailSenderAddress: "",
  agencyEmailSettings: {
    useCustomProvider: false,
    sendingDomain: "",
    fromName: "",
    provider: "",
    credentials: {},
    isVerified: false,
  },
};

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "lead",
    title: "New Lead",
    message: "Maria Gonzalez submitted a contact form",
    time: "5 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "review",
    title: "New Review",
    message: "Kevin R. left a 5★ review on Google",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "audit",
    title: "Audit Score Improved",
    message: "SEO score increased from 68 to 72 this week",
    time: "Yesterday",
    read: false,
  },
  {
    id: "n4",
    type: "uptime",
    title: "Uptime Alert Cleared",
    message: "Website returned to normal — was down for 3 minutes",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n5",
    type: "general",
    title: "Review Request Sent",
    message: "Review request sent to 3 customers via SMS",
    time: "3 days ago",
    read: true,
  },
  {
    id: "n6",
    type: "general",
    title: "Weekly Report Ready",
    message: "Your weekly performance summary is available",
    time: "1 hour ago",
    read: false,
  },
];

export interface ListingConfig {
  googleUrl: string;
  yelpUrl: string;
  facebookUrl: string;
  bingUrl: string;
}

export interface AiProviderConfig {
  provider: string;
  apiKey: string;
  model: string;
}

export interface DemoInfo {
  firstName: string;
  businessName: string;
  niche: string;
  city: string;
}

interface AppContextType {
  currentTenantId: string;
  setCurrentTenantId: (id: string) => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAdminUser: boolean;
  scanner3dEnabled: Record<string, boolean>;
  setScanner3dEnabledForTenant: (tenantId: string, enabled: boolean) => void;
  isScanner3dEnabled: (tenantId: string) => boolean;
  currentUser: AppUser | null;
  isLoggedIn: boolean;
  login: (
    role: "superAdmin" | "agency" | "client",
    tenantId: string,
    adminUser?: boolean,
  ) => void;
  loginDemo: (info: DemoInfo) => void;
  logout: () => void;
  tenants: TenantEntry[];
  addTenant: (tenant: TenantEntry) => void;
  deleteTenant: (id: string) => void;
  updateTenantPhone: (
    tenantId: string,
    fields: Partial<
      Pick<
        TenantEntry,
        | "assignedPhoneNumber"
        | "phoneNumberType"
        | "phoneNumberStatus"
        | "areaCode"
        | "portingNumber"
        | "forwardingFromNumber"
      >
    >,
  ) => void;
  auditOverrides: Record<string, number>;
  fundabilityOverrides: Record<string, number>;
  setAuditOverride: (tenantId: string, score: number) => void;
  setFundabilityOverride: (tenantId: string, score: number) => void;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  markAllRead: () => void;
  markRead: (id: string) => void;
  aiPanelOpen: boolean;
  setAiPanelOpen: (v: boolean) => void;
  weeklyReportOpen: boolean;
  setWeeklyReportOpen: (v: boolean) => void;
  socialMediaEnabled: Record<string, boolean>;
  setSocialMediaEnabledForTenant: (tenantId: string, enabled: boolean) => void;
  aiProviderConfig: AiProviderConfig;
  setAiProviderConfig: (config: AiProviderConfig) => void;
  listingConfigs: Record<string, ListingConfig>;
  setListingConfig: (tenantId: string, config: ListingConfig) => void;
  campaignToggles: Record<string, Record<string, boolean>>;
  setCampaignToggle: (
    tenantId: string,
    campaignId: string,
    enabled: boolean,
  ) => void;
  // Demo mode
  isDemoMode: boolean;
  demoInfo: DemoInfo | null;
  // Onboarding
  onboardingComplete: Record<string, boolean>;
  markOnboardingComplete: (tenantId: string) => void;
  resetOnboarding: (tenantId: string) => void;
  agencyOnboardingComplete: boolean;
  markAgencyOnboardingComplete: () => void;
  resetAgencyOnboarding: () => void;
  // Agent Services
  agentSubscriptions: AgentSubscription[];
  agentRequests: AgentServiceRequest[];
  agentTasks: AgentTask[];
  agentPricingOverrides: Record<string, number>;
  activateAgent: (
    tenantId: string,
    productId: string,
    withOversight?: boolean,
  ) => void;
  deactivateAgent: (subscriptionId: string) => void;
  pauseAgent: (subscriptionId: string) => void;
  resumeAgent: (subscriptionId: string) => void;
  submitAgentRequest: (
    req: Omit<AgentServiceRequest, "id" | "submittedAt" | "status">,
  ) => void;
  updateAgentTaskStatus: (taskId: string, status: AgentTask["status"]) => void;
  setAgentPriceOverride: (productId: string, price: number) => void;
  addAgentSubscriptionNote: (subscriptionId: string, note: string) => void;
  addOversight: (subscriptionId: string) => void;
  // White-Label
  whiteLabelSettings: WhiteLabelSettings;
  setWhiteLabelSettings: (settings: WhiteLabelSettings) => void;
  // Agent Workflow OS
  agentThreads: AgentThread[];
  agentRunsList: AgentRun[];
  agentArtifacts: AgentArtifact[];
  agentTemplates: AgentTemplateRecord[];
  agentMemories: AgentMemory[];
  toolDefinitions: ToolDefinition[];
  approvalItems: ApprovalItem[];
  providerAdapters: ProviderAdapterConfig[];
  activeRunId: string | null;
  createThread: (
    tenantId: string,
    agentType: string,
    title: string,
  ) => AgentThread;
  startRun: (
    threadId: string,
    tenantId: string,
    agentType: string,
    inputPrompt: string,
    approvalRequired?: boolean,
  ) => AgentRun;
  completeRun: (
    runId: string,
    outputText: string,
    artifactIds?: string[],
    metadata?: Record<string, string>,
  ) => void;
  failRun: (runId: string, errorMessage: string) => void;
  pauseRunForApproval: (runId: string, reason: string) => ApprovalItem;
  resolveApproval: (
    approvalItemId: string,
    approved: boolean,
    notes?: string,
  ) => void;
  createArtifact: (
    runId: string,
    threadId: string,
    tenantId: string,
    artifactType: AgentArtifact["artifactType"],
    title: string,
    content: string,
    tags?: string[],
  ) => AgentArtifact;
  createTemplate: (
    tenantId: string,
    templateData: Omit<AgentTemplateRecord, "id" | "createdAt">,
  ) => AgentTemplateRecord;
  updateTemplate: (id: string, updates: Partial<AgentTemplateRecord>) => void;
  deleteTemplate: (id: string) => void;
  updateMemory: (
    threadId: string,
    tenantId: string,
    entry: { role: "user" | "assistant"; content: string },
    summary?: string,
    agentNotes?: string,
  ) => void;
  setActiveAdapter: (
    tenantId: string,
    adapterType: ProviderAdapterConfig["adapterType"],
    isEnabled: boolean,
    apiKey?: string,
    baseUrl?: string,
    modelId?: string,
  ) => void;
  getThreadForAgent: (
    tenantId: string,
    agentType: string,
  ) => AgentThread | undefined;
  getRunsForThread: (threadId: string) => AgentRun[];
  getArtifactsForThread: (threadId: string) => AgentArtifact[];
  // CRM — leads state and mutations for tool layer
  leads: Record<string, Lead[]>;
  addLead: (tenantId: string, lead: Omit<Lead, "id" | "createdAt">) => Lead;
  updateLeadStatus: (
    tenantId: string,
    leadId: string,
    status: Lead["status"],
  ) => void;
  getLeadsByTenant: (tenantId: string) => Lead[];
  getAuditDataForTenant: (tenantId: string) => {
    seoScore: number;
    mobileScore: number;
    technicalScore: number;
    speedScore: number;
    overallScore: number;
    recommendations?: { text: string; priority: string }[];
  };
  getActiveAgentsForTenant: (tenantId: string) => AgentSubscription[];
  getTenantById: (tenantId: string) => TenantEntry | undefined;
  // Open Source Services config
  openSourceConfig: OpenSourceServiceConfig;
  setOpenSourceConfig: (config: OpenSourceServiceConfig) => void;
  // Telephony — call logs, missed call SMS, inbound voice agent
  callLogs: CallLog[];
  missedCallSmsConfigs: Record<string, MissedCallSmsConfig>;
  inboundVoiceAgentConfigs: Record<string, InboundVoiceAgentConfig>;
  addCallLog: (log: CallLog) => void;
  updateMissedCallSmsConfig: (
    tenantId: string,
    config: MissedCallSmsConfig,
  ) => void;
  updateInboundVoiceAgentConfig: (
    tenantId: string,
    config: InboundVoiceAgentConfig,
  ) => void;
  getCallLogsByTenant: (tenantId: string) => CallLog[];
  // SMS Inbox
  smsThreads: SMSThread[];
  smsMessages: SMSMessage[];
  setSmsThreads: Dispatch<SetStateAction<SMSThread[]>>;
  setSmsMessages: Dispatch<SetStateAction<SMSMessage[]>>;
  getSmsThreadsByTenant: (tenantId: string) => SMSThread[];
  getSmsMessagesByThread: (threadId: string) => SMSMessage[];
  getUnreadCountByTenant: (tenantId: string) => number;
  addSmsMessage: (
    threadId: string,
    tenantId: string,
    direction: "inbound" | "outbound",
    text: string,
  ) => void;
  markThreadRead: (threadId: string) => void;
  archiveThread: (threadId: string) => void;
  createSmsThread: (
    tenantId: string,
    prospectPhone: string,
    prospectName: string,
    linkedLeadId?: string,
  ) => SMSThread;
  addNotification: (
    notification: Omit<Notification, "id" | "time" | "read">,
  ) => void;
  // Client Reports
  clientReports: ClientReport[];
  reportSchedules: ReportSchedule[];
  getClientReports: (tenantId: string) => ClientReport[];
  generateReport: (
    tenantId: string,
    reportType: "weekly" | "monthly",
  ) => ClientReport;
  updateReportSchedule: (
    tenantId: string,
    schedule: Partial<ReportSchedule>,
  ) => void;
  getReportSchedule: (tenantId: string) => ReportSchedule | undefined;
  // Client Health Scores
  clientHealthScores: ClientHealthScore[];
  getClientHealthScore: (tenantId: string) => ClientHealthScore | undefined;
  getAllClientHealthScores: () => ClientHealthScore[];
  refreshHealthScore: (tenantId: string) => void;
  // Payments & Estimates
  estimates: Estimate[];
  paymentRecords: PaymentRecord[];
  getEstimatesByTenant: (tenantId: string) => Estimate[];
  getPaymentsByTenant: (tenantId: string) => PaymentRecord[];
  // Appointments
  bookings: Booking[];
  getBookingsByTenant: (tenantId: string) => Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => Booking;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  // Reputation Sync
  reviewSyncRecords: ReviewSyncRecord[];
  reviewRequestTriggers: ReviewRequestTrigger[];
  getReviewSyncRecordsByTenant: (tenantId: string) => ReviewSyncRecord[];
  getReviewRequestTriggersByTenant: (
    tenantId: string,
  ) => ReviewRequestTrigger[];
  // Pass 3 — Competitive Intel, Multi-Location, Lead Attribution
  competitorProfiles: CompetitorProfile[];
  competitorAlerts: CompetitorAlert[];
  locationProfiles: LocationProfile[];
  leadAttributionRecords: LeadAttributionRecord[];
  // Social Media Engagement Engine
  socialPosts: SocialPost[];
  socialComments: SocialComment[];
  socialListeningAlerts: SocialListeningAlert[];
  brandVoiceProfiles: BrandVoiceProfile[];
  socialROIMetrics: SocialROIMetrics[];
  getSocialPostsByTenant: (tenantId: string) => SocialPost[];
  getSocialCommentsByTenant: (tenantId: string) => SocialComment[];
  getPendingSocialCommentsByTenant: (tenantId: string) => SocialComment[];
  getSocialCommentsByIntent: (
    tenantId: string,
    intent: CommentIntent,
  ) => SocialComment[];
  getSocialAlertsByTenant: (tenantId: string) => SocialListeningAlert[];
  getActiveSocialAlertsByTenant: (tenantId: string) => SocialListeningAlert[];
  getSocialROIByTenant: (tenantId: string) => SocialROIMetrics[];
  getBrandVoiceProfile: (tenantId: string) => BrandVoiceProfile | undefined;
  createSocialPost: (
    post: Omit<
      SocialPost,
      "id" | "createdAt" | "engagementMetrics" | "publishedAt"
    >,
  ) => SocialPost;
  updateSocialPost: (id: string, updates: Partial<SocialPost>) => void;
  deleteSocialPost: (id: string) => void;
  respondToSocialComment: (commentId: string, responseText: string) => void;
  dismissSocialAlert: (alertId: string) => void;
  upsertBrandVoiceProfile: (
    profile: Omit<BrandVoiceProfile, "lastCalibrated">,
  ) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromSession<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function loadFromLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentTenantId, setCurrentTenantIdState] = useState<string>(() =>
    loadFromSession("brfTenantId", "tenant-oceanside"),
  );
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() =>
    loadFromSession<AppUser | null>("brfUser", null),
  );
  const [tenants, setTenants] = useState<TenantEntry[]>(TENANTS);
  const [leads, setLeads] = useState<Record<string, Lead[]>>(() =>
    loadFromLocal("brfLeads", LEADS),
  );
  const [auditOverrides, setAuditOverrides] = useState<Record<string, number>>(
    {},
  );
  const [fundabilityOverrides, setFundabilityOverrides] = useState<
    Record<string, number>
  >({});
  const [notifications, setNotifications] =
    useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [weeklyReportOpen, setWeeklyReportOpen] = useState(false);
  const [socialMediaEnabled, setSocialMediaEnabled] = useState<
    Record<string, boolean>
  >(() =>
    loadFromLocal("brfSocialMedia", {
      "tenant-demo": true,
      "tenant-oceanside": true,
      "tenant-summit": true,
      "tenant-apex": true,
    }),
  );
  const [scanner3dEnabled, setScanner3dEnabled] = useState<
    Record<string, boolean>
  >(() =>
    loadFromLocal("scanner3dEnabled", {
      "tenant-demo": true,
      "tenant-oceanside": true,
    }),
  );
  const [aiProviderConfig, setAiProviderConfigState] =
    useState<AiProviderConfig>(() =>
      loadFromLocal("brfAiProvider", {
        provider: "openai",
        apiKey: "",
        model: "gpt-4o",
      }),
    );
  const [listingConfigs, setListingConfigsState] = useState<
    Record<string, ListingConfig>
  >(() => loadFromLocal("brfListings", {}));
  const [campaignToggles, setCampaignTogglesState] = useState<
    Record<string, Record<string, boolean>>
  >(() => {
    try {
      const r = localStorage.getItem("brfCampaignToggles");
      if (r) return JSON.parse(r);
    } catch {}
    return {};
  });
  const [demoInfo, setDemoInfo] = useState<DemoInfo | null>(() =>
    loadFromSession<DemoInfo | null>("brfDemo", null),
  );

  // Onboarding state
  const [onboardingComplete, setOnboardingComplete] = useState<
    Record<string, boolean>
  >(() => loadFromLocal("brfOnboarding", {}));
  const [agencyOnboardingComplete, setAgencyOnboardingComplete] =
    useState<boolean>(() => loadFromLocal("brfAgencyOnboarding", false));

  // Agent Services state
  const [agentSubscriptions, setAgentSubscriptions] = useState<
    AgentSubscription[]
  >(() => loadFromLocal("brfAgentSubscriptions", DEMO_AGENT_SUBSCRIPTIONS));
  const [agentRequests, setAgentRequests] = useState<AgentServiceRequest[]>(
    () => loadFromLocal("brfAgentRequests", DEMO_AGENT_REQUESTS),
  );
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>(() =>
    loadFromLocal("brfAgentTasks", DEMO_AGENT_TASKS),
  );
  const [agentPricingOverrides, setAgentPricingOverridesState] = useState<
    Record<string, number>
  >(() => loadFromLocal("brfAgentPricing", {}));

  // White-Label state
  const [whiteLabelSettings, setWhiteLabelSettingsState] =
    useState<WhiteLabelSettings>(() =>
      loadFromLocal("brfWhiteLabel", DEFAULT_WHITE_LABEL),
    );

  // Agent Workflow OS state
  const [agentThreads, setAgentThreads] = useState<AgentThread[]>(() =>
    loadFromLocal("brf_agent_threads", DEMO_THREADS),
  );
  const [agentRunsList, setAgentRunsList] = useState<AgentRun[]>(() =>
    loadFromLocal("brf_agent_runs", DEMO_RUNS),
  );
  const [agentArtifacts, setAgentArtifacts] = useState<AgentArtifact[]>(() =>
    loadFromLocal("brf_artifacts", DEMO_ARTIFACTS),
  );
  const [agentTemplates, setAgentTemplates] = useState<AgentTemplateRecord[]>(
    () => loadFromLocal("brf_agent_templates", DEMO_TEMPLATES),
  );
  const [agentMemories, setAgentMemories] = useState<AgentMemory[]>(() =>
    loadFromLocal("brf_agent_memories", DEMO_MEMORIES),
  );
  const [toolDefinitions] = useState<ToolDefinition[]>(DEMO_TOOLS);
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>(() =>
    loadFromLocal("brf_approval_items", DEMO_APPROVAL_ITEMS),
  );
  const [providerAdapters, setProviderAdapters] = useState<
    ProviderAdapterConfig[]
  >(() => loadFromLocal("brf_provider_adapters", DEMO_PROVIDER_ADAPTERS));
  const [activeRunId, setActiveRunId] = useState<string | null>(null);

  // Open Source Services config
  const [openSourceConfig, setOpenSourceConfigState] =
    useState<OpenSourceServiceConfig>(() =>
      (() => {
        const saved = loadFromLocal(
          "brf_open_source_config",
          defaultOpenSourceConfig,
        );
        return {
          ...defaultOpenSourceConfig,
          ...saved,
          gateway: {
            ...defaultOpenSourceConfig.gateway,
            ...saved.gateway,
            featureFlags: {
              ...defaultOpenSourceConfig.gateway.featureFlags,
              ...saved.gateway?.featureFlags,
            },
          },
          litellm: {
            ...defaultOpenSourceConfig.litellm,
            ...saved.litellm,
          },
          listmonk: {
            ...defaultOpenSourceConfig.listmonk,
            ...saved.listmonk,
          },
          searxng: {
            ...defaultOpenSourceConfig.searxng,
            ...saved.searxng,
          },
          ollama: {
            ...defaultOpenSourceConfig.ollama,
            ...saved.ollama,
          },
        };
      })(),
    );

  // Telephony state
  const [callLogs, setCallLogs] = useState<CallLog[]>(() =>
    loadFromLocal("brf_call_logs", DEMO_CALL_LOGS),
  );
  const [missedCallSmsConfigs, setMissedCallSmsConfigs] = useState<
    Record<string, MissedCallSmsConfig>
  >(() =>
    loadFromLocal("brf_missed_sms_configs", {
      demo: DEFAULT_MISSED_CALL_SMS_CONFIG,
    }),
  );
  const [inboundVoiceAgentConfigs, setInboundVoiceAgentConfigs] = useState<
    Record<string, InboundVoiceAgentConfig>
  >(() =>
    loadFromLocal("brf_voice_agent_configs", {
      demo: DEFAULT_VOICE_AGENT_CONFIG,
    }),
  );

  // SMS Inbox state
  const [smsThreads, setSmsThreads] = useState<SMSThread[]>(() =>
    loadFromLocal("brf_sms_threads", DEMO_SMS_THREADS),
  );
  const [smsMessages, setSmsMessages] = useState<SMSMessage[]>(() =>
    loadFromLocal("brf_sms_messages", DEMO_SMS_MESSAGES),
  );

  // Client Reporting state
  const [clientReports, setClientReports] = useState<ClientReport[]>(() =>
    loadFromLocal("brf_client_reports", DEMO_REPORTS),
  );
  const [reportSchedules, setReportSchedules] = useState<ReportSchedule[]>(() =>
    loadFromLocal("brf_report_schedules", DEMO_REPORT_SCHEDULES),
  );

  // Client Health Scores state
  const [clientHealthScores, setClientHealthScores] =
    useState<ClientHealthScore[]>(DEMO_HEALTH_SCORES);

  // Payments & Estimates state
  const [estimates] = useState<Estimate[]>(DEMO_ESTIMATES);
  const [paymentRecords] = useState<PaymentRecord[]>(DEMO_PAYMENT_RECORDS);

  // Appointments state
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS);

  // Reputation Sync state
  const [reviewSyncRecords] = useState<ReviewSyncRecord[]>(
    DEMO_REVIEW_SYNC_RECORDS,
  );
  const [reviewRequestTriggers] = useState<ReviewRequestTrigger[]>(
    DEMO_REVIEW_REQUEST_TRIGGERS,
  );

  // Pass 3 — Competitive Intel, Multi-Location, Lead Attribution
  const [competitorProfiles] = useState<CompetitorProfile[]>(DEMO_COMPETITORS);
  const [competitorAlerts] = useState<CompetitorAlert[]>(
    DEMO_COMPETITOR_ALERTS,
  );
  const [locationProfiles] = useState<LocationProfile[]>(DEMO_LOCATIONS);
  const [leadAttributionRecords] = useState<LeadAttributionRecord[]>(
    DEMO_ATTRIBUTION_RECORDS,
  );

  // Social Media Engagement Engine state
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() =>
    loadFromLocal("brf_social_posts", DEMO_SOCIAL_POSTS),
  );
  const [socialComments, setSocialComments] = useState<SocialComment[]>(() =>
    loadFromLocal("brf_social_comments", DEMO_SOCIAL_COMMENTS),
  );
  const [socialListeningAlerts, setSocialListeningAlerts] = useState<
    SocialListeningAlert[]
  >(() => loadFromLocal("brf_social_alerts", DEMO_SOCIAL_LISTENING_ALERTS));
  const [brandVoiceProfiles, setBrandVoiceProfiles] = useState<
    BrandVoiceProfile[]
  >(() => loadFromLocal("brf_brand_voice_profiles", DEMO_BRAND_VOICE_PROFILES));
  const [socialROIMetrics] = useState<SocialROIMetrics[]>(
    DEMO_SOCIAL_ROI_METRICS,
  );

  useEffect(() => {
    sessionStorage.setItem("brfUser", JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    sessionStorage.setItem("brfTenantId", currentTenantId);
  }, [currentTenantId]);
  useEffect(() => {
    localStorage.setItem("brfSocialMedia", JSON.stringify(socialMediaEnabled));
  }, [socialMediaEnabled]);
  useEffect(() => {
    localStorage.setItem("scanner3dEnabled", JSON.stringify(scanner3dEnabled));
  }, [scanner3dEnabled]);
  useEffect(() => {
    localStorage.setItem("brfAiProvider", JSON.stringify(aiProviderConfig));
  }, [aiProviderConfig]);
  useEffect(() => {
    localStorage.setItem("brfListings", JSON.stringify(listingConfigs));
  }, [listingConfigs]);
  useEffect(() => {
    sessionStorage.setItem("brfDemo", JSON.stringify(demoInfo));
  }, [demoInfo]);
  useEffect(() => {
    localStorage.setItem("brfCampaignToggles", JSON.stringify(campaignToggles));
  }, [campaignToggles]);
  useEffect(() => {
    localStorage.setItem("brfOnboarding", JSON.stringify(onboardingComplete));
  }, [onboardingComplete]);
  useEffect(() => {
    localStorage.setItem(
      "brfAgencyOnboarding",
      JSON.stringify(agencyOnboardingComplete),
    );
  }, [agencyOnboardingComplete]);
  useEffect(() => {
    localStorage.setItem(
      "brfAgentSubscriptions",
      JSON.stringify(agentSubscriptions),
    );
  }, [agentSubscriptions]);
  useEffect(() => {
    localStorage.setItem("brfAgentRequests", JSON.stringify(agentRequests));
  }, [agentRequests]);
  useEffect(() => {
    localStorage.setItem("brfAgentTasks", JSON.stringify(agentTasks));
  }, [agentTasks]);
  useEffect(() => {
    localStorage.setItem(
      "brfAgentPricing",
      JSON.stringify(agentPricingOverrides),
    );
  }, [agentPricingOverrides]);
  useEffect(() => {
    localStorage.setItem("brfWhiteLabel", JSON.stringify(whiteLabelSettings));
  }, [whiteLabelSettings]);

  // Agent Workflow OS persist effects
  useEffect(() => {
    localStorage.setItem("brf_agent_threads", JSON.stringify(agentThreads));
  }, [agentThreads]);
  useEffect(() => {
    localStorage.setItem("brf_agent_runs", JSON.stringify(agentRunsList));
  }, [agentRunsList]);
  useEffect(() => {
    localStorage.setItem("brf_artifacts", JSON.stringify(agentArtifacts));
  }, [agentArtifacts]);
  useEffect(() => {
    localStorage.setItem("brf_agent_templates", JSON.stringify(agentTemplates));
  }, [agentTemplates]);
  useEffect(() => {
    localStorage.setItem("brf_agent_memories", JSON.stringify(agentMemories));
  }, [agentMemories]);
  useEffect(() => {
    localStorage.setItem("brf_approval_items", JSON.stringify(approvalItems));
  }, [approvalItems]);
  useEffect(() => {
    localStorage.setItem(
      "brf_provider_adapters",
      JSON.stringify(providerAdapters),
    );
  }, [providerAdapters]);

  useEffect(() => {
    localStorage.setItem("brfLeads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(
      "brf_open_source_config",
      JSON.stringify(openSourceConfig),
    );
  }, [openSourceConfig]);

  // Telephony persist effects
  useEffect(() => {
    localStorage.setItem("brf_call_logs", JSON.stringify(callLogs));
  }, [callLogs]);
  useEffect(() => {
    localStorage.setItem(
      "brf_missed_sms_configs",
      JSON.stringify(missedCallSmsConfigs),
    );
  }, [missedCallSmsConfigs]);
  useEffect(() => {
    localStorage.setItem(
      "brf_voice_agent_configs",
      JSON.stringify(inboundVoiceAgentConfigs),
    );
  }, [inboundVoiceAgentConfigs]);

  // SMS Inbox persist effects
  useEffect(() => {
    localStorage.setItem("brf_sms_threads", JSON.stringify(smsThreads));
  }, [smsThreads]);
  useEffect(() => {
    localStorage.setItem("brf_sms_messages", JSON.stringify(smsMessages));
  }, [smsMessages]);

  // Client Reporting persist effects
  useEffect(() => {
    localStorage.setItem("brf_client_reports", JSON.stringify(clientReports));
  }, [clientReports]);
  useEffect(() => {
    localStorage.setItem(
      "brf_report_schedules",
      JSON.stringify(reportSchedules),
    );
  }, [reportSchedules]);

  // Social Media Engine persist effects
  useEffect(() => {
    localStorage.setItem("brf_social_posts", JSON.stringify(socialPosts));
  }, [socialPosts]);
  useEffect(() => {
    localStorage.setItem("brf_social_comments", JSON.stringify(socialComments));
  }, [socialComments]);
  useEffect(() => {
    localStorage.setItem(
      "brf_social_alerts",
      JSON.stringify(socialListeningAlerts),
    );
  }, [socialListeningAlerts]);
  useEffect(() => {
    localStorage.setItem(
      "brf_brand_voice_profiles",
      JSON.stringify(brandVoiceProfiles),
    );
  }, [brandVoiceProfiles]);

  // ─── Social Media Handlers ──────────────────────────────────────────────────

  const getSocialPostsByTenant = (tenantId: string): SocialPost[] =>
    socialPosts
      .filter((p) => p.tenantId === tenantId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getSocialCommentsByTenant = (tenantId: string): SocialComment[] =>
    socialComments
      .filter((c) => c.tenantId === tenantId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getPendingSocialCommentsByTenant = (
    tenantId: string,
  ): SocialComment[] =>
    socialComments
      .filter((c) => c.tenantId === tenantId && !c.responded)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getSocialCommentsByIntent = (
    tenantId: string,
    intent: CommentIntent,
  ): SocialComment[] =>
    socialComments
      .filter((c) => c.tenantId === tenantId && c.intent === intent)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getSocialAlertsByTenant = (tenantId: string): SocialListeningAlert[] =>
    socialListeningAlerts
      .filter((a) => a.tenantId === tenantId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getActiveSocialAlertsByTenant = (
    tenantId: string,
  ): SocialListeningAlert[] =>
    socialListeningAlerts
      .filter((a) => a.tenantId === tenantId && !a.dismissed)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getSocialROIByTenant = (tenantId: string): SocialROIMetrics[] =>
    socialROIMetrics.filter((m) => m.tenantId === tenantId);

  const getBrandVoiceProfile = (
    tenantId: string,
  ): BrandVoiceProfile | undefined =>
    brandVoiceProfiles.find((p) => p.tenantId === tenantId);

  const createSocialPost = (
    postData: Omit<
      SocialPost,
      "id" | "createdAt" | "engagementMetrics" | "publishedAt"
    >,
  ): SocialPost => {
    const newPost: SocialPost = {
      ...postData,
      id: `post-${Date.now()}`,
      publishedAt: null,
      engagementMetrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        clicks: 0,
        saves: 0,
        bookingsGenerated: 0,
        leadsGenerated: 0,
      },
      createdAt: Date.now(),
    };
    setSocialPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updateSocialPost = (id: string, updates: Partial<SocialPost>) => {
    setSocialPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deleteSocialPost = (id: string) => {
    setSocialPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const respondToSocialComment = (commentId: string, _responseText: string) => {
    setSocialComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, responded: true, respondedAt: Date.now() }
          : c,
      ),
    );
  };

  const dismissSocialAlert = (alertId: string) => {
    setSocialListeningAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)),
    );
  };

  const upsertBrandVoiceProfile = (
    profile: Omit<BrandVoiceProfile, "lastCalibrated">,
  ) => {
    const fullProfile: BrandVoiceProfile = {
      ...profile,
      lastCalibrated: Date.now(),
    };
    setBrandVoiceProfiles((prev) => {
      const exists = prev.some((p) => p.tenantId === profile.tenantId);
      if (exists) {
        return prev.map((p) =>
          p.tenantId === profile.tenantId ? fullProfile : p,
        );
      }
      return [...prev, fullProfile];
    });
  };

  const setCampaignToggle = (
    tenantId: string,
    campaignId: string,
    enabled: boolean,
  ) => {
    setCampaignTogglesState((prev) => ({
      ...prev,
      [tenantId]: { ...(prev[tenantId] ?? {}), [campaignId]: enabled },
    }));
  };
  const setCurrentTenantId = (id: string) => setCurrentTenantIdState(id);

  const login = (
    role: "superAdmin" | "agency" | "client",
    tenantId: string,
    adminUser = false,
  ) => {
    setDemoInfo(null);
    sessionStorage.removeItem("brfDemo");
    setCurrentUser({
      name:
        role === "superAdmin"
          ? "Platform Owner"
          : adminUser
            ? "Agency Admin"
            : role === "agency"
              ? "Agency Admin"
              : "Business Owner",
      role,
      isAdminUser: adminUser,
    });
    setCurrentTenantIdState(tenantId);
  };

  const loginDemo = (info: DemoInfo) => {
    // Normalize the niche to a NicheId (handles both "Med Spa" and "med-spa" inputs)
    const nicheId = normalizeNicheId(info.niche);
    const normalizedInfo: DemoInfo = { ...info, niche: nicheId };

    setDemoInfo(normalizedInfo);
    setTenants((prev) =>
      prev.map((t) =>
        t.id === "tenant-demo"
          ? {
              ...t,
              name: info.businessName,
              type: nicheId,
              address: `${info.city}`,
            }
          : t,
      ),
    );
    setCurrentUser({
      name: info.firstName,
      role: "client",
      isAdminUser: false,
    });
    setCurrentTenantIdState("tenant-demo");

    // Auto-assign the first website variant for this niche so the demo user
    // always lands on their niche's site — never a generic picker or wrong niche.
    const defaultWebsite = getFirstWebsiteForNiche(nicheId);
    if (defaultWebsite) {
      const autoConfig: ClientWebsiteConfig = {
        tenantId: "tenant-demo",
        websiteId: defaultWebsite.id,
        isPublished: false,
        editingLocked: false,
        customizations: {
          businessName: info.businessName,
          address: info.city,
          sectionOverrides: {},
          hiddenSections: [],
        },
        lastUpdated: new Date().toISOString(),
      };
      saveClientWebsiteConfig(autoConfig);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setDemoInfo(null);
    sessionStorage.removeItem("brfUser");
    sessionStorage.removeItem("brfTenantId");
    sessionStorage.removeItem("brfDemo");
  };

  const addTenant = (tenant: TenantEntry) => {
    setTenants((prev) => [...prev, tenant]);
  };
  const deleteTenant = (id: string) => {
    setTenants((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTenantPhone = (
    tenantId: string,
    fields: Partial<
      Pick<
        TenantEntry,
        | "assignedPhoneNumber"
        | "phoneNumberType"
        | "phoneNumberStatus"
        | "areaCode"
        | "portingNumber"
        | "forwardingFromNumber"
      >
    >,
  ) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, ...fields } : t)),
    );
  };

  const setAuditOverride = (tenantId: string, score: number) => {
    setAuditOverrides((prev) => ({ ...prev, [tenantId]: score }));
  };
  const setFundabilityOverride = (tenantId: string, score: number) => {
    setFundabilityOverrides((prev) => ({ ...prev, [tenantId]: score }));
  };
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };
  const setSocialMediaEnabledForTenant = (
    tenantId: string,
    enabled: boolean,
  ) => {
    setSocialMediaEnabled((prev) => ({ ...prev, [tenantId]: enabled }));
  };
  const setScanner3dEnabledForTenant = (tenantId: string, enabled: boolean) => {
    setScanner3dEnabled((prev) => ({ ...prev, [tenantId]: enabled }));
  };
  const isScanner3dEnabled = (tenantId: string): boolean =>
    scanner3dEnabled[tenantId] ?? false;
  const setAiProviderConfig = (config: AiProviderConfig) => {
    setAiProviderConfigState(config);
  };
  const setListingConfig = (tenantId: string, config: ListingConfig) => {
    setListingConfigsState((prev) => ({ ...prev, [tenantId]: config }));
  };

  // Onboarding handlers
  const markOnboardingComplete = (tenantId: string) => {
    setOnboardingComplete((prev) => ({ ...prev, [tenantId]: true }));
  };
  const resetOnboarding = (tenantId: string) => {
    setOnboardingComplete((prev) => {
      const next = { ...prev };
      delete next[tenantId];
      return next;
    });
  };
  const markAgencyOnboardingComplete = () => {
    setAgencyOnboardingComplete(true);
  };
  const resetAgencyOnboarding = () => {
    setAgencyOnboardingComplete(false);
  };

  // ─── CRM Mutation Methods (tool layer) ────────────────────────────────────────

  const addLead = (
    tenantId: string,
    lead: Omit<Lead, "id" | "createdAt">,
  ): Lead => {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: Date.now(),
    };
    setLeads((prev) => ({
      ...prev,
      [tenantId]: [newLead, ...(prev[tenantId] ?? [])],
    }));
    return newLead;
  };

  const updateLeadStatus = (
    tenantId: string,
    leadId: string,
    status: Lead["status"],
  ) => {
    setLeads((prev) => ({
      ...prev,
      [tenantId]: (prev[tenantId] ?? []).map((l) =>
        l.id === leadId ? { ...l, status } : l,
      ),
    }));
  };

  const getLeadsByTenant = (tenantId: string): Lead[] => leads[tenantId] ?? [];

  const getAuditDataForTenant = (tenantId: string) => {
    const base = AUDIT_SCORES[tenantId];
    const override = auditOverrides[tenantId];
    const overallScore = override ?? base?.total ?? 64;
    return {
      seoScore: base?.gmb ?? Math.round(overallScore * 0.95),
      mobileScore: base?.website ?? Math.round(overallScore * 0.92),
      technicalScore: base?.citations ?? Math.round(overallScore * 0.88),
      speedScore: base?.backlinks ?? Math.round(overallScore * 0.85),
      overallScore,
      recommendations: base?.recommendations,
    };
  };

  const getActiveAgentsForTenant = (tenantId: string): AgentSubscription[] =>
    agentSubscriptions.filter(
      (s) => s.tenantId === tenantId && s.status === "active",
    );

  const getTenantById = (tenantId: string): TenantEntry | undefined =>
    tenants.find((t) => t.id === tenantId);

  // ─── Agent Services handlers ──────────────────────────────────────────────────
  const activateAgent = (
    tenantId: string,
    productId: string,
    withOversight = false,
  ) => {
    // Bundle guard: auto-cancel individual seo/ads subs if activating bundle
    if (productId === "agent-bundle") {
      setAgentSubscriptions((prev) =>
        prev.map((s) =>
          s.tenantId === tenantId &&
          (s.productId === "agent-seo" || s.productId === "agent-ads") &&
          s.status !== "cancelled"
            ? { ...s, status: "cancelled" as const }
            : s,
        ),
      );
    }
    const product = AGENT_PRODUCTS.find((p) => p.id === productId);
    const tenant = tenants.find((t) => t.id === tenantId);
    const newSub: AgentSubscription = {
      id: `sub-${Date.now()}`,
      tenantId,
      productId,
      status: "active",
      activatedAt: Date.now(),
      hasOversight: withOversight,
      notes: "",
      nextDeliverable: "Initial setup and onboarding",
      currentWork: "Getting started — initial audit in progress",
    };
    setAgentSubscriptions((prev) => [...prev, newSub]);
    const notification = {
      id: `notif-agent-${Date.now()}`,
      type: "general" as const,
      title: "Agent Activated",
      message: `${product?.name ?? productId} activated for ${tenant?.name ?? tenantId}`,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const deactivateAgent = (subscriptionId: string) => {
    setAgentSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subscriptionId ? { ...s, status: "cancelled" as const } : s,
      ),
    );
  };

  const pauseAgent = (subscriptionId: string) => {
    setAgentSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subscriptionId ? { ...s, status: "paused" as const } : s,
      ),
    );
  };

  const resumeAgent = (subscriptionId: string) => {
    setAgentSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subscriptionId ? { ...s, status: "active" as const } : s,
      ),
    );
  };

  const submitAgentRequest = (
    req: Omit<AgentServiceRequest, "id" | "submittedAt" | "status">,
  ) => {
    const newReq: AgentServiceRequest = {
      ...req,
      id: `req-${Date.now()}`,
      submittedAt: Date.now(),
      status: "submitted",
    };
    setAgentRequests((prev) => [newReq, ...prev]);
    // Fire admin notification for new service request
    const notification = {
      id: `notif-req-${Date.now()}`,
      type: "general" as const,
      title: "New Service Request",
      message: `New request submitted${req.productId ? ` for ${req.productId.replace("agent-", "").toUpperCase()}` : ""}: ${req.title}`,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const updateAgentTaskStatus = (
    taskId: string,
    status: AgentTask["status"],
  ) => {
    setAgentTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              completedAt: status === "complete" ? Date.now() : t.completedAt,
            }
          : t,
      ),
    );
  };

  const setAgentPriceOverride = (productId: string, price: number) => {
    setAgentPricingOverridesState((prev) => ({ ...prev, [productId]: price }));
  };

  const addOversight = (subscriptionId: string) => {
    setAgentSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subscriptionId ? { ...s, hasOversight: true } : s,
      ),
    );
    const sub = agentSubscriptions.find((s) => s.id === subscriptionId);
    const product = AGENT_PRODUCTS.find((p) => p.id === sub?.productId);
    const tenant = tenants.find((t) => t.id === sub?.tenantId);
    const newTask: AgentTask = {
      id: `task-oversight-${Date.now()}`,
      tenantId: sub?.tenantId ?? "",
      productId: sub?.productId ?? "",
      subscriptionId,
      title: `Human Oversight Upgrade — ${product?.name ?? "Agent"}`,
      description: `Client requested Human Oversight add-on for ${product?.name}. Schedule strategy onboarding call and assign dedicated strategist.`,
      type: "review",
      status: "pending",
      priority: "high",
      assignee: "Unassigned",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      createdAt: Date.now(),
      notes: "Auto-created from client Human Oversight activation",
      isClientRequest: true,
    };
    setAgentTasks((prev) => [newTask, ...prev]);
    const notification = {
      id: `notif-oversight-${Date.now()}`,
      type: "general" as const,
      title: "Human Oversight Activated",
      message: `${tenant?.name ?? "A client"} added Human Oversight to ${product?.name ?? "their agent"}`,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const addAgentSubscriptionNote = (subscriptionId: string, note: string) => {
    setAgentSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, notes: note } : s)),
    );
  };

  const setWhiteLabelSettings = (settings: WhiteLabelSettings) => {
    setWhiteLabelSettingsState(settings);
  };

  const setOpenSourceConfig = (config: OpenSourceServiceConfig) => {
    setOpenSourceConfigState(config);
  };

  // ─── Telephony Mutation Methods ────────────────────────────────────────────────

  const addCallLog = (log: CallLog) => {
    setCallLogs((prev) => [log, ...prev]);
  };

  const updateMissedCallSmsConfig = (
    tenantId: string,
    config: MissedCallSmsConfig,
  ) => {
    setMissedCallSmsConfigs((prev) => ({ ...prev, [tenantId]: config }));
  };

  const updateInboundVoiceAgentConfig = (
    tenantId: string,
    config: InboundVoiceAgentConfig,
  ) => {
    setInboundVoiceAgentConfigs((prev) => ({ ...prev, [tenantId]: config }));
  };

  const getCallLogsByTenant = (tenantId: string): CallLog[] =>
    callLogs.filter((c) => c.tenantId === tenantId);

  // ─── SMS Inbox Helpers & Actions ────────────────────────────────────────────

  const getSmsThreadsByTenant = (tenantId: string): SMSThread[] =>
    smsThreads
      .filter((t) => t.tenantId === tenantId && !t.archived)
      .sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  const getSmsMessagesByThread = (threadId: string): SMSMessage[] =>
    smsMessages
      .filter((m) => m.threadId === threadId)
      .sort((a, b) => a.sentAt - b.sentAt);

  const getUnreadCountByTenant = (tenantId: string): number =>
    smsThreads
      .filter((t) => t.tenantId === tenantId && !t.archived)
      .reduce((sum, t) => sum + t.unreadCount, 0);

  const addSmsMessage = (
    threadId: string,
    tenantId: string,
    direction: "inbound" | "outbound",
    text: string,
  ) => {
    const now = Date.now();
    const newMsg: SMSMessage = {
      id: `sms-msg-${now}`,
      threadId,
      tenantId,
      direction,
      sender: direction === "outbound" ? "Business" : threadId,
      text,
      sentAt: now,
      readAt: direction === "outbound" ? now : undefined,
      status: direction === "outbound" ? "sent" : "received",
    };
    setSmsMessages((prev) => [...prev, newMsg]);
    setSmsThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              lastMessageAt: now,
              unreadCount:
                direction === "inbound" ? t.unreadCount + 1 : t.unreadCount,
            }
          : t,
      ),
    );
    // Fire notification for inbound messages
    if (direction === "inbound") {
      const thread = smsThreads.find((t) => t.id === threadId);
      if (thread) {
        const snippet = text.length > 60 ? `${text.slice(0, 60)}…` : text;
        setNotifications((prev) => [
          {
            id: `notif-sms-${Date.now()}`,
            type: "sms_reply" as const,
            title: `SMS reply from ${thread.prospectName}`,
            message: snippet,
            time: "Just now",
            read: false,
          },
          ...prev,
        ]);
      }
    }
  };

  const markThreadRead = (threadId: string) => {
    const now = Date.now();
    setSmsThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t)),
    );
    setSmsMessages((prev) =>
      prev.map((m) =>
        m.threadId === threadId && m.direction === "inbound" && !m.readAt
          ? { ...m, readAt: now }
          : m,
      ),
    );
  };

  const archiveThread = (threadId: string) => {
    setSmsThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, archived: true } : t)),
    );
  };

  const createSmsThread = (
    tenantId: string,
    prospectPhone: string,
    prospectName: string,
    linkedLeadId?: string,
  ): SMSThread => {
    const now = Date.now();
    const thread: SMSThread = {
      id: `sms-thread-${now}`,
      tenantId,
      prospectPhone,
      prospectName,
      linkedLeadId,
      archived: false,
      createdAt: now,
      lastMessageAt: now,
      unreadCount: 0,
    };
    setSmsThreads((prev) => [thread, ...prev]);
    // Auto-send first outbound message (default missed call SMS)
    const firstMsg: SMSMessage = {
      id: `sms-msg-${now}-init`,
      threadId: thread.id,
      tenantId,
      direction: "outbound",
      sender: "Business",
      text: "Hey! Sorry we missed your call. We'd love to help — reply here or call us back anytime.",
      sentAt: now,
      readAt: now,
      status: "sent",
    };
    setSmsMessages((prev) => [...prev, firstMsg]);
    return thread;
  };

  const addNotification = (
    notif: Omit<Notification, "id" | "time" | "read">,
  ) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ─── Client Reporting Handlers ─────────────────────────────────────────────

  const getClientReports = (tenantId: string): ClientReport[] =>
    clientReports
      .filter((r) => r.tenantId === tenantId)
      .sort((a, b) => b.generatedAt - a.generatedAt);

  const generateReport = (
    tenantId: string,
    reportType: "weekly" | "monthly",
  ): ClientReport => {
    const now = new Date();
    const periodLabel =
      reportType === "weekly"
        ? `Week of ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
        : now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const report = generateDemoReport(tenantId, reportType, periodLabel);
    setClientReports((prev) => [report, ...prev]);
    const tenant = TENANTS.find((t) => t.id === tenantId);
    setNotifications((prev) => [
      {
        id: `notif-report-${Date.now()}`,
        type: "general" as const,
        title: `New ${reportType === "weekly" ? "Weekly" : "Monthly"} Report Ready`,
        message: `New ${reportType} report is ready for ${tenant?.name ?? tenantId}`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);
    setReportSchedules((prev) =>
      prev.map((s) =>
        s.tenantId === tenantId ? { ...s, lastGeneratedAt: Date.now() } : s,
      ),
    );
    return report;
  };

  const updateReportSchedule = (
    tenantId: string,
    schedule: Partial<ReportSchedule>,
  ) => {
    setReportSchedules((prev) => {
      const existing = prev.find((s) => s.tenantId === tenantId);
      if (existing) {
        return prev.map((s) =>
          s.tenantId === tenantId ? { ...s, ...schedule } : s,
        );
      }
      return [
        ...prev,
        {
          tenantId,
          weeklyEnabled: false,
          monthlyEnabled: false,
          deliveryDayOfWeek: 1,
          deliveryHour: 8,
          ...schedule,
        },
      ];
    });
  };

  const getReportSchedule = (tenantId: string): ReportSchedule | undefined =>
    reportSchedules.find((s) => s.tenantId === tenantId);

  // ─── Agent Workflow OS Handlers ───────────────────────────────────────────

  const createThread = (
    tenantId: string,
    agentType: string,
    title: string,
  ): AgentThread => {
    const thread: AgentThread = {
      id: `thread-${Date.now()}`,
      tenantId,
      agentType,
      title,
      status: "active",
      messageCount: 0,
      summary: "",
      agentNotes: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setAgentThreads((prev) => [thread, ...prev]);
    return thread;
  };

  const startRun = (
    threadId: string,
    tenantId: string,
    agentType: string,
    inputPrompt: string,
    approvalRequired = false,
  ): AgentRun => {
    const run: AgentRun = {
      id: `run-${Date.now()}`,
      threadId,
      tenantId,
      agentType,
      status: "running",
      inputPrompt,
      outputText: "",
      errorMessage: "",
      artifactIds: [],
      workflowStepIndex: 0,
      approvalRequired,
      approvalStatus: null,
      startedAt: Date.now(),
      endedAt: null,
      metadata: {},
    };
    setAgentRunsList((prev) => [run, ...prev]);
    setActiveRunId(run.id);
    setAgentThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, messageCount: t.messageCount + 1, updatedAt: Date.now() }
          : t,
      ),
    );
    return run;
  };

  const completeRun = (
    runId: string,
    outputText: string,
    artifactIds: string[] = [],
    metadata: Record<string, string> = {},
  ) => {
    setAgentRunsList((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: "completed" as const,
              outputText,
              artifactIds,
              endedAt: Date.now(),
              metadata: { ...r.metadata, ...metadata },
            }
          : r,
      ),
    );
    setActiveRunId(null);
  };

  const failRun = (runId: string, errorMessage: string) => {
    setAgentRunsList((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: "failed" as const,
              errorMessage,
              endedAt: Date.now(),
            }
          : r,
      ),
    );
    setActiveRunId(null);
  };

  const pauseRunForApproval = (runId: string, reason: string): ApprovalItem => {
    setAgentRunsList((prev) =>
      prev.map((r) =>
        r.id === runId
          ? {
              ...r,
              status: "paused_for_approval" as const,
              approvalRequired: true,
              approvalStatus: "pending" as const,
            }
          : r,
      ),
    );
    const run = agentRunsList.find((r) => r.id === runId);
    const item: ApprovalItem = {
      id: `approval-${Date.now()}`,
      runId,
      threadId: run?.threadId ?? "",
      tenantId: run?.tenantId ?? "",
      action: run?.inputPrompt ?? "",
      reason,
      status: "pending",
      requestedAt: Date.now(),
      resolvedAt: null,
      approverNotes: "",
    };
    setApprovalItems((prev) => [item, ...prev]);
    return item;
  };

  const resolveApproval = (
    approvalItemId: string,
    approved: boolean,
    notes = "",
  ) => {
    setApprovalItems((prev) =>
      prev.map((a) =>
        a.id === approvalItemId
          ? {
              ...a,
              status: approved ? ("approved" as const) : ("rejected" as const),
              resolvedAt: Date.now(),
              approverNotes: notes,
            }
          : a,
      ),
    );
    const item = approvalItems.find((a) => a.id === approvalItemId);
    if (item) {
      setAgentRunsList((prev) =>
        prev.map((r) =>
          r.id === item.runId
            ? {
                ...r,
                approvalStatus: approved
                  ? ("approved" as const)
                  : ("rejected" as const),
                status: approved
                  ? ("completed" as const)
                  : ("cancelled" as const),
                endedAt: Date.now(),
              }
            : r,
        ),
      );
    }
  };

  const createArtifact = (
    runId: string,
    threadId: string,
    tenantId: string,
    artifactType: AgentArtifact["artifactType"],
    title: string,
    content: string,
    tags: string[] = [],
  ): AgentArtifact => {
    const artifact: AgentArtifact = {
      id: `artifact-${Date.now()}`,
      runId,
      threadId,
      tenantId,
      artifactType,
      title,
      content,
      tags,
      status: "draft",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setAgentArtifacts((prev) => [artifact, ...prev]);
    return artifact;
  };

  const createTemplate = (
    tenantId: string,
    templateData: Omit<AgentTemplateRecord, "id" | "createdAt">,
  ): AgentTemplateRecord => {
    const template: AgentTemplateRecord = {
      ...templateData,
      id: `tmpl-${Date.now()}`,
      tenantId,
      createdAt: Date.now(),
    };
    setAgentTemplates((prev) => [...prev, template]);
    return template;
  };

  const updateTemplate = (
    id: string,
    updates: Partial<AgentTemplateRecord>,
  ) => {
    setAgentTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const deleteTemplate = (id: string) => {
    setAgentTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const updateMemory = (
    threadId: string,
    tenantId: string,
    entry: { role: "user" | "assistant"; content: string },
    summary?: string,
    agentNotes?: string,
  ) => {
    setAgentMemories((prev) => {
      const existing = prev.find((m) => m.threadId === threadId);
      const newEntry = { ...entry, timestamp: Date.now() };
      if (existing) {
        return prev.map((m) =>
          m.threadId === threadId
            ? {
                ...m,
                conversationHistory: [...m.conversationHistory, newEntry],
                summary: summary ?? m.summary,
                agentNotes: agentNotes ?? m.agentNotes,
                lastUpdated: Date.now(),
              }
            : m,
        );
      }
      return [
        ...prev,
        {
          threadId,
          tenantId,
          conversationHistory: [newEntry],
          summary: summary ?? "",
          agentNotes: agentNotes ?? "",
          lastUpdated: Date.now(),
        },
      ];
    });
  };

  const setActiveAdapter = (
    tenantId: string,
    adapterType: ProviderAdapterConfig["adapterType"],
    isEnabled: boolean,
    apiKey = "",
    baseUrl = "",
    modelId = "",
  ) => {
    setProviderAdapters((prev) => {
      const existing = prev.find(
        (a) => a.adapterType === adapterType && a.tenantId === tenantId,
      );
      if (existing) {
        return prev.map((a) =>
          a.adapterType === adapterType && a.tenantId === tenantId
            ? {
                ...a,
                isEnabled,
                apiKey: apiKey || a.apiKey,
                baseUrl: baseUrl || a.baseUrl,
                modelId: modelId || a.modelId,
              }
            : a,
        );
      }
      return [
        ...prev,
        {
          id: `adapter-${Date.now()}`,
          tenantId,
          adapterType,
          isEnabled,
          apiKey,
          baseUrl,
          modelId,
          priority: prev.length + 1,
          createdAt: Date.now(),
        },
      ];
    });
  };

  const getThreadForAgent = (tenantId: string, agentType: string) =>
    agentThreads.find(
      (t) =>
        t.tenantId === tenantId &&
        t.agentType === agentType &&
        t.status === "active",
    );

  const getRunsForThread = (threadId: string) =>
    agentRunsList
      .filter((r) => r.threadId === threadId)
      .sort((a, b) => b.startedAt - a.startedAt);

  const getArtifactsForThread = (threadId: string) =>
    agentArtifacts
      .filter((a) => a.threadId === threadId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const isDemoMode = demoInfo !== null && currentTenantId === "tenant-demo";

  // ─── Client Health Score Methods ──────────────────────────────────────────────

  const getClientHealthScore = (
    tenantId: string,
  ): ClientHealthScore | undefined =>
    clientHealthScores.find((s) => s.tenantId === tenantId);

  const getAllClientHealthScores = (): ClientHealthScore[] =>
    clientHealthScores;

  const refreshHealthScore = (tenantId: string): void => {
    const tenantLeads = leads[tenantId] ?? [];
    const tenantSubs = agentSubscriptions;
    const auditData = getAuditDataForTenant(tenantId);
    const auditScore = {
      seoScore: auditData.seoScore,
      technicalScore: auditData.technicalScore,
      contentScore: auditData.mobileScore,
      conversionScore: auditData.speedScore,
      total: auditData.overallScore,
    };
    const newScore = calculateHealthScore(tenantId, {
      leads: tenantLeads,
      reviews: [],
      auditScore,
      agentSubscriptions: tenantSubs,
    });
    setClientHealthScores((prev) =>
      prev.some((s) => s.tenantId === tenantId)
        ? prev.map((s) => (s.tenantId === tenantId ? newScore : s))
        : [...prev, newScore],
    );
  };

  // ─── Payments & Estimates Methods ─────────────────────────────────────────────

  const getEstimatesByTenant = (tenantId: string): Estimate[] =>
    estimates.filter((e) => e.tenantId === tenantId);

  const getPaymentsByTenant = (tenantId: string): PaymentRecord[] =>
    paymentRecords.filter((p) => p.tenantId === tenantId);

  // ─── Appointments Methods ──────────────────────────────────────────────────────

  const getBookingsByTenant = (tenantId: string): Booking[] =>
    bookings.filter((b) => b.tenantId === tenantId);

  const addBooking = (booking: Omit<Booking, "id" | "createdAt">): Booking => {
    const newBooking: Booking = {
      ...booking,
      id: `book-${Date.now()}`,
      createdAt: Date.now(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (
    bookingId: string,
    status: Booking["status"],
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
    );
  };

  // ─── Reputation Sync Methods ───────────────────────────────────────────────────

  const getReviewSyncRecordsByTenant = (tenantId: string): ReviewSyncRecord[] =>
    reviewSyncRecords.filter((r) => r.tenantId === tenantId);

  const getReviewRequestTriggersByTenant = (
    tenantId: string,
  ): ReviewRequestTrigger[] =>
    reviewRequestTriggers.filter((r) => r.tenantId === tenantId);

  return (
    <AppContext.Provider
      value={{
        currentTenantId,
        setCurrentTenantId,
        isAdmin: currentUser?.role === "agency",
        isSuperAdmin: currentUser?.role === "superAdmin",
        isAdminUser:
          currentUser?.isAdminUser === true ||
          currentUser?.role === "superAdmin",
        scanner3dEnabled,
        setScanner3dEnabledForTenant,
        isScanner3dEnabled,
        currentUser,
        isLoggedIn: currentUser !== null,
        login,
        loginDemo,
        logout,
        tenants,
        addTenant,
        deleteTenant,
        updateTenantPhone,
        auditOverrides,
        fundabilityOverrides,
        setAuditOverride,
        setFundabilityOverride,
        notifications,
        setNotifications,
        markAllRead,
        markRead,
        aiPanelOpen,
        setAiPanelOpen,
        weeklyReportOpen,
        setWeeklyReportOpen,
        socialMediaEnabled,
        setSocialMediaEnabledForTenant,
        aiProviderConfig,
        setAiProviderConfig,
        listingConfigs,
        setListingConfig,
        campaignToggles,
        setCampaignToggle,
        isDemoMode,
        demoInfo,
        onboardingComplete,
        markOnboardingComplete,
        resetOnboarding,
        agencyOnboardingComplete,
        markAgencyOnboardingComplete,
        resetAgencyOnboarding,
        agentSubscriptions,
        agentRequests,
        agentTasks,
        agentPricingOverrides,
        activateAgent,
        deactivateAgent,
        pauseAgent,
        resumeAgent,
        submitAgentRequest,
        updateAgentTaskStatus,
        setAgentPriceOverride,
        addAgentSubscriptionNote,
        addOversight,
        whiteLabelSettings,
        setWhiteLabelSettings,
        // Agent Workflow OS
        agentThreads,
        agentRunsList,
        agentArtifacts,
        agentTemplates,
        agentMemories,
        toolDefinitions,
        approvalItems,
        providerAdapters,
        activeRunId,
        createThread,
        startRun,
        completeRun,
        failRun,
        pauseRunForApproval,
        resolveApproval,
        createArtifact,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        updateMemory,
        setActiveAdapter,
        getThreadForAgent,
        getRunsForThread,
        getArtifactsForThread,
        // CRM tool layer
        leads,
        addLead,
        updateLeadStatus,
        getLeadsByTenant,
        getAuditDataForTenant,
        getActiveAgentsForTenant,
        getTenantById,
        // Open Source Services
        openSourceConfig,
        setOpenSourceConfig,
        // Telephony
        callLogs,
        missedCallSmsConfigs,
        inboundVoiceAgentConfigs,
        addCallLog,
        updateMissedCallSmsConfig,
        updateInboundVoiceAgentConfig,
        getCallLogsByTenant,
        // SMS Inbox
        smsThreads,
        smsMessages,
        setSmsThreads,
        setSmsMessages,
        getSmsThreadsByTenant,
        getSmsMessagesByThread,
        getUnreadCountByTenant,
        addSmsMessage,
        markThreadRead,
        archiveThread,
        createSmsThread,
        addNotification,
        // Client Reports
        clientReports,
        reportSchedules,
        getClientReports,
        generateReport,
        updateReportSchedule,
        getReportSchedule,
        // Client Health Scores
        clientHealthScores,
        getClientHealthScore,
        getAllClientHealthScores,
        refreshHealthScore,
        // Payments & Estimates
        estimates,
        paymentRecords,
        getEstimatesByTenant,
        getPaymentsByTenant,
        // Appointments
        bookings,
        getBookingsByTenant,
        addBooking,
        updateBookingStatus,
        // Reputation Sync
        reviewSyncRecords,
        reviewRequestTriggers,
        getReviewSyncRecordsByTenant,
        getReviewRequestTriggersByTenant,
        // Pass 3
        competitorProfiles,
        competitorAlerts,
        locationProfiles,
        leadAttributionRecords,
        // Social Media Engagement Engine
        socialPosts,
        socialComments,
        socialListeningAlerts,
        brandVoiceProfiles,
        socialROIMetrics,
        getSocialPostsByTenant,
        getSocialCommentsByTenant,
        getPendingSocialCommentsByTenant,
        getSocialCommentsByIntent,
        getSocialAlertsByTenant,
        getActiveSocialAlertsByTenant,
        getSocialROIByTenant,
        getBrandVoiceProfile,
        createSocialPost,
        updateSocialPost,
        deleteSocialPost,
        respondToSocialComment,
        dismissSocialAlert,
        upsertBrandVoiceProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
