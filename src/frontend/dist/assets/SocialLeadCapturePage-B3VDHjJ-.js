import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ak as Sparkles, B as Button, an as RefreshCw, ba as Activity, bk as Flame, T as TrendingUp, C as ChartColumn, ay as Skeleton, au as Badge, bO as AnimatePresence, U as Users, av as Card, aA as CardHeader, aB as CardTitle, aw as CardContent, aS as ue, bN as ArrowRight, ah as Zap, by as MessageSquare, bP as MessageCircle, bQ as motion, bR as Link2, am as CircleX, aC as CircleCheck, X, L as Label, I as Input, g as Textarea, f as ChevronDown, e as ChevronUp } from "./index-CI0aYo5Z.js";
import { u as useSocialMedia } from "./useSocialMedia-CPSV1Ljj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
const PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  google_business: "Google"
};
const PLATFORM_COLORS = {
  facebook: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  instagram: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  linkedin: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  tiktok: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  google_business: "bg-amber-500/15 text-amber-400 border-amber-500/30"
};
const SIGNAL_TYPE_CONFIG = {
  comment: {
    icon: MessageCircle,
    label: "Comment",
    color: "text-blue-400",
    points: 1
  },
  dm: { icon: MessageSquare, label: "DM", color: "text-purple-400", points: 3 },
  form_fill: {
    icon: Zap,
    label: "Form Fill",
    color: "text-amber-400",
    points: 4
  },
  reply: {
    icon: ArrowRight,
    label: "Reply Chain",
    color: "text-emerald-400",
    points: 2
  }
};
function inferSignalType(lead) {
  var _a;
  const t = ((_a = lead.source.triggerText) == null ? void 0 : _a.toLowerCase()) ?? "";
  if (t.includes("dm") || t.includes("message")) return "dm";
  if (t.includes("form") || t.includes("fill") || t.includes("inquiry"))
    return "form_fill";
  if (lead.source.commentId && lead.source.postId) return "comment";
  return "comment";
}
function getEngagementDepth(type) {
  return SIGNAL_TYPE_CONFIG[type].points;
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function getConfidenceConfig(c) {
  if (c >= 0.9)
    return {
      label: "🔥 Hot",
      className: "bg-rose-500/20 text-rose-300 border-rose-500/40"
    };
  if (c >= 0.75)
    return {
      label: "🌡 Warm",
      className: "bg-amber-500/20 text-amber-300 border-amber-500/40"
    };
  return {
    label: "❄ Cool",
    className: "bg-sky-500/20 text-sky-300 border-sky-500/40"
  };
}
function getStatusConfig(status) {
  const map = {
    new: {
      label: "New",
      className: "bg-primary/20 text-primary border-primary/40"
    },
    contacted: {
      label: "Contacted",
      className: "bg-amber-500/20 text-amber-300 border-amber-500/30"
    },
    qualified: {
      label: "Qualified",
      className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    },
    converted: {
      label: "Converted",
      className: "bg-green-500/20 text-green-300 border-green-500/30"
    },
    lost: {
      label: "Lost",
      className: "bg-muted text-muted-foreground border-border"
    }
  };
  return map[status] ?? map.new;
}
const RICH_DEMO_SIGNALS = [
  {
    id: "sl-demo-1",
    tenantId: "tenant-1",
    name: "James Robertson",
    contactInfo: "james.robertson@gmail.com",
    source: {
      platform: "facebook",
      postId: "sp-1",
      commentId: "c-101",
      triggerText: "How much to replace water heater"
    },
    buyingSignalText: "How much does it usually cost to replace a water heater? Mine is 12 years old and acting up.",
    confidence: 0.94,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Expressed cost intent, water heater 12 years old",
    createdAt: Date.now() - 9e5,
    updatedAt: Date.now() - 9e5
  },
  {
    id: "sl-demo-2",
    tenantId: "tenant-1",
    name: "Maria Chen",
    contactInfo: "maria.chen@yahoo.com",
    source: {
      platform: "instagram",
      postId: "sp-2",
      commentId: "c-102",
      triggerText: "Same-day service availability"
    },
    buyingSignalText: "Do you guys do same-day service? My kitchen drain is completely backed up right now 😩",
    confidence: 0.91,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Emergency drain issue, high urgency",
    createdAt: Date.now() - 18e5,
    updatedAt: Date.now() - 18e5
  },
  {
    id: "sl-demo-3",
    tenantId: "tenant-1",
    name: "David Park",
    contactInfo: "d.park@protonmail.com",
    source: {
      platform: "facebook",
      postId: "sp-3",
      commentId: null,
      triggerText: "form inquiry — free estimate"
    },
    buyingSignalText: "Submitted free estimate form. Needs full bathroom remodel plumbing — 3BR home in San Diego.",
    confidence: 0.97,
    status: "contacted",
    crmLeadId: "crm-lead-004",
    linkedToCrm: true,
    notes: "High-value bathroom remodel job",
    createdAt: Date.now() - 36e5,
    updatedAt: Date.now() - 12e5
  },
  {
    id: "sl-demo-4",
    tenantId: "tenant-1",
    name: "Keisha Williams",
    contactInfo: "kwilliams@outlook.com",
    source: {
      platform: "google_business",
      postId: null,
      commentId: "c-104",
      triggerText: "price comparison question"
    },
    buyingSignalText: "How do your prices compare? Got one quote already but it seemed high. Looking for a second opinion.",
    confidence: 0.82,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Price shopping, warm lead",
    createdAt: Date.now() - 54e5,
    updatedAt: Date.now() - 54e5
  },
  {
    id: "sl-demo-5",
    tenantId: "tenant-1",
    name: "Tom Nguyen",
    contactInfo: "tom.n@icloud.com",
    source: {
      platform: "linkedin",
      postId: "sp-5",
      commentId: "c-105",
      triggerText: "dm — looking for contractor referral"
    },
    buyingSignalText: "Hey, I saw your post — do you work in the Chula Vista area? I manage 4 rental properties and need a reliable plumber on call.",
    confidence: 0.88,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Property manager, high-LTV recurring potential",
    createdAt: Date.now() - 72e5,
    updatedAt: Date.now() - 72e5
  },
  {
    id: "sl-demo-6",
    tenantId: "tenant-1",
    name: "Sandra Ortega",
    contactInfo: "s.ortega@email.com",
    source: {
      platform: "facebook",
      postId: "sp-1",
      commentId: "c-106",
      triggerText: "leak emergency"
    },
    buyingSignalText: "We have water coming through the ceiling from upstairs bathroom. How fast can you get here?",
    confidence: 0.99,
    status: "qualified",
    crmLeadId: "crm-lead-007",
    linkedToCrm: true,
    notes: "Emergency leak — fast close required",
    createdAt: Date.now() - 9e6,
    updatedAt: Date.now() - 8e6
  },
  {
    id: "sl-demo-7",
    tenantId: "tenant-1",
    name: "Brian Kastner",
    contactInfo: "bkastner@gmail.com",
    source: {
      platform: "instagram",
      postId: "sp-7",
      commentId: "c-107",
      triggerText: "follow-up on comment reply"
    },
    buyingSignalText: "Thanks for responding! I replied to your earlier comment. Can we set up a time this week?",
    confidence: 0.79,
    status: "new",
    crmLeadId: null,
    linkedToCrm: false,
    notes: "Engaged twice — warm via reply chain",
    createdAt: Date.now() - 126e5,
    updatedAt: Date.now() - 126e5
  }
];
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold font-display ${accent}`, children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-0.5", children: sub })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-card border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${accent}` }) })
  ] }) }) });
}
function DepthIndicator({ depth }) {
  var _a, _b;
  const config = [
    { threshold: 1, label: "1pt", title: "Comment" },
    { threshold: 2, label: "2pt", title: "Reply chain" },
    { threshold: 3, label: "3pt", title: "DM" },
    { threshold: 4, label: "4pt", title: "Form fill" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-1",
      title: `Engagement depth: ${((_a = config[depth - 1]) == null ? void 0 : _a.title) ?? "unknown"}`,
      children: [
        [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-1.5 w-4 rounded-full transition-colors ${i <= depth ? "bg-primary" : "bg-muted"}`
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-1", children: (_b = config[depth - 1]) == null ? void 0 : _b.label })
      ]
    }
  );
}
function PlatformBadge({ platform }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${PLATFORM_COLORS[platform]}`,
      children: PLATFORM_LABELS[platform]
    }
  );
}
function SignalCard({
  lead,
  index,
  isHot,
  onAddToCRM,
  onDismiss
}) {
  const conf = getConfidenceConfig(lead.confidence);
  const status = getStatusConfig(lead.status);
  const signalType = inferSignalType(lead);
  const SignalIcon = SIGNAL_TYPE_CONFIG[signalType].icon;
  const depth = getEngagementDepth(signalType);
  const attribution = `${PLATFORM_LABELS[lead.source.platform]}_Post_${lead.source.postId ?? "direct"}`;
  const pct = Math.round(lead.confidence * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      transition: { duration: 0.22, delay: index * 0.05 },
      "data-ocid": `social_lead_capture.item.${index + 1}`,
      className: `relative rounded-xl border p-4 transition-colors ${isHot ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10" : "border-border bg-card hover:bg-muted/10"}`,
      children: [
        isHot && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-emerald-400 animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold text-primary", children: (lead.name || "?")[0].toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap pr-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: lead.name || "Anonymous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformBadge, { platform: lead.source.platform }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${conf.className}`,
                  children: [
                    conf.label,
                    " · ",
                    pct,
                    "%"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${status.className}`,
                  children: status.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground shrink-0", children: timeAgo(lead.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SignalIcon,
                {
                  className: `h-3.5 w-3.5 ${SIGNAL_TYPE_CONFIG[signalType].color}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: SIGNAL_TYPE_CONFIG[signalType].color, children: SIGNAL_TYPE_CONFIG[signalType].label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DepthIndicator, { depth })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "text-sm text-foreground/80 italic border-l-2 border-primary/30 pl-3 leading-relaxed", children: [
              '"',
              lead.buyingSignalText,
              '"'
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/40 px-2 py-0.5 rounded font-mono", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }),
                attribution
              ] }),
              lead.contactInfo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: lead.contactInfo })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 pt-1", children: !lead.linkedToCrm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "default",
                  onClick: () => onAddToCRM(lead),
                  "data-ocid": `social_lead_capture.add_crm_button.${index + 1}`,
                  className: "gap-1.5 h-7 text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3" }),
                    "Add to CRM"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => onDismiss(lead.id),
                  "data-ocid": `social_lead_capture.dismiss_button.${index + 1}`,
                  className: "gap-1.5 h-7 text-xs text-muted-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                    "Dismiss"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                  "In CRM"
                ]
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
function CRMSlidePanel({ lead, onClose, onConfirm }) {
  const [name, setName] = reactExports.useState((lead == null ? void 0 : lead.name) ?? "");
  const [notes, setNotes] = reactExports.useState((lead == null ? void 0 : lead.buyingSignalText) ?? "");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (lead) {
      setName(lead.name ?? "");
      setNotes(lead.buyingSignalText ?? "");
    }
  }, [lead]);
  const handleSubmit = async () => {
    if (!lead) return;
    setBusy(true);
    try {
      await onConfirm(lead, name, notes);
    } finally {
      setBusy(false);
    }
  };
  if (!lead) return null;
  const signalType = inferSignalType(lead);
  const attribution = `${PLATFORM_LABELS[lead.source.platform]}_Post_${lead.source.postId ?? "direct"}`;
  const nicheGuess = lead.notes.toLowerCase().includes("bath") ? "Plumbing / Bathroom" : lead.notes.toLowerCase().includes("drain") ? "Plumbing / Drain" : lead.notes.toLowerCase().includes("rental") ? "Property Management" : "Plumbing";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: lead && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        onClick: onClose,
        className: "fixed inset-0 bg-background/60 backdrop-blur-sm z-40",
        "data-ocid": "social_lead_capture.dialog"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "spring", stiffness: 320, damping: 35 },
        className: "fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col",
        "data-ocid": "social_lead_capture.modal",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: "Create CRM Lead" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Pre-filled from social signal" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: onClose,
                "data-ocid": "social_lead_capture.close_button",
                className: "h-8 w-8",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-primary uppercase tracking-wide", children: "Detected signal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground italic", children: [
                '"',
                lead.buyingSignalText,
                '"'
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformBadge, { platform: lead.source.platform }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: SIGNAL_TYPE_CONFIG[signalType].label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  Math.round(lead.confidence * 100),
                  "% confidence"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "crm-name", className: "text-xs", children: "Contact Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "crm-name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    placeholder: "Full name",
                    "data-ocid": "social_lead_capture.crm_name_input",
                    className: "bg-background"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "crm-contact", className: "text-xs", children: "Contact Info" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "crm-contact",
                    defaultValue: lead.contactInfo,
                    readOnly: true,
                    className: "bg-muted/40 text-muted-foreground",
                    "data-ocid": "social_lead_capture.crm_contact_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "crm-source", className: "text-xs", children: "Source Attribution" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "crm-source",
                    value: attribution,
                    readOnly: true,
                    className: "bg-muted/40 text-muted-foreground font-mono text-xs",
                    "data-ocid": "social_lead_capture.crm_source_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "crm-niche", className: "text-xs", children: "Niche (auto-detected)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "crm-niche",
                    value: nicheGuess,
                    readOnly: true,
                    className: "bg-muted/40 text-muted-foreground",
                    "data-ocid": "social_lead_capture.crm_niche_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "crm-notes", className: "text-xs", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "crm-notes",
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    rows: 3,
                    className: "bg-background resize-none",
                    "data-ocid": "social_lead_capture.crm_notes_textarea"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-border bg-card flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: onClose,
                className: "flex-1",
                "data-ocid": "social_lead_capture.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: handleSubmit,
                disabled: busy || !name.trim(),
                className: "flex-1 gap-2",
                "data-ocid": "social_lead_capture.confirm_button",
                children: [
                  busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5" }),
                  "Create Lead"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] }) });
}
function LeadsTable({
  leads,
  onAddToCRM
}) {
  const [sortField, setSortField] = reactExports.useState(
    "createdAt"
  );
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const sorted = reactExports.useMemo(() => {
    return [...leads].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [leads, sortField, sortDir]);
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => d === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };
  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-muted-foreground/40" });
    return sortDir === "desc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 text-primary" });
  };
  if (leads.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto rounded-lg border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "hidden md:table w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground", children: "Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground", children: "Signal type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer select-none",
            onClick: () => toggleSort("confidence"),
            children: [
              "Confidence ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { field: "confidence" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-medium text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer select-none",
            onClick: () => toggleSort("createdAt"),
            children: [
              "Date ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { field: "createdAt" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-medium text-muted-foreground", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sorted.map((lead, i) => {
        const conf = getConfidenceConfig(lead.confidence);
        const status = getStatusConfig(lead.status);
        const sigType = inferSignalType(lead);
        const SigIcon = SIGNAL_TYPE_CONFIG[sigType].icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `social_lead_capture.table.item.${i + 1}`,
            className: "border-b border-border/50 hover:bg-muted/10 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: lead.name || "Anonymous" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: lead.contactInfo })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformBadge, { platform: lead.source.platform }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 text-xs ${SIGNAL_TYPE_CONFIG[sigType].color}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SigIcon, { className: "h-3.5 w-3.5" }),
                    SIGNAL_TYPE_CONFIG[sigType].label
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${conf.className}`,
                  children: [
                    Math.round(lead.confidence * 100),
                    "%"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${status.className}`,
                  children: status.label
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: new Date(lead.createdAt).toLocaleDateString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: !lead.linkedToCrm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => onAddToCRM(lead),
                  "data-ocid": `social_lead_capture.table_crm_button.${i + 1}`,
                  className: "h-7 text-xs gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3" }),
                    "CRM"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-400 flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                "In CRM"
              ] }) })
            ]
          },
          lead.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y divide-border", children: sorted.map((lead, i) => {
      const conf = getConfidenceConfig(lead.confidence);
      const status = getStatusConfig(lead.status);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `social_lead_capture.table.item.${i + 1}`,
          className: "p-4 space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground", children: lead.name || "Anonymous" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${conf.className}`,
                  children: [
                    Math.round(lead.confidence * 100),
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformBadge, { platform: lead.source.platform }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${status.className}`,
                  children: status.label
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: lead.contactInfo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(lead.createdAt).toLocaleDateString() }),
            !lead.linkedToCrm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => onAddToCRM(lead),
                "data-ocid": `social_lead_capture.table_crm_button_mobile.${i + 1}`,
                className: "w-full h-8 gap-1.5 text-xs mt-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3" }),
                  "Add to CRM"
                ]
              }
            )
          ]
        },
        lead.id
      );
    }) })
  ] });
}
const PLATFORMS = [
  { value: "all", label: "All Platforms" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "google_business", label: "Google" },
  { value: "tiktok", label: "TikTok" }
];
function SocialLeadCapturePage() {
  const {
    socialLeads: backendLeads,
    getSocialLeads,
    createSocialLead,
    linkSocialLeadToCRM,
    isLoadingLeads
  } = useSocialMedia();
  const [leads, setLeads] = reactExports.useState(() => {
    const ids = new Set(backendLeads.map((l) => l.id));
    return [
      ...backendLeads,
      ...RICH_DEMO_SIGNALS.filter((d) => !ids.has(d.id))
    ];
  });
  const [platformFilter, setPlatformFilter] = reactExports.useState(
    "all"
  );
  const [signalFilter, setSignalFilter] = reactExports.useState(
    "all"
  );
  const [dismissed, setDismissed] = reactExports.useState(/* @__PURE__ */ new Set());
  const [crmTarget, setCrmTarget] = reactExports.useState(null);
  reactExports.useEffect(() => {
    void getSocialLeads("tenant-1");
  }, []);
  reactExports.useEffect(() => {
    const ids = new Set(backendLeads.map((l) => l.id));
    setLeads((prev) => {
      const demoOnly = RICH_DEMO_SIGNALS.filter((d) => !ids.has(d.id));
      const backendMap = new Map(backendLeads.map((l) => [l.id, l]));
      return [
        ...backendLeads,
        ...prev.filter((p) => !backendMap.has(p.id)).filter((p) => demoOnly.some((d) => d.id === p.id) || !ids.has(p.id))
      ];
    });
  }, [backendLeads]);
  const visible = reactExports.useMemo(
    () => leads.filter((l) => !dismissed.has(l.id)).filter(
      (l) => platformFilter === "all" || l.source.platform === platformFilter
    ).filter((l) => {
      if (signalFilter === "hot") return l.confidence >= 0.9;
      if (signalFilter === "new") return l.status === "new";
      return true;
    }),
    [leads, dismissed, platformFilter, signalFilter]
  );
  const hotSignals = visible.filter((l) => l.confidence >= 0.9);
  const regularSignals = visible.filter((l) => l.confidence < 0.9);
  const stats = reactExports.useMemo(() => {
    const today = Date.now() - 864e5;
    const todayLeads = leads.filter(
      (l) => l.createdAt >= today && !dismissed.has(l.id)
    );
    const allConf = leads.filter((l) => !dismissed.has(l.id));
    const avgConf = allConf.length > 0 ? allConf.reduce((s, l) => s + l.confidence, 0) / allConf.length : 0;
    return {
      signalsToday: todayLeads.length,
      hotToday: todayLeads.filter((l) => l.confidence >= 0.9).length,
      converted: leads.filter((l) => l.linkedToCrm).length,
      avgConf: Math.round(avgConf * 100)
    };
  }, [leads, dismissed]);
  const handleDismiss = (id) => {
    setDismissed((prev) => /* @__PURE__ */ new Set([...prev, id]));
    ue.info("Signal dismissed");
  };
  const handleAddToCRMClick = (lead) => {
    setCrmTarget(lead);
  };
  const handleConfirmCRM = async (lead, name, notes) => {
    const newLead = await createSocialLead({
      ...lead,
      name,
      notes,
      tenantId: "tenant-1",
      linkedToCrm: false,
      crmLeadId: null,
      status: "new"
    });
    await linkSocialLeadToCRM(newLead.id);
    setLeads(
      (prev) => prev.map((l) => l.id === lead.id ? { ...l, linkedToCrm: true } : l)
    );
    setCrmTarget(null);
    ue.success(`${name} added to CRM`, {
      description: `Source: ${PLATFORM_LABELS[lead.source.platform]}`
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "social_lead_capture.page",
        className: "space-y-6 p-4 md:p-6 max-w-6xl mx-auto",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl md:text-2xl font-display font-bold text-foreground", children: "Lead Capture from Social" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
                  visible.length,
                  " signals"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "AI-detected buying signals from comments, DMs & form fills — push to CRM instantly" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => void getSocialLeads("tenant-1"),
                "data-ocid": "social_lead_capture.refresh_button",
                className: "gap-1.5 shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `h-3.5 w-3.5 ${isLoadingLeads ? "animate-spin" : ""}`
                    }
                  ),
                  "Refresh"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "social_lead_capture.stats_panel",
              className: "grid grid-cols-2 md:grid-cols-4 gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Signals today",
                    value: stats.signalsToday,
                    icon: Activity,
                    accent: "text-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Hot prospects today",
                    value: stats.hotToday,
                    icon: Flame,
                    accent: "text-rose-400"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Converted to leads",
                    value: stats.converted,
                    icon: TrendingUp,
                    accent: "text-emerald-400"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StatCard,
                  {
                    label: "Avg buy signal conf.",
                    value: `${stats.avgConf}%`,
                    icon: ChartColumn,
                    accent: "text-amber-400"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "social_lead_capture.filters_panel",
              className: "flex flex-col sm:flex-row gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
                  PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setPlatformFilter(p.value),
                      "data-ocid": `social_lead_capture.platform_filter.${p.value}`,
                      className: `px-3 py-1 rounded-full text-xs font-medium border transition-colors ${platformFilter === p.value ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"}`,
                      children: p.label
                    },
                    p.value
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 sm:ml-auto", children: ["all", "hot", "new"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSignalFilter(f),
                    "data-ocid": `social_lead_capture.signal_filter.${f}`,
                    className: `px-3 py-1 rounded-full text-xs font-medium border transition-colors ${signalFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"}`,
                    children: f === "hot" ? "🔥 Hot" : f === "new" ? "New" : "All"
                  },
                  f
                )) })
              ]
            }
          ),
          isLoadingLeads && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "social_lead_capture.loading_state",
              className: "space-y-3",
              children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" }, i))
            }
          ),
          !isLoadingLeads && hotSignals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "social_lead_capture.hot_signals_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-emerald-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground", children: [
                "Hot Signals",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs font-normal text-muted-foreground", children: "90%+ buying confidence" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "ml-auto text-xs bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
                  children: hotSignals.length
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: hotSignals.map((lead, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              SignalCard,
              {
                lead,
                index: i,
                isHot: true,
                onAddToCRM: handleAddToCRMClick,
                onDismiss: handleDismiss
              },
              lead.id
            )) }) })
          ] }),
          !isLoadingLeads && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "social_lead_capture.feed_section", children: [
            hotSignals.length > 0 && regularSignals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground", children: [
                "All Signals",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs font-normal text-muted-foreground", children: "under 90% confidence" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "ml-auto text-xs", children: regularSignals.length })
            ] }),
            visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "social_lead_capture.empty_state",
                className: "text-center py-14 rounded-xl border border-dashed border-border bg-muted/10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 mx-auto mb-3 text-muted-foreground/30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No signals in this queue" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xs mx-auto", children: "Buying signals are auto-detected from social comments, DMs, and form fills as they happen." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "mt-4 gap-1.5",
                      onClick: () => {
                        setPlatformFilter("all");
                        setSignalFilter("all");
                        setDismissed(/* @__PURE__ */ new Set());
                      },
                      "data-ocid": "social_lead_capture.reset_filters_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                        "Reset filters"
                      ]
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: (hotSignals.length > 0 ? regularSignals : visible).map(
              (lead, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SignalCard,
                {
                  lead,
                  index: i,
                  isHot: false,
                  onAddToCRM: handleAddToCRMClick,
                  onDismiss: handleDismiss
                },
                lead.id
              )
            ) }) })
          ] }),
          !isLoadingLeads && leads.filter((l) => !dismissed.has(l.id)).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "social_lead_capture.leads_table_section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
                "Captured Lead Dashboard"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                leads.filter((l) => !dismissed.has(l.id)).length,
                " total"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              LeadsTable,
              {
                leads: leads.filter((l) => !dismissed.has(l.id)),
                onAddToCRM: handleAddToCRMClick
              }
            ) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CRMSlidePanel,
      {
        lead: crmTarget,
        onClose: () => setCrmTarget(null),
        onConfirm: handleConfirmCRM
      }
    )
  ] });
}
export {
  SocialLeadCapturePage as default
};
