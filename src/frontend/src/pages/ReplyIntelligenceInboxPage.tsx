import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useActor } from "@/hooks/useActor";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Info,
  Mail,
  Phone,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Classification =
  | "interested"
  | "referral"
  | "not_interested"
  | "wrong_person"
  | "sent";

interface ReplyItem {
  id: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  leadScore: number;
  niche: string;
  replyExcerpt: string;
  fullReply: string;
  classification: Classification;
  draftFollowUp: string;
  receivedAt: string;
  lastTouchDate: string;
  referralLeadName?: string;
  referralLeadCreated?: boolean;
}

interface InboxStats {
  totalToday: number;
  interestedCount: number;
  interestedPercent: number;
  referralCount: number;
  avgResponseTimeMinutes: number;
}

type TabKey = "interested" | "referral" | "not_interested" | "wrong_person";

// ─── Niche tooltip copy ───────────────────────────────────────────────────────

const NICHE_TIPS: Record<string, string> = {
  Plumbing:
    "Plumbers who reply to cold outreach typically have an immediate pain point — respond within 2 hours for best close rate.",
  "Med Spa":
    "Med spa owners responding to outreach are often researching growth options. Lead with booking automation ROI.",
  HVAC: "HVAC owners replying in peak season have urgent capacity needs. Emphasize same-day booking & call handling.",
  Roofing:
    "Roofers who reply post-storm surge need speed. Highlight your missed-call → booked-job automation within 60 seconds.",
  Restoration:
    "Restoration leads replying are often mid-crisis. Fast follow-up is table stakes — your AI answers every call instantly.",
  "Carpet Cleaning":
    "Carpet cleaning owners value repeat business. Lead with the automated follow-up sequences that generate re-book revenue.",
  "Real Estate":
    "Real estate agents who reply to outreach are actively building systems. Show them the lead attribution dashboard first.",
  Mortgage:
    "Mortgage brokers replying are likely in a pipeline slump. Lead with the AI booking agent that fills dead calendar time.",
  Chiropractic:
    "Chiro owners replying have recurring patient scheduling pain. Focus on the AI answering + booking combo.",
  Dental:
    "Dental practice owners who reply to cold outreach are usually evaluating growth tools. Lead with new patient booking automation.",
};

const NICHE_DRAFT_TIPS: Record<string, string> = {
  Plumbing:
    "💡 Close tip: Reference their service area + mention the missed-call-to-booking stat ($2,400 avg lost/week).",
  "Med Spa":
    "💡 Close tip: Reference their treatment menu and mention AI booking that runs 24/7 without a receptionist.",
  HVAC: "💡 Close tip: Mention seasonal call volume and how BRF handles overflow without adding headcount.",
  Roofing:
    "💡 Close tip: Reference storm season capacity and the automated follow-up that closes storm leads 3x faster.",
  Restoration:
    "💡 Close tip: Mention the 24/7 inbound AI agent — no lead goes unanswered even at 2am.",
  "Carpet Cleaning":
    "💡 Close tip: Emphasize re-book automation — most carpet cleaning revenue comes from existing customers.",
  "Real Estate":
    "💡 Close tip: Mention the CRM pipeline view + automated lead nurture that keeps deals moving.",
  Mortgage:
    "💡 Close tip: Highlight the calendar booking AI — fills pipeline holes without cold calling.",
  Chiropractic:
    "💡 Close tip: Reference new patient acquisition + automated re-activation sequences.",
  Dental:
    "💡 Close tip: Mention the new patient booking flow and no-show reduction via automated SMS reminders.",
};

// ─── Mock data generator ──────────────────────────────────────────────────────

