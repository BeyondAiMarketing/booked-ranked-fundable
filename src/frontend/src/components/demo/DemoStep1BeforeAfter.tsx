import { getDemoContent } from "@/data/demoContentByNiche";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { SessionData } from "@/hooks/useDemoFlow";

interface Props {
  onNext: () => void;
  onPrev: () => void;
  sessionData: SessionData;
}

export default function DemoStep1BeforeAfter({ onNext, sessionData }: Props) {
  const { sessionData: flowData } = useDemoFlow();
  const nicheContent = getDemoContent(flowData.niche || sessionData.niche);
  const painPoints = nicheContent.beforePainPoints ?? [];
  const solutions = nicheContent.afterPromises ?? [];
  const coachTip =
    nicheContent.coachTips?.beforeAfter ??
    "This is the gap between where you are and where BRF takes you — every missed call is lost revenue.";
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-red-900/30 border border-red-700/30 text-red-300 text-xs font-semibold uppercase tracking-widest mb-4">
          The Reality
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          Right Now,{" "}
          <span className="text-red-400">
            {sessionData.businessName || "Your Business"}
          </span>{" "}
          is Leaving Money on the Table Every Single Day
        </h2>
        <p className="text-gray-400 mt-3 text-sm">
          But it doesn't have to stay that way.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {/* Before */}
        <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-red-400 font-bold text-sm uppercase tracking-wide">
              Without BRF
            </span>
          </div>
          <ul className="space-y-3">
            {painPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm">
                <span className="text-red-500 mt-0.5 shrink-0 text-base">
                  ✗
                </span>
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* After */}
        <div className="bg-gray-900 border border-purple-700/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-purple-400 font-bold text-sm uppercase tracking-wide">
              With BRF
            </span>
          </div>
          <ul className="space-y-3">
            {solutions.map((solution) => (
              <li key={solution} className="flex items-start gap-3 text-sm">
                <span className="text-purple-400 mt-0.5 shrink-0 text-base">
                  ✓
                </span>
                <span className="text-gray-200">{solution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Coach tip */}
      <div className="mb-4 px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-700/30 text-purple-300 text-sm">
        💡 {coachTip}
      </div>

      <p className="text-center text-gray-400 text-sm mb-6">
        Let's show you exactly how it works for{" "}
        <span className="text-white font-semibold">
          {sessionData.businessName || "your business"}
        </span>{" "}
        in {sessionData.city || "your city"}.
      </p>

      <button
        data-ocid="demo.step1.next_button"
        type="button"
        onClick={onNext}
        className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        Show Me How It Works →
      </button>
    </div>
  );
}
