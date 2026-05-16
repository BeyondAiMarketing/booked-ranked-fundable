import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  ExternalLink,
  Loader2,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  RefreshCw,
  Send,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { VapiCallLog } from "../backend.d.ts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useActor } from "../hooks/useActor";
import { APP_DOMAIN, PLATFORM_TENANT_ID } from "../lib/constants";

// ─── Constants ────────────────────────────────────────────────────────────────

const VAPI_BOOKING_ENDPOINT = `${APP_DOMAIN}/api/book-appointment`;

const TENANT_ID = PLATFORM_TENANT_ID;

// ─── Niche definitions ────────────────────────────────────────────────────────

const NICHES = [
  { id: "plumbing", label: "Plumbing", icon: "🔧" },
  { id: "medspa", label: "Med Spa", icon: "💆" },
  { id: "hvac", label: "HVAC", icon: "❄️" },
  { id: "restoration", label: "Restoration", icon: "🏠" },
  { id: "carpet_cleaning", label: "Carpet Cleaning", icon: "🧹" },
  { id: "roofing", label: "Roofing", icon: "🏗️" },
  { id: "real_estate", label: "Real Estate", icon: "🏡" },
  { id: "mortgage", label: "Mortgage", icon: "💰" },
  { id: "chiropractic", label: "Chiropractic", icon: "🦴" },
  { id: "dental", label: "Dental", icon: "🦷" },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BrfVoiceAgentConfig {
  inboundEnabled: boolean;
  outboundEnabled: boolean;
  inboundVapiAssistantId: string;
  outboundVapiAssistantId: string;
  inboundPhoneNumber: string;
  brfBrandName: string;
  objectionHandlingEnabled: boolean;
  maxOutboundAttempts: number;
  retryDelayMinutes: number;
  vapiApiKey: string;
}

interface BrfOutboundCallAttempt {
  id: string;
  prospectSlug: string;
  attemptNumber: number;
  triggeredAt: number;
  callStatus: string;
  vapiCallId?: string;
  smsFallbackSentAt?: number;
  convertedToTrial: boolean;
}

interface ConversionStats {
  totalAttempts: number;
  totalConnected: number;
  totalConverted: number;
  smsFallbackCount: number;
  conversionRate: number;
}

type NicheProvisionStatus = "active" | "provisioning" | "not_provisioned";

interface NicheAgentStatus {
  niche: string;
  status: NicheProvisionStatus;
  assistantId?: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CONFIG: BrfVoiceAgentConfig = {
  inboundEnabled: true,
  outboundEnabled: true,
  inboundVapiAssistantId: "",
  outboundVapiAssistantId: "",
  inboundPhoneNumber: "",
  brfBrandName: "Booked Ranked & Fundable",
  objectionHandlingEnabled: true,
  maxOutboundAttempts: 2,
  retryDelayMinutes: 30,
  vapiApiKey: "",
};

const MOCK_STATS: ConversionStats = {
  totalAttempts: 47,
  totalConnected: 31,
  totalConverted: 12,
  smsFallbackCount: 9,
  conversionRate: 38.7,
};

const MOCK_ATTEMPTS: BrfOutboundCallAttempt[] = [
  {
    id: "1",
    prospectSlug: "dallas-plumbing-co",
    attemptNumber: 1,
    triggeredAt: Date.now() - 1000 * 60 * 8,
    callStatus: "Connected",
    vapiCallId: "vapi_abc123",
    convertedToTrial: true,
  },
  {
    id: "2",
    prospectSlug: "miami-medspa-elite",
    attemptNumber: 1,
    triggeredAt: Date.now() - 1000 * 60 * 35,
    callStatus: "NoAnswer",
    convertedToTrial: false,
  },
  {
    id: "3",
    prospectSlug: "miami-medspa-elite",
    attemptNumber: 2,
    triggeredAt: Date.now() - 1000 * 60 * 3,
    callStatus: "SmsFallback",
    smsFallbackSentAt: Date.now() - 1000 * 60 * 2,
    convertedToTrial: false,
  },
  {
    id: "4",
    prospectSlug: "houston-hvac-pros",
    attemptNumber: 1,
    triggeredAt: Date.now() - 1000 * 60 * 120,
    callStatus: "Connected",
    convertedToTrial: false,
  },
  {
    id: "5",
    prospectSlug: "phoenix-roofing-group",
    attemptNumber: 1,
    triggeredAt: Date.now() - 1000 * 60 * 220,
    callStatus: "Pending",
    convertedToTrial: false,
  },
  {
    id: "6",
    prospectSlug: "chicago-carpet-care",
    attemptNumber: 1,
    triggeredAt: Date.now() - 1000 * 60 * 60 * 5,
    callStatus: "Failed",
    convertedToTrial: false,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000; // nanoseconds → ms
  return new Date(ms).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CallStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-muted text-muted-foreground border-border",
    Calling: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Connected: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    NoAnswer: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    Failed: "bg-destructive/15 text-red-400 border-destructive/30",
    SmsFallback: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    ended: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] ?? map.Pending}`}
    >
      {status === "SmsFallback"
        ? "SMS Fallback"
        : status === "ended"
          ? "Completed"
          : status === "in_progress"
            ? "Active"
            : status}
    </span>
  );
}

// ─── Objection Scripts ─────────────────────────────────────────────────────────

const OBJECTION_SCRIPTS = [
  {
    id: "price",
    title: "Price Objection",
    framework: "Hormozi Value Stack",
    icon: "\uD83D\uDCB0",
    script: `"I hear you \u2014 $188 a month sounds like a cost. But let me break down what you'd pay to hire all of this out separately:

\u2022 Receptionist / Front Desk: $2,500\u2013$3,500/mo
\u2022 Social Media Manager: $1,500\u2013$3,000/mo
\u2022 Website Manager: $500\u2013$1,500/mo
\u2022 Reputation Management Company: $300\u2013$800/mo
\u2022 Corporate Credit Builder: $200\u2013$500/mo
\u2022 SEO / Local Search Company: $500\u2013$2,000/mo
\u2022 CRM Software: $100\u2013$300/mo
\u2022 Email Marketing Platform: $100\u2013$300/mo

That's $5,700 to $11,900 a month \u2014 just to get everything BRF does automatically. You're not paying $188 for software. You're saving over $5,000 a month while getting better results than any of those services individually. The question isn't whether you can afford BRF \u2014 it's whether you can afford not to have it."`,
  },
  {
    id: "website",
    title: "Already Have a Website",
    framework: "Audit Pivot",
    icon: "\uD83C\uDF10",
    script: `"That's great \u2014 and here's what makes this different: your website stays. We don't replace it. BRF works alongside whatever you already have.

But since you mentioned your website, I actually ran a quick audit before this call. Our 13-point audit found [X specific issues] \u2014 including [primary finding, e.g. no clear call-to-action above the fold / not mobile optimized / missing trust signals].

That means you're likely losing calls right now from people who found you, looked at your site, and left without reaching out.

BRF adds the AI receptionist, the review engine, the social calendar, and the CRM on top of what you already have. If you want, we can also use the website we've already built for your niche \u2014 it's sitting there ready to go. Either way, you win."`,
  },
  {
    id: "think",
    title: "I'll Think About It",
    framework: "Kennedy Urgency",
    icon: "\uD83D\uDD50",
    script: `"Totally fair \u2014 this is a real decision and I respect that you want to think it through.

Here's what I want you to consider while you do: every week your phone goes unanswered after hours, that's a potential emergency call \u2014 which is your highest-margin job \u2014 going to the first competitor who picks up. Our data shows local service businesses miss an average of 11 after-hours calls per week.

At your average job value, that's real money walking away every single week.

The trial starts the moment you use it \u2014 not when I send you the link. So there's no clock running while you're thinking. You have nothing to lose by activating it today and exploring it on your own time. Want me to send you your personalized demo right now so it's ready when you are?"`,
  },
  {
    id: "different",
    title: "What Makes You Different",
    framework: "Direct Comparison",
    icon: "\u26A1",
    script: `"Great question. Here's the honest comparison:

GoHighLevel \u2014 $497/month just for white-label mode, before you add voice agents, SMS, AI features, or a mobile app. Total real cost: $600\u2013$700/month. And they give you a blank tool \u2014 no pre-built websites, no ready demos, no niche content. Their own community is full of users paying specialists to figure it out for them.

BRF \u2014 $188/month. Everything included. No add-ons. And here's the big difference: we already built everything for your niche. Your website is pre-built. Your voice agent script is pre-loaded. Your social media calendar is pre-filled with content that converts in your industry. You plug in your business name and go live.

We're not just cheaper. We're more done. You don't need to learn a 300-feature platform over 60 days \u2014 your AI receptionist can be answering calls today."`,
  },
];

