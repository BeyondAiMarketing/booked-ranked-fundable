import { r as reactExports, j as jsxRuntimeExports, S as Send, bF as Star, aA as CircleCheck, T as TrendingUp, bV as ThumbsUp, i as Clock, bq as PenLine, b8 as MessageSquare } from "./index-CSMRpKtY.js";
const DEMO_REVIEWS = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    text: "Absolutely amazing service! The team was professional, on time, and the quality exceeded my expectations. Highly recommend to anyone in the area.",
    source: "google",
    date: "2 days ago",
    replied: false,
    sentiment: "positive",
    replyDraft: "Thank you so much, Sarah! We're thrilled to hear you had a great experience. We look forward to serving you again."
  },
  {
    id: "2",
    author: "Mike T.",
    rating: 2,
    text: "Disappointed with the response time. Took 3 days to get back to me after I left a voicemail. The work was fine but communication needs improvement.",
    source: "yelp",
    date: "1 week ago",
    replied: false,
    sentiment: "negative",
    replyDraft: "Hi Mike, we sincerely apologize for the delay in getting back to you. We're actively improving our response times and would love the chance to make this right. Please call us directly."
  },
  {
    id: "3",
    author: "Jennifer K.",
    rating: 4,
    text: "Great work overall. The crew was knowledgeable and friendly. Only reason for 4 stars is the scheduling was a bit tight, but they made it work.",
    source: "google",
    date: "2 weeks ago",
    replied: true,
    sentiment: "positive"
  },
  {
    id: "4",
    author: "David R.",
    rating: 1,
    text: "Never showed up for the appointment. Very unprofessional. I took time off work for this.",
    source: "facebook",
    date: "3 weeks ago",
    replied: false,
    sentiment: "negative",
    replyDraft: "David, we are deeply sorry this happened. This is not the standard we hold ourselves to. Our manager would like to speak with you personally to resolve this. Please contact us at your earliest convenience."
  },
  {
    id: "5",
    author: "Lisa H.",
    rating: 5,
    text: "Best in town! Fair pricing, excellent communication, and top-notch results. I've already referred two neighbors.",
    source: "google",
    date: "1 month ago",
    replied: true,
    sentiment: "positive"
  }
];
const REVIEW_STATS = {
  total: 34,
  average: 4.7,
  responseRate: 92,
  velocity: "+3 this week",
  google: 28,
  yelp: 4,
  facebook: 2
};
function StarRating({ rating }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      size: 14,
      className: star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
    },
    star
  )) });
}
function SourceBadge({ source }) {
  const styles = {
    google: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    yelp: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    facebook: "bg-blue-500/10 text-blue-400 border-blue-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${styles[source]}`,
      children: source
    }
  );
}
function SentimentBadge({ sentiment }) {
  const styles = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    negative: "bg-rose-500/10 text-rose-400 border-rose-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${styles[sentiment]}`,
      children: sentiment
    }
  );
}
function ReviewManagementPage() {
  const [filter, setFilter] = reactExports.useState("all");
  const [expandedReview, setExpandedReview] = reactExports.useState(null);
  const [replyText, setReplyText] = reactExports.useState({});
  const filteredReviews = DEMO_REVIEWS.filter((r) => {
    if (filter === "unreplied") return !r.replied;
    if (filter === "negative") return r.sentiment === "negative";
    return true;
  });
  const unrepliedCount = DEMO_REVIEWS.filter((r) => !r.replied).length;
  const negativeCount = DEMO_REVIEWS.filter(
    (r) => r.sentiment === "negative"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Review Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Inbox, reply drafts, sentiment tracking, and velocity." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "review.request.button",
          className: "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-medium transition-colors border border-indigo-500/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 16 }),
            "Request Reviews"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 16, className: "text-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 uppercase tracking-wider", children: "Average" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-white", children: REVIEW_STATS.average }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 mt-1", children: [
          REVIEW_STATS.total,
          " total reviews"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "text-emerald-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 uppercase tracking-wider", children: "Response Rate" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-white", children: [
          REVIEW_STATS.responseRate,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 mt-1", children: [
          unrepliedCount,
          " pending"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16, className: "text-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 uppercase tracking-wider", children: "Velocity" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-emerald-400", children: REVIEW_STATS.velocity }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mt-1", children: "vs last week" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { size: 16, className: "text-blue-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 uppercase tracking-wider", children: "Sources" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-rose-400", children: [
            "G ",
            REVIEW_STATS.google
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-400", children: [
            "Y ",
            REVIEW_STATS.yelp
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-400", children: [
            "F ",
            REVIEW_STATS.facebook
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: ["all", "unreplied", "negative"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `review.filter.${f}.button`,
        onClick: () => setFilter(f),
        className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? "bg-indigo-600/80 text-white border border-indigo-500/40" : "bg-[oklch(0.14_0.014_280)] text-slate-300 border border-white/[0.08] hover:border-white/[0.15]"}`,
        children: [
          f === "all" && "All Reviews",
          f === "unreplied" && `Unreplied (${unrepliedCount})`,
          f === "negative" && `Negative (${negativeCount})`
        ]
      },
      f
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filteredReviews.map((review, index) => {
      const isExpanded = expandedReview === review.id;
      const replyDraft = replyText[review.id] ?? review.replyDraft ?? "";
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": `review.item.${index + 1}.card`,
          className: `bg-[oklch(0.14_0.014_280)] border rounded-lg overflow-hidden transition-all ${review.sentiment === "negative" ? "border-rose-500/30" : review.rating >= 4 ? "border-emerald-500/20" : "border-white/[0.08]"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: review.author }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SourceBadge, { source: review.source }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SentimentBadge, { sentiment: review.sentiment }),
                  review.replied && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10 }),
                    "Replied"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: review.rating }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 mt-2 leading-relaxed", children: review.text }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2 text-xs text-slate-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
                  review.date
                ] })
              ] }),
              !review.replied && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `review.item.${index + 1}.reply_button`,
                  onClick: () => setExpandedReview(isExpanded ? null : review.id),
                  className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium transition-colors border border-indigo-500/30 shrink-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { size: 12 }),
                    isExpanded ? "Close" : "Reply"
                  ]
                }
              )
            ] }),
            isExpanded && !review.replied && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-white/[0.08]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { size: 14, className: "text-indigo-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-indigo-300", children: "AI Draft Reply" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500", children: "(Edit before sending)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  "data-ocid": `review.item.${index + 1}.reply_input`,
                  value: replyDraft,
                  onChange: (e) => setReplyText((prev) => ({
                    ...prev,
                    [review.id]: e.target.value
                  })),
                  className: "w-full h-24 px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none resize-none",
                  placeholder: "Write your reply..."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `review.item.${index + 1}.save_draft_button`,
                    className: "px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white transition-colors",
                    children: "Save Draft"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `review.item.${index + 1}.send_reply_button`,
                    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium transition-colors border border-indigo-500/40",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 12 }),
                      "Queue for Approval"
                    ]
                  }
                )
              ] })
            ] })
          ] })
        },
        review.id
      );
    }) })
  ] });
}
export {
  ReviewManagementPage as default
};
