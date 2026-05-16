import {
  AlertTriangle,
  CheckCircle,
  Circle,
  Globe,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { useApp } from "../context/AppContext";
import { AUDIT_SCORES } from "../data/demoData";

type StepStatus = "pending" | "checking" | "done";

interface AuditStep {
  label: string;
  status: StepStatus;
  score: number;
  baseScore: number;
}

function ScoreArc({ score }: { score: number }) {
  const radius = 54;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <svg
      width="140"
      height="90"
      viewBox="0 0 140 90"
      aria-label={`Score: ${score} out of 100`}
    >
      <title>Score gauge: {score}/100</title>
      <path
        d="M 16 80 A 54 54 0 0 1 124 80"
        fill="none"
        stroke="#374151"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 16 80 A 54 54 0 0 1 124 80"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="70"
        y="72"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill={color}
      >
        {score}
      </text>
      <text x="70" y="84" textAnchor="middle" fontSize="10" fill="#9ca3af">
        / 100
      </text>
    </svg>
  );
}

const SEVERITY_BADGE: Record<string, string> = {
  high: "bg-red-500/20 text-red-300 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

const BASE_STEPS: AuditStep[] = [
  { label: "SSL Certificate", status: "pending", score: 95, baseScore: 95 },
  {
    label: "Page Speed (Desktop)",
    status: "pending",
    score: 78,
    baseScore: 78,
  },
  { label: "Page Speed (Mobile)", status: "pending", score: 62, baseScore: 62 },
  { label: "Meta Tags", status: "pending", score: 70, baseScore: 70 },
  { label: "Schema Markup", status: "pending", score: 45, baseScore: 45 },
  {
    label: "Google Business Profile",
    status: "pending",
    score: 80,
    baseScore: 80,
  },
  { label: "NAP Consistency", status: "pending", score: 72, baseScore: 72 },
  { label: "Mobile Friendliness", status: "pending", score: 88, baseScore: 88 },
];

const ISSUES = [
  {
    label: "Weak meta descriptions on 4 service pages",
    severity: "high",
    category: "On-Page SEO",
  },
  {
    label: "Missing schema markup for local business",
    severity: "high",
    category: "Technical",
  },
  {
    label: "Mobile page speed below 70 — 4.2s load time",
    severity: "medium",
    category: "Performance",
  },
  {
    label: "No FAQ schema on homepage",
    severity: "medium",
    category: "GEO Visibility",
  },
  {
    label: "3 images missing alt text",
    severity: "low",
    category: "Accessibility",
  },
  {
    label: "Heading hierarchy not consistent",
    severity: "low",
    category: "Content",
  },
];

const RECOMMENDATIONS = [
  {
    title: "Optimize meta descriptions",
    detail:
      "Rewrite meta descriptions for your top 5 service pages to include primary keywords and CTAs.",
    impact: "High",
  },
  {
    title: "Add local business schema",
    detail:
      "Implement LocalBusiness JSON-LD schema on your homepage to improve Google's understanding of your business.",
    impact: "High",
  },
  {
    title: "Improve mobile page speed",
    detail:
      "Compress images, enable lazy loading, and minimize CSS/JS to get mobile load time under 2.5 seconds.",
    impact: "Medium",
  },
  {
    title: "Build FAQ content",
    detail:
      "Add a FAQ section to your homepage and key service pages to improve GEO visibility and answer-engine readiness.",
    impact: "Medium",
  },
];

export default function AuditPage() {
  const { currentTenantId, setAuditOverride, auditOverrides } = useApp();
  const [auditUrl, setAuditUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<AuditStep[]>(BASE_STEPS);
  const [auditComplete, setAuditComplete] = useState(false);
  const [history] = useState([
    { date: "Mar 24", score: 68, seo: 65, tech: 72, content: 58 },
    { date: "Mar 10", score: 65, seo: 62, tech: 70, content: 55 },
    { date: "Feb 24", score: 62, seo: 60, tech: 67, content: 52 },
    { date: "Feb 10", score: 58, seo: 55, tech: 64, content: 50 },
    { date: "Jan 27", score: 54, seo: 51, tech: 60, content: 46 },
  ]);

  const baseData = AUDIT_SCORES[currentTenantId];
  const overrideScore = auditOverrides[currentTenantId];
  const totalScore = overrideScore ?? baseData?.total ?? 68;
  const seoScore = baseData?.gmb ?? 65;
  const techScore = baseData?.website ?? 72;
  const contentScore = baseData?.citations ?? 58;
  const conversionScore = baseData?.backlinks ?? 55;

  const runAudit = () => {
    setRunning(true);
    setAuditComplete(false);
    setSteps(BASE_STEPS.map((s) => ({ ...s, status: "pending" })));
    let index = 0;
    const advance = () => {
      if (index >= BASE_STEPS.length) {
        setRunning(false);
        setAuditComplete(true);
        const newScore = Math.min(
          100,
          Math.max(0, totalScore + Math.floor(Math.random() * 5) - 1),
        );
        setAuditOverride(currentTenantId, newScore);
        return;
      }
      setSteps((prev) =>
        prev.map((s, i) => (i === index ? { ...s, status: "checking" } : s)),
      );
      setTimeout(() => {
        setSteps((prev) =>
          prev.map((s, i) => (i === index ? { ...s, status: "done" } : s)),
        );
        index++;
        setTimeout(advance, 300);
      }, 700);
    };
    advance();
  };

  const scoreCards = [
    { label: "Overall Score", value: totalScore, color: "#6366f1" },
    { label: "SEO Score", value: seoScore, color: "#10b981" },
    { label: "Technical", value: techScore, color: "#3b82f6" },
    { label: "Content Quality", value: contentScore, color: "#f59e0b" },
    { label: "Conversion Readiness", value: conversionScore, color: "#ec4899" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">SEO Audit</h2>
          <p className="text-gray-400 text-sm">
            Run a live audit to diagnose your site's health and rankings.
          </p>
        </div>
        {auditComplete && (
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            <CheckCircle size={13} /> Audit complete
          </span>
        )}
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {scoreCards.map(({ label, value }) => (
          <Card key={label} className="bg-card border-gray-800 text-center">
            <CardContent className="p-4">
              <ScoreArc score={value} />
              <p className="text-xs text-gray-400 mt-2">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Audit Runner */}
      <Card className="bg-card border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe size={15} className="text-indigo-400" /> Run Live Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <Input
              placeholder="Enter website URL (e.g. yourbusiness.com)"
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              className="flex-1 min-w-[200px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              data-ocid="audit.url.input"
            />
            <Button
              onClick={runAudit}
              disabled={running}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              data-ocid="audit.run.button"
            >
              {running ? (
                <>
                  <Loader2 size={14} className="mr-1.5 animate-spin" />{" "}
                  Running...
                </>
              ) : (
                <>
                  <RefreshCw size={14} className="mr-1.5" /> Run Audit
                </>
              )}
            </Button>
          </div>

          {(running || auditComplete) && (
            <div className="space-y-2">
              {steps.map((step) => (
                <div
                  key={step.label}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/50"
                >
                  {step.status === "done" ? (
                    <CheckCircle
                      size={15}
                      className="text-emerald-400 flex-shrink-0"
                    />
                  ) : step.status === "checking" ? (
                    <Loader2
                      size={15}
                      className="text-indigo-400 animate-spin flex-shrink-0"
                    />
                  ) : (
                    <Circle size={15} className="text-gray-600 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm flex-1 ${step.status === "done" ? "text-gray-200" : "text-gray-500"}`}
                  >
                    {step.label}
                  </span>
                  {step.status === "done" && (
                    <span
                      className={`text-xs font-bold ${step.score >= 80 ? "text-emerald-400" : step.score >= 60 ? "text-amber-400" : "text-red-400"}`}
                    >
                      {step.score}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues */}
        <Card className="bg-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-400" /> Issues
              Detected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ISSUES.map((issue) => (
              <div
                key={issue.label}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50 border border-gray-700"
              >
                <AlertTriangle
                  size={13}
                  className={
                    issue.severity === "high"
                      ? "text-red-400 flex-shrink-0 mt-0.5"
                      : issue.severity === "medium"
                        ? "text-amber-400 flex-shrink-0 mt-0.5"
                        : "text-blue-400 flex-shrink-0 mt-0.5"
                  }
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200">{issue.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {issue.category}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${SEVERITY_BADGE[issue.severity]}`}
                >
                  {issue.severity}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-card border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <Info size={15} className="text-indigo-400" /> Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.title}
                className="p-3 rounded-xl bg-gray-800/50 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white">{rec.title}</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${rec.impact === "High" ? "bg-red-500/20 text-red-300 border-red-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"}`}
                  >
                    {rec.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {rec.detail}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Audit History */}
      <Card className="bg-card border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">
            Audit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left pb-2 text-xs font-semibold text-gray-400 pr-6">
                    Date
                  </th>
                  <th className="text-right pb-2 text-xs font-semibold text-gray-400 pr-4">
                    Overall
                  </th>
                  <th className="text-right pb-2 text-xs font-semibold text-gray-400 pr-4">
                    SEO
                  </th>
                  <th className="text-right pb-2 text-xs font-semibold text-gray-400 pr-4">
                    Technical
                  </th>
                  <th className="text-right pb-2 text-xs font-semibold text-gray-400">
                    Content
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {history.map((row) => (
                  <tr
                    key={row.date}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-2.5 text-gray-400 pr-6">{row.date}</td>
                    <td className="py-2.5 text-right pr-4">
                      <span
                        className={`font-bold ${row.score >= 70 ? "text-emerald-400" : row.score >= 50 ? "text-amber-400" : "text-red-400"}`}
                      >
                        {row.score}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-gray-300 pr-4">
                      {row.seo}
                    </td>
                    <td className="py-2.5 text-right text-gray-300 pr-4">
                      {row.tech}
                    </td>
                    <td className="py-2.5 text-right text-gray-300">
                      {row.content}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Scores feed into your SEO & GEO Agent scorecard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
