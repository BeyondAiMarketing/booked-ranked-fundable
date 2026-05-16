// Paid Ads Agent — demo data

export interface AdCampaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "ended";
  channel: "google" | "facebook" | "instagram" | "bing";
  objective: string;
  budget: number; // monthly
  spend: number; // this month
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // %
  cpc: number; // $
  roas: number; // x
  startDate: string;
  endDate?: string;
  tags: string[];
}

export interface AdCopyVariant {
  id: string;
  campaignId: string;
  headline: string;
  description: string;
  cta: string;
  status: "active" | "paused" | "draft" | "winner";
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  isControl: boolean;
  notes: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  type: "remarketing" | "lookalike" | "interest" | "keyword" | "custom";
  size: string;
  description: string;
  campaigns: string[];
  performance: "high" | "medium" | "low";
}

export interface AdOpportunity {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  type: "copy" | "audience" | "budget" | "landing" | "schedule" | "keyword";
  recommendation: string;
}

export interface PaidAdsKpis {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCtr: number;
  avgCpc: number;
  avgRoas: number;
  monthOverMonthLeadChange: number;
  monthOverMonthSpendChange: number;
}

export const DEMO_PAID_ADS_CAMPAIGNS: AdCampaign[] = [
  {
    id: "camp-001",
    name: "Emergency Services — Google Search",
    status: "active",
    channel: "google",
    objective: "Lead generation",
    budget: 1200,
    spend: 843,
    impressions: 12400,
    clicks: 521,
    conversions: 34,
    ctr: 4.2,
    cpc: 1.62,
    roas: 5.8,
    startDate: "2026-03-01",
    tags: ["emergency", "search", "high-intent"],
  },
  {
    id: "camp-002",
    name: "Service Area Brand Awareness",
    status: "active",
    channel: "google",
    objective: "Brand awareness",
    budget: 400,
    spend: 287,
    impressions: 38200,
    clicks: 189,
    conversions: 8,
    ctr: 0.49,
    cpc: 1.52,
    roas: 2.1,
    startDate: "2026-02-15",
    tags: ["brand", "display"],
  },
  {
    id: "camp-003",
    name: "Spring Promo — Drain Cleaning Special",
    status: "active",
    channel: "google",
    objective: "Lead generation",
    budget: 600,
    spend: 412,
    impressions: 7800,
    clicks: 298,
    conversions: 21,
    ctr: 3.82,
    cpc: 1.38,
    roas: 6.4,
    startDate: "2026-03-15",
    endDate: "2026-04-30",
    tags: ["promo", "seasonal"],
  },
  {
    id: "camp-004",
    name: "Facebook Retargeting — Website Visitors",
    status: "active",
    channel: "facebook",
    objective: "Remarketing",
    budget: 300,
    spend: 198,
    impressions: 22100,
    clicks: 312,
    conversions: 14,
    ctr: 1.41,
    cpc: 0.63,
    roas: 4.2,
    startDate: "2026-03-01",
    tags: ["retargeting", "facebook"],
  },
  {
    id: "camp-005",
    name: "Water Heater Replacement — Keywords",
    status: "paused",
    channel: "google",
    objective: "Lead generation",
    budget: 500,
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
    startDate: "2026-04-15",
    tags: ["water-heater", "search"],
  },
];

