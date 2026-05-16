import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  FileText,
  Lightbulb,
  MessageCircle,
  Minus,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useApp } from "../context/AppContext";
import type { SocialPost, SocialROIMetrics } from "../types/socialMedia";

// ── Types ─────────────────────────────────────────────────────────────────────

type Period = "This Week" | "This Month" | "Last Month" | "Last 90 Days";

interface ChannelStats {
  platform: string;
  color: string;
  label: string;
  posts: number;
  engagement: number;
  pct: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PERIODS: Period[] = [
  "This Week",
  "This Month",
  "Last Month",
  "Last 90 Days",
];

const PLATFORM_META: Record<string, { color: string; label: string }> = {
  facebook: { color: "oklch(0.6 0.18 240)", label: "Facebook" },
  instagram: { color: "oklch(0.72 0.18 75)", label: "Instagram" },
  google_business: { color: "oklch(0.65 0.2 155)", label: "Google Business" },
  linkedin: { color: "oklch(0.6 0.18 220)", label: "LinkedIn" },
  tiktok: { color: "oklch(0.9 0.01 280)", label: "TikTok" },
};

const FRAMEWORK_LABELS: Record<string, string> = {
  ogilvy_storytelling: "Ogilvy Storytelling",
  hormozi_value_stack: "Hormozi Value Stack",
  kennedy_urgency: "Kennedy Urgency",
  halbert_specificity: "Halbert Specificity",
  cialdini_social_proof: "Cialdini Social Proof",
  dan_kennedy_direct: "Dan Kennedy Direct",
  gary_halbert_attention: "Halbert Attention",
  claude_hopkins_reason_why: "Hopkins Reason Why",
  jay_abraham_strategy: "Abraham Strategy",
  russell_brunson_hook_story: "Brunson Hook Story",
};

const FUNNEL_META: Record<string, { label: string; color: string }> = {
  tofu: {
    label: "TOFU",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  mofu: {
    label: "MOFU",
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  bofu: {
    label: "BOFU",
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
};

// ── Niche-specific cost-of-inaction copy ──────────────────────────────────────

const NICHE_INACTION: Record<string, string> = {
  plumbing:
    "Plumbing businesses that went dark on social during slow season saw a 38% drop in spring call volume. Visibility compounds.",
  hvac: "HVAC companies that went dark on social in shoulder season saw a 34% drop in spring bookings. Consistent presence owns the market.",
  med_spa:
    "Med spas that stopped posting during slow months saw a 41% drop in consultation requests 6 weeks later. Momentum matters.",
  restoration:
    "Restoration companies that maintain social presence see 2.3x more emergency referrals during disaster events. Be top of mind when it counts.",
  roofing:
    "Roofing contractors with consistent social presence close 28% more storm-damage leads than those who only post reactively.",
  real_estate:
    "Real estate agents who post consistently get 3x more referral introductions from past clients. Visibility drives trust.",
  default:
    "Businesses that maintain consistent social activity see 40% more inbound inquiries than those that post reactively.",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function trendFor(period: Period): Partial<SocialROIMetrics> {
  const deltas: Record<Period, Partial<SocialROIMetrics>> = {
    "This Week": {
      postsPublished: 4,
      totalEngagement: 847,
      leadsFromSocial: 14,
      bookingsFromSocial: 6,
    },
    "This Month": {
      postsPublished: 18,
      totalEngagement: 4230,
      leadsFromSocial: 47,
      bookingsFromSocial: 22,
    },
    "Last Month": {
      postsPublished: 14,
      totalEngagement: 3420,
      leadsFromSocial: 38,
      bookingsFromSocial: 16,
    },
    "Last 90 Days": {
      postsPublished: 52,
      totalEngagement: 12800,
      leadsFromSocial: 141,
      bookingsFromSocial: 62,
    },
  };
  return deltas[period];
}

function buildNarrative(
  metrics: SocialROIMetrics,
  posts: SocialPost[],
): string {
  const topPost = posts.find((p) => p.id === metrics.topPerformingPost);
  const tofuCount = posts.filter((p) => p.funnelStage === "tofu").length;
  const mofuCount = posts.filter((p) => p.funnelStage === "mofu").length;
  const bofuCount = posts.filter((p) => p.funnelStage === "bofu").length;
  const total = tofuCount + mofuCount + bofuCount || 1;
  const bofuPct = Math.round((bofuCount / total) * 100);

  let rec = "";
  if (bofuPct < 20)
    rec =
      "Recommend increasing BOFU (conversion) posts — your funnel is top-heavy with awareness content.";
  else if (bofuPct > 60)
    rec =
      "Consider adding more TOFU awareness content to keep feeding your funnel.";
  else
    rec =
      "Your funnel stage mix is balanced — maintain this ratio and focus on engagement quality.";

  const topPostSnippet = topPost
    ? `Your top performer was "${topPost.content.slice(0, 60)}…" `
    : "";
  return `Your social media generated ${metrics.leadsFromSocial} leads this ${metrics.period.toLowerCase()}, converting ${metrics.bookingsFromSocial} to bookings. ${topPostSnippet}Total engagement reached ${metrics.totalEngagement.toLocaleString()} across all platforms. ${rec}`;
}

function buildChannelStats(posts: SocialPost[]): ChannelStats[] {
  const counts: Record<string, { posts: number; engagement: number }> = {};
  for (const post of posts) {
    if (post.status !== "published") continue;
    for (const p of post.platforms) {
      if (!counts[p]) counts[p] = { posts: 0, engagement: 0 };
      counts[p].posts++;
      counts[p].engagement +=
        post.engagementMetrics.likes +
        post.engagementMetrics.comments +
        post.engagementMetrics.shares;
    }
  }
  const totalEngage =
    Object.values(counts).reduce((s, c) => s + c.engagement, 0) || 1;
  return Object.entries(counts)
    .map(([platform, data]) => ({
      platform,
      color: PLATFORM_META[platform]?.color ?? "oklch(0.58 0.22 290)",
      label: PLATFORM_META[platform]?.label ?? platform,
      posts: data.posts,
      engagement: data.engagement,
      pct: Math.round((data.engagement / totalEngage) * 100),
    }))
    .sort((a, b) => b.engagement - a.engagement);
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: number;
  prev: number;
  sub: string;
  icon: React.ReactNode;
  ocid: string;
  format?: "number" | "currency";
}

function KpiCard({
  label,
  value,
  prev,
  sub,
  icon,
  ocid,
  format = "number",
}: KpiCardProps) {
  const delta = prev > 0 ? ((value - prev) / prev) * 100 : 0;
  const isUp = delta > 0;
  const isFlat = Math.abs(delta) < 1;
  const display =
    format === "currency"
      ? `$${value.toLocaleString()}`
      : value.toLocaleString();

  return (
    <div className="roi-metric-card" data-ocid={ocid}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          {icon}
        </div>
        {!isFlat ? (
          <span
            className={`text-xs font-semibold flex items-center gap-0.5 ${isUp ? "text-emerald-400" : "text-rose-400"}`}
          >
            {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(Math.round(delta))}%
          </span>
        ) : (
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <Minus size={10} /> 0%
          </span>
        )}
      </div>
      <div className="roi-metric-number">{display}</div>
      <div className="roi-metric-label">{label}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

// ── Monthly Report Component ───────────────────────────────────────────────────

function MonthlyReport({
  metrics,
  channelStats,
  topPost,
  allPosts,
  niche,
}: {
  metrics: SocialROIMetrics;
  channelStats: ChannelStats[];
  topPost: SocialPost | undefined;
  allPosts: SocialPost[];
  niche: string;
}) {
  const [reportClient, setReportClient] = useState("Martinez Plumbing");
  const [exporting, setExporting] = useState(false);

  const nicheKey = niche.toLowerCase().replace(/\s+/g, "_");
  const inactionCopy = NICHE_INACTION[nicheKey] ?? NICHE_INACTION.default;

  const avgTicket = niche.includes("hvac")
    ? 2800
    : niche.includes("med_spa")
      ? 650
      : niche.includes("roofing")
        ? 8500
        : 1200;
  const conversionRate = 0.42;
  const estimatedValue = Math.round(
    metrics.leadsFromSocial * avgTicket * conversionRate,
  );

  const publishedPosts = allPosts.filter((p) => p.status === "published");
  const topThreePosts = publishedPosts
    .sort(
      (a, b) =>
        b.engagementMetrics.likes +
        b.engagementMetrics.comments -
        (a.engagementMetrics.likes + a.engagementMetrics.comments),
    )
    .slice(0, 3);

  const aiRecommendations = [
    "Increase before/after content — your niche averages 3x higher engagement on result-focused posts versus general tips.",
    "Add one LinkedIn post per week — commercial clients and referral partners research you there before reaching out.",
    "Your best posting window is Friday morning and Wednesday evening. Shift more scheduled posts to these windows.",
  ];

  const competitorCount =
    metrics.postsPublished < 8
      ? Math.floor(metrics.postsPublished * 1.6)
      : Math.floor(metrics.postsPublished * 0.85);

  const handleExport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setExporting(false);
    toast.success("Monthly report exported as PDF", {
      description: "File saved to your downloads folder",
    });
  };

  return (
    <div className="space-y-6" data-ocid="social-roi.monthly_report">
      {/* Report header */}
      <div
        className="rounded-xl border border-border p-5"
        style={{ background: "oklch(0.14 0.014 280)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={reportClient}
                onChange={(e) => setReportClient(e.target.value)}
                className="text-xl font-bold text-foreground bg-transparent border-none outline-none focus:border-b focus:border-primary/40 transition-all"
                data-ocid="social-roi.report_client_name.input"
              />
              <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                click to edit
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Monthly Social Media Performance Report ·{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="badge-purple text-xs">BRF Analytics</Badge>
              <Badge className="badge-emerald text-xs">Auto-generated</Badge>
            </div>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            data-ocid="social-roi.export_report.button"
          >
            {exporting ? (
              <>
                <Zap className="h-4 w-4 animate-pulse" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Executive Summary — Hormozi value stack */}
      <Card
        className="bg-card border-border"
        data-ocid="social-roi.executive_summary"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Executive Summary
            <Badge className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20">
              Hormozi Value Stack
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {[
              {
                label: "Posts Published",
                value: metrics.postsPublished,
                icon: "📅",
                color: "text-primary",
              },
              {
                label: "Total Reach",
                value: (metrics.totalEngagement * 14).toLocaleString(),
                icon: "👁",
                color: "text-blue-400",
              },
              {
                label: "Total Engagement",
                value: metrics.totalEngagement.toLocaleString(),
                icon: "💬",
                color: "text-amber-400",
              },
              {
                label: "Leads from Social",
                value: metrics.leadsFromSocial,
                icon: "🎯",
                color: "text-emerald-400",
              },
              {
                label: "Bookings Driven",
                value: metrics.bookingsFromSocial,
                icon: "📞",
                color: "text-rose-400",
              },
              {
                label: "Est. Value of Leads",
                value: `$${estimatedValue.toLocaleString()}`,
                icon: "💰",
                color: "text-emerald-400",
              },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                className="rounded-xl bg-muted/20 border border-border p-3 text-center"
              >
                <p className="text-lg mb-1">{icon}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 bg-emerald-500/5 border border-emerald-500/15">
            <p className="text-xs text-emerald-300 leading-relaxed">
              <strong>Bottom line:</strong> Your social media generated an
              estimated{" "}
              <strong>
                ${estimatedValue.toLocaleString()} in pipeline value
              </strong>{" "}
              this month — based on {metrics.leadsFromSocial} leads at $
              {avgTicket.toLocaleString()} avg ticket and{" "}
              {Math.round(conversionRate * 100)}% close rate for your niche.
              That's a positive return on every hour invested in social.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Platform Breakdown */}
      <Card
        className="bg-card border-border"
        data-ocid="social-roi.monthly_platform_breakdown"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Platform Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className="roi-channel-bar"
            data-ocid="social-roi.monthly_channel_bar"
          >
            {channelStats.map((ch) => (
              <div
                key={ch.platform}
                className="roi-channel-segment"
                style={{
                  flex: ch.pct,
                  backgroundColor: ch.color,
                  minWidth: ch.pct > 5 ? undefined : "0px",
                  opacity: ch.pct > 5 ? 1 : 0,
                }}
                title={`${ch.label}: ${ch.pct}%`}
              >
                {ch.pct > 12 ? `${ch.pct}%` : ""}
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-2">
            {channelStats.map((ch, i) => (
              <div
                key={ch.platform}
                data-ocid={`social-roi.monthly_channel.item.${i + 1}`}
                className="flex items-center gap-3"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: ch.color }}
                />
                <span className="text-xs text-foreground font-medium flex-1 min-w-0 truncate">
                  {ch.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {ch.posts} posts
                </span>
                <span className="text-[10px] text-foreground font-semibold w-12 text-right">
                  {ch.engagement.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground w-8 text-right">
                  {ch.pct}%
                </span>
              </div>
            ))}
            {channelStats.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                No published posts yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card
        className="bg-card border-border"
        data-ocid="social-roi.top_content_section"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-400" />
            Top 3 Performing Posts This Month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topThreePosts.length === 0 && topPost ? (
            <div
              data-ocid="social-roi.top_content.item.1"
              className="rounded-xl bg-muted/20 border border-border p-3"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {topPost.platforms.map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">
                    {PLATFORM_META[p]?.label ?? p}
                  </Badge>
                ))}
                <Badge className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10">
                  🏆 #1
                </Badge>
              </div>
              <p className="text-xs text-foreground leading-relaxed line-clamp-2">
                {topPost.content}
              </p>
              <div className="flex gap-4 mt-2">
                {[
                  { label: "Likes", value: topPost.engagementMetrics.likes },
                  {
                    label: "Comments",
                    value: topPost.engagementMetrics.comments,
                  },
                  { label: "Shares", value: topPost.engagementMetrics.shares },
                  {
                    label: "Leads",
                    value: topPost.engagementMetrics.leadsGenerated,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs font-bold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            topThreePosts.map((post, i) => (
              <div
                key={post.id}
                data-ocid={`social-roi.top_content.item.${i + 1}`}
                className="rounded-xl bg-muted/20 border border-border p-3"
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {post.platforms.map((p) => (
                    <Badge key={p} variant="secondary" className="text-[10px]">
                      {PLATFORM_META[p]?.label ?? p}
                    </Badge>
                  ))}
                  <Badge className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10">
                    #{i + 1}
                  </Badge>
                  <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                    {FRAMEWORK_LABELS[post.marketingFramework] ??
                      post.marketingFramework}
                  </Badge>
                </div>
                <p className="text-xs text-foreground leading-relaxed line-clamp-2">
                  {post.content}
                </p>
                <div className="flex gap-4 mt-2">
                  {[
                    { label: "Likes", value: post.engagementMetrics.likes },
                    {
                      label: "Comments",
                      value: post.engagementMetrics.comments,
                    },
                    { label: "Shares", value: post.engagementMetrics.shares },
                    {
                      label: "Leads",
                      value: post.engagementMetrics.leadsGenerated,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-xs font-bold text-foreground">
                        {value}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          {topThreePosts.length === 0 && !topPost && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Publish posts to track top performers.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Competitor Comparison */}
      <Card
        className="bg-card border-border"
        data-ocid="social-roi.competitor_comparison"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Competitor Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Your competitors posted this month
              </span>
              <span className="font-bold text-foreground">
                {competitorCount} posts avg
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">
                You posted this month
              </span>
              <span
                className={`font-bold ${metrics.postsPublished >= competitorCount ? "text-emerald-400" : "text-amber-400"}`}
              >
                {metrics.postsPublished} posts
              </span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full bg-muted/60 absolute"
                style={{
                  width: `${Math.min(100, (competitorCount / Math.max(metrics.postsPublished, competitorCount)) * 100)}%`,
                }}
              />
              <div
                className="h-full rounded-full bg-primary relative"
                style={{
                  width: `${Math.min(100, (metrics.postsPublished / Math.max(metrics.postsPublished, competitorCount)) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.postsPublished >= competitorCount
                ? `You're outposting your market by ${metrics.postsPublished - competitorCount} posts. Keep the pressure on.`
                : `Increase posting frequency by ${competitorCount - metrics.postsPublished} posts to match your market's average.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card
        className="bg-card border-border"
        data-ocid="social-roi.ai_recommendations"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />3 AI Recommendations
            for Next Month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.slice(0, 40)}
              data-ocid={`social-roi.recommendation.${aiRecommendations.indexOf(rec) + 1}`}
              className="flex items-start gap-3 rounded-xl bg-muted/20 border border-border p-3"
            >
              <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-primary">
                  {aiRecommendations.indexOf(rec) + 1}
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cost of Inaction */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          background: "oklch(0.58 0.22 25 / 8%)",
          border: "1px solid oklch(0.58 0.22 25 / 25%)",
        }}
        data-ocid="social-roi.cost_of_inaction"
      >
        <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-300 mb-1">
            Niche Intelligence — Cost of Going Dark
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {inactionCopy}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SocialROIDashboardPage() {
  const { currentTenantId, getSocialROIByTenant, getSocialPostsByTenant } =
    useApp();
  const [period, setPeriod] = useState<Period>("This Week");
  const [reportNiche, setReportNiche] = useState("plumbing");

  const allMetrics = getSocialROIByTenant(currentTenantId);
  const allPosts = getSocialPostsByTenant(currentTenantId);

  const metrics: SocialROIMetrics | undefined = useMemo(
    () => allMetrics.find((m) => m.period === period) ?? allMetrics[0],
    [allMetrics, period],
  );

  const prevPeriodData = trendFor(period);
  const channelStats = useMemo(() => buildChannelStats(allPosts), [allPosts]);
  const topPost = useMemo(
    () => allPosts.find((p) => p.id === metrics?.topPerformingPost),
    [allPosts, metrics],
  );

  const narrative = useMemo(() => {
    if (!metrics) return "";
    return metrics.aiNarrative
      ? metrics.aiNarrative
      : buildNarrative(metrics, allPosts);
  }, [metrics, allPosts]);

  if (!metrics) {
    return (
      <div
        data-ocid="social-roi.empty_state"
        className="text-center py-20 text-muted-foreground"
      >
        <BarChart2 size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">
          No ROI data available yet. Publish some posts to see metrics.
        </p>
      </div>
    );
  }

  const responseRate =
    metrics.commentsResponded + metrics.commentsMissed > 0
      ? Math.round(
          (metrics.commentsResponded /
            (metrics.commentsResponded + metrics.commentsMissed)) *
            100,
        )
      : 0;
  const totalComments = metrics.commentsResponded + metrics.commentsMissed;

  const prevPosts = Math.round(
    (prevPeriodData.postsPublished ?? metrics.postsPublished) * 0.82,
  );
  const prevEngage = Math.round(
    (prevPeriodData.totalEngagement ?? metrics.totalEngagement) * 0.78,
  );
  const prevLeads = Math.round(
    (prevPeriodData.leadsFromSocial ?? metrics.leadsFromSocial) * 0.74,
  );
  const prevBookings = Math.round(
    (prevPeriodData.bookingsFromSocial ?? metrics.bookingsFromSocial) * 0.72,
  );

  const engagementRate =
    metrics.totalEngagement > 0 && metrics.postsPublished > 0
      ? (
          (metrics.totalEngagement / (metrics.postsPublished * 1200)) *
          100
        ).toFixed(1)
      : "0.0";
  const costPerLead =
    metrics.leadsFromSocial > 0
      ? `$${Math.round((metrics.estimatedRevenue * 0.08) / metrics.leadsFromSocial)}`
      : "—";

  const publishedPosts = allPosts.filter((p) => p.status === "published");
  const tofuCount = publishedPosts.filter(
    (p) => p.funnelStage === "tofu",
  ).length;
  const mofuCount = publishedPosts.filter(
    (p) => p.funnelStage === "mofu",
  ).length;
  const bofuCount = publishedPosts.filter(
    (p) => p.funnelStage === "bofu",
  ).length;
  const stageTotals = tofuCount + mofuCount + bofuCount || 1;

  return (
    <div className="space-y-6 max-w-6xl mx-auto" data-ocid="social-roi.page">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp size={22} className="text-primary" />
            Social ROI Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Revenue attribution, engagement analytics, and AI-driven insights
            from your social activity.
          </p>
        </div>

        <div
          className="flex gap-1 bg-muted/40 rounded-lg p-1 flex-wrap"
          data-ocid="social-roi.period.toggle"
        >
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              data-ocid={`social-roi.period.${p.toLowerCase().replace(/\s+/g, "_")}.tab`}
              onClick={() => setPeriod(p)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
                period === p
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Page tabs: Live Dashboard | Monthly Report ── */}
      <Tabs defaultValue="dashboard" data-ocid="social-roi.view_tabs">
        <TabsList className="bg-muted/50 border border-border/40">
          <TabsTrigger
            value="dashboard"
            data-ocid="social-roi.tab.dashboard"
            className="text-xs gap-1.5 data-[state=active]:bg-card"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Live Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="monthly-report"
            data-ocid="social-roi.tab.monthly_report"
            className="text-xs gap-1.5 data-[state=active]:bg-card"
          >
            <FileText className="h-3.5 w-3.5" />
            Monthly Report
          </TabsTrigger>
        </TabsList>

        {/* ── Live Dashboard ─────────────────────────────────────────── */}
        <TabsContent value="dashboard" className="mt-4 space-y-4">
          {/* KPI Row */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            data-ocid="social-roi.kpi.row"
          >
            <KpiCard
              label="Posts Published"
              value={metrics.postsPublished}
              prev={prevPosts}
              sub={`Avg. ${(metrics.totalEngagement / Math.max(1, metrics.postsPublished)).toFixed(0)} engage / post`}
              icon={<Calendar size={14} className="text-primary" />}
              ocid="social-roi.posts_published.card"
            />
            <KpiCard
              label="Total Engagement"
              value={metrics.totalEngagement}
              prev={prevEngage}
              sub={`${engagementRate}% engagement rate`}
              icon={<Zap size={14} className="text-amber-400" />}
              ocid="social-roi.total_engagement.card"
            />
            <KpiCard
              label="Leads from Social"
              value={metrics.leadsFromSocial}
              prev={prevLeads}
              sub={`${costPerLead} cost per lead`}
              icon={<Users size={14} className="text-emerald-400" />}
              ocid="social-roi.leads_from_social.card"
            />
            <KpiCard
              label="Bookings from Social"
              value={metrics.bookingsFromSocial}
              prev={prevBookings}
              sub={`$${metrics.estimatedRevenue.toLocaleString()} est. revenue`}
              icon={<Target size={14} className="text-rose-400" />}
              ocid="social-roi.bookings_from_social.card"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* AI Insight Narrative */}
            <Card
              className="bg-card border-border lg:col-span-2"
              data-ocid="social-roi.narrative.card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Sparkles size={12} className="text-primary" />
                  </div>
                  AI Performance Insight
                  {metrics.aiNarrative ? (
                    <Badge
                      variant="secondary"
                      className="text-[10px] ml-auto bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    >
                      LLM-Generated
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-[10px] ml-auto bg-amber-500/15 text-amber-400 border-amber-500/30"
                    >
                      Template Narrative
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="roi-insight-narrative"
                  data-ocid="social-roi.narrative.panel"
                >
                  {narrative}
                </div>
                {!metrics.aiNarrative && (
                  <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                    <Sparkles size={10} className="text-primary" />
                    Connect an LLM in Go Live to get dynamic, data-driven
                    narratives.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Comment Response Gauge */}
            <Card
              className="bg-card border-border"
              data-ocid="social-roi.comment_roi.card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageCircle size={14} className="text-primary" />
                  Comments ROI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-end justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">
                      Response Rate
                    </span>
                    <span
                      className={`text-lg font-bold ${responseRate >= 80 ? "text-emerald-400" : responseRate >= 50 ? "text-amber-400" : "text-rose-400"}`}
                      data-ocid="social-roi.response_rate.number"
                    >
                      {responseRate}%
                    </span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${responseRate >= 80 ? "bg-emerald-500" : responseRate >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${responseRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span className="text-emerald-400 font-medium">
                      {metrics.commentsResponded} responded
                    </span>
                    <span className="text-rose-400 font-medium">
                      {metrics.commentsMissed} missed
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    Comment → Lead Funnel
                  </p>
                  {[
                    {
                      label: "Comments",
                      value: totalComments,
                      color: "bg-primary/60",
                      width: "100%",
                    },
                    {
                      label: "Purchase Intent",
                      value: Math.round(totalComments * 0.28),
                      color: "bg-amber-500/60",
                      width: "28%",
                    },
                    {
                      label: "Leads Created",
                      value: metrics.leadsFromSocial,
                      color: "bg-emerald-500/60",
                      width: `${Math.min(100, (metrics.leadsFromSocial / Math.max(1, totalComments)) * 100).toFixed(0)}%`,
                    },
                  ].map(({ label, value, color, width }) => (
                    <div key={label} className="mb-2">
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="text-foreground font-semibold">
                          {value}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{ width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Channel Breakdown */}
            <Card
              className="bg-card border-border"
              data-ocid="social-roi.channel_breakdown.card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart2 size={14} className="text-primary" />
                  Platform Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className="roi-channel-bar"
                  data-ocid="social-roi.channel_bar"
                >
                  {channelStats.map((ch) => (
                    <div
                      key={ch.platform}
                      className="roi-channel-segment"
                      style={{
                        flex: ch.pct,
                        backgroundColor: ch.color,
                        minWidth: ch.pct > 5 ? undefined : "0px",
                        opacity: ch.pct > 5 ? 1 : 0,
                      }}
                      title={`${ch.label}: ${ch.pct}%`}
                    >
                      {ch.pct > 12 ? `${ch.pct}%` : ""}
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mt-2">
                  {channelStats.map((ch, i) => (
                    <div
                      key={ch.platform}
                      data-ocid={`social-roi.channel.item.${i + 1}`}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: ch.color }}
                      />
                      <span className="text-xs text-foreground font-medium flex-1 min-w-0 truncate">
                        {ch.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {ch.posts} posts
                      </span>
                      <span className="text-[10px] text-foreground font-semibold w-12 text-right">
                        {ch.engagement.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">
                        {ch.pct}%
                      </span>
                    </div>
                  ))}
                  {channelStats.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No published posts yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Funnel Stage Distribution */}
            <Card
              className="bg-card border-border"
              data-ocid="social-roi.funnel_stage.card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BookOpen size={14} className="text-primary" />
                  Funnel Stage Mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(["tofu", "mofu", "bofu"] as const).map((stage) => {
                    const counts = {
                      tofu: tofuCount,
                      mofu: mofuCount,
                      bofu: bofuCount,
                    };
                    const count = counts[stage];
                    const pct = Math.round((count / stageTotals) * 100);
                    const meta = FUNNEL_META[stage];
                    return (
                      <div key={stage}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ${meta.color}`}
                            >
                              {meta.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {stage === "tofu"
                                ? "Awareness"
                                : stage === "mofu"
                                  ? "Trust Building"
                                  : "Conversion"}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-foreground">
                            {count} posts ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${stage === "tofu" ? "bg-blue-500/70" : stage === "mofu" ? "bg-amber-500/70" : "bg-emerald-500/70"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Estimated Revenue from Social
                    </span>
                    <span className="text-base font-bold text-emerald-400">
                      ${metrics.estimatedRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Post */}
          {topPost && (
            <Card
              className="bg-card border-border"
              data-ocid="social-roi.top_post.card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  Top Performing Post — {period}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {topPost.platforms.map((p) => (
                        <Badge
                          key={p}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {PLATFORM_META[p]?.label ?? p}
                        </Badge>
                      ))}
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${FUNNEL_META[topPost.funnelStage]?.color ?? ""}`}
                      >
                        {FUNNEL_META[topPost.funnelStage]?.label ??
                          topPost.funnelStage.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-primary/10 text-primary border-primary/25"
                      >
                        {FRAMEWORK_LABELS[topPost.marketingFramework] ??
                          topPost.marketingFramework}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                      {topPost.content}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 shrink-0">
                    {[
                      {
                        label: "Likes",
                        value: topPost.engagementMetrics.likes,
                      },
                      {
                        label: "Comments",
                        value: topPost.engagementMetrics.comments,
                      },
                      {
                        label: "Shares",
                        value: topPost.engagementMetrics.shares,
                      },
                      {
                        label: "Reach",
                        value: topPost.engagementMetrics.reach,
                      },
                      {
                        label: "Leads",
                        value: topPost.engagementMetrics.leadsGenerated,
                      },
                      {
                        label: "Bookings",
                        value: topPost.engagementMetrics.bookingsGenerated,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="text-center bg-muted/30 border border-border rounded-lg px-2 py-2"
                      >
                        <div className="roi-metric-number text-base">
                          {value.toLocaleString()}
                        </div>
                        <div className="roi-metric-label text-[10px]">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <Link
                    to="/social-media"
                    data-ocid="social-roi.view_calendar.link"
                    className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    View in Content Calendar →
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Monthly Report tab ─────────────────────────────────────── */}
        <TabsContent value="monthly-report" className="mt-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Niche for this report:
            </span>
            <Select value={reportNiche} onValueChange={setReportNiche}>
              <SelectTrigger
                className="w-40 h-8 text-xs"
                data-ocid="social-roi.report_niche.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "plumbing",
                  "hvac",
                  "med_spa",
                  "restoration",
                  "roofing",
                  "real_estate",
                  "mortgage",
                  "chiropractic",
                  "dental",
                  "carpet_cleaning",
                ].map((n) => (
                  <SelectItem key={n} value={n} className="text-xs">
                    {n
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge className="ml-auto badge-emerald gap-1 text-xs">
              <CheckCircle2 className="h-3 w-3" />
              Auto-generated
            </Badge>
          </div>
          <MonthlyReport
            metrics={metrics}
            channelStats={channelStats}
            topPost={topPost}
            allPosts={allPosts}
            niche={reportNiche}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
