import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

interface RoofingPlaybookAuditOfferProps {
  source: "homepage" | "roofing-landing";
}

const BENEFITS = [
  {
    icon: BookOpen,
    title: "Roofer AI Growth Playbook",
    body: "A practical operating guide for missed-call recovery, estimate follow-up, reviews, local visibility, and growth readiness.",
  },
  {
    icon: Search,
    title: "Personalized Website Audit",
    body: "A rapid review of your actual homepage messaging, trust signals, mobile conversion, and lead-capture path.",
  },
  {
    icon: Target,
    title: "Prioritized Quick Wins",
    body: "A clear list of strengths, issues, and practical improvements based on observable website evidence.",
  },
  {
    icon: Mail,
    title: "Delivered to Your Inbox",
    body: "The playbook arrives first. Your personalized audit follows separately after the review is complete.",
  },
];

const AUDIT_ROWS = [
  ["Homepage clarity", "Needs attention", "amber"],
  ["Mobile call path", "Verified", "emerald"],
  ["Trust signals", "Opportunity", "sky"],
  ["Lead form friction", "Priority", "rose"],
] as const;

export default function RoofingPlaybookAuditOffer({
  source,
}: RoofingPlaybookAuditOfferProps) {
  const href = `/roofing-ai-growth-playbook?utm_source=${source}&utm_medium=website&utm_campaign=roofing_playbook_audit`;

  return (
    <section
      data-ocid={`roofing_playbook_audit.${source}.section`}
      className="relative overflow-hidden border-y border-white/10 bg-[#050d18] px-5 py-24 text-white sm:px-8"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(9,30,52,.95),rgba(5,13,24,.98)),radial-gradient(circle_at_15%_12%,rgba(251,191,36,.22),transparent_24%),radial-gradient(circle_at_86%_18%,rgba(56,189,248,.20),transparent_26%)]" />
      <div className="absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.17em] text-amber-200">
            <Sparkles size={14} />
            Free roofing growth package
          </div>
          <h2 className="mt-6 font-display text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            See the system. Then see what your own roofing website needs next.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Get the Free Roofer AI Growth Playbook plus a personalized homepage audit showing where your current website may be helping—or costing—you roofing opportunities.
          </p>
        </div>

        <div className="mt-14 grid gap-7 lg:grid-cols-[1fr_1.08fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-gradient-to-br from-[#153a5e] via-[#0b2038] to-[#07111f] p-7 shadow-[0_35px_90px_rgba(0,0,0,.45)] sm:p-9">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="relative grid gap-8 sm:grid-cols-[.82fr_1.18fr] sm:items-center">
              <div className="mx-auto w-full max-w-[240px] -rotate-2 rounded-r-2xl rounded-l-md border border-white/25 bg-gradient-to-br from-[#173f68] to-[#06101d] p-5 shadow-2xl">
                <div className="absolute inset-y-3 -left-2 w-3 rounded-l-md bg-gradient-to-r from-stone-300 to-amber-50" />
                <div className="flex min-h-[325px] flex-col justify-between border border-white/10 p-5">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                      Free Roofing Growth Guide
                    </div>
                    <BookOpen className="mt-7 h-10 w-10 text-sky-300" />
                    <h3 className="mt-5 font-display text-2xl font-black leading-tight">
                      The Roofer AI Growth Playbook
                    </h3>
                    <p className="mt-3 text-xs leading-5 text-slate-300">
                      Six connected systems for lead response, follow-up, reviews, visibility, reporting, and scale.
                    </p>
                  </div>
                  <div className="border-t border-white/15 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                    Booked · Ranked · Fundable
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                  What you receive first
                </p>
                <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                  A roofing growth operating guide you can actually use.
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  The playbook shows how a roofing company can connect inbound calls, inspections, estimates, reputation, local visibility, and funding readiness into one clear operating rhythm.
                </p>
                <div className="mt-6 space-y-3">
                  {["Missed-call recovery", "Estimate follow-up", "Review growth", "Local visibility", "Pipeline measurement", "Growth readiness"].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                        <CheckCircle2 size={16} className="text-emerald-300" />
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#0b1727] p-7 shadow-[0_35px_90px_rgba(0,0,0,.45)] sm:p-9">
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    Personalized audit preview
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Summit Roofing Homepage Review</h3>
                </div>
                <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-200">
                  Evidence-based
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-[.78fr_1.22fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">Audit scorecard</span>
                    <BarChart3 size={18} className="text-sky-300" />
                  </div>
                  <div className="mt-5 text-5xl font-black tracking-[-0.06em] text-white">4</div>
                  <div className="mt-1 text-xs text-slate-400">priority opportunities identified</div>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-sky-400 to-emerald-300" />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    Illustrative layout. Your report is generated from your submitted website.
                  </p>
                </div>

                <div className="space-y-3">
                  {AUDIT_ROWS.map(([label, status, tone]) => (
                    <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="text-sm font-semibold text-slate-200">{label}</span>
                      <span
                        className={
                          tone === "emerald"
                            ? "text-xs font-bold text-emerald-300"
                            : tone === "rose"
                              ? "text-xs font-bold text-rose-300"
                              : tone === "sky"
                                ? "text-xs font-bold text-sky-300"
                                : "text-xs font-bold text-amber-300"
                        }
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-300/15 bg-sky-300/[0.055] p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                  <div>
                    <strong className="text-sm">What the audit covers</strong>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Homepage clarity, mobile call path, lead-form friction, visible trust signals, title and metadata basics, and practical conversion quick wins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-400/10 text-sky-300">
                <Icon size={19} />
              </div>
              <h3 className="mt-4 text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-amber-300/20 bg-gradient-to-r from-amber-300/10 via-white/[0.04] to-sky-300/10 p-6 text-center sm:p-8">
          <h3 className="font-display text-2xl font-black sm:text-3xl">
            Get both deliverables free. Use the audit to decide what to fix first.
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            No credit card. No invented rankings. No guaranteed lead or revenue claims—just a useful roofing growth guide and an evidence-based review of the website you submit.
          </p>
          <a
            href={href}
            data-ocid={`roofing_playbook_audit.${source}.primary_button`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-4 text-base font-black text-slate-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-0.5"
          >
            Get My Free Playbook + Audit <ArrowRight size={19} />
          </a>
        </div>
      </div>
    </section>
  );
}
