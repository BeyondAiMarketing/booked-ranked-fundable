import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Bold,
  ChevronRight,
  Eye,
  FileText,
  Italic,
  Link,
  Loader2,
  RefreshCw,
  Save,
  Tag,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

interface EmailTemplate {
  id: string;
  dayNumber: number;
  name: string;
  subject: string;
  body: string;
  fallbackSubject: string;
  fallbackBody: string;
  version?: string;
}

const MERGE_FIELDS = [
  {
    field: "{{company_name}}",
    label: "Company Name",
    example: "Smith Roofing",
  },
  { field: "{{city}}", label: "City", example: "Houston" },
  { field: "{{ranking_score}}", label: "Ranking Score", example: "34" },
  { field: "{{dead_zones_count}}", label: "Dead Zones Count", example: "6" },
  {
    field: "{{top_competitor}}",
    label: "Top Competitor",
    example: "ABC Roofing",
  },
  {
    field: "{{missing_services}}",
    label: "Missing Services",
    example: "GMB profile, reviews",
  },
  { field: "{{first_name}}", label: "First Name", example: "Mike" },
  {
    field: "{{service_area_miles}}",
    label: "Service Area Miles",
    example: "10",
  },
  {
    field: "{{cta_link}}",
    label: "CTA Link",
    example: "https://bookedrankedfunded.org/demo",
  },
];

