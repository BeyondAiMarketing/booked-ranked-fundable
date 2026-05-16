// SEO & GEO Agent — Phase 2 Data Models and Demo Data

export interface SeoGeoScoreFactor {
  name: string;
  score: number; // 0-100
  weight: number; // contribution weight
  status: "good" | "warning" | "critical";
  note: string;
}

export interface SeoGeoScorecard {
  tenantId: string;
  generatedAt: number;
  seoScore: number;
  geoScore: number;
  localVisibilityScore: number;
  conversionReadinessScore: number;
  seoFactors: SeoGeoScoreFactor[];
  geoFactors: SeoGeoScoreFactor[];
  localFactors: SeoGeoScoreFactor[];
  conversionFactors: SeoGeoScoreFactor[];
  previousSeoScore?: number;
  previousGeoScore?: number;
  previousLocalScore?: number;
  previousConversionScore?: number;
}

export interface SeoGeoIssue {
  id: string;
  tenantId: string;
  title: string;
  area: string; // e.g. "Homepage", "GBP Profile", "Service Pages"
  severity: "critical" | "high" | "medium" | "low";
  why: string;
  suggestedFix: string;
  status: "open" | "in_progress" | "resolved" | "wont_fix";
  owner: string;
  dueDate?: string;
  detectedAt: number;
  resolvedAt?: number;
  category:
    | "technical"
    | "content"
    | "gbp"
    | "citations"
    | "conversion"
    | "geo";
}

export interface SeoGeoOpportunity {
  id: string;
  tenantId: string;
  title: string;
  reason: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  recommendedAction: string;
  category:
    | "content"
    | "local-page"
    | "faq"
    | "schema"
    | "gbp"
    | "geo"
    | "ai-visibility";
  status: "available" | "requested" | "in_progress" | "completed";
}

export interface SeoGeoGbpTask {
  id: string;
  tenantId: string;
  title: string;
  category:
    | "photo"
    | "category"
    | "hours"
    | "services"
    | "posts"
    | "qa"
    | "description"
    | "review-response";
  status: "pending" | "complete";
  impact: "high" | "medium" | "low";
  completedAt?: number;
}

export interface SeoGeoContentItem {
  id: string;
  tenantId: string;
  type:
    | "title-meta"
    | "hero-copy"
    | "service-page"
    | "faq"
    | "gbp-description"
    | "cta"
    | "local-page"
    | "geo-brief";
  title: string;
  content: string;
  status: "draft" | "approved" | "published";
  createdAt: number;
  pageUrl?: string;
}

export interface SeoGeoVisibilitySnapshot {
  tenantId: string;
  month: string;
  aiVisibilityScore: number;
  faqOpportunities: number;
  entityClarity: number; // 0-100
  citationConsistency: number; // 0-100
  answerReadiness: number; // 0-100
  notes: string;
}

export interface NapConsistency {
  platform: string;
  nameMatch: boolean;
  addressMatch: boolean;
  phoneMatch: boolean;
  url?: string;
  lastChecked: number;
}

// ---- DEMO DATA ----

