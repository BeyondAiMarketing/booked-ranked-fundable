import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface EngineData {
  headline: string;
  description: string;
}

interface ThreeEnginesSectionProps {
  engines: {
    booked: EngineData;
    ranked: EngineData;
    fundable: EngineData;
  };
}

const engineMeta = [
  {
    key: "booked" as const,
    label: "Booked",
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    tagColor: "text-blue-300",
  },
  {
    key: "ranked" as const,
    label: "Ranked",
    icon: TrendingUp,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/40",
    tagColor: "text-indigo-300",
    featured: true,
  },
  {
    key: "fundable" as const,
    label: "Fundable",
    icon: DollarSign,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    tagColor: "text-purple-300",
  },
];

export default function ThreeEnginesSection({
  engines,
}: ThreeEnginesSectionProps) {
  return (
    <section className="py-20 px-6 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-block bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            Three Growth Engines. One Platform.
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything Your Business Needs to Grow
          </h2>
          <p className="text-slate-200 max-w-xl mx-auto">
            Each engine solves a core growth problem. Together, they transform
            how your business attracts, converts, and funds growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engineMeta.map((meta, i) => {
            const engine = engines[meta.key];
            const Icon = meta.icon;
            return (
              <motion.div
                key={meta.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative bg-slate-800 rounded-2xl p-7 border ${
                  meta.featured
                    ? "border-indigo-500/40 ring-1 ring-indigo-500/20"
                    : "border-white/5"
                }`}
                data-ocid={`engines.${meta.key}.card`}
              >
                {meta.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Impactful
                  </div>
                )}
                <div
                  className={`w-12 h-12 rounded-2xl ${meta.bgColor} flex items-center justify-center mb-5`}
                >
                  <Icon size={22} className={meta.color} />
                </div>
                <div
                  className={`text-xs font-bold uppercase tracking-widest ${meta.tagColor} mb-2`}
                >
                  {meta.label}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {engine.headline}
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {engine.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
