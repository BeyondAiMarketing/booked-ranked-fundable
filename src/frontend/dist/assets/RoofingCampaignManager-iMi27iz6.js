import { c as createLucideIcon, b3 as useActor, a as useQueryClient, r as reactExports, u as useQuery, b as useMutation, j as jsxRuntimeExports, F as FileText, aF as ChevronRight, E as Eye, an as RefreshCw, l as LoaderCircle, h as Save, b5 as CircleAlert, aa as Tag, b6 as createActor, U as Users, aT as Upload, m as Mail, T as TrendingUp, b9 as Play, aG as Pause, cd as UserPlus, ai as Database, a3 as Search, ce as RotateCcw, cf as processCSVImport } from "./index-CI0aYo5Z.js";
import { L as Link } from "./link-B9tsHinY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8", key: "mg9rjx" }
  ]
];
const Bold = createLucideIcon("bold", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }]
];
const Italic = createLucideIcon("italic", __iconNode);
const MERGE_FIELDS = [
  {
    field: "{{company_name}}",
    label: "Company Name",
    example: "Smith Roofing"
  },
  { field: "{{city}}", label: "City", example: "Houston" },
  { field: "{{ranking_score}}", label: "Ranking Score", example: "34" },
  { field: "{{dead_zones_count}}", label: "Dead Zones Count", example: "6" },
  {
    field: "{{top_competitor}}",
    label: "Top Competitor",
    example: "ABC Roofing"
  },
  {
    field: "{{missing_services}}",
    label: "Missing Services",
    example: "GMB profile, reviews"
  },
  { field: "{{first_name}}", label: "First Name", example: "Mike" },
  {
    field: "{{service_area_miles}}",
    label: "Service Area Miles",
    example: "10"
  },
  {
    field: "{{cta_link}}",
    label: "CTA Link",
    example: "https://bookedrankedfunded.org/demo"
  }
];
const SAMPLE_DATA = {
  "{{company_name}}": "Smith Roofing",
  "{{city}}": "Houston",
  "{{ranking_score}}": "34",
  "{{dead_zones_count}}": "6",
  "{{top_competitor}}": "ABC Roofing",
  "{{missing_services}}": "GMB profile, reviews",
  "{{first_name}}": "Mike",
  "{{service_area_miles}}": "10",
  "{{cta_link}}": "https://bookedrankedfunded.org/demo"
};
const DEFAULT_TEMPLATES = [
  {
    id: "roofing-1",
    dayNumber: 1,
    name: "The Audit Reveal",
    subject: "{{company_name}}, we ran your Google Maps ranking — here's what we found",
    body: "Hi {{first_name}},\n\nWe did a quick local ranking audit for {{company_name}} in {{city}}.\n\nYour score: {{ranking_score}}/100.\n\nHere's what stood out: you're ranking well near your shop — but 2-3 miles out, you're essentially invisible. In fact, {{dead_zones_count}} out of 9 grid zones around your location show you below position 10 on Google Maps.\n\nMeanwhile, {{top_competitor}} is picking up every call in those blind spots.\n\nThis is a problem your current SEO company probably hasn't shown you — because they only check from your address.\n\nWe can fix this. And we can show you exactly how in 15 minutes.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject: "We ran a free local ranking audit for your roofing business",
    fallbackBody: "Hi there,\n\nWe ran a free local ranking audit for your roofing business and found something most business owners never see.\n\nYou may be ranking #1 near your shop — but invisible to homeowners just 2-3 miles away. That's missed calls, missed jobs, missed revenue.\n\nWe'd love to show you the results and what can be done. Takes 15 minutes.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1"
  },
  {
    id: "roofing-2",
    dayNumber: 2,
    name: "The Explanation",
    subject: "Why {{company_name}} ranks #1 on your street — and nowhere else",
    body: `Hi {{first_name}},

Yesterday I sent over {{company_name}}'s local ranking audit. Today I want to explain what the numbers actually mean.

Google shows results based on the searcher's location — not your business address. So when you search for yourself from your shop in {{city}}, you look great. But a homeowner 3 miles away searching "roofer near me" sees a completely different list.

Your {{dead_zones_count}} dead zones are costing you real revenue every single week. Most SEO companies never show clients this because they check rankings from the business address.

The companies ranking in those blind spots aren't better roofers. They just have better local coverage signals: more reviews in more neighborhoods, location-specific landing pages, citation consistency across {{service_area_miles}} miles.

All of this is fixable. And we automate it.

{{cta_link}}

Best,
The BRF Team`,
    fallbackSubject: "The local ranking blind spot most roofers don't know about",
    fallbackBody: "Hi there,\n\nMost roofing business owners only check their Google ranking from their own shop — and they always look great.\n\nThe problem? Homeowners 2-3 miles away see a completely different list. And your competitors are showing up in those blind spots.\n\nWe can fix this. Let us show you how in 15 minutes.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1"
  },
  {
    id: "roofing-3",
    dayNumber: 3,
    name: "The Cost",
    subject: "Every week this goes unfixed = jobs going to {{top_competitor}}",
    body: "Hi {{first_name}},\n\nLet's put a number on this.\n\nIf {{company_name}} is invisible in {{dead_zones_count}} out of 9 ranking zones around {{city}}, you're unreachable to roughly 60% of the homeowners in your service area right now.\n\nFor a roofing company doing $500K/year, that blind spot could represent $200-$350K in revenue going to {{top_competitor}} and others who rank where you don't.\n\nThat's not a marketing problem. That's a location visibility problem — and it compounds every month you don't fix it.\n\nThe good news: we've seen roofing businesses in markets like {{city}} close their blind spots and see a measurable increase in inbound calls within 60 days.\n\nHere's how we do it: {{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject: "The cost of being invisible in 60% of your service area",
    fallbackBody: "Hi there,\n\nIf you're ranking in less than half your service area, you're potentially leaving hundreds of thousands in revenue on the table — going to competitors who show up where you don't.\n\nThis is fixable. Let us show you how.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1"
  },
  {
    id: "roofing-4",
    dayNumber: 4,
    name: "The Solution",
    subject: "What fixing {{company_name}}'s local ranking actually looks like",
    body: "Hi {{first_name}},\n\nHere's what we'd do for {{company_name}} in {{city}} specifically:\n\n1. Close the {{missing_services}} gap — these are the quick wins that move your ranking fastest.\n2. Build location signals across your {{service_area_miles}}-mile service area — reviews, citations, and content tied to neighborhoods, not just your address.\n3. Automate reputation — every completed job triggers a review request. Every review gets a drafted response in one click.\n4. Track your grid ranking weekly — you'll see exactly which zones are improving.\n\nThis runs on autopilot. You close jobs. We handle the visibility layer.\n\nMost clients see measurable ranking improvement in 45-90 days.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject: "Here's what fixing your local Google ranking actually looks like",
    fallbackBody: "Hi there,\n\nFixing local Google rankings for roofing businesses isn't magic — it's a specific set of signals that Google rewards: reviews in multiple locations, consistent citations, and location-specific content.\n\nWe automate all of it. Most clients see improvement in 45-90 days.\n\nSee how it works: {{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1"
  },
  {
    id: "roofing-5",
    dayNumber: 5,
    name: "The Proof",
    subject: "Before/after: {{city}} roofer went from invisible to #1 in 6 weeks",
    body: "Hi {{first_name}},\n\nA roofing company in a market similar to {{city}} came to us with a ranking score of 31/100. Similar blind spot pattern to what we found for {{company_name}}.\n\n6 weeks later:\n- Ranking score: 78/100\n- Covered 8 of 9 grid zones (up from 3)\n- Inbound calls up 40% month-over-month\n- {{top_competitor}} no longer showing above them in their primary service zones\n\nWhat changed: review velocity, location-specific landing pages, citation cleanup, and weekly grid monitoring.\n\nAll automated. Owner did nothing differently.\n\nWant results like this for {{company_name}} in {{city}}?\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject: "Real results: roofing company goes from invisible to #1 in 6 weeks",
    fallbackBody: "Hi there,\n\nA roofing company with a local ranking score of 31/100 — similar to what we see in most markets — went to 78/100 in 6 weeks using our platform.\n\nMore calls. More booked jobs. No extra work from the owner.\n\nSee how: {{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1"
  },
  {
    id: "roofing-6",
    dayNumber: 6,
    name: "The Offer",
    subject: "{{company_name}} — 7-day trial, no credit card, no lock-in",
    body: "Hi {{first_name}},\n\nI've been sharing {{company_name}}'s audit results this week because I genuinely think there's real money being left on the table in {{city}}.\n\nHere's our offer: try the full platform for 7 days, completely free. No credit card required. No long-term contract.\n\nYou'll get:\n- Your full local ranking grid — live and updated\n- Automated review requests for every completed job\n- AI-powered call answering for missed calls\n- Fundability score and roadmap\n- Full CRM and outreach automation\n\nIf it doesn't move the needle in 7 days, you walk away with no obligation.\n\nStart your trial: {{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject: "7-day free trial — no credit card required",
    fallbackBody: "Hi there,\n\nTry the full BRF platform free for 7 days — no credit card, no lock-in.\n\nLocal ranking grid, automated reviews, AI call answering, CRM, and fundability tracking — all in one platform built for roofing businesses.\n\nStart here: {{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1"
  },
  {
    id: "roofing-7",
    dayNumber: 7,
    name: "Last Call",
    subject: "Closing this out — wanted to make sure you saw this, {{first_name}}",
    body: "Hi {{first_name}},\n\nLast note — I promise.\n\nWe ran {{company_name}}'s local ranking audit a week ago. Score: {{ranking_score}}/100. {{dead_zones_count}} of 9 grid zones invisible to homeowners in {{city}}.\n\nI don't know if the timing is right for you right now. But I did want to make sure this didn't get buried.\n\nIf you want to talk through what we found and what it would take to fix it — even just 15 minutes — I'm available.\n\nNo pitch. Just the audit walkthrough.\n\n{{cta_link}}\n\nBest,\nThe BRF Team\n\nP.S. {{top_competitor}} is actively running our platform in {{city}}. Just something to keep in mind.",
    fallbackSubject: "Last note — wanted you to have this before I close it out",
    fallbackBody: "Hi there,\n\nLast message from me.\n\nIf you're open to a 15-minute audit walkthrough — no pitch, just the data — I'm available this week.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1"
  }
];
function renderWithSampleData(text) {
  return Object.entries(SAMPLE_DATA).reduce(
    (acc, [field, value]) => acc.replaceAll(field, value),
    text
  );
}
function insertAtCursor(ref, text, onChange) {
  const el = ref.current;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const current = el.value;
  const next = current.slice(0, start) + text + current.slice(end);
  onChange(next);
  requestAnimationFrame(() => {
    el.focus();
    el.setSelectionRange(start + text.length, start + text.length);
  });
}
function ToolbarButton({
  icon: Icon,
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      title: label,
      "aria-label": label,
      onClick,
      className: "p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
    }
  );
}
function MergeFieldPanel({ onInsert }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/60 border border-white/10 rounded-xl p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4 text-blue-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-300 uppercase tracking-wide", children: "Merge Fields — click to insert" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: MERGE_FIELDS.map(({ field, label, example }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        title: `Example: ${example}`,
        "aria-label": `Insert ${label}`,
        onClick: () => onInsert(field),
        className: "px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs rounded-md font-mono transition-colors",
        children: field
      },
      field
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs mt-2", children: "Hover any field to see sample value • Click to insert at cursor" })
  ] });
}
function PreviewPane({ subject, body }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/50 border border-white/10 rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1", children: "Subject" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium text-sm", children: renderWithSampleData(subject) || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 italic", children: "No subject" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/50 border border-white/10 rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2", children: "Email Body Preview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-200 text-sm leading-relaxed whitespace-pre-wrap", children: renderWithSampleData(body) || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 italic", children: "No body content" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-xs", children: "Preview uses sample data: Smith Roofing, Houston TX, score 34" })
  ] });
}
function EmailTemplateEditor() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [activeTab, setActiveTab] = reactExports.useState("main");
  const [previewMode, setPreviewMode] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState("");
  const [drafts, setDrafts] = reactExports.useState({});
  const mainBodyRef = reactExports.useRef(null);
  const fallbackBodyRef = reactExports.useRef(null);
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 4e3);
  }
  const DAY_NAMES = {
    1: "The Audit Reveal",
    2: "The Explanation",
    3: "The Cost",
    4: "The Solution",
    5: "The Proof",
    6: "The Offer",
    7: "Last Call"
  };
  const templatesQuery = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: async () => {
      if (!actor) return DEFAULT_TEMPLATES;
      try {
        const result = await actor.getEmailTemplates();
        if (!result || result.length === 0) return DEFAULT_TEMPLATES;
        return result.map((t) => {
          const dayNum = Number(t.day);
          return {
            id: String(Number(t.id)),
            dayNumber: dayNum,
            name: DAY_NAMES[dayNum] ?? `Day ${dayNum}`,
            subject: t.subject,
            body: t.body,
            fallbackSubject: t.fallbackSubject,
            fallbackBody: t.fallbackBody,
            version: "v1"
          };
        });
      } catch {
        return DEFAULT_TEMPLATES;
      }
    },
    enabled: true
  });
  const saveMutation = useMutation({
    mutationFn: async (template) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateEmailTemplate(
        BigInt(template.id),
        template.subject,
        template.body,
        template.fallbackSubject,
        template.fallbackBody
      );
    },
    onSuccess: (_data, template) => {
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[template.id];
        return next;
      });
      showToast(`Email ${template.dayNumber} saved.`);
    },
    onError: () => showToast("Save failed. Please try again.")
  });
  const templates = templatesQuery.data ?? DEFAULT_TEMPLATES;
  const selected = selectedId != null ? drafts[selectedId] ?? templates.find((t) => t.id === selectedId) ?? null : null;
  const isDirty = selectedId != null && !!drafts[selectedId];
  function patchDraft(patch) {
    if (!selectedId || !selected) return;
    setDrafts((prev) => ({ ...prev, [selectedId]: { ...selected, ...patch } }));
  }
  function handleInsert(field) {
    if (!selected) return;
    const ref = activeTab === "main" ? mainBodyRef : fallbackBodyRef;
    const key = activeTab === "main" ? "body" : "fallbackBody";
    insertAtCursor(ref, field, (v) => patchDraft({ [key]: v }));
  }
  function handleRevert() {
    if (!selectedId) return;
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[selectedId];
      return next;
    });
    showToast("Reverted to saved version.");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0 min-h-[600px] relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-52 shrink-0 bg-slate-900/60 border border-white/10 rounded-l-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-blue-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-300 uppercase tracking-wide", children: "Templates" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/5", children: (templatesQuery.isLoading ? DEFAULT_TEMPLATES : templates).map(
        (t) => {
          const hasDraft = !!drafts[t.id];
          const isActive = selectedId === t.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `email_templates.template.${t.dayNumber}`,
              onClick: () => {
                setSelectedId(t.id);
                setPreviewMode(false);
                setActiveTab("main");
              },
              className: `w-full text-left px-4 py-3 transition-colors flex items-center justify-between gap-1 ${isActive ? "bg-blue-600/20 border-l-2 border-blue-500" : "hover:bg-slate-800/50 border-l-2 border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-slate-400", children: [
                    "Day ",
                    t.dayNumber
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white truncate leading-tight mt-0.5", children: t.name }),
                  hasDraft && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-400 font-medium", children: "unsaved" })
                ] }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-blue-400 shrink-0" })
              ]
            },
            t.id
          );
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 border border-l-0 border-white/10 rounded-r-2xl bg-slate-950/40 backdrop-blur-sm flex flex-col overflow-hidden", children: [
      !selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "email_templates.empty_state",
          className: "flex-1 flex flex-col items-center justify-center gap-3 text-center p-10",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-10 h-10 text-slate-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 text-sm", children: "Select a template from the list to start editing" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 px-5 py-3.5 border-b border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-blue-400 uppercase tracking-wide", children: [
              "Day ",
              selected.dayNumber
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: selected.name }),
            isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full", children: "Unsaved" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "email_templates.preview_toggle",
                onClick: () => setPreviewMode((v) => !v),
                className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${previewMode ? "bg-blue-600/30 border-blue-500/50 text-blue-300" : "bg-slate-800 border-white/10 text-slate-300 hover:text-white"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" }),
                  previewMode ? "Edit" : "Preview"
                ]
              }
            ),
            isDirty && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "email_templates.revert_button",
                onClick: handleRevert,
                className: "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                  "Revert"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "email_templates.save_button",
                onClick: () => saveMutation.mutate(selected),
                disabled: saveMutation.isPending || !isDirty,
                className: "flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50",
                children: [
                  saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
                  saveMutation.isPending ? "Saving..." : "Save"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-white/10", children: ["main", "fallback"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": `email_templates.${tab}_tab`,
            onClick: () => {
              setActiveTab(tab);
              setPreviewMode(false);
            },
            className: `px-5 py-2.5 text-xs font-semibold capitalize transition-colors border-b-2 ${activeTab === tab ? "border-blue-500 text-blue-400" : "border-transparent text-slate-500 hover:text-slate-300"}`,
            children: tab === "main" ? "Main Template" : "Fallback Template"
          },
          tab
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-5 space-y-4", children: previewMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          PreviewPane,
          {
            subject: activeTab === "main" ? selected.subject : selected.fallbackSubject,
            body: activeTab === "main" ? selected.body : selected.fallbackBody
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1",
                htmlFor: "email_templates_subject_input",
                children: "Subject Line"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                "data-ocid": "email_templates.subject_input",
                value: activeTab === "main" ? selected.subject : selected.fallbackSubject,
                onChange: (e) => patchDraft(
                  activeTab === "main" ? { subject: e.target.value } : { fallbackSubject: e.target.value }
                ),
                className: "w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors",
                placeholder: "Enter subject line...",
                id: "email_templates_subject_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1",
                htmlFor: "email_templates_body_textarea",
                children: "Email Body"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 px-2 py-1 bg-slate-800/60 border border-b-0 border-white/10 rounded-t-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToolbarButton,
                {
                  icon: Bold,
                  label: "Bold",
                  onClick: () => {
                    const ref = activeTab === "main" ? mainBodyRef : fallbackBodyRef;
                    const key = activeTab === "main" ? "body" : "fallbackBody";
                    insertAtCursor(
                      ref,
                      "**bold text**",
                      (v) => patchDraft({ [key]: v })
                    );
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToolbarButton,
                {
                  icon: Italic,
                  label: "Italic",
                  onClick: () => {
                    const ref = activeTab === "main" ? mainBodyRef : fallbackBodyRef;
                    const key = activeTab === "main" ? "body" : "fallbackBody";
                    insertAtCursor(
                      ref,
                      "_italic text_",
                      (v) => patchDraft({ [key]: v })
                    );
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToolbarButton,
                {
                  icon: Link,
                  label: "Insert Link",
                  onClick: () => {
                    const ref = activeTab === "main" ? mainBodyRef : fallbackBodyRef;
                    const key = activeTab === "main" ? "body" : "fallbackBody";
                    const url = window.prompt("Enter URL:");
                    if (url)
                      insertAtCursor(
                        ref,
                        url,
                        (v) => patchDraft({ [key]: v })
                      );
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                ref: activeTab === "main" ? mainBodyRef : fallbackBodyRef,
                "data-ocid": "email_templates.body_textarea",
                value: activeTab === "main" ? selected.body : selected.fallbackBody,
                onChange: (e) => patchDraft(
                  activeTab === "main" ? { body: e.target.value } : { fallbackBody: e.target.value }
                ),
                rows: 14,
                className: "w-full bg-slate-800/60 border border-white/10 rounded-b-lg px-3 py-3 text-sm text-white placeholder-slate-500 font-mono leading-relaxed focus:outline-none focus:border-blue-500/60 transition-colors resize-y",
                placeholder: "Write your email body here...",
                id: "email_templates_body_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MergeFieldPanel, { onInsert: handleInsert })
        ] }) })
      ] }),
      templatesQuery.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "email_templates.loading_state",
          className: "absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-r-2xl",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Loading templates..." })
          ] })
        }
      ),
      saveMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "email_templates.error_state",
          className: "mx-5 mb-4 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-red-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-300", children: "Save failed. Please try again." })
          ]
        }
      )
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "email_templates.toast",
        className: "fixed bottom-6 right-6 bg-slate-800 border border-white/10 text-white px-5 py-3 rounded-xl shadow-xl text-sm z-50",
        children: toast
      }
    )
  ] });
}
const EMAIL_LABELS = [
  "",
  // index 0 unused
  "The Audit Reveal",
  "The Explanation",
  "The Cost",
  "The Solution",
  "The Proof",
  "The Offer",
  "Last Call"
];
function formatTs(ts) {
  if (!ts) return "Never";
  return new Date(Number(ts) / 1e6).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function StatusBadge({ status }) {
  const styles = {
    active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    paused: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    unsubscribed: "bg-red-500/20 text-red-300 border-red-500/30",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status] ?? styles.paused}`,
      children: status
    }
  );
}
function RoofingCampaignManager() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [toast, setToast] = reactExports.useState("");
  const [isPaused, setIsPaused] = reactExports.useState(false);
  const [manualEmail, setManualEmail] = reactExports.useState("");
  const [manualCompany, setManualCompany] = reactExports.useState("");
  const [manualCity, setManualCity] = reactExports.useState("");
  const [manualState, setManualState] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [importSubTab, setImportSubTab] = reactExports.useState("upload");
  const [_csvFile, setCsvFile] = reactExports.useState(null);
  const [csvPreview, setCsvPreview] = reactExports.useState([]);
  const [importSummary, setImportSummary] = reactExports.useState(null);
  const [showEnrollConfirm, setShowEnrollConfirm] = reactExports.useState(false);
  const [enrollCount, setEnrollCount] = reactExports.useState(0);
  const [showStartModal, setShowStartModal] = reactExports.useState(false);
  const [campaignRunning, setCampaignRunning] = reactExports.useState(false);
  const showToast = reactExports.useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4e3);
  }, []);
  const statsQuery = useQuery({
    queryKey: ["campaignStats"],
    queryFn: () => actor.getCampaignStats(),
    enabled: !!actor,
    refetchInterval: 3e4
  });
  const leadsQuery = useQuery({
    queryKey: ["enrolledLeads"],
    queryFn: () => actor.getAllEnrolledLeads(),
    enabled: !!actor,
    refetchInterval: 3e4
  });
  const pauseMutation = useMutation({
    mutationFn: () => isPaused ? actor.resumeRoofingCampaign() : actor.pauseRoofingCampaign(),
    onSuccess: () => {
      setIsPaused((v) => !v);
      showToast(isPaused ? "Campaign resumed." : "Campaign paused.");
    }
  });
  const startCampaignMutation = useMutation({
    mutationFn: () => actor.startRoofingCampaign(),
    onSuccess: () => {
      setCampaignRunning(true);
      setShowStartModal(false);
      showToast("Campaign started! Emails will begin firing.");
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
    },
    onError: () => {
      setShowStartModal(false);
      showToast("Failed to start campaign. Check your configuration.");
    }
  });
  const enrollAllMutation = useMutation({
    mutationFn: () => actor.enrollRoofingLeadsIntoCampaign(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["enrolledLeads"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
      const r = result;
      showToast(`Enrolled ${r.enrolled} leads. ${r.skipped} already enrolled.`);
    }
  });
  const enrollOneMutation = useMutation({
    mutationFn: () => actor.enrollRoofingLead({
      email: manualEmail,
      companyName: manualCompany,
      city: manualCity,
      state: manualState,
      businessType: "roofing",
      website: [],
      phone: []
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolledLeads"] });
      queryClient.invalidateQueries({ queryKey: ["campaignStats"] });
      showToast(`${manualCompany} enrolled in campaign.`);
      setManualEmail("");
      setManualCompany("");
      setManualCity("");
      setManualState("");
    },
    onError: () => showToast("Failed to enroll lead. Check the details and try again.")
  });
  const leadDetailsQuery = useQuery({
    queryKey: ["leadCampaignDetails"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllLeadCampaignDetails();
      } catch {
        return [];
      }
    },
    enabled: !!actor,
    refetchInterval: 3e4
  });
  const handleCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      var _a, _b, _c, _d;
      const text = ((_a = e.target) == null ? void 0 : _a.result) || "";
      if (!text.trim()) return;
      Date.now().toString();
      const result = processCSVImport(text);
      const leads2 = (result.leads ?? []).map((l) => ({
        companyName: l.companyName || l.businessName || "",
        email: l.email || l["E-Mail"] || l["Email Address"] || "",
        phone: l.phone || l["Phone Number"] || "",
        city: l.city || "",
        state: l.state || "",
        status: l.status || "new"
      }));
      setCsvPreview(leads2);
      setImportSummary({
        total: ((_b = result.stats) == null ? void 0 : _b.total) ?? 0,
        valid: ((_c = result.leads) == null ? void 0 : _c.length) ?? 0,
        invalid: 0,
        duplicates: 0,
        alreadyEnrolled: 0,
        ready: ((_d = result.leads) == null ? void 0 : _d.length) ?? 0
      });
    };
    reader.readAsText(file);
  };
  const reEnrollMutation = useMutation({
    mutationFn: (email) => actor.reEnrollLead(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolledLeads"] });
      showToast("Lead re-enrolled in campaign.");
    }
  });
  const stats = statsQuery.data;
  const leads = leadsQuery.data ?? [];
  const leadDetails = leadDetailsQuery.data ?? [];
  const detailsMap = new Map(
    leadDetails.map((d) => [d.leadEmail, d])
  );
  function AuditScoreBadge({ score }) {
    if (score === null)
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 text-xs", children: "—" });
    const color = score >= 70 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : score >= 40 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-red-500/10 border-red-500/20 text-red-400";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color}`,
        children: [
          score,
          "/100"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "Roofing Outreach Campaign" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400 mt-1", children: "7-email sequence • Local ranking audit hook • Owl Alpha AI copy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-slate-900/60 border border-white/10 rounded-xl p-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              "data-ocid": "campaign.tab.overview",
              type: "button",
              onClick: () => setActiveTab("overview"),
              className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "overview" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
                "Campaign Overview"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              "data-ocid": "campaign.tab.templates",
              type: "button",
              onClick: () => setActiveTab("templates"),
              className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "templates" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }),
                "Email Templates"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              "data-ocid": "campaign.tab.import",
              type: "button",
              onClick: () => setActiveTab("import"),
              className: `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "import" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                "Import Leads"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            "data-ocid": "campaign.refresh_button",
            type: "button",
            onClick: () => {
              statsQuery.refetch();
              leadsQuery.refetch();
              leadDetailsQuery.refetch();
            },
            className: "flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-sm text-slate-300 rounded-lg transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
              " Refresh"
            ]
          }
        )
      ] })
    ] }),
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        {
          icon: Users,
          label: "Total Enrolled",
          value: stats ? String(stats.totalEnrolled) : "—"
        },
        {
          icon: Mail,
          label: "Sent Today",
          value: stats ? String(stats.emailsSentToday) : "—"
        },
        {
          icon: Mail,
          label: "Sent This Week",
          value: stats ? String(stats.emailsSentWeek) : "—"
        },
        {
          icon: TrendingUp,
          label: "Open / Click Rate",
          value: stats ? `${(stats.openRate * 100).toFixed(1)}% / ${(stats.clickRate * 100).toFixed(1)}%` : "—"
        }
      ].map(({ icon: Icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `campaign.stat.${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
          className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-blue-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: label })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-white", children: value })
          ]
        },
        label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            "data-ocid": "campaign.pause_toggle",
            type: "button",
            onClick: () => pauseMutation.mutate(),
            disabled: pauseMutation.isPending,
            className: `flex items-center gap-2 px-5 py-2.5 font-semibold rounded-lg transition-colors disabled:opacity-60 ${isPaused ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"}`,
            children: isPaused ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
              " Resume Campaign"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4" }),
              " Pause Campaign"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            "data-ocid": "campaign.enroll_all_button",
            type: "button",
            onClick: () => enrollAllMutation.mutate(),
            disabled: enrollAllMutation.isPending,
            className: "flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
              enrollAllMutation.isPending ? "Enrolling..." : "Enroll All Roofing Leads"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            "data-ocid": "campaign.start_campaign_button",
            type: "button",
            onClick: () => {
              const total = stats ? Number(stats.totalEnrolled) : 0;
              if (total === 0) {
                showToast(
                  "No leads are enrolled yet. Upload a CSV, pull from CRM, recover existing leads, or manually enroll a lead first."
                );
                return;
              }
              setShowStartModal(true);
            },
            disabled: campaignRunning || startCampaignMutation.isPending,
            className: "flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
              campaignRunning ? "Campaign Running" : startCampaignMutation.isPending ? "Starting..." : "Start Campaign"
            ]
          }
        )
      ] }),
      showStartModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "campaign.start_modal",
          className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white mb-2", children: "Start Roofing Campaign?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mb-1", children: "This will begin firing the 7-email sequence to all enrolled leads." }),
            stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-emerald-400 font-medium mb-4", children: [
              String(stats.totalEnrolled),
              " leads ready to receive emails."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": "campaign.start_modal.cancel_button",
                  type: "button",
                  onClick: () => setShowStartModal(false),
                  className: "px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": "campaign.start_modal.confirm_button",
                  type: "button",
                  onClick: () => startCampaignMutation.mutate(),
                  disabled: startCampaignMutation.isPending,
                  className: "px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-60",
                  children: startCampaignMutation.isPending ? "Starting..." : "Confirm & Start"
                }
              )
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-white mb-4", children: "Enroll Lead Manually" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3", children: [
          {
            placeholder: "Email address *",
            value: manualEmail,
            setter: setManualEmail,
            ocid: "campaign.manual_email_input"
          },
          {
            placeholder: "Company name *",
            value: manualCompany,
            setter: setManualCompany,
            ocid: "campaign.manual_company_input"
          },
          {
            placeholder: "City *",
            value: manualCity,
            setter: setManualCity,
            ocid: "campaign.manual_city_input"
          },
          {
            placeholder: "State (e.g. TX) *",
            value: manualState,
            setter: setManualState,
            ocid: "campaign.manual_state_input"
          }
        ].map(({ placeholder, value, setter, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-ocid": ocid,
            type: "text",
            placeholder,
            value,
            onChange: (e) => setter(e.target.value),
            className: "bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          },
          placeholder
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            "data-ocid": "campaign.manual_enroll_button",
            type: "button",
            onClick: () => enrollOneMutation.mutate(),
            disabled: enrollOneMutation.isPending || !manualEmail || !manualCompany || !manualCity || !manualState,
            className: "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50",
            children: enrollOneMutation.isPending ? "Enrolling..." : "Enroll Lead"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "campaign.leads_table",
          className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-semibold text-white", children: [
              "Enrolled Leads (",
              leads.length,
              ")"
            ] }) }),
            leads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "campaign.empty_state",
                className: "p-10 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-8 h-8 text-slate-600 mx-auto mb-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-400", children: "No leads enrolled yet. Click \\u201cEnroll All Roofing Leads\\u201d to get started." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-slate-500 text-xs border-b border-white/5", children: [
                "Email",
                "Company",
                "City",
                "Audit Score",
                "Email Day",
                "Step",
                "Last Sent",
                "Status",
                "Actions"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-medium", children: h }, h)) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: leads.map((lead, idx) => {
                const step = Number(lead.currentStep);
                const stepLabel = step >= 1 && step <= 7 ? `Email ${step} of 7 — ${EMAIL_LABELS[step] ?? ""}` : step > 7 ? "Completed" : "Pending";
                const detail = detailsMap.get(lead.leadEmail);
                const auditScore = (detail == null ? void 0 : detail.auditScore) ?? null;
                const emailDay = (detail == null ? void 0 : detail.currentEmailDay) ?? step;
                const usedFallback = (detail == null ? void 0 : detail.usedFallback) ?? false;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    "data-ocid": `campaign.item.${idx + 1}`,
                    className: "border-b border-white/5 hover:bg-slate-800/30",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-300 max-w-32 truncate", children: lead.leadEmail }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-300", children: lead.companyName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400", children: lead.city }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditScoreBadge, { score: auditScore }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            "data-ocid": `campaign.email_day.${idx + 1}`,
                            className: "text-slate-300 text-xs font-medium",
                            children: emailDay > 0 && emailDay <= 7 ? `Day ${emailDay} of 7` : emailDay > 7 ? "Done" : "Pending"
                          }
                        ),
                        usedFallback && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            "data-ocid": `campaign.fallback_badge.${idx + 1}`,
                            className: "inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30",
                            children: "Fallback"
                          }
                        )
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-300 text-xs", children: stepLabel }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-400 text-xs whitespace-nowrap", children: formatTs(lead.lastSentAt) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: lead.status }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          "data-ocid": `campaign.reenroll_button.${idx + 1}`,
                          type: "button",
                          onClick: () => {
                            if (window.confirm(
                              `Re-enroll ${lead.companyName} (${lead.leadEmail}) in the campaign from the beginning?`
                            )) {
                              reEnrollMutation.mutate(lead.leadEmail);
                            }
                          },
                          className: "px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors",
                          children: "Re-enroll"
                        }
                      ) })
                    ]
                  },
                  lead.leadEmail
                );
              }) })
            ] }) })
          ]
        }
      )
    ] }),
    activeTab === "templates" && /* @__PURE__ */ jsxRuntimeExports.jsx(EmailTemplateEditor, {}),
    activeTab === "import" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/50 border border-white/10 backdrop-blur-sm rounded-xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-1", children: "Import / Push Roofing Leads" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mb-4", children: "Upload a CSV, pull from CRM, or recover previously uploaded roofing leads." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-6 border-b border-white/10 pb-2", children: [
          { key: "upload", label: "Upload CSV", icon: Upload },
          { key: "crm", label: "Pull From CRM", icon: Database },
          {
            key: "lake",
            label: "Pull From Open Lead Lake",
            icon: Search
          },
          {
            key: "recover",
            label: "Recover Existing Leads",
            icon: RotateCcw
          }
        ].map(({ key, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            "data-ocid": `campaign.import_tab.${key}`,
            type: "button",
            onClick: () => setImportSubTab(key),
            className: `flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${importSubTab === key ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" : "text-slate-400 hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }),
              label
            ]
          },
          key
        )) }),
        importSubTab === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-blue-500/40 transition-colors cursor-pointer w-full",
              onClick: () => {
                var _a;
                return (_a = document.getElementById("csv-upload")) == null ? void 0 : _a.click();
              },
              onDrop: (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleCsvFile(file);
              },
              onDragOver: (e) => e.preventDefault(),
              onKeyDown: (e) => {
                var _a;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  (_a = document.getElementById("csv-upload")) == null ? void 0 : _a.click();
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 text-slate-500 mx-auto mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 font-medium", children: "Drop a CSV file here or click to upload" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Accepted: .csv" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "csv-upload",
                    type: "file",
                    accept: ".csv",
                    className: "hidden",
                    onChange: (e) => {
                      var _a;
                      const file = (_a = e.target.files) == null ? void 0 : _a[0];
                      if (file) handleCsvFile(file);
                    }
                  }
                )
              ]
            }
          ),
          csvPreview.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-slate-500 text-xs border-b border-white/5 bg-slate-800/40", children: [
                "Company Name",
                "Email",
                "Phone",
                "City",
                "State",
                "Status"
              ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: "px-4 py-2.5 text-left font-medium",
                  children: h
                },
                h
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: csvPreview.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: "border-b border-white/5 hover:bg-slate-800/30",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-300", children: row.companyName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-400", children: row.email ?? "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-400", children: row.phone ?? "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-400", children: row.city }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-slate-400", children: row.state }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${row.status === "Valid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : row.status === "Duplicate" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`,
                        children: row.status
                      }
                    ) })
                  ]
                },
                row.email || row.companyName || idx
              )) })
            ] }) }),
            importSummary && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 lg:grid-cols-6 gap-3", children: [
              { label: "Total Rows", value: importSummary.total },
              { label: "Valid", value: importSummary.valid },
              {
                label: "Invalid",
                value: importSummary.invalid
              },
              {
                label: "Duplicates",
                value: importSummary.duplicates
              },
              {
                label: "Already Enrolled",
                value: importSummary.alreadyEnrolled
              },
              {
                label: "Ready to Import",
                value: importSummary.ready
              }
            ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-slate-800/40 border border-white/10 rounded-lg p-3 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-white", children: value }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: label })
                ]
              },
              label
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  "data-ocid": "campaign.import_valid_button",
                  type: "button",
                  onClick: async () => {
                    const valid = csvPreview.filter(
                      (r) => r.status === "Valid"
                    );
                    if (valid.length === 0) {
                      showToast("No valid leads found.");
                      return;
                    }
                    for (const lead of valid) {
                      await (actor == null ? void 0 : actor.enrollRoofingLead({
                        email: lead.email ?? "",
                        companyName: lead.companyName,
                        city: lead.city,
                        state: lead.state,
                        businessType: "roofing",
                        website: [],
                        phone: []
                      }));
                    }
                    showToast(`${valid.length} leads imported.`);
                    queryClient.invalidateQueries({
                      queryKey: ["enrolledLeads"]
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["campaignStats"]
                    });
                    setCsvPreview([]);
                    setImportSummary(null);
                  },
                  className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
                    "Import Valid Leads"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  "data-ocid": "campaign.import_enroll_all_button",
                  type: "button",
                  onClick: async () => {
                    const valid = csvPreview.filter(
                      (r) => r.status === "Valid"
                    );
                    if (valid.length === 0) {
                      showToast("No valid leads found.");
                      return;
                    }
                    for (const lead of valid) {
                      await (actor == null ? void 0 : actor.enrollRoofingLead({
                        email: lead.email ?? "",
                        companyName: lead.companyName,
                        city: lead.city,
                        state: lead.state,
                        businessType: "roofing",
                        website: [],
                        phone: []
                      }));
                    }
                    showToast(
                      `${valid.length} leads enrolled into Roofing Outreach Campaign.`
                    );
                    queryClient.invalidateQueries({
                      queryKey: ["enrolledLeads"]
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["campaignStats"]
                    });
                    setCsvPreview([]);
                    setImportSummary(null);
                  },
                  className: "flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
                    "Import and Enroll All"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": "campaign.import_cancel_button",
                  type: "button",
                  onClick: () => {
                    setCsvPreview([]);
                    setImportSummary(null);
                    setCsvFile(null);
                  },
                  className: "px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors",
                  children: "Cancel"
                }
              )
            ] })
          ] })
        ] }),
        importSubTab === "crm" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-white", children: "Roofing Leads from CRM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20", children: [
              leads.length,
              " enrolled"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "Enroll all valid roofing leads that are not already in the campaign." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              "data-ocid": "campaign.enroll_crm_button",
              type: "button",
              onClick: () => {
                const unenrolled = leads.filter(
                  (l) => l.status !== "active"
                );
                setEnrollCount(unenrolled.length);
                setShowEnrollConfirm(true);
              },
              className: "flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-4 h-4" }),
                "Enroll All Matching Roofing Leads"
              ]
            }
          )
        ] }),
        importSubTab === "lake" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-8 h-8 text-slate-600 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mb-3", children: "Connect your Open Lead Lake to pull roofing leads directly." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/open-lead-lake",
              className: "inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4" }),
                "Go to Open Lead Lake"
              ]
            }
          )
        ] }),
        importSubTab === "recover" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-8 h-8 text-slate-600 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "No previous roofing lead uploads were found. Upload a CSV or pull from CRM/Open Lead Lake." })
        ] })
      ] }),
      showEnrollConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 border border-white/15 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white mb-2", children: "Enroll Roofing Leads?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-400 mb-4", children: [
          "You are about to enroll ",
          enrollCount,
          " roofing leads into this 7-email campaign. Continue?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "data-ocid": "campaign.enroll_confirm.cancel_button",
              type: "button",
              onClick: () => setShowEnrollConfirm(false),
              className: "px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg transition-colors",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "data-ocid": "campaign.enroll_confirm.confirm_button",
              type: "button",
              onClick: () => {
                enrollAllMutation.mutate();
                setShowEnrollConfirm(false);
              },
              className: "px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors",
              children: "Confirm Enroll"
            }
          )
        ] })
      ] }) })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "campaign.toast",
        className: "fixed bottom-6 right-6 bg-slate-800 border border-white/10 text-white px-5 py-3 rounded-xl shadow-xl text-sm z-50",
        children: toast
      }
    )
  ] });
}
export {
  RoofingCampaignManager as default
};