export const DEMO_SEO_GEO_SCORECARDS: SeoGeoScorecard[] = [
  {
    tenantId: "tenant-plumbing",
    generatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    seoScore: 71,
    geoScore: 58,
    localVisibilityScore: 74,
    conversionReadinessScore: 62,
    previousSeoScore: 67,
    previousGeoScore: 53,
    previousLocalScore: 70,
    previousConversionScore: 60,
    seoFactors: [
      {
        name: "Technical Health",
        score: 80,
        weight: 20,
        status: "good",
        note: "SSL active, uptime 99.8%, no crawl errors",
      },
      {
        name: "On-Page Optimization",
        score: 68,
        weight: 20,
        status: "warning",
        note: "Several pages missing H1 tags and optimized titles",
      },
      {
        name: "Page Speed",
        score: 72,
        weight: 15,
        status: "warning",
        note: "Mobile LCP 3.4s — above 2.5s threshold",
      },
      {
        name: "Content Quality",
        score: 65,
        weight: 15,
        status: "warning",
        note: "Thin content on 3 service pages",
      },
      {
        name: "Local Relevance",
        score: 75,
        weight: 15,
        status: "good",
        note: "Service area keywords present on key pages",
      },
      {
        name: "GBP Completeness",
        score: 70,
        weight: 10,
        status: "warning",
        note: "Missing 4 service photos and Q&A section",
      },
      {
        name: "Trust Signals",
        score: 66,
        weight: 5,
        status: "warning",
        note: "Review count good but schema not implemented",
      },
    ],
    geoFactors: [
      {
        name: "FAQ & Answer Structure",
        score: 52,
        weight: 20,
        status: "critical",
        note: "No structured FAQ content on key pages",
      },
      {
        name: "Content Summarizability",
        score: 60,
        weight: 15,
        status: "warning",
        note: "Copy is readable but lacks clear answer blocks",
      },
      {
        name: "Entity Clarity",
        score: 65,
        weight: 15,
        status: "warning",
        note: "Business entity could be better defined in content",
      },
      {
        name: "Location Specificity",
        score: 70,
        weight: 15,
        status: "good",
        note: "Service area and city mentioned consistently",
      },
      {
        name: "Structured Content",
        score: 55,
        weight: 15,
        status: "critical",
        note: "No schema markup implemented",
      },
      {
        name: "Brand Consistency",
        score: 58,
        weight: 10,
        status: "warning",
        note: "Brand voice inconsistent across pages",
      },
      {
        name: "AI Answer Readiness",
        score: 42,
        weight: 10,
        status: "critical",
        note: "Pages not formatted for featured snippet or AI answer",
      },
    ],
    localFactors: [
      {
        name: "GBP Completeness",
        score: 70,
        weight: 30,
        status: "warning",
        note: "Photos and Q&A need attention",
      },
      {
        name: "Citation Consistency",
        score: 78,
        weight: 25,
        status: "good",
        note: "8 of 12 inconsistent citations fixed",
      },
      {
        name: "Review Velocity",
        score: 82,
        weight: 20,
        status: "good",
        note: "Averaging 3.2 new reviews per week",
      },
      {
        name: "Service Area Coverage",
        score: 70,
        weight: 15,
        status: "warning",
        note: "3 zip codes not covered by landing pages",
      },
      {
        name: "NAP Accuracy",
        score: 68,
        weight: 10,
        status: "warning",
        note: "4 directory listings still show old address",
      },
    ],
    conversionFactors: [
      {
        name: "CTA Clarity",
        score: 58,
        weight: 30,
        status: "warning",
        note: "Homepage CTA present but below the fold",
      },
      {
        name: "Mobile Usability",
        score: 72,
        weight: 25,
        status: "good",
        note: "Functional on mobile, tap targets acceptable",
      },
      {
        name: "Page Layout",
        score: 65,
        weight: 20,
        status: "warning",
        note: "Service pages lack visual hierarchy",
      },
      {
        name: "Trust Elements",
        score: 60,
        weight: 15,
        status: "warning",
        note: "Review widget present but no badges or awards",
      },
      {
        name: "Form Accessibility",
        score: 55,
        weight: 10,
        status: "critical",
        note: "Contact form below fold on 3 key pages",
      },
    ],
  },
  {
    tenantId: "tenant-medspa",
    generatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    seoScore: 82,
    geoScore: 71,
    localVisibilityScore: 85,
    conversionReadinessScore: 78,
    previousSeoScore: 77,
    previousGeoScore: 66,
    previousLocalScore: 80,
    previousConversionScore: 74,
    seoFactors: [
      {
        name: "Technical Health",
        score: 91,
        weight: 20,
        status: "good",
        note: "Excellent technical foundation",
      },
      {
        name: "On-Page Optimization",
        score: 82,
        weight: 20,
        status: "good",
        note: "Titles and meta descriptions optimized",
      },
      {
        name: "Page Speed",
        score: 78,
        weight: 15,
        status: "good",
        note: "Mobile LCP 2.1s — within threshold",
      },
      {
        name: "Content Quality",
        score: 80,
        weight: 15,
        status: "good",
        note: "Rich service descriptions and treatment guides",
      },
      {
        name: "Local Relevance",
        score: 84,
        weight: 15,
        status: "good",
        note: "City and neighborhood mentions throughout",
      },
      {
        name: "GBP Completeness",
        score: 88,
        weight: 10,
        status: "good",
        note: "GBP fully optimized with recent photos",
      },
      {
        name: "Trust Signals",
        score: 75,
        weight: 5,
        status: "good",
        note: "Review schema implemented",
      },
    ],
    geoFactors: [
      {
        name: "FAQ & Answer Structure",
        score: 72,
        weight: 20,
        status: "good",
        note: "FAQ sections on 3 main service pages",
      },
      {
        name: "Content Summarizability",
        score: 74,
        weight: 15,
        status: "good",
        note: "Clear answer blocks on treatment pages",
      },
      {
        name: "Entity Clarity",
        score: 71,
        weight: 15,
        status: "good",
        note: "Brand well-defined, consistent across pages",
      },
      {
        name: "Location Specificity",
        score: 78,
        weight: 15,
        status: "good",
        note: "Neighborhood and city well integrated",
      },
      {
        name: "Structured Content",
        score: 68,
        weight: 15,
        status: "warning",
        note: "Schema only on homepage, not service pages",
      },
      {
        name: "Brand Consistency",
        score: 72,
        weight: 10,
        status: "good",
        note: "Consistent premium tone",
      },
      {
        name: "AI Answer Readiness",
        score: 60,
        weight: 10,
        status: "warning",
        note: "Needs more direct Q&A format content",
      },
    ],
    localFactors: [
      {
        name: "GBP Completeness",
        score: 88,
        weight: 30,
        status: "good",
        note: "Complete with services, photos, and posts",
      },
      {
        name: "Citation Consistency",
        score: 86,
        weight: 25,
        status: "good",
        note: "Consistent across top 20 directories",
      },
      {
        name: "Review Velocity",
        score: 90,
        weight: 20,
        status: "good",
        note: "5+ reviews per week average",
      },
      {
        name: "Service Area Coverage",
        score: 80,
        weight: 15,
        status: "good",
        note: "5 city pages live",
      },
      {
        name: "NAP Accuracy",
        score: 84,
        weight: 10,
        status: "good",
        note: "Consistent across all major platforms",
      },
    ],
    conversionFactors: [
      {
        name: "CTA Clarity",
        score: 82,
        weight: 30,
        status: "good",
        note: "Book Now prominently placed",
      },
      {
        name: "Mobile Usability",
        score: 84,
        weight: 25,
        status: "good",
        note: "Excellent mobile experience",
      },
      {
        name: "Page Layout",
        score: 78,
        weight: 20,
        status: "good",
        note: "Clean hierarchy on all service pages",
      },
      {
        name: "Trust Elements",
        score: 75,
        weight: 15,
        status: "good",
        note: "Before/after gallery and certification badges",
      },
      {
        name: "Form Accessibility",
        score: 70,
        weight: 10,
        status: "warning",
        note: "Booking form could be higher on mobile",
      },
    ],
  },
  {
    tenantId: "tenant-demo",
    generatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    seoScore: 54,
    geoScore: 41,
    localVisibilityScore: 61,
    conversionReadinessScore: 48,
    previousSeoScore: 52,
    previousGeoScore: 38,
    previousLocalScore: 58,
    previousConversionScore: 46,
    seoFactors: [
      {
        name: "Technical Health",
        score: 70,
        weight: 20,
        status: "warning",
        note: "SSL active, minor speed issues",
      },
      {
        name: "On-Page Optimization",
        score: 50,
        weight: 20,
        status: "critical",
        note: "Many pages missing meta descriptions",
      },
      {
        name: "Page Speed",
        score: 58,
        weight: 15,
        status: "warning",
        note: "LCP 3.9s on mobile",
      },
      {
        name: "Content Quality",
        score: 48,
        weight: 15,
        status: "critical",
        note: "Very thin content across service pages",
      },
      {
        name: "Local Relevance",
        score: 55,
        weight: 15,
        status: "warning",
        note: "Service area mentions sparse",
      },
      {
        name: "GBP Completeness",
        score: 52,
        weight: 10,
        status: "critical",
        note: "Incomplete GBP — missing services, old photos",
      },
      {
        name: "Trust Signals",
        score: 45,
        weight: 5,
        status: "critical",
        note: "No schema, few reviews visible",
      },
    ],
    geoFactors: [
      {
        name: "FAQ & Answer Structure",
        score: 32,
        weight: 20,
        status: "critical",
        note: "No FAQ content anywhere",
      },
      {
        name: "Content Summarizability",
        score: 40,
        weight: 15,
        status: "critical",
        note: "Content too vague for AI extraction",
      },
      {
        name: "Entity Clarity",
        score: 45,
        weight: 15,
        status: "critical",
        note: "Business identity unclear in copy",
      },
      {
        name: "Location Specificity",
        score: 55,
        weight: 15,
        status: "warning",
        note: "Minimal geographic context",
      },
      {
        name: "Structured Content",
        score: 30,
        weight: 15,
        status: "critical",
        note: "No schema markup",
      },
      {
        name: "Brand Consistency",
        score: 42,
        weight: 10,
        status: "critical",
        note: "Tone varies page to page",
      },
      {
        name: "AI Answer Readiness",
        score: 35,
        weight: 10,
        status: "critical",
        note: "Not formatted for AI responses",
      },
    ],
    localFactors: [
      {
        name: "GBP Completeness",
        score: 52,
        weight: 30,
        status: "critical",
        note: "Significant gaps in GBP profile",
      },
      {
        name: "Citation Consistency",
        score: 65,
        weight: 25,
        status: "warning",
        note: "Cleanup 60% complete",
      },
      {
        name: "Review Velocity",
        score: 70,
        weight: 20,
        status: "good",
        note: "Getting reviews but slowly",
      },
      {
        name: "Service Area Coverage",
        score: 55,
        weight: 15,
        status: "warning",
        note: "No dedicated service area pages",
      },
      {
        name: "NAP Accuracy",
        score: 60,
        weight: 10,
        status: "warning",
        note: "Old address still on some directories",
      },
    ],
    conversionFactors: [
      {
        name: "CTA Clarity",
        score: 45,
        weight: 30,
        status: "critical",
        note: "No clear primary CTA",
      },
      {
        name: "Mobile Usability",
        score: 58,
        weight: 25,
        status: "warning",
        note: "Functional but not optimized",
      },
      {
        name: "Page Layout",
        score: 48,
        weight: 20,
        status: "critical",
        note: "No visual hierarchy",
      },
      {
        name: "Trust Elements",
        score: 42,
        weight: 15,
        status: "critical",
        note: "No badges, reviews, or certifications visible",
      },
      {
        name: "Form Accessibility",
        score: 40,
        weight: 10,
        status: "critical",
        note: "Form buried at the bottom",
      },
    ],
  },
];

