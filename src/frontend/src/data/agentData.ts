export interface AgentProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  defaultPrice: number;
  category: "seo" | "ads" | "website" | "bundle" | "oversight";
  features: string[];
  isBundle?: boolean;
  bundleProductIds?: string[];
  allowsOversight: boolean;
  icon: string;
  accentColor: string;
  upsellPriority: number;
  nicheEnabled: string[];
  visible: boolean;
}

export interface AgentSubscription {
  id: string;
  tenantId: string;
  productId: string;
  status: "active" | "paused" | "cancelled" | "pending";
  activatedAt: number;
  pricingOverride?: number;
  hasOversight: boolean;
  notes: string;
  nextDeliverable: string;
  currentWork: string;
}

export interface AgentTask {
  id: string;
  tenantId: string;
  productId: string;
  subscriptionId: string;
  title: string;
  description: string;
  type:
    | "seo-fix"
    | "content-update"
    | "landing-page"
    | "ads-update"
    | "website-edit"
    | "gbp-task"
    | "report"
    | "review"
    | "other";
  status: "pending" | "in_progress" | "waiting" | "complete";
  priority: "high" | "medium" | "low";
  assignee: string;
  dueDate: string;
  createdAt: number;
  completedAt?: number;
  notes: string;
  isClientRequest: boolean;
}

export interface AgentDeliverable {
  id: string;
  tenantId: string;
  productId: string;
  month: string;
  title: string;
  description: string;
  type: "content" | "optimization" | "report" | "campaign" | "page" | "audit";
  completedAt: number;
}

export interface AgentServiceRequest {
  id: string;
  tenantId: string;
  productId: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDatePreference: string;
  submittedAt: number;
  status: "submitted" | "in_review" | "in_progress" | "complete";
}

export interface AgentPerformanceSnapshot {
  tenantId: string;
  productId: string;
  month: string;
  seoScoreChange?: number;
  leadChange?: number;
  conversionChange?: number;
  adsSpend?: number;
  adsImpressions?: number;
  adsClicks?: number;
  websitePagesUpdated?: number;
  summary: string;
}

const ALL_NICHES = [
  "Plumbing",
  "Med Spa",
  "HVAC",
  "Restoration",
  "Carpet Cleaning",
  "Roofing",
  "General",
  "Demo",
];

