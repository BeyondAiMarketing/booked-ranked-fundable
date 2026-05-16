import { CheckCircle2, MessageSquare, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const NICHE_PRICE_OBJECTIONS: Record<string, string> = {
  plumbing:
    "Pricing depends on what we find — most repairs run $150–$400. The fastest way to get an exact number is a quick call with our tech. Want me to get you booked?",
  roofing:
    "Roof work varies by size and damage — most repairs run $300–$800. Let me get you a free inspection — zero pressure.",
  hvac: "AC repair typically runs $150–$500 depending on the issue. Diagnostics are free — want me to get a tech out tomorrow?",
  "med-spa":
    "Pricing depends on the treatment — consultations are always complimentary. Want me to book you a free consult so you can see your options?",
  "carpet-cleaning":
    "Most homes run $120–$280 depending on rooms and stains. Want a quick quote — just tell me how many rooms?",
  restoration:
    "Water damage assessments are always free — we work with your insurance. Let me get someone out today.",
  "real-estate":
    "Listing is free — we get paid at closing. Want to start with a free home valuation?",
  mortgage:
    "Rates and fees vary by loan type — the best way to know your number is a free pre-approval. Takes about 10 minutes.",
  chiropractor:
    "New patient visits are often covered by insurance. We can check your coverage before you come in — want me to book you?",
  dental:
    "We'll check your insurance first — many cleanings are fully covered. Want me to get you scheduled?",
};

const NICHE_SERVICE: Record<string, string> = {
  plumbing: "plumbing repairs",
  roofing: "roofing services",
  hvac: "HVAC repair",
  "med-spa": "med spa treatments",
  "carpet-cleaning": "carpet cleaning",
  restoration: "restoration services",
  "real-estate": "real estate help",
  mortgage: "mortgage financing",
  chiropractor: "chiropractic care",
  dental: "dental care",
};

interface ChatMsg {
  id: number;
  side: "ai" | "visitor";
  text: string;
}

interface DemoScene3ChatWidgetProps {
  businessName: string;
  niche: string;
}

export default function DemoScene3ChatWidget({
  businessName,
  niche,
}: DemoScene3ChatWidgetProps) {
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [cursorHover, setCursorHover] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    const priceResponse =
      NICHE_PRICE_OBJECTIONS[niche] ?? NICHE_PRICE_OBJECTIONS.plumbing;
    const service = NICHE_SERVICE[niche] ?? "services";

    const sequence: { delay: number; msg: ChatMsg }[] = [
      {
        delay: 3780,
        msg: {
          id: 1,
          side: "ai",
          text: `Hey! Looking for ${service} in your area? I can get you a free estimate in 2 minutes.`,
        },
      },
      {
        delay: 11025,
        msg: { id: 2, side: "visitor", text: "How much does it usually cost?" },
      },
      { delay: 17325, msg: { id: 3, side: "ai", text: priceResponse } },
      {
        delay: 26775,
        msg: { id: 4, side: "visitor", text: "Sure, sounds good" },
      },
      {
        delay: 31500,
        msg: {
          id: 5,
          side: "ai",
          text: "Great! What's your name and best phone number? I'll have someone reach out shortly.",
        },
      },
      {
        delay: 37800,
        msg: { id: 6, side: "visitor", text: "Alex — 555-0192" },
      },
      {
        delay: 42525,
        msg: {
          id: 7,
          side: "ai",
          text: `You're all set, Alex! ${businessName} will reach out shortly to confirm. Talk soon!`,
        },
      },
    ];

    setWidgetOpen(false);
    setCursorHover(false);
    setMessages([]);
    setCaptured(false);
    let cancelled = false;

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        if (!cancelled) setCursorHover(true);
      }, 1890),
    );
    timers.push(
      setTimeout(() => {
        if (!cancelled) setWidgetOpen(true);
      }, 3150),
    );

    for (const { delay, msg } of sequence) {
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setMessages((m) => [...m, msg]);
          if (msg.id === 7) setCaptured(true);
        }, delay),
      );
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [niche, businessName]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Browser chrome */}
        <div className="bg-slate-800 border-b border-white/8 px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 bg-slate-700/50 rounded-md px-3 py-1 text-[10px] text-slate-500 font-mono">
            yourbusiness.com
          </div>
        </div>

        {/* Page area */}
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 h-56 overflow-hidden">
          <div className="p-6">
            <div className="h-3 bg-white/8 rounded-full w-2/3 mb-2" />
            <div className="h-2 bg-white/5 rounded-full w-1/2 mb-4" />
            <div className="h-8 bg-indigo-600/40 rounded-lg w-32" />
          </div>

          {/* Chat widget button */}
          <AnimatePresence>
            {!widgetOpen && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: cursorHover ? 1.1 : 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute bottom-4 right-4 w-12 h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-900/60 flex items-center justify-center"
              >
                <MessageSquare size={20} className="text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">1</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat panel */}
          <AnimatePresence>
            {widgetOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.75 }}
                className="absolute bottom-2 right-2 w-60 bg-slate-900 border border-white/12 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="bg-indigo-700 px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-white font-semibold truncate max-w-[120px]">
                      {businessName}
                    </span>
                  </div>
                  <X size={12} className="text-white/60" />
                </div>

                <div className="p-2.5 space-y-2 max-h-40 overflow-y-auto">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`flex ${msg.side === "ai" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] text-[10px] px-2.5 py-1.5 rounded-xl leading-relaxed ${
                            msg.side === "ai"
                              ? "bg-slate-800 text-slate-300"
                              : "bg-indigo-600 text-white"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {captured && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mx-2 mb-2 bg-emerald-500/15 border border-emerald-500/30 rounded-lg p-1.5 flex items-center gap-1.5"
                  >
                    <CheckCircle2
                      size={10}
                      className="text-emerald-400 shrink-0"
                    />
                    <span className="text-[9px] text-emerald-300 font-semibold">
                      Lead Captured ✓
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