export const DEMO_SEO_GEO_ISSUES: SeoGeoIssue[] = [
  {
    id: "issue-001",
    tenantId: "tenant-plumbing",
    title: "No FAQ content on service pages",
    area: "Service Pages",
    severity: "critical",
    why: "Structured FAQ content is the #1 factor for AI-powered search visibility (GEO). Without it, your business won't be cited in AI search answers.",
    suggestedFix:
      "Add a 5-question FAQ block to your top 3 service pages using natural language answers.",
    status: "open",
    owner: "Team",
    dueDate: "2026-04-18",
    detectedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    category: "geo",
  },
  {
    id: "issue-002",
    tenantId: "tenant-plumbing",
    title: "Mobile LCP above 2.5s threshold",
    area: "Homepage",
    severity: "high",
    why: "Google uses Core Web Vitals as a ranking factor. Slow load times on mobile directly suppress your visibility in mobile searches.",
    suggestedFix:
      "Compress hero image, defer non-critical scripts, and enable lazy loading.",
    status: "in_progress",
    owner: "Jake R.",
    dueDate: "2026-04-12",
    detectedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    category: "technical",
  },
  {
    id: "issue-003",
    tenantId: "tenant-plumbing",
    title: "3 service pages missing H1 tags",
    area: "Service Pages",
    severity: "high",
    why: "Missing H1 tags mean search engines can't determine the primary topic of a page, reducing ranking potential.",
    suggestedFix:
      "Add descriptive H1 tags to Water Heater, Drain Cleaning, and Sewer Repair pages.",
    status: "open",
    owner: "Team",
    detectedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    category: "content",
  },
  {
    id: "issue-004",
    tenantId: "tenant-plumbing",
    title: "No schema markup implemented",
    area: "Entire Site",
    severity: "critical",
    why: "Schema markup signals to search engines and AI systems exactly what your business is, what it offers, and where it's located. Critical for GEO visibility.",
    suggestedFix:
      "Implement LocalBusiness, Service, and FAQPage schema markup.",
    status: "open",
    owner: "Jake R.",
    dueDate: "2026-04-20",
    detectedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    category: "geo",
  },
  {
    id: "issue-005",
    tenantId: "tenant-plumbing",
    title: "Contact form below the fold on mobile",
    area: "Contact Page",
    severity: "medium",
    why: "Visitors on mobile who can't immediately see the contact form are significantly more likely to bounce without converting.",
    suggestedFix:
      'Add a sticky "Call Now" button in the mobile header and move the form above the fold.',
    status: "open",
    owner: "Team",
    detectedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    category: "conversion",
  },
  {
    id: "issue-006",
    tenantId: "tenant-plumbing",
    title: "4 NAP inconsistencies remaining on directories",
    area: "Local Citations",
    severity: "medium",
    why: "Inconsistent business name, address, or phone across directories confuses search engines and weakens local ranking signals.",
    suggestedFix:
      "Correct the remaining 4 directory listings (YellowPages, Angi, Thumbtack, Yelp).",
    status: "in_progress",
    owner: "Jake R.",
    dueDate: "2026-04-15",
    detectedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    category: "citations",
  },
  {
    id: "issue-007",
    tenantId: "tenant-plumbing",
    title: "GBP Q&A section empty",
    area: "Google Business Profile",
    severity: "medium",
    why: "An empty GBP Q&A section misses a key opportunity to address common questions and signal relevance to search engines.",
    suggestedFix:
      "Seed the Q&A with 5 common customer questions and answer them with keyword-rich responses.",
    status: "open",
    owner: "Sarah M.",
    detectedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    category: "gbp",
  },
  {
    id: "issue-008",
    tenantId: "tenant-plumbing",
    title: "Thin content on 3 service pages (under 200 words)",
    area: "Service Pages",
    severity: "high",
    why: "Pages with very little content rank poorly because search engines can't assess topical depth or relevance.",
    suggestedFix:
      "Expand Garbage Disposal, Leak Repair, and Pipe Replacement pages to 400+ words with clear service descriptions.",
    status: "open",
    owner: "Team",
    detectedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    category: "content",
  },
  {
    id: "issue-009",
    tenantId: "tenant-demo",
    title: "GBP profile significantly incomplete",
    area: "Google Business Profile",
    severity: "critical",
    why: "An incomplete GBP profile suppresses map pack rankings and reduces visibility to nearby searchers.",
    suggestedFix:
      "Add services, complete business description, upload 10+ photos, and verify all info.",
    status: "open",
    owner: "Team",
    detectedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    category: "gbp",
  },
  {
    id: "issue-010",
    tenantId: "tenant-demo",
    title: "No structured FAQ content anywhere on site",
    area: "Entire Site",
    severity: "critical",
    why: "Without FAQ blocks, your business is invisible to AI-powered searches. This is the fastest GEO improvement available.",
    suggestedFix:
      "Add FAQ sections to homepage and top 3 service pages immediately.",
    status: "open",
    owner: "Team",
    detectedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    category: "geo",
  },
  {
    id: "issue-011",
    tenantId: "tenant-demo",
    title: "No primary CTA on homepage",
    area: "Homepage",
    severity: "critical",
    why: "Without a clear call-to-action, visitors don't know what to do next and conversion rates suffer significantly.",
    suggestedFix:
      'Add a high-contrast "Get Free Estimate" button in the hero section and sticky on mobile.',
    status: "open",
    owner: "Team",
    detectedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    category: "conversion",
  },
  {
    id: "issue-012",
    tenantId: "tenant-demo",
    title: "Meta descriptions missing on 7 pages",
    area: "Multiple Pages",
    severity: "high",
    why: "Missing meta descriptions lead to auto-generated snippets in search results, reducing click-through rates.",
    suggestedFix:
      "Write unique, action-oriented meta descriptions for all key pages.",
    status: "open",
    owner: "Team",
    detectedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    category: "content",
  },
];