export const AGENT_PRODUCTS: AgentProduct[] = [
  {
    id: "agent-seo",
    name: "SEO & GEO Agent",
    tagline:
      "Optimize your visibility across Google and AI discovery surfaces.",
    description:
      "A managed AI-powered SEO and generative search visibility service that monitors, optimizes, and reports on your local search presence continuously.",
    defaultPrice: 999,
    category: "seo",
    features: [
      "Technical SEO monitoring",
      "Local SEO tasking",
      "Google Business Profile workflow",
      "Keyword & service-area strategy",
      "Backlink / citation task queue",
      "GEO / AI visibility support",
      "Conversion optimization suggestions",
      "Monthly reporting",
    ],
    allowsOversight: true,
    icon: "Search",
    accentColor: "emerald",
    upsellPriority: 1,
    nicheEnabled: ALL_NICHES,
    visible: true,
  },
  {
    id: "agent-ads",
    name: "Paid Ads Agent",
    tagline: "Launch and improve ads without the usual guesswork.",
    description:
      "A managed AI-powered ads service that handles campaign strategy, ad copy, audience targeting, and ongoing optimization across paid channels.",
    defaultPrice: 1999,
    category: "ads",
    features: [
      "Campaign strategy & setup",
      "Ad copy generation",
      "Audience targeting suggestions",
      "Budget allocation tracking",
      "Optimization recommendations",
      "Landing page alignment",
      "Performance reporting",
      "Task queue for updates",
    ],
    allowsOversight: true,
    icon: "Megaphone",
    accentColor: "purple",
    upsellPriority: 2,
    nicheEnabled: ALL_NICHES,
    visible: true,
  },
  {
    id: "agent-website",
    name: "Website Agent",
    tagline: "Keep your site updated, conversion-focused, and growth-ready.",
    description:
      "A managed AI-powered website growth service handling content edits, landing pages, CRO improvements, and ongoing maintenance.",
    defaultPrice: 399,
    category: "website",
    features: [
      "Content edits & copy refreshes",
      "Homepage & service page updates",
      "Landing page creation requests",
      "CRO suggestions & CTA improvements",
      "Widget & form management",
      "Maintenance & improvement queue",
    ],
    allowsOversight: false,
    icon: "Globe",
    accentColor: "blue",
    upsellPriority: 3,
    nicheEnabled: ALL_NICHES,
    visible: true,
  },
  {
    id: "agent-bundle",
    name: "SEO + Paid Ads Bundle",
    tagline: "Full search and ads coverage — bundled for better value.",
    description:
      "Both the SEO & GEO Agent and Paid Ads Agent combined at a discounted rate. Save $400 per month compared to purchasing separately.",
    defaultPrice: 2598,
    category: "bundle",
    isBundle: true,
    bundleProductIds: ["agent-seo", "agent-ads"],
    features: [
      "Technical SEO monitoring",
      "Local SEO tasking",
      "Google Business Profile workflow",
      "Keyword & service-area strategy",
      "GEO / AI visibility support",
      "Campaign strategy & setup",
      "Ad copy generation",
      "Audience targeting suggestions",
      "Budget allocation tracking",
      "Optimization recommendations",
      "Monthly reporting",
    ],
    allowsOversight: true,
    icon: "Package",
    accentColor: "amber",
    upsellPriority: 0,
    nicheEnabled: ALL_NICHES,
    visible: true,
  },
  {
    id: "agent-oversight",
    name: "Human Oversight Upgrade",
    tagline: "Add human oversight for strategy review and priority support.",
    description:
      "An add-on that attaches to any agent service. Adds dedicated strategist review, human QA, priority support, and guided execution.",
    defaultPrice: 299,
    category: "oversight",
    features: [
      "Dedicated strategist review",
      "Human QA on all deliverables",
      "Priority support access",
      "Guided execution & check-ins",
    ],
    allowsOversight: false,
    icon: "Users",
    accentColor: "rose",
    upsellPriority: 4,
    nicheEnabled: ALL_NICHES,
    visible: true,
  },
];

export const DEMO_AGENT_SUBSCRIPTIONS: AgentSubscription[] = [
  {
    id: "sub-plumb-seo",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    status: "active",
    activatedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    hasOversight: false,
    notes: "Client requested focus on emergency plumbing keywords.",
    nextDeliverable: "April keyword performance report",
    currentWork: "Optimizing Google Business Profile categories and photos",
  },
  {
    id: "sub-plumb-web",
    tenantId: "tenant-plumbing",
    productId: "agent-website",
    status: "active",
    activatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    hasOversight: false,
    notes: "",
    nextDeliverable: "Service page copy refresh for water heater installation",
    currentWork: "Adding CTA buttons to top 3 service pages",
  },
  {
    id: "sub-medspa-bundle",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    status: "active",
    activatedAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    hasOversight: true,
    notes: "Premium client — monthly strategy call scheduled.",
    nextDeliverable: "Q2 paid ads campaign launch for Botox promotions",
    currentWork: "Building out retargeting audiences and seasonal ad creative",
  },
  {
    id: "sub-ocean-seo",
    tenantId: "tenant-oceanside",
    productId: "agent-seo",
    status: "pending",
    activatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    hasOversight: false,
    notes: "Awaiting onboarding call.",
    nextDeliverable: "Initial SEO audit and keyword map",
    currentWork: "Pending activation",
  },
  {
    id: "sub-demo-seo",
    tenantId: "tenant-demo",
    productId: "agent-seo",
    status: "active",
    activatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    hasOversight: false,
    notes: "",
    nextDeliverable: "Monthly visibility report",
    currentWork: "Local citation cleanup and GBP optimization",
  },
  {
    id: "sub-demo-ads",
    tenantId: "tenant-demo",
    productId: "agent-ads",
    status: "active",
    activatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    hasOversight: false,
    notes: "",
    nextDeliverable: "Spring campaign creative review",
    currentWork: "A/B testing two headline variants for service area ads",
  },
];

