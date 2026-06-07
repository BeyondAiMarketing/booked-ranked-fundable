import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit3,
  Hammer,
  MessageSquare,
  Pause,
  Play,
  RefreshCw,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";

type Pillar = "booked" | "ranked" | "fundable";
type Status = "draft" | "active" | "paused" | "needs_setup" | "error";

interface AutomationWorkflow {
  id: string;
  name: string;
  pillar: Pillar;
  description: string;
  trigger: string;
  actions: string[];
  status: Status;
  setupRequirements: string[];
}

const AUTOMATION_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: "missed-call-recovery",
    name: "Missed Call Recovery",
    pillar: "booked",
    description:
      "Automatically follow up with missed callers via SMS and email to recover lost leads.",
    trigger: "Missed call or manually marked missed call",
    actions: [
      "Send SMS follow-up",
      "Send email follow-up",
      "Create CRM task",
      "Notify admin",
      "Move lead to Needs Follow-Up",
    ],
    status: "needs_setup",
    setupRequirements: ["Twilio SMS", "Email provider"],
  },
  {
    id: "speed-to-lead",
    name: "New Roofing Lead Speed-to-Lead",
    pillar: "booked",
    description:
      "Instantly engage new roofing leads with welcome messages and follow-up tasks.",
    trigger: "New lead created",
    actions: [
      "Send welcome message",
      "Create estimate follow-up task",
      "Assign lead owner",
      "Optionally add to Roofing Outreach Campaign",
    ],
    status: "needs_setup",
    setupRequirements: ["Twilio SMS", "Email provider", "CRM"],
  },
  {
    id: "estimate-follow-up",
    name: "Estimate Request Follow-Up",
    pillar: "booked",
    description:
      "Remind leads who requested estimates and move them through your pipeline.",
    trigger: "Lead status = Estimate Requested",
    actions: [
      "Send reminder",
      "Create call task",
      "Move lead to estimate follow-up stage",
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"],
  },
  {
    id: "storm-damage-follow-up",
    name: "Storm Damage Lead Follow-Up",
    pillar: "booked",
    description:
      "Fast-track urgent storm damage leads with priority responses and admin alerts.",
    trigger:
      "Lead tag includes storm damage, leak, urgent repair, insurance claim, roof replacement",
    actions: [
      "Send urgent response",
      "Create high-priority task",
      "Notify admin/master agent",
    ],
    status: "needs_setup",
    setupRequirements: ["Twilio SMS", "Email provider", "CRM"],
  },
  {
    id: "old-lead-reactivation",
    name: "Old Lead Reactivation",
    pillar: "booked",
    description: "Re-engage cold leads after 14, 30, or 60 days of inactivity.",
    trigger: "Lead inactive for 14, 30, or 60 days",
    actions: [
      "Send reactivation email",
      "Create follow-up task",
      "Add to nurture sequence",
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"],
  },
  {
    id: "review-request-after-job",
    name: "Review Request After Job",
    pillar: "ranked",
    description:
      "Automatically request reviews from satisfied customers after job completion.",
    trigger: "Job/lead status changed to Completed",
    actions: [
      "Send review request",
      "Create review follow-up task",
      "Track review request status",
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "SMS provider", "CRM"],
  },
  {
    id: "no-review-follow-up",
    name: "No Review Follow-Up",
    pillar: "ranked",
    description:
      "Send gentle reminders to customers who haven't left a review yet.",
    trigger: "Review request sent but no review after 3–7 days",
    actions: ["Send reminder", "Update review request status"],
    status: "needs_setup",
    setupRequirements: ["Email provider", "SMS provider"],
  },
  {
    id: "google-ranking-audit-reminder",
    name: "Google Ranking Audit Reminder",
    pillar: "ranked",
    description:
      "Schedule regular Google ranking audits and notify admins of action items.",
    trigger: "Every 30 days or manual trigger",
    actions: [
      "Create audit task",
      "Add ranking snapshot placeholder",
      "Notify admin",
    ],
    status: "needs_setup",
    setupRequirements: ["SerpApi or search provider", "CRM"],
  },
  {
    id: "low-review-count-alert",
    name: "Low Review Count Alert",
    pillar: "ranked",
    description:
      "Alert admins when a client's review count drops below target thresholds.",
    trigger: "Review count below target threshold",
    actions: [
      "Create review growth task",
      "Recommend review campaign activation",
    ],
    status: "needs_setup",
    setupRequirements: ["CRM", "Review monitoring"],
  },
  {
    id: "local-seo-content-prompt",
    name: "Local SEO Content Prompt",
    pillar: "ranked",
    description:
      "Generate roofing content ideas and keyword suggestions for local SEO.",
    trigger: "Manual or monthly",
    actions: [
      "Generate roofing content ideas",
      "Create content task",
      "Suggest city/service keywords",
    ],
    status: "needs_setup",
    setupRequirements: ["LLM provider"],
  },
  {
    id: "funding-readiness-checklist",
    name: "Funding Readiness Checklist Starter",
    pillar: "fundable",
    description:
      "Kick off the funding readiness process for new roofing clients.",
    trigger: "New roofing client created",
    actions: [
      "Create funding profile",
      "Add checklist items",
      "Notify admin/client",
    ],
    status: "needs_setup",
    setupRequirements: ["CRM"],
  },
  {
    id: "business-credit-foundation",
    name: "Business Credit Foundation Reminder",
    pillar: "fundable",
    description: "Remind clients to complete business credit foundation steps.",
    trigger: "Funding checklist incomplete",
    actions: ["Create task", "Send reminder", "Mark missing items"],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"],
  },
  {
    id: "document-collection",
    name: "Document Collection Automation",
    pillar: "fundable",
    description:
      "Automate the collection of funding documents from interested clients.",
    trigger: "Client marked interested in funding",
    actions: [
      "Create document checklist",
      "Request missing docs",
      "Track status",
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"],
  },
  {
    id: "vendor-tradeline-reminder",
    name: "Vendor Tradeline Reminder",
    pillar: "fundable",
    description:
      "Remind clients to set up vendor tradelines for business credit building.",
    trigger: "Business credit checklist incomplete",
    actions: [
      "Create tradeline task",
      "Add vendor checklist placeholder",
      "Notify admin",
    ],
    status: "needs_setup",
    setupRequirements: ["Email provider", "CRM"],
  },
  {
    id: "fundability-score-update",
    name: "Fundability Score Update",
    pillar: "fundable",
    description:
      "Update the client's fundability score as they complete checklist items.",
    trigger: "Checklist item completed",
    actions: ["Update score", "Show progress", "Recommend next step"],
    status: "needs_setup",
    setupRequirements: ["CRM"],
  },
];

const PILLAR_LABELS: Record<Pillar, string> = {
  booked: "Booked",
  ranked: "Ranked",
  fundable: "Fundable",
};

const PILLAR_COLORS: Record<Pillar, string> = {
  booked: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ranked: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  fundable: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const STATUS_COLORS: Record<Status, string> = {
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  paused: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  needs_setup: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_LABELS: Record<Status, string> = {
  draft: "Draft",
  active: "Active",
  paused: "Paused",
  needs_setup: "Needs Setup",
  error: "Error",
};

const TABS: { key: Pillar | "all"; label: string }[] = [
  { key: "booked", label: "Booked Automations" },
  { key: "ranked", label: "Ranked Automations" },
  { key: "fundable", label: "Fundable Automations" },
  { key: "all", label: "All Workflows" },
];

const METRIC_CARDS = [
  { label: "Active Automations", value: 0, icon: Zap },
  { label: "Leads Touched Today", value: 0, icon: Users },
  { label: "Follow-Ups Pending", value: 0, icon: Clock },
  { label: "Reviews Requested", value: 0, icon: Star },
  { label: "Estimates Booked", value: 0, icon: CheckCircle2 },
  { label: "Funding Tasks Triggered", value: 0, icon: DollarSign },
];

export default function RoofingAutomationsPage() {
  const [activeTab, setActiveTab] = useState<Pillar | "all">("all");
  const [statusMap, setStatusMap] = useState<Record<string, Status>>(() => {
    const map: Record<string, Status> = {};
    for (const w of AUTOMATION_WORKFLOWS) {
      map[w.id] = w.status;
    }
    return map;
  });

  const filtered =
    activeTab === "all"
      ? AUTOMATION_WORKFLOWS
      : AUTOMATION_WORKFLOWS.filter((w) => w.pillar === activeTab);

  const toggleStatus = (id: string) => {
    setStatusMap((prev) => {
      const current = prev[id] ?? "needs_setup";
      const next: Status =
        current === "active"
          ? "paused"
          : current === "paused"
            ? "active"
            : "active";
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <Hammer className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            Roofing Automations
          </h1>
          <p className="text-sm text-slate-400">
            Prebuilt AI-powered workflows for roofing lead capture, follow-up,
            reviews, ranking, and funding readiness.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 mt-6">
        {METRIC_CARDS.map((m) => (
          <div
            key={m.label}
            className="rounded-xl bg-slate-900/60 border border-white/10 p-4 flex flex-col items-center text-center"
          >
            <m.icon className="w-5 h-5 text-indigo-400 mb-2" />
            <div className="text-2xl font-bold text-white">{m.value}</div>
            <div className="text-xs text-slate-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            data-ocid={`roofing.automation.tab.${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workflows */}
      <div className="grid gap-4">
        {filtered.map((workflow) => {
          const status = statusMap[workflow.id] ?? workflow.status;
          const isActive = status === "active";
          return (
            <div
              key={workflow.id}
              className="rounded-xl bg-slate-900/60 border border-white/10 p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-lg font-medium text-white">
                      {workflow.name}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PILLAR_COLORS[workflow.pillar]}`}
                    >
                      {PILLAR_LABELS[workflow.pillar]}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    {workflow.description}
                  </p>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Trigger
                    </div>
                    <div className="text-sm text-slate-400">
                      {workflow.trigger}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Actions
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-0.5">
                      {workflow.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  {status === "needs_setup" && (
                    <div className="flex items-start gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
                      <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-orange-300">
                          Needs Integration Setup
                        </div>
                        <div className="text-xs text-orange-300/80 mt-1">
                          Requires: {workflow.setupRequirements.join(", ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    data-ocid={`roofing.automation.activate.${workflow.id}`}
                    onClick={() => toggleStatus(workflow.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Activate
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    data-ocid={`roofing.automation.edit.${workflow.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    data-ocid={`roofing.automation.test.${workflow.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Test
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Funding Disclaimer */}
      {activeTab === "fundable" && (
        <div className="mt-6 rounded-xl bg-slate-900/60 border border-white/10 p-5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Funding Disclaimer
              </h3>
              <p className="text-sm text-slate-400">
                BRF helps organize business credibility, documentation, and
                fundability readiness. Funding is not guaranteed. Approval
                depends on lender requirements, revenue, credit profile,
                documentation, underwriting, and business history.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
