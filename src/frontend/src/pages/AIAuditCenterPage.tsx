import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface AuditForm {
  website: string;
  industry: string;
  serviceArea: string;
  offer: string;
  targetCustomer: string;
  goals: string;
  knownCompetitors: string;
  leadValue: string;
  conversionGoal: string;
}

interface AuditResult {
  overallScore: number;
  grade: string;
  radarData: RadarItem[];
  bookedScore: number;
  rankedScore: number;
  fundedScore: number;
  executiveSummary: string;
  quickWins: string[];
  strategicRecommendations: string[];
}

function getCategoryLabel(cat: {
  ContentMessaging?: null;
  GrowthStrategy?: null;
  BrandTrust?: null;
  SEODiscoverability?: null;
  CompetitivePositioning?: null;
  ConversionOptimization?: null;
}): string {
  if (cat.ContentMessaging !== undefined) return "Content & Messaging";
  if (cat.GrowthStrategy !== undefined) return "Growth & Strategy";
  if (cat.BrandTrust !== undefined) return "Brand & Trust";
  if (cat.SEODiscoverability !== undefined) return "SEO & Discoverability";
  if (cat.CompetitivePositioning !== undefined)
    return "Competitive Positioning";
  if (cat.ConversionOptimization !== undefined)
    return "Conversion Optimization";
  return "Unknown";
}

interface RadarItem {
  subject: string;
  A: number;
  fullMark: number;
}

const initialForm: AuditForm = {
  website: "",
  industry: "",
  serviceArea: "",
  offer: "",
  targetCustomer: "",
  goals: "",
  knownCompetitors: "",
  leadValue: "",
  conversionGoal: "",
};

export default function AIAuditCenterPage() {
  const [form, setForm] = useState<AuditForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const { actor } = useActor(createActor);

  const handleChange = (field: keyof AuditForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRunAudit = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const res = await actor.calculateMarketingAuditScore({
        website: form.website,
        industry: form.industry,
        serviceArea: form.serviceArea,
        offer: form.offer,
        targetCustomer: form.targetCustomer,
        goals: form.goals
          ? form.goals
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        knownCompetitors: form.knownCompetitors
          ? form.knownCompetitors
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        leadValue: form.leadValue ? BigInt(form.leadValue) : BigInt(0),
        conversionGoal: form.conversionGoal,
        clientBusinessId: "",
        verticalProfileId: "",
      });

      if (res.__kind__ === "err") {
        setResult(null);
        return;
      }

      if (res.__kind__ !== "ok") {
        setResult(null);
        return;
      }

      const audit = res.ok;

      const radarData: RadarItem[] = (audit.categoryScores ?? []).map((cs) => ({
        subject: getCategoryLabel(cs.category as any),
        A: Number(cs.score ?? 0),
        fullMark: 100,
      }));

      setResult({
        overallScore: Number(audit.overallScore ?? 0),
        grade: audit.grade ?? "N/A",
        radarData,
        bookedScore: Number(audit.brfScore?.bookedScore ?? 0),
        rankedScore: Number(audit.brfScore?.rankedScore ?? 0),
        fundedScore: Number(audit.brfScore?.fundedScore ?? 0),
        executiveSummary: (audit as any).executiveSummary ?? "",
        quickWins: (audit as any).quickWins ?? [],
        strategicRecommendations: (audit as any).strategicRecommendations ?? [],
      });
    } catch {
      // Audit failed silently
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
      case "A+":
        return "bg-emerald-500";
      case "B":
      case "B+":
        return "bg-amber-500";
      case "C":
      case "C+":
        return "bg-orange-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Audit Center</h1>
          <p className="text-slate-400 mt-1">
            Run a comprehensive marketing audit and get your Booked, Ranked,
            Funded scorecard.
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Website</Label>
              <Input
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://example.com"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Industry</Label>
              <Input
                value={form.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="e.g. Roofing, Dental, Real Estate"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Service Area</Label>
              <Input
                value={form.serviceArea}
                onChange={(e) => handleChange("serviceArea", e.target.value)}
                placeholder="City, State or Region"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Primary Offer</Label>
              <Input
                value={form.offer}
                onChange={(e) => handleChange("offer", e.target.value)}
                placeholder="e.g. Roof Replacement, Invisalign Consultation"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Target Customer</Label>
              <Input
                value={form.targetCustomer}
                onChange={(e) => handleChange("targetCustomer", e.target.value)}
                placeholder="e.g. Homeowners 35-65, First-time buyers"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Goals</Label>
              <Input
                value={form.goals}
                onChange={(e) => handleChange("goals", e.target.value)}
                placeholder="e.g. 20 more leads/month, rank #1 locally"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Known Competitors</Label>
              <Input
                value={form.knownCompetitors}
                onChange={(e) =>
                  handleChange("knownCompetitors", e.target.value)
                }
                placeholder="Competitor names or websites"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Lead Value ($)</Label>
              <Input
                value={form.leadValue}
                onChange={(e) => handleChange("leadValue", e.target.value)}
                placeholder="e.g. 5000"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Conversion Goal</Label>
              <Textarea
                value={form.conversionGoal}
                onChange={(e) => handleChange("conversionGoal", e.target.value)}
                placeholder="e.g. 10% of leads to appointment, 30% close rate"
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="md:col-span-2">
              <Button
                onClick={handleRunAudit}
                disabled={loading || !actor}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                data-ocid="audit.run_audit_button"
              >
                {loading ? "Running Audit..." : "Run Audit"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-white">
                      {result.overallScore}
                    </span>
                    <Badge
                      className={`${getGradeColor(result.grade)} text-white`}
                    >
                      {result.grade}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Booked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold text-amber-400">
                    {result.bookedScore}
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Ranked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold text-sky-400">
                    {result.rankedScore}
                  </span>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-400">
                    Funded
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold text-emerald-400">
                    {result.fundedScore}
                  </span>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={result.radarData}>
                      <PolarGrid stroke="#475569" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#cbd5e1", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#94a3b8", fontSize: 10 }}
                      />
                      <Radar
                        name="Your Business"
                        dataKey="A"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {result.executiveSummary && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">
                    {result.executiveSummary}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Wins</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.quickWins.map((win) => (
                      <li
                        key={win}
                        className="flex items-start gap-2 text-slate-300"
                      >
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Strategic Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strategicRecommendations.map((rec) => (
                      <li
                        key={rec}
                        className="flex items-start gap-2 text-slate-300"
                      >
                        <span className="text-sky-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