export const DEMO_SEO_GEO_OPPORTUNITIES: SeoGeoOpportunity[] = [
  {
    id: "opp-001",
    tenantId: "tenant-plumbing",
    title: "Add FAQ blocks to top service pages",
    reason:
      "FAQ content is the fastest path to appearing in AI-generated search answers (GEO). Your competitors with FAQ content are already winning those placements.",
    impact: "high",
    effort: "low",
    recommendedAction:
      "Generate 5-question FAQ blocks for Emergency Plumbing, Water Heater Repair, and Drain Cleaning pages.",
    category: "faq",
    status: "available",
  },
  {
    id: "opp-002",
    tenantId: "tenant-plumbing",
    title: "Create 3 service area landing pages",
    reason:
      "You serve customers in 3 zip codes with no dedicated page. Adding targeted local pages can add significant organic traffic from area-specific searches.",
    impact: "high",
    effort: "medium",
    recommendedAction:
      "Build optimized landing pages for your top 3 service area zip codes with local-specific content.",
    category: "local-page",
    status: "requested",
  },
  {
    id: "opp-003",
    tenantId: "tenant-plumbing",
    title: "Implement LocalBusiness + FAQPage schema",
    reason:
      "Schema markup directly communicates your business identity to AI systems and search engines. It's a baseline GEO requirement.",
    impact: "high",
    effort: "low",
    recommendedAction:
      "Add LocalBusiness schema to all pages and FAQPage schema to any page with FAQ content.",
    category: "schema",
    status: "in_progress",
  },
  {
    id: "opp-004",
    tenantId: "tenant-plumbing",
    title: "Optimize GBP for seasonal search spikes",
    reason:
      "Spring brings a surge in plumbing searches. A well-optimized GBP with seasonal posts and updated photos captures that traffic.",
    impact: "medium",
    effort: "low",
    recommendedAction:
      "Create 3 seasonal GBP posts, add spring service photos, and update the business description.",
    category: "gbp",
    status: "available",
  },
  {
    id: "opp-005",
    tenantId: "tenant-plumbing",
    title: 'Build a "How to Know If You Need a Plumber" content piece',
    reason:
      "Informational content targeting decision-stage queries drives traffic and positions your business as the expert — and it's ideal for AI answers.",
    impact: "medium",
    effort: "medium",
    recommendedAction:
      "Write a 600-word guide answering common homeowner questions with a consultation CTA at the end.",
    category: "geo",
    status: "available",
  },
  {
    id: "opp-006",
    tenantId: "tenant-plumbing",
    title: "Seed GBP Q&A with 5 common questions",
    reason:
      "GBP Q&A content appears in knowledge panels and is used by AI to answer location-specific queries. Currently empty.",
    impact: "medium",
    effort: "low",
    recommendedAction:
      "Post and answer 5 questions covering pricing, response time, service areas, emergency availability, and licensing.",
    category: "ai-visibility",
    status: "available",
  },
  {
    id: "opp-007",
    tenantId: "tenant-plumbing",
    title: "Add citation listings on 6 additional directories",
    reason:
      "More high-quality citation sources strengthen local authority signals. You still have gaps on platforms your competitors are listed on.",
    impact: "medium",
    effort: "low",
    recommendedAction:
      "Submit to Bing Places, Apple Maps, Houzz, Nextdoor Business, BBB, and Angi.",
    category: "local-page",
    status: "available",
  },
  {
    id: "opp-008",
    tenantId: "tenant-plumbing",
    title: "Create a sewer line repair dedicated page",
    reason:
      "Sewer line repair is a high-value search term with significant monthly volume. A dedicated page would capture that intent directly.",
    impact: "high",
    effort: "medium",
    recommendedAction:
      "Build a service page with description, process, pricing signals, FAQs, and a clear CTA.",
    category: "content",
    status: "requested",
  },
  {
    id: "opp-009",
    tenantId: "tenant-demo",
    title: "Add FAQ sections to all key pages",
    reason:
      "You have zero FAQ content. This is your single highest-impact GEO improvement — fast to implement and immediately affects AI search visibility.",
    impact: "high",
    effort: "low",
    recommendedAction:
      "Generate FAQ blocks for homepage, top 3 service pages, and GBP profile immediately.",
    category: "faq",
    status: "available",
  },
  {
    id: "opp-010",
    tenantId: "tenant-demo",
    title: "Complete your Google Business Profile",
    reason:
      "Your GBP is less than 60% complete. This directly limits your map pack visibility and local search rankings.",
    impact: "high",
    effort: "low",
    recommendedAction:
      "Add all services, 10 photos, business description, holiday hours, and enable messaging.",
    category: "gbp",
    status: "available",
  },
  {
    id: "opp-011",
    tenantId: "tenant-medspa",
    title: "Expand FAQ content to all treatment pages",
    reason:
      "You have FAQ on 3 pages. Adding it to the remaining 6 treatment pages would significantly boost GEO coverage.",
    impact: "high",
    effort: "low",
    recommendedAction:
      "Generate FAQ blocks for Laser, PRP, Microneedling, Chemical Peel, Body Contouring, and Skin Tightening pages.",
    category: "faq",
    status: "available",
  },
  {
    id: "opp-012",
    tenantId: "tenant-medspa",
    title: "Add schema markup to all service pages",
    reason:
      "Schema is only on your homepage. Adding it to service pages will help search engines and AI categorize each treatment and surface them for relevant queries.",
    impact: "medium",
    effort: "low",
    recommendedAction:
      "Implement MedicalProcedure and Service schema on all treatment pages.",
    category: "schema",
    status: "in_progress",
  },
];

