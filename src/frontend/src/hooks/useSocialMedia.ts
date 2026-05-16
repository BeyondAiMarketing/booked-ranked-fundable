import { useState } from "react";
import {
  DEMO_BRAND_VOICE_PROFILES,
  DEMO_SOCIAL_COMMENTS,
  DEMO_SOCIAL_LISTENING_ALERTS,
  DEMO_SOCIAL_POSTS,
  DEMO_SOCIAL_ROI_METRICS,
} from "../data/socialMediaData";
import type {
  AlertType,
  BrandVoiceProfile,
  CommentIntent,
  CompetitorIntelReport,
  ContentCadence,
  CtaType,
  DemoFunnelEntry,
  EngagementApproval,
  EngagementApprovalStatus,
  FunnelStage,
  MarketingFramework,
  NicheType,
  PostStatus,
  ScheduledPost,
  SocialComment,
  SocialLead,
  SocialListeningAlert,
  SocialPlatform,
  SocialPost,
  SocialROIMetrics,
} from "../types/socialMedia";
import { useActor } from "./useActor";

// ─── Demo data for new entity types ───────────────────────────────────────────

const DEMO_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: "sp-1",
    tenantId: "tenant-1",
    content:
      "🔧 Did you know that 40% of water heater failures happen during winter? Don't wait until you're left without hot water. Our certified plumbers are ready to inspect yours today. Book a free 15-minute assessment → bookedrankedfunded.org/setup",
    platforms: ["facebook", "instagram"],
    scheduledAt: Date.now() + 86400000,
    status: "scheduled",
    niche: "plumbing",
    funnelStage: "tofu",
    marketingFramework: "hormozi_value_stack",
    ctaType: "booking",
    ctaUrl: "https://bookedrankedfunded.org/setup",
    contentCadence: 7,
    platformVariants: {
      instagram:
        "Water heater failing? 40% break in winter. Book your FREE 15-min check ⬇️ #plumbing #homerepair #plumber",
    },
    beforeAfterPhoto: null,
    tags: ["water-heater", "winter", "maintenance"],
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "sp-2",
    tenantId: "tenant-1",
    content:
      "⚡ Most homeowners never think about their electrical panel — until it fails. We found 3 critical hazards in 7 out of 10 homes we inspected last month. A $99 inspection today can prevent a $15,000 disaster tomorrow. Are you one of the 7?",
    platforms: ["facebook", "linkedin"],
    scheduledAt: Date.now() + 172800000,
    status: "scheduled",
    niche: "hvac",
    funnelStage: "mofu",
    marketingFramework: "kennedy_urgency",
    ctaType: "audit",
    ctaUrl: "https://bookedrankedfunded.org/setup",
    contentCadence: 7,
    platformVariants: {},
    beforeAfterPhoto: null,
    tags: ["hvac", "safety", "inspection"],
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
  },
];

const DEMO_ENGAGEMENT_APPROVALS: EngagementApproval[] = [
  {
    id: "ea-1",
    tenantId: "tenant-1",
    commentId: "c-101",
    commentText:
      "How much does it usually cost to replace a water heater? Mine is 12 years old",
    authorName: "Mike T.",
    platform: "facebook",
    draftResponse:
      "Hi Mike! Water heater replacements typically run $800–$1,500 depending on the unit. At 12 years old, yours is living on borrowed time — most last 8–12 years. We offer a free 15-minute assessment to tell you exactly what you need before you spend a dime. Want to book one?",
    refinedResponse: null,
    status: "pending",
    buyingSignalDetected: true,
    buyingSignalConfidence: 0.92,
    suggestedAction: "Send quote + booking link",
    createdAt: Date.now() - 1800000,
    resolvedAt: null,
  },
  {
    id: "ea-2",
    tenantId: "tenant-1",
    commentId: "c-102",
    commentText: "Do you guys do same-day service?",
    authorName: "Sarah K.",
    platform: "instagram",
    draftResponse:
      "Absolutely, Sarah! We offer same-day service for most plumbing emergencies — call us by noon and we'll be there today. What's going on?",
    refinedResponse: null,
    status: "pending",
    buyingSignalDetected: true,
    buyingSignalConfidence: 0.85,
    suggestedAction: "Offer same-day booking",
    createdAt: Date.now() - 900000,
    resolvedAt: null,
  },
];

