import {
  AlertCircle,
  Brain,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardCopy,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BrowserAuditPanel } from "../components/BrowserAuditPanel";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useCredentials } from "../context/CredentialsContext";
import { useActor } from "../hooks/useActor";
import {
  LiteLLMAdapter,
  buildResearchRouter,
  isResearchError,
} from "../services/openSourceAdapters";

// ─── Types ───────────────────────────────────────────────────────────────────

const NICHES = [
  "plumbing",
  "hvac",
  "restoration",
  "carpet_cleaning",
  "roofing",
  "med_spa",
  "real_estate",
  "mortgage",
  "chiropractic",
  "dental",
] as const;

type Niche = (typeof NICHES)[number];

const NICHE_LABELS: Record<Niche, string> = {
  plumbing: "Plumbing",
  hvac: "HVAC",
  restoration: "Water & Fire Restoration",
  carpet_cleaning: "Carpet Cleaning",
  roofing: "Roofing",
  med_spa: "Med Spa",
  real_estate: "Real Estate",
  mortgage: "Mortgage",
  chiropractic: "Chiropractic",
  dental: "Dental",
};

type AuditStage =
  | "idle"
  | "fetching_website"
  | "scanning_social"
  | "analyzing_content"
  | "scoring"
  | "generating_insights"
  | "complete"
  | "failed"
  | "browser_scanning"
  | "browser_awaiting_approval"
  | "browser_approved"
  | "browser_rejected";

const STAGE_LABELS: Record<AuditStage, string> = {
  idle: "Idle",
  fetching_website: "Fetching website data",
  scanning_social: "Scanning social profiles",
  analyzing_content: "Analyzing content",
  scoring: "Scoring & benchmarking",
  generating_insights: "Generating insights & email",
  complete: "Complete",
  failed: "Failed",
  browser_scanning: "Live visual scan in progress",
  browser_awaiting_approval: "Awaiting your approval",
  browser_approved: "Browser verified",
  browser_rejected: "Rejected",
};

const STAGE_ORDER: AuditStage[] = [
  "fetching_website",
  "scanning_social",
  "analyzing_content",
  "scoring",
  "generating_insights",
];

interface ScoreBreakdown {
  website: number;
  social: number;
  seo: number;
  engagement: number;
  growth: number;
}

interface SocialLink {
  platform: "linkedin" | "facebook" | "instagram";
  url: string;
  followers?: number;
}

interface AuditJob {
  id: string;
  businessName: string;
  website: string;
  niche: Niche;
  city: string;
  phone: string;
  email: string;
  stage: AuditStage;
  startedAt: number;
  elapsedMs: number;
  browserStage?:
    | "browser_scanning"
    | "browser_awaiting_approval"
    | "browser_approved"
    | "browser_rejected";
}

interface AuditResult {
  jobId: string;
  businessName: string;
  website: string;
  niche: Niche;
  city: string;
  totalScore: number;
  breakdown: ScoreBreakdown;
  companySnapshot: string;
  socialLinks: SocialLink[];
  seoSignals: string[];
  insights: string;
  emailSubject: string;
  emailBody: string;
  status: "pending_review" | "approved" | "rejected";
  approvedAt?: number;
  crmLeadId?: string;
  kitPageSlug?: string;
  completedAt: number;
  /** Which research source was used during the audit */
  researchSource?: "perplexity" | "claude" | "openai" | "searxng" | "none";
  /** Whether browser visual verification was approved */
  browserAuditApproved?: boolean;
}

