import { Link } from "@tanstack/react-router";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "motion/react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Record<string, Testimonial[]> = {
  plumbing: [
    {
      name: "Mike R.",
      role: "Owner, Fast Flow Plumbing",
      quote:
        "Went from 3 calls a day to 12. The AI phone agent books jobs while I'm under a sink.",
    },
    {
      name: "James T.",
      role: "Owner, Reliable Rooter",
      quote:
        "First week I ran the audit, I found 4 things I was doing wrong. Fixed them in a day.",
    },
    {
      name: "Carlos M.",
      role: "Owner, Speedy Plumbers",
      quote:
        "Best investment I've made. My Google ranking went from page 4 to page 1 in 6 weeks.",
    },
  ],
  "med-spa": [
    {
      name: "Sarah L.",
      role: "Owner, Glow Medical Spa",
      quote:
        "My booking rate doubled in the first month. The AI receptionist never misses a lead.",
    },
    {
      name: "Jessica K.",
      role: "Owner, Serenity MedSpa",
      quote:
        "The social content alone saves me 10 hours a week. Every post gets engagement.",
    },
    {
      name: "Amber W.",
      role: "Owner, Radiance Aesthetics",
      quote:
        "I finally know exactly what's stopping new clients from booking. Game changer.",
    },
  ],
  hvac: [
    {
      name: "Tom B.",
      role: "Owner, Arctic Air HVAC",
      quote:
        "After-hours calls used to go to voicemail. Now they go to an AI that schedules the job.",
    },
    {
      name: "Dave S.",
      role: "Owner, Cool Comfort HVAC",
      quote:
        "The seasonal social posts keep us top-of-mind even during the slow months.",
    },
    {
      name: "Randy H.",
      role: "Owner, PrimeTemp HVAC",
      quote:
        "The audit showed me my Google profile was missing 6 things. Fixed it and got 3 jobs that week.",
    },
  ],
  restoration: [
    {
      name: "Brian K.",
      role: "Owner, Storm Shield Restoration",
      quote:
        "Emergency response used to mean missing calls at 2am. Now the AI agent handles it.",
    },
    {
      name: "Eddie M.",
      role: "Owner, Rapid Response Restoration",
      quote:
        "My competitors are faster on the phone now — but we're faster on the follow-up.",
    },
    {
      name: "Lisa C.",
      role: "Owner, PureClean Restoration",
      quote:
        "The scorecard showed me why insurance jobs kept going to another company. Fixed it in a week.",
    },
  ],
  "carpet-cleaning": [
    {
      name: "Tony D.",
      role: "Owner, Fresh Start Carpet Care",
      quote:
        "I posted the before/after photos the app generated and got 6 calls in one day.",
    },
    {
      name: "Maria G.",
      role: "Owner, Spotless Pro Cleaning",
      quote:
        "The booking agent schedules while I clean. I never lose a lead to voicemail anymore.",
    },
    {
      name: "Kevin L.",
      role: "Owner, Crystal Clean Carpets",
      quote:
        "Went from 2 Google reviews to 47 in 60 days. The review request flow is automatic.",
    },
  ],
  roofing: [
    {
      name: "Steve P.",
      role: "Owner, Peak Roofing Co",
      quote:
        "After the last hailstorm I had 22 qualified leads in my CRM by the next morning.",
    },
    {
      name: "Mark H.",
      role: "Owner, SkyLine Roofing",
      quote:
        "The estimate agent pre-qualifies storm leads so I only drive to real jobs.",
    },
    {
      name: "Frank D.",
      role: "Owner, Ridgeline Roofing",
      quote:
        "My Google ranking, reviews, and close rate are all on one scorecard. I check it every morning.",
    },
  ],
};

const BORDER_ACCENT: Record<string, string> = {
  plumbing: "border-l-blue-500",
  "med-spa": "border-l-purple-500",
  hvac: "border-l-orange-500",
  restoration: "border-l-emerald-500",
  "carpet-cleaning": "border-l-teal-500",
  roofing: "border-l-red-500",
};

const AVATAR_COLORS: Record<string, string> = {
  plumbing: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40",
  "med-spa": "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40",
  hvac: "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40",
  restoration: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40",
  "carpet-cleaning": "bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/40",
  roofing: "bg-red-500/20 text-red-300 ring-1 ring-red-500/40",
};

interface NicheTestimonialsSectionProps {
  nicheKey: string;
}

export default function NicheTestimonialsSection({
  nicheKey,
}: NicheTestimonialsSectionProps) {
  const testimonials = TESTIMONIALS[nicheKey] ?? TESTIMONIALS.plumbing;
  const borderAccent = BORDER_ACCENT[nicheKey] ?? BORDER_ACCENT.plumbing;
  const avatarColor = AVATAR_COLORS[nicheKey] ?? AVATAR_COLORS.plumbing;

  return (
    <>
      <section className="py-20 px-6 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              Real Business Owners, Real Results
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              What other{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                business owners say
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`bg-slate-900 border border-white/8 border-l-4 ${borderAccent} rounded-2xl p-6 shadow-lg`}
              >
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-bold flex-shrink-0`}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-semibold truncate">
                      {t.name}
                    </div>
                    <div className="text-slate-400 text-xs truncate">
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Post-testimonials demo nudge ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-14 px-6 bg-slate-950 text-center"
        data-ocid="testimonials.demo_cta_section"
      >
        <p className="text-slate-300 text-lg font-semibold mb-5">
          Don&apos;t take our word for it —{" "}
          <span className="text-white">see it live yourself.</span>
        </p>
        <Link
          to="/demo"
          data-ocid="testimonials.demo_cta.button"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-purple-900/50 transition-all duration-200 text-sm"
        >
          <Zap size={15} />
          Watch It Work — Live Demo
          <ArrowRight size={15} />
        </Link>
        <p className="text-slate-500 text-xs mt-3">
          No signup. No credit card. 5 minutes.
        </p>
      </motion.section>
    </>
  );
}
