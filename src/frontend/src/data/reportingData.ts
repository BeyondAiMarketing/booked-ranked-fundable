import type {
  ClientReport,
  ReportSchedule,
  ReportSection,
} from "../types/reporting";
import {
  AUDIT_SCORES,
  LEADS,
  MONTHLY_DATA,
  REVIEWS,
  TENANTS,
} from "./demoData";

const NICHE_LABELS: Record<string, string> = {
  "tenant-oceanside": "restoration",
  "tenant-plumbing": "plumbing",
  "tenant-medspa": "med spa",
  "tenant-demo": "local service",
};

export function generateDemoReport(
  tenantId: string,
  reportType: "weekly" | "monthly",
  periodLabel: string,
): ClientReport {
  const tenantLeads = LEADS[tenantId] ?? [];
  const tenantReviews = REVIEWS[tenantId] ?? [];
  const auditData = AUDIT_SCORES[tenantId];
  const tenant = TENANTS.find((t) => t.id === tenantId);
  const niche = NICHE_LABELS[tenantId] ?? "local service";

  const newLeads = tenantLeads.filter((l) => l.status === "new").length;
  const qualifiedLeads = tenantLeads.filter(
    (l) => l.status === "qualified",
  ).length;
  const closedLeads = tenantLeads.filter((l) => l.status === "closed").length;
  const totalLeads = tenantLeads.length;

  const avgRating = tenantReviews.length
    ? tenantReviews.reduce((s, r) => s + r.rating, 0) / tenantReviews.length
    : 0;
  const fiveStarCount = tenantReviews.filter((r) => r.rating === 5).length;

  const auditScore = auditData?.total ?? 64;
  const lastMonthData = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonthData = MONTHLY_DATA[MONTHLY_DATA.length - 2];

  const leadTrend =
    lastMonthData.leads > prevMonthData.leads
      ? "up"
      : lastMonthData.leads < prevMonthData.leads
        ? "down"
        : "stable";
  const leadTrendPct =
    prevMonthData.leads > 0
      ? Math.round(
          (Math.abs(lastMonthData.leads - prevMonthData.leads) /
            prevMonthData.leads) *
            100,
        )
      : 0;

  const reviewTrend =
    lastMonthData.reviews > prevMonthData.reviews
      ? "up"
      : lastMonthData.reviews < prevMonthData.reviews
        ? "down"
        : "stable";
  const reviewTrendPct =
    prevMonthData.reviews > 0
      ? Math.round(
          (Math.abs(lastMonthData.reviews - prevMonthData.reviews) /
            prevMonthData.reviews) *
            100,
        )
      : 0;

  const conversionRate =
    totalLeads > 0
      ? Math.round(((qualifiedLeads + closedLeads) / totalLeads) * 100)
      : 0;

  const sections: ReportSection[] = [
    {
      title: "New Leads",
      metric: "leads_new",
      value: String(reportType === "weekly" ? newLeads : lastMonthData.leads),
      trend: leadTrend,
      trendValue: `${leadTrendPct}% from last ${reportType === "weekly" ? "week" : "month"}`,
      description: `${newLeads} new leads entered the pipeline this ${reportType === "weekly" ? "week" : "month"}. ${qualifiedLeads} are currently qualified and moving toward close.`,
      recommendation:
        newLeads < 5
          ? "Lead volume is below target. Consider increasing ad spend or launching a referral campaign."
          : "Lead volume is strong. Focus on rapid follow-up within 5 minutes to maximize close rate.",
    },
    {
      title: "Lead Conversion",
      metric: "leads_conversion",
      value: `${conversionRate}%`,
      trend: conversionRate >= 30 ? "up" : "down",
      trendValue:
        conversionRate >= 30 ? "+4% from last period" : "-3% from last period",
      description: `${conversionRate}% of leads advanced from new to qualified or closed. Industry average for ${niche} businesses is 28-35%.`,
      recommendation:
        conversionRate < 25
          ? "Follow up with leads in 'contacted' stage — they're going cold. A personalized text within 24 hours can recover 30% of stale leads."
          : "Conversion rate is healthy. Document your best follow-up scripts for the team.",
    },
    {
      title: "Reviews Earned",
      metric: "reviews_count",
      value: String(
        reportType === "weekly"
          ? Math.min(tenantReviews.length, 3)
          : lastMonthData.reviews,
      ),
      trend: reviewTrend,
      trendValue: `${reviewTrendPct}% from last ${reportType === "weekly" ? "week" : "month"}`,
      description: `${tenantReviews.length} total reviews across Google, Yelp, and Facebook. ${fiveStarCount} are five-star reviews.`,
      recommendation:
        tenantReviews.length < 10
          ? "Send review requests to your last 20 customers via SMS today. A simple text asking for a Google review has a 23% completion rate."
          : "Great review volume! Respond to every review within 24 hours — even positive ones. It signals engagement to Google.",
    },
    {
      title: "Average Rating",
      metric: "avg_rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "N/A",
      trend: avgRating >= 4.5 ? "up" : avgRating >= 4.0 ? "stable" : "down",
      trendValue:
        avgRating >= 4.5
          ? "+0.1 from last period"
          : avgRating >= 4.0
            ? "No change"
            : "-0.2 from last period",
      description: `Your average rating is ${avgRating > 0 ? avgRating.toFixed(1) : "N/A"} stars. ${niche.charAt(0).toUpperCase() + niche.slice(1)} businesses with 4.7+ ratings convert 42% more website visitors.`,
      recommendation:
        avgRating < 4.5
          ? "Prioritize getting more 5-star reviews to push your average above 4.7. A single low review can be offset by 5 new high-quality reviews."
          : "Excellent rating! Feature your star rating prominently on your website and Google Ads to maximize trust.",
    },
    {
      title: "Audit Score",
      metric: "audit_score",
      value: `${auditScore}/100`,
      trend: auditScore >= 70 ? "up" : "down",
      trendValue:
        auditScore >= 70
          ? "+3 pts from last period"
          : "-2 pts from last period",
      description: `SEO & website audit score is ${auditScore}/100. ${auditScore >= 70 ? `Good standing — above average for ${niche} businesses.` : "Below average — competitors with higher scores are capturing leads you're missing."}`,
      recommendation: auditData?.recommendations?.[0]?.text
        ? `Top priority: ${auditData.recommendations[0].text}`
        : "Run a full audit to identify the top 3 SEO improvements this month.",
    },
    {
      title: "Campaign Performance",
      metric: "campaign_perf",
      value: `${Math.round(conversionRate * 0.8 + 12)}%`,
      trend: "stable",
      trendValue: "+1% from last period",
      description:
        "Email open rates and ad click-through rates are tracking within target range. Campaign engagement is consistent.",
      recommendation: `A/B test your top campaign subject line — swapping the opener with a question typically lifts open rates 12-18% for ${niche} businesses.`,
    },
  ];

  // Composite score: weighted blend of audit, rating, conversion, lead volume
  const ratingScore = Math.min(100, Math.round(avgRating * 20));
  const conversionScore = Math.min(100, conversionRate * 2.5);
  const overallScore = Math.round(
    auditScore * 0.35 +
      ratingScore * 0.3 +
      conversionScore * 0.2 +
      Math.min(100, totalLeads * 8) * 0.15,
  );

  const tenantName = tenant?.name ?? "Your Business";

  const aiNarrative =
    reportType === "weekly"
      ? `This week, ${tenantName} showed solid performance across the core growth metrics. With ${newLeads} new leads entering the pipeline, your acquisition engine is running — and your ${avgRating > 0 ? `${avgRating.toFixed(1)}-star` : ""} average rating continues to build the trust that converts first-time visitors into booked jobs. Your overall health score of ${overallScore}/100 reflects a business that is actively growing.

The area that deserves the most attention right now is lead conversion. Getting a prospect to contact you is expensive — turning that contact into a booked job is where the real ROI lives. Your current ${conversionRate}% conversion rate has room to grow, and the single highest-impact action you can take is faster follow-up. The data consistently shows that responding within 5 minutes of a lead inquiry increases close rates by 9x.

On the SEO side, your audit score of ${auditScore}/100 means there are specific technical improvements that, once made, will put you in front of prospects currently finding your competitors. Your top priority this week is listed in the Next Steps section below — tackle it now and you'll see ranking movement within 30-45 days.`
      : `${tenantName} closed ${periodLabel} with an overall platform health score of ${overallScore}/100 — a strong foundation to build from heading into the next month. ${lastMonthData.leads} leads came through the pipeline, ${fiveStarCount} five-star reviews were earned, and your SEO audit score sits at ${auditScore}/100.

The data tells a clear story: your reputation is your strongest asset. With a ${avgRating > 0 ? avgRating.toFixed(1) : "N/A"}-star average across ${tenantReviews.length} reviews, you're in the top tier of ${niche} businesses in your market. The businesses that pull away from competitors in the next 6-12 months are the ones that pair a strong reputation with consistent lead follow-up and an optimized online presence. You have the reputation — now is the time to sharpen the other two.

For next month, your growth priorities are: (1) increase monthly review volume to lock in your reputation moat, (2) reduce lead response time to under 5 minutes to lift your conversion rate, and (3) execute the top SEO recommendation to close the gap between your score and the 80+ benchmark. Each of these actions compounds — the business that does all three consistently will be the clear market leader in your area within 90 days.`;

  const topWins: string[] = [
    newLeads >= 5
      ? `Generated ${newLeads} new leads this ${reportType === "weekly" ? "week" : "month"} — pipeline is active and healthy`
      : `Maintained active lead pipeline with ${totalLeads} total prospects in CRM`,
    fiveStarCount >= 2
      ? `Earned ${fiveStarCount} five-star reviews this period — reputation momentum is building`
      : `Maintained ${avgRating > 0 ? `${avgRating.toFixed(1)}-star` : "positive"} average rating across all platforms`,
    auditScore >= 70
      ? `SEO audit score of ${auditScore}/100 is above industry average — ranking advantage maintained`
      : "Identified top 2 high-priority SEO improvements — executing them will unlock ranking gains",
  ];

  const nextSteps: string[] = [
    auditData?.recommendations?.[0]
      ? `${auditData.recommendations[0].priority} priority: ${auditData.recommendations[0].text}`
      : "Complete your Google Business Profile — missing info is hurting your local rankings",
    tenantLeads.filter((l) => l.status === "contacted").length > 0
      ? `Follow up with ${tenantLeads.filter((l) => l.status === "contacted").length} leads currently in 'contacted' stage — send a personalized text today`
      : "Set up automated lead follow-up sequences to ensure no new lead goes cold",
    tenantReviews.length < 15
      ? "Send review requests to your last 10 completed jobs — target 15+ total reviews this quarter"
      : "Respond to all unanswered reviews this week to show active engagement to Google",
  ];

  return {
    id: `report-${tenantId}-${Date.now()}`,
    tenantId,
    reportType,
    periodLabel,
    generatedAt: Date.now(),
    sections,
    aiNarrative,
    topWins,
    nextSteps,
    overallScore: Math.min(100, Math.max(0, overallScore)),
  };
}

