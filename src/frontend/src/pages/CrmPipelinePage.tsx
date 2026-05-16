import {
  AlertCircle,
  Bell,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Flame,
  GripVertical,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Textarea } from "../components/ui/textarea";
import { useApp } from "../context/AppContext";
import { LEADS, type Lead } from "../data/demoData";

// ─── Pipeline Stage Config ────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  {
    id: "new",
    label: "New",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    dot: "bg-blue-400",
    desc: "Fresh from Open Lead Lake or voice agent demo",
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
    desc: "First outreach sent — waiting for a response",
  },
  {
    id: "demo-sent",
    label: "Demo Sent",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    dot: "bg-purple-400",
    desc: "Demo link shared or in-app walkthrough completed",
  },
  {
    id: "trial",
    label: "Trial",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    dot: "bg-orange-400",
    desc: "7-day trial activated — close is imminent",
  },
  {
    id: "client",
    label: "Client",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-400",
    desc: "Converted — revenue in the bank",
  },
] as const;

type PipelineStageId = (typeof PIPELINE_STAGES)[number]["id"];

// ─── Extended Lead type for pipeline ─────────────────────────────────────────

interface PipelineLead extends Lead {
  pipelineStage: PipelineStageId;
  score: number;
  emailOpens: number;
  demoClicks: number;
  phone: string;
  niche?: string;
  lastActivity?: string;
}

// ─── Activity types ───────────────────────────────────────────────────────────

interface ActivityEntry {
  id: string;
  type: "call" | "sms" | "email" | "demo" | "stage" | "appointment" | "note";
  icon: typeof Phone;
  color: string;
  timestamp: number;
  summary: string;
}

// ─── Calendar integration config ─────────────────────────────────────────────

interface CalendarIntegration {
  id: "google" | "outlook" | "ical" | "calendly";
  label: string;
  color: string;
  dotColor: string;
  connected: boolean;
  connectedAs?: string;
  lastSync?: string;
  syncType: "two-way" | "read-only" | "import-only";
  setupHint: string;
}

// ─── SMS message type for inbox ───────────────────────────────────────────────

interface InboxMessage {
  id: string;
  direction: "inbound" | "outbound";
  text: string;
  sentAt: number;
  status: "sent" | "delivered" | "read";
}

// ─── Seed data helpers ────────────────────────────────────────────────────────

const NICHES = [
  "Plumbing",
  "HVAC",
  "Restoration",
  "Med Spa",
  "Roofing",
  "Carpet Cleaning",
  "Real Estate",
  "Mortgage",
  "Chiropractic",
  "Dental",
];

const NICHE_COLORS: Record<string, string> = {
  Plumbing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  HVAC: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Restoration: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Med Spa": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Roofing: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Carpet Cleaning": "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Real Estate": "bg-green-500/20 text-green-300 border-green-500/30",
  Mortgage: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Chiropractic: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Dental: "bg-sky-500/20 text-sky-300 border-sky-500/30",
};

function mapLeadToStage(status: string): PipelineStageId {
  if (status === "qualified") return "demo-sent";
  if (status === "closed") return "client";
  return status as PipelineStageId;
}

function seedPipelineLeads(rawLeads: Lead[]): PipelineLead[] {
  return rawLeads.map((l, i) => ({
    ...l,
    pipelineStage: mapLeadToStage(l.status),
    score: 45 + ((i * 17 + 23) % 55),
    emailOpens: (i * 3) % 6,
    demoClicks: (i * 2) % 4,
    niche: NICHES[i % NICHES.length],
    lastActivity: [
      "Opened email 3h ago",
      "Clicked demo link 1d ago",
      "No activity in 5 days",
      "Replied via SMS 2h ago",
      "Demo completed yesterday",
      "Booked intro call",
    ][i % 6],
  }));
}

function scoreColor(score: number) {
  if (score >= 70)
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  if (score >= 40) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-red-500/20 text-red-300 border-red-500/30";
}

function scoreLabel(score: number) {
  if (score >= 70) return "🔥 Hot";
  if (score >= 40) return "Warm";
  return "Cold";
}

