import type { SessionData } from "@/hooks/useDemoFlow";

const OLD_TOOLS = [
  { name: "Google Reviews tool", cost: "$49/mo" },
  { name: "CRM software", cost: "$79/mo" },
  { name: "Social scheduler", cost: "$39/mo" },
  { name: "Call answering service", cost: "$199/mo" },
  { name: "Booking system", cost: "$29/mo" },
  { name: "Email marketing tool", cost: "$59/mo" },
  { name: "Credit monitoring", cost: "$25/mo" },
  { name: "SEO tool", cost: "$99/mo" },
];

const BRF_FEATURES = [
  "AI Voice & Chat Receptionist",
  "Full CRM & Lead Pipeline",
  "Social Media Autopilot",
  "Automated Review Engine",
  "Smart Booking Calendar",
  "Email & SMS Campaigns",
  "Business Credit Builder",
  "SEO & Reputation Dashboard",
];

interface Props {
  onNext: () => void;
  onPrev: () => void;
  sessionData: SessionData;
}

export default function DemoStep5OneApp({ onNext }: Props) {
  const totalOld = OLD_TOOLS.reduce((sum, t) => {
    return sum + Number.parseInt(t.cost.replace(/[^0-9]/g, ""));
  }, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/40 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-4">
          One App
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          One App Replaces All of This
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Stop paying for 8 tools that don't talk to each other.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Old tools */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">
            What You're Paying Now
          </p>
          <ul className="space-y-2">
            {OLD_TOOLS.map((tool) => (
              <li
                key={tool.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-400 line-through">{tool.name}</span>
                <span className="text-red-400 text-xs font-medium">
                  {tool.cost}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">Total</span>
            <span className="text-red-400 font-bold">${totalOld}/mo</span>
          </div>
        </div>

        {/* BRF */}
        <div className="bg-gradient-to-b from-purple-950/60 to-indigo-950/60 border border-purple-700/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
              B
            </div>
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-wide">
              BRF Does It All
            </p>
          </div>
          <ul className="space-y-2">
            {BRF_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <span className="text-purple-400 shrink-0">✓</span>
                <span className="text-gray-200">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-purple-800/40">
            <p className="text-purple-300 font-bold text-lg">
              One price. Everything included.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center mb-8">
        <p className="text-gray-400 text-sm">
          Most clients save{" "}
          <span className="text-green-400 font-bold">${totalOld - 197}/mo</span>{" "}
          by switching to BRF. That's{" "}
          <span className="text-green-400 font-bold">
            ${(totalOld - 197) * 12}/year
          </span>{" "}
          back in your pocket.
        </p>
      </div>

      <button
        data-ocid="demo.step5.next_button"
        type="button"
        onClick={onNext}
        className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        Next: See Your Command Center →
      </button>
    </div>
  );
}
