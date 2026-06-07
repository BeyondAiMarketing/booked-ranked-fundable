import { getDemoContent } from "@/data/demoContentByNiche";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { SessionData } from "@/hooks/useDemoFlow";

interface Props {
  onNext: () => void;
  onPrev: () => void;
  sessionData: SessionData;
}

export default function DemoStep4Calendar({ onNext, sessionData }: Props) {
  const { sessionData: flowData } = useDemoFlow();
  const nicheContent = getDemoContent(flowData.niche || sessionData.niche);
  const appointments = nicheContent.appointmentTypes ?? [];
  const coachTip =
    nicheContent.coachTips?.calendar ??
    "Your calendar fills automatically while you sleep — no manual scheduling required.";
  const businessName = sessionData.businessName || "Your Business";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-green-900/30 border border-green-700/40 text-green-300 text-xs font-semibold uppercase tracking-widest mb-4">
          Auto-Booking
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Appointments Book Themselves While You Sleep
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Your calendar for {sessionData.city || "your city"} tomorrow — booked
          overnight by your AI without you lifting a finger.
        </p>
      </div>

      {/* Calendar header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 px-4 py-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm">{businessName}</h3>
            <span className="text-purple-300 text-xs">
              Tomorrow · {appointments.length} Jobs Booked
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-800">
          {appointments.map((apt, idx) => (
            <div
              key={`${apt.time}-${idx}`}
              className="flex items-center gap-4 px-4 py-3"
            >
              <div className="shrink-0 w-16 text-right">
                <span className="text-purple-400 text-xs font-semibold">
                  {apt.time}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">
                  {apt.service || apt.name}
                </p>
                <p className="text-gray-400 text-xs">{apt.leadName}</p>
              </div>
              <div className="shrink-0">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/40 text-green-400 border border-green-700/40">
                  Confirmed
                </span>
              </div>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              Appointments will appear here once booked.
            </div>
          )}
        </div>
      </div>

      {/* Coach tip */}
      <div className="mb-4 px-4 py-3 rounded-xl bg-purple-900/20 border border-purple-700/30 text-purple-300 text-sm">
        💡 {coachTip}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          {
            stat: nicheContent.revenueStats
              ? `${(nicheContent.revenueStats.avgJobValue * appointments.length).toLocaleString()}`
              : "$2,840",
            label: "Revenue booked",
          },
          { stat: String(appointments.length || 4), label: "Jobs confirmed" },
          { stat: "0", label: "Phone calls made" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center"
          >
            <p className="text-xl font-bold text-green-400">{item.stat}</p>
            <p className="text-gray-400 text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <button
        data-ocid="demo.step4.next_button"
        type="button"
        onClick={onNext}
        className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        Next: See the Full Platform →
      </button>
    </div>
  );
}
