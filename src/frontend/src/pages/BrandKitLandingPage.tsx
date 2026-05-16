import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  Bot,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  PhoneCall,
  Play,
  Send,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import NicheWebsiteRenderer from "../components/NicheWebsiteRenderer";
import TwoWayCallUI from "../components/demo/TwoWayCallUI";
import { getNicheBackground } from "../data/nicheBackgrounds";
import {
  getFirstWebsiteForNiche,
  normalizeNicheId,
} from "../data/nicheWebsiteData";
import { useBrandKit } from "../hooks/useBrandKit";
import {
  type BrandKitNiche,
  type BrandKitProspect,
  NICHE_COLORS,
  NICHE_LABELS,
  NICHE_PAIN_POINTS,
  NICHE_SAMPLE_POSTS,
  NICHE_SOLUTIONS,
  computeNicheAuditScore,
} from "../types/brandKit";

// ─── Score Dial ───────────────────────────────────────────────────────────────

function ScoreDial({ label, value }: { label: string; value: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let frame: number;
    let startTime: number | null = null;
    const duration = 2200;
    function animate(ts: number) {
      if (startTime === null) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplayed(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const dash = (displayed / 100) * circ;
  const scoreColor =
    displayed >= 70 ? "#22c55e" : displayed >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          aria-label={`${label} score: ${displayed} out of 100`}
          role="img"
          className="-rotate-90"
        >
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{
              filter: `drop-shadow(0 0 8px ${scoreColor}80)`,
              transition: "stroke-dasharray 0.05s",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-foreground leading-none">
            {displayed}
          </span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function useKitCountdown(slug: string) {
  const [hoursLeft, setHoursLeft] = useState<number>(48);

  useEffect(() => {
    const storageKey = `brf_kit_created_${slug}`;
    let kitCreatedAt = Number(localStorage.getItem(storageKey));
    if (!kitCreatedAt) {
      kitCreatedAt = Date.now();
      localStorage.setItem(storageKey, String(kitCreatedAt));
    }
    function compute() {
      const elapsed = (Date.now() - kitCreatedAt) / (1000 * 60 * 60);
      setHoursLeft(Math.max(0, 48 - elapsed));
    }
    compute();
    const interval = setInterval(compute, 60_000);
    return () => clearInterval(interval);
  }, [slug]);

  return hoursLeft;
}

// ─── Live Activity Feed ───────────────────────────────────────────────────────

const ACTIVITY_MESSAGES: Record<BrandKitNiche, string[]> = {
  plumber: [
    "Dallas plumber just activated their trial",
    "Houston plumbing co activated 2 min ago",
    "Austin plumber just tested their AI agent",
  ],
  "med-spa": [
    "Miami med spa just activated their trial",
    "LA beauty clinic activated 5 min ago",
    "NYC med spa just tested their voice agent",
  ],
  hvac: [
    "Phoenix HVAC company activated their trial",
    "Denver AC service activated 3 min ago",
    "Atlanta HVAC just tested their agent",
  ],
  restoration: [
    "Chicago restoration company activated",
    "Detroit remediation co activated 4 min ago",
    "Tampa restoration just went live",
  ],
  "carpet-cleaning": [
    "Houston carpet cleaner activated",
    "Seattle cleaning co activated 6 min ago",
    "Denver carpet pro just activated trial",
  ],
  roofing: [
    "Denver roofing company just activated",
    "Atlanta roofer activated 2 min ago",
    "Dallas roofing co just tested their agent",
  ],
  "real-estate": [
    "Miami real estate agent just activated",
    "Dallas broker activated 3 min ago",
    "Chicago agent just tested their AI",
  ],
  mortgage: [
    "Phoenix mortgage broker just activated",
    "Denver loan officer activated 5 min ago",
    "Atlanta broker just went live",
  ],
  chiropractor: [
    "Dallas chiropractic clinic just activated",
    "Houston chiro activated 4 min ago",
    "Phoenix clinic just tested their agent",
  ],
  dental: [
    "Miami dental practice just activated",
    "Chicago dentist activated 2 min ago",
    "Austin dental co just went live",
  ],
};

function LiveActivityFeed({ niche }: { niche: BrandKitNiche }) {
  const messages = ACTIVITY_MESSAGES[niche];
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center justify-center gap-2 py-3 px-4">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
      <AnimatePresence mode="wait">
        {visible && (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-muted-foreground"
          >
            <strong className="text-emerald-400">Live:</strong> {messages[idx]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Niche Testimonials ───────────────────────────────────────────────────────

const NICHE_TESTIMONIALS: Record<
  BrandKitNiche,
  Array<{ name: string; business: string; quote: string }>
> = {
  plumber: [
    {
      name: "Marcus T.",
      business: "Dallas Plumbing Co",
      quote:
        "We booked 11 new jobs in the first 30 days. The AI receptionist answers every call we used to miss — even at 2am.",
    },
    {
      name: "Darnell H.",
      business: "H&H Plumbing",
      quote:
        "I was spending $2,800 a month on an answering service that still missed calls. BRF replaced it for a fraction of the cost.",
    },
    {
      name: "Sandra K.",
      business: "QuickFix Plumbing",
      quote:
        "The Google review automation got us from 12 reviews to 84 in 60 days. We're now in the Google 3-Pack.",
    },
  ],
  "med-spa": [
    {
      name: "Priya S.",
      business: "Glow Aesthetics",
      quote:
        "No-shows dropped 60% in the first month. The AI books, confirms, and reminds — our calendar is finally full every week.",
    },
    {
      name: "Vanessa M.",
      business: "Lumina Med Spa",
      quote:
        "Our Instagram was dead. Now 30 niche posts go out every month on autopilot. We get DMs asking about services daily.",
    },
    {
      name: "Leila A.",
      business: "Pure Beauty Studio",
      quote:
        "We went from 20 to 140 Google reviews in 45 days using the automated review requests. It changed everything.",
    },
  ],
  hvac: [
    {
      name: "Derek P.",
      business: "Arctic Air HVAC",
      quote:
        "Summer is always slammed but winter used to be dead. BRF's seasonal campaigns kept our technicians booked year-round.",
    },
    {
      name: "James O.",
      business: "ProTemp Services",
      quote:
        "The missed call text-back alone paid for the platform. We're capturing every lead that used to go to voicemail.",
    },
    {
      name: "Carlos R.",
      business: "CoolZone HVAC",
      quote:
        "Pre-season tune-up campaigns hit our entire customer list automatically. 47 bookings in one week.",
    },
  ],
  restoration: [
    {
      name: "Brenda L.",
      business: "BrightStone Restoration",
      quote:
        "We were missing 2am emergency calls — the highest-value jobs. The AI agent answers 24/7 and dispatches instantly now.",
    },
    {
      name: "Tony F.",
      business: "Rapid Response Restore",
      quote:
        "Our documentation system for insurance claims is now automated. Adjusters love it. We're getting more referrals from them.",
    },
    {
      name: "Kim S.",
      business: "SafeHome Restoration",
      quote:
        "Got to the #1 spot on Google Maps in our city within 90 days. Every disaster search now finds us first.",
    },
  ],
  "carpet-cleaning": [
    {
      name: "Amanda K.",
      business: "CarpetPro Solutions",
      quote:
        "I was embarrassed to have guests over. Now I show off my floors — but more importantly, customers actually rebooK.",
    },
    {
      name: "Phil B.",
      business: "FreshFloor Cleaning",
      quote:
        "The rebooking sequences bring customers back every 6 months automatically. My revenue is now predictable.",
    },
    {
      name: "Rita M.",
      business: "Spotless Carpets",
      quote:
        "Every job becomes a marketing asset now. The before/after social posts practically write themselves.",
    },
  ],
  roofing: [
    {
      name: "Robert H.",
      business: "Summit Roofing",
      quote:
        "On time, clean, done in one day, and my neighbors asked for their card. Now I automate that experience for every customer.",
    },
    {
      name: "Angela T.",
      business: "Apex Roofing Co",
      quote:
        "Storm season used to be feast or famine. Now the alert campaigns fire automatically and we stay booked all year.",
    },
    {
      name: "Kevin M.",
      business: "TrustRoof",
      quote:
        "Free audit offer converted 23 homeowners to consultations in one month. Best lead gen we've ever had.",
    },
  ],
  "real-estate": [
    {
      name: "Marcus D.",
      business: "Marcus Realty",
      quote:
        "Closed in 28 days. Every call answered. Every question addressed. I felt like I was the only client — and so did mine.",
    },
    {
      name: "Tanya W.",
      business: "Tanya Williams Realty",
      quote:
        "78% of buyers choose the first agent to respond. My AI responds in seconds. I haven't lost a lead in 60 days.",
    },
    {
      name: "James V.",
      business: "Premier Properties",
      quote:
        "Post-closing review sequences built my reputation from 8 to 102 Google reviews in 90 days.",
    },
  ],
  mortgage: [
    {
      name: "Denise R.",
      business: "First Rate Mortgage",
      quote:
        "Closed my loan pipeline in 21 days average. They answered every call, explained every step. Rate I didn't think was possible.",
    },
    {
      name: "Brian C.",
      business: "Clarity Home Loans",
      quote:
        "67% of my leads come after 5pm. BRF captures every single one now. My pipeline went up 40% in the first month.",
    },
    {
      name: "Sarah K.",
      business: "Premier Lending",
      quote:
        "Referral nurture sequences keep my Realtor partners sending me leads consistently. I don't chase relationships anymore.",
    },
  ],
  chiropractor: [
    {
      name: "Kristin M.",
      business: "Align Chiropractic",
      quote:
        "I hadn't been in 8 months — they sent a message that felt personal, not automated. I came back and felt better in one visit.",
    },
    {
      name: "Dr. Paul T.",
      business: "Total Spine Care",
      quote:
        "No-show rate dropped 37% in 60 days. The SMS reminders changed everything. Our chairs are full.",
    },
    {
      name: "Lisa F.",
      business: "Balanced Life Chiro",
      quote:
        "Patient reactivation sequences brought back 28 dormant patients in the first month. Revenue I forgot I had.",
    },
  ],
  dental: [
    {
      name: "Tanya A.",
      business: "Bright Smile Dental",
      quote:
        "I avoided the dentist for 3 years. They were kind, efficient, not once did I feel judged. Going back next month.",
    },
    {
      name: "Dr. Marcus P.",
      business: "Premier Dental Care",
      quote:
        "Recall sequences brought back 60 lapsed patients in 45 days. That's $24,000 in recovered revenue.",
    },
    {
      name: "Karen S.",
      business: "FamilyFirst Dental",
      quote:
        "We went from 18 to 210 Google reviews in 90 days. New patients call every week saying they found us through reviews.",
    },
  ],
};

// ─── Savings Data ─────────────────────────────────────────────────────────────

const SAVINGS_ROWS = [
  {
    role: "AI Receptionist / Voice Agent",
    market: "$2,500–$3,500/mo",
    yours: "Included",
  },
  {
    role: "Social Media Manager",
    market: "$1,500–$3,000/mo",
    yours: "Included",
  },
  { role: "Website Manager", market: "$500–$1,500/mo", yours: "Included" },
  { role: "Reputation Management", market: "$300–$800/mo", yours: "Included" },
  {
    role: "Business Credit Builder",
    market: "$200–$500/mo",
    yours: "Included",
  },
  { role: "SEO / Local Search", market: "$500–$2,000/mo", yours: "Included" },
  { role: "CRM Software", market: "$100–$300/mo", yours: "Included" },
  {
    role: "Email Marketing Platform",
    market: "$100–$300/mo",
    yours: "Included",
  },
];

// ─── Niche CRM Counts ─────────────────────────────────────────────────────────

const NICHE_LEAD_COUNTS: Record<
  BrandKitNiche,
  { count: number; label: string }
> = {
  plumber: { count: 24, label: "service requests in your area this week" },
  "med-spa": { count: 18, label: "treatment inquiries in your city this week" },
  hvac: { count: 31, label: "HVAC service leads in your area" },
  restoration: { count: 12, label: "emergency calls in your market this week" },
  "carpet-cleaning": { count: 19, label: "cleaning requests in your area" },
  roofing: { count: 27, label: "inspection requests in your market" },
  "real-estate": { count: 34, label: "buyer/seller leads in your area" },
  mortgage: { count: 22, label: "loan inquiries in your market" },
  chiropractor: { count: 16, label: "new patient inquiries this week" },
  dental: { count: 21, label: "new patient leads in your area" },
};

// ─── Score Badge Categories ───────────────────────────────────────────────────

function ScorecardCategory({
  label,
  score,
  color,
}: { label: string; score: number; color: string }) {
  const pct = score;
  const statusLabel =
    score >= 70 ? "Strong" : score >= 50 ? "Moderate" : "Needs Work";
  const badgeClass =
    score >= 70 ? "badge-emerald" : score >= 50 ? "badge-amber" : "badge-rose";

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <span className="text-sm text-foreground truncate">{label}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

// ─── Voice Agent Modal ────────────────────────────────────────────────────────

const NICHE_QUALIFYING: Record<BrandKitNiche, [string, string]> = {
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
    "Are you looking for a repair or full replacement?",
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
  const questions = NICHE_QUALIFYING[prospect.niche];

  useEffect(() => {
    if (stage === "ringing") {
      const t1 = setTimeout(() => setRings(1), 800);
      const t2 = setTimeout(() => setRings(2), 1600);
      const t3 = setTimeout(() => setRings(3), 2400);
      const t4 = setTimeout(() => setStage("greeting"), 3400);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
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
  const nicheArea = {
    plumber: "214",
    "med-spa": "305",
    hvac: "602",
    restoration: "312",
    "carpet-cleaning": "713",
    roofing: "720",
    "real-estate": "404",
    mortgage: "303",
    chiropractor: "469",
    dental: "512",
  };
  const areaCode = nicheArea[prospect.niche];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 24 }}
        transition={{ duration: 0.3, type: "spring", damping: 20 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border overflow-hidden shadow-2xl"
        style={{ background: "oklch(0.14 0.016 280)" }}
        data-ocid="voice_agent_modal.dialog"
      >
        {/* Purple glow top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full opacity-30 blur-2xl pointer-events-none"
          style={{ background: "oklch(0.58 0.22 290)" }}
        />

        <div className="relative flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
              }}
            >
              <PhoneCall size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">
                Call Your AI Agent Now
              </p>
              <p className="text-xs text-muted-foreground">
                Live demo — no download needed
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
            data-ocid="voice_agent_modal.close_button"
            aria-label="Close"
          >
            <X size={16} className="text-muted-foreground" />
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
                className="flex flex-col items-center gap-5 py-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0px oklch(0.58 0.22 290 / 0%)",
                        "0 0 30px oklch(0.58 0.22 290 / 40%)",
                        "0 0 0px oklch(0.58 0.22 290 / 0%)",
                      ],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.2,
                    }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.22 290 / 20%), oklch(0.5 0.2 270 / 20%))",
                      border: "2px solid oklch(0.58 0.22 290 / 40%)",
                    }}
                  >
                    <PhoneCall size={32} className="text-primary" />
                  </motion.div>
                  {([0, 1, 2] as const).map((i) => (
                    <motion.div
                      key={`ring-${i}`}
                      className="absolute inset-0 rounded-full"
                      style={{ border: "1px solid oklch(0.58 0.22 290 / 30%)" }}
                      animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.8,
                        delay: i * 0.6,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">
                    {prospect.businessName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Calling your AI agent{ringDots}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 px-4 leading-relaxed">
                    Your agent handles inquiries, appointment booking,
                    after-hours calls, and pricing questions — all in your
                    business name
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 w-full justify-center">
                  <PhoneCall size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-mono">
                    ({areaCode}) {prospect.niche.slice(0, 3).toUpperCase()}-XXXX
                  </span>
                  <span className="text-xs text-muted-foreground">
                    — Your dedicated number
                  </span>
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
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
                    }}
                  >
                    <Zap size={12} className="text-white" />
                  </div>
                  <div
                    className="rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground leading-relaxed"
                    style={{ background: "oklch(0.2 0.018 280)" }}
                  >
                    Hello, you've reached{" "}
                    <strong>{prospect.businessName}</strong>. How can I help you
                    today?
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground italic">
                  (AI Agent is qualifying your call...)
                </p>

                <AnimatePresence>
                  {(stage === "qualifying" || stage === "cta") && (
                    <motion.div
                      key="q1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
                        }}
                      >
                        <Zap size={12} className="text-white" />
                      </div>
                      <div
                        className="rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground"
                        style={{ background: "oklch(0.2 0.018 280)" }}
                      >
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
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 270))",
                        }}
                      >
                        <Zap size={12} className="text-white" />
                      </div>
                      <div
                        className="rounded-xl rounded-tl-sm px-4 py-3 text-sm text-foreground"
                        style={{ background: "oklch(0.2 0.018 280)" }}
                      >
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
              <div
                className="rounded-xl border border-primary/20 px-4 py-3 text-xs text-muted-foreground"
                style={{ background: "oklch(0.58 0.22 290 / 8%)" }}
              >
                This is{" "}
                <strong className="text-foreground">your AI agent</strong>. It
                answers calls like this{" "}
                <strong className="text-foreground">24/7</strong> for your
                business — never misses a lead.
              </div>
              <button
                type="button"
                onClick={onActivate}
                data-ocid="voice_agent_modal.confirm_button"
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.5 0.2 310))",
                  boxShadow: "0 4px 20px oklch(0.58 0.22 290 / 40%)",
                }}
              >
                Activate This Agent in My Trial <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.info(
                    "Your dedicated line is active — connect Twilio in Go Live to enable live calls",
                  );
                }}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                Call the actual number: ({areaCode}){" "}
                {prospect.niche.slice(0, 3).toUpperCase()}-XXXX →
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Demo Agent Chat (Interactive Typed Conversation) ────────────────────────

type ChatMessage = { role: "agent" | "user"; text: string };

const DEMO_RESPONSES: Record<string, (name: string, city: string) => string> = {
  // Universal triggers
  price: (n) =>
    `Great question! Pricing depends on your specific needs. I can have someone from ${n} call you with an exact quote within the hour. Can I get your name and best number?`,
  cost: (n) =>
    `Great question! Pricing depends on your specific needs. I can have someone from ${n} call you with an exact quote within the hour. Can I get your name and best number?`,
  "how much": (n) =>
    `Great question! Pricing depends on your specific needs. I can have someone from ${n} call you with an exact quote within the hour. Can I get your name and best number?`,
  appointment: (n) =>
    `I'd love to get you scheduled! We have openings this week. What day works best for you? I can confirm a time right now with ${n}.`,
  book: (n) =>
    `I'd love to get you scheduled at ${n}! We have openings this week. What day works best for you?`,
  schedule: (n) =>
    `I'd love to get you scheduled! ${n} has openings this week. What day works best for you?`,
  available: (n) =>
    `I'd love to get you scheduled at ${n}! We have openings this week. What day works best for you?`,
  hours: (n) =>
    `${n} is available Monday through Saturday, 7am to 7pm, and I'm here 24/7 to take your message even after hours. What do you need help with?`,
  open: (n) =>
    `${n} is available Monday through Saturday, 7am to 7pm, and I'm here 24/7 to take your message even after hours. What do you need help with?`,
  close: (n) =>
    `${n} is available Monday through Saturday, 7am to 7pm, and I'm here 24/7 to take your message even after hours. What do you need help with?`,
  emergency: (n) =>
    `I understand this is urgent — I'm flagging this as a priority right now. Someone from ${n} will call you back within 15 minutes. Can I confirm your number?`,
  urgent: (n) =>
    `I understand this is urgent — I'm flagging this as a priority right now. Someone from ${n} will call you back within 15 minutes. Can I confirm your number?`,
  asap: (n) =>
    `I understand this is urgent — I'm flagging this as a priority right now. Someone from ${n} will call you back within 15 minutes. Can I confirm your number?`,
  "right now": (n) =>
    `I understand this is urgent — I'm flagging this as a priority right now. Someone from ${n} will call you back within 15 minutes. Can I confirm your number?`,
  hello: (n) =>
    `Hi there! Thanks for reaching out to ${n}. I'm here to help — what can I assist you with today?`,
  hi: (n) =>
    `Hi there! Thanks for reaching out to ${n}. I'm here to help — what can I assist you with today?`,
  hey: (n) =>
    `Hi there! Thanks for reaching out to ${n}. I'm here to help — what can I assist you with today?`,
};

type NicheKeywordMap = Record<string, string[]>;

const NICHE_KEYWORDS: Record<string, NicheKeywordMap> = {
  plumber: {
    "leak|pipe|drain|water": ["leak", "pipe", "drain", "water"],
    "toilet|clog|flush": ["toilet", "clog", "flush"],
  },
  roofing: {
    "roof|leak|damage|shingle|storm": [
      "roof",
      "leak",
      "damage",
      "shingle",
      "storm",
    ],
    "replace|new roof|quote": ["replace", "new roof", "quote"],
  },
  hvac: {
    "ac|air|heat|furnace|cooling|hot|cold": [
      "ac",
      "air",
      "heat",
      "furnace",
      "cooling",
      "hot",
      "cold",
    ],
    "filter|maintenance|tune": ["filter", "maintenance", "tune"],
  },
  "med-spa": {
    "botox|filler|facial|treatment|skin|laser": [
      "botox",
      "filler",
      "facial",
      "treatment",
      "skin",
      "laser",
    ],
    "price|cost|how much": ["price", "cost", "how much"],
  },
  "carpet-cleaning": {
    "carpet|stain|clean|rug": ["carpet", "stain", "clean", "rug"],
    "pet|odor|smell": ["pet", "odor", "smell"],
  },
  restoration: {
    "water|flood|damage|mold|fire|smoke": [
      "water",
      "flood",
      "damage",
      "mold",
      "fire",
      "smoke",
    ],
    "insurance|claim": ["insurance", "claim"],
  },
  "real-estate": {
    "buy|purchase|home|house|listing": [
      "buy",
      "purchase",
      "home",
      "house",
      "listing",
    ],
    "sell|list|selling": ["sell", "list", "selling"],
  },
  mortgage: {
    "rate|interest|loan|refinance": ["rate", "interest", "loan", "refinance"],
    "qualify|afford|down payment": ["qualify", "afford", "down payment"],
  },
  chiropractor: {
    "back|neck|pain|spine|adjustment": [
      "back",
      "neck",
      "pain",
      "spine",
      "adjustment",
    ],
    "insurance|covered": ["insurance", "covered"],
  },
  dental: {
    "teeth|tooth|cleaning|cavity|pain|dental": [
      "teeth",
      "tooth",
      "cleaning",
      "cavity",
      "pain",
      "dental",
    ],
    "insurance|cost": ["insurance", "cost"],
  },
};

const NICHE_RESPONSES: Record<
  string,
  Record<string, (n: string, city: string) => string>
> = {
  plumber: {
    "leak|pipe|drain|water": (n, c) =>
      `Got it — sounds like you may have a water issue. We handle emergency leaks, pipe repairs, and drain clogs for ${c} homes. Want me to get a plumber out to you today from ${n}?`,
    "toilet|clog|flush": (n) =>
      `A clogged or faulty toilet is no fun! ${n} can usually get someone out same-day. Want me to schedule a visit?`,
  },
  roofing: {
    "roof|leak|damage|shingle|storm": (n) =>
      `Roof damage is serious — especially after a storm. ${n} offers free inspections and works with most insurance companies. Want to book your free inspection today?`,
    "replace|new roof|quote": (n, c) =>
      `We'd be happy to get you a free estimate! A ${n} specialist can usually visit within 24 hours. What's your address in ${c} so I can check availability?`,
  },
  hvac: {
    "ac|air|heat|furnace|cooling|hot|cold": (n, c) =>
      `Temperature issues can be miserable! ${n} handles AC repair, furnace service, and full system installs in ${c}. Want me to get a tech out today?`,
    "filter|maintenance|tune": (n) =>
      `Regular maintenance is the best way to avoid breakdowns. I can schedule a tune-up visit with ${n} — most take under an hour. When works for you?`,
  },
  "med-spa": {
    "botox|filler|facial|treatment|skin|laser": (n) =>
      `That sounds like a great service to explore! Our specialists at ${n} offer consultations to find the right treatment for your goals. Want me to book you in?`,
    "price|cost|how much": (n) =>
      `Pricing varies by treatment — our consultations at ${n} are free and there's no pressure. Would you like to schedule a time this week?`,
  },
  "carpet-cleaning": {
    "carpet|stain|clean|rug": (n, c) =>
      `We'd love to help get those carpets looking great! ${n} serves ${c} with same-week appointments available. How many rooms are you looking to have cleaned?`,
    "pet|odor|smell": (n) =>
      `Pet odors are one of our specialties at ${n} — we use a deep-clean process that eliminates them completely. Want to get a quote and schedule?`,
  },
  restoration: {
    "water|flood|damage|mold|fire|smoke": (n, c) =>
      `This sounds like it needs immediate attention. ${n} is available 24/7 for emergency restoration — we can have a crew out within the hour. Are you in ${c}?`,
    "insurance|claim": (n) =>
      `We work directly with insurance companies and handle all the documentation. Let me get your info to a restoration specialist at ${n} right now — what's your best contact number?`,
  },
  "real-estate": {
    "buy|purchase|home|house|listing": (n, c) =>
      `Exciting! ${n} has deep knowledge of the ${c} market. Are you pre-approved for a mortgage, or would you like a recommendation for a great lender?`,
    "sell|list|selling": (n, c) =>
      `Now is a great time to talk about listing strategy! ${n} can prepare a free market analysis for your home in ${c}. When would be a good time to connect?`,
  },
  mortgage: {
    "rate|interest|loan|refinance": (n) =>
      `Rates are always moving — the best way to find your rate is with a quick pre-qualification. It takes about 10 minutes and doesn't affect your credit. Want to schedule that now with ${n}?`,
    "qualify|afford|down payment": (n) =>
      `Those are the right questions to ask early. ${n} works with first-time buyers all the time. I can get you a free consultation with a loan officer today — what works?`,
  },
  chiropractor: {
    "back|neck|pain|spine|adjustment": (n) =>
      `Back and neck pain can really affect your life. ${n} offers same-week new patient appointments — and many patients feel relief after the first visit. Want to get you scheduled?`,
    "insurance|covered": (n) =>
      `We work with most major insurance plans and offer affordable self-pay rates. Want me to check your coverage while I book your appointment at ${n}?`,
  },
  dental: {
    "teeth|tooth|cleaning|cavity|pain|dental": (n) =>
      `Let's get you taken care of! ${n} accepts new patients and has appointments this week. Is this for a routine cleaning or are you experiencing any pain?`,
    "insurance|cost": (n) =>
      `We work with most dental insurance plans, and we can verify your coverage before your visit. Want me to get you scheduled at ${n} and check your benefits at the same time?`,
  },
};

function getDemoResponse(
  input: string,
  niche: string,
  businessName: string,
  city: string,
): string {
  const lower = input.toLowerCase();

  // Check niche-specific first
  const nicheMap = NICHE_RESPONSES[niche] ?? {};
  for (const [pattern, responseFn] of Object.entries(nicheMap)) {
    const keywords = pattern.split("|");
    if (keywords.some((kw) => lower.includes(kw))) {
      return responseFn(businessName, city);
    }
  }

  // Check universal triggers
  for (const [keyword, responseFn] of Object.entries(DEMO_RESPONSES)) {
    if (lower.includes(keyword)) {
      return responseFn(businessName, city);
    }
  }

  // Default fallback
  return `Thanks for that! Let me make sure the right person from ${businessName} gets back to you with a proper answer. Can I grab your name and best number to reach you?`;
}

// Suppress unused variable warning — NICHE_KEYWORDS is a reference type registry
void (NICHE_KEYWORDS as unknown);

function DemoAgentChat({
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
  const [messages, setMessages] = useState<ChatMessage[]>([
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

    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );

    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      const agentText = getDemoResponse(text, niche, businessName, city);
      setMessages((prev) => [...prev, { role: "agent", text: agentText }]);
      setIsTyping(false);
    }, delay);
  }, [inputValue, niche, businessName, city]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const suggestedPrompts = [
    "How much does it cost?",
    "Can I book an appointment?",
    "Do you offer emergency service?",
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden border border-border shadow-xl mx-auto"
      style={{
        maxWidth: "400px",
        background: "oklch(0.12 0.014 280)",
        boxShadow: `0 8px 40px ${nicheColor.primary}20`,
      }}
      data-ocid="brand_kit.demo_chat.panel"
    >
      {/* Phone header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${nicheColor.primary}18, ${nicheColor.accent}10)`,
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
          }}
        >
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground truncate">
            {businessName} AI Agent
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-semibold">
              Online
            </span>
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground">Demo</div>
      </div>

      {/* Messages area */}
      <div
        className="p-4 space-y-3 overflow-y-auto"
        style={{ height: "260px" }}
        data-ocid="brand_kit.demo_chat.messages"
      >
        {messages.map((msg) => (
          <motion.div
            key={`${msg.role}-${msg.text.slice(0, 20)}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "agent" && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${nicheColor.primary}30` }}
              >
                <Bot size={10} style={{ color: nicheColor.primary }} />
              </div>
            )}
            <div
              className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
              style={
                msg.role === "agent"
                  ? {
                      background: "oklch(0.19 0.018 280)",
                      color: "var(--foreground)",
                      borderTopLeftRadius: "4px",
                    }
                  : {
                      background: nicheColor.primary,
                      color: "#fff",
                      borderTopRightRadius: "4px",
                    }
              }
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 items-end"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `${nicheColor.primary}30` }}
            >
              <Bot size={10} style={{ color: nicheColor.primary }} />
            </div>
            <div
              className="flex gap-1 px-3 py-2.5 rounded-xl"
              style={{
                background: "oklch(0.19 0.018 280)",
                borderTopLeftRadius: "4px",
              }}
              aria-label="Agent is typing"
            >
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={`typing-dot-${dot}`}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: nicheColor.primary }}
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.8,
                    delay: dot * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setInputValue(prompt);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors"
              style={{
                background: `${nicheColor.primary}15`,
                border: `1px solid ${nicheColor.primary}35`,
                color: nicheColor.primary,
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div
        className="flex gap-2 px-3 py-3 border-t border-border"
        style={{ background: "oklch(0.11 0.012 280)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type as a caller…"
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none min-w-0"
          data-ocid="brand_kit.demo_chat.input"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!inputValue.trim() || isTyping}
          data-ocid="brand_kit.demo_chat.send_button"
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
          }}
          aria-label="Send message"
        >
          <Send size={12} className="text-white" />
        </button>
      </div>

      {/* Footer CTA */}
      <div
        className="px-4 py-3 border-t border-border text-center space-y-2"
        style={{ background: "oklch(0.11 0.012 280)" }}
      >
        <p className="text-[10px] text-muted-foreground">
          Powered by <strong className="text-foreground">{businessName}</strong>{" "}
          AI Agent
        </p>
        <button
          type="button"
          onClick={onActivate}
          data-ocid="brand_kit.demo_chat.activate_button"
          className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-white transition-all hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}, ${nicheColor.accent})`,
          }}
        >
          Activate This Agent For My Business →
        </button>
      </div>
    </div>
  );
}

// ─── Business Credit Preview ──────────────────────────────────────────────────

function BusinessCreditPreview({ businessName }: { businessName: string }) {
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const target = 95;
    let current = 0;
    const steps = 40;
    const increment = target / steps;
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      current = Math.min(Math.round(increment * step), target);
      setScore(current);
      if (step >= steps) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [started]);

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const scoreColor =
    score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#a855f7";

  return (
    <section
      className="py-16 px-5"
      style={{ background: "oklch(0.11 0.013 280)" }}
      data-ocid="brand_kit.credit_preview.section"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border overflow-hidden"
          style={{ background: "oklch(0.16 0.016 280)" }}
        >
          <div
            className="px-6 py-4 border-b border-border flex items-center gap-3"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 290 / 15%), oklch(0.5 0.2 310 / 10%))",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.58 0.22 290 / 20%)" }}
            >
              <CreditCard size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">
                Business Credit Builder Preview
              </h3>
              <p className="text-xs text-muted-foreground">
                90-day auto-pilot to $50K–$500K in available funding
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Score dial */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  data-ocid="brand_kit.credit_preview.start_button"
                  className="relative w-28 h-28 group"
                  aria-label="Start credit score animation"
                >
                  <svg
                    width="112"
                    height="112"
                    viewBox="0 0 112 112"
                    className="-rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="7"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={`${dash} ${circ}`}
                      style={{
                        filter: `drop-shadow(0 0 8px ${scoreColor}60)`,
                        transition: "stroke-dasharray 0.05s",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {started ? (
                      <>
                        <span className="text-2xl font-black text-foreground leading-none">
                          {score}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          / 100
                        </span>
                      </>
                    ) : (
                      <span className="text-[9px] font-bold text-primary text-center px-1 group-hover:opacity-80 transition-opacity">
                        Tap to see
                      </span>
                    )}
                  </div>
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Business Credit Score
                  <br />
                  <span className="text-[10px]">after 90 days</span>
                </p>
              </div>

              {/* Right side */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-base font-bold text-foreground mb-2">
                  In 90 days,{" "}
                  <span className="text-primary">{businessName}</span> could
                  have $50,000–$500,000 in available business funding
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  BRF builds your business credit on autopilot — entity setup,
                  tradelines, and lender-ready profile. 97% of businesses never
                  get this far. We do it for you.
                </p>
                <div className="flex flex-wrap gap-2 sm:justify-start justify-center">
                  {[
                    { amount: "$50K", label: "Line of Credit" },
                    { amount: "$250K", label: "SBA Pre-qual" },
                    { amount: "$500K", label: "Expansion Fund" },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center"
                    >
                      <p className="text-sm font-black text-emerald-300">
                        {f.amount}
                      </p>
                      <p className="text-[10px] text-emerald-400/70">
                        {f.label}
                      </p>
                    </div>
                  ))}
                </div>
                <a
                  href="/demo?step=5"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                  data-ocid="brand_kit.credit_preview.full_demo_link"
                >
                  See Full Credit Builder Demo →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AssetCard({
  icon: Icon,
  title,
  savingLabel,
  children,
  cta,
  onCta,
  locked,
  index,
  nicheColor,
}: {
  icon: React.ElementType;
  title: string;
  savingLabel: string;
  children: React.ReactNode;
  cta: string;
  onCta: () => void;
  locked?: boolean;
  index: number;
  nicheColor: { primary: string; accent: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, boxShadow: `0 12px 40px ${nicheColor.primary}20` }}
      className="relative rounded-2xl border border-border overflow-hidden flex flex-col"
      style={{
        background: "oklch(0.16 0.016 280)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
      data-ocid={`brand_kit.asset_card.item.${index + 1}`}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${nicheColor.primary}, ${nicheColor.accent})`,
        }}
      />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${nicheColor.primary}20` }}
            >
              <Icon size={20} style={{ color: nicheColor.primary }} />
            </div>
            <h3 className="font-bold text-foreground text-sm leading-tight">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold badge-emerald flex-shrink-0">
            <Check size={10} /> Included
          </div>
        </div>

        <div className="flex-1 mb-4">{children}</div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-4">
          <DollarSign size={12} />
          <span>{savingLabel} — included free</span>
        </div>

        <button
          type="button"
          onClick={onCta}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${locked ? "opacity-70" : "hover:opacity-90"}`}
          style={{
            background: `linear-gradient(135deg, ${nicheColor.primary}30, ${nicheColor.accent}20)`,
            border: `1px solid ${nicheColor.primary}40`,
            color: nicheColor.primary,
          }}
        >
          {locked && <span className="text-[10px]">🔒</span>}
          {cta}
          {!locked && <ChevronRight size={12} />}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: { name: string; business: string; quote: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden border border-border"
      style={{ background: "oklch(0.16 0.016 280)" }}
      data-ocid={`brand_kit.testimonial.item.${index + 1}`}
    >
      {/* Poster area */}
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.06 290), oklch(0.14 0.04 270))",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, oklch(0.58 0.22 290 / 30%) 0%, transparent 70%)",
          }}
        />
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "oklch(0.58 0.22 290 / 20%)",
            border: "2px solid oklch(0.58 0.22 290 / 50%)",
          }}
        >
          <Play size={20} className="text-primary ml-0.5" />
        </motion.div>
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p className="text-[10px] text-white/60">
            Video testimonial — real results from this niche
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={`star-${i + 1}`}
              size={12}
              className="fill-amber-400 text-amber-400"
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 italic">
          "{testimonial.quote}"
        </p>
        <div>
          <p className="text-xs font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {testimonial.business}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BrandKitLandingPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const navigate = useNavigate();
  const { getProspectBySlug, activateTrial, recordActivity } = useBrandKit();
  const hoursLeft = useKitCountdown(slug);

  const prospect = getProspectBySlug(slug);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const finalCtaRef = useRef<HTMLDivElement>(null);

  const goToTrial = useCallback(
    (action: string) => {
      if (prospect) activateTrial(slug, action);
      void navigate({ to: `/brand-kit/${slug}/trial` });
    },
    [prospect, slug, activateTrial, navigate],
  );

  const handleVoiceOpen = useCallback(() => {
    if (prospect) recordActivity(slug, "voice_agent_tested");
    setShowVoiceModal(true);
  }, [prospect, slug, recordActivity]);

  const handleVoiceActivate = useCallback(() => {
    setShowVoiceModal(false);
    goToTrial("voice_agent_test");
  }, [goToTrial]);

  const scrollToFinalCta = useCallback(() => {
    finalCtaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (!prospect) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6"
        data-ocid="brand_kit.error_state"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
          <AlertCircle size={32} className="text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Kit Not Found</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          This brand kit link may have expired. Contact us to get a new one.
        </p>
        <a
          href="/"
          className="mt-2 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          ← Return to homepage
        </a>
      </div>
    );
  }

  const { businessName, niche, city, createdAt } = prospect;
  const nicheLabel = NICHE_LABELS[niche];
  const nicheColor = NICHE_COLORS[niche];
  const auditScore = computeNicheAuditScore(niche, city);

  // Map BrandKitNiche to nicheBackgrounds key
  const bgKey =
    niche === "plumber" ? "plumbing" : niche === "med-spa" ? "med-spa" : niche;
  const nicheBg = getNicheBackground(bgKey);

  const nicheWebsite = getFirstWebsiteForNiche(normalizeNicheId(niche));
  const samplePosts = NICHE_SAMPLE_POSTS[niche];
  const painPoints = NICHE_PAIN_POINTS[niche];
  const solutions = NICHE_SOLUTIONS[niche];
  const testimonials = NICHE_TESTIMONIALS[niche];
  const leadInfo = NICHE_LEAD_COUNTS[niche];
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const urlSlug = businessName.toLowerCase().replace(/\s+/g, "");

  const hoursDisplay = Math.floor(hoursLeft);
  const minsDisplay = Math.floor((hoursLeft - hoursDisplay) * 60);
  const isExpiring = hoursLeft < 12;

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="brand_kit.page"
    >
      {/* ── URGENCY BANNER ─────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 flex items-center justify-center gap-2 py-2.5 px-4 text-center"
        style={{
          background: isExpiring ? "oklch(0.55 0.2 30)" : "oklch(0.52 0.18 75)",
          boxShadow: "0 2px 10px oklch(0.55 0.2 30 / 30%)",
        }}
        data-ocid="brand_kit.urgency_banner"
      >
        <Clock size={14} className="text-white flex-shrink-0" />
        <p className="text-xs sm:text-sm font-bold text-white">
          ⚠ This personalized kit expires in{" "}
          <span className="font-black">
            {hoursDisplay}h {minsDisplay}m
          </span>{" "}
          — claim it now before it's reset
        </p>
        <button
          type="button"
          onClick={scrollToFinalCta}
          className="flex-shrink-0 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold px-3 py-1 transition-colors border border-white/30"
        >
          Claim →
        </button>
      </div>

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden min-h-[80vh] flex flex-col justify-center"
        data-ocid="brand_kit.hero.section"
      >
        {/* Background image */}
        {nicheBg && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${nicheBg.heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: nicheBg.heroImageMobileFocus,
            }}
          />
        )}
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.08 0.04 285 / 85%) 0%, oklch(0.06 0.03 285 / 92%) 50%, oklch(0.1 0.012 280) 100%)",
          }}
        />
        {/* Purple glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: nicheColor.primary }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-20 text-center">
          {/* App ready badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90 mb-6"
          >
            <Zap size={13} className="text-yellow-300" />
            <span className="font-semibold">
              {nicheLabel} Business App — Ready in 60 Seconds
            </span>
          </motion.div>

          {/* Giant headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5"
          >
            <span className="text-white">{businessName}'s</span>
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 290), oklch(0.72 0.2 200))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Business App Is Ready
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Your personalized AI-powered business app — built specifically for{" "}
            <strong className="text-white">{businessName}</strong> in {city}.
            Use your existing website or the one we built for you.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {[
              { label: "No credit card required" },
              { label: "Cancel anytime" },
              { label: "We set it up for you" },
            ].map(({ label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5"
              >
                <Check size={12} className="text-emerald-400" />
                <span className="text-xs text-white/90 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <button
              type="button"
              onClick={() => goToTrial("landing_page_hero_cta")}
              data-ocid="brand_kit.hero.primary_button"
              className="flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black text-white transition-all hover:opacity-90 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 310))",
                boxShadow:
                  "0 4px 30px oklch(0.58 0.22 290 / 50%), 0 0 60px oklch(0.58 0.22 290 / 20%)",
                minWidth: "260px",
              }}
            >
              Activate My Free 7-Day Trial →
            </button>
            <button
              type="button"
              onClick={handleVoiceOpen}
              data-ocid="brand_kit.hero.voice_agent_button"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10"
              style={{
                borderColor: "rgba(255,255,255,0.4)",
                minWidth: "240px",
              }}
            >
              <PhoneCall size={18} className="animate-pulse" />
              Test My Voice Agent
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-4 text-xs text-white/50"
          >
            Trial only starts when you actually use it — not when you sign up
          </motion.p>
        </div>
      </section>

      {/* ── LIVE ACTIVITY FEED ─────────────────────────────────────────────── */}
      <div
        className="border-b border-border"
        style={{ background: "oklch(0.13 0.014 280)" }}
        data-ocid="brand_kit.activity_feed"
      >
        <div className="max-w-4xl mx-auto">
          <LiveActivityFeed niche={niche} />
        </div>
      </div>

      {/* ── WHAT'S INCLUDED GRID ────────────────────────────────────────────── */}
      <section
        className="py-16 px-5"
        style={{ background: "oklch(0.11 0.013 280)" }}
        data-ocid="brand_kit.assets.section"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Everything included
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Your {businessName} App Includes All of This
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
              6 tools that normally cost $5,700–$11,900/mo. All included. All
              pre-built for your niche.
            </p>
          </motion.div>

          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="brand_kit.assets.list"
          >
            {/* Card 1: AI Voice Agent */}
            <AssetCard
              icon={PhoneCall}
              title="AI Voice Agent"
              index={0}
              savingLabel="$2,800/mo receptionist"
              cta="Test Your Voice Agent"
              onCta={handleVoiceOpen}
              nicheColor={nicheColor}
            >
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Already built and ready to test. Answers every call in your
                  business name — 24/7.
                </p>
                <div
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                  style={{ background: "oklch(0.14 0.014 280)" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${nicheColor.primary}25` }}
                  >
                    <PhoneCall
                      size={14}
                      style={{ color: nicheColor.primary }}
                    />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Hello, you've reached
                    </p>
                    <p className="text-[11px] text-primary font-bold truncate">
                      {businessName}
                    </p>
                  </div>
                </div>
              </div>
            </AssetCard>

            {/* Card 2: Website */}
            <AssetCard
              icon={Globe}
              title="Your Business Website"
              index={1}
              savingLabel="$500–1,500/mo web manager"
              cta="Preview Website"
              onCta={() => {
                recordActivity(slug, "website_viewed");
                goToTrial("website_preview_cta");
              }}
              nicheColor={nicheColor}
            >
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Pre-built for your niche. Use yours or customize this one.
                </p>
                <div
                  className="rounded-lg border border-border overflow-hidden"
                  style={{
                    height: "80px",
                    background: "oklch(0.14 0.014 280)",
                  }}
                >
                  <div className="h-5 flex items-center gap-1.5 px-2 border-b border-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                    <div className="flex-1 mx-2 rounded bg-muted/40 h-2" />
                  </div>
                  <div className="flex items-center justify-center h-[55px]">
                    <p className="text-[10px] text-muted-foreground">
                      {urlSlug}.com
                    </p>
                  </div>
                </div>
              </div>
            </AssetCard>

            {/* Card 3: Free Audit */}
            <AssetCard
              icon={BarChart3}
              title="Free Business Audit"
              index={2}
              savingLabel="$500–2,000/mo SEO company"
              cta="View Full Audit"
              onCta={() => goToTrial("audit_viewed")}
              nicheColor={nicheColor}
            >
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Know exactly where you're losing money and leads.
                </p>
                <div className="flex justify-around pt-1">
                  <ScoreDial label="SEO" value={auditScore.seo} />
                  <ScoreDial label="Leads" value={auditScore.conversion} />
                  <ScoreDial label="Repute" value={auditScore.reputation} />
                </div>
              </div>
            </AssetCard>

            {/* Card 4: Social Calendar */}
            <AssetCard
              icon={Calendar}
              title="30-Day Social Calendar"
              index={3}
              savingLabel="$1,500–3,000/mo social manager"
              cta="Unlock in Trial"
              onCta={() => goToTrial("social_calendar_cta")}
              locked
              nicheColor={nicheColor}
            >
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  30 niche-specific posts ready to schedule.
                </p>
                {samplePosts.slice(0, 2).map((post) => (
                  <div
                    key={post.slice(0, 30)}
                    className="relative rounded-lg border border-border p-2.5 overflow-hidden"
                    style={{ background: "oklch(0.14 0.014 280)" }}
                  >
                    <p
                      className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 select-none"
                      style={{ filter: "blur(2.5px)" }}
                    >
                      {post}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-primary/80 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/20">
                        Unlock in trial
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AssetCard>

            {/* Card 5: CRM */}
            <AssetCard
              icon={Users}
              title="CRM + Lead Pipeline"
              index={4}
              savingLabel="$100–300/mo CRM software"
              cta="View Your Pipeline"
              onCta={() => goToTrial("crm_viewed")}
              locked
              nicheColor={nicheColor}
            >
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Your pipeline is pre-loaded with leads.
                </p>
                <div
                  className="rounded-xl border border-border p-3 relative overflow-hidden"
                  style={{ background: "oklch(0.14 0.014 280)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp
                      size={14}
                      style={{ color: nicheColor.primary }}
                    />
                    <p className="text-[10px] font-bold text-foreground">
                      {leadInfo.count} potential leads
                    </p>
                  </div>
                  <p
                    className="text-[10px] text-muted-foreground"
                    style={{ filter: "blur(2px)" }}
                  >
                    {leadInfo.label}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                    <span className="text-[9px] font-bold text-primary/80 border border-primary/20 bg-background/80 px-2 py-0.5 rounded-full">
                      Unlock in trial
                    </span>
                  </div>
                </div>
              </div>
            </AssetCard>

            {/* Card 6: Business Scorecard */}
            <AssetCard
              icon={FileText}
              title="Business Scorecard"
              index={5}
              savingLabel="Competitive intelligence"
              cta="View Scorecard"
              onCta={() => goToTrial("scorecard_viewed")}
              nicheColor={nicheColor}
            >
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-2">
                  Your full competitive report by category.
                </p>
                <ScorecardCategory
                  label="Online Visibility"
                  score={auditScore.seo}
                  color={nicheColor.primary}
                />
                <ScorecardCategory
                  label="Reputation"
                  score={auditScore.reputation}
                  color={nicheColor.accent}
                />
                <ScorecardCategory
                  label="Lead Conversion"
                  score={auditScore.conversion}
                  color="#22c55e"
                />
              </div>
            </AssetCard>
          </div>
        </div>
      </section>

      {/* ── IN-BROWSER DEMO AGENT ──────────────────────────────────────────── */}
      <section
        className="py-16 px-5"
        style={{ background: "oklch(0.13 0.014 280)" }}
        data-ocid="brand_kit.demo_agent.section"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Hear it right now
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Your AI Agent Is Live — Try It Now
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
              Have a real two-way conversation with your AI agent right in your
              browser — no phone call, no downloads, no credentials needed.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Part A: Two-way voice call */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 w-full">
                <p className="text-sm font-bold text-foreground mb-1">
                  🎙️ Live Two-Way Voice Demo
                </p>
                <p className="text-xs text-muted-foreground">
                  Allow mic access to speak with your agent — or watch it play
                  automatically without a microphone.
                </p>
              </div>
              <TwoWayCallUI businessName={businessName} niche={niche} inline />
            </motion.div>

            {/* Part B: Interactive typed chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-4">
                <p className="text-sm font-bold text-foreground mb-1">
                  💬 Prefer to Type? Talk to Your Agent
                </p>
                <p className="text-xs text-muted-foreground">
                  Type as a caller. See how your agent responds to any question
                  24/7.
                </p>
              </div>
              <DemoAgentChat
                businessName={businessName}
                niche={niche}
                city={city}
                nicheColor={nicheColor}
                onActivate={() => goToTrial("demo_chat_activate")}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WEBSITE PREVIEW ────────────────────────────────────────────────── */}
      <section
        className="py-16 px-5 bg-background"
        data-ocid="brand_kit.website.section"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Pre-built for you
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Your {nicheLabel} Website — Already Done
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto text-sm">
              Customize with AI or click-to-edit inline. Or just bring your
              existing site — either way, the app works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div
              className="relative mx-auto max-w-3xl rounded-2xl overflow-hidden border border-border shadow-2xl"
              style={{ boxShadow: `0 20px 60px ${nicheColor.primary}20` }}
            >
              <div
                className="h-9 flex items-center gap-2 px-4 border-b border-border"
                style={{ background: "oklch(0.16 0.016 280)" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-3 rounded-md bg-muted/40 h-5 px-3 flex items-center">
                  <Globe size={10} className="text-muted-foreground mr-1.5" />
                  <span className="text-[10px] text-muted-foreground truncate">
                    {urlSlug}.com
                  </span>
                </div>
                <ExternalLink size={12} className="text-muted-foreground" />
              </div>
              <div
                className="overflow-auto"
                style={{ height: "380px" }}
                data-ocid="brand_kit.website.canvas_target"
              >
                {nicheWebsite ? (
                  <NicheWebsiteRenderer
                    website={nicheWebsite}
                    tenantData={{ name: businessName }}
                    previewMode="thumbnail"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Preview loading…
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  recordActivity(slug, "website_viewed");
                  goToTrial("website_customize");
                }}
                data-ocid="brand_kit.website.customize_button"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 310))",
                  boxShadow: "0 4px 20px oklch(0.58 0.22 290 / 30%)",
                }}
              >
                Customize My Website →
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Your website is pre-built — activate your trial to go live",
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-all"
              >
                <Globe size={16} />
                Use My Existing Website Instead
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SCORECARD & PAIN POINTS ────────────────────────────────────────── */}
      <section
        className="py-16 px-5"
        style={{ background: "oklch(0.11 0.013 280)" }}
        data-ocid="brand_kit.scorecard.section"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Free business audit
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {businessName}'s Business Scorecard
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Based on your niche and market in {city}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Score dials */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border overflow-hidden"
              style={{ background: "oklch(0.16 0.016 280)" }}
            >
              <div
                className="px-5 py-4 border-b border-border"
                style={{
                  background: `linear-gradient(135deg, ${nicheColor.primary}20, ${nicheColor.accent}10)`,
                }}
              >
                <h3 className="font-bold text-foreground text-sm">
                  Overall Audit Scores
                </h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <ScoreDial label="SEO Score" value={auditScore.seo} />
                <ScoreDial label="Conversion" value={auditScore.conversion} />
                <ScoreDial label="Reputation" value={auditScore.reputation} />
                <ScoreDial label="Content" value={auditScore.content} />
              </div>
            </motion.div>

            {/* Pain + Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <div
                className="rounded-2xl border border-border overflow-hidden"
                style={{ background: "oklch(0.16 0.016 280)" }}
              >
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <AlertCircle size={14} className="text-destructive" />
                  <h3 className="font-bold text-foreground text-sm">
                    Top Issues We Found
                  </h3>
                </div>
                <ul className="p-4 space-y-3">
                  {painPoints.map((pt) => (
                    <li
                      key={pt.slice(0, 30)}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <X
                        size={14}
                        className="text-destructive mt-0.5 flex-shrink-0"
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl border border-border overflow-hidden"
                style={{ background: "oklch(0.16 0.016 280)" }}
              >
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <h3 className="font-bold text-foreground text-sm">
                    How BRF Fixes These
                  </h3>
                </div>
                <ul className="p-4 space-y-3">
                  {solutions.map((sol) => (
                    <li
                      key={sol.slice(0, 30)}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check
                        size={14}
                        className="text-emerald-400 mt-0.5 flex-shrink-0"
                      />
                      {sol}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS CREDIT PREVIEW ────────────────────────────────────────── */}
      <BusinessCreditPreview businessName={businessName} />

      {/* ── SAVINGS TABLE ──────────────────────────────────────────────────── */}
      <section
        className="py-16 px-5 bg-background"
        data-ocid="brand_kit.savings.section"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              What you replace
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              What {businessName} Saves Every Month
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Every tool you'd normally pay separately — all included in one
              app.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border overflow-hidden"
            style={{ background: "oklch(0.16 0.016 280)" }}
            data-ocid="brand_kit.savings.table"
          >
            {/* Header */}
            <div
              className="grid grid-cols-3 px-5 py-3 text-xs font-bold text-muted-foreground border-b border-border"
              style={{ background: "oklch(0.13 0.014 280)" }}
            >
              <span>What BRF Replaces</span>
              <span className="text-center">Market Rate</span>
              <span className="text-right">Your BRF Cost</span>
            </div>

            {SAVINGS_ROWS.map((row, i) => (
              <motion.div
                key={row.role}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="grid grid-cols-3 px-5 py-4 border-b border-border last:border-0 items-center hover:bg-muted/20 transition-colors"
              >
                <span className="text-sm text-foreground font-medium pr-2">
                  {row.role}
                </span>
                <span className="text-sm text-muted-foreground text-center">
                  {row.market}
                </span>
                <div className="flex justify-end">
                  <span className="text-xs font-bold badge-emerald rounded-full px-2 py-0.5">
                    {row.yours}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Total row */}
            <div
              className="grid grid-cols-3 px-5 py-4 items-center border-t-2"
              style={{
                borderColor: nicheColor.primary,
                background: `${nicheColor.primary}10`,
              }}
            >
              <span className="text-sm font-black text-foreground">
                Total Monthly Cost
              </span>
              <span
                className="text-base font-black text-center"
                style={{ color: "#ef4444" }}
              >
                $5,700–$11,900/mo
              </span>
              <div className="flex justify-end">
                <span className="text-sm font-black text-primary">
                  $497/mo*
                </span>
              </div>
            </div>
          </motion.div>

          {/* Savings callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 rounded-2xl border p-6 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.18 155 / 10%), oklch(0.62 0.18 155 / 5%))",
              borderColor: "oklch(0.62 0.18 155 / 30%)",
            }}
            data-ocid="brand_kit.savings.callout"
          >
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">
              Total Monthly Savings
            </p>
            <p className="text-4xl font-black text-emerald-400 mb-1">
              $11,400+
            </p>
            <p className="text-sm text-muted-foreground">
              saved every single month with BRF vs. hiring separately
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-2">
              *Starter plan pricing. See all plans in your trial dashboard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SOCIAL MEDIA PREVIEW ───────────────────────────────────────────── */}
      <section
        className="py-16 px-5"
        style={{ background: "oklch(0.11 0.013 280)" }}
        data-ocid="brand_kit.social.section"
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              30-day social calendar
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Your First Month of Social Media — Ready to Post
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              AI-written, niche-specific posts. Activate to schedule them on
              Facebook, Instagram, and Google Business.
            </p>
          </motion.div>

          <div
            className="grid sm:grid-cols-3 gap-4"
            data-ocid="brand_kit.social.list"
          >
            {samplePosts.slice(0, 3).map((post, i) => {
              const platforms = ["Facebook", "Instagram", "Google Business"];
              const days = ["Monday", "Wednesday", "Friday"];
              return (
                <motion.div
                  key={post.slice(0, 30)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative rounded-xl border border-border overflow-hidden"
                  style={{ background: "oklch(0.16 0.016 280)" }}
                  data-ocid={`brand_kit.social.item.${i + 1}`}
                >
                  <div
                    className="p-4 select-none"
                    style={{ filter: "blur(3px)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: `${nicheColor.primary}30` }}
                      >
                        <span
                          className="text-[10px] font-black"
                          style={{ color: nicheColor.primary }}
                        >
                          B
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {businessName}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          Just now
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                      {post}
                    </p>
                    <div className="mt-3 flex gap-3 text-[10px] text-muted-foreground">
                      <span>👍 Like</span>
                      <span>💬 Comment</span>
                      <span>↗ Share</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm px-2 py-1 text-[9px] text-muted-foreground border border-border">
                    <Globe size={9} />
                    {platforms[i]}
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full border border-border">
                    <Calendar size={9} />
                    {days[i]}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                    <span className="badge-purple text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Zap size={10} /> Unlock in trial
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button
              type="button"
              onClick={() => goToTrial("social_calendar_cta")}
              data-ocid="brand_kit.social.schedule_button"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 290), oklch(0.48 0.22 310))",
              }}
            >
              Schedule All 30 Posts in My Trial →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── VIDEO TESTIMONIALS ─────────────────────────────────────────────── */}
      <section
        className="py-16 px-5 bg-background"
        data-ocid="brand_kit.testimonials.section"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
              Real results
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              What {nicheLabel} Business Owners Are Saying
            </h2>
          </motion.div>

          <div
            className="grid sm:grid-cols-3 gap-4"
            data-ocid="brand_kit.testimonials.list"
          >
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section
        ref={finalCtaRef}
        className="relative py-24 px-5 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.04 285) 0%, oklch(0.1 0.012 280) 100%)",
        }}
        data-ocid="brand_kit.cta.section"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-15 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, oklch(0.58 0.22 290) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-6"
            style={{
              borderColor: isExpiring
                ? "oklch(0.62 0.22 25 / 40%)"
                : "oklch(0.72 0.18 75 / 40%)",
              background: isExpiring
                ? "oklch(0.62 0.22 25 / 10%)"
                : "oklch(0.72 0.18 75 / 10%)",
            }}
          >
            <Clock
              size={14}
              className={isExpiring ? "text-rose-400" : "text-amber-400"}
            />
            <span
              className={`text-sm font-bold ${isExpiring ? "text-rose-400" : "text-amber-400"}`}
            >
              Your app expires in {hoursDisplay}h {minsDisplay}m
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight"
          >
            Your App Is Built.
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 290), oklch(0.72 0.2 200))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Claim It Before It Expires.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/70 text-lg mb-8 leading-relaxed"
          >
            No tech skills needed. No credit card. We set everything up for you.
            <br />
            Cancel anytime, no contracts.
          </motion.p>

          {/* "Already built for you" highlight block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-5 mb-8 text-left"
            data-ocid="brand_kit.cta.built_for_you_panel"
          >
            <p className="text-base font-black text-white mb-1">
              This is already built for you.
            </p>
            <p className="text-sm text-white/65 leading-relaxed">
              Everything you just experienced — the AI agent, the website, the
              social calendar, the CRM — is ready to go live with your name on
              it.
            </p>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => goToTrial("landing_page_final_cta")}
            data-ocid="brand_kit.cta.primary_button"
            className="inline-flex items-center gap-3 rounded-2xl px-10 py-5 text-xl font-black text-white shadow-2xl transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.24 290), oklch(0.52 0.22 310))",
              boxShadow:
                "0 0 50px oklch(0.58 0.22 290 / 40%), 0 8px 30px rgba(0,0,0,0.5)",
            }}
          >
            Activate My Free 7-Day Trial Now →
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-5 text-sm text-white/50"
          >
            We set it up for you — no tech skills needed. Cancel anytime, no
            contracts.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            {[
              "No credit card required",
              "Cancel anytime",
              "7 days free",
              "We set it up for you",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1.5 text-xs text-white/60"
              >
                <Check size={11} className="text-emerald-400" />
                {badge}
              </div>
            ))}
          </motion.div>

          {/* Human fallback */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-8 pt-6 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-3">
              Prefer to talk to someone? Your AI agent is already built — call
              it now.
            </p>
            <button
              type="button"
              onClick={handleVoiceOpen}
              data-ocid="brand_kit.cta.voice_agent_button"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 px-5 py-2.5 text-sm font-semibold text-primary transition-all"
            >
              <PhoneCall size={16} className="animate-pulse" />
              Hear Your AI Agent Now →
            </button>
          </motion.div>

          <p className="mt-6 text-xs text-white/30">
            Generated for{" "}
            <strong className="text-white/40">{businessName}</strong> on{" "}
            {formattedDate}
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer
        className="bg-card border-t border-border py-5 px-5 text-center"
        data-ocid="brand_kit.footer"
      >
        <p className="text-xs text-muted-foreground">
          Powered by BRF &nbsp;•&nbsp;
          <span className="cursor-default" title="Coming Soon">
            Privacy Policy
          </span>
          &nbsp;•&nbsp;
          <span className="cursor-default" title="Coming Soon">
            Terms
          </span>
          &nbsp;•&nbsp; © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      {/* ── VOICE AGENT MODAL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showVoiceModal && (
          <VoiceAgentModal
            prospect={prospect}
            onClose={() => setShowVoiceModal(false)}
            onActivate={handleVoiceActivate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
