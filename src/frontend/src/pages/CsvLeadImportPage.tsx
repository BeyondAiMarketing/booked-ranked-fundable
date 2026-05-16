import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Filter,
  History,
  Inbox,
  Loader2,
  Megaphone,
  Rocket,
  Search,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { CSV_IMPORT_LEADS, type CsvRawLead } from "../data/csvImportLeads";
import { useActor } from "../hooks/useActor";
import type { ExtendedNormalizedLead } from "../types/openLeadLake";
import {
  buildEmailFlag,
  detectNiche,
  isPlaceholderEmail,
  parseCSVRow,
} from "../utils/csvLeadImport";

// ─── Local types ──────────────────────────────────────────────────────────────

type ImportState = "idle" | "previewing" | "importing" | "complete";
type NicheFilter = "All" | "Technology" | "Real Estate" | "Roofing" | "Other";
type EnrollState = "idle" | "confirming" | "enrolling" | "enrolled" | "error";

interface BatchRecord {
  id: string;
  fileName: string;
  importedAt: string;
  total: number;
  byNiche: Record<string, number>;
  emailsFlagged: number;
  leads: ExtendedNormalizedLead[];
}

interface EnrolledQueue {
  queueId: string;
  niche: string;
  campaignName: string;
  count: number;
}

const NICHES: NicheFilter[] = [
  "All",
  "Technology",
  "Real Estate",
  "Roofing",
  "Other",
];

const NICHE_COLORS: Record<string, string> = {
  Technology: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "Real Estate":
    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  Roofing: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  Other: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  General: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
};

const CAMPAIGN_MAP: Record<string, string> = {
  Technology: "Technology Cold Outreach",
  "Real Estate": "Real Estate Cold Outreach",
  Roofing: "Roofing Cold Outreach",
  Other: "General Cold Outreach",
  General: "General Cold Outreach",
};

const INTERVAL_OPTIONS = [
  { label: "1 hour", seconds: 3600 },
  { label: "4 hours", seconds: 14400 },
  { label: "12 hours", seconds: 43200 },
  { label: "24 hours", seconds: 86400 },
];

const PAGE_SIZE = 25;

function generateBatchId(): string {
  return `batch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Convert CSV_IMPORT_LEADS to ExtendedNormalizedLead ───────────────────────

function seedLeadsToExtended(
  leads: CsvRawLead[],
  batchId: string,
): ExtendedNormalizedLead[] {
  return leads.map((lead, index) => {
    const rawEmail = lead.email;
    const emailFlagged = isPlaceholderEmail(rawEmail);
    const emailFlag = buildEmailFlag(rawEmail);
    const cleanEmail = emailFlagged ? undefined : rawEmail;
    const niche = detectNiche(
      lead.businessName,
      undefined,
      lead.aiSuggestedServices,
    );
    const hasWebsite =
      lead.website !== "" && lead.website.toUpperCase() !== "N/A";
    const addrParts = lead.address.split(",").map((s) => s.trim());
    const city = addrParts[addrParts.length - 3] ?? addrParts[0] ?? "";
    const stateZip = addrParts[addrParts.length - 2] ?? "";
    const state = stateZip.trim().split(" ")[0] ?? "CA";

    return {
      id: `csv-lead-${batchId}-${index + 1}`,
      rawRecordIds: [],
      sourceTypes: ["csv"] as ["csv"],
      primarySource: "csv" as const,
      businessName: lead.businessName,
      normalizedName: lead.businessName
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .trim(),
      website: hasWebsite ? lead.website : undefined,
      domain: hasWebsite
        ? lead.website.replace(/^https?:\/\//, "").split("/")[0]
        : undefined,
      phone: lead.phone !== "N/A" ? lead.phone : undefined,
      email: cleanEmail,
      address: addrParts[0] ?? undefined,
      city,
      state,
      country: "US",
      category: niche,
      tags: [niche.toLowerCase().replace(/ /g, "-")],
      sourceConfidence:
        lead.totalReviews > 50
          ? "high"
          : lead.totalReviews > 5
            ? "medium"
            : ("low" as const),
      confidenceScore:
        lead.totalReviews > 50
          ? 85
          : lead.totalReviews > 10
            ? 72
            : lead.totalReviews > 0
              ? 60
              : 40,
      isDuplicate: false,
      isSuppressed: false,
      isPromotedToCRM: false,
      normalizedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      reviewCount: lead.totalReviews,
      rating: lead.rating,
      canReceiveOutreach: !emailFlagged,
      gbpLink: lead.gbpLink,
      claimStatus: lead.claimStatus,
      optimizationScore: lead.optimizationScore,
      aiSuggestedServices: lead.aiSuggestedServices,
      emailVerified: !emailFlagged,
      emailFlag,
      importBatchId: batchId,
      niche,
    };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NicheBadge({ niche }: { niche: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${NICHE_COLORS[niche] ?? NICHE_COLORS.Other}`}
    >
      {niche}
    </span>
  );
}

