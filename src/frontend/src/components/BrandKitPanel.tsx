// ── BrandKitPanel ─────────────────────────────────────────────────────────────
// Two exports:
//   default BrandKitPanel — rich personalized kit landing experience for prospects
//   BrandKitColorPanel   — website studio color/logo brand kit tool for clients

import {
  Bot,
  Check,
  Mic,
  Palette,
  RotateCcw,
  Save,
  Send,
  Upload,
  Volume2,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ClientWebsiteConfig } from "../data/nicheWebsiteData";
import { useBrandKit } from "../hooks/useBrandKit";
import { getNicheGreeting, useVoiceAgent } from "../hooks/useVoiceAgent";
import type { BrandKitNiche, BrandKitProspect } from "../types/brandKit";
import {
  NICHE_COLORS,
  NICHE_LABELS,
  NICHE_SAMPLE_POSTS,
  NICHE_TAGLINES,
  computeNicheAuditScore,
} from "../types/brandKit";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

// ─── Rich Prospect Kit Panel ──────────────────────────────────────────────────

// Score dial sub-component
function ScoreDial({ label, value }: { label: string; value: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    const duration = 1000;
    function animate(ts: number) {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplayed(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const dash = (displayed / 100) * circ;
  const scoreColor =
    displayed >= 70 ? "#22c55e" : displayed >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className="-rotate-90"
          aria-label={`${label}: ${displayed}`}
          role="img"
        >
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ filter: `drop-shadow(0 0 4px ${scoreColor}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-foreground leading-none">
            {displayed}
          </span>
        </div>
      </div>
      <span
        className="text-[10px] text-center leading-tight"
        style={{ color: "oklch(0.52 0.01 280)" }}
      >
        {label}
      </span>
    </div>
  );
}

// Qualifying questions per niche for voice demo
const NICHE_QUESTIONS: Record<BrandKitNiche, [string, string]> = {
  plumber: [
    "What plumbing issue are you dealing with today?",
    "How long has this been a problem?",
  ],
  "med-spa": [
    "What treatment are you most interested in?",
    "Have you had this service done before?",
  ],
  hvac: [
    "Is this an emergency repair or a routine service?",
    "What type of HVAC system do you have?",
  ],
  restoration: [
    "What type of damage — water, fire, or mold?",
    "How long ago did this happen?",
  ],
  "carpet-cleaning": [
    "How many rooms would you like cleaned?",
    "Any stains or pet odors we should know about?",
  ],
  roofing: [
    "Are you looking for a repair or a full replacement?",
    "Has there been recent storm damage in your area?",
  ],
  "real-estate": [
    "Are you looking to buy, sell, or both?",
    "What's your ideal timeline to move?",
  ],
  mortgage: [
    "Is this for a purchase or a refinance?",
    "Do you have a target loan amount in mind?",
  ],
  chiropractor: [
    "Are you dealing with back pain, neck pain, or something else?",
    "Have you seen a chiropractor before?",
  ],
  dental: [
    "Are you looking for a routine cleaning or a specific concern?",
    "When was your last dental visit?",
  ],
};

type CallStage = "ringing" | "greeting" | "qualifying" | "cta";

// Mini voice demo modal
function VoiceAgentModal({
  prospect,
  onClose,
  onActivate,
}: {
  prospect: BrandKitProspect;
  onClose: () => void;
  onActivate: () => void;
}) {
  const [stage, setStage] = useState<CallStage>("ringing");
  const [rings, setRings] = useState(0);
  const questions = NICHE_QUESTIONS[prospect.niche];

  useEffect(() => {
    if (stage === "ringing") {
      const timers = [
        setTimeout(() => setRings(1), 800),
        setTimeout(() => setRings(2), 1600),
        setTimeout(() => setRings(3), 2400),
        setTimeout(() => setStage("greeting"), 3400),
      ];
      return () => timers.forEach(clearTimeout);
    }
    if (stage === "greeting") {
      const t = setTimeout(() => setStage("qualifying"), 2200);
      return () => clearTimeout(t);
    }
    if (stage === "qualifying") {
      const t = setTimeout(() => setStage("cta"), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [stage]);

  const ringDots = ".".repeat(rings);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        aria-label="Close"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        data-ocid="brand_kit_panel.voice_modal.dialog"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <span className="font-semibold text-foreground text-sm flex items-center gap-2">
            <span className="text-base">📞</span> Live AI Voice Demo
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
            aria-label="Close"
            data-ocid="brand_kit_panel.voice_modal.close_button"
          >
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-5">
          <AnimatePresence mode="wait">
            {stage === "ringing" && (
              <motion.div
                key="ringing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.2,
                    }}
                    className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <span className="text-3xl">📞</span>
                  </motion.div>
                  {([0, 1, 2] as const).map((i) => (
                    <motion.div
                      key={`ring-wave-${i}`}
                      className="absolute inset-0 rounded-full border-2 border-primary/30"
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {prospect.businessName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {`Calling your AI agent${ringDots}`}
                  </p>
                </div>
              </motion.div>
            )}
            {stage !== "ringing" && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                    🤖
                  </div>
                  <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground leading-relaxed">
                    Hello, you've reached{" "}
                    <strong>{prospect.businessName}</strong>. How can I help you
                    today?
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground italic">
                  (Qualifying your call...)
                </p>
                <AnimatePresence>
                  {(stage === "qualifying" || stage === "cta") && (
                    <motion.div
                      key="q1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                        🤖
                      </div>
                      <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground">
                        {questions[0]}
                      </div>
                    </motion.div>
                  )}
                  {stage === "cta" && (
                    <motion.div
                      key="q2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                        🤖
                      </div>
                      <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground">
                        {questions[1]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {stage === "cta" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3 pt-2"
            >
              <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-xs text-muted-foreground">
                This is your AI agent — answering like this{" "}
                <strong className="text-foreground">24/7</strong>.
              </div>
              <button
                type="button"
                onClick={onActivate}
                data-ocid="brand_kit_panel.voice_modal.confirm_button"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 310))",
                }}
              >
                Claim Your Free Demo →
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Audit modal
function AuditModal({
  prospect,
  onClose,
  onActivate,
}: {
  prospect: BrandKitProspect;
  onClose: () => void;
  onActivate: () => void;
}) {
  const auditScore = computeNicheAuditScore(prospect.niche, prospect.city);
  const [animating, setAnimating] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAnimating(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        aria-label="Close"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        data-ocid="brand_kit_panel.audit_modal.dialog"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <span className="font-semibold text-foreground text-sm">
            📊 Free Business Audit — {prospect.businessName}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
            aria-label="Close"
            data-ocid="brand_kit_panel.audit_modal.close_button"
          >
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall score */}
          <div className="text-center">
            <div
              className="text-5xl font-black mb-1"
              style={{
                color:
                  auditScore.overall >= 70
                    ? "#22c55e"
                    : auditScore.overall >= 50
                      ? "#f59e0b"
                      : "#ef4444",
              }}
            >
              {animating ? "—" : auditScore.overall}
              <span className="text-2xl text-muted-foreground font-normal">
                /100
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Overall Score for{" "}
              <strong className="text-foreground">{prospect.city}</strong>{" "}
              {NICHE_LABELS[prospect.niche]} market
            </p>
          </div>

          {/* Score grid */}
          <div className="grid grid-cols-4 gap-3">
            <ScoreDial label="SEO" value={auditScore.seo} />
            <ScoreDial label="Conversion" value={auditScore.conversion} />
            <ScoreDial label="Reputation" value={auditScore.reputation} />
            <ScoreDial label="Content" value={auditScore.content} />
          </div>

          {/* Top opportunity */}
          <div
            className="rounded-xl p-4"
            style={{
              background: `${NICHE_COLORS[prospect.niche].primary}12`,
              border: `1px solid ${NICHE_COLORS[prospect.niche].primary}28`,
            }}
          >
            <p className="text-xs font-semibold text-foreground mb-1">
              🎯 Your Top Opportunity
            </p>
            <p className="text-xs text-muted-foreground">
              {auditScore.conversion < 55
                ? "Your website conversion rate is below the industry benchmark. BRF's AI-powered CTAs and booking flows typically add 2–4 booked calls per week."
                : auditScore.seo < 55
                  ? "Your SEO score suggests you're not showing up when customers search for your services. BRF's local SEO engine targets your exact city and niche."
                  : "Your reputation score has room to grow. BRF's automated review request flow can add 8–15 new 5-star reviews per month."}
            </p>
          </div>

          <button
            type="button"
            onClick={onActivate}
            data-ocid="brand_kit_panel.audit_modal.confirm_button"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 310))",
            }}
          >
            Claim My Free Trial to Fix These →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── In-Browser Voice Agent (compact, for BrandKitPanel) ─────────────────────

function InBrowserVoiceAgentMini({
  businessName,
  niche,
  nicheColor,
}: {
  businessName: string;
  niche: string;
  nicheColor: { primary: string; accent: string };
}) {
  const greetingText = getNicheGreeting(niche, businessName);

  const { isSpeaking, hasSpoken, supported, speak } = useVoiceAgent({
    text: greetingText,
    autoPlayDelayMs: 1800,
  });

  return (
    <div
      className="rounded-xl border border-border p-4 space-y-3"
      style={{ background: "oklch(0.14 0.016 280)" }}
      data-ocid="brand_kit_panel.voice_greeting.panel"
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={isSpeaking ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
            boxShadow: isSpeaking ? `0 0 16px ${nicheColor.primary}60` : "none",
          }}
        >
          {isSpeaking ? (
            <Mic size={14} className="text-white" />
          ) : (
            <Volume2 size={14} className="text-white" />
          )}
        </motion.div>
        <div
          className={`flex-1 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs leading-relaxed transition-all duration-300 ${
            isSpeaking ? "text-white" : "text-foreground"
          }`}
          style={{
            background: isSpeaking
              ? "oklch(0.22 0.06 285)"
              : "oklch(0.19 0.018 280)",
            border: isSpeaking ? `1px solid ${nicheColor.primary}40` : "none",
          }}
        >
          {greetingText}
        </div>
      </div>

      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            key="mini-waveform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-0.5 py-1"
            aria-label="Speaking"
          >
            {(["a", "b", "c", "d", "e", "f", "g", "h"] as const).map(
              (id, i) => (
                <motion.div
                  key={`mini-wave-${id}`}
                  className="w-[3px] rounded-full"
                  style={{ background: nicheColor.primary }}
                  animate={{
                    height: [
                      "3px",
                      `${8 + Math.abs(Math.sin(i * 0.8)) * 10}px`,
                      "3px",
                    ],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: "easeInOut",
                  }}
                />
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] text-muted-foreground">
          {!supported
            ? "🔊 Your AI greeting is ready"
            : hasSpoken
              ? "🔊 Played in browser — no phone needed"
              : isSpeaking
                ? "🔊 Auto-playing your AI greeting…"
                : "🔊 Press play to hear your greeting"}
        </p>
        <button
          type="button"
          onClick={speak}
          disabled={isSpeaking}
          data-ocid="brand_kit_panel.voice_greeting.replay_button"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all disabled:opacity-50"
          style={{
            background: `${nicheColor.primary}18`,
            border: `1px solid ${nicheColor.primary}35`,
            color: nicheColor.primary,
          }}
        >
          <Volume2 size={10} />
          {isSpeaking ? "Playing…" : hasSpoken ? "Replay" : "▶ Play"}
        </button>
      </div>
    </div>
  );
}

// ─── Demo Agent Chat (compact, for BrandKitPanel) ────────────────────────────

type PanelChatMessage = { role: "agent" | "user"; text: string };

function getDemoReplyForPanel(
  input: string,
  niche: string,
  businessName: string,
  city: string,
): string {
  const lower = input.toLowerCase();

  const nicheReplies: Record<
    string,
    Record<string, (n: string, c: string) => string>
  > = {
    plumber: {
      "leak|pipe|drain|water": (n, c) =>
        `Got it — water issue. We handle leaks, pipe repairs, and drain clogs for ${c} homes. Want me to get a plumber out from ${n} today?`,
      "toilet|clog|flush": (n) =>
        `A clogged toilet is no fun! ${n} can usually get someone out same-day. Want to schedule?`,
    },
    roofing: {
      "roof|damage|shingle|storm": (n) =>
        `Roof damage is serious. ${n} offers free inspections and works with most insurance companies. Book today?`,
      "replace|quote": (n, c) =>
        `We'd love to get you a free estimate! A ${n} specialist can visit in ${c} within 24 hours.`,
    },
    hvac: {
      "ac|air|heat|furnace|cold|hot": (n, c) =>
        `Temperature issues are miserable! ${n} handles AC and furnace service in ${c}. Get a tech out today?`,
      "maintenance|tune|filter": (n) =>
        `Regular tune-ups prevent breakdowns. I can schedule one with ${n} — most take under an hour.`,
    },
    "med-spa": {
      "botox|filler|facial|treatment|skin": (n) =>
        `${n}'s specialists offer free consultations to find the right treatment for your goals. Book this week?`,
      "price|cost|how much": (n) =>
        `Consultations at ${n} are free and there's no pressure. Want to schedule a time this week?`,
    },
    "carpet-cleaning": {
      "carpet|stain|clean|rug": (n, c) =>
        `${n} serves ${c} with same-week appointments. How many rooms are you looking to clean?`,
      "pet|odor|smell": (n) =>
        `Pet odors are our specialty at ${n} — we eliminate them completely. Want a quote?`,
    },
    restoration: {
      "water|flood|damage|mold|fire|smoke": (n, c) =>
        `This needs immediate attention. ${n} is available 24/7 in ${c} — crew on-site within the hour.`,
      "insurance|claim": (n) =>
        `We work directly with insurance companies at ${n} and handle all documentation. What's your best contact number?`,
    },
    "real-estate": {
      "buy|home|house|listing": (n, c) =>
        `${n} has deep ${c} market knowledge. Are you pre-approved, or would you like a lender recommendation?`,
      "sell|list": (n, c) =>
        `${n} can prepare a free market analysis for your home in ${c}. When would be a good time to connect?`,
    },
    mortgage: {
      "rate|loan|refinance": (n) =>
        `The best way to find your rate is with a quick 10-minute pre-qual through ${n}. Want to schedule that?`,
      "qualify|afford|down": (n) =>
        `${n} works with first-time buyers all the time. I can get you a free consultation today.`,
    },
    chiropractor: {
      "back|neck|pain|spine|adjustment": (n) =>
        `${n} offers same-week new patient appointments. Many feel relief after the first visit. Want to book?`,
      "insurance|covered": (n) =>
        `${n} works with most major plans. Want me to check your coverage while booking your appointment?`,
    },
    dental: {
      "teeth|tooth|cleaning|cavity|dental": (n) =>
        `${n} accepts new patients and has appointments this week. Routine cleaning or specific concern?`,
      "insurance|cost": (n) =>
        `We can verify your coverage before your visit to ${n}. Want to schedule and check benefits at the same time?`,
    },
  };

  const nicheMap = nicheReplies[niche] ?? {};
  for (const [pattern, fn] of Object.entries(nicheMap)) {
    if (pattern.split("|").some((kw) => lower.includes(kw)))
      return fn(businessName, city);
  }

  const universals: Array<[string[], (n: string) => string]> = [
    [
      ["price", "cost", "how much"],
      (n) =>
        `Great question! I can have someone from ${n} call you with an exact quote within the hour. Can I get your name and best number?`,
    ],
    [
      ["appointment", "book", "schedule"],
      (n) =>
        `I'd love to get you scheduled at ${n}! We have openings this week. What day works best?`,
    ],
    [
      ["emergency", "urgent", "asap"],
      (n) =>
        `This is urgent — flagging it as a priority. Someone from ${n} will call you back within 15 minutes.`,
    ],
    [
      ["hours", "open", "close"],
      (n) =>
        `${n} is available Mon–Sat 7am–7pm, and I'm here 24/7. What do you need help with?`,
    ],
    [
      ["hello", "hi", "hey"],
      (n) =>
        `Hi there! Thanks for reaching out to ${n}. How can I help you today?`,
    ],
  ];

  for (const [keywords, fn] of universals) {
    if (keywords.some((kw) => lower.includes(kw))) return fn(businessName);
  }

  return `Thanks for that! Let me make sure the right person from ${businessName} gets back to you. Can I grab your name and best number?`;
}

function DemoAgentChatMini({
  businessName,
  niche,
  city,
  nicheColor,
  onActivate,
}: {
  businessName: string;
  niche: string;
  city: string;
  nicheColor: { primary: string; accent: string };
  onActivate: () => void;
}) {
  const [messages, setMessages] = useState<PanelChatMessage[]>([
    {
      role: "agent",
      text: `Hi! I'm the AI agent for ${businessName}. How can I help you today?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
    setTimeout(
      () => {
        const reply = getDemoReplyForPanel(text, niche, businessName, city);
        setMessages((prev) => [...prev, { role: "agent", text: reply }]);
        setIsTyping(false);
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          80,
        );
      },
      800 + Math.random() * 500,
    );
  }, [inputValue, niche, businessName, city]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const prompts = [
    "How much does it cost?",
    "Book an appointment",
    "Emergency service?",
  ];

  return (
    <div
      className="rounded-xl overflow-hidden border border-border"
      style={{ background: "oklch(0.12 0.014 280)" }}
      data-ocid="brand_kit_panel.demo_chat.panel"
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${nicheColor.primary}15, ${nicheColor.accent}08)`,
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
          }}
        >
          <Bot size={12} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-foreground truncate">
            {businessName} AI Agent
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div
        className="p-3 space-y-2.5 overflow-y-auto"
        style={{ height: "200px" }}
        data-ocid="brand_kit_panel.demo_chat.messages"
      >
        {messages.map((msg) => (
          <div
            key={`${msg.role}-${msg.text.slice(0, 18)}`}
            className={`flex gap-1.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "agent" && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${nicheColor.primary}25` }}
              >
                <Bot size={9} style={{ color: nicheColor.primary }} />
              </div>
            )}
            <div
              className="max-w-[85%] px-2.5 py-1.5 rounded-lg text-[11px] leading-relaxed"
              style={
                msg.role === "agent"
                  ? {
                      background: "oklch(0.19 0.018 280)",
                      color: "var(--foreground)",
                      borderTopLeftRadius: "3px",
                    }
                  : {
                      background: nicheColor.primary,
                      color: "#fff",
                      borderTopRightRadius: "3px",
                    }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-1.5 items-end">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `${nicheColor.primary}25` }}
            >
              <Bot size={9} style={{ color: nicheColor.primary }} />
            </div>
            <div
              className="flex gap-1 px-2.5 py-2 rounded-lg"
              style={{
                background: "oklch(0.19 0.018 280)",
                borderTopLeftRadius: "3px",
              }}
              aria-label="Typing"
            >
              {[0, 1, 2].map((d) => (
                <motion.div
                  key={`panel-dot-${d}`}
                  className="w-1 h-1 rounded-full"
                  style={{ background: nicheColor.primary }}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.7,
                    delay: d * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-3 pb-1.5 flex flex-wrap gap-1">
          {prompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setInputValue(p);
                setTimeout(() => inputRef.current?.focus(), 30);
              }}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors"
              style={{
                background: `${nicheColor.primary}12`,
                border: `1px solid ${nicheColor.primary}30`,
                color: nicheColor.primary,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex gap-2 px-3 py-2.5 border-t border-border"
        style={{ background: "oklch(0.11 0.012 280)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type as a caller…"
          className="flex-1 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          data-ocid="brand_kit_panel.demo_chat.input"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!inputValue.trim() || isTyping}
          data-ocid="brand_kit_panel.demo_chat.send_button"
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
          }}
          aria-label="Send"
        >
          <Send size={10} className="text-white" />
        </button>
      </div>

      {/* Footer CTA */}
      <div
        className="px-3 py-2.5 border-t border-border text-center"
        style={{ background: "oklch(0.11 0.012 280)" }}
      >
        <button
          type="button"
          onClick={onActivate}
          data-ocid="brand_kit_panel.demo_chat.activate_button"
          className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold text-white transition-all hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
          }}
        >
          Activate This Agent For My Business →
        </button>
        <p className="text-[9px] text-muted-foreground mt-1">
          Powered by{" "}
          <strong className="text-foreground/70">{businessName}</strong> AI
          Agent
        </p>
      </div>
    </div>
  );
}

// ── Main BrandKitPanel Component ──────────────────────────────────────────────

export interface BrandKitPanelProps {
  prospect: BrandKitProspect;
  onClaimTrial: (action: string) => void;
}

export default function BrandKitPanel({
  prospect,
  onClaimTrial,
}: BrandKitPanelProps) {
  const { activateTrial } = useBrandKit();
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  const nicheColor = NICHE_COLORS[prospect.niche];
  const tagline = NICHE_TAGLINES[prospect.niche];
  const samplePosts = NICHE_SAMPLE_POSTS[prospect.niche];
  const auditScore = computeNicheAuditScore(prospect.niche, prospect.city);
  const urlSlug = prospect.businessName.toLowerCase().replace(/\s+/g, "");

  const colorPalette = [
    { label: "Primary", hex: nicheColor.primary },
    { label: "Accent", hex: nicheColor.accent },
    { label: "Dark", hex: "#0f0f1a" },
    { label: "Text", hex: "#f8f8fc" },
  ];

  const handleVoiceActivate = useCallback(() => {
    setShowVoiceModal(false);
    if (prospect.trialStatus === "NotStarted") {
      activateTrial(prospect.kitPageSlug, "voice_agent_tested");
    }
    onClaimTrial("voice_agent_tested");
  }, [prospect, activateTrial, onClaimTrial]);

  const handleAuditActivate = useCallback(() => {
    setShowAuditModal(false);
    if (prospect.trialStatus === "NotStarted") {
      activateTrial(prospect.kitPageSlug, "audit_run");
    }
    onClaimTrial("audit_run");
  }, [prospect, activateTrial, onClaimTrial]);

  const heroGradient = `linear-gradient(135deg, ${nicheColor.primary}cc 0%, ${nicheColor.accent}88 60%, oklch(0.12 0.012 280) 100%)`;

  return (
    <div className="text-foreground" data-ocid="brand_kit_panel.panel">
      {/* ── 1. Hero Section ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl mb-6"
        style={{ background: heroGradient }}
        data-ocid="brand_kit_panel.hero.section"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
            style={{ background: nicheColor.primary }}
          />
        </div>
        <div className="relative z-10 px-6 py-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold mb-4">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#4ade80" }}
            />
            Your brand kit is ready
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2">
            {prospect.firstName}, Your{" "}
            <span className="opacity-90">{NICHE_LABELS[prospect.niche]}</span>{" "}
            Brand Kit is Ready
          </h1>
          <p className="text-white/75 text-base mb-6 max-w-xl">{tagline}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onClaimTrial("hero_primary_cta")}
              data-ocid="brand_kit_panel.hero.primary_button"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 310))",
              }}
            >
              {prospect.trialStatus === "NotStarted"
                ? "Start Your Free 7-Day Trial →"
                : "Enter Your Trial Dashboard →"}
            </button>
            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              data-ocid="brand_kit_panel.hero.voice_agent_button"
              className="flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.45)" }}
            >
              📞 Test My AI Agent
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── 2. Website Preview Card ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl border border-border bg-card overflow-hidden mb-6"
        data-ocid="brand_kit_panel.website.section"
      >
        <div
          className="px-5 py-4"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}20, ${nicheColor.accent}10)`,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h2 className="text-base font-bold text-foreground">
            🌐 Your {NICHE_LABELS[prospect.niche]} Website — Pre-Built & Ready
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Personalize with your info in minutes
          </p>
        </div>
        <div className="p-5">
          {/* Browser mockup */}
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-background rounded h-5 px-2 flex items-center">
                <span className="text-[10px] text-muted-foreground">
                  {urlSlug}.com
                </span>
              </div>
            </div>
            {/* Mini page hero */}
            <div
              className="relative px-6 py-8 text-white"
              style={{
                background: `linear-gradient(135deg, ${nicheColor.primary}cc, ${nicheColor.accent}88)`,
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10">
                <div className="text-[11px] font-bold uppercase tracking-widest opacity-75 mb-1">
                  {NICHE_LABELS[prospect.niche]} · {prospect.city}
                </div>
                <div className="text-lg font-black">
                  {prospect.businessName}
                </div>
                <div className="text-sm opacity-75 mt-0.5">{tagline}</div>
                <div
                  className="mt-3 inline-block px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  Get a Free Quote →
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-between px-4 py-2 bg-card text-xs"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span
                className="font-semibold"
                style={{ color: nicheColor.primary }}
              >
                {prospect.businessName}
              </span>
              <div className="flex gap-3 text-muted-foreground">
                <span>Services</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => onClaimTrial("website_preview_cta")}
              data-ocid="brand_kit_panel.website.customize_button"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
              }}
            >
              Customize My Website →
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── 3. Color Palette ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="rounded-2xl border border-border bg-card p-5 mb-6"
        data-ocid="brand_kit_panel.palette.section"
      >
        <h2 className="text-base font-bold text-foreground mb-4">
          🎨 Your Brand Color Palette
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {colorPalette.map(({ label, hex }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <div
                className="h-12 rounded-xl border border-white/10"
                style={{ background: hex }}
              />
              <div className="text-[10px] font-semibold text-center text-muted-foreground">
                {label}
              </div>
              <div className="text-[9px] text-center font-mono text-muted-foreground/60">
                {hex.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── 4. Voice Agent Preview ────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-5 mb-6"
        data-ocid="brand_kit_panel.voice.section"
      >
        <h2 className="text-base font-bold text-foreground mb-1">
          📞 Your AI Voice Agent
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Hear your greeting right now — no phone call needed
        </p>

        {/* Audio greeting — auto-plays in browser */}
        <InBrowserVoiceAgentMini
          businessName={prospect.businessName}
          niche={prospect.niche}
          nicheColor={nicheColor}
        />

        {/* Interactive typed demo */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">
            💬 Try talking to your agent:
          </p>
          <DemoAgentChatMini
            businessName={prospect.businessName}
            niche={prospect.niche}
            city={prospect.city}
            nicheColor={nicheColor}
            onActivate={() => {
              if (prospect.trialStatus === "NotStarted") {
                handleVoiceActivate();
              } else {
                onClaimTrial("demo_chat_activate");
              }
            }}
          />
        </div>

        {/* Legacy phone modal trigger */}
        <button
          type="button"
          onClick={() => setShowVoiceModal(true)}
          data-ocid="brand_kit_panel.voice.test_button"
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
          }}
        >
          📞 Full Call Simulation →
        </button>
      </motion.section>

      {/* ── 5. Free Audit CTA ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="rounded-2xl border border-border overflow-hidden mb-6"
        style={{
          background: `linear-gradient(135deg, ${nicheColor.primary}12, ${nicheColor.accent}08)`,
          borderColor: `${nicheColor.primary}35`,
        }}
        data-ocid="brand_kit_panel.audit.section"
      >
        <div className="p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground mb-1">
                📊 Free Business Audit
              </h2>
              <p className="text-xs text-muted-foreground">
                See exactly where you're losing leads in{" "}
                <strong className="text-foreground">{prospect.city}</strong>
              </p>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-black"
                style={{
                  color:
                    auditScore.overall >= 70
                      ? "#22c55e"
                      : auditScore.overall >= 50
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              >
                {auditScore.overall}
              </div>
              <div className="text-[9px] text-muted-foreground">/ 100</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAuditModal(true)}
            data-ocid="brand_kit_panel.audit.open_modal_button"
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
            }}
          >
            Get Your Free Business Audit →
          </button>
        </div>
      </motion.section>

      {/* ── 6. Sample Social Posts ────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-5 mb-6"
        data-ocid="brand_kit_panel.social.section"
      >
        <h2 className="text-base font-bold text-foreground mb-1">
          📅 Your Social Media Posts — Ready to Publish
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          AI-written, niche-specific posts scheduled for your business
        </p>
        <div className="space-y-3" data-ocid="brand_kit_panel.social.list">
          {samplePosts.slice(0, 3).map((post, i) => {
            const platforms = ["Facebook", "Instagram", "Google Business"];
            const platform = platforms[i % 3];
            return (
              <motion.div
                key={`social-post-${platform}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="relative rounded-xl border border-border overflow-hidden"
                data-ocid={`brand_kit_panel.social.item.${i + 1}`}
              >
                {/* Blurred post content */}
                <div
                  className="p-4 select-none"
                  style={{ filter: "blur(2.5px)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: nicheColor.primary }}
                    >
                      {prospect.businessName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        {prospect.businessName}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {platform} · Scheduled
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">
                    {post
                      .replace("Your Business", prospect.businessName)
                      .slice(0, 100)}
                    …
                  </p>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                  <div
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: `${nicheColor.primary}22`,
                      border: `1px solid ${nicheColor.primary}44`,
                      color: nicheColor.primary,
                    }}
                  >
                    ⚡ Unlock in your trial
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => onClaimTrial("social_calendar_cta")}
            data-ocid="brand_kit_panel.social.schedule_button"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 310))",
            }}
          >
            Schedule All Posts in My Trial →
          </button>
        </div>
      </motion.section>

      {/* ── 7. Claim Your Free Demo ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.06 290), oklch(0.24 0.08 310), oklch(0.14 0.04 280))",
        }}
        data-ocid="brand_kit_panel.cta.section"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 rounded-full opacity-15 blur-3xl"
            style={{ background: "oklch(0.58 0.22 290)" }}
          />
        </div>
        <div className="relative z-10 p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">
            {prospect.trialStatus === "NotStarted"
              ? "Ready to See BRF in Action?"
              : `Welcome back, ${prospect.firstName}!`}
          </h2>
          <p className="text-white/65 mb-6 text-sm">
            {prospect.trialStatus === "NotStarted"
              ? "No credit card. No setup fees. Just your business, fully powered."
              : "Your trial is active. Jump into your dashboard to explore everything."}
          </p>
          <button
            type="button"
            onClick={() => onClaimTrial("kit_panel_cta")}
            data-ocid="brand_kit_panel.cta.primary_button"
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-black text-white shadow-2xl transition-all hover:opacity-90 hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.24 290), oklch(0.52 0.22 310))",
              boxShadow:
                "0 0 40px oklch(0.58 0.22 290 / 40%), 0 8px 30px rgba(0,0,0,0.4)",
            }}
          >
            {prospect.trialStatus === "NotStarted"
              ? "Claim Your Free Demo →"
              : "Go to My Trial Dashboard →"}
          </button>
          <p className="mt-4 text-xs text-white/40">
            ⚡ Kit generated for{" "}
            <strong className="text-white/60">{prospect.businessName}</strong>
          </p>
        </div>
      </motion.section>

      {/* Modals */}
      <AnimatePresence>
        {showVoiceModal && (
          <VoiceAgentModal
            prospect={prospect}
            onClose={() => setShowVoiceModal(false)}
            onActivate={handleVoiceActivate}
          />
        )}
        {showAuditModal && (
          <AuditModal
            prospect={prospect}
            onClose={() => setShowAuditModal(false)}
            onActivate={handleAuditActivate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── BrandKitColorPanel (website studio) ─────────────────────────────────────
// Previously the default export — now a named export for ClientMyWebsitePage.

export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  savedAt: number;
}

const STORAGE_KEY = "brf_brand_kits";

function loadBrandKits(tenantId: string): BrandKit[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${tenantId}`);
    return raw ? (JSON.parse(raw) as BrandKit[]) : [];
  } catch {
    return [];
  }
}

function saveBrandKits(tenantId: string, kits: BrandKit[]): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${tenantId}`, JSON.stringify(kits));
  } catch {
    /* empty */
  }
}

interface BrandKitColorPanelProps {
  tenantId: string;
  config: ClientWebsiteConfig;
  websitePrimaryColor: string;
  websiteAccentColor: string;
  onApply: (kit: {
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
  }) => void;
}

export function BrandKitColorPanel({
  tenantId,
  config,
  websitePrimaryColor,
  websiteAccentColor,
  onApply,
}: BrandKitColorPanelProps) {
  const logoRef = useRef<HTMLInputElement>(null);

  const [primary, setPrimary] = useState(
    config.customizations.primaryColor ?? websitePrimaryColor,
  );
  const [accent, setAccent] = useState(
    config.customizations.accentColor ?? websiteAccentColor,
  );
  const [logoPreview, setLogoPreview] = useState<string | undefined>(
    config.customizations.logoUrl,
  );
  const [kitName, setKitName] = useState("My Brand Kit");
  const [savedKits, setSavedKits] = useState<BrandKit[]>(() =>
    loadBrandKits(tenantId),
  );
  const [showPreview, setShowPreview] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    onApply({
      primaryColor: primary,
      accentColor: accent,
      logoUrl: logoPreview,
    });
    setApplied(true);
    setShowPreview(false);
    setTimeout(() => setApplied(false), 2500);
    toast.success("Brand kit applied across all pages");
  };

  const handleSaveKit = () => {
    const kit: BrandKit = {
      id: `kit_${Date.now()}`,
      name: kitName.trim() || "My Brand Kit",
      primaryColor: primary,
      accentColor: accent,
      logoUrl: logoPreview,
      savedAt: Date.now(),
    };
    const updated = [
      kit,
      ...savedKits.filter((k) => k.name !== kit.name),
    ].slice(0, 5);
    setSavedKits(updated);
    saveBrandKits(tenantId, updated);
    toast.success(`"${kit.name}" saved`);
  };

  const handleRestoreKit = (kit: BrandKit) => {
    setPrimary(kit.primaryColor);
    setAccent(kit.accentColor);
    if (kit.logoUrl) setLogoPreview(kit.logoUrl);
    toast.success(`"${kit.name}" loaded — click Apply to activate`);
  };

  const currentPrimary =
    config.customizations.primaryColor ?? websitePrimaryColor;
  const currentAccent = config.customizations.accentColor ?? websiteAccentColor;
  const hasChanges = primary !== currentPrimary || accent !== currentAccent;

  return (
    <div className="space-y-4" data-ocid="brand_kit.panel">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs text-muted-foreground">Primary Color</Label>
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
              style={{ background: primary }}
            />
            <input
              type="color"
              value={primary}
              onChange={(e) => {
                setPrimary(e.target.value);
                setApplied(false);
              }}
              className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
              data-ocid="brand_kit.primary_color_input"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs text-muted-foreground">Accent Color</Label>
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
              style={{ background: accent }}
            />
            <input
              type="color"
              value={accent}
              onChange={(e) => {
                setAccent(e.target.value);
                setApplied(false);
              }}
              className="w-8 h-6 rounded cursor-pointer border-0 bg-transparent"
              data-ocid="brand_kit.accent_color_input"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Logo</Label>
        {logoPreview && (
          <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center h-10 mb-1">
            <img
              src={logoPreview}
              alt="Brand logo"
              className="h-8 object-contain"
            />
          </div>
        )}
        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => logoRef.current?.click()}
          data-ocid="brand_kit.logo_upload_button"
        >
          <Upload size={11} className="mr-1.5" />
          {logoPreview ? "Change Logo" : "Upload Logo"}
        </Button>
      </div>

      {hasChanges && (
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/10 text-[11px] text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
          data-ocid="brand_kit.preview_toggle"
        >
          <Palette size={11} />
          {showPreview ? "Hide" : "Preview"} color change
        </button>
      )}

      {showPreview && hasChanges && (
        <div className="rounded-xl overflow-hidden border border-white/10 text-[10px]">
          <div className="px-3 py-1.5 bg-white/5 font-semibold text-muted-foreground uppercase tracking-widest">
            Before → After
          </div>
          <div className="flex">
            <div className="flex-1 p-3 space-y-1.5">
              <div
                className="h-6 rounded-md"
                style={{ background: currentPrimary }}
              />
              <div
                className="h-4 rounded-md opacity-60"
                style={{ background: currentAccent }}
              />
              <div className="text-muted-foreground text-[9px] text-center">
                Current
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex-1 p-3 space-y-1.5">
              <div
                className="h-6 rounded-md ring-1 ring-violet-500/50"
                style={{ background: primary }}
              />
              <div
                className="h-4 rounded-md opacity-60 ring-1 ring-violet-500/30"
                style={{ background: accent }}
              />
              <div className="text-muted-foreground text-[9px] text-center">
                New
              </div>
            </div>
          </div>
        </div>
      )}

      <Button
        className="w-full text-sm"
        onClick={handleApply}
        disabled={applied}
        data-ocid="brand_kit.apply_button"
        style={
          applied
            ? undefined
            : {
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
              }
        }
      >
        {applied ? (
          <>
            <Check size={13} className="mr-1.5 text-emerald-400" />
            Applied to all pages
          </>
        ) : (
          <>
            <Wand2 size={13} className="mr-1.5" />
            Apply Brand Kit
          </>
        )}
      </Button>

      <div className="flex gap-1.5">
        <input
          type="text"
          value={kitName}
          onChange={(e) => setKitName(e.target.value)}
          placeholder="Kit name…"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50"
          data-ocid="brand_kit.name_input"
        />
        <Button
          variant="outline"
          size="sm"
          className="text-xs px-2.5"
          onClick={handleSaveKit}
          data-ocid="brand_kit.save_kit_button"
        >
          <Save size={11} />
        </Button>
      </div>

      {savedKits.length > 0 && (
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Saved Kits
          </Label>
          {savedKits.map((kit) => (
            <div
              key={kit.id}
              className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-white/4 border border-white/8"
              data-ocid={`brand_kit.saved_kit.${kit.id}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex gap-0.5 flex-shrink-0">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: kit.primaryColor }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: kit.accentColor }}
                  />
                </div>
                <span className="text-[10px] text-foreground/80 truncate">
                  {kit.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRestoreKit(kit)}
                className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 flex-shrink-0 transition-colors"
                data-ocid={`brand_kit.restore_button.${kit.id}`}
              >
                <RotateCcw size={9} />
                Load
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
