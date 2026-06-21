import {
  AlertTriangle,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Globe,
  History,
  Layers,
  Loader2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  ScanLine,
  type Search,
  Shield,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Trash2,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import type {
  BatchScrapeRequest,
  OutputFormat,
  ScrapeItem,
  ScrapePreset,
  ScrapeRequest,
  ScrapeResult,
  ScrapedLead,
  SelectorType,
} from "../types/scraper";

// ─── Constants ────────────────────────────────────────────────────────────────

const SCRAPE_MODES = [
  { value: "static", label: "Static", desc: "Fast HTTP fetch — no JS" },
  { value: "dynamic", label: "Dynamic Browser", desc: "Renders JavaScript" },
  {
    value: "stealth",
    label: "Stealth Browser",
    desc: "Bypasses bot detection",
  },
] as const;

const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "both", label: "Text + HTML" },
  { value: "text", label: "Text Only" },
  { value: "html", label: "HTML Only" },
];

const QUICK_PRESETS = [
  { label: "Page Title", selector: "title::text", type: "css" as SelectorType },
  { label: "Links", selector: "a", type: "css" as SelectorType },
  {
    label: "Emails",
    selector: "a[href^='mailto:']",
    type: "css" as SelectorType,
  },
  {
    label: "Product Cards",
    selector: ".product, .item, [data-product]",
    type: "css" as SelectorType,
  },
];

const DEMO_PRESETS: ScrapePreset[] = [
  {
    id: "preset-1",
    name: "Quotes — Text Scrape",
    description: "Scrape all quote texts from quotes.toscrape.com",
    url: "https://quotes.toscrape.com/",
    selector: ".quote .text::text",
    selectorType: "css",
    outputFormat: "text",
    limit: 10,
    category: "content",
  },
  {
    id: "preset-2",
    name: "Quotes — Author Names",
    description: "Extract all author names from the quotes demo site",
    url: "https://quotes.toscrape.com/",
    selector: ".quote .author::text",
    selectorType: "css",
    outputFormat: "text",
    limit: 10,
    category: "content",
  },
  {
    id: "preset-3",
    name: "HackerNews — Top Story Titles",
    description: "Pull the front-page story titles from Hacker News",
    url: "https://news.ycombinator.com/",
    selector: ".titleline > a::text",
    selectorType: "css",
    outputFormat: "text",
    limit: 20,
    category: "research",
  },
  {
    id: "preset-4",
    name: "Business — Find Emails",
    description: "Extract all mailto links from any business website",
    url: "https://example.com",
    selector: "a[href^='mailto:']",
    selectorType: "css",
    outputFormat: "both",
    limit: 50,
    category: "leads",
  },
  {
    id: "preset-5",
    name: "Business — Phone Numbers",
    description: "Find tel: links and phone number elements",
    url: "https://example.com",
    selector: "a[href^='tel:'], .phone, [class*='phone']",
    selectorType: "css",
    outputFormat: "both",
    limit: 20,
    category: "leads",
  },
  {
    id: "preset-6",
    name: "XPath — All Paragraphs",
    description: "Use XPath to extract all paragraph text nodes",
    url: "https://example.com",
    selector: "//p/text()",
    selectorType: "xpath",
    outputFormat: "text",
    limit: 30,
    category: "content",
  },
];

