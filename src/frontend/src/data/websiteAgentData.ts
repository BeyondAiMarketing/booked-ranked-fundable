// Website Agent — demo data

export interface PageUpdateItem {
  id: string;
  pageTitle: string;
  pageUrl: string;
  updateType:
    | "copy"
    | "cta"
    | "structure"
    | "form"
    | "media"
    | "new-page"
    | "seo"
    | "trust";
  status:
    | "pending"
    | "in_review"
    | "in_progress"
    | "complete"
    | "waiting_client";
  priority: "high" | "medium" | "low";
  description: string;
  requestedBy: "admin" | "client";
  dueDate: string;
  completedAt?: number;
  notes: string;
}

export interface CroOpportunity {
  id: string;
  title: string;
  pageUrl: string;
  pageTitle: string;
  category:
    | "cta"
    | "headline"
    | "trust"
    | "form"
    | "layout"
    | "speed"
    | "content";
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  estimatedLift: string;
  recommendation: string;
  status: "open" | "in_progress" | "in_review" | "complete";
}

export interface ContentBrief {
  id: string;
  title: string;
  pageType: "service" | "landing" | "blog" | "homepage" | "about" | "faq";
  status: "draft" | "in_review" | "approved" | "published";
  targetKeyword: string;
  wordCount: number;
  outline: string[];
  notes: string;
  createdAt: number;
}

export interface WebsiteHealthSnapshot {
  overallScore: number;
  conversionReadiness: number;
  contentFreshness: number;
  ctaStrength: number;
  mobileExperience: number;
  trustSignals: number;
  pendingUpdates: number;
  completedThisMonth: number;
  pagesOptimized: number;
}

export const DEMO_PAGE_UPDATES: PageUpdateItem[] = [
  {
    id: "wu-001",
    pageTitle: "Homepage",
    pageUrl: "/",
    updateType: "cta",
    status: "in_progress",
    priority: "high",
    description:
      "Add sticky header with click-to-call button on mobile. Update hero CTA copy to be more urgency-focused.",
    requestedBy: "admin",
    dueDate: "2026-04-10",
    notes: "Client approved design direction. In development.",
  },
  {
    id: "wu-002",
    pageTitle: "Emergency Plumbing Services",
    pageUrl: "/services/emergency",
    updateType: "copy",
    status: "pending",
    priority: "high",
    description:
      'Refresh service page copy with updated pricing, trust badges, and a clearer process section ("How it works").',
    requestedBy: "admin",
    dueDate: "2026-04-15",
    notes: "",
  },
  {
    id: "wu-003",
    pageTitle: "Water Heater Installation",
    pageUrl: "/services/water-heater",
    updateType: "copy",
    status: "complete",
    priority: "medium",
    description:
      "Updated service description, added FAQ section, added internal links to emergency page.",
    requestedBy: "admin",
    dueDate: "2026-03-28",
    completedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    notes: "Published and indexed.",
  },
  {
    id: "wu-004",
    pageTitle: "Contact Page",
    pageUrl: "/contact",
    updateType: "form",
    status: "in_review",
    priority: "high",
    description:
      "Simplify contact form from 8 fields to 4. Add inline validation. Move form above the fold on mobile.",
    requestedBy: "admin",
    dueDate: "2026-04-12",
    notes: "Form mockup sent to client for review.",
  },
  {
    id: "wu-005",
    pageTitle: "About Us Page",
    pageUrl: "/about",
    updateType: "copy",
    status: "pending",
    priority: "medium",
    description:
      "Add owner photo, team bios, license numbers, years in business, and Google review widget.",
    requestedBy: "admin",
    dueDate: "2026-04-22",
    notes: "Waiting on client photo and bio content.",
  },
  {
    id: "wu-006",
    pageTitle: "Sewer Line Repair",
    pageUrl: "/services/sewer-line",
    updateType: "new-page",
    status: "in_progress",
    priority: "high",
    description:
      "Build dedicated landing page for sewer line repair targeting high-value keywords.",
    requestedBy: "client",
    dueDate: "2026-04-25",
    notes: "Client submitted via request queue. Brief approved.",
  },
  {
    id: "wu-007",
    pageTitle: "Pricing Page",
    pageUrl: "/pricing",
    updateType: "structure",
    status: "waiting_client",
    priority: "medium",
    description:
      "Create transparent pricing page with service ranges. Builds trust and qualifies leads.",
    requestedBy: "admin",
    dueDate: "2026-05-01",
    notes: "Waiting on client to confirm pricing tiers.",
  },
  {
    id: "wu-008",
    pageTitle: "Drain Cleaning",
    pageUrl: "/services/drain-cleaning",
    updateType: "seo",
    status: "complete",
    priority: "medium",
    description:
      "Added target keyword in H1, meta description, and added 3 internal links.",
    requestedBy: "admin",
    dueDate: "2026-03-20",
    completedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    notes: "Page re-indexed. Ranking improved +3 positions.",
  },
];