export const DEMO_GBP_TASKS: SeoGeoGbpTask[] = [
  {
    id: "gbp-001",
    tenantId: "tenant-plumbing",
    title: "Add 4 service photos (equipment, team, job site)",
    category: "photo",
    status: "pending",
    impact: "high",
  },
  {
    id: "gbp-002",
    tenantId: "tenant-plumbing",
    title: 'Add "Emergency Plumbing" as a primary category',
    category: "category",
    status: "complete",
    impact: "high",
    completedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "gbp-003",
    tenantId: "tenant-plumbing",
    title: "Seed Q&A with 5 common questions",
    category: "qa",
    status: "pending",
    impact: "medium",
  },
  {
    id: "gbp-004",
    tenantId: "tenant-plumbing",
    title: "Update business description with keywords",
    category: "description",
    status: "complete",
    impact: "medium",
    completedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: "gbp-005",
    tenantId: "tenant-plumbing",
    title: "Post spring seasonal update",
    category: "posts",
    status: "pending",
    impact: "low",
  },
  {
    id: "gbp-006",
    tenantId: "tenant-plumbing",
    title: "Verify holiday hours are correct",
    category: "hours",
    status: "complete",
    impact: "medium",
    completedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "gbp-007",
    tenantId: "tenant-demo",
    title: "Upload 10 photos of your business and team",
    category: "photo",
    status: "pending",
    impact: "high",
  },
  {
    id: "gbp-008",
    tenantId: "tenant-demo",
    title: "Add all services with descriptions",
    category: "services",
    status: "pending",
    impact: "high",
  },
  {
    id: "gbp-009",
    tenantId: "tenant-demo",
    title: "Write a 200-word business description",
    category: "description",
    status: "pending",
    impact: "high",
  },
  {
    id: "gbp-010",
    tenantId: "tenant-demo",
    title: "Enable messaging feature",
    category: "services",
    status: "pending",
    impact: "medium",
  },
  {
    id: "gbp-011",
    tenantId: "tenant-medspa",
    title: "Add before/after photos for Botox treatment",
    category: "photo",
    status: "complete",
    impact: "high",
    completedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
  },
  {
    id: "gbp-012",
    tenantId: "tenant-medspa",
    title: "Post monthly special offer",
    category: "posts",
    status: "pending",
    impact: "medium",
  },
  {
    id: "gbp-013",
    tenantId: "tenant-medspa",
    title: "Respond to all unanswered reviews",
    category: "review-response",
    status: "pending",
    impact: "medium",
  },
];

