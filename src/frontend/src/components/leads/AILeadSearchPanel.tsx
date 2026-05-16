import {
  AlertTriangle,
  Bot,
  CheckSquare,
  Download,
  RefreshCw,
  Search,
  Square,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import type { GeneratedLeadUI } from "./LeadCard";
import LeadCard from "./LeadCard";
import NewBusinessFilingsSearch, { NICHES } from "./NewBusinessFilingsSearch";

// ── Types ─────────────────────────────────────────────────────────────────────

interface LLMLeadSearchResult {
  leads: GeneratedLeadUI[];
  claudeCount: number;
  openAICount: number;
  enrichedCount: number;
  serpApiUsed: boolean;
  errors: string[];
  searchedAt: number;
}

const STATUS_MESSAGES = [
  "Asking Claude to find businesses...",
  "Asking OpenAI GPT-4o to generate leads...",
  "Merging and deduplicating results...",
  "Enriching with contact data...",
];

const SEARCH_TIMEOUT_MS = 30_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function exportToCSV(leads: GeneratedLeadUI[]) {
  const headers = [
    "Business Name",
    "Owner First Name",
    "Phone",
    "Address",
    "Website",
    "City",
    "Niche",
    "Temperature",
    "Source",
    "Enriched",
  ];
  const rows = leads.map((l) => [
    l.name,
    l.ownerFirstName,
    l.phone,
    l.address,
    l.website,
    l.city,
    l.niche,
    l.temperature,
    l.source,
    l.enriched ? "Yes" : "No",
  ]);

  const csvContent = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ai-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function normalizeLeads(raw: Record<string, unknown>[]): GeneratedLeadUI[] {
  return raw.map((l, i) => ({
    id: `ai-lead-${Date.now()}-${i}`,
    name: String(l.name ?? ""),
    ownerFirstName: String(l.ownerFirstName ?? ""),
    phone: String(l.phone ?? ""),
    address: String(l.address ?? ""),
    website: String(l.website ?? ""),
    description: String(l.description ?? ""),
    niche: String(l.niche ?? ""),
    city: String(l.city ?? ""),
    source: String(l.source ?? "ai"),
    enriched: Boolean(l.enriched),
    temperature: String(l.temperature ?? "cold"),
    score: typeof l.score === "bigint" ? Number(l.score) : Number(l.score ?? 0),
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onPushToLake: (leads: GeneratedLeadUI[]) => void;
}

export default function AILeadSearchPanel({ onPushToLake }: Props) {
  const { actor } = useActor();

  // Search controls
  const [niche, setNiche] = useState("plumber");
  const [city, setCity] = useState("");
  const [count, setCount] = useState(20);
  const [enrich, setEnrich] = useState(true);

  // Search state
  const [isLoading, setIsLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [result, setResult] = useState<LLMLeadSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Refs for timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // ── Search handler ─────────────────────────────────────────────────────────

  const runSearch = useCallback(
    async (searchNiche: string, searchCity: string, _isFilings = false) => {
      if (isLoading) return;

      setIsLoading(true);
      setTimedOut(false);
      setError(null);
      setResult(null);
      setSelected(new Set());
      setStatusIdx(0);

      // Cycle status messages
      let idx = 0;
      statusIntervalRef.current = setInterval(() => {
        idx = (idx + 1) % STATUS_MESSAGES.length;
        setStatusIdx(idx);
      }, 4500);

      // Timeout guard
      timeoutRef.current = setTimeout(() => {
        clearTimers();
        setIsLoading(false);
        setTimedOut(true);
      }, SEARCH_TIMEOUT_MS);

      try {
        if (!actor) {
          throw new Error(
            "Not connected to backend. Refresh the page and try again.",
          );
        }

        const response = (await actor.searchLeadsWithLLM(
          searchNiche,
          searchCity || "United States",
          BigInt(count),
          enrich,
        )) as
          | { __kind__: "ok"; ok: Record<string, unknown> }
          | { __kind__: "err"; err: string };

        clearTimers();

        if (response.__kind__ === "err") {
          setError(
            `Search failed: ${response.err}. Check your API keys in Go Live Dashboard.`,
          );
        } else {
          const data = response.ok as {
            leads: Record<string, unknown>[];
            claudeCount: bigint;
            openAICount: bigint;
            enrichedCount: bigint;
            serpApiUsed: boolean;
            errors: string[];
            searchedAt: bigint;
          };
          setResult({
            leads: normalizeLeads(data.leads ?? []),
            claudeCount: Number(data.claudeCount ?? 0),
            openAICount: Number(data.openAICount ?? 0),
            enrichedCount: Number(data.enrichedCount ?? 0),
            serpApiUsed: data.serpApiUsed ?? false,
            errors: data.errors ?? [],
            searchedAt: Number(data.searchedAt ?? 0),
          });
        }
      } catch (err) {
        clearTimers();
        const msg = err instanceof Error ? err.message : String(err);
        setError(
          `Search failed: ${msg}. Check your API keys in Go Live Dashboard.`,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [actor, count, enrich, isLoading, clearTimers],
  );

  // ── Selection helpers ──────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (!result) return;
    if (selected.size === result.leads.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(result.leads.map((l) => l.id)));
    }
  };

  // ── Push to Lead Lake ──────────────────────────────────────────────────────

  const handlePush = () => {
    if (!result) return;
    const pushing = result.leads.filter((l) => selected.has(l.id));
    if (pushing.length === 0) {
      toast.warning("Select at least one lead to push.");
      return;
    }
    onPushToLake(pushing);
    setSelected(new Set());
    toast.success(
      `${pushing.length} lead${pushing.length !== 1 ? "s" : ""} pushed to Lead Lake`,
    );
  };

  // ── Export ─────────────────────────────────────────────────────────────────

  const handleExport = () => {
    if (!result || result.leads.length === 0) return;
    const toExport =
      selected.size > 0
        ? result.leads.filter((l) => selected.has(l.id))
        : result.leads;
    exportToCSV(toExport);
    toast.success(`Exported ${toExport.length} leads to CSV`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const allSelected = Boolean(result && selected.size === result.leads.length);

  return (
    <div className="space-y-6">
      {/* Search Controls Panel */}
      <div className="bg-card border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Bot size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Lead Search</h3>
            <p className="text-xs text-gray-500">
              Claude + OpenAI GPT-4o generate real businesses by niche &amp;
              city
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Niche */}
          <div>
            <Label className="text-xs text-gray-400 mb-1.5 block">Niche</Label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger
                className="bg-gray-800 border-gray-700 text-gray-300"
                data-ocid="ai_leads.niche_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {NICHES.map((n) => (
                  <SelectItem key={n} value={n} className="capitalize">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div>
            <Label className="text-xs text-gray-400 mb-1.5 block">
              City / Market
            </Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Atlanta, GA"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              data-ocid="ai_leads.city_input"
            />
          </div>

          {/* Lead count */}
          <div>
            <Label className="text-xs text-gray-400 mb-1.5 block">
              Lead Count
            </Label>
            <Select
              value={String(count)}
              onValueChange={(v) => setCount(Number(v))}
            >
              <SelectTrigger
                className="bg-gray-800 border-gray-700 text-gray-300"
                data-ocid="ai_leads.count_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {[10, 15, 20, 25, 30, 40, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} leads
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enrich toggle */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-white/8">
              <div>
                <p className="text-xs font-medium text-gray-300">
                  Enrich with contact data
                </p>
                <p className="text-[10px] text-gray-500">Uses SerpApi</p>
              </div>
              <Switch
                checked={enrich}
                onCheckedChange={setEnrich}
                data-ocid="ai_leads.enrich_toggle"
              />
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => runSearch(niche, city)}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 text-sm shadow-lg shadow-purple-500/20 transition-all"
          data-ocid="ai_leads.search_button"
        >
          {isLoading ? (
            <>
              <RefreshCw size={15} className="mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Zap size={15} className="mr-2" />
              Find Real Leads with AI
            </>
          )}
        </Button>
      </div>

      {/* New Business Filings */}
      <NewBusinessFilingsSearch onSearch={runSearch} isLoading={isLoading} />

      {/* Loading / Progress */}
      {isLoading && (
        <div
          className="bg-card border border-purple-500/30 rounded-xl p-5"
          data-ocid="ai_leads.loading_state"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <RefreshCw size={15} className="text-purple-400 animate-spin" />
            </div>
            <p className="text-sm font-medium text-white animate-pulse">
              {STATUS_MESSAGES[statusIdx]}
            </p>
          </div>
          {/* Pulsing progress bar */}
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            This can take up to 30 seconds for the best results.
          </p>
        </div>
      )}

      {/* Timeout */}
      {timedOut && (
        <div
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-3"
          data-ocid="ai_leads.timeout_state"
        >
          <AlertTriangle
            size={18}
            className="text-amber-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-semibold text-amber-300">
              Search timed out
            </p>
            <p className="text-xs text-amber-400/80 mt-1">
              The AI search took longer than 30 seconds. This may mean your
              Claude or OpenAI key is not configured. Check your Go Live
              Dashboard.
            </p>
            <Button
              type="button"
              size="sm"
              onClick={() => runSearch(niche, city)}
              className="mt-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
              data-ocid="ai_leads.retry_button"
            >
              <RefreshCw size={13} className="mr-1.5" /> Retry Search
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3"
          data-ocid="ai_leads.error_state"
        >
          <AlertTriangle
            size={16}
            className="text-red-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm text-red-300">{error}</p>
            <Button
              type="button"
              size="sm"
              onClick={() => runSearch(niche, city)}
              className="mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
              data-ocid="ai_leads.retry_button"
            >
              <RefreshCw size={13} className="mr-1.5" /> Retry
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-4">
          {/* API Errors banner */}
          {result.errors.length > 0 && (
            <div className="space-y-2">
              {result.errors.map((e) => (
                <div
                  key={e}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
                >
                  <AlertTriangle
                    size={14}
                    className="text-amber-400 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-amber-300">{e}</p>
                </div>
              ))}
            </div>
          )}

          {/* Summary bar */}
          {result.leads.length > 0 && (
            <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-card border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">
                  {result.leads.length}
                </span>
                <span className="text-xs text-gray-400">total leads</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex gap-3 flex-wrap">
                {result.claudeCount > 0 && (
                  <span className="text-xs text-purple-300">
                    <strong>{result.claudeCount}</strong> from Claude
                  </span>
                )}
                {result.openAICount > 0 && (
                  <span className="text-xs text-emerald-300">
                    <strong>{result.openAICount}</strong> from OpenAI
                  </span>
                )}
                {result.enrichedCount > 0 && (
                  <span className="text-xs text-blue-300">
                    <strong>{result.enrichedCount}</strong> enriched
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {result.leads.length === 0 ? (
            <div
              className="py-14 text-center bg-card border border-white/10 rounded-xl"
              data-ocid="ai_leads.empty_state"
            >
              <Bot size={36} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No leads found</p>
              <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                Make sure your Claude or OpenAI API key is saved in the{" "}
                <strong className="text-purple-400">Go Live Dashboard</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* Lead grid */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                data-ocid="ai_leads.results_list"
              >
                {result.leads.map((lead, i) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    selected={selected.has(lead.id)}
                    onToggle={toggleSelect}
                    index={i + 1}
                  />
                ))}
              </div>

              {/* Sticky action bar */}
              <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                    data-ocid="ai_leads.select_all"
                  >
                    {allSelected ? (
                      <CheckSquare size={16} className="text-purple-400" />
                    ) : (
                      <Square size={16} />
                    )}
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                  <span className="text-xs text-gray-500">
                    {selected.size} of {result.leads.length} selected
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="border-white/20 text-gray-300 hover:bg-white/10"
                    data-ocid="ai_leads.export_csv_button"
                  >
                    <Download size={13} className="mr-1.5" />
                    Export CSV
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={selected.size === 0}
                    onClick={handlePush}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                    data-ocid="ai_leads.push_to_lake_button"
                  >
                    <Zap size={13} className="mr-1.5" />
                    Push {selected.size > 0 ? selected.size : ""} to Lead Lake
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
