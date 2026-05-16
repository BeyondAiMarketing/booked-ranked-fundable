/**
 * CallTextBackSection — Stage 5 (last feature section) on the homepage.
 * Positioned as a safety-net fallback, NOT the hero feature.
 * "And if the agent ever misses a call after hours, BRF fires an automatic text back."
 */

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export default function CallTextBackSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      data-ocid="homepage.call_text_back_section"
      className="relative py-16 px-4"
      style={{ background: "oklch(0.09 0.01 280)" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-center gap-10"
        >
          {/* Left — copy */}
          <div className="flex-1 min-w-0">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{
                background: "oklch(0.62 0.18 155 / 10%)",
                border: "1px solid oklch(0.62 0.18 155 / 25%)",
                color: "oklch(0.72 0.14 155)",
              }}
            >
              <span>🛡️</span> Safety Net — Never Lose a Lead
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-4">
              And If a Call Ever Slips Through?{" "}
              <span style={{ color: "oklch(0.72 0.14 155)" }}>
                BRF Fires an Automatic Text Back in Seconds.
              </span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-5">
              Your AI agent handles the vast majority of calls — but for any
              call that lands after hours or during an edge case, BRF's
              automated call-text-back fires within seconds. The lead never
              waits. The job never walks to your competitor.
            </p>
            <ul className="space-y-2">
              {[
                "Fires automatically within 8 seconds of a missed call",
                "Personalized message with your business name",
                "Lead replies → conversation thread opens in your CRM",
                "Appointment booked directly from the SMS thread",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-emerald-400 flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div
              className="mt-6 rounded-xl px-4 py-3 border text-sm font-semibold"
              style={{
                background: "oklch(0.14 0.016 280 / 0.7)",
                borderColor: "oklch(0.62 0.18 155 / 20%)",
                color: "oklch(0.78 0.14 155)",
              }}
            >
              💡 Think of it as your AI's backup system — so your business never
              bleeds a lead, even in the rare edge case.
            </div>
          </div>

          {/* Right — mini SMS demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-shrink-0 w-full lg:w-72"
          >
            <div
              className="rounded-2xl border p-5"
              style={{
                background: "oklch(0.14 0.016 280 / 0.9)",
                borderColor: "oklch(1 0 0 / 8%)",
              }}
              data-ocid="homepage.call_text_back_section.demo_card"
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "oklch(0.48 0.22 25 / 25%)",
                    color: "oklch(0.72 0.18 25)",
                  }}
                >
                  📵
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Missed call detected
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +1 (555) 732-4491
                  </p>
                </div>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.48 0.22 25 / 15%)",
                    color: "oklch(0.72 0.18 25)",
                    border: "1px solid oklch(0.48 0.22 25 / 30%)",
                  }}
                >
                  Missed
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                BRF auto-text firing in 8s…
              </div>

              {/* AI outbound SMS */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5"
                    style={{
                      background: "oklch(0.58 0.22 290)",
                      color: "#fff",
                    }}
                  >
                    AI
                  </div>
                  <div
                    className="rounded-xl px-3 py-2 text-xs flex-1 leading-relaxed"
                    style={{
                      background: "oklch(0.22 0.04 290 / 50%)",
                      border: "1px solid oklch(0.58 0.22 290 / 20%)",
                      color: "oklch(0.88 0.01 280)",
                    }}
                  >
                    Hi! This is the AI at Your Business. We noticed you called —
                    how can we help? Reply to book an appointment.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div
                    className="rounded-xl px-3 py-2 text-xs max-w-[75%] leading-relaxed"
                    style={{
                      background: "oklch(0.22 0.04 155 / 40%)",
                      border: "1px solid oklch(0.62 0.18 155 / 25%)",
                      color: "oklch(0.88 0.01 280)",
                    }}
                  >
                    Hi! Yes I need service, are you available today?
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: "oklch(0.72 0.14 155)" }}
                >
                  <span className="text-emerald-400">✓</span>
                  Lead recovered — booking in progress
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