const SAMPLE_DATA: Record<string, string> = {
  "{{company_name}}": "Smith Roofing",
  "{{city}}": "Houston",
  "{{ranking_score}}": "34",
  "{{dead_zones_count}}": "6",
  "{{top_competitor}}": "ABC Roofing",
  "{{missing_services}}": "GMB profile, reviews",
  "{{first_name}}": "Mike",
  "{{service_area_miles}}": "10",
  "{{cta_link}}": "https://bookedrankedfunded.org/demo",
};

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: "roofing-1",
    dayNumber: 1,
    name: "The Audit Reveal",
    subject:
      "{{company_name}}, we ran your Google Maps ranking — here's what we found",
    body: "Hi {{first_name}},\n\nWe did a quick local ranking audit for {{company_name}} in {{city}}.\n\nYour score: {{ranking_score}}/100.\n\nHere's what stood out: you're ranking well near your shop — but 2-3 miles out, you're essentially invisible. In fact, {{dead_zones_count}} out of 9 grid zones around your location show you below position 10 on Google Maps.\n\nMeanwhile, {{top_competitor}} is picking up every call in those blind spots.\n\nThis is a problem your current SEO company probably hasn't shown you — because they only check from your address.\n\nWe can fix this. And we can show you exactly how in 15 minutes.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject:
      "We ran a free local ranking audit for your roofing business",
    fallbackBody:
      "Hi there,\n\nWe ran a free local ranking audit for your roofing business and found something most business owners never see.\n\nYou may be ranking #1 near your shop — but invisible to homeowners just 2-3 miles away. That's missed calls, missed jobs, missed revenue.\n\nWe'd love to show you the results and what can be done. Takes 15 minutes.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1",
  },
  {
    id: "roofing-2",
    dayNumber: 2,
    name: "The Explanation",
    subject: "Why {{company_name}} ranks #1 on your street — and nowhere else",
    body: "Hi {{first_name}},\n\nYesterday I sent over {{company_name}}'s local ranking audit. Today I want to explain what the numbers actually mean.\n\nGoogle shows results based on the searcher's location — not your business address. So when you search for yourself from your shop in {{city}}, you look great. But a homeowner 3 miles away searching \"roofer near me\" sees a completely different list.\n\nYour {{dead_zones_count}} dead zones are costing you real revenue every single week. Most SEO companies never show clients this because they check rankings from the business address.\n\nThe companies ranking in those blind spots aren't better roofers. They just have better local coverage signals: more reviews in more neighborhoods, location-specific landing pages, citation consistency across {{service_area_miles}} miles.\n\nAll of this is fixable. And we automate it.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject:
      "The local ranking blind spot most roofers don't know about",
    fallbackBody:
      "Hi there,\n\nMost roofing business owners only check their Google ranking from their own shop — and they always look great.\n\nThe problem? Homeowners 2-3 miles away see a completely different list. And your competitors are showing up in those blind spots.\n\nWe can fix this. Let us show you how in 15 minutes.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1",
  },
  {
    id: "roofing-3",
    dayNumber: 3,
    name: "The Cost",
    subject: "Every week this goes unfixed = jobs going to {{top_competitor}}",
    body: "Hi {{first_name}},\n\nLet's put a number on this.\n\nIf {{company_name}} is invisible in {{dead_zones_count}} out of 9 ranking zones around {{city}}, you're unreachable to roughly 60% of the homeowners in your service area right now.\n\nFor a roofing company doing $500K/year, that blind spot could represent $200-$350K in revenue going to {{top_competitor}} and others who rank where you don't.\n\nThat's not a marketing problem. That's a location visibility problem — and it compounds every month you don't fix it.\n\nThe good news: we've seen roofing businesses in markets like {{city}} close their blind spots and see a measurable increase in inbound calls within 60 days.\n\nHere's how we do it: {{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject: "The cost of being invisible in 60% of your service area",
    fallbackBody:
      "Hi there,\n\nIf you're ranking in less than half your service area, you're potentially leaving hundreds of thousands in revenue on the table — going to competitors who show up where you don't.\n\nThis is fixable. Let us show you how.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1",
  },
  {
    id: "roofing-4",
    dayNumber: 4,
    name: "The Solution",
    subject: "What fixing {{company_name}}'s local ranking actually looks like",
    body: "Hi {{first_name}},\n\nHere's what we'd do for {{company_name}} in {{city}} specifically:\n\n1. Close the {{missing_services}} gap — these are the quick wins that move your ranking fastest.\n2. Build location signals across your {{service_area_miles}}-mile service area — reviews, citations, and content tied to neighborhoods, not just your address.\n3. Automate reputation — every completed job triggers a review request. Every review gets a drafted response in one click.\n4. Track your grid ranking weekly — you'll see exactly which zones are improving.\n\nThis runs on autopilot. You close jobs. We handle the visibility layer.\n\nMost clients see measurable ranking improvement in 45-90 days.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject:
      "Here's what fixing your local Google ranking actually looks like",
    fallbackBody:
      "Hi there,\n\nFixing local Google rankings for roofing businesses isn't magic — it's a specific set of signals that Google rewards: reviews in multiple locations, consistent citations, and location-specific content.\n\nWe automate all of it. Most clients see improvement in 45-90 days.\n\nSee how it works: {{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1",
  },
  {
    id: "roofing-5",
    dayNumber: 5,
    name: "The Proof",
    subject:
      "Before/after: {{city}} roofer went from invisible to #1 in 6 weeks",
    body: "Hi {{first_name}},\n\nA roofing company in a market similar to {{city}} came to us with a ranking score of 31/100. Similar blind spot pattern to what we found for {{company_name}}.\n\n6 weeks later:\n- Ranking score: 78/100\n- Covered 8 of 9 grid zones (up from 3)\n- Inbound calls up 40% month-over-month\n- {{top_competitor}} no longer showing above them in their primary service zones\n\nWhat changed: review velocity, location-specific landing pages, citation cleanup, and weekly grid monitoring.\n\nAll automated. Owner did nothing differently.\n\nWant results like this for {{company_name}} in {{city}}?\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject:
      "Real results: roofing company goes from invisible to #1 in 6 weeks",
    fallbackBody:
      "Hi there,\n\nA roofing company with a local ranking score of 31/100 — similar to what we see in most markets — went to 78/100 in 6 weeks using our platform.\n\nMore calls. More booked jobs. No extra work from the owner.\n\nSee how: {{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1",
  },
  {
    id: "roofing-6",
    dayNumber: 6,
    name: "The Offer",
    subject: "{{company_name}} — 7-day trial, no credit card, no lock-in",
    body: "Hi {{first_name}},\n\nI've been sharing {{company_name}}'s audit results this week because I genuinely think there's real money being left on the table in {{city}}.\n\nHere's our offer: try the full platform for 7 days, completely free. No credit card required. No long-term contract.\n\nYou'll get:\n- Your full local ranking grid — live and updated\n- Automated review requests for every completed job\n- AI-powered call answering for missed calls\n- Fundability score and roadmap\n- Full CRM and outreach automation\n\nIf it doesn't move the needle in 7 days, you walk away with no obligation.\n\nStart your trial: {{cta_link}}\n\nBest,\nThe BRF Team",
    fallbackSubject: "7-day free trial — no credit card required",
    fallbackBody:
      "Hi there,\n\nTry the full BRF platform free for 7 days — no credit card, no lock-in.\n\nLocal ranking grid, automated reviews, AI call answering, CRM, and fundability tracking — all in one platform built for roofing businesses.\n\nStart here: {{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1",
  },
  {
    id: "roofing-7",
    dayNumber: 7,
    name: "Last Call",
    subject:
      "Closing this out — wanted to make sure you saw this, {{first_name}}",
    body: "Hi {{first_name}},\n\nLast note — I promise.\n\nWe ran {{company_name}}'s local ranking audit a week ago. Score: {{ranking_score}}/100. {{dead_zones_count}} of 9 grid zones invisible to homeowners in {{city}}.\n\nI don't know if the timing is right for you right now. But I did want to make sure this didn't get buried.\n\nIf you want to talk through what we found and what it would take to fix it — even just 15 minutes — I'm available.\n\nNo pitch. Just the audit walkthrough.\n\n{{cta_link}}\n\nBest,\nThe BRF Team\n\nP.S. {{top_competitor}} is actively running our platform in {{city}}. Just something to keep in mind.",
    fallbackSubject:
      "Last note — wanted you to have this before I close it out",
    fallbackBody:
      "Hi there,\n\nLast message from me.\n\nIf you're open to a 15-minute audit walkthrough — no pitch, just the data — I'm available this week.\n\n{{cta_link}}\n\nBest,\nThe BRF Team",
    version: "v1",
  },
];

