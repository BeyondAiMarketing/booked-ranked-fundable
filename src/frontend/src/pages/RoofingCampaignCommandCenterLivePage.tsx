import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Eye,
  FileSearch,
  Loader2,
  MailCheck,
  MessageSquareText,
  PlayCircle,
  Send,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface CampaignEvent {
  id: string;
  event_label: string;
  event_detail?: string | null;
  occurred_at: string;
}

interface CampaignAudit {
  status: string;
  score?: number | null;
}

interface CampaignEmailDraft {
  id: string;
  subject: string;
  body_text: string;
  status: string;
}

interface RoofingLead {
  id: string;
  company_name: string;
  contact_name?: string | null;
  email: string;
  city?: string | null;
  state?: string | null;
  website?: string | null;
  audit_score?: number | null;
  stage:
    | "new"
    | "playbook_sent"
    | "demo_watched"
    | "audit_ready"
    | "email_ready"
    | "appointment"
    | "client_won"
    | "lost";
  next_action?: string | null;
  timeline: CampaignEvent[];
  audit?: CampaignAudit | null;
  emailDraft?: CampaignEmailDraft | null;
}

interface CommandCenterResponse {
  ok: boolean;
  error?: string;
  leads: RoofingLead[];
  metrics: {
    totalLeads: number;
    playbooksSent: number;
    demosWatched: number;
    auditsReady: number;
    emailDrafts: number;
    appointments: number;
  };
}

const STAGES = [
  { key: "new", label: "New Lead", icon: Users },
  { key: "playbook_sent", label: "Playbook Sent", icon: BookOpen },
  { key: "demo_watched", label: "Demo Watched", icon: PlayCircle },
  { key: "audit_ready", label: "Audit Ready", icon: FileSearch },
  { key: "email_ready", label: "Email Ready", icon: MailCheck },
  { key: "appointment", label: "Appointment", icon: CalendarCheck },
] as const;

function stageLabel(stage: RoofingLead["stage"]): string {
  return STAGES.find((item) => item.key === stage)?.label ?? stage.replaceAll("_", " ");
}

function scoreClass(score: number | null | undefined): string {
  if (score == null) return "text-slate-500";
  if (score >= 75) return "text-emerald-400";
  if (score >= 55) return "text-amber-400";
  return "text-rose-400";
}

