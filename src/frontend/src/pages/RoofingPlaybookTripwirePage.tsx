import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Download,
  Gauge,
  MapPin,
  MessageSquareText,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";

interface CaptureResponse {
  ok?: boolean;
  error?: string;
  ebookStatus?: "delivered" | "pending" | "failed";
  auditStatus?: "queued" | "failed";
  pdfUrl?: string | null;
  demoUrl?: string;
}

interface FormState {
  firstName: string;
  businessName: string;
  email: string;
  website: string;
  consentMarketing: boolean;
}

const ANGLE_CONTENT: Record<
  string,
  { eyebrow: string; title: string; lead: string }
> = {
  reviews: {
    eyebrow: "Free roofing reputation blueprint",
    title: "Turn completed roofing jobs into the reviews that help win the next job.",
    lead: "Get Dave Reeves' roofing AI book plus a personalized website audit showing practical opportunities across trust, follow-up, and conversion.",
  },
  maps: {
    eyebrow: "Free local visibility blueprint",
    title: "Help more homeowners find and trust your roofing company locally.",
    lead: "Get the roofing AI book plus a personalized homepage audit covering visible local signals, conversion paths, and practical next steps.",
  },
  "missed-calls": {
    eyebrow: "Free missed-call recovery blueprint",
    title: "Stop sending high-intent roofing opportunities to voicemail and hoping they call back.",
    lead: "Get the roofing AI book plus a personalized audit of the website and response system homeowners see before they ever speak with your team.",
  },
  storm: {
    eyebrow: "Free storm-response blueprint",
    title: "Build a roofing response system that is ready when storm demand spikes.",
    lead: "Get the roofing AI book plus a personalized audit showing how your current website handles trust, lead capture, and high-intent opportunities.",
  },
};

const CHAPTERS = [
  {
    icon: PhoneCall,
    title: "Capture every serious opportunity",
    body: "Build a response process for missed calls, after-hours inquiries, and sudden storm demand.",
  },
  {
    icon: MessageSquareText,
    title: "Follow up without chasing manually",
    body: "Create a consistent path from first inquiry to inspection, estimate, and final decision.",
  },
  {
    icon: MapPin,
    title: "Strengthen local visibility",
    body: "Understand the visible signals that help homeowners discover and trust a roofing company locally.",
  },
  {
    icon: Star,
    title: "Turn good work into reputation growth",
    body: "Ask for reviews at the right time and make professional responses part of the operating system.",
  },
  {
    icon: Gauge,
    title: "Know where opportunity is leaking",
    body: "Track calls, inspections, estimates, follow-up, and outcomes instead of relying on disconnected tools.",
  },
  {
    icon: ShieldCheck,
    title: "Build a company ready to scale",
    body: "Organize the operating and financial foundation behind trucks, crews, equipment, and responsible growth.",
  },
];

const AUDIT_ITEMS = [
  ["Homepage clarity", "Review"],
  ["Mobile call path", "Check"],
  ["Trust signals", "Review"],
  ["Lead form friction", "Priority"],
  ["Local visibility basics", "Check"],
  ["Conversion quick wins", "Action"],
] as const;

const FAQS = [
  {
    question: "Is the book really free?",
    answer:
      "Yes. The roofing AI book is offered as a free educational resource. No credit card is required to request it.",
  },
  {
    question: "What does the personalized audit review?",
    answer:
      "The rapid audit reviews observable homepage evidence such as messaging clarity, mobile contact paths, visible trust signals, lead capture, title and metadata basics, and practical conversion opportunities.",
  },
  {
    question: "Is the audit a full SEO or technical certification?",
    answer:
      "No. It is a focused homepage growth review, not a full SEO, accessibility, security, legal, or performance certification, and it does not guarantee rankings, leads, financing, or revenue.",
  },
  {
    question: "What happens after I submit?",
    answer:
      "Your request is saved, the book delivery is started, and your submitted website is queued for the personalized audit. You can also continue into the roofing demo.",
  },
];