export const DEMO_CRO_OPPORTUNITIES: CroOpportunity[] = [
  {
    id: "cro-001",
    title: "No phone number visible above the fold on mobile",
    pageUrl: "/",
    pageTitle: "Homepage",
    category: "cta",
    description:
      "On mobile, the primary phone number is buried below two scroll lengths. Emergency service seekers leave before finding it.",
    impact: "high",
    effort: "low",
    estimatedLift: "+15-25% mobile calls",
    recommendation:
      "Add sticky header with click-to-call button. Should be visible immediately on load.",
    status: "in_progress",
  },
  {
    id: "cro-002",
    title: "Contact form has too many required fields",
    pageUrl: "/contact",
    pageTitle: "Contact Page",
    category: "form",
    description:
      "8-field contact form with no smart defaults. Every additional required field reduces completion by ~10%.",
    impact: "high",
    effort: "low",
    estimatedLift: "+20-35% form completions",
    recommendation:
      "Reduce to 4 core fields (name, phone, service, message). Move form above the fold.",
    status: "in_review",
  },
  {
    id: "cro-003",
    title: "No social proof on service pages",
    pageUrl: "/services/*",
    pageTitle: "All Service Pages",
    category: "trust",
    description:
      "Service pages lack reviews, star ratings, or testimonials. Visitors who reach a service page are high-intent but have no trust signal to convert.",
    impact: "high",
    effort: "medium",
    estimatedLift: "+10-20% service page conversions",
    recommendation:
      "Add a Google review snippet and 2-3 short testimonials to each major service page.",
    status: "open",
  },
  {
    id: "cro-004",
    title: "Hero headline is generic — does not communicate differentiation",
    pageUrl: "/",
    pageTitle: "Homepage",
    category: "headline",
    description:
      'Current hero says "Professional Plumbing Services." Does not address the customer\'s urgency, location, or unique benefit.',
    impact: "medium",
    effort: "low",
    estimatedLift: "+8-15% hero engagement",
    recommendation:
      'Rewrite to lead with urgency + specificity: e.g., "Fast Emergency Plumbing in [City] — On-Site in 60 Minutes."',
    status: "open",
  },
  {
    id: "cro-005",
    title: "Pricing page does not exist",
    pageUrl: "/pricing",
    pageTitle: "(Missing)",
    category: "content",
    description:
      "No pricing page increases price uncertainty anxiety and drives prospects to request quotes from competitors who are transparent.",
    impact: "medium",
    effort: "medium",
    estimatedLift: "+5-12% overall lead quality",
    recommendation:
      'Create a pricing guide page with service ranges and a clear "Get Exact Quote" CTA.',
    status: "open",
  },
  {
    id: "cro-006",
    title: "About page lacks personal connection",
    pageUrl: "/about",
    pageTitle: "About Us",
    category: "trust",
    description:
      "Generic about page with no owner photo, no origin story, no license numbers. Credibility signals matter for in-home service businesses.",
    impact: "medium",
    effort: "low",
    estimatedLift: "+5-10% trust-driven conversions",
    recommendation:
      "Add owner headshot, business founding story, license/insurance badges, and years of experience.",
    status: "open",
  },
];