export const DEMO_AGENT_TASKS: AgentTask[] = [
  {
    id: "task-001",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    subscriptionId: "sub-plumb-seo",
    title: "Optimize Google Business Profile hours and categories",
    description:
      "Update GBP categories to include emergency plumbing services and verify holiday hours are correct.",
    type: "gbp-task",
    status: "in_progress",
    priority: "high",
    assignee: "Sarah M.",
    dueDate: "2026-04-10",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    notes: "Client confirmed they handle 24/7 emergency calls.",
    isClientRequest: false,
  },
  {
    id: "task-002",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    subscriptionId: "sub-plumb-seo",
    title: "Build 5 new local citations on directory sites",
    description:
      "Submit business info to Angi, HomeAdvisor, Thumbtack, Houzz, and YellowPages.",
    type: "seo-fix",
    status: "pending",
    priority: "medium",
    assignee: "Jake R.",
    dueDate: "2026-04-15",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    notes: "",
    isClientRequest: false,
  },
  {
    id: "task-003",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    subscriptionId: "sub-plumb-seo",
    title: "Fix broken internal links on service pages",
    description:
      "Audit and repair 3 broken links found in latest crawl report.",
    type: "seo-fix",
    status: "complete",
    priority: "high",
    assignee: "Sarah M.",
    dueDate: "2026-03-28",
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    notes: "All 3 links corrected and verified.",
    isClientRequest: false,
  },
  {
    id: "task-004",
    tenantId: "tenant-plumbing",
    productId: "agent-website",
    subscriptionId: "sub-plumb-web",
    title: "Add prominent CTA to homepage hero section",
    description:
      'Update hero copy and add a "Get Free Estimate" button that routes to the contact form.',
    type: "website-edit",
    status: "in_progress",
    priority: "high",
    assignee: "Team",
    dueDate: "2026-04-08",
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    notes: "Awaiting client approval on button color.",
    isClientRequest: true,
  },
  {
    id: "task-005",
    tenantId: "tenant-plumbing",
    productId: "agent-website",
    subscriptionId: "sub-plumb-web",
    title: "Write updated copy for water heater service page",
    description:
      "Refresh service page copy with current pricing information and updated trust signals.",
    type: "content-update",
    status: "pending",
    priority: "medium",
    assignee: "Jake R.",
    dueDate: "2026-04-20",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    notes: "",
    isClientRequest: false,
  },
  {
    id: "task-006",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    subscriptionId: "sub-medspa-bundle",
    title: "Launch Google Ads campaign for spring Botox promo",
    description:
      "Create and launch PPC campaign targeting women 30-55 within 15 miles for April Botox special.",
    type: "ads-update",
    status: "in_progress",
    priority: "high",
    assignee: "Sarah M.",
    dueDate: "2026-04-07",
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    notes: "Budget set at $1,500 for April. Creative approved.",
    isClientRequest: false,
  },
  {
    id: "task-007",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    subscriptionId: "sub-medspa-bundle",
    title: "Optimize top 5 service pages for GEO visibility",
    description:
      "Add structured FAQ sections to Botox, filler, and laser treatment pages to improve AI search results.",
    type: "seo-fix",
    status: "pending",
    priority: "medium",
    assignee: "Jake R.",
    dueDate: "2026-04-18",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    notes: "",
    isClientRequest: false,
  },
  {
    id: "task-008",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    subscriptionId: "sub-medspa-bundle",
    title: "Write 3 ad variations for hydrafacial service",
    description:
      "Create A/B testing variants for hydrafacial campaign targeting new patients.",
    type: "ads-update",
    status: "complete",
    priority: "medium",
    assignee: "Sarah M.",
    dueDate: "2026-03-30",
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    notes: "3 variants created. Variant B showing 18% higher CTR.",
    isClientRequest: false,
  },
  {
    id: "task-009",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    subscriptionId: "sub-medspa-bundle",
    title: "March keyword ranking report",
    description:
      "Compile and deliver monthly keyword performance and ranking changes report.",
    type: "report",
    status: "complete",
    priority: "low",
    assignee: "Team",
    dueDate: "2026-04-01",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    notes: 'Delivered via email. +7 positions for "botox near me".',
    isClientRequest: false,
  },
  {
    id: "task-010",
    tenantId: "tenant-demo",
    productId: "agent-seo",
    subscriptionId: "sub-demo-seo",
    title: "Initial local citation audit",
    description:
      "Identify and document all existing citations and NAP inconsistencies.",
    type: "seo-fix",
    status: "complete",
    priority: "high",
    assignee: "Sarah M.",
    dueDate: "2026-03-25",
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    notes: "Found 12 inconsistent citations. Cleanup underway.",
    isClientRequest: false,
  },
  {
    id: "task-011",
    tenantId: "tenant-demo",
    productId: "agent-seo",
    subscriptionId: "sub-demo-seo",
    title: "Fix NAP inconsistencies across 12 directories",
    description:
      "Correct business name, address, and phone number across all identified directories.",
    type: "seo-fix",
    status: "in_progress",
    priority: "high",
    assignee: "Jake R.",
    dueDate: "2026-04-12",
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    notes: "7 of 12 corrected so far.",
    isClientRequest: false,
  },
  {
    id: "task-012",
    tenantId: "tenant-demo",
    productId: "agent-ads",
    subscriptionId: "sub-demo-ads",
    title: "Set up initial Google Ads account structure",
    description:
      "Create campaigns, ad groups, and keyword sets for primary service areas.",
    type: "ads-update",
    status: "complete",
    priority: "high",
    assignee: "Sarah M.",
    dueDate: "2026-03-22",
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    completedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    notes: "Account live. 3 campaigns, 9 ad groups.",
    isClientRequest: false,
  },
  {
    id: "task-013",
    tenantId: "tenant-demo",
    productId: "agent-ads",
    subscriptionId: "sub-demo-ads",
    title: "A/B test two headline variants",
    description:
      "Run split test on headline copy emphasizing speed vs. pricing.",
    type: "ads-update",
    status: "in_progress",
    priority: "medium",
    assignee: "Jake R.",
    dueDate: "2026-04-14",
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    notes:
      "Both variants live. Need 200 more impressions for statistical significance.",
    isClientRequest: false,
  },
  {
    id: "task-014",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    subscriptionId: "sub-plumb-seo",
    title: "Create landing page for sewer line repair",
    description:
      "Build dedicated service page targeting sewer line repair keywords in service area.",
    type: "landing-page",
    status: "waiting",
    priority: "medium",
    assignee: "Team",
    dueDate: "2026-04-25",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    notes: "Waiting on client to provide service area zip codes.",
    isClientRequest: true,
  },
  {
    id: "task-015",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    subscriptionId: "sub-medspa-bundle",
    title: "Monthly strategy review call",
    description:
      "Human oversight monthly check-in to review performance and adjust strategy.",
    type: "review",
    status: "pending",
    priority: "low",
    assignee: "Sarah M.",
    dueDate: "2026-04-15",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    notes: "",
    isClientRequest: false,
  },
];

