// DemoStep3TextBack — Missed call → SMS → booked appointment animation
// Framework: Deiss (before/after/bridge — the transformation sequence)

import { useDemoFlow } from "@/hooks/useDemoFlow";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface SMSMessage {
  from: "caller" | "brf";
  text: string;
  delay: number;
}

const MESSAGES: SMSMessage[] = [
  {
    from: "caller",
    text: "📞 Incoming call — missed (went to voicemail)",
    delay: 0,
  },
  {
    from: "brf",
    text: "Hi! We saw you called Metro Plumbing. We'd love to help! Click to book: bookedrankedfunded.org/setup 🔧",
    delay: 1200,
  },
  {
    from: "caller",
    text: "Yes, I need a quote for a burst pipe. Can someone come today?",
    delay: 2600,
  },
  {
    from: "brf",
    text: "Absolutely! I have a technician available this afternoon. Click here to confirm your 2pm slot: bookedrankedfunded.org/setup",
    delay: 4200,
  },
  {
    from: "caller",
    text: "Done! Just booked it. Thank you so much!",
    delay: 5800,
  },
];

export default function DemoStep3TextBack() {
  const { demoProspect, setStepComplete } = useDemoFlow();
  const businessName = demoProspect?.businessName ?? "Your Business";
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [showBooked, setShowBooked] = useState(false);
  const [started, setStarted] = useState(false);

  const runSequence = () => {
    if (started) return;
    setStarted(true);
    MESSAGES.forEach((msg, i) => {
      setTimeout(() => setVisibleMessages(i + 1), msg.delay + 400);
    });
    setTimeout(
      () => {
        setShowBooked(true);
        setStepComplete(true);
      },
      MESSAGES[MESSAGES.length - 1].delay + 2000,
    );
  };

  // Replace placeholder with real business name
  const replaceBusinessName = (text: string) =>
    text.replace("Metro Plumbing", businessName);

  return (
    <div
      className="flex flex-col items-center gap-6"
      data-ocid="demo.step3.section"
    >
      {/* Header */}
      <div className="text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "oklch(0.58 0.22 290)" }}
        >
          Missed Call Recovery
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          That Missed Call Just Became
          <br />
          <span style={{ color: "oklch(0.78 0.16 290)" }}>
            a Booked Appointment
          </span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: "oklch(0.65 0.02 280)" }}>
          BRF fires an SMS the instant a call goes unanswered — and books the
          job.
        </p>
      </div>

      {/* Phone mockup */}
      <div
        className="w-full max-w-xs rounded-[2rem] overflow-hidden"
        style={{
          background: "oklch(0.1 0.012 280)",
          border: "1px solid oklch(0.58 0.22 290 / 30%)",
          boxShadow:
            "0 24px 48px oklch(0 0 0 / 50%), 0 0 0 8px oklch(0.58 0.22 290 / 8%)",
        }}
      >
        {/* Phone chrome top */}
        <div
          className="flex items-center justify-center py-2"
          style={{ background: "oklch(0.13 0.012 280)" }}
        >
          <div
            className="w-16 h-1 rounded-full"
            style={{ background: "oklch(0.3 0.02 280)" }}
          />
        </div>

        {/* Header bar */}
        <div
          className="px-4 py-3 flex items-center gap-3 border-b"
          style={{
            borderColor: "oklch(1 0 0 / 8%)",
            background: "oklch(0.13 0.014 285)",
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
            }}
          >
            BRF
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{businessName}</p>
            <p
              className="text-[10px]"
              style={{ color: "oklch(0.62 0.18 155)" }}
            >
              ● AI Agent Active
            </p>
          </div>
        </div>

        {/* SMS thread */}
        <div className="p-3 space-y-2 min-h-56">
          {!started && (
            <div className="flex flex-col items-center justify-center h-44 gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: "oklch(0.6 0.22 25 / 15%)",
                  border: "1px solid oklch(0.6 0.22 25 / 25%)",
                }}
              >
                📞
              </div>
              <p
                className="text-xs text-center"
                style={{ color: "oklch(0.5 0.02 280)" }}
              >
                A call just went to voicemail…
              </p>
            </div>
          )}

          <AnimatePresence>
            {MESSAGES.slice(0, visibleMessages).map((msg, i) => {
              const isMissedCall = i === 0;
              return (
                <motion.div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable order
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 18, stiffness: 280 }}
                  className={`flex ${msg.from === "brf" ? "justify-end" : "justify-start"}`}
                >
                  {isMissedCall ? (
                    <div
                      className="mx-auto text-center rounded-xl px-3 py-2 text-[10px]"
                      style={{
                        background: "oklch(0.6 0.22 25 / 12%)",
                        color: "oklch(0.72 0.18 25)",
                        border: "1px solid oklch(0.6 0.22 25 / 20%)",
                      }}
                    >
                      {replaceBusinessName(msg.text)}
                    </div>
                  ) : (
                    <div
                      className="max-w-[80%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed"
                      style={
                        msg.from === "brf"
                          ? {
                              background: "oklch(0.58 0.22 290)",
                              color: "white",
                            }
                          : {
                              background: "oklch(0.2 0.016 280)",
                              color: "oklch(0.88 0.01 280)",
                            }
                      }
                    >
                      {replaceBusinessName(msg.text)}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* BOOKED badge */}
          <AnimatePresence>
            {showBooked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="flex justify-center py-2"
                data-ocid="demo.step3.booked_state"
              >
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black"
                  style={{
                    background: "oklch(0.62 0.18 155 / 15%)",
                    color: "oklch(0.78 0.14 155)",
                    border: "1px solid oklch(0.62 0.18 155 / 30%)",
                  }}
                >
                  <span>✓</span>
                  APPOINTMENT BOOKED
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom action */}
        {!started && (
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={runSequence}
              data-ocid="demo.step3.watch_button"
              className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.52 0.24 295))",
                boxShadow: "0 8px 20px oklch(0.58 0.22 290 / 40%)",
              }}
            >
              📲 Watch It Happen
            </button>
          </div>
        )}
      </div>

      {/* Stat badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center px-6 py-3 rounded-2xl max-w-sm"
        style={{
          background: "oklch(0.58 0.22 290 / 8%)",
          border: "1px solid oklch(0.58 0.22 290 / 20%)",
        }}
      >
        <p
          className="text-xs font-semibold"
          style={{ color: "oklch(0.75 0.14 290)" }}
        >
          💡 Businesses using BRF recover{" "}
          <strong className="text-white">73% of missed calls</strong> as booked
          appointments
        </p>
      </motion.div>
    </div>
  );
}
