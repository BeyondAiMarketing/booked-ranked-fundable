// BrowserAuditPanel — Phase 1 Live Visual Verification
// Human approval checkpoint for auto-browser audit results.
// State machine: idle → triggering → scanning → awaiting_approval → approved/rejected/error

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Lock,
  Monitor,
  RefreshCw,
  Shield,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import {
  approveBrowserAudit,
  rejectBrowserAudit,
  requestReBrowserAudit,
  triggerBrowserAudit,
} from "../services/browserAuditService";
import type {
  BrowserAuditGap,
  BrowserAuditResult,
  BrowserAuditState,
  BrowserScanSubstage,
} from "../types/browserAudit";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// ─── Props ────────────────────────────────────────────────────────────────────

interface BrowserAuditPanelProps {
  jobId: string;
  tenantId: string;
  businessName: string;
  websiteUrl: string;
  niche: string;
  city: string;
  onApproved: () => void;
  onRejected: () => void;
  onReAuditRequested: () => void;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const SCAN_SUBSTAGE_LABELS: Record<BrowserScanSubstage, string> = {
  visiting_website: "Visiting website & taking screenshot",
  checking_gbp: "Checking Google Business Profile",
  scanning_social: "Scanning social media pages",
  complete: "Scan complete",
};

const SCAN_SUBSTAGE_ORDER: BrowserScanSubstage[] = [
  "visiting_website",
  "checking_gbp",
  "scanning_social",
];

const SUBSTAGE_DURATION_MS = [5000, 6000, 5000]; // ~16s total

const GAP_SEVERITY_STYLES: Record<BrowserAuditGap["severity"], string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-slate-700 text-slate-400 border-slate-600",
};

const GAP_SEVERITY_DOT: Record<BrowserAuditGap["severity"], string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-slate-500",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScanStageRow({
  label,
  activeSubstage,
  index,
}: {
  label: string;
  activeSubstage: BrowserScanSubstage | null;
  index: number;
}) {
  const substageIdx = SCAN_SUBSTAGE_ORDER.indexOf(
    activeSubstage ?? "visiting_website",
  );
  const isDone = activeSubstage === "complete" || index < substageIdx;
  const isActive = activeSubstage !== "complete" && index === substageIdx;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-6 h-6 shrink-0 flex items-center justify-center">
        {isDone ? (
          <CheckCircle2 size={18} className="text-emerald-400" />
        ) : isActive ? (
          <span className="relative flex w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
          </span>
        ) : (
          <div className="w-3 h-3 rounded-full border border-slate-600" />
        )}
      </div>
      <span
        className={`text-sm ${isDone ? "text-emerald-400" : isActive ? "text-white" : "text-slate-600"}`}
      >
        {label}
      </span>
      {isActive && (
        <span className="ml-auto text-xs text-purple-400 animate-pulse">
          Running...
        </span>
      )}
      {isDone && <span className="ml-auto text-xs text-emerald-500">Done</span>}
    </div>
  );
}