export const DEMO_AGENT_DELIVERABLES: AgentDeliverable[] = [
  {
    id: "del-001",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    month: "2026-01",
    title: "January SEO Performance Report",
    description:
      "Keyword rankings, traffic trends, and GBP insights for January.",
    type: "report",
    completedAt: new Date("2026-02-01").getTime(),
  },
  {
    id: "del-002",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    month: "2026-01",
    title: "8 New Local Citations Built",
    description:
      "Submitted and verified business info across 8 high-authority local directories.",
    type: "optimization",
    completedAt: new Date("2026-01-20").getTime(),
  },
  {
    id: "del-003",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    month: "2026-02",
    title: "February SEO Performance Report",
    description:
      'Rankings improved +4 positions for "emergency plumber" in primary service area.',
    type: "report",
    completedAt: new Date("2026-03-01").getTime(),
  },
  {
    id: "del-004",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    month: "2026-02",
    title: "GBP Photo & Category Optimization",
    description:
      "Updated 12 GBP photos, added 3 service categories, enabled Q&A responses.",
    type: "optimization",
    completedAt: new Date("2026-02-15").getTime(),
  },
  {
    id: "del-005",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    month: "2026-03",
    title: "March SEO Performance Report",
    description:
      "Top 3 positions for 6 target keywords. Organic traffic up 22% MoM.",
    type: "report",
    completedAt: new Date("2026-04-01").getTime(),
  },
  {
    id: "del-006",
    tenantId: "tenant-plumbing",
    productId: "agent-website",
    month: "2026-03",
    title: "Homepage Hero Section Redesign Copy",
    description:
      "Rewrote hero section copy with urgency-focused messaging and clearer service offer.",
    type: "content",
    completedAt: new Date("2026-03-18").getTime(),
  },
  {
    id: "del-007",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-02",
    title: "February Paid Ads Performance Report",
    description:
      "Google Ads: 4,200 impressions, 312 clicks, 18 consultation bookings. ROAS 4.2x.",
    type: "report",
    completedAt: new Date("2026-03-01").getTime(),
  },
  {
    id: "del-008",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-02",
    title: "Botox Landing Page Created",
    description:
      "Built high-converting Botox treatment landing page with before/after section and booking CTA.",
    type: "page",
    completedAt: new Date("2026-02-20").getTime(),
  },
  {
    id: "del-009",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-03",
    title: "March SEO & Ads Combined Report",
    description:
      "Organic traffic +31% YoY. Paid ads: $1,800 spend, 28 new patient consultations.",
    type: "report",
    completedAt: new Date("2026-04-01").getTime(),
  },
  {
    id: "del-010",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-03",
    title: "Spring Campaign Launch — Facial Treatments",
    description:
      "Launched 2-week spring promo campaign across Google and Facebook Ads.",
    type: "campaign",
    completedAt: new Date("2026-03-22").getTime(),
  },
  {
    id: "del-011",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-03",
    title: "Technical SEO Audit",
    description:
      "Full site crawl, Core Web Vitals analysis, and 14-point remediation checklist.",
    type: "audit",
    completedAt: new Date("2026-03-10").getTime(),
  },
  {
    id: "del-012",
    tenantId: "tenant-demo",
    productId: "agent-seo",
    month: "2026-03",
    title: "Initial SEO Audit Report",
    description:
      "Baseline audit covering technical health, citation status, and keyword opportunity analysis.",
    type: "audit",
    completedAt: new Date("2026-03-28").getTime(),
  },
  {
    id: "del-013",
    tenantId: "tenant-demo",
    productId: "agent-ads",
    month: "2026-03",
    title: "Google Ads Account Setup",
    description:
      "Full account structure built: 3 campaigns, 9 ad groups, 47 keywords, conversion tracking live.",
    type: "campaign",
    completedAt: new Date("2026-03-22").getTime(),
  },
  {
    id: "del-014",
    tenantId: "tenant-plumbing",
    productId: "agent-website",
    month: "2026-03",
    title: "Service Page CTA Improvements",
    description:
      "Added click-to-call buttons and form CTAs to 4 service pages.",
    type: "optimization",
    completedAt: new Date("2026-03-25").getTime(),
  },
  {
    id: "del-015",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-01",
    title: "January Strategy & Onboarding",
    description:
      "Completed onboarding, set KPIs, and built initial 90-day roadmap.",
    type: "report",
    completedAt: new Date("2026-01-31").getTime(),
  },
];

