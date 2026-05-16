import { Database, Globe, Shield } from "lucide-react";
import { motion } from "motion/react";

const TRUST_POINTS = [
  {
    icon: Shield,
    title: "Tamper-Resistant by Design",
    description:
      "Built on ICP canister smart contracts — your audit scores, leads, and business data are cryptographically protected against tampering, alteration, or unauthorized access.",
  },
  {
    icon: Database,
    title: "Certified Data Integrity",
    description:
      "Every data point in your system is certified and verifiable. No black boxes, no manipulated metrics — just transparent, blockchain-verified business intelligence.",
  },
  {
    icon: Globe,
    title: "Next-Generation Infrastructure",
    description:
      "ICP is the only blockchain designed to run full-stack applications at web speed. Your platform isn't just built on better technology — it's built on the future.",
  },
];

export default function TrustInfrastructureSection() {
  return (
    <section className="py-16 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Built on Next-Generation Infrastructure
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto text-sm leading-relaxed">
            While every other platform stores your data on conventional cloud
            servers, we built on the Internet Computer Protocol — the most
            advanced blockchain infrastructure ever developed. Your business
            runs on technology most companies can't even access.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TRUST_POINTS.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-900 border border-white/5 rounded-xl p-5"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                  <Icon size={17} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">
                  {point.title}
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
