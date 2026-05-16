import {
  AlertCircle,
  CheckCircle2,
  Facebook,
  Globe,
  Instagram,
  Loader2,
  MessageCircle,
  Send,
  ShoppingBag,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  CommentIntent,
  SocialComment,
  SocialPlatform,
} from "../../types/socialMedia";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

// ── Intent config ─────────────────────────────────────────────────────────────

const INTENT_PRIORITY: CommentIntent[] = [
  "purchase_intent",
  "question",
  "complaint",
  "competitor_mention",
  "community_love",
  "neutral",
  "spam",
];

const INTENT_CONFIG: Record<
  CommentIntent,
  {
    label: string;
    cls: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  purchase_intent: {
    label: "Purchase Intent",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: ShoppingBag,
  },
  question: {
    label: "Question",
    cls: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    icon: MessageCircle,
  },
  complaint: {
    label: "Complaint",
    cls: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    icon: AlertCircle,
  },
  competitor_mention: {
    label: "Competitor",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: Users,
  },
  community_love: {
    label: "Community Love",
    cls: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    icon: ThumbsUp,
  },
  neutral: {
    label: "Neutral",
    cls: "bg-muted text-muted-foreground border-border",
    icon: MessageCircle,
  },
  spam: {
    label: "Spam",
    cls: "bg-muted text-muted-foreground/50 border-border",
    icon: AlertCircle,
  },
};

// ── Platform icon ─────────────────────────────────────────────────────────────

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "facebook")
    return <Facebook size={13} className="text-blue-400 shrink-0" />;
  if (platform === "instagram")
    return <Instagram size={13} className="text-amber-400 shrink-0" />;
  if (platform === "tiktok")
    return <Globe size={13} className="text-rose-400 shrink-0" />;
  return <Globe size={13} className="text-muted-foreground shrink-0" />;
}

function platformLabel(p: SocialPlatform) {
  const map: Record<SocialPlatform, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    google_business: "Google",
    tiktok: "TikTok",
    linkedin: "LinkedIn",
  };
  return map[p] ?? p;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d >= 1) return `${d}d ago`;
  if (h >= 1) return `${h}h ago`;
  return "Just now";
}

// ── Comment card ──────────────────────────────────────────────────────────────

interface CommentCardProps {
  comment: SocialComment;
  onRespond: (id: string, text: string) => void;
  sending: boolean;
}

function CommentCard({ comment, onRespond, sending }: CommentCardProps) {
  const [draftText, setDraftText] = useState(comment.aiDraftResponse);
  const cfg = INTENT_CONFIG[comment.intent];
  const IntentIcon = cfg.icon;

  return (
    <div
      data-ocid={`comment_agent.comment.item.${comment.id}`}
      className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-border/80 transition-colors"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center shrink-0 border border-border text-xs font-bold text-foreground">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate">
                {comment.authorName}
              </span>
              <div className="flex items-center gap-1">
                <PlatformIcon platform={comment.platform} />
                <span className="text-[10px] text-muted-foreground">
                  {platformLabel(comment.platform)}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
              {comment.commentText}
            </p>
          </div>
        </div>
        {/* Intent badge */}
        <span
          className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.cls}`}
          data-ocid={`comment_agent.intent_badge.${comment.id}`}
        >
          <IntentIcon size={9} />
          {cfg.label}
        </span>
      </div>

      {/* AI draft */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wide flex items-center gap-1">
          <Loader2 size={9} className="opacity-60" />
          AI Draft Response
        </p>
        <Textarea
          data-ocid={`comment_agent.draft_textarea.${comment.id}`}
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          className="text-sm min-h-[70px] bg-background/50 border-border/60 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          data-ocid={`comment_agent.send_button.${comment.id}`}
          onClick={() => onRespond(comment.id, draftText)}
          disabled={sending || !draftText.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-7"
        >
          {sending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <>
              <Send size={11} className="mr-1" />
              Send Response
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          data-ocid={`comment_agent.resolve_button.${comment.id}`}
          onClick={() => onRespond(comment.id, "[marked-resolved]")}
          disabled={sending}
          className="text-xs h-7 text-muted-foreground"
        >
          <CheckCircle2 size={11} className="mr-1" />
          Mark Resolved
        </Button>
        {comment.leadCreated && (
          <Badge
            variant="secondary"
            className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ml-auto"
          >
            Lead Created
          </Badge>
        )}
      </div>
    </div>
  );
}

// ── Handled card ──────────────────────────────────────────────────────────────

function HandledCard({ comment }: { comment: SocialComment }) {
  const cfg = INTENT_CONFIG[comment.intent];
  const IntentIcon = cfg.icon;
  return (
    <div
      data-ocid={`comment_agent.handled.item.${comment.id}`}
      className="bg-muted/20 border border-border/50 rounded-xl p-3 flex items-start gap-3 opacity-70"
    >
      <div className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center shrink-0 text-xs font-bold text-foreground">
        {comment.authorName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            {comment.authorName}
          </span>
          <span
            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border flex items-center gap-0.5 ${cfg.cls}`}
          >
            <IntentIcon size={8} />
            {cfg.label}
          </span>
          <PlatformIcon platform={comment.platform} />
          <span className="text-[10px] text-muted-foreground">
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {comment.commentText}
        </p>
      </div>
      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface CommentAgentPanelProps {
  tenantId: string;
  allComments: SocialComment[];
  onRespond: (commentId: string, responseText: string) => void;
}

