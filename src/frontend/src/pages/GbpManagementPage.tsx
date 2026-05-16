import {
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Image,
  Link2,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  Wifi,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import {
  DEMO_GBP_CHECKLIST,
  DEMO_GBP_HEALTH_DIMENSIONS,
  DEMO_GBP_PHOTOS,
  DEMO_GBP_POSTS,
  DEMO_GBP_QA,
  DEMO_GBP_SETTINGS,
  type GbpChecklistItem,
  type GbpPhoto,
  type GbpPhotoCategory,
  type GbpPost,
  type GbpPostStatus,
  type GbpPostType,
  type GbpQaItem,
  type GbpSettings,
} from "../data/gbpData";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getScoreColor(s: number) {
  if (s >= 75) return "text-emerald-400";
  if (s >= 50) return "text-amber-400";
  return "text-rose-400";
}

function getStatusBg(s: "good" | "warning" | "critical") {
  if (s === "good")
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
  if (s === "warning")
    return "bg-amber-500/15 text-amber-400 border-amber-500/20";
  return "bg-rose-500/15 text-rose-400 border-rose-500/20";
}

function ImpactBadge({ impact }: { impact: string }) {
  const cls =
    impact === "High"
      ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
      : impact === "Medium"
        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
        : "bg-slate-500/15 text-slate-400 border-slate-500/20";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${cls}`}
    >
      {impact}
    </span>
  );
}

function PostStatusBadge({ status }: { status: GbpPostStatus }) {
  const map: Record<GbpPostStatus, string> = {
    draft: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  };
  const labels: Record<GbpPostStatus, string> = {
    draft: "Draft",
    scheduled: "Scheduled",
    published: "Published",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${map[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function PostTypeBadge({ type }: { type: GbpPostType }) {
  const map: Record<GbpPostType, { label: string; cls: string }> = {
    whats_new: {
      label: "What's New",
      cls: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
    },
    event: {
      label: "Event",
      cls: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    },
    offer: {
      label: "Offer",
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    },
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${map[type].cls}`}
    >
      {map[type].label}
    </span>
  );
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Health Score Ring ─────────────────────────────────────────────────────────

function HealthRing({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setAnimatedScore(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev >= score) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return score;
        }
        return Math.min(prev + 2, score);
      });
    }, 20);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [score]);

  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e";
  const pct = Math.round((animatedScore / 100) * 360);
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="w-36 h-36 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${pct}deg, rgba(255,255,255,0.06) ${pct}deg)`,
        }}
      >
        <div className="w-28 h-28 rounded-full bg-gray-950 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{animatedScore}</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            HEALTH
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Posts Tab ─────────────────────────────────────────────────────────────────