const ACTIVITY_SEED: ActivityEntry[] = [
  {
    id: "a1",
    type: "call",
    icon: Phone,
    color: "text-purple-400",
    timestamp: Date.now() - 7200000,
    summary: "Inbound call — 4 min 12 sec. Requested HVAC tune-up quote.",
  },
  {
    id: "a2",
    type: "sms",
    icon: MessageSquare,
    color: "text-blue-400",
    timestamp: Date.now() - 10800000,
    summary:
      "SMS sent: 'Hey! Got your voicemail — happy to help. Does Thursday 2pm work?'",
  },
  {
    id: "a3",
    type: "email",
    icon: Mail,
    color: "text-indigo-400",
    timestamp: Date.now() - 86400000,
    summary: "Email opened ×3 — Subject: 'Quick audit of your business'",
  },
  {
    id: "a4",
    type: "demo",
    icon: Star,
    color: "text-amber-400",
    timestamp: Date.now() - 172800000,
    summary: "Demo link clicked — spent 4:32 on the voice agent step",
  },
  {
    id: "a5",
    type: "stage",
    icon: TrendingUp,
    color: "text-emerald-400",
    timestamp: Date.now() - 259200000,
    summary: "Moved from New → Contacted by Admin",
  },
  {
    id: "a6",
    type: "appointment",
    icon: CalendarDays,
    color: "text-sky-400",
    timestamp: Date.now() - 345600000,
    summary: "Appointment booked: Thursday, Jan 16 @ 2:00 PM",
  },
];

const UPCOMING_APPTS = [
  {
    label: "Discovery Call",
    date: "Thu Jan 16 @ 2:00 PM",
    lead: "Maria Gonzalez",
  },
  {
    label: "Demo Walkthrough",
    date: "Fri Jan 17 @ 11:00 AM",
    lead: "James Chen",
  },
  {
    label: "Trial Kickoff",
    date: "Mon Jan 20 @ 9:00 AM",
    lead: "Sarah Williams",
  },
];

const CALENDAR_INTEGRATIONS: CalendarIntegration[] = [
  {
    id: "google",
    label: "Google Calendar",
    color: "border-blue-500/30 bg-blue-500/10",
    dotColor: "bg-blue-400",
    connected: false,
    syncType: "two-way",
    setupHint: "Click 'Connect' to authorize your Google account",
  },
  {
    id: "outlook",
    label: "Outlook Calendar",
    color: "border-sky-500/30 bg-sky-500/10",
    dotColor: "bg-sky-400",
    connected: false,
    syncType: "two-way",
    setupHint: "Sign in with your Microsoft account",
  },
  {
    id: "ical",
    label: "Apple iCal",
    color: "border-gray-500/30 bg-gray-500/10",
    dotColor: "bg-gray-400",
    connected: false,
    syncType: "read-only",
    setupHint: "Paste your calendar URL from Apple Calendar settings",
  },
  {
    id: "calendly",
    label: "Calendly",
    color: "border-green-500/30 bg-green-500/10",
    dotColor: "bg-green-400",
    connected: false,
    syncType: "import-only",
    setupHint: "Paste your Calendly scheduling link to import bookings",
  },
];

const DEMO_CALENDAR_EVENTS = [
  {
    id: "ev1",
    title: "Discovery Call — Maria Gonzalez",
    date: "Jan 16",
    time: "2:00 PM",
    source: "google",
    color: "border-l-blue-400",
  },
  {
    id: "ev2",
    title: "Demo — James Chen (Plumbing)",
    date: "Jan 17",
    time: "11:00 AM",
    source: "outlook",
    color: "border-l-sky-400",
  },
  {
    id: "ev3",
    title: "Trial Kickoff — Sarah Williams",
    date: "Jan 20",
    time: "9:00 AM",
    source: "google",
    color: "border-l-blue-400",
  },
  {
    id: "ev4",
    title: "Estimate Review — Robert Davis",
    date: "Jan 21",
    time: "3:30 PM",
    source: "calendly",
    color: "border-l-green-400",
  },
  {
    id: "ev5",
    title: "Client Onboarding — Linda Martinez",
    date: "Jan 22",
    time: "10:00 AM",
    source: "google",
    color: "border-l-blue-400",
  },
];

// ─── AI Draft Replies ─────────────────────────────────────────────────────────

const AI_DRAFT_REPLIES = [
  "Hey! Thanks for reaching out. I'd love to get you taken care of — does Thursday afternoon work for a quick call?",
  "Great to hear from you! We're available this week and can usually get out within 24 hours. Want to lock in a time?",
  "Thanks for the message! A few spots opened up tomorrow — want me to send you a booking link so you can grab a time that works?",
];

// ─── Main Page Component ──────────────────────────────────────────────────────

type Tab = "pipeline" | "leads" | "calendar" | "sms";

