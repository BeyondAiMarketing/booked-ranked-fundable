import { c as createLucideIcon, by as useApp, r as reactExports, j as jsxRuntimeExports, cf as AppLayout, al as RefreshCw, bd as Play, aE as Pause, m as Mail, U as Users, c0 as Megaphone, cg as Inbox, P as Plus, S as Send, bl as Calendar, b0 as ChevronLeft, X, aQ as ue, h as Save, aj as Download, ch as ArrowUp, ci as ArrowDown, q as Trash2, cj as useLeads } from "./index-Dwzp0QDY.js";
import { u as useRooferCampaign, a as useStartSending, b as usePauseSending, R as RooferCampaignStatus, c as useRooferCampaigns, d as useUpdateSequence, e as useRooferCampaignLeads, f as useRooferCampaignStats, g as RooferCampaignLeadStatus, h as useRooferCampaignReplies, i as useCreateRooferCampaign, j as useEnrollLeads } from "./useRooferCampaign-DHyVItta.js";
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
      d: "M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z",
      key: "1lbycx"
    }
  ],
  ["polyline", { points: "15,9 18,9 18,11", key: "1pm9c0" }],
  ["path", { d: "M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2", key: "15i455" }],
  ["line", { x1: "6", x2: "7", y1: "10", y2: "10", key: "1e2scm" }]
];
const Mailbox = createLucideIcon("mailbox", __iconNode);
const PERSONALIZATION_TOKENS = [
  "business_name",
  "city",
  "ranking_score",
  "dead_zones_count",
  "top_competitor",
  "pain_point",
  "owner_name"
];
const LEAD_LIST_OPTIONS = [
  { id: "roofing-storm", label: "Roofing — Storm Damage (recent)" },
  { id: "roofing-missed-calls", label: "Roofing — Missed Calls (30d)" },
  { id: "roofing-maps-low", label: "Roofing — Low Google Maps Ranking" },
  { id: "roofing-few-reviews", label: "Roofing — Few Reviews (<10)" }
];
const STATUS_LABELS = {
  [RooferCampaignStatus.draft]: "Draft",
  [RooferCampaignStatus.sending]: "Active",
  [RooferCampaignStatus.paused]: "Paused",
  [RooferCampaignStatus.completed]: "Completed",
  [RooferCampaignStatus.archived]: "Archived"
};
const LEAD_STATUS_LABELS = {
  [RooferCampaignLeadStatus.new_]: "Pending",
  [RooferCampaignLeadStatus.sent]: "Sent",
  [RooferCampaignLeadStatus.opened]: "Opened",
  [RooferCampaignLeadStatus.replied]: "Replied",
  [RooferCampaignLeadStatus.bounced]: "Bounced",
  [RooferCampaignLeadStatus.booked]: "Booked",
  [RooferCampaignLeadStatus.unsubscribed]: "Unsubscribed"
};
const LEAD_STATUS_TONE = {
  [RooferCampaignLeadStatus.new_]: "amber",
  [RooferCampaignLeadStatus.sent]: "blue",
  [RooferCampaignLeadStatus.opened]: "cyan",
  [RooferCampaignLeadStatus.replied]: "purple",
  [RooferCampaignLeadStatus.bounced]: "rose",
  [RooferCampaignLeadStatus.booked]: "emerald",
  [RooferCampaignLeadStatus.unsubscribed]: "gray"
};
const CAMPAIGN_STATUS_TONE = {
  [RooferCampaignStatus.draft]: "gray",
  [RooferCampaignStatus.sending]: "emerald",
  [RooferCampaignStatus.paused]: "amber",
  [RooferCampaignStatus.completed]: "blue",
  [RooferCampaignStatus.archived]: "gray"
};
const TONE_TEXT = {
  amber: "text-amber-400",
  blue: "text-blue-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  rose: "text-rose-400",
  emerald: "text-emerald-400",
  gray: "text-slate-400"
};
function n(value) {
  if (value === void 0 || value === null) return 0;
  return Number(value);
}
function pct(part, whole) {
  if (whole <= 0) return 0;
  return Math.round(part / whole * 100);
}
function timeAgo(ms) {
  if (!ms || ms <= 0) return "—";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
function fmtDateTime(ms) {
  if (!ms || ms <= 0) return "—";
  return new Date(ms).toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function renderTokens(text, sample) {
  return text.replace(/\[name\]/g, sample.ownerName).replace(/\[business_name\]/g, sample.businessName).replace(/\[city\]/g, sample.city).replace(/\[ranking_score\]/g, String(sample.rankingScore)).replace(/\[dead_zones_count\]/g, String(sample.deadZonesCount)).replace(/\[top_competitor\]/g, sample.topCompetitor).replace(/\[pain_point\]/g, sample.painPoint).replace(/\[owner_name\]/g, sample.ownerName).replace(/\{business_name\}/g, sample.businessName).replace(/\{city\}/g, sample.city).replace(/\{ranking_score\}/g, String(sample.rankingScore)).replace(/\{dead_zones_count\}/g, String(sample.deadZonesCount)).replace(/\{top_competitor\}/g, sample.topCompetitor).replace(/\{pain_point\}/g, sample.painPoint).replace(/\{owner_name\}/g, sample.ownerName);
}
const DEMO_SAMPLE_LEAD = {
  businessName: "Apex Roofing Co",
  ownerName: "Marcus",
  city: "Austin",
  rankingScore: 42,
  deadZonesCount: 3,
  topCompetitor: "Lone Star Roofers",
  painPoint: "missed after-hours calls"
};
function ToneBadge({
  tone,
  children
}) {
  const cls = {
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    gray: "bg-slate-500/15 text-slate-300 border-slate-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls[tone]}`,
      children
    }
  );
}
function LoadingState({ label = "Loading…" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 animate-spin text-amber-400" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: label })
  ] });
}
function ErrorState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "roofer.error_state",
      className: "flex flex-col items-center justify-center gap-2 py-16 text-rose-300",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-6 h-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: message })
      ]
    }
  );
}
function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "roofer.empty_state",
      className: "flex flex-col items-center justify-center gap-3 py-16 text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 text-amber-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: subtitle })
        ] }),
        action
      ]
    }
  );
}
function RooferCampaignPage() {
  const { currentTenantId } = useApp();
  const [selectedId, setSelectedId] = reactExports.useState(null);
  if (selectedId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CampaignDetail,
      {
        campaignId: selectedId,
        tenantId: currentTenantId,
        onBack: () => setSelectedId(null)
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    CampaignList,
    {
      tenantId: currentTenantId,
      onOpen: (id) => setSelectedId(id)
    }
  ) });
}
function CampaignList({
  tenantId,
  onOpen
}) {
  const { data, isLoading, isError, refetch, isFetching } = useRooferCampaigns(tenantId);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "w-5 h-5 text-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-amber-400/80", children: "Roofer Outreach" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Cold Outreach Campaigns" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Book demos of the Booked Ranked Fundable platform with roofing contractors." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "roofer.refresh.button",
            onClick: () => refetch(),
            disabled: isFetching,
            className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Refresh" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "roofer.new_campaign.button",
            onClick: () => setShowCreate(true),
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "New Campaign"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryTile,
        {
          label: "Total Campaigns",
          value: (data == null ? void 0 : data.length) ?? 0,
          icon: Megaphone
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryTile,
        {
          label: "Active",
          value: (data == null ? void 0 : data.filter((c) => c.status === RooferCampaignStatus.sending).length) ?? 0,
          icon: Play,
          tone: "emerald"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryTile,
        {
          label: "Total Sent",
          value: (data == null ? void 0 : data.reduce((acc, c) => acc + n(c.sent), 0)) ?? 0,
          icon: Send,
          tone: "blue"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryTile,
        {
          label: "Demos Booked",
          value: (data == null ? void 0 : data.reduce((acc, c) => acc + n(c.booked), 0)) ?? 0,
          icon: Calendar,
          tone: "amber"
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { label: "Loading campaigns…" }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: "Failed to load campaigns. Try refreshing." }) : !data || data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Megaphone,
        title: "No campaigns yet",
        subtitle: "Create your first roofer cold outreach campaign to start booking demos.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "roofer.empty_create.button",
            onClick: () => setShowCreate(true),
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Create Campaign"
            ]
          }
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: data.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      CampaignCard,
      {
        campaign: c,
        index: i,
        onOpen: () => onOpen(c.id)
      },
      c.id
    )) }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateCampaignModal,
      {
        tenantId,
        onClose: () => setShowCreate(false),
        onCreated: (id) => {
          setShowCreate(false);
          onOpen(id);
        }
      }
    )
  ] });
}
function SummaryTile({
  label,
  value,
  icon: Icon,
  tone = "purple"
}) {
  const toneCls = {
    amber: "text-amber-400",
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    rose: "text-rose-400",
    emerald: "text-emerald-400",
    gray: "text-slate-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card/60 border border-white/8 p-4 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-4 h-4 ${toneCls[tone]}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: value })
  ] });
}
function CampaignCard({
  campaign,
  index,
  onOpen
}) {
  const leadCount = n(campaign.leadCount);
  const sent = n(campaign.sent);
  const replied = n(campaign.replied);
  const booked = n(campaign.booked);
  const replyRate = pct(replied, sent);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `roofer.campaign.item.${index + 1}`,
      onClick: onOpen,
      className: "text-left rounded-xl bg-card/60 border border-white/8 p-5 hover:bg-card/80 hover:border-amber-500/30 transition-all group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground truncate group-hover:text-amber-300 transition-colors", children: campaign.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "Created ",
              timeAgo(n(campaign.createdAt))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToneBadge, { tone: CAMPAIGN_STATUS_TONE[campaign.status], children: STATUS_LABELS[campaign.status] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-2 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Leads", value: leadCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Sent", value: sent, tone: "blue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Replied", value: replied, tone: "purple" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Booked", value: booked, tone: "emerald" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reply rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-amber-300", children: [
            replyRate,
            "%"
          ] })
        ] })
      ]
    }
  );
}
function Stat({
  label,
  value,
  tone = "gray"
}) {
  const toneCls = {
    amber: "text-amber-300",
    blue: "text-blue-300",
    cyan: "text-cyan-300",
    purple: "text-purple-300",
    rose: "text-rose-300",
    emerald: "text-emerald-300",
    gray: "text-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg font-bold ${toneCls[tone]}`, children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5", children: label })
  ] });
}
function CreateCampaignModal({
  tenantId,
  onClose,
  onCreated
}) {
  const create = useCreateRooferCampaign(tenantId);
  const [name, setName] = reactExports.useState("");
  const [leadListId, setLeadListId] = reactExports.useState(LEAD_LIST_OPTIONS[0].id);
  const [senderName, setSenderName] = reactExports.useState("BRF Outreach");
  const [senderEmail, setSenderEmail] = reactExports.useState(
    "outreach@bookedrankedfundable.com"
  );
  const [error, setError] = reactExports.useState(null);
  const canSubmit = name.trim().length > 0 && senderEmail.trim().length > 0;
  function handleSubmit() {
    if (!canSubmit) {
      setError("Campaign name and sender email are required.");
      return;
    }
    setError(null);
    create.mutate(
      { name: name.trim() },
      {
        onSuccess: (campaign) => {
          ue.success(`Campaign "${name.trim()}" created`);
          onCreated(campaign.id);
        },
        onError: () => {
          setError("Failed to create campaign. Please try again.");
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "roofer.create.dialog",
      className: "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-2xl bg-card border border-white/10 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-white/8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "New Roofer Campaign" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.create.close_button",
              onClick: onClose,
              className: "p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Campaign name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-ocid": "roofer.create.name.input",
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "e.g. Austin Storm Season Outreach",
              className: "w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Lead list", hint: "Roofing-focused Lead Engine segments", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              "data-ocid": "roofer.create.lead_list.select",
              value: leadListId,
              onChange: (e) => setLeadListId(e.target.value),
              className: "w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20",
              children: LEAD_LIST_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.id, children: opt.label }, opt.id))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sender name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                "data-ocid": "roofer.create.sender_name.input",
                type: "text",
                value: senderName,
                onChange: (e) => setSenderName(e.target.value),
                className: "w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sender email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                "data-ocid": "roofer.create.sender_email.input",
                type: "email",
                value: senderEmail,
                onChange: (e) => setSenderEmail(e.target.value),
                className: "w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-200/80", children: "The default 7-step roofer sequence will be pre-loaded. You can edit every step, add personalization tokens, and reorder before sending." }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "roofer.create.field_error",
              className: "text-xs text-rose-300",
              children: error
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 p-5 border-t border-white/8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.create.cancel_button",
              onClick: onClose,
              className: "px-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.create.submit_button",
              onClick: handleSubmit,
              disabled: !canSubmit || create.isPending,
              className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              children: [
                create.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Create"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
function Field({
  label,
  hint,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/70", children: hint })
    ] }),
    children
  ] });
}
function CampaignDetail({
  campaignId,
  tenantId,
  onBack
}) {
  const { data: campaign, isLoading, isError } = useRooferCampaign(campaignId);
  const [tab, setTab] = reactExports.useState("sequence");
  const startSending = useStartSending(campaignId, tenantId);
  const pauseSending = usePauseSending(campaignId, tenantId);
  const status = (campaign == null ? void 0 : campaign.status) ?? RooferCampaignStatus.draft;
  const canStart = status === RooferCampaignStatus.draft || status === RooferCampaignStatus.paused;
  const canPause = status === RooferCampaignStatus.sending;
  function handleStart() {
    startSending.mutate(void 0, {
      onSuccess: () => ue.success("Sending started"),
      onError: () => ue.error("Failed to start sending")
    });
  }
  function handlePause() {
    pauseSending.mutate(void 0, {
      onSuccess: () => ue.success("Sending paused"),
      onError: () => ue.error("Failed to pause sending")
    });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BackButton, { onClick: onBack }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { label: "Loading campaign…" })
    ] });
  }
  if (isError || !campaign) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BackButton, { onClick: onBack }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: "Failed to load campaign." })
    ] });
  }
  const tabs = [
    { id: "sequence", label: "Sequence", icon: Mail },
    { id: "leads", label: "Leads", icon: Users },
    { id: "stats", label: "Stats", icon: Megaphone },
    { id: "replies", label: "Replies", icon: Inbox }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BackButton, { onClick: onBack }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToneBadge, { tone: CAMPAIGN_STATUS_TONE[status], children: STATUS_LABELS[status] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            n(campaign.leadCount),
            " leads"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground truncate", children: campaign.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Created ",
          fmtDateTime(n(campaign.createdAt)),
          " · Updated",
          " ",
          timeAgo(n(campaign.updatedAt))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        canStart && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "roofer.start_sending.button",
            onClick: handleStart,
            disabled: startSending.isPending,
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50",
            children: [
              startSending.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
              "Start sending"
            ]
          }
        ),
        canPause && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "roofer.pause_sending.button",
            onClick: handlePause,
            disabled: pauseSending.isPending,
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all disabled:opacity-50",
            children: [
              pauseSending.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4" }),
              "Pause sending"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-6 border-b border-white/8 overflow-x-auto", children: tabs.map((t) => {
      const active = tab === t.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `roofer.tab.${t.id}`,
          onClick: () => setTab(t.id),
          className: `inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${active ? "border-amber-500 text-amber-300" : "border-transparent text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "w-4 h-4" }),
            t.label
          ]
        },
        t.id
      );
    }) }),
    tab === "sequence" && /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceTab, { campaign }),
    tab === "leads" && /* @__PURE__ */ jsxRuntimeExports.jsx(LeadsTab, { campaignId, tenantId }),
    tab === "stats" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsTab, { campaignId }),
    tab === "replies" && /* @__PURE__ */ jsxRuntimeExports.jsx(RepliesTab, { campaignId })
  ] });
}
function BackButton({ onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": "roofer.back.button",
      onClick,
      className: "inline-flex items-center gap-1.5 mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
        "All campaigns"
      ]
    }
  );
}
function SequenceTab({ campaign }) {
  const update = useUpdateSequence(campaign.id);
  const [steps, setSteps] = reactExports.useState(campaign.sequence);
  const [dirty, setDirty] = reactExports.useState(false);
  const [previewStepIdx, setPreviewStepIdx] = reactExports.useState(0);
  reactExports.useEffect(() => {
    setSteps(campaign.sequence);
    setDirty(false);
  }, [campaign.sequence]);
  function patch(idx, patch2) {
    setSteps(
      (prev) => prev.map((s, i) => i === idx ? { ...s, ...patch2 } : s)
    );
    setDirty(true);
  }
  function moveUp(idx) {
    if (idx === 0) return;
    setSteps((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((s, i) => ({ ...s, stepNumber: BigInt(i + 1) }));
    });
    setDirty(true);
  }
  function moveDown(idx) {
    setSteps((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((s, i) => ({ ...s, stepNumber: BigInt(i + 1) }));
    });
    setDirty(true);
  }
  function removeStep(idx) {
    setSteps(
      (prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: BigInt(i + 1) }))
    );
    setDirty(true);
  }
  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: `step-new-${Date.now()}`,
        stepNumber: BigInt(prev.length + 1),
        subject: "New step — write a subject",
        body: "Hi [name], ",
        delayDays: BigInt(2),
        sendTime: "09:00",
        ctaToken: `cta-new-${prev.length + 1}`
      }
    ]);
    setDirty(true);
  }
  function handleSave() {
    update.mutate(
      { sequence: steps },
      {
        onSuccess: () => {
          ue.success("Sequence saved");
          setDirty(false);
        },
        onError: () => ue.error("Failed to save sequence")
      }
    );
  }
  const previewStep = steps[previewStepIdx] ?? steps[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
          "Email Sequence (",
          steps.length,
          " steps)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.add_step.button",
              onClick: addStep,
              className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Add Step"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.save_sequence.button",
              onClick: handleSave,
              disabled: !dirty || update.isPending,
              className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              children: [
                update.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                "Save Sequence"
              ]
            }
          )
        ] })
      ] }),
      steps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: Mail,
          title: "No sequence steps",
          subtitle: "Add a step to start building your email sequence.",
          action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: addStep,
              className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Add first step"
              ]
            }
          )
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: steps.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        StepCard,
        {
          step,
          idx,
          total: steps.length,
          onPatch: patch,
          onMoveUp: moveUp,
          onMoveDown: moveDown,
          onRemove: removeStep,
          onPreview: () => setPreviewStepIdx(idx),
          isPreview: previewStepIdx === idx
        },
        step.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-4 rounded-xl bg-card/60 border border-white/8 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mailbox, { className: "w-4 h-4 text-amber-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Live Preview" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
        "Step ",
        n(previewStep == null ? void 0 : previewStep.stepNumber),
        " · rendered for a sample lead"
      ] }),
      previewStep ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background border border-white/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground mb-3", children: renderTokens(previewStep.subject, DEMO_SAMPLE_LEAD) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Body" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground whitespace-pre-wrap leading-relaxed", children: renderTokens(previewStep.body, DEMO_SAMPLE_LEAD) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Sends ",
            n(previewStep.delayDays),
            "d after previous step"
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No step to preview." })
    ] }) })
  ] });
}
function StepCard({
  step,
  idx,
  total,
  onPatch,
  onMoveUp,
  onMoveDown,
  onRemove,
  onPreview,
  isPreview
}) {
  const [enabled, setEnabled] = reactExports.useState(true);
  const bodyRef = reactExports.useRef(null);
  function insertToken(token) {
    const ta = bodyRef.current;
    if (!ta) {
      onPatch(idx, { body: `${step.body}{${token}}` });
      return;
    }
    const start = ta.selectionStart ?? step.body.length;
    const end = ta.selectionEnd ?? step.body.length;
    const insert = `{${token}}`;
    const next = step.body.slice(0, start) + insert + step.body.slice(end);
    onPatch(idx, { body: next });
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `roofer.step.item.${idx + 1}`,
      className: `rounded-xl border p-4 transition-all ${isPreview ? "bg-amber-500/5 border-amber-500/40" : "bg-card/40 border-white/8"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center", children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
              "Step ",
              idx + 1
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `roofer.step.move_up.${idx + 1}`,
                onClick: () => onMoveUp(idx),
                disabled: idx === 0,
                className: "p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                "aria-label": "Move up",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `roofer.step.move_down.${idx + 1}`,
                onClick: () => onMoveDown(idx),
                disabled: idx === total - 1,
                className: "p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                "aria-label": "Move down",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `roofer.step.preview.${idx + 1}`,
                onClick: onPreview,
                className: "p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-amber-300 transition-colors",
                "aria-label": "Preview this step",
                title: "Preview this step",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `roofer.step.delete.${idx + 1}`,
                onClick: () => onRemove(idx),
                className: "p-1.5 rounded-md hover:bg-rose-500/15 text-muted-foreground hover:text-rose-300 transition-colors",
                "aria-label": "Remove step",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-ocid": `roofer.step.subject.${idx + 1}`,
              type: "text",
              value: step.subject,
              onChange: (e) => onPatch(idx, { subject: e.target.value }),
              placeholder: "Subject line",
              className: "w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: PERSONALIZATION_TOKENS.map((token) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `roofer.step.token.${token}`,
              onClick: () => insertToken(token),
              className: "px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:bg-purple-500/20 transition-colors",
              children: token
            },
            token
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: bodyRef,
              "data-ocid": `roofer.step.body.${idx + 1}`,
              value: step.body,
              onChange: (e) => onPatch(idx, { body: e.target.value }),
              placeholder: "Email body — use {token} pills above to personalize",
              rows: 5,
              className: "w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-y font-mono"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: `roofer-step-delay-${idx + 1}`,
                  className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                  children: "Delay (days)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `roofer-step-delay-${idx + 1}`,
                  "data-ocid": `roofer.step.delay.${idx + 1}`,
                  type: "number",
                  min: 0,
                  value: n(step.delayDays),
                  onChange: (e) => onPatch(idx, { delayDays: BigInt(e.target.value || 0) }),
                  className: "w-full mt-1 px-2.5 py-1.5 rounded-lg bg-background border border-white/10 text-sm text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: `roofer-step-send-time-${idx + 1}`,
                  className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                  children: "Send time"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `roofer-step-send-time-${idx + 1}`,
                  "data-ocid": `roofer.step.send_time.${idx + 1}`,
                  type: "text",
                  placeholder: "09:00",
                  value: step.sendTime,
                  onChange: (e) => onPatch(idx, { sendTime: e.target.value }),
                  className: "w-full mt-2 px-2.5 py-1.5 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-foreground cursor-pointer select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": `roofer.step.enabled.${idx + 1}`,
                  type: "checkbox",
                  checked: enabled,
                  onChange: (e) => setEnabled(e.target.checked),
                  className: "w-4 h-4 rounded accent-amber-500"
                }
              ),
              "Enabled"
            ] }) })
          ] })
        ] })
      ]
    }
  );
}
function LeadsTab({
  campaignId,
  tenantId
}) {
  const {
    data: leads,
    isLoading,
    isError
  } = useRooferCampaignLeads(campaignId);
  const [showEnroll, setShowEnroll] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(0);
  const pageSize = 10;
  const paged = reactExports.useMemo(() => {
    if (!leads) return [];
    return leads.slice(page * pageSize, (page + 1) * pageSize);
  }, [leads, page]);
  const totalPages = Math.max(1, Math.ceil(((leads == null ? void 0 : leads.length) ?? 0) / pageSize));
  function exportCsv() {
    if (!leads || leads.length === 0) {
      ue.error("No leads to export");
      return;
    }
    const header = [
      "Business",
      "Email",
      "Phone",
      "Niche",
      "Status",
      "Current Step",
      "Enrolled At",
      "Last Event"
    ];
    const rows = leads.map((l) => [
      l.businessName,
      l.email,
      l.phone,
      l.niche,
      LEAD_STATUS_LABELS[l.status],
      n(l.currentStep),
      fmtDateTime(n(l.enrolledAt)),
      fmtDateTime(n(l.lastEventAt))
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-${campaignId}-leads.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("CSV exported");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
        "Enrolled Leads (",
        (leads == null ? void 0 : leads.length) ?? 0,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "roofer.export_csv.button",
            onClick: exportCsv,
            className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
              "Export CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "roofer.enroll_leads.button",
            onClick: () => setShowEnroll(true),
            className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Enroll Leads"
            ]
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { label: "Loading leads…" }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: "Failed to load leads." }) : !leads || leads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Users,
        title: "No leads enrolled",
        subtitle: "Enroll roofing leads from the Lead Engine to start this campaign.",
        action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowEnroll(true),
            className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Enroll leads"
            ]
          }
        )
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-card/40 border border-white/8 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Business" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Step" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Last Event" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Next Send" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: paged.map((lead, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          LeadRow,
          {
            lead,
            index: page * pageSize + i
          },
          lead.id
        )) })
      ] }) }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "Page ",
          page + 1,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.leads.pagination_prev",
              onClick: () => setPage((p) => Math.max(0, p - 1)),
              disabled: page === 0,
              className: "px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-30",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.leads.pagination_next",
              onClick: () => setPage((p) => Math.min(totalPages - 1, p + 1)),
              disabled: page >= totalPages - 1,
              className: "px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-30",
              children: "Next"
            }
          )
        ] })
      ] })
    ] }),
    showEnroll && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EnrollLeadsModal,
      {
        campaignId,
        tenantId,
        onClose: () => setShowEnroll(false)
      }
    )
  ] });
}
function LeadRow({
  lead,
  index
}) {
  const nextSendMs = n(lead.lastEventAt) > 0 ? n(lead.lastEventAt) + n(lead.currentStep) * 2 * 24 * 60 * 60 * 1e3 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      "data-ocid": `roofer.lead.item.${index + 1}`,
      className: "border-t border-white/5 hover:bg-white/5 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: lead.businessName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: lead.phone })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: lead.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: n(lead.currentStep) > 0 ? `Step ${n(lead.currentStep)}` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: timeAgo(n(lead.lastEventAt)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: nextSendMs > Date.now() ? fmtDateTime(nextSendMs) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToneBadge, { tone: LEAD_STATUS_TONE[lead.status], children: LEAD_STATUS_LABELS[lead.status] }) })
      ]
    }
  );
}
function EnrollLeadsModal({
  campaignId,
  tenantId,
  onClose
}) {
  const { data: leads, isLoading } = useLeads(tenantId);
  const enroll = useEnrollLeads(campaignId);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [filter, setFilter] = reactExports.useState("");
  const roofingLeads = reactExports.useMemo(() => {
    if (!leads) return [];
    return leads.filter(
      (l) => {
        var _a;
        return ((_a = l.niche) == null ? void 0 : _a.toLowerCase().includes("roofing")) || l.niche === "roofing" || true;
      }
      // show all; filter narrows by search
    );
  }, [leads]);
  const filtered = reactExports.useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return roofingLeads;
    return roofingLeads.filter(
      (l) => {
        var _a, _b, _c;
        return ((_a = l.name) == null ? void 0 : _a.toLowerCase().includes(q)) || ((_b = l.email) == null ? void 0 : _b.toLowerCase().includes(q)) || ((_c = l.phone) == null ? void 0 : _c.toLowerCase().includes(q));
      }
    );
  }, [roofingLeads, filter]);
  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function handleEnroll() {
    if (selected.size === 0) {
      ue.error("Select at least one lead to enroll");
      return;
    }
    enroll.mutate(
      { campaignId, leadIds: Array.from(selected) },
      {
        onSuccess: () => {
          ue.success(`Enrolled ${selected.size} leads`);
          onClose();
        },
        onError: () => ue.error("Failed to enroll leads")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "roofer.enroll.dialog",
      className: "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl rounded-2xl bg-card border border-white/10 shadow-2xl flex flex-col max-h-[85vh]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-white/8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Enroll Leads" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "roofer.enroll.close_button",
              onClick: onClose,
              className: "p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "Close",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 border-b border-white/8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-ocid": "roofer.enroll.search.input",
            type: "text",
            value: filter,
            onChange: (e) => setFilter(e.target.value),
            placeholder: "Search leads by name, email, or phone…",
            className: "w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-5 space-y-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { label: "Loading leads…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "No leads match your filter." }) : filtered.map((lead, i) => {
          const checked = selected.has(lead.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              "data-ocid": `roofer.enroll.lead.item.${i + 1}`,
              className: `flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? "bg-amber-500/10 border-amber-500/40" : "bg-background border-white/8 hover:bg-white/5"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    "data-ocid": `roofer.enroll.lead.checkbox.${i + 1}`,
                    type: "checkbox",
                    checked,
                    onChange: () => toggle(lead.id),
                    className: "w-4 h-4 rounded accent-amber-500"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children: lead.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
                    lead.email,
                    " · ",
                    lead.phone
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: lead.niche })
              ]
            },
            lead.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-t border-white/8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            selected.size,
            " selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "roofer.enroll.cancel_button",
                onClick: onClose,
                className: "px-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "roofer.enroll.confirm_button",
                onClick: handleEnroll,
                disabled: selected.size === 0 || enroll.isPending,
                className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                children: [
                  enroll.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                  "Enroll Selected"
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function StatsTab({ campaignId }) {
  const {
    data: stats,
    isLoading,
    isError
  } = useRooferCampaignStats(campaignId);
  const { data: leads } = useRooferCampaignLeads(campaignId);
  const stepFunnel = reactExports.useMemo(() => {
    if (!leads || leads.length === 0) return [];
    const maxStep = leads.reduce(
      (max, l) => Math.max(max, n(l.currentStep)),
      0
    );
    return Array.from({ length: maxStep }, (_, i) => {
      const stepNum = i + 1;
      const reached = leads.filter((l) => n(l.currentStep) >= stepNum).length;
      const prev = i === 0 ? leads.length : leads.filter((l) => n(l.currentStep) >= i).length;
      const dropOff = prev > 0 ? Math.round((prev - reached) / prev * 100) : 0;
      return { step: stepNum, reached, dropOff };
    });
  }, [leads]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { label: "Loading stats…" });
  if (isError || !stats) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: "Failed to load stats." });
  const sent = n(stats.sent);
  const opened = n(stats.opened);
  const replied = n(stats.replied);
  const bounced = n(stats.bounced);
  const booked = n(stats.booked);
  const unsubscribed = n(stats.unsubscribed);
  const total = n(stats.totalLeads);
  const tiles = [
    {
      label: "Sent",
      value: sent,
      rate: pct(sent, total),
      tone: "blue",
      icon: Send
    },
    {
      label: "Opened",
      value: opened,
      rate: pct(opened, sent),
      tone: "cyan",
      icon: Mail
    },
    {
      label: "Replied",
      value: replied,
      rate: pct(replied, sent),
      tone: "purple",
      icon: Inbox
    },
    {
      label: "Bounced",
      value: bounced,
      rate: pct(bounced, sent),
      tone: "rose",
      icon: X
    },
    {
      label: "Booked",
      value: booked,
      rate: pct(booked, sent),
      tone: "emerald",
      icon: Calendar
    },
    {
      label: "Unsubscribed",
      value: unsubscribed,
      rate: pct(unsubscribed, sent),
      tone: "gray",
      icon: X
    }
  ];
  const bookedLeads = (leads == null ? void 0 : leads.filter((l) => l.status === RooferCampaignLeadStatus.booked)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: tiles.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl bg-card/60 border border-white/8 p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: `w-4 h-4 ${TONE_TEXT[t.tone]}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: t.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1", children: [
            t.rate,
            "% rate"
          ] })
        ]
      },
      t.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card/40 border border-white/8 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Per-Step Funnel" }),
      stepFunnel.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No lead progression data yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: stepFunnel.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `roofer.funnel.item.${s.step}`,
          className: "flex items-center gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-16 text-xs text-muted-foreground flex-shrink-0", children: [
              "Step ",
              s.step
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 h-7 rounded-lg bg-background border border-white/8 overflow-hidden relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full bg-gradient-to-r from-amber-500/40 to-amber-500/60 transition-all",
                  style: {
                    width: `${pct(s.reached, (leads == null ? void 0 : leads.length) ?? 1)}%`
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute inset-0 flex items-center px-3 text-xs font-semibold text-foreground", children: [
                s.reached,
                " leads"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-20 text-xs text-rose-300 text-right flex-shrink-0", children: s.dropOff > 0 ? `-${s.dropOff}%` : "" })
          ]
        },
        s.step
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card/40 border border-white/8 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-emerald-400" }),
        "Demo Bookings (",
        bookedLeads.length,
        ")"
      ] }),
      bookedLeads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No demos booked yet from this campaign." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: bookedLeads.map((lead, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `roofer.booking.item.${i + 1}`,
          className: "flex items-center justify-between p-3 rounded-lg bg-background border border-white/8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: lead.businessName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: lead.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-emerald-300 font-semibold", children: "Booked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: timeAgo(n(lead.lastEventAt)) })
            ] })
          ]
        },
        lead.id
      )) })
    ] })
  ] });
}
function RepliesTab({ campaignId }) {
  const {
    data: replies,
    isLoading,
    isError
  } = useRooferCampaignReplies(campaignId);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingState, { label: "Loading replies…" });
  if (isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { message: "Failed to load replies." });
  if (!replies || replies.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Inbox,
        title: "No replies yet",
        subtitle: "Replies from enrolled roofers will appear here once they respond to your sequence."
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground", children: [
      "Reply Inbox (",
      replies.length,
      ")"
    ] }),
    replies.map((reply, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `roofer.reply.item.${i + 1}`,
        className: "rounded-xl bg-card/40 border border-white/8 p-4 hover:bg-card/60 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: reply.businessName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ToneBadge, { tone: "purple", children: "Replied" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: reply.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0", children: timeAgo(n(reply.lastEventAt)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-background border border-white/8 p-3 mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: reply.replySnippet ?? "(no snippet captured)" }) })
        ]
      },
      reply.id
    ))
  ] });
}
export {
  RooferCampaignPage as default
};
