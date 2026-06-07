import { getDemoContent } from "@/data/demoContentByNiche";
import { useDemoFlow } from "@/hooks/useDemoFlow";
import type { SessionData } from "@/hooks/useDemoFlow";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLATFORM_COLORS: Record<string, string> = {
  Facebook: "text-blue-400",
  Instagram: "text-pink-400",
  LinkedIn: "text-sky-400",
  Google: "text-yellow-400",
  Twitter: "text-cyan-400",
};

const PLATFORM_ABBR: Record<string, string> = {
  Facebook: "FB",
  Instagram: "IG",
  LinkedIn: "LI",
  Google: "G+",
  Twitter: "TW",
};

interface Props {
  onNext: () => void;
  onPrev: () => void;
  sessionData: SessionData;
}

export default function DemoStep3Social({ onNext, sessionData }: Props) {
  const businessName = sessionData.businessName || "Your Business";
  const { sessionData: flowSession } = useDemoFlow();
  const niche = flowSession?.niche ?? sessionData.niche ?? "General";
  const nicheContent = getDemoContent(niche);
  const posts = nicheContent.socialPosts;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="text-center mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-pink-900/30 border border-pink-700/40 text-pink-300 text-xs font-semibold uppercase tracking-widest mb-4">
          Social Media Autopilot
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Your AI Creates & Posts Content — Every Single Day
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          This week's content calendar for{" "}
          <span className="text-white font-semibold">{businessName}</span> is
          already written and scheduled.
        </p>
      </div>

      {/* 7-day calendar */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {DAYS.map((day, idx) => {
          const post = posts[idx % posts.length];
          const platformColor =
            PLATFORM_COLORS[post.platform] ?? "text-purple-400";
          const platformAbbr =
            PLATFORM_ABBR[post.platform] ??
            post.platform.slice(0, 2).toUpperCase();
          return (
            <div
              key={day}
              className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-start gap-3"
            >
              <div className="shrink-0 w-10 text-center">
                <p className="text-gray-500 text-xs font-medium">{day}</p>
                <p className={`font-bold text-sm ${platformColor}`}>
                  {platformAbbr}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {post.content}
                </p>
                {post.hashtags.length > 0 && (
                  <p className="text-purple-400/70 text-xs mt-1 truncate">
                    {post.hashtags.slice(0, 3).join(" ")}
                  </p>
                )}
                <div className="flex gap-3 mt-1">
                  <span className="text-gray-500 text-xs">❤️ {post.likes}</span>
                  <span className="text-gray-500 text-xs">
                    💬 {post.comments}
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-block px-2 py-0.5 rounded-full bg-green-900/40 border border-green-700/40 text-green-400 text-xs">
                  Scheduled
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { stat: "7", label: "Posts this week" },
          { stat: "3", label: "Platforms" },
          { stat: "0", label: "Hours of your time" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center"
          >
            <p className="text-2xl font-bold text-purple-400">{item.stat}</p>
            <p className="text-gray-400 text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <button
        data-ocid="demo.step3.next_button"
        type="button"
        onClick={onNext}
        className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
      >
        Next: Calendar Booking →
      </button>

      {/* Coach tip — fixed bottom banner, never covers content */}
      <div
        data-ocid="demo.step3.coach_tip"
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none"
      >
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <div className="bg-indigo-950/95 border border-indigo-700/50 rounded-xl px-4 py-3 flex items-start gap-2 shadow-lg backdrop-blur-sm">
            <span className="text-indigo-400 text-base shrink-0 mt-0.5">
              💡
            </span>
            <p className="text-indigo-200 text-xs leading-relaxed">
              {nicheContent.coachTips.social}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