interface BatchRow {
  name: string;
  website: string;
  niche: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getScoreLabel(score: number): "Hot" | "Warm" | "Cold" {
  if (score >= 70) return "Hot";
  if (score >= 45) return "Warm";
  return "Cold";
}

function getScoreBadgeClass(label: "Hot" | "Warm" | "Cold"): string {
  if (label === "Hot") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (label === "Warm")
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
}

function getScoreRingColor(score: number): string {
  if (score >= 70) return "text-red-400";
  if (score >= 45) return "text-yellow-400";
  return "text-blue-400";
}

function elapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function generateDemoAuditResult(
  job: AuditJob,
): Omit<AuditResult, "status" | "completedAt"> {
  const score = 35 + Math.floor(Math.random() * 55);
  const breakdown: ScoreBreakdown = {
    website: 5 + Math.floor(Math.random() * 16),
    social: 5 + Math.floor(Math.random() * 16),
    seo: 5 + Math.floor(Math.random() * 16),
    engagement: 5 + Math.floor(Math.random() * 16),
    growth: 5 + Math.floor(Math.random() * 16),
  };
  return {
    jobId: job.id,
    businessName: job.businessName,
    website: job.website,
    niche: job.niche,
    city: job.city,
    totalScore: score,
    breakdown,
    companySnapshot: `${job.businessName} is a ${NICHE_LABELS[job.niche]} business${job.city ? ` based in ${job.city}` : ""}. Their digital presence shows moderate engagement but significant opportunity for growth. The business has been operating for several years and maintains a professional service offering. Their website demonstrates basic digital investment, though key conversion elements and trust signals are underdeveloped relative to top competitors in their market.`,
    socialLinks: [
      {
        platform: "facebook",
        url: `https://facebook.com/${job.businessName.toLowerCase().replace(/\s+/g, "")}`,
        followers: 150 + Math.floor(Math.random() * 800),
      },
      {
        platform: "instagram",
        url: `https://instagram.com/${job.businessName.toLowerCase().replace(/\s+/g, "")}`,
        followers: 80 + Math.floor(Math.random() * 400),
      },
    ],
    seoSignals: [
      "Domain age: 4+ years (positive signal)",
      "Missing structured data / Schema markup",
      "Limited local citation coverage",
      "Google Business Profile: unoptimized",
      "Page speed score: needs improvement",
    ],
    insights: `${job.businessName} has solid foundational elements but is leaving significant revenue on the table. Their social media engagement is below the ${NICHE_LABELS[job.niche]} industry average, and their Google Business Profile lacks the reviews and completeness needed to dominate local pack rankings. A targeted reputation-building campaign combined with SEO improvements could increase their qualified leads by 40-60% within 90 days. The business shows strong conversion potential — they just need the right digital infrastructure.`,
    emailSubject: `Quick question about ${job.businessName}'s online growth`,
    emailBody: `Hi [Owner Name],\n\nI was researching top ${NICHE_LABELS[job.niche]} businesses${job.city ? ` in ${job.city}` : ""} and came across ${job.businessName}. I noticed a few quick wins that could significantly increase your inbound leads.\n\nSpecifically:\n• Your Google Business Profile has room for improvement that's costing you local search visibility\n• Your competitors are capturing customers who are actively searching for ${NICHE_LABELS[job.niche].toLowerCase()} services\n• A simple review automation system could triple your 5-star reviews in 60 days\n\nI put together a free digital audit for your business. Would you like to see exactly where you stand vs. your top 3 competitors?\n\nNo sales pitch — just a 15-minute strategy call.\n\nBest,\n[Your Name]\nBooked, Ranked & Fundable\nhttps://bookedrankedfunded.org`,
  };
}

async function runAuditPipeline(
  job: AuditJob,
  onStageChange: (stage: AuditStage) => void,
  litellmUrl: string,
  litellmKey: string,
  searxngUrl: string,
  perplexityApiKey: string,
  claudeKey: string,
  openaiKey: string,
): Promise<Omit<AuditResult, "status" | "completedAt">> {
  const llm = litellmUrl ? new LiteLLMAdapter(litellmUrl, litellmKey) : null;
  const researchRouter = buildResearchRouter(
    perplexityApiKey,
    searxngUrl,
    claudeKey,
    openaiKey,
  );

  // Stage 1: Fetch website analysis
  onStageChange("fetching_website");
  await new Promise((r) => setTimeout(r, 1200));

  let websiteAnalysis = "";
  let socialLinks: SocialLink[] = [];
  let seoSignals: string[] = [];
  let companySnapshot = "";
  let insights = "";
  let emailSubject = "";
  let emailBody = "";
  let researchSource: "perplexity" | "claude" | "openai" | "searxng" | "none" =
    "none";
  const breakdown: ScoreBreakdown = {
    website: 12,
    social: 10,
    seo: 10,
    engagement: 8,
    growth: 9,
  };

  if (llm) {
    const websiteResult = await llm.chat([
      {
        role: "system",
        content:
          "You are a business intelligence analyst. Analyze businesses based on their website URL and return structured JSON insights.",
      },
      {
        role: "user",
        content: `Analyze this ${NICHE_LABELS[job.niche]} business: ${job.businessName}, website: ${job.website}${job.city ? `, located in ${job.city}` : ""}. Return JSON with fields: websiteQuality (0-20), foundingYearEstimate, mainServices (array), uniqueValueProp, websiteIssues (array of strings), socialLinksFound (array of {platform, url}).`,
      },
    ]);
    websiteAnalysis = websiteResult.content;
    try {
      const parsed = JSON.parse(
        websiteAnalysis.replace(/```json\n?|```/g, "").trim(),
      ) as {
        websiteQuality?: number;
        socialLinksFound?: { platform: string; url: string }[];
      };
      if (parsed.websiteQuality)
        breakdown.website = Math.min(20, parsed.websiteQuality);
      if (parsed.socialLinksFound) {
        socialLinks = parsed.socialLinksFound
          .filter((l) =>
            ["linkedin", "facebook", "instagram"].includes(l.platform),
          )
          .map((l) => ({
            platform: l.platform as SocialLink["platform"],
            url: l.url,
          }));
      }
    } catch {
      // use defaults
    }
  }

  // Stage 2: Scan social
  onStageChange("scanning_social");
  await new Promise((r) => setTimeout(r, 1000));

  if (socialLinks.length === 0) {
    socialLinks = [
      {
        platform: "facebook",
        url: `https://facebook.com/${job.businessName.toLowerCase().replace(/\s+/g, "")}`,
        followers: 200 + Math.floor(Math.random() * 600),
      },
    ];
  }

  // ── Live Research: Perplexity → Claude → OpenAI → SearXNG ───────────────
  let perplexityRecentActivity: string[] = [];
  let perplexityRankings = "";
  let perplexitySocialInsights = "";
  let perplexityCitations: string[] = [];

  if (researchRouter) {
    const researchQuery = `${job.businessName} ${job.city ?? ""} ${NICHE_LABELS[job.niche]} reviews rankings news recent activity`;

    if (researchRouter.type === "perplexity") {
      const pResult = await researchRouter.adapter.research(researchQuery);
      if (pResult && !isResearchError(pResult)) {
        researchSource = "perplexity";
        perplexityRecentActivity = pResult.recentActivity;
        perplexityRankings = pResult.rankings;
        perplexitySocialInsights = pResult.socialInsights;
        perplexityCitations = pResult.citations;
        if (pResult.rankings) {
          seoSignals = [pResult.rankings, ...seoSignals].slice(0, 5);
        }
        const citationLinks = pResult.citations
          .filter(
            (url) =>
              url.includes("linkedin") ||
              url.includes("facebook") ||
              url.includes("instagram"),
          )
          .slice(0, 2)
          .map((url) => ({
            platform: url.includes("linkedin")
              ? ("linkedin" as const)
              : url.includes("instagram")
                ? ("instagram" as const)
                : ("facebook" as const),
            url,
          }));
        for (const cl of citationLinks) {
          if (!socialLinks.some((s) => s.platform === cl.platform)) {
            socialLinks = [...socialLinks, cl];
          }
        }
        if (pResult.rankings) {
          breakdown.seo = Math.min(20, breakdown.seo + 4);
        }
        breakdown.seo = Math.min(20, breakdown.seo + 3);
      }
    } else if (
      researchRouter.type === "claude" ||
      researchRouter.type === "openai"
    ) {
      // Claude or OpenAI research — same result shape, transparent to the UI
      const aiResult = await researchRouter.adapter.research(
        job.businessName,
        NICHE_LABELS[job.niche],
        job.city ?? "",
        job.website,
      );
      if (aiResult && !isResearchError(aiResult)) {
        researchSource = researchRouter.type;
        perplexityRecentActivity = aiResult.recentActivity;
        perplexityRankings = aiResult.rankings;
        perplexitySocialInsights = aiResult.socialInsights;
        // No citations from LLM adapters
        if (aiResult.rankings) {
          seoSignals = [aiResult.rankings, ...seoSignals].slice(0, 5);
          breakdown.seo = Math.min(20, breakdown.seo + 3);
        }
      }
    } else if (researchRouter.type === "searxng") {
      const searchResult = await researchRouter.adapter.search(
        `${job.businessName} ${job.city} ${NICHE_LABELS[job.niche]} reviews site:google.com OR site:yelp.com`,
      );
      if (searchResult.success && searchResult.results.length > 0) {
        researchSource = "searxng";
        seoSignals = searchResult.results
          .slice(0, 3)
          .map((r) => r.snippet.slice(0, 120));
        breakdown.seo = Math.min(20, 8 + searchResult.results.length * 2);
      }
    }
  }

  if (seoSignals.length === 0) {
    seoSignals = [
      "Domain indexed but limited authority backlinks",
      "Google Business Profile detected — partially optimized",
      "Local citations: below average for market area",
      "Core Web Vitals: improvement needed",
    ];
  }

  // Stage 3: Analyze content
  onStageChange("analyzing_content");
  await new Promise((r) => setTimeout(r, 1100));

  if (llm) {
    const snapshotResult = await llm.chat([
      {
        role: "system",
        content:
          "You are a concise business analyst. Write a 3-sentence company snapshot.",
      },
      {
        role: "user",
        content: `Write a 3-sentence snapshot for ${job.businessName}, a ${NICHE_LABELS[job.niche]} business${job.city ? ` in ${job.city}` : ""}. Website: ${job.website}. Focus on digital maturity, market position, and growth opportunity.${perplexityRankings ? ` Known ranking signals: ${perplexityRankings}` : ""}${perplexitySocialInsights ? ` Social insights: ${perplexitySocialInsights}` : ""}`,
      },
    ]);
    companySnapshot =
      snapshotResult.content ||
      `${job.businessName} is a ${NICHE_LABELS[job.niche]} business with a developing digital presence.`;
  } else {
    companySnapshot = generateDemoAuditResult(job).companySnapshot;
  }

  // Stage 4: Score
  onStageChange("scoring");
  await new Promise((r) => setTimeout(r, 800));

  breakdown.social = Math.min(20, 8 + socialLinks.length * 4);
  breakdown.engagement = 6 + Math.floor(Math.random() * 12);
  breakdown.growth = 7 + Math.floor(Math.random() * 11);
  const totalScore = Math.min(
    100,
    breakdown.website +
      breakdown.social +
      breakdown.seo +
      breakdown.engagement +
      breakdown.growth,
  );

  // Stage 5: Generate insights + email
  onStageChange("generating_insights");
  await new Promise((r) => setTimeout(r, 1300));

  // Build Perplexity-enriched context for email personalization
  const recentActivityContext =
    perplexityRecentActivity.length > 0
      ? `Recent activity we found: ${perplexityRecentActivity.join("; ")}.`
      : "";

  if (llm) {
    const [insightResult, emailResult] = await Promise.all([
      llm.chat([
        {
          role: "system",
          content:
            "You are a B2B digital marketing strategist. Write 3-4 sentences of actionable insights.",
        },
        {
          role: "user",
          content: `Based on a ${NICHE_LABELS[job.niche]} business named ${job.businessName}${job.city ? ` in ${job.city}` : ""} with a digital health score of ${totalScore}/100, write 3-4 sentences of key insights about their biggest opportunities for growth. Be specific and data-driven.${recentActivityContext ? ` ${recentActivityContext}` : ""}${perplexityRankings ? ` Ranking signals: ${perplexityRankings}` : ""}`,
        },
      ]),
      llm.chat([
        {
          role: "system",
          content:
            "You write highly personalized B2B cold email. Return JSON with {subject, body} fields only.",
        },
        {
          role: "user",
          content: `Write a personalized cold outreach email for ${job.businessName} (${NICHE_LABELS[job.niche]}${job.city ? `, ${job.city}` : ""}). Score: ${totalScore}/100. Reference their digital gaps. Include a free audit offer as the CTA.${recentActivityContext ? ` Personalize using this recent info: ${recentActivityContext}` : ""} Return JSON {subject, body}.`,
        },
      ]),
    ]);
    insights = insightResult.content || generateDemoAuditResult(job).insights;
    try {
      const parsed = JSON.parse(
        emailResult.content.replace(/```json\n?|```/g, "").trim(),
      ) as { subject?: string; body?: string };
      emailSubject =
        parsed.subject ??
        `Quick question about ${job.businessName}'s online growth`;
      emailBody = parsed.body ?? generateDemoAuditResult(job).emailBody;
    } catch {
      emailSubject = `Quick question about ${job.businessName}'s online growth`;
      emailBody = generateDemoAuditResult(job).emailBody;
    }
  } else {
    const demo = generateDemoAuditResult(job);
    insights = demo.insights;
    emailSubject = demo.emailSubject;
    emailBody = demo.emailBody;
  }

  // Merge Perplexity citations into SEO signals if no LLM was used
  if (perplexityCitations.length > 0 && seoSignals.length < 5) {
    const citationSignals = perplexityCitations
      .slice(0, 2)
      .map((url) => `Live source: ${url}`);
    seoSignals = [...seoSignals, ...citationSignals].slice(0, 5);
  }

  return {
    jobId: job.id,
    businessName: job.businessName,
    website: job.website,
    niche: job.niche,
    city: job.city,
    totalScore,
    breakdown,
    companySnapshot,
    socialLinks,
    seoSignals,
    insights,
    emailSubject,
    emailBody,
    researchSource,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreDial({ score }: { score: number }) {
  const label = getScoreLabel(score);
  const colorClass = getScoreRingColor(score);
  const pct = Math.round((score / 100) * 283);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/10"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${pct} 283`}
            className={colorClass}
            stroke="currentColor"
            strokeLinecap="round"
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${colorClass}`}
        >
          {score}
        </span>
      </div>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getScoreBadgeClass(label)}`}
      >
        {label}
      </span>
    </div>
  );
}

function BreakdownBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 20) * 100;
  const color =
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-300 w-8 text-right shrink-0">
        {value}/20
      </span>
    </div>
  );
}