export const DEMO_AD_COPY_VARIANTS: AdCopyVariant[] = [
  {
    id: "copy-001",
    campaignId: "camp-001",
    headline: "24/7 Emergency Plumber — Fast Response",
    description:
      "Licensed & insured. On-site in 60 minutes. Call now for same-day service in your area.",
    cta: "Call Now",
    status: "winner",
    impressions: 7200,
    clicks: 312,
    ctr: 4.33,
    conversions: 22,
    isControl: true,
    notes: "Best performer — 28% higher CTR than Variant B",
  },
  {
    id: "copy-002",
    campaignId: "camp-001",
    headline: "Emergency Plumbing Services — Same Day",
    description:
      "Burst pipe? Blocked drain? We fix it fast. Upfront pricing, no hidden fees.",
    cta: "Get Help Now",
    status: "paused",
    impressions: 5200,
    clicks: 209,
    ctr: 4.02,
    conversions: 12,
    isControl: false,
    notes: "Lower CTR. Paused after 2-week test.",
  },
  {
    id: "copy-003",
    campaignId: "camp-003",
    headline: "Drain Cleaning Special — $89 This Month",
    description:
      "Professional drain cleaning service. Clear blockages fast. Limited-time spring offer.",
    cta: "Book Online",
    status: "active",
    impressions: 4100,
    clicks: 168,
    ctr: 4.1,
    conversions: 13,
    isControl: true,
    notes: "Running A/B test with Variant B",
  },
  {
    id: "copy-004",
    campaignId: "camp-003",
    headline: "Clogged Drain? Fixed Today for $89",
    description:
      "Stop letting slow drains ruin your day. Expert drain cleaning with upfront pricing.",
    cta: "Get Free Quote",
    status: "active",
    impressions: 3700,
    clicks: 130,
    ctr: 3.51,
    conversions: 8,
    isControl: false,
    notes: "Testing price-forward headline vs. benefit-forward",
  },
  {
    id: "copy-005",
    campaignId: "camp-004",
    headline: "Still Thinking? We're Still Available.",
    description:
      "You visited our site — let's finish the job. Same great pricing, fast booking.",
    cta: "Book Now",
    status: "active",
    impressions: 22100,
    clicks: 312,
    ctr: 1.41,
    conversions: 14,
    isControl: true,
    notes: "Retargeting creative performing well at $0.63 CPC",
  },
];

export const DEMO_AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: "aud-001",
    name: "Website Visitors — Last 30 Days",
    type: "remarketing",
    size: "~1,200 users",
    description:
      "All users who visited the website in the past 30 days and did not convert.",
    campaigns: ["camp-004"],
    performance: "high",
  },
  {
    id: "aud-002",
    name: "Homeowners — High Intent",
    type: "interest",
    size: "~18,000 users",
    description:
      "Homeowners in service area with recent home improvement intent signals.",
    campaigns: ["camp-001", "camp-002"],
    performance: "high",
  },
  {
    id: "aud-003",
    name: "Lookalike — Past Customers",
    type: "lookalike",
    size: "~8,400 users",
    description:
      "Facebook lookalike audience based on past customer list (240 contacts uploaded).",
    campaigns: ["camp-004"],
    performance: "medium",
  },
  {
    id: "aud-004",
    name: "Emergency Intent Keywords",
    type: "keyword",
    size: "Search network",
    description:
      "High-intent keywords: emergency plumber, burst pipe, blocked drain, plumber near me.",
    campaigns: ["camp-001"],
    performance: "high",
  },
  {
    id: "aud-005",
    name: "Seasonal Interest — Spring Projects",
    type: "interest",
    size: "~24,000 users",
    description:
      "Homeowners showing spring home improvement interest — drain, outdoor plumbing.",
    campaigns: ["camp-003"],
    performance: "medium",
  },
];