export const DEMO_AGENT_REQUESTS: AgentServiceRequest[] = [
  {
    id: "req-001",
    tenantId: "tenant-plumbing",
    productId: "agent-website",
    title: "Build landing page for sewer line services",
    description:
      "We need a dedicated page for sewer line repair and replacement targeting the north county area.",
    priority: "high",
    dueDatePreference: "2026-04-25",
    submittedAt: Date.now() - 24 * 60 * 60 * 1000,
    status: "in_review",
  },
  {
    id: "req-002",
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    title: "Optimize Google Business Profile for spring season",
    description:
      "Update GBP photos, add spring service posts, and refresh the description.",
    priority: "medium",
    dueDatePreference: "2026-04-15",
    submittedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: "in_progress",
  },
  {
    id: "req-003",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    title: "Create Mother's Day gift card promotion campaign",
    description:
      "Launch a gift card promotion for Mother's Day. Need ads, landing page, and email copy.",
    priority: "high",
    dueDatePreference: "2026-04-30",
    submittedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: "submitted",
  },
  {
    id: "req-004",
    tenantId: "tenant-demo",
    productId: "agent-seo",
    title: "Add service area pages for 3 new zip codes",
    description:
      "We recently expanded to 3 new service areas and need optimized landing pages for each.",
    priority: "medium",
    dueDatePreference: "2026-04-20",
    submittedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: "in_review",
  },
  {
    id: "req-005",
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    title: "Refresh homepage copy and hero imagery",
    description:
      "Current homepage feels outdated. Need new copy and updated hero section for the new brand direction.",
    priority: "low",
    dueDatePreference: "2026-05-10",
    submittedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    status: "submitted",
  },
];

