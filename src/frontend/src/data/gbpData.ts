// GBP Management — Data Models & Demo Data

// ── Types ─────────────────────────────────────────────────────────────────────

export type GbpPostType = "whats_new" | "event" | "offer";
export type GbpPostStatus = "draft" | "scheduled" | "published";

export interface GbpPost {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  photoUrl?: string;
  postType: GbpPostType;
  status: GbpPostStatus;
  scheduledAt?: number;
  publishedAt?: number;
  createdAt: number;
}

export type GbpQaStatus = "pending" | "replied";

export interface GbpQaItem {
  id: string;
  tenantId: string;
  question: string;
  askedBy: string;
  askedAt: number;
  status: GbpQaStatus;
  reply?: string;
  repliedAt?: number;
}

export type GbpPhotoCategory =
  | "exterior"
  | "interior"
  | "team"
  | "products"
  | "services";

export interface GbpPhoto {
  id: string;
  tenantId: string;
  url: string;
  category: GbpPhotoCategory;
  caption?: string;
  uploadedAt: number;
}

export interface GbpHealthDimension {
  key: string;
  label: string;
  score: number; // 0-100
  status: "good" | "warning" | "critical";
  recommendation: string;
}

export type ChecklistImpact = "High" | "Medium" | "Low";
export type ChecklistCategory =
  | "Profile Setup"
  | "Content Quality"
  | "Engagement"
  | "Local SEO";

export interface GbpChecklistItem {
  id: string;
  tenantId: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  impact: ChecklistImpact;
  completed: boolean;
  linkedGbpTaskId?: string; // link to SeoGeoGbpTask
  fixLabel?: string;
}

export interface GbpSettings {
  tenantId: string;
  accountId: string;
  locationId: string;
  apiKey: string;
  connected: boolean;
  lastSyncAt?: number;
}

// ── Demo Posts ────────────────────────────────────────────────────────────────

export const DEMO_GBP_POSTS: GbpPost[] = [
  {
    id: "post-001",
    tenantId: "tenant-plumbing",
    title: "Spring Drain Cleaning Special — 20% Off",
    body: "Winter can be tough on your pipes. Book our spring drain cleaning service and get 20% off any residential drain job through April 30th. Fast, reliable, and no mess guaranteed.",
    photoUrl:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600",
    postType: "offer",
    status: "published",
    publishedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: "post-002",
    tenantId: "tenant-plumbing",
    title: "Water Heater Rebate Event — April 15–22",
    body: "Join us for our annual Water Heater Efficiency Event. Trade in your old unit and receive up to $150 in rebates on qualifying energy-efficient models. Licensed install included.",
    postType: "event",
    status: "scheduled",
    scheduledAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "post-003",
    tenantId: "tenant-plumbing",
    title: "Now Offering 24/7 Emergency Service",
    body: "Burst pipe at 2 AM? Don't wait. Our licensed plumbers are now on-call 24 hours a day, 7 days a week. One call is all it takes — we'll be there within the hour.",
    postType: "whats_new",
    status: "published",
    publishedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: "post-004",
    tenantId: "tenant-plumbing",
    title: "5-Star Team Spotlight — Meet Marco",
    body: "Say hello to Marco, our senior pipe technician with 12 years of experience. Marco specializes in whole-home repiping and commercial leak detection. Book a free estimate with him today.",
    postType: "whats_new",
    status: "draft",
    createdAt: Date.now() - 30 * 60 * 1000,
  },
];

// ── Demo Q&A ──────────────────────────────────────────────────────────────────