export const DEMO_ADS_OPPORTUNITIES: AdOpportunity[] = [
  {
    id: "opp-ads-001",
    title: "Expand emergency keywords to include city-specific terms",
    description:
      'Current keyword set is broad. Adding city + service terms (e.g., "plumber in [city]") can reduce CPC and improve quality score.',
    impact: "high",
    effort: "low",
    type: "keyword",
    recommendation:
      "Add 12-18 city-specific long-tail keywords to the Emergency Services campaign.",
  },
  {
    id: "opp-ads-002",
    title: "Create a dedicated landing page for each campaign",
    description:
      "All campaigns currently route to the homepage. Dedicated landing pages can improve conversion rates by 30-50%.",
    impact: "high",
    effort: "medium",
    type: "landing",
    recommendation:
      "Build 3 campaign-specific landing pages matching ad messaging to page headline.",
  },
  {
    id: "opp-ads-003",
    title: "Test time-of-day bid adjustments",
    description:
      "Emergency call data shows peak hours 6am-10am and 6pm-10pm. Higher bids during these windows can capture more high-intent traffic.",
    impact: "medium",
    effort: "low",
    type: "schedule",
    recommendation:
      "Increase bids +30% during morning and evening peak hours. Reduce by 20% overnight.",
  },
  {
    id: "opp-ads-004",
    title: "Add customer review extensions to Google Ads",
    description:
      "Review extensions increase trust and can improve CTR by 10-15%. Your Google rating qualifies.",
    impact: "medium",
    effort: "low",
    type: "copy",
    recommendation:
      "Enable seller rating extensions and add 2-3 testimonial-based ad assets.",
  },
  {
    id: "opp-ads-005",
    title: "Increase retargeting budget for high-converting segment",
    description:
      "Website Visitors audience is converting at 4.5% — one of the highest in the account. Current budget is under-serving this audience.",
    impact: "high",
    effort: "low",
    type: "budget",
    recommendation:
      "Increase Facebook retargeting budget from $300 to $500/mo for this segment.",
  },
];

export const DEMO_PAID_ADS_KPIS: PaidAdsKpis = {
  totalSpend: 1740,
  totalImpressions: 80500,
  totalClicks: 1320,
  totalConversions: 77,
  avgCtr: 1.64,
  avgCpc: 1.32,
  avgRoas: 4.8,
  monthOverMonthLeadChange: 18,
  monthOverMonthSpendChange: 12,
};

// ---- Scorecard ----
export interface PaidAdsScoreFactor {
  name: string;
  score: number;
  note: string;
}

export interface PaidAdsScorecard {
  tenantId: string;
  accountHealthScore: number;
  previousAccountHealthScore: number;
  roasEfficiencyScore: number;
  previousRoasEfficiencyScore: number;
  audienceQualityScore: number;
  previousAudienceQualityScore: number;
  budgetUtilizationScore: number;
  previousBudgetUtilizationScore: number;
  accountHealthFactors: PaidAdsScoreFactor[];
  roasEfficiencyFactors: PaidAdsScoreFactor[];
  audienceQualityFactors: PaidAdsScoreFactor[];
  budgetUtilizationFactors: PaidAdsScoreFactor[];
}

// ---- Alerts ----
export interface PaidAdsAlert {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category:
    | "budget"
    | "performance"
    | "audience"
    | "copy"
    | "landing-page"
    | "bidding";
  status: "open" | "in_progress" | "resolved";
  area: string;
  suggestedFix: string;
  owner?: string;
}

// ---- Performance History ----
export interface PaidAdsPerformanceMonth {
  tenantId: string;
  month: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  avgCpc: number;
  roas: number;
  accountHealthScore: number;
  roasEfficiencyScore: number;
}

