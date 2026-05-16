import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  EyeOff,
  Flame,
  Info,
  MessageSquare,
  Phone,
  Send,
  ShieldOff,
  Smartphone,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SmsRule {
  enabled: boolean;
  delayMinutes: number;
  template: string;
}

interface SmsAutopilotRules {
  twoOpensRule: SmsRule;
  silenceRule: SmsRule;
  dailyCap: number;
}

interface SmsJob {
  id: string;
  leadName: string;
  niche: string;
  message: string;
  classification: "Urgent" | "Follow-up" | "Unsubscribe";
  time: string;
  phone: string;
  thread: { from: "us" | "them"; text: string; time: string }[];
}

interface OptedOutPhone {
  masked: string;
  date: string;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_TWO_OPENS_TEMPLATE =
  "Hey {firstName}, noticed you've been checking out our info — smart move 💡 We help {niche} businesses book 30%+ more jobs without lifting a finger. Quick demo? {demoLink}";

const DEFAULT_SILENCE_TEMPLATE =
  "Hey {firstName} 👋 Know you're busy running {businessName} — that's exactly why BRF exists. 60 seconds to see how we fill your calendar automatically? {demoLink}";

const MOCK_STATS = {
  sentToday: 87,
  deliveryRate: 96.8,
  repliesToday: 14,
  hotFlagged: 5,
};

const MOCK_JOBS: SmsJob[] = [
  {
    id: "1",
    leadName: "Carlos Menendez",
    niche: "HVAC",
    message:
      "Hey Carlos, noticed you checked out our demo twice — still thinking it over? Quick 60s call could save you 15 missed jobs a month.",
    classification: "Urgent",
    time: "2 min ago",
    phone: "***-***-4821",
    thread: [
      {
        from: "us",
        text: "Hey Carlos, noticed you checked out our demo twice — still thinking it over?",
        time: "10:14 AM",
      },
      {
        from: "them",
        text: "Yeah I'm interested. When can we talk?",
        time: "10:22 AM",
      },
      {
        from: "us",
        text: "Perfect timing. Book a slot: bookedrankedfunded.org/demo",
        time: "10:23 AM",
      },
    ],
  },
  {
    id: "2",
    leadName: "Maria Santos",
    niche: "Med Spa",
    message:
      "Maria, your competitors are booking 40+ new clients/month with BRF. Worth 2 minutes to see how? Demo: bookedrankedfunded.org/demo",
    classification: "Follow-up",
    time: "18 min ago",
    phone: "***-***-7734",
    thread: [
      {
        from: "us",
        text: "Maria, your competitors are booking 40+ new clients/month with BRF.",
        time: "9:58 AM",
      },
      { from: "them", text: "Who is this?", time: "10:03 AM" },
      {
        from: "us",
        text: "This is BRF — we help med spas automate bookings and reviews. Want a free audit?",
        time: "10:04 AM",
      },
    ],
  },
  {
    id: "3",
    leadName: "James Whitfield",
    niche: "Roofing",
    message:
      "Hey James — got your demo link for roofing automation. Stop sending trucks to empty estimates. Check it: bookedrankedfunded.org/demo",
    classification: "Follow-up",
    time: "45 min ago",
    phone: "***-***-2291",
    thread: [
      {
        from: "us",
        text: "Hey James — stop sending trucks to empty estimates. BRF pre-qualifies leads before they book.",
        time: "9:31 AM",
      },
    ],
  },
  {
    id: "4",
    leadName: "Diane Kowalski",
    niche: "Dental",
    message:
      "BRF follow-up for Kowalski Dental. See how you can fill 3 more chairs/week automatically.",
    classification: "Unsubscribe",
    time: "1 hr ago",
    phone: "***-***-0056",
    thread: [
      {
        from: "us",
        text: "BRF follow-up for Kowalski Dental. Fill 3 more chairs/week automatically?",
        time: "9:00 AM",
      },
      { from: "them", text: "STOP", time: "9:02 AM" },
    ],
  },
  {
    id: "5",
    leadName: "Tony Reyes",
    niche: "Plumbing",
    message:
      "Tony — every missed call is a job going to your competitor. BRF's AI answers 24/7 and books automatically. Demo: bookedrankedfunded.org",
    classification: "Urgent",
    time: "2 hrs ago",
    phone: "***-***-5509",
    thread: [
      {
        from: "us",
        text: "Tony — every missed call is a job going to your competitor.",
        time: "8:15 AM",
      },
      {
        from: "them",
        text: "Tell me more. We lose calls every night.",
        time: "8:41 AM",
      },
      {
        from: "us",
        text: "Perfect — book a 15-min demo: bookedrankedfunded.org/demo",
        time: "8:42 AM",
      },
      { from: "them", text: "Done. Talk tomorrow.", time: "8:44 AM" },
    ],
  },
];

const MOCK_OPTED_OUT: OptedOutPhone[] = [
  { masked: "***-***-0056", date: "Today, 9:02 AM" },
  { masked: "***-***-3318", date: "Yesterday, 4:17 PM" },
  { masked: "***-***-8874", date: "Apr 28, 11:33 AM" },
];

const NICHE_TIPS = [
  {
    niche: "HVAC",
    icon: "🌡️",
    tip: "The 48-hour silence rule fires best on Monday mornings — HVAC owners plan their week on Monday and are actively looking for solutions to patch their lead gaps.",
  },
  {
    niche: "Plumbing",
    icon: "🔧",
    tip: "Plumbers respond strongest to urgency copy. Lead with 'missed call = lost job' — this niche loses 60% of leads to the first business that answers.",
  },
  {
    niche: "Roofing",
    icon: "🏠",
    tip: "Post-storm timing is everything. If your roofing leads go cold in the 2-opens window, add 'storm season' urgency language — it triples reply rates.",
  },
  {
    niche: "Med Spa",
    icon: "💆",
    tip: "Med spa owners respond to authority and social proof, not urgency. Lead with 'your competitors are doing X' — comparison triggers action faster than scarcity.",
  },
  {
    niche: "Dental",
    icon: "🦷",
    tip: "Dental practices have long decision cycles. Send the 48-hour silence SMS on Thursday afternoon — that's when practice managers review vendor decisions for next week.",
  },
];

// ─── Segment count helper ─────────────────────────────────────────────────────

function getTwilioSegments(text: string) {
  const len = text.length;
  if (len <= 160) return 1;
  return Math.ceil(len / 153);
}

// ─── Classification badge ─────────────────────────────────────────────────────

function ClassificationBadge({ c }: { c: SmsJob["classification"] }) {
  const map = {
    Urgent: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    "Follow-up": "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    Unsubscribe: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${map[c]}`}
    >
      {c === "Urgent" && <Flame className="w-3 h-3" />}
      {c === "Follow-up" && <Bell className="w-3 h-3" />}
      {c === "Unsubscribe" && <ShieldOff className="w-3 h-3" />}
      {c}
    </span>
  );
}

// ─── Rule card ────────────────────────────────────────────────────────────────

function RuleCard({
  id,
  title,
  description,
  rule,
  onChange,
  onSave,
  saving,
  showDelay,
}: {
  id: string;
  title: string;
  description: string;
  rule: SmsRule;
  onChange: (r: SmsRule) => void;
  onSave: () => void;
  saving: boolean;
  showDelay: boolean;
}) {
  const segments = getTwilioSegments(rule.template);
  const preview = rule.template
    .replace("{firstName}", "Carlos")
    .replace("{businessName}", "Carlos Plumbing")
    .replace("{niche}", "plumbing")
    .replace("{demoLink}", "bookedrankedfunded.org/demo");

  return (
    <div
      data-ocid={`sms-autopilot.rule_card.${id}`}
      className="flex flex-col gap-5 bg-card border border-border rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground text-sm">{title}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">
            {rule.enabled ? "ON" : "OFF"}
          </span>
          <Switch
            data-ocid={`sms-autopilot.rule_toggle.${id}`}
            checked={rule.enabled}
            onCheckedChange={(v) => onChange({ ...rule, enabled: v })}
          />
        </div>
      </div>

      {/* Delay slider (only for 2-opens rule) */}
      {showDelay && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              Send delay after trigger
            </Label>
            <span className="text-xs font-mono text-primary">
              {rule.delayMinutes} min
            </span>
          </div>
          <input
            data-ocid={`sms-autopilot.delay_slider.${id}`}
            type="range"
            min={0}
            max={240}
            step={5}
            value={rule.delayMinutes}
            onChange={(e) =>
              onChange({ ...rule, delayMinutes: Number(e.target.value) })
            }
            className="w-full h-1.5 rounded-full accent-purple-500 bg-muted cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Instant</span>
            <span>4 hours</span>
          </div>
        </div>
      )}

      {/* Template */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Message template
        </Label>
        <Textarea
          data-ocid={`sms-autopilot.template_input.${id}`}
          value={rule.template}
          onChange={(e) => onChange({ ...rule, template: e.target.value })}
          rows={4}
          className="text-sm resize-none bg-background border-border"
          placeholder="Your SMS template…"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{rule.template.length} chars</span>
          <span className="font-mono">
            {segments} Twilio {segments === 1 ? "segment" : "segments"}
          </span>
        </div>
      </div>

      {/* Variables hint */}
      <div className="flex flex-wrap gap-1.5">
        {["{firstName}", "{businessName}", "{niche}", "{demoLink}"].map((v) => (
          <span
            key={v}
            className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono border border-primary/20"
          >
            {v}
          </span>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-lg bg-background border border-border p-3 space-y-1">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3" /> Preview (sample lead: Carlos)
        </p>
        <p className="text-xs text-foreground leading-relaxed">{preview}</p>
      </div>

      <Button
        data-ocid={`sms-autopilot.save_button.${id}`}
        size="sm"
        onClick={onSave}
        disabled={saving}
        className="self-start"
      >
        {saving ? "Saving…" : "Save Rule"}
      </Button>
    </div>
  );
}

// ─── Thread drawer ────────────────────────────────────────────────────────────

function ThreadDrawer({
  job,
  onClose,
  onReply,
}: {
  job: SmsJob | null;
  onClose: () => void;
  onReply: (jobId: string, text: string) => Promise<void>;
}) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!job || !replyText.trim()) return;
    setSending(true);
    await onReply(job.id, replyText.trim());
    setReplyText("");
    setSending(false);
  };

  if (!job) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        role="button"
        tabIndex={0}
        aria-label="Close drawer"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      {/* Drawer */}
      <div
        data-ocid="sms-autopilot.thread_drawer"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="font-semibold text-foreground text-sm">
              {job.leadName}
            </p>
            <p className="text-xs text-muted-foreground">
              {job.niche} · {job.phone}
            </p>
          </div>
          <button
            type="button"
            data-ocid="sms-autopilot.close_drawer_button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {job.thread.map((msg) => (
            <div
              key={`${msg.from}-${msg.time}`}
              className={`flex ${msg.from === "us" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.from === "us"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`mt-1 text-[10px] ${msg.from === "us" ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply input */}
        <div className="p-4 border-t border-border space-y-2">
          <Textarea
            data-ocid="sms-autopilot.quick_reply_input"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type a reply…"
            rows={3}
            className="text-sm resize-none bg-background border-border"
          />
          <Button
            data-ocid="sms-autopilot.send_reply_button"
            size="sm"
            className="w-full"
            onClick={handleSend}
            disabled={sending || !replyText.trim()}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {sending ? "Sending…" : "Send Reply"}
          </Button>
        </div>
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SmsAutopilotPage() {
  const { actor } = useActor();

  const [rules, setRules] = useState<SmsAutopilotRules>({
    twoOpensRule: {
      enabled: true,
      delayMinutes: 60,
      template: DEFAULT_TWO_OPENS_TEMPLATE,
    },
    silenceRule: {
      enabled: true,
      delayMinutes: 0,
      template: DEFAULT_SILENCE_TEMPLATE,
    },
    dailyCap: 200,
  });

  const [stats, setStats] = useState(MOCK_STATS);
  const [jobs] = useState<SmsJob[]>(MOCK_JOBS);
  const [optedOut] = useState<OptedOutPhone[]>(MOCK_OPTED_OUT);
  const [savingOpens, setSavingOpens] = useState(false);
  const [savingSilence, setSavingSilence] = useState(false);
  const [savingCap, setSavingCap] = useState(false);
  const [activeThread, setActiveThread] = useState<SmsJob | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load rules from backend ────────────────────────────────────────────────
  useEffect(() => {
    if (!actor) return;
    (async () => {
      try {
        const result = await (
          actor as Record<string, (...args: unknown[]) => unknown>
        ).getSmsAutopilotRules?.();
        if (result) {
          const r = result as SmsAutopilotRules;
          setRules(r);
        }
      } catch {
        // silently fall back to defaults
      }
    })();
  }, [actor]);

  // ── Poll stats every 60s ───────────────────────────────────────────────────
  useEffect(() => {
    const tick = async () => {
      if (!actor) return;
      try {
        const result = await (
          actor as Record<string, (...args: unknown[]) => unknown>
        ).getSmsAutopilotJobs?.();
        if (result) {
          setStats((prev) => ({
            ...prev,
            ...(result as Partial<typeof MOCK_STATS>),
          }));
        }
      } catch {
        // keep existing stats
      }
    };
    pollRef.current = setInterval(tick, 60_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [actor]);

  // ── Save handlers ──────────────────────────────────────────────────────────
  const saveOpens = useCallback(async () => {
    setSavingOpens(true);
    try {
      if (actor) {
        await (
          actor as Record<string, (...args: unknown[]) => unknown>
        ).updateSmsAutopilotRules?.(rules);
      }
      toast.success("2 Opens rule saved", {
        description: "SMS will fire automatically on trigger.",
      });
    } catch {
      toast.error("Failed to save rule");
    } finally {
      setSavingOpens(false);
    }
  }, [actor, rules]);

  const saveSilence = useCallback(async () => {
    setSavingSilence(true);
    try {
      if (actor) {
        await (
          actor as Record<string, (...args: unknown[]) => unknown>
        ).updateSmsAutopilotRules?.(rules);
      }
      toast.success("48-Hour Silence rule saved");
    } catch {
      toast.error("Failed to save rule");
    } finally {
      setSavingSilence(false);
    }
  }, [actor, rules]);

  const saveCap = useCallback(async () => {
    setSavingCap(true);
    try {
      if (actor) {
        await (
          actor as Record<string, (...args: unknown[]) => unknown>
        ).updateSmsAutopilotRules?.(rules);
      }
      toast.success("Daily cap updated");
    } catch {
      toast.error("Failed to save cap");
    } finally {
      setSavingCap(false);
    }
  }, [actor, rules]);

  const handleReply = useCallback(
    async (jobId: string, text: string) => {
      try {
        if (actor) {
          await (
            actor as Record<string, (...args: unknown[]) => unknown>
          ).processSmsReply?.(jobId, text);
        }
        toast.success("Reply sent");
      } catch {
        toast.error("Failed to send reply");
      }
    },
    [actor],
  );

  // ── Derived ────────────────────────────────────────────────────────────────
  const capPercent = Math.round((stats.sentToday / rules.dailyCap) * 100);
  const capWarning = capPercent >= 80;

  return (
    <div data-ocid="sms-autopilot.page" className="min-h-screen bg-background">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                SMS Autopilot
              </h1>
              <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Trigger precision SMS at the exact moment a lead signals intent —
              before they call your competitor.
            </p>
          </div>
          <a
            href="/sms-inbox"
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Open Full SMS Inbox
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ── Stats bar ─────────────────────────────────────────────────────── */}
        <div
          data-ocid="sms-autopilot.stats_bar"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            {
              label: "SMS Sent Today",
              value: stats.sentToday,
              icon: Send,
              color: "text-primary",
            },
            {
              label: "Delivery Rate",
              value: `${stats.deliveryRate}%`,
              icon: CheckCircle2,
              color: "text-emerald-400",
            },
            {
              label: "Replies Today",
              value: stats.repliesToday,
              icon: MessageSquare,
              color: "text-blue-400",
            },
            {
              label: "Hot Leads Flagged",
              value: stats.hotFlagged,
              icon: Flame,
              color: "text-rose-400",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3"
            >
              <div className={`p-2 rounded-lg bg-muted ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-foreground leading-none">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Autopilot Rules ────────────────────────────────────────────────── */}
        <section data-ocid="sms-autopilot.rules_section">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Autopilot Rules
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <RuleCard
              id="two-opens"
              title="2 Opens Rule"
              description="When a lead opens your email twice in 24 hours, fire a personalized SMS. They're warm — this closes the gap before your competitor does."
              rule={rules.twoOpensRule}
              onChange={(r) =>
                setRules((prev) => ({ ...prev, twoOpensRule: r }))
              }
              onSave={saveOpens}
              saving={savingOpens}
              showDelay
            />
            <RuleCard
              id="silence"
              title="48-Hour Silence Rule"
              description="If a lead hasn't opened after 48 hours, they forgot — or they're busy. One targeted SMS re-activates 3 in 10 cold leads for local service businesses."
              rule={rules.silenceRule}
              onChange={(r) =>
                setRules((prev) => ({ ...prev, silenceRule: r }))
              }
              onSave={saveSilence}
              saving={savingSilence}
              showDelay={false}
            />
          </div>
        </section>

        {/* ── Daily SMS Cap ──────────────────────────────────────────────────── */}
        <section
          data-ocid="sms-autopilot.daily_cap_section"
          className="bg-card border border-border rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Daily SMS Cap
            </h2>
          </div>

          {capWarning && (
            <div
              data-ocid="sms-autopilot.cap_warning"
              className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-300">
                You've used <strong>{capPercent}%</strong> of your daily cap.
                Consider increasing your limit or pausing low-priority
                sequences.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Daily cap (50 – 500)
              </Label>
              <Input
                data-ocid="sms-autopilot.daily_cap_input"
                type="number"
                min={50}
                max={500}
                value={rules.dailyCap}
                onChange={(e) =>
                  setRules((prev) => ({
                    ...prev,
                    dailyCap: Number(e.target.value),
                  }))
                }
                className="w-28 bg-background border-border text-sm"
              />
            </div>
            <Button
              data-ocid="sms-autopilot.save_cap_button"
              size="sm"
              onClick={saveCap}
              disabled={savingCap}
              variant="outline"
            >
              {savingCap ? "Saving…" : "Save Cap"}
            </Button>
          </div>

          {/* Rolling window bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.sentToday} sent in rolling 24 hrs</span>
              <span>{rules.dailyCap - stats.sentToday} remaining today</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${capWarning ? "bg-amber-500" : "bg-primary"}`}
                style={{ width: `${Math.min(capPercent, 100)}%` }}
              />
            </div>
          </div>
        </section>

        {/* ── Inbound SMS Replies ────────────────────────────────────────────── */}
        <section data-ocid="sms-autopilot.replies_section">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Inbound Replies
            </h2>
            <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs ml-auto">
              {jobs.filter((j) => j.classification === "Urgent").length} urgent
            </Badge>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {[
                      "Lead Name",
                      "Niche",
                      "Message",
                      "Classification",
                      "Time",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs text-muted-foreground font-medium px-4 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      data-ocid={`sms-autopilot.reply_row.${idx + 1}`}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                        {job.leadName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {job.niche}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs">
                        <p className="truncate">{job.message}</p>
                      </td>
                      <td className="px-4 py-3">
                        <ClassificationBadge c={job.classification} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {job.time}
                      </td>
                      <td className="px-4 py-3">
                        {job.classification !== "Unsubscribe" && (
                          <Button
                            data-ocid={`sms-autopilot.open_thread_button.${idx + 1}`}
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2"
                            onClick={() => setActiveThread(job)}
                          >
                            View Thread
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card stack */}
            <div className="md:hidden divide-y divide-border">
              {jobs.map((job, idx) => (
                <div
                  key={job.id}
                  data-ocid={`sms-autopilot.reply_card.${idx + 1}`}
                  className="p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">
                      {job.leadName}
                    </span>
                    <ClassificationBadge c={job.classification} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {job.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {job.niche} · {job.time}
                    </span>
                    {job.classification !== "Unsubscribe" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 px-2"
                        onClick={() => setActiveThread(job)}
                      >
                        View Thread
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {jobs.length === 0 && (
              <div
                data-ocid="sms-autopilot.replies_empty_state"
                className="py-16 text-center"
              >
                <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  No replies yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Replies will appear here as leads respond to autopilot SMS.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── Unsubscribe Tracker ────────────────────────────────────────────── */}
        <section
          data-ocid="sms-autopilot.unsubscribe_section"
          className="bg-card border border-border rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <ShieldOff className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Unsubscribe Tracker
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Opt-outs this week:</span>
              <span className="font-semibold text-foreground">
                {optedOut.filter((_, i) => i < 2).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total opt-outs:</span>
              <span className="font-semibold text-foreground">
                {optedOut.length}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/30 border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <EyeOff className="w-3 h-3" /> Phone
                    </div>
                  </th>
                  <th className="text-left text-muted-foreground font-medium px-4 py-2.5">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {optedOut.map((p) => (
                  <tr
                    key={p.masked}
                    data-ocid={`sms-autopilot.opted_out_row.${optedOut.indexOf(p) + 1}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-foreground">
                      {p.masked}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {p.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 bg-muted/20 rounded-lg px-3 py-2.5">
            <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              These numbers will{" "}
              <strong className="text-foreground">never receive SMS</strong>{" "}
              from your account again. Opt-outs are permanent and comply with
              TCPA carrier regulations.
            </p>
          </div>
        </section>

        {/* ── SMS Best Practices ─────────────────────────────────────────────── */}
        <section
          data-ocid="sms-autopilot.tips_section"
          className="bg-card border border-border rounded-xl p-5 space-y-5"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              SMS Best Practices for Local Service Businesses
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            The businesses winning with SMS autopilot aren't sending more texts
            — they're sending the <em>right</em> text at the exact moment a
            lead's guard is down. Here's what the data shows across 10 niches:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {NICHE_TIPS.map((tip) => (
              <div
                key={tip.niche}
                className="bg-background border border-border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{tip.icon}</span>
                  <span className="text-xs font-semibold text-foreground">
                    {tip.niche}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tip.tip}
                </p>
              </div>
            ))}
            {/* Universal tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  Universal Rule
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                First-name personalization alone lifts reply rates by 27%.
                Always lead with the problem they're already experiencing — not
                your solution. They don't care about BRF yet. They care about
                the jobs they're losing tonight.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Thread drawer ──────────────────────────────────────────────────────── */}
      <ThreadDrawer
        job={activeThread}
        onClose={() => setActiveThread(null)}
        onReply={handleReply}
      />
    </div>
  );
}
