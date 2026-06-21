import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Bot,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Mail,
  MessageSquare,
  XCircle,
} from "lucide-react";

const LOGS = [
  {
    id: "w1",
    agent: "GBP Post Agent",
    action: "Created draft post",
    objectType: "GBPPostDraft",
    objectId: "gp1",
    status: "success",
    timestamp: "2026-06-20T10:00:00Z",
    sessionLog:
      "Draft created for Spring Roof Inspection Special. Awaiting approval.",
  },
  {
    id: "w2",
    agent: "Review Management Agent",
    action: "Drafted reply",
    objectType: "ReviewReplyDraft",
    objectId: "rr1",
    status: "success",
    timestamp: "2026-06-20T09:30:00Z",
    sessionLog:
      "Reply drafted for Angela M. 3-star review. Escalated to approval queue.",
  },
  {
    id: "w3",
    agent: "Campaign Builder Agent",
    action: "Created email sequence",
    objectType: "Campaign",
    objectId: "c1",
    status: "pending",
    timestamp: "2026-06-20T08:00:00Z",
    sessionLog:
      "Reactivation Q2 sequence built. 4 emails, 7-day spacing. Awaiting approval.",
  },
  {
    id: "w4",
    agent: "Local SEO Audit Agent",
    action: "Completed audit",
    objectType: "LocalSEOAudit",
    objectId: "la1",
    status: "success",
    timestamp: "2026-06-19T14:00:00Z",
    sessionLog:
      "Audit complete. Overall score 68. Critical: citation gaps. Important: review velocity.",
  },
  {
    id: "w5",
    agent: "n8n Webhook",
    action: "Published GBP post",
    objectType: "GBPPostDraft",
    objectId: "gp0",
    status: "success",
    timestamp: "2026-06-19T09:00:00Z",
    sessionLog: "Post published via n8n. URL returned and saved.",
  },
  {
    id: "w6",
    agent: "n8n Webhook",
    action: "SendGrid send failed",
    objectType: "Campaign",
    objectId: "c0",
    status: "failed",
    timestamp: "2026-06-18T16:00:00Z",
    sessionLog:
      "SendGrid returned 422. Invalid template variable. Retry scheduled.",
  },
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  success: <CheckCircle size={14} style={{ color: "#00BFFF" }} />,
  failed: <XCircle size={14} className="text-rose-400" />,
  pending: <Clock size={14} style={{ color: "#FFD700" }} />,
};

const STATUS_COLORS: Record<string, string> = {
  success: "bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/30",
  failed: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  pending: "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30",
};

const OBJECT_ICONS: Record<string, React.ReactNode> = {
  GBPPostDraft: <FileText size={14} style={{ color: "#00BFFF" }} />,
  ReviewReplyDraft: <MessageSquare size={14} style={{ color: "#FFD700" }} />,
  Campaign: <Mail size={14} style={{ color: "#00BFFF" }} />,
  LocalSEOAudit: <Globe size={14} style={{ color: "#00BFFF" }} />,
};

export default function WorkflowLogsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Workflow Logs</h1>
        <p className="text-sm text-white/60">
          Every agent action, n8n call, and external result
        </p>
      </div>

      <div className="space-y-4">
        {LOGS.map((log, index) => (
          <Card
            key={log.id}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-200"
            data-ocid={`workflow.log.${index + 1}.card`}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  {STATUS_ICONS[log.status] ?? (
                    <Activity size={14} className="text-white/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Bot size={14} style={{ color: "#00BFFF" }} />
                      <span className="text-sm font-semibold text-white/90 truncate">
                        {log.agent}
                      </span>
                      <span className="text-xs text-white/40 flex-shrink-0">
                        • {log.action}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] rounded-full px-3 py-1 font-medium ${STATUS_COLORS[log.status]}`}
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    {OBJECT_ICONS[log.objectType] ?? (
                      <FileText size={12} className="text-white/30" />
                    )}
                    <span>{log.objectType}</span>
                    <span className="text-white/30">•</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-white/70 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 leading-relaxed">
                    {log.sessionLog}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