export const DEMO_PAID_ADS_SCORECARD: PaidAdsScorecard[] = [
  {
    tenantId: "tenant-plumbing",
    accountHealthScore: 74,
    previousAccountHealthScore: 68,
    roasEfficiencyScore: 81,
    previousRoasEfficiencyScore: 76,
    audienceQualityScore: 67,
    previousAudienceQualityScore: 63,
    budgetUtilizationScore: 79,
    previousBudgetUtilizationScore: 72,
    accountHealthFactors: [
      {
        name: "Conversion Tracking",
        score: 90,
        note: "All key conversions tracked correctly",
      },
      { name: "Ad Approval Rate", score: 88, note: "2 ads pending review" },
      {
        name: "Quality Score Average",
        score: 72,
        note: "3 keywords below 6/10",
      },
      {
        name: "Campaign Structure",
        score: 65,
        note: "Ad groups need tightening",
      },
      {
        name: "Landing Page Alignment",
        score: 58,
        note: "Homepage landing page needs CRO work",
      },
    ],
    roasEfficiencyFactors: [
      {
        name: "ROAS (Return on Ad Spend)",
        score: 85,
        note: "4.2x average this month",
      },
      {
        name: "Cost Per Lead Efficiency",
        score: 80,
        note: "$34 CPL vs $42 industry avg",
      },
      {
        name: "Top Performing Keywords",
        score: 78,
        note: "12 keywords driving 80% of conversions",
      },
      {
        name: "Negative Keyword Coverage",
        score: 72,
        note: "Some irrelevant traffic still leaking",
      },
      {
        name: "Bid Strategy Optimization",
        score: 68,
        note: "Target CPA not fully optimized",
      },
    ],
    audienceQualityFactors: [
      {
        name: "Remarketing Coverage",
        score: 72,
        note: "Website visitors audience active",
      },
      {
        name: "Lookalike Audience Performance",
        score: 68,
        note: "New lookalike performing well",
      },
      {
        name: "In-Market Audience Targeting",
        score: 65,
        note: "Home services segment active",
      },
      {
        name: "Geographic Targeting Precision",
        score: 62,
        note: "12-mile radius could be tightened",
      },
      {
        name: "Demographic Filtering",
        score: 55,
        note: "Age/income overlays not yet applied",
      },
    ],
    budgetUtilizationFactors: [
      {
        name: "Budget Pacing",
        score: 84,
        note: "Spend on track for monthly target",
      },
      {
        name: "Peak Hour Scheduling",
        score: 80,
        note: "Dayparting active for evening hours",
      },
      {
        name: "Device Bid Adjustments",
        score: 76,
        note: "Mobile bids adjusted +15%",
      },
      {
        name: "Seasonal Budget Adjustments",
        score: 72,
        note: "Summer ramp-up planned",
      },
      {
        name: "Wasted Spend Reduction",
        score: 62,
        note: "Search terms audit due this week",
      },
    ],
  },
  {
    tenantId: "tenant-medspa",
    accountHealthScore: 71,
    previousAccountHealthScore: 65,
    roasEfficiencyScore: 78,
    previousRoasEfficiencyScore: 71,
    audienceQualityScore: 82,
    previousAudienceQualityScore: 75,
    budgetUtilizationScore: 74,
    previousBudgetUtilizationScore: 68,
    accountHealthFactors: [
      {
        name: "Conversion Tracking",
        score: 88,
        note: "Booking events tracked correctly",
      },
      {
        name: "Ad Approval Rate",
        score: 82,
        note: "Healthcare compliance required for 1 ad",
      },
      {
        name: "Quality Score Average",
        score: 70,
        note: "2 keywords need optimization",
      },
      {
        name: "Campaign Structure",
        score: 62,
        note: "Service-specific campaigns needed",
      },
      {
        name: "Landing Page Alignment",
        score: 60,
        note: "Services page needs booking CTA",
      },
    ],
    roasEfficiencyFactors: [
      {
        name: "ROAS (Return on Ad Spend)",
        score: 82,
        note: "3.8x average this month",
      },
      {
        name: "Cost Per Lead Efficiency",
        score: 78,
        note: "$42 CPL for high-ticket services",
      },
      {
        name: "Top Performing Keywords",
        score: 76,
        note: "Botox and filler keywords strongest",
      },
      {
        name: "Negative Keyword Coverage",
        score: 74,
        note: "Non-medical terms filtered",
      },
      {
        name: "Bid Strategy Optimization",
        score: 72,
        note: "Target ROAS strategy performing well",
      },
    ],
    audienceQualityFactors: [
      {
        name: "Remarketing Coverage",
        score: 88,
        note: "Strong past-visitor audience built",
      },
      {
        name: "Lookalike Audience Performance",
        score: 84,
        note: "Value-based lookalike active",
      },
      {
        name: "In-Market Audience Targeting",
        score: 82,
        note: "Beauty & wellness segment",
      },
      {
        name: "Geographic Targeting Precision",
        score: 80,
        note: "8-mile radius in affluent zip codes",
      },
      {
        name: "Demographic Filtering",
        score: 72,
        note: "Women 28-55 primary segment",
      },
    ],
    budgetUtilizationFactors: [
      { name: "Budget Pacing", score: 80, note: "Slight underspend mid-month" },
      {
        name: "Peak Hour Scheduling",
        score: 76,
        note: "Lunch hour and evenings prioritized",
      },
      {
        name: "Device Bid Adjustments",
        score: 74,
        note: "Desktop converts better for this niche",
      },
      {
        name: "Seasonal Budget Adjustments",
        score: 72,
        note: "Holiday season budget plan ready",
      },
      {
        name: "Wasted Spend Reduction",
        score: 62,
        note: "Some broad match waste detected",
      },
    ],
  },
];