export const DEMO_GEO_VISIBILITY: SeoGeoVisibilitySnapshot[] = [
  {
    tenantId: "tenant-plumbing",
    month: "2026-04",
    aiVisibilityScore: 42,
    faqOpportunities: 6,
    entityClarity: 58,
    citationConsistency: 78,
    answerReadiness: 36,
    notes:
      "No FAQ content is the primary gap. Schema implementation will move this score significantly.",
  },
  {
    tenantId: "tenant-plumbing",
    month: "2026-03",
    aiVisibilityScore: 36,
    faqOpportunities: 8,
    entityClarity: 52,
    citationConsistency: 70,
    answerReadiness: 30,
    notes: "Baseline established. Citation cleanup underway.",
  },
  {
    tenantId: "tenant-medspa",
    month: "2026-04",
    aiVisibilityScore: 65,
    faqOpportunities: 4,
    entityClarity: 74,
    citationConsistency: 88,
    answerReadiness: 62,
    notes:
      "Strong foundation. Focus on expanding FAQ coverage to remaining treatment pages.",
  },
  {
    tenantId: "tenant-demo",
    month: "2026-04",
    aiVisibilityScore: 28,
    faqOpportunities: 10,
    entityClarity: 40,
    citationConsistency: 62,
    answerReadiness: 22,
    notes: "Significant GEO gap. First priority is FAQ content and schema.",
  },
];

