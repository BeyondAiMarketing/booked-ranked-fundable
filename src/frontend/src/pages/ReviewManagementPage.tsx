import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit3,
  MessageSquare,
  Send,
  Star,
  ThumbsUp,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: "google" | "yelp" | "facebook";
  date: string;
  replied: boolean;
  sentiment: "positive" | "neutral" | "negative";
  replyDraft?: string;
}

const DEMO_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    text: "Absolutely amazing service! The team was professional, on time, and the quality exceeded my expectations. Highly recommend to anyone in the area.",
    source: "google",
    date: "2 days ago",
    replied: false,
    sentiment: "positive",
    replyDraft:
      "Thank you so much, Sarah! We're thrilled to hear you had a great experience. We look forward to serving you again.",
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
    replyDraft:
      "Hi Mike, we sincerely apologize for the delay in getting back to you. We're actively improving our response times and would love the chance to make this right. Please call us directly.",
  },
  {
    id: "3",
    author: "Jennifer K.",
    rating: 4,
    text: "Great work overall. The crew was knowledgeable and friendly. Only reason for 4 stars is the scheduling was a bit tight, but they made it work.",
    source: "google",
    date: "2 weeks ago",
    replied: true,
    sentiment: "positive",
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
    replyDraft:
      "David, we are deeply sorry this happened. This is not the standard we hold ourselves to. Our manager would like to speak with you personally to resolve this. Please contact us at your earliest convenience.",
  },
  {
    id: "5",
    author: "Lisa H.",
    rating: 5,
    text: "Best in town! Fair pricing, excellent communication, and top-notch results. I've already referred two neighbors.",
    source: "google",
    date: "1 month ago",
    replied: true,
    sentiment: "positive",
  },
];

const REVIEW_STATS = {
  total: 34,
  average: 4.7,
  responseRate: 92,
  velocity: "+3 this week",
  google: 28,
  yelp: 4,
  facebook: 2,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={
            star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
          }
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  const styles = {
    google: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    yelp: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    facebook: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${styles[source as keyof typeof styles]}`}
    >
      {source}
    </span>
  );
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const styles = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    negative: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${styles[sentiment as keyof typeof styles]}`}
    >
      {sentiment}
    </span>
  );
}

export default function ReviewManagementPage() {
  const [filter, setFilter] = useState<"all" | "unreplied" | "negative">("all");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const filteredReviews = DEMO_REVIEWS.filter((r) => {
    if (filter === "unreplied") return !r.replied;
    if (filter === "negative") return r.sentiment === "negative";
    return true;
  });

  const unrepliedCount = DEMO_REVIEWS.filter((r) => !r.replied).length;
  const negativeCount = DEMO_REVIEWS.filter(
    (r) => r.sentiment === "negative",
  ).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Review Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Inbox, reply drafts, sentiment tracking, and velocity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="review.request.button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-medium transition-colors border border-indigo-500/40"
          >
            <Send size={16} />
            Request Reviews
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-amber-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Average
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {REVIEW_STATS.average}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {REVIEW_STATS.total} total reviews
          </div>
        </div>
        <div className="bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Response Rate
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {REVIEW_STATS.responseRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {unrepliedCount} pending
          </div>
        </div>
        <div className="bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-purple-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Velocity
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {REVIEW_STATS.velocity}
          </div>
          <div className="text-xs text-slate-500 mt-1">vs last week</div>
        </div>
        <div className="bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp size={16} className="text-blue-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Sources
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-rose-400">G {REVIEW_STATS.google}</span>
            <span className="text-amber-400">Y {REVIEW_STATS.yelp}</span>
            <span className="text-blue-400">F {REVIEW_STATS.facebook}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(["all", "unreplied", "negative"] as const).map((f) => (
          <button
            key={f}
            type="button"
            data-ocid={`review.filter.${f}.button`}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600/80 text-white border border-indigo-500/40"
                : "bg-[oklch(0.14_0.014_280)] text-slate-300 border border-white/[0.08] hover:border-white/[0.15]"
            }`}
          >
            {f === "all" && "All Reviews"}
            {f === "unreplied" && `Unreplied (${unrepliedCount})`}
            {f === "negative" && `Negative (${negativeCount})`}
          </button>
        ))}
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {filteredReviews.map((review, index) => {
          const isExpanded = expandedReview === review.id;
          const replyDraft = replyText[review.id] ?? review.replyDraft ?? "";

          return (
            <div
              key={review.id}
              data-ocid={`review.item.${index + 1}.card`}
              className={`bg-[oklch(0.14_0.014_280)] border rounded-lg overflow-hidden transition-all ${
                review.sentiment === "negative"
                  ? "border-rose-500/30"
                  : review.rating >= 4
                    ? "border-emerald-500/20"
                    : "border-white/[0.08]"
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {review.author}
                      </span>
                      <SourceBadge source={review.source} />
                      <SentimentBadge sentiment={review.sentiment} />
                      {review.replied && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 size={10} />
                          Replied
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {review.text}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                      <Clock size={12} />
                      {review.date}
                    </div>
                  </div>
                  {!review.replied && (
                    <button
                      type="button"
                      data-ocid={`review.item.${index + 1}.reply_button`}
                      onClick={() =>
                        setExpandedReview(isExpanded ? null : review.id)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium transition-colors border border-indigo-500/30 shrink-0"
                    >
                      <Edit3 size={12} />
                      {isExpanded ? "Close" : "Reply"}
                    </button>
                  )}
                </div>

                {/* Reply Draft Area */}
                {isExpanded && !review.replied && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={14} className="text-indigo-400" />
                      <span className="text-xs font-semibold text-indigo-300">
                        AI Draft Reply
                      </span>
                      <span className="text-[10px] text-slate-500">
                        (Edit before sending)
                      </span>
                    </div>
                    <textarea
                      data-ocid={`review.item.${index + 1}.reply_input`}
                      value={replyDraft}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [review.id]: e.target.value,
                        }))
                      }
                      className="w-full h-24 px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none resize-none"
                      placeholder="Write your reply..."
                    />
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        type="button"
                        data-ocid={`review.item.${index + 1}.save_draft_button`}
                        className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white transition-colors"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        data-ocid={`review.item.${index + 1}.send_reply_button`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium transition-colors border border-indigo-500/40"
                      >
                        <Send size={12} />
                        Queue for Approval
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