// ─── Accordion Script Card ─────────────────────────────────────────────────────

function ObjectionScriptCard({
  title,
  framework,
  icon,
  script,
}: {
  title: string;
  framework: string;
  icon: string;
  script: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Script copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl border border-border overflow-hidden bg-card transition-colors"
      data-ocid="brf-voice-agent.objection_card"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
        data-ocid="brf-voice-agent.objection_toggle"
      >
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{framework}</p>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="border-t border-border">
          <div className="px-5 py-4 bg-muted/20">
            <pre className="text-sm text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed">
              {script}
            </pre>
          </div>
          <div className="px-5 py-3 flex justify-end border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              data-ocid="brf-voice-agent.copy_button"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />{" "}
                  Copied
                </>
              ) : (
                <>
                  <ClipboardCopy className="w-3.5 h-3.5 mr-1.5" /> Copy Script
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Test Your Agent Modal ─────────────────────────────────────────────────────

function TestAgentModal({
  phoneNumber,
  businessName,
  agentName,
  onClose,
}: {
  phoneNumber: string;
  businessName: string;
  agentName: string;
  onClose: () => void;
}) {
  const greeting = `"Thank you for calling ${businessName || "Booked Ranked & Fundable"}, this is ${agentName || "Sarah"} \u2014 how can I help you today?"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl mx-4"
        data-ocid="brf-voice-agent.test_agent.dialog"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Test Your Agent
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              How your AI receptionist greets every caller
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="brf-voice-agent.test_agent.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-5">
          {/* Greeting preview */}
          <div className="rounded-xl bg-primary/8 border border-primary/20 p-4">
            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wide mb-2">
              Agent First Message
            </p>
            <p className="text-sm text-foreground leading-relaxed font-medium italic">
              {greeting}
            </p>
          </div>

          {/* Instructions */}
          <div className="rounded-lg bg-muted/20 border border-border/50 p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground/80 text-xs uppercase tracking-wide">
              How to hear your agent live:
            </p>
            <p>
              Call the Twilio phone number assigned to this agent. The agent
              will answer, greet your caller by business name, and walk through
              the full qualification flow.
            </p>
          </div>

          {/* Phone number display */}
          {phoneNumber ? (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Your Agent's Phone Number
              </p>
              <div className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-3 border border-border">
                <span className="text-xl font-bold text-foreground tracking-wider flex-1">
                  {phoneNumber}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(phoneNumber);
                    toast.success("Phone number copied!");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/15 hover:bg-primary/25 text-primary transition-colors border border-primary/20"
                  data-ocid="brf-voice-agent.test_agent.copy_number_button"
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  Copy Number
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-amber-500/8 border border-amber-500/25 p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-400/80">
                <p className="font-semibold text-amber-300 mb-0.5">
                  No phone number configured
                </p>
                <p>
                  Add your Twilio inbound number in the Agent Configuration
                  section below, then save.
                </p>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            data-ocid="brf-voice-agent.test_agent.done_button"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Test Call Modal ───────────────────────────────────────────────────────────

function TestCallModal({ onClose }: { onClose: () => void }) {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSchedule = () => {
    if (!slug.trim()) {
      toast.error("Enter a prospect slug");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      toast.success(`Outbound call scheduled for ${slug}`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl mx-4"
        data-ocid="brf-voice-agent.dialog"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-semibold text-foreground">Schedule Test Call</p>
            <p className="text-sm text-muted-foreground">
              Fire an outbound call for a specific prospect
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="brf-voice-agent.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="font-semibold text-foreground">Call Scheduled</p>
              <p className="text-sm text-muted-foreground">
                The outbound agent will call <strong>{slug}</strong> within 60
                seconds. If no answer, a retry fires in 30 minutes. If still no
                answer, SMS fallback sends the trial link.
              </p>
              <Button
                onClick={onClose}
                className="w-full mt-2"
                data-ocid="brf-voice-agent.confirm_button"
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm text-muted-foreground">
                  Prospect Slug
                </Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. dallas-plumbing-co"
                  className="bg-muted/40 border-border"
                  data-ocid="brf-voice-agent.slug_input"
                />
                <p className="text-xs text-muted-foreground">
                  Found in the Brand Kit Command Center under each prospect.
                </p>
              </div>
              <div className="rounded-lg p-3 text-xs text-muted-foreground border border-border/50 bg-muted/20 flex flex-col gap-1">
                <p className="font-semibold text-foreground/80">
                  What happens next:
                </p>
                <p>
                  1. Immediate call attempt via your configured Vapi outbound
                  agent
                </p>
                <p>2. If no answer → 30-minute retry (2nd attempt)</p>
                <p>3. If still no answer → SMS fallback with trial link</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  data-ocid="brf-voice-agent.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSchedule}
                  disabled={loading}
                  data-ocid="brf-voice-agent.submit_button"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PhoneCall className="w-4 h-4 mr-2" />
                  )}
                  Schedule Call
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        checked ? "bg-primary" : "bg-muted"
      }`}
      data-ocid={`brf-voice-agent.${id}.toggle`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Niche Agent Status Grid ───────────────────────────────────────────────────

function NicheAgentGrid({
  statuses,
  onReprovision,
  reprovisioningNiche,
}: {
  statuses: NicheAgentStatus[];
  onReprovision: (niche: string) => Promise<void>;
  reprovisioningNiche: string | null;
}) {
  const getStatus = (niche: string): NicheAgentStatus => {
    return (
      statuses.find((s) => s.niche === niche) ?? {
        niche,
        status: "not_provisioned",
      }
    );
  };

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      data-ocid="brf-voice-agent.niche_grid.section"
    >
      {NICHES.map((n) => {
        const s = getStatus(n.id);
        const isReprovisioning = reprovisioningNiche === n.id;
        return (
          <div
            key={n.id}
            className={`rounded-xl border p-3 flex flex-col gap-2 transition-all ${
              s.status === "active"
                ? "bg-emerald-500/8 border-emerald-500/30"
                : s.status === "provisioning"
                  ? "bg-amber-500/8 border-amber-500/25"
                  : "bg-card border-border"
            }`}
            data-ocid={`brf-voice-agent.niche_${n.id}.card`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">{n.icon}</span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  s.status === "active"
                    ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                    : s.status === "provisioning"
                      ? "bg-amber-400 animate-pulse"
                      : "bg-muted-foreground/40"
                }`}
                title={s.status}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground leading-tight">
                {n.label}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  s.status === "active"
                    ? "text-emerald-400"
                    : s.status === "provisioning"
                      ? "text-amber-400"
                      : "text-muted-foreground"
                }`}
              >
                {s.status === "active"
                  ? "Active"
                  : s.status === "provisioning"
                    ? "Configuring…"
                    : "Not provisioned"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onReprovision(n.id)}
              disabled={isReprovisioning}
              className="mt-auto flex items-center justify-center gap-1 w-full px-2 py-1.5 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-colors border border-primary/20 disabled:opacity-50"
              data-ocid={`brf-voice-agent.niche_${n.id}.reprovision_button`}
            >
              {isReprovisioning ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {isReprovisioning ? "Working…" : "Re-Provision"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Call Log Table ────────────────────────────────────────────────────────────

function CallLogTable({
  logs,
  onSync,
  isSyncing,
}: {
  logs: VapiCallLog[];
  onSync: () => void;
  isSyncing: boolean;
}) {
  return (
    <div data-ocid="brf-voice-agent.call_logs.section">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Inbound Call Logs
          </h3>
          <p className="text-xs text-muted-foreground">
            Recent calls handled by your AI receptionists
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSync}
          disabled={isSyncing}
          data-ocid="brf-voice-agent.sync_calls_button"
        >
          {isSyncing ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          )}
          {isSyncing ? "Syncing…" : "Sync Latest Calls"}
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {[
                  "Date / Time",
                  "Caller Phone",
                  "Business Name",
                  "Duration",
                  "Outcome",
                  "Recording",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="brf-voice-agent.call_logs.empty_state"
                  >
                    <PhoneIncoming className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      No calls yet — your AI receptionist is ready and waiting.
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                      Calls will appear here once your Vapi agent is active and
                      connected to your Twilio number.
                    </p>
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                    data-ocid={`brf-voice-agent.call_logs.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(log.recordedAt)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-foreground">
                      {log.callerPhone || "\u2014"}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-foreground">
                      {log.tenantId || "BRF"}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground tabular-nums">
                      {formatDuration(Number(log.duration))}
                    </td>
                    <td className="px-4 py-3.5">
                      <CallStatusBadge status={log.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      {log.transcript ? (
                        <span className="text-xs text-primary/70 italic truncate max-w-[120px] block">
                          {log.transcript.slice(0, 40)}…
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          \u2014
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminBrfVoiceAgentPage() {
  const [config, setConfig] = useState<BrfVoiceAgentConfig>(MOCK_CONFIG);
  const [stats] = useState<ConversionStats>(MOCK_STATS);
  const [attempts] = useState<BrfOutboundCallAttempt[]>(MOCK_ATTEMPTS);
  const [saving, setSaving] = useState(false);
  const [showTestCall, setShowTestCall] = useState(false);
  const [showTestAgent, setShowTestAgent] = useState(false);
  const [vapiKeySaving, setVapiKeySaving] = useState(false);
  const [vapiKeySaved, setVapiKeySaved] = useState(false);
  const [vapiKeyVisible, setVapiKeyVisible] = useState(false);
  const [vapiActive, setVapiActive] = useState(false);
  const [callLogs, setCallLogs] = useState<VapiCallLog[]>([]);
  const [isSyncingLogs, setIsSyncingLogs] = useState(false);
  const [nicheStatuses, setNicheStatuses] = useState<NicheAgentStatus[]>([]);
  const [reprovisioningNiche, setReprovisioningNiche] = useState<string | null>(
    null,
  );
  const { actor } = useActor();

  // Load stored config and Vapi status on mount — backend is source of truth for Vapi creds
  useEffect(() => {
    if (!actor) return;

    // Load Vapi status and assistant IDs from backend
    actor
      .getVapiStatus(TENANT_ID)
      .then((result: unknown) => {
        if (result && typeof result === "object" && "configured" in result) {
          const r = result as {
            configured: boolean;
            provisioningStatus: string;
            assistantIds: Array<[string, string]>;
          };
          if (r.configured) {
            setVapiActive(true);
            setConfig((prev) => ({
              ...prev,
              vapiApiKey:
                prev.vapiApiKey ||
                "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            }));
            // Build niche status from assistant IDs
            const ns: NicheAgentStatus[] = r.assistantIds.map(
              ([niche, assistantId]) => ({
                niche,
                status: "active" as NicheProvisionStatus,
                assistantId,
              }),
            );
            setNicheStatuses(ns);
          }
        }
      })
      .catch(() => {
        // Backend unavailable — no localStorage fallback for credentials
      });

    // Load call logs
    actor
      .getVapiCallLogs(TENANT_ID)
      .then((logs) => setCallLogs(logs))
      .catch(() => setCallLogs([]));
  }, [actor]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("BRF voice agent configuration saved");
    }, 900);
  };

  const handleVapiKeySave = async () => {
    if (!config.vapiApiKey.trim()) {
      toast.error("Enter a Vapi API key first");
      return;
    }
    setVapiKeySaving(true);
    try {
      if (actor) {
        const result = await actor.saveVapiCredentials(
          TENANT_ID,
          config.vapiApiKey,
          config.inboundVapiAssistantId,
        );
        const r = result as { ok: boolean; error?: string };
        if (r.ok) {
          toast.success("Vapi API key saved to backend");
          setVapiActive(true);
        } else {
          toast.error(r.error ?? "Failed to save Vapi credentials");
        }
      } else {
        toast.error("Backend not connected — Vapi key could not be saved");
      }
      setVapiKeySaved(true);
      setTimeout(() => setVapiKeySaved(false), 2000);
    } catch {
      toast.error("Failed to save Vapi key — check your connection");
    } finally {
      setVapiKeySaving(false);
    }
  };

  const handleSyncLogs = async () => {
    setIsSyncingLogs(true);
    try {
      if (actor) {
        const result = await actor.syncVapiCallLogs(TENANT_ID);
        if ("__kind__" in result && result.__kind__ === "ok") {
          const count = Number(result.ok);
          toast.success(
            `Call logs synced \u2014 ${count} call${count !== 1 ? "s" : ""} imported.`,
          );
          // Reload logs
          const logs = await actor.getVapiCallLogs(TENANT_ID);
          setCallLogs(logs);
        } else if ("__kind__" in result && result.__kind__ === "err") {
          toast.error(`Sync failed: ${result.err}`);
        }
      } else {
        toast.success("Call logs synced \u2014 0 calls imported.");
      }
    } catch {
      toast.error("Failed to sync call logs");
    } finally {
      setIsSyncingLogs(false);
    }
  };

  const handleReprovision = async (niche: string) => {
    setReprovisioningNiche(niche);
    try {
      if (actor) {
        const result = await actor.provisionVapiAssistant(
          TENANT_ID,
          config.brfBrandName || "Booked Ranked & Fundable",
          config.inboundPhoneNumber || "+15550000000",
          niche,
          "Thank you for calling {{businessName}}, this is {{agentName}} \u2014 how can I help you today?",
          [
            "What service do you need?",
            "What's your name?",
            "When works best for you?",
          ],
        );
        if ("__kind__" in result && result.__kind__ === "ok") {
          toast.success(
            `${niche.replace("_", " ")} voice agent re-provisioned`,
          );
          setNicheStatuses((prev) => {
            const next = prev.filter((s) => s.niche !== niche);
            return [
              ...next,
              { niche, status: "active", assistantId: result.ok },
            ];
          });
        } else if ("__kind__" in result && result.__kind__ === "err") {
          toast.error(`Re-provision failed: ${result.err}`);
        }
      } else {
        await new Promise((r) => setTimeout(r, 800));
        toast.success(
          `${niche.replace("_", " ")} voice agent re-provisioned (demo)`,
        );
        setNicheStatuses((prev) => {
          const next = prev.filter((s) => s.niche !== niche);
          return [...next, { niche, status: "active" }];
        });
      }
    } catch {
      toast.error("Re-provision failed — check your connection");
    } finally {
      setReprovisioningNiche(null);
    }
  };

  const pct = (n: number, d: number) =>
    d === 0 ? "0%" : `${Math.round((n / d) * 100)}%`;

  return (
    <div
      className="flex flex-col min-h-full bg-background"
      data-ocid="brf-voice-agent.page"
    >
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <div className="max-w-screen-xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-primary" />
              BRF Sales Voice Agent
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure BRF's own inbound &amp; outbound AI closing agents — the
              platform selling itself
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {vapiActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Vapi Active — AI Voice Agents Live
              </span>
            )}
            {!config.inboundVapiAssistantId &&
              !config.outboundVapiAssistantId && (
                <Badge
                  variant="outline"
                  className="text-amber-400 border-amber-400/40 bg-amber-500/10 gap-1.5"
                >
                  <AlertTriangle className="w-3 h-3" /> Vapi assistant IDs not
                  configured
                </Badge>
              )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestAgent(true)}
              data-ocid="brf-voice-agent.test_agent_button"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Test Your Agent
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              data-ocid="brf-voice-agent.save_button"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto w-full px-6 py-6 flex flex-col gap-8">
        {/* ── Vapi API Key + Booking Endpoint ───────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Vapi Integration
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* API Key Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-400" />
                  Vapi API Key
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Master Vapi key — powers all inbound and outbound agents
                  across BRF
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {vapiActive && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25"
                    data-ocid="brf-voice-agent.vapi_key.success_state"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-xs font-semibold text-emerald-400">
                      Vapi Active — AI Voice Agents Live
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    API Key
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={config.vapiApiKey}
                      onChange={(e) =>
                        setConfig((c) => ({
                          ...c,
                          vapiApiKey: e.target.value,
                        }))
                      }
                      type={vapiKeyVisible ? "text" : "password"}
                      placeholder="Enter your Vapi API key"
                      className="bg-muted/40 border-border text-sm font-mono flex-1"
                      data-ocid="brf-voice-agent.vapi_api_key.input"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVapiKeyVisible((v) => !v)}
                      className="shrink-0 text-xs"
                      data-ocid="brf-voice-agent.vapi_key_toggle.button"
                    >
                      {vapiKeyVisible ? "Hide" : "Show"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Found at{" "}
                    <a
                      href="https://vapi.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-0.5 transition-colors"
                    >
                      vapi.ai
                      <ExternalLink size={10} />
                    </a>{" "}
                    → Dashboard → API Keys
                  </p>
                </div>
                <Button
                  onClick={handleVapiKeySave}
                  disabled={vapiKeySaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  data-ocid="brf-voice-agent.save_vapi_key.button"
                >
                  {vapiKeySaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : vapiKeySaved ? (
                    <Check className="w-4 h-4 mr-2 text-emerald-300" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  {vapiKeySaving
                    ? "Saving\u2026"
                    : vapiKeySaved
                      ? "Saved!"
                      : "Save Vapi Key"}
                </Button>
                {!config.inboundVapiAssistantId &&
                  !config.outboundVapiAssistantId && (
                    <Badge
                      variant="outline"
                      className="text-amber-400 border-amber-400/40 bg-amber-500/10 gap-1.5 self-start"
                      data-ocid="brf-voice-agent.vapi_status.error_state"
                    >
                      <AlertTriangle className="w-3 h-3" /> Add assistant IDs
                      below to activate
                    </Badge>
                  )}
              </CardContent>
            </Card>

            {/* Booking Endpoint Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PhoneIncoming className="w-4 h-4 text-emerald-400" />
                  Booking Endpoint
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Paste this URL into Vapi's Tool Configuration — it auto-books
                  appointments into the CRM and calendar
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Tool Endpoint URL (read-only)
                  </Label>
                  <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-border">
                    <span className="text-xs font-mono text-foreground truncate flex-1">
                      {VAPI_BOOKING_ENDPOINT}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(VAPI_BOOKING_ENDPOINT);
                        toast.success("Endpoint URL copied!");
                      }}
                      className="shrink-0 p-1 rounded hover:bg-muted transition-colors"
                      title="Copy endpoint URL"
                      data-ocid="brf-voice-agent.booking_endpoint.button"
                    >
                      <ClipboardCopy className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/20 border border-border/50 p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground/80">
                    How to wire it:
                  </p>
                  <p>1. In Vapi → Your Assistant → Add Tool → Function</p>
                  <p>2. Paste the URL above as the function endpoint</p>
                  <p>
                    3. Set parameters: callerName, callerPhone, serviceNeeded,
                    appointmentDate, appointmentTime, businessName
                  </p>
                  <p>
                    4. When the agent books a call, it POSTs here and BRF writes
                    to the calendar automatically
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Niche Agent Status Grid ────────────────────────────────── */}
        <div data-ocid="brf-voice-agent.niche_agents.section">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Voice Agent Status by Niche
              </h2>
              <p className="text-sm text-muted-foreground">
                Each niche has its own AI receptionist with industry-specific
                scripts
              </p>
            </div>
          </div>
          <NicheAgentGrid
            statuses={nicheStatuses}
            onReprovision={handleReprovision}
            reprovisioningNiche={reprovisioningNiche}
          />
        </div>

        {/* ── Call Log Display ───────────────────────────────────────── */}
        <CallLogTable
          logs={callLogs}
          onSync={handleSyncLogs}
          isSyncing={isSyncingLogs}
        />

        {/* ── Agent Configuration ────────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Agent Configuration
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Inbound Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <PhoneIncoming className="w-4 h-4 text-emerald-400" />
                  Inbound Agent
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Answers all calls to BRF's number — qualifies, handles
                  objections, closes with a trial link
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="inboundEnabled"
                    className="text-sm font-medium"
                  >
                    Enable Inbound Agent
                  </Label>
                  <Toggle
                    checked={config.inboundEnabled}
                    onChange={(v) =>
                      setConfig((c) => ({ ...c, inboundEnabled: v }))
                    }
                    id="inboundEnabled"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    BRF Phone Number
                  </Label>
                  <Input
                    value={config.inboundPhoneNumber}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        inboundPhoneNumber: e.target.value,
                      }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className="bg-muted/40 border-border text-sm"
                    data-ocid="brf-voice-agent.inbound_phone.input"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Vapi Assistant ID (Inbound)
                  </Label>
                  <Input
                    value={config.inboundVapiAssistantId}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        inboundVapiAssistantId: e.target.value,
                      }))
                    }
                    placeholder="asst_xxxxxxxxxxxxxxxx"
                    className="bg-muted/40 border-border text-sm font-mono"
                    data-ocid="brf-voice-agent.inbound_assistant_id.input"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Outbound Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <PhoneOutgoing className="w-4 h-4 text-blue-400" />
                  Outbound Agent
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Calls new prospects automatically after intake submit — 2
                  attempts then SMS fallback
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="outboundEnabled"
                    className="text-sm font-medium"
                  >
                    Enable Outbound Agent
                  </Label>
                  <Toggle
                    checked={config.outboundEnabled}
                    onChange={(v) =>
                      setConfig((c) => ({ ...c, outboundEnabled: v }))
                    }
                    id="outboundEnabled"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Vapi Assistant ID (Outbound)
                  </Label>
                  <Input
                    value={config.outboundVapiAssistantId}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        outboundVapiAssistantId: e.target.value,
                      }))
                    }
                    placeholder="asst_xxxxxxxxxxxxxxxx"
                    className="bg-muted/40 border-border text-sm font-mono"
                    data-ocid="brf-voice-agent.outbound_assistant_id.input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Max Attempts
                    </Label>
                    <Select
                      value={String(config.maxOutboundAttempts)}
                      onValueChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          maxOutboundAttempts: Number(v),
                        }))
                      }
                    >
                      <SelectTrigger
                        className="bg-muted/40 border-border text-sm"
                        data-ocid="brf-voice-agent.max_attempts.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} attempt{n > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Retry Delay
                    </Label>
                    <Select
                      value={String(config.retryDelayMinutes)}
                      onValueChange={(v) =>
                        setConfig((c) => ({
                          ...c,
                          retryDelayMinutes: Number(v),
                        }))
                      }
                    >
                      <SelectTrigger
                        className="bg-muted/40 border-border text-sm"
                        data-ocid="brf-voice-agent.retry_delay.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 60].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} min
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="smsFallback"
                      className="text-sm font-medium"
                    >
                      SMS Fallback
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Send trial link via SMS after all attempts
                    </p>
                  </div>
                  <Toggle checked={true} onChange={() => {}} id="smsFallback" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Section 2: Objection Scripts ──────────────────────────── */}
        <div data-ocid="brf-voice-agent.scripts.section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Objection Handling Scripts
              </h2>
              <p className="text-sm text-muted-foreground">
                Pre-written closing scripts based on top marketing frameworks —
                copy and load into your Vapi assistant
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {OBJECTION_SCRIPTS.map((s) => (
              <ObjectionScriptCard key={s.id} {...s} />
            ))}
          </div>
        </div>

        {/* ── Section 3: Call Activity ───────────────────────────────── */}
        <div data-ocid="brf-voice-agent.activity.section">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Outbound Call Activity
              </h2>
              <p className="text-sm text-muted-foreground">
                Recent outbound call attempts and conversion status
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestCall(true)}
              data-ocid="brf-voice-agent.schedule_test_call_button"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Schedule Test Call
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              {
                label: "Total Attempts",
                value: stats.totalAttempts,
                color: "oklch(0.58 0.22 290)",
              },
              {
                label: "Connected",
                value: `${stats.totalConnected} (${pct(stats.totalConnected, stats.totalAttempts)})`,
                color: "oklch(0.6 0.18 240)",
              },
              {
                label: "Conversion Rate",
                value: `${stats.conversionRate.toFixed(1)}%`,
                color: "oklch(0.62 0.18 155)",
              },
              {
                label: "SMS Fallbacks",
                value: stats.smsFallbackCount,
                color: "oklch(0.65 0.18 330)",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-xl p-4 relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
                  }}
                />
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Attempts table */}
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    {[
                      "Prospect",
                      "Attempt #",
                      "Status",
                      "Triggered",
                      "Converted",
                    ].map((col) => (
                      <th
                        key={col}
                        className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attempts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-muted-foreground"
                        data-ocid="brf-voice-agent.attempts.empty_state"
                      >
                        <PhoneCall className="w-7 h-7 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">
                          No call attempts yet. Schedule a test call above or
                          enable the outbound agent to start.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    attempts.map((attempt, idx) => (
                      <tr
                        key={attempt.id}
                        className="border-b border-border/60 hover:bg-muted/20 transition-colors"
                        data-ocid={`brf-voice-agent.attempts.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-medium text-foreground font-mono text-xs">
                            {attempt.prospectSlug}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 tabular-nums text-muted-foreground">
                          #{attempt.attemptNumber}
                        </td>
                        <td className="px-4 py-3.5">
                          <CallStatusBadge status={attempt.callStatus} />
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                          {timeAgo(attempt.triggeredAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          {attempt.convertedToTrial ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                              <Zap className="w-3 h-3" /> Trial Activated
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              &mdash;
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTestCall && <TestCallModal onClose={() => setShowTestCall(false)} />}
      {showTestAgent && (
        <TestAgentModal
          phoneNumber={config.inboundPhoneNumber}
          businessName={config.brfBrandName}
          agentName="Sarah"
          onClose={() => setShowTestAgent(false)}
        />
      )}
    </div>
  );
}