export const DEMO_CONTENT_BRIEFS: ContentBrief[] = [
  {
    id: "cb-001",
    title: "Sewer Line Repair & Replacement — Dedicated Service Page",
    pageType: "service",
    status: "in_review",
    targetKeyword: "sewer line repair [city]",
    wordCount: 1200,
    outline: [
      "What is sewer line repair / when do you need it",
      "Our sewer line services (repair, replacement, inspection)",
      "Signs of a damaged sewer line",
      "Our process (how it works)",
      "Cost and transparent pricing guide",
      "FAQ section (5+ questions)",
      "CTA: Get Free Inspection",
    ],
    notes:
      "Client submitted this as a request. High-priority keyword opportunity.",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "cb-002",
    title: "Water Heater Replacement Cost Guide",
    pageType: "landing",
    status: "approved",
    targetKeyword: "water heater replacement cost",
    wordCount: 1500,
    outline: [
      "Average cost of water heater replacement",
      "Types of water heaters and price comparison",
      "Factors that affect installation cost",
      "Should you repair or replace?",
      "How to get the best price",
      "CTA: Get a Free Quote Today",
    ],
    notes: "High search volume keyword. Commercial intent.",
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: "cb-003",
    title: "Emergency Plumbing FAQ",
    pageType: "faq",
    status: "published",
    targetKeyword: "emergency plumbing FAQ",
    wordCount: 800,
    outline: [
      "What counts as a plumbing emergency?",
      "How fast can you get here?",
      "Do you charge extra for after-hours calls?",
      "What should I do while waiting?",
      "How do I shut off my main water supply?",
      "Are you licensed and insured?",
    ],
    notes: "Published. Driving GEO visibility for FAQ-type searches.",
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
  },
  {
    id: "cb-004",
    title: "Drain Cleaning Service Page Refresh",
    pageType: "service",
    status: "published",
    targetKeyword: "drain cleaning [city]",
    wordCount: 950,
    outline: [
      "Types of drain cleaning we offer",
      "Signs you need drain cleaning",
      "Our drain cleaning process",
      "Pricing (from $89)",
      "Why choose us",
      "Book online or call",
    ],
    notes: "Published. Ranking improved +3 positions post-optimization.",
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
  },
];

export const DEMO_WEBSITE_HEALTH: WebsiteHealthSnapshot = {
  overallScore: 68,
  conversionReadiness: 62,
  contentFreshness: 74,
  ctaStrength: 58,
  mobileExperience: 71,
  trustSignals: 65,
  pendingUpdates: 5,
  completedThisMonth: 3,
  pagesOptimized: 8,
};

// ---- Scorecard ----
export interface WebsiteScoreFactor {
  name: string;
  score: number;
  note: string;
}

export interface WebsiteScorecard {
  tenantId: string;
  conversionReadinessScore: number;
  previousConversionReadinessScore: number;
  contentQualityScore: number;
  previousContentQualityScore: number;
  technicalHealthScore: number;
  previousTechnicalHealthScore: number;
  trustAuthorityScore: number;
  previousTrustAuthorityScore: number;
  conversionReadinessFactors: WebsiteScoreFactor[];
  contentQualityFactors: WebsiteScoreFactor[];
  technicalHealthFactors: WebsiteScoreFactor[];
  trustAuthorityFactors: WebsiteScoreFactor[];
}

// ---- Issues ----
export interface WebsiteIssue {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category:
    | "conversion"
    | "content"
    | "technical"
    | "trust"
    | "mobile"
    | "speed";
  status: "open" | "in_progress" | "resolved";
  area: string;
  pageUrl?: string;
  suggestedFix: string;
  owner?: string;
  dueDate?: string;
}

// ---- Performance History ----
export interface WebsitePerformanceMonth {
  tenantId: string;
  month: string;
  pagesOptimized: number;
  updatesCompleted: number;
  conversionReadinessScore: number;
  contentQualityScore: number;
  technicalHealthScore: number;
  trustAuthorityScore: number;
  estimatedConversionLift: string;
  topWins: string[];
}