const DEMO_COMPETITOR_REPORT: CompetitorIntelReport = {
  id: "cr-1",
  tenantId: "tenant-1",
  niche: "plumbing",
  location: "San Diego, CA",
  competitors: [
    {
      name: "FastFlow Plumbing",
      website: "fastflowplumbing.com",
      platforms: ["facebook", "instagram"],
      averageEngagement: 180,
      recentPosts: [],
      rankingPosition: 2,
      strengths: ["Fast response messaging", "Before/after photos"],
      gaps: ["No video content", "Rarely posts on LinkedIn"],
    },
    {
      name: "Pacific Drain Pros",
      website: "pacificdrainpros.com",
      platforms: ["facebook"],
      averageEngagement: 95,
      recentPosts: [],
      rankingPosition: 3,
      strengths: ["Consistent posting schedule"],
      gaps: ["Generic copy", "No CTA in posts", "No Instagram presence"],
    },
  ],
  topContentFormats: [
    "Before/after photos",
    "How-to videos",
    "5-star review posts",
  ],
  contentGapOpportunities: [
    "No competitor is running seasonal maintenance campaigns",
    "LinkedIn is untapped in this niche/location",
    "Video walkthroughs of repairs get 3x more reach",
  ],
  keywordOpportunities: [
    "emergency plumber San Diego",
    "water heater replacement cost",
    "drain cleaning near me",
  ],
  aiStrategicSummary:
    "Your top competitors are active on Facebook with static images but none are leveraging video or LinkedIn. The biggest gap is seasonal urgency content — nobody is warning homeowners about winter prep. First mover on video + LinkedIn gets 40%+ more organic reach in this market.",
  generatedAt: Date.now() - 86400000,
  refreshedAt: null,
  citationUrls: [],
};

const DEMO_SOCIAL_LEADS: SocialLead[] = [
  {
    id: "sl-1",
    tenantId: "tenant-1",
    name: "James R.",
    contactInfo: "james.r@email.com",
    source: {
      platform: "facebook",
      postId: "sp-1",
      commentId: "ea-1",
      triggerText: "How much to replace water heater",
    },
    buyingSignalText:
      "How much does it usually cost to replace a water heater?",
    confidence: 0.92,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Expressed cost intent, water heater 12 years old",
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
  },
];

const DEMO_DEMO_FUNNEL: DemoFunnelEntry[] = [
  {
    id: "df-1",
    tenantId: "tenant-1",
    prospectName: "Carlos Mendez",
    businessName: "Mendez Plumbing & Drain",
    email: "carlos@mendezplumbing.com",
    phone: "619-555-0142",
    niche: "plumbing",
    socialSource: "facebook",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/mendez-plumbing",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/mendez-plumbing",
    trialStartedAt: Date.now() - 86400000,
    trialExpiresAt: Date.now() + 6 * 86400000,
    currentStep: "website",
    stepsCompleted: ["voice_agent"],
    convertedToTrial: true,
    convertedToClient: false,
    lastActivityAt: Date.now() - 3600000,
    createdAt: Date.now() - 86400000,
  },
];

// ─── State interface ───────────────────────────────────────────────────────────

export interface SocialMediaState {
  // Existing data
  socialPosts: SocialPost[];
  socialComments: SocialComment[];
  socialListeningAlerts: SocialListeningAlert[];
  brandVoiceProfiles: BrandVoiceProfile[];
  socialROIMetrics: SocialROIMetrics[];

  // New data
  scheduledPosts: ScheduledPost[];
  engagementApprovals: EngagementApproval[];
  competitorReport: CompetitorIntelReport | null;
  socialLeads: SocialLead[];
  demoFunnelEntries: DemoFunnelEntry[];

  // Loading states
  isLoadingPosts: boolean;
  isLoadingComments: boolean;
  isLoadingAlerts: boolean;
  isLoadingROI: boolean;
  isLoadingScheduled: boolean;
  isLoadingApprovals: boolean;
  isLoadingCompetitor: boolean;
  isLoadingLeads: boolean;
  isLoadingFunnel: boolean;

