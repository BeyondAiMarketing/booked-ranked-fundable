export interface ReportSection {
  title: string;
  metric: string;
  value: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  description: string;
  recommendation: string;
}

export interface ClientReport {
  id: string;
  tenantId: string;
  reportType: "weekly" | "monthly";
  periodLabel: string;
  generatedAt: number;
  deliveredAt?: number;
  sections: ReportSection[];
  aiNarrative: string;
  topWins: string[];
  nextSteps: string[];
  overallScore: number;
}

export interface ReportSchedule {
  tenantId: string;
  weeklyEnabled: boolean;
  monthlyEnabled: boolean;
  deliveryDayOfWeek: number;
  deliveryHour: number;
  lastGeneratedAt?: number;
}
