import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Filter,
  Layers,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Settings2,
  Smartphone,
  Sparkles,
  SquareX,
  Tag,
  Timer,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
import { Switch } from "../components/ui/switch";
import { useApp } from "../context/AppContext";
import { ADMIN_OUTREACH_SEQUENCES } from "../data/campaignData";
import type { OutreachSequence } from "../data/campaignData";
import {
  PREMIUM_OUTREACH_METADATA,
  PREMIUM_OUTREACH_SEQUENCE,
} from "../data/coldEmailData";
import { demoThrottleConfigs } from "../data/outreachAnalyticsData";
import { useActor } from "../hooks/useActor";
import {
  useBounceRecords,
  useSetThrottleConfig,
  useThrottleConfig,
} from "../hooks/useOutreachAnalytics";
import type {
  OutreachBounceRecord,
  QueueThrottleConfig,
} from "../types/newsletter";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

interface MockLead {
  id: string;
  name: string;
  email: string;
  niche: string;
  status: string;
  tags?: string[];
}

interface ActiveQueue {
  id: string;
  name: string;
  campaignTemplateName: string;
  campaignTemplateId: string;
  status: string; // running | paused | completed | cancelled
  sentCount: number;
  totalCount: number;
  failedCount: number;
  sendIntervalSeconds: number;
  dailySendCap: number;
  dailySentCount: number;
  niche: string;
  createdAt: number;
  completedAt?: number;
  cancelledAt?: number;
  contactEmails: string[];
  contactNames: string[];
}

const INTERVAL_PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "30 min", seconds: 1800 },
  { label: "1 hour", seconds: 3600 },
];

// ─── Throttle interval options ────────────────────────────────────────────────
const THROTTLE_INTERVALS = [
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "30 min", seconds: 1800 },
  { label: "60 min", seconds: 3600 },
];

// ─── SMS Templates per niche (Suby PBS formula) ───────────────────────────────

const SMS_TEMPLATES: Record<
  string,
  { day: number; text: string; framework: string }[]
> = {
  Plumbing: [
    {
      day: 3,
      text: "Missed calls costing you jobs? BRF auto-texts back every missed caller instantly. Reply INFO to see how.",
      framework: "Suby PBS",
    },
    {
      day: 7,
      text: "Hi {{first_name}}, quick question — are you still looking for a plumbing solution? Reply YES for details.",
      framework: "Sugarman",
    },
  ],
  "Med Spa": [
    {
      day: 3,
      text: "Client no-shows hurting your revenue? BRF auto-fills cancellations with waitlist patients. Reply YES to see it live.",
      framework: "Suby PBS",
    },
    {
      day: 7,
      text: "Just circling back, {{first_name}}. The spot we held for you closes Friday. Reply DEMO to see it.",
      framework: "Kennedy",
    },
  ],
  HVAC: [
    {
      day: 3,
      text: "Off-season draining your pipeline? BRF keeps your calendar full year-round. Reply INFO.",
      framework: "Suby PBS",
    },
    {
      day: 7,
      text: "{{first_name}}, honest question — still struggling with slow season? Reply YES to talk.",
      framework: "Brunson",
    },
  ],
  Roofing: [
    {
      day: 3,
      text: "Storm season doesn't wait. BRF keeps your follow-up system running 24/7. Reply INFO.",
      framework: "Suby PBS",
    },
    {
      day: 7,
      text: "{{first_name}}, your competitors are running ads on your name. Reply DEMO to see how to stop it.",
      framework: "Halbert",
    },
  ],
  Restoration: [
    {
      day: 3,
      text: "Missing after-hours emergency calls? BRF AI answers every call. Reply INFO.",
      framework: "Suby PBS",
    },
    {
      day: 7,
      text: "{{first_name}}, still looking to close more insurance jobs? Reply YES to see BRF in action.",
      framework: "Hopkins",
    },
  ],
};

type SequenceMode = "email_only" | "email_sms" | "sms_only";

const MOCK_LEADS: MockLead[] = [
  {
    id: "l1",
    name: "Mike Garrett",
    email: "mike@garrattplumbing.com",
    niche: "Plumbing",
    status: "new",
    tags: ["cold", "Q2"],
  },
  {
    id: "l2",
    name: "Sarah Chen",
    email: "sarah@luxemedspa.com",
    niche: "Med Spa",
    status: "contacted",
    tags: ["warm", "vip"],
  },
  {
    id: "l3",
    name: "Tom Bowers",
    email: "tom@bowerscooling.com",
    niche: "HVAC",
    status: "new",
    tags: ["cold"],
  },
  {
    id: "l4",
    name: "Angela Kim",
    email: "angela@premierskincare.com",
    niche: "Med Spa",
    status: "new",
    tags: ["warm"],
  },
  {
    id: "l5",
    name: "Dave Hopper",
    email: "dave@hopperroofing.com",
    niche: "Roofing",
    status: "cold",
    tags: ["cold", "storm"],
  },
  {
    id: "l6",
    name: "Linda Marsh",
    email: "linda@marshcarpets.com",
    niche: "Carpet Cleaning",
    status: "new",
    tags: [],
  },
  {
    id: "l7",
    name: "Carlos Reyes",
    email: "carlos@reyesrestoration.com",
    niche: "Restoration",
    status: "contacted",
    tags: ["warm"],
  },
  {
    id: "l8",
    name: "Janet Wu",
    email: "janet@wurealestate.com",
    niche: "Real Estate",
    status: "new",
    tags: ["cold"],
  },
];

const MOCK_QUEUES: ActiveQueue[] = [
  {
    id: "q1",
    name: "Plumbing Q2 Outreach",
    campaignTemplateName: "Plumbing Outreach",
    campaignTemplateId: "plumbing-outreach",
    status: "running",
    sentCount: 34,
    totalCount: 48,
    failedCount: 1,
    sendIntervalSeconds: 120,
    dailySendCap: 200,
    dailySentCount: 34,
    niche: "Plumbing",
    createdAt: Date.now() - 3600000,
    contactEmails: [],
    contactNames: [],
  },
  {
    id: "q2",
    name: "Med Spa Reactivation",
    campaignTemplateName: "Med Spa Outreach",
    campaignTemplateId: "medspa-outreach",
    status: "paused",
    sentCount: 12,
    totalCount: 30,
    failedCount: 0,
    sendIntervalSeconds: 300,
    dailySendCap: 150,
    dailySentCount: 12,
    niche: "Med Spa",
    createdAt: Date.now() - 7200000,
    contactEmails: [],
    contactNames: [],
  },
  {
    id: "q3",
    name: "HVAC Summer Push",
    campaignTemplateName: "Plumbing Outreach",
    campaignTemplateId: "plumbing-outreach",
    status: "completed",
    sentCount: 60,
    totalCount: 60,
    failedCount: 2,
    sendIntervalSeconds: 60,
    dailySendCap: 60,
    dailySentCount: 60,
    niche: "HVAC",
    createdAt: Date.now() - 86400000,
    completedAt: Date.now() - 3600000,
    contactEmails: [],
    contactNames: [],
  },
];

