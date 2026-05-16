/**
 * CrmBackOfficeSection — Stage 4 on the homepage.
 * Shows the CRM pipeline, follow-up automation, and SMS inbox running on autopilot.
 * Supports isNeutral=true for generic content when no niche is selected.
 */

import type { HomepageNicheData } from "@/data/homepageNicheData";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  nicheData: HomepageNicheData;
  isNeutral?: boolean;
}

// ─── Pipeline stages ──────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { label: "New Lead", color: "oklch(0.62 0.18 240)", count: 7 },
  { label: "Contacted", color: "oklch(0.7 0.18 290)", count: 4 },
  { label: "Demo Sent", color: "oklch(0.72 0.18 55)", count: 3 },
  { label: "In Trial", color: "oklch(0.62 0.18 155)", count: 2 },
];

// ─── Animated lead card ───────────────────────────────────────────────────────

interface LeadCardData {
  name: string;
  service: string;
  time: string;
  score: number;
  status: "hot" | "warm" | "cold";
}

function LeadCard({ lead, delay }: { lead: LeadCardData; delay: number }) {
  const statusColors = {
    hot: {
      bg: "oklch(0.62 0.22 25 / 18%)",
      border: "oklch(0.62 0.22 25 / 40%)",
      text: "oklch(0.78 0.18 25)",
      label: "🔥 Hot",
    },
    warm: {
      bg: "oklch(0.7 0.18 55 / 15%)",
      border: "oklch(0.7 0.18 55 / 35%)",
      text: "oklch(0.8 0.16 55)",
      label: "🌡 Warm",
    },
    cold: {
      bg: "oklch(0.6 0.18 240 / 12%)",
      border: "oklch(0.6 0.18 240 / 30%)",
      text: "oklch(0.72 0.14 240)",
      label: "❄️ Cold",
    },
  };
  const s = statusColors[lead.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl border p-3 flex items-center gap-3"
      style={{
        background: "oklch(0.14 0.016 280 / 0.8)",
        borderColor: "oklch(1 0 0 / 8%)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
        style={{
          background: "oklch(0.58 0.22 290 / 30%)",
          color: "oklch(0.84 0.18 290)",
        }}
      >
        {lead.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {lead.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">{lead.service}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            color: s.text,
          }}
        >
          {s.label}
        </span>
        <span className="text-xs text-muted-foreground">{lead.time}</span>
      </div>
    </motion.div>
  );
}

// ─── SMS thread ───────────────────────────────────────────────────────────────

function SmsFeed({ serviceName }: { serviceName: string }) {
  const messages = [
    {
      from: "ai",
      text: `Hi! Your appointment for ${serviceName} is confirmed for tomorrow at 10am. Reply C to confirm or R to reschedule.`,
      time: "2:14 PM",
    },
    { from: "lead", text: "C", time: "2:17 PM" },
    {
      from: "ai",
      text: "You're all confirmed! We'll see you tomorrow. Our tech will call 30 min before arrival.",
      time: "2:17 PM",
    },
    { from: "lead", text: "Perfect, thank you!", time: "2:19 PM" },
  ];

  return (
    <div className="flex flex-col gap-2 text-xs">
      {messages.map((m, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 * i + 0.2 }}
          className={`flex gap-2 ${m.from === "lead" ? "flex-row-reverse" : ""}`}
        >
          {m.from === "ai" && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5"
              style={{ background: "oklch(0.58 0.22 290)", color: "#fff" }}
            >
              AI
            </div>
          )}
          <div>
            <div
              className="rounded-xl px-3 py-2 max-w-[200px] leading-relaxed"
              style={{
                background:
                  m.from === "ai"
                    ? "oklch(0.22 0.04 290 / 60%)"
                    : "oklch(0.22 0.04 155 / 40%)",
                border: `1px solid ${m.from === "ai" ? "oklch(0.58 0.22 290 / 25%)" : "oklch(0.62 0.18 155 / 25%)"}`,
                color: "oklch(0.88 0.01 280)",
              }}
            >
              {m.text}
            </div>
            <span className="text-muted-foreground text-[10px] ml-1">
              {m.time}
            </span>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-1.5 text-emerald-400 font-semibold mt-1"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Follow-up handled automatically ✓
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CrmBackOfficeSection({
  nicheData,
  isNeutral = false,
}: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<"pipeline" | "sms">("pipeline");

  useEffect(() => {
    if (isInView && !started) setStarted(true);
  }, [isInView, started]);

  // Auto-toggle tabs
  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => {
      setActiveTab((prev) => (prev === "pipeline" ? "sms" : "pipeline"));
    }, 5000);
    return () => clearInterval(t);
  }, [started]);

  const serviceName = isNeutral
    ? "Service Appointment"
    : nicheData.dashboardSample.serviceType;
  const callerName = isNeutral
    ? "Alex R."
    : nicheData.dashboardSample.callerName;
  const nicheLabel = isNeutral ? "Local Service" : nicheData.label;

  const leads: LeadCardData[] = [
    {
      name: callerName,
      service: serviceName,
      time: "Just now",
      score: 92,
      status: "hot",
    },
    {
      name: "Jamie B.",
      service: isNeutral ? "Follow-up needed" : `${nicheLabel} inquiry`,
      time: "3h ago",
      score: 67,
      status: "warm",
    },
    {
      name: "Chris M.",
      service: isNeutral ? "Initial contact" : `${nicheLabel} quote`,
      time: "Yesterday",
      score: 35,
      status: "cold",
    },
  ];

  return (
    <section
      ref={sectionRef}
      data-ocid="homepage.crm_section"
      className="relative py-20 px-4"
      style={{ background: "oklch(0.10 0.014 280)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{
              background: "oklch(0.58 0.22 240 / 12%)",
              border: "1px solid oklch(0.58 0.22 240 / 28%)",
              color: "oklch(0.78 0.16 240)",
            }}
          >
            <span>🗂️</span> Stage 4 — CRM & Back Office
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight mb-4">
            Every Lead Tracked.{" "}
            <span style={{ color: "oklch(0.72 0.16 240)" }}>
              Every Follow-Up Automated.
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            The leads your AI books go straight into your CRM, get scored
            automatically, and get followed up with personalized SMS — without
            you touching a thing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — Pipeline stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 ml-1">
              Your Pipeline Overview
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {PIPELINE_STAGES.map((stage, i) => (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={started ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="rounded-xl p-4 border text-center"
                  style={{
                    background: "oklch(0.14 0.016 280 / 0.8)",
                    borderColor: `${stage.color} / 20%`,
                    borderWidth: 1,
                  }}
                >
                  <p
                    className="text-2xl font-black mb-1"
                    style={{ color: stage.color }}
                  >
                    {stage.count}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Lead cards */}
            <div
              className="flex flex-col gap-2"
              data-ocid="homepage.crm_section.lead_list"
            >
              {leads.map((lead, i) => (
                <LeadCard
                  key={lead.name}
                  lead={lead}
                  delay={started ? 0.3 + i * 0.12 : 999}
                />
              ))}
            </div>
          </motion.div>

          {/* Right — Tabbed: SMS or Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={started ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Tab bar */}
            <div className="flex gap-2 mb-4">
              {(["pipeline", "sms"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  data-ocid={`homepage.crm_section.${tab}_tab`}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={
                    activeTab === tab
                      ? {
                          background: "oklch(0.58 0.22 290 / 20%)",
                          color: "oklch(0.84 0.18 290)",
                          border: "1px solid oklch(0.58 0.22 290 / 40%)",
                        }
                      : {
                          background: "oklch(0.14 0.016 280)",
                          color: "oklch(0.5 0.01 280)",
                          border: "1px solid oklch(1 0 0 / 8%)",
                        }
                  }
                >
                  {tab === "pipeline"
                    ? "📊 Follow-up Triggers"
                    : "📱 SMS Automation"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "pipeline" && (
                <motion.div
                  key="pipeline"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border p-5 space-y-3"
                  style={{
                    background: "oklch(0.13 0.016 280 / 0.9)",
                    borderColor: "oklch(1 0 0 / 8%)",
                  }}
                >
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Smart Follow-up Triggers
                  </p>
                  {[
                    {
                      trigger: "Email opened 3× without reply",
                      action: "Flag as Hot — send priority alert",
                      icon: "📧",
                    },
                    {
                      trigger: "Lead goes 48h without contact",
                      action: "Auto-send break-up SMS sequence",
                      icon: "⏰",
                    },
                    {
                      trigger: "Trial day 6 — no upgrade",
                      action: "Send ROI calculation + limited offer",
                      icon: "💡",
                    },
                    {
                      trigger: "5-star review received",
                      action: "Convert to social post + referral ask",
                      icon: "⭐",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.trigger}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-start gap-3 p-3 rounded-lg"
                      style={{ background: "oklch(0.16 0.02 280 / 0.6)" }}
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground leading-snug">
                          IF: {item.trigger}
                        </p>
                        <p className="text-xs font-semibold text-foreground/90 mt-0.5 leading-snug">
                          → THEN: {item.action}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "sms" && (
                <motion.div
                  key="sms"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border p-5"
                  style={{
                    background: "oklch(0.13 0.016 280 / 0.9)",
                    borderColor: "oklch(1 0 0 / 8%)",
                  }}
                  data-ocid="homepage.crm_section.sms_thread"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "oklch(0.58 0.22 290 / 30%)",
                        color: "oklch(0.84 0.18 290)",
                      }}
                    >
                      {callerName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {callerName}
                      </p>
                      <p className="text-xs text-emerald-400">
                        ✓ Auto follow-up active
                      </p>
                    </div>
                  </div>
                  <SmsFeed serviceName={serviceName} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10"
        >
          {[
            { stat: "100%", label: "Leads auto-entered in CRM", icon: "🎯" },
            {
              stat: "3×",
              label: "Faster response than manual follow-up",
              icon: "⚡",
            },
            { stat: "$0", label: "Extra staff cost to run it", icon: "💰" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={started ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="rounded-xl p-4 text-center border"
              style={{
                background: "oklch(0.14 0.016 280 / 0.8)",
                borderColor: "oklch(1 0 0 / 8%)",
              }}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <p className="text-2xl font-black text-foreground mb-1">
                {item.stat}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
