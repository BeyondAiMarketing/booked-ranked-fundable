import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Database,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Layers,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useCredentials } from "../context/CredentialsContext";
import {
  DEMO_IMPORT_JOBS,
  DEMO_INGESTION_STATS,
  DEMO_LEAD_ENRICHMENTS,
  DEMO_NORMALIZED_LEADS,
  DEMO_RAW_RECORDS,
  DEMO_SOURCE_CONNECTORS,
  VERIFICATION_STATS,
} from "../data/openLeadLakeData";
import {
  isSimulatedLead,
  runDualModelLeadSearch,
  testSearxngConnection,
  testSerpApiConnection,
} from "../services/openSourceAdapters";
import type {
  DualModelSearchResult,
  ScoredLead,
} from "../services/openSourceAdapters";
import type {
  NormalizationStatus,
  NormalizedLead,
  RawLeadRecord,
  SourceConnectorConfig,
  SourceImportJob,
  SourceType,
  VerificationStatus,
} from "../types/openLeadLake";

// ─── AI Lead Finder — local types ────────────────────────────────────────────

type SearchPhase = "idle" | "running" | "done" | "staged";

interface ModelProgress {
  stage: string;
  pct: number;
  leadsFound: number;
  done: boolean;
}

const BRF_NICHES = [
  "Plumbing",
  "Med Spa",
  "HVAC",
  "Restoration",
  "Carpet Cleaning",
  "Roofing",
  "Real Estate",
  "Mortgage",
  "Chiropractic",
  "Dental",
] as const;

// ─── AI Lead Finder — sub-components ─────────────────────────────────────────

function TierBadge({ lead }: { lead: ScoredLead }) {
  if (lead.tier === "Hot")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-700/50">
        🔥 Hot · {lead.overallScore}
      </span>
    );
  if (lead.tier === "Warm")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50">
        ☁️ Warm · {lead.overallScore}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
      🧊 Cold · {lead.overallScore}
    </span>
  );
}

function SourceModelBadge({
  source,
}: { source: ScoredLead["researchSource"] }) {
  return source === "claude" ? (
    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-purple-900/60 text-purple-300 border border-purple-700/50">
      Claude
    </span>
  ) : (
    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
      OpenAI
    </span>
  );
}

function DataSourceBadge({ lead }: { lead: ScoredLead }) {
  const isDemo = isSimulatedLead(lead);
  if (isDemo) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-900/60 text-amber-300 border border-amber-600/60">
        ⚠ DEMO DATA
      </span>
    );
  }
  const source = lead.dataSource;
  if (source === "serpapi") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-600/60">
        ✓ LIVE
      </span>
    );
  }
  if (source === "searxng") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-900/60 text-blue-300 border border-blue-600/60">
        ✓ LIVE
      </span>
    );
  }
  return null;
}