export default function CrmPipelinePage() {
  const {
    currentTenantId,
    smsThreads,
    addSmsMessage,
    getSmsMessagesByThread,
    getSmsThreadsByTenant,
    markThreadRead,
  } = useApp();
  const rawLeads: Lead[] =
    LEADS[currentTenantId] ?? LEADS["tenant-oceanside"] ?? [];

  const [pipelineLeads, setPipelineLeads] = useState<PipelineLead[]>(() =>
    seedPipelineLeads(rawLeads),
  );
  const [activeTab, setActiveTab] = useState<Tab>("pipeline");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStageId | null>(
    null,
  );
  const [selectedLead, setSelectedLead] = useState<PipelineLead | null>(null);
  const [calendarIntegrations, setCalendarIntegrations] = useState(
    CALENDAR_INTEGRATIONS,
  );
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">(
    "week",
  );
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [smsText, setSmsText] = useState("");
  const [showAiDrafts, setShowAiDrafts] = useState(false);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [icalUrl, setIcalUrl] = useState("");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const dragRef = useRef<string | null>(null);

  // ─── Hot alerts ─────────────────────────────────────────────────────────────

  const hotAlerts = pipelineLeads
    .filter((l) => l.emailOpens >= 3 || l.demoClicks >= 2)
    .filter((l) => !dismissedAlerts.includes(l.id));

  // ─── Drag & Drop handlers ────────────────────────────────────────────────────

  const handleDragStart = useCallback((leadId: string) => {
    setDraggingId(leadId);
    dragRef.current = leadId;
  }, []);

  const handleDragOver = useCallback(
    (stageId: PipelineStageId, e: React.DragEvent) => {
      e.preventDefault();
      setDragOverStage(stageId);
    },
    [],
  );

  const handleDrop = useCallback((stageId: PipelineStageId) => {
    const id = dragRef.current;
    if (!id) return;
    setPipelineLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, pipelineStage: stageId, status: stageId as Lead["status"] }
          : l,
      ),
    );
    const stageName =
      PIPELINE_STAGES.find((s) => s.id === stageId)?.label ?? stageId;
    toast.success(`Lead moved to ${stageName}`);
    setDraggingId(null);
    setDragOverStage(null);
    dragRef.current = null;
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverStage(null);
    dragRef.current = null;
  }, []);

  // ─── Stage move ──────────────────────────────────────────────────────────────

  const moveLeadStage = (leadId: string, stage: PipelineStageId) => {
    setPipelineLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, pipelineStage: stage } : l)),
    );
    if (selectedLead?.id === leadId) {
      setSelectedLead((prev) =>
        prev ? { ...prev, pipelineStage: stage } : null,
      );
    }
    toast.success(
      `Moved to ${PIPELINE_STAGES.find((s) => s.id === stage)?.label}`,
    );
  };

  // ─── SMS handlers ────────────────────────────────────────────────────────────

  const threads =
    getSmsThreadsByTenant(currentTenantId).length > 0
      ? getSmsThreadsByTenant(currentTenantId)
      : smsThreads.filter((t) => t.tenantId === "demo");
  const activeThread =
    threads.find((t) => t.id === selectedThread) ?? threads[0] ?? null;
  const messages = activeThread
    ? (getSmsMessagesByThread(activeThread.id) as InboxMessage[])
    : [];

  const handleSendSms = () => {
    if (!smsText.trim() || !activeThread) return;
    addSmsMessage(activeThread.id, currentTenantId, "outbound", smsText.trim());
    setSmsText("");
    setShowAiDrafts(false);
    toast.success("Message sent");
  };

  const handleAiDraft = () => {
    setAiDraftLoading(true);
    setTimeout(() => {
      setAiDraftLoading(false);
      setShowAiDrafts(true);
    }, 1400);
  };

  const handleConnectCalendar = (
    id: CalendarIntegration["id"],
    value?: string,
  ) => {
    setCalendarIntegrations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              connected: true,
              connectedAs:
                value ??
                (id === "google"
                  ? "admin@yourbusiness.com"
                  : id === "outlook"
                    ? "owner@yourbiz.com"
                    : (value ?? "Connected")),
              lastSync: "Just now",
            }
          : c,
      ),
    );
    toast.success(
      `${CALENDAR_INTEGRATIONS.find((c) => c.id === id)?.label} connected`,
    );
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const leadsInStage = (stageId: PipelineStageId) =>
    pipelineLeads.filter((l) => l.pipelineStage === stageId);

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-1 pb-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
            <span>CRM</span>
            <ChevronDown size={12} className="-rotate-90 opacity-50" />
            <span className="text-foreground font-medium">Pipeline</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Sales Pipeline</h1>
          <p className="text-muted-foreground text-sm">
            Every lead is a phone call away from becoming your next recurring
            client.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground gap-1.5"
            data-ocid="crm.refresh_button"
          >
            <RefreshCw size={13} /> Sync
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground gap-1.5"
            data-ocid="crm.add_lead_button"
          >
            <Plus size={13} /> Add Lead
          </Button>
        </div>
      </div>

      {/* Hot Alerts */}
      {hotAlerts.length > 0 && (
        <div className="space-y-2 mb-4" data-ocid="crm.hot_alerts">
          {hotAlerts.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2.5 text-sm"
            >
              <Flame size={15} className="text-amber-400 flex-shrink-0" />
              <span className="text-amber-200 flex-1 min-w-0 truncate">
                <strong>{lead.name}</strong>{" "}
                {lead.emailOpens >= 3
                  ? `opened your email ${lead.emailOpens}× — strike while they're hot`
                  : `clicked your demo link ${lead.demoClicks}× — they're ready to talk`}
              </span>
              <div className="flex gap-1.5 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
                  onClick={() => toast.success("Opening call...")}
                  data-ocid="crm.hot_alert.call_button"
                >
                  <Phone size={11} className="mr-1" /> Call Now
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
                  onClick={() => toast.success("Opening SMS...")}
                  data-ocid="crm.hot_alert.sms_button"
                >
                  <MessageSquare size={11} className="mr-1" /> SMS
                </Button>
                <button
                  type="button"
                  onClick={() => setDismissedAlerts((p) => [...p, lead.id])}
                  onKeyDown={() => setDismissedAlerts((p) => [...p, lead.id])}
                  className="text-amber-500 hover:text-amber-300 transition-colors"
                  aria-label="Dismiss alert"
                  data-ocid="crm.hot_alert.dismiss_button"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div
        className="flex gap-1 border-b border-border mb-4"
        data-ocid="crm.tabs"
      >
        {(["pipeline", "leads", "calendar", "sms"] as Tab[]).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            data-ocid={`crm.tab.${tab}`}
          >
            {tab === "pipeline" && (
              <span className="flex items-center gap-1.5">
                <TrendingUp size={13} /> Pipeline
              </span>
            )}
            {tab === "leads" && (
              <span className="flex items-center gap-1.5">
                <Users size={13} /> All Leads
              </span>
            )}
            {tab === "calendar" && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> Calendar
              </span>
            )}
            {tab === "sms" && (
              <span className="flex items-center gap-1.5">
                <MessageSquare size={13} /> SMS Inbox{" "}
                {threads.filter((t) => t.unreadCount > 0).length > 0 && (
                  <span className="ml-0.5 bg-primary text-primary-foreground rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                    {threads.filter((t) => t.unreadCount > 0).length}
                  </span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── PIPELINE TAB ────────────────────────────────────────────────────── */}
      {activeTab === "pipeline" && (
        <div className="flex-1 overflow-x-auto min-h-0">
          <div
            className="flex gap-3 min-w-[900px] h-full pb-2"
            data-ocid="crm.kanban_board"
          >
            {PIPELINE_STAGES.map((stage) => {
              const stageLeads = leadsInStage(stage.id);
              const isOver = dragOverStage === stage.id;
              return (
                <div
                  key={stage.id}
                  className={`flex flex-col flex-1 min-w-[180px] rounded-xl border transition-colors ${stage.bg} ${isOver ? "ring-2 ring-primary/50" : ""}`}
                  onDragOver={(e) => handleDragOver(stage.id, e)}
                  onDrop={() => handleDrop(stage.id)}
                  data-ocid={`crm.column.${stage.id}`}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${stage.color}`}
                      >
                        {stage.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <ScrollArea className="flex-1 p-2">
                    <div className="space-y-2">
                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-xs opacity-60">
                          <Users
                            size={20}
                            className="mx-auto mb-1 opacity-40"
                          />
                          No leads here yet
                        </div>
                      )}
                      {stageLeads.map((lead, idx) => (
                        <KanbanCard
                          key={lead.id}
                          lead={lead}
                          idx={idx}
                          stageId={stage.id}
                          isDragging={draggingId === lead.id}
                          isSelected={selectedCards.includes(lead.id)}
                          onDragStart={() => handleDragStart(lead.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedLead(lead)}
                          onToggleSelect={() =>
                            setSelectedCards((prev) =>
                              prev.includes(lead.id)
                                ? prev.filter((id) => id !== lead.id)
                                : [...prev, lead.id],
                            )
                          }
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ALL LEADS TAB ────────────────────────────────────────────────────── */}
      {activeTab === "leads" && (
        <div
          className="flex-1 overflow-auto min-h-0 bg-card border border-border rounded-xl"
          data-ocid="crm.leads_list"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "Business",
                  "Niche",
                  "Score",
                  "Stage",
                  "Last Activity",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pipelineLeads.map((lead, idx) => (
                <tr
                  key={lead.id}
                  className="hover:bg-muted/20 transition-colors"
                  data-ocid={`crm.lead_row.${idx + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {lead.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {lead.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.phone ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-[10px] border ${NICHE_COLORS[lead.niche ?? "Plumbing"] ?? ""}`}
                    >
                      {lead.niche ?? "—"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={`text-[10px] border ${scoreColor(lead.score)}`}
                    >
                      {scoreLabel(lead.score)} {lead.score}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.pipelineStage}
                      onChange={(e) =>
                        moveLeadStage(
                          lead.id,
                          e.target.value as PipelineStageId,
                        )
                      }
                      className="bg-muted border border-border text-xs text-foreground rounded px-2 py-1"
                      data-ocid={`crm.stage_select.${idx + 1}`}
                    >
                      {PIPELINE_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {lead.lastActivity ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Call"
                        onClick={() => toast.success("Opening call...")}
                        data-ocid={`crm.call_button.${idx + 1}`}
                      >
                        <Phone size={13} />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="SMS"
                        onClick={() => setActiveTab("sms")}
                        data-ocid={`crm.sms_button.${idx + 1}`}
                      >
                        <MessageSquare size={13} />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Email"
                        onClick={() => toast.success("Opening email...")}
                        data-ocid={`crm.email_button.${idx + 1}`}
                      >
                        <Mail size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CALENDAR TAB ────────────────────────────────────────────────────── */}
      {activeTab === "calendar" && (
        <div
          className="flex-1 min-h-0 flex flex-col gap-4"
          data-ocid="crm.calendar_tab"
        >
          {/* Calendar integration cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {calendarIntegrations.map((cal) => (
              <div
                key={cal.id}
                className={`border rounded-xl p-3 ${cal.color}`}
                data-ocid={`crm.calendar.${cal.id}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cal.dotColor}`} />
                  <span className="text-xs font-semibold text-foreground">
                    {cal.label}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-1 capitalize">
                  {cal.syncType.replace("-", " ")}
                </div>
                {cal.connected ? (
                  <div>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Connected as {cal.connectedAs}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Synced {cal.lastSync}
                    </p>
                  </div>
                ) : (
                  <div>
                    {cal.id === "ical" ? (
                      <div className="space-y-1">
                        <Input
                          placeholder="Paste calendar URL…"
                          value={icalUrl}
                          onChange={(e) => setIcalUrl(e.target.value)}
                          className="h-6 text-[10px] bg-background border-border"
                          data-ocid="crm.ical_url_input"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-5 px-2 text-[10px] w-full"
                          onClick={() => {
                            if (icalUrl) {
                              handleConnectCalendar("ical", icalUrl);
                              setIcalUrl("");
                            }
                          }}
                          data-ocid="crm.ical_connect_button"
                        >
                          Connect
                        </Button>
                      </div>
                    ) : cal.id === "calendly" ? (
                      <div className="space-y-1">
                        <Input
                          placeholder="Paste Calendly link…"
                          value={calendlyUrl}
                          onChange={(e) => setCalendlyUrl(e.target.value)}
                          className="h-6 text-[10px] bg-background border-border"
                          data-ocid="crm.calendly_url_input"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-5 px-2 text-[10px] w-full"
                          onClick={() => {
                            if (calendlyUrl) {
                              handleConnectCalendar("calendly", calendlyUrl);
                              setCalendlyUrl("");
                            }
                          }}
                          data-ocid="crm.calendly_connect_button"
                        >
                          Import
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-[10px] w-full mt-1"
                        onClick={() => handleConnectCalendar(cal.id)}
                        data-ocid={`crm.calendar_connect.${cal.id}`}
                      >
                        <Link2 size={10} className="mr-1" /> Connect
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Calendar view */}
          <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden flex">
            {/* Sidebar: upcoming */}
            <div className="w-64 border-r border-border p-3 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={13} className="text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Upcoming
                </span>
              </div>
              <div className="space-y-2">
                {DEMO_CALENDAR_EVENTS.map((ev) => (
                  <div
                    key={ev.id}
                    className={`pl-2 border-l-2 ${ev.color} py-1`}
                    data-ocid={`crm.upcoming_event.${ev.id}`}
                  >
                    <p className="text-xs font-medium text-foreground leading-tight">
                      {ev.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {ev.date} · {ev.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-1 mb-2">
                  <RefreshCw size={11} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Syncs every 15 min
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7 text-xs"
                  onClick={() => toast.success("Calendars synced")}
                  data-ocid="crm.sync_calendars_button"
                >
                  Sync Now
                </Button>
              </div>
            </div>

            {/* Main calendar */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">
                  January 2026
                </h3>
                <div
                  className="flex gap-1"
                  data-ocid="crm.calendar_view_toggle"
                >
                  {(["month", "week", "day"] as const).map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setCalendarView(v)}
                      className={`px-2.5 py-1 text-xs rounded capitalize transition-colors ${calendarView === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                      data-ocid={`crm.calendar_view.${v}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Week view grid */}
              <div className="grid grid-cols-7 gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] text-muted-foreground py-1"
                  >
                    {d}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6;
                  const dayNum = day > 0 ? day : null;
                  const hasEvent = DEMO_CALENDAR_EVENTS.some((ev) => {
                    const d = Number.parseInt(ev.date.split(" ")[1], 10);
                    return d === dayNum;
                  });
                  const calKey = `cal-cell-${i}`;
                  return (
                    <div
                      key={calKey}
                      className={`aspect-square rounded-lg text-xs flex flex-col items-center justify-center cursor-pointer transition-colors ${dayNum ? "hover:bg-muted/30" : ""} ${dayNum === 16 || dayNum === 17 ? "bg-primary/20 text-primary font-semibold" : "text-foreground"}`}
                    >
                      {dayNum && <span>{dayNum}</span>}
                      {hasEvent && (
                        <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SMS INBOX TAB ────────────────────────────────────────────────────── */}
      {activeTab === "sms" && (
        <div
          className="flex-1 min-h-0 flex border border-border rounded-xl overflow-hidden bg-card"
          data-ocid="crm.sms_inbox"
        >
          {/* Thread list */}
          <div className="w-72 border-r border-border flex flex-col flex-shrink-0">
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-xs font-semibold text-foreground">
                Conversations
              </p>
            </div>
            <ScrollArea className="flex-1">
              {threads.map((thread) => (
                <button
                  type="button"
                  key={thread.id}
                  onClick={() => {
                    setSelectedThread(thread.id);
                    markThreadRead(thread.id);
                  }}
                  className={`w-full text-left px-3 py-3 border-b border-border/50 transition-colors hover:bg-muted/20 ${(selectedThread ?? threads[0]?.id) === thread.id ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}
                  data-ocid={`crm.sms_thread.${thread.id}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-medium text-foreground truncate">
                      {thread.prospectName}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {thread.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                          {thread.unreadCount}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(thread.lastMessageAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {thread.prospectPhone}
                  </p>
                </button>
              ))}
              {threads.length === 0 && (
                <div
                  className="py-10 text-center text-muted-foreground text-xs"
                  data-ocid="crm.sms_empty_state"
                >
                  <MessageSquare
                    size={24}
                    className="mx-auto mb-2 opacity-30"
                  />
                  No SMS conversations yet
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Message thread */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeThread ? (
              <>
                {/* Thread header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border flex-shrink-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {activeThread.prospectName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activeThread.prospectPhone}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs gap-1.5 border-border"
                      onClick={() => toast.success("Opening call...")}
                      data-ocid="crm.sms_call_button"
                    >
                      <Phone size={12} /> Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs gap-1.5 border-border"
                      onClick={() => toast.success("Opening profile...")}
                      data-ocid="crm.sms_profile_button"
                    >
                      <ExternalLink size={12} /> Profile
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-3">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                        data-ocid={`crm.sms_message.${msg.id}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${msg.direction === "outbound" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}
                        >
                          <p>{msg.text}</p>
                          <div
                            className={`flex items-center gap-1 mt-1 text-[10px] ${msg.direction === "outbound" ? "text-primary-foreground/60 justify-end" : "text-muted-foreground"}`}
                          >
                            <span>{formatTime(msg.sentAt)}</span>
                            {msg.direction === "outbound" &&
                              (msg.status === "read" ? (
                                <CheckCircle2 size={9} />
                              ) : (
                                <Clock size={9} />
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* AI Draft options */}
                {showAiDrafts && (
                  <div
                    className="px-4 py-2 border-t border-border bg-muted/20"
                    data-ocid="crm.ai_drafts"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={12} className="text-primary" />
                      <span className="text-xs font-medium text-foreground">
                        AI Draft Replies — pick one to edit & send
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAiDrafts(false)}
                        onKeyDown={() => setShowAiDrafts(false)}
                        className="ml-auto text-muted-foreground hover:text-foreground"
                        data-ocid="crm.ai_drafts_close_button"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {AI_DRAFT_REPLIES.map((reply, i) => (
                        <button
                          // biome-ignore lint/suspicious/noArrayIndexKey: static list
                          key={i}
                          type="button"
                          onClick={() => {
                            setSmsText(reply);
                            setShowAiDrafts(false);
                          }}
                          className="w-full text-left text-xs bg-card border border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-colors text-muted-foreground hover:text-foreground"
                          data-ocid={`crm.ai_draft.${i + 1}`}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="px-4 py-3 border-t border-border flex-shrink-0">
                  <div className="flex gap-2 items-end">
                    <Textarea
                      placeholder="Type a message…"
                      value={smsText}
                      onChange={(e) => setSmsText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendSms();
                        }
                      }}
                      className="flex-1 bg-muted border-border text-foreground text-sm resize-none min-h-[40px] max-h-[100px]"
                      rows={1}
                      data-ocid="crm.sms_input"
                    />
                    <div className="flex flex-col gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                        onClick={handleAiDraft}
                        disabled={aiDraftLoading}
                        data-ocid="crm.ai_draft_button"
                      >
                        {aiDraftLoading ? (
                          <RefreshCw size={11} className="animate-spin" />
                        ) : (
                          <Sparkles size={11} />
                        )}
                        AI Draft
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs bg-primary text-primary-foreground gap-1.5"
                        onClick={handleSendSms}
                        disabled={!smsText.trim()}
                        data-ocid="crm.sms_send_button"
                      >
                        <Send size={11} /> Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="flex-1 flex items-center justify-center text-muted-foreground"
                data-ocid="crm.sms_no_thread"
              >
                <div className="text-center">
                  <MessageSquare
                    size={32}
                    className="mx-auto mb-2 opacity-30"
                  />
                  <p className="text-sm">Select a conversation to start</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LEAD DETAIL DRAWER ───────────────────────────────────────────────── */}
      {selectedLead && (
        <LeadDetailDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onMoveStage={moveLeadStage}
          activities={ACTIVITY_SEED}
          upcomingAppointments={UPCOMING_APPTS}
          formatTime={formatTime}
        />
      )}
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────

interface KanbanCardProps {
  lead: PipelineLead;
  idx: number;
  stageId: PipelineStageId;
  isDragging: boolean;
  isSelected: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onClick: () => void;
  onToggleSelect: () => void;
}

function KanbanCard({
  lead,
  idx,
  isDragging,
  isSelected,
  onDragStart,
  onDragEnd,
  onClick,
  onToggleSelect,
}: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`group bg-card border border-border rounded-lg p-3 cursor-pointer hover:border-primary/40 transition-all select-none ${isDragging ? "opacity-40 scale-95" : "hover:shadow-lg"} ${isSelected ? "ring-1 ring-primary border-primary/50" : ""}`}
      data-ocid={`crm.card.${idx + 1}`}
    >
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 accent-primary cursor-pointer"
          data-ocid={`crm.card_checkbox.${idx + 1}`}
        />
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary flex-shrink-0">
          {lead.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate leading-tight">
            {lead.name}
          </p>
          {lead.niche && (
            <Badge
              className={`text-[9px] border mt-0.5 ${NICHE_COLORS[lead.niche] ?? ""}`}
            >
              {lead.niche}
            </Badge>
          )}
        </div>
        <GripVertical
          size={12}
          className="text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 cursor-grab mt-0.5"
        />
      </div>

      <div className="flex items-center justify-between mt-2.5 gap-1">
        <Badge className={`text-[9px] border ${scoreColor(lead.score)}`}>
          {scoreLabel(lead.score)} {lead.score}
        </Badge>
        {(lead.emailOpens >= 3 || lead.demoClicks >= 2) && (
          <Flame size={11} className="text-amber-400 flex-shrink-0" />
        )}
      </div>

      {lead.lastActivity && (
        <p className="text-[10px] text-muted-foreground mt-1.5 truncate">
          {lead.lastActivity}
        </p>
      )}

      {/* Quick action buttons - visible on hover */}
      <div className="flex gap-1 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toast.success("Opening call...");
          }}
          className="flex-1 flex items-center justify-center gap-1 py-1 text-[10px] rounded bg-muted/50 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors"
          aria-label="Call"
          data-ocid={`crm.card_call.${idx + 1}`}
        >
          <Phone size={10} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toast.success("Opening SMS...");
          }}
          className="flex-1 flex items-center justify-center gap-1 py-1 text-[10px] rounded bg-muted/50 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors"
          aria-label="SMS"
          data-ocid={`crm.card_sms.${idx + 1}`}
        >
          <MessageSquare size={10} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toast.success("Opening email...");
          }}
          className="flex-1 flex items-center justify-center gap-1 py-1 text-[10px] rounded bg-muted/50 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors"
          aria-label="Email"
          data-ocid={`crm.card_email.${idx + 1}`}
        >
          <Mail size={10} />
        </button>
      </div>
    </div>
  );
}

// ─── Lead Detail Drawer ───────────────────────────────────────────────────────

interface DrawerProps {
  lead: PipelineLead;
  onClose: () => void;
  onMoveStage: (leadId: string, stage: PipelineStageId) => void;
  activities: ActivityEntry[];
  upcomingAppointments: { label: string; date: string; lead: string }[];
  formatTime: (ts: number) => string;
}

function LeadDetailDrawer({
  lead,
  onClose,
  onMoveStage,
  activities,
  upcomingAppointments,
  formatTime,
}: DrawerProps) {
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState(false);

  const handleSaveNote = () => {
    if (!note.trim()) return;
    setSavedNote(true);
    toast.success("Note saved to activity timeline");
    setNote("");
  };

  const activityIcons: Record<ActivityEntry["type"], typeof Phone> = {
    call: Phone,
    sms: MessageSquare,
    email: Mail,
    demo: Star,
    stage: TrendingUp,
    appointment: CalendarDays,
    note: AlertCircle,
  };

  return (
    <div className="fixed inset-0 z-50 flex" data-ocid="crm.lead_drawer">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        className="flex-1 bg-black/60"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close drawer"
      />
      {/* Drawer */}
      <div className="w-full max-w-md bg-card border-l border-border flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
              {lead.name[0]}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {lead.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {lead.niche && (
                  <Badge
                    className={`text-[9px] border ${NICHE_COLORS[lead.niche] ?? ""}`}
                  >
                    {lead.niche}
                  </Badge>
                )}
                <Badge
                  className={`text-[9px] border ${scoreColor(lead.score)}`}
                >
                  {scoreLabel(lead.score)} {lead.score}
                </Badge>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            onKeyDown={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Close drawer"
            data-ocid="crm.drawer_close_button"
          >
            <XCircle size={18} />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-5">
            {/* Contact info */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Phone, label: lead.phone ?? "—" },
                { icon: Mail, label: lead.email ?? "—" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2"
                >
                  <Icon
                    size={13}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="text-xs text-foreground truncate">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Stage selector */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Move Stage
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {PIPELINE_STAGES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => onMoveStage(lead.id, s.id)}
                    className={`text-[9px] py-1.5 rounded-lg font-medium transition-colors border ${lead.pipelineStage === s.id ? `${s.bg} ${s.color} border-current` : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                    data-ocid={`crm.drawer_stage.${s.id}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity timeline */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Activity Timeline
              </p>
              <div className="space-y-3">
                {activities.map((entry) => {
                  const Icon = activityIcons[entry.type] ?? AlertCircle;
                  return (
                    <div
                      key={entry.id}
                      className="flex gap-3 items-start"
                      data-ocid={`crm.activity.${entry.id}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 ${entry.color}`}
                      >
                        <Icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-snug">
                          {entry.summary}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {savedNote && (
                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 text-primary">
                      <AlertCircle size={12} />
                    </div>
                    <div>
                      <p className="text-xs text-foreground">
                        Note added by Admin
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Just now
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add note */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Add Note
              </p>
              <Textarea
                placeholder="Add a note to the timeline…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-muted border-border text-foreground text-xs resize-none"
                rows={3}
                data-ocid="crm.drawer_note_input"
              />
              <Button
                size="sm"
                className="mt-2 bg-primary text-primary-foreground text-xs"
                onClick={handleSaveNote}
                disabled={!note.trim()}
                data-ocid="crm.drawer_save_note_button"
              >
                Save Note
              </Button>
            </div>

            {/* Upcoming appointments */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Upcoming Appointments
              </p>
              <div className="space-y-2">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={`${appt.lead}-${appt.date}`}
                    className="flex items-center gap-3 bg-muted/20 rounded-lg px-3 py-2"
                    data-ocid={`crm.drawer_appointment.${appt.lead}`}
                  >
                    <CalendarDays
                      size={13}
                      className="text-primary flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {appt.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {appt.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <div className="flex gap-2 px-5 py-3 border-t border-border flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-border gap-1.5 text-xs"
            onClick={() => toast.success("Opening call...")}
            data-ocid="crm.drawer_call_button"
          >
            <Phone size={12} /> Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-border gap-1.5 text-xs"
            onClick={() => toast.success("Opening SMS...")}
            data-ocid="crm.drawer_sms_button"
          >
            <MessageSquare size={12} /> SMS
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-primary text-primary-foreground gap-1.5 text-xs"
            onClick={() => toast.success("Sending demo link...")}
            data-ocid="crm.drawer_send_demo_button"
          >
            <Send size={12} /> Send Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