export function CommentAgentPanel({
  tenantId,
  allComments,
  onRespond,
}: CommentAgentPanelProps) {
  const [sendingId, setSendingId] = useState<string | null>(null);

  const tenantComments = allComments.filter((c) => c.tenantId === tenantId);
  const pending = [...tenantComments.filter((c) => !c.responded)].sort(
    (a, b) => {
      const pi = INTENT_PRIORITY.indexOf(a.intent);
      const pj = INTENT_PRIORITY.indexOf(b.intent);
      return pi - pj;
    },
  );
  const handled = tenantComments.filter((c) => c.responded);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const handledToday = handled.filter(
    (c) => c.respondedAt != null && c.respondedAt >= todayStart.getTime(),
  ).length;

  const handleRespond = (id: string, text: string) => {
    setSendingId(id);
    setTimeout(() => {
      onRespond(id, text);
      setSendingId(null);
      toast.success(
        text === "[marked-resolved]"
          ? "Comment marked resolved"
          : "Response sent successfully",
      );
    }, 800);
  };

  return (
    <div className="space-y-4" data-ocid="comment_agent.panel">
      {/* Metrics header */}
      <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-semibold text-foreground">
            {pending.length}
          </span>
          <span className="text-xs text-muted-foreground">pending</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span className="text-sm font-semibold text-foreground">
            {handledToday}
          </span>
          <span className="text-xs text-muted-foreground">handled today</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="ml-auto flex items-center gap-1.5">
          {INTENT_PRIORITY.slice(0, 5).map((intent) => {
            const count = pending.filter((c) => c.intent === intent).length;
            if (count === 0) return null;
            const cfg = INTENT_CONFIG[intent];
            return (
              <span
                key={intent}
                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${cfg.cls}`}
                title={cfg.label}
              >
                {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Pending / Handled tabs */}
      <Tabs defaultValue="pending" data-ocid="comment_agent.tab">
        <TabsList className="bg-muted/50 h-8 gap-1">
          <TabsTrigger
            value="pending"
            className="text-xs h-7"
            data-ocid="comment_agent.pending.tab"
          >
            Pending
            {pending.length > 0 && (
              <span className="ml-1.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="handled"
            className="text-xs h-7"
            data-ocid="comment_agent.handled.tab"
          >
            Handled
            <span className="ml-1.5 bg-muted text-muted-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {handled.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-3">
          {pending.length === 0 ? (
            <Card
              className="bg-card border-border"
              data-ocid="comment_agent.pending.empty_state"
            >
              <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={32} className="text-emerald-400" />
                <p className="text-sm font-semibold text-foreground">
                  All caught up!
                </p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  No pending comments right now. New comments will appear here
                  sorted by priority.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pending.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  onRespond={handleRespond}
                  sending={sendingId === c.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="handled" className="mt-3">
          {handled.length === 0 ? (
            <Card
              className="bg-card border-border"
              data-ocid="comment_agent.handled.empty_state"
            >
              <CardContent className="py-8 text-center">
                <p className="text-xs text-muted-foreground">
                  No handled comments yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {handled.map((c) => (
                <HandledCard key={c.id} comment={c} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