export const DEMO_PAID_ADS_ALERTS: PaidAdsAlert[] = [
  {
    id: "alert-1",
    tenantId: "tenant-plumbing",
    title: "Landing Page Bounce Rate Too High",
    description:
      "Your primary ad landing page (homepage) has a 78% bounce rate from paid traffic. This is wasting budget and suppressing Quality Scores.",
    severity: "critical",
    category: "landing-page",
    status: "open",
    area: "Homepage / Landing Page",
    suggestedFix:
      "Create a dedicated service-specific landing page with a single clear CTA, phone number above the fold, and trust signals. This alone can reduce CPA by 30-50%.",
  },
  {
    id: "alert-2",
    tenantId: "tenant-plumbing",
    title: "3 Keywords with Quality Score Below 5",
    description:
      "Low Quality Scores on key terms increase your CPC and reduce ad position. These keywords are costing more than they should.",
    severity: "high",
    category: "performance",
    status: "in_progress",
    area: "Emergency Plumber Campaign",
    suggestedFix:
      "Tighten ad copy to match these keywords exactly, and align landing page content to the search intent. Target 7+ Quality Score.",
    owner: "Agent Team",
  },
  {
    id: "alert-3",
    tenantId: "tenant-plumbing",
    title: "Search Term Waste Detected",
    description:
      "14 search terms in the last 30 days generated clicks but zero conversions and consumed $340 of budget.",
    severity: "high",
    category: "budget",
    status: "open",
    area: "All Campaigns",
    suggestedFix:
      "Add these terms as negative keywords immediately to stop the bleed. Run a weekly search term audit going forward.",
  },
  {
    id: "alert-4",
    tenantId: "tenant-plumbing",
    title: "Ad Schedule Misaligned with Conversion Windows",
    description:
      "Ads are running 24/7 but 73% of booked jobs come from clicks between 6am-8pm. Nighttime spend is inefficient.",
    severity: "medium",
    category: "bidding",
    status: "open",
    area: "Campaign Schedule",
    suggestedFix:
      "Implement dayparting with reduced bids or pause from midnight-5am. Reallocate that budget to peak conversion hours.",
  },
  {
    id: "alert-5",
    tenantId: "tenant-plumbing",
    title: "Remarketing List Under 100 Users",
    description:
      "Your remarketing audience is too small to effectively deliver ads. Under 100 users means Google cannot optimize or serve these ads.",
    severity: "medium",
    category: "audience",
    status: "open",
    area: "Audience Lists",
    suggestedFix:
      "Ensure tracking code is installed on all key pages. Consider extending the lookback window to 90-180 days to grow the list faster.",
  },
  {
    id: "alert-6",
    tenantId: "tenant-plumbing",
    title: "Ad Copy A/B Test Stale",
    description:
      "Your current ad copy test has been running for 45 days without a clear winner declared. Stale tests waste impressions.",
    severity: "low",
    category: "copy",
    status: "open",
    area: "Ad Copy Tests",
    suggestedFix:
      "Pause the lower-performing variant and create a new challenger. Rotate fresh creative every 30-45 days.",
  },
  {
    id: "alert-7",
    tenantId: "tenant-medspa",
    title: "Healthcare Ad Policy Compliance Risk",
    description:
      "1 active ad may violate Google healthcare advertising policies. This could lead to account suspension if not addressed.",
    severity: "critical",
    category: "copy",
    status: "in_progress",
    area: "Botox Campaign Ad Copy",
    suggestedFix:
      "Remove any before/after imagery references and ensure ad copy complies with Google's sensitive health categories policy.",
    owner: "Agent Team",
  },
  {
    id: "alert-8",
    tenantId: "tenant-medspa",
    title: "Consultation Booking Page Missing Trust Signals",
    description:
      "The landing page receiving ad traffic has no reviews, credentials, or before/after section. Conversion rate is 2.1% vs 5-7% industry standard.",
    severity: "high",
    category: "landing-page",
    status: "open",
    area: "Consultation Landing Page",
    suggestedFix:
      "Add provider credentials, Google review widget, and a brief consultation process explainer. Expected conversion improvement: 2-4x.",
  },
];

