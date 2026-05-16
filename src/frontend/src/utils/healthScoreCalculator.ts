import type { AgentSubscription } from "../data/agentData";
import type { Lead } from "../data/demoData";
import type {
  ClientHealthScore,
  HealthScoreComponent,
} from "../types/healthScore";
import { getComponentStatus } from "../types/healthScore";

export interface Review {
  author: string;
  platform: string;
  rating: number;
  comment: string;
  sentiment?: string;
}

export interface AuditScore {
  seoScore?: number;
  technicalScore?: number;
  contentScore?: number;
  conversionScore?: number;
  gmb?: number;
  website?: number;
  citations?: number;
  backlinks?: number;
  total?: number;
}

interface HealthScoreInput {
  leads: Lead[];
  reviews: Review[];
  auditScore?: AuditScore;
  agentSubscriptions: AgentSubscription[];
}

function calcLeadsScore(leads: Lead[]): number {
  let score = 40;
  const activeLeads = leads.filter(
    (l) =>
      l.status === "new" ||
      l.status === "contacted" ||
      l.status === "qualified",
  );
  // +5 per active lead, up to 25 additional
  score += Math.min(activeLeads.length * 5, 25);
  // conversion rate: closed/total
  const closed = leads.filter((l) => l.status === "closed").length;
  const total = leads.length;
  if (total > 0) {
    const rate = closed / total;
    score += Math.round(rate * 35);
  }
  return Math.min(score, 100);
}

function calcReputationScore(reviews: Review[]): number {
  let score = 30;
  // +2 per review up to 30 additional
  score += Math.min(reviews.length * 2, 30);
  if (reviews.length > 0) {
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    if (avg >= 4.5) score += 30;
    else if (avg >= 4.0) score += 20;
    else if (avg >= 3.5) score += 10;
  }
  // Has any sentiment = has responded
  const hasResponded = reviews.some(
    (r) => r.sentiment === "responded" || reviews.length > 2,
  );
  if (hasResponded) score += 10;
  return Math.min(score, 100);
}

function calcAgentScore(tenantId: string, subs: AgentSubscription[]): number {
  const active = subs.filter(
    (s) => s.tenantId === tenantId && s.status === "active",
  ).length;
  if (active === 0) return 25;
  if (active === 1) return 60;
  if (active === 2) return 80;
  return 100;
}

function calcWebsiteScore(audit?: AuditScore): number {
  if (!audit) return 50;
  const {
    seoScore,
    technicalScore,
    contentScore,
    conversionScore,
    gmb,
    website,
    citations,
    backlinks,
    total,
  } = audit;
  if (
    seoScore !== undefined &&
    technicalScore !== undefined &&
    contentScore !== undefined &&
    conversionScore !== undefined
  ) {
    return Math.round(
      (seoScore + technicalScore + contentScore + conversionScore) / 4,
    );
  }
  // Fallback to existing audit structure
  if (total !== undefined) return total;
  const vals = [gmb, website, citations, backlinks].filter(
    (v): v is number => v !== undefined,
  );
  if (vals.length > 0)
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  return 50;
}

function generateRecommendations(
  leadsScore: number,
  reputationScore: number,
  agentScore: number,
  websiteScore: number,
): string[] {
  const recs: Array<{ score: number; text: string }> = [
    {
      score: leadsScore,
      text: "Follow up with leads in 'contacted' stage to move them through the pipeline",
    },
    {
      score: reputationScore,
      text: "Request reviews from recent customers to boost your rating average",
    },
    {
      score: agentScore,
      text: "Consider activating an AI agent to automate lead handling and booking",
    },
    {
      score: websiteScore,
      text: "Your website audit score is low — improve SEO and conversion elements",
    },
  ];
  return recs
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((r) => r.text);
}

export function calculateHealthScore(
  tenantId: string,
  data: HealthScoreInput,
): ClientHealthScore {
  const { leads, reviews, auditScore, agentSubscriptions } = data;

  const leadsScore = calcLeadsScore(leads);
  const reputationScore = calcReputationScore(reviews);
  const agentScore = calcAgentScore(tenantId, agentSubscriptions);
  const websiteScore = calcWebsiteScore(auditScore);

  const overallScore = Math.round(
    leadsScore * 0.3 +
      reputationScore * 0.25 +
      agentScore * 0.25 +
      websiteScore * 0.2,
  );

  const components: HealthScoreComponent[] = [
    {
      factor: "leads",
      weight: 30,
      rawScore: leadsScore,
      weightedScore: Math.round(leadsScore * 0.3),
      displayLabel: "Leads & Pipeline",
      status: getComponentStatus(leadsScore),
    },
    {
      factor: "reputation",
      weight: 25,
      rawScore: reputationScore,
      weightedScore: Math.round(reputationScore * 0.25),
      displayLabel: "Reputation & Reviews",
      status: getComponentStatus(reputationScore),
    },
    {
      factor: "agents",
      weight: 25,
      rawScore: agentScore,
      weightedScore: Math.round(agentScore * 0.25),
      displayLabel: "AI Agents Active",
      status: getComponentStatus(agentScore),
    },
    {
      factor: "website",
      weight: 20,
      rawScore: websiteScore,
      weightedScore: Math.round(websiteScore * 0.2),
      displayLabel: "Website & SEO",
      status: getComponentStatus(websiteScore),
    },
  ];

  const recommendations = generateRecommendations(
    leadsScore,
    reputationScore,
    agentScore,
    websiteScore,
  );

  return {
    tenantId,
    overallScore,
    leadsScore,
    reputationScore,
    agentScore,
    websiteScore,
    components,
    trend: "stable",
    lastUpdated: Date.now(),
    recommendations,
  };
}
