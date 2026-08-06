import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";

interface RoofingPlaybookAuditOfferProps {
  source: "homepage" | "roofing-landing";
}

const BENEFITS = [
  {
    icon: BookOpen,
    title: "The Roofer AI Growth Playbook",
    body: "A practical guide to missed-call recovery, estimate follow-up, reputation growth, local visibility, and operating readiness.",
  },
  {
    icon: Search,
    title: "A personalized roofing website audit",
    body: "A rapid review of your homepage messaging, lead capture, trust signals, mobile basics, and conversion opportunities.",
  },
  {
    icon: ShieldCheck,
    title: "A prioritized action list",
    body: "Clear strengths, issues, and quick wins based on observable website evidence—not invented rankings or guaranteed outcomes.",
  },
  {
    icon: Mail,
    title: "Both delivered by email",
    body: "The playbook arrives first. Your personalized audit follows in a separate email after the website review is complete.",
  },
];

export default function RoofingPlaybookAuditOffer({
  source,
}: RoofingPlaybookAuditOfferProps) {
  const href = `/roofing-ai-growth-playbook?utm_source=${source}&utm_medium=website&utm_campaign=roofing_playbook_audit`;

  return (
    <section
      data-ocid={`roofing_playbook_audit.${source}.section`}
      className="relative overflow-hidden border-y border-white/10 bg-[#071426] px-5 py-20 text-white sm:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(251,191,36,0.14),transparent_26%),radial-gradient(circle_at_88%_20%,rgba(56,189,248,0.15),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
              <BookOpen size={14} />
              Free roofing growth package
            </div>
            <h2 className="mt-6 max-w-2xl font-display text-3xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
              Get the Free Roofer AI Playbook and a Personalized Website Audit.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              See what a stronger roofing growth system looks like, then get a
              rapid audit showing where your own website may be helping or
              hurting lead conversion.
            </p>
            <a
              href={href}
              data-ocid={`roofing_playbook_audit.${source}.primary_button`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-4 text-base font-black text-slate-950 shadow-xl shadow-amber-500/20 transition hover:-translate-y-0.5"
            >
              Get My Free Playbook + Audit <ArrowRight size={19} />
            </a>
            <p className="mt-3 text-xs leading-5 text-white/40">
              No credit card. The audit is a rapid homepage review based on
              observable evidence and is not a guarantee of rankings, leads,
              financing, or revenue.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-400/10 text-sky-300">
                  <Icon size={21} />
                </div>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.055] px-5 py-4 text-sm text-slate-200">
          {[
            "Playbook emailed",
            "Website audited",
            "Quick wins prioritized",
            "Audit emailed separately",
          ].map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-300" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
