import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const NICHE_NEEDS: Record<string, string> = {
  plumbing: "emergency plumbing help ASAP",
  roofing: "someone to look at roof damage",
  hvac: "AC repair first thing tomorrow",
  "med-spa": "a consultation booked this week",
  "carpet-cleaning": "carpets cleaned before the weekend",
  restoration: "water damage assessment",
  "real-estate": "to talk to an agent about listing my home",
  mortgage: "help getting pre-approved",
  chiropractor: "to schedule an adjustment",
  dental: "to get in for a toothache",
};

const NICHE_AIRESPONSE: Record<string, string> = {
  plumbing:
    "We have an emergency tech available tonight. Can I get your address and confirm a 2-hour arrival window?",
  roofing:
    "We can have an inspector out tomorrow morning for a free assessment. What's a good time — 8am or 10am?",
  hvac: "Our next available slot is 8am tomorrow. I'll book you in and send a confirmation. Can I get your address?",
  "med-spa":
    "We have a complimentary consultation available Thursday at 2pm or Friday at 11am — which works better?",
  "carpet-cleaning":
    "We can fit you in Saturday morning. How many rooms, and any tough stains we should know about?",
  restoration:
    "We can have an assessment team out within 2 hours. Is the water still active or has it been stopped?",
  "real-estate":
    "Happy to help! Are you looking for a market value estimate first, or ready to set up a listing appointment?",
  mortgage:
    "Happy to help! I can get you pre-qualified in about 10 minutes over the phone — when's a good time to connect?",
  chiropractor:
    "We have a new patient opening at 9am tomorrow. Would you like me to reserve it and send you intake paperwork?",
  dental:
    "We can see you tomorrow morning for an emergency evaluation. Any allergies or existing dental work I should note?",
};

interface DemoScene2TextBackProps {
  businessName: string;
  niche: string;
}

interface MsgLine {
  id: number;
  side: "out" | "in";
  text: string;
}

type Phase = "missed" | "timer" | "chat" | "done";

export default function DemoScene2TextBack({
  businessName,
  niche,
}: DemoScene2TextBackProps) {
  const [phase, setPhase] = useState<Phase>("missed");
  const [countdown, setCountdown] = useState(8);
  const [messages, setMessages] = useState<MsgLine[]>([]);

  useEffect(() => {
    const need = NICHE_NEEDS[niche] ?? NICHE_NEEDS.plumbing;
    const aiReply = NICHE_AIRESPONSE[niche] ?? NICHE_AIRESPONSE.plumbing;

    setPhase("missed");
    setCountdown(8);
    setMessages([]);
    let cancelled = false;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    timers.push(
      setTimeout(() => {
        if (!cancelled) setPhase("timer");
      }, 2520),
    );

    const countdownInterval = setInterval(() => {
      if (cancelled) return;
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    intervals.push(countdownInterval);

    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        setPhase("chat");
        setMessages([
          {
            id: 1,
            side: "out",
            text: `Hey, sorry we missed your call! This is ${businessName} — we're available 24/7 via text. What can we help you with?`,
          },
        ]);
      }, 28980),
    );

    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        setMessages((m) => [
          ...m,
          { id: 2, side: "in", text: `I need ${need}` },
        ]);
      }, 36225),
    );

    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        setMessages((m) => [...m, { id: 3, side: "out", text: aiReply }]);
      }, 42525),
    );

    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        setPhase("done");
      }, 48825),
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [niche, businessName]);

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto gap-5">
      <div className="w-full bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/60">
        {/* Status bar */}
        <div className="bg-slate-800 px-5 py-2 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">11:47 PM</span>
          <span className="text-[10px] text-slate-400">📶 🔋</span>
        </div>

        {/* Missed call notification */}
        <AnimatePresence>
          {(phase === "missed" || phase === "timer") && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-3 mt-3 bg-slate-800 border border-white/8 rounded-2xl p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center">
                <span className="text-lg" role="img" aria-label="Missed call">
                  📵
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  Missed call from Unknown
                </div>
                <div className="text-[10px] text-slate-400">11:47 PM</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown timer */}
        {phase === "timer" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-3 mt-2 mb-1 flex items-center justify-center gap-2 py-2"
          >
            <div className="relative w-8 h-8">
              <svg
                className="w-8 h-8 -rotate-90"
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="rgba(99,102,241,0.2)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="rgb(99,102,241)"
                  strokeWidth="3"
                  strokeDasharray={`${(1 - countdown / 8) * 94.2} 94.2`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                {countdown}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              AI responding in {countdown}s…
            </span>
          </motion.div>
        )}

        {/* SMS thread */}
        <div className="px-3 py-3 min-h-[180px] space-y-2">
          {(phase === "chat" || phase === "done") && (
            <div className="text-center mb-2">
              <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                Text Message · {businessName}
              </span>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.675 }}
                className={`flex ${msg.side === "out" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] text-xs px-3 py-2 rounded-2xl leading-relaxed ${
                    msg.side === "out"
                      ? "bg-indigo-700 text-white rounded-bl-sm"
                      : "bg-slate-700 text-slate-200 rounded-br-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Done badge */}
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-3 mb-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-2"
          >
            <CheckCircle2 size={14} className="text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-emerald-300">
                Lead Booked ✓
              </div>
              <div className="text-[10px] text-slate-400">
                Full exchange: 3 min 42 sec · Time: 11:51 PM
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
