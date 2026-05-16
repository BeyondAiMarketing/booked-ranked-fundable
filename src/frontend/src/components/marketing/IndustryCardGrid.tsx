import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const INDUSTRIES = [
  {
    key: "plumbing",
    name: "Plumbing",
    icon: "🔧",
    tagline: "Stop losing emergency calls to faster competitors.",
    href: "/plumbing",
    color: "from-blue-500/10 to-blue-600/5",
    border: "border-blue-500/15 hover:border-blue-500/30",
  },
  {
    key: "restoration",
    name: "Restoration",
    icon: "💧",
    tagline: "Win high-ticket water damage jobs before competitors answer.",
    href: "/restoration",
    color: "from-cyan-500/10 to-cyan-600/5",
    border: "border-cyan-500/15 hover:border-cyan-500/30",
  },
  {
    key: "hvac",
    name: "HVAC",
    icon: "❄️",
    tagline: "Never miss a call during peak heating and cooling season.",
    href: "/hvac",
    color: "from-sky-500/10 to-sky-600/5",
    border: "border-sky-500/15 hover:border-sky-500/30",
  },
  {
    key: "carpet-cleaning",
    name: "Carpet Cleaning",
    icon: "✨",
    tagline: "Turn more local searches into booked appointments.",
    href: "/carpet-cleaning",
    color: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/15 hover:border-amber-500/30",
  },
  {
    key: "roofing",
    name: "Roofing",
    icon: "🏠",
    tagline: "Capture storm leads before competitors saturate your market.",
    href: "/roofing",
    color: "from-orange-500/10 to-orange-600/5",
    border: "border-orange-500/15 hover:border-orange-500/30",
  },
  {
    key: "med-spa",
    name: "Med Spa",
    icon: "💆",
    tagline: "Turn more inquiries into booked consultations.",
    href: "/med-spa",
    color: "from-purple-500/10 to-purple-600/5",
    border: "border-purple-500/15 hover:border-purple-500/30",
  },
  {
    key: "real-estate",
    name: "Real Estate",
    icon: "🏡",
    tagline: "Stop losing deals to the agent who responds faster.",
    href: "/real-estate",
    color: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/15 hover:border-amber-500/30",
  },
  {
    key: "mortgage",
    name: "Mortgage",
    icon: "🏦",
    tagline: "Never lose a loan to the broker who answered first.",
    href: "/mortgage",
    color: "from-emerald-500/10 to-emerald-600/5",
    border: "border-emerald-500/15 hover:border-emerald-500/30",
  },
  {
    key: "chiropractor",
    name: "Chiropractic",
    icon: "⚕️",
    tagline: "Stop losing new patients to practices that answer faster.",
    href: "/chiropractor",
    color: "from-cyan-500/10 to-cyan-600/5",
    border: "border-cyan-500/15 hover:border-cyan-500/30",
  },
  {
    key: "dental",
    name: "Dental",
    icon: "🦷",
    tagline: "Stop losing patients to practices that pick up the phone.",
    href: "/dental",
    color: "from-violet-500/10 to-violet-600/5",
    border: "border-violet-500/15 hover:border-violet-500/30",
  },
];

export default function IndustryCardGrid() {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Built for Your Industry
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Serving Local Service Businesses Across Every Trade
          </h2>
          <p className="text-slate-200 max-w-xl mx-auto">
            Each niche has its own pain points, competitive dynamics, and growth
            opportunities. We've built specifically for yours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRIES.map((industry, i) => (
            <motion.div
              key={industry.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              data-ocid={`industries.item.${i + 1}`}
            >
              <Link
                to={industry.href as any}
                className={`block bg-gradient-to-br ${industry.color} border ${industry.border} rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] group`}
              >
                <div className="text-3xl mb-4">{industry.icon}</div>
                <h3 className="font-bold text-white mb-2">{industry.name}</h3>
                <p className="text-sm text-slate-200 mb-4 leading-relaxed">
                  {industry.tagline}
                </p>
                <div className="flex items-center gap-1.5 text-indigo-400 text-sm font-medium group-hover:gap-2.5 transition-all">
                  See How It Works <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