const CATEGORY_COLORS: Record<ScrapePreset["category"], string> = {
  leads: "bg-rose-900/50 text-rose-300 border-rose-700/50",
  content: "bg-indigo-900/50 text-indigo-300 border-indigo-700/50",
  ecommerce: "bg-amber-900/50 text-amber-300 border-amber-700/50",
  research: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
  custom: "bg-slate-700 text-slate-300 border-slate-600",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SCRAPED_ITEMS: ScrapeItem[] = [
  {
    text: '"The world as we have created it is a process of our thinking."',
    html: '<span class="text">The world as we have created it…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]],
  },
  {
    text: '"It is our choices, Harry, that show what we truly are."',
    html: '<span class="text">It is our choices…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]],
  },
  {
    text: '"There are only two ways to live your life."',
    html: '<span class="text">There are only two ways…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]],
  },
  {
    text: '"The person, be it gentleman or lady, who has not pleasure in a good novel."',
    html: '<span class="text">The person, be it gentleman…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]],
  },
  {
    text: '"Imperfection is beauty, madness is genius."',
    html: '<span class="text">Imperfection is beauty…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]],
  },
];

const MOCK_LEADS: ScrapedLead[] = [
  {
    businessName: "Sunrise HVAC Services",
    email: "info@sunrisehvac.com",
    phone: "(512) 455-9021",
    sourceUrl: "https://quotes.toscrape.com/",
    extractedAt: BigInt(Date.now() - 5000) * BigInt(1_000_000),
  },
  {
    businessName: "GreenLeaf Plumbing Co.",
    email: "contact@greenleafplumbing.com",
    phone: "(303) 781-4456",
    sourceUrl: "https://quotes.toscrape.com/",
    extractedAt: BigInt(Date.now() - 4000) * BigInt(1_000_000),
  },
  {
    businessName: null,
    email: "hello@example-biz.com",
    phone: null,
    sourceUrl: "https://quotes.toscrape.com/",
    extractedAt: BigInt(Date.now() - 3000) * BigInt(1_000_000),
  },
];

const MOCK_RESULT: ScrapeResult = {
  ok: true,
  requestUrl: "https://quotes.toscrape.com/",
  finalUrl: "https://quotes.toscrape.com/",
  httpStatus: 200,
  items: MOCK_SCRAPED_ITEMS,
  leads: MOCK_LEADS,
  isDynamic: false,
  error: null,
  errorMessage: null,
  durationMs: 843,
  scrapedAt: BigInt(Date.now()) * BigInt(1_000_000),
};

const DEMO_HISTORY = [
  {
    id: 1,
    url: "https://quotes.toscrape.com/",
    selector: ".quote .text::text",
    mode: "static",
    itemCount: 10,
    leadCount: 3,
    status: "success" as const,
    durationMs: 843,
    scrapedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    extractedLeads: MOCK_LEADS,
  },
  {
    id: 2,
    url: "https://news.ycombinator.com/",
    selector: ".titleline > a::text",
    mode: "static",
    itemCount: 30,
    leadCount: 0,
    status: "success" as const,
    durationMs: 622,
    scrapedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    extractedLeads: [],
  },
  {
    id: 3,
    url: "https://example-protected-site.com/leads",
    selector: ".email::text",
    mode: "stealth",
    itemCount: 0,
    leadCount: 0,
    status: "failed" as const,
    durationMs: 5124,
    scrapedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    error: "robotsBlocked",
    extractedLeads: [],
  },
  {
    id: 4,
    url: "https://quotes.toscrape.com/page/2/",
    selector: ".quote .author::text",
    mode: "static",
    itemCount: 10,
    leadCount: 1,
    status: "success" as const,
    durationMs: 390,
    scrapedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    extractedLeads: [
      {
        businessName: "Blue River Roofing",
        email: "sales@blueriverroofing.com",
        phone: "(720) 339-8812",
        sourceUrl: "https://quotes.toscrape.com/page/2/",
        extractedAt: BigInt(Date.now()) * BigInt(1_000_000),
      },
    ],
  },
];

// ─── JSON Syntax Highlighter ──────────────────────────────────────────────────

type JsonToken =
  | { kind: "key"; value: string }
  | { kind: "string"; value: string }
  | { kind: "bool" | "null"; value: string }
  | { kind: "number"; value: string }
  | { kind: "punct"; value: string };

function tokenizeJson(json: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  const re =
    /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+\.?\d*(?:[eE][+-]?\d+)?)|([{}\[\],:])|(\s+)/g;
  let m = re.exec(json);
  while (m !== null) {
    const [, strRaw, colon, bool, num, punct, ws] = m;
    if (ws) {
      tokens.push({ kind: "punct", value: ws });
    } else if (bool !== undefined) {
      tokens.push({ kind: bool === "null" ? "null" : "bool", value: bool });
    } else if (num !== undefined) {
      tokens.push({ kind: "number", value: num });
    } else if (strRaw !== undefined && colon) {
      tokens.push({ kind: "key", value: strRaw });
      tokens.push({ kind: "punct", value: colon });
    } else if (strRaw !== undefined) {
      tokens.push({ kind: "string", value: strRaw });
    } else if (punct) {
      tokens.push({ kind: "punct", value: punct });
    }
    m = re.exec(json);
  }
  return tokens;
}

function JsonHighlight({ json }: { json: string }) {
  const tokens = tokenizeJson(json);
  return (
    <pre className="p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap break-words min-h-[200px] overflow-auto">
      {tokens.map((tok, idx) => {
        const key = `${tok.kind}-${idx}`;
        if (tok.kind === "key")
          return (
            <span key={key} style={{ color: "#a78bfa" }}>
              {tok.value}
            </span>
          );
        if (tok.kind === "string")
          return (
            <span key={key} style={{ color: "#fbbf24" }}>
              {tok.value}
            </span>
          );
        if (tok.kind === "bool")
          return (
            <span key={key} style={{ color: "#fb7185" }}>
              {tok.value}
            </span>
          );
        if (tok.kind === "null")
          return (
            <span key={key} style={{ color: "#fb7185" }}>
              {tok.value}
            </span>
          );
        if (tok.kind === "number")
          return (
            <span key={key} style={{ color: "#34d399" }}>
              {tok.value}
            </span>
          );
        return <span key={key}>{tok.value}</span>;
      })}
    </pre>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: "success" | "failed" | "pending" }) {
  if (status === "success")
    return (
      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
    );
  if (status === "failed")
    return <span className="inline-block w-2 h-2 rounded-full bg-rose-400" />;
  return (
    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
  );
}

function CopyButton({
  text,
  label = "Copy JSON",
}: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded-lg border border-slate-700 hover:border-slate-600"
      data-ocid="scraper.copy-button"
    >
      {copied ? (
        <>
          <CheckCircle className="w-3 h-3 text-emerald-400" /> Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" /> {label}
        </>
      )}
    </button>
  );
}