export const DEMO_GBP_QA: GbpQaItem[] = [
  {
    id: "qa-001",
    tenantId: "tenant-plumbing",
    question: "Do you offer free estimates for drain clogs?",
    askedBy: "Jennifer M.",
    askedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: "replied",
    reply:
      "Yes! We offer free over-the-phone estimates for most common drain issues and a free on-site assessment for jobs over $200. Just give us a call or book online.",
    repliedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "qa-002",
    tenantId: "tenant-plumbing",
    question: "What areas do you service in the metro area?",
    askedBy: "David R.",
    askedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: "replied",
    reply:
      "We cover the full metro area including Downtown, Midtown, Eastside, Westlake, and surrounding suburbs within a 25-mile radius. Enter your zip at checkout to confirm coverage.",
    repliedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: "qa-003",
    tenantId: "tenant-plumbing",
    question: "Are your plumbers licensed and insured?",
    askedBy: "Anonymous",
    askedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    status: "pending",
  },
  {
    id: "qa-004",
    tenantId: "tenant-plumbing",
    question: "Do you handle commercial plumbing jobs or only residential?",
    askedBy: "Carla V.",
    askedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: "pending",
  },
  {
    id: "qa-005",
    tenantId: "tenant-plumbing",
    question: "How quickly can you respond to a burst pipe emergency?",
    askedBy: "Tom K.",
    askedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    status: "replied",
    reply:
      "For burst pipe emergencies we typically arrive within 45–60 minutes. We have trucks staged across the service area for rapid response. Call our emergency line directly for fastest dispatch.",
    repliedAt: Date.now() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
  },
];

// ── Demo Photos ───────────────────────────────────────────────────────────────

