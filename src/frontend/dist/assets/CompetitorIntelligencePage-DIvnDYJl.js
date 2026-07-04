import { c as createLucideIcon, bM as useDemoFlow, af as Zap, U as Users, aU as BookOpen, E as Eye, bm as Target, bn as Lightbulb, r as reactExports, j as jsxRuntimeExports, B as Button, al as RefreshCw, aw as Skeleton, ai as Sparkles, at as Card, ay as CardHeader, az as CardTitle, as as Badge, au as CardContent, H as Hash, C as ChartColumn, bN as CardDescription, bO as ArrowRight, T as TrendingUp, aa as ExternalLink, a1 as Search, aT as Progress, e as ChevronUp, f as ChevronDown, d as TriangleAlert } from "./index-CSMRpKtY.js";
import { u as useSocialMedia } from "./useSocialMedia-BckRJjjf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
const REFRESH_STEPS = [
  { label: "Scanning competitors…", icon: Search },
  { label: "Analyzing engagement…", icon: ChartColumn },
  { label: "Checking rankings…", icon: TrendingUp },
  { label: "Sourcing trending topics…", icon: Hash },
  { label: "Generating insights…", icon: Sparkles }
];
const NICHE_CONTENT = {
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
            content: "Storm damage? We're on it in 2 hours — before/after thread 🏠",
            estimatedEngagement: 487,
            postedAt: Date.now() - 864e5,
            format: "image"
          }
        ],
        strengths: [
          "Storm emergency posts",
          "Before/after photos",
          "Active on 3 platforms"
        ],
        gaps: [
          "No educational video content",
          "No LinkedIn",
          "No seasonal prep campaigns"
        ]
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
          "No CTAs"
        ]
      },
      {
        name: "ProShield Roofing",
        website: "proshieldroofing.com",
        platforms: ["facebook", "google_business"],
        averageEngagement: 97,
        rankingPosition: 4,
        recentPosts: [],
        strengths: ["Active Google Business Profile", "Consistent posting"],
        gaps: ["No social media strategy", "Posts 1× per week", "No Instagram"]
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
          "No Instagram"
        ]
      }
    ],
    weeklyDigest: {
      topThemes: [
        "Storm damage before/after",
        "Emergency response time",
        "5-star review showcases"
      ],
      winningThemes: [
        "Seasonal hail/storm prep posts (0 competitors running these — huge gap)",
        "Video roof walkthroughs get 3× more organic reach vs. static images",
        "LinkedIn targeting insurance adjusters and property managers — untapped"
      ],
      topHashtags: [
        { tag: "#roofing", volume: "High" },
        { tag: "#roofer", volume: "High" },
        { tag: "#stormrepair", volume: "Medium" },
        { tag: "#sandiegoroofer", volume: "Medium" },
        { tag: "#roofrepair", volume: "High" },
        { tag: "#hailseasondamage", volume: "Medium" },
        { tag: "#roofinstall", volume: "Low" }
      ],
      actionableOpportunities: [
        "Post a 60-second 'what to check after a storm' video — no competitor is doing educational roofing video content",
        "Start a weekly 'Roof Rescue Monday' post showing before/after repairs with homeowner quotes",
        "Launch a LinkedIn presence targeting property managers and insurance adjusters — zero competition locally"
      ],
      summary: "This week your top 4 roofing competitors focused on storm damage before/afters and review sharing. Video content and LinkedIn represent the biggest untapped gaps — first mover advantage is available in both. Seasonal storm prep campaigns are completely missing and typically drive 40–60% higher engagement."
    },
    contentThemes: [
      {
        theme: "Educational",
        clientPct: 24,
        competitorPct: 7,
        icon: BookOpen,
        color: "bg-primary"
      },
      {
        theme: "Promotional",
        clientPct: 32,
        competitorPct: 54,
        icon: Zap,
        color: "bg-amber-500"
      },
      {
        theme: "Testimonials",
        clientPct: 20,
        competitorPct: 26,
        icon: Users,
        color: "bg-emerald-500"
      },
      {
        theme: "Behind-the-Scenes",
        clientPct: 14,
        competitorPct: 5,
        icon: Eye,
        color: "bg-rose-500"
      },
      {
        theme: "Video Content",
        clientPct: 6,
        competitorPct: 2,
        icon: Video,
        color: "bg-blue-500"
      },
      {
        theme: "Local Community",
        clientPct: 4,
        competitorPct: 6,
        icon: Target,
        color: "bg-purple-500"
      }
    ],
    opportunities: [
      {
        id: "opp-1",
        title: "No competitor posts roofing video content",
        evidence: "Top 4 competitors post 0–1 videos/week. Roof walkthrough videos get 3× more reach.",
        impact: "High",
        theme: "video",
        icon: Video,
        color: "border-l-primary",
        badgeClass: "badge-purple"
      },
      {
        id: "opp-2",
        title: "LinkedIn untapped for roofing locally",
        evidence: "0 of 4 competitors have an active LinkedIn presence — property managers and adjusters are there.",
        impact: "High",
        theme: "linkedin",
        icon: Users,
        color: "border-l-emerald-400",
        badgeClass: "badge-emerald"
      },
      {
        id: "opp-3",
        title: "No competitor runs storm prep campaigns",
        evidence: "Hail season / freeze warning posts drive 40–60% higher engagement — none are posting them.",
        impact: "High",
        theme: "seasonal",
        icon: Lightbulb,
        color: "border-l-amber-400",
        badgeClass: "badge-amber"
      },
      {
        id: "opp-4",
        title: "Educational roofing content gap",
        evidence: "Competitors average only 7% educational posts. Homeowners want 'what to check' guides.",
        impact: "Medium",
        theme: "educational",
        icon: BookOpen,
        color: "border-l-blue-400",
        badgeClass: "badge-blue"
      },
      {
        id: "opp-5",
        title: "Behind-the-scenes job site content underused",
        evidence: "Only 5% of competitor posts show real crew/job content — builds trust 2× faster.",
        impact: "Medium",
        theme: "behind-scenes",
        icon: Eye,
        color: "border-l-rose-400",
        badgeClass: "badge-rose"
      }
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
      { keyword: "best roofer San Diego", volume: 41, trend: "stable" }
    ]
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
            postedAt: Date.now() - 864e5,
            format: "image"
          }
        ],
        strengths: [
          "Seasonal urgency posts",
          "Consistent Facebook presence",
          "Before/after photos"
        ],
        gaps: ["No video content", "No LinkedIn", "No educational posts"]
      },
      {
        name: "ComfortPro HVAC",
        website: "comfortprohvac.com",
        platforms: ["facebook"],
        averageEngagement: 88,
        rankingPosition: 3,
        recentPosts: [],
        strengths: ["Active Google Business", "High review count"],
        gaps: ["No Instagram", "No video", "Generic copy", "No CTAs"]
      },
      {
        name: "Premier Air Solutions",
        website: "premierairsolutions.com",
        platforms: ["facebook", "google_business"],
        averageEngagement: 121,
        rankingPosition: 4,
        recentPosts: [],
        strengths: ["GBP updated regularly", "Responds to reviews"],
        gaps: ["No social media strategy", "Posts 1×/week", "No Instagram"]
      }
    ],
    weeklyDigest: {
      topThemes: [
        "Seasonal tune-up offers",
        "Energy savings tips",
        "5-star review showcases"
      ],
      winningThemes: [
        "Indoor air quality content (0 competitors covering it — huge gap)",
        "Video system walkthroughs get 3× more reach than static images",
        "LinkedIn targeting property managers and commercial building owners — untapped"
      ],
      topHashtags: [
        { tag: "#hvac", volume: "High" },
        { tag: "#airconditioning", volume: "High" },
        { tag: "#hvacrepair", volume: "Medium" },
        { tag: "#furnacerepair", volume: "Medium" },
        { tag: "#airquality", volume: "High" },
        { tag: "#hvactechnician", volume: "Medium" },
        { tag: "#acinstall", volume: "Low" }
      ],
      actionableOpportunities: [
        "Post a 60-second 'signs your AC needs service before summer' video — no competitor is doing this",
        "Start a 'Filter Friday' weekly post showing dirty vs. clean filters with energy cost comparisons",
        "Launch a LinkedIn presence targeting commercial property managers — zero competition locally"
      ],
      summary: "This week HVAC competitors focused on seasonal tune-up promotions and review sharing. Indoor air quality content and LinkedIn are completely untapped. Video content showing real system installs and before/afters gets 3× more reach than anything competitors are currently posting."
    },
    contentThemes: [
      {
        theme: "Educational",
        clientPct: 20,
        competitorPct: 6,
        icon: BookOpen,
        color: "bg-primary"
      },
      {
        theme: "Promotional",
        clientPct: 38,
        competitorPct: 56,
        icon: Zap,
        color: "bg-amber-500"
      },
      {
        theme: "Testimonials",
        clientPct: 17,
        competitorPct: 25,
        icon: Users,
        color: "bg-emerald-500"
      },
      {
        theme: "Behind-the-Scenes",
        clientPct: 13,
        competitorPct: 5,
        icon: Eye,
        color: "bg-rose-500"
      },
      {
        theme: "Video Content",
        clientPct: 7,
        competitorPct: 3,
        icon: Video,
        color: "bg-blue-500"
      },
      {
        theme: "Local Community",
        clientPct: 5,
        competitorPct: 5,
        icon: Target,
        color: "bg-purple-500"
      }
    ],
    opportunities: [
      {
        id: "opp-1",
        title: "No competitor posts HVAC video content",
        evidence: "Competitors post 0–1 videos/week. System install walkthroughs get 3× more reach.",
        impact: "High",
        theme: "video",
        icon: Video,
        color: "border-l-primary",
        badgeClass: "badge-purple"
      },
      {
        id: "opp-2",
        title: "Indoor air quality content completely untapped",
        evidence: "0 of 3 competitors post air quality educational content — high search interest.",
        impact: "High",
        theme: "air-quality",
        icon: Lightbulb,
        color: "border-l-amber-400",
        badgeClass: "badge-amber"
      },
      {
        id: "opp-3",
        title: "LinkedIn untapped for HVAC commercial leads",
        evidence: "0 competitors have a LinkedIn presence — property managers and building owners are there.",
        impact: "High",
        theme: "linkedin",
        icon: Users,
        color: "border-l-emerald-400",
        badgeClass: "badge-emerald"
      },
      {
        id: "opp-4",
        title: "Educational content gap in HVAC niche",
        evidence: "Competitors average only 6% educational posts. Homeowners want 'how to save on energy bills' guides.",
        impact: "Medium",
        theme: "educational",
        icon: BookOpen,
        color: "border-l-blue-400",
        badgeClass: "badge-blue"
      },
      {
        id: "opp-5",
        title: "Behind-the-scenes job content underused",
        evidence: "Only 5% of competitor posts show real installs — builds trust 2× faster.",
        impact: "Medium",
        theme: "behind-scenes",
        icon: Eye,
        color: "border-l-rose-400",
        badgeClass: "badge-rose"
      }
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
      { keyword: "commercial HVAC service", volume: 38, trend: "stable" }
    ]
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
            postedAt: Date.now() - 864e5,
            format: "image"
          }
        ],
        strengths: [
          "Strong Instagram presence",
          "Before/after photo content",
          "Active on 3 platforms"
        ],
        gaps: ["No educational Reels", "No LinkedIn", "No seasonal promotions"]
      },
      {
        name: "Luxe Skin Clinic",
        website: "luxeskinclinic.com",
        platforms: ["instagram", "facebook"],
        averageEngagement: 214,
        rankingPosition: 3,
        recentPosts: [],
        strengths: ["High review velocity", "Promotional post cadence"],
        gaps: ["No video content", "Generic captions", "No TikTok presence"]
      },
      {
        name: "Pure Radiance MedSpa",
        website: "pureradiancemedspa.com",
        platforms: ["instagram"],
        averageEngagement: 97,
        rankingPosition: 4,
        recentPosts: [],
        strengths: ["Clean Instagram aesthetic"],
        gaps: ["No Facebook", "No CTAs", "Inconsistent posting (1–2×/mo)"]
      }
    ],
    weeklyDigest: {
      topThemes: [
        "Before/after treatment photos",
        "Seasonal promotions",
        "5-star review highlights"
      ],
      winningThemes: [
        "Educational Reels explaining treatments (0 competitors doing this — huge gap)",
        "TikTok completely untapped — first mover gets massive organic reach",
        "Client transformation stories drive 4× higher engagement than promos"
      ],
      topHashtags: [
        { tag: "#medspa", volume: "High" },
        { tag: "#botox", volume: "High" },
        { tag: "#aesthetics", volume: "Medium" },
        { tag: "#skincare", volume: "High" },
        { tag: "#fillers", volume: "Medium" },
        { tag: "#austinmedspa", volume: "Medium" },
        { tag: "#glowup", volume: "Low" }
      ],
      actionableOpportunities: [
        "Post a 60-second 'what to expect from your first Botox appointment' Reel — no competitor is doing educational video",
        "Start a 'Transformation Tuesday' series showing real client journeys with consent — builds trust and goes viral",
        "Launch TikTok targeting 25–45 year olds — zero local competition on the platform"
      ],
      summary: "This week med spa competitors focused on before/after photos and seasonal promotions. Educational Reels and TikTok are completely untapped. Client transformation stories with real narratives get 4× the engagement of promotional posts, and no competitor is doing them consistently."
    },
    contentThemes: [
      {
        theme: "Educational",
        clientPct: 18,
        competitorPct: 4,
        icon: BookOpen,
        color: "bg-primary"
      },
      {
        theme: "Promotional",
        clientPct: 30,
        competitorPct: 58,
        icon: Zap,
        color: "bg-amber-500"
      },
      {
        theme: "Transformations",
        clientPct: 25,
        competitorPct: 30,
        icon: Users,
        color: "bg-emerald-500"
      },
      {
        theme: "Behind-the-Scenes",
        clientPct: 15,
        competitorPct: 4,
        icon: Eye,
        color: "bg-rose-500"
      },
      {
        theme: "Video Content",
        clientPct: 9,
        competitorPct: 2,
        icon: Video,
        color: "bg-blue-500"
      },
      {
        theme: "Local Community",
        clientPct: 3,
        competitorPct: 2,
        icon: Target,
        color: "bg-purple-500"
      }
    ],
    opportunities: [
      {
        id: "opp-1",
        title: "Educational treatment Reels completely absent",
        evidence: "0 competitors post educational video content. 'What to expect' Reels get 5× more saves.",
        impact: "High",
        theme: "video",
        icon: Video,
        color: "border-l-primary",
        badgeClass: "badge-purple"
      },
      {
        id: "opp-2",
        title: "TikTok first-mover advantage available",
        evidence: "0 local med spa competitors are on TikTok — organic reach is massive for aesthetics content.",
        impact: "High",
        theme: "tiktok",
        icon: Zap,
        color: "border-l-amber-400",
        badgeClass: "badge-amber"
      },
      {
        id: "opp-3",
        title: "Client transformation stories underused",
        evidence: "Transformation narratives with real stories drive 4× engagement vs. promotional posts.",
        impact: "High",
        theme: "transformation",
        icon: Users,
        color: "border-l-emerald-400",
        badgeClass: "badge-emerald"
      },
      {
        id: "opp-4",
        title: "Educational skincare content gap",
        evidence: "Only 4% of competitor posts are educational. Clients want 'how it works' treatment guides.",
        impact: "Medium",
        theme: "educational",
        icon: BookOpen,
        color: "border-l-blue-400",
        badgeClass: "badge-blue"
      },
      {
        id: "opp-5",
        title: "Behind-the-scenes clinic content underused",
        evidence: "Only 4% of competitor posts show real clinic/team content — builds trust faster than promos.",
        impact: "Medium",
        theme: "behind-scenes",
        icon: Eye,
        color: "border-l-rose-400",
        badgeClass: "badge-rose"
      }
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
        trend: "stable"
      }
    ]
  }
};
const DEFAULT_NICHE_DATA = NICHE_CONTENT.roofing;
function RefreshProgressOverlay({ step }) {
  const current = REFRESH_STEPS[Math.min(step, REFRESH_STEPS.length - 1)];
  const pct = Math.round((step + 1) / REFRESH_STEPS.length * 100);
  const Icon = current.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "competitor_intelligence.loading_state",
      className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm mx-4 p-6 rounded-xl bg-card border border-border shadow-2xl animate-fade-in-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center animate-pulse-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: current.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Powered by Perplexity AI" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-1.5 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Step ",
            step + 1,
            " of ",
            REFRESH_STEPS.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-1", children: REFRESH_STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: `text-xs flex items-center gap-2 ${i < step ? "text-emerald-400" : i === step ? "text-primary font-medium" : "text-muted-foreground/50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `h-1.5 w-1.5 rounded-full shrink-0 ${i < step ? "bg-emerald-400" : i === step ? "bg-primary animate-pulse" : "bg-muted"}`
                }
              ),
              s.label
            ]
          },
          s.label
        )) })
      ] })
    }
  );
}
function CompetitorCard({
  comp,
  index,
  expanded,
  onToggle
}) {
  const platformColors = {
    facebook: "platform-facebook",
    instagram: "platform-instagram",
    google_business: "platform-google",
    linkedin: "badge-blue",
    tiktok: "badge-amber"
  };
  const engagementColor = comp.averageEngagement >= 200 ? "text-emerald-400" : comp.averageEngagement >= 100 ? "text-amber-400" : "text-rose-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `competitor_intelligence.competitor.${index}`,
      className: "competitor-card rounded-lg competitor-stable animate-fade-in-up",
      style: { animationDelay: `${(index - 1) * 0.08}s` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-muted/20 transition-smooth rounded-t-lg",
            onClick: onToggle,
            "aria-expanded": expanded,
            "data-ocid": `competitor_intelligence.competitor_toggle.${index}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-9 w-9 rounded-lg bg-muted/40 border border-border flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground", children: [
                  "#",
                  comp.rankingPosition
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate", children: comp.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: comp.website }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1.5", children: comp.platforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `social-platform-badge ${platformColors[p] ?? "badge-purple"}`,
                      children: p.replace("_", " ")
                    },
                    p
                  )) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${engagementColor}`, children: comp.averageEngagement }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "avg eng." }),
                expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5 text-muted-foreground mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground mt-1" })
              ] })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border/50 pt-3 animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 text-emerald-400" }),
              " Strengths"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: comp.strengths.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-emerald-400 flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5", children: "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s })
            ] }, s)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 text-amber-400" }),
              " Gaps (your opportunity)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: comp.gaps.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-amber-400 flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5", children: "→" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: g })
            ] }, g)) })
          ] }),
          comp.recentPosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Recent high-engagement post" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-md p-3 text-xs text-foreground border border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1", children: comp.recentPosts[0].content }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `social-platform-badge ${platformColors[comp.recentPosts[0].platform] ?? "badge-purple"}`,
                    children: comp.recentPosts[0].platform
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "~",
                  comp.recentPosts[0].estimatedEngagement,
                  " engagements"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: comp.recentPosts[0].format })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function CompetitorIntelligencePage() {
  const {
    competitorReport,
    getCompetitorIntelReport,
    refreshCompetitorIntel,
    isLoadingCompetitor
  } = useSocialMedia();
  const { sessionData } = useDemoFlow();
  const demoNicheRaw = sessionData.niche || "Roofing";
  const selectedNiche = demoNicheRaw.toLowerCase().replace(/\s+/g, "_");
  const nicheLabel = demoNicheRaw.charAt(0).toUpperCase() + demoNicheRaw.slice(1).replace(/_/g, " ");
  const nicheData = NICHE_CONTENT[selectedNiche] ?? DEFAULT_NICHE_DATA;
  const RICH_COMPETITOR_PROFILES = nicheData.competitors;
  const WEEKLY_DIGEST = nicheData.weeklyDigest;
  const CONTENT_THEME_DATA = nicheData.contentThemes;
  const OUTPERFORMANCE_OPPORTUNITIES = nicheData.opportunities;
  const TRENDING_TOPICS = nicheData.trendingTopics;
  const [refreshStep, setRefreshStep] = reactExports.useState(-1);
  const [expandedCompetitor, setExpandedCompetitor] = reactExports.useState(
    1
  );
  const [lastUpdated, setLastUpdated] = reactExports.useState(
    (competitorReport == null ? void 0 : competitorReport.generatedAt) ?? null
  );
  reactExports.useEffect(() => {
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
  const toggleCompetitor = (idx) => setExpandedCompetitor((prev) => prev === idx ? null : idx);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "competitor_intelligence.page",
      className: "space-y-6 p-4 md:p-6 max-w-6xl mx-auto",
      children: [
        isRefreshing && refreshStep >= 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshProgressOverlay, { step: refreshStep }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-bold text-foreground gradient-text-purple", children: "Competitor Intelligence" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Perplexity-powered real-time competitive analysis",
              lastUpdated && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs", children: [
                "· Last updated",
                " ",
                new Date(lastUpdated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/15 border border-primary/30 text-primary", children: nicheLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => void handleRefresh(),
                disabled: isRefreshing,
                className: "gap-1.5",
                "data-ocid": "competitor_intelligence.refresh_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`
                    }
                  ),
                  isRefreshing ? "Scanning…" : "Refresh Intel"
                ]
              }
            )
          ] })
        ] }),
        isLoadingCompetitor && !isRefreshing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
        ] }),
        !isLoadingCompetitor && !competitorReport && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "competitor_intelligence.empty_state",
            className: "text-center py-20 border border-dashed border-border rounded-xl bg-muted/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-7 w-7 text-primary/60" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-lg mb-1", children: "No intel report yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mx-auto mb-5", children: "Click Refresh Intel to generate a live competitive analysis powered by Perplexity AI." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => void handleRefresh(),
                  className: "gap-2",
                  "data-ocid": "competitor_intelligence.empty_refresh_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                    "Generate First Report"
                  ]
                }
              )
            ]
          }
        ),
        !isLoadingCompetitor && competitorReport && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "relative bg-card border-border competitor-intel-panel overflow-hidden",
              "data-ocid": "competitor_intelligence.summary_panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
                    "AI Strategic Summary"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs font-medium capitalize",
                        children: competitorReport.niche.replace("_", " ")
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: competitorReport.location }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "weekly-digest-badge", children: "Perplexity-sourced" })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: competitorReport.aiStrategicSummary }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-3 leading-relaxed border-t border-border/50 pt-3", children: WEEKLY_DIGEST.summary })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
                  "Competitor Profiles",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: RICH_COMPETITOR_PROFILES.length })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Tap to expand" })
              ] }),
              RICH_COMPETITOR_PROFILES.map((comp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                CompetitorCard,
                {
                  comp,
                  index: i + 1,
                  expanded: expandedCompetitor === i + 1,
                  onToggle: () => toggleCompetitor(i + 1)
                },
                comp.name
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4 text-primary" }),
                "Trending Topics This Week"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Card,
                {
                  className: "bg-card border-border",
                  "data-ocid": "competitor_intelligence.trending_panel",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-3 space-y-2", children: TRENDING_TOPICS.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `competitor_intelligence.trending_topic.${i + 1}`,
                      className: "flex items-center gap-2 group",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground truncate", children: t.keyword }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 h-1 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "h-full rounded-full bg-primary transition-all",
                              style: { width: `${t.volume}%` }
                            }
                          ) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-6 text-right", children: t.volume }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: `text-xs ${t.trend === "up" ? "text-emerald-400" : t.trend === "down" ? "text-rose-400" : "text-muted-foreground"}`,
                              children: t.trend === "up" ? "↑" : t.trend === "down" ? "↓" : "→"
                            }
                          )
                        ] })
                      ]
                    },
                    t.keyword
                  )) })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "bg-card border-border",
              "data-ocid": "competitor_intelligence.content_themes_panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
                    "Content Theme Analysis"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Your content mix vs. competitor average" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: CONTENT_THEME_DATA.map((t, i) => {
                  const Icon = t.icon;
                  const clientAhead = t.clientPct > t.competitorPct;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `competitor_intelligence.theme.${i + 1}`,
                      className: "p-3 rounded-lg bg-muted/20 border border-border/60 space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: t.theme })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: clientAhead ? "default" : "secondary",
                              className: "text-xs",
                              children: clientAhead ? "You lead" : "Gap"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary w-14 shrink-0", children: "You" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: `h-full rounded-full ${t.color} transition-all`,
                                style: { width: `${t.clientPct}%` }
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground w-8 text-right", children: [
                              t.clientPct,
                              "%"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-14 shrink-0", children: "Competitors" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "h-full rounded-full bg-muted-foreground/40 transition-all",
                                style: { width: `${t.competitorPct}%` }
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-8 text-right", children: [
                              t.competitorPct,
                              "%"
                            ] })
                          ] })
                        ] })
                      ]
                    },
                    t.theme
                  );
                }) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "bg-card border-border",
              "data-ocid": "competitor_intelligence.weekly_digest_panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary" }),
                    "Weekly Digest"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "weekly-digest-badge", children: "This week's intel" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Top themes in market" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: WEEKLY_DIGEST.topThemes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "text-sm text-foreground flex gap-1.5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0 mt-0.5", children: "•" }),
                          t
                        ]
                      },
                      t
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "What's winning (you can steal this)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: WEEKLY_DIGEST.winningThemes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "text-sm text-emerald-400 flex gap-1.5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5", children: "✓" }),
                          t
                        ]
                      },
                      t
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Top hashtags this week" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: WEEKLY_DIGEST.topHashtags.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs px-2 py-0.5 rounded-full border ${h.volume === "High" ? "badge-purple" : h.volume === "Medium" ? "badge-amber" : "badge-blue"}`,
                        children: h.tag
                      },
                      h.tag
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-4", children: "3 actionable this week" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: WEEKLY_DIGEST.actionableOpportunities.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        "data-ocid": `competitor_intelligence.digest_action.${i + 1}`,
                        className: "text-xs text-foreground flex gap-1.5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary shrink-0 font-bold", children: [
                            i + 1,
                            "."
                          ] }),
                          a
                        ]
                      },
                      a
                    )) })
                  ] })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "competitor_intelligence.opportunities_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-amber-400" }),
                "Outperformance Opportunities"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                OUTPERFORMANCE_OPPORTUNITIES.length,
                " identified"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: OUTPERFORMANCE_OPPORTUNITIES.map((opp, i) => {
              const Icon = opp.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": `competitor_intelligence.opportunity.${i + 1}`,
                  className: `outperformance-highlight rounded-lg border-l-4 ${opp.color} p-4 flex flex-col gap-3 animate-fade-in-up`,
                  style: { animationDelay: `${i * 0.07}s` },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-md bg-muted/30 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-foreground" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-snug", children: opp.title })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `shrink-0 text-xs px-2 py-0.5 rounded-full border ${opp.badgeClass}`,
                          children: opp.impact
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: opp.evidence }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: "/social-content-generator",
                        "data-ocid": `competitor_intelligence.create_content_button.${i + 1}`,
                        className: "inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-smooth group",
                        children: [
                          "Create Content Now",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 group-hover:translate-x-0.5 transition-transform" })
                        ]
                      }
                    )
                  ]
                },
                opp.id
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "bg-card border-border",
              "data-ocid": "competitor_intelligence.keyword_opportunities_panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-emerald-400" }),
                    "Keyword Opportunities"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "High-value search terms with low competitor content coverage" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: competitorReport.keywordOpportunities.map((kw, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      "data-ocid": `competitor_intelligence.keyword.${i + 1}`,
                      className: "text-xs badge-emerald",
                      children: kw
                    },
                    kw
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Top competitor content formats" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: competitorReport.topContentFormats.map((fmt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `competitor_intelligence.content_format.${i + 1}`,
                        className: "opportunity-metric bg-muted/20 rounded-md px-3 py-2 border-0",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: fmt }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary font-semibold", children: [
                            "#",
                            i + 1
                          ] })
                        ]
                      },
                      fmt
                    )) })
                  ] }),
                  competitorReport.citationUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/50 pt-4 mt-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Sources" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: competitorReport.citationUrls.map((url) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs text-primary hover:underline flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" }),
                          url
                        ]
                      }
                    ) }, url)) })
                  ] })
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  CompetitorIntelligencePage as default
};
