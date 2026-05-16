import { motion } from "motion/react";

const INCLUDED_ITEMS = [
  {
    icon: "📱",
    label: "Your Own Business App",
    description: "A complete app built specifically for your niche.",
    color: "bg-indigo-500/20 text-indigo-300",
  },
  {
    icon: "🎙️",
    label: "AI Voice Agent",
    description: "Answers calls in your business name, 24/7.",
    color: "bg-purple-500/20 text-purple-300",
  },
  {
    icon: "📊",
    label: "Free Business Audit",
    description: "See exactly what's costing you leads right now.",
    color: "bg-emerald-500/20 text-emerald-300",
  },
  {
    icon: "📅",
    label: "30-Day Content Calendar",
    description: "Social posts written for your industry, ready to go.",
    color: "bg-blue-500/20 text-blue-300",
  },
  {
    icon: "🏆",
    label: "Business Scorecard",
    description: "Know your strengths and what to fix first.",
    color: "bg-amber-500/20 text-amber-300",
  },
  {
    icon: "🌐",
    label: "Your Website, Ready",
    description: "Use yours or claim the one we already built for you.",
    color: "bg-teal-500/20 text-teal-300",
  },
] as const;

interface WhatsIncludedSectionProps {
  /** When true, renders a prominent "Here's What You Get" header for above-fold placement */
  showHeader?: boolean;
}

export default function WhatsIncludedSection({
  showHeader,
}: WhatsIncludedSectionProps) {
  return (
    <section className="py-14 px-6 bg-slate-950 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10"
        >
          {showHeader ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
                Here's What You Get — Free, Built in 60 Seconds
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Everything Your Business Needs to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Get Booked, Ranked &amp; Funded
                </span>
              </h2>
            </>
          ) : (
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Everything built for you — free, in 60 seconds
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INCLUDED_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-start gap-4 bg-slate-900 border border-indigo-500/15 rounded-xl p-5 hover:border-indigo-500/35 hover:shadow-lg hover:shadow-indigo-950/50 transition-all duration-200"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${item.color}`}
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-snug mb-0.5">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
