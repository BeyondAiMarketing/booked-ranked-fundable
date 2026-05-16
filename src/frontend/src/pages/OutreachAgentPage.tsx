import {
  AlertTriangle,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Database,
  FileText,
  Globe,
  Inbox,
  Loader2,
  Mail,
  MailX,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  SquareX,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DEMO_INGESTION_STATS } from "../data/openLeadLakeData";
import {
  DEMO_COPY_SETTINGS,
  DEMO_DELIVERABILITY_METRICS,
  DEMO_LEAD_SCORES,
  DEMO_LEAD_STAGING,
  DEMO_OUTREACH_DRAFTS,
  DEMO_OUTREACH_EVENTS,
  DEMO_SEQUENCE_ENROLLMENTS,
  DEMO_SUPPRESSION_RECORDS,
  DEMO_WEBSITE_AUDITS,
} from "../data/outreachData";
import {
  type GeneratedOutreachCopy,
  MASTER_FRAMEWORKS,
  generateOutreachCopy,
} from "../lib/outreachCopyEngine";
import {
  type EnrichedLeadScore,
  type ScoreTier,
  computeLeadScores,
} from "../lib/outreachScoringEngine";
import type { SourceType } from "../types/openLeadLake";
import type {
  LeadStagingStatus,
  OutreachCopySettings,
} from "../types/outreach";
import { ReEngageModal } from "./CampaignsPage";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusBadge(status: LeadStagingStatus) {
  const map: Record<LeadStagingStatus, string> = {
    discovered: "bg-slate-700 text-slate-200",
    pending_audit: "bg-amber-900/60 text-amber-300",
    audited: "bg-blue-900/60 text-blue-300",
    scored: "bg-purple-900/60 text-purple-300",
    qualified: "bg-emerald-900/60 text-emerald-300",
    disqualified: "bg-rose-900/60 text-rose-300",
    pending_crm: "bg-indigo-900/60 text-indigo-300",
    in_crm: "bg-green-900/60 text-green-300",
    suppressed: "bg-red-900/60 text-red-300",
  };
  const cls = map[status] ?? "bg-slate-700 text-slate-200";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function scoreColor(v: number) {
  if (v < 40) return "text-rose-400";
  if (v < 65) return "text-amber-400";
  if (v < 80) return "text-green-400";
  return "text-emerald-400";
}

function scoreBar(v: number) {
  const pct = Math.round((v / 100) * 100);
  let barCls = "bg-emerald-500";
  if (v < 40) barCls = "bg-rose-500";
  else if (v < 65) barCls = "bg-amber-500";
  else if (v < 80) barCls = "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barCls} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs w-7 text-right font-mono ${scoreColor(v)}`}>
        {v}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

function CheckRow({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {pass ? (
        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <X className="w-4 h-4 text-rose-400 shrink-0" />
      )}
      <span className={pass ? "text-slate-300" : "text-slate-400"}>
        {label}
      </span>
    </div>
  );
}

function eventBadgeClass(t: string) {
  const map: Record<string, string> = {
    sent: "bg-blue-900/60 text-blue-300",
    delivered: "bg-teal-900/60 text-teal-300",
    opened: "bg-emerald-900/60 text-emerald-300",
    clicked: "bg-green-900/60 text-green-400",
    replied: "bg-indigo-900/60 text-indigo-300",
    bounced: "bg-rose-900/60 text-rose-300",
    unsubscribed: "bg-orange-900/60 text-orange-300",
    suppressed: "bg-red-900/60 text-red-300",
    awaiting_review: "bg-amber-900/60 text-amber-300",
    sequence_completed: "bg-purple-900/60 text-purple-300",
    crm_pushed: "bg-sky-900/60 text-sky-300",
    queued: "bg-slate-700 text-slate-300",
  };
  return map[t] ?? "bg-slate-700 text-slate-300";
}

// ─── Source Attribution Helpers ──────────────────────────────────────────────

type SourceKey = SourceType | "manual";

const SOURCE_BADGE_CONFIG: Record<SourceKey, { label: string; cls: string }> = {
  openstreetmap: {
    label: "OpenStreetMap",
    cls: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/40",
  },
  csv: {
    label: "CSV Import",
    cls: "bg-slate-700/70 text-slate-300 border border-slate-600/40",
  },
  opencorporates: {
    label: "OpenCorporates",
    cls: "bg-blue-900/50 text-blue-300 border border-blue-700/40",
  },
  gleif: {
    label: "GLEIF",
    cls: "bg-purple-900/50 text-purple-300 border border-purple-700/40",
  },
  commoncrawl: {
    label: "Common Crawl",
    cls: "bg-orange-900/50 text-orange-300 border border-orange-700/40",
  },
  json: {
    label: "JSON Import",
    cls: "bg-slate-700/70 text-slate-300 border border-slate-600/40",
  },
  manual: {
    label: "Manual",
    cls: "bg-slate-800 text-slate-400 border border-slate-700/40",
  },
};

function SourceBadge({ source }: { source?: SourceKey }) {
  const key = source ?? "manual";
  const cfg = SOURCE_BADGE_CONFIG[key] ?? SOURCE_BADGE_CONFIG.manual;
  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

function ConfidencePill({ score }: { score?: number }) {
  if (score === undefined) return null;
  const tier = score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";
  const cls =
    score >= 75
      ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/30"
      : score >= 50
        ? "bg-amber-900/40 text-amber-300 border border-amber-700/30"
        : "bg-rose-900/40 text-rose-300 border border-rose-700/30";
  return (
    <span
      className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded font-medium ${cls}`}
    >
      {tier}
    </span>
  );
}

// ─── Tab 1: Lead Finder ───────────────────────────────────────────────────────

function LeadFinderTab() {
  const [searched, setSearched] = useState(false);
  const [niche, setNiche] = useState("Plumbing");
  const [city, setCity] = useState("Dallas");
  const [state, setState] = useState("TX");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importNiche, setImportNiche] = useState("All");
  const [importCity, setImportCity] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [importing, setImporting] = useState(false);

  const discovered = DEMO_LEAD_STAGING.filter((l) => l.status === "discovered");
  const staged = DEMO_LEAD_STAGING.filter((l) => l.status !== "discovered");

  // Assign demo source data to discovered leads (cycle through sources for realism)
  const demoSources: Array<{ source: SourceKey; confidence: number }> = [
    { source: "openstreetmap", confidence: 88 },
    { source: "csv", confidence: 72 },
    { source: "opencorporates", confidence: 85 },
    { source: "openstreetmap", confidence: 61 },
    { source: "csv", confidence: 93 },
    { source: "openstreetmap", confidence: 79 },
  ];

  function handleImport() {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImportSuccess(true);
    }, 1200);
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" /> Find Service Businesses
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label
              htmlFor="finder-niche"
              className="text-slate-400 text-xs mb-1 block"
            >
              Niche
            </label>
            <select
              id="finder-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            >
              {[
                "Plumbing",
                "HVAC",
                "Med Spa",
                "Roofing",
                "Restoration",
                "Carpet Cleaning",
              ].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="finder-city"
              className="text-slate-400 text-xs mb-1 block"
            >
              City
            </label>
            <input
              id="finder-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
              placeholder="Dallas"
            />
          </div>
          <div>
            <label
              htmlFor="finder-state"
              className="text-slate-400 text-xs mb-1 block"
            >
              State
            </label>
            <input
              id="finder-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
              placeholder="TX"
            />
          </div>
          <div>
            <label
              htmlFor="finder-reviews"
              className="text-slate-400 text-xs mb-1 block"
            >
              Min Reviews
            </label>
            <input
              id="finder-reviews"
              type="number"
              defaultValue={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="finder-website"
              className="text-slate-400 text-xs mb-1 block"
            >
              Website
            </label>
            <select
              id="finder-website"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            >
              <option>Any</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setSearched(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
            data-ocid="lead-finder-search"
          >
            <Search className="w-4 h-4" /> Find Businesses
          </button>
          <button
            type="button"
            onClick={() => {
              setShowImportModal(true);
              setImportSuccess(false);
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700 hover:border-slate-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            data-ocid="import-from-open-lead-lake-btn"
          >
            <Database className="w-4 h-4 text-indigo-400" /> Import from Open
            Lead Lake
          </button>
        </div>
      </div>

      {/* Import from Open Lead Lake Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl"
            data-ocid="open-lead-lake-import-dialog"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-100 font-semibold text-sm">
                  Import from Open Lead Lake
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close modal"
                data-ocid="open-lead-lake-import-close-button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <p className="text-slate-400 text-sm leading-relaxed">
                Pull pre-normalized leads from your Open Lead Lake pipeline
                directly into the Lead Finder. These leads have already been
                deduplicated and scored.
              </p>

              {/* Pipeline summary stat */}
              <div className="bg-slate-800/40 border border-purple-800/30 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-100 font-bold text-lg leading-none">
                    {DEMO_INGESTION_STATS.totalNormalized.toLocaleString()}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    leads available in your Open Lead Lake pipeline
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="import-niche"
                    className="text-slate-400 text-xs mb-1 block"
                  >
                    Niche
                  </label>
                  <select
                    id="import-niche"
                    value={importNiche}
                    onChange={(e) => setImportNiche(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                    data-ocid="import-niche-select"
                  >
                    {[
                      "All",
                      "Plumbing",
                      "HVAC",
                      "Med Spa",
                      "Roofing",
                      "Restoration",
                      "Carpet Cleaning",
                    ].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="import-city"
                    className="text-slate-400 text-xs mb-1 block"
                  >
                    City / State
                  </label>
                  <input
                    id="import-city"
                    value={importCity}
                    onChange={(e) => setImportCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                    placeholder="e.g. Dallas, TX"
                    data-ocid="import-city-input"
                  />
                </div>
              </div>

              {importSuccess ? (
                <div
                  className="flex items-center gap-2.5 bg-emerald-900/30 border border-emerald-700/40 rounded-xl px-4 py-3"
                  data-ocid="import-success-state"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-emerald-300 text-sm font-medium">
                    47 leads imported from Open Lead Lake
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={importing}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    data-ocid="import-selected-btn"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Database className="w-3.5 h-3.5" /> Import Selected
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors underline underline-offset-2"
                    data-ocid="go-to-open-lead-lake-link"
                  >
                    Go to Open Lead Lake →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {searched && (
        <>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="text-emerald-400 font-medium">
              {discovered.length} found
            </span>
            <span>·</span>
            <span>{staged.length} already staged</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Business
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Niche
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Location
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Source
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Website
                  </th>
                  <th className="text-right text-slate-400 font-medium px-4 py-3">
                    Reviews
                  </th>
                  <th className="text-right text-slate-400 font-medium px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {discovered.map((l, idx) => {
                  const src = demoSources[idx % demoSources.length];
                  return (
                    <tr
                      key={l.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-3 text-slate-200 font-medium">
                        {l.businessName}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{l.niche}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {l.city}, {l.state}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <SourceBadge source={src.source} />
                          <ConfidencePill score={src.confidence} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {l.hasWebsite ? (
                          <span className="text-emerald-400 text-xs">
                            ✓ Has site
                          </span>
                        ) : (
                          <span className="text-rose-400 text-xs">
                            ✗ No site
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300">
                        {l.reviewCount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded-lg transition-colors"
                          data-ocid="stage-lead-btn"
                        >
                          Stage Lead
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!searched && (
        <div className="text-center py-16 text-slate-500">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>
            Set your filters and click Find Businesses to discover prospects.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Lead Staging Queue ────────────────────────────────────────────────

function LeadStagingTab() {
  const [filter, setFilter] = useState("all");
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const statuses: LeadStagingStatus[] = [
    "pending_audit",
    "audited",
    "scored",
    "qualified",
    "disqualified",
    "pending_crm",
    "in_crm",
    "suppressed",
  ];
  const counts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = DEMO_LEAD_STAGING.filter((l) => l.status === s).length;
    return acc;
  }, {});
  const visible =
    filter === "all"
      ? DEMO_LEAD_STAGING
      : DEMO_LEAD_STAGING.filter((l) => l.status === filter);
  const scoreMap = Object.fromEntries(
    DEMO_LEAD_SCORES.map((s) => [s.leadStagingId, s]),
  );

  // Demo source mapping for staging queue rows (cycle for realism)
  const stagingDemoSources: Array<{ source: SourceKey }> = [
    { source: "openstreetmap" },
    { source: "csv" },
    { source: "opencorporates" },
    { source: "openstreetmap" },
    { source: "csv" },
    { source: "manual" },
    { source: "openstreetmap" },
    { source: "csv" },
    { source: "opencorporates" },
    { source: "manual" },
  ];

  function handleSync() {
    setSyncing(true);
    setSyncDone(false);
    setTimeout(() => {
      setSyncing(false);
      setSyncDone(true);
    }, 1400);
  }

  return (
    <div className="space-y-5">
      {/* Open Lead Lake Stats Banner */}
      <div
        className="bg-slate-800/40 border border-purple-800/30 rounded-xl px-5 py-4"
        data-ocid="open-lead-lake-banner"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 mb-1 md:mb-0">
            <Database className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-slate-300 text-xs font-semibold uppercase tracking-wide">
              Open Lead Lake Pipeline
            </span>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-purple-700/30 hover:bg-purple-700/50 text-purple-300 border border-purple-600/40 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
            data-ocid="sync-from-open-lead-lake-btn"
          >
            {syncing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing...
              </>
            ) : syncDone ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />{" "}
                <span className="text-emerald-300">Synced</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" /> Sync from Open Lead Lake
              </>
            )}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {[
            {
              label: "Total in pipeline",
              value: DEMO_INGESTION_STATS.totalImported,
              cls: "text-slate-100",
            },
            {
              label: "Ready to stage",
              value: DEMO_INGESTION_STATS.totalNormalized,
              cls: "text-emerald-300",
            },
            {
              label: "Duplicates filtered",
              value: DEMO_INGESTION_STATS.totalDuplicates,
              cls: "text-amber-300",
            },
            {
              label: "Suppressed",
              value: DEMO_INGESTION_STATS.totalSuppressed,
              cls: "text-rose-300",
            },
          ].map(({ label, value, cls }) => (
            <div key={label}>
              <p className={`text-xl font-bold font-mono ${cls}`}>
                {value.toLocaleString()}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Staged" value={DEMO_LEAD_STAGING.length} />
        <StatCard label="Pending Audit" value={counts.pending_audit ?? 0} />
        <StatCard label="Qualified" value={counts.qualified ?? 0} />
        <StatCard label="Ready for CRM" value={counts.pending_crm ?? 0} />
      </div>
      <div className="flex gap-2 flex-wrap">
        {["all", ...statuses].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filter === s ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"}`}
          >
            {s === "all" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Business
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Niche
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                City
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Source
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Score
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Status
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((l, idx) => {
              const sc = scoreMap[l.id];
              const src = stagingDemoSources[idx % stagingDemoSources.length];
              return (
                <tr
                  key={l.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 text-slate-200 font-medium">
                    {l.businessName}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{l.niche}</td>
                  <td className="px-4 py-3 text-slate-400">{l.city}</td>
                  <td className="px-4 py-3">
                    <SourceBadge source={src.source} />
                  </td>
                  <td className="px-4 py-3">
                    {sc ? (
                      <span
                        className={`font-mono font-bold text-sm ${scoreColor(sc.outreachPriorityScore)}`}
                      >
                        {sc.outreachPriorityScore}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{statusBadge(l.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(l.status === "pending_audit" ||
                        l.status === "discovered") && (
                        <button
                          type="button"
                          className="text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-700/50 px-2 py-1 rounded transition-colors"
                          data-ocid="run-audit-btn"
                        >
                          Run Audit
                        </button>
                      )}
                      {l.status === "pending_crm" && (
                        <button
                          type="button"
                          className="text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-700/50 px-2 py-1 rounded transition-colors"
                          data-ocid="push-crm-btn"
                        >
                          Push to CRM
                        </button>
                      )}
                      {l.status !== "suppressed" && (
                        <button
                          type="button"
                          className="text-xs text-slate-500 hover:text-rose-400 px-2 py-1 rounded transition-colors"
                          data-ocid="suppress-btn"
                        >
                          Suppress
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 3: Website Audit Queue ────────────────────────────────────────────────

function WebsiteAuditTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pending = DEMO_WEBSITE_AUDITS.filter(
    (a) => a.status === "pending",
  ).length;
  const completed = DEMO_WEBSITE_AUDITS.filter(
    (a) => a.status === "completed",
  ).length;
  const failed = DEMO_WEBSITE_AUDITS.filter(
    (a) => a.status === "failed",
  ).length;
  const leadMap = Object.fromEntries(DEMO_LEAD_STAGING.map((l) => [l.id, l]));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={DEMO_WEBSITE_AUDITS.length} />
        <StatCard label="Pending" value={pending} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Failed" value={failed} />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Business
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Website
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Status
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Quality
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Conversion Opp.
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Detail
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_WEBSITE_AUDITS.map((a) => {
              const lead = leadMap[a.leadStagingId];
              const open = expandedId === a.id;
              return (
                <>
                  <tr
                    key={a.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 text-slate-200 font-medium">
                      {lead?.businessName ?? a.leadStagingId}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-[180px] truncate">
                      {a.websiteUrl || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.status === "completed" ? "bg-emerald-900/60 text-emerald-300" : a.status === "failed" ? "bg-rose-900/60 text-rose-300" : "bg-amber-900/60 text-amber-300"}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono font-bold ${scoreColor(a.qualityScore)}`}
                      >
                        {a.qualityScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono font-bold ${scoreColor(a.conversionOpportunityScore)}`}
                      >
                        {a.conversionOpportunityScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setExpandedId(open ? null : a.id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 ml-auto"
                        data-ocid="audit-detail-toggle"
                      >
                        {open ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                        {open ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr
                      key={`${a.id}-detail`}
                      className="border-b border-slate-800/50 bg-slate-800/20"
                    >
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                              Presence Checks
                            </p>
                            <div className="space-y-1">
                              <CheckRow
                                label="Website exists"
                                pass={a.websiteExists}
                              />
                              <CheckRow
                                label="Website resolves"
                                pass={a.websiteResolves}
                              />
                              <CheckRow
                                label="Homepage accessible"
                                pass={a.homepageAccessible}
                              />
                              <CheckRow
                                label="Contact page present"
                                pass={a.contactPagePresent}
                              />
                              <CheckRow
                                label="Phone visible"
                                pass={a.phoneVisible}
                              />
                              <CheckRow
                                label="Email visible"
                                pass={a.emailVisible}
                              />
                              <CheckRow
                                label="Form visible"
                                pass={a.formVisible}
                              />
                              <CheckRow
                                label="CTA present"
                                pass={a.ctaPresent}
                              />
                              <CheckRow
                                label="Offer clear"
                                pass={a.offerClear}
                              />
                              <CheckRow
                                label="Trust elements"
                                pass={a.trustElementsPresent}
                              />
                              <CheckRow
                                label="Title/Meta present"
                                pass={a.titleMetaPresent}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                              Scores
                            </p>
                            <div className="space-y-2">
                              <div>
                                <p className="text-slate-400 text-xs mb-1">
                                  Quality Score
                                </p>
                                {scoreBar(a.qualityScore)}
                              </div>
                              <div>
                                <p className="text-slate-400 text-xs mb-1">
                                  Conversion Opportunity
                                </p>
                                {scoreBar(a.conversionOpportunityScore)}
                              </div>
                              <div>
                                <p className="text-slate-400 text-xs mb-1">
                                  Service Fit
                                </p>
                                {scoreBar(a.serviceFitScore)}
                              </div>
                            </div>
                            {a.conversionWeaknesses.length > 0 && (
                              <div className="mt-4">
                                <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">
                                  Conversion Weaknesses
                                </p>
                                <ul className="space-y-1">
                                  {a.conversionWeaknesses.map((w) => (
                                    <li
                                      key={w}
                                      className="text-rose-400 text-xs flex items-start gap-1"
                                    >
                                      <span className="text-rose-500 mt-0.5">
                                        •
                                      </span>
                                      {w}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">
                              Audit Notes
                            </p>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {a.auditNotes}
                            </p>
                            {a.mobileWeaknesses.length > 0 && (
                              <div className="mt-3">
                                <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">
                                  Mobile Issues
                                </p>
                                <ul className="space-y-1">
                                  {a.mobileWeaknesses.map((w) => (
                                    <li
                                      key={w}
                                      className="text-amber-400 text-xs flex items-start gap-1"
                                    >
                                      <span className="text-amber-500 mt-0.5">
                                        •
                                      </span>
                                      {w}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 4: Qualified Leads ────────────────────────────────────────────────────

function ScoreTierBadge({ tier }: { tier: ScoreTier }) {
  const config: Record<ScoreTier, string> = {
    priority: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    high: "bg-green-500/20 text-green-300 border border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    low: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
    disqualified: "bg-red-500/20 text-red-400 border border-red-500/30",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${config[tier] ?? config.medium}`}
    >
      {tier}
    </span>
  );
}

function OfferAngleChip({ angle }: { angle: string }) {
  const config: Record<string, string> = {
    visibility_gap: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    conversion_leak:
      "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    trust_deficit: "bg-red-500/20 text-red-300 border border-red-500/30",
    missed_revenue: "bg-green-500/20 text-green-300 border border-green-500/30",
    competitive_threat:
      "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  };
  const labels: Record<string, string> = {
    visibility_gap: "Visibility Gap",
    conversion_leak: "Conversion Leak",
    trust_deficit: "Trust Deficit",
    missed_revenue: "Missed Revenue",
    competitive_threat: "Competitive Threat",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${config[angle] ?? "bg-gray-700 text-gray-300"}`}
    >
      {labels[angle] ?? angle}
    </span>
  );
}

function MiniScoreBar({
  label,
  value,
  max = 100,
}: { label: string; value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  const barCls =
    value >= 70
      ? "bg-purple-500"
      : value >= 50
        ? "bg-yellow-500"
        : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full">
        <div
          className={`h-1.5 rounded-full ${barCls}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{value}</span>
    </div>
  );
}

function CopyPreviewCard({
  copy,
  onClose,
}: { copy: GeneratedOutreachCopy; onClose: () => void }) {
  return (
    <div className="mt-3 bg-slate-800/60 border border-indigo-500/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
          Generated Copy Preview
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Close copy preview"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="bg-indigo-900/30 border border-indigo-700/40 rounded-lg px-3 py-2">
        <p className="text-slate-400 text-xs mb-0.5">Subject Line</p>
        <p className="text-slate-100 text-sm font-medium">
          {copy.subject_line}
        </p>
      </div>
      <div>
        <p className="text-slate-400 text-xs mb-1">Email Preview</p>
        <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-line line-clamp-4">
          {copy.email_initial.split("\n").slice(0, 5).join("\n")}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap pt-1">
        {copy.metadata && (
          <>
            <OfferAngleChip angle={copy.metadata.offer_angle} />
            <ScoreTierBadge tier={copy.metadata.score_tier as ScoreTier} />
            <span className="text-xs text-slate-500">
              {copy.metadata.frameworks_applied.slice(0, 2).join(" · ")}
            </span>
          </>
        )}
      </div>
      {copy.admin_explanation && (
        <p className="text-slate-500 text-xs italic leading-relaxed border-t border-slate-700/50 pt-2">
          {copy.admin_explanation.why_this_angle.slice(0, 180)}
          {copy.admin_explanation.why_this_angle.length > 180 ? "…" : ""}
        </p>
      )}
    </div>
  );
}

function QualifiedLeadsTab() {
  const [filterP, setFilterP] = useState("all");
  const [filterN, setFilterN] = useState("all");
  const [expandedBreakdown, setExpandedBreakdown] = useState<
    Record<string, boolean>
  >({});
  const [generatingCopyFor, setGeneratingCopyFor] = useState<string | null>(
    null,
  );
  const [generatedCopies, setGeneratedCopies] = useState<
    Record<string, GeneratedOutreachCopy>
  >({});
  const [showCopyFor, setShowCopyFor] = useState<string | null>(null);
  const [reEngageLead, setReEngageLead] = useState<{
    name: string;
    niche: string;
    currentStep: number;
  } | null>(null);

  const leadMap = Object.fromEntries(DEMO_LEAD_STAGING.map((l) => [l.id, l]));
  const auditMap = Object.fromEntries(
    DEMO_WEBSITE_AUDITS.map((a) => [a.leadStagingId, a]),
  );
  const draftMap = Object.fromEntries(
    DEMO_OUTREACH_DRAFTS.map((d) => [d.leadStagingId, d]),
  );

  const eligible = DEMO_LEAD_SCORES.filter(
    (s) =>
      s.qualificationStatus !== "disqualified" &&
      s.qualificationStatus !== "unscored",
  );

  const enrichedScores = useMemo(() => {
    const result: Record<string, EnrichedLeadScore> = {};
    for (const sc of eligible) {
      const lead = leadMap[sc.leadStagingId];
      const audit = auditMap[sc.leadStagingId];
      if (lead && audit) {
        result[sc.id] = computeLeadScores(lead, audit, DEMO_COPY_SETTINGS);
      }
    }
    return result;
  }, [eligible, leadMap, auditMap]);

  const niches = [
    ...new Set(
      eligible.map((s) => leadMap[s.leadStagingId]?.niche).filter(Boolean),
    ),
  ];

  const visible = eligible.filter((s) => {
    const lead = leadMap[s.leadStagingId];
    if (filterP !== "all" && s.qualificationStatus !== filterP) return false;
    if (filterN !== "all" && lead?.niche !== filterN) return false;
    return true;
  });

  const tierCounts = {
    priority: eligible.filter((s) => s.qualificationStatus === "priority")
      .length,
    high: eligible.filter((s) => s.qualificationStatus === "high").length,
    medium: eligible.filter((s) => s.qualificationStatus === "medium").length,
    low: eligible.filter((s) => s.qualificationStatus === "low").length,
  };

  function handleGenerateCopy(scId: string) {
    const sc = eligible.find((s) => s.id === scId);
    if (!sc) return;
    const lead = leadMap[sc.leadStagingId];
    const audit = auditMap[sc.leadStagingId];
    if (!lead || !audit) return;
    setGeneratingCopyFor(scId);
    setShowCopyFor(null);
    const enriched =
      enrichedScores[scId] ??
      computeLeadScores(lead, audit, DEMO_COPY_SETTINGS);
    setTimeout(() => {
      const copy = generateOutreachCopy(
        lead,
        audit,
        enriched,
        DEMO_COPY_SETTINGS,
      );
      setGeneratedCopies((prev) => ({ ...prev, [scId]: copy }));
      setGeneratingCopyFor(null);
      setShowCopyFor(scId);
    }, 900);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Qualified" value={eligible.length} />
        <StatCard label="Priority" value={tierCounts.priority} />
        <StatCard label="High" value={tierCounts.high} />
        <StatCard
          label="Drafts Ready"
          value={eligible.filter((s) => draftMap[s.leadStagingId]).length}
        />
      </div>

      {/* Tier summary bar */}
      <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 flex-wrap">
        <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">
          Score Distribution
        </span>
        <span className="text-purple-300 text-xs font-semibold">
          {tierCounts.priority} Priority
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-green-300 text-xs font-semibold">
          {tierCounts.high} High
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-yellow-300 text-xs font-semibold">
          {tierCounts.medium} Medium
        </span>
        <span className="text-slate-600">·</span>
        <span className="text-slate-400 text-xs font-semibold">
          {tierCounts.low} Low
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "priority", "high", "medium", "low"].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilterP(p)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filterP === p ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"}`}
          >
            {p === "all" ? "All Priorities" : p}
          </button>
        ))}
        <div className="w-px bg-slate-700 mx-1" />
        {["all", ...niches].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setFilterN(n)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filterN === n ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"}`}
          >
            {n === "all" ? "All Niches" : n}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((sc) => {
          const lead = leadMap[sc.leadStagingId];
          const draft = draftMap[sc.leadStagingId];
          const enriched = enrichedScores[sc.id];
          const tier = (enriched?.score_tier ??
            sc.qualificationStatus) as ScoreTier;
          const angle =
            enriched?.recommended_offer_angle ?? sc.recommendedOfferType;
          const ctaLabel = enriched?.recommended_cta
            ? enriched.recommended_cta.replace(/_/g, " ")
            : sc.recommendedOfferType.replace(/_/g, " ");
          const breakdownOpen = expandedBreakdown[sc.id] ?? false;
          const isGenerating = generatingCopyFor === sc.id;
          const generatedCopy = generatedCopies[sc.id];
          const showPreview = showCopyFor === sc.id;

          return (
            <div
              key={sc.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
              data-ocid={`qualified-lead-card-${sc.id}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-slate-100 font-semibold text-sm">
                    {lead?.businessName ?? sc.leadStagingId}
                  </span>
                  <ScoreTierBadge tier={tier} />
                  <span
                    className={`text-lg font-bold font-mono ${scoreColor(sc.outreachPriorityScore)}`}
                  >
                    {sc.outreachPriorityScore}
                  </span>
                  <OfferAngleChip angle={angle} />
                  <span className="text-xs text-slate-500 capitalize">
                    → {ctaLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {draft ? (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${draft.status === "approved" ? "bg-emerald-900/60 text-emerald-300" : draft.status === "draft" ? "bg-amber-900/60 text-amber-300" : "bg-slate-700 text-slate-400"}`}
                    >
                      {draft.status}
                    </span>
                  ) : (
                    <span className="text-slate-600 text-xs">no draft</span>
                  )}
                  {lead && (
                    <button
                      type="button"
                      onClick={() =>
                        setReEngageLead({
                          name: lead.businessName,
                          niche: lead.niche,
                          currentStep: 4,
                        })
                      }
                      className="flex items-center gap-1.5 text-xs bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-700/50 px-3 py-1.5 rounded-lg transition-colors"
                      data-ocid={`reengage-lead-btn-${sc.id}`}
                      title="Re-Engage Cold Lead"
                    >
                      Re-Engage
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleGenerateCopy(sc.id)}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-700/50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                    data-ocid={`generate-copy-btn-${sc.id}`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" />
                        {generatedCopy ? "Regenerate" : "Generate Copy"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Three mini-score stats */}
              {enriched && (
                <div className="flex items-center gap-4 flex-wrap">
                  {[
                    { label: "Service Fit", v: enriched.serviceFitScore },
                    { label: "Urgency", v: enriched.urgency_score },
                    {
                      label: "Opportunity",
                      v: enriched.opportunity_size_score,
                    },
                  ].map(({ label, v }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-xs">{label}:</span>
                      <span
                        className={`text-xs font-bold font-mono ${scoreColor(v)}`}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                  {lead && (
                    <span className="text-slate-600 text-xs">
                      {lead.niche} · {lead.city}
                    </span>
                  )}
                </div>
              )}

              {/* Collapsible score breakdown */}
              {enriched && (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedBreakdown((prev) => ({
                        ...prev,
                        [sc.id]: !prev[sc.id],
                      }))
                    }
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    data-ocid={`score-breakdown-toggle-${sc.id}`}
                  >
                    {breakdownOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    Score Breakdown
                  </button>
                  {breakdownOpen && (
                    <div className="mt-3 bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 space-y-2">
                      <MiniScoreBar
                        label="Website Weakness"
                        value={enriched.website_weakness_score}
                      />
                      <MiniScoreBar
                        label="Conv. Weakness"
                        value={enriched.conversion_weakness_score}
                      />
                      {enriched.top_audit_signals.slice(0, 3).length > 0 && (
                        <div className="mt-2">
                          <p className="text-slate-500 text-xs mb-1.5 uppercase tracking-wide">
                            Top Audit Signals
                          </p>
                          <ul className="space-y-1">
                            {enriched.top_audit_signals
                              .slice(0, 3)
                              .map((sig) => (
                                <li
                                  key={sig}
                                  className="flex items-start gap-1.5 text-xs text-slate-400"
                                >
                                  <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                  {sig}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                      {enriched.scoring_rationale?.offer_angle_reason && (
                        <p className="text-slate-500 text-xs italic leading-relaxed pt-1 border-t border-slate-700/30">
                          {enriched.scoring_rationale.offer_angle_reason}
                        </p>
                      )}
                      {enriched.scoring_rationale?.niche_context && (
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {enriched.scoring_rationale.niche_context}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Copy preview panel */}
              {showPreview && generatedCopy && (
                <CopyPreviewCard
                  copy={generatedCopy}
                  onClose={() => setShowCopyFor(null)}
                />
              )}
              {generatedCopy && !showPreview && !isGenerating && (
                <button
                  type="button"
                  onClick={() => setShowCopyFor(sc.id)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  data-ocid={`view-generated-copy-${sc.id}`}
                >
                  <FileText className="w-3 h-3" /> View Generated Copy
                </button>
              )}
            </div>
          );
        })}
      </div>
      <ReEngageModal
        prospect={reEngageLead}
        open={!!reEngageLead}
        onClose={() => setReEngageLead(null)}
      />
    </div>
  );
}

// ─── Tab 5: Outreach Drafts ────────────────────────────────────────────────────

function OutreachDraftsTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<
    Record<string, string | null>
  >({});
  const [intelExpanded, setIntelExpanded] = useState<Record<string, boolean>>(
    {},
  );
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [regenTimes, setRegenTimes] = useState<Record<string, string>>({});
  const [localCopies, setLocalCopies] = useState<
    Record<
      string,
      {
        subjectLine: string;
        firstEmail: string;
        followUpEmail1: string;
        followUpEmail2: string;
        shortVersion: string;
      }
    >
  >({});

  const pending = DEMO_OUTREACH_DRAFTS.filter(
    (d) => d.status === "draft",
  ).length;
  const approved = DEMO_OUTREACH_DRAFTS.filter(
    (d) => d.status === "approved",
  ).length;
  const sent = DEMO_OUTREACH_DRAFTS.filter((d) => d.status === "sent").length;

  function toggleSection(draftId: string, section: string) {
    setExpandedSection((prev) => ({
      ...prev,
      [draftId]: prev[draftId] === section ? null : section,
    }));
  }

  function handleRegenerate(draftId: string) {
    setRegeneratingId(draftId);
    setTimeout(() => {
      setRegeneratingId(null);
      setRegenTimes((prev) => ({
        ...prev,
        [draftId]: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      const d = DEMO_OUTREACH_DRAFTS.find((dr) => dr.id === draftId);
      if (d) {
        setLocalCopies((prev) => ({
          ...prev,
          [draftId]: {
            subjectLine: d.subjectLine,
            firstEmail: d.firstEmail,
            followUpEmail1: d.followUpEmail1,
            followUpEmail2: d.followUpEmail2,
            shortVersion: d.shortVersion,
          },
        }));
      }
    }, 1500);
  }

  function predictedRateBadge(rate: string) {
    const map: Record<string, string> = {
      high: "bg-emerald-900/60 text-emerald-300",
      above_average: "bg-green-900/60 text-green-300",
      average: "bg-amber-900/60 text-amber-300",
      below_average: "bg-rose-900/60 text-rose-300",
    };
    const labels: Record<string, string> = {
      high: "High",
      above_average: "Above Avg.",
      average: "Average",
      below_average: "Below Avg.",
    };
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[rate] ?? "bg-slate-700 text-slate-400"}`}
      >
        {labels[rate] ?? rate.replace(/_/g, " ")}
      </span>
    );
  }

  function EmailSection({
    draftId,
    label,
    content,
    frameworkAttr,
  }: {
    draftId: string;
    label: string;
    content: string;
    frameworkAttr?: string;
  }) {
    const open = expandedSection[draftId] === label;
    const preview = content.slice(0, 150) + (content.length > 150 ? "…" : "");
    return (
      <div className="border border-slate-700/50 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection(draftId, label)}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/50 text-left hover:bg-slate-700/30 transition-colors"
        >
          <span className="text-slate-300 text-xs font-medium">{label}</span>
          {open ? (
            <ChevronUp className="w-3 h-3 text-slate-500" />
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-500" />
          )}
        </button>
        {open ? (
          <>
            <pre className="px-3 py-2 text-slate-400 text-xs whitespace-pre-wrap leading-relaxed font-sans">
              {content}
            </pre>
            {frameworkAttr && (
              <p className="px-3 pb-2 text-slate-600 text-xs italic">
                Structure: {frameworkAttr}
              </p>
            )}
          </>
        ) : (
          <p className="px-3 py-2 text-slate-500 text-xs leading-relaxed">
            {preview}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Drafts" value={DEMO_OUTREACH_DRAFTS.length} />
        <StatCard label="Pending Approval" value={pending} />
        <StatCard label="Approved" value={approved} />
        <StatCard label="Sent" value={sent} />
      </div>
      <div className="space-y-4">
        {DEMO_OUTREACH_DRAFTS.map((d) => {
          const expanded = expandedId === d.id;
          const intelOpen = intelExpanded[d.id] ?? false;
          const isRegen = regeneratingId === d.id;
          const regenTime = regenTimes[d.id];
          const localCopy = localCopies[d.id];
          const copyAngle = d.copy_metadata?.offer_angle;
          const copyTier = d.copy_metadata?.score_tier;
          const frameworks = d.copy_metadata?.frameworks_applied ?? [];

          return (
            <div
              key={d.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                className="w-full flex items-start justify-between p-4 hover:bg-slate-800/30 transition-colors text-left"
                onClick={() => setExpandedId(expanded ? null : d.id)}
                data-ocid="draft-card-toggle"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-slate-100 font-semibold">
                      {d.businessName}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {d.businessType}
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{d.location}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.status === "approved" ? "bg-emerald-900/60 text-emerald-300" : d.status === "draft" ? "bg-amber-900/60 text-amber-300" : d.status === "rejected" ? "bg-rose-900/60 text-rose-300" : "bg-blue-900/60 text-blue-300"}`}
                    >
                      {d.status}
                    </span>
                    {[
                      d.tone,
                      d.ctaStyle,
                      `depth: ${d.personalizationDepth}`,
                    ].map((chip) => (
                      <span
                        key={chip}
                        className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full border border-slate-700"
                      >
                        {chip}
                      </span>
                    ))}
                    {regenTime && (
                      <span className="text-xs text-slate-600 italic">
                        Last regenerated: {regenTime}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm font-medium">
                    Subject: {localCopy?.subjectLine ?? d.subjectLine}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegenerate(d.id);
                    }}
                    disabled={isRegen}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-slate-600 bg-slate-800/50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                    data-ocid={`regenerate-draft-btn-${d.id}`}
                    aria-label="Regenerate copy"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${isRegen ? "animate-spin" : ""}`}
                    />
                    {isRegen ? "Regenerating..." : "Regenerate"}
                  </button>
                  {expanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </button>

              {expanded && (
                <div
                  className={`px-4 pb-4 space-y-3 relative ${isRegen ? "opacity-40 pointer-events-none" : ""}`}
                >
                  {/* Intel Panel toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setIntelExpanded((prev) => ({
                          ...prev,
                          [d.id]: !prev[d.id],
                        }))
                      }
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-700/40 hover:border-indigo-600/60 bg-indigo-900/20 hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg"
                      data-ocid={`intel-toggle-${d.id}`}
                    >
                      <Zap className="w-3 h-3" />
                      {intelOpen ? "Hide" : "View"} Copy Intelligence
                      {intelOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {intelOpen && (
                      <div className="mt-3 bg-slate-800/40 border border-indigo-700/30 rounded-xl p-4 space-y-3">
                        <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide">
                          Copy Intelligence Panel
                        </p>

                        {/* Angle + tier + frameworks row */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {copyAngle && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 text-xs">
                                Offer Angle:
                              </span>
                              <OfferAngleChip angle={copyAngle} />
                            </div>
                          )}
                          {copyTier && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 text-xs">
                                Score Tier:
                              </span>
                              <ScoreTierBadge tier={copyTier as ScoreTier} />
                            </div>
                          )}
                          {frameworks.length > 0 && (
                            <span className="text-slate-500 text-xs">
                              Frameworks:{" "}
                              <span className="text-slate-400">
                                {frameworks.join(" · ")}
                              </span>
                            </span>
                          )}
                        </div>

                        {d.admin_explanation ? (
                          <>
                            <div>
                              <p className="text-slate-400 text-xs font-semibold mb-1">
                                Why This Angle Was Chosen
                              </p>
                              <p className="text-slate-400 text-xs leading-relaxed">
                                {d.admin_explanation.why_this_angle}
                              </p>
                            </div>
                            {d.admin_explanation.what_audit_data_drove_it
                              .length > 0 && (
                              <div>
                                <p className="text-slate-400 text-xs font-semibold mb-1">
                                  Audit Signals Used
                                </p>
                                <ul className="space-y-1">
                                  {d.admin_explanation.what_audit_data_drove_it.map(
                                    (sig) => (
                                      <li
                                        key={sig}
                                        className="flex items-start gap-1.5 text-xs text-slate-400"
                                      >
                                        <span className="text-slate-600 mt-0.5">
                                          •
                                        </span>
                                        {sig}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                            <div className="bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2">
                              <p className="text-slate-500 text-xs font-medium mb-0.5">
                                Watch For
                              </p>
                              <p className="text-slate-400 text-xs leading-relaxed">
                                {d.admin_explanation.what_to_watch}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-xs">
                                Predicted Response Rate:
                              </span>
                              {predictedRateBadge(
                                d.admin_explanation.predicted_response_rate,
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3">
                            <p className="text-slate-500 text-xs italic">
                              No intelligence data for this draft yet.
                            </p>
                            <button
                              type="button"
                              className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700/40 px-3 py-1 rounded-lg transition-colors"
                              data-ocid={`generate-intel-${d.id}`}
                            >
                              Generate Intel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Email sections */}
                  <EmailSection
                    draftId={d.id}
                    label="First Email"
                    content={localCopy?.firstEmail ?? d.firstEmail}
                    frameworkAttr={
                      copyAngle === "visibility_gap"
                        ? "Ogilvy Headline + Hopkins Proof + Deiss B/A/B"
                        : copyAngle === "conversion_leak"
                          ? "Sugarman Opener + Hormozi Value + Halbert PAS"
                          : copyAngle === "trust_deficit"
                            ? "Abraham Advisor + Ogilvy + PASTOR"
                            : "Direct Response + Hormozi + Kennedy"
                    }
                  />
                  <EmailSection
                    draftId={d.id}
                    label="Follow-Up 1"
                    content={localCopy?.followUpEmail1 ?? d.followUpEmail1}
                    frameworkAttr="Kennedy Urgency + Deiss Journey"
                  />
                  <EmailSection
                    draftId={d.id}
                    label="Follow-Up 2"
                    content={localCopy?.followUpEmail2 ?? d.followUpEmail2}
                    frameworkAttr="Kennedy Follow-Up + Abraham Close"
                  />
                  <EmailSection
                    draftId={d.id}
                    label="Short Version"
                    content={localCopy?.shortVersion ?? d.shortVersion}
                  />
                  <EmailSection
                    draftId={d.id}
                    label="Call Script"
                    content={d.callScript}
                  />

                  {/* Copy quality signals */}
                  {d.copy_metadata && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        {
                          label: "Personalization",
                          value: d.personalizationDepth,
                        },
                        { label: "Tone", value: d.copy_metadata.tone_applied },
                        {
                          label: "CTA Style",
                          value: d.copy_metadata.cta_used.replace(/_/g, " "),
                        },
                        { label: "Spam Risk", value: "Low", dot: "green" },
                      ].map(({ label, value, dot }) => (
                        <div
                          key={label}
                          className="bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2"
                        >
                          <p className="text-slate-500 text-xs mb-0.5">
                            {label}
                          </p>
                          <div className="flex items-center gap-1.5">
                            {dot && (
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                            )}
                            <p className="text-slate-300 text-xs font-medium capitalize">
                              {value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border border-amber-700/30 rounded-lg bg-amber-900/10 px-3 py-2">
                    <p className="text-amber-400 text-xs font-medium mb-0.5">
                      Admin Note
                    </p>
                    <p className="text-slate-300 text-xs">
                      {d.adminSummaryNote}
                    </p>
                  </div>
                  {d.status === "draft" && (
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                        data-ocid="approve-draft-btn"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-700/50 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                        data-ocid="reject-draft-btn"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 6: CRM Push Queue ────────────────────────────────────────────────────

function CrmPushQueueTab() {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const pending = DEMO_LEAD_STAGING.filter((l) => l.status === "pending_crm");
  const scoreMap = Object.fromEntries(
    DEMO_LEAD_SCORES.map((s) => [s.leadStagingId, s]),
  );
  const draftMap = Object.fromEntries(
    DEMO_OUTREACH_DRAFTS.map((d) => [d.leadStagingId, d]),
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Awaiting Approval" value={pending.length} />
        <StatCard label="Approved Today" value={2} />
        <StatCard label="Pushed This Week" value={5} />
        <StatCard label="Rejected" value={1} />
      </div>
      {pending.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Inbox className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>No leads pending CRM push.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-400 font-medium px-4 py-3">
                  Business
                </th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">
                  Niche
                </th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">
                  Score
                </th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">
                  Draft
                </th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">
                  Duplicate
                </th>
                <th className="text-left text-slate-400 font-medium px-4 py-3">
                  Suppressed
                </th>
                <th className="text-right text-slate-400 font-medium px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pending.map((l) => {
                const sc = scoreMap[l.id];
                const draft = draftMap[l.id];
                return (
                  <tr
                    key={l.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30"
                  >
                    <td className="px-4 py-3 text-slate-200 font-medium">
                      {l.businessName}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{l.niche}</td>
                    <td className="px-4 py-3">
                      {sc ? (
                        <span
                          className={`font-mono font-bold ${scoreColor(sc.outreachPriorityScore)}`}
                        >
                          {sc.outreachPriorityScore}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {draft ? (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${draft.status === "approved" ? "bg-emerald-900/60 text-emerald-300" : "bg-amber-900/60 text-amber-300"}`}
                        >
                          {draft.status}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">none</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.isDuplicate ? "bg-rose-900/60 text-rose-300" : "bg-emerald-900/60 text-emerald-300"}`}
                      >
                        {l.isDuplicate ? "Duplicate" : "Clean"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.isSuppressed ? "bg-rose-900/60 text-rose-300" : "bg-emerald-900/60 text-emerald-300"}`}
                      >
                        {l.isSuppressed ? "Suppressed" : "Clear"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {confirmId === l.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-amber-400 text-xs">
                            Confirm push?
                          </span>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg transition-colors"
                            data-ocid="confirm-push-btn"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
                            data-ocid="cancel-push-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmId(l.id)}
                            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg transition-colors"
                            data-ocid="approve-push-btn"
                          >
                            Approve &amp; Push
                          </button>
                          <button
                            type="button"
                            className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1"
                            data-ocid="reject-push-btn"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Tab 7: Sequence Manager ──────────────────────────────────────────────────

function SequenceManagerTab() {
  const [stopId, setStopId] = useState<string | null>(null);
  const leadMap = Object.fromEntries(DEMO_LEAD_STAGING.map((l) => [l.id, l]));

  const counts = {
    active: DEMO_SEQUENCE_ENROLLMENTS.filter((e) => e.status === "active")
      .length,
    paused: DEMO_SEQUENCE_ENROLLMENTS.filter((e) => e.status === "paused")
      .length,
    completed: DEMO_SEQUENCE_ENROLLMENTS.filter((e) => e.status === "completed")
      .length,
    stopped: DEMO_SEQUENCE_ENROLLMENTS.filter((e) => e.status === "stopped")
      .length,
  };

  function seqBadge(s: string) {
    const map: Record<string, string> = {
      active: "bg-emerald-900/60 text-emerald-300",
      paused: "bg-amber-900/60 text-amber-300",
      completed: "bg-blue-900/60 text-blue-300",
      stopped: "bg-rose-900/60 text-rose-300",
      pending_approval: "bg-purple-900/60 text-purple-300",
    };
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[s] ?? "bg-slate-700 text-slate-300"}`}
      >
        {s.replace(/_/g, " ")}
      </span>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active" value={counts.active} />
        <StatCard label="Paused" value={counts.paused} />
        <StatCard label="Completed" value={counts.completed} />
        <StatCard label="Stopped" value={counts.stopped} />
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Business
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Sequence
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Status
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Progress
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Next Send
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_SEQUENCE_ENROLLMENTS.map((e) => {
              const lead = leadMap[e.leadStagingId];
              return (
                <tr
                  key={e.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30"
                >
                  <td className="px-4 py-3 text-slate-200 font-medium">
                    {lead?.businessName ?? e.leadStagingId}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-[200px] truncate">
                    {e.sequenceName}
                  </td>
                  <td className="px-4 py-3">{seqBadge(e.status)}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    Step {e.currentStepIndex + 1} of {e.totalSteps}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {e.nextStepAt
                      ? new Date(e.nextStepAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {stopId === e.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-amber-400 text-xs">
                          Stop sequence?
                        </span>
                        <button
                          type="button"
                          onClick={() => setStopId(null)}
                          className="text-xs bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded-lg transition-colors"
                          data-ocid="confirm-stop-btn"
                        >
                          Stop
                        </button>
                        <button
                          type="button"
                          onClick={() => setStopId(null)}
                          className="text-xs text-slate-400 hover:text-slate-200"
                          data-ocid="cancel-stop-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        {e.status === "active" && (
                          <button
                            type="button"
                            className="text-amber-400 hover:text-amber-300 p-1 rounded transition-colors"
                            aria-label="Pause sequence"
                            data-ocid="pause-seq-btn"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {e.status === "paused" && (
                          <button
                            type="button"
                            className="text-emerald-400 hover:text-emerald-300 p-1 rounded transition-colors"
                            aria-label="Resume sequence"
                            data-ocid="resume-seq-btn"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {(e.status === "active" || e.status === "paused") && (
                          <button
                            type="button"
                            onClick={() => setStopId(e.id)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded transition-colors"
                            aria-label="Stop sequence"
                            data-ocid="stop-seq-btn"
                          >
                            <SquareX className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 8: Performance Dashboard ─────────────────────────────────────────────

function PerformanceDashboardTab() {
  const m = DEMO_DELIVERABILITY_METRICS;
  const recentEvents = [...DEMO_OUTREACH_EVENTS]
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    )
    .slice(0, 10);
  const leadMap = Object.fromEntries(DEMO_LEAD_STAGING.map((l) => [l.id, l]));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Sent" value={m.totalSent} />
        <StatCard
          label="Delivered"
          value={m.totalDelivered}
          sub={`${m.deliveryRate}% delivery rate`}
        />
        <StatCard
          label="Opened"
          value={m.totalOpened}
          sub={`${m.openRate}% open rate`}
        />
        <StatCard
          label="Clicked"
          value={m.totalClicked}
          sub={`${m.clickRate}% click rate`}
        />
        <StatCard
          label="Replied"
          value={m.totalReplied}
          sub={`${m.replyRate}% reply rate`}
        />
        <StatCard
          label="Bounced"
          value={m.totalBounced}
          sub={`${m.bounceRate}% bounce rate`}
        />
      </div>
      <div>
        <h3 className="text-slate-300 font-semibold mb-3 text-sm">
          Recent Events
        </h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          {recentEvents.map((ev) => {
            const lead = leadMap[ev.leadStagingId];
            return (
              <div
                key={ev.id}
                className="flex items-center gap-3 px-4 py-3"
                data-ocid={`event-row-${ev.eventType}`}
              >
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${eventBadgeClass(ev.eventType)}`}
                >
                  {ev.eventType.replace(/_/g, " ")}
                </span>
                <span className="text-slate-300 text-sm font-medium flex-1 truncate min-w-0">
                  {lead?.businessName ?? ev.leadStagingId}
                </span>
                <span className="text-slate-500 text-xs shrink-0">
                  {new Date(ev.occurredAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 9: Suppression List ──────────────────────────────────────────────────

function SuppressionListTab() {
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const counts = {
    bounce: DEMO_SUPPRESSION_RECORDS.filter((s) => s.reason === "bounce")
      .length,
    unsubscribe: DEMO_SUPPRESSION_RECORDS.filter(
      (s) => s.reason === "unsubscribe",
    ).length,
    manual: DEMO_SUPPRESSION_RECORDS.filter((s) => s.reason === "manual")
      .length,
  };

  function reasonBadge(r: string) {
    const map: Record<string, string> = {
      bounce: "bg-rose-900/60 text-rose-300",
      unsubscribe: "bg-orange-900/60 text-orange-300",
      complaint: "bg-red-900/60 text-red-300",
      manual: "bg-slate-700 text-slate-300",
      low_score: "bg-amber-900/60 text-amber-300",
      duplicate: "bg-blue-900/60 text-blue-300",
    };
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[r] ?? "bg-slate-700 text-slate-300"}`}
      >
        {r.replace(/_/g, " ")}
      </span>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Suppressed"
          value={DEMO_SUPPRESSION_RECORDS.length}
        />
        <StatCard label="Bounces" value={counts.bounce} />
        <StatCard label="Unsubscribes" value={counts.unsubscribe} />
        <StatCard label="Manual" value={counts.manual} />
      </div>
      <div className="flex justify-between items-center">
        <h3 className="text-slate-300 font-semibold text-sm">
          Suppression Records
        </h3>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          data-ocid="add-suppression-btn"
        >
          <Plus className="w-3.5 h-3.5" /> Add to Suppression
        </button>
      </div>
      {showAdd && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="suppression-email"
              className="text-slate-400 text-xs mb-1 block"
            >
              Email Address
            </label>
            <input
              id="suppression-email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
              placeholder="email@domain.com"
              data-ocid="suppression-email-input"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="suppression-reason"
              className="text-slate-400 text-xs mb-1 block"
            >
              Reason
            </label>
            <select
              id="suppression-reason"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            >
              <option value="manual">Manual</option>
              <option value="bounce">Bounce</option>
              <option value="unsubscribe">Unsubscribe</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowAdd(false);
              setNewEmail("");
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            data-ocid="save-suppression-btn"
          >
            Add
          </button>
        </div>
      )}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Email
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Business
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Reason
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Date
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Permanent
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_SUPPRESSION_RECORDS.map((s) => (
              <tr
                key={s.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 text-slate-300 text-xs font-mono">
                  {s.email || "—"}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {s.businessName}
                </td>
                <td className="px-4 py-3">{reasonBadge(s.reason)}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {new Date(s.addedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs ${s.permanent ? "text-rose-400" : "text-slate-500"}`}
                  >
                    {s.permanent ? "Permanent" : "Temp"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {!s.permanent && (
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                      data-ocid="remove-suppression-btn"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 10: Agent Settings ────────────────────────────────────────────────────

function AgentSettingsTab() {
  const [settings, setSettings] = useState<OutreachCopySettings>({
    ...DEMO_COPY_SETTINGS,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <Mail className="w-4 h-4 text-indigo-400" /> Copy Settings
        </h3>
        <fieldset>
          <legend className="text-slate-400 text-xs font-medium mb-2">
            Tone
          </legend>
          <div className="flex gap-3 flex-wrap">
            {(
              [
                "professional",
                "conversational",
                "direct",
                "consultative",
              ] as const
            ).map((t) => (
              <label
                key={t}
                htmlFor={`tone-${t}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id={`tone-${t}`}
                  type="radio"
                  name="tone"
                  value={t}
                  checked={settings.tone === t}
                  onChange={() => setSettings({ ...settings, tone: t })}
                  className="accent-indigo-500"
                  data-ocid={`tone-${t}`}
                />
                <span className="text-slate-300 text-sm capitalize">{t}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-slate-400 text-xs font-medium mb-2">
            CTA Style
          </legend>
          <div className="flex gap-3 flex-wrap">
            {(["soft", "direct", "urgent"] as const).map((c) => (
              <label
                key={c}
                htmlFor={`cta-${c}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id={`cta-${c}`}
                  type="radio"
                  name="ctaStyle"
                  value={c}
                  checked={settings.ctaStyle === c}
                  onChange={() => setSettings({ ...settings, ctaStyle: c })}
                  className="accent-indigo-500"
                  data-ocid={`cta-${c}`}
                />
                <span className="text-slate-300 text-sm capitalize">{c}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label
            htmlFor="aggressiveness-slider"
            className="text-slate-400 text-xs font-medium block mb-2"
          >
            Aggressiveness —{" "}
            <span className="text-indigo-300">
              {settings.aggressivenessLevel}
            </span>{" "}
            / 5
          </label>
          <input
            id="aggressiveness-slider"
            type="range"
            min={1}
            max={5}
            value={settings.aggressivenessLevel}
            onChange={(e) =>
              setSettings({
                ...settings,
                aggressivenessLevel: Number(e.target.value),
              })
            }
            className="w-full accent-indigo-500"
            data-ocid="aggressiveness-slider"
          />
          <div className="flex justify-between text-slate-600 text-xs mt-1">
            <span>Gentle</span>
            <span>Moderate</span>
            <span>Direct</span>
          </div>
        </div>
        <fieldset>
          <legend className="text-slate-400 text-xs font-medium mb-2">
            Personalization Depth
          </legend>
          <div className="flex gap-3 flex-wrap">
            {(["low", "medium", "high"] as const).map((p) => (
              <label
                key={p}
                htmlFor={`personalization-${p}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id={`personalization-${p}`}
                  type="radio"
                  name="personalization"
                  value={p}
                  checked={settings.personalizationDepth === p}
                  onChange={() =>
                    setSettings({ ...settings, personalizationDepth: p })
                  }
                  className="accent-indigo-500"
                  data-ocid={`personalization-${p}`}
                />
                <span className="text-slate-300 text-sm capitalize">{p}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" /> Sequence Settings
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sequence-length"
              className="text-slate-400 text-xs font-medium block mb-1"
            >
              Default Sequence Length
            </label>
            <input
              id="sequence-length"
              type="number"
              value={settings.sequenceLength}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sequenceLength: Number(e.target.value),
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
              data-ocid="sequence-length-input"
            />
          </div>
          <div>
            <label
              htmlFor="wait-time"
              className="text-slate-400 text-xs font-medium block mb-1"
            >
              Wait Between Emails (hours)
            </label>
            <input
              id="wait-time"
              type="number"
              defaultValue={72}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
              data-ocid="wait-time-input"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {[
            "Stop on Reply",
            "Stop on Bounce",
            "Stop on Unsubscribe",
            "Stop on Complaint",
          ].map((lbl) => (
            <label
              key={lbl}
              htmlFor={`stop-${lbl}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id={`stop-${lbl}`}
                type="checkbox"
                defaultChecked
                className="accent-indigo-500"
                data-ocid={`stop-${lbl.toLowerCase().replace(/ /g, "-")}`}
              />
              <span className="text-slate-300 text-sm">{lbl}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" /> Sender Identity
        </h3>
        <div>
          <label
            htmlFor="sender-name"
            className="text-slate-400 text-xs font-medium block mb-1"
          >
            From Name
          </label>
          <input
            id="sender-name"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
            defaultValue="Growth Team"
            data-ocid="sender-name-input"
          />
        </div>
        <div>
          <label
            htmlFor="signature-block"
            className="text-slate-400 text-xs font-medium block mb-1"
          >
            Signature Block
          </label>
          <textarea
            id="signature-block"
            value={settings.signatureBlock}
            onChange={(e) =>
              setSettings({ ...settings, signatureBlock: e.target.value })
            }
            rows={4}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm font-mono resize-none"
            data-ocid="signature-block-input"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${saved ? "bg-emerald-700 text-emerald-100" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
        data-ocid="save-settings-btn"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" /> Saved!
          </>
        ) : (
          "Save Settings"
        )}
      </button>

      {/* ── Section A: Copy Intelligence Framework ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-slate-100 font-semibold flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-indigo-400" /> Copy Intelligence
            Framework
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            These 10 direct response frameworks are automatically applied based
            on each lead's score tier, offer angle, and your configured tone
            settings.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MASTER_FRAMEWORKS.map((fw) => (
            <div
              key={fw.key}
              className="relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-3"
            >
              <span className="absolute top-2.5 right-2.5 text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-medium">
                Active
              </span>
              <p className="text-slate-200 text-xs font-semibold pr-12">
                {fw.name}
              </p>
              <p className="text-indigo-300 text-xs mt-0.5 italic">
                {fw.principle}
              </p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                {fw.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section B: Offer Angle Decision Logic ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" /> Offer Angle Decision
          Logic
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-700/50">
                {["Angle", "When It Triggers", "Best For", "CTA Used"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-slate-400 font-medium px-3 py-2"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  angle: "visibility_gap",
                  trigger: "SEO score < 45 + urgency > 60",
                  bestFor: "Invisible businesses",
                  cta: "Audit Offer / Benchmark Report",
                },
                {
                  angle: "conversion_leak",
                  trigger: "Site weakness > 75 + conversion weakness > 70",
                  bestFor: "Traffic but no conversions",
                  cta: "Quick Win Demo",
                },
                {
                  angle: "trust_deficit",
                  trigger: "Trust signals < 35",
                  bestFor: "Low review count",
                  cta: "Audit Offer / Strategy Call",
                },
                {
                  angle: "missed_revenue",
                  trigger: "Service fit > 80 + strong website",
                  bestFor: "Established businesses",
                  cta: "Benchmark Report / Strategy Call",
                },
                {
                  angle: "competitive_threat",
                  trigger: "Urgency > 70 in HVAC/Restoration/Roofing",
                  bestFor: "Seasonal or competitive markets",
                  cta: "Quick Win Demo / Strategy Call",
                },
              ].map((row) => (
                <tr
                  key={row.angle}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30"
                >
                  <td className="px-3 py-2.5">
                    <OfferAngleChip angle={row.angle} />
                  </td>
                  <td className="px-3 py-2.5 text-slate-400">{row.trigger}</td>
                  <td className="px-3 py-2.5 text-slate-300">{row.bestFor}</td>
                  <td className="px-3 py-2.5 text-slate-500">{row.cta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "finder", label: "Lead Finder", icon: Search },
  { id: "staging", label: "Staging Queue", icon: Inbox },
  { id: "audit", label: "Audit Queue", icon: Globe },
  { id: "qualified", label: "Qualified Leads", icon: Target },
  { id: "drafts", label: "Outreach Drafts", icon: FileText },
  { id: "crm", label: "CRM Push Queue", icon: Users },
  { id: "sequences", label: "Sequences", icon: Send },
  { id: "performance", label: "Performance", icon: Zap },
  { id: "suppression", label: "Suppression", icon: MailX },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function OutreachAgentPage() {
  const [activeTab, setActiveTab] = useState<TabId>("finder");

  function renderTab() {
    switch (activeTab) {
      case "finder":
        return <LeadFinderTab />;
      case "staging":
        return <LeadStagingTab />;
      case "audit":
        return <WebsiteAuditTab />;
      case "qualified":
        return <QualifiedLeadsTab />;
      case "drafts":
        return <OutreachDraftsTab />;
      case "crm":
        return <CrmPushQueueTab />;
      case "sequences":
        return <SequenceManagerTab />;
      case "performance":
        return <PerformanceDashboardTab />;
      case "suppression":
        return <SuppressionListTab />;
      case "settings":
        return <AgentSettingsTab />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900 px-6 py-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                Outreach Intelligence Agent
              </h1>
              <p className="text-slate-400 text-sm">
                Discover, audit, qualify, and reach service businesses at scale.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs bg-emerald-900/40 border border-emerald-700/40 text-emerald-300 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Agent Active
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-amber-900/40 border border-amber-700/40 text-amber-300 px-3 py-1.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />2 pending approvals
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1.5 rounded-full">
              <Shield className="w-3 h-3" />
              Admin Only
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              data-ocid={`tab-${id}`}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? "border-indigo-500 text-indigo-300"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">{renderTab()}</div>
    </div>
  );
}