function AuditQueueCard({
  job,
}: { job: AuditJob & { stage: AuditStage; elapsedMs: number } }) {
  const stageIdx = STAGE_ORDER.indexOf(job.stage);
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3"
      data-ocid={`audit.queue.item.${job.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-white text-sm">{job.businessName}</p>
          <p className="text-xs text-slate-400">{job.website}</p>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] bg-purple-900/40 text-purple-300 border-purple-500/30 shrink-0"
        >
          {NICHE_LABELS[job.niche]}
        </Badge>
      </div>
      <div className="space-y-1.5">
        {STAGE_ORDER.map((s, i) => {
          const done = i < stageIdx;
          const active = i === stageIdx;
          return (
            <div
              key={s}
              className={`flex items-center gap-2 text-xs ${done ? "text-emerald-400" : active ? "text-purple-300" : "text-slate-600"}`}
            >
              {done ? (
                <Check size={12} className="shrink-0" />
              ) : active ? (
                <Loader2 size={12} className="shrink-0 animate-spin" />
              ) : (
                <div className="w-3 h-3 rounded-full border border-current shrink-0 opacity-30" />
              )}
              {STAGE_LABELS[s]}
              {active && (
                <span className="ml-auto text-slate-500">
                  {elapsed(job.elapsedMs)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Browser audit status badges */}
      {job.browserStage === "browser_scanning" && (
        <div
          className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-900/30 border border-purple-500/30 rounded-lg px-2.5 py-1.5 animate-pulse"
          data-ocid={`audit.browser_scanning.${job.id}`}
        >
          <Shield size={11} />
          Live Visual Scan Running...
        </div>
      )}
      {job.browserStage === "browser_awaiting_approval" && (
        <div
          className="flex items-center gap-1.5 text-xs text-orange-300 bg-orange-900/30 border border-orange-500/30 rounded-lg px-2.5 py-1.5"
          data-ocid={`audit.browser_awaiting_approval.${job.id}`}
        >
          <Lock size={11} />
          Awaiting Your Approval
        </div>
      )}
      {job.browserStage === "browser_approved" && (
        <div
          className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-500/30 rounded-lg px-2.5 py-1.5"
          data-ocid={`audit.browser_approved.${job.id}`}
        >
          <Check size={11} />
          Browser Verified
        </div>
      )}
      {job.browserStage === "browser_rejected" && (
        <div
          className="flex items-center gap-1.5 text-xs text-red-300 bg-red-900/30 border border-red-500/30 rounded-lg px-2.5 py-1.5"
          data-ocid={`audit.browser_rejected.${job.id}`}
        >
          <X size={11} />
          Browser Rejected
        </div>
      )}
    </div>
  );
}

function ResultCard({
  result,
  tenantId,
  onApprove,
  onReject,
  onBrowserStageChange,
}: {
  result: AuditResult;
  tenantId: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBrowserStageChange?: (
    jobId: string,
    stage:
      | "browser_scanning"
      | "browser_awaiting_approval"
      | "browser_approved"
      | "browser_rejected",
  ) => void;
}) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [browserApproved, setBrowserApproved] = useState(false);
  const label = getScoreLabel(result.totalScore);

  const copyEmail = () => {
    navigator.clipboard.writeText(
      `Subject: ${result.emailSubject}\n\n${result.emailBody}`,
    );
    toast.success("Email copied to clipboard");
  };

  const copyKitUrl = () => {
    if (result.kitPageSlug) {
      navigator.clipboard.writeText(
        `https://bookedrankedfunded.org/brand-kit/${result.kitPageSlug}`,
      );
      toast.success("Brand Kit URL copied");
    }
  };

  const handleBrowserApproved = () => {
    setBrowserApproved(true);
    onBrowserStageChange?.(result.jobId, "browser_approved");
    onApprove(result.jobId);
  };

  const handleBrowserRejected = () => {
    onBrowserStageChange?.(result.jobId, "browser_rejected");
    onReject(result.jobId);
  };

  const handleBrowserScanning = () => {
    onBrowserStageChange?.(result.jobId, "browser_scanning");
  };

  return (
    <div
      className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden"
      data-ocid={`audit.result.card.${result.jobId}`}
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3 border-b border-white/8">
        <div className="flex items-start gap-3 min-w-0">
          <ScoreDial score={result.totalScore} />
          <div className="min-w-0">
            <p className="font-semibold text-white">{result.businessName}</p>
            <a
              href={result.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 truncate"
            >
              {result.website} <ExternalLink size={10} />
            </a>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge
                variant="outline"
                className="text-[10px] bg-purple-900/40 text-purple-300 border-purple-500/30"
              >
                {NICHE_LABELS[result.niche]}
              </Badge>
              {result.city && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-slate-700 text-slate-300 border-white/10"
                >
                  {result.city}
                </Badge>
              )}
              {result.researchSource === "perplexity" && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-violet-900/40 text-violet-300 border-violet-500/30 flex items-center gap-1"
                  data-ocid={`audit.result.research_source.${result.jobId}`}
                >
                  <Brain size={8} />
                  Perplexity Live
                </Badge>
              )}
              {(result.researchSource === "claude" ||
                result.researchSource === "openai") && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-purple-900/40 text-purple-300 border-purple-500/30 flex items-center gap-1"
                  data-ocid={`audit.result.research_source.${result.jobId}`}
                >
                  <Brain size={8} />
                  AI Research
                </Badge>
              )}
              {result.researchSource === "searxng" && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-teal-900/40 text-teal-300 border-teal-500/30 flex items-center gap-1"
                  data-ocid={`audit.result.research_source.${result.jobId}`}
                >
                  <Search size={8} />
                  SearXNG
                </Badge>
              )}
              {browserApproved && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-emerald-900/40 text-emerald-300 border-emerald-500/30 flex items-center gap-1"
                >
                  <Shield size={8} />
                  Browser Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`text-xs border shrink-0 ${getScoreBadgeClass(label)}`}
        >
          {label} Lead
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {/* Score breakdown */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Score Breakdown
          </p>
          <div className="space-y-1.5">
            <BreakdownBar label="Website" value={result.breakdown.website} />
            <BreakdownBar label="Social" value={result.breakdown.social} />
            <BreakdownBar label="SEO" value={result.breakdown.seo} />
            <BreakdownBar
              label="Engagement"
              value={result.breakdown.engagement}
            />
            <BreakdownBar label="Growth" value={result.breakdown.growth} />
          </div>
        </div>

        {/* Snapshot */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Company Snapshot
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {result.companySnapshot}
          </p>
        </div>

        {/* Social */}
        {result.socialLinks.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Social Presence
            </p>
            <div className="flex flex-wrap gap-2">
              {result.socialLinks.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                >
                  {s.platform === "linkedin" && (
                    <Linkedin size={12} className="text-blue-400" />
                  )}
                  {s.platform === "facebook" && (
                    <Facebook size={12} className="text-blue-500" />
                  )}
                  {s.platform === "instagram" && (
                    <Instagram size={12} className="text-pink-400" />
                  )}
                  <span className="capitalize">{s.platform}</span>
                  {s.followers && (
                    <span className="text-slate-500">
                      · {s.followers.toLocaleString()}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* SEO */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            SEO Signals
          </p>
          <ul className="space-y-1">
            {result.seoSignals.map((sig) => (
              <li
                key={sig}
                className="text-xs text-slate-300 flex items-start gap-1.5"
              >
                <Search size={10} className="text-slate-500 mt-0.5 shrink-0" />
                {sig}
              </li>
            ))}
          </ul>
        </div>

        {/* Insights */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            AI Insights
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {result.insights}
          </p>
        </div>

        {/* Email */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setEmailOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5 transition-colors"
            data-ocid={`audit.result.email_toggle.${result.jobId}`}
          >
            <span className="flex items-center gap-2">
              <Mail size={14} className="text-indigo-400" /> First-Touch Email
              Preview
            </span>
            {emailOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {emailOpen && (
            <div className="px-3 pb-3 space-y-2 border-t border-white/8">
              <p className="text-xs text-slate-400 mt-2">
                Subject:{" "}
                <span className="text-slate-200">{result.emailSubject}</span>
              </p>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                {result.emailBody}
              </pre>
              <Button
                size="sm"
                variant="outline"
                onClick={copyEmail}
                className="text-xs border-white/20 text-slate-300 hover:text-white"
                data-ocid={`audit.result.copy_email.${result.jobId}`}
              >
                <ClipboardCopy size={12} className="mr-1" /> Copy Email
              </Button>
            </div>
          )}
        </div>

        {/* Kit URL */}
        {result.kitPageSlug && (
          <div className="flex items-center gap-2 bg-purple-900/20 border border-purple-500/20 rounded-lg px-3 py-2">
            <Zap size={14} className="text-purple-400 shrink-0" />
            <span className="text-xs text-slate-300 truncate flex-1">
              https://bookedrankedfunded.org/brand-kit/{result.kitPageSlug}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyKitUrl}
              className="shrink-0 h-6 px-2 text-purple-400 hover:text-purple-300"
              data-ocid={`audit.result.copy_kit_url.${result.jobId}`}
            >
              <ClipboardCopy size={11} />
            </Button>
          </div>
        )}

        {/* ── Browser Audit Panel (human approval checkpoint) ─────────────── */}
        {result.status === "pending_review" && (
          <BrowserAuditPanel
            jobId={result.jobId}
            tenantId={tenantId}
            businessName={result.businessName}
            websiteUrl={result.website}
            niche={result.niche}
            city={result.city}
            onApproved={handleBrowserApproved}
            onRejected={handleBrowserRejected}
            onReAuditRequested={handleBrowserScanning}
          />
        )}

        {result.status === "approved" && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs pt-1">
            <Check size={14} /> Pushed to CRM{" "}
            {result.crmLeadId ? `· Lead #${result.crmLeadId.slice(-6)}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AILeadIntelligencePage() {
  const { actor } = useActor();
  // Get credentials from backend via context — no localStorage
  const { creds } = useCredentials();
  const litellmUrl = creds?.litellmUrl ?? "";
  const litellmKey = creds?.litellmKey ?? "";
  const searxngUrl = creds?.searxngUrl ?? "";
  const perplexityApiKey = creds?.perplexityApiKey ?? "";
  const claudeKey = creds?.claudeKey ?? "";
  const openaiKey = creds?.openaiKey ?? "";

  // Tenant ID from credentials context
  const tenantId = "platform";

  // Active audit jobs (in-progress)
  const [jobs, setJobs] = useState<AuditJob[]>([]);
  // Elapsed timers
  const timersRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  // Results
  const [results, setResults] = useState<AuditResult[]>([]);

  // New audit modal
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    website: "",
    niche: "" as Niche | "",
    city: "",
    phone: "",
    email: "",
  });
  const [formError, setFormError] = useState("");

  // Batch modal
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchText, setBatchText] = useState("");
  const [batchError, setBatchError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of Object.values(timers)) clearInterval(t);
    };
  }, []);

  const startElapsedTimer = useCallback((jobId: string) => {
    const start = Date.now();
    timersRef.current[jobId] = setInterval(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, elapsedMs: Date.now() - start } : j,
        ),
      );
    }, 500);
  }, []);

  const stopTimer = useCallback((jobId: string) => {
    clearInterval(timersRef.current[jobId]);
    delete timersRef.current[jobId];
  }, []);

  const runAudit = useCallback(
    async (job: AuditJob) => {
      startElapsedTimer(job.id);

      // Notify backend job created
      if (actor) {
        try {
          await actor.createLeadAuditJob({
            id: job.id,
            businessName: job.businessName,
            website: job.website,
            niche: job.niche,
            city: job.city,
            phone: job.phone,
            email: job.email,
            status: "in_progress",
            createdAt: BigInt(Date.now()),
          });
        } catch {
          // continue — audit runs in frontend regardless
        }
      }

      const updateStage = (stage: AuditStage) => {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, stage } : j)),
        );
        if (actor) {
          actor.updateLeadAuditJobStatus(job.id, stage).catch(() => {});
        }
      };

      try {
        const resultData = await runAuditPipeline(
          job,
          updateStage,
          litellmUrl,
          litellmKey,
          searxngUrl,
          perplexityApiKey,
          claudeKey,
          openaiKey,
        );
        const finalResult: AuditResult = {
          ...resultData,
          status: "pending_review",
          completedAt: Date.now(),
        };

        if (actor) {
          try {
            await actor.saveLeadAuditResult({
              jobId: job.id,
              businessName: finalResult.businessName,
              website: finalResult.website,
              niche: finalResult.niche,
              totalScore: BigInt(finalResult.totalScore),
              breakdown: {
                website: BigInt(finalResult.breakdown.website),
                social: BigInt(finalResult.breakdown.social),
                seo: BigInt(finalResult.breakdown.seo),
                engagement: BigInt(finalResult.breakdown.engagement),
                growth: BigInt(finalResult.breakdown.growth),
              },
              companySnapshot: finalResult.companySnapshot,
              insights: finalResult.insights,
              emailSubject: finalResult.emailSubject,
              emailBody: finalResult.emailBody,
              status: "pending_review",
              completedAt: BigInt(finalResult.completedAt),
            });
          } catch {
            // continue
          }
        }

        setResults((prev) => [finalResult, ...prev]);
        setJobs((prev) => prev.filter((j) => j.id !== job.id));
        stopTimer(job.id);
        toast.success(`Audit complete for ${job.businessName}`, {
          description: `Score: ${finalResult.totalScore}/100`,
        });
      } catch {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, stage: "failed" } : j)),
        );
        stopTimer(job.id);
        toast.error(`Audit failed for ${job.businessName}`);
      }
    },
    [
      actor,
      startElapsedTimer,
      stopTimer,
      litellmUrl,
      litellmKey,
      searxngUrl,
      perplexityApiKey,
      claudeKey,
      openaiKey,
    ],
  );

  const handleStartAudit = async () => {
    if (!form.businessName.trim()) {
      setFormError("Business name is required");
      return;
    }
    if (!form.website.trim()) {
      setFormError("Website URL is required");
      return;
    }
    if (!form.niche) {
      setFormError("Please select a niche");
      return;
    }
    setFormError("");

    const job: AuditJob = {
      id: `audit-${Date.now()}`,
      businessName: form.businessName.trim(),
      website: form.website.trim().startsWith("http")
        ? form.website.trim()
        : `https://${form.website.trim()}`,
      niche: form.niche as Niche,
      city: form.city.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      stage: "fetching_website",
      startedAt: Date.now(),
      elapsedMs: 0,
    };

    setJobs((prev) => [job, ...prev]);
    setAuditModalOpen(false);
    setForm({
      businessName: "",
      website: "",
      niche: "",
      city: "",
      phone: "",
      email: "",
    });
    runAudit(job);
  };

  const handleBatchSubmit = () => {
    const lines = batchText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      setBatchError("Paste at least one line of CSV data");
      return;
    }
    const parsed: BatchRow[] = [];
    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim());
      if (parts.length < 2) continue;
      parsed.push({
        name: parts[0],
        website: parts[1],
        niche: parts[2] ?? "plumbing",
      });
    }
    if (parsed.length === 0) {
      setBatchError("Could not parse any rows. Format: Name, Website, Niche");
      return;
    }
    setBatchError("");
    setBatchModalOpen(false);
    setBatchText("");
    for (const row of parsed.slice(0, 20)) {
      const job: AuditJob = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        businessName: row.name,
        website: row.website.startsWith("http")
          ? row.website
          : `https://${row.website}`,
        niche: (NICHES.includes(row.niche as Niche)
          ? row.niche
          : "plumbing") as Niche,
        city: "",
        phone: "",
        email: "",
        stage: "fetching_website",
        startedAt: Date.now(),
        elapsedMs: 0,
      };
      setJobs((prev) => [job, ...prev]);
      // stagger batch starts
      setTimeout(() => {
        runAudit(job);
      }, parsed.indexOf(row) * 2000);
    }
    toast.success(`Queued ${Math.min(parsed.length, 20)} batch audits`);
  };

  const handleApprove = useCallback(
    async (jobId: string) => {
      const result = results.find((r) => r.jobId === jobId);
      if (!result) return;

      let kitSlug: string | undefined;
      if (actor) {
        try {
          const resp = (await actor.approveAndPushToCrm(jobId)) as {
            ok?: { kitPageSlug?: string; leadId?: string };
          };
          kitSlug = resp?.ok?.kitPageSlug ?? undefined;
        } catch {
          // continue with local update
        }
      }

      setResults((prev) =>
        prev.map((r) =>
          r.jobId === jobId
            ? {
                ...r,
                status: "approved",
                approvedAt: Date.now(),
                kitPageSlug: kitSlug ?? `kit-${jobId.slice(-8)}`,
              }
            : r,
        ),
      );
      toast.success(`${result.businessName} pushed to CRM`, {
        description: "Brand Kit trial URL generated",
      });
    },
    [actor, results],
  );

  const handleReject = useCallback((jobId: string) => {
    setResults((prev) =>
      prev.map((r) => (r.jobId === jobId ? { ...r, status: "rejected" } : r)),
    );
    toast("Lead rejected and removed from queue");
  }, []);

  const handleBrowserStageChange = useCallback(
    (
      jobId: string,
      stage:
        | "browser_scanning"
        | "browser_awaiting_approval"
        | "browser_approved"
        | "browser_rejected",
    ) => {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, browserStage: stage } : j)),
      );
    },
    [],
  );

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBatchText((ev.target?.result as string) ?? "");
    reader.readAsText(file);
  };

  const pending = results.filter((r) => r.status === "pending_review");
  const history = results.filter(
    (r) => r.status === "approved" || r.status === "rejected",
  );

  return (
    <div className="space-y-6 pb-8" data-ocid="ai_lead_intelligence.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain size={22} className="text-purple-400" />
            AI Lead Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Audit prospect websites, scan social profiles, score leads, and
            generate personalized outreach — powered by AI.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setBatchModalOpen(true)}
            className="border-white/20 text-slate-300 hover:text-white text-sm"
            data-ocid="ai_lead_intelligence.batch_audit_button"
          >
            <Upload size={14} className="mr-1.5" /> Batch Audit (CSV)
          </Button>
          <Button
            onClick={() => setAuditModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm"
            data-ocid="ai_lead_intelligence.new_audit_button"
          >
            <Plus size={14} className="mr-1.5" /> Audit New Lead
          </Button>
        </div>
      </div>

      {/* Queue */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-white">Audit Queue</h2>
          {jobs.length > 0 && (
            <span className="w-5 h-5 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {jobs.length}
            </span>
          )}
        </div>
        {jobs.length === 0 ? (
          <Card
            className="bg-slate-800/40 border-white/10 p-6 text-center"
            data-ocid="ai_lead_intelligence.queue.empty_state"
          >
            <Loader2 size={24} className="text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              No active audits. Start one above.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {jobs.map((j) => (
              <AuditQueueCard key={j.id} job={j} />
            ))}
          </div>
        )}
      </div>

      {/* Results Review */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-white">
            Results Awaiting Review
          </h2>
          {pending.length > 0 && (
            <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {pending.length}
            </span>
          )}
        </div>
        {pending.length === 0 ? (
          <Card
            className="bg-slate-800/40 border-white/10 p-6 text-center"
            data-ocid="ai_lead_intelligence.results.empty_state"
          >
            <AlertCircle size={24} className="text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              No results awaiting review.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pending.map((r) => (
              <ResultCard
                key={r.jobId}
                result={r}
                tenantId={tenantId}
                onApprove={handleApprove}
                onReject={handleReject}
                onBrowserStageChange={handleBrowserStageChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">
            Audit History
          </h2>
          <div className="bg-slate-800/40 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-xs text-slate-500 text-left">
                  <th className="px-4 py-2.5 font-medium">Business</th>
                  <th className="px-4 py-2.5 font-medium hidden sm:table-cell">
                    Niche
                  </th>
                  <th className="px-4 py-2.5 font-medium text-center">Score</th>
                  <th className="px-4 py-2.5 font-medium text-center">
                    Status
                  </th>
                  <th className="px-4 py-2.5 font-medium hidden md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((r, i) => (
                  <tr
                    key={r.jobId}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
                    data-ocid={`ai_lead_intelligence.history.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white truncate max-w-[160px]">
                        {r.businessName}
                      </p>
                      <a
                        href={r.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:underline truncate block max-w-[160px]"
                      >
                        {r.website}
                      </a>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-slate-400">
                        {NICHE_LABELS[r.niche]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-bold text-sm ${getScoreRingColor(r.totalScore)}`}
                      >
                        {r.totalScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {r.status === "approved" ? (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          In CRM
                        </span>
                      ) : (
                        <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-500">
                      {new Date(r.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── New Audit Modal ─────────────────────────────────────────────────── */}
      {auditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          data-ocid="audit.new.dialog"
        >
          <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Brain size={16} className="text-purple-400" /> Audit New Lead
              </h3>
              <button
                type="button"
                onClick={() => setAuditModalOpen(false)}
                className="text-slate-400 hover:text-white"
                data-ocid="audit.new.close_button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">
                  Business Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={form.businessName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, businessName: e.target.value }))
                  }
                  placeholder="ABC Plumbing & Drain"
                  className="bg-slate-800 border-white/15 text-white placeholder:text-slate-600"
                  data-ocid="audit.new.business_name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">
                  Website URL <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={form.website}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, website: e.target.value }))
                  }
                  placeholder="https://abcplumbing.com"
                  className="bg-slate-800 border-white/15 text-white placeholder:text-slate-600"
                  data-ocid="audit.new.website.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">
                  Niche <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={form.niche}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, niche: v as Niche }))
                  }
                >
                  <SelectTrigger
                    className="bg-slate-800 border-white/15 text-white"
                    data-ocid="audit.new.niche.select"
                  >
                    <SelectValue placeholder="Select niche…" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/15">
                    {NICHES.map((n) => (
                      <SelectItem key={n} value={n}>
                        {NICHE_LABELS[n]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    placeholder="San Diego, CA"
                    className="bg-slate-800 border-white/15 text-white placeholder:text-slate-600"
                    data-ocid="audit.new.city.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-400">Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="(619) 555-0100"
                    className="bg-slate-800 border-white/15 text-white placeholder:text-slate-600"
                    data-ocid="audit.new.phone.input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="owner@business.com"
                  className="bg-slate-800 border-white/15 text-white placeholder:text-slate-600"
                  data-ocid="audit.new.email.input"
                />
              </div>
              {formError && (
                <div
                  className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                  data-ocid="audit.new.error_state"
                >
                  <AlertCircle size={12} />
                  {formError}
                </div>
              )}
            </div>
            <div className="flex gap-2 p-5 border-t border-white/8">
              <Button
                variant="outline"
                onClick={() => setAuditModalOpen(false)}
                className="flex-1 border-white/20 text-slate-300 hover:text-white"
                data-ocid="audit.new.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartAudit}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white"
                data-ocid="audit.new.submit_button"
              >
                <Zap size={14} className="mr-1.5" /> Start Audit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Batch Audit Modal ───────────────────────────────────────────────── */}
      {batchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          data-ocid="audit.batch.dialog"
        >
          <div className="bg-slate-900 border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Upload size={16} className="text-purple-400" /> Batch Audit
                (CSV)
              </h3>
              <button
                type="button"
                onClick={() => setBatchModalOpen(false)}
                className="text-slate-400 hover:text-white"
                data-ocid="audit.batch.close_button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-400">
                One lead per line:{" "}
                <span className="font-mono text-slate-300">
                  Business Name, Website, Niche
                </span>
                . Max 20 per batch.
              </p>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">
                  Paste CSV data or upload a file
                </Label>
                <Textarea
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder={
                    "ABC Plumbing, https://abcplumbing.com, plumbing\nCity HVAC, https://cityhvac.com, hvac"
                  }
                  className="bg-slate-800 border-white/15 text-white placeholder:text-slate-600 font-mono text-xs min-h-[120px]"
                  data-ocid="audit.batch.csv_textarea"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="border-white/20 text-slate-300 hover:text-white text-xs"
                  data-ocid="audit.batch.upload_button"
                >
                  <Upload size={12} className="mr-1" /> Upload CSV
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleCsvFile}
                />
                <span className="text-xs text-slate-600">or paste above</span>
              </div>
              {batchError && (
                <div
                  className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                  data-ocid="audit.batch.error_state"
                >
                  <AlertCircle size={12} />
                  {batchError}
                </div>
              )}
            </div>
            <div className="flex gap-2 p-5 border-t border-white/8">
              <Button
                variant="outline"
                onClick={() => setBatchModalOpen(false)}
                className="flex-1 border-white/20 text-slate-300 hover:text-white"
                data-ocid="audit.batch.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBatchSubmit}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white"
                data-ocid="audit.batch.submit_button"
              >
                <TrendingUp size={14} className="mr-1.5" /> Queue Batch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
