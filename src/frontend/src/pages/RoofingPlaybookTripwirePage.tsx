import {
  ArrowRight,
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
} from "lucide-react";
import { useMemo, useState } from "react";

interface CaptureResponse {
  ok?: boolean;
  error?: string;
  ebookStatus?: "delivered" | "pending" | "failed";
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
    eyebrow: "Free roofing reputation playbook",
    title: "Turn completed roofing jobs into the reviews that win the next job.",
    lead: "Learn how to request reviews at the right moment, respond professionally, and turn reputation growth into more booked inspections.",
  },
  maps: {
    eyebrow: "Free local visibility playbook",
    title: "Help more homeowners find your roofing company before they find a competitor.",
    lead: "Learn the practical systems behind stronger local visibility, better conversion, and more consistent follow-up from search to inspection.",
  },
  "missed-calls": {
    eyebrow: "Free missed-call recovery playbook",
    title: "Stop sending high-intent roofing leads to voicemail and hoping they call back.",
    lead: "Learn how modern roofing companies answer faster, qualify opportunities, and follow up automatically without adding office overhead.",
  },
  storm: {
    eyebrow: "Free storm-response playbook",
    title: "Build a roofing response system that is ready when the next storm creates demand.",
    lead: "Learn how to capture incoming opportunities, organize follow-up, and protect your team from lead chaos during high-volume periods.",
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
    body: "Understand the signals that help homeowners discover and trust a roofing company locally.",
  },
  {
    icon: Star,
    title: "Turn good work into reputation growth",
    body: "Ask for reviews at the right time and make professional responses part of the operating system.",
  },
  {
    icon: Gauge,
    title: "Know where revenue is leaking",
    body: "Track calls, inspections, estimates, follow-up, and outcomes instead of relying on disconnected tools.",
  },
  {
    icon: ShieldCheck,
    title: "Build a company ready to scale",
    body: "Organize the operational and financial foundation behind trucks, crews, equipment, and growth.",
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
      ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "angle"].includes(
        key,
      ),
    ),
  );
  return { angle, utm };
}