export const DEMO_NAP_CONSISTENCY: Record<string, NapConsistency[]> = {
  "tenant-plumbing": [
    {
      platform: "Google Business Profile",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Yelp",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Facebook",
      nameMatch: true,
      addressMatch: false,
      phoneMatch: true,
      lastChecked: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "YellowPages",
      nameMatch: true,
      addressMatch: false,
      phoneMatch: false,
      lastChecked: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Angi",
      nameMatch: false,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Apple Maps",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Bing Places",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
  ],
  "tenant-medspa": [
    {
      platform: "Google Business Profile",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Yelp",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Facebook",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "RealSelf",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: false,
      lastChecked: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Healthgrades",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Apple Maps",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
  ],
  "tenant-demo": [
    {
      platform: "Google Business Profile",
      nameMatch: true,
      addressMatch: true,
      phoneMatch: true,
      lastChecked: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Yelp",
      nameMatch: true,
      addressMatch: false,
      phoneMatch: true,
      lastChecked: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Facebook",
      nameMatch: false,
      addressMatch: false,
      phoneMatch: true,
      lastChecked: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "YellowPages",
      nameMatch: true,
      addressMatch: false,
      phoneMatch: false,
      lastChecked: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
    {
      platform: "Angi",
      nameMatch: false,
      addressMatch: true,
      phoneMatch: false,
      lastChecked: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
  ],
};

export const DEMO_SEO_GEO_CONTENT: SeoGeoContentItem[] = [
  {
    id: "content-001",
    tenantId: "tenant-plumbing",
    type: "faq",
    title: "Emergency Plumbing FAQ Block",
    content:
      "Q: How fast can you respond to a plumbing emergency?\nA: We offer 24/7 emergency service with technicians typically on-site within 60-90 minutes.\n\nQ: Do you charge extra for emergency calls?\nA: Emergency calls after 8pm and on weekends include a service call fee. We always provide an upfront estimate before work begins.\n\nQ: What counts as a plumbing emergency?\nA: Burst pipes, sewage backups, major leaks, no hot water, and flooding situations are all emergencies. When in doubt, call us.\n\nQ: Do you work with homeowners insurance?\nA: Yes, we can document damage for insurance claims and work directly with adjusters on covered repairs.\n\nQ: Are your plumbers licensed and insured?\nA: All of our technicians are fully licensed, bonded, and insured in the state of California.",
    status: "approved",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "content-002",
    tenantId: "tenant-plumbing",
    type: "title-meta",
    title: "Homepage Title & Meta Description",
    content:
      "Title: North County Emergency Plumber | Licensed & Available 24/7\nMeta: Fast, reliable plumbing services in North County San Diego. Licensed plumbers available 24/7 for emergencies. Free estimates. Call now.",
    status: "draft",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    pageUrl: "/",
  },
  {
    id: "content-003",
    tenantId: "tenant-plumbing",
    type: "gbp-description",
    title: "Google Business Profile Description",
    content:
      "North County Plumbing Pros is your trusted local plumbing company serving Oceanside, Carlsbad, Escondido, and surrounding areas. We specialize in emergency plumbing, water heater repair and replacement, drain cleaning, sewer line repair, and full residential plumbing services. Licensed, bonded, and insured. Available 24/7 for plumbing emergencies. Serving North County San Diego since 2008.",
    status: "approved",
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: "content-004",
    tenantId: "tenant-medspa",
    type: "faq",
    title: "Botox Treatment FAQ Block",
    content:
      "Q: How long does Botox last?\nA: Botox results typically last 3-4 months. With regular treatments, some patients notice longer-lasting effects over time.\n\nQ: Does Botox hurt?\nA: Most patients describe a brief pinching sensation. We use the finest needles available and can apply topical numbing if requested.\n\nQ: How soon will I see results?\nA: You'll begin to see results within 3-5 days, with full effect visible at the 2-week mark.\n\nQ: What areas can Botox treat?\nA: Forehead lines, frown lines between the brows, crow's feet, bunny lines, lip lines, and more.\n\nQ: Is there any downtime?\nA: No downtime required. Most patients return to normal activities immediately after treatment.",
    status: "published",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: "content-005",
    tenantId: "tenant-medspa",
    type: "geo-brief",
    title:
      'GEO Content Brief: "What is the best treatment for wrinkles in [City]?"',
    content:
      "Target query: 'best wrinkle treatment [city name]'\nSearch intent: Informational → decision\nFormat: Comparison guide with local authority signals\n\nKey points to address:\n1. Types of wrinkle treatments available (Botox, fillers, laser, RF)\n2. How to choose the right treatment\n3. What to expect during consultation\n4. Local expertise and credentials\n5. FAQ block with 5 direct questions\n\nCall to action: Book a free consultation\nSchema: FAQPage + MedicalProcedure + LocalBusiness",
    status: "draft",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
];
