/**
 * TrialCloseSection — Hormozi value stack + Kennedy urgency countdown.
 * Bottom-of-page close. Single button, countdown timer, nothing else.
 * The "obvious yes" — $1,132/mo value for $0 for 7 days.
 */

import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, Timer } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// ─── Value Stack ──────────────────────────────────────────────────────────────

interface StackItem {
  key: string;
  label: string;
  value: string;
}

const VALUE_STACK: StackItem[] = [
  {
    key: "voice",
    label: "AI Inbound Voice Agent — answers every call, books appointments",
    value: "$297/mo",
  },
  {
    key: "reviews",
    label: "Automated Review Requests — 5-star reputation on autopilot",
    value: "$97/mo",
  },
  {
    key: "credit",
    label: "Business Credit Builder — fundability score + action plan",
    value: "$197/mo",
  },
  {
    key: "crm",
    label: "CRM + Pipeline View — kanban, timeline, smart follow-ups",
    value: "$147/mo",
  },
  {
    key: "social",
    label: "Social Media Week of Content — 7 days of AI-scheduled posts",
    value: "$297/mo",
  },
  {
    key: "audit",
    label: "Personalized Audit Report — emailed + saved to your dashboard",
    value: "$97/mo",
  },
];

const TOTAL_VALUE = "$1,132/mo";

// ─── Countdown unit config ────────────────────────────────────────────────────

const TIME_UNIT_CONFIGS = [
  { key: "timer-h", hasSep: true },
  { key: "timer-m", hasSep: true },
  { key: "timer-s", hasSep: false },
] as const;

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function CountdownTimer() {
  const [totalSecs, setTotalSecs] = useState(23 * 3600 + 47 * 60 + 12);

  useEffect(() => {
    const id = setInterval(() => {
      setTotalSecs((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  const unitValues = [h, m, s];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="flex items-center gap-1.5 font-mono"
      aria-live="polite"
      aria-label="Time remaining for offer"
    >
      {TIME_UNIT_CONFIGS.map((cfg, unitIdx) => (
        <span key={cfg.key} className="flex items-center gap-1">
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-lg text-xl font-black text-white"
            style={{ background: "oklch(0.18 0.04 280)" }}
          >
            {pad(unitValues[unitIdx] ?? 0)}
          </span>
          {cfg.hasSep && (
            <span className="text-xl font-black text-muted-foreground">:</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TrialCloseSection() {
  const navigate = useNavigate();

  function handleStartTrial() {
    void navigate({ to: "/demo" });
  }

  return (
    <section
      className="w-full py-20 px-4 relative overflow-hidden"
      style={{ background: "oklch(0.09 0.015 280)" }}
      aria-label="Start your 7-day free trial"
      data-ocid="homepage.trial_close_section"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.58 0.22 290 / 50%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.58 0.22 290 / 50%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-8"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest border"
          style={{
            background: "oklch(0.62 0.18 75 / 15%)",
            borderColor: "oklch(0.62 0.18 75 / 40%)",
            color: "oklch(0.72 0.18 75)",
          }}
        >
          <Timer className="w-3.5 h-3.5" />
          Limited Time — 7-Day Free Trial
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-foreground text-center leading-tight">
          Everything You Need to Run Your Business
          <br />
          <span style={{ color: "var(--purple-light)" }}>
            on Complete Autopilot.
          </span>
        </h2>

        {/* Hormozi value stack */}
        <motion.div
          className="w-full rounded-2xl border border-border overflow-hidden"
          style={{ background: "oklch(0.13 0.014 280)" }}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="px-5 py-3 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              What's included in your free trial
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {VALUE_STACK.map((item, itemIdx) => (
              <motion.div
                key={item.key}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + itemIdx * 0.07 }}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                    style={{
                      background: "oklch(0.62 0.18 155 / 20%)",
                      color: "oklch(0.62 0.18 155)",
                    }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-sm text-foreground leading-snug min-w-0">
                    {item.label}
                  </span>
                </div>
                <span
                  className="flex-shrink-0 text-sm font-bold tabular-nums"
                  style={{ color: "oklch(0.62 0.18 155)" }}
                >
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between px-5 py-4 border-t"
            style={{
              borderColor: "oklch(0.58 0.22 290 / 30%)",
              background: "oklch(0.16 0.03 285)",
            }}
          >
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Total Value
              </p>
              <p className="text-xl font-black text-foreground line-through opacity-50">
                {TOTAL_VALUE}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--purple-light)" }}
              >
                Your cost for 7 days
              </p>
              <p className="text-3xl font-black text-white">$0</p>
            </div>
          </div>
        </motion.div>

        {/* Kennedy urgency — countdown */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            This offer expires in
          </p>
          <CountdownTimer />
          <p className="text-xs text-muted-foreground max-w-xs text-center leading-snug">
            Free trial slots are limited. Once this timer hits zero, the next
            available slot opens in 24 hours.
          </p>
        </motion.div>

        {/* Primary CTA — the only button on this screen */}
        <motion.div
          className="w-full flex flex-col items-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleStartTrial}
            className="h-14 w-full max-w-md text-base font-black gap-3 rounded-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.2 270))",
              color: "#fff",
              boxShadow:
                "0 0 40px oklch(0.58 0.22 290 / 40%), 0 8px 32px oklch(0 0 0 / 40%)",
            }}
            data-ocid="homepage.trial_close_cta_button"
            aria-label="Start my 7-day free trial — no credit card required"
          >
            <Lock className="w-4 h-4 flex-shrink-0" />
            Start My 7-Day Free Trial — No Credit Card Required
            <ArrowRight className="w-4 h-4 flex-shrink-0 ml-auto" />
          </Button>

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <span aria-hidden="true">🔒</span> Bank-level security
            </span>
            <span className="flex items-center gap-1">
              <span aria-hidden="true">✓</span> Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <span aria-hidden="true">📧</span> Audit report emailed instantly
            </span>
          </div>
        </motion.div>

        {/* Social proof closer */}
        <motion.div
          className="w-full rounded-2xl border border-border p-5 flex items-start gap-4"
          style={{ background: "oklch(0.13 0.014 280)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white"
            style={{ background: "var(--purple-accent)" }}
            aria-hidden="true"
          >
            JR
          </div>
          <div className="min-w-0">
            <p className="text-sm text-foreground leading-snug">
              "I almost didn't sign up because I'd tried other software before.
              The AI answered my first test call perfectly — I was sold in 60
              seconds."
            </p>
            <p className="text-xs text-muted-foreground mt-1.5 font-semibold">
              — James R., Ridge Top Roofing · Started trial 3 days ago · Now a
              paying subscriber
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
