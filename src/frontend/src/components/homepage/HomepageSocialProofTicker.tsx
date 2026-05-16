import { HOMEPAGE_NICHE_LIST } from "@/data/homepageNicheData";

interface TickerEntry {
  businessName: string;
  achievement: string;
  icon: string;
}

// All 10 niches each contribute their socialProofEntry
const ALL_ENTRIES: TickerEntry[] = HOMEPAGE_NICHE_LIST.map((n) => ({
  businessName: n.socialProofEntry?.businessName ?? n.testimonialBusiness,
  achievement: n.socialProofEntry?.achievement ?? n.testimonialResult,
  icon: n.icon,
}));

// Extra entries that span multiple niches for variety
const EXTRA_ENTRIES: TickerEntry[] = [
  {
    businessName: "Blue Ridge HVAC",
    achievement: "18 emergency calls handled overnight",
    icon: "❄️",
  },
  {
    businessName: "Coastal Dental",
    achievement: "200 lapsed patients recalled this quarter",
    icon: "🦷",
  },
  {
    businessName: "Pinnacle Roofing",
    achievement: "$190K in storm jobs from one campaign",
    icon: "🏗️",
  },
  {
    businessName: "Serenity Med Spa",
    achievement: "No-shows down 65% in 30 days",
    icon: "✨",
  },
  {
    businessName: "TrueFlow Plumbing",
    achievement: "Went from 14 to 87 reviews in 90 days",
    icon: "🔧",
  },
  {
    businessName: "ReNew Restoration",
    achievement: "$4K/mo saved on after-hours staffing",
    icon: "🏠",
  },
  {
    businessName: "Diamond Carpets",
    achievement: "47 reactivated customers in 30 days",
    icon: "🧹",
  },
  {
    businessName: "Summit Mortgage",
    achievement: "Closing 22 days faster than market avg",
    icon: "📊",
  },
  {
    businessName: "Align Chiro",
    achievement: "38 dormant patients reactivated free",
    icon: "💆",
  },
  {
    businessName: "First Call Realty",
    achievement: "3 extra closings in the first month",
    icon: "🏡",
  },
];

const FULL_TICKER = [...ALL_ENTRIES, ...EXTRA_ENTRIES];

function TickerItem({ entry }: { entry: TickerEntry }) {
  return (
    <span className="inline-flex items-center gap-2 mx-6 shrink-0">
      <span className="text-base" aria-hidden="true">
        {entry.icon}
      </span>
      <span className="font-bold text-white">{entry.businessName}</span>
      <span className="text-slate-400">—</span>
      <span className="text-slate-300">{entry.achievement}</span>
      <span className="text-purple-500 mx-2" aria-hidden="true">
        •
      </span>
    </span>
  );
}

interface HomepageSocialProofTickerProps {
  activeNiche?: string | null;
}

export function HomepageSocialProofTicker({
  activeNiche,
}: HomepageSocialProofTickerProps) {
  // When a niche is active, bubble that niche's entry to the front.
  // When NO niche is selected (null/undefined), show all entries equally —
  // never show only plumbing entries.
  const activeNicheData = activeNiche
    ? HOMEPAGE_NICHE_LIST.find((n) => n.id === activeNiche)
    : null;

  const activeBusinessName = activeNicheData
    ? (activeNicheData.socialProofEntry?.businessName ??
      activeNicheData.testimonialBusiness)
    : null;

  const entries = activeBusinessName
    ? [
        ...FULL_TICKER.filter((e) => e.businessName === activeBusinessName),
        ...FULL_TICKER.filter((e) => e.businessName !== activeBusinessName),
      ]
    : FULL_TICKER; // neutral: all niches equally, in natural order

  // Duplicate for seamless loop
  const looped = [...entries, ...entries];

  return (
    <div
      data-ocid="homepage.social_proof_ticker"
      className="relative overflow-hidden py-3"
      style={{
        background: "rgba(6, 4, 18, 0.85)",
        borderTop: "1px solid rgba(139,92,246,0.2)",
        borderBottom: "1px solid rgba(139,92,246,0.2)",
      }}
    >
      {/* Gradient fades */}
      <div
        className="absolute inset-y-0 left-0 z-10 w-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,4,18,1) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 z-10 w-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(270deg, rgba(6,4,18,1) 0%, transparent 100%)",
        }}
      />

      {/* Ticker track */}
      <div
        className="flex whitespace-nowrap text-sm"
        style={{ animation: "tickerScroll 55s linear infinite" }}
      >
        {looped.map((entry, i) => (
          <TickerItem
            key={`${entry.businessName}-${String(i)}`}
            entry={entry}
          />
        ))}
      </div>

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
