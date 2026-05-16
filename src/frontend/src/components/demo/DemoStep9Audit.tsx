// DemoStep9Audit — Personalized audit report with RDT iterative refinement simulation
// Framework: Deiss (customer value journey — give real value before asking)

import { NICHE_AUDIT_GAPS } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const NICHE_SCORES: Record<string, number> = {
  plumber: 62,
  "med-spa": 71,
  hvac: 58,
  restoration: 55,
  "carpet-cleaning": 66,
  roofing: 60,
  "real-estate": 73,
  mortgage: 68,
  chiropractor: 64,
  dental: 70,
};

const NICHE_QUICK_WINS: Record<string, string[]> = {
  plumber: [
    "Activate AI receptionist — answer 100% of calls within 3 rings",
    "Set up automated review requests after every completed job",
    "Add an emergency booking CTA to your homepage",
  ],
  "med-spa": [
    "Enable after-hours booking automation — capture every inquiry",
    "Launch SMS reminder system — eliminate $3K+/month in no-shows",
    "Automate 3 social posts per week with before/after content",
  ],
  hvac: [
    "Set up pre-season tune-up campaign for existing customers",
    "Activate emergency call handling for after-hours inquiries",
    "Launch off-season maintenance reminder sequences",
  ],
  restoration: [
    "Enable 24/7 emergency AI dispatch — answer disaster calls instantly",
    "Set up storm-triggered campaign automation for your service area",
    "Build your Google review base to 50+ for local search dominance",
  ],
  "carpet-cleaning": [
    "Launch rebooking automation — contact past customers every 90 days",
    "Build before/after content pipeline from every job completed",
    "Activate consistent review generation to improve Google Maps rank",
  ],
  roofing: [
    "Set up storm alert campaign triggers for your service zip codes",
    "Build your Google review profile to 75+ to win on reputation",
    "Launch referral automation to convert satisfied customers to advocates",
  ],
  "real-estate": [
    "Activate instant response system — reply to every inquiry in under 60 seconds",
    "Set up past client nurture sequences — turn closed deals into referral sources",
    "Automate showing requests to eliminate manual scheduling friction",
  ],
  mortgage: [
    "Enable after-hours inquiry capture — stop losing 67% of your pipeline",
    "Launch Realtor referral nurture sequence — monthly automated touchpoints",
    "Build pre-qualification funnel to guide borrowers before they go elsewhere",
  ],
  chiropractor: [
    "Activate AI call coverage during treatment hours — capture new patients",
    "Set up SMS reminder system — eliminate $3K+/month in no-shows",
    "Launch patient reactivation campaign for dormant clients",
  ],
  dental: [
    "Enable overflow AI answering — never miss another new patient call",
    "Set up automated recall system — contact lapsed patients before they leave",
    "Launch consistent review generation engine — maintain your Google ranking",
  ],
};

const SEVERITY_STYLES = {
  critical: {
    badge: "Critical",
    bg: "oklch(0.6 0.22 25 / 15%)",
    text: "oklch(0.78 0.18 25)",
    border: "oklch(0.6 0.22 25 / 30%)",
    dot: "oklch(0.72 0.2 25)",
  },
  high: {
    badge: "High",
    bg: "oklch(0.72 0.2 75 / 15%)",
    text: "oklch(0.82 0.16 75)",
    border: "oklch(0.72 0.2 75 / 30%)",
    dot: "oklch(0.78 0.18 75)",
  },
  medium: {
    badge: "Medium",
    bg: "oklch(0.6 0.18 240 / 15%)",
    text: "oklch(0.76 0.14 240)",
    border: "oklch(0.6 0.18 240 / 30%)",
    dot: "oklch(0.68 0.16 240)",
  },
};

const GAP_SEVERITIES: Array<"critical" | "high" | "medium"> = [
  "critical",
  "high",
  "medium",
];

