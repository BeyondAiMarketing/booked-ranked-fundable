import { ArrowRight, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

interface DemoTransitionProps {
  onContinue: () => void;
  onBack: () => void;
}

export default function DemoTransition({
  onContinue,
  onBack,
}: DemoTransitionProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="max-w-xl text-center"
      >
        {/* Check icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.05, delay: 0.6, type: "spring" }}
          className="w-20 h-20 bg-indigo-500/15 border border-indigo-400/25 rounded-3xl flex items-center justify-center mx-auto mb-8"
        >
          <span className="text-4xl">⚡</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 0.9 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
        >
          Every one of those things just happened automatically.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 1.275 }}
          className="text-slate-400 text-base md:text-lg mb-3"
        >
          No staff. No manual work. No missed opportunities.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 1.575 }}
          className="text-indigo-300 font-medium mb-10"
        >
          Now see the dashboard where you watch it all run — and control
          everything.
        </motion.p>

        {/* Stat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.05, delay: 1.8 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-400 text-sm px-4 py-2 rounded-full mb-10"
        >
          <span className="text-indigo-300 font-semibold">47 hours/month</span>
          &nbsp;saved on average by BRF clients
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, delay: 2.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {/* Back button */}
          <button
            type="button"
            data-ocid="services_demo.transition_back_button"
            onClick={onBack}
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-semibold text-sm px-6 py-3.5 rounded-2xl transition-colors duration-200"
          >
            <ChevronLeft size={17} />
            Back to Credit Builder
          </button>

          {/* Continue button */}
          <motion.button
            type="button"
            data-ocid="services_demo.track2_start_button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-indigo-900/40 transition-all duration-200"
          >
            See Your Back Office
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
