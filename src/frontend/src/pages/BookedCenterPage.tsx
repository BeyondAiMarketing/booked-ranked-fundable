import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";

const PIPELINE_STAGES = [
  {
    key: "new_lead",
    label: "New Lead",
    color: "bg-[#00BFFF]/15 text-[#00BFFF] border-[#00BFFF]/30",
  },
  {
    key: "contact_attempted",
    label: "Contact Attempted",
    color: "bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/30",
  },
  {
    key: "appointment_scheduled",
    label: "Appointment Scheduled",
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    key: "discovery_completed",
    label: "Discovery Completed",
    color: "bg-[#00BFFF]/15 text-[#00BFFF] border-[#00BFFF]/30",
  },
  {
    key: "proposal_sent",
    label: "Proposal Sent",
    color: "bg-[#FFD700]/15 text-[#FFD700] border-[#FFD700]/30",
  },
  {
    key: "financing_pending",
    label: "Financing Pending",
    color: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    key: "follow_up_needed",
    label: "Follow-Up Needed",
    color: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  {
    key: "won",
    label: "Won",
    color: "bg-emerald-500/25 text-emerald-200 border-emerald-500/40",
  },
  {
    key: "lost",
    label: "Lost",
    color: "bg-white/5 text-white/50 border-white/10",
  },
  {
    key: "nurture",
    label: "Nurture",
    color: "bg-[#00BFFF]/15 text-[#00BFFF] border-[#00BFFF]/30",
  },
];

const DEMO_LEADS = [
  {
    id: "l1",
    name: "Sarah Johnson",
    stage: "appointment_scheduled",
    source: "Website",
    value: 12500,
  },
  {
    id: "l2",
    name: "Mike Chen",
    stage: "proposal_sent",
    source: "Referral",
    value: 8400,
  },
  {
    id: "l3",
    name: "David Park",
    stage: "new_lead",
    source: "Google Ads",
    value: 6200,
  },
  {
    id: "l4",
    name: "Lisa Martinez",
    stage: "follow_up_needed",
    source: "Facebook",
    value: 15000,
  },
  {
    id: "l5",
    name: "Tom Wilson",
    stage: "won",
    source: "Cold Call",
    value: 9800,
  },
];

export default function BookedCenterPage() {
  const { isDemoMode: _isDemoMode } = useApp();
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stageCounts = PIPELINE_STAGES.map((s) => ({
    ...s,
    count: DEMO_LEADS.filter((l) => l.stage === s.key).length,
  }));

  const filteredLeads = selectedStage
    ? DEMO_LEADS.filter((l) => l.stage === selectedStage)
    : DEMO_LEADS;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Booked Center</h1>
          <p className="text-sm text-white/70">
            Lead capture, pipeline, and follow-up
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/campaigns" })}
            data-ocid="booked.campaigns.button"
            className="rounded-xl border-[#00BFFF]/30 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:scale-105 transition-all duration-200"
          >
            <Send size={14} className="mr-1.5" />
            Campaigns
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/appointments" })}
            data-ocid="booked.appointments.button"
            className="rounded-xl border-[#00BFFF]/30 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:scale-105 transition-all duration-200"
          >
            <Calendar size={14} className="mr-1.5" />
            Appointments
          </Button>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {stageCounts.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() =>
              setSelectedStage(selectedStage === s.key ? null : s.key)
            }
            data-ocid={`booked.stage.${s.key}.button`}
            className={`rounded-2xl border px-2 py-3 text-center backdrop-blur-xl transition-all duration-200 hover:scale-105 ${s.color} ${
              selectedStage === s.key
                ? "ring-2 ring-[#FFD700]/40 shadow-lg shadow-[#FFD700]/10"
                : "hover:bg-white/10"
            }`}
          >
            <div className="text-lg font-bold">{s.count}</div>
            <div className="text-[10px] uppercase tracking-wider mt-0.5 text-white/70">
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Lead Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => {
          const stage = PIPELINE_STAGES.find((s) => s.key === lead.stage);
          return (
            <Card
              key={lead.id}
              className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-[#FFD700]/30 hover:shadow-lg hover:shadow-[#FFD700]/5 rounded-2xl transition-all duration-200"
              data-ocid={`booked.lead.${lead.id}.card`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-white/90">
                    {lead.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] rounded-full px-3 py-1 font-medium ${stage?.color ?? ""}`}
                  >
                    {stage?.label ?? lead.stage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {lead.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} />${lead.value.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-xl text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:scale-105 transition-all duration-200"
                    data-ocid={`booked.lead.${lead.id}.call.button`}
                  >
                    <Phone size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-xl text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:scale-105 transition-all duration-200"
                    data-ocid={`booked.lead.${lead.id}.sms.button`}
                  >
                    <MessageSquare size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-xl text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:scale-105 transition-all duration-200"
                    data-ocid={`booked.lead.${lead.id}.email.button`}
                  >
                    <Mail size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12" data-ocid="booked.leads.empty_state">
          <Users size={32} className="mx-auto text-white/20 mb-3" />
          <p className="text-white/50 text-sm">No leads in this stage.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00BFFF]/15 flex items-center justify-center">
              <Clock size={18} className="text-[#00BFFF]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">
                Missed Call Recovery
              </p>
              <p className="text-xs text-white/50">Auto-SMS on missed calls</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">
                Proposal Follow-Up
              </p>
              <p className="text-xs text-white/50">
                Sequence after proposal sent
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/15 flex items-center justify-center">
              <Send size={18} className="text-[#FFD700]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/90">Reactivation</p>
              <p className="text-xs text-white/50">Wake up old leads</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
