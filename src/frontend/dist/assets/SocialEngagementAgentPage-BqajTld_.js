import { r as reactExports, j as jsxRuntimeExports, bv as Primitive, J as createContextScope, bw as useCallbackRef, bx as useLayoutEffect2, N as cn, by as useApp, B as Button, a_ as Settings, as as Badge, aE as Pause, bd as Play, aQ as ue, at as Card, au as CardContent, bz as ShieldAlert, b8 as MessageSquare, aA as CircleCheck, i as Clock, C as ChartColumn, bh as Tabs, bi as TabsList, bj as TabsTrigger, d as TriangleAlert, ab as History, al as RefreshCw, bk as TabsContent, aw as Skeleton, ay as CardHeader, az as CardTitle, aa as ExternalLink, bA as Bell, bB as SlidersVertical, aN as Switch, bo as Flame, af as Zap, e as ChevronUp, f as ChevronDown, ai as Sparkles, bC as Pen, g as Textarea, l as LoaderCircle, ak as CircleX, bD as Flag, bE as Heart, aT as Progress, T as TrendingUp } from "./index-CSMRpKtY.js";
import { S as Separator } from "./separator-Dw-2WKRb.js";
import { u as useSocialMedia } from "./useSocialMedia-BckRJjjf.js";
var AVATAR_NAME = "Avatar";
var [createAvatarContext] = createContextScope(AVATAR_NAME);
var STATIC_IMAGE_COUNT_STATE = [
  0,
  () => void 0
];
var [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);
var Avatar$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAvatar, ...avatarProps } = props;
    const [imageLoadingStatus, setImageLoadingStatus] = reactExports.useState("idle");
    const [imageCount, setImageCount] = useImageCount();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AvatarProvider,
      {
        scope: __scopeAvatar,
        imageLoadingStatus,
        setImageLoadingStatus,
        imageCount,
        setImageCount,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { ...avatarProps, ref: forwardedRef })
      }
    );
  }
);
Avatar$1.displayName = AVATAR_NAME;
var IMAGE_NAME = "AvatarImage";
var AvatarImage = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAvatar, src, onLoadingStatusChange, ...imageProps } = props;
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
    useUpdateImageCount(context.setImageCount);
    const imageLoadingStatus = useImageLoadingStatus(src, {
      referrerPolicy: imageProps.referrerPolicy,
      crossOrigin: imageProps.crossOrigin,
      loadingStatus: context.imageLoadingStatus,
      setLoadingStatus: context.setImageLoadingStatus
    });
    const handleLoadingStatusChange = useCallbackRef((status) => {
      onLoadingStatusChange == null ? void 0 : onLoadingStatusChange(status);
    });
    const loadingStatusRef = reactExports.useRef(imageLoadingStatus);
    useLayoutEffect2(() => {
      const previousLoadingStatus = loadingStatusRef.current;
      loadingStatusRef.current = imageLoadingStatus;
      if (imageLoadingStatus !== previousLoadingStatus) {
        handleLoadingStatusChange(imageLoadingStatus);
      }
    }, [imageLoadingStatus, handleLoadingStatusChange]);
    return imageLoadingStatus === "loaded" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.img, { ...imageProps, ref: forwardedRef, src }) : null;
  }
);
AvatarImage.displayName = IMAGE_NAME;
var FALLBACK_NAME = "AvatarFallback";
var AvatarFallback$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAvatar, delayMs, ...fallbackProps } = props;
    const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
    const [canRender, setCanRender] = reactExports.useState(delayMs === void 0);
    reactExports.useEffect(() => {
      if (delayMs !== void 0) {
        const timerId = window.setTimeout(() => setCanRender(true), delayMs);
        return () => window.clearTimeout(timerId);
      }
    }, [delayMs]);
    return canRender && context.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { ...fallbackProps, ref: forwardedRef }) : null;
  }
);
AvatarFallback$1.displayName = FALLBACK_NAME;
function useImageLoadingStatus(src, {
  loadingStatus,
  setLoadingStatus,
  referrerPolicy,
  crossOrigin
}) {
  useLayoutEffect2(() => {
    if (!src) {
      setLoadingStatus("error");
      return;
    }
    const image = new window.Image();
    const handleLoad = (event) => {
      const image2 = event.currentTarget;
      setLoadingStatus(getImageLoadingStatus(image2));
    };
    const handleError = () => setLoadingStatus("error");
    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);
    if (referrerPolicy) {
      image.referrerPolicy = referrerPolicy;
    }
    image.crossOrigin = crossOrigin ?? null;
    image.src = src;
    setLoadingStatus(getImageLoadingStatus(image));
    return () => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
      setLoadingStatus("idle");
    };
  }, [src, crossOrigin, referrerPolicy, setLoadingStatus]);
  return loadingStatus;
}
function getImageLoadingStatus(image) {
  return image.complete ? image.naturalWidth > 0 ? "loaded" : "error" : "loading";
}
function useImageCount() {
  let state = STATIC_IMAGE_COUNT_STATE;
  {
    state = reactExports.useState(0);
    const [imageCount] = state;
    const hasWarnedRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      if (imageCount > 1 && !hasWarnedRef.current) {
        hasWarnedRef.current = true;
        console.warn(
          "Avatar: Only one `Avatar.Image` component should be rendered per `Avatar.Root`, but multiple were detected. This will lead to unexpected behavior."
        );
      }
    }, [imageCount]);
  }
  return state;
}
function useUpdateImageCount(setImageCount) {
  {
    reactExports.useEffect(() => {
      setImageCount((imageCount) => imageCount + 1);
      return () => {
        setImageCount((imageCount) => imageCount - 1);
      };
    }, [setImageCount]);
  }
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Avatar$1,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AvatarFallback$1,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
const PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  google_business: "Google",
  tiktok: "TikTok"
};
const PLATFORM_COLORS = {
  facebook: "platform-facebook",
  instagram: "platform-instagram",
  linkedin: "badge-blue",
  google_business: "badge-rose",
  tiktok: "badge-purple"
};
const INTENT_META = {
  purchase_intent: {
    label: "Purchase Intent",
    className: "engagement-intent-purchase"
  },
  question: { label: "Question", className: "engagement-intent-question" },
  complaint: { label: "Complaint", className: "engagement-intent-complaint" },
  competitor_mention: { label: "Competitor", className: "badge-amber" },
  community_love: { label: "Community Love", className: "badge-emerald" },
  spam: { label: "Spam", className: "badge-rose" },
  neutral: { label: "Neutral", className: "status-draft" }
};
const NICHE_TEMPLATES = {
  plumbing: [
    {
      label: "Emergency availability",
      template: "Great question! We offer same-day emergency service across [City]. Call us at [phone] — we're available 24/7 and can usually be there within the hour."
    },
    {
      label: "Free estimate offer",
      template: "Thanks for reaching out! We offer free on-site estimates with no obligation. What's the best time for us to come take a look? You can also book online at [link]."
    },
    {
      label: "Pricing inquiry",
      template: "Happy to help with pricing! Every job is different, but we do offer upfront, flat-rate pricing — no surprises. Call us at [phone] or DM us your details for a quick estimate."
    }
  ],
  hvac: [
    {
      label: "Service availability",
      template: "We're booking [season] tune-ups right now and slots are filling fast! Comment your zip code or call [phone] and we'll get you scheduled before the [heat wave / cold snap] hits."
    },
    {
      label: "Emergency AC/Heat",
      template: "So sorry to hear that! We have emergency slots available — call [phone] right now and we'll get a tech out today. No one should be without AC in this heat."
    },
    {
      label: "Energy savings",
      template: "Great question on efficiency! A properly maintained system can cut energy bills by 15–25%. We can do a full efficiency audit on your visit. Book at [link]."
    }
  ],
  med_spa: [
    {
      label: "Consultation inquiry",
      template: "We'd love to help you with that! Our [treatment] specialist can see you this week for a complimentary consultation. DM us or call [phone] to lock in your spot — we have limited availability."
    },
    {
      label: "Results question",
      template: "Results vary by person, but most of our clients see [outcome] within [timeframe]. Book a free consultation and we can walk you through exactly what to expect for your specific goals."
    },
    {
      label: "Pricing inquiry",
      template: "Pricing depends on the treatment area and number of units. We're happy to give you a personalized quote during your free consult — no pressure, just honest answers. DM us to schedule!"
    }
  ],
  roofing: [
    {
      label: "Storm damage",
      template: "After the storm, we're getting a lot of calls! Book your free inspection before the wait grows — we work directly with your insurance and can usually get out within 48 hours. Call [phone] now."
    },
    {
      label: "Free inspection",
      template: "Great news — our inspections are completely free with no obligation. We'll assess the damage honestly, document everything for insurance, and give you a clear repair or replacement recommendation. Call [phone]."
    },
    {
      label: "Insurance question",
      template: "We work with all major insurance companies and handle the claims process for you. Most clients pay little to nothing out-of-pocket. Call [phone] and we'll walk you through exactly how it works."
    }
  ],
  restoration: [
    {
      label: "Emergency response",
      template: "Water damage gets worse every hour — call us at [phone] right now! We mobilize immediately, 24/7, work directly with your insurance, and stop the damage before it gets worse. Don't wait."
    },
    {
      label: "Insurance process",
      template: "We handle the entire insurance process for you — documentation, adjuster meetings, claim filing. Most of our clients pay $0 out of pocket. Call [phone] and we'll walk you through it."
    },
    {
      label: "Mold concern",
      template: "Mold can start growing within 24-48 hours of water damage — act now! Call [phone] for an immediate assessment. We use IICRC-certified remediation and document everything for insurance."
    }
  ],
  default: [
    {
      label: "General inquiry",
      template: "Thanks for reaching out! We'd love to help. Give us a call at [phone] or book online at [link] — we'll get back to you right away."
    },
    {
      label: "Availability",
      template: "We have openings available this week! Call [phone] or visit [link] to book your appointment. We look forward to serving you!"
    },
    {
      label: "Pricing",
      template: "Great question! Pricing depends on your specific needs. Call us at [phone] for a free, no-obligation estimate tailored to your situation."
    }
  ]
};
const DEFAULT_AUTO_RULES = [
  {
    id: "high-confidence-pricing",
    label: "Auto-approve pricing questions",
    description: "Automatically post responses to comments asking about pricing when confidence is high",
    enabled: false,
    conditionLabel: "confidence >",
    threshold: 85
  },
  {
    id: "high-confidence-availability",
    label: "Auto-approve availability questions",
    description: "Automatically post responses to comments asking about scheduling or availability",
    enabled: false,
    conditionLabel: "confidence >",
    threshold: 90
  },
  {
    id: "community-love",
    label: "Auto-approve positive community comments",
    description: "Automatically thank customers for positive mentions and community love",
    enabled: true,
    conditionLabel: "confidence >",
    threshold: 80
  }
];
const MOCK_ACTIVITY = [
  {
    id: "a1",
    type: "posted",
    platform: "facebook",
    authorName: "Mike Torres",
    summary: "Replied to pricing question — 3 likes in first 20 min",
    time: "14 min ago",
    engagement: 3
  },
  {
    id: "a2",
    type: "lead",
    platform: "instagram",
    authorName: "Sarah L.",
    summary: "Comment converted to CRM lead — purchase intent detected",
    time: "1h ago",
    engagement: 0
  },
  {
    id: "a3",
    type: "posted",
    platform: "linkedin",
    authorName: "Construction Group",
    summary: "Replied to request for commercial quote",
    time: "2h ago",
    engagement: 7
  },
  {
    id: "a4",
    type: "replied",
    platform: "google_business",
    authorName: "Anonymous User",
    summary: "Auto-approved community love response",
    time: "3h ago",
    engagement: 2
  },
  {
    id: "a5",
    type: "posted",
    platform: "facebook",
    authorName: "Amanda W.",
    summary: "Replied to storm damage question — booked inspection",
    time: "4h ago",
    engagement: 5
  }
];
function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function computeBrandVoiceScore(text) {
  const words = text.trim().split(/\s+/).length;
  let score = 70;
  if (words >= 15 && words <= 60) score += 15;
  if (text.includes("?")) score += 5;
  if (/[A-Z]{3,}/.test(text)) score -= 10;
  if (text.trim().endsWith("!") && words < 10) score -= 5;
  return Math.max(20, Math.min(100, score));
}
function getTimeSensitivityLabel(createdAt) {
  const hoursSince = (Date.now() - createdAt) / 36e5;
  if (hoursSince < 1)
    return { label: "Reply within 2h for max engagement", urgent: true };
  if (hoursSince < 3)
    return { label: "Reply soon — engagement window closing", urgent: true };
  return { label: "Reply when ready", urgent: false };
}
function PlatformBadge({ platform }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `social-platform-badge ${PLATFORM_COLORS[platform] ?? "badge-purple"}`,
      children: PLATFORM_LABELS[platform] ?? platform
    }
  );
}
function IntentBadge({ intent }) {
  const meta = INTENT_META[intent] ?? {
    label: intent,
    className: "badge-purple"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `engagement-intent-badge ${meta.className}`, children: meta.label });
}
function VoiceScoreMeter({ score }) {
  const color = score >= 80 ? "score-good" : score >= 55 ? "score-warning" : "score-critical";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `text-xs font-semibold tabular-nums ${color}`, children: [
      score,
      "%"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: score, className: "h-1.5 w-16 bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "brand voice" })
  ] });
}
function ConfidenceBadge({ confidence }) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 85 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : pct >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `text-[10px] font-semibold px-1.5 py-0.5 rounded border ${color}`,
      children: [
        pct,
        "% confidence"
      ]
    }
  );
}
function ApprovalCard({
  approval,
  index,
  niche,
  autoRules,
  onApprove,
  onReject,
  onFlag
}) {
  const initial = approval.draftResponse ?? "";
  const [editedResponse, setEditedResponse] = reactExports.useState(
    approval.refinedResponse ?? initial
  );
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [isExpanded, setIsExpanded] = reactExports.useState(true);
  const [showTemplates, setShowTemplates] = reactExports.useState(false);
  const voiceScore = reactExports.useMemo(
    () => computeBrandVoiceScore(editedResponse),
    [editedResponse]
  );
  const timeSensitivity = getTimeSensitivityLabel(approval.createdAt);
  const charMax = 500;
  const charLeft = charMax - editedResponse.length;
  const confidencePct = Math.round(approval.buyingSignalConfidence * 100);
  const isBuyingSignalHigh = approval.buyingSignalDetected && approval.buyingSignalConfidence >= 0.75;
  const nicheKey = niche.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "").replace(/ /g, "_");
  const templates = NICHE_TEMPLATES[nicheKey] ?? NICHE_TEMPLATES.default;
  const handleApprove = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onApprove(approval.id, editedResponse);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleReject = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onReject(approval.id);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleFlag = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onFlag(approval.id);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleUseTemplate = (template) => {
    setEditedResponse(template);
    setIsEditing(false);
    setShowTemplates(false);
    ue.success("Template applied — edit as needed before approving");
  };
  const wouldAutoApprove = autoRules.some(
    (r) => r.enabled && confidencePct >= r.threshold
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      "data-ocid": `social_engagement_agent.item.${index}`,
      className: `bg-card border-border animate-fade-in-up transition-smooth ${isBuyingSignalHigh ? "border-l-4 border-l-orange-500/70" : ""}`,
      style: { animationDelay: `${(index - 1) * 60}ms` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9 shrink-0 bg-accent border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs font-semibold bg-primary/10 text-primary", children: approval.authorName.slice(0, 2).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: approval.authorName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformBadge, { platform: approval.platform }),
                approval.buyingSignalDetected && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs gap-1 bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/15", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3 w-3" }),
                  confidencePct,
                  "% buying signal"
                ] }),
                wouldAutoApprove && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
                  "Auto-rule match"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatRelativeTime(approval.createdAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ConfidenceBadge, { confidence: approval.buyingSignalConfidence }),
                timeSensitivity.urgent && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-semibold text-amber-400 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  timeSensitivity.label
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsExpanded((v) => !v),
              className: "text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5",
              "aria-label": isExpanded ? "Collapse" : "Expand",
              children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
            }
          )
        ] }) }),
        isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-sm text-foreground italic border-l-2 border-primary/40 pl-3 py-0.5", children: [
            "“",
            approval.commentText,
            "”"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              IntentBadge,
              {
                intent: approval.buyingSignalDetected ? "purchase_intent" : "question"
              }
            ),
            approval.suggestedAction && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-primary/90 bg-primary/8 px-2 py-0.5 rounded-md border border-primary/20", children: [
              "💡 ",
              approval.suggestedAction
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowTemplates((v) => !v),
                className: "flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors",
                "data-ocid": `social_engagement_agent.templates_toggle.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
                  "Use niche template",
                  showTemplates ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
                ]
              }
            ),
            showTemplates && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-2 space-y-1.5",
                "data-ocid": `social_engagement_agent.templates_panel.${index}`,
                children: templates.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleUseTemplate(t.template),
                    className: "w-full text-left rounded-lg px-3 py-2 bg-muted/30 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: t.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 line-clamp-2", children: t.template })
                    ]
                  },
                  t.label
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "AI Draft — edit before approving" }),
              !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsEditing(true),
                  className: "text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors",
                  "data-ocid": `social_engagement_agent.edit_button.${index}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
                    "Edit"
                  ]
                }
              )
            ] }),
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: editedResponse,
                  onChange: (e) => {
                    if (e.target.value.length <= charMax)
                      setEditedResponse(e.target.value);
                  },
                  className: "text-sm min-h-[90px] resize-none bg-muted/50 border-border focus:border-primary/60",
                  placeholder: "Edit the AI draft response...",
                  "data-ocid": `social_engagement_agent.response_input.${index}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(VoiceScoreMeter, { score: voiceScore }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `text-xs tabular-nums ${charLeft < 50 ? "text-destructive" : "text-muted-foreground"}`,
                    children: [
                      charLeft,
                      " left"
                    ]
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "engagement-draft-reply text-sm cursor-pointer hover:border-primary/50 transition-colors w-full text-left",
                onClick: () => setIsEditing(true),
                "data-ocid": `social_engagement_agent.draft_preview.${index}`,
                children: editedResponse
              }
            ),
            !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(VoiceScoreMeter, { score: voiceScore })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "engagement-approval-buttons", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: handleApprove,
                disabled: isProcessing || !editedResponse.trim(),
                "data-ocid": `social_engagement_agent.approve_button.${index}`,
                className: "flex-1 gap-1.5 engagement-approve-btn border-0 text-xs",
                children: [
                  isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                  "Approve & Post"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: handleReject,
                disabled: isProcessing,
                "data-ocid": `social_engagement_agent.reject_button.${index}`,
                className: "gap-1.5 text-xs border-border/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
                  "Skip"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: handleFlag,
                disabled: isProcessing,
                "data-ocid": `social_engagement_agent.flag_button.${index}`,
                className: "gap-1.5 text-xs text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
                  "Flag"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function FlaggedCard({
  approval,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      "data-ocid": `social_engagement_agent.flagged.item.${index}`,
      className: "bg-card border-yellow-500/20 border-l-4 border-l-yellow-500/60 animate-slide-in-left",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-yellow-500 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1.5 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: approval.authorName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformBadge, { platform: approval.platform }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-xs border-yellow-500/40 text-yellow-400 gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3 w-3" }),
                  "Flagged for review"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground italic", children: [
            "“",
            approval.commentText,
            "”"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-yellow-400/80", children: "High-sensitivity content requiring manual review" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: formatRelativeTime(approval.resolvedAt ?? approval.createdAt) })
      ] }) })
    }
  );
}
function HistoryRow({
  approval,
  index
}) {
  const isApproved = approval.status === "approved";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": `social_engagement_agent.history.item.${index}`,
      className: "py-3 px-4 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `mt-0.5 h-2 w-2 rounded-full shrink-0 ${isApproved ? "bg-emerald-500" : "bg-muted-foreground"}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: approval.authorName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformBadge, { platform: approval.platform }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: isApproved ? "default" : "secondary",
                  className: `text-xs capitalize ${isApproved ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15" : ""}`,
                  children: approval.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground italic truncate", children: [
              "“",
              approval.commentText,
              "”"
            ] }),
            isApproved && (approval.refinedResponse ?? approval.draftResponse) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/70 truncate", children: [
              "↳ ",
              approval.refinedResponse ?? approval.draftResponse
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0 space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatRelativeTime(approval.resolvedAt ?? approval.createdAt) }),
          approval.buyingSignalDetected && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs gap-1 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-2.5 w-2.5" }),
            Math.round(approval.buyingSignalConfidence * 100),
            "%"
          ] })
        ] })
      ] })
    }
  );
}
function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  accentClass = "text-primary"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `shrink-0 ${accentClass}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground tabular-nums", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: sub })
    ] })
  ] });
}
function ActivityFeed({ entries }) {
  const iconMap = {
    posted: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-400" }),
    scheduled: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-blue-400" }),
    replied: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5 text-primary" }),
    lead: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-amber-400" })
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: entries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start gap-2.5 py-2 border-b border-border/30 last:border-0",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 shrink-0", children: iconMap[entry.type] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: entry.authorName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground leading-snug mt-0.5", children: entry.summary })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: entry.time }),
          entry.engagement !== void 0 && entry.engagement > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-2.5 w-2.5" }),
            entry.engagement
          ] })
        ] })
      ]
    },
    entry.id
  )) });
}
function AutoRulesPanel({
  rules,
  onChange
}) {
  const toggleRule = (id) => {
    onChange(
      rules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      ue.success(
        rule.enabled ? `Auto-rule disabled: ${rule.label}` : `Auto-rule enabled: ${rule.label}`
      );
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-3",
      "data-ocid": "social_engagement_agent.auto_rules_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Auto-Approval Rules" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
          "When a rule is enabled, responses meeting the confidence threshold are automatically posted without requiring manual approval.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: " Use with caution." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: rules.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `rounded-xl p-3 border transition-all ${rule.enabled ? "bg-primary/5 border-primary/25" : "bg-muted/20 border-border/50"}`,
            "data-ocid": `social_engagement_agent.auto_rule.${rule.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: rule.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-snug", children: rule.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-primary/80 mt-1", children: [
                  "Trigger: ",
                  rule.conditionLabel,
                  " ",
                  rule.threshold,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: rule.enabled,
                  onCheckedChange: () => toggleRule(rule.id),
                  "data-ocid": `social_engagement_agent.auto_rule.${rule.id}.toggle`
                }
              )
            ] })
          },
          rule.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl p-3 bg-amber-500/5 border border-amber-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-300 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }),
          "Auto-approved responses still appear in your activity feed. Review your feed regularly to ensure brand voice quality."
        ] }) })
      ]
    }
  );
}
function SocialEngagementAgentPage() {
  const {
    engagementApprovals,
    getEngagementApprovals,
    approveEngagement,
    rejectEngagement,
    flagEngagement,
    isLoadingApprovals
  } = useSocialMedia();
  const [isMonitoringActive, setIsMonitoringActive] = reactExports.useState(true);
  const [platformFilter, setPlatformFilter] = reactExports.useState("all");
  const [activeTab, setActiveTab] = reactExports.useState("queue");
  const [isRefreshing, setIsRefreshing] = reactExports.useState(false);
  const [autoRules, setAutoRules] = reactExports.useState(DEFAULT_AUTO_RULES);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const { demoInfo } = useApp();
  const niche = (demoInfo == null ? void 0 : demoInfo.niche) ?? "plumbing";
  reactExports.useEffect(() => {
    void getEngagementApprovals("tenant-1");
  }, []);
  const pending = reactExports.useMemo(
    () => engagementApprovals.filter(
      (a) => a.status === "pending" && (platformFilter === "all" || a.platform === platformFilter)
    ).sort((a, b) => {
      if (a.buyingSignalDetected !== b.buyingSignalDetected)
        return a.buyingSignalDetected ? -1 : 1;
      return b.createdAt - a.createdAt;
    }),
    [engagementApprovals, platformFilter]
  );
  const flagged = reactExports.useMemo(
    () => engagementApprovals.filter(
      (a) => a.status === "flagged" && (platformFilter === "all" || a.platform === platformFilter)
    ).sort((a, b) => b.createdAt - a.createdAt),
    [engagementApprovals, platformFilter]
  );
  const history = reactExports.useMemo(
    () => engagementApprovals.filter(
      (a) => (a.status === "approved" || a.status === "rejected") && (platformFilter === "all" || a.platform === platformFilter)
    ).sort(
      (a, b) => (b.resolvedAt ?? b.createdAt) - (a.resolvedAt ?? a.createdAt)
    ),
    [engagementApprovals, platformFilter]
  );
  const stats = reactExports.useMemo(() => {
    const todayStart = (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
    const todayApprovals = engagementApprovals.filter(
      (a) => a.status === "approved" && (a.resolvedAt ?? 0) >= todayStart
    );
    const avgResponseMs = todayApprovals.length > 0 ? todayApprovals.reduce(
      (sum, a) => sum + ((a.resolvedAt ?? a.createdAt) - a.createdAt),
      0
    ) / todayApprovals.length : 0;
    const avgMins = Math.round(avgResponseMs / 6e4);
    const pendingAllPlatforms = engagementApprovals.filter(
      (a) => a.status === "pending"
    ).length;
    const avgBrandVoice = engagementApprovals.filter((a) => a.status === "approved").length > 0 ? Math.round(
      engagementApprovals.filter((a) => a.status === "approved").reduce(
        (sum, a) => sum + computeBrandVoiceScore(a.refinedResponse ?? a.draftResponse),
        0
      ) / engagementApprovals.filter((a) => a.status === "approved").length
    ) : 0;
    const autoApprovedToday = autoRules.filter((r) => r.enabled).length;
    return {
      todayQueue: pendingAllPlatforms,
      approvedToday: todayApprovals.length,
      avgResponseTime: avgMins > 0 ? `${avgMins}m` : "—",
      avgVoiceScore: avgBrandVoice > 0 ? `${avgBrandVoice}%` : "—",
      autoApproved: autoApprovedToday
    };
  }, [engagementApprovals, autoRules]);
  const activePlatforms = reactExports.useMemo(
    () => Array.from(
      new Set(engagementApprovals.map((a) => a.platform))
    ),
    [engagementApprovals]
  );
  const handleBatchApprove = async () => {
    let count = 0;
    for (const approval of pending) {
      await approveEngagement(
        approval.id,
        approval.refinedResponse ?? approval.draftResponse
      );
      count++;
    }
    ue.success(`${count} responses approved and posted ✓`);
  };
  const handleApprove = async (id, response) => {
    await approveEngagement(id, response);
    ue.success("Response approved and posted ✓", { duration: 4e3 });
  };
  const handleReject = async (id) => {
    await rejectEngagement(id);
    ue.info("Response skipped");
  };
  const handleFlag = async (id) => {
    await flagEngagement(id, "Flagged for manual review");
    ue.warning("Comment flagged for review");
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getEngagementApprovals("tenant-1");
    setIsRefreshing(false);
    ue.success("Queue refreshed");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_engagement_agent.page",
      className: "space-y-5 p-4 md:p-6 max-w-5xl mx-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground tracking-tight", children: "Auto-Engagement Agent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "AI drafts replies in your brand voice — you approve every post. Nothing publishes without your click." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => setShowSettings((v) => !v),
                "data-ocid": "social_engagement_agent.settings_toggle",
                className: "gap-1.5 text-xs border-border/60",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3 w-3" }),
                  "Auto-Rules",
                  autoRules.filter((r) => r.enabled).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-0.5 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground", children: autoRules.filter((r) => r.enabled).length })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-2 w-2 rounded-full ${isMonitoringActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => {
                  setIsMonitoringActive((v) => !v);
                  ue.info(
                    isMonitoringActive ? "Monitoring paused" : "Monitoring resumed"
                  );
                },
                "data-ocid": "social_engagement_agent.monitoring_toggle",
                className: "gap-1.5 text-xs border-border/60",
                children: isMonitoringActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-3 w-3" }),
                  "Active"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" }),
                  "Paused"
                ] })
              }
            )
          ] })
        ] }),
        showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AutoRulesPanel, { rules: autoRules, onChange: setAutoRules }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/8 border border-primary/20 rounded-lg px-4 py-2.5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-primary/90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Human approval required:" }),
            ' Every response requires your explicit click on "Approve & Post".',
            autoRules.filter((r) => r.enabled).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-400 ml-1", children: [
              autoRules.filter((r) => r.enabled).length,
              " auto-rule",
              autoRules.filter((r) => r.enabled).length !== 1 ? "s" : "",
              " ",
              "active."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "social_engagement_agent.stats",
                className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatTile,
                    {
                      icon: MessageSquare,
                      label: "Today's queue",
                      value: stats.todayQueue,
                      accentClass: "text-primary"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatTile,
                    {
                      icon: CircleCheck,
                      label: "Approved today",
                      value: stats.approvedToday,
                      accentClass: "text-emerald-500"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatTile,
                    {
                      icon: Clock,
                      label: "Avg response",
                      value: stats.avgResponseTime,
                      accentClass: "text-blue-400"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    StatTile,
                    {
                      icon: ChartColumn,
                      label: "Brand voice avg",
                      value: stats.avgVoiceScore,
                      accentClass: "text-purple-400"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex gap-2 flex-wrap",
                "data-ocid": "social_engagement_agent.platform_filter",
                children: ["all", ...activePlatforms].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setPlatformFilter(p),
                    "data-ocid": `social_engagement_agent.filter.${p}`,
                    className: `px-3 py-1.5 rounded-full text-xs font-medium transition-smooth border ${platformFilter === p ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted hover:text-foreground"}`,
                    children: p === "all" ? "All Platforms" : PLATFORM_LABELS[p] ?? p
                  },
                  p
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Tabs,
              {
                value: activeTab,
                onValueChange: setActiveTab,
                "data-ocid": "social_engagement_agent.tabs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/50 border border-border/40 h-9", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        TabsTrigger,
                        {
                          value: "queue",
                          "data-ocid": "social_engagement_agent.tab.queue",
                          className: "text-xs gap-1.5 data-[state=active]:bg-card",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
                            "Approval Queue",
                            pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground", children: pending.length })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        TabsTrigger,
                        {
                          value: "flagged",
                          "data-ocid": "social_engagement_agent.tab.flagged",
                          className: "text-xs gap-1.5 data-[state=active]:bg-card",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-yellow-500" }),
                            "Flagged",
                            flagged.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-yellow-500/80 text-foreground", children: flagged.length })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        TabsTrigger,
                        {
                          value: "history",
                          "data-ocid": "social_engagement_agent.tab.history",
                          className: "text-xs gap-1.5 data-[state=active]:bg-card",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3.5 w-3.5" }),
                            "History"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      pending.length > 1 && activeTab === "queue" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          onClick: handleBatchApprove,
                          "data-ocid": "social_engagement_agent.batch_approve_button",
                          className: "text-xs gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 h-9",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                            "Approve All (",
                            pending.length,
                            ")"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          onClick: handleRefresh,
                          disabled: isRefreshing || isLoadingApprovals,
                          "data-ocid": "social_engagement_agent.refresh_button",
                          className: "text-xs gap-1.5 text-muted-foreground h-9",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              RefreshCw,
                              {
                                className: `h-3.5 w-3.5 ${isRefreshing || isLoadingApprovals ? "animate-spin" : ""}`
                              }
                            ),
                            "Refresh"
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "queue", className: "mt-4 space-y-3", children: [
                    isLoadingApprovals && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        "data-ocid": "social_engagement_agent.loading_state",
                        className: "space-y-3",
                        children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-lg" }, i))
                      }
                    ),
                    !isLoadingApprovals && pending.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "social_engagement_agent.empty_state",
                        className: "text-center py-16 text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block mb-4", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-12 w-12 opacity-20 mx-auto" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground/70", children: "No pending responses" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm mt-1", children: [
                            "Monitoring is",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-medium", children: "active" }),
                            " ",
                            "— new comments appear here automatically"
                          ] })
                        ]
                      }
                    ),
                    !isLoadingApprovals && pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        pending.length,
                        " comment",
                        pending.length !== 1 ? "s" : "",
                        " ",
                        "waiting · Buying signals shown first"
                      ] }),
                      pending.map((approval, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ApprovalCard,
                        {
                          approval,
                          index: i + 1,
                          niche,
                          autoRules,
                          onApprove: handleApprove,
                          onReject: handleReject,
                          onFlag: handleFlag
                        },
                        approval.id
                      ))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "flagged", className: "mt-4 space-y-3", children: [
                    flagged.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "social_engagement_agent.flagged.empty_state",
                        className: "text-center py-14 text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-10 w-10 opacity-20 mx-auto mb-3" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground/70", children: "No flagged comments" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Comments escalated for manual review will appear here" })
                        ]
                      }
                    ),
                    flagged.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-yellow-500" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                          flagged.length,
                          " comment",
                          flagged.length !== 1 ? "s" : "",
                          " ",
                          "flagged for escalation"
                        ] })
                      ] }),
                      flagged.map((approval, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FlaggedCard,
                        {
                          approval,
                          index: i + 1
                        },
                        approval.id
                      ))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "history", className: "mt-4", children: [
                    history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "social_engagement_agent.history.empty_state",
                        className: "text-center py-14 text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-10 w-10 opacity-20 mx-auto mb-3" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground/70", children: "No response history yet" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: "Approved and skipped responses will appear here" })
                        ]
                      }
                    ),
                    history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border overflow-hidden", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-3 px-4 border-b border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-muted-foreground" }),
                        "Response History",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
                          history.length,
                          " total"
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: history.map((approval, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        HistoryRow,
                        {
                          approval,
                          index: i + 1
                        },
                        approval.id
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border/40 flex items-center gap-4 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-emerald-500" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Posted" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-muted-foreground" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Skipped" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "a",
                          {
                            href: "https://bookedrankedfunded.org/social-roi",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors ml-auto",
                            children: [
                              "View full analytics ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
                            ]
                          }
                        )
                      ] })
                    ] })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                className: "bg-card border-border",
                "data-ocid": "social_engagement_agent.activity_feed",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-primary" }),
                    "Activity Feed",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground", children: "Today" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityFeed, { entries: MOCK_ACTIVITY }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "h-4 w-4 text-primary" }),
                "This Week"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: [
                {
                  label: "Responses posted",
                  value: 34,
                  color: "text-emerald-400"
                },
                {
                  label: "Leads from comments",
                  value: 8,
                  color: "text-amber-400"
                },
                {
                  label: "Avg engagement/reply",
                  value: "4.2",
                  color: "text-primary"
                },
                {
                  label: "Auto-approved",
                  value: autoRules.filter((r) => r.enabled).length > 0 ? 6 : 0,
                  color: "text-blue-400"
                }
              ].map(({ label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-bold ${color}`, children: value })
              ] }, label)) })
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  SocialEngagementAgentPage as default
};