export default function DemoStep9Audit() {
  const { demoProspect, setStepComplete } = useDemoFlow();
  const niche = demoProspect?.niche ?? "plumber";
  const businessName = demoProspect?.businessName ?? "Your Business";
  const city = demoProspect?.city ?? "Your City";

  const gaps = NICHE_AUDIT_GAPS[niche as keyof typeof NICHE_AUDIT_GAPS];
  const quickWins = NICHE_QUICK_WINS[niche] ?? NICHE_QUICK_WINS.plumber;
  const score = NICHE_SCORES[niche] ?? 65;

  // Loading phases — RDT iterative refinement simulation
  const phases = [
    `Analyzing ${businessName} in ${city}…`,
    `Evaluating against top ${niche} competitors…`,
    "Refining recommendations…",
  ];

  const [loadingPhase, setLoadingPhase] = useState(0);
  const [reportReady, setReportReady] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const timings = [0, 1000, 2500];
    timings.forEach((t, i) => {
      setTimeout(() => setLoadingPhase(i), t);
    });
    setTimeout(() => {
      setReportReady(true);
      setStepComplete(true);
    }, 3800);
  }, [setStepComplete]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const payload = { businessName, niche, city, score, gaps, email };
    console.log("[DemoStep9Audit] auditPayload:", payload);
    setSent(true);
  };

  // Score color
  const scoreColor =
    score >= 75
      ? "oklch(0.62 0.18 155)"
      : score >= 55
        ? "oklch(0.72 0.2 75)"
        : "oklch(0.72 0.2 25)";

  return (
    <div
      className="flex flex-col items-center gap-6"
      data-ocid="demo.step9.section"
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Personalized Business Audit
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Your Business Readiness Report
        </h2>
        <p className="mt-2 text-sm" style={{ color: "oklch(0.65 0.02 280)" }}>
          Analyzing your business against competitors in your market right now.
        </p>
      </div>

      {/* Loading state — iterative refinement */}
      <AnimatePresence mode="wait">
        {!reportReady && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-md"
            data-ocid="demo.step9.loading_state"
          >
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{
                background: "oklch(0.12 0.014 280)",
                border: "1px solid oklch(0.58 0.22 290 / 25%)",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.58 0.22 290 / 15%)",
                    border: "1px solid oklch(0.58 0.22 290 / 30%)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "oklch(0.58 0.22 290)",
                      borderTopColor: "transparent",
                    }}
                  />
                </div>
                <p className="text-sm font-semibold text-white text-center">
                  Generating your personalized audit report…
                </p>
              </div>

              <div className="space-y-2">
                {phases.map((phase, i) => (
                  <motion.div
                    key={phase}
                    animate={{
                      opacity: i <= loadingPhase ? 1 : 0.25,
                    }}
                    className="flex items-center gap-3 text-xs"
                    style={{
                      color:
                        i <= loadingPhase
                          ? "oklch(0.78 0.14 290)"
                          : "oklch(0.45 0.02 280)",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          i < loadingPhase
                            ? "oklch(0.62 0.18 155 / 20%)"
                            : i === loadingPhase
                              ? "oklch(0.58 0.22 290 / 20%)"
                              : "oklch(0.2 0.015 280)",
                        border: `1px solid ${
                          i < loadingPhase
                            ? "oklch(0.62 0.18 155 / 40%)"
                            : i === loadingPhase
                              ? "oklch(0.58 0.22 290 / 40%)"
                              : "oklch(1 0 0 / 8%)"
                        }`,
                      }}
                    >
                      {i < loadingPhase ? (
                        <span
                          style={{
                            color: "oklch(0.62 0.18 155)",
                            fontSize: "8px",
                          }}
                        >
                          ✓
                        </span>
                      ) : i === loadingPhase ? (
                        <div
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: "oklch(0.58 0.22 290)" }}
                        />
                      ) : null}
                    </div>
                    {phase}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Report card */}
        {reportReady && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-lg space-y-4"
            data-ocid="demo.step9.report_card"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.12 0.014 280)",
                border: "1px solid oklch(0.58 0.22 290 / 30%)",
                boxShadow: "0 0 32px oklch(0.58 0.22 290 / 15%)",
              }}
            >
              {/* Report header */}
              <div
                className="px-5 py-4 border-b flex items-center justify-between"
                style={{
                  borderColor: "oklch(0.58 0.22 290 / 20%)",
                  background: "oklch(0.14 0.016 285)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "oklch(0.58 0.22 290)" }}
                  >
                    BRF Business Readiness Audit
                  </p>
                  <p className="text-sm font-black text-white mt-0.5">
                    {businessName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.02 280)" }}
                  >
                    {city} · {niche}
                  </p>
                </div>
                {/* Big score */}
                <div className="flex flex-col items-center">
                  <span
                    className="text-4xl font-black leading-none"
                    style={{ color: scoreColor }}
                  >
                    {score}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.5 0.02 280)" }}
                  >
                    / 100
                  </span>
                  <span
                    className="text-[10px] font-bold mt-0.5"
                    style={{ color: scoreColor }}
                  >
                    {score >= 75
                      ? "Good"
                      : score >= 55
                        ? "Needs Work"
                        : "At Risk"}
                  </span>
                </div>
              </div>

              {/* Gaps */}
              <div className="p-5 space-y-3">
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(0.55 0.02 280)" }}
                >
                  3 Action Gaps Found
                </p>
                {gaps.map((gap, i) => {
                  const sev = SEVERITY_STYLES[GAP_SEVERITIES[i]];
                  return (
                    <motion.div
                      key={gap}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl border"
                      style={{ background: sev.bg, borderColor: sev.border }}
                      data-ocid={`demo.step9.gap.item.${i + 1}`}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: sev.dot }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "oklch(0.82 0.01 280)" }}
                        >
                          {gap}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0"
                        style={{
                          background: sev.bg,
                          color: sev.text,
                          borderColor: sev.border,
                        }}
                      >
                        {sev.badge}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick wins */}
              <div
                className="px-5 pb-5 pt-0 space-y-3"
                style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}
              >
                <div className="pt-4">
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "oklch(0.55 0.02 280)" }}
                  >
                    3 Quick Wins with BRF
                  </p>
                  {quickWins.map((win, i) => (
                    <motion.div
                      key={win}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-2 mb-2"
                    >
                      <span
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: "oklch(0.62 0.18 155)" }}
                      >
                        ✓
                      </span>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {win}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email capture */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.12 0.014 280)",
                border: "1px solid oklch(1 0 0 / 10%)",
              }}
              data-ocid="demo.step9.email_capture"
            >
              {!sent ? (
                <form onSubmit={handleSend} className="space-y-3">
                  <p className="text-sm font-semibold text-white">
                    📧 Email this report to yourself
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.6 0.02 280)" }}
                  >
                    Get the full PDF with your score, gaps, and action plan.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-ocid="demo.step9.email.input"
                      className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-1"
                      style={
                        {
                          background: "oklch(0.16 0.015 285)",
                          border: "1px solid oklch(1 0 0 / 12%)",
                        } as React.CSSProperties
                      }
                    />
                    <button
                      type="submit"
                      data-ocid="demo.step9.send_report.button"
                      className="px-4 py-2.5 rounded-xl font-bold text-sm text-white flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
                        boxShadow: "0 6px 16px oklch(0.58 0.22 290 / 35%)",
                      }}
                    >
                      Send →
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3"
                  data-ocid="demo.step9.email.success_state"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.62 0.18 155 / 20%)" }}
                  >
                    <span style={{ color: "oklch(0.62 0.18 155)" }}>✓</span>
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.78 0.14 155)" }}
                    >
                      Sent! Check your inbox
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.02 280)" }}
                    >
                      {email}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
