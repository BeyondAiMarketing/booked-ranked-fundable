import { c as createLucideIcon, u as useQuery, a as useQueryClient, b as useMutation, r as reactExports, j as jsxRuntimeExports, U as Users, S as Send, T as TrendingUp, d as TriangleAlert, C as ChartColumn, e as ChevronUp, f as ChevronDown, B as Button, E as Eye, X, L as Label, I as Input, H as Hash, g as Textarea, h as Save, i as Clock, M as Monitor, k as Smartphone, P as Plus, l as LoaderCircle, m as Mail, n as ChartNoAxesColumn, o as Pencil, p as Copy, q as Trash2, F as FileText, D as Dialog, s as useComposedRefs, t as DialogContent, v as composeEventHandlers, w as DialogTitle, x as DialogDescription, y as DialogClose, z as createDialogScope, A as DialogPortal, G as DialogOverlay, J as createContextScope, K as DialogTrigger, N as cn, O as buttonVariants, Q as Sheet, R as SheetContent, V as SheetHeader, W as SheetTitle, Y as Select, Z as SelectTrigger, _ as SelectValue, $ as SelectContent, a0 as SelectItem, a1 as Search, a2 as Table, a3 as TableHeader, a4 as TableRow, a5 as TableHead, a6 as TableBody, a7 as TableCell, a8 as Tag } from "./index-CSMRpKtY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 4.1 12 6", key: "ita8i4" }],
  ["path", { d: "m5.1 8-2.9-.8", key: "1go3kf" }],
  ["path", { d: "m6 12-1.9 2", key: "mnht97" }],
  ["path", { d: "M7.2 2.2 8 5.1", key: "1cfko1" }],
  [
    "path",
    {
      d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
      key: "s0h3yz"
    }
  ]
];
const MousePointerClick = createLucideIcon("mouse-pointer-click", __iconNode);
const demoSubscribers = [
  {
    id: "sub-001",
    tenantId: "tenant-brf",
    email: "mike.hernandez@precisionplumbing.com",
    phone: "(512) 441-9900",
    businessName: "Precision Plumbing Solutions",
    tags: ["plumbing", "local-service", "high-value"],
    status: "active",
    customFields: { city: "Austin", state: "TX", monthlyRevenue: "$32,000" },
    subscribedAt: "2025-09-15T08:30:00Z"
  },
  {
    id: "sub-002",
    tenantId: "tenant-brf",
    email: "sarah.kim@elitemedspa.com",
    phone: "(310) 882-5540",
    businessName: "Elite Med Spa & Aesthetics",
    tags: ["med-spa", "high-ticket", "repeat-client"],
    status: "active",
    customFields: {
      city: "Beverly Hills",
      state: "CA",
      monthlyRevenue: "$95,000"
    },
    subscribedAt: "2025-10-02T14:15:00Z"
  },
  {
    id: "sub-003",
    tenantId: "tenant-brf",
    email: "tom.bradley@peakroofing.com",
    phone: "(720) 334-7712",
    businessName: "Peak Roofing & Exteriors",
    tags: ["roofing", "seasonal", "referral"],
    status: "active",
    customFields: { city: "Denver", state: "CO", monthlyRevenue: "$58,000" },
    subscribedAt: "2025-10-11T09:45:00Z"
  },
  {
    id: "sub-004",
    tenantId: "tenant-brf",
    email: "jessica.r@coastalhvac.net",
    phone: "(843) 775-6230",
    businessName: "Coastal Climate HVAC",
    tags: ["hvac", "maintenance-contracts"],
    status: "active",
    customFields: {
      city: "Charleston",
      state: "SC",
      monthlyRevenue: "$41,000"
    },
    subscribedAt: "2025-10-20T11:00:00Z"
  },
  {
    id: "sub-005",
    tenantId: "tenant-brf",
    email: "dr.patel@smileonmain.com",
    phone: "(615) 882-1200",
    businessName: "Smile on Main Dental",
    tags: ["dental", "family-practice", "high-value"],
    status: "active",
    customFields: {
      city: "Nashville",
      state: "TN",
      monthlyRevenue: "$120,000"
    },
    subscribedAt: "2025-11-01T10:30:00Z"
  },
  {
    id: "sub-006",
    tenantId: "tenant-brf",
    email: "ryan.t@texasrestorationpro.com",
    phone: "(214) 556-8812",
    businessName: "Texas Restoration Pros",
    tags: ["restoration", "insurance-work"],
    status: "unsubscribed",
    customFields: { city: "Dallas", state: "TX", monthlyRevenue: "$75,000" },
    subscribedAt: "2025-08-14T13:00:00Z",
    unsubscribedAt: "2025-11-03T09:00:00Z"
  },
  {
    id: "sub-007",
    tenantId: "tenant-brf",
    email: "nicole.w@anchorrealty.com",
    phone: "(813) 992-4400",
    businessName: "Anchor Realty Group",
    tags: ["real-estate", "luxury", "team-lead"],
    status: "active",
    customFields: { city: "Tampa", state: "FL", monthlyRevenue: "$200,000" },
    subscribedAt: "2025-11-10T08:00:00Z"
  },
  {
    id: "sub-008",
    tenantId: "tenant-brf",
    email: "info@carpetcareplus.com",
    phone: "(602) 344-9100",
    businessName: "Carpet Care Plus",
    tags: ["carpet-cleaning", "residential"],
    status: "bounced",
    customFields: { city: "Phoenix", state: "AZ", monthlyRevenue: "$18,000" },
    subscribedAt: "2025-09-28T15:30:00Z"
  },
  {
    id: "sub-009",
    tenantId: "tenant-brf",
    email: "dr.chen@alignchiro.com",
    phone: "(469) 770-5500",
    businessName: "Align Chiropractic Center",
    tags: ["chiropractic", "wellness", "new-patient-focus"],
    status: "active",
    customFields: { city: "Frisco", state: "TX", monthlyRevenue: "$62,000" },
    subscribedAt: "2025-11-15T14:00:00Z"
  },
  {
    id: "sub-010",
    tenantId: "tenant-brf",
    email: "bill.foster@firstchoicemortgage.com",
    phone: "(503) 228-7710",
    businessName: "First Choice Mortgage",
    tags: ["mortgage", "referral-network", "purchase-loans"],
    status: "active",
    customFields: { city: "Portland", state: "OR", monthlyRevenue: "$145,000" },
    subscribedAt: "2025-11-18T09:30:00Z"
  },
  {
    id: "sub-011",
    tenantId: "tenant-brf",
    email: "contact@nwcarpetclean.com",
    phone: "(425) 881-3300",
    businessName: "NW Carpet & Upholstery",
    tags: ["carpet-cleaning", "commercial"],
    status: "complained",
    customFields: { city: "Bellevue", state: "WA", monthlyRevenue: "$22,000" },
    subscribedAt: "2025-10-05T12:00:00Z"
  }
];
const demoCampaigns = [
  {
    id: "cmp-001",
    tenantId: "tenant-brf",
    name: "November Local Service Spotlight",
    subject: "{{businessName}}, here's your November growth plan 🚀",
    htmlBody: "<p>Hi {{firstName}},</p><p>Your competitors are leaving money on the table...</p>",
    plainTextBody: "Hi {{firstName}}, your competitors are leaving money on the table...",
    fromName: "Alex at BRF",
    fromEmail: "alex@bookedrankedfunded.org",
    sentAt: "2025-11-01T09:00:00Z",
    status: "sent",
    tags: ["monthly-spotlight", "all-niches"],
    stats: {
      sentCount: 847,
      openCount: 312,
      clickCount: 89,
      bounceCount: 14,
      unsubscribeCount: 6,
      complaintCount: 1
    }
  },
  {
    id: "cmp-002",
    tenantId: "tenant-brf",
    name: "Q4 Fundability Deep Dive",
    subject: "Your fundability score needs attention before December — here's why",
    htmlBody: "<p>Hi {{firstName}},</p><p>With Q4 in full swing, now is the time...</p>",
    fromName: "BRF Team",
    fromEmail: "team@bookedrankedfunded.org",
    sentAt: "2025-11-12T10:30:00Z",
    status: "sent",
    tags: ["fundability", "credit-builder", "all-niches"],
    stats: {
      sentCount: 621,
      openCount: 258,
      clickCount: 104,
      bounceCount: 9,
      unsubscribeCount: 3,
      complaintCount: 0
    }
  },
  {
    id: "cmp-003",
    tenantId: "tenant-brf",
    name: "Med Spa Year-End Promo Campaign",
    subject: "Luxury clients book more in December — is your calendar ready?",
    htmlBody: "<p>Hi {{firstName}},</p><p>Med spas that capture holiday bookings now...</p>",
    fromName: "BRF Aesthetics",
    fromEmail: "medspa@bookedrankedfunded.org",
    scheduledAt: "2025-12-01T09:00:00Z",
    status: "scheduled",
    tags: ["med-spa", "seasonal", "holiday"],
    stats: {
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      bounceCount: 0,
      unsubscribeCount: 0,
      complaintCount: 0
    }
  },
  {
    id: "cmp-004",
    tenantId: "tenant-brf",
    name: "AI Front Desk Launch — Roofing & Restoration",
    subject: "Never miss a storm lead again — your AI front desk is ready",
    htmlBody: "<p>Hi {{firstName}},</p><p>Roofing season means every missed call is money left behind...</p>",
    fromName: "BRF AI Team",
    fromEmail: "ai@bookedrankedfunded.org",
    status: "draft",
    tags: ["roofing", "restoration", "voice-agent"],
    stats: {
      sentCount: 0,
      openCount: 0,
      clickCount: 0,
      bounceCount: 0,
      unsubscribeCount: 0,
      complaintCount: 0
    }
  },
  {
    id: "cmp-005",
    tenantId: "tenant-brf",
    name: "Real Estate Agent Ranking Push",
    subject: "{{firstName}}, 3 agents in {{city}} are outranking you — let's fix that",
    htmlBody: "<p>Hi {{firstName}},</p><p>We ran a quick SEO check on your market...</p>",
    plainTextBody: "Hi {{firstName}}, we ran a quick SEO check on your market...",
    fromName: "BRF SEO",
    fromEmail: "seo@bookedrankedfunded.org",
    sentAt: "2025-10-22T08:00:00Z",
    status: "sent",
    tags: ["real-estate", "seo", "ranking"],
    stats: {
      sentCount: 293,
      openCount: 142,
      clickCount: 67,
      bounceCount: 4,
      unsubscribeCount: 2,
      complaintCount: 0
    }
  },
  {
    id: "cmp-006",
    tenantId: "tenant-brf",
    name: "Review Velocity Winter Push",
    subject: "Your Google rating is slipping — here's a 48hr fix",
    htmlBody: "<p>Hi {{firstName}},</p><p>Winter can slow review velocity dramatically...</p>",
    fromName: "BRF Reputation",
    fromEmail: "reputation@bookedrankedfunded.org",
    status: "sending",
    tags: ["reputation", "reviews", "all-niches"],
    stats: {
      sentCount: 412,
      openCount: 178,
      clickCount: 52,
      bounceCount: 7,
      unsubscribeCount: 4,
      complaintCount: 0
    }
  }
];
function useSubscribers(_tenantId) {
  return useQuery({
    queryKey: ["newsletter-subscribers", _tenantId],
    queryFn: async () => {
      return demoSubscribers;
    },
    staleTime: 3e4
  });
}
function useCreateSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const newSub = {
        ...input,
        id: `sub-${Date.now()}`,
        subscribedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      return newSub;
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-subscribers", vars.tenantId]
      });
    }
  });
}
function useUpdateSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const existing = demoSubscribers.find((s) => s.id === id) ?? demoSubscribers[0];
      return { ...existing, ...updates, id };
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-subscribers", vars.tenantId]
      });
    }
  });
}
function useDeleteSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_vars) => {
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-subscribers", vars.tenantId]
      });
    }
  });
}
function useCampaigns(_tenantId) {
  return useQuery({
    queryKey: ["newsletter-campaigns", _tenantId],
    queryFn: async () => {
      return demoCampaigns;
    },
    staleTime: 3e4
  });
}
function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => ({
      ...input,
      id: `cmp-${Date.now()}`,
      stats: {
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        unsubscribeCount: 0,
        complaintCount: 0
      }
    }),
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId]
      });
    }
  });
}
function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const existing = demoCampaigns.find((c) => c.id === id) ?? demoCampaigns[0];
      return { ...existing, ...updates, id };
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId]
      });
    }
  });
}
function useSendCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_vars) => {
      await new Promise((r) => setTimeout(r, 800));
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId]
      });
    }
  });
}
function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_vars) => {
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId]
      });
    }
  });
}
function useScheduleCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_vars) => {
      await new Promise((r) => setTimeout(r, 400));
    },
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ["newsletter-campaigns", vars.tenantId]
      });
    }
  });
}
function useNewsletterAnalytics(_tenantId) {
  return useQuery({
    queryKey: ["newsletter-analytics", _tenantId],
    queryFn: async () => {
      {
        const active = demoSubscribers.filter((s) => s.status === "active");
        const sent = demoCampaigns.filter((c) => c.status === "sent");
        const totalSent = sent.reduce((a, c) => a + c.stats.sentCount, 0);
        const totalOpen = sent.reduce((a, c) => a + c.stats.openCount, 0);
        const totalClick = sent.reduce((a, c) => a + c.stats.clickCount, 0);
        const totalBounce = sent.reduce((a, c) => a + c.stats.bounceCount, 0);
        return {
          totalSubscribers: demoSubscribers.length,
          activeSubscribers: active.length,
          totalCampaigns: demoCampaigns.length,
          totalSent,
          avgOpenRate: totalSent > 0 ? totalOpen / totalSent * 100 : 0,
          avgClickRate: totalSent > 0 ? totalClick / totalSent * 100 : 0,
          avgBounceRate: totalSent > 0 ? totalBounce / totalSent * 100 : 0,
          recentCampaigns: demoCampaigns.slice(0, 3)
        };
      }
    },
    staleTime: 6e4
  });
}
function openRate$1(c) {
  if (!c.stats.sentCount) return 0;
  return c.stats.openCount / c.stats.sentCount * 100;
}
function clickRate$1(c) {
  if (!c.stats.sentCount) return 0;
  return c.stats.clickCount / c.stats.sentCount * 100;
}
function formatDate$2(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function StatCard({
  icon,
  label,
  value,
  sub,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-stat-card bg-card border border-border rounded-lg p-4 flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground leading-tight mt-0.5", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-0.5", children: sub })
    ] })
  ] });
}
function AnalyticsTab({ tenantId }) {
  const { data: analytics, isLoading: analyticsLoading } = useNewsletterAnalytics(tenantId);
  const { data: subscribers = [] } = useSubscribers(tenantId);
  const { data: campaigns = [] } = useCampaigns(tenantId);
  const [sortKey, setSortKey] = reactExports.useState("sentAt");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const sentCampaigns = campaigns.filter(
    (c) => c.status === "sent" || c.status === "sending"
  );
  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }
  const sortedCampaigns = [...sentCampaigns].sort((a, b) => {
    let av = 0;
    let bv = 0;
    switch (sortKey) {
      case "name":
        av = a.name;
        bv = b.name;
        break;
      case "sentAt":
        av = a.sentAt ?? "";
        bv = b.sentAt ?? "";
        break;
      case "sentCount":
        av = a.stats.sentCount;
        bv = b.stats.sentCount;
        break;
      case "openRate":
        av = openRate$1(a);
        bv = openRate$1(b);
        break;
      case "clickRate":
        av = clickRate$1(a);
        bv = clickRate$1(b);
        break;
      case "bounceCount":
        av = a.stats.bounceCount;
        bv = b.stats.bounceCount;
        break;
      case "unsubscribeCount":
        av = a.stats.unsubscribeCount;
        bv = b.stats.unsubscribeCount;
        break;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
  const activeCount = subscribers.filter((s) => s.status === "active").length;
  const unsubCount = subscribers.filter(
    (s) => s.status === "unsubscribed"
  ).length;
  const bouncedCount = subscribers.filter((s) => s.status === "bounced").length;
  const complainedCount = subscribers.filter(
    (s) => s.status === "complained"
  ).length;
  const total = subscribers.length || 1;
  function SortIcon({ k }) {
    if (sortKey !== k) return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 opacity-20" });
    return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-primary" });
  }
  if (analyticsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-16 text-center text-muted-foreground text-sm", children: "Loading analytics…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", "data-ocid": "analytics.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary" }),
          label: "Total Subscribers",
          value: ((analytics == null ? void 0 : analytics.totalSubscribers) ?? 0).toLocaleString(),
          sub: `${(analytics == null ? void 0 : analytics.activeSubscribers) ?? 0} active`,
          accent: "bg-primary/15"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5 text-emerald-400" }),
          label: "Campaigns Sent",
          value: ((analytics == null ? void 0 : analytics.totalCampaigns) ?? 0).toString(),
          sub: `${((analytics == null ? void 0 : analytics.totalSent) ?? 0).toLocaleString()} emails out`,
          accent: "bg-emerald-500/15"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-blue-400" }),
          label: "Avg Open Rate",
          value: `${((analytics == null ? void 0 : analytics.avgOpenRate) ?? 0).toFixed(1)}%`,
          sub: "Across all campaigns",
          accent: "bg-blue-500/15"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-rose-400" }),
          label: "Avg Bounce Rate",
          value: `${((analytics == null ? void 0 : analytics.avgBounceRate) ?? 0).toFixed(1)}%`,
          sub: "Hard + soft bounces",
          accent: "bg-rose-500/15"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-foreground", children: "Campaign Performance" })
      ] }),
      sortedCampaigns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "analytics.campaigns.empty_state",
          className: "py-10 text-center text-muted-foreground text-sm",
          children: "No sent campaigns to analyze yet."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/30 border-b border-border", children: [
          { key: "name", label: "Campaign" },
          { key: "sentAt", label: "Sent Date" },
          { key: "sentCount", label: "Sent" },
          { key: "openRate", label: "Open Rate" },
          { key: "clickRate", label: "Click Rate" },
          { key: "bounceCount", label: "Bounces" },
          { key: "unsubscribeCount", label: "Unsubs" }
        ].map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            "data-ocid": `analytics.sort.${key}`,
            className: "text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide py-2.5 px-4 cursor-pointer select-none hover:text-foreground transition-colors",
            onClick: () => toggleSort(key),
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") toggleSort(key);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              label,
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { k: key })
            ] })
          },
          key
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: sortedCampaigns.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `analytics.campaigns.item.${idx + 1}`,
            className: "border-b border-border hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium text-foreground max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: c.name }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap", children: formatDate$2(c.sentAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right font-mono text-xs font-semibold text-foreground", children: c.stats.sentCount.toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-semibold text-emerald-400", children: [
                openRate$1(c).toFixed(1),
                "%"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-semibold text-primary", children: [
                clickRate$1(c).toFixed(1),
                "%"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-mono text-xs font-semibold ${c.stats.bounceCount > 10 ? "text-rose-400" : "text-muted-foreground"}`,
                  children: c.stats.bounceCount
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: c.stats.unsubscribeCount }) })
            ]
          },
          c.id
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-bold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
        "Subscriber Breakdown"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: [
        {
          label: "Active",
          count: activeCount,
          color: "bg-emerald-500",
          textColor: "text-emerald-400"
        },
        {
          label: "Unsubscribed",
          count: unsubCount,
          color: "bg-muted-foreground/40",
          textColor: "text-muted-foreground"
        },
        {
          label: "Bounced",
          count: bouncedCount,
          color: "bg-rose-500",
          textColor: "text-rose-400"
        },
        {
          label: "Complained",
          count: complainedCount,
          color: "bg-amber-500",
          textColor: "text-amber-400"
        }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-24 flex-shrink-0", children: item.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-muted/40 rounded-full h-2 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `h-full rounded-full ${item.color} transition-all duration-500`,
            style: {
              width: `${Math.max(item.count / total * 100, 1)}%`
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-xs font-bold font-mono w-12 text-right ${item.textColor}`,
            children: item.count
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/60 w-10 text-right", children: [
          (item.count / total * 100).toFixed(0),
          "%"
        ] })
      ] }, item.label)) })
    ] })
  ] });
}
const MERGE_TAGS = [
  { label: "{{email}}", description: "Subscriber email" },
  { label: "{{businessName}}", description: "Business name" },
  { label: "{{phone}}", description: "Phone number" },
  { label: "{{firstName}}", description: "First name" },
  { label: "{{city}}", description: "City" }
];
function CampaignComposer({
  open,
  onClose,
  editing,
  tenantId
}) {
  const create = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const send = useSendCampaign();
  const schedule = useScheduleCampaign();
  const [name, setName] = reactExports.useState("");
  const [subject, setSubject] = reactExports.useState("");
  const [fromName, setFromName] = reactExports.useState("Alex at BRF");
  const [fromEmail, setFromEmail] = reactExports.useState("alex@bookedrankedfunded.org");
  const [htmlBody, setHtmlBody] = reactExports.useState("");
  const [plainText, setPlainText] = reactExports.useState("");
  const [tags, setTagsRaw] = reactExports.useState("");
  const [scheduledAt, setScheduledAt] = reactExports.useState("");
  const [previewMode, setPreviewMode] = reactExports.useState("desktop");
  const [showPlain, setShowPlain] = reactExports.useState(false);
  const [showPreview, setShowPreview] = reactExports.useState(true);
  const bodyRef = reactExports.useRef(null);
  const plainRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (editing) {
      setName(editing.name);
      setSubject(editing.subject);
      setFromName(editing.fromName ?? "Alex at BRF");
      setFromEmail(editing.fromEmail ?? "alex@bookedrankedfunded.org");
      setHtmlBody(editing.htmlBody);
      setPlainText(editing.plainTextBody ?? "");
      setTagsRaw(editing.tags.join(", "));
      setScheduledAt(editing.scheduledAt ?? "");
    } else {
      setName("");
      setSubject("");
      setHtmlBody("");
      setPlainText("");
      setTagsRaw("");
      setScheduledAt("");
      setFromName("Alex at BRF");
      setFromEmail("alex@bookedrankedfunded.org");
    }
  }, [editing]);
  function insertMergeTag(tag) {
    const ref = showPlain ? plainRef : bodyRef;
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newVal = el.value.slice(0, start) + tag + el.value.slice(end);
    if (showPlain) {
      setPlainText(newVal);
    } else {
      setHtmlBody(newVal);
    }
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  }
  function buildPayload() {
    return {
      tenantId,
      name,
      subject,
      fromName,
      fromEmail,
      htmlBody,
      plainTextBody: plainText || void 0,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: "draft",
      scheduledAt: scheduledAt || void 0,
      sentAt: void 0
    };
  }
  async function handleSaveDraft() {
    if (editing) {
      await updateCampaign.mutateAsync({
        id: editing.id,
        tenantId,
        updates: buildPayload()
      });
    } else {
      await create.mutateAsync(buildPayload());
    }
    onClose();
  }
  async function handleSend() {
    let campaignId = editing == null ? void 0 : editing.id;
    if (!campaignId) {
      const created = await create.mutateAsync(buildPayload());
      campaignId = created.id;
    }
    await send.mutateAsync({ campaignId, tenantId });
    onClose();
  }
  async function handleSchedule() {
    if (!scheduledAt) return;
    let campaignId = editing == null ? void 0 : editing.id;
    if (!campaignId) {
      const created = await create.mutateAsync(buildPayload());
      campaignId = created.id;
    }
    await schedule.mutateAsync({ campaignId, tenantId, scheduledAt });
    onClose();
  }
  const isPending = create.isPending || updateCampaign.isPending || send.isPending || schedule.isPending;
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "campaigns.composer.dialog",
      className: "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border bg-card flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground", children: editing ? "Edit Campaign" : "New Campaign" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full", children: [
              subject.length,
              " / 200 chars"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "campaigns.composer.preview.toggle",
                variant: "outline",
                size: "sm",
                className: "h-7 text-xs border-border",
                onClick: () => setShowPreview((v) => !v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 mr-1" }),
                  showPreview ? "Hide Preview" : "Show Preview"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "campaigns.composer.close_button",
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7",
                onClick: onClose,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[600px] flex flex-col gap-4 overflow-y-auto p-5 border-r border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Campaign Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "campaigns.composer.name.input",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    placeholder: "November Spotlight — All Niches",
                    className: "bg-muted/40 border-border text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
                  "Subject Line",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 font-normal", children: "(merge tags supported)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "campaigns.composer.subject.input",
                    value: subject,
                    onChange: (e) => setSubject(e.target.value),
                    placeholder: "{{businessName}}, here's your growth plan 🚀",
                    className: "bg-muted/40 border-border text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "From Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "campaigns.composer.from_name.input",
                    value: fromName,
                    onChange: (e) => setFromName(e.target.value),
                    className: "bg-muted/40 border-border text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "From Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "campaigns.composer.from_email.input",
                    type: "email",
                    value: fromEmail,
                    onChange: (e) => setFromEmail(e.target.value),
                    className: "bg-muted/40 border-border text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3 w-3" }),
                "Insert Merge Tag"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: MERGE_TAGS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `campaigns.merge_tag.${m.label.replace(/[{}]/g, "")}`,
                  onClick: () => insertMergeTag(m.label),
                  className: "merge-tag-pill badge-purple px-2 py-1 rounded text-xs font-mono hover:bg-primary/30 transition-colors cursor-pointer",
                  title: m.description,
                  children: m.label
                },
                m.label
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "campaigns.composer.html.tab",
                  onClick: () => setShowPlain(false),
                  className: `text-xs font-semibold px-3 py-1.5 rounded transition-colors ${!showPlain ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`,
                  children: "HTML Body"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "campaigns.composer.plaintext.tab",
                  onClick: () => setShowPlain(true),
                  className: `text-xs font-semibold px-3 py-1.5 rounded transition-colors ${showPlain ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`,
                  children: "Plain Text Fallback"
                }
              )
            ] }),
            !showPlain ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                ref: bodyRef,
                "data-ocid": "campaigns.composer.html.textarea",
                value: htmlBody,
                onChange: (e) => setHtmlBody(e.target.value),
                placeholder: "<p>Hi {{firstName}},</p><p>Your competitors are leaving money on the table...</p>",
                className: "font-mono text-xs bg-muted/40 border-border min-h-[220px] resize-y"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                ref: plainRef,
                "data-ocid": "campaigns.composer.plaintext.textarea",
                value: plainText,
                onChange: (e) => setPlainText(e.target.value),
                placeholder: "Hi {{firstName}}, your competitors are leaving money on the table...",
                className: "font-mono text-xs bg-muted/40 border-border min-h-[120px] resize-y"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Target Tags" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "campaigns.composer.tags.input",
                    value: tags,
                    onChange: (e) => setTagsRaw(e.target.value),
                    placeholder: "all-niches, plumbing, hvac…",
                    className: "bg-muted/40 border-border text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Schedule (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "campaigns.composer.schedule.input",
                    type: "datetime-local",
                    value: scheduledAt,
                    onChange: (e) => setScheduledAt(e.target.value),
                    className: "bg-muted/40 border-border text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 border-t border-border mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "campaigns.composer.save_draft.button",
                  variant: "outline",
                  size: "sm",
                  className: "flex-1 border-border text-xs",
                  disabled: isPending,
                  onClick: handleSaveDraft,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5 mr-1" }),
                    "Save Draft"
                  ]
                }
              ),
              scheduledAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "campaigns.composer.schedule.button",
                  variant: "outline",
                  size: "sm",
                  className: "flex-1 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs",
                  disabled: isPending,
                  onClick: handleSchedule,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 mr-1" }),
                    "Schedule"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "campaigns.composer.send.button",
                  size: "sm",
                  className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs",
                  disabled: isPending,
                  onClick: handleSend,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5 mr-1" }),
                    isPending ? "Sending…" : "Send Now"
                  ]
                }
              )
            ] })
          ] }),
          showPreview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-h-0 bg-muted/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-5 py-2.5 border-b border-border bg-card flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-2", children: "Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "campaigns.composer.preview.desktop",
                  onClick: () => setPreviewMode("desktop"),
                  className: `p-1 rounded transition-colors ${previewMode === "desktop" ? "text-primary bg-primary/15" : "text-muted-foreground hover:text-foreground"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "h-4 w-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "campaigns.composer.preview.mobile",
                  onClick: () => setPreviewMode("mobile"),
                  className: `p-1 rounded transition-colors ${previewMode === "mobile" ? "text-primary bg-primary/15" : "text-muted-foreground hover:text-foreground"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto flex items-start justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `bg-card border border-border rounded-lg overflow-hidden shadow-lg transition-all duration-300 ${previewMode === "mobile" ? "w-[375px]" : "w-full max-w-[640px]"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/60 px-4 py-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0", children: fromName.charAt(0) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: fromName || "Sender" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Now" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: fromEmail || "sender@example.com" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mt-0.5 truncate", children: subject || "No subject" })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: htmlBody ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "iframe",
                    {
                      title: "Email preview",
                      srcDoc: `<!DOCTYPE html><html><body style="font-family:system-ui;font-size:14px;color:#e2e8f0;background:#1a1a2e;margin:0;padding:16px">${htmlBody}</body></html>`,
                      className: "w-full border-0 min-h-[200px]",
                      style: { height: "auto", minHeight: "200px" },
                      sandbox: "allow-same-origin"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/50 text-sm italic", children: "Start typing HTML to see a preview…" }) })
                ]
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
const STATUS_MAP = {
  draft: {
    label: "Draft",
    cls: "bg-muted/60 text-muted-foreground border-border",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3" })
  },
  scheduled: {
    label: "Scheduled",
    cls: "badge-amber",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" })
  },
  sending: {
    label: "Sending",
    cls: "badge-blue",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" })
  },
  sent: {
    label: "Sent",
    cls: "badge-emerald",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3" })
  },
  paused: {
    label: "Paused",
    cls: "badge-rose",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" })
  }
};
function openRate(c) {
  if (!c.stats.sentCount) return null;
  return (c.stats.openCount / c.stats.sentCount * 100).toFixed(1);
}
function clickRate(c) {
  if (!c.stats.sentCount) return null;
  return (c.stats.clickCount / c.stats.sentCount * 100).toFixed(1);
}
function formatDate$1(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function CampaignsTab({ tenantId }) {
  const { data: campaigns = [], isLoading } = useCampaigns(tenantId);
  const deleteCampaign = useDeleteCampaign();
  const [composerOpen, setComposerOpen] = reactExports.useState(false);
  const [editingCampaign, setEditingCampaign] = reactExports.useState(null);
  function handleEdit(c) {
    setEditingCampaign(c);
    setComposerOpen(true);
  }
  function handleDuplicate(c) {
    setEditingCampaign({
      ...c,
      id: `cmp-${Date.now()}`,
      name: `${c.name} (Copy)`,
      status: "draft",
      stats: {
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        bounceCount: 0,
        unsubscribeCount: 0,
        complaintCount: 0
      }
    });
    setComposerOpen(true);
  }
  function handleDelete(c) {
    deleteCampaign.mutate({ id: c.id, tenantId });
  }
  function handleNewCampaign() {
    setEditingCampaign(null);
    setComposerOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", "data-ocid": "campaigns.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        campaigns.length,
        " campaign",
        campaigns.length !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "campaigns.new_campaign.button",
          size: "sm",
          className: "h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs",
          onClick: handleNewCampaign,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
            "New Campaign"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-16 text-muted-foreground text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }),
      " Loading campaigns…"
    ] }) : campaigns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "campaigns.empty_state",
        className: "flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-lg",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-9 w-9 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium text-sm", children: "No campaigns yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-xs", children: "Create your first campaign to start sending newsletters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "mt-1 bg-primary text-primary-foreground",
              onClick: handleNewCampaign,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
                " New Campaign"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: campaigns.map((c, idx) => {
      const s = STATUS_MAP[c.status];
      const or = openRate(c);
      const cr = clickRate(c);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": `campaigns.item.${idx + 1}`,
          className: "campaign-table-row rounded-lg border border-border bg-card hover:border-primary/30 transition-colors p-4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${s.cls}`,
                    children: [
                      s.icon,
                      s.label
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: c.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mb-2", children: c.subject }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-wrap", children: c.tags.slice(0, 4).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "badge-purple px-1.5 py-0.5 rounded text-[10px] font-medium",
                  children: t
                },
                t
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 text-center flex-shrink-0", children: c.status === "sent" || c.status === "sending" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-stat-card flex flex-col items-center min-w-[48px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 text-muted-foreground mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-semibold", children: "Sent" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: c.stats.sentCount.toLocaleString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-stat-card flex flex-col items-center min-w-[48px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 text-emerald-400 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-semibold", children: "Opens" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: or ? `${or}%` : "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-stat-card flex flex-col items-center min-w-[48px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 text-primary mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MousePointerClick, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-semibold", children: "Clicks" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: cr ? `${cr}%` : "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-stat-card flex flex-col items-center min-w-[48px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 text-rose-400 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-semibold", children: "Bounces" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: c.stats.bounceCount })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground/60 italic", children: c.status === "scheduled" ? `Scheduled: ${formatDate$1(c.scheduledAt)}` : "Not yet sent" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
              c.status === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `campaigns.edit_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                  onClick: () => handleEdit(c),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `campaigns.duplicate_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                  title: "Duplicate",
                  onClick: () => handleDuplicate(c),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
                }
              ),
              c.status === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `campaigns.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                  onClick: () => handleDelete(c),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ] })
        },
        c.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CampaignComposer,
      {
        open: composerOpen,
        onClose: () => {
          setComposerOpen(false);
          setEditingCampaign(null);
        },
        editing: editingCampaign,
        tenantId
      }
    )
  ] });
}
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContent,
      {
        role: "alertdialog",
        ...dialogScope,
        ...contentProps,
        ref: composedRefs,
        onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
          var _a;
          event.preventDefault();
          (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
        }),
        onPointerDownOutside: (event) => event.preventDefault(),
        onInteractOutside: (event) => event.preventDefault(),
        children
      }
    ) });
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
  label,
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AlertDialogContent,
    {
      "data-ocid": "subscribers.delete.dialog",
      className: "bg-card border border-border",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-foreground", children: "Delete Subscriber?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-muted-foreground", children: [
            "This will permanently remove",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: label }),
            " from your subscriber list. This action cannot be undone."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogCancel,
            {
              "data-ocid": "subscribers.delete.cancel_button",
              onClick: onCancel,
              className: "border-border",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              "data-ocid": "subscribers.delete.confirm_button",
              onClick: onConfirm,
              disabled: isLoading,
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              children: isLoading ? "Deleting…" : "Delete"
            }
          )
        ] })
      ]
    }
  ) });
}
function SubscriberDrawer({
  open,
  onClose,
  editing,
  tenantId
}) {
  const create = useCreateSubscriber();
  const update = useUpdateSubscriber();
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [businessName, setBusinessName] = reactExports.useState("");
  const [tagsRaw, setTagsRaw] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("active");
  const [customFields, setCustomFields] = reactExports.useState([
    { key: "", value: "", uid: "cf-0" }
  ]);
  reactExports.useEffect(() => {
    if (editing) {
      setEmail(editing.email);
      setPhone(editing.phone ?? "");
      setBusinessName(editing.businessName ?? "");
      setTagsRaw(editing.tags.join(", "));
      setStatus(editing.status);
      const cf = Object.entries(editing.customFields).map(
        ([key, value], i) => ({ key, value, uid: `cf-${i}-${key}` })
      );
      setCustomFields(
        cf.length > 0 ? cf : [{ key: "", value: "", uid: "cf-0" }]
      );
    } else {
      setEmail("");
      setPhone("");
      setBusinessName("");
      setTagsRaw("");
      setStatus("active");
      setCustomFields([{ key: "", value: "", uid: "cf-0" }]);
    }
  }, [editing]);
  function addCustomField() {
    setCustomFields((prev) => [
      ...prev,
      { key: "", value: "", uid: `cf-${Date.now()}` }
    ]);
  }
  function removeCustomField(i) {
    setCustomFields((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updateCustomField(i, field, val) {
    setCustomFields(
      (prev) => prev.map((cf, idx) => idx === i ? { ...cf, [field]: val } : cf)
    );
  }
  function buildRecord() {
    return Object.fromEntries(
      customFields.filter((cf) => cf.key.trim()).map((cf) => [cf.key.trim(), cf.value.trim()])
    );
  }
  function handleSubmit(e) {
    e.preventDefault();
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    if (editing) {
      update.mutate({
        id: editing.id,
        tenantId,
        updates: {
          email,
          phone,
          businessName,
          tags,
          status,
          customFields: buildRecord()
        }
      });
    } else {
      create.mutate({
        tenantId,
        email,
        phone,
        businessName,
        tags,
        status,
        customFields: buildRecord()
      });
    }
    onClose();
  }
  const isPending = create.isPending || update.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SheetContent,
    {
      side: "right",
      "data-ocid": editing ? "subscribers.edit.sheet" : "subscribers.add.sheet",
      className: "w-[420px] sm:w-[480px] bg-card border-l border-border overflow-y-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "pb-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-base font-bold text-foreground", children: editing ? "Edit Subscriber" : "Add Subscriber" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4 pt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
              "Email ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "subscribers.email.input",
                required: true,
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "contact@businessname.com",
                className: "bg-muted/40 border-border text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "subscribers.phone.input",
                type: "tel",
                value: phone,
                onChange: (e) => setPhone(e.target.value),
                placeholder: "(555) 000-0000",
                className: "bg-muted/40 border-border text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Business Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "subscribers.business.input",
                value: businessName,
                onChange: (e) => setBusinessName(e.target.value),
                placeholder: "Acme Plumbing Co.",
                className: "bg-muted/40 border-border text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
              "Tags",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 font-normal", children: "(comma-separated)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "subscribers.tags.input",
                value: tagsRaw,
                onChange: (e) => setTagsRaw(e.target.value),
                placeholder: "plumbing, local-service, high-value",
                className: "bg-muted/40 border-border text-sm"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: status,
                onValueChange: (v) => setStatus(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "data-ocid": "subscribers.status_edit.select",
                      className: "bg-muted/40 border-border text-sm",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unsubscribed", children: "Unsubscribed" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bounced", children: "Bounced" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "complained", children: "Complained" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Custom Fields" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  "data-ocid": "subscribers.add_custom_field.button",
                  className: "h-6 text-xs text-primary hover:text-primary",
                  onClick: addCustomField,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 mr-1" }),
                    "Add field"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: customFields.map((cf, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: cf.key,
                  onChange: (e) => updateCustomField(i, "key", e.target.value),
                  placeholder: "Key",
                  className: "bg-muted/40 border-border text-xs flex-1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: cf.value,
                  onChange: (e) => updateCustomField(i, "value", e.target.value),
                  placeholder: "Value",
                  className: "bg-muted/40 border-border text-xs flex-1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0",
                  onClick: () => removeCustomField(i),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                }
              )
            ] }, cf.uid)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2 border-t border-border mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "subscribers.cancel_button",
                type: "button",
                variant: "outline",
                className: "flex-1 border-border",
                onClick: onClose,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "subscribers.submit_button",
                type: "submit",
                disabled: isPending,
                className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground",
                children: isPending ? "Saving…" : editing ? "Save Changes" : "Add Subscriber"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
const TENANT_ID = "tenant-brf";
const STATUS_BADGE = {
  active: "badge-emerald",
  unsubscribed: "bg-muted text-muted-foreground border border-border",
  bounced: "badge-rose",
  complained: "badge-amber"
};
const STATUS_LABEL = {
  active: "Active",
  unsubscribed: "Unsubscribed",
  bounced: "Bounced",
  complained: "Complained"
};
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function SubscribersTab() {
  const { data: subscribers = [], isLoading } = useSubscribers(TENANT_ID);
  const deleteSubscriber = useDeleteSubscriber();
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState(
    "all"
  );
  const [tagFilter, setTagFilter] = reactExports.useState("all");
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(
    null
  );
  const allTags = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const s of subscribers) {
      for (const t of s.tags) set.add(t);
    }
    return Array.from(set).sort();
  }, [subscribers]);
  const filtered = reactExports.useMemo(() => {
    return subscribers.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.email.toLowerCase().includes(q) || (s.businessName ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchTag = tagFilter === "all" || s.tags.includes(tagFilter);
      return matchSearch && matchStatus && matchTag;
    });
  }, [subscribers, search, statusFilter, tagFilter]);
  function handleEdit(sub) {
    setEditing(sub);
    setDrawerOpen(true);
  }
  function handleDelete(sub) {
    setDeleteTarget(sub);
  }
  function confirmDelete() {
    if (!deleteTarget) return;
    deleteSubscriber.mutate({ id: deleteTarget.id, tenantId: TENANT_ID });
    setDeleteTarget(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", "data-ocid": "subscribers.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "subscribers.search_input",
            placeholder: "Search by email or business…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-8 h-8 bg-muted/40 border-border text-sm"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: statusFilter,
          onValueChange: (v) => setStatusFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                "data-ocid": "subscribers.status.select",
                className: "h-8 w-36 bg-muted/40 border-border text-xs",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All statuses" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unsubscribed", children: "Unsubscribed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bounced", children: "Bounced" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "complained", children: "Complained" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: tagFilter, onValueChange: setTagFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            "data-ocid": "subscribers.tag.select",
            className: "h-8 w-36 bg-muted/40 border-border text-xs",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All tags" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All tags" }),
          allTags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "subscribers.add_button",
          size: "sm",
          className: "h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs ml-auto",
          onClick: () => {
            setEditing(null);
            setDrawerOpen(true);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1" }),
            "Add Subscriber"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30 border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5", children: "Business" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5 hidden md:table-cell", children: "Tags" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5 hidden lg:table-cell", children: "Subscribed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide py-2.5 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: 6,
          className: "text-center py-10 text-muted-foreground text-sm",
          children: "Loading subscribers…"
        }
      ) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: 6,
          "data-ocid": "subscribers.empty_state",
          className: "text-center py-12",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-medium", children: "No subscribers found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-xs", children: "Try adjusting your search or filters" })
          ] })
        }
      ) }) : filtered.map((sub, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          "data-ocid": `subscribers.item.${idx + 1}`,
          className: "border-border hover:bg-muted/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "py-2.5 text-sm font-medium text-foreground min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block max-w-[200px]", children: sub.email }),
              sub.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: sub.phone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5 text-sm text-muted-foreground min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block max-w-[160px]", children: sub.businessName ?? "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 max-w-[200px]", children: [
              sub.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "merge-tag-pill inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium badge-purple",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-2.5 w-2.5" }),
                    tag
                  ]
                },
                tag
              )),
              sub.tags.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                "+",
                sub.tags.length - 3
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_BADGE[sub.status]}`,
                children: STATUS_LABEL[sub.status]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5 text-xs text-muted-foreground hidden lg:table-cell", children: formatDate(sub.subscribedAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `subscribers.edit_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-foreground",
                  onClick: () => handleEdit(sub),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `subscribers.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "icon",
                  className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                  onClick: () => handleDelete(sub),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ] }) })
          ]
        },
        sub.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubscriberDrawer,
      {
        open: drawerOpen,
        onClose: () => {
          setDrawerOpen(false);
          setEditing(null);
        },
        editing,
        tenantId: TENANT_ID
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmModal,
      {
        open: !!deleteTarget,
        onCancel: () => setDeleteTarget(null),
        onConfirm: confirmDelete,
        label: (deleteTarget == null ? void 0 : deleteTarget.email) ?? "",
        isLoading: deleteSubscriber.isPending
      }
    )
  ] });
}
function NewslettersPage() {
  const { data: subscribers = [] } = useSubscribers(TENANT_ID);
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get("tab") || "subscribers";
  const [activeTab, setActiveTab] = reactExports.useState(defaultTab);
  function switchTab(tab) {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }
  const tabs = [
    {
      id: "subscribers",
      label: "Subscribers",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
      badge: subscribers.length
    },
    {
      id: "campaigns",
      label: "Campaigns",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full min-h-0 p-6 gap-5",
      "data-ocid": "newsletters.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground leading-tight", children: "Newsletter Manager" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage subscribers, campaigns, and outreach analytics" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-1 border-b border-border",
            "data-ocid": "newsletters.tabs",
            children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-ocid": `newsletters.${tab.id}.tab`,
                type: "button",
                onClick: () => switchTab(tab.id),
                className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
                children: [
                  tab.icon,
                  tab.label,
                  tab.badge !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary", children: tab.badge })
                ]
              },
              tab.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto", children: [
          activeTab === "subscribers" && /* @__PURE__ */ jsxRuntimeExports.jsx(SubscribersTab, {}),
          activeTab === "campaigns" && /* @__PURE__ */ jsxRuntimeExports.jsx(CampaignsTab, { tenantId: TENANT_ID }),
          activeTab === "analytics" && /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsTab, { tenantId: TENANT_ID })
        ] })
      ]
    }
  );
}
export {
  NewslettersPage as default
};
