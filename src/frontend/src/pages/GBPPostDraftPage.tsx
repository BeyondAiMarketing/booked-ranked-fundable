import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  Image,
  MessageSquare,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface GBPPost {
  id: string;
  postType: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
  ctaUrl?: string;
  serviceKeyword: string;
  locationKeyword: string;
  status: "draft" | "pending_approval" | "approved" | "scheduled" | "published";
  startDate?: string;
  endDate?: string;
  photoAsset?: string;
}

const DEMO_POSTS: GBPPost[] = [
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
    startDate: "2026-06-25",
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
    startDate: "2026-06-28",
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
    startDate: "2026-07-01",
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
    endDate: "2026-07-31",
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
    photoAsset: "/assets/images/roofing-team.jpg",
  },
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
  "review highlight",
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-slate-500/10 text-slate-400 border-slate-500/30",
    pending_approval: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    published: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };
  const labels: Record<string, string> = {
    draft: "Draft",
    pending_approval: "Pending Approval",
    approved: "Approved",
    scheduled: "Scheduled",
    published: "Published",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function GBPPostDraftPage() {
  const [posts, setPosts] = useState<GBPPost[]>(DEMO_POSTS);
  const [filter, setFilter] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState<Partial<GBPPost>>({
    postType: "service highlight",
    status: "draft",
  });

  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.body) return;
    const post: GBPPost = {
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
      startDate: newPost.startDate,
    };
    setPosts((prev) => [post, ...prev]);
    setShowCreateForm(false);
    setNewPost({ postType: "service highlight", status: "draft" });
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">GBP Post Drafts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, edit, and queue Google Business Profile posts for approval.
          </p>
        </div>
        <button
          type="button"
          data-ocid="gbp.create_post.button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-medium transition-colors border border-indigo-500/40"
        >
          <Plus size={16} />
          {showCreateForm ? "Cancel" : "New Post"}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-semibold text-white">
            Create New GBP Post
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="gbp-post-type"
                className="block text-xs text-slate-400 mb-1"
              >
                Post Type
              </label>
              <select
                id="gbp-post-type"
                data-ocid="gbp.form.post_type.select"
                value={newPost.postType}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, postType: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white focus:border-indigo-500/50 focus:outline-none"
              >
                {POST_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="gbp-title"
                className="block text-xs text-slate-400 mb-1"
              >
                Title
              </label>
              <input
                id="gbp-title"
                data-ocid="gbp.form.title.input"
                type="text"
                value={newPost.title || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
                placeholder="Post title..."
              />
            </div>
            <div>
              <label
                htmlFor="gbp-hook"
                className="block text-xs text-slate-400 mb-1"
              >
                Hook
              </label>
              <input
                id="gbp-hook"
                data-ocid="gbp.form.hook.input"
                type="text"
                value={newPost.hook || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, hook: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
                placeholder="Attention-grabbing hook..."
              />
            </div>
            <div>
              <label
                htmlFor="gbp-cta"
                className="block text-xs text-slate-400 mb-1"
              >
                CTA
              </label>
              <input
                id="gbp-cta"
                data-ocid="gbp.form.cta.input"
                type="text"
                value={newPost.cta || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, cta: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
                placeholder="Call to action..."
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="gbp-body"
                className="block text-xs text-slate-400 mb-1"
              >
                Body
              </label>
              <textarea
                id="gbp-body"
                data-ocid="gbp.form.body.textarea"
                value={newPost.body || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, body: e.target.value }))
                }
                className="w-full h-24 px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none resize-none"
                placeholder="Post body content..."
              />
            </div>
            <div>
              <label
                htmlFor="gbp-service-keyword"
                className="block text-xs text-slate-400 mb-1"
              >
                Service Keyword
              </label>
              <input
                id="gbp-service-keyword"
                data-ocid="gbp.form.service_keyword.input"
                type="text"
                value={newPost.serviceKeyword || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({
                    ...prev,
                    serviceKeyword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
                placeholder="e.g. roof inspection"
              />
            </div>
            <div>
              <label
                htmlFor="gbp-location-keyword"
                className="block text-xs text-slate-400 mb-1"
              >
                Location Keyword
              </label>
              <input
                id="gbp-location-keyword"
                data-ocid="gbp.form.location_keyword.input"
                type="text"
                value={newPost.locationKeyword || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({
                    ...prev,
                    locationKeyword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 rounded-md bg-[oklch(0.12_0.012_280)] border border-white/[0.10] text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none"
                placeholder="e.g. Dallas"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="gbp.form.save_draft.button"
              onClick={handleCreatePost}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-medium transition-colors border border-indigo-500/40"
            >
              <CheckCircle2 size={16} />
              Save as Draft
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          "all",
          "draft",
          "pending_approval",
          "approved",
          "scheduled",
          "published",
        ].map((f) => (
          <button
            key={f}
            type="button"
            data-ocid={`gbp.filter.${f}.button`}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600/80 text-white border border-indigo-500/40"
                : "bg-[oklch(0.14_0.014_280)] text-slate-300 border border-white/[0.08] hover:border-white/[0.15]"
            }`}
          >
            {f === "all" && "All"}
            {f === "draft" &&
              `Drafts (${posts.filter((p) => p.status === "draft").length})`}
            {f === "pending_approval" &&
              `Pending (${posts.filter((p) => p.status === "pending_approval").length})`}
            {f === "approved" &&
              `Approved (${posts.filter((p) => p.status === "approved").length})`}
            {f === "scheduled" &&
              `Scheduled (${posts.filter((p) => p.status === "scheduled").length})`}
            {f === "published" &&
              `Published (${posts.filter((p) => p.status === "published").length})`}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.map((post, index) => (
          <div
            key={post.id}
            data-ocid={`gbp.post.${index + 1}.card`}
            className="bg-[oklch(0.14_0.014_280)] border border-white/[0.08] rounded-lg p-4 hover:border-white/[0.12] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <StatusBadge status={post.status} />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {post.postType}
                  </span>
                  {post.startDate && (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Calendar size={10} />
                      {post.startDate}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {post.title}
                </h3>
                {post.hook && (
                  <p className="text-xs text-indigo-300 mb-1 italic">
                    {post.hook}
                  </p>
                )}
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.body}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    <Building2 size={10} />
                    {post.serviceKeyword}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    <Clock size={10} />
                    {post.locationKeyword}
                  </span>
                </div>
                {post.cta && (
                  <div className="mt-2 p-2 rounded-md bg-indigo-600/10 border border-indigo-500/20">
                    <span className="text-xs text-indigo-300 font-medium">
                      CTA: {post.cta}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  data-ocid={`gbp.post.${index + 1}.edit_button`}
                  className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Edit"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  data-ocid={`gbp.post.${index + 1}.preview_button`}
                  className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Preview"
                >
                  <Eye size={14} />
                </button>
                {post.status === "draft" && (
                  <button
                    type="button"
                    data-ocid={`gbp.post.${index + 1}.submit_button`}
                    className="p-1.5 rounded-md hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors"
                    title="Submit for Approval"
                  >
                    <Send size={14} />
                  </button>
                )}
                <button
                  type="button"
                  data-ocid={`gbp.post.${index + 1}.delete_button`}
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