function getCampaignContext() {
  if (typeof window === "undefined") {
    return { angle: "default", utm: {} as Record<string, string> };
  }
  const params = new URLSearchParams(window.location.search);
  const angle = params.get("angle") || "default";
  const utm = Object.fromEntries(
    [...params.entries()].filter(([key]) =>
      [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "angle",
      ].includes(key),
    ),
  );
  return { angle, utm };
}

export default function RoofingPlaybookTripwirePage() {
  const campaign = useMemo(getCampaignContext, []);
  const angle = ANGLE_CONTENT[campaign.angle] || {
    eyebrow: "Free roofing AI book + personalized audit",
    title: "The roofing playbook for contractors ready to win in the AI era.",
    lead: "Get Dave Reeves' Roofing Contractors: How to Thrive and Survive in the AI Revolution plus a personalized website audit showing what your roofing company can improve next.",
  };

  const [form, setForm] = useState<FormState>({
    firstName: "",
    businessName: "",
    email: "",
    website: "",
    consentMarketing: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CaptureResponse | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    setError("");
    if (
      !form.firstName.trim() ||
      !form.businessName.trim() ||
      !form.email.includes("@") ||
      !form.website.trim()
    ) {
      setError(
        "Enter your first name, roofing company, a valid email address, and your website so we can prepare the audit.",
      );
      return;
    }
    if (!form.consentMarketing) {
      setError(
        "Please confirm that we may send the book, website audit, and related roofing follow-up.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/capture-roofing-playbook-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, utm: campaign.utm }),
      });
      const payload = (await response.json()) as CaptureResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "We could not send the roofing book.");
      }
      setResult(payload);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We could not send the roofing book.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06101d] text-white selection:bg-amber-300 selection:text-slate-950">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06101d]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="font-display text-sm font-black tracking-[0.14em] sm:text-base">
            BOOKED <span className="text-amber-300">RANKED</span> FUNDABLE
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/roofing"
              className="hidden rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/75 transition hover:border-sky-300/50 hover:text-white sm:inline-flex"
            >
              Roofing System
            </a>
            <a
              href="#get-book"
              className="rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-amber-200"
            >
              Get the Free Book
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(56,189,248,.20),transparent_27%),radial-gradient(circle_at_12%_15%,rgba(251,191,36,.17),transparent_25%),linear-gradient(180deg,#06101d,#09182a)]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                <Sparkles size={14} />
                {angle.eyebrow}
              </div>
              <h1 className="mt-7 max-w-3xl font-display text-4xl font-black leading-[1.01] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {angle.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                {angle.lead}
              </p>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-200">
                {[
                  "Written specifically for roofing contractors",
                  "Personalized website audit included",
                  "No credit card required",
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-emerald-300" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#get-book"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-4 text-base font-black text-slate-950 shadow-2xl shadow-amber-500/20 transition hover:-translate-y-0.5"
                >
                  Get My Free Book + Audit <ArrowRight size={19} />
                </a>
                <a
                  href="/demo?niche=roofing&source=roofing-book-hero"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300/30 bg-sky-300/10 px-7 py-4 text-sm font-black text-sky-100"
                >
                  Preview the Roofing Demo
                </a>
              </div>
            </div>

            <div className="relative mx-auto min-h-[540px] w-full max-w-lg">
              <div className="absolute inset-16 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="absolute inset-x-[13%] top-10 z-10 origin-bottom -rotate-3 rounded-r-[1.7rem] rounded-l-md border border-white/25 bg-gradient-to-br from-[#0e528a] via-[#0b3459] to-[#07111f] p-7 shadow-[0_45px_100px_rgba(0,0,0,.65)] transition duration-500 hover:rotate-0">
                <div className="absolute inset-y-2 -left-3 w-4 rounded-l-md bg-gradient-to-r from-stone-300 to-amber-50" />
                <div className="relative flex min-h-[400px] flex-col justify-between overflow-hidden border border-white/10 p-6">
                  <div className="absolute -bottom-16 -right-24 h-52 w-80 rotate-[-15deg] bg-gradient-to-br from-amber-500/70 via-orange-600/65 to-emerald-900/70" />
                  <div className="relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.21em] text-sky-200">
                      Roofing Contractors
                    </div>
                    <h2 className="mt-6 font-display text-[2rem] font-black leading-[1.03] tracking-[-0.04em]">
                      How to Thrive and Survive in the <span className="text-amber-300">AI Revolution</span>
                    </h2>
                    <p className="mt-5 max-w-[230px] text-sm leading-6 text-slate-200">
                      A practical guide for roofing contractors building a stronger lead, reputation, automation, and growth system.
                    </p>
                  </div>
                  <div className="relative z-10 border-t border-white/15 pt-5">
                    <div className="text-xs font-black uppercase tracking-[0.15em] text-white">Dave Reeves</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/50">Free digital edition</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 top-16 z-20 rounded-2xl border border-white/15 bg-[#0a1b2e]/90 p-4 shadow-xl backdrop-blur">
                <strong className="block text-lg text-amber-300">Free book</strong>
                <span className="text-xs text-slate-400">roofing-specific</span>
              </div>
              <div className="absolute bottom-10 left-0 z-20 rounded-2xl border border-white/15 bg-[#0a1b2e]/90 p-4 shadow-xl backdrop-blur">
                <strong className="block text-lg text-emerald-300">+ Website audit</strong>
                <span className="text-xs text-slate-400">personalized to your site</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.025]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:grid-cols-4 sm:px-8">
            {[
              ["Roofing-specific", "not generic marketing advice"],
              ["AI-ready", "response and follow-up systems"],
              ["Evidence-based", "personalized homepage review"],
              ["Actionable", "prioritized next steps"],
            ].map(([title, body]) => (
              <div key={title} className="border-b border-white/10 px-4 py-6 text-center even:border-l sm:border-b-0 sm:border-l sm:first:border-l-0">
                <strong className="block text-sm font-black text-white">{title}</strong>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{body}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Inside the book</p>
              <h2 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
                Six systems that help roofing companies operate with less leakage and more clarity.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-400">
                The book connects lead response, follow-up, local visibility, reputation, measurement, and growth readiness into one practical framework.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {CHAPTERS.map(({ icon: Icon, title, body }, index) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-6">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-400/10 text-sky-300"><Icon size={21} /></div>
                    <span className="text-xs font-black tracking-[0.14em] text-white/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#081625] py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Your personalized audit</p>
              <h2 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
                The book explains the system. The audit shows what your own website needs next.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-400">
                Submit your roofing website and receive a rapid, evidence-based review of the public homepage along with prioritized practical improvements.
              </p>
              <div className="mt-7 space-y-3">
                {["Messaging and offer clarity", "Mobile call and contact path", "Visible trust and reputation signals", "Lead-form friction", "Local visibility basics", "Practical conversion quick wins"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-300" />{item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0b1d31] p-6 shadow-2xl sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">Sample audit layout</p>
                  <h3 className="mt-2 text-2xl font-black">Roofing Homepage Review</h3>
                </div>
                <BarChart3 className="text-sky-300" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {AUDIT_ITEMS.map(([label, status]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <strong className="text-sm text-white">{status}</strong>
                      <Target size={15} className="text-amber-300" />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-slate-500">
                Illustrative layout only. Your audit is generated from the website you submit and does not invent rankings, traffic, leads, reviews, financing results, or revenue.
              </p>
            </div>
          </div>
        </section>

        <section id="get-book" className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[.86fr_1.14fr]">
            <div className="rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 via-sky-300/5 to-transparent p-7 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Free roofing growth package</p>
              <h2 className="mt-4 font-display text-3xl font-black tracking-tight">
                Get the book and the personalized roofing website audit together.
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                One request starts both. We save your lead information, start book delivery, and queue the public website you submit for a focused homepage review.
              </p>
              <div className="mt-7 space-y-4">
                {[
                  "Roofing Contractors: How to Thrive and Survive in the AI Revolution",
                  "Personalized rapid homepage audit",
                  "Prioritized strengths, issues, and practical quick wins",
                  "Optional roofing product demo after submission",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-slate-200">
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><Check size={14} /></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1d31] p-7 shadow-2xl sm:p-9">
              {result ? (
                <div className="flex min-h-[450px] flex-col justify-center text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckCircle2 size={34} /></div>
                  <h2 className="mt-6 font-display text-3xl font-black">Your book request is in. Your audit is underway.</h2>
                  <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-400">
                    {result.ebookStatus === "delivered"
                      ? "We started your book delivery and your personalized roofing website audit. The audit is sent separately after the review completes."
                      : "Your request was saved and your website audit was queued. Watch your inbox for the book delivery and the separate audit follow-up."}
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    {result.pdfUrl && (
                      <a href={result.pdfUrl} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-4 font-black text-slate-950">
                        <Download size={18} /> Download Book
                      </a>
                    )}
                    <a href={result.demoUrl || "/demo?niche=roofing&source=roofing-book"} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300/35 bg-sky-400/10 px-6 py-4 font-black text-sky-100">
                      Launch Roofing Demo <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-300/10 text-amber-300"><BookOpen size={22} /></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Free access</p>
                      <h2 className="text-2xl font-black">Send Me the Book + Website Audit</h2>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                      First name
                      <input value={form.firstName} onChange={(event) => set("firstName", event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10" placeholder="Jordan" />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                      Roofing company
                      <input value={form.businessName} onChange={(event) => set("businessName", event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10" placeholder="Summit Roofing" />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400 sm:col-span-2">
                      Work email
                      <input type="email" value={form.email} onChange={(event) => set("email", event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10" placeholder="jordan@summitroofing.com" />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400 sm:col-span-2">
                      Roofing website
                      <input value={form.website} onChange={(event) => set("website", event.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10" placeholder="summitroofing.com" />
                    </label>
                  </div>

                  <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-400">
                    <input type="checkbox" checked={form.consentMarketing} onChange={(event) => set("consentMarketing", event.target.checked)} className="mt-1 h-4 w-4 accent-amber-300" />
                    I agree to receive the free roofing book, personalized website audit, and related roofing growth follow-up. I can unsubscribe at any time.
                  </label>

                  {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

                  <button type="button" onClick={submit} disabled={isSubmitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-4 text-base font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
                    {isSubmitting ? "Starting your book and audit…" : "Get My Free Roofing Book + Audit"}
                    {!isSubmitting && <ArrowRight size={19} />}
                  </button>
                  <p className="mt-3 text-center text-[11px] leading-5 text-white/35">
                    No credit card. The audit is a rapid homepage review based on observable evidence and is not a guarantee of rankings, leads, financing, or revenue.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">What happens next</p>
              <h2 className="mt-4 font-display text-3xl font-black sm:text-5xl">One request. A clear five-step path.</h2>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-5">
              {[
                ["01", "Request", "Send your contact details and roofing website."],
                ["02", "Book", "Your free roofing AI book delivery is started."],
                ["03", "Review", "Your public homepage enters the audit workflow."],
                ["04", "Audit", "You receive prioritized findings and quick wins."],
                ["05", "Demo", "See how the BRF roofing workflow connects the pieces."],
              ].map(([number, title, body]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center">
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-amber-300/10 text-xs font-black text-amber-300">{number}</div>
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">FAQ</p>
              <h2 className="mt-4 font-display text-3xl font-black sm:text-5xl">Before you request your copy.</h2>
            </div>
            <div className="mt-10 space-y-4">
              {FAQS.map(({ question, answer }) => (
                <details key={question} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 open:bg-white/[0.05]">
                  <summary className="cursor-pointer list-none font-bold text-white">{question}</summary>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#081625] px-5 py-20 text-center sm:px-8">
          <Search className="mx-auto h-10 w-10 text-sky-300" />
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-black tracking-tight sm:text-5xl">
            Stop guessing what to fix first. Start with the book, then see your own website through the audit.
          </h2>
          <a href="#get-book" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-4 font-black text-slate-950">
            Get the Free Roofing Book + Audit <ArrowRight size={19} />
          </a>
        </section>
      </main>

      <footer className="px-5 py-8 text-center text-xs text-white/35">
        © {new Date().getFullYear()} Booked Ranked Fundable. Roofing growth education and software demonstration.
      </footer>
    </div>
  );
}