// Demo bounce data mapped to mock queues
const QUEUE_BOUNCE_DEMO: Record<string, OutreachBounceRecord[]> = {
  q1: [
    {
      leadId: "lead-0182",
      queueId: "q1",
      bounceType: "hard",
      bouncedAt: "2025-11-14T11:42:00Z",
      reason: "550 5.1.1 The email account does not exist",
      requeued: false,
    },
    {
      leadId: "lead-0283",
      queueId: "q1",
      bounceType: "soft",
      bouncedAt: "2025-11-15T08:20:00Z",
      reason: "452 4.2.2 Mailbox full",
      requeued: false,
    },
  ],
  q2: [
    {
      leadId: "lead-0913",
      queueId: "q2",
      bounceType: "hard",
      bouncedAt: "2025-11-16T10:14:00Z",
      reason: "550 5.4.1 Recipient address rejected: Access denied",
      requeued: false,
    },
  ],
  q3: [],
};

// ────────────────────────────────────────────────
// Helper components
// ────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    running: {
      label: "Running",
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    paused: {
      label: "Paused",
      cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    },
    completed: {
      label: "Completed",
      cls: "bg-muted/50 text-muted-foreground border-border",
    },
    cancelled: {
      label: "Cancelled",
      cls: "bg-red-500/15 text-red-400 border-red-500/30",
    },
    failed: {
      label: "Failed",
      cls: "bg-red-500/15 text-red-400 border-red-500/30",
    },
  };
  const s = map[status] ?? {
    label: status,
    cls: "bg-muted/50 text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${s.cls}`}
    >
      {status === "running" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {s.label}
    </span>
  );
}

