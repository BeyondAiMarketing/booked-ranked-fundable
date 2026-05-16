import { r as reactExports, j as jsxRuntimeExports, T as TrendingUp, B as Button, bd as Settings, e as ChevronUp, f as ChevronDown, an as RefreshCw, U as Users, i as Clock, m as Mail, av as Card, aw as CardContent, aH as Funnel, ay as Skeleton, X, _ as Select, $ as SelectTrigger, a0 as SelectValue, a1 as SelectContent, a2 as SelectItem, aA as CardHeader, aB as CardTitle, aF as ChevronRight, ac as ExternalLink, au as Badge, C as ChartColumn, b3 as ScrollArea, a_ as Flame, q as Trash2, bk as Heart, bB as Share2, bC as MousePointer, ah as Zap, bg as MessageSquare, bD as ThumbsUp, be as Play } from "./index-DAQiRbqG.js";
import { S as Separator } from "./separator-DX_6Rlgi.js";
import { u as useSocialMedia } from "./useSocialMedia-YqFsAq39.js";
const NICHE_LABELS = {
  plumbing: "Plumbing",
  hvac: "HVAC",
  restoration: "Restoration",
  carpet_cleaning: "Carpet Cleaning",
  roofing: "Roofing",
  med_spa: "Med Spa",
  real_estate: "Real Estate",
  mortgage: "Mortgage",
  chiropractor: "Chiropractor",
  dental: "Dental"
};
const PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  google_business: "Google",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  direct: "Direct",
  email: "Email",
  referral: "Referral"
};
const PLATFORM_COLORS = {
  facebook: "platform-facebook",
  instagram: "platform-instagram",
  google_business: "platform-google",
  tiktok: "badge-purple",
  linkedin: "badge-blue",
  direct: "badge-amber",
  email: "badge-emerald",
  referral: "badge-rose"
};
const FUNNEL_STAGES = [
  {
    key: "engaged",
    label: "Social Engagement",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4" }),
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/30"
  },
  {
    key: "enrolled",
    label: "Enrolled in Sequence",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/30"
  },
  {
    key: "email_sent",
    label: "Email Sent",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
    color: "text-amber-400",
    bgColor: "bg-amber-400/10 border-amber-400/30"
  },
  {
    key: "email_opened",
    label: "Email Opened",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" }),
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10 border-emerald-400/30"
  },
  {
    key: "demo_clicked",
    label: "Demo Clicked",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { className: "h-4 w-4" }),
    color: "text-rose-400",
    bgColor: "bg-rose-400/10 border-rose-400/30"
  },
  {
    key: "trial_activated",
    label: "Trial Activated",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }),
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/30"
  }
];
const DEMO_SEQUENCES = [
  "Premium Outreach – 9 Email",
  "Social Retargeting – 5 Email",
  "Trial Nurture – 7 Email",
  "Hot Prospect – 3 Email Fast"
];
const RICH_DEMO_ENTRIES = [
  {
    id: "df-1",
    tenantId: "tenant-1",
    prospectName: "Carlos Mendez",
    businessName: "Mendez Plumbing & Drain",
    email: "carlos@mendezplumbing.com",
    phone: "619-555-0142",
    niche: "plumbing",
    socialSource: "facebook",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/mendez-plumbing",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/mendez-plumbing",
    trialStartedAt: Date.now() - 864e5,
    trialExpiresAt: Date.now() + 6 * 864e5,
    currentStep: "website",
    stepsCompleted: ["voice_agent"],
    convertedToTrial: true,
    convertedToClient: false,
    lastActivityAt: Date.now() - 36e5,
    createdAt: Date.now() - 864e5
  },
  {
    id: "df-2",
    tenantId: "tenant-1",
    prospectName: "Angela Kim",
    businessName: "Radiant Glow Med Spa",
    email: "angela@radiantglowspa.com",
    phone: "858-555-0318",
    niche: "med_spa",
    socialSource: "instagram",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/radiant-glow-med-spa",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/radiant-glow-med-spa",
    trialStartedAt: Date.now() - 3 * 864e5,
    trialExpiresAt: Date.now() + 4 * 864e5,
    currentStep: "reviews",
    stepsCompleted: ["voice_agent", "website", "crm"],
    convertedToTrial: true,
    convertedToClient: false,
    lastActivityAt: Date.now() - 72e5,
    createdAt: Date.now() - 3 * 864e5
  },
  {
    id: "df-3",
    tenantId: "tenant-1",
    prospectName: "Mike Torres",
    businessName: "Torres Roofing & Gutters",
    email: "mike@torresroofing.com",
    phone: "760-555-0874",
    niche: "roofing",
    socialSource: "facebook",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/torres-roofing",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/torres-roofing",
    trialStartedAt: null,
    trialExpiresAt: null,
    currentStep: "voice_agent",
    stepsCompleted: [],
    convertedToTrial: false,
    convertedToClient: false,
    lastActivityAt: Date.now() - 2 * 864e5,
    createdAt: Date.now() - 2 * 864e5
  },
  {
    id: "df-4",
    tenantId: "tenant-1",
    prospectName: "Lisa Nguyen",
    businessName: "Fresh Start Carpet Care",
    email: "lisa@freshstartcarpet.com",
    phone: "619-555-0551",
    niche: "carpet_cleaning",
    socialSource: "google_business",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/fresh-start-carpet",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/fresh-start-carpet",
    trialStartedAt: Date.now() - 14 * 864e5,
    trialExpiresAt: Date.now() - 7 * 864e5,
    currentStep: "completed",
    stepsCompleted: ["voice_agent", "website", "crm", "reviews", "credit"],
    convertedToTrial: true,
    convertedToClient: true,
    lastActivityAt: Date.now() - 864e5,
    createdAt: Date.now() - 14 * 864e5
  },
  {
    id: "df-5",
    tenantId: "tenant-1",
    prospectName: "James Okafor",
    businessName: "Arctic Air HVAC Solutions",
    email: "james@arcticairhvac.com",
    phone: "619-555-0229",
    niche: "hvac",
    socialSource: "linkedin",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/arctic-air-hvac",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/arctic-air-hvac",
    trialStartedAt: Date.now() - 5 * 864e5,
    trialExpiresAt: Date.now() + 2 * 864e5,
    currentStep: "crm",
    stepsCompleted: ["voice_agent", "website"],
    convertedToTrial: true,
    convertedToClient: false,
    lastActivityAt: Date.now() - 18e6,
    createdAt: Date.now() - 5 * 864e5
  },
  {
    id: "df-6",
    tenantId: "tenant-1",
    prospectName: "Patricia Ross",
    businessName: "Ross Family Dental",
    email: "patricia@rossdental.com",
    phone: "858-555-0447",
    niche: "dental",
    socialSource: "instagram",
    demoUrl: "https://bookedrankedfunded.org/brand-kit/ross-family-dental",
    brandKitUrl: "https://bookedrankedfunded.org/brand-kit/ross-family-dental",
    trialStartedAt: null,
    trialExpiresAt: null,
    currentStep: "voice_agent",
    stepsCompleted: [],
    convertedToTrial: false,
    convertedToClient: false,
    lastActivityAt: Date.now() - 4 * 864e5,
    createdAt: Date.now() - 4 * 864e5
  }
];
const ENGAGEMENT_HISTORY = {
  "df-1": [
    {
      type: "social",
      label: "Liked post on Facebook",
      detail: '"40% of water heaters fail in winter..." — liked + shared',
      ts: Date.now() - 4 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "h-3.5 w-3.5" }),
      color: "text-blue-400"
    },
    {
      type: "social",
      label: "Commented on Facebook post",
      detail: '"How much does a replacement cost? Mine is 12 years old"',
      ts: Date.now() - 3.5 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
      color: "text-blue-400"
    },
    {
      type: "email",
      label: "Email #1 sent",
      detail: "Subject: We ran your audit, Carlos — here's what we found",
      ts: Date.now() - 3 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
      color: "text-amber-400"
    },
    {
      type: "email",
      label: "Email #1 opened",
      detail: "Opened 3x — high engagement signal",
      ts: Date.now() - 2.5 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3.5 w-3.5" }),
      color: "text-emerald-400"
    },
    {
      type: "demo",
      label: "Clicked demo link",
      detail: "Visited bookedrankedfunded.org/brand-kit/mendez-plumbing",
      ts: Date.now() - 2 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { className: "h-3.5 w-3.5" }),
      color: "text-rose-400"
    },
    {
      type: "trial",
      label: "Trial activated",
      detail: "Started 7-day free trial — step: Voice Agent",
      ts: Date.now() - 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
      color: "text-primary"
    },
    {
      type: "trial",
      label: "Completed Voice Agent step",
      detail: "Tested AI agent with business name — played 2 full demos",
      ts: Date.now() - 36e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }),
      color: "text-primary"
    }
  ],
  "df-4": [
    {
      type: "social",
      label: "Google Business review engagement",
      detail: "Left comment asking about carpet cleaning packages",
      ts: Date.now() - 20 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
      color: "text-blue-400"
    },
    {
      type: "email",
      label: "Email #1 sent",
      detail: "Subject: Lisa — your carpet cleaning brand kit is ready",
      ts: Date.now() - 18 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
      color: "text-amber-400"
    },
    {
      type: "email",
      label: "Email #3 opened + link clicked",
      detail: "Before/after screenshot email — clicked demo link twice",
      ts: Date.now() - 16 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointer, { className: "h-3.5 w-3.5" }),
      color: "text-rose-400"
    },
    {
      type: "trial",
      label: "Trial activated — all 5 steps completed",
      detail: "Completed full guided demo in one session",
      ts: Date.now() - 14 * 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }),
      color: "text-primary"
    },
    {
      type: "converted",
      label: "Converted to paying client",
      detail: "Signed up for Starter plan — monthly subscription activated",
      ts: Date.now() - 864e5,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
      color: "text-emerald-400"
    }
  ]
};
function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function getDaysLeft(expiresAt) {
  if (!expiresAt) return null;
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 864e5));
}
function getFunnelStageForEntry(entry) {
  if (entry.convertedToClient) return "trial_activated";
  if (entry.convertedToTrial) {
    if (entry.stepsCompleted.length >= 3) return "demo_clicked";
    if (entry.stepsCompleted.length >= 1) return "email_opened";
    return "enrolled";
  }
  return "engaged";
}
function getEmailOnLabel(entry) {
  if (entry.convertedToClient) return "Converted ✓";
  if (!entry.convertedToTrial) return "Email #1 pending";
  const steps = entry.stepsCompleted.length;
  if (steps === 0) return "Email #1 opened";
  if (steps === 1) return "Email #3 — demo link";
  if (steps === 2) return "Email #5 — trial push";
  return "Email #7 — last chance";
}
function FunnelDiagram({ entries }) {
  const stageCounts = {
    engaged: entries.length,
    enrolled: entries.filter(
      (e) => e.convertedToTrial || e.stepsCompleted.length > 0
    ).length,
    email_sent: entries.filter(
      (e) => e.convertedToTrial || e.stepsCompleted.length > 0
    ).length,
    email_opened: entries.filter((e) => e.stepsCompleted.length >= 1).length,
    demo_clicked: entries.filter((e) => e.stepsCompleted.length >= 2).length,
    trial_activated: entries.filter((e) => e.convertedToTrial).length
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "bg-card border-border",
      "data-ocid": "social_demo_funnel.funnel_diagram",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
          "Pipeline Conversion Funnel"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row items-stretch md:items-end gap-2 md:gap-1", children: FUNNEL_STAGES.map((stage, i) => {
          const count = stageCounts[stage.key];
          const total = stageCounts.engaged || 1;
          const pct = Math.round(count / total * 100);
          const nextCount = i < FUNNEL_STAGES.length - 1 ? stageCounts[FUNNEL_STAGES[i + 1].key] : count;
          const convRate = count > 0 ? Math.round(nextCount / count * 100) : 0;
          const barH = Math.max(20, Math.round(count / total * 100));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col md:flex-row items-center flex-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center w-full md:flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex flex-col items-center w-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground mb-1", children: count }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-full rounded-t-md border ${stage.bgColor} transition-all`,
                        style: { height: `${barH}px`, minHeight: "20px" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `mt-2 p-1.5 rounded border ${stage.bgColor} flex items-center justify-center`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: stage.color, children: stage.icon })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center mt-1 leading-tight max-w-[80px]", children: stage.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-primary font-semibold mt-0.5", children: [
                      pct,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `md:hidden flex items-center gap-3 w-full p-2 rounded border ${stage.bgColor}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: stage.color, children: stage.icon }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: stage.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full mt-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "h-full bg-primary rounded-full",
                              style: { width: `${pct}%` }
                            }
                          ) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: count }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-primary", children: [
                            pct,
                            "%"
                          ] })
                        ] })
                      ]
                    }
                  )
                ] }),
                i < FUNNEL_STAGES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex flex-col items-center mx-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[9px] text-emerald-400 font-bold mb-1", children: [
                    convRate,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-muted-foreground/50" })
                ] }),
                i < FUNNEL_STAGES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center gap-1 py-0.5 pl-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-muted-foreground/50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-400 font-semibold", children: [
                    convRate,
                    "% conversion"
                  ] })
                ] })
              ]
            },
            stage.key
          );
        }) }) })
      ]
    }
  );
}
function TriggerConfigPanel({ onClose }) {
  const [configs, setConfigs] = reactExports.useState([
    {
      platform: "facebook",
      threshold: 3,
      sequence: DEMO_SEQUENCES[0],
      enabled: true
    },
    {
      platform: "instagram",
      threshold: 3,
      sequence: DEMO_SEQUENCES[1],
      enabled: true
    },
    {
      platform: "linkedin",
      threshold: 2,
      sequence: DEMO_SEQUENCES[0],
      enabled: false
    },
    {
      platform: "google_business",
      threshold: 1,
      sequence: DEMO_SEQUENCES[0],
      enabled: false
    }
  ]);
  const update = (i, key, val) => {
    setConfigs(
      (prev) => prev.map((c, idx) => idx === i ? { ...c, [key]: val } : c)
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_demo_funnel.trigger_config.panel",
      className: "border border-border rounded-lg bg-card overflow-hidden animate-fade-in-down",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Auto-Enroll Trigger Configuration" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "data-ocid": "social_demo_funnel.trigger_config.close_button",
              className: "text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Close trigger configuration",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "When a prospect reaches the interaction threshold on a platform, they are automatically enrolled in the selected email sequence." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: configs.map((cfg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `social_demo_funnel.trigger_config.item.${i + 1}`,
              className: `flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border transition-smooth ${cfg.enabled ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-[140px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      role: "switch",
                      "aria-checked": cfg.enabled,
                      onClick: () => update(i, "enabled", !cfg.enabled),
                      "data-ocid": `social_demo_funnel.trigger_config.toggle.${i + 1}`,
                      className: `relative w-9 h-5 rounded-full transition-colors ${cfg.enabled ? "bg-primary" : "bg-muted"}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform ${cfg.enabled ? "translate-x-4" : "translate-x-0.5"}`
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs font-medium social-platform-badge ${PLATFORM_COLORS[cfg.platform] ?? "badge-purple"}`,
                      children: PLATFORM_LABELS[cfg.platform]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Threshold:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: String(cfg.threshold),
                      onValueChange: (v) => update(i, "threshold", Number(v)),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "h-7 w-20 text-xs",
                            "data-ocid": `social_demo_funnel.trigger_config.threshold.${i + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(n), children: [
                          n,
                          " interaction",
                          n > 1 ? "s" : ""
                        ] }, n)) })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Sequence:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: cfg.sequence,
                      onValueChange: (v) => update(i, "sequence", v),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SelectTrigger,
                          {
                            className: "h-7 text-xs flex-1 min-w-0",
                            "data-ocid": `social_demo_funnel.trigger_config.sequence.${i + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DEMO_SEQUENCES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                      ]
                    }
                  )
                ] })
              ]
            },
            cfg.platform
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "flex-1",
                "data-ocid": "social_demo_funnel.trigger_config.save_button",
                onClick: onClose,
                children: "Save Trigger Config"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                "data-ocid": "social_demo_funnel.trigger_config.cancel_button",
                onClick: onClose,
                children: "Cancel"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function SequencePerformancePanel() {
  const stats = [
    { label: "Open Rate", value: "52%", trend: "+8%", color: "text-amber-400" },
    {
      label: "Click-Through Rate",
      value: "31%",
      trend: "+12%",
      color: "text-emerald-400"
    },
    {
      label: "Demo Conversion",
      value: "18%",
      trend: "+5%",
      color: "text-primary"
    },
    {
      label: "Trial Activated",
      value: "9%",
      trend: "+3%",
      color: "text-rose-400"
    }
  ];
  const emailStats = [
    { name: "Email #1 — Audit Reveal", opens: 68, clicks: 42 },
    { name: "Email #2 — Before/After", opens: 61, clicks: 38 },
    { name: "Email #3 — Pain Amplifier", opens: 54, clicks: 29 },
    { name: "Email #5 — Voice Agent", opens: 48, clicks: 35 },
    { name: "Email #7 — Last Chance", opens: 38, clicks: 22 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "bg-card border-border",
      "data-ocid": "social_demo_funnel.sequence_perf.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
            "Retargeting Sequence Performance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Premium Outreach – 9 Email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "bg-muted/30 rounded-lg p-2.5 border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg font-bold ${s.color}`, children: s.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: s.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-400 font-semibold", children: [
                  s.trend,
                  " vs prev"
                ] })
              ]
            },
            s.label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Per-Email Breakdown" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: emailStats.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate pr-2", children: e.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0", children: [
                  e.opens,
                  "% opens / ",
                  e.clicks,
                  "% clicks"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full rounded-full",
                  style: {
                    width: `${e.opens}%`,
                    background: "linear-gradient(90deg, oklch(0.58 0.22 290), oklch(0.62 0.18 155))"
                  }
                }
              ) })
            ] }, e.name)) })
          ] })
        ] })
      ]
    }
  );
}
function ProspectTimeline({
  entry,
  onClose,
  onRemove
}) {
  const history = ENGAGEMENT_HISTORY[entry.id] ?? [];
  const daysLeft = getDaysLeft(entry.trialExpiresAt);
  const triggerPost = entry.socialSource !== "direct" && entry.socialSource !== "email" && entry.socialSource !== "referral" ? {
    platform: PLATFORM_LABELS[entry.socialSource] ?? entry.socialSource,
    content: `"40% of ${NICHE_LABELS[entry.niche] ?? entry.niche} businesses are missing leads from voicemail — here's the fix" — liked + commented by ${entry.prospectName}`,
    url: `https://bookedrankedfunded.org/social/${entry.socialSource}/${entry.id}`
  } : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_demo_funnel.prospect_timeline.sheet",
      className: "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col animate-slide-in-left",
      style: { animation: "slideInRight 0.25s ease-out both" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-4 border-b border-border bg-muted/30 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 pr-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: entry.prospectName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: entry.businessName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `social-platform-badge text-[10px] ${PLATFORM_COLORS[entry.socialSource] ?? "badge-purple"}`,
                  children: PLATFORM_LABELS[entry.socialSource] ?? entry.socialSource
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "social-platform-badge text-[10px] badge-purple", children: NICHE_LABELS[entry.niche] }),
              entry.convertedToClient && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-emerald social-platform-badge text-[10px]", children: "Client ✓" }),
              entry.convertedToTrial && !entry.convertedToClient && daysLeft !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-amber social-platform-badge text-[10px]", children: [
                daysLeft,
                "d left"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "data-ocid": "social_demo_funnel.prospect_timeline.close_button",
              "aria-label": "Close timeline",
              className: "text-muted-foreground hover:text-foreground transition-colors shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Demo Link" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: entry.demoUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-2 text-xs text-primary hover:underline break-all",
                "data-ocid": "social_demo_funnel.prospect_timeline.demo_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5 shrink-0" }),
                  entry.demoUrl
                ]
              }
            )
          ] }),
          triggerPost && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Attribution — Initial Trigger Post" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-primary/20 rounded-lg p-3 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `social-platform-badge text-[9px] ${PLATFORM_COLORS[entry.socialSource] ?? "badge-purple"}`,
                    children: triggerPost.platform
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3 w-3 text-rose-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-rose-400 font-semibold", children: "Triggered enrollment" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground italic line-clamp-3", children: triggerPost.content }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: triggerPost.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-[10px] text-primary hover:underline flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" }),
                    "View post"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Full Engagement History" }),
            history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No activity recorded yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1.5 top-2 bottom-2 w-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: history.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `absolute -left-2.5 top-1 w-2 h-2 rounded-full border border-background bg-current ${h.color}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 rounded-lg p-2.5 space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: h.color, children: h.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: h.label })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground pl-5", children: h.detail }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 pl-5", children: timeAgo(h.ts) })
                ] })
              ] }, `${h.type}-${i}`)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Email Sequence Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [
              "Audit Reveal",
              "Before/After Screenshot",
              "Pain Amplifier",
              "Social Proof + Rankings",
              "Voice Agent Reveal",
              "Free Trial Push",
              "Last Chance"
            ].map((label, i) => {
              const sent = i < entry.stepsCompleted.length + 2;
              const opened = i < entry.stepsCompleted.length + 1;
              const clicked = i < entry.stepsCompleted.length;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex items-center gap-2.5 p-2 rounded border text-xs transition-smooth ${clicked ? "border-primary/30 bg-primary/5 text-foreground" : sent ? "border-amber-400/20 bg-amber-400/5 text-foreground" : "border-border bg-transparent text-muted-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-muted text-[10px] font-bold", children: i + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 min-w-0 truncate", children: [
                      "Email #",
                      i + 1,
                      " — ",
                      label
                    ] }),
                    clicked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-[10px] font-semibold shrink-0", children: "Clicked ✓" }),
                    !clicked && opened && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-400 text-[10px] font-semibold shrink-0", children: "Opened" }),
                    !opened && sent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px] shrink-0", children: "Sent" }),
                    !sent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 text-[10px] shrink-0", children: "Pending" })
                  ]
                },
                label
              );
            }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-border bg-muted/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            size: "sm",
            className: "w-full gap-2",
            "data-ocid": "social_demo_funnel.prospect_timeline.delete_button",
            onClick: () => {
              onRemove(entry.id);
              onClose();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
              "Remove from Funnel"
            ]
          }
        ) })
      ]
    }
  );
}
function ProspectRow({
  entry,
  index,
  onViewTimeline
}) {
  const daysLeft = getDaysLeft(entry.trialExpiresAt);
  const currentStage = getFunnelStageForEntry(entry);
  const stageConfig = FUNNEL_STAGES.find((s) => s.key === currentStage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border hover:bg-muted/20 transition-smooth",
      "data-ocid": `social_demo_funnel.prospect_table.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 min-w-[160px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate max-w-[200px]", children: entry.prospectName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate max-w-[200px]", children: entry.businessName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `social-platform-badge text-[10px] ${PLATFORM_COLORS[entry.socialSource] ?? "badge-purple"}`,
            children: PLATFORM_LABELS[entry.socialSource] ?? entry.socialSource
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 hidden md:table-cell text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: entry.stepsCompleted.length + 3 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "interactions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: stageConfig ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${stageConfig.bgColor} ${stageConfig.color}`,
            children: [
              stageConfig.icon,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden lg:inline", children: stageConfig.label })
            ]
          }
        ) : null }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: getEmailOnLabel(entry) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: timeAgo(entry.lastActivityAt) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: entry.demoUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-xs text-primary hover:underline flex items-center gap-1 max-w-[180px] truncate",
            "data-ocid": `social_demo_funnel.prospect_table.demo_link.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "bookedrankedfunded.org/…" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 hidden sm:table-cell", children: entry.convertedToClient ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/25", children: "Client" }) : entry.convertedToTrial && daysLeft !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "secondary",
            className: `text-[10px] ${daysLeft <= 2 ? "text-rose-400" : "text-amber-400"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5 mr-1" }),
              daysLeft,
              "d left"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "text-[10px] text-muted-foreground",
            children: "Not started"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onViewTimeline(entry),
            "data-ocid": `social_demo_funnel.prospect_table.view_button.${index + 1}`,
            className: "text-xs text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1",
            "aria-label": `View timeline for ${entry.prospectName}`,
            children: [
              "Timeline ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
            ]
          }
        ) })
      ]
    }
  );
}
function SocialDemoFunnelPage() {
  const { getDemoFunnelEntries, isLoadingFunnel, updateDemoFunnelEntry } = useSocialMedia();
  const [entries, setEntries] = reactExports.useState(RICH_DEMO_ENTRIES);
  const [filter, setFilter] = reactExports.useState("all");
  const [showTriggerConfig, setShowTriggerConfig] = reactExports.useState(false);
  const [selectedEntry, setSelectedEntry] = reactExports.useState(
    null
  );
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    void getDemoFunnelEntries("tenant-1");
  }, []);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getDemoFunnelEntries("tenant-1");
    setTimeout(() => setIsRefreshing(false), 600);
  };
  const handleRemove = (id) => {
    void updateDemoFunnelEntry(id, { convertedToClient: false });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };
  const filtered = entries.filter((e) => {
    if (filter === "active") return e.convertedToTrial && !e.convertedToClient;
    if (filter === "trial") return !e.convertedToTrial;
    if (filter === "converted") return e.convertedToClient;
    return true;
  });
  const totalCount = entries.length;
  const trialCount = entries.filter(
    (e) => e.convertedToTrial && !e.convertedToClient
  ).length;
  const convertedCount = entries.filter((e) => e.convertedToClient).length;
  const pendingCount = entries.filter((e) => !e.convertedToTrial).length;
  const filterOptions = [
    { value: "all", label: "All Prospects", count: totalCount },
    { value: "active", label: "Active Trials", count: trialCount },
    { value: "trial", label: "Not Started", count: pendingCount },
    { value: "converted", label: "Converted", count: convertedCount }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_demo_funnel.page",
      className: "min-h-full space-y-5 p-4 md:p-6 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl md:text-2xl font-display font-bold text-foreground flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-6 w-6 text-primary shrink-0" }),
              "Social-to-Demo Funnel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
                totalCount,
                " prospects"
              ] }),
              " ",
              "active across all social platforms"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "gap-1.5",
                onClick: () => setShowTriggerConfig((v) => !v),
                "data-ocid": "social_demo_funnel.configure_triggers_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Configure Triggers" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Triggers" }),
                  showTriggerConfig ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "gap-1.5",
                onClick: () => void handleRefresh(),
                disabled: isRefreshing,
                "data-ocid": "social_demo_funnel.refresh_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Refresh" })
                ]
              }
            )
          ] })
        ] }),
        showTriggerConfig && /* @__PURE__ */ jsxRuntimeExports.jsx(TriggerConfigPanel, { onClose: () => setShowTriggerConfig(false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
          {
            label: "Total Prospects",
            value: totalCount,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
            color: "text-foreground"
          },
          {
            label: "Active Trials",
            value: trialCount,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
            color: "text-amber-400"
          },
          {
            label: "Not Started",
            value: pendingCount,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
            color: "text-blue-400"
          },
          {
            label: "Converted",
            value: convertedCount,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
            color: "text-emerald-400"
          }
        ].map(({ label, value, icon, color }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "bg-card border-border",
            "data-ocid": `social_demo_funnel.stat.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-3 pb-3 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: color, children: icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-bold ${color}`, children: value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: label })
              ] })
            ] })
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FunnelDiagram, { entries }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 flex-wrap",
                "data-ocid": "social_demo_funnel.filter_tabs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
                  filterOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFilter(opt.value),
                      "data-ocid": `social_demo_funnel.filter.${opt.value}`,
                      className: `px-3 py-1 rounded-full text-xs font-medium transition-smooth ${filter === opt.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
                      children: [
                        opt.label,
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === opt.value ? "bg-primary-foreground/20" : "bg-background"}`,
                            children: opt.count
                          }
                        )
                      ]
                    },
                    opt.value
                  ))
                ]
              }
            ),
            isLoadingFunnel && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "social_demo_funnel.loading_state",
                className: "space-y-2",
                children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }, i))
              }
            ),
            !isLoadingFunnel && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "social_demo_funnel.empty_state",
                className: "text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 mx-auto mb-3 opacity-30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "No prospects match this filter" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs mt-1", children: [
                    'Try "All Prospects" or add prospects from the',
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "a",
                      {
                        href: "/social-lead-capture",
                        className: "text-primary hover:underline",
                        children: "Social Lead Capture"
                      }
                    ),
                    " ",
                    "page."
                  ] })
                ]
              }
            ),
            !isLoadingFunnel && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Prospect" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Source" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell text-center", children: "Engaged" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Stage" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Activity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Demo Link" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Trial" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ProspectRow,
                {
                  entry,
                  index: i,
                  onViewTimeline: setSelectedEntry
                },
                entry.id
              )) })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden xl:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequencePerformancePanel, {}) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequencePerformancePanel, {}) }),
        selectedEntry && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "fixed inset-0 z-40 bg-black/50 cursor-default",
              onClick: () => setSelectedEntry(null),
              onKeyDown: (e) => {
                if (e.key === "Escape") setSelectedEntry(null);
              },
              "aria-label": "Close timeline"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProspectTimeline,
            {
              entry: selectedEntry,
              onClose: () => setSelectedEntry(null),
              onRemove: handleRemove
            }
          )
        ] })
      ]
    }
  );
}
export {
  SocialDemoFunnelPage as default
};
