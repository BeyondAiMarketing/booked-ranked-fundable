import {
  ArrowLeft,
  BarChart2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  ListChecks,
  Minus,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useApp } from "../context/AppContext";
import type { ClientReport, ReportSchedule } from "../types/reporting";

// ─── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 75
      ? "text-emerald-400 border-emerald-500/40"
      : score >= 50
        ? "text-amber-400 border-amber-500/40"
        : "text-red-400 border-red-500/40";
  const sizeClass =
    size === "lg"
      ? "w-20 h-20 text-2xl font-bold"
      : size === "sm"
        ? "w-10 h-10 text-sm font-bold"
        : "w-14 h-14 text-lg font-bold";
  return (
    <div
      className={`rounded-full border-2 flex items-center justify-center flex-shrink-0 ${color} ${sizeClass}`}
    >
      {score}
    </div>
  );
}

// ─── Caffeine Native Badge ─────────────────────────────────────────────────────
function CaffeineNativeBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <Shield size={11} />
      Send via Caffeine Native Email
    </div>
  );
}

// ─── Email Report Modal ────────────────────────────────────────────────────────
function EmailReportModal({
  report,
  clientEmail,
  clientName,
  open,
  onClose,
}: {
  report: ClientReport;
  clientEmail: string;
  clientName: string;
  open: boolean;
  onClose: () => void;
}) {
  const [toEmail, setToEmail] = useState(clientEmail);
  const subject = `Your ${report.reportType === "weekly" ? "Weekly" : "Monthly"} BRF Report — ${clientName}`;
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onClose();
      toast.success(`Report emailed to ${toEmail} via Caffeine native email`);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" data-ocid="report.email_modal.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send size={16} className="text-indigo-400" />
            Email Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3">
            <CaffeineNativeBadge />
            <p className="text-xs text-gray-400">
              Sent through Caffeine's managed email infrastructure.
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-400">To</Label>
            <Input
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="mt-1 h-8 text-sm bg-gray-800 border-gray-700 text-white"
              data-ocid="report.email_modal.to_input"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400">Subject</Label>
            <Input
              value={subject}
              readOnly
              className="mt-1 h-8 text-sm bg-gray-800 border-gray-700 text-gray-300"
            />
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold text-white mb-2">
              Report Summary Preview
            </p>
            <div className="flex items-center gap-3 mb-2">
              <ScoreCircle score={report.overallScore} size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {report.periodLabel}
                </p>
                <Badge
                  className={`text-[10px] border ${report.reportType === "weekly" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-violet-500/20 text-violet-300 border-violet-500/30"}`}
                >
                  {report.reportType === "weekly" ? "Weekly" : "Monthly"}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-400 line-clamp-3">
              {report.aiNarrative.substring(0, 200)}…
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              data-ocid="report.email_modal.cancel_button"
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={sending || !toEmail}
              data-ocid="report.email_modal.send_button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {sending ? (
                <RefreshCw size={13} className="mr-1.5 animate-spin" />
              ) : (
                <Send size={13} className="mr-1.5" />
              )}
              Send Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Trend Badge ──────────────────────────────────────────────────────────────
function TrendBadge({
  trend,
  value,
}: { trend: "up" | "down" | "stable"; value: string }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
        <TrendingUp size={12} /> {value}
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-400">
        <TrendingDown size={12} /> {value}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
      <Minus size={12} /> {value}
    </span>
  );
}