function EvidenceCard({
  title,
  icon,
  screenshotUrl,
  score,
  maxScore,
  gaps,
  status,
}: {
  title: string;
  icon: ReactNode;
  screenshotUrl: string;
  score: number;
  maxScore: number;
  gaps: string[];
  status: string;
}) {
  const pct = Math.round((score / maxScore) * 100);
  const scoreColor =
    pct >= 70
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : pct >= 40
        ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
        : "text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <div className="bg-slate-800/60 border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Screenshot area */}
      <div className="h-28 bg-slate-900/80 border-b border-white/8 flex items-center justify-center relative overflow-hidden">
        {screenshotUrl ? (
          <img
            src={screenshotUrl}
            alt={`${title} screenshot`}
            className="w-full h-full object-cover object-top opacity-80"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-600">
            <Monitor size={28} />
            <span className="text-xs">No screenshot</span>
          </div>
        )}
        {/* Score badge overlay */}
        <span
          className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor}`}
        >
          {score}/{maxScore}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-white">{title}</span>
          <span
            className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${
              status === "scanned" || status === "found" || status === "active"
                ? "bg-emerald-500/20 text-emerald-400"
                : status === "inactive"
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Score bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              pct >= 70
                ? "bg-emerald-500"
                : pct >= 40
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Gaps */}
        {gaps.length > 0 && (
          <div className="space-y-1 pt-1">
            {gaps.slice(0, 2).map((g) => (
              <div
                key={g}
                className="flex items-start gap-1.5 text-xs text-slate-400"
              >
                <AlertTriangle
                  size={10}
                  className="text-orange-400 shrink-0 mt-0.5"
                />
                <span className="leading-tight">{g}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GapBadge({ gap }: { gap: BrowserAuditGap }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${GAP_SEVERITY_STYLES[gap.severity]}`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${GAP_SEVERITY_DOT[gap.severity]}`}
      />
      <span className="flex-1">{gap.description}</span>
      <Badge
        variant="outline"
        className={`text-[10px] border ${GAP_SEVERITY_STYLES[gap.severity]} shrink-0`}
      >
        {gap.severity}
      </Badge>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function BrowserAuditPanel({
  jobId,
  tenantId,
  businessName,
  websiteUrl,
  niche,
  city,
  onApproved,
  onRejected,
  onReAuditRequested,
}: BrowserAuditPanelProps) {
  const { actor } = useActor();
  const [state, setState] = useState<BrowserAuditState>("idle");
  const [activeSubstage, setActiveSubstage] =
    useState<BrowserScanSubstage | null>(null);
  const [result, setResult] = useState<BrowserAuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [trailOpen, setTrailOpen] = useState(false);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Scan animation sequence ────────────────────────────────────────────────
  const runScanAnimation = useCallback((auditResult: BrowserAuditResult) => {
    setActiveSubstage("visiting_website");
    let elapsed = 0;
    SCAN_SUBSTAGE_ORDER.forEach((substage, i) => {
      elapsed += i === 0 ? 0 : SUBSTAGE_DURATION_MS[i - 1];
      scanTimerRef.current = setTimeout(() => {
        setActiveSubstage(substage);
      }, elapsed);
    });

    const totalDuration = SUBSTAGE_DURATION_MS.reduce((a, b) => a + b, 0);
    scanTimerRef.current = setTimeout(() => {
      setActiveSubstage("complete");
      setResult(auditResult);
      setState("awaiting_approval");
    }, totalDuration);
  }, []);

  // ── Trigger audit on mount ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function trigger() {
      setState("triggering");
      try {
        setState("scanning");
        const auditResult = await triggerBrowserAudit(
          actor as Parameters<typeof triggerBrowserAudit>[0],
          jobId,
          tenantId,
          businessName,
          websiteUrl,
          niche,
          city,
        );
        if (!cancelled) {
          runScanAnimation(auditResult);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(
            err instanceof Error ? err.message : "Audit failed unexpectedly",
          );
          setState("error");
        }
      }
    }

    void trigger();

    return () => {
      cancelled = true;
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    jobId,
    tenantId,
    businessName,
    websiteUrl,
    niche,
    city,
    actor,
    runScanAnimation,
  ]);

  // ── Action handlers ────────────────────────────────────────────────────────
  const handleApprove = useCallback(async () => {
    if (!result) return;
    try {
      await approveBrowserAudit(
        actor as Parameters<typeof approveBrowserAudit>[0],
        jobId,
        tenantId,
      );
      setState("approved");
      onApproved();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Approval failed");
    }
  }, [actor, jobId, tenantId, result, onApproved]);

  const handleReject = useCallback(async () => {
    try {
      await rejectBrowserAudit(
        actor as Parameters<typeof rejectBrowserAudit>[0],
        jobId,
        tenantId,
        rejectReason || "Rejected by admin",
      );
      setState("rejected");
      onRejected();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Rejection failed");
    }
  }, [actor, jobId, tenantId, rejectReason, onRejected]);

  const handleReAudit = useCallback(async () => {
    try {
      await requestReBrowserAudit(
        actor as Parameters<typeof requestReBrowserAudit>[0],
        jobId,
        tenantId,
      );
      setResult(null);
      setState("triggering");
      onReAuditRequested();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Re-audit request failed",
      );
    }
  }, [actor, jobId, tenantId, onReAuditRequested]);

  // ── Render states ──────────────────────────────────────────────────────────

  return (
    <div
      className="rounded-2xl border border-purple-500/20 bg-[#0f0f1a] overflow-hidden"
      data-ocid={`browser_audit.panel.${jobId}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-violet-900/40 border-b border-purple-500/20 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
              <Shield size={16} className="text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Live Visual Verification
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-purple-900/60 text-purple-300 border-purple-500/30"
                >
                  Auto-Browser Phase 1
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{businessName}</p>
            </div>
          </div>

          {/* State badge */}
          {state === "scanning" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-purple-500/20 text-purple-300 border-purple-500/30 animate-pulse shrink-0"
              data-ocid={`browser_audit.status.scanning.${jobId}`}
            >
              <span className="mr-1">●</span> Scanning
            </Badge>
          )}
          {state === "awaiting_approval" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-orange-500/20 text-orange-300 border-orange-500/30 shrink-0"
              data-ocid={`browser_audit.status.awaiting_approval.${jobId}`}
            >
              <Lock size={9} className="mr-1" /> Awaiting Your Approval
            </Badge>
          )}
          {state === "approved" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shrink-0"
              data-ocid={`browser_audit.status.approved.${jobId}`}
            >
              <CheckCircle2 size={9} className="mr-1" /> Approved
            </Badge>
          )}
          {state === "rejected" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-red-500/20 text-red-300 border-red-500/30 shrink-0"
              data-ocid={`browser_audit.status.rejected.${jobId}`}
            >
              <X size={9} className="mr-1" /> Rejected
            </Badge>
          )}
          {state === "error" && (
            <Badge
              variant="outline"
              className="text-[10px] bg-red-500/20 text-red-300 border-red-500/30 shrink-0"
              data-ocid={`browser_audit.status.error.${jobId}`}
            >
              <AlertCircle size={9} className="mr-1" /> Error
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* ── SCANNING STATE ───────────────────────────────────────────────── */}
        {(state === "triggering" || state === "scanning") && (
          <div
            className="space-y-4"
            data-ocid={`browser_audit.scanning_panel.${jobId}`}
          >
            <p className="text-xs text-slate-400">
              Browser agent is performing a live visual scan of{" "}
              <span className="text-white font-medium">{businessName}</span>'s
              digital presence. This takes ~15 seconds.
            </p>

            <div className="bg-slate-900/60 border border-white/8 rounded-xl px-4 py-3 divide-y divide-white/5">
              {SCAN_SUBSTAGE_ORDER.map((substage, i) => (
                <ScanStageRow
                  key={substage}
                  label={SCAN_SUBSTAGE_LABELS[substage]}
                  activeSubstage={activeSubstage}
                  index={i}
                />
              ))}
            </div>

            {/* Elapsed bar */}
            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-1000"
                style={{
                  width:
                    activeSubstage === null
                      ? "5%"
                      : activeSubstage === "visiting_website"
                        ? "33%"
                        : activeSubstage === "checking_gbp"
                          ? "66%"
                          : "98%",
                }}
              />
            </div>
          </div>
        )}

        {/* ── AWAITING APPROVAL / APPROVED / REJECTED ─────────────────────── */}
        {result &&
          (state === "awaiting_approval" ||
            state === "approved" ||
            state === "rejected") && (
            <>
              {/* Evidence cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <EvidenceCard
                  title="Website Scan"
                  icon={<Globe size={14} className="text-indigo-400" />}
                  screenshotUrl={result.websiteScreenshotUrl}
                  score={result.websiteScore}
                  maxScore={20}
                  gaps={result.websiteGaps}
                  status={result.websiteStatus}
                />
                <EvidenceCard
                  title="Google Business"
                  icon={<ShieldCheck size={14} className="text-blue-400" />}
                  screenshotUrl={result.gbpScreenshotUrl}
                  score={result.gbpScore}
                  maxScore={25}
                  gaps={result.gbpGaps}
                  status={result.gbpStatus}
                />
                <EvidenceCard
                  title="Social Presence"
                  icon={<Users size={14} className="text-pink-400" />}
                  screenshotUrl={result.socialScreenshotUrl}
                  score={result.socialScore}
                  maxScore={15}
                  gaps={result.socialGaps}
                  status={result.socialStatus}
                />
              </div>

              {/* Total score banner */}
              <div className="flex items-center gap-3 bg-slate-800/60 border border-white/10 rounded-xl px-4 py-3">
                <Zap size={16} className="text-purple-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400">
                    Browser Verification Score
                  </p>
                  <p className="text-lg font-bold text-white">
                    {result.totalBrowserScore}
                    <span className="text-slate-500 text-sm font-normal">
                      /60
                    </span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500">
                    Audited {new Date(result.auditedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Full gap summary */}
              {result.gaps.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Critical Gaps Found ({result.gaps.length})
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {result.gaps.map((gap, i) => (
                      <GapBadge key={`${gap.area}-${i}`} gap={gap} />
                    ))}
                  </div>
                </div>
              )}

              {/* Approve / Reject / Re-audit buttons */}
              {state === "awaiting_approval" && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleApprove}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/30"
                      data-ocid={`browser_audit.approve_button.${jobId}`}
                    >
                      <Lock size={14} className="mr-2" />
                      Approve & Push to CRM
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setState("rejected")}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      data-ocid={`browser_audit.reject_button.${jobId}`}
                    >
                      <X size={14} className="mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReAudit}
                      className="border-white/15 text-slate-400 hover:text-white text-xs"
                      data-ocid={`browser_audit.reaudit_button.${jobId}`}
                    >
                      <RefreshCw size={12} className="mr-1" />
                      Re-Audit
                    </Button>
                  </div>
                </div>
              )}

              {/* Reject reason input */}
              {state === "rejected" && !result.adminApproved && (
                <div
                  className="space-y-3 bg-red-900/10 border border-red-500/20 rounded-xl p-4"
                  data-ocid={`browser_audit.rejection_panel.${jobId}`}
                >
                  <p className="text-sm font-medium text-red-300 flex items-center gap-2">
                    <AlertCircle size={14} />
                    Confirm rejection
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection (optional)..."
                    className="w-full bg-slate-900 border border-red-500/20 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 resize-none min-h-[72px]"
                    data-ocid={`browser_audit.rejection_reason.${jobId}`}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReject}
                      className="bg-red-600 hover:bg-red-500 text-white text-sm"
                      data-ocid={`browser_audit.confirm_rejection_button.${jobId}`}
                    >
                      Confirm Rejection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setState("awaiting_approval")}
                      className="border-white/15 text-slate-400 hover:text-white text-sm"
                      data-ocid={`browser_audit.cancel_rejection_button.${jobId}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Approved state */}
              {state === "approved" && (
                <div
                  className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl px-4 py-3"
                  data-ocid={`browser_audit.approved_state.${jobId}`}
                >
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400 shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-emerald-300">
                      Verified & Approved
                    </p>
                    <p className="text-xs text-slate-400">
                      Lead pushed to CRM with browser verification attached.
                    </p>
                  </div>
                </div>
              )}

              {/* Audit trail */}
              <div className="border border-white/8 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTrailOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  data-ocid={`browser_audit.trail_toggle.${jobId}`}
                >
                  <span className="flex items-center gap-2">
                    <Clock size={12} />
                    Audit Trail ({result.auditTrail.length} entries)
                  </span>
                  {trailOpen ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                </button>
                {trailOpen && (
                  <div className="border-t border-white/8 px-4 py-3 space-y-2 max-h-40 overflow-y-auto">
                    {result.auditTrail.map((entry) => (
                      <div
                        key={`${entry.timestamp}-${entry.action}`}
                        className="flex items-start gap-2 text-xs text-slate-500"
                      >
                        <Clock size={10} className="shrink-0 mt-0.5" />
                        <span className="text-slate-400 font-mono shrink-0">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-slate-500">[{entry.actor}]</span>
                        <span className="text-slate-400">{entry.action}</span>
                        {entry.notes && (
                          <span className="text-slate-600 italic">
                            — {entry.notes}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        {/* ── ERROR STATE ──────────────────────────────────────────────────── */}
        {state === "error" && (
          <div
            className="space-y-4"
            data-ocid={`browser_audit.error_state.${jobId}`}
          >
            <div className="flex items-start gap-3 bg-red-900/10 border border-red-500/20 rounded-xl p-4">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Visual verification failed
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {errorMsg || "The browser agent encountered an error."}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={onApproved}
                variant="outline"
                className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm"
                data-ocid={`browser_audit.proceed_without_verification.${jobId}`}
              >
                <CheckCircle2 size={14} className="mr-1.5" />
                Proceed Without Verification
              </Button>
              <Button
                onClick={handleReAudit}
                variant="outline"
                className="border-white/15 text-slate-400 hover:text-white text-sm"
                data-ocid={`browser_audit.retry_button.${jobId}`}
              >
                <RefreshCw size={14} className="mr-1.5" />
                Retry Scan
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
