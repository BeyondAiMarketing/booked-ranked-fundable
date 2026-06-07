import { getDemoContent } from "@/data/demoContentByNiche";
import { useDemoFlow } from "@/hooks/useDemoFlow";

const MILESTONES = [
  { label: "Business Entity", done: true },
  { label: "EIN Registered", done: true },
  { label: "Net-30 Vendors", done: true },
  { label: "Business Bank Account", done: false },
  { label: "Credit Line", done: false },
];

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export default function DemoStep7Credit({ onNext }: Props) {
  const { sessionData } = useDemoFlow();
  const nicheContent = getDemoContent(sessionData.niche);
  const businessName = sessionData.businessName || "Your Business";

  const fundabilityScore = nicheContent?.creditContext?.fundabilityScore ?? 82;
  const businessType =
    nicheContent?.creditContext?.businessType ?? "Local Business";
  const avgRevenue = nicheContent?.creditContext?.avgRevenue ?? "$25,000/mo";
  const vendorRecs = nicheContent?.creditContext?.vendorRecommendations ?? [
    "SBA Microloan",
    "Business Line of Credit",
    "Vendor Net-30",
  ];
  const revenueStats = nicheContent?.revenueStats;
  const creditTip =
    nicheContent?.coachTips?.credit ??
    "Fundability turns your business into a credit-worthy entity — vendor lines, business credit cards, and financing all become accessible.";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/50 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-4">
          Business Credit Builder
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Build Real Business Credit & Unlock Funding
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          BRF guides every step. Most businesses qualify within 90 days.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-300 text-sm font-medium">
            Fundability Score for {businessName}
          </span>
          <span className="text-purple-300 font-bold text-sm">
            {fundabilityScore} / 100
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-3">
          {businessType} · Avg Revenue: {avgRevenue}
        </p>
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
            style={{
              width: `${fundabilityScore}%`,
              animation: "fundability-grow 2s ease-out forwards",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-500 text-xs">Starting point</span>
          <span className="text-purple-400 text-xs font-semibold">
            {fundabilityScore >= 75
              ? "Excellent \u2014 Funding Ready!"
              : fundabilityScore >= 50
                ? "Good \u2014 Building Fast"
                : "Getting Started \u2014 90 Days to Ready"}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {MILESTONES.map((m) => (
            <span
              key={m.label}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                m.done
                  ? "bg-green-900/40 border-green-700/50 text-green-300"
                  : "bg-gray-800 border-gray-700 text-gray-500"
              }`}
            >
              {m.done ? "\u2713" : "\u25cb"} {m.label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">
          Recommended Vendor Credit Sources
        </p>
        <div className="space-y-3">
          {vendorRecs.map((rec, idx) => (
            <div key={rec} className="flex items-center justify-between">
              <p className="text-white text-sm font-medium">{rec}</p>
              <div className="text-right">
                <span
                  className={`text-xs ${
                    idx === 0 ? "text-green-400" : "text-purple-400"
                  }`}
                >
                  {idx === 0 ? "Ready Now" : "Eligible"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-600/50 rounded-2xl p-5 text-center mb-6">
        <p className="text-purple-200 text-base font-semibold">
          {businessName} could qualify for business credit within{" "}
          <span className="text-purple-300 font-bold">90 days</span>
        </p>
        {revenueStats && (
          <p className="text-gray-300 text-sm mt-2">
            {revenueStats.leadsPerMonth} leads/mo · $
            {revenueStats.avgJobValue.toLocaleString()} avg job value ·{" "}
            {revenueStats.description}
          </p>
        )}
        <p className="text-gray-400 text-xs mt-2">
          BRF walks you through every step \u2014 no guessing, no expensive
          advisors.
        </p>
      </div>

      {/* Niche-specific coach tip banner */}
      <div className="fixed bottom-24 left-0 right-0 px-4 z-40">
        <div className="max-w-2xl mx-auto">
          <div className="bg-purple-900 border border-purple-600/60 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-purple-900/40">
            <span className="text-purple-300 text-lg">💡</span>
            <p className="text-purple-100 text-sm font-medium">{creditTip}</p>
          </div>
        </div>
      </div>

      <button
        data-ocid="demo.step7.next_button"
        type="button"
        onClick={onNext}
        className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        Claim My Free 7-Day Trial \u2192
      </button>
    </div>
  );
}
