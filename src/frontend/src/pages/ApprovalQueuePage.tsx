import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const APPROVAL_ITEMS = [
  {
    id: "a1",
    title: "GBP Post: Spring Roof Inspection Special",
    type: "gbp_post",
    tier: "Tier 2",
    risk: "low",
    status: "pending_approval",
    requestedBy: "GBP Post Agent",
    requestedAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "a2",
    title: "Review Reply: Angela M. (3-star)",
    type: "review_reply",
    tier: "Tier 2",
    risk: "medium",
    status: "pending_approval",
    requestedBy: "Review Management Agent",
    requestedAt: "2026-06-20T09:30:00Z",
  },
  {
    id: "a3",
    title: "Cold Email Sequence: Reactivation Q2",
    type: "email_campaign",
    tier: "Tier 3",
    risk: "high",
    status: "pending_approval",
    requestedBy: "Campaign Builder Agent",
    requestedAt: "2026-06-20T08:00:00Z",
  },
  {
    id: "a4",
    title: "Monthly Local SEO Report",
    type: "report",
    tier: "Tier 1",
    risk: "low",
    status: "approved",
    requestedBy: "Local Reporting Agent",
    requestedAt: "2026-06-19T14:00:00Z",
  },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  gbp_post: <FileText size={14} className="text-blue-400" />,
  review_reply: <MessageSquare size={14} className="text-amber-400" />,
  email_campaign: <Mail size={14} className="text-violet-400" />,
  sms_campaign: <Send size={14} className="text-emerald-400" />,
  report: <Clock size={14} className="text-slate-400" />,
};

export default function ApprovalQueuePage() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const filtered = APPROVAL_ITEMS.filter((a) =>
    filter === "all"
      ? true
      : a.status === `${filter}_approval` || a.status === filter,
  );

  const getRiskColor = (risk: string) => {
    if (risk === "low")
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (risk === "medium")
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-rose-500/20 text-rose-300 border-rose-500/30";
  };

  const getStatusColor = (status: string) => {
    if (status === "approved")
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (status === "rejected")
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Approval Queue</h1>
          <p className="text-sm text-white/70">
            Review and approve external actions before they go live
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-[#FFD700]" />
          <span className="text-sm text-[#FFD700] font-medium">
            {
              APPROVAL_ITEMS.filter((a) => a.status === "pending_approval")
                .length
            }{" "}
            pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            data-ocid={`approval.filter.${f}.button`}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
              filter === f
                ? "bg-[#00BFFF]/15 text-[#00BFFF] border border-[#00BFFF]/30 shadow-lg shadow-[#00BFFF]/10"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-2xl transition-all duration-200"
            data-ocid={`approval.item.${item.id}.card`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {TYPE_ICONS[item.type] ?? (
                      <FileText size={14} className="text-white/50" />
                    )}
                    <span className="text-sm font-medium text-white/90">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span>{item.requestedBy}</span>
                    <span>•</span>
                    <span>{item.tier}</span>
                    <span>•</span>
                    <span>
                      {new Date(item.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-[10px] rounded-full px-3 py-1 font-medium ${getRiskColor(item.risk)}`}
                  >
                    {item.risk} risk
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] rounded-full px-3 py-1 font-medium ${getStatusColor(item.status)}`}
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {item.status === "pending_approval" && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs rounded-xl bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 hover:scale-105 transition-all duration-200"
                    data-ocid={`approval.item.${item.id}.approve.button`}
                  >
                    <CheckCircle size={12} className="mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs rounded-xl bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20 hover:scale-105 transition-all duration-200"
                    data-ocid={`approval.item.${item.id}.reject.button`}
                  >
                    <XCircle size={12} className="mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all duration-200"
                    data-ocid={`approval.item.${item.id}.edit.button`}
                  >
                    Request Edits
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12" data-ocid="approval.empty_state">
            <CheckCircle size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-white/50 text-sm">No items in this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