export const DEMO_WEBSITE_SCORECARD: WebsiteScorecard[] = [
  {
    tenantId: "tenant-plumbing",
    conversionReadinessScore: 61,
    previousConversionReadinessScore: 54,
    contentQualityScore: 68,
    previousContentQualityScore: 62,
    technicalHealthScore: 75,
    previousTechnicalHealthScore: 70,
    trustAuthorityScore: 57,
    previousTrustAuthorityScore: 51,
    conversionReadinessFactors: [
      {
        name: "CTA Clarity & Placement",
        score: 55,
        note: "Primary CTA buried below fold on mobile",
      },
      {
        name: "Form Simplicity",
        score: 60,
        note: "Contact form has 8 fields — too many",
      },
      {
        name: "Click-to-Call Visibility",
        score: 72,
        note: "Phone number visible on desktop, not mobile header",
      },
      {
        name: "Urgency & Proof Elements",
        score: 58,
        note: "No urgency signals (response time, availability)",
      },
      {
        name: "Page Load Speed",
        score: 64,
        note: "3.2s load time — above 2.5s threshold",
      },
    ],
    contentQualityFactors: [
      {
        name: "Service Page Completeness",
        score: 74,
        note: "6 of 8 core services have dedicated pages",
      },
      {
        name: "FAQ Coverage",
        score: 62,
        note: "FAQ section thin — only 5 questions",
      },
      {
        name: "Local Relevance Signals",
        score: 68,
        note: "City/area names present but sparse",
      },
      {
        name: "Content Freshness",
        score: 65,
        note: "Homepage last updated 4+ months ago",
      },
      {
        name: "Keyword-Page Alignment",
        score: 70,
        note: "Most pages have some target keyword usage",
      },
    ],
    technicalHealthFactors: [
      {
        name: "Page Speed (Mobile)",
        score: 64,
        note: "Failing Core Web Vitals on mobile",
      },
      {
        name: "SSL Certificate",
        score: 98,
        note: "Valid SSL, expires in 289 days",
      },
      {
        name: "Mobile Responsiveness",
        score: 80,
        note: "Minor layout issues on small screens",
      },
      {
        name: "Uptime Reliability",
        score: 99,
        note: "99.9% uptime this month",
      },
      {
        name: "Broken Links / 404s",
        score: 72,
        note: "3 internal broken links detected",
      },
    ],
    trustAuthorityFactors: [
      {
        name: "Review Integration",
        score: 52,
        note: "No live review feed on website",
      },
      {
        name: "Credentials & Licensing",
        score: 65,
        note: "License number present but no badge",
      },
      {
        name: "About / Team Section",
        score: 48,
        note: "No team photos or owner bio",
      },
      {
        name: "Trust Badges (BBB, etc.)",
        score: 55,
        note: "No third-party trust badges displayed",
      },
      {
        name: "Social Proof / Testimonials",
        score: 60,
        note: "2 testimonials, needs more with photos",
      },
    ],
  },
  {
    tenantId: "tenant-medspa",
    conversionReadinessScore: 72,
    previousConversionReadinessScore: 65,
    contentQualityScore: 78,
    previousContentQualityScore: 71,
    technicalHealthScore: 82,
    previousTechnicalHealthScore: 76,
    trustAuthorityScore: 69,
    previousTrustAuthorityScore: 62,
    conversionReadinessFactors: [
      {
        name: "CTA Clarity & Placement",
        score: 78,
        note: "Book Now button visible on all service pages",
      },
      {
        name: "Form Simplicity",
        score: 72,
        note: "Booking form at 5 fields — acceptable",
      },
      {
        name: "Click-to-Call Visibility",
        score: 68,
        note: "Phone visible but not sticky on mobile",
      },
      {
        name: "Urgency & Proof Elements",
        score: 70,
        note: "Availability calendar missing",
      },
      {
        name: "Page Load Speed",
        score: 75,
        note: "2.8s load time — needs optimization",
      },
    ],
    contentQualityFactors: [
      {
        name: "Service Page Completeness",
        score: 84,
        note: "9 of 10 service pages complete",
      },
      {
        name: "FAQ Coverage",
        score: 76,
        note: "FAQ covers most common questions",
      },
      {
        name: "Local Relevance Signals",
        score: 78,
        note: "Location keywords well-integrated",
      },
      {
        name: "Content Freshness",
        score: 74,
        note: "Homepage updated 6 weeks ago",
      },
      {
        name: "Keyword-Page Alignment",
        score: 80,
        note: "Strong keyword coverage across service pages",
      },
    ],
    technicalHealthFactors: [
      {
        name: "Page Speed (Mobile)",
        score: 78,
        note: "Passing LCP but CLS needs work",
      },
      {
        name: "SSL Certificate",
        score: 98,
        note: "Valid SSL, expires in 180 days",
      },
      {
        name: "Mobile Responsiveness",
        score: 86,
        note: "Clean mobile layout across devices",
      },
      { name: "Uptime Reliability", score: 99, note: "100% uptime this month" },
      {
        name: "Broken Links / 404s",
        score: 82,
        note: "1 old blog post 404 found",
      },
    ],
    trustAuthorityFactors: [
      {
        name: "Review Integration",
        score: 70,
        note: "Google reviews widget on homepage",
      },
      {
        name: "Credentials & Licensing",
        score: 72,
        note: "Provider credentials listed on About page",
      },
      {
        name: "About / Team Section",
        score: 68,
        note: "Team page exists but needs photos",
      },
      {
        name: "Trust Badges (BBB, etc.)",
        score: 62,
        note: "Medical spa association badge not displayed",
      },
      {
        name: "Social Proof / Testimonials",
        score: 72,
        note: "8 testimonials with before/after on 2 pages",
      },
    ],
  },
];