function LeadCard({
  lead,
  onStage,
}: {
  lead: ScoredLead;
  onStage: (lead: ScoredLead) => void;
}) {
  const hasRating = lead.avgRating > 0;
  const hasReviews = lead.reviewCount > 0;
  const hasPhone = !!(lead.phone && lead.phone !== "unknown");
  const hasWebsite = !!(lead.website && lead.website !== "unknown");
  const hasGps = lead.gpsLat != null && lead.gpsLng != null;
  const gpsLink = hasGps
    ? `https://www.google.com/maps/search/?api=1&query=${lead.gpsLat},${lead.gpsLng}`
    : null;

  const openNowBadge = () => {
    if (lead.openNow === true)
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
          Open
        </span>
      );
    if (lead.openNow === false)
      return (
        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium bg-rose-900/60 text-rose-300 border border-rose-700/50">
          Closed
        </span>
      );
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 hover:border-slate-700 transition-colors">
      {/* 1. Business Name + model badge + data source badge */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-slate-100 font-bold text-sm leading-tight min-w-0 truncate">
          {lead.businessName}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <DataSourceBadge lead={lead} />
          <SourceModelBadge source={lead.researchSource} />
        </div>
      </div>

      {/* City + tier badge */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-400">
          {lead.city}
          {lead.state ? `, ${lead.state}` : ""}
        </span>
        <TierBadge lead={lead} />
      </div>

      {/* 2. Rating + Review Count */}
      {(hasRating || hasReviews) && (
        <div className="flex items-center gap-1.5">
          {hasRating && (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-300">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300 shrink-0" />
              {lead.avgRating.toFixed(1)}
            </span>
          )}
          {hasReviews && (
            <span className="text-xs text-slate-500">
              {hasRating ? "· " : ""}
              {lead.reviewCount.toLocaleString()} review
              {lead.reviewCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* 3. Open/Closed status */}
      {openNowBadge()}

      {/* 4. Phone */}
      {hasPhone && (
        <a
          href={`tel:${lead.phone}`}
          className="text-xs text-slate-400 flex items-center gap-1.5 truncate hover:text-slate-200 transition-colors"
        >
          <Phone className="w-3 h-3 shrink-0 text-slate-500" />
          {lead.phone}
        </a>
      )}

      {/* 5. Website */}
      {hasWebsite && (
        <a
          href={
            lead.website.startsWith("http")
              ? lead.website
              : `https://${lead.website}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-400 flex items-center gap-1.5 truncate hover:text-indigo-300 transition-colors"
        >
          <Globe className="w-3 h-3 shrink-0 text-indigo-500" />
          {lead.website.replace(/^https?:\/\//, "").split("/")[0]}
        </a>
      )}

      {/* 6. GPS Link */}
      {gpsLink && (
        <a
          href={gpsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-500 flex items-center gap-1.5 truncate hover:text-slate-300 transition-colors"
        >
          <MapPin className="w-3 h-3 shrink-0" />
          View on Google Maps
        </a>
      )}

      {lead.validationFlags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {lead.validationFlags.slice(0, 3).map((flag) => (
            <span
              key={flag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-400 border border-amber-700/30"
            >
              {flag.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onStage(lead)}
        className="w-full text-xs font-medium text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/30 rounded-lg py-1.5 transition-colors"
        data-ocid="ai-lead-finder.stage-lead-button"
      >
        Stage for Audit
      </button>
    </div>
  );
}

function ModelProgressTrack({
  label,
  city,
  niche,
  progress,
  color,
}: {
  label: string;
  city: string;
  niche: string;
  progress: ModelProgress;
  color: "purple" | "green";
}) {
  const barCls =
    color === "purple"
      ? "bg-gradient-to-r from-purple-600 to-purple-500"
      : "bg-gradient-to-r from-emerald-600 to-emerald-500";
  const borderCls =
    color === "purple" ? "border-purple-700/50" : "border-emerald-700/50";
  const textCls = color === "purple" ? "text-purple-300" : "text-emerald-300";
  const bgCls = color === "purple" ? "bg-purple-900/20" : "bg-emerald-900/20";

  return (
    <div
      className={`flex-1 min-w-0 rounded-xl border ${borderCls} ${bgCls} p-4 space-y-3`}
    >
      <div className="flex items-center gap-2">
        <Bot className={`w-4 h-4 ${textCls} shrink-0`} />
        <div className="min-w-0">
          <p className={`text-xs font-bold ${textCls}`}>{label}</p>
          <p className="text-slate-500 text-xs truncate">
            → {city || "—"} · {niche}
          </p>
        </div>
        {progress.done && (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
        )}
        {!progress.done && (
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 border-t-transparent ${color === "purple" ? "border-purple-400" : "border-emerald-400"} animate-spin ml-auto shrink-0`}
          />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-xs">{progress.stage}</p>
          <span className="text-xs font-mono text-slate-500">
            {progress.pct}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${barCls} rounded-full transition-all duration-500`}
            style={{ width: `${progress.pct}%` }}
          />
        </div>
      </div>

      {progress.done && progress.leadsFound > 0 && (
        <p className={`text-xs font-semibold ${textCls}`}>
          Done — {progress.leadsFound} leads found
        </p>
      )}
    </div>
  );
}

// ─── AI Lead Finder Tab ───────────────────────────────────────────────────────

function AILeadFinderTab() {
  const { creds } = useCredentials();

  // Form state
  const [niche, setNiche] = useState<string>("Plumbing");
  const [cityA, setCityA] = useState("");
  const [cityB, setCityB] = useState("");
  const [leadsPerCity, setLeadsPerCity] = useState(50);

  // Search state
  const [phase, setPhase] = useState<SearchPhase>("idle");
  const [claudeProgress, setClaudeProgress] = useState<ModelProgress>({
    stage: "Waiting…",
    pct: 0,
    leadsFound: 0,
    done: false,
  });
  const [openaiProgress, setOpenaiProgress] = useState<ModelProgress>({
    stage: "Waiting…",
    pct: 0,
    leadsFound: 0,
    done: false,
  });
  const [mergingVisible, setMergingVisible] = useState(false);
  const [results, setResults] = useState<DualModelSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchErrors, setSearchErrors] = useState<{
    serpApi?: string;
    searxng?: string;
  } | null>(null);
  const [quickCheckState, setQuickCheckState] = useState<
    "idle" | "checking" | "done"
  >("idle");
  const [quickCheckResults, setQuickCheckResults] = useState<{
    serpApi: string;
    serpApiOk: boolean;
    searxng: string;
    searxngOk: boolean;
  } | null>(null);
  const [stagedCount, setStagedCount] = useState(0);
  const [stagedJobId] = useState<string>(`search-${Date.now()}`);

  const canLaunch =
    cityA.trim().length > 0 && cityB.trim().length > 0 && phase !== "running";

  const hasNoKeys = !creds?.claudeKey?.trim() && !creds?.openaiKey?.trim();
  const hasNoDataSource =
    !creds?.serpApiKey?.trim() &&
    !creds?.serpApiDevKey?.trim() &&
    !creds?.searxngUrl?.trim();

  async function handleQuickCheck() {
    setQuickCheckState("checking");
    setQuickCheckResults(null);
    const [serpResult, searxngResult] = await Promise.all([
      testSerpApiConnection(creds?.serpApiKey ?? ""),
      testSearxngConnection(creds?.searxngUrl ?? ""),
    ]);
    setQuickCheckResults({
      serpApi: serpResult.message,
      serpApiOk: serpResult.status === "connected",
      searxng: searxngResult.message,
      searxngOk: searxngResult.status === "connected",
    });
    setQuickCheckState("done");
  }

  async function handleLoadDemoData() {
    const { generateFallbackLeads } = await import(
      "../services/openSourceAdapters"
    );
    const demoA = generateFallbackLeads(niche, cityA || "Dallas, TX", 10);
    const demoB = generateFallbackLeads(niche, cityB || "Houston, TX", 10);
    const combined = [...demoA, ...demoB] as ScoredLead[];
    setResults({
      claudeLeads: demoA as ScoredLead[],
      openaiLeads: demoB as ScoredLead[],
      mergedLeads: combined,
      duplicatesRemoved: 0,
      cityA: cityA || "Dallas, TX",
      cityB: cityB || "Houston, TX",
      niche,
      usingFallback: true,
    });
    setError(null);
    setSearchErrors(null);
    setPhase("done");
  }

  async function handleLaunch() {
    if (!canLaunch) return;
    setPhase("running");
    setError(null);
    setSearchErrors(null);
    setResults(null);
    setMergingVisible(false);
    setStagedCount(0);

    // Step 0: Pre-flight key validation - abort immediately on bad credentials
    setClaudeProgress({
      stage: "Checking connections...",
      pct: 5,
      leadsFound: 0,
      done: false,
    });
    setOpenaiProgress({
      stage: "Checking connections...",
      pct: 5,
      leadsFound: 0,
      done: false,
    });

    const [serpCheck, searxngCheck] = await Promise.all([
      testSerpApiConnection(creds?.serpApiKey ?? ""),
      testSearxngConnection(creds?.searxngUrl ?? ""),
    ]);

    const serpConnected = serpCheck.status === "connected";
    const searxngConnected = searxngCheck.status === "connected";

    if (!serpConnected && !searxngConnected) {
      setSearchErrors({
        serpApi: serpCheck.message,
        searxng: searxngCheck.message,
      });
      setPhase("idle");
      return;
    }

    // Stagger progress updates to simulate parallel model activity
    setClaudeProgress({
      stage: "Fetching listings…",
      pct: 10,
      leadsFound: 0,
      done: false,
    });
    setOpenaiProgress({
      stage: "Fetching listings…",
      pct: 10,
      leadsFound: 0,
      done: false,
    });

    const claudeStages = [
      { stage: "Fetching listings…", pct: 15 },
      { stage: "Scoring leads…", pct: 45 },
      { stage: "Applying anti-hallucination rules…", pct: 70 },
      { stage: "Finalizing scores…", pct: 90 },
    ];
    const openaiStages = [
      { stage: "Fetching listings…", pct: 20 },
      { stage: "Scoring leads…", pct: 50 },
      { stage: "Validating output…", pct: 75 },
      { stage: "Finalizing scores…", pct: 92 },
    ];

    // Animate progress independently for each model
    let cIdx = 0;
    let oIdx = 0;
    const tick = setInterval(() => {
      if (cIdx < claudeStages.length) {
        const s = claudeStages[cIdx];
        setClaudeProgress((p) => ({ ...p, stage: s.stage, pct: s.pct }));
        cIdx++;
      }
      if (oIdx < openaiStages.length) {
        const s = openaiStages[oIdx];
        setOpenaiProgress((p) => ({ ...p, stage: s.stage, pct: s.pct }));
        oIdx++;
      }
      if (cIdx >= claudeStages.length && oIdx >= openaiStages.length) {
        clearInterval(tick);
      }
    }, 900);

    try {
      // Log credential state for debugging
      console.log("Lead search credentials:", {
        hasSerpApi: !!creds?.serpApiKey?.trim(),
        hasSearxng: !!creds?.searxngUrl?.trim(),
        hasClaudeKey: !!creds?.claudeKey?.trim(),
        hasOpenaiKey: !!creds?.openaiKey?.trim(),
      });

      const res = await runDualModelLeadSearch({
        niche,
        cityA,
        cityB,
        claudeKey: creds?.claudeKey ?? undefined,
        openaiKey: creds?.openaiKey ?? undefined,
        searxngUrl: creds?.searxngUrl ?? undefined,
        serpApiKey: creds?.serpApiDevKey || creds?.serpApiKey || undefined,
        onProgress: (stage, pct) => {
          if (pct <= 50) {
            setClaudeProgress((p) => ({
              ...p,
              stage,
              pct: Math.min(pct * 2, 95),
            }));
          } else {
            setMergingVisible(true);
          }
        },
        onError: (errs) => {
          const serpMsg = errs.cityA?.serpApi ?? errs.cityB?.serpApi ?? "";
          const searxngMsg = errs.cityA?.searxng ?? errs.cityB?.searxng ?? "";
          setSearchErrors({ serpApi: serpMsg, searxng: searxngMsg });
        },
      });

      clearInterval(tick);

      setClaudeProgress({
        stage: "Done",
        pct: 100,
        leadsFound: res.claudeLeads.length,
        done: true,
      });
      setOpenaiProgress({
        stage: "Done",
        pct: 100,
        leadsFound: res.openaiLeads.length,
        done: true,
      });
      setMergingVisible(true);

      // Brief pause to show merge banner
      await new Promise((r) => setTimeout(r, 800));

      if (res.mergedLeads.length === 0) {
        const errs = res.sourceErrors;
        if (errs) {
          setSearchErrors({
            serpApi: errs.cityA?.serpApi ?? errs.cityB?.serpApi,
            searxng: errs.cityA?.searxng ?? errs.cityB?.searxng,
          });
        } else {
          setError(
            "No leads found. Try a different niche or city, or check your integration settings.",
          );
        }
        setPhase("idle");
        return;
      }

      setResults(res);
      setPhase("done");
    } catch (err) {
      clearInterval(tick);
      setPhase("idle");
      const msg = err instanceof Error ? err.message : "Search failed";
      setError(`Search error: ${msg}`);
    }
  }

  function handleStageLeads(leads: ScoredLead[]) {
    // Simulate backend staging — in production calls stageBulkLeadsFromSearch
    setStagedCount(leads.length);
    setPhase("staged");
  }

  function handleReset() {
    setPhase("idle");
    setResults(null);
    setError(null);
    setSearchErrors(null);
    setQuickCheckState("idle");
    setQuickCheckResults(null);
    setStagedCount(0);
    setMergingVisible(false);
    setClaudeProgress({
      stage: "Waiting…",
      pct: 0,
      leadsFound: 0,
      done: false,
    });
    setOpenaiProgress({
      stage: "Waiting…",
      pct: 0,
      leadsFound: 0,
      done: false,
    });
  }

  const hotLeads = results?.mergedLeads.filter((l) => l.tier === "Hot") ?? [];
  const warmLeads = results?.mergedLeads.filter((l) => l.tier === "Warm") ?? [];
  const coldLeads = results?.mergedLeads.filter((l) => l.tier === "Cold") ?? [];

  return (
    <div className="space-y-5" data-ocid="ai-lead-finder.panel">
      {/* Section 1 — Config Card */}
      <div
        className="bg-slate-900/80 border border-purple-700/40 rounded-2xl p-5 space-y-5 shadow-lg"
        style={{ borderTopWidth: 2, borderTopColor: "rgba(147,51,234,0.6)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-slate-100 font-bold text-sm">
            AI Lead Finder — Dual-Model Search
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 font-medium">
            Claude + OpenAI
          </span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">
          Claude searches City A, OpenAI searches City B simultaneously — each
          pulling up to {leadsPerCity} real leads from SerpAPI (or SearXNG as
          fallback), then scoring them with anti-hallucination prompts. Results
          are merged, deduplicated, and ranked Hot / Warm / Cold.
        </p>

        {/* Key warnings */}
        {hasNoKeys && (
          <div className="flex items-start gap-2 bg-amber-900/20 border border-amber-700/40 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-300 text-xs leading-relaxed">
              No AI keys connected. Add your Claude or OpenAI key in{" "}
              <a href="/go-live" className="underline hover:text-amber-200">
                Go Live
              </a>{" "}
              to enable scoring. Searches will still fetch listings from
              SearXNG.
            </p>
          </div>
        )}
        {hasNoDataSource && (
          <div className="flex items-start gap-2 bg-blue-900/20 border border-blue-700/40 rounded-lg p-3">
            <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-blue-300 text-xs leading-relaxed">
              No live data source configured. Add your{" "}
              <a href="/go-live" className="underline hover:text-blue-200">
                SerpAPI key or SearXNG URL in Go Live
              </a>{" "}
              to fetch real business listings. Search will return no results
              without a data source.
            </p>
          </div>
        )}

        {/* Search error banner — shown when both data sources failed */}
        {searchErrors && (
          <div
            className="flex items-start gap-3 bg-rose-900/20 border border-rose-700/50 rounded-xl p-4 space-y-2"
            data-ocid="ai-lead-finder.search.error_state"
          >
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-2">
              <p className="text-rose-300 font-bold text-sm">
                Lead search failed — no real business data returned
              </p>
              {searchErrors.serpApi && (
                <div className="flex items-start gap-1.5">
                  <span className="text-rose-400 text-xs font-semibold shrink-0">
                    SerpApi:
                  </span>
                  <span className="text-rose-400/80 text-xs">
                    {searchErrors.serpApi}
                  </span>
                </div>
              )}
              {searchErrors.searxng && (
                <div className="flex items-start gap-1.5">
                  <span className="text-rose-400 text-xs font-semibold shrink-0">
                    SearXNG:
                  </span>
                  <span className="text-rose-400/80 text-xs">
                    {searchErrors.searxng}
                  </span>
                </div>
              )}
              <p className="text-rose-400/70 text-xs">
                Fix your credentials in{" "}
                <a
                  href="/go-live"
                  className="underline text-rose-300 hover:text-rose-200"
                >
                  Go Live → Lead Discovery
                </a>
                , then retry.
              </p>
              <button
                type="button"
                onClick={handleLoadDemoData}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-900/40 border border-amber-700/50 text-amber-300 hover:bg-amber-900/60 transition-colors mt-1"
                data-ocid="ai-lead-finder.load-demo-button"
              >
                Load Sample Demo Data
              </button>
            </div>
          </div>
        )}

        {/* Quick-check integration status */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleQuickCheck}
            disabled={quickCheckState === "checking"}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:border-purple-600/50 hover:text-purple-300 transition-colors disabled:opacity-50"
            data-ocid="ai-lead-finder.quick-check-button"
          >
            {quickCheckState === "checking" ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3" /> Check Integrations
              </>
            )}
          </button>
          {quickCheckResults && (
            <>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${
                  quickCheckResults.serpApiOk
                    ? "bg-emerald-900/40 border-emerald-700/50 text-emerald-300"
                    : "bg-rose-900/40 border-rose-700/50 text-rose-300"
                }`}
              >
                {quickCheckResults.serpApiOk ? "✓" : "✗"} SerpApi:{" "}
                {quickCheckResults.serpApi.split("—")[0].trim()}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${
                  quickCheckResults.searxngOk
                    ? "bg-emerald-900/40 border-emerald-700/50 text-emerald-300"
                    : "bg-rose-900/40 border-rose-700/50 text-rose-300"
                }`}
              >
                {quickCheckResults.searxngOk ? "✓" : "✗"} SearXNG:{" "}
                {quickCheckResults.searxng.split("—")[0].trim()}
              </span>
            </>
          )}
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Niche */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="alf-niche"
              className="text-slate-400 text-xs font-medium block mb-1.5"
            >
              Niche
            </label>
            <select
              id="alf-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              disabled={phase === "running"}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm disabled:opacity-50"
              data-ocid="ai-lead-finder.niche-select"
            >
              {BRF_NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* City A — Claude */}
          <div>
            <label
              htmlFor="alf-city-a"
              className="text-slate-400 text-xs font-medium block mb-1.5 flex items-center gap-1.5"
            >
              City A
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">
                Claude
              </span>
            </label>
            <input
              id="alf-city-a"
              value={cityA}
              onChange={(e) => setCityA(e.target.value)}
              disabled={phase === "running"}
              placeholder="e.g. Dallas, TX"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 disabled:opacity-50"
              data-ocid="ai-lead-finder.city-a-input"
            />
          </div>

          {/* City B — OpenAI */}
          <div>
            <label
              htmlFor="alf-city-b"
              className="text-slate-400 text-xs font-medium block mb-1.5 flex items-center gap-1.5"
            >
              City B
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                OpenAI
              </span>
            </label>
            <input
              id="alf-city-b"
              value={cityB}
              onChange={(e) => setCityB(e.target.value)}
              disabled={phase === "running"}
              placeholder="e.g. Houston, TX"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 disabled:opacity-50"
              data-ocid="ai-lead-finder.city-b-input"
            />
          </div>

          {/* Leads per city */}
          <div>
            <label
              htmlFor="alf-leads-per-city"
              className="text-slate-400 text-xs font-medium block mb-1.5"
            >
              Leads per city (max 100)
            </label>
            <input
              id="alf-leads-per-city"
              type="number"
              min={1}
              max={100}
              value={leadsPerCity}
              onChange={(e) =>
                setLeadsPerCity(
                  Math.min(
                    100,
                    Math.max(1, Number.parseInt(e.target.value) || 50),
                  ),
                )
              }
              disabled={phase === "running"}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm disabled:opacity-50"
              data-ocid="ai-lead-finder.leads-per-city-input"
            />
          </div>
        </div>

        {/* Launch button */}
        <button
          type="button"
          onClick={handleLaunch}
          disabled={!canLaunch}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canLaunch
              ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)"
              : undefined,
          }}
          data-ocid="ai-lead-finder.launch-button"
        >
          {phase === "running" ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Searching…
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Launch Dual Search
            </>
          )}
        </button>

        {error && (
          <div
            className="flex items-start gap-2 bg-rose-900/20 border border-rose-700/40 rounded-lg p-3"
            data-ocid="ai-lead-finder.error-state"
          >
            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-rose-300 text-xs leading-relaxed">{error}</p>
          </div>
        )}
      </div>

      {/* Section 2 — Progress (running only) */}
      {(phase === "running" || (phase === "done" && !results)) && (
        <div className="space-y-4" data-ocid="ai-lead-finder.progress-section">
          <div className="flex flex-col sm:flex-row gap-4">
            <ModelProgressTrack
              label="Claude"
              city={cityA}
              niche={niche}
              progress={claudeProgress}
              color="purple"
            />
            <ModelProgressTrack
              label="OpenAI"
              city={cityB}
              niche={niche}
              progress={openaiProgress}
              color="green"
            />
          </div>

          {mergingVisible && (
            <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-3">
              <Layers className="w-4 h-4 text-indigo-400 animate-pulse" />
              Merging results and removing duplicates…
            </div>
          )}
        </div>
      )}

      {/* Section 3 — Results */}
      {phase === "done" && results && (
        <div className="space-y-4" data-ocid="ai-lead-finder.results-section">
          {/* Fallback notice when real data sources were unavailable */}
          {results.usingFallback && (
            <div className="flex items-start gap-3 bg-yellow-500/15 border-2 border-yellow-500/50 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 text-sm font-semibold leading-snug">
                  ⚠️ Showing sample demo data — not real business leads.
                </p>
                <p className="text-yellow-400/80 text-xs mt-1 leading-relaxed">
                  Use the{" "}
                  <strong className="text-yellow-300">Search tab above</strong>{" "}
                  to find real leads. Add your SerpApi key or SearXNG URL in{" "}
                  <a
                    href="/go-live"
                    className="underline hover:text-yellow-200"
                  >
                    Go Live
                  </a>{" "}
                  to unlock live business data.
                </p>
              </div>
            </div>
          )}
          {/* Summary banner */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-5 py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-100 font-semibold text-sm">
                Found {results.mergedLeads.length} leads
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-700/50 font-medium">
                🔥 {hotLeads.length} Hot
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50 font-medium">
                ☁️ {warmLeads.length} Warm
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 font-medium">
                🧊 {coldLeads.length} Cold
              </span>
              {results.duplicatesRemoved > 0 && (
                <span className="text-xs text-slate-500">
                  · {results.duplicatesRemoved} duplicates removed
                </span>
              )}
            </div>
          </div>

          {/* Bulk action buttons */}
          <div className="flex flex-wrap gap-2">
            {hotLeads.length > 0 && (
              <button
                type="button"
                onClick={() => handleStageLeads(hotLeads)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                }}
                data-ocid="ai-lead-finder.stage-hot-leads-button"
              >
                <Zap className="w-3.5 h-3.5" />
                Stage All Hot Leads ({hotLeads.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => handleStageLeads(results.mergedLeads)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
              }}
              data-ocid="ai-lead-finder.stage-all-leads-button"
            >
              <Upload className="w-3.5 h-3.5" />
              Stage All {results.mergedLeads.length} Leads
            </button>
          </div>

          {/* Lead cards grid */}
          {results.mergedLeads.length === 0 ? (
            <div
              className="text-center py-12 text-slate-500 text-sm"
              data-ocid="ai-lead-finder.empty-state"
            >
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
              No leads found. Try different cities or a different niche.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.mergedLeads.map((lead, idx) => (
                <div
                  key={`${lead.businessName}-${idx}`}
                  data-ocid={`ai-lead-finder.lead-card.${idx + 1}`}
                >
                  <LeadCard
                    lead={lead}
                    onStage={(l) => handleStageLeads([l])}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 4 — Staged Confirmation */}
      {phase === "staged" && (
        <div className="space-y-4" data-ocid="ai-lead-finder.staged-section">
          <div className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-700/40 rounded-xl px-5 py-4">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-emerald-300 font-bold text-sm">
                {stagedCount} leads staged for AI audit
              </p>
              <p className="text-emerald-400/70 text-xs mt-0.5">
                Job ID: {stagedJobId}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              data-ocid="ai-lead-finder.run-another-button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Run Another Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simulated approved IDs — in production these come from backend browserAudit state
const BROWSER_VERIFIED_IDS = new Set(["lead-001", "lead-003", "lead-005"]);
const BROWSER_PENDING_IDS = new Set(["lead-002", "lead-004"]);

function BrowserAuditBadge({
  leadId,
  hasAutoBrowserUrl,
}: { leadId: string; hasAutoBrowserUrl: boolean }) {
  if (!hasAutoBrowserUrl) return null;
  if (BROWSER_VERIFIED_IDS.has(leadId)) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium border bg-purple-900/60 text-purple-300 border-purple-700/50"
        data-ocid={`open-lead-lake.browser-verified-badge.${leadId}`}
      >
        <Shield className="w-2.5 h-2.5" />
        Verified
      </span>
    );
  }
  if (BROWSER_PENDING_IDS.has(leadId)) {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium border bg-slate-700 text-slate-400 border-slate-600"
        data-ocid={`open-lead-lake.browser-pending-badge.${leadId}`}
      >
        <Clock className="w-2.5 h-2.5" />
        Awaiting Visual Check
      </span>
    );
  }
  return null;
}

const SOURCE_LABELS: Record<SourceType, string> = {
  openstreetmap: "OpenStreetMap",
  opencorporates: "OpenCorporates",
  gleif: "GLEIF",
  commoncrawl: "Common Crawl",
  csv: "CSV/JSON",
  json: "JSON",
};

const SOURCE_COLORS: Record<SourceType, string> = {
  openstreetmap: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  opencorporates: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  gleif: "bg-purple-900/60 text-purple-300 border-purple-700/50",
  commoncrawl: "bg-amber-900/60 text-amber-300 border-amber-700/50",
  csv: "bg-indigo-900/60 text-indigo-300 border-indigo-700/50",
  json: "bg-cyan-900/60 text-cyan-300 border-cyan-700/50",
};

function SourceBadge({ type }: { type: SourceType }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${SOURCE_COLORS[type]}`}
    >
      {SOURCE_LABELS[type]}
    </span>
  );
}

function ImportStatusBadge({ status }: { status: SourceImportJob["status"] }) {
  const map = {
    running: "bg-blue-900/60 text-blue-300 border-blue-700/50 animate-pulse",
    completed: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    failed: "bg-rose-900/60 text-rose-300 border-rose-700/50",
    partial: "bg-amber-900/60 text-amber-300 border-amber-700/50",
    pending: "bg-slate-700 text-slate-300 border-slate-600",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${map[status]}`}
    >
      {status}
    </span>
  );
}

function NormStatusBadge({ status }: { status: NormalizationStatus }) {
  const map: Record<NormalizationStatus, string> = {
    raw: "bg-slate-700 text-slate-300 border-slate-600",
    normalized: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    duplicate: "bg-amber-900/60 text-amber-300 border-amber-700/50",
    suppressed: "bg-rose-900/60 text-rose-300 border-rose-700/50",
    promoted: "bg-indigo-900/60 text-indigo-300 border-indigo-700/50",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${map[status]}`}
    >
      {status}
    </span>
  );
}

function ConfidenceBadge({
  conf,
}: { conf: NormalizedLead["sourceConfidence"] }) {
  const map = {
    high: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
    medium: "bg-amber-900/60 text-amber-300 border-amber-700/50",
    low: "bg-rose-900/60 text-rose-300 border-rose-700/50",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium border ${map[conf]}`}
    >
      {conf}
    </span>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
        ? "bg-amber-500"
        : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-mono text-slate-400 w-7 text-right">
        {score}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-lg p-4 border-t-2 ${accent ?? "border-t-indigo-600"}`}
    >
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-100">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Verification Badge ───────────────────────────────────────────────────────

const VERIFICATION_BADGE: Record<
  VerificationStatus,
  { label: string; icon: React.ReactNode; cls: string }
> = {
  verified: {
    label: "Verified",
    icon: <CheckCircle className="w-3 h-3" />,
    cls: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  },
  invalid: {
    label: "Invalid",
    icon: <XCircle className="w-3 h-3" />,
    cls: "bg-rose-900/60 text-rose-300 border-rose-700/50",
  },
  pending: {
    label: "Pending",
    icon: <Clock className="w-3 h-3" />,
    cls: "bg-amber-900/60 text-amber-300 border-amber-700/50",
  },
  unverified: {
    label: "Unverified",
    icon: <HelpCircle className="w-3 h-3" />,
    cls: "bg-slate-700 text-slate-400 border-slate-600",
  },
};

function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { label, icon, cls } = VERIFICATION_BADGE[status];
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded font-medium border flex items-center gap-1 w-fit ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────

function Tooltip({
  children,
  content,
}: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none whitespace-normal text-center">
          {content}
        </span>
      )}
    </span>
  );
}

// ─── Tab 1: Source Imports ────────────────────────────────────────────────────

function SourceImportsTab() {
  const [expandedErrors, setExpandedErrors] = useState<string | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [runSource, setRunSource] = useState<SourceType>("openstreetmap");
  const [runNiche, setRunNiche] = useState("Plumbing");
  const [runCity, setRunCity] = useState("Dallas");
  const [runState, setRunState] = useState("TX");
  const [runKeyword, setRunKeyword] = useState("");

  const stats = DEMO_INGESTION_STATS;

  return (
    <div className="space-y-5">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total Imported"
          value={stats.totalImported}
          accent="border-t-indigo-600"
        />
        <StatCard
          label="Normalized"
          value={stats.totalNormalized}
          accent="border-t-emerald-600"
        />
        <StatCard
          label="Duplicates Found"
          value={stats.totalDuplicates}
          accent="border-t-amber-600"
        />
        <StatCard
          label="Promoted to CRM"
          value={stats.totalPromotedToCRM}
          accent="border-t-purple-600"
        />
      </div>

      {/* Header + Run button */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-100 font-semibold text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" /> Import Jobs
        </h3>
        <button
          type="button"
          onClick={() => setShowRunModal(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          data-ocid="open-lead-lake.run-import-button"
        >
          <Upload className="w-3.5 h-3.5" /> Run Import
        </button>
      </div>

      {/* Run Import Modal */}
      {showRunModal && (
        <div className="bg-slate-800/80 border border-indigo-700/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-indigo-300 text-sm font-semibold">
              Configure Import Job
            </span>
            <button
              type="button"
              onClick={() => setShowRunModal(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Close"
              data-ocid="open-lead-lake.close-modal-button"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="run-source"
                className="text-slate-400 text-xs mb-1 block"
              >
                Source
              </label>
              <select
                id="run-source"
                value={runSource}
                onChange={(e) => setRunSource(e.target.value as SourceType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                data-ocid="open-lead-lake.source-select"
              >
                <option value="openstreetmap">OpenStreetMap</option>
                <option value="opencorporates">OpenCorporates</option>
                <option value="csv">CSV / JSON</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="run-niche"
                className="text-slate-400 text-xs mb-1 block"
              >
                Niche
              </label>
              <select
                id="run-niche"
                value={runNiche}
                onChange={(e) => setRunNiche(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                data-ocid="open-lead-lake.niche-select"
              >
                {[
                  "Plumbing",
                  "HVAC",
                  "Roofing",
                  "Restoration",
                  "Med Spa",
                  "Carpet Cleaning",
                ].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="run-city"
                className="text-slate-400 text-xs mb-1 block"
              >
                City
              </label>
              <input
                id="run-city"
                value={runCity}
                onChange={(e) => setRunCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                placeholder="Dallas"
                data-ocid="open-lead-lake.city-input"
              />
            </div>
            <div>
              <label
                htmlFor="run-state"
                className="text-slate-400 text-xs mb-1 block"
              >
                State
              </label>
              <input
                id="run-state"
                value={runState}
                onChange={(e) => setRunState(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                placeholder="TX"
                data-ocid="open-lead-lake.state-input"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="run-keyword"
                className="text-slate-400 text-xs mb-1 block"
              >
                Keyword (optional)
              </label>
              <input
                id="run-keyword"
                value={runKeyword}
                onChange={(e) => setRunKeyword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm"
                placeholder="e.g. emergency plumber"
                data-ocid="open-lead-lake.keyword-input"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowRunModal(false)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
              data-ocid="open-lead-lake.confirm-import-button"
            >
              <Zap className="w-3.5 h-3.5" /> Start Import
            </button>
            <button
              type="button"
              onClick={() => setShowRunModal(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              data-ocid="open-lead-lake.cancel-import-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Import Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Source
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Status
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Filters
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Total
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Normalized
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Dupes
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                By
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Started
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_IMPORT_JOBS.map((job) => (
              <>
                <tr
                  key={job.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30"
                  data-ocid={`open-lead-lake.import-job.${DEMO_IMPORT_JOBS.indexOf(job) + 1}`}
                >
                  <td className="px-4 py-3">
                    <SourceBadge type={job.sourceType} />
                  </td>
                  <td className="px-4 py-3">
                    <ImportStatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs max-w-[180px]">
                    <span className="truncate block">
                      {[
                        job.filters?.niche,
                        job.filters?.city,
                        job.filters?.state,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300 text-xs">
                    {job.totalRecords || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-400 text-xs">
                    {job.normalizedRecords || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-amber-400 text-xs">
                    {job.duplicatesFound || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs capitalize">
                    {job.triggeredBy}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(job.startedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {job.errorCount > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedErrors(
                              expandedErrors === job.id ? null : job.id,
                            )
                          }
                          className="text-xs text-rose-400 hover:text-rose-300 border border-rose-700/40 px-2 py-1 rounded transition-colors"
                          data-ocid={`open-lead-lake.view-errors-${job.id}`}
                        >
                          {job.errorCount} errors
                        </button>
                      )}
                      <button
                        type="button"
                        className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700/40 px-2 py-1 rounded transition-colors"
                        data-ocid={`open-lead-lake.view-job-${job.id}`}
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 px-2 py-1 rounded transition-colors"
                        data-ocid={`open-lead-lake.rerun-job-${job.id}`}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedErrors === job.id && job.errors && (
                  <tr
                    key={`${job.id}-errors`}
                    className="border-b border-slate-800/50 bg-rose-900/10"
                  >
                    <td colSpan={9} className="px-5 py-3">
                      <p className="text-rose-300 text-xs font-semibold mb-1.5">
                        Error Log:
                      </p>
                      <ul className="space-y-1">
                        {job.errors.map((err, i) => (
                          <li
                            key={`${job.id}-err-${i}`}
                            className="text-rose-400 text-xs flex items-start gap-1.5"
                          >
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                            {err}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 2: Source Settings ────────────────────────────────────────────────────

function SourceSettingsTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [connectors, setConnectors] = useState<SourceConnectorConfig[]>(
    DEMO_SOURCE_CONNECTORS,
  );

  function toggleEnabled(id: string) {
    setConnectors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    );
  }

  const SOURCE_ICONS: Record<SourceType, React.ReactNode> = {
    openstreetmap: <Globe className="w-5 h-5 text-emerald-400" />,
    opencorporates: <Building2 className="w-5 h-5 text-blue-400" />,
    gleif: <Database className="w-5 h-5 text-purple-400" />,
    commoncrawl: <Search className="w-5 h-5 text-amber-400" />,
    csv: <FileText className="w-5 h-5 text-indigo-400" />,
    json: <FileText className="w-5 h-5 text-cyan-400" />,
  };

  return (
    <div className="space-y-5">
      {/* Quick Start Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-800/30 transition-colors"
          data-ocid="open-lead-lake.quickstart-toggle"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-slate-200 font-medium text-sm">
              Quick Start Guide
            </span>
          </div>
          {guideOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>
        {guideOpen && (
          <div className="px-5 pb-5 space-y-3 border-t border-slate-800">
            <p className="text-slate-400 text-xs leading-relaxed pt-3">
              Start with these sources in order for the best initial results:
            </p>
            <div className="space-y-2">
              {[
                {
                  step: "1",
                  label: "OpenStreetMap / Nominatim",
                  desc: "Free, no API key, excellent for local business discovery. Start here.",
                  color: "text-emerald-400",
                },
                {
                  step: "2",
                  label: "CSV / JSON Upload",
                  desc: "Import any existing list you have — purchased, exported, or manual.",
                  color: "text-indigo-400",
                },
                {
                  step: "3",
                  label: "OpenCorporates",
                  desc: "Layer on for entity verification and legal name normalization.",
                  color: "text-blue-400",
                },
                {
                  step: "4",
                  label: "GLEIF & Common Crawl",
                  desc: "Advanced — enable once you have volume. Requires file download.",
                  color: "text-purple-400",
                },
              ].map(({ step, label, desc, color }) => (
                <div key={step} className="flex items-start gap-3">
                  <span
                    className={`w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${color}`}
                  >
                    {step}
                  </span>
                  <div>
                    <p className="text-slate-200 text-xs font-medium">
                      {label}
                    </p>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connector Cards */}
      <div className="grid grid-cols-1 gap-4">
        {connectors.map((conn) => {
          const isExpanded = expandedId === conn.id;
          return (
            <div
              key={conn.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              data-ocid={`open-lead-lake.connector-${conn.sourceType}`}
            >
              <div className="flex items-start justify-between p-4 gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                    {SOURCE_ICONS[conn.sourceType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-slate-100 font-semibold text-sm">
                        {conn.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          conn.status === "active"
                            ? "bg-emerald-900/60 text-emerald-300 border-emerald-700/50"
                            : conn.status === "error"
                              ? "bg-rose-900/60 text-rose-300 border-rose-700/50"
                              : "bg-slate-700 text-slate-400 border-slate-600"
                        }`}
                      >
                        {conn.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {conn.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {conn.lastSync && (
                        <span className="text-slate-600 text-xs">
                          Last sync:{" "}
                          {new Date(conn.lastSync).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {conn.recordsIngested !== undefined &&
                        conn.recordsIngested > 0 && (
                          <span className="text-slate-500 text-xs">
                            {conn.recordsIngested.toLocaleString()} records
                            ingested
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleEnabled(conn.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${conn.enabled ? "bg-indigo-600" : "bg-slate-700"}`}
                    aria-label={
                      conn.enabled ? "Disable connector" : "Enable connector"
                    }
                    data-ocid={`open-lead-lake.connector-toggle-${conn.sourceType}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${conn.enabled ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : conn.id)}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700/40 px-3 py-1.5 rounded-lg transition-colors"
                    data-ocid={`open-lead-lake.connector-configure-${conn.sourceType}`}
                  >
                    <Settings className="w-3 h-3" /> Configure
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-800 px-5 py-4 space-y-4 bg-slate-800/20">
                  {/* Endpoint URL */}
                  {conn.sourceType !== "csv" && conn.sourceType !== "json" && (
                    <div>
                      <label
                        htmlFor={`endpoint-${conn.id}`}
                        className="text-slate-400 text-xs font-medium block mb-1"
                      >
                        Endpoint URL
                      </label>
                      <input
                        id={`endpoint-${conn.id}`}
                        defaultValue={conn.endpointUrl}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm font-mono"
                        placeholder="https://..."
                        data-ocid={`open-lead-lake.endpoint-input-${conn.sourceType}`}
                      />
                    </div>
                  )}
                  {conn.apiKey !== undefined && (
                    <div>
                      <label
                        htmlFor={`apikey-${conn.id}`}
                        className="text-slate-400 text-xs font-medium block mb-1"
                      >
                        API Key
                      </label>
                      <input
                        id={`apikey-${conn.id}`}
                        type="password"
                        defaultValue={conn.apiKey}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm font-mono"
                        placeholder="sk-••••••••"
                        data-ocid={`open-lead-lake.apikey-input-${conn.sourceType}`}
                      />
                    </div>
                  )}
                  {/* CSV Field Mapping */}
                  {conn.sourceType === "csv" && conn.fieldMapping && (
                    <div>
                      <p className="text-slate-400 text-xs font-medium mb-2">
                        Field Mapping
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(conn.fieldMapping).map(
                          ([src, dest]) => (
                            <div
                              key={src}
                              className="flex items-center gap-1.5 text-xs"
                            >
                              <span className="text-slate-400 font-mono truncate max-w-[90px]">
                                {src}
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                              <span className="text-indigo-300 font-mono truncate">
                                {dest}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {/* Setup Guide */}
                  {conn.setupGuide && (
                    <div className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3">
                      <p className="text-slate-500 text-xs font-semibold mb-1">
                        Setup Guide
                      </p>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {conn.setupGuide}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                      data-ocid={`open-lead-lake.save-connector-${conn.sourceType}`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                      data-ocid={`open-lead-lake.test-connector-${conn.sourceType}`}
                    >
                      <Zap className="w-3.5 h-3.5" /> Test Connection
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab 3: Normalized Leads ───────────────────────────────────────────────────

type NormalizedSubTab = "leads" | "enrichment";

function NormalizedLeadsTab() {
  const [subTab, setSubTab] = useState<NormalizedSubTab>("leads");
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState<SourceType | "all">("all");
  const [filterConf, setFilterConf] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "normalized" | "duplicate" | "suppressed" | "promoted"
  >("all");
  const [onlyOutreachReady, setOnlyOutreachReady] = useState(false);
  const [selectedLead, setSelectedLead] = useState<NormalizedLead | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verificationDone, setVerificationDone] = useState(false);

  // Build an enrichment lookup map
  const enrichmentMap = Object.fromEntries(
    DEMO_LEAD_ENRICHMENTS.map((e) => [e.leadId, e]),
  );

  const baseLeads = DEMO_NORMALIZED_LEADS.map((l) => ({
    ...l,
    enrichment: enrichmentMap[l.id],
  }));

  const visible = baseLeads.filter((l) => {
    if (onlyOutreachReady && l.canReceiveOutreach === false) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !l.businessName.toLowerCase().includes(q) &&
        !l.city.toLowerCase().includes(q)
      )
        return false;
    }
    if (filterSource !== "all" && !l.sourceTypes.includes(filterSource))
      return false;
    if (filterConf !== "all" && l.sourceConfidence !== filterConf) return false;
    if (filterStatus !== "all") {
      if (filterStatus === "duplicate" && !l.isDuplicate) return false;
      if (filterStatus === "suppressed" && !l.isSuppressed) return false;
      if (filterStatus === "promoted" && !l.isPromotedToCRM) return false;
      if (
        filterStatus === "normalized" &&
        (l.isDuplicate || l.isSuppressed || l.isPromotedToCRM)
      )
        return false;
    }
    return true;
  });

  function handleVerifyContacts() {
    setVerifying(true);
    setVerifyProgress(0);
    const interval = setInterval(() => {
      setVerifyProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setVerifying(false);
          setVerificationDone(true);
          return 100;
        }
        return p + 10;
      });
    }, 200);
  }

  const vs = VERIFICATION_STATS;

  return (
    <div className="space-y-4">
      {/* Sub-tab bar */}
      <div className="flex gap-1 border-b border-slate-800 pb-0">
        {(
          [
            { id: "leads" as NormalizedSubTab, label: "Normalized Leads" },
            {
              id: "enrichment" as NormalizedSubTab,
              label: "Lead Enrichment",
              badge: `${vs.outreachReady} ready`,
            },
          ] as { id: NormalizedSubTab; label: string; badge?: string }[]
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors -mb-px ${
              subTab === t.id
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
            data-ocid={`open-lead-lake.sub-tab-${t.id}`}
          >
            {t.label}
            {t.badge && (
              <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs px-1.5 py-0.5 rounded-full font-medium">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {subTab === "enrichment" && (
        <EnrichmentSubTab
          verifying={verifying}
          verifyProgress={verifyProgress}
          verificationDone={verificationDone}
          onVerify={handleVerifyContacts}
        />
      )}

      {subTab === "leads" && (
        <>
          {/* Search + Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or city…"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 text-sm"
                data-ocid="open-lead-lake.normalized-search"
              />
            </div>
            <select
              value={filterSource}
              onChange={(e) =>
                setFilterSource(e.target.value as SourceType | "all")
              }
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
              data-ocid="open-lead-lake.filter-source"
            >
              <option value="all">All Sources</option>
              {(
                [
                  "openstreetmap",
                  "opencorporates",
                  "gleif",
                  "commoncrawl",
                  "csv",
                ] as SourceType[]
              ).map((s) => (
                <option key={s} value={s}>
                  {SOURCE_LABELS[s]}
                </option>
              ))}
            </select>
            <select
              value={filterConf}
              onChange={(e) =>
                setFilterConf(e.target.value as typeof filterConf)
              }
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
              data-ocid="open-lead-lake.filter-confidence"
            >
              <option value="all">All Confidence</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as typeof filterStatus)
              }
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
              data-ocid="open-lead-lake.filter-norm-status"
            >
              <option value="all">All Statuses</option>
              <option value="normalized">Normalized</option>
              <option value="duplicate">Duplicate</option>
              <option value="suppressed">Suppressed</option>
              <option value="promoted">Promoted to CRM</option>
            </select>
            {/* Outreach-ready toggle */}
            <button
              type="button"
              onClick={() => setOnlyOutreachReady((v) => !v)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                onlyOutreachReady
                  ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/50"
                  : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-300"
              }`}
              data-ocid="open-lead-lake.filter-outreach-ready-toggle"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Outreach-Ready Only
            </button>
          </div>

          <p className="text-slate-500 text-xs">
            Showing{" "}
            <span className="text-slate-300 font-medium">{visible.length}</span>{" "}
            of {DEMO_NORMALIZED_LEADS.length} normalized leads
            {onlyOutreachReady && (
              <span className="ml-2 text-emerald-400">
                · filtered to outreach-ready
              </span>
            )}
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Business Name
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Source
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    City / State
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Category
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3 min-w-[120px]">
                    Confidence
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Email Verify
                  </th>
                  <th className="text-left text-slate-400 font-medium px-4 py-3">
                    Phone Verify
                  </th>
                  <th className="text-right text-slate-400 font-medium px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lead, idx) => {
                  const enrichment = lead.enrichment;
                  const canReceive = lead.canReceiveOutreach !== false;
                  const showTooltip =
                    enrichment &&
                    (enrichment.emailVerificationStatus === "invalid" ||
                      enrichment.emailVerificationStatus === "unverified");

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedLead(lead)
                      }
                      data-ocid={`open-lead-lake.normalized-lead.${idx + 1}`}
                    >
                      <td className="px-4 py-3 text-slate-200 font-medium">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {lead.businessName}
                            {lead.isDuplicate && (
                              <span className="text-amber-400 text-xs">
                                (duplicate)
                              </span>
                            )}
                            {!canReceive && (
                              <span className="text-rose-400 text-xs flex items-center gap-0.5">
                                <XCircle className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <BrowserAuditBadge
                            leadId={lead.id}
                            hasAutoBrowserUrl={true}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <SourceBadge type={lead.primarySource} />
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {lead.city}, {lead.state}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {lead.category}
                      </td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <ConfidenceBar score={lead.confidenceScore} />
                      </td>
                      <td className="px-4 py-3">
                        {lead.isPromotedToCRM ? (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-indigo-900/60 text-indigo-300 border-indigo-700/50">
                            promoted
                          </span>
                        ) : lead.isSuppressed ? (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-rose-900/60 text-rose-300 border-rose-700/50">
                            suppressed
                          </span>
                        ) : lead.isDuplicate ? (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-amber-900/60 text-amber-300 border-amber-700/50">
                            duplicate
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-emerald-900/60 text-emerald-300 border-emerald-700/50">
                            normalized
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {enrichment ? (
                          <VerificationBadge
                            status={enrichment.emailVerificationStatus}
                          />
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {enrichment ? (
                          <VerificationBadge
                            status={enrichment.phoneVerificationStatus}
                          />
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700/40 px-2 py-1 rounded transition-colors"
                            data-ocid={`open-lead-lake.view-lead-${idx + 1}`}
                          >
                            View
                          </button>
                          {!lead.isPromotedToCRM &&
                            !lead.isSuppressed &&
                            !lead.isDuplicate && (
                              <span>
                                {showTooltip ? (
                                  <Tooltip content="Only verified contacts will receive outreach sequences">
                                    <button
                                      type="button"
                                      className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded transition-colors cursor-not-allowed"
                                      data-ocid={`open-lead-lake.push-crm-${idx + 1}`}
                                    >
                                      Push to CRM
                                    </button>
                                  </Tooltip>
                                ) : (
                                  <button
                                    type="button"
                                    className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-700/40 px-2 py-1 rounded transition-colors"
                                    data-ocid={`open-lead-lake.promote-lead-${idx + 1}`}
                                  >
                                    Promote
                                  </button>
                                )}
                              </span>
                            )}
                          {!lead.isSuppressed && (
                            <button
                              type="button"
                              className="text-xs text-slate-500 hover:text-rose-400 px-1 py-1 rounded transition-colors"
                              data-ocid={`open-lead-lake.suppress-lead-${idx + 1}`}
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

          {/* Detail Flyout */}
          {selectedLead && (
            <div
              className="fixed inset-0 bg-black/60 z-50 flex justify-end"
              onClick={() => setSelectedLead(null)}
              onKeyDown={(e) => e.key === "Escape" && setSelectedLead(null)}
              tabIndex={-1}
              aria-label="Lead detail overlay"
            >
              <div
                className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-5"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                data-ocid="open-lead-lake.lead-detail-panel"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-slate-100 font-semibold">
                    {selectedLead.businessName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                    data-ocid="open-lead-lake.close-detail-button"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SourceBadge type={selectedLead.primarySource} />
                  <ConfidenceBadge conf={selectedLead.sourceConfidence} />
                  {selectedLead.isPromotedToCRM && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-indigo-900/60 text-indigo-300 border-indigo-700/50">
                      In CRM
                    </span>
                  )}
                  {selectedLead.isSuppressed && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-rose-900/60 text-rose-300 border-rose-700/50">
                      Suppressed
                    </span>
                  )}
                  {selectedLead.isDuplicate && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-amber-900/60 text-amber-300 border-amber-700/50">
                      Duplicate
                    </span>
                  )}
                  {selectedLead.canReceiveOutreach !== false ? (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-emerald-900/60 text-emerald-300 border-emerald-700/50">
                      Outreach Ready
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-rose-900/60 text-rose-300 border-rose-700/50">
                      Not Outreach Ready
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
                    Normalized Fields
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "Category", value: selectedLead.category },
                      { label: "City", value: selectedLead.city },
                      { label: "State", value: selectedLead.state },
                      { label: "Phone", value: selectedLead.phone },
                      { label: "Email", value: selectedLead.email },
                      { label: "Website", value: selectedLead.domain },
                      {
                        label: "Rating",
                        value: selectedLead.rating
                          ? `${selectedLead.rating} ★`
                          : undefined,
                      },
                      { label: "Reviews", value: selectedLead.reviewCount },
                      {
                        label: "Confidence",
                        value: `${selectedLead.confidenceScore}/100`,
                      },
                      {
                        label: "Source",
                        value: selectedLead.sourceTypes
                          .map((s) => SOURCE_LABELS[s])
                          .join(", "),
                      },
                    ].map(({ label, value }) =>
                      value ? (
                        <div key={label}>
                          <p className="text-slate-500">{label}</p>
                          <p className="text-slate-300 truncate">
                            {String(value)}
                          </p>
                        </div>
                      ) : null,
                    )}
                  </div>
                </div>

                {/* Enrichment section in flyout */}
                {enrichmentMap[selectedLead.id] && (
                  <div className="space-y-2">
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
                      Contact Verification
                    </p>
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Email</p>
                        <VerificationBadge
                          status={
                            enrichmentMap[selectedLead.id]
                              .emailVerificationStatus
                          }
                        />
                        {enrichmentMap[selectedLead.id].emailVerifiedAt && (
                          <p className="text-slate-600 text-xs mt-1">
                            {new Date(
                              enrichmentMap[selectedLead.id].emailVerifiedAt!,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Phone</p>
                        <VerificationBadge
                          status={
                            enrichmentMap[selectedLead.id]
                              .phoneVerificationStatus
                          }
                        />
                        {enrichmentMap[selectedLead.id].phoneVerifiedAt && (
                          <p className="text-slate-600 text-xs mt-1">
                            {new Date(
                              enrichmentMap[selectedLead.id].phoneVerifiedAt!,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedLead.isDuplicate && selectedLead.duplicateOfId && (
                  <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
                    <p className="text-amber-300 text-xs font-medium">
                      Merged from: {selectedLead.duplicateOfId}
                    </p>
                  </div>
                )}

                {selectedLead.isSuppressed &&
                  selectedLead.suppressionReason && (
                    <div className="bg-rose-900/20 border border-rose-700/30 rounded-lg p-3">
                      <p className="text-rose-300 text-xs">
                        Suppression reason: {selectedLead.suppressionReason}
                      </p>
                    </div>
                  )}

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">
                    Source Attribution
                  </p>
                  <div className="space-y-1">
                    {selectedLead.openStreetMapId && (
                      <p className="text-slate-500 text-xs">
                        OSM ID:{" "}
                        <span className="font-mono text-slate-400">
                          {selectedLead.openStreetMapId}
                        </span>
                      </p>
                    )}
                    {selectedLead.openCorporatesId && (
                      <p className="text-slate-500 text-xs">
                        OpenCorporates:{" "}
                        <span className="font-mono text-slate-400">
                          {selectedLead.openCorporatesId}
                        </span>
                      </p>
                    )}
                    <p className="text-slate-500 text-xs">
                      Normalized at:{" "}
                      {new Date(selectedLead.normalizedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {!selectedLead.isPromotedToCRM &&
                    !selectedLead.isSuppressed &&
                    !selectedLead.isDuplicate && (
                      <button
                        type="button"
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                        data-ocid="open-lead-lake.promote-to-staging-button"
                      >
                        <ArrowRight className="w-3.5 h-3.5" /> Promote to
                        Staging
                      </button>
                    )}
                  {!selectedLead.isSuppressed && (
                    <button
                      type="button"
                      className="bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-700/40 text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                      data-ocid="open-lead-lake.suppress-confirm-button"
                    >
                      Suppress
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Enrichment Sub-tab ────────────────────────────────────────────────────────

function EnrichmentSubTab({
  verifying,
  verifyProgress,
  verificationDone,
  onVerify,
}: {
  verifying: boolean;
  verifyProgress: number;
  verificationDone: boolean;
  onVerify: () => void;
}) {
  const vs = VERIFICATION_STATS;

  const summaryItems = [
    {
      label: "Total Checked",
      value: vs.totalChecked,
      icon: <Database className="w-4 h-4 text-slate-400" />,
      cls: "border-t-slate-600",
    },
    {
      label: "Verified",
      value: vs.verified,
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
      cls: "border-t-emerald-600",
    },
    {
      label: "Invalid",
      value: vs.invalid,
      icon: <XCircle className="w-4 h-4 text-rose-400" />,
      cls: "border-t-rose-600",
    },
    {
      label: "Pending",
      value: vs.pending,
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      cls: "border-t-amber-600",
    },
    {
      label: "Unverified",
      value: vs.unverified,
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
      cls: "border-t-slate-700",
    },
    {
      label: "Outreach Ready",
      value: vs.outreachReady,
      icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
      cls: "border-t-indigo-600",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Verification Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className={`bg-slate-900 border border-slate-800 rounded-lg p-3 border-t-2 ${item.cls}`}
            data-ocid={`open-lead-lake.enrichment-stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {item.icon}
              <p className="text-slate-400 text-xs truncate">{item.label}</p>
            </div>
            <p className="text-2xl font-bold text-slate-100">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Verify Contacts button + progress */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onVerify}
          disabled={verifying}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          data-ocid="open-lead-lake.verify-contacts-button"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {verifying ? "Verifying…" : "Verify Contacts"}
        </button>
        {verifying && (
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-200"
                style={{ width: `${verifyProgress}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 font-mono w-8">
              {verifyProgress}%
            </span>
          </div>
        )}
        {verificationDone && !verifying && (
          <span
            className="flex items-center gap-1.5 text-emerald-400 text-xs"
            data-ocid="open-lead-lake.verify-success-state"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Verification complete — {vs.verified} contacts verified
          </span>
        )}
      </div>

      {/* Per-lead enrichment table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Business
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Category
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Email Verification
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Phone Verification
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Outreach
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Verified At
              </th>
            </tr>
          </thead>
          <tbody>
            {DEMO_LEAD_ENRICHMENTS.map((enr, idx) => {
              const lead = DEMO_NORMALIZED_LEADS.find(
                (l) => l.id === enr.leadId,
              );
              if (!lead) return null;
              return (
                <tr
                  key={enr.leadId}
                  className="border-b border-slate-800/50 hover:bg-slate-800/20"
                  data-ocid={`open-lead-lake.enrichment-row.${idx + 1}`}
                >
                  <td className="px-4 py-3 text-slate-200 font-medium text-xs">
                    {lead.businessName}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {lead.category}
                  </td>
                  <td className="px-4 py-3">
                    <VerificationBadge status={enr.emailVerificationStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <VerificationBadge status={enr.phoneVerificationStatus} />
                  </td>
                  <td className="px-4 py-3">
                    {enr.canReceiveOutreach ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-emerald-900/60 text-emerald-300 border-emerald-700/50 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-rose-900/60 text-rose-300 border-rose-700/50 flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" /> Blocked
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {enr.emailVerifiedAt
                      ? new Date(enr.emailVerifiedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "2-digit" },
                        )
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-3">
        <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-indigo-300 text-xs leading-relaxed">
          Only verified contacts are enrolled in outreach sequences. Invalid or
          unverified contacts are held until verification passes. Run{" "}
          <strong>Verify Contacts</strong> to re-check pending leads.
        </p>
      </div>
    </div>
  );
}

// ─── Tab 4: Raw Records ────────────────────────────────────────────────────────

function RawRecordsTab() {
  const [filterSource, setFilterSource] = useState<SourceType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<NormalizationStatus | "all">(
    "all",
  );
  const [selectedPayload, setSelectedPayload] = useState<RawLeadRecord | null>(
    null,
  );
  const [selectedBulk, setSelectedBulk] = useState<Set<string>>(new Set());

  const visible = DEMO_RAW_RECORDS.filter((r) => {
    if (filterSource !== "all" && r.sourceType !== filterSource) return false;
    if (filterStatus !== "all" && r.normalizationStatus !== filterStatus)
      return false;
    return true;
  });

  function toggleBulk(id: string) {
    setSelectedBulk((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={filterSource}
            onChange={(e) =>
              setFilterSource(e.target.value as SourceType | "all")
            }
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
            data-ocid="open-lead-lake.raw-filter-source"
          >
            <option value="all">All Sources</option>
            {(["openstreetmap", "opencorporates", "csv"] as SourceType[]).map(
              (s) => (
                <option key={s} value={s}>
                  {SOURCE_LABELS[s]}
                </option>
              ),
            )}
          </select>
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as NormalizationStatus | "all")
            }
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm"
            data-ocid="open-lead-lake.raw-filter-status"
          >
            <option value="all">All Statuses</option>
            <option value="raw">Raw</option>
            <option value="normalized">Normalized</option>
            <option value="duplicate">Duplicate</option>
            <option value="suppressed">Suppressed</option>
          </select>
        </div>
        {selectedBulk.size > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-slate-400 text-xs">
              {selectedBulk.size} selected
            </span>
            <button
              type="button"
              className="text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-700/50 px-3 py-1.5 rounded-lg transition-colors"
              data-ocid="open-lead-lake.bulk-normalize-button"
            >
              Normalize Selected
            </button>
            <button
              type="button"
              className="text-xs bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-700/50 px-3 py-1.5 rounded-lg transition-colors"
              data-ocid="open-lead-lake.bulk-suppress-button"
            >
              Suppress Selected
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  className="accent-indigo-500"
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedBulk(new Set(visible.map((r) => r.id)));
                    else setSelectedBulk(new Set());
                  }}
                  data-ocid="open-lead-lake.select-all-raw"
                />
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Source
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Extracted Name
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Website
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                City
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Import Job
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Status
              </th>
              <th className="text-left text-slate-400 font-medium px-4 py-3">
                Imported
              </th>
              <th className="text-right text-slate-400 font-medium px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((rec, idx) => (
              <tr
                key={rec.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/30"
                data-ocid={`open-lead-lake.raw-record.${idx + 1}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedBulk.has(rec.id)}
                    onChange={() => toggleBulk(rec.id)}
                    className="accent-indigo-500"
                    data-ocid={`open-lead-lake.raw-checkbox.${idx + 1}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <SourceBadge type={rec.sourceType} />
                </td>
                <td className="px-4 py-3 text-slate-300 font-medium max-w-[160px] truncate">
                  {rec.extractedName || (
                    <span className="text-slate-600 italic">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-[140px] truncate">
                  {rec.extractedWebsite || "—"}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {rec.extractedCity || "—"}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs font-mono">
                  {rec.importJobId}
                </td>
                <td className="px-4 py-3">
                  <NormStatusBadge status={rec.normalizationStatus} />
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {new Date(rec.importedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedPayload(rec)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-700/40 px-2 py-1 rounded transition-colors"
                    data-ocid={`open-lead-lake.view-payload-${idx + 1}`}
                  >
                    Raw Payload
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JSON Payload Modal */}
      {selectedPayload && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedPayload(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedPayload(null)}
          tabIndex={-1}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-ocid="open-lead-lake.payload-modal"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <span className="text-slate-200 font-medium text-sm">
                Raw Payload — {selectedPayload.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPayload(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                data-ocid="open-lead-lake.close-payload-button"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-5">
              <pre className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(selectedPayload.rawPayload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 5: Ingestion Stats ────────────────────────────────────────────────────

function IngestionStatsTab() {
  const s = DEMO_INGESTION_STATS;
  const recentJobs = [...DEMO_IMPORT_JOBS]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
    .slice(0, 5);

  const activeSourceTypes = (
    Object.entries(s.bySource) as [
      string,
      { imported: number; normalized: number; duplicates: number },
    ][]
  ).filter(([, v]) => v.imported > 0);

  return (
    <div className="space-y-6">
      {/* Big stat row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Total Imported"
          value={s.totalImported}
          accent="border-t-indigo-600"
        />
        <StatCard
          label="Normalized"
          value={s.totalNormalized}
          accent="border-t-emerald-600"
        />
        <StatCard
          label="Duplicates"
          value={s.totalDuplicates}
          accent="border-t-amber-600"
        />
        <StatCard
          label="Suppressed"
          value={s.totalSuppressed}
          accent="border-t-rose-600"
        />
        <StatCard
          label="Promoted to CRM"
          value={s.totalPromotedToCRM}
          accent="border-t-purple-600"
        />
      </div>

      {/* By-source breakdown */}
      <div>
        <h3 className="text-slate-300 font-semibold text-sm mb-3">
          By-Source Breakdown
        </h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-slate-400 font-medium px-4 py-3">
                  Source
                </th>
                <th className="text-right text-slate-400 font-medium px-4 py-3">
                  Imported
                </th>
                <th className="text-right text-slate-400 font-medium px-4 py-3">
                  Normalized
                </th>
                <th className="text-right text-slate-400 font-medium px-4 py-3">
                  Duplicates
                </th>
                <th className="text-right text-slate-400 font-medium px-4 py-3">
                  Success Rate
                </th>
                <th className="text-left text-slate-400 font-medium px-4 py-3 min-w-[120px]">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody>
              {activeSourceTypes.map(([src, data]) => {
                const rate =
                  data.imported > 0
                    ? Math.round((data.normalized / data.imported) * 100)
                    : 0;
                const dist =
                  s.totalImported > 0
                    ? Math.round((data.imported / s.totalImported) * 100)
                    : 0;
                return (
                  <tr
                    key={src}
                    className="border-b border-slate-800/50 hover:bg-slate-800/20"
                  >
                    <td className="px-4 py-3">
                      <SourceBadge type={src as SourceType} />
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300 text-xs">
                      {data.imported.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400 text-xs">
                      {data.normalized.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-amber-400 text-xs">
                      {data.duplicates.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-xs font-bold font-mono ${rate >= 80 ? "text-emerald-400" : rate >= 60 ? "text-amber-400" : "text-rose-400"}`}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${dist}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-500 w-8 text-right">
                          {dist}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <h3 className="text-slate-300 font-semibold text-sm mb-3">
          Recent Import Jobs
        </h3>
        <div className="space-y-2">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex items-center gap-4 flex-wrap"
            >
              <SourceBadge type={job.sourceType} />
              <ImportStatusBadge status={job.status} />
              <span className="text-slate-400 text-xs flex-1 min-w-0 truncate">
                {[job.filters?.niche, job.filters?.city, job.filters?.state]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </span>
              {job.totalRecords > 0 && (
                <span className="text-slate-500 text-xs font-mono">
                  {job.normalizedRecords}/{job.totalRecords} normalized
                </span>
              )}
              <span className="text-slate-600 text-xs">
                {new Date(job.startedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Notes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-slate-200 font-semibold text-sm mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" /> Performance Notes
        </h3>
        <div className="space-y-2">
          {(
            [
              {
                key: "osm",
                icon: (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ),
                text: "OpenStreetMap is your most reliable source — high normalization rate and zero API cost.",
              },
              {
                key: "csv",
                icon: (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ),
                text: "CSV imports show a 93% normalization rate on clean lists — validate field mapping before bulk imports.",
              },
              {
                key: "oc",
                icon: (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                ),
                text: "OpenCorporates has a 500 req/day free-tier limit. Upgrade for production-scale entity verification.",
              },
              {
                key: "dupe",
                icon: (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                ),
                text: "Duplicate rate is 20.9% — run deduplication pass before bulk CRM promotion.",
              },
              {
                key: "gleif",
                icon: (
                  <XCircle className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                ),
                text: "GLEIF and Common Crawl connectors not yet active — enable for higher-confidence B2B entity matching.",
              },
            ] as const
          ).map(({ key, icon, text }) => (
            <div
              key={key}
              className="flex items-start gap-2 text-xs text-slate-400"
            >
              {icon}
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tabs Config ───────────────────────────────────────────────────────────────

type TabId =
  | "ai-finder"
  | "imports"
  | "settings"
  | "normalized"
  | "raw"
  | "stats";

const TABS: {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}[] = [
  {
    id: "ai-finder",
    label: "AI Lead Finder",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    highlight: true,
  },
  {
    id: "imports",
    label: "Source Imports",
    icon: <Upload className="w-3.5 h-3.5" />,
  },
  {
    id: "settings",
    label: "Source Settings",
    icon: <Settings className="w-3.5 h-3.5" />,
  },
  {
    id: "normalized",
    label: `Normalized Leads (${DEMO_NORMALIZED_LEADS.length})`,
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  {
    id: "raw",
    label: "Raw Records",
    icon: <Database className="w-3.5 h-3.5" />,
  },
  {
    id: "stats",
    label: "Ingestion Stats",
    icon: <Filter className="w-3.5 h-3.5" />,
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OpenLeadLakePage() {
  const [activeTab, setActiveTab] = useState<TabId>("ai-finder");

  return (
    <div className="space-y-6" data-ocid="open-lead-lake.page">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            Open Lead Lake
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Native open-data lead sourcing pipeline — ingest, normalize,
            deduplicate, and stage leads before they enter your CRM.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg">
            Last updated:{" "}
            {new Date(DEMO_INGESTION_STATS.lastUpdated).toLocaleString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            )}
          </span>
          <a
            href="/outreach-agent"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            data-ocid="open-lead-lake.goto-outreach-link"
          >
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400" /> Outreach
            Agent
          </a>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-slate-800">
        <div className="flex gap-1 overflow-x-auto" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? tab.highlight
                    ? "border-purple-500 text-purple-300"
                    : "border-indigo-500 text-indigo-300"
                  : tab.highlight
                    ? "border-transparent text-purple-400/70 hover:text-purple-300"
                    : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
              data-ocid={`open-lead-lake.tab-${tab.id}`}
            >
              {tab.icon}
              {tab.label}
              {tab.highlight && activeTab !== tab.id && (
                <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "ai-finder" && <AILeadFinderTab />}
        {activeTab === "imports" && <SourceImportsTab />}
        {activeTab === "settings" && <SourceSettingsTab />}
        {activeTab === "normalized" && <NormalizedLeadsTab />}
        {activeTab === "raw" && <RawRecordsTab />}
        {activeTab === "stats" && <IngestionStatsTab />}
      </div>
    </div>
  );
}
