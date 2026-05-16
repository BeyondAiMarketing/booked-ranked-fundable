import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const BRAND_KIT_NICHE: Record<string, string> = {
  plumbing: "plumber",
  "med-spa": "med-spa",
  hvac: "hvac",
  restoration: "restoration",
  "carpet-cleaning": "carpet-cleaning",
  roofing: "roofing",
};

const PULSE_COLORS: Record<string, string> = {
  plumbing: "bg-blue-500",
  "med-spa": "bg-purple-500",
  hvac: "bg-orange-500",
  restoration: "bg-emerald-500",
  "carpet-cleaning": "bg-teal-500",
  roofing: "bg-red-500",
};

const STAT_ACCENT: Record<string, string> = {
  plumbing: "text-blue-400",
  "med-spa": "text-purple-400",
  hvac: "text-orange-400",
  restoration: "text-emerald-400",
  "carpet-cleaning": "text-teal-400",
  roofing: "text-red-400",
};

const BORDER_GLOW: Record<string, string> = {
  plumbing: "border-blue-500/30 shadow-blue-900/20",
  "med-spa": "border-purple-500/30 shadow-purple-900/20",
  hvac: "border-orange-500/30 shadow-orange-900/20",
  restoration: "border-emerald-500/30 shadow-emerald-900/20",
  "carpet-cleaning": "border-teal-500/30 shadow-teal-900/20",
  roofing: "border-red-500/30 shadow-red-900/20",
};

const UPCOMING_JOBS: Record<
  string,
  { service: string; customer: string; time: string }[]
> = {
  plumbing: [
    { service: "Burst pipe repair", customer: "R. Johnson", time: "9:00 AM" },
    { service: "Water heater install", customer: "M. Chen", time: "11:30 AM" },
    { service: "Drain cleaning", customer: "T. Williams", time: "2:00 PM" },
  ],
  "med-spa": [
    { service: "Botox consultation", customer: "A. Martinez", time: "9:30 AM" },
    { service: "Laser treatment", customer: "S. Park", time: "11:00 AM" },
    { service: "Filler follow-up", customer: "K. Davis", time: "1:30 PM" },
  ],
  hvac: [
    {
      service: "AC emergency repair",
      customer: "D. Thompson",
      time: "8:00 AM",
    },
    { service: "Seasonal tune-up", customer: "L. Garcia", time: "10:30 AM" },
    { service: "New unit install", customer: "B. Wilson", time: "1:00 PM" },
  ],
  restoration: [
    { service: "Water extraction", customer: "P. Miller", time: "7:30 AM" },
    { service: "Mold assessment", customer: "C. Brown", time: "10:00 AM" },
    { service: "Fire damage scope", customer: "N. Taylor", time: "12:30 PM" },
  ],
  "carpet-cleaning": [
    {
      service: "3-bedroom deep clean",
      customer: "H. Anderson",
      time: "9:00 AM",
    },
    { service: "Pet odor treatment", customer: "J. White", time: "11:00 AM" },
    { service: "Commercial suite", customer: "Apex Realty", time: "2:30 PM" },
  ],
  roofing: [
    { service: "Storm damage inspect", customer: "F. Harris", time: "8:30 AM" },
    { service: "Full replacement", customer: "G. Clark", time: "10:00 AM" },
    { service: "Estimate — hail", customer: "E. Lewis", time: "1:30 PM" },
  ],
};

interface NicheAppPreviewSectionProps {
  nicheKey: string;
  nicheName: string;
}

export default function NicheAppPreviewSection({
  nicheKey,
  nicheName,
}: NicheAppPreviewSectionProps) {
  const brandKitNiche = BRAND_KIT_NICHE[nicheKey] ?? nicheKey;
  const pulseColor = PULSE_COLORS[nicheKey] ?? PULSE_COLORS.plumbing;
  const statAccent = STAT_ACCENT[nicheKey] ?? STAT_ACCENT.plumbing;
  const borderGlow = BORDER_GLOW[nicheKey] ?? BORDER_GLOW.plumbing;
  const jobs = UPCOMING_JOBS[nicheKey] ?? UPCOMING_JOBS.plumbing;
  const brandKitLink = `/brand-kit?niche=${encodeURIComponent(brandKitNiche)}`;

  return (
    <section className="py-20 px-6 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Your App — Already Built
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Here's what your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              {nicheName} app
            </span>{" "}
            looks like inside
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto">
            Everything you need — already set up and waiting for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`bg-slate-900 border ${borderGlow} rounded-2xl shadow-2xl overflow-hidden max-w-3xl mx-auto`}
        >
          {/* App header bar */}
          <div className="bg-slate-800/80 border-b border-white/8 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-white/60 text-xs ml-1">
                Your Business Name
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`}
              />
              <span className="text-xs text-slate-300 font-medium">● Live</span>
            </div>
          </div>

          {/* Stat cards row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 border-b border-white/5">
            {[
              { label: "Leads This Week", value: "12" },
              { label: "Reviews", value: "4.9★" },
              { label: "Calls Answered", value: "100%" },
              { label: "Jobs Booked", value: "8" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-800/60 rounded-xl p-3 text-center"
              >
                <div className={`text-xl font-bold ${statAccent} mb-0.5`}>
                  {stat.value}
                </div>
                <div className="text-slate-400 text-xs leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming jobs */}
          <div className="p-5">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Upcoming Jobs Today
            </div>
            <div className="space-y-2.5">
              {jobs.map((job) => (
                <div
                  key={`${job.customer}-${job.time}`}
                  className="flex items-center justify-between bg-slate-800/40 rounded-lg px-4 py-2.5"
                >
                  <div>
                    <div className="text-white text-sm font-medium">
                      {job.service}
                    </div>
                    <div className="text-slate-400 text-xs">{job.customer}</div>
                  </div>
                  <div className={`text-xs font-semibold ${statAccent}`}>
                    {job.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom banner */}
          <div className="bg-indigo-900/40 border-t border-indigo-500/20 px-5 py-3.5 text-center">
            <p className="text-indigo-200 text-xs">
              This is what {nicheName} businesses using BRF see every morning.
            </p>
          </div>
        </motion.div>

        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mt-10"
        >
          <p className="text-slate-300 text-sm mb-5">
            Get yours set up in 60 seconds — free.
          </p>
          <Link to={brandKitLink as any}>
            <Button
              data-ocid="niche_app_preview.primary_button"
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/60 h-12 px-8 font-semibold"
            >
              See Your App <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
