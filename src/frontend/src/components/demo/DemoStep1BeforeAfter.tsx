import { getDemoContent } from "@/data/demoContentByNiche";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { SessionData } from "@/hooks/useDemoFlow";
import {
  AlertTriangle,
  CheckCircle,
  Globe2,
  Info,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";

interface Props {
  onNext: () => void;
  onPrev: () => void;
  sessionData: SessionData;
}

interface AuditIssue {
  severity: "high" | "medium" | "low";
  title: string;
  evidence: string;
  recommendation: string;
}

interface AuditStrength {
  title: string;
  evidence: string;
}

interface LiveAuditPayload {
  ok?: boolean;
  auditedAt?: string;
  evidence?: {
    finalUrl?: string;
    status?: number;
    title?: string | null;
  };
  audit?: {
    mode?: string;
    confidence?: string;
    executiveSummary?: string;
    strengths?: AuditStrength[];
    issues?: AuditIssue[];
    quickWins?: string[];
    disclaimer?: string;
  };
}

interface StoredAudit {
  mode: "live" | "unreachable" | "no_website";
  website?: string;
  auditedAt: string;
  result?: LiveAuditPayload;
  error?: string;
}

function readStoredAudit(): StoredAudit | null {
  try {
    const raw = sessionStorage.getItem("demoWebsiteAudit");
    return raw ? (JSON.parse(raw) as StoredAudit) : null;
  } catch {
    return null;
  }
}

function severityClass(severity: AuditIssue["severity"]): string {
  if (severity === "high")
    return "border-red-700/40 bg-red-950/25 text-red-200";
  if (severity === "medium")
    return "border-amber-700/40 bg-amber-950/25 text-amber-200";
  return "border-blue-700/40 bg-blue-950/25 text-blue-200";
}

export default function DemoStep1BeforeAfter({ onNext, sessionData }: Props) {
  const { sessionData: flowData } = useDemoFlow();
  const nicheContent = getDemoContent(flowData.niche || sessionData.niche);
  const painPoints = nicheContent.beforePainPoints ?? [];
  const solutions = nicheContent.afterPromises ?? [];
  const coachTip =
    nicheContent.coachTips?.beforeAfter ??
    "This is the gap between where you are and where BRF takes you — every missed call is lost revenue.";
  const storedAudit = useMemo(readStoredAudit, []);
  const liveAudit = storedAudit?.result?.audit;
  const evidence = storedAudit?.result?.evidence;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-4">
          Your Business Snapshot
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          Here’s What We Found for{" "}
          <span className="text-purple-400">
            {sessionData.businessName || "Your Business"}
          </span>
        </h2>
        <p className="text-gray-400 mt-3 text-sm">
          Real evidence when available. Clear labeling when it isn’t.
        </p>
      </div>

      {storedAudit?.mode === "live" && liveAudit ? (
        <div className="mb-8 rounded-2xl border border-emerald-700/40 bg-emerald-950/20 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-emerald-400" />
              <span className="font-bold text-emerald-300">
                Live website audit
              </span>
            </div>
            <span className="rounded-full border border-emerald-700/40 bg-emerald-900/30 px-3 py-1 text-xs text-emerald-200">
              {liveAudit.confidence || "Evidence-based"} confidence
            </span>
          </div>

          <p className="text-sm leading-6 text-gray-200">
            {liveAudit.executiveSummary ||
              "Your homepage was reached and analyzed using observable page evidence."}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(liveAudit.strengths ?? []).slice(0, 2).map((strength) => (
              <div
                key={strength.title}
                className="rounded-xl border border-emerald-800/30 bg-black/20 p-3"
              >
                <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <CheckCircle className="h-4 w-4" /> {strength.title}
                </div>
                <p className="text-xs leading-5 text-gray-400">
                  {strength.evidence}
                </p>
              </div>
            ))}
          </div>

          {(liveAudit.issues ?? []).length > 0 && (
            <div className="mt-4 space-y-3">
              {(liveAudit.issues ?? []).slice(0, 3).map((issue) => (
                <div
                  key={`${issue.severity}-${issue.title}`}
                  className={`rounded-xl border p-3 ${severityClass(issue.severity)}`}
                >
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="h-4 w-4" /> {issue.title}
                  </div>
                  <p className="text-xs leading-5 opacity-80">
                    Observed: {issue.evidence}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/90">
                    Next move: {issue.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {(liveAudit.quickWins ?? []).length > 0 && (
            <div className="mt-4 rounded-xl border border-purple-700/30 bg-purple-950/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-300">
                <Sparkles className="h-4 w-4" /> Fastest wins
              </div>
              <ul className="space-y-1.5 text-xs leading-5 text-gray-300">
                {(liveAudit.quickWins ?? []).slice(0, 3).map((win) => (
                  <li key={win}>• {win}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-5 text-gray-500">
            Audited {evidence?.finalUrl || storedAudit.website}. HTTP status{" "}
            {evidence?.status ?? "verified"}. {liveAudit.disclaimer}
          </div>
        </div>
      ) : storedAudit?.mode === "unreachable" ? (
        <div className="mb-8 rounded-2xl border border-amber-700/40 bg-amber-950/25 p-5">
          <div className="mb-2 flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="h-5 w-5" /> We couldn’t complete a live
            website audit
          </div>
          <p className="text-sm leading-6 text-gray-300">
            The website may be unavailable, block automated requests, or need a
            corrected address. We are not showing a made-up score.
          </p>
          <p className="mt-2 text-xs text-gray-500">{storedAudit.error}</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-gray-400">
            The rest of this experience is a clearly labeled product
            demonstration based on your business type.
          </div>
        </div>
      ) : storedAudit?.mode === "no_website" ? (
        <div className="mb-8 rounded-2xl border border-blue-700/40 bg-blue-950/25 p-5">
          <div className="mb-2 flex items-center gap-2 font-bold text-blue-300">
            <Info className="h-5 w-5" /> No website yet — that’s an opportunity
          </div>
          <p className="text-sm leading-6 text-gray-300">
            Instead of pretending to audit a site that doesn’t exist, BRF can
            show the website, lead-capture, reputation, and AI front-desk
            foundation your business needs.
          </p>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-gray-700 bg-gray-900 p-5 text-sm text-gray-300">
          This section is a sample business transformation preview. No live
          website audit was available for this session.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-red-400 font-bold text-sm uppercase tracking-wide">
              Without BRF
            </span>
          </div>
          <ul className="space-y-3">
            {painPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm">
                <span className="text-red-500 mt-0.5 shrink-0 text-base">
                  ✗
                </span>
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 border border-purple-700/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-purple-400 font-bold text-sm uppercase tracking-wide">
              With BRF
            </span>
          </div>
          <ul className="space-y-3">
            {solutions.map((solution) => (
              <li key={solution} className="flex items-start gap-3 text-sm">
                <span className="text-purple-400 mt-0.5 shrink-0 text-base">
                  ✓
                </span>
                <span className="text-gray-200">{solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-4 px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-700/30 text-purple-300 text-sm">
        💡 {coachTip}
      </div>

      <p className="text-center text-gray-400 text-sm mb-6">
        Now let’s show you how BRF works for{" "}
        <span className="text-white font-semibold">
          {sessionData.businessName || "your business"}
        </span>{" "}
        in {sessionData.city || "your city"}.
      </p>

      <button
        data-ocid="demo.step1.next_button"
        type="button"
        onClick={onNext}
        className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        Show Me How It Works →
      </button>
    </div>
  );
}
