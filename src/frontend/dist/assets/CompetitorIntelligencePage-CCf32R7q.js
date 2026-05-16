import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, aY as Target, B as Button, an as RefreshCw, ay as Skeleton, ak as Sparkles, av as Card, aA as CardHeader, aB as CardTitle, au as Badge, aw as CardContent, U as Users, H as Hash, C as ChartColumn, bt as CardDescription, bu as BookOpen, ah as Zap, E as Eye, aZ as Lightbulb, bv as ArrowRight, T as TrendingUp, ac as ExternalLink, a3 as Search, bl as Progress, e as ChevronUp, f as ChevronDown, d as TriangleAlert } from "./index-DAQiRbqG.js";
import { u as useSocialMedia } from "./useSocialMedia-YqFsAq39.js";
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
const NICHE_OPTIONS = [
  { value: "plumbing", label: "Plumbing" },
  { value: "hvac", label: "HVAC" },
  { value: "restoration", label: "Restoration" },
  { value: "carpet_cleaning", label: "Carpet Cleaning" },
  { value: "roofing", label: "Roofing" },
  { value: "med_spa", label: "Med Spa" },
  { value: "real_estate", label: "Real Estate" },
  { value: "mortgage", label: "Mortgage" },
  { value: "chiropractor", label: "Chiropractor" },
  { value: "dental", label: "Dental" }
];
const REFRESH_STEPS = [
  { label: "Scanning competitors…", icon: Search },
  { label: "Analyzing engagement…", icon: ChartColumn },
  { label: "Checking rankings…", icon: TrendingUp },
  { label: "Sourcing trending topics…", icon: Hash },
  { label: "Generating insights…", icon: Sparkles }
];
const RICH_COMPETITOR_PROFILES = [
  {
    name: "FastFlow Plumbing",
    website: "fastflowplumbing.com",
    platforms: ["facebook", "instagram"],
    averageEngagement: 218,
    rankingPosition: 2,
    recentPosts: [
      {
        platform: "facebook",
        content: "Before/after: clogged drain → crystal clear 🚿",
        estimatedEngagement: 312,
        postedAt: Date.now() - 864e5,
        format: "image"
      }
    ],
    strengths: [
      "Fast response messaging",
      "Before/after photos",
      "Consistent posting (5×/wk)"
    ],
    gaps: [
      "No video content",
      "Rarely posts on LinkedIn",
      "No seasonal urgency posts"
    ]
  },
  {
    name: "Pacific Drain Pros",
    website: "pacificdrainpros.com",
    platforms: ["facebook"],
    averageEngagement: 95,
    rankingPosition: 3,
    recentPosts: [],
    strengths: ["Consistent posting schedule", "Strong Google review volume"],
    gaps: [
      "Generic copy",
      "No CTA in posts",
      "No Instagram presence",
      "No video"
    ]
  },
  {
    name: "SoCal Pipe Works",
    website: "socalpipeworks.com",
    platforms: ["facebook", "google_business"],
    averageEngagement: 142,
    rankingPosition: 4,
    recentPosts: [],
    strengths: ["High Google Business activity", "Active review responses"],
    gaps: ["No social media strategy", "Posts 1× per week", "No Instagram"]
  },
  {
    name: "Reliable Rooter Co.",
    website: "reliablerooter.com",
    platforms: ["facebook", "instagram", "google_business"],
    averageEngagement: 178,
    rankingPosition: 5,
    recentPosts: [],
    strengths: ["Active on 3 platforms", "Emergency service posts"],
    gaps: [
      "Low engagement on Instagram",
      "No LinkedIn",
      "No before/after content"
    ]
  },
  {
    name: "AquaFix Plumbing",
    website: "aquafixplumbing.com",
    platforms: ["instagram"],
    averageEngagement: 66,
    rankingPosition: 6,
    recentPosts: [],
    strengths: ["Clean Instagram aesthetic"],
    gaps: ["No Facebook presence", "No CTAs", "Inconsistent posting (1–2×/mo)"]
  }
];
const WEEKLY_DIGEST = {
  topThemes: [
    "Before/after transformations",
    "Emergency service availability",
    "5-star review showcases"
  ],
  winningThemes: [
    "Seasonal urgency posts (0 competitors running these — huge gap)",
    "Video walkthroughs get 3× more organic reach vs. static images",
    "LinkedIn completely untapped — first mover wins"
  ],
  topHashtags: [
    { tag: "#plumber", volume: "High" },
    { tag: "#plumbing", volume: "High" },
    { tag: "#emergencyplumber", volume: "Medium" },
    { tag: "#sandiegoplumber", volume: "Medium" },
    { tag: "#homerepair", volume: "High" },
    { tag: "#waterdamage", volume: "Medium" },
    { tag: "#draincleaning", volume: "Low" }
  ],
  actionableOpportunities: [
    "Post a 60-second 'how to prevent a burst pipe before winter' video — no competitor is doing educational video content",
    "Start a weekly 'Money Monday' post showing how much homeowners save by fixing issues early vs. emergency calls",
    "Launch a LinkedIn presence targeting property managers — zero competition in this market segment locally"
  ],
  summary: "This week your top 5 competitors focused heavily on static before/after images and review-sharing content. Video and LinkedIn represent the biggest gaps — first mover advantage is available in both. Seasonal urgency content (winter prep, freeze warnings) is completely untapped and typically drives 40–60% higher engagement in home services niches."
};
const CONTENT_THEME_DATA = [
  {
    theme: "Educational",
    clientPct: 22,
    competitorPct: 8,
    icon: BookOpen,
    color: "bg-primary"
  },
  {
    theme: "Promotional",
    clientPct: 35,
    competitorPct: 52,
    icon: Zap,
    color: "bg-amber-500"
  },
  {
    theme: "Testimonials",
    clientPct: 18,
    competitorPct: 28,
    icon: Users,
    color: "bg-emerald-500"
  },
  {
    theme: "Behind-the-Scenes",
    clientPct: 12,
    competitorPct: 6,
    icon: Eye,
    color: "bg-rose-500"
  },
  {
    theme: "Video Content",
    clientPct: 8,
    competitorPct: 2,
    icon: Video,
    color: "bg-blue-500"
  },
  {
    theme: "Local Community",
    clientPct: 5,
    competitorPct: 4,
    icon: Target,
    color: "bg-purple-500"
  }
];
const OUTPERFORMANCE_OPPORTUNITIES = [
  {
    id: "opp-1",
    title: "Competitors are weak on video content",
    evidence: "Top 5 competitors post 0–2 videos/week. Videos get 3× more reach.",
    impact: "High",
    theme: "video",
    icon: Video,
    color: "border-l-primary",
    badgeClass: "badge-purple"
  },
  {
    id: "opp-2",
    title: "LinkedIn is completely untapped locally",
    evidence: "0 of 5 competitors have an active LinkedIn presence in this market.",
    impact: "High",
    theme: "linkedin",
    icon: Users,
    color: "border-l-emerald-400",
    badgeClass: "badge-emerald"
  },
  {
    id: "opp-3",
    title: "No competitor runs seasonal urgency campaigns",
    evidence: "Winter prep / freeze warning posts drive 40–60% higher engagement — none are posting them.",
    impact: "High",
    theme: "seasonal",
    icon: Lightbulb,
    color: "border-l-amber-400",
    badgeClass: "badge-amber"
  },
  {
    id: "opp-4",
    title: "Educational content gap in your niche",
    evidence: "Competitors average only 8% educational posts. Your audience wants how-to content.",
    impact: "Medium",
    theme: "educational",
    icon: BookOpen,
    color: "border-l-blue-400",
    badgeClass: "badge-blue"
  },
  {
    id: "opp-5",
    title: "Behind-the-scenes content is underutilized",
    evidence: "Only 6% of competitor posts show real team/job site content — builds trust 2× faster.",
    impact: "Medium",
    theme: "behind-scenes",
    icon: Eye,
    color: "border-l-rose-400",
    badgeClass: "badge-rose"
  }
];
const TRENDING_TOPICS = [
  { keyword: "emergency plumber San Diego", volume: 92, trend: "up" },
  { keyword: "water heater replacement cost", volume: 88, trend: "up" },
  { keyword: "frozen pipes winter repair", volume: 84, trend: "up" },
  { keyword: "drain cleaning near me", volume: 79, trend: "stable" },
  { keyword: "burst pipe emergency", volume: 76, trend: "up" },
  { keyword: "plumbing inspection checklist", volume: 68, trend: "up" },
  { keyword: "sewer line repair cost 2025", volume: 65, trend: "stable" },
  { keyword: "tankless water heater install", volume: 61, trend: "up" },
  { keyword: "bathroom remodel plumber", volume: 57, trend: "stable" },
  { keyword: "low water pressure fix", volume: 52, trend: "down" },
  { keyword: "water softener San Diego", volume: 48, trend: "up" },
  { keyword: "24 hour plumber near me", volume: 44, trend: "stable" }
];
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
  const [selectedNiche, setSelectedNiche] = reactExports.useState("plumbing");
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: selectedNiche,
                onChange: (e) => setSelectedNiche(e.target.value),
                className: "location-selector rounded-lg px-3 py-2 text-sm h-9",
                "data-ocid": "competitor_intelligence.niche_select",
                children: NICHE_OPTIONS.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: n.value, children: n.label }, n.value))
              }
            ),
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