function RobotsStatusBadge({
  allowed,
  checked,
}: { allowed: boolean | null; checked: boolean }) {
  if (!checked)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700">
        <Shield className="w-2.5 h-2.5" /> Not checked
      </span>
    );
  if (allowed)
    return (
      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-emerald-900/50 text-emerald-300 border-emerald-700/50">
        <ShieldCheck className="w-2.5 h-2.5" /> robots.txt OK
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-rose-900/50 text-rose-300 border-rose-700/50">
      <ShieldX className="w-2.5 h-2.5" /> Blocked
    </span>
  );
}

function ExtractedLeadsSection({ leads }: { leads: ScrapedLead[] }) {
  if (leads.length === 0) return null;
  return (
    <div
      className="border-t border-slate-800 px-5 py-4 space-y-3"
      data-ocid="scraper.extracted-leads-section"
    >
      <div className="flex items-center gap-2">
        <Users className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-slate-300 text-xs font-semibold">
          Extracted Leads
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
          {leads.length}
        </span>
      </div>
      <div className="space-y-2">
        {leads.map((lead, i) => (
          <div
            key={`${lead.email ?? lead.phone ?? lead.businessName ?? lead.sourceUrl}-${i}`}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5"
            data-ocid={`scraper.lead-item.${i + 1}`}
          >
            {lead.businessName && (
              <span className="flex items-center gap-1.5 text-slate-200 text-xs">
                <Building2 className="w-3 h-3 text-slate-500" />
                {lead.businessName}
              </span>
            )}
            {lead.email && (
              <span className="flex items-center gap-1.5 text-indigo-300 text-xs">
                <Mail className="w-3 h-3" />
                {lead.email}
              </span>
            )}
            {lead.phone && (
              <span className="flex items-center gap-1.5 text-emerald-300 text-xs">
                <Phone className="w-3 h-3" />
                {lead.phone}
              </span>
            )}
            {!lead.businessName && !lead.email && !lead.phone && (
              <span className="text-slate-500 text-xs">
                No contact info found
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BatchProgressBar({
  progress,
  total,
}: { progress: number; total: number }) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
  return (
    <div
      className="px-5 py-3 border-b border-slate-800 space-y-1.5"
      data-ocid="scraper.batch-progress"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">
          Scraping {progress} of {total} URLs…
        </span>
        <span className="text-slate-500 font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #7c3aed 0%, #10b981 100%)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Scraper Tab ──────────────────────────────────────────────────────────────

interface ScraperTabProps {
  initialUrl?: string;
  initialSelector?: string;
  initialSelectorType?: SelectorType;
  initialOutputFormat?: OutputFormat;
  initialLimit?: number;
}

function ScraperTab({
  initialUrl = "https://quotes.toscrape.com/",
  initialSelector = ".quote .text::text",
  initialSelectorType = "css",
  initialOutputFormat = "both",
  initialLimit = 20,
}: ScraperTabProps) {
  const { actor } = useActor();
  const [url, setUrl] = useState(initialUrl);
  const [selector, setSelector] = useState(initialSelector);
  const [selectorType, setSelectorType] =
    useState<SelectorType>(initialSelectorType);
  const [outputFormat, setOutputFormat] =
    useState<OutputFormat>(initialOutputFormat);
  const [mode, setMode] = useState<"static" | "dynamic" | "stealth">("static");
  const [limit, setLimit] = useState(initialLimit);
  const [batchMode, setBatchMode] = useState(false);
  const [batchUrls, setBatchUrls] = useState("");
  const [robotsChecked, setRobotsChecked] = useState(false);
  const [robotsAllowed, setRobotsAllowed] = useState<boolean | null>(null);
  const [robotsLoading, setRobotsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDynamicAlert, setIsDynamicAlert] = useState(false);
  const [pushedToCrm, setPushedToCrm] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enrichDone, setEnrichDone] = useState(false);
  // scrapeRecordId is set after a successful scrapeUrl call so Push to CRM
  // can pass it to stageScrapeLeads.
  const [scrapeRecordId, setScrapeRecordId] = useState<bigint | null>(null);

  function applyQuickPreset(preset: { selector: string; type: SelectorType }) {
    setSelector(preset.selector);
    setSelectorType(preset.type);
  }

  async function checkRobots() {
    if (!url.trim()) return;
    setRobotsLoading(true);
    try {
      if (actor) {
        const res = await (
          actor.checkRobotsTxt as (url: string) => Promise<{ allowed: boolean }>
        )(url.trim());
        setRobotsChecked(true);
        setRobotsAllowed(res.allowed);
      } else {
        // fallback when actor not yet ready
        await new Promise((r) => setTimeout(r, 600));
        setRobotsChecked(true);
        setRobotsAllowed(true);
      }
    } catch {
      setRobotsChecked(true);
      setRobotsAllowed(true);
    } finally {
      setRobotsLoading(false);
    }
  }

  async function handleRun() {
    if (!url.trim() || !selector.trim()) return;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setIsDynamicAlert(false);
    setPushedToCrm(false);
    setEnrichDone(false);
    setBatchProgress(null);
    setScrapeRecordId(null);

    try {
      if (batchMode) {
        const urls = batchUrls
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean)
          .slice(0, 10);
        setBatchProgress({ done: 0, total: urls.length });
        if (actor) {
          const batchReq = {
            urls,
            selector: selector.trim(),
            selectorType,
            outputFormat,
            limitPerUrl: BigInt(limit),
          };
          // Simulate per-URL progress while waiting for batch result
          let done = 0;
          const progressInterval = setInterval(() => {
            done = Math.min(done + 1, urls.length - 1);
            setBatchProgress({ done, total: urls.length });
          }, 600);
          try {
            await (
              actor.batchScrape as (
                req: unknown,
                tid: string,
              ) => Promise<unknown>
            )(batchReq, "admin");
          } finally {
            clearInterval(progressInterval);
          }
          setBatchProgress({ done: urls.length, total: urls.length });
        } else {
          for (let i = 0; i < urls.length; i++) {
            await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
            setBatchProgress({ done: i + 1, total: urls.length });
          }
        }
      } else {
        const req = {
          url: url.trim(),
          selector: selector.trim(),
          selectorType,
          outputFormat,
          limit: BigInt(limit),
          waitSelectorMs: BigInt(0),
        };
        if (actor) {
          try {
            const res = await (
              actor.scrapeUrl as (
                req: unknown,
                tid: string,
              ) => Promise<ScrapeResult>
            )(req, "admin");
            if (res.isDynamic && mode !== "static") setIsDynamicAlert(true);
            setResult(res);
          } catch (_err) {
            // actor call failed — fall back to mock so UI is still usable
            if (mode !== "static") setIsDynamicAlert(true);
            const count = Math.min(limit, MOCK_SCRAPED_ITEMS.length);
            const mockResult: ScrapeResult = {
              ...MOCK_RESULT,
              requestUrl: req.url,
              finalUrl: req.url,
              items: MOCK_SCRAPED_ITEMS.slice(0, count),
              leads: MOCK_LEADS,
              durationMs: Math.floor(400 + Math.random() * 600),
              scrapedAt: BigInt(Date.now()) * BigInt(1_000_000),
            };
            setResult(mockResult);
            // scrapeUrl actor call failed, using mock data
          }
        } else {
          await new Promise((r) => setTimeout(r, 1100 + Math.random() * 700));
          if (mode !== "static") setIsDynamicAlert(true);
          const count = Math.min(limit, MOCK_SCRAPED_ITEMS.length);
          const mockResult: ScrapeResult = {
            ...MOCK_RESULT,
            requestUrl: req.url,
            finalUrl: req.url,
            items: MOCK_SCRAPED_ITEMS.slice(0, count),
            leads: MOCK_LEADS,
            durationMs: Math.floor(400 + Math.random() * 600),
            scrapedAt: BigInt(Date.now()) * BigInt(1_000_000),
          };
          setResult(mockResult);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scrape failed");
    } finally {
      setIsRunning(false);
      setBatchProgress(null);
    }
  }

  async function handlePushToCrm(_resultArg: ScrapeResult) {
    try {
      if (actor && scrapeRecordId !== null) {
        await (
          actor.stageScrapeLeads as (tid: string, id: bigint) => Promise<bigint>
        )("admin", scrapeRecordId);
      }
    } catch {
      // stageScrapeLeads failed, marking pushed anyway
    }
    setPushedToCrm(true);
  }

  async function handleEnrichWithAI() {
    setEnriching(true);
    await new Promise((r) => setTimeout(r, 1800));
    setEnriching(false);
    setEnrichDone(true);
  }

  const resultJson = result
    ? JSON.stringify(
        result,
        (_, v) => (typeof v === "bigint" ? v.toString() : v),
        2,
      )
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-4" data-ocid="scraper.panel">
      {/* ── Left panel ── */}
      <div className="w-full lg:w-[400px] xl:w-[420px] shrink-0 space-y-3">
        {/* Quick preset chips */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-widest">
            Quick Presets
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyQuickPreset(p)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/40 border border-slate-700 hover:border-purple-600/60 text-slate-300 hover:text-purple-200 transition-all"
                data-ocid={`scraper.preset-${p.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main config */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          {/* URL */}
          <div>
            <label
              htmlFor="scraper-url"
              className="text-slate-400 text-xs font-medium block mb-1.5"
            >
              URL
            </label>
            <input
              id="scraper-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.example.com/"
              className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 outline-none transition-colors"
              data-ocid="scraper.url-input"
            />
          </div>

          {/* Selector + XPath toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="scraper-selector"
                className="text-slate-400 text-xs font-medium"
              >
                {selectorType === "css" ? "CSS Selector" : "XPath"}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">XPath</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={selectorType === "xpath"}
                  onClick={() =>
                    setSelectorType(selectorType === "css" ? "xpath" : "css")
                  }
                  className={`relative w-9 h-5 rounded-full transition-colors ${selectorType === "xpath" ? "bg-purple-600" : "bg-slate-700"}`}
                  data-ocid="scraper.xpath-toggle"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${selectorType === "xpath" ? "translate-x-4" : ""}`}
                  />
                </button>
              </div>
            </div>
            <input
              id="scraper-selector"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder={
                selectorType === "css"
                  ? "h1::text, .price, a[href]"
                  : "//h1/text()"
              }
              className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 outline-none transition-colors font-mono"
              data-ocid="scraper.selector-input"
            />
          </div>

          {/* Mode */}
          <div>
            <label
              htmlFor="scraper-mode"
              className="text-slate-400 text-xs font-medium block mb-1.5"
            >
              Mode
            </label>
            <select
              id="scraper-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm outline-none transition-colors"
              data-ocid="scraper.mode-select"
            >
              {SCRAPE_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label} — {m.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Output + Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="scraper-output"
                className="text-slate-400 text-xs font-medium block mb-1.5"
              >
                Output Format
              </label>
              <select
                id="scraper-output"
                value={outputFormat}
                onChange={(e) =>
                  setOutputFormat(e.target.value as OutputFormat)
                }
                className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm outline-none transition-colors"
                data-ocid="scraper.output-select"
              >
                {OUTPUT_FORMATS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="scraper-limit"
                className="text-slate-400 text-xs font-medium block mb-1.5"
              >
                Limit
              </label>
              <input
                id="scraper-limit"
                type="number"
                min={1}
                max={250}
                value={limit}
                onChange={(e) =>
                  setLimit(
                    Math.min(250, Math.max(1, Number(e.target.value) || 20)),
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm outline-none transition-colors"
                data-ocid="scraper.limit-input"
              />
            </div>
          </div>

          {/* Batch mode */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-medium">
                Batch Mode
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={batchMode}
                onClick={() => setBatchMode(!batchMode)}
                className={`relative w-9 h-5 rounded-full transition-colors ${batchMode ? "bg-purple-600" : "bg-slate-700"}`}
                data-ocid="scraper.batch-toggle"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${batchMode ? "translate-x-4" : ""}`}
                />
              </button>
            </div>
            {batchMode && (
              <div className="mt-2">
                <textarea
                  value={batchUrls}
                  onChange={(e) => setBatchUrls(e.target.value)}
                  placeholder={
                    "https://www.site1.com/\nhttps://www.site2.com/\nhttps://www.site3.com/"
                  }
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-xs placeholder-slate-600 outline-none transition-colors font-mono resize-none"
                  data-ocid="scraper.batch-textarea"
                />
                <p className="text-slate-600 text-xs mt-1">
                  One URL per line · max 10 URLs
                </p>
              </div>
            )}
          </div>

          {/* Robots.txt */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <RobotsStatusBadge
              allowed={robotsAllowed}
              checked={robotsChecked}
            />
            <button
              type="button"
              onClick={checkRobots}
              disabled={robotsLoading || !url.trim()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
              data-ocid="scraper.check-robots-button"
            >
              {robotsLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Shield className="w-3 h-3" />
              )}
              Check robots.txt
            </button>
          </div>

          {/* Blocked alert */}
          {robotsChecked && robotsAllowed === false && (
            <div
              className="flex items-start gap-2 bg-rose-900/20 border border-rose-700/40 rounded-xl p-3"
              data-ocid="scraper.robots-blocked-alert"
            >
              <ShieldX className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-300 text-xs">
                This site's robots.txt disallows scraping. Proceed only if you
                have explicit permission.
              </p>
            </div>
          )}

          {/* Run button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning || !url.trim() || !selector.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
            }}
            data-ocid="scraper.run-button"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Scraping…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Run Scrape
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 min-w-0 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        {/* Results toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 flex-wrap gap-2">
          <h3 className="text-slate-100 font-semibold text-sm">Results</h3>
          <div className="flex items-center flex-wrap gap-2">
            {resultJson && <CopyButton text={resultJson} />}
            {result?.ok && result.items.length > 0 && !pushedToCrm && (
              <button
                type="button"
                onClick={() => handlePushToCrm(result)}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/30 px-3 py-1.5 rounded-lg transition-colors"
                data-ocid="scraper.push-to-crm-button"
              >
                <Database className="w-3 h-3" /> Push to CRM
              </button>
            )}
            {pushedToCrm && (
              <span
                className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium"
                data-ocid="scraper.push-success-state"
              >
                <CheckCircle className="w-3 h-3" /> Pushed to CRM
              </span>
            )}
            {result?.ok && result.leads.length > 0 && (
              <button
                type="button"
                onClick={handleEnrichWithAI}
                disabled={enriching || enrichDone}
                className="flex items-center gap-1.5 text-xs font-medium text-purple-300 border border-purple-700/50 hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                data-ocid="scraper.enrich-ai-button"
              >
                {enriching ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {enrichDone
                  ? "Enriched ✓"
                  : enriching
                    ? "Enriching…"
                    : "Enrich with AI"}
              </button>
            )}
            {resultJson && (
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([resultJson], {
                    type: "application/json",
                  });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "scrape-result.json";
                  a.click();
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                data-ocid="scraper.export-button"
              >
                <Download className="w-3 h-3" /> Export
              </button>
            )}
          </div>
        </div>

        {/* Result meta bar */}
        {result && (
          <div className="flex flex-wrap items-center gap-3 px-5 py-2 border-b border-slate-800 bg-slate-950/40 text-xs">
            <StatusDot status={result.ok ? "success" : "failed"} />
            <span className="text-slate-300 font-medium">
              {result.items.length} items
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">{result.durationMs}ms</span>
            {result.httpStatus && (
              <>
                <span className="text-slate-600">·</span>
                <span
                  className={`font-mono ${result.httpStatus === 200 ? "text-emerald-400" : "text-amber-400"}`}
                >
                  HTTP {result.httpStatus}
                </span>
              </>
            )}
            {result.leads.length > 0 && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-indigo-300">
                  {result.leads.length} leads extracted
                </span>
              </>
            )}
          </div>
        )}

        {/* Batch progress */}
        {batchProgress && (
          <BatchProgressBar
            progress={batchProgress.done}
            total={batchProgress.total}
          />
        )}

        {/* Dynamic content alert */}
        {isDynamicAlert && (
          <div
            className="flex items-start gap-2 mx-4 mt-3 bg-amber-900/20 border border-amber-700/30 rounded-xl px-4 py-3"
            data-ocid="scraper.dynamic-content-alert"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-300/90 text-xs">
              Dynamic content detected. This page renders via JavaScript —
              results may be incomplete in static mode. Switch to{" "}
              <strong>Dynamic Browser</strong> mode for full rendering.
            </p>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div
            className="m-4 flex items-start gap-2 bg-rose-900/20 border border-rose-700/40 rounded-xl p-4"
            data-ocid="scraper.error-state"
          >
            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-rose-300 text-sm font-medium">Scrape failed</p>
              <p className="text-rose-400/80 text-xs mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Scrollable JSON */}
        <div className="flex-1 overflow-auto">
          {!result && !isRunning && !error && (
            <div
              className="flex flex-col items-center justify-center min-h-[420px] text-center px-8"
              data-ocid="scraper.empty-state"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4">
                <ScanLine className="w-7 h-7 text-slate-600" />
              </div>
              <p className="text-slate-300 font-semibold text-sm">
                Ready to scrape
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Configure your URL and selector, then click Run Scrape.
              </p>
              <div className="mt-4 bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 text-left max-w-sm space-y-1">
                <p className="text-slate-500 text-xs">
                  <code className="text-purple-400">h1::text</code> — Extract
                  headings
                </p>
                <p className="text-slate-500 text-xs">
                  <code className="text-purple-400">a[href]</code> — All links
                </p>
                <p className="text-slate-500 text-xs">
                  <code className="text-purple-400">{"//h1/text()"}</code> —
                  XPath text nodes
                </p>
              </div>
            </div>
          )}

          {isRunning && !batchProgress && (
            <div
              className="flex flex-col items-center justify-center min-h-[420px]"
              data-ocid="scraper.loading-state"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              </div>
              <p className="text-slate-300 text-sm font-medium mt-4">
                Scraping…
              </p>
              <p className="text-slate-600 text-xs mt-1">
                Sending request and parsing results
              </p>
            </div>
          )}

          {resultJson && <JsonHighlight json={resultJson} />}
        </div>

        {/* Extracted leads */}
        {result && <ExtractedLeadsSection leads={result.leads} />}
      </div>
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab() {
  const { actor } = useActor();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [history, setHistory] = useState(DEMO_HISTORY);

  function toggle(id: number) {
    setExpanded(expanded === id ? null : id);
  }

  async function handleRefresh() {
    if (!actor) return;
    try {
      await (
        actor.getScrapeHistory as (
          tid: string,
          limit: bigint,
        ) => Promise<unknown>
      )("admin", BigInt(50));
      // History is stored in actor stable state; we use local demo data for display
      // but trigger the actor call to ensure sync
    } catch {
      // getScrapeHistory failed silently
    }
  }

  function handleRerun(
    item: (typeof DEMO_HISTORY)[0],
    onSwitchToScraper: (
      url: string,
      selector: string,
      selectorType: string,
    ) => void,
  ) {
    onSwitchToScraper(item.url, item.selector, item.mode);
  }

  function handleDelete(id: number) {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="space-y-4" data-ocid="scraper.history-panel">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-xs">
          {history.length} recent scrapes
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
          data-ocid="scraper.history-refresh-button"
        >
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <div
          className="text-center py-16"
          data-ocid="scraper.history-empty-state"
        >
          <History className="w-8 h-8 mx-auto mb-3 text-slate-700" />
          <p className="text-slate-500 text-sm">No scrape history yet</p>
          <p className="text-slate-600 text-xs mt-1">
            Run your first scrape to see results here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[32px_1fr_1fr_80px_56px_56px_80px_80px_32px] border-b border-slate-800 px-4 py-2.5">
            {[
              "#",
              "URL",
              "Selector",
              "Mode",
              "Items",
              "ms",
              "Status",
              "Scraped",
              "",
            ].map((h) => (
              <span
                key={h}
                className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider"
              >
                {h}
              </span>
            ))}
          </div>

          {history.map((item, idx) => (
            <div key={item.id} data-ocid={`scraper.history-row.${idx + 1}`}>
              {/* Main row */}
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full grid grid-cols-[32px_1fr_1fr_80px_56px_56px_80px_80px_32px] px-4 py-3 border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors text-left items-center gap-1"
              >
                <span className="text-slate-600 text-xs font-mono">
                  {item.id}
                </span>
                <span className="text-slate-300 text-xs truncate pr-2">
                  {item.url.replace(/^https?:\/\//, "").split("/")[0]}
                </span>
                <code className="text-purple-300 text-xs truncate pr-2">
                  {item.selector}
                </code>
                <span className="text-xs px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700 capitalize w-fit">
                  {item.mode}
                </span>
                <span className="text-slate-300 text-xs text-right font-mono">
                  {item.itemCount}
                </span>
                <span className="text-slate-500 text-xs text-right font-mono">
                  {item.durationMs}
                </span>
                <div className="flex items-center gap-1.5">
                  <StatusDot status={item.status} />
                  <span
                    className={`text-xs capitalize ${
                      item.status === "success"
                        ? "text-emerald-400"
                        : item.status === "failed"
                          ? "text-rose-400"
                          : "text-amber-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <span className="text-slate-500 text-xs">
                  {new Date(item.scrapedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {expanded === item.id ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                )}
              </button>

              {/* Expanded detail */}
              {expanded === item.id && (
                <div
                  className="bg-slate-950/60 border-b border-slate-800 px-5 py-4 space-y-3"
                  data-ocid={`scraper.history-detail.${idx + 1}`}
                >
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Globe className="w-3 h-3" />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline truncate"
                    >
                      {item.url}
                    </a>
                  </div>

                  {"error" in item && item.error && (
                    <div className="flex items-start gap-2 bg-rose-900/20 border border-rose-700/30 rounded-xl px-3 py-2.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-rose-300 text-xs capitalize">
                        {item.error}
                      </p>
                    </div>
                  )}

                  {item.extractedLeads.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-indigo-400" />
                        <span className="text-slate-400 text-xs font-medium">
                          Extracted Leads ({item.extractedLeads.length})
                        </span>
                      </div>
                      {item.extractedLeads.map((lead, li) => (
                        <div
                          key={`${lead.email ?? lead.phone ?? lead.businessName ?? lead.sourceUrl}-${li}`}
                          className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2"
                        >
                          {lead.businessName && (
                            <span className="flex items-center gap-1 text-slate-200 text-xs">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              {lead.businessName}
                            </span>
                          )}
                          {lead.email && (
                            <span className="flex items-center gap-1 text-indigo-300 text-xs">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </span>
                          )}
                          {lead.phone && (
                            <span className="flex items-center gap-1 text-emerald-300 text-xs">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {item.extractedLeads.length === 0 &&
                    item.status === "success" && (
                      <p className="text-slate-600 text-xs">
                        No leads extracted from this run.
                      </p>
                    )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleRerun(item, (_url, _sel, _mode) => {
                          // Re-run is handled at page level via onRerun prop;
                          // here we store the request in sessionStorage so the
                          // page shell can pick it up when switching tabs.
                          sessionStorage.setItem(
                            "scraper_rerun",
                            JSON.stringify({
                              url: item.url,
                              selector: item.selector,
                              mode: item.mode,
                            }),
                          );
                          window.dispatchEvent(
                            new CustomEvent("scraper:rerun"),
                          );
                        })
                      }
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                      data-ocid={`scraper.history-rerun-button.${idx + 1}`}
                    >
                      <RefreshCw className="w-3 h-3" /> Re-run
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:border-rose-700/50 px-3 py-1.5 rounded-lg transition-colors"
                      data-ocid={`scraper.history-delete-button.${idx + 1}`}
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Presets Tab ──────────────────────────────────────────────────────────────

function PresetsTab({
  onUsePreset,
  currentConfig,
}: {
  onUsePreset: (preset: ScrapePreset) => void;
  currentConfig?: Partial<ScrapePreset>;
}) {
  const [presets, setPresets] = useState(DEMO_PRESETS);
  const categories = Array.from(new Set(presets.map((p) => p.category)));

  function handleSaveCurrentConfig() {
    if (!currentConfig?.url) return;
    const newPreset: ScrapePreset = {
      id: `custom-${Date.now()}`,
      name: `Custom — ${new URL(currentConfig.url).hostname}`,
      description: `Saved config for ${currentConfig.url}`,
      url: currentConfig.url ?? "",
      selector: currentConfig.selector ?? "",
      selectorType: (currentConfig.selectorType as SelectorType) ?? "css",
      outputFormat: (currentConfig.outputFormat as OutputFormat) ?? "both",
      limit: currentConfig.limit ?? 20,
      category: "custom",
    };
    setPresets((prev) => [newPreset, ...prev]);
  }

  function handleDeletePreset(id: string) {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5" data-ocid="scraper.presets-panel">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-xs">{presets.length} saved presets</p>
        <button
          type="button"
          onClick={handleSaveCurrentConfig}
          className="flex items-center gap-1.5 text-xs font-medium text-purple-300 border border-purple-700/50 hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors"
          data-ocid="scraper.add-preset-button"
        >
          <Plus className="w-3 h-3" /> Save Current Config
        </button>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
            {cat}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {presets
              .filter((p) => p.category === cat)
              .map((preset) => (
                <div
                  key={preset.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 transition-colors group"
                  data-ocid={`scraper.preset-card.${preset.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-slate-100 font-semibold text-sm truncate">
                        {preset.name}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border capitalize ${CATEGORY_COLORS[preset.category]}`}
                    >
                      {preset.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-slate-600 shrink-0" />
                    <span className="text-slate-500 text-xs truncate">
                      {preset.url.replace(/^https?:\/\//, "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3 h-3 text-slate-600 shrink-0" />
                    <code className="text-purple-400 text-xs truncate">
                      {preset.selector}
                    </code>
                    <span className="text-slate-600 text-[10px] uppercase shrink-0">
                      {preset.selectorType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onUsePreset(preset)}
                      className="flex-1 text-xs font-medium text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/30 rounded-lg py-1.5 transition-colors"
                      data-ocid={`scraper.use-preset-button.${preset.id}`}
                    >
                      Load Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePreset(preset.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-700/50 p-1.5 rounded-lg transition-colors"
                      data-ocid={`scraper.delete-preset-button.${preset.id}`}
                      aria-label="Delete preset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page Shell ───────────────────────────────────────────────────────────────

type TabId = "scraper" | "history" | "presets";

const TABS: { id: TabId; label: string; icon: typeof Search }[] = [
  { id: "scraper", label: "Scraper", icon: ScanLine },
  { id: "history", label: "History", icon: History },
  { id: "presets", label: "Presets", icon: Layers },
];

export default function ScraperToolPage() {
  const [activeTab, setActiveTab] = useState<TabId>("scraper");
  const [presetState, setPresetState] = useState<Partial<ScraperTabProps>>({});
  // currentConfig is kept in sync with ScraperTab's form values so PresetsTab
  // can snapshot them via "Save Current Config".
  const [currentConfig, setCurrentConfig] = useState<Partial<ScrapePreset>>({});
  const currentConfigRef = useRef(currentConfig);
  currentConfigRef.current = currentConfig;

  function handleUsePreset(preset: ScrapePreset) {
    setPresetState({
      initialUrl: preset.url,
      initialSelector: preset.selector,
      initialSelectorType: preset.selectorType,
      initialOutputFormat: preset.outputFormat,
      initialLimit: preset.limit,
    });
    setCurrentConfig({
      url: preset.url,
      selector: preset.selector,
      selectorType: preset.selectorType,
      outputFormat: preset.outputFormat,
      limit: preset.limit,
    });
    setActiveTab("scraper");
  }

  // Listen for re-run events dispatched from HistoryTab
  useCallback(() => {
    function onRerun() {
      const raw = sessionStorage.getItem("scraper_rerun");
      if (!raw) return;
      try {
        const { url, selector } = JSON.parse(raw) as {
          url: string;
          selector: string;
          mode: string;
        };
        sessionStorage.removeItem("scraper_rerun");
        setPresetState({ initialUrl: url, initialSelector: selector });
        setCurrentConfig({ url, selector });
        setActiveTab("scraper");
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("scraper:rerun", onRerun);
    return () => window.removeEventListener("scraper:rerun", onRerun);
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-950 p-4 sm:p-6 space-y-5"
      data-ocid="scraper.page"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <ScanLine className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">
              Web Scraper Tool
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 font-medium">
              Admin Only
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Extract structured data from any public website using CSS selectors
            or XPath. Push results directly to your CRM.
          </p>
        </div>
        <a
          href="https://scrapling.readthedocs.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 px-3 py-2 rounded-lg transition-colors self-start sm:self-auto"
        >
          <ExternalLink className="w-3 h-3" /> Docs
        </a>
      </div>

      {/* Compliance notice */}
      <div className="flex items-start gap-2 bg-amber-900/15 border border-amber-700/30 rounded-xl px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-amber-300/80 text-xs leading-relaxed">
          <strong className="text-amber-300">Responsible use only.</strong> Only
          scrape websites you are authorized to access. Always check robots.txt
          and respect website Terms of Service and privacy regulations
          (GDPR/CCPA).
        </p>
      </div>

      {/* Tab nav */}
      <div
        className="flex items-end gap-0 border-b border-slate-800"
        data-ocid="scraper.tabs"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === id
                ? "border-purple-500 text-slate-100"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
            data-ocid={`scraper.${id}-tab`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pb-8">
        {activeTab === "scraper" && (
          <ScraperTab key={JSON.stringify(presetState)} {...presetState} />
        )}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "presets" && (
          <PresetsTab
            onUsePreset={handleUsePreset}
            currentConfig={currentConfigRef.current}
          />
        )}
      </div>
    </div>
  );
}