export default function RoofingPlaybookTripwirePage() {
  const campaign = useMemo(getCampaignContext, []);
  const angle = ANGLE_CONTENT[campaign.angle] || {
    eyebrow: "Free roofer AI growth playbook",
    title: "The practical roofing growth system for getting booked, ranked, and ready to scale.",
    lead: "See how to capture more opportunities, improve follow-up, strengthen local trust, and build one connected operating system around your roofing company.",
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
    if (!form.firstName.trim() || !form.businessName.trim() || !form.email.includes("@")) {
      setError("Enter your first name, roofing company, and a valid email address.");
      return;
    }
    if (!form.consentMarketing) {
      setError("Please confirm that we may send the playbook and related follow-up.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/capture-roofing-playbook-lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          utm: campaign.utm,
        }),
      });
      const payload = (await response.json()) as CaptureResponse;
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "We could not send the playbook.");
      }
      setResult(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send the playbook.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06101d] text-white selection:bg-amber-300 selection:text-slate-950">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#06101d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="font-display text-sm font-black tracking-[0.16em] sm:text-base">
            BOOKED <span className="text-amber-300">RANKED</span> FUNDABLE
          </a>
          <a
            href="/roofing"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/80 transition hover:border-amber-300/60 hover:text-white"
          >
            Explore the Roofing System
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_12%_18%,rgba(251,191,36,0.16),transparent_25%),linear-gradient(180deg,#06101d,#09182a)]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:py-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
                <Sparkles size={14} />
                {angle.eyebrow}
              </div>
              <h1 className="mt-7 max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {angle.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                {angle.lead}
              </p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-200">
                {["Written specifically for roofers", "Practical systems, not AI hype", "Includes a personalized next step"].map(
                  (item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <CheckCircle2 size={17} className="text-emerald-300" />
                      {item}
                    </span>
                  ),
                )}
              </div>
              <a
                href="#get-playbook"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-4 text-base font-black text-slate-950 shadow-2xl shadow-amber-500/20 transition hover:-translate-y-0.5"
              >
                Get the Free Playbook <ArrowRight size={19} />
              </a>
            </div>

            <div className="relative mx-auto w-full max-w-lg py-8">
              <div className="absolute inset-10 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="relative mx-auto w-[76%] max-w-[350px] -rotate-2 rounded-r-2xl rounded-l-md border border-white/25 bg-gradient-to-br from-[#153a5e] via-[#0b2038] to-[#07111f] p-8 shadow-[0_40px_90px_rgba(0,0,0,.6)] transition duration-500 hover:rotate-0">
                <div className="absolute inset-y-2 -left-3 w-4 rounded-l-md bg-gradient-to-r from-stone-300 to-amber-50" />
                <div className="flex h-[430px] flex-col justify-between border border-white/10 p-6">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                      Free Roofing Growth Guide
                    </div>
                    <BookOpen className="mt-8 h-12 w-12 text-sky-300" />
                    <h2 className="mt-6 font-display text-3xl font-black leading-tight">
                      The Roofer AI Growth Playbook
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-slate-300">
                      How to capture opportunities, strengthen local trust, and build a connected follow-up system.
                    </p>
                  </div>
                  <div className="border-t border-white/15 pt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/65">
                    Booked · Ranked · Fundable
                  </div>
                </div>
              </div>
              <div className="absolute right-0 top-10 rounded-2xl border border-white/15 bg-[#0a1b2e]/90 p-4 shadow-xl backdrop-blur">
                <strong className="block text-lg text-amber-300">6 systems</strong>
                <span className="text-xs text-slate-400">built for roofing growth</span>
              </div>
              <div className="absolute bottom-4 left-0 rounded-2xl border border-white/15 bg-[#0a1b2e]/90 p-4 shadow-xl backdrop-blur">
                <strong className="block text-lg text-emerald-300">No fluff</strong>
                <span className="text-xs text-slate-400">clear operating steps</span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-white/[0.025] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Inside the playbook</p>
              <h2 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">
                Six systems that make roofing marketing easier to convert.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-400">
                The guide connects lead response, follow-up, local visibility, reputation, reporting, and growth readiness into one practical framework.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {CHAPTERS.map(({ icon: Icon, title, body }, index) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-400/10 text-sky-300">
                      <Icon size={21} />
                    </div>
                    <span className="text-xs font-black tracking-[0.14em] text-white/30">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="get-playbook" className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-3xl border border-sky-300/20 bg-gradient-to-br from-sky-400/10 to-transparent p-7 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Included at no cost</p>
              <h2 className="mt-4 font-display text-3xl font-black tracking-tight">
                Get the playbook and a clear next step for your roofing company.
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                After requesting the guide, you can launch a roofing-specific BRF demo that shows how the operating system handles lead response, follow-up, reviews, and local growth.
              </p>
              <div className="mt-7 space-y-4">
                {[
                  "Immediate playbook delivery when email delivery is configured",
                  "Campaign-aware recommendations based on the page you visited",
                  "Optional personalized roofing demo after download",
                  "No credit card and no guarantee-based sales claims",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-slate-200">
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <Check size={14} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b1d31] p-7 shadow-2xl sm:p-9">
              {result ? (
                <div className="flex min-h-[430px] flex-col justify-center text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 size={34} />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-black">Your playbook is ready.</h2>
                  <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-400">
                    {result.ebookStatus === "delivered"
                      ? "We sent the playbook to your inbox. You can also continue into the roofing demo now."
                      : "Your request was saved. Check your inbox for delivery, then continue into the roofing demo."}
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    {result.pdfUrl && (
                      <a
                        href={result.pdfUrl}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-4 font-black text-slate-950"
                      >
                        <Download size={18} /> Download Playbook
                      </a>
                    )}
                    <a
                      href={result.demoUrl || "/demo?niche=roofing&source=roofing-playbook"}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-300/35 bg-sky-400/10 px-6 py-4 font-black text-sky-100"
                    >
                      Launch Roofing Demo <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-300/10 text-amber-300">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Free access</p>
                      <h2 className="text-2xl font-black">Send me the Roofer AI Playbook</h2>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                      First name
                      <input
                        value={form.firstName}
                        onChange={(event) => set("firstName", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10"
                        placeholder="Jordan"
                      />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                      Roofing company
                      <input
                        value={form.businessName}
                        onChange={(event) => set("businessName", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10"
                        placeholder="Summit Roofing"
                      />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400 sm:col-span-2">
                      Work email
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => set("email", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10"
                        placeholder="jordan@summitroofing.com"
                      />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-400 sm:col-span-2">
                      Website <span className="normal-case tracking-normal text-white/30">(optional)</span>
                      <input
                        value={form.website}
                        onChange={(event) => set("website", event.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3.5 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-sky-300/60 focus:ring-4 focus:ring-sky-300/10"
                        placeholder="summitroofing.com"
                      />
                    </label>
                  </div>

                  <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-400">
                    <input
                      type="checkbox"
                      checked={form.consentMarketing}
                      onChange={(event) => set("consentMarketing", event.target.checked)}
                      className="mt-1 h-4 w-4 accent-amber-300"
                    />
                    I agree to receive the playbook and related roofing growth follow-up. I can unsubscribe at any time.
                  </label>

                  {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}

                  <button
                    type="button"
                    onClick={submit}
                    disabled={isSubmitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-4 text-base font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending your playbook…" : "Get My Free Playbook"}
                    {!isSubmitting && <ArrowRight size={19} />}
                  </button>
                  <p className="mt-3 text-center text-[11px] leading-5 text-white/35">
                    Educational material only. Results depend on market, execution, offer, and operating conditions.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.025] py-20">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <Search className="mx-auto h-10 w-10 text-sky-300" />
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-black tracking-tight sm:text-5xl">
              The playbook explains the system. The roofing demo shows it working.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              See a clear path from an incoming homeowner inquiry to a booked inspection, organized follow-up, reputation growth, and measurable pipeline activity.
            </p>
            <a
              href="/demo?niche=roofing&source=roofing-playbook-footer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-sky-300/35 bg-sky-400/10 px-7 py-4 font-black text-sky-100"
            >
              Preview the Roofing Demo <ArrowRight size={19} />
            </a>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 text-center text-xs text-white/35">
        © {new Date().getFullYear()} Booked Ranked Fundable. Roofing growth education and software demonstration.
      </footer>
    </div>
  );
}
