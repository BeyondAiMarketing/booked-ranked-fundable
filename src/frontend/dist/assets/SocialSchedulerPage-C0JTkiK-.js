import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, br as TooltipProvider, bl as Calendar, aF as Funnel, B as Button, l as LoaderCircle, bg as Check, P as Plus, aw as Skeleton, b0 as ChevronLeft, aD as ChevronRight, aS as ScrollArea, as as Badge, i as Clock, aQ as ue, bs as Tooltip, bt as TooltipTrigger, bu as TooltipContent, q as Trash2, aJ as Dialog, aK as DialogContent, aL as DialogHeader, aM as DialogTitle, L as Label, g as Textarea, Y as Select, Z as SelectTrigger, _ as SelectValue, $ as SelectContent, a0 as SelectItem, bp as DialogFooter, S as Send } from "./index-CSMRpKtY.js";
import { u as useSocialMedia } from "./useSocialMedia-BckRJjjf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
const PLATFORMS = [
  "facebook",
  "instagram",
  "linkedin",
  "tiktok",
  "google_business"
];
const PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  google_business: "Google"
};
const PLATFORM_CHAR_LIMITS = {
  facebook: 63e3,
  instagram: 2200,
  linkedin: 3e3,
  tiktok: 2200,
  google_business: 1500
};
const PLATFORM_COLORS = {
  facebook: "oklch(0.6 0.18 240)",
  instagram: "oklch(0.72 0.18 20)",
  linkedin: "oklch(0.55 0.18 240)",
  tiktok: "oklch(0.96 0.008 280)",
  google_business: "oklch(0.65 0.2 25)"
};
const PLATFORM_BG = {
  facebook: "bg-[oklch(0.6_0.18_240/15%)] text-[oklch(0.76_0.14_240)]",
  instagram: "bg-[oklch(0.72_0.18_20/15%)] text-[oklch(0.82_0.14_20)]",
  linkedin: "bg-[oklch(0.55_0.18_240/15%)] text-[oklch(0.72_0.14_240)]",
  tiktok: "bg-muted/40 text-foreground",
  google_business: "bg-[oklch(0.65_0.2_25/15%)] text-[oklch(0.82_0.14_25)]"
};
const STATUS_STYLES = {
  draft: {
    label: "Draft",
    className: "status-draft",
    borderColor: "oklch(0.2 0.018 280)"
  },
  scheduled: {
    label: "Scheduled",
    className: "status-pending",
    borderColor: "oklch(0.72 0.18 75)"
  },
  published: {
    label: "Published",
    className: "status-paid",
    borderColor: "oklch(0.62 0.18 155)"
  },
  failed: {
    label: "Failed",
    className: "badge-rose",
    borderColor: "oklch(0.62 0.2 15)"
  },
  paused: {
    label: "Paused",
    className: "status-draft",
    borderColor: "oklch(0.2 0.018 280)"
  }
};
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function getWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatTime(ms) {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}
function formatDateHeader(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}
function toDatetimeLocal(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `text-[10px] font-semibold px-1.5 py-0.5 rounded ${s.className}`,
      children: s.label
    }
  );
}
function PlatformChip({ platform }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `social-platform-badge ${PLATFORM_BG[platform]}`, children: PLATFORM_LABELS[platform] });
}
function CalendarPostCard({
  post,
  onClick
}) {
  const borderColor = STATUS_STYLES[post.status].borderColor;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick,
        className: "w-full text-left p-1.5 rounded border border-border/60 bg-background hover:bg-accent/30 transition-smooth group cursor-pointer",
        style: { borderLeft: `3px solid ${borderColor}` },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mb-0.5 flex-wrap", children: [
            post.platforms.slice(0, 2).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "w-1.5 h-1.5 rounded-full shrink-0",
                style: { backgroundColor: PLATFORM_COLORS[p] }
              },
              p
            )),
            post.platforms.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground", children: [
              "+",
              post.platforms.length - 2
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-foreground line-clamp-2 leading-tight", children: post.content }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: formatTime(post.scheduledAt) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      TooltipContent,
      {
        side: "right",
        className: "max-w-xs bg-popover border border-border p-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground mb-2", children: post.content }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
            post.platforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformChip, { platform: p }, p)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: post.status })
          ] })
        ]
      }
    )
  ] }) });
}
function QueueItem({
  post,
  index,
  onEdit,
  onDelete
}) {
  const borderColor = STATUS_STYLES[post.status].borderColor;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": `social_scheduler.item.${index + 1}`,
      className: "social-post-card rounded-lg p-3 mb-2",
      style: { borderLeft: `3px solid ${borderColor}` },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: post.status }),
            post.platforms.slice(0, 2).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformChip, { platform: p }, p))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground line-clamp-2 mb-1", children: post.content }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
            new Date(post.scheduledAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            }),
            " ",
            "· ",
            formatTime(post.scheduledAt)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onEdit(post),
              "data-ocid": `social_scheduler.edit_button.${index + 1}`,
              className: "p-1.5 rounded hover:bg-accent/40 transition-smooth text-muted-foreground hover:text-foreground",
              "aria-label": "Edit post",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onDelete(post.id),
              "data-ocid": `social_scheduler.delete_button.${index + 1}`,
              className: "p-1.5 rounded hover:bg-destructive/20 transition-smooth text-muted-foreground hover:text-destructive",
              "aria-label": "Delete post",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
            }
          )
        ] })
      ] })
    }
  );
}
const DEFAULT_FORM = {
  content: "",
  platforms: ["facebook"],
  scheduledAt: toDatetimeLocal(Date.now() + 36e5),
  status: "scheduled",
  niche: "plumbing",
  funnelStage: "tofu",
  marketingFramework: "hormozi_value_stack",
  ctaType: "booking",
  ctaUrl: "https://bookedrankedfunded.org/setup",
  tags: ""
};
function PostFormModal({
  open,
  onClose,
  onSave,
  initial,
  isSaving
}) {
  const [form, setForm] = reactExports.useState(initial ?? DEFAULT_FORM);
  const [activePlatformPreview, setActivePlatformPreview] = reactExports.useState("facebook");
  reactExports.useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);
  const charLimit = PLATFORM_CHAR_LIMITS[activePlatformPreview];
  const charCount = form.content.length;
  const charOver = charCount > charLimit;
  function togglePlatform(p) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p]
    }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      "data-ocid": "social_scheduler.dialog",
      className: "bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: initial ? "Edit Post" : "New Post" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-2 block", children: "Platforms" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-wrap gap-2",
                "data-ocid": "social_scheduler.platform_select",
                children: PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => togglePlatform(p),
                    className: `px-3 py-1.5 rounded-md text-xs font-semibold border transition-smooth ${form.platforms.includes(p) ? "bg-primary/20 border-primary/50 text-primary" : "bg-muted/30 border-border text-muted-foreground hover:border-border/80"}`,
                    children: PLATFORM_LABELS[p]
                  },
                  p
                ))
              }
            )
          ] }),
          form.platforms.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b border-border pb-2", children: form.platforms.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setActivePlatformPreview(p),
              className: `text-xs px-2 py-1 rounded-t transition-smooth ${activePlatformPreview === p ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`,
              children: PLATFORM_LABELS[p]
            },
            p
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "post-content",
                className: "text-xs text-muted-foreground mb-2 block",
                children: [
                  "Content for ",
                  PLATFORM_LABELS[activePlatformPreview]
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "post-content",
                "data-ocid": "social_scheduler.textarea",
                value: form.content,
                onChange: (e) => setForm((f) => ({ ...f, content: e.target.value })),
                placeholder: `Write your ${PLATFORM_LABELS[activePlatformPreview]} post here...`,
                className: "bg-background border-input min-h-[120px] resize-none text-sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                "Limit: ",
                charLimit.toLocaleString(),
                " chars"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `text-[10px] font-mono ${charOver ? "text-destructive" : charCount > charLimit * 0.9 ? "text-[oklch(0.72_0.18_75)]" : "text-muted-foreground"}`,
                  children: [
                    charCount.toLocaleString(),
                    " / ",
                    charLimit.toLocaleString()
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "post-datetime",
                className: "text-xs text-muted-foreground mb-2 block",
                children: "Schedule Date & Time"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "post-datetime",
                type: "datetime-local",
                "data-ocid": "social_scheduler.schedule_input",
                value: form.scheduledAt,
                onChange: (e) => setForm((f) => ({ ...f, scheduledAt: e.target.value })),
                className: "w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-2 block", children: "Niche" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.niche,
                  onValueChange: (v) => setForm((f) => ({ ...f, niche: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "social_scheduler.niche_select",
                        className: "bg-background border-input text-sm h-9",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-popover border-border", children: [
                      "plumbing",
                      "hvac",
                      "restoration",
                      "carpet_cleaning",
                      "roofing",
                      "med_spa",
                      "real_estate",
                      "mortgage",
                      "chiropractor",
                      "dental"
                    ].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectItem,
                      {
                        value: n,
                        className: "text-sm capitalize",
                        children: n.replace("_", " ")
                      },
                      n
                    )) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-2 block", children: "Funnel Stage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.funnelStage,
                  onValueChange: (v) => setForm((f) => ({ ...f, funnelStage: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "social_scheduler.funnel_select",
                        className: "bg-background border-input text-sm h-9",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-popover border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "tofu", children: "TOFU — Awareness" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mofu", children: "MOFU — Consideration" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bofu", children: "BOFU — Decision" })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "post-cta",
                className: "text-xs text-muted-foreground mb-2 block",
                children: "CTA URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "post-cta",
                type: "url",
                "data-ocid": "social_scheduler.cta_input",
                value: form.ctaUrl,
                onChange: (e) => setForm((f) => ({ ...f, ctaUrl: e.target.value })),
                placeholder: "https://bookedrankedfunded.org/setup",
                className: "w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "post-tags",
                className: "text-xs text-muted-foreground mb-2 block",
                children: "Tags (comma-separated)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "post-tags",
                type: "text",
                "data-ocid": "social_scheduler.tags_input",
                value: form.tags,
                onChange: (e) => setForm((f) => ({ ...f, tags: e.target.value })),
                placeholder: "plumbing, water-heater, maintenance",
                className: "w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: onClose,
              "data-ocid": "social_scheduler.cancel_button",
              disabled: isSaving,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => onSave(form, true),
              "data-ocid": "social_scheduler.save_draft_button",
              disabled: isSaving || !form.content.trim() || form.platforms.length === 0,
              children: "Save as Draft"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => onSave(form, false),
              "data-ocid": "social_scheduler.submit_button",
              disabled: isSaving || !form.content.trim() || form.platforms.length === 0 || charOver,
              children: [
                isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
                initial ? "Save Changes" : "Schedule Post"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function SocialSchedulerPage() {
  const {
    scheduledPosts,
    getScheduledPosts,
    createScheduledPost,
    updateScheduledPost,
    isLoadingScheduled
  } = useSocialMedia();
  const [view, setView] = reactExports.useState("week");
  const [weekStart, setWeekStart] = reactExports.useState(() => getWeekStart(/* @__PURE__ */ new Date()));
  const [activePlatforms, setActivePlatforms] = reactExports.useState(
    new Set(PLATFORMS)
  );
  const [newModalOpen, setNewModalOpen] = reactExports.useState(false);
  const [editPost, setEditPost] = reactExports.useState(null);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [isBulkPublishing, setIsBulkPublishing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    void getScheduledPosts("tenant-1");
  }, []);
  const weekDays = reactExports.useMemo(() => getWeekDays(weekStart), [weekStart]);
  const filteredPosts = reactExports.useMemo(() => {
    return scheduledPosts.filter(
      (p) => p.platforms.some((pl) => activePlatforms.has(pl))
    );
  }, [scheduledPosts, activePlatforms]);
  const calendarMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const day of weekDays) {
      const dayKey = day.toDateString();
      const byPlatform = /* @__PURE__ */ new Map();
      for (const pl of PLATFORMS) byPlatform.set(pl, []);
      for (const post of filteredPosts) {
        const postDay = new Date(post.scheduledAt);
        if (isSameDay(postDay, day)) {
          for (const pl of post.platforms) {
            if (activePlatforms.has(pl)) {
              const arr = byPlatform.get(pl) ?? [];
              arr.push(post);
              byPlatform.set(pl, arr);
            }
          }
        }
      }
      map.set(dayKey, byPlatform);
    }
    return map;
  }, [filteredPosts, weekDays, activePlatforms]);
  const upcomingQueue = reactExports.useMemo(
    () => filteredPosts.filter((p) => p.status === "scheduled" || p.status === "draft").sort((a, b) => a.scheduledAt - b.scheduledAt),
    [filteredPosts]
  );
  const listGroups = reactExports.useMemo(() => {
    const sorted = [...filteredPosts].sort(
      (a, b) => a.scheduledAt - b.scheduledAt
    );
    const groups = [];
    for (const post of sorted) {
      const label = formatDateHeader(new Date(post.scheduledAt));
      const existing = groups.find((g) => g.dateLabel === label);
      if (existing) existing.posts.push(post);
      else groups.push({ dateLabel: label, posts: [post] });
    }
    return groups;
  }, [filteredPosts]);
  function togglePlatformFilter(p) {
    setActivePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) {
        if (next.size === 1) return prev;
        next.delete(p);
      } else {
        next.add(p);
      }
      return next;
    });
  }
  async function handleSavePost(form, asDraft) {
    if (!form.content.trim() || form.platforms.length === 0) return;
    setIsSaving(true);
    try {
      const scheduledAtMs = new Date(form.scheduledAt).getTime();
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (editPost) {
        await updateScheduledPost(editPost.id, {
          content: form.content,
          platforms: form.platforms,
          scheduledAt: scheduledAtMs,
          status: asDraft ? "draft" : "scheduled",
          niche: form.niche,
          funnelStage: form.funnelStage,
          marketingFramework: form.marketingFramework,
          ctaType: form.ctaType,
          ctaUrl: form.ctaUrl,
          tags
        });
        ue.success("Post updated");
        setEditPost(null);
      } else {
        await createScheduledPost({
          tenantId: "tenant-1",
          content: form.content,
          platforms: form.platforms,
          scheduledAt: scheduledAtMs,
          status: asDraft ? "draft" : "scheduled",
          niche: form.niche,
          funnelStage: form.funnelStage,
          marketingFramework: form.marketingFramework,
          ctaType: form.ctaType,
          ctaUrl: form.ctaUrl,
          contentCadence: 7,
          platformVariants: {},
          beforeAfterPhoto: null,
          tags
        });
        ue.success(asDraft ? "Saved as draft" : "Post scheduled");
        setNewModalOpen(false);
      }
    } catch {
      ue.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  }
  async function handleDelete(id) {
    await updateScheduledPost(id, { status: "paused" });
    ue.success("Post removed from queue");
  }
  async function handleBulkPublish() {
    const approved = filteredPosts.filter((p) => p.status === "scheduled");
    if (approved.length === 0) {
      ue("No scheduled posts to publish");
      return;
    }
    setIsBulkPublishing(true);
    try {
      await Promise.all(
        approved.map((p) => updateScheduledPost(p.id, { status: "published" }))
      );
      ue.success(`${approved.length} posts marked as published`);
    } catch {
      ue.error("Bulk publish failed");
    } finally {
      setIsBulkPublishing(false);
    }
  }
  function openEditModal(post) {
    setEditPost(post);
  }
  const editFormInitial = editPost ? {
    content: editPost.content,
    platforms: editPost.platforms,
    scheduledAt: toDatetimeLocal(editPost.scheduledAt),
    status: editPost.status,
    niche: editPost.niche,
    funnelStage: editPost.funnelStage,
    marketingFramework: editPost.marketingFramework,
    ctaType: editPost.ctaType,
    ctaUrl: editPost.ctaUrl,
    tags: editPost.tags.join(", ")
  } : void 0;
  const scheduledCount = filteredPosts.filter(
    (p) => p.status === "scheduled"
  ).length;
  const publishedCount = filteredPosts.filter(
    (p) => p.status === "published"
  ).length;
  const draftCount = filteredPosts.filter((p) => p.status === "draft").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_scheduler.page",
      className: "flex flex-col h-full min-h-0",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scheduler-panel border-b border-border rounded-none px-4 py-3 flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground leading-tight", children: "Social Scheduler" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Schedule & manage posts across all platforms" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-lg border border-border overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setView("week"),
                  "data-ocid": "social_scheduler.week_tab",
                  className: `px-3 py-1.5 text-xs font-medium transition-smooth flex items-center gap-1.5 ${view === "week" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Week" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setView("list"),
                  "data-ocid": "social_scheduler.list_tab",
                  className: `px-3 py-1.5 text-xs font-medium transition-smooth flex items-center gap-1.5 border-l border-border ${view === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "List" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleBulkPublish,
                disabled: isBulkPublishing || scheduledCount === 0,
                "data-ocid": "social_scheduler.bulk_publish_button",
                className: "scheduler-bulk-publish border-0 text-xs h-8",
                children: [
                  isBulkPublishing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "Publish All (",
                  scheduledCount,
                  ")"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => setNewModalOpen(true),
                "data-ocid": "social_scheduler.new_post_button",
                className: "h-8 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                  "New Post"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 flex items-center gap-2 border-b border-border bg-card/50 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Platforms:" }),
          PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => togglePlatformFilter(p),
              "data-ocid": `social_scheduler.platform_filter.${p}`,
              className: `px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-smooth ${activePlatforms.has(p) ? "bg-primary/20 border-primary/40 text-primary" : "bg-muted/20 border-border/60 text-muted-foreground opacity-50 hover:opacity-70"}`,
              children: PLATFORM_LABELS[p]
            },
            p
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-3 text-[10px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-amber rounded px-1.5 py-0.5", children: [
              scheduledCount,
              " scheduled"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-emerald rounded px-1.5 py-0.5", children: [
              publishedCount,
              " published"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-draft rounded px-1.5 py-0.5", children: [
              draftCount,
              " drafts"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col min-w-0", children: [
            isLoadingScheduled && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                "data-ocid": "social_scheduler.loading_state",
                className: "p-6 space-y-3",
                children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }, i))
              }
            ),
            !isLoadingScheduled && view === "week" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 min-h-0 overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-border bg-card/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const prev = new Date(weekStart);
                      prev.setDate(prev.getDate() - 7);
                      setWeekStart(prev);
                    },
                    "data-ocid": "social_scheduler.week_prev",
                    className: "p-1.5 rounded hover:bg-accent/30 transition-smooth text-muted-foreground hover:text-foreground",
                    "aria-label": "Previous week",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
                  weekDays[0].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                  }),
                  " ",
                  "–",
                  " ",
                  weekDays[6].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const next = new Date(weekStart);
                      next.setDate(next.getDate() + 7);
                      setWeekStart(next);
                    },
                    "data-ocid": "social_scheduler.week_next",
                    className: "p-1.5 rounded hover:bg-accent/30 transition-smooth text-muted-foreground hover:text-foreground",
                    "aria-label": "Next week",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[700px]", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-card/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 text-[10px] font-semibold text-muted-foreground uppercase", children: "Platform" }),
                  weekDays.map((day, i) => {
                    const isToday = isSameDay(day, /* @__PURE__ */ new Date());
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "p-2 text-center border-l border-border/40",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: `text-[10px] font-semibold uppercase ${isToday ? "text-primary" : "text-muted-foreground"}`,
                              children: DAYS[i]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: `text-base font-bold ${isToday ? "text-primary" : "text-foreground"}`,
                              children: day.getDate()
                            }
                          )
                        ]
                      },
                      day.toDateString()
                    );
                  })
                ] }),
                PLATFORMS.filter((p) => activePlatforms.has(p)).map(
                  (platform) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "grid grid-cols-[80px_repeat(7,1fr)] border-b border-border/30",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "p-2 flex items-center",
                            style: {
                              borderLeft: `3px solid ${PLATFORM_COLORS[platform]}`
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground", children: PLATFORM_LABELS[platform] })
                          }
                        ),
                        weekDays.map((day) => {
                          var _a;
                          const dayPosts = ((_a = calendarMap.get(day.toDateString())) == null ? void 0 : _a.get(platform)) ?? [];
                          const isToday = isSameDay(day, /* @__PURE__ */ new Date());
                          return /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: `p-1.5 border-l border-border/30 min-h-[70px] ${isToday ? "bg-primary/5" : "bg-background/20"}`,
                              children: dayPosts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                CalendarPostCard,
                                {
                                  post,
                                  onClick: () => openEditModal(post)
                                },
                                `${post.id}-${platform}`
                              ))
                            },
                            day.toDateString()
                          );
                        })
                      ]
                    },
                    platform
                  )
                )
              ] }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden flex-1 overflow-auto", children: listGroups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "social_scheduler.empty_state",
                  className: "flex flex-col items-center justify-center py-16 px-4 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-muted-foreground/30 mb-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No posts this week" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Create your first post to fill the calendar" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        className: "mt-4",
                        onClick: () => setNewModalOpen(true),
                        "data-ocid": "social_scheduler.empty_new_post_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                          "New Post"
                        ]
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 space-y-4", children: listGroups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: group.dateLabel }),
                group.posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  QueueItem,
                  {
                    post,
                    index: i,
                    onEdit: openEditModal,
                    onDelete: handleDelete
                  },
                  post.id
                ))
              ] }, group.dateLabel)) }) })
            ] }),
            !isLoadingScheduled && view === "list" && /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: listGroups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "social_scheduler.empty_state",
                className: "flex flex-col items-center justify-center py-20 text-center px-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-14 w-14 text-muted-foreground/25 mb-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground mb-1", children: "No posts scheduled" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Schedule posts to see them here — or generate content first." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        onClick: () => setNewModalOpen(true),
                        "data-ocid": "social_scheduler.empty_new_post_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                          "New Post"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/social-content-generator", children: "Generate Content" }) })
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-4 space-y-6", children: listGroups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: group.dateLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: group.posts.length })
              ] }),
              group.posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                QueueItem,
                {
                  post,
                  index: i,
                  onEdit: openEditModal,
                  onDelete: handleDelete
                },
                post.id
              ))
            ] }, group.dateLabel)) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex flex-col w-64 xl:w-72 border-l border-border bg-card/30 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-3 border-b border-border flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Upcoming Queue" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: upcomingQueue.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "flex-1 px-2 py-2", children: [
              isLoadingScheduled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, i)) }),
              !isLoadingScheduled && upcomingQueue.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "social_scheduler.queue_empty_state",
                  className: "flex flex-col items-center justify-center py-10 text-center px-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-8 w-8 text-muted-foreground/25 mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No upcoming posts" })
                  ]
                }
              ),
              !isLoadingScheduled && upcomingQueue.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                QueueItem,
                {
                  post,
                  index: i,
                  onEdit: openEditModal,
                  onDelete: handleDelete
                },
                post.id
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setNewModalOpen(true),
                "data-ocid": "social_scheduler.sidebar_new_post_button",
                className: "w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-smooth bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  "Schedule New Post"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PostFormModal,
          {
            open: newModalOpen,
            onClose: () => setNewModalOpen(false),
            onSave: handleSavePost,
            isSaving
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PostFormModal,
          {
            open: !!editPost,
            onClose: () => setEditPost(null),
            onSave: handleSavePost,
            initial: editFormInitial,
            isSaving
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setNewModalOpen(true),
            "data-ocid": "social_scheduler.fab_button",
            className: "lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg glow-purple-sm bg-primary text-primary-foreground z-50 transition-smooth hover:scale-105 active:scale-95",
            "aria-label": "New post",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" })
          }
        )
      ]
    }
  ) });
}
export {
  SocialSchedulerPage as default
};
