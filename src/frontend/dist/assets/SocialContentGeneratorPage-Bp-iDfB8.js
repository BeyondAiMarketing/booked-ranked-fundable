import { bb as useCredentials, r as reactExports, aS as ue, j as jsxRuntimeExports, au as Badge, bc as Check, ak as Sparkles, bd as Tabs, be as TabsList, bf as TabsTrigger, n as ChartNoAxesColumn, bg as TabsContent, aF as ChevronRight, av as Card, aA as CardHeader, aB as CardTitle, aw as CardContent, _ as Select, $ as SelectTrigger, a0 as SelectValue, a1 as SelectContent, a2 as SelectItem, B as Button, an as RefreshCw, T as TrendingUp, bh as Calendar, bi as Target, bj as Lightbulb, bk as Flame, ah as Zap, aL as Dialog, aM as DialogContent, aN as DialogHeader, aO as DialogTitle, g as Textarea, bl as DialogFooter, bm as PenLine, ay as Skeleton, q as Trash2, X } from "./index-CI0aYo5Z.js";
import { u as useSocialMedia } from "./useSocialMedia-CPSV1Ljj.js";
import { g as generateNicheContent, i as iterativeRefine } from "./socialContentService-DPHd5jMo.js";
import { L as Link } from "./link-B9tsHinY.js";
const PLATFORM_OPTIMAL_HOURS = {
  facebook: [9, 13, 15],
  instagram: [11, 14, 17],
  linkedin: [8, 12, 17],
  google_business: [10, 14],
  tiktok: [7, 19, 21]
};
function getSuggestedPostTime(platform, offsetDays) {
  const hours = PLATFORM_OPTIMAL_HOURS[platform];
  const hour = hours[offsetDays % hours.length];
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + offsetDays + 1);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
}
const NICHES = [
  { value: "plumbing", label: "Plumbing", emoji: "🔧" },
  { value: "hvac", label: "HVAC", emoji: "❄️" },
  { value: "restoration", label: "Restoration", emoji: "🏚️" },
  { value: "carpet_cleaning", label: "Carpet Cleaning", emoji: "🧹" },
  { value: "roofing", label: "Roofing", emoji: "🏠" },
  { value: "med_spa", label: "Med Spa", emoji: "💆" },
  { value: "real_estate", label: "Real Estate", emoji: "🏡" },
  { value: "mortgage", label: "Mortgage", emoji: "🏦" },
  { value: "chiropractor", label: "Chiropractor", emoji: "🦴" },
  { value: "dental", label: "Dental", emoji: "🦷" }
];
const PLATFORMS = [
  {
    value: "facebook",
    label: "Facebook",
    colorClass: "platform-facebook",
    hoverBorder: "hover:border-blue-500/50"
  },
  {
    value: "instagram",
    label: "Instagram",
    colorClass: "platform-instagram",
    hoverBorder: "hover:border-pink-500/50"
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    colorClass: "badge-blue",
    hoverBorder: "hover:border-blue-400/50"
  },
  {
    value: "tiktok",
    label: "TikTok",
    colorClass: "badge-rose",
    hoverBorder: "hover:border-rose-500/50"
  },
  {
    value: "google_business",
    label: "Google Business",
    colorClass: "platform-google",
    hoverBorder: "hover:border-orange-500/50"
  }
];
const FUNNEL_STAGE_META = {
  tofu: {
    label: "TOFU",
    colorClass: "badge-blue",
    desc: "Top of Funnel — Awareness"
  },
  mofu: {
    label: "MOFU",
    colorClass: "badge-amber",
    desc: "Middle of Funnel — Consideration"
  },
  bofu: {
    label: "BOFU",
    colorClass: "badge-emerald",
    desc: "Bottom of Funnel — Decision"
  }
};
const GENERATION_STEPS = [
  { label: "Fetching trending topics", icon: TrendingUp },
  { label: "Researching niche intel", icon: Zap },
  { label: "Generating platform-native drafts", icon: PenLine },
  { label: "Refining quality", icon: Sparkles },
  { label: "Complete", icon: Check }
];
function ProgressStepper({ step }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_content_generator.loading_state",
      className: "content-generator-panel space-y-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-primary mb-4", children: "Generating your content…" }),
        GENERATION_STEPS.slice(0, 4).map((s, i) => {
          const Icon = s.icon;
          const isDone = i < step;
          const isActive = i === step;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-center gap-3 text-sm transition-smooth ${isDone ? "text-foreground" : isActive ? "text-primary" : "text-muted-foreground/40"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-smooth ${isDone ? "border-emerald-500/50 bg-emerald-500/15" : isActive ? "border-primary/50 bg-primary/15 animate-pulse-glow" : "border-border bg-transparent"}`,
                    children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Icon,
                      {
                        className: `h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground/30"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isActive ? "font-medium" : "", children: s.label }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 animate-spin text-primary ml-auto" })
              ]
            },
            s.label
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-3 pb-3 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-5/6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-4/6" })
          ] })
        ] }, i)) })
      ]
    }
  );
}
function PostCard({
  post,
  index,
  isSelected,
  isApproved,
  isDiscarded,
  onToggleSelect,
  onEdit,
  onApprove,
  onDiscard
}) {
  const platformMeta = PLATFORMS.find((p) => p.value === post.platform);
  const funnelStage = post.qualityScore >= 85 ? "bofu" : post.qualityScore >= 70 ? "mofu" : "tofu";
  const funnelMeta = FUNNEL_STAGE_META[funnelStage];
  const scoreColor = post.qualityScore >= 85 ? "text-emerald-400" : post.qualityScore >= 70 ? "text-amber-400" : "text-rose-400";
  if (isDiscarded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `content_generator.post.${index + 1}`,
        className: "social-post-card rounded-lg p-3 flex items-center justify-between opacity-40",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground line-through", children: "Post discarded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDiscard,
              className: "text-xs text-primary hover:underline",
              "data-ocid": `content_generator.restore_button.${index + 1}`,
              children: "Restore"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `content_generator.post.${index + 1}`,
      className: `social-post-card rounded-lg transition-smooth ${isApproved ? "social-post-published" : "social-post-draft"} ${isSelected ? "ring-2 ring-primary/60" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onToggleSelect,
              "data-ocid": `content_generator.select_checkbox.${index + 1}`,
              "aria-label": isSelected ? "Deselect post" : "Select post",
              className: `w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-smooth ${isSelected ? "bg-primary border-primary" : "border-border hover:border-primary/50"}`,
              children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary-foreground" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `social-platform-badge ${(platformMeta == null ? void 0 : platformMeta.colorClass) ?? ""}`,
                children: post.platform.replace("_", " ")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `social-platform-badge ${funnelMeta.colorClass}`,
                title: funnelMeta.desc,
                children: funnelMeta.label
              }
            ),
            isApproved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "social-platform-badge badge-emerald", children: "✓ Approved" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm font-bold tabular-nums ${scoreColor}`, children: [
            post.qualityScore,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "/100" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap line-clamp-5", children: post.content }),
          post.hashtags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary/70 mt-2 leading-relaxed", children: post.hashtags.join(" ") }),
          post.ctaText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic mt-1.5", children: post.ctaText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "draft-action-buttons px-4 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: onEdit,
              "data-ocid": `content_generator.edit_button.${index + 1}`,
              className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-3 w-3" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onApprove,
              "data-ocid": `content_generator.approve_button.${index + 1}`,
              className: `flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-smooth ${isApproved ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "draft-approve-btn"}`,
              children: isApproved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
                " Scheduled"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
                " Approve & Schedule"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onDiscard,
              "data-ocid": `content_generator.discard_button.${index + 1}`,
              className: "flex items-center justify-center px-3 py-2 rounded-md text-xs font-semibold draft-discard-btn",
              "aria-label": "Discard post",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
            }
          )
        ] })
      ]
    }
  );
}
function BulkActionsBar({
  selectedCount,
  onApproveAll,
  onScheduleAll,
  onDiscardSelected,
  onClearSelection
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "content_generator.bulk_actions_bar",
      className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-primary/30 shadow-2xl glow-purple-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: selectedCount }),
          " ",
          "selected"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: onApproveAll,
            "data-ocid": "content_generator.bulk_approve_button",
            className: "text-xs gap-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
              "Approve All"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: onScheduleAll,
            "data-ocid": "content_generator.bulk_schedule_button",
            className: "text-xs gap-1.5 text-primary hover:text-primary/80 hover:bg-primary/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
              "Schedule All"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: onDiscardSelected,
            "data-ocid": "content_generator.bulk_discard_button",
            className: "text-xs gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
              "Discard"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClearSelection,
            "data-ocid": "content_generator.bulk_clear_button",
            "aria-label": "Clear selection",
            className: "ml-1 text-muted-foreground hover:text-foreground transition-smooth",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] })
    }
  );
}
function SocialContentGeneratorPage() {
  const { creds } = useCredentials();
  const { getBrandVoiceProfile, createScheduledPost } = useSocialMedia();
  const [niche, setNiche] = reactExports.useState("plumbing");
  const [cadence, setCadence] = reactExports.useState(7);
  const [selectedPlatforms, setSelectedPlatforms] = reactExports.useState([
    "facebook",
    "instagram"
  ]);
  const [isGenerating, setIsGenerating] = reactExports.useState(false);
  const [generationStep, setGenerationStep] = reactExports.useState(0);
  const [batch, setBatch] = reactExports.useState(null);
  const [selectedPostIndices, setSelectedPostIndices] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [approvedIndices, setApprovedIndices] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [discardedIndices, setDiscardedIndices] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [editingIndex, setEditingIndex] = reactExports.useState(null);
  const [editContent, setEditContent] = reactExports.useState("");
  const brandVoice = getBrandVoiceProfile("tenant-1");
  const hasBrandVoice = !!brandVoice;
  const defaultBrandVoice = brandVoice ?? {
    tenantId: "tenant-1",
    tone: "professional",
    vocabulary: [],
    sentenceStyle: "short_punchy",
    emojiUsage: "moderate",
    formality: "medium",
    nicheTerminology: [],
    calibrationPosts: [],
    lastCalibrated: Date.now()
  };
  const togglePlatform = (platform) => {
    setSelectedPlatforms(
      (prev) => prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };
  const runWithProgress = reactExports.useCallback(async () => {
    setGenerationStep(0);
    await new Promise((r) => setTimeout(r, 700));
    setGenerationStep(1);
    await new Promise((r) => setTimeout(r, 700));
    setGenerationStep(2);
    const result = await generateNicheContent({
      niche,
      platforms: selectedPlatforms,
      cadence,
      brandVoiceProfile: defaultBrandVoice,
      perplexityKey: creds == null ? void 0 : creds.perplexityApiKey,
      openAiKey: creds == null ? void 0 : creds.openaiKey,
      claudeKey: creds == null ? void 0 : creds.claudeKey,
      litellmUrl: creds == null ? void 0 : creds.litellmUrl,
      searxngUrl: creds == null ? void 0 : creds.searxngUrl
    });
    setGenerationStep(3);
    await new Promise((r) => setTimeout(r, 500));
    setGenerationStep(4);
    return result;
  }, [niche, selectedPlatforms, cadence, defaultBrandVoice, creds]);
  const handleGenerate = async () => {
    if (selectedPlatforms.length === 0) {
      ue.error("Select at least one platform");
      return;
    }
    setIsGenerating(true);
    setSelectedPostIndices(/* @__PURE__ */ new Set());
    setApprovedIndices(/* @__PURE__ */ new Set());
    setDiscardedIndices(/* @__PURE__ */ new Set());
    setBatch(null);
    try {
      const result = await runWithProgress();
      setBatch(result);
      ue.success(`Generated ${result.posts.length} posts ready to review`);
    } catch {
      ue.error("Generation failed — check your API keys in Go Live");
    } finally {
      setIsGenerating(false);
    }
  };
  const handleApprove = reactExports.useCallback(
    async (index) => {
      if (!batch) return;
      const post = batch.posts[index];
      const scheduledAt = getSuggestedPostTime(
        post.platform,
        approvedIndices.size
      );
      try {
        await createScheduledPost({
          tenantId: "tenant-1",
          content: post.content,
          platforms: [post.platform],
          scheduledAt,
          status: "scheduled",
          niche,
          funnelStage: post.qualityScore >= 85 ? "bofu" : post.qualityScore >= 70 ? "mofu" : "tofu",
          marketingFramework: "hormozi_value_stack",
          ctaType: "booking",
          ctaUrl: "https://bookedrankedfunded.org/setup",
          contentCadence: cadence,
          platformVariants: {},
          beforeAfterPhoto: null,
          tags: [niche]
        });
        setApprovedIndices((prev) => new Set(prev).add(index));
        ue.success(
          `Scheduled for ${new Date(scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric" })}`
        );
      } catch {
        ue.error("Failed to schedule post");
      }
    },
    [batch, niche, cadence, createScheduledPost, approvedIndices.size]
  );
  const handleDiscard = reactExports.useCallback((index) => {
    setDiscardedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    setSelectedPostIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  }, []);
  const handleToggleSelect = reactExports.useCallback((index) => {
    setSelectedPostIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);
  const handleOpenEdit = (index) => {
    if (!batch) return;
    setEditingIndex(index);
    setEditContent(batch.posts[index].content);
  };
  const handleSaveEdit = async () => {
    if (editingIndex === null || !batch) return;
    const post = batch.posts[editingIndex];
    const apiKey = (creds == null ? void 0 : creds.claudeKey) ?? (creds == null ? void 0 : creds.openaiKey) ?? "";
    const { content: refined, qualityScore } = await iterativeRefine(
      editContent,
      defaultBrandVoice,
      post.platform,
      apiKey,
      creds == null ? void 0 : creds.litellmUrl
    );
    const updatedPosts = [...batch.posts];
    updatedPosts[editingIndex] = { ...post, content: refined, qualityScore };
    setBatch({ ...batch, posts: updatedPosts });
    setEditingIndex(null);
    ue.success("Post updated and re-scored");
  };
  const activePosts = (batch == null ? void 0 : batch.posts.filter((_, i) => !discardedIndices.has(i))) ?? [];
  const activeIndices = batch ? batch.posts.map((_, i) => i).filter((i) => !discardedIndices.has(i)) : [];
  const handleBulkApprove = async () => {
    for (const i of selectedPostIndices) {
      if (!approvedIndices.has(i) && !discardedIndices.has(i)) {
        await handleApprove(i);
      }
    }
    setSelectedPostIndices(/* @__PURE__ */ new Set());
  };
  const handleBulkSchedule = async () => {
    await handleBulkApprove();
  };
  const handleBulkDiscard = () => {
    const next = new Set(discardedIndices);
    for (const i of selectedPostIndices) next.add(i);
    setDiscardedIndices(next);
    setSelectedPostIndices(/* @__PURE__ */ new Set());
    ue.success(`Discarded ${selectedPostIndices.size} posts`);
  };
  const selectedCount = selectedPostIndices.size;
  const approvedCount = approvedIndices.size;
  const PERFORMANCE_DATA = {
    benchmarkLabel: niche === "plumbing" ? "plumbing businesses" : `${niche} businesses`,
    performancePct: 34,
    topContentPct: 312,
    tipContentPct: 89,
    insight: niche === "plumbing" ? "Your before/after posts get 3.5x more engagement than tip posts. Generate more before/afters for maximum reach." : niche === "hvac" ? "Seasonal urgency posts (heat wave, cold snap) get 2.8x more engagement than general HVAC tips. Lead with urgency." : niche === "med_spa" ? "Transformation result posts (before/after, testimonials) get 4.1x more engagement than general beauty tips. Show results first." : "Review highlight posts perform 2.6x above average for your niche. Keep amplifying 5-star reviews."
  };
  const PUBLISHED_POSTS_MOCK = [
    {
      id: "pp1",
      content: "AC down during a heat wave? We have emergency slots TODAY.",
      platform: "facebook",
      reach: 1240,
      likes: 87,
      comments: 34,
      shares: 12,
      leads: 3,
      type: "Urgent / Seasonal"
    },
    {
      id: "pp2",
      content: "Before: corroded pipes leaking inside the wall. After: brand new copper line, zero leaks.",
      platform: "instagram",
      reach: 2810,
      likes: 312,
      comments: 67,
      shares: 45,
      leads: 8,
      type: "Before/After"
    },
    {
      id: "pp3",
      content: "Jennifer M. called us with a burst pipe at 8 PM. Our team arrived in 90 minutes.",
      platform: "facebook",
      reach: 890,
      likes: 64,
      comments: 21,
      shares: 8,
      leads: 2,
      type: "Review Highlight"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "social_content_generator.page",
      className: "min-h-screen bg-background",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-dark sticky top-0 z-30 px-4 sm:px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-bold gradient-text-purple font-display truncate", children: "AI Content Generator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 hidden sm:block", children: "AI research + Claude/OpenAI → platform-native posts, auto-refined" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            approvedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "badge-emerald gap-1.5 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
              approvedCount,
              " scheduled"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "badge-purple gap-1.5 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
              "RDT"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Tabs,
          {
            defaultValue: "generator",
            "data-ocid": "social_content_generator.page_tabs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/50 border border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "generator",
                    "data-ocid": "social_content_generator.generator_tab",
                    className: "text-xs gap-1.5 data-[state=active]:bg-card",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
                      "AI Generator"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "performance",
                    "data-ocid": "social_content_generator.performance_tab",
                    className: "text-xs gap-1.5 data-[state=active]:bg-card",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "h-3.5 w-3.5" }),
                      "Performance Intelligence"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "generator", className: "mt-4", children: [
                !hasBrandVoice && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "social_content_generator.empty_state",
                    className: "trending-topic-card flex items-start gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary mt-0.5 flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Brand Voice DNA not calibrated yet" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Content will use defaults. For best results, set up your Brand Voice DNA first." })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "a",
                        {
                          href: "/social-media",
                          className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth flex-shrink-0",
                          "data-ocid": "social_content_generator.brand_voice_link",
                          children: [
                            "Set up ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold text-foreground", children: "Generation Settings" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Niche" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Select,
                          {
                            value: niche,
                            onValueChange: (v) => setNiche(v),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SelectTrigger,
                                {
                                  "data-ocid": "social_content_generator.niche_select",
                                  className: "bg-muted/50",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: NICHES.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: n.value, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2", children: n.emoji }),
                                n.label
                              ] }, n.value)) })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Posts per week" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Select,
                          {
                            value: String(cadence),
                            onValueChange: (v) => setCadence(Number(v)),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SelectTrigger,
                                {
                                  "data-ocid": "social_content_generator.cadence_select",
                                  className: "bg-muted/50",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "3", children: "3 posts/week — light" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "7", children: "7 posts/week — standard" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "14", children: "14 posts/week — aggressive" })
                              ] })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Platforms" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: PLATFORMS.map((p) => {
                        const active = selectedPlatforms.includes(p.value);
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => togglePlatform(p.value),
                            "data-ocid": `social_content_generator.platform_toggle.${p.value}`,
                            className: `px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth min-h-[36px] ${active ? "bg-primary text-primary-foreground border-primary glow-purple-sm" : `bg-muted/40 text-muted-foreground border-border ${p.hoverBorder}`}`,
                            children: p.label
                          },
                          p.value
                        );
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          onClick: handleGenerate,
                          disabled: isGenerating || selectedPlatforms.length === 0,
                          className: "gap-2 font-semibold",
                          "data-ocid": "social_content_generator.generate_button",
                          children: isGenerating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }),
                            " ",
                            "Generating…"
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                            " Generate Week of Content"
                          ] })
                        }
                      ),
                      batch && !isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          onClick: handleGenerate,
                          "data-ocid": "social_content_generator.regenerate_button",
                          className: "gap-1.5 text-muted-foreground",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                            "Regenerate"
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }),
                isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressStepper, { step: generationStep }),
                batch && !isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fade-in", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold text-foreground", children: [
                        activePosts.length,
                        " posts generated"
                      ] }),
                      batch.trendInsights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "badge-blue gap-1 text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
                        batch.trendInsights.length,
                        " trend insights"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: activeIndices.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          const allSelected = activeIndices.every(
                            (i) => selectedPostIndices.has(i)
                          );
                          if (allSelected) {
                            setSelectedPostIndices(/* @__PURE__ */ new Set());
                          } else {
                            setSelectedPostIndices(new Set(activeIndices));
                          }
                        },
                        "data-ocid": "social_content_generator.select_all_toggle",
                        className: "text-xs text-primary hover:text-primary/80 transition-smooth",
                        children: activeIndices.every((i) => selectedPostIndices.has(i)) ? "Deselect all" : "Select all"
                      }
                    ) })
                  ] }),
                  batch.trendInsights.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "content-generator-panel space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3", children: "AI research insights used" }),
                    batch.trendInsights.slice(0, 3).map((insight) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "trending-topic-card flex gap-2 items-start",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5 flex-shrink-0", children: "→" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: insight })
                        ]
                      },
                      insight.slice(0, 50)
                    )),
                    batch.citationUrls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-3 w-3 text-muted-foreground/50" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground/50", children: [
                        batch.citationUrls.length,
                        " source",
                        batch.citationUrls.length !== 1 ? "s" : "",
                        " cited"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: batch.posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    PostCard,
                    {
                      post,
                      index: i,
                      isSelected: selectedPostIndices.has(i),
                      isApproved: approvedIndices.has(i),
                      isDiscarded: discardedIndices.has(i),
                      onToggleSelect: () => handleToggleSelect(i),
                      onEdit: () => handleOpenEdit(i),
                      onApprove: () => handleApprove(i),
                      onDiscard: () => handleDiscard(i)
                    },
                    `${post.platform}-${i}`
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        asChild: true,
                        "data-ocid": "social_content_generator.go_to_scheduler_button",
                        className: "gap-2",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/social-scheduler", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                          "View Schedule"
                        ] })
                      }
                    ),
                    approvedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground self-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 font-semibold", children: approvedCount }),
                      " ",
                      "post",
                      approvedCount !== 1 ? "s" : "",
                      " queued for publishing"
                    ] })
                  ] })
                ] }),
                !batch && !isGenerating && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": "social_content_generator.initial_empty_state",
                    className: "text-center py-20",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center glow-purple-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-7 w-7 text-primary" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: "Ready to generate a week of content" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed", children: "Select your niche, platforms, and cadence above — then hit Generate. AI will research live trends and write platform-native posts in seconds." })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "performance", className: "mt-4 space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-xl p-4 flex items-start gap-3",
                    style: {
                      background: "oklch(0.58 0.22 290 / 8%)",
                      border: "1px solid oklch(0.58 0.22 290 / 20%)"
                    },
                    "data-ocid": "social_content_generator.benchmark_panel",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                          "Your posts perform",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400", children: [
                            "+",
                            PERFORMANCE_DATA.performancePct,
                            "%"
                          ] }),
                          " ",
                          "above average for ",
                          PERFORMANCE_DATA.benchmarkLabel
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: PERFORMANCE_DATA.insight })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Card,
                  {
                    className: "bg-card border-border",
                    "data-ocid": "social_content_generator.content_type_perf",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }),
                        "Content Type Performance",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto text-[10px] bg-primary/10 text-primary border-primary/20", children: niche })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: [
                        {
                          type: "Before/After",
                          engagement: PERFORMANCE_DATA.topContentPct,
                          color: "bg-emerald-500/70",
                          badge: "🔥 Top performer"
                        },
                        {
                          type: "Review Highlight",
                          engagement: 198,
                          color: "bg-primary/70",
                          badge: ""
                        },
                        {
                          type: "Urgent / Seasonal",
                          engagement: 156,
                          color: "bg-amber-500/70",
                          badge: ""
                        },
                        {
                          type: "Educational Tip",
                          engagement: PERFORMANCE_DATA.tipContentPct,
                          color: "bg-muted/60",
                          badge: ""
                        },
                        {
                          type: "Behind the Scenes",
                          engagement: 72,
                          color: "bg-muted/40",
                          badge: ""
                        }
                      ].map(({ type, engagement, color, badge }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          "data-ocid": `social_content_generator.content_type.${type.toLowerCase().replace(/[\s/]+/g, "_")}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: type }),
                                badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-400", children: badge })
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
                                engagement,
                                " avg eng."
                              ] })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted/30 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: `h-full rounded-full ${color}`,
                                style: {
                                  width: `${Math.round(engagement / 350 * 100)}%`
                                }
                              }
                            ) })
                          ]
                        },
                        type
                      )) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Card,
                  {
                    className: "bg-card border-border",
                    "data-ocid": "social_content_generator.published_tracking",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "h-4 w-4 text-primary" }),
                        "Published Post Tracking"
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: PUBLISHED_POSTS_MOCK.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          "data-ocid": `social_content_generator.published_post.${i + 1}`,
                          className: "rounded-xl bg-muted/20 border border-border p-3 space-y-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground line-clamp-2 flex-1", children: post.content }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Badge,
                                {
                                  variant: "secondary",
                                  className: "text-[10px] shrink-0",
                                  children: post.type
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2", children: [
                              { label: "Reach", value: post.reach.toLocaleString() },
                              { label: "Likes", value: post.likes },
                              { label: "Comments", value: post.comments },
                              { label: "Shares", value: post.shares },
                              {
                                label: "Leads",
                                value: post.leads,
                                highlight: post.leads > 0
                              }
                            ].map(({ label, value, highlight }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "p",
                                {
                                  className: `text-sm font-bold ${highlight ? "text-amber-400" : "text-foreground"}`,
                                  children: value
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: label })
                            ] }, label)) })
                          ]
                        },
                        post.id
                      )) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Card,
                  {
                    className: "bg-card border-border",
                    "data-ocid": "social_content_generator.ai_suggestions",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 text-amber-400" }),
                        "AI Content Suggestions"
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: [
                        {
                          title: "Generate more before/afters",
                          body: `Your before/after posts get ${Math.round(PERFORMANCE_DATA.topContentPct / PERFORMANCE_DATA.tipContentPct)}x more engagement than tips. Create 3 this week.`,
                          hot: true
                        },
                        {
                          title: "Add a review highlight this week",
                          body: "You haven't posted a review highlight in 6 days. These consistently drive leads for your niche.",
                          hot: false
                        },
                        {
                          title: "Seasonal urgency post",
                          body: "Urgency-framed posts (limited slots, end of season) get 2.8x more engagement for service businesses.",
                          hot: false
                        }
                      ].map(({ title, body, hot }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `rounded-xl p-3 border flex items-start gap-3 ${hot ? "bg-amber-500/5 border-amber-500/20" : "bg-muted/20 border-border"}`,
                          "data-ocid": `social_content_generator.suggestion.${title.toLowerCase().replace(/\s+/g, "_").slice(0, 30)}`,
                          children: [
                            hot ? /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-amber-400 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: title }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 leading-snug", children: body })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Button,
                              {
                                size: "sm",
                                variant: "outline",
                                className: "text-xs shrink-0 border-primary/30 text-primary hover:bg-primary/10",
                                "data-ocid": `social_content_generator.suggestion_action.${title.toLowerCase().replace(/\s+/g, "_").slice(0, 20)}`,
                                onClick: () => ue.info(
                                  "Switching to generator with this template pre-filled"
                                ),
                                children: "Generate"
                              }
                            )
                          ]
                        },
                        title
                      )) })
                    ]
                  }
                )
              ] })
            ]
          }
        ) }),
        selectedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          BulkActionsBar,
          {
            selectedCount,
            onApproveAll: handleBulkApprove,
            onScheduleAll: handleBulkSchedule,
            onDiscardSelected: handleBulkDiscard,
            onClearSelection: () => setSelectedPostIndices(/* @__PURE__ */ new Set())
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: editingIndex !== null,
            onOpenChange: (open) => !open && setEditingIndex(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DialogContent,
              {
                "data-ocid": "content_generator.edit_dialog",
                className: "bg-card border-border max-w-lg",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground", children: "Edit Post" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        value: editContent,
                        onChange: (e) => setEditContent(e.target.value),
                        rows: 7,
                        className: "bg-muted/50 border-border text-foreground resize-none focus:border-primary",
                        "data-ocid": "content_generator.edit_textarea",
                        placeholder: "Edit your post content…"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Saving will re-score your post with AI quality analysis." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        onClick: () => setEditingIndex(null),
                        "data-ocid": "content_generator.edit_cancel_button",
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        onClick: handleSaveEdit,
                        "data-ocid": "content_generator.edit_save_button",
                        className: "gap-1.5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
                          "Save & Re-score"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  SocialContentGeneratorPage as default
};
