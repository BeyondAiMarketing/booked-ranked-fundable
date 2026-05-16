import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface PainPoint {
  title: string;
  description: string;
}

interface NichePainSectionProps {
  nicheName: string;
  painPoints: PainPoint[];
}

export default function NichePainSection({
  nicheName,
  painPoints,
}: NichePainSectionProps) {
  return (
    <section className="py-20 px-6 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-block bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Real Problems, Real Costs
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What's Costing Your {nicheName} Business Jobs Right Now
          </h2>
          <p className="text-slate-200 max-w-xl mx-auto">
            These aren't minor inconveniences. Each one is revenue leaving your
            business every single day.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {painPoints.map((pain, i) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-red-500/20 transition-colors"
              data-ocid={`pain.item.${i + 1}`}
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{pain.title}</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {pain.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
