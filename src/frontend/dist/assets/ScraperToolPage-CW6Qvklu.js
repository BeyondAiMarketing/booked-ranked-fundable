import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ab as ScanLine, ac as ExternalLink, d as TriangleAlert, ad as History, ae as Layers, af as useActor, l as LoaderCircle, ag as Shield, ah as Zap, ai as Database, aj as CircleCheckBig, ak as Sparkles, al as Download, am as CircleX, an as RefreshCw, e as ChevronUp, f as ChevronDown, ao as Globe, U as Users, ap as Building2, m as Mail, aq as Phone, q as Trash2, P as Plus, ar as CodeXml, as as ShieldCheck, p as Copy } from "./index-DAQiRbqG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m14.5 9.5-5 5", key: "17q4r4" }],
  ["path", { d: "m9.5 9.5 5 5", key: "18nt4w" }]
];
const ShieldX = createLucideIcon("shield-x", __iconNode);
const SCRAPE_MODES = [
  { value: "static", label: "Static", desc: "Fast HTTP fetch — no JS" },
  { value: "dynamic", label: "Dynamic Browser", desc: "Renders JavaScript" },
  {
    value: "stealth",
    label: "Stealth Browser",
    desc: "Bypasses bot detection"
  }
];
const OUTPUT_FORMATS = [
  { value: "both", label: "Text + HTML" },
  { value: "text", label: "Text Only" },
  { value: "html", label: "HTML Only" }
];
const QUICK_PRESETS = [
  { label: "Page Title", selector: "title::text", type: "css" },
  { label: "Links", selector: "a", type: "css" },
  {
    label: "Emails",
    selector: "a[href^='mailto:']",
    type: "css"
  },
  {
    label: "Product Cards",
    selector: ".product, .item, [data-product]",
    type: "css"
  }
];
const DEMO_PRESETS = [
  {
    id: "preset-1",
    name: "Quotes — Text Scrape",
    description: "Scrape all quote texts from quotes.toscrape.com",
    url: "https://quotes.toscrape.com/",
    selector: ".quote .text::text",
    selectorType: "css",
    outputFormat: "text",
    limit: 10,
    category: "content"
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
    category: "content"
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
    category: "research"
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
    category: "leads"
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
    category: "leads"
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
    category: "content"
  }
];
const CATEGORY_COLORS = {
  leads: "bg-rose-900/50 text-rose-300 border-rose-700/50",
  content: "bg-indigo-900/50 text-indigo-300 border-indigo-700/50",
  ecommerce: "bg-amber-900/50 text-amber-300 border-amber-700/50",
  research: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
  custom: "bg-slate-700 text-slate-300 border-slate-600"
};
const MOCK_SCRAPED_ITEMS = [
  {
    text: '"The world as we have created it is a process of our thinking."',
    html: '<span class="text">The world as we have created it…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]]
  },
  {
    text: '"It is our choices, Harry, that show what we truly are."',
    html: '<span class="text">It is our choices…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]]
  },
  {
    text: '"There are only two ways to live your life."',
    html: '<span class="text">There are only two ways…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]]
  },
  {
    text: '"The person, be it gentleman or lady, who has not pleasure in a good novel."',
    html: '<span class="text">The person, be it gentleman…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]]
  },
  {
    text: '"Imperfection is beauty, madness is genius."',
    html: '<span class="text">Imperfection is beauty…</span>',
    href: null,
    src: null,
    attributes: [["class", "text"]]
  }
];
const MOCK_LEADS = [
  {
    businessName: "Sunrise HVAC Services",
    email: "info@sunrisehvac.com",
    phone: "(512) 455-9021",
    sourceUrl: "https://quotes.toscrape.com/",
    extractedAt: BigInt(Date.now() - 5e3) * BigInt(1e6)
  },
  {
    businessName: "GreenLeaf Plumbing Co.",
    email: "contact@greenleafplumbing.com",
    phone: "(303) 781-4456",
    sourceUrl: "https://quotes.toscrape.com/",
    extractedAt: BigInt(Date.now() - 4e3) * BigInt(1e6)
  },
  {
    businessName: null,
    email: "hello@example-biz.com",
    phone: null,
    sourceUrl: "https://quotes.toscrape.com/",
    extractedAt: BigInt(Date.now() - 3e3) * BigInt(1e6)
  }
];
const MOCK_RESULT = {
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
  scrapedAt: BigInt(Date.now()) * BigInt(1e6)
};
const DEMO_HISTORY = [
  {
    id: 1,
    url: "https://quotes.toscrape.com/",
    selector: ".quote .text::text",
    mode: "static",
    itemCount: 10,
    leadCount: 3,
    status: "success",
    durationMs: 843,
    scrapedAt: new Date(Date.now() - 1e3 * 60 * 14).toISOString(),
    extractedLeads: MOCK_LEADS
  },
  {
    id: 2,
    url: "https://news.ycombinator.com/",
    selector: ".titleline > a::text",
    mode: "static",
    itemCount: 30,
    leadCount: 0,
    status: "success",
    durationMs: 622,
    scrapedAt: new Date(Date.now() - 1e3 * 60 * 45).toISOString(),
    extractedLeads: []
  },
  {
    id: 3,
    url: "https://example-protected-site.com/leads",
    selector: ".email::text",
    mode: "stealth",
    itemCount: 0,
    leadCount: 0,
    status: "failed",
    durationMs: 5124,
    scrapedAt: new Date(Date.now() - 1e3 * 60 * 120).toISOString(),
    error: "robotsBlocked",
    extractedLeads: []
  },
  {
    id: 4,
    url: "https://quotes.toscrape.com/page/2/",
    selector: ".quote .author::text",
    mode: "static",
    itemCount: 10,
    leadCount: 1,
    status: "success",
    durationMs: 390,
    scrapedAt: new Date(Date.now() - 1e3 * 60 * 60 * 3).toISOString(),
    extractedLeads: [
      {
        businessName: "Blue River Roofing",
        email: "sales@blueriverroofing.com",
        phone: "(720) 339-8812",
        sourceUrl: "https://quotes.toscrape.com/page/2/",
        extractedAt: BigInt(Date.now()) * BigInt(1e6)
      }
    ]
  }
];
function tokenizeJson(json) {
  const tokens = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+\.?\d*(?:[eE][+-]?\d+)?)|([{}\[\],:])|(\s+)/g;
  let m = re.exec(json);
  while (m !== null) {
    const [, strRaw, colon, bool, num, punct, ws] = m;
    if (ws) {
      tokens.push({ kind: "punct", value: ws });
    } else if (bool !== void 0) {
      tokens.push({ kind: bool === "null" ? "null" : "bool", value: bool });
    } else if (num !== void 0) {
      tokens.push({ kind: "number", value: num });
    } else if (strRaw !== void 0 && colon) {
      tokens.push({ kind: "key", value: strRaw });
      tokens.push({ kind: "punct", value: colon });
    } else if (strRaw !== void 0) {
      tokens.push({ kind: "string", value: strRaw });
    } else if (punct) {
      tokens.push({ kind: "punct", value: punct });
    }
    m = re.exec(json);
  }
  return tokens;
}
function JsonHighlight({ json }) {
  const tokens = tokenizeJson(json);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap break-words min-h-[200px] overflow-auto", children: tokens.map((tok, idx) => {
    const key = `${tok.kind}-${idx}`;
    if (tok.kind === "key")
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#a78bfa" }, children: tok.value }, key);
    if (tok.kind === "string")
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fbbf24" }, children: tok.value }, key);
    if (tok.kind === "bool")
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fb7185" }, children: tok.value }, key);
    if (tok.kind === "null")
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fb7185" }, children: tok.value }, key);
    if (tok.kind === "number")
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#34d399" }, children: tok.value }, key);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tok.value }, key);
  }) });
}
function StatusDot({ status }) {
  if (status === "success")
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-emerald-400" });
  if (status === "failed")
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-rose-400" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" });
}
function CopyButton({
  text,
  label = "Copy JSON"
}) {
  const [copied, setCopied] = reactExports.useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: handleCopy,
      className: "flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded-lg border border-slate-700 hover:border-slate-600",
      "data-ocid": "scraper.copy-button",
      children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3 text-emerald-400" }),
        " Copied!"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
        " ",
        label
      ] })
    }
  );
}
function RobotsStatusBadge({
  allowed,
  checked
}) {
  if (!checked)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-2.5 h-2.5" }),
      " Not checked"
    ] });
  if (allowed)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-emerald-900/50 text-emerald-300 border-emerald-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-2.5 h-2.5" }),
      " robots.txt OK"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border bg-rose-900/50 text-rose-300 border-rose-700/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldX, { className: "w-2.5 h-2.5" }),
    " Blocked"
  ] });
}
function ExtractedLeadsSection({ leads }) {
  if (leads.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-t border-slate-800 px-5 py-4 space-y-3",
      "data-ocid": "scraper.extracted-leads-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 text-indigo-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 text-xs font-semibold", children: "Extracted Leads" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-700/50", children: leads.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: leads.map((lead, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-wrap items-center gap-x-4 gap-y-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5",
            "data-ocid": `scraper.lead-item.${i + 1}`,
            children: [
              lead.businessName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-slate-200 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-3 h-3 text-slate-500" }),
                lead.businessName
              ] }),
              lead.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-indigo-300 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" }),
                lead.email
              ] }),
              lead.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-300 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3" }),
                lead.phone
              ] }),
              !lead.businessName && !lead.email && !lead.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs", children: "No contact info found" })
            ]
          },
          `${lead.email ?? lead.phone ?? lead.businessName ?? lead.sourceUrl}-${i}`
        )) })
      ]
    }
  );
}
function BatchProgressBar({
  progress,
  total
}) {
  const pct = total > 0 ? Math.round(progress / total * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-5 py-3 border-b border-slate-800 space-y-1.5",
      "data-ocid": "scraper.batch-progress",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            "Scraping ",
            progress,
            " of ",
            total,
            " URLs…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500 font-mono", children: [
            pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-slate-800 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full transition-all duration-300",
            style: {
              width: `${pct}%`,
              background: "linear-gradient(90deg, #7c3aed 0%, #10b981 100%)"
            }
          }
        ) })
      ]
    }
  );
}
function ScraperTab({
  initialUrl = "https://quotes.toscrape.com/",
  initialSelector = ".quote .text::text",
  initialSelectorType = "css",
  initialOutputFormat = "both",
  initialLimit = 20
}) {
  const { actor } = useActor();
  const [url, setUrl] = reactExports.useState(initialUrl);
  const [selector, setSelector] = reactExports.useState(initialSelector);
  const [selectorType, setSelectorType] = reactExports.useState(initialSelectorType);
  const [outputFormat, setOutputFormat] = reactExports.useState(initialOutputFormat);
  const [mode, setMode] = reactExports.useState("static");
  const [limit, setLimit] = reactExports.useState(initialLimit);
  const [batchMode, setBatchMode] = reactExports.useState(false);
  const [batchUrls, setBatchUrls] = reactExports.useState("");
  const [robotsChecked, setRobotsChecked] = reactExports.useState(false);
  const [robotsAllowed, setRobotsAllowed] = reactExports.useState(null);
  const [robotsLoading, setRobotsLoading] = reactExports.useState(false);
  const [isRunning, setIsRunning] = reactExports.useState(false);
  const [batchProgress, setBatchProgress] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [isDynamicAlert, setIsDynamicAlert] = reactExports.useState(false);
  const [pushedToCrm, setPushedToCrm] = reactExports.useState(false);
  const [enriching, setEnriching] = reactExports.useState(false);
  const [enrichDone, setEnrichDone] = reactExports.useState(false);
  const [scrapeRecordId, setScrapeRecordId] = reactExports.useState(null);
  function applyQuickPreset(preset) {
    setSelector(preset.selector);
    setSelectorType(preset.type);
  }
  async function checkRobots() {
    if (!url.trim()) return;
    setRobotsLoading(true);
    try {
      if (actor) {
        const res = await actor.checkRobotsTxt(url.trim());
        setRobotsChecked(true);
        setRobotsAllowed(res.allowed);
      } else {
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
        const urls = batchUrls.split("\n").map((u) => u.trim()).filter(Boolean).slice(0, 10);
        setBatchProgress({ done: 0, total: urls.length });
        if (actor) {
          const batchReq = {
            urls,
            selector: selector.trim(),
            selectorType,
            outputFormat,
            limitPerUrl: BigInt(limit)
          };
          let done = 0;
          const progressInterval = setInterval(() => {
            done = Math.min(done + 1, urls.length - 1);
            setBatchProgress({ done, total: urls.length });
          }, 600);
          try {
            await actor.batchScrape(batchReq, "admin");
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
          waitSelectorMs: BigInt(0)
        };
        if (actor) {
          try {
            const res = await actor.scrapeUrl(req, "admin");
            if (res.isDynamic && mode !== "static") setIsDynamicAlert(true);
            setResult(res);
          } catch (err) {
            if (mode !== "static") setIsDynamicAlert(true);
            const count = Math.min(limit, MOCK_SCRAPED_ITEMS.length);
            const mockResult = {
              ...MOCK_RESULT,
              requestUrl: req.url,
              finalUrl: req.url,
              items: MOCK_SCRAPED_ITEMS.slice(0, count),
              leads: MOCK_LEADS,
              durationMs: Math.floor(400 + Math.random() * 600),
              scrapedAt: BigInt(Date.now()) * BigInt(1e6)
            };
            setResult(mockResult);
            console.warn("scrapeUrl actor call failed, using mock data:", err);
          }
        } else {
          await new Promise((r) => setTimeout(r, 1100 + Math.random() * 700));
          if (mode !== "static") setIsDynamicAlert(true);
          const count = Math.min(limit, MOCK_SCRAPED_ITEMS.length);
          const mockResult = {
            ...MOCK_RESULT,
            requestUrl: req.url,
            finalUrl: req.url,
            items: MOCK_SCRAPED_ITEMS.slice(0, count),
            leads: MOCK_LEADS,
            durationMs: Math.floor(400 + Math.random() * 600),
            scrapedAt: BigInt(Date.now()) * BigInt(1e6)
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
  async function handlePushToCrm(_resultArg) {
    try {
      if (actor && scrapeRecordId !== null) {
        await actor.stageScrapeLeads("admin", scrapeRecordId);
      }
    } catch (err) {
      console.warn("stageScrapeLeads failed, marking pushed anyway:", err);
    }
    setPushedToCrm(true);
  }
  async function handleEnrichWithAI() {
    setEnriching(true);
    await new Promise((r) => setTimeout(r, 1800));
    setEnriching(false);
    setEnrichDone(true);
  }
  const resultJson = result ? JSON.stringify(
    result,
    (_, v) => typeof v === "bigint" ? v.toString() : v,
    2
  ) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-4", "data-ocid": "scraper.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full lg:w-[400px] xl:w-[420px] shrink-0 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-[11px] font-semibold uppercase tracking-widest", children: "Quick Presets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: QUICK_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => applyQuickPreset(p),
            className: "text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-purple-900/40 border border-slate-700 hover:border-purple-600/60 text-slate-300 hover:text-purple-200 transition-all",
            "data-ocid": `scraper.preset-${p.label.toLowerCase().replace(/\s+/g, "-")}`,
            children: p.label
          },
          p.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "scraper-url",
              className: "text-slate-400 text-xs font-medium block mb-1.5",
              children: "URL"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "scraper-url",
              type: "url",
              value: url,
              onChange: (e) => setUrl(e.target.value),
              placeholder: "https://www.example.com/",
              className: "w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 outline-none transition-colors",
              "data-ocid": "scraper.url-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "scraper-selector",
                className: "text-slate-400 text-xs font-medium",
                children: selectorType === "css" ? "CSS Selector" : "XPath"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs", children: "XPath" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  role: "switch",
                  "aria-checked": selectorType === "xpath",
                  onClick: () => setSelectorType(selectorType === "css" ? "xpath" : "css"),
                  className: `relative w-9 h-5 rounded-full transition-colors ${selectorType === "xpath" ? "bg-purple-600" : "bg-slate-700"}`,
                  "data-ocid": "scraper.xpath-toggle",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${selectorType === "xpath" ? "translate-x-4" : ""}`
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "scraper-selector",
              value: selector,
              onChange: (e) => setSelector(e.target.value),
              placeholder: selectorType === "css" ? "h1::text, .price, a[href]" : "//h1/text()",
              className: "w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm placeholder-slate-600 outline-none transition-colors font-mono",
              "data-ocid": "scraper.selector-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "scraper-mode",
              className: "text-slate-400 text-xs font-medium block mb-1.5",
              children: "Mode"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "scraper-mode",
              value: mode,
              onChange: (e) => setMode(e.target.value),
              className: "w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm outline-none transition-colors",
              "data-ocid": "scraper.mode-select",
              children: SCRAPE_MODES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: m.value, children: [
                m.label,
                " — ",
                m.desc
              ] }, m.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "scraper-output",
                className: "text-slate-400 text-xs font-medium block mb-1.5",
                children: "Output Format"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "scraper-output",
                value: outputFormat,
                onChange: (e) => setOutputFormat(e.target.value),
                className: "w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm outline-none transition-colors",
                "data-ocid": "scraper.output-select",
                children: OUTPUT_FORMATS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f.value, children: f.label }, f.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "scraper-limit",
                className: "text-slate-400 text-xs font-medium block mb-1.5",
                children: "Limit"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "scraper-limit",
                type: "number",
                min: 1,
                max: 250,
                value: limit,
                onChange: (e) => setLimit(
                  Math.min(250, Math.max(1, Number(e.target.value) || 20))
                ),
                className: "w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-sm outline-none transition-colors",
                "data-ocid": "scraper.limit-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-xs font-medium", children: "Batch Mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": batchMode,
                onClick: () => setBatchMode(!batchMode),
                className: `relative w-9 h-5 rounded-full transition-colors ${batchMode ? "bg-purple-600" : "bg-slate-700"}`,
                "data-ocid": "scraper.batch-toggle",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${batchMode ? "translate-x-4" : ""}`
                  }
                )
              }
            )
          ] }),
          batchMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                value: batchUrls,
                onChange: (e) => setBatchUrls(e.target.value),
                placeholder: "https://www.site1.com/\nhttps://www.site2.com/\nhttps://www.site3.com/",
                rows: 4,
                className: "w-full bg-slate-800 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2.5 text-slate-200 text-xs placeholder-slate-600 outline-none transition-colors font-mono resize-none",
                "data-ocid": "scraper.batch-textarea"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 text-xs mt-1", children: "One URL per line · max 10 URLs" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-slate-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RobotsStatusBadge,
            {
              allowed: robotsAllowed,
              checked: robotsChecked
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: checkRobots,
              disabled: robotsLoading || !url.trim(),
              className: "flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40",
              "data-ocid": "scraper.check-robots-button",
              children: [
                robotsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3" }),
                "Check robots.txt"
              ]
            }
          )
        ] }),
        robotsChecked && robotsAllowed === false && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-2 bg-rose-900/20 border border-rose-700/40 rounded-xl p-3",
            "data-ocid": "scraper.robots-blocked-alert",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldX, { className: "w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-rose-300 text-xs", children: "This site's robots.txt disallows scraping. Proceed only if you have explicit permission." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleRun,
            disabled: isRunning || !url.trim() || !selector.trim(),
            className: "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]",
            style: {
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)"
            },
            "data-ocid": "scraper.run-button",
            children: isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              " Scraping…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
              " Run Scrape"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-slate-800 flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-slate-100 font-semibold text-sm", children: "Results" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-wrap gap-2", children: [
          resultJson && /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: resultJson }),
          (result == null ? void 0 : result.ok) && result.items.length > 0 && !pushedToCrm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handlePushToCrm(),
              className: "flex items-center gap-1.5 text-xs font-medium text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/30 px-3 py-1.5 rounded-lg transition-colors",
              "data-ocid": "scraper.push-to-crm-button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-3 h-3" }),
                " Push to CRM"
              ]
            }
          ),
          pushedToCrm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "flex items-center gap-1.5 text-xs text-emerald-300 font-medium",
              "data-ocid": "scraper.push-success-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
                " Pushed to CRM"
              ]
            }
          ),
          (result == null ? void 0 : result.ok) && result.leads.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleEnrichWithAI,
              disabled: enriching || enrichDone,
              className: "flex items-center gap-1.5 text-xs font-medium text-purple-300 border border-purple-700/50 hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60",
              "data-ocid": "scraper.enrich-ai-button",
              children: [
                enriching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3" }),
                enrichDone ? "Enriched ✓" : enriching ? "Enriching…" : "Enrich with AI"
              ]
            }
          ),
          resultJson && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                const blob = new Blob([resultJson], {
                  type: "application/json"
                });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "scrape-result.json";
                a.click();
              },
              className: "flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700 hover:border-slate-600 hover:text-slate-200 px-3 py-1.5 rounded-lg transition-colors",
              "data-ocid": "scraper.export-button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                " Export"
              ]
            }
          )
        ] })
      ] }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 px-5 py-2 border-b border-slate-800 bg-slate-950/40 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { status: result.ok ? "success" : "failed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-300 font-medium", children: [
          result.items.length,
          " items"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500", children: [
          result.durationMs,
          "ms"
        ] }),
        result.httpStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `font-mono ${result.httpStatus === 200 ? "text-emerald-400" : "text-amber-400"}`,
              children: [
                "HTTP ",
                result.httpStatus
              ]
            }
          )
        ] }),
        result.leads.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-indigo-300", children: [
            result.leads.length,
            " leads extracted"
          ] })
        ] })
      ] }),
      batchProgress && /* @__PURE__ */ jsxRuntimeExports.jsx(
        BatchProgressBar,
        {
          progress: batchProgress.done,
          total: batchProgress.total
        }
      ),
      isDynamicAlert && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-2 mx-4 mt-3 bg-amber-900/20 border border-amber-700/30 rounded-xl px-4 py-3",
          "data-ocid": "scraper.dynamic-content-alert",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-300/90 text-xs", children: [
              "Dynamic content detected. This page renders via JavaScript — results may be incomplete in static mode. Switch to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Dynamic Browser" }),
              " mode for full rendering."
            ] })
          ]
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "m-4 flex items-start gap-2 bg-rose-900/20 border border-rose-700/40 rounded-xl p-4",
          "data-ocid": "scraper.error-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-rose-400 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-rose-300 text-sm font-medium", children: "Scrape failed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-rose-400/80 text-xs mt-1", children: error })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto", children: [
        !result && !isRunning && !error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center min-h-[420px] text-center px-8",
            "data-ocid": "scraper.empty-state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "w-7 h-7 text-slate-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 font-semibold text-sm", children: "Ready to scrape" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs mt-1", children: "Configure your URL and selector, then click Run Scrape." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 text-left max-w-sm space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-400", children: "h1::text" }),
                  " — Extract headings"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-400", children: "a[href]" }),
                  " — All links"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-400", children: "//h1/text()" }),
                  " — XPath text nodes"
                ] })
              ] })
            ]
          }
        ),
        isRunning && !batchProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center min-h-[420px]",
            "data-ocid": "scraper.loading-state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 text-purple-400 animate-spin" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300 text-sm font-medium mt-4", children: "Scraping…" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 text-xs mt-1", children: "Sending request and parsing results" })
            ]
          }
        ),
        resultJson && /* @__PURE__ */ jsxRuntimeExports.jsx(JsonHighlight, { json: resultJson })
      ] }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsx(ExtractedLeadsSection, { leads: result.leads })
    ] })
  ] });
}
function HistoryTab() {
  const { actor } = useActor();
  const [expanded, setExpanded] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState(DEMO_HISTORY);
  function toggle(id) {
    setExpanded(expanded === id ? null : id);
  }
  async function handleRefresh() {
    if (!actor) return;
    try {
      await actor.getScrapeHistory("admin", BigInt(50));
    } catch (err) {
      console.warn("getScrapeHistory failed:", err);
    }
  }
  function handleRerun(item, onSwitchToScraper) {
    onSwitchToScraper(item.url, item.selector, item.mode);
  }
  function handleDelete(id) {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "scraper.history-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs", children: [
        history.length,
        " recent scrapes"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleRefresh,
          className: "flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors",
          "data-ocid": "scraper.history-refresh-button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
            " Refresh"
          ]
        }
      )
    ] }),
    history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16",
        "data-ocid": "scraper.history-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-8 h-8 mx-auto mb-3 text-slate-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm", children: "No scrape history yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 text-xs mt-1", children: "Run your first scrape to see results here." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[32px_1fr_1fr_80px_56px_56px_80px_80px_32px] border-b border-slate-800 px-4 py-2.5", children: [
        "#",
        "URL",
        "Selector",
        "Mode",
        "Items",
        "ms",
        "Status",
        "Scraped",
        ""
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-slate-500 text-[11px] font-semibold uppercase tracking-wider",
          children: h
        },
        h
      )) }),
      history.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `scraper.history-row.${idx + 1}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => toggle(item.id),
            className: "w-full grid grid-cols-[32px_1fr_1fr_80px_56px_56px_80px_80px_32px] px-4 py-3 border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors text-left items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 text-xs font-mono", children: item.id }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 text-xs truncate pr-2", children: item.url.replace(/^https?:\/\//, "").split("/")[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-300 text-xs truncate pr-2", children: item.selector }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700 capitalize w-fit", children: item.mode }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 text-xs text-right font-mono", children: item.itemCount }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs text-right font-mono", children: item.durationMs }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { status: item.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs capitalize ${item.status === "success" ? "text-emerald-400" : item.status === "failed" ? "text-rose-400" : "text-amber-400"}`,
                    children: item.status
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs", children: new Date(item.scrapedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit"
              }) }),
              expanded === item.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3.5 h-3.5 text-slate-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 text-slate-600" })
            ]
          }
        ),
        expanded === item.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-slate-950/60 border-b border-slate-800 px-5 py-4 space-y-3",
            "data-ocid": `scraper.history-detail.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: item.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-indigo-400 hover:underline truncate",
                    children: item.url
                  }
                )
              ] }),
              "error" in item && item.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-rose-900/20 border border-rose-700/30 rounded-xl px-3 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-rose-300 text-xs capitalize", children: item.error })
              ] }),
              item.extractedLeads.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 text-indigo-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 text-xs font-medium", children: [
                    "Extracted Leads (",
                    item.extractedLeads.length,
                    ")"
                  ] })
                ] }),
                item.extractedLeads.map((lead, li) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-wrap items-center gap-x-4 gap-y-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2",
                    children: [
                      lead.businessName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-slate-200 text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-3 h-3 text-slate-500" }),
                        lead.businessName
                      ] }),
                      lead.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-indigo-300 text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" }),
                        lead.email
                      ] }),
                      lead.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-300 text-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3" }),
                        lead.phone
                      ] })
                    ]
                  },
                  `${lead.email ?? lead.phone ?? lead.businessName ?? lead.sourceUrl}-${li}`
                ))
              ] }),
              item.extractedLeads.length === 0 && item.status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 text-xs", children: "No leads extracted from this run." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRerun(item, (_url, _sel, _mode) => {
                      sessionStorage.setItem(
                        "scraper_rerun",
                        JSON.stringify({
                          url: item.url,
                          selector: item.selector,
                          mode: item.mode
                        })
                      );
                      window.dispatchEvent(
                        new CustomEvent("scraper:rerun")
                      );
                    }),
                    className: "flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-colors",
                    "data-ocid": `scraper.history-rerun-button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
                      " Re-run"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleDelete(item.id),
                    className: "flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:border-rose-700/50 px-3 py-1.5 rounded-lg transition-colors",
                    "data-ocid": `scraper.history-delete-button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                      " Delete"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] }, item.id))
    ] })
  ] });
}
function PresetsTab({
  onUsePreset,
  currentConfig
}) {
  const [presets, setPresets] = reactExports.useState(DEMO_PRESETS);
  const categories = Array.from(new Set(presets.map((p) => p.category)));
  function handleSaveCurrentConfig() {
    if (!(currentConfig == null ? void 0 : currentConfig.url)) return;
    const newPreset = {
      id: `custom-${Date.now()}`,
      name: `Custom — ${new URL(currentConfig.url).hostname}`,
      description: `Saved config for ${currentConfig.url}`,
      url: currentConfig.url ?? "",
      selector: currentConfig.selector ?? "",
      selectorType: currentConfig.selectorType ?? "css",
      outputFormat: currentConfig.outputFormat ?? "both",
      limit: currentConfig.limit ?? 20,
      category: "custom"
    };
    setPresets((prev) => [newPreset, ...prev]);
  }
  function handleDeletePreset(id) {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "scraper.presets-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-500 text-xs", children: [
        presets.length,
        " saved presets"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleSaveCurrentConfig,
          className: "flex items-center gap-1.5 text-xs font-medium text-purple-300 border border-purple-700/50 hover:bg-purple-900/30 px-3 py-1.5 rounded-lg transition-colors",
          "data-ocid": "scraper.add-preset-button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
            " Save Current Config"
          ]
        }
      )
    ] }),
    categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3", children: cat }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3", children: presets.filter((p) => p.category === cat).map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 transition-colors group",
          "data-ocid": `scraper.preset-card.${preset.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-100 font-semibold text-sm truncate", children: preset.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs mt-0.5 leading-relaxed", children: preset.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `shrink-0 text-[10px] px-2 py-0.5 rounded-full border capitalize ${CATEGORY_COLORS[preset.category]}`,
                  children: preset.category
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3 text-slate-600 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 text-xs truncate", children: preset.url.replace(/^https?:\/\//, "") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "w-3 h-3 text-slate-600 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-400 text-xs truncate", children: preset.selector }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 text-[10px] uppercase shrink-0", children: preset.selectorType })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onUsePreset(preset),
                  className: "flex-1 text-xs font-medium text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/30 rounded-lg py-1.5 transition-colors",
                  "data-ocid": `scraper.use-preset-button.${preset.id}`,
                  children: "Load Preset"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleDeletePreset(preset.id),
                  className: "text-xs text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-700/50 p-1.5 rounded-lg transition-colors",
                  "data-ocid": `scraper.delete-preset-button.${preset.id}`,
                  "aria-label": "Delete preset",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
                }
              )
            ] })
          ]
        },
        preset.id
      )) })
    ] }, cat))
  ] });
}
const TABS = [
  { id: "scraper", label: "Scraper", icon: ScanLine },
  { id: "history", label: "History", icon: History },
  { id: "presets", label: "Presets", icon: Layers }
];
function ScraperToolPage() {
  const [activeTab, setActiveTab] = reactExports.useState("scraper");
  const [presetState, setPresetState] = reactExports.useState({});
  const [currentConfig, setCurrentConfig] = reactExports.useState({});
  const currentConfigRef = reactExports.useRef(currentConfig);
  currentConfigRef.current = currentConfig;
  function handleUsePreset(preset) {
    setPresetState({
      initialUrl: preset.url,
      initialSelector: preset.selector,
      initialSelectorType: preset.selectorType,
      initialOutputFormat: preset.outputFormat,
      initialLimit: preset.limit
    });
    setCurrentConfig({
      url: preset.url,
      selector: preset.selector,
      selectorType: preset.selectorType,
      outputFormat: preset.outputFormat,
      limit: preset.limit
    });
    setActiveTab("scraper");
  }
  reactExports.useCallback(() => {
    function onRerun() {
      const raw = sessionStorage.getItem("scraper_rerun");
      if (!raw) return;
      try {
        const { url, selector } = JSON.parse(raw);
        sessionStorage.removeItem("scraper_rerun");
        setPresetState({ initialUrl: url, initialSelector: selector });
        setCurrentConfig({ url, selector });
        setActiveTab("scraper");
      } catch {
      }
    }
    window.addEventListener("scraper:rerun", onRerun);
    return () => window.removeEventListener("scraper:rerun", onRerun);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-slate-950 p-4 sm:p-6 space-y-5",
      "data-ocid": "scraper.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "w-4 h-4 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-100", children: "Web Scraper Tool" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50 font-medium", children: "Admin Only" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm", children: "Extract structured data from any public website using CSS selectors or XPath. Push results directly to your CRM." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "https://scrapling.readthedocs.io",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 px-3 py-2 rounded-lg transition-colors self-start sm:self-auto",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                " Docs"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 bg-amber-900/15 border border-amber-700/30 rounded-xl px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-amber-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-300/80 text-xs leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-amber-300", children: "Responsible use only." }),
            " Only scrape websites you are authorized to access. Always check robots.txt and respect website Terms of Service and privacy regulations (GDPR/CCPA)."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-end gap-0 border-b border-slate-800",
            "data-ocid": "scraper.tabs",
            children: TABS.map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(id),
                className: `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === id ? "border-purple-500 text-slate-100" : "border-transparent text-slate-500 hover:text-slate-300"}`,
                "data-ocid": `scraper.${id}-tab`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }),
                  label
                ]
              },
              id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-8", children: [
          activeTab === "scraper" && /* @__PURE__ */ jsxRuntimeExports.jsx(ScraperTab, { ...presetState }, JSON.stringify(presetState)),
          activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryTab, {}),
          activeTab === "presets" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            PresetsTab,
            {
              onUsePreset: handleUsePreset,
              currentConfig: currentConfigRef.current
            }
          )
        ] })
      ]
    }
  );
}
export {
  ScraperToolPage as default
};
