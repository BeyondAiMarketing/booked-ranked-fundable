import {
  BarChart2,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useRagBrain } from "../hooks/useRagBrain";
import type { AgentNodeRun, AgentNodeType } from "../types/ragBrain";

type ReportStatus = "Ready" | "Generating" | "Pending";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  nodeType: AgentNodeType;
  lastGenerated: string;
  status: ReportStatus;
  content?: string;
}

const INITIAL_REPORTS: ReportCard[] = [
  {
    id: "weekly-summary",
    title: "Weekly Summary",
    description:
      "Performance highlights, lead activity, and review sentiment from the last 7 days.",
    nodeType: "ReportNarrator",
    lastGenerated: "May 19, 2026",
    status: "Ready",
    content:
      "This week your business received 12 new leads, 3 booked appointments, and 4 new Google reviews averaging 4.8 stars. Lead response time improved by 18% compared to last week. Your top lead source remains Google My Business at 64%. Recommend prioritizing follow-up with the 6 untouched leads in your CRM before Friday.",
  },
  {
    id: "monthly-performance",
    title: "Monthly Performance",
    description:
      "Full monthly analytics: revenue, conversion rates, and growth trends.",
    nodeType: "ReportNarrator",
    lastGenerated: "May 1, 2026",
    status: "Ready",
    content:
      "April performance summary: 47 total leads, 19 converted to estimates, 11 closed jobs with estimated revenue of $28,400. Conversion rate of 23% is up from 18% in March. Review velocity increased: 14 new reviews vs. 9 in March. Recommendation: increase review request frequency — you close at higher rates when you have more recent reviews.",
  },
  {
    id: "funding-readiness",
    title: "Funding Readiness",
    description:
      "Current fundability score, open action items, and next milestone checklist.",
    nodeType: "ReportNarrator",
    lastGenerated: "May 15, 2026",
    status: "Ready",
    content:
      "Funding readiness score: 72/100. Your business is on track for Tier 2 vendor credit. Completed: EIN registration, business bank account, Net-30 vendor accounts (2 of 3). Pending: DUNS number verification, 3-month bank statement history. Next milestone: apply for your third Net-30 account within 30 days.",
  },
  {
    id: "lead-quality",
    title: "Lead Quality Analysis",
    description:
      "AI scoring of your leads by intent, fit, and estimated deal value.",
    nodeType: "LeadEnrichment",
    lastGenerated: "May 20, 2026",
    status: "Pending",
  },
];

const STATUS_ICONS: Record<ReportStatus, React.ReactNode> = {
  Ready: <CheckCircle2 className="w-3 h-3" />,
  Generating: <RefreshCw className="w-3 h-3 animate-spin" />,
  Pending: <Clock className="w-3 h-3" />,
};

const STATUS_STYLES: Record<ReportStatus, string> = {
  Ready:
    "bg-[oklch(0.62_0.18_155/0.15)] text-[oklch(0.72_0.18_155)] border-[oklch(0.62_0.18_155/0.3)]",
  Generating:
    "bg-[oklch(0.62_0.2_200/0.15)] text-[oklch(0.72_0.2_200)] border-[oklch(0.62_0.2_200/0.3)]",
  Pending:
    "bg-[oklch(0.72_0.18_75/0.15)] text-[oklch(0.82_0.16_75)] border-[oklch(0.72_0.18_75/0.3)]",
};

export default function ClientAIReportsPage() {
  const { runAgentNode, isLoading } = useRagBrain();
  const [reports, setReports] = useState<ReportCard[]>(INITIAL_REPORTS);
  const [viewing, setViewing] = useState<ReportCard | null>(null);

  const handleGenerate = useCallback(
    async (reportId: string, nodeType: AgentNodeType) => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: "Generating" as ReportStatus }
            : r,
        ),
      );
      const result = await runAgentNode(nodeType, JSON.stringify({ reportId }));
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: "Ready" as ReportStatus,
                lastGenerated: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                content:
                  (result as AgentNodeRun | null)?.outputData ??
                  r.content ??
                  "Report generated successfully.",
              }
            : r,
        ),
      );
    },
    [runAgentNode],
  );

  return (
    <div data-ocid="ai-reports.page" className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-5 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.58_0.22_290/0.15)] border border-[oklch(0.58_0.22_290/0.3)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[oklch(0.72_0.18_290)]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                AI Reports
              </h1>
              <p className="text-xs text-muted-foreground">
                Automated intelligence reports for your business
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {reports.filter((r) => r.status === "Ready").length} ready
          </span>
        </div>
      </div>

      <div className="px-4 py-6 md:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, idx) => (
            <Card
              key={report.id}
              data-ocid={`ai-reports.item.${idx + 1}`}
              className="bg-card border-border hover:border-primary/30 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[oklch(0.58_0.22_290/0.12)] border border-[oklch(0.58_0.22_290/0.25)] flex items-center justify-center text-[oklch(0.72_0.18_290)]">
                      {report.id === "weekly-summary" && (
                        <BarChart2 className="w-5 h-5" />
                      )}
                      {report.id === "monthly-performance" && (
                        <FileText className="w-5 h-5" />
                      )}
                      {report.id === "funding-readiness" && (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      {report.id === "lead-quality" && (
                        <Sparkles className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {report.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Last generated: {report.lastGenerated}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${STATUS_STYLES[report.status]}`}
                  >
                    {STATUS_ICONS[report.status]}
                    {report.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center gap-2">
                  {report.status === "Ready" && (
                    <Button
                      data-ocid={`ai-reports.view_button.${idx + 1}`}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setViewing(report)}
                    >
                      View Report
                    </Button>
                  )}
                  <Button
                    data-ocid={`ai-reports.generate_button.${idx + 1}`}
                    type="button"
                    size="sm"
                    variant={report.status === "Ready" ? "ghost" : "default"}
                    className="flex-1 text-xs"
                    disabled={isLoading || report.status === "Generating"}
                    onClick={() => handleGenerate(report.id, report.nodeType)}
                  >
                    {report.status === "Generating" ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1.5" />
                        Generate Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={!!viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent
          data-ocid="ai-reports.dialog"
          className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              {viewing?.title}
            </DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[viewing.status]}`}
                >
                  {STATUS_ICONS[viewing.status]}
                  {viewing.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  Generated: {viewing.lastGenerated}
                </span>
              </div>
              <div className="rounded-xl bg-muted/40 border border-border p-4">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewing.content ??
                    "Report content will appear here once generated."}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  data-ocid="ai-reports.close_button"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setViewing(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