function buildMockItems(): ReplyItem[] {
  return [
    {
      id: "r1",
      leadName: "Martinez Plumbing",
      leadEmail: "carlos@martinezplumbing.com",
      leadPhone: "(512) 555-0182",
      leadScore: 87,
      niche: "Plumbing",
      replyExcerpt:
        "Hey, I saw your email and I'm definitely interested. We've been losing a ton of calls lately especially after hours. Can we set up a quick call?",
      fullReply:
        "Hey, I saw your email and I'm definitely interested. We've been losing a ton of calls lately especially after hours. We tried an answering service but the quality was terrible and customers kept complaining. Can we set up a quick call this week? I'm free Tuesday or Thursday afternoon.",
      classification: "interested",
      draftFollowUp:
        "Hi Carlos,\n\nThank you for reaching out — after-hours missed calls are exactly the problem BRF was built to solve.\n\nOur AI voice agent answers every call 24/7, qualifies the caller, and books the appointment directly to your calendar — all while you're asleep. Unlike answering services, it never gets tired, never puts callers on hold, and always represents your brand consistently.\n\nI'd love to show you a live demo tailored to Martinez Plumbing. Are you available this Tuesday at 2pm or Thursday at 3pm for a 20-minute walkthrough?\n\nBest,\nBRF Team",
      receivedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      lastTouchDate: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "r2",
      leadName: "Glow Med Spa",
      leadEmail: "owner@glowmedspa.com",
      leadPhone: "(310) 555-0247",
      leadScore: 74,
      niche: "Med Spa",
      replyExcerpt:
        "We actually have a sister location that might be even more interested than us — their receptionist just quit. Can you reach out to them too?",
      fullReply:
        "We actually have a sister location that might be even more interested than us — their receptionist just quit last week and they're scrambling. Their name is Radiance Med Spa and the owner is Jessica Park, jessica@radiancemedspa.com. We're somewhat interested too but honestly they need this more urgently.",
      classification: "referral",
      draftFollowUp:
        "Hi there,\n\nThank you for the kind referral — and I'll absolutely reach out to Jessica at Radiance Med Spa.\n\nIn the meantime, I'd love to show you how BRF works for Glow Med Spa as well. The AI booking agent handles new consultation requests, treatment inquiries, and re-booking — without a receptionist. Many med spa owners find it pays for itself in the first week by capturing inquiries that would have gone to voicemail.\n\nCan I schedule a quick 20-minute demo this week?\n\nBest,\nBRF Team",
      receivedAt: new Date(Date.now() - 47 * 60 * 1000).toISOString(),
      lastTouchDate: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      referralLeadName: "Radiance Med Spa",
      referralLeadCreated: false,
    },
    {
      id: "r3",
      leadName: "A-1 Roofing Solutions",
      leadEmail: "info@a1roofing.com",
      leadPhone: "(602) 555-0391",
      leadScore: 91,
      niche: "Roofing",
      replyExcerpt:
        "Already using GoHighLevel, don't need another tool. Thanks anyway.",
      fullReply:
        "Already using GoHighLevel, don't need another tool. Thanks anyway.",
      classification: "not_interested",
      draftFollowUp: "",
      receivedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      lastTouchDate: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "r4",
      leadName: "Cool Breeze HVAC",
      leadEmail: "dispatch@coolbreezeac.com",
      leadPhone: "(713) 555-0512",
      leadScore: 68,
      niche: "HVAC",
      replyExcerpt:
        "I'm just the office manager, you'd need to speak to the owner Mike. His email is mike@coolbreezeac.com.",
      fullReply:
        "I'm just the office manager, you'd need to speak to the owner Mike directly. I don't make decisions on tools like this. His email is mike@coolbreezeac.com and he's usually in the office Monday through Wednesday.",
      classification: "wrong_person",
      draftFollowUp: "",
      receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      lastTouchDate: new Date(
        Date.now() - 4 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "r5",
      leadName: "Elite Restoration Co.",
      leadEmail: "jobs@eliterestoration.com",
      leadPhone: "(404) 555-0634",
      leadScore: 82,
      niche: "Restoration",
      replyExcerpt:
        "This actually looks really interesting. We've been getting crushed on after-hours water damage calls. What does pricing look like?",
      fullReply:
        "This actually looks really interesting. We've been getting crushed on after-hours water damage calls — it's our busiest time and we can't staff 24/7. We tried a few call centers and the quality was inconsistent. What does pricing look like and how fast can we get set up? We'd want to test it before storm season.",
      classification: "interested",
      draftFollowUp:
        "Hi there,\n\nAfter-hours water damage calls are BRF's bread and butter — our AI agent answers at 2am with the same quality as a top-rated dispatcher.\n\nPricing starts at [TIER], and most restoration clients are fully live within 48 hours. We can absolutely get you set up before storm season.\n\nI'd love to walk you through a live demo with a restoration scenario. Are you available for a quick 20 minutes this week?\n\nBest,\nBRF Team",
      receivedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      lastTouchDate: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
  ];
}

// ─── Helper utilities ─────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
}

function classificationBadge(c: Classification) {
  const map: Record<Classification, { label: string; className: string }> = {
    interested: {
      label: "INTERESTED",
      className: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    },
    referral: {
      label: "REFERRAL",
      className: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    },
    not_interested: {
      label: "NOT INTERESTED",
      className: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    },
    wrong_person: {
      label: "WRONG PERSON",
      className: "bg-muted text-muted-foreground border-border",
    },
    sent: {
      label: "SENT",
      className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    },
  };
  return map[c];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground mt-0.5 leading-none">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="reply-inbox.empty_state"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2.4,
          ease: "easeInOut",
        }}
        className="mb-5 p-4 rounded-full bg-primary/10 border border-primary/20"
      >
        <Mail className="w-8 h-8 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No replies waiting for review
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        Your outreach sequences are running — replies will appear here as leads
        respond. Interested leads are prioritized first.
      </p>
    </motion.div>
  );
}