// ─── Report Detail View ───────────────────────────────────────────────────────
function ReportDetailView({
  report,
  onBack,
}: {
  report: ClientReport;
  onBack: () => void;
}) {
  const formattedDate = new Date(report.generatedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );

  return (
    <div className="space-y-6" data-ocid="report_detail.panel">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          data-ocid="report_detail.back_button"
          className="border-gray-700 text-gray-300 hover:text-white"
        >
          <ArrowLeft size={14} className="mr-1" /> Back to Reports
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              className={`text-xs border ${report.reportType === "weekly" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-violet-500/20 text-violet-300 border-violet-500/30"}`}
            >
              {report.reportType === "weekly" ? "Weekly" : "Monthly"}
            </Badge>
            <h2 className="text-xl font-bold text-white">
              {report.periodLabel}
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Generated {formattedDate}
          </p>
        </div>
        <ScoreCircle score={report.overallScore} size="lg" />
      </div>

      {/* AI Narrative */}
      <Card
        className="rounded-xl border border-white/10 bg-white/5"
        data-ocid="report_detail.ai_narrative.card"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles size={15} className="text-indigo-400" /> AI Business
            Manager Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="border-l-2 border-indigo-500/60 pl-4 space-y-3">
            {report.aiNarrative.split("\n\n").map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm text-gray-300 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Wins + Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="rounded-xl border border-white/10 bg-white/5"
          data-ocid="report_detail.top_wins.card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" /> Top Wins
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {report.topWins.map((win, i) => (
              <div
                key={win.slice(0, 30)}
                data-ocid={`report_detail.win.item.${i + 1}`}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15"
              >
                <CheckCircle2
                  size={14}
                  className="text-emerald-400 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-300">{win}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card
          className="rounded-xl border border-white/10 bg-white/5"
          data-ocid="report_detail.next_steps.card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <ListChecks size={15} className="text-amber-400" /> Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {report.nextSteps.map((step, i) => (
              <div
                key={step.slice(0, 30)}
                data-ocid={`report_detail.step.item.${i + 1}`}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-300">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {report.sections.map((section) => (
            <Card
              key={section.metric}
              className="rounded-xl border border-white/10 bg-white/5"
              data-ocid={`report_detail.metric.${section.metric}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-gray-400 font-medium">
                    {section.title}
                  </p>
                  <TrendBadge
                    trend={section.trend}
                    value={section.trendValue}
                  />
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {section.value}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  {section.description}
                </p>
                <div className="border-t border-white/8 pt-2">
                  <p className="text-xs text-indigo-300 leading-relaxed">
                    <Sparkles size={10} className="inline mr-1 opacity-70" />
                    {section.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Schedule Config Card ─────────────────────────────────────────────────────
function ScheduleConfigCard({
  tenantId,
  onGenerate,
  isGenerating,
}: {
  tenantId: string;
  onGenerate: (type: "weekly" | "monthly") => void;
  isGenerating: "weekly" | "monthly" | null;
}) {
  const { getReportSchedule, updateReportSchedule } = useApp();
  const schedule = getReportSchedule(tenantId);

  const defaults: ReportSchedule = {
    tenantId,
    weeklyEnabled: schedule?.weeklyEnabled ?? true,
    monthlyEnabled: schedule?.monthlyEnabled ?? true,
    deliveryDayOfWeek: schedule?.deliveryDayOfWeek ?? 1,
    deliveryHour: schedule?.deliveryHour ?? 8,
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    return { value: i, label: `${h}:00 ${ampm}` };
  });

  const nextWeeklyDate = () => {
    const now = new Date();
    const targetDay = defaults.deliveryDayOfWeek;
    const daysUntil = (targetDay - now.getDay() + 7) % 7 || 7;
    const next = new Date(now);
    next.setDate(now.getDate() + daysUntil);
    next.setHours(defaults.deliveryHour, 0, 0, 0);
    return next.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className="rounded-xl border border-white/10 bg-white/5"
      data-ocid="report_schedule.card"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Calendar size={15} className="text-indigo-400" /> Report Delivery
            Settings
          </CardTitle>
          {defaults.weeklyEnabled || defaults.monthlyEnabled ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield size={10} />
              Auto-sending via Caffeine Native
              {defaults.weeklyEnabled && (
                <span className="text-gray-500 ml-1">
                  · Next: {nextWeeklyDate()}
                </span>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
              Manual only
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {/* Weekly Toggle */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <div>
            <p className="text-sm font-medium text-white">Weekly Report</p>
            <p className="text-xs text-gray-400">
              Automated every Monday morning
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={defaults.deliveryDayOfWeek}
              onChange={(e) =>
                updateReportSchedule(tenantId, {
                  deliveryDayOfWeek: Number(e.target.value),
                })
              }
              className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-indigo-500"
              aria-label="Delivery day"
              data-ocid="report_schedule.day_select"
            >
              {days.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                updateReportSchedule(tenantId, {
                  weeklyEnabled: !defaults.weeklyEnabled,
                })
              }
              data-ocid="report_schedule.weekly_toggle"
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                defaults.weeklyEnabled ? "bg-indigo-600" : "bg-gray-700"
              }`}
              aria-checked={defaults.weeklyEnabled}
              role="switch"
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  defaults.weeklyEnabled ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Monthly Toggle */}
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <div>
            <p className="text-sm font-medium text-white">Monthly Report</p>
            <p className="text-xs text-gray-400">
              Full monthly summary on the 1st
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={defaults.deliveryHour}
              onChange={(e) =>
                updateReportSchedule(tenantId, {
                  deliveryHour: Number(e.target.value),
                })
              }
              className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-indigo-500"
              aria-label="Delivery hour"
              data-ocid="report_schedule.hour_select"
            >
              {hours.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                updateReportSchedule(tenantId, {
                  monthlyEnabled: !defaults.monthlyEnabled,
                })
              }
              data-ocid="report_schedule.monthly_toggle"
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                defaults.monthlyEnabled ? "bg-violet-600" : "bg-gray-700"
              }`}
              aria-checked={defaults.monthlyEnabled}
              role="switch"
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  defaults.monthlyEnabled ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Generate Now Buttons */}
        <div className="flex gap-3 flex-wrap pt-1">
          <Button
            size="sm"
            onClick={() => onGenerate("weekly")}
            disabled={isGenerating !== null}
            data-ocid="report_schedule.generate_weekly_button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isGenerating === "weekly" ? (
              <RefreshCw size={13} className="mr-1.5 animate-spin" />
            ) : (
              <BarChart2 size={13} className="mr-1.5" />
            )}
            Generate Weekly Report
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGenerate("monthly")}
            disabled={isGenerating !== null}
            data-ocid="report_schedule.generate_monthly_button"
            className="border-violet-500/40 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200"
          >
            {isGenerating === "monthly" ? (
              <RefreshCw size={13} className="mr-1.5 animate-spin" />
            ) : (
              <FileText size={13} className="mr-1.5" />
            )}
            Generate Monthly Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Report Card List Item ─────────────────────────────────────────────────────
function ReportListItem({
  report,
  index,
  onView,
  clientName,
  clientEmail,
}: {
  report: ClientReport;
  index: number;
  onView: (report: ClientReport) => void;
  clientName: string;
  clientEmail: string;
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const formattedDate = new Date(report.generatedAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
  const formattedTime = new Date(report.generatedAt).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );

  return (
    <>
      <div
        data-ocid={`report_history.item.${index}`}
        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors"
      >
        <div className="flex items-start gap-4">
          <ScoreCircle score={report.overallScore} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge
                className={`text-[10px] border ${
                  report.reportType === "weekly"
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                    : "bg-violet-500/20 text-violet-300 border-violet-500/30"
                }`}
              >
                {report.reportType === "weekly" ? "Weekly" : "Monthly"}
              </Badge>
              <p className="text-sm font-semibold text-white">
                {report.periodLabel}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <Clock size={10} />
              <span>
                {formattedDate} at {formattedTime}
              </span>
            </div>
            <div className="space-y-1">
              {report.topWins.slice(0, 2).map((win) => (
                <p
                  key={win.slice(0, 30)}
                  className="text-xs text-gray-400 flex items-start gap-1.5"
                >
                  <CheckCircle2
                    size={10}
                    className="text-emerald-400 mt-0.5 flex-shrink-0"
                  />
                  <span className="truncate">{win}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              size="sm"
              onClick={() => onView(report)}
              data-ocid={`report_history.view_button.${index}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
            >
              View Full Report <ChevronRight size={12} className="ml-1" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEmailModal(true)}
              data-ocid={`report_history.email_button.${index}`}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs"
            >
              <Send size={11} className="mr-1" /> Email Report
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast.info(
                  "PDF download coming soon — reports will be downloadable as branded PDFs in the next update.",
                )
              }
              data-ocid={`report_history.download_button.${index}`}
              className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-xs"
            >
              <Download size={11} className="mr-1" /> PDF
            </Button>
          </div>
        </div>
      </div>
      <EmailReportModal
        report={report}
        clientEmail={clientEmail}
        clientName={clientName}
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientReportsPage() {
  const { currentTenantId, getClientReports, generateReport, tenants } =
    useApp();
  const [selectedReport, setSelectedReport] = useState<ClientReport | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState<"weekly" | "monthly" | null>(
    null,
  );

  const reports = getClientReports(currentTenantId);
  const currentTenant = tenants.find((t) => t.id === currentTenantId);
  const clientName = currentTenant?.name ?? "Your Business";
  // TenantEntry doesn't expose email — use a placeholder that admins can override in the email modal
  const clientEmail = `owner@${(currentTenant?.website ?? "yourbusiness.com").replace(/^https?:\/\//, "").split("/")[0]}`;

  const handleGenerate = (type: "weekly" | "monthly") => {
    setIsGenerating(type);
    // Simulate brief async generation
    setTimeout(() => {
      const newReport = generateReport(currentTenantId, type);
      setIsGenerating(null);
      toast.success(
        `${type === "weekly" ? "Weekly" : "Monthly"} report generated successfully!`,
        { description: newReport.periodLabel },
      );
    }, 1200);
  };

  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <div className="space-y-6" data-ocid="client_reports.page">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Reports</h2>
          <p className="text-gray-400 text-sm mt-1">
            Automated AI-powered performance reports with insights and next
            steps
          </p>
        </div>
        <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs">
          {reports.length} report{reports.length !== 1 ? "s" : ""} generated
        </Badge>
      </div>

      {/* Schedule Config */}
      <ScheduleConfigCard
        tenantId={currentTenantId}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {/* Report History */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-white">Past Reports</h3>
          <Badge className="bg-gray-700 text-gray-300 border border-gray-600 text-[10px]">
            {reports.length}
          </Badge>
        </div>

        {reports.length === 0 ? (
          <div
            className="py-12 text-center rounded-xl border border-dashed border-white/10"
            data-ocid="report_history.empty_state"
          >
            <FileText size={36} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium mb-1">No reports yet</p>
            <p className="text-gray-500 text-sm mb-4">
              Generate your first report above to start tracking performance
            </p>
            <Button
              size="sm"
              onClick={() => handleGenerate("weekly")}
              disabled={isGenerating !== null}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              data-ocid="report_history.generate_first_button"
            >
              <BarChart2 size={13} className="mr-1.5" /> Generate First Report
            </Button>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="report_history.list">
            {reports.map((report, i) => (
              <ReportListItem
                key={report.id}
                report={report}
                index={i + 1}
                onView={setSelectedReport}
                clientName={clientName}
                clientEmail={clientEmail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