export const DEMO_PAID_ADS_PERFORMANCE_HISTORY: PaidAdsPerformanceMonth[] = [
  {
    tenantId: "tenant-plumbing",
    month: "2026-04",
    spend: 2847,
    impressions: 48200,
    clicks: 1243,
    conversions: 89,
    ctr: 2.58,
    avgCpc: 2.29,
    roas: 4.2,
    accountHealthScore: 74,
    roasEfficiencyScore: 81,
  },
  {
    tenantId: "tenant-plumbing",
    month: "2026-03",
    spend: 2650,
    impressions: 44100,
    clicks: 1108,
    conversions: 78,
    ctr: 2.51,
    avgCpc: 2.39,
    roas: 3.8,
    accountHealthScore: 68,
    roasEfficiencyScore: 76,
  },
  {
    tenantId: "tenant-plumbing",
    month: "2026-02",
    spend: 2400,
    impressions: 40200,
    clicks: 1018,
    conversions: 71,
    ctr: 2.53,
    avgCpc: 2.36,
    roas: 3.6,
    accountHealthScore: 64,
    roasEfficiencyScore: 71,
  },
  {
    tenantId: "tenant-plumbing",
    month: "2026-01",
    spend: 2100,
    impressions: 36800,
    clicks: 916,
    conversions: 62,
    ctr: 2.49,
    avgCpc: 2.29,
    roas: 3.4,
    accountHealthScore: 60,
    roasEfficiencyScore: 66,
  },
  {
    tenantId: "tenant-plumbing",
    month: "2025-12",
    spend: 3200,
    impressions: 52000,
    clicks: 1352,
    conversions: 101,
    ctr: 2.6,
    avgCpc: 2.37,
    roas: 4.5,
    accountHealthScore: 72,
    roasEfficiencyScore: 78,
  },
  {
    tenantId: "tenant-plumbing",
    month: "2025-11",
    spend: 2200,
    impressions: 38600,
    clicks: 990,
    conversions: 72,
    ctr: 2.56,
    avgCpc: 2.22,
    roas: 3.9,
    accountHealthScore: 66,
    roasEfficiencyScore: 72,
  },
  {
    tenantId: "tenant-medspa",
    month: "2026-04",
    spend: 4200,
    impressions: 62400,
    clicks: 1560,
    conversions: 112,
    ctr: 2.5,
    avgCpc: 2.69,
    roas: 3.8,
    accountHealthScore: 71,
    roasEfficiencyScore: 78,
  },
  {
    tenantId: "tenant-medspa",
    month: "2026-03",
    spend: 3800,
    impressions: 56200,
    clicks: 1405,
    conversions: 96,
    ctr: 2.5,
    avgCpc: 2.71,
    roas: 3.4,
    accountHealthScore: 65,
    roasEfficiencyScore: 71,
  },
  {
    tenantId: "tenant-medspa",
    month: "2026-02",
    spend: 3500,
    impressions: 51000,
    clicks: 1275,
    conversions: 86,
    ctr: 2.5,
    avgCpc: 2.75,
    roas: 3.2,
    accountHealthScore: 60,
    roasEfficiencyScore: 66,
  },
];
