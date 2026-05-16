export interface HealthScoreComponent {
  factor: "leads" | "reputation" | "agents" | "website";
  weight: number;
  rawScore: number;
  weightedScore: number;
  displayLabel: string;
  status: "good" | "warning" | "critical";
}

export interface ClientHealthScore {
  tenantId: string;
  overallScore: number;
  leadsScore: number;
  reputationScore: number;
  agentScore: number;
  websiteScore: number;
  components: HealthScoreComponent[];
  trend: "improving" | "declining" | "stable";
  lastUpdated: number;
  recommendations: string[];
}

export type HealthStatus = "healthy" | "warning" | "at-risk";

export function getHealthStatus(score: number): HealthStatus {
  if (score >= 75) return "healthy";
  if (score >= 50) return "warning";
  return "at-risk";
}

export function getHealthColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export function getHealthBgColor(score: number): string {
  if (score >= 75)
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (score >= 50) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-red-500/20 text-red-300 border-red-500/30";
}

export function getHealthArcColor(score: number): string {
  if (score >= 75) return "#10b981"; // emerald-500
  if (score >= 50) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
}

export function getStatusLabel(score: number): string {
  if (score >= 75) return "Healthy";
  if (score >= 50) return "Needs Attention";
  return "At Risk";
}

export function getComponentStatus(
  score: number,
): HealthScoreComponent["status"] {
  if (score >= 70) return "good";
  if (score >= 45) return "warning";
  return "critical";
}