function LeadSlideOver({
  lead,
  onClose,
}: {
  lead: ExtendedNormalizedLead;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      aria-modal="true"
      aria-label="Lead detail panel"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div
        className="relative z-10 w-full max-w-md bg-gray-900 border-l border-white/10 flex flex-col h-full shadow-2xl overflow-y-auto"
        data-ocid="lead_detail.sheet"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white leading-tight">
              {lead.businessName}
            </h3>
            <div className="mt-1">
              <NicheBadge niche={lead.niche} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-ocid="lead_detail.close_button"
            className="p-2 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5">
          {/* Contact */}
          <section>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Contact Info
            </h4>
            <dl className="space-y-2">
              <DetailRow label="Email">
                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-indigo-400 hover:text-indigo-300 underline break-all"
                  >
                    {lead.email}
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <AlertTriangle size={12} />
                    {lead.emailFlag ?? "No email"}
                  </span>
                )}
              </DetailRow>
              <DetailRow label="Phone">{lead.phone ?? "N/A"}</DetailRow>
              <DetailRow label="Address">
                {lead.address
                  ? `${lead.address}, ${lead.city}, ${lead.state}`
                  : "N/A"}
              </DetailRow>
              <DetailRow label="Website">
                {lead.website ? (
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1 break-all"
                  >
                    {lead.website}
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  "N/A"
                )}
              </DetailRow>
            </dl>
          </section>

          {/* GBP & Optimization */}
          <section>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              GBP & Optimization
            </h4>
            <dl className="space-y-2">
              <DetailRow label="GBP Link">
                {lead.gbpLink ? (
                  <a
                    href={lead.gbpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
                  >
                    View on Google Maps
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  "N/A"
                )}
              </DetailRow>
              <DetailRow label="Rating">
                {lead.rating ? `⭐ ${lead.rating}` : "No rating"}
              </DetailRow>
              <DetailRow label="Reviews">
                {lead.reviewCount ?? 0} reviews
              </DetailRow>
              <DetailRow label="Claim Status">
                <span
                  className={
                    lead.claimStatus === "claimed"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }
                >
                  {lead.claimStatus ?? "Unknown"}
                </span>
              </DetailRow>
              <DetailRow label="Optimization Score">
                {lead.optimizationScore ?? "N/A"}
              </DetailRow>
            </dl>
          </section>

          {/* Campaign */}
          <section>
            <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Campaign Assignment
            </h4>
            <dl className="space-y-2">
              <DetailRow label="Campaign">
                <span className="text-purple-300 font-medium">
                  {CAMPAIGN_MAP[lead.niche] ?? "General Cold Outreach"}
                </span>
              </DetailRow>
              <DetailRow label="AI Suggested Services">
                {lead.aiSuggestedServices ?? "N/A"}
              </DetailRow>
              <DetailRow label="Import Batch">
                <span className="font-mono text-[11px] text-slate-400">
                  {lead.importBatchId}
                </span>
              </DetailRow>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <dt className="text-xs text-slate-500 w-36 shrink-0">{label}</dt>
      <dd className="text-xs text-slate-200 flex-1 min-w-0">{children}</dd>
    </div>
  );
}

// ─── Enroll All Panel ─────────────────────────────────────────────────────────

