import type {
  DedupeGroup,
  DedupeMatchField,
  DedupeResolution,
  EnrichmentField,
  EnrichmentResult,
  LeadEngineBatch,
  LeadEngineImportResult,
  LeadEngineLead,
  LeadListFilters,
  LeadListPage,
  LeadStatus,
  RawLeadInput,
  RejectedRow,
  Variant_any_enriched_notEnriched,
  Variant_any_resolved_flagged,
} from "@/backend";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Eye,
  FileSpreadsheet,
  FileText,
  GitBranch,
  History,
  Info,
  Layers,
  Link2,
  Loader2,
  Lock,
  MapPin,
  RefreshCw,
  Sparkles,
  Split,
  Table2,
  Tag,
  Upload,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { isIntegrationEnabled } from "../integrations/_shared/env";
import {
  leadEngine_getImportBatch as getImportBatch,
  leadEngine_getLead as getLead,
  leadEngine_importLeads as importLeads,
  leadEngine_enrichBatch,
  leadEngine_enrichLead,
  leadEngine_getDedupeGroups,
  leadEngine_listLeads,
  leadEngine_resolveDuplicate,
  leadEngine_listBatches as listBatches,
} from "../integrations/lead-engine/client";
import { LeadEngineDedupeTab } from "./LeadEngineDedupeTab";
import { LeadEngineEnrichTab } from "./LeadEngineEnrichTab";
import { LeadEngineLeadDetailDrawer } from "./LeadEngineLeadDetailDrawer";

// ---------- Types ----------

type Tab = "import" | "history" | "dedupe" | "enrich";

type SourceFormat = "auto" | "gosom" | "omkar" | "generic-csv" | "json";

type ParsedRow = Record<string, string>;

type ParsedFile = {
  name: string;
  format: SourceFormat;
  detectedFormat: SourceFormat;
  headers: string[];
  rows: ParsedRow[];
  rawText: string;
};

type FieldMapping = {
  [K in keyof RawLeadInput]: string | null;
};

type BatchSummary = {
  result: LeadEngineImportResult;
  importerName: string;
  sourceTool: string;
  timestamp: number;
};

// ---------- Constants ----------

const RAW_LEAD_FIELDS: {
  key: keyof RawLeadInput;
  label: string;
  type: "text" | "list";
  required: boolean;
}[] = [
  { key: "businessName", label: "Business Name", type: "text", required: true },
  { key: "phone", label: "Phone", type: "text", required: false },
  { key: "email", label: "Email", type: "text", required: false },
  { key: "niche", label: "Niche", type: "text", required: false },
  { key: "source", label: "Source", type: "text", required: false },
  {
    key: "locationTags",
    label: "Location Tags",
    type: "list",
    required: false,
  },
  { key: "sourceTags", label: "Source Tags", type: "list", required: false },
];

// Gosom format header signatures
const GOSOM_HEADERS = [
  "company_name",
  "company",
  "business_name",
  "name",
  "phone",
  "email",
  "website",
  "address",
];
const OMGAR_HEADERS = [
  "business",
  "phone_number",
  "mobile",
  "email_id",
  "category",
  "city",
  "tags",
];

const PREVIEW_ROW_LIMIT = 20;

// ---------- Helpers ----------

