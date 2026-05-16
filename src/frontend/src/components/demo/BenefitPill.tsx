/**
 * BenefitPill — expandable pill that reveals a one-sentence benefit.
 * Collapsed: shows '💡 What this does for you ▼'
 * Expanded: reveals the benefit in plain language.
 */

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface BenefitPillProps {
  benefit: string;
}

export default function BenefitPill({ benefit }: BenefitPillProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      layout
      className="hidden sm:flex flex-col items-start gap-1.5 rounded-2xl px-4 py-2.5 w-full text-left transition-colors"
      style={{
        background: expanded
          ? "oklch(0.58 0.22 290 / 12%)"
          : "oklch(1 0 0 / 5%)",
        border: expanded
          ? "1px solid oklch(0.58 0.22 290 / 35%)"
          : "1px solid oklch(1 0 0 / 10%)",
      }}
      aria-expanded={expanded}
      data-ocid="demo.benefit_pill.toggle"
    >
      <div className="flex items-center gap-2 w-full">
        <span
          className="text-xs font-bold"
          style={{ color: "oklch(0.72 0.14 290)" }}
        >
          💡 What this does for you
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-[10px]"
          style={{ color: "oklch(0.55 0.06 290)" }}
          aria-hidden="true"
        >
          ▼
        </motion.span>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.p
            key="benefit-text"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="text-sm font-semibold leading-relaxed overflow-hidden"
            style={{ color: "oklch(0.88 0.01 280)" }}
          >
            {benefit}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
