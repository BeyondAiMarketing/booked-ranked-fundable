import { Banknote, CreditCard, Shield, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface Milestone {
  id: number;
  day: string;
  Icon: React.ElementType;
  title: string;
  sub: string;
  badge: string;
  badgeColor: string;
  funding?: { label: string; amount: string }[];
}

const MILESTONES: Milestone[] = [
  {
    id: 1,
    day: "DAY 1",
    Icon: Shield,
    title: "Business Credit Profile Created",
    sub: "Your EIN, business address, and entity structure registered with credit bureaus",
    badge: "Foundation established",
    badgeColor: "text-slate-300 bg-slate-700/50 border-slate-600/30",
  },
  {
    id: 2,
    day: "DAY 30",
    Icon: CreditCard,
    title: "First Tradeline Established",
    sub: "Your first net-30 vendor account appears on your business credit report",
    badge: "$10,000 Available",
    badgeColor: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  },
  {
    id: 3,
    day: "DAY 60",
    Icon: TrendingUp,
    title: "Credit Score Climbing",
    sub: "Multiple tradelines active. Business credit score rising to 70+",
    badge: "$50,000 Unlocked",
    badgeColor: "text-blue-300 bg-blue-500/15 border-blue-500/30",
  },
  {
    id: 4,
    day: "DAY 90",
    Icon: Banknote,
    title: "Full Fundability Profile Complete",
    sub: "Your business qualifies for lines of credit, equipment financing, and SBA-backed loans",
    badge: "Up to $500,000",
    badgeColor: "text-purple-300 bg-purple-500/15 border-purple-500/30",
    funding: [
      { label: "Business Line of Credit", amount: "$50,000" },
      { label: "Equipment Financing", amount: "$250,000" },
      { label: "SBA Loan Eligible", amount: "$500,000" },
    ],
  },
];

export default function DemoScene5CreditBuilder() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    setVisibleCount(0);
    setShowFinal(false);
    let cancelled = false;

    const delays = [1890, 8190, 15120, 22680];
    const timers: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        if (cancelled) return;
        setVisibleCount(i + 1);
      }, delay);
      timers.push(t);
    });

    const finalTimer = setTimeout(() => {
      if (cancelled) return;
      setShowFinal(true);
    }, 31500);
    timers.push(finalTimer);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Timeline */}
      <div className="space-y-3">
        <AnimatePresence>
          {MILESTONES.slice(0, visibleCount).map((m, i) => {
            const Icon = m.Icon;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="flex items-start gap-4"
              >
                {/* Timeline connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      i === 0
                        ? "bg-slate-700 border border-slate-600/50"
                        : i === 1
                          ? "bg-emerald-900/50 border border-emerald-500/30"
                          : i === 2
                            ? "bg-blue-900/50 border border-blue-500/30"
                            : "bg-purple-900/50 border border-purple-500/30"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        i === 0
                          ? "text-slate-300"
                          : i === 1
                            ? "text-emerald-300"
                            : i === 2
                              ? "text-blue-300"
                              : "text-purple-300"
                      }
                    />
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className="w-px flex-1 min-h-[16px] bg-gradient-to-b from-white/15 to-transparent mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400 tracking-widest">
                      {m.day}
                    </span>
                    <div
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${m.badgeColor}`}
                    >
                      {m.badge}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.sub}
                  </p>

                  {/* Funding cards for Day 90 */}
                  {m.funding && visibleCount >= 4 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {m.funding.map((f, fi) => (
                        <motion.div
                          key={f.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.75, delay: fi * 0.25 }}
                          className="bg-purple-900/30 border border-purple-500/20 rounded-xl p-2.5 text-center"
                        >
                          <div className="text-sm font-bold text-purple-200">
                            {f.amount}
                          </div>
                          <div className="text-[9px] text-slate-500 leading-tight mt-0.5">
                            {f.label}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Final text */}
      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20 rounded-2xl p-4 text-center"
          >
            <p className="text-sm md:text-base font-semibold text-white leading-relaxed">
              Your business now has the credit and fundability to{" "}
              <span className="text-purple-300">invest, expand, or hire</span> —
              built on autopilot in 90 days.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