// ─── Reply Card ───────────────────────────────────────────────────────────────

function ReplyCard({
  item,
  index,
  onApprove,
  onDiscard,
}: {
  item: ReplyItem;
  index: number;
  onApprove: (id: string, text: string) => Promise<void>;
  onDiscard: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(item.draftFollowUp);
  const [sending, setSending] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [sent, setSent] = useState(false);
  const [referralCreated, setReferralCreated] = useState(false);
  const isReadOnly =
    item.classification === "not_interested" ||
    item.classification === "wrong_person";
  const classBadge = classificationBadge(item.classification);
  const nicheTip =
    NICHE_TIPS[item.niche] ?? "Reply within 2 hours for the best close rate.";
  const draftTip = NICHE_DRAFT_TIPS[item.niche] ?? "";

  async function handleSend() {
    setSending(true);
    await onApprove(item.id, draft);
    setSent(true);
    if (item.classification === "referral" && item.referralLeadName) {
      setReferralCreated(true);
    }
    setSending(false);
  }

  async function handleDiscard() {
    setDiscarding(true);
    await onDiscard(item.id);
    setDiscarding(false);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ delay: 2, duration: 0.4 }}
        className="overflow-hidden"
        data-ocid={`reply-inbox.item.${index + 1}`}
      >
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm text-emerald-300 font-medium">
            Reply sent to {item.leadName}
          </span>
          {referralCreated && item.referralLeadName && (
            <span className="ml-auto text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-full px-3 py-1">
              New lead auto-created from referral mention
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      data-ocid={`reply-inbox.item.${index + 1}`}
    >
      <Card className="bg-card border-border/60 hover:border-border transition-colors duration-200 overflow-hidden">
        <CardContent className="p-0">
          {/* Card header row */}
          <button
            type="button"
            className="w-full text-left p-4 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-xl"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            data-ocid={`reply-inbox.expand_button.${index + 1}`}
          >
            {/* Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm mt-0.5">
              {item.leadName.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground text-sm truncate">
                  {item.leadName}
                </span>
                <span className="text-xs bg-secondary/80 text-secondary-foreground rounded-full px-2 py-0.5 border border-border/50">
                  {item.niche}
                </span>
                <span
                  className={`text-xs font-bold border rounded-full px-2 py-0.5 ${classBadge.className}`}
                >
                  {classBadge.label}
                </span>
                <span
                  className={`text-xs font-bold ml-auto ${scoreColor(item.leadScore)}`}
                >
                  ★ {item.leadScore}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 pr-4">
                &ldquo;
                {item.replyExcerpt.length > 200
                  ? `${item.replyExcerpt.slice(0, 200)}…`
                  : item.replyExcerpt}
                &rdquo;
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(item.receivedAt)}
              </p>
            </div>

            <div className="shrink-0 text-muted-foreground mt-2">
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {/* Expanded panel */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden border-t border-border/40"
              >
                <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left: full reply + draft */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Full reply */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Full Reply
                      </p>
                      <div className="bg-muted/30 border border-border/40 rounded-lg p-3 text-sm text-foreground/90 leading-relaxed">
                        {item.fullReply}
                      </div>
                    </div>

                    {!isReadOnly && (
                      <>
                        {/* Draft follow-up */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Claude Draft Follow-Up
                            </p>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs text-xs">
                                  {nicheTip}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            rows={8}
                            className="text-sm resize-none bg-muted/20 border-border/60 focus:border-primary/60 text-foreground"
                            placeholder="Draft reply will appear here…"
                            data-ocid={`reply-inbox.draft_textarea.${index + 1}`}
                          />
                          {draftTip && (
                            <p className="text-xs text-amber-400/80 mt-1.5">
                              {draftTip}
                            </p>
                          )}
                        </div>

                        {/* Referral banner */}
                        {item.classification === "referral" &&
                          item.referralLeadName && (
                            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                              <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-amber-300 font-medium">
                                  Referral detected:{" "}
                                  <span className="font-bold">
                                    {item.referralLeadName}
                                  </span>
                                </p>
                                <p className="text-xs text-amber-300/70 mt-0.5">
                                  Approving this reply will auto-create a new
                                  lead in your CRM.
                                </p>
                              </div>
                            </div>
                          )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1">
                          <Button
                            onClick={handleSend}
                            disabled={sending || discarding || !draft.trim()}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 gap-2"
                            data-ocid={`reply-inbox.send_button.${index + 1}`}
                          >
                            {sending ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending…
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Send This Reply
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleDiscard}
                            disabled={sending || discarding}
                            className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 gap-2"
                            data-ocid={`reply-inbox.discard_button.${index + 1}`}
                          >
                            {discarding ? (
                              <span className="w-3.5 h-3.5 border-2 border-rose-300/30 border-t-rose-300 rounded-full animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            Discard
                          </Button>
                        </div>
                      </>
                    )}

                    {isReadOnly && (
                      <div className="flex items-center gap-2 bg-muted/30 border border-border/40 rounded-lg p-3">
                        <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          No further outreach — this lead has been removed from
                          all active sequences.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: lead info panel */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Lead Info
                    </p>
                    <div className="bg-muted/20 border border-border/40 rounded-lg p-3 space-y-2.5">
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground font-medium truncate">
                          {item.leadName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground text-xs">
                          {item.leadPhone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground text-xs truncate">
                          {item.leadEmail}
                        </span>
                      </div>
                      <div className="border-t border-border/40 pt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Lead Score
                        </span>
                        <span
                          className={`text-sm font-bold flex items-center gap-1 ${scoreColor(item.leadScore)}`}
                        >
                          <Star className="w-3.5 h-3.5" />
                          {item.leadScore}/100
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Last Touch
                        </span>
                        <span className="text-xs text-foreground/70">
                          {timeAgo(item.lastTouchDate)}
                        </span>
                      </div>
                      <div className="border-t border-border/40 pt-2">
                        <a
                          href="/crm-pipeline"
                          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                          data-ocid={`reply-inbox.view_crm_link.${index + 1}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          View in CRM
                        </a>
                      </div>
                    </div>

                    {/* Per-niche closing tip card */}
                    {!isReadOnly && (
                      <div className="bg-primary/8 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-primary/80 leading-relaxed">
                          {nicheTip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post-send referral success banner (if just sent) */}
                {referralCreated && item.referralLeadName && (
                  <div className="mx-4 mb-4 flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-amber-300">
                        New lead auto-created from referral mention
                      </p>
                      <p className="text-xs text-amber-300/70 mt-0.5">
                        {item.referralLeadName} added to your CRM pipeline.
                      </p>
                    </div>
                    <a
                      href="/crm-pipeline"
                      className="shrink-0 text-xs text-amber-300 border border-amber-500/40 rounded-full px-3 py-1 hover:bg-amber-500/20 transition-colors"
                      data-ocid={`reply-inbox.view_referral_crm.${index + 1}`}
                    >
                      View in CRM
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: "interested", label: "Interested" },
  { key: "referral", label: "Referral" },
  { key: "not_interested", label: "Not Interested" },
  { key: "wrong_person", label: "Wrong Person" },
];

export default function ReplyIntelligenceInboxPage() {
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState<TabKey>("interested");
  const [items, setItems] = useState<ReplyItem[]>(buildMockItems());
  const [stats, setStats] = useState<InboxStats>({
    totalToday: 14,
    interestedCount: 6,
    interestedPercent: 43,
    referralCount: 2,
    avgResponseTimeMinutes: 38,
  });
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!actor) return;
    try {
      const [rawItems, rawStats] = await Promise.allSettled([
        (
          actor as Record<string, (...args: unknown[]) => Promise<unknown>>
        ).getReplyInboxItems(),
        (
          actor as Record<string, (...args: unknown[]) => Promise<unknown>>
        ).getEmailReplyRecords(),
      ]);
      if (
        rawItems.status === "fulfilled" &&
        Array.isArray(rawItems.value) &&
        rawItems.value.length > 0
      ) {
        setItems(rawItems.value as ReplyItem[]);
      }
      if (
        rawStats.status === "fulfilled" &&
        rawStats.value &&
        typeof rawStats.value === "object"
      ) {
        setStats(rawStats.value as InboxStats);
      }
    } catch {
      // silently use mock data
    }
  }, [actor]);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
    pollingRef.current = setInterval(fetchData, 30_000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchData]);

  async function handleApprove(id: string, draftText: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      if (actor) {
        await (
          actor as Record<string, (...args: unknown[]) => Promise<unknown>>
        ).approveReplyDraft(id, draftText);
      }
      toast.success(`Reply sent to ${item.leadName}`, {
        description:
          "The approved reply has been dispatched via your connected email provider.",
        duration: 5000,
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                classification: "sent" as Classification,
                referralLeadCreated: !!i.referralLeadName,
              }
            : i,
        ),
      );
    } catch {
      toast.error("Failed to send reply. Please try again.");
    }
  }

  async function handleDiscard(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      if (actor) {
        await (
          actor as Record<string, (...args: unknown[]) => Promise<unknown>>
        ).rejectReplyDraft(id);
      }
      toast("Draft discarded", {
        description: `${item.leadName} remains in sequence. No reply was sent.`,
        duration: 4000,
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error("Failed to discard draft. Please try again.");
    }
  }

  const tabItems = items.filter((i) => i.classification === activeTab);

  const tabCounts: Record<TabKey, number> = {
    interested: items.filter((i) => i.classification === "interested").length,
    referral: items.filter((i) => i.classification === "referral").length,
    not_interested: items.filter((i) => i.classification === "not_interested")
      .length,
    wrong_person: items.filter((i) => i.classification === "wrong_person")
      .length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              Reply Intelligence Inbox
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Claude classifies every inbound reply — approve drafts before
              anything sends.{" "}
              <span className="text-amber-400 font-medium">
                Zero auto-sends. You always decide.
              </span>
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border/50 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live · refreshes every 30s
          </div>
        </div>

        {/* Stats row */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["total", "interested", "referral", "response"] as const).map(
              (k) => (
                <Skeleton key={k} className="h-20 rounded-xl" />
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={Mail}
              label="Total Replies Today"
              value={stats.totalToday}
              sub="across all sequences"
            />
            <StatCard
              icon={TrendingUp}
              label="Interested"
              value={stats.interestedCount}
              sub={`${stats.interestedPercent}% reply rate`}
            />
            <StatCard
              icon={Users}
              label="Referrals"
              value={stats.referralCount}
              sub="new leads from replies"
            />
            <StatCard
              icon={Clock}
              label="Avg Response Time"
              value={`${stats.avgResponseTimeMinutes}m`}
              sub="your approved sends"
            />
          </div>
        )}

        {/* Tab bar */}
        <div
          className="flex items-center gap-1 bg-card border border-border/60 rounded-xl p-1"
          role="tablist"
          data-ocid="reply-inbox.tab_bar"
        >
          {TABS.map(({ key, label }) => (
            <button
              type="button"
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeTab === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-ocid={`reply-inbox.${key}_tab`}
            >
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden text-xs">{label.split(" ")[0]}</span>
              {tabCounts[key] > 0 && (
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center font-bold ${
                    activeTab === key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tabCounts[key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab hint for not_interested / wrong_person */}
        {(activeTab === "not_interested" || activeTab === "wrong_person") && (
          <div className="flex items-center gap-2 bg-muted/20 border border-border/40 rounded-lg px-4 py-2.5">
            <Info className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              {activeTab === "not_interested"
                ? "These leads replied indicating they're not interested. No further outreach — they've been removed from all active sequences and marked in CRM."
                : "These replies came from the wrong contact. Where possible, the owner's contact info has been extracted and a new lead record created."}
            </p>
          </div>
        )}

        {/* Reply list */}
        <div className="space-y-3" data-ocid="reply-inbox.list">
          {loading ? (
            (["l1", "l2", "l3"] as const).map((k) => (
              <Skeleton key={k} className="h-24 rounded-xl" />
            ))
          ) : tabItems.length === 0 ? (
            <EmptyState />
          ) : (
            tabItems.map((item, idx) => (
              <ReplyCard
                key={item.id}
                item={item}
                index={idx}
                onApprove={handleApprove}
                onDiscard={handleDiscard}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
