import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Eye,
  FileSearch,
  MailCheck,
  MessageSquareText,
  PlayCircle,
  Send,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
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

interface RoofingLead {
  id: string;
  company: string;
  contact: string;
  email: string;
  city: string;
  website: string;
  score: number;
  stage:
    | "new"
    | "playbook_sent"
    | "demo_watched"
    | "audit_ready"
    | "email_ready"
    | "appointment";
  nextAction: string;
  timeline: Array<{ label: string; time: string; detail: string }>;
}

const DEMO_LEADS: RoofingLead[] = [
  {
    id: "rf-101",
    company: "Westside Roofing Co.",
    contact: "Marcus Hill",
    email: "marcus@westsideroofing.com",
    city: "Los Angeles, CA",
    website: "westsideroofing.com",
    score: 64,
    stage: "email_ready",
    nextAction: "Review personalized email",
    timeline: [
      {
        label: "Lead created",
        time: "8:04 AM",
        detail: "Imported from Roofing Playbook campaign.",
      },
      {
        label: "Playbook requested",
        time: "8:07 AM",
        detail: "Free Roofing AI Growth Playbook requested.",
      },
      {
        label: "Demo watched",
        time: "8:12 AM",
        detail: "Completed the roofing growth demo.",
      },
      {
        label: "Audit completed",
        time: "8:18 AM",
        detail: "Nemotron audit scored 64/100.",
      },
      {
        label: "Email drafted",
        time: "8:20 AM",
        detail: "Draft is waiting for approval.",
      },
    ],
  },
  {
    id: "rf-102",
    company: "Sunset Roofing & Solar",
    contact: "Alicia Ramos",
    email: "alicia@sunsetroofing.com",
    city: "Long Beach, CA",
    website: "sunsetroofing.com",
    score: 52,
    stage: "audit_ready",
    nextAction: "Generate outreach draft",
    timeline: [
      {
        label: "Lead created",
        time: "9:22 AM",
        detail: "Captured from the roofing lead page.",
      },
      {
        label: "Playbook sent",
        time: "9:23 AM",
        detail: "Delivery status marked pending provider configuration.",
      },
      {
        label: "Audit completed",
        time: "9:31 AM",
        detail: "Website conversion and local visibility findings ready.",
      },
    ],
  },
  {
    id: "rf-103",
    company: "Pacific Crest Exteriors",
    contact: "Daniel Cho",
    email: "daniel@pacificcrestexteriors.com",
    city: "Pasadena, CA",
    website: "pacificcrestexteriors.com",
    score: 78,
    stage: "appointment",
    nextAction: "Prepare strategy call",
    timeline: [
      {
        label: "Lead created",
        time: "Yesterday",
        detail: "Imported from first roofing pilot list.",
      },
      {
        label: "Demo watched",
        time: "Yesterday",
        detail: "Viewed the roofing demo for 93 seconds.",
      },
      {
        label: "Audit sent",
        time: "Yesterday",
        detail: "Personalized growth audit delivered.",
      },
      {
        label: "Appointment booked",
        time: "10:00 AM",
        detail: "15-minute strategy call booked for tomorrow.",
      },
    ],
  },
];

const STAGES = [
  { key: "new", label: "New Lead", icon: Users },
  { key: "playbook_sent", label: "Playbook Sent", icon: BookOpen },
  { key: "demo_watched", label: "Demo Watched", icon: PlayCircle },
  { key: "audit_ready", label: "Audit Ready", icon: FileSearch },
  { key: "email_ready", label: "Email Ready", icon: MailCheck },
  { key: "appointment", label: "Appointment", icon: CalendarCheck },
] as const;

function stageLabel(stage: RoofingLead["stage"]): string {
  return STAGES.find((item) => item.key === stage)?.label ?? stage;
}

function scoreClass(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 55) return "text-amber-400";
  return "text-rose-400";
}