function parseCSV(text: string): { headers: string[]; rows: ParsedRow[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: ParsedRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}

function parseJSON(text: string): { headers: string[]; rows: ParsedRow[] } {
  const data = JSON.parse(text);
  const arr: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return { headers: [], rows: [] };
  const headerSet = new Set<string>();
  for (const obj of arr) {
    for (const k of Object.keys(obj)) headerSet.add(k);
  }
  const headers = Array.from(headerSet);
  const rows: ParsedRow[] = arr.map((obj) => {
    const row: ParsedRow = {};
    for (const h of headers) {
      const v = obj[h];
      row[h] = v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
    }
    return row;
  });
  return { headers, rows };
}

function detectFormat(headers: string[]): SourceFormat {
  const lower = headers.map((h) => h.toLowerCase().trim());
  const gosomMatch = GOSOM_HEADERS.filter((h) => lower.includes(h)).length;
  const omkarMatch = OMGAR_HEADERS.filter((h) => lower.includes(h)).length;
  if (gosomMatch >= 3) return "gosom";
  if (omkarMatch >= 3) return "omkar";
  return "generic-csv";
}

function autoMap(headers: string[], format: SourceFormat): FieldMapping {
  const lower = headers.map((h) => h.toLowerCase().trim());
  const find = (candidates: string[]): string | null => {
    for (const c of candidates) {
      const idx = lower.indexOf(c);
      if (idx >= 0) return headers[idx];
    }
    return null;
  };

  const gosomMap: FieldMapping = {
    businessName: find([
      "company_name",
      "company",
      "business_name",
      "name",
      "business",
    ]),
    phone: find(["phone", "phone_number", "telephone", "tel", "contact"]),
    email: find(["email", "email_address", "email_id", "mail"]),
    niche: find(["category", "niche", "industry", "type", "business_type"]),
    source: find(["source", "source_tool", "origin"]),
    locationTags: find(["location", "city", "address", "region", "area"]),
    sourceTags: find(["tags", "source_tags", "labels"]),
  };

  const omkarMap: FieldMapping = {
    businessName: find(["business", "business_name", "company", "name"]),
    phone: find(["phone_number", "mobile", "phone", "contact"]),
    email: find(["email_id", "email", "mail"]),
    niche: find(["category", "niche", "industry"]),
    source: find(["source", "origin"]),
    locationTags: find(["city", "location", "area", "region"]),
    sourceTags: find(["tags", "source_tags"]),
  };

  const genericMap: FieldMapping = {
    businessName: find([
      "business_name",
      "businessname",
      "company",
      "company_name",
      "name",
      "business",
    ]),
    phone: find([
      "phone",
      "phone_number",
      "telephone",
      "tel",
      "contact",
      "mobile",
    ]),
    email: find(["email", "email_address", "email_id", "mail"]),
    niche: find(["niche", "category", "industry", "type"]),
    source: find(["source", "origin", "source_tool"]),
    locationTags: find([
      "location",
      "city",
      "address",
      "region",
      "area",
      "location_tags",
    ]),
    sourceTags: find(["source_tags", "tags", "labels"]),
  };

  if (format === "gosom") return gosomMap;
  if (format === "omkar") return omkarMap;
  return genericMap;
}

function buildLead(
  row: ParsedRow,
  mapping: FieldMapping,
  defaults: {
    niche: string;
    source: string;
    locationTags: string;
    sourceTags: string;
  },
): RawLeadInput {
  const get = (k: keyof RawLeadInput): string => {
    const col = (mapping as Record<string, string | null>)[k];
    if (!col) return "";
    return (row as Record<string, string>)[col] ?? "";
  };
  const splitTags = (s: string): string[] =>
    s
      .split(/[,;|]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

  const locationTags = [
    ...splitTags(get("locationTags")),
    ...splitTags(defaults.locationTags),
  ];
  const sourceTags = [
    ...splitTags(get("sourceTags")),
    ...splitTags(defaults.sourceTags),
  ];

  return {
    businessName: get("businessName"),
    phone: get("phone"),
    email: get("email"),
    niche: get("niche") || defaults.niche,
    source: get("source") || defaults.source,
    locationTags,
    sourceTags,
  };
}

function isLeadValid(lead: RawLeadInput): boolean {
  return (
    lead.businessName.trim().length > 0 &&
    (lead.phone.trim().length > 0 || lead.email.trim().length > 0)
  );
}

function formatBigInt(n: bigint | number): string {
  return Number(n).toLocaleString();
}

function formatDate(ts: bigint | number): string {
  const ms = Number(ts);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleString();
}

// ---------- Component ----------

export default function LeadEnginePage() {
  const { actor } = useActor();
  const { currentTenantId: tenantId } = useApp();
  const enabled = isIntegrationEnabled("LEAD_ENGINE_ENABLED");

  const [tab, setTab] = useState<Tab>("import");
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [mapping, setMapping] = useState<FieldMapping | null>(null);
  const [formatOverride, setFormatOverride] = useState<SourceFormat>("auto");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importerName, setImporterName] = useState("");
  const [sourceTool, setSourceTool] = useState("manual-upload");
  const [defaultNiche, setDefaultNiche] = useState("");
  const [defaultSource, setDefaultSource] = useState("");
  const [defaultLocationTags, setDefaultLocationTags] = useState("");
  const [defaultSourceTags, setDefaultSourceTags] = useState("");
  const [batchSummary, setBatchSummary] = useState<BatchSummary | null>(null);
  const [rejectedExpanded, setRejectedExpanded] = useState(false);
  const [batches, setBatches] = useState<LeadEngineBatch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<LeadEngineBatch | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dedupe + Enrich + Lead detail state
  const [dedupeGroups, setDedupeGroups] = useState<DedupeGroup[]>([]);
  const [, setDedupeLoading] = useState(false);
  const [enrichLeads, setEnrichLeads] = useState<LeadEngineLead[]>([]);
  const [, setEnrichLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadEngineLead | null>(null);
  const [resolving, setResolving] = useState(false);
  const [enriching, setEnriching] = useState(false);

  // Load batch history when history tab opens
  useEffect(() => {
    if (
      tab === "history" &&
      enabled &&
      actor &&
      tenantId &&
      batches.length === 0 &&
      !batchesLoading
    ) {
      void loadBatches();
    }
  }, [tab, enabled, actor, tenantId, batches.length, batchesLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load dedupe groups when dedupe tab opens
  useEffect(() => {
    if (tab !== "dedupe" || !actor || !tenantId) return;
    setDedupeLoading(true);
    leadEngine_getDedupeGroups(actor, tenantId, true)
      .then(setDedupeGroups)
      .catch(() => setDedupeGroups([]))
      .finally(() => setDedupeLoading(false));
  }, [tab, actor, tenantId]);

  // Load leads for enrichment when enrich tab opens
  useEffect(() => {
    if (tab !== "enrich" || !actor || !tenantId) return;
    setEnrichLoading(true);
    leadEngine_listLeads(
      actor,
      tenantId,
      {
        dedupeStatus: undefined,
        enrichmentStatus: undefined,
        batchId: undefined,
      },
      0,
      50,
    )
      .then((page) => setEnrichLeads(page.leads))
      .catch(() => setEnrichLeads([]))
      .finally(() => setEnrichLoading(false));
  }, [tab, actor, tenantId]);

  const handleResolve = async (
    groupId: string,
    resolution: DedupeResolution,
  ) => {
    if (!actor || !tenantId) return;
    setResolving(true);
    try {
      await leadEngine_resolveDuplicate(actor, tenantId, groupId, resolution);
      const updated = await leadEngine_getDedupeGroups(actor, tenantId, true);
      setDedupeGroups(updated);
    } catch (e) {
      console.error("Resolve failed:", e);
    } finally {
      setResolving(false);
    }
  };

  const handleEnrichOne = async (leadId: string) => {
    if (!actor || !tenantId) return;
    setEnriching(true);
    try {
      await leadEngine_enrichLead(actor, tenantId, leadId);
      const page = await leadEngine_listLeads(
        actor,
        tenantId,
        {
          dedupeStatus: undefined,
          enrichmentStatus: undefined,
          batchId: undefined,
        },
        0,
        50,
      );
      setEnrichLeads(page.leads);
    } catch (e) {
      console.error("Enrich failed:", e);
    } finally {
      setEnriching(false);
    }
  };

  const handleEnrichBatch = async (leadIds: string[]) => {
    if (!actor || !tenantId || leadIds.length === 0) return;
    setEnriching(true);
    try {
      await leadEngine_enrichBatch(actor, tenantId, leadIds);
      const page = await leadEngine_listLeads(
        actor,
        tenantId,
        {
          dedupeStatus: undefined,
          enrichmentStatus: undefined,
          batchId: undefined,
        },
        0,
        50,
      );
      setEnrichLeads(page.leads);
    } catch (e) {
      console.error("Batch enrich failed:", e);
    } finally {
      setEnriching(false);
    }
  };

  const loadBatches = useCallback(async () => {
    if (!actor || !tenantId) return;
    setBatchesLoading(true);
    setError(null);
    try {
      const result = await listBatches(actor, tenantId);
      setBatches(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load batch history");
    } finally {
      setBatchesLoading(false);
    }
  }, [actor, tenantId]);

  const handleFile = useCallback(
    (file: File) => {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      setBatchSummary(null);
      setParsedFile(null);
      setMapping(null);

      const reader = new FileReader();
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.onload = () => {
        const text = reader.result as string;
        try {
          let parsed: { headers: string[]; rows: ParsedRow[] };
          let format: SourceFormat;
          if (
            file.name.toLowerCase().endsWith(".json") ||
            text.trim().startsWith("[") ||
            text.trim().startsWith("{")
          ) {
            parsed = parseJSON(text);
            format = "json";
          } else {
            parsed = parseCSV(text);
            format = detectFormat(parsed.headers);
          }
          const detected = format;
          const effectiveFormat =
            formatOverride !== "auto" ? formatOverride : format;
          const finalFormat =
            effectiveFormat === "auto" ? detected : effectiveFormat;
          const autoMapping = autoMap(parsed.headers, finalFormat);
          setParsedFile({
            name: file.name,
            format: finalFormat,
            detectedFormat: detected,
            headers: parsed.headers,
            rows: parsed.rows,
            rawText: text,
          });
          setMapping(autoMapping);
          setUploadProgress(100);
        } catch (e) {
          setError(
            e instanceof Error
              ? `Parse error: ${e.message}`
              : "Failed to parse file",
          );
        } finally {
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read file");
        setUploading(false);
      };
      reader.readAsText(file);
    },
    [formatOverride],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // Re-apply mapping when format override changes
  useEffect(() => {
    if (parsedFile && formatOverride !== "auto") {
      const newMapping = autoMap(parsedFile.headers, formatOverride);
      setMapping(newMapping);
    } else if (parsedFile && formatOverride === "auto") {
      const newMapping = autoMap(parsedFile.headers, parsedFile.detectedFormat);
      setMapping(newMapping);
    }
  }, [
    formatOverride,
    parsedFile,
    parsedFile?.detectedFormat,
    parsedFile?.headers,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateMapping = (field: keyof RawLeadInput, value: string) => {
    setMapping((prev) =>
      prev ? { ...prev, [field]: value === "__none" ? null : value } : prev,
    );
  };

  const previewLeads: RawLeadInput[] = useMemo(() => {
    if (!parsedFile || !mapping) return [];
    const defaults = {
      niche: defaultNiche,
      source: defaultSource,
      locationTags: defaultLocationTags,
      sourceTags: defaultSourceTags,
    };
    return parsedFile.rows
      .slice(0, PREVIEW_ROW_LIMIT)
      .map((row) => buildLead(row, mapping, defaults));
  }, [
    parsedFile,
    mapping,
    defaultNiche,
    defaultSource,
    defaultLocationTags,
    defaultSourceTags,
  ]);

  const allLeads: RawLeadInput[] = useMemo(() => {
    if (!parsedFile || !mapping) return [];
    const defaults = {
      niche: defaultNiche,
      source: defaultSource,
      locationTags: defaultLocationTags,
      sourceTags: defaultSourceTags,
    };
    return parsedFile.rows.map((row) => buildLead(row, mapping, defaults));
  }, [
    parsedFile,
    mapping,
    defaultNiche,
    defaultSource,
    defaultLocationTags,
    defaultSourceTags,
  ]);

  const unmappedColumns = useMemo(() => {
    if (!parsedFile || !mapping) return [];
    const mappedCols = new Set(Object.values(mapping).filter(Boolean));
    return parsedFile.headers.filter((h) => !mappedCols.has(h));
  }, [parsedFile, mapping]);

  const missingRequired = useMemo(() => {
    if (!mapping) return [];
    const missing: string[] = [];
    if (!mapping.businessName) missing.push("Business Name");
    return missing;
  }, [mapping]);

  const previewStats = useMemo(() => {
    let valid = 0;
    let invalid = 0;
    for (const l of allLeads) {
      if (isLeadValid(l)) valid++;
      else invalid++;
    }
    return { valid, invalid, total: allLeads.length };
  }, [allLeads]);

  const handleImport = async () => {
    if (!actor || !tenantId || !enabled) return;
    if (allLeads.length === 0) return;
    setImporting(true);
    setError(null);
    setBatchSummary(null);
    try {
      const name = importerName.trim() || "Manual Import";
      const result = await importLeads(
        actor,
        tenantId,
        name,
        sourceTool,
        allLeads,
      );
      setBatchSummary({
        result,
        importerName: name,
        sourceTool,
        timestamp: Date.now(),
      });
      // Reset file state but keep summary
      setParsedFile(null);
      setMapping(null);
      setUploadProgress(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setParsedFile(null);
    setMapping(null);
    setUploadProgress(0);
    setBatchSummary(null);
    setError(null);
    setImporterName("");
    setDefaultNiche("");
    setDefaultSource("");
    setDefaultLocationTags("");
    setDefaultSourceTags("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const viewBatch = async (batchId: string) => {
    if (!actor || !tenantId) return;
    try {
      const batch = await getImportBatch(actor, tenantId, batchId);
      if (batch) {
        setSelectedBatch(batch);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load batch");
    }
  };

  // ---------- Disabled / Empty State ----------

  if (!enabled) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full bg-gray-800/60 border border-white/10 rounded-2xl p-10 text-center"
          data-ocid="lead_engine.empty_state"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            Lead Engine is not enabled
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Lead Engine gives you a unified importer for raw lead lists from
            sources like Gosom and Omkar — with auto-format detection, field
            mapping, duplicate flagging, and batch history. Connect with your
            administrator to enable the
            <span className="font-mono text-purple-300">
              {" "}
              LEAD_ENGINE_ENABLED{" "}
            </span>
            integration flag.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/60 border border-white/5 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span>
              Feature flag:{" "}
              <span className="font-mono text-purple-300">
                LEAD_ENGINE_ENABLED = false
              </span>
            </span>
          </div>
          <button
            type="button"
            disabled
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300/50 cursor-not-allowed"
            data-ocid="lead_engine.disabled.cta"
          >
            <Upload className="w-4 h-4" />
            Import Leads
          </button>
        </motion.div>
      </div>
    );
  }

  // ---------- Render ----------

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-purple-300" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Lead Engine
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300">
                v212
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Unified lead importer with format auto-detection, field mapping,
              and duplicate flagging.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTab("history")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/60 border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-smooth"
            data-ocid="lead_engine.history_button"
          >
            <History className="w-4 h-4" />
            History
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(
            [
              { id: "import", label: "Import", icon: Upload },
              { id: "history", label: "History", icon: History },
              { id: "dedupe", label: "Dedupe", icon: Users },
              { id: "enrich", label: "Enrich", icon: Sparkles },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  active
                    ? "border-purple-400 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`lead_engine.tab.${t.id}`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div
            className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300"
            data-ocid="lead_engine.error_state"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">{error}</div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-300/70 hover:text-red-200"
              data-ocid="lead_engine.error.dismiss"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {tab === "import" && (
          <ImportTab
            parsedFile={parsedFile}
            mapping={mapping}
            formatOverride={formatOverride}
            setFormatOverride={setFormatOverride}
            uploading={uploading}
            uploadProgress={uploadProgress}
            importing={importing}
            importerName={importerName}
            setImporterName={setImporterName}
            sourceTool={sourceTool}
            setSourceTool={setSourceTool}
            defaultNiche={defaultNiche}
            setDefaultNiche={setDefaultNiche}
            defaultSource={defaultSource}
            setDefaultSource={setDefaultSource}
            defaultLocationTags={defaultLocationTags}
            setDefaultLocationTags={setDefaultLocationTags}
            defaultSourceTags={defaultSourceTags}
            setDefaultSourceTags={setDefaultSourceTags}
            batchSummary={batchSummary}
            rejectedExpanded={rejectedExpanded}
            setRejectedExpanded={setRejectedExpanded}
            previewLeads={previewLeads}
            previewStats={previewStats}
            unmappedColumns={unmappedColumns}
            missingRequired={missingRequired}
            dragActive={dragActive}
            setDragActive={setDragActive}
            onDrop={onDrop}
            onFileSelect={onFileSelect}
            fileInputRef={fileInputRef}
            updateMapping={updateMapping}
            handleImport={handleImport}
            resetImport={resetImport}
          />
        )}

        {tab === "history" && (
          <HistoryTab
            batches={batches}
            loading={batchesLoading}
            selectedBatch={selectedBatch}
            setSelectedBatch={setSelectedBatch}
            loadBatches={loadBatches}
            viewBatch={viewBatch}
          />
        )}

        {actor && tab === "dedupe" && (
          <LeadEngineDedupeTab
            groups={dedupeGroups}
            actor={actor}
            tenantId={tenantId}
            onResolve={handleResolve}
            onShowLead={setSelectedLead}
            resolving={resolving}
          />
        )}
        {tab === "enrich" && (
          <LeadEngineEnrichTab
            leads={enrichLeads}
            onEnrichOne={handleEnrichOne}
            onEnrichBatch={handleEnrichBatch}
            onShowLead={setSelectedLead}
            enriching={enriching}
          />
        )}
        <LeadEngineLeadDetailDrawer
          lead={selectedLead}
          actor={actor}
          tenantId={tenantId}
          onClose={() => setSelectedLead(null)}
        />
      </div>
    </div>
  );
}

// ---------- Import Tab ----------

interface ImportTabProps {
  parsedFile: ParsedFile | null;
  mapping: FieldMapping | null;
  formatOverride: SourceFormat;
  setFormatOverride: (f: SourceFormat) => void;
  uploading: boolean;
  uploadProgress: number;
  importing: boolean;
  importerName: string;
  setImporterName: (s: string) => void;
  sourceTool: string;
  setSourceTool: (s: string) => void;
  defaultNiche: string;
  setDefaultNiche: (s: string) => void;
  defaultSource: string;
  setDefaultSource: (s: string) => void;
  defaultLocationTags: string;
  setDefaultLocationTags: (s: string) => void;
  defaultSourceTags: string;
  setDefaultSourceTags: (s: string) => void;
  batchSummary: BatchSummary | null;
  rejectedExpanded: boolean;
  setRejectedExpanded: (b: boolean) => void;
  previewLeads: RawLeadInput[];
  previewStats: { valid: number; invalid: number; total: number };
  unmappedColumns: string[];
  missingRequired: string[];
  dragActive: boolean;
  setDragActive: (b: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  updateMapping: (field: keyof RawLeadInput, value: string) => void;
  handleImport: () => void;
  resetImport: () => void;
}

function ImportTab(props: ImportTabProps) {
  const {
    parsedFile,
    mapping,
    formatOverride,
    setFormatOverride,
    uploading,
    uploadProgress,
    importing,
    importerName,
    setImporterName,
    sourceTool,
    setSourceTool,
    defaultNiche,
    setDefaultNiche,
    defaultSource,
    setDefaultSource,
    defaultLocationTags,
    setDefaultLocationTags,
    defaultSourceTags,
    setDefaultSourceTags,
    batchSummary,
    rejectedExpanded,
    setRejectedExpanded,
    previewLeads,
    previewStats,
    unmappedColumns,
    missingRequired,
    dragActive,
    setDragActive,
    onDrop,
    onFileSelect,
    fileInputRef,
    updateMapping,
    handleImport,
    resetImport,
  } = props;

  // Show summary if present
  if (batchSummary) {
    return (
      <ImportSummary
        summary={batchSummary}
        rejectedExpanded={rejectedExpanded}
        setRejectedExpanded={setRejectedExpanded}
        onNewImport={resetImport}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!parsedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/60 border border-white/10 rounded-2xl p-8"
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-smooth ${
              dragActive
                ? "border-purple-400 bg-purple-500/10"
                : "border-white/15 hover:border-purple-400/50 hover:bg-purple-500/5"
            }`}
            data-ocid="lead_engine.dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={onFileSelect}
              className="hidden"
              data-ocid="lead_engine.file_input"
            />
            <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-purple-300" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              Drop a lead list to import
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              CSV or JSON · Gosom, Omkar, and generic formats auto-detected
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-smooth disabled:opacity-50"
              data-ocid="lead_engine.upload_button"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Choose File
                </>
              )}
            </button>
            {uploading && (
              <div className="mt-4 max-w-xs mx-auto">
                <div className="h-1.5 rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* File Loaded — Mapping & Preview */}
      {parsedFile && mapping && (
        <AnimatePresence mode="wait">
          <motion.div
            key="import-flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* File Info Bar */}
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  {parsedFile.format === "json" ? (
                    <FileText className="w-5 h-5 text-purple-300" />
                  ) : (
                    <FileSpreadsheet className="w-5 h-5 text-purple-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {parsedFile.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {parsedFile.rows.length} rows · {parsedFile.headers.length}{" "}
                    columns · format:{" "}
                    <span className="font-mono text-purple-300">
                      {parsedFile.format}
                    </span>
                    {parsedFile.format !== parsedFile.detectedFormat && (
                      <span className="text-muted-foreground">
                        {" "}
                        (detected: {parsedFile.detectedFormat})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={resetImport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/50 border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-smooth"
                data-ocid="lead_engine.clear_file"
              >
                <XCircle className="w-4 h-4" />
                Clear
              </button>
            </div>

            {/* Format Override */}
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-4">
              <label
                htmlFor="lead-engine-format-select"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Source format
              </label>
              <div className="flex items-center gap-3">
                <select
                  id="lead-engine-format-select"
                  value={formatOverride}
                  onChange={(e) =>
                    setFormatOverride(e.target.value as SourceFormat)
                  }
                  className="bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
                  data-ocid="lead_engine.format_select"
                >
                  <option value="auto">
                    Auto-detect (current: {parsedFile.detectedFormat})
                  </option>
                  <option value="gosom">Gosom</option>
                  <option value="omkar">Omkar</option>
                  <option value="generic-csv">Generic CSV</option>
                  <option value="json">JSON</option>
                </select>
                <span className="text-xs text-muted-foreground">
                  Override the auto-detected format if needed.
                </span>
              </div>
            </div>

            {/* Field Mapping */}
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Table2 className="w-5 h-5 text-purple-300" />
                <h3 className="font-display font-semibold text-foreground">
                  Field Mapping
                </h3>
                {missingRequired.length > 0 && (
                  <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing required: {missingRequired.join(", ")}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {RAW_LEAD_FIELDS.map((field) => {
                  const value = mapping[field.key] ?? "__none";
                  return (
                    <div key={field.key} className="flex items-center gap-3">
                      <div className="w-40 flex-shrink-0">
                        <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                          {field.label}
                          {field.required && (
                            <span className="text-red-400">*</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {field.type}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <select
                        value={value}
                        onChange={(e) =>
                          updateMapping(field.key, e.target.value)
                        }
                        className="flex-1 bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400 min-w-0"
                        data-ocid={`lead_engine.mapping.${field.key}`}
                      >
                        <option value="__none">— unmapped —</option>
                        {parsedFile.headers.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              {unmappedColumns.length > 0 && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Unmapped columns:</span>{" "}
                    <span className="font-mono">
                      {unmappedColumns.join(", ")}
                    </span>
                    <div className="mt-1 text-amber-300/70">
                      These columns will not be imported.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Batch Tagging */}
            <div className="bg-gray-800/60 border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-purple-300" />
                <h3 className="font-display font-semibold text-foreground">
                  Batch Tagging
                </h3>
                <span className="text-xs text-muted-foreground ml-2">
                  Applied to all leads in this batch
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lead-engine-importer-name"
                    className="text-xs font-medium text-muted-foreground mb-1 block"
                  >
                    Importer name
                  </label>
                  <input
                    id="lead-engine-importer-name"
                    type="text"
                    value={importerName}
                    onChange={(e) => setImporterName(e.target.value)}
                    placeholder="Manual Import"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
                    data-ocid="lead_engine.importer_name.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-engine-source-tool"
                    className="text-xs font-medium text-muted-foreground mb-1 block"
                  >
                    Source tool
                  </label>
                  <input
                    id="lead-engine-source-tool"
                    type="text"
                    value={sourceTool}
                    onChange={(e) => setSourceTool(e.target.value)}
                    placeholder="manual-upload"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
                    data-ocid="lead_engine.source_tool.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-engine-default-niche"
                    className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3" /> Default niche
                  </label>
                  <input
                    id="lead-engine-default-niche"
                    type="text"
                    value={defaultNiche}
                    onChange={(e) => setDefaultNiche(e.target.value)}
                    placeholder="e.g. restaurants"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
                    data-ocid="lead_engine.default_niche.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-engine-default-source"
                    className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3" /> Default source
                  </label>
                  <input
                    id="lead-engine-default-source"
                    type="text"
                    value={defaultSource}
                    onChange={(e) => setDefaultSource(e.target.value)}
                    placeholder="e.g. gosom-directory"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
                    data-ocid="lead_engine.default_source.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-engine-default-location-tags"
                    className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> Default location tags
                  </label>
                  <input
                    id="lead-engine-default-location-tags"
                    type="text"
                    value={defaultLocationTags}
                    onChange={(e) => setDefaultLocationTags(e.target.value)}
                    placeholder="comma-separated, e.g. london, uk"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
                    data-ocid="lead_engine.default_location_tags.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-engine-default-source-tags"
                    className="text-xs font-medium text-muted-foreground mb-1 block flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" /> Default source tags
                  </label>
                  <input
                    id="lead-engine-default-source-tags"
                    type="text"
                    value={defaultSourceTags}
                    onChange={(e) => setDefaultSourceTags(e.target.value)}
                    placeholder="comma-separated, e.g. q3-outreach, cold"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-purple-400"
                    data-ocid="lead_engine.default_source_tags.input"
                  />
                </div>
              </div>
            </div>

            {/* Preview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                label="Total rows"
                value={previewStats.total}
                icon={Table2}
                color="purple"
              />
              <StatCard
                label="Valid"
                value={previewStats.valid}
                icon={CheckCircle2}
                color="emerald"
              />
              <StatCard
                label="Will be rejected"
                value={previewStats.invalid}
                icon={XCircle}
                color="red"
              />
              <StatCard
                label="Preview limit"
                value={Math.min(previewStats.total, PREVIEW_ROW_LIMIT)}
                icon={Eye}
                color="indigo"
              />
            </div>

            {/* Preview Table */}
            <div className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-300" />
                  <h3 className="font-display font-semibold text-foreground text-sm">
                    Preview · first{" "}
                    {Math.min(previewLeads.length, PREVIEW_ROW_LIMIT)} rows
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-900/40 border-b border-white/10">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        #
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Business
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Phone
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Niche
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewLeads.map((lead, idx) => {
                      const valid = isLeadValid(lead);
                      return (
                        <tr
                          key={`${lead.businessName ?? ""}-${lead.phone ?? ""}-${lead.email ?? ""}-${idx}`}
                          className={`border-b border-white/5 ${valid ? "" : "bg-red-500/5"}`}
                          data-ocid={`lead_engine.preview.row.${idx + 1}`}
                        >
                          <td className="px-3 py-2 text-xs text-muted-foreground font-mono">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2 text-foreground truncate max-w-[200px]">
                            {lead.businessName || (
                              <span className="text-red-400">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[140px]">
                            {lead.phone || "—"}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[180px]">
                            {lead.email || "—"}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground truncate max-w-[120px]">
                            {lead.niche || "—"}
                          </td>
                          <td className="px-3 py-2">
                            {valid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                <CheckCircle2 className="w-3 h-3" /> ok
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-500/10 border border-red-500/30 text-red-300">
                                <XCircle className="w-3 h-3" /> reject
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commit Bar */}
            <div className="sticky bottom-4 bg-gray-800/80 backdrop-blur border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Ready to import{" "}
                <span className="font-mono text-purple-300">
                  {previewStats.total}
                </span>{" "}
                leads
                {previewStats.invalid > 0 && (
                  <span className="text-red-300">
                    {" "}
                    · {previewStats.invalid} will be rejected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetImport}
                  disabled={importing}
                  className="px-4 py-2 rounded-lg bg-gray-700/50 border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-smooth disabled:opacity-50"
                  data-ocid="lead_engine.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={
                    importing ||
                    previewStats.total === 0 ||
                    missingRequired.length > 0
                  }
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  data-ocid="lead_engine.submit_button"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Import {previewStats.total} leads
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

// ---------- Stat Card ----------

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "purple" | "emerald" | "red" | "indigo";
}) {
  const colorMap = {
    purple: "text-purple-300 border-purple-500/30 bg-purple-500/5",
    emerald: "text-emerald-300 border-emerald-500/30 bg-emerald-500/5",
    red: "text-red-300 border-red-500/30 bg-red-500/5",
    indigo: "text-indigo-300 border-indigo-500/30 bg-indigo-500/5",
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 opacity-70" />
      </div>
      <div className="text-2xl font-display font-bold">
        {formatBigInt(value)}
      </div>
    </div>
  );
}

// ---------- Import Summary ----------

function ImportSummary({
  summary,
  rejectedExpanded,
  setRejectedExpanded,
  onNewImport,
}: {
  summary: BatchSummary;
  rejectedExpanded: boolean;
  setRejectedExpanded: (b: boolean) => void;
  onNewImport: () => void;
}) {
  const { result } = summary;
  const rejected: RejectedRow[] = result.rejectedRows ?? [];
  const total =
    Number(result.imported) +
    Number(result.skipped) +
    Number(result.flagged) +
    rejected.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Success header */}
      <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-display font-bold text-foreground mb-1">
              Import complete
            </h2>
            <p className="text-sm text-muted-foreground">
              Batch{" "}
              <span className="font-mono text-purple-300">
                {result.batchId}
              </span>{" "}
              · {summary.importerName} · {summary.sourceTool}
            </p>
          </div>
          <button
            type="button"
            onClick={onNewImport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium shadow-lg shadow-purple-500/20 transition-smooth"
            data-ocid="lead_engine.new_import_button"
          >
            <Upload className="w-4 h-4" />
            New Import
          </button>
        </div>
      </div>

      {/* Counts grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryStat
          label="Imported"
          value={result.imported}
          icon={CheckCircle2}
          color="emerald"
        />
        <SummaryStat
          label="Skipped (duplicate)"
          value={result.skipped}
          icon={Layers}
          color="amber"
        />
        <SummaryStat
          label="Flagged"
          value={result.flagged}
          icon={AlertTriangle}
          color="purple"
        />
        <SummaryStat
          label="Rejected"
          value={rejected.length}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Batch link */}
      <div className="bg-gray-800/60 border border-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Database className="w-5 h-5 text-purple-300 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">Batch ID</div>
            <div className="font-mono text-foreground truncate">
              {result.batchId}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-sm text-purple-300 hover:bg-purple-500/20 transition-smooth"
          data-ocid="lead_engine.view_batch_link"
        >
          View full batch
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rejected rows */}
      {rejected.length > 0 && (
        <div className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setRejectedExpanded(!rejectedExpanded)}
            className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-smooth"
            data-ocid="lead_engine.rejected.toggle"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="font-medium text-foreground">Rejected rows</span>
              <span className="px-2 py-0.5 rounded text-xs bg-red-500/10 border border-red-500/30 text-red-300 font-mono">
                {rejected.length}
              </span>
            </div>
            {rejectedExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {rejectedExpanded && (
            <div className="border-t border-white/10 divide-y divide-white/5">
              {rejected.map((row, idx) => (
                <div
                  key={`${row.rowIndex}-${row.reason}-${idx}`}
                  className="px-5 py-3"
                  data-ocid={`lead_engine.rejected.row.${idx + 1}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      row {Number(row.rowIndex)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs bg-red-500/10 border border-red-500/30 text-red-300 font-mono">
                      {row.reason}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <RawField label="business" value={row.raw.businessName} />
                    <RawField label="phone" value={row.raw.phone} />
                    <RawField label="email" value={row.raw.email} />
                    <RawField label="niche" value={row.raw.niche} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        Total processed: {formatBigInt(total)} · {formatDate(summary.timestamp)}
      </div>
    </motion.div>
  );
}

function SummaryStat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: bigint | number;
  icon: React.ComponentType<{ className?: string }>;
  color: "emerald" | "amber" | "purple" | "red" | "indigo";
}) {
  const colorMap = {
    emerald: "text-emerald-300 border-emerald-500/30 bg-emerald-500/5",
    amber: "text-amber-300 border-amber-500/30 bg-amber-500/5",
    purple: "text-purple-300 border-purple-500/30 bg-purple-500/5",
    red: "text-red-300 border-red-500/30 bg-red-500/5",
    indigo: "text-indigo-300 border-indigo-500/30 bg-indigo-500/5",
  };
  return (
    <div
      className={`rounded-xl border p-4 ${colorMap[color]}`}
      data-ocid={`lead_engine.summary.${label}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 opacity-70" />
      </div>
      <div className="text-2xl font-display font-bold">
        {formatBigInt(value)}
      </div>
    </div>
  );
}

function RawField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-muted-foreground/70 font-mono">{label}</div>
      <div className="text-foreground truncate">{value || "—"}</div>
    </div>
  );
}

// ---------- History Tab ----------

function HistoryTab({
  batches,
  loading,
  selectedBatch,
  setSelectedBatch,
  loadBatches,
  viewBatch,
}: {
  batches: LeadEngineBatch[];
  loading: boolean;
  selectedBatch: LeadEngineBatch | null;
  setSelectedBatch: (b: LeadEngineBatch | null) => void;
  loadBatches: () => void;
  viewBatch: (id: string) => void;
}) {
  if (selectedBatch) {
    return (
      <BatchDetail
        batch={selectedBatch}
        onBack={() => setSelectedBatch(null)}
      />
    );
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20 text-muted-foreground"
        data-ocid="lead_engine.history.loading_state"
      >
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading batch history...
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div
        className="bg-gray-800/60 border border-white/10 rounded-2xl p-12 text-center"
        data-ocid="lead_engine.history.empty_state"
      >
        <div className="mx-auto w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
          <History className="w-7 h-7 text-purple-300" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
          No import batches yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Run your first import to see batch history here.
        </p>
        <button
          type="button"
          onClick={loadBatches}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50 border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          data-ocid="lead_engine.history.refresh"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-foreground">
          Recent import batches
        </h2>
        <button
          type="button"
          onClick={loadBatches}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700/50 border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-smooth"
          data-ocid="lead_engine.history.refresh"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900/40 border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Importer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Source
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                Total
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                Imported
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                Skipped
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                Flagged
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {batches.map((b, idx) => (
              <tr
                key={b.id}
                onClick={() => viewBatch(b.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    viewBatch(b.id);
                  }
                }}
                tabIndex={0}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-smooth"
                data-ocid={`lead_engine.history.row.${idx + 1}`}
              >
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatDate(b.createdAt)}
                </td>
                <td className="px-4 py-3 text-foreground truncate max-w-[160px]">
                  {b.importerName}
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs truncate max-w-[140px]">
                  {b.sourceTool}
                </td>
                <td className="px-4 py-3 text-right text-foreground font-mono">
                  {formatBigInt(b.totalRows)}
                </td>
                <td className="px-4 py-3 text-right text-emerald-300 font-mono">
                  {formatBigInt(b.imported)}
                </td>
                <td className="px-4 py-3 text-right text-amber-300 font-mono">
                  {formatBigInt(b.skipped)}
                </td>
                <td className="px-4 py-3 text-right text-purple-300 font-mono">
                  {formatBigInt(b.flagged)}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-700/50 border border-white/10 text-muted-foreground font-mono">
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Batch Detail ----------

function BatchDetail({
  batch,
  onBack,
}: { batch: LeadEngineBatch; onBack: () => void }) {
  const rejected: RejectedRow[] = batch.rejected ?? [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
        data-ocid="lead_engine.batch.back"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to history
      </button>

      <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-display font-bold text-foreground mb-1">
              {batch.importerName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Batch{" "}
              <span className="font-mono text-purple-300">{batch.id}</span> ·{" "}
              {formatDate(batch.createdAt)}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-xs bg-gray-700/50 border border-white/10 text-muted-foreground font-mono">
            {batch.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryStat
          label="Total rows"
          value={batch.totalRows}
          icon={Table2}
          color="indigo"
        />
        <SummaryStat
          label="Imported"
          value={batch.imported}
          icon={CheckCircle2}
          color="emerald"
        />
        <SummaryStat
          label="Skipped"
          value={batch.skipped}
          icon={Layers}
          color="amber"
        />
        <SummaryStat
          label="Flagged"
          value={batch.flagged}
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      <div className="bg-gray-800/60 border border-white/10 rounded-xl p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Source tool
            </div>
            <div className="font-mono text-foreground">{batch.sourceTool}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Importer</div>
            <div className="text-foreground">{batch.importerName}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Created</div>
            <div className="text-foreground">{formatDate(batch.createdAt)}</div>
          </div>
        </div>
      </div>

      {rejected.length > 0 && (
        <div className="bg-gray-800/60 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="font-medium text-foreground">Rejected rows</span>
            <span className="px-2 py-0.5 rounded text-xs bg-red-500/10 border border-red-500/30 text-red-300 font-mono">
              {rejected.length}
            </span>
          </div>
          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {rejected.map((row, idx) => (
              <div
                key={`${row.rowIndex}-${row.reason}-${idx}`}
                className="px-5 py-3"
                data-ocid={`lead_engine.batch.rejected.row.${idx + 1}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    row {Number(row.rowIndex)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-red-500/10 border border-red-500/30 text-red-300 font-mono">
                    {row.reason}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <RawField label="business" value={row.raw.businessName} />
                  <RawField label="phone" value={row.raw.phone} />
                  <RawField label="email" value={row.raw.email} />
                  <RawField label="niche" value={row.raw.niche} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
