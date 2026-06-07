import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Hash,
  Lightbulb,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { useDemoFlow } from "../hooks/useDemoFlow";
import { useSocialMedia } from "../hooks/useSocialMedia";
import type { CompetitorProfile, NicheType } from "../types/socialMedia";

// ─── Refresh progress steps ──────────────────────────────────────────────────

const REFRESH_STEPS = [
  { label: "Scanning competitors…", icon: Search },
  { label: "Analyzing engagement…", icon: BarChart3 },
  { label: "Checking rankings…", icon: TrendingUp },
  { label: "Sourcing trending topics…", icon: Hash },
  { label: "Generating insights…", icon: Sparkles },
];

// ─── Niche-scoped demo data ───────────────────────────────────────────────────

type NicheContentData = {
  competitors: CompetitorProfile[];
  weeklyDigest: {
    topThemes: string[];
    winningThemes: string[];
    topHashtags: { tag: string; volume: string }[];
    actionableOpportunities: string[];
    summary: string;
  };
  contentThemes: {
    theme: string;
    clientPct: number;
    competitorPct: number;
    icon: React.ElementType;
    color: string;
  }[];
  opportunities: {
    id: string;
    title: string;
    evidence: string;
    impact: string;
    theme: string;
    icon: React.ElementType;
    color: string;
    badgeClass: string;
  }[];
  trendingTopics: { keyword: string; volume: number; trend: string }[];
};