// Pre-generated demo reports going back 6-8 weeks
const now = Date.now();
const DAY = 86400000;
const WEEK = 7 * DAY;

function makeReport(
  tenantId: string,
  reportType: "weekly" | "monthly",
  periodLabel: string,
  weeksAgo: number,
  scoreDelta = 0,
): ClientReport {
  const base = generateDemoReport(tenantId, reportType, periodLabel);
  return {
    ...base,
    id: `report-${tenantId}-${reportType}-${weeksAgo}`,
    generatedAt: now - weeksAgo * WEEK,
    deliveredAt: now - weeksAgo * WEEK + 300000,
    overallScore: Math.min(100, Math.max(30, base.overallScore + scoreDelta)),
  };
}

export const DEMO_REPORTS: ClientReport[] = [
  // tenant-oceanside weekly reports
  makeReport("tenant-oceanside", "weekly", "Week of Apr 14, 2026", 0, 0),
  makeReport("tenant-oceanside", "weekly", "Week of Apr 7, 2026", 1, -3),
  makeReport("tenant-oceanside", "weekly", "Week of Mar 31, 2026", 2, -5),
  makeReport("tenant-oceanside", "monthly", "March 2026", 2, 2),
  makeReport("tenant-oceanside", "monthly", "February 2026", 6, -4),

  // tenant-plumbing reports
  makeReport("tenant-plumbing", "weekly", "Week of Apr 14, 2026", 0, 0),
  makeReport("tenant-plumbing", "weekly", "Week of Apr 7, 2026", 1, -2),
  makeReport("tenant-plumbing", "monthly", "March 2026", 2, 5),

  // tenant-medspa reports
  makeReport("tenant-medspa", "weekly", "Week of Apr 14, 2026", 0, 0),
  makeReport("tenant-medspa", "monthly", "March 2026", 2, 3),
  makeReport("tenant-medspa", "monthly", "February 2026", 6, -2),

  // tenant-demo reports
  makeReport("tenant-demo", "weekly", "Week of Apr 14, 2026", 0, 0),
  makeReport("tenant-demo", "weekly", "Week of Apr 7, 2026", 1, -4),
];

export const DEMO_REPORT_SCHEDULES: ReportSchedule[] = [
  {
    tenantId: "tenant-oceanside",
    weeklyEnabled: true,
    monthlyEnabled: true,
    deliveryDayOfWeek: 1,
    deliveryHour: 8,
    lastGeneratedAt: now - WEEK,
  },
  {
    tenantId: "tenant-plumbing",
    weeklyEnabled: true,
    monthlyEnabled: true,
    deliveryDayOfWeek: 1,
    deliveryHour: 8,
    lastGeneratedAt: now - WEEK,
  },
  {
    tenantId: "tenant-medspa",
    weeklyEnabled: true,
    monthlyEnabled: false,
    deliveryDayOfWeek: 1,
    deliveryHour: 9,
    lastGeneratedAt: now - WEEK,
  },
  {
    tenantId: "tenant-demo",
    weeklyEnabled: true,
    monthlyEnabled: true,
    deliveryDayOfWeek: 1,
    deliveryHour: 8,
  },
];
