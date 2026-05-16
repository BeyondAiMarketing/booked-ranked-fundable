/**
 * DemoStep3Chat — FULL REWRITE
 *
 * AI Chat Widget Booking Simulation — Act 1, Step 3.
 *
 * Flow:
 *   1. Pain point stat shown first (niche-specific about missed web leads)
 *   2. Mock website background with floating chat widget (bottom-right)
 *   3. Auto-starts conversation after 1.5s
 *   4. 5-line scripted chat: customer asks → agent handles → books → confirms
 *   5. After final confirmation: full-screen GreenConfirmOverlay
 *   6. After overlay: "See Your Back Office →" CTA advances to step 4
 *
 * Framework badge: Deiss "Value-First Sequence"
 */

import { FRAMEWORK_BADGES } from "@/data/demoFlowData";
import { useDemoFlow } from "@/hooks/useDemoFlow";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import FrameworkBadge from "./FrameworkBadge";
import GreenConfirmOverlay from "./GreenConfirmOverlay";
import PainPointStat from "./PainPointStat";

// ─── Niche chat conversations ─────────────────────────────────────────────────

interface ChatMsg {
  id: number;
  role: "user" | "agent";
  text: string;
}

const NICHE_CONVOS: Record<string, (biz: string) => ChatMsg[]> = {
  plumber: (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Hi! Welcome to ${biz}. Are you dealing with an emergency or scheduling a service?`,
    },
    {
      id: 2,
      role: "user",
      text: "Do you have availability this week for a burst pipe under the sink?",
    },
    {
      id: 3,
      role: "agent",
      text: `Absolutely — ${biz} handles plumbing emergencies 24/7. I have openings today at 2 PM and tomorrow at 9 AM. Which works best?`,
    },
    { id: 4, role: "user", text: "The 2 PM slot works for me!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Booked! ${biz} will have a licensed plumber at your door today at 2 PM. Sending confirmation to your phone now.`,
    },
  ],
  "med-spa": (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Welcome to ${biz}! Are you looking to schedule a consultation or asking about treatments?`,
    },
    {
      id: 2,
      role: "user",
      text: "Hi! Do you have availability this week for a Botox consultation?",
    },
    {
      id: 3,
      role: "agent",
      text: `Absolutely! I have openings at ${biz} on Thursday at 2 PM and Friday at 10 AM. Which works best?`,
    },
    { id: 4, role: "user", text: "The Thursday 2 PM slot works for me!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Perfect! Your complimentary Botox consultation at ${biz} is booked for Thursday at 2 PM. Confirmation text sent!`,
    },
  ],
  hvac: (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Hi! You've reached ${biz}. Need emergency HVAC service or looking to schedule maintenance?`,
    },
    {
      id: 2,
      role: "user",
      text: "Do you have availability this week for an AC tune-up?",
    },
    {
      id: 3,
      role: "agent",
      text: `Yes! ${biz} has openings this Wednesday at 11 AM and Thursday at 3 PM. Which works for you?`,
    },
    { id: 4, role: "user", text: "Wednesday at 11 AM is perfect!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Done! Your AC tune-up with ${biz} is confirmed for Wednesday at 11 AM. SMS confirmation sent!`,
    },
  ],
  restoration: (biz) => [
    {
      id: 1,
      role: "agent",
      text: `${biz} here — 24/7 emergency restoration. How can we help?`,
    },
    {
      id: 2,
      role: "user",
      text: "Do you have availability this week for a water damage assessment?",
    },
    {
      id: 3,
      role: "agent",
      text: `${biz} can have a certified crew out tomorrow at 9 AM or 2 PM. Which works?`,
    },
    { id: 4, role: "user", text: "Tomorrow at 9 AM please!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Scheduled! ${biz} assessment crew confirmed for tomorrow at 9 AM. Confirmation sent — we'll document everything for your insurance.`,
    },
  ],
  roofing: (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Welcome to ${biz}! Looking for a free inspection or have storm damage?`,
    },
    {
      id: 2,
      role: "user",
      text: "Hi! Do you have availability this week for a free roof inspection?",
    },
    {
      id: 3,
      role: "agent",
      text: `Absolutely! ${biz} offers free inspections. I have Thursday at 10 AM or Friday at 2 PM. Which works?`,
    },
    { id: 4, role: "user", text: "Thursday at 10 AM works!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Booked! Your free roof inspection with ${biz} is set for Thursday at 10 AM. Confirmation on its way!`,
    },
  ],
  "carpet-cleaning": (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Hi! Welcome to ${biz}. Are you looking for a residential deep clean or commercial carpet cleaning?`,
    },
    {
      id: 2,
      role: "user",
      text: "I need a deep clean for my entire house — 4 bedrooms, living room, and stairs.",
    },
    {
      id: 3,
      role: "agent",
      text: `${biz} can handle that completely! I have openings this Saturday at 9 AM or Monday at 1 PM. Which works best for you?`,
    },
    { id: 4, role: "user", text: "Saturday morning at 9 AM is perfect!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Booked! ${biz} deep-clean crew is confirmed for Saturday at 9 AM. Expect your place to look brand new — confirmation text on its way!`,
    },
  ],
  "real-estate": (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Welcome to ${biz}! Are you thinking about listing your home, or are you looking to buy?`,
    },
    {
      id: 2,
      role: "user",
      text: "We're thinking about selling our home and want to know what it's worth right now.",
    },
    {
      id: 3,
      role: "agent",
      text: `Great timing! I can schedule a free home valuation with one of our top agents at ${biz}. I have Wednesday at 11 AM or Thursday at 4 PM. Which works?`,
    },
    { id: 4, role: "user", text: "Wednesday at 11 AM sounds great!" },
    {
      id: 5,
      role: "agent",
      text: `✅ You're all set! Your free home valuation with ${biz} is confirmed for Wednesday at 11 AM. We'll see you then — confirmation sent to your phone!`,
    },
  ],
  mortgage: (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Hello and welcome to ${biz}! Are you looking to refinance your current mortgage, or are you a first-time buyer?`,
    },
    {
      id: 2,
      role: "user",
      text: "I'm a first-time buyer and not sure where to start — I'd love to understand my options.",
    },
    {
      id: 3,
      role: "agent",
      text: `We love working with first-time buyers at ${biz}! I can book you a free 30-minute consultation. I have Tuesday at 10 AM or Friday at 2 PM available. Which works?`,
    },
    { id: 4, role: "user", text: "Friday at 2 PM works perfectly for me." },
    {
      id: 5,
      role: "agent",
      text: `✅ Done! Your free first-time buyer consultation at ${biz} is confirmed for Friday at 2 PM. We'll walk you through everything — confirmation heading your way now!`,
    },
  ],
  chiropractor: (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Hi! You've reached ${biz}. Are you calling about a new patient visit or an existing concern?`,
    },
    {
      id: 2,
      role: "user",
      text: "I've been dealing with lower back pain for a few weeks and I'd like to come in as a new patient.",
    },
    {
      id: 3,
      role: "agent",
      text: `We can definitely help with that! ${biz} has a new patient opening this Thursday at 3 PM and Friday at 10 AM. Which is more convenient?`,
    },
    { id: 4, role: "user", text: "Thursday at 3 PM works for me!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Booked! Your new patient appointment at ${biz} is confirmed for Thursday at 3 PM. We'll have you feeling better soon — confirmation text sent!`,
    },
  ],
  dental: (biz) => [
    {
      id: 1,
      role: "agent",
      text: `Hello! Thank you for reaching out to ${biz}. Are you a new patient, or would you like to schedule a cleaning or checkup?`,
    },
    {
      id: 2,
      role: "user",
      text: "I'm a new patient looking to schedule a routine cleaning and full checkup.",
    },
    {
      id: 3,
      role: "agent",
      text: `We'd love to welcome you to ${biz}! I have a new patient slot available this Tuesday at 9 AM and Thursday at 2 PM. Which works best?`,
    },
    { id: 4, role: "user", text: "Tuesday at 9 AM works great, thank you!" },
    {
      id: 5,
      role: "agent",
      text: `✅ Perfect! Your new patient cleaning and checkup at ${biz} is confirmed for Tuesday at 9 AM. We'll take great care of you — confirmation is on its way!`,
    },
  ],
};