const NICHE_CONTENT: Record<string, NicheContentData> = {
  roofing: {
    competitors: [
      {
        name: "SkyLine Roofing Co.",
        website: "skylineroofers.com",
        platforms: ["facebook", "instagram", "google_business"],
        averageEngagement: 312,
        rankingPosition: 2,
        recentPosts: [
          {
            platform: "facebook",
            content:
              "Storm damage? We're on it in 2 hours — before/after thread 🏠",
            estimatedEngagement: 487,
            postedAt: Date.now() - 86400000,
            format: "image",
          },
        ],
        strengths: [
          "Storm emergency posts",
          "Before/after photos",
          "Active on 3 platforms",
        ],
        gaps: [
          "No educational video content",
          "No LinkedIn",
          "No seasonal prep campaigns",
        ],
      },
      {
        name: "Apex Roof Specialists",
        website: "apexroofspecialists.com",
        platforms: ["facebook"],
        averageEngagement: 148,
        rankingPosition: 3,
        recentPosts: [],
        strengths: ["Google Ads active", "High review volume"],
        gaps: [
          "No Instagram",
          "Generic post copy",
          "No video content",
          "No CTAs",
        ],
      },
      {
        name: "ProShield Roofing",
        website: "proshieldroofing.com",
        platforms: ["facebook", "google_business"],
        averageEngagement: 97,
        rankingPosition: 4,
        recentPosts: [],
        strengths: ["Active Google Business Profile", "Consistent posting"],
        gaps: ["No social media strategy", "Posts 1× per week", "No Instagram"],
      },
      {
        name: "Storm Guard Roofing",
        website: "stormguardroofsd.com",
        platforms: ["facebook"],
        averageEngagement: 54,
        rankingPosition: 5,
        recentPosts: [],
        strengths: ["Emergency service posts"],
        gaps: [
          "Low engagement",
          "No video",
          "No before/after content",
          "No Instagram",
        ],
      },
    ],
    weeklyDigest: {
      topThemes: [
        "Storm damage before/after",
        "Emergency response time",
        "5-star review showcases",
      ],
      winningThemes: [
        "Seasonal hail/storm prep posts (0 competitors running these — huge gap)",
        "Video roof walkthroughs get 3× more organic reach vs. static images",
        "LinkedIn targeting insurance adjusters and property managers — untapped",
      ],
      topHashtags: [
        { tag: "#roofing", volume: "High" },
        { tag: "#roofer", volume: "High" },
        { tag: "#stormrepair", volume: "Medium" },
        { tag: "#sandiegoroofer", volume: "Medium" },
        { tag: "#roofrepair", volume: "High" },
        { tag: "#hailseasondamage", volume: "Medium" },
        { tag: "#roofinstall", volume: "Low" },
      ],
      actionableOpportunities: [
        "Post a 60-second 'what to check after a storm' video — no competitor is doing educational roofing video content",
        "Start a weekly 'Roof Rescue Monday' post showing before/after repairs with homeowner quotes",
        "Launch a LinkedIn presence targeting property managers and insurance adjusters — zero competition locally",
      ],
      summary:
        "This week your top 4 roofing competitors focused on storm damage before/afters and review sharing. Video content and LinkedIn represent the biggest untapped gaps — first mover advantage is available in both. Seasonal storm prep campaigns are completely missing and typically drive 40–60% higher engagement.",
    },
    contentThemes: [
      {
        theme: "Educational",
        clientPct: 24,
        competitorPct: 7,
        icon: BookOpen,
        color: "bg-primary",
      },
      {
        theme: "Promotional",
        clientPct: 32,
        competitorPct: 54,
        icon: Zap,
        color: "bg-amber-500",
      },
      {
        theme: "Testimonials",
        clientPct: 20,
        competitorPct: 26,
        icon: Users,
        color: "bg-emerald-500",
      },
      {
        theme: "Behind-the-Scenes",
        clientPct: 14,
        competitorPct: 5,
        icon: Eye,
        color: "bg-rose-500",
      },
      {
        theme: "Video Content",
        clientPct: 6,
        competitorPct: 2,
        icon: Video,
        color: "bg-blue-500",
      },
      {
        theme: "Local Community",
        clientPct: 4,
        competitorPct: 6,
        icon: Target,
        color: "bg-purple-500",
      },
    ],
    opportunities: [
      {
        id: "opp-1",
        title: "No competitor posts roofing video content",
        evidence:
          "Top 4 competitors post 0–1 videos/week. Roof walkthrough videos get 3× more reach.",
        impact: "High",
        theme: "video",
        icon: Video,
        color: "border-l-primary",
        badgeClass: "badge-purple",
      },
      {
        id: "opp-2",
        title: "LinkedIn untapped for roofing locally",
        evidence:
          "0 of 4 competitors have an active LinkedIn presence — property managers and adjusters are there.",
        impact: "High",
        theme: "linkedin",
        icon: Users,
        color: "border-l-emerald-400",
        badgeClass: "badge-emerald",
      },
      {
        id: "opp-3",
        title: "No competitor runs storm prep campaigns",
        evidence:
          "Hail season / freeze warning posts drive 40–60% higher engagement — none are posting them.",
        impact: "High",
        theme: "seasonal",
        icon: Lightbulb,
        color: "border-l-amber-400",
        badgeClass: "badge-amber",
      },
      {
        id: "opp-4",
        title: "Educational roofing content gap",
        evidence:
          "Competitors average only 7% educational posts. Homeowners want 'what to check' guides.",
        impact: "Medium",
        theme: "educational",
        icon: BookOpen,
        color: "border-l-blue-400",
        badgeClass: "badge-blue",
      },
      {
        id: "opp-5",
        title: "Behind-the-scenes job site content underused",
        evidence:
          "Only 5% of competitor posts show real crew/job content — builds trust 2× faster.",
        impact: "Medium",
        theme: "behind-scenes",
        icon: Eye,
        color: "border-l-rose-400",
        badgeClass: "badge-rose",
      },
    ],
    trendingTopics: [
      { keyword: "roof replacement San Diego", volume: 94, trend: "up" },
      { keyword: "storm damage roof repair", volume: 91, trend: "up" },
      { keyword: "hail damage roofing claim", volume: 86, trend: "up" },
      { keyword: "roofing company near me", volume: 82, trend: "stable" },
      { keyword: "emergency roof repair", volume: 78, trend: "up" },
      { keyword: "roof inspection cost 2025", volume: 71, trend: "up" },
      { keyword: "flat roof repair contractor", volume: 64, trend: "stable" },
      { keyword: "metal roofing installation", volume: 59, trend: "up" },
      { keyword: "roof leak repair near me", volume: 55, trend: "stable" },
      { keyword: "residential roofer estimate", volume: 50, trend: "down" },
      { keyword: "roof replacement cost calculator", volume: 46, trend: "up" },
      { keyword: "best roofer San Diego", volume: 41, trend: "stable" },
    ],
  },
  hvac: {
    competitors: [
      {
        name: "Arctic Air HVAC",
        website: "arcticairhvac.com",
        platforms: ["facebook", "instagram"],
        averageEngagement: 204,
        rankingPosition: 2,
        recentPosts: [
          {
            platform: "facebook",
            content: "AC tune-up special before summer hits — book this week 🌡️",
            estimatedEngagement: 318,
            postedAt: Date.now() - 86400000,
            format: "image",
          },
        ],
        strengths: [
          "Seasonal urgency posts",
          "Consistent Facebook presence",
          "Before/after photos",
        ],
        gaps: ["No video content", "No LinkedIn", "No educational posts"],
      },
      {
        name: "ComfortPro HVAC",
        website: "comfortprohvac.com",
        platforms: ["facebook"],
        averageEngagement: 88,
        rankingPosition: 3,
        recentPosts: [],
        strengths: ["Active Google Business", "High review count"],
        gaps: ["No Instagram", "No video", "Generic copy", "No CTAs"],
      },
      {
        name: "Premier Air Solutions",
        website: "premierairsolutions.com",
        platforms: ["facebook", "google_business"],
        averageEngagement: 121,
        rankingPosition: 4,
        recentPosts: [],
        strengths: ["GBP updated regularly", "Responds to reviews"],
        gaps: ["No social media strategy", "Posts 1×/week", "No Instagram"],
      },
    ],
    weeklyDigest: {
      topThemes: [
        "Seasonal tune-up offers",
        "Energy savings tips",
        "5-star review showcases",
      ],
      winningThemes: [
        "Indoor air quality content (0 competitors covering it — huge gap)",
        "Video system walkthroughs get 3× more reach than static images",
        "LinkedIn targeting property managers and commercial building owners — untapped",
      ],
      topHashtags: [
        { tag: "#hvac", volume: "High" },
        { tag: "#airconditioning", volume: "High" },
        { tag: "#hvacrepair", volume: "Medium" },
        { tag: "#furnacerepair", volume: "Medium" },
        { tag: "#airquality", volume: "High" },
        { tag: "#hvactechnician", volume: "Medium" },
        { tag: "#acinstall", volume: "Low" },
      ],
      actionableOpportunities: [
        "Post a 60-second 'signs your AC needs service before summer' video — no competitor is doing this",
        "Start a 'Filter Friday' weekly post showing dirty vs. clean filters with energy cost comparisons",
        "Launch a LinkedIn presence targeting commercial property managers — zero competition locally",
      ],
      summary:
        "This week HVAC competitors focused on seasonal tune-up promotions and review sharing. Indoor air quality content and LinkedIn are completely untapped. Video content showing real system installs and before/afters gets 3× more reach than anything competitors are currently posting.",
    },
    contentThemes: [
      {
        theme: "Educational",
        clientPct: 20,
        competitorPct: 6,
        icon: BookOpen,
        color: "bg-primary",
      },
      {
        theme: "Promotional",
        clientPct: 38,
        competitorPct: 56,
        icon: Zap,
        color: "bg-amber-500",
      },
      {
        theme: "Testimonials",
        clientPct: 17,
        competitorPct: 25,
        icon: Users,
        color: "bg-emerald-500",
      },
      {
        theme: "Behind-the-Scenes",
        clientPct: 13,
        competitorPct: 5,
        icon: Eye,
        color: "bg-rose-500",
      },
      {
        theme: "Video Content",
        clientPct: 7,
        competitorPct: 3,
        icon: Video,
        color: "bg-blue-500",
      },
      {
        theme: "Local Community",
        clientPct: 5,
        competitorPct: 5,
        icon: Target,
        color: "bg-purple-500",
      },
    ],
    opportunities: [
      {
        id: "opp-1",
        title: "No competitor posts HVAC video content",
        evidence:
          "Competitors post 0–1 videos/week. System install walkthroughs get 3× more reach.",
        impact: "High",
        theme: "video",
        icon: Video,
        color: "border-l-primary",
        badgeClass: "badge-purple",
      },
      {
        id: "opp-2",
        title: "Indoor air quality content completely untapped",
        evidence:
          "0 of 3 competitors post air quality educational content — high search interest.",
        impact: "High",
        theme: "air-quality",
        icon: Lightbulb,
        color: "border-l-amber-400",
        badgeClass: "badge-amber",
      },
      {
        id: "opp-3",
        title: "LinkedIn untapped for HVAC commercial leads",
        evidence:
          "0 competitors have a LinkedIn presence — property managers and building owners are there.",
        impact: "High",
        theme: "linkedin",
        icon: Users,
        color: "border-l-emerald-400",
        badgeClass: "badge-emerald",
      },
      {
        id: "opp-4",
        title: "Educational content gap in HVAC niche",
        evidence:
          "Competitors average only 6% educational posts. Homeowners want 'how to save on energy bills' guides.",
        impact: "Medium",
        theme: "educational",
        icon: BookOpen,
        color: "border-l-blue-400",
        badgeClass: "badge-blue",
      },
      {
        id: "opp-5",
        title: "Behind-the-scenes job content underused",
        evidence:
          "Only 5% of competitor posts show real installs — builds trust 2× faster.",
        impact: "Medium",
        theme: "behind-scenes",
        icon: Eye,
        color: "border-l-rose-400",
        badgeClass: "badge-rose",
      },
    ],
    trendingTopics: [
      { keyword: "AC repair near me", volume: 93, trend: "up" },
      { keyword: "furnace replacement cost", volume: 87, trend: "up" },
      { keyword: "HVAC tune up special", volume: 83, trend: "up" },
      { keyword: "air conditioner not cooling", volume: 79, trend: "stable" },
      { keyword: "mini split installation", volume: 75, trend: "up" },
      { keyword: "HVAC maintenance contract", volume: 68, trend: "up" },
      { keyword: "heat pump vs furnace 2025", volume: 62, trend: "stable" },
      { keyword: "emergency AC repair", volume: 58, trend: "up" },
      { keyword: "indoor air quality testing", volume: 53, trend: "up" },
      { keyword: "smart thermostat install", volume: 47, trend: "down" },
      { keyword: "duct cleaning San Diego", volume: 43, trend: "stable" },
      { keyword: "commercial HVAC service", volume: 38, trend: "stable" },
    ],
  },
  med_spa: {
    competitors: [
      {
        name: "Glow Aesthetics Studio",
        website: "glowaesthetics.com",
        platforms: ["instagram", "facebook", "google_business"],
        averageEngagement: 386,
        rankingPosition: 2,
        recentPosts: [
          {
            platform: "instagram",
            content: "Botox before/after — 3 weeks post-treatment results ✨",
            estimatedEngagement: 612,
            postedAt: Date.now() - 86400000,
            format: "image",
          },
        ],
        strengths: [
          "Strong Instagram presence",
          "Before/after photo content",
          "Active on 3 platforms",
        ],
        gaps: ["No educational Reels", "No LinkedIn", "No seasonal promotions"],
      },
      {
        name: "Luxe Skin Clinic",
        website: "luxeskinclinic.com",
        platforms: ["instagram", "facebook"],
        averageEngagement: 214,
        rankingPosition: 3,
        recentPosts: [],
        strengths: ["High review velocity", "Promotional post cadence"],
        gaps: ["No video content", "Generic captions", "No TikTok presence"],
      },
      {
        name: "Pure Radiance MedSpa",
        website: "pureradiancemedspa.com",
        platforms: ["instagram"],
        averageEngagement: 97,
        rankingPosition: 4,
        recentPosts: [],
        strengths: ["Clean Instagram aesthetic"],
        gaps: ["No Facebook", "No CTAs", "Inconsistent posting (1–2×/mo)"],
      },
    ],
    weeklyDigest: {
      topThemes: [
        "Before/after treatment photos",
        "Seasonal promotions",
        "5-star review highlights",
      ],
      winningThemes: [
        "Educational Reels explaining treatments (0 competitors doing this — huge gap)",
        "TikTok completely untapped — first mover gets massive organic reach",
        "Client transformation stories drive 4× higher engagement than promos",
      ],
      topHashtags: [
        { tag: "#medspa", volume: "High" },
        { tag: "#botox", volume: "High" },
        { tag: "#aesthetics", volume: "Medium" },
        { tag: "#skincare", volume: "High" },
        { tag: "#fillers", volume: "Medium" },
        { tag: "#austinmedspa", volume: "Medium" },
        { tag: "#glowup", volume: "Low" },
      ],
      actionableOpportunities: [
        "Post a 60-second 'what to expect from your first Botox appointment' Reel — no competitor is doing educational video",
        "Start a 'Transformation Tuesday' series showing real client journeys with consent — builds trust and goes viral",
        "Launch TikTok targeting 25–45 year olds — zero local competition on the platform",
      ],
      summary:
        "This week med spa competitors focused on before/after photos and seasonal promotions. Educational Reels and TikTok are completely untapped. Client transformation stories with real narratives get 4× the engagement of promotional posts, and no competitor is doing them consistently.",
    },
    contentThemes: [
      {
        theme: "Educational",
        clientPct: 18,
        competitorPct: 4,
        icon: BookOpen,
        color: "bg-primary",
      },
      {
        theme: "Promotional",
        clientPct: 30,
        competitorPct: 58,
        icon: Zap,
        color: "bg-amber-500",
      },
      {
        theme: "Transformations",
        clientPct: 25,
        competitorPct: 30,
        icon: Users,
        color: "bg-emerald-500",
      },
      {
        theme: "Behind-the-Scenes",
        clientPct: 15,
        competitorPct: 4,
        icon: Eye,
        color: "bg-rose-500",
      },
      {
        theme: "Video Content",
        clientPct: 9,
        competitorPct: 2,
        icon: Video,
        color: "bg-blue-500",
      },
      {
        theme: "Local Community",
        clientPct: 3,
        competitorPct: 2,
        icon: Target,
        color: "bg-purple-500",
      },
    ],
    opportunities: [
      {
        id: "opp-1",
        title: "Educational treatment Reels completely absent",
        evidence:
          "0 competitors post educational video content. 'What to expect' Reels get 5× more saves.",
        impact: "High",
        theme: "video",
        icon: Video,
        color: "border-l-primary",
        badgeClass: "badge-purple",
      },
      {
        id: "opp-2",
        title: "TikTok first-mover advantage available",
        evidence:
          "0 local med spa competitors are on TikTok — organic reach is massive for aesthetics content.",
        impact: "High",
        theme: "tiktok",
        icon: Zap,
        color: "border-l-amber-400",
        badgeClass: "badge-amber",
      },
      {
        id: "opp-3",
        title: "Client transformation stories underused",
        evidence:
          "Transformation narratives with real stories drive 4× engagement vs. promotional posts.",
        impact: "High",
        theme: "transformation",
        icon: Users,
        color: "border-l-emerald-400",
        badgeClass: "badge-emerald",
      },
      {
        id: "opp-4",
        title: "Educational skincare content gap",
        evidence:
          "Only 4% of competitor posts are educational. Clients want 'how it works' treatment guides.",
        impact: "Medium",
        theme: "educational",
        icon: BookOpen,
        color: "border-l-blue-400",
        badgeClass: "badge-blue",
      },
      {
        id: "opp-5",
        title: "Behind-the-scenes clinic content underused",
        evidence:
          "Only 4% of competitor posts show real clinic/team content — builds trust faster than promos.",
        impact: "Medium",
        theme: "behind-scenes",
        icon: Eye,
        color: "border-l-rose-400",
        badgeClass: "badge-rose",
      },
    ],
    trendingTopics: [
      { keyword: "Botox near me Austin", volume: 95, trend: "up" },
      { keyword: "lip filler cost 2025", volume: 90, trend: "up" },
      { keyword: "best med spa Austin", volume: 85, trend: "up" },
      { keyword: "laser hair removal near me", volume: 80, trend: "stable" },
      { keyword: "hydrafacial benefits", volume: 74, trend: "up" },
      { keyword: "dermal fillers vs Botox", volume: 69, trend: "up" },
      { keyword: "med spa membership worth it", volume: 63, trend: "stable" },
      { keyword: "microneedling results", volume: 57, trend: "up" },
      { keyword: "coolsculpting near me", volume: 52, trend: "stable" },
      { keyword: "Kybella double chin", volume: 46, trend: "down" },
      { keyword: "PRP facial near me", volume: 42, trend: "up" },
      {
        keyword: "med spa first time what to expect",
        volume: 37,
        trend: "stable",
      },
    ],
  },
};

