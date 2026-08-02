import { createActor } from "@/backend";
import { processCSVImport } from "@/utils/csvLeadImport";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Database,
  FileText,
  Mail,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useState, useCallback } from "react";
import EmailTemplateEditor from "../components/EmailTemplateEditor";

const EMAIL_LABELS = [
  "", // index 0 unused
  "The Audit Reveal",
  "The Explanation",
  "The Cost",
  "The Solution",
  "The Proof",
  "The Offer",
  "Last Call",
];

function formatTs(ts?: bigint): string {
  if (!ts) return "Never";
  return new Date(Number(ts) / 1_000_000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    paused: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    unsubscribed: "bg-red-500/20 text-red-300 border-red-500/30",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status] ?? styles.paused}`}
    >
      {status}
    </span>
  );
}

interface LeadCampaignDetail {
  leadEmail: string;
  auditScore: number;
  currentEmailDay: number;
  usedFallback: boolean;
  lastSentAt?: bigint;
  templateVersion: string;
}

export default function RoofingCampaignManager() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [toast, setToast] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualState, setManualState] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "templates" | "import"
  >("overview");
  const [importSubTab, setImportSubTab] = useState<
    "upload" | "crm" | "lake" | "recover"
  >("upload");
  const [_csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<
    Array<{
      companyName: string;
      email?: string;
      phone?: string;
      city: string;
      state: string;
      status: string;
    }>
  >([]);
  const [importSummary, setImportSummary] = useState<{
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    alreadyEnrolled: number;
    ready: number;
  } | null>(null);
  const [showEnrollConfirm, setShowEnrollConfirm] = useState(false);
  const [enrollCount, setEnrollCount] = useState(0);
  const [showStartModal, setShowStartModal] = useState(false);
  const [campaignRunning, setCampaignRunning] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }, []);

  const statsQuery = useQuery({
    queryKey: ["campaignStats"],
    queryFn: () => actor!.getCampaignStats(),
    enabled: !!actor,
    refetchInterval: 30_000,
  });

  const leadsQuery = useQuery({
    queryKey: ["enrolledLeads"],
    queryFn: () => actor!.getAllEnrolledLeads(),
    enabled: !!actor,
    refetchInterval: 30_000,
  });

  const pauseMutation = useMutation({
    mutationFn: () =>
      isPaused
        ? (actor as unknown as {
            resumeRoofingCampaign: () => Promise<unknown>;
          })!.resumeRoofingCampaign()
        : (actor as unknown as {
            pauseRoofingCampaign: () => Promise<unknown>;
          })!.pauseRoofingCampaign(),
    onSuccess: () => {
      setIsPaused((v) => !v);
      showToast(isPaused ? "Campaign resumed." : "Campaign paused.");
    },
  });

  const startCampaignMutation = useMutation({
    mutationFn: () =>
      (actor as unknown as {
        startRoofingCampaign: () => Promise<unknown>;
      })!.startRoofingCampaign(),
    onSuccess: () => {
      setCampaignRunning(true);
      setShowStartModal(false);
      showToast("Campaign started! Emails will begin firing.");
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
    },
    onError: () => {
      setShowStartModal(false);
      showToast("Failed to start campaign. Check your configuration.");
    },
  });

  const enrollAllMutation = useMutation({
    mutationFn: () => actor!.enrollRoofingLeadsIntoCampaign(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["enrolledLeads"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
      const r = result as { enrolled: bigint; skipped: bigint };
      showToast(`Enrolled ${r.enrolled} leads. ${r.skipped} already enrolled.`);
    },
  });

  const enrollOneMutation = useMutation({
    mutationFn: () =>
      (actor as unknown as {
        enrollRoofingLead: (lead: {
          email: string;
          companyName: string;
          city: string;
          state: string;
          businessType: string;
          website: never[];
          phone: never[];
        }) => Promise<unknown>;
      })!.enrollRoofingLead({
        email: manualEmail,
        companyName: manualCompany,
        city: manualCity,
        state: manualState,
        businessType: "roofing",
        website: [],
        phone: [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolledLeads"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
      showToast(`${manualCompany} enrolled in campaign.`);
      setManualEmail("");
      setManualCompany("");
      setManualCity("");
      setManualState("");
    },
    onError: () =>
      showToast("Failed to enroll lead. Check the details and try again."),
  });

  const leadDetailsQuery = useQuery({
    queryKey: ["leadCampaignDetails"],
    queryFn: async (): Promise<LeadCampaignDetail[]> => {
      if (!actor) return [];
      try {
        return await (
          actor as unknown as {
            getAllLeadCampaignDetails: () => Promise<LeadCampaignDetail[]>;
          }
        ).getAllLeadCampaignDetails();
      } catch {
        return [];
      }
    },
    enabled: !!actor,
    refetchInterval: 30_000,
  });

  const handleCsvFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      if (!text.trim()) return;
      const _batchId = Date.now().toString();
      const result = processCSVImport(text);
      const leads = (result.leads ?? []).map((l: any) => ({
        companyName: l.companyName || l.businessName || "",
        email: l.email || l["E-Mail"] || l["Email Address"] || "",
        phone: l.phone || l["Phone Number"] || "",
        city: l.city || "",
        state: l.state || "",
        status: l.status || "new",
      }));
      setCsvPreview(leads);
      setImportSummary({
        total: result.stats?.total ?? 0,
        valid: result.leads?.length ?? 0,
        invalid: 0,
        duplicates: 0,
        alreadyEnrolled: 0,
        ready: result.leads?.length ?? 0,
      });
    };
    reader.readAsText(file);
  };

  const reEnrollMutation = useMutation({
    mutationFn: (email: string) => actor!.reEnrollLead(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolledLeads"] });
      showToast("Lead re-enrolled in campaign.");
    },
  });

  const stats = statsQuery.data as
    | {
        totalEnrolled: bigint;
        emailsSentToday: bigint;
        emailsSentWeek: bigint;
        emailsSentAllTime: bigint;
        openRate: number;
        clickRate: number;
      }
    | undefined;
  const leads = (leadsQuery.data ?? []) as Array<{
    leadEmail: string;
    companyName: string;
    city: string;
    state: string;
    currentStep: bigint;
    enrolledAt: bigint;
    lastSentAt?: bigint;
    lastOpenedAt?: bigint;
    status: string;
  }>;
  const leadDetails: LeadCampaignDetail[] =
    (leadDetailsQuery.data as LeadCampaignDetail[] | undefined) ?? [];
  const detailsMap = new Map<string, LeadCampaignDetail>(
    leadDetails.map((d) => [d.leadEmail, d]),
  );

  function AuditScoreBadge({ score }: { score: number | null }) {
    if (score === null)
      return <span className="text-slate-600 text-xs">—</span>;
    const color =
      score >= 70
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        : score >= 40
          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
          : "bg-red-500/10 border-red-500/20 text-red-400";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`}
      >
        {score}/100
      </span>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Roofing Outreach Campaign
          </h1>
          <p className="text-slate-400 mt-1">
            7-email sequence &bull; Local ranking audit hook &bull; OmniRouter AI
            copy
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab switcher */}
          <div className="flex items-center bg-slate-900/60 border border-white/10 rounded-xl p-1">
            <button
              data-ocid="campaign.tab.overview"
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              Campaign Overview
            </button>
            <button
              data-ocid="campaign.tab.templates"
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "templates"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              Email Templates
            </button>
            <button
              data-ocid="campaign.tab.import"
              type="button"
              onClick={() => setActiveTab("import")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "import"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              Import Leads
            </button>
          </div>
          <button
            data-ocid="campaign.refresh_button"
            type="button"
            onClick={() => {
              statsQuery.refetch();
              leadsQuery.refetch();
              leadDetailsQuery.refetch();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-sm text-slate-300 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <>
          {/* Stats bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Users,
                label: "Total Enrolled",
                value: stats ? String(stats.totalEnrolled) : "\u2014",
              },
              {
                icon: Mail,
                label: "Sent Today",
                value: stats ? String(stats.emailsSentToday) : "\u2014",
              },
              {
                icon: Mail,
                label: "Sent This Week",
                value: stats ? String(stats.emailsSentWeek) : "\u2014",
              },
              {
                icon: TrendingUp,
                label: "Open / Click Rate",
                value: stats
                  ? `${(stats.openRate * 100).toFixed(1)}% / ${(stats.clickRate * 100).toFixed(1)}%`
                  : "\u2014",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                data-ocid={`campaign.stat.${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
                <span className="text-2xl font-bold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <button
              data-ocid="campaign.pause_toggle"
              type="button"
              onClick={() => pauseMutation.mutate()}
              disabled={pauseMutation.isPending}
              className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition-colors disabled:opacity-60 ${isPaused ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"}`}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4" /> Resume Campaign
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" /> Pause Campaign
                </>
              )}
            </button>
            <button
              data-ocid="campaign.enroll_all_button"
              type="button"
              onClick={() => enrollAllMutation.mutate()}
              disabled={enrollAllMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4" />
              {enrollAllMutation.isPending
                ? "Enrolling..."
                : "Enroll All Roofing Leads"}
            </button>
            <button
              data-ocid="campaign.start_campaign_button"
              type="button"
              onClick={() => {
                const total = stats ? Number(stats.totalEnrolled) : 0;
                if (total === 0) {
                  showToast(
                    "No leads are enrolled yet. Upload a CSV, pull from CRM, recover existing leads, or manually enroll a lead first.",
                  );
                  return;
                }
                setShowStartModal(true);
              }}
              disabled={campaignRunning || startCampaignMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {campaignRunning
                ? "Campaign Running"
                : startCampaignMutation.isPending
                  ? "Starting..."
                  : "Start Campaign"}
            </button>
          </div>

          {/* Start Campaign Confirmation Modal */}
          {showStartModal && (
            <div
              data-ocid="campaign.start_modal"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <h2 className="text-lg font-bold text-white mb-2">
                  Start Roofing Campaign?
                </h2>
                <p className="text-sm text-slate-400 mb-1">
                  This will begin firing the 7-email sequence to all enrolled
                  leads.
                </p>
                {stats && (
                  <p className="text-sm text-emerald-400 font-medium mb-4">
                    {String(stats.totalEnrolled)} leads ready to receive emails.
                  </p>
                )}
                <div className="flex gap-3 justify-end">
                  <button
                    data-ocid="campaign.start_modal.cancel_button"
                    type="button"
                    onClick={() => setShowStartModal(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    data-ocid="campaign.start_modal.confirm_button"
                    type="button"
                    onClick={() => startCampaignMutation.mutate()}
                    disabled={startCampaignMutation.isPending}
                    className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-60"
                  >
                    {startCampaignMutation.isPending
                      ? "Starting..."
                      : "Confirm & Start"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manual enroll */}
          <div className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-5">
            <h2 className="text-base font-semibold text-white mb-4">
              Enroll Lead Manually
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              {[
                {
                  placeholder: "Email address *",
                  value: manualEmail,
                  setter: setManualEmail,
                  ocid: "campaign.manual_email_input",
                },
                {
                  placeholder: "Company name *",
                  value: manualCompany,
                  setter: setManualCompany,
                  ocid: "campaign.manual_company_input",
                },
                {
                  placeholder: "City *",
                  value: manualCity,
                  setter: setManualCity,
                  ocid: "campaign.manual_city_input",
                },
                {
                  placeholder: "State (e.g. TX) *",
                  value: manualState,
                  setter: setManualState,
                  ocid: "campaign.manual_state_input",
                },
              ].map(({ placeholder, value, setter, ocid }) => (
                <input
                  key={placeholder}
                  data-ocid={ocid}
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                />
              ))}
            </div>
            <button
              data-ocid="campaign.manual_enroll_button"
              type="button"
              onClick={() => enrollOneMutation.mutate()}
              disabled={
                enrollOneMutation.isPending ||
                !manualEmail ||
                !manualCompany ||
                !manualCity ||
                !manualState
              }
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {enrollOneMutation.isPending ? "Enrolling..." : "Enroll Lead"}
            </button>
          </div>

          {/* Per-lead table */}
          <div
            data-ocid="campaign.leads_table"
            className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-base font-semibold text-white">
                Enrolled Leads ({leads.length})
              </h2>
            </div>
            {leads.length === 0 ? (
              <div
                data-ocid="campaign.empty_state"
                className="p-10 text-center"
              >
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">
                  No leads enrolled yet. Click \u201cEnroll All Roofing
                  Leads\u201d to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 text-xs border-b border-white/5">
                      {[
                        "Email",
                        "Company",
                        "City",
                        "Audit Score",
                        "Email Day",
                        "Step",
                        "Last Sent",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, idx) => {
                      const step = Number(lead.currentStep);
                      const stepLabel =
                        step >= 1 && step <= 7
                          ? `Email ${step} of 7 \u2014 ${EMAIL_LABELS[step] ?? ""}`
                          : step > 7
                            ? "Completed"
                            : "Pending";
                      const detail = detailsMap.get(lead.leadEmail);
                      const auditScore = detail?.auditScore ?? null;
                      const emailDay = detail?.currentEmailDay ?? step;
                      const usedFallback = detail?.usedFallback ?? false;
                      return (
                        <tr
                          key={lead.leadEmail}
                          data-ocid={`campaign.item.${idx + 1}`}
                          className="border-b border-white/5 hover:bg-slate-800/30"
                        >
                          <td className="px-4 py-3 text-slate-300 max-w-32 truncate">
                            {lead.leadEmail}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {lead.companyName}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {lead.city}
                          </td>
                          {/* Audit Score */}
                          <td className="px-4 py-3">
                            <AuditScoreBadge score={auditScore} />
                          </td>
                          {/* Email Day + Fallback badge */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                data-ocid={`campaign.email_day.${idx + 1}`}
                                className="text-slate-300 text-xs font-medium"
                              >
                                {emailDay > 0 && emailDay <= 7
                                  ? `Day ${emailDay} of 7`
                                  : emailDay > 7
                                    ? "Done"
                                    : "Pending"}
                              </span>
                              {usedFallback && (
                                <span
                                  data-ocid={`campaign.fallback_badge.${idx + 1}`}
                                  className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                >
                                  Fallback
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300 text-xs">
                            {stepLabel}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                            {formatTs(lead.lastSentAt)}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={lead.status} />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              data-ocid={`campaign.reenroll_button.${idx + 1}`}
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Re-enroll ${lead.companyName} (${lead.leadEmail}) in the campaign from the beginning?`,
                                  )
                                ) {
                                  reEnrollMutation.mutate(lead.leadEmail);
                                }
                              }}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors"
                            >
                              Re-enroll
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── TEMPLATES TAB ── */}
      {activeTab === "templates" && <EmailTemplateEditor />}

      {/* ── IMPORT LEADS TAB ── */}
      {activeTab === "import" && (
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-1">
              Import / Push Roofing Leads
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Upload a CSV, pull from CRM, or recover previously uploaded
              roofing leads.
            </p>

            {/* Inner tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
              {[
                { key: "upload", label: "Upload CSV", icon: Upload },
                { key: "crm", label: "Pull From CRM", icon: Database },
                {
                  key: "lake",
                  label: "Pull From Open Lead Lake",
                  icon: Search,
                },
                {
                  key: "recover",
                  label: "Recover Existing Leads",
                  icon: RotateCcw,
                },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  data-ocid={`campaign.import_tab.${key}`}
                  type="button"
                  onClick={() => setImportSubTab(key as typeof importSubTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    importSubTab === key
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* UPLOAD CSV */}
            {importSubTab === "upload" && (
              <div className="space-y-4">
                <button
                  type="button"
                  className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-blue-500/40 transition-colors cursor-pointer w-full"
                  onClick={() => document.getElementById("csv-upload")?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleCsvFile(file);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      document.getElementById("csv-upload")?.click();
                    }
                  }}
                >
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-medium">
                    Drop a CSV file here or click to upload
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Accepted: .csv</p>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCsvFile(file);
                    }}
                  />
                </button>

                {csvPreview.length > 0 && (
                  <>
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-slate-500 text-xs border-b border-white/5 bg-slate-800/40">
                            {[
                              "Company Name",
                              "Email",
                              "Phone",
                              "City",
                              "State",
                              "Status",
                            ].map((h) => (
                              <th
                                key={h}
                                className="px-4 py-2.5 text-left font-medium"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.map((row, idx) => (
                            <tr
                              key={row.email || row.companyName || idx}
                              className="border-b border-white/5 hover:bg-slate-800/30"
                            >
                              <td className="px-4 py-2 text-slate-300">
                                {row.companyName}
                              </td>
                              <td className="px-4 py-2 text-slate-400">
                                {row.email ?? "—"}
                              </td>
                              <td className="px-4 py-2 text-slate-400">
                                {row.phone ?? "—"}
                              </td>
                              <td className="px-4 py-2 text-slate-400">
                                {row.city}
                              </td>
                              <td className="px-4 py-2 text-slate-400">
                                {row.state}
                              </td>
                              <td className="px-4 py-2">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                                    row.status === "Valid"
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                      : row.status === "Duplicate"
                                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {importSummary && (
                      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                          { label: "Total Rows", value: importSummary.total },
                          { label: "Valid", value: importSummary.valid },
                          {
                            label: "Invalid",
                            value: importSummary.invalid,
                          },
                          {
                            label: "Duplicates",
                            value: importSummary.duplicates,
                          },
                          {
                            label: "Already Enrolled",
                            value: importSummary.alreadyEnrolled,
                          },
                          {
                            label: "Ready to Import",
                            value: importSummary.ready,
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="bg-slate-800/40 border border-white/10 rounded-lg p-3 text-center"
                          >
                            <div className="text-lg font-bold text-white">
                              {value}
                            </div>
                            <div className="text-xs text-slate-400">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <button
                        data-ocid="campaign.import_valid_button"
                        type="button"
                        onClick={async () => {
                          const valid = csvPreview.filter(
                            (r) => r.status === "Valid",
                          );
                          if (valid.length === 0) {
                            showToast("No valid leads found.");
                            return;
                          }
                          // Enroll valid leads
                          for (const lead of valid) {
                            await (
                              actor as unknown as {
                                enrollRoofingLead: (l: {
                                  email: string;
                                  companyName: string;
                                  city: string;
                                  state: string;
                                  businessType: string;
                                  website: never[];
                                  phone: never[];
                                }) => Promise<unknown>;
                              }
                            )?.enrollRoofingLead({
                              email: lead.email ?? "",
                              companyName: lead.companyName,
                              city: lead.city,
                              state: lead.state,
                              businessType: "roofing",
                              website: [],
                              phone: [],
                            });
                          }
                          showToast(`${valid.length} leads imported.`);
                          queryClient.invalidateQueries({
                            queryKey: ["enrolledLeads"],
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["campaignStats"],
                          });
                          setCsvPreview([]);
                          setImportSummary(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Import Valid Leads
                      </button>
                      <button
                        data-ocid="campaign.import_enroll_all_button"
                        type="button"
                        onClick={async () => {
                          const valid = csvPreview.filter(
                            (r) => r.status === "Valid",
                          );
                          if (valid.length === 0) {
                            showToast("No valid leads found.");
                            return;
                          }
                          for (const lead of valid) {
                            await (
                              actor as unknown as {
                                enrollRoofingLead: (l: {
                                  email: string;
                                  companyName: string;
                                  city: string;
                                  state: string;
                                  businessType: string;
                                  website: never[];
                                  phone: never[];
                                }) => Promise<unknown>;
                              }
                            )?.enrollRoofingLead({
                              email: lead.email ?? "",
                              companyName: lead.companyName,
                              city: lead.city,
                              state: lead.state,
                              businessType: "roofing",
                              website: [],
                              phone: [],
                            });
                          }
                          showToast(
                            `${valid.length} leads enrolled into Roofing Outreach Campaign.`,
                          );
                          queryClient.invalidateQueries({
                            queryKey: ["enrolledLeads"],
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["campaignStats"],
                          });
                          setCsvPreview([]);
                          setImportSummary(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        Import and Enroll All
                      </button>
                      <button
                        data-ocid="campaign.import_cancel_button"
                        type="button"
                        onClick={() => {
                          setCsvPreview([]);
                          setImportSummary(null);
                          setCsvFile(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* PULL FROM CRM */}
            {importSubTab === "crm" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Roofing Leads from CRM
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {leads.length} enrolled
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Enroll all valid roofing leads that are not already in the
                  campaign.
                </p>
                <button
                  data-ocid="campaign.enroll_crm_button"
                  type="button"
                  onClick={() => {
                    const unenrolled = leads.filter(
                      (l) => l.status !== "active",
                    );
                    setEnrollCount(unenrolled.length);
                    setShowEnrollConfirm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Database className="w-4 h-4" />
                  Enroll All Matching Roofing Leads
                </button>
              </div>
            )}

            {/* PULL FROM OPEN LEAD LAKE */}
            {importSubTab === "lake" && (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400 mb-3">
                  Connect your Open Lead Lake to pull roofing leads directly.
                </p>
                <a
                  href="/open-lead-lake"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Go to Open Lead Lake
                </a>
              </div>
            )}

            {/* RECOVER EXISTING LEADS */}
            {importSubTab === "recover" && (
              <div className="text-center py-8">
                <RotateCcw className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  No previous roofing lead uploads were found. Upload a CSV or
                  pull from CRM/Open Lead Lake.
                </p>
              </div>
            )}
          </div>

          {/* Enroll Confirmation Modal */}
          {showEnrollConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <h2 className="text-lg font-bold text-white mb-2">
                  Enroll Roofing Leads?
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  You are about to enroll {enrollCount} roofing leads into this
                  7-email campaign. Continue?
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    data-ocid="campaign.enroll_confirm.cancel_button"
                    type="button"
                    onClick={() => setShowEnrollConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    data-ocid="campaign.enroll_confirm.confirm_button"
                    type="button"
                    onClick={() => {
                      enrollAllMutation.mutate();
                      setShowEnrollConfirm(false);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Confirm Enroll
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          data-ocid="campaign.toast"
          className="fixed bottom-6 right-6 bg-slate-800 border border-white/10 text-white px-5 py-3 rounded-xl shadow-xl text-sm z-50"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