  // Existing post CRUD
  createPost: (
    post: Omit<
      SocialPost,
      "id" | "createdAt" | "engagementMetrics" | "publishedAt"
    >,
  ) => SocialPost;
  updatePost: (id: string, updates: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  publishPost: (id: string) => void;
  schedulePost: (id: string, scheduledAt: number) => void;

  // Existing comment operations
  respondToComment: (commentId: string, responseText: string) => void;
  markCommentLeadCreated: (commentId: string) => void;
  dismissComment: (commentId: string) => void;

  // Existing alert operations
  dismissAlert: (alertId: string) => void;

  // Existing brand voice
  upsertBrandVoiceProfile: (
    profile: Omit<BrandVoiceProfile, "lastCalibrated">,
  ) => void;

  // New: Scheduled posts
  createScheduledPost: (
    post: Omit<ScheduledPost, "id" | "createdAt" | "updatedAt">,
  ) => Promise<ScheduledPost>;
  getScheduledPosts: (tenantId: string) => Promise<ScheduledPost[]>;
  updateScheduledPost: (
    id: string,
    updates: Partial<ScheduledPost>,
  ) => Promise<void>;

  // New: Engagement approvals (one-click human confirmation required)
  getEngagementApprovals: (tenantId: string) => Promise<EngagementApproval[]>;
  approveEngagement: (
    approvalId: string,
    finalResponse: string,
  ) => Promise<void>;
  rejectEngagement: (approvalId: string) => Promise<void>;
  flagEngagement: (approvalId: string, reason: string) => Promise<void>;

  // New: Competitor intelligence
  getCompetitorIntelReport: (
    tenantId: string,
  ) => Promise<CompetitorIntelReport | null>;
  refreshCompetitorIntel: (
    tenantId: string,
    niche: NicheType,
    location: string,
  ) => Promise<void>;

  // New: Social leads
  getSocialLeads: (tenantId: string) => Promise<SocialLead[]>;
  createSocialLead: (
    lead: Omit<SocialLead, "id" | "createdAt" | "updatedAt">,
  ) => Promise<SocialLead>;
  linkSocialLeadToCRM: (leadId: string) => Promise<void>;

  // New: Demo funnel
  getDemoFunnelEntries: (tenantId: string) => Promise<DemoFunnelEntry[]>;
  addDemoFunnelEntry: (
    entry: Omit<DemoFunnelEntry, "id" | "createdAt">,
  ) => Promise<DemoFunnelEntry>;
  updateDemoFunnelEntry: (
    id: string,
    updates: Partial<DemoFunnelEntry>,
  ) => Promise<void>;

  // Existing selectors
  getPostsByTenant: (tenantId: string) => SocialPost[];
  getCommentsByTenant: (tenantId: string) => SocialComment[];
  getCommentsByPost: (postId: string) => SocialComment[];
  getAlertsByTenant: (tenantId: string) => SocialListeningAlert[];
  getROIMetricsByTenant: (tenantId: string) => SocialROIMetrics[];
  getBrandVoiceProfile: (tenantId: string) => BrandVoiceProfile | undefined;
  getPendingCommentsByTenant: (tenantId: string) => SocialComment[];
  getCommentsByIntent: (
    tenantId: string,
    intent: CommentIntent,
  ) => SocialComment[];
  getActiveAlertsByTenant: (tenantId: string) => SocialListeningAlert[];
  getScheduledPostsByTenant: (tenantId: string) => SocialPost[];
  getPublishedPostsByTenant: (tenantId: string) => SocialPost[];
  getDraftPostsByTenant: (tenantId: string) => SocialPost[];
}

export function useSocialMedia(
  externalPosts?: SocialPost[],
  externalComments?: SocialComment[],
  externalAlerts?: SocialListeningAlert[],
  externalProfiles?: BrandVoiceProfile[],
  externalROI?: SocialROIMetrics[],
): SocialMediaState {
  const { actor } = useActor();

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(
    externalPosts ?? DEMO_SOCIAL_POSTS,
  );
  const [socialComments, setSocialComments] = useState<SocialComment[]>(
    externalComments ?? DEMO_SOCIAL_COMMENTS,
  );
  const [socialListeningAlerts, setSocialListeningAlerts] = useState<
    SocialListeningAlert[]
  >(externalAlerts ?? DEMO_SOCIAL_LISTENING_ALERTS);
  const [brandVoiceProfiles, setBrandVoiceProfiles] = useState<
    BrandVoiceProfile[]
  >(externalProfiles ?? DEMO_BRAND_VOICE_PROFILES);
  const [socialROIMetrics] = useState<SocialROIMetrics[]>(
    externalROI ?? DEMO_SOCIAL_ROI_METRICS,
  );

  // New state
  const [scheduledPosts, setScheduledPosts] =
    useState<ScheduledPost[]>(DEMO_SCHEDULED_POSTS);
  const [engagementApprovals, setEngagementApprovals] = useState<
    EngagementApproval[]
  >(DEMO_ENGAGEMENT_APPROVALS);
  const [competitorReport, setCompetitorReport] =
    useState<CompetitorIntelReport | null>(DEMO_COMPETITOR_REPORT);
  const [socialLeads, setSocialLeads] =
    useState<SocialLead[]>(DEMO_SOCIAL_LEADS);
  const [demoFunnelEntries, setDemoFunnelEntries] =
    useState<DemoFunnelEntry[]>(DEMO_DEMO_FUNNEL);

  // Loading states
  const [isLoadingPosts] = useState(false);
  const [isLoadingComments] = useState(false);
  const [isLoadingAlerts] = useState(false);
  const [isLoadingROI] = useState(false);
  const [isLoadingScheduled, setIsLoadingScheduled] = useState(false);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(false);
  const [isLoadingCompetitor, setIsLoadingCompetitor] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingFunnel, setIsLoadingFunnel] = useState(false);