export const DEMO_WEBSITE_ISSUES: WebsiteIssue[] = [
  {
    id: "wi-1",
    tenantId: "tenant-plumbing",
    title: "No Click-to-Call in Mobile Header",
    description:
      "On mobile devices, visitors cannot tap to call directly from the header. The phone number is only in the footer, which most mobile users never reach.",
    severity: "critical",
    category: "conversion",
    status: "open",
    area: "Site-Wide Mobile Header",
    pageUrl: "/",
    suggestedFix:
      "Add a sticky phone number with tap-to-call in the mobile header. This is the single highest-ROI fix for a service business.",
  },
  {
    id: "wi-2",
    tenantId: "tenant-plumbing",
    title: "Contact Form Has Too Many Fields",
    description:
      'Your contact form requires 8 fields including "How did you find us?" Every additional field reduces conversion rate by approximately 5-10%.',
    severity: "high",
    category: "conversion",
    status: "in_progress",
    area: "Contact Page / All Forms",
    pageUrl: "/contact",
    suggestedFix:
      "Reduce to Name, Phone, Service Needed. Move additional qualifying to a follow-up call. This change alone can double form completion rates.",
    owner: "Agent Team",
    dueDate: "2026-04-20",
  },
  {
    id: "wi-3",
    tenantId: "tenant-plumbing",
    title: "No Social Proof on Homepage Above Fold",
    description:
      "First-time visitors see no reviews, star ratings, or trust indicators within the first screen. This increases bounce rates significantly.",
    severity: "high",
    category: "trust",
    status: "open",
    area: "Homepage Hero Section",
    pageUrl: "/",
    suggestedFix:
      'Add a Google review star rating (e.g., "4.9 \u2b50 — 200+ Reviews") near the headline. This single element can improve conversion rates 15-40%.',
  },
  {
    id: "wi-4",
    tenantId: "tenant-plumbing",
    title: "Mobile Page Speed Failing Core Web Vitals",
    description:
      "LCP (Largest Contentful Paint) is 3.2s on mobile. Google recommends under 2.5s. This affects both rankings and conversion rate.",
    severity: "high",
    category: "speed",
    status: "open",
    area: "Site-Wide (Mobile)",
    suggestedFix:
      "Compress hero images, eliminate render-blocking resources, and enable lazy loading. Target: LCP under 2.0s.",
  },
  {
    id: "wi-5",
    tenantId: "tenant-plumbing",
    title: "Emergency Plumbing Page Missing Urgency Signals",
    description:
      'Your "Emergency Plumbing" page has no response time, availability hours, or urgency messaging. Emergency searchers need reassurance immediately.',
    severity: "medium",
    category: "conversion",
    status: "open",
    area: "/services/emergency-plumbing",
    pageUrl: "/services/emergency-plumbing",
    suggestedFix:
      'Add "Available 24/7", response time promise ("We answer in under 2 minutes"), and a red urgent CTA button. Differentiate from competitors.',
  },
  {
    id: "wi-6",
    tenantId: "tenant-plumbing",
    title: "3 Internal Broken Links",
    description:
      "Three internal links are pointing to pages that no longer exist (404 errors). This hurts SEO and creates a poor user experience.",
    severity: "medium",
    category: "technical",
    status: "open",
    area: "Service Pages",
    suggestedFix:
      "Update these links to point to current active pages. Schedule monthly broken link audit.",
  },
  {
    id: "wi-7",
    tenantId: "tenant-plumbing",
    title: "No Owner/Team Bio on About Page",
    description:
      "Local service businesses convert significantly better when customers can see a real face and name. Your About page has no team or owner information.",
    severity: "medium",
    category: "trust",
    status: "open",
    area: "/about",
    pageUrl: "/about",
    suggestedFix:
      "Add a photo and 2-3 sentence bio of the owner and key technicians. Mention years of experience, certifications, and local roots.",
  },
  {
    id: "wi-8",
    tenantId: "tenant-plumbing",
    title: "FAQ Section Too Thin",
    description:
      "Current FAQ only has 5 questions. This misses long-tail keyword opportunities and leaves common customer objections unaddressed.",
    severity: "low",
    category: "content",
    status: "open",
    area: "FAQ Section",
    suggestedFix:
      "Expand to 15-20 niche-specific questions. This also improves GEO / AI answer engine visibility.",
  },
  {
    id: "wi-9",
    tenantId: "tenant-medspa",
    title: "Booking CTA Not Sticky on Mobile",
    description:
      "Mobile visitors must scroll to find a booking action. For a consultation-driven business, the CTA needs to always be visible.",
    severity: "high",
    category: "conversion",
    status: "open",
    area: "Site-Wide Mobile",
    suggestedFix:
      'Add a sticky "Book Consultation" button at the bottom of all mobile screens. This is the most common fix for med spa conversion rates.',
  },
  {
    id: "wi-10",
    tenantId: "tenant-medspa",
    title: "No Medical Association Trust Badges",
    description:
      "Potential clients are evaluating safety and credentials. Missing association badges (AMWI, ASDS, etc.) reduce credibility for new visitors.",
    severity: "medium",
    category: "trust",
    status: "open",
    area: "Homepage Footer / About Page",
    suggestedFix:
      "Display relevant certifications and association memberships prominently. These badges can increase consultation request rates 10-25%.",
  },
];