function PostsTab() {
  const [posts, setPosts] = useState<GbpPost[]>(DEMO_GBP_POSTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    photoUrl: "",
    postType: "whats_new" as GbpPostType,
    status: "draft" as GbpPostStatus,
    scheduledAt: "",
  });

  const handlePublish = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "published", publishedAt: Date.now() }
          : p,
      ),
    );
    toast.success("Post published to Google Business Profile");
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast("Post removed");
  };

  const handleCreate = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body are required");
      return;
    }
    const newPost: GbpPost = {
      id: `post-${Date.now()}`,
      tenantId: "tenant-plumbing",
      title: form.title,
      body: form.body,
      photoUrl: form.photoUrl || undefined,
      postType: form.postType,
      status: form.scheduledAt ? "scheduled" : form.status,
      scheduledAt: form.scheduledAt
        ? new Date(form.scheduledAt).getTime()
        : undefined,
      createdAt: Date.now(),
    };
    setPosts((prev) => [newPost, ...prev]);
    setForm({
      title: "",
      body: "",
      photoUrl: "",
      postType: "whats_new",
      status: "draft",
      scheduledAt: "",
    });
    setShowForm(false);
    toast.success("Post created successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">GBP Posts</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Create and schedule posts that appear directly on your Google
            Business Profile.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm((v) => !v)}
          data-ocid="gbp.posts.create_button"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
        >
          <Plus size={14} className="mr-1" /> New Post
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card className="bg-gray-900 border-indigo-500/30 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-indigo-300">
                New Post
              </span>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs text-slate-400">Post Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Spring Special — 15% Off"
                  className="bg-gray-950 border-white/10 text-white text-sm mt-1"
                  data-ocid="gbp.post.title_input"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-slate-400">Body</Label>
                <Textarea
                  value={form.body}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, body: e.target.value }))
                  }
                  placeholder="Write your post content here..."
                  rows={3}
                  className="bg-gray-950 border-white/10 text-white text-sm mt-1 resize-none"
                  data-ocid="gbp.post.body_textarea"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-400">Post Type</Label>
                <Select
                  value={form.postType}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, postType: v as GbpPostType }))
                  }
                >
                  <SelectTrigger
                    className="bg-gray-950 border-white/10 text-white text-sm mt-1"
                    data-ocid="gbp.post.type_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    <SelectItem value="whats_new">What's New</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-400">
                  Schedule (optional)
                </Label>
                <Input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, scheduledAt: e.target.value }))
                  }
                  className="bg-gray-950 border-white/10 text-white text-sm mt-1"
                  data-ocid="gbp.post.schedule_input"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-slate-400">
                  Photo URL (optional)
                </Label>
                <Input
                  value={form.photoUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, photoUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  className="bg-gray-950 border-white/10 text-white text-sm mt-1"
                  data-ocid="gbp.post.photo_input"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={handleCreate}
                data-ocid="gbp.post.submit_button"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
              >
                <Send size={13} className="mr-1" /> Save Post
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-white/10 text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts list */}
      <div className="space-y-2">
        {posts.map((post, i) => (
          <div
            key={post.id}
            data-ocid={`gbp.posts.item.${i + 1}`}
            className={`bg-gray-900 border rounded-lg p-4 flex gap-4 ${
              post.status === "draft"
                ? "border-l-slate-500 border-slate-700"
                : post.status === "scheduled"
                  ? "border-l-blue-500 border-blue-500/20"
                  : "border-l-emerald-500 border-emerald-500/20"
            } border-l-[3px]`}
          >
            {post.photoUrl && (
              <img
                src={post.photoUrl}
                alt={post.title}
                className="w-16 h-16 rounded-md object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">
                      {post.title}
                    </span>
                    <PostTypeBadge type={post.postType} />
                    <PostStatusBadge status={post.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {post.body}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock size={11} />
                  {post.publishedAt
                    ? `Published ${formatDate(post.publishedAt)}`
                    : post.scheduledAt
                      ? `Scheduled ${formatDateTime(post.scheduledAt)}`
                      : `Created ${formatDate(post.createdAt)}`}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  {post.status !== "published" && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(post.id)}
                      data-ocid={`gbp.posts.publish_button.${i + 1}`}
                      className="h-7 px-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 text-xs"
                    >
                      <Zap size={12} className="mr-1" /> Publish Now
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    data-ocid={`gbp.posts.delete_button.${i + 1}`}
                    className="p-1.5 rounded hover:bg-white/5 text-slate-500 hover:text-rose-400 transition-colors"
                    aria-label="Delete post"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div
          data-ocid="gbp.posts.empty_state"
          className="text-center py-12 text-slate-500"
        >
          <Image size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-slate-300">No posts yet</p>
          <p className="text-xs mt-1">
            Create your first GBP post to appear in local search results.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Q&A Tab ───────────────────────────────────────────────────────────────────

function QaTab() {
  const [qaItems, setQaItems] = useState<GbpQaItem[]>(DEMO_GBP_QA);
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pending = qaItems.filter((q) => q.status === "pending").length;
  const replied = qaItems.filter((q) => q.status === "replied").length;

  const handleReply = (id: string) => {
    const text = replyInput[id]?.trim();
    if (!text) {
      toast.error("Reply cannot be empty");
      return;
    }
    setQaItems((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: "replied", reply: text, repliedAt: Date.now() }
          : q,
      ),
    );
    setReplyInput((prev) => ({ ...prev, [id]: "" }));
    setExpandedId(null);
    toast.success("Reply saved and published to Google");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Customer Q&amp;A</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage questions from your Google Business Profile. Replies are
            stored and displayed as published answers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-1 rounded font-medium">
            {pending} Pending
          </span>
          <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-medium">
            {replied} Replied
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {qaItems.map((item, i) => (
          <div
            key={item.id}
            data-ocid={`gbp.qa.item.${i + 1}`}
            className={`bg-gray-900 border rounded-lg overflow-hidden ${
              item.status === "pending"
                ? "border-l-amber-500 border-amber-500/20"
                : "border-l-emerald-500 border-emerald-500/20"
            } border-l-[3px]`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        item.status === "pending"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {item.status === "pending" ? "Pending Reply" : "Replied"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item.askedBy}
                    </span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-[10px] text-slate-500">
                      {formatDate(item.askedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-white font-medium">
                    {item.question}
                  </p>
                  {item.reply && (
                    <div className="mt-2 pl-3 border-l-2 border-indigo-500/40">
                      <p className="text-xs text-slate-300 italic">
                        {item.reply}
                      </p>
                      {item.repliedAt && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Replied {formatDate(item.repliedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {item.status === "pending" && (
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((prev) =>
                        prev === item.id ? null : item.id,
                      )
                    }
                    data-ocid={`gbp.qa.reply_button.${i + 1}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors flex-shrink-0"
                  >
                    <MessageCircle size={12} className="mr-0.5" />
                    Reply
                    {expandedId === item.id ? (
                      <ChevronUp size={11} />
                    ) : (
                      <ChevronDown size={11} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {expandedId === item.id && item.status === "pending" && (
              <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
                <Textarea
                  value={replyInput[item.id] ?? ""}
                  onChange={(e) =>
                    setReplyInput((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                  placeholder="Write your reply..."
                  rows={3}
                  className="bg-gray-950 border-white/10 text-white text-sm resize-none"
                  data-ocid={`gbp.qa.reply_textarea.${i + 1}`}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(item.id)}
                    data-ocid={`gbp.qa.submit_reply.${i + 1}`}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8"
                  >
                    <Send size={12} className="mr-1" /> Post Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedId(null)}
                    className="border-white/10 text-slate-400 hover:text-white text-xs h-8"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Photos Tab ────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<GbpPhotoCategory, string> = {
  exterior: "Exterior",
  interior: "Interior",
  team: "Team",
  products: "Products",
  services: "Services",
};

function PhotosTab() {
  const [photos, setPhotos] = useState<GbpPhoto[]>(DEMO_GBP_PHOTOS);
  const [urlInput, setUrlInput] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<GbpPhotoCategory>("services");
  const [filterCat, setFilterCat] = useState<GbpPhotoCategory | "all">("all");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of photos) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [photos]);

  const filtered =
    filterCat === "all"
      ? photos
      : photos.filter((p) => p.category === filterCat);

  const handleUpload = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a photo URL");
      return;
    }
    setPhotos((prev) => [
      {
        id: `photo-${Date.now()}`,
        tenantId: "tenant-plumbing",
        url: urlInput.trim(),
        category,
        caption: caption.trim() || undefined,
        uploadedAt: Date.now(),
      },
      ...prev,
    ]);
    setUrlInput("");
    setCaption("");
    toast.success("Photo added to GBP gallery");
  };

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap">
        {(Object.keys(CATEGORY_LABELS) as GbpPhotoCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCat((prev) => (prev === cat ? "all" : cat))}
            data-ocid={`gbp.photos.filter.${cat}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterCat === cat
                ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50"
                : "bg-white/5 text-slate-400 border-white/10 hover:text-white"
            }`}
          >
            <Tag size={11} />
            {CATEGORY_LABELS[cat]}
            <span className="text-[10px] opacity-70">
              ({categoryCounts[cat] ?? 0})
            </span>
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500">
          {photos.length} total photos
        </span>
      </div>

      {/* Upload area */}
      <div
        className="border-2 border-dashed border-white/10 rounded-xl p-5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-colors"
        data-ocid="gbp.photos.upload_button"
      >
        <div className="flex items-center gap-3 mb-3">
          <Upload size={18} className="text-indigo-400 flex-shrink-0" />
          <span className="text-sm font-medium text-white">Add a Photo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="bg-gray-950 border-white/10 text-white text-xs sm:col-span-1"
            data-ocid="gbp.photos.url_input"
          />
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="bg-gray-950 border-white/10 text-white text-xs"
            data-ocid="gbp.photos.caption_input"
          />
          <div className="flex gap-2">
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as GbpPhotoCategory)}
            >
              <SelectTrigger
                className="bg-gray-950 border-white/10 text-white text-xs flex-1"
                data-ocid="gbp.photos.category_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                {(
                  Object.entries(CATEGORY_LABELS) as [
                    GbpPhotoCategory,
                    string,
                  ][]
                ).map(([val, lbl]) => (
                  <SelectItem key={val} value={val}>
                    {lbl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleUpload}
              data-ocid="gbp.photos.add_button"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs whitespace-nowrap"
            >
              <Plus size={13} /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((photo, i) => (
          <div
            key={photo.id}
            data-ocid={`gbp.photos.item.${i + 1}`}
            className="group relative rounded-lg overflow-hidden bg-gray-900 border border-white/8 aspect-square"
          >
            <img
              src={photo.url}
              alt={photo.caption ?? "GBP photo"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 left-2 right-2">
                <span className="text-[10px] font-medium text-white bg-black/60 px-2 py-0.5 rounded">
                  {CATEGORY_LABELS[photo.category]}
                </span>
                {photo.caption && (
                  <p className="text-[10px] text-white/80 mt-1 truncate">
                    {photo.caption}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
                }
                data-ocid={`gbp.photos.delete_button.${i + 1}`}
                className="absolute top-2 right-2 p-1 rounded bg-rose-600/80 text-white hover:bg-rose-500 transition-colors"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          data-ocid="gbp.photos.empty_state"
          className="text-center py-10 text-slate-500"
        >
          <Camera size={28} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm text-slate-300">No photos in this category</p>
        </div>
      )}
    </div>
  );
}

// ── Health Score Tab ──────────────────────────────────────────────────────────

function HealthScoreTab({ score }: { score: number }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-gradient-to-r from-gray-900 to-gray-950 border border-white/8 rounded-xl">
        <HealthRing score={score} />
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            Google Business Profile Health
          </h3>
          <p className="text-sm text-slate-400 max-w-md">
            Your health score is calculated from 6 weighted dimensions.
            Improving any dimension lifts your score and increases visibility in
            local search.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                score >= 75
                  ? "text-emerald-400"
                  : score >= 50
                    ? "text-amber-400"
                    : "text-rose-400"
              }`}
            >
              {score >= 75
                ? "Good Standing"
                : score >= 50
                  ? "Needs Attention"
                  : "Action Required"}
            </span>
            <span className="text-xs text-slate-500">
              Last updated {formatDate(Date.now())}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEMO_GBP_HEALTH_DIMENSIONS.map((dim, i) => (
          <div
            key={dim.key}
            data-ocid={`gbp.health.dimension.${i + 1}`}
            className="bg-gray-900 border border-white/8 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                {dim.label}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${getScoreColor(dim.score)}`}
                >
                  {dim.score}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBg(dim.status)}`}
                >
                  {dim.status === "good"
                    ? "Good"
                    : dim.status === "warning"
                      ? "Warning"
                      : "Critical"}
                </span>
              </div>
            </div>
            <Progress
              value={dim.score}
              className="h-1.5 bg-white/5 mb-2"
              style={
                {
                  "--progress-color":
                    dim.status === "good"
                      ? "#10b981"
                      : dim.status === "warning"
                        ? "#f59e0b"
                        : "#f43f5e",
                } as React.CSSProperties
              }
            />
            <p className="text-xs text-slate-400">{dim.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Optimization Checklist Tab ────────────────────────────────────────────────

function ChecklistTab({
  onToggle,
  items,
}: {
  items: GbpChecklistItem[];
  onToggle: (id: string) => void;
}) {
  const categories: GbpChecklistItem["category"][] = [
    "Profile Setup",
    "Content Quality",
    "Engagement",
    "Local SEO",
  ];
  const completed = items.filter((i) => i.completed).length;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <div className="space-y-5">
      {/* Completion bar */}
      <div
        className="bg-gray-900 border border-white/8 rounded-xl p-5"
        data-ocid="gbp.checklist.progress"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">
            Optimization Progress
          </span>
          <span className={`text-sm font-bold ${getScoreColor(pct)}`}>
            {completed}/{items.length} complete
          </span>
        </div>
        <Progress value={pct} className="h-2 bg-white/5" />
        <p className="text-xs text-slate-400 mt-2">
          {pct < 50
            ? "Complete the High-impact items first to see the biggest ranking improvements."
            : pct < 80
              ? "Great progress! Focus on remaining High and Medium items."
              : "Excellent! Your GBP is well-optimized. Keep up the post cadence."}
        </p>
      </div>

      {categories.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat}>
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              {cat}
            </h4>
            <div className="space-y-2">
              {catItems.map((item, idx) => (
                <div
                  key={item.id}
                  data-ocid={`gbp.checklist.item.${idx + 1}`}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    item.completed
                      ? "bg-emerald-500/5 border-emerald-500/15"
                      : "bg-gray-900 border-white/8 hover:border-white/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onToggle(item.id)}
                    data-ocid={`gbp.checklist.checkbox.${idx + 1}`}
                    className="mt-0.5 flex-shrink-0"
                    aria-label={
                      item.completed ? "Mark incomplete" : "Mark complete"
                    }
                  >
                    {item.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle
                        size={18}
                        className="text-slate-500 hover:text-slate-300"
                      />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-sm font-medium ${
                          item.completed
                            ? "line-through text-slate-500"
                            : "text-white"
                        }`}
                      >
                        {item.title}
                      </span>
                      <ImpactBadge impact={item.impact} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {item.description}
                    </p>
                    {item.linkedGbpTaskId && !item.completed && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        <Link2 size={10} /> Linked GBP Task
                      </span>
                    )}
                    {item.fixLabel && !item.completed && (
                      <button
                        type="button"
                        className="mt-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                        data-ocid={`gbp.checklist.fix_button.${idx + 1}`}
                        onClick={() => toast.info(`Opening: ${item.fixLabel}`)}
                      >
                        {item.fixLabel} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab() {
  const [settings, setSettings] = useState<GbpSettings>(DEMO_GBP_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleConnect = () => {
    if (!settings.accountId || !settings.locationId || !settings.apiKey) {
      toast.error("Fill in all connection fields before connecting");
      return;
    }
    setSettings((prev) => ({
      ...prev,
      connected: true,
      lastSyncAt: Date.now(),
    }));
    toast.success("Google Business Profile connected successfully");
  };

  const handleDisconnect = () => {
    setSettings((prev) => ({
      ...prev,
      connected: false,
      lastSyncAt: undefined,
    }));
    toast("GBP connection removed");
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSettings((prev) => ({ ...prev, lastSyncAt: Date.now() }));
      setSyncing(false);
      toast.success("Profile data synced");
    }, 1800);
  };

  return (
    <div className="max-w-lg space-y-5">
      {/* Connection status */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border border-white/8 rounded-xl">
        <div className="flex items-center gap-3">
          {settings.connected ? (
            <Wifi size={18} className="text-emerald-400" />
          ) : (
            <WifiOff size={18} className="text-slate-500" />
          )}
          <div>
            <p className="text-sm font-semibold text-white">
              {settings.connected ? "Connected" : "Not Connected"}
            </p>
            <p className="text-xs text-slate-400">
              {settings.connected && settings.lastSyncAt
                ? `Last sync: ${formatDateTime(settings.lastSyncAt)}`
                : "Enter your credentials below to connect"}
            </p>
          </div>
        </div>
        <span
          data-ocid="gbp.settings.status_badge"
          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
            settings.connected
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
              : "bg-slate-500/15 text-slate-400 border-slate-500/20"
          }`}
        >
          {settings.connected ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Fields */}
      <Card className="bg-gray-900 border-white/8">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-white">API Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-slate-400">GBP Account ID</Label>
            <Input
              value={settings.accountId}
              onChange={(e) =>
                setSettings((s) => ({ ...s, accountId: e.target.value }))
              }
              placeholder="accounts/1234567890"
              className="bg-gray-950 border-white/10 text-white text-sm mt-1"
              data-ocid="gbp.settings.account_id_input"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-400">Location ID</Label>
            <Input
              value={settings.locationId}
              onChange={(e) =>
                setSettings((s) => ({ ...s, locationId: e.target.value }))
              }
              placeholder="locations/0987654321"
              className="bg-gray-950 border-white/10 text-sm mt-1 text-white"
              data-ocid="gbp.settings.location_id_input"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-400">API Key</Label>
            <div className="relative mt-1">
              <Input
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, apiKey: e.target.value }))
                }
                placeholder="AIza..."
                className="bg-gray-950 border-white/10 text-white text-sm pr-10"
                data-ocid="gbp.settings.api_key_input"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="pt-2 flex gap-2 flex-wrap">
            {!settings.connected ? (
              <Button
                onClick={handleConnect}
                data-ocid="gbp.settings.connect_button"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
              >
                <Wifi size={14} className="mr-1.5" /> Connect to GBP
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSync}
                  disabled={syncing}
                  data-ocid="gbp.settings.sync_button"
                  className="bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 text-sm"
                >
                  <RefreshCw
                    size={14}
                    className={`mr-1.5 ${syncing ? "animate-spin" : ""}`}
                  />
                  {syncing ? "Syncing..." : "Sync Now"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  data-ocid="gbp.settings.disconnect_button"
                  className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-sm"
                >
                  <WifiOff size={14} className="mr-1.5" /> Disconnect
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help note */}
      <div className="flex items-start gap-2 p-3 bg-indigo-500/8 border border-indigo-500/20 rounded-lg">
        <Sparkles size={15} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-300">
          You'll need a Google Cloud project with the{" "}
          <span className="text-indigo-300 font-medium">
            My Business Business Information API
          </span>{" "}
          and{" "}
          <span className="text-indigo-300 font-medium">
            My Business Q&A API
          </span>{" "}
          enabled. Find your Account ID and Location ID in the Google Business
          Profile Manager.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GbpManagementPage() {
  const { isAdminUser } = useApp();
  const [checklist, setChecklist] =
    useState<GbpChecklistItem[]>(DEMO_GBP_CHECKLIST);

  const completedCount = checklist.filter((i) => i.completed).length;

  // Health score = weighted average of dimension scores + checklist completion bonus
  const baseScore = Math.round(
    DEMO_GBP_HEALTH_DIMENSIONS.reduce((acc, d) => acc + d.score, 0) /
      DEMO_GBP_HEALTH_DIMENSIONS.length,
  );
  const checklistBonus = Math.round((completedCount / checklist.length) * 15);
  const healthScore = Math.min(100, baseScore + checklistBonus - 5);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-indigo-400" />
            <h2 className="text-xl font-bold text-white">GBP Manager</h2>
            {!isAdminUser && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-500/15 text-slate-400 border-slate-500/20">
                Read-Only
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your Google Business Profile — posts, Q&amp;A, photos, health
            score, and optimization checklist.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${
              healthScore >= 75
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                : healthScore >= 50
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                  : "bg-rose-500/15 text-rose-400 border-rose-500/20"
            }`}
            data-ocid="gbp.health_score_badge"
          >
            <Sparkles size={12} />
            Health Score: {healthScore}
          </div>
          <a
            href="https://business.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors"
            data-ocid="gbp.view_on_google_link"
          >
            <ExternalLink size={12} />
            View on Google
          </a>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" data-ocid="gbp.tabs">
        <TabsList className="bg-gray-900 border border-white/8 p-1 flex-wrap h-auto gap-0.5">
          <TabsTrigger
            value="posts"
            data-ocid="gbp.tabs.posts"
            className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <Calendar size={13} className="mr-1.5" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="qa"
            data-ocid="gbp.tabs.qa"
            className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <MessageCircle size={13} className="mr-1.5" />
            Q&amp;A
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            data-ocid="gbp.tabs.photos"
            className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <Camera size={13} className="mr-1.5" />
            Photos
          </TabsTrigger>
          <TabsTrigger
            value="health"
            data-ocid="gbp.tabs.health"
            className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <Sparkles size={13} className="mr-1.5" />
            Health Score
          </TabsTrigger>
          <TabsTrigger
            value="checklist"
            data-ocid="gbp.tabs.checklist"
            className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <CheckCircle2 size={13} className="mr-1.5" />
            Checklist
            <span className="ml-1.5 text-[10px] bg-indigo-500/30 px-1.5 py-0.5 rounded-full">
              {completedCount}/{checklist.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            data-ocid="gbp.tabs.settings"
            className="text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
          >
            <Settings size={13} className="mr-1.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="mt-5">
          <TabsContent value="posts">
            <PostsTab />
          </TabsContent>
          <TabsContent value="qa">
            <QaTab />
          </TabsContent>
          <TabsContent value="photos">
            <PhotosTab />
          </TabsContent>
          <TabsContent value="health">
            <HealthScoreTab score={healthScore} />
          </TabsContent>
          <TabsContent value="checklist">
            <ChecklistTab items={checklist} onToggle={toggleChecklistItem} />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
