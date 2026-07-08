/**
 * RooferCampaignPage — admin-only roofer cold outreach campaign command center.
 *
 * Handles BOTH the campaign list view AND the campaign detail view (switched
 * via internal state). The route /roofer-campaign is registered in App.tsx
 * (adminOnly). Built on the existing dark navy/purple command-center theme
 * with gold accents for campaign-specific elements.
 *
 * List view: campaign cards with name, status badge, lead count, summary stats,
 * and a "New Campaign" create flow.
 *
 * Detail view: campaign header with Start/Pause sending controls + four tabs
 * (Sequence, Leads, Stats, Replies).
 */

import AppLayout from "@/components/AppLayout";
import { useApp } from "@/context/AppContext";
import { useLeads } from "@/hooks/useLeads";
import {
  useCreateRooferCampaign,
  useEnrollLeads,
  usePauseSending,
  useRooferCampaign,
  useRooferCampaignLeads,
  useRooferCampaignReplies,
  useRooferCampaignStats,
  useRooferCampaigns,
  useStartSending,
  useUpdateSequence,
} from "@/hooks/useRooferCampaign";
import type {
  RooferCampaignLead,
  RooferCampaignLeadStatus,
  RooferCampaignStats,
  RooferCampaignStep,
  RooferCampaignSummary,
  RooferColdCampaign,
} from "@/integrations/roofer-campaign/types";
import {
  RooferCampaignStatus as CampaignStatus,
  RooferCampaignLeadStatus as LeadStatus,
} from "@/integrations/roofer-campaign/types";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Download,
  Inbox,
  Mail,
  Mailbox,
  Megaphone,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Save,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const PERSONALIZATION_TOKENS = [
  "business_name",
  "city",
  "ranking_score",
  "dead_zones_count",
  "top_competitor",
  "pain_point",
  "owner_name",
] as const;

const LEAD_LIST_OPTIONS = [
  { id: "roofing-storm", label: "Roofing — Storm Damage (recent)" },
  { id: "roofing-missed-calls", label: "Roofing — Missed Calls (30d)" },
  { id: "roofing-maps-low", label: "Roofing — Low Google Maps Ranking" },
  { id: "roofing-few-reviews", label: "Roofing — Few Reviews (<10)" },
];

const STATUS_LABELS: Record<CampaignStatus, string> = {
  [CampaignStatus.draft]: "Draft",
  [CampaignStatus.sending]: "Active",
  [CampaignStatus.paused]: "Paused",
  [CampaignStatus.completed]: "Completed",
  [CampaignStatus.archived]: "Archived",
};

const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LeadStatus.new_]: "Pending",
  [LeadStatus.sent]: "Sent",
  [LeadStatus.opened]: "Opened",
  [LeadStatus.replied]: "Replied",
  [LeadStatus.bounced]: "Bounced",
  [LeadStatus.booked]: "Booked",
  [LeadStatus.unsubscribed]: "Unsubscribed",
};

type StatusTone =
  | "amber"
  | "blue"
  | "cyan"
  | "purple"
  | "rose"
  | "emerald"
  | "gray";

const LEAD_STATUS_TONE: Record<LeadStatus, StatusTone> = {
  [LeadStatus.new_]: "amber",
  [LeadStatus.sent]: "blue",
  [LeadStatus.opened]: "cyan",
  [LeadStatus.replied]: "purple",
  [LeadStatus.bounced]: "rose",
  [LeadStatus.booked]: "emerald",
  [LeadStatus.unsubscribed]: "gray",
};

const CAMPAIGN_STATUS_TONE: Record<CampaignStatus, StatusTone> = {
  [CampaignStatus.draft]: "gray",
  [CampaignStatus.sending]: "emerald",
  [CampaignStatus.paused]: "amber",
  [CampaignStatus.completed]: "blue",
  [CampaignStatus.archived]: "gray",
};

// Static text-color classes per tone (Tailwind needs complete class strings to
// avoid purging dynamic `text-${tone}-400` templates).
const TONE_TEXT: Record<StatusTone, string> = {
  amber: "text-amber-400",
  blue: "text-blue-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  rose: "text-rose-400",
  emerald: "text-emerald-400",
  gray: "text-slate-400",
};

function n(value: bigint | undefined | null): number {
  if (value === undefined || value === null) return 0;
  return Number(value);
}

function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