function formatInterval(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${seconds / 60}m`;
  return `${seconds / 3600}h`;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Bounce dot indicator ─────────────────────────────────────────────────────
function BounceDot({ type }: { type: "soft" | "hard" | "complaint" | "ok" }) {
  if (type === "ok")
    return (
      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
    );
  if (type === "soft")
    return <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />;
}

// ─── Bounce summary badge ─────────────────────────────────────────────────────
function BounceSummaryBadge({ bounces }: { bounces: OutreachBounceRecord[] }) {
  if (bounces.length === 0) return null;
  const soft = bounces.filter((b) => b.bounceType === "soft").length;
  const hard = bounces.filter(
    (b) => b.bounceType === "hard" || b.bounceType === "complaint",
  ).length;
  return (
    <span
      data-ocid="drip.queue.bounce_summary"
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/25"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      {bounces.length} bounce{bounces.length !== 1 ? "s" : ""}
      {soft > 0 && <span className="text-amber-300/70">({soft} soft</span>}
      {soft > 0 && hard > 0 && <span className="text-amber-300/70">,</span>}
      {hard > 0 && <span className="text-rose-400/80">{hard} hard</span>}
      {(soft > 0 || hard > 0) && <span className="text-amber-300/70">)</span>}
    </span>
  );
}

// ─── Bounced leads panel ──────────────────────────────────────────────────────
function BouncedLeadsPanel({
  queueId,
  bounces: initialBounces,
}: {
  queueId: string;
  bounces: OutreachBounceRecord[];
}) {
  const [bounces, setBounces] =
    useState<OutreachBounceRecord[]>(initialBounces);
  const [open, setOpen] = useState(false);

  if (bounces.length === 0) return null;

  const handleRequeue = (leadId: string) => {
    setBounces((prev) =>
      prev.map((b) => (b.leadId === leadId ? { ...b, requeued: true } : b)),
    );
    toast.success("Lead re-queued for next send window");
  };

  return (
    <div className="mt-3 border border-amber-500/15 rounded-lg overflow-hidden">
      <button
        type="button"
        data-ocid={`drip.queue.bounces_toggle.${queueId}`}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-amber-900/10 hover:bg-amber-900/20 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
          <XCircle size={12} />
          Bounced Leads ({bounces.length})
        </span>
        {open ? (
          <ChevronUp size={12} className="text-amber-400" />
        ) : (
          <ChevronDown size={12} className="text-amber-400" />
        )}
      </button>

      {open && (
        <div
          data-ocid={`drip.queue.bounces_panel.${queueId}`}
          className="divide-y divide-white/5"
        >
          {bounces.map((b, i) => {
            const isHard =
              b.bounceType === "hard" || b.bounceType === "complaint";
            return (
              <div
                key={b.leadId}
                data-ocid={`drip.queue.bounce_item.${i + 1}`}
                className="flex items-start gap-3 px-3 py-2.5 bg-muted/30"
              >
                <BounceDot
                  type={
                    isHard ? "hard" : b.bounceType === "soft" ? "soft" : "hard"
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white font-medium truncate">
                      {b.leadId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        isHard
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {b.bounceType.toUpperCase()}
                    </span>
                    {b.requeued && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Re-queued
                      </span>
                    )}
                  </div>
                  {b.reason && (
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {b.reason}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {formatDate(b.bouncedAt)}
                  </p>
                </div>
                <div className="shrink-0">
                  {isHard ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                      Removed
                    </span>
                  ) : !b.requeued ? (
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`drip.queue.requeue_button.${i + 1}`}
                      onClick={() => handleRequeue(b.leadId)}
                      className="h-6 px-2 text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/15"
                    >
                      <RefreshCw size={9} className="mr-1" />
                      Re-queue
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Throttle settings panel ──────────────────────────────────────────────────
function ThrottleSettingsPanel({ queue }: { queue: ActiveQueue }) {
  const { data: savedConfig } = useThrottleConfig(queue.id);
  const { mutate: saveThrottle, isPending } = useSetThrottleConfig();

  const defaultConfig: QueueThrottleConfig = savedConfig ?? {
    dailyCap: queue.dailySendCap,
    intervalSeconds: queue.sendIntervalSeconds,
    staggerEnabled: false,
    backoffMultiplier: 1.0,
  };

  const [open, setOpen] = useState(false);
  const [dailyCap, setDailyCap] = useState(defaultConfig.dailyCap);
  const [intervalSecs, setIntervalSecs] = useState(
    defaultConfig.intervalSeconds,
  );
  const [stagger, setStagger] = useState(defaultConfig.staggerEnabled);

  // Auto-update when saved config loads
  useEffect(() => {
    if (savedConfig) {
      setDailyCap(savedConfig.dailyCap);
      setIntervalSecs(savedConfig.intervalSeconds);
      setStagger(savedConfig.staggerEnabled);
    }
  }, [savedConfig]);

  const estimatedDays =
    queue.totalCount > 0 && dailyCap > 0
      ? Math.ceil(queue.totalCount / dailyCap)
      : "—";

  const handleSave = () => {
    saveThrottle(
      {
        queueId: queue.id,
        config: {
          dailyCap,
          intervalSeconds: intervalSecs,
          staggerEnabled: stagger,
          backoffMultiplier: defaultConfig.backoffMultiplier,
        },
      },
      {
        onSuccess: () => {
          toast.success("Throttle settings saved");
          setOpen(false);
        },
      },
    );
  };

  const intervalLabel =
    THROTTLE_INTERVALS.find((i) => i.seconds === intervalSecs)?.label ??
    formatInterval(intervalSecs);

  return (
    <div className="mt-3 border border-white/8 rounded-lg overflow-hidden">
      <button
        type="button"
        data-ocid={`drip.queue.throttle_toggle.${queue.id}`}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
      >
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Settings2 size={12} className="text-purple-400" />
          Throttle Settings
          <span className="ml-1 text-[10px] font-normal text-slate-500">
            {dailyCap}/day · {intervalLabel} intervals
            {stagger && " · staggered"}
          </span>
        </span>
        {open ? (
          <ChevronUp size={12} className="text-slate-400" />
        ) : (
          <ChevronDown size={12} className="text-slate-400" />
        )}
      </button>

      {open && (
        <div
          data-ocid={`drip.queue.throttle_panel.${queue.id}`}
          className="px-3 py-3 bg-muted/20 space-y-3"
        >
          {/* Daily send cap */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Daily Send Cap
              </Label>
              <Input
                type="number"
                min={100}
                max={2000}
                value={dailyCap}
                onChange={(e) =>
                  setDailyCap(
                    Math.min(2000, Math.max(100, Number(e.target.value))),
                  )
                }
                data-ocid={`drip.throttle.daily_cap_input.${queue.id}`}
                className="h-7 w-28 text-xs bg-card border-input"
              />
            </div>
            {/* Send interval */}
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Send Interval
              </Label>
              <Select
                value={String(intervalSecs)}
                onValueChange={(v) => setIntervalSecs(Number(v))}
              >
                <SelectTrigger
                  data-ocid={`drip.throttle.interval_select.${queue.id}`}
                  className="h-7 w-32 text-xs bg-card border-input"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {THROTTLE_INTERVALS.map((opt) => (
                    <SelectItem
                      key={opt.seconds}
                      value={String(opt.seconds)}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stagger toggle */}
          <div className="flex items-center gap-2">
            <Switch
              checked={stagger}
              onCheckedChange={setStagger}
              data-ocid={`drip.throttle.stagger_switch.${queue.id}`}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className="text-xs text-foreground">
              Stagger sends{" "}
              <span className="text-muted-foreground">
                (±20% randomization)
              </span>
            </span>
          </div>

          {/* Estimated duration */}
          <div className="bg-purple-900/15 border border-purple-500/15 rounded-lg px-3 py-2 text-xs text-purple-300 flex items-center gap-2">
            <Zap size={11} className="shrink-0" />
            <span>
              {queue.totalCount} leads at {dailyCap}/day ≈{" "}
              <strong>
                {estimatedDays} day{estimatedDays !== 1 ? "s" : ""}
              </strong>
            </span>
          </div>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isPending}
            data-ocid={`drip.throttle.save_button.${queue.id}`}
            className="h-7 text-xs bg-purple-600 hover:bg-purple-500 text-white w-full"
          >
            {isPending ? "Saving…" : "Save Throttle Settings"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Segmentation drawer ──────────────────────────────────────────────────────
const ALL_NICHES = [
  "All",
  "Plumbing",
  "Med Spa",
  "HVAC",
  "Roofing",
  "Restoration",
  "Real Estate",
  "Carpet Cleaning",
  "Dental",
  "Technology",
];

const ALL_TAGS = ["cold", "warm", "vip", "Q2", "storm"];

interface SegmentDrawerProps {
  open: boolean;
  queueId: string;
  onClose: () => void;
  onAssign: (emails: string[], count: number) => void;
}

function SegmentDrawer({
  open,
  queueId,
  onClose,
  onAssign,
}: SegmentDrawerProps) {
  const [nicheFilter, setNicheFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [customKey, setCustomKey] = useState("");
  const [customVal, setCustomVal] = useState("");

  const matchedLeads = MOCK_LEADS.filter((l) => {
    if (nicheFilter !== "All" && l.niche !== nicheFilter) return false;
    if (selectedTags.size > 0) {
      const tags = l.tags ?? [];
      if (![...selectedTags].every((t) => tags.includes(t))) return false;
    }
    return true;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const s = new Set(prev);
      s.has(tag) ? s.delete(tag) : s.add(tag);
      return s;
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60">
      <div
        data-ocid={`drip.segment_drawer.${queueId}`}
        className="bg-background border border-border rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-5 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Filter size={14} className="text-purple-400" />
            Add Leads by Segment
          </h3>
          <button
            type="button"
            data-ocid={`drip.segment_drawer.close_button.${queueId}`}
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>

        {/* Niche filter */}
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">
            Niche Filter
          </Label>
          <Select value={nicheFilter} onValueChange={setNicheFilter}>
            <SelectTrigger
              data-ocid={`drip.segment.niche_select.${queueId}`}
              className="h-8 text-xs bg-gray-900 border-white/10 text-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {ALL_NICHES.map((n) => (
                <SelectItem key={n} value={n} className="text-xs text-white">
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tag filter */}
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block flex items-center gap-1">
            <Tag size={10} />
            Tag Filter
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                data-ocid={`drip.segment.tag.${tag}`}
                onClick={() => toggleTag(tag)}
                className={`text-[10px] font-medium px-2 py-1 rounded-full border transition-colors ${
                  selectedTags.has(tag)
                    ? "bg-purple-600/30 text-purple-300 border-purple-500/40"
                    : "border-white/10 text-slate-400 hover:text-white bg-gray-900"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Custom field filter */}
        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">
            Custom Field Filter
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Field key"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              data-ocid={`drip.segment.custom_key_input.${queueId}`}
              className="h-7 text-xs bg-gray-900 border-white/10 text-white placeholder:text-slate-600 flex-1"
            />
            <Input
              placeholder="Value"
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              data-ocid={`drip.segment.custom_val_input.${queueId}`}
              className="h-7 text-xs bg-gray-900 border-white/10 text-white placeholder:text-slate-600 flex-1"
            />
          </div>
        </div>

        {/* Lead preview count */}
        <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg px-3 py-2 text-xs text-purple-300 flex items-center gap-2">
          <Users size={12} />
          <span>
            <strong>{matchedLeads.length} leads</strong> match current filters
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            data-ocid={`drip.segment_drawer.cancel_button.${queueId}`}
            className="flex-1 h-8 text-xs border-white/10 text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={matchedLeads.length === 0}
            data-ocid={`drip.segment_drawer.assign_button.${queueId}`}
            onClick={() => {
              onAssign(
                matchedLeads.map((l) => l.email),
                matchedLeads.length,
              );
              onClose();
            }}
            className="flex-1 h-8 text-xs bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40"
          >
            <Users size={11} className="mr-1" />
            Assign {matchedLeads.length} to Queue
          </Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Queue card — enhanced with bounce, throttle, segmentation, progress
// ────────────────────────────────────────────────

function QueueCard({
  queue,
  onPause,
  onResume,
  onCancel,
  onLeadsAdded,
}: {
  queue: ActiveQueue;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onLeadsAdded: (queueId: string, count: number) => void;
}) {
  const pct =
    queue.totalCount > 0
      ? Math.round((queue.sentCount / queue.totalCount) * 100)
      : 0;
  const isActive = queue.status === "running" || queue.status === "paused";

  // Bounce data — use demo mapping, fall back to hook data
  const demoBounces = QUEUE_BOUNCE_DEMO[queue.id] ?? [];
  const { data: hookBounces } = useBounceRecords(queue.id);
  const bounces = demoBounces.length > 0 ? demoBounces : (hookBounces ?? []);
  const softCount = bounces.filter((b) => b.bounceType === "soft").length;
  const hardCount = bounces.filter(
    (b) => b.bounceType === "hard" || b.bounceType === "complaint",
  ).length;

  // Throttle config
  const { data: throttle } = useThrottleConfig(
    demoThrottleConfigs[queue.id] ? queue.id : "",
  );
  const throttleSummary = throttle
    ? `${throttle.dailyCap}/day · ${formatInterval(throttle.intervalSeconds)} intervals`
    : `${queue.dailySendCap}/day · ${formatInterval(queue.sendIntervalSeconds)} intervals`;

  const [segOpen, setSegOpen] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const handleLeadsAssigned = (_emails: string[], count: number) => {
    setAddedCount((prev) => prev + count);
    onLeadsAdded(queue.id, count);
    toast.success(`${count} leads added to "${queue.name}"`);
  };

  return (
    <div
      data-ocid="drip.queue.card"
      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white truncate">
              {queue.name}
            </h3>
            <StatusBadge status={queue.status} />
            {bounces.length > 0 && <BounceSummaryBadge bounces={bounces} />}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">
            {queue.campaignTemplateName} · {queue.niche}
          </p>
          {/* Throttle config summary */}
          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Settings2 size={9} />
            {throttleSummary}
            {addedCount > 0 && (
              <span className="ml-1 text-emerald-400 font-medium">
                +{addedCount} added
              </span>
            )}
          </p>
        </div>

        {isActive && (
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            {queue.status === "running" ? (
              <Button
                size="sm"
                variant="outline"
                data-ocid="drip.queue.pause_button"
                onClick={() => onPause(queue.id)}
                className="h-7 px-2.5 text-xs border-white/10 bg-white/5 hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30 text-slate-300"
              >
                <Pause size={12} className="mr-1" /> Pause
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                data-ocid="drip.queue.resume_button"
                onClick={() => onResume(queue.id)}
                className="h-7 px-2.5 text-xs border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 text-slate-300"
              >
                <Play size={12} className="mr-1" /> Resume
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              data-ocid="drip.queue.cancel_button"
              onClick={() => onCancel(queue.id)}
              className="h-7 px-2.5 text-xs border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-slate-300"
            >
              <SquareX size={12} className="mr-1" /> Cancel
            </Button>
            {/* Add Leads by Segment */}
            <Button
              size="sm"
              variant="outline"
              data-ocid={`drip.queue.add_segment_button.${queue.id}`}
              onClick={() => setSegOpen(true)}
              className="h-7 px-2.5 text-xs border-purple-500/25 bg-purple-500/5 hover:bg-purple-500/15 hover:text-purple-300 text-purple-400"
            >
              <Filter size={11} className="mr-1" /> Segments
            </Button>
          </div>
        )}
      </div>

      {/* Progress bar with sent/total */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>
            {queue.sentCount} of {queue.totalCount + addedCount} sent
          </span>
          <span className="font-medium text-white">{pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5 bg-gray-800" />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
        <span className="flex items-center gap-1">
          <CheckCircle2 size={11} className="text-emerald-400" />
          {queue.sentCount} sent
        </span>
        <span className="flex items-center gap-1">
          <Timer size={11} className="text-purple-400" />
          {queue.totalCount + addedCount - queue.sentCount} queued
        </span>
        {queue.failedCount > 0 && (
          <span className="flex items-center gap-1">
            <XCircle size={11} className="text-red-400" />
            {queue.failedCount} failed
          </span>
        )}
        {softCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {softCount} soft
          </span>
        )}
        {hardCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {hardCount} hard
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock size={11} />
          {formatInterval(queue.sendIntervalSeconds)} interval · cap{" "}
          {queue.dailySendCap}/day
        </span>
      </div>

      {isActive && queue.status === "running" && (
        <p className="text-[10px] text-slate-500 mt-2">
          Next send in ~{formatInterval(queue.sendIntervalSeconds)} · Started{" "}
          {timeAgo(queue.createdAt)}
        </p>
      )}

      {/* Throttle settings collapsible */}
      <ThrottleSettingsPanel queue={queue} />

      {/* Bounced leads panel */}
      {bounces.length > 0 && (
        <BouncedLeadsPanel queueId={queue.id} bounces={bounces} />
      )}

      {/* Segmentation drawer */}
      <SegmentDrawer
        open={segOpen}
        queueId={queue.id}
        onClose={() => setSegOpen(false)}
        onAssign={handleLeadsAssigned}
      />
    </div>
  );
}

// ────────────────────────────────────────────────
// New drip modal — 4 step wizard
// ────────────────────────────────────────────────

function NewDripModal({
  open,
  onClose,
  onLaunch,
}: {
  open: boolean;
  onClose: () => void;
  onLaunch: (
    contacts: MockLead[],
    template: OutreachSequence,
    intervalSecs: number,
    dailyCap: number,
    name: string,
  ) => void;
}) {
  const [step, setStep] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [nicheFilter, setNicheFilter] = useState("All");
  const [selectedTemplate, setSelectedTemplate] =
    useState<OutreachSequence | null>(null);
  const [templateNicheFilter, setTemplateNicheFilter] = useState("All");
  const [intervalSeconds, setIntervalSeconds] = useState(120);
  const [customInterval, setCustomInterval] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [dailyCap, setDailyCap] = useState(50);
  const [queueName, setQueueName] = useState("");
  const [sequenceMode, setSequenceMode] = useState<SequenceMode>("email_only");

  const filteredLeads =
    nicheFilter === "All"
      ? MOCK_LEADS
      : MOCK_LEADS.filter((l) => l.niche === nicheFilter);
  const filteredTemplates =
    templateNicheFilter === "All"
      ? ADMIN_OUTREACH_SEQUENCES
      : ADMIN_OUTREACH_SEQUENCES.filter((t) => t.niche === templateNicheFilter);
  const selectedLeadObjs = MOCK_LEADS.filter((l) => selectedLeads.has(l.id));

  const effectiveInterval = useCustom
    ? Number.parseInt(customInterval) || 120
    : intervalSeconds;

  const reset = () => {
    setStep(0);
    setSelectedLeads(new Set());
    setNicheFilter("All");
    setSelectedTemplate(null);
    setTemplateNicheFilter("All");
    setIntervalSeconds(120);
    setCustomInterval("");
    setUseCustom(false);
    setDailyCap(50);
    setQueueName("");
    setSequenceMode("email_only");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleLead = (id: string) => {
    setSelectedLeads((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const canNext = [
    selectedLeads.size > 0,
    !!selectedTemplate,
    effectiveInterval >= 30 && dailyCap >= 1 && dailyCap <= 500,
    !!queueName.trim(),
  ][step];

  const handleLaunch = () => {
    if (!selectedTemplate) return;
    onLaunch(
      selectedLeadObjs,
      selectedTemplate,
      effectiveInterval,
      dailyCap,
      queueName.trim(),
    );
    reset();
    onClose();
  };

  const STEPS = [
    "Select Contacts",
    "Pick Template",
    "Configure Timing",
    "Review & Launch",
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-gray-950 border-white/10 text-white p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="text-purple-400" size={20} />
            New Drip Campaign
          </DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 px-6 pt-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 flex-1 min-w-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i < step
                    ? "bg-purple-600 text-white"
                    : i === step
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800 text-slate-500"
                }`}
              >
                {i < step ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span
                className={`text-xs truncate hidden sm:block ${i === step ? "text-white font-medium" : "text-slate-500"}`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <ChevronRight size={12} className="text-slate-700 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="px-6 py-5 min-h-[340px] max-h-[420px] overflow-y-auto">
          {/* Step 0 — Select contacts */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <p className="text-sm text-slate-300 flex-1">
                  Select CRM leads to include in this drip.
                </p>
                <div className="flex gap-1 flex-wrap">
                  {["All", "Plumbing", "Med Spa", "HVAC"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      data-ocid={`drip.contacts.filter.${n.toLowerCase().replace(/\s/g, "_")}`}
                      onClick={() => setNicheFilter(n)}
                      className={`text-xs px-2 py-1 rounded-md border transition-colors ${nicheFilter === n ? "bg-purple-600/30 text-purple-300 border-purple-500/40" : "border-white/10 text-slate-400 hover:text-white bg-transparent"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border border-white/8 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-3 py-2 bg-gray-900 border-b border-white/5">
                  <Checkbox
                    data-ocid="drip.contacts.select_all"
                    checked={
                      filteredLeads.length > 0 &&
                      filteredLeads.every((l) => selectedLeads.has(l.id))
                    }
                    onCheckedChange={toggleAll}
                    className="border-white/20"
                  />
                  <span className="text-xs text-slate-400">
                    {selectedLeads.size > 0
                      ? `${selectedLeads.size} selected`
                      : "Select all"}
                  </span>
                </div>
                {filteredLeads.map((lead, i) => (
                  <div
                    key={lead.id}
                    data-ocid={`drip.contacts.item.${i + 1}`}
                    className={`flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/3 transition-colors ${selectedLeads.has(lead.id) ? "bg-purple-500/5" : ""}`}
                  >
                    <Checkbox
                      checked={selectedLeads.has(lead.id)}
                      onCheckedChange={() => toggleLead(lead.id)}
                      className="border-white/20"
                      data-ocid={`drip.contacts.checkbox.${i + 1}`}
                    />
                    <div className="w-7 h-7 rounded-full bg-purple-900/50 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {lead.email}
                      </p>
                    </div>
                    <Badge className="text-[10px] py-0 bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shrink-0">
                      {lead.niche}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Pick template */}
          {step === 1 && (
            <div className="space-y-4">
              {/* SMS / Email mode toggle */}
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium">
                  Sequence Mode
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "email_only", label: "Email Only", icon: Mail },
                    {
                      value: "email_sms",
                      label: "Email + SMS",
                      icon: MessageSquare,
                    },
                    { value: "sms_only", label: "SMS Only", icon: Smartphone },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      data-ocid={`drip.mode.${value}`}
                      onClick={() => setSequenceMode(value as SequenceMode)}
                      className={`flex items-center gap-2 justify-center text-xs py-2 rounded-lg border transition-all font-medium ${
                        sequenceMode === value
                          ? "border-purple-500/60 bg-purple-600/20 text-purple-300"
                          : "border-white/8 bg-gray-900 text-slate-400 hover:border-purple-500/30 hover:text-white"
                      }`}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  ))}
                </div>
                {sequenceMode !== "email_only" && (
                  <div className="mt-2 flex items-center gap-2 bg-amber-900/20 border border-amber-700/30 rounded-lg px-3 py-2 text-xs text-amber-400">
                    <Smartphone size={12} className="shrink-0" />
                    SMS requires Twilio connected in Go Live Dashboard
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-slate-300 flex-1">
                  Choose a campaign sequence to send.
                </p>
                <div className="flex gap-1">
                  {["All", "Plumbing", "Med Spa"].map((n) => (
                    <button
                      key={n}
                      type="button"
                      data-ocid={`drip.template.filter.${n.toLowerCase().replace(/\s/g, "_")}`}
                      onClick={() => setTemplateNicheFilter(n)}
                      className={`text-xs px-2 py-1 rounded-md border transition-colors ${templateNicheFilter === n ? "bg-purple-600/30 text-purple-300 border-purple-500/40" : "border-white/10 text-slate-400 hover:text-white bg-transparent"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                {/* Premium Outreach — always shown at top */}
                <button
                  type="button"
                  data-ocid="drip.template.premium"
                  onClick={() =>
                    setSelectedTemplate({
                      id: PREMIUM_OUTREACH_SEQUENCE.id,
                      name: PREMIUM_OUTREACH_METADATA.name,
                      niche: "Plumbing",
                      objective:
                        "Cross-niche 9-email sequence: pain points → demo → 7-day free trial",
                      steps: PREMIUM_OUTREACH_SEQUENCE.touches.map((t, i) => ({
                        id: t.id,
                        stepNumber: i + 1,
                        channel: "email" as const,
                        subject: t.variants[0]?.subject ?? "",
                        previewText: "",
                        body: t.variants[0]?.body ?? "",
                        delayDays: t.dayOffset,
                        delayLabel: `Day ${t.dayOffset}`,
                        delayHours: t.dayOffset * 24,
                      })),
                      performance: {
                        enrolled: 0,
                        sent: 0,
                        openRate: 0,
                        clickRate: 0,
                        replies: 0,
                        conversions: 0,
                      },
                    })
                  }
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTemplate?.id === PREMIUM_OUTREACH_SEQUENCE.id
                      ? "border-purple-500/60 bg-purple-600/10"
                      : "border-purple-500/30 bg-purple-900/10 hover:border-purple-500/50 hover:bg-purple-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">
                          {PREMIUM_OUTREACH_METADATA.name}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40">
                          <Sparkles size={9} />
                          NEW — Premium
                        </span>
                        <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Replaces cold outreach
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Cross-niche · pain points → demo → 7-day free trial
                      </p>
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        {PREMIUM_OUTREACH_METADATA.frameworks.map((fw) => (
                          <span
                            key={fw}
                            className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full px-2 py-0.5"
                          >
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-white font-medium">
                        {PREMIUM_OUTREACH_METADATA.totalEmails} emails
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {PREMIUM_OUTREACH_METADATA.totalDays} days
                      </span>
                    </div>
                  </div>
                </button>

                {/* Standard library templates */}
                {filteredTemplates.map((tpl, i) => (
                  <button
                    key={tpl.id}
                    type="button"
                    data-ocid={`drip.template.item.${i + 1}`}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTemplate?.id === tpl.id
                        ? "border-purple-500/60 bg-purple-600/10"
                        : "border-white/8 bg-gray-900 hover:border-purple-500/30 hover:bg-purple-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {tpl.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tpl.objective}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className="text-[10px] py-0 bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                          {tpl.niche}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {
                            tpl.steps.filter((s) => s.channel === "email")
                              .length
                          }{" "}
                          emails
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Activity size={10} /> {tpl.performance.openRate}% opens
                      </span>
                      <span className="flex items-center gap-1">
                        <Send size={10} /> {tpl.performance.conversions}{" "}
                        conversions
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* SMS interleaved preview */}
              {sequenceMode === "email_sms" && selectedTemplate && (
                <div className="mt-3 border border-purple-700/20 rounded-lg overflow-hidden">
                  <p className="text-xs text-slate-400 font-medium px-3 py-2 bg-purple-900/20 uppercase tracking-wide">
                    Email + SMS Interleaved Preview
                  </p>
                  <div className="p-2 space-y-1.5 max-h-44 overflow-y-auto">
                    {selectedTemplate.steps.slice(0, 5).map((s, i) => {
                      const smsTpls =
                        SMS_TEMPLATES[selectedTemplate.niche] ??
                        SMS_TEMPLATES.Plumbing;
                      const dayNum = Math.round(s.delayHours / 24);
                      const smsStep = smsTpls.find(
                        (st) => st.day === dayNum + 2,
                      );
                      return (
                        <div key={s.id}>
                          <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-700/20 rounded-lg px-3 py-2 text-xs text-blue-300">
                            <Mail size={11} className="shrink-0" />
                            <span className="font-medium">
                              Day {dayNum}: Email {i + 1}
                            </span>
                            <span className="text-slate-500 truncate ml-auto">
                              {s.subject?.slice(0, 40) ?? "—"}
                            </span>
                          </div>
                          {smsStep && (
                            <div className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-700/20 rounded-lg px-3 py-2 text-xs text-emerald-300 mt-1">
                              <Smartphone size={11} className="shrink-0" />
                              <span className="font-medium">
                                Day {smsStep.day}: SMS
                              </span>
                              <span className="text-slate-500 truncate ml-auto">
                                {smsStep.text.slice(0, 40)}…
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Configure timing */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-slate-200 mb-2 block">
                  Send Interval
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {INTERVAL_PRESETS.map((p) => (
                    <button
                      key={p.seconds}
                      type="button"
                      data-ocid={`drip.interval.${p.label.replace(/\s/g, "_")}`}
                      onClick={() => {
                        setIntervalSeconds(p.seconds);
                        setUseCustom(false);
                      }}
                      className={`text-xs py-2 rounded-lg border transition-all font-medium ${
                        !useCustom && intervalSeconds === p.seconds
                          ? "border-purple-500/60 bg-purple-600/20 text-purple-300"
                          : "border-white/8 bg-gray-900 text-slate-400 hover:border-purple-500/30 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="custom-interval"
                    checked={useCustom}
                    onCheckedChange={(v) => setUseCustom(!!v)}
                    data-ocid="drip.interval.custom_toggle"
                    className="border-white/20"
                  />
                  <Label
                    htmlFor="custom-interval"
                    className="text-xs text-slate-400"
                  >
                    Custom interval (seconds)
                  </Label>
                  {useCustom && (
                    <Input
                      type="number"
                      min={30}
                      value={customInterval}
                      onChange={(e) => setCustomInterval(e.target.value)}
                      data-ocid="drip.interval.custom_input"
                      placeholder="e.g. 70"
                      className="w-28 h-7 text-xs bg-gray-900 border-white/10 text-white"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm text-slate-200 mb-2 block">
                  Daily Send Cap{" "}
                  <span className="text-slate-500 font-normal">
                    (max emails per day)
                  </span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={500}
                  value={dailyCap}
                  onChange={(e) => setDailyCap(Number(e.target.value))}
                  data-ocid="drip.timing.daily_cap_input"
                  className="w-32 bg-gray-900 border-white/10 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Caffeine email supports up to ~500 sends/day safely.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 — Review & launch */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <Label className="text-sm text-slate-200 mb-1.5 block">
                  Queue Name
                </Label>
                <Input
                  value={queueName}
                  onChange={(e) => setQueueName(e.target.value)}
                  data-ocid="drip.review.queue_name_input"
                  placeholder="e.g. Plumbing Q2 Outreach"
                  className="bg-gray-900 border-white/10 text-white placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 border border-white/8 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Users size={11} /> Contacts
                  </p>
                  <p className="text-lg font-bold text-white">
                    {selectedLeadObjs.length}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {selectedLeadObjs
                      .map((l) => l.name.split(" ")[0])
                      .join(", ")}
                  </p>
                </div>
                <div className="bg-gray-900 border border-white/8 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Layers size={11} /> Template
                  </p>
                  <p className="text-sm font-bold text-white truncate">
                    {selectedTemplate?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {
                      selectedTemplate?.steps.filter(
                        (s) => s.channel === "email",
                      ).length
                    }{" "}
                    email steps
                  </p>
                </div>
                <div className="bg-gray-900 border border-white/8 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Timer size={11} /> Interval
                  </p>
                  <p className="text-lg font-bold text-white">
                    {formatInterval(effectiveInterval)}
                  </p>
                  <p className="text-xs text-slate-500">between sends</p>
                </div>
                <div className="bg-gray-900 border border-white/8 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Activity size={11} /> Daily Cap
                  </p>
                  <p className="text-lg font-bold text-white">{dailyCap}</p>
                  <p className="text-xs text-slate-500">emails/day max</p>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-3 text-xs text-purple-300 flex items-start gap-2">
                <Send size={13} className="shrink-0 mt-0.5" />
                <span>
                  The <strong>first email fires immediately</strong> when you
                  click Launch. Subsequent emails send every{" "}
                  {formatInterval(effectiveInterval)}, up to {dailyCap}/day.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 pb-5 pt-3 border-t border-white/8">
          <Button
            variant="ghost"
            onClick={step === 0 ? handleClose : () => setStep((s) => s - 1)}
            data-ocid={
              step === 0 ? "drip.modal.close_button" : "drip.modal.back_button"
            }
            className="text-slate-400 hover:text-white"
          >
            {step === 0 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft size={14} className="mr-1" />
                Back
              </>
            )}
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              data-ocid="drip.modal.next_button"
              className="bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40"
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              disabled={!canNext}
              data-ocid="drip.modal.launch_button"
              className="bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40"
            >
              <Send size={14} className="mr-1.5" />
              Launch Drip
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────

export default function DripCampaignsPage() {
  const { currentTenantId } = useApp();
  const { actor } = useActor();
  const [queues, setQueues] = useState<ActiveQueue[]>(MOCK_QUEUES);
  const [showModal, setShowModal] = useState(false);
  const timerRefs = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map(),
  );

  // ── Poll queues every 5s ──────────────────────
  useEffect(() => {
    if (!actor) return;
    const poll = async () => {
      try {
        const raw = (await actor.getDripQueues(currentTenantId)) as Array<
          Record<string, unknown>
        >;
        if (Array.isArray(raw)) {
          setQueues(
            raw.map((q) => ({
              id: String(q.id),
              name: String(q.name),
              campaignTemplateName: String(q.campaignTemplateName),
              campaignTemplateId: String(q.campaignTemplateId),
              status: String(q.status),
              sentCount: Number(q.sentCount),
              totalCount: (q.contactEmails as string[]).length,
              failedCount: Number(q.failedCount),
              sendIntervalSeconds: Number(q.sendIntervalSeconds),
              dailySendCap: Number(q.dailySendCap),
              dailySentCount: Number(q.dailySentCount),
              niche: String(q.niche),
              createdAt: Number(q.createdAt) / 1_000_000,
              completedAt: q.completedAt
                ? Number(q.completedAt) / 1_000_000
                : undefined,
              cancelledAt: q.cancelledAt
                ? Number(q.cancelledAt) / 1_000_000
                : undefined,
              contactEmails: (q.contactEmails as string[]) ?? [],
              contactNames: (q.contactNames as string[]) ?? [],
            })),
          );
        }
      } catch (_) {
        // fallback — keep mock data
      }
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [actor, currentTenantId]);

  // ── Stop timers on unmount ────────────────────
  useEffect(() => {
    return () => {
      for (const t of timerRefs.current.values()) clearInterval(t);
    };
  }, []);

  const startTimer = useCallback(
    (queueId: string, intervalSecs: number) => {
      const existing = timerRefs.current.get(queueId);
      if (existing) clearInterval(existing);

      const id = setInterval(async () => {
        if (actor) {
          try {
            await actor.processDripQueueStep(queueId);
            setQueues((prev) =>
              prev.map((q) =>
                q.id === queueId && q.sentCount < q.totalCount
                  ? {
                      ...q,
                      sentCount: q.sentCount + 1,
                      dailySentCount: q.dailySentCount + 1,
                    }
                  : q,
              ),
            );
          } catch (_) {}
        } else {
          // mock tick
          setQueues((prev) =>
            prev.map((q) => {
              if (q.id !== queueId || q.status !== "running") return q;
              const newSent = Math.min(q.sentCount + 1, q.totalCount);
              const done = newSent >= q.totalCount;
              if (done) {
                clearInterval(timerRefs.current.get(queueId));
                timerRefs.current.delete(queueId);
              }
              return {
                ...q,
                sentCount: newSent,
                status: done ? "completed" : "running",
              };
            }),
          );
        }
      }, intervalSecs * 1000);

      timerRefs.current.set(queueId, id);
    },
    [actor],
  );

  const handlePause = async (id: string) => {
    const t = timerRefs.current.get(id);
    if (t) {
      clearInterval(t);
      timerRefs.current.delete(id);
    }
    if (actor) {
      try {
        await actor.updateDripQueueStatus(id, "paused");
      } catch (_) {}
    }
    setQueues((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "paused" } : q)),
    );
    toast.success("Queue paused");
  };

  const handleResume = async (id: string) => {
    const q = queues.find((x) => x.id === id);
    if (!q) return;
    if (actor) {
      try {
        await actor.updateDripQueueStatus(id, "running");
      } catch (_) {}
    }
    setQueues((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "running" } : x)),
    );
    startTimer(id, q.sendIntervalSeconds);
    toast.success("Queue resumed");
  };

  const handleCancel = async (id: string) => {
    const t = timerRefs.current.get(id);
    if (t) {
      clearInterval(t);
      timerRefs.current.delete(id);
    }
    if (actor) {
      try {
        await actor.updateDripQueueStatus(id, "cancelled");
      } catch (_) {}
    }
    setQueues((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: "cancelled", cancelledAt: Date.now() }
          : q,
      ),
    );
    toast.info("Queue cancelled");
  };

  const handleLeadsAdded = (queueId: string, count: number) => {
    setQueues((prev) =>
      prev.map((q) =>
        q.id === queueId ? { ...q, totalCount: q.totalCount + count } : q,
      ),
    );
  };

  const handleLaunch = async (
    contacts: MockLead[],
    template: OutreachSequence,
    intervalSecs: number,
    cap: number,
    name: string,
  ) => {
    const now = BigInt(Date.now()) * 1_000_000n;
    const newId = `q-${Date.now()}`;
    const emails = contacts.map((c) => c.email);
    const names = contacts.map((c) => c.name);

    const queuePayload = {
      id: newId,
      name,
      tenantId: currentTenantId,
      campaignTemplateId: template.id,
      campaignTemplateName: template.name,
      niche: template.niche,
      contactEmails: emails,
      contactNames: names,
      sendIntervalSeconds: BigInt(intervalSecs),
      dailySendCap: BigInt(cap),
      status: "running",
      sentCount: 0n,
      failedCount: 0n,
      dailySentCount: 0n,
      currentIndex: 0n,
      dailyResetAt: now,
      createdAt: now,
      updatedAt: now,
    };

    let actualId = newId;
    if (actor) {
      try {
        actualId = (await actor.createDripQueue(queuePayload)) as string;
        await actor.processDripQueueStep(actualId);
      } catch (_) {}
    }

    const localQueue: ActiveQueue = {
      id: actualId,
      name,
      campaignTemplateName: template.name,
      campaignTemplateId: template.id,
      status: "running",
      sentCount: 1,
      totalCount: contacts.length,
      failedCount: 0,
      sendIntervalSeconds: intervalSecs,
      dailySendCap: cap,
      dailySentCount: 1,
      niche: template.niche,
      createdAt: Date.now(),
      contactEmails: emails,
      contactNames: names,
    };

    setQueues((prev) => [localQueue, ...prev]);
    startTimer(actualId, intervalSecs);
    toast.success(
      `Drip launched! First email sent to ${contacts[0]?.name ?? "contact"}.`,
    );
  };

  const activeQueues = queues.filter(
    (q) => q.status === "running" || q.status === "paused",
  );
  const historyQueues = queues.filter(
    (q) => q.status === "completed" || q.status === "cancelled",
  );
  const totalSent = queues.reduce((acc, q) => acc + q.sentCount, 0);
  const totalRunning = activeQueues.filter(
    (q) => q.status === "running",
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-ocid="drip.page">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="text-purple-400" size={24} />
            CRM Drip Sender
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Select contacts, pick a campaign sequence, set your send interval,
            and launch — first email fires instantly.
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          data-ocid="drip.new_campaign.button"
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-900/30"
        >
          <Plus size={16} className="mr-1.5" />
          New Drip Campaign
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Active Queues",
            value: activeQueues.length,
            icon: Activity,
            color: "text-purple-400",
          },
          {
            label: "Running Now",
            value: totalRunning,
            icon: Play,
            color: "text-emerald-400",
          },
          {
            label: "Total Sent",
            value: totalSent,
            icon: Send,
            color: "text-indigo-400",
          },
          {
            label: "Contacts Queued",
            value: activeQueues.reduce(
              (a, q) => a + (q.totalCount - q.sentCount),
              0,
            ),
            icon: Users,
            color: "text-blue-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-gray-900 border border-white/8 rounded-xl p-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-lg font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active queues */}
      <section data-ocid="drip.active_queues.section">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
            Active Queues
          </h2>
          <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/20 text-[10px]">
            {activeQueues.length}
          </Badge>
        </div>

        {activeQueues.length === 0 ? (
          <div
            data-ocid="drip.active_queues.empty_state"
            className="bg-gray-900 border border-dashed border-white/10 rounded-xl p-8 text-center"
          >
            <Mail size={32} className="mx-auto text-slate-700 mb-3" />
            <p className="text-sm text-slate-400">No active drip queues</p>
            <p className="text-xs text-slate-600 mt-1">
              Click "New Drip Campaign" to get started.
            </p>
            <Button
              onClick={() => setShowModal(true)}
              data-ocid="drip.empty.start_button"
              variant="outline"
              className="mt-4 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <Plus size={14} className="mr-1" /> Start Your First Drip
            </Button>
          </div>
        ) : (
          <div
            className="grid gap-3 md:grid-cols-2"
            data-ocid="drip.active_queues.list"
          >
            {activeQueues.map((q) => (
              <QueueCard
                key={q.id}
                queue={q}
                onPause={handlePause}
                onResume={handleResume}
                onCancel={handleCancel}
                onLeadsAdded={handleLeadsAdded}
              />
            ))}
          </div>
        )}
      </section>

      {/* History */}
      {historyQueues.length > 0 && (
        <section data-ocid="drip.history.section">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
            Queue History
          </h2>
          <div className="bg-gray-900 border border-white/8 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-2.5">
                    Queue
                  </th>
                  <th className="text-left text-xs text-slate-500 font-medium px-4 py-2.5 hidden sm:table-cell">
                    Template
                  </th>
                  <th className="text-center text-xs text-slate-500 font-medium px-4 py-2.5">
                    Sent
                  </th>
                  <th className="text-center text-xs text-slate-500 font-medium px-4 py-2.5 hidden sm:table-cell">
                    Failed
                  </th>
                  <th className="text-center text-xs text-slate-500 font-medium px-4 py-2.5">
                    Status
                  </th>
                  <th className="text-right text-xs text-slate-500 font-medium px-4 py-2.5 hidden md:table-cell">
                    Finished
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyQueues.map((q, i) => (
                  <tr
                    key={q.id}
                    data-ocid={`drip.history.item.${i + 1}`}
                    className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-white truncate max-w-[140px]">
                        {q.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{q.niche}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-xs text-slate-300 truncate max-w-[120px]">
                        {q.campaignTemplateName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-white font-medium">
                      {q.sentCount}
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span
                        className={
                          q.failedCount > 0
                            ? "text-red-400 text-xs"
                            : "text-slate-600 text-xs"
                        }
                      >
                        {q.failedCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500 hidden md:table-cell">
                      {q.completedAt
                        ? timeAgo(q.completedAt)
                        : q.cancelledAt
                          ? timeAgo(q.cancelledAt)
                          : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* New drip modal */}
      <NewDripModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onLaunch={handleLaunch}
      />
    </div>
  );
}