function buildConvo(niche: string, biz: string): ChatMsg[] {
  const factory = NICHE_CONVOS[niche] ?? NICHE_CONVOS.plumber;
  return factory(biz || "Your Business");
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: ChatMsg }) {
  const isAgent = msg.role === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 280 }}
      className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
    >
      {isAgent && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 295))",
          }}
          aria-hidden="true"
        >
          🤖
        </div>
      )}
      <div
        className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed"
        style={
          isAgent
            ? {
                background: "oklch(0.17 0.018 285)",
                color: "oklch(0.9 0.01 280)",
                border: "1px solid oklch(0.58 0.22 290 / 22%)",
              }
            : {
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.50 0.24 298))",
                color: "white",
              }
        }
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 pl-9">
      {[0, 1, 2].map((d) => (
        <div
          key={d}
          className="w-1.5 h-1.5 rounded-full animate-bounce"
          style={{
            background: "oklch(0.58 0.22 290 / 0.7)",
            animationDelay: `${d * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Mock website background (behind the chat widget) ────────────────────────

function MockWebsiteBg({ biz }: { biz: string }) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.08 0.008 280)",
        border: "1px solid oklch(1 0 0 / 8%)",
        minHeight: 120,
        position: "relative",
      }}
    >
      {/* Fake nav bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "oklch(0.12 0.012 280)",
          borderBottom: "1px solid oklch(1 0 0 / 8%)",
        }}
      >
        <span className="text-xs font-black text-white truncate max-w-[120px]">
          {biz}
        </span>
        <div className="flex gap-3">
          {["Home", "Services", "Contact"].map((t) => (
            <span
              key={t}
              className="text-[10px]"
              style={{ color: "oklch(0.52 0.02 280)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      {/* Fake hero text */}
      <div className="px-4 py-3">
        <div
          className="h-2.5 w-2/3 rounded-sm mb-2"
          style={{ background: "oklch(0.2 0.01 280)" }}
        />
        <div
          className="h-2 w-1/2 rounded-sm mb-1"
          style={{ background: "oklch(0.16 0.01 280)" }}
        />
        <div
          className="h-2 w-5/6 rounded-sm"
          style={{ background: "oklch(0.16 0.01 280)" }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DemoStep3Chat() {
  const { businessName, city, niche, completeStep } = useDemoFlow();
  const biz = businessName || "Your Business";
  const locationLabel = city ? ` in ${city}` : "";
  const nicheKey = (niche || "plumber") as string;

  const [showStat, setShowStat] = useState(true);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const convo = buildConvo(nicheKey, biz);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages.length triggers scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const playNextStep = useCallback(async () => {
    if (abortRef.current) return;
    const idx = stepRef.current;
    if (idx >= convo.length) return;

    const msg = convo[idx];
    if (msg.role === "agent") {
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 1000));
      if (abortRef.current) return;
      setIsTyping(false);
    }

    setMessages((prev) => [...prev, msg]);
    stepRef.current = idx + 1;

    if (idx + 1 < convo.length) {
      const delay = msg.role === "agent" ? 2000 : 1500;
      await new Promise((r) => setTimeout(r, delay));
      if (!abortRef.current) void playNextStep();
    } else {
      // All messages shown — trigger overlay
      await new Promise((r) => setTimeout(r, 1200));
      if (!abortRef.current) setShowOverlay(true);
    }
  }, [convo]);

  // Start conversation after stat clears
  useEffect(() => {
    if (!showStat) {
      const t = setTimeout(() => {
        if (!abortRef.current && stepRef.current === 0) {
          void playNextStep();
        }
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [showStat, playNextStep]);

  const handleOverlayDone = useCallback(() => {
    setShowOverlay(false);
    setShowCTA(true);
    completeStep();
  }, [completeStep]);

  if (showStat) {
    return (
      <PainPointStat
        niche={(niche || "plumber") as import("@/types/demo").DemoNicheId}
        onComplete={() => setShowStat(false)}
        delay={2600}
      />
    );
  }

  return (
    <>
      <div
        className="w-full max-w-sm mx-auto flex flex-col gap-3"
        data-ocid="demo.step3.section"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-0.5"
            style={{ color: "oklch(0.58 0.22 290)" }}
          >
            Act 1 · Step 3 — Chat Widget
          </p>
          <h2 className="text-xl font-black text-white leading-tight">
            AI Qualifies & Books
            <br />
            From Your Website
          </h2>
          <p className="text-xs mt-1" style={{ color: "oklch(0.52 0.02 280)" }}>
            Watch the AI handle this visitor{locationLabel} — no staff involved
          </p>
        </motion.div>

        {/* Mock website with chat widget overlaid */}
        <div className="relative" data-ocid="demo.step3.chat_widget">
          <MockWebsiteBg biz={biz} />

          {/* Chat widget — bottom-right of mock site */}
          <div
            className="absolute bottom-3 right-3 w-[220px] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "oklch(0.1 0.012 280)",
              border: "1px solid oklch(0.58 0.22 290 / 35%)",
              boxShadow:
                "0 8px 32px oklch(0 0 0 / 55%), 0 0 0 1px oklch(0.58 0.22 290 / 15%)",
            }}
            aria-label="AI chat widget"
          >
            {/* Widget header */}
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 298))",
              }}
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                🤖
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">{biz} AI</div>
                <div className="text-[9px] text-white/70">
                  ● Online · Instant reply
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex flex-col gap-2 p-2.5 overflow-y-auto"
              style={{ minHeight: 120, maxHeight: 200 }}
            >
              {messages.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-2"
              style={{
                background: "oklch(0.12 0.01 280)",
                borderTop: "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              <input
                type="text"
                placeholder="Type a message…"
                readOnly
                className="flex-1 bg-transparent text-[11px] text-white/40 placeholder:text-white/25 outline-none"
                data-ocid="demo.step3.chat.input"
                aria-label="Chat input (demo mode)"
              />
              <button
                type="button"
                className="text-[10px] px-2 py-1 rounded-lg font-bold transition-opacity hover:opacity-80"
                style={{
                  background: "oklch(0.58 0.22 290 / 20%)",
                  color: "oklch(0.78 0.16 290)",
                  border: "1px solid oklch(0.58 0.22 290 / 30%)",
                }}
                data-ocid="demo.step3.chat.send_button"
                aria-label="Send message"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Framework badge */}
        <div className="flex justify-center">
          <FrameworkBadge badge={FRAMEWORK_BADGES.deiss} size="sm" />
        </div>

        {/* CTA — appears after overlay dismisses */}
        {showCTA && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            data-ocid="demo.step3.next_button"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm text-white transition-all active:scale-[0.98]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.50 0.24 300))",
              boxShadow: "0 8px 28px oklch(0.58 0.22 290 / 35%)",
            }}
            onClick={() => completeStep()}
          >
            See Your Back Office →
          </motion.button>
        )}
      </div>

      {/* Full-screen green overlay */}
      <AnimatePresence>
        {showOverlay && (
          <GreenConfirmOverlay
            data={{
              headline: "Booked Via Chat!",
              items: [
                "Appointment added to calendar",
                "SMS confirmation sent automatically",
                "Lead created in CRM",
              ],
            }}
            onDismiss={handleOverlayDone}
            dataOcid="demo.step3.booking_overlay"
          />
        )}
      </AnimatePresence>
    </>
  );
}