// Default fallback for any niche without a specific data set
const DEFAULT_NICHE_DATA = NICHE_CONTENT.roofing;

// ─── Sub-components ──────────────────────────────────────────────────────────

function RefreshProgressOverlay({ step }: { step: number }) {
  const current = REFRESH_STEPS[Math.min(step, REFRESH_STEPS.length - 1)];
  const pct = Math.round(((step + 1) / REFRESH_STEPS.length) * 100);
  const Icon = current.icon;

  return (
    <div
      data-ocid="competitor_intelligence.loading_state"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm mx-4 p-6 rounded-xl bg-card border border-border shadow-2xl animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center animate-pulse-glow">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {current.label}
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by Perplexity AI
            </p>
          </div>
        </div>
        <Progress value={pct} className="h-1.5 mb-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {step + 1} of {REFRESH_STEPS.length}
          </span>
          <span>{pct}%</span>
        </div>
        <ul className="mt-4 space-y-1">
          {REFRESH_STEPS.map((s, i) => (
            <li
              key={s.label}
              className={`text-xs flex items-center gap-2 ${i < step ? "text-emerald-400" : i === step ? "text-primary font-medium" : "text-muted-foreground/50"}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${i < step ? "bg-emerald-400" : i === step ? "bg-primary animate-pulse" : "bg-muted"}`}
              />
              {s.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CompetitorCard({
  comp,
  index,
  expanded,
  onToggle,
}: {
  comp: CompetitorProfile;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const platformColors: Record<string, string> = {
    facebook: "platform-facebook",
    instagram: "platform-instagram",
    google_business: "platform-google",
    linkedin: "badge-blue",
    tiktok: "badge-amber",
  };

  const engagementColor =
    comp.averageEngagement >= 200
      ? "text-emerald-400"
      : comp.averageEngagement >= 100
        ? "text-amber-400"
        : "text-rose-400";

  return (
    <div
      data-ocid={`competitor_intelligence.competitor.${index}`}
      className="competitor-card rounded-lg competitor-stable animate-fade-in-up"
      style={{ animationDelay: `${(index - 1) * 0.08}s` }}
    >
      <button
        type="button"
        className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-muted/20 transition-smooth rounded-t-lg"
        onClick={onToggle}
        aria-expanded={expanded}
        data-ocid={`competitor_intelligence.competitor_toggle.${index}`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-muted/40 border border-border flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
            #{comp.rankingPosition}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">
              {comp.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {comp.website}
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {comp.platforms.map((p) => (
                <span
                  key={p}
                  className={`social-platform-badge ${platformColors[p] ?? "badge-purple"}`}
                >
                  {p.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className={`text-sm font-bold ${engagementColor}`}>
            {comp.averageEngagement}
          </span>
          <span className="text-xs text-muted-foreground">avg eng.</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground mt-1" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mt-1" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/50 pt-3 animate-fade-in">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" /> Strengths
            </p>
            <ul className="space-y-1.5">
              {comp.strengths.map((s) => (
                <li key={s} className="text-xs text-emerald-400 flex gap-1.5">
                  <span className="shrink-0 mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-amber-400" /> Gaps (your
              opportunity)
            </p>
            <ul className="space-y-1.5">
              {comp.gaps.map((g) => (
                <li key={g} className="text-xs text-amber-400 flex gap-1.5">
                  <span className="shrink-0 mt-0.5">→</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          {comp.recentPosts.length > 0 && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Recent high-engagement post
              </p>
              <div className="bg-muted/30 rounded-md p-3 text-xs text-foreground border border-border/50">
                <p className="mb-1">{comp.recentPosts[0].content}</p>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span
                    className={`social-platform-badge ${platformColors[comp.recentPosts[0].platform] ?? "badge-purple"}`}
                  >
                    {comp.recentPosts[0].platform}
                  </span>
                  <span>
                    ~{comp.recentPosts[0].estimatedEngagement} engagements
                  </span>
                  <span className="capitalize">
                    {comp.recentPosts[0].format}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CompetitorIntelligencePage() {
  const {
    competitorReport,
    getCompetitorIntelReport,
    refreshCompetitorIntel,
    isLoadingCompetitor,
  } = useSocialMedia();
  const { sessionData } = useDemoFlow();

  // Derive the niche from demo session — fall back to roofing
  const demoNicheRaw = sessionData.niche || "Roofing";
  const selectedNiche = demoNicheRaw
    .toLowerCase()
    .replace(/\s+/g, "_") as NicheType;
  const nicheLabel =
    demoNicheRaw.charAt(0).toUpperCase() +
    demoNicheRaw.slice(1).replace(/_/g, " ");

  // All content is scoped strictly to the selected niche — no cross-niche data shown
  const nicheData = NICHE_CONTENT[selectedNiche] ?? DEFAULT_NICHE_DATA;
  const RICH_COMPETITOR_PROFILES = nicheData.competitors;
  const WEEKLY_DIGEST = nicheData.weeklyDigest;
  const CONTENT_THEME_DATA = nicheData.contentThemes;
  const OUTPERFORMANCE_OPPORTUNITIES = nicheData.opportunities;
  const TRENDING_TOPICS = nicheData.trendingTopics;

  const [refreshStep, setRefreshStep] = useState(-1);
  const [expandedCompetitor, setExpandedCompetitor] = useState<number | null>(
    1,
  );
  const [lastUpdated, setLastUpdated] = useState<number | null>(
    competitorReport?.generatedAt ?? null,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only call
  useEffect(() => {
    void getCompetitorIntelReport("tenant-1");
  }, []);

  const handleRefresh = async () => {
    setRefreshStep(0);
    for (let i = 1; i < REFRESH_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 900));
      setRefreshStep(i);
    }
    await new Promise((r) => setTimeout(r, 700));
    await refreshCompetitorIntel("tenant-1", selectedNiche, "San Diego, CA");
    setRefreshStep(-1);
    setLastUpdated(Date.now());
  };

  const isRefreshing = refreshStep >= 0 || isLoadingCompetitor;

  const toggleCompetitor = (idx: number) =>
    setExpandedCompetitor((prev) => (prev === idx ? null : idx));

  return (
    <div
      data-ocid="competitor_intelligence.page"
      className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto"
    >
      {isRefreshing && refreshStep >= 0 && (
        <RefreshProgressOverlay step={refreshStep} />
      )}

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground gradient-text-purple">
              Competitor Intelligence
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Perplexity-powered real-time competitive analysis
            {lastUpdated && (
              <span className="ml-2 text-xs">
                · Last updated{" "}
                {new Date(lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/15 border border-primary/30 text-primary">
            {nicheLabel}
          </span>
          <Button
            size="sm"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
            className="gap-1.5"
            data-ocid="competitor_intelligence.refresh_button"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Scanning…" : "Refresh Intel"}
          </Button>
        </div>
      </div>

      {/* ── Loading skeleton ─────────────────────────────────────────────── */}
      {isLoadingCompetitor && !isRefreshing && (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-52" />
            <Skeleton className="h-52" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {!isLoadingCompetitor && !competitorReport && (
        <div
          data-ocid="competitor_intelligence.empty_state"
          className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/10"
        >
          <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Target className="h-7 w-7 text-primary/60" />
          </div>
          <p className="font-semibold text-foreground text-lg mb-1">
            No intel report yet
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-5">
            Click Refresh Intel to generate a live competitive analysis powered
            by Perplexity AI.
          </p>
          <Button
            onClick={() => void handleRefresh()}
            className="gap-2"
            data-ocid="competitor_intelligence.empty_refresh_button"
          >
            <Sparkles className="h-4 w-4" />
            Generate First Report
          </Button>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      {!isLoadingCompetitor && competitorReport && (
        <div className="space-y-6">
          {/* Strategic Summary */}
          <Card
            className="relative bg-card border-border competitor-intel-panel overflow-hidden"
            data-ocid="competitor_intelligence.summary_panel"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none rounded-xl" />
            <CardHeader className="pb-3 relative">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Strategic Summary
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-xs font-medium capitalize"
                  >
                    {competitorReport.niche.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {competitorReport.location}
                  </Badge>
                  <span className="weekly-digest-badge">
                    Perplexity-sourced
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-foreground leading-relaxed">
                {competitorReport.aiStrategicSummary}
              </p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed border-t border-border/50 pt-3">
                {WEEKLY_DIGEST.summary}
              </p>
            </CardContent>
          </Card>

          {/* Competitor cards + Trending topics (side by side on desktop) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Competitor profiles — takes 2 cols */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Competitor Profiles
                  <Badge variant="secondary" className="text-xs">
                    {RICH_COMPETITOR_PROFILES.length}
                  </Badge>
                </h2>
                <span className="text-xs text-muted-foreground">
                  Tap to expand
                </span>
              </div>
              {RICH_COMPETITOR_PROFILES.map((comp, i) => (
                <CompetitorCard
                  key={comp.name}
                  comp={comp}
                  index={i + 1}
                  expanded={expandedCompetitor === i + 1}
                  onToggle={() => toggleCompetitor(i + 1)}
                />
              ))}
            </div>

            {/* Trending topics */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                Trending Topics This Week
              </h2>
              <Card
                className="bg-card border-border"
                data-ocid="competitor_intelligence.trending_panel"
              >
                <CardContent className="pt-4 pb-3 space-y-2">
                  {TRENDING_TOPICS.map((t, i) => (
                    <div
                      key={t.keyword}
                      data-ocid={`competitor_intelligence.trending_topic.${i + 1}`}
                      className="flex items-center gap-2 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground truncate">
                          {t.keyword}
                        </p>
                        <div className="mt-0.5 h-1 rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${t.volume}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-muted-foreground w-6 text-right">
                          {t.volume}
                        </span>
                        <span
                          className={`text-xs ${t.trend === "up" ? "text-emerald-400" : t.trend === "down" ? "text-rose-400" : "text-muted-foreground"}`}
                        >
                          {t.trend === "up"
                            ? "↑"
                            : t.trend === "down"
                              ? "↓"
                              : "→"}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content theme analysis */}
          <Card
            className="bg-card border-border"
            data-ocid="competitor_intelligence.content_themes_panel"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Content Theme Analysis
              </CardTitle>
              <CardDescription>
                Your content mix vs. competitor average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CONTENT_THEME_DATA.map((t, i) => {
                  const Icon = t.icon;
                  const clientAhead = t.clientPct > t.competitorPct;
                  return (
                    <div
                      key={t.theme}
                      data-ocid={`competitor_intelligence.theme.${i + 1}`}
                      className="p-3 rounded-lg bg-muted/20 border border-border/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">
                            {t.theme}
                          </span>
                        </div>
                        <Badge
                          variant={clientAhead ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {clientAhead ? "You lead" : "Gap"}
                        </Badge>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-primary w-14 shrink-0">
                            You
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${t.color} transition-all`}
                              style={{ width: `${t.clientPct}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-foreground w-8 text-right">
                            {t.clientPct}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-14 shrink-0">
                            Competitors
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-muted-foreground/40 transition-all"
                              style={{ width: `${t.competitorPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {t.competitorPct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly digest */}
          <Card
            className="bg-card border-border"
            data-ocid="competitor_intelligence.weekly_digest_panel"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Weekly Digest
                </CardTitle>
                <span className="weekly-digest-badge">This week's intel</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Top themes in market
                  </p>
                  <ul className="space-y-1.5">
                    {WEEKLY_DIGEST.topThemes.map((t) => (
                      <li
                        key={t}
                        className="text-sm text-foreground flex gap-1.5"
                      >
                        <span className="text-muted-foreground shrink-0 mt-0.5">
                          •
                        </span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    What's winning (you can steal this)
                  </p>
                  <ul className="space-y-1.5">
                    {WEEKLY_DIGEST.winningThemes.map((t) => (
                      <li
                        key={t}
                        className="text-sm text-emerald-400 flex gap-1.5"
                      >
                        <span className="shrink-0 mt-0.5">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Top hashtags this week
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {WEEKLY_DIGEST.topHashtags.map((h) => (
                      <span
                        key={h.tag}
                        className={`text-xs px-2 py-0.5 rounded-full border ${h.volume === "High" ? "badge-purple" : h.volume === "Medium" ? "badge-amber" : "badge-blue"}`}
                      >
                        {h.tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-4">
                    3 actionable this week
                  </p>
                  <ul className="space-y-1.5">
                    {WEEKLY_DIGEST.actionableOpportunities.map((a, i) => (
                      <li
                        key={a}
                        data-ocid={`competitor_intelligence.digest_action.${i + 1}`}
                        className="text-xs text-foreground flex gap-1.5"
                      >
                        <span className="text-primary shrink-0 font-bold">
                          {i + 1}.
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outperformance opportunities */}
          <div data-ocid="competitor_intelligence.opportunities_section">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                Outperformance Opportunities
              </h2>
              <Badge variant="outline" className="text-xs">
                {OUTPERFORMANCE_OPPORTUNITIES.length} identified
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {OUTPERFORMANCE_OPPORTUNITIES.map((opp, i) => {
                const Icon = opp.icon;
                return (
                  <div
                    key={opp.id}
                    data-ocid={`competitor_intelligence.opportunity.${i + 1}`}
                    className={`outperformance-highlight rounded-lg border-l-4 ${opp.color} p-4 flex flex-col gap-3 animate-fade-in-up`}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div className="h-7 w-7 rounded-md bg-muted/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="h-3.5 w-3.5 text-foreground" />
                        </div>
                        <p className="text-sm font-semibold text-foreground leading-snug">
                          {opp.title}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${opp.badgeClass}`}
                      >
                        {opp.impact}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {opp.evidence}
                    </p>
                    <a
                      href="/social-content-generator"
                      data-ocid={`competitor_intelligence.create_content_button.${i + 1}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-smooth group"
                    >
                      Create Content Now
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyword opportunities from report */}
          <Card
            className="bg-card border-border"
            data-ocid="competitor_intelligence.keyword_opportunities_panel"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Keyword Opportunities
              </CardTitle>
              <CardDescription>
                High-value search terms with low competitor content coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {competitorReport.keywordOpportunities.map((kw, i) => (
                  <Badge
                    key={kw}
                    variant="secondary"
                    data-ocid={`competitor_intelligence.keyword.${i + 1}`}
                    className="text-xs badge-emerald"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
              <div className="border-t border-border/50 pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Top competitor content formats
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {competitorReport.topContentFormats.map((fmt, i) => (
                    <div
                      key={fmt}
                      data-ocid={`competitor_intelligence.content_format.${i + 1}`}
                      className="opportunity-metric bg-muted/20 rounded-md px-3 py-2 border-0"
                    >
                      <span className="text-xs text-foreground">{fmt}</span>
                      <span className="text-xs text-primary font-semibold">
                        #{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {competitorReport.citationUrls.length > 0 && (
                <div className="border-t border-border/50 pt-4 mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Sources
                  </p>
                  <ul className="space-y-1">
                    {competitorReport.citationUrls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
