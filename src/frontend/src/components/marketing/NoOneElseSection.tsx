import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const BULLETS = [
  "The only platform that combines AI booking, reputation management, and business fundability in one system",
  "Built on ICP — next-generation blockchain infrastructure, not conventional shared servers",
  "Your business data lives on tamper-resistant canister smart contracts — certified and verifiable",
  "Designed exclusively for local service businesses that need bookings, rankings, and capital access",
];

export default function NoOneElseSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-purple-500/15 border border-purple-400/25 text-purple-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            The Only Platform of Its Kind
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
            The Only System Built for Bookings, Rankings,
            <br className="hidden md:block" /> and Fundability — On
            Next-Generation Infrastructure
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto text-base leading-relaxed">
            No other platform in the local service industry combines all three
            growth engines in one place, built on the Internet Computer Protocol
            — the most advanced blockchain infrastructure ever developed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BULLETS.map((bullet, i) => (
            <motion.div
              key={bullet}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-4 bg-slate-900/70 border border-indigo-500/15 rounded-xl p-5"
            >
              <CheckCircle2
                size={20}
                className="text-indigo-400 mt-0.5 shrink-0"
              />
              <p className="text-slate-200 text-sm leading-relaxed font-medium">
                {bullet}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