function timeAgo(ms: number): string {
  if (!ms || ms <= 0) return "—";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function fmtDateTime(ms: number): string {
  if (!ms || ms <= 0) return "—";
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function renderTokens(text: string, sample: SampleLead): string {
  return text
    .replace(/\[name\]/g, sample.ownerName)
    .replace(/\[business_name\]/g, sample.businessName)
    .replace(/\[city\]/g, sample.city)
    .replace(/\[ranking_score\]/g, String(sample.rankingScore))
    .replace(/\[dead_zones_count\]/g, String(sample.deadZonesCount))
    .replace(/\[top_competitor\]/g, sample.topCompetitor)
    .replace(/\[pain_point\]/g, sample.painPoint)
    .replace(/\[owner_name\]/g, sample.ownerName)
    .replace(/\{business_name\}/g, sample.businessName)
    .replace(/\{city\}/g, sample.city)
    .replace(/\{ranking_score\}/g, String(sample.rankingScore))
    .replace(/\{dead_zones_count\}/g, String(sample.deadZonesCount))
    .replace(/\{top_competitor\}/g, sample.topCompetitor)
    .replace(/\{pain_point\}/g, sample.painPoint)
    .replace(/\{owner_name\}/g, sample.ownerName);
}

interface SampleLead {
  businessName: string;
  ownerName: string;
  city: string;
  rankingScore: number;
  deadZonesCount: number;
  topCompetitor: string;
  painPoint: string;
}

const DEMO_SAMPLE_LEAD: SampleLead = {
  businessName: "Apex Roofing Co",
  ownerName: "Marcus",
  city: "Austin",
  rankingScore: 42,
  deadZonesCount: 3,
  topCompetitor: "Lone Star Roofers",
  painPoint: "missed after-hours calls",
};

// ---------------------------------------------------------------------------
// Tone badge component
// ---------------------------------------------------------------------------

function ToneBadge({
  tone,
  children,
}: {
  tone: StatusTone;
  children: React.ReactNode;
}) {
  const cls: Record<StatusTone, string> = {
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    gray: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cls[tone]}`}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Loading + error states
// ---------------------------------------------------------------------------

function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      data-ocid="roofer.error_state"
      className="flex flex-col items-center justify-center gap-2 py-16 text-rose-300"
    >
      <X className="w-6 h-6" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Inbox;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      data-ocid="roofer.empty_state"
      className="flex flex-col items-center justify-center gap-3 py-16 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-amber-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

// ===========================================================================
// MAIN PAGE
// ===========================================================================

export default function RooferCampaignPage() {
  const { currentTenantId } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (selectedId) {
    return (
      <AppLayout>
        <CampaignDetail
          campaignId={selectedId}
          tenantId={currentTenantId}
          onBack={() => setSelectedId(null)}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <CampaignList
        tenantId={currentTenantId}
        onOpen={(id) => setSelectedId(id)}
      />
    </AppLayout>
  );
}

// ===========================================================================
// LIST VIEW
// ===========================================================================

function CampaignList({
  tenantId,
  onOpen,
}: {
  tenantId: string;
  onOpen: (id: string) => void;
}) {
  const { data, isLoading, isError, refetch, isFetching } =
    useRooferCampaigns(tenantId);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/80">
              Roofer Outreach
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Cold Outreach Campaigns
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Book demos of the Booked Ranked Fundable platform with roofing
            contractors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="roofer.refresh.button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            type="button"
            data-ocid="roofer.new_campaign.button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <SummaryTile
          label="Total Campaigns"
          value={data?.length ?? 0}
          icon={Megaphone}
        />
        <SummaryTile
          label="Active"
          value={
            data?.filter((c) => c.status === CampaignStatus.sending).length ?? 0
          }
          icon={Play}
          tone="emerald"
        />
        <SummaryTile
          label="Total Sent"
          value={data?.reduce((acc, c) => acc + n(c.sent), 0) ?? 0}
          icon={Send}
          tone="blue"
        />
        <SummaryTile
          label="Demos Booked"
          value={data?.reduce((acc, c) => acc + n(c.booked), 0) ?? 0}
          icon={Calendar}
          tone="amber"
        />
      </div>

      {/* Campaign grid */}
      {isLoading ? (
        <LoadingState label="Loading campaigns…" />
      ) : isError ? (
        <ErrorState message="Failed to load campaigns. Try refreshing." />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          subtitle="Create your first roofer cold outreach campaign to start booking demos."
          action={
            <button
              type="button"
              data-ocid="roofer.empty_create.button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Campaign
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((c, i) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              index={i}
              onOpen={() => onOpen(c.id)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateCampaignModal
          tenantId={tenantId}
          onClose={() => setShowCreate(false)}
          onCreated={(id) => {
            setShowCreate(false);
            onOpen(id);
          }}
        />
      )}
    </div>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
  tone = "purple",
}: {
  label: string;
  value: number;
  icon: typeof Megaphone;
  tone?: StatusTone;
}) {
  const toneCls: Record<StatusTone, string> = {
    amber: "text-amber-400",
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    rose: "text-rose-400",
    emerald: "text-emerald-400",
    gray: "text-slate-400",
  };
  return (
    <div className="rounded-xl bg-card/60 border border-white/8 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className={`w-4 h-4 ${toneCls[tone]}`} />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function CampaignCard({
  campaign,
  index,
  onOpen,
}: {
  campaign: RooferCampaignSummary;
  index: number;
  onOpen: () => void;
}) {
  const leadCount = n(campaign.leadCount);
  const sent = n(campaign.sent);
  const replied = n(campaign.replied);
  const booked = n(campaign.booked);
  const replyRate = pct(replied, sent);

  return (
    <button
      type="button"
      data-ocid={`roofer.campaign.item.${index + 1}`}
      onClick={onOpen}
      className="text-left rounded-xl bg-card/60 border border-white/8 p-5 hover:bg-card/80 hover:border-amber-500/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground truncate group-hover:text-amber-300 transition-colors">
            {campaign.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Created {timeAgo(n(campaign.createdAt))}
          </p>
        </div>
        <ToneBadge tone={CAMPAIGN_STATUS_TONE[campaign.status]}>
          {STATUS_LABELS[campaign.status]}
        </ToneBadge>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        <Stat label="Leads" value={leadCount} />
        <Stat label="Sent" value={sent} tone="blue" />
        <Stat label="Replied" value={replied} tone="purple" />
        <Stat label="Booked" value={booked} tone="emerald" />
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
        <span>Reply rate</span>
        <span className="font-semibold text-amber-300">{replyRate}%</span>
      </div>
    </button>
  );
}

function Stat({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: number;
  tone?: StatusTone;
}) {
  const toneCls: Record<StatusTone, string> = {
    amber: "text-amber-300",
    blue: "text-blue-300",
    cyan: "text-cyan-300",
    purple: "text-purple-300",
    rose: "text-rose-300",
    emerald: "text-emerald-300",
    gray: "text-foreground",
  };
  return (
    <div className="text-center">
      <p className={`text-lg font-bold ${toneCls[tone]}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
        {label}
      </p>
    </div>
  );
}

// ===========================================================================
// CREATE CAMPAIGN MODAL
// ===========================================================================

function CreateCampaignModal({
  tenantId,
  onClose,
  onCreated,
}: {
  tenantId: string;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const create = useCreateRooferCampaign(tenantId);
  const [name, setName] = useState("");
  const [leadListId, setLeadListId] = useState(LEAD_LIST_OPTIONS[0].id);
  const [senderName, setSenderName] = useState("BRF Outreach");
  const [senderEmail, setSenderEmail] = useState(
    "outreach@bookedrankedfundable.com",
  );
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0 && senderEmail.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) {
      setError("Campaign name and sender email are required.");
      return;
    }
    setError(null);
    create.mutate(
      { name: name.trim() },
      {
        onSuccess: (campaign) => {
          toast.success(`Campaign "${name.trim()}" created`);
          onCreated(campaign.id);
        },
        onError: () => {
          setError("Failed to create campaign. Please try again.");
        },
      },
    );
  }

  return (
    <div
      data-ocid="roofer.create.dialog"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl bg-card border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-foreground">
              New Roofer Campaign
            </h2>
          </div>
          <button
            type="button"
            data-ocid="roofer.create.close_button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Campaign name">
            <input
              data-ocid="roofer.create.name.input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Austin Storm Season Outreach"
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
          </Field>

          <Field label="Lead list" hint="Roofing-focused Lead Engine segments">
            <select
              data-ocid="roofer.create.lead_list.select"
              value={leadListId}
              onChange={(e) => setLeadListId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            >
              {LEAD_LIST_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Sender name">
              <input
                data-ocid="roofer.create.sender_name.input"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              />
            </Field>
            <Field label="Sender email">
              <input
                data-ocid="roofer.create.sender_email.input"
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
              />
            </Field>
          </div>

          <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-200/80">
            The default 7-step roofer sequence will be pre-loaded. You can edit
            every step, add personalization tokens, and reorder before sending.
          </div>

          {error && (
            <p
              data-ocid="roofer.create.field_error"
              className="text-xs text-rose-300"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-5 border-t border-white/8">
          <button
            type="button"
            data-ocid="roofer.create.cancel_button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            data-ocid="roofer.create.submit_button"
            onClick={handleSubmit}
            disabled={!canSubmit || create.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {create.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {hint && (
          <span className="text-[10px] text-muted-foreground/70">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ===========================================================================
// DETAIL VIEW
// ===========================================================================

type Tab = "sequence" | "leads" | "stats" | "replies";

function CampaignDetail({
  campaignId,
  tenantId,
  onBack,
}: {
  campaignId: string;
  tenantId: string;
  onBack: () => void;
}) {
  const { data: campaign, isLoading, isError } = useRooferCampaign(campaignId);
  const [tab, setTab] = useState<Tab>("sequence");

  const startSending = useStartSending(campaignId, tenantId);
  const pauseSending = usePauseSending(campaignId, tenantId);

  const status = campaign?.status ?? CampaignStatus.draft;
  const canStart =
    status === CampaignStatus.draft || status === CampaignStatus.paused;
  const canPause = status === CampaignStatus.sending;

  function handleStart() {
    startSending.mutate(undefined, {
      onSuccess: () => toast.success("Sending started"),
      onError: () => toast.error("Failed to start sending"),
    });
  }

  function handlePause() {
    pauseSending.mutate(undefined, {
      onSuccess: () => toast.success("Sending paused"),
      onError: () => toast.error("Failed to pause sending"),
    });
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <BackButton onClick={onBack} />
        <LoadingState label="Loading campaign…" />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <BackButton onClick={onBack} />
        <ErrorState message="Failed to load campaign." />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Mail }[] = [
    { id: "sequence", label: "Sequence", icon: Mail },
    { id: "leads", label: "Leads", icon: Users },
    { id: "stats", label: "Stats", icon: Megaphone },
    { id: "replies", label: "Replies", icon: Inbox },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <BackButton onClick={onBack} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <ToneBadge tone={CAMPAIGN_STATUS_TONE[status]}>
              {STATUS_LABELS[status]}
            </ToneBadge>
            <span className="text-xs text-muted-foreground">
              {n(campaign.leadCount)} leads
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground truncate">
            {campaign.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Created {fmtDateTime(n(campaign.createdAt))} · Updated{" "}
            {timeAgo(n(campaign.updatedAt))}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {canStart && (
            <button
              type="button"
              data-ocid="roofer.start_sending.button"
              onClick={handleStart}
              disabled={startSending.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {startSending.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Start sending
            </button>
          )}
          {canPause && (
            <button
              type="button"
              data-ocid="roofer.pause_sending.button"
              onClick={handlePause}
              disabled={pauseSending.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all disabled:opacity-50"
            >
              {pauseSending.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
              Pause sending
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-white/8 overflow-x-auto">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              data-ocid={`roofer.tab.${t.id}`}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                active
                  ? "border-amber-500 text-amber-300"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "sequence" && <SequenceTab campaign={campaign} />}
      {tab === "leads" && (
        <LeadsTab campaignId={campaignId} tenantId={tenantId} />
      )}
      {tab === "stats" && <StatsTab campaignId={campaignId} />}
      {tab === "replies" && <RepliesTab campaignId={campaignId} />}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      data-ocid="roofer.back.button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ChevronLeft className="w-4 h-4" />
      All campaigns
    </button>
  );
}

// ===========================================================================
// SEQUENCE TAB
// ===========================================================================

function SequenceTab({ campaign }: { campaign: RooferColdCampaign }) {
  const update = useUpdateSequence(campaign.id);
  const [steps, setSteps] = useState<RooferCampaignStep[]>(campaign.sequence);
  const [dirty, setDirty] = useState(false);
  const [previewStepIdx, setPreviewStepIdx] = useState(0);

  // Re-sync when the campaign sequence changes (e.g. after save refetch)
  useEffect(() => {
    setSteps(campaign.sequence);
    setDirty(false);
  }, [campaign.sequence]);

  function patch(idx: number, patch: Partial<RooferCampaignStep>) {
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    );
    setDirty(true);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setSteps((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((s, i) => ({ ...s, stepNumber: BigInt(i + 1) }));
    });
    setDirty(true);
  }

  function moveDown(idx: number) {
    setSteps((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((s, i) => ({ ...s, stepNumber: BigInt(i + 1) }));
    });
    setDirty(true);
  }

  function removeStep(idx: number) {
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((s, i) => ({ ...s, stepNumber: BigInt(i + 1) })),
    );
    setDirty(true);
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: `step-new-${Date.now()}`,
        stepNumber: BigInt(prev.length + 1),
        subject: "New step — write a subject",
        body: "Hi [name], ",
        delayDays: BigInt(2),
        sendTime: "09:00",
        ctaToken: `cta-new-${prev.length + 1}`,
      },
    ]);
    setDirty(true);
  }

  function handleSave() {
    update.mutate(
      { sequence: steps },
      {
        onSuccess: () => {
          toast.success("Sequence saved");
          setDirty(false);
        },
        onError: () => toast.error("Failed to save sequence"),
      },
    );
  }

  const previewStep = steps[previewStepIdx] ?? steps[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Editor column */}
      <div className="xl:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Email Sequence ({steps.length} steps)
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="roofer.add_step.button"
              onClick={addStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Step
            </button>
            <button
              type="button"
              data-ocid="roofer.save_sequence.button"
              onClick={handleSave}
              disabled={!dirty || update.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {update.isPending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Sequence
            </button>
          </div>
        </div>

        {steps.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No sequence steps"
            subtitle="Add a step to start building your email sequence."
            action={
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add first step
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <StepCard
                key={step.id}
                step={step}
                idx={idx}
                total={steps.length}
                onPatch={patch}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
                onRemove={removeStep}
                onPreview={() => setPreviewStepIdx(idx)}
                isPreview={previewStepIdx === idx}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview column */}
      <div className="xl:col-span-1">
        <div className="sticky top-4 rounded-xl bg-card/60 border border-white/8 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mailbox className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-foreground">
              Live Preview
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Step {n(previewStep?.stepNumber)} · rendered for a sample lead
          </p>
          {previewStep ? (
            <div className="rounded-lg bg-background border border-white/10 p-4">
              <div className="text-xs text-muted-foreground mb-1">Subject</div>
              <div className="text-sm font-semibold text-foreground mb-3">
                {renderTokens(previewStep.subject, DEMO_SAMPLE_LEAD)}
              </div>
              <div className="text-xs text-muted-foreground mb-1">Body</div>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {renderTokens(previewStep.body, DEMO_SAMPLE_LEAD)}
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>
                  Sends {n(previewStep.delayDays)}d after previous step
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No step to preview.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  idx,
  total,
  onPatch,
  onMoveUp,
  onMoveDown,
  onRemove,
  onPreview,
  isPreview,
}: {
  step: RooferCampaignStep;
  idx: number;
  total: number;
  onPatch: (idx: number, patch: Partial<RooferCampaignStep>) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onRemove: (idx: number) => void;
  onPreview: () => void;
  isPreview: boolean;
}) {
  const [enabled, setEnabled] = useState(true);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  function insertToken(token: string) {
    const ta = bodyRef.current;
    if (!ta) {
      onPatch(idx, { body: `${step.body}{${token}}` });
      return;
    }
    const start = ta.selectionStart ?? step.body.length;
    const end = ta.selectionEnd ?? step.body.length;
    const insert = `{${token}}`;
    const next = step.body.slice(0, start) + insert + step.body.slice(end);
    onPatch(idx, { body: next });
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  return (
    <div
      data-ocid={`roofer.step.item.${idx + 1}`}
      className={`rounded-xl border p-4 transition-all ${
        isPreview
          ? "bg-amber-500/5 border-amber-500/40"
          : "bg-card/40 border-white/8"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center">
            {idx + 1}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Step {idx + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-ocid={`roofer.step.move_up.${idx + 1}`}
            onClick={() => onMoveUp(idx)}
            disabled={idx === 0}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Move up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            data-ocid={`roofer.step.move_down.${idx + 1}`}
            onClick={() => onMoveDown(idx)}
            disabled={idx === total - 1}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Move down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            data-ocid={`roofer.step.preview.${idx + 1}`}
            onClick={onPreview}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-amber-300 transition-colors"
            aria-label="Preview this step"
            title="Preview this step"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            data-ocid={`roofer.step.delete.${idx + 1}`}
            onClick={() => onRemove(idx)}
            className="p-1.5 rounded-md hover:bg-rose-500/15 text-muted-foreground hover:text-rose-300 transition-colors"
            aria-label="Remove step"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <input
          data-ocid={`roofer.step.subject.${idx + 1}`}
          type="text"
          value={step.subject}
          onChange={(e) => onPatch(idx, { subject: e.target.value })}
          placeholder="Subject line"
          className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
        />

        {/* Token pills */}
        <div className="flex flex-wrap gap-1.5">
          {PERSONALIZATION_TOKENS.map((token) => (
            <button
              key={token}
              type="button"
              data-ocid={`roofer.step.token.${token}`}
              onClick={() => insertToken(token)}
              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:bg-purple-500/20 transition-colors"
            >
              {token}
            </button>
          ))}
        </div>

        <textarea
          ref={bodyRef}
          data-ocid={`roofer.step.body.${idx + 1}`}
          value={step.body}
          onChange={(e) => onPatch(idx, { body: e.target.value })}
          placeholder="Email body — use {token} pills above to personalize"
          rows={5}
          className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 resize-y font-mono"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor={`roofer-step-delay-${idx + 1}`}
              className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Delay (days)
            </label>
            <input
              id={`roofer-step-delay-${idx + 1}`}
              data-ocid={`roofer.step.delay.${idx + 1}`}
              type="number"
              min={0}
              value={n(step.delayDays)}
              onChange={(e) =>
                onPatch(idx, { delayDays: BigInt(e.target.value || 0) })
              }
              className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-background border border-white/10 text-sm text-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <div>
            <label
              htmlFor={`roofer-step-send-time-${idx + 1}`}
              className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Send time
            </label>
            <input
              id={`roofer-step-send-time-${idx + 1}`}
              data-ocid={`roofer.step.send_time.${idx + 1}`}
              type="text"
              placeholder="09:00"
              value={step.sendTime}
              onChange={(e) => onPatch(idx, { sendTime: e.target.value })}
              className="w-full mt-2 px-2.5 py-1.5 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
              <input
                data-ocid={`roofer.step.enabled.${idx + 1}`}
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500"
              />
              Enabled
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// LEADS TAB
// ===========================================================================

function LeadsTab({
  campaignId,
  tenantId,
}: {
  campaignId: string;
  tenantId: string;
}) {
  const {
    data: leads,
    isLoading,
    isError,
  } = useRooferCampaignLeads(campaignId);
  const [showEnroll, setShowEnroll] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const paged = useMemo(() => {
    if (!leads) return [];
    return leads.slice(page * pageSize, (page + 1) * pageSize);
  }, [leads, page]);

  const totalPages = Math.max(1, Math.ceil((leads?.length ?? 0) / pageSize));

  function exportCsv() {
    if (!leads || leads.length === 0) {
      toast.error("No leads to export");
      return;
    }
    const header = [
      "Business",
      "Email",
      "Phone",
      "Niche",
      "Status",
      "Current Step",
      "Enrolled At",
      "Last Event",
    ];
    const rows = leads.map((l) => [
      l.businessName,
      l.email,
      l.phone,
      l.niche,
      LEAD_STATUS_LABELS[l.status],
      n(l.currentStep),
      fmtDateTime(n(l.enrolledAt)),
      fmtDateTime(n(l.lastEventAt)),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-${campaignId}-leads.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Enrolled Leads ({leads?.length ?? 0})
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="roofer.export_csv.button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            data-ocid="roofer.enroll_leads.button"
            onClick={() => setShowEnroll(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Enroll Leads
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="Loading leads…" />
      ) : isError ? (
        <ErrorState message="Failed to load leads." />
      ) : !leads || leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No leads enrolled"
          subtitle="Enroll roofing leads from the Lead Engine to start this campaign."
          action={
            <button
              type="button"
              onClick={() => setShowEnroll(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Enroll leads
            </button>
          }
        />
      ) : (
        <>
          <div className="rounded-xl bg-card/40 border border-white/8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Business</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Step</th>
                    <th className="px-4 py-3 font-semibold">Last Event</th>
                    <th className="px-4 py-3 font-semibold">Next Send</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((lead, i) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      index={page * pageSize + i}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-ocid="roofer.leads.pagination_prev"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  type="button"
                  data-ocid="roofer.leads.pagination_next"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showEnroll && (
        <EnrollLeadsModal
          campaignId={campaignId}
          tenantId={tenantId}
          onClose={() => setShowEnroll(false)}
        />
      )}
    </div>
  );
}

function LeadRow({
  lead,
  index,
}: {
  lead: RooferCampaignLead;
  index: number;
}) {
  const nextSendMs =
    n(lead.lastEventAt) > 0
      ? n(lead.lastEventAt) + n(lead.currentStep) * 2 * 24 * 60 * 60 * 1000
      : 0;

  return (
    <tr
      data-ocid={`roofer.lead.item.${index + 1}`}
      className="border-t border-white/5 hover:bg-white/5 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="font-medium text-foreground">{lead.businessName}</div>
        <div className="text-[11px] text-muted-foreground">{lead.phone}</div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
      <td className="px-4 py-3 text-foreground">
        {n(lead.currentStep) > 0 ? `Step ${n(lead.currentStep)}` : "—"}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {timeAgo(n(lead.lastEventAt))}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {nextSendMs > Date.now() ? fmtDateTime(nextSendMs) : "—"}
      </td>
      <td className="px-4 py-3">
        <ToneBadge tone={LEAD_STATUS_TONE[lead.status]}>
          {LEAD_STATUS_LABELS[lead.status]}
        </ToneBadge>
      </td>
    </tr>
  );
}

function EnrollLeadsModal({
  campaignId,
  tenantId,
  onClose,
}: {
  campaignId: string;
  tenantId: string;
  onClose: () => void;
}) {
  const { data: leads, isLoading } = useLeads(tenantId);
  const enroll = useEnrollLeads(campaignId);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");

  const roofingLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter(
      (l) =>
        l.niche?.toLowerCase().includes("roofing") ||
        l.niche === "roofing" ||
        true, // show all; filter narrows by search
    );
  }, [leads]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return roofingLeads;
    return roofingLeads.filter(
      (l) =>
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q),
    );
  }, [roofingLeads, filter]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleEnroll() {
    if (selected.size === 0) {
      toast.error("Select at least one lead to enroll");
      return;
    }
    enroll.mutate(
      { campaignId, leadIds: Array.from(selected) },
      {
        onSuccess: () => {
          toast.success(`Enrolled ${selected.size} leads`);
          onClose();
        },
        onError: () => toast.error("Failed to enroll leads"),
      },
    );
  }

  return (
    <div
      data-ocid="roofer.enroll.dialog"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-foreground">
              Enroll Leads
            </h2>
          </div>
          <button
            type="button"
            data-ocid="roofer.enroll.close_button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 border-b border-white/8">
          <input
            data-ocid="roofer.enroll.search.input"
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search leads by name, email, or phone…"
            className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {isLoading ? (
            <LoadingState label="Loading leads…" />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No leads match your filter.
            </p>
          ) : (
            filtered.map((lead, i) => {
              const checked = selected.has(lead.id);
              return (
                <label
                  key={lead.id}
                  data-ocid={`roofer.enroll.lead.item.${i + 1}`}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    checked
                      ? "bg-amber-500/10 border-amber-500/40"
                      : "bg-background border-white/8 hover:bg-white/5"
                  }`}
                >
                  <input
                    data-ocid={`roofer.enroll.lead.checkbox.${i + 1}`}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(lead.id)}
                    className="w-4 h-4 rounded accent-amber-500"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">
                      {lead.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {lead.email} · {lead.phone}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {lead.niche}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between p-5 border-t border-white/8">
          <span className="text-xs text-muted-foreground">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="roofer.enroll.cancel_button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              data-ocid="roofer.enroll.confirm_button"
              onClick={handleEnroll}
              disabled={selected.size === 0 || enroll.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enroll.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Enroll Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// STATS TAB
// ===========================================================================

function StatsTab({ campaignId }: { campaignId: string }) {
  const {
    data: stats,
    isLoading,
    isError,
  } = useRooferCampaignStats(campaignId);
  const { data: leads } = useRooferCampaignLeads(campaignId);

  // Per-step funnel: count leads at each currentStep (computed before early returns
  // so hooks are always called in the same order)
  const stepFunnel = useMemo(() => {
    if (!leads || leads.length === 0) return [];
    const maxStep = leads.reduce(
      (max, l) => Math.max(max, n(l.currentStep)),
      0,
    );
    return Array.from({ length: maxStep }, (_, i) => {
      const stepNum = i + 1;
      const reached = leads.filter((l) => n(l.currentStep) >= stepNum).length;
      const prev =
        i === 0
          ? leads.length
          : leads.filter((l) => n(l.currentStep) >= i).length;
      const dropOff =
        prev > 0 ? Math.round(((prev - reached) / prev) * 100) : 0;
      return { step: stepNum, reached, dropOff };
    });
  }, [leads]);

  if (isLoading) return <LoadingState label="Loading stats…" />;
  if (isError || !stats) return <ErrorState message="Failed to load stats." />;

  const sent = n(stats.sent);
  const opened = n(stats.opened);
  const replied = n(stats.replied);
  const bounced = n(stats.bounced);
  const booked = n(stats.booked);
  const unsubscribed = n(stats.unsubscribed);
  const total = n(stats.totalLeads);

  const tiles: {
    label: string;
    value: number;
    rate: number;
    tone: StatusTone;
    icon: typeof Send;
  }[] = [
    {
      label: "Sent",
      value: sent,
      rate: pct(sent, total),
      tone: "blue",
      icon: Send,
    },
    {
      label: "Opened",
      value: opened,
      rate: pct(opened, sent),
      tone: "cyan",
      icon: Mail,
    },
    {
      label: "Replied",
      value: replied,
      rate: pct(replied, sent),
      tone: "purple",
      icon: Inbox,
    },
    {
      label: "Bounced",
      value: bounced,
      rate: pct(bounced, sent),
      tone: "rose",
      icon: X,
    },
    {
      label: "Booked",
      value: booked,
      rate: pct(booked, sent),
      tone: "emerald",
      icon: Calendar,
    },
    {
      label: "Unsubscribed",
      value: unsubscribed,
      rate: pct(unsubscribed, sent),
      tone: "gray",
      icon: X,
    },
  ];

  const bookedLeads =
    leads?.filter((l) => l.status === LeadStatus.booked) ?? [];

  return (
    <div className="space-y-6">
      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-xl bg-card/60 border border-white/8 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t.label}
              </span>
              <t.icon className={`w-4 h-4 ${TONE_TEXT[t.tone]}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{t.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {t.rate}% rate
            </p>
          </div>
        ))}
      </div>

      {/* Per-step funnel */}
      <div className="rounded-xl bg-card/40 border border-white/8 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Per-Step Funnel
        </h3>
        {stepFunnel.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No lead progression data yet.
          </p>
        ) : (
          <div className="space-y-2">
            {stepFunnel.map((s) => (
              <div
                key={s.step}
                data-ocid={`roofer.funnel.item.${s.step}`}
                className="flex items-center gap-3"
              >
                <span className="w-16 text-xs text-muted-foreground flex-shrink-0">
                  Step {s.step}
                </span>
                <div className="flex-1 h-7 rounded-lg bg-background border border-white/8 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500/40 to-amber-500/60 transition-all"
                    style={{
                      width: `${pct(s.reached, leads?.length ?? 1)}%`,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-foreground">
                    {s.reached} leads
                  </span>
                </div>
                <span className="w-20 text-xs text-rose-300 text-right flex-shrink-0">
                  {s.dropOff > 0 ? `-${s.dropOff}%` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo bookings */}
      <div className="rounded-xl bg-card/40 border border-white/8 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Demo Bookings ({bookedLeads.length})
        </h3>
        {bookedLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No demos booked yet from this campaign.
          </p>
        ) : (
          <div className="space-y-2">
            {bookedLeads.map((lead, i) => (
              <div
                key={lead.id}
                data-ocid={`roofer.booking.item.${i + 1}`}
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-white/8"
              >
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {lead.businessName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lead.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-300 font-semibold">
                    Booked
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {timeAgo(n(lead.lastEventAt))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================================================
// REPLIES TAB
// ===========================================================================

function RepliesTab({ campaignId }: { campaignId: string }) {
  const {
    data: replies,
    isLoading,
    isError,
  } = useRooferCampaignReplies(campaignId);

  if (isLoading) return <LoadingState label="Loading replies…" />;
  if (isError) return <ErrorState message="Failed to load replies." />;

  if (!replies || replies.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No replies yet"
        subtitle="Replies from enrolled roofers will appear here once they respond to your sequence."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Reply Inbox ({replies.length})
      </h2>
      {replies.map((reply, i) => (
        <div
          key={reply.id}
          data-ocid={`roofer.reply.item.${i + 1}`}
          className="rounded-xl bg-card/40 border border-white/8 p-4 hover:bg-card/60 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {reply.businessName}
                </span>
                <ToneBadge tone="purple">Replied</ToneBadge>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {reply.email}
              </div>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {timeAgo(n(reply.lastEventAt))}
            </span>
          </div>
          <div className="rounded-lg bg-background border border-white/8 p-3 mt-2">
            <p className="text-sm text-foreground leading-relaxed">
              {reply.replySnippet ?? "(no snippet captured)"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