  // ─── Existing Post CRUD ────────────────────────────────────────────────────

  const createPost = (
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

  const updatePost = (id: string, updates: Partial<SocialPost>) => {
    setSocialPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deletePost = (id: string) => {
    setSocialPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const publishPost = (id: string) => {
    setSocialPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "published" as PostStatus,
              publishedAt: Date.now(),
              scheduledAt: null,
            }
          : p,
      ),
    );
  };

  const schedulePost = (id: string, scheduledAt: number) => {
    setSocialPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "scheduled" as PostStatus, scheduledAt }
          : p,
      ),
    );
  };

  // ─── Existing Comment Operations ──────────────────────────────────────────

  const respondToComment = (commentId: string, _responseText: string) => {
    setSocialComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, responded: true, respondedAt: Date.now() }
          : c,
      ),
    );
  };

  const markCommentLeadCreated = (commentId: string) => {
    setSocialComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, leadCreated: true } : c)),
    );
  };

  const dismissComment = (commentId: string) => {
    setSocialComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, responded: true, respondedAt: Date.now() }
          : c,
      ),
    );
  };

  const dismissAlert = (alertId: string) => {
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
      return exists
        ? prev.map((p) => (p.tenantId === profile.tenantId ? fullProfile : p))
        : [...prev, fullProfile];
    });
  };

  // ─── New: Scheduled Posts ──────────────────────────────────────────────────

  const createScheduledPost = async (
    postData: Omit<ScheduledPost, "id" | "createdAt" | "updatedAt">,
  ): Promise<ScheduledPost> => {
    const now = Date.now();
    const newPost: ScheduledPost = {
      ...postData,
      id: `sp-${now}`,
      createdAt: now,
      updatedAt: now,
    };
    if (actor) {
      try {
        await actor.createScheduledPost(newPost);
      } catch (err) {
        console.warn(
          "[useSocialMedia] createScheduledPost backend call failed, using local state",
          err,
        );
      }
    }
    setScheduledPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const getScheduledPosts = async (
    tenantId: string,
  ): Promise<ScheduledPost[]> => {
    setIsLoadingScheduled(true);
    try {
      if (actor) {
        const result = (await actor.getScheduledPosts(
          tenantId,
        )) as ScheduledPost[];
        if (Array.isArray(result) && result.length > 0) {
          setScheduledPosts(result);
          return result;
        }
      }
    } catch (err) {
      console.warn(
        "[useSocialMedia] getScheduledPosts backend call failed, using local state",
        err,
      );
    } finally {
      setIsLoadingScheduled(false);
    }
    return scheduledPosts.filter((p) => p.tenantId === tenantId);
  };

  const updateScheduledPost = async (
    id: string,
    updates: Partial<ScheduledPost>,
  ): Promise<void> => {
    setScheduledPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p,
      ),
    );
    if (actor) {
      try {
        await actor.updateScheduledPost(id, updates);
      } catch (err) {
        console.warn(
          "[useSocialMedia] updateScheduledPost backend call failed",
          err,
        );
      }
    }
  };

  // ─── New: Engagement Approvals ────────────────────────────────────────────
  // NOTE: One-click human confirmation required before any post — never auto-post.

  const getEngagementApprovals = async (
    tenantId: string,
  ): Promise<EngagementApproval[]> => {
    setIsLoadingApprovals(true);
    try {
      if (actor) {
        const result = (await actor.getEngagementApprovals(
          tenantId,
        )) as EngagementApproval[];
        if (Array.isArray(result) && result.length > 0) {
          setEngagementApprovals(result);
          return result;
        }
      }
    } catch (err) {
      console.warn(
        "[useSocialMedia] getEngagementApprovals backend call failed",
        err,
      );
    } finally {
      setIsLoadingApprovals(false);
    }
    return engagementApprovals.filter((a) => a.tenantId === tenantId);
  };

  const approveEngagement = async (
    approvalId: string,
    finalResponse: string,
  ): Promise<void> => {
    setEngagementApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status: "approved" as EngagementApprovalStatus,
              refinedResponse: finalResponse,
              resolvedAt: Date.now(),
            }
          : a,
      ),
    );
    if (actor) {
      try {
        await actor.approveEngagement(approvalId, finalResponse);
      } catch (err) {
        console.warn(
          "[useSocialMedia] approveEngagement backend call failed",
          err,
        );
      }
    }
  };

  const rejectEngagement = async (approvalId: string): Promise<void> => {
    setEngagementApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status: "rejected" as EngagementApprovalStatus,
              resolvedAt: Date.now(),
            }
          : a,
      ),
    );
    if (actor) {
      try {
        await actor.rejectEngagement(approvalId);
      } catch (err) {
        console.warn(
          "[useSocialMedia] rejectEngagement backend call failed",
          err,
        );
      }
    }
  };

  const flagEngagement = async (
    approvalId: string,
    _reason: string,
  ): Promise<void> => {
    setEngagementApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status: "flagged" as EngagementApprovalStatus,
              resolvedAt: Date.now(),
            }
          : a,
      ),
    );
    if (actor) {
      try {
        await actor.flagEngagement(approvalId, _reason);
      } catch (err) {
        console.warn(
          "[useSocialMedia] flagEngagement backend call failed",
          err,
        );
      }
    }
  };

  // ─── New: Competitor Intelligence ─────────────────────────────────────────

  const getCompetitorIntelReport = async (
    tenantId: string,
  ): Promise<CompetitorIntelReport | null> => {
    setIsLoadingCompetitor(true);
    try {
      if (actor) {
        const result = (await actor.getCompetitorIntelReport(
          tenantId,
        )) as CompetitorIntelReport | null;
        if (result) {
          setCompetitorReport(result);
          return result;
        }
      }
    } catch (err) {
      console.warn(
        "[useSocialMedia] getCompetitorIntelReport backend call failed",
        err,
      );
    } finally {
      setIsLoadingCompetitor(false);
    }
    return competitorReport;
  };

  const refreshCompetitorIntel = async (
    tenantId: string,
    niche: NicheType,
    location: string,
  ): Promise<void> => {
    setIsLoadingCompetitor(true);
    try {
      if (actor) {
        await actor.refreshCompetitorIntel(tenantId, niche, location);
        await getCompetitorIntelReport(tenantId);
        return;
      }
    } catch (err) {
      console.warn(
        "[useSocialMedia] refreshCompetitorIntel backend call failed",
        err,
      );
    } finally {
      setIsLoadingCompetitor(false);
    }
    // Optimistic update with refreshed timestamp
    setCompetitorReport((prev) =>
      prev ? { ...prev, refreshedAt: Date.now() } : prev,
    );
  };

  // ─── New: Social Leads ─────────────────────────────────────────────────────

  const getSocialLeads = async (tenantId: string): Promise<SocialLead[]> => {
    setIsLoadingLeads(true);
    try {
      if (actor) {
        const result = (await actor.getSocialLeads(tenantId)) as SocialLead[];
        if (Array.isArray(result) && result.length > 0) {
          setSocialLeads(result);
          return result;
        }
      }
    } catch (err) {
      console.warn("[useSocialMedia] getSocialLeads backend call failed", err);
    } finally {
      setIsLoadingLeads(false);
    }
    return socialLeads.filter((l) => l.tenantId === tenantId);
  };

  const createSocialLead = async (
    leadData: Omit<SocialLead, "id" | "createdAt" | "updatedAt">,
  ): Promise<SocialLead> => {
    const now = Date.now();
    const newLead: SocialLead = {
      ...leadData,
      id: `sl-${now}`,
      createdAt: now,
      updatedAt: now,
    };
    if (actor) {
      try {
        await actor.createSocialLead(newLead);
      } catch (err) {
        console.warn(
          "[useSocialMedia] createSocialLead backend call failed",
          err,
        );
      }
    }
    setSocialLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const linkSocialLeadToCRM = async (leadId: string): Promise<void> => {
    setSocialLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, linkedToCrm: true, updatedAt: Date.now() }
          : l,
      ),
    );
    if (actor) {
      try {
        await actor.linkSocialLeadToCRM(leadId);
      } catch (err) {
        console.warn(
          "[useSocialMedia] linkSocialLeadToCRM backend call failed",
          err,
        );
      }
    }
  };

  // ─── New: Demo Funnel ──────────────────────────────────────────────────────

  const getDemoFunnelEntries = async (
    tenantId: string,
  ): Promise<DemoFunnelEntry[]> => {
    setIsLoadingFunnel(true);
    try {
      if (actor) {
        const result = (await actor.getDemoFunnelEntries(
          tenantId,
        )) as DemoFunnelEntry[];
        if (Array.isArray(result) && result.length > 0) {
          setDemoFunnelEntries(result);
          return result;
        }
      }
    } catch (err) {
      console.warn(
        "[useSocialMedia] getDemoFunnelEntries backend call failed",
        err,
      );
    } finally {
      setIsLoadingFunnel(false);
    }
    return demoFunnelEntries.filter((e) => e.tenantId === tenantId);
  };

  const addDemoFunnelEntry = async (
    entryData: Omit<DemoFunnelEntry, "id" | "createdAt">,
  ): Promise<DemoFunnelEntry> => {
    const newEntry: DemoFunnelEntry = {
      ...entryData,
      id: `df-${Date.now()}`,
      createdAt: Date.now(),
    };
    if (actor) {
      try {
        await actor.addDemoFunnelEntry(newEntry);
      } catch (err) {
        console.warn(
          "[useSocialMedia] addDemoFunnelEntry backend call failed",
          err,
        );
      }
    }
    setDemoFunnelEntries((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const updateDemoFunnelEntry = async (
    id: string,
    updates: Partial<DemoFunnelEntry>,
  ): Promise<void> => {
    setDemoFunnelEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, ...updates, lastActivityAt: Date.now() } : e,
      ),
    );
    if (actor) {
      try {
        await actor.updateDemoFunnelEntry(id, updates);
      } catch (err) {
        console.warn(
          "[useSocialMedia] updateDemoFunnelEntry backend call failed",
          err,
        );
      }
    }
  };

  // ─── Existing Selectors ────────────────────────────────────────────────────

  const getPostsByTenant = (tenantId: string) =>
    socialPosts
      .filter((p) => p.tenantId === tenantId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getCommentsByTenant = (tenantId: string) =>
    socialComments
      .filter((c) => c.tenantId === tenantId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getCommentsByPost = (postId: string) =>
    socialComments
      .filter((c) => c.postId === postId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getAlertsByTenant = (tenantId: string) =>
    socialListeningAlerts
      .filter((a) => a.tenantId === tenantId)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getROIMetricsByTenant = (tenantId: string) =>
    socialROIMetrics.filter((m) => m.tenantId === tenantId);

  const getBrandVoiceProfile = (tenantId: string) =>
    brandVoiceProfiles.find((p) => p.tenantId === tenantId);

  const getPendingCommentsByTenant = (tenantId: string) =>
    socialComments
      .filter((c) => c.tenantId === tenantId && !c.responded)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getCommentsByIntent = (tenantId: string, intent: CommentIntent) =>
    socialComments
      .filter((c) => c.tenantId === tenantId && c.intent === intent)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getActiveAlertsByTenant = (tenantId: string) =>
    socialListeningAlerts
      .filter((a) => a.tenantId === tenantId && !a.dismissed)
      .sort((a, b) => b.createdAt - a.createdAt);

  const getScheduledPostsByTenant = (tenantId: string) =>
    socialPosts
      .filter((p) => p.tenantId === tenantId && p.status === "scheduled")
      .sort((a, b) => (a.scheduledAt ?? 0) - (b.scheduledAt ?? 0));

  const getPublishedPostsByTenant = (tenantId: string) =>
    socialPosts
      .filter((p) => p.tenantId === tenantId && p.status === "published")
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));

  const getDraftPostsByTenant = (tenantId: string) =>
    socialPosts
      .filter((p) => p.tenantId === tenantId && p.status === "draft")
      .sort((a, b) => b.createdAt - a.createdAt);

  return {
    // Existing data
    socialPosts,
    socialComments,
    socialListeningAlerts,
    brandVoiceProfiles,
    socialROIMetrics,
    // New data
    scheduledPosts,
    engagementApprovals,
    competitorReport,
    socialLeads,
    demoFunnelEntries,
    // Loading states
    isLoadingPosts,
    isLoadingComments,
    isLoadingAlerts,
    isLoadingROI,
    isLoadingScheduled,
    isLoadingApprovals,
    isLoadingCompetitor,
    isLoadingLeads,
    isLoadingFunnel,
    // Existing operations
    createPost,
    updatePost,
    deletePost,
    publishPost,
    schedulePost,
    respondToComment,
    markCommentLeadCreated,
    dismissComment,
    dismissAlert,
    upsertBrandVoiceProfile,
    // New operations
    createScheduledPost,
    getScheduledPosts,
    updateScheduledPost,
    getEngagementApprovals,
    approveEngagement,
    rejectEngagement,
    flagEngagement,
    getCompetitorIntelReport,
    refreshCompetitorIntel,
    getSocialLeads,
    createSocialLead,
    linkSocialLeadToCRM,
    getDemoFunnelEntries,
    addDemoFunnelEntry,
    updateDemoFunnelEntry,
    // Existing selectors
    getPostsByTenant,
    getCommentsByTenant,
    getCommentsByPost,
    getAlertsByTenant,
    getROIMetricsByTenant,
    getBrandVoiceProfile,
    getPendingCommentsByTenant,
    getCommentsByIntent,
    getActiveAlertsByTenant,
    getScheduledPostsByTenant,
    getPublishedPostsByTenant,
    getDraftPostsByTenant,
  };
}

// Re-export all types for convenience
export type {
  AlertType,
  BrandVoiceProfile,
  CommentIntent,
  CompetitorIntelReport,
  ContentCadence,
  CtaType,
  DemoFunnelEntry,
  EngagementApproval,
  EngagementApprovalStatus,
  FunnelStage,
  MarketingFramework,
  NicheType,
  PostStatus,
  ScheduledPost,
  SocialComment,
  SocialLead,
  SocialListeningAlert,
  SocialPlatform,
  SocialPost,
  SocialROIMetrics,
};