export const DEMO_WEBSITE_PERFORMANCE_HISTORY: WebsitePerformanceMonth[] = [
  {
    tenantId: "tenant-plumbing",
    month: "2026-04",
    pagesOptimized: 4,
    updatesCompleted: 7,
    conversionReadinessScore: 61,
    contentQualityScore: 68,
    technicalHealthScore: 75,
    trustAuthorityScore: 57,
    estimatedConversionLift: "+12% projected",
    topWins: [
      "Emergency page CTA rewrite",
      "Form field reduction (in progress)",
      "Homepage hero copy refresh",
    ],
  },
  {
    tenantId: "tenant-plumbing",
    month: "2026-03",
    pagesOptimized: 3,
    updatesCompleted: 5,
    conversionReadinessScore: 54,
    contentQualityScore: 62,
    technicalHealthScore: 70,
    trustAuthorityScore: 51,
    estimatedConversionLift: "+8% vs Feb",
    topWins: [
      "Service pages updated with local keywords",
      "FAQ section expanded to 8 questions",
      "SSL renewed",
    ],
  },
  {
    tenantId: "tenant-plumbing",
    month: "2026-02",
    pagesOptimized: 2,
    updatesCompleted: 4,
    conversionReadinessScore: 48,
    contentQualityScore: 58,
    technicalHealthScore: 65,
    trustAuthorityScore: 46,
    estimatedConversionLift: "Baseline",
    topWins: [
      "Site audit completed",
      "Priority issues identified",
      "Quick wins list created",
    ],
  },
  {
    tenantId: "tenant-medspa",
    month: "2026-04",
    pagesOptimized: 5,
    updatesCompleted: 9,
    conversionReadinessScore: 72,
    contentQualityScore: 78,
    technicalHealthScore: 82,
    trustAuthorityScore: 69,
    estimatedConversionLift: "+18% projected",
    topWins: [
      "Before/after gallery added to 3 service pages",
      "Booking widget added to homepage",
      "Provider bios updated",
    ],
  },
  {
    tenantId: "tenant-medspa",
    month: "2026-03",
    pagesOptimized: 4,
    updatesCompleted: 7,
    conversionReadinessScore: 65,
    contentQualityScore: 71,
    technicalHealthScore: 76,
    trustAuthorityScore: 62,
    estimatedConversionLift: "+11% vs Feb",
    topWins: [
      "Service page content rewrites (4 pages)",
      "Google review widget installed",
      "Mobile speed improved",
    ],
  },
];