export const DEMO_AGENT_PERFORMANCE: AgentPerformanceSnapshot[] = [
  {
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    month: "2026-03",
    seoScoreChange: 4,
    leadChange: 3,
    conversionChange: 1,
    summary:
      "Solid month for local visibility. Emergency plumbing keywords climbed into top 3 positions. GBP views up 28%.",
  },
  {
    tenantId: "tenant-plumbing",
    productId: "agent-seo",
    month: "2026-02",
    seoScoreChange: 2,
    leadChange: 1,
    conversionChange: 0,
    summary:
      "Citation cleanup completed. Technical fixes applied. Gradual ranking improvement expected to accelerate.",
  },
  {
    tenantId: "tenant-plumbing",
    productId: "agent-website",
    month: "2026-03",
    websitePagesUpdated: 4,
    conversionChange: 2,
    summary:
      "Homepage CTA improvements led to a measurable uptick in form submissions. 4 service pages updated.",
  },
  {
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-03",
    seoScoreChange: 5,
    leadChange: 7,
    conversionChange: 2,
    adsSpend: 1800,
    adsImpressions: 5200,
    adsClicks: 387,
    summary:
      "Best month to date. Spring campaign drove 28 new consultation bookings. Organic traffic up 31% YoY.",
  },
  {
    tenantId: "tenant-medspa",
    productId: "agent-bundle",
    month: "2026-02",
    seoScoreChange: 3,
    leadChange: 4,
    conversionChange: 1,
    adsSpend: 1500,
    adsImpressions: 4200,
    adsClicks: 312,
    summary:
      "Steady growth. New Botox landing page live and driving qualified traffic. ROAS at 4.2x.",
  },
  {
    tenantId: "tenant-demo",
    productId: "agent-seo",
    month: "2026-03",
    seoScoreChange: 2,
    leadChange: 2,
    summary:
      "Initial baseline established. Citation cleanup 60% complete. Early ranking signals positive.",
  },
  {
    tenantId: "tenant-demo",
    productId: "agent-ads",
    month: "2026-03",
    leadChange: 5,
    adsSpend: 800,
    adsImpressions: 2100,
    adsClicks: 143,
    summary:
      "First full month live. Account structure complete. Early data shows $5.59 cost per click.",
  },
];
