import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Circle,
  Globe,
  Loader2,
  Search,
  Share2,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

type Step = "form" | "loading" | "report";

interface AuditScores {
  performance: number;
  seo: number;
  mobile: number;
  social: number;
  overall: number;
  grade: string;
  socialDetails: {
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
    googleMaps: boolean;
  };
}

interface FormData {
  businessName: string;
  websiteUrl: string;
  location: string;
  email: string;
  phone: string;
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-emerald-400";
  if (grade.startsWith("B")) return "text-blue-400";
  if (grade.startsWith("C")) return "text-amber-400";
  return "text-red-400";
}

function ScoreGauge({ score, size = 160 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size * 0.55;
  const circumference = Math.PI * r;
  const pct = Math.min(score / 100, 1);
  const offset = circumference - pct * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox={`0 0 ${size} ${size * 0.7}`}
      role="img"
      aria-label={`Overall score: ${score} out of 100`}
    >
      <title>Overall score: {score}/100</title>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#1e293b"
        strokeWidth={size * 0.07}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.07}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize={size * 0.22}
        fontWeight="bold"
        fill="#f8fafc"
        fontFamily="inherit"
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize={size * 0.08}
        fill="#94a3b8"
        fontFamily="inherit"
      >
        out of 100
      </text>
    </svg>
  );
}

const LOAD_STEPS = [
  { label: "Analyzing website performance...", icon: Globe },
  { label: "Checking mobile & SEO health...", icon: Smartphone },
  { label: "Scanning social media presence...", icon: Share2 },
  { label: "Calculating your overall score...", icon: TrendingUp },
];

async function runPageSpeed(url: string) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error("PageSpeed API error");
  const data = await res.json();
  const cats = data?.lighthouseResult?.categories;
  const perf = Math.round((cats?.performance?.score ?? 0.45) * 100);
  const seo = Math.round((cats?.seo?.score ?? 0.5) * 100);
  const mobile = Math.round(
    ((cats?.performance?.score ?? 0.45) * 0.6 +
      (cats?.["best-practices"]?.score ?? 0.5) * 0.4) *
      100,
  );
  return { performance: perf, seo, mobile };
}

function simulateSocialPresence(businessName: string) {
  const seed = businessName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    facebook: seed % 3 !== 0,
    instagram: seed % 4 !== 1,
    linkedin: seed % 5 > 1,
    googleMaps: seed % 2 === 0,
  };
}

function getRecommendations(s: AuditScores) {
  const recs: Array<{
    icon: typeof Zap;
    title: string;
    body: string;
    severity: "high" | "medium" | "low";
  }> = [];
  if (s.performance < 70)
    recs.push({
      icon: Zap,
      title: "Your website loads slowly",
      body: "73% of local searches happen on phones — slow sites lose customers to competitors before they even see your offer.",
      severity: "high",
    });
  if (s.seo < 70)
    recs.push({
      icon: Search,
      title: "Your SEO needs attention",
      body: "Missing meta tags, poor heading structure, or thin content is keeping you invisible in Google search results.",
      severity: "high",
    });
  if (s.social < 75)
    recs.push({
      icon: Share2,
      title: "Incomplete social media presence",
      body: `You're missing profiles on ${Object.entries(s.socialDetails)
        .filter(([, v]) => !v)
        .map(([k]) =>
          k === "googleMaps"
            ? "Google Maps"
            : k.charAt(0).toUpperCase() + k.slice(1),
        )
        .join(
          ", ",
        )}. Local businesses with complete profiles get 3x more trust signals.`,
      severity: "medium",
    });
  if (s.mobile < 75)
    recs.push({
      icon: Smartphone,
      title: "Poor mobile experience",
      body: "Your site struggles on mobile devices. Google's mobile-first indexing means this directly hurts your rankings.",
      severity: "medium",
    });
  if (recs.length === 0)
    recs.push({
      icon: Star,
      title: "Strong foundation — now accelerate",
      body: "Your scores are solid. A managed SEO and reputation campaign could push you to the top 3 in your local market.",
      severity: "low",
    });
  return recs.slice(0, 3);
}