function renderWithSampleData(text: string): string {
  return Object.entries(SAMPLE_DATA).reduce(
    (acc, [field, value]) => acc.replaceAll(field, value),
    text,
  );
}

function insertAtCursor(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  text: string,
  onChange: (v: string) => void,
) {
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
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function MergeFieldPanel({ onInsert }: { onInsert: (field: string) => void }) {
  return (
    <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
          Merge Fields — click to insert
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {MERGE_FIELDS.map(({ field, label, example }) => (
          <button
            key={field}
            type="button"
            title={`Example: ${example}`}
            aria-label={`Insert ${label}`}
            onClick={() => onInsert(field)}
            className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs rounded-md font-mono transition-colors"
          >
            {field}
          </button>
        ))}
      </div>
      <p className="text-slate-500 text-xs mt-2">
        Hover any field to see sample value • Click to insert at cursor
      </p>
    </div>
  );
}

function PreviewPane({ subject, body }: { subject: string; body: string }) {
  return (
    <div className="space-y-3">
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">
          Subject
        </span>
        <p className="text-white font-medium text-sm">
          {renderWithSampleData(subject) || (
            <span className="text-slate-500 italic">No subject</span>
          )}
        </p>
      </div>
      <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">
          Email Body Preview
        </span>
        <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
          {renderWithSampleData(body) || (
            <span className="text-slate-500 italic">No body content</span>
          )}
        </div>
      </div>
      <p className="text-slate-500 text-xs">
        Preview uses sample data: Smith Roofing, Houston TX, score 34
      </p>
    </div>
  );
}

export default function EmailTemplateEditor() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "fallback">("main");
  const [previewMode, setPreviewMode] = useState(false);
  const [toast, setToast] = useState("");
  const [drafts, setDrafts] = useState<Record<string, EmailTemplate>>({});

  const mainBodyRef = useRef<HTMLTextAreaElement>(null);
  const fallbackBodyRef = useRef<HTMLTextAreaElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }

  const DAY_NAMES: Record<number, string> = {
    1: "The Audit Reveal",
    2: "The Explanation",
    3: "The Cost",
    4: "The Solution",
    5: "The Proof",
    6: "The Offer",
    7: "Last Call",
  };

  const templatesQuery = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: async (): Promise<EmailTemplate[]> => {
      if (!actor) return DEFAULT_TEMPLATES;
      try {
        const result = await (
          actor as unknown as {
            getEmailTemplates: () => Promise<
              Array<{
                id: bigint;
                day: bigint;
                subject: string;
                body: string;
                fallbackSubject: string;
                fallbackBody: string;
                updatedAt: bigint;
              }>
            >;
          }
        ).getEmailTemplates();
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
            version: "v1",
          };
        });
      } catch {
        return DEFAULT_TEMPLATES;
      }
    },
    enabled: true,
  });

  const saveMutation = useMutation({
    mutationFn: async (template: EmailTemplate) => {
      if (!actor) throw new Error("Not connected");
      return (
        actor as unknown as {
          updateEmailTemplate: (
            id: bigint,
            subject: string,
            body: string,
            fallbackSubject: string,
            fallbackBody: string,
          ) => Promise<unknown>;
        }
      ).updateEmailTemplate(
        BigInt(template.id),
        template.subject,
        template.body,
        template.fallbackSubject,
        template.fallbackBody,
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
    onError: () => showToast("Save failed. Please try again."),
  });

  const templates: EmailTemplate[] =
    (templatesQuery.data as EmailTemplate[] | undefined) ?? DEFAULT_TEMPLATES;

  const selected =
    selectedId != null
      ? (drafts[selectedId] ??
        templates.find((t) => t.id === selectedId) ??
        null)
      : null;

  const isDirty = selectedId != null && !!drafts[selectedId];

  function patchDraft(patch: Partial<EmailTemplate>) {
    if (!selectedId || !selected) return;
    setDrafts((prev) => ({ ...prev, [selectedId]: { ...selected, ...patch } }));
  }

  function handleInsert(field: string) {
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

  return (
    <div className="flex gap-0 min-h-[600px] relative">
      {/* Left sidebar */}
      <div className="w-52 shrink-0 bg-slate-900/60 border border-white/10 rounded-l-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Templates
            </span>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {(templatesQuery.isLoading ? DEFAULT_TEMPLATES : templates).map(
            (t) => {
              const hasDraft = !!drafts[t.id];
              const isActive = selectedId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  data-ocid={`email_templates.template.${t.dayNumber}`}
                  onClick={() => {
                    setSelectedId(t.id);
                    setPreviewMode(false);
                    setActiveTab("main");
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between gap-1 ${
                    isActive
                      ? "bg-blue-600/20 border-l-2 border-blue-500"
                      : "hover:bg-slate-800/50 border-l-2 border-transparent"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400">
                      Day {t.dayNumber}
                    </p>
                    <p className="text-sm text-white truncate leading-tight mt-0.5">
                      {t.name}
                    </p>
                    {hasDraft && (
                      <span className="text-xs text-amber-400 font-medium">
                        unsaved
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 border border-l-0 border-white/10 rounded-r-2xl bg-slate-950/40 backdrop-blur-sm flex flex-col overflow-hidden">
        {!selected ? (
          <div
            data-ocid="email_templates.empty_state"
            className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-10"
          >
            <FileText className="w-10 h-10 text-slate-600" />
            <p className="text-slate-400 text-sm">
              Select a template from the list to start editing
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                  Day {selected.dayNumber}
                </span>
                <h2 className="text-sm font-semibold text-white">
                  {selected.name}
                </h2>
                {isDirty && (
                  <span className="text-xs px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full">
                    Unsaved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-ocid="email_templates.preview_toggle"
                  onClick={() => setPreviewMode((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    previewMode
                      ? "bg-blue-600/30 border-blue-500/50 text-blue-300"
                      : "bg-slate-800 border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {previewMode ? "Edit" : "Preview"}
                </button>
                {isDirty && (
                  <button
                    type="button"
                    data-ocid="email_templates.revert_button"
                    onClick={handleRevert}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Revert
                  </button>
                )}
                <button
                  type="button"
                  data-ocid="email_templates.save_button"
                  onClick={() => saveMutation.mutate(selected)}
                  disabled={saveMutation.isPending || !isDirty}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {saveMutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* Main / Fallback tabs */}
            <div className="flex border-b border-white/10">
              {(["main", "fallback"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  data-ocid={`email_templates.${tab}_tab`}
                  onClick={() => {
                    setActiveTab(tab);
                    setPreviewMode(false);
                  }}
                  className={`px-5 py-2.5 text-xs font-semibold capitalize transition-colors border-b-2 ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab === "main" ? "Main Template" : "Fallback Template"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {previewMode ? (
                <PreviewPane
                  subject={
                    activeTab === "main"
                      ? selected.subject
                      : selected.fallbackSubject
                  }
                  body={
                    activeTab === "main" ? selected.body : selected.fallbackBody
                  }
                />
              ) : (
                <>
                  {/* Subject */}
                  <div>
                    <label
                      className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1"
                      htmlFor="email_templates_subject_input"
                    >
                      Subject Line
                    </label>
                    <input
                      type="text"
                      data-ocid="email_templates.subject_input"
                      value={
                        activeTab === "main"
                          ? selected.subject
                          : selected.fallbackSubject
                      }
                      onChange={(e) =>
                        patchDraft(
                          activeTab === "main"
                            ? { subject: e.target.value }
                            : { fallbackSubject: e.target.value },
                        )
                      }
                      className="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
                      placeholder="Enter subject line..."
                      id="email_templates_subject_input"
                    />
                  </div>

                  {/* Toolbar + body */}
                  <div>
                    <label
                      className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1"
                      htmlFor="email_templates_body_textarea"
                    >
                      Email Body
                    </label>
                    <div className="flex items-center gap-0.5 px-2 py-1 bg-slate-800/60 border border-b-0 border-white/10 rounded-t-lg">
                      <ToolbarButton
                        icon={Bold}
                        label="Bold"
                        onClick={() => {
                          const ref =
                            activeTab === "main"
                              ? mainBodyRef
                              : fallbackBodyRef;
                          const key =
                            activeTab === "main" ? "body" : "fallbackBody";
                          insertAtCursor(ref, "**bold text**", (v) =>
                            patchDraft({ [key]: v }),
                          );
                        }}
                      />
                      <ToolbarButton
                        icon={Italic}
                        label="Italic"
                        onClick={() => {
                          const ref =
                            activeTab === "main"
                              ? mainBodyRef
                              : fallbackBodyRef;
                          const key =
                            activeTab === "main" ? "body" : "fallbackBody";
                          insertAtCursor(ref, "_italic text_", (v) =>
                            patchDraft({ [key]: v }),
                          );
                        }}
                      />
                      <ToolbarButton
                        icon={Link}
                        label="Insert Link"
                        onClick={() => {
                          const ref =
                            activeTab === "main"
                              ? mainBodyRef
                              : fallbackBodyRef;
                          const key =
                            activeTab === "main" ? "body" : "fallbackBody";
                          const url = window.prompt("Enter URL:");
                          if (url)
                            insertAtCursor(ref, url, (v) =>
                              patchDraft({ [key]: v }),
                            );
                        }}
                      />
                    </div>
                    <textarea
                      ref={activeTab === "main" ? mainBodyRef : fallbackBodyRef}
                      data-ocid="email_templates.body_textarea"
                      value={
                        activeTab === "main"
                          ? selected.body
                          : selected.fallbackBody
                      }
                      onChange={(e) =>
                        patchDraft(
                          activeTab === "main"
                            ? { body: e.target.value }
                            : { fallbackBody: e.target.value },
                        )
                      }
                      rows={14}
                      className="w-full bg-slate-800/60 border border-white/10 rounded-b-lg px-3 py-3 text-sm text-white placeholder-slate-500 font-mono leading-relaxed focus:outline-none focus:border-blue-500/60 transition-colors resize-y"
                      placeholder="Write your email body here..."
                      id="email_templates_body_textarea"
                    />
                  </div>

                  <MergeFieldPanel onInsert={handleInsert} />
                </>
              )}
            </div>
          </>
        )}

        {/* Loading overlay */}
        {templatesQuery.isLoading && (
          <div
            data-ocid="email_templates.loading_state"
            className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-r-2xl"
          >
            <div className="flex items-center gap-2 text-slate-300">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading templates...</span>
            </div>
          </div>
        )}

        {/* Save error */}
        {saveMutation.isError && (
          <div
            data-ocid="email_templates.error_state"
            className="mx-5 mb-4 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">
              Save failed. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          data-ocid="email_templates.toast"
          className="fixed bottom-6 right-6 bg-slate-800 border border-white/10 text-white px-5 py-3 rounded-xl shadow-xl text-sm z-50"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