function formatEventTime(value: string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RoofingCampaignCommandCenterLivePage() {
  const [selectedLead, setSelectedLead] = useState<RoofingLead | null>(null);
  const [activeView, setActiveView] = useState<
    "pipeline" | "leads" | "audit" | "email" | "analytics"
  >("pipeline");
  const [data, setData] = useState<CommandCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/get-roofing-campaign-command-center", {
        headers: { accept: "application/json" },
      });
      const payload = (await response.json()) as CommandCenterResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to load campaign data.");
      }
      setData(payload);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load campaign data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const leads = data?.leads ?? [];
  const metrics = useMemo(
    () => [
      { label: "Roofing Leads", value: data?.metrics.totalLeads ?? 0, icon: Users },
      { label: "Playbooks Sent", value: data?.metrics.playbooksSent ?? 0, icon: BookOpen },
      { label: "Audits Ready", value: data?.metrics.auditsReady ?? 0, icon: Bot },
      { label: "Demo Views", value: data?.metrics.demosWatched ?? 0, icon: Eye },
      { label: "Email Drafts", value: data?.metrics.emailDrafts ?? 0, icon: Send },
      { label: "Appointments", value: data?.metrics.appointments ?? 0, icon: CalendarCheck },
    ],
    [data],
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20">
              Roofing Campaign #1
            </Badge>
            <Badge variant="outline">Live Supabase Data</Badge>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Roofing Campaign Command Center
          </h1>
          <p className="text-slate-400 mt-2 max-w-3xl">
            Track the full journey from free playbook to demo, AI audit,
            approved email, and booked strategy call.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Activity className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Run Today&apos;s Growth Plan
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-rose-500/30 bg-rose-500/10">
          <CardContent className="p-4 text-rose-200">{error}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-slate-950/40 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  {label}
                </span>
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {loading ? "—" : value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          ["pipeline", "Pipeline", Target],
          ["leads", "Leads", Users],
          ["audit", "Audit Queue", FileSearch],
          ["email", "Email Approval", MessageSquareText],
          ["analytics", "Analytics", BarChart3],
        ].map(([key, label, Icon]) => {
          const IconComponent = Icon as typeof Target;
          return (
            <Button
              key={key as string}
              variant={activeView === key ? "default" : "outline"}
              onClick={() => setActiveView(key as typeof activeView)}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {label as string}
            </Button>
          );
        })}
      </div>

      {loading && (
        <Card className="bg-slate-950/40 border-white/10">
          <CardContent className="p-10 flex items-center justify-center text-slate-400">
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            Loading live campaign data...
          </CardContent>
        </Card>
      )}

      {!loading && activeView === "pipeline" && (
        <Card className="bg-slate-950/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Campaign Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
              {STAGES.map(({ key, label, icon: Icon }) => {
                const count = leads.filter((lead) => lead.stage === key).length;
                return (
                  <div
                    key={key}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-5 h-5 text-blue-400" />
                      <span className="text-2xl font-bold text-white">{count}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200">{label}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Leads currently in this stage
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && activeView === "leads" && (
        <Card className="bg-slate-950/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Roofing Leads</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {leads.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                No roofing campaign leads yet.
              </div>
            ) : (
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-white/10">
                    <th className="pb-3">Company</th>
                    <th className="pb-3">Contact</th>
                    <th className="pb-3">City</th>
                    <th className="pb-3">Website</th>
                    <th className="pb-3">Audit</th>
                    <th className="pb-3">Stage</th>
                    <th className="pb-3">Next Action</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const score = lead.audit_score ?? lead.audit?.score;
                    return (
                      <tr key={lead.id} className="border-b border-white/5 text-sm">
                        <td className="py-4 text-white font-semibold">
                          {lead.company_name}
                        </td>
                        <td className="py-4 text-slate-300">
                          <div>{lead.contact_name || "—"}</div>
                          <div className="text-xs text-slate-500">{lead.email}</div>
                        </td>
                        <td className="py-4 text-slate-400">
                          {[lead.city, lead.state].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="py-4 text-blue-400">{lead.website || "—"}</td>
                        <td className={`py-4 font-semibold ${scoreClass(score)}`}>
                          {score == null ? "—" : `${score}/100`}
                        </td>
                        <td className="py-4">
                          <Badge variant="outline">{stageLabel(lead.stage)}</Badge>
                        </td>
                        <td className="py-4 text-slate-300">
                          {lead.next_action || "Review lead"}
                        </td>
                        <td className="py-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedLead(lead)}
                          >
                            Open Timeline
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && activeView === "audit" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {leads.filter((lead) => lead.audit).map((lead) => (
            <Card key={lead.id} className="bg-slate-950/40 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white">{lead.company_name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                      {lead.website || "No website supplied"}
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${scoreClass(lead.audit?.score)}`}>
                    {lead.audit?.score ?? "—"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 p-3">
                    <div className="text-slate-500">Status</div>
                    <div className="text-white font-semibold mt-1 capitalize">
                      {lead.audit?.status}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 p-3">
                    <div className="text-slate-500">Local Visibility</div>
                    <div className="text-white font-semibold mt-1">Findings stored</div>
                  </div>
                </div>
                <Button className="w-full">
                  <Bot className="w-4 h-4 mr-2" />
                  Open AI Audit
                </Button>
              </CardContent>
            </Card>
          ))}
          {leads.filter((lead) => lead.audit).length === 0 && (
            <div className="text-slate-500">No audits have been created yet.</div>
          )}
        </div>
      )}

      {!loading && activeView === "email" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {leads.filter((lead) => lead.emailDraft).map((lead) => (
            <Card key={lead.id} className="bg-slate-950/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{lead.company_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-sm text-slate-300 leading-6">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
                    Subject
                  </div>
                  <div className="text-white font-semibold mb-4">
                    {lead.emailDraft?.subject}
                  </div>
                  {lead.emailDraft?.body_text}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Edit Draft
                  </Button>
                  <Button className="flex-1">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {leads.filter((lead) => lead.emailDraft).length === 0 && (
            <div className="text-slate-500">
              No email drafts are waiting for approval.
            </div>
          )}
        </div>
      )}

      {!loading && activeView === "analytics" && (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            [
              "Playbook conversion",
              data?.metrics.totalLeads
                ? `${((data.metrics.playbooksSent / data.metrics.totalLeads) * 100).toFixed(1)}%`
                : "0%",
            ],
            [
              "Demo completion",
              data?.metrics.totalLeads
                ? `${((data.metrics.demosWatched / data.metrics.totalLeads) * 100).toFixed(1)}%`
                : "0%",
            ],
            [
              "Audit-ready rate",
              data?.metrics.totalLeads
                ? `${((data.metrics.auditsReady / data.metrics.totalLeads) * 100).toFixed(1)}%`
                : "0%",
            ],
            [
              "Appointment rate",
              data?.metrics.totalLeads
                ? `${((data.metrics.appointments / data.metrics.totalLeads) * 100).toFixed(1)}%`
                : "0%",
            ],
          ].map(([label, value]) => (
            <Card key={label} className="bg-slate-950/40 border-white/10">
              <CardContent className="p-5">
                <div className="text-sm text-slate-500">{label}</div>
                <div className="text-3xl font-bold text-white mt-2">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLead?.company_name} — Lead Timeline
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedLead?.timeline.length ? (
              selectedLead.timeline.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-4 rounded-2xl border border-white/10 p-4"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 grid place-items-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-white">
                        {event.event_label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatEventTime(event.occurred_at)}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {event.event_detail || "Campaign activity recorded."}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500">No timeline events yet.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
