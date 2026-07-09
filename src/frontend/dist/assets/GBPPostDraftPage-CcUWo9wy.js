import { r as reactExports, j as jsxRuntimeExports, P as Plus, aA as CircleCheck, bl as Calendar, an as Building2, i as Clock, bq as PenLine, E as Eye, S as Send, q as Trash2 } from "./index-Dwzp0QDY.js";
const DEMO_POSTS = [
  {
    id: "1",
    postType: "service highlight",
    title: "Roof Inspection Special",
    hook: "Is your roof ready for storm season?",
    body: "Our certified team offers free roof inspections with same-day reports. We check shingles, flashing, gutters, and ventilation. Don't wait for a leak to find damage.",
    cta: "Book Your Free Inspection",
    ctaUrl: "https://bookedrankedfunded.org/book",
    serviceKeyword: "roof inspection",
    locationKeyword: "Dallas",
    status: "draft",
    startDate: "2026-06-25"
  },
  {
    id: "2",
    postType: "customer story",
    title: "Customer Spotlight: The Johnson Family",
    hook: "The Johnsons saved thousands with early detection.",
    body: "After a hailstorm, the Johnsons called us for an inspection. We found minor shingle damage that would've caused major leaks. Quick repair, happy family.",
    cta: "Read More Stories",
    serviceKeyword: "roof repair",
    locationKeyword: "Plano",
    status: "pending_approval",
    startDate: "2026-06-28"
  },
  {
    id: "3",
    postType: "educational tip",
    title: "3 Signs Your Roof Needs Attention",
    hook: "Catch problems before they become expensive.",
    body: "1. Missing or curled shingles\n2. Granules in gutters\n3. Water stains on ceilings\n\nIf you spot any of these, call us for a free inspection.",
    cta: "Schedule Inspection",
    serviceKeyword: "roof maintenance",
    locationKeyword: "Frisco",
    status: "approved",
    startDate: "2026-07-01"
  },
  {
    id: "4",
    postType: "offer",
    title: "Summer Roof Tune-Up: 15% Off",
    hook: "Beat the heat and protect your home.",
    body: "Summer is hard on roofs. Our tune-up includes shingle inspection, sealant check, gutter cleaning, and ventilation assessment. 15% off through July.",
    cta: "Claim Your Discount",
    ctaUrl: "https://bookedrankedfunded.org/summer-offer",
    serviceKeyword: "roof tune-up",
    locationKeyword: "Dallas",
    status: "scheduled",
    startDate: "2026-07-05",
    endDate: "2026-07-31"
  },
  {
    id: "5",
    postType: "update",
    title: "Now Serving McKinney",
    hook: "We've expanded to better serve you.",
    body: "Apex Shield Roofing is now officially serving McKinney and surrounding areas. Same quality, same guarantee, closer to home.",
    cta: "View Service Areas",
    serviceKeyword: "roofing services",
    locationKeyword: "McKinney",
    status: "published",
    startDate: "2026-06-15",
    photoAsset: "/assets/images/roofing-team.jpg"
  }
];
const POST_TYPE_OPTIONS = [
  "update",
  "offer",
  "event",
  "service highlight",
  "seasonal/timely",
  "customer story",
  "educational tip",
  "community/local trust",
  "FAQ answer",
  "review highlight"
];
function StatusBadge({ status }) {
  const styles = {
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    pending_approval: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    published: "bg-purple-500/10 text-purple-400 border-purple-500/30"
  };
  const labels = {
    draft: "Draft",
    pending_approval: "Pending Approval",
    approved: "Approved",
    scheduled: "Scheduled",
    published: "Published"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${styles[status]}`,
      children: labels[status]
    }
  );
}
function GBPPostDraftPage() {
  const [posts, setPosts] = reactExports.useState(DEMO_POSTS);
  const [filter, setFilter] = reactExports.useState("all");
  const [showCreateForm, setShowCreateForm] = reactExports.useState(false);
  const [newPost, setNewPost] = reactExports.useState({
    postType: "service highlight",
    status: "draft"
  });
  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.status === filter);
  const handleCreatePost = () => {
    if (!newPost.title || !newPost.body) return;
    const post = {
      id: String(Date.now()),
      postType: newPost.postType || "update",
      title: newPost.title,
      hook: newPost.hook || "",
      body: newPost.body,
      cta: newPost.cta || "Learn More",
      ctaUrl: newPost.ctaUrl,
      serviceKeyword: newPost.serviceKeyword || "",
      locationKeyword: newPost.locationKeyword || "",
      status: "draft",
      startDate: newPost.startDate
    };
    setPosts((prev) => [post, ...prev]);
    setShowCreateForm(false);
    setNewPost({ postType: "service highlight", status: "draft" });
  };
  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "GBP Post Drafts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Create, edit, and queue Google Business Profile posts for approval." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "gbp.create_post.button",
          onClick: () => setShowCreateForm(!showCreateForm),
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-medium transition-colors border border-indigo-500/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            showCreateForm ? "Cancel" : "New Post"
          ]
        }
      )
    ] }),
    showCreateForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white", children: "Create New GBP Post" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "gbp-post-type",
              className: "block text-xs text-slate-400 mb-1",
              children: "Post Type"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "gbp-post-type",
              "data-ocid": "gbp.form.post_type.select",
              value: newPost.postType,
              onChange: (e) => setNewPost((prev) => ({ ...prev, postType: e.target.value })),
              className: "w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white focus:border-indigo-500/50 focus:outline-none",
              children: POST_TYPE_OPTIONS.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: type, children: type }, type))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "gbp-title",
              className: "block text-xs text-slate-400 mb-1",
              children: "Title"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "gbp-title",
              "data-ocid": "gbp.form.title.input",
              type: "text",
              value: newPost.title || "",
              onChange: (e) => setNewPost((prev) => ({ ...prev, title: e.target.value })),
              className: "w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none",
              placeholder: "Post title..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "gbp-hook",
              className: "block text-xs text-slate-400 mb-1",
              children: "Hook"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "gbp-hook",
              "data-ocid": "gbp.form.hook.input",
              type: "text",
              value: newPost.hook || "",
              onChange: (e) => setNewPost((prev) => ({ ...prev, hook: e.target.value })),
              className: "w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none",
              placeholder: "Attention-grabbing hook..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "gbp-cta",
              className: "block text-xs text-slate-400 mb-1",
              children: "CTA"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "gbp-cta",
              "data-ocid": "gbp.form.cta.input",
              type: "text",
              value: newPost.cta || "",
              onChange: (e) => setNewPost((prev) => ({ ...prev, cta: e.target.value })),
              className: "w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none",
              placeholder: "Call to action..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "gbp-body",
              className: "block text-xs text-slate-400 mb-1",
              children: "Body"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "gbp-body",
              "data-ocid": "gbp.form.body.textarea",
              value: newPost.body || "",
              onChange: (e) => setNewPost((prev) => ({ ...prev, body: e.target.value })),
              className: "w-full h-24 px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none resize-none",
              placeholder: "Post body content..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "gbp-service-keyword",
              className: "block text-xs text-slate-400 mb-1",
              children: "Service Keyword"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "gbp-service-keyword",
              "data-ocid": "gbp.form.service_keyword.input",
              type: "text",
              value: newPost.serviceKeyword || "",
              onChange: (e) => setNewPost((prev) => ({
                ...prev,
                serviceKeyword: e.target.value
              })),
              className: "w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none",
              placeholder: "e.g. roof inspection"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "gbp-location-keyword",
              className: "block text-xs text-slate-400 mb-1",
              children: "Location Keyword"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "gbp-location-keyword",
              "data-ocid": "gbp.form.location_keyword.input",
              type: "text",
              value: newPost.locationKeyword || "",
              onChange: (e) => setNewPost((prev) => ({
                ...prev,
                locationKeyword: e.target.value
              })),
              className: "w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none",
              placeholder: "e.g. Dallas"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowCreateForm(false),
            className: "px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "gbp.form.save_draft.button",
            onClick: handleCreatePost,
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-medium transition-colors border border-indigo-500/40",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
              "Save as Draft"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap", children: [
      "all",
      "draft",
      "pending_approval",
      "approved",
      "scheduled",
      "published"
    ].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `gbp.filter.${f}.button`,
        onClick: () => setFilter(f),
        className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-indigo-600/80 text-white border border-indigo-500/40" : "bg-[oklch(0.14_0.014_280)] text-slate-300 border border-white/[0.08] hover:border-white/[0.15]"}`,
        children: [
          f === "all" && "All",
          f === "draft" && `Drafts (${posts.filter((p) => p.status === "draft").length})`,
          f === "pending_approval" && `Pending (${posts.filter((p) => p.status === "pending_approval").length})`,
          f === "approved" && `Approved (${posts.filter((p) => p.status === "approved").length})`,
          f === "scheduled" && `Scheduled (${posts.filter((p) => p.status === "scheduled").length})`,
          f === "published" && `Published (${posts.filter((p) => p.status === "published").length})`
        ]
      },
      f
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredPosts.map((post, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": `gbp.post.${index + 1}.card`,
        className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4 hover:border-white/[0.12] transition-colors",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: post.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: post.postType }),
              post.startDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-slate-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 10 }),
                post.startDate
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white mb-1", children: post.title }),
            post.hook && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-indigo-300 mb-1 italic", children: post.hook }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 leading-relaxed whitespace-pre-line", children: post.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 10 }),
                post.serviceKeyword
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                post.locationKeyword
              ] })
            ] }),
            post.cta && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-2 rounded-md bg-indigo-600/10 border border-indigo-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-indigo-300 font-medium", children: [
              "CTA: ",
              post.cta
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `gbp.post.${index + 1}.edit_button`,
                className: "p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors",
                title: "Edit",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `gbp.post.${index + 1}.preview_button`,
                className: "p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors",
                title: "Preview",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 })
              }
            ),
            post.status === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `gbp.post.${index + 1}.submit_button`,
                className: "p-1.5 rounded-md hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors",
                title: "Submit for Approval",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `gbp.post.${index + 1}.delete_button`,
                onClick: () => handleDelete(post.id),
                className: "p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors",
                title: "Delete",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
              }
            )
          ] })
        ] })
      },
      post.id
    )) })
  ] });
}
export {
  GBPPostDraftPage as default
};