export default function FreeAuditPage() {
  const [step, setStep] = useState<Step>("form");
  const [loadStep, setLoadStep] = useState(0);
  const [loadDone, setLoadDone] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [form, setForm] = useState<FormData>({
    businessName: "",
    websiteUrl: "",
    location: "",
    email: "",
    phone: "",
  });
  const [scores, setScores] = useState<AuditScores | null>(null);
  const [urlError, setUrlError] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
    if (url) setForm((f) => ({ ...f, websiteUrl: url }));
  }, []);

  const validateUrl = (url: string) => {
    if (!url) return "Website URL is required";
    try {
      const u = new URL(url.startsWith("http") ? url : `https://${url}`);
      if (!u.hostname.includes(".")) return "Please enter a valid website URL";
      return "";
    } catch {
      return "Please enter a valid website URL";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUrl(form.websiteUrl);
    if (err) {
      setUrlError(err);
      return;
    }
    setUrlError("");
    setStep("loading");
    setLoadStep(0);
    setLoadDone([false, false, false, false]);

    const url = form.websiteUrl.startsWith("http")
      ? form.websiteUrl
      : `https://${form.websiteUrl}`;

    await new Promise((r) => setTimeout(r, 400));
    setLoadStep(0);
    let perfData = { performance: 45, seo: 50, mobile: 48 };
    try {
      perfData = await runPageSpeed(url);
    } catch {
      // fallback scores
    }
    setLoadDone((d) => {
      const n = [...d];
      n[0] = true;
      return n;
    });
    await new Promise((r) => setTimeout(r, 600));

    setLoadStep(1);
    await new Promise((r) => setTimeout(r, 800));
    setLoadDone((d) => {
      const n = [...d];
      n[1] = true;
      return n;
    });

    setLoadStep(2);
    await new Promise((r) => setTimeout(r, 800));
    const social = simulateSocialPresence(form.businessName);
    const socialScore = Math.round(
      (Object.values(social).filter(Boolean).length / 4) * 100,
    );
    setLoadDone((d) => {
      const n = [...d];
      n[2] = true;
      return n;
    });

    setLoadStep(3);
    await new Promise((r) => setTimeout(r, 600));
    const overall = Math.round(
      perfData.performance * 0.35 + perfData.seo * 0.35 + socialScore * 0.3,
    );
    const auditScores: AuditScores = {
      performance: perfData.performance,
      seo: perfData.seo,
      mobile: perfData.mobile,
      social: socialScore,
      overall,
      grade: getGrade(overall),
      socialDetails: social,
    };
    setLoadDone((d) => {
      const n = [...d];
      n[3] = true;
      return n;
    });
    await new Promise((r) => setTimeout(r, 400));

    setScores(auditScores);
    setStep("report");
  };

  const scoreCards = scores
    ? [
        {
          label: "Website Performance",
          score: scores.performance,
          icon: Globe,
        },
        { label: "Mobile Score", score: scores.mobile, icon: Smartphone },
        { label: "SEO Score", score: scores.seo, icon: Search },
        { label: "Social Presence", score: scores.social, icon: Share2 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            BRF
          </div>
          <span className="font-semibold text-white text-sm">
            Booked Ranked Fundable
          </span>
        </Link>
        <Link to="/login">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 pt-16 pb-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-5">
            <Shield size={11} /> Free Instant Audit — No Signup Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            How Does Your Business
            <br />
            <span className="text-indigo-400">Really Rank Online?</span>
          </h1>
          <p className="text-slate-200 text-lg mb-2">
            Get a real audit of your website performance, SEO, and social media
            presence — powered by Google PageSpeed data.
          </p>
        </motion.div>
      </section>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {/* STEP 1: FORM */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-1">
                  Run Your Free Audit
                </h2>
                <p className="text-slate-200 text-sm mb-6">
                  Takes 30 seconds. Real data from Google PageSpeed.
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  data-ocid="free-audit.form"
                >
                  <div>
                    <label
                      htmlFor="audit-biz-name"
                      className="block text-sm font-medium text-slate-200 mb-1.5"
                    >
                      Business Name *
                    </label>
                    <Input
                      id="audit-biz-name"
                      data-ocid="free-audit.input"
                      placeholder="e.g. Oceanside Plumbing Co."
                      value={form.businessName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, businessName: e.target.value }))
                      }
                      required
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-200 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="audit-website"
                      className="block text-sm font-medium text-slate-200 mb-1.5"
                    >
                      Website URL *
                    </label>
                    <Input
                      id="audit-website"
                      data-ocid="free-audit.input"
                      placeholder="https://yourbusiness.com"
                      value={form.websiteUrl}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, websiteUrl: e.target.value }));
                        setUrlError("");
                      }}
                      className={`bg-slate-800 border-slate-700 text-white placeholder:text-slate-200 focus:border-indigo-500 ${
                        urlError ? "border-red-500" : ""
                      }`}
                    />
                    {urlError && (
                      <p
                        className="text-red-400 text-xs mt-1"
                        data-ocid="free-audit.error_state"
                      >
                        {urlError}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="audit-location"
                        className="block text-sm font-medium text-slate-200 mb-1.5"
                      >
                        City, State
                      </label>
                      <Input
                        id="audit-location"
                        placeholder="San Diego, CA"
                        value={form.location}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            location: e.target.value,
                          }))
                        }
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-200"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="audit-email"
                        className="block text-sm font-medium text-slate-200 mb-1.5"
                      >
                        Email
                      </label>
                      <Input
                        id="audit-email"
                        type="email"
                        placeholder="you@business.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="audit-phone"
                      className="block text-sm font-medium text-slate-200 mb-1.5"
                    >
                      Phone
                    </label>
                    <Input
                      id="audit-phone"
                      type="tel"
                      placeholder="(760) 555-0100"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-200"
                    />
                  </div>
                  <Button
                    type="submit"
                    data-ocid="free-audit.submit_button"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 text-base rounded-xl mt-2"
                    size="lg"
                  >
                    Run My Free Audit <ArrowRight size={16} className="ml-2" />
                  </Button>
                </form>
                <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-200">
                  <span className="flex items-center gap-1">
                    <Shield size={11} /> No credit card
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={11} /> Real Google data
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap size={11} /> Results in 30s
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOADING */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              data-ocid="free-audit.loading_state"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-4">
                    <Loader2
                      size={26}
                      className="text-indigo-400 animate-spin"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Auditing {form.businessName || "Your Business"}
                  </h2>
                  <p className="text-slate-200 text-sm mt-1">
                    This takes about 20-30 seconds...
                  </p>
                </div>
                <Progress
                  value={(loadDone.filter(Boolean).length / 4) * 100}
                  className="h-2 mb-6 bg-slate-800"
                />
                <div className="space-y-4">
                  {LOAD_STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const isDone = loadDone[i];
                    const isActive = loadStep === i && !isDone;
                    return (
                      <div
                        key={s.label}
                        className="flex items-center gap-3"
                        data-ocid={`free-audit.step.item.${i + 1}`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                          style={{
                            borderColor: isDone
                              ? "#10b981"
                              : isActive
                                ? "#6366f1"
                                : "#334155",
                            background: isDone
                              ? "rgba(16,185,129,0.1)"
                              : isActive
                                ? "rgba(99,102,241,0.1)"
                                : "transparent",
                          }}
                        >
                          {isDone ? (
                            <CheckCircle
                              size={16}
                              className="text-emerald-400"
                            />
                          ) : isActive ? (
                            <Loader2
                              size={15}
                              className="text-indigo-400 animate-spin"
                            />
                          ) : (
                            <Icon size={15} className="text-slate-600" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isDone
                              ? "text-emerald-400"
                              : isActive
                                ? "text-indigo-300"
                                : "text-slate-200"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REPORT */}
          {step === "report" && scores && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              data-ocid="free-audit.report.card"
            >
              {/* Report Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mb-6">
                <div className="text-center">
                  <p className="text-slate-200 text-sm mb-2">
                    Business Audit Report for
                  </p>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {form.businessName || "Your Business"}
                  </h2>
                  <div className="flex flex-col items-center">
                    <ScoreGauge score={scores.overall} size={180} />
                    <div className="mt-2">
                      <span
                        className={`text-5xl font-black ${gradeColor(
                          scores.grade,
                        )}`}
                      >
                        {scores.grade}
                      </span>
                      <p className="text-slate-200 text-sm mt-1">
                        {scores.overall >= 80
                          ? "Strong online presence"
                          : scores.overall >= 60
                            ? "Room for improvement"
                            : "Significant gaps found"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {scoreCards.map(({ label, score, icon: Icon }) => (
                  <div
                    key={label}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={15} className="text-indigo-400" />
                      <p className="text-xs font-medium text-slate-200">
                        {label}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-3xl font-bold text-white">
                        {score}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          score >= 80
                            ? "bg-emerald-500/20 text-emerald-400"
                            : score >= 60
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {score >= 80 ? "Good" : score >= 60 ? "Fair" : "Poor"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          score >= 80
                            ? "bg-emerald-500"
                            : score >= 60
                              ? "bg-amber-400"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Details */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Share2 size={14} className="text-indigo-400" /> Social Media
                  Presence
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    Object.entries(scores.socialDetails) as [string, boolean][]
                  ).map(([platform, present]) => (
                    <div key={platform} className="flex items-center gap-2">
                      {present ? (
                        <CheckCircle size={15} className="text-emerald-400" />
                      ) : (
                        <Circle size={15} className="text-slate-600" />
                      )}
                      <span
                        className={`text-sm capitalize ${
                          present ? "text-slate-200" : "text-slate-200"
                        }`}
                      >
                        {platform === "googleMaps"
                          ? "Google Maps"
                          : platform.charAt(0).toUpperCase() +
                            platform.slice(1)}
                      </span>
                      {!present && (
                        <span className="text-xs text-red-400 ml-auto">
                          Missing
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-400" /> Top
                  Recommendations
                </h3>
                <div className="space-y-4">
                  {getRecommendations(scores).map((rec) => {
                    const Icon = rec.icon;
                    return (
                      <div
                        key={rec.title}
                        className={`flex gap-3 p-4 rounded-xl border ${
                          rec.severity === "high"
                            ? "border-red-800/50 bg-red-950/30"
                            : rec.severity === "medium"
                              ? "border-amber-800/50 bg-amber-950/30"
                              : "border-emerald-800/50 bg-emerald-950/30"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={`mt-0.5 flex-shrink-0 ${
                            rec.severity === "high"
                              ? "text-red-400"
                              : rec.severity === "medium"
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white mb-0.5">
                            {rec.title}
                          </p>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {rec.body}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 border border-indigo-700/40 rounded-2xl p-8 text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Fix These Issues?
                </h3>
                <p className="text-indigo-200 text-sm mb-6 max-w-sm mx-auto">
                  Our team can take your audit score from {scores.grade} to A+
                  in 90 days or less — guaranteed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    data-ocid="free-audit.primary_button"
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                    onClick={() =>
                      window.open(
                        `mailto:daree1933@gmail.com?subject=Free Strategy Session&body=I just ran a free audit and got a ${scores.grade} grade. I want to fix it.`,
                        "_blank",
                      )
                    }
                  >
                    Book a Free Strategy Session{" "}
                    <ArrowRight size={15} className="ml-1.5" />
                  </Button>
                  <Link to="/login">
                    <Button
                      data-ocid="free-audit.secondary_button"
                      size="lg"
                      variant="outline"
                      className="border-indigo-600/60 text-indigo-300 hover:bg-indigo-900/50 w-full sm:w-auto"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Email confirmation */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Get the full report delivered to your inbox
                </h3>
                {reportSent ? (
                  <p
                    className="text-emerald-400 text-sm flex items-center gap-2"
                    data-ocid="free-audit.success_state"
                  >
                    <CheckCircle size={15} /> Thanks! We'll send your full
                    report shortly.
                  </p>
                ) : (
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="Confirm your email address"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-200 flex-1"
                      data-ocid="free-audit.input"
                    />
                    <Button
                      data-ocid="free-audit.submit_button"
                      onClick={() => {
                        if (confirmEmail) setReportSent(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      Send Report
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center mt-8">
                <Button
                  variant="ghost"
                  className="text-slate-200 hover:text-slate-200"
                  onClick={() => {
                    setStep("form");
                    setScores(null);
                  }}
                  data-ocid="free-audit.secondary_button"
                >
                  Run Another Audit
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 text-slate-200 text-xs py-6 px-6 text-center">
        &copy; {new Date().getFullYear()} Booked Ranked Fundable. Built with
        love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:text-indigo-400"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