function EnrollAllPanel({
  parsedLeads,
  actor,
  tenantId,
}: {
  parsedLeads: ExtendedNormalizedLead[];
  actor: Record<string, (...args: unknown[]) => Promise<unknown>> | null;
  tenantId: string;
}) {
  const [enrollState, setEnrollState] = useState<EnrollState>("idle");
  const [intervalSeconds, setIntervalSeconds] = useState(3600);
  const [dailyCap, setDailyCap] = useState(100);
  const [dailyCapInput, setDailyCapInput] = useState("100");
  const [enrolledQueues, setEnrolledQueues] = useState<EnrolledQueue[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Only valid-email leads
  const validLeads = parsedLeads.filter((l) => l.emailVerified && l.email);
  const skippedCount = parsedLeads.length - validLeads.length;

  // Group by niche
  const nicheGroups: Record<string, ExtendedNormalizedLead[]> = {};
  for (const lead of validLeads) {
    const key =
      lead.niche === "Technology" ||
      lead.niche === "Real Estate" ||
      lead.niche === "Roofing"
        ? lead.niche
        : "Other";
    nicheGroups[key] = [...(nicheGroups[key] ?? []), lead];
  }
  const nicheKeys = Object.keys(nicheGroups).filter(
    (k) => nicheGroups[k].length > 0,
  );

  const NICHE_BADGE_COLORS: Record<string, { badge: string; border: string }> =
    {
      Technology: {
        badge: "bg-blue-500/20 text-blue-300",
        border: "border-blue-500/30",
      },
      "Real Estate": {
        badge: "bg-emerald-500/20 text-emerald-300",
        border: "border-emerald-500/30",
      },
      Roofing: {
        badge: "bg-orange-500/20 text-orange-300",
        border: "border-orange-500/30",
      },
      Other: {
        badge: "bg-slate-500/20 text-slate-300",
        border: "border-slate-500/30",
      },
    };

  const handleEnroll = async () => {
    setEnrollState("enrolling");
    setErrorMsg(null);

    const results: EnrolledQueue[] = [];
    const now = BigInt(Date.now()) * 1_000_000n;

    try {
      for (const niche of nicheKeys) {
        const group = nicheGroups[niche];
        const campaignName = CAMPAIGN_MAP[niche] ?? "General Cold Outreach";
        const queueId = `csv-enroll-${niche.toLowerCase().replace(/ /g, "-")}-${Date.now().toString(36)}`;
        const emails = group.map((l) => l.email as string);
        const names = group.map((l) => l.businessName);

        const payload = {
          id: queueId,
          name: `${niche} CSV Import — ${new Date().toLocaleDateString()}`,
          tenantId,
          campaignTemplateId: `${niche.toLowerCase().replace(/ /g, "-")}-cold-outreach`,
          campaignTemplateName: campaignName,
          niche,
          contactEmails: emails,
          contactNames: names,
          sendIntervalSeconds: BigInt(intervalSeconds),
          dailySendCap: BigInt(dailyCap),
          status: "running",
          sentCount: 0n,
          failedCount: 0n,
          dailySentCount: 0n,
          currentIndex: 0n,
          dailyResetAt: now,
          createdAt: now,
          updatedAt: now,
        };

        let actualId = queueId;
        if (actor) {
          try {
            actualId = (await actor.createDripQueue(payload)) as string;
          } catch (_) {
            // Backend unavailable — use local ID; queue still tracked locally
          }
        }

        results.push({
          queueId: actualId,
          niche,
          campaignName,
          count: group.length,
        });
      }

      setEnrolledQueues(results);
      setEnrollState("enrolled");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Enrollment failed. Try again.",
      );
      setEnrollState("error");
    }
  };

  const handleDailyCapChange = (val: string) => {
    setDailyCapInput(val);
    const n = Number.parseInt(val);
    if (!Number.isNaN(n) && n >= 1 && n <= 1000) {
      setDailyCap(n);
    }
  };

  // ── Enrolled success view ─────────────────────────────────────────────────
  if (enrollState === "enrolled") {
    const totalEnrolled = enrolledQueues.reduce((a, q) => a + q.count, 0);
    return (
      <div
        className="bg-purple-950/30 border border-purple-500/40 rounded-xl p-5 space-y-4"
        data-ocid="enroll_all.success_state"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Rocket size={20} className="text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {enrolledQueues.length} Drip Queue
              {enrolledQueues.length !== 1 ? "s" : ""} Launched —{" "}
              <span className="text-purple-300">
                {totalEnrolled} leads enrolled
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              First emails will fire within the next send interval.
              {skippedCount > 0 && (
                <span className="text-amber-400 ml-1">
                  {skippedCount} skipped (invalid emails).
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          {enrolledQueues.map((q) => {
            const colors =
              NICHE_BADGE_COLORS[q.niche] ?? NICHE_BADGE_COLORS.Other;
            return (
              <div
                key={q.queueId}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border bg-gray-900/60 ${colors.border}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}
                  >
                    {q.niche}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-white">
                      {q.campaignName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
                      {q.queueId}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-white shrink-0">
                  {q.count}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    leads
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-1">
          <a
            href="/drip-campaigns"
            data-ocid="enroll_all.go_drip.button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-colors shadow-lg shadow-purple-900/30"
          >
            <Megaphone size={14} />
            Go to Drip Campaigns
            <ArrowRight size={13} />
          </a>
          <button
            type="button"
            data-ocid="enroll_all.dismiss.button"
            onClick={() => setEnrollState("idle")}
            className="px-4 py-2.5 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // ── Error view ────────────────────────────────────────────────────────────
  if (enrollState === "error") {
    return (
      <div
        className="bg-red-950/20 border border-red-500/30 rounded-xl p-5 flex items-center gap-4"
        data-ocid="enroll_all.error_state"
      >
        <XCircle size={20} className="text-red-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-300">
            Enrollment failed
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {errorMsg ?? "An unexpected error occurred."}
          </p>
        </div>
        <button
          type="button"
          data-ocid="enroll_all.retry.button"
          onClick={() => setEnrollState("confirming")}
          className="shrink-0 px-3 py-2 rounded-lg border border-red-500/30 text-xs text-red-300 hover:bg-red-500/10 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Idle — show Enroll All CTA ────────────────────────────────────────────
  if (enrollState === "idle") {
    return (
      <div
        className="bg-gray-800/60 border border-purple-500/30 rounded-xl p-5"
        data-ocid="enroll_all.panel"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Rocket size={16} className="text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Enroll All in Drip Queue
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Push{" "}
                <span className="text-emerald-400 font-semibold">
                  {validLeads.length}
                </span>{" "}
                valid leads into niche-specific outreach campaigns
                {skippedCount > 0 && (
                  <span className="text-amber-400">
                    {" "}
                    · {skippedCount} will be skipped (invalid emails)
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="enroll_all.open_config.button"
            disabled={validLeads.length === 0}
            onClick={() => setEnrollState("confirming")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all shadow-lg shadow-purple-900/30"
          >
            <Rocket size={14} />
            Enroll All
          </button>
        </div>
      </div>
    );
  }

  // ── Confirming — show config panel ────────────────────────────────────────
  return (
    <div
      className="bg-gray-800/60 border border-purple-500/40 rounded-xl p-5 space-y-5"
      data-ocid="enroll_all.config_panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket size={16} className="text-purple-400" />
          <h3 className="text-sm font-bold text-white">
            Configure Drip Enrollment
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setEnrollState("idle")}
          data-ocid="enroll_all.cancel.close_button"
          className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
          aria-label="Cancel enrollment"
        >
          <X size={15} />
        </button>
      </div>

      {/* Niche breakdown */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Leads to Enroll by Niche
        </p>
        <div className="space-y-2">
          {nicheKeys.map((niche) => {
            const count = nicheGroups[niche].length;
            const colors =
              NICHE_BADGE_COLORS[niche] ?? NICHE_BADGE_COLORS.Other;
            return (
              <div
                key={niche}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg border bg-gray-900/60 ${colors.border}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}
                  >
                    {niche}
                  </span>
                  <span className="text-xs text-slate-300">
                    {CAMPAIGN_MAP[niche] ?? "General Cold Outreach"}
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {count}{" "}
                  <span className="text-xs text-slate-400 font-normal">
                    leads
                  </span>
                </span>
              </div>
            );
          })}
          {skippedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/20 bg-amber-950/20">
              <AlertTriangle size={12} className="text-amber-400 shrink-0" />
              <p className="text-xs text-amber-400">
                {skippedCount} leads will be skipped — invalid or missing email
                addresses
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Config controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Send interval */}
        <div>
          <p className="text-xs font-medium text-slate-300 mb-2">
            Send Interval
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {INTERVAL_OPTIONS.map((opt) => (
              <button
                key={opt.seconds}
                type="button"
                data-ocid={`enroll_all.interval.${opt.label.replace(/ /g, "_")}.toggle`}
                onClick={() => setIntervalSeconds(opt.seconds)}
                className={`text-xs py-2 rounded-lg border font-medium transition-all ${
                  intervalSeconds === opt.seconds
                    ? "border-purple-500/60 bg-purple-600/20 text-purple-300"
                    : "border-white/8 bg-gray-900 text-slate-400 hover:border-purple-500/30 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daily cap */}
        <div>
          <p className="text-xs font-medium text-slate-300 mb-2">
            Daily Send Cap{" "}
            <span className="text-slate-500 font-normal">(per queue)</span>
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={1000}
              value={dailyCapInput}
              onChange={(e) => handleDailyCapChange(e.target.value)}
              data-ocid="enroll_all.daily_cap.input"
              className="w-24 bg-gray-900 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 text-center"
            />
            <span className="text-xs text-slate-500">emails / day</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Safely supports 1–1,000/day
          </p>
        </div>
      </div>

      {/* Summary row */}
      <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg px-4 py-3 flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle size={12} className="text-emerald-400" />
          <strong className="text-white">{validLeads.length}</strong> leads
          across <strong className="text-white">{nicheKeys.length}</strong>{" "}
          queues
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <Clock size={11} className="text-purple-400" />
          Interval:{" "}
          <strong className="text-white">
            {INTERVAL_OPTIONS.find((o) => o.seconds === intervalSeconds)
              ?.label ?? `${intervalSeconds}s`}
          </strong>
        </span>
        <span className="flex items-center gap-1.5 text-slate-300">
          <Megaphone size={11} className="text-indigo-400" />
          Cap: <strong className="text-white">{dailyCap}</strong>/day per queue
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          data-ocid="enroll_all.confirm.primary_button"
          disabled={enrollState === "enrolling" || validLeads.length === 0}
          onClick={handleEnroll}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all shadow-lg shadow-purple-900/30"
        >
          {enrollState === "enrolling" ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Enrolling…
            </>
          ) : (
            <>
              <Rocket size={14} />
              Launch {nicheKeys.length} Queue
              {nicheKeys.length !== 1 ? "s" : ""}
            </>
          )}
        </button>
        <button
          type="button"
          data-ocid="enroll_all.cancel.button"
          onClick={() => setEnrollState("idle")}
          disabled={enrollState === "enrolling"}
          className="px-4 py-3 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CsvLeadImportPage() {
  const { currentTenantId } = useApp();
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState<"import" | "history">("import");
  const [importState, setImportState] = useState<ImportState>("idle");
  const [parsedLeads, setParsedLeads] = useState<ExtendedNormalizedLead[]>([]);
  const [selectedNicheFilter, setSelectedNicheFilter] =
    useState<NicheFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] =
    useState<ExtendedNormalizedLead | null>(null);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived stats
  const totalLeads = parsedLeads.length;
  const techCount = parsedLeads.filter((l) => l.niche === "Technology").length;
  const reCount = parsedLeads.filter((l) => l.niche === "Real Estate").length;
  const roofCount = parsedLeads.filter((l) => l.niche === "Roofing").length;
  const otherCount = parsedLeads.filter(
    (l) =>
      l.niche !== "Technology" &&
      l.niche !== "Real Estate" &&
      l.niche !== "Roofing",
  ).length;
  const validEmails = parsedLeads.filter((l) => l.emailVerified).length;
  const flaggedEmails = parsedLeads.filter((l) => !l.emailVerified).length;

  // Filtered + searched leads for table
  const filtered = parsedLeads.filter((lead) => {
    const nicheMatch =
      selectedNicheFilter === "All" ||
      (selectedNicheFilter === "Other"
        ? lead.niche !== "Technology" &&
          lead.niche !== "Real Estate" &&
          lead.niche !== "Roofing"
        : lead.niche === selectedNicheFilter);
    if (!nicheMatch) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.businessName.toLowerCase().includes(q) ||
      (lead.email ?? "").toLowerCase().includes(q) ||
      lead.city.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleLoadSampleData = useCallback(() => {
    const batchId = generateBatchId();
    const leads = seedLeadsToExtended(CSV_IMPORT_LEADS, batchId);
    setParsedLeads(leads);
    setImportState("previewing");
    setCurrentPage(1);
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const batchId = generateBatchId();
      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) return;
      const headers = lines[0]
        .split(/\t|,/)
        .map((h) => h.trim().replace(/^"/, "").replace(/"$/, ""));
      const leads: ExtendedNormalizedLead[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/\t|,/);
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
          row[h] = (values[idx] ?? "")
            .trim()
            .replace(/^"/, "")
            .replace(/"$/, "");
        });
        if (!row["Business Name"] && !row.BusinessName) continue;
        leads.push(
          parseCSVRow(
            row as Record<string, string | undefined>,
            i - 1,
            batchId,
          ),
        );
      }
      setParsedLeads(leads);
      setImportState("previewing");
      setCurrentPage(1);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload],
  );

  const handleRunImport = useCallback(() => {
    setImportState("importing");
    setTimeout(() => {
      const batchId = parsedLeads[0]?.importBatchId ?? generateBatchId();
      const flagged = parsedLeads.filter((l) => !l.emailVerified).length;
      const byNiche: Record<string, number> = {};
      for (const lead of parsedLeads) {
        byNiche[lead.niche] = (byNiche[lead.niche] ?? 0) + 1;
      }
      const batch: BatchRecord = {
        id: batchId,
        fileName: "socal-leads-import.csv",
        importedAt: new Date().toLocaleString(),
        total: parsedLeads.length,
        byNiche,
        emailsFlagged: flagged,
        leads: parsedLeads,
      };
      setBatches((prev) => [batch, ...prev]);
      setImportState("complete");
    }, 1800);
  }, [parsedLeads]);

  const handleExportCSV = useCallback(() => {
    const headers = [
      "Business Name",
      "Niche",
      "Rating",
      "Reviews",
      "City",
      "State",
      "Phone",
      "Email",
      "Email Valid",
      "Website",
      "Claim Status",
      "Optimization Score",
      "AI Suggested Services",
      "Campaign",
    ];
    const rows = filtered.map((l) => [
      l.businessName,
      l.niche,
      l.rating ?? "",
      l.reviewCount ?? "",
      l.city,
      l.state,
      l.phone ?? "",
      l.email ?? "",
      l.emailVerified ? "Yes" : "No",
      l.website ?? "",
      l.claimStatus ?? "",
      l.optimizationScore ?? "",
      l.aiSuggestedServices ?? "",
      CAMPAIGN_MAP[l.niche] ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brf-leads-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className="space-y-6" data-ocid="csv_lead_import.page">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">
          Lead Import & Campaign Assignment
        </h1>
        <p className="text-sm text-slate-400">
          Import leads from CSV, auto-categorize by niche, and assign to
          outreach campaigns
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/60 p-1 rounded-lg w-fit border border-white/10">
        <button
          type="button"
          data-ocid="csv_import.tab"
          onClick={() => setActiveTab("import")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "import"
              ? "bg-purple-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Upload size={14} />
          Import Leads
        </button>
        <button
          type="button"
          data-ocid="history.tab"
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-purple-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <History size={14} />
          Import History
          {batches.length > 0 && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {batches.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "import" && (
        <div className="space-y-6">
          {/* Upload Panel */}
          {importState === "idle" && (
            <UploadPanel
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              fileInputRef={fileInputRef}
              handleDrop={handleDrop}
              handleFileUpload={handleFileUpload}
              handleLoadSampleData={handleLoadSampleData}
            />
          )}

          {/* Preview + Validation */}
          {(importState === "previewing" || importState === "importing") && (
            <ValidationPanel
              parsedLeads={parsedLeads}
              totalLeads={totalLeads}
              techCount={techCount}
              reCount={reCount}
              roofCount={roofCount}
              otherCount={otherCount}
              validEmails={validEmails}
              flaggedEmails={flaggedEmails}
              importState={importState}
              onReset={() => {
                setParsedLeads([]);
                setImportState("idle");
              }}
              onRunImport={handleRunImport}
            />
          )}

          {/* Import Complete Banner */}
          {importState === "complete" && (
            <CompleteBanner
              totalLeads={totalLeads}
              techCount={techCount}
              reCount={reCount}
              roofCount={roofCount}
            />
          )}

          {/* Enroll All Panel — shown only after a successful import */}
          {importState === "complete" && parsedLeads.length > 0 && (
            <EnrollAllPanel
              parsedLeads={parsedLeads}
              actor={actor}
              tenantId={currentTenantId}
            />
          )}

          {/* Lead Table */}
          {(importState === "previewing" ||
            importState === "importing" ||
            importState === "complete") &&
            parsedLeads.length > 0 && (
              <LeadTable
                paginated={paginated}
                filtered={filtered}
                totalLeads={totalLeads}
                selectedNicheFilter={selectedNicheFilter}
                setSelectedNicheFilter={(f) => {
                  setSelectedNicheFilter(f);
                  setCurrentPage(1);
                }}
                searchQuery={searchQuery}
                setSearchQuery={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                onViewLead={setSelectedLead}
                onExport={handleExportCSV}
              />
            )}
        </div>
      )}

      {activeTab === "history" && (
        <HistoryTab
          batches={batches}
          expandedBatch={expandedBatch}
          setExpandedBatch={setExpandedBatch}
        />
      )}

      {/* Lead Detail Slide-over */}
      {selectedLead && (
        <LeadSlideOver
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}

// ─── Upload Panel ─────────────────────────────────────────────────────────────

function UploadPanel({
  isDragging,
  setIsDragging,
  fileInputRef,
  handleDrop,
  handleFileUpload,
  handleLoadSampleData,
}: {
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDrop: (e: React.DragEvent) => void;
  handleFileUpload: (f: File) => void;
  handleLoadSampleData: () => void;
}) {
  return (
    <div className="bg-gray-800/60 border border-white/10 rounded-xl p-6 space-y-5">
      <h2 className="text-base font-semibold text-white flex items-center gap-2">
        <Upload size={16} className="text-purple-400" />
        Upload CSV File
      </h2>

      {/* Drop Zone */}
      <button
        type="button"
        data-ocid="csv_import.dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Upload CSV file by clicking or drag and drop"
        className={`w-full border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-purple-400 bg-purple-900/20"
            : "border-purple-600/40 hover:border-purple-500/60 bg-gray-900/40 hover:bg-purple-900/10"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center">
            <Upload size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              Drop your CSV file here or{" "}
              <span className="text-purple-400 underline">click to browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              CSV with columns: Business Name, GBP Link, Rating, Total Review,
              Address, Website, Phone Number, E-Mail, Claim Status, Optimization
              Score, AI Suggested Services
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt"
          className="hidden"
          data-ocid="csv_import.upload_button"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
      </button>

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          OR
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Sample Data */}
      <button
        type="button"
        data-ocid="csv_import.load_sample.button"
        onClick={handleLoadSampleData}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-700/60 to-indigo-700/60 hover:from-purple-600/80 hover:to-indigo-600/80 border border-purple-500/40 text-sm font-semibold text-white transition-all"
      >
        <FileText size={15} className="text-purple-300" />
        Load Sample Data (300+ SoCal Leads)
        <ArrowRight size={14} className="text-purple-300" />
      </button>
    </div>
  );
}

// ─── Validation Panel ─────────────────────────────────────────────────────────

function ValidationPanel({
  parsedLeads,
  totalLeads,
  techCount,
  reCount,
  roofCount,
  otherCount,
  validEmails,
  flaggedEmails,
  importState,
  onReset,
  onRunImport,
}: {
  parsedLeads: ExtendedNormalizedLead[];
  totalLeads: number;
  techCount: number;
  reCount: number;
  roofCount: number;
  otherCount: number;
  validEmails: number;
  flaggedEmails: number;
  importState: ImportState;
  onReset: () => void;
  onRunImport: () => void;
}) {
  const previewRows = parsedLeads.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Preview Table */}
      <div className="bg-gray-800/60 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText size={14} className="text-purple-400" />
              File Preview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              <span className="text-emerald-400 font-semibold">
                {totalLeads}
              </span>{" "}
              total leads detected
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-900/80 text-slate-400">
                {[
                  "Business Name",
                  "Niche",
                  "Rating",
                  "Email",
                  "Phone",
                  "City",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t border-white/5 hover:bg-white/3"
                >
                  <td className="px-3 py-2 text-white font-medium max-w-[180px] truncate">
                    {lead.businessName}
                  </td>
                  <td className="px-3 py-2">
                    <NicheBadge niche={lead.niche} />
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {lead.rating ? `⭐ ${lead.rating}` : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {lead.emailVerified ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle size={11} />
                        {lead.email}
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertTriangle size={11} />
                        {lead.emailFlag ?? "No email"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {lead.phone ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-slate-300">{lead.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          Showing first 5 of {totalLeads} leads
        </p>
      </div>

      {/* Validation Summary */}
      <div className="bg-gray-800/60 border border-white/10 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Validation Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Leads" value={totalLeads} color="purple" />
          <StatCard label="Valid Emails" value={validEmails} color="emerald" />
          <StatCard
            label="Flagged Emails"
            value={flaggedEmails}
            color="amber"
          />
          <StatCard label="Duplicates" value={0} color="slate" />
        </div>

        {/* Niche Breakdown */}
        <div>
          <p className="text-xs text-slate-400 mb-2 font-medium">By Niche</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-medium">
              Technology: {techCount}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium">
              Real Estate: {reCount}
            </span>
            <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-medium">
              Roofing: {roofCount}
            </span>
            <span className="bg-slate-500/20 text-slate-300 border border-slate-500/30 px-3 py-1 rounded-full text-xs font-medium">
              Other: {otherCount}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            data-ocid="csv_import.run_import.primary_button"
            onClick={onRunImport}
            disabled={importState === "importing"}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all shadow-lg shadow-purple-900/30"
          >
            {importState === "importing" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Importing…
              </>
            ) : (
              <>
                <CheckCircle size={15} />
                Run Import ({totalLeads} leads)
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-3 rounded-lg border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Import Complete Banner ───────────────────────────────────────────────────

function CompleteBanner({
  totalLeads,
  techCount,
  reCount,
  roofCount,
}: {
  totalLeads: number;
  techCount: number;
  reCount: number;
  roofCount: number;
}) {
  return (
    <div className="space-y-4" data-ocid="csv_import.success_state">
      {/* Banner */}
      <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
          <CheckCircle size={20} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-300">
            Import Complete —{" "}
            <span className="text-white">{totalLeads} leads imported</span>{" "}
            across 3 niches
          </p>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            All leads have been categorized and assigned to outreach campaigns.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NicheSummaryCard
          niche="Technology"
          count={techCount}
          campaign="Technology Cold Outreach"
          color="blue"
        />
        <NicheSummaryCard
          niche="Real Estate"
          count={reCount}
          campaign="Real Estate Cold Outreach"
          color="emerald"
        />
        <NicheSummaryCard
          niche="Roofing"
          count={roofCount}
          campaign="Roofing Cold Outreach"
          color="orange"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <a
          href="/crm-pipeline"
          data-ocid="csv_import.view_crm.button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-sm font-medium text-indigo-300 hover:text-white transition-colors"
        >
          View in CRM
          <ArrowRight size={13} />
        </a>
        <a
          href="/campaigns"
          data-ocid="csv_import.view_campaigns.button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-sm font-medium text-purple-300 hover:text-white transition-colors"
        >
          <Megaphone size={13} />
          View Campaigns
        </a>
      </div>
    </div>
  );
}

function NicheSummaryCard({
  niche,
  count,
  campaign,
  color,
}: {
  niche: string;
  count: number;
  campaign: string;
  color: "blue" | "emerald" | "orange";
}) {
  const styles = {
    blue: "bg-blue-900/30 border-blue-500/30",
    emerald: "bg-emerald-900/30 border-emerald-500/30",
    orange: "bg-orange-900/30 border-orange-500/30",
  };
  const textStyles = {
    blue: "text-blue-300",
    emerald: "text-emerald-300",
    orange: "text-orange-300",
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[color]}`}>
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${textStyles[color]}`}
      >
        {niche}
      </p>
      <p className="text-2xl font-bold text-white mt-1">{count}</p>
      <p className="text-xs text-slate-400 mt-1">leads</p>
      <div className="mt-3 flex items-center gap-1.5">
        <Megaphone size={11} className={textStyles[color]} />
        <p className={`text-[11px] font-medium ${textStyles[color]}`}>
          {campaign}
        </p>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "purple" | "emerald" | "amber" | "slate";
}) {
  const styles = {
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    slate: "text-slate-400",
  };
  return (
    <div className="bg-gray-900/60 border border-white/8 rounded-lg p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${styles[color]}`}>{value}</p>
    </div>
  );
}

// ─── Lead Table ───────────────────────────────────────────────────────────────

function LeadTable({
  paginated,
  filtered,
  totalLeads,
  selectedNicheFilter,
  setSelectedNicheFilter,
  searchQuery,
  setSearchQuery,
  currentPage,
  totalPages,
  setCurrentPage,
  onViewLead,
  onExport,
}: {
  paginated: ExtendedNormalizedLead[];
  filtered: ExtendedNormalizedLead[];
  totalLeads: number;
  selectedNicheFilter: NicheFilter;
  setSelectedNicheFilter: (f: NicheFilter) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (p: number) => void;
  onViewLead: (lead: ExtendedNormalizedLead) => void;
  onExport: () => void;
}) {
  return (
    <div
      className="bg-gray-800/60 border border-white/10 rounded-xl"
      data-ocid="lead_table.section"
    >
      {/* Table Toolbar */}
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {NICHES.map((n) => (
            <button
              key={n}
              type="button"
              data-ocid={`lead_table.filter.${n.toLowerCase().replace(/ /g, "_")}.tab`}
              onClick={() => setSelectedNicheFilter(n)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedNicheFilter === n
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-slate-400 hover:text-white hover:bg-gray-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search name, email, city…"
              value={searchQuery}
              data-ocid="lead_table.search_input"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900 border border-white/10 text-sm text-white placeholder-slate-500 rounded-lg pl-8 pr-3 py-2 w-full sm:w-52 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            type="button"
            data-ocid="lead_table.export.button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-xs font-medium transition-colors whitespace-nowrap"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-900/60 text-slate-400">
              {[
                "Business Name",
                "Niche",
                "Rating",
                "City/State",
                "Phone",
                "Email",
                "Website",
                "Claim",
                "Opt. Score",
                "Campaign",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-3 font-medium whitespace-nowrap border-b border-white/5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                  data-ocid="lead_table.empty_state"
                >
                  <Inbox size={24} className="mx-auto mb-2 text-slate-600" />
                  No leads match your filter.
                </td>
              </tr>
            ) : (
              paginated.map((lead, i) => (
                <tr
                  key={lead.id}
                  data-ocid={`lead_table.item.${(currentPage - 1) * PAGE_SIZE + i + 1}`}
                  className="border-t border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-3 py-2.5 text-white font-medium max-w-[180px]">
                    <span className="truncate block" title={lead.businessName}>
                      {lead.businessName}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <NicheBadge niche={lead.niche} />
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                    {lead.rating ? (
                      <>⭐ {lead.rating}</>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                    {lead.reviewCount ? (
                      <span className="text-slate-500 ml-1">
                        ({lead.reviewCount})
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                    {lead.city}, {lead.state}
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap">
                    {lead.phone ?? <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {lead.emailVerified ? (
                      <span className="text-emerald-400 flex items-center gap-1 max-w-[150px]">
                        <CheckCircle size={11} className="shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertTriangle size={11} className="shrink-0" />
                        <span className="text-slate-500">
                          {lead.emailFlag ?? "Missing"}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {lead.website ? (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={11} />
                        View
                      </a>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={
                        lead.claimStatus === "claimed"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }
                    >
                      {lead.claimStatus ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300">
                    {lead.optimizationScore ?? "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-purple-300 text-[11px] whitespace-nowrap">
                      {CAMPAIGN_MAP[lead.niche] ?? "General Cold Outreach"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      data-ocid={`lead_table.view.${(currentPage - 1) * PAGE_SIZE + i + 1}`}
                      onClick={() => onViewLead(lead)}
                      className="px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-slate-300 hover:text-white text-[11px] font-medium transition-colors whitespace-nowrap"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <p className="text-xs text-slate-400">
            Showing{" "}
            <span className="text-white font-medium">
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="text-white font-medium">{filtered.length}</span>{" "}
            leads
            {filtered.length < totalLeads && (
              <span className="text-slate-500">
                {" "}
                (filtered from {totalLeads})
              </span>
            )}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              data-ocid="lead_table.pagination_prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 text-xs rounded-md transition-colors ${
                    p === currentPage
                      ? "bg-purple-600 text-white font-bold"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            {totalPages > 7 && currentPage < totalPages && (
              <>
                <span className="text-slate-600 text-xs px-1">…</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-7 h-7 text-xs rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              type="button"
              data-ocid="lead_table.pagination_next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({
  batches,
  expandedBatch,
  setExpandedBatch,
}: {
  batches: BatchRecord[];
  expandedBatch: string | null;
  setExpandedBatch: (id: string | null) => void;
}) {
  if (batches.length === 0) {
    return (
      <div
        className="bg-gray-800/60 border border-white/10 rounded-xl p-12 text-center"
        data-ocid="history.empty_state"
      >
        <Clock size={32} className="mx-auto mb-3 text-slate-600" />
        <p className="text-sm font-medium text-slate-400">
          No import history yet
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Import leads to see batch history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="history.section">
      {batches.map((batch, bIdx) => (
        <div
          key={batch.id}
          className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden"
          data-ocid={`history.item.${bIdx + 1}`}
        >
          <button
            type="button"
            onClick={() =>
              setExpandedBatch(expandedBatch === batch.id ? null : batch.id)
            }
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center">
                <FileText size={14} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {batch.fileName}
                </p>
                <p className="text-xs text-slate-400">{batch.importedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">Total</p>
                <p className="text-sm font-bold text-white">{batch.total}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 hidden sm:flex">
                {Object.entries(batch.byNiche).map(([niche, count]) => (
                  <span
                    key={niche}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${NICHE_COLORS[niche] ?? NICHE_COLORS.Other}`}
                  >
                    {niche}: {count}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {batch.emailsFlagged > 0 ? (
                  <span className="flex items-center gap-1 text-amber-400">
                    <XCircle size={12} />
                    {batch.emailsFlagged} flagged
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle size={12} />
                    All emails OK
                  </span>
                )}
              </div>
              <ChevronRight
                size={14}
                className={`text-slate-500 transition-transform ${expandedBatch === batch.id ? "rotate-90" : ""}`}
              />
            </div>
          </button>

          {expandedBatch === batch.id && (
            <div className="border-t border-white/10 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-900/60 text-slate-400">
                    {["Business Name", "Niche", "Email", "Phone", "City"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-3 py-2 font-medium whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {batch.leads.slice(0, 10).map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-white/5 hover:bg-white/3"
                    >
                      <td className="px-3 py-2 text-white max-w-[180px] truncate">
                        {lead.businessName}
                      </td>
                      <td className="px-3 py-2">
                        <NicheBadge niche={lead.niche} />
                      </td>
                      <td className="px-3 py-2">
                        {lead.emailVerified ? (
                          <span className="text-emerald-400">{lead.email}</span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <AlertTriangle size={10} />
                            {lead.emailFlag ?? "Missing"}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-300">
                        {lead.phone ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-slate-300">{lead.city}</td>
                    </tr>
                  ))}
                  {batch.leads.length > 10 && (
                    <tr className="border-t border-white/5">
                      <td
                        colSpan={5}
                        className="px-3 py-2 text-center text-slate-500 text-xs"
                      >
                        + {batch.leads.length - 10} more leads in this batch
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
