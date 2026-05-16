import { CheckCircle2, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const NICHE_EMERGENCY: Record<string, string> = {
  plumbing:
    "Yes — we handle emergency calls 24/7. Are you dealing with a burst pipe, backup, or leak?",
  roofing:
    "Absolutely — we do emergency tarping and storm response. Is your roof actively leaking right now?",
  hvac: "Yes, we do emergency HVAC service. Is your system completely down or just not cooling properly?",
  "med-spa":
    "We have same-week openings for urgent consultations. What are you looking to address?",
  "carpet-cleaning":
    "Yes — we do same-day service for urgent situations. How many rooms and what's the issue?",
  restoration:
    "Yes — we respond to water and fire emergencies 24/7. Is this an active situation?",
  "real-estate":
    "Yes — I work with buyers and sellers in urgent situations. Are you buying, selling, or both?",
  mortgage:
    "Yes — we can fast-track pre-approvals for time-sensitive purchases. Are you under contract?",
  chiropractor:
    "Yes — we have same-day appointments for acute pain. How severe is your discomfort?",
  dental:
    "Yes — we see dental emergencies the same day. Are you in pain right now?",
};

const NICHE_EMERGENCY_Q: Record<string, string> = {
  plumbing: "Do you handle emergency plumbing calls?",
  roofing: "Do you respond to emergency roof damage?",
  hvac: "Is emergency HVAC service available today?",
  "med-spa": "Can I get an urgent consultation this week?",
  "carpet-cleaning": "Do you do same-day carpet cleaning?",
  restoration: "Is emergency restoration available 24/7?",
  "real-estate": "I need to buy or sell urgently — can you help?",
  mortgage: "I need a pre-approval immediately — possible?",
  chiropractor: "I'm in severe pain — do you have today?",
  dental: "I have a dental emergency — can I come in today?",
};

interface SocialMsg {
  id: number;
  side: "customer" | "ai";
  text: string;
  timestamp?: string;
}

type Phase = "idle" | "fb1" | "fb3" | "ig_notify" | "ig1" | "summary";

interface DemoScene4SocialProps {
  businessName: string;
  niche: string;
}

export default function DemoScene4Social({
  businessName,
  niche,
}: DemoScene4SocialProps) {
  const [fbMsgs, setFbMsgs] = useState<SocialMsg[]>([]);
  const [igMsgs, setIgMsgs] = useState<SocialMsg[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [fbCaptured, setFbCaptured] = useState(false);
  const [igCaptured, setIgCaptured] = useState(false);

  useEffect(() => {
    const emergencyQ = NICHE_EMERGENCY_Q[niche] ?? NICHE_EMERGENCY_Q.plumbing;
    const emergencyA = NICHE_EMERGENCY[niche] ?? NICHE_EMERGENCY.plumbing;
    void businessName; // businessName is used inside closures but not directly in effect deps

    setFbMsgs([]);
    setIgMsgs([]);
    setPhase("idle");
    setFbCaptured(false);
    setIgCaptured(false);
    let cancelled = false;

    type ScheduleEntry = [number, () => void];
    const schedule: ScheduleEntry[] = [
      [1260, () => setPhase("fb1")],
      [
        1260,
        () =>
          setFbMsgs([
            {
              id: 1,
              side: "customer",
              text: emergencyQ,
              timestamp: "just now",
            },
          ]),
      ],
      [
        6930,
        () =>
          setFbMsgs((m) => [
            ...m,
            { id: 2, side: "ai", text: emergencyA, timestamp: "0 seconds" },
          ]),
      ],
      [
        13860,
        () =>
          setFbMsgs((m) => [
            ...m,
            { id: 3, side: "customer", text: "How fast can you get here?" },
          ]),
      ],
      [
        19530,
        () =>
          setFbMsgs((m) => [
            ...m,
            {
              id: 4,
              side: "ai",
              text: "We have availability tonight. Want me to confirm your address and get someone dispatched?",
            },
          ]),
      ],
      [
        25200,
        () => {
          setPhase("fb3");
          setFbCaptured(true);
        },
      ],
      [29925, () => setPhase("ig_notify")],
      [
        29925,
        () =>
          setIgMsgs([
            { id: 1, side: "customer", text: "What are your prices?" },
          ]),
      ],
      [37170, () => setPhase("ig1")],
      [
        37170,
        () =>
          setIgMsgs((m) => [
            ...m,
            {
              id: 2,
              side: "ai",
              text: "Great question — pricing depends on the job. The fastest way to get an exact number is a free 10-minute consult. Want me to schedule one now?",
            },
          ]),
      ],
      [
        44730,
        () =>
          setIgMsgs((m) => [
            ...m,
            { id: 3, side: "customer", text: "Sure, Thursday works" },
          ]),
      ],
      [
        50400,
        () =>
          setIgMsgs((m) => [
            ...m,
            {
              id: 4,
              side: "ai",
              text: "Perfect — Thursday is confirmed. You'll receive a reminder text the morning of. Talk soon!",
            },
          ]),
      ],
      [
        56070,
        () => {
          setPhase("summary");
          setIgCaptured(true);
        },
      ],
    ];

    const timers = schedule.map(([delay, fn]) =>
      setTimeout(() => {
        if (!cancelled) fn();
      }, delay),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [niche, businessName]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      {/* Facebook Messenger Panel */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden">
        <div className="bg-[#1877F2]/20 border-b border-[#1877F2]/30 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center text-[11px] font-bold text-white">
              f
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                Facebook Messages — {businessName}
              </div>
              <div className="text-[10px] text-slate-400">via Messenger</div>
            </div>
          </div>
          {fbCaptured && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            >
              <CheckCircle2 size={9} /> Lead Captured ✓
            </motion.div>
          )}
        </div>
        <div className="p-3 space-y-2 min-h-[120px]">
          <AnimatePresence>
            {fbMsgs.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`flex ${msg.side === "ai" ? "justify-start" : "justify-end"} items-end gap-1.5`}
              >
                {msg.side === "ai" && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={10} className="text-white" />
                  </div>
                )}
                <div className="flex flex-col max-w-[80%]">
                  {msg.timestamp && msg.side === "ai" && (
                    <span className="text-[9px] text-slate-600 mb-0.5">
                      instant · {msg.timestamp}
                    </span>
                  )}
                  <div
                    className={`text-xs px-3 py-1.5 rounded-2xl leading-relaxed ${
                      msg.side === "ai"
                        ? "bg-indigo-900/50 border border-indigo-500/20 text-slate-200 rounded-bl-sm"
                        : "bg-[#1877F2]/30 text-slate-200 rounded-br-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Instagram Panel */}
      <AnimatePresence>
        {(phase === "ig_notify" || phase === "ig1" || phase === "summary") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-b border-purple-500/20 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-white">IG</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Instagram DM — {businessName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    via Direct Message
                  </div>
                </div>
              </div>
              {igCaptured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >
                  <CheckCircle2 size={9} /> Lead Captured ✓
                </motion.div>
              )}
            </div>
            <div className="p-3 space-y-2 min-h-[80px]">
              <AnimatePresence>
                {igMsgs.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`flex ${msg.side === "ai" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] text-xs px-3 py-1.5 rounded-2xl leading-relaxed ${
                        msg.side === "ai"
                          ? "bg-purple-900/40 border border-purple-500/20 text-slate-200 rounded-bl-sm"
                          : "bg-gradient-to-br from-purple-600/50 to-pink-600/50 text-white rounded-br-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary badge */}
      <AnimatePresence>
        {phase === "summary" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-indigo-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                2 leads captured across 2 platforms
              </div>
              <div className="text-xs text-slate-400">
                Your time invested: 0 minutes
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