export const DEMO_GBP_PHOTOS: GbpPhoto[] = [
  {
    id: "photo-001",
    tenantId: "tenant-plumbing",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    category: "exterior",
    caption: "Main office and fleet",
    uploadedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: "photo-002",
    tenantId: "tenant-plumbing",
    url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    category: "services",
    caption: "Pipe replacement in progress",
    uploadedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
  {
    id: "photo-003",
    tenantId: "tenant-plumbing",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
    category: "team",
    caption: "Our licensed technician crew",
    uploadedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: "photo-004",
    tenantId: "tenant-plumbing",
    url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    category: "services",
    caption: "Drain cleaning equipment",
    uploadedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: "photo-005",
    tenantId: "tenant-plumbing",
    url: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400",
    category: "interior",
    caption: "Reception and waiting area",
    uploadedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: "photo-006",
    tenantId: "tenant-plumbing",
    url: "https://images.unsplash.com/photo-1519972064555-542444e71b54?w=400",
    category: "products",
    caption: "Water heater lineup",
    uploadedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "photo-007",
    tenantId: "tenant-plumbing",
    url: "https://images.unsplash.com/photo-1618080584682-6c49bd7a55a4?w=400",
    category: "exterior",
    caption: "Branded service truck",
    uploadedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];

// ── Demo Health Dimensions ────────────────────────────────────────────────────

export const DEMO_GBP_HEALTH_DIMENSIONS: GbpHealthDimension[] = [
  {
    key: "profile_completeness",
    label: "Profile Completeness",
    score: 82,
    status: "good",
    recommendation:
      "Add attributes (wheelchair accessible, LGBTQ+ friendly) to reach 100%.",
  },
  {
    key: "photo_count",
    label: "Photo Count & Quality",
    score: 65,
    status: "warning",
    recommendation:
      "Upload at least 5 more photos. Prioritize team and job-site shots.",
  },
  {
    key: "review_management",
    label: "Review Management",
    score: 78,
    status: "good",
    recommendation:
      "Respond to the 2 unanswered reviews from last week to maintain velocity.",
  },
  {
    key: "qa_freshness",
    label: "Q&A Freshness",
    score: 55,
    status: "warning",
    recommendation:
      "2 questions have been pending for 3+ days. Reply now to signal activity.",
  },
  {
    key: "post_frequency",
    label: "Post Frequency",
    score: 70,
    status: "warning",
    recommendation:
      "Google favors profiles posting at least once per week. You're at every 10 days.",
  },
  {
    key: "category_match",
    label: "Category Match",
    score: 90,
    status: "good",
    recommendation:
      "Primary and secondary categories are well-optimized for your service area.",
  },
];

// ── Demo Checklist ────────────────────────────────────────────────────────────

export const DEMO_GBP_CHECKLIST: GbpChecklistItem[] = [
  // Profile Setup
  {
    id: "chk-001",
    tenantId: "tenant-plumbing",
    category: "Profile Setup",
    title: "Set primary business category",
    description:
      "Your primary category should match your highest-revenue service. It's the #1 ranking signal for local search.",
    impact: "High",
    completed: true,
    linkedGbpTaskId: "gbp-002",
  },
  {
    id: "chk-002",
    tenantId: "tenant-plumbing",
    category: "Profile Setup",
    title: "Write a 200-word keyword-rich business description",
    description:
      "Include your city, top 3 services, and a unique value proposition. Descriptions up to 750 characters appear in knowledge panels.",
    impact: "High",
    completed: true,
    linkedGbpTaskId: "gbp-004",
  },
  {
    id: "chk-003",
    tenantId: "tenant-plumbing",
    category: "Profile Setup",
    title: "Verify all business hours are accurate",
    description:
      "Inaccurate hours cause lost calls and lower trust signals. Include holiday hours when applicable.",
    impact: "Medium",
    completed: true,
    linkedGbpTaskId: "gbp-006",
  },
  {
    id: "chk-004",
    tenantId: "tenant-plumbing",
    category: "Profile Setup",
    title: "Add all service area cities/zip codes",
    description:
      "Service area businesses should list every city they cover. This expands your local pack eligibility.",
    impact: "High",
    completed: false,
    fixLabel: "Add Service Areas",
  },
  // Content Quality
  {
    id: "chk-005",
    tenantId: "tenant-plumbing",
    category: "Content Quality",
    title: "Upload 10+ high-quality business photos",
    description:
      "Profiles with 100+ photos receive 520% more calls and 2,717% more direction requests. Start with 10 diverse images.",
    impact: "High",
    completed: false,
    linkedGbpTaskId: "gbp-001",
    fixLabel: "Go to Photos Tab",
  },
  {
    id: "chk-006",
    tenantId: "tenant-plumbing",
    category: "Content Quality",
    title: "Publish at least one GBP post this week",
    description:
      "Weekly posts keep your profile active, signal engagement to Google, and surface promotional content in local results.",
    impact: "Medium",
    completed: false,
    linkedGbpTaskId: "gbp-005",
    fixLabel: "Create a Post",
  },
  {
    id: "chk-007",
    tenantId: "tenant-plumbing",
    category: "Content Quality",
    title: "Add all services with individual descriptions",
    description:
      "Each service should have a title, description, and optional price range. This populates your services menu and Q&A answers.",
    impact: "High",
    completed: false,
    fixLabel: "Add Services",
  },
  // Engagement
  {
    id: "chk-008",
    tenantId: "tenant-plumbing",
    category: "Engagement",
    title: "Reply to all open customer questions",
    description:
      "Unanswered questions make you look unresponsive. Google rewards profiles with active Q&A participation.",
    impact: "High",
    completed: false,
    linkedGbpTaskId: "gbp-003",
    fixLabel: "Reply to Q&A",
  },
  {
    id: "chk-009",
    tenantId: "tenant-plumbing",
    category: "Engagement",
    title: "Respond to every review within 24 hours",
    description:
      "Review response rate is a direct ranking signal. Even a simple 'thank you' reply counts.",
    impact: "High",
    completed: false,
    fixLabel: "View Reviews",
  },
  {
    id: "chk-010",
    tenantId: "tenant-plumbing",
    category: "Engagement",
    title: "Enable Google Messages for instant chat",
    description:
      "Businesses with messaging enabled see 30% higher click-through rates from mobile map packs.",
    impact: "Medium",
    completed: false,
    fixLabel: "Enable Messaging",
  },
  // Local SEO
  {
    id: "chk-011",
    tenantId: "tenant-plumbing",
    category: "Local SEO",
    title: "Ensure NAP is 100% consistent across directories",
    description:
      "Name, Address, Phone must match exactly on Yelp, Facebook, and any citation site. Inconsistencies hurt local rankings.",
    impact: "High",
    completed: false,
    fixLabel: "Check Listings",
  },
  {
    id: "chk-012",
    tenantId: "tenant-plumbing",
    category: "Local SEO",
    title: "Add 5 seeded Q&A entries with keyword-rich answers",
    description:
      "You can ask and answer your own questions. Seed 5 common questions with keyword-optimized answers to own valuable Q&A real estate.",
    impact: "Medium",
    completed: false,
    linkedGbpTaskId: "gbp-003",
    fixLabel: "Seed Q&A",
  },
];

// ── Demo Settings ─────────────────────────────────────────────────────────────

export const DEMO_GBP_SETTINGS: GbpSettings = {
  tenantId: "tenant-plumbing",
  accountId: "",
  locationId: "",
  apiKey: "",
  connected: false,
  lastSyncAt: undefined,
};