export default function RoofingCampaignCommandCenterPage() {
  const [selectedLead, setSelectedLead] = useState<RoofingLead | null>(null);
  const [activeView, setActiveView] = useState<
    "pipeline" | "leads" | "audit" | "email" | "analytics"
  >("pipeline");

  const metrics = useMemo(
    () => [
      { label: "Roofing Leads", value: "3", icon: Users },
      { label: "Playbooks Sent", value: "2", icon: BookOpen },
      { label: "Audits Ready", value: "2", icon: Bot },
      { label: "Demo Views", value: "2", icon: Eye },
      { label: "Email Drafts", value: "2", icon: Send },
      { label: "Appointments", value: "1", icon: CalendarCheck },
    ],
    [],
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20">
              Roofing Campaign #1
            </Badge>
            <Badge variant="outline">Pilot Mode</Badge>
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
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            View Activity
          </Button>
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Run Today&apos;s Growth Plan
          </Button>
        </div>
      </div>

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
              <div className="text-3xl font-bold text-white">{value}</div>
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

      {activeView === "pipeline" && (
        <Card className="bg-slate-950/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Campaign Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 xl:grid-cols-6 gap-3">
              {STAGES.map(({ key, label, icon: Icon }) => {
                const count = DEMO_LEADS.filter((lead) => lead.stage === key).length;
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

      {activeView === "leads" && (
        <Card className="bg-slate-950/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Roofing Leads</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
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
                {DEMO_LEADS.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 text-sm">
                    <td className="py-4 text-white font-semibold">{lead.company}</td>
                    <td className="py-4 text-slate-300">
                      <div>{lead.contact}</div>
                      <div className="text-xs text-slate-500">{lead.email}</div>
                    </td>
                    <td className="py-4 text-slate-400">{lead.city}</td>
                    <td className="py-4 text-blue-400">{lead.website}</td>
                    <td className={`py-4 font-semibold ${scoreClass(lead.score)}`}>
                      {lead.score}/100
                    </td>
                    <td className="py-4">
                      <Badge variant="outline">{stageLabel(lead.stage)}</Badge>
                    </td>
                    <td className="py-4 text-slate-300">{lead.nextAction}</td>
                    <td className="py-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedLead(lead)}>
                        Open Timeline
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeView === "audit" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {DEMO_LEADS.filter((lead) => ["audit_ready", "email_ready", "appointment"].includes(lead.stage)).map((lead) => (
            <Card key={lead.id} className="bg-slate-950/40 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-white">{lead.company}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{lead.website}</p>
                  </div>
                  <div className={`text-2xl font-bold ${scoreClass(lead.score)}`}>{lead.score}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 p-3">
                    <div className="text-slate-500">Conversion</div>
                    <div className="text-white font-semibold mt-1">Needs stronger CTA</div>
                  </div>
                  <div className="rounded-xl border border-white/10 p-3">
                    <div className="text-slate-500">Local Visibility</div>
                    <div className="text-white font-semibold mt-1">Opportunity identified</div>
                  </div>
                </div>
                <Button className="w-full">
                  <Bot className="w-4 h-4 mr-2" />
                  Open AI Audit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeView === "email" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {DEMO_LEADS.filter((lead) => ["email_ready", "appointment"].includes(lead.stage)).map((lead) => (
            <Card key={lead.id} className="bg-slate-950/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{lead.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-sm text-slate-300 leading-6">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Subject</div>
                  <div className="text-white font-semibold mb-4">We built this for {lead.company}</div>
                  Hi {lead.contact.split(" ")[0]}, we reviewed {lead.website} and found a few opportunities that could help you capture and follow up with more roofing leads in {lead.city}. We also prepared a quick demo showing how the system works.
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">Edit Draft</Button>
                  <Button className="flex-1">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeView === "analytics" && (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            ["Playbook conversion", "66.7%"],
            ["Demo completion", "66.7%"],
            ["Audit-ready rate", "66.7%"],
            ["Appointment rate", "33.3%"],
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

      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLead?.company} — Lead Timeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedLead?.timeline.map((event, index) => (
              <div key={`${event.label}-${index}`} className="flex gap-4 rounded-2xl border border-white/10 p-4">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-400 grid place-items-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-white">{event.label}</div>
                    <div className="text-xs text-slate-500">{event.time}</div>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{event.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
